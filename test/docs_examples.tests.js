import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    (function() {
      ${combinedJS}
    })();
  </script>
</body>
</html>`;
}

// Generate tests for each example
for (const example of examples) {
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
    
    // Navigate to the test page
    await page.goto(`file://${tmpFilePath}`);
    
    // Wait for SmarkForm to be available and initialized
    await page.waitForFunction(() => {
      return typeof window.SmarkForm !== 'undefined';
    }, { timeout: 5000 });
    
    // Give the example a moment to render
    await page.waitForTimeout(500);
    
    // Check that the form container exists
    const formContainer = await page.locator(`#myForm-${example.formId}`);
    await expect(formContainer).toBeVisible();
    
    // Verify no console errors
    if (consoleErrors.length > 0) {
      console.log('Console errors:', consoleErrors);
    }
    expect(consoleErrors, `No console errors expected in example ${example.id}`).toHaveLength(0);
    
    // Verify no page errors
    if (pageErrors.length > 0) {
      console.log('Page errors:', pageErrors);
    }
    expect(pageErrors, `No page errors expected in example ${example.id}`).toHaveLength(0);
    
    // Clean up
    try {
      fs.unlinkSync(tmpFilePath);
    } catch (e) {
      // Ignore cleanup errors
    }
  });
}
