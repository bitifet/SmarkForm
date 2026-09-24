// types/video.type.js
// ===================
//
// The `video` field type turns a <video> element into a video-upload field.
// It extends the `file` type (spc/file.md) inheriting its value contract,
// acquisition machinery, list integration and download action, while adding
// in-place display (src + poster fallback), a metadata-level media-container
// probe on acquisition and an optional byte-size cap (spc/video.md).
//
// Interior state is identical to `file`: a normalized object
// {name, type, size, lastModified, data(base64)} or null.

import {action} from "./trigger.type.js";
import {input} from "./input.type.js";
import {
    file,
} from "./file.type.js";
import {
    readFileToObject,
    computeExport,
    acceptFile,
    b64ToBytes,
    downloadFileObject,
    typeToName,
} from "../lib/file_value.js";
import {export_to_target} from "../decorators/export_to_target.deco.js";
import {import_from_target} from "../decorators/import_from_target.deco.js";
import {media_spinner} from "../decorators/media_spinner.deco.js";
import {
    createMediaNotifier,
    findFileLikeListAncestor,
    processFileBatch,
} from "../lib/media_helpers.js";


// Option readers (§9): `smark_video_*` are the canonical toggle names and the
// only ones honored (no `smark_file_*` fallbacks — see spc/video.md §9).
const optOpen = me => me.options.smark_video_open;
const optDrop = me => me.options.smark_video_drop;
const optPaste = me => me.options.smark_video_paste;
const optAccept = me => (
    (typeof me.options.accept == "string" && me.options.accept)
    || "video/*"
);
const optValidate = me => me.options.smark_video_validate !== false;
const optClearOnDelete = me => (
    me.options.smark_video_clearOnDelete !== false
);
const optAutoPick = me => me.options.smark_video_autoPick === true;
const optMaxSize = me => (
    Number(me.options.video_maxSize) > 0 ? Number(me.options.video_maxSize) : null
);


// Default empty-state poster: a generated inline SVG data URL (dark slate with
// a centered play triangle) so an empty video field reads as an "upload a
// video" affordance with no network or asset fetch (§3.2). Deterministic and
// offline, same technique as image's chessboard.//}}}
const VIDEO_PLACEHOLDER = (() => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"'
        + ' viewBox="0 0 320 180">'
        + '<rect width="320" height="180" fill="#1f2937"/>'
        + '<path d="M128 60v60l48-30z" fill="#ffffff" opacity=".92"/>'
        + '</svg>';
    return "data:image/svg+xml;base64," + btoa(svg);
})();//}}}


// Media-container probe (§4): bytes must actually parse as a playable media
// container — `loadedmetadata` on an off-DOM <video> backed by an in-memory
// object URL. `canPlayType()` is deliberately advisory: browsers may return an
// empty string for a MIME/codec they can still parse, so the blob probe remains
// authoritative. `loadedmetadata` does NOT prove the codec track decodes
// (§4.2) — that is the honest limit.//}}}
const VIDEO_PROBE_TIMEOUT = 4000; // ms — memory-backed probe; no network stall.
async function probeVideo(obj) {//{{{
    return new Promise(resolve => {
        let bytes;
        try {
            bytes = b64ToBytes(String(obj?.data || ""));
        } catch {
            resolve(false);
            return;
        };
        const mime = String(obj?.type || "");
        const v = document.createElement("video");
        const url = URL.createObjectURL(new Blob([bytes], {type: mime}));
        let done = false;
        const finish = ok => {
            if (done) return;
            done = true;
            clearTimeout(t);
            v.removeAttribute("src");
            try { v.load(); } catch (_error) {}
            URL.revokeObjectURL(url);
            resolve(ok);
        };
        const t = setTimeout(() => finish(false), VIDEO_PROBE_TIMEOUT);
        v.preload = "metadata";
        v.addEventListener("loadedmetadata", () => finish(true));
        v.addEventListener("error", () => finish(false));
        v.src = url;
    });
};//}}}


function formatBytes(bytes) {//{{{
    const num = Number(bytes) || 0;
    if (num >= 1073741824) return (num / 1073741824).toFixed(1) + " GB";
    if (num >= 1048576) return (num / 1048576).toFixed(1) + " MB";
    if (num >= 1024) return (num / 1024).toFixed(1) + " KB";
    return num + " B";
};//}}}
const notify = createMediaNotifier("smark:videoNotice");


// Acquisition pipeline (§4 + §4.4): ① byte-cap check, ② media probe, ③ default
// name for nameless sources. `ctrl` is the video field instance, or a stand-in
// {options, targetNode} for the static list-facing methods.//}}}
async function acquirePipeline(obj, ctrl) {//{{{
    const maxSize = optMaxSize(ctrl);
    if (maxSize != null && Number(obj.size) > maxSize) {
        notify(ctrl, {
            kind: "rejection",
            code: "VIDEO_TOO_LARGE",
            mode: "maxSize",
            name: String(obj.name || ""),
            requirement: {maxBytes: maxSize},
            message: (
                `Video is ${formatBytes(obj.size)} but \`video_maxSize\``
                + ` is ${formatBytes(maxSize)}.`
            ),
        });
        return null;
    };
    if (optValidate(ctrl)) {
        if (! await probeVideo(obj)) return null; // Silent, like an unaccepted file.
    };
    if (! String(obj.name || "").trim()) {
        obj.name = typeToName(obj.type) === "file" ? "video.mp4" : typeToName(obj.type);
    };
    return obj;
};//}}}


// Video field type:
// -----------------

@media_spinner
export class video extends file {
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
        // `video_maxSize` is rejected BEFORE any byte is read (§4.4) — a cheap
        // synchronous `File.size` check spares the read/encode cost.
        const maxSize = optMaxSize(me);
        if (maxSize != null && Number(fileItem.size) > maxSize) {
            notify(me, {
                kind: "rejection",
                code: "VIDEO_TOO_LARGE",
                mode: "maxSize",
                name: String(fileItem.name || ""),
                requirement: {maxBytes: maxSize},
                message: (
                    `Video is ${formatBytes(fileItem.size)} but \`video_maxSize\``
                    + ` is ${formatBytes(maxSize)}.`
                ),
            });
            return;
        };
        const obj = await readFileToObject(fileItem);
        const processed = await acquirePipeline(obj, me);
        if (! processed) return; // Rejected (probe gate / byte cap).
        await me._setFile(processed);
    };//}}}
    _placeholderSrc() {//{{{
        const me = this;
        if (me.options.placeholder === false) return "";
        if (typeof me.options.placeholder == "string" && me.options.placeholder) {
            return me.options.placeholder;
        };
        return VIDEO_PLACEHOLDER;
    };//}}}
    _setDisplay(value) {//{{{
        const me = this;
        const node = me.targetNode;
        me._mediaLoadFinish?.();
        me._mediaLoadFinish = null;
        if (value?.data) {
            me.spin(true);
            me._mediaLoadFinish = me.watchMediaLoading(
                node, ["loadeddata", "canplay", "error"], () => {
                    me._mediaLoadFinish = null;
                    me.spin(false);
                    if (me._authoredPoster != null) {
                        node.setAttribute("poster", me._authoredPoster);
                    };
                }
            );
            node.removeAttribute("poster");
            node.setAttribute("src", "data:" + value.type + ";base64," + value.data);
            // An authored poster (if any) governs until playback starts; the
            // field's own placeholder is removed so it never sits over the
            // first frame (§3.2).
            node.load();
            return;
        };
        node.removeAttribute("src");
        if (me._spinCount) {
            node.removeAttribute("poster");
            node.load();
            return;
        };
        if (me._authoredPoster != null) {
            node.setAttribute("poster", me._authoredPoster);
        } else if (me.options.placeholder === false) {
            node.removeAttribute("poster");
        } else {
            node.setAttribute("poster", me._placeholderSrc());
        };
        node.load();
    };//}}}
    _onMediaSpinEnd() {//{{{
        const me = this;
        if (me.isSingleton) return;
        if (! me._file?.data) me._setDisplay(null);
    };//}}}
    _setTargetFieldValue(value) {//{{{
        const me = this;
        if (! me.isSingleton) {
            // Only the real field drives presentation; in a singleton the inner
            // field renders its own <video> and the container only syncs the caption.
            me._setDisplay(value);
            if (! me._titleLocked) {
                const node = me.targetNode;
                node.title = (
                    value?.data
                    ? `Video: ${value.name || ""} — activate to replace`
                    : "No video — activate to upload"
                );
            };
        };
        me._syncCaption(value || null);
    };//}}}
    _getCaption() {//{{{
        const me = this;
        if (! me.isSingleton) return null;
        const marked = Array.from(me.targetNode.querySelectorAll("[data-smark]"))
            .find(node => me.getComponent(node)?.options?.action === "rename");
        const caption = marked || me.targetNode.querySelector("figcaption[contenteditable]");
        if (caption) caption.contentEditable = "true";
        return caption || null;
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
    @action
    async rename(_data, options = {}) {//{{{
        const me = this;
        const node = options.origin?.targetNode || me._getCaption();
        if (! node) return await me.export(null, {silent: true});
        node.contentEditable = "true";
        me._syncCaption(me.children[""]?._file || me._file || null);
        node.focus();
        return await me.export(null, {silent: true});
    };//}}}
    _displayNode() {//{{{
        const me = this;
        return me.isSingleton
            ? (me.targetFieldNode || me.children[""]?.targetNode)
            : me.targetNode;
    };//}}}
    _togglePlay() {//{{{
        const me = this;
        const node = me._displayNode();
        if (! node) return;
        if (node.paused) {
            node.play().catch(() => {});
        } else {
            node.pause();
        };
    };//}}}
    _playOptions() {//{{{
        // Resolves the click/`Space` conflict (§3.4–§3.5): an explicit
        // `smark_video_click:"play"|"pick"` wins; `"auto"` keys off the
        // `controls` attribute of the video that carries playback (the real
        // field's own node, or the singleton's inner field).
        const me = this;
        const explicit = me.options.smark_video_click;
        const node = me.targetFieldNode || me.targetNode;
        const controls = !! (node && node.tagName === "VIDEO"
            && node.hasAttribute("controls"));
        const mode = (
            explicit === "play" || explicit === "pick" ? explicit
            : controls ? "play" : "pick"
        );
        return {mode, controls};
    };//}}}
    _isInteractiveTarget(e) {//{{{
        return !! e.target?.closest?.(
            "button, a, input, select, textarea, [contenteditable]"
        );
    };//}}}
    _handleClick(e, innerNode) {//{{{
        // The click contract (§3.5): pick mode opens the picker; play mode
        // toggles play/pause on the media surface (when the field itself is the
        // player — with native `controls` the control bar rules and nothing is
        // swallowed); an empty value always opens the picker.
        const me = this;
        if (me._isInteractiveTarget(e)) return;
        const {mode, controls} = me._playOptions();
        const surfaceClicked = ! innerNode || innerNode.contains(e.target);
        if (mode === "play" && surfaceClicked) {
            if (controls) return; // Native control bar keeps working (§3.5).
            const has = !! (me._file?.data ?? me.children[""]?._file?.data);
            if (has) {
                me._togglePlay();
                return;
            };
        };
        me._openPicker();
    };//}}}
    async render() {//{{{
        const me = this;
        if (me.targetNode.tagName === "VIDEO") {
            me.spin(true);
            me.onRendered(() => me.spin(false));
        };
        // Defer the render body until the constructor chain completes: the
        // events mixin creates `me.eventHooks` after the base constructors
        // return, and render() is kicked off synchronously inside them.  This
        // mirrors file.render()'s initial `await super.render()`.
        await Promise.resolve();
        // An <input type="video"> is not a valid HTML input type (browsers
        // treat it as text) and has none of the `file` value contract (§2.4).
        if (me.targetNode.tagName === "INPUT") throw me.renderError(
            "VIDEO_TYPE_ON_INPUT"
            , `An <input> cannot be a video field: use a <video> element or a`
                + ` singleton container instead.`
        );
        if (me.targetNode.tagName === "VIDEO") {
            me.isSingleton = false;
            me.targetFieldNode = me.targetNode;
            me._renderRealField();
            return;
        };
        // Singleton container (DIV / FIGURE / ...).
        me.isSingleton = true;
        // Reuse the input singleton flow (form child discovery + NOT_A_SINGLETON
        // / SINGLETON_TYPE_MISMATCH validation) via the grandparent, bypassing
        // file.render()'s file-specific wiring.
        await input.prototype.render.call(me);
        const son = me.children[""];
        if (! son || son.targetNode.tagName !== "VIDEO") throw me.renderError(
            "VIDEO_MISSING_VIDEO"
            , `Video singleton containers require exactly one inner <video> field`
                + ` (${son ? "found " + son.targetNode.tagName.toLowerCase() : "found none"}).`
        );
        me._renderSingleton();
    };//}}}
    _renderRealField() {//{{{
        const me = this;
        const node = me.targetFieldNode;
        me._authoredPoster = node.hasAttribute("poster")
            ? node.getAttribute("poster") : null;
        me._titleLocked = node.hasAttribute("title");
        if (! node.hasAttribute("tabindex")) node.tabIndex = 0;
        if (! node.hasAttribute("draggable")) node.setAttribute("draggable", "false");
        if (! node.hasAttribute("preload")) node.setAttribute("preload", "metadata");
        const {mode, controls} = me._playOptions();
        if (mode === "play") {
            if (! controls) {
                // The field is the player: start silent and play inline so a
                // programmatic play() is well-behaved.  With native `controls`
                // the author's own attributes are left untouched (§3.6).
                if (! node.hasAttribute("muted")) node.setAttribute("muted", "");
                if (! node.hasAttribute("playsinline")) {
                    node.setAttribute("playsinline", "");
                };
            };
        };

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
            node.addEventListener("click", e => {
                // Inside a video singleton the container owns clicks (the inner
                // field would fight the container's play/pick resolution).
                if (me.parent?.isSingleton && me.parent.options?.type === "video") return;
                me._handleClick(e, null);
            });
            me.eventHooks.keydown.push(async ev => {
                // Space / Shift+Space. Both may open the picker; Shift+Space
                // yields to the <details> folding convention when it wins first
                // (same defaultPrevented rule as `file`). In play mode plain
                // Space toggles play/pause instead (native `controls` keep the
                // browser's own focused-media Space handling — the hook only
                // acts when the field itself is the player, so playback never
                // double-toggles) (§3.4).
                if (ev.defaultPrevented || ev.originalEvent?.defaultPrevented) return;
                const key = ev.originalEvent?.key;
                if (key !== " " && key !== "Spacebar") return;
                if (ev.originalEvent.target?.closest?.("figcaption[contenteditable]")) {
                    return;
                };
                ev.preventDefault();
                if (ev.originalEvent.shiftKey) {
                    me._openPicker();
                    return;
                };
                if (mode === "play" && ! controls) {
                    if (! await me.isEmpty()) {
                        me._togglePlay();
                        return;
                    };
                };
                me._openPicker();
            });
        };

        if (optDrop(me) !== false) {
            node.addEventListener("drop", e => {
                if (e.dataTransfer?.files?.length) {
                    e.preventDefault();
                    // Inside a video-capable list the drop must append to the
                    // list (list-level handler) rather than replace this item.
                    const fla = findFileLikeListAncestor(me);
                    if (fla?.capable && fla.dropEnabled) return;
                    void me._acceptFiles(Array.from(e.dataTransfer.files));
                };
            });
            node.addEventListener("dragover", e => e.preventDefault());
        };
        if (optPaste(me) !== false) {
            node.addEventListener("paste", e => {
                const files = e.clipboardData?.files;
                if (files?.length) {
                    e.preventDefault();
                    void me._acceptFiles(Array.from(files));
                };
            });
        };

        me._setTargetFieldValue(null);
        if (optAutoPick(me)) me.onRendered(() => me._openPicker());
    };//}}}
    _renderSingleton() {//{{{
        const me = this;
        const innerNode = me.targetFieldNode;
        const consumeFiles = async files => {
            const fileItem = (files || []).find(f => acceptFile(f, me._accept()));
            if (! fileItem) return;
            const maxSize = optMaxSize(me);
            if (maxSize != null && Number(fileItem.size) > maxSize) {
                notify(me, {
                    kind: "rejection",
                    code: "VIDEO_TOO_LARGE",
                    mode: "maxSize",
                    name: String(fileItem.name || ""),
                    requirement: {maxBytes: maxSize},
                    message: (
                        `Video is ${formatBytes(fileItem.size)} but \`video_maxSize\``
                        + ` is ${formatBytes(maxSize)}.`
                    ),
                });
                return;
            };
            const processed = await acquirePipeline(
                await readFileToObject(fileItem), me
            );
            if (! processed) return;
            await me.children[""].import(processed, {silent: true});
            me.targetNode.dispatchEvent(new Event("change", {bubbles: true}));
        };

        // Whole-wrapper click; the inner field defers its own clicks here so
        // the container's play/pick resolution is authoritative (§3.5).
        if (optOpen(me) !== false) {
            me.targetNode.addEventListener("click", e => {
                me._handleClick(e, innerNode);
            });
        };

        // Drop and paste over the whole wrapper. Under a video-capable list the
        // container drop is suppressed so OS drops on an existing item append to
        // the list (§7). A drop/paste targeting the inner field directly is left
        // to the inner field.
        const fla = findFileLikeListAncestor(me);
        const underVideoList = !! (fla?.capable && fla.dropEnabled);
        if (optDrop(me) !== false && ! underVideoList) {
            me.targetNode.addEventListener("drop", e => {
                if (e.dataTransfer?.files?.length) {
                    e.preventDefault();
                    if (innerNode && innerNode.contains(e.target)) return;
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
                    if (innerNode && innerNode.contains(e.target)) return;
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
    async pick(_data, _options = {}) {//{{{
        // Explicit upload triggers are useful when native controls own the
        // video's click surface. The picker still opens inside the trigger's
        // user gesture.
        this._openPicker();
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
        // A media element has no text field: `targetFieldNode.value` is
        // undefined and file.export's "edited-name-wins" rule must not reach
        // String(undefined) (§6.1). The editable caption is the editable file
        // name (threaded here as `options.name` by the singleton wrapper).
        const fileObj = me._file;
        if (! fileObj) return null;
        const name = options.name != null ? String(options.name) : fileObj.name;
        return computeExport({...fileObj, name}, {
            format: me.options.format,
            encoding: me.options.encoding,
        });
    };//}}}
    @action
    @import_from_target
    async import(data, options = {}) {//{{{
        const me = this;
        me.spin(true);
        try {
            if (me.isSingleton) {
                const retv = await super.import(data, options);
                me._syncCaption(me.children[""]?._file || null);
                return retv;
            };
            return await super.import(data, options);
        } finally {
            me.spin(false);
        };
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
        // As with export, the stored name wins directly (no `.value` read); the
        // `filename` trigger option keeps its usual precedence.
        const fileObj = me._file;
        if (! fileObj) return null;
        const filename = options.filename || fileObj.name || "file";
        downloadFileObject(fileObj, {filename});
        return await me.export(null, {silent: true});
    };//}}}
    // Batch acquisition overrides (§4, §7): probe-validate and byte-cap every
    // selected file, dropping rejected results from the batch so lists stay
    // video-safe. `options`/`targetNode` (the list's own) are threaded by the
    // list type so the video settings and notification channel work list-wide.
    static async acquire(o = {}) {//{{{
        const objs = await file.acquire(o);
        if (! objs?.length) return objs;
        return await processFileBatch(objs, acquirePipeline, {
                options: o.options || {},
                targetNode: o.targetNode || document.body,
            });
    };//}}}
    static async toObjects(files, o = {}) {//{{{
        const objs = await file.toObjects(files, o);
        if (! objs?.length) return objs;
        return await processFileBatch(objs, acquirePipeline, {
                options: o.options || {},
                targetNode: o.targetNode || document.body,
            });
    };//}}}
};
