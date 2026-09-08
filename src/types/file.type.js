// types/file.type.js
// ==================
import {input} from "./input.type.js";
import {action} from "./trigger.type.js";
import {export_to_target} from "../decorators/export_to_target.deco.js";
import {import_from_target} from "../decorators/import_from_target.deco.js";
import {parseJSON} from "../lib/helpers.js";


// Byte-encoding helpers:
// ----------------------
// The component's interior state always stores `data` as plain *base64*.
// `encoding` only selects how the payload is written on export (json form and
// bare-string imports); `format` selects between the data-URL string and the
// structured object.  A `data:` URL always carries base64 bytes (per spec,
// regardless of `encoding`).//}}}
function b64ToBytes(b64) {//{{{
    const bin = atob(String(b64).replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
};//}}}
function bytesToB64(bytes) {//{{{
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
};//}}}
function bytesToHex(bytes) {//{{{
    let out = "";
    for (let i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, "0");
    return out;
};//}}}
function hexToBytes(hex) {//{{{
    const h = String(hex).replace(/\s+/g, "");
    const bytes = new Uint8Array(h.length >> 1);
    for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(h.substr(i * 2, 2), 16);
    return bytes;
};//}}}
const b64url = s => s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");//}}}
function payloadToBytes(payload, encoding) {//{{{
    switch (encoding) {
        case "hex":
            return hexToBytes(payload);
        case "base64url":
        case "base64":
        default:
            return b64ToBytes(payload);
    };
};//}}}
function bytesToEncoding(bytes, encoding) {//{{{
    switch (encoding) {
        case "hex":
            return bytesToHex(bytes);
        case "base64url":
            return b64url(bytesToB64(bytes));
        case "base64":
        default:
            return bytesToB64(bytes);
    };
};//}}}
function typeToName(type) {//{{{
    // Best-effort filename from a MIME type, e.g. image/png → "image.png".
    const parts = String(type || "").split("/");
    if (parts.length !== 2 || ! parts[0] || ! parts[1]) return "file";
    return parts[0] + "." + parts[1];
};//}}}
function acceptFile(file, accept) {//{{{
    if (! accept) return true;
    const patterns = String(accept)
        .split(",")
        .map(s => s.trim().toLowerCase())
        .filter(Boolean);
    if (! patterns.length) return true;
    const type = String(file?.type || "").toLowerCase();
    return patterns.some(p => {
        if (p === "*/*") return !! type;
        if (p.endsWith("/*")) return type.startsWith(p.slice(0, -1));
        return type === p
            || (p.startsWith(".") && String(file?.name || "").toLowerCase().endsWith(p));
    });
};//}}}
function readFileToObject(file) {//{{{
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = String(reader.result || "");
            const comma = dataUrl.indexOf(",");
            let mime = "";
            if (comma !== -1) {
                mime = dataUrl.slice(5, comma).split(";")[0] || "";
            };
            resolve({
                name: String(file.name ?? ""),
                type: String(file.type || mime || ""),
                size: typeof file.size === "number" ? file.size : 0,
                lastModified: typeof file.lastModified === "number" ? file.lastModified : 0,
                data: comma === -1 ? "" : dataUrl.slice(comma + 1), // (internal base64)
            });
        };
        reader.onerror = () => reject(reader.error || new Error("FILE_READ_ERROR"));
        reader.readAsDataURL(file);
    });
};//}}}


// Import normalization:
// ---------------------
// Inclusive — accepts a full object, a partial object, a data-URL string, a
// bare payload string, or a JSON string describing an object.  Always
// produces a complete, normalized file object whose `data` is internal
// base64 and whose `size` is derived from the decoded payload bytes.//}}}
function normalizeDataUrl(str) {//{{{
    const comma = str.indexOf(",");
    if (comma === -1) return null;
    const header = str.slice(5, comma);
    const dataPortion = str.slice(comma + 1);
    const parts = header.split(";");
    const type = parts[0] || "";
    const params = {};
    for (const p of parts.slice(1)) {
        const eq = p.indexOf("=");
        if (eq === -1) { params[p] = true; continue; };
        params[p.slice(0, eq)] = decodeURIComponent(p.slice(eq + 1));
    };
    let bytes;
    if ("base64" in params) {
        bytes = b64ToBytes(dataPortion);
    } else {
        bytes = new TextEncoder().encode(decodeURIComponent(dataPortion));
    };
    return {
        name: params.name ?? typeToName(type),
        type,
        size: bytes.byteLength,
        lastModified: Number(params.lastModified) || 0,
        data: bytesToB64(bytes),
    };
};//}}}
function normalizePayload(obj, encoding) {//{{{
    const bytes = payloadToBytes(obj.data, encoding);
    return {
        name: String(obj.name !== undefined ? obj.name : typeToName(obj.type || "")),
        type: String(obj.type !== undefined ? obj.type : ""),
        size: bytes.byteLength,
        lastModified: Number(obj.lastModified) || Date.now(),
        data: bytesToB64(bytes),
    };
};//}}}
function normalizeImport(value, {encoding = "base64"} = {}) {//{{{
    if (value === undefined || value === null) return null;
    if (typeof value === "string") {
        const trimmed = value.trim();
        if (! trimmed) return null;
        if (trimmed.startsWith("data:")) return normalizeDataUrl(trimmed);
        const parsed = parseJSON(trimmed);
        if (parsed && typeof parsed === "object" && ! (parsed instanceof Array)) {
            return normalizeImport(parsed, {encoding});
        };
        // Bare payload string, decoded with the configured encoding:
        return normalizePayload({data: trimmed}, encoding);
    };
    if (typeof value === "object" && ! (value instanceof Array)) {
        const data = value.data;
        if (data === undefined || data === null || data === "") return null;
        return normalizePayload(value, encoding);
    };
    return null;
};//}}}


// Compute the exported representation (object or data-URL string):{{{
function computeExport(file, {format = "raw", encoding = "base64"} = {}) {
    if (! file) return null;
    const bytes = b64ToBytes(file.data);
    const name = String(file.name ?? "");
    const type = String(file.type ?? "");
    const size = bytes.byteLength; // Always recomputed from the payload
    const lastModified = Number(file.lastModified) || 0;
    if (format === "json") {
        return {
            name,
            type,
            size,
            lastModified,
            data: bytesToEncoding(bytes, encoding),
        };
    };
    // Default raw: self-describing data-URL string (payload always base64).
    return [
        "data:" + type,
        "name=" + encodeURIComponent(name),
        "size=" + size,
        "lastModified=" + lastModified,
        "base64," + bytesToB64(bytes),
    ].join(";");
};//}}}


export class file extends input {
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
                    await readFileToObject(fileItem)
                    , {silent: true}
                );
                me.targetNode.dispatchEvent(new Event("change", {bubbles: true}));
            };
            if (me.options.smark_file_drop !== false) {
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
    async isEmpty() {//{{{
        const me = this;
        if (me.isSingleton) return await me.children[""].isEmpty();
        return me._file == null;
    };//}}}
    // Batch file acquisition used by the list type (spec §10).  Opens a single
    // hidden multi-file picker; resolves to an array of normalized file objects
    // or [] when cancelled.  Only meaningful when called within a user gesture.
    static async acquire({accept, multiple, currentCount, maxItems} = {}) {//{{{
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
                    resolve(await Promise.all(files.map(readFileToObject)));
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
    static async toObjects(files, {accept} = {}) {//{{{
        const items = (files || []).filter(f => acceptFile(f, accept));
        if (! items.length) return [];
        try {
            return await Promise.all(items.map(readFileToObject));
        } catch (error) {
            return [];
        };
    };//}}}
};
