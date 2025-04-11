/**
 * Database Initialization Script
 * 
 * This script initializes the database structure for the SWG Resource Explorer.
 * It creates the necessary directories and configuration files for Sequelize.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const BASE_DIR = path.resolve(__dirname, '..');
const DATABASE_DIR = path.join(BASE_DIR, 'database');
const CONFIG_DIR = path.join(DATABASE_DIR, 'config');
const MODELS_DIR = path.join(DATABASE_DIR, 'models');
const MIGRATIONS_DIR = path.join(DATABASE_DIR, 'migrations');
const SEEDERS_DIR = path.join(DATABASE_DIR, 'seeders');

// Create directory structure
const directories = [
  DATABASE_DIR,
  CONFIG_DIR,
  MODELS_DIR,
  MIGRATIONS_DIR,
  SEEDERS_DIR
];

// Create dev and prod environment files
const envFiles = {
  '.env.development': `NODE_ENV=development
PORT=5000
`,
  '.env.production': `NODE_ENV=production
PORT=5000
DB_HOST=your-production-host
DB_PORT=5432
DB_USER=your-db-username
DB_PASS=your-db-password
DB_NAME=swg_resources
`
};

// Create database config file
const configFile = path.join(CONFIG_DIR, 'config.js');
const configContent = `require('dotenv').config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development' });

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: './server/database/database.sqlite',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  },
  production: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    logging: false,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
`;

// Create sequelize model index file
const indexFile = path.join(MODELS_DIR, 'index.js');
const indexContent = `'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
`;

// Logger utility for database operations
const loggerDir = path.join(BASE_DIR, 'utils');
const loggerFile = path.join(loggerDir, 'logger.js');
const loggerContent = `const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Define custom format for console and file logging
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return \`[\${timestamp}] \${level.toUpperCase()}: \${message}\`;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: customFormat,
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        customFormat
      )
    }),
    // File transport with daily rotation
    new winston.transports.File({
      filename: path.join(logDir, 'app.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    // Separate error log
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    })
  ]
});

module.exports = logger;
`;

// Validator utility for API requests
const validatorFile = path.join(loggerDir, 'validators.js');
const validatorContent = `const Joi = require('joi');

/**
 * Validate resource query parameters
 * @param {Object} query - Request query parameters
 * @returns {Object} - Validation result
 */
const validateResourceQuery = (query) => {
  const schema = Joi.object({
    name: Joi.string().trim().max(100),
    type: Joi.string().trim().max(100),
    planet: Joi.string().trim().max(50),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(50),
    min_dr: Joi.number().integer().min(0).max(1000),
    max_dr: Joi.number().integer().min(0).max(1000),
    min_ma: Joi.number().integer().min(0).max(1000),
    max_ma: Joi.number().integer().min(0).max(1000),
    min_oq: Joi.number().integer().min(0).max(1000),
    max_oq: Joi.number().integer().min(0).max(1000),
    min_sr: Joi.number().integer().min(0).max(1000),
    max_sr: Joi.number().integer().min(0).max(1000),
    min_ut: Joi.number().integer().min(0).max(1000),
    max_ut: Joi.number().integer().min(0).max(1000),
    min_fl: Joi.number().integer().min(0).max(1000),
    max_fl: Joi.number().integer().min(0).max(1000),
    min_pe: Joi.number().integer().min(0).max(1000),
    max_pe: Joi.number().integer().min(0).max(1000)
  }).unknown(false);

  return schema.validate(query);
};

/**
 * Validate schematic query parameters
 * @param {Object} query - Request query parameters
 * @returns {Object} - Validation result
 */
const validateSchematicQuery = (query) => {
  const schema = Joi.object({
    name: Joi.string().trim().max(100),
    category: Joi.string().trim().max(100),
    profession: Joi.string().trim().max(50),
    resource_type: Joi.string().trim().max(100),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(50)
  }).unknown(false);

  return schema.validate(query);
};

/**
 * Validate calculator request body
 * @param {Object} body - Request body
 * @returns {Object} - Validation result
 */
const validateCalculatorBody = (body) => {
  const schema = Joi.object({
    schematicId: Joi.number().integer().required(),
    experimentFocus: Joi.string().trim().max(100)
  }).unknown(false);

  return schema.validate(body);
};

module.exports = {
  validateResourceQuery,
  validateSchematicQuery,
  validateCalculatorBody
};
`;

// Create directories
console.log('Creating directory structure...');
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Create env files
console.log('Creating environment files...');
Object.entries(envFiles).forEach(([filename, content]) => {
  const filePath = path.join(BASE_DIR, '..', '..', filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`Created file: ${filename}`);
  }
});

// Create config file
console.log('Creating database config file...');
if (!fs.existsSync(configFile)) {
  fs.writeFileSync(configFile, configContent);
  console.log(`Created file: ${configFile}`);
}

// Create model index file
console.log('Creating model index file...');
if (!fs.existsSync(indexFile)) {
  fs.writeFileSync(indexFile, indexContent);
  console.log(`Created file: ${indexFile}`);
}

// Create logger utility
console.log('Creating logger utility...');
if (!fs.existsSync(loggerDir)) {
  fs.mkdirSync(loggerDir, { recursive: true });
}
if (!fs.existsSync(loggerFile)) {
  fs.writeFileSync(loggerFile, loggerContent);
  console.log(`Created file: ${loggerFile}`);
}

// Create validator utility
console.log('Creating validator utility...');
if (!fs.existsSync(validatorFile)) {
  fs.writeFileSync(validatorFile, validatorContent);
  console.log(`Created file: ${validatorFile}`);
}

console.log('Database initialization complete!');
console.log('Next steps:');
console.log('1. Install required dependencies:');
console.log('   npm install --save sequelize sqlite3 pg dotenv winston joi');
console.log('   npm install --save-dev sequelize-cli jest supertest');
console.log('2. Run Sequelize initialization:');
console.log('   npx sequelize-cli init');
console.log('3. Generate migrations:');
console.log('   npx sequelize-cli migration:generate --name create-resources-tables');
console.log('   npx sequelize-cli migration:generate --name create-schematics-tables');
console.log('4. Create model files as specified in the implementation plan');
console.log('5. Run migrations:');
console.log('   npx sequelize-cli db:migrate');