// lib/source_ids.js
// =================
// Unique source-ID stamping for [data-smark] elements.
//
// When mixin templates are cloned, data attributes survive cloneNode() so
// copies of the same source carry the same ID.  This is used by cross-list
// drag-and-drop to allow dragging between lists that originated from the
// same template/mixin.
//
// Lives in its own module (rather than in component.js) so both component.js
// and mixin.js can import it without creating a circular import chain.

let _nextSourceId = 1;
export function nextSourceId() { return String(_nextSourceId++); }
const _stampedDocs = new WeakSet();
export function stampSourceIds(rootElement) {
    for (const el of rootElement.querySelectorAll('[data-smark], [data-smark-]')) {
        if (!el.dataset.smSrc) {
            el.dataset.smSrc = nextSourceId();
        }
    }
}