const fs = require('fs');
const { XMLParser } = require('fast-xml-parser');
const path = require('path');

// Configure XML parser options
const parserOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: '_',
  allowBooleanAttributes: true,
  parseAttributeValue: true,
  trimValues: true,
};

// Create parser instance
const parser = new XMLParser(parserOptions);

/**
 * Parse the XML file and return the resources data
 * @param {string} filePath - Path to the XML file
 * @returns {Promise<Array>} - Array of resource objects
 */
const parseResourcesXml = async (filePath) => {
  try {
    // Use stream reading for large files
    const xmlData = fs.readFileSync(filePath, 'utf8');
    const parsedData = parser.parse(xmlData);
    
    // Extract resources array from the parsed data
    const resources = parsedData.resource_data.resources.resource;
    
    // Process resources to normalize data structure
    return resources.map(resource => {
      // Ensure stats is an object with all possible stats
      const stats = {};
      if (resource.stats) {
        Object.entries(resource.stats).forEach(([key, value]) => {
          stats[key] = parseInt(value, 10);
        });
      }
      
      // Ensure planets is an array
      let planets = [];
      if (resource.planets && resource.planets.planet) {
        // Handle both single planet and multiple planets
        planets = Array.isArray(resource.planets.planet) 
          ? resource.planets.planet.map(p => p.name) 
          : [resource.planets.planet.name];
      }
      
      return {
        id: resource._swgaide_id,
        name: resource.name,
        type: resource.type,
        typeId: resource.swgaide_type_id,
        stats,
        planets,
        availableTimestamp: parseInt(resource.available_timestamp, 10),
        availableBy: resource.available_by,
      };
    });
  } catch (error) {
    console.error('Error parsing XML file:', error);
    throw error;
  }
};

/**
 * Stream parse the XML file for large files
 * @param {string} filePath - Path to the XML file
 * @param {Function} callback - Callback function to process chunks of resources
 */
const streamParseResourcesXml = (filePath, callback) => {
  // Implementation for streaming large XML files
  // This would be used for very large files where loading the entire file
  // into memory is not feasible
  
  // For now, we'll use the synchronous version and simulate chunking
  try {
    const resources = parseResourcesXml(filePath);
    
    // Process in chunks of 100
    const chunkSize = 100;
    for (let i = 0; i < resources.length; i += chunkSize) {
      const chunk = resources.slice(i, i + chunkSize);
      callback(chunk, i === 0);
    }
    
    return true;
  } catch (error) {
    console.error('Error stream parsing XML file:', error);
    throw error;
  }
};

/**
 * Get unique resource categories from resources
 * @param {Array} resources - Array of resource objects
 * @returns {Object} - Object with category mappings
 */
const extractResourceCategories = (resources) => {
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
};

module.exports = {
  parseResourcesXml,
  streamParseResourcesXml,
  extractResourceCategories,
};
