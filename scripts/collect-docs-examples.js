#!/usr/bin/env node

/**
 * Collect documentation examples from docs/ directory
 * 
 * This script scans all markdown files in docs/ (excluding specific folders like presentations)
 * and extracts example blocks that use {% include components/sampletabs_tpl.md ... %}
 * 
 * For each example, it:
 * - Extracts the include parameters (formId, htmlSource, cssSource, jsHead, jsHidden, jsSource, etc.)
 * - Resolves {% capture %} blocks that contain the actual content
 * - Applies special transformations:
 *   - █ (filled square) → spaces (indentation hack)
 *   - $$ → formId suffix
 * - Strips !important from CSS
 * - Outputs a JSON manifest with all examples for testing
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const OUTPUT_DIR = path.join(__dirname, '..', 'test', '.cache');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'docs_examples.json');

// Folders to exclude from scanning
const EXCLUDE_FOLDERS = [
  'presentations',
  '_site',
  '_layouts',
  'assets',
  '.jekyll-cache'
];

/**
 * Find all markdown files in docs/
 */
function findMarkdownFiles(dir, excludeFolders = []) {
  const results = [];
  
  function scan(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = path.relative(dir, fullPath);
      
      // Skip excluded folders
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

/**
 * Extract {% capture varName %}...{% endcapture %} blocks from markdown
 */
function extractCaptures(content) {
  const captures = {};
  const captureRegex = /{%\s*capture\s+(\w+)\s*%}([\s\S]*?){%\s*endcapture\s*%}/g;
  
  let match;
  while ((match = captureRegex.exec(content)) !== null) {
    const [, varName, varContent] = match;
    captures[varName] = varContent.trim();
  }
  
  return captures;
}

/**
 * Interpolate {{ varName }} in text using capture variables
 */
function interpolateVariables(text, captures) {
  if (!text || typeof text !== 'string') return text;
  
  // Replace {{ varName }} with captured content
  return text.replace(/{{\s*(\w+)\s*}}/g, (match, varName) => {
    if (captures[varName] !== undefined) {
      return captures[varName];
    }
    return match;
  });
}

/**
 * Parse include parameters from {% include components/sampletabs_tpl.md ... %} block
 */
function parseIncludeParams(includeBlock) {
  const params = {};
  
  // Extract parameter assignments like: formId="simple_list" or formId=simple_list
  // Match: key=value where value can be quoted or unquoted, but stop at whitespace or %}
  const paramRegex = /(\w+)=("([^"]*)"|'([^']*)'|([^\s%]+))/g;
  let match;
  
  while ((match = paramRegex.exec(includeBlock)) !== null) {
    const [, key, , doubleQuoted, singleQuoted, unquoted] = match;
    params[key] = doubleQuoted || singleQuoted || unquoted;
  }
  
  return params;
}

/**
 * Apply transformations to content:
 * - Replace █ with spaces (indentation hack)
 * - Replace $$ with formId
 */
function applyTransformations(content, formId) {
  if (!content || typeof content !== 'string') return content;
  
  // Replace █ with 4 spaces (indentation hack used in docs)
  let transformed = content.replace(/█/g, '    ');
  
  // Replace $$ with formId
  if (formId) {
    transformed = transformed.replace(/\$\$/g, formId);
  }
  
  return transformed;
}

/**
 * Strip !important from CSS
 */
function stripImportant(css) {
  if (!css || typeof css !== 'string') return css;
  return css.replace(/\s*!important/g, '');
}

/**
 * Extract examples from a markdown file
 */
function extractExamples(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(DOCS_DIR, filePath);
  const examples = [];
  
  // Extract all captures first
  const captures = extractCaptures(content);
  
  // Find all {% include components/sampletabs_tpl.md ... %} blocks
  // This regex handles multi-line includes
  const includeRegex = /{%\s*include\s+components\/sampletabs_tpl\.md\s*([\s\S]*?)%}/gm;
  
  let match;
  let exampleIndex = 0;
  
  while ((match = includeRegex.exec(content)) !== null) {
    const [fullMatch, paramsBlock] = match;
    const params = parseIncludeParams(paramsBlock);
    
    // Resolve parameter values from captures or use directly
    // Note: formId should NOT be resolved from captures - it's used as-is
    const resolvedParams = {};
    for (const [key, value] of Object.entries(params)) {
      const cleanValue = value;
      
      // formId is always used directly, not resolved from captures
      if (key === 'formId') {
        resolvedParams[key] = cleanValue;
      }
      // Check if it's a reference to a capture variable
      else if (captures[cleanValue]) {
        resolvedParams[key] = captures[cleanValue];
      } else {
        resolvedParams[key] = cleanValue;
      }
    }
    
    // Interpolate variables in resolved content
    for (const [key, value] of Object.entries(resolvedParams)) {
      resolvedParams[key] = interpolateVariables(value, captures);
    }
    
    const formId = resolvedParams.formId || `example_${exampleIndex}`;
    
    // Apply transformations
    const htmlSource = applyTransformations(resolvedParams.htmlSource, `-${formId}`);
    const cssSource = stripImportant(resolvedParams.cssSource || '');
    const jsHead = applyTransformations(resolvedParams.jsHead, `-${formId}`);
    const jsHidden = applyTransformations(resolvedParams.jsHidden, `-${formId}`);
    const jsSource = applyTransformations(resolvedParams.jsSource, `-${formId}`);
    
    // Default jsHead if not provided
    const defaultJsHead = `const myForm = new SmarkForm(document.getElementById("myForm-${formId}"));`;
    
    examples.push({
      id: `${relativePath.replace(/\//g, '_').replace(/\.md$/, '')}_${formId}`,
      file: relativePath,
      formId,
      htmlSource: htmlSource || '',
      cssSource: cssSource || '',
      jsHead: jsHead || defaultJsHead,
      jsHidden: jsHidden || '',
      jsSource: jsSource || '',
      notes: resolvedParams.notes || '',
      showEditor: resolvedParams.showEditor === 'true',
      showEditorSource: resolvedParams.showEditorSource === 'true',
      addLoadSaveButtons: resolvedParams.addLoadSaveButtons === 'true',
    });
    
    exampleIndex++;
  }
  
  return examples;
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Scanning docs/ for examples...');
  
  const markdownFiles = findMarkdownFiles(DOCS_DIR, EXCLUDE_FOLDERS);
  console.log(`📄 Found ${markdownFiles.length} markdown files`);
  
  const allExamples = [];
  
  for (const file of markdownFiles) {
    try {
      const examples = extractExamples(file);
      if (examples.length > 0) {
        console.log(`  ✓ ${path.relative(DOCS_DIR, file)}: ${examples.length} example(s)`);
        allExamples.push(...examples);
      }
    } catch (error) {
      console.error(`  ✗ Error processing ${file}:`, error.message);
    }
  }
  
  console.log(`\n✅ Collected ${allExamples.length} examples total`);
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Write manifest
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allExamples, null, 2));
  console.log(`💾 Manifest written to: ${path.relative(process.cwd(), OUTPUT_FILE)}`);
}

main();
