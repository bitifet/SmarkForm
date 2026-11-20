// types/list.decorators/move_options.js
// =====================================

// Shared normalizers for list movement decorators. Prefixed `data-smark-*`
// options arrive as strings, so every consumer must interpret them identically.

export function normalizeMoveDepth(value) {//{{{
    if (value === true || value === "true") return Infinity;
    const depth = Number(value);
    if (! Number.isFinite(depth) || depth < 0) return 0;
    return depth;
};//}}}

export function normalizeDirection(value) {//{{{
    return Number(value) < 0 ? -1 : 1;
};//}}}
