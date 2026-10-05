# SmarkForm Mixins — Specification (as implemented)

> **Status:** authoritative description of the mixin feature as it exists in
> the current codebase. It supersedes the earlier pre-implementation draft
> (`0965f07b`).

Related sources: `src/lib/mixin.js` (expansion engine),
`src/lib/component.js` (integration, script execution, cycle-chain), and the
user-facing guide `docs/_advanced_concepts/mixin_types.md`.

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

External URL parts are resolved against **`document.baseURI`** using the
standard `URL` constructor. There is no per-component "base path" concept.

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

- **Local reference** (`"#id"`): looked up with
  `document.getElementById(id)` and must be a `<template>`.
- **External reference** (`"<url>#id"`): fetched once per page load, parsed as
  HTML with `DOMParser`, source-stamped, and cached:
  `Map<absoluteUrl, Promise<Document>>`. All references to the same URL
  (regardless of fragment) reuse the same promise → a single network request
  per external document.
- Missing template → `MIXIN_TEMPLATE_NOT_FOUND`.
- Fetch failure (non-OK HTTP) → `MIXIN_FETCH_ERROR`.

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

- **Mask scripts**: a top-level `<script type="smark-mask" data-name="…">` is
  not executed as behaviour; it is evaluated into the component's scoped-mask
  registry (see field masking docs).
- Nested scripts (inside the root subtree) are always forbidden (§3).
- Execution is gated by the script policy (§10).

---

## 10. Security options

All policies are read **only from the root** SmarkForm instance, so an external
template cannot escalate its own privileges. Each option accepts either a plain
string or a per-origin object (`{ "<origin>": <policy>, "*": <policy> }`); when
an object is used, the exact origin is tried first, then `"*"`, then the
built-in fallback `"block"`.

### External fetch: `smark_mixin_allowExternal`

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
| Local (`#id`) | `smark_mixin_allowLocalScripts` |
| External, same origin | `smark_mixin_allowSameOriginScripts` |
| External, cross-origin | `smark_mixin_allowCrossOriginScripts` |

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

The template root and the clone are stamped with stable source IDs
(`data-sf-tpl`, `data-sm-src`) used by cross-list drag-and-drop to recognise
elements originating from the same template/mixin.

---

## 13. Error codes

| Error code | When thrown |
|---|---|
| `MIXIN_TYPE_MISSING_FRAGMENT` | Type reference has no `#<templateId>` fragment |
| `MIXIN_EXTERNAL_FETCH_BLOCKED` | External URL but `smark_mixin_allowExternal` is `"block"` |
| `MIXIN_CROSS_ORIGIN_FETCH_BLOCKED` | Cross-origin URL but `smark_mixin_allowExternal` is `"same-origin"` |
| `MIXIN_FETCH_ERROR` | HTTP error while fetching an external template |
| `MIXIN_CIRCULAR_DEPENDENCY` | The expansion chain already contains the current mixin key |
| `MIXIN_TEMPLATE_NOT_FOUND` | No matching `<template>` in the target document |
| `MIXIN_TEMPLATE_INVALID_ROOT` | Template does not contain exactly one root element |
| `MIXIN_TEMPLATE_ROOT_HAS_NAME` | Template root specifies `name` in its options |
| `MIXIN_SCRIPT_LOCAL_BLOCKED` | Local template `<script>` and `smark_mixin_allowLocalScripts` is `"block"` |
| `MIXIN_SCRIPT_SAME_ORIGIN_BLOCKED` | Same-origin external template `<script>` and `smark_mixin_allowSameOriginScripts` is `"block"` |
| `MIXIN_SCRIPT_CROSS_ORIGIN_BLOCKED` | Cross-origin template `<script>` and `smark_mixin_allowCrossOriginScripts` is `"block"` |
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
