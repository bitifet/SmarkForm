---
title: «date» Component Type
layout: chapter
permalink: /component_types/type_date
nav_order: 6

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
    * [Data Formats](#data-formats)
* [Requirements](#requirements)
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

{% include components/sampletabs_ctrl.md %}

## Introduction

The `date` component type extends the [Input](/component_types/type_input)
component type, providing specialized handling for date input fields with
enhanced parsing and formatting capabilities.

- **Imports and Exports:** ISO date string (`YYYY-MM-DD`) or `null` (when empty)
- **Singleton Pattern:** Implements the [Singleton Pattern](/getting_started/core_component_types#the-singleton-pattern)
- **Data Conversion:** Converts between various date formats and ISO date strings

## Usage

Just add the *data-smark* attribute to the `<input">` element specifying the type:

```html
<input data-smark='{"type":"date", "name":"birthdate"}'>
```

Alternatively, you can also use the shorthand notation inferring the type from the `<input>` element type:

```html
<input type="date" name="birthdate" data-smark>
```


**Example:**

{% raw %} <!-- simple_date {{{ --> {% endraw %}
{% capture simple_date -%}
<div id="myForm$$">
  <input type="date" name="birthdate" data-smark>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
    "birthdate": "1990-07-15"
}
{%- endcapture %}

{% raw %} <!-- simple_date_tests {{{ --> {% endraw %}
{% capture simple_date_tests -%}
export default async ({ expect, readField, writeField }) => {
    await writeField('birthdate', new Date("2023-11-30"));
    expect(await readField('birthdate')).toBe("2023-11-30");

    await writeField('birthdate', new Date("2023-11-30").getTime());
    expect(await readField('birthdate')).toBe("2023-11-30");

    await writeField('birthdate', "2023-12-25");
    expect(await readField('birthdate')).toBe("2023-12-25");

    await writeField('birthdate', "20231225");
    expect(await readField('birthdate')).toBe("2023-12-25");

    await writeField('birthdate', "invalid-date");
    expect(await readField('birthdate')).toBe(null);

    await writeField('birthdate', null);
    expect(await readField('birthdate')).toBe(null);

    await writeField('birthdate', "");
    expect(await readField('birthdate')).toBe(null);
};
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="simple_date"
    htmlSource=simple_date
    demoValue=demoValue
    showEditor=true
    tests=simple_date_tests
%}


### Data Formats

The `date` component accepts multiple input formats for maximum flexibility:

- **ISO Date String:** `"2023-12-25"` (standard HTML date input format)
- **Compact Date String:** `"20231225"` (YYYYMMDD format)
- **Date Object:** `new Date("2023-12-25")` (JavaScript Date instance)
- **Epoch Timestamp:** `1703462400000` (milliseconds since Unix epoch)
- **Empty/Null Values:** `null`, `""`, or `undefined` (clears the field)

All valid dates are normalized to ISO date format (`YYYY-MM-DD`) for export,
ensuring consistency across your application.

## Requirements

The date component will throw an error if the target field is not an INPUT
element or its type is explicitly defined and different to "date". Invalid date
strings that cannot be parsed will result in a `null` value rather than
throwing an error.

{% raw %} <!-- date_error {{{ --> {% endraw %}
{% capture date_error -%}
<div id="myForm$$">
  <p>
    <label>Correct:</label>
    <input type="date" name="birthdate1" data-smark='{"type":"date"}'>
  </p>
  <p>
    <label>Incorrect:</label>
    <input type="text" name="birthdate2" data-smark='{"type":"date"}'>
  </p>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- date_error_tests {{{ --> {% endraw %}
{% capture date_error_tests -%}
export default async ({ expect, readField, writeField }) => {
    await writeField('birthdate1', "2023-06-15");

    const exported = await readField('birthdate1');
    expect(exported).toBe("2023-06-15");
    expect(/^\d{4}-\d{2}-\d{2}$/.test(exported)).toBe(true);
};
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="date_error"
    htmlSource=date_error
    showEditor=true
    tests=date_error_tests
    expectedPageErrors=0
    expectedConsoleErrors=1
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

The `date` component type supports the following actions:

#### (Async) export (Action)

Exports the value of the date input field as an ISO date string. If the field is empty or contains an invalid date, it returns `null`.

##### Options (export)

  * **action:** (= "export")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * {{ site.data.definitions.actions.options.target_export }}
  * **data:**

#### (Async) import (Action)

Imports a value into the date input field. Accepts various date formats and converts them to the appropriate input format.

##### Options (import)

  * **action:** (= "import")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * {{ site.data.definitions.actions.options.target_import }}
  * **data:** (Date object, ISO date string, compact date string, or epoch timestamp)
  * **focus:** (boolean, default true)

#### (Async) clear (Action)

Clears the value of the date input field (sets it to `null`).

##### Options (clear)

  * **action:** (= "clear")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}


#### (Async) reset (Action)

Reverts the date field to its configured default value. If no default was configured, the field reverts to `null` (same as `clear`).

##### Options (reset)

  * **action:** (= "reset")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
