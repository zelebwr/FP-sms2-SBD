// In server/scripts/setup.js
const { setupMySQL } = require('./setup-mysql.js');
const { setupMongoDB } = require('./setup-mongodb.js');

async function main() {
  try {
    console.log('🚀 Starting full database setup...');
    await setupMySQL();
    await setupMongoDB();
    console.log('🎉 Full database setup completed successfully!');
  } catch (error) {
    console.error('❌ An error occurred during the main setup:', error.message);
    process.exit(1);
  }
}

main();