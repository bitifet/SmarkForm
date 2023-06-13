<a href="https://www.npmjs.com/package/smarkform">
<img alt="SmarkForm Logo" align="left" src="SmarkForm_logo.jpg">
</a>
<h1>Reference Manual</h1>
<strong>
Powerful while effortless Markup-driven and Extendable forms
</strong>




## About SmarkForm

<details>
<summary>
<h3>Introduction</h2>
</summary>
<!-- vim-markdown-toc GitLab -->

* [The Basics](#the-basics)
    * [The `data-smark` attribute](#the-data-smark-attribute)
    * [Components and Actions](#components-and-actions)
    * [Components](#components)
    * [Actions](#actions)
* [Data Import and Export methods](#data-import-and-export-methods)
* [Code Snippets and Samples](#code-snippets-and-samples)

<!-- vim-markdown-toc -->


SmarkForm simplifies the creation of interactive forms in web applications,
empowering designers to utilize custom templates and seamlessly incorporate
interaction through contextual actions.

Designers can enhance their templates by using their own HTML and CSS, without
the need to deal with complex JavaScript code. SmarkForm enables advanced
capabilities, such as adding or removing items from a list and dynamically
loading options for select dropdowns, even if they depend on the values of any
other field in the form. This can be achieved simply by adding the 'data-smark'
property to relevant tags.

Developers can leverage these templates as views to import and manipulate
complex data in JSON format. They also have the flexibility to access any
component in the form tree using simple path-style addresses or develop their
own custom component types.

> 🚧 **Please note** that select dropdowns are not yet implemented in the
> current version, but they are planned for inclusion in the upcoming 1.0.0
> release.



</details>


<details>
<summary>
<h3>Principles</h2>
</summary>

Bla bla bla...

</details>


<details>
<summary>
<h3>History and Motivation</h2>
</summary>

Bla bla bla...

</details>


<table>
<tr><th>
🚧  ＷＯＲＫ  ＩＮ  ＰＲＯＧＲＥＳＳ  🚧
</h></tr>
<tr><td>

This documentation is still in **draft** stage.

⚠️  All information may be incomplete, inaccurate, outdated or even **completely
wrong**.

👍 We welcome any feedback, suggestions, or improvements as we continue to
enhance and expand the functionality of SmarkForm.

</td></tr>
</table>


##  The Basics

### The `data-smark` attribute

The `data-smark` attribute is used in SmarkForm to mark which DOM (HTML tags)
elements are relevant to smarkform and, at the same time, **provide the
required properties** for its enhancement as *SmarkForm* component.

This way, those elements are enhanced as *SmarkForm components* while the rest
are completely ignored by *SmarkForm*.

> 📌 The only exceptions to that are:
> 1. The DOM element passed to SmarkForm constructor is always a *SmarkForm*
>    component.
> 2. The item template of a list component (its only allowed direct child in
>    HTML source before render) is always a *SmarkForm* component, by default
>    of the 'form' type and, hence, the `data-smark` attribute can be ommited.

**Syntax:**

The `data-smark` attribute can be specified in three different ways:

  1. Without any value (Ex.: `<textarea ... data-smark>`).
    - This way the (mandatory) component type is infered in function of the
      actual tag (in this case, it is infered as *input* type).

  2. With a string value (Ex.: `<div ... data-smark="singleton">`).
    - This is equivalent as `<div ... data-smark='{"type": "singleton"}'>`.

  3. With a valid JSON string (Ex.: `<div data-smark='{"type"="list", "name":
     "myList"}'>`).

**Mandatory attributes:**

  * The `type` attribute is always necessary to determine which component type
    controller must be used to render the component. But many times it can be
    contextually infered either by the actual tag name or for the presence of
    the `action` property which forces the type to "action".

  * The `name` attribute is necessary for all **non action** components.
    - If not explicitly provided it can be infered by the presence of the
      `name` property of the actual tag being enhanced. Ex.: `<input name="foo"
      data-smark>`.
    - If not provided and cannot be infered, a randomly generated name will be
      used in place.

**Other attributes:**

...


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


