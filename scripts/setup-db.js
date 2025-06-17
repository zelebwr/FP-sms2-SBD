const path = require('path');
const fs = require('fs');

// Load .env from the correct path
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
  console.log('✅ .env file loaded from:', envPath);
} else {
  console.log('⚠️ .env file not found at:', envPath);
  require('dotenv').config();
}

const mysql = require('mysql2/promise');

async function setupDatabase() {
  console.log('🚀 Setting up database...');
  
  // Get password from environment
  const rootPassword = process.env.DB_ROOT_PASSWORD;
  console.log(`🔑 Using root password from .env: "${rootPassword ? '[HIDDEN]' : '(empty)'}"`);
  
  const dbName = process.env.DB_NAME || 'project_db';
  const dbUser = process.env.DB_USER || 'project_user';
  const dbPassword = process.env.DB_PASSWORD || 'project_pass';
  
  console.log(`📊 Database: ${dbName}`);
  console.log(`👤 User: ${dbUser}`);
  
  let rootConnection;
  
  try {
    console.log('🔌 Connecting to MySQL as root...');
    rootConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: rootPassword || ''
    });
    console.log('✅ Connected as root successfully');
    
    // Create database
    console.log(`📂 Creating database: ${dbName}`);
    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    
    // Create user
    console.log(`👤 Creating/updating user: ${dbUser}`);
    try {
      await rootConnection.query(
        `CREATE USER IF NOT EXISTS '${dbUser}'@'localhost' IDENTIFIED BY '${dbPassword}'`
      );
    } catch (error) {
      // User might exist, update password
      await rootConnection.query(
        `ALTER USER '${dbUser}'@'localhost' IDENTIFIED BY '${dbPassword}'`
      );
    }
    
    // Grant privileges
    await rootConnection.query(
      `GRANT ALL PRIVILEGES ON \`${dbName}\`.* TO '${dbUser}'@'localhost'`
    );
    await rootConnection.query('FLUSH PRIVILEGES');
    console.log(`✅ User ${dbUser} configured with full privileges`);
    
    // Close root connection
    await rootConnection.end();
    
    // Connect as application user
    console.log(`🔌 Connecting as application user: ${dbUser}`);
    const appConnection = await mysql.createConnection({
      host: 'localhost',
      user: dbUser,
      password: dbPassword,
      database: dbName
    });
    console.log('✅ Connected as application user');
    
    // Create tables
    console.log('📋 Creating database schema...');
    await appConnection.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS categories (
        category_id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS items (
        item_id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2),
        stock_quantity INT DEFAULT 0,
        category_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(category_id)
      );
    `);
    console.log('✅ Database schema created');
    
    // Insert sample data
    console.log('🌱 Inserting sample data...');
    await appConnection.query(`
      INSERT IGNORE INTO categories (name, description) VALUES
      ('Electronics', 'Electronic devices and gadgets'),
      ('Books', 'Books and publications'),
      ('Clothing', 'Clothing and accessories');
      
      INSERT IGNORE INTO users (username, email, password_hash, full_name, role) VALUES
      ('admin', 'admin@example.com', '$2b$10$example_hash', 'Administrator', 'admin'),
      ('john_doe', 'john@example.com', '$2b$10$example_hash', 'John Doe', 'user'),
      ('jane_smith', 'jane@example.com', '$2b$10$example_hash', 'Jane Smith', 'user'),
      ('bob_wilson', 'bob@example.com', '$2b$10$example_hash', 'Bob Wilson', 'user');
      
      INSERT IGNORE INTO items (name, description, price, stock_quantity, category_id) VALUES
      ('Gaming Laptop', 'High-performance gaming laptop with RTX graphics', 1499.99, 8, 1),
      ('Wireless Mouse', 'Ergonomic wireless gaming mouse', 59.99, 25, 1),
      ('Mechanical Keyboard', 'RGB mechanical gaming keyboard', 129.99, 15, 1),
      ('JavaScript: The Good Parts', 'Essential JavaScript programming guide', 34.99, 40, 2),
      ('Clean Code', 'A handbook of agile software craftsmanship', 42.99, 30, 2),
      ('Python Crash Course', 'Hands-on introduction to programming', 39.99, 50, 2),
      ('Cotton T-Shirt', 'Premium cotton crew neck t-shirt', 24.99, 100, 3),
      ('Slim Fit Jeans', 'Classic dark wash slim fit jeans', 79.99, 60, 3),
      ('Hoodie', 'Comfortable pullover hoodie', 49.99, 40, 3);
    `);
    console.log('✅ Sample data inserted');
    
    // Verify data
    const [userCount] = await appConnection.query('SELECT COUNT(*) as count FROM users');
    const [itemCount] = await appConnection.query('SELECT COUNT(*) as count FROM items');
    const [categoryCount] = await appConnection.query('SELECT COUNT(*) as count FROM categories');
    
    console.log(`📊 Data summary:`);
    console.log(`   Users: ${userCount[0].count}`);
    console.log(`   Items: ${itemCount[0].count}`);
    console.log(`   Categories: ${categoryCount[0].count}`);
    
    await appConnection.end();
    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n🔍 Troubleshooting tips:');
      console.error('1. Check your MySQL root password is correct');
      console.error('2. Make sure MySQL service is running');
      console.error('3. Verify your .env file format (no spaces around =)');
      console.error('4. Try connecting manually: mysql -u root -p');
    }
    
    if (rootConnection) {
      await rootConnection.end().catch(() => {});
    }
    process.exit(1);
  }
}

// Run the setup
setupDatabase();