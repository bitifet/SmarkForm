import { test, expect } from '@playwright/test';
import {renderPug} from '../src/lib/test/helpers.js';

async function loadPug(page, pugSrc) {
    const {url, onClosed} = await renderPug({
        title: "prefixed_options",
        src: pugSrc,
    });
    await page.goto(url);
    await page.waitForFunction(() => window.form?.renderedSync === true);
    return onClosed;
}

test('data-smark-type and data-smark-name create a field', async ({ page }) => {
    const cleanup = await loadPug(page, `
extends layout.pug
block mainForm
    input(data-smark-type="input" data-smark-name="firstName" value="Ada")
`);
    const value = await page.evaluate(() => window.form.export());
    expect(value).toEqual({ firstName: "Ada" });
    await cleanup();
});

test('data-smark-min_items and data-smark-max_items are normalized to numbers', async ({ page }) => {
    const cleanup = await loadPug(page, `
extends layout.pug
block mainForm
    ul(data-smark-type="list" data-smark-name="tags" data-smark-min_items="2" data-smark-max_items="4")
        li(data-smark): input(name="tag")
`);
    const list = await page.evaluate(() => window.form.find("tags"));
    expect(list.min_items).toBe(2);
    expect(list.max_items).toBe(4);
    expect(list.children.length).toBe(2);
    await cleanup();
});

test('bare data-smark-sortable is truthy and string "false" disables sorting', async ({ page }) => {
    const cleanup = await loadPug(page, `
extends layout.pug
block mainForm
    ul(data-smark-type="list" data-smark-name="a" data-smark-sortable)
        li(data-smark): input(name="x")
    ul(data-smark-type="list" data-smark-name="b" data-smark-sortable="false")
        li(data-smark): input(name="x")
`);
    const [sortableA, sortableB] = await page.evaluate(() => [
        window.form.find("a").sortable,
        window.form.find("b").sortable,
    ]);
    expect(sortableA).toBe(true);
    expect(sortableB).toBe(false);
    await cleanup();
});

test('data-smark-* attributes override data-smark JSON in document order', async ({ page }) => {
    const cleanup = await loadPug(page, `
extends layout.pug
block mainForm
    input(data-smark='{"type":"input","name":"bar"}' data-smark-name="foo" value="baz")
`);
    const value = await page.evaluate(() => window.form.export());
    expect(value).toEqual({ foo: "baz" });
    await cleanup();
});

test('string "false" disables file open gesture', async ({ page }) => {
    const cleanup = await loadPug(page, `
extends layout.pug
block mainForm
    input(data-smark-type="file" data-smark-name="cv" data-smark-smark_file_open="false")
`);
    const opened = await page.evaluate(async () => {
        const field = window.form.find("cv");
        let hit = false;
        if (field._picker) {
            const original = field._picker.click.bind(field._picker);
            field._picker.click = () => { hit = true; };
            field.targetNode.dispatchEvent(new MouseEvent("click", {bubbles: true}));
            await new Promise(r => setTimeout(r, 50));
            field._picker.click = original;
        }
        return hit;
    });
    expect(opened).toBe(false);
    await cleanup();
});

test('image_resize accepts JSON, bare number, and comma-separated pair strings', async ({ page }) => {
    const cleanup = await loadPug(page, `
extends layout.pug
block mainForm
    img(data-smark-type="image" data-smark-name="avatar" data-smark-image_resize="[64,64]")
    img(data-smark-type="image" data-smark-name="icon" data-smark-image_resize="128")
    img(data-smark-type="image" data-smark-name="thumb" data-smark-image_resize="48,48")
`);
    const boxes = await page.evaluate(() =>
        ["avatar", "icon", "thumb"].map(name => {
            const opt = window.form.find(name).options.image_resize;
            return Array.isArray(opt) ? opt : opt;
        })
    );
    expect(boxes[0]).toEqual([64, 64]);
    expect(boxes[1]).toBe(128);
    expect(boxes[2]).toEqual([48, 48]);
    await cleanup();
});

test('placeholder="false" leaves the media element empty', async ({ page }) => {
    const cleanup = await loadPug(page, `
extends layout.pug
block mainForm
    img(data-smark-type="image" data-smark-name="photo" data-smark-placeholder="false")
`);
    const src = await page.evaluate(() => {
        const img = window.form.find("photo").targetNode;
        return img.getAttribute("src");
    });
    expect(src).toBeFalsy();
    await cleanup();
});

test('list template role can be set with data-smark-role', async ({ page }) => {
    const cleanup = await loadPug(page, `
extends layout.pug
block mainForm
    ul(data-smark-type="list" data-smark-name="items" data-smark-min_items="0")
        li(data-smark data-smark-role="empty_list") No items yet.
        li(data-smark): input(name="x")
`);
    const emptyText = await page.evaluate(() =>
        document.querySelector('[data-role="empty_list"]')?.textContent?.trim()
    );
    expect(emptyText).toBe("No items yet.");
    await cleanup();
});

test('prefixed options on a mixin placeholder are merged into the clone', async ({ page }) => {
    const cleanup = await loadPug(page, `
extends layout.pug
block mainForm
    template#contactTpl
        div(data-smark)
            input(data-smark name="email" type="email")
            input(data-smark name="phone" type="tel")
    div(data-smark-type="#contactTpl" data-smark-name="primary" data-smark-exportEmpties="true")
`);
    const value = await page.evaluate(() => window.form.export());
    expect(value).toEqual({ primary: { email: "", phone: "" } });
    await cleanup();
});
