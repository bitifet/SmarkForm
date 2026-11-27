---
layout: chapter
permalink: "/showcase_examples/showcase"
nav_order: 2
redirect_from:
  - "/about/showcase2"
  - "/about/showcase"
title: "Showcase"
description: "Explore interactive SmarkForm examples including a Kanban board, race registration, and hotel schedules."
preload_dragdroptouch: true
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
      width: 1.3em;
      height: 1.3em;
      font-size: 1.2em;
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

For an example applying SmarkForm beyond forms, see [Beyond Forms]({{ "/guides/beyond_forms" | relative_url }}).

{: .info :}
> Some of the examples in this page may feel unrealistic or contrived.  They are designed to demonstrate SmarkForm features, not to be production-ready applications.
>
> Each preview also includes a JSON playground editor with Export, Import, Reset,
> and Clear controls. The editor is a documentation tool, not a SmarkForm feature;
> see [Preview and the JSON playground]({{ "/showcase_examples/playground" | relative_url }}#preview-and-the-json-playground)
> for how to use it.

---

## Just a Form

Edit a personal profile, add a photo, and attach an optional PDF résumé. Fields
auto-register from HTML attributes — no JavaScript beyond initialization. Try
editing values in the preview or exporting to JSON.

{% raw %}<!-- just_form_photo_placeholder {{{ -->{% endraw %}
{% capture just_form_photo_placeholder -%}
data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NiIgaGVpZ2h0PSI5NiIgdmlld0JveD0iMCAwIDk2IDk2Ij48cmVjdCB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHJ4PSI0OCIgZmlsbD0iI2U4ZWRmNCIvPjxjaXJjbGUgY3g9IjQ4IiBjeT0iMzQiIHI9IjE3IiBmaWxsPSIjODc5NGE1Ii8+PHBhdGggZD0iTTE0IDkwYzItMjAgMTUtMzIgMzQtMzJzMzIgMTIgMzQgMzIiIGZpbGw9IiM4Nzk0YTUiLz48L3N2Zz4=
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %} <!-- just_form_example {{{ --> {% endraw %}
{% capture just_form_example -%}
<div id="myForm$$">
  <div class="profile-form">
    <div class="profile-fields">
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
        <label data-smark>Profile color:</label>
        <span data-smark='{"name":"colour","type":"color"}'>
          <input data-smark>
          <button data-smark='{"action":"clear"}' title="Clear profile color">❌</button>
        </span>
      </p>
    </div>
    <div class="media-field profile-photo-field">
      <label data-smark="label">Profile photo:</label>
      <img
        data-smark='{"type":"image","name":"photo","placeholder":"{{ just_form_photo_placeholder }}"}'
        class="profile-photo"
        width="96" height="96"
        alt="Profile photo"
      >
    </div>
    <div class="media-field resume-field">
      <label data-smark="label">Résumé (PDF):</label>
      <input
        type="file"
        data-smark='{"type":"file","name":"cv","accept":"application/pdf"}'
        placeholder="Choose or drop a PDF résumé"
      >
    </div>
  </div>
</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %}<!-- just_form_css {{{ -->{% endraw %}
{% capture just_form_css -%}
{{""}}/* Keep the profile fields, photo, and résumé in a compact two-column card. */
{{""}}#myForm$$ .profile-form {
{{""}}  display: grid;
{{""}}  grid-template-columns: minmax(0, 1fr) 7rem;
{{""}}  grid-template-areas: "fields photo" "resume resume";
{{""}}  align-items: start;
{{""}}  gap: .35rem 1rem;
{{""}}}
{{""}}#myForm$$ .profile-fields { grid-area: fields; min-width: 0; }
{{""}}#myForm$$ .profile-fields p {
{{""}}  display: grid;
{{""}}  grid-template-columns: 7.5rem minmax(0, 1fr);
{{""}}  align-items: center;
{{""}}  gap: .45rem;
{{""}}  margin: 0 0 .4rem;
{{""}}}
{{""}}#myForm$$ .profile-fields p > span {
{{""}}  display: flex;
{{""}}  align-items: center;
{{""}}  gap: .25rem;
{{""}}  min-width: 0;
{{""}}}
{{""}}#myForm$$ .profile-fields p > span input { flex: 1; min-width: 0; }

{{""}}/* Reserve the photo and résumé areas without forcing either field to overflow. */
{{""}}#myForm$$ .media-field { display: grid; gap: .35rem; min-width: 0; }
{{""}}#myForm$$ .profile-photo-field { grid-area: photo; justify-items: center; }
{{""}}#myForm$$ .profile-photo {
{{""}}  display: block;
{{""}}  width: 96px;
{{""}}  height: 96px;
{{""}}  max-width: 100%;
{{""}}  box-sizing: border-box;
{{""}}  border: 1px solid #cbd5e1;
{{""}}  border-radius: 50%;
{{""}}  background: #e8edf4;
{{""}}  object-fit: cover;
{{""}}}
{{""}}#myForm$$ .resume-field { grid-area: resume; }
{{""}}#myForm$$ .resume-field input { width: 100%; min-width: 0; box-sizing: border-box; }

{{""}}@media (max-width: 28rem) {
{{""}}  #myForm$$ .profile-form {
{{""}}    grid-template-columns: minmax(0, 1fr) 6.5rem;
{{""}}    column-gap: .5rem;
{{""}}  }
{{""}}  #myForm$$ .profile-fields p {
{{""}}    grid-template-columns: 5rem minmax(0, 1fr);
{{""}}    gap: .25rem;
{{""}}  }
{{""}}}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %} <!-- just_form_notes {{{ --> {% endraw %}
{% capture just_form_notes -%}
👉 Fields auto-register from <code>data-smark</code> attributes — no per-field JavaScript.

👉 **Singleton pattern.** The profile color field uses a <code>&lt;span data-smark&gt;</code> wrapper
with the <code>name</code> option, while the inner input carries the bare <code>data-smark</code>
attribute.  The ❌ button inside the singleton resolves its target implicitly.

👉 **Label auto-linking.** A <code>&lt;label <strong>data-smark</strong>&gt;</code> finds the next
field in component-tree order — no <code>for</code> or <code>id</code> attributes needed here.

👉 **Type-specific values.** The profile color field exports <code>null</code> when it has no
selection, while empty text fields export <code>""</code> and Age exports a number.
Try the ❌ button to see its nullable state.

👉 **Media fields.** No photo or résumé is preloaded. The profile picture shows
the custom silhouette placeholder; choose a photo or PDF to fill either field.
Both values are <code>null</code> until you add a file.

> See <a href="{{ "/component_reference/image" | relative_url }}">Image</a> and
> <a href="{{ "/component_reference/file" | relative_url }}">File</a> for media
> field options, or check the **✏️ Edit** tab to see the full source.
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{"name":"Alice","surname":"Johnson","age":28,"colour":"#6366f1","photo":null,"cv":null}
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

    await expect(root.locator('.profile-photo'))
        .toHaveAttribute('src', /^data:image\/svg\+xml;base64,/);
    await expect.poll(
        () => root.locator('.profile-photo').evaluate(img => img.naturalWidth)
    ).toBe(96);
    const photoPlacement = await root.evaluate(root => {
        const photo = root.querySelector('.profile-photo').getBoundingClientRect();
        const fields = root.querySelector('.profile-fields').getBoundingClientRect();
        return {
            photoLeft: photo.left,
            photoRight: photo.right,
            photoTop: photo.top,
            fieldsLeft: fields.left,
            fieldsRight: fields.right,
            fieldsBottom: fields.bottom,
        };
    });
    expect(photoPlacement.photoLeft).toBeGreaterThan(photoPlacement.fieldsLeft);
    expect(photoPlacement.photoRight).toBeGreaterThan(photoPlacement.fieldsRight);
    expect(photoPlacement.photoTop).toBeLessThan(photoPlacement.fieldsBottom);
    expect(await readField('photo')).toBeNull();
    expect(await readField('cv')).toBeNull();

    expect(await readField('name')).toBe('Alice');
    expect(await readField('age')).toBe(28);
    expect(await readField('colour')).toBe('#6366f1');

    await root.locator('button[title="Clear profile color"]').click();
    expect(await readField('colour')).toBeNull();
};
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="just_form"
    htmlSource=just_form_example
    cssSource=just_form_css
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
  <button class="feature-summary">Specialized field types</button>
  <div class="feature-desc">
  SmarkForm provides specialized field types for common data. Here, Age exports
  as a number and Profile color as a color value or <code>null</code>; empty text
  fields remain strings.

  See <a href="{{ "/component_reference/overview" | relative_url }}">Component Types Overview</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Auto-registration</button>
  <div class="feature-desc">
  SmarkForm discovers marked components from <code>data-smark</code> and infers
  common types from their elements. Named data fields take their key from the
  HTML <code>name</code> attribute or a SmarkForm <code>name</code> option; labels
  and triggers are components too, but do not add data fields.

  See <a href="{{ "/start_here/core_concepts" | relative_url }}">Core Concepts</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Singleton pattern</button>
  <div class="feature-desc">
  The profile color field wraps the actual input in a <code>&lt;span data-smark='{"name":"colour","type":"color"}'&gt;</code>
  that holds the component options, while the inner <code>&lt;input data-smark&gt;</code> carries the
  bare attribute.  This allows buttons and other elements to share the same
  field context without repeating the options.

  See <a href="{{ "/guides/the_singleton_pattern" | relative_url }}">Singleton Pattern</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Accessibility: Label auto-linking</button>
  <div class="feature-desc">
  A <code>&lt;label <strong>data-smark</strong>&gt;</code> is automatically associated by SmarkForm with
  its adjacent field — no <code>for</code> or <code>id</code> attributes needed.  The label
  next to the profile color field is enhanced and linked without any explicit wiring.

  See <a href="{{ "/component_reference/label" | relative_url }}">Label Component Type</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Import and export JSON data</button>
  <div class="feature-desc">
  Fields import and export their values; forms compose named values into objects
  and lists compose items into arrays. Use the <a href="{{ "/showcase_examples/playground" | relative_url }}#preview-and-the-json-playground">playground editor</a>
  to inspect and edit this form's JSON interactively. The editor is a documentation
  tool, not a SmarkForm feature.

  See <a href="{{ "/guides/data_import_and_export" | relative_url }}">Importing and Exporting Data</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Declarative triggers</button>
  <div class="feature-desc">
  Components can declare actions in their SmarkForm options. The ❌ trigger
  inside the profile color field's singleton wrapper runs <code>clear</code> on
  its nearest field, so no explicit <code>target</code> is needed.

  See <a href="{{ "/component_reference/trigger" | relative_url }}">Triggers</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">File fields</button>
  <div class="feature-desc">
  The <code>file</code> type imports and exports complete file contents: a
  self-describing, base64 data URL by default, or a structured object with
  <code>format:"json"</code>. The résumé field here accepts PDFs and remains
  <code>null</code> until a file is selected.

  See <a href="{{ "/component_reference/file" | relative_url }}">File Type</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Specialized media fields</button>
  <div class="feature-desc">
  Dedicated <code>image</code>, <code>audio</code>, and <code>video</code> types
  add media-specific behavior while sharing the file fields' embedded-value
  contract. This form's profile picture is an <code>image</code> field with a
  custom SVG silhouette placeholder; it stays empty until a photo is chosen.

  See <a href="{{ "/component_reference/image" | relative_url }}">Image</a>,
  <a href="{{ "/component_reference/audio" | relative_url }}">Audio</a>, and
  <a href="{{ "/component_reference/video" | relative_url }}">Video</a>.
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
<script type="module">
  import { enableDragDropTouch } from "https://cdn.jsdelivr.net/npm/@dragdroptouch/drag-drop-touch@2.0.3/dist/drag-drop-touch.esm.min.js";
  if (navigator.maxTouchPoints > 0) {
    enableDragDropTouch(document, document, {
      isPressHoldMode: true,
      pressHoldDelayMS: 400,
      pressHoldMargin: 25,
      pressHoldThresholdPixels: 5,
    });
  };
  window.kanbanTouchDragReady = true;
</script>
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
  <p class="hint">💡 Use each task's <kbd>☰</kbd> button as an actions menu or drag handle. Touch users: press and hold it before dragging. Hold <kbd>Ctrl</kbd> to reveal shortcuts.</p>
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
  <div data-smark='{"type":"list","role":"jump-boundary","sortable":true,"min_items":0,"moving_depth":1}' class="kanban-mixin">
    <div data-smark='{"role":"header"}'>
      <strong id="colLabel">Column</strong>
      <button data-smark='{"action":"addItem","hotkey":"+"}' title="Add task">➕</button>
    </div>
    <div data-smark='{"role":"empty_list"}' class="empty">No tasks</div>
    <div class="card">
      <input data-smark type="text" name="title" placeholder="Task title...">
      <div class="card-actions">
        <button type="button" class="card-menu-trigger" data-smark-role="drag-handle" aria-expanded="false" title="Task actions" aria-label="Task actions">☰</button>
        <div class="card-menu" data-card-menu role="group" aria-label="Task actions">
          <button type="button" data-smark='{"action":"addItem","hotkey":"+"}' title="Add a task after this one"><span aria-hidden="true">＋</span> Add After</button>
          <button type="button" data-smark='{"action":"next","depth":1,"hotkey":"]"}' title="Go to the next column"><span aria-hidden="true">→</span> Go Next</button>
          <button type="button" data-smark='{"action":"previous","depth":1,"hotkey":"["}' title="Go to the previous column"><span aria-hidden="true">←</span> Go Previous</button>
          <button type="button" data-smark='{"action":"previous","depth":0,"hotkey":","}' title="Move up one position"><span aria-hidden="true">↑</span> Move Up</button>
          <button type="button" data-smark='{"action":"next","depth":0,"hotkey":"."}' title="Move down one position"><span aria-hidden="true">↓</span> Move Down</button>
          <button type="button" data-smark='{"action":"removeItem","hotkey":"-"}' title="Remove this task"><span aria-hidden="true">➖</span> Remove</button>
        </div>
      </div>
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

/* SmarkForm owns the actions/hotkeys; this only toggles the disclosure. */
{
  const root = myForm.targetNode;

  // Ctrl-revealed hotkeys expose the menu without changing the component's actions.
  const sync = () => {
    for (const actions of root.querySelectorAll(".card-actions")) {
      const expanded = (
        actions.classList.contains("menu-open")
        || !! actions.querySelector("[data-hotkey]")
      );
      actions.querySelector(".card-menu-trigger")
        ?.setAttribute("aria-expanded", String(expanded));
      for (const action of actions.querySelectorAll(".card-menu button[data-smark]")) {
        action.tabIndex = expanded ? 0 : -1;
      };
    };
  };

  // Close only the manual disclosure; Ctrl may still reveal a hotkey menu.
  const close = () => {
    root.querySelectorAll(".card-actions.menu-open")
      .forEach(actions => actions.classList.remove("menu-open"));
    sync();
  };

  root.addEventListener("click", ev => {
    const trigger = ev.target.closest?.(".card-menu-trigger");
    if (trigger && root.contains(trigger)) {
      const actions = trigger.parentElement;
      const opening = actions.classList.toggle("menu-open");
      // Keep at most one manually opened action group in the viewport.
      if (opening) root.querySelectorAll(".card-actions.menu-open")
        .forEach(other => { if (other !== actions) other.classList.remove("menu-open"); });
      sync();
      return;
    };
    if (! ev.target.closest?.(".card-actions.menu-open")) close();
  });
  for (const eventName of ["keydown", "keyup", "focusin", "focusout"]) {
    root.addEventListener(eventName, sync);
  };
  root.addEventListener("keydown", ev => {
    if (ev.key === "Escape") {
      const trigger = root.querySelector(".card-actions.menu-open .card-menu-trigger");
      if (!trigger) return;
      // Escape returns keyboard focus to the disclosure button.
      ev.preventDefault();
      ev.stopPropagation();
      close();
      trigger.focus();
    };
  });
  document.addEventListener("pointerdown", ev => {
    // Pointer interaction outside the form dismisses a manually opened menu.
    if (!root.contains(ev.target)) close();
  });
};
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

    const firstTask = root.locator('.kanban-mixin .card').first();
    const menuTrigger = firstTask.getByRole('button', { name: 'Task actions' });
    const menu = firstTask.locator('[data-card-menu]');

    await menuTrigger.focus();
    await page.keyboard.press('Enter');
    await expect(menuTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menuTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(menuTrigger).toBeFocused();

    await menuTrigger.click();
    await expect(menu).toBeVisible();
    await page.evaluate(() => document.body.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true })
    ));
    await expect(menuTrigger).toHaveAttribute('aria-expanded', 'false');

    const coarsePointer = await page.evaluate(() => matchMedia('(pointer: coarse)').matches);
    if (coarsePointer) {
        // Touch emulation has no physical Ctrl key; the disclosure still works.
        await menuTrigger.click();
        await menu.getByRole('button', { name: /Go Next/ }).click();
    } else {
        /* Ctrl reveals the menu and SmarkForm's configured hotkey performs Go Next. */
        await firstTask.locator('input').focus();
        await page.keyboard.down('Control');
        await expect(menu).toBeVisible();
        await expect(menuTrigger).toHaveAttribute('aria-expanded', 'true');
        await expect(menu.getByRole('button', { name: /Go Next/ })).toHaveAttribute('data-hotkey', ']');
        await page.keyboard.press(']');
        await page.keyboard.up('Control');
    };

    expect(await readField('/todo')).toEqual([{ title: 'Review PR' }]);
    expect(await readField('/progress')).toEqual([
        { title: 'Fix layout' },
        { title: 'Write tests' },
    ]);

    /* A manually opened menu also exposes regular depth-zero action buttons. */
    const progress = root.locator('.column').nth(1);
    const runMenuAction = async (row, actionName) => {
        const trigger = row.getByRole('button', { name: 'Task actions' });
        await trigger.focus();
        await page.keyboard.press('Enter');
        const action = row.locator('[data-card-menu]').getByRole('button', { name: actionName });
        await action.focus();
        await page.keyboard.press('Enter');
    };
    let movedTask = progress.locator('.card').nth(1);
    await runMenuAction(movedTask, /Move Up/);
    expect(await readField('/progress')).toEqual([
        { title: 'Write tests' },
        { title: 'Fix layout' },
    ]);

    /* Go Previous steps back one column and appends to the destination list. */
    movedTask = progress.locator('.card').first();
    await runMenuAction(movedTask, /Go Previous/);
    expect(await readField('/todo')).toEqual([
        { title: 'Review PR' },
        { title: 'Write tests' },
    ]);
    expect(await readField('/progress')).toEqual([{ title: 'Fix layout' }]);

    const todo = root.locator('.column').first();
    let taskToMove = todo.locator('.card').nth(1);
    await runMenuAction(taskToMove, /Move Up/);
    expect(await readField('/todo')).toEqual([
        { title: 'Write tests' },
        { title: 'Review PR' },
    ]);

    /* Move Down restores the order; Remove uses the existing confirmation hook. */
    taskToMove = todo.locator('.card').first();
    await runMenuAction(taskToMove, /Move Down/);
    expect(await readField('/todo')).toEqual([
        { title: 'Review PR' },
        { title: 'Write tests' },
    ]);
    taskToMove = todo.locator('.card').nth(1);
    await taskToMove.getByRole('button', { name: 'Task actions' }).focus();
    await page.keyboard.press('Enter');
    page.once('dialog', dialog => dialog.accept());
    const removeAction = taskToMove.locator('[data-card-menu]').getByRole('button', { name: /Remove/ });
    await removeAction.focus();
    await page.keyboard.press('Enter');
    expect(await readField('/todo')).toEqual([{ title: 'Review PR' }]);

    if (await page.evaluate(() => navigator.maxTouchPoints > 0)) {
        await expect.poll(() => page.evaluate(() => window.kanbanTouchDragReady)).toBe(true);
        await writeField('/todo', [
            { title: 'Touch first' },
            { title: 'Touch second' },
        ]);
        await root.locator('.column').evaluateAll(columns => {
            for (const column of columns) {
                column.style.minWidth = '0';
                column.style.flex = '1 1 0';
            };
        });
        const touchOrder = await page.evaluate(async () => {
            const list = myForm.find('/todo');
            const destination = myForm.find('/progress');
            const source = list.children[0].targetNode;
            const handle = source.querySelector('[data-smark-role="drag-handle"]');
            const target = destination.children[0].targetNode;
            const sourceRect = handle.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            const start = {x: sourceRect.left + 2, y: sourceRect.top + 2};
            const end = {x: targetRect.left + 2, y: targetRect.top + targetRect.height * 0.75};
            const fireTouch = (type, point) => {
                const touch = new Touch({
                    identifier: 1,
                    target: handle,
                    clientX: point.x,
                    clientY: point.y,
                    pageX: point.x + window.scrollX,
                    pageY: point.y + window.scrollY,
                    screenX: point.x,
                    screenY: point.y,
                });
                const active = type === 'touchend' ? [] : [touch];
                handle.dispatchEvent(new TouchEvent(type, {
                    bubbles: true,
                    cancelable: true,
                    touches: active,
                    targetTouches: active,
                    changedTouches: [touch],
                }));
            };

            fireTouch('touchstart', start);
            await new Promise(resolve => setTimeout(resolve, 450));
            fireTouch('touchmove', end);
            fireTouch('touchend', end);
            for (let i = 0; i < 50; i++) {
                const sourceValue = await list.export(null, {silent: true, export_empties: true});
                const destinationValue = await destination.export(null, {silent: true, export_empties: true});
                if (destinationValue.at(-1)?.title === 'Touch first') {
                    return {source: sourceValue, destination: destinationValue};
                };
                await new Promise(resolve => setTimeout(resolve, 20));
            };
            return {
                source: await list.export(null, {silent: true, export_empties: true}),
                destination: await destination.export(null, {silent: true, export_empties: true}),
            };
        });
        expect(touchOrder.source.map(task => task.title)).toEqual(['Touch second']);
        expect(touchOrder.destination.map(task => task.title)).toEqual(['Fix layout', 'Touch first']);
    };

    await page.evaluate(async () => {
        await myForm.find('/done').addItem(
            { title: '' }, { multiple: false, silent: true }
        );
    });
    const done = await page.evaluate(() => myForm.find('/done').children.length);
    expect(done).toBe(2);
    await root.locator('.clear-empties').click();
    expect(await page.evaluate(() => myForm.find('/done').children.length)).toBe(1);

    await writeField('/todo', [
        { title: 'Sketch task one' },
        { title: 'Sketch task two' },
    ]);
    await writeField('/progress', [{title:'Review the release notes'}]);
    await writeField('/done', [{title:'Publish the build'}]);
    const todoTitles = root.locator('.column').first().locator('.card input[name="title"]');
    const progressTitle = root.locator('.column').nth(1).locator('.card input[name="title"]').first();
    await todoTitles.first().focus();
    await page.waitForTimeout(25);
    await page.keyboard.press('Control+Enter');
    await expect(progressTitle).toBeFocused();
    await page.waitForTimeout(25);
    await page.keyboard.press('Control+Shift+Enter');
    await expect(todoTitles.first()).toBeFocused();

    await todoTitles.nth(1).focus();
    await page.waitForTimeout(25);
    await page.keyboard.press('Control+Shift+Enter');
    await expect(todoTitles.nth(1)).toBeFocused(); // Don't fall back inside the first boundary.
    await writeField('/done', [
        {title:'Finished task one'},
        {title:'Finished task two'},
    ]);
    const doneTitles = root.locator('.column').nth(2).locator('.card input[name="title"]');
    await doneTitles.first().focus();
    await page.waitForTimeout(25);
    await page.keyboard.press('Control+Enter');
    await expect(doneTitles.first()).toBeFocused(); // Don't fall back inside the last boundary.

    await writeField('/todo', [
        {title:'First task'},
        {title:'Second task'},
    ]);
    let todoCards = root.locator('.column').first().locator('.card');
    await todoCards.first().getByRole('button', {name:'Task actions'}).click();
    await todoCards.first().locator('.card-menu').getByRole('button', {name:/Add After/}).click();
    await expect(todoCards).toHaveCount(3);
    const todoCardTitles = () => todoCards.locator('input[name="title"]')
        .evaluateAll(inputs => inputs.map(input => input.value));
    expect(await todoCardTitles()).toEqual(['First task', '', 'Second task']);
    await todoCards.nth(1).locator('input[name="title"]').fill('Inserted from menu');
    await todoCards.nth(1).locator('.card-menu-trigger').focus();
    await page.keyboard.press('Enter');
    const addAfter = todoCards.nth(1).locator('.card-menu').getByRole('button', {name:/Add After/});
    await todoCards.nth(1).locator('input[name="title"]').focus();
    await page.waitForTimeout(25);
    await page.keyboard.down('Control');
    await expect(addAfter).toHaveAttribute('data-hotkey', '+');
    await expect(addAfter).toBeVisible();
    const addAfterHint = await addAfter.evaluate(button => {
        const style = getComputedStyle(button, '::after');
        return {
            content: style.content,
            position: style.position,
            left: style.left,
            right: style.right,
            top: style.top,
            transform: style.transform,
        };
    });
    expect(addAfterHint.content).toContain('Ctrl+');
    expect(addAfterHint.position).toBe('absolute');
    expect(parseFloat(addAfterHint.left)).toBeGreaterThan(0);
    expect(parseFloat(addAfterHint.right)).toBeGreaterThan(0);
    expect(parseFloat(addAfterHint.top)).toBeGreaterThan(0);
    expect(addAfterHint.transform).not.toBe('none');
    const removeAfter = todoCards.nth(1).locator('.card-menu').getByRole('button', {name:/Remove/});
    await expect(removeAfter).toHaveAttribute('data-hotkey', '-');
    const removeAfterHint = await removeAfter.evaluate(button => {
        const style = getComputedStyle(button, '::after');
        return {
            content:style.content,
            position:style.position,
            left:style.left,
            right:style.right,
            transform:style.transform,
        };
    });
    expect(removeAfterHint.content.replace(/["\s]/g, '')).toContain('Ctrl+-');
    expect(removeAfterHint.position).toBe('absolute');
    expect(parseFloat(removeAfterHint.left)).toBeGreaterThan(0);
    expect(parseFloat(removeAfterHint.right)).toBeGreaterThan(0);
    expect(removeAfterHint.transform).not.toBe('none');
    await page.keyboard.press('Shift+Equal');
    await page.keyboard.up('Control');
    await expect(todoCards).toHaveCount(4);
    await expect(todoCards.nth(2).locator('input[name="title"]')).toBeFocused();
    expect(await todoCardTitles()).toEqual([
        'First task', 'Inserted from menu', '', 'Second task',
    ]);
    const globalAdd = root.getByTitle('Add task').first();
    await globalAdd.focus();
    await page.waitForTimeout(25);
    await page.keyboard.down('Control');
    await expect(globalAdd).toHaveAttribute('data-hotkey', '+');
    await page.keyboard.press('Shift+Equal');
    await page.keyboard.up('Control');
    await expect(todoCards).toHaveCount(5);
    expect(await todoCardTitles()).toEqual([
        'First task', 'Inserted from menu', '', 'Second task', '',
    ]);
};
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %} <!-- kanban_css {{{ --> {% endraw %}
{% capture kanban_css -%}
{{""}}/* Three equal columns; each list fills the height of its column. */
{{""}}#myForm$$ .kanban {
{{""}}  display: flex;
{{""}}  align-items: stretch;
{{""}}  gap: 1em;
{{""}}}
{{""}}#myForm$$ .column {
{{""}}  display: flex;
{{""}}  flex: 1;
{{""}}  flex-direction: column;
{{""}}  min-width: 200px;
{{""}}  padding: .5em;
{{""}}  border: 1px solid #ddd;
{{""}}  border-radius: 6px;
{{""}}}
{{""}}#myForm$$ .column > [data-smark] { flex: 1; min-height: 0; }

{{""}}/* Keep the task input compact and leave the clear-empty action below the board. */
{{""}}#myForm$$ .kanban input { width: 4em; }
{{""}}#myForm$$ .clear-empties { display: block; margin: .5em auto 0; }
{{""}}#myForm$$ .hint { margin-top: 1em; color: #888; font-size: .82em; }
{{""}}#myForm$$ .hint kbd {
{{""}}  padding: 1px 4px;
{{""}}  border: 1px solid #ccc;
{{""}}  border-radius: 3px;
{{""}}  background: rgba(0, 0, 0, .06);
{{""}}}

{{""}}/* Anchor each disclosure menu to its task handle. */
{{""}}#myForm$$ .card-actions { position: relative; display: flex; }
{{""}}#myForm$$ .card-menu-trigger { padding: 0 .4em; }
{{""}}button { position: relative; }
{{""}}button[data-hotkey]::after {
{{""}}  position: absolute;
{{""}}  top: .75em;
{{""}}  left: 0;
{{""}}  padding: 1px 4px;
{{""}}  border-radius: 3px;
{{""}}  background: #333;
{{""}}  color: #fff;
{{""}}  content: "Ctrl+" attr(data-hotkey);
{{""}}  font-size: .7em;
{{""}}  white-space: nowrap;
{{""}}}
{{""}}#myForm$$ .card-menu {
{{""}}  position: absolute;
{{""}}  top: 100%;
{{""}}  right: 0;
{{""}}  z-index: 10;
{{""}}  display: none;
{{""}}  min-width: 13em;
{{""}}  padding: .25em;
{{""}}  border: 1px solid ButtonBorder;
{{""}}  border-radius: 4px;
{{""}}  background: Canvas;
{{""}}  color: CanvasText;
{{""}}  box-shadow: 0 2px 8px rgba(0, 0, 0, .2);
{{""}}}
{{""}}#myForm$$ .card-actions.menu-open .card-menu,
{{""}}#myForm$$ .card-actions:has([data-hotkey]) .card-menu { display: block; }
{{""}}#myForm$$ .card-menu button {
{{""}}  display: block;
{{""}}  width: 100%;
{{""}}  padding: .35em .5em;
{{""}}  border: 0;
{{""}}  background: transparent;
{{""}}  text-align: left;
{{""}}}
{{""}}#myForm$$ .card-menu button[data-hotkey] { padding-right: 5.5em; }
{{""}}#myForm$$ .card-menu button[data-hotkey]::after {
{{""}}  top: 50%; right: 0.45em; bottom: auto; left: auto;
{{""}}  transform: translateY(-50%); font-size: 0.6em;
{{""}}}
{{""}}#myForm$$ .card-menu button:disabled { opacity: .45; }
{{""}}#myForm$$ .card-menu-trigger[data-smark-role="drag-handle"] { cursor: grab; }
{{""}}#myForm$$ .card input,
{{""}}#myForm$$ .card button { cursor: auto; }
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %} <!-- kanban_notes {{{ --> {% endraw %}
{% capture kanban_notes -%}
👉 **Move by keyboard or drag.** Use a task's <kbd>☰</kbd> button to open its actions disclosure or drag the task. On touch screens, press and hold the button before dragging so normal swipes can scroll. Inputs and other buttons remain interactive.

The Showcase page preloads the pinned polyfill module in its document head. The
example then imports it normally inside the preview iframe and enables it only
on touch-capable devices. The hint lets the iframe reuse the fetched bytes from
the browser's HTTP cache without enabling the polyfill on the Showcase page
itself; cache policy or browser behavior can still cause a later fetch.

👉 **Hotkeys.** Hold <code>Ctrl</code> to reveal the available actions. Use <kbd>Ctrl</kbd>+<kbd>]</kbd> / <kbd>Ctrl</kbd>+<kbd>[</kbd> for the next/previous column, <kbd>Ctrl</kbd>+<kbd>.</kbd> / <kbd>Ctrl</kbd>+<kbd>,</kbd> to move down/up, and <kbd>Ctrl</kbd>+<kbd>-</kbd> to remove. The shortcuts adapt to the focused task. Use <kbd>Ctrl</kbd>+<kbd>+</kbd> to add a task.

From a focused task, <kbd>Ctrl</kbd>+<kbd>+</kbd> inserts a task immediately after it; the column header's Add button still appends at the end.

👉 **Field navigation.** The column lists use <code>role:"jump-boundary"</code>,
so <kbd>Ctrl</kbd>+<kbd>Enter</kbd> / <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Enter</kbd>
move focus between columns, restoring the last focused field. Textareas retain
their field-navigation behavior. Reaching either end of the marked column group
does nothing rather than moving within the column's task list.

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
  <button class="feature-summary">Accessibility: Cross-list keyboard and drag movement</button>
  <div class="feature-desc">
  Task cards can be dragged or moved between these three columns with the
  <code>next</code> / <code>previous</code> actions. Each list has
  <code>sortable:true</code> and <code>moving_depth:1</code>. The lists share the
  same mixin template, so SmarkForm treats them as compatible; other cross-list
  moves still obey the configured sibling-distance limits on both lists.

  See <a href="{{ "/component_reference/list" | relative_url }}#sortable">List Type — sortable</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Wildcard action dispatch</button>
  <div class="feature-desc">
  The <strong>🧹</strong> trigger uses <code>context:"*"</code> to find all lists
  and <code>target:"*"</code> to address their items. With
  <code>preserve_non_empty:true</code>, one action removes only empty tasks from
  every column.

  See <a href="{{ "/guides/form_traversing" | relative_url }}#wildcard-context-multi-dispatch">Form Traversing — Wildcard Context</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Cancelable action events</button>
  <div class="feature-desc">
  A <code>BeforeAction_removeItem</code> listener checks whether a task has data
  and calls <code>ev.preventDefault()</code> if the user cancels its removal.
  Bulk cleanup skips the prompt.

  See <a href="{{ "/guides/events" | relative_url }}#beforeaction-events">Events — BeforeAction</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Accessibility: Context-scoped hotkeys</button>
  <div class="feature-desc">
  Hold <kbd>Ctrl</kbd> to reveal <kbd>+</kbd> and <kbd>-</kbd> shortcuts.  The
  same hotkey triggers different Add/Remove buttons depending on which column
  you are focused in — context sensitivity built in.

  See <a href="{{ "/accessibility/hotkeys" | relative_url }}">Hotkeys</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">List template roles</button>
  <div class="feature-desc">
  Every list needs an <code>item</code> template; <code>item</code> is the default
  and required role. Optional roles include <code>header</code>,
  <code>footer</code>, <code>empty_list</code>,
  <code>placeholder</code>, <code>separator</code>, and <code>last_separator</code>.
  These columns use <code>header</code> for their title and Add button and
  <code>empty_list</code> to show “No tasks”.

  See <a href="{{ "/component_reference/list" | relative_url }}#empty-and-separator-roles">List Type — template roles</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Accessibility: Named drag handle</button>
  <div class="feature-desc">
  The native <strong>☰</strong> button has the accessible name “Task actions”
  and is marked with <code>data-smark-role="drag-handle"</code>. It remains a
  regular button for keyboard and assistive-technology users while also marking
  the task's drag handle.

  See <a href="{{ "/accessibility/accessible_labels_and_names" | relative_url }}">Accessible Labels and Names</a>,
  <a href="{{ "/guides/roles" | relative_url }}">Component Roles</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Styles in mixin templates</button>
  <div class="feature-desc">
  Mixin templates can include a <code>&lt;style&gt;</code> block. SmarkForm
  injects and deduplicates it globally, not as scoped CSS; this template prefixes
  its selectors with <code>.kanban-mixin</code> to limit where they match.

  See <a href="{{ "/guides/mixin_types" | relative_url }}">Mixin Types</a>.
  </div>
</div>

</div>

---

## Race Registration System

Register a family for a race event. Fill the first member, then ✨ duplicate
for siblings — only edit what differs. Each member gets a race bib, meal
selection, emergency contact, and a comments field for the organizers.

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
          <summary>
            <span data-smark="label">Emergency Contact:</span>
            <input data-smark name="emergency_name" type="text">
          </summary>
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
        <p class="member-comments">
          <label data-smark>Comments:</label>
          <textarea data-smark name="comments" rows="2" placeholder="Notes for the race organizers"></textarea>
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
{{""}}#myForm$$ { max-width: 520px; font-size: .95em; }
{{""}}#myForm$$ h3 { margin: 0 0 .3em; }
{{""}}#myForm$$ header {
{{""}}  display: flex;
{{""}}  align-items: center;
{{""}}  gap: .5em;
{{""}}  margin-bottom: .8em;
{{""}}}

{{""}}/* Repeated form records and their native fields. */
{{""}}#myForm$$ ul {
{{""}}  display: flex;
{{""}}  flex-direction: column;
{{""}}  gap: .5em;
{{""}}  padding: 0;
{{""}}  list-style: none;
{{""}}}
{{""}}#myForm$$ li {
{{""}}  padding: .6em;
{{""}}  border: 1px solid #ddd;
{{""}}  border-radius: 6px;
{{""}}}
{{""}}#myForm$$ li p {
{{""}}  display: flex;
{{""}}  align-items: center;
{{""}}  gap: .5em;
{{""}}  margin: .3em 0;
{{""}}}
{{""}}#myForm$$ li p.member-comments { align-items: flex-start; }
{{""}}#myForm$$ li label { min-width: 6em; font-weight: 500; }
{{""}}#myForm$$ li input[type="text"],
{{""}}#myForm$$ li input[type="tel"],
{{""}}#myForm$$ li input[type="number"] {
{{""}}  flex: 1;
{{""}}  padding: .3em .5em;
{{""}}  border: 1px solid #ccc;
{{""}}  border-radius: 4px;
{{""}}}
{{""}}#myForm$$ li textarea {
{{""}}  flex: 1;
{{""}}  min-width: 0;
{{""}}  min-height: 3.5em;
{{""}}  padding: .3em .5em;
{{""}}  border: 1px solid #ccc;
{{""}}  border-radius: 4px;
{{""}}  font: inherit;
{{""}}  resize: vertical;
{{""}}}
{{""}}#myForm$$ li p.member-comments label { padding-top: .25em; }
{{""}}#myForm$$ li input.fee { flex: 1; min-width: 0; }
{{""}}#myForm$$ li select { padding: .3em .5em; border: 1px solid #ccc; border-radius: 4px; }

{{""}}/* Emergency contact uses a native disclosure with its key field in summary. */
{{""}}#myForm$$ li details { margin-top: .3em; }
{{""}}#myForm$$ li summary { cursor: default; user-select: none; font-weight: 500; }
{{""}}#myForm$$ li details > summary {
{{""}}  display: flex;
{{""}}  align-items: center;
{{""}}  gap: .4em;
{{""}}  list-style: none;
{{""}}}
{{""}}#myForm$$ li details > summary::-webkit-details-marker { display: none; }
{{""}}#myForm$$ li details > summary::before {
{{""}}  flex: 0 0 auto;
{{""}}  content: "▸";
{{""}}  transition: transform .15s;
{{""}}}
{{""}}#myForm$$ li details[open] > summary::before { transform: rotate(90deg); }
{{""}}#myForm$$ li details > summary input[name="emergency_name"] { flex: 1; min-width: 0; }
{{""}}#myForm$$ li details[open] { padding: .3em .5em; border: 1px solid #eee; border-radius: 4px; }

{{""}}/* Small visual cues for position, grouped controls, and shortcuts. */
{{""}}#myForm$$ .bib {
{{""}}  min-width: 1.5em;
{{""}}  padding: .1em .4em;
{{""}}  border-radius: 4px;
{{""}}  background: #f0f0f0;
{{""}}  font-weight: bold;
{{""}}  text-align: center;
{{""}}}
{{""}}#myForm$$ .row { display: flex; flex-wrap: wrap; align-items: center; gap: .5em; margin: .3em 0; }
{{""}}#myForm$$ .radio-group { display: flex; gap: .8em; }
{{""}}#myForm$$ .radio-group label { min-width: auto; font-weight: 400; cursor: pointer; }
{{""}}#myForm$$ .hint { margin-top: 1em; color: #888; font-size: .82em; }
{{""}}#myForm$$ .hint kbd { padding: 1px 4px; border: 1px solid #ccc; border-radius: 3px; background: rgba(0, 0, 0, .06); }
{{""}}button { position: relative; }
{{""}}button[data-hotkey]::after {
{{""}}  position: absolute;
{{""}}  top: .75em;
{{""}}  left: 0;
{{""}}  padding: 1px 4px;
{{""}}  border-radius: 3px;
{{""}}  background: #333;
{{""}}  color: #fff;
{{""}}  content: "Ctrl+" attr(data-hotkey);
{{""}}  font-size: .7em;
{{""}}  white-space: nowrap;
{{""}}}
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

👉 **Comments and keyboard navigation.** Plain <kbd>Enter</kbd> inserts a new
line in Comments; <kbd>Ctrl</kbd>+<kbd>Enter</kbd> advances to the next member's
name, and <kbd>Shift</kbd>+<kbd>Enter</kbd> moves backward.

👉 **Type-specific values.** Age exports as a number. Empty Number and Radio
fields may export <code>null</code>; text and native select values can be empty
strings. The Color field has an authored default value.

👉 **Hotkeys.** Hold <code>Ctrl</code> — <code>+</code> adds a member, <code>-</code> removes, <code>*</code> duplicates, <code>Delete</code> clears empty slots.

> See <a href="{{ "/component_reference/form" | relative_url }}">Form Nesting</a>,
> <a href="{{ "/component_reference/list" | relative_url }}">List Types</a>,
> <a href="{{ "/guides/value_coercion" | relative_url }}">Value Coercion</a>.

{: .hint}
> Touch devices may need a drag-and-drop polyfill such as
> [DragDropTouch](https://github.com/drag-drop-touch-js/dragdroptouch). See it
> in action in the [Showcase Kanban]({{ "/showcase_examples/showcase" | relative_url }}#project-kanban-board).
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% capture demoValue -%}
{"members":[{"name":"Alice Johnson","age":34,"fee":45.5,"sex":"F","emergency_name":"Bob Johnson","emergency_phone":"555-1234","tshirt":"M","tshirt_color":"#3498db","meal":"Vegetarian","comments":"Please seat our family together."}]}
{%- endcapture %}

{% raw %}<!-- race_js {{{ -->{% endraw %}
{% capture race_js -%}
// SmarkForm handles the field values, list actions, and position labels.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- race_tests {{{ -->{% endraw %}
{% capture race_tests -%}
export default async ({ expect, root, readField, page }) => {
    await expect(root).toBeVisible();
    const summarySizing = await root.locator('details > summary').evaluate(summary => {
        const summaryRect = summary.getBoundingClientRect();
        const inputRect = summary.querySelector('input[name="emergency_name"]').getBoundingClientRect();
        return {
            summaryWidth: summaryRect.width,
            inputWidth: inputRect.width,
            inputRight: inputRect.right,
            summaryRight: summaryRect.right,
        };
    });
    expect(summarySizing.inputWidth).toBeGreaterThan(summarySizing.summaryWidth * 0.35);
    expect(summarySizing.inputRight).toBeLessThanOrEqual(summarySizing.summaryRight + 1);

    await root.locator('input[name="name"]').first().fill('Alice Johnson');
    await root.locator('input[name="age"]').first().fill('34');
    const firstComments = root.locator('textarea[name="comments"]').first();
    await firstComments.fill('Please seat our family together.');
    await root.evaluate(async () => {
        await myForm.find('/members/0/fee').import(1234.5, {set_default: false});
    });

    const before = await readField('/members');
    expect(before[0].age).toBe(34);
    expect(before[0].comments).toBe('Please seat our family together.');
    expect(before[0].fee).toBe(1234.5);
    await expect(root.locator('input.fee').first()).toHaveValue('1 234.50');

    await root.locator('button[title="Duplicate this member"]').click();
    const duplicated = await readField('/members');
    expect(duplicated).toHaveLength(2);
    expect(duplicated[1]).toMatchObject(duplicated[0]);
    expect(duplicated[1].comments).toBe('Please seat our family together.');

    await firstComments.focus();
    await page.waitForTimeout(25);
    await page.keyboard.press('Enter');
    await expect(firstComments).toHaveValue('Please seat our family together.\n');
    await page.waitForTimeout(25);
    await page.keyboard.press('Control+Enter');
    await expect(root.locator('input[name="name"]').nth(1)).toBeFocused();

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
  <button class="feature-summary">Nested forms in lists</button>
  <div class="feature-desc">
  Each member list item is a Form by default, so the <code>members</code> list
  exports an array of objects. The result is a structured family roster rather
  than a flat sequence of controls.

  See <a href="{{ "/component_reference/form" | relative_url }}">Form Type</a>,
  <a href="{{ "/component_reference/list" | relative_url }}">List Type</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Copy data from a previous item</button>
  <div class="feature-desc">
  The ✨ <strong>Duplicate</strong> button copies the previous sibling's data
  into a new member.  <code>source:".-1"</code> on <code>addItem</code> tells SmarkForm to export
  the previous item and import it into the new one — edit only what differs.

  See <a href="{{ "/component_reference/list" | relative_url }}#async-additem-action">List Type — source</a>,
  <a href="{{ "/guides/form_traversing" | relative_url }}#path-syntax-overview">Form Traversing — Path syntax</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Accessibility: Textarea field navigation</button>
  <div class="feature-desc">
  In the Comments textarea, plain <kbd>Enter</kbd> inserts a newline;
  <kbd>Ctrl</kbd>+<kbd>Enter</kbd> moves to the next member's name, and
  <kbd>Shift</kbd>+<kbd>Enter</kbd> moves backward. This keeps multiline editing
  available while providing a keyboard route between fields.

  See <a href="{{ "/accessibility/keyboard_navigation" | relative_url }}#enter-shiftenter-navigation">Keyboard Navigation — Enter / Shift+Enter</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Accessibility: Keyboard navigation through collapsed sections</button>
  <div class="feature-desc">
  Native <code>&lt;details&gt;</code> and <code>&lt;summary&gt;</code> elements
  provide the disclosure. SmarkForm navigation can open a collapsed section
  and move into its hidden fields with <kbd>Alt</kbd>+<kbd>Enter</kbd>.

  The summary field stays in the normal <kbd>Tab</kbd> order; while the section
  is closed, its hidden body fields are skipped by <kbd>Tab</kbd> /
  <kbd>Shift</kbd>+<kbd>Tab</kbd> and SmarkForm's <kbd>Enter</kbd> /
  <kbd>Shift</kbd>+<kbd>Enter</kbd> navigation. Use <kbd>Alt</kbd>+<kbd>Enter</kbd>
  to open the section and navigate forward into its fields, or
  <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>Enter</kbd> to navigate backward into it.
  <kbd>Shift</kbd>+<kbd>Space</kbd> toggles the section from a summary field; from
  a field in the open body, it closes the section and returns focus to the summary.

  See <a href="{{ "/accessibility/keyboard_navigation" | relative_url }}">Keyboard Navigation</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Accessibility: Context-aware hotkeys</button>
  <div class="feature-desc">
  Hold <kbd>Ctrl</kbd> to reveal the member actions. Row-level duplicate/remove
  buttons have shortcuts and are skipped by <kbd>Tab</kbd>; the outer Add and
  Clear buttons remain in the Tab order. The shortcuts remain available
  alongside ordinary keyboard navigation.

  See <a href="{{ "/accessibility/hotkeys" | relative_url }}">Hotkeys</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Type-specific JSON values</button>
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
  <button class="feature-summary">Wildcard list actions</button>
  <div class="feature-desc">
  The <strong>🧹</strong> button targets every member with <code>target:"*"</code>.
  <code>preserve_non_empty:true</code> skips items that contain data, so one
  action clears only the empty rows.

  See <a href="{{ "/component_reference/list" | relative_url }}#async-removeitem-action">List Type — removeItem</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">List bounds and empty-value export</button>
  <div class="feature-desc">
  The default minimum keeps one member row, <code>max_items:5</code> caps the
  list, and <code>export_empties:false</code> omits wholly empty members. When
  only one member remains, <code>failback:"clear"</code> clears that row rather
  than removing it.

  See <a href="{{ "/component_reference/list" | relative_url }}">List Type</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Native control types</button>
  <div class="feature-desc">
  SmarkForm manages text, number, radio, native select, color, and telephone
  controls. The radio field exports its selected value or <code>null</code>. A
  native <code>&lt;select&gt;</code> uses the generic Input type and exports a
  string; it is not a separate SmarkForm type.

  See <a href="{{ "/component_reference/overview" | relative_url }}">Component Types Overview</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Declarative mask integration</button>
  <div class="feature-desc">
  The mask registry connects an IMask Number factory to the fee field through
  <code>data-smark</code>. It formats the visible value while exporting a number;
  <code>inputMode</code> requests a decimal keypad on mobile.

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
{{""}}/* Period list and collapsible summary layout. */
{{""}}#myForm$$ .hotel-planner { width: 100%; max-width: 100%; min-width: 0; box-sizing: border-box; }
{{""}}#myForm$$ .hotel-planner ul { list-style: none; margin: 0; padding: 0; }
{{""}}#myForm$$ .hotel-planner > ul {
{{""}}  display: grid;
{{""}}  width: 100%;
{{""}}  min-width: 0;
{{""}}  box-sizing: border-box;
{{""}}  gap: .75rem;
{{""}}}
{{""}}#myForm$$ .hotel-planner > ul > li { min-width: 0; }
{{""}}#myForm$$ .no-periods {
{{""}}  padding: 1.25rem;
{{""}}  border: 1px dashed #94a3b8;
{{""}}  border-radius: .75rem;
{{""}}  color: #64748b;
{{""}}  text-align: center;
{{""}}}
{{""}}#myForm$$ .period-card {
{{""}}  width: 100%;
{{""}}  min-width: 0;
{{""}}  box-sizing: border-box;
{{""}}  overflow: hidden;
{{""}}  border: 1px solid #cbd5e1;
{{""}}  border-radius: .9rem;
{{""}}  background: linear-gradient(135deg, #fff, #f4f7fb);
{{""}}  box-shadow: 0 3px 12px rgba(15, 23, 42, .08);
{{""}}}
{{""}}#myForm$$ .period-card > summary {
{{""}}  display: flex;
{{""}}  width: 100%;
{{""}}  min-width: 0;
{{""}}  box-sizing: border-box;
{{""}}  flex-wrap: nowrap;
{{""}}  align-items: center;
{{""}}  gap: .5rem;
{{""}}  padding: .75rem 1rem;
{{""}}  overflow: hidden;
{{""}}  background: linear-gradient(100deg, #e0e7ff, #ecfeff);
{{""}}  cursor: pointer;
{{""}}  white-space: nowrap;
{{""}}}
{{""}}#myForm$$ .period-handle { color: #475569; cursor: grab; user-select: none; }
{{""}}#myForm$$ .period-count { flex: 0 0 auto; color: #4338ca; font-size: .8rem; font-weight: 700; }
{{""}}#myForm$$ .period-name { flex: 1 1 10rem; min-width: 7rem; font-size: 1.05rem; font-weight: 700; text-align: left; }
{{""}}#myForm$$ .period-summary-date {
{{""}}  display: flex;
{{""}}  flex: 0 1 10rem;
{{""}}  min-width: 0;
{{""}}  align-items: center;
{{""}}  gap: .25rem;
{{""}}  overflow: hidden;
{{""}}  font-size: .75rem;
{{""}}  font-weight: 600;
{{""}}}
{{""}}#myForm$$ .period-summary-date input { width: 100%; min-width: 0; box-sizing: border-box; }
{{""}}#myForm$$ .period-card > summary > button { flex: 0 0 auto; margin-left: auto; }
{{""}}#myForm$$ .period-content { padding: .85rem; }

{{""}}/* Service grids and their add/remove controls. */
{{""}}#myForm$$ .service-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .75rem; }
{{""}}#myForm$$ .hotel-service {
{{""}}  min-width: 0;
{{""}}  padding: .7rem;
{{""}}  border: 1px solid #dbe3ed;
{{""}}  border-radius: .7rem;
{{""}}  background: rgba(255, 255, 255, .82);
{{""}}}
{{""}}#myForm$$ .service-heading {
{{""}}  display: flex;
{{""}}  align-items: baseline;
{{""}}  justify-content: space-between;
{{""}}  gap: .5rem;
{{""}}  padding-bottom: .45rem;
{{""}}  border-bottom: 1px solid #e2e8f0;
{{""}}}
{{""}}#myForm$$ .service-heading strong { color: #334155; }
{{""}}#myForm$$ .service-heading span { color: #64748b; font-size: .65rem; font-weight: 700; letter-spacing: .08em; }
{{""}}#myForm$$ .service-closed { padding: .7rem .25rem; color: #64748b; font-style: italic; text-align: center; }
{{""}}#myForm$$ .hours-row {
{{""}}  display: grid;
{{""}}  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
{{""}}  align-items: end;
{{""}}  gap: .4rem;
{{""}}  padding: .45rem 0;
{{""}}  border-bottom: 1px solid #eef2f7;
{{""}}}
{{""}}#myForm$$ .hours-row label { display: grid; gap: .2rem; font-size: .75rem; }
{{""}}#myForm$$ .hours-row input { width: 100%; min-width: 0; box-sizing: border-box; }
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

{: .hint}
> Touch devices may need a drag-and-drop polyfill such as
> [DragDropTouch](https://github.com/drag-drop-touch-js/dragdroptouch). See it
> in action in the [Showcase Kanban]({{ "/showcase_examples/showcase" | relative_url }}#project-kanban-board).
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
  <button class="feature-summary">Native date and time fields</button>
  <div class="feature-desc">
  SmarkForm can manage native <code>date</code> and <code>time</code> inputs in
  nested forms and lists. Each period stores its own date range and service hours.

  See <a href="{{ "/component_reference/date" | relative_url }}">Date Type</a>,
  <a href="{{ "/component_reference/time" | relative_url }}">Time Type</a>, and
  <a href="{{ "/component_reference/list" | relative_url }}">List Type</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Empty-list templates</button>
  <div class="feature-desc">
  A list's <code>empty_list</code> role provides content to show when it has no
  items. Here, each service displays “Closed this period” until hours are added.

  See <a href="{{ "/component_reference/list" | relative_url }}">List Type</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Source-based item duplication</button>
  <div class="feature-desc">
  <strong>✨ Duplicate period</strong> uses <code>addItem</code>'s
  <code>source: ".-1"</code> option to copy the previous list item, then you can
  change only its dates or service hours.

  See <a href="{{ "/component_reference/list" | relative_url }}#async-additem-action">List Type — addItem</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Manual list sorting</button>
  <div class="feature-desc">
  Set <code>sortable:true</code> to let people drag list items into a new order.
  Each period keeps its service schedules when it moves.

  See <a href="{{ "/component_reference/list" | relative_url }}#sortable">List Type — sortable</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Reusable component templates</button>
  <div class="feature-desc">
  A mixin template defines a component's structure once and can be reused with
  independent values and options. This example uses <code>#hotelService</code>
  for Reception, Restaurant, Bar, and Pool; <code>data-for</code> fills each
  service label.

  See <a href="{{ "/guides/mixin_types" | relative_url }}">Mixin Types</a>.
  </div>
</div>

<div class="feature">
  <button class="feature-summary">Position and count actions</button>
  <div class="feature-desc">
  The period summary combines <code>position</code> and <code>count</code> to
  show where the current period sits in the list, such as “1 of 2”. The position
  changes when periods are reordered; the count changes when periods are added
  or removed.

  See <a href="{{ "/component_reference/list" | relative_url }}#actions">List Type — actions</a>.
  </div>
</div>

</div>

<script src="{{ "/assets/js/showcase-features.js" | relative_url }}"></script>

---

{: .hint }
> **Want the full feature set?** Each example above demonstrates a curated
> subset of SmarkForm capabilities.  See the individual reference pages for
> the complete API and advanced patterns.

## More examples from the documentation

The Showcase above is a curated selection. Many other examples live beside the
guides and references that explain them. The following collection brings
selected examples together for browsing; use each **Original** link to open it
in its full documentation context.

{: .hint }
> Looking for fuller, more realistic projects? The
> [Examples page]({{ "/showcase_examples/examples" | relative_url }}) continues
> the tour with complete, playable forms.

### The examples

{% include showcase_examples.md %}
