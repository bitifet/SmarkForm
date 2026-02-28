import { test, expect } from '@playwright/test';
import {renderPug} from '../src/lib/test/helpers.js';

test.describe('data-smark-* attribute options', () => {
    const test_title = 'data-smark-* attribute options';

    test('data-smark-type attribute specifies component type', async ({ page }) => {
        let onClosed;
        const pugSrc = (
`extends layout.pug
block mainForm
    div(data-smark-type="form" data-smark-name="myForm")
        input(data-smark name="username" type="text")
`);
        try {
            const rendered = await renderPug({ title: test_title, src: pugSrc });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await form.rendered;
                const myForm = form.find("/myForm");
                return {
                    type: myForm?.options?.type,
                    name: myForm?.name,
                };
            });

            expect(result.type).toBe('form');
            expect(result.name).toBe('myForm');
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('data-smark-type attribute for list type works', async ({ page }) => {
        let onClosed;
        const pugSrc = (
`extends layout.pug
block mainForm
    div(data-smark-type="list" data-smark-name="items")
        div(data-smark)
            input(data-smark name="item" type="text")
`);
        try {
            const rendered = await renderPug({ title: test_title, src: pugSrc });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await form.rendered;
                const items = form.find("/items");
                return {
                    type: items?.options?.type,
                };
            });

            expect(result.type).toBe('list');
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('data-smark-* attribute values are parsed as JSON types', async ({ page }) => {
        let onClosed;
        // data-smark-export-empties uses kebab-case, converted to camelCase "exportEmpties"
        const pugSrc = (
`extends layout.pug
block mainForm
    div(data-smark-type="list" data-smark-name="items" data-smark-export-empties="true")
        div(data-smark)
            input(data-smark name="item" type="text")
`);
        try {
            const rendered = await renderPug({ title: test_title, src: pugSrc });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await form.rendered;
                const items = form.find("/items");
                return {
                    exportEmpties: items?.options?.exportEmpties,
                };
            });

            // String value "true" from HTML attribute is parsed as JSON boolean true
            expect(result.exportEmpties).toBe(true);
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('data-smark-* attribute keeps on DOM for CSS targeting', async ({ page }) => {
        let onClosed;
        const pugSrc = (
`extends layout.pug
block mainForm
    div(data-smark-type="form" data-smark-name="myForm")
        input(data-smark name="username" type="text")
`);
        try {
            const rendered = await renderPug({ title: test_title, src: pugSrc });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await form.rendered;
                const el = document.querySelector('[data-smark-type="form"]');
                return {
                    found: el !== null,
                    name: el?.dataset?.smarkName,
                };
            });

            expect(result.found).toBe(true);
            expect(result.name).toBe('myForm');
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('data-smark-type="list" items with data-smark-* are cloned correctly', async ({ page }) => {
        let onClosed;
        const pugSrc = (
`extends layout.pug
block mainForm
    div(data-smark-type="list" data-smark-name="items" data-smark='{"min_items":0}')
        div(data-smark-type="form")
            input(data-smark name="item" type="text")
    button(data-smark={action:"addItem",context:"items"}) +
`);
        try {
            const rendered = await renderPug({ title: test_title, src: pugSrc });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await form.rendered;
                const items = form.find("/items");
                await items.addItem();
                const firstItem = items.children[0];
                return {
                    type: firstItem?.options?.type,
                    count: Object.keys(items.children).length,
                };
            });

            // min_items=0 so no items added by default, addItem adds 1
            expect(result.type).toBe('form');
            expect(result.count).toBe(1);
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('DUPLICATE_OPTION error when option specified in both data-smark and data-smark-* with different values', async ({ page }) => {
        let onClosed;
        const pugSrc = (
`extends layout.pug
block mainForm
    div(data-smark='{"type":"form"}' data-smark-type="list" data-smark-name="myForm")
        input(data-smark name="username" type="text")
`);
        try {
            const rendered = await renderPug({ title: test_title, src: pugSrc });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            // When DUPLICATE_OPTION fires, the node is replaced with an error element
            // containing the error code as text content
            await page.waitForSelector('div:has-text("DUPLICATE_OPTION")', { timeout: 5000 });
            const errorText = await page.textContent('div:has-text("DUPLICATE_OPTION")');
            expect(errorText).toContain('DUPLICATE_OPTION');
        } finally {
            if (onClosed) await onClosed();
        }
    });
});
