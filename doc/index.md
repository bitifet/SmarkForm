<a href="https://www.npmjs.com/package/smarkform">
<img alt="SmarkForm Logo" align="left" src="SmarkForm_logo.jpg">
</a>
<h1>Reference Manual</h1>
<strong>
Powerful while effortless Markup-driven and Extendable forms
</strong>


<details>
<summary>
<h2>📖 Table of Contents</h2>
</summary>

<!-- vim-markdown-toc GitLab -->

* [📜 About SmarkForm](#-about-smarkform)
* [👉 SmarkForm form](#-smarkform-form)
* [👉 Components and Actions](#-components-and-actions)
    * [Components](#components)
    * [Actions](#actions)
* [👉 Core Component Types](#-core-component-types)
* [👉 Component Options](#-component-options)
* [👉 data-smark (options) object](#-data-smark-options-object)
    * [type property](#type-property)
        * [Common properties for components](#common-properties-for-components)
            * [name](#name)
    * [action property](#action-property)
        * [Common properties for actions](#common-properties-for-actions)
            * [for](#for)
            * [to](#to)
* [👉 Data Import and Export methods](#-data-import-and-export-methods)
* [💾 Code Snippets and Samples](#-code-snippets-and-samples)

<!-- vim-markdown-toc -->

</details>



## 📜 About SmarkForm

<details>
<summary>
<h2>👉 Introduction</h2>
</summary>

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
<h2>👉 Principles</h2>
</summary>

Bla bla bla...

</details>


<details>
<summary>
<h2>👉 History and Motivation</h2>
</summary>

Bla bla bla...

</details>

<details>
<summary>
<h2>🚧 ＷＯＲＫ  ＩＮ  ＰＲＯＧＲＥＳＳ 🚧</h2>
</summary>

This documentation is still in draft stage.

All information may be incomplete, inaccurate, outdated or even **completely
wrong**.

👍 We welcome any feedback, suggestions, or improvements as we continue to
enhance and expand the functionality of SmarkForm.

</details>





## 👉 SmarkForm form

To build a simple SmarkForm form you could start with simple html page:

```html
<html>
  <head>
    <title>My first SmarkForm form</title>
  </head>
  <body>
    <div id="myForm">
      <p>
        <label for="name">Name</label>
        <input data-smark="data-smark" name="name" type="text"/>
      </p>
      <p>
        <label for="surname">Surname</label>
        <input data-smark="data-smark" name="surname" type="text"/>
      </p>
      <hr/>
      <button data-smark='{action: "cancel"}'>Cancel</button>
      <button data-smark='{action: "submit"}'>Submit</button>
    </div>
    <script src="path/to/SmarkForm.umd.js"></script>
    <script>
      const myForm = new SmarkForm(
          document.querySelector("#myForm")
          , {
              submit({context}) {
                  alert (JSON.stringify(context.export()));
              },
              cancel({context}) {
                  if (
                      context.isEmpty()
                      || confirm("Are you sure?")
                  )  context.empty();
              },
          }
      );
    </script>
  </body>
</html>
```

## 👉 Components and Actions

### Components

A SmarkForm *component* is just a DOM element (HTML tag) which as a "data-smark"
property providding a JSON-formatted *options* object.

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
presence of the *action* property itself) but, it present, it must be "action".

**Example:**

```html
<button data-smark='{action: "removeItem"}'></button>
```

> 📖 For detailed information see [Action Type
> Documentation](doc/type_action.md).


## 👉 Core Component Types

| Type | Description                     | Shared Capabilities              |
|------|---------------------------------|----------------------------------|
| [Form](doc/type_form.md)           |   | [foldable](doc/capabilities.md#foldable) |
| [Input](doc/type_input.md)         |   |                                  |
| [List](doc/type_list.md)           |   | [foldable](doc/capabilities.md#foldable) |
| [Singleton](doc/type_singleton.md) |   |                                  |
| [Action](doc/type_action.md)       |   |                                  |




## 👉 Component Options

...

------------

For regular components...

type            | 🔒 action | form | list | input |
----------------|-----------|------|------|-------|
action          | [☑️ ](#action-property) | ❌ | ❌ | ❌ |
name            | ✖️      | [✅]() 
for             | [✅]() | 🔗      | 🔗   | 🔗    |
to              | [✅]() | 🔗      | 🔗   | 🔗    |

(Legend to be continued...)


For actions...

type            | 🔒 action | form | list | input |
----------------|-----------|------|------|-------|
foldedClass     | [❓]() | [🔗]() | [🔗]() | ✖️  |
unfoldedClass   | [❓]() | [🔗]() | [🔗]() | ✖️  |
keep_non_empty  | [❓]() |        | [🔗]() | ✖️  |
autoscroll      | [❓]() |        | [🔗]() | ✖️  |
failback        | [❓]() |        | [🔗]() | ✖️  |

------------

✅ Optional option.
☑️  Mandatory option.
❓ Depends on targetted component type.
🔗 Have actions supporting it.
✖️  Unused/Ignored option.
❌ Forbidden (not allowed for that type)
🔒 Forcibly set to when [action property](#action-property) is defined.


## 👉 data-smark (options) object

### type property

#### Common properties for components

##### name


### action property


#### Common properties for actions

##### for

##### to








## 👉 Data Import and Export methods



## 💾 Code Snippets and Samples



