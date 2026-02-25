import { test, expect } from '@playwright/test';
import {renderPug} from '../src/lib/test/helpers.js';

const pugSrc = (// {{{
`extends layout.pug
block mainForm
    .section
        h2 Simple Input Field Tests
        
        // Input with no default
        p
            label Input (no default)
            input(
                data-smark={
                    type: "input",
                    name: "inputNoDefault"
                }
                type="text"
            )
        
        // Input with default value
        p
            label Input (with default)
            input(
                data-smark={
                    type: "input",
                    name: "inputWithDefault",
                    value: "DefaultValue"
                }
                type="text"
            )
        
        // Number with default
        p
            label Number (with default)
            input(
                data-smark={
                    type: "number",
                    name: "numberWithDefault",
                    value: 42
                }
                type="number"
            )
    
    .section
        h2 Nested Form Tests
        
        div(data-smark={
            type: "form",
            name: "nestedForm"
        })
            p
                label Nested Field 1
                input(
                    data-smark
                    name="field1"
                    type="text"
                )
            p
                label Nested Field 2
                input(
                    data-smark
                    name="field2"
                    type="text"
                )
        
        // Nested form with default value
        div(data-smark={
            type: "form",
            name: "nestedFormWithDefaults",
            value: {
                name: "John Doe",
                age: "30"
            }
        })
            p
                label Name
                input(
                    data-smark
                    name="name"
                    type="text"
                )
            p
                label Age
                input(
                    data-smark
                    name="age"
                    type="text"
                )
    
    .section
        h2 List Tests
        
        // List with no defaults (empty)
        div(data-smark={
            type: "list",
            name: "listNoDefault",
            min_items: 0
        })
            div(data-smark)
                p
                    label Item
                    input(data-smark name="item" type="text")
        
        // List with prepopulated defaults
        div(data-smark={
            type: "list",
            name: "listWithDefaults",
            min_items: 0,
            value: [
                {item: "Default Item 1"},
                {item: "Default Item 2"}
            ]
        })
            div(data-smark)
                p
                    label Item
                    input(data-smark name="item" type="text")
        
        // Deeply nested structure
        div(data-smark={
            type: "form",
            name: "deeplyNested",
            value: {
                users: [
                    {name: "Alice", age: "25"},
                    {name: "Bob", age: "30"}
                ]
            }
        })
            div(data-smark={
                type: "list",
                name: "users",
                min_items: 0
            })
                div(data-smark)
                    p
                        label Name
                        input(data-smark name="name" type="text")
                    p
                        label Age
                        input(data-smark name="age" type="text")
`);// }}}

test.describe('Clear vs Reset Action Tests', () => {
    const test_title = 'Clear vs Reset Action Tests';

    test('Simple input: clear vs reset (no default)', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const results = await page.evaluate(async () => {
                const field = form.find("/inputNoDefault");
                
                // Set a value (setDefault:false to preserve initialization default)
                await field.import("UserValue", {setDefault: false});
                const afterImport = await field.export();
                
                // Clear should remove the value (empty string for input)
                await field.clear();
                const afterClear = await field.export();
                
                // Import again (setDefault:false to preserve initialization default)
                await field.import("AnotherValue", {setDefault: false});
                const afterSecondImport = await field.export();
                
                // Reset should also clear (no default defined)
                await field.reset();
                const afterReset = await field.export();
                
                return {
                    afterImport,
                    afterClear,
                    afterSecondImport,
                    afterReset
                };
            });
            
            expect(results.afterImport).toBe("UserValue");
            expect(results.afterClear).toBe("");
            expect(results.afterSecondImport).toBe("AnotherValue");
            expect(results.afterReset).toBe("");
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('Simple input: clear vs reset (with default)', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const results = await page.evaluate(async () => {
                const field = form.find("/inputWithDefault");
                
                // Initially should have default
                const initial = await field.export();
                
                // Set a different value (setDefault:false to preserve initialization default)
                await field.import("UserValue", {setDefault: false});
                const afterImport = await field.export();
                
                // Clear should remove ALL values (ignoring default)
                await field.clear();
                const afterClear = await field.export();
                
                // Import another value (setDefault:false to preserve initialization default)
                await field.import("AnotherValue", {setDefault: false});
                const afterSecondImport = await field.export();
                
                // Reset should restore default value
                await field.reset();
                const afterReset = await field.export();
                
                return {
                    initial,
                    afterImport,
                    afterClear,
                    afterSecondImport,
                    afterReset
                };
            });
            
            expect(results.initial).toBe("DefaultValue");
            expect(results.afterImport).toBe("UserValue");
            expect(results.afterClear).toBe(""); // Clear removes everything
            expect(results.afterSecondImport).toBe("AnotherValue");
            expect(results.afterReset).toBe("DefaultValue"); // Reset restores default
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('Number field: clear vs reset (with default)', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const results = await page.evaluate(async () => {
                const field = form.find("/numberWithDefault");
                
                const initial = await field.export();
                
                await field.import(100, {setDefault: false});
                const afterImport = await field.export();
                
                await field.clear();
                const afterClear = await field.export();
                
                await field.import(200, {setDefault: false});
                const afterSecondImport = await field.export();
                
                await field.reset();
                const afterReset = await field.export();
                
                return {
                    initial,
                    afterImport,
                    afterClear,
                    afterSecondImport,
                    afterReset
                };
            });
            
            expect(results.initial).toBe(42);
            expect(results.afterImport).toBe(100);
            expect(results.afterClear).toBe(null); // Number clear gives null (empty)
            expect(results.afterSecondImport).toBe(200);
            expect(results.afterReset).toBe(42); // Reset restores default
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('Nested form: clear vs reset (no defaults)', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const results = await page.evaluate(async () => {
                const form_field = form.find("/nestedForm");
                
                // Set values (setDefault:false to preserve initialization default)
                await form_field.import({field1: "Value1", field2: "Value2"}, {setDefault: false});
                const afterImport = await form_field.export();
                
                // Clear should empty all fields
                await form_field.clear();
                const afterClear = await form_field.export();
                
                // Set again (setDefault:false to preserve initialization default)
                await form_field.import({field1: "NewValue1", field2: "NewValue2"}, {setDefault: false});
                const afterSecondImport = await form_field.export();
                
                // Reset should also empty (no defaults)
                await form_field.reset();
                const afterReset = await form_field.export();
                
                return {
                    afterImport,
                    afterClear,
                    afterSecondImport,
                    afterReset
                };
            });
            
            expect(results.afterImport).toEqual({field1: "Value1", field2: "Value2"});
            expect(results.afterClear).toEqual({field1: "", field2: ""});
            expect(results.afterSecondImport).toEqual({field1: "NewValue1", field2: "NewValue2"});
            expect(results.afterReset).toEqual({field1: "", field2: ""});
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('Nested form: clear vs reset (with defaults)', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const results = await page.evaluate(async () => {
                const form_field = form.find("/nestedFormWithDefaults");
                
                // Initially should have defaults
                const initial = await form_field.export();
                
                // Change values (setDefault:false to preserve initialization default)
                await form_field.import({name: "Jane Doe", age: "25"}, {setDefault: false});
                const afterImport = await form_field.export();
                
                // Clear should empty all fields (ignore defaults)
                await form_field.clear();
                const afterClear = await form_field.export();
                
                // Set different values (setDefault:false to preserve initialization default)
                await form_field.import({name: "Alice", age: "35"}, {setDefault: false});
                const afterSecondImport = await form_field.export();
                
                // Reset should restore defaults
                await form_field.reset();
                const afterReset = await form_field.export();
                
                return {
                    initial,
                    afterImport,
                    afterClear,
                    afterSecondImport,
                    afterReset
                };
            });
            
            expect(results.initial).toEqual({name: "John Doe", age: "30"});
            expect(results.afterImport).toEqual({name: "Jane Doe", age: "25"});
            expect(results.afterClear).toEqual({name: "", age: ""}); // Clear empties all
            expect(results.afterSecondImport).toEqual({name: "Alice", age: "35"});
            expect(results.afterReset).toEqual({name: "John Doe", age: "30"}); // Reset restores defaults
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('List: clear vs reset (empty default)', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const results = await page.evaluate(async () => {
                const list = form.find("/listNoDefault");
                
                // Add items (setDefault:false to preserve initialization default)
                await list.import([{item: "Item1"}, {item: "Item2"}], {setDefault: false});
                const afterImport = await list.export();
                
                // Clear should empty the list
                await list.clear();
                const afterClear = await list.export();
                const childCountAfterClear = list.children.length;
                
                // Add items again (setDefault:false to preserve initialization default)
                await list.import([{item: "Item3"}], {setDefault: false});
                const afterSecondImport = await list.export();
                
                // Reset should also empty (default is empty array)
                await list.reset();
                const afterReset = await list.export();
                const childCountAfterReset = list.children.length;
                
                return {
                    afterImport,
                    afterClear,
                    childCountAfterClear,
                    afterSecondImport,
                    afterReset,
                    childCountAfterReset
                };
            });
            
            expect(results.afterImport).toEqual([{item: "Item1"}, {item: "Item2"}]);
            expect(results.afterClear).toEqual([]);
            expect(results.childCountAfterClear).toBe(0);
            expect(results.afterSecondImport).toEqual([{item: "Item3"}]);
            expect(results.afterReset).toEqual([]);
            expect(results.childCountAfterReset).toBe(0);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('List: clear vs reset (prepopulated defaults)', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const results = await page.evaluate(async () => {
                const list = form.find("/listWithDefaults");
                
                // Initially should have default items
                const initial = await list.export();
                const initialChildCount = list.children.length;
                
                // Change items (setDefault:false to preserve initialization default)
                await list.import([{item: "UserItem1"}, {item: "UserItem2"}, {item: "UserItem3"}], {setDefault: false});
                const afterImport = await list.export();
                const afterImportChildCount = list.children.length;
                
                // Clear should empty the list (ignore defaults)
                await list.clear();
                const afterClear = await list.export();
                const afterClearChildCount = list.children.length;
                
                // Add items again (setDefault:false to preserve initialization default)
                await list.import([{item: "NewItem"}], {setDefault: false});
                const afterSecondImport = await list.export();
                
                // Reset should restore default items
                await list.reset();
                const afterReset = await list.export();
                const afterResetChildCount = list.children.length;
                
                return {
                    initial,
                    initialChildCount,
                    afterImport,
                    afterImportChildCount,
                    afterClear,
                    afterClearChildCount,
                    afterSecondImport,
                    afterReset,
                    afterResetChildCount
                };
            });
            
            expect(results.initial).toEqual([{item: "Default Item 1"}, {item: "Default Item 2"}]);
            expect(results.initialChildCount).toBe(2);
            expect(results.afterImport).toEqual([{item: "UserItem1"}, {item: "UserItem2"}, {item: "UserItem3"}]);
            expect(results.afterImportChildCount).toBe(3);
            expect(results.afterClear).toEqual([]); // Clear empties list
            expect(results.afterClearChildCount).toBe(0);
            expect(results.afterSecondImport).toEqual([{item: "NewItem"}]);
            expect(results.afterReset).toEqual([{item: "Default Item 1"}, {item: "Default Item 2"}]); // Reset restores defaults
            expect(results.afterResetChildCount).toBe(2);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('Deeply nested: clear vs reset with defaults', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const results = await page.evaluate(async () => {
                const deepForm = form.find("/deeplyNested");
                
                // Initially should have default structure
                const initial = await deepForm.export();
                
                // Modify the nested structure (setDefault:false to preserve initialization default)
                await deepForm.import({
                    users: [
                        {name: "Charlie", age: "40"},
                        {name: "Diana", age: "35"},
                        {name: "Eve", age: "28"}
                    ]
                }, {setDefault: false});
                const afterImport = await deepForm.export();
                
                // Clear should empty everything
                await deepForm.clear();
                const afterClear = await deepForm.export();
                
                // Set different data (setDefault:false to preserve initialization default)
                await deepForm.import({
                    users: [{name: "Frank", age: "50"}]
                }, {setDefault: false});
                const afterSecondImport = await deepForm.export();
                
                // Reset should restore the default nested structure
                await deepForm.reset();
                const afterReset = await deepForm.export();
                
                return {
                    initial,
                    afterImport,
                    afterClear,
                    afterSecondImport,
                    afterReset
                };
            });
            
            expect(results.initial).toEqual({
                users: [
                    {name: "Alice", age: "25"},
                    {name: "Bob", age: "30"}
                ]
            });
            expect(results.afterImport).toEqual({
                users: [
                    {name: "Charlie", age: "40"},
                    {name: "Diana", age: "35"},
                    {name: "Eve", age: "28"}
                ]
            });
            expect(results.afterClear).toEqual({users: []}); // Clear empties nested list
            expect(results.afterSecondImport).toEqual({
                users: [{name: "Frank", age: "50"}]
            });
            expect(results.afterReset).toEqual({
                users: [
                    {name: "Alice", age: "25"},
                    {name: "Bob", age: "30"}
                ]
            }); // Reset restores defaults
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('Clear then Reset sequence', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const results = await page.evaluate(async () => {
                const field = form.find("/inputWithDefault");
                
                // Start with default
                const initial = await field.export();
                
                // User enters value (setDefault:false to preserve initialization default)
                await field.import("UserValue", {setDefault: false});
                const afterUser = await field.export();
                
                // Clear removes everything
                await field.clear();
                const afterClear = await field.export();
                
                // Reset brings back default
                await field.reset();
                const afterReset = await field.export();
                
                return {
                    initial,
                    afterUser,
                    afterClear,
                    afterReset
                };
            });
            
            expect(results.initial).toBe("DefaultValue");
            expect(results.afterUser).toBe("UserValue");
            expect(results.afterClear).toBe("");
            expect(results.afterReset).toBe("DefaultValue");
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('setDefault:true (default) - import updates what reset restores (input)', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const results = await page.evaluate(async () => {
                const field = form.find("/inputWithDefault");

                // Initial default
                const initial = await field.export();

                // Import with default setDefault:true → updates default
                await field.import("NewDefault");
                const afterImport = await field.export();

                // Modify value without changing default
                await field.import("TempValue", {setDefault: false});
                const afterTempImport = await field.export();

                // Reset should restore "NewDefault" (the last setDefault:true import)
                await field.reset();
                const afterReset = await field.export();

                return { initial, afterImport, afterTempImport, afterReset };
            });

            expect(results.initial).toBe("DefaultValue");
            expect(results.afterImport).toBe("NewDefault");
            expect(results.afterTempImport).toBe("TempValue");
            expect(results.afterReset).toBe("NewDefault"); // reset restores what import set
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('setDefault:true (default) - import with undefined does NOT update default', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const results = await page.evaluate(async () => {
                const field = form.find("/inputWithDefault");

                // Set new default via import
                await field.import("NewDefault");
                const afterSetDefault = await field.export();

                // Import undefined (reset to current default) — must NOT change default
                await field.import(undefined);
                const afterUndefinedImport = await field.export();

                // Modify without changing default
                await field.import("TempValue", {setDefault: false});
                const afterTempImport = await field.export();

                // Reset should still give "NewDefault"
                await field.reset();
                const afterReset = await field.export();

                return { afterSetDefault, afterUndefinedImport, afterTempImport, afterReset };
            });

            expect(results.afterSetDefault).toBe("NewDefault");
            expect(results.afterUndefinedImport).toBe("NewDefault"); // undefined → restores current default
            expect(results.afterTempImport).toBe("TempValue");
            expect(results.afterReset).toBe("NewDefault"); // default unchanged by undefined import
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('setDefault:true - form import updates what reset restores', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const results = await page.evaluate(async () => {
                const form_field = form.find("/nestedForm");

                // Import sets new default
                await form_field.import({field1: "Alice", field2: "Bob"});
                const afterImport = await form_field.export();

                // Modify without changing default
                await form_field.import({field1: "X", field2: "Y"}, {setDefault: false});
                const afterTempImport = await form_field.export();

                // Reset restores what import set
                await form_field.reset();
                const afterReset = await form_field.export();

                return { afterImport, afterTempImport, afterReset };
            });

            expect(results.afterImport).toEqual({field1: "Alice", field2: "Bob"});
            expect(results.afterTempImport).toEqual({field1: "X", field2: "Y"});
            expect(results.afterReset).toEqual({field1: "Alice", field2: "Bob"});
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('setDefault:true - list import updates what reset restores', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const results = await page.evaluate(async () => {
                const list = form.find("/listNoDefault");

                // Import sets new default (includes empty items due to exportEmpties:true)
                await list.import([{item: "A"}, {item: "B"}]);
                const afterImport = await list.export();
                const afterImportChildCount = list.children.length;

                // Modify without changing default
                await list.import([{item: "X"}], {setDefault: false});
                const afterTempImport = await list.export();

                // Reset restores what import set
                await list.reset();
                const afterReset = await list.export();
                const afterResetChildCount = list.children.length;

                return { afterImport, afterImportChildCount, afterTempImport, afterReset, afterResetChildCount };
            });

            expect(results.afterImport).toEqual([{item: "A"}, {item: "B"}]);
            expect(results.afterImportChildCount).toBe(2);
            expect(results.afterTempImport).toEqual([{item: "X"}]);
            expect(results.afterReset).toEqual([{item: "A"}, {item: "B"}]);
            expect(results.afterResetChildCount).toBe(2);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('setDefault:true - nested form+list: import updates what reset restores', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const results = await page.evaluate(async () => {
                const deepForm = form.find("/deeplyNested");

                // Import sets new default
                await deepForm.import({
                    users: [{name: "Charlie", age: "40"}, {name: "Diana", age: "35"}]
                });
                const afterImport = await deepForm.export();

                // Temporarily modify without changing default
                await deepForm.import({users: [{name: "Temp", age: "0"}]}, {setDefault: false});
                const afterTempImport = await deepForm.export();

                // Reset restores what import set
                await deepForm.reset();
                const afterReset = await deepForm.export();

                return { afterImport, afterTempImport, afterReset };
            });

            expect(results.afterImport).toEqual({
                users: [{name: "Charlie", age: "40"}, {name: "Diana", age: "35"}]
            });
            expect(results.afterTempImport).toEqual({users: [{name: "Temp", age: "0"}]});
            expect(results.afterReset).toEqual({
                users: [{name: "Charlie", age: "40"}, {name: "Diana", age: "35"}]
            });
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('setDefault:true - exportEmpties:true effect observable in computed default', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const results = await page.evaluate(async () => {
                const list = form.find("/listNoDefault");

                // Import list with empty items — exportEmpties:true should include them in default
                await list.import([{item: ""}, {item: "Filled"}]);
                // Regular export (exportEmpties:false) strips the empty item
                const afterImport = await list.export();

                // Verify empty item is included in default (reset should restore it)
                await list.import([{item: "X"}], {setDefault: false});
                await list.reset();
                // Regular export still strips empty items per list config
                const afterReset = await list.export();
                // But the empty item IS there — check child count
                const childCountAfterReset = list.children.length;
                // And verify with exportEmpties:true
                const afterResetWithEmpties = await list.export(null, {exportEmpties: true});

                return { afterImport, afterReset, childCountAfterReset, afterResetWithEmpties };
            });

            // After import, exportEmpties:false strips the empty item from export
            expect(results.afterImport).toEqual([{item: "Filled"}]);
            // Regular export still strips empties
            expect(results.afterReset).toEqual([{item: "Filled"}]);
            // But the empty item IS there (2 children total)
            expect(results.childCountAfterReset).toBe(2);
            // Confirmed with exportEmpties:true
            expect(results.afterResetWithEmpties).toEqual([{item: ""}, {item: "Filled"}]);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}
});
