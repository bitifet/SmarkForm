import { test, expect } from '@playwright/test';
import {renderPug} from '../src/lib/test/helpers.js';

const nestedPug = (// {{{
`extends layout.pug
block mainForm
  div(data-smark={type:"list", name:"groups", min_items:2, max_items:2})
    fieldset
      ul(data-smark={type:"list", name:"tasks", sortable:true, moving_depth:2, min_items:0})
        li
          input(data-smark, name="v")
          button.next(
            data-smark={action:"next", depth:2, hotkey:"]"}
          ) next
          button.prev(
            data-smark={action:"previous", depth:2, hotkey:"["}
          ) previous
`);// }}}

const flatPug = (// {{{
`extends layout.pug
block mainForm
  ul(data-smark={
    type:"list",
    name:"items",
    sortable:false,
    min_items:0,
  })
    li
      input(data-smark, name="v")
      button.next(data-smark={action:"next", depth:0}) next
      button.prev(data-smark={action:"previous", depth:0}) previous
`);// }}}

const depthZeroPug = (// {{{
`extends layout.pug
block mainForm
  ul(data-smark={
    type:"list",
    name:"items",
    sortable:true,
    min_items:0,
  })
    li
      input(data-smark, name="v")
      button.next(data-smark={action:"next", depth:0}) next
      button.prev(data-smark={action:"previous", depth:0}) previous
`);// }}}

const cyclePug = (// {{{
`extends layout.pug
block mainForm
  ul(data-smark={
    type:"list",
    name:"items",
    sortable:true,
    min_items:0,
  })
    li
      input(data-smark, name="v")
      button.next(data-smark={action:"next", depth:0, cycle:true}) next
      button.prev(data-smark={action:"previous", depth:0, cycle:true}) previous
`);// }}}

async function open(page, src, title) {
    const rendered = await renderPug({ title, src });
    await page.goto(rendered.url);
    return rendered;
};

test.describe('List next/previous actions', () => {
    test('depth 0 reorders within a sortable list and disables at the ends', async ({ page }) => {
        const rendered = await open(page, depthZeroPug, 'ListNextPreviousDepthZero');
        try {
            await page.evaluate(async () => {
                await form.import({ items: [{ v: 'A' }, { v: 'B' }, { v: 'C' }] });
            });
            const list = page.locator('ul[data-smark]');
            await expect(list.locator('li').nth(0).locator('.prev')).toBeDisabled();
            await expect(list.locator('li').nth(2).locator('.next')).toBeDisabled();

            await list.locator('li').nth(0).locator('.next').click();
            expect(await page.evaluate(() => form.export())).toEqual({
                items: [{ v: 'B' }, { v: 'A' }, { v: 'C' }],
            });

            await list.locator('li').nth(2).locator('.prev').click();
            expect(await page.evaluate(() => form.export())).toEqual({
                items: [{ v: 'B' }, { v: 'C' }, { v: 'A' }],
            });
            await expect(list.locator('li').nth(2).locator('.next')).toBeDisabled();
        } finally {
            await rendered.onClosed();
        }
    });

    test('cycle wraps depth 0 moves', async ({ page }) => {
        const rendered = await open(page, cyclePug, 'ListNextPreviousCycle');
        try {
            await page.evaluate(async () => {
                await form.import({ items: [{ v: 'A' }, { v: 'B' }, { v: 'C' }] });
            });
            const list = page.locator('ul[data-smark]');
            await expect(list.locator('li').nth(0).locator('.prev')).toBeEnabled();
            await list.locator('li').nth(2).locator('.next').click();
            expect(await page.evaluate(() => form.export())).toEqual({
                items: [{ v: 'C' }, { v: 'A' }, { v: 'B' }],
            });
            await list.locator('li').nth(0).locator('.prev').click();
            expect(await page.evaluate(() => form.export())).toEqual({
                items: [{ v: 'A' }, { v: 'B' }, { v: 'C' }],
            });
        } finally {
            await rendered.onClosed();
        }
    });

    test('depth 0 is disabled when sortable is false', async ({ page }) => {
        const rendered = await open(page, flatPug, 'ListNextPreviousSortableFalse');
        try {
            await page.evaluate(async () => {
                await form.import({ items: [{ v: 'A' }, { v: 'B' }] });
            });
            const list = page.locator('ul[data-smark]');
            await expect(list.locator('li').nth(0).locator('.next')).toBeDisabled();
            await expect(list.locator('li').nth(1).locator('.prev')).toBeDisabled();
        } finally {
            await rendered.onClosed();
        }
    });

    test('depth 2 moves one candidate list at a time', async ({ page }) => {
        const rendered = await open(page, nestedPug, 'ListNextPreviousCrossList');
        try {
            await page.evaluate(async () => {
                await form.import({
                    groups: [
                        { tasks: [{ v: 'A' }, { v: 'B' }] },
                        { tasks: [{ v: 'C' }] },
                    ],
                });
            });

            const lists = page.locator('ul[data-smark]');
            await expect(lists.first().locator('li').first().locator('.prev')).toBeDisabled();

            // First move reaches the next reachable list; a second move from
            // the same item would be needed to go any further.
            await lists.first().locator('li').first().locator('.next').click();
            expect(await page.evaluate(() => form.export())).toEqual({
                groups: [
                    { tasks: [{ v: 'B' }] },
                    { tasks: [{ v: 'C' }, { v: 'A' }] },
                ],
            });

            // The moved item can step back to the first list.
            await lists.nth(1).locator('li').nth(1).locator('.prev').click();
            expect(await page.evaluate(() => form.export())).toEqual({
                groups: [
                    { tasks: [{ v: 'B' }, { v: 'A' }] },
                    { tasks: [{ v: 'C' }] },
                ],
            });
        } finally {
            await rendered.onClosed();
        }
    });
});
