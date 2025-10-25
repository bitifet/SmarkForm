import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Validation tests for co-located tests infrastructure
 * These tests verify that the collector and test runner are properly configured
 */

test.describe('Co-located Tests Infrastructure', () => {
  let manifest;
  
  test.beforeAll(() => {
    // Load the manifest
    const manifestPath = path.join(__dirname, '.cache', 'docs_examples.json');
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
    manifest = JSON.parse(manifestContent);
  });
  
  test('manifest should be loaded', () => {
    expect(manifest).toBeDefined();
    expect(Array.isArray(manifest)).toBe(true);
    expect(manifest.length).toBeGreaterThan(0);
  });
  
  test('all examples should have a tests property', () => {
    for (const example of manifest) {
      expect(example).toHaveProperty('tests');
      expect(typeof example.tests).toBe('string');
    }
  });
  
  test('no examples should have empty tests (must be false or contain code)', () => {
    const examplesWithEmptyTests = manifest.filter(e => e.tests === '');
    
    if (examplesWithEmptyTests.length > 0) {
      const fileList = examplesWithEmptyTests.map(e => `  - ${e.file}: ${e.formId}`).join('\n');
      throw new Error(
        `Found ${examplesWithEmptyTests.length} example(s) without tests. ` +
        `Each example must either have custom tests or explicitly set tests=false.\n\n` +
        `Examples missing tests:\n${fileList}\n\n` +
        `To fix this, either:\n` +
        `1. Run: node scripts/add-tests-false-to-examples.js\n` +
        `2. Manually add tests=false or tests=your_test_capture to each example`
      );
    }
  });
  
  test('all examples should have expectedConsoleErrors property', () => {
    for (const example of manifest) {
      expect(example).toHaveProperty('expectedConsoleErrors');
      expect(typeof example.expectedConsoleErrors).toBe('number');
      expect(example.expectedConsoleErrors).toBeGreaterThanOrEqual(0);
    }
  });
  
  test('all examples should have expectedPageErrors property', () => {
    for (const example of manifest) {
      expect(example).toHaveProperty('expectedPageErrors');
      expect(typeof example.expectedPageErrors).toBe('number');
      expect(example.expectedPageErrors).toBeGreaterThanOrEqual(0);
    }
  });
  
  test('transformations should be applied to tests', () => {
    // If there are any examples with custom tests, verify transformations
    const examplesWithTests = manifest.filter(e => e.tests && e.tests !== 'false');
    
    for (const example of examplesWithTests) {
      // Should not contain █ (should be transformed to spaces)
      expect(example.tests).not.toContain('█');
      
      // If the test contains $$, verify it was transformed to -${formId}
      // (Though in practice, tests probably won't use $$ as much as HTML/CSS)
      if (example.tests.includes('$$')) {
        throw new Error(`Example ${example.id} has untransformed $$ in tests`);
      }
    }
  });
});
