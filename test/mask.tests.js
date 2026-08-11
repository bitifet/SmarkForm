// test/mask.tests.js
// ==================
// Playwright tests for SmarkForm masking — declarative API.
// Masks are applied via the `mask` property in data-smark, referencing
// a factory registered with SmarkForm.registerMask() or a
// <script type="smark-mask"> element.

import { test, expect } from '@playwright/test';
import {renderPug} from '../src/lib/test/helpers.js';

// Shared mock mask factory used across tests.
// Tracks both display and unmasked values independently.
const testMaskPreScript = `
SmarkForm.registerMask("testMask", function(node) {
    let _unmasked = "";
    var inst = {
        get unmaskedValue() { return _unmasked; },
        set unmaskedValue(v) { _unmasked = v; }
    };
    return inst;
});
`;

const pugSrc = (// {{{
`extends layout.pug
block mainForm
    .section
        // Plain text field - type must NOT be changed
        p
            label Text Field
            input(
                data-smark={
                    name: "textField",
                    mask: "testMask"
                }
                type="text"
            )

        // Number field - type must be changed to "text" for masking
        p
            label Number Field
            input(
                data-smark={
                    type: "number",
                    name: "numberField",
                    mask: "testMask"
                }
                type="number"
            )

        // Date field - type must be changed to "text" for masking
        p
            label Date Field
            input(
                data-smark={
                    type: "date",
                    name: "dateField",
                    mask: "testMask"
                }
                type="date"
            )

        // Singleton number (mask inherited from singleton parent)
        div(data-smark={
            type: "number",
            name: "singletonNumber",
            mask: "testMask"
        })
            p
                label Singleton Number
                input(data-smark type="number")
`);// }}}

test.describe('Declarative masking', () => {
    const test_title = 'Declarative masking';

    // ──────────────────────────────────────────────────────────────────────────
    // Type conversion
    // ──────────────────────────────────────────────────────────────────────────
    test('changes input type to "text" for number fields', async ({ page }) => {
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
                preScript: testMaskPreScript,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await form.rendered;
                const field = form.find("/numberField");
                return field.targetFieldNode.getAttribute("type");
            });
            expect(result).toBe("text");
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('changes input type to "text" for date fields', async ({ page }) => {
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
                preScript: testMaskPreScript,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await form.rendered;
                const field = form.find("/dateField");
                return field.targetFieldNode.getAttribute("type");
            });
            expect(result).toBe("text");
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('does not change type for plain text fields', async ({ page }) => {
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
                preScript: testMaskPreScript,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await form.rendered;
                const field = form.find("/textField");
                return field.targetFieldNode.getAttribute("type");
            });
            expect(result).toBe("text");
        } finally {
            if (onClosed) await onClosed();
        }
    });

    // ──────────────────────────────────────────────────────────────────────────
    // Factory receives targetFieldNode
    // ──────────────────────────────────────────────────────────────────────────
    test('mask factory receives the targetFieldNode', async ({ page }) => {
        const fnPreScript = `
SmarkForm.registerMask("nodeTest", function(node) {
    window._receivedNode = node;
    window._tagName = node.tagName;
    return { get unmaskedValue() { return ""; }, set unmaskedValue(v) {} };
});
`;
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: `extends layout.pug
block mainForm
    input(data-smark={name:"nodeTest",mask:"nodeTest"} type="number")`,
                preScript: fnPreScript,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await form.rendered;
                const field = form.find("/nodeTest");
                return {
                    isSameNode: window._receivedNode === field.targetFieldNode,
                    tagName: window._tagName,
                };
            });
            expect(result.isSameNode).toBe(true);
            expect(result.tagName).toBe("INPUT");
        } finally {
            if (onClosed) await onClosed();
        }
    });

    // ──────────────────────────────────────────────────────────────────────────
    // export() uses _maskInstance.unmaskedValue
    // ──────────────────────────────────────────────────────────────────────────
    test('export() uses _maskInstance.unmaskedValue when provided', async ({ page }) => {
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
                preScript: testMaskPreScript,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await form.rendered;
                const field = form.find("/textField");
                // Simulate mask having applied a formatted value
                field.targetFieldNode.value = "formatted_value";
                field._maskInstance.unmaskedValue = "raw_value";
                const exported = await field.export();
                return { exported, displayValue: field.targetFieldNode.value };
            });
            expect(result.exported).toBe("raw_value");
            expect(result.displayValue).toBe("formatted_value");
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('number field export() still returns a JS number when mask provides unmaskedValue', async ({ page }) => {
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
                preScript: testMaskPreScript,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await form.rendered;
                const field = form.find("/numberField");
                await field.import(1234.56);
                field._maskInstance.unmaskedValue = "1234.56";
                const exported = await field.export();
                return { exported, type: typeof exported };
            });
            expect(result.exported).toBe(1234.56);
            expect(result.type).toBe("number");
        } finally {
            if (onClosed) await onClosed();
        }
    });

    // ──────────────────────────────────────────────────────────────────────────
    // export() fallback behavior
    // ──────────────────────────────────────────────────────────────────────────
    test('export() falls back to nodeFld.value when mask instance has no unmaskedValue', async ({ page }) => {
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: `extends layout.pug
block mainForm
    input(data-smark={name:"txt",mask:"noUnmasked"} type="text")`,
                preScript: `
SmarkForm.registerMask("noUnmasked", function(node) {
    return { someOtherProp: true }; // no unmaskedValue property
});
`,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await form.rendered;
                const field = form.find("/txt");
                await field.import("hello");
                return await field.export();
            });
            expect(result).toBe("hello");
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('export() falls back to nodeFld.value when factory returns null', async ({ page }) => {
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: `extends layout.pug
block mainForm
    input(data-smark={name:"txt",mask:"nullReturn"} type="text")`,
                preScript: `
SmarkForm.registerMask("nullReturn", function(node) {
    return null; // factory returns null
});
`,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await form.rendered;
                const field = form.find("/txt");
                await field.import("world");
                return await field.export();
            });
            expect(result).toBe("world");
        } finally {
            if (onClosed) await onClosed();
        }
    });

    // ──────────────────────────────────────────────────────────────────────────
    // Singleton mask behavior
    // ──────────────────────────────────────────────────────────────────────────
    test('singleton: mask instance lives on inner field, type converted on input', async ({ page }) => {
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
                preScript: testMaskPreScript,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await form.rendered;
                const singleton = form.find("/singletonNumber");
                return {
                    innerHasMask: singleton.children[""]._maskInstance !== undefined,
                    outerHasNoMask: singleton._maskInstance === undefined,
                    inputType: singleton.targetFieldNode.getAttribute("type"),
                };
            });
            expect(result.innerHasMask).toBe(true);
            expect(result.outerHasNoMask).toBe(true);
            expect(result.inputType).toBe("text");
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('singleton: export() still returns correct number type after masking', async ({ page }) => {
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
                preScript: testMaskPreScript,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await form.rendered;
                const singleton = form.find("/singletonNumber");
                await singleton.import(42);
                const inner = singleton.children[""];
                inner._maskInstance.unmaskedValue = "42";
                const exported = await singleton.export();
                return { exported, type: typeof exported };
            });
            expect(result.exported).toBe(42);
            expect(result.type).toBe("number");
        } finally {
            if (onClosed) await onClosed();
        }
    });

    // ──────────────────────────────────────────────────────────────────────────
    // import() dispatches input event on masked fields
    // ──────────────────────────────────────────────────────────────────────────
    test('import() dispatches input event when mask is applied', async ({ page }) => {
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
                preScript: testMaskPreScript,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await form.rendered;
                const field = form.find("/textField");
                let inputEventCount = 0;
                field.targetFieldNode.addEventListener("input", () => {
                    inputEventCount++;
                });
                await field.import("updated");
                return { inputEventCount };
            });
            expect(result.inputEventCount).toBeGreaterThanOrEqual(1);
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('import() does NOT dispatch input event on unmasked field', async ({ page }) => {
        const title = 'import_no_event_unmasked';
        let onClosed;
        try {
            const rendered = await renderPug({
                title,
                src: `extends layout.pug
block mainForm
    input(data-smark={name:"plain"} type="text")`,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await form.rendered;
                const field = form.find("/plain");
                let inputEventCount = 0;
                field.targetFieldNode.addEventListener("input", () => {
                    inputEventCount++;
                });
                await field.import("no mask");
                return { inputEventCount };
            });
            expect(result.inputEventCount).toBe(0);
        } finally {
            if (onClosed) await onClosed();
        }
    });
});
