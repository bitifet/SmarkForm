---
title: Form Traversing
layout: chapter
permalink: /working_with_forms/form_traversing
description: "Find and navigate SmarkForm components by name or path, using relative traversal, wildcards, contexts and targets."
nav_order: 0

---

{% include links.md %}

{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {% include chaptertoc/form_traversing.html %}

</details>

## Introduction

Form traversing in SmarkForm provides a powerful and intuitive way to navigate through the component hierarchy and interact with specific parts of your forms. The `.find()` method serves as the primary mechanism for locating components within the form structure, supporting both simple navigation and complex path-based queries.

{: .warning :}
> **Call `find()` only after `await myForm.rendered`.**
> SmarkForm builds its internal map of field components asynchronously. Calling
> `find()` before rendering is complete will return `null` for every path.
> Inside event handlers this is not necessary since they only fire after render.

Building upon the foundational concepts introduced in the [Quick Start Guide]({{ "getting_started/quick_start#form-traversing" | relative_url }}), this comprehensive guide explores the full capabilities of SmarkForm's traversing system.

Every SmarkForm component provides a `.find()` method that accepts a path-like route to locate target components. This path-based approach enables precise navigation through nested form structures, making it easy to access, manipulate, and coordinate between different parts of your form.

## Path Syntax Overview

SmarkForm paths follow a familiar filesystem-like syntax that makes navigation intuitive for developers. Understanding the different types of paths and their behaviors is essential for effective form traversing.

### Absolute Paths

Absolute paths begin with a forward slash (`/`) and are resolved from the form root, regardless of the current component's position in the hierarchy.

```javascript
// Always resolves from the form root
const businessData = myForm.find("/businessData");
const specificField = myForm.find("/personalData/address");
```

Absolute paths are particularly useful when you need to access components from any position within the form, ensuring consistent behavior regardless of the calling context.

### Relative Paths

Relative paths do not begin with a forward slash and are resolved relative to the current component. This enables context-aware navigation that adapts based on the caller's position.

```javascript
// From within a list item, access a sibling field
const nameField = currentItem.find("name");

// From a parent component, access nested children
const phoneList = personalData.find("contactInfo/phones");
```

### Special Path Segments

SmarkForm recognizes several special path segments that provide convenient navigation shortcuts:

- `..` - Navigate to the parent component
- `.+N` - Navigate to the next sibling (where N is a positive integer)
- `.-N` - Navigate to the previous sibling (where N is a positive integer)
- `*` and `?` - Wildcard patterns for multi-match queries

## Basic Navigation Patterns

### Child Navigation

Direct child navigation uses the component's name as defined in the `name` attribute or the `data-smark` configuration:

```javascript
// Navigate to direct children
const personalInfo = form.find("personalData");
const businessInfo = form.find("businessData");

// Chain navigation for deeper access
const streetAddress = form.find("personalData/address/street");
```

### Parent Navigation

Use the `..` segment to navigate to parent components:

```javascript
// From a deeply nested component, access its parent
const parentForm = currentField.find("..");

// Navigate to grandparent or higher ancestors
const grandParent = currentField.find("../../");
const greatGrandParent = currentField.find("../../../");
```

### Root Access

Access the form root from any component using an absolute path:

```javascript
// Always resolves to the form root
const formRoot = anyComponent.find("/");
```

## Context and Target in Actions

Understanding the concepts of *context* and *target* is crucial for effective action implementation and form interaction patterns.

### Context Terminology

Before diving into path rules, it helps to have three terms clearly defined:

- **Natural context** — the context a trigger *would* use if no `context` option is specified: the nearest ancestor field component that implements the requested action (SmarkForm walks up the ancestor chain automatically until it finds one).
- **Explicit context** — the context produced when the `context` option *is* set. Its path is resolved starting from **where the trigger is placed** in the component hierarchy (see below). The resolved component **must implement the requested action** — SmarkForm does not walk further up the chain; if the resolved component does not implement the action it is reported as an error.
- **Effective context** — the context that actually handles the action: the explicit context if one is given, otherwise the natural context.

### Triggers and Labels Are Not Field Components

Triggers (and labels) are SmarkForm components, but they are **not field components** — they cannot be addressed by a path, and they do not count as steps in path navigation.

As a consequence, calling `find()` on a trigger or label behaves exactly as if it were called on the trigger's enclosing field component (its nearest field ancestor). This matters for context path resolution:

> When SmarkForm resolves a relative `context` path, it starts navigation from the **trigger's enclosing field component** — not from the trigger node itself. In practical terms, this means paths are resolved relative to the component *containing* the trigger.

### Understanding Context

The **context** is the field component that *owns* the action being triggered.

**How context is resolved:**

1. **Explicit context** — when the `context` property is set, the path is resolved starting from **where the trigger is placed** (the enclosing field component). Because triggers are not addressable by path, a path like `"personalData"` navigates as if it were called from the trigger's parent field, not from the trigger itself. The resolved component **must implement the requested action**; SmarkForm does not automatically walk further up the ancestor chain. If the component does not implement the action, an error is reported.
2. **Natural context** — when no `context` is specified, SmarkForm walks up the ancestor chain and picks the **first ancestor that implements the requested action** automatically.

```html
<!-- Explicit context: "personalData" is a child of the enclosing field where this trigger lives -->
<button data-smark='{"action":"clear", "context":"personalData"}'>
    Clear Personal Data
</button>

<!-- Natural context: the nearest ancestor implementing "clear" -->
<div data-smark='{"name":"personalData", "type":"form"}'>
    <button data-smark-action="clear">Clear</button>
    <!-- Effective context resolves automatically to personalData -->
</div>
```

### Understanding Target

The **target** is an optional second component involved in the action. Its role depends on the action:

- For **`export`** with a target — SmarkForm exports the context and then imports the result into the target.
- For **`import`** with a target — SmarkForm exports from the target first and uses the result as the data to import into the context.

{: .important }
> **Target paths are resolved from the *effective context*, not from the trigger's position.**
>
> When `target` is specified, SmarkForm calls `context.find(targetPath)` on the effective
> context object. Because `find()` starts from the context, relative target paths are evaluated
> relative to the context — not relative to where the trigger is placed in the DOM.
>
> As a consequence, if you set an explicit `context` that is *different* from where the trigger
> is placed, you must write the `target` path relative to that context.
>
> To target a *sibling* of the context, navigate up with `..` first:
> ```html
> <!-- Export billing → import into shipping (a sibling of billing) -->
> <button data-smark='{
>     "action": "export",
>     "context": "billing",
>     "target": "../shipping"
> }'>📋 Copy to shipping</button>
> ```
> `billing.find("../shipping")` navigates up to billing's parent (the root form), then finds
> the shipping child. Using `"target":"shipping"` alone would look for a *child of billing*
> named "shipping", which does not exist.
>
> Absolute paths (starting with `/`) are always resolved from the form root and avoid this
> ambiguity entirely:
> ```html
> <button data-smark='{"action":"export","context":"billing","target":"/shipping"}'>
>     📋 Copy to shipping
> </button>
> ```

```html
<!-- Natural target resolution from DOM hierarchy (no explicit context or target) -->
<div data-smark='{"name":"addresses", "type":"list"}'>
    <div>
        <button data-smark-action="removeItem">Remove</button>
        <!-- Target resolves automatically to this list item -->
    </div>
</div>
```

### Natural Context Resolution

When no `context` is specified, SmarkForm walks up the ancestor chain to find the most appropriate context (the natural context):

```
// Example hierarchy:
// Form Root
//   ├── personalData (form)
//   │   ├── name (input)
//   │   └── clearButton (trigger)  ← trigger is placed here
//   └── businessData (form)

// When clearButton is clicked (no "context" option set):
// 1. personalData — implements 'clear' ✓
// Effective context = naturalContext = personalData
```

This automatic resolution eliminates the need for explicit wiring in most common scenarios.

### Explicit Context and Target Specification

When specifying both `context` and `target`, remember that:
- The `context` path is resolved from **where the trigger is placed** (its enclosing field component).
- The `target` path is resolved from the **effective context**.

```html
<!-- Copy personalData into businessData.
     The trigger lives inside the root form, so "personalData" is a direct child of root.
     Using an absolute target path avoids any ambiguity. -->
<button data-smark='{
    "action": "export",
    "context": "personalData",
    "target": "/businessData"
}'>Copy Personal to Business</button>

<!-- Alternatively, a relative target works if you account for where context is:
     Starting from personalData, go up one level then into businessData -->
<button data-smark='{
    "action": "export",
    "context": "personalData",
    "target": "../businessData"
}'>Copy Personal to Business</button>
```

## List Item Sibling Navigation

List item sibling navigation provides a mechanism for accessing adjacent items within lists using a concise dot notation syntax.

### Syntax

Sibling navigation uses a single dot followed by a signed integer:

- `.+N` - Navigate forward N positions (next siblings)
- `.-N` - Navigate backward N positions (previous siblings)

Where N is a positive integer representing the number of positions to move.

```javascript
// Navigate to the next sibling
const nextItem = currentListItem.find(".+1");

// Navigate to the previous sibling  
const prevItem = currentListItem.find(".-1");

// Navigate multiple positions
const itemTwoPositionsAhead = currentListItem.find(".+2");
const itemThreePositionsBehind = currentListItem.find(".-3");
```

### Navigation Direction

The direction of navigation corresponds to the visual order of list items:

- **Forward navigation** (`.+N`): Moves toward items that appear later in the list
- **Backward navigation** (`.-N`): Moves toward items that appear earlier in the list

```javascript
// In a list: [Item0, Item1, Item2, Item3, Item4]
// From Item2 position:

const item3 = item2.find(".+1");  // Forward to Item3
const item4 = item2.find(".+2");  // Forward to Item4
const item1 = item2.find(".-1");  // Backward to Item1
const item0 = item2.find(".-2");  // Backward to Item0
```

### Use Cases

Sibling navigation enables powerful patterns for list manipulation and data management:

#### Data Duplication and Synchronization

```javascript
// Copy data from current item to next item
const currentData = await currentItem.export();
const nextItem = currentItem.find(".+1");
if (nextItem) {
    await nextItem.import(currentData);
}
```

#### Comparative Operations

```javascript
// Compare current item with previous item
const currentValue = await currentItem.find("value").export();
const previousItem = currentItem.find(".-1");
if (previousItem) {
    const previousValue = await previousItem.find("value").export();
    // Perform comparison logic
}
```

#### Sequential Data Processing

```javascript
// Process items in sequence
let currentItem = list.find("0"); // Start with first item
while (currentItem) {
    await processItem(currentItem);
    currentItem = currentItem.find(".+1"); // Move to next
}
```

### Examples

#### Copy Data Between Adjacent List Items

Each list item exposes its own copy controls: one fills the current row from the
row above (`target:".-1"`), the other pushes the current row down into the next
one (`target:".+1"`).  Both are resolved against the item the trigger belongs
to, so the button always acts on its immediate neighbours.

{% raw %} <!-- form_trav_copy_adjacent {{{ --> {% endraw %}
{% capture form_trav_copy_adjacent_html -%}
<div id="myForm$$">
  <ul data-smark='{"name":"plan","type":"list","of":"form","min_items":1}'>
    <li>
      <input name="day" data-smark type="text" placeholder="Day">
      <input name="main" data-smark type="text" placeholder="Main dish">
      <input name="side" data-smark type="text" placeholder="Side dish">
      <button data-smark='{"action":"import","target":".-1"}' title="Fill this row with the day above">⤒ Fill from above</button>
      <button data-smark='{"action":"export","target":".+1"}' title="Copy this row into the day below">⤓ Copy down</button>
      <button data-smark='{"action":"removeItem"}' title="Remove this day">🗑️</button>
    </li>
  </ul>
  <button data-smark='{"action":"addItem","context":"plan"}'>➕ Add day</button>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- form_trav_copy_adjacent_css {{{ --> {% endraw %}
{% capture form_trav_copy_adjacent_css -%}
{{""}}#myForm$$ ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: .4em; }
{{""}}#myForm$$ li { display: flex; gap: .4em; align-items: center; }
{{""}}#myForm$$ li input { padding: .35em .5em; border: 1px solid #ccc; border-radius: 4px; min-width: 0; }
{{""}}#myForm$$ input[name="day"] { flex: 0 0 6em; font-weight: 600; }
{{""}}#myForm$$ input[name="main"], {{""}}#myForm$$ input[name="side"] { flex: 1; }
{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="form_trav_copy_adjacent"
    htmlSource=form_trav_copy_adjacent_html
    cssSource=form_trav_copy_adjacent_css
    demoValue='{"plan":[{"day":"Monday","main":"Lasagna","side":"Garlic bread"},{"day":"Tuesday","main":"Tacos","side":"Guacamole"},{"day":"Wednesday","main":"Pizza","side":"Caesar salad"}]}'
    tests=false
%}

#### Sequential Form Validation

```javascript
// Validate all items in sequence, stopping at first error
async function validateSequentially(list) {
    let currentItem = list.find("0");
    let position = 0;
    
    while (currentItem) {
        const isValid = await validateItem(currentItem);
        if (!isValid) {
            console.log(`Validation failed at position ${position}`);
            return false;
        }
        currentItem = currentItem.find(".+1");
        position++;
    }
    return true;
}
```

#### Dynamic List Navigation UI

The same idea can be spelled out explicitly.  Setting `context:"."` on each
button makes the *current* item the base from which the sibling path is
resolved — useful once an item grows its own navigation toolbar:

{% raw %} <!-- form_trav_navigation_ui {{{ --> {% endraw %}
{% capture form_trav_navigation_ui_html -%}
<div id="myForm$$">
  <div data-smark='{"name":"itinerary","type":"list","of":"form"}'>
    <div class="stop">
      <input name="day" data-smark type="text" placeholder="Day">
      <input name="activity" data-smark type="text" placeholder="Activity">
      <div class="navigation">
        <button data-smark='{"action":"import","context":".","target":".-1"}'>⬅ Copy from previous</button>
        <button data-smark='{"action":"export","context":".","target":".+1"}'>Copy to next ➡</button>
      </div>
      <button data-smark='{"action":"removeItem"}'>🗑️ Remove</button>
    </div>
  </div>
  <button data-smark='{"action":"addItem","context":"itinerary"}'>➕ Add day</button>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- form_trav_navigation_ui_css {{{ --> {% endraw %}
{% capture form_trav_navigation_ui_css -%}
{{""}}#myForm$$ .stop { display: flex; flex-direction: column; gap: .4em; border: 1px solid #ddd; border-radius: 6px; padding: .6em; margin-bottom: .5em; }
{{""}}#myForm$$ .stop input { padding: .35em .5em; border: 1px solid #ccc; border-radius: 4px; }
{{""}}#myForm$$ .navigation { display: flex; gap: .4em; }
{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="form_trav_navigation_ui"
    htmlSource=form_trav_navigation_ui_html
    cssSource=form_trav_navigation_ui_css
    demoValue='{"itinerary":[{"day":"Friday","activity":"Arrival and hotel check-in"},{"day":"Saturday","activity":"Old town walking tour"},{"day":"Sunday","activity":"Museum day"}]}'
    tests=false
%}

Both buttons use `context:"."` — the trigger's parent resolves `"."` to the current list item.

- **⬅ Copy from previous** uses `action:"import"` with `target:".-1"`. SmarkForm exports from the target (previous item) and imports the result into the context (current item). Direction: previous → current.
- **Copy to next ➡** uses `action:"export"` with `target:".+1"`. SmarkForm exports the context (current item) and imports the result into the target (next item). Direction: current → next.

{: .hint }
> Because target paths are resolved from the **context** — not the trigger — and here the context
> is the current list item (`.`), the sibling paths `.-1` and `.+1` navigate correctly within
> the list. If you set an explicit context that is not the natural container of those siblings,
> the relative path would need to account for the change in base.

## Advanced Path Features

### Wildcard Patterns

SmarkForm supports wildcard patterns for multi-component selection:

```javascript
// Select all children matching a pattern
const allPhones = form.find("employees/*/phones");

// Single character wildcard
const specificItems = form.find("data/?/value");
```

### Wildcard `context` Multi-Dispatch

When a wildcard path (e.g. `"*"` or `"foo/*"`) is used as the `context` of a trigger button,
SmarkForm resolves it with `.find()` and dispatches the action to **every** matching component,
in sequence, each with its own resolved `target`. Components that do not implement the
requested action are skipped silently:

```html
<!-- Clears empty items from ALL lists in the form at once -->
<button data-smark='{"action":"removeItem","context":"*","target":"*","preserve_non_empty":true}'>🧹</button>
```

- `context:"*"` resolves to **every named component** in scope that implements
  `removeItem` (i.e., all list components in the form).
- `target:"*"` then resolves to all children of each matching context.
- The action fires sequentially on each matching context — skipping any that
  don't implement the action, avoiding errors on non-list components.

{: .info }
> Unlike `target:"*"` which always operates within a single context, a wildcard
> `context` enables a **single button** to affect multiple independent components
> across the form — each receiving its own action dispatch with its own resolved
> target.

The board below is three independent lists laid out as columns, sharing a single
🧹 button that clears the empty slots in **all** of them at once:

{% raw %} <!-- form_trav_kanban_html {{{ --> {% endraw %}
{% capture form_trav_kanban_html -%}
<div id="myForm$$">
  <div class="kanban">
    <div class="column">
      <div data-smark='{"type":"#kanbanCol","name":"todo"}'>
        <span data-for="colLabel">To Do</span>
      </div>
    </div>
    <div class="column">
      <div data-smark='{"type":"#kanbanCol","name":"progress"}'>
        <span data-for="colLabel">In Progress</span>
      </div>
    </div>
    <div class="column">
      <div data-smark='{"type":"#kanbanCol","name":"done"}'>
        <span data-for="colLabel">Done</span>
      </div>
    </div>
  </div>
  <p class="hint">💡 Hold <kbd>Ctrl</kbd> to discover shortcuts — drag ☰ handles to reorder or move between columns</p>
  <button
    data-smark='{"action":"removeItem","context":"*","target":"*","preserve_non_empty":true,"autoscroll":"elegant"}'
    title="Clear empty tasks from all columns"
    class="clear-empties"
  >🧹</button>
</div>

<template id="kanbanCol">
  <style>
    .kanban-mixin strong { display: block; margin-bottom: 0.4em; font-weight: 600; }
    .kanban-mixin .card { display: flex; gap: 0.3em; margin: 0.3em 0; padding: 0.4em; background: #f8f9fa; border-radius: 4px; }
    .kanban-mixin .card input { flex: 1; }
    .kanban-mixin .empty { color: #999; font-style: italic; padding: 1em; text-align: center; }
  </style>
  <div data-smark='{"type":"list","sortable":true,"min_items":0,"movingDepth":1}' class="kanban-mixin">
    <div data-smark='{"role":"header"}'>
      <strong id="colLabel">Column</strong>
      <button data-smark='{"action":"addItem","hotkey":"+"}' title="Add task">➕</button>
    </div>
    <div data-smark='{"role":"empty_list"}' class="empty">No tasks</div>
    <div class="card">
      <span data-smark='{"type":"label"}' class="handle" title="Drag to reorder">☰</span>
      <input data-smark type="text" name="title" placeholder="Task title...">
      <button data-smark='{"action":"removeItem","hotkey":"-"}' title="Remove">➖</button>
    </div>
  </div>
</template>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %} <!-- form_trav_kanban_css {{{ --> {% endraw %}
{% capture form_trav_kanban_css -%}
{{""}}#myForm$$ .kanban { display: flex; gap: 1em; align-items: stretch; }
{{""}}#myForm$$ .column { flex: 1; min-width: 200px; border: 1px solid #ddd; border-radius: 6px; padding: 0.5em; display: flex; flex-direction: column; }
{{""}}#myForm$$ .column > [data-smark] { flex: 1; min-height: 0; }
{{""}}#myForm$$ .hint { font-size: 0.82em; color: #888; margin-top: 1em; }
{{""}}#myForm$$ .hint kbd { background: rgba(0,0,0,.06); border: 1px solid #ccc; border-radius: 3px; padding: 1px 4px; }
{{""}}#myForm$$ .clear-empties { display: block; margin: 0.5em auto 0; }
button[data-hotkey]::after { content: "Ctrl+" attr(data-hotkey); position: absolute; top: -1.4em; left: 0; font-size: 0.65em; background: #333; color: #fff; padding: 1px 4px; border-radius: 3px; white-space: nowrap; }
button { position: relative; }
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %} <!-- form_trav_kanban_js {{{ --> {% endraw %}
{% capture form_trav_kanban_js -%}
myForm.on("BeforeAction_removeItem", async (ev) => {
  // Never confirm for bulk operations (target:*) or preserve_non_empty
  if (
    ev.target instanceof Array
    || ev.preserve_non_empty
  ) return;
  if (await ev.target?.isEmpty()) return;
  if (!window.confirm("Remove this task?")) ev.preventDefault();
});
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% capture form_trav_kanban_demoValue -%}
{
  "todo": [
    {"title": "Write documentation"},
    {"title": "Review PR"}
  ],
  "progress": [
    {"title": "Fix layout bug"}
  ],
  "done": [
    {"title": "Setup CI"}
  ]
}
{%- endcapture %}

{% capture form_trav_kanban_notes -%}
👉 **One button, every column.** The 🧹 button uses `context:"*"`, so a single
click dispatches `removeItem` to *all* three lists at once — `preserve_non_empty`
leaves the filled tasks untouched.  **Try it!** Add a couple of cards, then clear
the empty slots in one go.

👉 **Drag between columns.** All three lists have `sortable:true` — drag any task
card to another column to move it.

👉 **Hotkeys.** Hold <code>Ctrl</code> to discover <code>+</code> (add task) and
<code>-</code> (remove task) on each column.  The same hotkeys adapt to the column
you are working in (context sensitivity).

> See <a href="{{ "/working_with_forms/hotkeys" | relative_url }}">Hotkeys</a>
> for the full keyboard-shortcut reference.
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="form_trav_kanban"
    htmlSource=form_trav_kanban_html
    cssSource=form_trav_kanban_css
    jsSource=form_trav_kanban_js
    notes=form_trav_kanban_notes
    demoValue=form_trav_kanban_demoValue
    selected="preview"
    showEditor=true
    tests=false
%}

### Multi-Match Results

When using wildcards, `.find()` returns an array of matching components:

```javascript
// Returns array of all employee components
const employees = form.find("employees/*");

// Process each match
employees.forEach(async (employee) => {
    const data = await employee.export();
    console.log(data);
});
```

## Practical Examples

### Data Copying Between List Items

This example demonstrates a practical implementation of sibling navigation for data copying in a contact list:

{% raw %} <!-- form_trav_practical_copy {{{ --> {% endraw %}
{% capture form_trav_practical_copy_html -%}
<div id="myForm$$">
  <div data-smark='{"name": "contacts", "type": "list", "of": "form", "min_items": 1}'>
    <fieldset>
      <legend>Contact Information</legend>
      <p>
        <label data-smark>Name:</label>
        <input name="name" data-smark type="text">
      </p>
      <p>
        <label data-smark>Email:</label>
        <input name="email" data-smark type="email">
      </p>
      <p>
        <label data-smark>Phone:</label>
        <input name="phone" data-smark type="tel">
      </p>
      <div class="actions">
        <button data-smark='{"action":"export","target":".+1"}'>📋 Copy to Next</button>
        <button data-smark='{"action":"import","target":".-1"}'>📥 Copy from Previous</button>
        <button data-smark='{"action":"removeItem"}'>🗑️ Remove</button>
        </div>
    </fieldset>
  </div>
  <button data-smark='{"action":"addItem","context":"contacts"}'>➕ Add Contact</button>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="form_trav_practical_copy"
    htmlSource=form_trav_practical_copy_html
    demoValue='{"contacts":[{"name":"Alice","email":"alice@example.com","phone":"555-1234"},{"name":"Bob","email":"bob@example.com","phone":"555-5678"}]}'
    tests=false
%}

### Complex Form Navigation

Navigate through nested form structures using combined path expressions:

```javascript
// Access nested data in complex forms
const form = new SmarkForm(document.getElementById("complexForm"));

// Navigate to specific nested fields
const streetAddress = form.find("/customer/addresses/0/street");
const billingEmail = form.find("/customer/billing/email");

// Use relative navigation from current context
const currentAddress = form.find("/customer/addresses/0");
const nextAddress = currentAddress.find(".+1");
const cityField = currentAddress.find("city");
```

### Dynamic Context Resolution

Implement dynamic behavior based on component relationships:

```javascript
// Smart data synchronization
class FormSynchronizer {
    constructor(form) {
        this.form = form;
        this.setupSynchronization();
    }
    
    async setupSynchronization() {
        // Listen for changes in any employee record
        this.form.on("AfterAction_import", async (event) => {
            const {context} = event;
            
            // If it's an employee item, sync with siblings
            if (context.parent?.name === "employees") {
                await this.syncWithSiblings(context);
            }
        });
    }
    
    async syncWithSiblings(employeeItem) {
        const employeeData = await employeeItem.export();
        
        // Sync common data with next item if exists
        const nextEmployee = employeeItem.find(".+1");
        if (nextEmployee) {
            const nextData = await nextEmployee.export();
            nextData.department = employeeData.department; // Sync department
            await nextEmployee.import(nextData);
        }
    }
}
```

## Best Practices

### Path Construction

1. **Use absolute paths for global references**: When accessing components that should be reachable from anywhere in the form, use absolute paths starting with `/`.

2. **Prefer relative paths for local navigation**: When working within a specific section or component, use relative paths to maintain flexibility.

3. **Leverage natural context resolution**: Allow SmarkForm's natural context resolution to determine appropriate contexts automatically when possible.

4. **Use meaningful component names**: Ensure your component names clearly indicate their purpose to make paths self-documenting.

### Sibling Navigation Guidelines

1. **Check existence before use**: Always verify that sibling components exist before attempting to interact with them:
   ```javascript
   const nextItem = currentItem.find(".+1");
   if (nextItem) {
       // Safe to interact with nextItem
   }
   ```

2. **Handle boundary conditions**: Consider what happens at list boundaries (first/last items) and implement appropriate fallback behavior.

3. **Use descriptive variable names**: When storing references to sibling components, use names that clearly indicate the relationship:
   ```javascript
   const previousContact = currentContact.find(".-1");
   const nextContact = currentContact.find(".+1");
   ```

### Performance Considerations

1. **Cache frequently accessed components**: Store references to commonly accessed components rather than repeatedly calling `.find()`.

2. **Use specific paths**: More specific paths are generally more efficient than broad wildcard searches.

3. **Minimize deep traversal**: When possible, use shorter paths by starting from a more appropriate base component.

## Common Patterns and Idioms

### Sequential Processing Pattern

```javascript
// Process all list items in order
function processListSequentially(list) {
    let currentItem = list.find("0");
    const results = [];
    
    while (currentItem) {
        results.push(processItem(currentItem));
        currentItem = currentItem.find(".+1");
    }
    
    return results;
}
```

### Bidirectional Data Sync Pattern

```javascript
// Synchronize data between adjacent items
async function syncBidirectional(item, field) {
    const value = await item.find(field).export();
    
    // Sync with previous item
    const prevItem = item.find(".-1");
    if (prevItem) {
        await prevItem.find(field).import(value);
    }
    
    // Sync with next item
    const nextItem = item.find(".+1");
    if (nextItem) {
        await nextItem.find(field).import(value);
    }
}
```

### Conditional Navigation Pattern

```javascript
// Navigate based on conditions
function findNextValidItem(currentItem) {
    let candidate = currentItem.find(".+1");
    
    while (candidate) {
        if (await candidate.isValid()) {
            return candidate;
        }
        candidate = candidate.find(".+1");
    }
    
    return null; // No valid item found
}
```

### Form Section Coordination Pattern

```javascript
// Coordinate between different form sections
class FormCoordinator {
    constructor(form) {
        this.form = form;
    }
    
    async copyPersonalToBusiness() {
        const personalData = this.form.find("/personalData");
        const businessData = this.form.find("/businessData");
        
        const personal = await personalData.export();
        
        // Map personal data to business fields
        await businessData.import({
            data: {
                companyName: personal.name,
                contactEmail: personal.email,
                // ... other mappings
            }
        });
    }
}
```

The combination of these patterns with SmarkForm's traversing capabilities enables the creation of sophisticated, interactive forms with minimal boilerplate code. The path-based navigation system, enhanced with sibling navigation, provides a powerful foundation for building complex form interactions while maintaining code clarity and maintainability.
