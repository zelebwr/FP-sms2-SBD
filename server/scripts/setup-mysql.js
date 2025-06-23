require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs'); // We need bcryptjs to hash passwords
const usersSeedData = require('../db/users_seed.js');

async function setupMySQL() {
  console.log('\n📦 Setting up MySQL database...');
  let connection;
  try {
    // 1. Create a raw connection to run the full schema script first.
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      multipleStatements: true // Allows running multiple queries from the file
    });
    console.log('✅ Connected to MySQL server.');

    // 2. Execute the schema file which handles DB creation, dropping, and creating tables.
    const schemaPath = path.join(__dirname, '../db/mysql_schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schemaSQL);
    console.log('✅ MySQL schema created successfully.');
    
    // We must explicitly use the javva_ecommerce_db for the following commands.
    await connection.query(`USE \`${process.env.MYSQL_DATABASE}\`;`);

    // 3. Seed Users with hashed passwords using a raw query
    console.log('🌱 Hashing and seeding user data...');

    const salt = await bcrypt.genSalt(10);
    for (const user of usersSeedData) {
        const hashedPassword = await bcrypt.hash(user.password, salt);
        await connection.query(
            'INSERT INTO Users (user_id, full_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [user.user_id, user.full_name, user.email, hashedPassword, user.role]
        );
    }
    console.log('✅ User seed data inserted successfully.');
    
    // 4. Seed Products using the raw connection.
    const seedProductPath = path.join(__dirname, '../db/mysql_seed.sql');
    if (fs.existsSync(seedProductPath)) {
      const seedSQL = fs.readFileSync(seedProductPath, 'utf8');
      await connection.query(seedSQL);
      console.log('✅ MySQL product seed data inserted successfully.');
    } else {
      console.log('ℹ️ MySQL product seed file not found, skipping.');
    }

  } catch (error) {
    console.error('❌ MySQL setup failed:', error.message);
    throw error;
  } finally {
    // Close the raw connection if it was opened
    if (connection) {
      await connection.end();
      console.log('MySQL connection closed.');
    }
    // No longer need to close sequelize here as it's not used in setup.
  }
}

module.exports = { setupMySQL };
