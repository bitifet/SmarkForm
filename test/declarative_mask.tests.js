// test/declarative_mask.tests.js
// ===============================
// Playwright tests for the Declarative Masking API.
// Covers SmarkForm.registerMask(), <script type="smark-mask">,
// data-smark mask property, export/import integration,
// list item masking, mixin scoping, and error handling.

import { test, expect } from '@playwright/test';
import path from 'path';
import Fs from 'fs';
import { getServerPort } from '../src/lib/test/helpers.js';

const tmpDir = 'test/tmp';
if (! Fs.existsSync(tmpDir)) Fs.mkdirSync(tmpDir, { recursive: true });

// ---------------------------------------------------------------------------
// Minimal HTML test helper (no PUG required)
// ---------------------------------------------------------------------------
async function renderHtml(html, name = 'dmask') {
    const port = await getServerPort();
    const suffix = Math.random().toString(36).slice(2, 8);
    const fname = `${name}_${suffix}.html`;
    const fpath = path.join(tmpDir, fname);
    await Fs.promises.writeFile(fpath, html);
    return {
        url: `http://127.0.0.1:${port}/test/tmp/${fname}`,
        async onClosed() { await Fs.promises.unlink(fpath).catch(() => {}); },
    };
};

// HTML page skeleton: loads SmarkForm and initialises it on #myForm.
// `extraPre` is inserted before the form constructor (for registerMask calls).
// `extraPost` is inserted after the form constructor.
function pageHtml(body, extraPre = '', extraPost = '', formOptions = {}) {
    const optsArg = Object.keys(formOptions).length
        ? `, ${JSON.stringify(formOptions)}`
        : '';
    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Declarative Mask Test</title></head>
<body>
${body.trim()}
<script src="../../dist/SmarkForm.umd.js"></script>
<script>
  ${extraPre}
  window.myForm = new SmarkForm(document.getElementById('myForm')${optsArg});
  ${extraPost}
</script>
</body>
</html>`;
};

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------
test.describe('Declarative Masking API', () => {

    test.describe.configure({ mode: 'parallel' });

    // ──────────────────────────────────────────────────────────────────────────
    // Basic registry + data-smark
    // ──────────────────────────────────────────────────────────────────────────
    test('registerMask + data-smark mask property applies mask on render', async ({ page }) => {
        const html = pageHtml(`
<div id="myForm">
    <input data-smark='{"name":"card","mask":"digits"}' type="text">
</div>
`, `SmarkForm.registerMask("digits", (node) => {
    let _u = '';
    const inst = { get unmaskedValue() { return _u; }, set unmaskedValue(v) { _u = v; } };
    node.addEventListener('input', () => { _u = node.value.replace(/[^0-9]/g, ''); });
    return inst;
});`);

        let onClosed;
        try {
            const rendered = await renderHtml(html, 'basic_apply');
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await myForm.rendered;
                const field = myForm.find('card');
                return {
                    hasInstance: !!field._maskInstance,
                    type: field.targetFieldNode.getAttribute('type'),
                };
            });
            expect(result.hasInstance).toBe(true);
            expect(result.type).toBe('text');
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('masked field export() returns unmaskedValue', async ({ page }) => {
        const html = pageHtml(`
<div id="myForm">
    <input data-smark='{"name":"card","mask":"digits"}' type="text">
</div>
`, `SmarkForm.registerMask("digits", (node) => {
    let _u = '';
    const inst = { get unmaskedValue() { return _u; }, set unmaskedValue(v) { _u = v; } };
    node.addEventListener('input', () => { _u = node.value.replace(/[^0-9]/g, ''); });
    return inst;
});`);

        let onClosed;
        try {
            const rendered = await renderHtml(html, 'export_unmasked');
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await myForm.rendered;
                const field = myForm.find('card');
                field._maskInstance.unmaskedValue = '1234567890123456';
                return await field.export();
            });
            expect(result).toBe('1234567890123456');
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('import() on masked field dispatches input event for mask sync', async ({ page }) => {
        const html = pageHtml(`
<div id="myForm">
    <input data-smark='{"name":"card","mask":"digits"}' type="text">
</div>
`, `SmarkForm.registerMask("digits", (node) => {
    let _u = '';
    const inst = { get unmaskedValue() { return _u; }, set unmaskedValue(v) { _u = v; } };
    node.addEventListener('input', () => { _u = node.value.replace(/[^0-9]/g, ''); });
    return inst;
});`);

        let onClosed;
        try {
            const rendered = await renderHtml(html, 'import_input');
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await myForm.rendered;
                const field = myForm.find('card');
                let inputFired = false;
                field.targetFieldNode.addEventListener('input', () => { inputFired = true; });
                await field.import('1234567890123456');
                return { inputFired, unmasked: field._maskInstance.unmaskedValue };
            });
            expect(result.inputFired).toBe(true);
            expect(result.unmasked).toBe('1234567890123456');
        } finally {
            if (onClosed) await onClosed();
        }
    });

    // ──────────────────────────────────────────────────────────────────────────
    // Type conversion
    // ──────────────────────────────────────────────────────────────────────────
    test('mask changes input type from number to text', async ({ page }) => {
        const html = pageHtml(`
<div id="myForm">
    <input data-smark='{"name":"price","mask":"price"}' type="number" step="0.01">
</div>
`, `SmarkForm.registerMask("price", (node) => {
    let _u = '';
    return { get unmaskedValue() { return _u; }, set unmaskedValue(v) { _u = v; } };
});`);

        let onClosed;
        try {
            const rendered = await renderHtml(html, 'type_convert_num');
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await myForm.rendered;
                const field = myForm.find('price');
                return field.targetFieldNode.getAttribute('type');
            });
            expect(result).toBe('text');
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('mask changes input type from date to text', async ({ page }) => {
        const html = pageHtml(`
<div id="myForm">
    <input data-smark='{"name":"bday","mask":"date"}' type="date">
</div>
`, `SmarkForm.registerMask("date", (node) => {
    let _u = '';
    return { get unmaskedValue() { return _u; }, set unmaskedValue(v) { _u = v; } };
});`);

        let onClosed;
        try {
            const rendered = await renderHtml(html, 'type_convert_date');
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await myForm.rendered;
                const field = myForm.find('bday');
                return field.targetFieldNode.getAttribute('type');
            });
            expect(result).toBe('text');
        } finally {
            if (onClosed) await onClosed();
        }
    });

    // ──────────────────────────────────────────────────────────────────────────
    // Singleton delegation
    // ──────────────────────────────────────────────────────────────────────────
    test('singleton: mask on inner field works', async ({ page }) => {
        const html = pageHtml(`
<div id="myForm">
    <div data-smark='{"type":"form","name":"quantity"}'>
        <input data-smark='{"type":"number","name":"quantity","mask":"qty"}' value="0">
    </div>
</div>
`, `SmarkForm.registerMask("qty", (node) => {
    let _u = '';
    return { get unmaskedValue() { return _u; }, set unmaskedValue(v) { _u = v; } };
});`);

        let onClosed;
        try {
            const rendered = await renderHtml(html, 'singleton');
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await myForm.rendered;
                const inner = myForm.find('quantity/quantity');
                return {
                    hasInstance: !!inner._maskInstance,
                    type: inner.targetFieldNode.getAttribute('type'),
                };
            });
            expect(result.hasInstance).toBe(true);
            expect(result.type).toBe('text');
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('singleton: export() returns correct type after masking', async ({ page }) => {
        const html = pageHtml(`
<div id="myForm">
    <div data-smark='{"type":"number","name":"quantity","mask":"qty"}'>
        <input data-smark type="number" value="0">
    </div>
</div>
`, `SmarkForm.registerMask("qty", (node) => {
    let _u = '';
    return { get unmaskedValue() { return _u; }, set unmaskedValue(v) { _u = v; } };
});`);

        let onClosed;
        try {
            const rendered = await renderHtml(html, 'singleton_export');
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await myForm.rendered;
                const singleton = myForm.find('quantity');
                const inner = singleton.children[''];
                inner._maskInstance.unmaskedValue = '42';
                return await singleton.export();
            });
            expect(result).toBe(42);
        } finally {
            if (onClosed) await onClosed();
        }
    });

    // ──────────────────────────────────────────────────────────────────────────
    // List item masking
    // ──────────────────────────────────────────────────────────────────────────
    test('new list items get masked automatically', async ({ page }) => {
        const html = pageHtml(`
<div id="myForm">
    <div data-smark='{"type":"list","name":"items","min_items":1}'>
        <div>
            <input data-smark='{"name":"val","mask":"digits"}' type="text">
        </div>
    </div>
</div>
`, `SmarkForm.registerMask("digits", (node) => {
    let _u = '';
    const inst = { get unmaskedValue() { return _u; }, set unmaskedValue(v) { _u = v; } };
    node.addEventListener('input', () => { _u = node.value.replace(/[^0-9]/g, ''); });
    return inst;
});`);

        let onClosed;
        try {
            const rendered = await renderHtml(html, 'list_mask');
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await myForm.rendered;
                const list = myForm.find('items');
                await list.addItem();
                const item2 = myForm.find('items/1/val');
                return {
                    hasInstance: !!item2._maskInstance,
                    type: item2.targetFieldNode.getAttribute('type'),
                };
            });
            expect(result.hasInstance).toBe(true);
            expect(result.type).toBe('text');
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('masked list items export clean values', async ({ page }) => {
        const html = pageHtml(`
<div id="myForm">
    <div data-smark='{"type":"list","name":"items","exportEmpties":true}'>
        <div>
            <input data-smark='{"name":"val","mask":"digits"}' type="text">
        </div>
    </div>
</div>
`, `SmarkForm.registerMask("digits", (node) => {
    let _u = '';
    const inst = { get unmaskedValue() { return _u; }, set unmaskedValue(v) { _u = v; } };
    node.addEventListener('input', () => { _u = node.value.replace(/[^0-9]/g, ''); });
    return inst;
});`);

        let onClosed;
        try {
            const rendered = await renderHtml(html, 'list_export');
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await myForm.rendered;
                const list = myForm.find('items');
                await list.addItem();
                const item2 = myForm.find('items/1/val');
                item2._maskInstance.unmaskedValue = '42';
                return await item2.export();
            });
            expect(result).toBe('42');
        } finally {
            if (onClosed) await onClosed();
        }
    });

    // ──────────────────────────────────────────────────────────────────────────
    // Error handling
    // ──────────────────────────────────────────────────────────────────────────
    test('referencing unregistered mask throws by default', async ({ page }) => {
        const html = pageHtml(`
<div id="myForm">
    <input data-smark='{"name":"x","mask":"nonexistent"}' type="text">
</div>
`);

        const errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') errors.push(msg.text());
        });

        let onClosed;
        try {
            const rendered = await renderHtml(html, 'err_throw');
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);
            await page.waitForTimeout(1000);

            expect(errors.length).toBeGreaterThan(0);
            const maskErr = errors.find(e => e.includes('not found'));
            expect(maskErr).toBeTruthy();
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('throwOnMissing: false warns instead of throwing', async ({ page }) => {
        const html = pageHtml(`
<div id="myForm">
    <input data-smark='{"name":"x","mask":"nonexistent"}' type="text">
</div>
`, '', '', { maskConfig: { throwOnMissing: false } });

        const errors = [];
        const warnings = [];
        page.on('console', msg => {
            if (msg.type() === 'error') errors.push(msg.text());
            if (msg.type() === 'warning') warnings.push(msg.text());
        });

        let onClosed;
        try {
            const rendered = await renderHtml(html, 'err_warn');
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);
            await page.waitForTimeout(1000);

            expect(errors.length).toBe(0);
            const warn = warnings.find(w => w.includes('not found'));
            expect(warn).toBeTruthy();
        } finally {
            if (onClosed) await onClosed();
        }
    });

    // ──────────────────────────────────────────────────────────────────────────
    // Global script tag scanning
    // ──────────────────────────────────────────────────────────────────────────
    test('<script type="smark-mask"> registers mask globally', async ({ page }) => {
        const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Script Mask Test</title></head>
<body>
<script type="smark-mask" data-name="hello">
    (node) => {
        let _u = '';
        return { get unmaskedValue() { return _u; }, set unmaskedValue(v) { _u = v; } };
    }
</script>
<div id="myForm">
    <input data-smark='{"name":"greet","mask":"hello"}' type="text">
</div>
<script src="../../dist/SmarkForm.umd.js"></script>
<script>
  window.myForm = new SmarkForm(document.getElementById('myForm'));
</script>
</body>
</html>`;

        let onClosed;
        try {
            const rendered = await renderHtml(html, 'script_tag_global');
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);
            await page.waitForFunction(() => typeof window.myForm !== 'undefined');

            await page.waitForFunction(() => window.myForm.renderedSync === true);

            const result = await page.evaluate(() => {
                const field = myForm.find('greet');
                return {
                    found: !!field,
                    hasInstance: !!(field && field._maskInstance),
                };
            });
            expect(result.found).toBe(true);
            expect(result.hasInstance).toBe(true);
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('<script type="smark-mask"> inside a <template> is NOT registered globally', async ({ page }) => {
        // The <script type="smark-mask"> is a sibling of the template's root
        // element, so it is classified as a top-level script for the mixin.
        // With allowLocalMixinScripts: 'allow' it is processed into a scoped
        // mask, NOT registered globally.
        // The "global" field outside the mixin should NOT see the scoped mask.
        const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Scoped Mask Test (no global)</title></head>
<body>
<template id="myMixin">
    <script type="smark-mask" data-name="secret">
        (node) => {
            let _u = '';
            return { get unmaskedValue() { return _u; }, set unmaskedValue(v) { _u = v; } };
        }
    </script>
    <div>
        <input data-smark='{"name":"inner","mask":"secret"}' type="text">
    </div>
</template>
<div id="myForm">
    <div data-smark='{"type":"#myMixin","name":"used"}'>
        <input data-smark data-for="inner" type="text">
    </div>
    <input data-smark='{"name":"global","mask":"secret"}' type="text">
</div>
<script src="../../dist/SmarkForm.umd.js"></script>
<script>
  window.myForm = new SmarkForm(document.getElementById('myForm'), { allowLocalMixinScripts: 'allow' });
</script>
</body>
</html>`;

        // We expect a MASK_NOT_FOUND error for the "global" field because
        // "secret" is scoped to the mixin, not registered globally.
        const errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') errors.push(msg.text());
        });

        let onClosed;
        try {
            const rendered = await renderHtml(html, 'script_tag_no_global');
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);
            await page.waitForFunction(() => typeof window.myForm !== 'undefined');
            await page.waitForTimeout(1500);

            // A MASK_NOT_FOUND error should fire for the "global" field.
            const maskErr = errors.find(e => e.includes('not found'));
            expect(maskErr).toBeTruthy();
        } finally {
            if (onClosed) await onClosed();
        }
    });

    // ──────────────────────────────────────────────────────────────────────────
    // Mixin-scoped masks
    // ──────────────────────────────────────────────────────────────────────────
    test('mixin-scoped mask is available to fields inside the mixin', async ({ page }) => {
        // The <script type="smark-mask"> is a sibling of the root element
        // inside the <template>. It is processed into a scoped mask.
        const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Mixin Scoped Mask</title></head>
<body>
<template id="myMixin">
    <script type="smark-mask" data-name="mixinMask">
        (node) => {
            let _u = '';
            return { get unmaskedValue() { return _u; }, set unmaskedValue(v) { _u = v; } };
        }
    </script>
    <div>
        <input data-smark='{"name":"inner","mask":"mixinMask"}' type="number">
    </div>
</template>
<div id="myForm">
    <div data-smark='{"type":"#myMixin","name":"used"}'></div>
</div>
<script src="../../dist/SmarkForm.umd.js"></script>
<script>
  window.myForm = new SmarkForm(document.getElementById('myForm'), { allowLocalMixinScripts: 'allow' });
</script>
</body>
</html>`;

        let onClosed;
        try {
            const rendered = await renderHtml(html, 'mixin_scoped');
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);
            await page.waitForFunction(() => typeof window.myForm !== 'undefined');
            await page.waitForFunction(() => window.myForm.renderedSync === true);

            const result = await page.evaluate(() => {
                const field = myForm.find('used/inner');
                if (!field) return { found: false, hasInstance: false, type: null };
                return {
                    found: true,
                    hasInstance: !!field._maskInstance,
                    type: field.targetFieldNode.getAttribute('type'),
                };
            });
            expect(result.found).toBe(true);
            expect(result.hasInstance).toBe(true);
            expect(result.type).toBe('text');
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('mixin-local mask overrides global mask with same name', async ({ page }) => {
        const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Mixin Override</title></head>
<body>
<script type="smark-mask" data-name="shared">
    (node) => {
        return { get unmaskedValue() { return 'GLOBAL'; }, set unmaskedValue(v) {} };
    }
</script>
<template id="myMixin">
    <script type="smark-mask" data-name="shared">
        (node) => {
            return { get unmaskedValue() { return 'LOCAL'; }, set unmaskedValue(v) {} };
        }
    </script>
    <div>
        <input data-smark='{"name":"inner","mask":"shared"}' type="text">
    </div>
</template>
<div id="myForm">
    <div data-smark='{"type":"#myMixin","name":"used"}'></div>
    <input data-smark='{"name":"plain","mask":"shared"}' type="text">
</div>
<script src="../../dist/SmarkForm.umd.js"></script>
<script>
  window.myForm = new SmarkForm(document.getElementById('myForm'), { allowLocalMixinScripts: 'allow' });
</script>
</body>
</html>`;

        let onClosed;
        try {
            const rendered = await renderHtml(html, 'mixin_override');
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);
            await page.waitForFunction(() => typeof window.myForm !== 'undefined');
            await page.waitForFunction(() => window.myForm.renderedSync === true);

            const result = await page.evaluate(() => {
                const innerField = myForm.find('used/inner');
                const plainField = myForm.find('plain');
                if (!innerField || !plainField) {
                    return { innerVal: null, plainVal: null, innerFound: !!innerField, plainFound: !!plainField };
                }
                return {
                    innerVal: innerField._maskInstance.unmaskedValue,
                    plainVal: plainField._maskInstance.unmaskedValue,
                };
            });
            expect(result.innerVal).toBe('LOCAL');
            expect(result.plainVal).toBe('GLOBAL');
        } finally {
            if (onClosed) await onClosed();
        }
    });

});
