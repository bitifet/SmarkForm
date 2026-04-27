---
title: Field Masking
layout: chapter
permalink: /advanced_concepts/field_masking
---

# Field Masking

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

```html
<div data-smark='{"type":"form","name":"payment"}'>
  <p>
    <label>Card Number</label>
    <input data-smark type="text" name="cardNumber" placeholder="0000 0000 0000 0000">
  </p>
  <p>
    <button data-smark='{"action":"export"}'>💾 Save Payment</button>
  </p>
</div>
```

```javascript
const form = new SmarkForm('#payment');
await form.rendered;

const cardField = form.find('/cardNumber');
cardField.mask(node => {
  // Using iMask.js (loaded via CDN): https://cdn.jsdelivr.net/npm/imask
  return new IMask(node, {
    mask: '0000 0000 0000 0000',
    blocks: {
      '0000': {mask: IMask.Number}
    }
  });
});
```

## Price Example (Non-Text Field Type)

This shows how to use a `number` field type — SmarkForm converts it to `text` for masking but exports a proper JavaScript number.

```html
<div data-smark='{"type":"form","name":"product"}'>
  <p>
    <label>Unit Price</label>
    <input data-smark type="number" name="price" step="0.01">
  </p>
  <p>
    <button data-smark='{"action":"export"}'>💾 Save Price</button>
  </p>
</div>
```

```javascript
const form = new SmarkForm('#product');
await form.rendered;

const priceField = form.find('/price');
priceField.mask(node => {
  const imask = new IMask(node, {
    mask: Number,
    scale: 100,          // 2 decimal places
    thousandsSeparator: ' ' // Add space separator every 3 digits
  });
  // Export returns a proper JavaScript number, not a formatted string
  return imask;
});
```

## Singleton Masking

When masking is applied to a singleton component (e.g., a number field wrapped in a type converter), the method delegates to the inner field. The `_maskInstance` lives on the inner field while the outer component remains chainable.

```html
<div data-smark='{
  "type": "number",
  "name": "quantity",
  "value": 0
}'>
  <input data-smark type="number">
</div>
```

```javascript
const form = new SmarkForm('div');
await form.rendered;

// Mask on the singleton — returns the outer component for chaining
const quantityField = form.find('/quantity');
quantityField.mask(node => new IMask(node, {
  mask: '0[.]00'
}));

// The inner field has the _maskInstance
const innerField = quantityField.children[''];
console.log(innerField._maskInstance !== undefined); // true
console.log(quantityField._maskInstance === undefined); // true
```

## Validation

Many masking libraries include built-in validation. You can integrate it by checking validity before accepting values:

```javascript
priceField.mask(node => {
  const imask = new IMask(node, {
    mask: Number,
    scale: 100,
    thousandsSeparator: ' '
  });

  // Listen for validation changes
  node.addEventListener('accept', (e) => {
    const input = e.target;
    input.setCustomValidity(imask.isValid ? '' : 'Please enter a valid price');
  });

  return imask;
});
```

## Masking is Permanent

When a mask converts an input to `text`, that change is permanent for the lifetime of the field instance. SmarkForm no longer tracks or restores the original type, as masking is treated as an intentional, final state. Native HTML5 behaviors are replaced by the mask's behavior, which is by design.

## Complete Example with CDN

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/imask"></script>
</head>
<body>
  <form id="myForm"></form>
  
  <script type="module">
    import { SmarkForm } from './dist/SmarkForm.esm.js';
    
    const form = new SmarkForm('#myForm');
    await form.rendered;

    // Credit card with spaces
    const cc = form.find('/cardNumber');
    cc.mask(node => new IMask(node, {
      mask: '0000 0000 0000 0000',
      blocks: {'0000': {mask: IMask.Number}}
    }));

    // Price with decimal and thousands separator
    const price = form.find('/price');
    price.mask(node => new IMask(node, {
      mask: Number,
      scale: 100,
      thousandsSeparator: ' '
    }));
  </script>
</body>
</html>
```