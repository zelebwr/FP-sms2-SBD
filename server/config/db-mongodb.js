// create the connection to MongoDB using mongoose
const mongoose = require('mongoose');
require('dotenv').config(); 

const connectDB = async () => {
  try {
    // Connect to MongoDB using the URI from environment variables
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // Exit the app on failure
  }
};

module.exports = connectDB;
