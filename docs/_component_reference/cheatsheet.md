---
title: "Developer Cheatsheet"
layout: chapter
description: "Quick reference for SmarkForm built-in types, common options, actions, events, paths, methods and value shapes."
permalink: "/component_reference/cheatsheet"
nav_order: 18
redirect_from:
  - "/resources/cheatsheet"
---


{% include links.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {% include chaptertoc/cheatsheet.html depth=3 %}

</details>

---

## Constructor Options

```javascript
const myForm = new SmarkForm(document.getElementById("myForm"), options);
```

> **Note:** `find()` returns `null` until rendering completes — await
> `myForm.rendered` before looking up components. Direct method calls use the
> raw prototype method; triggers are required for action lifecycle events.
> See: [Full constructor reference]({{ "/advanced_topics/the_smarkform_constructor" | relative_url }}#constructor-syntax)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `value` | Any | Type-specific empty value | [Initial/default data]({{ "/component_reference/form" | relative_url }}#value) |
| `auto_id` | Boolean/String/Function | `false` | [Generate IDs from paths]({{ "/component_reference/form" | relative_url }}#auto_id) |
| `smark_mixin_allow_external` | String or origin map | `"block"` | [External mixin fetch policy]({{ "/guides/mixin_types" | relative_url }}#mixin-security-options) |
| `smark_mixin_allow_*_scripts` | String or origin map | `"block"` | [Mixin script policies]({{ "/guides/mixin_types" | relative_url }}#mixin-security-options) |
| `smark_mask_throw_on_missing` | Boolean | `true` | [Missing mask behavior]({{ "/guides/field_masking" | relative_url }}#error-handling) |
| `enable_json_encoding` | Boolean | `false` | [Enable JSON form submission]({{ "/component_reference/form" | relative_url }}#encoding-and-transport) |
| `focus_on_click` | Boolean | `true` | Focus a form container when clicked · [Form]({{ "/component_reference/form" | relative_url }}#focus_on_click) |
| `key_style` | `"bracket"` / `"dot"` | `"bracket"` | [Form encoding keys]({{ "/component_reference/form" | relative_url }}#data-flattening-options) |
| `array_style` | `"repeat"` / `"index"` | `"repeat"` | [Form encoding arrays]({{ "/component_reference/form" | relative_url }}#data-flattening-options) |
| `on*` | Function | — | [Constructor event handlers]({{ "/guides/events" | relative_url }}#via-options-declarative) |

This is a quick selection of common root options, not the full constructor
option list. List options such as `export_empties` inherit through the component
tree; see the detailed references for their complete behavior.

Register custom actions globally with `SmarkForm.registerCustomAction(name, handler)` before constructing forms that use them. This is not a constructor option; see [The SmarkForm Constructor]({{ "advanced_topics/the_smarkform_constructor" | relative_url }}).

---

## The `data-smark` Attribute

| Form | Example | When |
|------|---------|------|
| Full JSON | `data-smark='{"type":"list","name":"items","of":"input"}'` | Full control |
| Type shorthand | `data-smark="list"` | Defaults for that type |
| Bare attribute | `data-smark` | Type/name inferred from HTML |
| Literal fallback | `data-smark="data-smark"` | Treated as empty options |

**`data-smark` is optional on:** root element (implicit form type, also gets options from constructor), list item template (implicit for the item role, type inferred or set in the "of" option of the list).

> See: [`data-smark` syntax]({{ "/start_here/core_concepts" | relative_url }}#the-data-smark-attribute) · [Shorthand forms and prefixed-option limitations]({{ "/start_here/core_concepts" | relative_url }}#shorthand-syntaxes)

---

## Component Types

| Type | Data Type | Default | Tag Inference |
|------|-----------|---------|---------------|
| `form` | JSON object | `{}` | Root form or container (default container type) |
| `list` | JSON array | `[]` | `<ul>`, `<ol>`, `<table>` sections |
| `input` | Usually string; checkbox boolean; optional JSON | `""` (text) | `<input>`, `<textarea>`, `<select>` |
| `number` | Number or `null` | `null` | `<input type="number">` |
| `date` | ISO date string or `null` | `null` | `<input type="date">` |
| `time` | `HH:mm:ss` string or `null` | `null` | `<input type="time">` |
| `datetime-local` | Local date-time string or `null` | `null` | `<input type="datetime-local">` |
| `color` | Hex string or `null` | `null` | `<input type="color">` |
| `radio` | Selected value or `null` | `null` | `<input type="radio">` group |
| `file` | Data URL or JSON object / `null` | `null` | Explicit `type:"file"` on an input or singleton |
| `image` | Data URL or JSON object / `null` | `null` | `<img>` (inferred) or singleton |
| `video` | Data URL or JSON object / `null` | `null` | `<video>` (inferred) or singleton |
| `audio` | Data URL or JSON object / `null` | `null` | `<audio>` (inferred) or singleton |
| `trigger` | No form value | — | Element with an `action` option |
| `label` | No form value | — | `<label>` (inferred) or explicit label type |

**Singleton:** `input`-derived type on a container wraps exactly one real field:

```html
<li data-smark="input">
  <input data-smark type="tel">
  <button data-smark-action="removeItem">✕</button>
</li>
```

> See: [Component Types Overview]({{ "/component_reference/overview" | relative_url }}) · [Singleton Pattern]({{ "/guides/the_singleton_pattern" | relative_url }})

**Native `<select>`:** It uses the built-in `input` type and exports its selected
value. Dynamic remote options are a separate proposal, not implemented; see
[Select]({{ "/component_reference/select" | relative_url }}) and [The API
Interface (planned)]({{ "/guides/the_api_interface" | relative_url }}).

**Mixins:** `"type":"#templateId"` and `"type":"url#templateId"` expand
templates; mixins are a reusable-template feature, not an additional built-in
component type. See [Mixin Types]({{ "/guides/mixin_types" | relative_url }}).

---

## List Template Roles

Every direct child of a list defines a template role and is removed from the
initial DOM before the list renders. Set the role in `data-smark` or with a
`data-smark-role` attribute.

| Role | Purpose | Cloned? | Notes |
|------|---------|---------|-------|
| `item` (default) | Repeating item | Yes | Required |
| `empty_list` | Shown when list empty | No | Auto-managed |
| `header` | Prepended once | No | No data fields allowed |
| `footer` | Appended once | No | No data fields allowed |
| `placeholder` | DOM filler for fixed-width grids | Yes | Only when `max_items` set |
| `separator` | Between adjacent items | Yes | Removed when only 1 item |
| `last_separator` | Between 2nd-last & last | Yes | Falls back to `separator` |

> See: [List template roles]({{ "/component_reference/list" | relative_url }}#introduction)

---

## Actions

| Action | Target Type | Description |
|--------|-------------|-------------|
| `export` | Any | [Return current value]({{ "/guides/data_import_and_export" | relative_url }}#the-export-action) |
| `import` | Any | [Set value]({{ "/guides/data_import_and_export" | relative_url }}#the-import-action) |
| `reset` | Any | [Restore the default]({{ "/guides/data_import_and_export" | relative_url }}#default-values-clear-and-reset) |
| `clear` | Any | [Use the type-level empty value]({{ "/guides/data_import_and_export" | relative_url }}#default-values-clear-and-reset) |
| `addItem` | list | [Add an item]({{ "/component_reference/list" | relative_url }}#async-additem-action) |
| `removeItem` | list | [Remove item(s)]({{ "/component_reference/list" | relative_url }}#async-removeitem-action) |
| `submit` | form | [Submit form data]({{ "/component_reference/form" | relative_url }}#async-submit-action) |
| `count` | list | [Return item count]({{ "/component_reference/list" | relative_url }}#count-action) (or a derived count with `delta`) |
| `position` | list | [Return a target item's 1-based position]({{ "/component_reference/list" | relative_url }}#position-action) (or an offset value) |
| `download` | file-like field | Download embedded bytes · [File]({{ "/component_reference/file" | relative_url }}#downloading-a-file) |
| `rename` | file-like field | Set the editable filename · [File]({{ "/component_reference/file" | relative_url }}) |
| `pick` | video/audio | Open the native media picker · [Video]({{ "/component_reference/video" | relative_url }}) · [Audio]({{ "/component_reference/audio" | relative_url }}) |
| custom | any | Register with `SmarkForm.registerCustomAction(name, handler)` before form construction; see [The SmarkForm Constructor]({{ "/advanced_topics/the_smarkform_constructor" | relative_url }}) |

**Trigger dispatch:** `async actionName(data, options = {})`. Trigger-dispatched
actions emit `BeforeAction_*` / `AfterAction_*` events; direct calls such as
`myForm.export()` call the raw method and do not emit those lifecycle events.

---

## Context & Target Resolution

**Natural context:** walks ancestors to find first component implementing the action.  
**Explicit `context`:** resolved from the trigger's enclosing field component (triggers themselves are not path nodes).

An explicit context must implement the action; SmarkForm does not fall back to
another ancestor. A non-matching explicit context raises `UNKNOWN_ACTION` when
the trigger is activated. A wildcard context instead dispatches to matching
components that implement the action and skips the rest.

```html
<button data-smark-action="clear">Clear</button>
<button data-smark='{"action":"export","context":"demo"}'>Export Demo</button>
<button data-smark='{"action":"export","context":"/shipping"}'>Export Shipping</button>
```

> See: [Path syntax]({{ "/guides/form_traversing" | relative_url }}#path-syntax-overview) · [Context & target]({{ "/guides/form_traversing" | relative_url }}#context-and-target-in-actions)

| Path | Resolves to |
|------|-------------|
| `"name"` | Child component named `name` under the current search base |
| `"/"` | Root form |
| `"."` | Current field |
| `"../fieldname"` | Child named `fieldname` in the parent scope |
| `".-1"` | Previous list item sibling |
| `".+1"` | Next list item sibling |
| `"../sibling"` | Sibling of parent |
| `"items/*"` | All children matching wildcard |
| `"*"` (in context) | Matching components in the path's scope that implement the action (multi-dispatch) |
| `"*"` (in target) | Matching children of the context |

**Target semantics:**

An explicit target path is resolved from the effective context; an absolute
path starts at the root. When the natural context is used, placement can infer
a target (for example, the list item containing a `removeItem` trigger). An
explicit context does not infer a target from trigger placement; the action's
default applies when no target is set.

| Combination | Result |
|-------------|--------|
| `export` + `target` | Export context → import into target |
| `import` + `target` | Export from target → import into context |
| `removeItem` + `target:"*"` | Remove ALL items |
| `removeItem` + `preserve_non_empty:true` | Remove only empty items |

**Multi-context triggers:** a wildcard `context` (e.g. `"*"` or `"foo/*"`) dispatches the action to eligible matched components in sequence (each with its own resolved `target`); components lacking the action are skipped. No eligible matches are a no-op.

**Pitfall:** `target:"shipping"` looks for a child of context. Use `target:"../shipping"` for a sibling. A missing target is not a universal trigger error; validate the path and follow the action-specific behavior.

---

## Event System

| Method | Scope | Bubbles? |
|--------|-------|----------|
| `component.on(ev, handler)` | Component + ancestors | If event says `bubbles:true` |
| `component.onLocal(ev, handler)` | Only this component | Never |
| `component.onAll(ev, handler)` | Component + ancestors | Always |

> See: [Event system docs]({{ "/guides/events" | relative_url }}#overview) · [Constructor shorthand]({{ "/guides/events" | relative_url }}#via-options-declarative) · [Action lifecycle]({{ "/guides/events" | relative_url }}#action-lifecycle-events)

**DOM events** (capture-phase on root, dispatched to target): `keydown`, `keyup`, `input`, `change`, `focus`, `blur`, `click`, `dblclick`, `mousedown`, `mouseup` …  
**Synthetic:** `focusenter`, `focusleave`, `BeforeAction_<name>` (preventable), `AfterAction_<name>`, `beforeRender`, `afterRender`, `beforeUnrender`, `removeItem_beforeRender`, `removeItem_afterRender`

**Constructor shorthand:**
```javascript
const myForm = new SmarkForm(document.getElementById("myForm"), {
  onLocal_AfterAction_export(ev) {},
  on_click(ev) {},
  onAll_focus(ev) {},
  onBeforeAction_import(ev) { ev.preventDefault(); },
});
```

**Modify data in a trigger-dispatched `BeforeAction`:**
```javascript
myForm.on("BeforeAction_import", (ev) => {
  ev.data = transformData(ev.data);
});
```

Raw calls such as `myForm.import(data)` do not emit action lifecycle events.

---

## Data Import / Export

```javascript
await myForm.export();                    // Full form
await myForm.find("/username").export();  // Single field
await myForm.import({ name: "Alice" });   // Import data
```

> See: [Full import/export docs]({{ "guides/data_import_and_export" | relative_url }}#overview)

| Call | Updates default? | `reset()` restores |
|------|-----------------|-------------------|
| `import(data)` | Yes | `data` |
| `import(data, {set_default:false})` | No | Previous default |
| `import(undefined)` | No | Imports the current default |
| `clear()` | No | Default unchanged |
| `reset()` | No | Current default |

**`export_empties`** inherited from nearest ancestor that sets it:

```html
<ul data-smark='{"type":"list","name":"sessions","of":"form","export_empties":true}'>
  <li>
    <ul data-smark='{"type":"list","name":"tags","of":"input","export_empties":false}'>
      <li><input data-smark type="text"></li>
    </ul>
  </li>
</ul>
```

**Field-level JSON round-trips:** add `{"format":"json"}` (or legacy `encoding:"json"`) to any `<input>`,
`<textarea>` or `<select>` to export a parsed JS value and import by serializing
to JSON text:

```html
<textarea name="metadata" data-smark='{"format":"json"}'></textarea>
```

Applies to the field's own import/export; other fields keep their raw values.
Parsed falsey values currently export as `null`.
> See: [JSON format]({{ "guides/value_coercion" | relative_url }}#json-format)

Current JSON-mode export maps parsed falsey values (`0`, `false`, `""`, `null`)
to `null`; see [Value Coercion]({{ "/guides/value_coercion" | relative_url }})
before relying on those values to round-trip distinctly.

**Copy pattern:**
```javascript
const data = await myForm.find("/billing").export();
await myForm.find("/shipping").import(data);
```

For trigger-based copying, `target` resolves from the effective context; see
[Context & Target Resolution](#context--target-resolution). For scalar
conversion boundaries and JSON-formatted fields, see
[Value Coercion]({{ "/guides/value_coercion" | relative_url }}).

---

## File Fields

`{"type":"file"}` on a real `<input>` (tuned to a text field showing the editable file name) or on a **singleton container** wrapping exactly one inner field:

```html
<input data-smark='{"type":"file","name":"cv","format":"json","encoding":"hex"}'>
<div class="drop-zone" data-smark='{"type":"file","name":"cv"}'>… one inner field …</div>
```

| Option | Default | Effect |
|--------|---------|--------|
| `accept` | `""` | Native filter — also applied to drops/pastes |
| `format` | `"raw"` | `"raw"` → data-URL string · `"json"` → `{name,type,size,lastModified,data}` |
| `encoding` | `"base64"` | Payload byte encoding (`"base64"` / `"base64url"` / `"hex"`) for object data and bare-string imports; data-URLs are always base64 |
| `smark_file_open` | `true` | `click` / `Shift+Space` open the OS picker |
| `smark_file_drop` | `true` | Drag & drop |
| `smark_file_paste` | `true` | Paste |

- **Export:** raw → `data:image/png;name=photo.png;size=123456;lastModified=1690000000000;base64,…`; json → structured object; empty → `null`.
- **Import:** embedded data URL, URL string (fetched and embedded), partial
  object, bare payload, or JSON string; `size` is recomputed from payload bytes.
- **Download (action):** `{"action":"download","context":"/cv"}` triggers a real browser download of the stored bytes; empty field → no-op. Name precedence: `filename` trigger option > edited visible name > stored name.
- **Singleton:** drop/paste detected over the whole container; download delegates to the inner field.
- **Lists:** `{"type":"list","name":"photos","of":"file"}` — `addItem` opens a multi-file picker (`multiple:false` forces single); OS drops **append** items (list-level `file_drop:false` disables).

> See: [File field type]({{ "component_reference/file" | relative_url }}#introduction)

---

## Image Fields

`{"type":"image"}` on a native `<img>` (the picture *is* the field), or on a **singleton container** (any tag wrapping exactly one inner `<img>`). Extends `file` — same value contract, acquisition and download action.

```html
<img data-smark='{"type":"image","name":"photo"}'>
<figure data-smark='{"type":"image","name":"photo"}'>…<img data-smark>…<figcaption contenteditable>…</figcaption>…</figure>
```

| Option | Default | Effect |
|--------|---------|--------|
| `accept` | `"image/*"` | Native filter — also applied to drops/pastes |
| `placeholder` | chessboard SVG | Empty-state image (URL/data URL); `false` = leave `src` empty |
| `image_resize` | — | Acquired images stretched to exact `[w,h]` / `{width,height}` / square number |
| `image_max_size` | — | Downscale-only cap (fit *within* the box, aspect preserved) |
| `image_format` | — | Convert on acquire: `"jpeg"` / `"jpg"` / `"png"` / `"webp"` / `"avif"` |
| `image_enforce` | `"warn"` | `"strict"`·`"hard"`·`"warn"`·`"ignore"` — verdict for unmet/unverifiable requirements |
| `smark_image_validate` | `true` | Decode-test acquired files (broken/non-image → silently rejected) |
| `smark_image_clear_on_delete` | `true` | `Delete`/`Backspace` clear the value (never while editing a caption) |
| `smark_image_open` / `smark_image_drop` / `smark_image_paste` | `true` | Acquisition toggles (`smark_file_*` honored as fallbacks) |

- **Inference:** bare `<img data-smark>` is inferred as `image`; `<input type="image">` raises `IMAGE_TYPE_ON_INPUT`.
- **Display:** `src` = stored bytes while set, placeholder when empty; the field never touches `width`/`height`/`alt`/`class` — reserve layout space in the markup.
- **Export/import:** identical to `file` (data-URL string default / `{name,type,size,lastModified,data}` with `"format":"json"`; embedded-only, no width/height metadata).
- **Name:** on `<figure>` wrappers and gallery items a `figcaption contenteditable` mirrors/edits the stored `name` (edited caption > stored name). Without one, the stored name governs.
- **Notices:** unmet/unverifiable requirements dispatch a bubbling `smark:imageNotice` event (+ toast unless `preventDefault()`d).
- **Lists:** `{"type":"list","name":"gallery","of":"image"}` → flat array of data URLs; `addItem` multi-picks and decode-filters the batch; OS drops **append** items (also on an existing item).

> See: [Image field type]({{ "component_reference/image" | relative_url }}#introduction)

---

## Video and Audio Fields

`video` and `audio` bind SmarkForm fields to native `<video>` and `<audio>`
elements. Bare media elements are inferred; singleton wrappers can add controls
and triggers around one unnamed media field. Both use the embedded-file value
contract and support picker, drop/paste, and download behavior.

- **Video:** Configure `video_max_size`, `smark_video_validate`,
  `smark_video_click` (`auto` / `pick` / `play`), or `smark_video_auto_pick`.
  Native `controls` remain the player; an explicit `pick` trigger works beside
  them.
- **Audio:** Configure `audio_max_size`, `smark_audio_validate`, and
  `smark_audio_click` (`auto` / `pick` / `play`). Native controls remain the
  player where enabled.
- **Both:** An explicit `pick` action opens the native picker; size notices use
  cancellable `smark:videoNotice` / `smark:audioNotice` events. Embedded imports
  are trusted, as with `file`.

SmarkForm does not capture video thumbnails or provide captions/transcripts.
Authors provide suitable alternatives and reserve any required layout space.

> See: [Video]({{ "/component_reference/video" | relative_url }}) ·
> [Audio]({{ "/component_reference/audio" | relative_url }})

---

## API Methods

Every component shares path lookup and event methods. Field components also
provide import/export and empty-state methods:

> See: [Import/export]({{ "guides/data_import_and_export" | relative_url }}#overview) · [Path traversal]({{ "guides/form_traversing" | relative_url }}) · [Events]({{ "guides/events" | relative_url }})

### Action methods

| Method | Description |
|--------|-------------|
| `export(data, options)` | [Return current value]({{ "guides/data_import_and_export" | relative_url }}) |
| `import(data, options)` | [Set value from data]({{ "guides/data_import_and_export" | relative_url }}) |
| `clear(options)` | [Reset to type-level empty]({{ "guides/data_import_and_export" | relative_url }}#default-values-clear-and-reset) |
| `reset(options)` | [Restore `defaultValue`]({{ "guides/data_import_and_export" | relative_url }}#default-values-clear-and-reset) |

### Utilities & Introspection

| Method | Description |
|--------|-------------|
| `isEmpty()` | `true` if no meaningful data |
| `find(path)` | [Navigate by path string]({{ "guides/form_traversing" | relative_url }}) |
| `getPath()` | Absolute path (e.g. `"/address/street"`) |
| `focus(options)` | Focus the field |
| `moveTo()` | Scroll to and highlight |
| `onRendered(callback)` | Run after render |
| `on(ev, handler)` | Listen with bubbling |
| `onLocal(ev, handler)` | [Listen on this component only]({{ "/guides/events" | relative_url }}#local-vs-all-handlers) |
| `onAll(ev, handler)` | [Listen across the component subtree]({{ "/guides/events" | relative_url }}#local-vs-all-handlers) |
| `emit(evType, data, preventable)` | Emit custom event |
| `getTriggers(actionName, limit)` | Find triggers targeting this component |
| `updateId()` | Auto-generate `id` from `auto_id` |
| `inheritedOption(name, default)` | Walk ancestors for option value |
| `move(options)` | On a list, move an item within/across sortable lists · [List]({{ "/component_reference/list" | relative_url }}#sortable) |

---

## Hotkeys

Triggers with a `hotkey` property reveal hints when **Ctrl** (level 1) or **Ctrl+Alt** (level 2) is pressed:

```html
<button data-smark='{"action":"addItem","hotkey":"+"}'>Add</button>
<button data-smark='{"action":"removeItem","hotkey":"-"}'>Remove</button>
```

- Hints appear as `data-hotkey` attribute on trigger elements.
- Style with CSS: `[data-hotkey]::after { content: attr(data-hotkey); }`
- Hotkeyed list `addItem`/`removeItem` triggers get `tabindex="-1"` when no
  value was authored; other hotkey triggers remain in normal Tab order.

The generated CSS hint is visual content and is not a substitute for visible,
named controls for essential actions. SmarkForm uses Ctrl/Ctrl+Alt, not
macOS Command/Meta.

> See: [Hotkeys]({{ "/accessibility/hotkeys" | relative_url }})

---

## Form Submission

> See: [Form submission]({{ "component_reference/form" | relative_url }}#async-submit-action) · [Encoding options]({{ "component_reference/form" | relative_url }}#encoding-and-transport)

```html
<form action="/api/submit" method="post">
  <button type="submit" data-smark-action="submit">Submit</button>
</form>
```

- **Enter** navigates fields — does **not** submit.
- Use a native submit control or a `submit` trigger; Enter field navigation is
  separate from the form submission action.
- Supports `application/json` (`enable_json_encoding: true`).
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
  <button data-smark-action="clear">Clear</button>
  <button data-smark-action="export">Export</button>
</div>
<script>const myForm = new SmarkForm(document.getElementById("myForm"));</script>
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
  <div data-smark-role="empty_list">No items yet.</div>
  <div data-smark-role="header"><b>Items:</b></div>
  <div data-smark-role="footer">
    <button data-smark='{"action":"addItem","hotkey":"+"}'>Add</button>
  </div>
  <hr data-smark-role="separator">
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
    <button data-smark-action="removeItem">✕</button>
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
