---
title: «datetime-local» Component Type
layout: chapter
permalink: /component_types/type_datetime-local
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

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>

{% include components/sampletabs_ctrl.md noShowHint=true %}

## Introduction

The `datetime-local` component type extends the [Input](/component_types/type_input)
component type, providing specialized handling for datetime-local input fields with
enhanced parsing and formatting capabilities.

- **Imports and Exports:** ISO datetime-local string (`YYYY-MM-DDTHH:mm:ss`) or `null` (when empty)
- **Singleton Pattern:** Implements the [Singleton Pattern](/getting_started/core_component_types#the-singleton-pattern)
- **Data Conversion:** Converts between various datetime formats and ISO datetime-local strings

## Usage

Just add the *data-smark* attribute to the `<input>` element specifying the type:

```html
<input data-smark='{"type":"datetimeLocal", "name":"appointmentTime"}'>
```

Alternatively, you can also use the shorthand notation inferring the type from the `<input>` element type:

```html
<input type="datetime-local" name="appointmentTime" data-smark>
```


**Example:**

{% raw %} <!-- simple_datetime_local {{{ --> {% endraw %}
{% capture simple_datetime_local
%}<input type="datetime-local" name="appointmentTime" data-smark>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="simple_datetime_local"
    htmlSource=simple_datetime_local
    showEditor=true
    tests=false
%}


### Data Formats

The `datetime-local` component accepts multiple input formats for maximum flexibility:

- **ISO DateTime-Local String (YYYY-MM-DDTHH:mm:ss):** `"2023-12-25T14:30:45"` (standard HTML datetime-local input format)
- **Short DateTime-Local String (YYYY-MM-DDTHH:mm):** `"2023-12-25T14:30"` (automatically adds `:00` for seconds)
- **Compact DateTime String (YYYYMMDDTHHmmss):** `"20231225T143045"` (15-character format, converted to standard format)
- **Short Compact DateTime String (YYYYMMDDTHHmm):** `"20231225T1430"` (13-character format, converted with `:00` for seconds)
- **ISO 8601 String with Timezone:** `"2023-12-25T14:30:45.000Z"` (converted to local time representation)
- **Date Object:** `new Date("2023-12-25T14:30:45")` (JavaScript Date instance)
- **Epoch Timestamp:** `1703512245000` (milliseconds since Unix epoch)
- **Empty/Null Values:** `null`, `""`, or `undefined` (clears the field)

All valid datetime values are normalized to ISO datetime-local format (`YYYY-MM-DDTHH:mm:ss`) for export,
ensuring consistency across your application. Note that the datetime-local type works with local time
(not UTC), so timezone information is not included in the exported value.

## Requirements

The datetime-local component will throw an error if the target field is not an INPUT
element or its type is explicitly defined and different to "datetime-local". Invalid datetime
strings that cannot be parsed will result in a `null` value rather than
throwing an error.

{% raw %} <!-- datetime_local_error {{{ --> {% endraw %}
{% capture datetime_local_error
%}<input type="text" name="appointmentTime" data-smark='{"type":"datetimeLocal"}'>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="datetime_local_error"
    htmlSource=datetime_local_error
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

The `datetime-local` component type supports the following actions:

#### (Async) export (Action)

Exports the value of the datetime-local input field as an ISO datetime-local string. If the field is empty or contains an invalid datetime, it returns `null`.

##### Options (export)

  * **action:** (= "export")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * {{ site.data.definitions.actions.options.target_export }}
  * **data:**

#### (Async) import (Action)

Imports a value into the datetime-local input field. Accepts various datetime formats and converts them to the appropriate input format.

##### Options (import)

  * **action:** (= "import")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * {{ site.data.definitions.actions.options.target_import }}
  * **data:** (Date object, ISO datetime-local string, compact datetime string, or epoch timestamp)
  * **focus:** (boolean, default true)

#### (Async) clear (Action)

Clears the value of the datetime-local input field (sets it to null).

##### Options (clear)

  * **action:** (= "clear")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
