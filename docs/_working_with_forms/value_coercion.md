---
title: "Value Coercion"
layout: chapter
permalink: /working_with_forms/value_coercion
nav_order: 4

---

{% include links.md %}
{% include components/sampletabs_ctrl.md %}

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

{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes -%}
👉 **Scalar-to-array coercion**: If you import a plain string instead of an
array, *SmarkForm* automatically places it in a single-item list.

  * Click **⬇️ Export**, change `["alice@example.com"]` to just
    `"alice@example.com"` in the JSON playground editor below, then click
    **⬆️ Import** — the single email is placed in the list automatically.
  * This mirrors the upgrade from a single-value field (e.g. `"email"`) to a
    list field (e.g. `"emails": [...] `).

👉 **Empty items are not exported** by default (controlled by `exportEmpties`).

  * Click **➕** to add a blank item, then **⬇️ Export** — the blank row will
    be absent from the output, keeping saved data clean.
  * Set `"exportEmpties": true` on the list to keep blank slots in the data
    (useful in draft-save workflows where you want to preserve the user's
    position in the list).

{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- smart_value_coercion {{{ --> {% endraw %}
{% capture smart_value_coercion -%}
<div id="myForm$$">
█<button data-smark='{"action":"removeItem","context":"email","preserve_non_empty":true}' title="Remove email">➖</button>
█<button data-smark='{"action":"addItem","context":"email"}' title="Add email">➕</button>
█<strong data-smark="label">Emails:</strong>
█<ul data-smark='{"type":"list","name":"email","of":"input","min_items":0}'>
█    <li data-smark='{"role":"empty_list"}'>(No emails on record)</li>
█    <li><input type="email" data-smark placeholder="name@example.com"></li>
█</ul>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- smart_value_coercion_css {{{ --> {% endraw %}
{% capture smart_value_coercion_css -%}
{{""}}#myForm$$ ul {
    list-style: none;
    padding-left: 0;
}{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- smart_value_coercion_tests {{{ --> {% endraw %}
{% capture smart_value_coercion_tests -%}
export default async ({ page, expect, id, root, readField, writeField }) => {
    await expect(root).toBeVisible();

    // Scalar-to-array coercion
    await writeField('email', 'bob@example.com');
    expect(
        await readField('email'),
        'Scalar string is coerced to a single-item array'
    ).toEqual(['bob@example.com']);

    // Array import works as expected
    await writeField('email', ['carol@example.com', 'dave@example.com']);
    expect(
        await readField('email'),
        'Array import works normally'
    ).toEqual(['carol@example.com', 'dave@example.com']);

    // exportEmpties = false: blank items are not exported
    await page.evaluate(() => myForm.find('/email').addItem());
    expect(
        await readField('email'),
        'Blank item is not exported (exportEmpties defaults to false)'
    ).toEqual(['carol@example.com', 'dave@example.com']);

    // Filling the new blank item makes it appear in the export
    const inputs = page.locator(`#myForm-${id} input[type=email]`);
    await inputs.last().fill('eve@example.com');
    expect(
        await readField('email'),
        'Filled item IS exported'
    ).toEqual(['carol@example.com', 'dave@example.com', 'eve@example.com']);
};

{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
    "email": "alice@example.com" // Old data saved before upgrading to an array
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="smart_value_coercion"
    htmlSource=smart_value_coercion
    cssSource=smart_value_coercion_css
    notes=notes
    selected="preview"
    showEditor=true
    demoValue=demoValue
    tests=smart_value_coercion_tests
%}

## Number, Date, Time, and JSON Coercion

Fields with a specific HTML type automatically coerce values on both import and
export:

- `<input type="number">` exports a JavaScript **number** (not a string),
  and accepts string representations on import (e.g. `"28"` → `28`).
- `<input type="date">` exports an ISO 8601 string (`YYYY-MM-DD`), and
  accepts compact strings (`YYYYMMDD`) and `Date` objects on import.
- `<input type="time">` exports `HH:MM:SS` and accepts `HH:MM` on import.
- Any field exports **`null`** when empty, to explicitly signal "unknown or
  indifferent" rather than an empty string.

### JSON encoding

Adding `{"encoding":"json"}` to any `<input>` or `<textarea>` enables JSON
round-trips: the field stores the value internally as a JSON string but
**exports** it as a parsed JavaScript value (object, array, number, or `null`).

{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes -%}
👉 **Number coercion**: The *Age* field is `<input type="number">`.

  * *SmarkForm* always exports its value as a JavaScript **number**, not a
    string.
  * It also accepts string representations on import — try clicking **⬇️
    Export**, changing `"age": 28` to `"age": "28"` (quoted) in the JSON
    playground editor, and clicking **⬆️ Import**: the exported result will be
    `"age": 28` (unquoted) again.

👉 **Date normalization**: The *Date of Birth* field is `<input type="date">`.

  * *SmarkForm* always exports an ISO 8601 string (`YYYY-MM-DD`).
  * It accepts compact strings (`YYYYMMDD`) and `Date` objects on import.
    Try clicking **⬇️ Export**, changing `"dob": "1996-03-15"` to
    `"dob": "19960315"` in the JSON playground editor, and clicking **⬆️
    Import** — it will be normalised to `"1996-03-15"` on the next export.

👉 **JSON encoding**: The *Metadata* textarea has `{"encoding":"json"}`.

  * On import, an object or array is serialised to JSON text (pretty-printed
    in textareas for readability).
  * On export, the textarea content is parsed back into a JavaScript value —
    your saved data contains a **real object**, not a raw JSON string.
  * Works with any valid JSON: objects, arrays, numbers, booleans, and `null`.

{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- type_coercion {{{ --> {% endraw %}
{% capture type_coercion -%}
<div id="myForm$$">
█<p>
█    <label data-smark>Name:</label>
█    <input type="text" name="name" data-smark>
█</p>
█<p>
█    <label data-smark>Age:</label>
█    <input type="number" name="age" min="0" max="150" data-smark>
█</p>
█<p>
█    <label data-smark>Date of Birth:</label>
█    <input type="date" name="dob" data-smark>
█</p>
█<p>
█    <label data-smark>Metadata (JSON):</label>
█    <textarea name="metadata" data-smark='{"encoding":"json"}'></textarea>
█</p>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- type_coercion_tests {{{ --> {% endraw %}
{% capture type_coercion_tests -%}
export default async ({ page, expect, id, root, readField, writeField }) => {
    await expect(root).toBeVisible();

    // Number coercion: string input → number output
    await writeField('age', '35');
    expect(
        await readField('age'),
        'Number field coerces string to number on export'
    ).toStrictEqual(35);

    // Empty number field exports null
    await writeField('age', null);
    expect(
        await readField('age'),
        'Number field exports null when empty'
    ).toStrictEqual(null);

    // Date normalization: compact string → ISO format
    await writeField('dob', '20000101');
    expect(
        await readField('dob'),
        'Date field normalizes compact strings to ISO format'
    ).toStrictEqual('2000-01-01');

    // Empty date field exports null
    await writeField('dob', null);
    expect(
        await readField('dob'),
        'Date field exports null when empty'
    ).toStrictEqual(null);

    // JSON encoding: object round-trips through textarea
    const metaObj = { subscribed: true, tier: 'premium' };
    await writeField('metadata', metaObj);
    expect(
        await readField('metadata'),
        'JSON-encoded textarea round-trips objects correctly'
    ).toEqual(metaObj);

    // JSON encoding: null clears the textarea
    await writeField('metadata', null);
    expect(
        await readField('metadata'),
        'JSON-encoded textarea exports null when cleared'
    ).toStrictEqual(null);
};

{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
    "name": "Alice",
    "age": "28",  // String instead of number, will be coerced to a number
    "dob": "19960315", // Correctly parsed as date.
    "metadata": { // Will be exported/imported as JSON
                  // If invalid exports null (catch that from validation)
        "subscribed": true,
        "tier": "premium"
    }
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="type_coercion"
    htmlSource=type_coercion
    notes=notes
    selected="preview"
    showEditor=true
    demoValue=demoValue
    tests=type_coercion_tests
%}

> **See also:**
> [Data Import and Export]({{ "/working_with_forms/data_import_and_export" | relative_url }}),
> [Form Types]({{ "/component_types/type_form" | relative_url }}),
> [List Types]({{ "/component_types/type_list" | relative_url }})
