const mongoose = require('mongoose');

// MongoDB connection function
async function connectMongoDB() {
  try {
    console.log('🍃 Attempting to connect to MongoDB...');
    
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/project_db';
    console.log('🔗 MongoDB URI:', mongoUri);

    // Connect with proper options
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Connected to database:', mongoose.connection.name);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    // Create sample data if collections are empty
    await createSampleData();
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    return false;
  }
}

// Create sample data function
async function createSampleData() {
  try {
    const { Category, Rating, Transaction, Payment } = require('../models/mongodb/schemas');
    
    // Check if categories exist
    const categoryCount = await Category.countDocuments();
    console.log(`📂 Found ${categoryCount} categories in MongoDB`);
    
    if (categoryCount === 0) {
      console.log('📝 Creating sample categories...');
      
      const sampleCategories = [
        { category_id: 1, name: 'Electronics', desc: 'Electronic devices and accessories' },
        { category_id: 2, name: 'Clothing', desc: 'Fashion and apparel' },
        { category_id: 3, name: 'Books', desc: 'Books and educational materials' },
        { category_id: 4, name: 'Home & Garden', desc: 'Home improvement and garden supplies' },
        { category_id: 5, name: 'Sports', desc: 'Sports and outdoor equipment' }
      ];

      for (const catData of sampleCategories) {
        const category = new Category(catData);
        await category.save();
      }
      
      console.log(`✅ Created ${sampleCategories.length} sample categories`);
    }

    // Create a sample rating
    const ratingCount = await Rating.countDocuments();
    if (ratingCount === 0) {
      const sampleRating = new Rating({
        rating_id: 1,
        user_id: 1,
        item_id: 1,
        rating: 5,
        review: 'Great product! Highly recommend.',
        review_title: 'Excellent Quality',
        verified_purchase: true
      });
      await sampleRating.save();
      console.log('✅ Created sample rating');
    }

  } catch (error) {
    console.error('⚠️  Sample data creation failed:', error.message);
  }
}

// Get MongoDB connection status
function getConnectionStatus() {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  return {
    state: mongoose.connection.readyState,
    status: states[mongoose.connection.readyState] || 'unknown',
    database: mongoose.connection.name || 'none'
  };
}

module.exports = { 
  connectMongoDB, 
  getConnectionStatus,
  mongoose 
};