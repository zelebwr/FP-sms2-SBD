const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const { dbConfig } = require('../config/database');

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Utility function for database queries
async function executeQuery(query, params = []) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.execute(query, params);
    return results;
  } finally {
    if (connection) connection.release();
  }
}

// Test endpoint
router.get('/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// Status endpoint
router.get('/status', async (req, res) => {
  try {
    const dbInfo = await executeQuery('SELECT DATABASE() as current_db, VERSION() as version');
    const tables = await executeQuery('SHOW TABLES');
    
    let userCount = 0;
    try {
      const users = await executeQuery('SELECT COUNT(*) as count FROM users');
      userCount = users[0].count;
    } catch (err) {
      // Users table might not exist
    }
    
    res.json({
      status: 'success',
      database: {
        name: dbInfo[0].current_db,
        version: dbInfo[0].version,
        tables: tables.length,
        users: userCount
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Users endpoint
router.get('/users', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    
    const users = await executeQuery(
      'SELECT user_id, username, email, role, full_name, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    
    const totalCount = await executeQuery('SELECT COUNT(*) as count FROM users');
    
    res.json({
      status: 'success',
      data: users,
      count: users.length,
      total: totalCount[0]?.count || 0
    });
    
  } catch (error) {
    res.json({
      status: 'success',
      data: [],
      count: 0,
      total: 0,
      message: 'No users data available'
    });
  }
});

// Items endpoint
router.get('/items', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    
    const items = await executeQuery(`
      SELECT i.item_id, i.name, i.description, i.price, i.stock_quantity, 
             i.created_at, c.name as category_name
      FROM items i 
      LEFT JOIN categories c ON i.category_id = c.category_id 
      ORDER BY i.created_at DESC 
      LIMIT ? OFFSET ?
    `, [limit, offset]);
    
    const totalCount = await executeQuery('SELECT COUNT(*) as count FROM items');
    
    res.json({
      status: 'success',
      data: items,
      count: items.length,
      total: totalCount[0]?.count || 0
    });
    
  } catch (error) {
    res.json({
      status: 'success',
      data: [],
      count: 0,
      total: 0,
      message: 'No items data available'
    });
  }
});

// Categories endpoint
router.get('/categories', async (req, res) => {
  try {
    const categories = await executeQuery('SELECT * FROM categories ORDER BY name');
    
    res.json({
      status: 'success',
      data: categories,
      count: categories.length
    });
    
  } catch (error) {
    res.json({
      status: 'success',
      data: [],
      count: 0,
      message: 'No categories data available'
    });
  }
});

module.exports = router;