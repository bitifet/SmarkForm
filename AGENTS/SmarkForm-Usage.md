# SmarkForm Usage — Agent Knowledge

This document captures key knowledge about how SmarkForm works from a **usage** perspective (writing HTML/CSS/JS that uses the library). It is intended to help coding agents avoid common mistakes.

## How SmarkForm Enhances HTML

SmarkForm reads `data-smark` attributes on DOM nodes to build a reactive form tree. The root element is passed to the `SmarkForm` constructor:

```javascript
const myForm = new SmarkForm(document.getElementById("myForm"));
```

Every element that participates in the form must either:
- Have a `data-smark` attribute (possibly empty: `data-smark`), OR
- Be a plain HTML element inside a SmarkForm-managed component

## Component Types

| Type | Role | Notes |
|------|------|-------|
| `form` | Container for named fields | Default type for root and nested containers |
| `list` | Ordered collection of items | Items are cloned from a template |
| `input` | Scalar value input (`<input>`, `<textarea>`) | Auto-detected by `<input>` tag |
| `trigger` | Action button | Required `action` property |
| `label` | Read-only display | Uses `data-smark` on element with inner content |

Type is auto-inferred in many cases. The `type` key in `data-smark` can override.

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

### Critical: Buttons inside vs. outside a list

**Buttons controlling a list (addItem, removeItem) MUST be placed inside the list container** (as template children, typically inside `role="item"` or `role="footer"`). 

❌ **Do NOT place control buttons outside the list** (e.g., as siblings in a CSS grid parent):
```html
<!-- WRONG: button outside list, referenced via context= -->
<div class="row">
  <div data-smark='{"type":"list","name":"myList"}'>...</div>
  <button data-smark='{"action":"addItem","context":"myList"}'>➕</button>
</div>
```
This causes a **"Receiver must be an instance of class"** JavaScript error when the list is initialized with `value:[{}]` or when items are added dynamically, because SmarkForm tries to call internal private class methods (`#appendChild`, etc.) on an object that doesn't have the right class instance.

✅ **CORRECT: buttons inside the list via `role="footer"`**:
```html
<div data-smark='{"type":"list","name":"myList","min_items":0,"max_items":3}'>
  <!-- item template (default role) -->
  <span class="slot">
    <input data-smark type="time" name="start"> to <input data-smark type="time" name="end">
  </span>
  <!-- placeholder fills gap when list has fewer items than max -->
  <span data-smark='{"role":"placeholder"}'></span>
  <!-- footer holds controls, always visible, not cloned -->
  <span data-smark='{"role":"footer"}'>
    <button data-smark='{"action":"removeItem","hotkey":"-"}'>➖</button>
    <button data-smark='{"action":"addItem","hotkey":"+"}'>➕</button>
  </span>
</div>
```

### List Initialization with `value` Property

If `options.value` is set on a list, it becomes the list's `defaultValue`. On initialization, `reset()` is called which triggers `import(this.defaultValue)`.

```html
<!-- Starts with 1 empty item; reset() restores this state -->
<div data-smark='{"type":"list","name":"items","min_items":0,"value":[{}]}'>
  <span>...</span>
</div>
```

### `exportEmpties` Behavior

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
- This is the correct pattern for the hotel schedule example

## Form Component — `value` and `defaultValue`

The `value` property in `data-smark` options sets the field's `defaultValue`:
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

**Note**: `data-role` is set by SmarkForm on template nodes when they are re-injected into the DOM. The CSS selects on `data-role`, not `data-smark`, because `data-smark` is the original attribute while `data-role` is set by the framework at render time.

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
- If `context` is specified: `me.parent.find(contextPath)` — looks for the named component
- If not specified: walks up parent chain to find the first component with the action

Context paths:
- `"demo"` — sibling named "demo" relative to the trigger's parent
- `"/"` — root form
- `".-1"` — previous sibling (used for `source` in duplicate)
- `"..fieldname"` — named field in grandparent scope

## Writing Co-located Tests

See `test/doc/WRITING_TESTS.md` for the full guide. Key points:
- Use `readField('/path/to/field')` to export a field's value (uses the field's `export()` action)
- Use `writeField('/path/to/field', value)` to import a value into a field
- `readField('/periods')` returns the exported array for the `periods` list
- Button locators should prefer `title` attribute or role+name over positional `.nth()`
- Use `page.getByTitle('Less intervals')` / `page.getByTitle('More intervals')` for interval controls

## `exportEmpties` and Test Assertions

When schedule lists have `exportEmpties:false` and all intervals are null/empty:
```javascript
// All null intervals are stripped to [] in the exported data
expect(await readField('/periods')).toEqual([{
    start_date: null, end_date: null,
    schedules: {
        rcpt_schedule: [],   // 2 null intervals stripped
        bar_schedule: [],    // 3 null intervals stripped
        restaurant_schedule: [],  // 3 null intervals stripped
        pool_schedule: []    // 1 null interval stripped
    }
}]);
```
To write a meaningful duplication test (prove copy vs. reset), **fill in non-null values** before duplicating:
```javascript
await writeField('/periods/0/start_date', '2025-04-01');
await writeField('/periods/0/end_date', '2025-09-30');
// ...add intervals...
await duplicateBtn.click();
// Now both periods have the same dates → proves duplication, not reset
```
