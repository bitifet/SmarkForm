---
title: "Field Masking"
layout: chapter
permalink: /working_with_forms/field_masking
nav_order: 5

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
* [Applying a Mask to a Field](#applying-a-mask-to-a-field)
* [Registering a Mask](#registering-a-mask)
    * [Via JavaScript](#via-javascript)
    * [Via Declarative HTML](#via-declarative-html)
* [Credit Card Example (IMask)](#credit-card-example-imask)
* [Custom Mask Example (No Library + Singleton + List)](#custom-mask-example-no-library-singleton-list)
* [Mixin-Scoped Masks](#mixin-scoped-masks)
* [Using Other Masking Libraries (Maska)](#using-other-masking-libraries-maska)
* [Error Handling](#error-handling)
    * [`smark_mask_throwOnMissing: true` (default)](#smark_mask_throwonmissing-true-default)
    * [`smark_mask_throwOnMissing: false`](#smark_mask_throwonmissing-false)
    * [Error Codes](#error-codes)
* [Focus and Mask Factories](#focus-and-mask-factories)
* [Masks and External Libraries](#masks-and-external-libraries)

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
4. **Awaits** the factory (factories may be `async`). The factory receives the
   field's target DOM node and must return an object with an `unmaskedValue`
   property (getter/setter pair) — or `null`/`undefined` for unmasked fields.
5. **Restores focus** to its previous owner if the factory stole it (some
   third-party mask libraries focus the field as a side effect).
6. Stores the returned mask instance in `_maskInstance`.
7. Exports the **unmasked value** (raw data) instead of the formatted display.
8. Dispatches `input` events when values are set programmatically so masks stay
   synchronized.
9. If the mask fails (not found or factory throws), the original type is
   **restored** and the field operates unmasked.

## Applying a Mask to a Field

Add the `mask` property to the field's `data-smark`. The mask is applied
automatically when the field renders — no post-construction setup needed.

{% raw %}<!-- apply_mask_form {{{ -->{% endraw %}
{% capture apply_mask_form -%}
<script src="https://cdn.jsdelivr.net/npm/imask@6.6.3"></script>
<div id="myForm$$">
  <label data-smark>Card Number:</label>
  <input
    data-smark='{"type":"number","name":"card","mask":"cardNumber"}'
    placeholder="0000 0000 0000 0000"
  >
</div>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- apply_mask_async_js {{{ -->{% endraw %}
{% capture apply_mask_async_js -%}
SmarkForm.registerMask("cardNumber", (node) => {
  const imask = new IMask(node, { mask: "0000 0000 0000 0000" });
  return imask;
});

const myForm = new SmarkForm(document.getElementById("myForm$$"));
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- apply_mask_notes {{{ -->{% endraw %}
{% capture apply_mask_notes -%}
The HTML declares a `number`-type field with `mask: "cardNumber"`. SmarkForm converts it to `type="text"` so IMask can operate, then exports the clean digit string.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
   formId="apply-mask"
   htmlSource=apply_mask_form
   jsHead=apply_mask_async_js
   notes=apply_mask_notes
   selected="html"
   showEditor=true
   tests=false
%}

{: .info :}
> The *mask* property should point to a previously registered mask factory.
> 
> - Mask factories can rely on external libraries (e.g. IMask) or be custom JavaScript implementations.
> - The only requirement is that they return an object with an `unmaskedValue` property (getter/setter pair).
> - The former example uses IMask for basic credit card formatting.
> - Since the field type is converted to `text`, native enhancements, default inputMode, etc... are lost. The factory is responsible for restoring any desired behavior (e.g. `inputMode: "numeric"` for mobile keyboards).

## Registering a Mask

### Via JavaScript

Call `SmarkForm.registerMask()` before constructing any form that uses the mask.
The factory receives the field's target DOM node and must return an object with
an `unmaskedValue` property (getter/setter pair) so SmarkForm can read and
write the clean value independently of the formatted display.

Factories may be **`async`** — SmarkForm awaits them. If a mask library
performs deferred work (e.g. focusing the field via `setTimeout`), the factory
should `await` that work before returning so that SmarkForm can restore focus
to its previous owner. See [Focus and Mask Factories](#focus-and-mask-factories)
for details.

**Returning `null` or `undefined`** from the factory is allowed: the field
operates unmasked. This is useful for conditional masking.

{% raw %}<!-- apply_mask_cdn_html {{{ -->{% endraw %}
{% capture apply_mask_cdn_html -%}
<script src="https://cdn.jsdelivr.net/npm/imask@6.6.3"></script>
{{ apply_mask_form }}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- apply_mask_js {{{ -->{% endraw %}
{% capture apply_mask_js -%}
SmarkForm.registerMask("cardNumber", (node) => {
  return new IMask(node, { mask: "0000 0000 0000 0000" });
});

const myForm = new SmarkForm(document.getElementById("myForm$$"));
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- via_js_notes {{{ -->{% endraw %}
{% capture via_js_notes -%}
The factory receives the DOM node after SmarkForm has already converted its `type` from `number` to `text`. Any library or custom code that operates on the node will work — SmarkForm only cares about the returned object's `unmaskedValue` property.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
   formId="via-js"
   htmlSource=apply_mask_cdn_html
   jsHead=apply_mask_js
   notes=via_js_notes
   selected="js"
   showEditor=true
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
{{ apply_mask_form }}
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
   showEditor=true
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
      <label data-smark>Card Number:</label>
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

  let prevValue = node.value;
  let lastKey = "";
  node.addEventListener("keydown", (e) => { lastKey = e.key; });
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
    // Blink on rejected input, but not for Backspace/Delete hitting a separator
    if (node.value === prevValue && node === document.activeElement) {
      if (lastKey !== "Backspace" && lastKey !== "Delete") {
        node.style.boxShadow = "0 0 0 2px #f80";
        setTimeout(() => node.style.boxShadow = "", 250);
      }
    }
    prevValue = node.value;
    // Mark invalid when partially filled (triggers native :invalid CSS)
    const raw = imask.masked.unmaskedValue;
    const showError = raw.length > 0 && !imask.masked.isComplete;
    node.setCustomValidity(showError ? "Please enter the full 16-digit card number" : "");
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
The wrapper object overriding `unmaskedValue` to return `null` for incomplete numbers is the key refinement — `export()` never returns partially-typed card data. The field is marked `:invalid` when partially filled (not empty but not complete), and rejected keystrokes trigger a brief orange blink — visually distinct from the persistent invalid state.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- mask_cc_css {{{ -->{% endraw %}
{% capture mask_cc_css -%}
input:invalid {
  outline: 1px solid #d4c070;
  outline-offset: -1px;
}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md 
   formId="mask-cc"
   htmlSource=mask_cc_html
   jsHead=mask_cc_js
   cssSource=mask_cc_css
   notes=mask_cc_notes
   showEditor=true
   selected="js"
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
      <div data-smark='{"type":"list","name":"phones"}'>
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
  node.inputMode = "numeric";
  let _raw = '';
  let prevValue = node.value;
  node.addEventListener('input', () => {
    const before = prevValue;
    prevValue = node.value;
    const digits = node.value.replace(/\D/g, '');
    const formatted = digits.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
    if (formatted !== node.value) node.value = formatted;
    _raw = digits;
    // Blink if value was reverted (invalid character typed)
    if (node.value === before && node === document.activeElement) {
      node.style.boxShadow = "0 0 0 2px #f80";
      setTimeout(() => node.style.boxShadow = "", 250);
    }
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
    expect(val).toEqual([{phone: ""}]);
};
{% endcapture %}
{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
   formId="mask-custom"
   height=45
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

A mixin-local mask **overrides** a global mask with the same name, so mixins
can safely define their own versions of shared mask names.

{: .hint :}
> **See also:** [Mixin Types → Scripts and Styles](mixin_types#scripts-and-styles)
> for the full mixin script policy, including the `smark_mixin_allowLocalScripts` option.

{% raw %}<!-- mixin_mask_html {{{ -->{% endraw %}
{% capture mixin_mask_html -%}
<div id="myForm$$">
  <div data-smark='{"type":"#digitsMixin","name":"mixinField"}'></div>
</div>

<template id="digitsMixin">
  <!-- Scoped mask: sibling of the root element inside the template -->
  <script type="smark-mask" data-name="digits">
    (node) => {
      let _v = '';
      node.addEventListener('input', () => {
        _v = node.value.replace(/\D/g, '');
        if (_v !== node.value) node.value = _v;
      });
      return { get unmaskedValue() { return _v; }, set unmaskedValue(v) { _v = v; node.value = v; } };
    }
  </script>
  <div>
    <input data-smark='{"name":"inner","mask":"digits"}' type="text" placeholder="Digits only (mixin-scoped)">
  </div>
</template>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- mixin_mask_notes {{{ -->{% endraw %}
{% capture mixin_mask_notes -%}
The `digits` mask is defined inside the `#digitsMixin` template via a `<script type="smark-mask">` element. SmarkForm scopes it to the mixin's expansion — the mask is available to fields inside the mixin but does NOT appear in the global registry. This prevents naming conflicts between different mixins that define masks with the same name.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
   formId="mixin-mask"
   htmlSource=mixin_mask_html
   notes=mixin_mask_notes
   smarkformOptions='{"smark_mixin_allowLocalScripts":"allow"}'
   selected="html"
   showEditor=true
   tests=false
%}

This example requires `smark_mixin_allowLocalScripts: "allow"` because the
`<script>` inside the `<template>` must be executed by the mixin system.

## Using Other Masking Libraries (Maska)

SmarkForm works with **any** masking library — not just IMask. The only
requirement is that the factory returns an object with an `unmaskedValue`
getter/setter pair.

This example uses [Maska](https://github.com/beholdr/maska) to format a price
field with thousand separators and two decimal places. The factory uses
Maska's `Mask` class for synchronous formatting and listens to the `maska`
event to track the unmasked value for export.

{% raw %}<!-- maska_html {{{ -->{% endraw %}
{% capture maska_html -%}
<script src="https://cdn.jsdelivr.net/npm/maska@1.5.1/dist/maska.js"></script>
<div id="myForm$$">
  <p>
    <label>Price:</label>
    <input data-smark='{"type":"number","name":"price","mask":"price"}' placeholder="0.00">
  </p>
</div>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- maska_js {{{ -->{% endraw %}
{% capture maska_js -%}
SmarkForm.registerMask("price", (node) => {
  node.inputMode = "decimal";

  Maska.create(node, {
    mask: "####.##",
    tokens: {
      "#": { pattern: /[0-9]/ },
    },
  });

  return {
    get unmaskedValue() {
      const raw = node.dataset.maskRawValue || "";
      if (!raw) return "";
      // maskRawValue is just digits. For "####.##", last 2 are decimal:
      return Number(raw.slice(0, -2) + "." + raw.slice(-2));
    },
    set unmaskedValue(v) {
      if (v === "" || v === null || v === undefined) {
        node.value = "";
        node.dispatchEvent(new Event("input"));
        return;
      }
      const num = Number(v);
      if (isNaN(num)) {
        node.value = String(v);
        node.dispatchEvent(new Event("input"));
        return;
      }
      // Pre-format to exactly 4+2 raw digits matching "####.##":
      const raw = Math.round(Math.abs(num) * 100);
      node.value = String(Math.floor(raw / 100)).padStart(4, "0").slice(-4)
                + String(raw % 100).padStart(2, "0");
      node.dispatchEvent(new Event("input"));
    },
  };
});

const myForm = new SmarkForm(document.getElementById("myForm$$"));
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- maska_notes {{{ -->{% endraw %}
{% capture maska_notes -%}
The factory creates a `Maska` instance with a `####.##` pattern for
four integer digits and two decimal places. Maska stores the raw digit
string (without separators) in `node.dataset.maskRawValue`.

The **getter** parses that string, inserts a decimal point two positions
from the right and returns a proper number (e.g. `"123456"` → `1234.56`).

The **setter** pre-formats the incoming number to the exact 4+2 raw
digits the mask expects (e.g. `1234.56` → `"123456"`), writes it to the
field and dispatches an `input` event so Maska reformats the display.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
   formId="maska-price"
   htmlSource=maska_html
   jsHead=maska_js
   notes=maska_notes
   showEditor=true
   selected="js"
   tests=false
%}

## Error Handling

SmarkForm's masking error handling is controlled by the
`smark_mask_throwOnMissing` constructor option (default `true`):

### `smark_mask_throwOnMissing: true` (default)

- **Mask not found** → throws `MASK_NOT_FOUND` render error.
- **Mask factory throws** → throws `MASK_APPLY_ERROR` render error (the
  original exception is available via `error.cause`).
- In both cases the input type is **restored** to its original value before
  the error is raised, so the error indicator is shown with the correct type.

### `smark_mask_throwOnMissing: false`

- Mask errors are reported via `console.warn` instead of throwing.
- The field's original input type is **restored** and the field operates
  unmasked.

```javascript
const myForm = new SmarkForm("#myForm", {
  smark_mask_throwOnMissing: false
});
```

### Error Codes

| Code | Meaning |
|------|---------|
| `MASK_NOT_FOUND` | No factory registered for the given mask name |
| `MASK_APPLY_ERROR` | Factory was found but threw during execution; inspect `error.cause` |

See [Error Codes Reference](error_codes) for all SmarkForm error codes.

## Focus and Mask Factories

Some third-party mask libraries focus the input field as a side effect of
initialization — typically via `setTimeout(focus, 0)`. Since SmarkForm
**awaits** the factory before restoring focus, any deferred focus calls must
have fired before the factory returns.

**If the library focuses the field synchronously** (e.g. IMask, Maska), no
special handling is needed — SmarkForm restores focus after the factory returns.

**If the library focuses the field asynchronously** (e.g. Inputmask via
`setTimeout`), the factory should `await` a macrotask yield so that the
deferred focus fires before returning:

```js
SmarkForm.registerMask("price", async (node) => {
  Inputmask({ alias: "numeric", ... }).mask(node);

  // Yield one macrotask so Inputmask's deferred focus fires.
  // SmarkForm will then restore focus to its previous owner.
  await new Promise((r) => setTimeout(r, 0));

  return { get unmaskedValue() { ... }, set unmaskedValue(v) { ... } };
});
```

Without this yield, Inputmask would focus the field **after** SmarkForm
restores focus, leaving the field unexpectedly focused.

See the [FAQ — My masked field gets focused unexpectedly](
{{ "/about/faq" | relative_url }}#my-masked-field-gets-focused-unexpectedly-after-form-construction)
for the full Inputmask case study, including the known limitation where
Inputmask re-focuses the field after a programmatic `blur()`.

## Masks and External Libraries

SmarkForm does **not** include or prescribe any masking library. You are free
to use:

- **[IMask.js](https://imask.js.org/)** — feature-rich, pattern-based masking
  (demonstrated in examples above).
- **[Maska](https://github.com/beholdr/maska)** — lightweight, zero-dependency
  masking for vanilla JS, Vue, Alpine.js, and Svelte (see
  [Using Other Masking Libraries](#using-other-masking-libraries-maska)).
- **A custom pure-JavaScript factory** — see [Custom Mask Example](#custom-mask-example-no-library).
- **Any other library** that can be wrapped in a factory returning
  `{ unmaskedValue }`.
- **Plain DOM event handlers** — the factory can attach listeners and return
  a simple object.


{: .info :}
> The only contract is:
>
> The factory receives one argument (the target `<input>` element) and returns
> an object with an `unmaskedValue` property (getter/setter pair), or
> `null`/`undefined` to indicate "no masking".

