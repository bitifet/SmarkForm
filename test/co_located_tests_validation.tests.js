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
  
  test('examples shown with the editor must not use absolute paths', () => {
    // When showEditor=true the sampletab wraps the example content in a
    // "demo" subform, pushing every component one level deeper. An absolute
    // context/target path on an inline trigger (or a programmatic absolute
    // myForm.find() in example JS) then resolves from the whole-form root and
    // fails with UNKNOWN_ACTION in the live preview, even though co-located
    // tests (which do not use the editor wrapper) pass. Only examples with
    // showEditor=false may legitimately use absolute paths (no wrapper).
    const ATTR_RE = /data-smark\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
    const FIND_RE = /\.find\(\s*["'`]\/[^"'`]+/g;
    const offenders = [];

    for (const ex of manifest) {
      if (! ex.showEditor) continue; // No demo wrapper => absolute paths ok.
      const sources = {
        html: ex.htmlSource,
        jsHead: ex.jsHead,
        jsHidden: ex.jsHidden,
        jsSource: ex.jsSource,
      };
      for (const [kind, src] of Object.entries(sources)) {
        if (! src || src === '-' || src === '') continue;

        // Declarative triggers: absolute context/target inside data-smark.
        ATTR_RE.lastIndex = 0;
        let m;
        while ((m = ATTR_RE.exec(src)) !== null) {
          const raw = m[1] !== undefined ? m[1] : m[2];
          if (! raw || ! raw.trim()) continue;
          let obj;
          try { obj = JSON.parse(raw); } catch { continue; }
          if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) continue;
          if (typeof obj.action !== 'string') continue; // Not a trigger.
          for (const prop of ['context', 'target']) {
            const val = obj[prop];
            if (typeof val === 'string' && val.startsWith('/')) {
              offenders.push(`  - ${ex.file} [${ex.formId}] (${kind}) data-smark ${prop}="${val}"`);
            }
          }
        }

        // Programmatic absolute find() calls in example JS.
        let fm;
        while ((fm = FIND_RE.exec(src)) !== null) {
          offenders.push(`  - ${ex.file} [${ex.formId}] (${kind}) myForm.find call ${fm[0]}…`);
        }
      }
    }

    if (offenders.length > 0) {
      throw new Error(
        `Examples that show the editor (showEditor=true) must not use absolute ` +
        `path(s). Found ${offenders.length}:\n\n${offenders.join('\n')}\n\n` +
        `The sampletab editor wraps example content in a "demo" subform, so an ` +
        `absolute context/target (or myForm.find('/x')) resolves against the ` +
        `whole-form root and throws UNKNOWN_ACTION in the live preview even ` +
        `though co-located tests pass. Use a relative path ` +
        `(e.g. "context":"report"), or set showEditor=false when an absolute ` +
        `path is genuinely required.`
      );
    }
  });
});
