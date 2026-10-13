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

  {% include chaptertoc/hotkeys.html depth=2 %}

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
  visual hints on their trigger buttons, so users can discover them on the fly
  rather than needing to memorise a list.  A little CSS setup is needed — see
  [Hotkey Reveal](#hotkey-reveal-ctrl-discovery).


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
/* Anchor the badge to its button */
button { position: relative; }
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

As we already learned, a SmarkForm hotkey is defined *over a trigger component*,
so making an action reachable from the keyboard means placing a trigger that
calls that action **somewhere** in the form — the very same trigger touch users
tap.

{: .info }
> This aligns with SmarkForm's philosophy of offering the same functionality
> regardless of the device or input method: on a touch device you will hardly
> use the keyboard (let alone a hotkey), but you can always tap the button.

There are, nevertheless, cases where a hotkey is convenient but flooding the
form with triggers for a non-essential action would clutter it more than needed.

👉 In the examples above, **every** phone row carries its own `➖` and `➕`
buttons so you can remove or insert a phone *at that exact position*. On a
small screen the buttons at the top of the form are enough — they always act at
the end of the list — yet they cannot target an individual row the way the
buttons attached to the row can.

💡 In this scenario **we can use CSS to hide the per-row triggers** while
keeping their hotkeys working.

{: .warning }
> Keep in mind that if, [like above](#hotkey-reveal-ctrl-discovery), you show the
> hotkey hint through a `::before` or `::after` pseudo-element, you must not hide
> the button with a property that removes it from the box tree, such as
> `display: none;` — that would also prevent the pseudo-element from appearing.
>
> {: .hint }
> > Better use `visibility: hidden;` or `opacity: 0;` to hide the button,
> > together with `width: 0px;` and/or `height: 0px;` as needed to keep it from
> > taking space in the layout.

{% raw %} <!-- hk_hidden_html {{{ --> {% endraw %}
{% capture hk_hidden_html -%}
<div id="myForm$$">
  <p>
    <button data-smark='{"action":"addItem","context":"phones","hotkey":"+"}' title="Add a phone">➕ Add phone</button>
    <button data-smark='{"action":"removeItem","context":"phones","target":"*","preserve_non_empty":true,"hotkey":"Delete"}' title="Remove empty phones">🧹</button>
  </p>
  <ul data-smark='{"type":"list","name":"phones","of":"input"}'>
    <li>
      <label data-smark>📞 Telephone</label>
      <input type="tel" data-smark placeholder="Phone number">
      <button data-smark='{"action":"removeItem","hotkey":"-"}' title="Remove this phone">➖</button>
      <button data-smark='{"action":"addItem","hotkey":"+"}' title="Insert a phone here">➕</button>
    </li>
  </ul>
</div>
{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- hk_hidden_css {{{ --> {% endraw %}
{% capture hk_hidden_css -%}
/* Hotkey hints revealed on Ctrl press */
{{""}}#myForm$$ [data-hotkey] { position: relative; }
{{""}}#myForm$$ [data-hotkey]::after {
    content: "Ctrl+" attr(data-hotkey);
    position: absolute; top: -1.6em; left: 0;
    font-size: 0.7em;
    background: #333; color: #fff;
    padding: 1px 4px; border-radius: 3px;
    white-space: nowrap;
}
/* Hide the per-row ➕/➖ buttons, but keep their hotkeys and hints alive */
{{""}}#myForm$$ li button[data-smark] {
    visibility: hidden;
    width: 0px;
    padding: 0px;
    border: none;
}
{{""}}#myForm$$ li button[data-smark]::after {
    visibility: visible;
}
{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% capture hk_hidden_notes -%}
Hold `Ctrl`: the `+`/`-` hints appear where the per-row buttons used to be —
even though those buttons are now hidden. The always-visible buttons at the top
let touch users add or remove phones (at the end of the list).
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="hk_hidden"
    htmlSource=hk_hidden_html
    cssSource=hk_hidden_css
    notes=hk_hidden_notes
    demoValue='{"phones":["+1 555 0100","+1 555 0101"]}'
    minHeight=45
    selected="preview"
    showEditor=true
    tests=false
%}

This is just a CSS trick rather than a SmarkForm feature, but it helps build
smoother and cleaner forms: when you hold `Ctrl`, the `+`/`-` hints appear next
to the (now hidden) per-row `➖`/`➕` buttons, while the buttons that stay visible
let touch users add or remove phones from the end of the list.


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
