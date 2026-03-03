---
title: FAQ
layout: chapter
nav_order: 6
permalink: /about/faq

---

{% include links.md %}

# SmarkForm {{ page.title }}


Below are answers to common questions about SmarkForm's behavior, especially
around edge cases or features that might catch you off guard at first.


<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Why can't I remove items from my list sometimes?](#why-cant-i-remove-items-from-my-list-sometimes)
* [Why does my «add» button stop working?](#why-does-my-add-button-stop-working)
* [My exported JSON is missing some fields—what's up?](#my-exported-json-is-missing-some-fieldswhats-up)
* [Why are my nested form fields named weirdly in the JSON?](#why-are-my-nested-form-fields-named-weirdly-in-the-json)
* [I added an event listener, but it's not firing—why?](#i-added-an-event-listener-but-its-not-firingwhy)
* [My list won't let me add items until I fill the current ones—is that intended?](#my-list-wont-let-me-add-items-until-i-fill-the-current-onesis-that-intended)
* [Where's the error message when something goes wrong?](#wheres-the-error-message-when-something-goes-wrong)
* [How do I submit form data to a backend?](#how-do-i-submit-form-data-to-a-backend)
* [Can I use a classic HTML form submission instead of JSON export?](#can-i-use-a-classic-html-form-submission-instead-of-json-export)
* [Can I have multiple independent SmarkForm forms on a page?](#can-i-have-multiple-independent-smarkform-forms-on-a-page)
* [How do I add custom actions?](#how-do-i-add-custom-actions)
* [How do default values and reset work?](#how-do-default-values-and-reset-work)
* [`myForm.find('/foo/bar')` returns `null` but the field exists](#myformfindfoobar-returns-null-but-the-field-exists)
* [Which browsers does SmarkForm support?](#which-browsers-does-smarkform-support)
* [Why does my form export null values? How do I map them to HTML fields?](#why-does-my-form-export-null-values-how-do-i-map-them-to-html-fields)
* [What's this «API interface» I keep hearing about?](#whats-this-api-interface-i-keep-hearing-about)
* [Can I use SmarkForm in React (or Vue, Angular, etc.) projects?](#can-i-use-smarkform-in-react-or-vue-angular-etc-projects)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>



## Why can't I remove items from my list sometimes?

SmarkForm enforces a `min_items` limit (default is 1) on variable-length lists
to keep them functional. When you hit this minimum, the "remove" button
(`data-smark='{"action":"removeItem"}'`) is automatically disabled. Once you
add more items, it re-enables.
 
Check your list container — if it's at `min_items`, that's why. If you rather
want to allow empty lists, set `{"min_items": 0}`.

{: .hint :}
> Add a disabled CSS rule (e.g. `button:disabled { opacity: 0.5; }`) to make
> this state more obvious to users.


## Why does my «add» button stop working?

Similar to removal, SmarkForm respects a `max_items` limit if you set one (e.g.
`{"max_items": 5}`). When the list hits this cap, the "add" button
(`data-smark='{"action":"addItem"}'`) disables itself until you remove an item.

{: .hint :}
> Style the disabled state with CSS or raise `max_items` in your config if you
> need more slots.


## My exported JSON is missing some fields—what's up?

By default, SmarkForm skips empty items in variable-length lists when exporting
to JSON. If you want those empty items included (e.g. `""` or `null`), set
`{"exportEmpties": true}` in your list config.

See the [Showcase]({{ "/about/showcase" | relative_url }}#a-note-on-empty-values)
for a worked example.


## Why are my nested form fields named weirdly in the JSON?

SmarkForm reflects the nesting structure in the exported JSON. A subform named
`"address"` containing a field `"city"` will export as
`{"address": {"city": "…"}}`.

If you see unexpected nesting, double-check the `name` values in your
`data-smark` attributes.


## I added an event listener, but it's not firing—why?

SmarkForm supports events like `AfterAction_export`, `AfterAction_addItem`,
`AfterAction_removeItem`, and more. Check:

1. **The event name** — it must match the action exactly, e.g. `"AfterAction_addItem"` (not `"AfterAction_add"`).
2. **Scoping** — `myForm.on(…)` listens to all descendants; `myForm.onLocal(…)` listens only on that specific component.
3. **Timing** — handlers registered after the action fires are too late; register them during initialization.

See the [Event Handling]({{ "/advanced_concepts/events" | relative_url }}) page for the full reference.


## My list won't let me add items until I fill the current ones—is that intended?

SmarkForm does not block adding new items based on whether existing ones are
filled. If your "add" button is disabled, check whether you've hit `max_items`
or whether a custom event handler is interfering.


## Where's the error message when something goes wrong?

SmarkForm favors silent prevention over loud errors. For example, hitting
`min_items` disables "remove" instead of throwing an error. You can hook into
events (e.g. `AfterAction_removeItem`) to add custom feedback.


## How do I submit form data to a backend?

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


## Can I use a classic HTML form submission instead of JSON export?

SmarkForm currently works with **JSON-based import/export** rather than native
`<form>` POST submission. The `<form>` tag itself is not enhanced to submit via
the browser's built-in mechanism.

**Current workaround:** use `AfterAction_export` to send the JSON payload to
your backend via `fetch` (see above).

{: .info :}
> 🔭 **Planned feature:** `<form>` tag enhancement — allowing native form
> submission or a transparent bridge to the Fetch API — is on the
> [roadmap]({{ "/about/roadmap" | relative_url }}). This is **not** yet implemented.


## Can I have multiple independent SmarkForm forms on a page?

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



## How do I add custom actions?

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


## How do default values and reset work?

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


## `myForm.find('/foo/bar')` returns `null` but the field exists

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


## Which browsers does SmarkForm support?

SmarkForm targets the browsers covered by its Babel configuration and is tested
with Playwright across **Chromium**, **Firefox**, and **WebKit** (Safari engine).

In practice this means modern versions of:

| Browser | Engine |
|---------|--------|
| Chrome / Edge | Chromium |
| Firefox | Gecko |
| Safari / iOS Safari | WebKit |

Older browsers (IE 11, legacy Edge) are not supported.


## Why does my form export null values? How do I map them to HTML fields?

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


## What's this «API interface» I keep hearing about?

The API interface is a **planned future feature** for dynamic data — think
fetching options for a `<select>` component from a server, or loading list
items on demand. It is **not yet implemented**.

Stay tuned — details will land in the docs when it's ready. See the
[Roadmap]({{ "/about/roadmap" | relative_url }}#the-api-interface) for more
context.


## Can I use SmarkForm in React (or Vue, Angular, etc.) projects?

**Honest answer: it works, but SmarkForm is not designed for virtual-DOM
frameworks and the fit is awkward.**

SmarkForm is a **DOM-first** library. It reads `data-smark` attributes from
real DOM nodes at initialisation time and keeps its own internal component
tree in sync with those nodes. That model sits at odds with how React, Vue,
and Angular work:

| Concern | Plain HTML / SSR | React / Vue / Angular |
|---------|------------------|-----------------------|
| DOM ownership | You own the DOM | The framework owns the DOM |
| Initialisation | Run `new SmarkForm(el)` any time after the node exists | Must wait for mount, wrap in `useEffect` / `onMounted` / `ngAfterViewInit` |
| DOM mutations | SmarkForm reads the DOM directly | The framework re-renders and may recreate nodes, breaking SmarkForm's references |
| Data flow | SmarkForm owns form state; export via events | The framework expects to own state via its own reactive system |

**Can it be done?** Yes — mount the component once (e.g. inside a React
`useEffect` with an empty dependency array), never let the framework re-render
the subtree SmarkForm controls, and export/import data imperatively through
the SmarkForm API. Here is the minimal React pattern:

```jsx
import { useEffect, useRef } from "react";
import SmarkForm from "smarkform";

export default function MyForm({ onSave }) {
    const rootRef = useRef(null);
    const sfRef   = useRef(null);

    useEffect(() => {
        // Initialise once after mount — keep the subtree stable
        sfRef.current = new SmarkForm(rootRef.current);
        sfRef.current.on("AfterAction_export", ({ data }) => onSave(data));
        return () => {
            // No built-in destroy yet; just drop the reference
            sfRef.current = null;
        };
    }, []); // empty deps → runs once

    // ⚠ Do NOT put any dynamic React state inside this subtree —
    // React re-renders will fight with SmarkForm's DOM references.
    return (
        <div ref={rootRef}>
            <input data-smark type="text" name="name" />
            <button data-smark='{"action":"export"}'>Save</button>
        </div>
    );
}
```

**Would React developers enjoy it?** Probably not as their day-to-day tool.
React devs are used to state living in JavaScript (hooks, stores) and the view
being a pure function of that state. SmarkForm inverts that: state lives in the
DOM and is read out on demand. The two philosophies can coexist in one page, but
they do not complement each other naturally.

**Where SmarkForm shines instead:**

- **Server-rendered HTML** (Rails, Django, Laravel, Jekyll, plain PHP…) — drop
  in a `<script>` tag or ES-module import and you're done.
- **Progressive enhancement** of existing HTML pages.
- **Lightweight SPAs** without a heavy framework — Vanilla JS, Alpine.js, or
  any setup where you control the DOM directly.
- **Back-office tools and internal dashboards** where shipping speed matters
  more than framework orthodoxy.

{: .info :}
> If you are building a React/Vue/Angular app and need complex nested forms
> with JSON import/export, the framework's own form ecosystem (React Hook Form,
> Formik, VeeValidate, Angular Reactive Forms…) will integrate more naturally.
> SmarkForm is a compelling alternative when you are *not* already committed to
> one of those frameworks.


{: .hint :}
> Got more questions?
> 
> 👉 Open a [discussion](https://github.com/bitifet/SmarkForm/discussions) on GitHub or reach out!
