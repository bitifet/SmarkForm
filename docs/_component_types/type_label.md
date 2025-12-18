---
title: «label» Component Type
layout: chapter
permalink: /component_types/type_label
nav_order: 10001

---

{% include components/sampletabs_ctrl.md noShowHint=true %}

# {{ page.title }}

The `label` component is an enhancement of the HTML `<label>` element. It
provides better support for accessibility and field association, features
SmarkForm features like relative paths, and intelligent defaults.


<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

    * [Overview](#overview)
    * [Details](#details)
    * [Targetting non scalar fields](#targetting-non-scalar-fields)
* [myForm$$ .button:hover {](#myform-buttonhover-)
* [myForm$$ .button:active {](#myform-buttonactive-)
    * [Options](#options)
    * [API Reference](#api-reference)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>

## Overview

Enhanced SmarkForm `label` elements work similarly to standard HTML labels but offer greater flexibility and automation:

- **Explicit Association:** Use the `target` property (instead of `for`). Specify a [relative path]({{"advanced_concepts/form_traversing#relative-paths" | relative_url }}) to the field—typically its name.
- **Implicit Association:** No need to specify `target`. SmarkForm automatically associates the `<label>` with the nearest field.
- **Nested Association:** You can nest the field inside the `<label>` itself, just like in standard HTML (do not use `target` in this case).


**Examples:**

{% raw %} <!-- basic_examples {{{ --> {% endraw %}
{% capture basic_examples %}
    <h2>Explicit association</h2>
    <label data-smark>Click me!</label>
    <span><!-- Intermediate DOM nodes are transparent to SmarkForm's fields tree -->
        <input type="text" data-smark name="field01" placeholder="...and focus will come here">
    </span>
    <p>📌 Label propperly guesses the more appropriate target, even though the intermediate <code>&lt;span&gt;</code>.</p>

    <h2>Explicit target specification</h2>
    <label data-smark='{"target":"field02"}'>Click me!</label>
    <input data-smark name="not_field02" placeholder="(skipped)">
    <input data-smark name="field02" placeholder="...and focus will come here">
    <p>📌 Explicit target specified by relative path.</p>

    <h2>Implicit pairing</h2>
    <label data-smark>Click me!
        <input data-smark name="field03" placeholder="...and focus will come here">
    </label>
    <p>📌 Wrapping the field inside still works likewise standard HTML.</p>
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes %}

👉 In this example, we've set `formOptions='{"focus_on_click":false}'` to avoid
interfering with the demonstration of the label's behavior since, if enabled
(default), it would cause the first field to be focused when clicking anywere
in the form (except for actual fields and labels) masking the actual behavior
of the first label.

{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}


{% include components/sampletabs_tpl.md
    formId="basic_examples"
    htmlSource=basic_examples
    notes=notes
    showEditor=false
    formOptions='{"focus_on_click":false}'
    tests=false
%}

{% raw %} <!-- basic_tests {{{ --> {% endraw %}
{% capture basic_tests %}
export default async ({ page, expect, id, root, readField, writeField }) => {
    await expect(root).toBeVisible();

    // Check that clicking everywhere in the form focuses its first field.
    page.getByRole('heading', { name: 'Model details' }).click();
    await expect(page.getByRole('textbox', { name: 'Model Name:' })).toBeFocused();

    await page.keyboard.type('Yaris');
    await page.keyboard.press('Enter');
    expect(await readField('model')).toStrictEqual("Yaris");

    const typeSelector = page.getByLabel('Type:');
    await expect(typeSelector).toBeFocused();
    await typeSelector.selectOption('Motorcycle');
    expect(await readField('type')).toStrictEqual("Motorcycle");

    await page.keyboard.press('Enter'); // Navigate to next field
    await page.keyboard.type('First row');
    await page.keyboard.press('Enter'); // Should not navigate outside textarea
    await page.keyboard.type('Second row');
    expect(await readField('longdesc')).toStrictEqual("First row\nSecond row");

    await page.keyboard.down('Control'); 
    await page.keyboard.press('Enter'); 
    await page.keyboard.up('Control'); // Now we should be out of textarea

    expect(await readField('seats')).toStrictEqual(null);
    await page.keyboard.type('35');
    await page.keyboard.press('Enter'); 
    expect(await readField('seats')).toStrictEqual(35);

    expect(await readField('side')).toStrictEqual(null);
    await page.keyboard.press('ArrowRight'); // Select "Right"
    expect(await readField('side')).toStrictEqual("right");
    await page.keyboard.press('Delete'); // Unselect
    expect(await readField('side')).toStrictEqual(null);
    await page.keyboard.press('Enter'); 

    expect(await readField('color'), 'Exports null by default').toStrictEqual(null);
    await writeField('color', '#ff0000'); // Browser color picker UX may differ
    expect(await readField('color'), 'Can be set').toStrictEqual('#ff0000');
    await writeField('color', '#fea'); // Browser color picker UX may differ
    expect(await readField('color'), 'Accepts short format').toStrictEqual('#ffeeaa');
    await page.keyboard.press('Delete'); 
    expect(await readField('color'), 'Can be cleared').toStrictEqual(null);


    // Export the data
    const data = await page.evaluate(async () => {
        return await myForm.export();
    });

    // Verify the exported data
    const expectedData = {
      "model": "Yaris",
      "type": "Motorcycle",
      "longdesc": "First row\nSecond row",
      "seats": 35,
      "side": null,
      "color": null
    };

    expect(data).toEqual(expectedData);

};
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}



## Details

- **Accessibility Enhancements:** Automatically sets `for` attributes and generates unique IDs to the targetted field when necessary.

- **Automatic Pairing:** Automatically associates with the next field in the DOM.
  - Default behavior correctly resolves the target in most cases, reducing manual configuration.

- **Custom Targeting:** Use the `target` property to explicitly specify which field to associate with when needed.
  - Supports absolute and relative paths (see [From Traversing]({{"advanced_concepts/form_traversing" | relative_url }}).

- **Implicit Pairing:** [Implicit
pairing](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label#associating_a_label_with_a_form_control)
(nesting the field inside the label) is supported.
  - The `target` property MUST NOT be used in this case.
  - Only one field can be nested inside a label.
  - Triggers are allowed inside label elements with no restriction.

- **Limitations:** Labels are only compatible with native HTML input elements (scalars), not complex components or lists.

- **Selectable Text:** The `allow_select` option controls whether label text can be selected; default is `false` for better UX.


## Targetting non scalar fields

Scalar fields are built on top (or wrapping them in case of the singleton pattern) of native HTML form controls like `<input>`, `<select>`, and `<textarea>`. These elements can be natively associated with a `<label>` element using the standard HTML mechanisms. SmarkForm only aids in this process by automating the association and enhancing accessibility.

Conversely, non scalar fields wrap multiple SmarkForm fields using other HTML elements that do not support native label association.

Smarkform's `<label>` component type extends the labeling capabilities to these complex fields by allowing any HTML element to function as a label, enabling association with complex fields.

{: .warning :}
> To avoid confussion or generating invalid HTML, SmarkForm will complain if a
> `<label>` element is used over non-scalar fields.


You can use any other element in place, like `<span>`, `<b>` or even `<legend>`.

{: .info :}
> In case of `<legend>`, automatic association is smart enough to target the
> containing `<fieldset>` element without further configuration **if it is
> enhanced as SmarkForm field**.


**Examples:**

{% raw %} <!-- advanced_examples {{{ --> {% endraw %}
{% capture advanced_examples %}
    <h2>Targetting nested forms...</h2>
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
    <p>📌 Fieldset's <code>&lt;legend&gt;</code> tags are special case where the containing <code>&lt;fieldset&gt;</code> is automatically targetted.</p>

    <h2>Targetting lists...</h2>
    <fieldset>
        <legend data-smark='{"type": "label"}'>
            <span class="button" title="Add new item" data-smark='{"action":"addItem", "context": "list01"}'>+</span>
            Click me (using legend)!
        </legend>
        <ul data-smark='{"type":"list", "name": "list01"}'>
            <li>
                <input data-smark name="field01" placeholder="First field">
                <input data-smark name="field02" placeholder="Second field">
            </li>
        </ul>
        <span class="button" title="Remove last item" data-smark='{"action":"removeItem", "context": "list01"}'>-</span>
    </fieldset>
    <p>📌 Fieldset's <code>&lt;legend&gt;</code> tags are special case where the containing <code>&lt;fieldset&gt;</code> is automatically targetted.</p>
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- advanced_examples_css {{{ --> {% endraw %}
{% capture advanced_examples_css
%}#myForm$$ .button {
  display: inline-block;
  padding: 3px 12px;
  margin: 0 4px;
  font-family: system-ui, sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f0f0f0;
  color: #333;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  transition: background-color 0.2s;
}

#myForm$$ .button:hover {
  background-color: #e0e0e0;
}

#myForm$$ .button:active {
  background-color: #d0d0d0;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
}{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes %}

👉 Notice that, in the case of the list example, the `<fieldset>` is only stylistic (it has no `data-smark` attribute), since it has to wrap also list controls to add or remove items that that conceptually goes together with the list itself.
  - In this case, the `<legend>` (since the `<fieldset> is not enhanced)
    correctly targets the list field after itself.

👉 Likewise in the previous one, this example uses `formOptions='{"focus_on_click":false}'` to avoid
interfering with the demonstration of the label's behavior.

{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}


{% include components/sampletabs_tpl.md
    formId="advanced_examples"
    htmlSource=advanced_examples
    cssSource=advanced_examples_css
    notes=notes
    showEditor=false
    formOptions='{"focus_on_click":false}'
    tests=false
%}


## Options

The `label` component supports several configuration options:

- **`allow_select`** (boolean, default: false): Controls whether the label text can be selected by the user. When false, sets `user-select: none` CSS property.
- **`context`** (string): Specifies the context component for field resolution. Relative paths start from the default context.
- **`target`** (string): Explicitly specifies which field the label should associate with. Can be a relative or absolute path to the target component.


## API Reference

The `label` component type is primarily a passive enhancement component and does not expose the standard import/export/clear actions that field components provide. Instead, it focuses on:

- **Field Association:** Automatically establishing relationships with form fields
- **Accessibility Enhancement:** Improving screen reader and keyboard navigation support
- **Action Component Management:** Allowing action components (like buttons) to be placed within labels for enhanced user interaction

Labels work by enhancing the DOM structure and relationships rather than managing data, making them fundamentally different from field components that are data-oriented.

