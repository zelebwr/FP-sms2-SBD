const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const { dbConfig } = require('../config/database');

router.get('/', async (req, res) => {
  try {
    // Test database connection
    const connection = await mysql.createConnection(dbConfig);
    await connection.ping();
    await connection.end();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development'
    });
    
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: process.env.NODE_ENV === 'production' ? 'Database unavailable' : error.message
    });
  }
});

module.exports = router;