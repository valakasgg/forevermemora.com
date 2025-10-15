#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Production Build Script for Memora
 * Removes console logs and optimizes for production
 */

console.log('🏗️ Starting production build...');

// Files to process
const filesToProcess = [
  'index.html',
  'src/config-amplify.js',
  'src/local-dev-config.js',
  'src/payment.js'
];

// Process each file
filesToProcess.forEach(filePath => {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (fs.existsSync(fullPath)) {
    console.log(`📝 Processing: ${filePath}`);
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Remove console.log statements (but keep console.error for debugging)
    content = content.replace(/console\.log\([^)]*\);?\s*/g, '');
    content = content.replace(/console\.warn\([^)]*\);?\s*/g, '');
    
    // Remove debug comments
    content = content.replace(/\/\/ Debug:.*$/gm, '');
    content = content.replace(/\/\* Debug:[\s\S]*?\*\//g, '');
    
    // Remove development-only code blocks
    content = content.replace(/if\s*\(\s*DEBUG\s*\)\s*\{[\s\S]*?\}/g, '');
    content = content.replace(/if\s*\(\s*config\.DEBUG\s*\)\s*\{[\s\S]*?\}/g, '');
    
    // Fix any syntax issues (remove trailing commas in objects)
    content = content.replace(/,(\s*[}\]])/g, '$1');
    
    // Fix template literal issues - convert to string concatenation
    content = content.replace(/`([^`]*)\$\{([^}]+)\}([^`]*)`/g, function(match, before, varName, after) {
      return "'" + before + "' + " + varName + " + '" + after + "'";
    });
    
    // Write the processed file
    fs.writeFileSync(fullPath, content);
    
    console.log(`✅ Processed: ${filePath}`);
  } else {
    console.log(`⚠️ File not found: ${filePath}`);
  }
});

console.log('🎉 Production build completed!');
console.log('📦 Files are ready for deployment');
