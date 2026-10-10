// test/trigger_multicontext.tests.js
// ==================================
// Multi-context (wildcard) triggers.
//
// A trigger whose `context` is a wildcard path (e.g. "*") may resolve to
// several components.  In that case the action is dispatched, in sequence, to
// every matched component that implements it — each with its own resolved
// target.  Components that don't implement the action are skipped silently.
//
// Regression guard: before the fix, `find("*")` returned an array and
// `context.actions[action]` blew up (no UNKNOWN_ACTION handling for arrays).

import { test, expect } from '@playwright/test';
import {renderPug} from '../src/lib/test/helpers.js';

const pugSrc = (// {{{
`doctype html
html
    head
        title= self.title
    body
        div#sfroot
            div(data-smark={type:"list", name:"rooms", of:"input"})
                input(data-smark type="text")
            div(data-smark={type:"list", name:"cars", of:"input"})
                input(data-smark type="text")
            input(data-smark name="notes" type="text")
            button#addAll(data-smark={action:"addItem", context:"*"}) Add all
            button#addGhost(data-smark={action:"addItem", context:"ghost*"}) Add ghost
        script(src="../../dist/SmarkForm.umd.js")
        script.
            window.pageErrors = [];
            window.addEventListener("error", ev => window.pageErrors.push(String(ev.message || ev.error)));
            window.addEventListener("unhandledrejection", ev => window.pageErrors.push(String(ev.reason)));
            window.form = new SmarkForm(document.querySelector("#sfroot"));
`);//}}}

const listSizes = `(() => ({
    rooms: form.find("rooms").children.length,
    cars: form.find("cars").children.length,
}))()`;

test.describe('Multi-context (wildcard) triggers', () => {
    const title = 'Multi-context (wildcard) triggers';

    async function setup(page) {
        const rendered = await renderPug({ title, src: pugSrc });
        await page.goto(rendered.url);
        await page.waitForFunction(() => typeof window.form !== 'undefined');
        await page.evaluate(() => form.rendered);
        return rendered.onClosed;
    }

    test('wildcard context dispatches the action to every matching list', async ({ page }) => {
        const onClosed = await setup(page);
        try {
            // Each list starts with min_items (1) item.
            expect(await page.evaluate(listSizes)).toEqual({rooms: 1, cars: 1});

            await page.locator('#addAll').click();
            await page.waitForTimeout(150);

            // Both lists — and only those implementing addItem — grew by one.
            expect(await page.evaluate(listSizes)).toEqual({rooms: 2, cars: 2});

            // The sibling input does not implement addItem and must be skipped
            // silently (no UNKNOWN_ACTION, no page error).
            expect(await page.evaluate(() => window.pageErrors)).toEqual([]);
        } finally {
            if (onClosed) await onClosed();
        }
    });

    test('wildcard matching no component is a silent no-op', async ({ page }) => {
        const onClosed = await setup(page);
        try {
            await page.locator('#addGhost').click();
            await page.waitForTimeout(150);

            // Nothing changed and no error was raised.
            expect(await page.evaluate(listSizes)).toEqual({rooms: 1, cars: 1});
            expect(await page.evaluate(() => window.pageErrors)).toEqual([]);
        } finally {
            if (onClosed) await onClosed();
        }
    });
});
