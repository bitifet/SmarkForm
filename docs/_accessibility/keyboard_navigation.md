---
title: "Keyboard Navigation"
layout: chapter
description: "Use Enter-based field navigation, native Tab order and SmarkForm shortcuts where forms provide them."
permalink: "/accessibility/keyboard_navigation"
nav_order: 1
redirect_from:
  - "/working_with_forms/keyboard_navigation"
---


{% include links.md %}
{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

SmarkForm adds keyboard navigation to supported fields. The exact behavior also
depends on the form's markup, native controls, browser, and enabled features.

## Enter / Shift+Enter Navigation

Press `Enter` to move forward to the next field, and `Shift`+`Enter` to move
backward. This field-navigation shortcut skips buttons and other non-field
components. Use `Tab` and `Shift`+`Tab` for the browser's normal sequential
focus order; disabled controls and the form's authored markup affect that order.

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
Press `Enter` in a single-line field to move to the next one; `Shift`+`Enter`
moves backward. In a textarea, plain `Enter` inserts a newline, `Ctrl`+`Enter`
moves forward, and `Shift`+`Enter` moves backward.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
   formId="nav-enter"
   htmlSource=nav_enter_html
   notes=nav_enter_notes
   selected="preview"
   tests=false
%}

## Tab-Flow Exclusion for Hotkey-Equipped Buttons

Hotkey-equipped `addItem` and `removeItem` triggers inside their list context
are removed from sequential `Tab` order, so a long list does not require
tabbing through every row action. Hotkey-equipped controls outside that list
context remain in `Tab` order, including an outer Add button.

- **Inner buttons** (inside list context): Removed from `Tab` flow — users can
  activate them via their hotkey instead.
- **Outer buttons** (siblings of the list): Kept in `Tab` flow — with
  `min_items: 0`, the only way to create the first item is via the outer
  add button, which must remain keyboard-accessible.

{: .hint }
> This tab-order behavior is limited to list `addItem`/`removeItem` triggers
> with hotkeys in their list context. SmarkForm sets `tabindex="-1"` when the
> trigger has no authored `tabindex`; an explicit authored value is preserved.
> If an action is essential, provide a
> visible control that remains in the normal keyboard order; do not rely on a
> CSS-generated hotkey hint as its only description.

{% raw %}<!-- nav_tabflow_html {{{ -->{% endraw %}
{% capture nav_tabflow_html -%}
<div id="myForm$$">
  <button data-smark='{"action":"addItem","context":"items","hotkey":"+"}' title="Add">➕ Add</button>
  <button data-smark='{"action":"removeItem","context":"items","hotkey":"Delete","preserve_non_empty":true}' title="Remove empty">🧹</button>
  <ul data-smark='{"type":"list","name":"items","min_items":1}'>
    <li>
      <input data-smark type="text" placeholder="Item name">
      <button data-smark='{"action":"removeItem","hotkey":"-"}' title="Remove this">➖</button>
      <button data-smark='{"action":"addItem","hotkey":"+"}' title="Insert here">➕</button>
    </li>
  </ul>
</div>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- nav_tabflow_notes {{{ -->{% endraw %}
{% capture nav_tabflow_notes -%}
Press `Tab` through the form — the outer `➕ Add`/`🧹` buttons are reachable, but the inner `➖`/`➕` buttons inside each list item are skipped. Hold `Ctrl` to reveal their hotkey shortcuts instead.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
   formId="nav-tabflow"
   htmlSource=nav_tabflow_html
   notes=nav_tabflow_notes
   selected="preview"
   tests=false
%}

{: .info :}
> Hold `Ctrl` to discover available hotkeys — each trigger button with a
> hotkey can show a visual hint when the form includes the corresponding CSS.

## Alt+Enter for Collapsed Sections

When navigating with `Enter` / `Shift`+`Enter`, fields inside a closed
`<details>` element are skipped. To navigate into them, hold `Alt` while
pressing `Enter` — SmarkForm automatically opens any closed `<details>`
ancestors along the path. When moving forward from a `<textarea>`, keep `Ctrl`
held as well (`Ctrl`+`Alt`+`Enter`); plain `Enter` inserts a newline there.
For backward navigation into a preceding closed section, use
`Alt`+`Shift`+`Enter`.

This allows you to keep optional sections collapsed by default while still
being able to navigate into them when you need to fill data.

{% raw %}<!-- nav_details_html {{{ -->{% endraw %}
{% capture nav_details_html -%}
<div id="myForm$$">
  <p>
    <label data-smark>Full name:</label>
    <input data-smark type="text" name="name">
  </p>
  <p>
    <label data-smark>Email:</label>
    <input data-smark type="email" name="email">
  </p>
  <details>
    <summary>Optional: Billing Address</summary>
    <p>
      <label data-smark>Street:</label>
      <input data-smark type="text" name="street">
    </p>
    <p>
      <label data-smark>City:</label>
      <input data-smark type="text" name="city">
    </p>
    <p>
      <label data-smark>ZIP:</label>
      <input data-smark type="text" name="zip">
    </p>
  </details>
</div>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- nav_details_notes {{{ -->{% endraw %}
{% capture nav_details_notes -%}
Press `Enter` from the Email field — navigation jumps over the collapsed Billing Address section. Hold `Alt`+`Enter` instead, and SmarkForm opens the `<details>` before moving focus into its first field.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
   formId="nav-details"
   htmlSource=nav_details_html
   notes=nav_details_notes
   selected="preview"
   tests=false
%}

## Using `<details>` as List Items

A powerful design pattern is to wrap each list item in a `<details>` element
with the item's key identifying field placed inside the `<summary>`.  This
way, even when collapsed, the key information remains visible so the user can
quickly scan the list, while the full details expand on click.

SmarkForm fields inside the `<details>` work exactly as they would anywhere
else — the browser handles the show/hide toggle natively. `Shift+Space` on a
field inside a `<summary>` toggles its `<details>` section; on a field in the
open body it folds the section and returns focus within its summary (to its
first focusable child, or to the summary itself). `Alt+Enter`
provides a separate way to navigate into a collapsed section. Use semantic
markup and test focus and announcements with your target assistive technology.
