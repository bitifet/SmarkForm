---
title: "Field Masking"
layout: chapter
permalink: /advanced_concepts/field_masking
nav_order: 7

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

* [How It Works](#how-it-works)
* [Registering a Mask](#registering-a-mask)
    * [Via JavaScript](#via-javascript)
    * [Via Declarative HTML](#via-declarative-html)
* [Applying a Mask to a Field](#applying-a-mask-to-a-field)
* [Credit Card Example (IMask)](#credit-card-example-imask)
* [Price Example (Non-Text Field Type)](#price-example-non-text-field-type)
* [Custom Mask Example (No Library + Singleton + List)](#custom-mask-example-no-library--singleton--list)
* [Mixin-Scoped Masks](#mixin-scoped-masks)
* [Error Handling](#error-handling)
    * [`throwOnMaskError: true` (default)](#throwonmaskerror-true-default)
    * [`throwOnMaskError: false`](#throwonmaskerror-false)
    * [Error Codes](#error-codes)
* [Masks and External Libraries](#masks-and-external-libraries)
* [Migration from the Old `mask()` Method](#migration-from-the-old-mask-method)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>

SmarkForm's masking API lets you integrate **any** external input-masking library — or a
pure-JavaScript custom mask — to format user input while keeping exported data clean and
unformatted. SmarkForm does **not** reinvent input masking; instead it provides
a thin declarative layer that connects external masking solutions to
SmarkForm-managed fields.

Masks are defined with `SmarkForm.registerMask()` (JavaScript) or
`<script type="smark-mask">` (declarative HTML), and applied to fields via
the `mask` property in `data-smark`.

## How It Works

When a field has a `mask` property in its `data-smark`, SmarkForm:

1. Saves the original input type (e.g. `number`, `tel`).
2. Converts the input type to `text` so masking libraries can operate freely.
3. Looks up the mask factory by name — first in scoped (mixin) masks, then in
   the global registry.
4. Calls the factory with the field's target DOM node.
5. Stores the returned mask instance in `_maskInstance`.
6. Exports the **unmasked value** (raw data) instead of the formatted display.
7. Dispatches `input` events when values are set programmatically so masks stay
   synchronized.
8. If the mask fails (not found or factory throws), the original type is
   **restored** and the field operates unmasked.

## Registering a Mask

### Via JavaScript

Call `SmarkForm.registerMask()` before constructing any form that uses the mask:

```javascript
SmarkForm.registerMask("cardNumber", (node) => {
  return new IMask(node, { mask: "0000 0000 0000 0000" });
});
```

The factory receives the field's target DOM node and must return an object with
an `unmaskedValue` property (getter/setter pair) so SmarkForm can read and
write the clean value independently of the formatted display.

**Returning `null` or `undefined`** from the factory is allowed: the field
operates unmasked. This is useful for conditional masking.

### Via Declarative HTML

Place a `<script type="smark-mask" data-name="...">` element anywhere in the
page:

```html
<script type="smark-mask" data-name="cardNumber">
    (node) => {
        return new IMask(node, { mask: "0000 0000 0000 0000" });
    }
</script>
```

SmarkForm scans for these elements on construction and registers each factory
automatically. Script elements inside a `<template>` are treated as
**mixin-scoped** masks (see [Mixin-Scoped Masks](#mixin-scoped-masks)).

## Applying a Mask to a Field

Add the `mask` property to the field's `data-smark`:

```html
<input data-smark='{"name":"card","mask":"cardNumber"}' type="number">
```

The mask is applied automatically when the field renders — no post-construction
setup needed.

## Credit Card Example (IMask)

This example uses [IMask.js](https://imask.js.org/) to format a credit card
number with spaces every 4 digits.

{% raw %}<!-- mask_cc_html {{{ -->{% endraw %}
{% capture mask_cc_html -%}
<script src="https://cdn.jsdelivr.net/npm/imask@6.6.3"></script>
<div id="myForm$$">
  <div data-smark='{"type":"form","name":"payment"}'>
    <p>
      <label>Card Number</label>
      <input data-smark='{"type":"number","name":"cardNumber","mask":"card"}' placeholder="0000 0000 0000 0000">
    </p>
  </div>
</div>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- mask_cc_js {{{ -->{% endraw %}
{% capture mask_cc_js -%}
SmarkForm.registerMask("card", (node) => {
  // Using iMask.js (loaded via CDN): https://cdn.jsdelivr.net/npm/imask
  const imask = new IMask(node, { mask: "0000 0000 0000 0000" });
  // Wrap IMask in a plain object so we can override unmaskedValue
  // to return null when the card number is incomplete.
  return {
    get unmaskedValue() {
      return imask.masked.isComplete ? imask.masked.unmaskedValue : null;
    },
    set unmaskedValue(v) { imask.masked.unmaskedValue = v; },
  };
});

const myForm = new SmarkForm(document.getElementById("myForm$$"));
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- mask_cc_notes {{{ -->{% endraw %}
{% capture mask_cc_notes -%}
The factory wraps IMask in a plain object so it can override `unmaskedValue`. When `imask.masked.isComplete` is falsy (incomplete card number), the getter returns `null` — so SmarkForm's `export()` never includes partially-typed card numbers.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md 
   formId="mask-cc"
   htmlSource=mask_cc_html
   jsHead=mask_cc_js
   notes=mask_cc_notes
   showEditor=true
   tests=false
%}

## Price Example (Non-Text Field Type)

This shows how to use a `number` field type — SmarkForm converts it to `text`
for masking but exports a proper JavaScript number.

{% raw %}<!-- mask_price_html {{{ -->{% endraw %}
{% capture mask_price_html -%}
<script src="https://cdn.jsdelivr.net/npm/imask@6.6.3"></script>
<div id="myForm$$">
  <div data-smark='{"type":"form","name":"product"}'>
    <p>
      <label>Unit Price</label>
      <input data-smark='{"type":"number","name":"price","mask":"price"}' step="0.01">
    </p>
  </div>
</div>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- mask_price_js {{{ -->{% endraw %}
{% capture mask_price_js -%}
SmarkForm.registerMask("price", (node) => {
  const imask = new IMask(node, {
    mask: Number,
    scale: 2,
    thousandsSeparator: " "
  });
  return imask;
});

const myForm = new SmarkForm(document.getElementById("myForm$$"));
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- mask_price_notes {{{ -->{% endraw %}
{% capture mask_price_notes -%}
SmarkForm converts `type="number"` inputs to `type="text"` for masking, but `export()` still returns a proper JavaScript `Number` — the masked display format is purely cosmetic.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md 
   formId="mask-price"
   htmlSource=mask_price_html
   jsHead=mask_price_js
   notes=mask_price_notes
   showEditor=true
   tests=false
%}

## Custom Mask Example (No Library + Singleton + List)

You don't need a third-party masking library. A plain JavaScript object with
`unmaskedValue` getter/setter is sufficient. This example strips non-digit
characters on export — a simple "digits only" mask.

The example also demonstrates how masks work inside list items wrapped in a
singleton. Each phone `<input>` sits inside a `<span data-smark='{"type":"input"…}'>`
that SmarkForm treats as a standalone singleton field. The `mask` property
placed on the singleton wrapper is automatically inherited by the inner
`<input>`, and the list's add button lets you add or remove phones dynamically.

{% raw %}<!-- mask_custom_html {{{ -->{% endraw %}
{% capture mask_custom_html -%}
<div id="myForm$$">
  <div data-smark='{"type":"form","name":"contacts"}'>
    <p>
      <label>Contact Phones</label>
      <div data-smark='{"type":"list","name":"phones","min_items":0}'>
        <p style="display:flex;gap:8px;margin:4px 0;align-items:center">
          <span data-smark='{"type":"input","name":"phone","mask":"digits"}'>
            <input data-smark type="tel" placeholder="Phone number">
          </span>
          <button data-smark='{"action":"removeItem"}' title="Remove">✕</button>
        </p>
      </div>
      <button data-smark='{"action":"addItem","context":"phones"}'>Add Phone</button>
    </p>
  </div>
</div>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- mask_custom_js {{{ -->{% endraw %}
{% capture mask_custom_js -%}
SmarkForm.registerMask("digits", (node) => {
  let _raw = '';
  node.addEventListener('input', () => {
    const digits = node.value.replace(/\D/g, '');
    const formatted = digits.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
    if (formatted !== node.value) node.value = formatted;
    _raw = digits;
  });
  return {
    get unmaskedValue() { return _raw; },
    set unmaskedValue(v) { _raw = v; node.value = v; },
  };
});

const myForm = new SmarkForm(document.getElementById("myForm$$"));
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- mask_custom_notes {{{ -->{% endraw %}
{% capture mask_custom_notes -%}
Each phone input is wrapped in a singleton (`type:"input"`) with `mask:"digits"` on the wrapper. The mask is inherited by the inner `<input>` automatically, and `export()` returns only the digits. Add new phones with the button — each new item inherits the mask from its singleton wrapper.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- mask_custom_tests {{{ -->{% endraw %}
{% capture mask_custom_tests %}
export default async ({ expect, readField, root, page }) => {
    await expect(root).toBeVisible();
    const val = await readField('/contacts/phones');
    expect(val).toEqual([]);
};
{% endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
   formId="mask-custom"
   htmlSource=mask_custom_html
   jsHead=mask_custom_js
   notes=mask_custom_notes
   showEditor=true
   tests=mask_custom_tests
%}

## Mixin-Scoped Masks

When a `<script type="smark-mask">` is placed inside a `<template>` (used for
mixin types), the mask is scoped to that mixin's expansion — it does **not**
register globally. This prevents name collisions between mixins that define
masks with the same name.

> **See also:** [Mixin Types → Scripts and Styles](mixin_types#scripts-and-styles)
> for the full mixin script policy, including the `allowLocalMixinScripts` option.

The script element must be a **sibling of the root element** inside the
`<template>`, not nested within it:

```html
<template id="myMixin">
    <!-- Scoped mask: sibling of the root <div> -->
    <script type="smark-mask" data-name="secret">
        (node) => {
            return { get unmaskedValue() { ... }, set unmaskedValue(v) { ... } };
        }
    </script>
    <div>
        <input data-smark='{"name":"inner","mask":"secret"}'>
    </div>
</template>
```

A mixin-local mask **overrides** a global mask with the same name, so mixins
can safely define their own versions of shared mask names.

> **Note:** Mixin-scoped masks require the `allowLocalMixinScripts: 'allow'`
> form option.

## Error Handling

SmarkForm's masking error handling is controlled by the `maskConfig` option,
which is inherited down the component tree. The key property is
`throwOnMaskError`:

### `throwOnMaskError: true` (default)

- **Mask not found** → throws `MASK_NOT_FOUND` render error.
- **Mask factory throws** → throws `MASK_APPLY_ERROR` render error (the
  original exception is available via `error.cause`).
- In both cases the input type is **restored** to its original value before
  the error is raised, so the error indicator is shown with the correct type.

### `throwOnMaskError: false`

- Mask errors are reported via `console.warn` instead of throwing.
- The field's original input type is **restored** and the field operates
  unmasked.

```javascript
const myForm = new SmarkForm("#myForm", {
  maskConfig: { throwOnMaskError: false }
});
```

### Error Codes

| Code | Meaning |
|------|---------|
| `MASK_NOT_FOUND` | No factory registered for the given mask name |
| `MASK_APPLY_ERROR` | Factory was found but threw during execution; inspect `error.cause` |

See [Error Codes Reference](error_codes) for all SmarkForm error codes.

## Masks and External Libraries

SmarkForm does **not** include or prescribe any masking library. You are free
to use:

- **[IMask.js](https://imask.js.org/)** — feature-rich, pattern-based masking
  (demonstrated in examples above).
- **A custom pure-JavaScript factory** — see [Custom Mask Example](#custom-mask-example-no-library).
- **Any other library** that can be wrapped in a factory returning
  `{ unmaskedValue }`.
- **Plain DOM event handlers** — the factory can attach listeners and return
  a simple object.

The only contract is:

> The factory receives one argument (the target `<input>` element) and returns
> an object with an `unmaskedValue` property (getter/setter pair), or
> `null`/`undefined` to indicate "no masking".

## Migration from the Old `mask()` Method

The old `field.mask(factory)` method is removed. To migrate:

1. Register the mask factory before constructing the form:
   `SmarkForm.registerMask("name", factory)`
2. Add `"mask":"name"` to the field's `data-smark` JSON.
3. Remove any `field.mask(...)` calls from post-construction code.

The factory signature is unchanged — it receives the target DOM node and must
return an object with `unmaskedValue`. IMask instances are already compatible
since they provide `unmaskedValue`.
