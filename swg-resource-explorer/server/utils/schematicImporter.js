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
 * Import schematics from XML file to database
 * @param {string} filePath - Path to XML file
 */
async function importSchematics(filePath) {
  try {
    console.log('Starting schematic import from XML...');
    const xmlData = fs.readFileSync(filePath, 'utf8');
    const parsedData = parser.parse(xmlData);
    
    // Extract schematics array
    const schematics = parsedData.schematics.schematic;
    
    // Use transaction for data integrity
    const transaction = await db.sequelize.transaction();
    
    try {
      console.log(`Processing ${schematics.length} schematics...`);
      let importedCount = 0;
      
      for (const schematic of schematics) {
        // Create or update schematic
        const [schematicRecord, created] = await db.Schematic.findOrCreate({
          where: { id: schematic._id },
          defaults: {
            name: schematic._name,
            category: schematic._category,
            baseType: schematic._base,
            complexity: schematic.statistics?._complexity || 0,
            xp: schematic.statistics?._xp || 0,
            manufacture: schematic.statistics?._manufacture === 'yes',
            schematicType: schematic.statistics?._type || 'Regular',
            crateSize: schematic.statistics?._crate || 0,
            miscDesc: schematic.misc?._desc || ''
          },
          transaction
        });
        
        if (!created) {
          // Update existing record
          await schematicRecord.update({
            name: schematic._name,
            category: schematic._category,
            baseType: schematic._base,
            complexity: schematic.statistics?._complexity || 0,
            xp: schematic.statistics?._xp || 0,
            manufacture: schematic.statistics?._manufacture === 'yes',
            schematicType: schematic.statistics?._type || 'Regular',
            crateSize: schematic.statistics?._crate || 0,
            miscDesc: schematic.misc?._desc || ''
          }, { transaction });
        }
        
        // Delete existing relationships for update
        await db.ProfessionLevel.destroy({
          where: { schematicId: schematicRecord.id },
          transaction
        });
        
        await db.SchematicResource.destroy({
          where: { schematicId: schematicRecord.id },
          transaction
        });
        
        await db.SchematicComponent.destroy({
          where: { schematicId: schematicRecord.id },
          transaction
        });
        
        await db.ExperimentalGroup.destroy({
          where: { schematicId: schematicRecord.id },
          transaction
        });
        
        // Add profession level
        if (schematic.level) {
          await db.ProfessionLevel.create({
            schematicId: schematicRecord.id,
            profession: schematic.level._profession,
            level: schematic.level._level
          }, { transaction });
        }
        
        // Add resources
        if (schematic.resource) {
          const resources = Array.isArray(schematic.resource) 
            ? schematic.resource 
            : [schematic.resource];
          
          for (const resource of resources) {
            await db.SchematicResource.create({
              schematicId: schematicRecord.id,
              resourceType: resource._id,
              quantity: resource._units,
              description: resource._desc
            }, { transaction });
          }
        }
        
        // Add components
        if (schematic.component) {
          const components = Array.isArray(schematic.component) 
            ? schematic.component 
            : [schematic.component];
          
          for (const component of components) {
            await db.SchematicComponent.create({
              schematicId: schematicRecord.id,
              componentId: component._id,
              componentType: component._type,
              quantity: component._number,
              similar: component._similar === 'yes',
              optional: component._optional === 'yes',
              looted: component._looted === 'yes',
              description: component._desc
            }, { transaction });
          }
        }
        
        // Add experimental groups and properties
        if (schematic.exp_grp) {
          const expGroups = Array.isArray(schematic.exp_grp) 
            ? schematic.exp_grp 
            : [schematic.exp_grp];
          
          for (const expGroup of expGroups) {
            const experimentalGroup = await db.ExperimentalGroup.create({
              schematicId: schematicRecord.id,
              description: expGroup._desc
            }, { transaction });
            
            if (expGroup.exp) {
              const expProperties = Array.isArray(expGroup.exp) 
                ? expGroup.exp 
                : [expGroup.exp];
              
              for (const expProperty of expProperties) {
                await db.ExperimentalProperty.create({
                  groupId: experimentalGroup.id,
                  description: expProperty._desc,
                  drWeight: expProperty._dr || 0,
                  maWeight: expProperty._ma || 0,
                  oqWeight: expProperty._oq || 0,
                  srWeight: expProperty._sr || 0,
                  utWeight: expProperty._ut || 0,
                  flWeight: expProperty._fl || 0,
                  peWeight: expProperty._pe || 0
                }, { transaction });
              }
            }
          }
        }
        
        importedCount++;
        if (importedCount % 100 === 0) {
          console.log(`Imported ${importedCount} schematics...`);
        }
      }
      
      // Commit transaction
      await transaction.commit();
      console.log(`Successfully imported ${importedCount} schematics`);
      return importedCount;
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Error during schematic import transaction:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error importing schematics:', error);
    throw error;
  }
}

module.exports = { importSchematics };