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

* [data-smart (options) object](#data-smart-options-object)
    * [type property](#type-property)
        * [Common properties for components](#common-properties-for-components)
            * [name](#name)
    * [action property](#action-property)
        * [Common properties for actions](#common-properties-for-actions)
            * [for](#for)
            * [to](#to)
* [Core Component Types](#core-component-types)
    * [form](#form)
    * [input](#input)
    * [list](#list)
        * [List actions](#list-actions)
            * [addItem](#additem)
                * [addItem properties](#additem-properties)
            * [removeItem](#removeitem)
    * [singleton](#singleton)
    * [action](#action)
* [Data Import and Export methods](#data-import-and-export-methods)

<!-- vim-markdown-toc -->




SmartForm Component
===================

A SmartForm component is just a DOM element (HTML tag) which as a "data-smart"
property.

It simplest form looks as follows:

```html
<input data-smart="data-smart"/>
```

This is equivalent to:

```html
<input data-smart='input'/>
```

...or:

```html
<input data-smart='{type: "input"}'/>
```

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
      <button data-smart="{action: &quot;cancel&quot;}">Cancel</button>
      <button data-smart="{action: &quot;submit&quot;}">Submit</button>
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
                      ! context.isEmpty()
                      && confirm("Are you sure?")
                  )  context.import();
              },
          }
      );
    </script>
  </body>
</html>
```

For the sake of simplicity, from now on, in the rest of this document we'll be
using [Pug templates](https://pugjs.org) since they're way more readable than
bare HTML and quite easy to understand even if you are'nt used to them.

Just as an example, previous snipped would hav look like this:

```pugjs
html
    head
        title My first SmartForm form
    body
        div#myForm
            p
                label(for="name") Name
                input(data-smart name="name", type="text")
            p
                label(for="surname") Surname
                input(data-smart name="surname", type="text")
            hr
            button(data-smart='{action: "cancel"}') Cancel
            button(data-smart='{action: "submit"}') Submit
        script(src="path/to/SmartForm.umd.js")
        script.
            const myForm = new SmartForm(
                document.querySelector("#myForm")
                , {
                    submit({context}) {
                        alert (JSON.stringify(context.export()));
                    },
                    cancel({context}) {
                        if (
                            ! context.isEmpty()
                            && confirm("Are you sure?")
                        )  context.import();
                    },
                }
            );
```



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






Core Component Types
====================

form
----

input
-----

list
----

### List actions


#### addItem


##### addItem properties


#### removeItem

  * target
  * keep_non_empty


singleton
---------

action
------



Data Import and Export methods
==============================






