---
title: "«trigger» Component Type"
layout: chapter
description: "Resolve action contexts and targets for SmarkForm triggers, including relative paths, list-item behavior, and wildcard dispatch."
permalink: "/component_reference/trigger"
nav_order: 16
redirect_from:
  - "/component_types/type_trigger"
---

{% include links.md %}
{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary><strong>📖 Table of Contents</strong></summary>

  {% include chaptertoc/trigger.html depth=3 %}

</details>

## Introduction

A **trigger** is a SmarkForm component with an `action` option. A click or a
configured hotkey invokes that action. The trigger's **context** identifies the
component that handles the action; some actions also use a separate **target**.

Actions can also be called through the component API. A programmatic action call
has no trigger origin.

## Component model

Triggers are components, but not fields: they do not export values or count as
steps in a path. A simplified tree might look like this:

- Root form
  - `profile` form
    - `name` input
    - `clear` trigger
  - `pets` list
    - item `0` form
      - `species` input
      - `remove` trigger

Here, `clear` can use `profile` as its natural context. The `remove` trigger's
natural context is the `pets` list, and its placement identifies item `0` as the
target.

## Options

Trigger options can be set in a JSON `data-smark` value or with supported
`data-smark-*` attributes such as `data-smark-action`. The `action` option is
required; other action-specific options are forwarded to the action handler.

### action

The action to invoke, such as `"clear"`, `"export"`, or `"removeItem"`.

- **Type:** string
- **Required:** yes
- **Type inference:** `action` makes the component a trigger, so an explicit
  `"type":"trigger"` is usually unnecessary.

Action identifiers retain their documented spelling (`addItem`, not
`add_item`); they are values, not option names.

### context

The component that receives the action. If omitted, SmarkForm chooses the
**natural context**: the nearest ancestor component that implements the action.

When provided, `context` is a path resolved from the trigger's **enclosing field
component**. Triggers and labels are not path nodes. An absolute path beginning
with `/` starts at the root form; a relative path starts from the enclosing
field. The resolved component must implement the action—SmarkForm does not fall
back to a different ancestor when an explicit path selects the wrong component.

### target

An optional component involved in an action. A supplied `target` is a path
resolved **from the effective context**, not from the trigger's position. An
absolute target path starts at the root form; a relative target path starts at
the context.

When context is inferred naturally, SmarkForm can infer a target from the
trigger's placement. For example, a `removeItem` trigger inside a list item
targets that item. With an explicit `context`, placement does not infer a
target; if `target` is omitted, the action's own default applies.

### hotkey

The key used to activate the trigger while the user holds `Ctrl` and focus is
within the trigger's context.

- **Type:** a `KeyboardEvent.key` value
- **Default:** no hotkey

See [Hotkeys]({{ "/accessibility/hotkeys" | relative_url }}) for activation and
conflict details.

## Resolve the context

### Natural context

Without a `context` option, SmarkForm walks up from the trigger's enclosing
field component and uses the first ancestor that implements the requested
action. This usually lets you place a trigger inside the form, list, or item it
should affect without writing a path.

```html
<fieldset data-smark='{"type":"form","name":"profile"}'>
  <input name="name" data-smark>
  <button data-smark-action="clear">Clear profile</button>
</fieldset>
```

The `clear` trigger uses `profile`, the nearest ancestor that implements
`clear`. In a list item, a `removeItem` trigger naturally resolves to the list.

### Explicit context

Use `context` when the trigger is not inside the component that should handle
the action, or when you want to make that choice explicit:

```html
<div id="myForm">
  <fieldset data-smark='{"type":"form","name":"profile"}'>
    <input name="name" data-smark>
  </fieldset>
  <button data-smark='{"action":"clear","context":"profile"}'>
    Clear profile
  </button>
</div>
```

The button is a child of the root form, so the relative path `profile` selects
that named subform. From inside a nested field, use a relative path such as
`../profile`; use `/profile` to resolve from the root regardless of placement.

## Resolve the target

Context answers **which component performs the action**. Target answers **which
component the action acts on or exchanges data with**. The target path always
starts from the resolved context (unless it begins with `/`).

For example, if `billing` and `shipping` are sibling forms, a trigger at the
root can copy the billing value into shipping like this:

```html
<button data-smark='{"action":"export","context":"billing","target":"../shipping"}'>
  Copy billing to shipping
</button>
```

The context path `billing` is resolved from the trigger's enclosing field—the
root. The target path `../shipping` is then resolved from `billing`, moving up
to its parent before selecting the sibling `shipping` form. Using
`"target":"shipping"` would instead look for a child of `billing` named
`shipping`.

### Import and export direction

When an action uses a target, import and export copy in opposite directions:

| Action | Data flow |
|---|---|
| `export` with `target` | Export the context, then import that value into the target. |
| `import` with `target` | Export the target, then import that value into the context. |

The target component must support the corresponding import/export operation.
Keep target paths valid; missing targets are not a universal trigger error and
the resulting behavior depends on the action.

### List-item targets

List actions use the target to select an item. A remove trigger inside an item
can rely on natural context and target resolution:

```html
<ul data-smark='{"type":"list","name":"pets"}'>
  <li>
    <input name="name" data-smark>
    <button data-smark-action="removeItem">Remove this pet</button>
  </li>
</ul>
```

The nearest ancestor implementing `removeItem` is the `pets` list; the trigger's
placement identifies the containing item. An `addItem` trigger outside the list
can use `{"action":"addItem","context":"pets"}`; with no target, the list
appends an item by default. List-specific `position`, `min_items`, and
`max_items` behavior is covered in the [List reference]({{ "/component_reference/list" | relative_url }}).

## Try contexts and targets

This runnable form combines a cross-field copy with list-item actions. All
trigger paths are relative so the example also works when the playground wraps
it in its editor subform.

{% raw %}<!-- trigger_context_target_html {{{ -->{% endraw %}
{% capture trigger_context_target_html -%}
<div id="myForm$$">
  <fieldset data-smark='{"type":"form","name":"billing"}'>
    <legend>Billing</legend>
    <label data-smark>Address</label>
    <input name="address" data-smark>
  </fieldset>
  <fieldset data-smark='{"type":"form","name":"shipping"}'>
    <legend>Shipping</legend>
    <label data-smark>Address</label>
    <input name="address" data-smark>
  </fieldset>
  <button data-smark='{"action":"export","context":"billing","target":"../shipping"}'>
    Copy billing to shipping
  </button>
  <fieldset>
    <legend>Pets</legend>
    <ul data-smark='{"type":"list","name":"pets","min_items":0,"max_items":4}'>
      <li>
        <label data-smark>Name</label>
        <input name="name" data-smark>
        <button data-smark-action="removeItem">Remove this pet</button>
      </li>
    </ul>
    <button data-smark='{"action":"addItem","context":"pets"}'>Add pet</button>
  </fieldset>
</div>{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- trigger_context_target_js {{{ -->{% endraw %}
{% capture trigger_context_target_js -%}
// Every control in this example uses a declarative SmarkForm action.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- trigger_context_target_notes {{{ -->{% endraw %}
{% capture trigger_context_target_notes -%}
**Try it:** Click **Copy billing to shipping**. `export` copies from the billing
context into its sibling target. Add or remove pets: the outside add trigger
uses explicit context, while each item-level remove trigger uses natural context
and placement to identify its target.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- trigger_context_target_demoValue {{{ -->{% endraw %}
{% capture trigger_context_target_demoValue -%}
{
  "billing": { "address": "42 Analytical Engine Way" },
  "shipping": { "address": "18 St James's Square" },
  "pets": [{ "name": "Ada" }, { "name": "Babbage" }]
}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="trigger_context_target"
    htmlSource=trigger_context_target_html
    jsSource=trigger_context_target_js
    notes=trigger_context_target_notes
    demoValue=trigger_context_target_demoValue
    showEditor=true
    tests=false
    minHeight=35
%}

## Wildcard contexts

A wildcard in `context` can match multiple components. SmarkForm dispatches the
action sequentially to each match that implements it and silently skips matches
that do not. If there are no eligible matches, the trigger is a no-op.

```html
<!-- Add an item to each direct child list that implements addItem. -->
<button data-smark='{"action":"addItem","context":"*"}'>Add to all lists</button>
```

When a wildcard context and a target path are both used, SmarkForm resolves the
target separately from each matched context. A wildcard `target` is
action-specific; for example, `removeItem` can remove multiple list items.
See [Form Traversing — Wildcard Context Multi-Dispatch]({{ "/guides/form_traversing" | relative_url }}#wildcard-context-multi-dispatch)
for a complete example.

## Errors and edge cases

- An explicit context that does not implement the requested action does not
  fall back to a parent. The action fails with `UNKNOWN_ACTION` when the trigger
  is activated.
- If no ancestor implements the action and no explicit context is given, the
  trigger also fails with `UNKNOWN_ACTION` when activated.
- A target path that does not resolve is not converted into `UNKNOWN_ACTION`;
  target-copy behavior depends on the action. For example, an `export` without
  a resolved destination cannot copy into that target, while an `import`
  trigger without explicit data may pass `undefined` to the context's import
  behavior. Validate target paths rather than relying on a missing target.
- Wildcard context dispatch filters out components that do not implement the
  action; no-match wildcards do not raise `UNKNOWN_ACTION`.
- Triggers and labels are not fields and do not count as path segments. A path
  from a trigger is resolved as though it started from the trigger's enclosing
  field component.

See [Form Traversing]({{ "/guides/form_traversing" | relative_url }}) for the
complete path syntax, wildcard matching, and component lookup behavior.

## Interactions

Triggers are activated by click. A configured `hotkey` can also activate the
trigger with `Ctrl` plus the specified key while focus is inside its context.

### Hot Keys

Holding `Ctrl` reveals active hotkeys by setting `data-hotkey` on eligible
trigger buttons. Use CSS to display a visual hint. See the
[Hotkeys guide]({{ "/accessibility/hotkeys" | relative_url }}) for the full
keyboard behavior.

## Origin

The origin is the trigger component that invoked an action. Programmatic calls
such as `myForm.export()` do not supply a trigger origin. An action method
receives it as `options.origin`; the corresponding lifecycle event exposes it
as `event.origin`. For programmatic calls, that property is unset. Wait for
`myForm.rendered` before using `find()` on descendants; see [Form Traversing]({{ "/guides/form_traversing" | relative_url }}).

## Trigger Components

Any SmarkForm component with an `action` option is a trigger. The library infers
the trigger type and removes its name from the data tree; triggers therefore do
not become object properties or list values.
