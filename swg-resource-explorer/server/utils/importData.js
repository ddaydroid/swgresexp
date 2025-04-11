const path = require('path');
const { importResources } = require('./resourceImporter');
const { importSchematics } = require('./schematicImporter');
const db = require('../database/models');

// File paths
const RESOURCES_XML_PATH = path.resolve(__dirname, '../../currentresources_168.xml');
// Note: schematics_unity.xml is not available yet
const SCHEMATICS_XML_PATH = path.resolve(__dirname, '../../schematics_unity.xml');

/**
 * Run full data import
 */
async function runImport() {
  try {
    console.log('Starting database sync...');
    await db.sequelize.sync();
    
    console.log('Importing resources...');
    const resourceCount = await importResources(RESOURCES_XML_PATH);
    
    // Skip schematic import since the file is not available yet
    console.log('Skipping schematic import - file not available');
    const schematicCount = 0;
    
    console.log(`Import complete. Imported ${resourceCount} resources and ${schematicCount} schematics.`);
    return { resourceCount, schematicCount };
  } catch (error) {
    console.error('Import failed:', error);
    throw error;
  }
}

// If called directly (not imported)
if (require.main === module) {
  runImport()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
} else {
  module.exports = { runImport };
}