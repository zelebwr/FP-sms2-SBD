// In server/scripts/setup-mysql.js
require('dotenv').config({ path: '../.env' }); // Load .env from the server directory
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupMySQL() {
  console.log('\n📦 Setting up MySQL database...');
  let connection;
  try {
    // Connect to the MySQL server (without specifying a database)
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      multipleStatements: true // IMPORTANT: This allows running the whole SQL script at once
    });

    console.log('✅ Connected to MySQL server.');

    // Read the entire SQL schema file
    const schemaPath = path.join(__dirname, '../db/mysql_schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    // Execute the entire script
    await connection.query(schemaSQL);
    console.log('✅ MySQL database and tables created successfully.');

    // apply seed data if available
    const seedPath = path.join(__dirname, '../db/mysql_seed.sql');
    if (fs.existsSync(seedPath)) {
      const seedSQL = fs.readFileSync(seedPath, 'utf8');
      await connection.query(seedSQL);
      console.log('✅ MySQL seed data inserted successfully.');
    } else {
      console.log('ℹ️ MySQL seed file not found, skipping.');
    }

  } catch (error) {
    console.error('❌ MySQL setup failed:', error.message);
    throw error; // Re-throw the error to stop the main setup script
  } finally {
    if (connection) {
      await connection.end();
      console.log('MySQL connection closed.');
    }
  }
}

module.exports = { setupMySQL };