// types/audio.type.js
// ====================
//
// The `audio` field type turns an <audio> element into an audio-upload field.
// It extends the `file` type (spc/file.md) inheriting its value contract,
// acquisition machinery, list integration and download action, while adding
// in-place playback via <audio src> and a metadata-level media-container probe
// on acquisition with an optional byte-size cap (spc/audio.md).
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
    processFileSource,
} from "../lib/media_helpers.js";
import {
    getCaption,
    captionText,
    syncCaption,
    bindCaption,
    rename as renameCaption,
} from "../lib/file_caption.js";


// Option readers (§9): `smark_audio_*` are the canonical toggle names (mirroring
// video's own `smark_video_*` naming — no smark_file_* fallbacks).
const optOpen = me => me.options.smark_audio_open;
const optDrop = me => me.options.smark_audio_drop;
const optPaste = me => me.options.smark_audio_paste;
const optAccept = me => (
    (typeof me.options.accept == "string" && me.options.accept)
    || "audio/*"
);
const optValidate = me => me.options.smark_audio_validate !== false;
const optClearOnDelete = me => (
    me.options.smark_audio_clearOnDelete !== false
);
const optAutoPick = me => me.options.smark_audio_autoPick === true;
const optClickMode = me => (
    ["pick", "play"].includes(me.options.smark_audio_click)
    ? me.options.smark_audio_click
    : "auto"
);
const optMaxSize = me => (
    Number(me.options.audio_maxSize) > 0 ? Number(me.options.audio_maxSize) : null
);


// Media-container probe (§4): bytes must actually parse as a playable audio
// container — `loadedmetadata` on an off-DOM <audio> backed by an in-memory
// object URL. `canPlayType()` is deliberately advisory. `loadedmetadata` does
// NOT prove the codec track decodes (§4.2) — that is the honest limit.//}}}
const AUDIO_PROBE_TIMEOUT = 4000; // ms — memory-backed probe; no network stall.
async function probeAudio(obj) {//{{{
    return new Promise(resolve => {
        let bytes;
        try {
            bytes = b64ToBytes(String(obj?.data || ""));
        } catch {
            resolve(false);
            return;
        };
        const mime = String(obj?.type || "");
        // Cheap MIME pre-check: advisory only.
        if (HTMLAudioElement.prototype.canPlayType?.call?.length) {
            const hint = document.createElement("audio").canPlayType(mime);
            // canPlayType returns "probably", "maybe", or "".
            if (hint === "") {
                // Known-negative benefit of the doubt: still run the blob probe
                // in case the MIME string omitted codecs.
            };
        };
        const a = document.createElement("audio");
        const url = URL.createObjectURL(new Blob([bytes], {type: mime}));
        let done = false;
        const finish = ok => {
            if (done) return;
            done = true;
            clearTimeout(t);
            a.removeAttribute("src");
            try { a.load(); } catch (_error) {}
            URL.revokeObjectURL(url);
            resolve(ok);
        };
        const t = setTimeout(() => finish(false), AUDIO_PROBE_TIMEOUT);
        a.preload = "metadata";
        a.addEventListener("loadedmetadata", () => finish(true));
        a.addEventListener("error", () => finish(false));
        a.src = url;
    });
};//}}}


function formatBytes(bytes) {//{{{
    const num = Number(bytes) || 0;
    if (num >= 1073741824) return (num / 1073741824).toFixed(1) + " GB";
    if (num >= 1048576) return (num / 1048576).toFixed(1) + " MB";
    if (num >= 1024) return (num / 1024).toFixed(1) + " KB";
    return num + " B";
};//}}}
const notify = createMediaNotifier("smark:audioNotice");


// Acquisition pipeline (§4 + §4.4): ① byte-cap check, ② audio probe, ③ default
// name for nameless sources. `ctrl` is the audio field instance, or a stand-in
// {options, targetNode} for the static list-facing methods.//}}}
async function acquirePipeline(obj, ctrl) {//{{{
    const maxSize = optMaxSize(ctrl);
    if (maxSize != null && Number(obj.size) > maxSize) {
        notify(ctrl, {
            kind: "rejection",
            code: "AUDIO_TOO_LARGE",
            mode: "maxSize",
            name: String(obj.name || ""),
            requirement: {maxBytes: maxSize},
            message: (
                `Audio is ${formatBytes(obj.size)} but \`audio_maxSize\``
                + ` is ${formatBytes(maxSize)}.`
            ),
        });
        return null;
    };
    if (optValidate(ctrl)) {
        if (! await probeAudio(obj)) return null; // Silent, like an unaccepted file.
    };
    if (! String(obj.name || "").trim()) {
        obj.name = typeToName(obj.type) === "file" ? "audio.mp3" : typeToName(obj.type);
    };
    return obj;
};//}}}


// Audio field type:
// -----------------

@media_spinner
export class audio extends file {
    constructor(...args) {//{{{
        super(...args);
        const me = this;
        // Delete / Backspace clear the current value (§3.4) — but never when
        // the user is editing the editable caption (rename/contenteditable),
        // where the keys naturally edit text.
        me.eventHooks.keydown.push(async ev => {
            if (ev.defaultPrevented) return;
            const oe = ev.originalEvent;
            const key = oe?.key;
            if (key !== "Delete" && key !== "Backspace") return;
            if (! optClearOnDelete(me)) return;
            if (oe.target?.closest?.("[contenteditable]")) return;
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
        // `audio_maxSize` is rejected BEFORE any byte is read (§4.4).
        const maxSize = optMaxSize(me);
        if (maxSize != null && Number(fileItem.size) > maxSize) {
            notify(me, {
                kind: "rejection",
                code: "AUDIO_TOO_LARGE",
                mode: "maxSize",
                name: String(fileItem.name || ""),
                requirement: {maxBytes: maxSize},
                message: (
                    `Audio is ${formatBytes(fileItem.size)} but \`audio_maxSize\``
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
    _setDisplay(value) {//{{{
        const me = this;
        const node = me.targetNode;
        if (value?.data) {
            node.setAttribute("src", "data:" + value.type + ";base64," + value.data);
            node.load();
            return;
        };
        node.removeAttribute("src");
        // Remove any author-managed <source> children so the empty element is
        // truly inactive.
        node.querySelectorAll?.("source")?.forEach?.(s => s.remove?.());
        node.load();
    };//}}}
    _setTargetFieldValue(value) {//{{{
        const me = this;
        if (! me.isSingleton) {
            // Only the real field drives presentation.
            me._setDisplay(value);
            if (! me._titleLocked) {
                const node = me.targetNode;
                node.title = (
                    value?.data
                    ? `Audio: ${value.name || ""} — activate to replace`
                    : "No audio — activate to upload"
                );
            };
        };
        me._syncCaption(value || null);
    };//}}}
    _getCaption() {//{{{
        return getCaption(this);
    };//}}}
    _captionText() {//{{{
        return captionText(this);
    };//}}}
    _syncCaption(value) {//{{{
        syncCaption(this, value);
    };//}}}
    @action
    async rename(_data, options = {}) {//{{{
        return await renameCaption(this, _data, options);
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
        // Resolves the click/`Space` conflict (§3.4–§3.5).
        const me = this;
        const explicit = optClickMode(me);
        const node = me.targetFieldNode || me.targetNode;
        const controls = !! (node && node.tagName === "AUDIO"
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
        // toggles play/pause on the media surface; an empty value always opens
        // the picker.
        const me = this;
        if (me._isInteractiveTarget(e)) return;
        const {mode, controls} = me._playOptions();
        const surfaceClicked = ! innerNode || innerNode.contains(e.target);
        if (mode === "play" && surfaceClicked) {
            if (controls) return; // Native control bar keeps working.
            const has = !! (me._file?.data ?? me.children[""]?.file?.data);
            if (has) {
                me._togglePlay();
                return;
            };
        };
        me._openPicker();
    };//}}}
    async render() {//{{{
        const me = this;
        if (me.targetNode.tagName === "AUDIO") {
            me.spin(true);
            me.onRendered(() => me.spin(false));
        };
        // Defer the render body until the constructor chain completes: the
        // events mixin creates `me.eventHooks` after the base constructors
        // return, and render() is kicked off synchronously inside them.
        await Promise.resolve();
        if (me.targetNode.tagName === "INPUT") throw me.renderError(
            "AUDIO_TYPE_ON_INPUT"
            , `An <input> cannot be an audio field: use an <audio> element or a`
                + ` singleton container instead.`
        );
        if (me.targetNode.tagName === "AUDIO") {
            me.isSingleton = false;
            me.targetFieldNode = me.targetNode;
            me._renderRealField();
            return;
        };
        // Singleton container (DIV / FIGURE / ...).
        me.isSingleton = true;
        // Reuse the input singleton flow via the grandparent.
        await input.prototype.render.call(me);
        const son = me.children[""];
        if (! son || son.targetNode.tagName !== "AUDIO") throw me.renderError(
            "AUDIO_MISSING_AUDIO"
            , `Audio singleton containers require exactly one inner <audio> field`
                + ` (${son ? "found " + son.targetNode.tagName.toLowerCase() : "found none"}).`
        );
        me._renderSingleton();
    };//}}}
    _renderRealField() {//{{{
        const me = this;
        const node = me.targetFieldNode;
        me._titleLocked = node.hasAttribute("title");
        if (! node.hasAttribute("tabindex")) node.tabIndex = 0;
        if (! node.hasAttribute("draggable")) node.setAttribute("draggable", "false");
        if (! node.hasAttribute("preload")) node.setAttribute("preload", "metadata");
        const {mode} = me._playOptions();
        // In play mode, muted may be set only if the author did not set it
        // (§3.6). No autoplay, no playsinline requirement for audio.
        if (mode === "play") {
            if (! node.hasAttribute("muted")) node.setAttribute("muted", "");
        };

        // Hidden transient picker:
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
                // Inside an audio singleton the container owns clicks (the inner
                // field would fight the container's play/pick resolution).
                if (me.parent?.isSingleton && me.parent.options?.type === "audio") return;
                me._handleClick(e, null);
            });
            me.eventHooks.keydown.push(async ev => {
                // Space / Shift+Space. Both may open the picker; Shift+Space
                // yields to the <details> folding convention when it wins first.
                // In play mode plain Space toggles play/pause instead.
                if (ev.defaultPrevented || ev.originalEvent?.defaultPrevented) return;
                const key = ev.originalEvent?.key;
                if (key !== " " && key !== "Spacebar") return;
                if (ev.originalEvent.target?.closest?.("[contenteditable]")) {
                    return;
                };
                ev.preventDefault();
                if (ev.originalEvent.shiftKey) {
                    me._openPicker();
                    return;
                };
                const {mode, controls} = me._playOptions();
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
                    // Inside an audio-capable list the drop must append to the
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
                    code: "AUDIO_TOO_LARGE",
                    mode: "maxSize",
                    name: String(fileItem.name || ""),
                    requirement: {maxBytes: maxSize},
                    message: (
                        `Audio is ${formatBytes(fileItem.size)} but \`audio_maxSize\``
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

        // Whole-wrapper click.
        if (optOpen(me) !== false) {
            me.targetNode.addEventListener("click", e => {
                me._handleClick(e, innerNode);
            });
        };

        // Drop and paste over the whole wrapper.
        const fla = findFileLikeListAncestor(me);
        const underAudioList = !! (fla?.capable && fla.dropEnabled);
        if (optDrop(me) !== false && ! underAudioList) {
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

        bindCaption(me);
    };//}}}
    _openPicker() {//{{{
        const me = this;
        if (optOpen(me) === false) return;
        const pickerField = me._picker ? me : (me.isSingleton ? me.children[""] : me);
        pickerField._picker?.click(); // Synchronously inside the user gesture.
    };//}}}
    @action
    async pick(_data, _options = {}) {//{{{
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
                me._syncCaption(me.children[""]?.file || me.children[""]?._file || null);
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
        const fileObj = me._file;
        if (! fileObj) return null;
        const filename = options.filename || fileObj.name || "file";
        downloadFileObject(fileObj, {filename});
        return await me.export(null, {silent: true});
    };//}}}
    // Batch acquisition overrides (§4, §7): probe-validate and byte-cap every
    // selected file, dropping rejected results from the batch.
    static async acquire(o = {}) {//{{{
        return await processFileSource(() => file.acquire(o), acquirePipeline, {
                options: o.options || {},
                targetNode: o.targetNode || document.body,
            });
    };//}}}
    static async toObjects(files, o = {}) {//{{{
        return await processFileSource(
            () => file.toObjects(files, o), acquirePipeline, {
                options: o.options || {},
                targetNode: o.targetNode || document.body,
            }
        );
    };//}}}
};
