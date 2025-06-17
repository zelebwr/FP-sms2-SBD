require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// ============= MONGODB REAL CONNECTION =============
const mongoose = require('mongoose');
let mongoConnected = false;
let mongoModels = {};

// MongoDB connection function
async function connectMongoDB() {
  try {
    console.log('🍃 Connecting to MongoDB...');
    
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/project_db';
    console.log('🔗 MongoDB URI:', mongoUri);

    // Connect to MongoDB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Database:', mongoose.connection.name);
    
    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('🍃 Mongoose connected to MongoDB');
      mongoConnected = true;
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      mongoConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
      mongoConnected = false;
    });

    // Create schemas and models
    await createMongoSchemas();
    
    mongoConnected = true;
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    mongoConnected = false;
    return false;
  }
}

// Create MongoDB schemas
async function createMongoSchemas() {
  console.log('📝 Creating MongoDB schemas...');

  // Categories Schema
  const categorySchema = new mongoose.Schema({
    category_id: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    parent_category: {
      type: Number,
      default: null
    },
    is_active: {
      type: Boolean,
      default: true
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    updated_at: {
      type: Date,
      default: Date.now
    }
  });

  // Products Schema (for MongoDB-specific products)
  const productSchema = new mongoose.Schema({
    product_id: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category_id: {
      type: Number,
      required: true,
      index: true
    },
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    tags: [String],
    images: [String],
    specifications: {
      type: Map,
      of: String
    },
    is_active: {
      type: Boolean,
      default: true
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    updated_at: {
      type: Date,
      default: Date.now
    }
  });

  // Reviews Schema
  const reviewSchema = new mongoose.Schema({
    review_id: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },
    product_id: {
      type: Number,
      required: true,
      index: true
    },
    user_id: {
      type: Number,
      required: true,
      index: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: {
      type: String,
      trim: true
    },
    comment: {
      type: String,
      trim: true
    },
    verified_purchase: {
      type: Boolean,
      default: false
    },
    helpful_votes: {
      type: Number,
      default: 0
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  });

  // Shopping Cart Schema
  const cartSchema = new mongoose.Schema({
    cart_id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    user_id: {
      type: Number,
      required: true,
      index: true
    },
    items: [{
      product_id: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price_at_add: {
        type: Number,
        required: true
      },
      added_at: {
        type: Date,
        default: Date.now
      }
    }],
    total_amount: {
      type: Number,
      default: 0
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    updated_at: {
      type: Date,
      default: Date.now
    }
  });

  // Wishlists Schema
  const wishlistSchema = new mongoose.Schema({
    wishlist_id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    user_id: {
      type: Number,
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      default: 'My Wishlist'
    },
    items: [{
      product_id: {
        type: Number,
        required: true
      },
      added_at: {
        type: Date,
        default: Date.now
      },
      notes: String
    }],
    is_public: {
      type: Boolean,
      default: false
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    updated_at: {
      type: Date,
      default: Date.now
    }
  });

  // Create models
  mongoModels.Category = mongoose.model('Category', categorySchema);
  mongoModels.Product = mongoose.model('MongoProduct', productSchema);
  mongoModels.Review = mongoose.model('Review', reviewSchema);
  mongoModels.Cart = mongoose.model('Cart', cartSchema);
  mongoModels.Wishlist = mongoose.model('Wishlist', wishlistSchema);

  console.log('✅ MongoDB schemas created successfully');

  // Create initial data
  await createInitialData();
}

// Create initial data
async function createInitialData() {
  try {
    console.log('📝 Creating initial MongoDB data...');

    // Create categories
    const categoryCount = await mongoModels.Category.countDocuments();
    if (categoryCount === 0) {
      const categories = [
        { category_id: 1, name: 'Electronics', description: 'Electronic devices and gadgets' },
        { category_id: 2, name: 'Clothing', description: 'Fashion and apparel' },
        { category_id: 3, name: 'Books', description: 'Books and educational materials' },
        { category_id: 4, name: 'Home & Garden', description: 'Home improvement and gardening' },
        { category_id: 5, name: 'Sports', description: 'Sports and outdoor equipment' },
        { category_id: 6, name: 'Beauty', description: 'Beauty and personal care' },
        { category_id: 7, name: 'Automotive', description: 'Car parts and accessories' }
      ];

      for (const cat of categories) {
        await new mongoModels.Category(cat).save();
      }
      console.log(`✅ Created ${categories.length} categories`);
    }

    // Create products
    const productCount = await mongoModels.Product.countDocuments();
    if (productCount === 0) {
      const products = [
        {
          product_id: 1001,
          name: 'Wireless Bluetooth Headphones',
          description: 'High-quality wireless headphones with noise cancellation',
          price: 99.99,
          category_id: 1,
          stock: 50,
          tags: ['wireless', 'bluetooth', 'headphones', 'audio'],
          images: ['headphones1.jpg', 'headphones2.jpg'],
          specifications: {
            'Battery Life': '30 hours',
            'Connectivity': 'Bluetooth 5.0',
            'Weight': '250g'
          }
        },
        {
          product_id: 1002,
          name: 'Casual Cotton T-Shirt',
          description: 'Comfortable cotton t-shirt for daily wear',
          price: 19.99,
          category_id: 2,
          stock: 100,
          tags: ['cotton', 'casual', 'tshirt', 'clothing'],
          images: ['tshirt1.jpg', 'tshirt2.jpg'],
          specifications: {
            'Material': '100% Cotton',
            'Fit': 'Regular',
            'Care': 'Machine wash'
          }
        },
        {
          product_id: 1003,
          name: 'JavaScript Programming Book',
          description: 'Learn modern JavaScript programming with practical examples',
          price: 39.99,
          category_id: 3,
          stock: 25,
          tags: ['javascript', 'programming', 'book', 'education'],
          images: ['jsbook1.jpg'],
          specifications: {
            'Pages': '450',
            'Language': 'English',
            'Level': 'Beginner to Advanced'
          }
        }
      ];

      for (const prod of products) {
        await new mongoModels.Product(prod).save();
      }
      console.log(`✅ Created ${products.length} products`);
    }

    // Create reviews
    const reviewCount = await mongoModels.Review.countDocuments();
    if (reviewCount === 0) {
      const reviews = [
        {
          review_id: 1,
          product_id: 1001,
          user_id: 1,
          rating: 5,
          title: 'Excellent headphones!',
          comment: 'Great sound quality and comfortable to wear for long periods.',
          verified_purchase: true,
          helpful_votes: 5
        },
        {
          review_id: 2,
          product_id: 1001,
          user_id: 2,
          rating: 4,
          title: 'Good value for money',
          comment: 'Nice headphones, battery life could be better.',
          verified_purchase: true,
          helpful_votes: 2
        },
        {
          review_id: 3,
          product_id: 1002,
          user_id: 1,
          rating: 5,
          title: 'Comfortable and stylish',
          comment: 'Perfect fit and very comfortable fabric.',
          verified_purchase: true,
          helpful_votes: 3
        }
      ];

      for (const review of reviews) {
        await new mongoModels.Review(review).save();
      }
      console.log(`✅ Created ${reviews.length} reviews`);
    }

    // Create sample cart
    const cartCount = await mongoModels.Cart.countDocuments();
    if (cartCount === 0) {
      const cart = new mongoModels.Cart({
        cart_id: 'cart_user_1',
        user_id: 1,
        items: [
          {
            product_id: 1001,
            quantity: 1,
            price_at_add: 99.99
          },
          {
            product_id: 1002,
            quantity: 2,
            price_at_add: 19.99
          }
        ],
        total_amount: 139.97
      });
      await cart.save();
      console.log('✅ Created sample cart');
    }

    // Create sample wishlist
    const wishlistCount = await mongoModels.Wishlist.countDocuments();
    if (wishlistCount === 0) {
      const wishlist = new mongoModels.Wishlist({
        wishlist_id: 'wishlist_user_1',
        user_id: 1,
        name: 'My Favorite Items',
        items: [
          {
            product_id: 1003,
            notes: 'Want to read this book'
          }
        ],
        is_public: false
      });
      await wishlist.save();
      console.log('✅ Created sample wishlist');
    }

    console.log('✅ Initial MongoDB data created successfully');
  } catch (error) {
    console.error('❌ Error creating initial data:', error);
  }
}

// Initialize MongoDB
connectMongoDB();

// ============= EXISTING MYSQL CODE (UNCHANGED) =============
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'project_user',
  password: process.env.DB_PASSWORD || 'project_pass',
  database: process.env.DB_NAME || 'project_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Database helper
async function executeQuery(query, params = []) {
  let connection;
  try {
    connection = await pool.getConnection();
    
    if (params.length === 0) {
      const [results] = await connection.query(query);
      return results;
    } else {
      const [results] = await connection.execute(query, params);
      return results;
    }
  } catch (error) {
    console.error('Database error:', error.message);
    console.error('Query:', query);
    console.error('Params:', params);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

// API Routes
app.get('/api/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is working!',
    mongodb_connected: mongoConnected,
    timestamp: new Date().toISOString()
  });
});

// ============= MONGODB API ENDPOINTS =============
app.get('/api/mongo/health', (req, res) => {
  res.json({
    status: 'success',
    mongodb: {
      connected: mongoConnected,
      database: mongoose.connection.name || 'unknown',
      ready_state: mongoose.connection.readyState,
      models_available: Object.keys(mongoModels).length > 0
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/api/mongo/categories', async (req, res) => {
  try {
    if (!mongoConnected || !mongoModels.Category) {
      return res.status(503).json({
        status: 'error',
        message: 'MongoDB not connected or Category model not available'
      });
    }

    const categories = await mongoModels.Category.find({ is_active: true }).sort({ name: 1 });
    res.json({
      status: 'success',
      data: categories,
      count: categories.length,
      source: 'MongoDB'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

app.get('/api/mongo/products', async (req, res) => {
  try {
    if (!mongoConnected || !mongoModels.Product) {
      return res.status(503).json({
        status: 'error',
        message: 'MongoDB not connected or Product model not available'
      });
    }

    const products = await mongoModels.Product.find({ is_active: true }).sort({ created_at: -1 });
    res.json({
      status: 'success',
      data: products,
      count: products.length,
      source: 'MongoDB'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

app.get('/api/mongo/reviews', async (req, res) => {
  try {
    if (!mongoConnected || !mongoModels.Review) {
      return res.status(503).json({
        status: 'error',
        message: 'MongoDB not connected or Review model not available'
      });
    }

    const reviews = await mongoModels.Review.find().sort({ created_at: -1 });
    res.json({
      status: 'success',
      data: reviews,
      count: reviews.length,
      source: 'MongoDB'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

app.get('/api/mongo/carts', async (req, res) => {
  try {
    if (!mongoConnected || !mongoModels.Cart) {
      return res.status(503).json({
        status: 'error',
        message: 'MongoDB not connected or Cart model not available'
      });
    }

    const carts = await mongoModels.Cart.find().sort({ updated_at: -1 });
    res.json({
      status: 'success',
      data: carts,
      count: carts.length,
      source: 'MongoDB'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

app.get('/api/mongo/wishlists', async (req, res) => {
  try {
    if (!mongoConnected || !mongoModels.Wishlist) {
      return res.status(503).json({
        status: 'error',
        message: 'MongoDB not connected or Wishlist model not available'
      });
    }

    const wishlists = await mongoModels.Wishlist.find().sort({ updated_at: -1 });
    res.json({
      status: 'success',
      data: wishlists,
      count: wishlists.length,
      source: 'MongoDB'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Dashboard comprehensive status
app.get('/api/dashboard/status', async (req, res) => {
  try {
    console.log('📊 Loading comprehensive dashboard status...');
    
    // MySQL Data
    let mysqlData = {
      connected: false,
      database: 'unknown',
      version: 'unknown',
      tables: 0,
      tablesList: [],
      records: {
        users: 0,
        products: 0,
        orders: 0,
        order_items: 0
      }
    };

    // MongoDB Data  
    let mongodbData = {
      connected: mongoConnected,
      database: mongoose.connection.name || 'unknown',
      collections: 0,
      collectionsList: [],
      records: {
        categories: 0,
        products: 0,
        reviews: 0,
        carts: 0,
        wishlists: 0
      }
    };

    // Get MySQL information
    try {
      const dbInfo = await executeQuery('SELECT DATABASE() as current_db, VERSION() as version');
      const tables = await executeQuery('SHOW TABLES');
      
      mysqlData.connected = true;
      mysqlData.database = dbInfo[0]?.current_db || 'unknown';
      mysqlData.version = dbInfo[0]?.version || 'unknown';
      mysqlData.tables = tables.length;
      mysqlData.tablesList = tables.map(t => Object.values(t)[0]);

      // Count records in each table
      try {
        const users = await executeQuery('SELECT COUNT(*) as count FROM users');
        mysqlData.records.users = users[0]?.count || 0;
      } catch (err) {}

      try {
        const products = await executeQuery('SELECT COUNT(*) as count FROM products');
        mysqlData.records.products = products[0]?.count || 0;
      } catch (err) {}

      try {
        const orders = await executeQuery('SELECT COUNT(*) as count FROM orders');
        mysqlData.records.orders = orders[0]?.count || 0;
      } catch (err) {}

      try {
        const orderItems = await executeQuery('SELECT COUNT(*) as count FROM order_items');
        mysqlData.records.order_items = orderItems[0]?.count || 0;
      } catch (err) {}

    } catch (error) {
      console.error('MySQL status error:', error.message);
    }

    // Get MongoDB information
    if (mongoConnected) {
      try {
        // Get collections list
        const collections = await mongoose.connection.db.listCollections().toArray();
        mongodbData.collections = collections.length;
        mongodbData.collectionsList = collections.map(c => c.name);

        // Count documents in each collection
        if (mongoModels.Category) {
          mongodbData.records.categories = await mongoModels.Category.countDocuments();
        }
        if (mongoModels.Product) {
          mongodbData.records.products = await mongoModels.Product.countDocuments();
        }
        if (mongoModels.Review) {
          mongodbData.records.reviews = await mongoModels.Review.countDocuments();
        }
        if (mongoModels.Cart) {
          mongodbData.records.carts = await mongoModels.Cart.countDocuments();
        }
        if (mongoModels.Wishlist) {
          mongodbData.records.wishlists = await mongoModels.Wishlist.countDocuments();
        }

      } catch (error) {
        console.error('MongoDB status error:', error.message);
        mongodbData.connected = false;
      }
    }

    res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      mysql: mysqlData,
      mongodb: mongodbData,
      summary: {
        total_tables: mysqlData.tables,
        total_collections: mongodbData.collections,
        total_mysql_records: Object.values(mysqlData.records).reduce((a, b) => a + b, 0),
        total_mongodb_records: Object.values(mongodbData.records).reduce((a, b) => a + b, 0),
        databases_connected: (mysqlData.connected ? 1 : 0) + (mongodbData.connected ? 1 : 0)
      }
    });

  } catch (error) {
    console.error('❌ Dashboard status error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ============= EXISTING MySQL ENDPOINTS (UNCHANGED) =============
app.get('/api/status', async (req, res) => {
  try {
    const dbInfo = await executeQuery('SELECT DATABASE() as current_db, VERSION() as version');
    const tables = await executeQuery('SHOW TABLES');
    
    let userCount = 0;
    let productCount = 0;
    let orderCount = 0;
    let categoryCount = 0;
    
    try {
      const users = await executeQuery('SELECT COUNT(*) as count FROM users');
      userCount = users[0]?.count || 0;
    } catch (err) {}
    
    try {
      const products = await executeQuery('SELECT COUNT(*) as count FROM products');
      productCount = products[0]?.count || 0;
    } catch (err) {}
    
    try {
      const orders = await executeQuery('SELECT COUNT(*) as count FROM orders');
      orderCount = orders[0]?.count || 0;
    } catch (err) {}
    
    try {
      const categories = await executeQuery('SELECT COUNT(DISTINCT product_category) as count FROM products WHERE product_category IS NOT NULL');
      categoryCount = categories[0]?.count || 0;
    } catch (err) {}
    
    res.json({
      status: 'success',
      database: {
        name: dbInfo[0]?.current_db || 'unknown',
        version: dbInfo[0]?.version || 'unknown',
        tables: tables.length,
        users: userCount,
        items: productCount, // For frontend compatibility
        products: productCount,
        orders: orderCount,
        categories: categoryCount
      },
      mongodb: {
        connected: mongoConnected,
        status: mongoConnected ? 'available' : 'unavailable'
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

app.get('/api/users', async (req, res) => {
  try {
    const users = await executeQuery(`
      SELECT 
        user_id, 
        username, 
        email, 
        full_name, 
        role, 
        phone_number,
        address,
        date_of_birth,
        created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 20
    `);
    
    res.json({
      status: 'success',
      data: users,
      count: users.length
    });
    
  } catch (error) {
    console.error('Users endpoint error:', error.message);
    res.status(500).json({
      status: 'error',
      data: [],
      count: 0,
      message: 'Failed to fetch users: ' + error.message
    });
  }
});

// Items endpoint (for frontend compatibility)
app.get('/api/items', async (req, res) => {
  try {
    const items = await executeQuery(`
      SELECT 
        product_id as item_id,
        product_name as name,
        product_description as description,
        product_price as price,
        product_stock as stock_quantity,
        product_category as category_name,
        image_url,
        created_at,
        created_at as updated_at
      FROM products 
      ORDER BY created_at DESC 
      LIMIT 20
    `);
    
    res.json({
      status: 'success',
      data: items,
      count: items.length
    });
    
  } catch (error) {
    console.error('Items endpoint error:', error.message);
    res.status(500).json({
      status: 'error',
      data: [],
      count: 0,
      message: 'Failed to fetch items: ' + error.message
    });
  }
});

// Products endpoint
app.get('/api/products', async (req, res) => {
  try {
    const products = await executeQuery(`
      SELECT 
        product_id,
        product_name,
        product_description,
        product_price,
        product_stock,
        product_category,
        image_url,
        created_at
      FROM products 
      ORDER BY created_at DESC 
      LIMIT 20
    `);
    
    res.json({
      status: 'success',
      data: products,
      count: products.length
    });
    
  } catch (error) {
    console.error('Products endpoint error:', error.message);
    res.status(500).json({
      status: 'error',
      data: [],
      count: 0,
      message: 'Failed to fetch products: ' + error.message
    });
  }
});

// Categories endpoint
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await executeQuery(`
      SELECT 
        ROW_NUMBER() OVER (ORDER BY product_category) as category_id,
        product_category as name,
        CONCAT('Category for ', product_category, ' products') as description,
        MIN(created_at) as created_at,
        COUNT(*) as item_count
      FROM products 
      WHERE product_category IS NOT NULL 
      GROUP BY product_category 
      ORDER BY product_category ASC
    `);
    
    res.json({
      status: 'success',
      data: categories,
      count: categories.length
    });
    
  } catch (error) {
    console.error('Categories endpoint error:', error.message);
    res.status(500).json({
      status: 'error',
      data: [],
      count: 0,
      message: 'Failed to fetch categories: ' + error.message
    });
  }
});

// Orders endpoint
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await executeQuery(`
      SELECT 
        o.order_id,
        o.order_date,
        o.order_status,
        o.payment_method,
        o.payment_status,
        o.order_total_price,
        u.username,
        u.full_name
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      ORDER BY o.order_date DESC 
      LIMIT 20
    `);
    
    res.json({
      status: 'success',
      data: orders,
      count: orders.length
    });
    
  } catch (error) {
    console.error('Orders endpoint error:', error.message);
    res.status(500).json({
      status: 'error',
      data: [],
      count: 0,
      message: 'Failed to fetch orders: ' + error.message
    });
  }
});

// Order items endpoint
app.get('/api/order-items', async (req, res) => {
  try {
    const orderItems = await executeQuery(`
      SELECT 
        oi.order_item_id,
        oi.order_id,
        oi.quantity,
        oi.price_at_purchase,
        p.product_name,
        p.product_category,
        o.order_date,
        u.username
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      JOIN orders o ON oi.order_id = o.order_id
      JOIN users u ON o.user_id = u.user_id
      ORDER BY o.order_date DESC 
      LIMIT 20
    `);
    
    res.json({
      status: 'success',
      data: orderItems,
      count: orderItems.length
    });
    
  } catch (error) {
    console.error('Order items endpoint error:', error.message);
    res.status(500).json({
      status: 'error',
      data: [],
      count: 0,
      message: 'Failed to fetch order items: ' + error.message
    });
  }
});

app.get('/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    
    res.json({
      status: 'healthy',
      mysql: 'connected',
      mongodb: mongoConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      mysql: 'disconnected',
      mongodb: mongoConnected ? 'connected' : 'disconnected',
      error: error.message
    });
  }
});

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handlers
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

// Start server
async function startServer() {
  try {
    console.log('🚀 Starting server...');
    
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('✅ MySQL Database connected');
    
    app.listen(port, () => {
      console.log(`\n🎉 Server running at http://localhost:${port}`);
      console.log(`\n📊 MYSQL ENDPOINTS:`);
      console.log(`   Health: http://localhost:${port}/health`);
      console.log(`   Status: http://localhost:${port}/api/status`);
      console.log(`   Users: http://localhost:${port}/api/users`);
      console.log(`   Products: http://localhost:${port}/api/products`);
      console.log(`   Orders: http://localhost:${port}/api/orders`);
      
      if (mongoConnected) {
        console.log(`\n🍃 MONGODB ENDPOINTS:`);
        console.log(`   Health: http://localhost:${port}/api/mongo/health`);
        console.log(`   Categories: http://localhost:${port}/api/mongo/categories`);
        console.log(`   Products: http://localhost:${port}/api/mongo/products`);
        console.log(`   Reviews: http://localhost:${port}/api/mongo/reviews`);
        console.log(`   Carts: http://localhost:${port}/api/mongo/carts`);
        console.log(`   Wishlists: http://localhost:${port}/api/mongo/wishlists`);
        console.log(`\n📊 DASHBOARD:`);
        console.log(`   Comprehensive Status: http://localhost:${port}/api/dashboard/status`);
      } else {
        console.log(`\n⚠️  MongoDB not connected - limited features available`);
      }
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();