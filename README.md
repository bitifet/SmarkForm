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






