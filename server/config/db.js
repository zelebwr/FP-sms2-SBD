const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // 1. Connect to MongoDB using the URI from .env
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    // 2. Handle connection errors
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit the app on failure
  }
};

module.exports = connectDB;