import { test, expect } from '@playwright/test';
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
                preserve_non_empty: true,
            }, title="Remove last non-empty employee") ➖
            button(data-smark = {
                action: "removeItem",
                context: "employees",
                target: "*",
                preserve_non_empty: true,
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

test.describe('General Functionality Tests', () => {
    const test_title = 'General Functionality Tests';

    test('Document loaded', async ({ page }) => {
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const pageTitle = await page.title();
            expect(pageTitle).toBe(test_title);
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('Form does not get unexpectedly focused', async ({ page }) => {
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const bodyFocused = await page.evaluate(
                    async () => document.activeElement === document.body
            );
            expect(bodyFocused).toBe(true);

        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('Form with default values does not cause focus on initialization', async ({ page }) => {//{{{
        // Regression test: ensure that forms/lists with default values do not
        // steal focus during initialization (async reset must be awaited).
        let onClosed;
        const defaultValuePugSrc = (
`extends layout.pug
block mainForm
    .section
        div(data-smark={
            type: "form",
            name: "profileForm",
            value: {
                name: "Alice",
                tags: [
                    {tag: "admin"},
                    {tag: "user"}
                ]
            }
        })
            p
                label Name
                input(data-smark name="name" type="text")
            div(data-smark={
                type: "list",
                name: "tags",
                min_items: 0
            })
                div(data-smark)
                    p
                        label Tag
                        input(data-smark name="tag" type="text")
`);
        try {
            const rendered = await renderPug({
                title: test_title,
                src: defaultValuePugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const result = await page.evaluate(async () => {
                await form.rendered;
                return {
                    bodyFocused: document.activeElement === document.body,
                    profileValue: await form.find("/profileForm").export(),
                };
            });

            // No field should be focused after initialization
            expect(result.bodyFocused).toBe(true);
            // Default values should be fully imported (render is atomic)
            expect(result.profileValue).toEqual({
                name: "Alice",
                tags: [{tag: "admin"}, {tag: "user"}],
            });
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('Basic introspection works', async ({ page }) => {
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrc,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);

            const form_obj = await page.evaluate(
                    async () => form.find("company").getPath()
            );
            expect(form_obj).toBe('/company');
        } finally {
            if (onClosed) await onClosed();
        }
    });

});

