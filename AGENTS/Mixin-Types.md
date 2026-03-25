# Mixin Types — Agent Knowledge

This document captures implementation details, patterns, and gotchas discovered
while implementing and debugging the Mixin Types feature. It is intended to help
coding agents avoid known pitfalls and make informed design decisions.

---

## What Are Mixin Types?

A "mixin type" is a `data-smark` `type` value that contains a `#` character.
Instead of naming a built-in SmarkForm type (form, list, input, …), it references
an `<template>` element — either in the same document (`"#templateId"`) or in an
external file (`"url#templateId"`).

**Implementation files:**
- `src/lib/mixin.js` — the expansion engine (parsing, fetching, cloning, merging)
- `src/lib/component.js` — `enhance()` hook that calls `expandMixin()` as a
  preprocessing step before normal type dispatch

---

## Template Structure Rules

A mixin `<template>` may have **up to 3 direct children**:

1. **Root element** (required) — the component markup. Must NOT set `"name"` in
   its `data-smark` (name must come from the usage-site placeholder).
2. **`<style>` sibling** (optional) — injected into `<head>` **once per unique
   content** regardless of how many instances are created.
3. **`<script>` sibling** (optional) — executed **once per component instance**
   after rendering, with `this` bound to the component.

`<style>` and `<script>` must be **direct siblings of the root element**, NOT
nested inside it. This is intentional: the `<template>` tag prevents the browser
from parsing or executing them at page load.

```html
<template id="myWidget">
  <fieldset data-smark='{"type":"form"}'>
    <!-- component content here -->
  </fieldset>
  <style>/* injected once */</style>
  <script>/* runs per instance, this = component */</script>
</template>
```

---

## Mixin Script Execution Timing

**Key insight:** A mixin's `<script>` runs as an `onRendered` task and is
guaranteed to complete **before** the component's `rendered` promise resolves.

The execution order in `addItem()`:

1. `new ctrl(node, options, parent)` — constructor starts its async IIFE,
   which awaits `me.render()`.
2. `enhance()` (called by `addItem`) adds the mixin script to `component.onRendered()`.
   Because the constructor's IIFE is awaiting `me.render()` (async), control
   returns to `enhance()` before the IIFE processes its `onRenderedTasks`.
3. When `me.render()` resolves, the IIFE iterates `onRenderedTasks` — this
   includes the mixin script, which now runs.
4. `setRendered(true)` — the `rendered` promise resolves.
5. Back in `addItem()`: `await newItem.rendered` unblocks.
6. `AfterAction_addItem` is emitted **after** `await newItem.rendered`.

**Consequence:** Any event listener registered inside a mixin script (e.g.
`item.parent.on('AfterAction_addItem', ...)`) IS active before the
`AfterAction_addItem` event fires, **even when the mixin is instantiated for
the very first time** (e.g. by the outer "Add" button on an initially-empty list).

This means the outer trigger button pattern works correctly without any special
treatment — the new item's script runs before the event fires.

---

## Per-Instance Listener Pattern

When a mixin script registers a listener on the parent list, it accumulates
across instances (N periods → N listeners for `AfterAction_addItem`). Each
listener only handles its own item, identified by path comparison:

```javascript
const item = this; // bound via fn.call(component) in enhance()

item.parent.on('AfterAction_addItem', async function(ev) {
    // Only process the event for THIS specific period.
    if (!ev.data || ev.data.getPath() !== item.getPath()) return;

    // ... handle the new item ...
});
```

**Why `ev.data.getPath()`?** `ev.data` is the newly created item (returned by
`addItem()` and stored as `options.data`). By the time the event fires,
`renum()` has already updated all names/paths, so `ev.data.getPath()` returns
the correct index-based path (e.g. `/periods/2`).

**Why accumulation is harmless:** Each listener does O(1) work (one path
comparison, then either return or do the work). Total cost is O(N) per event,
where N is the number of existing items. This is acceptable for typical list sizes.

---

## Date Formatting in Mixin Scripts

**Always use local calendar fields** for date formatting in mixin scripts. Never
use `Date.toISOString()`, which converts to UTC and shifts the date by one day in
any UTC+ timezone (e.g. Spain/CET at UTC+1).

```javascript
// CORRECT — uses local calendar fields
const fmtDate = d =>
    d.getFullYear() + '-'
    + String(d.getMonth() + 1).padStart(2, '0') + '-'
    + String(d.getDate()).padStart(2, '0');

// WRONG — UTC-based, off by one day in UTC+ timezones
const bad = d => d.toISOString().slice(0, 10);
```

This pattern is used in the `#periodItem` mixin in `docs/_about/showcase.md`.

---

## Circular Dependency Detection

Mixin expansion maintains a `_mixinChain` (a `Set<key>`) that is passed down
through the component tree:

- When a mixin is expanded, its key (`url#templateId`) is added to the chain.
- The chain is passed via **constructor options** (`{..., _mixinChain: childChain}`)
  so it is available immediately inside the constructor's async IIFE, before any
  nested `enhance()` calls happen.
- Sibling fields that use the same template do NOT share a chain, so they do NOT
  trigger false-positive cycle errors.
- Indirect cycles through non-mixin intermediaries (A → form → B → A) ARE caught
  because the chain is inherited through the component hierarchy.

---

## Style Deduplication

The module-level `injectedStyleSrcs` Set in `src/lib/mixin.js` deduplicates
`<style>` content across the page lifetime. The same `<style>` string is only
injected into `<head>` once, regardless of how many mixin instances are created or
how many templates reference it.

**Implication:** Styles from the `#scheduleRow` template (used inside `#periodItem`)
are still only injected once even though `#periodItem` instantiates multiple
`#scheduleRow` instances.

---

## External Template Loading

External template references (`"url#templateId"`) fetch the document once and cache
it per URL in the module-level `docCache` Map. The cached value is a `Promise<Document>`.

The cache is page-lifetime and survives multiple enhancement cycles, so opening the
same external document for multiple different mixin usages results in only one HTTP
request.

---

## Cross-Origin Script Policy

The `crossOriginMixins` option on the root SmarkForm instance controls scripts from
external (cross-origin) mixin templates:

| Value | Behavior |
|-------|----------|
| `"block"` *(default)* | Throws `MIXIN_SCRIPT_CROSS_ORIGIN_BLOCKED` |
| `"noscript"` | Renders the template but discards `<script>` silently |
| `"allow"` | Executes cross-origin scripts without restriction |

Same-origin and local (`#id`) templates are never restricted.

---

## Normative Error Codes

| Code | When thrown |
|------|-------------|
| `MIXIN_TYPE_MISSING_FRAGMENT` | `type` contains `#` but fragment is empty |
| `MIXIN_TEMPLATE_NOT_FOUND` | `<template id="...">` not found in the target document |
| `MIXIN_TEMPLATE_INVALID_ROOT` | Template has ≠1 non-script/style root elements |
| `MIXIN_TEMPLATE_ROOT_HAS_NAME` | Template root's `data-smark` specifies `"name"` |
| `MIXIN_CIRCULAR_DEPENDENCY` | Template directly or indirectly references itself |
| `MIXIN_SCRIPT_CROSS_ORIGIN_BLOCKED` | Cross-origin script and policy is `"block"` |

---

## `<template>` Placement in Lists

When a `<template>` element is a **direct child of a `list`**, SmarkForm's template
role detection silently consumes it (as an unrecognised role). The templates must
be placed **outside** any list containers — as siblings of the list or deeper in the
document `<body>`.

---

## Testing Mixin Features

Unit tests live in `test/mixin_types.tests.js` and cover 19 scenarios:
- Local expansion, name/option/attribute merging
- `<style>` injection and dedup
- Per-instance `<script>` with `this` bound to component
- Nested mixin expansion
- All 6 error codes
- External template loading + cache

Co-located showcase tests for `period_mixin_duplicable` in
`docs/_about/showcase.md` verify the end-to-end behavior:
- Outer ➕ "Add Period" button correctly prefills dates (start_date = prev.end_date + 1 day)
- The ✨ clone button and the ➕ outer button produce **identical** computed dates
