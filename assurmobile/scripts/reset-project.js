#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('Resetting Assurmobile project...');

console.log('Installing dependencies...');
const { execSync } = require('child_process');

try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Project reset successfully!');
} catch (error) {
  console.error('❌ Failed to reset project:', error.message);
  process.exit(1);
}
