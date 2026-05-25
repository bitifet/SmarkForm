---
title: Developer Cheatsheet
layout: chapter
permalink: /resources/cheatsheet
nav_order: 5

---

{% include links.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Installation &amp; Import](#installation--import)
    * [CDN (UMD — script tag)](#cdn-umd--script-tag)
    * [CDN (ESM — import)](#cdn-esm--import)
    * [npm](#npm)
    * [Downloaded copy](#downloaded-copy)
* [Basic Usage](#basic-usage)
    * [The `rendered` Promise](#the-rendered-promise)
* [The `data-smark` Attribute](#the-data-smark-attribute)
    * [Syntax forms](#syntax-forms)
    * [Special cases (no `data-smark` required)](#special-cases-no-data-smark-required)
* [Component Types](#component-types)
    * [Type inference](#type-inference)
    * [Singleton pattern](#singleton-pattern)
* [List Template Roles](#list-template-roles)
* [Actions](#actions)
    * [`@action` decorator convention](#action-decorator-convention)
* [Context &amp; Target Resolution](#context--target-resolution)
    * [Context path syntax](#context-path-syntax)
    * [Target semantics](#target-semantics)
* [Event System](#event-system)
    * [Three listener levels](#three-listener-levels)
    * [Supported event types](#supported-event-types)
    * [Modifying data in BeforeAction handlers](#modifying-data-in-beforeaction-handlers)
* [Data Import / Export](#data-import--export)
    * [setDefault behavior](#setdefault-behavior)
    * [exportEmpties inheritance](#exportempties-inheritance)
    * [Copy pattern (export + target)](#copy-pattern-export--target)
* [API Methods](#api-methods)
* [Constructor Options](#constructor-options)
* [Hotkeys](#hotkeys)
* [Form Submission](#form-submission)
* [CSS Grid Layout](#css-grid-layout)
* [Quick Templates](#quick-templates)
    * [Simple form](#simple-form)
    * [Nested form](#nested-form)
    * [List with all template roles](#list-with-all-template-roles)
    * [Trigger with context and target](#trigger-with-context-and-target)
    * [Sortable list](#sortable-list)

<!-- vim-markdown-toc -->
     " | markdownify }}

</details>

---

## Installation &amp; Import

### CDN (UMD — script tag)

```html
<script src="https://cdn.jsdelivr.net/npm/smarkform@{{ site.data.package.version }}/dist/SmarkForm.umd.js"></script>
<script>const f = new SmarkForm(document.getElementById("myForm"));</script>
```

### CDN (ESM — import)

```html
<script type="module">
  import SmarkForm from "{{ smarkform_esm_cdn_current }}";
  const f = new SmarkForm(document.getElementById("myForm"));
</script>
```

### npm

```bash
npm install smarkform
```

```javascript
import SmarkForm from "smarkform";
```

### Downloaded copy

Grab `dist/SmarkForm.esm.js` or `dist/SmarkForm.umd.js` from the repo and load as a local script.

---

## Basic Usage

```javascript
const myForm = new SmarkForm(document.getElementById("myForm"));
```

The root element does **not** need `data-smark` — it is enhanced automatically. All descendants with `data-smark` are recursively enhanced.

### The `rendered` Promise

`find()` returns `null` until rendering completes:

```javascript
// WRONG — find returns null
const field = myForm.find("/name");

// CORRECT — await rendered
await myForm.rendered;
const field = myForm.find("/name");

// ALSO CORRECT — onRendered callback
myForm.onRendered(() => {
  const field = myForm.find("/name");
});
```

---

## The `data-smark` Attribute

### Syntax forms

| Form | Example | When to use |
|------|---------|-------------|
| Full JSON object | `data-smark='{"type":"list","name":"items","of":"input"}'` | Full control |
| Type shorthand | `data-smark="list"` | Defaults for that type |
| Bare attribute | `data-smark` | Type/name inferred from HTML |
| With `data-smark="data-smark"` | `data-smark="data-smark"` | Treated as empty options |

### Special cases (no `data-smark` required)

1. The **root element** passed to the constructor.
2. A **list's item template** (the sole direct child before render).

---

## Component Types

| Type | Data Type | Default Value | Tag Inference |
|------|-----------|---------------|---------------|
| `form` | JSON object (`{}`) | `{}` | `<form>`, `<div>`, any container |
| `list` | JSON array (`[]`) | `[]` | `<ul>`, `<ol>`, `<table>`, `<thead>`, `<tbody>`, `<tfoot>` |
| `input` | String | `""` | `<input>`, `<textarea>`, `<select>` |
| `number` | Number or `null` | `null` | `<input type="number">` |
| `date` | ISO date or `null` | `null` | `<input type="date">` |
| `time` | HH:mm:ss or `null` | `null` | `<input type="time">` |
| `datetime-local` | ISO datetime or `null` | `null` | `<input type="datetime-local">` |
| `color` | Hex color or `null` | `null` | `<input type="color">` |
| `radio` | Selected value or `null` | `null` | Radio button group |
| `trigger` | N/A (no value) | N/A | Any element with `action` property |
| `label` | N/A (read-only) | N/A | `<label>` |
| mixin | Depends on template | Varies | `data-smark='{"type":"url#templateId"}'` |

### Type inference

If no `type` is specified, SmarkForm infers from the element tag (see table above). Elements with an `action` property → `trigger`.

### Singleton pattern

When an `input`-derived type is placed on a **container element** (not the native input itself), it wraps exactly one real field:

```html
<li data-smark="input">
  <input data-smark type="tel">
  <button data-smark='{"action":"removeItem"}'>✕</button>
</li>
```

---

## List Template Roles

Set role via `data-smark='{"role":"<role>"}'`. Every direct child of a list is treated as a template — **all are removed from the DOM** during init.

| Role | Purpose | Required? | Cloned? | Notes |
|------|---------|-----------|---------|-------|
| `item` (default) | Repeating item template | Yes | Yes | Actual data items |
| `empty_list` | Shown when list is empty | No | No | Auto-managed by `renum()` |
| `header` | Prepended once before items | No | No | No data fields allowed |
| `footer` | Appended once after items | No | No | No data fields allowed |
| `placeholder` | DOM filler for fixed-width grids | No | Yes | Only when `max_items` set |
| `separator` | Between adjacent items | No | Yes | Removed when only 1 item |
| `last_separator` | Between 2nd-last &amp; last items | No | Yes | Falls back to `separator` |

---

## Actions

| Action | Target Type | Description |
|--------|-------------|-------------|
| `export` | Any | Returns current value as JSON |
| `import` | Any | Sets value from JSON data |
| `reset` | Any | Restores `defaultValue` |
| `clear` | Any | Resets to type-level `emptyValue` |
| `addItem` | list | Adds a new item |
| `removeItem` | list | Removes target item(s) |
| `submit` | form | Submits form data via HTTP |
| `count` | list | Gets/sets total item count display |
| `position` | list item | Gets/sets 1-based index display |
| `move` | list (sortable) | Moves item within/across lists |
| custom | any | Defined via `customActions` constructor option |

### `@action` decorator convention

Every action: `async actionName(data, options = {})`

- `data` is the **first** positional argument (payload)
- `options` is the **second** (control flags like `silent`, `focus`)

```javascript
// Correct:
await me.addItem(null, { silent: true });
// Wrong — options lands in data param:
await me.addItem({ silent: true });
```

Calling via `actions.*` fires events and defaults focus; calling prototype directly does not:

```javascript
await component.actions.reset(data, options);  // Fires events, auto-focus
await component.reset(data, options);          // No events, no auto-focus
```

---

## Context &amp; Target Resolution

- **Natural context**: walks up ancestors to find first component implementing the action.
- **Explicit context** (`context` property): path resolved from the **trigger's enclosing field component** (triggers themselves are not path nodes).

```html
<!-- Natural context -->
<button data-smark='{"action":"clear"}'>Clear</button>

<!-- Explicit context -->
<button data-smark='{"action":"export","context":"demo"}'>Export Demo</button>
<button data-smark='{"action":"export","context":"/shipping"}'>Export Shipping</button>
```

### Context path syntax

| Path | Resolves to |
|------|-------------|
| `"name"` | Sibling component named "name" |
| `"/"` | Root form |
| `"."` | Current field |
| `"..fieldname"` | Named field in **parent** scope |
| `".-1"` | Previous list item sibling |
| `".+1"` | Next list item sibling |
| `"../sibling"` | Sibling of parent |
| `"items/*"` | All children matching wildcard |

### Target semantics

When used with `export`: exports the context, then **imports** the result into the target (copy).

```html
<!-- Copy billing → shipping -->
<button data-smark='{
  "action":"export",
  "context":"billing",
  "target":"../shipping"
}'>Copy to Shipping</button>
```

| Combination | Result |
|-------------|--------|
| `export` + `target` | Export context → import into target |
| `import` + `target` | Export from target → import into context |
| `removeItem` + `target:"*"` | Remove ALL items |
| `removeItem` + `preserve_non_empty:true` | Remove only empty items |

**Pitfall**: `target:"shipping"` looks for a **child** of the context named "shipping". Use `target:"../shipping"` to navigate up then to a sibling.

---

## Event System

### Three listener levels

| Method | Scope | Bubbles? |
|--------|-------|----------|
| `component.on(ev, handler)` | Component + ancestors | Yes, if event says `bubbles:true` |
| `component.onLocal(ev, handler)` | Only this component | Never |
| `component.onAll(ev, handler)` | Component + ancestors | Always |

### Supported event types

**DOM events** (capture-phase on root, dispatched to target component):
`keydown`, `keyup`, `keypress`, `beforeinput`, `input`, `change`, `focus`, `blur`, `focusin`, `focusout`, `click`, `dblclick`, `mousedown`, `mouseup` ...

**Synthetic SmarkForm events:**
`focusenter`, `focusleave`, `BeforeAction_<name>` (preventable), `AfterAction_<name>`, `beforeRender`, `afterRender`, `beforeUnrender`, `removeItem_beforeRender`, `removeItem_afterRender`

**Constructor shorthand:**
```javascript
const f = new SmarkForm(element, {
  onLocal_AfterAction_export(ev) { /* target-phase only */ },
  on_click(ev) { /* bubbles like DOM */ },
  onAll_focus(ev) { /* always bubbles */ },
  onBeforeAction_import(ev) { ev.preventDefault(); },
});
```

### Modifying data in BeforeAction handlers

```javascript
component.onLocal("BeforeAction_import", (ev) => {
  ev.data = transformData(ev.data); // swap in new data
});
```

---

## Data Import / Export

```javascript
await form.export();                   // Full form object
await form.find("/name").export();     // Single field value
await form.import({ name: "Alice" });  // Import data
await form.find("/name").import("Bob");
```

### setDefault behavior

| Call | Updates default? | `reset()` restores |
|------|-----------------|-------------------|
| `import(data)` | Yes | `data` (with `exportEmpties:true`) |
| `import(data, {setDefault:false})` | No | Previous default |
| `import(undefined)` | No (always skipped) | Current default |
| `clear()` | No | Default unchanged |
| `reset()` | No | Current default |

### exportEmpties inheritance

`exportEmpties` is inherited from the nearest ancestor that sets it. Explicitly reset on nested lists:

```html
<div data-smark='{"type":"list","name":"outer","exportEmpties":true}'>
  <div data-smark='{"type":"list","name":"inner","exportEmpties":false}'></div>
</div>
```

### Copy pattern (export + target)

```javascript
await billingField.actions.export(null, { target: "/shipping" });
```

---

## API Methods

Every field component exposes:

| Method | Description |
|--------|-------------|
| `export(data, options)` | Returns current value |
| `import(data, options)` | Sets value from data |
| `clear(options)` | Resets to type-level empty |
| `reset(options)` | Restores `defaultValue` |
| `isEmpty()` | `true` if field has no meaningful data |
| `find(path)` | Navigate by path string |
| `getPath()` | Absolute path (e.g. `"/address/street"`) |
| `focus(options)` | Focus the field |
| `moveTo()` | Scroll to and highlight this field |
| `onRendered(callback)` | Run callback after render |
| `on(ev, handler)` | Listen with bubbling |
| `onLocal(ev, handler)` | Listen target-phase only |
| `onAll(ev, handler)` | Listen always-bubbling |
| `emit(evType, data, preventable)` | Emit custom event |
| `getTriggers(actionName, limit)` | Find trigger buttons targeting this component |
| `updateId()` | Auto-generate `id` from `autoId` option |
| `inheritedOption(name, default)` | Walk ancestors for option value |

---

## Constructor Options

Pass as second argument to `new SmarkForm(element, options)`:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `value` | Object | `{}` | Initial data to import at construction |
| `customActions` | Object | `{}` | Custom action implementations |
| `autoId` | Boolean/String/Function | `false` | Auto-generate element IDs |
| `allowExternalMixins` | String | `"block"` | Policy for external mixin fetching |
| `allowLocalMixinScripts` | String | `"block"` | Policy for local mixin `<script>` execution |
| `allowSameOriginMixinScripts` | String | `"block"` | Policy for same-origin mixin scripts |
| `allowCrossOriginMixinScripts` | String | `"block"` | Policy for cross-origin mixin scripts |
| `enableJsonEncoding` | Boolean | `false` | Enable `enctype="application/json"` |
| `exportEmpties` | Boolean | `false` | Whether to export empty items |
| `keyStyle` | `"bracket"`/`"dot"` | `"bracket"` | Form encoding key style |
| `arrayStyle` | `"repeat"`/`"index"` | `"repeat"` | Form encoding array style |
| `focus_on_click` | Boolean | `true` | Focus form containers on click |
| `on*` | Function | — | Event handlers (e.g. `on_click`, `onLocal_AfterAction_export`) |

---

## Hotkeys

Triggers with a `hotkey` property reveal hotkey hints when **Ctrl** (level 1) or **Ctrl+Alt** (level 2) is pressed:

```html
<button data-smark='{"action":"addItem","hotkey":"+"}'>Add</button>
<button data-smark='{"action":"removeItem","hotkey":"-"}'>Remove</button>
```

- Hints appear as `data-hotkey` attribute on trigger elements.
- Style with CSS: `[data-hotkey]::after { content: attr(data-hotkey); ... }`
- Triggers with hotkeys are excluded from tab navigation (`tabindex="-1"`).

---

## Form Submission

```html
<form action="/api/submit" method="post">
  <!-- SmarkForm fields -->
  <button type="submit" data-smark='{"action":"submit"}'>Submit</button>
</form>
```

- **Enter key** navigates between fields — does **not** submit.
- Only explicit click on submit-type buttons triggers submission.
- Supports `application/json` submission (`enableJsonEncoding: true`).
- Respects `formaction`, `formmethod`, `formenctype`, `formtarget` on submit buttons.

---

## CSS Grid Layout

SmarkForm removes direct children (templates) during init, so target rendered elements via `data-role`:

```css
.list-container {
  display: grid;
  grid-template-columns: 10em 1fr auto;
  align-items: center;
}
.list-container > [data-role="header"]    { grid-column: 1; }
.list-container > [data-role="item"]      { grid-column: 2; }
.list-container > [data-role="footer"]    { grid-column: 3; }
.list-container > [data-role="placeholder"] { display: none; }
```

---

## Quick Templates

### Simple form

```html
<div id="myForm">
  <label data-smark>Name:</label>
  <input name="name" data-smark>
  <label data-smark>Email:</label>
  <input name="email" type="email" data-smark>
  <button data-smark='{"action":"clear"}'>Clear</button>
  <button data-smark='{"action":"export"}'>Export</button>
</div>
<script>new SmarkForm(document.getElementById("myForm"));</script>
```

### Nested form

```html
<div data-smark='{"type":"form","name":"address"}'>
  <input name="street" data-smark>
  <input name="city" data-smark>
</div>
```

### List with all template roles

```html
<div data-smark='{"type":"list","name":"items","min_items":0,"max_items":5}'>
  <div><input name="name" data-smark></div>
  <div data-smark='{"role":"empty_list"}'>No items yet.</div>
  <div data-smark='{"role":"header"}'><b>Items:</b></div>
  <div data-smark='{"role":"footer"}'>
    <button data-smark='{"action":"addItem","hotkey":"+"}'>Add</button>
  </div>
  <hr data-smark='{"role":"separator"}'>
</div>
```

### Trigger with context and target

```html
<button data-smark='{
  "action":"export",
  "context":"billing",
  "target":"/shipping"
}'>Copy to Shipping</button>

<button data-smark='{
  "action":"removeItem",
  "context":"/items",
  "target":"*"
}'>Remove All Items</button>
```

### Sortable list

```html
<ul data-smark='{"type":"list","name":"pets","sortable":true,"min_items":0}'>
  <li>
    <label data-smark title="Drag to reorder">☰</label>
    <input name="name" data-smark>
    <button data-smark='{"action":"removeItem"}'>✕</button>
  </li>
</ul>
```
