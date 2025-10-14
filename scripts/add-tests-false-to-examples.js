#!/usr/bin/env node

/**
 * Helper script to add tests=false to all examples that don't have a tests parameter
 * 
 * This is a one-time migration script to update existing documentation examples
 * to comply with the new requirement that all examples must have a tests parameter.
 * 
 * Usage:
 *   node scripts/add-tests-false-to-examples.js
 *   
 * The script will:
 * 1. Find all {% include components/sampletabs_tpl.md ... %} blocks in docs/
 * 2. Check if they have a tests= parameter
 * 3. If not, add tests=false to the block
 * 4. Write the changes back to the file
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const EXCLUDE_FOLDERS = [
  'presentations',
  '_site',
  '_layouts',
  'assets',
  '.jekyll-cache'
];

function findMarkdownFiles(dir, excludeFolders = []) {
  const results = [];
  
  function scan(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = path.relative(dir, fullPath);
      
      if (entry.isDirectory()) {
        const shouldExclude = excludeFolders.some(excluded => 
          relativePath.startsWith(excluded) || entry.name === excluded
        );
        if (!shouldExclude) {
          scan(fullPath);
        }
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        results.push(fullPath);
      }
    }
  }
  
  scan(dir);
  return results;
}

function addTestsFalseToFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  let count = 0;
  
  // Find all {% include components/sampletabs_tpl.md ... %} blocks
  const includeRegex = /{%\s*include\s+components\/sampletabs_tpl\.md\s*([\s\S]*?)%}/gm;
  
  content = content.replace(includeRegex, (match, paramsBlock) => {
    // Check if tests= parameter already exists
    if (/\btests\s*=/.test(paramsBlock)) {
      return match; // Already has tests parameter, leave it alone
    }
    
    // Add tests=false before the closing %}
    // Insert it at the end of the parameter block
    const newParamsBlock = paramsBlock.trimEnd() + '\n    tests=false\n';
    const newMatch = match.replace(paramsBlock, newParamsBlock);
    modified = true;
    count++;
    return newMatch;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return count;
  }
  
  return 0;
}

function main() {
  console.log('🔍 Scanning docs/ for examples without tests parameter...\n');
  
  const markdownFiles = findMarkdownFiles(DOCS_DIR, EXCLUDE_FOLDERS);
  let totalFiles = 0;
  let totalExamples = 0;
  
  for (const file of markdownFiles) {
    const count = addTestsFalseToFile(file);
    if (count > 0) {
      const relativePath = path.relative(DOCS_DIR, file);
      console.log(`  ✓ ${relativePath}: Added tests=false to ${count} example(s)`);
      totalFiles++;
      totalExamples += count;
    }
  }
  
  console.log(`\n✅ Updated ${totalExamples} example(s) in ${totalFiles} file(s)`);
  console.log('\n💡 Run the collector to regenerate the manifest:');
  console.log('   node scripts/collect-docs-examples.js');
}

main();
