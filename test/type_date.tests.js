const dev = false;
import assert from 'assert';
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

describe('Date Component Type Test', function() {
    let browser, page, onClosed;
    const test_title = this.title;

    before(async function() {
        this.timeout(8000);
        0, {browser, page, onClosed} = await renderPug({
            title: test_title,
            src: pugSrc,
            headless: dev ? false : undefined,
        });
    });

    after(async function() {
        if (! dev) await browser.close();
        if (onClosed) await onClosed();
    });

    it('Check import coercion', async function() {//{{{
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
        
        assert.strictEqual(coercionResults.dateInstance, "2023-11-30", "Date instance should be coerced to ISO date string");
        assert.strictEqual(coercionResults.epochNumber, "2023-11-30", "Epoch number should be coerced to ISO date string");
        assert.strictEqual(coercionResults.isoString, "2023-12-25", "ISO string should be parsed correctly");
        assert.strictEqual(coercionResults.compactString, "2023-12-25", "Compact string (YYYYMMDD) should be parsed correctly");
        assert.strictEqual(coercionResults.invalidString, null, "Invalid date string should become null");
        assert.strictEqual(coercionResults.nullValue, null, "Null input should remain null");
        assert.strictEqual(coercionResults.emptyString, null, "Empty string should become null");
    });//}}}

    it('Check it exports valid ISO Date', async function() {//{{{
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
        
        assert.strictEqual(exportResults.exportedValue, "2023-06-15", "Should export ISO date string");
        assert.strictEqual(exportResults.exportedType, "string", "Should export as string type");
        assert.strictEqual(exportResults.isISOFormat, true, "Should export in ISO date format (YYYY-MM-DD)");
    });//}}}

    it('Check works as singleton', async function() {//{{{
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
        
        assert.strictEqual(singletonResults.exported, "2024-01-15", "Singleton should import/export correctly");
        assert.strictEqual(singletonResults.clearedValue, null, "Singleton should clear correctly");
        assert.strictEqual(singletonResults.innerValue, null, "Inner field should also be cleared");
        assert.strictEqual(singletonResults.isSingleton, true, "Component should be identified as singleton");
    });//}}}

});