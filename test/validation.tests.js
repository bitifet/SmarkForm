// test/validation.tests.js
// ========================
// Tests for the SmarkForm validation plugin (SmarkForm.createValidation).
//
// Covers:
//   A) ValidationStateChanged fires on form change
//   B) ValidationIssuesChanged fires only when issues change
//   C) aria-invalid toggled for error paths
//   D) Export is blocked when errors exist (blockExportOnErrors)
//   E) Warnings do NOT set aria-invalid
//   F) destroy() stops further validation activity

import { test, expect } from '@playwright/test';
import { renderPug } from '../src/lib/test/helpers.js';

// ---------------------------------------------------------------------------
// Shared minimal Pug template
// ---------------------------------------------------------------------------
const basicPug = (extraScript = '') => `
doctype html
html
  head
    title= self.title
  body
    div#sfroot
      input(data-smark name="startDate" type="text")
      input(data-smark name="endDate" type="text")
    script(src="../../dist/SmarkForm.umd.js")
    script.
      window.eventLog = [];
      window.form = new SmarkForm(document.querySelector('#sfroot'));
      form.rendered.then(() => {
        ${extraScript}
      });
`;

// Helper: render page and wait for SmarkForm
async function setupPage(page, title, src) {
    const rendered = await renderPug({ title, src });
    await page.goto(rendered.url);
    await page.waitForFunction(() => window.form !== undefined);
    await page.evaluate(() => form.rendered);
    return rendered.onClosed;
}

// ===========================================================================
// A) ValidationStateChanged fires on form change
// ===========================================================================

test.describe('ValidationStateChanged event', () => {

    test('fires when form value changes', async ({ page }) => {
        const src = basicPug(`
            window.stateChangedCount = 0;
            window.validation = SmarkForm.createValidation(form, {
              providers: [],
              debounce: 0,
            });
            form.on('ValidationStateChanged', () => { window.stateChangedCount++; });
        `);
        let onClosed;
        try {
            onClosed = await setupPage(page, 'ValidationStateChanged fires', src);
            await page.waitForFunction(() => window.validation !== undefined);

            // Trigger a change on the startDate field
            await page.fill('input[name="startDate"]', '2024-01-01');
            await page.evaluate(() => document.querySelector('input[name="startDate"]').dispatchEvent(new Event('change', { bubbles: true })));

            // Wait for the debounced validation to fire
            await page.waitForFunction(() => window.stateChangedCount > 0, { timeout: 2000 });
            const count = await page.evaluate(() => window.stateChangedCount);
            expect(count).toBeGreaterThan(0);
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('event carries issues, hasErrors, hasWarnings', async ({ page }) => {
        const src = basicPug(`
            window.lastState = null;
            window.validation = SmarkForm.createValidation(form, {
              debounce: 0,
              providers: [async ({ data }) => ({
                issues: [{
                  level: 'error',
                  paths: ['startDate'],
                  code: 'required',
                  message: 'Start date is required',
                  source: 'test',
                }],
              })],
            });
            form.on('ValidationStateChanged', ev => { window.lastState = ev; });
        `);
        let onClosed;
        try {
            onClosed = await setupPage(page, 'ValidationStateChanged payload', src);
            await page.waitForFunction(() => window.validation !== undefined);

            // Trigger a manual validation
            await page.evaluate(() => validation.validate('test'));
            await page.waitForFunction(() => window.lastState !== null, { timeout: 2000 });

            const state = await page.evaluate(() => ({
                hasErrors:   window.lastState.hasErrors,
                hasWarnings: window.lastState.hasWarnings,
                issueCount:  window.lastState.issues.length,
                firstIssue:  window.lastState.issues[0],
            }));
            expect(state.hasErrors).toBe(true);
            expect(state.hasWarnings).toBe(false);
            expect(state.issueCount).toBe(1);
            expect(state.firstIssue.code).toBe('required');
            expect(state.firstIssue.source).toBe('test');
        } finally {
            if (onClosed) await onClosed();
        }
    });
});

// ===========================================================================
// B) ValidationIssuesChanged fires only when issues change
// ===========================================================================

test.describe('ValidationIssuesChanged event', () => {

    test('does not fire when issues remain unchanged', async ({ page }) => {
        const src = basicPug(`
            window.issuesChangedCount = 0;
            window.stateChangedCount = 0;
            let callCount = 0;
            window.validation = SmarkForm.createValidation(form, {
              debounce: 0,
              providers: [async () => {
                // Same issue every time
                return { issues: [{
                  level: 'error', paths: ['startDate'],
                  code: 'err', message: 'always', source: 'test',
                }]};
              }],
            });
            form.on('ValidationStateChanged', () => { window.stateChangedCount++; });
            form.on('ValidationIssuesChanged', () => { window.issuesChangedCount++; });
        `);
        let onClosed;
        try {
            onClosed = await setupPage(page, 'ValidationIssuesChanged unchanged', src);
            await page.waitForFunction(() => window.validation !== undefined);

            // First run - should emit both events
            await page.evaluate(() => validation.validate('first'));
            await page.waitForFunction(() => window.stateChangedCount >= 1, { timeout: 2000 });
            expect(await page.evaluate(() => window.issuesChangedCount)).toBe(1);

            // Second run with same issues - ValidationIssuesChanged should NOT fire again
            await page.evaluate(() => validation.validate('second'));
            await page.waitForFunction(() => window.stateChangedCount >= 2, { timeout: 2000 });
            expect(await page.evaluate(() => window.issuesChangedCount)).toBe(1); // unchanged
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('fires when issues appear and when they disappear', async ({ page }) => {
        const src = basicPug(`
            window.issuesChangedLog = [];
            window.shouldFail = true;
            window.validation = SmarkForm.createValidation(form, {
              debounce: 0,
              providers: [async () => {
                if (window.shouldFail) {
                  return { issues: [{
                    level: 'error', paths: ['startDate'],
                    code: 'err', message: 'error', source: 'test',
                  }]};
                }
                return { issues: [] };
              }],
            });
            form.on('ValidationIssuesChanged', ev => {
              window.issuesChangedLog.push({
                newCount: ev.newIssues.length,
                solvedCount: ev.solvedIssues.length,
              });
            });
        `);
        let onClosed;
        try {
            onClosed = await setupPage(page, 'ValidationIssuesChanged lifecycle', src);
            await page.waitForFunction(() => window.validation !== undefined);

            // Run with error → IssuesChanged fires with newIssues
            await page.evaluate(() => validation.validate('with-error'));
            await page.waitForFunction(() => window.issuesChangedLog.length >= 1, { timeout: 2000 });

            // Run without error → IssuesChanged fires with solvedIssues
            await page.evaluate(() => { window.shouldFail = false; });
            await page.evaluate(() => validation.validate('without-error'));
            await page.waitForFunction(() => window.issuesChangedLog.length >= 2, { timeout: 2000 });

            const log = await page.evaluate(() => window.issuesChangedLog);
            expect(log[0].newCount).toBe(1);
            expect(log[0].solvedCount).toBe(0);
            expect(log[1].newCount).toBe(0);
            expect(log[1].solvedCount).toBe(1);
        } finally {
            if (onClosed) await onClosed();
        }
    });
});

// ===========================================================================
// C) aria-invalid toggled for error paths
// ===========================================================================

test.describe('ARIA side effects', () => {

    test('sets aria-invalid on field with error', async ({ page }) => {
        const src = basicPug(`
            window.validation = SmarkForm.createValidation(form, {
              debounce: 0,
              providers: [async () => ({
                issues: [{
                  level: 'error', paths: ['startDate'],
                  code: 'required', message: 'Required', source: 'test',
                }],
              })],
            });
        `);
        let onClosed;
        try {
            onClosed = await setupPage(page, 'aria-invalid set', src);
            await page.waitForFunction(() => window.validation !== undefined);

            await page.evaluate(() => validation.validate('test'));
            await page.waitForFunction(
                () => document.querySelector('input[name="startDate"]').getAttribute('aria-invalid') === 'true',
                { timeout: 2000 }
            );
            const ariaInvalid = await page.locator('input[name="startDate"]').getAttribute('aria-invalid');
            expect(ariaInvalid).toBe('true');
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('removes aria-invalid when error is solved', async ({ page }) => {
        const src = basicPug(`
            window.shouldFail = true;
            window.validation = SmarkForm.createValidation(form, {
              debounce: 0,
              providers: [async () => {
                if (window.shouldFail) {
                  return { issues: [{
                    level: 'error', paths: ['startDate'],
                    code: 'required', message: 'Required', source: 'test',
                  }]};
                }
                return { issues: [] };
              }],
            });
        `);
        let onClosed;
        try {
            onClosed = await setupPage(page, 'aria-invalid removed', src);
            await page.waitForFunction(() => window.validation !== undefined);

            // First: introduce error
            await page.evaluate(() => validation.validate('with-error'));
            await page.waitForFunction(
                () => document.querySelector('input[name="startDate"]').getAttribute('aria-invalid') === 'true',
                { timeout: 2000 }
            );

            // Second: solve error
            await page.evaluate(() => { window.shouldFail = false; });
            await page.evaluate(() => validation.validate('without-error'));
            await page.waitForFunction(
                () => !document.querySelector('input[name="startDate"]').hasAttribute('aria-invalid'),
                { timeout: 2000 }
            );
            const ariaInvalid = await page.locator('input[name="startDate"]').getAttribute('aria-invalid');
            expect(ariaInvalid).toBeNull();
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('does NOT set aria-invalid for warnings', async ({ page }) => {
        const src = basicPug(`
            window.validation = SmarkForm.createValidation(form, {
              debounce: 0,
              providers: [async () => ({
                issues: [{
                  level: 'warning', paths: ['startDate'],
                  code: 'soft-warning', message: 'Warning only', source: 'test',
                }],
              })],
            });
        `);
        let onClosed;
        try {
            onClosed = await setupPage(page, 'aria-invalid not for warnings', src);
            await page.waitForFunction(() => window.validation !== undefined);

            // Wait for ValidationStateChanged to confirm validation ran
            await page.evaluate(async () => {
                await new Promise(resolve => {
                    form.on('ValidationStateChanged', resolve);
                    validation.validate('test');
                });
            });

            const ariaInvalid = await page.locator('input[name="startDate"]').getAttribute('aria-invalid');
            expect(ariaInvalid).toBeNull();
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('BeforeValidationA11yApply can prevent aria-invalid', async ({ page }) => {
        const src = basicPug(`
            window.validation = SmarkForm.createValidation(form, {
              debounce: 0,
              providers: [async () => ({
                issues: [{
                  level: 'error', paths: ['startDate'],
                  code: 'err', message: 'Error', source: 'test',
                }],
              })],
            });
            // Prevent all aria side effects
            form.on('BeforeValidationA11yApply', ev => { ev.preventDefault(); });
        `);
        let onClosed;
        try {
            onClosed = await setupPage(page, 'BeforeValidationA11yApply prevents', src);
            await page.waitForFunction(() => window.validation !== undefined);

            // Wait for ValidationStateChanged to confirm validation ran
            await page.evaluate(async () => {
                await new Promise(resolve => {
                    form.on('ValidationStateChanged', resolve);
                    validation.validate('test');
                });
            });

            const ariaInvalid = await page.locator('input[name="startDate"]').getAttribute('aria-invalid');
            expect(ariaInvalid).toBeNull();
        } finally {
            if (onClosed) await onClosed();
        }
    });
});

// ===========================================================================
// D) Export is blocked when errors exist (blockExportOnErrors)
// ===========================================================================

test.describe('Export blocking', () => {

    test('export is blocked when errors exist', async ({ page }) => {
        const src = basicPug(`
            window.exportResult = 'not-yet';
            window.validation = SmarkForm.createValidation(form, {
              debounce: 0,
              blockExportOnErrors: true,
              providers: [async () => ({
                issues: [{
                  level: 'error', paths: ['startDate'],
                  code: 'required', message: 'Required', source: 'test',
                }],
              })],
            });
        `);
        let onClosed;
        try {
            onClosed = await setupPage(page, 'export blocked on error', src);
            await page.waitForFunction(() => window.validation !== undefined);

            // Try to export — should be blocked
            const result = await page.evaluate(async () => {
                const data = await form.actions.export();
                return data; // undefined if blocked
            });
            expect(result).toBeUndefined();
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('export succeeds when no errors', async ({ page }) => {
        const src = basicPug(`
            window.validation = SmarkForm.createValidation(form, {
              debounce: 0,
              blockExportOnErrors: true,
              providers: [async () => ({ issues: [] })],
            });
        `);
        let onClosed;
        try {
            onClosed = await setupPage(page, 'export allowed no errors', src);
            await page.waitForFunction(() => window.validation !== undefined);

            const result = await page.evaluate(async () => form.actions.export());
            expect(result).toBeTruthy();
            expect(typeof result).toBe('object');
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('export is NOT blocked when blockExportOnErrors is false', async ({ page }) => {
        const src = basicPug(`
            window.validation = SmarkForm.createValidation(form, {
              debounce: 0,
              blockExportOnErrors: false,
              providers: [async () => ({
                issues: [{
                  level: 'error', paths: ['startDate'],
                  code: 'err', message: 'Error', source: 'test',
                }],
              })],
            });
        `);
        let onClosed;
        try {
            onClosed = await setupPage(page, 'export not blocked when option false', src);
            await page.waitForFunction(() => window.validation !== undefined);

            const result = await page.evaluate(async () => form.actions.export());
            expect(result).toBeTruthy();
        } finally {
            if (onClosed) await onClosed();
        }
    });
});

// ===========================================================================
// E) getState() returns current validation state synchronously
// ===========================================================================

test.describe('getState()', () => {

    test('returns empty state before first validation', async ({ page }) => {
        const src = basicPug(`
            window.validation = SmarkForm.createValidation(form, {
              debounce: 0,
              providers: [],
            });
        `);
        let onClosed;
        try {
            onClosed = await setupPage(page, 'getState initial', src);
            await page.waitForFunction(() => window.validation !== undefined);

            const state = await page.evaluate(() => validation.getState());
            expect(state.issues).toHaveLength(0);
            expect(state.hasErrors).toBe(false);
            expect(state.hasWarnings).toBe(false);
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('returns current issues after validation', async ({ page }) => {
        const src = basicPug(`
            window.validation = SmarkForm.createValidation(form, {
              debounce: 0,
              providers: [async () => ({
                issues: [{
                  level: 'warning', paths: ['endDate'],
                  code: 'soft', message: 'Soft issue', source: 'test',
                }],
              })],
            });
        `);
        let onClosed;
        try {
            onClosed = await setupPage(page, 'getState after run', src);
            await page.waitForFunction(() => window.validation !== undefined);

            await page.evaluate(async () => validation.validate('test'));
            // getState is synchronous
            const state = await page.evaluate(() => validation.getState());
            expect(state.issues).toHaveLength(1);
            expect(state.hasWarnings).toBe(true);
            expect(state.hasErrors).toBe(false);
        } finally {
            if (onClosed) await onClosed();
        }
    });
});

// ===========================================================================
// F) destroy() stops further validation activity
// ===========================================================================

test.describe('destroy()', () => {

    test('stops validation after destroy', async ({ page }) => {
        const src = basicPug(`
            window.stateChangedCount = 0;
            window.validation = SmarkForm.createValidation(form, {
              debounce: 0,
              providers: [],
            });
            form.on('ValidationStateChanged', () => { window.stateChangedCount++; });
        `);
        let onClosed;
        try {
            onClosed = await setupPage(page, 'destroy stops validation', src);
            await page.waitForFunction(() => window.validation !== undefined);

            // Run once to confirm it works
            await page.evaluate(async () => validation.validate('before-destroy'));
            await page.waitForFunction(() => window.stateChangedCount >= 1, { timeout: 2000 });

            const countBefore = await page.evaluate(() => window.stateChangedCount);

            // Destroy, then validate again — should be a no-op
            await page.evaluate(() => {
                validation.destroy();
                validation.validate('after-destroy');
            });

            // Wait a bit to ensure no spurious validation fires
            await page.waitForTimeout(200);
            const countAfter = await page.evaluate(() => window.stateChangedCount);
            expect(countAfter).toBe(countBefore);
        } finally {
            if (onClosed) await onClosed();
        }
    });
});
