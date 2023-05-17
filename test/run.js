
import assert from 'assert';
import {openFile, renderPug} from '../src/lib/test/helpers.js';


const pugSrc = (//{{{
`extends layout.pug
block mainForm
    .section
        p
             .form-group.h1
                 button.foldButton(
                     data-smart={
                         action: "fold",
                         for: "company",
                         foldedClass: "folded",
                     }
                 )
                 span Company
        div(
            data-smart={
                type: "form",
                name: "company",
            }
        )
            p
                label Corporate Name
                input(
                    data-smart
                    name="company"
                    type="text"
                    placeholder="Company Name"
                )
            p
                label Address
                textarea(
                    data-smart
                    name="address"
                    placeholder="Address"
                )
            p
                label City,State,Zip
                input(
                    data-smart
                    name="city"
                    placeholder='City'
                    style='flex: 6'
                )
                input(
                    data-smart
                    name="state"
                    placeholder='State'
                    style='flex:1'
                )
                input(
                    data-smart
                    name="postCode"
                    placeholder='Postal Code'
                    style='flex:2'
                )
    .section
        div
            button.foldButton(
                data-smart={
                    action: "fold",
                    for: "employees",
                    foldedClass: "folded",
                }
            )
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
        div
            .form-group(data-smart = {
                type: "list",
                exportEmpties: true,
                name: "employees",
                min_items: 0,
            })
                .form-group(data-smart={
                    exportEmpties: false
                })
                    fieldset.form-group
                        .form-group.spacer.no-wrap
                            .form-group
                                .form-group
                                    label First Name
                                    input(
                                        data-smart="input"
                                        name="name"
                                        placeholder="Name"
                                    )
                                .form-group
                                    label Last Name
                                    input(
                                        data-smart="input"
                                        name="lastName"
                                        placeholder="Surnme"
                                    )
                            button(data-smart = {
                                action: "removeItem",
                            }) ➖
                        .form-group
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
    .form-group
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
        div(data-smart = {
            name: name,
            type: "list",
            of: "singleton",
            min_items,
            max_items,
        })
            .form-group.no-wrap
                button(data-smart = {
                    action: "addItem",
                }) ➕
                input(data-smart)&attributes(atts)
                button(data-smart = {
                    action: "removeItem",
                    failback: removeFailback,
                }) ➖
`);//}}}


describe('Initial test tinkering (temporary) over playground', function() {
    let browser, page, onClosed;

    before(async () => {
        0, {browser, page, onClosed} = await renderPug({
            title: this.title,
            src: pugSrc,
            ///headless: false,
        });
    });

    after(async () => {
        await browser.close();
        if (onClosed) await onClosed();
    });


    it('Document loaded', async () => {
        const pageTitle = await page.title();
        assert.strictEqual(pageTitle, this.title);
    });

    it('Basic introspection works', async () => {
        const form_obj = await page.evaluate(
                async () =>    form.find("company").getPath()
        );
        assert.strictEqual(form_obj, '/company');
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

