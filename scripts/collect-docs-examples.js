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
 * - Outputs a JSON test manifest and an ordered Showcase include for
 *   sampletabs marked with `showcase_order`
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jsonc from 'jsonc';
import { extractHeadings } from './generate-chaptertocs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const OUTPUT_DIR = path.join(__dirname, '..', 'test', '.cache');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'docs_examples.json');
const SHOWCASE_INCLUDE_FILE = path.join(DOCS_DIR, '_includes', 'showcase_examples.md');

// Folders to exclude from scanning
const EXCLUDE_FOLDERS = [
  'presentations',
  '_site',
  '_includes',
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
  const captureRegex = /{%-?\s*capture\s+(\w+)\s*-?%}([\s\S]*?){%-?\s*endcapture\s*-?%}/g;
  
  let match;
  while ((match = captureRegex.exec(content)) !== null) {
    const [, varName, varContent] = match;
    captures[varName] = varContent.trim();
  }
  
  return captures;
}

/**
 * Interpolate {{ varName }} in text using capture variables
 * Handles nested interpolation, Jekyll filters, and special cases like {{""}}
 */
function interpolateVariables(text, captures, depth = 0) {
  if (!text || typeof text !== 'string') return text;
  if (depth > 10) return text; // Prevent infinite recursion
  
  // Replace {{""}} with empty string (Jekyll hack to prevent newlines)
  let result = text.replace(/{{\s*""\s*}}/g, '');
  
  // Replace {{ varName | filter: args }} with captured content
  // This handles Jekyll filters like: {{ var | replace: "old", "new" }}
  result = result.replace(/{{\s*(\w+)\s*\|[^}]+}}/gs, (match, varName) => {
    if (captures[varName] !== undefined) {
      // Extract the filter and its arguments - handle both "string" and special chars
      const filterMatch = match.match(/\|\s*(\w+)\s*:\s*"([^"]*)"\s*,\s*"([^"]*)"/s);
      if (filterMatch) {
        const [, filterName, oldStr, newStr] = filterMatch;
        if (filterName === 'replace') {
          // Apply the replace filter
          const content = interpolateVariables(captures[varName], captures, depth + 1);
          // Escape special regex characters in oldStr
          const escapedOld = oldStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          return content.replace(new RegExp(escapedOld, 'g'), newStr);
        }
      }
      // If filter not recognized, just return the interpolated content
      return interpolateVariables(captures[varName], captures, depth + 1);
    }
    return match;
  });
  
  // Replace {{ varName }} with captured content (without filters)
  result = result.replace(/{{\s*(\w+)\s*}}/g, (match, varName) => {
    if (captures[varName] !== undefined) {
      // Recursively interpolate the captured content
      return interpolateVariables(captures[varName], captures, depth + 1);
    }
    return match;
  });
  
  return result;
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

/** Read a simple scalar from a page's YAML front matter. */
function frontMatterValue(content, key) {
  const match = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return null;
  const line = match[1].match(new RegExp(`^${key}:\\s*(.*?)\\s*$`, 'm'));
  if (!line) return null;
  const value = line[1];
  if (value.startsWith('"') && value.endsWith('"')) {
    try { return JSON.parse(value); } catch { return value.slice(1, -1); }
  }
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1);
  return value;
}

function fallbackPermalink(relativePath) {
  if (relativePath === 'index.md') return '/';
  const parts = relativePath.replace(/\.md$/, '').split(path.sep);
  if (parts[0].startsWith('_')) parts[0] = parts[0].slice(1);
  return `/${parts.join('/')}`;
}

function captureBlock(name, value) {
  const content = typeof value === 'string' ? value : String(value ?? '');
  return `{% capture ${name} -%}\n${content}\n{%- endcapture %}`;
}

/**
 * Render selected examples as Liquid/Markdown in an ignored include. The
 * source captures have already been interpolated, but remain otherwise
 * untransformed so `sampletabs_tpl.md` can assign fresh, unique IDs and render
 * the preview itself.
 */
function generateShowcaseInclude(examples) {
  const ordered = [...examples].sort((a, b) =>
    a.order - b.order
    || a.file.localeCompare(b.file)
    || a.sourcePosition - b.sourcePosition
  );

  const output = [
    '<!-- Generated by scripts/collect-docs-examples.js; do not edit. -->',
    '',
  ];

  ordered.forEach((example, index) => {
    const prefix = `showcase_${String(index + 1).padStart(2, '0')}`;
    const generatedFormId = `${prefix}-${example.formId.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
    const sourceAnchor = `#example-${example.formId}`;
    // The Showcase's generated TOC stops at h3. Keep each collected example at
    // h4 so the catalog has a consistent visual hierarchy without flooding TOC.
    const headingLevel = 4;
    const headingPrefix = '#'.repeat(headingLevel);
    const rawTitle = example.params.title?.trim();
    const explicitTitle = rawTitle && rawTitle !== '-' ? rawTitle : '';
    const heading = explicitTitle
      || example.heading.text.trim()
      || example.pageTitle
      || 'Example';

    output.push(
      `<!-- showcase_order=${example.order} source=${example.file}${sourceAnchor} heading_level=${headingLevel} source_heading_level=${example.heading.level} title_param=${explicitTitle ? 1 : 0} heading=${JSON.stringify(heading)} -->`,
      `${headingPrefix} ${heading}`,
      '',
    );

    const captures = new Map();
    for (const [key, name] of [
      ['htmlSource', 'html'],
      ['cssSource', 'css'],
      ['cssHidden', 'cssHidden'],
      ['jsHead', 'jsHead'],
      ['jsHidden', 'jsHidden'],
      ['jsSource', 'jsSource'],
      ['notes', 'notes'],
      ['title', 'title'],
      ['demoValue', 'demoValue'],
      ['showEditor', 'showEditor'],
      ['showEditorSource', 'showEditorSource'],
      ['minHeight', 'minHeight'],
      ['smarkformOptions', 'smarkformOptions'],
    ]) {
      if (example.params[key] === undefined) continue;
      const captureName = `${prefix}_${name}`;
      captures.set(key, captureName);
      output.push(captureBlock(captureName, example.params[key]), '');
    }

    output.push(
      '{% include components/sampletabs_tpl.md',
      `    formId="${generatedFormId}"`,
    );
    for (const [key, captureName] of captures) output.push(`    ${key}=${captureName}`);
    output.push('    selected="preview"', '%}', '');
    output.push(
      `> Original: [${example.pageTitle}]({{ ${JSON.stringify(example.permalink)} | relative_url }}${sourceAnchor}).`,
      '',
    );
  });

  const content = output.join('\n');
  fs.mkdirSync(path.dirname(SHOWCASE_INCLUDE_FILE), { recursive: true });
  if (!fs.existsSync(SHOWCASE_INCLUDE_FILE)
      || fs.readFileSync(SHOWCASE_INCLUDE_FILE, 'utf8') !== content) {
    fs.writeFileSync(SHOWCASE_INCLUDE_FILE, content);
  }
  console.log(
    `[collect-docs-examples] Generated ${ordered.length} ordered Showcase examples at `
    + `${path.relative(DOCS_DIR, SHOWCASE_INCLUDE_FILE)}`
  );
}

/**
 * Extract examples from a markdown file
 */
function extractExamples(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(DOCS_DIR, filePath);
  const examples = [];
  const showcaseExamples = [];
  const pageTitle = frontMatterValue(content, 'title') || path.basename(relativePath, '.md');
  const permalink = frontMatterValue(content, 'permalink') || fallbackPermalink(relativePath);

  // Build an ordered list of capture and include events in document order.
  // Processing in order is essential because the same capture variable name
  // (e.g. "demoValue") may be redefined multiple times in a file.  Each
  // include must see only the captures that were defined before it.
  const events = [];

  const captureRegex = /{%-?\s*capture\s+(\w+)\s*-?%}([\s\S]*?){%-?\s*endcapture\s*-?%}/g;
  let captureMatch;
  while ((captureMatch = captureRegex.exec(content)) !== null) {
    events.push({
      type: 'capture',
      pos: captureMatch.index,
      varName: captureMatch[1],
      content: captureMatch[2].trim(),
    });
  }

  const includeRegex = /{%\s*include\s+components\/sampletabs_tpl\.md\s*([\s\S]*?)%}/gm;
  let includeMatch;
  while ((includeMatch = includeRegex.exec(content)) !== null) {
    events.push({
      type: 'include',
      pos: includeMatch.index,
      paramsBlock: includeMatch[1],
    });
  }

  events.sort((a, b) => a.pos - b.pos);

  // Process events in document order, maintaining a live captures snapshot.
  const captures = {};
  let exampleIndex = 0;

  for (const event of events) {
    if (event.type === 'capture') {
      captures[event.varName] = event.content;
      continue;
    }

    // --- include event ---
    const params = parseIncludeParams(event.paramsBlock);
    let showcaseOrder;
    if (params.showcase_order !== undefined) {
      if (String(params.showcase_order).trim() === '') {
        throw new Error(`${relativePath}: showcase_order must be a number`);
      }
      showcaseOrder = Number(params.showcase_order);
      if (!Number.isFinite(showcaseOrder)) {
        throw new Error(
          `${relativePath}: showcase_order must be numeric (got "${params.showcase_order}")`
        );
      }
    }
    
    // Resolve parameter values from captures or use directly
    // Note: formId should NOT be resolved from captures - it's used as-is
    // Note: demoValue is collected separately below and stored in the manifest
    //       so that smoke tests can use it to verify the form round-trip.
    const resolvedParams = {};
    for (const [key, value] of Object.entries(params)) {
      const cleanValue = value;

      // demoValue is handled separately after this loop
      if (key === 'demoValue') continue;

      // formId is always used directly, not resolved from captures
      if (key === 'formId') {
        resolvedParams[key] = cleanValue;
      }
      // tests=false is a special case - keep as literal string 'false'
      else if (key === 'tests' && cleanValue === 'false') {
        resolvedParams[key] = 'false';
      }
      // Check if it's a reference to a capture variable
      else if (captures[cleanValue]) {
        resolvedParams[key] = captures[cleanValue];
      } else {
        resolvedParams[key] = cleanValue;
      }
    }

    // Collect demoValue separately: resolve from captures if it's a variable reference
    let demoValue = null;
    let demoValueSource;
    if (params.demoValue) {
      const rawValue = params.demoValue;
      let resolvedDemoValue = captures[rawValue] !== undefined
        ? (captures[rawValue] ?? '').trim()
        : (rawValue ?? '').trim();
      // Apply variable interpolation (handles nested captures, etc.)
      resolvedDemoValue = interpolateVariables(resolvedDemoValue, captures);
      demoValueSource = resolvedDemoValue;
      // Strip any remaining unresolved Jekyll template variables
      try {
        demoValue = jsonc.parse(resolvedDemoValue.replace(/{{\s*[^}]+\s*}}/gs, ''));
      } catch {
        demoValue = null;
      }
    }
    
    // Interpolate variables in resolved content
    for (const [key, value] of Object.entries(resolvedParams)) {
      resolvedParams[key] = interpolateVariables(value, captures);
    }

    // Keep an untransformed snapshot for the generated Showcase include. It
    // needs the original `$$` IDs, `!important` declarations, and Liquid that
    // belongs to the example's rendered notes; the test manifest below applies
    // its separate test-only cleanup/transforms.
    const showcaseParams = { ...resolvedParams };
    if (demoValueSource !== undefined) showcaseParams.demoValue = demoValueSource;
    
    // Remove any remaining unresolved Jekyll template variables
    // These are usually template-level helpers (like json_editor, default_buttons)
    // that don't affect the core example functionality
    for (const [key, value] of Object.entries(resolvedParams)) {
      if (typeof value === 'string') {
        resolvedParams[key] = value.replace(/{{\s*[^}]+\s*}}/gs, '');
      }
    }
    
    if (showcaseOrder !== undefined) {
      const formId = resolvedParams.formId;
      if (!formId) {
        throw new Error(`${relativePath}: showcase_order requires a sampletab formId`);
      }
      const headings = extractHeadings(content.slice(0, event.pos));
      const heading = headings.at(-1) || { level: 1, text: pageTitle };
      showcaseExamples.push({
        order: showcaseOrder,
        file: relativePath,
        formId,
        pageTitle,
        permalink,
        heading,
        params: showcaseParams,
        sourcePosition: event.pos,
      });
    }

    // Skip examples with JavaScript explicitly disabled (jsSource="-")
    // (They are introductory stuff and not fully functional SmarkForm examples)
    if (resolvedParams.jsSource === "-") continue;

    const formId = resolvedParams.formId || `example_${exampleIndex}`;
    
    // Apply transformations
    const htmlSource = applyTransformations(resolvedParams.htmlSource, `-${formId}`);
    const cssSource = stripImportant(applyTransformations(resolvedParams.cssSource || '', `-${formId}`));
    const jsHead = applyTransformations(resolvedParams.jsHead, `-${formId}`);
    const jsHidden = applyTransformations(resolvedParams.jsHidden, `-${formId}`);
    const jsSource = applyTransformations(resolvedParams.jsSource, `-${formId}`);
    
    // Handle tests parameter - apply transformations unless it's the literal 'false'
    let tests = '';
    if (resolvedParams.tests !== undefined) {
      if (resolvedParams.tests === 'false') {
        tests = 'false';
      } else {
        tests = applyTransformations(resolvedParams.tests, `-${formId}`);
      }
    }
    
    // Default jsHead if not provided
    const defaultJsHead = `const myForm = new SmarkForm(document.getElementById("myForm-${formId}"));`;
    
    // Parse smarkformOptions if provided (JSON object with extra SmarkForm constructor options)
    let smarkformOptions = null;
    if (resolvedParams.smarkformOptions && resolvedParams.smarkformOptions.trim() !== '') {
      try {
        smarkformOptions = jsonc.parse(resolvedParams.smarkformOptions.trim());
      } catch {
        console.warn(`  ⚠️  Could not parse smarkformOptions for ${formId}: ${resolvedParams.smarkformOptions}`);
      }
    }

    // Parse expected error counts if provided
    const expectedConsoleErrors = resolvedParams.expectedConsoleErrors 
      ? parseInt(resolvedParams.expectedConsoleErrors, 10) 
      : 0;
    const expectedPageErrors = resolvedParams.expectedPageErrors 
      ? parseInt(resolvedParams.expectedPageErrors, 10) 
      : 0;
    
    examples.push({
      id: `${relativePath.replace(/\//g, '_').replace(/\.md$/, '')}_${formId}`,
      file: relativePath,
      formId,
      htmlSource: htmlSource || '',
      cssSource: cssSource || '',
      jsHead: jsHead || defaultJsHead,
      jsHidden: jsHidden || '',
      jsSource: jsSource || '',
      tests: tests,
      demoValue: demoValue,
      smarkformOptions: smarkformOptions,
      expectedConsoleErrors: expectedConsoleErrors,
      expectedPageErrors: expectedPageErrors,
      notes: resolvedParams.notes || '',
      showEditor: resolvedParams.showEditor === 'true',
      showEditorSource: resolvedParams.showEditorSource === 'true',
      addLoadSaveButtons: resolvedParams.addLoadSaveButtons === 'true',
    });
    
    exampleIndex++;
  }
  
  return { examples, showcaseExamples };
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Scanning docs/ for examples...');
  
  const markdownFiles = findMarkdownFiles(DOCS_DIR, EXCLUDE_FOLDERS);
  console.log(`📄 Found ${markdownFiles.length} markdown files`);
  
  const allExamples = [];
  const allShowcaseExamples = [];
  
  for (const file of markdownFiles) {
    try {
      const { examples, showcaseExamples } = extractExamples(file);
      if (examples.length > 0) {
        console.log(`  ✓ ${path.relative(DOCS_DIR, file)}: ${examples.length} example(s)`);
        allExamples.push(...examples);
      }
      allShowcaseExamples.push(...showcaseExamples);
    } catch (error) {
      console.error(`  ✗ Error processing ${file}:`, error.message);
      process.exitCode = 1;
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
  generateShowcaseInclude(allShowcaseExamples);
}

main();
