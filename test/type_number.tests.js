import { test, expect } from '@playwright/test';
import {renderPug} from '../src/lib/test/helpers.js';

const pugSrc = (// {{{
`extends layout.pug
block mainForm
    .section
        // Regular number input
        p
            label Regular Number
            input(
                data-smark={
                    type: "number",
                    name: "regularNumber"
                }
                type="number"
                placeholder="Enter a number"
            )
        
        // Singleton number component
        div(data-smark={
            type: "number",
            name: "singletonNumber"
        })
            p
                label Singleton Number
                input(data-smark)
                button(data-smark={
                    action: "clear"
                }) Clear
        
        // Test different input scenarios
        p
            label String Coercion Test
            input(
                data-smark={
                    type: "number", 
                    name: "coercionTest"
                }
                type="number"
            )
`);// }}}

test.describe('Number Component Type Test', () => {
    const test_title = 'Number Component Type Test';

    test('Check import coercion', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);
            const coercionResults = await page.evaluate(async () => {
                const numberField = form.find("/coercionTest");
                
                // Test string to number coercion
                await numberField.import("123");
                const stringToNumber = await numberField.export();
                
                // Test number input
                await numberField.import(456);
                const numberToNumber = await numberField.export();
                
                // Test invalid string
                await numberField.import("abc");
                const invalidString = await numberField.export();
                
                // Test null/empty
                await numberField.import(null);
                const nullValue = await numberField.export();
                
                // Test empty string
                await numberField.import("");
                const emptyString = await numberField.export();
                
                return {
                    stringToNumber,
                    numberToNumber,
                    invalidString,
                    nullValue,
                    emptyString
                };
            });
            
            expect(coercionResults.stringToNumber).toBe(123);
            expect(coercionResults.numberToNumber).toBe(456);
            expect(coercionResults.invalidString).toBe(null);
            expect(coercionResults.nullValue).toBe(null);
            expect(coercionResults.emptyString).toBe(null);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('Check it exports number', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const exportResults = await page.evaluate(async () => {
                const numberField = form.find("/regularNumber");
                
                // Import valid number string
                await numberField.import("789");
                const exported = await numberField.export();
                
                return {
                    exportedValue: exported,
                    exportedType: typeof exported
                };
            });
            
            expect(exportResults.exportedValue).toBe(789);
            expect(exportResults.exportedType).toBe("number");
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('Check works as singleton', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const singletonResults = await page.evaluate(async () => {
                const singletonField = form.find("/singletonNumber");
                
                // Test import/export works on singleton
                await singletonField.import(999);
                const exported = await singletonField.export();
                
                // Test clear action works
                await singletonField.clear();
                const clearedValue = await singletonField.export();
                
                // Check that singleton correctly delegates to inner field
                const innerValue = await singletonField.children[""].export();
                
                return {
                    exported,
                    clearedValue,
                    innerValue,
                    isSingleton: singletonField.isSingleton
                };
            });
            
            expect(singletonResults.exported).toBe(999);
            expect(singletonResults.clearedValue).toBe(null);
            expect(singletonResults.innerValue).toBe(null);
            expect(singletonResults.isSingleton).toBe(true);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

});