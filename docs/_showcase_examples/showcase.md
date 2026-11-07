---
layout: chapter
permalink: "/showcase_examples/showcase"
nav_order: 2
redirect_from:
  - "/about/showcase2"
  - "/about/showcase"
title: "Showcase"
description: "Explore interactive SmarkForm examples including a Kanban board, race registration, hotel schedules, and calculators."
---


{% include links.md %}
{% include components/sampletabs_ctrl.md %}

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
for how to use these controls to inspect and change form data.

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
    await writeField('/done', [{ title: 'Setup CI' }]);

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
button[data-hotkey]::after { content: "Ctrl+" attr(data-hotkey); position: absolute; top: 0.75em; left: 0; font-size: 0.7em; background: #333; color: #fff; padding: 1px 4px; border-radius: 3px; white-space: nowrap; }
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
<script src="https://cdn.jsdelivr.net/npm/imask@6.6.3"></script>
<script type="smark-mask" data-name="raceFee">
(node) => {
  node.inputMode = "decimal";
  node.placeholder = "0.00";
  if (typeof IMask !== "function") {
    console.warn("IMask did not load; the fee field will remain unformatted.");
    return null;
  }
  const imask = IMask(node, {
    mask: Number,
    scale: 2,
    signed: false,
    thousandsSeparator: " ",
    radix: ".",
    padFractionalZeros: true,
    normalizeZeros: true,
  });
  return {
    get unmaskedValue() {
      return imask.masked.isComplete ? imask.masked.unmaskedValue : null;
    },
    set unmaskedValue(value) {
      imask.unmaskedValue = value;
      const length = node.value.length;
      try { node.setSelectionRange(length, length); } catch (_error) {}
      if ("_selection" in imask) {
        imask._selection = { start: length, end: length };
      }
    },
  };
}
</script>
<div id="myForm$$">
  <header>
    <h3>🏃 Race Registration</h3>
    <button data-smark='{"action":"addItem","context":"members","hotkey":"+"}' title="Add member">➕ Add Member</button>
    <button data-smark='{"action":"removeItem","context":"members","target":"*","preserve_non_empty":true,"hotkey":"Delete"}' title="Remove empty slots">🧹</button>
  </header>

  <ul data-smark='{"type":"list","name":"members","sortable":true,"max_items":5,"export_empties":false}'>
    <li>
      <div>
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
        <p class="row fee-row">
          <label data-smark>Registration fee:</label>
          <input data-smark='{"type":"number","name":"fee","mask":"raceFee"}' class="fee" placeholder="0.00">
        </p>
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
        <button data-smark='{"action":"removeItem","failback":"clear","hotkey":"-"}' title="Remove this member">➖</button>
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
{{""}}#myForm$$ li input.fee { flex: 1; min-width: 0; }
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
button[data-hotkey]::after { content: "Ctrl+" attr(data-hotkey); position: absolute; top: 0.75em; left: 0; font-size: 0.7em; background: #333; color: #fff; padding: 1px 4px; border-radius: 3px; white-space: nowrap; }
button { position: relative; }
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %} <!-- race_notes {{{ --> {% endraw %}
{% capture race_notes -%}
👉 **List + form nesting.** Each family member is a nested form inside a list — JSON exports as <code>{"members":[{...},...]}</code>.

👉 **✨ Duplicate.** The <em><strong>Duplicate</strong></em> button uses <code>source:".-1"</code> to copy the previous member's data, then you edit only what differs.

👉 **Collapsible sections.** Emergency contact is in a <code>&lt;details&gt;</code> element, collapsed by default. <code>Alt</code>+<code>Enter</code> opens it and navigates into hidden fields.

👉 **Auto-numbered bibs.** <code>{"action":"position"}</code> numbers each member.

👉 **Formatted registration fee.** The fee shows grouped digits and two decimal
places, while export keeps it as a number. On mobile, the field opens a decimal
keypad.

👉 **Type-specific values.** Age exports as a number. Empty Number and Radio
fields may export <code>null</code>; text and native select values can be empty
strings. The Color field has an authored default value.

👉 **Hotkeys.** Hold <code>Ctrl</code> — <code>+</code> adds a member, <code>-</code> removes, <code>*</code> duplicates, <code>Delete</code> clears empty slots.

> See <a href="{{ "/component_reference/form" | relative_url }}">Form Nesting</a>,
> <a href="{{ "/component_reference/list" | relative_url }}">List Types</a>,
> <a href="{{ "/guides/value_coercion" | relative_url }}">Value Coercion</a>.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% capture demoValue -%}
{"members":[{"name":"Alice Johnson","age":34,"fee":45.5,"sex":"F","emergency_name":"Bob Johnson","emergency_phone":"555-1234","tshirt":"M","tshirt_color":"#3498db","meal":"Vegetarian"}]}
{%- endcapture %}

{% raw %}<!-- race_js {{{ -->{% endraw %}
{% capture race_js -%}
// SmarkForm handles the field values, list actions, and position labels.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- race_tests {{{ -->{% endraw %}
{% capture race_tests -%}
export default async ({ expect, root, readField, page }) => {
    await expect(root).toBeVisible();
    await root.locator('input[name="name"]').first().fill('Alice Johnson');
    await root.locator('input[name="age"]').first().fill('34');
    await root.evaluate(async () => {
        await myForm.find('/members/0/fee').import(1234.5, {set_default: false});
    });

    const before = await readField('/members');
    expect(before[0].age).toBe(34);
    expect(before[0].fee).toBe(1234.5);
    await expect(root.locator('input.fee').first()).toHaveValue('1 234.50');

    await root.locator('button[title="Duplicate this member"]').click();
    const duplicated = await readField('/members');
    expect(duplicated).toHaveLength(2);
    expect(duplicated[1]).toMatchObject(duplicated[0]);

    await root.locator('li').nth(1).locator('button[title="Remove this member"]').click();
    await expect(root.locator('li')).toHaveCount(1);
    const lastMember = root.locator('li').first();
    const clearLastMember = lastMember.locator('button[title="Remove this member"]');
    await expect(clearLastMember).toBeEnabled();
    await clearLastMember.click();
    await expect(root.locator('li')).toHaveCount(1);
    await expect(lastMember.locator('input[name="name"]')).toHaveValue('');
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
  <button class="feature-summary"><code>min_items</code> / <code>max_items</code> / <code>export_empties</code> and clear-at-minimum</button>
  <div class="feature-desc">
  The default minimum keeps one member row, <code>max_items:5</code> caps the
  list, and <code>export_empties:false</code> omits wholly empty members. When
  only one member remains, <code>failback:"clear"</code> clears that row rather
  than removing it.

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

<div class="feature">
  <button class="feature-summary">Formatted fee and numeric export</button>
  <div class="feature-desc">
  The IMask Number factory groups digits and displays two decimal places. Its
  <code>unmaskedValue</code> getter exports a number; for example,
  <code>1234.5</code> displays as <code>1 234.50</code>. On mobile, the field
  requests a decimal keypad.

  See <a href="{{ "/guides/field_masking" | relative_url }}">Field Masking</a>,
  <a href="{{ "/component_reference/number" | relative_url }}">Number Type</a>,
  and <a href="{{ "/component_reference/input" | relative_url }}">Input Type</a>.
  </div>
</div>

</div>

---

## Hotel Schedule by Period

Set hotel opening hours for date-based periods. Name each period, choose
its date range, then set hours for each service. Open a period to edit its
schedule; remove all a service's intervals to mark it closed for that period.

{% raw %}<!-- hotel_schedule_html {{{ -->{% endraw %}
{% capture hotel_schedule_html -%}
<div id="myForm$$">
  <div class="hotel-planner">
    <ul data-smark='{"type":"list","name":"periods","of":"form","min_items":0,"max_items":6,"sortable":true}'>
      <li data-smark-role="empty_list" class="no-periods">No periods yet. Add an operating period to get started.</li>
      <li>
        <details class="period-card" open>
          <summary>
            <span class="period-count"><span data-smark='{"action":"position"}'>1</span><span aria-hidden="true"> of </span><span data-smark='{"action":"count"}'>2</span></span>
            <span data-smark='{"type":"label"}' class="period-handle" title="Drag to reorder periods">⠿</span>
            <input data-smark type="text" name="name" class="period-name" placeholder="Period name">
            <label class="period-summary-date">From <input data-smark type="date" name="start_date"></label>
            <label class="period-summary-date">To <input data-smark type="date" name="end_date"></label>
            <button data-smark='{"action":"removeItem"}' type="button" title="Remove period">🗑️</button>
          </summary>
          <div class="period-content">
            <div class="service-grid">
              <div data-smark='{"type":"#hotelService","name":"reception"}'>
                <span data-for="serviceLabel">🛎️ Reception</span>
              </div>
              <div data-smark='{"type":"#hotelService","name":"restaurant"}'>
                <span data-for="serviceLabel">🍽️ Restaurant</span>
              </div>
              <div data-smark='{"type":"#hotelService","name":"bar"}'>
                <span data-for="serviceLabel">🍸 Bar</span>
              </div>
              <div data-smark='{"type":"#hotelService","name":"pool"}'>
                <span data-for="serviceLabel">🏊 Pool</span>
              </div>
            </div>
            <div class="period-actions">
              <button data-smark='{"action":"addItem","source":".-1"}' type="button" title="Duplicate this period">✨ Duplicate period</button>
            </div>
          </div>
        </details>
      </li>
    </ul>
    <button data-smark='{"action":"addItem","context":"periods"}' type="button">➕ Add period</button>
  </div>
</div>

<template id="hotelService">
  <section class="hotel-service" data-smark='{"type":"list","min_items":0,"max_items":3}'>
    <div data-smark='{"role":"header"}' class="service-heading">
      <strong id="serviceLabel">Service</strong>
      <span>OPENING HOURS</span>
    </div>
    <div data-smark='{"role":"empty_list"}' class="service-closed">Closed this period</div>
    <div class="hours-row">
      <label>Opens <input data-smark type="time" name="start"></label>
      <label>Closes <input data-smark type="time" name="end"></label>
      <button data-smark='{"action":"removeItem"}' type="button" title="Remove interval">➖</button>
    </div>
    <div data-smark='{"role":"footer"}' class="service-footer">
      <button data-smark='{"action":"addItem"}' type="button">➕ Add hours</button>
    </div>
  </section>
</template>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- hotel_schedule_css {{{ -->{% endraw %}
{% capture hotel_schedule_css -%}
{{""}}#myForm$$ .hotel-planner { width: 100%; max-width: 100%; min-width: 0; box-sizing: border-box; }
{{""}}#myForm$$ .hotel-planner ul { list-style: none; margin: 0; padding: 0; }
{{""}}#myForm$$ .hotel-planner > ul { display: grid; width: 100%; min-width: 0; box-sizing: border-box; gap: .75rem; }
{{""}}#myForm$$ .hotel-planner > ul > li { min-width: 0; }
{{""}}#myForm$$ .no-periods { padding: 1.25rem; text-align: center; color: #64748b; border: 1px dashed #94a3b8; border-radius: .75rem; }
{{""}}#myForm$$ .period-card { width: 100%; min-width: 0; box-sizing: border-box; overflow: hidden; border: 1px solid #cbd5e1; border-radius: .9rem; background: linear-gradient(135deg, #fff, #f4f7fb); box-shadow: 0 3px 12px rgba(15, 23, 42, .08); }
{{""}}#myForm$$ .period-card > summary { display: flex; width: 100%; min-width: 0; box-sizing: border-box; flex-wrap: nowrap; align-items: center; gap: .5rem; padding: .75rem 1rem; background: linear-gradient(100deg, #e0e7ff, #ecfeff); cursor: pointer; white-space: nowrap; overflow: hidden; }
{{""}}#myForm$$ .period-handle { cursor: grab; color: #475569; user-select: none; }
{{""}}#myForm$$ .period-count { flex: 0 0 auto; color: #4338ca; font-size: .8rem; font-weight: 700; }
{{""}}#myForm$$ .period-name { flex: 1 1 10rem; min-width: 7rem; font-size: 1.05rem; font-weight: 700; text-align: left; }
{{""}}#myForm$$ .period-summary-date { flex: 0 1 10rem; min-width: 0; display: flex; align-items: center; gap: .25rem; font-size: .75rem; font-weight: 600; overflow: hidden; }
{{""}}#myForm$$ .period-summary-date input { box-sizing: border-box; width: 100%; min-width: 0; }
{{""}}#myForm$$ .period-card > summary > button { flex: 0 0 auto; margin-left: auto; }
{{""}}#myForm$$ .period-content { padding: .85rem; }
{{""}}#myForm$$ .service-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .75rem; }
{{""}}#myForm$$ .hotel-service { min-width: 0; padding: .7rem; border: 1px solid #dbe3ed; border-radius: .7rem; background: rgba(255, 255, 255, .82); }
{{""}}#myForm$$ .service-heading { display: flex; justify-content: space-between; align-items: baseline; gap: .5rem; padding-bottom: .45rem; border-bottom: 1px solid #e2e8f0; }
{{""}}#myForm$$ .service-heading strong { color: #334155; }
{{""}}#myForm$$ .service-heading span { color: #64748b; font-size: .65rem; font-weight: 700; letter-spacing: .08em; }
{{""}}#myForm$$ .service-closed { padding: .7rem .25rem; color: #64748b; font-style: italic; text-align: center; }
{{""}}#myForm$$ .hours-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto; align-items: end; gap: .4rem; padding: .45rem 0; border-bottom: 1px solid #eef2f7; }
{{""}}#myForm$$ .hours-row label { display: grid; gap: .2rem; font-size: .75rem; }
{{""}}#myForm$$ .hours-row input { box-sizing: border-box; width: 100%; min-width: 0; }
{{""}}#myForm$$ .hours-row button { padding: .25rem .45rem; }
{{""}}#myForm$$ .service-footer { padding-top: .5rem; }
{{""}}#myForm$$ .service-footer button { width: 100%; padding: .35rem; }
{{""}}#myForm$$ .period-actions { display: flex; justify-content: flex-end; padding-top: .75rem; }
{{""}}@media (max-width: 36rem) {
{{""}}  #myForm$$ .service-grid { grid-template-columns: 1fr; }
{{""}}  #myForm$$ .period-card > summary { gap: .25rem; padding: .5rem .4rem; }
{{""}}  #myForm$$ .period-count { font-size: .65rem; }
{{""}}  #myForm$$ .period-name { flex: 1 1 3rem; min-width: 2.8rem; font-size: .75rem; }
{{""}}  #myForm$$ .period-summary-date { flex: 0 1 4.2rem; min-width: 0; gap: .1rem; font-size: .55rem; overflow: hidden; }
{{""}}  #myForm$$ .period-summary-date input { font-size: .55rem; padding: .1rem; }
{{""}}  #myForm$$ .period-handle { font-size: .8rem; }
{{""}}  #myForm$$ .period-card > summary > button { padding: .2rem .3rem; }
{{""}}}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- hotel_schedule_notes {{{ -->{% endraw %}
{% capture hotel_schedule_notes -%}
Open a period to edit its dates and service hours. Add split shifts where a
service closes during the day; remove all intervals to mark it closed. Drag the
⠿ handle to reorder periods, or choose **✨ Duplicate period** to copy the
preceding period and adjust only what differs.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- hotel_schedule_demoValue {{{ -->{% endraw %}
{% capture hotel_schedule_demoValue -%}
{
  "periods": [
    {
      "name": "Peak",
      "start_date": "2026-04-01",
      "end_date": "2026-09-30",
      "reception": [{"start": "07:00:00", "end": "23:00:00"}],
      "restaurant": [
        {"start": "07:00:00", "end": "10:30:00"},
        {"start": "19:00:00", "end": "22:30:00"}
      ],
      "bar": [{"start": "10:00:00", "end": "23:00:00"}],
      "pool": [{"start": "08:00:00", "end": "21:00:00"}]
    },
    {
      "name": "Off-peak",
      "start_date": "2026-10-01",
      "end_date": "2027-03-31",
      "reception": [{"start": "08:00:00", "end": "22:00:00"}],
      "restaurant": [
        {"start": "07:30:00", "end": "10:00:00"},
        {"start": "18:00:00", "end": "21:00:00"}
      ],
      "bar": [],
      "pool": []
    }
  ]
}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- hotel_schedule_tests {{{ -->{% endraw %}
{% capture hotel_schedule_tests -%}
export default async ({ expect, root, readField, writeField }) => {
    await expect(root).toBeVisible();
    await writeField('/periods', [
        {
            name: 'Peak', start_date: '2026-04-01', end_date: '2026-09-30',
            reception: [{start: '07:00:00', end: '23:00:00'}],
            restaurant: [{start: '07:00:00', end: '10:30:00'}, {start: '19:00:00', end: '22:30:00'}],
            bar: [{start: '10:00:00', end: '23:00:00'}],
            pool: [{start: '08:00:00', end: '21:00:00'}],
        },
        {
            name: 'Off-peak', start_date: '2026-10-01', end_date: '2027-03-31',
            reception: [{start: '08:00:00', end: '22:00:00'}],
            restaurant: [{start: '07:30:00', end: '10:00:00'}, {start: '18:00:00', end: '21:00:00'}],
            bar: [], pool: [],
        },
    ]);
    expect(await readField('/periods/0/restaurant')).toHaveLength(2);
    expect(await readField('/periods/1/pool')).toEqual([]);

    const firstPeriod = root.locator('.period-card').first();
    await expect(firstPeriod.locator('.period-count')).toContainText('1 of 2');
    await firstPeriod.evaluate(details => { details.open = false; });
    await expect(firstPeriod.locator('summary input[name="start_date"]')).toBeVisible();
    await expect(firstPeriod.locator('summary input[name="end_date"]')).toBeVisible();

    await root.locator('.period-card').nth(1).locator('button[title="Duplicate this period"]').click();
    expect(await readField('/periods')).toHaveLength(3);
    expect(await readField('/periods/2/name')).toBe('Off-peak');
    expect(await readField('/periods/2/restaurant')).toHaveLength(2);

    await root.getByRole('button', {name: '➕ Add period'}).click();
    await root.locator('.period-name').last().fill('Spring');
    expect(await readField('/periods/3/name')).toBe('Spring');
};
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="hotel-schedule"
    htmlSource=hotel_schedule_html
    cssSource=hotel_schedule_css
    notes=hotel_schedule_notes
    demoValue=hotel_schedule_demoValue
    selected="preview"
    showEditor=true
    tests=hotel_schedule_tests
    minHeight=70
%}

### Features demonstrated

<div class="feature-index">

<div class="feature">
  <button class="feature-summary">Date-based periods</button>
  <div class="feature-desc">
  Each period has its own name, date range, and service hours. Fold a period
  while keeping its name and dates visible in the summary.

  See <a href="{{ "/component_reference/list" | relative_url }}">List Type</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Split opening hours</button>
  <div class="feature-desc">
  Add several intervals for a service to represent breaks, such as a restaurant
  that closes between breakfast and dinner.

  See <a href="{{ "/component_reference/list" | relative_url }}">List Type</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Closed services</button>
  <div class="feature-desc">
  Remove all intervals for a service to mark it closed during that period. The
  service remains visible and can be reopened by adding hours.

  See <a href="{{ "/component_reference/list" | relative_url }}">List Type</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Duplicate a period</button>
  <div class="feature-desc">
  Choose <strong>✨ Duplicate period</strong> to copy the preceding period, then
  change just its dates or service hours.

  See <a href="{{ "/component_reference/list" | relative_url }}#async-additem-action">List Type — addItem</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Reorder periods</button>
  <div class="feature-desc">
  Drag the ⠿ handle to rearrange periods. Each period keeps its own service
  schedules when you move it.

  See <a href="{{ "/component_reference/list" | relative_url }}#sortable">List Type — sortable</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Reusable service schedules</button>
  <div class="feature-desc">
  Reception, restaurant, bar, and pool use the same schedule layout, but each
  keeps independent hours for every period.

  See <a href="{{ "/guides/mixin_types" | relative_url }}">Mixin Types</a>.
  </div>
</div>

</div>

<script src="{{ "/assets/js/showcase-features.js" | relative_url }}"></script>

---

{: .hint }
> **Want the full feature set?** Each example above demonstrates a curated
> subset of SmarkForm capabilities.  See the individual reference pages for
> the complete API and advanced patterns.

---

## Calculators

These compact calculators show two ways to build an interactive tool: one responds to keypad buttons, while the other also accepts keyboard input.

The JSON playground is unavailable in both examples because their Import actions process calculator input rather than replacing the display from JSON.

### Simple Calculator

This example leverages the **singleton pattern** to avoid specifying the
context for every button. A single import handler intercepts each button
press and updates the display field.

A single event handler on `BeforeAction_import` does all the work: it reads
the current value, appends or evaluates the new input, and updates the
display.  You can use the calculator buttons or type directly — every button
click brings focus back to the input field.

Evaluation uses a small arithmetic parser limited to numbers, parentheses,
and the four basic operators; invalid expressions display `Error`.
Hold `Ctrl` to reveal the keyboard shortcuts on the calculator buttons.

{% raw %} <!-- calculator {{{ --> {% endraw %}
{% capture calculator -%}
<div id="myForm$$">
    <div class="calculator" data-smark='{"type": "input", "name": "display"}'>
        <input data-smark type="text" class="display" value="0" pattern="[0-9+\*\/\(\)\.\-]+">
        <div class="buttons">
            <button data-smark='{"action": "import", "data": "C", "hotkey": "c"}' class="clear">C</button>
            <button data-smark='{"action": "import", "data": "("}'>(</button>
            <button data-smark='{"action": "import", "data": ")"}'>)</button>
            <button data-smark='{"action": "import", "data": "/", "hotkey": "/"}' class="operator">÷</button>
            <button data-smark='{"action": "import", "data": "7"}'>7</button>
            <button data-smark='{"action": "import", "data": "8"}'>8</button>
            <button data-smark='{"action": "import", "data": "9"}'>9</button>
            <button data-smark='{"action": "import", "data": "*", "hotkey": "*"}' class="operator">×</button>
            <button data-smark='{"action": "import", "data": "4"}'>4</button>
            <button data-smark='{"action": "import", "data": "5"}'>5</button>
            <button data-smark='{"action": "import", "data": "6"}'>6</button>
            <button data-smark='{"action": "import", "data": "-", "hotkey": "-"}' class="operator">-</button>
            <button data-smark='{"action": "import", "data": "1"}'>1</button>
            <button data-smark='{"action": "import", "data": "2"}'>2</button>
            <button data-smark='{"action": "import", "data": "3"}'>3</button>
            <button data-smark='{"action": "import", "data": "+", "hotkey": "+"}' class="operator">+</button>
            <button data-smark='{"action": "import", "data": "0"}'>0</button>
            <button data-smark='{"action": "import", "data": "."}'>.</button>
            <button data-smark='{"action": "import", "data": "Del"}'>←</button>
            <button data-smark='{"action": "import", "data": "=", "hotkey": "Enter"}' class="equals">=</button>
        </div>
    </div>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- calculator_css {{{ --> {% endraw %}
{% capture calculator_css -%}
{{""}}#myForm$$ .calculator { background-color: #333; border-radius: 10px; padding: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); width: 300px; }
{{""}}#myForm$$ .display { width: 100%; box-sizing: border-box; background: #fff; border: 1px solid #ccc; border-radius: 5px; padding: 10px; margin-bottom: 10px; font-size: 24px; text-align: right; }
{{""}}#myForm$$ .display:invalid { background-color: #fcc; }
{{""}}#myForm$$ .buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; }
{{""}}#myForm$$ button { padding: 15px; font-size: 18px; border: none; border-radius: 5px; cursor: pointer; background-color: #555; color: white; }
{{""}}#myForm$$ button:hover { background-color: #777; }
{{""}}#myForm$$ .operator { background-color: #f9a825; }
{{""}}#myForm$$ .operator:hover { background-color: #ffb300; }
{{""}}#myForm$$ .equals { background-color: #4caf50; }
{{""}}#myForm$$ .equals:hover { background-color: #66bb6a; }
{{""}}#myForm$$ .clear { background-color: #d32f2f; }
{{""}}#myForm$$ .clear:hover { background-color: #ef5350; }
{{""}}#myForm$$ button { position: relative; }
{{""}}#myForm$$ [data-hotkey]::after {
    content: "Ctrl+" attr(data-hotkey);
    position: absolute; top: 0.75em; left: 0;
    font-size: 0.7em; background: #333; color: #fff;
    padding: 1px 4px; border-radius: 3px; white-space: nowrap;
}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %}<!-- arithmetic_parser_js {{{ -->{% endraw %}
{% capture arithmetic_parser_js -%}
function evaluateArithmetic(source) {
    const expression = String(source).trim();
    const tokenPattern = /\s*([0-9]+(?:\.[0-9]*)?|\.[0-9]+|[()+\-*\/])/y;
    const tokens = [];
    let cursor = 0;
    while (cursor < expression.length) {
        tokenPattern.lastIndex = cursor;
        const match = tokenPattern.exec(expression);
        if (!match) throw new Error('Invalid expression');
        tokens.push(match[1]);
        cursor = tokenPattern.lastIndex;
    }

    let index = 0;
    const primary = () => {
        const token = tokens[index++];
        if (token === '+') return primary();
        if (token === '-') return -primary();
        if (token === '(') {
            const value = additive();
            if (tokens[index++] !== ')') throw new Error('Missing )');
            return value;
        }
        if (token == null || Number.isNaN(Number(token))) throw new Error('Expected a number');
        return Number(token);
    };
    const multiplicative = () => {
        let value = primary();
        while (tokens[index] === '*' || tokens[index] === '/') {
            const operator = tokens[index++];
            const next = primary();
            value = operator === '*' ? value * next : value / next;
        }
        return value;
    };
    const additive = () => {
        let value = multiplicative();
        while (tokens[index] === '+' || tokens[index] === '-') {
            const operator = tokens[index++];
            const next = multiplicative();
            value = operator === '+' ? value + next : value - next;
        }
        return value;
    };

    const result = additive();
    if (index !== tokens.length || !Number.isFinite(result)) {
        throw new Error('Invalid expression');
    }
    return String(result);
}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- calculator_js {{{ -->{% endraw %}
{% capture calculator_js -%}
{{ arithmetic_parser_js }}

myForm.on("BeforeAction_import", async (ev) => {
    const prevValue = await ev.context.export();
    const key = ev.data;
    switch (key) {
        case "C": ev.data = "0"; break;
        case "Del": ev.data = prevValue.slice(0, -1) || "0"; break;
        case "=":
            try { ev.data = evaluateArithmetic(prevValue); }
            catch { ev.data = "Error"; }
            break;
        default:
            if (prevValue.trim() === "0") ev.data = key;
            else ev.data = prevValue + key;
    }
});
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="calculator"
    htmlSource=calculator
    jsSource=calculator_js
    cssSource=calculator_css
    selected="preview"
    showEditor=false
    tests=false
%}

> The event handler uses `on()` to scope calculator behavior to the display.
> See [Events]({{ "/guides/events" | relative_url }}) for more about event scoping.

### Keyboard Calculator

This variation accepts keyboard input as well as button clicks. Its arithmetic
parser is limited to numbers, parentheses, and `+`, `-`, `*`, `/`; it does not
evaluate arbitrary JavaScript or intercept keys outside the display field.

{% raw %}<!-- supercalculator_html {{{ -->{% endraw %}
{% capture supercalculator -%}
<div id="myForm$$">
  <div class="calculator" data-smark='{"type":"input","name":"display"}'>
    <input data-smark type="text" class="display" value="0" pattern="[0-9+\*\/\(\)\.\-]+">
    <div class="buttons">
      <button data-smark='{"action":"import","data":"C"}' class="clear">C</button>
      <button data-smark='{"action":"import","data":"("}'>(</button>
      <button data-smark='{"action":"import","data":")"}'>)</button>
      <button data-smark='{"action":"import","data":"/"}' class="operator">÷</button>
      <button data-smark='{"action":"import","data":"7"}'>7</button>
      <button data-smark='{"action":"import","data":"8"}'>8</button>
      <button data-smark='{"action":"import","data":"9"}'>9</button>
      <button data-smark='{"action":"import","data":"*"}' class="operator">×</button>
      <button data-smark='{"action":"import","data":"4"}'>4</button>
      <button data-smark='{"action":"import","data":"5"}'>5</button>
      <button data-smark='{"action":"import","data":"6"}'>6</button>
      <button data-smark='{"action":"import","data":"-"}' class="operator">−</button>
      <button data-smark='{"action":"import","data":"1"}'>1</button>
      <button data-smark='{"action":"import","data":"2"}'>2</button>
      <button data-smark='{"action":"import","data":"3"}'>3</button>
      <button data-smark='{"action":"import","data":"+"}' class="operator">+</button>
      <button data-smark='{"action":"import","data":"0"}'>0</button>
      <button data-smark='{"action":"import","data":"."}'>.</button>
      <button data-smark='{"action":"import","data":"Backspace"}'>←</button>
      <button data-smark='{"action":"import","data":"="}' class="equals">=</button>
    </div>
  </div>
</div>{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- supercalculator_js {{{ -->{% endraw %}
{% capture supercalculator_js -%}
{{ arithmetic_parser_js }}

function updateDisplay(previous, key) {
    if (key === 'C' || key === 'Delete') return '0';
    if (key === 'Backspace') return previous.slice(0, -1) || '0';
    if (key === '=' || key === 'Enter') {
        try { return evaluateArithmetic(previous); }
        catch { return 'Error'; }
    }
    if (!/^[0-9.+\-*\/()]$/.test(key)) return previous;
    if (previous === 'Error') previous = '0';
    if (previous === '0' && /^[0-9]$/.test(key)) return key;
    return previous + key;
}

myForm.on('BeforeAction_import', async (event) => {
    event.data = updateDisplay(await event.context.export(), event.data);
});

myForm.rendered.then(() => {
    const displayNode = myForm.targetNode.querySelector('input.display');
    const field = myForm.getComponent(displayNode);
    let keyQueue = Promise.resolve();
    // Window capture runs before SmarkForm's document-level Enter navigation
    // listener, so the calculator can consume Enter instead of being preempted.
    window.addEventListener('keydown', (event) => {
        if (event.target !== field.targetFieldNode) return;
        if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
        const key = event.key;
        if (
            key !== 'Enter' && key !== 'Backspace' && key !== 'Delete'
            && !/^[0-9.+\-*\/()]$/.test(key)
        ) return;
        event.preventDefault();
        keyQueue = keyQueue.then(async () => {
            await field.import(
                updateDisplay(await field.export(), key),
                {set_default: false}
            );
        }).catch((error) => console.error('Calculator key handling failed:', error));
    }, true);
});
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- supercalculator_css {{{ -->{% endraw %}
{% capture supercalculator_css -%}
{{ calculator_css }}
{{""}}#myForm$$ .calculator input.display { caret-color: transparent; }
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- supercalculator_notes {{{ -->{% endraw %}
{% capture supercalculator_notes -%}
👉 Use the buttons or type directly in the display. Keyboard handling is limited
to the display and arithmetic keys; unrelated keys keep their normal behavior.

👉 The parser evaluates only arithmetic tokens and parentheses. It does not use
`eval` or execute arbitrary input.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- supercalculator_tests {{{ -->{% endraw %}
{% capture supercalculator_tests -%}
export default async ({ page, expect, root, readField }) => {
    await expect(root).toBeVisible();
    const display = root.locator('input.display');
    await display.focus();
    await page.keyboard.type('123+45');
    await expect.poll(() => readField('display')).toBe('123+45');
    await page.keyboard.press('Enter');
    await expect.poll(() => readField('display')).toBe('168');
};
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="supercalculator"
    htmlSource=supercalculator
    jsSource=supercalculator_js
    cssSource=supercalculator_css
    notes=supercalculator_notes
    selected="preview"
    showEditor=false
    tests=supercalculator_tests
%}
