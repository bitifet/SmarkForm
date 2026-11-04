---
title: "«input» Component Type"
layout: chapter
description: "Use SmarkForm input fields for text, selection and checkbox controls, with native attributes, value defaults and optional JSON formatting."
permalink: "/component_reference/input"
nav_order: 4
redirect_from:
  - "/component_types/type_input"
---


{% include links.md %}
{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {% include chaptertoc/type_input.html %}

</details>

## Introduction

The `input` component type wraps native `<input>`, `<textarea>`, and `<select>`
controls. It returns their raw values rather than applying the typed conversion
provided by specialized types such as `number` and `date`.

- **Imports and Exports:** Usually a string; checkbox inputs export booleans.
- **Singleton Pattern:** Implements the [Singleton Pattern]({{ "/guides/the_singleton_pattern" | relative_url }})
- **Data Conversion:** No typed conversion is performed by the generic input type.

Generic checkbox controls export `true` or `false`, but the current `isEmpty()`
implementation treats every checkbox as empty, even when checked. A checkbox-only
item can therefore be omitted by a list using `export_empties:false`; see the
[List reference]({{ "/component_reference/list" | relative_url }}#export_empties).
No focused checkbox-emptiness test currently covers this case.


## Usage

Use `data-smark` on the native control. SmarkForm infers specialized types
from supported native types such as `number`, `date`, `time`, `datetime-local`,
`color`, and `radio`. Explicitly set `{"type":"input"}` when a control should
keep the generic input/string behavior.

**Example:**

{% raw %} <!-- input_basic_usage {{{ --> {% endraw %}
{% capture input_basic_usage_html -%}
<div id="myForm$$">
  <input type="text" data-smark='{"name":"username"}' placeholder="Enter your username">
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="input_basic_usage"
    htmlSource=input_basic_usage_html
    demoValue='{"username":"alice"}'
    showEditor=true
    tests=false
%}



## JSON format (`format` option)

Adding `{"format":"json"}` (or the legacy alias `encoding:"json"`) to any `<input>`, `<textarea>` or `<select>` makes
the field round-trip **real JavaScript values** instead of raw text:

- **On import**, an object, array, number, boolean or `null` is serialized to a
  JSON string in the field (pretty-printed in `<textarea>` for readability).
- **On export**, the field's text is parsed back into a JavaScript value;
  unparsable or empty input exports `null`. The current implementation also
  maps parsed falsey values (`0`, `false`, `""`, `null`) to `null`.

In other words, the field's DOM value is always a *JSON string*, but the
imported/exported data is a *structured value* — the string never leaks into
your exported JSON.

```html
<textarea name="metadata" data-smark='{"format":"json"}'></textarea>
```

```javascript
await myForm.import({ metadata: { subscribed: true, tier: "premium" } });
await myForm.export();
// → { "metadata": { "subscribed": true, "tier": "premium" } }
```

Without the option the field simply exports its raw string value (the default
`input` behaviour).

> See: [JSON format]({{ "/guides/value_coercion" | relative_url }}#json-format) for a full playable example and value limitations.

## Native attributes, defaults and masks

Native attributes such as `placeholder`, `autocomplete`, and `inputmode` remain
available on the enhanced control. A placeholder is display guidance; it does
not set the field value or its reset default.

Set a default with either the native HTML `value` attribute or the SmarkForm
`value` option in `data-smark`. Do not use both on the same element: SmarkForm
raises `VALUE_CONFLICT`. Without either, text inputs default to an empty string.
`import(undefined)` restores the field's own default; see
[Setting defaults via `value`]({{ "/guides/data_import_and_export" | relative_url }}#setting-defaults-via-value).

The generic `input` type also supports the `mask` option. Mask registration,
unmasked exports, and focus behavior are covered in the
[Field Masking guide]({{ "/guides/field_masking" | relative_url }}).

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

Imports the generic input type's empty value (`""`) without updating its
default. Text/select controls become empty and checkboxes become unchecked
(exporting `false`). With `format:"json"`, the empty JSON text exports `null`.

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
