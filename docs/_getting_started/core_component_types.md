---
title: Core Component Types
layout: chapter
permalink: /getting_started/core_component_types
nav_order: 4

---

# Core Component Types

<details>
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Form](#form)
* [List](#list)
* [Input](#input)
    * [Singleton Pattern](#singleton-pattern)
* [Number](#number)
* [Date](#date)
* [Select](#select)
* [Trigger](#trigger)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>

Core component types are the backbone of *SmarkForm*:

  * [Form](#form) and [List](#list) provide the structure that allows to handle
    any possible JSON data including nested objects and arrays.

  * The [Input](#input) component type provide basic support for all HTML form
    fields (`<input>`, `<textarea>` and `select`) no matter, in case of
    *inputs* its actual *type* attribute.
    - It also implements the [Singleton Pattern](#singleton-pattern).

  * [Number](#number) and [Date](#date) component types extend the
    [Input](#input) type providding extra sanitation (when importing) and
    formatting (when exporting).

  * The [Select](#select) compenent type (will) 🚧 not yet implemented 🚧
    provide support for advanced features like dynaic options loading and
    update, even reacting to changes of other fields in a really transparent
    manner thanks to the (future) "API interface".

  * [Trigger](#trigger)s, in fact, are not fields. They are used for buttons
    (or any other elements) to receive interaction events (mouse "click" by
    default, but they will be capable to handle others such as keyboard events)
    and trigger predefined *actions* on propper components (i.e. adding or
    removing items to lists).
    - The good thing about *triggers* is that **they don't need any extra
      wiring to interact with their targeted components**. They just target
      them by their own relative position in the *SmarkForm* form tree or, at
      most, with *filesystem-like* relative paths when necessary.


## Form

In *SmarkForm* the whole form is a field of the type *form* which imports and
exports JSON data.

The keys of that JSON data correspond to the names of the fields in the form.

From fields can be created over any HTML tag except for actual HTML form
elements (`<input>`, `<textarea>`, `<select>`, `<button>`...) and can contain
any number of *SmarkForm* fields, **including nested forms**.

**Example:**

```html
<!--
Create a SmarkForm form with a text Input and a nested form.
    👉 The outer form doesn't need the "data-smark" attribute having it is the
       outer form.
    👉 In text fields the "name" attribute is naturally taken as field name.
    👉 In the case of nested form, having <div> tags cannot have a "name"
       attribute, it is provided as a data-smark object property (which is always
       valid).
-->
<div id='myForm'>
  <input data-smark type='text' name='text01'/>
  <div data-smark='{"type":"form","name":"nestedForm"}'>
    <input data-smark type='text' name='text01'/>
    <input data-smark type='text' name='text02'/>
  </div>
</div>
<script>
    const myForm = new SmarkForm(document.getElementById("myForm"))
</script>
```

{: .hint}
> See also: [Form Component Type]({{ "component_types/type_form" | relative_url }})

## List

Likewise [forms](#form), *list* inputs can be created over any HTML tag except
for actual HTML form elements (`<input>`, `<textarea>`, `<select>`,
`<button>`...).

They can contain a variable number of unnamed inputs (list items) that user
will be able to add or remove at its own discretion (according certain
configurable rules).

But in its html source, they must contain exactly one html tag which will be
used as a template for its items.

Every time a new item is added to the list, this template is automatically
rendered as a *SmarkForm* field (no matter if we explicitly specified the
*data-smark* attribute or not), by default of the type "form".

But other types can be used in case we only want a list of discrete values. To
do so we can add the *data-smark* attribute to the item template or just
specify that type in the *to* property of the *data-smark* attribute of the
list itself.

{: .info}
> For lists of scalar values, we still may want to include list controls en
> each item. To do so, scalar input types can be defined like if they were a
> nested form with a single input (See [Singleton Pattern](#singleton-pattern)
> in the *Input* type section.

**Example:**

```html
<ul data-smark='{
    type: "list",
    name: "phones",
    of: "input",
    maxItems: 3,
}'>
  <li>
    <input placeholder='Phone Number' type="tel" data-smark>
    <button data-smark='{"action":"removeItem"}'>❌</button>
  </li>
</ul>
<button data-smark='{"action":"addItem","context":"phones"}'>➕</button>
```


{: .hint}
> See also: [List Component Type]({{ "component_types/type_list" | relative_url }})

## Input

### Singleton Pattern

{: .hint}
> See also: [Input Component Type]({{ "component_types/type_input" | relative_url }})

## Number

{: .hint}
> See also: [Number Component Type]({{ "component_types/type_number" | relative_url }})

## Date

{: .hint}
> See also: [Date Component Type]({{ "component_types/type_date" | relative_url }})

## Select

{: .hint}
> See also: [Select Component Type]({{ "component_types/type_select" | relative_url }})

## Trigger

{: .hint}
> See also: [Trigger Component Type]({{ "component_types/type_trigger" | relative_url }})

