const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const port = 8080; // Untuk binding port

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'project_user',
  password: 'project_pass',
  database: 'project_db'
};

// Test database connection
async function testDatabaseConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.ping();
    await connection.end();
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Create a reusable database connection function
async function getDbConnection() {
  try {
    return await mysql.createConnection(dbConfig);
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Database connection failed');
  }
}

// API Routes
app.get('/api/status', async (req, res) => {
  console.log('API /status called');
  
  try {
    const connection = await getDbConnection();
    
    // Get database info
    const [dbInfo] = await connection.query('SELECT DATABASE() as current_db, VERSION() as version');
    
    // Get table count
    const [tables] = await connection.query('SHOW TABLES');
    
    // Get user count
    let userCount = 0;
    try {
      const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
      userCount = users[0].count;
    } catch (err) {
      console.log('Users table might not exist:', err.message);
    }
    
    await connection.end();
    
    const response = {
      status: 'success',
      database: {
        name: dbInfo[0].current_db,
        version: dbInfo[0].version,
        tables: tables.length,
        users: userCount
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('Sending response:', response);
    res.json(response);
    
  } catch (error) {
    console.error('API status error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  console.log('API /users called');
  
  try {
    const connection = await getDbConnection();
    
    // Check if users table exists
    const [tableExists] = await connection.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'project_db' AND table_name = 'users'
    `);
    
    if (tableExists[0].count === 0) {
      await connection.end();
      return res.json({
        status: 'success',
        data: [],
        count: 0,
        message: 'Users table does not exist yet'
      });
    }
    
    const [users] = await connection.query(`
      SELECT user_id, username, email, role, full_name, created_at 
      FROM users 
      ORDER BY created_at DESC
    `);
    
    await connection.end();
    
    res.json({
      status: 'success',
      data: users,
      count: users.length
    });
    
  } catch (error) {
    console.error('API users error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get all items
app.get('/api/items', async (req, res) => {
  console.log('API /items called');
  
  try {
    const connection = await getDbConnection();
    
    // Check if items table exists
    const [tableExists] = await connection.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'project_db' AND table_name = 'items'
    `);
    
    if (tableExists[0].count === 0) {
      await connection.end();
      return res.json({
        status: 'success',
        data: [],
        count: 0,
        message: 'Items table does not exist yet'
      });
    }
    
    const [items] = await connection.query(`
      SELECT i.*, c.name as category_name 
      FROM items i 
      LEFT JOIN categories c ON i.category_id = c.category_id 
      ORDER BY i.created_at DESC
    `);
    
    await connection.end();
    
    res.json({
      status: 'success',
      data: items,
      count: items.length
    });
    
  } catch (error) {
    console.error('API items error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  console.log('API /categories called');
  
  try {
    const connection = await getDbConnection();
    
    // Check if categories table exists
    const [tableExists] = await connection.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'project_db' AND table_name = 'categories'
    `);
    
    if (tableExists[0].count === 0) {
      await connection.end();
      return res.json({
        status: 'success',
        data: [],
        count: 0,
        message: 'Categories table does not exist yet'
      });
    }
    
    const [categories] = await connection.query('SELECT * FROM categories');
    await connection.end();
    
    res.json({
      status: 'success',
      data: categories,
      count: categories.length
    });
    
  } catch (error) {
    console.error('API categories error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Add a test endpoint
app.get('/api/test', (req, res) => {
  console.log('API /test called');
  res.json({
    status: 'success',
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
});

// Main route - serve the dashboard
app.get('/', (req, res) => {
  console.log('Main route called');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});

// Start server
app.listen(port, async () => {
  console.log('🚀 Starting server...');
  
  // Test database connection on startup
  const dbConnected = await testDatabaseConnection();
  
  if (dbConnected) {
    console.log(`✅ Server running successfully at http://localhost:${port}`);
    console.log(`📊 Database dashboard: http://localhost:${port}`);
    console.log(`🔍 API endpoints available:`);
    console.log(`   - GET /api/test`);
    console.log(`   - GET /api/status`);
    console.log(`   - GET /api/users`);
    console.log(`   - GET /api/items`);
    console.log(`   - GET /api/categories`);
  } else {
    console.log(`❌ Server started at http://localhost:${port} but database connection failed`);
  }
});