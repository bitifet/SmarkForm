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
 * Recursively normalizes a value for loose comparison in tests:
 *
 * 1. Removes falsy values from arrays (null, undefined, "", false, 0 stays!)
 * 2. Collapses single-item arrays to the scalar value (helps with legacy scalar → array migration)
 * 3. Coerces numeric-looking strings and YYYY-MM-DD strings to numbers
 *
 * Object properties are preserved even if falsy.
 * Non-array structures keep their values as-is except for the numeric string coercion.
 *
 * Main use case: compare form-submitted data against "demo" / golden values
 * that may use strings, null placeholders in arrays, etc.
 *
 * @example
 * normalizeForLooseComparison({ a: ["", 42, null, "17", "2024-05-03"] })
 * // → { a: [42, 17, 20240503] }
 *
 * @param {*} value - value to normalize
 * @returns {*} normalized value
 */
function normalizeForLooseComparison(value) {
  // Handle arrays – filter falsy + recurse + coerce
  if (Array.isArray(value)) {
    const filtered = value
      .filter(Boolean)               // remove falsy values
      .map(normalizeForLooseComparison);

    // Special case: single-item arrays → unwrap to scalar
    // (helps when form field changed from scalar → array)
    if (filtered.length === 1) {
      return filtered[0];
    }

    return filtered;
  }

  // Handle plain objects – recurse only
  if (value !== null && typeof value === 'object') {
    const result = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = normalizeForLooseComparison(val);
    }
    return result;
  }

  // Leaf values: try to coerce strings that look numeric or date-like
  if (typeof value === 'string' && value.trim() !== '') {
    // Pure number
    if (!isNaN(value)) {
      return Number(value);
    }

    // YYYY-MM-DD → YYYYMMDD number (common in some form/DB roundtrips)
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return Number(value.replaceAll(/-/g, ''));
    }
  }

  // Everything else → unchanged
  return value;
}


/**
 * Generate a minimal HTML page for testing an example
 */
/**
 * Returns true when the htmlSource's root element is a <form> tag, meaning
 * it must not be wrapped in an extra container (it already carries
 * id="myForm-<formId>" itself).
 */
function isFormRoot(htmlSource) {
  return /^\s*<form[\s>]/i.test(htmlSource);
}

function generateTestHTML(example) {
  const { formId, htmlSource, cssSource, jsHead, jsHidden, jsSource } = example;
  
  // Combine all JS sections
  const combinedJS = [jsHead, jsHidden, jsSource]
    .filter(js => js && js.trim() !== '')
    .join('\n\n');

  // When the root element is already a <form>, do not add an extra wrapper div
  // to avoid creating a duplicate id (the form itself carries id="myForm-<formId>").
  const bodyContent = isFormRoot(htmlSource)
    ? htmlSource
    : `<div id="myForm-${formId}">\n    ${htmlSource}\n  </div>`;
  
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
  ${bodyContent}
  
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
  const demoJsHead = `const myForm = new SmarkForm(document.getElementById("myForm-${formId}"), { value: ${JSON.stringify(demoValue)} });`;

  // Replace alert() and window.alert() with console.log() so that any
  // dialog-blocking JS in jsSource does not stall Playwright's test runner.
  const sanitizeJS = (js) => js.replace(/\b(?:window\.)?alert\s*\(/g, 'console.log(');

  const combinedJS = [demoJsHead, jsHidden, jsSource]
    .filter(js => js && js.trim() !== '')
    .map(sanitizeJS)
    .join('\n\n');

  // When the root element is already a <form>, do not add an extra wrapper div.
  const bodyContent = isFormRoot(htmlSource)
    ? htmlSource
    : `<div id="myForm-${formId}">\n    ${htmlSource}\n  </div>`;

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
  ${bodyContent}

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
    // // Debug:
    // if (consoleErrors.length > 0) {
    //   console.log('Console errors:', consoleErrors);
    // }
    expect(
      consoleErrors, 
      `Expected ${expectedConsoleErrors} console error(s) in example ${example.id}, got ${consoleErrors.length}`
    ).toHaveLength(expectedConsoleErrors);
    
    // Verify page errors match expectations
    const expectedPageErrors = example.expectedPageErrors || 0;
    // // Debug:
    // if (pageErrors.length > 0) {
    //   console.log('Page errors:', pageErrors);
    // }
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

    // Wait for the root form (and the entire component tree) to finish
    // rendering, including all nested sub-forms.  The `rendered` promise
    // resolves after the form's `render()` completes AND its onRendered
    // tasks run (which include importing the `value` constructor option).
    // After this point the form should already contain the demoValue data
    // — no explicit re-import should be needed.
    await page.evaluate(async () => {
      await myForm.rendered;
    });

    // Export the form and compare against demoValue.
    const exported = await page.evaluate(async () => {
      return await myForm.export();
    });

    expect(
      normalizeForLooseComparison(exported),
      `demoValue round-trip failed for ${example.id}`
    ).toEqual(normalizeForLooseComparison(example.demoValue));

    // No page errors expected
    // // Debug:
    // if (pageErrors.length > 0) {
    //   console.log('Page errors:', pageErrors);
    // }
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
