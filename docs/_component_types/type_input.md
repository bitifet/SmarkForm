---
title: «input» Component Type
layout: chapter
permalink: /component_types/type_input
nav_order: 3

---

{% include components/sampletabs_ctrl.md %}

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
    tests=false
%}



## JSON format (`format` option)

Adding `{"format":"json"}` (or the legacy alias `encoding:"json"`) to any `<input>`, `<textarea>` or `<select>` makes
the field round-trip **real JavaScript values** instead of raw text:

- **On import**, an object, array, number, boolean or `null` is serialized to a
  JSON string in the field (pretty-printed in `<textarea>` for readability).
- **On export**, the field's text is parsed back into a JavaScript value;
  unparsable or empty input exports `null`.

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

> See: [JSON format]({{ "working_with_forms/value_coercion" | relative_url }}#json-format) for a full playable example.

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

