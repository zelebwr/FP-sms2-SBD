// create the connection to MySQL using mysql2
const { Sequelize } = require('sequelize');
require('dotenv').config();

// create a new Sequelize instance for MySQL connection
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
    pool: {
      // Explicitly configure the connection pool
      max: 10,      // Maximum number of connections in pool
      min: 0,       // Minimum number of connections in pool
      acquire: 30000, // Maximum time, in milliseconds, that pool will try to get connection before throwing error
      idle: 10000     // Maximum time, in milliseconds, that a connection can be idle before being released
    }
  }
);

// Test the database connection
async function testDbConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the MySQL database:', error);
  }
}

testDbConnection();

module.exports = sequelize;