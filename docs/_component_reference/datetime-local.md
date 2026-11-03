---
title: "«datetime-local» Component Type"
layout: chapter
description: "Use SmarkForm datetime-local fields to normalize local date and time values for consistent JSON import and export."
permalink: "/component_reference/datetime-local"
nav_order: 8
redirect_from:
  - "/component_types/type_datetime-local"
---


{% include links.md %}
{% include components/sampletabs_ctrl.md %}
# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {% include chaptertoc/type_datetime-local.html %}

</details>

## Introduction

The `datetime-local` component type extends the [Input]({{ "/component_reference/input" | relative_url }})
component type, providing specialized handling for datetime-local input fields with
local date/time parsing and formatting.

- **Imports and Exports:** ISO datetime-local string (`YYYY-MM-DDTHH:mm:ss`) or `null` (when empty)
- **Singleton Pattern:** Implements the [Singleton Pattern]({{ "/guides/the_singleton_pattern" | relative_url }})
- **Data Conversion:** Converts between various datetime formats and ISO datetime-local strings

## Usage

Use `<input type="datetime-local" data-smark>`. SmarkForm also infers
`datetime-local` from the native type, or sets it when you explicitly declare
`{"type":"datetime-local"}` on an `<input>` without `type`.

```html
<input data-smark='{"type":"datetime-local", "name":"appointmentTime"}'>
```

Alternatively, you can also use the shorthand notation inferring the type from the `<input>` element type:

```html
<input type="datetime-local" name="appointmentTime" data-smark>
```


**Example:**

{% raw %} <!-- simple_datetime_local {{{ --> {% endraw %}
{% capture simple_datetime_local -%}
<div id="myForm$$">
  <input type="datetime-local" name="appointmentTime" data-smark>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
    "appointmentTime": "2025-06-15T09:30:00"
}
{%- endcapture %}

{% raw %} <!-- simple_datetime_local_tests {{{ --> {% endraw %}
{% capture simple_datetime_local_tests -%}
export default async ({ expect, readField, writeField }) => {
    await writeField('appointmentTime', new Date("2023-11-30T14:30:45"));
    expect(await readField('appointmentTime')).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);

    await writeField('appointmentTime', new Date("2023-11-30T14:30:45").getTime());
    expect(await readField('appointmentTime')).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);

    await writeField('appointmentTime', "2023-12-25T18:45:30");
    expect(await readField('appointmentTime')).toBe("2023-12-25T18:45:30");

    await writeField('appointmentTime', "2023-12-25T18:45");
    expect(await readField('appointmentTime')).toBe("2023-12-25T18:45:00");

    await writeField('appointmentTime', "20231225T184530");
    expect(await readField('appointmentTime')).toBe("2023-12-25T18:45:30");

    await writeField('appointmentTime', "20231225T1845");
    expect(await readField('appointmentTime')).toBe("2023-12-25T18:45:00");

    await writeField('appointmentTime', "2023-12-25T18:45:30.000Z");
    expect(await readField('appointmentTime')).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);

    await writeField('appointmentTime', "invalid-datetime");
    expect(await readField('appointmentTime')).toBe(null);

    await writeField('appointmentTime', null);
    expect(await readField('appointmentTime')).toBe(null);

    await writeField('appointmentTime', "");
    expect(await readField('appointmentTime')).toBe(null);

    await writeField('appointmentTime', "2023-12-25T14:30:45");
    expect(await readField('appointmentTime')).toBe("2023-12-25T14:30:45");
};
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="simple_datetime_local"
    htmlSource=simple_datetime_local
    demoValue=demoValue
    showEditor=true
    tests=simple_datetime_local_tests
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
- **Empty/Null Values:** `null` or `""` clears the field. `undefined` is a
  reset signal; see the reset caveat below.

All valid values are normalized to `YYYY-MM-DDTHH:mm:ss` for export. ISO strings
with a timezone or epoch timestamps are converted to the runtime's local time;
the exported value contains no timezone information.

### Field defaults and reset

**Current implementation caveat:** `datetime-local.import(undefined)`
normalizes the reset signal to `null` before delegating to the generic input
type. A direct field `reset()` therefore clears to `null` and can replace the
field's stored default with `null`; the base field's initial reset can also
discard a field-local `value` default. A parent Form reset that imports an
explicit datetime in its stored object still restores that value. No focused
regression test covers datetime-local field-level defaults; see the Step 14
transfer map.

## Requirements

The component requires an `<input type="datetime-local">`; a missing native type
is filled in, while a different type or tag raises a render error. Unparseable
values export as `null`.

{% raw %} <!-- datetime_local_error {{{ --> {% endraw %}
{% capture datetime_local_error -%}
<div id="myForm$$">
  <p>
    <label>Correct:</label>
    <input type="datetime-local" name="appointmentTime1" data-smark='{"type":"datetime-local"}'>
  </p>
  <p>
    <label>Incorrect:</label>
    <input type="text" name="appointmentTime2" data-smark='{"type":"datetime-local"}'>
  </p>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- datetime_local_error_tests {{{ --> {% endraw %}
{% capture datetime_local_error_tests -%}
export default async ({ expect, readField, writeField }) => {
    await writeField('appointmentTime1', "2023-06-15T12:34:56");

    const exported = await readField('appointmentTime1');
    expect(exported).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
};
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="datetime_local_error"
    htmlSource=datetime_local_error
    showEditor=true
    tests=datetime_local_error_tests
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

Clears the value of the datetime-local input field (sets it to `null`).

##### Options (clear)

  * **action:** (= "clear")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}


#### (Async) reset (Action)

The reset behavior for this type differs from the generic field contract; see
[Field defaults and reset](#field-defaults-and-reset).

##### Options (reset)

  * **action:** (= "reset")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
