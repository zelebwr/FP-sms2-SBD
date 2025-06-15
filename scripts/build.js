const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Building project...');

// Create build directory if it doesn't exist
const buildDir = path.join(__dirname, '../build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

try {
  // Copy server files
  console.log('📦 Copying server files...');
  fs.copyFileSync(
    path.join(__dirname, '../server.js'),
    path.join(buildDir, 'server.js')
  );
  
  // If you have a public directory with static assets
  const publicDir = path.join(__dirname, '../public');
  const buildPublicDir = path.join(buildDir, 'public');
  
  if (fs.existsSync(publicDir)) {
    if (!fs.existsSync(buildPublicDir)) {
      fs.mkdirSync(buildPublicDir, { recursive: true });
    }
    
    // Copy all files from public to build/public
    if (fs.existsSync(publicDir)) {
      fs.readdirSync(publicDir).forEach(file => {
        const srcPath = path.join(publicDir, file);
        const destPath = path.join(buildPublicDir, file);
        fs.copyFileSync(srcPath, destPath);
      });
    }
    
    console.log('📦 Copied static assets');
  }
  
  console.log('✅ Build completed successfully!');
  console.log('📂 Build output is in the "build" directory');
  console.log('🚀 To run the built application:');
  console.log('   node build/server.js');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}