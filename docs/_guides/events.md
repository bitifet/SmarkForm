---
title: "Events"
layout: chapter
description: "Use SmarkForm lifecycle, field and action events to observe interactions and synchronize your application with form changes."
permalink: "/guides/events"
nav_order: 6
redirect_from:
  - "/advanced_concepts/events"
---


{% include links.md %}

{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {% include chaptertoc/events.html depth=3 %}

</details>


## Overview

SmarkForm provides an event model for action lifecycles and captured DOM field
events. Trigger-dispatched actions emit lifecycle events; direct calls to raw
methods such as `myForm.import(data)` or `myForm.export()` do not. A
programmatic field update may produce a DOM event only when that component's
implementation dispatches one (for example, masked inputs dispatch `input`).

Events fall into two categories:

- **Action lifecycle events** — fired before and after trigger-dispatched SmarkForm
  [action]({{ "/component_reference/trigger" | relative_url }}) (such
  as `export`, `import`, `clear`, `reset`, `addItem`, …).
- **DOM field events** — standard browser events (`input`, `change`, `focus`,
  `blur`, `click`, …) that are captured on the root form node and re-dispatched
  through SmarkForm's component tree so that handlers can be registered on any
  component regardless of actual DOM depth.

Both categories share the same registration API.


## Action Lifecycle Events

When a trigger dispatches an action, two events are emitted around it unless
the action is marked `silent`:

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
myForm.on("BeforeAction_export", async (ev) => {
    // validateApplicationForm is supplied by your application.
    if (!await validateApplicationForm(ev.context)) {
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
| `onAfterAction_<name>` | After the named action runs (local — fires on this component only) |
| `onBeforeAction_<name>` | Before the named action runs (local — fires on this component only) |
| `onLocal_<event>` | DOM or synthetic event, handled **only** on this component (never bubbles) |
| `on_<event>` | DOM or synthetic event, bubbles for events with `bubbles:true` metadata (DOM-like) |
| `onAll_<event>` | DOM or synthetic event, **always** bubbles regardless of metadata |

### Via the API (programmatic)

After construction you can register handlers using the component's methods:

```javascript
// DOM-like bubbling: bubbles only if the event's 'bubbles' metadata is true.
myForm.on("AfterAction_export", handler);

// Always bubbles (superset of .on()):
myForm.onAll("AfterAction_export", handler);

// Never bubbles — fires only when this component is the exact target:
myForm.onLocal("AfterAction_export", handler);
```

### Local vs. All handlers

| Method | Behaviour |
|---|---|
| `onLocal(evType, handler)` | Handler runs **only** when the event targets this component exactly. Never bubbles. |
| `on(evType, handler)` | Handler runs when the event targets this component, and also bubbles to ancestors for events whose `bubbles` metadata is `true` (DOM-like). |
| `onAll(evType, handler)` | Handler **always** bubbles, regardless of event metadata. |

The three methods differ only in how bubbling behaves:

- **`onLocal`** — "I only care about events on *this* component, never events from descendants."
- **`on`** — "I want DOM-like bubbling: events that don't bubble in the browser (`focus`, `blur`, `mouseenter`, `mouseleave`) also don't bubble in SmarkForm."
- **`onAll`** — "I want to see *every* event that touches this component or any of its descendants, regardless of the DOM event's bubbling behaviour."

{: .info }
> For synthetic SmarkForm events such as action lifecycle events
> (`BeforeAction_*`, `AfterAction_*`) and the focus-boundary events
> `focusenter` / `focusleave`, the `bubbles` flag defaults to `true`, so `.on()`
> and `.onAll()` behave identically for those events.

**Example — react to an export anywhere inside a sub-form:**

```javascript
const addressForm = myForm.find("address");
addressForm.on("AfterAction_export", (ev) => {
    console.log("Address exported:", ev.data);
});
```

**Scoping listeners to a specific field with `onRendered()` + `onLocal()`:**

In a form with multiple fields, `.on()` intercepts events from ALL children —
which might be too broad.  To limit a listener to a single field, wait for it
to render, `find()` it by path, then use `onLocal()` (target-phase only):

```javascript
myForm.onRendered(() => {
    const display = myForm.find("/display");
    display.onLocal("BeforeAction_import", async (ev) => {
        // Only fires for imports on /display, never on other fields
    });
});
```

This pattern is used in the [calculator example]({{ "/showcase_examples/showcase" | relative_url }}).


## DOM Field Events

SmarkForm listens for a fixed set of DOM events at the root form node (using
the capture phase) and re-emits them through the SmarkForm component tree.
This means you can register `input`, `change`, `focus`, etc. handlers on *any*
SmarkForm component, not just the one that contains the raw HTML input.

### Supported event types

- Keyboard: `keydown`, `keyup`, `keypress`
- Input: `beforeinput`, `input`, `change`
- Focus (DOM, do **not** bubble under `.on()`): `focus`, `blur`
- Focus (DOM, bubble under `.on()`): `focusin`, `focusout`
- Mouse (bubble under `.on()`): `click`, `dblclick`, `contextmenu`, `mousedown`, `mouseup`,
  `mousemove`, `mouseover`, `mouseout`
- Mouse (do **not** bubble under `.on()`): `mouseenter`, `mouseleave`

**Synthetic focus-boundary events** (not DOM events — emitted by SmarkForm automatically):

| Event | When emitted |
|---|---|
| `focusenter` | Focus moves from **outside** a component's subtree to **inside** it |
| `focusleave` | Focus moves from **inside** a component's subtree to **outside** it |

These events are available on **all** component types (scalar fields, forms,
lists). They bubble under `.on()` and `.onAll()`, and are available via
`.onLocal()` for the exact component that crossed the boundary.

**Example — sort a list when the user finishes editing it:**

```javascript
const schedule = myForm.find("schedule");
schedule.onLocal("focusleave", async () => {
    await schedule.sort();
});
```

{: .hint }
> When focus moves between two items *inside* the same list, the list itself
> does **not** receive `focusleave` / `focusenter` — only the items do.  The
> list's `focusleave` fires only when focus crosses the list boundary entirely.
> To observe all focus movements inside a list, use `.onAll("focusleave", ...)`.

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

{% raw %} <!-- events_submit_example {{{ --> {% endraw %}
{% capture events_submit_example_html -%}
<div id="myForm$$">
  <input data-smark type="text" name="firstName" placeholder="First name">
  <input data-smark type="text" name="lastName" placeholder="Last name">
  <button data-smark='{"action":"export"}'>Submit</button>
  <pre id="output" style="background:rgba(165,165,165,.25);padding:0.5em;margin-top:0.5em;min-height:2em;border:1px solid #ccc"></pre>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- events_submit_example_js {{{ --> {% endraw %}
{% capture events_submit_example_js -%}
myForm.on("AfterAction_export", async (ev) => {
    const payload = ev.data;  // Plain JSON-serialisable object
    // In a real app you would POST to your server:
    // const res = await fetch("/api/submit", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(payload),
    // });
    document.getElementById("output").textContent = JSON.stringify(payload, null, 2);
});
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="events_submit_example"
    htmlSource=events_submit_example_html
    jsSource=events_submit_example_js
    demoValue='{"firstName":"Alice","lastName":"Smith"}'
    tests=false
%}

{: .hint }
> The `onAfterAction_export` handler runs when a trigger-dispatched export
> completes. Direct calls to `myForm.export()` invoke the raw method and do not
> emit lifecycle events. For trigger-driven exports, `ev.origin` identifies the
> trigger component.

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
    await myForm.import(data); // Raw method: no second action lifecycle event
});
```

The initial trigger dispatch emits `BeforeAction_import`, which this handler
cancels. The subsequent direct `myForm.import(data)` updates the fields but does
not emit another `BeforeAction_import` / `AfterAction_import` pair.

{: .hint }
> `ev.data` *can* be defined when an import trigger has a `source` property
> pointing to another component — for example, the duplication flow in the
> [Showcase]({{ "/showcase_examples/showcase" | relative_url }})
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

Action methods are marked with the `@action` decorator defined in
`src/types/trigger.type.js`. Its per-instance initializer registers an action
dispatcher in `this.actions[name]`; triggers call this dispatcher. The public
prototype method itself remains a raw method. The dispatcher:

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

Component methods can be called directly via `component.actionName(data,
options)`. These raw prototype methods do not fire lifecycle events or apply the
trigger's default focus behavior. Use a trigger when you need the full action
lifecycle (`BeforeAction_*` / `AfterAction_*` events and trigger focus defaults).

### Event bubbling: local, on, and all

Events are stored in three separate maps per component:

- `sym_local_events` — handlers registered via `onLocal()`
- `sym_on_events` — handlers registered via `on()`
- `sym_all_events` — handlers registered via `onAll()`

When an event fires on a component, its **local**, **on**, and **all** handlers
run first (target phase); then the event bubbles up the component tree.  During
bubbling, **on** handlers run only if the event's `bubbles` metadata is `true`,
while **all** handlers always run.

Per-event `bubbles` metadata intentionally mirrors native DOM behaviour:

| Event | `bubbles` | DOM reference |
|---|---|---|
| `focus`, `blur` | `false` | Does not bubble in DOM |
| `mouseenter`, `mouseleave` | `false` | Does not bubble in DOM |
| `focusin`, `focusout`, `click`, `input`, `change`, … | `true` | Bubbles in DOM |
| `focusenter`, `focusleave` (synthetic) | `true` | N/A — SmarkForm-level boundary events |
| Action events (`BeforeAction_*`, `AfterAction_*`) | `true` | N/A |

Event handling is implemented in `src/lib/events.js`.

## Practical Example: Animated Task List

This task list uses `afterRender` to animate new rows into view and
`beforeUnrender` to keep removed rows in the DOM until their exit transition
finishes. Add a task, then remove one to see both lifecycle events in action.

{% raw %}<!-- events_animated_tasks_html {{{ -->{% endraw %}
{% capture events_animated_tasks_html -%}
<div id="myForm$$">
  <button data-smark='{"action":"addItem","context":"tasks"}' type="button">➕ Add task</button>
  <ul class="task-list" data-smark='{"type":"list","name":"tasks","min_items":1,"max_items":8}'>
    <li class="task-row">
      <label>
        <span data-smark='{"action":"position"}'>N</span>
        <input data-smark type="text" name="title" placeholder="Task description">
      </label>
      <select data-smark name="priority">
        <option value="Normal">Normal</option>
        <option value="High">High</option>
        <option value="Low">Low</option>
      </select>
      <button data-smark='{"action":"removeItem"}' type="button" title="Remove task">➖</button>
    </li>
  </ul>
</div>{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- events_animated_tasks_css {{{ -->{% endraw %}
{% capture events_animated_tasks_css -%}
{{""}}#myForm$$ .task-list { list-style: none; padding: 0; }
{{""}}#myForm$$ .task-row { display: flex; align-items: center; gap: .5rem; margin-block: .4rem; padding: .5rem; border: 1px solid #ccc; border-radius: .4rem; }
{{""}}#myForm$$ .task-row label { display: flex; align-items: center; gap: .5rem; flex: 1; }
{{""}}#myForm$$ .task-row input { flex: 1; min-width: 0; }
{{""}}#myForm$$ .task-row.task-entering { transform: translateX(-2rem); opacity: 0; transition: transform 220ms ease-out, opacity 220ms ease-out; }
{{""}}#myForm$$ .task-row.task-visible { transform: translateX(0); opacity: 1; }
{{""}}#myForm$$ .task-row.task-leaving { transform: translateX(1rem); opacity: 0; transition: transform 220ms ease-in, opacity 220ms ease-in; }
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- events_animated_tasks_js {{{ -->{% endraw %}
{% capture events_animated_tasks_js -%}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

myForm.onAll("afterRender", async (ev) => {
    if (ev.context.parent?.options.type !== "list") return;
    const row = ev.context.targetNode;
    row.classList.add("task-entering");
    await delay(1); // Let the browser paint the starting position first.
    row.classList.add("task-visible");
});

myForm.onAll("beforeUnrender", async (ev) => {
    if (ev.context.parent?.options.type !== "list") return;
    ev.context.targetNode.classList.remove("task-visible");
    ev.context.targetNode.classList.add("task-leaving");
    await delay(220); // Keep the row attached until its CSS transition ends.
});
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- events_animated_tasks_notes {{{ -->{% endraw %}
{% capture events_animated_tasks_notes -%}
Add and remove rows to see the transitions. `afterRender` runs after insertion,
so the handler adds the initial state, yields briefly, then applies the visible
state. `beforeUnrender` applies the exit state and returns a promise; SmarkForm
waits for that promise before removing the row.

The guard checks that the event target is a direct child of a list, so the
handlers apply to task rows rather than every component in the form.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- events_animated_tasks_demoValue {{{ -->{% endraw %}
{% capture events_animated_tasks_demoValue -%}
{"tasks":[{"title":"Confirm the picnic site","priority":"High"},{"title":"Send invitations","priority":"Normal"}]}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- events_animated_tasks_tests {{{ -->{% endraw %}
{% capture events_animated_tasks_tests -%}
export default async ({ expect, root, readField, writeField }) => {
    await expect(root).toBeVisible();
    await writeField('/', {tasks: [
        {title: 'Confirm the picnic site', priority: 'High'},
        {title: 'Send invitations', priority: 'Normal'},
    ]});

    await root.getByRole('button', {name: '➕ Add task'}).click();
    await root.locator('input[name="title"]').last().fill('Prepare the checklist');
    expect((await readField('/tasks')).map(task => task.title)).toEqual([
        'Confirm the picnic site', 'Send invitations', 'Prepare the checklist',
    ]);

    await root.getByTitle('Remove task').last().click();
    expect((await readField('/tasks')).map(task => task.title)).toEqual([
        'Confirm the picnic site', 'Send invitations',
    ]);
};
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="events-animated-tasks"
    htmlSource=events_animated_tasks_html
    cssSource=events_animated_tasks_css
    jsSource=events_animated_tasks_js
    notes=events_animated_tasks_notes
    demoValue=events_animated_tasks_demoValue
    showEditor=true
    selected="preview"
    tests=events_animated_tasks_tests
%}
