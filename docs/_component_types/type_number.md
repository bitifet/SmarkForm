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

{% include components/sampletabs_ctrl.md noShowHint=true %}

## Introduction

The `number` component type extends the [Input](/component_types/type_input) component type, providing additional sanitation (when importing) and formatting (when exporting).

- **Imports and Exports:** `Number`
- **Singleton Pattern:** Implements the [Singleton Pattern](/getting_started/core_component_types#the-singleton-pattern)
- **Data Conversion:** Converts inappropriate types (like `String`) to `Number` on the fly.

## Usage

To use the `number` component type, ensure that the target field is an `INPUT`
element of type `number`. If the type attribute is not specified, it will be
set to `number` automatically.

**Example:**

{% raw %} <!-- simple_number {{{ --> {% endraw %}
{% capture simple_number
%}<input type="number" name="amount" data-smark>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="simple_number"
    htmlSource=simple_number
    showEditor=true
    tests=false
%}



## Requirements

The number component will throw an error if the target field is not an INPUT
element or its type is explicitly defined and different to "number".

The number component will throw an error if the target field is not an INPUT
element or its type is explicitly defined and different to "number". Invalid
numbers will result in a `null` value rather than throwing an error.

{% raw %} <!-- number_error {{{ --> {% endraw %}
{% capture number_error
%}<input type="text" name="amount" data-smark='{"type":"number"}'>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="number_error"
    htmlSource=number_error
    showEditor=true
    tests=false
    expectedPageErrors=1
%}


{: .info :}
> When a *SmarkForm* component fails to render due to a *RenderError*, it is
> replaced by a flamboyant placeholder that shows the error code and provides a
> handy button to "replay" it to the console making it easier to debug the
> issue.
> 
> 👉 Take a look to the *Preview* tab of the previous example to see it in
> action.
>
> {: .hint :}
> > Notice that you'll need to open your browser console if you want to see the
> > error details when pressing the "Replay Error" button.



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


