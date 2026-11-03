---
title: "«number» Component Type"
layout: chapter
description: "Use SmarkForm number fields to convert valid numeric input to numbers and represent empty or invalid values as null."
permalink: "/component_reference/number"
nav_order: 5
redirect_from:
  - "/component_types/type_number"
---


{% include links.md %}
{% include components/sampletabs_ctrl.md %}
# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {% include chaptertoc/type_number.html %}

</details>

## Introduction

The `number` component type extends the [Input]({{ "/component_reference/input" | relative_url }})
type. It sanitizes imported numbers and exports valid, non-empty values as
JavaScript numbers.

- **Imports and Exports:** Number or `null`
- **Singleton Pattern:** Implements the [Singleton Pattern]({{ "/guides/the_singleton_pattern" | relative_url }})
- **Data Conversion:** Accepts numbers and numeric strings; invalid, empty, and null values become `null`.

## Usage

Use an `<input type="number">`. If `type` is omitted, SmarkForm sets it to
`number`; an explicit different native type or a non-`<input>` target raises a
render error.

**Example:**

{% raw %} <!-- simple_number {{{ --> {% endraw %}
{% capture simple_number -%}
<div id="myForm$$">
  <input type="number" name="amount" data-smark>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
    "amount": 42
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="simple_number"
    htmlSource=simple_number
    demoValue=demoValue
    showEditor=true
    tests=false
%}



## Requirements

The number component will throw an error if the target field is not an INPUT
element or its type is explicitly defined and different to "number".

Invalid values export as `null` rather than throwing. `0` is a valid number and
is not considered empty. Empty strings, non-numeric strings, and `null` import
as the empty state.

{% raw %} <!-- number_error {{{ --> {% endraw %}
{% capture number_error -%}
<div id="myForm$$">
  <p>
    <label>Correct:</label>
    <input type="number" name="amount1" data-smark='{"type":"number"}'>
  </p>
  <p>
    <label>Incorrect:</label>
    <input type="text" name="amount2" data-smark='{"type":"number"}'>
  </p>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="number_error"
    htmlSource=number_error
    showEditor=true
    tests=false
    expectedPageErrors=0
    expectedConsoleErrors=1
%}


{: .info :}
> When a component fails to render, SmarkForm replaces it with an error
> placeholder that shows the code and provides a button to replay the error in
> the console.
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

Clears the value of the number input field (sets it to `null`).

##### Options (clear)

  * **action:** (= "clear")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}


#### (Async) reset (Action)

Reverts the number field to its configured default value. If no default was configured, the field reverts to `null` (same as `clear`).

##### Options (reset)

  * **action:** (= "reset")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
