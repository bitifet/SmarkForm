const dev = false;
import assert from 'assert';
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

describe('Number Component Type Test', function() {
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
        
        assert.strictEqual(coercionResults.stringToNumber, 123, "String '123' should be coerced to number 123");
        assert.strictEqual(coercionResults.numberToNumber, 456, "Number 456 should remain number 456");
        assert.strictEqual(coercionResults.invalidString, null, "Invalid string 'abc' should become null");
        assert.strictEqual(coercionResults.nullValue, null, "Null input should remain null");
        assert.strictEqual(coercionResults.emptyString, null, "Empty string should become null");
    });//}}}

    it('Check it exports number', async function() {//{{{
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
        
        assert.strictEqual(exportResults.exportedValue, 789, "Should export actual number value");
        assert.strictEqual(exportResults.exportedType, "number", "Should export as number type, not string");
    });//}}}

    it('Check works as singleton', async function() {//{{{
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
        
        assert.strictEqual(singletonResults.exported, 999, "Singleton should import/export correctly");
        assert.strictEqual(singletonResults.clearedValue, null, "Singleton should clear correctly");
        assert.strictEqual(singletonResults.innerValue, null, "Inner field should also be cleared");
        assert.strictEqual(singletonResults.isSingleton, true, "Component should be identified as singleton");
    });//}}}

});