---
title: «input» Component Type
layout: chapter
permalink: /component_types/type_input
nav_order: 3

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
* [API Reference](#api-reference)
    * [Actions](#actions)
        * [(Async) export (Action)](#async-export-action)
            * [Options (export)](#options-export)
        * [(Async) import (Action)](#async-import-action)
            * [Options (import)](#options-import)
        * [(Async) clear (Action)](#async-clear-action)
            * [Options (clear)](#options-clear)
        * [(Async) reset (Action)](#async-reset-action)
            * [Options (reset)](#options-reset)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>

## Introduction

The `input` component type is a fundamental building block for form elements in SmarkForm. It allows you to create and manage various types of input fields within your forms.

- **Imports and Exports:** `String`
- **Singleton Pattern:** Implements the [Singleton Pattern](/getting_started/core_component_types#the-singleton-pattern)
- **Data Conversion:** No data conversion is performed. The value is returned as a `String`.


## Usage

To use the `input` component type, simply add the `data-smark` attribute to your input elements. The type of input can be specified within the `data-smark` attribute.

**Example:**

```html
<!-- Example of text input field -->
<input type="text" data-smark='{"name":"username"}' placeholder="Enter your username">
```



## API Reference

### Actions

{{ site.data.definitions.actions.intro }}

The `input` component type supports the following actions:


#### (Async) export (Action)

Exports the value of the input field.

##### Options (export)

  * **action:** (= "export")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * {{ site.data.definitions.actions.options.target_export }}
  * **data:**

#### (Async) import (Action)

Imports a value into the input field.

##### Options (import)

  * **action:** (= "import")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * {{ site.data.definitions.actions.options.target_import }}
  * **data:** (any)
  * **focus:** (boolean, default true)


#### (Async) clear (Action)

Clears the value of the input field to an empty string, removing any user-provided value and ignoring any configured default value.

##### Options (clear)

  * **action:** (= "clear")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}


#### (Async) reset (Action)

Reverts the input field to its configured default value. If the field was initialized with a `value` option, `reset` will restore that value. If no default was configured, the field reverts to an empty string (same as `clear`).

##### Options (reset)

  * **action:** (= "reset")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}

