# SmarkForm Mixins — Specification (as implemented)

> **Status:** authoritative description of the mixin feature as it exists in
> the current codebase. It supersedes the earlier pre-implementation draft
> (`0965f07b`) and folds in proposals **A** (per-document base path) and **B**
> (eager preloading), both implemented. The remaining, **not-yet-implemented**
> proposals — **C** (scoped registry / shadowing) and **D**
> (`placement:"nest"`) — live in `spc/proposals/mixins.md`.

Related sources: `src/lib/mixin.js` (expansion engine),
`src/lib/component.js` (integration, `enhance()` entry point, cycle-chain and
state threading), `src/lib/source_ids.js` (source-ID stamping), `src/main.js`
(root preload call, global mask registry), `src/types/input.type.js`
(scoped-mask lookup), and the user-facing guide
`docs/_advanced_concepts/mixin_types.md`.

---

## 1. Concept

A **mixin** is a reusable component blueprint:

- It is defined by an HTML `<template>` element (usually with an `id`).
- It is **referenced** from a placeholder node through a *mixin type
  reference* — a `type` value that contains `#`.
- Expansion is a **preprocessing step**: before the placeholder is enhanced,
  it is replaced in the DOM by a deep clone of the template's single root
  element, carrying merged options and attributes.

A mixin is **not** a component controller. There is no `"type":"mixin"`
component; the template's root element provides the concrete component type
that will actually be rendered.

---

## 2. Declaration and references

### Template

```html
<template id="myWidget">
  <div data-smark='{"type":"form"}'> ... </div>
</template>
```

The `<template>` element requires **no** `data-smark` attribute. It is located
by `id`.

### Mixin type reference

A `type` string is a mixin reference when it contains a `#`
(`isMixinRef()`), which native type names never do:

| Reference | Meaning |
|---|---|
| `"#myWidget"` | `<template id="myWidget">` in the current document |
| `"./widgets.html#myWidget"` | Template in an external file |
| `"https://cdn.example.com/sf.html#myWidget"` | Absolute URL + template id |

The fragment (`#<templateId>`) is **mandatory**; a reference without it throws
`MIXIN_TYPE_MISSING_FRAGMENT`.

References are resolved against the **source document** they appear in (the
page, or the external document an enclosing template was loaded from). Local
`#id` lookups use that document, and external URL parts are resolved against
that document's URL. At the top level this is `document` / `document.baseURI`.

---

## 3. Template constraints

The referenced `<template>` must satisfy:

- Contain **exactly one root element** node. Top-level `<style>` / `<script>`
  siblings do not count toward this limit (they are component
  style/behaviour, not markup). Any other element count is invalid →
  `MIXIN_TEMPLATE_INVALID_ROOT`.
- The root element must **not** specify `name` in its `data-smark` options →
  `MIXIN_TEMPLATE_ROOT_HAS_NAME`. The name belongs to the placeholder.
- The root subtree must **not** contain any `<script>` element (nested
  scripts are forbidden) → `MIXIN_NESTED_SCRIPT_DISALLOWED`.

Non-element nodes (text/comments) directly inside the `<template>` are ignored.

> **List placement warning:** do not place `<template>` elements as direct
> children of a SmarkForm `list` container — the list consumes its direct
> children as role templates. Define templates at document level (or in a
> non-SmarkForm container).

---

## 4. Resolution and caching

Each component carries a `_mixinBase` (`{ doc, baseUrl }`) inherited down the
tree. It identifies the **source document** of the markup it lives in: the
main document by default, or the external document an enclosing template was
loaded from.

- **Local reference** (`"#id"`): looked up with `getElementById(id)` in the
  source document (`_mixinBase.doc`, or `document` at the top level) and must
  be a `<template>`.
- **External reference** (`"<url>#id"`): the URL is resolved against the
  source document's URL (`_mixinBase.baseUrl`, or `document.baseURI`), fetched
  once per page load, parsed as HTML with `DOMParser`, source-stamped, and
  cached: `Map<absoluteUrl, Promise<Document>>`. All references to the same
  URL (regardless of fragment) reuse the same promise → a single network
  request per external document.
- On expansion, the returned base is the **target** document and its resolved
  URL, so mixin references nested inside the expanded template resolve against
  it (sibling templates via `#id`, further files via relative URLs).
- Missing template → `MIXIN_TEMPLATE_NOT_FOUND`.
- Fetch failure (non-OK HTTP) → `MIXIN_FETCH_ERROR`.

### Eager preloading (`preload`)

At root-form render time SmarkForm prefetches external mixin documents
referenced anywhere in the form subtree — including markup that is not
rendered yet (e.g. list item templates). This warms `docCache` so later
on-demand expansions (items added after render, lazily shown subforms) do not
wait on the network. Prefetching is non-blocking and obeys
`smark_mixin_allow_external`: blocked references are skipped silently and only
raise an error if actually used.

A mixin reference may opt out with `preload: false` (default `true`), given in
the `data-smark` JSON or as `data-smark-preload`. Only external references are
prefetched; local templates are resolved immediately.

The scan is performed by `preloadMixins(rootNode, rootOptions)` (exported from
`src/lib/mixin.js`) which the **root form** invokes from its `render()` before
`super.render()`. It walks the `[data-smark]` / `data-smark-*` elements of the
root node's subtree (the root node itself is excluded), collects every external
reference that has not opted out, and issues best-effort fetches through
`getMixinDocument()`. The external-fetch policy is read from the root options.
Blocked or unreachable documents are skipped without error; the failure only
surfaces if the reference is actually expanded later.

---

## 5. Expansion pipeline

When a placeholder whose `type` is a mixin reference is enhanced:

1. Parse the reference into `(urlPart, templateId)`.
2. Resolve/fetch the target document (with security checks, §10).
3. Check the circular-dependency chain (§11).
4. Locate the `<template>` and validate constraints (§3).
5. Deep-clone the root element (assigning a stable template source ID, §12).
6. Apply snippet-parameter substitutions (`data-for`, §7).
7. Enforce the no-nested-scripts rule (after substitutions).
8. Convert remaining `id` attributes in the clone to `data-id` (§7).
9. Inject top-level styles (§8).
10. Collect top-level scripts and apply the script execution policy (§9).
11. Merge options (§6) and write the result to the clone's `data-smark`.
12. Merge HTML attributes (§6).
13. Stamp source IDs on the clone (§12).
14. Replace the placeholder with the clone in the DOM.
15. Normal enhancement continues on the clone.

Per-instance scripts, if any, are registered to run after the newly created
component finishes rendering.

After the clone replaces the placeholder, `enhance()` **re-reads the clone's
options** through `getNodeOptions(node, {})`. This means the regular
classification applies to the expanded markup exactly as for authored markup:
type inference (`inferType()` for a type-less root such as a bare `<img>`,
`<video>` or `<audio>`), singleton-target type resolution, trigger detection,
and so on. Mixin references are consumed before `me.types[options.type]` is
looked up, so no `"type":"#…"` controller ever needs to exist.

---

## 6. Merge semantics

### Options (`data-smark`)

Effective options are, in increasing priority:

1. Template root options (JSON + `data-smark-*` attributes) — defaults.
2. Placeholder JSON options, **excluding `type`** (the mixin reference is
   consumed).
3. Placeholder `data-smark-*` attributes, **excluding `type`**.

`name` therefore comes from the placeholder. The merged result is written back
to the clone's `data-smark` JSON.

### HTML attributes

| Attribute | Rule |
|---|---|
| `data-smark`, `data-smark-*` | Skipped (already merged into options). |
| `id` | Skipped; a warning is emitted (SmarkForm may assign auto ids). |
| `class` | **Union** of template and placeholder classes. |
| `style` | **Concatenation**: template style first, then placeholder (placeholder can override properties). |
| `aria-*`, `data-*`, all others | Placeholder value **overrides** the template value. |

---

## 7. Snippet parameters (`data-for`)

Direct children of the placeholder carrying `data-for="<id>"` are **consumed**
as parameters (they are never rendered as children):

1. Locate `[id="<id>"]` inside the clone; if absent, silently skip.
2. Deep-clone the parameter element.
3. Convert its `id`s to `data-id` and drop its `data-for`.
4. Replace the targeted element with it.

After all substitutions, **every surviving `id` in the clone subtree is
converted to `data-id`**, preventing duplicate ids when a mixin is used more
than once and making surviving slots self-documenting.

---

## 8. Styles

Top-level `<style>` siblings of the root element are extracted and injected
into `<head>` **once per unique content** (deduplicated by text content, for
the lifetime of the page).

---

## 9. Scripts

Top-level `<script>` siblings of the root element are extracted and executed
**once per component instance**, after rendering, via
`new Function(scriptEl.textContent)` with `this` bound to the SmarkForm
component instance. No `context` argument is passed.

Top-level scripts do **not** count toward the single-root-element constraint
(§3). Nested scripts — inside the root subtree, or injected via a `data-for`
parameter — are always forbidden (§3, §7). Execution of regular scripts is
gated by the script policy (§10).

### Mixin-scoped masks

A top-level `<script type="smark-mask" data-name="…">` is **not** executed as
behaviour. It is treated as a declarative mask definition scoped to the mixin:

1. Its text must evaluate to a factory function — it is read with
   `new Function('return (' + text.trim() + ')')()`.
2. On success the factory is stored on the expanded component as
   `_scopedMasks[name]`; a missing `data-name`, a non-function value, or an
   evaluation error is ignored (a `console.warn` is emitted for the latter).

Because it is an ordinary top-level `<script>`, the same script policy (§10)
applies to the origin class of the template: with the default `"block"` it
throws the corresponding `MIXIN_SCRIPT_*_BLOCKED` error, with `"noscript"` it is
silently discarded, and only with `"allow"` is the factory evaluated.

The scoped-mask map is threaded to the component and all of its descendants via
the `_scopedMasks` constructor option — the same inheritance channel as
`_mixinBase` (§4) and `_mixinChain` (§11). When an `input`-type field carrying a
`mask` option applies its mask, the lookup order is **scoped first, then
global**:

```
_scopedMasks[name]  ||  SmarkForm._maskRegistry[name]
```

This lets a mixin ship masks that neither leak into nor collide with the
page-global registry. See `docs/_working_with_forms/field_masking.md`
("Mixin-Scoped Masks") for the author-facing description.

---

## 10. Security options

All policies are read **only from the root** SmarkForm instance, so an external
template cannot escalate its own privileges. Each option accepts either a plain
string or a per-origin object (`{ "<origin>": <policy>, "*": <policy> }`); when
an object is used, the exact origin is tried first, then `"*"`, then the
built-in fallback `"block"`.

### External fetch: `smark_mixin_allow_external`

| Value | Behaviour |
|---|---|
| `"block"` *(default)* | External URL references throw `MIXIN_EXTERNAL_FETCH_BLOCKED` (no request). |
| `"same-origin"` | Cross-origin URLs throw `MIXIN_CROSS_ORIGIN_FETCH_BLOCKED`. |
| `"allow"` | Any origin permitted. |

Object form values are `"block"` / `"allow"`.

### Script execution

The controlling option depends on the template's origin:

| Template origin | Option |
|---|---|
| Local (`#id`) | `smark_mixin_allow_local_scripts` |
| External, same origin | `smark_mixin_allow_same_origin_scripts` |
| External, cross-origin | `smark_mixin_allow_cross_origin_scripts` |

| Value | Behaviour |
|---|---|
| `"block"` *(default)* | Throw the corresponding `MIXIN_SCRIPT_*_BLOCKED` error. |
| `"noscript"` | Render normally but silently discard the script. |
| `"allow"` | Execute the script. |

---

## 11. Nesting and circular-dependency detection

Nested mixins are fully supported. Each component carries a `_mixinChain`
(`Set` of `"<absoluteUrl>#<templateId>"` keys) inherited from its parent via
`childChain`. Before expanding a key already present in the chain, SmarkForm
throws `MIXIN_CIRCULAR_DEPENDENCY`. Because the chain is per-component (not a
global stack), sibling fields that reuse the same template do not produce false
positives, while indirect cycles (A → form → B → A) are still caught.

---

## 12. Source IDs

`src/lib/source_ids.js` provides a monotonic `nextSourceId()` counter and a
`stampSourceIds(rootElement)` helper. IDs must survive `cloneNode()`, hence
they are stored as `data-*` attributes.

- **`data-sf-tpl`** — assigned once to the template root *before* cloning
  (`templateRoot.dataset.sfTpl`), so every clone of that template shares the
  same value. This is the attribute the **sortable** decorator compares to
  allow cross-list drag-and-drop between lists created from the same mixin
  template (`list.decorators/sortable.deco.js`).
- **`data-sm-src`** — a per-element id assigned by `stampSourceIds()` to every
  `[data-smark]` / `data-smark-*` element in a subtree. External documents are
  stamped as they are fetched (`getMixinDocument`) and each expanded clone is
  stamped after option/attribute merge. It gives elements cloned from the same
  source a stable identity. (Note: the current code writes `data-sm-src` but no
  reader consumes it yet; `data-sf-tpl` is the attribute with an active
  consumer.)

Both ids come from the same counter but are assigned in independent scopes
(one per template, one per element).

---

## 13. Error codes

| Error code | When thrown |
|---|---|
| `MIXIN_TYPE_MISSING_FRAGMENT` | Type reference has no `#<templateId>` fragment |
| `MIXIN_EXTERNAL_FETCH_BLOCKED` | External URL but `smark_mixin_allow_external` is `"block"` |
| `MIXIN_CROSS_ORIGIN_FETCH_BLOCKED` | Cross-origin URL but `smark_mixin_allow_external` is `"same-origin"` |
| `MIXIN_FETCH_ERROR` | HTTP error while fetching an external template |
| `MIXIN_CIRCULAR_DEPENDENCY` | The expansion chain already contains the current mixin key |
| `MIXIN_TEMPLATE_NOT_FOUND` | No matching `<template>` in the target document |
| `MIXIN_TEMPLATE_INVALID_ROOT` | Template does not contain exactly one root element |
| `MIXIN_TEMPLATE_ROOT_HAS_NAME` | Template root specifies `name` in its options |
| `MIXIN_SCRIPT_LOCAL_BLOCKED` | Local template `<script>` and `smark_mixin_allow_local_scripts` is `"block"` |
| `MIXIN_SCRIPT_SAME_ORIGIN_BLOCKED` | Same-origin external template `<script>` and `smark_mixin_allow_same_origin_scripts` is `"block"` |
| `MIXIN_SCRIPT_CROSS_ORIGIN_BLOCKED` | Cross-origin template `<script>` and `smark_mixin_allow_cross_origin_scripts` is `"block"` |
| `MIXIN_NESTED_SCRIPT_DISALLOWED` | A `<script>` exists inside the template root subtree |

---

## 14. Design principles

- **DOM-first** — templates and substitutions are plain HTML.
- **Declarative** — no application JavaScript required to define a mixin.
- **Scoped by construction** — expansion happens before enhancement, so the
  placeholder never participates in rendering.
- **Async-safe** — external templates are fetched and awaited during the
  preprocessing pass.
- **No external templating engine** — cloning and substitution are done with
  native DOM APIs.

---

## 15. Integration points

| Concern | Where |
|---|---|
| `isMixinRef()` test + expansion entry | `component.js` `enhance()`, first step |
| Expansion engine (`expandMixin`, `preloadMixins`, `isMixinRef`) | `src/lib/mixin.js` |
| External-document cache + source stamping | `src/lib/mixin.js` (`docCache`, `getMixinDocument`) |
| Source-ID helpers | `src/lib/source_ids.js` |
| Root eager preload call | `src/main.js` `render()` → `preloadMixins(me.targetNode, me.options)` |
| Global mask registry (`registerMask`, `_maskRegistry`) | `src/main.js` |
| Scoped-mask lookup | `src/types/input.type.js` `_applyMask()` |
| State threading options (`_mixinChain`, `_scopedMasks`, `_mixinBase`) | `component.js` constructor, spread from `enhance()` |
| Cross-list drag from the same template | `src/types/list.decorators/sortable.deco.js` (`data-sf-tpl`) |
| Tests | `test/mixin_types.tests.js` |
| User guide | `docs/_advanced_concepts/mixin_types.md` (and `field_masking.md` for scoped masks) |


