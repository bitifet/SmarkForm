// types/list.decorators/move_options.js
// =====================================

// Shared normalizers for the list `next` / `previous` actions and their
// smart-disabled triggers.  Prefixed `data-smark-*` options arrive as strings,
// so every consumer must interpret them identically.

export function normalizeMoveDepth(value, limit = Infinity) {//{{{
    if (value === true || value === "true") return Infinity;
    const depth = Number(value);
    if (! Number.isFinite(depth) || depth < 0) return 0;
    return (
        Number.isFinite(limit)
        ? Math.min(depth, limit)
        : depth
    );
};//}}}

export function normalizeCycle(value) {//{{{
    return (
        value === true
        || value === "true"
        || value === 1
        || value === "1"
    );
};//}}}

export function normalizeDirection(value) {//{{{
    return Number(value) < 0 ? -1 : 1;
};//}}}
