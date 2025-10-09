import { test, expect } from '@playwright/test';
import {renderPug} from '../src/lib/test/helpers.js';

const pugSrc = (// {{{
`extends layout.pug
block mainForm
    .section
        // Regular date input
        p
            label Regular Date
            input(
                data-smark={
                    type: "date",
                    name: "regularDate"
                }
                type="date"
            )
        
        // Singleton date component
        div(data-smark={
            type: "date",
            name: "singletonDate"
        })
            p
                label Singleton Date
                input(data-smark)
                button(data-smark={
                    action: "clear"
                }) Clear
        
        // Test different input scenarios
        p
            label Coercion Test
            input(
                data-smark={
                    type: "date", 
                    name: "coercionTest"
                }
                type="date"
            )
`);// }}}

test.describe('Date Component Type Test', () => {
    const test_title = 'Date Component Type Test';

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
                const dateField = form.find("/coercionTest");
                
                // Test Date instance
                const testDate = new Date("2023-11-30");
                await dateField.import(testDate);
                const dateInstance = await dateField.export();
                
                // Test epoch number
                await dateField.import(testDate.getTime());
                const epochNumber = await dateField.export();
                
                // Test ISO date string
                await dateField.import("2023-12-25");
                const isoString = await dateField.export();
                
                // Test compact date string (YYYYMMDD)
                await dateField.import("20231225");
                const compactString = await dateField.export();
                
                // Test invalid string
                await dateField.import("invalid-date");
                const invalidString = await dateField.export();
                
                // Test null/empty
                await dateField.import(null);
                const nullValue = await dateField.export();
                
                // Test empty string
                await dateField.import("");
                const emptyString = await dateField.export();
                
                return {
                    dateInstance,
                    epochNumber,
                    isoString,
                    compactString,
                    invalidString,
                    nullValue,
                    emptyString
                };
            });
            
            expect(coercionResults.dateInstance).toBe("2023-11-30");
            expect(coercionResults.epochNumber).toBe("2023-11-30");
            expect(coercionResults.isoString).toBe("2023-12-25");
            expect(coercionResults.compactString).toBe("2023-12-25");
            expect(coercionResults.invalidString).toBe(null);
            expect(coercionResults.nullValue).toBe(null);
            expect(coercionResults.emptyString).toBe(null);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('Check it exports valid ISO Date', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const exportResults = await page.evaluate(async () => {
                const dateField = form.find("/regularDate");
                
                // Import a date and check export format
                await dateField.import(new Date("2023-06-15T12:34:56.789Z"));
                const exported = await dateField.export();
                
                return {
                    exportedValue: exported,
                    exportedType: typeof exported,
                    isISOFormat: /^\d{4}-\d{2}-\d{2}$/.test(exported)
                };
            });
            
            expect(exportResults.exportedValue).toBe("2023-06-15");
            expect(exportResults.exportedType).toBe("string");
            expect(exportResults.isISOFormat).toBe(true);
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
                const singletonField = form.find("/singletonDate");
                
                // Test import/export works on singleton
                const testDate = new Date("2024-01-15");
                await singletonField.import(testDate);
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
            
            expect(singletonResults.exported).toBe("2024-01-15");
            expect(singletonResults.clearedValue).toBe(null);
            expect(singletonResults.innerValue).toBe(null);
            expect(singletonResults.isSingleton).toBe(true);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

});