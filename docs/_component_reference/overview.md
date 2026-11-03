---
title: "Component Types Overview"
layout: chapter
description: "Map SmarkForm's built-in component types to their roles, value shapes and detailed references."
permalink: "/component_reference/overview"
nav_order: 1
redirect_from:
  - "/getting_started/core_component_types"
---

{% include links.md %}
{% include components/sampletabs_ctrl.md %}

# {{ page.title }} {#core-component-types}

SmarkForm enhances the HTML you author into a component tree. Forms represent
objects, lists represent arrays, and fields provide values at the leaves. A
trigger invokes an action on a component; a label associates text with a field
or component. The pages below describe each type's options and behavior.

<details class="chaptertoc">
<summary><strong>📖 Table of Contents</strong></summary>

  {% include chaptertoc/overview.html depth=3 %}

</details>

## Complex field types {#complex-field-types}

| Type | Role | Value shape | Reference |
|---|---|---|---|
| `form` | Groups named child components | JSON object | [Form]({{ "/component_reference/form" | relative_url }}) |
| `list` | Repeats an item template | JSON array | [List]({{ "/component_reference/list" | relative_url }}) |

## Scalar field types {#scalar-field-types}

Scalar types wrap native controls and normalize their values for import/export.
Use the detailed references for accepted inputs, empty values, and options.

### Input controls {#type-input}

| Type | Typical elements | Value shape | Reference |
|---|---|---|---|
| `input` | `<input>`, `<textarea>`, `<select>` | Usually a string; checkboxes export booleans; `format:"json"` parses JSON text | [Input]({{ "/component_reference/input" | relative_url }}) |
| `radio` | A group of `<input type="radio">` elements | Selected value or `null` | [Radio]({{ "/component_reference/radio" | relative_url }}) |

A native `<select>` is handled by `input`; it is not a separate built-in
component type. Dynamic remote options are a separate proposal, not implemented;
see [Select]({{ "/component_reference/select" | relative_url }}) and [The API
Interface (planned)]({{ "/guides/the_api_interface" | relative_url }}).

### Number and date/time fields {#type-number-and-type-date}

| Type | Native element | Export shape | Reference |
|---|---|---|---|
| `number` | `<input type="number">` | Number or `null` | [Number]({{ "/component_reference/number" | relative_url }}) |
| `date` | `<input type="date">` | ISO date string or `null` | [Date]({{ "/component_reference/date" | relative_url }}) |
| `time` | `<input type="time">` | `HH:mm:ss` string or `null` | [Time]({{ "/component_reference/time" | relative_url }}) |
| `datetime-local` | `<input type="datetime-local">` | Local date-time string or `null` | [DateTime-Local]({{ "/component_reference/datetime-local" | relative_url }}) |

### Color fields {#type-color}

| Type | Native element | Export shape | Reference |
|---|---|---|---|
| `color` | `<input type="color">` | Hex string or `null` | [Color]({{ "/component_reference/color" | relative_url }}) |

### File and media fields

These fields embed their selected bytes in the form value. They export a
self-describing data URL by default, or a structured object with
`format:"json"`; an empty field exports `null`.

| Type | Native element | Specialization | Reference |
|---|---|---|---|
| `file` | Explicit `type:"file"` on an input or singleton | Whole-file picker, drop, paste and download | [File]({{ "/component_reference/file" | relative_url }}) |
| `image` | `<img>` (inferred) or singleton | Decode validation and optional resize/format conversion | [Image]({{ "/component_reference/image" | relative_url }}) |
| `video` | `<video>` (inferred) or singleton | Native playback plus picker and size validation | [Video]({{ "/component_reference/video" | relative_url }}) |
| `audio` | `<audio>` (inferred) or singleton | Native playback plus picker and size validation | [Audio]({{ "/component_reference/audio" | relative_url }}) |

## Non-field component types {#non-field-component-types}

### Trigger {#type-trigger}

A trigger connects a button or other element to an action such as `clear`,
`export`, `addItem`, or a registered custom action. See
[Trigger]({{ "/component_reference/trigger" | relative_url }}).

### Label {#type-label}

A label associates native label text with a field or uses a non-native element
to label a complex component. See [Label]({{ "/component_reference/label" | relative_url }})
and [Accessible Labels and Names]({{ "/accessibility/accessible_labels_and_names" | relative_url }}).

## Singleton Pattern {#the-singleton-pattern}

A scalar field can use a non-field wrapper containing exactly one unnamed
native field, with labels and triggers alongside it. This keeps the exported
data tree scalar while allowing richer markup. See the [Singleton Pattern
guide]({{ "/guides/the_singleton_pattern" | relative_url }}).

## A small component tree

The form below maps a project and its tasks to a nested object and array. The
`demoValue` populates the example; choose **Show JSON** to inspect the exported
shape. Use the controls to see how the list changes.

{% raw %}<!-- component_tree_overview_html {{{ -->{% endraw %}
{% capture component_tree_overview_html -%}
<div id="myForm$$">
  <p>
    <label data-smark>Project:</label>
    <input name="project" data-smark type="text">
  </p>
  <fieldset>
    <legend>Tasks</legend>
    <ul data-smark='{"type":"list","name":"tasks","of":"form","min_items":0}'>
      <li>
        <label data-smark>Task:</label>
        <input name="title" data-smark type="text">
        <button data-smark='{"action":"removeItem"}' type="button">Remove</button>
      </li>
    </ul>
    <button data-smark='{"action":"addItem","context":"tasks"}' type="button">Add task</button>
  </fieldset>
  <button data-smark='{"action":"export"}' type="button">Show JSON</button>
  <pre data-export aria-live="polite">Exported data appears here.</pre>
</div>{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- component_tree_overview_js {{{ -->{% endraw %}
{% capture component_tree_overview_js -%}
const output = myForm.targetNode.querySelector("[data-export]");
myForm.on("AfterAction_export", (ev) => {
  output.textContent = JSON.stringify(ev.data, null, 2);
});
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- component_tree_overview_notes {{{ -->{% endraw %}
{% capture component_tree_overview_notes -%}
**Try it:** Edit the project or task names, add or remove a task, then choose
**Show JSON**. The output shows a form object containing a `tasks` array of
item objects.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- component_tree_overview_demoValue {{{ -->{% endraw %}
{% capture component_tree_overview_demoValue -%}
{
  "project": "Website refresh",
  "tasks": [
    {"title": "Gather requirements"},
    {"title": "Build the form"}
  ]
}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="component_tree_overview"
    htmlSource=component_tree_overview_html
    jsSource=component_tree_overview_js
    notes=component_tree_overview_notes
    demoValue=component_tree_overview_demoValue
    showEditor=true
    tests=false
    minHeight=40
%}

## Quick reference

The [Developer Cheatsheet]({{ "/component_reference/cheatsheet" | relative_url }})
collects common constructor options, component syntax, actions, paths, events,
methods, and patterns in one place. Use the linked type references for complete
options and edge cases.
