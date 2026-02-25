---
title: Event Handling
layout: chapter
permalink: /advanced_concepts/events
nav_order: 2

---

{% include links.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Overview](#overview)
* [Action Lifecycle Events](#action-lifecycle-events)
    * [BeforeAction events](#beforeaction-events)
    * [AfterAction events](#afteraction-events)
    * [Preventing an action](#preventing-an-action)
* [Registering Event Handlers](#registering-event-handlers)
    * [Via options (declarative)](#via-options-declarative)
    * [Via the API (programmatic)](#via-the-api-programmatic)
    * [Local vs. All handlers](#local-vs-all-handlers)
* [DOM Field Events](#dom-field-events)
    * [Supported event types](#supported-event-types)
    * [Event data payload](#event-data-payload)
* [Common Patterns](#common-patterns)
    * [Submitting form data to a backend](#submitting-form-data-to-a-backend)
    * [Intercepting an import to fetch data asynchronously](#intercepting-an-import-to-fetch-data-asynchronously)
    * [Modifying exported data before it leaves](#modifying-exported-data-before-it-leaves)
* [Implementation Details](#implementation-details)
    * [The `@action` decorator](#the-action-decorator)
    * [Calling actions programmatically](#calling-actions-programmatically)
    * [Event bubbling: local vs. all](#event-bubbling-local-vs-all)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


## Overview

SmarkForm provides a rich event model that lets you observe and react to both
user interactions and programmatic changes inside your forms.

Events fall into two categories:

- **Action lifecycle events** — fired before and after every SmarkForm
  [action]({{ "/component_types/type_trigger" | relative_url }}) (such
  as `export`, `import`, `clear`, `reset`, `addItem`, …).
- **DOM field events** — standard browser events (`input`, `change`, `focus`,
  `blur`, `click`, …) that are captured on the root form node and re-dispatched
  through SmarkForm's component tree so that handlers can be registered on any
  component regardless of actual DOM depth.

Both categories share the same registration API.


## Action Lifecycle Events

When an action executes, two events are emitted around it:

| Event name | When |
|---|---|
| `BeforeAction_<name>` | Immediately **before** the action body runs |
| `AfterAction_<name>` | Immediately **after** the action body has finished |

Where `<name>` is the action name (e.g. `export`, `import`, `addItem`, …).

### BeforeAction events

The `BeforeAction_<name>` event fires before the action runs.  The `ev.data`
property holds the input data for the action (if any), and you may **replace**
it before the action sees it:

```javascript
myForm.on("BeforeAction_import", (ev) => {
    // Sanitise data before it is imported into the form
    if (ev.data && typeof ev.data.email === "string") {
        ev.data.email = ev.data.email.trim().toLowerCase();
    }
});
```

### AfterAction events

The `AfterAction_<name>` event fires after the action has completed.
`ev.data` now holds the **return value** of the action (e.g. the exported
JSON object for an `export` action):

```javascript
myForm.on("AfterAction_export", (ev) => {
    console.log("Form exported:", ev.data);
});
```

### Preventing an action

A `BeforeAction_<name>` handler may cancel the action entirely by calling
`ev.preventDefault()`:

```javascript
myForm.on("BeforeAction_export", (ev) => {
    if (!isValid()) {
        ev.preventDefault(); // action will not execute
    }
});
```

{: .hint }
> Only `BeforeAction_*` events are preventable.  `AfterAction_*` events are
> informational and calling `preventDefault()` on them has no effect.


## Registering Event Handlers

### Via options (declarative)

The most common way to attach handlers is through the `options` object passed
to the `SmarkForm` constructor:

```javascript
const myForm = new SmarkForm(document.getElementById("myForm"), {
    onAfterAction_export(ev) {
        // ev.data is the exported JSON
        sendToServer(ev.data);
    },
    onBeforeAction_import(ev) {
        console.log("About to import:", ev.data);
    },
});
```

The option key pattern is:

| Key prefix | Scope |
|---|---|
| `onAfterAction_<name>` | After the named action runs |
| `onBeforeAction_<name>` | Before the named action runs |
| `onLocal_<domEvent>` | DOM event, handled **only** on this component |
| `onAll_<domEvent>` / `on_<domEvent>` | DOM event, handled on this component **and** bubbled up |

### Via the API (programmatic)

After construction you can register handlers using the component's `.on()` or
`.onLocal()` / `.onAll()` methods:

```javascript
// Listen on this component and all ancestors (bubbles up):
myForm.on("AfterAction_export", handler);

// Same as above (alias):
myForm.onAll("AfterAction_export", handler);

// Listen only on this exact component (does NOT bubble):
myForm.onLocal("AfterAction_export", handler);
```

### Local vs. All handlers

| Method | Behaviour |
|---|---|
| `onLocal(evType, handler)` | Handler runs **only** when the event targets this component exactly. |
| `onAll(evType, handler)` / `on(evType, handler)` | Handler runs when the event targets this component **or any descendant** (via SmarkForm's own bubbling). |

This mirrors the capture/bubble model of the DOM but operates within the
SmarkForm component tree rather than the HTML element tree.

**Example — react to an export anywhere inside a sub-form:**

```javascript
const addressForm = myForm.find("address");
addressForm.on("AfterAction_export", (ev) => {
    console.log("Address exported:", ev.data);
});
```


## DOM Field Events

SmarkForm listens for a fixed set of DOM events at the root form node (using
the capture phase) and re-emits them through the SmarkForm component tree.
This means you can register `input`, `change`, `focus`, etc. handlers on *any*
SmarkForm component, not just the one that contains the raw HTML input.

### Supported event types

- Keyboard: `keydown`, `keyup`, `keypress`
- Input: `beforeinput`, `input`, `change`
- Focus: `focus`, `blur`, `focusin`, `focusout`
- Mouse: `click`, `dblclick`, `contextmenu`, `mousedown`, `mouseup`,
  `mousemove`, `mouseenter`, `mouseleave`, `mouseover`, `mouseout`

### Event data payload

Every re-dispatched DOM event is wrapped in a plain object with these
properties:

| Property | Description |
|---|---|
| `type` | The event type string (e.g. `"input"`) |
| `originalEvent` | The original browser `Event` object |
| `context` | The SmarkForm component that owns the DOM element that received the event |
| `preventDefault()` | Delegates to the original event's `preventDefault()` |
| `stopPropagation()` | Stops SmarkForm bubbling (does NOT affect DOM propagation) |
| `stopImmediatePropagation()` | Stops all further handlers including those on the same component |

**Example — watch all `input` events on the whole form:**

```javascript
myForm.on("input", (ev) => {
    console.log("Input changed in component:", ev.context.options.name);
    console.log("New value (raw):", ev.originalEvent.target.value);
});
```


## Common Patterns

### Submitting form data to a backend

The recommended pattern is to use an `export` trigger and intercept the
`AfterAction_export` event.

**HTML** — a plain submit button:

```html
<div id="myForm">
    <input data-smark type="text" name="firstName">
    <input data-smark type="text" name="lastName">
    <button data-smark='{"action":"export"}'>Submit</button>
</div>
```

**JavaScript** — handle the exported data:

```javascript
const myForm = new SmarkForm(document.getElementById("myForm"), {
    async onAfterAction_export(ev) {
        const payload = ev.data;  // Plain JSON-serialisable object
        try {
            const res = await fetch("/api/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            console.log("Saved successfully");
        } catch (err) {
            console.error("Save failed:", err);
        }
    },
});
```

{: .hint }
> The `onAfterAction_export` handler is called **every time** an export action
> runs — whether triggered by a button click or called programmatically via
> `myForm.actions.export()`.  If you only want to submit on user-initiated
> exports, check `ev.origin` (the trigger component) and skip when it is `null`
> (programmatic call).

{: .info }
> If you need to prevent the export from running at all (e.g. to display inline
> errors), use `onBeforeAction_export` and call `ev.preventDefault()`.  Keep in
> mind that **validation is not yet built into SmarkForm** — any validation
> logic must be written in your own `BeforeAction_export` handler.

### Intercepting an import to fetch data asynchronously

When the user triggers an `import` action (e.g. by clicking a "Load" button),
`ev.data` is typically `undefined` — the button itself has no data to supply.
Use `BeforeAction_import` to asynchronously fetch data and inject it:

```javascript
myForm.on("BeforeAction_import", async (ev) => {
    ev.preventDefault(); // Cancel the default (no-op) import
    const response = await fetch("/api/load");
    const data = await response.json();
    await myForm.actions.import(data); // Trigger a new import with the fetched data
});
```

{: .hint }
> `ev.data` *can* be defined when an import trigger has a `source` property
> pointing to another component — for example, the duplication flow in the
> [Showcase]({{ "/about/showcase" | relative_url }}#item-duplication-and-closure-state)
> uses `source` to copy data from a sibling component into the newly added item.
> In that case `ev.data` already contains the source component's exported value.

### Modifying exported data before it leaves

To post-process or sanitize exported data (e.g. strip internal fields, add
metadata), use `AfterAction_export`:

```javascript
myForm.on("AfterAction_export", (ev) => {
    // Add a timestamp before forwarding the data
    ev.data = { ...ev.data, savedAt: new Date().toISOString() };
});
```

{: .warning }
> Mutating `ev.data` in `AfterAction_export` does **not** affect what was
> already written into an `editor` textarea or other target — the target was
> written during the action itself. The mutation only affects subsequent
> handlers and callers that read the event object.


## Implementation Details

{: .info }
> This section describes internal implementation details. You don't need to
> read it to use SmarkForm events — it is aimed at contributors or developers
> who want to extend or debug the event system.

### The `@action` decorator

Every action method on a SmarkForm component is wrapped by the `@action`
decorator at class-definition time (defined in `src/lib/field.js`, applied in
`src/types/trigger.type.js` and each component type). The decorator registers
a wrapper in `this.actions[name]` that:

1. Defaults `options.focus = true` (unless already set), so trigger-initiated
   calls auto-focus.
2. Sets `options.data = data` so `BeforeAction` handlers can read or modify it.
3. Emits `BeforeAction_<name>` (skipped if `options.silent`). Handlers can call
   `ev.preventDefault()` to cancel.
4. Re-reads `data` from `options.data` after `BeforeAction` (handlers may
   have replaced it).
5. Calls the raw prototype method.
6. Emits `AfterAction_<name>` (skipped if `options.silent`), with `ev.data`
   set to the return value.

### Calling actions programmatically

There are two ways to invoke an action in JavaScript:

- **`component.actions.reset(data, options)`** — goes through the `@action`
  wrapper: fires events, defaults `focus`, honours `silent`, etc.
- **`component.reset(data, options)`** — calls the **prototype method
  directly**, bypassing the wrapper entirely (no events, no automatic `focus`
  defaulting, no `BeforeAction` cancellation).

Most internal calls (e.g. from `import()` or `removeItem()`) use the prototype
method directly to avoid overhead and event noise.

### Event bubbling: local vs. all

Events are stored in two separate maps per component:

- `sym_local_events` — handlers registered via `onLocal()`
- `sym_all_events` — handlers registered via `onAll()` / `on()`

When an event fires on a component, its **local** handlers run first; then the
event bubbles up the component tree and each ancestor's **all** handlers are
invoked. This mirrors DOM event bubbling but at the SmarkForm component level.

Event handling is implemented in `src/lib/events.js`.
