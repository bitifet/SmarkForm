---
layout: chapter
permalink: "/showcase_examples/showcase"
migration_in_progress: true
sitemap: false
nav_order: 1
redirect_from:
  - "/about/showcase2"
  - "/about/showcase"
title: "Showcase"
description: "Explore runnable examples of SmarkForm markup, structured data, lists, mixins, and form interactions."
---


{% include links.md %}
{% include components/sampletabs_ctrl.md %}

{% raw %}<!-- BEGIN old PORTED TO docs/_showcase_examples/showcase.md -->{% endraw %}
# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {% include chaptertoc/showcase.html depth=3 %}

</details>

<style>
  .feature-index {
    columns: 2 260px;
    column-gap: 1.5em;
    margin: 1em 0;
    position: relative;
  }
  .feature {
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
    .feature {
      font-size: 1.25em;
    }
    .feature-summary::before {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.8em;
      height: 2.8em;
      font-size: 1.5em;
      border-radius: 50%;
      background: rgba(114, 83, 237, 0.1);
      margin-right: 0.25em;
    }
  }
  .feature-desc {
    display: none;
    position: absolute;
    margin-top: 0.15em;
    z-index: 10;
    background: var(--body-background-color, #fff);
    border: 1px solid var(--border-color, #ddd);
    padding: 0.5em 0.75em;
    border-radius: 6px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.12);
    font-size: 0.92em;
    color: var(--body-text-color, #5c5962);
    width: auto;
    max-width: 320px;
    line-height: 1.45;
  }
  .feature-desc p { margin: 0; }
  .feature.open .feature-desc {
    display: block;
    position: absolute;
  }
</style>

Welcome to the SmarkForm Showcase — a visual catalogue of what SmarkForm
can do.  Each example is a fully working form; explore the tabs to see the
HTML, CSS, and JavaScript behind it.

Each preview also includes the standard JSON playground controls: Export,
Import, Reset, and Clear. See the [Playground guide]({{ "/showcase_examples/playground" | relative_url }})
for how the editor scaffold isolates an example's values.

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
    <label data-smark>Age:</label>
    <input name='age' type='number' data-smark>
  </p>
  <p>
    <label data-smark>Favourite colour:</label>
    <span data-smark='{"name":"colour","type":"color"}'>
      <input data-smark>
      <button data-smark='{"action":"clear"}' title="Clear colour">❌</button>
    </span>
  </p>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- just_form_notes {{{ --> {% endraw %}
{% capture just_form_notes -%}
👉 Fields auto-register from <code>data-smark</code> attributes — no per-field JavaScript.

👉 **Singleton pattern.** The colour field uses a <code>&lt;span data-smark&gt;</code> wrapper
with the <code>name</code> option, while the inner input carries the bare <code>data-smark</code>
attribute.  The ❌ button inside the singleton resolves its target implicitly.

👉 **Label auto-linking.** A <code>&lt;label <strong>data-smark</strong>&gt;</code> finds the next
field in component-tree order — no <code>for</code> or <code>id</code> attributes needed here.

👉 **Type-specific values.** The Color field exports <code>null</code> when it has no
selection, while empty text fields export <code>""</code> and Age exports a number.
Try the ❌ button to see the Color field's nullable state.

> See <a href="{{ "/start_here/quick_start" | relative_url }}">Quick Start</a>
> to learn the basics, or check the **✏️ Edit** tab to see the full source.
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{"name":"Alice","surname":"Johnson","age":28,"colour":"#6366f1"}
{%- endcapture %}

{% raw %}<!-- just_form_js {{{ -->{% endraw %}
{% capture just_form_js -%}
// Marked fields are discovered automatically; no custom JavaScript is needed.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- just_form_tests {{{ -->{% endraw %}
{% capture just_form_tests -%}
export default async ({ expect, root, readField, writeField }) => {
    await expect(root).toBeVisible();
    await writeField('name', 'Alice');
    await writeField('surname', 'Johnson');
    await writeField('age', 28);
    await writeField('colour', '#6366f1');

    expect(await readField('name')).toBe('Alice');
    expect(await readField('age')).toBe(28);
    expect(await readField('colour')).toBe('#6366f1');

    await root.locator('button[title="Clear colour"]').click();
    expect(await readField('colour')).toBeNull();
};
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="just_form"
    htmlSource=just_form_example
    jsSource=just_form_js
    notes=just_form_notes
    demoValue=demoValue
    selected="preview"
    showEditor=true
    tests=just_form_tests
%}

### Features demonstrated

<div class="feature-index">

<div class="feature">
  <button class="feature-summary">Auto-registration</button>
  <div class="feature-desc">
  Fields are discovered automatically from HTML <code>data-smark</code> attributes — no
  JavaScript wiring needed.  Any element with <code>data-smark</code> becomes a SmarkForm
  field component whose name is taken from its <code>name</code> attribute.

  See <a href="{{ "/start_here/core_concepts" | relative_url }}">Core Concepts</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Singleton pattern</button>
  <div class="feature-desc">
  The colour field wraps the actual input in a <code>&lt;span data-smark='{"name":"colour","type":"color"}'&gt;</code>
  that holds the component options, while the inner <code>&lt;input data-smark&gt;</code> carries the
  bare attribute.  This allows buttons and other elements to share the same
  field context without repeating the options.

  See <a href="{{ "/guides/the_singleton_pattern" | relative_url }}">Singleton Pattern</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Label auto-linking</button>
  <div class="feature-desc">
  A <code>&lt;label <strong>data-smark</strong>&gt;</code> is automatically associated by SmarkForm with
  its adjacent field — no <code>for</code> or <code>id</code> attributes needed.  The label
  next to the colour field is enhanced and linked without any explicit wiring.

  See <a href="{{ "/component_reference/label" | relative_url }}">Label Component Type</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Null values</button>
  <div class="feature-desc">
  Empty values depend on the field type. The Color field (<code>type="color"</code>)
  exports <code>null</code> when undefined; the text inputs export empty strings,
  and Age exports a number or <code>null</code>.

  See <a href="{{ "/guides/data_import_and_export" | relative_url }}">Data Import &amp; Export</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Trigger buttons</button>
  <div class="feature-desc">
  Buttons with <code>data-smark</code> attributes trigger SmarkForm actions —
  the ❌ button inside the colour field's singleton wrapper demonstrates the
  <code>clear</code> action.  Because the button is inside the singleton span,
  its target resolves implicitly — no explicit <code>target</code> needed.

  See <a href="{{ "/component_reference/trigger" | relative_url }}">Triggers</a>,
  <a href="{{ "/guides/data_import_and_export" | relative_url }}">Data Import &amp; Export</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">JSON playground</button>
  <div class="feature-desc">
  The editor tab shows the form's current state as JSON.  Edit it and click
  <strong>Import</strong> to see the form react — everything in sync without code.

  See <a href="{{ "/showcase_examples/playground" | relative_url }}">Playground</a>.
  </div>
</div>

</div>

---

## Project Kanban Board

A task management board with drag-and-drop columns and keyboard shortcuts.
Drag tasks between **To Do**, **In Progress**,
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
  <div data-smark='{"type":"list","sortable":true,"min_items":0,"moving_depth":1}' class="kanban-mixin">
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

{% raw %}<!-- kanban_tests {{{ -->{% endraw %}
{% capture kanban_tests -%}
export default async ({ expect, root, readField, writeField, page }) => {
    await expect(root).toBeVisible();
    await writeField('/todo', [
        { title: 'Write tests' },
        { title: 'Review PR' },
    ]);
    await writeField('/progress', [{ title: 'Fix layout' }]);

    await page.evaluate(async () => {
        const source = myForm.find('/todo');
        const target = myForm.find('/progress');
        await source.move({
            from: source.children[0],
            target_list: target,
            position: 'after',
        });
    });

    expect(await readField('/todo')).toEqual([{ title: 'Review PR' }]);
    expect(await readField('/progress')).toEqual([
        { title: 'Fix layout' },
        { title: 'Write tests' },
    ]);

    await page.evaluate(async () => {
        await myForm.find('/done').addItem(
            { title: '' }, { multiple: false, silent: true }
        );
    });
    const done = await page.evaluate(() => myForm.find('/done').children.length);
    expect(done).toBe(2);
    await root.locator('.clear-empties').click();
    expect(await page.evaluate(() => myForm.find('/done').children.length)).toBe(1);
};
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

> See <a href="{{ "/accessibility/hotkeys" | relative_url }}">Hotkeys</a>,
> <a href="{{ "/accessibility/keyboard_navigation" | relative_url }}">Keyboard Navigation</a>.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% capture demoValue -%}
{"todo":[{"title":"Write documentation"},{"title":"Review PR"}],"progress":[{"title":"Fix layout bug"}],"done":[{"title":"Setup CI"}]}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="kanban"
    htmlSource=kanban_html
    cssSource=kanban_css
    jsSource=kanban_js
    notes=kanban_notes
    demoValue=demoValue
    selected="preview"
    showEditor=true
    tests=kanban_tests
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

  See <a href="{{ "/guides/mixin_types" | relative_url }}">Mixin Types</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Cross-list drag-and-drop</button>
  <div class="feature-desc">
  Task cards can be dragged between these three columns. Each list has
  <code>sortable:true</code> and <code>moving_depth:1</code>. The lists share the
  same mixin template, so SmarkForm treats them as compatible; other cross-list
  moves still obey the configured sibling-distance limits on both lists.

  See <a href="{{ "/component_reference/list" | relative_url }}#sortable">List Type — sortable</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Multi-component triggers (<code>context:"*"</code>)</button>
  <div class="feature-desc">
  The <strong>🧹</strong> button at the bottom uses <code>context:"*"</code> to dispatch
  <code>removeItem</code> with <code>preserve_non_empty:true</code> to <em>all</em> list components
  in the form at once — clearing empty tasks from every column with a single
  click.

  See <a href="{{ "/guides/form_traversing" | relative_url }}#wildcard-context-multi-dispatch">Form Traversing — Wildcard Context</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Event-driven confirmation</button>
  <div class="feature-desc">
  A <code>BeforeAction_removeItem</code> listener on the root form checks whether the
  task is empty.  If it has content, <code>window.confirm()</code> is shown; if the user
  cancels, <code>ev.preventDefault()</code> stops the removal.  Bulk operations
  (<code>target:"*"</code> / <code>preserve_non_empty</code>) skip the prompt.

  See <a href="{{ "/guides/events" | relative_url }}#beforeaction-events">Events — BeforeAction</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Context-scoped hotkeys</button>
  <div class="feature-desc">
  Hold <kbd>Ctrl</kbd> to reveal <kbd>+</kbd> and <kbd>-</kbd> shortcuts.  The
  same hotkey triggers different Add/Remove buttons depending on which column
  you are focused in — context sensitivity built in.

  See <a href="{{ "/accessibility/hotkeys" | relative_url }}">Hotkeys</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Empty-list placeholders</button>
  <div class="feature-desc">
  Each column has <code>min_items:0</code> and a <code>role:"empty_list"</code> template slot.
  When a column has no tasks the placeholder message is shown; it disappears
  as soon as the first task is added.

  See <a href="{{ "/component_reference/list" | relative_url }}">List Type</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Header template role</button>
  <div class="feature-desc">
  The column heading and Add button live inside a <code>role:"header"</code> slot —
  rendered once at the top of each list component, not repeated per item.

  See <a href="{{ "/component_reference/list" | relative_url }}">List Type</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Sortable handles</button>
  <div class="feature-desc">
  The <strong>☰</strong> icon uses <code>type:"label"</code> — a lightweight component
  that can act as a drag handle without being a data field.

  See <a href="{{ "/component_reference/label" | relative_url }}">Label Type</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Class-prefixed mixin styles</button>
  <div class="feature-desc">
  The mixin template includes a <code>&lt;style&gt;</code> block whose selectors
  begin with <code>.kanban-mixin</code>. Mixin styles are injected globally, not
  encapsulated; this class prefix limits where these rules match.

  See <a href="{{ "/guides/mixin_types" | relative_url }}">Mixin Types</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Flexible drop target</button>
  <div class="feature-desc">
  CSS flex layout makes each column's list root fill the available height,
  so dropping a task anywhere in the empty area below the last card works
  as an "append" — no need to precisely target the last item.

  See <a href="{{ "/component_reference/list" | relative_url }}">List Type</a>.
  </div>
</div>

</div>

---

## Race Registration System

Register a family for a race event.  Fill the first member, then ✨ duplicate
for siblings — only edit what differs.  Each member gets a race bib, meal
selection, and emergency contact.

The form auto-numbers bibs and exports structured data. Age uses native number
input constraints; the example does not implement a race-distance business rule.

{% raw %} <!-- race_html {{{ --> {% endraw %}
{% capture race_html -%}
<div id="myForm$$">
  <header>
    <h3>🏃 Race Registration</h3>
    <button data-smark='{"action":"addItem","context":"members","hotkey":"+"}' title="Add member">➕ Add Member</button>
    <button data-smark='{"action":"removeItem","context":"members","target":"*","preserve_non_empty":true,"hotkey":"Delete"}' title="Remove empty slots">🧹</button>
  </header>

  <ul data-smark='{"type":"list","name":"members","sortable":true,"min_items":1,"max_items":5,"export_empties":false}'>
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

👉 **Type-specific values.** Age exports as a number. Empty Number and Radio
fields may export <code>null</code>; text and native select values can be empty
strings. The Color field has an authored default value.

👉 **Hotkeys.** Hold <code>Ctrl</code> — <code>+</code> adds a member, <code>-</code> removes, <code>*</code> duplicates, <code>Delete</code> clears empty slots.

> See <a href="{{ "/component_reference/form" | relative_url }}">Form Nesting</a>,
> <a href="{{ "/component_reference/list" | relative_url }}">List Types</a>,
> <a href="{{ "/guides/value_coercion" | relative_url }}">Value Coercion</a>.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% capture demoValue -%}
{"members":[{"name":"Alice Johnson","age":34,"sex":"F","emergency_name":"Bob Johnson","emergency_phone":"555-1234","tshirt":"M","tshirt_color":"#3498db","meal":"Vegetarian"}]}
{%- endcapture %}

{% raw %}<!-- race_js {{{ -->{% endraw %}
{% capture race_js -%}
// SmarkForm handles the field values, list actions, and position labels.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- race_tests {{{ -->{% endraw %}
{% capture race_tests -%}
export default async ({ expect, root, readField, writeField }) => {
    await expect(root).toBeVisible();
    await writeField('/members/0/name', 'Alice Johnson');
    await writeField('/members/0/age', 34);
    await writeField('/members/0/sex', 'F');
    await writeField('/members/0/tshirt', 'M');
    await writeField('/members/0/meal', 'Vegetarian');

    const before = await readField('/members');
    expect(before[0].age).toBe(34);
    expect(before[0].sex).toBe('F');

    await root.locator('button[title="Duplicate this member"]').click();
    const duplicated = await readField('/members');
    expect(duplicated).toHaveLength(2);
    expect(duplicated[1]).toMatchObject(duplicated[0]);

    await root.locator('li').nth(1).locator('button[title="Remove this member"]').click();
    await expect(root.locator('li').first().locator('button[title="Remove this member"]')).toBeDisabled();
    expect(await readField('/members')).toHaveLength(1);
};
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="race"
    htmlSource=race_html
    cssSource=race_css
    jsSource=race_js
    notes=race_notes
    demoValue=demoValue
    selected="preview"
    showEditor=true
    tests=race_tests
%}

### Features demonstrated

<div class="feature-index">

<div class="feature">
  <button class="feature-summary">List + nested form</button>
  <div class="feature-desc">
  Each family member is a nested form (<code>type:"form"</code>) inside a list item.
  The JSON export produces <code>{"members": [{name:..., age:...}, ...]}</code> — the
  list becomes a JSON array, each form becomes a nested object.

  See <a href="{{ "/component_reference/form" | relative_url }}">Form Type</a>,
  <a href="{{ "/component_reference/list" | relative_url }}">List Type</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Item duplication (<code>source:".-1"</code>)</button>
  <div class="feature-desc">
  The ✨ <strong>Duplicate</strong> button copies the previous sibling's data
  into a new member.  <code>source:".-1"</code> on <code>addItem</code> tells SmarkForm to export
  the previous item and import it into the new one — edit only what differs.

  See <a href="{{ "/component_reference/list" | relative_url }}#async-additem-action">List Type — source</a>,
  <a href="{{ "/guides/form_traversing" | relative_url }}#path-syntax-overview">Form Traversing — Path syntax</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Collapsible sections</button>
  <div class="feature-desc">
  Emergency Contact details live inside a native <code>&lt;details&gt;</code> / <code>&lt;summary&gt;</code>
  element.  Press <kbd>Alt</kbd>+<kbd>Enter</kbd> to open a collapsed section
  and navigate into its hidden fields.

  See <a href="{{ "/accessibility/keyboard_navigation" | relative_url }}">Keyboard Navigation</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Value coercion</button>
  <div class="feature-desc">
  The <strong>Age</strong> field (<code>type:"number"</code>) exports as a JavaScript
  number, not a string. Empty Number/Radio values may be <code>null</code>, while
  empty text/select values are strings. The list omits wholly empty rows through
  <code>export_empties:false</code>.

  See <a href="{{ "/guides/value_coercion" | relative_url }}">Value Coercion</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary"><code>position</code> action</button>
  <div class="feature-desc">
  The <strong>#N</strong> badge uses <code>action:"position"</code> — automatically
  numbers each member in the list with no extra code.

  See <a href="{{ "/component_reference/list" | relative_url }}#position-action">List Type — position</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Bulk clean‑up (<code>preserve_non_empty</code> + <code>target:"*"</code>)</button>
  <div class="feature-desc">
  The <strong>🧹</strong> button removes every empty member at once.
  <code>preserve_non_empty:true</code> skips members that have data; <code>target:"*"</code>
  matches all children of the context list.

  See <a href="{{ "/component_reference/list" | relative_url }}#async-removeitem-action">List Type — removeItem</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary"><code>min_items</code> / <code>max_items</code> / <code>export_empties</code></button>
  <div class="feature-desc">
  <code>min_items:1</code> keeps one member row, <code>max_items:5</code> caps the
  list, and <code>export_empties:false</code> omits wholly empty members.

  See <a href="{{ "/component_reference/list" | relative_url }}">List Type</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Mixed input types</button>
  <div class="feature-desc">
  The form demonstrates text, number, radio, native select, color, and tel
  controls. Native Select uses the generic Input type and exports a string;
  there is no separate SmarkForm Select type yet.

  See <a href="{{ "/component_reference/overview" | relative_url }}">Component Types Overview</a>.
  </div>
</div>

</div>

---

## Product Configurator

Reusable car cards show a **mixin template** and a **number-field mask** for
price formatting. The cards share one structure and have independent values.

{% raw %}<!-- configurator_js {{{ -->{% endraw %}
{% capture configurator_js -%}
// This factory is registered from the declarative script in the HTML capture.
(node) => {
  node.inputMode = "decimal";
  node.placeholder = "0.00";
  if (typeof IMask !== "function") {
    console.warn("IMask did not load; the price field will remain unformatted.");
    return null;
  }
  let imask;
  try {
    imask = new IMask(node, {
      mask: Number,
      scale: 2,
      signed: false,
      thousandsSeparator: " ",
      radix: ".",
      padFractionalZeros: true,
      normalizeZeros: true,
    });
  } catch (error) {
    console.warn("Could not initialize the price mask; using the number field without a mask.", error);
    return null;
  }
  return {
    get unmaskedValue() {
      return imask.masked.isComplete ? imask.masked.unmaskedValue : null;
    },
    set unmaskedValue(value) {
      imask.unmaskedValue = value;
      // This workaround is specific to the pinned IMask version below.
      const length = node.value.length;
      try { node.setSelectionRange(length, length); } catch (_error) {}
      if ("_selection" in imask) {
        imask._selection = { start: length, end: length };
      }
    },
  };
}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %} <!-- configurator_html {{{ --> {% endraw %}
{% capture configurator_html -%}
<script src="https://cdn.jsdelivr.net/npm/imask@6.6.3"></script>
<script type="smark-mask" data-name="price">
{{ configurator_js }}
</script>

<div id="myForm$$">
  <button data-smark='{"action":"addItem","context":"cars","hotkey":"+"}' title="Add car">➕ Add Model</button>
  <button data-smark='{"action":"removeItem","context":"cars","target":"*","preserve_non_empty":true,"hotkey":"Delete"}' title="Remove empty">🧹</button>
  <ul data-smark='{"type":"list","name":"cars","sortable":true,"min_items":0,"export_empties":false}'>
    <li data-smark='{"type":"#carModel"}'></li>
  </ul>
  <p class="hint">💡 Type digits in a price field to see grouping and two decimal places.</p>
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
      <input data-smark='{"type":"number","name":"price","mask":"price"}' class="price" placeholder="0.00">
    </p>
    <button data-smark='{"action":"removeItem"}' title="Remove">➖</button>
  </div>
</template>
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

👉 **Field masking.** A pinned IMask build is loaded from the CDN, and the
<code>&lt;script type="smark-mask"&gt;</code> element registers a Number mask.
Typing <code>34900</code> displays <code>34 900.00</code>; the number field exports
the unmasked numeric value. If the library fails to load, the field remains a
usable unformatted text input with numeric export.

👉 **Sortable list.** Drag car models to reorder them.
<code>export_empties:false</code> skips wholly empty entries.

👉 **Hotkeys.** <code>Ctrl</code>+<code>+</code> adds a model, <code>Ctrl</code>+<code>-</code> removes.

> See <a href="{{ "/guides/mixin_types" | relative_url }}">Mixin Types</a>,
> <a href="{{ "/guides/field_masking" | relative_url }}">Field Masking</a>.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% capture demoValue -%}
{"cars":[{"model":"Model S","color":"Midnight Blue","price":34900},{"model":"Model X","color":"Pearl White","price":42500}]}
{%- endcapture %}

{% raw %}<!-- configurator_tests {{{ -->{% endraw %}
{% capture configurator_tests -%}
export default async ({ expect, root, readField, writeField }) => {
    await expect(root).toBeVisible();
    await writeField('/cars', [
        { model: 'Model S', color: 'Midnight Blue', price: 34900 },
        { model: 'Model X', color: 'Pearl White', price: 42500 },
    ]);
    expect(await readField('/cars')).toHaveLength(2);
    expect(await readField('/cars/0/price')).toBe(34900);

    const price = root.locator('input.price').first();
    await expect(price).toHaveValue('34 900.00');
    await writeField('/cars/0/price', 1234.5);
    expect(await readField('/cars/0/price')).toBe(1234.5);
    await expect(price).toHaveValue('1 234.50');
};
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="configurator"
    htmlSource=configurator_html
    cssSource=configurator_css
    notes=configurator_notes
    selected="preview"
    showEditor=true
    demoValue=demoValue
    tests=configurator_tests
%}

### Features demonstrated

<div class="feature-index">

<div class="feature">
  <button class="feature-summary">Mixin template with class-prefixed CSS</button>
  <div class="feature-desc">
  The car model card is defined in a <code>&lt;template id="carModel"&gt;</code> with its own
  <code>&lt;style&gt;</code> block. Mixin styles are injected globally; the
  <code>.car-card</code> selector is a naming convention, not style encapsulation.

  See <a href="{{ "/guides/mixin_types" | relative_url }}">Mixin Types</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Declarative IMask Number mask</button>
  <div class="feature-desc">
  The HTML's <code>smark-mask</code> script registers a pinned IMask Number
  factory. Typing <code>34900</code> displays <code>34 900.00</code>.

  See <a href="{{ "/guides/field_masking" | relative_url }}">Field Masking</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary"><code>unmaskedValue</code> for clean export</button>
  <div class="feature-desc">
  The mask factory exposes <code>unmaskedValue</code>. The Number component
  converts that value to a JavaScript number, so the displayed
  <code>34 900.00</code> exports as <code>34900</code>.

  See <a href="{{ "/guides/field_masking" | relative_url }}#masks-and-external-libraries">Field Masking — unmaskedValue</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Sortable list</button>
  <div class="feature-desc">
  Car models can be reordered by dragging.  <code>sortable:true</code> on the list
  enables drag-and-drop within the list; combined with <code>position</code> action
  for automatic numbering.

  See <a href="{{ "/component_reference/list" | relative_url }}#sortable">List Type — sortable</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Mobile‑friendly input hints</button>
  <div class="feature-desc">
  The price field sets <code>inputMode:"decimal"</code> via the mask factory — mobile
  devices show a numeric keypad instead of the full keyboard.

  See <a href="{{ "/component_reference/input" | relative_url }}">Input Type</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Bulk clean‑up + <code>export_empties</code></button>
  <div class="feature-desc">
  The <strong>🧹</strong> button with <code>preserve_non_empty:true</code> and
  <code>target:"*"</code> removes all empty car models at once. <code>export_empties:false</code>
  on the list skips empty entries when exporting the form.

  See <a href="{{ "/component_reference/list" | relative_url }}">List Type</a>.
  </div>
</div>

</div>

<script src="{{ "/assets/js/showcase-features.js" | relative_url }}"></script>

---

{: .hint }
> **Want the full feature set?** Each example above demonstrates a curated
> subset of SmarkForm capabilities.  See the individual reference pages for
> the complete API and advanced patterns.
{% raw %}<!-- END old PORTED TO docs/_showcase_examples/showcase.md -->{% endraw %}
