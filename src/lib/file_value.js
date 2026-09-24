// Shared file-value encoding, normalization, and export helpers.
import {parseJSON} from "./helpers.js";

// The component's interior state always stores `data` as plain *base64*.
export function b64ToBytes(b64) {
    const bin = atob(String(b64).replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
};
export function bytesToB64(bytes) {
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
};
export function bytesToHex(bytes) {
    let out = "";
    for (let i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, "0");
    return out;
};
export function hexToBytes(hex) {
    const h = String(hex).replace(/\s+/g, "");
    const bytes = new Uint8Array(h.length >> 1);
    for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(h.substr(i * 2, 2), 16);
    return bytes;
};
export const b64url = s => s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
export function payloadToBytes(payload, encoding) {
    switch (encoding) {
        case "hex":
            return hexToBytes(payload);
        case "base64url":
        case "base64":
        default:
            return b64ToBytes(payload);
    };
};
export function bytesToEncoding(bytes, encoding) {
    switch (encoding) {
        case "hex":
            return bytesToHex(bytes);
        case "base64url":
            return b64url(bytesToB64(bytes));
        case "base64":
        default:
            return bytesToB64(bytes);
    };
};
export function typeToName(type) {
    const parts = String(type || "").split("/");
    if (parts.length !== 2 || ! parts[0] || ! parts[1]) return "file";
    return parts[0] + "." + parts[1];
};
export function acceptFile(file, accept) {
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
};
export function readFileToObject(file, {encoding} = {}) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = String(reader.result || "");
            const comma = dataUrl.indexOf(",");
            let mime = "";
            if (comma !== -1) mime = dataUrl.slice(5, comma).split(";")[0] || "";
            const obj = {
                name: String(file.name ?? ""),
                type: String(file.type || mime || ""),
                size: typeof file.size === "number" ? file.size : 0,
                lastModified: typeof file.lastModified === "number" ? file.lastModified : 0,
                data: comma === -1 ? "" : dataUrl.slice(comma + 1),
            };
            if (encoding && encoding !== "base64") {
                obj.data = bytesToEncoding(b64ToBytes(obj.data), encoding);
            };
            resolve(obj);
        };
        reader.onerror = () => reject(reader.error || new Error("FILE_READ_ERROR"));
        reader.readAsDataURL(file);
    });
};
export function normalizeDataUrl(str) {
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
    if ("base64" in params) bytes = b64ToBytes(dataPortion);
    else bytes = new TextEncoder().encode(decodeURIComponent(dataPortion));
    return {
        name: params.name ?? typeToName(type),
        type,
        size: bytes.byteLength,
        lastModified: Number(params.lastModified) || 0,
        data: bytesToB64(bytes),
    };
};
export function normalizePayload(obj, encoding) {
    const bytes = payloadToBytes(obj.data, encoding);
    return {
        name: String(obj.name !== undefined ? obj.name : typeToName(obj.type || "")),
        type: String(obj.type !== undefined ? obj.type : ""),
        size: bytes.byteLength,
        lastModified: Number(obj.lastModified) || Date.now(),
        data: bytesToB64(bytes),
    };
};

export const URL_IMPORT_RE = /^(?:[a-z][a-z0-9+.-]*:|\/|\.{1,2}\/)/i;
export function urlName(url, type) {
    const clean = String(url).split(/[?#]/)[0];
    const scheme = clean.match(/^[a-z][a-z0-9+.-]*:/i);
    const schemeRest = scheme ? clean.slice(scheme[0].length) : clean;
    let path = clean;
    if (schemeRest.startsWith("//")) {
        const slash = schemeRest.indexOf("/", 2);
        path = slash === -1 ? "" : schemeRest.slice(slash);
    };
    let segment = "";
    const raw = path.split("/").filter(Boolean).pop() || "";
    try { segment = decodeURIComponent(raw); } catch (_) { segment = raw; };
    if (segment && /\.\w+$/.test(segment)) return segment;
    return typeToName(type);
};
export async function fetchUrlToFileObject(url) {
    const response = await fetch(url);
    if (! response.ok) throw new Error("HTTP " + response.status);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = String(reader.result || "");
            const comma = dataUrl.indexOf(",");
            const mime = comma === -1 ? "" : dataUrl.slice(5, comma).split(";")[0] || "";
            resolve({
                name: urlName(url, blob.type || mime),
                type: String(blob.type || mime || ""),
                size: typeof blob.size === "number" ? blob.size : 0,
                lastModified: Date.now(),
                data: comma === -1 ? "" : dataUrl.slice(comma + 1),
            });
        };
        reader.onerror = () => reject(reader.error || new Error("URL_FETCH_READ_ERROR"));
        reader.readAsDataURL(blob);
    });
};
export async function normalizeImport(value, {encoding = "base64"} = {}) {
    if (value === undefined || value === null) return null;
    if (typeof value === "string") {
        const trimmed = value.trim();
        if (! trimmed) return null;
        if (trimmed.startsWith("data:")) return normalizeDataUrl(trimmed);
        if (URL_IMPORT_RE.test(trimmed)) {
            try { return await fetchUrlToFileObject(trimmed); }
            catch (error) {
                console.warn(
                    "SmarkForm: could not import URL value "
                    + JSON.stringify(trimmed) + ": " + (error?.message || error)
                );
                return null;
            };
        };
        const parsed = parseJSON(trimmed);
        if (parsed && typeof parsed === "object" && ! (parsed instanceof Array)) {
            return normalizeImport(parsed, {encoding});
        };
        return normalizePayload({data: trimmed}, encoding);
    };
    if (typeof value === "object" && ! (value instanceof Array)) {
        const data = value.data;
        if (data === undefined || data === null || data === "") return null;
        return normalizePayload(value, encoding);
    };
    return null;
};
export function computeExport(file, {format = "raw", encoding = "base64"} = {}) {
    if (! file) return null;
    const bytes = b64ToBytes(file.data);
    const name = String(file.name ?? "");
    const type = String(file.type ?? "");
    const size = bytes.byteLength;
    const lastModified = Number(file.lastModified) || 0;
    if (format === "json") {
        return {name, type, size, lastModified, data: bytesToEncoding(bytes, encoding)};
    };
    return [
        "data:" + type,
        "name=" + encodeURIComponent(name),
        "size=" + size,
        "lastModified=" + lastModified,
        "base64," + bytesToB64(bytes),
    ].join(";");
};
export function downloadFileObject(file, {filename, fallbackFilename = "file"} = {}) {
    if (! file) return null;
    const type = file.type || "application/octet-stream";
    const blob = new Blob([b64ToBytes(file.data)], {type});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename || file.name || fallbackFilename;
    document.body.appendChild(anchor);
    try { anchor.click(); }
    finally {
        anchor.remove();
        setTimeout(() => URL.revokeObjectURL(url), 0);
    };
    return url;
};
