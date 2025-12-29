import { test, expect } from '@playwright/test';
import {renderPug} from '../src/lib/test/helpers.js';

const pugSrc = (// {{{
`extends layout.pug
block mainForm
    .section
        // Regular time input
        p
            label Regular Time
            input(
                data-smark={
                    type: "time",
                    name: "regularTime"
                }
                type="time"
            )
        
        // Singleton time component
        div(data-smark={
            type: "time",
            name: "singletonTime"
        })
            p
                label Singleton Time
                input(data-smark)
                button(data-smark={
                    action: "clear"
                }) Clear
        
        // Test different input scenarios
        p
            label Coercion Test
            input(
                data-smark={
                    type: "time", 
                    name: "coercionTest"
                }
                type="time"
            )
`);// }}}

test.describe('Time Component Type Test', () => {
    const test_title = 'Time Component Type Test';

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
                const timeField = form.find("/coercionTest");
                
                // Test Date instance (extract time portion)
                const testDate = new Date("2023-11-30T14:30:45.789Z");
                await timeField.import(testDate);
                const dateInstance = await timeField.export();
                
                // Test epoch number (convert to Date, extract time)
                const epochTime = new Date("2023-12-25T09:15:30.000Z").getTime();
                await timeField.import(epochTime);
                const epochNumber = await timeField.export();
                
                // Test HH:mm string format
                await timeField.import("12:34");
                const shortTimeString = await timeField.export();
                
                // Test HH:mm:ss string format
                await timeField.import("18:45:30");
                const fullTimeString = await timeField.export();
                
                // Test compact time string (HHmmss)
                await timeField.import("154530");
                const compactTimeString = await timeField.export();
                
                // Test short compact time string (HHmm)
                await timeField.import("1545");
                const shortCompactTimeString = await timeField.export();
                
                // Test invalid string
                await timeField.import("invalid-time");
                const invalidString = await timeField.export();
                
                // Test null/empty
                await timeField.import(null);
                const nullValue = await timeField.export();
                
                // Test empty string
                await timeField.import("");
                const emptyString = await timeField.export();
                
                return {
                    dateInstance,
                    epochNumber,
                    shortTimeString,
                    fullTimeString,
                    compactTimeString,
                    shortCompactTimeString,
                    invalidString,
                    nullValue,
                    emptyString
                };
            });
            
            // Date instances and epochs will vary by timezone, so just check format
            expect(coercionResults.dateInstance).toMatch(/^\d{2}:\d{2}:\d{2}$/);
            expect(coercionResults.epochNumber).toMatch(/^\d{2}:\d{2}:\d{2}$/);
            expect(coercionResults.shortTimeString).toBe("12:34:00");
            expect(coercionResults.fullTimeString).toBe("18:45:30");
            expect(coercionResults.compactTimeString).toBe("15:45:30");
            expect(coercionResults.shortCompactTimeString).toBe("15:45:00");
            expect(coercionResults.invalidString).toBe(null);
            expect(coercionResults.nullValue).toBe(null);
            expect(coercionResults.emptyString).toBe(null);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('Check it exports valid time string', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const exportResults = await page.evaluate(async () => {
                const timeField = form.find("/regularTime");
                
                // Import a time and check export format
                await timeField.import("14:25:37");
                const exported = await timeField.export();
                
                return {
                    exportedValue: exported,
                    exportedType: typeof exported,
                    isTimeFormat: /^\d{2}:\d{2}:\d{2}$/.test(exported)
                };
            });
            
            expect(exportResults.exportedValue).toBe("14:25:37");
            expect(exportResults.exportedType).toBe("string");
            expect(exportResults.isTimeFormat).toBe(true);
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
                const singletonField = form.find("/singletonTime");
                
                // Test import/export works on singleton
                await singletonField.import("16:20:45");
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
            
            expect(singletonResults.exported).toBe("16:20:45");
            expect(singletonResults.clearedValue).toBe(null);
            expect(singletonResults.innerValue).toBe(null);
            expect(singletonResults.isSingleton).toBe(true);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

});
