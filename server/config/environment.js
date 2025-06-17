require('dotenv').config();

const config = {
  // Server Configuration
  port: parseInt(process.env.PORT) || 8080,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database Configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    rootPassword: process.env.DB_ROOT_PASSWORD
  },
  
  // Security Configuration
  security: {
    sessionSecret: process.env.SESSION_SECRET || 'fallback-secret',
    jwtSecret: process.env.JWT_SECRET || 'fallback-jwt-secret',
    corsOrigins: process.env.CORS_ORIGINS ? 
      process.env.CORS_ORIGINS.split(',') : 
      ['http://localhost:8080']
  },
  
  // Application Settings
  app: {
    name: process.env.APP_NAME || 'Database Project',
    version: process.env.APP_VERSION || '1.0.0'
  }
};

// Validation
function validateEnvironment() {
  const required = [
    'database.user',
    'database.password', 
    'database.name'
  ];
  
  const missing = required.filter(path => {
    const keys = path.split('.');
    let obj = config;
    for (const key of keys) {
      if (!obj[key]) return true;
      obj = obj[key];
    }
    return false;
  });
  
  if (missing.length > 0) {
    throw new Error(`Missing required configuration: ${missing.join(', ')}`);
  }
}

module.exports = {
  config,
  validateEnvironment
};