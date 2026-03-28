---
title: "Mixin Types"
layout: chapter
permalink: /advanced_concepts/mixin_types
nav_order: 6

---

{% include links.md %}
{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

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
    * [Cross-Origin Script Security Policy](#cross-origin-script-security-policy)
* [Examples](#examples)
    * [Reusable contact block](#reusable-contact-block)
    * [Option override per usage site](#option-override-per-usage-site)
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
| `<style>` and `<script>` siblings of the root are allowed and **do not count** toward the one-element limit | They carry component styles/behaviour, not markup |
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

<!-- ✅ Valid: <style> and <script> siblings are allowed alongside the root -->
<template id="styledWidget">
  <div data-smark='{"type":"form"}'> ... </div>
  <style>.widget { border: 1px solid #ccc; }</style>
  <script>this.targetNode.classList.add('widget');</script>
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

`<style>` and `<script>` elements can be placed as **siblings** of the root
element inside a `<template>`, giving mixin authors a way to bundle
component-specific styles and behaviour alongside their markup.

{: .info }
> This feature is **exclusive to mixin templates**.  Placing `<style>` or
> `<script>` directly inside a regular page element (outside a `<template>`)
> causes the browser to parse and execute them immediately at page load, making
> deferred/per-instance execution impossible.  The `<template>` tag prevents
> that and is therefore the only supported location.

A mixin template may contain **up to three direct children**:

1. **One root element** (the component markup — required)
2. **One `<style>` element** (component styles — optional)
3. **One `<script>` element** (component behaviour — optional)

```html
<template id="myWidget">
  <div data-smark='{"type":"form"}'>
    <!-- component markup -->
    <input data-smark type="text" name="value">
  </div>
  <style>
    /* Component-specific styles */
    .widget-root { border: 1px solid #ccc; }
  </style>
  <script>
    // Component-specific behaviour (`this` = SmarkForm component instance)
    this.targetNode.classList.add('widget-root');
  </script>
</template>
```

### Styles

A `<style>` element that is a **direct sibling** of the template root element
is extracted and injected into `<head>` exactly once per unique content.
Injecting the same style block from multiple mixin instances is safe — the
deduplication ensures the `<style>` appears in `<head>` only once, regardless
of how many times the mixin is used.

{: .info }
> Injected styles are **global**.  Authors are responsible for using specific
> selectors to avoid conflicts between different mixin types.  Future versions
> may introduce scoped styles via a convention-based wrapper selector.

### Scripts

A `<script>` element that is a **direct sibling** of the template root element
is extracted, wrapped into a function, and executed **once per component
instance** after the component has finished rendering.  The function receives
`this` bound to the SmarkForm component instance, enabling direct API access.

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

### Cross-Origin Script Security Policy

Executing scripts sourced from a cross-origin mixin template poses security
risks.  The behaviour is controlled by the `crossOriginMixins` option on the
root SmarkForm instance:

| Value | Behaviour |
|---|---|
| `"block"` *(default)* | Encountering a cross-origin mixin that contains a `<script>` throws a `MIXIN_SCRIPT_CROSS_ORIGIN_BLOCKED` error and halts rendering.  This is the safest default: fail loudly so the developer is forced to make an explicit decision. |
| `"noscript"` | Cross-origin mixin templates are rendered normally but any `<script>` elements they contain are silently discarded.  Use this when you trust the external template's markup but do not want to execute its scripts. |
| `"allow"` | Scripts from cross-origin mixin templates are executed without restriction.  Use only when you fully control and trust the external source. |

```html
<!-- Opt-in to degraded (script-less) rendering of cross-origin mixins -->
<form id="myForm" data-smark='{"crossOriginMixins":"noscript"}'> ... </form>
```


## Examples

### Reusable contact block

The following example defines a single `#contactBlock` mixin template and
stamps it out twice — once for the **primary** contact and once for an
**emergency** contact.  Both instances share the same structure but are
completely independent, each carrying its own `name` and therefore its own
data path in the exported value.

{% raw %} <!-- capture mixin_contact_block_html {{{ --> {% endraw %}
{% capture mixin_contact_block_html -%}
<div id="myForm$$">
<!-- Mixin template — defined once, reused anywhere -->
<template id="contactBlock">
    <fieldset data-smark='{"type":"form"}'>
        <label data-smark>
            Name: <input data-smark type="text" name="name">
        </label>
        <label data-smark>
            E-mail: <input data-smark type="email" name="email">
        </label>
        <label data-smark>
            Phone: <input data-smark type="tel" name="phone">
        </label>
    </fieldset>
</template>

<!-- Form — the same mixin is used for both contacts -->
<fieldset data-smark='{"type":"form","name":"contacts"}'>
    <legend>Contacts</legend>
    <h3>Primary</h3>
    <div data-smark='{"type":"#contactBlock","name":"primary"}'></div>
    <h3>Emergency</h3>
    <div data-smark='{"type":"#contactBlock","name":"emergency"}'></div>
</fieldset>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture mixin_contact_block_tests {{{ --> {% endraw %}
{% capture mixin_contact_block_tests -%}
export default async ({ page, expect, root, writeField, readField }) => {
    await expect(root).toBeVisible();

    // Populate the two mixin instances independently.
    await writeField('contacts/primary/name', 'Alice Smith');
    await writeField('contacts/primary/email', 'alice@example.com');
    await writeField('contacts/emergency/name', 'Bob Smith');
    await writeField('contacts/emergency/phone', '555-9999');

    // Each instance exports its own data at its own path.
    expect(await readField('contacts/primary/name')).toBe('Alice Smith');
    expect(await readField('contacts/emergency/name')).toBe('Bob Smith');
    expect(await readField('contacts/emergency/phone')).toBe('555-9999');

    // Export the whole form and verify the structure.
    const data = await page.evaluate(async () => myForm.export());
    expect(data.contacts.primary.email).toBe('alice@example.com');
    expect(data.contacts.emergency.name).toBe('Bob Smith');
};
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
    "contacts": {
        "primary": {
            "name": "Alice Smith",
            "email": "alice@example.com",
            "phone": "555-1234"
        },
        "emergency": {
            "name": "Bob Smith",
            "email": "bob@example.com",
            "phone": "555-5678"
        }
    }
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="mixin_contact_block"
    htmlSource=mixin_contact_block_html
    demoValue=demoValue
    showEditor=true
    selected="preview"
    tests=mixin_contact_block_tests
%}

The exported value mirrors the nesting: both `primary` and `emergency` objects
appear under a `contacts` key, each with `name`, `email`, and `phone` fields —
exactly what you would get from two independently hand-authored `<fieldset>`
blocks, but with zero markup duplication.


### Option override per usage site

Placeholder options **override** template defaults on a per-key basis.  The
following example uses a single `#tagList` template that declares
`"min_items":3` as its default.  One of the two usage sites overrides that to
`"min_items":1` so it starts with only one slot, while the other keeps the
template's default of three.

{% raw %} <!-- capture mixin_option_override_html {{{ --> {% endraw %}
{% capture mixin_option_override_html -%}
<div id="myForm$$">
<template id="tagList">
    <!-- Template default: start with 3 items -->
    <ul data-smark='{"type":"list","min_items":3}'>
        <li>
            <input data-smark type="text" name="tag" placeholder="tag…">
            <button data-smark='{"action":"removeItem"}'>✕</button>
        </li>
    </ul>
</template>

<fieldset data-smark='{"type":"form","name":"labels"}'>
    <legend>Labels</legend>
    <h3>Priority tags (3 slots by default)</h3>
    <!-- No min_items override — keeps template default of 3 -->
    <div data-smark='{"type":"#tagList","name":"priority"}'></div>
    <button data-smark='{"action":"addItem","context":"priority"}'>➕ Add</button>

    <h3>Optional tags (1 slot override)</h3>
    <!-- Overrides min_items to 1 -->
    <div data-smark='{"type":"#tagList","name":"optional","min_items":1}'></div>
    <button data-smark='{"action":"addItem","context":"optional"}'>➕ Add</button>
</fieldset>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture mixin_option_override_tests {{{ --> {% endraw %}
{% capture mixin_option_override_tests -%}
export default async ({ page, expect, root }) => {
    await expect(root).toBeVisible();

    // Export the initial form state (no items added by the test).
    const data = await page.evaluate(async () => myForm.export());

    // "priority" keeps the template default of min_items:3 →
    // three empty slots are present after initialisation.
    expect(data.labels.priority).toHaveLength(3);

    // "optional" overrides to min_items:1 →
    // only one empty slot is present after initialisation.
    expect(data.labels.optional).toHaveLength(1);
};
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="mixin_option_override"
    htmlSource=mixin_option_override_html
    showEditor=true
    selected="preview"
    demoValue='{"labels":{"priority":[{"tag":"critical"},{"tag":"needs-review"},{"tag":"assigned"}],"optional":[{"tag":"nice-to-have"}]}}'
    tests=mixin_option_override_tests
%}

Notice how both `priority` and `optional` use the same `#tagList` blueprint,
but each instance gets its own initial item count controlled by the `min_items`
option — set by the placeholder for `optional` and falling through to the
template default for `priority`.


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
| `MIXIN_SCRIPT_CROSS_ORIGIN_BLOCKED` | A cross-origin mixin template contains a `<script>` and `crossOriginMixins` is `"block"` (the default) |
