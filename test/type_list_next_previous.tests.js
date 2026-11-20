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
          button.too-deep(
            data-smark={action:"next", depth:3}
          ) too deep
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
      button.prev(data-smark={action:"previous"}) previous
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
      button.prev(data-smark={action:"previous"}) previous
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

const capacityPug = (// {{{
`extends layout.pug
block mainForm
  div(data-smark={type:"list", name:"groups", min_items:3, max_items:3})
    fieldset
      input(data-smark, name="groupName")
      ul(data-smark={type:"list", name:"tasks", sortable:true, moving_depth:2, min_items:0, max_items:2})
        li
          input(data-smark, name="v")
          button.next(data-smark={action:"next", depth:2}) next
`);// }}}

const unwillingDestinationPug = (// {{{
`extends layout.pug
block mainForm
  template#column
    ul(data-smark={type:"list", sortable:true, moving_depth:1, min_items:0})
      li
        input(data-smark, name="v")
        button.next(data-smark={action:"next", depth:1}) next
  div(data-smark={type:"#column", name:"source"})
  div(data-smark={type:"#column", name:"target", moving_depth:0})
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

test('depth 0 stays disabled at either end, even with an extra cycle option', async ({ page }) => {
        const rendered = await open(page, cyclePug, 'ListNextPreviousCycle');
        try {
            await page.evaluate(async () => {
                await form.import({ items: [{ v: 'A' }, { v: 'B' }, { v: 'C' }] });
            });
            const list = page.locator('ul[data-smark]');
            await expect(list.locator('li').nth(0).locator('.prev')).toBeDisabled();
            await expect(list.locator('li').nth(2).locator('.next')).toBeDisabled();
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
            await expect(lists.first().locator('li').first().locator('.too-deep')).toBeDisabled();

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

    test('skips full candidate lists and appends to the next available list', async ({ page }) => {
        const rendered = await open(page, capacityPug, 'ListNextPreviousCapacity');
        try {
            await page.evaluate(async () => {
                await form.import({
                    groups: [
                        { groupName: 'A', tasks: [{ v: 'A' }] },
                        { groupName: 'B', tasks: [{ v: 'B' }, { v: 'C' }] },
                        { groupName: 'C', tasks: [{ v: 'D' }] },
                    ],
                });
            });

            const lists = page.locator('ul[data-smark]');
            await expect(lists.nth(0).locator('li').first().locator('.next')).toBeEnabled();
            await lists.nth(0).locator('li').first().locator('.next').click();
            expect(await page.evaluate(() => form.export())).toEqual({
                groups: [
                    { groupName: 'A', tasks: [] },
                    { groupName: 'B', tasks: [{ v: 'B' }, { v: 'C' }] },
                    { groupName: 'C', tasks: [{ v: 'D' }, { v: 'A' }] },
                ],
            });
            await expect(lists.nth(2).locator('li').nth(1).locator('.next')).toBeDisabled();
        } finally {
            await rendered.onClosed();
        }
    });

    test('does not offer a destination whose moving_depth does not allow the move', async ({ page }) => {
        const rendered = await open(page, unwillingDestinationPug, 'ListNextPreviousDestinationDepth');
        try {
            await page.evaluate(async () => {
                await form.import({
                    source: [{ v: 'A' }],
                    target: [],
                });
            });
            await expect(page.locator('button.next').first()).toBeDisabled();
        } finally {
            await rendered.onClosed();
        }
    });
});
