// types/list.decorators/move_actions.deco.js
// ==========================================

import {action} from "../trigger.type.js";
import {mutex, sym_mutex_key} from "../../decorators/mutex.deco.js";
import {setTabIndex} from "../../lib/helpers.js";
import {siblingDistance} from "./sortable.deco.js";
import {normalizeDirection, normalizeMoveDepth} from "./move_options.js";

function selectedItem(list, target) {//{{{
    if (Array.isArray(target)) target = target[0];
    return list.children.find(child => (
        child === target
        || (
            target?.targetNode
            && child.targetNode.contains(target.targetNode)
        )
    )) || null;
};//}}}

async function moveByDirection(list, direction, options) {//{{{
    const from = selectedItem(list, options.target);
    const candidate = list._moveCandidate(from, {
        depth: normalizeMoveDepth(options.depth ?? 0),
        direction: normalizeDirection(direction),
    });
    if (! candidate) return;
    return await list.move({
        from,
        to: candidate.to,
        target_list: candidate.list,
        position: candidate.position,
        focus: options.focus,
        silent: options.silent,
        [sym_mutex_key]: options[sym_mutex_key],
    });
};//}}}

/**
 * Add keyboard/action-based item movement to a list class. Drag-and-drop stays
 * in `sortable`; this decorator uses the same `move()` operation for transfers
 * while keeping candidate discovery and trigger state separate from it.
 */
export const moveActions = function list_move_actions_decorator(target, {kind}) {
    if (kind == "class") return class listMoveActions extends target {
        constructor(...args) {
            super(...args);
            this._isList = true;
        };
        async render(...args) {//{{{
            const retv = await super.render(...args);
            this._isList = true;
            await this._refreshMovementTriggers();
            return retv;
        };//}}}
        onTriggerRender(args) {//{{{
            const retv = super.onTriggerRender(args);
            const {action: actionName, origin, context} = args;
            if (
                (actionName == "next" || actionName == "previous")
                && (1 + [...origin.parents].findIndex(p=>Object.is(p, context)))
                && origin.options.hotkey
            ) {
                // Hotkey-only list-item actions should not add another Tab stop.
                setTabIndex(origin.targetNode);
            };
            return retv;
        };//}}}
        _allLists() {//{{{
            // Keep candidate order aligned with the rendered/component order.
            const root = this.root;
            const nodes = [
                root.targetNode,
                ...root.targetNode.querySelectorAll("[data-smark]"),
            ];
            const lists = [];
            for (const node of nodes) {
                const component = root.getComponent(node);
                if (component?._isList && ! lists.includes(component)) {
                    lists.push(component);
                };
            };
            return lists;
        };//}}}
        _candidateDistance(other) {//{{{
            if (other === this) return 0;
            const distance = siblingDistance(this, other);
            if (distance !== 0) return distance;

            // Drag treats clones of the same mixin as distance zero. For the
            // explicit keyboard step, distinct columns are one candidate step
            // away and still require positive `moving_depth` on both lists.
            const templateId = this.targetNode?.dataset?.sfTpl;
            if (templateId && templateId === other.targetNode?.dataset?.sfTpl) {
                return 1;
            };
            return distance;
        };//}}}
        _listIsWilling(destination, depth) {//{{{
            const distance = this._candidateDistance(destination);
            return (
                distance > 0
                && distance <= depth
                && distance <= this.moving_depth
                && distance <= destination.moving_depth
                && destination.children.length < destination.max_items
            );
        };//}}}
        _moveCandidate(from, options = {}) {//{{{
            if (! from || ! this.children.includes(from)) return null;

            const depth = normalizeMoveDepth(options.depth ?? 0);
            const direction = normalizeDirection(options.direction ?? 1);
            const movingDepth = this.moving_depth === true
                ? Infinity
                : (Number(this.moving_depth) || 0);
            if (depth > movingDepth) return null;

            if (depth === 0) {
                if (! this.sortable || this.children.length < 2) return null;
                const index = this.children.indexOf(from);
                const targetIndex = index + direction;
                if (targetIndex < 0 || targetIndex >= this.children.length) return null;
                return {
                    list: this,
                    to: this.children[targetIndex],
                    position: direction > 0 ? "after" : "before",
                };
            };

            const lists = this._allLists();
            const anchor = lists.indexOf(this);
            if (anchor < 0) return null;
            for (
                let index = anchor + direction;
                index >= 0 && index < lists.length;
                index += direction
            ) {
                const destination = lists[index];
                if (this._listIsWilling(destination, depth)) {
                    return {
                        list: destination,
                        to: null,
                        position: "after",
                    };
                };
            };
            return null;
        };//}}}
        async _updateMovementTriggers() {//{{{
            for (const trigger of this.getTriggers(["next", "previous"])) {
                const options = trigger.getTriggerArgs() || {};
                const from = selectedItem(this, options.target);
                trigger.targetNode.disabled = ! this._moveCandidate(from, {
                    depth: normalizeMoveDepth(options.depth ?? 0),
                    direction: options.action === "previous" ? -1 : 1,
                });
            };
        };//}}}
        async _refreshMovementTriggers() {//{{{
            // A newly rendered or resized destination can change the disabled
            // state of actions in another list. Refresh every live list so
            // those actions never retain stale eligibility.
            for (const list of this._allLists()) {
                if (
                    Array.isArray(list.children)
                    && typeof list._updateMovementTriggers == "function"
                ) await list._updateMovementTriggers();
            };
        };//}}}
        @action
        @mutex("list_mutating")
        async next(_data, options = {}) {//{{{
            return await moveByDirection(this, 1, options);
        };//}}}
        @action
        @mutex("list_mutating")
        async previous(_data, options = {}) {//{{{
            return await moveByDirection(this, -1, options);
        };//}}}
    };
};
