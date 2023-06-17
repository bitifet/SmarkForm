
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
    * [The `data-smark` Attribute](#the-data-smark-attribute)
    * [Components and Actions](#components-and-actions)
    * [Components](#components)
    * [Actions](#actions)
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

The following properties are mandatory:

- The `type` property is always necessary to determine which component type
  controller should be used for rendering the component. In many cases, it can be
  inferred based on the tag name or the presence of the `action` property, which
  forces the type to be "action".

- The `name` property is required for all non-action components.
   - If not explicitly provided, it can be inferred from the `name` property of
     the tag being enhanced. For example, `<input name="foo" data-smark>`.
   - If not provided and cannot be inferred, a randomly generated name will be
     used.


**Other properties:**

Depending on actual componenta type other properties may be applicable.

In case of *actions*, despite `type`and `name`, is worth to mention that,
except for the `for` and `to` properties



FIXME: To be continued...

TODO: Link 'for' and 'to' to propper type_action.md section...



### Components and Actions

### Components

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


### Actions

*Actions* are operations that can be performed over components.

Some of them such as `import`, `export` and `empty` are available for all
components types while others are tied to secific types like `addItem` an d
`removeItem` for lists, etc...


----------------------------------------------------------------------------

FIXME: Nowadays import() and export() are not declared as actions because we
thought there was nowhere from/to import/export on user click.

But this can (and should) change allowing to provide onImport() and onExport()
callbacks.

This way there will be no need for custom "submit" action (which will be just
an "export" action button) in our playground example.

Also in that example, "cancel" custom action relies in the "empty" action which
we can evolve to handle the same small tweaks.


**Proposal:**

```javascript
window.form = new SmarkForm(
    document.querySelector("#main-form")
    , {} // "root actions" which now I seriously consider to remove
    , {
        autoId: true,
        async onExportAction({data}) {
            alert (JSON.stringify(data)));
        },
        async onEmptyAction({context, isEmpty, preventDefault}) {
            // "Legacy" approach:
            if (
                (await context.isEmpty())
                || confirm("Are you sure?")
            ) return;

            // Approach with additional isEmpty property:
            if (
                isEmpty
                || confirm("Are you sure?")
            ) return;

            // Abort otherwise:
            preventDefault();
        },
    }
);
```

----------------------------------------------------------------------------


A SmarkForm *action* is a *component* of type "action" and a (mandatory)
property "action" pointing to the actual action to be taken when clicked.

For actions the *type* property can be omitted (since is infered by the
presence of the *action* property itself) but, if present, its value must be
"action".

**Example:**

```html
<button data-smark='{action: "removeItem"}'></button>
```

> 📖 For detailed information see [Action Type Documentation](type_action.md).






## Data Import and Export methods



## Code Snippets and Samples

  * [💾 SmarkForm Examples collection in CodePen](https://codepen.io/collection/YyvbPz)


