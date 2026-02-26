# SmarkForm Forms — Agent Knowledge

This document teaches AI agents (and human developers) how to implement
production-ready SmarkForm forms. It covers how to load the library, common
component patterns, data semantics, and programmatic access. For a deeper dive
into SmarkForm internals see `AGENTS/SmarkForm-Usage.md`; for adding examples
to the Jekyll documentation see `AGENTS/Documentation-Examples.md`.

---

## Consuming SmarkForm in External Projects

SmarkForm has no runtime dependencies. You can pull it in via CDN, npm, or a
downloaded copy. The library is available in two formats:

| Format | File | Usage |
|--------|------|-------|
| ESM | `SmarkForm.esm.js` | `import` statement in modern browsers / bundlers |
| UMD | `SmarkForm.umd.js` | `<script>` tag, CommonJS `require()`, AMD |

### Via CDN (quickest — good for demos and AI-generated playgrounds)

**Pin to a specific version (recommended for production):**

```html
<!-- ESM -->
<script type="module">
  import SmarkForm from 'https://cdn.jsdelivr.net/npm/smarkform@0.12.9/dist/SmarkForm.esm.js';
  const myForm = new SmarkForm(document.getElementById('myForm'));
</script>

<!-- UMD (plain <script> tag) -->
<script src="https://cdn.jsdelivr.net/npm/smarkform@0.12.9/dist/SmarkForm.umd.js"></script>
<script>
  const myForm = new SmarkForm(document.getElementById('myForm'));
</script>
```

**Always-latest (fine for experiments, avoid in production):**

```html
<!-- ESM latest -->
<script type="module">
  import SmarkForm from 'https://cdn.jsdelivr.net/npm/smarkform/dist/SmarkForm.esm.js';
  const myForm = new SmarkForm(document.getElementById('myForm'));
</script>

<!-- UMD latest -->
<script src="https://cdn.jsdelivr.net/npm/smarkform/dist/SmarkForm.umd.js"></script>
```

Replace `0.12.9` with the actual release you want. Check
https://www.npmjs.com/package/smarkform for the latest version.

### Via npm (bundler projects)

```sh
npm install smarkform
```

```javascript
// ESM import (preferred in bundlers)
import SmarkForm from 'smarkform';

// CommonJS (Node.js / older bundlers)
const SmarkForm = require('smarkform/dist/SmarkForm.umd.js');
```

The package ships `dist/SmarkForm.esm.js` and `dist/SmarkForm.umd.js` — no
build step required on the consumer side.

### Via downloaded copy

Download `SmarkForm.esm.js` or `SmarkForm.umd.js` from the [GitHub
releases](https://github.com/bitifet/SmarkForm/releases) or the `dist/`
directory of the repository, place it alongside your HTML, and reference it
with a relative path:

```html
<script type="module">
  import SmarkForm from './SmarkForm.esm.js';
  const myForm = new SmarkForm(document.getElementById('myForm'));
</script>
```

---

## Minimal Working Form

```html
<div id="myForm">
  <input data-smark type="text" name="username" placeholder="Username">
  <input data-smark type="email" name="email" placeholder="Email">
  <button data-smark='{"action":"export"}'>Export</button>
</div>

<script type="module">
  import SmarkForm from 'https://cdn.jsdelivr.net/npm/smarkform/dist/SmarkForm.esm.js';
  const myForm = new SmarkForm(document.getElementById('myForm'));
  await myForm.rendered;
  myForm.on('AfterAction_export', (ev) => {
    console.log('Form data:', ev.data);
  });
</script>
```

Key points:
- The root element (`#myForm`) does **not** need a `data-smark` attribute.
- Fields need `data-smark` to be managed by SmarkForm.
- Always `await myForm.rendered` before calling `find()` or setting up
  listeners that depend on the component tree.

---

## Common Component Patterns

### Plain text / number / email inputs

```html
<input data-smark type="text" name="firstName">
<input data-smark type="email" name="email">
<textarea data-smark name="bio"></textarea>
```

Type is inferred from the HTML element. Explicit `"type"` in `data-smark` is
only needed when the component type differs from the element role
(e.g., `"type":"number"` to get SmarkForm's null-aware numeric wrapper instead
of a plain `<input type="number">`).

### Null-aware numeric / date / time / color fields

Use the SmarkForm wrapper types to distinguish "empty" from `0` or `""`:

```html
<input data-smark type="number" name="age">
<input data-smark type="date" name="dob">
<input data-smark type="time" name="checkin">
<input data-smark type="datetime-local" name="departure">
<input data-smark type="color" name="theme_color">
```

These types export `null` when the field is empty, rather than `""` or `0`.

### Radio group

```html
<fieldset data-smark='{"type":"radio","name":"size"}'>
  <label><input type="radio" value="S"> Small</label>
  <label><input type="radio" value="M"> Medium</label>
  <label><input type="radio" value="L"> Large</label>
</fieldset>
```

### Nested subform

```html
<div data-smark='{"name":"address"}'>
  <input data-smark type="text" name="street">
  <input data-smark type="text" name="city">
  <input data-smark type="text" name="zip">
</div>
```

Exports as `{ "address": { "street": "...", "city": "...", "zip": "..." } }`.

### Label (read-only display field)

```html
<span data-smark='{"type":"label","name":"total"}'>0</span>
```

Updated programmatically via `import()`:
```javascript
await myForm.find('/total').import('$42.00');
```

### Foldable section

```html
<div data-smark='{"name":"advanced","foldable":true,"folded":true}'>
  <input data-smark type="text" name="apiKey">
</div>
<button data-smark='{"action":"unfold","context":"advanced"}'>Show advanced</button>
```

---

## List Patterns

### Simple list with add/remove buttons inside the list

```html
<ul data-smark='{"type":"list","name":"tags","min_items":0}'>
  <!-- item template (default role) -->
  <li>
    <input data-smark type="text" name="tag">
    <button data-smark='{"action":"removeItem"}'>−</button>
  </li>
  <!-- footer: controls that stay visible, never cloned -->
  <li data-smark='{"role":"footer"}'>
    <button data-smark='{"action":"addItem"}'>+ Add tag</button>
  </li>
</ul>
```

### List with min_items and max_items

```html
<div data-smark='{"type":"list","name":"slots","min_items":1,"max_items":5}'>
  <div>
    <input data-smark type="text" name="label">
  </div>
</div>
```

- `min_items`: Prevents removing below this count (default `1`).
- `max_items`: Prevents adding beyond this count.

### List with empty_list template

```html
<ul data-smark='{"type":"list","name":"results","min_items":0}'>
  <li>
    <span data-smark='{"type":"label","name":"title"}'></span>
  </li>
  <li data-smark='{"role":"empty_list"}'>No results yet.</li>
</ul>
```

### List with initial value (pre-populated)

```html
<div data-smark='{"type":"list","name":"items","min_items":0,"value":[{"name":"Alice"},{"name":"Bob"}]}'>
  <div>
    <input data-smark type="text" name="name">
  </div>
</div>
```

`value` sets the `defaultValue`. `reset()` restores this state.

### Sortable list

```html
<ul data-smark='{"type":"list","name":"priorities","sortable":true}'>
  <li>
    <input data-smark type="text" name="item">
    <button data-smark='{"action":"removeItem"}'>−</button>
  </li>
</ul>
```

When `sortable:true`, list items can be reordered by dragging.

### exportEmpties

By default, `exportEmpties` is `false`: empty items are stripped from
exported arrays. Set `exportEmpties:true` to keep them (useful for draft
saving):

```html
<div data-smark='{"type":"list","name":"rows","exportEmpties":true}'>
  <div><input data-smark type="text" name="value"></div>
</div>
```

`exportEmpties` is **inherited** — if a parent sets it, children inherit it.
Override explicitly on a child to change behaviour.

### Buttons outside a list (using context path)

```html
<div data-smark='{"type":"list","name":"contacts","min_items":0}'>
  <div>
    <input data-smark type="text" name="name">
    <input data-smark type="email" name="email">
  </div>
</div>
<button data-smark='{"action":"addItem","context":"contacts"}'>Add contact</button>
```

Context paths are resolved relative to the trigger's parent component.

---

## Action Triggers

| Action | Typical target | Notes |
|--------|---------------|-------|
| `export` | form / list | Emits `AfterAction_export` with data |
| `import` | form / list | Reads from linked `target` textarea or uses `data` |
| `reset` | form / list | Restores `defaultValue` |
| `clear` | form / list | Clears to `emptyValue` |
| `addItem` | list | Adds one item |
| `removeItem` | list item | Removes the item containing this trigger |
| `fold` / `unfold` | form / list | Toggles visibility |
| `position` | list item | Shows 1-based index (label) |
| `count` | list | Shows total item count (label) |

### Export / Import with a linked textarea

```html
<textarea data-smark='{"name":"editor"}'></textarea>
<button data-smark='{"action":"export","target":"editor"}'>Export →</button>
<button data-smark='{"action":"import","target":"editor"}'>← Import</button>
```

`target` is a sibling path. Export writes to the textarea; Import reads from it.

### Hotkeys

```html
<button data-smark='{"action":"addItem","hotkey":"+"}'>+ Add</button>
<button data-smark='{"action":"removeItem","hotkey":"-"}'>− Remove</button>
```

Hotkeys are **context-driven**: the `+` key only fires for the list that is
currently focused (or the nearest ancestor list when focus is inside an item).
The same key can be registered on multiple lists without conflict.

---

## Default Values and Reset Semantics

### Setting a default via HTML

```html
<input data-smark type="text" name="country" value="US">
```

Or via `data-smark` options (for container components):

```html
<div data-smark='{"name":"prefs","value":{"theme":"dark"}}'>
  <input data-smark type="text" name="theme">
</div>
```

Do **not** set both `value=""` (HTML attribute) and `"value":...` in
`data-smark` — SmarkForm raises a `VALUE_CONFLICT` error.

### import() updates the default (since v0.13.0)

Calling `component.import(data)` updates `defaultValue` by default
(`setDefault:true`). After this, `reset()` restores the imported data.

To import without touching the default:

```javascript
await myForm.import(data, { setDefault: false });
```

Or via a trigger:

```html
<button data-smark='{"action":"import","setDefault":false}'>Preview</button>
```

---

## Listening to Events

```javascript
const myForm = new SmarkForm(document.getElementById('myForm'));
await myForm.rendered;

// After export action
myForm.on('AfterAction_export', (ev) => {
  const json = JSON.stringify(ev.data, null, 2);
  document.getElementById('output').textContent = json;
});

// Before import — transform data
myForm.on('BeforeAction_import', (ev) => {
  ev.data = normalise(ev.data);
});
```

Event names follow the pattern `BeforeAction_<name>` / `AfterAction_<name>`.

---

## Programmatic Access

```javascript
const myForm = new SmarkForm(document.getElementById('myForm'));
await myForm.rendered;

// Read a field value
const email = await myForm.find('/email').export();

// Write a field value
await myForm.find('/email').import('user@example.com');

// Trigger an action on a sub-component
await myForm.find('/contacts').addItem(null, { silent: true });
```

Always `await myForm.rendered` before calling `find()`.

`@action` methods require `null` as the first argument when passing only
options:

```javascript
// Correct
await list.addItem(null, { silent: true });

// Wrong — options are treated as data
await list.addItem({ silent: true });
```

---

## Accessibility and UX Conventions

- Give every trigger button a meaningful `title` attribute so users and
  assistive technology can identify it.
- Use hotkeys for frequently repeated list operations (`+` / `-`).
- Use `empty_list` templates to communicate an empty state rather than hiding
  the list container.
- Place Export/Import/Reset/Clear buttons outside the form data area (or in a
  `role="footer"` template) so they are always reachable.

---

## Prompt Templates for Developers

Copy and adapt one of these prompts when asking an AI to implement a form.

### Prompt: Create a simple contact form

```
Using SmarkForm (CDN ESM: https://cdn.jsdelivr.net/npm/smarkform/dist/SmarkForm.esm.js),
create a contact form with fields: name (text), email (email), phone (text, optional),
message (textarea). Include Export and Reset buttons. Log exported data to the console.
Follow patterns from AGENTS/SmarkForm-Forms.md.
```

### Prompt: Create a form with a repeating list

```
Using SmarkForm loaded via CDN (UMD), create an invoice form with:
- Header fields: client name (text), date (date)
- A line-items list (name it "items") where each item has: description (text),
  quantity (number, SmarkForm null-aware), unit_price (number, null-aware).
- min_items:1, max_items:10 on the list.
- Add/Remove hotkeys + and -.
- Export and Reset buttons outside the list.
Output exported JSON to a <pre> element on the page.
Refer to AGENTS/SmarkForm-Forms.md for patterns.
```

### Prompt: Add a SmarkForm form to an existing page

```
I have an existing HTML page. Add a SmarkForm registration form to the
#registration-section div. Fields: username (text), password (input type="password",
plain input — not a SmarkForm type), role (radio: admin / editor / viewer).
Load SmarkForm from npm (already installed as "smarkform"). Use ESM import.
Set defaultValue for role to "editor". After export, POST the data to /api/register.
See AGENTS/SmarkForm-Forms.md for patterns.
```

---

## Agent Checklist

Before submitting a SmarkForm implementation, verify:

- [ ] `data-smark` attribute present on every managed field.
- [ ] Root element passed to the `SmarkForm` constructor does not need `data-smark`.
- [ ] `await myForm.rendered` before any `find()` calls or direct component access.
- [ ] List items are correct: only one item template (default role); other roles
      (`empty_list`, `header`, `footer`, `separator`, `placeholder`) used
      as needed.
- [ ] Buttons inside cloned list items that target a sub-list use
      `role="footer"` inside the sub-list, not an external `context` path
      (see `AGENTS/SmarkForm-Usage.md` — "Buttons inside vs. outside a list").
- [ ] `@action` methods called with `null` as first arg when passing only options
      (e.g., `addItem(null, { silent: true })`).
- [ ] `exportEmpties` set explicitly on nested lists when parent and child need
      different behaviour.
- [ ] No `value=""` HTML attribute AND `"value":...` in `data-smark` on the same element.
- [ ] CDN URLs pin to a specific version for production code.
