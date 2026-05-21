---
title: Field Masking
layout: chapter
permalink: /advanced_concepts/field_masking
---

# Field Masking

{% include components/sampletabs_ctrl.md %}


SmarkForm's `mask()` method enables integration with external masking libraries to format user input while keeping exported data clean and typed. This is especially useful for fields like credit cards, phone numbers, and prices where visual formatting differs from the underlying data.

## How It Works

When you apply a mask, SmarkForm:

1. Converts the input type to `text` (so masking libraries can operate on it)
2. Stores the mask library instance in `_maskInstance`
3. Exports the **unmasked value** (raw data) instead of the formatted display
4. Restores the original input type when the field is destroyed
5. Dispatches `input` events when values are set programmatically so masks stay synchronized

## Credit Card Example (Primary)

A credit card field demonstrates spaces between every 4 digits — a pattern familiar to most users.

{% raw %}<!-- mask_cc_html {{{ -->{% endraw %}
{% capture mask_cc_html -%}
<script src="https://cdn.jsdelivr.net/npm/imask"></script>
<div id="payment" data-smark='{"type":"form","name":"payment"}'>
  <p>
    <label>Card Number</label>
    <input data-smark type="text" name="cardNumber" placeholder="0000 0000 0000 0000">
  </p>
  <p>
    <button data-smark='{"action":"export"}'>💾 Save Payment</button>
  </p>
</div>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- mask_cc_js {{{ -->{% endraw %}
{% capture mask_cc_js -%}
const form = new SmarkForm("#payment");
form.rendered.then(async () => {
    const cardField = form.find("/cardNumber");
    cardField.mask(node => {
      // Using iMask.js (loaded via CDN): https://cdn.jsdelivr.net/npm/imask
      return new IMask(node, {
        mask: "0000 0000 0000 0000",
        blocks: {
          "0000": {mask: IMask.Number}
        }
      });
    });
});
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- mask_cc_notes {{{ -->{% endraw %}
{% capture mask_cc_notes -%}
**Try it!** Edit the code and see it live. You can change the mask or placeholder to experiment.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md 
   formId="mask-cc"
   htmlSource=mask_cc_html
   jsHead=mask_cc_js
   notes=mask_cc_notes
   showEditor=true
%}

## Price Example (Non-Text Field Type)

This shows how to use a `number` field type — SmarkForm converts it to `text` for masking but exports a proper JavaScript number.

{% raw %}<!-- mask_price_html {{{ -->{% endraw %}
{% capture mask_price_html -%}
<script src="https://cdn.jsdelivr.net/npm/imask"></script>
<div id="product" data-smark='{"type":"form","name":"product"}'>
  <p>
    <label>Unit Price</label>
    <input data-smark type="number" name="price" step="0.01">
  </p>
  <p>
    <button data-smark='{"action":"export"}'>💾 Save Price</button>
  </p>
</div>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- mask_price_js {{{ -->{% endraw %}
{% capture mask_price_js -%}
const form = new SmarkForm("#product");
form.rendered.then(async () => {
    const priceField = form.find("/price");
    priceField.mask(node => {
      const imask = new IMask(node, {
        mask: Number,
        scale: 100,          // 2 decimal places
        thousandsSeparator: " " // Add space separator every 3 digits
      });
      // Export returns a proper JavaScript number, not a formatted string
      return imask;
    });
});
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- mask_price_notes {{{ -->{% endraw %}
{% capture mask_price_notes -%}
**Try it!** Change the mask options (for example, scale for decimals) and see the export value change accordingly.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md 
   formId="mask-price"
   htmlSource=mask_price_html
   jsHead=mask_price_js
   notes=mask_price_notes
   showEditor=true
%}

## Singleton Masking

When masking is applied to a singleton component (e.g., a number field wrapped in a type converter), the method delegates to the inner field. The `_maskInstance` lives on the inner field while the outer component remains chainable.

{% raw %}<!-- mask_singleton_html {{{ -->{% endraw %}
{% capture mask_singleton_html -%}
<script src="https://cdn.jsdelivr.net/npm/imask"></script>
<div id="singleton" data-smark='{"type":"number","name":"quantity","value":0}'>
  <input data-smark type="number">
</div>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- mask_singleton_js {{{ -->{% endraw %}
{% capture mask_singleton_js -%}
const form = new SmarkForm("#singleton");
form.rendered.then(async () => {
    // Mask on the singleton — returns the outer component for chaining
    const quantityField = form.find("/quantity");
    quantityField.mask(node => new IMask(node, { mask: "0[.]00" }));
    // The inner field has the _maskInstance
    const innerField = quantityField.children[""];
    console.log("Inner field has mask:", innerField._maskInstance !== undefined);
    console.log("Outer field has mask:", quantityField._maskInstance === undefined);
});
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- mask_singleton_notes {{{ -->{% endraw %}
{% capture mask_singleton_notes -%}
**Try it!** This playground demonstrates singleton masking: edit the JS to check the instance locations and try different masks.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
   formId="mask-singleton"
   htmlSource=mask_singleton_html
   jsHead=mask_singleton_js
   notes=mask_singleton_notes
   showEditor=true
%}

## Validation

Many masking libraries include built-in validation. You can integrate it by checking validity before accepting values:

{% raw %}<!-- mask_validation_html {{{ -->{% endraw %}
{% capture mask_validation_html -%}
<script src="https://cdn.jsdelivr.net/npm/imask"></script>
<div id="pricevalidation" data-smark='{"type":"form","name":"validateprice"}' style="max-width:350px">
  <p>
    <label>Price</label>
    <input data-smark type="number" name="price" step="0.01">
  </p>
  <p>
    <button data-smark='{"action":"export"}'>💾 Check</button>
  </p>
</div>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- mask_validation_js {{{ -->{% endraw %}
{% capture mask_validation_js -%}
const form = new SmarkForm("#pricevalidation");
form.rendered.then(async () => {
    const priceField = form.find("/price");
    const imask = new IMask(priceField.targetFieldNode, {
        mask: Number,
        scale: 100,
        thousandsSeparator: " "
    });
    priceField._maskInstance = imask;
    priceField.targetFieldNode.addEventListener("accept", (e) => {
      const input = e.target;
      input.setCustomValidity(imask.masked.isValid ? "" : "Please enter a valid price");
    });
});
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- mask_validation_notes {{{ -->{% endraw %}
{% capture mask_validation_notes -%}
**Try it!** The playground below highlights invalid price input using a custom validation message (try entering a non-numeric value).
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
   formId="mask-validation"
   htmlSource=mask_validation_html
   jsHead=mask_validation_js
   notes=mask_validation_notes
   showEditor=true
%}

## Masking is Permanent

When a mask converts an input to `text`, that change is permanent for the lifetime of the field instance. SmarkForm no longer tracks or restores the original type, as masking is treated as an intentional, final state. Native HTML5 behaviors are replaced by the mask's behavior, which is by design.

## Complete Example with CDN

> <b>Try the playgrounds above to see the key features. For production usage with your own CDN, use:</b>

```html
<script src="https://cdn.jsdelivr.net/npm/imask"></script>
<script src="https://cdn.jsdelivr.net/npm/smarkform/dist/SmarkForm.umd.js"></script>
<!-- Basic HTML from examples above -->
```

```javascript
// See above for field setup! Only IMask and SmarkForm loading differs for CDN usage.
```
