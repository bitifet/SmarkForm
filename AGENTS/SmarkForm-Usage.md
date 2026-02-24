# SmarkForm Usage — Agent Knowledge

This document captures key knowledge about how SmarkForm works from a **usage** perspective (writing HTML/CSS/JS that uses the library). It is intended to help coding agents avoid common mistakes.

## Repository Structure

```
SmarkForm/
├── src/                     # Library source code
│   ├── main.js              # Entry point — exports the SmarkForm class
│   ├── types/               # Component type implementations
│   │   ├── form.type.js     # form component (also used as root)
│   │   ├── list.type.js     # list component
│   │   ├── input.type.js    # input/textarea
│   │   ├── trigger.type.js  # trigger (button/action)
│   │   ├── label.type.js    # label display
│   │   ├── color.type.js    # color picker (with null support)
│   │   ├── date.type.js     # date field (with null)
│   │   ├── time.type.js     # time field (with null)
│   │   ├── datetime-local.type.js
│   │   ├── number.type.js   # numeric field (with null)
│   │   ├── radio.type.js    # radio button group
│   │   └── list.decorators/ # list-specific decorators
│   ├── lib/                 # Shared utilities
│   │   ├── events.js        # Event system (@events decorator, emit, on, onLocal, onAll)
│   │   ├── field.js         # Base field class (@action decorator lives here)
│   │   ├── component.js     # Base component class
│   │   ├── hotkeys.js       # Hotkey handler
│   │   ├── helpers.js       # Utility functions
│   │   ├── legacy.js        # Backwards-compat shims
│   │   └── test/            # Internal test helpers
│   └── decorators/          # Cross-cutting decorators
│       ├── export_to_target.deco.js
│       ├── import_from_target.deco.js
│       ├── foldable.deco.js
│       └── mutex.deco.js
├── dist/                    # Built output (ESM + UMD, committed)
│   ├── SmarkForm.esm.js
│   └── SmarkForm.umd.js
├── docs/                    # Documentation site (Jekyll)
│   ├── index.md             # Home page
│   ├── _about/              # About, FAQ, Showcase, Roadmap, Features
│   ├── _getting_started/    # Quick start, core concepts, getting SmarkForm
│   ├── _component_types/    # Per-type API docs
│   ├── _advanced_concepts/  # Events, data import/export, traversal, API interface
│   ├── _resources/          # User guide, examples list, CDN, download
│   ├── _community/          # Contributing, branding, support, license, contact
│   ├── assets/              # CSS, JS, images
│   ├── _includes/           # Jekyll includes (sampletabs, links, head_custom)
│   ├── _layouts/            # Jekyll layouts
│   ├── _data/               # Jekyll data files (computed bundle size, etc.)
│   └── _config.yml          # Jekyll configuration
├── test/                    # Playwright tests
│   ├── *.tests.js           # Test files (matched by playwright.config.js)
│   └── doc/                 # Test helpers and writing guide
├── scripts/                 # Build and dev scripts
│   ├── collect-docs-examples.js  # Extracts doc examples into test manifest
│   ├── build_production_smarkform.sh
│   ├── build_all.sh
│   └── liveserve_all.sh
├── AGENTS/                  # Agent knowledge files (this directory)
├── AGENTS.md                # Automation overview for agents and contributors
└── PROMPTS.md               # Future work brainstorm / task prompts
```

## Docs Build Pipeline

- **Jekyll site** lives in `docs/` and is built with `npm run doc` (or
  `scripts/build_documentation_site.sh`).
- **GitHub Pages** deploys **only from the `stable` branch** via
  `.github/workflows/pages.yml`. Pushes to `main` do **not** deploy the site.
- To preview locally: `npm run servedoc` (Jekyll with live reload) or `npm run dev`
  (library watcher + Jekyll server together).
- The `docs/_data/` directory holds auto-generated files (`computed.json`) that
  Jekyll uses for bundle size and last-updated date. These are written by the
  build script before Jekyll runs.
- **Co-located example tests** are collected by `scripts/collect-docs-examples.js`
  (run automatically as `npm run pretest`) into `test/.cache/docs_examples.json`.
  The Playwright test suite then replays each example.

## Updating Component Type API Docs

Each component type has a matching doc page under `docs/_component_types/`:

| Type | Doc file |
|------|----------|
| `form` | `docs/_component_types/type_form.md` |
| `list` | `docs/_component_types/type_list.md` |
| `input` | `docs/_component_types/type_input.md` |
| `trigger` | `docs/_component_types/type_trigger.md` |
| `color` | `docs/_component_types/type_color.md` |
| `date` | `docs/_component_types/type_date.md` |
| `time` | `docs/_component_types/type_time.md` |
| `datetime-local` | `docs/_component_types/type_datetime-local.md` |
| `number` | `docs/_component_types/type_number.md` |
| `radio` | `docs/_component_types/type_radio.md` |
| `label` | `docs/_component_types/type_label.md` |

When adding a new option or action to a component type in `src/types/`, also
update the corresponding doc page under `docs/_component_types/`. Use the same
front-matter structure and table conventions already in those files.

## How SmarkForm Enhances HTML

SmarkForm reads `data-smark` attributes on DOM nodes to build a reactive form tree. The root element is passed to the `SmarkForm` constructor:

```javascript
const myForm = new SmarkForm(document.getElementById("myForm"));
```

Only elements with a `data-smark` attribute are captured and enhanced by SmarkForm. SmarkForm is markup-agnostic — plain HTML elements inside a managed component are ignored unless they also have `data-smark`.

Exceptions:
- The **root element** passed directly to the `SmarkForm` constructor does not need `data-smark`
- A **list's item template** implicitly becomes a `form` type; its type can also be overridden via the `of` property in the list's options

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

**⚠️ Exception — buttons inside cloned item templates**: When a list's item template itself contains a sub-list (e.g., a periods list whose items contain schedule lists), and buttons targeting the sub-list are placed **outside** that sub-list but **inside** the item template (so they get cloned), context resolution may fail for the cloned instances. In this case, place the buttons **inside** the sub-list using `role="footer"`:

```html
<!-- SAFE: buttons inside the sub-list via role="footer" -->
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
- This is the correct pattern for the hotel schedule example

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

### `@action` Decorator — Calling Convention and Nuances

⚠️ **This is a common source of bugs.** Read carefully before writing internal or programmatic action calls.

#### Signature convention

Every method decorated with `@action` follows the signature:

```javascript
async actionName(data, options = {})
```

`data` is the **first** positional argument. `options` is the **second**. This mirrors how trigger components call actions (see below). Even when `data` is not used by the method itself (named `_data`), you **must** pass `null` (or a value) as the first argument when calling it in code if you want to pass options:

```javascript
// ✅ CORRECT — data is null, options is the second arg
await me.addItem(null, { silent: true });
await me.removeItem(null, { silent: true });

// ❌ WRONG — options object is silently received as `data` (_data), options defaults to {}
await me.addItem({ silent: true });
await me.removeItem({ silent: true });
```

This was the root cause of the initialization focus race in `list.type.js` (where `addItem`/`removeItem` were called with the options object as the first argument).

#### How triggers call actions

When a trigger button is clicked, `onTriggerClick` calls the action like this:

```javascript
const options = triggerComponent.getTriggerArgs();
// options = { action, origin, context, target, ...other data-smark properties }
const { context, action, data } = options;
await context.actions[action](data, options);
```

- `data` comes from a `"data"` property on the trigger's `data-smark` attribute — usually `undefined`
- `options` is the full trigger-args object (includes `action`, `origin`, `context`, `target`, any other properties)

Triggers have **no separate "data" channel** — they can only pass a single value via `data-smark='{"action":"...", "data": <value>}'`. This is why the method signature places `data` first (for programmatic use) while triggers supply it via `options.data`.

#### The `@action` wrapper — what it does

The decorator registers a wrapper in `this.actions[name]` that runs around the raw method:

1. **Sets `options.focus = true` by default** — unless `focus` is already an own property of `options`. This means trigger-initiated calls always focus by default. Internal/silent calls must explicitly pass `{ focus: false }` or use `{ silent: true }`.

2. **Sets `options.data = data`** — so `BeforeAction` event handlers can read or modify the incoming data.

3. **Emits `BeforeAction_<name>`** — unless `options.silent`. Handlers can call `event.preventDefault()` to cancel the action.

4. **Re-reads `data` from `options.data`** after `BeforeAction` — allowing event handlers to substitute the data.

5. **Calls the raw method**: `targetMtd.call(me, data, options)`

6. **Updates `options.data`** with the return value.

7. **Emits `AfterAction_<name>`** — unless `options.silent`.

```javascript
// Example: adding an item silently (no focus, no events)
await me.addItem(null, { silent: true });

// Example: from a beforeAction handler modifying data
component.onLocal("BeforeAction_import", (ev) => {
    ev.data = transformData(ev.data);  // swap in new data
});
```

#### Programmatic calls — prototype vs. `actions[name]`

There are two ways to invoke an action in JavaScript:

- **`component.actions.reset(data, options)`** — goes through the `@action` wrapper: fires events, defaults `focus`, etc.
- **`component.reset(data, options)`** — calls the **prototype method directly**, bypassing the `@action` wrapper entirely (no events, no automatic `focus` defaulting, no `BeforeAction` cancellation).

Most internal calls (e.g., from `import()`, `removeItem()`) use the prototype method directly to avoid overhead and event noise. However, this also means `options.silent` and `options.focus` must be set explicitly for every such call.

#### `export_to_target` and `import_from_target` — data pipeline decorators

These decorators are often stacked with `@action`:

- **`@export_to_target`**: After the method returns a value, tries to call `options.target.import(value)`. Transparent if `target` is absent.
- **`@import_from_target`**: Before calling the method, tries to call `options.target.export()` to replace `data`. Transparent if `target` is absent.

They modify the data pipeline at the prototype level (not inside the `@action` wrapper). The `target` option is consumed by these decorators and stripped from `options` before the raw method is called.

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
