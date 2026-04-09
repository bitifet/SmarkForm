---
title: Error Codes Reference
layout: chapter
permalink: /advanced_concepts/error_codes
nav_order: 8

---

{% include links.md %}

# {{ page.title }}

SmarkForm uses named error codes so that application code can distinguish error
causes programmatically.  Every error thrown by SmarkForm's `renderError`
helper includes:

* `code` — the constant string identifier listed in this reference.
* `message` — a human-readable explanation of what went wrong.
* `path` — the component path (e.g. `/person/firstName`) where the error occurred.

Errors fired through the event system (e.g. when a list tries to exceed
`max_items`) are delivered as `"error"` events carrying `{ code, message }`
rather than thrown exceptions; you can intercept them with an `onError`
listener.

---

## Mixin Types

These errors are thrown during mixin template expansion (see
[Mixin Types]({{ "/advanced_concepts/mixin_types" | relative_url }})).

### `MIXIN_TYPE_MISSING_FRAGMENT`

A mixin type reference does not contain a `#<templateId>` fragment.

**Example:** `"type": "widgets.html"` — no `#id` after the URL.

**Fix:** Always include a `#templateId` fragment, e.g. `"type": "widgets.html#myWidget"`.

---

### `MIXIN_EXTERNAL_FETCH_BLOCKED`

The mixin type reference includes a URL part but `allowExternalMixins` is
`"block"` (the default).  No network request was made.

**Fix:** Set `allowExternalMixins: "same-origin"` or `"allow"` on the root
SmarkForm instance to permit external template loading.  See
[Security Considerations]({{ "/advanced_concepts/security_considerations" | relative_url }}#mixin-external-template-loading--allowexternalmixins).

---

### `MIXIN_CROSS_ORIGIN_FETCH_BLOCKED`

The mixin type reference points to a cross-origin URL but `allowExternalMixins`
is `"same-origin"`.

**Fix:** Either move the template to the same origin or set
`allowExternalMixins: "allow"` if you trust the remote origin.

---

### `MIXIN_FETCH_ERROR`

An HTTP error occurred while fetching an external mixin template (e.g. a 404
or 500 response).

**Fix:** Verify the template URL and that the server is reachable and returns
the expected HTML document.

---

### `MIXIN_CIRCULAR_DEPENDENCY`

A mixin references itself directly or indirectly (e.g. template A expands
template B which expands template A again).

**Fix:** Restructure the mixin templates to remove the cycle.

---

### `MIXIN_TEMPLATE_NOT_FOUND`

No `<template>` element with the given `id` exists in the target document
(either the current page or the fetched external document).

**Fix:** Make sure the `id` in the `#fragment` matches an actual `<template
id="…">` element in the document.

---

### `MIXIN_TEMPLATE_INVALID_ROOT`

The `<template>` does not contain exactly one root element.  Top-level
`<style>` and `<script>` elements are excluded from this count, but any other
content (zero elements, or two or more non-style/script elements) is invalid.

**Fix:** Ensure the template has exactly one root element node (plus optional
top-level `<style>` and `<script>` siblings).

---

### `MIXIN_TEMPLATE_ROOT_HAS_NAME`

The template root element's `data-smark` options specify a `name` property.
Names may only be set on the placeholder (the usage site), not on the template
root itself.

**Fix:** Remove `"name": "…"` from the template root's `data-smark`; set the
name on the placeholder element instead.

---

### `MIXIN_SCRIPT_LOCAL_BLOCKED`

The mixin template (loaded from a local in-page `<template>`) contains a
top-level `<script>` and `allowLocalMixinScripts` is `"block"` (the default).

**Fix:** Set `allowLocalMixinScripts: "allow"` to execute the script, or
`"noscript"` to silently discard it.  See
[Security Considerations]({{ "/advanced_concepts/security_considerations" | relative_url }}#mixin-script-execution--allowlocalmixinscripts-allowsameoriginmixinscripts-allowcrossoriginmixinscripts).

---

### `MIXIN_SCRIPT_SAME_ORIGIN_BLOCKED`

The mixin template was fetched from a same-origin URL and contains a top-level
`<script>`, but `allowSameOriginMixinScripts` is `"block"` (the default).

**Fix:** Set `allowSameOriginMixinScripts: "allow"` (or `"noscript"`).

---

### `MIXIN_SCRIPT_CROSS_ORIGIN_BLOCKED`

The mixin template was fetched from a cross-origin URL and contains a top-level
`<script>`, but `allowCrossOriginMixinScripts` is `"block"` (the default).

**Fix:** Set `allowCrossOriginMixinScripts: "allow"` (or `"noscript"`).
Only use `"allow"` if you fully control and trust that external origin.

---

### `MIXIN_NESTED_SCRIPT_DISALLOWED`

A `<script>` element was found *inside* the template's root subtree.  Nested
scripts are unconditionally forbidden; scripts must be direct siblings of the
root element inside the `<template>`, not children of it.

**Fix:** Move the `<script>` out of the root element to the top level of the
`<template>` (as a sibling of the root):

```html
<template id="myWidget">
  <div data-smark='{"type":"input"}'>…</div>
  <script>/* sibling of root — OK */</script>
</template>
```

---

## Component (Core)

These errors come from the core component lifecycle in `src/lib/component.js`.

### `INVALID_PARENT`

A SmarkForm component was constructed without a valid SmarkForm parent.  This
is an internal consistency error that should not occur in normal usage.

---

### `INVALID_OPTIONS_OBJECT`

The `data-smark` attribute value is neither a valid JSON object nor a plain
type-name shorthand (a string matching `[A-Za-z0-9_-]+`).

**Example:** `data-smark='not-json-but-has-spaces'`

**Fix:** Use a valid JSON object (`data-smark='{"type":"input"}'`) or a bare
type name (`data-smark="input"`).

---

### `SINGLETON_OPTION_CONFLICT`

A Singleton Pattern component and its only child both specify the same
`data-smark` option key.  Options must appear at exactly one level.

**Fix:** Remove the duplicated key from either the parent or child element.

---

### `ACTION_IN_NON_TRIGGER`

A `data-smark` object contains an `"action"` property alongside an explicit
`"type"` that is not `"trigger"`.  Buttons that trigger actions must either
omit `"type"` (it will be inferred as `"trigger"`) or set `"type":"trigger"`
explicitly.

**Fix:** Remove the `"type"` override or change it to `"trigger"`.

---

### `NO_TYPE_PROVIDED`

A non-action element has no determinable type: neither `"type"` was set in
`data-smark`, nor could a type be inferred from the HTML element tag.

**Fix:** Add a `"type"` property to the element's `data-smark` attribute.

---

### `UNKNOWN_TYPE`

The `"type"` string in `data-smark` does not correspond to any registered
SmarkForm component type and is not a mixin reference (i.e. it does not start
with `#`).

**Fix:** Use a valid built-in type name (`"input"`, `"form"`, `"list"`,
`"label"`, `"trigger"`, `"color"`, `"date"`, `"datetime-local"`, `"time"`,
`"number"`, `"radio"`) or a registered mixin reference.

---

### `UNKNOWN_ACTION`

A trigger element specifies an `"action"` that does not exist on the resolved
`context` component.

**Fix:** Verify the `"action"` name is correctly spelled and that the
`"context"` path resolves to a component that exposes that action.

---

## Fields

### `VALUE_CONFLICT`

An element has both a `"value"` key in its `data-smark` options **and** an
HTML `value` attribute.  Both cannot be used simultaneously.

**Fix:** Remove one of the two: either the `"value"` from `data-smark` or the
HTML `value=""` attribute.

---

## Form

### `REPEATED_FIELD_NAME`

Two or more fields at the same form level share the same `name`.  Field names
within a form must be unique.

**Fix:** Give each field a distinct `"name"` in its `data-smark` options (or
remove the `name` from the duplicate and rely on the auto-generated name).

---

## Input

### `NOT_A_SINGLETON`

A form component using the Singleton Pattern (only one child is expected) was
found to contain more than one data field child.

**Fix:** A Singleton must wrap exactly one field.  Remove or relocate extra
fields.

---

### `SINGLETON_TYPE_MISMATCH`

A Singleton component declares a `"type"` in its own `data-smark` that
conflicts with the actual type of its single child field.

**Fix:** Ensure the Singleton wrapper's `"type"` matches the inner field's
type, or omit it and let SmarkForm infer it.

---

## Label

### `EXTRA_FIELD_IN_LABEL`

A `label` component found more than one data-field child.  A label can wrap
at most one target field.

**Fix:** Keep only one field inside the label component.

---

### `LABEL_EXPLICIT_TARGET`

A `label` component that wraps its target field also specifies an explicit
`"target"` option in `data-smark`.  These two ways of associating a label
with a field are mutually exclusive.

**Fix:** Either wrap the field directly (no `"target"`) or use a `"target"`
path to point at a field elsewhere (no wrapped field child).

---

### `LABEL_FOR_NONFIELD`

A native HTML `<label for="…">` element (rendered as a SmarkForm `label`
component) targets a component that does not have a native form field node
(`targetFieldNode`).  Native `<label>` can only point to natively focusable
field elements.

**Fix:** Use a different HTML tag (e.g. `<span>`) for labels that target
non-native SmarkForm components, or ensure the target component renders a
native field element.

---

## List

### `LIST_DUPLICATE_TEMPLATE`

Two children of a `list` component declare the same template role
(`data-smark='{"role":"item"}'`, `"header"`, `"footer"`, etc.).

**Fix:** Each role may only appear once inside a list.  Remove the duplicate.

---

### `LIST_UNKNOWN_TEMPLATE_ROLE`

A child element of a `list` component has a `data-smark` role that is not
one of the recognised list template roles (`"item"`, `"header"`, `"footer"`,
`"separator"`, `"last_separator"`, `"empty_list"`, `"placeholder"`).

**Fix:** Use a valid role name, or remove `"role"` to default to `"item"`.

---

### `LIST_CONTAINS_ID`

The list `item` template contains one or more elements with an `id` attribute.
IDs inside templates are forbidden because each cloned list item would produce
duplicate IDs in the page, breaking HTML validity.

**Fix:** Remove all `id` attributes from the item template.  Use `class`
or `data-*` attributes for styling and scripting hooks instead.

---

### `LIST_ITEM_TYPE_MISMATCH`

The list declares an `"of"` type option but the item template's root element
has a different type.

**Fix:** Either remove `"of"` from the list options or update it to match the
item template's actual type.

---

### `FIELD_IN_WRONG_LIST_TEMPLATE`

A data field was found inside a list's `"header"` or `"footer"` template.
Only the `"item"` template (and its clones) may contain data fields.

**Fix:** Move all data fields into the item template.  Header and footer
templates are for structural/decorative content only.

---

### `LIST_IMPORT_OVERFLOW` *(event, not exception)*

Delivered as an `"error"` event when `import()` is called with an array
that has more items than the list's `max_items` setting.  Items beyond the
limit are silently discarded after the event fires.

**Handle with:**

```js
const list = await myForm.find('/items');
list.on('error', ({ code, message }) => {
  if (code === 'LIST_IMPORT_OVERFLOW') {
    console.warn('Import truncated:', message);
  }
});
```

---

### `LIST_MAX_ITEMS_REACHED` *(event, not exception)*

Delivered as an `"error"` event when `addItem()` is called but the list
already has `max_items` items and `failback` is `"throw"` (the default).

**Handle with:** Listen for `"error"` events on the list component, or set
`failback: "none"` in the `addItem` call to silently ignore the limit.

---

### `LIST_MIN_ITEMS_REACHED` *(event, not exception)*

Delivered as an `"error"` event when `removeItem()` is called but the list
already has `min_items` items and `failback` is `"throw"` (the default).

**Handle with:** Listen for `"error"` events on the list component, or set
`failback: "none"` (or `"clear"`) in the `removeItem` call.

---

### `LIST_WRONG_ADDITEM_POSITION`

The `position` option passed to `addItem()` is not `"before"` or `"after"`.

**Fix:** Use `position: "before"` or `position: "after"` (the default).

---

## Native Type Parsing Errors

The `color`, `date`, `datetime-local`, `time`, `number`, and `radio`
component types delegate to the browser's native parsing and may re-throw
browser-generated errors under the corresponding error code.  These errors
typically indicate a programmatically-imported value that the browser's
underlying `<input>` cannot parse.

**Fix:** Ensure the value passed to `import()` (or set as a default) is a
valid string for the field's native type (e.g. `"#rrggbb"` for color,
`"YYYY-MM-DD"` for date, `"HH:MM:SS"` for time, a finite number string for
number, and a matching option value for radio).
