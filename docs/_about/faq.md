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

<div class="chaptertoc toplevel">

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
* [Where does SmarkForm really shine?](#where-does-smarkform-really-shine)
    * [Server-rendered HTML stacks](#server-rendered-html-stacks)
    * [Static-site generators and JAMstack](#static-site-generators-and-jamstack)
    * [Progressive enhancement of existing pages](#progressive-enhancement-of-existing-pages)
    * [Alpine.js and 'HTML-over-the-wire' stacks](#alpinejs-and-html-over-the-wire-stacks)
    * [Vanilla JavaScript projects and micro-frontends](#vanilla-javascript-projects-and-micro-frontends)
    * [Back-office tools and internal dashboards](#back-office-tools-and-internal-dashboards)
    * [In short](#in-short)
* [What about if I have a question that's not covered here?](#what-about-if-i-have-a-question-thats-not-covered-here)

<!-- vim-markdown-toc -->
       " | markdownify }}

</div>


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

SmarkForm is not designed for virtual-DOM frameworks and the
fit is awkward.

SmarkForm is a **DOM-first** library. It reads `data-smark` attributes from
real DOM nodes at initialisation time and keeps its own internal component
tree in sync with those nodes. That model sits at odds with how React, Vue,
and Angular work.

Anyway, if you want to try it, please [give us feedback](https://github.com/bitifet/SmarkForm/discussions)
on your experience.


## Where does SmarkForm really shine?

SmarkForm is a DOM-first, markup-driven library — and that is a feature, not a
limitation. It is an ideal fit anywhere you own the HTML and want powerful form
behaviour without pulling in a heavyweight framework.

### Server-rendered HTML stacks

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

### Static-site generators and JAMstack

Hugo, Jekyll, Eleventy, Astro (static output), Zola… — all generate HTML at
build time. SmarkForm enhances those static pages with dynamic form behaviour
without changing the rendering pipeline. The docs site you're reading right now
is a Jekyll site that uses exactly this pattern.

### Progressive enhancement of existing pages

Got a legacy app or a CMS (WordPress, Drupal, TYPO3, Joomla) where you can
add `data-smark` attributes but can't change the server stack? Add a small
`<script type="module">` block or enqueue the UMD bundle, point it at an
existing `<form>` or `<div>`, and the page instantly gains subforms,
variable-length lists, and JSON export — all without touching server code.

### Alpine.js and 'HTML-over-the-wire' stacks

[Alpine.js](https://alpinejs.dev/), [HTMX](https://htmx.org/),
[Hotwire/Turbo](https://hotwired.dev/), and similar tools share SmarkForm's
philosophy of keeping behaviour close to the markup. They pair naturally:

- **HTMX / Turbo** replace page fragments with server-rendered HTML; SmarkForm
  re-initialises on the new fragment via the `DOMContentLoaded` equivalent or a
  simple mutation observer.
- **Alpine.js** can call `myForm.export()` / `myForm.import()` from its event
  handlers, letting Alpine manage UI state while SmarkForm owns form data.

### Vanilla JavaScript projects and micro-frontends

When you don't want any framework at all — a standalone widget, an embeddable
form component, a micro-frontend — SmarkForm gives you complex form logic
(nested subforms, dynamic lists, hotkeys) in a single ~38 KB bundle with
zero runtime dependencies.

### Back-office tools and internal dashboards

Internal tooling rarely needs a polished React stack. A lightweight HTML page
plus SmarkForm can handle configuration editors, data-entry screens, and admin
panels with far less boilerplate than a full SPA framework, and with no Node.js
build step if you use the CDN.

### In short

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

## What about if I have a question that's not covered here?

You have a question that isn't answered here? You found a confusing edge case? You want to know if SmarkForm is a good fit for your project?

Open a [discussion](https://github.com/bitifet/SmarkForm/discussions) on GitHub
or reach out at the [Telegram community
group](https://t.me/smarkformcommunity). We're happy to help you out and may
even add your question to this FAQ if it's a common one!

