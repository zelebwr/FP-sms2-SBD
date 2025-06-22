// In server/scripts/setup-mongodb.js
require('dotenv').config({ path: '../.env' }); // Load .env from the server directory
const { MongoClient } = require('mongodb');
const { ratingsSchema, cartsSchema, wishlistsSchema } = require('../db/mongo_schema.js');
const { sampleRatings } = require('../db/mongo_seed.js');

async function setupMongoDB() {
  console.log('\n📦 Setting up MongoDB collections...');
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('✅ Connected to MongoDB server.');

    // Select the database
    const db = client.db('javva_ecommerce_db');

    // Drop existing collections to ensure a clean slate.
    console.log('Dropping existing collections...');
    await db.collection('ratings').drop().catch(e => { if(e.codeName !== 'NamespaceNotFound') throw e; });
    await db.collection('carts').drop().catch(e => { if(e.codeName !== 'NamespaceNotFound') throw e; });
    await db.collection('wishlists').drop().catch(e => { if(e.codeName !== 'NamespaceNotFound') throw e; });
    console.log('✅ Existing collections dropped.');

    // Create collections using the imported schemas and wait for each one to complete.
    await db.createCollection('ratings', ratingsSchema);
    console.log('   - "ratings" collection created.');
    await db.createCollection('carts', cartsSchema);
    console.log('   - "carts" collection created.');
    await db.createCollection('wishlists', wishlistsSchema);
    console.log('   - "wishlists" collection created.');

    console.log('✅ MongoDB collections and validators created successfully.');
    
    // Apply seed data if available
    if (sampleRatings && sampleRatings.length > 0) {
        console.log('🌱 Seeding MongoDB data...');
        await db.collection('ratings').insertMany(sampleRatings);
        console.log('✅ MongoDB seed data inserted successfully.');
    } else {
        console.log('ℹ️ No MongoDB seed data to insert.');
    }

  } catch (error) {
    console.error('❌ MongoDB setup failed:', error.message);
    throw error;
  } finally {
    await client.close();
    console.log('MongoDB connection closed.');
  }
}

module.exports = { setupMongoDB };