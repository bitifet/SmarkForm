// test/mixin_types.tests.js
// =========================
// Playwright tests for the Mixin Types feature.
// Covers local templates, attribute/option merging, styles, scripts,
// error codes, and external template loading.

import { test, expect } from '@playwright/test';
import path from 'path';
import Fs from 'fs';
import { getServerPort } from '../src/lib/test/helpers.js';

const tmpDir = 'test/tmp';
if (! Fs.existsSync(tmpDir)) Fs.mkdirSync(tmpDir, { recursive: true });

// ---------------------------------------------------------------------------
// Minimal HTML test helper (no PUG required)
// ---------------------------------------------------------------------------
async function renderHtml(html, name = 'mixin') { //{{{
    const port = await getServerPort();
    const suffix = Math.random().toString(36).slice(2, 8);
    const fname = `${name}_${suffix}.html`;
    const fpath = path.join(tmpDir, fname);
    await Fs.promises.writeFile(fpath, html);
    return {
        url: `http://127.0.0.1:${port}/test/tmp/${fname}`,
        async onClosed() { await Fs.promises.unlink(fpath).catch(() => {}); },
    };
}; //}}}

// HTML page skeleton: loads SmarkForm and initialises it on #myForm.
function page(body, extraScript = '', formOptions = {}) { //{{{
    const optsArg = Object.keys(formOptions).length
        ? `, ${JSON.stringify(formOptions)}`
        : '';
    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Mixin Test</title></head>
<body>
${body.trim()}
<script src="../../dist/SmarkForm.umd.js"></script>
<script>
  window.myForm = new SmarkForm(document.getElementById('myForm')${optsArg});
  ${extraScript}
</script>
</body>
</html>`;
}; //}}}

// ---------------------------------------------------------------------------
// Test suite: basic local mixin expansion
// ---------------------------------------------------------------------------
test.describe('Mixin Types — local template expansion', () => {

    test('simple local mixin is expanded and the field is accessible', async ({ page: pg }) => {//{{{
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<template id="myWidget">
  <div data-smark='{"type":"form"}'></div>
</template>

<form id="myForm">
  <div data-smark='{"type":"#myWidget","name":"widget"}'></div>
</form>
`));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered);

            // The mixin was expanded: the child component should be accessible.
            const exported = await pg.evaluate(() => window.myForm.export());
            expect(exported).toHaveProperty('widget');
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('name comes from the placeholder, not the template', async ({ page: pg }) => {//{{{
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<template id="field">
  <input data-smark type="text">
</template>

<form id="myForm">
  <div data-smark='{"type":"#field","name":"username"}'></div>
</form>
`));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered);

            // Field is accessible by the placeholder's name.
            const exported = await pg.evaluate(() => window.myForm.export());
            expect(exported).toHaveProperty('username');
            expect(exported.username).toBe('');
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('placeholder options override template root defaults', async ({ page: pg }) => {//{{{
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<template id="emptyForm">
  <div data-smark='{"type":"form","exportEmpties":false}'></div>
</template>

<form id="myForm">
  <div data-smark='{"type":"#emptyForm","name":"sub","exportEmpties":true}'></div>
</form>
`));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered);

            // exportEmpties:true from placeholder should override template default false.
            const comp = await pg.evaluate(() => {
                const sub = window.myForm.find('sub');
                return sub?.options?.exportEmpties;
            });
            expect(comp).toBe(true);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('class attribute is unioned from template and placeholder', async ({ page: pg }) => {//{{{
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<template id="widget">
  <div data-smark='{"type":"form"}' class="from-template extra"></div>
</template>

<form id="myForm">
  <div data-smark='{"type":"#widget","name":"w"}' class="from-placeholder"></div>
</form>
`));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered);

            const classes = await pg.evaluate(() => {
                const sub = window.myForm.find('w');
                return sub?.targetNode?.className;
            });
            expect(classes).toContain('from-template');
            expect(classes).toContain('extra');
            expect(classes).toContain('from-placeholder');
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('style attribute: template first, placeholder appended', async ({ page: pg }) => {//{{{
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<template id="widget">
  <div data-smark='{"type":"form"}' style="color: red;"></div>
</template>

<form id="myForm">
  <div data-smark='{"type":"#widget","name":"w"}' style="font-weight: bold;"></div>
</form>
`));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered);

            const style = await pg.evaluate(() => {
                const sub = window.myForm.find('w');
                return sub?.targetNode?.getAttribute('style');
            });
            expect(style).toContain('color: red');
            expect(style).toContain('font-weight: bold');
            // Template style should appear before placeholder style.
            expect(style.indexOf('color: red')).toBeLessThan(style.indexOf('font-weight: bold'));
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('multiple instances of the same mixin share styles but are independent', async ({ page: pg }) => {//{{{
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<template id="named">
  <input data-smark type="text">
</template>

<form id="myForm">
  <div data-smark='{"type":"#named","name":"first"}'></div>
  <div data-smark='{"type":"#named","name":"second"}'></div>
</form>
`));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered);

            await pg.evaluate(() => window.myForm.import({ first: 'foo', second: 'bar' }));
            const exported = await pg.evaluate(() => window.myForm.export());
            expect(exported.first).toBe('foo');
            expect(exported.second).toBe('bar');
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('mixin type inside a list item template works correctly', async ({ page: pg }) => {//{{{
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<template id="nameEntry">
  <fieldset data-smark='{"type":"form"}'></fieldset>
</template>

<form id="myForm">
  <ul data-smark='{"name":"entries","min_items":1}'>
    <li data-smark>
      <div data-smark='{"type":"#nameEntry","name":"entry"}'></div>
    </li>
  </ul>
</form>
`));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered);

            // One item should be rendered with the mixin-expanded entry subform.
            const exported = await pg.evaluate(() => window.myForm.export());
            expect(Array.isArray(exported.entries)).toBe(true);
            expect(exported.entries.length).toBeGreaterThanOrEqual(1);
            expect(exported.entries[0]).toHaveProperty('entry');
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('style from mixin template is injected into document <head>', async ({ page: pg }) => {//{{{
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<template id="styled">
  <div data-smark='{"type":"form"}'></div>
  <style>.mixin-marker { color: blue; }</style>
</template>

<form id="myForm">
  <div data-smark='{"type":"#styled","name":"s"}'></div>
</form>
`));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered);

            const styleCount = await pg.evaluate(() =>
                [...document.head.querySelectorAll('style')]
                    .filter(s => s.textContent.includes('mixin-marker'))
                    .length
            );
            expect(styleCount).toBe(1);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('same style is not injected twice for multiple mixin instances', async ({ page: pg }) => {//{{{
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<template id="styled">
  <div data-smark='{"type":"form"}'></div>
  <style>.once-style { color: green; }</style>
</template>

<form id="myForm">
  <div data-smark='{"type":"#styled","name":"a"}'></div>
  <div data-smark='{"type":"#styled","name":"b"}'></div>
</form>
`));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered);

            const styleCount = await pg.evaluate(() =>
                [...document.head.querySelectorAll('style')]
                    .filter(s => s.textContent.includes('once-style'))
                    .length
            );
            expect(styleCount).toBe(1);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('mixin script runs with `this` bound to the component', async ({ page: pg }) => {//{{{
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<template id="scripted">
  <input data-smark type="text">
  <script>
    // Tag the target node so the test can detect the script ran.
    this.targetNode.dataset.scriptRan = 'yes';
  </script>
</template>

<form id="myForm">
  <div data-smark='{"type":"#scripted","name":"field"}'></div>
</form>
`, '', { allowLocalMixinScripts: 'allow' }));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered);

            const scriptRan = await pg.evaluate(() => {
                const field = window.myForm.find('field');
                return field?.targetNode?.dataset?.scriptRan;
            });
            expect(scriptRan).toBe('yes');
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('mixin script `this` gives access to SmarkForm API', async ({ page: pg }) => {//{{{
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<template id="apiAccess">
  <input data-smark type="text">
  <script>
    // Record the component path via the SmarkForm API.
    this.targetNode.dataset.path = this.getPath();
  </script>
</template>

<form id="myForm">
  <div data-smark='{"type":"#apiAccess","name":"myField"}'></div>
</form>
`, '', { allowLocalMixinScripts: 'allow' }));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered);

            const recordedPath = await pg.evaluate(() => {
                const field = window.myForm.find('myField');
                return field?.targetNode?.dataset?.path;
            });
            expect(recordedPath).toBe('/myField');
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

});

// ---------------------------------------------------------------------------
// Test suite: nested mixin expansion
// ---------------------------------------------------------------------------
test.describe('Mixin Types — nested mixin expansion', () => {

    test('a template may itself reference another template (nested mixin)', async ({ page: pg }) => {//{{{
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<template id="inner">
  <input data-smark type="text">
</template>

<template id="outer">
  <div data-smark='{"type":"form"}'>
    <div data-smark='{"type":"#inner","name":"value"}'></div>
  </div>
</template>

<form id="myForm">
  <div data-smark='{"type":"#outer","name":"nested"}'></div>
</form>
`));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered);

            const exported = await pg.evaluate(() => window.myForm.export());
            expect(exported).toHaveProperty('nested');
            expect(exported.nested).toHaveProperty('value');
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

});

// ---------------------------------------------------------------------------
// Test suite: error codes
// ---------------------------------------------------------------------------
test.describe('Mixin Types — error codes', () => {

    test('MIXIN_TYPE_MISSING_FRAGMENT: type "#" has empty fragment', async ({ page: pg }) => {//{{{
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<form id="myForm">
  <div data-smark='{"type":"#","name":"bad"}'></div>
</form>
`));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForTimeout(500);

            // replaceWrongNode sets error.code as the div's text content.
            await expect(pg.getByText('MIXIN_TYPE_MISSING_FRAGMENT')).toBeVisible({ timeout: 3000 });
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('MIXIN_TEMPLATE_NOT_FOUND: referenced template id does not exist', async ({ page: pg }) => {//{{{
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<form id="myForm">
  <div data-smark='{"type":"#doesNotExist","name":"bad"}'></div>
</form>
`));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForTimeout(500);

            await expect(pg.getByText('MIXIN_TEMPLATE_NOT_FOUND')).toBeVisible({ timeout: 3000 });
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('MIXIN_TEMPLATE_INVALID_ROOT: template has two root elements', async ({ page: pg }) => {//{{{
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<template id="doubleRoot">
  <div>first</div>
  <div>second</div>
</template>

<form id="myForm">
  <div data-smark='{"type":"#doubleRoot","name":"bad"}'></div>
</form>
`));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForTimeout(500);

            await expect(pg.getByText('MIXIN_TEMPLATE_INVALID_ROOT')).toBeVisible({ timeout: 3000 });
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('MIXIN_TEMPLATE_ROOT_HAS_NAME: template root specifies name in data-smark', async ({ page: pg }) => {//{{{
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<template id="namedRoot">
  <div data-smark='{"type":"form","name":"hardcoded"}'></div>
</template>

<form id="myForm">
  <div data-smark='{"type":"#namedRoot","name":"bad"}'></div>
</form>
`));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForTimeout(500);

            await expect(pg.getByText('MIXIN_TEMPLATE_ROOT_HAS_NAME')).toBeVisible({ timeout: 3000 });
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('MIXIN_CIRCULAR_DEPENDENCY: template references itself', async ({ page: pg }) => {//{{{
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<template id="selfRef">
  <div data-smark='{"type":"form"}'>
    <div data-smark='{"type":"#selfRef","name":"child"}'></div>
  </div>
</template>

<form id="myForm">
  <div data-smark='{"type":"#selfRef","name":"top"}'></div>
</form>
`));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForTimeout(500);

            await expect(pg.getByText('MIXIN_CIRCULAR_DEPENDENCY')).toBeVisible({ timeout: 3000 });
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

});

// ---------------------------------------------------------------------------
// Test suite: snippet parameters (data-for)
// ---------------------------------------------------------------------------
test.describe('Mixin Types — snippet parameters (data-for)', () => {

    test('data-for child replaces the targeted element inside the template', async ({ page: pg }) => {//{{{
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<template id="labeled">
  <label data-smark>
    <span id="labelText">Default label</span>
    <input data-smark type="text">
  </label>
</template>

<form id="myForm">
  <div data-smark='{"type":"#labeled","name":"field"}'>
    <span data-for="labelText">Custom label</span>
  </div>
</form>
`));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered);

            // The substituted element should be present with the custom text.
            const text = await pg.evaluate(() =>
                document.querySelector('[name="field"] span, label[data-smark] span')?.textContent
                || document.querySelector('label span')?.textContent
            );
            expect(text).toBe('Custom label');
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('original data-for children are consumed and not rendered', async ({ page: pg }) => {//{{{
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<template id="widget">
  <div data-smark='{"type":"form"}'>
    <span id="slotA">Default A</span>
  </div>
</template>

<form id="myForm">
  <div data-smark='{"type":"#widget","name":"w"}'>
    <span data-for="slotA">Override A</span>
  </div>
</form>
`));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered);

            // The data-for attribute should not appear anywhere in the final DOM.
            const dataForCount = await pg.evaluate(() =>
                document.querySelectorAll('[data-for]').length
            );
            expect(dataForCount).toBe(0);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('surviving template ids are converted to data-id', async ({ page: pg }) => {//{{{
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<template id="defaults">
  <div data-smark='{"type":"form"}'>
    <span id="slotA">Default A</span>
    <span id="slotB">Default B</span>
  </div>
</template>

<form id="myForm">
  <!-- No data-for children — both slots survive with data-id -->
  <div data-smark='{"type":"#defaults","name":"w"}'></div>
</form>
`));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered);

            // Original ids must be gone; data-id must be present instead.
            const idCount = await pg.evaluate(() =>
                document.querySelectorAll('#slotA, #slotB').length
            );
            expect(idCount).toBe(0);

            const dataIdA = await pg.evaluate(() =>
                document.querySelector('[data-id="slotA"]')?.textContent
            );
            const dataIdB = await pg.evaluate(() =>
                document.querySelector('[data-id="slotB"]')?.textContent
            );
            expect(dataIdA).toBe('Default A');
            expect(dataIdB).toBe('Default B');
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('ids on parameter elements are converted to data-id', async ({ page: pg }) => {//{{{
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<template id="widget">
  <div data-smark='{"type":"form"}'>
    <span id="slot">Default</span>
  </div>
</template>

<form id="myForm">
  <div data-smark='{"type":"#widget","name":"w"}'>
    <!-- id="injected" on the param element should be stripped / converted -->
    <span data-for="slot" id="injected">Custom</span>
  </div>
</form>
`));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered);

            // id="injected" must not appear in the final DOM.
            const idCount = await pg.evaluate(() =>
                document.querySelectorAll('#injected').length
            );
            expect(idCount).toBe(0);

            // The inserted element should carry data-id="injected" instead.
            const dataId = await pg.evaluate(() =>
                document.querySelector('[data-id="injected"]')?.textContent
            );
            expect(dataId).toBe('Custom');
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('two instances with different data-for substitutions are independent', async ({ page: pg }) => {//{{{
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<template id="namedField">
  <div data-smark='{"type":"form"}'>
    <span id="label">Label</span>
    <input data-smark type="text" name="value">
  </div>
</template>

<form id="myForm">
  <div data-smark='{"type":"#namedField","name":"first"}'>
    <span data-for="label">First label</span>
  </div>
  <div data-smark='{"type":"#namedField","name":"second"}'>
    <span data-for="label">Second label</span>
  </div>
</form>
`));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered);

            // Both substitutions should appear in the DOM independently.
            const spans = await pg.evaluate(() =>
                [...document.querySelectorAll('span')]
                    .map(s => s.textContent)
            );
            expect(spans).toContain('First label');
            expect(spans).toContain('Second label');
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('data-for with no matching id in template is silently ignored', async ({ page: pg }) => {//{{{
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<template id="simple">
  <input data-smark type="text">
</template>

<form id="myForm">
  <div data-smark='{"type":"#simple","name":"field"}'>
    <span data-for="nonExistentId">Ignored</span>
  </div>
</form>
`));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered);

            // Form should still render correctly despite the unmatched data-for.
            const exported = await pg.evaluate(() => window.myForm.export());
            expect(exported).toHaveProperty('field');
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

});

// ---------------------------------------------------------------------------
// Test suite: nested script security
// ---------------------------------------------------------------------------
test.describe('Mixin Types — nested script security', () => {

    test('MIXIN_NESTED_SCRIPT_DISALLOWED: <script> inside template root throws', async ({ page: pg }) => {//{{{
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<template id="badTemplate">
  <div data-smark='{"type":"form"}'>
    <script>alert('nested!');</script>
    <input data-smark type="text" name="value">
  </div>
</template>

<form id="myForm">
  <div data-smark='{"type":"#badTemplate","name":"w"}'></div>
</form>
`));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForTimeout(500);

            await expect(pg.getByText('MIXIN_NESTED_SCRIPT_DISALLOWED')).toBeVisible({ timeout: 3000 });
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('top-level sibling <script> in template still executes when allowed', async ({ page: pg }) => {//{{{
        // Regression: top-level scripts (siblings of root, not inside it) must
        // still work when allowLocalMixinScripts is explicitly set to "allow".
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<template id="withScript">
  <input data-smark type="text">
  <script>
    this.targetNode.dataset.scriptOk = 'yes';
  </script>
</template>

<form id="myForm">
  <div data-smark='{"type":"#withScript","name":"field"}'></div>
</form>
`, '', { allowLocalMixinScripts: 'allow' }));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered);

            const scriptOk = await pg.evaluate(() => {
                const field = window.myForm.find('field');
                return field?.targetNode?.dataset?.scriptOk;
            });
            expect(scriptOk).toBe('yes');
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('MIXIN_NESTED_SCRIPT_DISALLOWED: <script> inside data-for param also throws', async ({ page: pg }) => {//{{{
        // Security: param elements with nested scripts must also be rejected.
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<template id="paramTarget">
  <div data-smark='{"type":"form"}'>
    <span id="slot">Default</span>
  </div>
</template>

<form id="myForm">
  <div data-smark='{"type":"#paramTarget","name":"w"}'>
    <!-- Attempt to inject a script via the data-for parameter -->
    <div data-for="slot">
      <script>alert('injected!');</script>
      Injected content
    </div>
  </div>
</form>
`));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForTimeout(500);

            await expect(pg.getByText('MIXIN_NESTED_SCRIPT_DISALLOWED')).toBeVisible({ timeout: 3000 });
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

});

// ---------------------------------------------------------------------------
// Test suite: mixin script execution policy
// ---------------------------------------------------------------------------
test.describe('Mixin Types — script execution policy', () => {

    test('MIXIN_SCRIPT_LOCAL_BLOCKED: local template <script> blocked by default', async ({ page: pg }) => {//{{{
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<template id="withScript">
  <input data-smark type="text">
  <script>this.targetNode.dataset.ran = 'yes';</script>
</template>

<form id="myForm">
  <div data-smark='{"type":"#withScript","name":"field"}'></div>
</form>
`));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForTimeout(500);
            await expect(pg.getByText('MIXIN_SCRIPT_LOCAL_BLOCKED')).toBeVisible({ timeout: 3000 });
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('allowLocalMixinScripts:"noscript" silently discards local <script>', async ({ page: pg }) => {//{{{
        let onClosed;
        try {
            const { url, onClosed: oc } = await renderHtml(page(`
<template id="withScript">
  <input data-smark type="text">
  <script>this.targetNode.dataset.ran = 'yes';</script>
</template>

<form id="myForm">
  <div data-smark='{"type":"#withScript","name":"field"}'></div>
</form>
`, '', { allowLocalMixinScripts: 'noscript' }));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered, { timeout: 5000 });

            // Script discarded — data attribute must not be set.
            const ran = await pg.evaluate(() => {
                return window.myForm.find('field')?.targetNode?.dataset?.ran;
            });
            expect(ran).toBeUndefined();
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

});

// ---------------------------------------------------------------------------
// Test suite: external mixin fetch policy
// ---------------------------------------------------------------------------
test.describe('Mixin Types — external fetch policy', () => {

    test('MIXIN_EXTERNAL_FETCH_BLOCKED: external URL blocked by default', async ({ page: pg }) => {//{{{
        let onClosed;
        let extOnClosed;
        try {
            const extSuffix = Math.random().toString(36).slice(2, 8);
            const extFname = `ext_blocked_${extSuffix}.html`;
            const extFpath = path.join(tmpDir, extFname);
            await Fs.promises.writeFile(extFpath, `<!DOCTYPE html>
<html><body>
<template id="t"><input data-smark type="text"></template>
</body></html>`);
            extOnClosed = async () => Fs.promises.unlink(extFpath).catch(() => {});

            const extUrl = `/test/tmp/${extFname}`;
            const { url, onClosed: oc } = await renderHtml(page(`
<form id="myForm">
  <div data-smark='{"type":"${extUrl}#t","name":"f"}'></div>
</form>
`));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForTimeout(500);
            await expect(pg.getByText('MIXIN_EXTERNAL_FETCH_BLOCKED')).toBeVisible({ timeout: 3000 });
        } finally {
            if (onClosed) await onClosed();
            if (extOnClosed) await extOnClosed();
        }
    });//}}}

    test('allowExternalMixins:"same-origin" allows same-origin external templates', async ({ page: pg }) => {//{{{
        let onClosed;
        let extOnClosed;
        try {
            const extSuffix = Math.random().toString(36).slice(2, 8);
            const extFname = `ext_same_origin_${extSuffix}.html`;
            const extFpath = path.join(tmpDir, extFname);
            await Fs.promises.writeFile(extFpath, `<!DOCTYPE html>
<html><body>
<template id="t"><input data-smark type="text"></template>
</body></html>`);
            extOnClosed = async () => Fs.promises.unlink(extFpath).catch(() => {});

            const extUrl = `/test/tmp/${extFname}`;
            const { url, onClosed: oc } = await renderHtml(page(`
<form id="myForm">
  <div data-smark='{"type":"${extUrl}#t","name":"f"}'></div>
</form>
`, '', { allowExternalMixins: 'same-origin' }));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered, { timeout: 5000 });

            const exported = await pg.evaluate(() => window.myForm.export());
            expect(exported).toHaveProperty('f');
        } finally {
            if (onClosed) await onClosed();
            if (extOnClosed) await extOnClosed();
        }
    });//}}}

    test('MIXIN_SCRIPT_SAME_ORIGIN_BLOCKED: same-origin external <script> blocked by default', async ({ page: pg }) => {//{{{
        let onClosed;
        let extOnClosed;
        try {
            const extSuffix = Math.random().toString(36).slice(2, 8);
            const extFname = `ext_script_blocked_${extSuffix}.html`;
            const extFpath = path.join(tmpDir, extFname);
            await Fs.promises.writeFile(extFpath, `<!DOCTYPE html>
<html><body>
<template id="t">
  <input data-smark type="text">
  <script>this.targetNode.dataset.ran = 'yes';</script>
</template>
</body></html>`);
            extOnClosed = async () => Fs.promises.unlink(extFpath).catch(() => {});

            const extUrl = `/test/tmp/${extFname}`;
            const { url, onClosed: oc } = await renderHtml(page(`
<form id="myForm">
  <div data-smark='{"type":"${extUrl}#t","name":"f"}'></div>
</form>
`, '', { allowExternalMixins: 'same-origin' }));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForTimeout(500);
            await expect(pg.getByText('MIXIN_SCRIPT_SAME_ORIGIN_BLOCKED')).toBeVisible({ timeout: 3000 });
        } finally {
            if (onClosed) await onClosed();
            if (extOnClosed) await extOnClosed();
        }
    });//}}}

    test('allowSameOriginMixinScripts:"allow" permits same-origin external <script>', async ({ page: pg }) => {//{{{
        let onClosed;
        let extOnClosed;
        try {
            const extSuffix = Math.random().toString(36).slice(2, 8);
            const extFname = `ext_script_allow_${extSuffix}.html`;
            const extFpath = path.join(tmpDir, extFname);
            await Fs.promises.writeFile(extFpath, `<!DOCTYPE html>
<html><body>
<template id="t">
  <input data-smark type="text">
  <script>this.targetNode.dataset.ran = 'yes';</script>
</template>
</body></html>`);
            extOnClosed = async () => Fs.promises.unlink(extFpath).catch(() => {});

            const extUrl = `/test/tmp/${extFname}`;
            const { url, onClosed: oc } = await renderHtml(page(`
<form id="myForm">
  <div data-smark='{"type":"${extUrl}#t","name":"f"}'></div>
</form>
`, '', { allowExternalMixins: 'same-origin', allowSameOriginMixinScripts: 'allow' }));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered, { timeout: 5000 });

            const ran = await pg.evaluate(() => {
                return window.myForm.find('f')?.targetNode?.dataset?.ran;
            });
            expect(ran).toBe('yes');
        } finally {
            if (onClosed) await onClosed();
            if (extOnClosed) await extOnClosed();
        }
    });//}}}

    test('allowSameOriginMixinScripts:"noscript" silently discards same-origin external <script>', async ({ page: pg }) => {//{{{
        let onClosed;
        let extOnClosed;
        try {
            const extSuffix = Math.random().toString(36).slice(2, 8);
            const extFname = `ext_script_noscript_${extSuffix}.html`;
            const extFpath = path.join(tmpDir, extFname);
            await Fs.promises.writeFile(extFpath, `<!DOCTYPE html>
<html><body>
<template id="t">
  <input data-smark type="text">
  <script>this.targetNode.dataset.ran = 'yes';</script>
</template>
</body></html>`);
            extOnClosed = async () => Fs.promises.unlink(extFpath).catch(() => {});

            const extUrl = `/test/tmp/${extFname}`;
            const { url, onClosed: oc } = await renderHtml(page(`
<form id="myForm">
  <div data-smark='{"type":"${extUrl}#t","name":"f"}'></div>
</form>
`, '', { allowExternalMixins: 'same-origin', allowSameOriginMixinScripts: 'noscript' }));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered, { timeout: 5000 });

            // Script silently discarded — data attribute must not be set.
            const ran = await pg.evaluate(() => {
                return window.myForm.find('f')?.targetNode?.dataset?.ran;
            });
            expect(ran).toBeUndefined();
        } finally {
            if (onClosed) await onClosed();
            if (extOnClosed) await extOnClosed();
        }
    });//}}}

});

// ---------------------------------------------------------------------------
// Test suite: per-origin policy objects
// Tests for the object form of allowExternalMixins and script policy options.
// ---------------------------------------------------------------------------
test.describe('Mixin Types — per-origin policy objects', () => {

    test('allowExternalMixins as object with origin-specific "allow" permits fetch', async ({ page: pg }) => {//{{{
        let onClosed;
        let extOnClosed;
        try {
            const port = await getServerPort();
            const origin = `http://127.0.0.1:${port}`;
            const extSuffix = Math.random().toString(36).slice(2, 8);
            const extFname = `per_origin_allow_${extSuffix}.html`;
            const extFpath = path.join(tmpDir, extFname);
            await Fs.promises.writeFile(extFpath, `<!DOCTYPE html>
<html><body>
<template id="t"><input data-smark type="text"></template>
</body></html>`);
            extOnClosed = async () => Fs.promises.unlink(extFpath).catch(() => {});

            const extUrl = `/test/tmp/${extFname}`;
            const { url, onClosed: oc } = await renderHtml(page(`
<form id="myForm">
  <div data-smark='{"type":"${extUrl}#t","name":"f"}'></div>
</form>
`, '', { allowExternalMixins: { [origin]: 'allow', '*': 'block' } }));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered, { timeout: 5000 });

            const exported = await pg.evaluate(() => window.myForm.export());
            expect(exported).toHaveProperty('f');
        } finally {
            if (onClosed) await onClosed();
            if (extOnClosed) await extOnClosed();
        }
    });//}}}

    test('allowExternalMixins as object with "*": "block" blocks unlisted origins', async ({ page: pg }) => {//{{{
        let onClosed;
        let extOnClosed;
        try {
            const extSuffix = Math.random().toString(36).slice(2, 8);
            const extFname = `per_origin_wildcard_${extSuffix}.html`;
            const extFpath = path.join(tmpDir, extFname);
            await Fs.promises.writeFile(extFpath, `<!DOCTYPE html>
<html><body>
<template id="t"><input data-smark type="text"></template>
</body></html>`);
            extOnClosed = async () => Fs.promises.unlink(extFpath).catch(() => {});

            const extUrl = `/test/tmp/${extFname}`;
            // No matching origin in map and '*' is 'block'.
            const { url, onClosed: oc } = await renderHtml(page(`
<form id="myForm">
  <div data-smark='{"type":"${extUrl}#t","name":"f"}'></div>
</form>
`, '', { allowExternalMixins: { 'https://other-origin.example.com': 'allow', '*': 'block' } }));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForTimeout(500);
            await expect(pg.getByText('MIXIN_EXTERNAL_FETCH_BLOCKED')).toBeVisible({ timeout: 3000 });
        } finally {
            if (onClosed) await onClosed();
            if (extOnClosed) await extOnClosed();
        }
    });//}}}

    test('allowExternalMixins as object with "*": "allow" permits any origin', async ({ page: pg }) => {//{{{
        let onClosed;
        let extOnClosed;
        try {
            const extSuffix = Math.random().toString(36).slice(2, 8);
            const extFname = `per_origin_wildcard_allow_${extSuffix}.html`;
            const extFpath = path.join(tmpDir, extFname);
            await Fs.promises.writeFile(extFpath, `<!DOCTYPE html>
<html><body>
<template id="t"><input data-smark type="text"></template>
</body></html>`);
            extOnClosed = async () => Fs.promises.unlink(extFpath).catch(() => {});

            const extUrl = `/test/tmp/${extFname}`;
            // Wildcard 'allow' — any origin including unlisted ones.
            const { url, onClosed: oc } = await renderHtml(page(`
<form id="myForm">
  <div data-smark='{"type":"${extUrl}#t","name":"f"}'></div>
</form>
`, '', { allowExternalMixins: { '*': 'allow' } }));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered, { timeout: 5000 });

            const exported = await pg.evaluate(() => window.myForm.export());
            expect(exported).toHaveProperty('f');
        } finally {
            if (onClosed) await onClosed();
            if (extOnClosed) await extOnClosed();
        }
    });//}}}

    test('allowExternalMixins as object with no matching key defaults to "block"', async ({ page: pg }) => {//{{{
        let onClosed;
        let extOnClosed;
        try {
            const extSuffix = Math.random().toString(36).slice(2, 8);
            const extFname = `per_origin_nokey_${extSuffix}.html`;
            const extFpath = path.join(tmpDir, extFname);
            await Fs.promises.writeFile(extFpath, `<!DOCTYPE html>
<html><body>
<template id="t"><input data-smark type="text"></template>
</body></html>`);
            extOnClosed = async () => Fs.promises.unlink(extFpath).catch(() => {});

            const extUrl = `/test/tmp/${extFname}`;
            // Empty object — no matching key, no wildcard → defaults to 'block'.
            const { url, onClosed: oc } = await renderHtml(page(`
<form id="myForm">
  <div data-smark='{"type":"${extUrl}#t","name":"f"}'></div>
</form>
`, '', { allowExternalMixins: {} }));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForTimeout(500);
            await expect(pg.getByText('MIXIN_EXTERNAL_FETCH_BLOCKED')).toBeVisible({ timeout: 3000 });
        } finally {
            if (onClosed) await onClosed();
            if (extOnClosed) await extOnClosed();
        }
    });//}}}

    test('allowSameOriginMixinScripts as object with origin-specific "allow" permits scripts', async ({ page: pg }) => {//{{{
        let onClosed;
        let extOnClosed;
        try {
            const port = await getServerPort();
            const origin = `http://127.0.0.1:${port}`;
            const extSuffix = Math.random().toString(36).slice(2, 8);
            const extFname = `per_origin_script_allow_${extSuffix}.html`;
            const extFpath = path.join(tmpDir, extFname);
            await Fs.promises.writeFile(extFpath, `<!DOCTYPE html>
<html><body>
<template id="t">
  <input data-smark type="text">
  <script>this.targetNode.dataset.ran = 'yes';</script>
</template>
</body></html>`);
            extOnClosed = async () => Fs.promises.unlink(extFpath).catch(() => {});

            const extUrl = `/test/tmp/${extFname}`;
            const { url, onClosed: oc } = await renderHtml(page(`
<form id="myForm">
  <div data-smark='{"type":"${extUrl}#t","name":"f"}'></div>
</form>
`, '', {
                allowExternalMixins: 'same-origin',
                allowSameOriginMixinScripts: { [origin]: 'allow', '*': 'block' },
            }));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered, { timeout: 5000 });

            const ran = await pg.evaluate(() => {
                return window.myForm.find('f')?.targetNode?.dataset?.ran;
            });
            expect(ran).toBe('yes');
        } finally {
            if (onClosed) await onClosed();
            if (extOnClosed) await extOnClosed();
        }
    });//}}}

    test('allowSameOriginMixinScripts as object with "*": "noscript" discards scripts for unlisted origin', async ({ page: pg }) => {//{{{
        let onClosed;
        let extOnClosed;
        try {
            const extSuffix = Math.random().toString(36).slice(2, 8);
            const extFname = `per_origin_script_noscript_${extSuffix}.html`;
            const extFpath = path.join(tmpDir, extFname);
            await Fs.promises.writeFile(extFpath, `<!DOCTYPE html>
<html><body>
<template id="t">
  <input data-smark type="text">
  <script>this.targetNode.dataset.ran = 'yes';</script>
</template>
</body></html>`);
            extOnClosed = async () => Fs.promises.unlink(extFpath).catch(() => {});

            const extUrl = `/test/tmp/${extFname}`;
            // Origin not in map → falls back to '*': 'noscript' → silently discard.
            const { url, onClosed: oc } = await renderHtml(page(`
<form id="myForm">
  <div data-smark='{"type":"${extUrl}#t","name":"f"}'></div>
</form>
`, '', {
                allowExternalMixins: 'same-origin',
                allowSameOriginMixinScripts: { 'https://other.example.com': 'allow', '*': 'noscript' },
            }));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered, { timeout: 5000 });

            const ran = await pg.evaluate(() => {
                return window.myForm.find('f')?.targetNode?.dataset?.ran;
            });
            expect(ran).toBeUndefined();
        } finally {
            if (onClosed) await onClosed();
            if (extOnClosed) await extOnClosed();
        }
    });//}}}

});

test.describe('Mixin Types — external template loading', () => {

    test('loads a template from an external HTML file', async ({ page: pg }) => {//{{{
        let onClosed;
        let extOnClosed;
        try {
            const port = await getServerPort();
            // Create the external templates file.
            const extSuffix = Math.random().toString(36).slice(2, 8);
            const extFname = `ext_templates_${extSuffix}.html`;
            const extFpath = path.join(tmpDir, extFname);
            await Fs.promises.writeFile(extFpath, `<!DOCTYPE html>
<html><body>
<template id="remoteField">
  <input data-smark type="text">
</template>
</body></html>`);
            extOnClosed = async () => Fs.promises.unlink(extFpath).catch(() => {});

            const extUrl = `/test/tmp/${extFname}`;
            const { url, onClosed: oc } = await renderHtml(page(`
<form id="myForm">
  <div data-smark='{"type":"${extUrl}#remoteField","name":"remote"}'></div>
</form>
`, '', { allowExternalMixins: 'same-origin' }));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered, { timeout: 5000 });

            const exported = await pg.evaluate(() => window.myForm.export());
            expect(exported).toHaveProperty('remote');
            expect(exported.remote).toBe('');
        } finally {
            if (onClosed) await onClosed();
            if (extOnClosed) await extOnClosed();
        }
    });//}}}

    test('external document is fetched only once for multiple references', async ({ page: pg }) => {//{{{
        let onClosed;
        let extOnClosed;
        try {
            const port = await getServerPort();
            const extSuffix = Math.random().toString(36).slice(2, 8);
            const extFname = `ext_multi_${extSuffix}.html`;
            const extFpath = path.join(tmpDir, extFname);
            await Fs.promises.writeFile(extFpath, `<!DOCTYPE html>
<html><body>
<template id="simpleInput">
  <input data-smark type="text">
</template>
</body></html>`);
            extOnClosed = async () => Fs.promises.unlink(extFpath).catch(() => {});

            const extUrl = `/test/tmp/${extFname}`;
            const { url, onClosed: oc } = await renderHtml(page(`
<form id="myForm">
  <div data-smark='{"type":"${extUrl}#simpleInput","name":"first"}'></div>
  <div data-smark='{"type":"${extUrl}#simpleInput","name":"second"}'></div>
</form>
`, '', { allowExternalMixins: 'same-origin' }));
            onClosed = oc;
            await pg.goto(url);
            await pg.waitForFunction(() => window.myForm?.rendered, { timeout: 5000 });

            const exported = await pg.evaluate(() => window.myForm.export());
            expect(exported).toHaveProperty('first');
            expect(exported).toHaveProperty('second');
        } finally {
            if (onClosed) await onClosed();
            if (extOnClosed) await extOnClosed();
        }
    });//}}}

});
