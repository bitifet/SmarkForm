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
* [Listening to Events](#listening-to-events)
    * [Action Events](#action-events)
    * [Scope: Local vs. All](#scope-local-vs-all)
    * [Registering Handlers via Options](#registering-handlers-via-options)
* [Action Event Reference](#action-event-reference)
    * [BeforeAction events](#beforeaction-events)
    * [AfterAction events](#afteraction-events)
* [Common Patterns](#common-patterns)
    * [Submitting form data to a backend](#submitting-form-data-to-a-backend)
    * [Intercepting an import to fetch data asynchronously](#intercepting-an-import-to-fetch-data-asynchronously)
    * [Modifying exported data before it leaves](#modifying-exported-data-before-it-leaves)
* [DOM / Field Events](#dom--field-events)
* [Implementation Details](#implementation-details)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


## Overview

SmarkForm components emit events before and after every action (import, export,
add, remove, etc.). You can listen to these events to react to user interactions
— for example, to send data to a server after an export, or to pre-populate a
form before it is shown.

Events are attached to a **component** (usually the root `SmarkForm` instance)
using the `.on()` method. Event names are strings such as `"AfterAction_export"`
or `"BeforeAction_import"`.

```javascript
const myForm = new SmarkForm(document.getElementById("myForm"));

myForm.on("AfterAction_export", ({ data }) => {
    console.log("Exported:", data);
});
```

{: .hint :}
> Event names are **case-insensitive** for the `Before`/`After` prefix and
> action name. `"afterAction_export"` and `"AfterAction_export"` both work.


## Listening to Events

### Action Events

Action events fire around every action performed on a SmarkForm component. The
event name follows the pattern:

```
BeforeAction_<actionName>
AfterAction_<actionName>
```

Where `<actionName>` is the action's name (e.g. `import`, `export`, `addItem`,
`removeItem`, `reset`, `clear`, …).

The event object passed to your handler contains:

| Property | Description |
|----------|-------------|
| `data` | The data associated with the action (can be read or replaced in `BeforeAction`) |
| `context` | The component the action was triggered on |
| `origin` | The trigger element (button), if triggered by a user interaction |
| `preventDefault()` | Call to cancel the action (only in `BeforeAction`) |

### Scope: Local vs. All

There are two listening scopes:

- **`on(evt, handler)`** — alias for `onAll`: fires whenever **any** descendant
  (or the component itself) performs the action.
- **`onLocal(evt, handler)`** — fires only when **that specific component**
  performs the action, not its descendants.

```javascript
// Fires for any export in the whole form tree:
myForm.on("AfterAction_export", handler);

// Fires only when myForm itself is exported, not nested subforms:
myForm.onLocal("AfterAction_export", handler);
```

### Registering Handlers via Options

Event handlers can also be registered by passing them directly as options to
the `SmarkForm` constructor (useful when you want to couple initialization and
event listening):

```javascript
const myForm = new SmarkForm(document.getElementById("myForm"), {
    onAfterAction_export({ data }) {
        sendToServer(data);
    },
});
```

The option key must start with `on` followed by the event name (case-insensitive
`Before`/`After` prefix is supported). These are registered as **local** handlers
on the root component.


## Action Event Reference

### BeforeAction events

`BeforeAction_<name>` fires **before** the action executes. You can:

- Read the incoming `data` from `event.data`
- Replace `data` by assigning to `event.data`
- Cancel the action entirely with `event.preventDefault()`

```javascript
myForm.on("BeforeAction_import", (event) => {
    if (!event.data) {
        event.preventDefault(); // Don't import if no data
    }
});
```

### AfterAction events

`AfterAction_<name>` fires **after** the action completes. The `event.data`
property contains the value returned by the action (for `export`, it is the
exported JSON object; for others it may be `undefined`).

```javascript
myForm.on("AfterAction_export", ({ data }) => {
    fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
});
```


## Common Patterns

### Submitting form data to a backend

The most common use case is sending the exported form data to a server when the
user clicks a "Save" or "Submit" button. Wire a trigger button to the `export`
action and handle the result in `AfterAction_export`:

```html
<button data-smark='{"action":"export"}'>💾 Save</button>
```

```javascript
myForm.on("AfterAction_export", async ({ data }) => {
    const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (response.ok) alert("Saved!");
});
```

### Intercepting an import to fetch data asynchronously

When the user triggers an `import` action (e.g. by clicking a "Load" button),
`data` is typically `undefined` — the button itself has no data to supply.
Use `BeforeAction_import` to asynchronously fetch data and then inject it:

```javascript
myForm.on("BeforeAction_import", async (event) => {
    event.preventDefault(); // Cancel the default (no-op) import
    const response = await fetch("/api/load");
    const data = await response.json();
    await myForm.actions.import(data); // Trigger a new import with the fetched data
});
```

{: .hint :}
> `data` *can* be defined when an import trigger has a `source` property
> pointing to another component — for example, the duplication flow in the
> [Showcase]({{ "/about/showcase" | relative_url }}#item-duplication-and-closure-state)
> uses `source` to copy data from a sibling component into the newly added item.
> In that case `event.data` already contains the source component's exported
> value.

### Modifying exported data before it leaves

To post-process or sanitize exported data (e.g. strip internal fields, add
metadata), use `AfterAction_export`:

```javascript
myForm.on("AfterAction_export", (event) => {
    // Add a timestamp before forwarding the data
    event.data = { ...event.data, savedAt: new Date().toISOString() };
});
```

{: .warning :}
> Mutating `event.data` in `AfterAction_export` does **not** affect what was
> already written into an `editor` textarea or other target — the target was
> already written during the action. The mutation only affects subsequent
> handlers and callers that read the event object.


## DOM / Field Events

In addition to action events, SmarkForm re-emits native DOM events (`focus`,
`blur`, `input`, `change`, `click`, `keydown`, …) from the root form so you can
listen to them centrally:

```javascript
myForm.on("focus", ({ context, originalEvent }) => {
    console.log("Focused component:", context);
});

myForm.on("input", ({ context, originalEvent }) => {
    console.log("Input in:", context);
});
```

The event object includes a `context` property pointing to the SmarkForm
component that owns the focused/changed element, and `originalEvent` for the raw
DOM event.


## Implementation Details

{: .info :}
> This section describes internal implementation details. You don't need to
> read it to use SmarkForm events — it is aimed at contributors or developers
> who want to extend or debug the event system.

### The `@action` decorator

Every action method on a SmarkForm component is wrapped by the `@action`
decorator at class-definition time. The decorator registers a wrapper in
`this.actions[name]` that:

1. Defaults `options.focus = true` (unless already set), so trigger-initiated
   calls auto-focus.
2. Sets `options.data = data` so `BeforeAction` handlers can read or modify it.
3. Emits `BeforeAction_<name>` (skipped if `options.silent`). Handlers can call
   `event.preventDefault()` to cancel.
4. Re-reads `data` from `options.data` after `BeforeAction` (handlers may
   have replaced it).
5. Calls the raw prototype method.
6. Emits `AfterAction_<name>` (skipped if `options.silent`), with `event.data`
   set to the return value.

The decorator is defined in `src/lib/field.js` and applied in each component
type that exposes actions.

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

