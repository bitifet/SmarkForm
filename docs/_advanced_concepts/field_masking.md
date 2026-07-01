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

Call `SmarkForm.registerMask()` before constructing any form that uses the mask.
The factory receives the field's target DOM node and must return an object with
an `unmaskedValue` property (getter/setter pair) so SmarkForm can read and
write the clean value independently of the formatted display.

**Returning `null` or `undefined`** from the factory is allowed: the field
operates unmasked. This is useful for conditional masking.

{% raw %}<!-- via_js_form {{{ -->{% endraw %}
{% capture via_js_form -%}
<div id="myForm$$">
  <input data-smark='{"type":"number","name":"card","mask":"cardNumber"}'>
</div>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- via_js_js {{{ -->{% endraw %}
{% capture via_js_js -%}
SmarkForm.registerMask("cardNumber", (node) => {
  return new IMask(node, { mask: "0000 0000 0000 0000" });
});

const myForm = new SmarkForm(document.getElementById("myForm$$"));
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- via_js_html {{{ -->{% endraw %}
{% capture via_js_html -%}
<script src="https://cdn.jsdelivr.net/npm/imask@6.6.3"></script>
{{ via_js_form }}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- via_js_notes {{{ -->{% endraw %}
{% capture via_js_notes -%}
The `registerMask()` call must happen **before** any form that uses it is constructed. The factory receives the input's DOM node and returns any object with an `unmaskedValue` property — here, an IMask instance. SmarkForm reads `unmaskedValue` for `export()` so the clean digit string is returned, not the formatted display with spaces.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
   formId="via-js"
   htmlSource=via_js_html
   jsHead=via_js_js
   notes=via_js_notes
   selected="javascript"
   tests=false
%}

### Via Declarative HTML

Place a `<script type="smark-mask" data-name="...">` element anywhere in the
page. SmarkForm scans for these on construction and registers each factory
automatically. The field's `mask` property in `data-smark` tells it which
factory to use — no JavaScript needed beyond the constructor.

{% raw %}<!-- via_script_mask {{{ -->{% endraw %}
{% capture via_script_mask -%}
<script type="smark-mask" data-name="cardNumber">
  (node) => {
    return new IMask(node, { mask: "0000 0000 0000 0000" });
  }
</script>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- via_script_html {{{ -->{% endraw %}
{% capture via_script_html -%}
<script src="https://cdn.jsdelivr.net/npm/imask@6.6.3"></script>
{{ via_script_mask }}
{{ via_js_form }}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- via_script_notes {{{ -->{% endraw %}
{% capture via_script_notes -%}
Everything is defined in the HTML: the `smark-mask` script element registers the factory (SmarkForm scans the document for these during construction), and the input's `data-smark` references it by name via the `mask` property. No `registerMask()` call is needed.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
   formId="via-script"
   htmlSource=via_script_html
   notes=via_script_notes
   selected="html"
   tests=false
%}

Script elements inside a `<template>` are treated as **mixin-scoped** masks (see
[Mixin-Scoped Masks](#mixin-scoped-masks)).

## Credit Card Example (IMask)

Building on the basic examples above, this fully-worked credit card field adds
several production-quality refinements:

- The **placeholder** and **mobile keyboard hint** are set inside the factory
  so the HTML stays clean (DRY).
- IMask **starts lazy** so the native placeholder shows when the field is empty.
  After the first digit, it switches to a **non-lazy** mode with underscore
  padding for unfilled positions, keeping the cursor in the right place.
- The factory returns a **wrapper object** whose `unmaskedValue` getter returns
  `null` when `isComplete` is false — incomplete card numbers are never included
  in `export()`.

{% raw %}<!-- mask_cc_html {{{ -->{% endraw %}
{% capture mask_cc_html -%}
<script src="https://cdn.jsdelivr.net/npm/imask@6.6.3"></script>
<div id="myForm$$">
  <div data-smark='{"type":"form","name":"payment"}'>
    <p>
      <label>Card Number</label>
      <input data-smark='{"type":"number","name":"cardNumber","mask":"card"}'>
    </p>
  </div>
</div>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- mask_cc_js {{{ -->{% endraw %}
{% capture mask_cc_js -%}
SmarkForm.registerMask("card", (node) => {
  // DRY: set placeholder and keyboard hint inside the factory
  node.placeholder = "0000 0000 0000 0000";
  node.inputMode = "numeric";

  // Start lazy so the native placeholder shows while empty
  let showLazy = true;
  const imask = new IMask(node, {
    mask: "0000 0000 0000 0000",
    lazy: true,
  });

  node.addEventListener("input", () => {
    const hasContent = imask.masked.unmaskedValue.length > 0;
    if (hasContent && showLazy) {
      // First digit: switch to non-lazy + underscore placeholders
      showLazy = false;
      imask.updateOptions({
        mask: "0000 0000 0000 0000",
        lazy: false,
        placeholderChar: "_",
      });
    } else if (!hasContent && !showLazy) {
      // Last digit deleted: switch back to lazy (. .restore placeholder)
      showLazy = true;
      imask.updateOptions({
        mask: "0000 0000 0000 0000",
        lazy: true,
      });
    }
  });

  // Wrap IMask so unmaskedValue returns null for incomplete cards
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
Unlike the basic examples that return the IMask instance directly, this factory wraps it to override `unmaskedValue` — the getter returns `null` when `isComplete` is false, so incomplete card numbers are never included in `export()`.

**Other enhancements over the basics:**
- `placeholder` and `inputMode: "numeric"` set inside the factory — the HTML stays clean, and SmarkForm's type-conversion (`number` → `text`) doesn't affect the mobile keyboard.
- IMask starts `lazy: true` so the native placeholder `"0000 0000 0000 0000"` is visible while empty. After the first digit, `updateOptions` switches to `lazy: false` + `placeholderChar: "_"` — unfilled positions become underscores and IMask handles cursor positioning.
- Deleting the last digit switches back to `lazy: true`, restoring the native placeholder.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md 
   formId="mask-cc"
   htmlSource=mask_cc_html
   jsHead=mask_cc_js
   notes=mask_cc_notes
   showEditor=true
   selected="javascript"
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
  node.placeholder = "0.00";
  node.inputMode = "decimal";

  const imask = new IMask(node, {
    mask: Number,
    scale: 2,
    thousandsSeparator: " ",
    lazy: false,
    placeholderChar: "_",
    padFractionalZeros: false,
  });

  node.addEventListener("blur", () => {
    if (imask.masked.isComplete) return;
    let val = imask.masked.unmaskedValue;
    if (val == null || val === "") return;
    val = String(val);
    if (!val.includes(".")) val += ".";
    const [intPart, fracPart = ""] = val.split(".");
    val = (intPart || "0") + "." + fracPart.padEnd(2, "0");
    imask.masked.unmaskedValue = val;
  });

  return imask;
});

const myForm = new SmarkForm(document.getElementById("myForm$$"));
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- mask_price_notes {{{ -->{% endraw %}
{% capture mask_price_notes -%}
SmarkForm converts `type="number"` inputs to `type="text"` for masking, but `export()` still returns a proper `Number`. The factory sets `placeholder: "0.00"` and `inputMode: "decimal"` (mobile numeric keyboard). IMask uses `lazy: false` + `placeholderChar: "_"` so unfilled decimal positions show underscores while typing. On blur, missing decimals are auto-completed with zeros.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md 
   formId="mask-price"
   htmlSource=mask_price_html
   jsHead=mask_price_js
   notes=mask_price_notes
   showEditor=true
   selected="javascript"
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
