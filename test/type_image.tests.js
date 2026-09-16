import { test, expect } from '@playwright/test';
import {renderPug} from '../src/lib/test/helpers.js';

// All templates extend the test layout (src/lib/test/layout.pug) which loads
// dist/SmarkForm.umd.js and exposes the root instance as window.form over body.

const pugBase = (// {{{
`extends layout.pug
block mainForm
    section.image-tests
        img(
            data-smark={type: "image", name: "photo"}
            alt="Photo"
            width="200" height="100"
        )

        img(data-smark, alt="Bare", name="bare")

        img(
            data-smark={type: "image", name: "raw", smark_image_validate: false}
            alt="Raw"
        )

        figure(data-smark={type: "image", name: "fig"})
            img(data-smark, alt="Caption image")
            figcaption(contenteditable="true")

        img(
            data-smark={type: "image", name: "sized", image_resize: [50, 50]}
            alt="Sized"
        )
        img(
            data-smark={type: "image", name: "downscaled", image_maxSize: [50, 50]}
            alt="Downscaled"
        )
        img(
            data-smark={type: "image", name: "uncapped", image_maxSize: [300, 300]}
            alt="Uncapped"
        )
        img(
            data-smark={type: "image", name: "jpegged", image_format: "jpeg"}
            alt="Jpegged"
        )
        img(
            data-smark={type: "image", name: "unknownfmt", image_format: "tiff"}
            alt="Unknown format"
        )

        // image_enforce matrix (outcome B triggered via a PNG→JPEG conversion
        // that the test makes unavailable; outcome C via skipped decode).
        img(
            data-smark={type: "image", name: "ef_warn", image_enforce: "warn", image_format: "jpeg"}
            alt="Enforce warn"
        )
        img(
            data-smark={type: "image", name: "ef_warn2", image_enforce: "warn", image_format: "jpeg"}
            alt="Enforce warn 2"
        )
        img(
            data-smark={type: "image", name: "ef_ignore", image_enforce: "ignore", image_format: "jpeg"}
            alt="Enforce ignore"
        )
        img(
            data-smark={type: "image", name: "ef_strict", image_enforce: "strict", image_format: "jpeg"}
            alt="Enforce strict"
        )
        img(
            data-smark={type: "image", name: "ef_hard", image_enforce: "hard", image_format: "jpeg"}
            alt="Enforce hard"
        )
        img(
            data-smark={type: "image", name: "ef_strictC", image_enforce: "strict", smark_image_validate: false, image_resize: [40, 40]}
            alt="Enforce strict, unverifiable"
        )
        img(
            data-smark={type: "image", name: "ef_warnC", image_enforce: "warn", smark_image_validate: false, image_resize: [40, 40]}
            alt="Enforce warn, unverifiable"
        )
`);// }}}

const pugErrors = (// {{{
`extends layout.pug
block mainForm
    section.error-tests
        input(type="image", data-smark={type: "image", name: "badInput"}, alt="bad")
        div(data-smark={type: "image", name: "missingImg"})
            input(data-smark, type="text")
`);// }}}

const pugList = (// {{{
`extends layout.pug
block mainForm
    section.gallery-tests
        ul(data-smark={type: "list", name: "gallery", of: "image", min_items: 0, max_items: 5})
            li(data-smark={type: "image"})
                img(data-smark, alt="Gallery item")
`);// }}}


async function openPage(page, title, src) {//{{{
    const rendered = await renderPug({title, src});
    await page.goto(rendered.url);
    await page.evaluate(() => window.form.rendered);
    return rendered.onClosed;
}//}}}

// In-browser canvas PNG generator returning a File.  Used by the capture
// pipeline (decode gate, resize, format, enforce) tests.
const makeFileFn = `async ({width = 200, height = 100, type = "image/png", name = "photo.png"} = {}) => {
    const c = document.createElement("canvas");
    c.width = width;
    c.height = height;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#0af";
    ctx.fillRect(0, 0, width, height);
    const dataUrl = c.toDataURL(type);
    const bin = atob(dataUrl.split(",")[1]);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new File([arr], name, {type});
}`;

// Probe an exported data-URL string back into its decoded dimensions + type.
const probeFn = `(dataUrl) => new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve({
        w: img.naturalWidth,
        h: img.naturalHeight,
        type: dataUrl.split(";")[0].split(":")[1],
    });
    img.onerror = () => resolve(null);
    img.src = dataUrl;
})`;


test.describe('Image Component Type Test', () => {
    const title = 'Image Component Type Test';

    test('Renders real-field img with placeholder defaults and infers bare img', async ({ page }) => {//{{{
        let onClosed;
        try {
            onClosed = await openPage(page, title, pugBase);

            const res = await page.evaluate(async () => {
                const photo = window.form.find("/photo");
                const photoNode = photo.targetNode;
                const bare = window.form.find("/bare");
                // Placeholder is set once rendered (before any value):
                await photo.rendered;
                return {
                    photoType: photo.options.type,
                    photoSrc: photoNode.getAttribute("src"),
                    photoDraggable: photoNode.getAttribute("draggable"),
                    photoTabindex: photoNode.getAttribute("tabindex"),
                    bareType: bare.options.type,
                };
            });

            expect(res.photoType).toBe("image");
            expect(res.photoSrc.startsWith("data:image/svg+xml;base64,")).toBe(true);
            expect(res.photoDraggable).toBe("false");
            expect(res.photoTabindex).toBe("0");
            expect(res.bareType).toBe("image");
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('Import displays the image, survives export round-trip, clearing restores placeholder', async ({ page }) => {//{{{
        let onClosed;
        try {
            onClosed = await openPage(page, title, pugBase);

            const res = await page.evaluate(async (probe) => {
                const photo = window.form.find("/photo");
                const node = photo.targetNode;
                const c = document.createElement("canvas");
                c.width = 90; c.height = 60;
                const ctx = c.getContext("2d");
                ctx.fillStyle = "#f60";
                ctx.fillRect(0, 0, 90, 60);
                const dataUrl = c.toDataURL("image/png");

                await photo.import(dataUrl);
                const shown = node.getAttribute("src");
                const exported = await photo.export();

                await photo.import(null);
                const afterClear = node.getAttribute("src");
                const cleared = await photo.export();

                return {
                    shown, exported, afterClear, cleared,
                    probe: await eval(probe)(exported),
                };
            }, probeFn);

            expect(res.shown).toBe(`data:image/png;base64,${res.exported.split(";base64,")[1]}`);
            expect(res.exported.startsWith("data:image/png;")).toBe(true);
            expect(res.probe.w).toBe(90);
            expect(res.probe.h).toBe(60);
            expect(res.afterClear.startsWith("data:image/svg+xml;base64,")).toBe(true);
            expect(res.cleared).toBe(null);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('Capture pipeline rejects non-image bytes; validate:false skips the decode gate', async ({ page }) => {//{{{
        let onClosed;
        try {
            onClosed = await openPage(page, title, pugBase);

            const res = await page.evaluate(async (makeFile) => {
                const photo = window.form.find("/photo");
                const raw = window.form.find("/raw");
                const garbage = new File(
                    [new Uint8Array([0x00, 0x01, 0x02, 0x03, 0xff])]
                    , "bogus.png"
                    , {type: "image/png"}
                );
                await photo._acceptFiles([garbage]);
                const gatedOut = await photo.export();

                await raw._acceptFiles([garbage]);
                const rawAccepted = await raw.export();
                return {gatedOut, rawAccepted};
            }, makeFileFn);

            expect(res.gatedOut).toBe(null);
            expect(res.rawAccepted).not.toBe(null);
            expect(String(res.rawAccepted).startsWith("data:image/png;")).toBe(true);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('image_resize forces the exact box; image_maxSize downscales only, preserving aspect', async ({ page }) => {//{{{
        let onClosed;
        try {
            onClosed = await openPage(page, title, pugBase);

            const res = await page.evaluate(async ({makeFile, probe}) => {
                const sized = window.form.find("/sized");
                const downscaled = window.form.find("/downscaled");
                const uncapped = window.form.find("/uncapped");

                await sized._acceptFiles([await eval(makeFile)({width: 200, height: 100})]);
                const sizedOut = await sized.export();

                await downscaled._acceptFiles([await eval(makeFile)({width: 200, height: 100})]);
                const downOut = await downscaled.export();

                await uncapped._acceptFiles([await eval(makeFile)({width: 40, height: 30})]);
                const uncapOut = await uncapped.export();

                return {
                    sized: await eval(probe)(sizedOut),
                    downscaled: await eval(probe)(downOut),
                    uncapped: await eval(probe)(uncapOut),
                };
            }, {makeFile: makeFileFn, probe: probeFn});

            expect(res.sized.w).toBe(50);
            expect(res.sized.h).toBe(50);
            expect(res.downscaled.w).toBe(50);
            expect(res.downscaled.h).toBe(25);
            expect(res.uncapped.w).toBe(40);
            expect(res.uncapped.h).toBe(30);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('image_format converts and renames; unknown formats are silently ignored', async ({ page }) => {//{{{
        let onClosed;
        try {
            onClosed = await openPage(page, title, pugBase);

            const res = await page.evaluate(async ({makeFile, probe}) => {
                // Runtime encode support detection (Safari/WebKit varies):
                const c = document.createElement("canvas");
                c.width = 2; c.height = 2;
                const jpegOk = c.toDataURL("image/jpeg").startsWith("data:image/jpeg");

                const jpegged = window.form.find("/jpegged");
                const unknownfmt = window.form.find("/unknownfmt");

                if (jpegOk) {
                    await jpegged._acceptFiles([await eval(makeFile)({name: "photo.png"})]);
                };
                await unknownfmt._acceptFiles([await eval(makeFile)({name: "photo.png"})]);

                const jpegOut = jpegOk ? await jpegged.export() : null;
                const unknownOut = await unknownfmt.export();
                return {
                    jpegOk,
                    jpegType: jpegOut ? jpegOut.split(";")[0] : null,
                    jpegName: jpegOut ? decodeURIComponent(jpegOut.split("name=")[1].split(";")[0]) : null,
                    jpegExt: jpegOut ? (await eval(probe)(jpegOut) || {}).type : null,
                    unknownType: unknownOut.split(";")[0],
                };
            }, {makeFile: makeFileFn, probe: probeFn});

            expect(res.unknownType).toBe("data:image/png"); // No conversion.
            if (res.jpegOk) {
                expect(res.jpegType).toBe("data:image/jpeg");
                expect(res.jpegName).toBe("photo.jpg");
                expect(res.jpegExt).toBe("image/jpeg");
            }
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('image_enforce: strict/hard reject known-failing conversions, warn notifies and accepts, ignore is silent', async ({ page }) => {//{{{
        let onClosed;
        try {
            onClosed = await openPage(page, title, pugBase);

            // Make PNG→JPEG encoding unavailable so outcome-B notices are
            // deterministic on every browser.
            await page.evaluate(() => {
                const orig = HTMLCanvasElement.prototype.toBlob;
                HTMLCanvasElement.prototype.toBlob = function (cb, type) {
                    if (String(type).indexOf("image/jpeg") !== -1) { cb(null); return; }
                    return orig.call(this, cb, type);
                };
            });

            const res = await page.evaluate(async (makeFile) => {
                const notices = [];
                window.addEventListener("smark:imageNotice", ev => {
                    notices.push({...ev.detail});
                });

                const efWarn = window.form.find("/ef_warn");
                const efIgnore = window.form.find("/ef_ignore");
                const efStrict = window.form.find("/ef_strict");
                const efHard = window.form.find("/ef_hard");

                const file = await eval(makeFile)();
                await efWarn._acceptFiles([file]);
                const warnOut = await efWarn.export();
                await efIgnore._acceptFiles([await eval(makeFile)()]);
                const ignoreOut = await efIgnore.export();
                await efStrict._acceptFiles([await eval(makeFile)()]);
                const strictOut = await efStrict.export();
                await efHard._acceptFiles([await eval(makeFile)()]);
                const hardOut = await efHard.export();

                const toastVisible = !! document.querySelector('[role="status"]');
                const tooltip = document.querySelector('[role="status"]')?.textContent || "";

                return {notices, warnOut, ignoreOut, strictOut, hardOut, toastVisible, tooltip};
            }, makeFileFn);

            // Strict: rejected + rejection notice.
            expect(res.strictOut).toBe(null);
            const strictNotice = res.notices.find(n => n.mode === "strict");
            expect(strictNotice.kind).toBe("rejection");
            expect(strictNotice.code).toBe("IMAGE_FORMAT_UNSUPPORTED");

            // Hard: rejected (known failure) too.
            expect(res.hardOut).toBe(null);

            // Warn: accepted, warning emitted, toast shown.
            expect(res.warnOut).not.toBe(null);
            const warnNotice = res.notices.find(n => n.mode === "warn");
            expect(warnNotice.kind).toBe("warning");
            expect(warnNotice.code).toBe("IMAGE_FORMAT_UNSUPPORTED");
            expect(warnNotice.requirement).toBe("image_format");
            expect(res.toastVisible).toBe(true);
            expect(res.tooltip).toContain("jpeg");

            // Ignore: accepted, no notice for it.
            expect(res.ignoreOut).not.toBe(null);
            expect(res.notices.find(n => n.mode === "ignore")).toBeUndefined();
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('image_enforce: preventDefault() suppresses the toast but keeps the notice', async ({ page }) => {//{{{
        let onClosed;
        try {
            onClosed = await openPage(page, title, pugBase);

            await page.evaluate(() => {
                const orig = HTMLCanvasElement.prototype.toBlob;
                HTMLCanvasElement.prototype.toBlob = function (cb, type) {
                    if (String(type).indexOf("image/jpeg") !== -1) { cb(null); return; }
                    return orig.call(this, cb, type);
                };
                window.addEventListener("smark:imageNotice", ev => ev.preventDefault());
            });

            const res = await page.evaluate(async (makeFile) => {
                const efWarn2 = window.form.find("/ef_warn2");
                await efWarn2._acceptFiles([await eval(makeFile)()]);
                const out = await efWarn2.export();
                return {out, toast: !! document.querySelector('[role="status"]')};
            }, makeFileFn);

            expect(res.out).not.toBe(null);
            expect(res.toast).toBe(false);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('image_enforce: unverifiable requirements are rejected under strict, accepted silently otherwise', async ({ page }) => {//{{{
        let onClosed;
        try {
            onClosed = await openPage(page, title, pugBase);

            const res = await page.evaluate(async (makeFile) => {
                const notices = [];
                window.addEventListener("smark:imageNotice", ev => {
                    notices.push({...ev.detail});
                });
                const strict = window.form.find("/ef_strictC");
                const warn = window.form.find("/ef_warnC");

                await strict._acceptFiles([await eval(makeFile)({name: "photo.png"})]);
                const strictOut = await strict.export();

                const before = notices.length;
                await warn._acceptFiles([await eval(makeFile)({name: "photo.png"})]);
                const warnOut = await warn.export();

                return {notices, strictOut, warnOut, before};
            }, makeFileFn);

            expect(res.strictOut).toBe(null);
            const strictNotice = res.notices.find(n => n.code === "IMAGE_DIMENSIONS_UNKNOWN");
            expect(strictNotice.kind).toBe("rejection");
            expect(strictNotice.requirement).toBe("image_resize");

            // Outcome C under "warn" is accepted silently (no notice):
            expect(res.warnOut).not.toBe(null);
            expect(res.notices.length).toBe(res.before);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('Space opens the picker; Delete clears the value', async ({ page }) => {//{{{
        let onClosed;
        try {
            onClosed = await openPage(page, title, pugBase);

            await page.evaluate(async () => {
                const photo = window.form.find("/photo");
                const c = document.createElement("canvas");
                c.width = 8; c.height = 8;
                c.getContext("2d").fillRect(0, 0, 8, 8);
                await photo.import(c.toDataURL("image/png"));
            });
            await page.locator('img[alt="Photo"]').focus();

            const [chooser] = await Promise.all([
                page.waitForEvent("filechooser", {timeout: 3000}),
                page.keyboard.press(" "),
            ]);
            expect(chooser).toBeTruthy();

            // Refocus the img (the picker interaction stole focus) and Delete:
            await page.locator('img[alt="Photo"]').focus();
            await page.keyboard.press("Delete");
            const afterDelete = await page.evaluate(() => window.form.find("/photo").export());
            expect(afterDelete).toBe(null);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('Singleton: caption mirrors the stored name, overrides exports, and Delete clears both', async ({ page }) => {//{{{
        let onClosed;
        try {
            onClosed = await openPage(page, title, pugBase);

            const res = await page.evaluate(async () => {
                const fig = window.form.find("/fig");
                const cap = fig._getCaption();
                const c = document.createElement("canvas");
                c.width = 16; c.height = 16;
                c.getContext("2d").fillRect(0, 0, 16, 16);
                const b64 = c.toDataURL("image/png").split(",")[1];

                await fig.import({
                    name: "photo.png",
                    type: "image/png",
                    size: c.toDataURL("image/png").length,
                    lastModified: 0,
                    data: b64,
                });
                const captionAfterImport = cap.textContent;

                cap.textContent = "renamed.jpg";
                cap.dispatchEvent(new Event("input", {bubbles: true}));
                const exported = await fig.export();
                const exportedName = decodeURIComponent(
                    exported.split("name=")[1].split(";")[0]
                );

                return {captionAfterImport, exportedName};
            });

            expect(res.captionAfterImport).toBe("photo.png");
            expect(res.exportedName).toBe("renamed.jpg");

            // Delete on the inner img clears image AND caption:
            await page.locator('figure img').focus();
            await page.keyboard.press("Delete");
            const cleared = await page.evaluate(async () => {
                const fig = window.form.find("/fig");
                return {
                    value: await fig.export(),
                    caption: fig._getCaption().textContent,
                    src: fig.children[""].targetNode.getAttribute("src"),
                };
            });
            // value and caption must both be empty; inner img back to placeholder.
            expect(cleared.value).toBe(null);
            expect(cleared.caption).toBe("");
            expect(cleared.src.startsWith("data:image/svg+xml;base64,")).toBe(true);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('Singleton: clicking the caption keeps editable focus (focus-on-click must not steal it)', async ({ page }) => {//{{{
        let onClosed;
        try {
            onClosed = await openPage(page, title, pugBase);

            await page.evaluate(async () => {
                const fig = window.form.find("/fig");
                const cap = fig._getCaption();
                const c = document.createElement("canvas");
                c.width = 8; c.height = 8;
                c.getContext("2d").fillRect(0, 0, 8, 8);
                await fig.import(c.toDataURL("image/png"));
                cap.textContent = "";
            });

            const cap = page.locator('figure figcaption');
            await cap.click();

            // The caption — not the inner img — must be the active element:
            const active = await page.evaluate(() => ({
                tag: document.activeElement.tagName,
                editable: !! document.activeElement.isContentEditable,
            }));
            expect(active.tag).toBe("FIGCAPTION");
            expect(active.editable).toBe(true);

            // And typing must land in the caption (drives the stored name):
            await page.keyboard.type("renamed.png");
            const res = await page.evaluate(async () => {
                const fig = window.form.find("/fig");
                const out = await fig.export();
                return {
                    caption: fig._getCaption().textContent,
                    name: out ? decodeURIComponent(out.split("name=")[1].split(";")[0]) : null,
                };
            });
            expect(res.caption).toBe("renamed.png");
            expect(res.name).toBe("renamed.png");
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('URL value: import() fetches a same-origin URL and embeds the bytes', async ({ page }) => {//{{{
        let onClosed;
        try {
            onClosed = await openPage(page, title, pugBase);

            const out = await page.evaluate(async () => {
                return await window.form.find("/photo").import("/assets/avatar_alex.jpg");
            });
            expect(out.startsWith("data:image/jpeg;name=avatar_alex.jpg;")).toBe(true);

            // Imported bytes are displayed immediately, like any other value:
            const src = await page.evaluate(
                () => window.form.find("/photo").targetFieldNode.getAttribute("src")
            );
            expect(src.startsWith("data:image/jpeg;base64,")).toBe(true);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('URL value: a failed fetch warns, returns null and keeps the placeholder', async ({ page }) => {//{{{
        const warns = [];
        page.on('console', msg => { if (msg.type() === 'warning') warns.push(msg.text()); });
        let onClosed;
        try {
            onClosed = await openPage(page, title, pugBase);

            const res = await page.evaluate(async () => {
                return await window.form.find("/photo").import("/assets/definitely-not-here.jpg");
            });
            expect(res).toBe(null);

            const src = await page.evaluate(
                () => window.form.find("/photo").targetFieldNode.getAttribute("src")
            );
            // Back to the empty-state placeholder:
            expect(src.startsWith("data:image/svg+xml;base64,")).toBe(true);
            expect(warns.some(w => w.includes("could not import URL value"))).toBe(true);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('URL value: singleton caption mirrors the URL-derived name', async ({ page }) => {//{{{
        let onClosed;
        try {
            onClosed = await openPage(page, title, pugBase);

            const res = await page.evaluate(async () => {
                const fig = window.form.find("/fig");
                const out = await fig.import("/assets/avatar_alex.jpg");
                return {
                    out,
                    caption: fig._getCaption().textContent,
                };
            });

            expect(res.out.startsWith("data:image/jpeg;name=avatar_alex.jpg;")).toBe(true);
            expect(res.caption).toBe("avatar_alex.jpg");
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('render errors: IMAGE_TYPE_ON_INPUT and IMAGE_MISSING_IMG replace the node and log', async ({ page }) => {//{{{
        let onClosed;
        const consoleErrors = [];
        page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
        try {
            onClosed = await openPage(page, title, pugErrors);

            const texts = await page.evaluate(() => {
                const all = [...document.body.querySelectorAll("div")].map(n => n.textContent);
                return all;
            });

            expect(texts.some(t => t.startsWith("IMAGE_TYPE_ON_INPUT"))).toBe(true);
            expect(texts.some(t => t.startsWith("IMAGE_MISSING_IMG"))).toBe(true);
            expect(consoleErrors.some(e => e.includes("RenderError(/badInput)"))).toBe(true);
            expect(consoleErrors.some(e => e.includes("RenderError(/missingImg)"))).toBe(true);
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('Gallery list (of:"image"): import/export round-triplets and draggable-default items', async ({ page }) => {//{{{
        let onClosed;
        try {
            onClosed = await openPage(page, title, pugList);

            const res = await page.evaluate(async () => {
                const gallery = window.form.find("/gallery");
                const mkImg = (w, h) => {
                    const c = document.createElement("canvas");
                    c.width = w; c.height = h;
                    const ctx = c.getContext("2d");
                    ctx.fillStyle = "#0af";
                    ctx.fillRect(0, 0, w, h);
                    const url = c.toDataURL("image/png");
                    return {
                        name: w + "x" + h + ".png",
                        type: "image/png",
                        size: url.length,
                        lastModified: 0,
                        data: url.split(",")[1],
                    };
                };

                await gallery.import([mkImg(20, 20), mkImg(30, 30)]);
                const exported = await gallery.export();
                const items = [...gallery.targetNode.querySelectorAll("li")];
                return {
                    exported,
                    count: items.length,
                    draggables: items.map(li => ({
                        d: li.querySelector("img").getAttribute("draggable"),
                        src: li.querySelector("img").getAttribute("src"),
                    })),
                };
            });

            expect(res.count).toBe(2);
            expect(res.exported).toHaveLength(2);
            expect(res.exported[0].startsWith("data:image/png;name=20x20.png;")).toBe(true);
            expect(res.exported[1].startsWith("data:image/png;name=30x30.png;")).toBe(true);
            for (const it of res.draggables) {
                expect(it.d).toBe("false");
                expect(it.src.startsWith("data:image/png;base64,")).toBe(true);
            }
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}

    test('Dropping a file on a gallery item appends instead of replacing it', async ({ page }) => {//{{{
        let onClosed;
        try {
            onClosed = await openPage(page, title, pugList);

            const supportsDataTransfer = await page.evaluate(
                () => typeof DataTransfer !== "undefined"
            );
            test.skip(!supportsDataTransfer, "DataTransfer constructor unavailable");

            const res = await page.evaluate(async (makeFile) => {
                const gallery = window.form.find("/gallery");
                const mkImg = (w, h) => {
                    const c = document.createElement("canvas");
                    c.width = w; c.height = h;
                    c.getContext("2d").fillRect(0, 0, w, h);
                    const url = c.toDataURL("image/png");
                    return {
                        name: w + "x" + h + ".png",
                        type: "image/png",
                        size: url.length,
                        lastModified: 0,
                        data: url.split(",")[1],
                    };
                };
                await gallery.import([mkImg(20, 20)]);

                const dropFile = await eval(makeFile)({name: "drop.png"});
                const dt = new DataTransfer();
                dt.items.add(dropFile);

                const target = gallery.children[0].children[""].targetNode;
                // Plain Event + expando dataTransfer: DragEvent forbids setting
                // dataTransfer on synthetic events in Firefox/WebKit.
                const dropEvent = new Event("drop", {
                    bubbles: true,
                    cancelable: true,
                });
                Object.defineProperty(dropEvent, "dataTransfer", {value: dt});
                target.dispatchEvent(dropEvent);

                // Let the list append settle (async image decode gate):
                for (let i = 0; i < 100 && gallery.children.length < 2; i++) {
                    await new Promise(r => setTimeout(r, 50));
                }
                return {
                    count: gallery.children.length,
                    first: await gallery.children[0].export(),
                };
            }, makeFileFn);

            expect(res.count).toBe(2); // 1 existing + 1 appended
            // The first item keeps its original value (image item did not replace).
            expect(res.first).toContain("name=20x20.png");
        } finally {
            if (onClosed) await onClosed();
        }
    });//}}}
});