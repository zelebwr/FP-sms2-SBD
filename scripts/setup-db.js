const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  // IMPORTANT: Replace 'your_password' with your actual MySQL root password
  const rootPassword = 'password Mysql anda'; //Ganti dengan password root MYSQL
  
  // Database settings
  const dbName = 'project_db';
  const dbUser = 'project_user';
  const dbPassword = 'project_pass';
  
  console.log('🚀 Setting up database...');
  
  let rootConnection;
  let appConnection;
  
  try {
    // Connect as root
    console.log('Connecting to MySQL as root...');
    rootConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: rootPassword
    });
    
    console.log('✅ Connected as root');
    
    // Create database
    console.log(`Creating database ${dbName}...`);
    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    
    // Create user
    try {
      await rootConnection.query(`CREATE USER IF NOT EXISTS '${dbUser}'@'localhost' IDENTIFIED BY '${dbPassword}'`);
    } catch (error) {
      // User might already exist, update password
      await rootConnection.query(`ALTER USER '${dbUser}'@'localhost' IDENTIFIED BY '${dbPassword}'`);
    }
    
    // Grant privileges
    await rootConnection.query(`GRANT ALL PRIVILEGES ON ${dbName}.* TO '${dbUser}'@'localhost'`);
    await rootConnection.query('FLUSH PRIVILEGES');
    
    console.log(`✅ User ${dbUser} created and granted privileges`);
    
    // Connect as application user
    appConnection = await mysql.createConnection({
      host: 'localhost',
      user: dbUser,
      password: dbPassword,
      database: dbName,
      multipleStatements: true
    });
    
    console.log(`✅ Connected as ${dbUser}`);
    
    // Apply schema
    const schemaPath = path.join(__dirname, '../db/sql/schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('Applying schema...');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await appConnection.query(schema);
      console.log('✅ Schema applied');
      
      // Apply seed data
      const seedPath = path.join(__dirname, '../db/sql/seed_data.sql');
      if (fs.existsSync(seedPath)) {
        console.log('Applying seed data...');
        const seedData = fs.readFileSync(seedPath, 'utf8');
        await appConnection.query(seedData);
        console.log('✅ Seed data applied');
      }
    } else {
      console.log('⚠️ Schema file not found at ' + schemaPath);
    }
    
    console.log('✅ Database setup completed successfully');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (rootConnection) await rootConnection.end().catch(() => {});
    if (appConnection) await appConnection.end().catch(() => {});
  }
}

setupDatabase();