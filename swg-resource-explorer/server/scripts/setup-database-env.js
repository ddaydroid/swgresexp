/**
 * Database Environment Setup Script
 * 
 * This script prepares the environment for the database implementation by:
 * 1. Creating .env files for development and production
 * 2. Updating package.json with required dependencies
 * 3. Creating necessary directories
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Project root directory
const projectRoot = path.resolve(__dirname, '../../');

// Environment file templates
const envDevelopment = `NODE_ENV=development
PORT=5000
# SQLite is used for development, no additional configuration needed
`;

const envProduction = `NODE_ENV=production
PORT=5000
DB_HOST=your-production-host
DB_PORT=5432
DB_USER=your-db-username
DB_PASS=your-db-password
DB_NAME=swg_resources
`;

// Create environment files
function createEnvFiles() {
  console.log('Creating environment files...');
  
  const devEnvPath = path.join(projectRoot, '.env.development');
  const prodEnvPath = path.join(projectRoot, '.env.production');
  
  if (!fs.existsSync(devEnvPath)) {
    fs.writeFileSync(devEnvPath, envDevelopment);
    console.log('Created .env.development');
  } else {
    console.log('.env.development already exists');
  }
  
  if (!fs.existsSync(prodEnvPath)) {
    fs.writeFileSync(prodEnvPath, envProduction);
    console.log('Created .env.production');
  } else {
    console.log('.env.production already exists');
  }
}

// Update package.json with database dependencies
function updatePackageJson() {
  console.log('Updating package.json...');
  
  const packageJsonPath = path.join(projectRoot, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.error('package.json not found!');
    return;
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Dependencies to add
    const dependencies = {
      'sequelize': '^6.32.1',
      'sqlite3': '^5.1.6',
      'pg': '^8.11.0',
      'dotenv': '^16.0.3',
      'winston': '^3.8.2',
      'joi': '^17.9.2',
      'commander': '^10.0.1'
    };
    
    // Dev dependencies to add
    const devDependencies = {
      'sequelize-cli': '^6.6.0',
      'jest': '^29.5.0',
      'supertest': '^6.3.3'
    };
    
    // Add/update dependencies
    packageJson.dependencies = {
      ...packageJson.dependencies,
      ...dependencies
    };
    
    // Add/update dev dependencies
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      ...devDependencies
    };
    
    // Add scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      'db:migrate': 'npx sequelize-cli db:migrate',
      'db:seed': 'npx sequelize-cli db:seed:all',
      'db:reset': 'npx sequelize-cli db:drop && npx sequelize-cli db:create && npm run db:migrate',
      'server:db': 'nodemon server/database-server.js',
      'import:resources': 'node server/scripts/import-data.js --resources currentresources_168.xml',
      'test:db': 'node server/scripts/test-database.js'
    };
    
    // Write updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Updated package.json');
    
  } catch (error) {
    console.error('Error updating package.json:', error);
  }
}

// Ensure directories exist
function createDirectories() {
  console.log('Creating directories...');
  
  const directories = [
    path.join(projectRoot, 'server', 'database'),
    path.join(projectRoot, 'server', 'database', 'config'),
    path.join(projectRoot, 'server', 'database', 'migrations'),
    path.join(projectRoot, 'server', 'database', 'models'),
    path.join(projectRoot, 'server', 'database', 'seeders'),
    path.join(projectRoot, 'logs')
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    } else {
      console.log(`Directory already exists: ${dir}`);
    }
  });
}

// Create .sequelizerc file
function createSequelizeConfig() {
  console.log('Creating .sequelizerc...');
  
  const sequelizeConfigPath = path.join(projectRoot, '.sequelizerc');
  const sequelizeConfig = `const path = require('path');

module.exports = {
  'config': path.resolve('server/database/config', 'config.js'),
  'models-path': path.resolve('server/database/models'),
  'seeders-path': path.resolve('server/database/seeders'),
  'migrations-path': path.resolve('server/database/migrations')
}`;
  
  if (!fs.existsSync(sequelizeConfigPath)) {
    fs.writeFileSync(sequelizeConfigPath, sequelizeConfig);
    console.log('Created .sequelizerc');
  } else {
    console.log('.sequelizerc already exists');
  }
}

// Print next steps
function printNextSteps() {
  console.log('\n--- Setup Complete ---\n');
  console.log('Next steps:');
  console.log('1. Install dependencies:');
  console.log('   npm install');
  console.log('2. Initialize the database:');
  console.log('   node server/scripts/init-database.js');
  console.log('3. Run migrations:');
  console.log('   npm run db:migrate');
  console.log('4. Import resources:');
  console.log('   npm run import:resources');
  console.log('5. Test the database:');
  console.log('   npm run test:db');
  console.log('6. Start the database server:');
  console.log('   npm run server:db');
}

// Run setup
try {
  createEnvFiles();
  updatePackageJson();
  createDirectories();
  createSequelizeConfig();
  printNextSteps();
} catch (error) {
  console.error('Setup failed:', error);
  process.exit(1);
}