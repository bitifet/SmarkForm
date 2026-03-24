---
title: "Mixin Types (Draft)"
layout: chapter
permalink: /advanced_concepts/mixin_types
nav_order: 6

---

{% include links.md %}

# {{ page.title }}

{: .caution }
> **This document is a DRAFT specification.** The feature described here has
> not yet been implemented. Details are subject to change as design is refined.

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Overview](#overview)
* [Defining a Mixin Template](#defining-a-mixin-template)
* [Using a Mixin Type](#using-a-mixin-type)
    * [Local mixin reference](#local-mixin-reference)
    * [External mixin reference](#external-mixin-reference)
* [Template Constraints](#template-constraints)
* [Expansion Semantics](#expansion-semantics)
* [Option Merge Semantics](#option-merge-semantics)
* [Attribute Merge Semantics](#attribute-merge-semantics)
* [External Loading and Caching](#external-loading-and-caching)
    * [URL resolution](#url-resolution)
    * [Fetch and cache strategy](#fetch-and-cache-strategy)
    * [Nested mixins and circular dependency detection](#nested-mixins-and-circular-dependency-detection)
* [List Placement Warning](#list-placement-warning)
* [Scripts and Styles](#scripts-and-styles)
    * [Styles](#styles)
    * [Scripts](#scripts)
    * [Open Questions — Cross-Origin Script Security Policy](#open-questions-cross-origin-script-security-policy)
* [Error Codes](#error-codes)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


## Overview

**Mixin types** allow a SmarkForm component to be defined by an HTML
`<template>` element rather than by a fixed native type such as `form`,
`list`, or `input`.  They give authors a lightweight way to create reusable
component "blueprints" that can be stamped out anywhere in a form tree —
and even loaded from external files — without writing any JavaScript.

A mixin type is identified by a **mixin type reference**: a string that starts
with `#` (local template) or contains `#` (external URL + template id):

| Reference | Meaning |
|---|---|
| `"#myWidget"` | Template with `id="myWidget"` in the current document |
| `"./widgets.html#myWidget"` | Template with `id="myWidget"` in external file `widgets.html` |
| `"https://cdn.example.com/sf-widgets.html#myWidget"` | Absolute URL + template id |

Whenever SmarkForm sees a `type` value that is a mixin reference it:

1. Locates the referenced `<template>` element (locally or via fetch).
2. Clones the template's single root element.
3. Merges attributes and `data-smark` options from the placeholder node into
   the clone.
4. Replaces the placeholder node with the clone in the DOM.
5. Continues enhancement as if the clone had been there from the start.


## Defining a Mixin Template

A mixin is declared with a plain HTML `<template>` element that has an `id`:

```html
<template id="myWidget">
  <div data-smark='{"type":"form"}'>
    <input data-smark='{"name":"value"}' type="text">
  </div>
</template>
```

The `<template>` element itself requires **no** `data-smark` attribute; its
purpose is solely to hold the blueprint markup.

{: .hint }
> Place `<template>` elements at document level (e.g., directly inside
> `<body>`, or in `<head>` when the browser allows it) — **not** as direct
> children of a SmarkForm `list` container.  See the
> [List Placement Warning](#list-placement-warning) section.


## Using a Mixin Type

### Local mixin reference

Reference a template in the same document by its `id`, prefixed with `#`:

```html
<!-- Declare the mixin template once -->
<template id="labeledInput">
  <label data-smark>
    <span class="label-text"></span>
    <input type="text">
  </label>
</template>

<!-- Use the mixin type anywhere in the form -->
<form id='myForm'>
  <div data-smark='{"type":"#labeledInput","name":"firstName"}'></div>
  <div data-smark='{"type":"#labeledInput","name":"lastName"}'></div>
</form>
```

### External mixin reference

Reference a template in an external HTML file using a relative or absolute URL
followed by `#<templateId>`:

```html
<form id='myForm'>
  <!-- Load template from a shared widget library -->
  <div data-smark='{"type":"./shared/widgets.html#phoneField","name":"phone"}'></div>
  <div data-smark='{"type":"./shared/widgets.html#emailField","name":"email"}'></div>
</form>
```

The external file `shared/widgets.html` would contain:

```html
<!DOCTYPE html>
<html>
<body>

<template id="phoneField">
  <label data-smark>
    <span>Phone</span>
    <input type="tel" data-smark='{"name":"number"}'>
  </label>
</template>

<template id="emailField">
  <label data-smark>
    <span>E-mail</span>
    <input type="email" data-smark='{"name":"address"}'>
  </label>
</template>

</body>
</html>
```

{: .info }
> External URLs are resolved against `document.baseURI` (for relative paths).
> The same external document is fetched **only once** per page load and its
> templates are cached for all subsequent references.


## Template Constraints

The referenced `<template>` must satisfy the following constraints; otherwise
SmarkForm raises a normative error (see [Error Codes](#error-codes)):

| Constraint | Rationale |
|---|---|
| The `<template>` element must exist and its `id` must match the fragment | Without it there is nothing to clone |
| The template must contain **exactly one root element node** | SmarkForm replaces the placeholder with a single node; extra text or comment nodes are ignored, but extra element nodes are an error |
| The template root element must **not** specify a `name` inside its `data-smark` options | The name belongs to the placeholder (the usage site), not the blueprint |

```html
<!-- ✅ Valid: single root, no name -->
<template id="myField">
  <div data-smark='{"type":"form"}'> ... </div>
</template>

<!-- ✅ Valid: root may omit data-smark entirely -->
<template id="simpleWidget">
  <div class="widget"> ... </div>
</template>

<!-- ❌ Invalid: two root elements -->
<template id="broken">
  <div>first</div>
  <div>second</div>
</template>

<!-- ❌ Invalid: root has "name" in data-smark -->
<template id="namedRoot">
  <div data-smark='{"name":"hardcoded"}'> ... </div>
</template>
```


## Expansion Semantics

Mixin expansion is a **preprocessing step** that happens during SmarkForm's
component discovery/enhancement pass, before the replaced node is itself
enhanced.  From the perspective of the rest of the rendering pipeline the
mixin placeholder never existed; only its expanded form is visible.

The sequence is:

1. SmarkForm encounters a node whose `data-smark.type` is a mixin reference.
2. SmarkForm resolves and fetches (if external) the referenced template.
3. The template's single root element is cloned (deep clone).
4. Attributes and options are merged (see the next two sections).
5. The **placeholder node is replaced** in the DOM with the merged clone.
6. Enhancement continues on the clone as if it were the original node.

{: .info }
> **Future option (not in v1):** A `"placement"` option could allow `"nest"`
> (wrap placeholder inside the clone) in addition to the default `"replace"`.
> v1 only supports `"replace"`.


## Option Merge Semantics

The placeholder's `data-smark` options are merged with the template root's
`data-smark` options before enhancement begins.  The merge rules are:

| Option key | Rule |
|---|---|
| `name` | Taken from the **placeholder** (placeholder value wins; template root must not set it) |
| `type` | The mixin reference is consumed during expansion and does **not** become the final `type`; the clone's own `type` (if any) is used as the concrete component type |
| All other keys | Placeholder value **overrides** template root value (template provides defaults, placeholder overrides) |

```html
<!-- Template defines default options -->
<template id="countrySelect">
  <select data-smark='{"type":"select","exportEmpty":false}'></select>
</template>

<!-- Placeholder overrides exportEmpty; name comes from placeholder -->
<div data-smark='{"type":"#countrySelect","name":"country","exportEmpty":true}'></div>
```

After expansion the effective options are:
```json
{ "type": "select", "name": "country", "exportEmpty": true }
```


## Attribute Merge Semantics

When the placeholder is replaced by the template root clone, HTML attributes
are merged according to the following rules:

| Attribute | Merge rule |
|---|---|
| `class` | **Union** — template classes and placeholder classes are both preserved |
| `style` | **Concatenation** — template `style` first, then placeholder `style`, separated by `;`; the placeholder can therefore override any template property |
| `aria-*` | Template value is the default; placeholder value **overrides** if present |
| `data-*` (except `data-smark`) | Template value is the default; placeholder value **overrides** if present |
| `id` | **Not copied/merged**; if the placeholder carries an `id` it is ignored (with a warning) because SmarkForm may later assign auto-generated ids |
| All other attributes | Non-conflicting attributes are copied from the placeholder to the clone; where both define the same attribute, the **placeholder wins** |

```html
<!-- Template root -->
<template id="fancyInput">
  <input data-smark class="form-control" style="border: 1px solid #ccc;" aria-required="false">
</template>

<!-- Usage site -->
<div
  data-smark='{"type":"#fancyInput","name":"email"}'
  class="email-field"
  style="color: red;"
  aria-required="true"
></div>
```

After expansion the effective element is:
```html
<input
  data-smark='{"name":"email"}'
  class="form-control email-field"
  style="border: 1px solid #ccc;color: red;"
  aria-required="true"
>
```


## External Loading and Caching

### URL resolution

A mixin type reference **must** contain a `#<templateId>` fragment.  A
reference without a fragment causes a `MIXIN_TYPE_MISSING_FRAGMENT` error.

- **Local reference** (`"#<templateId>"`): the template is looked up by `id`
  in `document`.
- **External reference** (`"<url>#<templateId>"`): the URL part (everything
  before `#`) is resolved against `document.baseURI` using the standard
  `URL` constructor.

### Fetch and cache strategy

External documents are fetched once per page load.  The recommended internal
cache is:

```
Map<absoluteUrlWithoutFragment, Promise<Document>>
```

On first access SmarkForm initiates a `fetch()`, parses the response as HTML,
and stores the resulting `Promise<Document>` in the map.  All subsequent
requests for the same URL (even with different fragment ids) reuse the same
cached promise, so only one network request is ever made per external document.

The **expansion stack** (used for circular dependency detection) uses a
different, more specific key format: `absoluteUrl#templateId`.  This
distinction is intentional — the document cache is keyed by URL alone because
one fetch retrieves all templates from that document, while the expansion stack
is keyed per template to catch cycles at the individual template level.

### Nested mixins and circular dependency detection

A mixin template may itself reference another mixin type (nested mixins).
To prevent infinite expansion, SmarkForm maintains an expansion stack of keys
of the form `absoluteUrl#templateId` (local references use `document.baseURI`
as their URL).  Before expanding any mixin SmarkForm checks whether the key is
already present in the stack.  If it is, a `MIXIN_CIRCULAR_DEPENDENCY` error
is thrown.


## List Placement Warning

{: .warning }
> **Do not place `<template>` nodes as direct children of a SmarkForm `list`
> container.**
>
> A `list` component treats **every direct child** as a role template (such as
> `item`, `empty-list`, `add-item`, etc.) and removes those children from the
> DOM during initialisation.  A `<template>` element placed there will be
> silently consumed and will never be available for mixin expansion.
>
> **Recommendation:** Define mixin templates outside any SmarkForm list, for
> example at the top level of `<body>`, inside `<head>` (where browsers
> permit), or in a dedicated `<div>` that is itself not managed by SmarkForm.

```html
<!-- ✅ Safe: template defined at document level -->
<template id="phoneEntry">
  <div data-smark='{"type":"form"}'>
    <input data-smark='{"name":"number"}' type="tel">
  </div>
</template>

<form data-smark='{"id":"contacts"}'>
  <ul data-smark='{"name":"phones"}'>
    <!-- ✅ The mixin type is referenced from inside the list item template,
         not defined here. -->
    <li data-smark='{"role":"item"}'>
      <div data-smark='{"type":"#phoneEntry","name":"phone"}'></div>
    </li>
  </ul>
</form>
```

```html
<!-- ❌ Antipattern: template as direct child of list -->
<ul data-smark='{"name":"phones"}'>
  <template id="phoneEntry"> ... </template>   <!-- consumed by list! -->
  <li data-smark='{"role":"item"}'> ... </li>
</ul>
```


## Scripts and Styles

{: .caution }
> **This section describes intended behaviour that has not yet been
> implemented.  Details may change.**

Support for `<style>` and `<script>` elements inside component markup is
intended as a **general feature** available to `form` and `list` component
types (and via a singleton pattern for scalar fields).  It is documented here
because mixin templates are the most natural place to bundle component-specific
styles and behaviour alongside their markup.

### Styles

A `<style>` element found inside a component root (including a mixin template
root) is extracted and injected into `<head>` once per unique source.
Deduplication is by source identity (same external document + template id for
external styles, or by content for inline `<style>` blocks; the specific
deduplication algorithm is an implementation detail).

{: .info }
> Injected styles are **global**.  Authors are responsible for using specific
> selectors to avoid conflicts between different mixin types.  Future versions
> may introduce scoped styles via a convention-based wrapper selector.

### Scripts

A `<script>` element found inside a component root is extracted, wrapped into
a function, and executed **once per component instance** after the component
has finished rendering.  The function receives `this` bound to the SmarkForm
component instance, enabling direct API access.

```html
<template id="autoFocus">
  <input data-smark type="text">
  <script>
    // `this` is the SmarkForm component instance
    this.on("AfterAction_import", (ev) => {
      console.log("Form loaded with:", ev.data);
    });
  </script>
</template>
```

{: .warning }
> Scripts run per instance.  If a list clones a mixin that contains a
> `<script>`, the script runs for every list item that uses that mixin.
> Ensure handlers are idempotent or clean up on `unrender` to avoid memory
> leaks.

### Open Questions — Cross-Origin Script Security Policy

{: .caution }
> **This sub-section is a draft and the policy has not been finalised.**

Executing scripts sourced from a cross-origin mixin template poses security
risks.  The proposed default behaviour and opt-in options are:

| Behaviour | Description |
|---|---|
| **Default: block** | Scripts from cross-origin mixin templates are not executed.  Rendering continues without the script (a `MIXIN_SCRIPT_CROSS_ORIGIN_BLOCKED` warning is emitted). |
| **`allowCrossOriginScripts: true`** | Opt-in option on the root SmarkForm instance to allow cross-origin scripts.  Authors accept full responsibility for security. |
| **`disableScripts: true`** | Opt-in option to disable all script execution globally (same-origin and cross-origin alike) without failing rendering. |

These options will be specified in more detail during implementation.  Input
from the community on the appropriate defaults is welcome.


## Error Codes

The following normative error codes are defined for the mixin types feature.
Implementations must use these identifiers so that application code can
distinguish error causes programmatically.

| Error code | When thrown |
|---|---|
| `MIXIN_TYPE_MISSING_FRAGMENT` | The mixin type reference does not contain a `#<templateId>` fragment |
| `MIXIN_TEMPLATE_NOT_FOUND` | No `<template>` element with the given `id` exists in the target document |
| `MIXIN_TEMPLATE_INVALID_ROOT` | The template does not contain exactly one root element node |
| `MIXIN_TEMPLATE_ROOT_HAS_NAME` | The template root element's `data-smark` options specify a `name` |
| `MIXIN_CIRCULAR_DEPENDENCY` | The expansion stack already contains the current mixin key (infinite loop detected) |
| `MIXIN_SCRIPT_CROSS_ORIGIN_BLOCKED` | *(Draft)* A cross-origin script was blocked by the default security policy |
