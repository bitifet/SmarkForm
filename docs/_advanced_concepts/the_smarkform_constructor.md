---
title: The SmarkForm Constructor
layout: chapter
permalink: /advanced_concepts/the_smarkform_constructor
nav_order: 0

---

{% include links.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Constructor Syntax](#constructor-syntax)
* [Pass-Through Options](#pass-through-options)
    * [Merging rules](#merging-rules)
* [Constructor-Only Options](#constructor-only-options)
    * [Naming convention](#naming-convention)
    * [`customActions`](#customactions)
    * [`on*` event handlers](#on-event-handlers)
    * [`smark_mask_throwOnMissing`](#smark_mask_throwonmissing)
    * [Mixin security policies](#mixin-security-policies)
* [Static Members](#static-members)
    * [`SmarkForm.registerMask()`](#smarkformregistermask)
    * [`SmarkForm.registerCustomAction()`](#smarkformregistercustomaction)
* [How the Component Tree is Built](#how-the-component-tree-is-built)
    * [Scope boundaries](#scope-boundaries)
    * [Rendering order](#rendering-order)
* [The `rendered` Promise](#the-rendered-promise)

<!-- vim-markdown-toc -->
   " | markdownify }}

</details>

---

## Constructor Syntax

```javascript
const form = new SmarkForm(element, options);
```

- **`element`** — a DOM element (typically `<form>`, `<div>`, or any container) to enhance. The root element does not need a `data-smark` attribute — it is enhanced automatically. All descendants with `data-smark` are recursively processed.
- **`options`** *(optional)* — a plain object that configures the form. Options fall into two categories: **pass-through** (forwarded to the root form component) and **constructor-only** (handled by the constructor itself).

---

## Pass-Through Options

Most options you pass to the constructor are forwarded to the root form component — they behave as if you had set them via `data-smark` on the root element:

```javascript
const form = new SmarkForm(element, {
    value: { name: "Alice" },     // initial value (all field types)
    exportEmpties: false,         // list option
    focus_on_click: false,        // form option
    autoId: true,                 // component-level option
});
```

These options are documented on their respective component type pages:

| Option | Scope | Documented at |
|--------|-------|---------------|
| `value` | All field types | Sets the initial/default value for any component. See [Form type → `value`]({{ "component_types/type_form" | relative_url }}#value), [Data import → defaults]({{ "working_with_forms/data_import_and_export" | relative_url }}#setting-defaults-via-value) |
| `exportEmpties` | List type | [List type → `exportEmpties`]({{ "component_types/type_list" | relative_url }}#exportempties), [Data import → `exportEmpties` option]({{ "working_with_forms/data_import_and_export" | relative_url }}#the-exportempties-option) |
| `focus_on_click` | Form type | [Form type → `focus_on_click`]({{ "component_types/type_form" | relative_url }}#focus_on_click) |
| `autoId` | All components | [Form type → `autoId`]({{ "component_types/type_form" | relative_url }}#autoid) |
| `enableJsonEncoding` | Form type | [Form type → encoding & transport]({{ "component_types/type_form" | relative_url }}#encoding-and-transport) |
| `keyStyle` / `arrayStyle` | Form type | [Form type → data flattening]({{ "component_types/type_form" | relative_url }}#data-flattening-options) |

### Merging rules

If the root element also carries a `data-smark` attribute, both sources are merged. The constructor options take precedence.

```html
<form data-smark='{"exportEmpties":true}'>
  <!-- … -->
</form>
```

```javascript
// exportEmpties from data-smark is overridden:
const form = new SmarkForm(document.querySelector("form"), {
    exportEmpties: false, // wins
});
```

Options not specified in either source keep their documented defaults.

---

## Constructor-Only Options

Options prefixed with `on_` (event handlers) or `smark_` (constructor-only flags) are **not forwarded** to the root form component — they are processed by the constructor itself.

### Naming convention

The prefix makes the intent clear at a glance:

- **`on_`** — attaches an event listener (e.g. `on_click`, `on_BeforeAction_export`)
- **`smark_`** — sets a constructor-only flag (e.g. `smark_mask_throwOnMissing`)
- **`customActions`** — registers per-instance custom actions (also available globally via `SmarkForm.registerCustomAction()`)

### `customActions`

Defines additional actions beyond SmarkForm's built-in ones. Triggers in the HTML can invoke them by name.

```javascript
const form = new SmarkForm(element, {
    customActions: {
        async sendEmail(data, options) {
            const formData = await form.export();
            await fetch("/api/send", {
                method: "POST",
                body: JSON.stringify(formData),
            });
        },
    },
});
```

```html
<button data-smark='{"action":"sendEmail"}'>Send Email</button>
```

Each custom action follows the [`async actionName(data, options)`]({{ "advanced_concepts/events" | relative_url }}#the-action-decorator) signature and participates in the standard [action lifecycle]({{ "advanced_concepts/events" | relative_url }}#action-lifecycle-events) (`BeforeAction_<name>`, `AfterAction_<name>`).

> Custom actions can also be registered **globally** before construction — see [`SmarkForm.registerCustomAction()`](#smarkformregistercustomaction).

### `on*` event handlers

A declarative shorthand for attaching [event listeners]({{ "advanced_concepts/events" | relative_url }}) at construction time. The naming follows the [three listener levels]({{ "advanced_concepts/events" | relative_url }}#local-vs-all-handlers):

| Pattern | Scope |
|---------|-------|
| `on_<event>` | Bubbles if event permits |
| `onLocal_<event>` | Target phase only |
| `onAll_<event>` | Always bubbles |
| `onBeforeAction_<action>` | `BeforeAction` hook |

```javascript
const form = new SmarkForm(element, {
    on_click(ev) { console.log("clicked", ev.target); },
    onLocal_AfterAction_export(ev) { console.log("exported", ev.data); },
    onBeforeAction_import(ev) { ev.preventDefault(); },
});
```

See: [Event handlers via options]({{ "advanced_concepts/events" | relative_url }}#via-options-declarative) for more examples.

### `smark_mask_throwOnMissing`

Controls whether a missing mask factory throws an error. Defaults to `true`.

```javascript
// Warn instead of throwing for unregistered masks:
const form = new SmarkForm(element, {
    smark_mask_throwOnMissing: false,
});
```

When `false`, the field's original input type is restored and the field operates unmasked. See [Field Masking — Error Handling]({{ "working_with_forms/field_masking" | relative_url }}#error-handling) for details.

### Mixin security policies

SmarkForm mixin types can load external templates and execute scripts. Four constructor options control the security policy:

- `allowExternalMixins` — fetch templates from external URLs
- `allowLocalMixinScripts` — execute `<script>` blocks in local templates
- `allowSameOriginMixinScripts` — execute same-origin external scripts
- `allowCrossOriginMixinScripts` — execute cross-origin external scripts

Each accepts `"block"` (default, safer) or `"allow"`. See [Mixin security options]({{ "advanced_concepts/mixin_types" | relative_url }}#mixin-security-options) for full documentation and examples.

{: .note }
> These are pass-through options (not constructor-only) — they flow into the root form component where the mixin system reads them via `inheritedOption`. The `smark_` prefix is reserved for truly constructor-only flags.

---

## Static Members

### `SmarkForm.registerMask(name, factory)`

Registers a mask factory globally so it can be referenced by name in any form's `data-smark` `mask` property. Must be called **before** constructing any form that uses the mask.

```javascript
SmarkForm.registerMask("card", (node) => {
    return new IMask(node, { mask: "0000 0000 0000 0000" });
});

const form = new SmarkForm(element);
// <input data-smark='{"mask":"card"}' ...> now works
```

Masks can also be registered declaratively via `<script type="smark-mask">` elements. See [Field Masking]({{ "working_with_forms/field_masking" | relative_url }}) for the full reference.

### `SmarkForm.registerCustomAction(name, handler)`

Registers a custom action globally, available to all forms without needing `customActions` at construction time.

```javascript
SmarkForm.registerCustomAction("sendEmail", async (data, options) => {
    const formData = await this.export();
    await fetch("/api/send", { method: "POST", body: JSON.stringify(formData) });
});

const form = new SmarkForm(element);
// <button data-smark='{"action":"sendEmail"}'> now works
```

Globally registered actions can be overridden per-instance via the [`customActions`](#customactions) constructor option.

---

## How the Component Tree is Built

When you call `new SmarkForm(element, options)`, the constructor creates a **root form component** from the given element and then builds the component tree recursively:

1. The root form scans its **direct** children for `data-smark` attributes and enhances each one into its corresponding component type.
2. Components that can contain children (form and list types) then scan **their own direct children** and repeat the process.
3. Any component without `data-smark` is ignored — only descendants with the attribute are enhanced.

This means the tree depth matches your HTML nesting: a form with a nested list, which in turn has nested fields, produces precisely that three-level component structure.

### Scope boundaries

Each form and list component only sees the `data-smark` children that directly belong to it — it does not reach into nested forms or lists. Those nested containers are responsible for their own children.

```html
<div data-smark='{"type":"form","name":"parent"}'>
  <!-- The root form sees this input as a direct child -->
  <input name="name" data-smark>

  <!-- The root form sees this nested form, but NOT its children -->
  <div data-smark='{"type":"form","name":"address"}'>
    <!-- The nested form sees these children -->
    <input name="street" data-smark>
    <input name="city" data-smark>
  </div>
</div>
```

### Rendering order

Rendering is asynchronous and proceeds outward-in: child components render before their parents are fully resolved. The [`rendered` Promise](#the-rendered-promise) signals when the entire tree has finished rendering, at which point every component is ready for interaction.

---

## The `rendered` Promise

SmarkForm rendering is asynchronous. The `rendered` property returns a Promise that resolves once the full component tree has been rendered:

```javascript
await form.rendered;
const field = form.find("/name"); // safe now
```

Methods like [`find()`]({{ "working_with_forms/form_traversing" | relative_url }}), [`export()`]({{ "working_with_forms/data_import_and_export" | relative_url }}), and [`import()`]({{ "working_with_forms/data_import_and_export" | relative_url }}) depend on the form being fully rendered.
