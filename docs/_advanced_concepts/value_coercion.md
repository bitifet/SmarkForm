---
title: "Value Coercion"
layout: chapter
permalink: /advanced_concepts/value_coercion
nav_order: 15

---

{% include links.md %}

# {{ page.title }}

SmarkForm automatically normalises imported values to match the expected type
and shape of each field. This keeps your forms resilient to data-model changes
and ensures that what you save is always clean and well-typed.

## Scalar-to-Array List Coercion

When a **list** field receives a non-array value — a plain string, a number,
or an object — it automatically wraps it in a single-item array.

This is particularly useful for **model migrations**: if a field that used to
hold a single `email` string is upgraded to accept a list of `emails`, old
saved data continues to work without any transformation step.

### Exporting Empty Items

By default, empty items are **not** exported (`exportEmpties: false`). This
keeps saved data clean by omitting blank rows.

Set `"exportEmpties": true` on the list to preserve empty slots — useful in
draft-save workflows where you want to retain the user's position in the list.

```javascript
// Old data saved before upgrading to an array:
"alice@example.com"       // ← scalar value

// After import, automatically becomes:
["alice@example.com"]     // ← single-item array
```

## Number Coercion

Fields with `type="number"` (`<input type="number">`) export a JavaScript
**number** (not a string). They accept string representations on import
(e.g. `"28"` → `28`).

```javascript
// Import: string → number
writeField('age', '35');

// Export: JavaScript number
readField('age'); // → 35
```

Empty number fields export `null`.

## Date Coercion

Fields with `type="date"` export an ISO 8601 string (`YYYY-MM-DD`). They
accept compact strings (`YYYYMMDD`) and `Date` objects on import.

```javascript
// Import: compact string → ISO
writeField('dob', '20000101');

// Export
readField('dob'); // → "2000-01-01"
```

Empty date fields export `null`.

## Time Coercion

Fields with `type="time"` export `HH:MM:SS` and accept `HH:MM` on import.

## JSON Encoding

Adding `{"encoding":"json"}` to any `<input>` or `<textarea>` enables JSON
round-trips: the field stores the value internally as a JSON string but
**exports** it as a parsed JavaScript value (object, array, number, or `null`).

```html
<textarea data-smark='{"encoding":"json"}'></textarea>
```

- On import, an object or array is serialised to JSON text (pretty-printed
  in textareas for readability).
- On export, the textarea content is parsed back into a JavaScript value —
  your saved data contains a **real object**, not a raw JSON string.

## Null for Empty Fields

Any field exports `null` when empty, to explicitly signal "unknown or
indifferent" rather than an empty string.

> **See also:**
> [Form Types]({{ "/component_types/type_form" | relative_url }}),
> [List Types]({{ "/component_types/type_list" | relative_url }}),
> [Data Import and Export]({{ "/advanced_concepts/data_import_and_export" | relative_url }})
