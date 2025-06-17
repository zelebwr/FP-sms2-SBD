const express = require('express');
const router = express.Router();

console.log('🛣️  Loading MongoDB routes...');

// Import models safely
let models = null;
try {
  models = require('../models/mongodb/schemas');
  console.log('✅ MongoDB models loaded for routes');
} catch (error) {
  console.error('❌ Failed to load MongoDB models:', error.message);
}

// Middleware to check MongoDB availability
const checkMongoDB = (req, res, next) => {
  if (!models) {
    return res.status(503).json({
      status: 'error',
      message: 'MongoDB models not available',
      error: 'Database connection issue'
    });
  }
  next();
};

// Health check endpoint
router.get('/health', (req, res) => {
  const { getConnectionStatus } = require('../config/database');
  const connectionStatus = getConnectionStatus();
  
  res.json({
    status: 'success',
    mongodb: {
      ...connectionStatus,
      models_loaded: !!models,
      available_endpoints: [
        'GET /api/mongo/categories',
        'POST /api/mongo/categories',
        'GET /api/mongo/ratings/product/:id',
        'POST /api/mongo/ratings'
      ]
    },
    timestamp: new Date().toISOString()
  });
});

// Categories endpoints
router.get('/categories', checkMongoDB, async (req, res) => {
  try {
    console.log('📂 Fetching categories from MongoDB...');
    const categories = await models.Category.find({ is_active: true }).sort({ name: 1 });
    
    res.json({
      status: 'success',
      data: categories,
      count: categories.length,
      source: 'MongoDB'
    });
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

router.post('/categories', checkMongoDB, async (req, res) => {
  try {
    console.log('📝 Creating new category:', req.body);
    const category = new models.Category(req.body);
    await category.save();
    
    res.status(201).json({
      status: 'success',
      data: category,
      message: 'Category created successfully'
    });
  } catch (error) {
    console.error('❌ Error creating category:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Ratings endpoints
router.get('/ratings/product/:productId', checkMongoDB, async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    console.log(`⭐ Fetching ratings for product ${productId}...`);
    
    const ratings = await models.Rating.find({ item_id: productId }).sort({ created: -1 });
    
    res.json({
      status: 'success',
      data: ratings,
      count: ratings.length,
      product_id: productId
    });
  } catch (error) {
    console.error('❌ Error fetching ratings:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

router.post('/ratings', checkMongoDB, async (req, res) => {
  try {
    console.log('📝 Creating new rating:', req.body);
    const rating = new models.Rating(req.body);
    await rating.save();
    
    res.status(201).json({
      status: 'success',
      data: rating,
      message: 'Rating created successfully'
    });
  } catch (error) {
    console.error('❌ Error creating rating:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Transactions endpoints
router.get('/transactions/user/:userId', checkMongoDB, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    console.log(`💳 Fetching transactions for user ${userId}...`);
    
    const transactions = await models.Transaction.find({ user_id: userId }).sort({ created_at: -1 });
    
    res.json({
      status: 'success',
      data: transactions,
      count: transactions.length,
      user_id: userId
    });
  } catch (error) {
    console.error('❌ Error fetching transactions:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Test endpoint to create sample data
router.post('/test/create-sample', checkMongoDB, async (req, res) => {
  try {
    console.log('🧪 Creating test data...');
    
    // Create test category
    const testCategory = new models.Category({
      category_id: 99,
      name: 'Test Category',
      desc: 'This is a test category created via API'
    });
    await testCategory.save();
    
    // Create test rating
    const testRating = new models.Rating({
      rating_id: 99,
      user_id: 1,
      item_id: 1,
      rating: 4,
      review: 'Test review created via API',
      review_title: 'API Test Review'
    });
    await testRating.save();
    
    res.json({
      status: 'success',
      message: 'Test data created successfully',
      data: {
        category: testCategory,
        rating: testRating
      }
    });
  } catch (error) {
    console.error('❌ Error creating test data:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

console.log('✅ MongoDB routes loaded successfully');

module.exports = router;