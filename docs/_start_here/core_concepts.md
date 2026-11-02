---
title: "Core Concepts"
layout: chapter
description: "Understand how data-smark markup becomes a component tree and how forms, lists, and fields map to structured values."
permalink: "/start_here/core_concepts"
nav_order: 5
redirect_from:
  - "/getting_started/core_concepts"
---

{% include links.md %}
{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

SmarkForm reads marked-up HTML, builds a component tree, and imports or exports
structured JavaScript values. The tree follows SmarkForm components—not every
HTML wrapper used to arrange the page.

<details class="chaptertoc">
<summary><strong>📖 Table of Contents</strong></summary>

  {% include chaptertoc/core_concepts.html depth=3 %}

</details>

## From HTML to a component tree

The root node passed to `new SmarkForm(...)` becomes the root form. Marked
children become fields, nested forms, lists, labels, or triggers. Unmarked
layout elements do not add levels to the exported data.

The data model can be read as a tree:

- Root form — created from the DOM node passed to SmarkForm.
  - `profile` — a named form component whose value is an object.
    - `name` — a scalar field.
    - `contact` — a nested form object.
      - `email` — a scalar field.
  - `skills` — a list component whose value is an array.
    - Each item follows the list template and is typed here as `input`.

The matching value is:

```json
{
  "profile": {
    "name": "Ada Lovelace",
    "contact": { "email": "ada@example.com" }
  },
  "skills": ["mathematics", "computing"]
}
```

{% raw %}<!-- core_concepts_model_html {{{ -->{% endraw %}
{% capture core_concepts_model_html -%}
<div id="myForm$$">
  <fieldset data-smark='{"type":"form","name":"profile"}'>
    <p>
      <label data-smark>Name:</label>
      <input name="name" type="text" data-smark>
    </p>
    <fieldset data-smark='{"type":"form","name":"contact"}'>
      <legend>Contact</legend>
      <label data-smark>Email:</label>
      <input name="email" type="email" data-smark>
    </fieldset>
  </fieldset>
  <div>
    <strong>Skills</strong>
    <ul data-smark='{"type":"list","name":"skills","of":"input","min_items":0}'>
      <li><input type="text" data-smark></li>
    </ul>
  </div>
</div>{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- core_concepts_model_js {{{ -->{% endraw %}
{% capture core_concepts_model_js -%}
// The playground's Export control shows the component tree's current value.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- core_concepts_model_notes {{{ -->{% endraw %}
{% capture core_concepts_model_notes -%}
**Try it:** Change the profile fields or add/remove skills, then choose **Export**
to see how named forms and list items map into the object above.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- core_concepts_model_demoValue {{{ -->{% endraw %}
{% capture core_concepts_model_demoValue -%}
{
  "profile": {
    "name": "Ada Lovelace",
    "contact": { "email": "ada@example.com" }
  },
  "skills": ["mathematics", "computing"]
}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="components_paths"
    htmlSource=core_concepts_model_html
    jsSource=core_concepts_model_js
    notes=core_concepts_model_notes
    demoValue=core_concepts_model_demoValue
    showEditor=true
    tests=false
%}

For programmatic work, wait until rendering completes before looking up
components. A named subform can be found and exported like this:

```javascript
async function readContact(myForm) {
    await myForm.rendered;
    const contact = myForm.find("profile/contact");
    return await contact.export();
}
```

## Marking components with `data-smark` {#the-data-smark-attribute}

Use `data-smark` on the elements SmarkForm should manage. The root is implicit;
other elements without the marker remain ordinary HTML layout. Lists interpret
their child markup as item and optional role templates.

### Syntax {#syntax}

The attribute accepts three common forms:

```html
<!-- Infer a common type from the element and native attributes. -->
<input name="email" type="email" data-smark>

<!-- A string shorthand specifies only the SmarkForm type. -->
<input name="email" data-smark="input">

<!-- JSON options set or override component properties. -->
<input data-smark='{"type":"input","name":"email","placeholder":"you@example.com"}'>
```

A JSON value must be valid JSON, not a JavaScript object literal: use double
quotes for keys and strings, and do not include trailing commas.

### Inferred types and names {#required-and-inferred-properties}

SmarkForm infers common types from the element and its attributes—for example,
`<label>` becomes a label, `<textarea>` and `<select>` become `input` fields, and
`<input type="number">` becomes a number field. An `action` option identifies
a trigger. Use `type` when inference is unavailable or when you want to override
it.

A field's `name` option takes precedence over its HTML `name` attribute. Give
fields a useful name when their values should appear under a readable object
key. Labels and triggers are not named data fields; singleton inner fields are
intentionally unnamed. If neither name is supplied, SmarkForm assigns an
internal fallback name.

### Shorthand syntax and prefixed options {#shorthand-syntaxes}

A `data-smark` string such as `"list"` is a type shorthand. For common inferred
types, the attribute may be empty. A supported `data-smark-<option>` attribute
can also identify a component on its own:

```html
<ul data-smark-type="list" data-smark-name="items" data-smark-min_items="0">
  <li><input name="label" data-smark></li>
</ul>
```

The suffix maps literally to an option name: public option names use
`snake_case`, and SmarkForm does not convert kebab-case or camelCase. Values of
prefixed attributes start as strings; only documented common or
component-specific normalization is applied. Use JSON `data-smark` for objects,
arrays, or structured options without a documented attribute parser.

Action identifiers are values, not option names: for example,
`"action":"addItem"` keeps the documented `addItem` spelling.

When an option is specified in both JSON and a prefixed attribute, the prefixed
attribute wins. The effective order is defaults, JSON options, then prefixed
attributes. Event hooks and root constructor options are separate from the
serializable options written in `data-smark`.

### Component-specific options {#component-specific-options}

Options depend on the component type and, for triggers, on the action. See the
[Component Types Overview]({{ "/component_reference/overview" | relative_url }})
and individual type pages for supported options and defaults.

## Map forms, lists, and fields to values {#forms-lists-and-other-fields}

The examples below unpack the tree from the first example: fields provide
values, named forms group them into objects, and lists group items into arrays.

{% raw %} <!-- capture simple_form_example {{{ --> {% endraw %}
{% capture simple_form_example -%}
<div id="myForm$$">
  <p>
    <label data-smark>Name:</label>
    <input name='name' data-smark>
  </p>
  <p>
    <label data-smark>Surname:</label>
    <input name='surname' data-smark>
  </p>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture simple_form_example_notes {{{ --> {% endraw %}
{% capture simple_form_example_notes -%}
**Try it:** Change the name or surname in Preview, then choose **Export** to see
the object. Edit the JSON in the playground and choose **Import** to update the
fields.
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
    "name": "Maria",
    "surname": "Garc\u00eda"
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="simple_form"
    htmlSource=simple_form_example
    notes=simple_form_example_notes
    demoValue=demoValue
    showEditor=true
    tests=false
%}


### Fields

Fields support import and export. A form field—including the root—exports
an object; a list exports an array. Scalar fields provide their own value types.
Labels and triggers are components, but they do not add values to the data tree.

### Form nesting

The root is a form field, and a named child form groups its fields into a
nested object. Nest forms as needed to represent the data structure.


{% raw %} <!-- capture nested_forms_example {{{ --> {% endraw %}
{% capture nested_forms_example -%}
<div id="myForm$$">
  <b>User:</b>
  <p>
    <label data-smark>Id:</label>
    <input name='userId' value='0001' data-smark>
  </p>
  <fieldset data-smark='{"type":"form","name":"personal_data"}'>
    <legend>Personal Data</legend>
    <p>
      <label data-smark>Name:</label>
      <input name='name' value='John' data-smark>
    </p>
    <p>
      <label data-smark>Surname:</label>
      <input name='surname' value='Doe' data-smark>
    </p>
    <fieldset data-smark='{"type":"form","name":"contact"}'>
      <legend>Contact Data</legend>
      <p>
        <label data-smark>Phone:</label>
        <input name='phone' type='tel' value='555444999' data-smark>
      </p>
      <p>
        <label data-smark>eMail:</label>
        <input name='email' type='email' value='john@dohe.example.org' data-smark>
      </p>
    </fieldset>
  </fieldset>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture notes {{{ --> {% endraw %}
{% capture notes -%}
👉 This example comes with pre-filled values to make it more illustrative,
but feel free to change them if you like.

👉 We could have also added nested lists (to allow multiple phone numbers
and/or emails).
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% capture demoValue -%}
{
    "userId": "0042",
    "personal_data": {
        "name": "John",
        "surname": "Doe",
        "contact": {
            "phone": "+1 555 867 5309",
            "email": "john.doe@example.com"
        }
    }
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="nested_forms"
    htmlSource=nested_forms_example
    notes=notes
    selected="preview"
    demoValue=demoValue
    showEditor=true
    tests=false
%}



### Lists

Use a list component when a value is a variable-length array. Forms map to
objects; lists map to arrays. Nested forms and lists express common nested
object/array structures, while each scalar field type defines its own value
contract.


{% raw %} <!-- capture fixed_list_example {{{ --> {% endraw %}
{% capture fixed_list_example -%}
<div id="myForm$$">
  <b>Phones:</b>
  <ul data-smark='{"type":"list","name":"phones","of":"input","min_items":3}'>
    <li>
      <input data-smark type="tel" placeholder="Phone number" />
    </li>
  </ul>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture fixed_list_example_notes {{{ --> {% endraw %}
{% capture fixed_list_example_notes -%}
`min_items: 3` starts the list with three scalar items. Since this example has no
`max_items`, importing a longer array can add more. Set `min_items: 0` to allow
an empty list. The `of: "input"` option makes each item export a scalar value;
the List reference covers item templates and other `of` types.
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
    "phones": [
        "+1 555 234 5678",
        "+1 555 876 4321",
        "+1 555 100 2000"
    ]
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="fixed_list"
    htmlSource=fixed_list_example
    notes=fixed_list_example_notes
    demoValue=demoValue
    showEditor=true
    tests=false
%}


👉 In order to enable users to control the array's length, the *list* component
type offers the "addItem" and "removeItem" *actions*.

👉 By default, *lists* have at least one item and can grow to infinity. But
this can be changed through the *min_items* and *max_items* properties.

👉 They also can be sorted by the user (by setting the *sortable* property to *true*).

The following example uses *trigger* components to allow user to invoke those
actions:


{% raw %} <!-- capture pets_list_example {{{ --> {% endraw %}
{% capture pets_list_example -%}
<div id="myForm$$">
  <b>Pets:</b>
  <ul data-smark-type="list" data-smark-name="pets" data-smark-sortable="true" data-smark-min_items="0" data-smark-max_items="5" class="sortable">
    <li>
      <label data-smark title="Drag to reorder">☰</label>
      <select name='species' data-smark>
        <option value="cat">Cat</option>
        <option value="dog">Dog</option>
        <option value="hamster">Hamster</option>
        <option value="fish">Fish</option>
        <option value="bird">Bird</option>
        <option value="turtle">Turtle</option>
        <option value="other">Other</option>
      </select>
      <input name='name' placeholder="Name" data-smark>
      <button data-smark-action="removeItem" title="Remove Pet">❌</button>
    </li>
  </ul>
  <button data-smark='{"action":"addItem","context":"pets"}'>Add Pet</button>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture pets_list_example_css {{{ --> {% endraw %}
{% capture pets_list_example_css %}.sortable>* {
    cursor: default;
}
.sortable [data-smark-label] {
    cursor: grab;
}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture pets_list_example_notes {{{ --> {% endraw %}
{% capture pets_list_example_notes -%}
👉 You can rearrange list items by dragging the ☰ handle label. We set
   `sortable: true` and added a `<label data-smark>` as the drag handle so you
   can still **select text in the fields** without accidentally starting a drag.

👉 The CSS applies `cursor: grab` only to the label handle via the
   `[data-smark-label]` selector that SmarkForm adds automatically to
   rendered label components.

🚀 The list can also be matched directly with `[data-smark-sortable="true"]`,
   so the custom `.sortable` class is only needed for your own styling.
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
    "pets": [
        {
            "species": "cat",
            "name": "Whiskers"
        },
        {
            "species": "dog",
            "name": "Rex"
        }
    ]
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="pets_list"
    htmlSource=pets_list_example
    cssSource=pets_list_example_css
    notes=pets_list_example_notes
    demoValue=demoValue
    showEditor=true
    tests=false
%}

### Scalar field values

The component type determines the leaf value. Ordinary `input` fields and
`select` fields usually export strings; checkbox inputs export booleans, number
fields export numbers or `null`, and radio groups export the selected value or
`null`. Date and time components normalize their values to documented strings.
See [Value Coercion]({{ "/guides/value_coercion" | relative_url }}) and the
individual type references for details.


### Constraining lists {#constraining-lists}

Lists default to at least one item and have no upper limit. Set `min_items` and
`max_items` to allow an empty list or cap its length:

```html
<ul data-smark='{"type":"list","name":"pets","min_items":0,"max_items":5}'>
  <li><input name="name" data-smark></li>
</ul>
```

### Singletons {#singletons}

A singleton declares a scalar component type on a wrapper containing exactly
one unnamed inner field. The wrapper can also contain labels or triggers. This
is useful for list items that need their own action while still exporting a
scalar value rather than an object.

{% raw %} <!-- core_singleton_phones {{{ --> {% endraw %}
{% capture core_singleton_phones_html -%}
<div id="myForm$$">
  <div data-smark='{"type":"form","name":"personal_data"}'>
    <input name='name'  data-smark>
    <input name='surname' data-smark>
    <ul data-smark='{"type":"list","name":"phones"}'>
      <li data-smark='{"type":"input"}'>
        <input placeholder='Phone Number' type="tel" data-smark>
        <button data-smark='{"action":"removeItem"}'>❌</button>
      </li>
    </ul>
    <button data-smark='{"action":"addItem","context":"phones"}'>➕</button>
</div>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="core_singleton_phones"
    htmlSource=core_singleton_phones_html
    demoValue='{"personal_data":{"name":"Alice","surname":"Smith","phones":["555-1234","555-5678"]}}'
    tests=false
%}

{: .hint}
> This forced us to explicitly specify the *data-smark* property in the list
> item template. To avoid this we can use the "of" property of the list to
> specify the desired SmarkForm component type:
> 
> 
> ```html
> <ul data-smark='{"type":"list","name":"phones","of":"input"}'>
>   <li>
>     <input placeholder='Phone Number' type="text" data-smark>
>     <button data-smark-action="removeItem">❌</button>
>   </li>
> </ul>
> ```

## Actions, triggers, and component paths {#components-and-actions}

### Components {#components}

A component is a DOM element SmarkForm manages. Fields carry values; labels and
triggers support interaction without adding data fields. The root form is
implicit, while marked descendants declare the rest of the tree.

### Component types {#component-types}

A component's type determines how SmarkForm treats it. Common types include
`form`, `list`, `input`, `number`, `date`, `time`, `datetime-local`, `color`,
`radio`, and media fields. `<select>` is handled by the `input` type. Labels and
triggers are non-field types. See the [Component Types Overview]({{ "/component_reference/overview" | relative_url }})
and the individual type pages for details.

### Labels

Labels are non-field components that associate authored `<label>` elements
with fields. See the [Label reference]({{ "/component_reference/label" | relative_url }}).

<a id="trigger-components"></a>

### Triggers {#triggers}

A trigger is a component with an `action` option. SmarkForm infers its type, so
`"type":"trigger"` is usually unnecessary. The action runs on a component that
implements it; placement and an optional `context` affect which component
receives it. See the [Trigger reference]({{ "/component_reference/trigger" | relative_url }})
for the detailed rules.

<a id="actions-1"></a>

### Actions {#actions}

Actions are operations implemented by component types. Common field actions
include `import`, `export`, `clear`, and `reset`; lists also implement
`addItem` and `removeItem`. They can be invoked by triggers or through the
component API. Application event patterns are covered in the
[Events guide]({{ "/guides/events" | relative_url }}).

The following example contrasts actions on individual fields with actions on
the whole form.



{% raw %} <!-- capture context_comparsion_example_simple {{{ --> {% endraw %}
{% capture context_comparsion_example_simple -%}
<div id="myForm$$">
  <div data-smark='{"name":"demo"}'>
    <p>
      <label data-smark>Name:</label>
      <input name='name' data-smark>
    </p>
    <p>
      <label data-smark>Surname:</label>
      <input name='surname' data-smark>
    </p>
    <table>
      <tr style="text-align:center">
        <th>Name field:</th>
        <th>Surname field:</th>
        <th>Whole Form:</th>
      </tr>
      <tr style="text-align:center">
        <td><button data-smark='{"action":"import","context":"name","target":"/editor"}'>⬆️  Import</button></td>
        <td><button data-smark='{"action":"import","context":"surname","target":"/editor"}'>⬆️  Import</button></td>
        <td><button data-smark='{"action":"import","target":"/editor"}'>⬆️  Import</button></td>
      </tr>
      <tr style="text-align:center">
        <td><button data-smark='{"action":"export","context":"name","target":"/editor"}'>⬇️  Export</button></td>
        <td><button data-smark='{"action":"export","context":"surname","target":"/editor"}'>⬇️  Export</button></td>
        <td><button data-smark='{"action":"export","target":"/editor"}'>⬇️  Export</button></td>
      </tr>
      <tr style="text-align:center">
        <td><button data-smark='{"action":"clear","context":"name"}'>❌ Clear</button></td>
        <td><button data-smark='{"action":"clear","context":"surname"}'>❌ Clear</button></td>
        <td><button data-smark-action="clear">❌ Clear</button></td>
      </tr>
    </table>
  </div>
  <div style="display: flex; flex-direction:column; align-items:left; gap: 1em; width: 100%">
    <textarea
        placeholder="JSON data viewer / editor"
        data-smark='{"name":"editor","type":"input"}'
        style="resize: vertical; align-self: stretch; min-height: 8em; flex-grow: 1;"
    >
    </textarea>
  </div>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture notes {{{ --> {% endraw %}
{% capture notes -%}
Use the field buttons to compare importing/exporting one value with doing the
same for the whole form. The target editor is another field; see the Trigger
reference for the exact `context` and `target` behavior.
{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="context_comparsion_simple"
    htmlSource=context_comparsion_example_simple
    notes=notes
    tests=false
%}


{: .hint :}
> Most of the examples in this manual use this technique to implement the *JSON
> data viewer / editor* and `⬇️ Export`, `⬆️ Import` and `❌ Clear` buttons.
> It's just that, ulike this one, only their *context* subform is shown in the
> *HTML* tab for the sake of clutter minimization.


### Triggers target {#triggers-target}

Some actions also accept a `target` distinct from their `context`. A remove
trigger placed inside a list item can act on that item:

{% raw %} <!-- core_remove_inside_item {{{ --> {% endraw %}
{% capture core_remove_inside_item_html -%}
<div id="myForm$$">
  <ul data-smark='{"type":"list","name":"pets"}'>
    <li>
      <input name='species' data-smark>
      <input name='name' data-smark>
      <button data-smark='{"action":"removeItem"}'>❌</button>
    </li>
  </ul>
  <button data-smark='{"action":"addItem","context":"pets"}'>➕</button>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="core_remove_inside_item"
    htmlSource=core_remove_inside_item_html
    demoValue='{"pets":[{"species":"Cat","name":"Whiskers"},{"species":"Dog","name":"Rex"}]}'
    tests=false
%}

{: .info }
> An `addItem` trigger can also sit inside an item; by default, it adds the next
> item after that one. If `min_items` is 0, keep an external add trigger so the
> empty list still has a way to grow.


### Wildcard list targets {#behaviour-tunning}

Some list actions can use `target:"*"` to operate across list items, and
`preserve_non_empty` can restrict which items a removal affects. See the
[List reference]({{ "/component_reference/list" | relative_url }}) for the
supported combinations.
## Accessing components {#accessing-components}

Use `find()` to work with a component by path. Wait until rendering completes
before looking up descendants:

```javascript
async function readContact(myForm) {
    await myForm.rendered;
    const contact = myForm.find("profile/contact");
    return await contact.export();
}
```

See [Form Traversing]({{ "/guides/form_traversing" | relative_url }}) for path
syntax and traversal patterns. The [Using SmarkForm]({{ "/guides/using_smarkform" | relative_url }})
guide applies this model in a complete workflow.

## Next steps {#more}

- [Using SmarkForm]({{ "/guides/using_smarkform" | relative_url }}) — follow a
  practical form-building walkthrough.
- [Component Reference]({{ "/component_reference/overview" | relative_url }}) —
  check type-specific behavior and options.
- [Form Traversing]({{ "/guides/form_traversing" | relative_url }}) and the
  [Trigger reference]({{ "/component_reference/trigger" | relative_url }}) —
  continue with paths and action addressing.
