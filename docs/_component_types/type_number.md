---
title: «number» Component Type
layout: chapter
permalink: /component_types/type_number
nav_order: 4

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

The `number` component type extends the [Input](/component_types/type_input) component type, providing additional sanitation (when importing) and formatting (when exporting).

- **Imports and Exports:** `Number`
- **Singleton Pattern:** Implements the [Singleton Pattern](/component_types/type_input#the-singleton-pattern)
- **Data Conversion:** Converts inappropriate types (like `String`) to `Number` on the fly.

## Usage

To use the `number` component type, ensure that the target field is an `INPUT` element of type `number`. If the type attribute is not specified, it will be set to `number` automatically.

**Example:**

```html
<!-- Example of number input field -->
<input type="number" data-smark='{"name":"age"}' placeholder="Enter your age">
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
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * {{ site.data.definitions.actions.options.target_export }}
  * **data:**

#### (Async) import (Action)

Imports a value into the number input field. If the value is not a valid number or string that can be converted to a number, it sets the field to null.

##### Options (import)

  * **action:** (= "import")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * {{ site.data.definitions.actions.options.target_import }}
  * **data:** (number or string)
  * **focus:** (boolean, default true)

#### (Async) clear (Action)

Clears the value of the number input field (sets it to null).

##### Options (clear)

  * **action:** (= "clear")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}


