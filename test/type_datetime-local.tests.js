import { test, expect } from '@playwright/test';
import {renderPug} from '../src/lib/test/helpers.js';

const pugSrc = (// {{{
`extends layout.pug
block mainForm
    .section
        // Regular datetime-local input
        p
            label Regular DateTime
            input(
                data-smark={
                    type: "datetimeLocal",
                    name: "regularDateTime"
                }
                type="datetime-local"
            )
        
        // Singleton datetime-local component
        div(data-smark={
            type: "datetimeLocal",
            name: "singletonDateTime"
        })
            p
                label Singleton DateTime
                input(data-smark)
                button(data-smark={
                    action: "clear"
                }) Clear
        
        // Test different input scenarios
        p
            label Coercion Test
            input(
                data-smark={
                    type: "datetimeLocal", 
                    name: "coercionTest"
                }
                type="datetime-local"
            )
`);// }}}

test.describe('DateTime-Local Component Type Test', () => {
    const test_title = 'DateTime-Local Component Type Test';

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
                const dateTimeField = form.find("/coercionTest");
                
                // Test Date instance
                const testDate = new Date("2023-11-30T14:30:45");
                await dateTimeField.import(testDate);
                const dateInstance = await dateTimeField.export();
                
                // Test epoch number
                await dateTimeField.import(testDate.getTime());
                const epochNumber = await dateTimeField.export();
                
                // Test ISO datetime string with seconds
                await dateTimeField.import("2023-12-25T18:45:30");
                const isoStringWithSeconds = await dateTimeField.export();
                
                // Test ISO datetime string without seconds
                await dateTimeField.import("2023-12-25T18:45");
                const isoStringWithoutSeconds = await dateTimeField.export();
                
                // Test compact datetime string (YYYYMMDDTHHmmss)
                await dateTimeField.import("20231225T184530");
                const compactStringWithSeconds = await dateTimeField.export();
                
                // Test compact datetime string without seconds (YYYYMMDDTHHmm)
                await dateTimeField.import("20231225T1845");
                const compactStringWithoutSeconds = await dateTimeField.export();
                
                // Test ISO 8601 with timezone (like toISOString())
                await dateTimeField.import("2023-12-25T18:45:30.000Z");
                const isoStringWithTimezone = await dateTimeField.export();
                
                // Test invalid string
                await dateTimeField.import("invalid-datetime");
                const invalidString = await dateTimeField.export();
                
                // Test null/empty
                await dateTimeField.import(null);
                const nullValue = await dateTimeField.export();
                
                // Test empty string
                await dateTimeField.import("");
                const emptyString = await dateTimeField.export();
                
                return {
                    dateInstance,
                    epochNumber,
                    isoStringWithSeconds,
                    isoStringWithoutSeconds,
                    compactStringWithSeconds,
                    compactStringWithoutSeconds,
                    isoStringWithTimezone,
                    invalidString,
                    nullValue,
                    emptyString
                };
            });
            
            // Check formats - all should return YYYY-MM-DDTHH:mm:ss format
            expect(coercionResults.dateInstance).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
            expect(coercionResults.epochNumber).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
            expect(coercionResults.isoStringWithSeconds).toBe("2023-12-25T18:45:30");
            expect(coercionResults.isoStringWithoutSeconds).toBe("2023-12-25T18:45:00");
            expect(coercionResults.compactStringWithSeconds).toBe("2023-12-25T18:45:30");
            expect(coercionResults.compactStringWithoutSeconds).toBe("2023-12-25T18:45:00");
            expect(coercionResults.isoStringWithTimezone).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
            expect(coercionResults.invalidString).toBe(null);
            expect(coercionResults.nullValue).toBe(null);
            expect(coercionResults.emptyString).toBe(null);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('Check it exports valid datetime-local string', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const exportResults = await page.evaluate(async () => {
                const dateTimeField = form.find("/regularDateTime");
                
                // Import a datetime and check export format
                await dateTimeField.import(new Date("2023-06-15T12:34:56"));
                const exported = await dateTimeField.export();
                
                return {
                    exportedValue: exported,
                    exportedType: typeof exported,
                    isDateTimeFormat: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(exported)
                };
            });
            
            expect(exportResults.exportedValue).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
            expect(exportResults.exportedType).toBe("string");
            expect(exportResults.isDateTimeFormat).toBe(true);
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
                const singletonField = form.find("/singletonDateTime");
                
                // Test import/export works on singleton
                const testDateTime = new Date("2024-01-15T16:20:45");
                await singletonField.import(testDateTime);
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
            
            expect(singletonResults.exported).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
            expect(singletonResults.clearedValue).toBe(null);
            expect(singletonResults.innerValue).toBe(null);
            expect(singletonResults.isSingleton).toBe(true);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('Check preserves local time (not UTC)', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const timeResults = await page.evaluate(async () => {
                const dateTimeField = form.find("/coercionTest");
                
                // Import a specific local datetime
                await dateTimeField.import("2023-12-25T14:30:45");
                const exported = await dateTimeField.export();
                
                // The exported value should match exactly what was imported
                return {
                    exported,
                    matches: exported === "2023-12-25T14:30:45"
                };
            });
            
            expect(timeResults.exported).toBe("2023-12-25T14:30:45");
            expect(timeResults.matches).toBe(true);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

});
