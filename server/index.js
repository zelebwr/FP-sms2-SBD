// Import required packages
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // This loads the .env file

// Create an Express application
const app = express();

// Use middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow the server to accept JSON in request bodies

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