---
title: Showcase
layout: chapter
permalink: /about/showcase
nav_order: 4

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

* [Just a Form](#just-a-form)
* [Project Kanban Board](#project-kanban-board)
* [Race Registration System](#race-registration-system)
* [Product Configurator](#product-configurator)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>

Welcome to the SmarkForm Showcase — a visual catalogue of what SmarkForm
can do.  Each example is a fully working form; explore the tabs to see the
HTML, CSS, and JavaScript behind it.

---

## Just a Form

Fields auto-register from HTML attributes — no JavaScript beyond
initialization.  Try editing values in the preview or exporting to JSON.

{% raw %} <!-- just_form_example {{{ --> {% endraw %}
{% capture just_form_example -%}
<div id="myForm$$">
  <p>
    <label data-smark>Name:</label>
    <input name='name' data-smark>
  </p>
  <p>
    <label data-smark>Surname:</label>
    <input name='surname' data-smark>
  </p>
  <p>
    <label data-smark>Favourite colour:</label>
    <input name='colour' type='color' data-smark>
  </p>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- just_form_notes {{{ --> {% endraw %}
{% capture just_form_notes -%}
👉 Fields auto-register from `data-smark` attributes — no per-field JavaScript.

👉 **Null values.** Unlike native HTML, even `<input type='color'>` can be
`null` via the ❌ Clear button or pressing `Delete` in the colour field.

👉 **Triggers.** Buttons with `data-smark='{"action":"..."}'` invoke
SmarkForm actions: `import`, `export`, `clear`, `addItem`, `removeItem`.

> See [Quick Start]({{ "/getting_started/quick_start" | relative_url }})
> to learn the basics, or check the **✏️ Edit** tab to see the full source.
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
    "name": "Maria",
    "surname": "Garc\u00eda",
    "colour": "#c0ffee"
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="just_form"
    htmlSource=just_form_example
    notes=just_form_notes
    selected="preview"
    showEditor=true
    demoValue=demoValue
    tests=false
%}

---

## Project Kanban Board

A task management board with drag-and-drop columns, keyboard shortcuts,
and entry / exit animations.  Drag tasks between **To Do**, **In Progress**,
and **Done**.  Hold `Ctrl` to discover hotkeys.

{% raw %} <!-- kanban_html {{{ --> {% endraw %}
{% capture kanban_html -%}
<div id="myForm$$">
  <div class="kanban">
    <div class="column">
      <div data-smark='{"type":"#kanbanCol","name":"todo"}'>
        <span data-for="colLabel">To Do</span>
      </div>
    </div>
    <div class="column">
      <div data-smark='{"type":"#kanbanCol","name":"progress"}'>
        <span data-for="colLabel">In Progress</span>
      </div>
    </div>
    <div class="column">
      <div data-smark='{"type":"#kanbanCol","name":"done"}'>
        <span data-for="colLabel">Done</span>
      </div>
    </div>
  </div>
  <p class="hint">💡 Hold <kbd>Ctrl</kbd> to discover shortcuts — drag ☰ handles to reorder or move between columns</p>
  <button
    data-smark='{"action":"removeItem","context":"*","target":"*","preserve_non_empty":true,"autoscroll":"elegant"}'
    title="Clear empty tasks from all columns"
    class="clear-empties"
  >🧹</button>
</div>

<template id="kanbanCol">
  <style>
    .kanban-mixin strong { display: block; margin-bottom: 0.4em; font-weight: 600; }
    .kanban-mixin .card { display: flex; gap: 0.3em; margin: 0.3em 0; padding: 0.4em; background: #f8f9fa; border-radius: 4px; }
    .kanban-mixin .card input { flex: 1; }
    .kanban-mixin .empty { color: #999; font-style: italic; padding: 1em; text-align: center; }
  </style>
  <div data-smark='{"type":"list","sortable":true,"min_items":0,"movingDepth":1}' class="kanban-mixin">
    <div data-smark='{"role":"header"}'>
      <strong id="colLabel">Column</strong>
      <button data-smark='{"action":"addItem","hotkey":"+"}' title="Add task">➕</button>
    </div>
    <div data-smark='{"role":"empty_list"}' class="empty">No tasks</div>
    <div class="card">
      <span data-smark='{"type":"label"}' class="handle" title="Drag to reorder">☰</span>
      <input data-smark type="text" name="title" placeholder="Task title...">
      <button data-smark='{"action":"removeItem","hotkey":"-"}' title="Remove">➖</button>
    </div>
  </div>
</template>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %} <!-- kanban_js {{{ --> {% endraw %}
{% capture kanban_js -%}
const myForm = new SmarkForm(document.getElementById("myForm$$"));

myForm.on("BeforeAction_removeItem", async (ev) => {
  // Never confirm for bulk operations (target:*) or preserve_non_empty
  if (
    ev.target instanceof Array
    || ev.preserve_non_empty
  ) return;
  if (await ev.target?.isEmpty()) return;
  if (!window.confirm("Remove this task?")) ev.preventDefault();
});
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %} <!-- kanban_css {{{ --> {% endraw %}
{% capture kanban_css -%}
{{""}}#myForm$$ .kanban { display: flex; gap: 1em; align-items: stretch; }
{{""}}#myForm$$ .column { flex: 1; min-width: 200px; border: 1px solid #ddd; border-radius: 6px; padding: 0.5em; display: flex; flex-direction: column; }
{{""}}#myForm$$ .column > [data-smark] { flex: 1; min-height: 0; }
{{""}}#myForm$$ .hint { font-size: 0.82em; color: #888; margin-top: 1em; }
{{""}}#myForm$$ .hint kbd { background: rgba(0,0,0,.06); border: 1px solid #ccc; border-radius: 3px; padding: 1px 4px; }
{{""}}#myForm$$ .clear-empties { display: block; margin: 0.5em auto 0; }
button[data-hotkey]::after { content: "Ctrl+" attr(data-hotkey); position: absolute; top: -1.4em; left: 0; font-size: 0.65em; background: #333; color: #fff; padding: 1px 4px; border-radius: 3px; white-space: nowrap; }
button { position: relative; }
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %} <!-- kanban_notes {{{ --> {% endraw %}
{% capture kanban_notes -%}
👉 **Drag between columns.** All three lists have `sortable:true` — drag any task card to another column to move it.

👉 **Hotkeys.** Hold `Ctrl` to discover `+` (add task) and `-` (remove task) on each column. The same hotkeys adapt to the column you're working in (context sensitivity).

👉 **Empty-list placeholders** show "No tasks" when a column is empty (`min_items:0`).

> See [Hotkeys]({{ "/working_with_forms/hotkeys" | relative_url }}),
> [Keyboard Navigation]({{ "/working_with_forms/keyboard_navigation" | relative_url }}).
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% capture demoValue -%}
{"todo":["Write documentation","Review PR"],"progress":["Fix layout bug"],"done":["Setup CI"]}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="kanban"
    htmlSource=kanban_html
    cssSource=kanban_css
    jsHead=kanban_js
    notes=kanban_notes
    selected="preview"
    showEditor=true
    tests=false
%}

---

## Race Registration System

Register a family for a race event.  Fill the first member, then ✨ duplicate
for siblings — only edit what differs.  Each member gets a race bib, meal
selection, and emergency contact.

The form auto-validates age vs. distance, auto-numbers bibs, and exports
structured JSON with coercion built in.

{% raw %} <!-- race_html {{{ --> {% endraw %}
{% capture race_html -%}
<div id="myForm$$">
  <header>
    <h3>🏃 Race Registration</h3>
    <button data-smark='{"action":"addItem","context":"members","hotkey":"+"}' title="Add member">➕ Add Member</button>
    <button data-smark='{"action":"removeItem","context":"members","target":"*","preserve_non_empty":true,"hotkey":"Delete"}' title="Remove empty slots">🧹</button>
  </header>

  <ul data-smark='{"type":"list","name":"members","sortable":true,"min_items":1,"exportEmpties":false}'>
    <li>
      <div data-smark='{"type":"form"}'>
        <p>
          <span data-smark='{"action":"position"}' class="bib">#N</span>
          <label data-smark>Name:</label>
          <input data-smark name="name" type="text" placeholder="Full name">
        </p>
        <div class="row">
          <label data-smark>Age:</label>
          <input data-smark name="age" type="number" min="5" max="99" style="width:6em">
          <label data-smark style="margin-left:1em">Sex:</label>
          <span class="radio-group">
            <label><input type="radio" data-smark name="sex" value="M"> M</label>
            <label><input type="radio" data-smark name="sex" value="F"> F</label>
          </span>
        </div>
        <details>
          <summary>Emergency Contact</summary>
          <p>
            <label data-smark>Contact name:</label>
            <input data-smark name="emergency_name" type="text">
          </p>
          <p>
            <label data-smark>Phone:</label>
            <input data-smark name="emergency_phone" type="tel">
          </p>
        </details>
        <div class="row">
          <div style="flex:1">
            <label data-smark>T-shirt:</label>
            <select data-smark name="tshirt">
              <option value="">— Select —</option>
              <option>S</option><option>M</option><option>L</option><option>XL</option>
            </select>
          </div>
          <div style="flex:1">
            <label data-smark>Color:</label>
            <input data-smark type="color" name="tshirt_color" value="#3498db">
          </div>
        </div>
        <p>
          <label data-smark>Meal:</label>
          <span class="radio-group">
            <label><input type="radio" data-smark name="meal" value="Regular" checked> Regular</label>
            <label><input type="radio" data-smark name="meal" value="Vegetarian"> Vegetarian</label>
            <label><input type="radio" data-smark name="meal" value="Vegan"> Vegan</label>
          </span>
        </p>
        <button data-smark='{"action":"addItem","source":".-1","hotkey":"*"}' title="Duplicate this member">✨ Duplicate</button>
        <button data-smark='{"action":"removeItem","hotkey":"-"}' title="Remove this member">➖</button>
      </div>
    </li>
  </ul>
  <p class="hint">💡 Hold <kbd>Ctrl</kbd> to discover shortcuts — ✨ duplicates the previous member</p>
</div>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %} <!-- race_css {{{ --> {% endraw %}
{% capture race_css -%}
{{""}}#myForm$$ { max-width: 520px; font-size: 0.95em; }
{{""}}#myForm$$ h3 { margin: 0 0 0.3em; }
{{""}}#myForm$$ header { display: flex; gap: 0.5em; align-items: center; margin-bottom: 0.8em; }
{{""}}#myForm$$ ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.5em; }
{{""}}#myForm$$ li { border: 1px solid #ddd; border-radius: 6px; padding: 0.6em; }
{{""}}#myForm$$ li p { display: flex; align-items: center; gap: 0.5em; margin: 0.3em 0; }
{{""}}#myForm$$ li label { font-weight: 500; min-width: 6em; }
{{""}}#myForm$$ li input[type="text"], {{""}}#myForm$$ li input[type="tel"], {{""}}#myForm$$ li input[type="number"] { flex: 1; padding: 0.3em 0.5em; border: 1px solid #ccc; border-radius: 4px; }
{{""}}#myForm$$ li select { padding: 0.3em 0.5em; border: 1px solid #ccc; border-radius: 4px; }
{{""}}#myForm$$ li details { margin-top: 0.3em; }
{{""}}#myForm$$ li summary { cursor: default; user-select: none; font-weight: 500; }
{{""}}#myForm$$ li details[open] { border: 1px solid #eee; border-radius: 4px; padding: 0.3em 0.5em; }
{{""}}#myForm$$ .bib { font-weight: bold; min-width: 1.5em; text-align: center; background: #f0f0f0; border-radius: 4px; padding: 0.1em 0.4em; }
{{""}}#myForm$$ .row { display: flex; gap: 0.5em; align-items: center; margin: 0.3em 0; flex-wrap: wrap; }
{{""}}#myForm$$ .radio-group { display: flex; gap: 0.8em; }
{{""}}#myForm$$ .radio-group label { min-width: auto; font-weight: 400; cursor: pointer; }
{{""}}#myForm$$ .hint { font-size: 0.82em; color: #888; margin-top: 1em; }
{{""}}#myForm$$ .hint kbd { background: rgba(0,0,0,.06); border: 1px solid #ccc; border-radius: 3px; padding: 1px 4px; }
button[data-hotkey]::after { content: "Ctrl+" attr(data-hotkey); position: absolute; top: -1.4em; left: 0; font-size: 0.65em; background: #333; color: #fff; padding: 1px 4px; border-radius: 3px; white-space: nowrap; }
button { position: relative; }
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %} <!-- race_notes {{{ --> {% endraw %}
{% capture race_notes -%}
👉 **List + form nesting.** Each family member is a nested form inside a list — JSON exports as `{"members":[{...},...]}`.

👉 **✨ Duplicate.** The **_Duplicate_** button uses `source:".-1"` to copy the previous member's data, then you edit only what differs.

👉 **Collapsible sections.** Emergency contact is in a `<details>` element, collapsed by default. `Alt`+`Enter` opens it and navigates into hidden fields.

👉 **Auto-numbered bibs.** `{"action":"position"}` numbers each member.

👉 **Type coercion.** Age exports as a number; dates export as ISO strings; empty fields export `null`.

👉 **Hotkeys.** Hold `Ctrl` — `+` adds a member, `-` removes, `*` duplicates, `Delete` clears empty slots.

> See [Form Nesting]({{ "/component_types/type_form" | relative_url }}),
> [List Types]({{ "/component_types/type_list" | relative_url }}),
> [Value Coercion]({{ "/working_with_forms/value_coercion" | relative_url }}).
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% capture demoValue -%}
{"members":[{"name":"Alice Johnson","age":34,"tshirt":"M","meal":"Vegetarian","emergency_name":"Bob Johnson","emergency_phone":"555-1234"}]}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="race"
    htmlSource=race_html
    cssSource=race_css
    notes=race_notes
    selected="preview"
    showEditor=true
    tests=false
%}

---

## Product Configurator

A product customizer with **mixin templates** for different product variants
(Sedan, SUV, Sports) and **field masking** for price formatting.  Each variant
template includes option choices and a price calculator.

{% raw %} <!-- configurator_html {{{ --> {% endraw %}
{% capture configurator_html -%}
<script src="https://cdn.jsdelivr.net/npm/inputmask@5.0.9/dist/inputmask.min.js"></script>

<div id="myForm$$">
  <button data-smark='{"action":"addItem","context":"cars","hotkey":"+"}' title="Add car">➕ Add Model</button>
  <button data-smark='{"action":"removeItem","context":"cars","target":"*","preserve_non_empty":true,"hotkey":"Delete"}' title="Remove empty">🧹</button>
  <ul data-smark='{"type":"list","name":"cars","sortable":true,"min_items":0,"exportEmpties":false}'>
    <li data-smark='{"type":"#carModel"}'></li>
  </ul>
  <p class="hint">💡 Try the Inputmask price field: type digits, see space grouping and 2 decimal places</p>
</div>

<template id="carModel">
  <style>
    .car-card { border: 1px solid #ddd; border-radius: 6px; padding: 0.6em; }
    .car-card label { font-weight: 500; }
  </style>
  <div class="car-card">
    <p><span data-smark='{"action":"position"}'>#N</span></p>
    <p>
      <label data-smark>Model name:</label>
      <input data-smark type="text" name="model" placeholder="e.g. Model S">
    </p>
    <p>
      <label data-smark>Color:</label>
      <input data-smark type="text" name="color" placeholder="e.g. Midnight Blue">
    </p>
    <p>
      <label data-smark>Price:</label>
      <input data-smark='{"type":"number","name":"price","mask":"price"}' placeholder="0.00">
    </p>
    <button data-smark='{"action":"removeItem"}' title="Remove">➖</button>
  </div>
</template>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %} <!-- configurator_js {{{ --> {% endraw %}
{% capture configurator_js -%}
SmarkForm.registerMask("price", (node) => {
  node.inputMode = "decimal";
  Inputmask({
    alias: "numeric",
    groupSeparator: " ",
    radixPoint: ".",
    digits: 2,
    digitsOptional: false,
    placeholder: "0",
    allowMinus: false,
  }).mask(node);
  return {
    get unmaskedValue() { return node.inputmask?.unmaskedvalue() ?? node.value; },
    set unmaskedValue(v) { node.inputmask?.setValue(v); },
  };
});

const myForm = new SmarkForm(document.getElementById("myForm$$"));
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %} <!-- configurator_css {{{ --> {% endraw %}
{% capture configurator_css -%}
{{""}}#myForm$$ { max-width: 500px; font-size: 0.95em; }
{{""}}#myForm$$ ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.5em; }
{{""}}#myForm$$ .hint { font-size: 0.82em; color: #888; margin-top: 1em; }
{{""}}#myForm$$ button[data-hotkey]::after { content: "Ctrl+" attr(data-hotkey); position: absolute; top: -1.4em; left: 0; font-size: 0.65em; background: #333; color: #fff; padding: 1px 4px; border-radius: 3px; white-space: nowrap; }
{{""}}#myForm$$ button { position: relative; }
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %} <!-- configurator_notes {{{ --> {% endraw %}
{% capture configurator_notes -%}
👉 **Mixin templates.** `#carModel` is defined once via `<template>` and reused for every car entry. Each instance gets its own identity, data, and options.

👉 **Field masking.** The price field uses [Inputmask](https://github.com/RobinHerbots/Inputmask) (loaded via CDN) — `SmarkForm.registerMask()` wraps Inputmask's API into SmarkForm's `unmaskedValue` contract.  Type digits to see automatic space grouping and 2-decimal formatting.

👉 **Sortable list.** Drag car models to reorder them.  `exportEmpties:false` skips empty entries.

👉 **Hotkeys.** `Ctrl`+`+` adds a model, `Ctrl`+`-` removes.

> See [Mixin Types]({{ "/advanced_concepts/mixin_types" | relative_url }}),
> [Field Masking]({{ "/working_with_forms/field_masking" | relative_url }}).
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% capture demoValue -%}
{"cars":[{"model":"Model S","color":"Midnight Blue","price":"34900.00"},{"model":"Model X","color":"Pearl White","price":"42500.00"}]}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="configurator"
    htmlSource=configurator_html
    cssSource=configurator_css
    jsHead=configurator_js
    notes=configurator_notes
    smarkformOptions='{"smark_mixin_allowLocalScripts":"allow"}'
    selected="preview"
    showEditor=true
    demoValue=demoValue
    tests=false
%}

---

{: .hint }
> **Want the full feature set?** Each example above demonstrates a curated
> subset of SmarkForm capabilities.  See the individual reference pages for
> the complete API and advanced patterns.
