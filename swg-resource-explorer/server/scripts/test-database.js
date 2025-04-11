/**
 * Database Test Script
 * 
 * This script tests the database connection and performs basic CRUD operations
 * to verify that the models are working correctly.
 */

const db = require('../database/models');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

// Test database connection and models
async function testDatabase() {
  try {
    logger.info('Testing database connection...');
    
    // Test connection
    await db.sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
    
    // Get all models
    const models = Object.keys(db).filter(key => key !== 'sequelize' && key !== 'Sequelize');
    logger.info(`Available models: ${models.join(', ')}`);
    
    // Test if database is initialized
    const tablesExist = await Promise.all(models.map(async (model) => {
      try {
        if (db[model].getTableName) {
          const tableName = db[model].getTableName();
          const query = `SELECT 1 FROM ${tableName} LIMIT 1`;
          await db.sequelize.query(query);
          logger.info(`Table '${tableName}' exists.`);
          return true;
        }
        return false;
      } catch (error) {
        logger.error(`Table for model '${model}' does not exist or cannot be accessed.`);
        return false;
      }
    }));
    
    const allTablesExist = tablesExist.every(Boolean);
    
    if (allTablesExist) {
      logger.info('All database tables exist. Database is properly initialized.');
      await testBasicCrud();
    } else {
      logger.warn('Not all database tables exist. Database needs to be initialized.');
      logger.info('Run migrations with: npx sequelize-cli db:migrate');
    }
    
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
  } finally {
    // Close the connection
    await db.sequelize.close();
  }
}

// Test basic CRUD operations
async function testBasicCrud() {
  try {
    logger.info('Testing basic CRUD operations...');
    
    // Start transaction (will be rolled back)
    const transaction = await db.sequelize.transaction();
    
    try {
      // Create a test resource
      const testResource = await db.Resource.create({
        id: 9999999,
        name: 'Test Resource',
        type: 'Test Copper',
        typeId: 'test_copper',
        availableTimestamp: Math.floor(Date.now() / 1000),
        availableBy: 'database-test'
      }, { transaction });
      
      logger.info(`Created test resource with ID: ${testResource.id}`);
      
      // Add stats
      await db.ResourceStat.bulkCreate([
        { resourceId: testResource.id, name: 'dr', value: 500 },
        { resourceId: testResource.id, name: 'ma', value: 600 },
        { resourceId: testResource.id, name: 'oq', value: 700 }
      ], { transaction });
      
      logger.info('Added stats to test resource');
      
      // Add planets
      await db.ResourcePlanet.bulkCreate([
        { resourceId: testResource.id, name: 'TestPlanet1' },
        { resourceId: testResource.id, name: 'TestPlanet2' }
      ], { transaction });
      
      logger.info('Added planets to test resource');
      
      // Read the resource with associations
      const foundResource = await db.Resource.findByPk(testResource.id, {
        include: [
          { model: db.ResourceStat, as: 'stats' },
          { model: db.ResourcePlanet, as: 'planets' }
        ],
        transaction
      });
      
      if (foundResource) {
        logger.info('Successfully read test resource with associations');
        logger.info(`Resource name: ${foundResource.name}`);
        logger.info(`Stats count: ${foundResource.stats.length}`);
        logger.info(`Planets count: ${foundResource.planets.length}`);
      } else {
        logger.error('Failed to read test resource');
      }
      
      // Update the resource
      await testResource.update({
        name: 'Updated Test Resource'
      }, { transaction });
      
      logger.info('Successfully updated test resource');
      
      // Delete is handled by transaction rollback
      
      // Rollback transaction (no actual changes made to database)
      await transaction.rollback();
      logger.info('Transaction rolled back. No changes were made to the database.');
      
      logger.info('Basic CRUD operations tested successfully!');
      
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      throw error;
    }
    
  } catch (error) {
    logger.error('Error testing CRUD operations:', error);
  }
}

// Run the test
testDatabase().then(() => {
  logger.info('Database test completed');
}).catch(error => {
  logger.error('Database test failed:', error);
  process.exit(1);
});