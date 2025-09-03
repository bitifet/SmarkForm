---
title: «radio» Component Type
layout: chapter
permalink: /component_types/type_radio
nav_order: 8

---

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Introduction](#introduction)
* [Usage](#usage)
* [Radio Button Groups](#radio-button-groups)
* [Special Interactions](#special-interactions)
* [Requirements](#requirements)
* [API Reference](#api-reference)
    * [Actions](#actions)
        * [(Async) export (Action)](#async-export-action)
            * [Options (export)](#options-export)
        * [(Async) import (Action)](#async-import-action)
            * [Options (import)](#options-import)
        * [(Async) clear (Action)](#async-clear-action)
            * [Options (clear)](#options-clear)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>

## Introduction

The `radio` component type extends the [Input](/component_types/type_input) component type, providing enhanced functionality for radio button groups with automatic name management and special interaction behaviors.

- **Imports and Exports:** Selected radio button value (`String`) or `null` (when no selection)
- **Multiple instances:** Implements a master-slave pattern where the first radio button in a group becomes the master
- **Data Conversion:** No data conversion is performed. The selected value is returned as a `String`.

## Usage

To use the `radio` component type, create multiple `INPUT` elements of type `radio` with the same `name` attribute. SmarkForm will automatically manage the grouping and provide enhanced functionality.

**Example:**

```html
<!-- Radio button group for gender selection -->
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
```

## Radio Button Groups

The `radio` component implements a sophisticated grouping mechanism:

- **Master Selection:** The first radio button encountered with a given name becomes the "master" component
- **Automatic Naming:** All radio buttons in the group receive a unique shared `name` attribute for proper DOM behavior
- **Centralized Management:** The master component manages the state for the entire group
- **Slave Components:** Subsequent radio buttons with the same name become "slave" components that delegate to the master

This approach ensures that radio button groups work correctly while providing a unified API for data import/export operations.

## Special Interactions

The `radio` component provides enhanced user interaction capabilities beyond standard HTML radio buttons:

- **Click-to-Uncheck:** Clicking on an already selected radio button will deselect it, allowing for "no selection" states
- **Keyboard Support:** Pressing the `Delete` key when a radio button has focus will clear the selection
- **Consistent Behavior:** These interactions work across all radio buttons in the group, regardless of which specific button is interacted with

## Requirements

The radio component will throw an error if the target field is not an INPUT element or its type is explicitly defined and different to "radio".


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
