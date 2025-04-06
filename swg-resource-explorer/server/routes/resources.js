const express = require('express');
const path = require('path');
const { parseResourcesXml, extractResourceCategories } = require('../utils/xmlParser');

const router = express.Router();

// Cache for resources data to avoid parsing the XML file on every request
let resourcesCache = null;
let categoriesCache = null;
let lastUpdated = null;

// Path to the XML file
const XML_FILE_PATH = path.resolve(__dirname, '../../../currentresources_168.xml');

// Cache expiration time in milliseconds (1 hour)
const CACHE_EXPIRATION = 60 * 60 * 1000;

/**
 * Check if cache is valid
 * @returns {boolean} - True if cache is valid, false otherwise
 */
const isCacheValid = () => {
  return (
    resourcesCache !== null &&
    lastUpdated !== null &&
    Date.now() - lastUpdated < CACHE_EXPIRATION
  );
};

/**
 * Load resources data from XML file and update cache
 * @returns {Promise<Array>} - Array of resource objects
 */
const loadResources = async () => {
  try {
    if (isCacheValid()) {
      return resourcesCache;
    }

    console.log('Loading resources from XML file...');
    const resources = await parseResourcesXml(XML_FILE_PATH);
    
    // Update cache
    resourcesCache = resources;
    categoriesCache = extractResourceCategories(resources);
    lastUpdated = Date.now();
    
    console.log(`Loaded ${resources.length} resources`);
    return resources;
  } catch (error) {
    console.error('Error loading resources:', error);
    throw error;
  }
};

// Get all resources
router.get('/', async (req, res) => {
  try {
    const resources = await loadResources();
    
    // Apply filters if provided
    let filteredResources = [...resources];
    
    // Filter by name
    if (req.query.name) {
      const nameFilter = req.query.name.toLowerCase();
      filteredResources = filteredResources.filter(resource => 
        resource.name.toLowerCase().includes(nameFilter)
      );
    }
    
    // Filter by type
    if (req.query.type) {
      const typeFilter = req.query.type.toLowerCase();
      filteredResources = filteredResources.filter(resource => 
        resource.type.toLowerCase().includes(typeFilter)
      );
    }
    
    // Filter by planet
    if (req.query.planet) {
      const planetFilter = req.query.planet;
      filteredResources = filteredResources.filter(resource => 
        resource.planets.some(planet => 
          planet.toLowerCase() === planetFilter.toLowerCase()
        )
      );
    }
    
    // Filter by stats
    const statFilters = ['dr', 'ma', 'oq', 'sr', 'ut', 'fl', 'pe'];
    statFilters.forEach(stat => {
      const minStat = req.query[`min_${stat}`];
      const maxStat = req.query[`max_${stat}`];
      
      if (minStat !== undefined) {
        filteredResources = filteredResources.filter(resource => 
          resource.stats[stat] !== undefined && 
          resource.stats[stat] >= parseInt(minStat, 10)
        );
      }
      
      if (maxStat !== undefined) {
        filteredResources = filteredResources.filter(resource => 
          resource.stats[stat] !== undefined && 
          resource.stats[stat] <= parseInt(maxStat, 10)
        );
      }
    });
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedResources = filteredResources.slice(startIndex, endIndex);
    
    res.json({
      total: filteredResources.length,
      page,
      limit,
      resources: paginatedResources,
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Get resource categories
router.get('/categories', async (req, res) => {
  try {
    await loadResources(); // Ensure cache is loaded
    res.json(categoriesCache);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get resource by ID
router.get('/:id', async (req, res) => {
  try {
    const resources = await loadResources();
    const resource = resources.find(r => r.id === parseInt(req.params.id, 10));
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    res.json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({ error: 'Failed to fetch resource' });
  }
});

module.exports = router;
