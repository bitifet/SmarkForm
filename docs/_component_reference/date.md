---
title: "«date» Component Type"
layout: chapter
description: "Use native date inputs with SmarkForm's accepted date formats, ISO export shape, and null empty value."
permalink: "/component_reference/date"
nav_order: 6
redirect_from:
  - "/component_types/type_date"
---


{% include links.md %}
{% include components/sampletabs_ctrl.md %}
# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {% include chaptertoc/type_date.html %}

</details>

## Introduction

The `date` component type extends the [Input]({{ "/component_reference/input" | relative_url }})
component type, providing specialized handling for date input fields with
date parsing and ISO formatting.

- **Imports and Exports:** ISO date string (`YYYY-MM-DD`) or `null` (when empty)
- **Singleton Pattern:** Implements the [Singleton Pattern]({{ "/guides/the_singleton_pattern" | relative_url }})
- **Data Conversion:** Converts between various date formats and ISO date strings

## Usage

Use `<input type="date" data-smark>`. SmarkForm also infers `date` from the
native type, or sets the native type when you explicitly declare
`{"type":"date"}` on an `<input>` without `type`.

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
- **Date Object:** a valid JavaScript `Date` instance
- **Epoch Timestamp:** milliseconds since Unix epoch; these inputs are treated as instants and exported using their UTC calendar date
- **Empty/Null Values:** `null` or `""` clears the field. `undefined` is a
  reset signal; see the reset caveat below.

All valid dates are normalized to ISO date format (`YYYY-MM-DD`) for export,
ensuring consistency across your application.

Date-only strings use the calendar date as written. A `Date` object or epoch is
an instant; the exported date comes from `toISOString()` (UTC), which can differ
from the local calendar date near a timezone boundary.

### Field defaults and reset

**Current implementation caveat:** `date.import(undefined)` normalizes the
reset signal to `null` before delegating to the generic input type. A direct
field `reset()` therefore clears to `null` and can replace the field's stored
default with `null`; the base field's initial reset can also discard a
field-local `value` default. A parent Form reset that imports an explicit date
in its stored object still restores that value. No focused regression test
covers date field-level defaults; see the Step 14 transfer map.

## Requirements

The date component requires an `<input type="date">`; a missing native type is
filled in, while a different type or tag raises a render error. Unparseable
strings export as `null`. Only valid `Date` instances are supported; an invalid
`Date` can throw during ISO conversion.

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

The reset behavior for this type differs from the generic field contract; see
[Field defaults and reset](#field-defaults-and-reset).

##### Options (reset)

  * **action:** (= "reset")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
