---
title: "SmarkForm Usage — Agent Knowledge"
layout: default
permalink: /resources/AGENTS/SmarkForm-Usage
nav_exclude: true
---

{% include links.md %}

# {{ page.title }}

This document captures key knowledge about how SmarkForm works from a **usage**
perspective (writing HTML/CSS/JS that uses the library). It is intended to help
coding agents avoid common mistakes.

## Component Types

| Type | Role | Notes |
|------|------|-------|
| `form` | Container for named fields | Default type for root and nested containers |
| `list` | Ordered collection of items | Items are cloned from a template |
| `input` | Scalar value input (`<input>`, `<textarea>`) | Auto-detected by element tag |
| `color` | Color picker | Wrapper around `<input type="color">` with null support |
| `date` | Date field | Wrapper with null support |
| `time` | Time field | Wrapper with null support |
| `datetime-local` | Date+time field | Wrapper with null support |
| `number` | Numeric field | Wrapper with null support |
| `radio` | Radio-button group | Group of `<input type="radio">` elements |
| `trigger` | Action button | Required `action` property |
| `label` | Read-only display | Uses `data-smark` on element with inner content |

Type is often auto-inferred from the element tag or presence of the `action` property. The `type` key in `data-smark` can override.

## How SmarkForm Enhances HTML

SmarkForm reads `data-smark` attributes on DOM nodes to build a reactive form tree. The root element is passed to the `SmarkForm` constructor:

```javascript
const myForm = new SmarkForm(document.getElementById("myForm"));
```

Only elements with a `data-smark` attribute are captured and enhanced by SmarkForm. SmarkForm is markup-agnostic — plain HTML elements inside a managed component are ignored unless they also have `data-smark`.

Exceptions:
- The **root element** passed directly to the `SmarkForm` constructor does not need `data-smark`
- A **list's item template** implicitly becomes a `form` type; its type can also be overridden via the `of` property in the list's options

## List Component — Critical Rules

**Every direct child of a list container is treated as a template node.** There is no notion of "regular children" — ALL children are templates and are **removed from the DOM** during initialization (stored internally). This is done by `loadTemplates()` in `src/types/list.type.js`.

### Template Roles

Set via `data-smark='{"role":"<role>"}'`:

| Role | Purpose |
|------|---------|
| `item` (default) | The repeating item template |
| `empty_list` | Shown when list has 0 items |
| `header` | Shown before items (not cloned) |
| `footer` | Shown after items (not cloned) |
| `placeholder` | DOM filler for fixed-width grids when slots are empty |
| `separator` | Between items |
| `last_separator` | Between second-to-last and last items |

### Buttons inside vs. outside a list

Buttons (triggers) can be placed **outside** their target component using the `context` property with a path. The playground's Export/Import/Reset/Clear buttons are a canonical example — they live in the root form but target the `demo` subform via `context:"demo"`.

```html
<!-- Buttons OUTSIDE the list with explicit context path -->
<div data-smark='{"type":"list","name":"myList"}'>...</div>
<button data-smark='{"action":"addItem","context":"myList"}'>➕</button>
```

Context paths are resolved lazily at action-trigger time via `find()`. Relative paths are resolved from the trigger's parent component.

{: .warning}
> **Exception — buttons inside cloned item templates**: When a list's item template itself contains a sub-list, and buttons targeting the sub-list are placed **outside** that sub-list but **inside** the item template (so they get cloned), context resolution may fail for the cloned instances. In this case, place the buttons **inside** the sub-list using `role="footer"`:

```html
<!-- SAFE: buttons inside the sub-list via role="footer" -->
<div data-smark='{"type":"list","name":"myList","min_items":0,"max_items":3}'>
  <!-- item template (default role) -->
  <span class="slot">
    <input data-smark type="time" name="start"> to <input data-smark type="time" name="end">
  </span>
  <!-- placeholder fills gap when list has fewer items than max -->
  <span data-smark='{"role":"placeholder"}'>❌</span>
  <!-- footer holds controls, always visible, not cloned -->
  <span data-smark='{"role":"footer"}'>
    <button data-smark='{"action":"removeItem","hotkey":"-"}'>➖</button>
    <button data-smark='{"action":"addItem","hotkey":"+"}'>➕</button>
  </span>
</div>
```

{: .info}
> Only the *item* template is required. The rest are optional depending on
> the desired UI/UX and layout.

### List Initialization with `value` Property

If `options.value` is set on a list, it becomes the list's `defaultValue`. On initialization, `reset()` is called which triggers `import(this.defaultValue)`.

```html
<!-- Starts with 1 empty item; reset() restores this state -->
<div data-smark='{"type":"list","name":"items","min_items":0,"value":[{}]}'>
  <span>...</span>
</div>
```

### `exportEmpties` Behavior

The `exportEmpties` option is **inherited** — a child component inherits the value from its nearest ancestor that sets it. This means you may need to explicitly set `exportEmpties:false` on a nested list even if it matches the default, to override an ancestor's `exportEmpties:true`.

When `exportEmpties: false` (the default):
- List items are checked via `isEmpty()` before being included in the exported array
- A form item is empty if ALL its field children are empty (null/undefined)
- Empty items are stripped from the output → `[]` for a list of all-null items

When `exportEmpties: true` (must be explicit):
- All items are exported regardless of emptiness
- Useful for "save progress" scenarios where partial data is intentional

When an outer list (`exportEmpties:true`) contains an inner list (`exportEmpties:false`):
- Outer list exports all its items (including empty-looking ones)
- Inner list strips its empty items when exported as part of the outer item

## Form Component — `value` and `defaultValue`

The `value` property in `data-smark` options sets the field's `defaultValue`. For native HTML elements that support the `value` attribute (`<input>`, `<textarea>`, etc.), you can also set the default via the HTML attribute directly — but not both simultaneously (SmarkForm raises a `VALUE_CONFLICT` error if both are set).

```html
<div data-smark='{"name":"demo","value":{"name":"Alice"}}'>
  <input data-smark type="text" name="name">
</div>
```

- `demo.defaultValue = {"name": "Alice"}`
- `reset()` on `demo` → `import({"name": "Alice"})` → fills "Alice" into the name field

## CSS Layout with SmarkForm Lists

Because SmarkForm removes ALL direct children of a list container during initialization (treating them as templates), CSS tricks that depend on children being in the DOM at load time need to account for the SmarkForm lifecycle.

### CSS Grid with Lists

To align list rows in a grid while items stack vertically:

```css
/* Each list is a 3-column grid row: label | slots | controls */
.schedule-row {
    display: grid;
    grid-template-columns: 10em 1fr auto;
    align-items: center;
}
/* The header (label) goes in col 1, row 1 */
.schedule-row > [data-role="header"] {
    grid-column: 1;
    grid-row: 1;
}
/* Items (slots) stack in col 2 */
.schedule-row > .slot {
    grid-column: 2;
}
/* Footer (controls) spans all item rows in col 3 */
.schedule-row > [data-role="footer"] {
    grid-column: 3;
    grid-row: 1 / -1;
    align-self: center;
}
/* Placeholder not needed for layout — hide it */
.schedule-row > [data-role="placeholder"] {
    display: none;
}
```

{: .info}
> `data-role` is set by SmarkForm on template nodes when they are re-injected
> into the DOM. The CSS selects on `data-role`, not `data-smark`, because
> `data-smark` is the original attribute while `data-role` is set by the
> framework at render time.

## Actions

Common actions triggered via `data-smark='{"action":"<name>"}'`:

| Action | Target | Notes |
|--------|--------|-------|
| `export` | form/list | Exports current values as JSON |
| `import` | form/list | Imports JSON into the form |
| `reset` | form/list | Resets to `defaultValue` |
| `clear` | form/list | Clears to `emptyValue` (type-level empty) |
| `addItem` | list | Adds a new item |
| `removeItem` | list | Removes target item |
| `position` | list item | Shows item's 1-based index |
| `count` | list | Shows total item count |
| `fold` / `unfold` | form/list | Toggles visibility |

### Action Context Resolution

When a trigger button is clicked, SmarkForm resolves its `context` (the component that owns the action):
- If `context` is specified: `me.parent.find(contextPath)` — looks for the named component **relative to the trigger's parent**
- If not specified: walks up parent chain to find the first component with the action

Context paths:
- `"demo"` — sibling named "demo" relative to the trigger's parent
- `"/"` — root form
- `".-1"` — previous sibling (used for `source` in duplicate)
- `"..fieldname"` — named field in grandparent scope

### Action Target Resolution

{: .warning}
> Target paths are **not** relative to the trigger's position — they are resolved from the
> **resolved context** via `context.find(targetPath)`.

When `target` is specified, the path is evaluated starting from the context component. If you want to target a *sibling* of the context, you must navigate up with `..` first:

```html
<!-- Export billing, import into shipping (siblings of the root) -->
<button data-smark='{
    "action": "export",
    "context": "billing",
    "target": "../shipping"
}'>📋 Copy to shipping</button>
```

- `context:"billing"` → `triggerParent.find("billing")` → the billing subform
- `target:"../shipping"` → `billing.find("../shipping")` → up to billing's parent, then "shipping"
- `"target":"shipping"` alone → `billing.find("shipping")` → looks for a **child of billing** named "shipping" — silent failure

Absolute target paths (starting with `/`) resolve from the root and avoid this ambiguity:

```html
<button data-smark='{"action":"export","context":"billing","target":"/shipping"}'>📋 Copy</button>
```

**Target semantics by action:**
- `export` with target → exports the context, imports result into target (copy: context → target)
- `import` with target → exports from target, imports result into context (copy: target → context)

```html
<!-- Copy FROM previous sibling INTO current item -->
<button data-smark='{"action":"import","context":".","target":".-1"}'>← Copy from Previous</button>

<!-- Copy current item INTO next sibling -->
<button data-smark='{"action":"export","context":".","target":".+1"}'>Copy to Next →</button>
```

### `@action` Decorator — Calling Convention and Nuances

{: .warning}
> This is a common source of bugs. Read carefully before writing internal or
> programmatic action calls.

#### Signature convention

Every method decorated with `@action` follows the signature:

```javascript
async actionName(data, options = {})
```

`data` is the **first** positional argument. `options` is the **second**. Even when `data` is not used by the method itself, you **must** pass `null` (or a value) as the first argument when calling it in code if you want to pass options:

```javascript
// ✅ CORRECT — data is null, options is the second arg
await me.addItem(null, { silent: true });
await me.removeItem(null, { silent: true });

// ❌ WRONG — options object is silently received as data, options defaults to {}
await me.addItem({ silent: true });
await me.removeItem({ silent: true });
```

#### How triggers call actions

When a trigger button is clicked, `onTriggerClick` calls the action like this:

```javascript
const options = triggerComponent.getTriggerArgs();
const { context, action, data } = options;
await context.actions[action](data, options);
```

- `data` comes from a `"data"` property on the trigger's `data-smark` attribute — usually `undefined`
- `options` is the full trigger-args object

#### The `@action` wrapper — what it does

The decorator registers a wrapper in `this.actions[name]` that runs around the raw method:

1. **Sets `options.focus = true` by default** — unless `focus` is already an own property of `options`.
2. **Sets `options.data = data`** — so `BeforeAction` event handlers can read or modify the incoming data.
3. **Emits `BeforeAction_<name>`** — unless `options.silent`. Handlers can call `event.preventDefault()` to cancel the action.
4. **Re-reads `data` from `options.data`** after `BeforeAction` — allowing event handlers to substitute the data.
5. **Calls the raw method**: `targetMtd.call(me, data, options)`
6. **Updates `options.data`** with the return value.
7. **Emits `AfterAction_<name>`** — unless `options.silent`.

```javascript
// Adding an item silently (no focus, no events)
await me.addItem(null, { silent: true });

// From a beforeAction handler modifying data
component.onLocal("BeforeAction_import", (ev) => {
    ev.data = transformData(ev.data);
});
```

#### Programmatic calls — prototype vs. `actions[name]`

- **`component.actions.reset(data, options)`** — goes through the `@action` wrapper: fires events, defaults `focus`, etc.
- **`component.reset(data, options)`** — calls the **prototype method directly**, bypassing the `@action` wrapper entirely.

Most internal calls use the prototype method directly to avoid overhead and event noise.

#### `export_to_target` and `import_from_target` — data pipeline decorators

These decorators are often stacked with `@action`:

- **`@export_to_target`**: After the method returns a value, tries to call `options.target.import(value)`. Transparent if `target` is absent.
- **`@import_from_target`**: Before calling the method, tries to call `options.target.export()` to replace `data`. Transparent if `target` is absent.

## `import()` and `setDefault` — Default Value Semantics

Since v0.13.0, calling `component.import(data)` **updates the component's `defaultValue`** by default (i.e., `setDefault` defaults to `true`). This means `reset()` after an `import()` restores the imported data, not the HTML initialization default.

### Behavior Summary

| Call | Updates default? | What `reset()` restores |
|------|-----------------|------------------------|
| `import(data)` | ✅ Yes | `data` (normalized via `exportEmpties:true`) |
| `import(data, {setDefault:false})` | ❌ No | Previous default |
| `import(undefined)` | ❌ No (always skipped) | Current default unchanged |
| `clear()` | ❌ No | Default unchanged |
| `reset()` | ❌ No | Current default |

### How the New Default is Computed

After a successful `import(data)` with `setDefault:true`, the new `defaultValue` is set by:

```javascript
me.defaultValue = await me.export(null, {silent: true, exportEmpties: true});
```

Using `exportEmpties: true` ensures empty list items are included in the stored default so `reset()` restores the exact same structure (including empty slots).

### Breaking Change From Earlier Versions

Code that calls `import(data)` and expects `reset()` to restore the original HTML-defined default must now use:

```javascript
await component.import(data, {setDefault: false});
```

### HTML Trigger Example

```html
<!-- Import without updating defaults (preview mode) -->
<button data-smark='{"action":"import","setDefault":false}'>Preview</button>
<!-- Import with default update (load/apply mode, the new default) -->
<button data-smark='{"action":"import"}'>Load Data</button>
```

## `find()` Timing — Must Await `rendered`

The `find()` method looks up components in an internal map that is built **asynchronously during `render()`**. Before rendering is complete, **all `find()` calls return `null`** (or `undefined`).

```javascript
const myForm = new SmarkForm(document.getElementById("myForm"));

// ❌ WRONG — render is not done yet, find returns null
const field = myForm.find("/name"); // null!

// ✅ CORRECT — wait for render to complete
await myForm.rendered;
const field = myForm.find("/name"); // returns the component
```

**Inside event handlers** (`AfterAction_*`, `afterRender`, etc.) this is not an issue because those events only fire after rendering has finished.

## List Template Roles — Complete Reference

| Role | Behavior |
|------|----------|
| `item` (default) | Repeating item template. **Required.** Cloned for each list item. |
| `empty_list` | Shown in the list container when there are 0 items. Removed when the first item is added. |
| `header` | Prepended once to the list container. **Not cloned.** Cannot contain SmarkForm fields; can contain triggers. |
| `footer` | Appended once to the list container. **Not cloned.** Cannot contain SmarkForm fields; can contain triggers. |
| `separator` | Cloned between each pair of adjacent items. Removed when only one item remains. |
| `last_separator` | Like `separator` but used only between the second-to-last and last item. Falls back to `separator` if not defined. |
| `placeholder` | Visual filler shown for each empty slot when `max_items` is set. One placeholder per unfilled slot. |

### Rules for non-`item` roles

- `header`, `footer`: Rendered once per list, not duplicated. Can contain action triggers (`addItem`, etc.) but **not** SmarkForm data fields.
- `separator`, `last_separator`: Cloned dynamically by `renum()` as items are added/removed. Not enhanced by SmarkForm.
- `placeholder`: Only rendered when `max_items` is finite. Count = `max_items - children.length` (minus 1 if `empty_list` is also shown and the list is empty).
- `empty_list`: Managed by `renum()`. Added when `children.length === 0`, removed otherwise.

Set the role via `data-smark='{"role":"<role>"}'`. The `item` role is the default and does not need to be specified explicitly.
