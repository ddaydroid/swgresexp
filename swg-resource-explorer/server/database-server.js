/**
 * SWG Resource Explorer Database Server
 * 
 * This server integrates with the database implementation
 * and provides API endpoints for resources and schematics.
 */

require('dotenv').config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database/models');
const logger = require('./utils/logger');

// Import routes
const resourceRoutes = require('./routes/resourceRoutes');
// When implemented, import schematic routes
// const schematicRoutes = require('./routes/schematicRoutes');
// const calculatorRoutes = require('./routes/calculatorRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Database connection
db.sequelize.authenticate()
  .then(() => {
    logger.info('Database connection established successfully.');
  })
  .catch(err => {
    logger.error('Unable to connect to the database:', err);
  });

// API Routes
app.use('/api/resources', resourceRoutes);
// When implemented, use schematic and calculator routes
// app.use('/api/schematics', schematicRoutes);
// app.use('/api/calculator', calculatorRoutes);

// API Documentation route
app.use('/api-docs', express.static(path.join(__dirname, '../docs/api')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
  });
}

// Start the server
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

// For testing
module.exports = app;