import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getServerPort } from '../src/lib/test/helpers.js';
import { minimatch } from 'minimatch';
import * as smoke_tests from './co_located_tests_smoke.include.js';

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
 * Recursively filter falsy values out of arrays (and recurse into objects).
 *
 * This normalises an exported form value for comparison against a demoValue
 * that may contain null placeholders for empty list slots:
 *   deepFilterFalsy({foo: [null, 23, null]}) → {foo: [23]}
 *
 * Only array items are filtered; object values and primitives are kept as-is
 * so that intentional zeros, empty strings, and booleans inside objects are
 * preserved.
 */
function deepFilterFalsy(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map(deepFilterFalsy);
  }
  if (value !== null && typeof value === 'object') {
    const result = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = deepFilterFalsy(v);
    }
    return result;
  }
  return value;
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
 * Generate a minimal HTML page for testing demoValue round-trip.
 *
 * The form is initialised with `{ value: <demoValue> }` as the constructor
 * option so the smoke test can verify that importing and then re-exporting
 * the demoValue produces equivalent data.
 *
 * Note: jsHead is intentionally replaced with a simple constructor call that
 * passes the value option.  jsHidden and jsSource are kept so that any event
 * listeners or extra setup defined by the example are still active.
 */
function generateDemoValueTestHTML(example) {
  const { formId, htmlSource, cssSource, jsHidden, jsSource, demoValue } = example;

  // Use a simple constructor that passes demoValue as the value option.
  // Use JSON.stringify(JSON.parse(...)) to ensure the value is correctly
  // re-serialised and cannot contain unintended code fragments.
  const demoJsHead = `const myForm = new SmarkForm(document.getElementById("myForm-${formId}"), { value: ${JSON.stringify(JSON.parse(demoValue))} });`;

  const combinedJS = [demoJsHead, jsHidden, jsSource]
    .filter(js => js && js.trim() !== '')
    .join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test demoValue: ${formId}</title>
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
 * Helper functions for interacting with the form on the page
 */
function helpers(id, page) {
    return {
      root: page.locator(`#myForm-${id}`),
      readField: async (fldPath) => {
        return page.evaluate(async(fldPath) => {
            return await myForm.find(fldPath).export();
        }, fldPath);
      },
      writeField: async (fldPath, value) => {
        return page.evaluate(async({fldPath, value}) => {
        return (await myForm.find(fldPath).import(value));
        }, {fldPath, value});
      },
    };
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
    
    // Execute commonplace tests
    await smoke_tests.default({
      page,
      expect,
      id: example.formId,
      ...helpers(example.formId, page),
    });

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
          ...helpers(example.formId, page),
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

// Generate demoValue round-trip smoke tests for examples that have demoValue set.
//
// Each test initialises the form with demoValue passed as the SmarkForm
// constructor's `value` option, then exports the form and asserts that the
// exported data matches demoValue after filtering falsy values from arrays
// (to account for exportEmpties:false stripping empty list slots).
for (const example of examples) {
  if (skipFile(example.file)) continue;
  if (!example.demoValue) continue;

  test(`[${example.file}] ${example.formId} (demoValue round-trip)`, async ({ page }) => {
    const testHTML = generateDemoValueTestHTML(example);

    const tmpDir = path.join(__dirname, 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const tmpFileName = `docs_example_demovalue_${example.id}.html`;
    const tmpFilePath = path.join(tmpDir, tmpFileName);
    fs.writeFileSync(tmpFilePath, testHTML);

    // Track page errors — none are expected for demoValue tests
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));

    const port = await getServerPort();
    const url = `http://127.0.0.1:${port}/test/tmp/${tmpFileName}`;

    await page.goto(url);

    await page.waitForFunction(() => {
      return typeof window.SmarkForm !== 'undefined';
    }, { timeout: 5000 });

    // Wait for the root form to finish its own rendering and initial import.
    // SmarkForm rendering is async: the root form's `rendered` promise resolves
    // after the root's onRendered tasks run (which includes an initial import of
    // the `value` constructor option), but nested sub-form children may not be
    // fully rendered at that point.  After `myForm.rendered` we explicitly
    // re-import the demoValue to ensure all nested fields are correctly
    // populated regardless of sub-form rendering order.
    const parsedDemoValue = JSON.parse(example.demoValue);
    await page.evaluate(async (value) => {
      await myForm.rendered;
      await myForm.import(value);
    }, parsedDemoValue);

    // Export the form and compare against demoValue
    const exported = await page.evaluate(async () => {
      return await myForm.export();
    });

    expect(
      deepFilterFalsy(exported),
      `demoValue round-trip failed for ${example.id}`
    ).toEqual(deepFilterFalsy(parsedDemoValue));

    // No page errors expected
    if (pageErrors.length > 0) {
      console.log('Page errors:', pageErrors);
    }
    expect(
      pageErrors,
      `Unexpected page error(s) in demoValue test for ${example.id}`
    ).toHaveLength(0);

    // Clean up
    try {
      fs.unlinkSync(tmpFilePath);
    } catch (e) {
      // Ignore cleanup errors
    }
  });
}
