import { test, expect } from '@playwright/test';
import {renderPug} from '../src/lib/test/helpers.js';

// All templates extend the test layout (src/lib/test/layout.pug) which loads
// dist/SmarkForm.umd.js and exposes the root instance as window.form over body.

const pugBase = (// {{{
`extends layout.pug
block mainForm
    section.video-tests
        video(
            data-smark={type: "video", name: "clip"}
            width="320" height="180" preload="metadata"
        )
        button(data-smark={action: "pick", context: "clip"}) Choose video

        video(data-smark, name="bare", width="320" height="180")
            // (Bare <video data-smark> must infer the video type.)

        video(
            data-smark={type: "video", name: "noposter", placeholder: false}
            width="320" height="180"
        )
        video(
            data-smark={type: "video", name: "authored"}
            poster="https://example.net/authored.png"
            width="320" height="180"
        )

        video(
            data-smark={type: "video", name: "capped", video_maxSize: 100}
            width="320" height="180"
        )
        video(
            data-smark={type: "video", name: "nocap"}
            width="320" height="180"
        )
        video(
            data-smark={type: "video", name: "unvalidated", smark_video_validate: false}
            width="320" height="180"
        )
        video(
            data-smark={type: "video", name: "playfield", smark_video_click: "play"}
            width="320" height="180"
        )
        video(
            data-smark={type: "video", name: "controlfield", controls: true}
            width="320" height="180"
        )

        figure(data-smark={type: "video", name: "fig"})
            video(data-smark, width="320" height="180" controls="true")
            figcaption(data-smark={action: "rename"})
`);// }}}

const pugErrors = (// {{{
`extends layout.pug
block mainForm
    section.error-tests
        input(type="text", data-smark={type: "video", name: "badInput"})
        div(data-smark={type: "video", name: "missingVideo"})
            input(data-smark, type="text")
`);// }}}

const pugList = (// {{{
`extends layout.pug
block mainForm
    section.gallery-tests
        ul(data-smark={type: "list", name: "gallery", of: "video", min_items: 0, max_items: 5})
            li(data-smark={type: "video"})
                video(data-smark, width="240" height="135")
`);// }}}

const pugAutoPick = (// {{
`extends layout.pug
block mainForm
    video(data-smark={type: "video", name: "clip", smark_video_autoPick: true}, width="320" height="180")
`);// }}}


async function openPage(page, title, src) {//{{{
    const rendered = await renderPug({title, src});
    await page.goto(rendered.url);
    await page.evaluate(() => window.form.rendered);
    return rendered.onClosed;
}//}}}

// Fetch the shared test clip and wrap it in a File (acquisition path).
const makeFileFn = `async (name = "clip.mp4", type = "video/mp4") => {
    const res = await fetch("/assets/video_test.mp4");
    const buf = await res.arrayBuffer();
    return new File([buf], name, {type});
}`;

// Fetch the shared test clip as a normalized file object (import path).
const fetchObjFn = `async (name = "clip.mp4") => {
    const res = await fetch("/assets/video_test.mp4");
    const buf = await res.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return {
        name,
        type: "video/mp4",
        size: buf.byteLength,
        lastModified: 0,
        data: btoa(bin),
    };
}`;

// Non-media bytes claiming to be video (probe must reject them silently).
const garbageFn = `() => new File(
    [new Uint8Array([0x00, 0x01, 0x02, 0x03, 0xff])]
    , "bogus.mp4"
    , {type: "video/mp4"}
)`;


test.describe('Video Component Type Test', () => {
    const title = 'Video Component Type Test';

    test('Renders real-field video with poster defaults, infers bare video, honors playback hints', async ({ page }) => {//{{{
        await openPage(page, title, pugBase);
        const res = await page.evaluate(async () => {
            const clip = window.form.find("/clip");
            const bare = window.form.find("/bare");
            const noposter = window.form.find("/noposter");
            const authored = window.form.find("/authored");
            const playfield = window.form.find("/playfield");
            const controlfield = window.form.find("/controlfield");
            await clip.rendered;
            return {
                nulls: ["clip","bare","noposter","authored","playfield","controlfield"].filter(n => ! window.form.find("/"+n)),
                clipType: clip.options.type,
                clipPoster: clip.targetNode.getAttribute("poster"),
                clipTabindex: clip.targetNode.getAttribute("tabindex"),
                clipDraggable: clip.targetNode.getAttribute("draggable"),
                clipPreload: clip.targetNode.getAttribute("preload"),
                bareType: bare.options.type,
                noposterPoster: noposter.targetNode.hasAttribute("poster"),
                authoredPoster: authored.targetNode.getAttribute("poster"),
                authoredCapture: authored._authoredPoster,
                authoredRawAttr: authored.targetNode.getAttribute("poster"),
                authoredTag: authored.targetNode.tagName,
                authoredIsSingleton: authored.isSingleton,
                playfieldMuted: playfield.targetNode.hasAttribute("muted"),
                playfieldInline: playfield.targetNode.hasAttribute("playsinline"),
                controlfieldMuted: controlfield.targetNode.hasAttribute("muted"),
            };
        });

        expect(res.nulls).toEqual([]);
        expect(res.clipType).toBe("video");
        expect(res.clipPoster.startsWith("data:image/svg+xml;base64,")).toBe(true);
        expect(res.clipTabindex).toBe("0");
        expect(res.clipDraggable).toBe("false");
        expect(res.clipPreload).toBe("metadata");
        expect(res.bareType).toBe("video");
        expect(res.noposterPoster).toBe(false);
        expect(res.authoredPoster).toBe("https://example.net/authored.png");
        expect(res.authoredCapture).toBe("https://example.net/authored.png");
        expect(res.authoredRawAttr).toBe("https://example.net/authored.png");
        expect(res.authoredTag).toBe("VIDEO");
        expect(res.authoredIsSingleton).toBe(false);
        expect(res.playfieldMuted).toBe(true);
        expect(res.playfieldInline).toBe(true);
        expect(res.controlfieldMuted).toBe(false);
    });//}}}

    test('Explicit pick action opens the native file chooser', async ({ page }) => {//{{{
        await openPage(page, title, pugBase);
        const chooser = page.waitForEvent("filechooser");
        await page.locator('button').filter({hasText: "Choose video"}).click();
        await chooser;
    });//}}}

    test('autoPick requests the picker after rendering when enabled', async ({ page }) => {//{{{
        await page.addInitScript(() => {
            window.__smarkAutoPickCount = 0;
            const nativeClick = HTMLInputElement.prototype.click;
            HTMLInputElement.prototype.click = function() {
                if (this.type === "file") window.__smarkAutoPickCount++;
                return nativeClick.call(this);
            };
        });
        await openPage(page, title, pugAutoPick);
        const count = await page.evaluate(() => window.__smarkAutoPickCount);
        expect(count).toBe(1);
    });//}}}

    test('Import displays src, survives export round-trip, clearing restores poster', async ({ page }) => {//{{{
        await openPage(page, title, pugBase);
        const res = await page.evaluate(async ({fetchObjFn}) => {
            const clip = window.form.find("/clip");
            await clip.rendered;
            const fetchObj = eval(fetchObjFn);
            const posterBefore = clip.targetNode.getAttribute("poster");
            const obj = await fetchObj();
            await clip.import(obj);
            const srcRoundTrip = await clip.export();
            const importResult = await clip.import(srcRoundTrip);
            const afterImport = clip.targetNode.getAttribute("src");
            const cleared = await clip.clear();
            const afterClear = clip.targetNode.getAttribute("poster");
            return {posterBefore, srcRoundTrip, importResult, afterImport, cleared, afterClear};
        }, {fetchObjFn});

        expect(res.srcRoundTrip.startsWith("data:video/mp4;name=clip.mp4;")).toBe(true);
        expect(res.importResult.startsWith("data:video/mp4;")).toBe(true);
        expect(res.afterImport).toBeTruthy();
        expect(res.cleared).toBeUndefined();
        expect(res.afterClear).toBe(res.posterBefore);
    });//}}}

    test('Probe rejects garbage video bytes silently; validate:false skip probe', async ({ page }) => {//{{{
        await openPage(page, title, pugBase);
        const res = await page.evaluate(async ({garbageFn, makeFileFn}) => {
            const capped = window.form.find("/capped");
            const unvalidated = window.form.find("/unvalidated");
            const makeGarbage = eval(garbageFn);
            const g = await makeGarbage();
            await capped._acceptFiles([g]);
            const bad = await capped.export();
            await capped._acceptFiles([g]);
            const quiet = await capped.export();
            const g2 = await makeGarbage();
            await unvalidated._acceptFiles([g2]);
            const unvalidatedResult = await unvalidated.export();
            return {bad, quiet, unvalidatedResult, g2name: g2.name};
        }, {garbageFn, makeFileFn});

        expect(res.bad).toBe(null);
        expect(res.quiet).toBe(null);
        expect(res.unvalidatedResult).not.toBe(null);
        expect(res.g2name).toBe("bogus.mp4");
    });//}}}

    test('video_maxSize rejects oversized media before reading bytes; under-cap accepted', async ({ page }) => {//{{{
        await openPage(page, title, pugBase);
        const res = await page.evaluate(async ({makeFileFn}) => {
            const capped = window.form.find("/capped");
            const nocap = window.form.find("/nocap");
            const makeFile = eval(makeFileFn);
            const obj = await makeFile();
            await capped._acceptFiles([obj]);
            const tooBig = await capped.export();
            await nocap._acceptFiles([obj]);
            const under = await nocap.export();
            return {tooBig, under};
        }, {makeFileFn});

        expect(res.tooBig).toBe(null);
        expect(res.under).not.toBe(null);
    });//}}}

    test('Toast via smark:videoNotice is suppressible with preventDefault', async ({ page }) => {//{{{
        await openPage(page, title, pugBase);
        const res = await page.evaluate(async ({makeFileFn}) => {
            const capped = window.form.find("/capped");
            const makeObj = eval(makeFileFn);
            const obj = await makeObj();
            let suppressed = false;
            const onc = (ev) => { ev.preventDefault(); suppressed = true; };
            window.form.targetNode.addEventListener("smark:videoNotice", onc, true);
            await capped._acceptFiles([obj]);
            const quiet = await capped.export();
            window.form.targetNode.removeEventListener("smark:videoNotice", onc, true);
            return {quiet, suppressed};
        }, {makeFileFn});

        expect(res.quiet).toBe(null);
        expect(res.suppressed).toBe(true);
    });//}}}

    test('Renders gallery list of video with picker-style fields', async ({ page }) => {//{{{
        await openPage(page, title, pugList);
        const res = await page.evaluate(async () => {
            const gallery = window.form.find("/gallery");
            await gallery.rendered;
            return {items: gallery.children.length, type: gallery.options.type, of: gallery.options.of};
        });

        expect(res.type).toBe("list");
        expect(res.of).toBe("video");
        expect(res.items).toBe(0);
    });//}}}

    test('Gallery video template renders with an empty initial list', async ({ page }) => {//{{{
        await openPage(page, title, pugList);
        const before = await page.evaluate(() => window.form.find("/gallery").children.length);
        expect(before).toBe(0);
    });//}}}

    test('Singleton caption mirrors and overrides the stored name', async ({ page }) => {//{{{
        await openPage(page, title, pugBase);
        const res = await page.evaluate(async ({fetchObjFn}) => {
            const fig = window.form.find("/fig");
            await fig.import(await (eval(fetchObjFn))("original.mp4"));
            const caption = fig._getCaption();
            const mirrored = caption.textContent;
            caption.textContent = "renamed.mp4";
            caption.dispatchEvent(new Event("input", {bubbles: true}));
            const exported = await fig.export();
            const name = decodeURIComponent(exported.split(";name=")[1].split(";")[0]);
            return {mirrored, name};
        }, {fetchObjFn});
        expect(res.mirrored).toBe("original.mp4");
        expect(res.name).toBe("renamed.mp4");
    });//}}}
});
