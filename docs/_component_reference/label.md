---
title: "«label» Component Type"
layout: chapter
description: "Associate SmarkForm labels with native fields and use non-native label elements for complex components."
permalink: "/component_reference/label"
nav_order: 17
redirect_from:
  - "/component_types/type_label"
---


{% include links.md %}
{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

The `label` component enhances native HTML labels and lets other elements label
SmarkForm components. It supports path-based targeting and implicit association.


<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {% include chaptertoc/type_label.html depth=2 %}

</details>

## Overview

SmarkForm labels add path-based association to native `<label>` elements and
allow non-native elements to label complex components:

- **Explicit Association:** Use `target` (rather than authoring `for`) with a
  path to the field. See [Form Traversing]({{ "/guides/form_traversing" | relative_url }}).
- **Implicit Association:** Without `target`, SmarkForm associates the label
  with the next field in component-tree order. Intermediate unenhanced elements
  do not break the search.
- **Nested Association:** You can nest the field inside the `<label>` itself, just like in standard HTML (do not use `target` in this case).

For label names, generated IDs, `aria-labelledby`, and author responsibilities,
see [Accessible Labels and Names]({{ "/accessibility/accessible_labels_and_names" | relative_url }}).


**Examples:**

{% raw %} <!-- basic_examples {{{ --> {% endraw %}
{% capture basic_examples -%}
<div id="myForm$$" data-smark='{"focus_on_click":false}'>
  <h2>Automatic association across markup</h2>
  <label data-smark>Click me!</label>
  <span><!-- Intermediate DOM nodes are transparent to SmarkForm's fields tree -->
    <input type="text" data-smark name="field01" placeholder="...and focus will come here">
  </span>
    <p>📌 The label finds the following field across the intermediate <code>&lt;span&gt;</code>.</p>

  <h2>Explicit target specification</h2>
  <label data-smark='{"target":"field02"}'>Click me!</label>
  <input data-smark name="not_field02" placeholder="(skipped)">
  <input data-smark name="field02" placeholder="...and focus will come here">
  <p>📌 Explicit target specified by relative path.</p>

  <h2>Native implicit pairing</h2>
  <label data-smark>Click me!
    <input data-smark name="field03" placeholder="...and focus will come here">
  </label>
  <p>📌 Wrapping the field inside still works likewise standard HTML.</p>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes -%}

👉 In this example, we've set `focus_on_click: false` in the form container's `data-smark` attribute to avoid
interfering with the demonstration of the label's behavior since, if enabled
(default), it would cause the first field to be focused when clicking anywere
in the form (except for actual fields and labels) masking the actual behavior
of the first label.

{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}


{% raw %} <!-- basic_tests {{{ --> {% endraw %}
{% capture basic_tests -%}
export default async ({ root, expect }) => {
    const labels = root.locator('label[data-smark-label]');
    const pairs = [
        ['field01', 0],
        ['field02', 1],
        ['field03', 2],
    ];
    for (const [name, labelIndex] of pairs) {
        const field = root.locator(`input[name="${name}"]`);
        const label = labels.nth(labelIndex);
        const id = await field.getAttribute('id');
        expect(id, `${name} receives an id`).toBeTruthy();
        await expect(label, `${name} label points to its field`).toHaveAttribute('for', id);
    }
};
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="basic_examples"
    htmlSource=basic_examples
    notes=notes
    tests=basic_tests
%}



## Details

- **Native labels:** Sets the target control's `for` attribute and generates an
  `id` only when the control does not already have one.
- **Non-native labels:** Gives the label an `id` and appends that ID to the
  target's `aria-labelledby` tokens without discarding existing tokens. See
  [Accessible Labels and Names]({{ "/accessibility/accessible_labels_and_names" | relative_url }}).

- **Automatic Pairing:** Without an explicit `target`, searches forward for the next SmarkForm field in component-tree order.
  - Default behavior correctly resolves the target in most cases, reducing manual configuration.

- **Custom Targeting:** Use the `target` property to explicitly specify which field to associate with when needed.
  - Supports absolute and relative paths (see [Form Traversing]({{ "/guides/form_traversing" | relative_url }})).

- **Implicit Pairing:** [Implicit
pairing](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label#associating_a_label_with_a_form_control)
(nesting the field inside the label) is supported.
  - The `target` property MUST NOT be used in this case.
  - Only one field can be nested inside a label.
  - SmarkForm enhances triggers inside labels, but native HTML does not allow
    interactive descendants such as buttons inside a `<label>`. Use a
    non-native label element when the label also needs interactive controls.

- **Native `<label>` limitation:** A native HTML `<label>` must target a native
  form control. To label a SmarkForm form, list, or other non-scalar component,
  use a non-native element such as `<span>` or `<legend>` with SmarkForm's
  `label` type.

- **Selectable Text:** The `allow_select` option controls whether label text can be selected; default is `false` for better UX.


## Targeting non-scalar fields {#targetting-non-scalar-fields}

Scalar fields use native controls such as `<input>`, `<select>`, and
`<textarea>`. Browsers can associate these controls with native `<label>`
elements, and SmarkForm can help resolve the target and generate the association.

Conversely, non scalar fields wrap multiple SmarkForm fields using other HTML elements that do not support native label association.

SmarkForm's `label` component type also lets a non-native element such as
`<span>` or `<legend>` label a complex form or list. These elements do not gain
native `<label>` behavior; SmarkForm adds an `aria-labelledby` relationship and
focuses the resolved component when appropriate.

{: .warning :}
> Use a non-native element when the target is a form, list, or other
> non-scalar component. SmarkForm raises `LABEL_FOR_NONFIELD` if a native
> `<label>` resolves to a target without a native form control.


You can use another element in place, such as `<span>`, `<b>`, or `<legend>`.

{: .info :}
> For an enhanced `<fieldset>`, a `<legend data-smark>` associates with its first
> child field. If the fieldset is not enhanced, implicit search can instead
> find the next SmarkForm field in the surrounding component tree.


**Examples:**

{% raw %} <!-- advanced_examples {{{ --> {% endraw %}
{% capture advanced_examples -%}
<div id="myForm$$" data-smark='{"focus_on_click":false}'>
  <h2>Targeting nested forms...</h2>
  <span data-smark='{"type": "label"}'>Click me (auto pairing)!</span>
  <fieldset data-smark name="subform01">
    <input data-smark name="field01" placeholder="First field">
    <input data-smark name="field02" placeholder="Second field">
  </fieldset>
  <span data-smark='{"type": "label"}'>Click me (nested pairing)!
    <fieldset data-smark name="subform02">
      <input data-smark name="field01" placeholder="First field">
      <input data-smark name="field02" placeholder="Second field">
    </fieldset>
  </span>
  <p>📌 <code>&lt;label&gt;</code> tag cannot be used here (See <i>Notes</i> tab).</p>

  <h2>Using &lt;legend&gt;...</h2>
  <fieldset data-smark name="subform03">
    <legend data-smark='{"type": "label"}'>Click me (using legend)!</legend>
    <input data-smark name="field01" placeholder="First field">
    <input data-smark name="field02" placeholder="Second field">
  </fieldset>
  <p>📌 The enhanced fieldset's legend associates with its first child field.</p>

  <h2>Targeting lists...</h2>
  <fieldset>
    <legend data-smark='{"type": "label"}'>
      <span class="button" title="Add new item" data-smark='{"action":"addItem", "context": "list01"}'>+</span>
      Click me (using legend)!
    </legend>
    <span id="list-author-label">Current tasks</span>
    <ul data-smark='{"type":"list", "name": "list01"}' aria-labelledby="list-author-label">
      <li>
        <input data-smark name="field01" placeholder="First field">
        <input data-smark name="field02" placeholder="Second field">
      </li>
    </ul>
    <span class="button" title="Remove last item" data-smark='{"action":"removeItem", "context": "list01"}'>-</span>
  </fieldset>
  <p>📌 This unenhanced fieldset's legend searches forward to the list.</p>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- advanced_examples_css {{{ --> {% endraw %}
{% capture advanced_examples_css -%}
{{""}}#myForm$$ .button {
  display: inline-block;
  padding: .2em .6em;
  margin: 0 .2em;
  border: 1px solid #ccc;
  border-radius: .25em;
  background: #f3f3f3;
  cursor: pointer;
}
{{""}}#myForm$$ .button:hover { background: #e9e9e9; }
{{""}}#myForm$$ .button:active { background: #ddd; }{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes -%}

👉 The list's `<fieldset>` is only stylistic; it has no `data-smark` attribute.
The legend therefore uses implicit forward search to target the list.

👉 Likewise in the previous one, this example uses `focus_on_click: false` in the form container's `data-smark` attribute to avoid
interfering with the demonstration of the label's behavior.

{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}


{% raw %} <!-- advanced_tests {{{ --> {% endraw %}
{% capture advanced_tests -%}
export default async ({ root, expect }) => {
    const linked = await root.evaluate(element => {
        const labels = [...element.querySelectorAll('[data-smark-label]')];
        const targets = [...element.querySelectorAll('[aria-labelledby]')];
        return labels.map(label => targets.some(target =>
            (target.getAttribute('aria-labelledby') || '').split(/\s+/).includes(label.id)
        ));
    });
    expect(linked).toEqual([true, true, true, true]);
    const listLabel = root.locator('legend[data-smark-label]').nth(1);
    const listLabelId = await listLabel.getAttribute('id');
    const listTokens = (await root.locator('ul').getAttribute('aria-labelledby')).split(/\s+/);
    expect(listTokens).toContain('list-author-label');
    expect(listTokens).toContain(listLabelId);
};
{%- endcapture %}{% raw %} <!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="advanced_examples"
    htmlSource=advanced_examples
    cssSource=advanced_examples_css
    notes=notes
    tests=advanced_tests
%}


## Options

The `label` component supports several configuration options:

- **`allow_select`** (boolean, default: false): Controls whether the label text can be selected by the user. When false, sets `user-select: none` CSS property.
- **`context`** (string): Specifies the base component for resolving `target`.
- **`target`** (string): Explicitly selects the field/component to label. The
  path resolves from `context` when set, otherwise from the label's enclosing
  field component; a leading `/` starts at the root. See
  [Form Traversing]({{ "/guides/form_traversing" | relative_url }}).


## API Reference

The `label` component type is primarily a passive enhancement component and does not expose the standard import/export/clear actions that field components provide. Instead, it focuses on:

- **Field Association:** Automatically establishing relationships with form fields
- **Association helpers:** Adding native `for`/`id` or non-native
  `aria-labelledby` relationships. Authors remain responsible for meaningful
  names and assistive-technology testing.
- **Action Component Management:** Allowing action components (like buttons) to be placed within labels for enhanced user interaction

Labels work by enhancing the DOM structure and relationships rather than managing data, making them fundamentally different from field components that are data-oriented.
