import { test, expect } from '@playwright/test';
import {renderPug} from '../src/lib/test/helpers.js';

// Pug: flat fields directly on the body root (simplest case).//{{{
const pugSrcFlat = (
`extends layout.pug
block mainForm
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
            type="number"
        )
    p
        button(
            data-smark={action:"submit"}
        ) Submit
`);
//}}}

// Pug: nested subform to verify delegation.//{{{
const pugSrcNested = (
`extends layout.pug
block mainForm
    div(
        data-smark={type:"form",name:"personal"}
    )
        p
            label Name
            input(
                data-smark
                name="name"
                type="text"
            )
    div(
        data-smark={type:"form",name:"work"}
    )
        p
            label Company
            input(
                data-smark
                name="company"
                type="text"
            )
    p
        button(
            data-smark={action:"submit",context:"personal"}
        ) Submit from subform
`);
//}}}

const test_title = 'Submit Action Tests';

test.describe(test_title, () => {

    test('submit action is registered on form component', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrcFlat,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);
            await page.waitForFunction(() => typeof window.form !== 'undefined');

            const hasSubmitAction = await page.evaluate(async () => {
                await form.rendered;
                return typeof form.actions.submit === 'function';
            });
            expect(hasSubmitAction).toBe(true);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('submit action delegates to root from nested subform', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrcNested,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);
            await page.waitForFunction(() => typeof window.form !== 'undefined');

            const result = await page.evaluate(async () => {
                await form.rendered;
                let rootSubmitCalled = false;
                const originalRootSubmit = form.actions.submit;

                // Replace root submit with a spy that does not actually submit
                form.actions.submit = async function() {
                    rootSubmitCalled = true;
                    return {stubbed: true};
                };

                // Call submit on a nested subform - must delegate to root
                const subform = form.find('/personal');
                await subform.actions.submit(null, {silent: true});

                form.actions.submit = originalRootSubmit;
                return rootSubmitCalled;
            });
            expect(result).toBe(true);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('BeforeAction_submit event fires when submit is called', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrcFlat,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);
            await page.waitForFunction(() => typeof window.form !== 'undefined');

            const result = await page.evaluate(async () => {
                await form.rendered;

                let beforeFired = false;
                let afterFired = false;

                form.on('BeforeAction_submit', () => { beforeFired = true; });
                form.on('AfterAction_submit', () => { afterFired = true; });

                // Stub out the actual submission transport to avoid navigation
                const origCreate = document.createElement.bind(document);
                document.createElement = function(tag) {
                    const el = origCreate(tag);
                    if (tag === 'form') el.submit = () => {};
                    return el;
                };

                await form.actions.submit(null, {silent: false});
                document.createElement = origCreate;

                return {beforeFired, afterFired};
            });

            expect(result.beforeFired).toBe(true);
            expect(result.afterFired).toBe(true);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('submit exports form data and sends flat entries (bracket+repeat defaults)', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrcFlat,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);
            await page.waitForFunction(() => typeof window.form !== 'undefined');

            const intercepted = await page.evaluate(async () => {
                await form.rendered;

                // Import test data
                await form.import({name: 'Alice', age: '30'}, {silent: true, setDefault: false});

                // Intercept the hidden form fields
                const entries = [];
                const origCreate = document.createElement.bind(document);
                document.createElement = function(tag) {
                    const el = origCreate(tag);
                    if (tag === 'form') {
                        const origAppendChild = el.appendChild.bind(el);
                        el.appendChild = function(child) {
                            if (child.type === 'hidden') {
                                entries.push({name: child.name, value: child.value});
                            }
                            return origAppendChild(child);
                        };
                        el.submit = () => {}; // prevent actual navigation
                    }
                    return el;
                };

                await form.actions.submit(null, {silent: true});
                document.createElement = origCreate;
                return entries;
            });

            // Flat root-level keys (bracket+repeat defaults)
            expect(intercepted).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({name: 'name', value: 'Alice'}),
                    expect.objectContaining({name: 'age', value: '30'}),
                ])
            );
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('submit reads method and action from targetNode attributes', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrcFlat,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);
            await page.waitForFunction(() => typeof window.form !== 'undefined');

            const result = await page.evaluate(async () => {
                await form.rendered;

                // Temporarily inject method/action on the root's targetNode (body)
                form.targetNode.setAttribute('method', 'post');
                form.targetNode.setAttribute('action', '/test-endpoint');

                const observed = {};
                const origCreate = document.createElement.bind(document);
                document.createElement = function(tag) {
                    const el = origCreate(tag);
                    if (tag === 'form') {
                        el.submit = function() {
                            observed.method = el.method;
                            observed.action = el.action;
                        };
                    }
                    return el;
                };

                await form.actions.submit(null, {silent: true});
                document.createElement = origCreate;

                // Cleanup
                form.targetNode.removeAttribute('method');
                form.targetNode.removeAttribute('action');

                return observed;
            });

            expect(result.method).toBe('post');
            expect(result.action).toContain('/test-endpoint');
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('submit resolves submitter formaction/formmethod overrides', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrcFlat,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);
            await page.waitForFunction(() => typeof window.form !== 'undefined');

            const result = await page.evaluate(async () => {
                await form.rendered;

                const observed = {};
                const origCreate = document.createElement.bind(document);
                document.createElement = function(tag) {
                    const el = origCreate(tag);
                    if (tag === 'form') {
                        el.submit = function() {
                            observed.method = el.method;
                            observed.action = el.action;
                            observed.names = Array.from(
                                el.querySelectorAll('input[type=hidden]')
                            ).map(i => i.name);
                        };
                    }
                    return el;
                };

                // Fake submitter with formaction/formmethod overrides and a name
                const fakeBtn = document.createElement('button');
                fakeBtn.setAttribute('formaction', '/alt-endpoint');
                fakeBtn.setAttribute('formmethod', 'get');
                fakeBtn.name = 'submitterBtn';
                fakeBtn.value = 'clicked';

                await form.actions.submit(null, {silent: true, submitter: fakeBtn});
                document.createElement = origCreate;
                return observed;
            });

            expect(result.method).toBe('get');
            expect(result.action).toContain('/alt-endpoint');
            expect(result.names).toContain('submitterBtn');
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('submit with keyStyle:dot and arrayStyle:index produces dotted names', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrcNested,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);
            await page.waitForFunction(() => typeof window.form !== 'undefined');

            const intercepted = await page.evaluate(async () => {
                await form.rendered;

                // Set keyStyle/arrayStyle options on root form
                form.options.keyStyle = 'dot';
                form.options.arrayStyle = 'index';

                await form.import(
                    {personal: {name: 'Bob'}, work: {company: 'Acme'}},
                    {silent: true, setDefault: false}
                );

                const entries = [];
                const origCreate = document.createElement.bind(document);
                document.createElement = function(tag) {
                    const el = origCreate(tag);
                    if (tag === 'form') {
                        const origAppend = el.appendChild.bind(el);
                        el.appendChild = function(child) {
                            if (child.type === 'hidden') {
                                entries.push({name: child.name, value: child.value});
                            }
                            return origAppend(child);
                        };
                        el.submit = () => {};
                    }
                    return el;
                };

                await form.actions.submit(null, {silent: true});
                document.createElement = origCreate;

                // Cleanup
                delete form.options.keyStyle;
                delete form.options.arrayStyle;

                return entries;
            });

            // Dot-style keys: personal.name, work.company
            expect(intercepted).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({name: 'personal.name', value: 'Bob'}),
                    expect.objectContaining({name: 'work.company', value: 'Acme'}),
                ])
            );
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

});

// Pug: self-contained page with native <form> as SmarkForm root.//{{{
// (Does not extend layout.pug because layout hardcodes SmarkForm on <body>.)
const pugSrcNativeRoot = (
`doctype html
html
    head
        title= self.title
    body
        form#sfroot(method="post", action="/submit-target")
            p
                label Name
                input(data-smark name="name" type="text")
            p
                button(type="submit" data-smark={action:"submit"}) Trigger Submit
            p
                button(type="submit" id="plain-btn") Plain Submit
        script(src="../../dist/SmarkForm.umd.js")
        script.
            window.form = new SmarkForm(document.querySelector("form#sfroot"));
`);
//}}}

test.describe('Submit — native <form> root', () => {

    test('Enter key (no prior button click) does NOT trigger submit action', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrcNativeRoot,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);
            await page.waitForFunction(() => typeof window.form !== 'undefined');

            const submitCalled = await page.evaluate(async () => {
                await form.rendered;

                let called = false;
                const orig = form.actions.submit;
                form.actions.submit = async () => { called = true; return {}; };

                // Dispatch a submit event without any preceding button click.
                // This simulates Enter key pressed in a text input.
                form.targetNode.dispatchEvent(
                    new Event('submit', {bubbles: false, cancelable: true})
                );

                // Wait a tick for any async handler
                await new Promise(r => setTimeout(r, 50));

                form.actions.submit = orig;
                return called;
            });

            expect(submitCalled).toBe(false);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('clicking a plain (non-SmarkForm) submit button DOES trigger submit action', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrcNativeRoot,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);
            await page.waitForFunction(() => typeof window.form !== 'undefined');

            const submitCalled = await page.evaluate(async () => {
                await form.rendered;

                let called = false;
                const orig = form.actions.submit;
                form.actions.submit = async () => { called = true; return {}; };

                // Click the plain submit button (no data-smark).
                document.querySelector('#plain-btn').click();

                await new Promise(r => setTimeout(r, 50));

                form.actions.submit = orig;
                return called;
            });

            expect(submitCalled).toBe(true);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('clicking a SmarkForm trigger submit button does NOT double-invoke submit action', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrcNativeRoot,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);
            await page.waitForFunction(() => typeof window.form !== 'undefined');

            const callCount = await page.evaluate(async () => {
                await form.rendered;

                let count = 0;
                const orig = form.actions.submit;
                form.actions.submit = async () => { count++; return {}; };

                // Click the SmarkForm trigger button.
                // onTriggerClick handles it; the native submit listener must skip it.
                const triggerBtn = document.querySelector(
                    'button[data-smark]'
                );
                triggerBtn.click();

                await new Promise(r => setTimeout(r, 100));

                form.actions.submit = orig;
                return count;
            });

            // Should be called exactly once (by onTriggerClick), not twice
            expect(callCount).toBe(1);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

});

test.describe('Submit — JSON encoding', () => {

    test('JSON encoding is blocked by default (enableJsonEncoding defaults to false)', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrcFlat,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);
            await page.waitForFunction(() => typeof window.form !== 'undefined');

            const errorMessage = await page.evaluate(async () => {
                await form.rendered;
                form.targetNode.setAttribute('enctype', 'application/json');
                form.targetNode.setAttribute('method', 'post');
                try {
                    await form.actions.submit(null, {silent: true});
                    return null;
                } catch (err) {
                    return err.message;
                } finally {
                    form.targetNode.removeAttribute('enctype');
                    form.targetNode.removeAttribute('method');
                }
            });

            expect(errorMessage).toMatch(/JSON encoding.*disabled by default/);
            expect(errorMessage).toMatch(/enableJsonEncoding/);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('JSON encoding does NOT include submitter name/value in request body', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrcFlat,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);
            await page.waitForFunction(() => typeof window.form !== 'undefined');

            const result = await page.evaluate(async () => {
                await form.rendered;

                // Opt in to JSON encoding.
                form.options.enableJsonEncoding = true;

                let capturedBody = null;
                const origFetch = window.fetch;
                window.fetch = async function(_url, init) {
                    capturedBody = init.body;
                    return {
                        redirected: false,
                        url: _url,
                        headers: {get: () => 'text/plain'},
                    };
                };

                await form.import({name: 'Alice', age: '25'}, {silent: true, setDefault: false});

                // Temporarily set JSON enctype on targetNode
                form.targetNode.setAttribute('enctype', 'application/json');
                form.targetNode.setAttribute('method', 'post');

                const fakeSubmitter = document.createElement('button');
                fakeSubmitter.name = 'intent';
                fakeSubmitter.value = 'save';

                await form.actions.submit(null, {silent: true, submitter: fakeSubmitter});

                window.fetch = origFetch;
                form.targetNode.removeAttribute('enctype');
                form.targetNode.removeAttribute('method');

                return JSON.parse(capturedBody);
            });

            // SmarkForm data should be present
            expect(result.name).toBe('Alice');
            expect(result.age).toBeDefined();
            // Submitter name/value must NOT be in the JSON body
            expect(result).not.toHaveProperty('intent');
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

});

// Pug: native <form> root with an inner-span button and a plain text input.//{{{
const pugSrcInnerSpan = (
`doctype html
html
    head
        title= self.title
    body
        form#sfroot2(method="post", action="/submit-target")
            p
                input#txt(type="text" name="x")
            p
                button(type="submit" id="icon-btn")
                    span.icon ✓
                    |  Submit
        script(src="../../dist/SmarkForm.umd.js")
        script.
            window.form2 = new SmarkForm(document.querySelector("form#sfroot2"));
`);
//}}}

test.describe('Submit — keyboard and inner-element edge cases', () => {

    test('Tab → Enter on a focused submit button DOES trigger submit action', async ({ page }) => {//{{{
        // When the browser activates a focused button via the Enter key it fires
        // a 'click' event before 'submit'.  Our click-tracking must pick it up.
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrcNativeRoot,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);
            await page.waitForFunction(() => typeof window.form !== 'undefined');

            await page.evaluate(async () => {
                await form.rendered;
                window._submitCount = 0;
                const orig = form.actions.submit;
                form.actions.submit = async (...a) => { window._submitCount++; return {}; };
                window._origSubmit = orig;
            });

            // Focus the plain submit button and press Enter.
            await page.focus('#plain-btn');
            await page.keyboard.press('Enter');

            const count = await page.evaluate(async () => {
                await new Promise(r => setTimeout(r, 100));
                form.actions.submit = window._origSubmit;
                return window._submitCount;
            });

            expect(count).toBe(1);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('clicking on inner element of submit button DOES trigger submit action', async ({ page }) => {//{{{
        // Clicking an icon or span inside a <button type="submit"> should still
        // be recorded as a submit-button click (ev.target would be the span without
        // the closest() fix).
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrcInnerSpan,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);
            await page.waitForFunction(() => typeof window.form2 !== 'undefined');

            const submitCalled = await page.evaluate(async () => {
                await form2.rendered;
                let called = false;
                const orig = form2.actions.submit;
                form2.actions.submit = async () => { called = true; return {}; };

                // Click on the <span class="icon"> inside the submit button.
                document.querySelector('#icon-btn .icon').click();
                await new Promise(r => setTimeout(r, 100));

                form2.actions.submit = orig;
                return called;
            });

            expect(submitCalled).toBe(true);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('Enter in a plain (non-SmarkForm) text input does NOT trigger submit action', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrcInnerSpan,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);
            await page.waitForFunction(() => typeof window.form2 !== 'undefined');

            const submitCalled = await page.evaluate(async () => {
                await form2.rendered;
                let called = false;
                const orig = form2.actions.submit;
                form2.actions.submit = async () => { called = true; return {}; };

                // Dispatch submit directly (simulates Enter from text input —
                // no click event precedes it).
                form2.targetNode.dispatchEvent(
                    new Event('submit', {bubbles: false, cancelable: true})
                );
                await new Promise(r => setTimeout(r, 50));

                form2.actions.submit = orig;
                return called;
            });

            expect(submitCalled).toBe(false);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

});

test.describe('Submit — JSON encoding with non-HTTP action', () => {

    test('JSON encoding with mailto: action throws a clear error', async ({ page }) => {//{{{
        let onClosed;
        try {
            const rendered = await renderPug({
                title: test_title,
                src: pugSrcFlat,
            });
            onClosed = rendered.onClosed;
            await page.goto(rendered.url);
            await page.waitForFunction(() => typeof window.form !== 'undefined');

            const errorMessage = await page.evaluate(async () => {
                await form.rendered;
                // Opt in to JSON encoding so the test reaches the HTTP-protocol check.
                form.options.enableJsonEncoding = true;
                form.targetNode.setAttribute('enctype', 'application/json');
                form.targetNode.setAttribute('action', 'mailto:test@example.com');
                form.targetNode.setAttribute('method', 'post');
                try {
                    await form.actions.submit(null, {silent: true});
                    return null;
                } catch (err) {
                    return err.message;
                } finally {
                    form.targetNode.removeAttribute('enctype');
                    form.targetNode.removeAttribute('method');
                    form.targetNode.removeAttribute('action');
                }
            });

            expect(errorMessage).toMatch(/JSON encoding is not supported for non-HTTP/);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

});
