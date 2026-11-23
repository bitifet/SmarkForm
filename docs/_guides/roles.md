---
title: "SmarkForm Roles"
layout: chapter
description: "Understand SmarkForm's role option, passive role annotations, list-template roles, and sortable drag handles."
permalink: "/guides/roles"
nav_order: 10
---

{% include links.md %}

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

See also: [Sortable lists]({{ "/component_reference/list#sortable" | relative_url }}),
[Mixin types]({{ "/guides/mixin_types" | relative_url }}).
