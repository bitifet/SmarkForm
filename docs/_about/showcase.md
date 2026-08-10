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
    * [Features demonstrated](#features-demonstrated)
* [Project Kanban Board](#project-kanban-board)
    * [Features demonstrated](#features-demonstrated-1)
* [Race Registration System](#race-registration-system)
    * [Features demonstrated](#features-demonstrated-2)
* [Product Configurator](#product-configurator)
    * [Features demonstrated](#features-demonstrated-3)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>

<style>
  .feature-index {
    columns: 2 260px;
    column-gap: 1.5em;
    margin: 1em 0;
  }
  .feature {
    position: relative;
    break-inside: avoid;
    margin-bottom: 0.2em;
  }
  .feature-summary {
    display: block;
    width: 100%;
    text-align: left;
    border: none;
    background: none;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
    padding: 0.2em 0;
    color: inherit;
  }
  .feature-summary::before {
    content: "▸";
    display: inline-block;
    width: 1.2em;
    font-size: 0.85em;
    color: var(--link-color, #7253ed);
  }
  .feature.open .feature-summary::before {
    content: "▾";
  }
  @media (pointer: coarse) {
    .feature-summary::before {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.55em;
      height: 1.55em;
      font-size: 0.85em;
      border-radius: 50%;
      background: rgba(114, 83, 237, 0.1);
      margin-right: 0.25em;
    }
  }
  .feature-desc {
    display: none;
    position: absolute;
    left: 0;
    z-index: 10;
    background: var(--body-background-color, #fff);
    border: 1px solid var(--border-color, #ddd);
    padding: 0.5em 0.75em;
    border-radius: 6px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.12);
    font-size: 0.92em;
    color: var(--body-text-color, #5c5962);
    min-width: 240px;
    max-width: 320px;
    line-height: 1.45;
  }
  .feature-desc p { margin: 0; }
  .feature.open .feature-desc { display: block; }
</style>

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
    <button data-smark='{"action":"clear","target":"colour"}'>❌</button>
  </p>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- just_form_notes {{{ --> {% endraw %}
{% capture just_form_notes -%}
👉 Fields auto-register from <code>data-smark</code> attributes — no per-field JavaScript.

👉 **Null values.** Unlike native HTML, even <code>&lt;input type='color'&gt;</code> can be
<code>null</code> when no colour is selected — the ❌ button next to it clears the value.

👉 **Triggers.** The ❌ button uses <code>data-smark='{"action":"clear","target":"colour"}'</code>
to target the colour field specifically.

> See <a href="{{ "/getting_started/quick_start" | relative_url }}">Quick Start</a>
> to learn the basics, or check the **✏️ Edit** tab to see the full source.
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="just_form"
    htmlSource=just_form_example
    notes=just_form_notes
    selected="preview"
    showEditor=true
    tests=false
%}

### Features demonstrated

<div class="feature-index">

<div class="feature">
  <button class="feature-summary">Auto-registration</button>
  <div class="feature-desc">
  Fields are discovered automatically from HTML <code>data-smark</code> attributes — no
  JavaScript wiring needed.  Any element with <code>data-smark</code> becomes a SmarkForm
  field component whose name is taken from its <code>name</code> attribute.

  See <a href="{{ "/getting_started/core_concepts" | relative_url }}">Core Concepts</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Null values</button>
  <div class="feature-desc">
  Empty inputs produce <code>null</code> in exported JSON.  The colour field (<code>type="color"</code>)
  is a good example: when no colour is selected, it exports <code>null</code> rather than an empty string.

  See <a href="{{ "/working_with_forms/value_coercion" | relative_url }}">Value Coercion</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Trigger buttons</button>
  <div class="feature-desc">
  Buttons with <code>data-smark</code> attributes trigger SmarkForm actions —
  the ❌ button next to the colour field demonstrates the <code>clear</code> action targeted
  at a specific field, with no custom JavaScript required.

  See <a href="{{ "/component_types/type_trigger" | relative_url }}">Triggers</a>,
  <a href="{{ "/working_with_forms/data_import_and_export" | relative_url }}">Data Import &amp; Export</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">JSON playground</button>
  <div class="feature-desc">
  The editor tab shows the form's current state as JSON.  Edit it and click
  <strong>Import</strong> to see the form react — everything in sync without code.

  See <a href="{{ "/working_with_forms/playground" | relative_url }}">Playground</a>.
  </div>
</div>

</div>

---

## Project Kanban Board

A task management board with drag-and-drop columns, keyboard shortcuts,
and entry / exit animations.  Drag tasks between **To Do**, **In Progress**,
and **Done**.  Hold <code>Ctrl</code> to discover hotkeys.

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
👉 **Drag between columns.** All three lists have <code>sortable:true</code> — drag any task card to another column to move it.

👉 **Hotkeys.** Hold <code>Ctrl</code> to discover <code>+</code> (add task) and <code>-</code> (remove task) on each column. The same hotkeys adapt to the column you're working in (context sensitivity).

👉 **Empty-list placeholders** show "No tasks" when a column is empty (<code>min_items:0</code>).

> See <a href="{{ "/working_with_forms/hotkeys" | relative_url }}">Hotkeys</a>,
> <a href="{{ "/working_with_forms/keyboard_navigation" | relative_url }}">Keyboard Navigation</a>.
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

### Features demonstrated

<div class="feature-index">

<div class="feature">
  <button class="feature-summary">Mixin templates</button>
  <div class="feature-desc">
  The column layout is defined once in a <code>&lt;template id="kanbanCol"&gt;</code> and
  reused three times via <code>type:"#kanbanCol"</code>.  Each instance gets its own
  identity (<code>name</code>), data, and options — identical structure, separate state.

  <code>data-for</code> snippet slots inject per-instance content (the column headings)
  into the template.

  See <a href="{{ "/advanced_concepts/mixin_types" | relative_url }}">Mixin Types</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Cross-list drag-and-drop</button>
  <div class="feature-desc">
  Task cards can be dragged between columns.  Each list has <code>sortable:true</code>
  and <code>movingDepth:1</code> — SmarkForm recognises that all three columns share
  the same mixin template and allows unrestricted movement between them.

  See <a href="{{ "/component_types/type_list" | relative_url }}#sortable-list-behaviour">List Type — sortable</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Multi-component triggers (<code>context:"*"</code>)</button>
  <div class="feature-desc">
  The <strong>🧹</strong> button at the bottom uses <code>context:"*"</code> to dispatch
  <code>removeItem</code> with <code>preserve_non_empty:true</code> to <em>all</em> list components
  in the form at once — clearing empty tasks from every column with a single
  click.

  See <a href="{{ "/working_with_forms/form_traversing" | relative_url }}#wildcard-context-multi-dispatch">Form Traversing — Wildcard Context</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Event-driven confirmation</button>
  <div class="feature-desc">
  A <code>BeforeAction_removeItem</code> listener on the root form checks whether the
  task is empty.  If it has content, <code>window.confirm()</code> is shown; if the user
  cancels, <code>ev.preventDefault()</code> stops the removal.  Bulk operations
  (<code>target:"*"</code> / <code>preserve_non_empty</code>) skip the prompt.

  See <a href="{{ "/advanced_concepts/events" | relative_url }}#beforeaction-events">Events — BeforeAction</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Context-scoped hotkeys</button>
  <div class="feature-desc">
  Hold <kbd>Ctrl</kbd> to reveal <kbd>+</kbd> and <kbd>-</kbd> shortcuts.  The
  same hotkey triggers different Add/Remove buttons depending on which column
  you are focused in — context sensitivity built in.

  See <a href="{{ "/working_with_forms/hotkeys" | relative_url }}">Hotkeys</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Empty-list placeholders</button>
  <div class="feature-desc">
  Each column has <code>min_items:0</code> and a <code>role:"empty_list"</code> template slot.
  When a column has no tasks the placeholder message is shown; it disappears
  as soon as the first task is added.

  See <a href="{{ "/component_types/type_list" | relative_url }}#template-roles">List Type — Template roles</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Header template role</button>
  <div class="feature-desc">
  The column heading and Add button live inside a <code>role:"header"</code> slot —
  rendered once at the top of each list component, not repeated per item.

  See <a href="{{ "/component_types/type_list" | relative_url }}#template-roles">List Type — Template roles</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Sortable handles</button>
  <div class="feature-desc">
  The <strong>☰</strong> icon uses <code>type:"label"</code> — a lightweight component
  that can act as a drag handle without being a data field.

  See <a href="{{ "/component_types/type_label" | relative_url }}">Label Type</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Scoped mixin CSS</button>
  <div class="feature-desc">
  The mixin template includes its own <code>&lt;style&gt;</code> block.  Styles are scoped with
  a <code>.kanban-mixin</code> class on the template root so they only affect the mixin's
  content — demonstrating encapsulated component styling.

  See <a href="{{ "/advanced_concepts/mixin_types" | relative_url }}">Mixin Types</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Flexible drop target</button>
  <div class="feature-desc">
  CSS flex layout makes each column's list root fill the available height,
  so dropping a task anywhere in the empty area below the last card works
  as an "append" — no need to precisely target the last item.

  See <a href="{{ "/component_types/type_list" | relative_url }}">List Type</a>.
  </div>
</div>

</div>

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
👉 **List + form nesting.** Each family member is a nested form inside a list — JSON exports as <code>{"members":[{...},...]}</code>.

👉 **✨ Duplicate.** The <em><strong>Duplicate</strong></em> button uses <code>source:".-1"</code> to copy the previous member's data, then you edit only what differs.

👉 **Collapsible sections.** Emergency contact is in a <code>&lt;details&gt;</code> element, collapsed by default. <code>Alt</code>+<code>Enter</code> opens it and navigates into hidden fields.

👉 **Auto-numbered bibs.** <code>{"action":"position"}</code> numbers each member.

👉 **Type coercion.** Age exports as a number; dates export as ISO strings; empty fields export <code>null</code>.

👉 **Hotkeys.** Hold <code>Ctrl</code> — <code>+</code> adds a member, <code>-</code> removes, <code>*</code> duplicates, <code>Delete</code> clears empty slots.

> See <a href="{{ "/component_types/type_form" | relative_url }}">Form Nesting</a>,
> <a href="{{ "/component_types/type_list" | relative_url }}">List Types</a>,
> <a href="{{ "/working_with_forms/value_coercion" | relative_url }}">Value Coercion</a>.
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

### Features demonstrated

<div class="feature-index">

<div class="feature">
  <button class="feature-summary">List + nested form</button>
  <div class="feature-desc">
  Each family member is a nested form (<code>type:"form"</code>) inside a list item.
  The JSON export produces <code>{"members": [{name:..., age:...}, ...]}</code> — the
  list becomes a JSON array, each form becomes a nested object.

  See <a href="{{ "/component_types/type_form" | relative_url }}">Form Type</a>,
  <a href="{{ "/component_types/type_list" | relative_url }}">List Type</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Item duplication (<code>source:".-1"</code>)</button>
  <div class="feature-desc">
  The ✨ <strong>Duplicate</strong> button copies the previous sibling's data
  into a new member.  <code>source:".-1"</code> on <code>addItem</code> tells SmarkForm to export
  the previous item and import it into the new one — edit only what differs.

  See <a href="{{ "/component_types/type_list" | relative_url }}#async-additem-action">List Type — source</a>,
  <a href="{{ "/working_with_forms/form_traversing" | relative_url }}#path-syntax-overview">Form Traversing — Path syntax</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Collapsible sections</button>
  <div class="feature-desc">
  Emergency Contact details live inside a native <code>&lt;details&gt;</code> / <code>&lt;summary&gt;</code>
  element.  Press <kbd>Alt</kbd>+<kbd>Enter</kbd> to open a collapsed section
  and navigate into its hidden fields.

  See <a href="{{ "/working_with_forms/keyboard_navigation" | relative_url }}">Keyboard Navigation</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Value coercion</button>
  <div class="feature-desc">
  The <strong>Age</strong> field (<code>type:"number"</code>) exports as a JavaScript
  number, not a string.  Empty fields export <code>null</code>.  SmarkForm's coercion
  layer ensures JSON round-trips with the correct types.

  See <a href="{{ "/working_with_forms/value_coercion" | relative_url }}">Value Coercion</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary"><code>position</code> action</button>
  <div class="feature-desc">
  The <strong>#N</strong> badge uses <code>action:"position"</code> — automatically
  numbers each member in the list with no extra code.

  See <a href="{{ "/component_types/type_list" | relative_url }}#position-action">List Type — position</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Bulk clean‑up (<code>preserve_non_empty</code> + <code>target:"*"</code>)</button>
  <div class="feature-desc">
  The <strong>🧹</strong> button removes every empty member at once.
  <code>preserve_non_empty:true</code> skips members that have data; <code>target:"*"</code>
  matches all children of the context list.

  See <a href="{{ "/component_types/type_list" | relative_url }}#async-removeitem-action">List Type — removeItem</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary"><code>min_items</code> / <code>exportEmpties</code></button>
  <div class="feature-desc">
  <code>min_items:1</code> ensures at least one member always exists.  <code>exportEmpties:false</code>
  skips empty members from the JSON output — only members with data appear.

  See <a href="{{ "/component_types/type_list" | relative_url }}">List Type</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Mixed input types</button>
  <div class="feature-desc">
  The form demonstrates text, number, radio, select, color, and tel inputs —
  all auto-registered as SmarkForm fields with their own coercion rules.

  See <a href="{{ "/getting_started/core_component_types" | relative_url }}">Core Component Types</a>.
  </div>
</div>

</div>

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
👉 **Mixin templates.** <code>#carModel</code> is defined once via <code>&lt;template&gt;</code> and reused for every car entry. Each instance gets its own identity, data, and options.

👉 **Field masking.** The price field uses [Inputmask](https://github.com/RobinHerbots/Inputmask) (loaded via CDN) — <code>SmarkForm.registerMask()</code> wraps Inputmask's API into SmarkForm's <code>unmaskedValue</code> contract.  Type digits to see automatic space grouping and 2-decimal formatting.

👉 **Sortable list.** Drag car models to reorder them.  <code>exportEmpties:false</code> skips empty entries.

👉 **Hotkeys.** <code>Ctrl</code>+<code>+</code> adds a model, <code>Ctrl</code>+<code>-</code> removes.

> See <a href="{{ "/advanced_concepts/mixin_types" | relative_url }}">Mixin Types</a>,
> <a href="{{ "/working_with_forms/field_masking" | relative_url }}">Field Masking</a>.
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

### Features demonstrated

<div class="feature-index">

<div class="feature">
  <button class="feature-summary">Mixin template with scoped CSS</button>
  <div class="feature-desc">
  The car model card is defined in a <code>&lt;template id="carModel"&gt;</code> with its own
  <code>&lt;style&gt;</code> block.  The <code>.car-card</code> class scopes styles to the mixin's content
  so they don't leak to other parts of the page.

  See <a href="{{ "/advanced_concepts/mixin_types" | relative_url }}">Mixin Types</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Field masking (<code>registerMask</code> + CDN)</button>
  <div class="feature-desc">
  The price field uses [Inputmask](https://github.com/RobinHerbots/Inputmask)
  loaded from a CDN.  <code>SmarkForm.registerMask("price", …)</code> wraps Inputmask in
  SmarkForm's mask factory API.  Typing <code>34900</code> produces <code>3 4900.00</code> on screen.

  See <a href="{{ "/working_with_forms/field_masking" | relative_url }}">Field Masking</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary"><code>unmaskedValue</code> for clean export</button>
  <div class="feature-desc">
  The mask factory returns an <code>unmaskedValue</code> getter/setter.  When SmarkForm
  exports the form, it reads <code>unmaskedValue</code> — the price <code>"3 4900.00"</code> becomes
  <code>34900.00</code> in JSON, ready for server processing.

  See <a href="{{ "/working_with_forms/field_masking" | relative_url }}#using-external-masking-libraries">Field Masking — unmaskedValue</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Sortable list</button>
  <div class="feature-desc">
  Car models can be reordered by dragging.  <code>sortable:true</code> on the list
  enables drag-and-drop within the list; combined with <code>position</code> action
  for automatic numbering.

  See <a href="{{ "/component_types/type_list" | relative_url }}#sortable-list-behaviour">List Type — sortable</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Mobile‑friendly input hints</button>
  <div class="feature-desc">
  The price field sets <code>inputMode:"decimal"</code> via the mask factory — mobile
  devices show a numeric keypad instead of the full keyboard.

  See <a href="{{ "/component_types/type_input" | relative_url }}">Input Type</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Bulk clean‑up + <code>exportEmpties</code></button>
  <div class="feature-desc">
  The <strong>🧹</strong> button with <code>preserve_non_empty:true</code> and
  <code>target:"*"</code> removes all empty car models at once.  <code>exportEmpties:false</code>
  on the list skips empty entries when exporting the form.

  See <a href="{{ "/component_types/type_list" | relative_url }}">List Type</a>.
  </div>
</div>

</div>

<script src="{{ "/assets/js/showcase-features.js" | relative_url }}"></script>

---

{: .hint }
> **Want the full feature set?** Each example above demonstrates a curated
> subset of SmarkForm capabilities.  See the individual reference pages for
> the complete API and advanced patterns.
