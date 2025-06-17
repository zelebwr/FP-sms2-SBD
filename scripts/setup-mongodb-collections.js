// scripts/setup-mongodb.js
require('dotenv').config();
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function setupMongoDB() {
  console.log('\n📦 Setting up MongoDB database...');
  
  let client;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`, {
      // Add auth credentials if needed for initial connection
      // auth: {
      //   username: process.env.DB_ROOT_USER,
      //   password: process.env.DB_ROOT_PASSWORD
      // }
    });
    
    await client.connect();
    console.log('✅ Connected to MongoDB server');
    
    const adminDb = client.db('admin');
    
    // Check if database exists and force reset if needed
    if (process.env.FORCE_RESET_DB === 'true') {
      console.log('🔄 Force reset enabled, dropping database...');
      await client.db(process.env.MONGO_DATABASE).dropDatabase();
      console.log('✅ Database dropped');
      
      // Try to drop user if it exists
      try {
        await adminDb.command({ 
          dropUser: process.env.MONGO_USER 
        });
        console.log('✅ User dropped');
      } catch (err) {
        // User might not exist, which is fine
      }
    }
    
    // Create database by using it (MongoDB creates databases on first use)
    const db = client.db(process.env.MONGO_DATABASE);
    
    // Create user for this database if auth is enabled
    try {
      await adminDb.command({ 
        createUser: process.env.MONGO_USER,
        pwd: process.env.MONGO_PASSWORD,
        roles: [
          { role: 'readWrite', db: process.env.MONGO_DATABASE }
        ]
      });
      console.log(`✅ User '${process.env.MONGO_USER}' created`);
    } catch (err) {
      // User might already exist
      if (err.code === 51003) {
        console.log(`ℹ️ User '${process.env.MONGO_USER}' already exists`);
      } else {
        // If MongoDB is running without auth, this will fail but we can continue
        console.log(`ℹ️ Note: ${err.message}`);
        console.log('ℹ️ Continuing without user creation (MongoDB might be running without auth)');
      }
    }
    
    // Apply schema from JS file
    const schemaPath = path.join(__dirname, '../db/nosql/schema.js');
    if (fs.existsSync(schemaPath)) {
      let schemaScript = fs.readFileSync(schemaPath, 'utf8');
      
      // Modify the script to work in our context
      schemaScript = schemaScript.replace(/db = db.getSiblingDB\(['"](.*)['"]\);?/g, '');
      
      // Create a context with the db object
      const context = { db, console };
      vm.runInNewContext(schemaScript, context);
      
      console.log('✅ MongoDB schema applied');
    } else {
      console.log('⚠️ MongoDB schema file not found at:', schemaPath);
    }
    
    // Apply seed data if available
    const seedPath = path.join(__dirname, '../db/nosql/seed_data.js');
    if (fs.existsSync(seedPath)) {
      let seedScript = fs.readFileSync(seedPath, 'utf8');
      seedScript = seedScript.replace(/db = db.getSiblingDB\(['"](.*)['"]\);?/g, '');
      
      const context = { db, console };
      vm.runInNewContext(seedScript, context);
      
      console.log('✅ MongoDB seed data applied');
      
      // Display some sample data
      const userCount = await db.collection('users').countDocuments();
      console.log(`ℹ️ Database populated with ${userCount} users`);
    } else {
      console.log('ℹ️ No MongoDB seed data file found');
    }
    
    console.log('✅ MongoDB setup completed successfully');
    
  } catch (error) {
    console.error('❌ MongoDB setup error:', error.message);
    if (error.message.includes('connect')) {
      console.log('\n⚠️ Is MongoDB server running? Try starting it:');
      console.log('   - Windows: net start mongodb');
      console.log('   - Mac/Linux: sudo service mongod start');
      
      // Try to start MongoDB if possible (Windows)
      try {
        console.log('🔄 Attempting to start MongoDB service...');
        await exec('net start mongodb');
        console.log('✅ MongoDB service started successfully');
        console.log('🔄 Please run the setup again');
      } catch (startError) {
        console.log('⚠️ Could not automatically start MongoDB');
      }
    }
    throw error;
  } finally {
    if (client) await client.close().catch(() => {});
  }
}

module.exports = { setupMongoDB };