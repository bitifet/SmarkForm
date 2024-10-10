---
title: About SmarkForm
layout: chapter
permalink: /about/about_smarkform
nav_order: 1

---

# {{ page.title }}

<details>
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Introduction](#introduction)
* [Why SmarkForm](#why-smarkform)
* [The SmarkForm Approach](#the-smarkform-approach)
* [Status](#status)
    * [Core functionality.](#core-functionality)
    * [Select component type.](#select-component-type)
    * [Trigger component](#trigger-component)
    * [Automated tests](#automated-tests)
    * [Documentation](#documentation)
* [History](#history)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


## Introduction

<b>Smarkform</b> is a powerful while effortless Markup-driven and Extendable forms.

It simplifies the creation of interactive forms in web applications, empowering designers to utilize custom templates and seamlessly incorporate interaction through contextual actions.

**Designers** can enhance their templates by using their own HTML and CSS, without
the need to deal with complex JavaScript code.

SmarkForm enables advanced
capabilities, such as adding or removing items from a list and dynamically loading options for select dropdowns, even if they depend on the values of any
other field in the form.

This is achieved simply by means of adding the 'data-smark'
property to relevant tags.

**Developers** can leverage these templates as views to import and manipulate complex data in JSON format.

They also have the flexibility to access any component in the form tree using simple path-style addresses being able to import/export subforms, react to change events and a lot more…

They are able to develop custom component types as well which designers can then place wherever they want.

{: .warning}
> 🚧 **Please note** that select dropdowns (as explained before) are not yet implemented in the
> current version (but they are planned for inclusion in the upcoming 1.0.0). Of course, for regular behaviour you can simply use a `<select>` tag in a regular *type = input* component.
> release.


## Why SmarkForm

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


## The SmarkForm Approach

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


## Status

SmarkForm implementation is stable and fully functional, but not all initially
planned requirements are yet implemented. Hence, it's not yet in the 1.0.0
version.

It still lacks two of its planned key features:

  * The API Interface.
  * The [🔗 `<select>` component type]({{ "/component_types/type_select" |
    relative_url }}).

{: .warning }
> Even this documentation is not yet finished and may be incomplete, inaccurate
> or outdated in many of its sections.


**🚧  ＷＯＲＫ  ＩＳ  ＩＮ  ＰＲＯＧＲＥＳＳ...  🚧**  <big style="font-size: 2em;">&nbsp;&nbsp;😉</big>



### Core functionality.


*SmarkForm* Core functionality is in mature state.

Almost all initially planed features are implemented and working well.

The only exception is the "API interface" which will allow future *select*
component type to fetch its optinons dynamically depending on the value of
other fields (See *Select Component* in [Core component
types](#core-component-types) section).


### Select component type.

Select component will be capable of loading its options from a remote API call
by passing its *src* property to so called "API Interface".

The *API Interface* will allow *select* (and other future components) to fetch
their options dynamically from an external API and react to any change in any
other fields whose value were used as argument to the API call.

For detailed explanation see: [Select Component Type](type_select.md).



### Trigger component

Fully functional but only for regular clicks.

Special behaviours for right / middle / (other) cliks, keyboard events, etc...
may be eventually implemented in the future. But not a priority yet.


### Automated tests

A mature testing structure with mocha and puppetter is set up to easily
implement tests over any SmarkForm feature.

But only a few actual tests are implemented yet. More tests need to be
developed to ensure all functionality keeps working while implementation
advances.


### Documentation

  * This Reference Manual is quite mature. But API documentation still needs a
    lot of work...

  * **Last Updated:** {{ site.data.computed.lastUpdated }}.


## History

