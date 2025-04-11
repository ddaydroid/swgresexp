# SWG Resource Explorer - Database Implementation

This directory contains the database implementation for the SWG Resource Explorer. It uses Sequelize ORM with SQLite for development and PostgreSQL for production.

## Directory Structure

```
server/database/
├── config/              # Database configuration
│   └── config.js        # Connection settings for different environments
├── migrations/          # Database migrations
│   └── *-create-*.js    # Migration files for creating tables
├── models/              # Database models
│   ├── index.js         # Model loader
│   ├── resource.js      # Resource model
│   ├── resourceStat.js  # ResourceStat model
│   └── resourcePlanet.js# ResourcePlanet model
└── seeders/             # Database seeders (if needed)
```

## Setup Instructions

1. Install dependencies:

```bash
npm install --save sequelize sqlite3 pg dotenv winston joi
npm install --save-dev sequelize-cli jest supertest
```

2. Initialize the database structure:

```bash
node server/scripts/init-database.js
```

3. Run migrations to create database tables:

```bash
npx sequelize-cli db:migrate
```

4. Import data from XML files:

```bash
node server/scripts/import-data.js --resources path/to/resources.xml
```

## Usage

### Starting the Server

Use the database-integrated server:

```bash
node server/database-server.js
```

Or update your start scripts in package.json:

```json
"scripts": {
  "server": "nodemon server/database-server.js"
}
```

### Testing the Database

To verify database connectivity and functionality:

```bash
node server/scripts/test-database.js
```

## Models

### Resource

The main resource model that stores basic resource information:

```javascript
const resource = await db.Resource.findByPk(123, {
  include: [
    { model: db.ResourceStat, as: 'stats' },
    { model: db.ResourcePlanet, as: 'planets' }
  ]
});
```

### ResourceStat

Stores statistics for resources (DR, MA, OQ, etc.):

```javascript
// Get average stat values
const averages = await db.ResourceStat.getStatAverages();

// Get resources with stats in a range
const resources = await db.Resource.findByStatFilters({
  minStats: { dr: 500 },
  maxStats: { ma: 600 }
});
```

### ResourcePlanet

Stores which planets each resource appears on:

```javascript
// Get resources available on a specific planet
const tatooineResources = await db.ResourcePlanet.getResourcesOnPlanet('Tatooine');
```

## API Endpoints

The database implementation provides the following API endpoints:

- `GET /api/resources` - Get all resources with filtering and pagination
- `GET /api/resources/categories` - Get resource categories
- `GET /api/resources/:id` - Get a specific resource by ID
- `GET /api/resources/stats/summary` - Get resource stats summary
- `GET /api/resources/search/autocomplete` - Search resources by name or type

## Environment Variables

The application uses different environment files for development and production:

- `.env.development` - Development settings
- `.env.production` - Production settings

Example environment variables:

```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
DB_NAME=swg_resources
```

## Migration to Database-Driven Architecture

### Phase 1: Testing Alongside XML

During the initial phase, you can run both XML and database-driven versions side by side:

1. Start the original XML-based server with `node server/server.js`
2. Start the database-driven server on a different port with `PORT=5001 node server/database-server.js`

### Phase 2: Complete Migration

Once testing is complete:

1. Update API client references in the frontend
2. Replace the old server.js with the database-server.js
3. Update build and deployment scripts

## Future Enhancements

- Adding Schematic models and API
- Implementing Crafting Calculator functionality
- Adding user accounts and saved searches
- Implementing caching layer for common queries