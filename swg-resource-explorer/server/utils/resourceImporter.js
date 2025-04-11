const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');
const db = require('../database/models');

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
 * Import resources from XML file to database
 * @param {string} filePath - Path to XML file
 */
async function importResources(filePath) {
  try {
    console.log('Starting resource import from XML...');
    const xmlData = fs.readFileSync(filePath, 'utf8');
    const parsedData = parser.parse(xmlData);
    
    // Extract resources array
    const resources = parsedData.resource_data.resources.resource;
    
    // Use transaction for data integrity
    const transaction = await db.sequelize.transaction();
    
    try {
      console.log(`Processing ${resources.length} resources...`);
      let importedCount = 0;
      
      for (const resource of resources) {
        // Create or update resource
        const [resourceRecord, created] = await db.Resource.findOrCreate({
          where: { id: resource._swgaide_id },
          defaults: {
            name: resource.name,
            type: resource.type,
            typeId: resource.swgaide_type_id,
            availableTimestamp: parseInt(resource.available_timestamp, 10),
            availableBy: resource.available_by || null
          },
          transaction
        });
        
        if (!created) {
          // Update existing record
          await resourceRecord.update({
            name: resource.name,
            type: resource.type,
            typeId: resource.swgaide_type_id,
            availableTimestamp: parseInt(resource.available_timestamp, 10),
            availableBy: resource.available_by || null
          }, { transaction });
        }
        
        // Delete existing stats and planets for update
        await db.ResourceStat.destroy({
          where: { resourceId: resourceRecord.id },
          transaction
        });
        
        await db.ResourcePlanet.destroy({
          where: { resourceId: resourceRecord.id },
          transaction
        });
        
        // Add stats
        if (resource.stats) {
          const stats = [];
          Object.entries(resource.stats).forEach(([key, value]) => {
            stats.push({
              resourceId: resourceRecord.id,
              name: key,
              value: parseInt(value, 10)
            });
          });
          
          if (stats.length > 0) {
            await db.ResourceStat.bulkCreate(stats, { transaction });
          }
        }
        
        // Add planets
        if (resource.planets && resource.planets.planet) {
          const planets = [];
          const planetArray = Array.isArray(resource.planets.planet) 
            ? resource.planets.planet 
            : [resource.planets.planet];
          
          planetArray.forEach(planet => {
            planets.push({
              resourceId: resourceRecord.id,
              name: planet.name
            });
          });
          
          if (planets.length > 0) {
            await db.ResourcePlanet.bulkCreate(planets, { transaction });
          }
        }
        
        importedCount++;
        if (importedCount % 100 === 0) {
          console.log(`Imported ${importedCount} resources...`);
        }
      }
      
      // Commit transaction
      await transaction.commit();
      console.log(`Successfully imported ${importedCount} resources`);
      return importedCount;
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Error during resource import transaction:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error importing resources:', error);
    throw error;
  }
}

module.exports = { importResources };