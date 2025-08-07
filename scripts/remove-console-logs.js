#!/usr/bin/env node

/**
 * Script to remove or comment out console.log statements
 * Run with: node scripts/remove-console-logs.js
 */

const fs = require('fs');
const path = require('path');

const EXCLUDE_DIRS = ['node_modules', '.git', 'ios', 'android', '.expo'];
const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

let totalRemoved = 0;

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = content;
  let count = 0;

  // Pattern to match console.log, console.warn, console.error statements
  const consolePattern = /console\.(log|warn|error|info|debug)\([^)]*\);?/g;
  
  // Comment out console statements instead of removing
  modified = modified.replace(consolePattern, (match) => {
    count++;
    return `// ${match}`;
  });

  if (count > 0) {
    fs.writeFileSync(filePath, modified);
    console.log(`✓ Processed ${filePath} - commented ${count} console statements`);
    totalRemoved += count;
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(file)) {
        walkDir(filePath);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(file);
      if (FILE_EXTENSIONS.includes(ext)) {
        processFile(filePath);
      }
    }
  });
}

console.log('🔍 Searching for console statements...\n');

// Start from project root
walkDir(process.cwd());

console.log(`\n✅ Complete! Commented out ${totalRemoved} console statements.`);
console.log('\n💡 Tip: To use the logger utility instead, import it:');
console.log("   import { logger } from '@/utils/logger';");
console.log("   logger.log('your message');");