// types/list.decorators/move_options.js
// =====================================

// Shared normalizers for list movement decorators. Prefixed `data-smark-*`
// options arrive as strings, so every consumer must interpret them identically.

export function normalizeMoveDepth(value) {//{{{
    const depth = (
        typeof value === "number" ? value
        : typeof value === "string" && value.trim() !== "" ? Number(value)
        : NaN
    );
    if (! Number.isFinite(depth) || depth < 0) return null;
    return depth;
};//}}}

export function normalizeDirection(value) {//{{{
    return Number(value) < 0 ? -1 : 1;
};//}}}
