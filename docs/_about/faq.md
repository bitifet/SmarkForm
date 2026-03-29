---
title: FAQ
layout: chapter
nav_order: 6
permalink: /about/faq

---

{% include links.md %}

{% include components/sampletabs_ctrl.md %}

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
    * [Does pressing Enter in a text field submit the form?](#does-pressing-enter-in-a-text-field-submit-the-form)
    * [Do I need to enhance submit buttons as SmarkForm triggers?](#do-i-need-to-enhance-submit-buttons-as-smarkform-triggers)
    * [What happens to the submit button's `name` and `value` when the form submits?](#what-happens-to-the-submit-buttons-name-and-value-when-the-form-submits)
    * [Can I use `action='mailto:…'` to send form data by email?](#can-i-use-actionmailto-to-send-form-data-by-email)
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
* [Mixin Types](#mixin-types)
    * [Can I implement my own component types?](#can-i-implement-my-own-component-types)
    * [Are mixin styles isolated / scoped?](#are-mixin-styles-isolated--scoped)
    * [Can I pass parameters to a mixin?](#can-i-pass-parameters-to-a-mixin)
    * [Can a mixin template reference another mixin?](#can-a-mixin-template-reference-another-mixin)
    * [Can mixins load from external files?](#can-mixins-load-from-external-files)
* [Integration & Deployment](#integration-deployment)
    * [Which browsers has SmarkForm been tested on?](#which-browsers-has-smarkform-been-tested-on)
    * [Can I use SmarkForm in React (or Vue, Angular, etc.) projects?](#can-i-use-smarkform-in-react-or-vue-angular-etc-projects)
    * [Where does SmarkForm really shine?](#where-does-smarkform-really-shine)
        * [Server-rendered HTML stacks](#server-rendered-html-stacks)
        * [Static-site generators and JAMstack](#static-site-generators-and-jamstack)
        * [Progressive enhancement of existing pages](#progressive-enhancement-of-existing-pages)
        * [Alpine.js and 'HTML-over-the-wire' stacks](#alpinejs-and-html-over-the-wire-stacks)
        * [Vanilla JavaScript projects and micro-frontends](#vanilla-javascript-projects-and-micro-frontends)
        * [Back-office tools and internal dashboards](#back-office-tools-and-internal-dashboards)
        * [In short](#in-short)
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

**No — but you can.** SmarkForm works with any block-level element — `<div>`,
`<section>`, `<fieldset>`, a plain `<form>`, etc. The root element is just the
DOM node you pass to `new SmarkForm(element)`.

```html
<!-- All of these are valid SmarkForm roots -->
<div id="myForm">…</div>
<section id="myForm">…</section>
<form id="myForm">…</form>
```

Using a `<form>` tag is entirely optional. When you do, SmarkForm automatically
intercepts the native submit event and routes it through the `submit` action —
so native `<button type="submit">` and `<input type="submit">` elements work
exactly as expected, and all the HTML5 per-button overrides (`formaction`,
`formmethod`, etc.) are honoured.

See [Can I use a classic HTML form submission?](#can-i-use-a-classic-html-form-submission-instead-of-json-export)
and [How do I submit form data to a backend?](#how-do-i-submit-form-data-to-a-backend).


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

Beyond the built-in types, you can define **Mixin Types** — reusable component
blueprints stored in `<template>` elements.  A mixin reference starts with `#`
(e.g. `"type":"#myWidget"`).  See
[Can I implement my own component types?](#can-i-implement-my-own-component-types)
for a quick overview.

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

Without the Singleton Pattern, a bare `<input>` has no room for sibling
triggers:

```html
<input type="color" name="bgcolor" data-smark>
```

With the Singleton Pattern, the container IS the component — triggers placed
inside have it as their natural context:

{% raw %} <!-- faq_singleton_color {{{ --> {% endraw %}
{% capture faq_singleton_color_html -%}
<div id="myForm$$">
<span data-smark='{"type":"color","name":"bgcolor"}'>
    <input data-smark>
    <button data-smark='{"action":"clear"}'>❌ Clear</button>
</span>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="faq_singleton_color"
    htmlSource=faq_singleton_color_html
    demoValue='{"bgcolor":"#6366f1"}'
    tests=false
%}

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

SmarkForm deliberately provides no built-in animation engine — transitions are a
design concern that belongs to your CSS. The mechanism is simple: use SmarkForm's
lifecycle events to add and remove CSS classes on list items, and let CSS
`transition` do the rest.

- **`afterRender`** fires after a new item is inserted into the DOM. Add an
  initial CSS class that hides or offsets the element, then — after a minimal
  delay to let the browser paint the initial state — add a second class that
  transitions it to its final visible position.
- **`beforeUnrender`** fires before an item is removed. Remove the "visible"
  class and return a `Promise` that resolves after the transition duration.
  SmarkForm awaits that promise, so the element stays in the document long enough
  for the exit animation to complete.

The following example demonstrates the full technique:

{% raw %} <!-- faq_animations {{{ --> {% endraw %}
{% capture faq_animations_html -%}
<div id="myForm$$">
<ul data-smark='{"type":"list","name":"items","min_items":1}'>
  <li>
    <input data-smark type="text" name="value" placeholder="Item…">
    <button data-smark='{"action":"removeItem"}'>✕</button>
  </li>
</ul>
<button data-smark='{"action":"addItem","context":"items"}'>➕ Add item</button>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- faq_animations_css {{{ --> {% endraw %}
{% capture faq_animations_css -%}
.animated_item {
    transform: translateX(-100%);
    opacity: 0;
    transition: transform 200ms ease-out, opacity 200ms ease-out;
}
.animated_item.ongoing {
    transform: translateX(0);
    opacity: 1;
    transition: transform 200ms ease-in, opacity 200ms ease-in;
}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- faq_animations_js {{{ --> {% endraw %}
{% capture faq_animations_js -%}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

myForm.onAll("afterRender", async (ev) => {
    if (ev.context.parent?.options.type !== "list") return;
    const item = ev.context.targetNode;
    item.classList.add("animated_item");
    await delay(1); // yield one tick so the browser paints the hidden state
    item.classList.add("ongoing");
});

myForm.onAll("beforeUnrender", async (ev) => {
    if (ev.context.parent?.options.type !== "list") return;
    const item = ev.context.targetNode;
    item.classList.remove("ongoing");
    await delay(150); // wait for the CSS transition to finish
});
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="faq_animations"
    htmlSource=faq_animations_html
    cssSource=faq_animations_css
    jsSource=faq_animations_js
    demoValue='{"items":[{"value":"First item"},{"value":"Second item"}]}'
    tests=false
%}

See the [Showcase — Animations]({{ "/about/showcase" | relative_url }}#animations)
for detailed notes and a more elaborate example.


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

**Option A — Native form submission (recommended when using a `<form>` tag):**

Wrap your SmarkForm in a `<form>` element and add a `submit` trigger or a
plain `<button type="submit">`. SmarkForm intercepts the browser's submit event
and routes it through the `submit` action, which flattens the SmarkForm JSON
into URL-encoded pairs and submits them natively:

```html
<form id="myForm" method="post" action="/api/submit">
  …
  <button type="submit">💾 Save</button>
</form>
```

For JSON payloads, set `enctype="application/json"`:

```html
<form id="myForm" method="post" action="/api/submit"
      enctype="application/json">
  …
  <button type="submit">💾 Save</button>
</form>
```

See [submit action]({{ "/component_types/type_form" | relative_url }}#async-submit-action)
for encoding options, attribute resolution, and event hooks.

**Option B — Manual `fetch` (works with any root element):**

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

Yes. Wrap your SmarkForm in a real `<form>` element and SmarkForm will intercept
the native submit event automatically — there's nothing extra to wire up.

```html
<form id="myForm" method="post" action="/submit">
  <input data-smark type="text" name="name">
  <input data-smark type="email" name="email">
  <button type="submit">Submit</button>
</form>

<script>
  new SmarkForm(document.getElementById("myForm"));
</script>
```

Any `<button type="submit">` or `<input type="submit">` inside the form works
as expected: clicking it (or pressing <kbd>Enter</kbd> while it is focused via
<kbd>Tab</kbd>) submits the SmarkForm data using the form's `method`, `action`,
and `enctype` — just as native HTML would, but populated with SmarkForm's
exported values.

For a JSON API, set `enctype="application/json"` and SmarkForm sends the data
as a JSON object via `fetch()` instead of URL-encoding it.

See [submit action]({{ "/component_types/type_form" | relative_url }}#async-submit-action)
for the full reference, including encoding options and event hooks.

### Does pressing Enter in a text field submit the form?

**No.** In SmarkForm, <kbd>Enter</kbd> moves focus to the next field — like
<kbd>Tab</kbd> but more natural to type. This applies everywhere inside the
form container, including non-enhanced elements such as a `<select>` used for
UI purposes (e.g. a theme switcher) that happens to be inside the `<form>` tag.

The rule is straightforward:

| Scenario | Result |
|---|---|
| <kbd>Enter</kbd> in a text / textarea / select / radio / checkbox | Navigates to next field — **does not submit** |
| Mouse click on a submit button (or any child element inside it) | Submits |
| <kbd>Tab</kbd> to a submit button then <kbd>Enter</kbd> | Submits (browser fires a click on the focused button first) |
| Focused SmarkForm trigger + <kbd>Enter</kbd> | Fires the trigger's action — **does not double-submit** |

This design is intentional: keyboard users navigate forms freely with
<kbd>Enter</kbd> and only submit when they explicitly activate a submit button.

### Do I need to enhance submit buttons as SmarkForm triggers?

**No.** Plain `<button type="submit">` and `<input type="submit">` elements
work without any `data-smark` enhancement. SmarkForm intercepts clicks on them
automatically and invokes the `submit` action with the button as the
`submitter`.

If you want a submit button to also participate in the SmarkForm trigger
system (for example, to use `BeforeAction_submit` / `AfterAction_submit` events
or to set a different `context`), you can optionally add
`data-smark='{"action":"submit"}'` — but this is never required.

```html
<!-- Plain submit button — works automatically -->
<button type="submit">Send</button>

<!-- SmarkForm trigger submit — identical behaviour, just more explicit -->
<button type="submit" data-smark='{"action":"submit"}'>Send</button>
```

### What happens to the submit button's `name` and `value` when the form submits?

This depends on the encoding:

**Form-encoded (URL-encoded, multipart, plain-text):**
If the submit button has a `name` attribute, its `name`/`value` pair is
appended to the submitted payload — exactly matching native browser behaviour
for multi-action forms:

```html
<button type="submit" name="intent" value="save">Save</button>
<button type="submit" name="intent" value="draft">Save as Draft</button>
```

The server receives `intent=save` (or `intent=draft`) alongside the form
fields. This lets you tell which button triggered the submission.

{: .warning :}
> This extra entry is **not** part of the SmarkForm export data. It is only
> added to the form-encoded payload, not to the JSON object returned by
> `export()`.

**JSON encoding (`enctype="application/json"`):**
The submitter name/value is **not** automatically added to the JSON body.
You have full control over the payload; access the submitter element via
`options.submitter` inside a `BeforeAction_submit` handler and add it however
you like:

```javascript
myForm.on("BeforeAction_submit", ({ submitter, data }) => {
    if (submitter?.name) {
        data[submitter.name] = submitter.value; // add to JSON body
        // or append to the URL: new URL(action).searchParams.set(...)
    }
});
```

### Can I use `action='mailto:…'` to send form data by email?

Yes — with the default (form-encoded) encoding. When SmarkForm submits via a
temporary `<form>` element and the action is a `mailto:` URL, the browser
handles it natively: it opens the user's email client with the form data
pre-filled in the message body (subject, body, etc. depend on the browser and
the URL format).

```html
<form id="myForm" action="mailto:contact@example.com" method="get">
  <input data-smark type="text" name="subject">
  <textarea data-smark name="body"></textarea>
  <button type="submit">Send Email</button>
</form>
```

{: .warning :}
> `mailto:` is **not** supported with `enctype="application/json"`. JSON
> submission uses `fetch()`, which cannot handle non-HTTP URLs. SmarkForm
> will throw a clear error if you combine the two. Use the default enctype
> for `mailto:` actions.

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


## Mixin Types

### Can I implement my own component types?

Yes — **Mixin Types** are the built-in extensibility mechanism.

A *mixin type* is an HTML `<template>` element that bundles a component's
markup, styles, and behaviour in one place.  Instead of a native type keyword
(`"form"`, `"list"`, …) you write the template's `id` prefixed with `#`:

The example below wraps two `#labeledInput` usages inside a nested `form`
component (`"name":"person"`) so the exported data is grouped under a `person`
key — a common pattern for sub-objects within a larger form.  The mixin
template itself uses the **Singleton Pattern** (`<span data-smark='{"type":"input"}'>`)
as its root so that both the `<input>` and the `<label>` are natural children
of the named component without requiring an extra wrapper:

{% raw %} <!-- faq_mixin_labeled_input {{{ --> {% endraw %}
{% capture faq_mixin_labeled_input_html -%}
<div id="myForm$$">
<div data-smark='{"type":"form","name":"person"}'>
    <div data-smark='{"type":"#labeledInput","name":"firstName"}' data-label="First name"></div>
    <div data-smark='{"type":"#labeledInput","name":"lastName"}'  data-label="Last name"></div>
</div>

<template id="labeledInput">
    <span data-smark='{"type":"input"}'>
        <label>
            <span class="li-label"></span>
            <input data-smark type="text">
        </label>
    </span>
    <style>
        .li-label { font-weight: 600; display: block; margin-bottom: 0.2em; }
    </style>
    <script>
        // `this` is the SmarkForm component instance — use its API to personalise
        // each instance. Show the per-usage data-label, falling back to the
        // component's own name when no label is supplied.
        const labelEl = this.targetNode.querySelector('.li-label');
        if (labelEl) labelEl.textContent = this.targetNode.dataset.label ?? this.name;
    </script>
</template>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="faq_mixin_labeled_input"
    htmlSource=faq_mixin_labeled_input_html
    demoValue='{"person":{"firstName":"Alice","lastName":"Smith"}}'
    tests=false
%}

The `<style>` sibling is injected into `<head>` once (deduplicated), and the
`<script>` sibling runs once per instance with `this` bound to the SmarkForm
component — so you get full API access for event listeners, value manipulation,
and anything else the component API exposes.

For a complete reference including external templates, option merge semantics,
and error codes, see [Mixin Types]({{ "/advanced_concepts/mixin_types" | relative_url }}).

### Are mixin styles isolated / scoped?

No — styles injected by a mixin are added to the page's `<head>` and are
therefore **global** (just like any other `<style>` tag you write by hand).

This is by design: SmarkForm keeps the library simple and avoids the complexity
of Shadow DOM scoping or CSS Modules.  In practice it is easy to work around:

* Use **sufficiently specific CSS class names** — e.g. a `sf-` or `myapp-`
  prefix keeps mixin styles from clashing with the rest of the page.
* Use **child selectors** (`.my-mixin-root > .label`) rather than bare
  descendant selectors to reduce the chance of collisions.
* Keep mixin CSS focused on the component — background colours, layout,
  typography — rather than page-wide resets.

The deduplication guarantee (same style block never appears twice in `<head>`)
means you can use a mixin many times on the page without the CSS accumulating.

### Can I pass parameters to a mixin?

Yes, in two complementary ways:

**Via `data-smark` options** (placeholder overrides template defaults):

```html
<!-- Template defines a default of min_items:1 -->
<template id="tagList">
  <span data-smark='{"type":"list","min_items":1,"max_items":10}'> … </span>
</template>

<!-- Usage site overrides to min_items:3 -->
<div data-smark='{"type":"#tagList","name":"skills","min_items":3}'></div>
```

Any option in the placeholder's `data-smark` wins over the template default.
The mixin type reference (`"type":"#tagList"`) is consumed and not forwarded —
the resolved type (`list`) from the template root is used instead.

**Via HTML attributes** (`data-*`, `aria-*`, `class`, `style`):

```html
<div data-smark='{"type":"#labeledInput","name":"city"}' data-label="City"></div>
```

`data-*` attributes from the placeholder are merged into the expanded node
(placeholder wins), so mixin scripts can read `this.targetNode.dataset.label`
to pick up per-instance values.

### Can a mixin template reference another mixin?

Yes — nested mixin expansion is fully supported.  A template can itself use a
`"type":"#innerId"` reference, and SmarkForm will expand them in order.
Circular references (`A` → `B` → `A`) are detected and throw a
`MIXIN_CIRCULAR_DEPENDENCY` error before any infinite loop can occur.

### Can mixins load from external files?

Yes.  Prefix the `#id` fragment with a relative or absolute URL:

```html
<div data-smark='{"type":"./widgets.html#scheduleRow","name":"hours"}'></div>
```

SmarkForm fetches the file once, parses it, and caches the resulting document
for all subsequent references to the same URL on the same page.  `<style>` and
`<script>` handling, option merging, and all other semantics work identically
for external and local templates.

Cross-origin scripts are subject to the `crossOriginMixins` policy
(`"block"` by default — see the
[Mixin Types reference]({{ "/advanced_concepts/mixin_types" | relative_url }}#cross-origin-script-security-policy)
for details).


## Integration & Deployment

### Which browsers has SmarkForm been tested on?

SmarkForm follows web standards and avoids browser-specific code, aiming for
compatibility with any standard-compliant browser.  The test suite currently
exercises the following engines via Playwright:

| Browser | Engine |
|---------|--------|
| Chrome / Edge | Chromium (desktop) |
| Chrome for Android / Brave | Chromium Mobile (Pixel 5 emulation) |
| Firefox | Gecko |
| Safari / iOS Safari | WebKit (desktop + iPhone 12 emulation) |

These are not "the only supported browsers" — they are simply the ones covered
by the automated test matrix.  SmarkForm is expected to work in any browser
that supports modern ES2017+ JavaScript and the standard DOM APIs it relies on.

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

