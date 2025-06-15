const fs = require('fs');
const path = require('path');

// Read package.json
const packagePath = path.join(__dirname, 'package.json');
let packageJson;

try {
  packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
} catch (error) {
  // Create new package.json if it doesn't exist
  packageJson = {
    "name": "database-project",
    "version": "1.0.0",
    "description": "Database project",
    "main": "index.js",
    "scripts": {},
    "dependencies": {},
    "devDependencies": {}
  };
}

// Update scripts
packageJson.scripts = {
  ...packageJson.scripts,
  "test-db": "node fixed-scripts/test-mysql.js",
  "setup-db": "node fixed-scripts/setup-db.js"
};

// Ensure dependencies
packageJson.dependencies = {
  ...packageJson.dependencies,
  "mysql2": "^3.6.5"
};

// Write updated package.json
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
console.log('package.json updated successfully');