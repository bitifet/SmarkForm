SmartForm
=========

> Powerful and Extendable HTML Form Enhancer.

------------------------------

#      WORK IN PROGRESS      #

------------------------------


This document is still in draft stage.

Index
=====

<!-- vim-markdown-toc GitLab -->

* [SmartForm form](#smartform-form)
* [Components and Actions](#components-and-actions)
        * [Components](#components)
        * [Actions](#actions)
* [Core Component Types](#core-component-types)
* [Component Options](#component-options)
* [data-smart (options) object](#data-smart-options-object)
    * [type property](#type-property)
        * [Common properties for components](#common-properties-for-components)
            * [name](#name)
    * [action property](#action-property)
        * [Common properties for actions](#common-properties-for-actions)
            * [for](#for)
            * [to](#to)
* [Data Import and Export methods](#data-import-and-export-methods)

<!-- vim-markdown-toc -->





SmartForm form
==============

To build a simple SmartForm form you could start with simple html page:

```html
<html>
  <head>
    <title>My first SmartForm form</title>
  </head>
  <body>
    <div id="myForm">
      <p>
        <label for="name">Name</label>
        <input data-smart="data-smart" name="name" type="text"/>
      </p>
      <p>
        <label for="surname">Surname</label>
        <input data-smart="data-smart" name="surname" type="text"/>
      </p>
      <hr/>
      <button data-smart='{action: "cancel"}'>Cancel</button>
      <button data-smart='{action: "submit"}'>Submit</button>
    </div>
    <script src="path/to/SmartForm.umd.js"></script>
    <script>
      const myForm = new SmartForm(
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

Components and Actions
======================

### Components

A SmartForm *component* is just a DOM element (HTML tag) which as a "data-smart"
property providding a JSON-formatted *options* object.

It looks like as follows:

```html
<input data-smart='{type: "input"}'/>
```

> 📌 If only type option is specified, it can be simplified as:
> ```html
> <input data-smart='input'/>
> ```
> ...or just leave it empty to let SmartForm engine to figure out its type:
> ```html
> <input data-smart="data-smart"/>
> ```

### Actions

A SmartForm *action* is a *component* of type "action" and a (mandatory)
property "action" pointing to the actual action to be taken when clicked.

For actions the *type* property can be omitted (since is infered by the
presence of the *action* property itself) but, it present, it must be "action".

**Example:**

```html
<button data-smart='{action: "removeItem"}'></button>
```


Core Component Types
====================

| Type | Description                     | Shared Capabilities              |
|------|---------------------------------|----------------------------------|
| [Form](doc/type_form.md)           |   | [foldable](doc/deco_foldable.md) |
| [Input](doc/type_input.md)         |   |                                  |
| [List](doc/type_list.md)           |   | [foldable](doc/deco_foldable.md) |
| [Singleton](doc/type_singleton.md) |   |                                  |
| [Action](doc/type_action.md)       |   |                                  |




Component Options
=================

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


data-smart (options) object
===========================

type property
-------------

### Common properties for components

#### name


action property
---------------


### Common properties for actions

#### for

#### to








Data Import and Export methods
==============================






