const express = require('express');
const cors = require('cors');
require('dotenv').config(); // loads the .env file

// --- DATABASE CONNECTIONS ---

// MYSQL CONNECTION 
const pool = require('./config/mysql.js'); // MySQL connection pool
(async () => {
  try {
    // get a connection from the pool to test the connection
    const connnection = await pool.getConnection();
    console.log('Pinging MySQL database...');

    // test connection by running a simple query
    const [rows] = await connnection.execute('SELECT 1 + 1 AS result');
    
    // if it reaches here, the connection is successful
    console.log('✅ MySQL database connected successfuly!');
    console.log('✅ MySQL connection successful (should show 2):', rows[0].result); 
    
    // release the connection back to the pool
    connnection.release();
  } 
  catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    process.exit(1); // Exit the app on failure
  }
})();

// MONGODB CONNECTION
const connectDB = require('./config/mongodb.js'); // MongoDB connection function
connectDB() // call the function to connect to MongoDB


// --- SERVER SETUP ---
const app = express(); // create an Express application

// Use middleware
app.use(cors()); // enable Cross-Origin Resource Sharing
app.use(express.json()); // allow the server to accept JSON in request bodies

// Define a simple test route
app.get('/', (req, res) => {
  res.json({ message: "👋 Hello from the backend! The server is running correctly." });
});

// Get the port from environment variables, with a default of 8080
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});