import { test, expect } from '@playwright/test';
import {renderPug} from '../src/lib/test/helpers.js';

// All templates extend the test layout (src/lib/test/layout.pug) which loads
// dist/SmarkForm.umd.js and exposes the root instance as window.form over body.

const pugBase = (// {{{
`extends layout.pug
block mainForm
    section.audio-tests
        audio(
            data-smark={type: "audio", name: "clip"}
            width="320" preload="metadata"
        )
        button(data-smark={action: "pick", context: "clip"}) Choose audio

        audio(data-smark, name="bare", width="320")
            // (Bare <audio data-smark> must infer the audio type.)

        audio(
            data-smark={type: "audio", name: "controlfield", controls: true}
            width="320"
        )
        audio(
            data-smark={type: "audio", name: "playfield", smark_audio_click: "play"}
            width="320"
        )

        audio(
            data-smark={type: "audio", name: "capped", audio_maxSize: 100}
            width="320"
        )
        audio(
            data-smark={type: "audio", name: "nocap"}
            width="320"
        )
        audio(
            data-smark={type: "audio", name: "unvalidated", smark_audio_validate: false}
            width="320"
        )

        figure(data-smark={type: "audio", name: "fig"})
            audio(data-smark, width="320" controls="true")
            figcaption(data-smark={action: "rename"})
`);// }}}

const pugList = (// {{{
`extends layout.pug
block mainForm
    section.gallery-tests
        ul(data-smark={type: "list", name: "gallery", of: "audio", min_items: 0, max_items: 5})
            li(data-smark={type: "audio"})
                audio(data-smark, width="320")
`);// }}}

const pugAutoPick = (// {{{
`extends layout.pug
block mainForm
    audio(data-smark={type: "audio", name: "clip", smark_audio_autoPick: true}, width="320")
`);// }}}


async function openPage(page, title, src) {//{{{
    const rendered = await renderPug({title, src});
    await page.goto(rendered.url);
    await page.evaluate(() => window.form.rendered);
    return rendered.onClosed;
}//}}}

// Fetch the shared test clip and wrap it in a File (acquisition path).
const makeFileFn = `async (name = "clip.mp3", type = "audio/mpeg") => {
    const res = await fetch("/assets/audio_test.mp3");
    const buf = await res.arrayBuffer();
    return new File([buf], name, {type});
}`;

// Fetch the shared test clip as a normalized file object (import path).
const fetchObjFn = `async (name = "clip.mp3") => {
    const res = await fetch("/assets/audio_test.mp3");
    const buf = await res.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return {
        name,
        type: "audio/mpeg",
        size: buf.byteLength,
        lastModified: 0,
        data: btoa(bin),
    };
}`;

// Non-media bytes claiming to be audio (probe must reject them silently).
const garbageFn = `() => new File(
    [new Uint8Array([0x00, 0x01, 0x02, 0x03, 0xff])]
    , "bogus.mp3"
    , {type: "audio/mpeg"}
)`;


test.describe('Audio Component Type Test', () => {
    const title = 'Audio Component Type Test';

    test('Renders real-field audio with defaults, infers bare audio, honors controls/preload/tabindex/draggable', async ({ page }) => {//{{{
        await openPage(page, title, pugBase);
        const res = await page.evaluate(async () => {
            const clip = window.form.find("/clip");
            const bare = window.form.find("/bare");
            const controlfield = window.form.find("/controlfield");
            const playfield = window.form.find("/playfield");
            await clip.rendered;
            return {
                nulls: ["clip","bare","controlfield","playfield"].filter(n => ! window.form.find("/"+n)),
                clipType: clip.options.type,
                clipSrc: clip.targetNode.getAttribute("src"),
                clipTabindex: clip.targetNode.getAttribute("tabindex"),
                clipDraggable: clip.targetNode.getAttribute("draggable"),
                clipPreload: clip.targetNode.getAttribute("preload"),
                bareType: bare.options.type,
                controlfieldMuted: controlfield.targetNode.hasAttribute("muted"),
                playfieldMuted: playfield.targetNode.hasAttribute("muted"),
                playfieldTag: playfield.targetNode.tagName,
            };
        });

        expect(res.nulls).toEqual([]);
        expect(res.clipType).toBe("audio");
        expect(res.clipSrc).toBe(null);
        expect(res.clipTabindex).toBe("0");
        expect(res.clipDraggable).toBe("false");
        expect(res.clipPreload).toBe("metadata");
        expect(res.bareType).toBe("audio");
        expect(res.controlfieldMuted).toBe(false);
        expect(res.playfieldMuted).toBe(true);
        expect(res.playfieldTag).toBe("AUDIO");
    });//}}}

    test('Explicit pick action opens the native file chooser', async ({ page }) => {//{{{
        await openPage(page, title, pugBase);
        const chooser = page.waitForEvent("filechooser");
        await page.locator('button').filter({hasText: "Choose audio"}).click();
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

    test('Import displays src, survives export round-trip, clearing removes src', async ({ page }) => {//{{{
        await openPage(page, title, pugBase);
        const res = await page.evaluate(async ({fetchObjFn}) => {
            const clip = window.form.find("/clip");
            await clip.rendered;
            const fetchObj = eval(fetchObjFn);
            const obj = await fetchObj();
            const before = clip.targetNode.getAttribute("src");
            await clip.import(obj);
            const afterImport = clip.targetNode.getAttribute("src");
            const srcRoundTrip = await clip.export();
            const importResult = await clip.import(srcRoundTrip);
            const cleared = await clip.clear();
            const afterClear = clip.targetNode.getAttribute("src");
            return {before, afterImport, srcRoundTrip, importResult, cleared, afterClear};
        }, {fetchObjFn});

        expect(res.before).toBe(null);
        expect(res.srcRoundTrip.startsWith("data:audio/mpeg;name=clip.mp3;")).toBe(true);
        expect(res.importResult.startsWith("data:audio/mpeg;")).toBe(true);
        expect(res.afterImport).toBeTruthy();
        expect(res.cleared).toBeUndefined();
        expect(res.afterClear).toBe(null);
    });//}}}

    test('Probe rejects garbage audio bytes silently; validate:false accepts them', async ({ page }) => {//{{{
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
        expect(res.g2name).toBe("bogus.mp3");
    });//}}}

    test('audio_maxSize rejects oversized media before reading bytes; under-cap accepted', async ({ page }) => {//{{{
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

    test('smark:audioNotice is suppressible with preventDefault', async ({ page }) => {//{{{
        await openPage(page, title, pugBase);
        const res = await page.evaluate(async ({makeFileFn}) => {
            const capped = window.form.find("/capped");
            const makeObj = eval(makeFileFn);
            const obj = await makeObj();
            let suppressed = false;
            const onc = (ev) => { ev.preventDefault(); suppressed = true; };
            window.form.targetNode.addEventListener("smark:audioNotice", onc, true);
            await capped._acceptFiles([obj]);
            const quiet = await capped.export();
            window.form.targetNode.removeEventListener("smark:audioNotice", onc, true);
            return {quiet, suppressed};
        }, {makeFileFn});

        expect(res.quiet).toBe(null);
        expect(res.suppressed).toBe(true);
    });//}}}

    test('Gallery list of audio renders with empty initial list', async ({ page }) => {//{{{
        await openPage(page, title, pugList);
        const res = await page.evaluate(async () => {
            const gallery = window.form.find("/gallery");
            await gallery.rendered;
            return {items: gallery.children.length, type: gallery.options.type, of: gallery.options.of};
        });

        expect(res.type).toBe("list");
        expect(res.of).toBe("audio");
        expect(res.items).toBe(0);
    });//}}}

    test('Singleton caption mirrors and overrides the stored name', async ({ page }) => {//{{{
        await openPage(page, title, pugBase);
        const res = await page.evaluate(async ({fetchObjFn}) => {
            const fig = window.form.find("/fig");
            await fig.import(await (eval(fetchObjFn))("original.mp3"));
            const caption = fig._getCaption();
            const mirrored = caption.textContent;
            caption.textContent = "renamed.mp3";
            caption.dispatchEvent(new Event("input", {bubbles: true}));
            const exported = await fig.export();
            const name = decodeURIComponent(exported.split(";name=")[1].split(";")[0]);
            return {mirrored, name};
        }, {fetchObjFn});
        expect(res.mirrored).toBe("original.mp3");
        expect(res.name).toBe("renamed.mp3");
    });//}}}
});
