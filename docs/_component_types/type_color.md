---
title: «color» Component Type
layout: chapter
permalink: /component_types/type_color
nav_order: 5

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
* [Validations](#validations)
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

The `color` component type extends the [Input](/component_types/type_input)
component type.

Since the native HTML *type=color* input field also returns a string and
already ensures that the value is a valid #RRGGBB hexadecimal color string, the
`color` component type wouldn't had been necessary since we could have used the
`input` component type.

But native HTML color input fields does not allow even empty string so, if we
receive a `#000000` value, we cannot tell if the user has intentionally
selected the black color or if he just didn't select any color at all.

The `color` component type, on the other hand, allows the user to clear the color field by setting it to null.


- **Imports and Exports:** `String` (Valid "#RRGGBB" Hex value) or null (when not selected).
- **Singleton Pattern:** Implements the [Singleton Pattern](/component_types/type_input#the-singleton-pattern).
- **Data Conversion:** None, but accepts null as value.

## Usage


**Example:**

```html
<span data-smark='{"type":"color", "name":"myColor"}'>
    <input data-smark>
    <button data-smark='{"action":"clear"}'>❌ Reset</button>
</span>
```

## Validations

The number component will throw an error if the target field is not an INPUT element of type number.

## API Reference

### Actions

{{ site.data.definitions.actions.intro }}

The `number` component type supports the following actions:


#### (Async) export (Action)

Exports the value of the number input field. If the value is not a valid number, it returns null.

##### Options (export)

  * **action:** (= "export")
  * {{ site.data.definitions.actions.origin }}
  * {{ site.data.definitions.actions.context }}
  * {{ site.data.definitions.actions.target_export }}
  * **data:**

#### (Async) import (Action)

Imports a value into the number input field. If the value is not a valid number or string that can be converted to a number, it sets the field to null.

##### Options (import)

  * **action:** (= "import")
  * {{ site.data.definitions.actions.origin }}
  * {{ site.data.definitions.actions.context }}
  * {{ site.data.definitions.actions.target_import }}
  * **data:** (number or string)
  * **focus:** (boolean, default true)

#### (Async) clear (Action)

Clears the value of the number input field (sets it to null).

##### Options (clear)

  * **action:** (= "clear")
  * {{ site.data.definitions.actions.origin }}
  * {{ site.data.definitions.actions.context }}




