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

* [Field types](#field-types)
    * [Complex field types](#complex-field-types)
    * [Scalar field types](#scalar-field-types)
* [Other component types](#other-component-types)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


## Field types

### Complex field types

  * [Form]({{ "component_types/type_form" | relative_url }}) and
    [List]({{ "component_types/type_list" | relative_url }}) provide the
    structure that allows to handle any possible JSON data including nested
    objects and arrays.

### Scalar field types

  * The [Input]({{ "component_types/type_input" | relative_url }}) component
    type provide basic support for all HTML form fields (`<input>`,
    `<textarea>` and `select`) no matter, in case of *inputs* its actual *type*
    attribute.

  * [Number]({{ "component_types/type_number" | relative_url }}) and
    [Date]({{ "component_types/type_date" | relative_url }}) component type
    extends the [Input]({{ "component_types/type_input" | relative_url }})
    component type providding extra sanitation (when importing) and formatting
    (when exporting).

  * The [Select]({{ "component_types/type_select" | relative_url }}) compenent
    type **will** (🚧 since it is not yet implemented 🚧) provide support for
    advanced features like dynamic options loading and update, even reacting to
    changes of other fields in a really transparent manner thanks to the
    (future) "API interface".


{: .info}
> The [Input]({{ "component_types/type_input" | relative_url }}) component
> type and its derivated types
> [Number]({{ "component_types/type_number" | relative_url }})
> and [Date]({{ "component_types/type_date" | relative_url }})
> implement the
> [Singleton Pattern]({{ "component_types/type_input" | relative_url }}#singleton-pattern).
> 
> This allow for [lists]({{ "component_types/type_list" | relative_url }}) of
> [scalar field types](#scalar-field-types) to include
> [labels **and triggers**](#other-component-types) in each list item.


## Other component types

There are other component types with special mission that are not form field
types:

  * [Trigger]({{ "component_types/type_trigger" | relative_url }})s are used
    for buttons (or any other elements) to receive interaction events (mouse
    "click" by default, but they will be capable to handle others such as
    keyboard events) and trigger predefined *actions* on propper components
    (i.e. adding or removing items to lists).
    - The good thing about *triggers* is that **they don't need any extra
      wiring to interact with their targeted components**. They just target
      them by their own relative position in the *SmarkForm* form tree or, at
      most, with *filesystem-like* relative paths when necessary.

  * [Label]({{ "component_types/type_label" | relative_url }})s **will** (🚧
    since it is not yet implemented 🚧) be used to enhance regular `<label>` to
    properly resolve their *for* attribute from a SmarkForm relative path
    ensuring it always matches the propper id no matter if it is a root-level
    field or in the bottom of several subform and/or list nesting levels.


