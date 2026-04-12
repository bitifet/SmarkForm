// types/list.decorators/sortable.deco.js
// ======================================

import {mutex} from "../../decorators/mutex.deco.js";

// Selector for interactive fields where a drag should not start.
const INTERACTIVE_FIELDS_SELECTOR = "input, textarea, select, button, a, [contenteditable='true']";

// Selector for SmarkForm label components (marked during render).
const SMARK_LABEL_SELECTOR = "[data-smark-label]";

export const sortable = function list_sortable_decorator(target, {kind}) {
    if (kind == "class") {
        return class sortableTarget extends target {
            async render(...args) {//{{{
                const retv = await super.render(...args);
                const me = this;

                me.sortable = !! me.options.sortable;
                if (me.sortable) {
                    // The item template (and all cloned items) are draggable.
                    // _applyDraggable re-confirms this and applies cursor hints.
                    me.templates.item.setAttribute("draggable", "true");

                    let dragSource = null;
                    let dragDest = null;

                    // Track the last mousedown target so we can validate the
                    // drag origin in dragstart (e.target is always the item
                    // root when the whole <li> is draggable).
                    let lastMousedownTarget = null;
                    me.targetNode.addEventListener("mousedown", e => {
                        lastMousedownTarget = e.target;
                    }, { capture: true, passive: true });

                    me.targetNode.addEventListener("dragstart", e => {
                        if (dragSource === null) {
                            // Resolve dragSource to the item root (direct
                            // child of the list container).
                            let itemRoot = e.target;
                            while (
                                itemRoot.parentElement
                                && itemRoot.parentElement !== me.targetNode
                            ) {
                                itemRoot = itemRoot.parentElement;
                            };

                            const handles = itemRoot.querySelectorAll(SMARK_LABEL_SELECTOR);
                            if (handles.length > 0) {
                                // Label handles are present: only allow drag
                                // when the pointer went down on a handle.
                                // This lets clicks on the label bubble up to
                                // <summary> for normal fold/unfold behaviour.
                                if (!lastMousedownTarget?.closest(SMARK_LABEL_SELECTOR)) {
                                    e.preventDefault();
                                    return;
                                };
                            } else {
                                // No handles: backward-compatible behaviour —
                                // block drag originating from interactive
                                // controls so text selection still works.
                                if (lastMousedownTarget?.closest(INTERACTIVE_FIELDS_SELECTOR)) {
                                    e.preventDefault();
                                    return;
                                };
                            };

                            dragSource = itemRoot;
                            e.stopPropagation();
                        } else {
                            // Single dragging at a time.
                            e.preventDefault();
                        };
                    });
                    me.targetNode.addEventListener("dragover", e => e.preventDefault());
                    me.targetNode.addEventListener("drop", e => {
                        if (! dragSource) return; // Already dropped
                        let target = e.target;
                        while (
                            target.parentElement
                            && target.parentElement != dragSource.parentElement
                        ) target = target.parentElement;
                        dragDest = target;
                    });
                    me.targetNode.addEventListener("dragend", async () => {
                        if (dragDest)  await me.move({
                            from: me.getComponent(dragSource),
                            to: me.getComponent(dragDest),
                        });
                        dragSource = null;
                        dragDest = null;
                    });
                } else {
                    me.templates.item.setAttribute("draggable", "false");
                };

                return retv;
            };//}}}
            @mutex("list_mutating")
            async move(options = {}) {//{{{
                const me = this;
                let {
                    from,
                    to,
                } = options;

                // // FIXME: Avoid nested sortables to interact.
                // console.log({from, to}); // <--- See this!!!

                //
                // TODO: Convert to action!!!
                //
                if (
                    to === null // Dropped outside
                    || from === null // (Shouldn't happen)
                ) return;
                const fromi = Number(from?.name);
                const toi = Number(to?.name);
                if (fromi == toi) {
                    return;
                } else if (fromi < toi) {
                    const newChunk = [
                        ...me.children.slice(fromi + 1, toi + 1),
                        me.children[fromi],
                    ];
                    me.children.splice(fromi, toi - fromi + 1, ...newChunk);
                } else if (fromi > toi) {
                    const newChunk = [
                        me.children[fromi],
                        ...me.children.slice(toi, fromi),
                    ];
                    me.children.splice(toi, fromi - toi + 1, ...newChunk);
                };
                const inc = fromi < toi ? 1 : -1;
                const moveMethod = inc > 0 ? "after" : "before";
                to.targetNode[moveMethod](from.targetNode);
                me.renum();
            };//}}}
            async renum() {//{{{
                const me = this;
                const result = await super.renum();
                // Re-apply draggable/cursor hints after every structural
                // change. renum() is always called after items are fully
                // rendered so data-smark-label is guaranteed to be set.
                if (me.sortable) {
                    me.children.forEach(c => _applyDraggable(me, c.targetNode));
                };
                return result;
            };//}}}
        };
    };
};

/**
 * Ensure the item root is draggable and apply cursor hints to any label
 * handles inside it.
 *
 * The item root (<li>) is always the draggable element — NOT the individual
 * label handles.  Label handles MUST be non-interactive elements (e.g.
 * <span data-smark='{"type":"label"}'>) rather than native <label> elements.
 * Per the HTML spec, native <label> is "interactive content", and browsers
 * suppress the <details> toggle when a click target is interactive content
 * inside <summary>.  A plain <span> is non-interactive, so clicks on it
 * bubble normally to <summary> and toggle <details>.
 *
 * Origin validation (restrict drag to handle / block interactive fields) is
 * done in the dragstart listener via the lastMousedownTarget tracker.
 *
 * Items with no label handles retain the original whole-item-draggable
 * behaviour (backward-compatible).
 */
function _applyDraggable(me, itemRoot) {
    // Item root is always the draggable element.
    itemRoot.setAttribute("draggable", "true");
    // Apply grab cursor to any label handles as a visual hint.
    const handles = itemRoot.querySelectorAll(SMARK_LABEL_SELECTOR);
    handles.forEach(h => _applyCursorGrab(h));
};

/**
 * Set cursor:grab on a drag-handle element unless the cursor has already
 * been explicitly customised via an inline style or a CSS rule other than
 * the browser default.
 */
function _applyCursorGrab(handle) {
    if (handle.style.cursor) return; // inline style already set — don't override
    try {
        const computed = getComputedStyle(handle).cursor;
        if (computed === "auto" || computed === "default") {
            handle.style.cursor = "grab";
        };
    } catch (_e) {
        // Not in a browser context (e.g. unit-test environment) — skip.
    };
};
