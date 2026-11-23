---
title: "SmarkForm Roles"
layout: chapter
description: "Understand SmarkForm's role option, passive role annotations, list-template roles, and sortable drag handles."
permalink: "/guides/roles"
nav_order: 10
---

{% include links.md %}
{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {% include chaptertoc/roles.html %}

</details>

## The `role` option

`role` is a SmarkForm option. Write it in the `data-smark` JSON object or use
the `data-smark-role` shorthand:

```html
<span data-smark='{"role":"drag-handle"}'>Move</span>
<span data-smark-role="drag-handle">Move</span>
```

These declarations annotate the elements; **`role` by itself does not make an
element a SmarkForm component**. SmarkForm continues through a role-only element
when discovering components below it. Add another SmarkForm option, such as
`type`, `name`, or `action`, to make the element a component. A bare `data-smark`
declaration also continues to opt an element into component discovery.

For example, a role can accompany a trigger's `action` option:

```html
<button data-smark='{"role":"drag-handle","action":"removeItem"}'>
  Remove
</button>
```

The SmarkForm `role` option is separate from the standard HTML `role` attribute,
which continues to control ARIA semantics:

```html
<button role="button" data-smark-role="drag-handle">☰</button>
```

## List-template roles

A `list` interprets `role` on each direct child as that child's list-template
role. Supported values are:

| Role | Purpose |
|------|---------|
| `item` | Repeating item template (the default) |
| `empty_list` | Content shown when the list has no items |
| `header` | Content placed before the items |
| `footer` | Content placed after the items |
| `placeholder` | Filler used with a fixed-width grid |
| `separator` | Content between items |
| `last_separator` | Content before the final item |

Use `data-smark='{"role":"header"}'` or `data-smark-role="header"` for these
templates. A list owns and interprets its direct children as templates; those
children are not drag-handle annotations. In particular, `drag-handle` is not a
list-template role. The item template root is the fallback drag surface when no
explicit handle is present inside the item.

See the [list component reference]({{ "/component_reference/list" | relative_url }})
for the full list-template contract.

## The `drag-handle` role

Sortable lists recognize `role: "drag-handle"` on elements inside a rendered
item. This lets an ordinary DOM element—or a SmarkForm component—serve as the
specific starting point for a drag:

```html
<ul data-smark='{"type":"list","name":"tasks","sortable":true}'>
  <li data-smark-role="item">
    <button type="button" data-smark-role="drag-handle"
            aria-label="Drag to reorder">☰</button>
    <input data-smark name="title" placeholder="Task title">
    <button data-smark-action="removeItem">✕</button>
  </li>
</ul>
```

The button's role-only annotation does not turn it into a SmarkForm component.
An interactive handle can still be used normally when the user is not dragging;
interactive descendants inside a marked wrapper remain blocked as drag origins.
SmarkForm label components continue to be automatic handles. If no explicit
handle or label exists inside an item, the item root is the fallback (interactive
controls remain excluded).

Style a shorthand role with an attribute selector:

```css
[data-smark-role="drag-handle"] { cursor: grab; }
```

Use `data-smark-role="drag-handle"` on an element inside the item. The item root
remains the fallback when no explicit handle is present.

## Explore the role patterns

This small planning board uses every current list-template role. It shows
`drag-handle` in JSON and shorthand, on a passive DOM element and a SmarkForm
trigger. The inline guest list uses separator roles to format its values as a
sentence.

{% raw %}<!-- roles_workbench_html {{{ -->{% endraw %}
{% capture roles_workbench_html -%}
<div id="myForm$$">
  <div class="role-studio" data-smark='{"type":"form","name":"studio"}'>
    <header class="studio-heading">
      <p class="studio-kicker">ROLE STUDIO · 01</p>
      <h2>Shape a small sprint</h2>
      <p>Move cards, fill the open slots, and see each list role at work.</p>
    </header>

    <section class="task-panel" aria-label="Sprint task list">
      <div class="task-list" data-smark='{"type":"list","name":"tasks","of":"form","sortable":true,"min_items":0,"max_items":4}'>
        <div class="task-list-heading" data-smark='{"role":"header"}'>
          <div><span class="studio-kicker">THE BOARD</span><strong>Task queue</strong></div>
          <span class="task-count"><span data-smark-action="count"></span><span> / 4 cards</span></span>
        </div>
        <article class="task-card" data-smark='{"type":"form","role":"item"}'>
          <span class="task-grip" data-smark='{"role":"drag-handle"}' aria-hidden="true">⠿</span>
          <input data-smark name="title" type="text" placeholder="Name this task">
          <button type="button" class="task-remove" data-smark-role="drag-handle" data-smark-action="removeItem" aria-label="Remove task">×</button>
        </article>
        <div class="task-empty" data-smark-role="empty_list">
          <span aria-hidden="true">✳</span> The board is clear. Add a task to begin.
        </div>
        <div class="task-placeholder" data-smark='{"role":"placeholder"}' aria-hidden="true">Open slot</div>
        <div class="task-footer" data-smark-role="footer">
          <button type="button" data-smark-action="addItem">＋ Add a task</button>
          <span>Drag the ⠿ grip to reorder</span>
        </div>
      </div>
    </section>

    <section class="guest-panel" aria-label="Guest list">
      <div>
        <p class="studio-kicker">INLINE LIST</p>
        <h3>Who’s joining?</h3>
      </div>
      <div class="guest-controls">
        <button type="button" data-smark='{"action":"removeItem","context":"guests"}' aria-label="Remove last guest">−</button>
        <span class="guest-prefix">Inviting</span>
        <span class="guest-list" data-smark='{"type":"list","name":"guests","of":"input","min_items":0,"max_items":3}'>
          <input data-smark-role="item" type="text" placeholder="Guest name">
          <span class="guest-empty" data-smark='{"role":"empty_list"}'>no guests yet</span>
          <span class="guest-separator" data-smark='{"role":"separator"}'>, </span>
          <span class="guest-last-separator" data-smark-role="last_separator"> and </span>
        </span>
        <button type="button" data-smark='{"action":"addItem","context":"guests"}' aria-label="Add guest">＋</button>
      </div>
      <p class="syntax-note">Three guests max · comma-separated, with “and” before the last</p>
    </section>
  </div>
</div>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- roles_workbench_css {{{ -->{% endraw %}
{% capture roles_workbench_css -%}
{{""}}#myForm$$ {
{{""}}  --ink: #203447; --muted: #647789; --line: #d9e3e9;
{{""}}  --mint: #d9f5e9; --mint-ink: #17634b; --paper: #f4f8f8;
{{""}}  box-sizing: border-box; max-width: 54rem; margin: 0 auto;
{{""}}  padding: 1rem; color: var(--ink); font: 1rem/1.45 system-ui, sans-serif;
{{""}}}
{{""}}#myForm$$ *, #myForm$$ *::before, #myForm$$ *::after { box-sizing: inherit; }
{{""}}#myForm$$ .role-studio { padding: clamp(1rem, 4vw, 2rem); border: 1px solid var(--line); border-radius: 1.25rem; background: radial-gradient(circle at 95% 0%, #e0f8ef 0, transparent 14rem), white; box-shadow: 0 1rem 3rem #20344712; }
{{""}}#myForm$$ .studio-heading { margin-bottom: 1.4rem; }
{{""}}#myForm$$ .studio-heading h2, #myForm$$ .guest-panel h3 { margin: .15rem 0 .35rem; }
{{""}}#myForm$$ .studio-heading p:last-child, #myForm$$ .syntax-note { margin: 0; color: var(--muted); }
{{""}}#myForm$$ .studio-kicker { margin: 0; color: var(--mint-ink); font-size: .7rem; font-weight: 800; letter-spacing: .12em; }
{{""}}#myForm$$ .task-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .55rem; padding: .75rem; border: 1px solid var(--line); border-radius: 1rem; background: var(--paper); }
{{""}}#myForm$$ .task-list-heading, #myForm$$ .task-empty, #myForm$$ .task-footer { grid-column: 1 / -1; }
{{""}}#myForm$$ .task-list-heading { display: flex; align-items: center; justify-content: space-between; padding: .25rem .25rem .6rem; }
{{""}}#myForm$$ .task-list-heading strong { display: block; font-size: 1.1rem; }
{{""}}#myForm$$ .task-count { padding: .3rem .6rem; border-radius: 99px; background: var(--mint); color: var(--mint-ink); font-size: .8rem; font-weight: 700; }
{{""}}#myForm$$ .task-card { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: .45rem; min-width: 0; padding: .45rem; border: 1px solid var(--line); border-radius: .75rem; background: white; box-shadow: 0 .2rem .5rem #2034470a; }
{{""}}#myForm$$ .task-card input { width: 100%; min-width: 0; padding: .45rem; border: 0; background: transparent; color: inherit; font: inherit; }
{{""}}#myForm$$ .task-grip { color: #8395a2; cursor: grab; font-size: 1.35rem; line-height: 1; }
{{""}}#myForm$$ .task-remove { width: 2rem; height: 2rem; border: 0; border-radius: .55rem; background: #fff0ee; color: #a54438; cursor: grab; font-size: 1.2rem; }
{{""}}#myForm$$ .task-empty { padding: 1rem; border: 1px dashed #adc5bd; border-radius: .75rem; color: var(--muted); text-align: center; }
{{""}}#myForm$$ .task-empty span { color: var(--mint-ink); font-size: 1.25rem; }
{{""}}#myForm$$ .task-placeholder { min-height: 3.4rem; padding: .9rem .5rem; border: 1px dashed #cbd8de; border-radius: .75rem; color: #94a3ad; font-size: .8rem; text-align: center; }
{{""}}#myForm$$ .task-footer { display: flex; align-items: center; justify-content: space-between; gap: .5rem; padding: .25rem; color: var(--muted); font-size: .8rem; }
{{""}}#myForm$$ button { font: inherit; }
{{""}}#myForm$$ .task-footer button, #myForm$$ .guest-controls button { padding: .4rem .7rem; border: 1px solid var(--line); border-radius: .6rem; background: white; color: var(--ink); cursor: pointer; }
{{""}}#myForm$$ .task-footer button:hover, #myForm$$ .guest-controls button:hover { border-color: #77b59d; }
{{""}}#myForm$$ .guest-panel { display: grid; grid-template-columns: minmax(9rem, .7fr) minmax(0, 1.5fr); align-items: center; gap: .3rem 1rem; margin-top: 1rem; padding: 1rem; border: 1px solid var(--line); border-radius: 1rem; background: #fbfdfc; }
{{""}}#myForm$$ .guest-controls { display: flex; align-items: center; gap: .4rem; min-width: 0; }
{{""}}#myForm$$ .guest-prefix { color: var(--muted); white-space: nowrap; }
{{""}}#myForm$$ .guest-list { display: inline-flex; align-items: center; gap: .15rem; min-width: 0; }
{{""}}#myForm$$ .guest-list input { width: 7.5em; max-width: 100%; padding: .3rem; border: 1px solid transparent; border-bottom-color: #b7c8c1; background: transparent; color: inherit; font: inherit; }
{{""}}#myForm$$ .guest-empty { color: var(--muted); font-style: italic; }
{{""}}#myForm$$ .syntax-note { grid-column: 2; font-size: .75rem; }
{{""}}@media (max-width: 36rem) {
{{""}}  #myForm$$ .guest-panel { grid-template-columns: 1fr; }
{{""}}  #myForm$$ .syntax-note { grid-column: 1; }
{{""}}  #myForm$$ .guest-controls { flex-wrap: wrap; }
{{""}}}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- roles_workbench_js {{{ -->{% endraw %}
{% capture roles_workbench_js -%}
// Role discovery, list templates, and drag handles are declarative.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- roles_workbench_notes {{{ -->{% endraw %}
{% capture roles_workbench_notes -%}
**Try it:** Drag the ⠿ grip to reorder tasks, or click **×** to remove one. The
board header and footer use `header` and `footer`; removing every card reveals
`empty_list`, while `placeholder` keeps the four-slot grid visible. The grip is
a passive role-only element; the remove button is both a trigger component and
a drag handle.

The guest sentence demonstrates a scalar list using `item`, `empty_list`,
`separator`, and `last_separator`. Use **＋** / **−** to change the names and see
the punctuation adapt. The example mixes `data-smark` JSON roles and the
`data-smark-role` shorthand. **No JavaScript is needed** to discover or apply
these roles.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- roles_workbench_demoValue {{{ -->{% endraw %}
{% capture roles_workbench_demoValue -%}
{
  "studio": {
    "tasks": [
      {"title":"Sketch the role map"},
      {"title":"Polish the component API"}
    ],
    "guests": ["Ada", "Grace", "Lin"]
  }
}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- roles_workbench_tests {{{ -->{% endraw %}
{% capture roles_workbench_tests -%}
export default async ({ expect, root, readField, writeField }) => {
    await expect(root).toBeVisible();

    const tasks = [
        {title: 'Map the roles'},
        {title: 'Try the list templates'},
    ];
    const guests = ['Ada', 'Grace', 'Lin'];
    await writeField('/studio/tasks', tasks);
    await writeField('/studio/guests', guests);

    expect(await readField('/studio/tasks')).toEqual(tasks);
    expect(await readField('/studio/guests')).toEqual(guests);
    await expect(root.locator('.task-card')).toHaveCount(2);
    await expect(root.locator('.task-placeholder')).toHaveCount(2);
    await expect(root.locator('.guest-separator')).toHaveCount(1);
    await expect(root.locator('.guest-last-separator')).toHaveCount(1);
    const guestText = await root.locator('.guest-list').evaluate(list =>
        [...list.children]
            .map(child => child instanceof HTMLInputElement ? child.value : child.textContent)
            .join('')
    );
    expect(guestText).toBe('Ada, Grace and Lin');

    await writeField('/studio/tasks', []);
    await expect(root.locator('.task-empty')).toBeVisible();
    await expect(root.locator('.task-placeholder')).toHaveCount(3);
    await writeField('/studio/guests', []);
    await expect(root.locator('.guest-empty')).toBeVisible();
    await expect(root.locator('.guest-separator, .guest-last-separator')).toHaveCount(0);

    await root.getByRole('button', {name: /Add a task/}).click();
    await expect(root.locator('.task-card')).toHaveCount(1);
    await root.getByRole('button', {name: 'Remove task'}).click();
    await expect(root.locator('.task-empty')).toBeVisible();
};
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="roles_workbench"
    title="A sprint board that demonstrates SmarkForm roles"
    htmlSource=roles_workbench_html
    cssSource=roles_workbench_css
    jsSource=roles_workbench_js
    notes=roles_workbench_notes
    demoValue=roles_workbench_demoValue
    tests=roles_workbench_tests
    showEditor=true
    selected="preview"
    minHeight=55
%}

See also: [Sortable lists]({{ "/component_reference/list#sortable" | relative_url }}),
[Mixin types]({{ "/guides/mixin_types" | relative_url }}).
