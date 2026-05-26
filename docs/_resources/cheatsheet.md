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

* [Constructor Options](#constructor-options)
* [The `data-smark` Attribute](#the-data-smark-attribute)
* [Component Types](#component-types)
* [List Template Roles](#list-template-roles)
* [Actions](#actions)
* [Context & Target Resolution](#context-target-resolution)
* [Event System](#event-system)
* [Data Import / Export](#data-import-export)
* [API Methods](#api-methods)
* [Hotkeys](#hotkeys)
* [Form Submission](#form-submission)
* [Quick Templates](#quick-templates)
    * [Simple form](#simple-form)
    * [Nested form](#nested-form)
    * [List with all template roles](#list-with-all-template-roles)
    * [Trigger with context and target](#trigger-with-context-and-target)
    * [Sortable list](#sortable-list)
    * [Tooltip mixin with CSS](#tooltip-mixin-with-css)

<!-- vim-markdown-toc -->
   " | markdownify }}

</details>

---

## Constructor Options

```javascript
const form = new SmarkForm(element, options);
```

> **Note:** `find()` returns `null` until rendering completes — [`await form.rendered`]({{ "advanced_concepts/the_smarkform_constructor" | relative_url }}#the-rendered-promise) first.  
> See: [Full constructor reference]({{ "advanced_concepts/the_smarkform_constructor" | relative_url }}#how-constructor-options-work)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `value` | Object | `{}` | [Initial data]({{ "component_types/type_form" | relative_url }}#value) |
| `customActions` | Object | `{}` | [Custom action implementations]({{ "advanced_concepts/the_smarkform_constructor" | relative_url }}#customactions) |
| `autoId` | Boolean/String/Function | `false` | [Auto-generate element IDs]({{ "component_types/type_form" | relative_url }}#autoid) |
| `allowExternalMixins` | String | `"block"` | [External mixin fetching policy]({{ "advanced_concepts/mixin_types" | relative_url }}#mixin-security-options) |
| `allowLocalMixinScripts` | String | `"block"` | [Local mixin `<script>` policy]({{ "advanced_concepts/mixin_types" | relative_url }}#mixin-security-options) |
| `allowSameOriginMixinScripts` | String | `"block"` | [Same-origin mixin script policy]({{ "advanced_concepts/mixin_types" | relative_url }}#mixin-security-options) |
| `allowCrossOriginMixinScripts` | String | `"block"` | [Cross-origin mixin script policy]({{ "advanced_concepts/mixin_types" | relative_url }}#mixin-security-options) |
| `enableJsonEncoding` | Boolean | `false` | [Enable `enctype`]({{ "component_types/type_form" | relative_url }}#encoding-and-transport) |
| `exportEmpties` | Boolean | `false` | [Export empty items]({{ "component_types/type_list" | relative_url }}#exportempties) |
| `keyStyle` | `"bracket"` / `"dot"` | `"bracket"` | [Form encoding key style]({{ "component_types/type_form" | relative_url }}#data-flattening-options) |
| `arrayStyle` | `"repeat"` / `"index"` | `"repeat"` | [Form encoding array style]({{ "component_types/type_form" | relative_url }}#data-flattening-options) |
| `focus_on_click` | Boolean | `true` | [Focus containers on click]({{ "component_types/type_form" | relative_url }}#focus_on_click) |
| `on*` | Function | — | [Event handlers]({{ "advanced_concepts/the_smarkform_constructor" | relative_url }}#on-event-handlers) (`on_click`, `onLocal_AfterAction_export`, etc.) |

---

## The `data-smark` Attribute

| Form | Example | When |
|------|---------|------|
| Full JSON | `data-smark='{"type":"list","name":"items","of":"input"}'` | Full control |
| Type shorthand | `data-smark="list"` | Defaults for that type |
| Bare attribute | `data-smark` | Type/name inferred from HTML |
| `data-smark="data-smark"` | `data-smark="data-smark"` | Treated as empty options |

**No `data-smark` required on:** root element (passed to constructor), list item template (sole direct child before render).

> See: [`data-smark` syntax]({{ "getting_started/core_concepts" | relative_url }}#the-data-smark-attribute) · [Shorthand forms]({{ "getting_started/core_concepts" | relative_url }}#shorthand-syntaxes)

---

## Component Types

| Type | Data Type | Default | Tag Inference |
|------|-----------|---------|---------------|
| `form` | JSON object | `{}` | `<form>`, `<div>`, any container |
| `list` | JSON array | `[]` | `<ul>`, `<ol>`, `<table>`, `<thead>`, `<tbody>`, `<tfoot>` |
| `input` | String | `""` | `<input>`, `<textarea>`, `<select>` |
| `number` | Number / `null` | `null` | `<input type="number">` |
| `date` | ISO date / `null` | `null` | `<input type="date">` |
| `time` | HH:mm:ss / `null` | `null` | `<input type="time">` |
| `datetime-local` | ISO datetime / `null` | `null` | `<input type="datetime-local">` |
| `color` | Hex color / `null` | `null` | `<input type="color">` |
| `radio` | Selected value / `null` | `null` | Radio button group |
| `trigger` | N/A | N/A | Any element with `action` property |
| `label` | N/A | N/A | `<label>` |
| mixin | Varies | Varies | `data-smark='{"type":"url#templateId"}'` |

**Singleton:** `input`-derived type on a container wraps exactly one real field:

```html
<li data-smark="input">
  <input data-smark type="tel">
  <button data-smark='{"action":"removeItem"}'>✕</button>
</li>
```

> See: [Full type reference]({{ "getting_started/core_component_types" | relative_url }}) · [Singleton pattern]({{ "getting_started/core_component_types" | relative_url }}#the-singleton-pattern)

---

## List Template Roles

Every direct child of a list is a template — removed from DOM on init. Set via `data-smark='{"role":"<role>"}'`.

| Role | Purpose | Cloned? | Notes |
|------|---------|---------|-------|
| `item` (default) | Repeating item | Yes | Required |
| `empty_list` | Shown when list empty | No | Auto-managed |
| `header` | Prepended once | No | No data fields allowed |
| `footer` | Appended once | No | No data fields allowed |
| `placeholder` | DOM filler for fixed-width grids | Yes | Only when `max_items` set |
| `separator` | Between adjacent items | Yes | Removed when only 1 item |
| `last_separator` | Between 2nd-last & last | Yes | Falls back to `separator` |

> See: [Template roles in type_list]({{ "component_types/type_list" | relative_url }}#introduction)

---

## Actions

| Action | Target Type | Description |
|--------|-------------|-------------|
| `export` | Any | [Return current value]({{ "advanced_concepts/api_import_and_export" | relative_url }}#the-export-action) as JSON |
| `import` | Any | [Set value]({{ "advanced_concepts/api_import_and_export" | relative_url }}#the-import-action) from JSON data |
| `reset` | Any | [Restore `defaultValue`]({{ "advanced_concepts/api_import_and_export" | relative_url }}#default-values-clear-and-reset) |
| `clear` | Any | [Reset to type-level `emptyValue`]({{ "advanced_concepts/api_import_and_export" | relative_url }}#default-values-clear-and-reset) |
| `addItem` | list | [Add new item]({{ "component_types/type_list" | relative_url }}#async-additem-action) |
| `removeItem` | list | [Remove target item(s)]({{ "component_types/type_list" | relative_url }}#async-removeitem-action) |
| `submit` | form | [Submit form data]({{ "component_types/type_form" | relative_url }}#async-submit-action) via HTTP |
| `count` | list | [Get/set total item count]({{ "component_types/type_list" | relative_url }}#count-action) |
| `position` | list item | [Get/set 1-based index]({{ "component_types/type_list" | relative_url }}#position-action) |
| `move` | list (sortable) | [Move item]({{ "component_types/type_list" | relative_url }}#sortable) within/across lists |
| custom | any | Via [`customActions`]({{ "advanced_concepts/the_smarkform_constructor" | relative_url }}#customactions) |

**Signature:** `async actionName(data, options = {})`

- `component.actions.reset(data, options)` — fires events, auto-focus
- `component.reset(data, options)` — no events, no auto-focus

---

## Context & Target Resolution

**Natural context:** walks ancestors to find first component implementing the action.  
**Explicit `context`:** resolved from the trigger's enclosing field component (triggers themselves are not path nodes).

```html
<button data-smark='{"action":"clear"}'>Clear</button>
<button data-smark='{"action":"export","context":"demo"}'>Export Demo</button>
<button data-smark='{"action":"export","context":"/shipping"}'>Export Shipping</button>
```

> See: [Path syntax]({{ "advanced_concepts/form_traversing" | relative_url }}#path-syntax-overview) · [Context & target]({{ "advanced_concepts/form_traversing" | relative_url }}#context-and-target-in-actions)

| Path | Resolves to |
|------|-------------|
| `"name"` | Sibling component named "name" |
| `"/"` | Root form |
| `"."` | Current field |
| `"..fieldname"` | Field in *parent* scope (no `/` after `..`) |
| `".-1"` | Previous list item sibling |
| `".+1"` | Next list item sibling |
| `"../sibling"` | Sibling of parent |
| `"items/*"` | All children matching wildcard |

**Target semantics:**

| Combination | Result |
|-------------|--------|
| `export` + `target` | Export context → import into target |
| `import` + `target` | Export from target → import into context |
| `removeItem` + `target:"*"` | Remove ALL items |
| `removeItem` + `preserve_non_empty:true` | Remove only empty items |

**Pitfall:** `target:"shipping"` looks for a child of context. Use `target:"../shipping"` for sibling.

---

## Event System

| Method | Scope | Bubbles? |
|--------|-------|----------|
| `component.on(ev, handler)` | Component + ancestors | If event says `bubbles:true` |
| `component.onLocal(ev, handler)` | Only this component | Never |
| `component.onAll(ev, handler)` | Component + ancestors | Always |

> See: [Event system docs]({{ "advanced_concepts/events" | relative_url }}#overview) · [Constructor shorthand]({{ "advanced_concepts/events" | relative_url }}#via-options-declarative) · [Action lifecycle]({{ "advanced_concepts/events" | relative_url }}#action-lifecycle-events)

**DOM events** (capture-phase on root, dispatched to target): `keydown`, `keyup`, `input`, `change`, `focus`, `blur`, `click`, `dblclick`, `mousedown`, `mouseup` …  
**Synthetic:** `focusenter`, `focusleave`, `BeforeAction_<name>` (preventable), `AfterAction_<name>`, `beforeRender`, `afterRender`, `beforeUnrender`, `removeItem_beforeRender`, `removeItem_afterRender`

**Constructor shorthand:**
```javascript
const f = new SmarkForm(element, {
  onLocal_AfterAction_export(ev) {},
  on_click(ev) {},
  onAll_focus(ev) {},
  onBeforeAction_import(ev) { ev.preventDefault(); },
});
```

**Modify data in BeforeAction:**
```javascript
component.onLocal("BeforeAction_import", (ev) => {
  ev.data = transformData(ev.data);
});
```

---

## Data Import / Export

```javascript
await form.export();                    // Full form
await form.find("/username").export();  // Single field
await form.import({ name: "Alice" });   // Import data
```

> See: [Full import/export docs]({{ "advanced_concepts/api_import_and_export" | relative_url }}#overview)

| Call | Updates default? | `reset()` restores |
|------|-----------------|-------------------|
| `import(data)` | Yes | `data` |
| `import(data, {setDefault:false})` | No | Previous default |
| `import(undefined)` | No (skipped) | Current default |
| `clear()` | No | Default unchanged |
| `reset()` | No | Current default |

**`exportEmpties`** inherited from nearest ancestor that sets it:

```html
<div data-smark='{"type":"list","name":"outer","exportEmpties":true}'>
  <div data-smark='{"type":"list","name":"inner","exportEmpties":false}'></div>
</div>
```

**Copy pattern:**
```javascript
await form.find("/billing").actions.export(null, { target: "../shipping" });
```

---

## API Methods

Every field component:

> See: [Import/export]({{ "advanced_concepts/api_import_and_export" | relative_url }}#overview) · [Path traversal]({{ "advanced_concepts/form_traversing" | relative_url }}) · [Events]({{ "advanced_concepts/events" | relative_url }})

### Actions (also via `component.actions.<name>()`)

| Method | Description |
|--------|-------------|
| `export(data, options)` | [Return current value]({{ "advanced_concepts/api_import_and_export" | relative_url }}) |
| `import(data, options)` | [Set value from data]({{ "advanced_concepts/api_import_and_export" | relative_url }}) |
| `clear(options)` | [Reset to type-level empty]({{ "advanced_concepts/api_import_and_export" | relative_url }}#default-values-clear-and-reset) |
| `reset(options)` | [Restore `defaultValue`]({{ "advanced_concepts/api_import_and_export" | relative_url }}#default-values-clear-and-reset) |

### Utilities & Introspection

| Method | Description |
|--------|-------------|
| `isEmpty()` | `true` if no meaningful data |
| `find(path)` | [Navigate by path string]({{ "advanced_concepts/form_traversing" | relative_url }}) |
| `getPath()` | Absolute path (e.g. `"/address/street"`) |
| `focus(options)` | Focus the field |
| `moveTo()` | Scroll to and highlight |
| `onRendered(callback)` | Run after render |
| `on(ev, handler)` | Listen with bubbling |
| `onLocal(ev, handler)` | [Listen target-phase only]({{ "advanced_concepts/events" | relative_url }}#local-vs-all-handlers) |
| `onAll(ev, handler)` | [Listen always-bubbling]({{ "advanced_concepts/events" | relative_url }}#local-vs-all-handlers) |
| `emit(evType, data, preventable)` | Emit custom event |
| `getTriggers(actionName, limit)` | Find triggers targeting this component |
| `updateId()` | Auto-generate `id` from `autoId` |
| `inheritedOption(name, default)` | Walk ancestors for option value |

---

## Hotkeys

Triggers with a `hotkey` property reveal hints when **Ctrl** (level 1) or **Ctrl+Alt** (level 2) is pressed:

```html
<button data-smark='{"action":"addItem","hotkey":"+"}'>Add</button>
<button data-smark='{"action":"removeItem","hotkey":"-"}'>Remove</button>
```

- Hints appear as `data-hotkey` attribute on trigger elements.
- Style with CSS: `[data-hotkey]::after { content: attr(data-hotkey); }`
- Triggers with hotkey defined get `tabindex="-1"` which excludes them from `Tab` navigation.

> See: [Hotkeys docs]({{ "advanced_concepts/hotkeys" | relative_url }})

---

## Form Submission

> See: [Form submission]({{ "component_types/type_form" | relative_url }}#async-submit-action) · [Encoding options]({{ "component_types/type_form" | relative_url }}#encoding-and-transport)

```html
<form action="/api/submit" method="post">
  <button type="submit" data-smark='{"action":"submit"}'>Submit</button>
</form>
```

- **Enter** navigates fields — does **not** submit.
- Only explicit click on submit-type buttons triggers submission.
- Supports `application/json` (`enableJsonEncoding: true`).
- Respects `formaction`, `formmethod`, `formenctype`, `formtarget`.

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
<button data-smark='{"action":"export","context":"billing","target":"../shipping"}'>Copy to Shipping</button>
<button data-smark='{"action":"removeItem","context":"myList","target":"*"}'>Remove All Items</button>
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

### Tooltip mixin with CSS

A reusable mixin that wraps a field with a CSS-only tooltip:

```html
<template id="tooltipField">
  <label data-smark>
    <span id="labelText">Field</span>
    <input data-smark type="text">
    <span class="tti">ⓘ</span>
    <span id="tipText" hidden>tooltip</span>
  </label>
  <style>
    label { position: relative; }
    .tti { cursor: help; margin-left: .3em; opacity: .6; }
    .tti:hover { opacity: 1; }
    .tti:hover + #tipText { display: inline !important;
      position: absolute; bottom: 100%; left: 0;
      background: #333; color: #fff; padding: .2em .4em;
      border-radius: .3em; white-space: nowrap; }
  </style>
</template>

<div data-smark='{"type":"#tooltipField","name":"email"}'>
  <span data-for="labelText">Email</span>
  <span data-for="tipText">Enter your email address</span>
</div>
```
