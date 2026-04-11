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
                    // Mark item template as draggable so that items cloned
                    // from it start with draggable=true (overridden by
                    // _applyDraggable once the item is fully rendered).
                    me.templates.item.setAttribute("draggable", "true");

                    let dragSource = null;
                    let dragDest = null;
                    me.targetNode.addEventListener("dragstart", e => {
                        if (dragSource === null) {
                            // Resolve dragSource to the item root (direct
                            // child of the list container), even when the
                            // drag started from a label handle.
                            let itemRoot = e.target;
                            while (
                                itemRoot.parentElement
                                && itemRoot.parentElement !== me.targetNode
                            ) {
                                itemRoot = itemRoot.parentElement;
                            };

                            // Guard: if using label handles, do not start
                            // drag from interactive fields.
                            const handles = itemRoot.querySelectorAll(SMARK_LABEL_SELECTOR);
                            if (handles.length > 0) {
                                if (e.target.closest(INTERACTIVE_FIELDS_SELECTOR)) {
                                    e.preventDefault();
                                    return;
                                };
                            };

                            dragSource = itemRoot;

                            // Use the whole item as the drag image so the
                            // user sees the full row being moved rather than
                            // just the handle element.
                            try {
                                const rect = dragSource.getBoundingClientRect();
                                e.dataTransfer.setDragImage(
                                    dragSource,
                                    e.clientX - rect.left,
                                    e.clientY - rect.top,
                                );
                            } catch (_e) { /* setDragImage not available */ };

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
                // Re-apply draggable handles after every structural change.
                // renum() is always called after items are fully rendered, so
                // data-smark-label is guaranteed to be set by this point.
                if (me.sortable) {
                    me.children.forEach(c => _applyDraggable(me, c.targetNode));
                };
                return result;
            };//}}}
        };
    };
};

/**
 * Apply draggable attribute to the appropriate node(s) for a list item.
 *
 * If the item contains SmarkForm label components (marked with
 * [data-smark-label]), those labels become the drag handles and the item root
 * is made non-draggable, restoring normal text selection inside input fields.
 *
 * If no label handles are found, the item root itself is made draggable
 * (backward-compatible fallback).
 */
function _applyDraggable(me, itemRoot) {
    const handles = itemRoot.querySelectorAll(SMARK_LABEL_SELECTOR);
    if (handles.length > 0) {
        itemRoot.setAttribute("draggable", "false");
        handles.forEach(h => {
            h.setAttribute("draggable", "true");
            _applyCursorGrab(h);
        });
    } else {
        itemRoot.setAttribute("draggable", "true");
    };
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
