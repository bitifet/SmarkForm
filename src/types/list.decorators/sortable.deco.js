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
                                if (!lastMousedownTarget?.closest(SMARK_LABEL_SELECTOR)) {
                                    e.preventDefault();
                                    return;
                                };
                                // Block drag when the pointer went down on an
                                // interactive control even if it is nested inside
                                // the label handle (e.g. an <input> or <button>
                                // inside a <summary data-smark-label>).
                                if (lastMousedownTarget?.closest(INTERACTIVE_FIELDS_SELECTOR)) {
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
                            // Focus the dragged item so it is clearly
                            // selected and keyboard interaction remains
                            // consistent after the drop.
                            me.getComponent(dragSource)?.focus();

                            // Use the <summary> row (compact header) as the drag
                            // ghost image when one is present.  This produces a
                            // consistently-sized ghost regardless of whether the
                            // item is currently folded or unfolded — avoiding the
                            // browser quirk where a closed <details> inside the
                            // draggable <li> can still inflate the ghost to the
                            // open layout dimensions.
                            const _ghostEl = itemRoot.querySelector('summary') || itemRoot;
                            e.dataTransfer.setDragImage(
                                _ghostEl,
                                Math.min(e.offsetX ?? 16, _ghostEl.offsetWidth  - 4),
                                Math.round(_ghostEl.offsetHeight / 2),
                            );
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
 * label handles.  The recommended drag-handle pattern is to use the <summary>
 * element itself as the SmarkForm label:
 *   <summary data-smark='{"type":"label"}'>
 * This lets the entire summary row act as the drag handle while interactive
 * descendants (inputs, buttons) are excluded by the dragstart guard.  The
 * <summary> also provides the native disclosure triangle and fold/unfold on
 * click, so no additional CSS workarounds are needed for those features.
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
