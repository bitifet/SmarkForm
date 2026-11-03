---
title: "«list» Component Type"
layout: chapter
description: "Represent JSON arrays with SmarkForm lists, defining item templates, limits, drag behavior, and add/remove actions."
permalink: "/component_reference/list"
nav_order: 3
redirect_from:
  - "/component_types/type_list"
---


{% include links.md %}
{% include components/sampletabs_ctrl.md %}

{% raw %} <!-- capture generic_sample_css {{{ --> {% endraw %}
{% capture generic_sample_css -%}
/* Make disabled buttons more evident to the eye */
button:disabled {
    opacity: .5;
}{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {% include chaptertoc/type_list.html %}

</details>



Introduction
------------

The List component in SmarkForm allows you to dynamically manage a list of
items within your form.

👉 All lists direct children (before rendering) are considered *templates* with
different *roles*.

👉 Default role is "item", which is used as a template for each item in the
list. This template is mandatory.

👉 Other available roles are:

  * `empty_list`: Displayed when the list is empty (removed when items are added).
  * `header`: Persistent header element prepended once to the list. Can contain triggers but **not** SmarkForm fields.
  * `footer`: Persistent footer element appended once to the list. Can contain triggers but **not** SmarkForm fields.
  * `separator`: Template cloned between each pair of adjacent items (removed when only one item remains).
  * `last_separator`: Like `separator` but used only before the last item. Falls back to `separator` if not provided.
  * `placeholder`: Visual placeholder slot used only when `max_items` is set. One placeholder is shown for each slot not yet occupied by a real item.

### Empty and separator roles

Use `empty_list` to explain an empty collection and `separator` / `last_separator`
to format inline lists. The final separator is distinct only when at least three
items are present.

{% raw %}<!-- hotkeys_reveal_css {{{ -->{% endraw %}
{% capture hotkeys_reveal_css -%}
{{""}}#myForm$$ [data-hotkey] { position: relative; }
{{""}}#myForm$$ [data-hotkey]::after {
    content: "Ctrl+" attr(data-hotkey);
    position: absolute;
    top: -1.5em;
    left: 0;
    padding: 1px 4px;
    border-radius: 3px;
    background: #333;
    color: white;
    font-size: .7em;
    white-space: nowrap;
}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- schedule_list_html {{{ -->{% endraw %}
{% capture schedule_list -%}
<div id="myForm$$">
  <p class="schedule-controls">
    <button data-smark='{"action":"removeItem","context":"schedule","hotkey":"-"}' title="Remove interval" type="button">➖</button>
    <button data-smark='{"action":"addItem","context":"schedule","hotkey":"+"}' title="Add interval" type="button">➕</button>
    <strong data-smark="label">Schedule:</strong>
    <span data-smark='{"type":"list","name":"schedule","of":"form","min_items":0,"max_items":3,"export_empties":true}'>
      <span>
        <input class="small" data-smark type="time" name="start"> to
        <input class="small" data-smark type="time" name="end">
      </span>
      <span data-smark-role="empty_list">(Closed)</span>
      <span data-smark-role="separator">, </span>
      <span data-smark-role="last_separator"> and </span>
    </span>
  </p>
</div>{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- schedule_list_css {{{ -->{% endraw %}
{% capture schedule_list_css -%}
{{ hotkeys_reveal_css }}
{{""}}#myForm$$ .schedule-controls { display: flex; flex-wrap: wrap; align-items: center; gap: .35em; }
{{""}}#myForm$$ input.small { width: 7.5em; }
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- schedule_list_notes {{{ -->{% endraw %}
{% capture schedule_list_notes -%}
👉 **Three template roles.** `empty_list` shows **(Closed)** when there are no
intervals. The first gap uses `separator` (a comma); the last uses
`last_separator` (“and”). Try removing all rows, then add them back.

👉 **Bounds.** The list permits zero through three intervals. SmarkForm disables
the Add and Remove triggers automatically at the corresponding limits.

👉 **Try it!** Remove an interval and watch the wording update. Hold **Ctrl** to
see the optional `+` / `-` hotkeys.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- schedule_list_demoValue {{{ -->{% endraw %}
{% capture schedule_list_demoValue -%}
{
  "schedule": [
    {"start":"09:00:00","end":"12:00:00"},
    {"start":"13:00:00","end":"15:00:00"},
    {"start":"15:30:00","end":"18:00:00"}
  ]
}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- schedule_list_js {{{ -->{% endraw %}
{% capture schedule_list_js -%}
// The list, role templates, limits, and trigger behavior are declarative.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- schedule_list_tests {{{ -->{% endraw %}
{% capture schedule_list_tests -%}
export default async ({ expect, root, readField, writeField }) => {
    await expect(root).toBeVisible();
    await writeField('schedule', [
        { start: '09:00:00', end: '12:00:00' },
        { start: '13:00:00', end: '15:00:00' },
        { start: '15:30:00', end: '18:00:00' },
    ]);
    expect(await readField('schedule')).toHaveLength(3);
    await expect(root.locator('[data-role="separator"]')).toHaveCount(1);
    await expect(root.locator('[data-role="last_separator"]')).toHaveCount(1);

    const add = root.locator('button[title="Add interval"]');
    const remove = root.locator('button[title="Remove interval"]');
    await expect(add).toBeDisabled();
    await remove.click();
    await expect(add).toBeEnabled();
    await add.click();
    await expect(add).toBeDisabled();

    await remove.click();
    await remove.click();
    await remove.click();
    await expect(remove).toBeDisabled();
    await expect(root.locator('[data-role="empty_list"]')).toBeVisible();
    expect(await readField('schedule')).toEqual([]);
};
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="schedule_list"
    htmlSource=schedule_list
    cssSource=schedule_list_css
    jsSource=schedule_list_js
    notes=schedule_list_notes
    demoValue=schedule_list_demoValue
    showEditor=true
    selected="preview"
    tests=schedule_list_tests
%}

👉 Likewise [forms]({{ "component_reference/form" | relative_url }}), *list*
inputs can be created over any HTML tag <a aria-hidden="true" href="#example-simple_list" style="cursor:pointer" title="Search for «☛ 1» in the code comments">(☛ 1)</a>  **except for actual HTML form
field elements** (`<input>`, `<textarea>`, `<select>`, `<button>`...).


### List items

👉 Lists can contain a variable number of unnamed inputs (list items) of a given
type.

👉 However, in its html source, **lists must only contain templates of supported roles as direct
children** <a aria-hidden="true" href="#example-simple_list" style="cursor:pointer" title ="Search for «☛ 2» in the code comments">(☛ 2)</a>, being the "item" role required and the rest optional.

👉 The user will (or won't) be able to, at its own discretion (and according
certain configurable rules), add or remove items to the list.

👉 Every time a new item is added to the list, **its item template is
automatically rendered as a *SmarkForm* field** (no matter if we explicitly
specified the *data-smark* attribute or not).

👉 If *data-smark* attribute is not provided (or it does not specify the
*type* property), the type "form" is automatically taken by default <a aria-hidden="true" href="#example-simple_list" style="cursor:pointer" title ="Search for «☛ 3» in the code comments">(☛ 3)</a>.

**Example:**

{% raw %} <!-- capture simple_list_example {{{ --> {% endraw %}
{% capture simple_list_example -%}
<div id="myForm$$">
  <section data-smark='{"type":"list","name":"users"}'><!-- ☛ 1 -->
    <fieldset style="text-align:right"><!-- ☛ 2, 3, 6 -->
      <p><label data-smark>User name:</label><input name='name' type='text' data-smark/></p>
      <p><label data-smark>Phone number:</label><input name='phone' type='tel' data-smark/></p>
      <p><label data-smark>Email:</label><input name='email' type='text' data-smark/></p>
      <button data-smark-action="removeItem" title='Remove User'>➖</button>
    </fieldset>
  </section>
  <button data-smark='{"action":"addItem","context":"users"}' title='Add User'>➕</button>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture simple_list_example_notes {{{ --> {% endraw %}
{% capture simple_list_example_notes -%}
👉 With *export_empties* option set to false (default), lists won't export empty
   items.

👉 ...unless there are too few non-empty items to satisfy `min_items`, in which
    case enough empty items are exported to meet that minimum.
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
    "users": [
        {
            "name": "Alice Johnson",
            "phone": "+1 555 234 5678",
            "email": "alice.j@example.com"
        },
        {
            "name": "Bob Smith",
            "phone": "+1 555 876 4321",
            "email": "bob.smith@example.com"
        }
    ]
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="simple_list"
    htmlSource=simple_list_example
    cssSource=generic_sample_css
    notes=simple_list_example_notes
    demoValue=demoValue
    showEditor=true
    tests=false
%}


### Scalar item types

👉 Other field types can be used too as *item template*
<a aria-hidden="true" href="#example-scalar_list" style="cursor:pointer" title ="Search for «☛ 4» in the code comments">(☛ 4)</a>.

Scalar fields are useful when each item is one value. To put row-specific
labels and triggers beside a scalar value, wrap its native input in a
[singleton]({{ "/guides/the_singleton_pattern" | relative_url }}).

The following scalar-list example places Add and Remove buttons outside the
list; without a row target, `removeItem` uses its default target (the last item).


**Example:**

{% raw %} <!-- capture scalar_list_example {{{ --> {% endraw %}
{% capture scalar_list_example -%}
<div id="myForm$$">
  <section style="display:grid" data-smark='{"type":"list","name":"phones"}'>
    <input placeholder='Phone number' type='tel'/><!-- ☛ 4, 6 -->
  </section>
  <button data-smark='{"action":"addItem","context":"phones"}' title='Add Phone'>➕</button>
  <button data-smark='{"action":"removeItem","context":"phones"}' title='Remove Phone'>➖</button> <!-- ☛ 5 -->
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
    "phones": [
        "+1 555 100 2000",
        "+1 555 200 3000"
    ]
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="scalar_list"
    htmlSource=scalar_list_example
    cssSource=generic_sample_css
    demoValue=demoValue
    showEditor=true
    tests=false
%}

{: .hint}
> The scalar item template has no `name`; SmarkForm assigns each item its
> position-based path as items are added, moved, or removed.

Without a target, `removeItem` defaults to the last item. A singleton item can
contain its own remove trigger so each row can target itself, as shown below.


### Applying the singleton pattern


Thankfully, all *Scalar field types* implement the
[Singleton Pattern]({{ "/guides/the_singleton_pattern" | relative_url }})
so that we can use any other html tag in place and just put the form field tag
inside.

**Example:**

{% raw %} <!-- capture singleton_list_example {{{ --> {% endraw %}
{% capture singleton_list_example -%}
<div id="myForm$$">
  <ul data-smark='{"name": "phones", "of": "input", "max_items": 3}'>
    <li>
      <input placeholder='Phone Number' type="tel" data-smark>
      <button data-smark-action="removeItem" title='Remove Phone'>➖</button>
    </li>
  </ul>
  <button data-smark='{"action":"addItem","context":"phones"}' title='Add Phone'>➕</button>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
    "phones": [
        "+1 555 100 2000",
        "+1 555 200 3000"
    ]
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="singleton_list"
    htmlSource=singleton_list_example
    cssSource=generic_sample_css
    demoValue=demoValue
    showEditor=true
    tests=false
%}


{: .info}
> In this example we have omitted the `type: "list"` bit and still works because
> *SmarkForm* automatically inferes the type from the HTML tag.
> 
> {: .warning}
> > This is handy for fast developping but it is **not a recommended practice**
> > since our designer may decide to change the tag for the template and different
> > type could be infered.


### Nesting lists

Since they're just smarkform fields, *lists* can be nested as needed.

Now we are prepared to extend our initial *Users list* example by providding,
say, up to three phone numbers and up to three emails.


**Example:**

{% raw %} <!-- capture nesting_list_example {{{ --> {% endraw %}
{% capture nesting_list_example -%}
<div id="myForm$$">
  <section data-smark='{"type":"list","name":"users"}'>
    <fieldset>
      <legend>User</legend>
      <button data-smark-action="removeItem" title='Remove User'>➖</button>
      <input name='name' placeholder='User name' type='text' data-smark/>
      <fieldset>
        <legend>
          <span
          data-smark='{"action":"addItem","context":"phones"}'
          title='Add Phone'
          style="background: lightgray; padding:.3em; border-radius:3px; margin: .4em"
          >➕</span>
        Phone Numbers
      </legend>
      <ul data-smark='{"type": "list", "name": "phones", "of": "input", "max_items": 3}'>
        <li>
          <input type="tel" data-smark>
          <button data-smark-action="removeItem" title='Remove Phone'>➖</button>
        </li>
      </ul>
    </fieldset>
  </fieldset>
  </section>
  <button data-smark='{"action":"addItem","context":"users"}' title='Add User'>➕ Add user</button>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
    "users": [
        {
            "name": "Alice Johnson",
            "phones": [
                "+1 555 234 5678",
                "+1 555 876 4321"
            ]
        }
    ]
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="nesting_list"
    htmlSource=nesting_list_example
    minHeight=45
    cssSource=generic_sample_css
    demoValue=demoValue
    showEditor=true
    tests=false
%}

{: .hint}
> As you can see here, phones and emails lists share almost the same layout.
> 
> With **SmarkForm native mixins** you can define this pattern once and reuse
> it everywhere.  The
> [Mixin Types → Labelled list of inputs]({{ "/guides/mixin_types" | relative_url }}#labelled-list-of-inputs-inputlist)
> example shows a ready-to-use `#inputlist` template — one `<template>` element
> and two lines per usage site instead of repeating the full list markup.



#### Deep nested forms and cross-list moves

This example combines groups, student forms, a nested grades form, and scalar
score lists. Drag a student to another group; its grades move with it.

{% raw %}<!-- deep_school_groups_html {{{ -->{% endraw %}
{% capture deep_school_groups_html -%}
<div id="myForm$$" class="deep-school">
  <p>
    <label data-smark>School:</label>
    <input data-smark name="school" placeholder="School name">
  </p>
  <button data-smark='{"action":"addItem","context":"groups"}' type="button">Add group</button>
  <ul data-smark='{"type":"list","name":"groups","of":"form","sortable":true,"min_items":0}'>
    <li>
      <div class="group-row">
        <label data-smark-type="label" title="Drag to reorder groups">⠿</label>
        <input data-smark name="name" placeholder="Group name">
        <button data-smark-action="removeItem" type="button" title="Remove group">Remove</button>
      </div>
      <button data-smark='{"action":"addItem","context":"students"}' type="button">Add student</button>
      <ul data-smark='{"type":"list","name":"students","of":"form","sortable":true,"moving_depth":2,"min_items":0}'>
        <li>
          <div class="student-row">
            <label data-smark-type="label" title="Drag to reorder or move students">⠿</label>
            <input data-smark name="name" placeholder="Student name">
            <button data-smark-action="removeItem" type="button" title="Remove student">Remove</button>
          </div>
          <fieldset data-smark='{"type":"form","name":"grades"}'>
            <legend>Scores (up to 3)</legend>
            <ul data-smark='{"type":"list","name":"scores","of":"number","min_items":0,"max_items":3}'>
              <li>
                <input data-smark type="number" min="0" max="10" step="0.1">
                <button data-smark-action="removeItem" type="button" title="Remove score">−</button>
              </li>
              <li data-smark-role="empty_list">No scores</li>
            </ul>
            <button data-smark='{"action":"addItem","context":"scores"}' type="button">Add score</button>
          </fieldset>
        </li>
        <li data-smark-role="empty_list">No students</li>
      </ul>
    </li>
    <li data-smark-role="empty_list">No groups</li>
  </ul>
</div>{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- deep_school_groups_css {{{ -->{% endraw %}
{% capture deep_school_groups_css -%}
{{""}}#myForm$$.deep-school { max-width: 560px; }
{{""}}#myForm$$.deep-school ul { list-style: none; padding-left: 1em; }
{{""}}#myForm$$.deep-school li { margin: .4em 0; }
{{""}}#myForm$$.deep-school .group-row,
{{""}}#myForm$$.deep-school .student-row { display: flex; align-items: center; gap: .4em; }
{{""}}#myForm$$.deep-school input { min-width: 0; }
{{""}}#myForm$$.deep-school fieldset { margin: .4em 0; }
{{""}}#myForm$$.deep-school [data-smark-label] { cursor: grab; }
{{""}}#myForm$$.deep-school [data-role="empty_list"] { color: #777; font-style: italic; }
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- deep_school_groups_notes {{{ -->{% endraw %}
{% capture deep_school_groups_notes -%}
👉 **Nested data.** The export is a `school` object containing a `groups` array;
each group contains a `students` array, and each student has a `grades.scores`
array.

👉 **Cross-list movement.** Drag a student handle between groups. Its score
array moves with the student; the sibling distance between the student lists is
2, so each list uses `moving_depth:2`.

👉 **Try it!** Move Bart to Class B, then add a score. The JSON editor shows the
updated nested value.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- deep_school_groups_demoValue {{{ -->{% endraw %}
{% capture deep_school_groups_demoValue -%}
{
  "school": "Springfield Elementary",
  "groups": [
    {"name":"Class A","students":[
      {"name":"Lisa Simpson","grades":{"scores":[9.5,8.0]}},
      {"name":"Bart Simpson","grades":{"scores":[4.0]}}
    ]},
    {"name":"Class B","students":[
      {"name":"Milhouse Van Houten","grades":{"scores":[6.0]}}
    ]}
  ]
}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- deep_school_groups_js {{{ -->{% endraw %}
{% capture deep_school_groups_js -%}
// Lists, nested forms, and cross-list behavior are declarative.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- deep_school_groups_tests {{{ -->{% endraw %}
{% capture deep_school_groups_tests -%}
export default async ({ page, expect, root, readField, writeField }) => {
    await expect(root).toBeVisible();
    await writeField('/', {
        school: 'Springfield Elementary',
        groups: [
            {name: 'Class A', students: [
                {name: 'Lisa Simpson', grades: {scores: [9.5, 8.0]}},
                {name: 'Bart Simpson', grades: {scores: [4.0]}},
            ]},
            {name: 'Class B', students: [
                {name: 'Milhouse Van Houten', grades: {scores: [6.0]}},
            ]},
        ],
    });

    const before = await readField('/');
    expect(before.groups[0].students[1].grades.scores).toEqual([4]);
    await page.evaluate(async () => {
        const source = myForm.find('/groups/0/students');
        const target = myForm.find('/groups/1/students');
        await source.move({
            from: source.children[1],
            target_list: target,
            position: 'after',
        });
    });

    let after = await readField('/');
    expect(after.groups[0].students.map(item => item.name)).toEqual(['Lisa Simpson']);
    expect(after.groups[1].students.map(item => item.name)).toEqual(['Milhouse Van Houten', 'Bart Simpson']);
    expect(after.groups[1].students[1].grades.scores).toEqual([4]);

    await page.evaluate(async () => {
        await myForm.find('/groups/1/students/1/grades/scores').addItem(
            9.0, { multiple: false, silent: true }
        );
    });
    after = await readField('/');
    expect(after.groups[1].students[1].grades.scores).toEqual([4, 9]);
};
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="deep_school_groups"
    htmlSource=deep_school_groups_html
    cssSource=deep_school_groups_css
    jsSource=deep_school_groups_js
    notes=deep_school_groups_notes
    demoValue=deep_school_groups_demoValue
    showEditor=true
    selected="preview"
    tests=deep_school_groups_tests
    minHeight=45
%}

For more information on using the List component and its available methods,
please refer to the [API Reference](#api-reference).


API Reference
-------------

### Options

#### value

Sets the initial default items for the list. These defaults are restored when `reset()` is called and are updated by `import()` (unless `set_default: false` is passed).

  * **Type:** Array
  * **Default value:** `[]`

> See: [Setting defaults via `value`]({{ "/guides/data_import_and_export" | relative_url }}#setting-defaults-via-value) for details on how defaults work.

#### min_items

Establishes the minimum number of items allowed.

  * **Type:** Number
  * **Default value:** 1
  * **Minimum value:** 0


#### max_items

Establishes the maximum number of items allowed.

  * **Type:** Number
  * **Default value:** Infinity
  * **Minimum value:** `min_items`

{: .info }
> Trigger buttons targeting the list (e.g. `addItem` / `removeItem`) are
> **automatically disabled** when the list reaches its `min_items` or
> `max_items` boundary — the add button greys out at `max_items`, the
> remove button greys out at `min_items`. This is handled by SmarkForm
> with no additional code required.

#### sortable

Controls wether the list can be user sorted by dragging and dropping list items.

  * **Type:** Boolean
  * **Default value:** false

When `sortable` is `true` without setting [`moving_depth`](#moving_depth-cross-list-drag-scope),
only same-list reordering is allowed.  Cross-list drag requires `moving_depth`
on at least one of the lists involved.

Sorting relies on the browser's native HTML drag-and-drop API.  Each list item
becomes a drag source (or exposes drag handles — see below), and the list
container is the drop target.

**Label-based drag handles**

When a list item contains one or more *SmarkForm label components* (any element
rendered with `data-smark` and resolved as type `label` — including native
`<label>`, `<legend>`, or any other tag with `data-smark-type="label"`),
SmarkForm automatically designates those labels as the drag handles:

- The item root node is made **non-draggable** so that mouse gestures inside
  input fields or textareas work normally (text selection is restored).
- The label nodes are made **draggable**, and `cursor: grab` should be applied
  to them via CSS (SmarkForm adds the `data-smark-label` attribute to every
  rendered label, so you can use the `[data-smark-label]` selector).

If no label components are found inside a list item, SmarkForm falls back to the
original behaviour: the entire item root is draggable (backward compatible).

{: .hint}
> **Recommended layout for sortable lists with inputs:** Add a `<label
> data-smark>` (or another label component) inside each list item as a drag
> handle.  A small icon — emoji, an inner `<span>`, or an `<img>` — makes an
> effective visual affordance without requiring extra markup.
>
> ```html
> <li>
>   <label data-smark title="Drag to reorder">☰</label>
>   <input data-smark name="value" placeholder="…">
>   <button data-smark-action="removeItem">✕</button>
> </li>
> ```
>
> SmarkForm label components are **non-selectable by default** (`user-select:
> none`), which is exactly the right behaviour for a drag handle.  If you need
> selectable label text separately, add a second label component dedicated to
> the handle.

{: .hint}
> **Scalar-only list items with no labels** (i.e. items that consist of a
> single input field and nothing else) fall back to the whole-item-draggable
> mode.  The most advisable way to lay out single-field sortable lists is to
> use the *singleton* pattern, which wraps the field in a richer item template
> that can include a label handle.

{: .hint}
> Native HTML drag-and-drop support varies across touch browsers and devices.
> Test target platforms if touch reordering is required.
>
> A polyfill can emulate the interaction; one option is the
> [DragDropTouch library](https://github.com/drag-drop-touch-js/dragdroptouch):


#### moving_depth (Cross-List Drag scope)

Controls cross-list drag-and-drop by enforcing a maximum *sibling distance*
between source and destination lists.

  * **Type:** Number \| true \| false
  * **Default value:** 0 (disabled)

When `moving_depth` is set to a positive number or `true` on a list, its items
become draggable even if `sortable` is `false`. However, same-list reordering
is only allowed when `sortable` is enabled.

**Sibling distance** is the number of nesting levels from the first divergent
list-item ancestor between two lists.  For example, in a `departments →
employees` nested structure, two employees from different departments have a
sibling distance of 2 (department item → employees → employee).  Items within
the same employees list have distance 0.

A cross-list move is only allowed when the sibling distance between the source
and destination list is **less than or equal to** `moving_depth` on **both**
lists.  A value of `true` grants unlimited reach.

{: .info}
> **Sortable vs moving_depth**
>
> | `sortable` | `moving_depth` | Behaviour |
> |---|---|---|
> | `false` (default) | `0` (default) | Static list — no drag at all |
> | `true` | `0` (default) | Same-list reorder only (legacy) |
> | `false` | `1+` or `true` | Items draggable; same-list drops ignored; cross-list allowed up to distance limit |
> | `true` | `1+` or `true` | Same-list reorder AND cross-list up to distance limit |

**Programmatic moves**

You can still trigger a cross-list move programmatically via `move()` by
passing a `target_list` option pointing to the destination list instance.  The
same distance guard applies:

```js
await sourceList.move({
    from: srcItem,          // component to move
    to: dstItem,            // component in the target list (position reference)
    target_list: destList,   // the destination list instance
    position: "before",     // or "after" (default)
});
```

**Example — Cross-list drag between nested lists:**

In this example the outer `departments` list has `sortable: true` (same-level
reorder only), while each inner `employees` list has both `sortable: true` and
`moving_depth: 2`.  This allows employees to be dragged between
departments — the sibling distance between two employee lists is 2 (department
item → employees → employee) — while still permitting same-list reordering.

{% raw %} <!-- capture cross_list_drag_example {{{ --> {% endraw %}
{% capture cross_list_drag_example -%}
<div id="myForm$$">
  <div class="cdd">
    <ul data-smark='{"type":"list","name":"departments","sortable":true,"min_items":1}'>
      <li>
        <div class="cdd-dept">
          <div class="cdd-dept-head">
            <span data-smark-type="label" class="cdd-handle">
              <span data-smark-action="position">N</span> ⠿
            </span>
            <input name='name' placeholder='Dept. name' type='text' data-smark/>
            <button data-smark-action="removeItem" title='Remove department'>➖</button>
          </div>
          <div class="cdd-employees">
            <ul data-smark='{"type":"list","name":"employees","sortable":true,"moving_depth":2,"min_items":0}'>
              <li data-smark-role="empty_list" class="cdd-empty">No employees yet</li>
              <li>
                <label data-smark title="Drag to reorder or move between departments">⠿</label>
                <input name='value' placeholder='Employee name' type='text' data-smark>
                <button data-smark-action="removeItem" title='Remove employee'>➖</button>
              </li>
            </ul>
            <button data-smark='{"action":"addItem","context":"employees"}' title='Add employee'>➕ Add Employee</button>
          </div>
        </div>
      </li>
    </ul>
    <button data-smark='{"action":"addItem","context":"departments"}' title='Add department'>➕ Add Department</button>
  </div>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture cross_list_drag_css {{{ --> {% endraw %}
{% capture cross_list_drag_css -%}
{{""}}#myForm$$ .cdd { max-width: 500px; font-size: 0.95em; }
{{""}}#myForm$$ .cdd ul { list-style: none; padding: 0; margin: 0; }
{{""}}#myForm$$ .cdd-dept {
    border: 1px solid #ddd; border-radius: 6px;
    margin: 0.4em 0; padding: 0;
    background: rgba(165, 165, 165, .25);
}
{{""}}#myForm$$ .cdd-dept-head {
    display: flex; align-items: center; gap: 0.4em;
    padding: 0.35em 0.5em;
    border-bottom: 1px solid #eee;
    background: rgba(168, 168, 168, .25); border-radius: 6px 6px 0 0;
}
{{""}}#myForm$$ .cdd-handle { cursor: grab; color: #aaa; font-size: 1.1em; user-select: none; }
{{""}}#myForm$$ .cdd-dept-head input[type="text"] {
    flex: 1; padding: 0.25em 0.4em;
    border: 1px solid #ccc; border-radius: 4px;
}
{{""}}#myForm$$ .cdd-employees {
    padding: 0.4em 0.5em 0.3em 1.8em;
    display: flex; flex-direction: column; gap: 0.25em;
}
{{""}}#myForm$$ .cdd-employees ul li {
    display: flex; align-items: center; gap: 0.4em; padding: 0.1em 0;
}
{{""}}#myForm$$ .cdd-employees ul li label { cursor: grab; color: #aaa; user-select: none; }
{{""}}#myForm$$ .cdd-employees ul li input[type="text"] {
    flex: 1; padding: 0.2em 0.4em;
    border: 1px solid #ccc; border-radius: 4px;
}
{{""}}#myForm$$ .cdd-employees ul li.cdd-empty { display: block; font-style: italic; color: #aaa; padding: 0.3em 0; }
{{""}}#myForm$$ .cdd button {
    padding: 0.15em 0.6em; border: 1px solid #ccc; border-radius: 4px;
    background: #fff; cursor: pointer; line-height: 1.5;
}
{{""}}#myForm$$ .cdd button:disabled { opacity: 0.4; }{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture cross_list_drag_demoValue {{{ --> {% endraw %}
{% capture cross_list_drag_demoValue -%}
{
    "departments": [
        {
            "name": "Engineering",
            "employees": [
                {"value": "Alice Johnson"},
                {"value": "Bob Smith"}
            ]
        },
        {
            "name": "Design",
            "employees": [
                {"value": "Carol White"},
                {"value": "Dave Brown"}
            ]
        },
        {
            "name": "Marketing",
            "employees": []
        }
    ]
}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture cross_list_drag_tests {{{ --> {% endraw %}
{% capture cross_list_drag_tests -%}
export default async ({ page, expect, id, root, readField, writeField }) => {
    await expect(root).toBeVisible();

    // Import demo data to have a known starting state
    await page.evaluate(async () => {
        await myForm.import({
            departments: [
                {name: "Engineering", employees: [{value: "Alice Johnson"}, {value: "Bob Smith"}]},
                {name: "Design",      employees: [{value: "Carol White"},  {value: "Dave Brown"}]},
                {name: "Marketing",   employees: []},
            ],
        });
    });

    // Cross-list move: "Alice Johnson" (Engineering[0]) → before "Carol White" (Design[0])
    await page.evaluate(async () => {
        const engEmps = myForm.find('/departments/0/employees');
        const desEmps = myForm.find('/departments/1/employees');
        await engEmps.move({
            from: engEmps.children[0],  // Alice Johnson
            to: desEmps.children[0],    // Carol White
            target_list: desEmps,
            position: 'before',
        });
    });

    expect(
        await readField('departments'),
        'Alice Johnson moved from Engineering to Design (before Carol White)'
    ).toEqual([
        {name: 'Engineering', employees: [{value: 'Bob Smith'}]},
        {name: 'Design', employees: [{value: 'Alice Johnson'}, {value: 'Carol White'}, {value: 'Dave Brown'}]},
        {name: 'Marketing', employees: []},
    ]);

    // Cross-list move without `to`: "Dave Brown" (Design[2]) → end of Engineering
    await page.evaluate(async () => {
        const engEmps = myForm.find('/departments/0/employees');
        const desEmps = myForm.find('/departments/1/employees');
        await desEmps.move({
            from: desEmps.children[2],  // Dave Brown
            target_list: engEmps,
            position: 'after',
        });
    });

    expect(
        await readField('departments'),
        'Dave Brown moved from Design to Engineering (append)'
    ).toEqual([
        {name: 'Engineering', employees: [{value: 'Bob Smith'}, {value: 'Dave Brown'}]},
        {name: 'Design', employees: [{value: 'Alice Johnson'}, {value: 'Carol White'}]},
        {name: 'Marketing', employees: []},
    ]);
};
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="cross_list_drag"
    htmlSource=cross_list_drag_example
    minHeight=60
    cssSource=cross_list_drag_css
    demoValue=cross_list_drag_demoValue
    showEditor=true
    tests=cross_list_drag_tests
%}


#### export_empties

Controls whether unfilled list items should be exported or not. This allows for
neater arrays when the user adds more items to the list than are used.

  * **Type:** Boolean
  * **Default value:** false

When `false`, the list asks each item type whether it is empty before exporting
it. The generic `input` type currently treats checkboxes as empty even when
checked, so a checkbox-only row may be omitted; see the
[Input reference]({{ "/component_reference/input" | relative_url }}). No focused
automated test currently covers checked checkboxes in this path.


#### of

Specify a field type for list items. Handy to avoid specifying a whole
*data-smark* attribute in the template to just specify the field type when
needed.

  * **Type:** string
  * **Default value:** undefined

For file-like item types (`file`, `image`, `video`, `audio`), `addItem()` can
open a batch picker and operating-system file drops append new rows. A drop on
an existing media row does not replace that row's value. Set list-level
`file_drop:false` to disable drop-to-append. See the linked media references
for type-specific filtering and acquisition behavior.


### Actions

{{ site.data.definitions.actions.intro }}

The `list` component type supports the following actions:

For full action context/target resolution, see the
[Trigger reference]({{ "/component_reference/trigger" | relative_url }}) and
[Form Traversing]({{ "/guides/form_traversing" | relative_url }}).


#### (Async) export (Action)

##### Options (export)

  * **action:** (= "export")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * {{ site.data.definitions.actions.options.target_export }}


#### (Async) import (Action)

##### Options (import)

  * **action:** (= "import")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * {{ site.data.definitions.actions.options.target_import }}
  * **data:** (array / any¹)
  * **focus:** (boolean, default true)
  * **set_default:** (boolean, default `true`) — When `true` (the default), the imported data becomes the new default restored by `reset()`. Pass `false` to import data without changing the reset target.


{: .hint}
> ¹) If non array value is provided as *data*, then it is automatically wrapped
> as such as a failback.

#### (Async) clear (Action)

`clear` imports the empty array without changing the list's stored default. It
removes rows above `min_items`. Any rows retained to satisfy the minimum are
reset to their own defaults. With `min_items:0`, the list becomes empty.

**Example use case:** A "Clear All" button that removes all items from the list.

##### Options (clear)

  * **action:** (= "clear")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}


#### (Async) reset (Action)

Reverts the list to its default structure. The default is initially set by the
`value` option and is updated by `import()` with `set_default:true` (the
default). If the default contains fewer rows than `min_items`, the remaining
minimum rows are reset to their own defaults.

**Example use case:** A "Reset" button that restores the list to its last loaded state.

##### Options (reset)

  * **action:** (= "reset")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}


#### (Async) addItem (Action)

##### Options (addItem)

  * **action:** (= "addItem")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * **target:** Path to the item used as the insertion reference. It resolves
    from the effective context; if omitted, the new item is appended.
  * **position:** (= "after" (default) / "before") Determines where the new item will be inserted in relation to the target.
  * **source:** (Path★  (absolute or relative **to the newly created item**).
    If provided, the matched component value (result of its *export* action)
    will be imported to the new item.
  * **autoscroll:**,   = "elegant" / "self" / "parent" / *falsy*
  * **failback:** (= "none" / "throw" (default)) Avoid emitting the "LIST_MAX_ITEMS_REACHED" event when the maximum number of items is reached.

#### (Async) removeItem (Action)



##### Options (removeItem)

  * **action:** (= "removeItem")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * **target:** Path to the item to remove, resolved from the effective context.
    If omitted, the last item is removed.
  * **autoscroll:**  (= "elegant" / "self" / "parent" / *falsy*)
  * **preserve_non_empty:** (boolean)
  * **failback:** (= "none" / "clear" / "throw" )


#### count (Action)

##### Options (count)

  * **action:**: (= "count")
  * **delta:**: (default 0)


#### position (Action)

##### Options (position)

  * **action:**: (= "position")
  * **offset:**: (default 1)
