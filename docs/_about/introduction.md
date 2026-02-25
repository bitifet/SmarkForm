---
title: Introduction
layout: chapter
permalink: /about/introduction
nav_order: 1

---


# {{ page.title }}


## What SmarkForm Is (and Isn't Yet)

**SmarkForm is:**
- ✅ A **markup-driven** form controller: configuration lives in `data-smark`
  attributes, keeping HTML and JavaScript cleanly separated.
- ✅ **Markup-agnostic**: it imposes no HTML structure or CSS on your design —
  designers keep full freedom, developers don't worry about layout changes.
- ✅ A tool for **JSON-based import/export** of complex, nested form data
  including subforms and variable-length lists.
- ✅ Ready for **context-driven hotkeys** and smooth keyboard navigation.
- ✅ Stable and in active use, but still pre-1.0 (API may evolve).

**Not yet implemented (planned for a future release):**
- ❌ Built-in validation (field-level error messages).
- ❌ Native `<form>` tag POST submission — use `AfterAction_export` + `fetch` for now.
- ❌ The "API interface" for dynamic dropdown/select options from a server.

{: .info :}
> ⚠️ SmarkForm is currently at **version 0.x**. The implemented features are
> stable, but breaking changes may still occur before 1.0.
> See the [Roadmap]({{ "/about/roadmap" | relative_url }}) for what's coming next.


## About SmarkForm

*SmarkForm* is a lightweight and *extendable* form controller that enhances
HTML forms to support **subforms** and variable-length **lists** without tying
the layout to any specific structure. This enables it to **import and export
data in JSON** format, while providing a smooth navigation with configurable
hotkeys and a low-code experience among other features.

In *SmarkForm*, *(sub)forms* and *lists* are just form fields that
import/export their data as JSON, number fields return numbers, checkboxes
return booleans, radio buttons sharing the same name are threated as single
field, color pickers can return null to distinguish when the color is unknown,
and so on...

Special components called *triggers* can be placed along the form to call
specified *actions* like adding or removing items from lists, importing or
exporting data, etc... **They automatically connect to the proper fields** just
by their *context* (i.e., their position in the form) which can be altered
through specific properties..

Forms and lists can be nested to any depth, lists can dynamically grow or
shrink. This allow to generate any possible JSON structure, from simple
form.

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

