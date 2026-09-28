// lib/options.js
// ==============
// Option value normalization helpers.
//
// SmarkForm options usually come from the JSON object in a `data-smark`
// attribute, so they already have the right type.  With the alternative
// `data-smark-<option>` attribute syntax every value arrives as a raw string.
// These helpers coerce strings to the type each option expects while leaving
// non-string values untouched, so existing JSON-based usage is unaffected.

export function normalizeBoolean(value, defaultValue = undefined) {//{{{
    if (value === undefined) return defaultValue;
    if (typeof value !== "string") return value;
    const trimmed = value.trim().toLowerCase();
    if (trimmed === "" || trimmed === "true") return true;
    if (trimmed === "false") return false;
    return value;
};//}}}

export function normalizeNumber(value, {allowInfinity = false, defaultValue = undefined} = {}) {//{{{
    if (value === undefined) return defaultValue;
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    if (allowInfinity && trimmed.toLowerCase() === "infinity") return Infinity;
    if (allowInfinity && trimmed.toLowerCase() === "-infinity") return -Infinity;
    const num = Number(trimmed);
    return Number.isNaN(num) ? value : num;
};//}}}

// For options that expect objects or arrays.  If the value is a string, try
// to parse it as JSON; if parsing fails, return the raw string so the caller
// can apply its own fallback (e.g. comma-splitting for arrays).
export function normalizeJson(value, defaultValue = undefined) {//{{{
    if (value === undefined) return defaultValue;
    if (typeof value !== "string") return value;
    try {
        return JSON.parse(value);
    } catch (_e) {
        return value;
    };
};//}}}

// For options that expect arrays.  Order of precedence:
// 1. Non-string value → returned as-is.
// 2. JSON string that parses to an array → returned as-is.
// 3. Comma-separated string → split, trim, keep empty items only when the
//    original item was non-empty (so "a,,b" yields ["a","b"]).
// 4. Any other string / JSON value → wrapped in a single-element array.
export function normalizeArray(value, {sep = ",", defaultValue = undefined} = {}) {//{{{
    if (value === undefined) return defaultValue;
    if (typeof value !== "string") return value;
    const parsed = normalizeJson(value);
    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed !== "string") return [parsed];
    const parts = parsed.split(sep).map(s => s.trim()).filter(s => s.length > 0);
    if (parts.length === 0) return [parsed];
    return parts;
};//}}}

// Normalize the special `autoId` sentinel: false/true/string/function.
// Function values cannot be represented in HTML attributes and are preserved
// as-is; strings "false" and "true" are converted to their boolean forms.
export function normalizeAutoId(value) {//{{{
    if (typeof value !== "string") return value;
    const trimmed = value.trim().toLowerCase();
    if (trimmed === "false") return false;
    if (trimmed === "true") return true;
    return value;
};//}}}

// Normalize the `placeholder` sentinel.  The string "false" means "leave the
// media src/poster empty"; any other string is used as-is.
export function normalizePlaceholder(value) {//{{{
    if (typeof value !== "string") return value;
    if (value.trim().toLowerCase() === "false") return false;
    return value;
};//}}}

// Normalize a box-shaped option such as `image_resize` or `image_maxSize`.
// These accept a bare number (square box), a `[w,h]` array, or a
// `{width,height}` object.  From an HTML attribute they may be given as:
//   - a JSON string: "[200,200]" or "{\"width\":200,\"height\":200}"
//   - a comma-separated pair: "200,200"
//   - a bare number: "200"
export function normalizeBoxOption(value) {//{{{
    const parsed = normalizeJson(value);
    if (parsed !== value) return parsed;
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    if (/^\d+$/.test(trimmed)) return Number(trimmed);
    const parts = trimmed
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0);
    if (parts.length === 2 && parts.every(p => /^\d+$/.test(p))) {
        return parts.map(Number);
    }
    return value;
};//}}}

// Names of options whose values are booleans.  These are normalized so that
// bare attributes (e.g. `data-smark-sortable`) mean `true`, and the string
// "false" means `false`.
const BOOLEAN_OPTIONS = new Set([
    "allow_select",
    "enableJsonEncoding",
    "excludeEmpties",
    "exportEmpties",
    "fileDrop",
    "focus_on_click",
    "multiple",
    "sortable",
    // smark_* toggles
    "smark_audio_autoPick",
    "smark_audio_clearOnDelete",
    "smark_audio_drop",
    "smark_audio_open",
    "smark_audio_paste",
    "smark_audio_validate",
    "smark_file_drop",
    "smark_file_open",
    "smark_file_paste",
    "smark_image_clearOnDelete",
    "smark_image_drop",
    "smark_image_open",
    "smark_image_paste",
    "smark_image_validate",
    "smark_mask_throwOnMissing",
    "smark_video_autoPick",
    "smark_video_clearOnDelete",
    "smark_video_drop",
    "smark_video_open",
    "smark_video_paste",
    "smark_video_validate",
]);

// Names of options whose values are numbers.  `movingDepth` and `max_items`
// also accept the strings "true"/"Infinity" (mapped to Infinity) because
// they double as unlimited-distance / unlimited-capacity sentinels.
const NUMBER_OPTIONS = new Set([
    "audio_maxSize",
    "max_items",
    "min_items",
    "movingDepth",
    "offset",
    "video_maxSize",
]);
const INFINITY_NUMBER_OPTIONS = new Set([
    "max_items",
    "movingDepth",
]);

// Apply centralized normalization to an options object in-place.
// Component-specific structured options (image_resize, image_maxSize, ...)
// are left to the components that consume them.
export function normalizeCommonOptions(options) {//{{{
    for (const key of Object.keys(options)) {
        const value = options[key];
        if (BOOLEAN_OPTIONS.has(key)) {
            options[key] = normalizeBoolean(value);
        } else if (NUMBER_OPTIONS.has(key)) {
            options[key] = normalizeNumber(value, {
                allowInfinity: INFINITY_NUMBER_OPTIONS.has(key),
            });
        } else if (key === "autoId") {
            options[key] = normalizeAutoId(value);
        } else if (key === "placeholder") {
            options[key] = normalizePlaceholder(value);
        } else if (key === "image_resize" || key === "image_maxSize") {
            options[key] = normalizeBoxOption(value);
        }
    }
    return options;
};//}}}
