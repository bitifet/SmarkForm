---
title: «time» Component Type
layout: chapter
permalink: /component_types/type_time
nav_order: 7

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

{% include components/sampletabs_ctrl.md noShowHint=true %}

## Introduction

The `time` component type extends the [Input](/component_types/type_input)
component type, providing specialized handling for time input fields with
enhanced parsing and formatting capabilities.

- **Imports and Exports:** ISO time string (`HH:mm:ss`) or `null` (when empty)
- **Singleton Pattern:** Implements the [Singleton Pattern](/getting_started/core_component_types#the-singleton-pattern)
- **Data Conversion:** Converts between various time formats and ISO time strings

## Usage

Just add the *data-smark* attribute to the `<input>` element specifying the type:

```html
<input data-smark='{"type":"time", "name":"meetingTime"}'>
```

Alternatively, you can also use the shorthand notation inferring the type from the `<input>` element type:

```html
<input type="time" name="meetingTime" data-smark>
```


**Example:**

{% raw %} <!-- simple_time {{{ --> {% endraw %}
{% capture simple_time
%}<input type="time" name="meetingTime" data-smark>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue %}{ "meetingTime": "14:30:00" }{% endcapture %}

{% include components/sampletabs_tpl.md
    formId="simple_time"
    htmlSource=simple_time
    demoValue=demoValue
    showEditor=true
    tests=false
%}


### Data Formats

The `time` component accepts multiple input formats for maximum flexibility:

- **ISO Time String (HH:mm:ss):** `"14:30:45"` (standard format with seconds)
- **Short Time String (HH:mm):** `"14:30"` (automatically adds `:00` for seconds)
- **Compact Time String (HHmmss):** `"143045"` (6-digit format, converted to `HH:mm:ss`)
- **Short Compact Time String (HHmm):** `"1430"` (4-digit format, converted to `HH:mm:00`)
- **Date Object:** `new Date("2023-12-25T14:30:45")` (extracts time portion)
- **Epoch Timestamp:** `1703512245000` (milliseconds since Unix epoch, extracts time)
- **Empty/Null Values:** `null`, `""`, or `undefined` (clears the field)

All valid times are normalized to ISO time format (`HH:mm:ss`) for export,
ensuring consistency across your application.

## Requirements

The time component will throw an error if the target field is not an INPUT
element or its type is explicitly defined and different to "time". Invalid time
strings that cannot be parsed will result in a `null` value rather than
throwing an error.

{% raw %} <!-- time_error {{{ --> {% endraw %}
{% capture time_error
%}<input type="text" name="meetingTime" data-smark='{"type":"time"}'>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="time_error"
    htmlSource=time_error
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

The `time` component type supports the following actions:

#### (Async) export (Action)

Exports the value of the time input field as an ISO time string. If the field is empty or contains an invalid time, it returns `null`.

##### Options (export)

  * **action:** (= "export")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * {{ site.data.definitions.actions.options.target_export }}
  * **data:**

#### (Async) import (Action)

Imports a value into the time input field. Accepts various time formats and converts them to the appropriate input format.

##### Options (import)

  * **action:** (= "import")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * {{ site.data.definitions.actions.options.target_import }}
  * **data:** (Date object, ISO time string, compact time string, or epoch timestamp)
  * **focus:** (boolean, default true)

#### (Async) clear (Action)

Clears the value of the time input field (sets it to `null`).

##### Options (clear)

  * **action:** (= "clear")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}


#### (Async) reset (Action)

Reverts the time field to its configured default value. If no default was configured, the field reverts to `null` (same as `clear`).

##### Options (reset)

  * **action:** (= "reset")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}

