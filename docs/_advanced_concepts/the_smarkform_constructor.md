---
title: The SmarkForm Constructor
layout: chapter
permalink: /advanced_concepts/the_smarkform_constructor
description: "Configure SmarkForm during construction, set root options and initial values, and use its rendered promise and instance API."
nav_order: 0

---

{% include links.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {% include chaptertoc/the_smarkform_constructor.html depth=3 %}

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
    export_empties: false,         // list option
    focus_on_click: false,        // form option
    auto_id: true,                 // component-level option
});
```

These options are documented on their respective component type pages:

| Option | Scope | Documented at |
|--------|-------|---------------|
| `value` | All field types | Sets the initial/default value for any component. See [Form type → `value`]({{ "component_types/type_form" | relative_url }}#value), [Data import → defaults]({{ "working_with_forms/data_import_and_export" | relative_url }}#setting-defaults-via-value) |
| `export_empties` | List type | [List type → `export_empties`]({{ "component_types/type_list" | relative_url }}#exportempties), [Data import → `export_empties` option]({{ "working_with_forms/data_import_and_export" | relative_url }}#the-exportempties-option) |
| `on_<event>` / `onLocal_<event>` / `onAll_<event>` | All components | [Event handlers via options]({{ "advanced_concepts/events" | relative_url }}#via-options-declarative) |
| `focus_on_click` | Form type | [Form type → `focus_on_click`]({{ "component_types/type_form" | relative_url }}#focus_on_click) |
| `auto_id` | All components | [Form type → `auto_id`]({{ "component_types/type_form" | relative_url }}#autoid) |
| `enable_json_encoding` | Form type | [Form type → encoding & transport]({{ "component_types/type_form" | relative_url }}#encoding-and-transport) |
| `key_style` / `array_style` | Form type | [Form type → data flattening]({{ "component_types/type_form" | relative_url }}#data-flattening-options) |

### Merging rules

If the root element also carries a `data-smark` attribute, both sources are merged. The constructor options take precedence.

```html
<form data-smark='{"export_empties":true}'>
  <!-- … -->
</form>
```

```javascript
// export_empties from data-smark is overridden:
const form = new SmarkForm(document.querySelector("form"), {
    export_empties: false, // wins
});
```

Options not specified in either source keep their documented defaults.

---

## Constructor-Only Options

The policies listed here must be supplied to the root `SmarkForm` constructor;
their consumers read them from root options. SmarkForm omits `smark_*` keys when
serializing options back to the DOM. The prefix is a reserved SmarkForm namespace,
not a universal scope marker: media controls such as `smark_file_open` and
`smark_video_auto_pick` are consumed by their corresponding field types.

### Field Masking

- **`smark_mask_throw_on_missing`** — Controls whether a missing mask factory throws an error. Defaults to `true`.

```javascript
// Warn instead of throwing for unregistered masks:
const form = new SmarkForm(element, {
    smark_mask_throw_on_missing: false,
});
```

When `false`, the field's original input type is restored and the field operates unmasked. See [Field Masking — Error Handling]({{ "working_with_forms/field_masking" | relative_url }}#error-handling) for details.

### Mixin security policies

Control whether mixin templates can fetch external content or execute scripts:

- `smark_mixin_allow_external` — fetch templates from external URLs
- `smark_mixin_allow_local_scripts` — execute `<script>` blocks in local templates
- `smark_mixin_allow_same_origin_scripts` — execute same-origin external scripts
- `smark_mixin_allow_cross_origin_scripts` — execute cross-origin external scripts

Each accepts `"block"` (default), `"allow"`, or per-origin object maps. See [Mixin security options]({{ "advanced_concepts/mixin_types" | relative_url }}#mixin-security-options) for full documentation.

---

## Static Members

### `SmarkForm.registerMask(name, factory)`

Registers a mask factory globally so it can be referenced by name in any form's `data-smark` `mask` property. Must be called **before** constructing any form that uses the mask.

```javascript
SmarkForm.registerMask("card", (node) => {
    return new IMask(node, { mask: "0000 0000 0000 0000" });
});

const myForm = new SmarkForm(element);
// <input data-smark='{"mask":"card"}' ...> now works
```

Masks can also be registered declaratively via `<script type="smark-mask">` elements. See [Field Masking]({{ "working_with_forms/field_masking" | relative_url }}) for the full reference.

### `SmarkForm.registerCustomAction(name, handler)`

Registers a custom action globally so triggers in subsequently constructed
forms can invoke it. The former `customActions` constructor option was removed;
`SmarkForm.registerCustomAction()` is the supported registration API.

```javascript
SmarkForm.registerCustomAction("sendEmail", async function(data, options) {
    const formData = await this.export();
    await fetch("/api/send", { method: "POST", body: JSON.stringify(formData) });
});

const form = new SmarkForm(element);
// <button data-smark='{"action":"sendEmail"}'> now works
```

SmarkForm binds the handler's `this` to the root form instance. Registered
custom-action handlers are not automatically wrapped in the built-in
`BeforeAction_*` / `AfterAction_*` lifecycle; add any required validation or
event behavior explicitly.

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
