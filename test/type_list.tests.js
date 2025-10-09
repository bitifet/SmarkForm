import { test, expect } from '@playwright/test';
import {renderPug} from '../src/lib/test/helpers.js';

const pugSrc = (// {{{
`extends layout.pug
block mainForm
    .section
        div
            span
                span Employees (
                span(data-smark={
                    action: "count",
                    context: "employees",
                })
                span )
            button(data-smark = {
                action: "addItem",
                context: "employees",
                autoscroll: "self",
            }) ➕
            button(data-smark = {
                action: "removeItem",
                context: "employees",
                preserve_non_empty: true,
            }, title="Remove last non-empty employee") ➖
            button(data-smark = {
                action: "removeItem",
                context: "employees",
                target: "*",
                preserve_non_empty: true,
            }, title="Clear all empty employee") 🧹
        div(data-smark = {
            type: "list",
            exportEmpties: true,
            name: "employees",
            min_items: 0,
        })
            fieldset(data-smark={
                exportEmpties: false
            })
                button(data-smark = {
                    action: "removeItem",
                    hotkey: "-",
                }) ➖
                p
                    label First Name
                    input(
                        data-smark="input"
                        name="name"
                        placeholder="Name"
                    )
                p
                    label Last Name
                    input(
                        data-smark="input"
                        name="lastName"
                        placeholder="Surnme"
                    )
                +inputlist("Telephones")(
                    name="phones"
                    type="tel",
                    max_items=4,
                    placeholder="Telephone",
                    removeFailback="clear"
                )
                +inputlist("Emails")(
                    type="email",
                    max_items=4,
                    placeholder="Email",
                    removeFailback="clear"
                )
        div
            button(data-smark = {
                action: "addItem",
                context: "employees",
                autoscroll: "elegant",
                hotkey: "+",
            }) ➕
            button(data-smark = {
                action: "removeItem",
                context: "employees",
                preserve_non_empty: true,
                autoscroll: "elegant",
            }, title="Remove last non-empty employee") ➖
            button(data-smark = {
                action: "removeItem",
                context: "employees",
                target: "*",
                autoscroll: "elegant",
                preserve_non_empty: true,
            }, title="Clear all empty employees") 🧹
mixin inputlist(label="Annonymous")
    div
        -
            //- Acccepted attributes:
            const {
                name=label.toLowerCase(),
                min_items,
                max_items,
                removeFailback, // none / clear / throw
                ...atts // Extra attributes for inputs (placeholder, etc...)
            } = attributes;
        label= label
        ul(data-smark = {
            name: name,
            type: "list",
            of: "input",
            min_items,
            max_items,
        })
            li
                button(data-smark = {
                    action: "addItem",
                }) ➕
                input(data-smark)&attributes(atts)
                button(data-smark = {
                    action: "removeItem",
                    failback: removeFailback,
                }) ➖
`);// }}}

const TheSimpsons = {//{{{
    "employees": [
        {
            "name": "Homer",
            "lastName": "Simpson",
            "phones": [
                "555123456",
                "555000555"
            ],
            "emails": [
                "homer@simpsons.homer",
                "TheSimpsons@simpsons.home"
            ]
        },
        {
            "name": "Marge",
            "lastName": "Simpson",
            "phones": [
                "555654321",
                "555000555"
            ],
            "emails": [
                "marge@simpsons.home",
                "TheSimpsons@simpsons.home"
            ]
        },
        {
            "name": "Bart",
            "lastName": "Simpson",
            "phones": [
                "555000555"
            ],
            "emails": [
                "TheSimpsons@simpsons.home",
            ]
        },
        {
            "name": "Lisa",
            "lastName": "Simpson",
            "phones": [
                "555000555"
            ],
            "emails": [
                "TheSimpsons@simpsons.home"
            ]
        }
    ]
};//}}}


test.describe('List Component Type Test', () => {
    const test_title = 'List Component Type Test';

    // Configure tests to run serially to maintain state replay logic
    test.describe.configure({ mode: 'serial' });

    test('addItem action works', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);
            const listLength = await page.evaluate(async () => {
                const list = form.find("/employees");
                await list.addItem();
                await list.addItem();
                await list.addItem();
                return list.count();
            });
            expect(listLength).toBe(3);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('removeItem action works', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const listLength = await page.evaluate(async () => {
                const list = form.find("/employees");
                // Replay ops from previous test
                await list.addItem();
                await list.addItem();
                await list.addItem();
                // Current test operation
                await list.removeItem();
                return list.count();
            });
            expect(listLength).toBe(2);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}


    test('min_items limit applies', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const lengths = await page.evaluate(async () => {
                // Replay ops from previous tests
                const list = form.find("/employees");
                await list.addItem();
                await list.addItem();
                await list.addItem();
                await list.removeItem();
                // Current test operation
                let errorCode, bubbledErrorCode;
                form.onAll("error", err=>bubbledErrorCode=err.code);
                const phonesList = form.find("/employees/0/phones");
                phonesList.onAll("error", err=>errorCode=err.code);
                const initial = phonesList.count(); // Items after initial render.
                await phonesList.removeItem();
                const final = phonesList.count(); // Items after removal attempt.
                return {initial, final, errorCode, bubbledErrorCode};
            });
            expect(lengths.initial).toBe(1);
            expect(lengths.final).toBe(1);
            expect(lengths.errorCode).toBe("LIST_MIN_ITEMS_REACHED");
            expect(lengths.bubbledErrorCode).toBe("LIST_MIN_ITEMS_REACHED");
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('max_items limit applies', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const lengths = await page.evaluate(async () => {
                // Replay ops from previous tests
                const list = form.find("/employees");
                await list.addItem();
                await list.addItem();
                await list.addItem();
                await list.removeItem();
                // Current test operation
                let errorCode, bubbledErrorCode;
                form.onAll("error", err=>bubbledErrorCode=err.code);
                const phonesList = form.find("/employees/0/phones");
                phonesList.onAll("error", err=>errorCode=err.code);
                const initial = phonesList.count(); // Items after initial render.
                await phonesList.addItem();
                await phonesList.addItem();
                await phonesList.addItem();
                await phonesList.addItem();
                await new Promise(resolve=>setTimeout(resolve, 0)); // (bubbling...)
                const final = phonesList.count(); // Items after removal attempt.
                return {initial, final, errorCode, bubbledErrorCode};
            });
            expect(lengths.initial).toBe(1);
            expect(lengths.final).toBe(4);
            expect(lengths.errorCode).toBe("LIST_MAX_ITEMS_REACHED");
            expect(lengths.bubbledErrorCode).toBe("LIST_MAX_ITEMS_REACHED");
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('Imports correctly', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const picks = await page.evaluate(async data => {

                // Let's make some changes...
                data.foo = "Some ignored data";
                data.employees[2].emails.push(
                    "bart@simpsons.home",
                    "barty@simpsons.home",
                    "bartisgreat@simpsons.home",
                    "onlybart@simpsons.home",
                );
                data.employees[3].phones.push("", "");

                await form.import(data);

                return {
                    overallLength: await form.find("/employees").count(),
                    housePhone: await form.find("/employees/0/phones/1").export(),
                    bartEmailsCount: await form.find("/employees/2/emails").count(),
                    lisaImportedPhones: await form.find("/employees/3/phones").count(),
                };

            }, TheSimpsons);

            expect(picks.overallLength).toBe(4);
            expect(picks.housePhone).toBe("555000555");
            expect(picks.bartEmailsCount).toBe(4);
            expect(picks.lisaImportedPhones).toBe(3);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('Exports correctly', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const exported = await page.evaluate(async data => {
                // Replay import from previous test
                data.foo = "Some ignored data";
                data.employees[2].emails.push(
                    "bart@simpsons.home",
                    "barty@simpsons.home",
                    "bartisgreat@simpsons.home",
                    "onlybart@simpsons.home",
                );
                data.employees[3].phones.push("", "");
                await form.import(data);

                // Current test operation: Fix Hommer's email.
                form.find("/employees/0/emails/0")
                    .targetNode
                    .querySelector("input")
                    .value = "homer@simpsons.home"
                ;

                return await form.export();

            }, TheSimpsons);

            expect(exported.employees[0].emails[0]).toBe("homer@simpsons.home");
            expect(exported.employees[1]).toEqual(TheSimpsons.employees[1]);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('list\'s "count" action triggers to be updated', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const countUpdates = await page.evaluate(async () => {
                const list = form.find("/employees");
                const countTrigger = document.querySelector('[data-smark*="count"]');
                
                await list.import([]); // Start from empty list
                const initialCount = countTrigger.textContent;
                
                await list.addItem();
                const afterAddCount = countTrigger.textContent;
                
                await list.addItem();  
                const afterSecondAddCount = countTrigger.textContent;
                
                await list.removeItem();
                const afterRemoveCount = countTrigger.textContent;
                
                return {
                    initial: parseInt(initialCount) || 0,
                    afterAdd: parseInt(afterAddCount) || 0,
                    afterSecondAdd: parseInt(afterSecondAddCount) || 0,
                    afterRemove: parseInt(afterRemoveCount) || 0
                };
            });
            
            // The list starts with min_items: 0, so should start with 0 items
            expect(countUpdates.initial).toBe(0);
            expect(countUpdates.afterAdd).toBe(1);
            expect(countUpdates.afterSecondAdd).toBe(2);
            expect(countUpdates.afterRemove).toBe(1);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    // TODO: Review this test.  (It passes unconditionally...)
    // it('list\'s addItem and removeItem triggers to be non navigable', async function() {//{{{
    //     const navigationResult = await page.evaluate(async () => {
    //         // Check for buttons that have hotkeys and are inside the list context
    //         const buttons = Array.from(document.querySelectorAll('button[data-smark]'));
    //         const results = {};
    //         
    //         buttons.forEach((button, index) => {
    //             try {
    //                 const smData = JSON.parse(button.getAttribute('data-smark'));
    //                 if (smData.action === 'addItem' || smData.action === 'removeItem') {
    //                     results[`button_${index}_action`] = smData.action;
    //                     results[`button_${index}_hasHotkey`] = !!smData.hotkey;
    //                     results[`button_${index}_tabIndex`] = button.tabIndex;
    //                     results[`button_${index}_hasTabIndexAttr`] = button.hasAttribute('tabindex');
    //                 }
    //             } catch (e) {
    //                 // Skip buttons with invalid JSON
    //             }
    //         });
    //         
    //         return results;
    //     });
    //     
    //     // The implementation makes buttons non-navigable only if they have hotkeys AND are inside list context
    //     // For buttons that have hotkeys, they should be non-navigable (tabindex -1)
    //     Object.keys(navigationResult).forEach(key => {
    //         if (key.includes('_hasHotkey') && navigationResult[key]) {
    //             const index = key.split('_')[1];
    //             const tabIndexKey = `button_${index}_hasTabIndexAttr`;
    //             const tabIndexValueKey = `button_${index}_tabIndex`;
    //             if (navigationResult[tabIndexKey]) {
    //                 assert.strictEqual(
    //                     navigationResult[tabIndexValueKey], 
    //                     -1, 
    //                     `Button with hotkey should have tabindex -1 to be non-navigable`
    //                 );
    //             }
    //         }
    //     });
    // });//}}}

});
