// types/image.type.js
// ====================
//
// The `image` field type turns an <img> element into an image-upload field.
// It extends the `file` type (spc/file.md) inheriting its value contract,
// acquisition machinery, list integration and download action, while adding
// in-place display (src + placeholder), decoded-image validation and optional
// resize / format conversion with `image_enforce` modes (spc/image.md).
//
// Interior state is identical to `file`: a normalized object
// {name, type, size, lastModified, data(base64)} or null.

import {action} from "./trigger.type.js";
import {input} from "./input.type.js";
import {
    file,
    readFileToObject,
    computeExport,
    acceptFile,
    bytesToB64,
} from "./file.type.js";
import {export_to_target} from "../decorators/export_to_target.deco.js";
import {import_from_target} from "../decorators/import_from_target.deco.js";


// Format vocabulary:{{{
// Canonical (and alias) names → MIME types and the extension used to rebuild
// file names after conversion (§4.1 of spc/image.md).
const FORMAT_MIME = {
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    avif: "image/avif",
};
const TYPE_EXT = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
};
// Formats the canvas encoder is guaranteed (or not) to produce (§4.2).
const ENCODABLE = {
    "image/png": true,
    "image/jpeg": true,
    "image/webp": true,
    "image/avif": true,
};
const ENCODE_QUALITY = 0.92;
// }}}

// Option readers (§9): the canonical `smark_image_*` names win; the inherited
// `smark_file_*` ones are honored as fallbacks for file-type habits.
const optOpen = me => (
    me.options.smark_image_open ?? me.options.smark_file_open
);
const optDrop = me => (
    me.options.smark_image_drop ?? me.options.smark_file_drop
);
const optPaste = me => (
    me.options.smark_image_paste ?? me.options.smark_file_paste
);
const optAccept = me => (
    (typeof me.options.accept == "string" && me.options.accept)
    || "image/*"
);
const optValidate = me => me.options.smark_image_validate !== false;
const optClearOnDelete = me => (
    me.options.smark_image_clearOnDelete !== false
);
const optEnforce = me => (
    ["strict", "hard", "warn", "ignore"].includes(me.options.image_enforce)
    ? me.options.image_enforce
    : "warn"
);


// Default empty-state placeholder: a generated black-and-white chessboard as an
// inline SVG data URL. Deterministic and offline — no network, no external
// asset (§3.2).//}}}
const CHESSBOARD = (() => {
    const sq = 8, size = 64, cells = [];
    for (let y = 0; y < size; y += sq) {
        for (let x = 0; x < size; x += sq) {
            if (((x + y) / sq) % 2) {
                cells.push(`<rect x="${x}" y="${y}" width="${sq}" height="${sq}" fill="#000"/>`);
            };
        };
    };
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">`
        + `<rect width="${size}" height="${size}" fill="#fff"/>` + cells.join("") + "</svg>";
    return "data:image/svg+xml;base64," + btoa(svg);
})();//}}}


// Decoded-image test (§4): deviate from file.type.js's decodeImage(), this one
// resolves to the loaded HTMLImageElement (so dimensions are available for the
// size/format processing steps) or null when the bytes do not decode. Image.decode()
// is preferred; the load/error pair is the conservative fallback (Safari < 11.1).//}}}
function decodeImage(obj) {//{{{
    return new Promise(resolve => {
        const img = new Image();
        img.src = "data:" + (obj.type || "") + ";base64," + obj.data;
        if (typeof img.decode === "function") {
            img.decode().then(() => resolve(img), () => resolve(null));
        } else {
            img.addEventListener("load", () => resolve(img));
            img.addEventListener("error", () => resolve(null));
        };
    });
};//}}}


// Size & format helpers (§4.1)//}}}
function resolveBox(value) {//{{{
    // image_resize / image_maxSize may be [w,h], {width,height} or a bare
    // number (= square).
    if (value == null) return {width: null, height: null};
    if (Array.isArray(value)) {
        return {width: Number(value[0]) || null, height: Number(value[1]) || null};
    };
    if (typeof value === "number") return {width: value, height: value};
    return {
        width: value.width != null ? Number(value.width) || null : null,
        height: value.height != null ? Number(value.height) || null : null,
    };
};//}}}
function defaultName(type) {//{{{
    return "image." + (TYPE_EXT[type] || "img");
};//}}}
function withExt(name, type) {//{{{
    // Keep the name stem (photo.png → photo.jpg); nameless sources fall back
    // to the §4.1 default `image.<ext>` (post-conversion extension).
    const base = (
        name && String(name).trim()
        ? String(name).trim().replace(/\.[^.]*$/, "")
        : "image"
    );
    return (base || "image") + "." + (TYPE_EXT[type] || "img");
};//}}}
function canvasToBlob(canvas, type, quality) {//{{{
    return new Promise(resolve => {
        try {
            canvas.toBlob(b => resolve(b), type, quality);
        } catch (_error) {
            resolve(null);
        };
    });
};//}}}
async function processImage(img, obj, {resize, maxSize, format} = {}) {//{{{
    // Best-effort resize + format conversion of a *decoded* candidate. Returns
    // the new object and a list of notices describing unmet requirements whose
    // conversion was unavailable. Notices carry the outcome class of §4.1.1:
    //   B — known non-conforming, conversion unavailable
    //   C — cannot be verified
    const result = {...obj};
    const notices = [];
    const mimeTarget = format ? FORMAT_MIME[format] : null;
    const {width: rw, height: rh} = resolveBox(resize);
    const {width: mw, height: mh} = resolveBox(maxSize);
    let targetW = null;
    let targetH = null;
    if (rw != null) {
        // Exact target box (stretch).
        targetW = rw;
        targetH = rh;
    } else if (mw != null) {
        // Downscale-only cap: act only when the source exceeds the box, then
        // fit *within* it preserving the aspect ratio.
        if (img.naturalWidth > mw || img.naturalHeight > mh) {
            const sc = Math.min(mw / img.naturalWidth, mh / img.naturalHeight);
            targetW = Math.max(1, Math.round(img.naturalWidth * sc));
            targetH = Math.max(1, Math.round(img.naturalHeight * sc));
        };
    };
    const needSize = targetW != null;
    const needFormat = mimeTarget != null && result.type !== mimeTarget;

    if (needSize || needFormat) {
        const sw = targetW || img.naturalWidth;
        const sh = targetH || img.naturalHeight;
        const canvas = document.createElement("canvas");
        canvas.width = sw;
        canvas.height = sh;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, sw, sh);
        const outType = (
            mimeTarget
            || (ENCODABLE[result.type] ? result.type : "image/png")
        );
        const blob = await canvasToBlob(canvas, outType, ENCODE_QUALITY);
        if (blob) {
            const bytes = new Uint8Array(await blob.arrayBuffer());
            result.data = bytesToB64(bytes);
            result.size = bytes.byteLength;
            result.type = blob.type || outType;
            if (result.type !== obj.type) result.name = withExt(result.name, result.type);
            if (needFormat && result.type !== mimeTarget) {
                // Converted to *something* but not the requested format (e.g.
                // WebP on Safari typically yields a PNG blob).
                notices.push({
                    outcome: "B",
                    code: "IMAGE_FORMAT_UNSUPPORTED",
                    requirement: "image_format",
                    message: `${obj.type || "This image"} cannot be encoded`
                        + ` as ${format} in this browser.`,
                });
            };
        } else {
            if (needFormat) {
                notices.push({
                    outcome: "B",
                    code: "IMAGE_FORMAT_UNSUPPORTED",
                    requirement: "image_format",
                    message: `${obj.type || "This image"} cannot be encoded`
                        + ` as ${format} in this browser.`,
                });
            };
            if (needSize) {
                notices.push({
                    outcome: "B",
                    code: "IMAGE_RESIZE_UNSUPPORTED",
                    requirement: resize != null ? "image_resize" : "image_maxSize",
                    message: `Could not resize this image to ${targetW}×${targetH}.`,
                });
            };
        };
    };
    return {obj: result, notices};
};//}}}
async function acquirePipeline(obj, ctrl) {//{{{
    // The acceptance pipeline (§4 + §12): ① decode gate, ② size/format
    // processing, ③ image_enforce verdict + notification, ④ default name.
    // `ctrl` is the image field instance, or a stand-in
    // {options, targetNode} for the static list-facing methods.
    const mode = optEnforce(ctrl);
    const resize = ctrl.options.image_resize ?? null;
    const maxSize = ctrl.options.image_maxSize ?? null;
    const format = ctrl.options.image_format ?? null;
    const hasRequirements = !!(resize != null || maxSize != null || format);

    // ① Decode gate — interactive acquisition only (`smark_image_validate`).
    let img = null;
    if (optValidate(ctrl)) {
        img = await decodeImage(obj);
        if (! img) return null; // Rejected silently like an unaccepted file.
    };

    // ② Size/format processing (best-effort).
    let result = {...obj};
    const notices = [];
    if (hasRequirements) {
        if (img) {
            const processed = await processImage(
                img, result, {resize, maxSize, format}
            );
            result = processed.obj;
            notices.push(...processed.notices);
        } else {
            // Decode skipped (`smark_image_validate:false`): dimensions are
            // unavailable and the encoded format is only as knowable as the
            // MIME metadata.
            if (format && result.type !== FORMAT_MIME[format]) {
                notices.push({
                    outcome: result.type ? "B" : "C",
                    code: result.type ? "IMAGE_FORMAT_UNSUPPORTED"
                        : "IMAGE_FORMAT_UNVERIFIABLE",
                    requirement: "image_format",
                    message: result.type
                        ? `${result.type} cannot be encoded as ${format}`
                            + ` in this browser.`
                        : "Cannot verify the encoded image format (no MIME"
                            + " metadata).",
                });
            };
            if (resize != null || maxSize != null) {
                notices.push({
                    outcome: "C",
                    code: "IMAGE_DIMENSIONS_UNKNOWN",
                    requirement: resize != null ? "image_resize" : "image_maxSize",
                    message: "Cannot verify the image dimensions (decode was"
                        + " skipped).",
                });
            };
        };
    };

    // ③ image_enforce verdict (§4.1.1).
    let rejected = false;
    for (const notice of notices) {
        const kind = (
            notice.outcome === "C"
                ? (mode === "strict" ? "rejection" : null)
                : mode === "strict" || mode === "hard"
                    ? "rejection"
                    : mode === "warn"
                        ? "warning"
                        : null
        );
        if (! kind) continue;
        notify(ctrl, {
            kind,
            code: notice.code,
            message: notice.message,
            mode,
            name: result.name || "",
            requirement: notice.requirement,
        });
        if (kind === "rejection") rejected = true;
    };
    if (rejected) return null;

    // ④ Default name for nameless sources (§4.1).
    if (! String(result.name || "").trim()) {
        result.name = defaultName(result.type);
    };
    return result;
};//}}}


// Notification channel (§4.3): a bubbling cancellable `smark:imageNotice` DOM
// event plus an in-page toast. A handler calling preventDefault() keeps the
// default toast but never suppresses the event itself. A single module-level
// toast singleton ensures one transient notice at a time (latest wins).//}}}
let toastEl = null;
let toastTimer = null;
function showToast(message) {//{{{
    if (toastTimer) clearTimeout(toastTimer);
    if (toastEl?.parentNode) toastEl.remove();
    toastEl = document.createElement("div");
    toastEl.setAttribute("role", "status");
    toastEl.setAttribute("aria-live", "polite");
    Object.assign(toastEl.style, {
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        maxWidth: "80vw",
        padding: "10px 16px",
        borderRadius: "6px",
        background: "rgba(40,40,40,.92)",
        color: "#fff",
        font: "14px/1.4 system-ui, sans-serif",
        boxShadow: "0 2px 12px rgba(0,0,0,.35)",
        zIndex: "2147483000",
        pointerEvents: "none",
    });
    toastEl.textContent = message;
    document.body.appendChild(toastEl);
    toastTimer = setTimeout(() => {
        toastEl?.remove?.();
        toastEl = null;
        toastTimer = null;
    }, 4000);
};//}}}
function notify(ctrl, detail) {//{{{
    const event = new CustomEvent("smark:imageNotice", {
        bubbles: true,
        cancelable: true,
        detail,
    });
    const keepDefault = ctrl.targetNode.dispatchEvent(event);
    if (keepDefault === false) return; // preventDefault() → suppress toast.
    showToast(detail.message);
};//}}}


// Find the nearest ancestor list and whether its item type is file-like
// (capability test — see spc/image.md §7). Used to suppress item-level drops
// inside image-capable lists: a drop on an existing item appends to the list
// instead of replacing that item.
function fileLikeListAncestor(me) {//{{{
    for (const anc of me.parents) {
        if (anc.options.type !== "list") continue;
        return {
            list: anc,
            capable: !! me.types[anc.tplType]?.isFileLike,
            dropEnabled: anc.options.fileDrop !== false,
        };
    };
    return null;
};//}}}


// Image field type:
// -----------------

export class image extends file {
    constructor(...args) {//{{{
        super(...args);
        const me = this;
        // Delete / Backspace clear the current value (§3.4) — but never when
        // the user is editing the editable caption (figcaption contenteditable),
        // where the keys naturally edit text.
        me.eventHooks.keydown.push(async ev => {
            if (ev.defaultPrevented) return;
            const oe = ev.originalEvent;
            const key = oe?.key;
            if (key !== "Delete" && key !== "Backspace") return;
            if (! optClearOnDelete(me)) return;
            if (oe.target?.closest?.("figcaption[contenteditable]")) return;
            if (await me.isEmpty()) return;
            oe.preventDefault();
            ev.preventDefault?.();
            // In a singleton wrapper the container owns the caption: redirect
            // the clear there so it empties the caption too (§6.1).
            const target = me.parent?.isSingleton ? me.parent : me;
            await target.clear();
            target.targetNode.dispatchEvent(new Event("change", {bubbles: true}));
        });
    };//}}}
    _accept() {//{{{
        return optAccept(this);
    };//}}}
    async _acceptFiles(files) {//{{{
        const me = this;
        const fileItem = (files || []).find(f => acceptFile(f, me._accept()));
        if (! fileItem) return;
        const obj = await readFileToObject(fileItem);
        const processed = await acquirePipeline(obj, me);
        if (! processed) return; // Rejected (decode gate / enforce verdict).
        await me._setFile(processed);
    };//}}}
    _placeholderSrc() {//{{{
        const me = this;
        if (me.options.placeholder === false) return "";
        if (typeof me.options.placeholder == "string" && me.options.placeholder) {
            return me.options.placeholder;
        };
        return CHESSBOARD;
    };//}}}
    _setDisplay(value) {//{{{
        const me = this;
        const img = me.targetNode;
        if (value?.data) {
            img.src = "data:" + value.type + ";base64," + value.data;
        } else if (me.options.placeholder === false) {
            img.removeAttribute("src");
        } else {
            img.src = me._placeholderSrc();
        };
    };//}}}
    _setTargetFieldValue(value) {//{{{
        const me = this;
        if (! me.isSingleton) {
            // Only the real field drives presentation; in a singleton the inner
            // field renders its own <img> and the container only syncs the caption.
            me._setDisplay(value);
            if (! me._titleLocked) {
                const img = me.targetNode;
                img.title = (
                    value?.data
                    ? `Image: ${value.name || ""} — activate to replace`
                    : "No image — activate to upload"
                );
            };
        };
        me._syncCaption(value || null);
    };//}}}
    _getCaption() {//{{{
        const me = this;
        if (! me.isSingleton) return null;
        return me.targetNode.querySelector("figcaption[contenteditable]") || null;
    };//}}}
    _captionText() {//{{{
        const me = this;
        const cap = me._getCaption();
        return cap ? String(cap.textContent || "").trim() : "";
    };//}}}
    _syncCaption(value) {//{{{
        const me = this;
        const cap = me._getCaption();
        if (! cap) return;
        const name = String(value?.name ?? "");
        if (cap.textContent !== name) cap.textContent = name;
    };//}}}
    async render() {//{{{
        const me = this;
        // Defer the render body until the constructor chain completes: the
        // events mixin creates `me.eventHooks` after the base constructors
        // return, and render() is kicked off synchronously inside them.  This
        // mirrors file.render()'s initial `await super.render()`.
        await Promise.resolve();
        // An <input type="image"> is a submit-piece, not a field: using it as
        // the image target is almost surely a mistake (§2 of spc/image.md).
        if (
            me.targetNode.tagName === "INPUT"
            && me.targetNode.getAttribute("type")?.toLowerCase() === "image"
        ) throw me.renderError(
            "IMAGE_TYPE_ON_INPUT"
            , `An <input type="image"> cannot be an image field: use an <img>`
                + ` or a singleton container instead.`
        );
        if (me.targetNode.tagName === "IMG") {
            me.isSingleton = false;
            me.targetFieldNode = me.targetNode;
            me._renderRealField();
            return;
        };
        // Singleton container (DIV / FIGURE / PICTURE / ...).
        me.isSingleton = true;
        // Reuse the input singleton flow (form child discovery + NOT_A_SINGLETON
        // / SINGLETON_TYPE_MISMATCH validation) via the grandparent, bypassing
        // file.render()'s file-specific wiring.
        await input.prototype.render.call(me);
        const son = me.children[""];
        if (! son || son.targetNode.tagName !== "IMG") throw me.renderError(
            "IMAGE_MISSING_IMG"
            , `Image singleton containers require exactly one inner <img> field`
                + ` (${son ? "found " + son.targetNode.tagName.toLowerCase() : "found none"}).`
        );
        me._renderSingleton();
    };//}}}
    _renderRealField() {//{{{
        const me = this;
        const img = me.targetFieldNode;
        me._titleLocked = img.hasAttribute("title");
        if (! img.hasAttribute("tabindex")) img.tabIndex = 0;
        if (! img.hasAttribute("draggable")) img.setAttribute("draggable", "false");

        // Hidden transient picker (never populated; reset after every pick):
        me._picker = document.createElement("input");
        me._picker.type = "file";
        me._picker.accept = me._accept();
        me._picker.style.position = "fixed";
        me._picker.style.left = "-10000px";
        me._picker.style.top = "-10000px";
        me._picker.style.opacity = "0";
        me.targetNode.appendChild(me._picker);
        me._picker.addEventListener("change", async () => {
            const fileItem = me._picker.files?.[0];
            me._picker.value = "";
            if (fileItem) await me._acceptFiles([fileItem]);
        });

        if (optOpen(me) !== false) {
            img.addEventListener("click", () => me._openPicker());
            me.eventHooks.keydown.push(async ev => {
                // Space / Shift+Space open the picker. Shift+Space yields to the
                // <details> folding convention when it wins first (same
                // defaultPrevented rule as `file`); plain Space also stops scroll.
                if (ev.defaultPrevented || ev.originalEvent?.defaultPrevented) return;
                const key = ev.originalEvent?.key;
                if (key !== " " && key !== "Spacebar") return;
                if (ev.originalEvent.target?.closest?.("figcaption[contenteditable]")) {
                    return;
                };
                ev.preventDefault();
                me._openPicker();
            });
        };

        if (optDrop(me) !== false) {
            img.addEventListener("drop", e => {
                if (e.dataTransfer?.files?.length) {
                    e.preventDefault();
                    // Inside an image-capable list the drop must append to the
                    // list (list-level handler) rather than replace this item.
                    const fla = fileLikeListAncestor(me);
                    if (fla?.capable && fla.dropEnabled) return;
                    void me._acceptFiles(Array.from(e.dataTransfer.files));
                };
            });
            img.addEventListener("dragover", e => e.preventDefault());
        };
        if (optPaste(me) !== false) {
            img.addEventListener("paste", e => {
                const files = e.clipboardData?.files;
                if (files?.length) {
                    e.preventDefault();
                    void me._acceptFiles(Array.from(files));
                };
            });
        };

        // Defensive decode failure hook: if the browser cannot render the
        // current src, fall back to the placeholder while KEEPING state intact
        // (exports stay faithful). Emit console.warn once.
        img.addEventListener("error", () => {
            if (! me._file?.data) return;
            me._warnedNoDecode ||= (console.warn(
                `SmarkForm: image field "${me.getPath()}" could not render its`
                    + " current value on this browser; showing the placeholder"
                    + " (the value is kept for export)."
            ), true);
            me._setDisplay(null);
        });
        me._setTargetFieldValue(null);
    };//}}}
    _renderSingleton() {//{{{
        const me = this;
        const innerNode = me.children[""].targetNode;
        const consumeFiles = async files => {
            const fileItem = (files || []).find(f => acceptFile(f, me._accept()));
            if (! fileItem) return;
            const processed = await acquirePipeline(
                await readFileToObject(fileItem), me
            );
            if (! processed) return;
            await me.children[""].import(processed, {silent: true});
            me.targetNode.dispatchEvent(new Event("change", {bubbles: true}));
        };

        // Whole-wrapper click opens the picker unless the click targets an
        // interactive/editable descendant (triggers, the inner field, or the
        // editable caption, whose clicks must not steal focus) (§3.5, §6.1).
        if (optOpen(me) !== false) {
            me.targetNode.addEventListener("click", e => {
                if (e.target.closest(
                    "button, a, input, select, textarea, [contenteditable]"
                )) return;
                me._openPicker();
            });
        };

        // Drop and paste over the whole wrapper. Under an image-capable list the
        // container drop is suppressed so OS drops on an existing item append to
        // the list (§7). A drop/paste targeting the inner field directly is left
        // to the inner field.
        const fla = fileLikeListAncestor(me);
        const underImageList = !! (fla?.capable && fla.dropEnabled);
        if (optDrop(me) !== false && ! underImageList) {
            me.targetNode.addEventListener("drop", e => {
                if (e.dataTransfer?.files?.length) {
                    e.preventDefault();
                    if (innerNode.contains(e.target)) return;
                    void consumeFiles(Array.from(e.dataTransfer.files));
                };
            });
            me.targetNode.addEventListener("dragover", e => e.preventDefault());
        };
        if (optPaste(me) !== false) {
            me.targetNode.addEventListener("paste", e => {
                const files = e.clipboardData?.files;
                if (files?.length) {
                    e.preventDefault();
                    if (innerNode.contains(e.target)) return;
                    void consumeFiles(Array.from(files));
                };
            });
        };

        // Caption = the editable file name (§6.1): mirror the stored name on
        // value changes and let the typed text override exports live (the
        // `file` visible-name pattern — mutates the stored name, not state).
        const cap = me._getCaption();
        if (cap) {
            cap.addEventListener("input", () => {
                const inner = me.children[""];
                if (inner?._file) inner._file.name = cap.textContent.trim();
            });
        };
        me.targetNode.addEventListener("change", () => {
            me._syncCaption(me.children[""]?._file || null);
        });
        me._syncCaption(me.children[""]?._file || null);
    };//}}}
    _openPicker() {//{{{
        const me = this;
        if (optOpen(me) === false) return;
        const pickerField = me._picker ? me : (me.isSingleton ? me.children[""] : me);
        pickerField._picker?.click(); // Synchronously inside the user gesture.
    };//}}}
    @action
    @export_to_target
    async export(_data, options = {}) {//{{{
        const me = this;
        if (me.isSingleton) {
            const caption = me._captionText();
            const innerOptions = (
                caption ? {...options, name: caption}
                : options
            );
            return await me.children[""].export(_data, innerOptions);
        };
        // An IMG has no visible text field: `targetFieldNode.value` is undefined
        // and file.export's "edited-name-wins" rule must not reach it. Honor an
        // explicit name (the singleton caption) and delegate otherwise.
        if (options.name != null) {
            const fileObj = me._file;
            if (! fileObj) return null;
            return computeExport({...fileObj, name: String(options.name)}, {
                format: me.options.format,
                encoding: me.options.encoding,
            });
        };
        return await super.export(_data, options);
    };//}}}
    @action
    @import_from_target
    async import(data, options = {}) {//{{{
        const me = this;
        if (me.isSingleton) {
            const retv = await super.import(data, options);
            me._syncCaption(me.children[""]?._file || null);
            return retv;
        };
        return await super.import(data, options);
    };//}}}
    @action
    async download(_data, options = {}) {//{{{
        const me = this;
        if (me.isSingleton) {
            const caption = me._captionText();
            const innerOptions = (
                caption ? {...options, filename: caption}
                : options
            );
            return await me.children[""].download(_data, innerOptions);
        };
        return await super.download(_data, options);
    };//}}}
    // Batch acquisition overrides (§4, §7): decode-filter and size/format-process
    // every selected file, dropping rejected results from the batch so lists stay
    // image-safe. `options`/`targetNode` (the list's own) are threaded by the list
    // type so the image_* settings and notification channel work list-wide.
    static async acquire(o = {}) {//{{{
        const objs = await file.acquire(o);
        if (! objs?.length) return objs;
        const out = [];
        for (const obj of objs) {
            const processed = await acquirePipeline(obj, {
                options: o.options || {},
                targetNode: o.targetNode || document.body,
            });
            if (processed) out.push(processed);
        };
        return out;
    };//}}}
    static async toObjects(files, o = {}) {//{{{
        const objs = await file.toObjects(files, o);
        if (! objs?.length) return objs;
        const out = [];
        for (const obj of objs) {
            const processed = await acquirePipeline(obj, {
                options: o.options || {},
                targetNode: o.targetNode || document.body,
            });
            if (processed) out.push(processed);
        };
        return out;
    };//}}}
};