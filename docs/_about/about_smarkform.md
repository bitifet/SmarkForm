---
title: About SmarkForm
layout: default
nav_order: 1

---

## About SmarkForm

<details>
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Introduction](#introduction)
* [Why SmarkForm](#why-smarkform)
* [The SmarkForm Approach](#the-smarkform-approach)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


### Introduction

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

{: .caution}
> 🚧 **Please note** that select dropdowns (as explained before) are not yet implemented in the
> current version (but they are planned for inclusion in the upcoming 1.0.0). Of course, for regular behaviour you can simply use a `<select>` tag in a regular *type = input* component.
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

