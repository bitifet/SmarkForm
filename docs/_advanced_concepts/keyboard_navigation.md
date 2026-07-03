---
title: "Keyboard Navigation"
layout: chapter
permalink: /advanced_concepts/keyboard_navigation
nav_order: 13

---

{% include links.md %}
{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

SmarkForm provides an intuitive keyboard-driven interface that lets users
fill data fluently without switching between keyboard and mouse.

## Enter / Shift+Enter Navigation

Press `Enter` to move forward to the next field, and `Shift`+`Enter` to move
backward. This is more convenient than `Tab` and `Shift`+`Tab` — it skips
controls that would otherwise interrupt the data-entry flow, providing a
more fluid experience.

{% raw %}<!-- nav_enter_html {{{ -->{% endraw %}
{% capture nav_enter_html -%}
<div id="myForm$$">
  <p>
    <label data-smark>First name:</label>
    <input data-smark type="text" name="first">
  </p>
  <p>
    <label data-smark>Last name:</label>
    <input data-smark type="text" name="last">
  </p>
  <p>
    <label data-smark>Email:</label>
    <input data-smark type="email" name="email">
  </p>
  <p>
    <label data-smark>Message:</label>
    <textarea data-smark name="message"></textarea>
  </p>
</div>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- nav_enter_notes {{{ -->{% endraw %}
{% capture nav_enter_notes -%}
Press `Enter` in any text field to move to the next one. Shift`+`Enter` goes backward. In the textarea, use `Ctrl`+`Enter` to advance (plain `Enter` inserts a new line).
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
   formId="nav-enter"
   htmlSource=nav_enter_html
   notes=nav_enter_notes
   selected="preview"
   tests=false
%}

{: .info :}
> In textareas, use `Ctrl`+`Enter` instead. Plain `Enter` inserts a new line
> in the text.

## Tab-Flow Exclusion for Hotkey-Equipped Buttons

Buttons that have a `hotkey` defined are automatically taken out of the `Tab`
navigation flow. This prevents having to tab through dozens of inner-list
action buttons (e.g. `➖` remove buttons) when filling a long list.

- **Inner buttons** (inside list items): Removed from `Tab` flow — users can
  activate them via their hotkey instead.
- **Outer buttons** (siblings of the list): Kept in `Tab` flow — with
  `min_items: 0`, the only way to create the first item is via the outer
  add button, which must remain keyboard-accessible.

{: .info :}
> Hold `Ctrl` to discover available hotkeys — each trigger button with a
> hotkey shows a tooltip revealing its keyboard shortcut.

## Alt+Enter for Collapsed Sections

When navigating with `Enter` / `Shift`+`Enter`, fields inside a closed
`<details>` element are skipped. To navigate into them, hold `Alt` while
pressing `Enter` — SmarkForm automatically opens any closed `<details>`
ancestors along the path.

This allows you to keep optional sections collapsed by default while still
being able to arrow-key into them when you need to fill data.
