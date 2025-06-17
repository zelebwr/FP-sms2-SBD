// MySQL setup script
require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupMySQL() {
  console.log('\n📦 Setting up MySQL database...');
  
  // Debug environment variables
  console.log('MySQL Connection Debug:');
  console.log('- Host:', process.env.MYSQL_HOST || 'Not set');
  console.log('- User:', process.env.DB_ROOT_USER || 'Not set');
  console.log('- DB_ROOT_PASSWORD length:', process.env.DB_ROOT_PASSWORD ? process.env.DB_ROOT_PASSWORD.length : 'Not set');
  console.log('- Database:', process.env.MYSQL_DATABASE || 'Not set');
  
  let rootConnection;
  let appConnection;
  
  try {
    // Use fallback values if environment variables are not defined
    const connectionConfig = {
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.DB_ROOT_USER || 'root',
      password: process.env.DB_ROOT_PASSWORD || ''
    };
    
    console.log(`🔄 Attempting to connect to MySQL as user: ${connectionConfig.user}`);
    
    // Connect as root to create database and user
    rootConnection = await mysql.createConnection(connectionConfig);
    
    console.log('✅ Connected to MySQL server as root');
    
    // Create database if it doesn't exist
    const dbName = process.env.MYSQL_DATABASE || 'project_db';
    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✅ Database '${dbName}' created or already exists`);
    
    // Create user if it doesn't exist
    const appUser = process.env.MYSQL_USER || 'app_user';
    const appPassword = process.env.MYSQL_PASSWORD || 'app_password';
    
    try {
      await rootConnection.query(
        `CREATE USER IF NOT EXISTS '${appUser}'@'localhost' IDENTIFIED BY '${appPassword}'`
      );
      console.log(`✅ User '${appUser}' created or already exists`);
    } catch (error) {
      // User might already exist with different password, try to update
      await rootConnection.query(
        `ALTER USER '${appUser}'@'localhost' IDENTIFIED BY '${appPassword}'`
      );
      console.log(`✅ User '${appUser}' password updated`);
    }
    
    // Grant privileges
    await rootConnection.query(
      `GRANT ALL PRIVILEGES ON ${dbName}.* TO '${appUser}'@'localhost'`
    );
    await rootConnection.query('FLUSH PRIVILEGES');
    console.log(`✅ Privileges granted to '${appUser}'`);
    
    // Close root connection
    await rootConnection.end();
    
    // Connect as application user
    appConnection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: appUser,
      password: appPassword,
      database: dbName,
      multipleStatements: true
    });
    
    console.log(`✅ Connected to MySQL as '${appUser}'`);
    
    // Apply schema from SQL file
    const schemaPath = path.join(__dirname, '../db/sql/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await appConnection.query(schema);
      console.log('✅ Schema applied successfully');
    } else {
      console.log('⚠️ Schema file not found at:', schemaPath);
    }
    
    // Apply seed data if available
    const seedPath = path.join(__dirname, '../db/sql/seed_data.sql');
    if (fs.existsSync(seedPath)) {
      const seedData = fs.readFileSync(seedPath, 'utf8');
      await appConnection.query(seedData);
      console.log('✅ Seed data applied successfully');
    } else {
      console.log('ℹ️ No seed data file found');
    }
    
    console.log('✅ MySQL setup completed successfully');
    return true;
    
  } catch (error) {
    console.error('❌ MySQL setup error:', error.message);
    throw error;
  } finally {
    if (rootConnection) await rootConnection.end().catch(() => {});
    if (appConnection) await appConnection.end().catch(() => {});
  }
}

module.exports = { setupMySQL };