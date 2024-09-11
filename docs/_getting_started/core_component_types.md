---
title: Core Component Types
layout: chapter
permalink: /getting_started/core_component_types
nav_order: 4

---

# Core Component Types

Core component types are the backbone of *SmarkForm*:

<details>
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Complex field types](#complex-field-types)
    * [type: form and type: list](#type-form-and-type-list)
* [Scalar field types](#scalar-field-types)
    * [type: input](#type-input)
    * [type: number and type: date](#type-number-and-type-date)
    * [type: select](#type-select)
    * [The Singleton Pattern.](#the-singleton-pattern)
* [Non field component types](#non-field-component-types)
    * [type: trigger](#type-trigger)
    * [type: label](#type-label)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


## Complex field types

### type: form and type: list

📋 [form]({{ "component_types/type_form" | relative_url }}) and
📋 [list]({{ "component_types/type_list" | relative_url }}) provide the
structure that allows to handle any possible JSON data including nested objects
and arrays.

  * *form* imports and exports plain JSON objects.

  * *list* imports and exports JSON arrays.


## Scalar field types

{: .hint}
> Notice that the *SmarkForm* field types are not necessarily related to the
> *type* attribute of `<input>` tags even they can limit it's allowed values.
> 
> This way a *SmarkForm* component of type *input* can be defined over either
> `<select>`, a `<textarea>` or a `<input>` tag with any valid value of its
> *type* property while, in the case of number, only a `<input>` tag with a
> "number" as its *type* attribute is allowed.
> 
> And so on...


### type: input

The 📋 [input]({{ "component_types/type_input" | relative_url }}) component
type provide basic support for all HTML form fields (`<input>`, `<textarea>`
and `select`) **no matter, in case of *inputs* its actual *type* attribute**.

  * Imports and exports *String* like regular HTML form fields.


### type: number and type: date

The 📋 [number]({{ "component_types/type_number" | relative_url }}) and
📋 [date]({{ "component_types/type_date" | relative_url }}) component type
extends the [Input]({{ "component_types/type_input" | relative_url }})
component type providding extra sanitation (when importing) and formatting
(when exporting).

  * *number* imports and exports *Number*.

  * *date* imports and exports *Date*.

  * If inappropriate types (like *String*) are imported, they are properly
    converted on the fly.


### type: select

The 📋 [select]({{ "component_types/type_select" | relative_url }})
compenent type **will** (🚧 since it is not yet implemented 🚧) provide support
for advanced features like dynamic options loading and update, even reacting to
changes of other fields in a really transparent manner thanks to the
(future) "API interface".

  * Will inmport and export array of *String*.

  * Will allow configuration to expor arrays of different types.


### The Singleton Pattern.

All *Scalar field types* implement the so called **Singleton Pattern**.

The *Singleton Pattern* consists in using a non-field html tag as a *SmarkForm*
component of given *scalar* type.

👉 This allow for complex HTML to work as a single field.

👉 That HTML should contain **one and only one** HTML form field (`<input>`,
`<textarea>` or `<select>`).


{: .info}
> This allow them to incorporate
> [labels]({{ "component_types/type_label" | relative_url }})
> and [triggers]({{ "component_types/type_trigger" | relative_url }})
> which is specially convenient for the
> [list]({{ "component_types/type_list" | relative_url }}) component type since
> it make possible to incorporate triggers for its actions in every list item
> even for lists of scalars.


**Example:**

```html
  <!-- ... -->
  <li data-smark='{"type":"input"}'>
    <input placeholder='Phone number' type='tel'/>
    <button data-smark='{"action":"removeItem"}'>❌</button>
  </li>
  <!-- ... -->
```

{: .hint}
> See
> [Scalar item types]({{ "component_types/type_list" | relative_url }}#scalar-item-types)
> in the *«list» Component Type* chapter for a more real-world example.


## Non field component types

There are other component types with special mission that are not form field
types:


### type: trigger

The 🕹️ [Trigger]({{ "component_types/type_trigger" | relative_url }})s are used
for buttons (or any other elements) to receive interaction events (mouse
"click" by default, but they will be capable to handle others such as keyboard
events) and trigger predefined *actions* on propper components (i.e. adding or
removing items to lists).

  * The good thing about *triggers* is that **they usually don't need any extra
    wiring to interact with their targeted components**. They just target them
    by their own relative position in the *SmarkForm* form tree or, at most,
    with *filesystem-like* relative paths when necessary.


### type: label

The 🏷️ [Label]({{ "component_types/type_label" | relative_url }})s **will** (🚧
since it is not yet implemented 🚧) be used to enhance regular `<label>` to
properly resolve their *for* attribute from a *SmarkForm* relative path
ensuring it always matches the propper id no matter if it is a root-level field
or in the bottom of several subform and/or list nesting levels.


