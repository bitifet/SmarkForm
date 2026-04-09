// lib/mixin.js
// ============
// Mixin type expansion — preprocessing step that replaces a mixin-referenced
// placeholder node with a clone of the referenced <template> root before
// normal SmarkForm enhancement begins.

import {parseJSON} from "./helpers.js";

// Module-level caches (shared for the lifetime of the page):
const docCache = new Map();           // absoluteUrl → Promise<Document>
const injectedStyleSrcs = new Set();  // dedup injected <style> content

// ----------------------------------------------------------------------------
// Internal: applySnippetParams(clone, params, component)
// Applies "snippet parameters" to a cloned template root.
//
// For each param element (a direct child of the placeholder with data-for):
//   1. Locate the target element inside `clone` by id.
//   2. Strip/convert ids on the param element and its descendants.
//   3. Replace the target with a clone of the param element.
//
// After all substitutions:
//   4. Convert every remaining id in the clone subtree to data-id.
//
// Also enforces that no <script> elements exist anywhere inside the clone
// subtree (throws MIXIN_NESTED_SCRIPT_DISALLOWED).
// ----------------------------------------------------------------------------

function convertIds(root) { //{{{
    // Convert id → data-id for root and all descendants.
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    let node = walker.currentNode;
    while (node) {
        if (node.hasAttribute('id')) {
            node.setAttribute('data-id', node.getAttribute('id'));
            node.removeAttribute('id');
        }
        node = walker.nextNode();
    }
}; //}}}

function enforceNoNestedScripts(root, component) { //{{{
    // Throw if any <script> element exists anywhere inside the clone root.
    if (root.querySelector('script')) {
        throw component.renderError(
            'MIXIN_NESTED_SCRIPT_DISALLOWED'
            , 'Mixin template root subtree must not contain <script> elements.'
            + ' Scripts are only supported as direct siblings of the template'
            + ' root element (top-level <script> inside <template>).'
        );
    }
}; //}}}

function applySnippetParams(clone, params) { //{{{
    // For each param element, find the target by id in the clone and replace.
    for (const param of params) {
        const targetId = param.getAttribute('data-for');
        const target = clone.querySelector(`[id="${CSS.escape(targetId)}"]`);
        if (! target) continue; // Target not found — silently skip.

        // Deep-clone the param to detach it from the live DOM before
        // mutating (id→data-id conversion) and insertion.
        const paramClone = param.cloneNode(true);

        // Convert ids on the inserted node (bad practice / disallowed).
        convertIds(paramClone);

        // Remove the data-for attribute from the inserted element.
        paramClone.removeAttribute('data-for');

        // Replace target in the clone subtree with the param clone.
        target.replaceWith(paramClone);
    }
}; //}}}

// ----------------------------------------------------------------------------
// Public: isMixinRef(type)
// Returns true when `type` is a mixin reference, i.e. it contains a '#'.
// Native SmarkForm types (form, list, input, …) never contain '#'.
// ----------------------------------------------------------------------------
export function isMixinRef(type) { //{{{
    return typeof type === 'string' && type.includes('#');
}; //}}}

// ----------------------------------------------------------------------------
// Internal helpers
// ----------------------------------------------------------------------------

function mergeAttributes(clone, placeholder) { //{{{
    // Merge HTML attributes from `placeholder` into `clone` following the
    // attribute merge semantics specified in the Mixin Types documentation.
    for (const attr of placeholder.attributes) {
        const name = attr.name;
        if (name === 'data-smark') continue; // Handled via option merge.
        if (name === 'id') {
            // id is intentionally not merged; SmarkForm manages ids itself.
            console.warn(
                `SmarkForm mixin: placeholder id="${attr.value}" ignored.`
                + ' The id will be assigned by SmarkForm autoId if configured.'
            );
            continue;
        }
        if (name === 'class') {
            // Union: preserve all classes from both template and placeholder.
            const existing = new Set(
                (clone.getAttribute('class') || '').split(/\s+/).filter(Boolean)
            );
            for (const cls of attr.value.split(/\s+/).filter(Boolean)) {
                existing.add(cls);
            }
            clone.setAttribute('class', [...existing].join(' '));
        } else if (name === 'style') {
            // Concatenation: template style first, then placeholder style so
            // the placeholder can override individual properties.
            const base = (clone.getAttribute('style') || '').trim();
            if (base) {
                const sep = base.endsWith(';') ? '' : ';';
                clone.setAttribute('style', base + sep + attr.value);
            } else {
                clone.setAttribute('style', attr.value);
            }
        } else {
            // aria-*, data-* (except data-smark), and all other attributes:
            // placeholder wins.
            clone.setAttribute(name, attr.value);
        }
    }
}; //}}}

function injectStyles(styleEls) { //{{{
    // Inject <style> elements into <head> exactly once per unique content.
    for (const styleEl of styleEls) {
        const content = styleEl.textContent;
        if (injectedStyleSrcs.has(content)) continue;
        injectedStyleSrcs.add(content);
        const newStyle = document.createElement('style');
        newStyle.textContent = content;
        document.head.appendChild(newStyle);
    }
}; //}}}

function isCrossOrigin(absoluteUrl) { //{{{
    try {
        return new URL(absoluteUrl).origin !== location.origin;
    } catch (_) {
        return false;
    }
}; //}}}

// ----------------------------------------------------------------------------
// Public: expandMixin(node, options, component)
// Expands a mixin placeholder node into its template clone.
//
// Circular-dependency detection uses a per-component mixin chain stored on
// each component as `_mixinChain` (a Set<key>).  The chain is inherited from
// the parent so that A→form→B→A indirect cycles are also detected.  Each
// component stores only its own chain, so sibling fields that use the same
// template do NOT trigger a false-positive cycle error.
//
// Returns:
//   { node, options, scripts, childChain }
//   - node:       the clone that replaced the placeholder in the DOM
//   - options:    the merged data-smark options (mixin type ref consumed)
//   - scripts:    array of extracted <script> elements to run after rendering
//   - childChain: the Set to store on the newly-created component so its
//                 nested renders can continue cycle detection
// ----------------------------------------------------------------------------
export async function expandMixin(node, options, component) { //{{{
    const typeRef = options.type;

    // Parse the mixin type reference into (urlPart, templateId):
    const hashIdx = typeRef.indexOf('#');
    const urlPart = typeRef.slice(0, hashIdx);
    const templateId = typeRef.slice(hashIdx + 1);

    if (! templateId) {
        throw component.renderError(
            'MIXIN_TYPE_MISSING_FRAGMENT'
            , `Mixin type reference "${typeRef}" must include a non-empty`
            + ' #templateId fragment.'
        );
    }

    // Resolve the target document (local or external):
    let targetDoc;
    let absoluteUrl;

    if (! urlPart) {
        // Local reference: "#templateId"
        targetDoc = document;
        absoluteUrl = document.baseURI;
    } else {
        // External reference: "url#templateId"
        absoluteUrl = new URL(urlPart, document.baseURI).href;

        // Enforce external mixin fetch policy before attempting any network
        // request.  The policy is read exclusively from the root SmarkForm
        // instance to prevent a malicious external template from escalating
        // its own privileges by setting the option in its data-smark.
        const extPolicy = component.root.options['allowExternalMixins'] ?? 'block';
        if (extPolicy === 'block') {
            throw component.renderError(
                'MIXIN_EXTERNAL_FETCH_BLOCKED'
                , `Mixin type "${typeRef}" references an external URL but`
                + ' allowExternalMixins is "block" (the default).'
                + ' Set allowExternalMixins to "same-origin" or "allow" on'
                + ' the root SmarkForm instance to permit external mixin loading.'
            );
        } else if (extPolicy === 'same-origin' && isCrossOrigin(absoluteUrl)) {
            throw component.renderError(
                'MIXIN_CROSS_ORIGIN_FETCH_BLOCKED'
                , `Mixin type "${typeRef}" references a cross-origin URL`
                + ` (${new URL(absoluteUrl).origin}) but allowExternalMixins`
                + ' is "same-origin". Set allowExternalMixins to "allow" to'
                + ' permit cross-origin mixin loading.'
            );
        }
        // extPolicy === 'allow', or 'same-origin' with a same-origin URL:
        // proceed with the fetch.

        if (! docCache.has(absoluteUrl)) {
            docCache.set(
                absoluteUrl
                , fetch(absoluteUrl)
                    .then(r => {
                        if (! r.ok) throw Object.assign(
                            new Error(
                                `Failed to fetch mixin source: ${absoluteUrl}`
                                + ` (HTTP ${r.status})`
                            )
                            , { code: 'MIXIN_FETCH_ERROR' }
                        );
                        return r.text();
                    })
                    .then(html => {
                        const parser = new DOMParser();
                        return parser.parseFromString(html, 'text/html');
                    })
            );
        }
        targetDoc = await docCache.get(absoluteUrl);
    }

    const mixinKey = `${absoluteUrl}#${templateId}`;

    // Circular dependency check using the per-component mixin chain.
    // The chain is inherited from the parent component so that indirect cycles
    // through non-mixin intermediaries (A → form → B → A) are also caught.
    // Using a per-component chain (rather than a shared global stack) means
    // sibling fields that use the same template do NOT trigger a false positive.
    const parentChain = component._mixinChain || new Set();
    if (parentChain.has(mixinKey)) {
        throw component.renderError(
            'MIXIN_CIRCULAR_DEPENDENCY'
            , `Circular mixin dependency detected: "${mixinKey}"`
            + ' is already being expanded in this rendering chain.'
        );
    }

    // Locate the <template> element:
    const template = targetDoc.getElementById(templateId);
    if (! template || template.tagName.toLowerCase() !== 'template') {
        throw component.renderError(
            'MIXIN_TEMPLATE_NOT_FOUND'
            , `Mixin template #${templateId} not found`
            + ` in ${urlPart || 'the current document'}.`
        );
    }

    // Validate: exactly one root element node.
    // <script> and <style> elements at the template top level are treated as
    // component-level behaviour/style and do not count as root elements, so
    // that the natural authoring pattern of:
    //   <template id="x">
    //     <div data-smark>…</div>
    //     <style>…</style>
    //     <script>…</script>
    //   </template>
    // is valid.
    const templateContentEls = [...template.content.childNodes]
        .filter(n => n.nodeType === Node.ELEMENT_NODE);
    const topLevelScripts = templateContentEls
        .filter(n => n.tagName.toLowerCase() === 'script');
    const topLevelStyles = templateContentEls
        .filter(n => n.tagName.toLowerCase() === 'style');
    const rootElements = templateContentEls
        .filter(n => {
            const tag = n.tagName.toLowerCase();
            return tag !== 'script' && tag !== 'style';
        });
    if (rootElements.length !== 1) {
        throw component.renderError(
            'MIXIN_TEMPLATE_INVALID_ROOT'
            , `Mixin template #${templateId} must contain exactly one root`
            + ` element (found ${rootElements.length}).`
        );
    }

    const templateRoot = rootElements[0];

    // Validate: template root must not set "name" in data-smark:
    const templateRootOptions = parseJSON(
        templateRoot.getAttribute('data-smark')
    ) || {};
    if (templateRootOptions.name !== undefined) {
        throw component.renderError(
            'MIXIN_TEMPLATE_ROOT_HAS_NAME'
            , `Mixin template #${templateId} root element must not specify`
            + ' a "name" in its data-smark options.'
            + ' The name must be set on the placeholder (usage site).'
        );
    }

    // Deep-clone the template root:
    const clone = templateRoot.cloneNode(true);

    // Collect snippet parameter nodes: direct children of the placeholder
    // that carry a `data-for` attribute, referencing elements inside the clone
    // by their id.  These are consumed (not rendered as children).
    const params = [...node.children].filter(el => el.hasAttribute('data-for'));

    // Apply snippet parameter substitutions on the clone:
    if (params.length > 0) {
        applySnippetParams(clone, params);
    }

    // Enforce no nested <script> elements inside the template root subtree.
    // This check runs after snippet substitutions so it also catches any
    // <script> elements that might have been injected via data-for params.
    // Scripts are only supported as top-level siblings of the root element.
    enforceNoNestedScripts(clone, component);

    // Convert any surviving id attributes inside the clone to data-id.
    // This prevents id collisions when the mixin is used multiple times and
    // makes default snippet slots self-documenting via data-id.
    convertIds(clone);

    // Gather styles from the template top level (siblings of the root element)
    // and inject them into <head> once per unique content:
    injectStyles(topLevelStyles);

    // Gather scripts from the template top level (siblings of the root element).
    // These run once per component instance after rendering.
    let scripts = [...topLevelScripts];

    // Apply mixin script execution policy based on template origin class.
    // Scripts are blocked by default for all origin classes.
    if (scripts.length > 0) {
        const isLocal = ! urlPart;
        const isCross = ! isLocal && isCrossOrigin(absoluteUrl);
        let policyOptionName;
        let errorCode;
        if (isLocal) {
            policyOptionName = 'allowLocalMixinScripts';
            errorCode = 'MIXIN_SCRIPT_LOCAL_BLOCKED';
        } else if (isCross) {
            policyOptionName = 'allowCrossOriginMixinScripts';
            errorCode = 'MIXIN_SCRIPT_CROSS_ORIGIN_BLOCKED';
        } else {
            policyOptionName = 'allowSameOriginMixinScripts';
            errorCode = 'MIXIN_SCRIPT_SAME_ORIGIN_BLOCKED';
        }
        // Read policy exclusively from the root to prevent privilege escalation
        // from within mixin templates (see allowExternalMixins comment above).
        const policy = component.root.options[policyOptionName] ?? 'block';
        if (policy === 'block') {
            throw component.renderError(
                errorCode
                , `Mixin template "${mixinKey}" contains a <script> and`
                + ` ${policyOptionName} is "block" (the default).`
                + ` Set ${policyOptionName} to "noscript" or "allow" on the`
                + ' root SmarkForm instance to change this behaviour.'
            );
        } else if (policy === 'noscript') {
            scripts = []; // Silently discard.
        }
        // policy === 'allow': keep scripts unchanged.
    }

    // Merge options:
    //   - mixin type reference is consumed (not forwarded as the concrete type)
    //   - template root options are defaults; placeholder options override
    const { type: _mixinRef, ...restPlaceholderOptions } = options;
    const mergedOptions = {
        ...templateRootOptions,    // template provides defaults
        ...restPlaceholderOptions, // placeholder overrides (including name)
    };

    // Write merged options back to the clone's data-smark:
    clone.setAttribute('data-smark', JSON.stringify(mergedOptions));

    // Merge HTML attributes from placeholder into clone:
    mergeAttributes(clone, node);

    // Build the child chain: parent chain + this key.
    // Stored on the newly-created component so that its nested renders
    // can detect back-references to this (and any ancestor) template.
    const childChain = new Set([...parentChain, mixinKey]);

    // Replace placeholder with clone in the DOM:
    node.replaceWith(clone);

    return {
        node: clone,
        options: mergedOptions,
        scripts,
        childChain,
    };
}; //}}}
