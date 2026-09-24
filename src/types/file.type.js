// types/file.type.js
// ==================
import {input} from "./input.type.js";
import {action} from "./trigger.type.js";
import {export_to_target} from "../decorators/export_to_target.deco.js";
import {import_from_target} from "../decorators/import_from_target.deco.js";
import {
    b64ToBytes,
    bytesToB64,
    bytesToHex,
    hexToBytes,
    b64url,
    payloadToBytes,
    bytesToEncoding,
    typeToName,
    acceptFile,
    readFileToObject,
    normalizeDataUrl,
    normalizePayload,
    URL_IMPORT_RE,
    urlName,
    fetchUrlToFileObject,
    normalizeImport,
    computeExport,
    downloadFileObject,
} from "../lib/file_value.js";
export {
    b64ToBytes, bytesToB64, bytesToHex, hexToBytes, b64url,
    payloadToBytes, bytesToEncoding, typeToName, acceptFile,
    readFileToObject, normalizeDataUrl, normalizePayload, URL_IMPORT_RE,
    urlName, fetchUrlToFileObject, normalizeImport, computeExport,
    downloadFileObject,
} from "../lib/file_value.js";


export class file extends input {
    // Capability flag: types inheriting this (e.g. `image`) are file-like, so
    // list-level file handling (drop append, multi-file pickers) applies to them.
    static isFileLike = true;
    constructor(...args) {//{{{
        super(...args);
        const me = this;
        me.defaultValue = null; // Default value is null (no file)
        me.emptyValue = null;   // Type-level empty state for clear action
    };//}}}
    _setTargetFieldValue(value) {//{{{
        const me = this;
        if (me.isSingleton) return; // (Only for real field)
        me.targetFieldNode.value = value?.name ?? "";
    };//}}}
    _setFile(fileObj) {//{{{
        const me = this;
        me._file = fileObj || null;
        me._setTargetFieldValue(me._file);
        me.targetNode.dispatchEvent(new Event("change", {bubbles: true}));
    };//}}}
    _openPicker() {//{{{
        const me = this;
        if (me.options.smark_file_open === false) return;
        me._picker?.click(); // Must be called synchronously inside a gesture.
    };//}}}
    async _acceptFiles(files) {//{{{
        const me = this;
        const fileItem = (files || []).find(f => acceptFile(f, me.options.accept));
        if (! fileItem) return;
        await me._setFile(await readFileToObject(fileItem));
    };//}}}
    async render() {//{{{
        const me = this;
        await super.render(); // (Sets isSingleton and targetFieldNode)
        if (me.isSingleton) {
            // Drop and paste are detected over the whole singleton container.
            // The inner field already handles drops targeting it directly, so
            // skip events that originated inside it to avoid double-processing.
            const innerNode = me.children[""]?.targetNode;
            const consumeFiles = async files => {
                const fileItem = (files || []).find(
                    f => acceptFile(f, me.options.accept)
                );
                if (! fileItem) return;
                await me.children[""].import(
                    await readFileToObject(
                        fileItem
                        , {encoding: me.options.encoding}
                    )
                    , {silent: true}
                );
                me.targetNode.dispatchEvent(new Event("change", {bubbles: true}));
            };
            // Inside a file-capable list (`of:"file"`), OS file drops are
            // handled at the list level with append semantics (spec §10): a
            // drop on an existing item appends a new item instead of replacing
            // that item's file.  Suppress the container-level drop here so
            // only the list's `_addFiles` handles it.  Paste stays item-scoped —
            // there is no list-level paste handler, so a paste on an item
            // still replaces that item's file.
            const parentList = me.parent;
            const underFileList = !! (
                parentList
                && parentList.options.type === "list"
                && me.types[parentList.tplType]?.isFileLike
                && parentList.options.fileDrop !== false
            );
            if (me.options.smark_file_drop !== false && ! underFileList) {
                me.targetNode.addEventListener("drop", e => {
                    if (e.dataTransfer?.files?.length) {
                        e.preventDefault();
                        if (innerNode && innerNode.contains(e.target)) return;
                        void consumeFiles(Array.from(e.dataTransfer.files));
                    };
                });
                me.targetNode.addEventListener("dragover", e => e.preventDefault());
            };
            if (me.options.smark_file_paste !== false) {
                me.targetNode.addEventListener("paste", e => {
                    const files = e.clipboardData?.files;
                    if (files?.length) {
                        e.preventDefault();
                        if (innerNode && innerNode.contains(e.target)) return;
                        void consumeFiles(Array.from(files));
                    };
                });
            };
            return;
        };
        // Real-field tuning: the authored input is repurposed as the visible
        // value field (its type rewritten to text, like the mask system does),
        // and a hidden native file input acts as the picker trigger.  The
        // hidden picker is never populated — see spec §3.
        const nodeFld = me.targetFieldNode;
        if (nodeFld.tagName === "INPUT") {
            const currentType = (nodeFld.getAttribute("type") || "text").toLowerCase();
            if (currentType !== "text") nodeFld.setAttribute("type", "text");
        };
        me._picker = document.createElement("input");
        me._picker.type = "file";
        me._picker.style.position = "fixed";
        me._picker.style.left = "-10000px";
        me._picker.style.top = "-10000px";
        me._picker.style.opacity = "0";
        if (me.options.accept) me._picker.accept = me.options.accept;
        me.targetNode.appendChild(me._picker);
        // Reset the picker after every pick so re-selecting the same file
        // re-fires the change event:
        me._picker.addEventListener("change", async () => {
            const files = me._picker.files;
            const fileItem = files?.[0];
            me._picker.value = "";
            if (fileItem) await me._setFile(await readFileToObject(fileItem));
        });

        // Click / Shift+Space open the picker (safelisted per option):
        if (me.options.smark_file_open !== false) {
            nodeFld.addEventListener("click", () => {
                me._openPicker();
            });
            me.eventHooks.keydown.push(async ev => {
                // Let the <details> folding convention (Shift+Space on a field
                // inside <summary>) win when it fires first:
                if (ev.defaultPrevented || ev.originalEvent?.defaultPrevented) return;
                const key = ev.originalEvent?.key;
                if (key === " " && ev.originalEvent.shiftKey) {
                    ev.preventDefault();
                    me._openPicker();
                };
            });
        };

        if (me.options.smark_file_drop !== false) {
            me.targetNode.addEventListener("drop", e => {
                if (e.dataTransfer?.files?.length) {
                    e.preventDefault();
                    void me._acceptFiles(Array.from(e.dataTransfer.files));
                };
            });
            me.targetNode.addEventListener("dragover", e => e.preventDefault());
        };
        if (me.options.smark_file_paste !== false) {
            me.targetNode.addEventListener("paste", e => {
                const files = e.clipboardData?.files;
                if (files?.length) {
                    e.preventDefault();
                    void me._acceptFiles(Array.from(files));
                };
            });
        };
        // The visible name field stays fully editable; keep the stored name in
        // sync so the edited name is what exports (spec §3).
        nodeFld.addEventListener("input", () => {
            if (me._file) me._file.name = nodeFld.value;
        });
    };//}}}
    @action
    @export_to_target
    async export(_data, options = {}) {//{{{
        const me = this;
        if (me.isSingleton) return await super.export(_data, options);
        const fileObj = me._file;
        if (! fileObj) return null;
        // The edited visible name wins over the stored one when non-empty:
        const fieldName = me.targetFieldNode.value;
        const name = (
            fieldName != null && String(fieldName) !== "" ? fieldName
            : fileObj.name
        );
        return computeExport({...fileObj, name}, {
            format: me.options.format,
            encoding: me.options.encoding,
        });
    };//}}}
    @action
    @import_from_target
    async import(data, options = {}) {//{{{
        const me = this;
        if (me.isSingleton) return await super.import(data, options);
        const {focus = false, silent = false, setDefault = true} = options;
        const isReset = data === undefined;
        // Undefined clears to default:
        if (isReset) data = me.defaultValue;
        const normalized = await normalizeImport(
            data,
            {encoding: me.options.encoding || "base64"},
        );
        me._file = normalized;
        me._setTargetFieldValue(me._file);
        if (! isReset && setDefault) {
            me.defaultValue = await me.export(null, {silent: true});
        };
        if (focus && ! silent) me.focus();
        return await me.export(null, {silent: true});
    };//}}}
    @action
    async download(_data, options = {}) {//{{{
        const me = this;
        if (me.isSingleton) return await me.children[""].download(_data, options);
        const fileObj = me._file;
        if (! fileObj) return null;
        const fieldName = me.targetFieldNode.value;
        const storedName = fileObj.name;
        const filename = (
            options.filename
            || (
                fieldName != null && String(fieldName) !== ""
                ? fieldName : storedName
            )
            || "file"
        );
        downloadFileObject(fileObj, {filename});
        return await me.export(null, {silent: true});
    };//}}}
    async isEmpty() {//{{{
        const me = this;
        if (me.isSingleton) return await me.children[""].isEmpty();
        return me._file == null;
    };//}}}
    // Batch file acquisition used by the list type (spec §10).  Opens a single
    // hidden multi-file picker; resolves to an array of normalized file objects
    // or [] when cancelled.  Only meaningful when called within a user gesture.
    static async acquire({accept, multiple, currentCount, maxItems, encoding} = {}) {//{{{
        return new Promise(resolve => {
            const input = document.createElement("input");
            input.type = "file";
            if (accept) input.accept = accept;
            if (multiple !== false) input.multiple = true;
            input.style.position = "fixed";
            input.style.left = "-10000px";
            input.style.top = "-10000px";
            input.style.opacity = "0";
            document.body.appendChild(input);
            const cleanup = () => input.remove();
            input.addEventListener("change", async () => {
                cleanup();
                const files = Array.from(input.files || []);
                if (! files.length) return resolve([]);
                try {
                    resolve(await Promise.all(
                        files.map(file => readFileToObject(file, {encoding}))
                    ));
                } catch (error) {
                    resolve([]);
                };
            });
            input.addEventListener("cancel", () => {
                cleanup();
                resolve([]);
            });
            input.click();
        });
    };//}}}
    // Convert externally obtained files (e.g. OS drops) into a normalized array
    // that list.addItem() can import directly.
    static async toObjects(files, {accept, encoding} = {}) {//{{{
        const items = (files || []).filter(f => acceptFile(f, accept));
        if (! items.length) return [];
        try {
            return await Promise.all(
                items.map(file => readFileToObject(file, {encoding}))
            );
        } catch (error) {
            return [];
        };
    };//}}}
};
