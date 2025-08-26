
const dev = false;
import assert from 'assert';
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
                keep_non_empty: true,
            }, title="Remove last non-empty employee") ➖
            button(data-smark = {
                action: "removeItem",
                context: "employees",
                target: "*",
                keep_non_empty: true,
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
            }) ➕
            button(data-smark = {
                action: "removeItem",
                context: "employees",
                keep_non_empty: true,
                autoscroll: "elegant",
            }, title="Remove last non-empty employee") ➖
            button(data-smark = {
                action: "removeItem",
                context: "employees",
                target: "*",
                autoscroll: "elegant",
                keep_non_empty: true,
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


describe('List Component Type Test', function() {
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

    it('addItem action works', async function() {//{{{
        const listLength = await page.evaluate(async () => {
            const list = form.find("/employees");
            await list.addItem();
            await list.addItem();
            await list.addItem();
            return list.count();
        });
        assert.strictEqual(listLength, 3);
    });//}}}

    it('removeItem action works', async function() {//{{{
        const listLength = await page.evaluate(async () => {
            const list = form.find("/employees");
            await list.removeItem();
            return list.count();
        });
        assert.strictEqual(listLength, 2);
    });//}}}


    it('min_items limit applies', async function() {//{{{
        const lengths = await page.evaluate(async () => {
            let errorCode, bubbledErrorCode;
            form.onAll("error", err=>bubbledErrorCode=err.code);
            const list = form.find("/employees/0/phones");
            list.onAll("error", err=>errorCode=err.code);
            const initial = list.count(); // Items after initial render.
            await list.removeItem();
            const final = list.count(); // Items after removal attempt.
            return {initial, final, errorCode, bubbledErrorCode};
        });
        assert.strictEqual(
            lengths.initial
            , 1
            , "min_items not satisfied after initial rendering"
        );
        assert.strictEqual(
            lengths.final
            , 1
            , "Could remove items below min_items value"
        );
        assert.strictEqual(
            lengths.errorCode
            , "LIST_MIN_ITEMS_REACHED"
            , "LIST_MIN_ITEMS_REACHED error not emmited"
        );
        assert.strictEqual(
            lengths.bubbledErrorCode
            , "LIST_MIN_ITEMS_REACHED"
            , "LIST_MIN_ITEMS_REACHED error didn't bubble"
        );
    });//}}}

    it('max_items limit applies', async function() {//{{{
        const lengths = await page.evaluate(async () => {
            let errorCode, bubbledErrorCode;
            form.onAll("error", err=>bubbledErrorCode=err.code);
            const list = form.find("/employees/0/phones");
            list.onAll("error", err=>errorCode=err.code);
            const initial = list.count(); // Items after initial render.
            await list.addItem();
            await list.addItem();
            await list.addItem();
            await list.addItem();
            await new Promise(resolve=>setTimeout(resolve, 0)); // (bubbling...)
            const final = list.count(); // Items after removal attempt.
            return {initial, final, errorCode, bubbledErrorCode};
            return {initial, final, error, bubbledError};
        });
        assert.strictEqual(
            lengths.initial
            , 1
            , "Not started from one item as expected"
        );
        assert.strictEqual(
            lengths.final
            , 4
            , "Could add items above max_items"
        );
        assert.strictEqual(
            lengths.errorCode
            , "LIST_MAX_ITEMS_REACHED"
            , "LIST_MAX_ITEMS_REACHED error not emmited"
        );
        assert.strictEqual(
            lengths.bubbledErrorCode
            , "LIST_MAX_ITEMS_REACHED"
            , "LIST_MAX_ITEMS_REACHED error didn't bubble"
        );
    });//}}}

    it('Imports correctly', async function() {//{{{
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

            await form.import({data});

            return {
                overallLength: await form.find("/employees").count(),
                housePhone: await form.find("/employees/0/phones/1").export(),
                bartEmailsCount: await form.find("/employees/2/emails").count(),
                lisaImportedPhones: await form.find("/employees/3/phones").count(),
            };

        }, TheSimpsons);

        assert.strictEqual(picks.overallLength, 4, "Employees length does not match");
        assert.strictEqual(picks.housePhone, "555000555", "Hommer's house phone does not match");
        assert.strictEqual(picks.bartEmailsCount, 4, "Bart could import more than 4 emails");
        assert.strictEqual(picks.lisaImportedPhones, 3, "Empty phones in list weren't imported");
    });//}}}

    it('Exports correctly', async function() {//{{{
        const exported = await page.evaluate(async () => {

            // Fix Hommer's email.
            form.find("/employees/0/emails/0")
                .targetNode
                .querySelector("input")
                .value = "homer@simpsons.home"
            ;

            return await form.export();

        }, TheSimpsons);

        assert.strictEqual(
            exported.employees[0].emails[0]
            , "homer@simpsons.home", "Hommer's email did not get corrected"
        );
        assert.deepEqual(
            exported.employees[1]
            , TheSimpsons.employees[1]
            , "Untouched employee did not match"
        );
        assert.deepEqual(
            exported.employees[1]
            , TheSimpsons.employees[1]
            , "Empty list items got exported being exportEmpties = false"
        );
    });//}}}

});
