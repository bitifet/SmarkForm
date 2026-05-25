---
title: «list» Component Type
layout: chapter
permalink: /component_types/type_list
nav_order: 2

---

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

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Introduction](#introduction)
    * [List items](#list-items)
    * [Scalar item types](#scalar-item-types)
    * [Applying the singleton pattern](#applying-the-singleton-pattern)
    * [Nesting lists](#nesting-lists)
* [API Reference](#api-reference)
    * [Options](#options)
        * [min_items](#min_items)
        * [max_items](#max_items)
        * [sortable](#sortable)
        * [movingDepth (Cross-List Drag scope)](#movingdepth-cross-list-drag-scope)
        * [exportEmpties](#exportempties)
        * [of](#of)
    * [Actions](#actions)
        * [(Async) export (Action)](#async-export-action)
            * [Options (export)](#options-export)
        * [(Async) import (Action)](#async-import-action)
            * [Options (import)](#options-import)
        * [(Async) clear (Action)](#async-clear-action)
            * [Options (clear)](#options-clear)
        * [(Async) reset (Action)](#async-reset-action)
            * [Options (reset)](#options-reset)
        * [(Async) addItem (Action)](#async-additem-action)
            * [Options (addItem)](#options-additem)
        * [(Async) removeItem (Action)](#async-removeitem-action)
            * [Options (removeItem)](#options-removeitem)
        * [count (Action)](#count-action)
            * [Options (count)](#options-count)
        * [position (Action)](#position-action)
            * [Options (position)](#options-position)

<!-- vim-markdown-toc -->
       " | markdownify }}

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

👉 Likewise [forms]({{ "component_types/type_form" | relative_url }}), *list*
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
      <button data-smark='{"action":"removeItem"}' title='Remove User'>➖</button>
    </fieldset>
  </section>
  <button data-smark='{"action":"addItem","context":"users"}' title='Add User'>➕</button>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture simple_list_example_notes {{{ --> {% endraw %}
{% capture simple_list_example_notes -%}
👉 With *exportEmpties* option set to false (default), lists won't export empty
   items.

👉 ...unless there is no enough non empty items to satisfy *minItems* option,
    in which case up tu *minItems* empty items will be exported.
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

👉 ...but, in the case of
([scalar field types]({{ "getting_started/core_component_types#scalar-field-types" | relative_url }}))
it may look like we are limited when it comes to inserting labels **and
triggers** in the item template and hence we can only remove last item every
time in the list.

This would force us to move the *Remove Item* button outside the list
<a aria-hidden="true" href="#example-scalar_list" style="cursor:pointer" title ="Search for «☛ 5» in the code comments">(☛ 5)</a>
like in the following example.


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
> Notice that in this example, likewise the *fieldset* in the former, the
> *input* tag has no "name" attribute
> <a aria-hidden="true" href="#example-scalar_list" style="cursor:pointer" title="Search for «☛ 6» in the code comments">(☛ 6)</a>.
> This is because it is a list item
> template and it's actual name attribute will be automatically set depending
> on its position in the array every time a new item is added, moved or
> removed.

👉 Now, when the user clicks the *Remove Item* button, it will default to the
last item of the list, **but we cannot ([yet](#applying-the-singleton-pattern))
cherry-pick which item we'd like to remove**.


### Applying the singleton pattern


Thankfully, all *Scalar field types* implement the
[Singleton Pattern]({{ "/getting_started/core_component_types#the-singleton-pattern" | relative_url }})
so that we can use any other html tag in place and just put the form field tag
inside.

**Example:**

{% raw %} <!-- capture singleton_list_example {{{ --> {% endraw %}
{% capture singleton_list_example -%}
<div id="myForm$$">
  <ul data-smark='{"name": "phones", "of": "input", "max_items": 3}'>
    <li>
      <input placeholder='Phone Number' type="tel" data-smark>
      <button data-smark='{"action":"removeItem"}' title='Remove Phone'>➖</button>
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
      <button data-smark='{"action":"removeItem"}' title='Remove User'>➖</button>
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
          <button data-smark='{"action":"removeItem"}' title='Remove Phone'>➖</button>
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
    height=45
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
> [Mixin Types → Labelled list of inputs]({{ "/advanced_concepts/mixin_types" | relative_url }}#labelled-list-of-inputs--inputlist)
> example shows a ready-to-use `#inputlist` template — one `<template>` element
> and two lines per usage site instead of repeating the full list markup.



For more information on using the List component and its available methods,
please refer to the [API Reference](#api-reference).


API Reference
-------------

### Options

#### min_items

Establishes the minimum number of items allowed.

  * **Type:** Number
  * **Default value:** 1
  * **Minimum value:** 0


#### max_items

Establishes the maximum number of items allowed.

  * **Type:** Number
  * **Default value:** Infinity
  * **Minimum value:** Infinity


#### sortable

Controls wether the list can be user sorted by dragging and dropping list items.

  * **Type:** Boolean
  * **Default value:** false

When `sortable` is `true` without setting [`movingDepth`](#movingdepth-cross-list-drag-scope),
only same-list reordering is allowed.  Cross-list drag requires `movingDepth`
on at least one of the lists involved.

Sorting relies on the browser's native HTML drag-and-drop API.  Each list item
becomes a drag source (or exposes drag handles — see below), and the list
container is the drop target.

**Label-based drag handles**

When a list item contains one or more *SmarkForm label components* (any element
rendered with `data-smark` and resolved as type `label` — including native
`<label>`, `<legend>`, or any other tag with `data-smark='{"type":"label"}'`),
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
>   <button data-smark='{"action":"removeItem"}'>✕</button>
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
> Drag and Drop events are not natively supported by touch devices.
>
> They can be emulated in serveral ways. A quite straighforward one is through the *dragdroptouch* library from Bernardo Castilho:
>
> 🔗 [https://github.com/drag-drop-touch-js/dragdroptouch](https://github.com/drag-drop-touch-js/dragdroptouch)


#### movingDepth (Cross-List Drag scope)

Controls cross-list drag-and-drop by enforcing a maximum *sibling distance*
between source and destination lists.

  * **Type:** Number | true | false
  * **Default value:** 0 (disabled)

When `movingDepth` is set to a positive number or `true` on a list, its items
become draggable even if `sortable` is `false`. However, same-list reordering
is only allowed when `sortable` is enabled.

**Sibling distance** is the number of nesting levels from the first divergent
list-item ancestor between two lists.  For example, in a `departments →
employees` nested structure, two employees from different departments have a
sibling distance of 2 (department item → employees → employee).  Items within
the same employees list have distance 0.

A cross-list move is only allowed when the sibling distance between the source
and destination list is **less than or equal to** `movingDepth` on **both**
lists.  A value of `true` grants unlimited reach.

{: .info}
> **Sortable vs movingDepth**
>
> | `sortable` | `movingDepth` | Behaviour |
> |---|---|---|
> | `false` (default) | `0` (default) | Static list — no drag at all |
> | `true` | `0` (default) | Same-list reorder only (legacy) |
> | `false` | `1+` or `true` | Items draggable; same-list drops ignored; cross-list allowed up to distance limit |
> | `true` | `1+` or `true` | Same-list reorder AND cross-list up to distance limit |

**Programmatic moves**

You can still trigger a cross-list move programmatically via `move()` by
passing a `targetList` option pointing to the destination list instance.  The
same distance guard applies:

```js
await sourceList.move({
    from: srcItem,          // component to move
    to: dstItem,            // component in the target list (position reference)
    targetList: destList,   // the destination list instance
    position: "before",     // or "after" (default)
});
```

**Example — Cross-list drag between nested lists:**

In this example the outer `departments` list has `sortable: true` (same-level
reorder only), while each inner `employees` list has both `sortable: true` and
`movingDepth: 2`.  This allows employees to be dragged between
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
            <span data-smark='{"type":"label"}' class="cdd-handle">
              <span data-smark='{"action":"position"}'>N</span> ⠿
            </span>
            <input name='name' placeholder='Dept. name' type='text' data-smark/>
            <button data-smark='{"action":"removeItem"}' title='Remove department'>➖</button>
          </div>
          <div class="cdd-employees">
            <ul data-smark='{"type":"list","name":"employees","sortable":true,"movingDepth":2,"min_items":0}'>
              <li data-smark='{"role":"empty_list"}' class="cdd-empty">No employees yet</li>
              <li>
                <label data-smark title="Drag to reorder or move between departments">⠿</label>
                <input name='value' placeholder='Employee name' type='text' data-smark>
                <button data-smark='{"action":"removeItem"}' title='Remove employee'>➖</button>
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
            targetList: desEmps,
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
            targetList: engEmps,
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
    height=60
    cssSource=cross_list_drag_css
    demoValue=cross_list_drag_demoValue
    showEditor=true
    tests=cross_list_drag_tests
%}


#### exportEmpties

Controls whether unfilled list items should be exported or not. This allows for
neater arrays when the user adds more items to the list than are used.

  * **Type:** Boolean
  * **Default value:** false


#### of

Specify a field type for list items. Handy to avoid specifying a whole
*data-smark* attribute in the template to just specify the field type when
needed.

  * **Type:** string
  * **Default value:** undefined


### Actions

{{ site.data.definitions.actions.intro }}

The `list` component type supports the following actions:


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
  * **setDefault:** (boolean, default `true`) — When `true` (the default), the imported data becomes the new default restored by `reset()`. Pass `false` to import data without changing the reset target.


{: .hint}
> ¹) If non array value is provided as *data*, then it is automatically wrapped
> as such as a failback.

#### (Async) clear (Action)

Clears the list to an empty array, removing all items regardless of any configured default values. Unlike `reset`, this action ignores any prepopulated default items that may have been set via the `value` option.

**Example use case:** A "Clear All" button that removes all items from the list.

##### Options (clear)

  * **action:** (= "clear")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}


#### (Async) reset (Action)

Reverts the list to its default structure. The default is initially set by the `value` option, and is updated every time `import()` is called with `setDefault: true` (the default). If no default has ever been set, the list reverts to an empty array (same as `clear`).

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
  * **target:** Path★  (absolute or relative to its *context*) to a component to be used as a base reference to calculate the position of the new item. If not provided, the last item in the list will be used.
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
  * **target:** Path★  (absolute or relative to its *context*) to the component to be removed. If not provided, the last item in the list will be used.
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

