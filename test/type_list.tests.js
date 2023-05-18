
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
                span(data-smart={
                    action: "count",
                    for: "employees",
                })
                span )
            button(data-smart = {
                action: "addItem",
                for: "employees",
                autoscroll: "self",
            }) ➕
            button(data-smart = {
                action: "removeItem",
                for: "employees",
                keep_non_empty: true,
            }, title="Remove last non-empty employee") ➖
            button(data-smart = {
                action: "removeItem",
                for: "employees",
                to: "*",
                keep_non_empty: true,
            }, title="Clear all empty employee") 🧹
        div(data-smart = {
            type: "list",
            exportEmpties: true,
            name: "employees",
            min_items: 0,
        })
            fieldset(data-smart={
                exportEmpties: false
            })
                button(data-smart = {
                    action: "removeItem",
                }) ➖
                p
                    label First Name
                    input(
                        data-smart="input"
                        name="name"
                        placeholder="Name"
                    )
                p
                    label Last Name
                    input(
                        data-smart="input"
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
            button(data-smart = {
                action: "addItem",
                for: "employees",
                autoscroll: "elegant",
            }) ➕
            button(data-smart = {
                action: "removeItem",
                for: "employees",
                keep_non_empty: true,
                autoscroll: "elegant",
            }, title="Remove last non-empty employee") ➖
            button(data-smart = {
                action: "removeItem",
                for: "employees",
                to: "*",
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
        ul(data-smart = {
            name: name,
            type: "list",
            of: "singleton",
            min_items,
            max_items,
        })
            li
                button(data-smart = {
                    action: "addItem",
                }) ➕
                input(data-smart)&attributes(atts)
                button(data-smart = {
                    action: "removeItem",
                    failback: removeFailback,
                }) ➖
`);// }}}

describe('List Component Type Test', function() {
    let browser, page, onClosed;

    before(async () => {
        0, {browser, page, onClosed} = await renderPug({
            title: this.title,
            src: pugSrc,
            headless: dev ? false : undefined,
        });
    });

    after(async () => {
        if (! dev) await browser.close();
        if (onClosed) await onClosed();
    });

    it('Lists addItem action works', async () => {
        const listLength = await page.evaluate(async () => {
                const list = form.find("employees");
                await list.addItem();
                await list.addItem();
                await list.addItem();
                return list.count();
        });
        assert.strictEqual(listLength, 3);
    });

    it('Lists removeItem action works', async () => {
        const listLength = await page.evaluate(async () => {
                const list = form.find("employees");
                await list.removeItem();
                return list.count();
        });
        assert.strictEqual(listLength, 2);
    });

});
