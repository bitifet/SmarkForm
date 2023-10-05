---
title: Core Concepts
layout: chapter
permalink: /getting_started/core_concepts
nav_order: 4

---

# Core Concepts

<details>
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [The `data-smark` Attribute](#the-data-smark-attribute)
* [Components and Actions](#components-and-actions)
    * [Components](#components)
    * [Actions](#actions)
    * [Action Components](#action-components)
* [Accessing Components](#accessing-components)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


## The `data-smark` Attribute

The `data-smark` attribute is used in SmarkForm to identify and enhance
specific DOM elements (HTML tags) as SmarkForm components. It also provides the
required properties for their enhancement.

By using the `data-smark` attribute, you can mark elements to be transformed
into SmarkForm components, while the remaining elements are ignored by
SmarkForm.

{: .info }
> 📌 The following are exceptions to this rule:
>
> 1. The DOM element passed to the SmarkForm constructor is always considered a
>    SmarkForm component.
> 2. The item template of a list component, which is the only allowed direct
>    child in the HTML source before rendering, is always a SmarkForm component
>    by default. In this case, the `data-smark` attribute can be omitted.

**Syntax:**

The `data-smark` attribute can be specified in three different ways:

1. Without any value (e.g., `<textarea ... data-smark>`).
   - In this case, the component type is inferred based on the actual tag. For
   example, it is inferred as an *input* type for `<textarea>`.

2. With a string value (e.g., `<div ... data-smark="singleton">`).
   - This is equivalent to `<div ... data-smark='{"type": "singleton"}'>`.

3. With a valid JSON string (e.g., `<div data-smark='{"type": "list", "name":
   "myList"}'>`).

**Mandatory properties:**

The following properties are (nearly) mandatory:

- The `type` property is always necessary to determine which component type
  controller should be used for rendering the component. In many cases, it can be
  inferred based on the tag name or the presence of the `action` property, which
  forces the type to be "action".

- The `name` property is required for all non-action components.
   - If not explicitly provided, it can be inferred from the `name` property of
     the tag being enhanced. For example, `<input name="foo" data-smark>`.
   - If not provided and cannot be inferred, a randomly generated name will be
     used.

- The `action` property is mandatory for all [components of the type
  "action"](#action-components) to specify which [action](actions) they
  actually trigger. In fact, the `type="action"` property itself is optional
  here having it is implied by the presence of the `action` property.


**Other properties:**

Depending on the actual component type other properties may be applicable.

In case of *actions*, despite `type`and `name`, is worth to mention that,
except for the `for` and `to` properties


FIXME: To be continued...
//// ** ... the rest of available properties depend on the type of its [context]()...

TODO: Link 'for' and 'to' to propper type_action.md section...



## Components and Actions

### Components

A SmarkForm *component* is just a DOM element (HTML tag) which has a
"data-smark" property providding a JSON-formatted *options* object.

It looks like as follows:

```html
<input data-smark='{type: "input"}'/>
```

{: .info }
> 📌 If only type option is specified, it can be simplified as:
> ```html
> <input data-smark='input'/>
> ```
> ...or just leave it empty to let SmarkForm engine to figure out its type:
> ```html
> <input data-smark/>
> ```


### Actions

*Actions* are operations that can be performed over components.

Some of them such as `import`, `export` and `empty` are available for all
components types while others are tied to secific types like `addItem` an d
`removeItem` for lists, etc...


### Action Components

*Action Components* are a special type of *component* that serve to trigger
actions on another compoenent which we refer to it as its "context".

Any SmarkForm component whith an *action* property is an [Action
Component]({{ "component_types/type_action" | relative_url }}) and for the sake of simplicity, its *type* property
can be ommitted but it cannot take a different value than "action".

**Example:**

```html
<button data-smark='{action: "removeItem"}'></button>
```

{: .hint }
> 📖 For detailed information see [Action Type Documentation]({{ "component_types/type_action" | relative_url }}).



## Accessing Components


```javascript
const form = new SmarkForm(
    document.querySelector("#main-form")
);
```

