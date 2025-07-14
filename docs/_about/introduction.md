---
title: Introduction
layout: chapter
permalink: /about/introduction
nav_order: 1

---


# {{ page.title }}

**SmarkForm** is a powerful yet effortless markup-driven form library that
simplifies the creation of interactive forms in web applications. It grants
designers full control over the form’s appearance, enabling developers to
concentrate on business logic.

It imports and exports data in JSON format, supports nested forms and
variable-length lists, properly sanitizes and formats values according to its
field type, implements declarative restrictions like whether null is allowed or
not, maximum and minimum length for lists, etc...

SmarkForm provides a smooth and intuitive user experience while addressing some
native HTML limitations; such as forcing `type="color"` fields to always hold a
valid color value, which makes it impossible to tell whether the user selected the
black color on purpose or if he just meant that the actual color is unknown.

Other features include context-driven keyboard shortcuts, smart
auto-enablement/disablement of controls depending on whether they are applicable
or not, among others...

All that in a 100% declarative approach providing a consistent UX across very
different forms.


👉 See the [Showcase]({{ "/about/showcase" | relative_url }}) for a quick
overview of what SmarkForm can do.


## Motivation

Three decades after the advent of web forms, their limitations persist.
Traditional HTML forms are limited in structure and lack flexibility. They only
support a single level of discrete key-value pairs, limited to text-only values
while modern applications often require complex JSON structures with nested
objects and arrays, which cannot be directly accommodated by legacy HTML forms.

Web component libraries and frameworks, in turn, address this issue by shifting
templating and design logic from the view to the controller layer. However,
this approach forces developers to manually implement custom behaviors by
connecting multiple form components together. Additionally, it places the
burden of dealing with templating and styling details on developers, while
designers lose control over the appearance of inner components. As a result,
this approach leads to non-reusable and bespoke (unless you are Ok with
sticking to the same appearance) implementations for each form.

Repeatedly reinventing components or adapting complex frameworks with every
design change, along with struggles in importing/exporting JSON, managing
dynamic subforms and lists, or enabling seamless usability and accessibility,
are common challenges.

SmarkForm was created to address these challenges while preserving flexibility
for designers and reducing maintenance overhead for developers. It provides a
powerful and flexible solution for building forms directly in the markup (view
layer) that seamlessly handles deep JSON structures while providing advanced
features like subforms and variable-length lists. Designers can create custom
templates using their existing HTML and CSS knowledge, while developers can
import and manipulate complex data in JSON format.

