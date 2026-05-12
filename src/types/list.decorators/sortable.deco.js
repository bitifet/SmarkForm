// types/list.decorators/sortable.deco.js
// ======================================

import {mutex, sym_mutex_key} from "../../decorators/mutex.deco.js";

// Selector for interactive fields where a drag should not start.
const INTERACTIVE_FIELDS_SELECTOR = "input, textarea, select, button, a, [contenteditable='true']";

// Selector for SmarkForm label components (marked during render).
const SMARK_LABEL_SELECTOR = "[data-smark-label]";

// Module-level cross-list drag state.  Set by the source list during
// dragstart, extended by the target list during drop, consumed by the
// source list during dragend.  Only one native drag can be active at a
// time, so a single shared object is safe.
let _crossListDrop = {
    sourceList: null,   // list instance that initiated the drag
    targetList: null,   // list instance where the drop landed (different from sourceList)
    to: null,           // target component in the destination list (null = append)
    position: "after",  // "before" or "after" relative to `to`
};

export const sortable = function list_sortable_decorator(target, {kind}) {
    if (kind == "class") {
        return class sortableTarget extends target {
            async render(...args) {//{{{
                const retv = await super.render(...args);
                const me = this;

                me.sortable = !!me.options.sortable;
                // movingDepth: 0 / false = disabled, true = Infinity, N = max sibling distance
                const raw = me.options.movingDepth;
                me.movingDepth = raw === true ? Infinity : (Number(raw) || 0);
                me._dragEnabled = me.sortable || me.movingDepth > 0;

                if (me._dragEnabled) {
                    me.templates.item.setAttribute("draggable", "true");

                    let dragSource = null;
                    let dragDest = null;

                    let lastMousedownTarget = null;
                    me.targetNode.addEventListener("mousedown", e => {
                        lastMousedownTarget = e.target;
                    }, { capture: true, passive: true });

                    me.targetNode.addEventListener("dragstart", e => {
                        if (dragSource === null) {
                            let itemRoot = e.target;
                            while (
                                itemRoot.parentElement
                                && itemRoot.parentElement !== me.targetNode
                            ) {
                                itemRoot = itemRoot.parentElement;
                            };

                            const handles = itemRoot.querySelectorAll(SMARK_LABEL_SELECTOR);
                            if (handles.length > 0) {
                                if (!lastMousedownTarget?.closest(SMARK_LABEL_SELECTOR)) {
                                    e.preventDefault();
                                    return;
                                };
                                if (lastMousedownTarget?.closest(INTERACTIVE_FIELDS_SELECTOR)) {
                                    e.preventDefault();
                                    return;
                                };
                            } else {
                                if (lastMousedownTarget?.closest(INTERACTIVE_FIELDS_SELECTOR)) {
                                    e.preventDefault();
                                    return;
                                };
                            };

                            dragSource = itemRoot;
                            _crossListDrop.sourceList = me;
                            _crossListDrop.targetList = null;
                            e.stopPropagation();
                            me.getComponent(dragSource)?.focus();

                            const _ghostEl = itemRoot.querySelector('summary') || itemRoot;
                            e.dataTransfer.setDragImage(
                                _ghostEl,
                                Math.min(e.offsetX ?? 16, _ghostEl.offsetWidth  - 4),
                                Math.round(_ghostEl.offsetHeight / 2),
                            );
                        } else {
                            e.preventDefault();
                        };
                    });
                    me.targetNode.addEventListener("dragover", e => e.preventDefault());
                    me.targetNode.addEventListener("drop", e => {
                        if (dragSource) {
                            let target = e.target;
                            while (
                                target.parentElement
                                && target.parentElement != dragSource.parentElement
                            ) target = target.parentElement;
                            dragDest = target;
                            e.stopPropagation();
                        } else if (
                            _crossListDrop.sourceList
                            && _crossListDrop.sourceList !== me
                        ) {
                            let target = e.target;
                            while (
                                target.parentElement
                                && target.parentElement !== me.targetNode
                            ) target = target.parentElement;
                            const targetComp = (
                                target !== me.targetNode
                                ? me.getComponent(target)
                                : null
                            );
                            _crossListDrop.targetList = me;
                            _crossListDrop.to = targetComp;
                            _crossListDrop.position = targetComp ? "before" : "after";
                            e.stopPropagation();
                        };
                    });
                    me.targetNode.addEventListener("dragend", async e => {
                        if (dragDest) {
                            await me.move({
                                from: me.getComponent(dragSource),
                                to: me.getComponent(dragDest),
                            });
                            e.stopPropagation();
                        } else if (
                            _crossListDrop.targetList
                            && _crossListDrop.targetList !== me
                        ) {
                            await me.move({
                                from: me.getComponent(dragSource),
                                to: _crossListDrop.to,
                                targetList: _crossListDrop.targetList,
                                position: _crossListDrop.position,
                            });
                            e.stopPropagation();
                        };
                        dragSource = null;
                        dragDest = null;
                        _crossListDrop.sourceList = null;
                        _crossListDrop.targetList = null;
                        _crossListDrop.to = null;
                        _crossListDrop.position = "after";
                    });
                } else {
                    me.templates.item.setAttribute("draggable", "false");
                };

                return retv;
            };//}}}
            @mutex("list_mutating")
            async move(options = {}) {//{{{
                const me = this;
                let { from, to, targetList, position: explicitPosition } = options;
                const ongoingKey = options[sym_mutex_key];

                if (from === null) return;
                if (to === null && !targetList) return;
                if (to && Number(from.name) === Number(to.name) && (!targetList || targetList === me)) return;

                const destList = targetList || me;

                // Same-list: only allowed when sortable is enabled
                if (destList === me && !me.sortable) return;

                const srcDepthNum = me.movingDepth === true ? Infinity : (me.movingDepth || 0);
                const dstDepthNum = destList.movingDepth === true ? Infinity : (destList.movingDepth || 0);

                // Cross-list: enforce sibling distance limits
                if (destList !== me) {
                    const dist = _siblingDistance(me, destList);
                    if (dist > srcDepthNum || dist > dstDepthNum) return;
                    // Force append when destination is not sortable
                    if (!destList.sortable) {
                        to = null;
                        explicitPosition = "after";
                    };
                };

                const fromi = Number(from.name);
                const position = explicitPosition || (
                    to !== undefined && fromi < Number(to.name) ? "after" : "before"
                );

                // 1. Export item data (preserve empties)
                const data = await from.export(null, {silent: true, exportEmpties: true});

                // 2. Remove from source
                await me.removeItem(null, {
                    target: from,
                    silent: true,
                    focus: false,
                    failback: "none",
                    [sym_mutex_key]: ongoingKey,
                });

                // 3. Insert into destination
                const newItem = await destList.addItem(null, {
                    target: to,
                    position,
                    silent: true,
                    focus: false,
                    ...(destList === me ? { [sym_mutex_key]: ongoingKey } : {}),
                });

                // 4. Restore data into the new item
                await newItem.import(data, {silent: true, setDefault: false});

                // 5. Restore focus to the moved item
                if (me.renderedSync && !options.silent) newItem?.focus();
            };//}}}
            async renum() {//{{{
                const me = this;
                const result = await super.renum();
                if (me._dragEnabled) {
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

/**
 * Compute the sibling distance between two components in the component tree.
 *
 * Distance is the number of levels remaining from the first divergent ancestor
 * pair that both have numeric names (i.e. are list items). Components in the
 * same list have distance 0. Components whose ancestor paths have different
 * lengths, or whose first divergent ancestors are not both list items, are
 * considered incompatible (returns Infinity).
 *
 * This is used by the cross-list drag guard to enforce the `movingDepth`
 * limit on both source and destination lists.
 */
function _siblingDistance(a, b) {
    if (a === b) return 0;

    function ancestors(comp) {
        const path = [];
        let c = comp;
        while (c) {
            path.unshift(c);
            c = c.parent;
        };
        return path;
    };

    const aPath = ancestors(a);
    const bPath = ancestors(b);

    if (aPath.length !== bPath.length) return Infinity;

    let i = 0;
    while (i < aPath.length && aPath[i] === bPath[i]) i++;
    if (i === aPath.length) return 0;

    const aName = String(aPath[i].name ?? "");
    const bName = String(bPath[i].name ?? "");
    if (isNaN(Number(aName)) || isNaN(Number(bName))) return Infinity;

    return aPath.length - i;
};
