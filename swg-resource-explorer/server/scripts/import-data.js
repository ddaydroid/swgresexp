/**
 * Data Import Script
 * 
 * This script imports resources from XML files into the database.
 * It can be run directly from the command line.
 */

const path = require('path');
const fs = require('fs');
const { program } = require('commander');
const { importResources, verifyImport } = require('../utils/resourceImporter');
// When schematic importer is implemented, import it here
// const { importSchematics } = require('../utils/schematicImporter');
const db = require('../database/models');
const logger = require('../utils/logger');

// Define command-line options
program
  .version('1.0.0')
  .description('Import SWG resource and schematic data into the database')
  .option('-r, --resources <path>', 'Path to resources XML file')
  .option('-s, --schematics <path>', 'Path to schematics XML file')
  .option('-c, --clear', 'Clear existing data before import', false)
  .option('-v, --verbose', 'Enable verbose output', false)
  .option('--verify', 'Verify import after completion', false)
  .option('--sync', 'Sync database models before import', false)
  .parse(process.argv);

const options = program.opts();

// File paths
const DEFAULT_RESOURCES_XML_PATH = path.resolve(__dirname, '../../../currentresources_168.xml');
const DEFAULT_SCHEMATICS_XML_PATH = path.resolve(__dirname, '../../../schematics_unity.xml');

/**
 * Run database synchronization
 * @returns {Promise<void>}
 */
async function syncDatabase() {
  try {
    logger.info('Synchronizing database models...');
    await db.sequelize.sync();
    logger.info('Database models synchronized');
  } catch (error) {
    logger.error('Error synchronizing database models:', error);
    throw error;
  }
}

/**
 * Run the import process
 * @returns {Promise<void>}
 */
async function runImport() {
  try {
    // Sync database if requested
    if (options.sync) {
      await syncDatabase();
    }
    
    // Import resources if path is provided or default exists
    if (options.resources || fs.existsSync(DEFAULT_RESOURCES_XML_PATH)) {
      const resourcesPath = options.resources || DEFAULT_RESOURCES_XML_PATH;
      
      logger.info(`Importing resources from ${resourcesPath}...`);
      
      const resourceStats = await importResources(resourcesPath, {
        clearExisting: options.clear,
        verbose: options.verbose
      });
      
      logger.info(`Resources import complete: Created ${resourceStats.created}, Updated ${resourceStats.updated}, Errors ${resourceStats.errors}`);
    } else {
      logger.warn('No resources XML file specified and default file not found.');
    }
    
    // Import schematics if path is provided or default exists
    if (options.schematics || fs.existsSync(DEFAULT_SCHEMATICS_XML_PATH)) {
      const schematicsPath = options.schematics || DEFAULT_SCHEMATICS_XML_PATH;
      
      logger.info(`Importing schematics from ${schematicsPath}...`);
      
      // When schematic importer is implemented, use it here
      logger.warn('Schematic import not yet implemented');
      
      /*
      const schematicStats = await importSchematics(schematicsPath, {
        clearExisting: options.clear,
        verbose: options.verbose
      });
      
      logger.info(`Schematics import complete: Created ${schematicStats.created}, Updated ${schematicStats.updated}, Errors ${schematicStats.errors}`);
      */
    } else {
      logger.warn('No schematics XML file specified and default file not found.');
    }
    
    // Verify import if requested
    if (options.verify) {
      logger.info('Verifying import...');
      const verificationResult = await verifyImport();
      
      logger.info('Verification results:');
      logger.info(`- Resources: ${verificationResult.resourceCount}`);
      logger.info(`- Resource stats: ${verificationResult.statCount}`);
      logger.info(`- Resource planets: ${verificationResult.planetCount}`);
      
      if (verificationResult.resourcesWithoutStats > 0) {
        logger.warn(`- Resources without stats: ${verificationResult.resourcesWithoutStats}`);
      }
      
      if (verificationResult.resourcesWithoutPlanets > 0) {
        logger.warn(`- Resources without planets: ${verificationResult.resourcesWithoutPlanets}`);
      }
    }
    
    logger.info('Import process completed successfully');
  } catch (error) {
    logger.error('Import process failed:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await db.sequelize.close();
  }
}

// Run the import
if (require.main === module) {
  // Show help if no options provided
  if (!process.argv.slice(2).length) {
    program.help();
  }
  
  runImport().then(() => {
    logger.info('Import script completed');
    process.exit(0);
  }).catch(error => {
    logger.error('Import script failed:', error);
    process.exit(1);
  });
} else {
  // For testing/importing as module
  module.exports = { runImport };
}