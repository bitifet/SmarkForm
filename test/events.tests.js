// test/events.tests.js
// ====================
// Tests for SmarkForm event system:
//   A) onLocal_* option parsing bug fix
//   B) .onLocal() / .on() / .onAll() propagation semantics
//   C) focusenter / focusleave synthetic boundary events

import { test, expect } from '@playwright/test';
import {renderPug} from '../src/lib/test/helpers.js';

// ---------------------------------------------------------------------------
// Shared pug template: root form → nested "inner" subform + scalar "fieldC"
// ---------------------------------------------------------------------------
const pugSrc = (// {{{
`doctype html
html
    head
        title= self.title
    body
        div#sfroot
            div(data-smark={type:"form", name:"inner"})
                input(data-smark name="fieldA" type="text")
                input(data-smark name="fieldB" type="text")
            input(data-smark name="fieldC" type="text")
        script(src="../../dist/SmarkForm.umd.js")
        script.
            window.eventLog = [];
            window.form = new SmarkForm(document.querySelector("#sfroot"));
`);//}}}

// ---------------------------------------------------------------------------
// Helper: render, navigate, wait for SmarkForm to be ready
// ---------------------------------------------------------------------------
async function setupPage(page, title, src) {
    const rendered = await renderPug({ title, src });
    await page.goto(rendered.url);
    await page.waitForFunction(() => typeof window.form !== 'undefined');
    await page.evaluate(() => form.rendered);
    return rendered.onClosed;
}

// ===========================================================================
// A) onLocal_* option parsing bug fix
// ===========================================================================

test.describe('onLocal_* option parsing', () => {

    test('onLocal_* option handler fires on the target component', async ({ page }) => {
        // Before the fix: the empty duplicate else-if silently swallowed
        // every onLocal_* key so the handler was never registered.
        const src = (
`doctype html
html
    head
        title= self.title
    body
        div#sfroot
            input(data-smark name="field1" type="text")
        script(src="../../dist/SmarkForm.umd.js")
        script.
            window.eventLog = [];
            window.form = new SmarkForm(document.querySelector("#sfroot"), {
                onLocal_AfterAction_export(ev) {
                    window.eventLog.push('local:export');
                }
            });
`);
        let onClosed;
        try {
            onClosed = await setupPage(page, 'onLocal_* option fires', src);
            const result = await page.evaluate(async () => {
                await form.rendered;
                await form.actions.export();
                return window.eventLog;
            });
            expect(result).toContain('local:export');
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('onAll_* option handler fires on the target component', async ({ page }) => {
        const src = (
`doctype html
html
    head
        title= self.title
    body
        div#sfroot
            input(data-smark name="field1" type="text")
        script(src="../../dist/SmarkForm.umd.js")
        script.
            window.eventLog = [];
            window.form = new SmarkForm(document.querySelector("#sfroot"), {
                onAll_AfterAction_export(ev) {
                    window.eventLog.push('all:export');
                }
            });
`);
        let onClosed;
        try {
            onClosed = await setupPage(page, 'onAll_* option fires', src);
            const result = await page.evaluate(async () => {
                await form.rendered;
                await form.actions.export();
                return window.eventLog;
            });
            expect(result).toContain('all:export');
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('onLocal_* on parent does NOT fire for descendant events', async ({ page }) => {
        // onLocal_ is target-phase only: it should not fire on ancestor components
        // when the event originates in a descendant.
        const src = (
`doctype html
html
    head
        title= self.title
    body
        div#sfroot
            div(data-smark={type:"form", name:"inner"})
                input(data-smark name="field1" type="text")
        script(src="../../dist/SmarkForm.umd.js")
        script.
            window.eventLog = [];
            window.form = new SmarkForm(document.querySelector("#sfroot"), {
                onLocal_AfterAction_export(ev) {
                    window.eventLog.push('outer:local:export');
                },
                onAll_AfterAction_export(ev) {
                    window.eventLog.push('outer:all:export');
                }
            });
`);
        let onClosed;
        try {
            onClosed = await setupPage(page, 'onLocal_ no ancestor fire', src);
            const result = await page.evaluate(async () => {
                await form.rendered;
                // Export only the inner subform — event should bubble to outer
                // for onAll_, but not trigger outer's onLocal_.
                await form.find('/inner').actions.export();
                return window.eventLog;
            });
            expect(result).not.toContain('outer:local:export');
            expect(result).toContain('outer:all:export');
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('onLocal_* on exact component fires when it is the target', async ({ page }) => {
        const src = (
`doctype html
html
    head
        title= self.title
    body
        div#sfroot
            div(data-smark={type:"form", name:"inner"})
                input(data-smark name="field1" type="text")
        script(src="../../dist/SmarkForm.umd.js")
        script.
            window.eventLog = [];
            window.form = new SmarkForm(document.querySelector("#sfroot"), {
                onLocal_AfterAction_export(ev) {
                    window.eventLog.push('outer:local:export');
                },
                onAll_AfterAction_export(ev) {
                    window.eventLog.push('outer:all:export');
                }
            });
`);
        let onClosed;
        try {
            onClosed = await setupPage(page, 'onLocal_ fires on exact target', src);
            const result = await page.evaluate(async () => {
                await form.rendered;
                // Export the outer (root) form — both handlers should fire.
                await form.actions.export();
                return window.eventLog;
            });
            expect(result).toContain('outer:local:export');
            expect(result).toContain('outer:all:export');
        } finally {
            if (onClosed) await onClosed();
        }
    });

});

// ===========================================================================
// B) .onLocal() / .on() / .onAll() propagation semantics
// ===========================================================================

test.describe('.onLocal() never bubbles', () => {

    test('.onLocal() handler does not run for events from descendants', async ({ page }) => {
        let onClosed;
        try {
            onClosed = await setupPage(page, '.onLocal no bubble', pugSrc);
            const result = await page.evaluate(async () => {
                await form.rendered;
                const log = [];
                form.onLocal('AfterAction_export', () => log.push('root:local'));
                form.find('/inner').onLocal('AfterAction_export', () => log.push('inner:local'));
                // Export the inner subform
                await form.find('/inner').actions.export();
                return log;
            });
            // root's onLocal must NOT fire (event came from inner)
            expect(result).not.toContain('root:local');
            // inner's onLocal MUST fire (it is the direct target)
            expect(result).toContain('inner:local');
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('.onLocal() fires when the registered component is the exact target', async ({ page }) => {
        let onClosed;
        try {
            onClosed = await setupPage(page, '.onLocal fires on exact target', pugSrc);
            const result = await page.evaluate(async () => {
                await form.rendered;
                const log = [];
                form.onLocal('AfterAction_export', () => log.push('root:local'));
                await form.actions.export();
                return log;
            });
            expect(result).toContain('root:local');
        } finally {
            if (onClosed) await onClosed();
        }
    });

});

test.describe('.onAll() always bubbles', () => {

    test('.onAll() on ancestor fires for events from descendants', async ({ page }) => {
        let onClosed;
        try {
            onClosed = await setupPage(page, '.onAll bubbles', pugSrc);
            const result = await page.evaluate(async () => {
                await form.rendered;
                const log = [];
                form.onAll('AfterAction_export', () => log.push('root:all'));
                // Export inner — should bubble to root
                await form.find('/inner').actions.export();
                return log;
            });
            expect(result).toContain('root:all');
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('.onAll() fires for events on the component itself', async ({ page }) => {
        let onClosed;
        try {
            onClosed = await setupPage(page, '.onAll fires on self', pugSrc);
            const result = await page.evaluate(async () => {
                await form.rendered;
                const log = [];
                form.onAll('AfterAction_export', () => log.push('root:all'));
                await form.actions.export();
                return log;
            });
            expect(result).toContain('root:all');
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('.onAll() fires for focus on descendant even though focus does not bubble in DOM', async ({ page }) => {
        let onClosed;
        try {
            onClosed = await setupPage(page, '.onAll focus always bubbles', pugSrc);

            await page.evaluate(async () => {
                await form.rendered;
                window.onAllLog = [];
                // .onAll() ALWAYS bubbles, even for focus (bubbles:false in metadata)
                form.onAll('focus', () => window.onAllLog.push('root:all:focus'));
            });

            await page.locator('input[name="fieldA"]').click();

            const log = await page.evaluate(() => window.onAllLog);
            expect(log.length).toBeGreaterThan(0);
        } finally {
            if (onClosed) await onClosed();
        }
    });

});

test.describe('.on() DOM-like bubbling semantics', () => {

    test('.on() bubbles for action events (default bubbles:true)', async ({ page }) => {
        // Action events (not in supportedFieldEventTypes) default to bubbles:true
        let onClosed;
        try {
            onClosed = await setupPage(page, '.on bubbles for action events', pugSrc);
            const result = await page.evaluate(async () => {
                await form.rendered;
                const log = [];
                form.on('AfterAction_export', () => log.push('root:on'));
                // Export inner — should bubble to root via .on()
                await form.find('/inner').actions.export();
                return log;
            });
            expect(result).toContain('root:on');
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('.on() for click (bubbles:true) propagates to ancestor from inner field', async ({ page }) => {
        let onClosed;
        try {
            onClosed = await setupPage(page, '.on click propagates from inner', pugSrc);

            await page.evaluate(async () => {
                await form.rendered;
                window.onLog = [];
                window.onAllLog = [];
                form.on('click', () => window.onLog.push('root:on:click'));
                form.onAll('click', () => window.onAllLog.push('root:all:click'));
            });

            await page.locator('input[name="fieldA"]').click();

            const result = await page.evaluate(() => ({
                on: window.onLog,
                onAll: window.onAllLog,
            }));

            // .on('click') SHOULD bubble (click has bubbles:true)
            expect(result.on.length).toBeGreaterThan(0);
            // .onAll('click') also fires
            expect(result.onAll.length).toBeGreaterThan(0);
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('.on() for focus (bubbles:false) does NOT propagate to ancestor', async ({ page }) => {
        let onClosed;
        try {
            onClosed = await setupPage(page, '.on focus no bubble', pugSrc);

            await page.evaluate(async () => {
                await form.rendered;
                window.onLog = [];
                window.onAllLog = [];
                // Register .on() and .onAll() on root for 'focus'
                form.on('focus', () => window.onLog.push('root:on:focus'));
                form.onAll('focus', () => window.onAllLog.push('root:all:focus'));
            });

            // Focus field A inside inner subform
            await page.locator('input[name="fieldA"]').click();

            const result = await page.evaluate(() => ({
                on: window.onLog,
                onAll: window.onAllLog,
            }));

            // .on('focus') should NOT bubble (focus has bubbles:false in metadata)
            expect(result.on).toHaveLength(0);
            // .onAll('focus') SHOULD bubble regardless of metadata
            expect(result.onAll.length).toBeGreaterThan(0);
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('.on() for blur (bubbles:false) does NOT propagate to ancestor', async ({ page }) => {
        let onClosed;
        try {
            onClosed = await setupPage(page, '.on blur no bubble', pugSrc);

            await page.evaluate(async () => {
                await form.rendered;
                window.onLog = [];
                window.onAllLog = [];
                form.on('blur', () => window.onLog.push('root:on:blur'));
                form.onAll('blur', () => window.onAllLog.push('root:all:blur'));
            });

            // Focus then blur a field inside inner
            await page.locator('input[name="fieldA"]').click();
            await page.locator('input[name="fieldC"]').click(); // move focus to outer field

            const result = await page.evaluate(() => ({
                on: window.onLog,
                onAll: window.onAllLog,
            }));

            // .on('blur') should NOT bubble (blur has bubbles:false)
            expect(result.on).toHaveLength(0);
            // .onAll('blur') SHOULD bubble regardless
            expect(result.onAll.length).toBeGreaterThan(0);
        } finally {
            if (onClosed) await onClosed();
        }
    });

});

// ===========================================================================
// C) focusenter / focusleave synthetic boundary events
// ===========================================================================

test.describe('focusenter / focusleave synthetic events', () => {

    test('focusenter fires on a component when focus enters it from outside', async ({ page }) => {
        let onClosed;
        try {
            onClosed = await setupPage(page, 'focusenter fires', pugSrc);

            await page.evaluate(async () => {
                await form.rendered;
                window.enterLog = [];
                window.leaveLog = [];
                form.find('/inner').onLocal('focusenter', () => window.enterLog.push('inner:focusenter'));
                form.find('/inner').onLocal('focusleave', () => window.leaveLog.push('inner:focusleave'));
            });

            // Click field outside inner (fieldC) first, then click inside inner (fieldA)
            await page.locator('input[name="fieldC"]').click();
            await page.locator('input[name="fieldA"]').click();

            const result = await page.evaluate(() => ({
                enter: window.enterLog,
                leave: window.leaveLog,
            }));

            expect(result.enter).toContain('inner:focusenter');
            expect(result.leave).not.toContain('inner:focusleave');
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('focusleave fires on a component when focus leaves it', async ({ page }) => {
        let onClosed;
        try {
            onClosed = await setupPage(page, 'focusleave fires', pugSrc);

            await page.evaluate(async () => {
                await form.rendered;
                window.enterLog = [];
                window.leaveLog = [];
                form.find('/inner').onLocal('focusenter', () => window.enterLog.push('inner:focusenter'));
                form.find('/inner').onLocal('focusleave', () => window.leaveLog.push('inner:focusleave'));
            });

            // Focus inside inner, then move outside
            await page.locator('input[name="fieldA"]').click();
            await page.locator('input[name="fieldC"]').click();

            const result = await page.evaluate(() => ({
                enter: window.enterLog,
                leave: window.leaveLog,
            }));

            expect(result.enter).toContain('inner:focusenter');
            expect(result.leave).toContain('inner:focusleave');
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('focusenter and focusleave do NOT fire when focus stays within same container', async ({ page }) => {
        let onClosed;
        try {
            onClosed = await setupPage(page, 'no focusenter-leave within same container', pugSrc);

            // First, move focus into inner so it is the baseline
            await page.locator('input[name="fieldA"]').click();

            await page.evaluate(async () => {
                // Reset counters after the initial focusenter
                window.enterCount = 0;
                window.leaveCount = 0;
                form.find('/inner').onLocal('focusenter', () => window.enterCount++);
                form.find('/inner').onLocal('focusleave', () => window.leaveCount++);
            });

            // Move focus within inner (fieldA -> fieldB): inner should NOT get focusenter/leave
            await page.locator('input[name="fieldB"]').click();

            const result = await page.evaluate(() => ({
                enterCount: window.enterCount,
                leaveCount: window.leaveCount,
            }));

            expect(result.enterCount).toBe(0);
            expect(result.leaveCount).toBe(0);
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('focusenter fires when focus enters from completely outside the root', async ({ page }) => {
        let onClosed;
        try {
            onClosed = await setupPage(page, 'focusenter from outside root', pugSrc);

            await page.evaluate(async () => {
                await form.rendered;
                window.rootEnterCount = 0;
                form.onLocal('focusenter', () => window.rootEnterCount++);
            });

            // Blur all (simulate focus going outside) then click inside
            await page.evaluate(() => document.activeElement?.blur());
            await page.locator('input[name="fieldA"]').click();

            const count = await page.evaluate(() => window.rootEnterCount);
            expect(count).toBeGreaterThan(0);
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('focusleave fires when focus leaves to outside the root', async ({ page }) => {
        let onClosed;
        try {
            onClosed = await setupPage(page, 'focusleave to outside root', pugSrc);

            await page.evaluate(async () => {
                await form.rendered;
                window.rootLeaveCount = 0;
                form.onLocal('focusleave', () => window.rootLeaveCount++);
            });

            // Focus inside root then blur entirely
            await page.locator('input[name="fieldA"]').click();
            await page.evaluate(() => document.activeElement?.blur());
            // Give the Promise.resolve().then() microtask time to run
            await page.waitForTimeout(50);

            const count = await page.evaluate(() => window.rootLeaveCount);
            expect(count).toBeGreaterThan(0);
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('focusenter/focusleave bubble to ancestor with .onAll()', async ({ page }) => {
        let onClosed;
        try {
            onClosed = await setupPage(page, 'focusenter bubbles with onAll', pugSrc);

            await page.evaluate(async () => {
                await form.rendered;
                window.log = [];
                // Listen on root with onAll — should catch inner's focusenter/leave too
                form.onAll('focusenter', (ev) => window.log.push('root:all:focusenter:' + ev.context.getPath()));
                form.onAll('focusleave', (ev) => window.log.push('root:all:focusleave:' + ev.context.getPath()));
            });

            // Blur first (ensure we start from outside)
            await page.evaluate(() => document.activeElement?.blur());
            // Enter inner
            await page.locator('input[name="fieldA"]').click();
            // Leave inner
            await page.locator('input[name="fieldC"]').click();
            // Allow microtask for focusleave-to-outside detection (not needed here but safe)

            const log = await page.evaluate(() => window.log);
            // At least one focusenter and one focusleave should have bubbled to root
            expect(log.some(e => e.includes('focusenter'))).toBe(true);
            expect(log.some(e => e.includes('focusleave'))).toBe(true);
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('focusenter and focusleave with .on() follow metadata (bubbles:true)', async ({ page }) => {
        let onClosed;
        try {
            onClosed = await setupPage(page, 'focusenter-leave .on bubbles', pugSrc);

            await page.evaluate(async () => {
                await form.rendered;
                window.onLog = [];
                // .on() with focusenter (bubbles:true in metadata) should propagate
                form.on('focusenter', () => window.onLog.push('root:on:focusenter'));
                form.on('focusleave', () => window.onLog.push('root:on:focusleave'));
            });

            // Blur, then enter inner (triggers focusenter on inner, bubbles to root)
            await page.evaluate(() => document.activeElement?.blur());
            await page.locator('input[name="fieldA"]').click();
            // Leave inner (triggers focusleave on inner, bubbles to root)
            await page.locator('input[name="fieldC"]').click();

            const log = await page.evaluate(() => window.onLog);
            expect(log.some(e => e.includes('focusenter'))).toBe(true);
            expect(log.some(e => e.includes('focusleave'))).toBe(true);
        } finally {
            if (onClosed) await onClosed();
        }
    });

});
