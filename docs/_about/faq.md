---
title: FAQ
layout: chapter
nav_order: 6
permalink: /about/faq

---

{% include links.md %}

# SmarkForm {{ page.title }}


Below are answers to common questions about SmarkForm's behaviour, especially
around edge cases or features that might catch you off guard at first.

<div class="chaptertoc toplevel">

  {{ "
<!-- NOTE: Use `:let g:vmt_max_level = 3` with vim's markdown-toc for this file -->
<!-- vim-markdown-toc GitLab -->

* [SmarkForm Essentials](#smarkform-essentials)
    * [What is SmarkForm?](#what-is-smarkform)
    * [Do I need a `<form>` tag?](#do-i-need-a-form-tag)
    * [How do I get and include SmarkForm?](#how-do-i-get-and-include-smarkform)
    * [What is the `data-smark` attribute?](#what-is-the-data-smark-attribute)
    * [What are the different SmarkForm component types?](#what-are-the-different-smarkform-component-types)
    * [What are triggers and actions?](#what-are-triggers-and-actions)
    * [What is «context» in SmarkForm?](#what-is-context-in-smarkform)
    * [What is the Singleton Pattern?](#what-is-the-singleton-pattern)
    * [How do I add a 'clear' button to a `color` or `number` field?](#how-do-i-add-a-clear-button-to-a-color-or-number-field)
* [Lists](#lists)
    * [Why can't I remove items from my list sometimes?](#why-cant-i-remove-items-from-my-list-sometimes)
    * [Why does my «add» button stop working?](#why-does-my-add-button-stop-working)
    * [My list won't let me add items until I fill the current ones—is that intended?](#my-list-wont-let-me-add-items-until-i-fill-the-current-onesis-that-intended)
    * [How do I add animations to list items?](#how-do-i-add-animations-to-list-items)
* [Data: Import, Export & Reset](#data-import-export-reset)
    * [My exported JSON is missing some fields—what's up?](#my-exported-json-is-missing-some-fieldswhats-up)
    * [Why are my nested form fields named weirdly in the JSON?](#why-are-my-nested-form-fields-named-weirdly-in-the-json)
    * [Why does my form export null values? How do I map them to HTML fields?](#why-does-my-form-export-null-values-how-do-i-map-them-to-html-fields)
    * [Is there a `notNull` attribute (or `required` option)?](#is-there-a-notnull-attribute-or-required-option)
    * [How do I submit form data to a backend?](#how-do-i-submit-form-data-to-a-backend)
    * [Can I use a classic HTML form submission instead of JSON export?](#can-i-use-a-classic-html-form-submission-instead-of-json-export)
    * [How do default values and reset work?](#how-do-default-values-and-reset-work)
* [Events & Actions](#events-actions)
    * [I added an event listener, but it's not firing—why?](#i-added-an-event-listener-but-its-not-firingwhy)
    * [How do I add custom actions?](#how-do-i-add-custom-actions)
    * [How do I add keyboard shortcuts (hotkeys)?](#how-do-i-add-keyboard-shortcuts-hotkeys)
    * [What if I want to reach an outer action with the same hotkey?](#what-if-i-want-to-reach-an-outer-action-with-the-same-hotkey)
* [Behaviour & Troubleshooting](#behaviour-troubleshooting)
    * [Where's the error message when something goes wrong?](#wheres-the-error-message-when-something-goes-wrong)
    * [`myForm.find('/foo/bar')` returns `null` but the field exists](#myformfindfoobar-returns-null-but-the-field-exists)
    * [What does `await myForm.rendered` do?](#what-does-await-myformrendered-do)
* [API & JavaScript](#api-javascript)
    * [Can I have multiple independent SmarkForm forms on a page?](#can-i-have-multiple-independent-smarkform-forms-on-a-page)
    * [What's this «API interface» I keep hearing about?](#whats-this-api-interface-i-keep-hearing-about)
* [Integration & Deployment](#integration-deployment)
    * [Which browsers does SmarkForm support?](#which-browsers-does-smarkform-support)
    * [Can I use SmarkForm in React (or Vue, Angular, etc.) projects?](#can-i-use-smarkform-in-react-or-vue-angular-etc-projects)
    * [Where does SmarkForm really shine?](#where-does-smarkform-really-shine)
* [Have a question not covered here?](#have-a-question-not-covered-here)

<!-- vim-markdown-toc -->
       " | markdownify }}

</div>


## SmarkForm Essentials

### What is SmarkForm?

SmarkForm is a lightweight, markup-driven form controller for the web. You
annotate your HTML with `data-smark` attributes and call
`new SmarkForm(element)` — SmarkForm then enhances the subtree to support:

- **Nested subforms** that export plain JSON objects.
- **Variable-length lists** that export JSON arrays and can grow/shrink at
  runtime.
- **Smart import/export** of any JSON structure, no matter how deeply nested.
- **Context-driven hotkeys** for keyboard-driven interaction.
- **Actions & events** for custom behaviour without writing DOM manipulation
  code.

It has no runtime dependencies and ships as a single
{{ site.data.computed.bundleSizeKB | xml_escape | textilize }}KB bundle (ESM or
UMD). It is **not** a React/Vue/Angular component library — it is a DOM-first
library that works best with server-rendered or static HTML.

See the [Introduction]({{ "/about/introduction" | relative_url }}) and
[Showcase]({{ "/about/showcase" | relative_url }}) for a fuller picture.


### Do I need a `<form>` tag?

**No.** SmarkForm works with any block-level element — `<div>`, `<section>`,
`<fieldset>`, a plain `<form>`, etc. The root element is just the DOM node you
pass to `new SmarkForm(element)`.

```html
<!-- All of these are valid SmarkForm roots -->
<div id="myForm">…</div>
<section id="myForm">…</section>
<form id="myForm">…</form>
```

If you do use a `<form>` tag, SmarkForm does **not** intercept the browser's
native submit event — use an `export` trigger and `AfterAction_export` instead.

See [How do I submit form data to a backend?](#how-do-i-submit-form-data-to-a-backend).


### How do I get and include SmarkForm?

The quickest way is a CDN import — no build step needed:

```html
<!-- UMD: adds SmarkForm as a global variable -->
<script src="https://cdn.jsdelivr.net/npm/smarkform/dist/SmarkForm.umd.js"></script>

<!-- or as an ES module -->
<script type="module">
  import SmarkForm from "https://cdn.jsdelivr.net/npm/smarkform/dist/SmarkForm.esm.js";
</script>
```

{: .warning :}
> For production, pin to a specific version (e.g.
> `.../smarkform@0.5.0/dist/SmarkForm.esm.js`) so your app isn't affected by
> future changes.

You can also **install from npm** and use with any bundler:

```sh
npm install smarkform
```

```javascript
import SmarkForm from "smarkform";
```

See [Getting SmarkForm]({{ "/getting_started/getting_smarkform" | relative_url }})
for all distribution formats (ESM, UMD, CDN, npm, GitHub clone) and more details.


### What is the `data-smark` attribute?

`data-smark` is how you tell SmarkForm which HTML elements to manage. Any
element **inside your root node** without this attribute is simply ignored by
SmarkForm.

The value can be **empty** (SmarkForm infers everything from context) or a
**JSON object** with configuration options:

```html
<!-- Empty: type inferred from the <input> tag -->
<input type="text" name="city" data-smark>

<!-- JSON options: explicit type, name, and a default value -->
<div data-smark='{"type":"form","name":"address","value":{"city":"Barcelona"}}'>
  …
</div>

<!-- Trigger: the "action" key marks this as a trigger button -->
<button data-smark='{"action":"export"}'>Save</button>
```

See [Core Concepts — The `data-smark` attribute](
{{ "/getting_started/core_concepts" | relative_url }}#the-data-smark-attribute)
for the full syntax reference.


### What are the different SmarkForm component types?

Every element with a `data-smark` attribute becomes a **component** of a
specific type. The main types are:

**Structural types** (hold collections of fields):

| Type | Role | Exports |
|------|------|---------|
| `form` | Groups fields into a named subform | JSON object |
| `list` | Variable-length list of repeated items | JSON array |

**Scalar field types** (hold a single value):

| Type | Role | Exports |
|------|------|---------|
| `input` | Default for any `<input>`, `<textarea>`, or `<select>` not otherwise matched | String |
| `number` | Numeric field — imports/exports a JavaScript number, not a string | Number or null |
| `color` | Color picker — allows `null` (unlike native `<input type="color">` which always has a value) | `#rrggbb` string or null |
| `radio` | Group of radio buttons sharing the same `name` treated as one field; nullable | String or null |
| `date` | Date field with input sanitisation and standardised output format | ISO date string or null |
| `time` | Time field with input sanitisation and standardised output format | ISO time string or null |
| `datetime-local` | Date-and-time field with the same sanitisation/format guarantees | ISO datetime string or null |

**Non-field component types**:

| Type | Role |
|------|------|
| `trigger` | Button that invokes an action (no field value) |
| `label` | Smart label that auto-connects to its sibling field |

SmarkForm infers the type from context in most cases:

- `<input>`, `<textarea>`, `<select>` → `input` (unless a more specific type is
  inferred from the element's `type` attribute, e.g. `type="color"` → `color`)
- `<label>` → `label`
- A `data-smark` with an `"action"` key → `trigger`
- Explicit `"type":"form"` or `"type":"list"` for container elements

See [Core Component Types]({{ "/getting_started/core_component_types" | relative_url }})
for the full reference.


### What are triggers and actions?

A **trigger** is a button (or any focusable element) with an `"action"` key in
its `data-smark` options. When clicked (or its hotkey is pressed), it invokes
the named **action** on the appropriate component.

```html
<button data-smark='{"action":"export"}'>Save</button>
<button data-smark='{"action":"clear"}'>Clear</button>
<button data-smark='{"action":"reset"}'>Reset</button>
<!-- List-only actions: -->
<button data-smark='{"action":"addItem"}'>Add row</button>
<button data-smark='{"action":"removeItem"}'>Remove row</button>
```

Not all actions are available on all component types — for example, `addItem`
and `removeItem` are exclusive to `list` components. The common actions
(`export`, `import`, `clear`, `reset`) are available on all field components.
You can also define [custom actions](#how-do-i-add-custom-actions).

See [Quick Start — Actions and Triggers](
{{ "/getting_started/quick_start" | relative_url }}#actions-and-triggers)
for a hands-on introduction.


### What is «context» in SmarkForm?

The **context** of a trigger is the component that receives the action. By
default, SmarkForm resolves it automatically — the trigger's "natural context"
is its **closest ancestor component that implements the action**.

This means:

- A `clear` button placed **directly inside** a list item's template clears
  that list item.
- If the button is inside a **nested subform**, it clears the subform.
- If it is outside all lists and subforms, it clears the enclosing component —
  which might be a `form`, a `list`, or even a scalar field like `color` or
  `number` if the button is embedded inside one using the **singleton pattern**
  (see [What is the Singleton Pattern?](#what-is-the-singleton-pattern)).

For the case where no convenient ancestor exists, you can always target any
component explicitly with the `"context"` property and a relative path:

```html
<!-- Clears only the "email" field, no matter where the button is placed -->
<button data-smark='{"action":"clear","context":"email"}'>Clear email</button>
```

See [Quick Start — Actions and Triggers](
{{ "/getting_started/quick_start" | relative_url }}#actions-and-triggers)
and [Form Traversing]({{ "/advanced_concepts/form_traversing" | relative_url }})
for full details.


### What is the Singleton Pattern?

The **Singleton Pattern** is a technique where you wrap a single HTML form
field inside a non-field container tag and declare **that container** as the
SmarkForm component. The container becomes the component; the inner `<input>`
(or `<textarea>` or `<select>`) is just the rendering surface.

```html
<!-- Without Singleton Pattern — bare input, no room for sibling triggers -->
<input type="color" name="bgcolor" data-smark>

<!-- With Singleton Pattern — container IS the component; has room for extras -->
<span data-smark='{"type":"color","name":"bgcolor"}'>
    <input data-smark>
    <button data-smark='{"action":"clear"}'>❌ Reset</button>
</span>
```

Because the trigger (`clear`) is now **inside** the component, its natural
context is the `color` component itself — no explicit `context` path needed.

The Singleton Pattern is available for all scalar field types (`input`,
`number`, `color`, `radio`, `date`, `time`, `datetime-local`).  It is
especially useful for:

- Embedding a `clear` button directly inside a `color` or `number` field.
- Adding per-item `removeItem` buttons inside lists of scalars.
- Grouping a label and its field as a single named component.

See [Core Component Types — The Singleton Pattern](
{{ "/getting_started/core_component_types" | relative_url }}#the-singleton-pattern)
for a full walkthrough.


### How do I add a 'clear' button to a `color` or `number` field?

Native `<input type="color">` always has a value — it cannot be empty — so
SmarkForm provides its own `color` type that can export `null`. But how do
you clear it without the keyboard?

**Option A — Singleton Pattern (recommended):** wrap the `<input>` in a
container declared as the SmarkForm component, then place the `clear` trigger
inside that container. The trigger's natural context becomes the `color`
component:

```html
<span data-smark='{"type":"color","name":"bgcolor"}'>
    <input data-smark>
    <button data-smark='{"action":"clear"}'>❌ Clear</button>
</span>
```

**Option B — Explicit context:** keep the bare `<input>` and place the button
anywhere else, but specify the target field by name:

```html
<input type="color" name="bgcolor" data-smark>
<button data-smark='{"action":"clear","context":"bgcolor"}'>❌ Clear</button>
```

Option A is preferred because it is resilient to future renames — you only
need to change the `name` in one place (the container) rather than in both the
`<input>` and the button's `context` path.

The same technique applies to `number`, `date`, `time`, and any other scalar
type that you want to associate with extra UI controls.


## Lists

### Why can't I remove items from my list sometimes?

SmarkForm enforces a `min_items` limit (default is 1) on variable-length lists
to keep them functional. When you hit this minimum, the "remove" button
(`data-smark='{"action":"removeItem"}'`) is automatically disabled. Once you
add more items, it re-enables.
 
Check your list container — if it's at `min_items`, that's why. If you rather
want to allow empty lists, set `{"min_items": 0}`.

{: .hint :}
> Add a disabled CSS rule (e.g. `button:disabled { opacity: 0.5; }`) to make
> this state more obvious to users.

### Why does my «add» button stop working?

Similar to removal, SmarkForm respects a `max_items` limit if you set one (e.g.
`{"max_items": 5}`). When the list hits this cap, the "add" button
(`data-smark='{"action":"addItem"}'`) disables itself until you remove an item.

{: .hint :}
> Style the disabled state with CSS or raise `max_items` in your config if you
> need more slots.

### My list won't let me add items until I fill the current ones—is that intended?

SmarkForm does not block adding new items based on whether existing ones are
filled. If your "add" button is disabled, check whether you've hit `max_items`
or whether a custom event handler is interfering.


### How do I add animations to list items?

SmarkForm applies CSS classes during add/remove transitions, giving you a hook
for animations:

- When a new item is added, SmarkForm briefly adds a configurable class (e.g.
  `new_item`) to the new element — attach a CSS animation to "slide it in".
- When an item is removed, SmarkForm adds another configurable class (e.g.
  `removing_item`) and waits for any running CSS transition to finish before
  removing the DOM node — attach your "slide out" animation to that class.

The exact class names can be configured in the list's `data-smark` options.

See [Showcase — Animations]({{ "/about/showcase" | relative_url }}#animations)
for a working, copy-pasteable example.


## Data: Import, Export & Reset

### My exported JSON is missing some fields—what's up?

By default, SmarkForm skips empty items in variable-length lists when exporting
to JSON. If you want those empty items included (e.g. `""` or `null`), set
`{"exportEmpties": true}` in your list config.

See the [Showcase]({{ "/about/showcase" | relative_url }}#a-note-on-empty-values)
for a worked example.

### Why are my nested form fields named weirdly in the JSON?

SmarkForm reflects the nesting structure in the exported JSON. A subform named
`"address"` containing a field `"city"` will export as
`{"address": {"city": "…"}}`.

If you see unexpected nesting, double-check the `name` values in your
`data-smark` attributes.

### Why does my form export null values? How do I map them to HTML fields?

SmarkForm uses `null` to represent "the user has not provided a value" — this
is intentional and distinct from an empty string `""`.

**Why `null` exists:**

- Native `<input type="color">` can't be empty; SmarkForm's `color` type
  returns `null` when cleared.
- Date, time, number, and similar fields also return `null` when empty rather
  than `""` or `0`, to avoid ambiguity in the exported JSON.
- Radio buttons return `null` when no option is selected. They also can be
  de-selected (by clicking the selected option again or by pressing `Delete`
  key).

**Mapping `null` to HTML fields on import:** when a `null` value is imported
into a field, SmarkForm clears the field to its native empty state. The
`clear` action does the same thing programmatically.


### Is there a `notNull` attribute (or `required` option)?

No — and there intentionally never will be one at the SmarkForm level.

Here is why: SmarkForm cannot tell whether a field is `null` because the user
**deliberately left it empty** or because it was **never touched**. Enforcing
non-null at export time would therefore silently coerce data that might be
legitimately absent.

The correct approach is **validation before submission**: if a field must not
be empty, prevent the user from triggering the `export` action until they have
filled it in.  You can do this with a `BeforeAction_export` event handler:

```javascript
myForm.on("BeforeAction_export", ({ data, preventDefault }) => {
    if (data.color === null) {
        alert("Please pick a color before saving.");
        preventDefault(); // cancel the export
    }
});
```

HTML5's own `required` attribute can also help for plain text inputs — those
participate in the browser's built-in constraint validation, which SmarkForm
does not interfere with.

### How do I submit form data to a backend?

The recommended pattern is:

1. Add an `export` trigger button to your form.
2. Listen to `AfterAction_export` to receive the data and send it to your server.

```html
<button data-smark='{"action":"export"}'>💾 Save</button>
```

```javascript
myForm.on("AfterAction_export", async ({ data }) => {
    await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
});
```

See [Event Handling — Common Patterns]({{ "/advanced_concepts/events" | relative_url }}#submitting-form-data-to-a-backend) for more detail.

### Can I use a classic HTML form submission instead of JSON export?

SmarkForm currently works with **JSON-based import/export** rather than native
`<form>` POST submission. The `<form>` tag itself is not enhanced to submit via
the browser's built-in mechanism.

**Current workaround:** use `AfterAction_export` to send the JSON payload to
your backend via `fetch` (see above).

{: .info :}
> 🔭 **Planned feature:** `<form>` tag enhancement — allowing native form
> submission or a transparent bridge to the Fetch API — is on the
> [roadmap]({{ "/about/roadmap" | relative_url }}). This is **not** yet implemented.

### How do default values and reset work?

The `value` property in a component's `data-smark` options sets its
`defaultValue`. Calling `reset()` (or clicking a Reset trigger) restores the
component to that default.

```html
<!-- Name field defaults to "Alice" -->
<input data-smark='{"name":"name","value":"Alice"}' type="text">
```

For a form or list, you can set the default on the container:

```html
<div data-smark='{"name":"demo","value":{"name":"Alice"}}'>
  <input data-smark type="text" name="name">
</div>
```

**`import()` updates the default by default.** When you call `import(data)`,
the imported data becomes the new default for subsequent `reset()` calls. This
means "Load" and "Reset" naturally work together: after loading new data,
Reset brings you back to that loaded data.

```javascript
// After this import, reset() will restore {name: "Bob"}
await myForm.import({name: "Bob"});

// Temporarily change value
await myForm.import({name: "Temp"}, {setDefault: false}); // won't update default

// Reset restores {name: "Bob"}, not the original initialization default
await myForm.reset();
```

To **prevent** an import from changing the default, pass `setDefault: false`:

```javascript
await myForm.import(someData, {setDefault: false});
// reset() will still restore the previous default
```

The same option works from HTML triggers:

```html
<button data-smark='{"action":"import","setDefault":false}'>Preview</button>
```

**Importing `undefined`** (which is what `reset()` does internally) never
updates the default — it simply restores the current default value.

{: .info :}
> **How the new default is computed:** When `setDefault: true` and data is not
> `undefined`, SmarkForm performs a silent `export` with `exportEmpties: true`
> and stores the result as the new `defaultValue`. This guarantees that the
> stored default is a normalized, consistent representation of the imported
> state — including empty list items that would otherwise be stripped.


## Events & Actions

### I added an event listener, but it's not firing—why?

SmarkForm supports events like `AfterAction_export`, `AfterAction_addItem`,
`AfterAction_removeItem`, and more. Check:

1. **The event name** — it must match the action exactly, e.g. `"AfterAction_addItem"` (not `"AfterAction_add"`).
2. **Scoping** — `myForm.on(…)` listens to all descendants; `myForm.onLocal(…)` listens only on that specific component.
3. **Timing** — handlers registered after the action fires are too late; register them during initialization.

See the [Event Handling]({{ "/advanced_concepts/events" | relative_url }}) page for the full reference.

### How do I add custom actions?

Pass a `customActions` object to the `SmarkForm` constructor. Each key becomes
an action name that can be referenced in `data-smark` trigger buttons:

```javascript
const customActions = {
    async myAction(data, options) {
        console.log("Custom action triggered with data:", data);
    },
};
const myForm = new SmarkForm(document.getElementById("myForm"), {
    customActions
});
```

```html
<button data-smark='{"action":"myAction"}'>Run Custom Action</button>
```

Custom actions are bound to the root form instance (`this` inside the function
refers to the root `SmarkForm`). They do **not** automatically participate in
the `BeforeAction`/`AfterAction` event cycle unless you emit those events
yourself.


### How do I add keyboard shortcuts (hotkeys)?

Add a `hotkey` property to any trigger's `data-smark` object. The value is the
`KeyboardEvent.key` string for the desired key (single printable characters are
most portable). Hotkeys are activated with `Ctrl` + the key:

```html
<button data-smark='{"action":"addItem","hotkey":"+"}'>Add</button>
<button data-smark='{"action":"removeItem","hotkey":"-"}'>Remove</button>
<button data-smark='{"action":"export","hotkey":"s"}'>Save</button>
```

**Hotkey reveal:** when the user presses and holds `Ctrl`, SmarkForm sets a
`data-hotkey` attribute on each currently active trigger button. You add CSS
to turn that attribute into a visible badge — SmarkForm intentionally leaves
the visual style entirely up to you:

```css
/* Show a small "Ctrl+X" badge above each active hotkey trigger */
[data-hotkey] {
    position: relative;
}
[data-hotkey]::after {
    content: "Ctrl+" attr(data-hotkey);
    position: absolute;
    top: -1.4em;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.7em;
    background: #333;
    color: #fff;
    padding: 1px 4px;
    border-radius: 3px;
    white-space: nowrap;
}
```

When `Ctrl` is released the `data-hotkey` attributes are removed and the hints
disappear automatically.

**Context sensitivity:** When a hotkey combination is pressed, SmarkForm
searches for matching triggers across the **focused component, all its
ancestors, and the siblings of those ancestors** — ordered by proximity to the
focused element. The nearest match wins.

This means you can re-use the same key at different nesting levels: `Ctrl+-`
can remove a phone when focus is inside the phones list, and remove a whole
user when focus is at the user level. SmarkForm picks the right trigger
automatically based on where the keyboard focus is.

See [Hotkeys]({{ "/advanced_concepts/hotkeys" | relative_url }}) for full details and examples.

### What if I want to reach an outer action with the same hotkey?

Use `Alt+Ctrl` instead of `Ctrl` to reach the next matching trigger up the
hierarchy.

Following the previous example, if you have `Ctrl+-` to remove a phone and you
want to remove the whole user instead, press `Alt+Ctrl+-` to skip the first
match and trigger the next one.

This is [well explained]({{ "/resources/user_guide" | relative_url
}}#second-level-hotkeys-reaching-outer-contexts) of the end-user guide — 🚀
feel free to link it in your UI or documentation to [help your users discover this
kind of features]({{ "/community/branding" | relative_url }}).

## Behaviour & Troubleshooting

### Where's the error message when something goes wrong?

SmarkForm favors silent prevention over loud errors. For example, hitting
`min_items` disables "remove" instead of throwing an error. You can hook into
events (e.g. `AfterAction_removeItem`) to add custom feedback.

### `myForm.find('/foo/bar')` returns `null` but the field exists

This almost always means `find()` was called **before the form finished
rendering**.

SmarkForm builds its internal map of field components asynchronously during
`render()`. Before rendering is complete, `find()` will return `null` (or
`undefined`) for every path — even valid ones.

**Solution:** await the `rendered` promise before calling `find()`:

```javascript
const myForm = new SmarkForm(document.getElementById("myForm"));
await myForm.rendered; // wait for full render

const field = myForm.find("/foo/bar"); // now safe
```

Inside **event handlers** (e.g. `AfterAction_*`) this is not necessary because
those events are only emitted after rendering is complete.

{: .warning :}
> Never call `find()` in the same synchronous tick as the `SmarkForm`
> constructor — even for the root form's own fields. Always `await myForm.rendered`
> first.


### What does `await myForm.rendered` do?

The `rendered` property is a **Promise** that resolves once SmarkForm has
finished building its internal component tree from the DOM. Rendering is
asynchronous because SmarkForm processes `data-smark` attributes
asynchronously to keep the browser responsive for large forms.

Any code that needs to access components via `find()`, or that needs to
programmatically `import()` initial data, must wait for this promise:

```javascript
const myForm = new SmarkForm(document.getElementById("myForm"));

// Wait before touching the component tree
await myForm.rendered;

// Now safe to use
const field = myForm.find("/address/city");
await myForm.import({ address: { city: "Paris" } });
```

Event handlers registered via `myForm.on(…)` are always called after rendering
is complete, so you do not need to `await myForm.rendered` inside them.


## API & JavaScript

### Can I have multiple independent SmarkForm forms on a page?

Yes, with a few guidelines:

- **Do not nest one SmarkForm root inside another.** SmarkForm forms should be
  independent siblings in the DOM.
  ```html
  <!-- Two independent root forms on the same page -->
  <div id="formA">…</div>
  <div id="formB">…</div>

  <script>
  const formA = new SmarkForm(document.getElementById("formA"));
  const formB = new SmarkForm(document.getElementById("formB"));
  </script>
  ```
- **One root with named subforms** is often a better pattern than multiple
  roots — use `data-smark='{"type":"form","name":"billing"}'` to create logically
  separate sections within a single root.
  ```html
  <!-- One root form with named subforms -->
  <div id="outerForm">
    <div data-smark='{"name":"formA"}'>…</div>
    <div data-smark='{"name":"formB"}'>…</div>
  </div>

  <script>
  (async ()=>{
    const outerForm = new SmarkForm(document.getElementById("outerForm"));
    await myForm.rendered;
    const formA = outerForm.find("/formA");
    const formB = outerForm.find("/formB");
  })();
  </script>
  ```
- With the second pattern, absolute paths start from the real root. But this is
more an advantage than a limitation since both forms can access the data of
each other (if needed).


### What's this «API interface» I keep hearing about?

The API interface is a **planned future feature** for dynamic data — think
fetching options for a `<select>` component from a server, or loading list
items on demand. It is **not yet implemented**.

Stay tuned — details will land in the docs when it's ready. See the
[Roadmap]({{ "/about/roadmap" | relative_url }}#the-api-interface) for more
context.


## Integration & Deployment

### Which browsers does SmarkForm support?

SmarkForm targets the browsers covered by its Babel configuration and is tested
with Playwright across **Chromium**, **Firefox**, and **WebKit** (Safari engine).

In practice this means modern versions of:

| Browser | Engine |
|---------|--------|
| Chrome / Edge | Chromium |
| Firefox | Gecko |
| Safari / iOS Safari | WebKit |

Older browsers (IE 11, legacy Edge) are not supported.

### Can I use SmarkForm in React (or Vue, Angular, etc.) projects?

SmarkForm is not designed for virtual-DOM frameworks and the
fit is awkward.

SmarkForm is a **DOM-first** library. It reads `data-smark` attributes from
real DOM nodes at initialisation time and keeps its own internal component
tree in sync with those nodes. That model sits at odds with how React, Vue,
and Angular work.

Anyway, if you want to try it, please [give us feedback](https://github.com/bitifet/SmarkForm/discussions)
on your experience.

### Where does SmarkForm really shine?

SmarkForm is a DOM-first, markup-driven library — and that is a feature, not a
limitation. It is an ideal fit anywhere you own the HTML and want powerful form
behaviour without pulling in a heavyweight framework.

#### Server-rendered HTML stacks

If your backend renders HTML (Ruby on Rails, Django, Laravel, Symfony, plain
PHP, ASP.NET Razor, Go templates…), you already own every DOM node before the
page loads. SmarkForm slots in with a single `<script>` import and a
`new SmarkForm(el)` call — no build pipeline required.

```html
<!-- Drop this at the bottom of your server-rendered page -->
<script type="module">
  import SmarkForm from "https://cdn.jsdelivr.net/npm/smarkform/dist/SmarkForm.esm.js";
  const myForm = new SmarkForm(document.getElementById("myForm"));
  myForm.on("AfterAction_export", ({ data }) => {
    fetch("/submit", { method: "POST", body: JSON.stringify(data) });
  });
</script>
```

Your backend devs keep writing plain HTML templates; SmarkForm upgrades them
silently.

#### Static-site generators and JAMstack

Hugo, Jekyll, Eleventy, Astro (static output), Zola… — all generate HTML at
build time. SmarkForm enhances those static pages with dynamic form behaviour
without changing the rendering pipeline. The docs site you're reading right now
is a Jekyll site that uses exactly this pattern.

#### Progressive enhancement of existing pages

Got a legacy app or a CMS (WordPress, Drupal, TYPO3, Joomla) where you can
add `data-smark` attributes but can't change the server stack? Add a small
`<script type="module">` block or enqueue the UMD bundle, point it at an
existing `<form>` or `<div>`, and the page instantly gains subforms,
variable-length lists, and JSON export — all without touching server code.

#### Alpine.js and 'HTML-over-the-wire' stacks

[Alpine.js](https://alpinejs.dev/), [HTMX](https://htmx.org/),
[Hotwire/Turbo](https://hotwired.dev/), and similar tools share SmarkForm's
philosophy of keeping behaviour close to the markup. They pair naturally:

- **HTMX / Turbo** replace page fragments with server-rendered HTML; SmarkForm
  re-initialises on the new fragment via the `DOMContentLoaded` equivalent or a
  simple mutation observer.
- **Alpine.js** can call `myForm.export()` / `myForm.import()` from its event
  handlers, letting Alpine manage UI state while SmarkForm owns form data.

#### Vanilla JavaScript projects and micro-frontends

When you don't want any framework at all — a standalone widget, an embeddable
form component, a micro-frontend — SmarkForm gives you complex form logic
(nested subforms, dynamic lists, hotkeys) in a single ~38 KB bundle with
zero runtime dependencies.

#### Back-office tools and internal dashboards

Internal tooling rarely needs a polished React stack. A lightweight HTML page
plus SmarkForm can handle configuration editors, data-entry screens, and admin
panels with far less boilerplate than a full SPA framework, and with no Node.js
build step if you use the CDN.

#### In short

| Environment | Why SmarkForm fits well |
|-------------|------------------------|
| Rails / Django / Laravel / PHP | You own the HTML; one `<script>` tag is all you need |
| Jekyll / Hugo / Eleventy | Static HTML at build time + dynamic forms at runtime |
| WordPress / Drupal / CMS | Add `data-smark` attributes; no server changes required |
| HTMX / Turbo / Alpine.js | Shared "HTML is the source of truth" philosophy |
| Vanilla JS widgets | Zero deps, tiny bundle, pure DOM API |
| Internal dashboards | No build pipeline needed; rapid iteration |

{: .hint :}
> Not sure whether SmarkForm is the right fit for your project? Open a
> [discussion](https://github.com/bitifet/SmarkForm/discussions) — we're happy
> to help you evaluate!


## Have a question not covered here?

You have a question that isn't answered here? You found a confusing edge case?
You want to know if SmarkForm is a good fit for your project?

Open a [discussion](https://github.com/bitifet/SmarkForm/discussions) on GitHub
or reach out at the [Telegram community
group](https://t.me/smarkformcommunity). We're happy to help you out and may
even add your question to this FAQ if it's a common one!

