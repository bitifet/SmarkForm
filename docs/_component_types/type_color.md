---
title: «color» Component Type
layout: chapter
permalink: /component_types/type_color
nav_order: 5

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

The `color` component type extends the [Input](/component_types/type_input)
component type.

Since the native HTML *type=color* input field also returns a string and
already ensures that the value is a valid #RRGGBB hexadecimal color string, the
`color` component type wouldn't had been necessary since we could have used the
`input` component type.

But native HTML color input fields does not allow even empty string so, if we
receive a `#000000` value, we cannot tell if the user has intentionally
selected the black color or if he just didn't select any color at all.

The `color` component type, on the other hand, can take null as value (being it
its default value).

- **Imports:** `String` (Valid "#RRGGBB" or "#RGB" Hex value) or null (meaning not selected).
- **Exports:** `String` (Valid "#RRGGBB" Hex value) or null (when not selected).
- **Singleton Pattern:** Implements the [Singleton Pattern](/getting_started/core_component_types#the-singleton-pattern)
- **Data Conversion:** None, but accepts null as value.

## Usage

Just add the *data-smark* attribute to the `<input">` element specifying the type:

```html
<input data-smark='{"type":"color", "name":"myColor"}'>
```

Alternatively, you can also use the shorthand notation inferring the type from the `<input>` element type:

```html
<input type="color" name="myColor" data-smark>
```

**Example:**

{% raw %} <!-- simple_color {{{ --> {% endraw %}
{% capture simple_color
%}<input type="color" name="myColor" data-smark>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="simple_color"
    htmlSource=simple_color
    showEditor=true
%}


👉 Notice that, after selecting a color, you can clear the input field by
pressing the `Delete` key.

But, in order to allow clearing the field from touch devices it's advisable to
add a trigger button with the `clear` action.

The following example uses the [Singleton
Pattern](/getting_started/core_component_types#the-singleton-pattern) to group
the input field and the clear button:


{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes %}
👉 Without recurring to the [Singleton
Pattern](/getting_started/core_component_types#the-singleton-pattern), you
would have to specify the context in the button action, like this:

```html
<input type="color" name="myColor" data-smark>
<button data-smark='{"action":"clear","context":"./myColor"}'>❌ Clear</button>
```

👉 Here we used a explicitly relative path for the context. But you could also use:
   → `"context":"myColor"` (non explicit relative path)
   → `"context":"/myColor"` (absolute path)
{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}


{% raw %} <!-- singleton_color {{{ --> {% endraw %}
{% capture singleton_color
%}<span data-smark='{"type":"color", "name":"myColor"}'>
    <input data-smark>
    <button data-smark='{"action":"clear"}'>❌ Clear</button>
</span>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="singleton_color"
    htmlSource=singleton_color
    notes=notes
    showEditor=true
%}


## Requirements

The number component will throw a *RenderError* if the target field is not an
INPUT element or its type is explicitly defined and different to "color".

{% raw %} <!-- singleton_color_error {{{ --> {% endraw %}
{% capture singleton_color_error
%}<span data-smark='{"type":"color", "name":"myColor"}'>
    <input type="text" name="myColor" data-smark>
    <button data-smark='{"action":"clear"}'>❌ Clear</button>
</span>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="singleton_color_error"
    htmlSource=singleton_color_error
    showEditor=true
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




