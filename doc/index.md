
<a href="https://www.npmjs.com/package/smarkform">
<img alt="SmarkForm Logo" align="left" src="SmarkForm_logo.jpg">
</a>
<h1>Reference Manual</h1>
<strong>
Powerful while effortless Markup-driven and Extendable forms
</strong>

<!-- Table of Contents {{{ -->

<table align="right"><tr><td>
<details open>
<summary>
<strong>📖 Table of Contents</strong>
</summary>

<!-- vim-markdown-toc GitLab -->

* [About SmarkForm](#about-smarkform)
    * [Introduction](#introduction)
    * [Why SmarkForm](#why-smarkform)
    * [The SmarkForm Approach](#the-smarkform-approach)
* [The Basics](#the-basics)
    * [Creating a simple SmarkForm form](#creating-a-simple-smarkform-form)
    * [The `data-smark` Attribute](#the-data-smark-attribute)
    * [Components and Actions](#components-and-actions)
        * [Components](#components)
        * [Actions](#actions)
        * [Action Components](#action-components)
    * [Accessing Components](#accessing-components)
* [Core Component Types](#core-component-types)
* [Data Import and Export methods](#data-import-and-export-methods)
* [Code Snippets and Samples](#code-snippets-and-samples)

<!-- vim-markdown-toc -->

</details>
</td></tr></table>

<!-- }}} -->

<table align="left">
<tr><th>
🚧  ＷＯＲＫ  ＩＮ  ＰＲＯＧＲＥＳＳ  🚧
</th></tr>
<tr><td align="center">

This documentation is still in **draft** stage.

⚠️  All information may be incomplete, inaccurate, outdated or even **completely
wrong**.

👍 We welcome any feedback, suggestions, or improvements as we continue to
enhance and expand the functionality of SmarkForm.

</td></tr>
</table>


## About SmarkForm

### Introduction

SmarkForm simplifies the creation of interactive forms in web applications,
empowering designers to utilize custom templates and seamlessly incorporate
interaction through contextual actions.

**Designers** can enhance their templates by using their own HTML and CSS, without
the need to deal with complex JavaScript code. SmarkForm enables advanced
capabilities, such as adding or removing items from a list and dynamically
loading options for select dropdowns, even if they depend on the values of any
other field in the form. This can be achieved simply by adding the 'data-smark'
property to relevant tags.

**Developers** can leverage these templates as views to import and manipulate
complex data in JSON format. They also have the flexibility to access any
component in the form tree using simple path-style addresses or develop their
own custom component types.

> 🚧 **Please note** that select dropdowns are not yet implemented in the
> current version, but they are planned for inclusion in the upcoming 1.0.0
> release.


### Why SmarkForm

Traditional HTML forms are limited in structure and lack flexibility. They only
support a single level of discrete key-value pairs, limited to text-only
values.

However, **modern applications often require complex JSON structures** with
nested objects and arrays, which cannot be directly accommodated by legacy
HTML forms.

Web component libraries and frameworks address this issue by shifting
templating and design logic from the view to the controller layer. However,
this approach forces developers to manually implement custom behaviors by
connecting multiple form components together. Additionally, it places the
burden of dealing with templating and styling details on developers, while
designers lose control over the appearance of inner components.

As a result, this approach leads to non-reusable and bespoke implementations
for each form.


### The SmarkForm Approach

SmarkForm tackles these limitations by providing a powerful and flexible
solution for building forms directly in the markup (view layer) that seamlessly
handles deep JSON structures.

With SmarkForm, **designers** can create and modify reusable form components
that effortlessly handle complex data structures, including lists (arrays) with
predefined maximum and/or minimum number of items, and many other nuances
directly handled from the markup. Meanwhile, **developers** can easily import
and export JSON data from the controller layer.

This approach allows for greater flexibility and efficiency in form development
and maintenance.


## The Basics

### Creating a simple SmarkForm form

To create a SmarkForm form, you need to follow a few simple steps:

1. Start by writing the form markup in HTML. For example, let's create a basic
   login form:

```html
<div id="myForm">
  <div>
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" data-smark="data-smark">
  </div>
  <div>
    <label for="password">Password:</label>
    <input type="password" id="password" name="password" data-smark="data-smark">
  </div>
  <p>
    <button data-smark="{"action":"empty"}">❌ Clear</button>
    <button data-smark="{"action":"export"}">💾 Submit</button>
  </p>
</div>
```

> 📌 It is not (yet) advised to use the `<form>` tag for SmarkForm forms.
> 
> If you do so, they will be submit-prevented so they can act as kind of failback
> behvaviours in case of JavaScript being disabled.
> 
> But it's not yet clear which could be a future enhancenment of native `<form>`
> attributes, such as *action*, in successfully enhanced `<form>` tags.


2. Next, include the SmarkForm library in your project. You can do this by
   adding the script tag to your HTML file or by importing it using a module
   bundler like Webpack or Parcel.

```html
<script src="path/to/SmarkForm.js"></script>
```

> 📌 Alternatively you can directly import it as ES module in your JavaScript
> file:
> 
> ```javascript
> import SmarkForm from "https://cdn.skypack.dev/smarkform";
> ```
> 
> See [Installation Instructions](../README.md#installation) for more details.


3. Initialize SmarkForm on your form element. In your JavaScript file, create a
   new instance of the SmarkForm class and pass the form element as the
   parameter:

```javascript
const form = new SmarkForm(document.querySelector("#myForm"));
```

You may also want to do something with data:

```javascript
const myForm = new SmarkForm(
    document.getElementById("myForm")
    , {
        onAfterAction_export({data}) {
            // Show exported data:
            console.log(data);
        },
    }
);
```

Or even gently ask users for confirmation before they loose all their work:

```javascript
const form = new SmarkForm(
    document.querySelector("#myForm")
    , {
        onAfterAction_export({data}) {
            // Show exported data:
            alert (JSON.stringify(data));
        },
        async onBeforeAction_empty({context, preventDefault}) {
            // Ask for confirmation unless form is already empty:
            if (
                ! await context.isEmpty()
                && ! confirm("Are you sure?")
            ) preventDefault();
        },
    }
);
```


That's it! You now have a SmarkForm-enhanced form. SmarkForm will automatically
handle form submission, validation, and other interactions based on the
provided markup and configuration.

You can customize the behavior and appearance of your SmarkForm form by
configuring options and adding event listeners. SmarkForm provides a wide range
of features and capabilities to simplify form development and enhance user
experience.

Start exploring the SmarkForm documentation and examples to discover all the
possibilities and unleash the power of markup-driven form development.


### The `data-smark` Attribute

The `data-smark` attribute is used in SmarkForm to identify and enhance
specific DOM elements (HTML tags) as SmarkForm components. It also provides the
required properties for their enhancement.

By using the `data-smark` attribute, you can mark elements to be transformed
into SmarkForm components, while the remaining elements are ignored by
SmarkForm.

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



### Components and Actions

#### Components

A SmarkForm *component* is just a DOM element (HTML tag) which has a
"data-smark" property providding a JSON-formatted *options* object.

It looks like as follows:

```html
<input data-smark='{type: "input"}'/>
```

> 📌 If only type option is specified, it can be simplified as:
> ```html
> <input data-smark='input'/>
> ```
> ...or just leave it empty to let SmarkForm engine to figure out its type:
> ```html
> <input data-smark/>
> ```


#### Actions

*Actions* are operations that can be performed over components.

Some of them such as `import`, `export` and `empty` are available for all
components types while others are tied to secific types like `addItem` an d
`removeItem` for lists, etc...


#### Action Components

*Action Components* are a special type of *component* that serve to trigger
actions on another compoenent which we refer to it as its "context".

Any SmarkForm component whith an *action* property is an [Action
Component](type_action.md) and for the sake of simplicity, its *type* property
can be ommitted but it cannot take a different value than "action".

**Example:**

```html
<button data-smark='{action: "removeItem"}'></button>
```

> 📖 For detailed information see [Action Type Documentation](type_action.md).



### Accessing Components


```javascript
const form = new SmarkForm(
    document.querySelector("#main-form")
);
```


## Core Component Types


  * [Form](type_form.md)
  * [List](type_list.md)
  * [Input](type_input.md)
  * [Select](type_select.md)
  * [Singleton](type_singleton.md)
  * [Action](type_action.md)


## Data Import and Export methods



## Code Snippets and Samples

  * [💾 SmarkForm Examples collection in CodePen](https://codepen.io/collection/YyvbPz)


