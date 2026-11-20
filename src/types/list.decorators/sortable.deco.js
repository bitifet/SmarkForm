// types/list.decorators/sortable.deco.js
// ======================================

import {mutex, sym_mutex_key} from "../../decorators/mutex.deco.js";
import {updateTriggers} from "./smartdisabling.deco.js";
import {normalizeCycle, normalizeDirection, normalizeMoveDepth} from "./move_options.js";

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
    target_list: null,   // list instance where the drop landed (different from sourceList)
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
                // moving_depth: 0 / false = disabled, true = Infinity, N = max sibling distance
                const raw = me.options.moving_depth;
                me.moving_depth = raw === true ? Infinity : (Number(raw) || 0);
                me._dragEnabled = me.sortable || me.moving_depth > 0;

                // Whether the item template resolves to a file-capable type
                // (one providing the `acquire` batch acquisition contract).
                const tplController = me.tplType ? me.types[me.tplType] : null;
                const fileCapable = !! (
                    tplController
                    && typeof tplController.acquire === "function"
                );

                // OS file-drop interception for file-capable lists.  Wired
                // OUTSIDE the _dragEnabled gate so it works automatically even
                // when the list isn't sortable (spec §10).  OS file drops never
                // collide with internal drag handling: they arrive with
                // dataTransfer.files present, while SmarkForm internal
                // reordering never populates files.  The list-level `file_drop`
                // option (default true) is the escape hatch.
                if (fileCapable) {
                    me.targetNode.addEventListener("dragover", e => e.preventDefault());
                    me.targetNode.addEventListener("drop", e => {
                        if (
                            e.dataTransfer?.files?.length > 0
                            && me.options.file_drop !== false
                        ) {
                            e.preventDefault();
                            void me._addFiles(Array.from(e.dataTransfer.files));
                        };
                    });
                };

                if (me._dragEnabled) {
                    me.templates.item.setAttribute("draggable", "true");

                    let dragSource = null;
                    let dragDest = null;
                    let _sameListPosition = "after";

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
                            _crossListDrop.target_list = null;
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
                            const targetComp = me.getComponent(target);
                            // Fall back to the source item if drop target is not a
                            // regular list item (e.g. header/footer/container).
                            const fallback = (
                                targetComp && !isNaN(Number(targetComp.name ?? ""))
                                ? target
                                : dragSource
                            );
                            const rect = fallback.getBoundingClientRect();
                            dragDest = fallback;
                            _sameListPosition = (
                                e.clientY < rect.top + rect.height / 2
                                ? "before" : "after"
                            );
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
                            // If the target is not a regular list item (e.g.
                            // header, footer, or the list container itself),
                            // insert at the end.
                            const targetName = String(targetComp?.name ?? "");
                            _crossListDrop.target_list = me;
                            _crossListDrop.to = (
                                targetComp && !isNaN(Number(targetName))
                                ? targetComp
                                : null
                            );
                            // Insert before or after based on mouse vertical
                            // position. When dropping on a non-item
                            // (to === null), always append.
                            if (_crossListDrop.to) {
                                const rect = target.getBoundingClientRect();
                                _crossListDrop.position = (
                                    e.clientY < rect.top + rect.height / 2
                                    ? "before" : "after"
                                );
                            } else {
                                _crossListDrop.position = "after";
                            }
                            // The inner list is the real drop target. Stop the
                            // event so an enclosing sortable list does not
                            // overwrite _crossListDrop with itself (which broke
                            // cross-list drags between nested lists, e.g. the
                            // school_groups showcase).
                            e.stopPropagation();
                        };
                    });
                    me.targetNode.addEventListener("dragend", async e => {
                        if (dragDest) {
                            await me.move({
                                from: me.getComponent(dragSource),
                                to: me.getComponent(dragDest),
                                position: _sameListPosition,
                            });
                            e.stopPropagation();
                        } else if (
                            _crossListDrop.target_list
                            && _crossListDrop.target_list !== me
                        ) {
                            await me.move({
                                from: me.getComponent(dragSource),
                                to: _crossListDrop.to,
                                target_list: _crossListDrop.target_list,
                                position: _crossListDrop.position,
                            });
                            e.stopPropagation();
                        };
                        dragSource = null;
                        dragDest = null;
                        _sameListPosition = "after";
                        _crossListDrop.sourceList = null;
                        _crossListDrop.target_list = null;
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
                let { from, to, target_list, position: explicitPosition } = options;
                const ongoingKey = options[sym_mutex_key];

                if (from === null) return;
                if (to === null && !target_list) return;
                if (to && Number(from.name) === Number(to.name) && (!target_list || target_list === me)) return;

                const destList = target_list || me;

                // Same-list: only allowed when sortable is enabled
                if (destList === me && !me.sortable) return;

                const srcDepthNum = me.moving_depth === true ? Infinity : (me.moving_depth || 0);
                const dstDepthNum = destList.moving_depth === true ? Infinity : (destList.moving_depth || 0);

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
                    to === undefined ? "before"
                    : destList !== me ? "after"
                    : fromi < Number(to.name) ? "after"
                    : "before"
                );

                // 1. Export item data (preserve empties)
                const data = await from.export(null, {silent: true, export_empties: true});

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
                await newItem.import(data, {silent: true, set_default: false});

                // 5. Restore focus to the moved item
                if (me.renderedSync && !options.silent) newItem?.focus();

                // 6. Refresh smart-disabled move triggers on both sides.
                await updateTriggers(me);
                if (destList !== me) await updateTriggers(destList);
            };//}}}
            _allLists() {//{{{
                // All rendered list components in document order.  Reading the
                // DOM keeps `next` / `previous` aligned with what authors and
                // keyboard users perceive as the visual order of candidates.
                const me = this;
                const root = me.root;
                const nodes = [
                    root.targetNode,
                    ...root.targetNode.querySelectorAll("[data-smark]"),
                ];
                const lists = [];
                for (const node of nodes) {
                    const comp = root.getComponent(node);
                    if (comp?._isList && ! lists.includes(comp)) lists.push(comp);
                };
                return lists;
            };//}}}
            _candidateDistance(other) {//{{{
                // `_siblingDistance` deliberately treats mixin clones of the
                // same template as distance 0 so drag can cross them even
                // without moving_depth.  For keyboard stepping, those are
                // distinct candidate lists, so expose them as distance 1.
                const me = this;
                if (other === me) return 0;
                const distance = _siblingDistance(me, other);
                if (distance !== 0) return distance;
                const tpl = me.targetNode?.dataset?.sfTpl;
                if (tpl && tpl === other.targetNode?.dataset?.sfTpl) return 1;
                return distance;
            };//}}}
            _listIsWilling(destination, depth) {//{{{
                const me = this;
                const distance = me._candidateDistance(destination);
                return (
                    distance > 0
                    && distance <= depth
                    && distance <= me.moving_depth
                    && distance <= destination.moving_depth
                    && destination.children.length < destination.max_items
                );
            };//}}}
            _moveCandidate(from, options = {}) {//{{{
                // Returns the next move described by `direction` (+1/-1), or
                // null when no destination is available.  Depth 0 is an
                // in-place reorder; depth > 0 steps to the nearest reachable
                // list in document order.
                const me = this;
                if (! from || ! me.children.includes(from)) return null;

                const depth = normalizeMoveDepth(options.depth ?? 0, me.moving_depth);
                const direction = normalizeDirection(options.direction ?? 1);
                const cycle = normalizeCycle(options.cycle);

                if (depth === 0) {
                    if (! me.sortable || me.children.length < 2) return null;
                    const index = me.children.indexOf(from);
                    let targetIndex = index + direction;
                    const wrapped = (
                        targetIndex < 0 || targetIndex >= me.children.length
                    );
                    if (wrapped) {
                        if (! cycle) return null;
                        targetIndex = (
                            direction > 0 ? 0 : me.children.length - 1
                        );
                    };
                    if (targetIndex === index) return null;
                    return {
                        list: me,
                        to: me.children[targetIndex],
                        // A wrapped forward move lands at the very top; a
                        // wrapped backward move lands at the very bottom.
                        position: (
                            wrapped
                            ? (direction > 0 ? "before" : "after")
                            : (direction > 0 ? "after" : "before")
                        ),
                    };
                };

                const lists = me._allLists();
                const anchor = lists.indexOf(me);
                if (anchor < 0) return null;

                const scan = (start) => {
                    for (
                        let index = start;
                        index >= 0 && index < lists.length;
                        index += direction
                    ) {
                        const destination = lists[index];
                        if (
                            destination !== me
                            && me._listIsWilling(destination, depth)
                        ) return {
                            list: destination,
                            to: null,
                            position: "after",
                        };
                    };
                    return null;
                };

                return (
                    scan(anchor + direction)
                    || (cycle
                        ? scan(direction > 0 ? 0 : lists.length - 1)
                        : null)
                );
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
 * This is used by the cross-list drag guard to enforce the `moving_depth`
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
    // Allow cross-list drag when both lists share the same mixin template
    // (identified by data-sf-tpl set on the template root before cloning).
    const aTpl = a.targetNode?.dataset?.sfTpl;
    const bTpl = b.targetNode?.dataset?.sfTpl;
    if (aTpl && bTpl && aTpl === bTpl) return 0;
    if (isNaN(Number(aName)) || isNaN(Number(bName))) return Infinity;

    return aPath.length - i;
};
