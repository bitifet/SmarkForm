---
title: Importing and Exporting Data
layout: chapter
permalink: /advanced_concepts/api_import_and_export
nav_order: 4

---

{% include links.md %}
{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Overview](#overview)
* [The `export` Action](#the-export-action)
    * [Return value structure](#return-value-structure)
    * [The `exportEmpties` option](#the-exportempties-option)
* [The `import` Action](#the-import-action)
    * [Accepted data formats](#accepted-data-formats)
    * [The `setDefault` option](#the-setdefault-option)
    * [The `focus` option](#the-focus-option)
* [Default Values, `clear`, and `reset`](#default-values-clear-and-reset)
    * [Setting defaults via `value`](#setting-defaults-via-value)
    * [How `import` updates the default](#how-import-updates-the-default)
    * [Comparing `clear` and `reset`](#comparing-clear-and-reset)
* [Piping Data Between Components](#piping-data-between-components)
    * [Using `target` with `export`](#using-target-with-export)
    * [Using `target` with `import`](#using-target-with-import)
    * [Chaining export and import](#chaining-export-and-import)
* [Programmatic API](#programmatic-api)
    * [Using `component.actions.export()` and `component.actions.import()`](#using-componentactionsexport-and-componentactionsimport)
    * [Calling prototype methods directly](#calling-prototype-methods-directly)
* [Common Patterns](#common-patterns)
    * [Loading initial data from a server](#loading-initial-data-from-a-server)
    * [Submitting form data to a backend](#submitting-form-data-to-a-backend)
    * [Save and restore draft data](#save-and-restore-draft-data)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


## Overview

SmarkForm manages all form data through two complementary actions: **`export`**
and **`import`**.

- **`export`** reads the current state of a form (or any component inside it)
  and returns a plain JavaScript value — an object for forms, an array for
  lists, and a scalar for individual fields.
- **`import`** takes a plain JavaScript value (or a JSON string) and writes it
  into the form, updating every field it can match by name.

Both actions work **recursively**: exporting or importing a form exports or
imports all its child components in one call, no matter how deeply they are
nested. This means you rarely need to address individual fields from JavaScript
— you simply read and write the whole form at once.

Two related actions — **`reset`** and **`clear`** — build on top of `import`
and are covered in the [Default Values, `clear`, and `reset`](#default-values-clear-and-reset) section.

{: .info }
> All four actions (`export`, `import`, `reset`, `clear`) are available as HTML
> trigger buttons via the `data-smark` attribute as well as via the JavaScript
> API.


## The `export` Action

When you call `export` on a component, SmarkForm collects all the current
values in that component's subtree and returns them as a plain, JSON-serialisable
value:

| Component type | Exported value |
|---|---|
| `form` / root | `{ fieldName: value, … }` plain object |
| `list` | `[ item, … ]` array |
| `input` / scalar fields | The raw field value (string, number, boolean, …) |

### Return value structure

The structure of the exported value mirrors the nesting of the form:

{% raw %} <!-- capture export_structure_html {{{ --> {% endraw %}
{% capture export_structure_html
%}<fieldset data-smark='{"type":"form","name":"order"}'>
    <legend>Order</legend>
    <p>
        <label data-smark>Customer:</label>
        <input data-smark type="text" name="customer">
    </p>
    <p>
        <label data-smark>Notes:</label>
        <textarea data-smark name="notes"></textarea>
    </p>
    <ul data-smark='{"type":"list","name":"items","min_items":0}'>
        <li>
            <input data-smark type="text" name="product" placeholder="Product">
            <input data-smark type="number" name="qty" placeholder="Qty">
            <button data-smark='{"action":"removeItem"}'>➖</button>
        </li>
    </ul>
    <button data-smark='{"action":"addItem","context":"items"}'>➕ Add item</button>
</fieldset>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue %}{"order":{"customer":"Jane Smith","notes":"Please wrap as a gift","items":[{"product":"Widget A","qty":"3"},{"product":"Widget B","qty":"1"}]}}{% endcapture %}

{% include components/sampletabs_tpl.md
    formId="export_structure"
    htmlSource=export_structure_html
    showEditor=true
    demoValue=demoValue
    tests=false
%}

Click **⬇️ Export** to see the exported JSON. The structure of the exported
object matches the form structure exactly:

```json
{
  "order": {
    "customer": "Jane Smith",
    "notes": "Please wrap as a gift",
    "items": [
      { "product": "Widget A", "qty": "3" },
      { "product": "Widget B", "qty": "1" }
    ]
  }
}
```

### The `exportEmpties` option

By default, SmarkForm **strips empty items** from list exports. A list item is
considered empty when all its fields are empty (null, undefined, or
empty string).

This behaviour is controlled by the `exportEmpties` option on the list
component:

| `exportEmpties` value | Behaviour |
|---|---|
| `false` (default) | Empty list items are omitted from the exported array |
| `true` | All items, including empty ones, are included in the export |

```html
<!-- Empty items will be included in the export -->
<ul data-smark='{"type":"list","name":"slots","exportEmpties":true}'>
  <li>
    <input data-smark type="text" name="value">
  </li>
</ul>
```

{: .hint }
> `exportEmpties` is **inherited** — a child component inherits the value from
> its nearest ancestor that sets it explicitly. This means you may need to
> explicitly set `exportEmpties:false` on a nested list to override an
> ancestor's `exportEmpties:true`. For example:
> ```html
> <!-- Outer list: export all items, including empty ones -->
> <ul data-smark='{"type":"list","name":"sessions","exportEmpties":true}'>
>   <li>
>     <!-- Inner list: strip empties regardless of the outer setting -->
>     <ul data-smark='{"type":"list","name":"tags","exportEmpties":false}'>
>       <li><input data-smark type="text" name="tag"></li>
>     </ul>
>   </li>
> </ul>
> ```

The `exportEmpties` option is particularly useful in "save progress" scenarios
where you want to preserve the user's position in a list even if they haven't
filled in all the items yet.


## The `import` Action

`import` takes a value and writes it into the component. For a `form` component
it distributes each key of the object to the matching child field; for a `list`
it adds or removes items to match the length of the incoming array, then fills
each item.

### Accepted data formats

The `import` action accepts:

- A **plain JavaScript object** for `form` components
- A **JSON string** that parses to a plain object — SmarkForm parses it
  automatically
- An **array** for `list` components
- A **scalar value** (string, number, boolean) for input fields

{: .info }
> Fields that are present in the form but absent from the imported data object
> receive `undefined`, which triggers their own reset to default. Fields present
> in the data object but absent from the form are silently ignored.

{% raw %} <!-- capture import_example_html {{{ --> {% endraw %}
{% capture import_example_html
%}<p>
    <label data-smark>Name:</label>
    <input data-smark type="text" name="name">
</p>
<p>
    <label data-smark>Email:</label>
    <input data-smark type="email" name="email">
</p>
<p>
    <label data-smark>Role:</label>
    <input data-smark type="text" name="role">
</p>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue %}{"name":"Alice Johnson","email":"alice@example.com","role":"Developer"}{% endcapture %}

{% include components/sampletabs_tpl.md
    formId="import_example"
    htmlSource=import_example_html
    showEditor=true
    demoValue=demoValue
    tests=false
%}

Paste the following JSON into the editor and click **⬆️ Import** to see it
load into the form:

```json
{"name":"Bob Smith","email":"bob@example.com","role":"Designer"}
```

### The `setDefault` option

By default, every successful `import` call **updates the component's `defaultValue`**.
This means that after an import, clicking **♻️ Reset** restores the imported
data rather than the original HTML-defined defaults.

You can opt out of this behaviour by passing `setDefault: false`:

```html
<!-- Import without updating the reset target (preview mode) -->
<button data-smark='{"action":"import","setDefault":false}'>Preview</button>

<!-- Import and make this the new reset target (load mode) -->
<button data-smark='{"action":"import"}'>Load Data</button>
```

Summary of `setDefault` behaviour:

| Call | Updates default? | What `reset()` restores |
|---|---|---|
| `import(data)` | Yes | The newly imported data |
| `import(data, {setDefault:false})` | No | The previous default |
| `import(undefined)` | No | The current default (unchanged) |
| `clear()` | No | The current default (unchanged) |
| `reset()` | No | The current default |

{: .hint }
> `setDefault` propagates to all nested components: when a form imports data
> with `setDefault: true`, every child (including nested forms and lists) also
> updates its own default.

### The `focus` option

When `import` is invoked through a trigger button, SmarkForm automatically
focuses the form after import. When called programmatically, focus is off by
default. Pass `focus: true` to move keyboard focus after a programmatic import:

```javascript
await myForm.actions.import(data, { focus: true });
```


## Default Values, `clear`, and `reset`

### Setting defaults via `value`

You can pre-populate a form's default values in HTML using the `value` property
inside `data-smark`:

```html
<div data-smark='{"name":"profile","value":{"name":"Anonymous","role":"guest"}}'>
  <input data-smark type="text" name="name">
  <input data-smark type="text" name="role">
</div>
```

This sets `defaultValue` for the `profile` form. Calling `reset()` on it
always restores `{"name":"Anonymous","role":"guest"}`.

Individual input fields can also have a default via the HTML `value` attribute:

```html
<input data-smark type="text" name="country" value="US">
```

{: .warning }
> Do not set both the HTML `value` attribute and the `data-smark` `value`
> option on the same element at the same time — SmarkForm will throw a
> `VALUE_CONFLICT` error during render.

### How `import` updates the default

After a successful `import(data)` call (with `setDefault: true`, the default),
SmarkForm re-exports the component with `exportEmpties: true` and stores the
result as the new `defaultValue`:

```javascript
// After this call, reset() will restore {name:"Alice",role:"admin"}
await myForm.actions.import({ name: "Alice", role: "admin" });
```

Using `exportEmpties: true` when capturing the new default ensures that
`reset()` restores the exact same list structure — including empty slots — that
was in place right after the import.

### Comparing `clear` and `reset`

Both `clear` and `reset` are built on top of `import` but behave differently:

| Action | What it does | Updates default? |
|---|---|---|
| `reset` | Imports the current `defaultValue` | No |
| `clear` | Imports the type-level empty value (`{}` for forms, `[]` for lists, `""` for inputs) | No |

Use **`reset`** to undo user changes and return to the last loaded state.  
Use **`clear`** to blank every field without regard to defaults — for example,
a "New record" button.

{% raw %} <!-- capture clear_vs_reset_html {{{ --> {% endraw %}
{% capture clear_vs_reset_html
%}<div data-smark='{"type":"form","name":"task","value":{"title":"Buy groceries","priority":"medium"}}'>
    <p>
        <label data-smark>Title:</label>
        <input data-smark type="text" name="title">
    </p>
    <p>
        <label data-smark>Priority:</label>
        <input data-smark type="text" name="priority">
    </p>
    <p>
        <button data-smark='{"action":"clear","context":"task"}'>❌ Clear</button>
        <button data-smark='{"action":"reset","context":"task"}'>♻️ Reset</button>
    </p>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture clearResetNotes %}
The `task` form is initialized with `value` defaults.

1. Modify the fields.
2. Click **❌ Clear** — all fields become empty.
3. Click **♻️ Reset** — the original defaults are restored.
{% endcapture %}

{% include components/sampletabs_tpl.md
    formId="clear_vs_reset"
    htmlSource=clear_vs_reset_html
    notes=clearResetNotes
    showEditor=true
    tests=false
%}


## Piping Data Between Components

SmarkForm makes it easy to copy data from one component to another using the
**`target`** option on `export` and `import` triggers. This avoids writing
any JavaScript for common copy-data workflows.

### Using `target` with `export`

When an `export` trigger has a `target` property, SmarkForm automatically
imports the exported value into the target component after the export completes:

```html
<!-- Export "source" and automatically import the result into "destination" -->
<button data-smark='{
    "action": "export",
    "context": "source",
    "target": "/destination"
}'>📋 Copy</button>
```

This is equivalent to writing the following JavaScript:

```javascript
const value = await source.export();
await destination.import(value);
```

### Using `target` with `import`

Conversely, when an `import` trigger has a `target` property, SmarkForm
**exports from the target first** and uses that value as the data to import:

```html
<!-- Export "source", then import the result here -->
<button data-smark='{
    "action": "import",
    "target": "/source"
}'>📥 Load from source</button>
```

This is useful inside list items for the "duplicate" pattern — export the
previous sibling and import it into the current item.

### Chaining export and import

The following example shows a practical copy-between-sections workflow. The
"Copy to shipping" button exports the billing address and writes it directly
into the shipping address section:

{% raw %} <!-- capture pipe_example_html {{{ --> {% endraw %}
{% capture pipe_example_html
%}<fieldset data-smark='{"type":"form","name":"billing"}'>
    <legend>Billing address</legend>
    <p>
        <label data-smark>Street:</label>
        <input data-smark type="text" name="street">
    </p>
    <p>
        <label data-smark>City:</label>
        <input data-smark type="text" name="city">
    </p>
    <p>
        <label data-smark>Postcode:</label>
        <input data-smark type="text" name="postcode">
    </p>
</fieldset>
<p>
    <button data-smark='{
        "action":"export",
        "context":"billing",
        "target":"../shipping"
    }'>📋 Copy to shipping</button>
</p>
<fieldset data-smark='{"type":"form","name":"shipping"}'>
    <legend>Shipping address</legend>
    <p>
        <label data-smark>Street:</label>
        <input data-smark type="text" name="street">
    </p>
    <p>
        <label data-smark>City:</label>
        <input data-smark type="text" name="city">
    </p>
    <p>
        <label data-smark>Postcode:</label>
        <input data-smark type="text" name="postcode">
    </p>
</fieldset>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture pipe_example_notes %}
Fill in the billing address, then click **📋 Copy to shipping** to copy the
data to the shipping address with no JavaScript required.
{% endcapture %}

{% capture demoValue %}{"billing":{"street":"10 Downing Street","city":"London","postcode":"SW1A 2AA"},"shipping":{"street":"","city":"","postcode":""}}{% endcapture %}

{% include components/sampletabs_tpl.md
    formId="pipe_example"
    htmlSource=pipe_example_html
    notes=pipe_example_notes
    showEditor=true
    demoValue=demoValue
    tests=false
%}

{: .hint }
> Target paths are resolved relative to the **context component** itself — SmarkForm calls
> `context.find(targetPath)` internally. So `../shipping` from a `billing` context navigates
> up to `billing`'s parent, then finds the `shipping` sibling. Use an absolute path (starting
> with `/`) to reach a component from the form root regardless of where the trigger is.

{: .hint }
> The same copy can be expressed as an `import` action by swapping context and target:
> ```html
> <button data-smark='{
>     "action":"import",
>     "context":"shipping",
>     "target":"../billing"
> }'>📋 Copy to shipping</button>
> ```
> This imports *into* `shipping` the data *from* `billing` — identical result,
> opposite direction of data flow. Pick whichever makes the intent clearer.
> You could also add a reverse "Copy to billing" button by keeping the same
> `action:"export"` / `context` / `target` but swapping `billing` and `shipping`.


## Programmatic API

### Using `component.actions.export()` and `component.actions.import()`

To export or import data from JavaScript you call the action through the
component's `.actions` map. This goes through the full `@action` wrapper, which
fires `BeforeAction_*` and `AfterAction_*` events and applies all the standard
focus/silent/data flow logic:

```javascript
// Wait for the form to finish rendering before using it
await myForm.rendered;

// Export the whole form
const data = await myForm.actions.export();
console.log(data); // { name: "Alice", … }

// Import data into the form
await myForm.actions.import({ name: "Bob", email: "bob@example.com" });

// Import without updating the default (preview mode)
await myForm.actions.import(data, { setDefault: false });

// Import a specific sub-form
const addressForm = myForm.find("/address");
await addressForm.actions.import({ street: "123 Main St", city: "Springfield" });
```

{: .warning }
> Always `await myForm.rendered` before calling `find()` or accessing
> components programmatically. SmarkForm builds its internal component map
> asynchronously — calls made before rendering is complete will return `null`.

### Calling prototype methods directly

For internal use — such as inside event handlers or other action
implementations — you can call the prototype method directly, bypassing the
`@action` wrapper:

```javascript
// Bypasses events, focus defaults, and BeforeAction cancellation:
const data = await myForm.export();
await myForm.import({ name: "Alice" }, { silent: true });
```

Direct prototype calls are lower overhead and are the right choice when
you are already inside an action handler and do not want to re-fire lifecycle
events. However, you must then manage `options.silent` and `options.focus`
explicitly.

See the [Event Handling]({{ "/advanced_concepts/events" | relative_url }}) chapter
for a deeper explanation of the `@action` wrapper and event lifecycle.


## Common Patterns

### Loading initial data from a server

The typical pattern for pre-populating a form from the server is to wait for
the form to finish rendering and then call `import`:

```javascript
const myForm = new SmarkForm(document.getElementById("myForm"));

myForm.on("AfterAction_import", (ev) => {
    console.log("Form loaded with:", ev.data);
});

await myForm.rendered;

const response = await fetch("/api/record/42");
const data = await response.json();
await myForm.actions.import(data); // data becomes the new default
```

Because `import` defaults to `setDefault: true`, the user can later click
**♻️ Reset** to restore the loaded record without re-fetching.

### Submitting form data to a backend

The recommended pattern is to place an `export` trigger on the page and listen
for `AfterAction_export`:

```html
<button data-smark='{"action":"export"}'>💾 Save</button>
```

```javascript
const myForm = new SmarkForm(document.getElementById("myForm"), {
    async onAfterAction_export(ev) {
        const payload = ev.data; // Plain JSON-serialisable object
        const res = await fetch("/api/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
    },
});
```

{: .hint }
> To run validation before allowing the export, use `onBeforeAction_export` and
> call `ev.preventDefault()` to cancel the action. See the
> [Event Handling]({{ "/advanced_concepts/events" | relative_url }}) chapter for
> more details.

### Save and restore draft data

You can persist draft data across page reloads using `localStorage`. The
pattern hooks into `AfterAction_export` to save whenever the user exports,
and restores the draft automatically the next time the page loads:

{% raw %} <!-- capture draft_example_html {{{ --> {% endraw %}
{% capture draft_example_html
%}<p>
    <label data-smark>Name:</label>
    <input data-smark type="text" name="name">
</p>
<p>
    <label data-smark>Email:</label>
    <input data-smark type="email" name="email">
</p>
<p>
    <label data-smark>Notes:</label>
    <textarea data-smark name="notes" rows="3"></textarea>
</p>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture draft_jsHead %}const myForm = new SmarkForm(document.getElementById("myForm$$"));
(async () => {
    await myForm.rendered;
    // ⚠️ Playground adapter — not needed in a real app:
    // The docs playground wraps each example inside a "demo" subform.
    // Real-app code: use `myForm` directly (no find() needed).
    const demo = myForm.find("/demo") || myForm;
    // Auto-restore draft on page load
    const saved = localStorage.getItem("sf_draft$$");
    if (saved) await demo.actions.import(JSON.parse(saved), { setDefault: false });
    // Auto-save on every export
    demo.on("AfterAction_export", ev => {
        localStorage.setItem("sf_draft$$", JSON.stringify(ev.data));
    });
})();{% endcapture %}

{% capture draft_example_notes %}
Fill in some data and click **⬇️ Export** — the form state is saved to
`localStorage`. Click **❌ Clear** to blank the fields, then reload the page
to see the draft restored automatically.

Click **♻️ Reset** at any time to go back to the default empty state (the
draft in `localStorage` is unaffected until the next Export).
{% endcapture %}

{% include components/sampletabs_tpl.md
    formId="draft_example"
    htmlSource=draft_example_html
    jsHead=draft_jsHead
    notes=draft_example_notes
    showEditor=true
    tests=false
%}

{: .info }
> Using `setDefault: false` when restoring a draft ensures that **♻️ Reset**
> still returns to the form's HTML-defined defaults, not the draft. This lets
> the user discard a draft by pressing Reset.


