---
title: "«radio» Component Type"
layout: chapter
description: "Manage native radio groups as SmarkForm fields with shared DOM names, a selected-value export, and a nullable selection."
permalink: "/component_reference/radio"
nav_order: 10
redirect_from:
  - "/component_types/type_radio"
---


{% include links.md %}
{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {% include chaptertoc/type_radio.html %}

</details>

## Introduction

The `radio` component type extends the [Input](/component_reference/input) component type, providing enhanced functionality for radio button groups with automatic name management and special interaction behaviors.

- **Imports and Exports:** Selected radio button value (`String`) or `null` (when no selection)
- **Multiple instances:** The first SmarkForm radio with a given field name manages that group; later inputs delegate to it.
- **Data Conversion:** No data conversion is performed. The selected value is returned as a `String`.

Give each option a non-empty `value` to distinguish it from no selection. The
current export uses `null` for an empty-string radio value; a radio with no
`value` attribute uses the browser's default value (`"on"`).

## Usage

To use the `radio` component type, create multiple `INPUT` elements of type `radio` with the same `name` attribute. SmarkForm will automatically manage the grouping and provide enhanced functionality.

**Example:**

{% raw %} <!-- radio_group_example {{{ --> {% endraw %}
{% capture radio_group_example_html -%}
<div id="myForm$$">
  <fieldset>
    <legend>Gender:</legend>
    <label>
      <input type="radio" data-smark name="gender" value="male"> Male
    </label>
    <label>
      <input type="radio" data-smark name="gender" value="female"> Female
    </label>
    <label>
      <input type="radio" data-smark name="gender" value="other"> Other
    </label>
  </fieldset>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="radio_group_example"
    htmlSource=radio_group_example_html
    demoValue='{"gender":"female"}'
    showEditor=true
    tests=false
%}

## Radio Button Groups

SmarkForm groups radio inputs by their SmarkForm field name:

- **Master Selection:** The first radio button encountered with a given name becomes the "master" component
- **Automatic Naming:** SmarkForm replaces the native `name` with a generated shared name so the browser treats the inputs as one radio group.
- **Centralized Management:** The master component manages the state for the entire group
- **Slave Components:** Subsequent radio buttons with the same name become "slave" components that delegate to the master

This approach ensures that radio button groups work correctly while providing a unified API for data import/export operations.

## Special Interactions

The `radio` component provides enhanced user interaction capabilities beyond standard HTML radio buttons:

- **Click-to-Uncheck:** Clicking the selected radio again deselects it, allowing a `null` state.
- **Keyboard Support:** Pressing the `Delete` key when a radio button has focus will clear the selection
- **Consistent Behavior:** These interactions work across all radio buttons in the group, regardless of which specific button is interacted with

## Requirements

The radio component requires `<input type="radio">`; if `type` is omitted,
SmarkForm sets it to `radio`. A different type or a non-`<input>` target raises
a render error.


## API Reference

### Actions

{{ site.data.definitions.actions.intro }}

The `radio` component type supports the following actions:

#### (Async) export (Action)

Exports the value of the currently selected radio button in the group. Returns `null` if no radio button is selected.

##### Options (export)

  * **action:** (= "export")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * {{ site.data.definitions.actions.options.target_export }}
  * **data:**

#### (Async) import (Action)

Imports a value into the radio button group by selecting the radio button with the matching value. If no radio button has the specified value, all radio buttons in the group are deselected.

##### Options (import)

  * **action:** (= "import")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * {{ site.data.definitions.actions.options.target_import }}
  * **data:** (string matching a radio button's value attribute)
  * **focus:** (boolean, default true)

#### (Async) clear (Action)

Clears the selection from all radio buttons in the group.

##### Options (clear)

  * **action:** (= "clear")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}


#### (Async) reset (Action)

Reverts the radio group to its configured default selection. If no default was configured, all radio buttons are deselected (same as `clear`).

The group's reliable default source is a value imported by its enclosing Form
or List. The radio import method treats `undefined` as `null` and does not
maintain a per-field default, so a direct radio-field `reset()` deselects the
group rather than restoring a field-level `value` default; initialization's
first reset also means a field-local default selection is not applied. A parent
Form reset that imports an explicit group value still selects the matching
radio. No focused regression test covers this case; see the Step 14 transfer
map.

##### Options (reset)

  * **action:** (= "reset")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
