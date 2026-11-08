---
title: Introduction
layout: chapter
description: "Why SmarkForm exists, the HTML-to-component-tree model it uses, and how to decide whether it fits your project."
permalink: "/about/introduction"
nav_order: 1
---

{% include links.md %}

# {{ page.title }}


<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {% include chaptertoc/introduction.html %}

</details>


<a id="about-smarkform"></a>

## What SmarkForm is {#what-smarkform-is-and-isnt-yet}

SmarkForm is a DOM-first form controller. You keep the HTML and CSS, mark the
elements it should manage with `data-smark`, and call `new SmarkForm(root)`.
SmarkForm enhances that subtree instead of replacing it with a schema or a
component renderer.

A form becomes a **component tree**. The root form, nested forms, lists, and
value fields are all components. Named fields become object properties; list
item templates become array elements; forms and lists can nest to any depth.
Importing or exporting the root therefore moves ordinary structured data in
and out of the UI.

👉 For a more detailed overview of what the library can do, see [Features]({{
"/about/features" | relative_url }}).

## The problem it addresses {#motivation}

HTML gives us robust form controls and accessibility primitives, but it does
not give us a model of a whole form. Once a form has nested sections, repeated
rows, or cross-field behavior, developers usually reimplement the same plumbing
in JavaScript: find the controls, keep state in sync, add and remove rows,
coerce values, and serialize the result. The DOM stores controls; it does not
store the structured value the application needs.

SmarkForm adds that missing layer declaratively. It builds a component tree
over the DOM you authored, exposes values at every level, and applies actions
to the right part of the tree. Structural operations such as adding an item,
clearing a field, or exporting a subform are expressed in markup or in one
consistent API.

SmarkForm does not remove the need to design the form, validate it, submit it,
or make it accessible. It makes the structural plumbing explicit and reusable,
so those concerns stay in your normal HTML, CSS, and JavaScript workflow.

## How it relates to frameworks and schema-driven forms

Three broad approaches are common:

* **General-purpose UI frameworks** (React, Vue, Svelte, Angular) render the
  interface and manage application state. SmarkForm does not render a
  component tree into the page; it enhances DOM that already exists and keeps
  its own form-component tree in sync with it.
* **Schema-rendered form libraries** generate fields from a schema. SmarkForm
  starts from authored HTML and treats your markup and nesting as the source
  of truth.
* **DOM-first form controllers** such as SmarkForm keep the markup but add a
  structured value model and form-level actions.

None of these approaches is universally better. The choice depends on where the
form's structure comes from, who owns the markup and styles, how the rest of the
application manages state, and whether you need a validation or schema layer.
See [When SmarkForm Fits]({{ "/about/when_smarkform_fits" | relative_url }}) for
a fuller decision guide and worked comparison.

## Current status and scope

SmarkForm is stable and in active use, but still **pre-1.0**: implemented
behavior is covered by tests, while the public API may evolve before 1.0.0. It
is not a schema renderer, a validation library, or an official React/Vue/Angular
adapter. Validation, submission, and server-side trust remain application
responsibilities.

See [Features]({{ "/about/features" | relative_url }}) for what is implemented,
the [Roadmap]({{ "/about/roadmap" | relative_url }}#current-status) for what is
planned, and the [FAQ]({{ "/about/faq" | relative_url }}) for common edge cases.

## Learn more

* [Quick Start]({{ "/start_here/quick_start" | relative_url }}) — create a form
  and export a useful value.
* [Getting SmarkForm]({{ "/start_here/getting_smarkform" | relative_url }}) —
  CDN, npm, and downloaded copies.
* [Core Concepts]({{ "/start_here/core_concepts" | relative_url }}) — the
  component tree, data model, and `data-smark` syntax.
* [Using SmarkForm]({{ "/guides/using_smarkform" | relative_url }}) — a fuller
  developer walkthrough.
* [Showcase]({{ "/showcase_examples/showcase" | relative_url }}) — interactive
  examples.
