/**
 * Resource Routes
 * 
 * API endpoints for accessing resource data from the database
 */

const express = require('express');
const { Op } = require('sequelize');
const db = require('../database/models');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * Validate query parameters
 * @param {Object} query - Query parameters
 * @returns {Object} - Validated query parameters
 */
function validateQuery(query) {
  // Default values
  const validatedQuery = {
    page: parseInt(query.page, 10) || 1,
    limit: parseInt(query.limit, 10) || 50
  };
  
  // Name filter
  if (query.name) {
    validatedQuery.name = {
      [Op.like]: `%${query.name}%`
    };
  }
  
  // Type filter
  if (query.type) {
    validatedQuery.type = {
      [Op.like]: `%${query.type}%`
    };
  }
  
  // Stat filters
  const statFilters = [];
  const statNames = ['dr', 'ma', 'oq', 'sr', 'ut', 'fl', 'pe'];
  
  statNames.forEach(stat => {
    const minStat = query[`min_${stat}`];
    const maxStat = query[`max_${stat}`];
    
    if (minStat !== undefined) {
      const minValue = parseInt(minStat, 10);
      if (!isNaN(minValue)) {
        statFilters.push({
          name: stat,
          value: { [Op.gte]: minValue }
        });
      }
    }
    
    if (maxStat !== undefined) {
      const maxValue = parseInt(maxStat, 10);
      if (!isNaN(maxValue)) {
        statFilters.push({
          name: stat,
          value: { [Op.lte]: maxValue }
        });
      }
    }
  });
  
  validatedQuery.statFilters = statFilters;
  
  // Planet filter
  if (query.planet) {
    validatedQuery.planet = query.planet;
  }
  
  return validatedQuery;
}

/**
 * Format resource for API response
 * @param {Object} resource - Resource model with associations
 * @returns {Object} - Formatted resource
 */
function formatResource(resource) {
  const stats = {};
  if (resource.stats && resource.stats.length > 0) {
    resource.stats.forEach(stat => {
      stats[stat.name] = stat.value;
    });
  }
  
  const planets = [];
  if (resource.planets && resource.planets.length > 0) {
    resource.planets.forEach(planet => {
      planets.push(planet.name);
    });
  }
  
  return {
    id: resource.id,
    name: resource.name,
    type: resource.type,
    typeId: resource.typeId,
    availableTimestamp: resource.availableTimestamp,
    availableBy: resource.availableBy,
    stats,
    planets
  };
}

/**
 * Extract resource categories from resources
 * @param {Array<Object>} resources - Resources
 * @returns {Object} - Categories and planet types
 */
function extractResourceCategories(resources) {
  const categories = {};
  const planetTypes = {};
  
  resources.forEach(resource => {
    // Extract base type (e.g., "Bristley Hide" from "Rori Bristley Hide")
    const fullType = resource.type;
    const parts = fullType.split(' ');
    
    // Assume first word is planet-specific prefix
    const planetPrefix = parts[0];
    const baseType = parts.slice(1).join(' ');
    
    // Group by base type
    if (!categories[baseType]) {
      categories[baseType] = [];
    }
    
    if (!categories[baseType].includes(fullType)) {
      categories[baseType].push(fullType);
    }
    
    // Track planet-specific types
    if (!planetTypes[planetPrefix]) {
      planetTypes[planetPrefix] = [];
    }
    
    if (!planetTypes[planetPrefix].includes(baseType)) {
      planetTypes[planetPrefix].push(baseType);
    }
  });
  
  return { categories, planetTypes };
}

// Get all resources with filtering
router.get('/', async (req, res) => {
  try {
    // Validate query parameters
    const validatedQuery = validateQuery(req.query);
    const { page, limit, name, type, statFilters, planet } = validatedQuery;
    
    // Calculate offset
    const offset = (page - 1) * limit;
    
    // Build query
    const query = {
      where: {},
      include: [],
      distinct: true,
      limit,
      offset,
      order: [['availableTimestamp', 'DESC']]
    };
    
    // Add name filter
    if (name) {
      query.where.name = name;
    }
    
    // Add type filter
    if (type) {
      query.where.type = type;
    }
    
    // Add planet filter
    if (planet) {
      query.include.push({
        model: db.ResourcePlanet,
        as: 'planets',
        where: {
          name: planet
        },
        required: true
      });
    } else {
      query.include.push({
        model: db.ResourcePlanet,
        as: 'planets'
      });
    }
    
    // Add stat filters
    if (statFilters.length > 0) {
      statFilters.forEach(filter => {
        query.include.push({
          model: db.ResourceStat,
          as: 'stats',
          where: {
            name: filter.name,
            value: filter.value
          },
          required: true
        });
      });
    }
    
    // Always include stats
    const statsInclude = {
      model: db.ResourceStat,
      as: 'stats'
    };
    
    // Don't duplicate stats include if we already have stat filters
    if (statFilters.length === 0) {
      query.include.push(statsInclude);
    }
    
    // Execute query
    const result = await db.Resource.findAndCountAll(query);
    
    // Format response
    const formattedResources = result.rows.map(formatResource);
    
    res.json({
      total: result.count,
      page,
      limit,
      resources: formattedResources
    });
  } catch (error) {
    logger.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Get resource categories
router.get('/categories', async (req, res) => {
  try {
    // Fetch all resources
    const resources = await db.Resource.findAll({
      attributes: ['id', 'type'],
      order: [['type', 'ASC']]
    });
    
    // Process resources to get categories
    const formattedResources = resources.map(resource => ({
      id: resource.id,
      type: resource.type
    }));
    
    const categories = extractResourceCategories(formattedResources);
    
    res.json(categories);
  } catch (error) {
    logger.error('Error fetching resource categories:', error);
    res.status(500).json({ error: 'Failed to fetch resource categories' });
  }
});

// Get resource by ID
router.get('/:id', async (req, res) => {
  try {
    const resourceId = parseInt(req.params.id, 10);
    
    if (isNaN(resourceId)) {
      return res.status(400).json({ error: 'Invalid resource ID' });
    }
    
    // Fetch resource with associations
    const resource = await db.Resource.findByPk(resourceId, {
      include: [
        { model: db.ResourceStat, as: 'stats' },
        { model: db.ResourcePlanet, as: 'planets' }
      ]
    });
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    // Format resource
    const formattedResource = formatResource(resource);
    
    res.json(formattedResource);
  } catch (error) {
    logger.error('Error fetching resource:', error);
    res.status(500).json({ error: 'Failed to fetch resource' });
  }
});

// Get resource stats summary
router.get('/stats/summary', async (req, res) => {
  try {
    // Get stat ranges and averages
    const ranges = await db.ResourceStat.getStatRanges();
    const averages = await db.ResourceStat.getStatAverages();
    
    // Get counts by type
    const typeCount = await db.Resource.count({
      attributes: ['type'],
      group: ['type'],
      order: [['type', 'ASC']]
    });
    
    const typeCountMap = {};
    typeCount.forEach(item => {
      typeCountMap[item.type] = item.count;
    });
    
    res.json({
      statRanges: ranges,
      statAverages: averages,
      typeCounts: typeCountMap
    });
  } catch (error) {
    logger.error('Error fetching resource stats summary:', error);
    res.status(500).json({ error: 'Failed to fetch resource stats summary' });
  }
});

// Search resources by name or type (for autocomplete)
router.get('/search/autocomplete', async (req, res) => {
  try {
    const { term, limit = 10 } = req.query;
    
    if (!term) {
      return res.status(400).json({ error: 'Search term is required' });
    }
    
    // Search by name or type
    const resources = await db.Resource.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${term}%` } },
          { type: { [Op.like]: `%${term}%` } }
        ]
      },
      limit: parseInt(limit, 10),
      order: [['name', 'ASC']]
    });
    
    // Format response
    const suggestions = resources.map(resource => ({
      id: resource.id,
      name: resource.name,
      type: resource.type,
      value: resource.name // For autocomplete compatibility
    }));
    
    res.json(suggestions);
  } catch (error) {
    logger.error('Error searching resources:', error);
    res.status(500).json({ error: 'Failed to search resources' });
  }
});

module.exports = router;