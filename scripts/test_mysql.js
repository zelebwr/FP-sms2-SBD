const mysql = require('mysql2/promise');

async function testConnection() {
  // IMPORTANT: Replace 'your_password' with your actual MySQL root password
  // const password = 'password-anda'; // Ganti password dengan MYSQL
  
  console.log('Testing MySQL connection...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: password
    });
    
    console.log('✅ Connection successful!');
    await connection.end();
    return true;
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    return false;
  }
}

testConnection();