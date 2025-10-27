import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getServerPort } from '../src/lib/test/helpers.js';
import { minimatch } from 'minimatch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const testArgsStart = process.argv.indexOf(path.basename(__filename)) + 1;


const [filePattern] = (
    testArgsStart > 0 ? process.argv.slice(testArgsStart) // First call
    : [] // Subsequent executions that take no arguments (¿workers?)
);

const skipFile = (
    !(filePattern || "").trim() ? ()=>false
    : (file)=>!minimatch(file, filePattern)
);




// Load the manifest of documentation examples
const manifestPath = path.join(__dirname, '.cache', 'docs_examples.json');
let examples = [];

try {
  const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
  examples = JSON.parse(manifestContent);
} catch (error) {
  console.error('Failed to load examples manifest:', error.message);
  console.error('Make sure to run: node scripts/collect-docs-examples.js');
}


/**
 * Generate a minimal HTML page for testing an example
 */
function generateTestHTML(example) {
  const { formId, htmlSource, cssSource, jsHead, jsHidden, jsSource } = example;
  
  // Combine all JS sections
  const combinedJS = [jsHead, jsHidden, jsSource]
    .filter(js => js && js.trim() !== '')
    .join('\n\n');
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test: ${formId}</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    ${cssSource}
  </style>
</head>
<body>
  <div id="myForm-${formId}">
    ${htmlSource}
  </div>
  
  <script src="/dist/SmarkForm.umd.js"></script>
  <script>
    window.myForm = (function() {
      ${combinedJS}
       return myForm;
    })();
  </script>
</body>
</html>`;
}

/**
 * Helper object for co-located tests
 */
const helpers = {
  root: (page, id) => page.locator(`#myForm-${id}`)
};

// Generate tests for each example
for (const example of examples) {
  if (skipFile(example.file)) continue;
  test(`[${example.file}] ${example.formId}`, async ({ page }) => {
    const testHTML = generateTestHTML(example);
    
    // Create a temporary HTML file
    const tmpDir = path.join(__dirname, 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    
    const tmpFileName = `docs_example_${example.id}.html`;
    const tmpFilePath = path.join(tmpDir, tmpFileName);
    fs.writeFileSync(tmpFilePath, testHTML);
    
    // Track console messages
    const consoleMessages = [];
    const consoleErrors = [];
    
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      consoleMessages.push({ type, text });
      
      if (type === 'error') {
        consoleErrors.push(text);
      }
    });
    
    // Track page errors
    const pageErrors = [];
    page.on('pageerror', error => {
      pageErrors.push(error.message);
    });
    
    // Use HTTP server to serve the file (like existing tests do)
    const port = await getServerPort();
    const url = `http://127.0.0.1:${port}/test/tmp/${tmpFileName}`;
    
    // Navigate to the test page
    await page.goto(url);
    
    // Wait for SmarkForm to be available and initialized
    await page.waitForFunction(() => {
      return typeof window.SmarkForm !== 'undefined';
    }, { timeout: 5000 });
    
    // Give the example a moment to render
    await page.waitForTimeout(500);
    
    // Check that the form container exists
    const formContainer = await page.locator(`#myForm-${example.formId}`);
    await expect(formContainer).toBeVisible();
    
    // Verify console errors match expectations
    const expectedConsoleErrors = example.expectedConsoleErrors || 0;
    if (consoleErrors.length > 0) {
      console.log('Console errors:', consoleErrors);
    }
    expect(
      consoleErrors, 
      `Expected ${expectedConsoleErrors} console error(s) in example ${example.id}, got ${consoleErrors.length}`
    ).toHaveLength(expectedConsoleErrors);
    
    // Verify page errors match expectations
    const expectedPageErrors = example.expectedPageErrors || 0;
    if (pageErrors.length > 0) {
      console.log('Page errors:', pageErrors);
    }
    expect(
      pageErrors, 
      `Expected ${expectedPageErrors} page error(s) in example ${example.id}, got ${pageErrors.length}`
    ).toHaveLength(expectedPageErrors);
    
    // Enforce tests presence check
    if (!example.tests || example.tests === '') {
      throw new Error(
        `Example ${example.id} is missing co-located tests. ` +
        `Please add a tests= parameter to the {% include %} block, or use tests=false to explicitly disable testing.`
      );
    }
    
    // Run co-located custom tests if defined and not explicitly disabled
    if (example.tests && example.tests !== 'false') {
      // Create temporary test module file
      const testModuleFileName = `docs_example_test_${example.id}.mjs`;
      const testModulePath = path.join(tmpDir, testModuleFileName);
      
      try {
        fs.writeFileSync(testModulePath, example.tests);
        
        // Dynamic import the test module
        const testModuleUrl = `file://${testModulePath}`;
        const testModule = await import(testModuleUrl);
        
        // Verify default export exists and is a function
        if (typeof testModule.default !== 'function') {
          throw new Error(
            `Test module for ${example.id} must export a default function. ` +
            `Found: ${typeof testModule.default}`
          );
        }
        
        // Execute the custom test
        await testModule.default({
          page,
          expect,
          id: example.formId,
          helpers
        });
        
      } finally {
        // Clean up test module
        try {
          fs.unlinkSync(testModulePath);
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    }
    
    // Clean up
    try {
      fs.unlinkSync(tmpFilePath);
    } catch (e) {
      // Ignore cleanup errors
    }
  });
}
