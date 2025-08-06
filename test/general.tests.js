
const dev = false;
import assert from 'assert';
import {renderPug} from '../src/lib/test/helpers.js';

const pugSrc = (//{{{
`extends layout.pug
block mainForm
    .section
        p
             .form-group.h1
                 button.foldButton(
                     data-smark={
                         action: "fold",
                         context: "company",
                         foldedClass: "folded",
                     }
                 )
                 span Company
        div(
            data-smark={
                type: "form",
                name: "company",
            }
        )
            p
                label Corporate Name
                input(
                    data-smark
                    name="company"
                    type="text"
                    placeholder="Company Name"
                )
            p
                label Address
                textarea(
                    data-smark
                    name="address"
                    placeholder="Address"
                )
            p
                label City,State,Zip
                input(
                    data-smark
                    name="city"
                    placeholder='City'
                    style='flex: 6'
                )
                input(
                    data-smark
                    name="state"
                    placeholder='State'
                    style='flex:1'
                )
                input(
                    data-smark
                    name="postCode"
                    placeholder='Postal Code'
                    style='flex:2'
                )
    .section
        div
            button.foldButton(
                data-smark={
                    action: "fold",
                    context: "employees",
                    foldedClass: "folded",
                }
            )
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
        div
            .form-group(data-smark = {
                type: "list",
                exportEmpties: true,
                name: "employees",
                min_items: 0,
            })
                .form-group(data-smark={
                    exportEmpties: false
                })
                    fieldset.form-group
                        .form-group.spacer.no-wrap
                            .form-group
                                .form-group
                                    label First Name
                                    input(
                                        data-smark="input"
                                        name="name"
                                        placeholder="Name"
                                    )
                                .form-group
                                    label Last Name
                                    input(
                                        data-smark="input"
                                        name="lastName"
                                        placeholder="Surnme"
                                    )
                            button(data-smark = {
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
        div(data-smark = {
            name: name,
            type: "list",
            of: "input",
            min_items,
            max_items,
        })
            .form-group.no-wrap
                button(data-smark = {
                    action: "addItem",
                }) ➕
                input(data-smark)&attributes(atts)
                button(data-smark = {
                    action: "removeItem",
                    failback: removeFailback,
                }) ➖
`);//}}}

describe('General Functionality Tests', function() {
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
        this.timeout(8000);
        if (! dev) await browser.close();
        if (onClosed) await onClosed();
    });

    it('Document loaded', async function() {
        const pageTitle = await page.title();
        assert.strictEqual(pageTitle, test_title);
    });

    it('Basic introspection works', async function () {
        const form_obj = await page.evaluate(
                async () => form.find("company").getPath()
        );
        assert.strictEqual(form_obj, '/company');
    });

});

