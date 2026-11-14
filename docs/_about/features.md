---
title: Features
layout: chapter
description: "SmarkForm's core HTML-to-component-tree model, developer-facing benefits, additional capabilities, and deliberate limits."
permalink: "/about/features"
nav_order: 2
---

{% include links.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {% include chaptertoc/features.html depth=3 %}

</details>

## The core model

### Your HTML and CSS stay yours {#markup-agnostic}

Add `data-smark` to the elements SmarkForm should manage. SmarkForm enhances
that subtree in place; it does not replace it with a schema, a renderer, or a
required layout.

```html
<input name="user" type="text" data-smark>
```

Then initialize the root:

```javascript
const myForm = new SmarkForm(form_container);
```

SmarkForm imposes no HTML structure and no CSS reset. Designers keep control of
markup, layout, and styling. Developers get a form model without rewriting the
page as framework components.

👉 See [Quick Start]({{ "/start_here/quick_start" | relative_url }}) for the
smallest complete example.

### Declarative fields and typed values {#declarative-fields}

The type and name can often be inferred from the element and its `name`
attribute; the `data-smark` JSON object is available when you need to be
explicit or combine options:

```html
<input data-smark name="email" type="email">
<input data-smark='{"type":"number","name":"quantity","min":1}'>
<select data-smark name="country">…</select>
```

SmarkForm provides field types for text-like inputs, numbers, dates and times,
colors, checkboxes, radios, selects, and media. Typed fields are coerced to the
appropriate JavaScript type instead of remaining strings. Empty numeric and
date/time fields export as `null`, which keeps “missing” distinct from `0` or
`""`.

The progression is intentional: start with the least noisy attribute, use
`data-smark-*` for simple options, and use the JSON object when you need
structured configuration. Prefixed attributes override matching keys in the
JSON object.

👉 See [Core Concepts]({{ "/start_here/core_concepts" | relative_url }})
for the syntax rules.

### Nested forms {#nestable-forms}

Forms are fields of type `form`. They export their children as a JSON object
and can nest to any depth:

```html
<fieldset data-smark='{"type":"form","name":"details"}'>
  <!-- ... -->
</fieldset>
```

The whole SmarkForm-enhanced root is itself a form, so the same import/export
and traversal rules apply at every level. See the [Form
reference]({{ "/component_reference/form" | relative_url }}).

### Variable-length lists {#variable-length-lists}

Lists export arrays, grow and shrink at runtime, and can enforce minimum and
maximum item counts:

```html
<ul data-smark='{"type":"list","name":"contacts","min_items":0,"max_items":10}'>
  <li>
    <input data-smark name="email" type="email">
    <button data-smark='{"action":"removeItem"}'>Remove</button>
  </li>
</ul>

<button data-smark='{"action":"addItem","context":"contacts"}'>Add contact</button>
```

Add, remove, insert, prune, and clearing operations are available as actions or
methods. With `sortable: true`, items can be reordered by drag and drop (and
between nested lists with `moving_depth`). Automatic sorting by field value is
**not implemented**; the current feature is manual drag-and-drop sorting.

👉 See the [List reference]({{ "/component_reference/list" | relative_url }}) for
item templates, position metadata, `min_items`/`max_items`, and sortable-list
behavior.

### JSON import and export {#json-based}

Import and export move ordinary JavaScript data through the component tree:

```javascript
myForm.import({ name: "Ada", contacts: [{ email: "ada@example.com" }] });
const data = myForm.export();
```

The same operations are available as actions from markup, and as methods on any
field or subform:

```html
<button data-smark='{"action":"export"}'>Export</button>
<button data-smark='{"action":"import","context":"details"}'>Import details</button>
```

Objects map to forms, arrays map to lists, and scalar values map to fields. You
can export the whole form or just one branch.

👉 See [Data Import and
Export]({{ "/guides/data_import_and_export" | relative_url }}).

### Address fields by path, not DOM position {#directory-like-addressability}

Fields have names and a position in the **form** tree, which is independent of
the DOM nesting introduced by layout wrappers. Actions and API calls can use:

* natural context — the nearest ancestor that implements the requested action;
* relative paths such as `contacts`, `../organizer`, or `.-1`;
* absolute paths from the root, such as `/organizer/email`;
* wildcard contexts for operations that apply to many matching fields.

Triggers themselves do not count as path nodes.

👉 See [Form Traversing]({{ "/guides/form_traversing" | relative_url }}) and
the [Trigger reference]({{ "/component_reference/trigger" | relative_url }}).

### Declarative actions and context {#easy-to-use-low-code}

Triggers reach their target fields through their **context** or a relative path.
They do not need DOM selectors or wiring in JavaScript:

```html
<button data-smark='{"action":"addItem","context":"contacts"}'>➕ Add contact</button>
<button data-smark='{"action":"export"}'>💾 Save</button>
```

Actions cover export, import, clear, add/remove list items, sorting, media
selection, and more. You can also call `.import()` and `.export()` directly
from application code, and listen to `BeforeAction_*` and `AfterAction_*`
events when you need to intervene.

👉 See [Form Traversing]({{ "/guides/form_traversing" | relative_url }}) for
`context` and path resolution, and the [Trigger
reference]({{ "/component_reference/trigger" | relative_url }}) for `target` and
action options.

## Developer benefits

### Context-driven hotkeys {#context-driven-hotkeys}

Add a `hotkey` to a trigger and SmarkForm exposes it only when the action is
reachable from the user's current field:

```html
<button data-smark='{"action":"addItem","hotkey":"+"}'>Add</button>
<button data-smark='{"action":"removeItem","hotkey":"-"}'>Remove</button>
<button data-smark='{"action":"export","hotkey":"s"}'>Save</button>
```

Holding `Ctrl` reveals the available shortcuts without leaving the keyboard.
Because hotkeys are resolved from the focused context, the same convenient key
can be reused in different parts of a form without conflict. SmarkForm reveals
the shortcuts that are reachable from the current focus.

👉 See [Hotkeys]({{ "/accessibility/hotkeys" | relative_url }}).

### Consistent keyboard navigation {#consistent-user-experience}

`Enter` and `Shift+Enter` move between fields and list items in form order,
including across nested forms and lists. `Tab` follows the browser's normal
focus order, and configured hotkeys provide additional actions. Lists receive
`aria-live="polite"` and `aria-atomic="true"`; actual assistive-technology
announcements have not been verified. Authors still own focus order, visible
focus styling, and custom keyboard interactions.

👉 See [Keyboard Navigation]({{ "/accessibility/keyboard_navigation" |
relative_url }}).

### Automatic list guardrails {#automatic-enablement}

List `addItem` and `removeItem` triggers are enabled or disabled as the list
reaches its `min_items` and `max_items` bounds. This keeps the UI consistent
without hand-written guards. Other actions keep their authored enabled state;
application code can enable or disable them when needed.

### Flexible, extendable component types {#flexible-and-extendable}

Custom component types can be registered with
`SmarkForm.createType(name, controller)`. Mixin types let a `<template>` define
a reusable component blueprint that is expanded in place, including external
templates with controlled fetch and script policies.

👉 See [Mixin Types]({{ "/guides/mixin_types" | relative_url }}) and [Field
Masking]({{ "/guides/field_masking" | relative_url }}) when you need behavior
beyond the built-in types.

## Additional capabilities

### Reliability-oriented value handling {#reliability-oriented}

SmarkForm handles empty values and `null` explicitly, avoids ambiguous `""` vs
`0` conversions, and re-renders list items consistently when data changes. It
also covers edge cases that are easy to miss in hand-written form code, such as
removing the correct item after reordering, nested list drops, and keeping
masked values in sync.

The details are documented rather than assumed; see the [FAQ]({{
"/about/faq" | relative_url }}) for the behaviors most likely to surprise you.

### Accessibility support and author responsibilities {#a11y-friendly}

SmarkForm wires labels to fields, preserves authored `aria-labelledby` tokens,
provides keyboard navigation and context-aware hotkeys, marks lists with
`aria-live` attributes, and sets `aria-busy` while the root renders. The
resulting screen-reader announcements have not been verified.

It cannot make arbitrary markup accessible. Authors remain responsible for
meaningful labels, semantic grouping, contrast, focus styling, error
announcements, and media alternatives.

{: .hint :}
> If you are an accessibility specialist—or have questions or concerns—join the
> [SmarkForm accessibility discussion](https://github.com/bitifet/SmarkForm/discussions/25).

👉 See [Accessibility]({{
"/accessibility/keyboard_navigation" | relative_url }}) and [Accessible Labels
and Names]({{ "/accessibility/accessible_labels_and_names" | relative_url }}).

### Media fields {#media-fields}

File, image, video, and audio fields share the same embedded-value model, with
native pickers, drag and drop, paste, validation hooks, and download actions.
They follow the same import/export shapes as other fields, so a file can be part
of a nested object or a list item without special-casing the form model.

👉 See [File]({{ "/component_reference/file" | relative_url }}), [Image]({{
"/component_reference/image" | relative_url }}), [Video]({{
"/component_reference/video" | relative_url }}), and [Audio]({{
"/component_reference/audio" | relative_url }}).

### Lightweight and dependency-free {#lightweight-yet-highly-compatible}

SmarkForm has no runtime dependencies and ships as ESM and UMD bundles. The
build used for this documentation produced a `dist/SmarkForm.umd.js` of about
109 KB minified and roughly 30 KB gzip. Treat that as a measured snapshot, not
a promise about every build: the exact size depends on version, selected
artifact, enabled features, and server compression.

The library is transpiled with Babel for compatibility and tested across
Chromium, Firefox, and WebKit, including a mobile-emulation project.

👉 See the
[FAQ]({{ "/about/faq" | relative_url }}#which-browsers-has-smarkform-been-tested-on)
for the current browser-support statement.

### AI-agent resources {#ai-agent-ready}

The project includes optional guidance for AI coding agents: a form-builder
skill, an advanced-internals skill, and agent-oriented usage pages. These are
aids for generating SmarkForm code from a description, not a runtime
dependency.

👉 See [AI Agents]({{ "/ai_agents/smarkform_forms" | relative_url }}) and the
[Developer Cheatsheet]({{ "/component_reference/cheatsheet" | relative_url }}).

## What SmarkForm does not do

SmarkForm is deliberately narrow. It does **not** provide:

* schema-based form generation;
* a built-in validation rule engine or automatic error messages;
* an official React, Vue, Svelte, or Angular adapter;
* a guarantee of accessibility conformance for arbitrary markup;
* a server-side security boundary.

Use native HTML constraint validation, `BeforeAction_*`/`AfterAction_*` event
hooks, and application-level checks for validation. Validate and authorize
every submission on the server. For a comparison of approaches, see [When
SmarkForm Fits]({{ "/about/when_smarkform_fits" | relative_url }}).

## Learn more

* [Introduction]({{ "/about/introduction" | relative_url }}) — the model in
  context.
* [Core Concepts]({{ "/start_here/core_concepts" | relative_url }}) — syntax,
  component types, and data mapping.
* [Using SmarkForm]({{ "/guides/using_smarkform" | relative_url }}) — a full
  developer walkthrough.
* [Component Reference]({{ "/component_reference/overview" | relative_url }}) —
  per-type options and edge cases.
* [Showcase]({{ "/showcase_examples/showcase" | relative_url }}) — larger
  working examples.
