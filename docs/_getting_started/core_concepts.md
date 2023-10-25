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

* [Forms, Lists and Fields](#forms-lists-and-fields)
* [The `data-smark` Attribute](#the-data-smark-attribute)
    * [Syntax](#syntax)
    * [Shorthand Syntaxes](#shorthand-syntaxes)
        * [String Value](#string-value)
        * [No value at all](#no-value-at-all)
* [Mandatory properties](#mandatory-properties)
* [Components and Actions](#components-and-actions)
    * [Components](#components)
    * [Actions](#actions)
    * [Action Components](#action-components)
* [Accessing Components](#accessing-components)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


## Forms, Lists and Fields

When we initialize a *SmarkForm* instance over some DOM element, it is enhanced
as **a *SmarkForm* form** component which is returned as our *root form*.

```javascript
const myForm = new SmarkForm(some_DOM_element); // Or myRootForm
```

👉 Then, every inner DOM element with a *data-smark* attribute, will be enhanced
as another SmarkForm component. No matter if it is a direct child or a
descendant of any depth.

```html
<div id='myForm'> <!-- SmarkForm Component -->
  <input name='userId' data-smark> <!-- SmarkForm Component -->
  <ul>
    <li><input name='name' data-smark> <!-- SmarkForm Component --> </li>
    <li><input name='surname' data-smark> <!-- SmarkForm Component --> </li>
  </ul>
  <script>
    const myForm = new SmarkForm(document.getElementById("myForm"));
  </script>
</div>
```

👉 **Every *SmarkForm* component (except *actions*) is a form field** from and
to which **we can import and export values**.

👉 So our *root form* is also a *field* (of type "form") from and to which we
can import and export *values* (JSON objects).

```javascript
myForm.onRendered(function() {
  this.export().then(console.log);
  // { "userId": "", "name": "", "surname": "" }
  this.import({name: "John"})
    .then(()=>this.export())
    .then(console.log)
  ;
  // { "userId": "", "name": "John", "surname": "" }
});
```

{: .info }
> Alternatively, you can enhance readability by providing the onRendered
> callback through the options object and/or using an async function.
> 
> ```javascript
> const myForm = new SmarkForm(document.getElementById("myForm"), {
>     async onRendered() {
>         console.log(await this.export());
>         // { "userId": "", "name": "", "surname": "" }
>         await this.import({name: "John"});
>         console.log(await this.export());
>         // { "userId": "", "name": "John", "surname": "" }
>     },
> });
> ```

👉 This also mean **we can nest forms** inside other forms as regular fields
(holding JSON objects) with no depth limit.

```html
<div id='myForm'> <!-- SmarkForm Component -->
  <input name='userId' value='0001' data-smark> <!-- SmarkForm Component -->
  <div data-smark='{"type":"form","name":"personal_data"}'> <!-- SmarkForm Component -->
    <input name='name' value='John' data-smark> <!-- SmarkForm Component -->
    <input name='surname' value='Doe' data-smark> <!-- SmarkForm Component -->
  </div>
  <script>
    const myForm = new SmarkForm(document.getElementById("myForm"), {
        async onRendered() {
            console.log(await this.export());
            // { "userId": "0001", "personal_data": { "name": "John", "surname": "Doe" } }
        }
    });
  </script>
</div>
```

👉 In case we need arrays, the *list* component type come to rescue: Likewise
forms hold JSON objects, lists hold JSON arrays. So **we are able to define
simple HTML forms that can import and export any imaginable JSON data**.

<!--

TODO:

  * List examples:
    - Pets (subform)
    - Phones and/or emails (singleton)

  * Addressability:
    - Import and export given vectors.

  * AutoId...

-->

👉 List's length can be constrained with "minItems" and "maxItems" properties
and controlled through "addItem" and "removeItem" *action* components.


{: .hint }
>  Check out our [🔗 Complete Examples]({{ "resources/examples" | relative_url
>  }}) section to better understand these concepts.


## The `data-smark` Attribute

The `data-smark` attribute is used in SmarkForm to identify and enhance
specific DOM elements (HTML tags) as SmarkForm components. It also provides the
required properties for their enhancement.

{: .warning }
> The terms *attribute* and *property* may lead to confussion.
> 
> In this whole manual, we will consistently use **the term *attribute* to refer
> [HTML elemnts attributes](https://www.w3schools.com/html/html_attributes.asp)**
> and **the term *property* to refer object properties** and, specially
> SmarkForm components's properties defined in their *data-smark* attribute.

By using the `data-smark` attribute, you can mark elements to be transformed
into SmarkForm components, while the remaining elements are ignored by
SmarkForm.

{: .info }
> The following are **exceptions to this rule:**
>
> 1. The root element (the DOM element passed to the SmarkForm constructor to
>    be enhanced as *SmarkForm*) is always considered a SmarkForm component.
> 2. The item template of a list component, which is the only allowed direct
>    child in the HTML source before rendering, will always be rendered (per
>    each list item) as a SmarkForm component by default.
> 
> 👉 **In both cases, the `data-smark` attribute can be omitted.**

**Example:**

```html
<div id="myForm">
    <!-- Other form fields... -->
    <ul data-smark='{"name": "myList", "type": "list", "maxItems": 5}'>
        <li>
            <!-- Template describing list Item's layout -->
        </li>
    </ul>
    <!-- Other form fields... -->
</div>
<script>
    const myForm = new SmarkForm(document.getElementById("myForm"));
</script>
```

{: .hint }
> In the previous example:
>   * The outer `<div>` does not need the *data-smark* property since it is the
>     DOM element we enhanced as a *SmarkForm* root form field.
>   * The `<li>` element is the template that the  *list* component will render
>     as SmarkForm component every time a new item is added to the list.

### Syntax

The `data-smark` attribute should contain a valid JSON object with following
attributes:

  * `type` **(Mandatory):** Which specifies the component type.

  * `name` **(Recommended):** Field name to identify the component in its form
    level. Defaults to the value of the `name` attribute of actual HTML tag. If
    none given, random generated valued will be used instead.

  * *(other...)*: Depending on actual component type...


{: .info }
> 📌 There are also exceptions to this rule:
>
> 1. Any component with the `action` property is of "action" type and hence the
>    *type* property can be omitted.
> 
> 2. *Action* components are not considered form fields and, therefore, they
>    hav no *name* property.


### Shorthand Syntaxes

For the sake of brevity, the *data-smark* attribute can also be specified in
the following alternative ways:

#### String Value

If only the type needs to be specified, it can be done as a regular string.

**Example:**

  * **Shorthand:** `<div data-smark="singleton">` 
  * **Long Form:** `<div data-smark='{"type": "singleton"}'>`

#### No value at all

Since component type can be infered from actual tag name and attributes, and
field name can be provided as regular property, the whole *data-smark*
attribute value can be omitted if we are happy with this inference:

**Example:**

  * **Shorthand:** `<textarea ... data-smark>`
  * **Long Form:** `<textarea data-smark='{}>`
  * **Equivalent (type infered) value:** `<textarea data-smark='{"type": "input"}>`



## Mandatory properties

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

