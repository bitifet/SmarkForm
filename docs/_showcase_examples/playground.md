---
title: "Playground"
layout: chapter
description: "Learn how SmarkForm's interactive documentation examples work, then try a complete form, inspect its source, and experiment with JSON data."
permalink: "/showcase_examples/playground"
nav_order: 1
redirect_from:
  - "/resources/playground"
---

{% include links.md %}
{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

Interactive examples let you try SmarkForm forms directly in the documentation.
This page explains their tabs and controls, then gives you a complete form to
experiment with.

{: .hint}
> **TL;DR:** Open **👁️ Preview** to interact with fields. Use **📋 Show playground
> editor** to exchange JSON, or choose **✏️ Edit** → **▶️ Run** to try source changes.
> Start with the [complete event-plan example](#try-a-complete-form).

<details class="chaptertoc">
<summary><strong>📖 Table of Contents</strong></summary>
{% include chaptertoc/playground.html depth=3 %}
</details>

## Interactive examples {#interactive-examples}

Interactive examples combine a runnable form with its source code and
example-specific guidance. Most offer some or all of these tabs:

- **🗒️ HTML** shows the example's markup.
- **🎨 CSS** shows its styles when the example has them.
- **⚙️ JS** shows its JavaScript when the example has it.
- **👁️ Preview** runs the example in an isolated, sandboxed frame.
- **📝 Notes** gives guidance specific to that example.

Link to an example's default tab with its anchor, or add a tab name after a
colon to open that tab directly—for example, `#example-simple_number:preview`
or `#example-simple_number:html`. The available suffixes are `html`, `css`,
`js`, `preview`, and `notes`.

### Preview and the JSON playground

Use **👁️ Preview** to edit fields and interact with the form. The **📋 Show
playground editor** checkbox shows or hides a JSON editor alongside the form.

The playground controls operate on the form data:

- <code>⬇️ Export</code> copies the current form data into the JSON editor.
- <code>⬆️ Import</code> applies the JSON editor's value to the form.
- <code>♻️ Reset</code> restores the form's initial data and clears the JSON editor.
- <code>❌ Clear</code> empties the form.

### Editing an example

Choose **✏️ Edit** to turn the available source tabs into syntax-highlighted
code editors. They start with the example's original source. Changes affect
only this preview; choose **▶️ Run** to render them. Leaving Edit mode discards
those changes and restores the original source.

{: .hint}
> The JSON playground editor is itself a SmarkForm field. It sits in a larger
> form with the example as a subform; that outer form is omitted from the source
> shown by default so the focus stays on the example. To inspect the full source
> and see how the editor uses SmarkForm, choose **✏️ Edit** and check
> **📋 Include playground editor**. Some examples disable the editor controls
> when they would conflict with the example's own behavior.

## Try a complete form

This event plan includes basic fields and a guest list. Each guest is a nested
form with a name, email address, and meal choice. The initial values are sample
data; change them freely.

{% raw %}<!-- guided_form_html {{{ -->{% endraw %}
{% capture guided_form_html -%}
<div id="myForm$$">
  <div class="event-plan">
    <h3>Community Picnic</h3>
    <div class="event-fields">
      <label>Event name <input data-smark type="text" name="title"></label>
      <label>Date <input data-smark type="date" name="date"></label>
      <label>Location <input data-smark type="text" name="location"></label>
    </div>
    <fieldset>
      <legend>Guests</legend>
      <ul data-smark='{"type":"list","name":"guests","of":"form","min_items":1,"max_items":6}'>
        <li>
          <div class="guest-card">
            <label>Name <input data-smark type="text" name="name" placeholder="Guest name"></label>
            <label>Email <input data-smark type="email" name="email" placeholder="name@example.com"></label>
            <label>Meal
              <select data-smark name="meal">
                <option value="Standard">Standard</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
              </select>
            </label>
            <button data-smark='{"action":"removeItem","failback":"clear"}' type="button" title="Remove guest">Remove</button>
          </div>
        </li>
      </ul>
      <button data-smark='{"action":"addItem","context":"guests"}' type="button">➕ Add guest</button>
    </fieldset>
  </div>
</div>{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- guided_form_css {{{ -->{% endraw %}
{% capture guided_form_css -%}
{{""}}#myForm$$ .event-plan { max-width: 42rem; margin-inline: auto; }
{{""}}#myForm$$ .event-fields { display: grid; grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr)); gap: .75rem; }
{{""}}#myForm$$ label { display: grid; gap: .25rem; }
{{""}}#myForm$$ input, #myForm$$ select { box-sizing: border-box; width: 100%; }
{{""}}#myForm$$ ul { list-style: none; padding: 0; }
{{""}}#myForm$$ .guest-card { display: grid; grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); align-items: end; gap: .75rem; margin-block: .5rem; padding: .75rem; border: 1px solid #ccc; border-radius: .5rem; }
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- guided_form_js {{{ -->{% endraw %}
{% capture guided_form_js -%}
// The fields and guest list are handled declaratively; this example needs no custom JavaScript.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- guided_form_notes {{{ -->{% endraw %}
{% capture guided_form_notes -%}
The guest list keeps one required row. Removing the last guest clears that row
instead of removing it. This tab can also include example-specific notes or
insights; some examples omit it when there is nothing extra to add.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- guided_form_demoValue {{{ -->{% endraw %}
{% capture guided_form_demoValue -%}
{
  "title": "Community Picnic",
  "date": "2026-06-20",
  "location": "Riverside Park",
  "guests": [
    {"name": "Alex Rivera", "email": "alex@example.com", "meal": "Vegetarian"},
    {"name": "Sam Chen", "email": "sam@example.com", "meal": "Standard"}
  ]
}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- guided_form_tests {{{ -->{% endraw %}
{% capture guided_form_tests -%}
export default async ({ expect, root, readField, writeField }) => {
    await expect(root).toBeVisible();
    await writeField('/', {
        title: 'Community Picnic',
        date: '2026-06-20',
        location: 'Riverside Park',
        guests: [
            {name: 'Alex Rivera', email: 'alex@example.com', meal: 'Vegetarian'},
            {name: 'Sam Chen', email: 'sam@example.com', meal: 'Standard'},
        ],
    });
    expect(await readField('/guests/0/name')).toBe('Alex Rivera');
    await root.getByRole('button', {name: '➕ Add guest'}).click();
    await root.locator('input[name="name"]').nth(2).fill('Jordan Lee');
    expect(await readField('/guests/2/name')).toBe('Jordan Lee');

    const removeGuest = root.locator('button[title="Remove guest"]');
    await removeGuest.first().click();
    await removeGuest.first().click();
    await removeGuest.first().click();
    expect(await root.locator('input[name="name"]').count()).toBe(1);
    await expect(root.locator('input[name="name"]')).toHaveValue('');
};
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="playground-guided-form"
    htmlSource=guided_form_html
    cssSource=guided_form_css
    jsSource=guided_form_js
    notes=guided_form_notes
    demoValue=guided_form_demoValue
    showEditor=true
    selected="preview"
    tests=guided_form_tests
%}

## Explore more examples

Try these examples to see how forms help with common tasks:

- [Organize a profile and skill list]({{ "/start_here/core_concepts" | relative_url }}#example-nested_forms:preview) — edit a profile while adding and removing skills.
- [Move students between school groups]({{ "/component_reference/list" | relative_url }}#example-deep_school_groups:preview) — keep each student's grades with them as you reorganize groups.
- [Set morning and afternoon times]({{ "/guides/mixin_types" | relative_url }}#example-mixin_nested_composition:preview) — enter independent time ranges for two periods.
- [Copy details between list entries]({{ "/guides/form_traversing" | relative_url }}#example-form_trav_copy_adjacent:preview) — copy values to a neighboring entry.
- [Add or remove items with one shortcut]({{ "/accessibility/hotkeys" | relative_url }}#example-hotkeys_context_sensitivity:preview) — use the same hotkey in whichever list is active.
- [Animate a task list]({{ "/guides/events" | relative_url }}#example-events-animated-tasks:preview) — see tasks animate as they are added or removed.
- [Prepare an uploaded image]({{ "/component_reference/image" | relative_url }}#example-image_resize_format:preview) — resize and convert an image before using it.

## How the editor is built

The interactive controls surround the form shown in the **HTML** tab; they are
not part of that example's source. This keeps the example focused on the form
itself while still providing a reusable way to inspect and change its data.

When enabled, the editor places the example inside a `demo` subform and adds a
JSON textarea beside it. **Export** and **Import** target only the demo form, so
the editor controls stay outside the data being edited. **Clear** clears the
demo form; **Reset** restores the root form's initial value and empties the JSON
textarea. The controls are ordinary SmarkForm components and triggers.

The Edit toolbar can include or omit this generated editor in the preview source.
This lets authors compare the compact form markup with the complete runnable
version without changing the documented form itself.
