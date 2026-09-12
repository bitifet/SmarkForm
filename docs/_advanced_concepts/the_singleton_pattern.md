---
title: "The Singleton Pattern"
layout: chapter
permalink: /advanced_concepts/the_singleton_pattern
nav_order: 1

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
* [What Makes a Singleton](#what-makes-a-singleton)
* [Advantages](#advantages)
* [Common Use Cases](#common-use-cases)
    * [Complex HTML as a Single Field](#complex-html-as-a-single-field)
    * [Avoiding Absolute Context Paths](#avoiding-absolute-context-paths)
    * [Wrappers and Triggers Inside List Items](#wrappers-and-triggers-inside-list-items)
    * [File Fields and Whole-Container Drop & Paste](#file-fields-and-whole-container-drop--paste)
    * [Scalar Lists](#scalar-lists)
* [Restrictions and Errors](#restrictions-and-errors)
    * [NOT_A_SINGLETON](#not_a_singleton)
    * [SINGLETON_TYPE_MISMATCH](#singleton_type_mismatch)
    * [Relative vs Absolute Context](#relative-vs-absolute-context)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>

## Overview

The *Singleton Pattern* (a.k.a. just "singleton") is a special behaviour of
the *Scalar field types* (the ones deriving from
[`input`]({{ "component_types/type_input" | relative_url }}), such as
[`number`]({{ "component_types/type_number" | relative_url }}),
[`date`]({{ "component_types/type_input#type-date" | relative_url }}),
[`color`]({{ "component_types/type_color" | relative_url }}) and
[`file`]({{ "component_types/type_file" | relative_url }})) that lets you use
**any HTML tag** as the *SmarkForm* component of a given scalar type, instead
of the native `<input>`, `<select>` or `<textarea>` element.

The only restriction is that the tag must contain **exactly one** form field
inside — though it may contain any number of *trigger* components.

This lets complex HTML work as a single *SmarkForm* field.

## What Makes a Singleton

A *singleton* is simply a *scalar* component whose *target node* is **not** the
form field itself, but a wrapper tag surrounding it:

```html
<div data-smark='{"type":"input","name":"username"}'>
    <label data-smark>👤 User name</label>
    <input data-smark>
    <button data-smark='{"action":"clear"}'>❌ Clear</button>
</div>
```

The wrapper adopts the following rules:

  * **Exactly one field:** the wrapper may contain only **one** non-trigger
    component — an `<input>`, `<textarea>` or `<select>`, or any other *scalar*
    field (e.g. `color` or `file`, which are themselves `<input>`-derived).
    This is what makes it a *singleton*. Violating this raises a
    `NOT_A_SINGLETON` error (see [Restrictions](#restrictions-and-errors)).
  * **Naming:** the `name` can be declared on the wrapper (via its `data-smark`
    property) or on the inner field (via the `name` attribute or a `data-smark`
    property). Declaring it on the wrapper is recommended — it is more
    structural, and it is what the examples below do.
  * **Scalar import/export:** the component imports and exports **only** the
    value of the inner field.
  * **Inheritance:** scalar options (e.g. `accept`, `format`, `encoding`,
    `mask`…) declared on the wrapper are automatically inherited by the inner
    field.

## Advantages

👉 **Cleaner code:** you no longer need to specify a *context* for every
   trigger inside the wrapper — they belong to it naturally (see
   [Avoiding Absolute Context Paths](#avoiding-absolute-context-paths)).

👉 **Richer UI:** you can build drop zones, icon+label pairs, drag handles and
   buttons around a single scalar field while still exporting just its value.

👉 **Reusability:** a singleton block can be copied verbatim between forms
   without absolute paths breaking, because every trigger inside resolves
   relative to the wrapper.

👉 **Lists of scalars:** scalar lists (`"of":"file"`, `"of":"input"`…) use
   singletons as their item template, so each item can carry its own triggers
   (see [Scalar Lists](#scalar-lists)).

## Common Use Cases

### Complex HTML as a Single Field

The simplest use is wrapping a field with *labels*, *icons* and *buttons* so
the whole thing behaves as one component:

```html
<span data-smark='{"type":"color","name":"bgcolor"}'>
    <label data-smark>Background</label>
    <input type="color" data-smark>
    <button data-smark='{"action":"clear"}' title='Reset'>❌</button>
</span>
```

Try the playable [color example](#color-reset-example-singleton) below.

### Avoiding Absolute Context Paths

Without a singleton, a trigger that needs to act on a field elsewhere in the
form must specify an explicit `context` — often an absolute path like
`"/color"`. If the field block is later moved or copied, that absolute path
breaks.

Wrapping the field and its triggers in a singleton lets every trigger stay
relative to the wrapper, so the block is **portable**:

```html
<input type="color" name="bgcolor" data-smark>
<!-- ... elsewhere ... -->
<button data-smark='{"action":"clear","context":"/bgcolor"}' title='Reset'>❌</button>
```

vs.

```html
<span data-smark='{"type":"color","name":"bgcolor"}'>
    <input type="color" data-smark>
    <button data-smark='{"action":"clear"}' title='Reset'>❌</button>
</span>
```

The second version works no matter where the block is placed — no absolute
path to break.

### Wrappers and Triggers Inside List Items

Inside a list, each item is a *subform*. If the list holds *scalar* items
(`"of":"input"` etc.), there is usually no room for trigger components in the
item template — but a *singleton* provides that room. Each item can then have
its own buttons (e.g. to remove that specific item):

See the playable [phone numbers list](#phone-list-example-singleton) below.

### File Fields and Whole-Container Drop & Paste

The
[`file`]({{ "component_types/type_file" | relative_url }}) component type
makes extensive use of the singleton: wrapping a file field in a drop-zone
turns the **whole container** into the field, so drop and paste are detected
over the entire area, and the container delegates actions (download, pick…)
to the inner field.

👉 See the [Singleton file example]({{ "component_types/type_file#the-singleton-pattern" | relative_url }}).

### Scalar Lists

Lists whose items are scalars (e.g. `"of":"file"` or `"of":"input"`) use
*singletons* as their item template. This is what allows each item to carry
triggers like `removeItem`, and it is also the recommended way to build lists
of files with per-item drop zones (see
[Files in Lists]({{ "component_types/type_file#files-in-lists-of-file" | relative_url }})).

The `"of"` option itself is just *syntax sugar*: it declares the item's scalar
type so the item template doesn't need its own `data-smark` attribute just to
specify it (see [`of` in the List reference](
{{ "component_types/type_list#of" | relative_url }})).

## Restrictions and Errors

### NOT_A_SINGLETON

If a scalar wrapper contains **more than one** non-trigger field (or none),
SmarkForm raises a `NOT_A_SINGLETON` error at render time. A singleton must
hold exactly one field.

### SINGLETON_TYPE_MISMATCH

If the inner field's type does not match the scalar type declared on the
wrapper, a `SINGLETON_TYPE_MISMATCH` error is raisedhols. For example, a
wrapper declared as `"type":"color"` must contain a single `color` (or
`input`-derived, type-compatible) inner field.

### Relative vs Absolute Context

Inside a singleton, triggers without a `context` resolve up the ancestor
chain to the wrapper — never to the form root. This is exactly what makes the
pattern portableikuha. Use absolute paths (`"/name"`) only when you truly need
to be global.

{: .info}
> When an example is shown with the *sampletabs editor* (`showEditor=true`),
> the editor wraps the example in a `demo` subform, so **absolute** trigger
> `context`/`target` paths or absolute `myForm.find('/…')` calls are not
> allowed — they would throw `UNKNOWN_ACTION`/`RenderError` in the live
> preview. Always use relative (or no) context in editor-shown examples.

## Color Reset Example (Singleton)

A playable example of a *color* field wrapped in a singleton so its **Clear**
button stays relative and the block is portable:

{% raw %} <!-- singleton_pattern_color_html {{{ --> {% endraw %}
{% capture singleton_pattern_color_html -%}
<div id="myForm$$">
  <span data-smark='{"type":"color","name":"bgcolor"}'>
    <label data-smark>Background</label>
    <input type="color" data-smark>
    <button data-smark='{"action":"clear"}' title='Reset'>❌</button>
  </span>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- singleton_pattern_color_css {{{ --> {% endraw %}
{% capture singleton_pattern_color_css -%}
{{""}}#myForm$$ form span {
    display: flex;
    align-items: center;
    gap: .75rem;
}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- singleton_pattern_color_notes {{{ --> {% endraw %}
{% capture singleton_pattern_color_notes -%}
👉 The **❌ Reset** button needs **no `context`**: it resolves to the wrapper
   (the singleton), and the *clear* action is delegated to the inner color
   field.

👉 Try importing a value and then changing the color, or press **❌ Reset** to
   go back to the empty (`null`) state.
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- singleton_pattern_color_demoValue {{{ --> {% endraw %}
{% capture singleton_pattern_color_demoValue -%}
{
    "bgcolor": "#3a7bd5"
}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- singleton_pattern_color_tests {{{ --> {% endraw %}
{% capture singleton_pattern_color_tests -%}
export default async ({ page, expect, id, root, readField, writeField }) => {
    await expect(root).toBeVisible();

    // Reset clears the color back to null (no absolute context needed).
    await writeField('bgcolor', '#ff0000');
    expect(await readField('bgcolor')).toBe('#ff0000');
    await page.getByRole('button', { name: 'Reset' }).click();
    expect(await readField('bgcolor')).toBeNull();
};
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="singleton_color_reset"
    htmlSource=singleton_pattern_color_html
    cssSource=singleton_pattern_color_css
    notes=singleton_pattern_color_notes
    selected="preview"
    showEditor=true
    demoValue=singleton_pattern_color_demoValue
    tests=singleton_pattern_color_tests
%}

{: .hint}
> Without the singleton you would have to point the *clear* action to an
> absolute context (e.g. `"context":"/bgcolor"`), which breaks if the block is
> moved or copied. The singleton keeps it self-contained.

## Phone List Example (Singleton)

A *list* of *scalar* items, where each phone input is wrapped in a singleton
so the item template can host its own **➖ Remove** button:

{% raw %} <!-- singleton_pattern_phones_html {{{ --> {% endraw %}
{% capture singleton_pattern_phones_html -%}
<div id="myForm$$">
  <ul data-smark='{"type":"list","name":"phones","of":"input","min_items":0}'>
    <li data-smark='{"type":"input","name":"phone"}'>
      <input type="tel" data-smark placeholder="Phone Number">
      <button data-smark='{"action":"removeItem"}' title='Remove'>➖</button>
    </li>
  </ul>
  <button data-smark='{"action":"addItem","context":"phones"}' title='Add Phone'>➕</button>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- singleton_pattern_phones_css {{{ --> {% endraw %}
{% capture singleton_pattern_phones_css -%}
{{""}}#myForm$$ ul {
    list-style: none;
    padding-left: 0;
}
{{""}}#myForm$$ li {
    display: flex;
    align-items: center;
    gap: .5rem;
    margin-bottom: .5rem;
}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- singleton_pattern_phones_notes {{{ --> {% endraw %}
{% capture singleton_pattern_phones_notes -%}
👉 Each `li` is a *singleton* of type *input*: it contains one phone field plus
   its **➖ Remove** trigger.

👉 Because the item template root carries the type, we don't need
   `data-smark` on the `<input>` child — but it's kept implicit via
   `data-smark` for clarity.

👉 **➕ Add Phone** uses `"action":"addItem","context":"phones"` to append a
   new singleton item.

👉 Note the item `name:"phone"` is irrelevant for export — the list exports a
   flat `String[]` of phones.
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- singleton_pattern_phones_demoValue {{{ --> {% endraw %}
{% capture singleton_pattern_phones_demoValue -%}
{
    "phones": [
        "+1 555 100 2000",
        "+1 555 200 3000"
    ]
}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- singleton_pattern_phones_tests {{{ --> {% endraw %}
{% capture singleton_pattern_phones_tests -%}
export default async ({ page, expect, id, root, readField, writeField }) => {
    await expect(root).toBeVisible();

    // Import two phones as a flat scalar array.
    await writeField('phones', ['+1 555 111 2222']);
    expect(await readField('phones')).toEqual(['+1 555 111 2222']);

    // Rename the single item and add a second one via the button.
    await page.fill(`#myForm-${id} li:first-child input`, '999');
    await page.getByRole('button', { name: 'Add Phone' }).click();
    await expect.poll(() => page.locator(`#myForm-${id} li`).count()).toBe(2);
};
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="singleton_phones"
    htmlSource=singleton_pattern_phones_html
    cssSource=singleton_pattern_phones_css
    notes=singleton_pattern_phones_notes
    selected="preview"
    showEditor=true
    demoValue=singleton_pattern_phones_demoValue
    tests=singleton_pattern_phones_tests
%}
