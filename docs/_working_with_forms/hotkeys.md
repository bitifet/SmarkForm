---
title: Hotkeys
layout: chapter
permalink: /working_with_forms/hotkeys
nav_order: 2

---

{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Overview](#overview)
* [Defining a Hotkey](#defining-a-hotkey)
* [Hotkey Reveal (Ctrl Discovery)](#hotkey-reveal-ctrl-discovery)
* [Context Sensitivity](#context-sensitivity)
* [Conflict Resolution](#conflict-resolution)
* [Accessibility Considerations](#accessibility-considerations)
* [Further Examples](#further-examples)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


## Overview

SmarkForm supports keyboard shortcuts (*hotkeys*) for trigger components.
Hotkeys let users activate any trigger — `addItem`, `removeItem`, `export`,
`clear`, or any custom action — without reaching for the mouse.

Hotkeys are:

- **Opt-in** — only triggers that declare a `hotkey` option participate.
- **Context-sensitive** — the same key can mean different things depending on
  which component currently has keyboard focus.
- **Discoverable** — pressing and holding `Ctrl` reveals all active hotkeys as
  visual hints on their trigger buttons.


## Defining a Hotkey

Add the `hotkey` property to a trigger's `data-smark` object:

{% raw %} <!-- hk_define_html {{{ --> {% endraw %}
{% capture hk_define_html -%}
<div id="myForm$$">
  <button data-smark='{"action":"addItem","context":"phones","hotkey":"+"}' title="Add phone">➕ Add Phone</button>
  <ul data-smark='{"type":"list","name":"phones"}'>
    <li>
      <input type="tel" data-smark placeholder="Phone number">
      <button data-smark='{"action":"removeItem","hotkey":"-"}' title="Remove">➖</button>
    </li>
  </ul>
</div>
{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- hk_define_notes {{{ --> {% endraw %}
{% capture hk_define_notes -%}
Hold `Ctrl` to reveal the `+` and `-` hotkey hints on the buttons. Press `Ctrl`+`+` to add a phone, `Ctrl`+`-` to remove one. The `hotkey` value must match `KeyboardEvent.key` (e.g. `"+"`, `"-"`, `"Enter"`, single letters).
{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
   formId="hk-define"
   htmlSource=hk_define_html
   notes=hk_define_notes
   selected="html"
   tests=false
%}

The value of `hotkey` must match the browser's `KeyboardEvent.key` string for
the desired key (e.g. `"+"`, `"-"`, `"s"`, `"Enter"`, …).  Single printable
characters are the most portable and least likely to conflict with browser or
OS shortcuts.


## Hotkey Reveal (Ctrl Discovery)

When the user **presses and holds `Ctrl`**, SmarkForm:

1. Finds all trigger components that have a `hotkey` option and whose context
   is an ancestor (or sibling ancestor) of the currently focused element.
2. Sets the `data-hotkey` attribute on each matching trigger button to the
   configured key character.

Your CSS can use this attribute to show a visual hint:

{% raw %} <!-- hk_reveal_css {{{ --> {% endraw %}
{% capture hk_reveal_css -%}
/* Show hotkey badge on the button */
[data-hotkey]::after {
    content: "Ctrl+" attr(data-hotkey);
    position: absolute; top: -1.6em; left: 0;
    font-size: 0.7em;
    background: #333; color: #fff;
    padding: 1px 4px; border-radius: 3px;
    white-space: nowrap;
}
{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- hk_reveal_notes {{{ --> {% endraw %}
{% capture hk_reveal_notes -%}
The `data-hotkey` attribute is added to hotkey-equipped trigger buttons while `Ctrl` is held. Style its `::after` pseudo-element to create a floating tooltip. The button must have `position: relative` for the absolute-positioned badge.
{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
   formId="hk-reveal"
   htmlSource=hk_define_html
   cssSource=hk_reveal_css
   notes=hk_reveal_notes
   selected="css"
   tests=false
%}

When `Ctrl` is **released**, the `data-hotkey` attributes are removed and the
hints disappear.

Pressing a key **while `Ctrl` is held** activates the matching trigger (if one
was revealed).

{: .hint }
> Holding `Ctrl+Alt` reveals a **second level** of hotkeys.  This is useful
> when the same key is used for multiple actions at different nesting levels —
> pressing `Ctrl` shows the innermost one, `Ctrl+Alt` shows an outer one.


## Context Sensitivity

Hotkeys are **scoped to the focus context**.  The same key binding can be
re-used in different parts of the form without conflict:

{% raw %} <!-- hotkeys_context_sensitivity {{{ --> {% endraw %}
{% capture hotkeys_context_sensitivity_html -%}
<div id="myForm$$">
  <ul data-smark='{"type":"list","name":"users"}'>
    <li>
      <input data-smark type="text" name="name" placeholder="User name">
      <ul data-smark='{"type":"list","name":"phones"}'>
        <li>
          <input type="tel" data-smark name="phone" placeholder="Phone">
          <!-- Ctrl+- removes a phone when focus is inside the phones list -->
          <button data-smark='{"action":"removeItem","hotkey":"-"}'>➖ Phone</button>
        </li>
      </ul>
      <button data-smark='{"action":"addItem","context":"phones","hotkey":"+"}'>➕ Add phone</button>
      <!-- Ctrl+- removes a user when focus is at the user level (outside phones) -->
      <button data-smark='{"action":"removeItem","hotkey":"-"}'>➖ Remove user</button>
    </li>
  </ul>
  <button data-smark='{"action":"addItem","context":"users","hotkey":"+"}'>➕ Add user</button>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- hotkeys_context_sensitivity_css {{{ --> {% endraw %}
{% capture hotkeys_context_sensitivity_css -%}
/* Hold Ctrl to reveal hotkey hints */
button{position:relative}
[data-hotkey]::after{
    content:"Ctrl+" attr(data-hotkey);
    position:absolute; top:-1.6em; left:0;
    font-size:0.7em;
    background:#333; color:#fff;
    padding:1px 4px; border-radius:3px;
    white-space:nowrap;
}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="hotkeys_context_sensitivity"
    htmlSource=hotkeys_context_sensitivity_html
    cssSource=hotkeys_context_sensitivity_css
    demoValue='{"users":[{"name":"Alice","phones":[{"phone":"555-1234"}]},{"name":"Bob","phones":[{"phone":"555-5678"}]}]}'
    tests=false
%}

When the focus is inside the `phones` list, pressing `Ctrl+-` removes a phone.
When focus is at the user level (but not inside `phones`), `Ctrl+-` removes the
user instead.


## Conflict Resolution

When two triggers share the same hotkey at the same context level, SmarkForm
uses the following priority rules to decide which one fires:

1. **Distance from focus** — triggers whose context is a *closer* ancestor of
   the focused element are preferred.
2. **Containment** — when distance is equal, a trigger whose `target` contains
   the focused element takes precedence over a sibling trigger.

Only the highest-priority trigger for each key is revealed and activated.
Lower-priority duplicates are silently ignored.

{: .info }
> A trigger that is **disabled** at the moment the hotkey is pressed will not
> fire, even if it was revealed.  The `data-hotkey` attribute is also omitted
> from disabled buttons so they do not appear in the visual hints.

## Hiding Trigger Buttons (While Keeping Hotkeys)

Some actions (like per-item add/remove buttons in long lists) are non-essential
and their buttons clutter the form. You can hide them with CSS while keeping
their hotkeys active — touch users still tap the visible outer buttons, while
keyboard users activate the hidden ones via hotkeys.

**Critical CSS rule:** Do NOT use `display: none` — it removes the element from
the layout and kills `::before`/`::after` pseudo-elements, which means hotkey
hints won't appear when the user holds `Ctrl`. Instead, use `visibility: hidden`
combined with `width: 0` (or `height: 0`):

```css
/* Hide per-item buttons but preserve hotkey hints */
li.row button[data-smark] {
    visibility: hidden;
    width: 0px;
    pointer-events: none;
}
li.row button[data-smark]::before {
    visibility: visible;
}
```

## Accessibility Considerations

- **Avoid browser-reserved combinations** — `Ctrl+C`, `Ctrl+V`, `Ctrl+Z`,
  `Ctrl+A`, `F1`–`F12`, `Alt+F4`, etc. are used by browsers and operating
  systems.  Prefer punctuation characters (`+`, `-`, `n`, `d`, …) that are
  not typically claimed.
- **Provide visible alternatives** — hotkeys are a convenience feature.  Every
  action that has a hotkey should also be reachable with the mouse so that
  users on touch devices or those who do not discover the hotkeys can still
  operate the form.
- **Label your buttons** — use `title` attributes or visible text on trigger
  buttons so their purpose is clear even without hotkey hints.


## Further Examples

When inner and outer list items share the same hotkey (e.g. `Ctrl`+`-` for
removing both a phone AND a contact entry), the innermost matching context
wins by default. To reach the outer-level action, hold `Ctrl`+`Alt` instead —
this **suppresses inner hotkeys** and reveals the next level out.

{% raw %} <!-- hk_2ndlevel_html {{{ --> {% endraw %}
{% capture hk_2ndlevel_html -%}
<div id="myForm$$">
  <div data-smark='{"type":"list","name":"phonelist"}'>
    <fieldset>
      <legend>
        <input name="name" data-smark placeholder="Name">
        <button data-smark='{"action":"removeItem","hotkey":"-"}' title="Remove">➖</button>
      </legend>
      <button data-smark='{"action":"addItem","context":"phones","hotkey":"+"}' title="Add phone">➕ Add phone</button>
      <ul data-smark='{"type":"list","name":"phones"}'>
        <li>
          <input type="tel" data-smark placeholder="Phone">
          <button data-smark='{"action":"removeItem","hotkey":"-"}' title="Remove">➖</button>
        </li>
      </ul>
    </fieldset>
  </div>
  <button data-smark='{"action":"addItem","context":"phonelist","hotkey":"+"}' title="Add entry">➕ Add entry</button>
</div>
{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- hk_2ndlevel_notes {{{ --> {% endraw %}
{% capture hk_2ndlevel_notes -%}
`Ctrl`+`-` removes a phone when focus is inside the `phones` list, but removes the whole entry when focus is outside it. Press `Ctrl`+`Alt` to reveal the 2nd-level `+` hotkey on the outer "Add entry" button.
{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
   formId="hk-2ndlevel"
   htmlSource=hk_2ndlevel_html
   notes=hk_2ndlevel_notes
   selected="preview"
   tests=false
%}

The [Showcase]({{ "/about/showcase" | relative_url }}) contains exhaustive
real-world examples that demonstrate hotkeys in context, including nested
lists, multi-level hotkey levels, and mixed trigger layouts.
