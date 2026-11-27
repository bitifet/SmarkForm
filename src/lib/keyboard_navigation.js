import {isHiddenByClosedDetails} from './helpers.js';

const lastFocusedFieldIndex = new WeakMap();
const rootsWithFocusMemory = new WeakSet();

function isFormOrList(component) {
    return !! component
        && ! component.isSingleton
        && (component.options?.type === 'form' || component.options?.type === 'list');
}

function childrenOf(component) {
    const children = component?.children;
    return Array.isArray(children) ? children : Object.values(children || {});
}

function isAvailableField(component) {
    if (
        ! component?._isField
        || component.getTriggerArgs?.() !== undefined
        || ! component.targetFieldNode
    ) return false;

    const node = component.targetFieldNode;
    if (
        ! node.isConnected
        || node.matches?.(':disabled')
        || isHiddenByClosedDetails(node)
        || node.closest?.('[inert], [aria-hidden="true"]')
        || node.getClientRects().length === 0
    ) return false;

    const style = window.getComputedStyle(node);
    if (
        style.display === 'none'
        || style.visibility === 'hidden'
        || style.visibility === 'collapse'
    ) return false;

    return true;
}

export function getAvailableFields(component) {
    const fields = [];
    const visit = current => {
        if (! current || current.getTriggerArgs?.() !== undefined) return;
        if (current._isField && current.targetFieldNode) {
            if (isAvailableField(current)) fields.push(current);
            return;
        };
        for (const child of childrenOf(current)) visit(child);
    };
    visit(component);
    return fields;
}

export function findAdjacentFormOrList(context, backwards = false) {
    let branch = context;
    while (branch?.parent) {
        const parent = branch.parent;
        if (isFormOrList(branch) && isFormOrList(parent)) {
            const siblings = childrenOf(parent);
            const isItemList = parent.options.type === 'list';
            const hasSiblingContext = isItemList
                ? (parent.tplType === 'form' || siblings.some(isFormOrList))
                : siblings.filter(isFormOrList).length > 1;
            if (hasSiblingContext) {
                const index = siblings.indexOf(branch);
                const step = backwards ? -1 : 1;
                for (let i = index + step; i >= 0 && i < siblings.length; i += step) {
                    const candidate = siblings[i];
                    if (
                        isFormOrList(candidate)
                        && getAvailableFields(candidate).length > 0
                    ) return candidate;
                };
                // This is the nearest context containing sibling forms/lists.
                // Do not climb out of it when its boundary is reached.
                return null;
            };
        };
        branch = parent;
    };
    return null;
}

export function focusAvailableField(component, backwards = false) {
    const fields = getAvailableFields(component);
    if (! fields.length) return false;
    const rememberedIndex = lastFocusedFieldIndex.get(component);
    const index = Number.isInteger(rememberedIndex)
        ? Math.min(rememberedIndex, fields.length - 1)
        : backwards ? fields.length - 1 : 0;
    const field = fields[index];
    if (! field) return false;
    field.targetFieldNode.focus();
    return true;
}

function fieldContainsTarget(field, target) {
    return [field.targetFieldNode, field.targetNode].some(node =>
        node === target || node?.contains?.(target)
    );
}

export function enableLastFocusedMemory(root) {
    if (! root?.targetNode || rootsWithFocusMemory.has(root)) return;
    rootsWithFocusMemory.add(root);
    root.targetNode.addEventListener('focusin', event => {
        const focused = root.getComponent(event.target);
        if (! focused?._isField || focused.getTriggerArgs?.() !== undefined) return;
        for (let context = focused; context; context = context.parent) {
            if (! isFormOrList(context)) continue;
            const fields = getAvailableFields(context);
            const index = fields.findIndex(field => fieldContainsTarget(field, event.target));
            if (index >= 0) lastFocusedFieldIndex.set(context, index);
        };
    }, true);
}
