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
* [Which browsers does SmarkForm support?](#which-browsers-does-smarkform-support)
* [Why does my form export null values? How do I map them to HTML fields?](#why-does-my-form-export-null-values-how-do-i-map-them-to-html-fields)
* [What's this "API interface" I keep hearing about?](#whats-this-api-interface-i-keep-hearing-about)

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

**Current behavior:** when a form is first loaded (or `reset()` is called), it
imports the `defaultValue`. If no `defaultValue` is set, `reset()` clears the
form to its empty state.

{: .info :}
> 🔭 **Future idea (not yet implemented):** It has been discussed that `import`
> could optionally set the imported data as the new default (unless
> `setDefault: false` is passed). This would allow "Load" to also update what
> "Reset" restores to. This behavior is **not** currently implemented.


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


## What's this "API interface" I keep hearing about?

The API interface is a **planned future feature** for dynamic data — think
fetching options for a `<select>` component from a server, or loading list
items on demand. It is **not yet implemented**.

Stay tuned — details will land in the docs when it's ready. See the
[Roadmap]({{ "/about/roadmap" | relative_url }}#the-api-interface) for more
context.


{: .hint :}
> Got more questions?
> 
> 👉 Open a [discussion](https://github.com/bitifet/SmarkForm/discussions) on GitHub or reach out!
