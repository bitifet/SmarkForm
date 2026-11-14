---
title: "Hotkeys"
layout: chapter
description: "Use Ctrl-based shortcuts on SmarkForm triggers, discover visual hotkey hints, and understand focus context and conflicts."
permalink: "/accessibility/hotkeys"
nav_order: 2
redirect_from:
  - "/working_with_forms/hotkeys"
---


{% include links.md %}
{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {% include chaptertoc/hotkeys.html depth=2 %}

</details>


## Overview

SmarkForm supports keyboard shortcuts (*hotkeys*) for configured trigger
components. A hotkey can activate actions such as `addItem`, `removeItem`,
`export`, or `clear` when its trigger is active in the current focus context.

Hotkeys are:

- **Opt-in** — only triggers that declare a `hotkey` option participate.
- **Context-sensitive** — the same key can mean different things depending on
  which component currently has keyboard focus.
- **Discoverable** — pressing and holding `Ctrl` reveals all active hotkeys as
  visual hints on their trigger buttons, so users can discover them on the fly
  rather than needing to memorise a list.  A little CSS setup is needed — see
  [Hotkey Reveal](#hotkey-reveal-ctrl-discovery).

SmarkForm checks the `Ctrl` modifier; it does not treat macOS `Cmd`/`Meta` as
the hotkey modifier. Reveal hints are CSS-generated visual content, and their
exposure to assistive technology has not been verified. Do not rely on a hint
as the only accessible name or description for an action.


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
    position: absolute; top: 0.75em; left: 0;
    font-size: 0.7em;
    background: #333; color: #fff;
    padding: 1px 4px; border-radius: 3px;
    white-space: nowrap;
}
{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- hk_reveal_notes {{{ --> {% endraw %}
{% capture hk_reveal_notes -%}
The `data-hotkey` attribute is added to hotkey-equipped trigger buttons while
`Ctrl` is held. This CSS places the `::after` badge over the button; the button
must have `position: relative` for the absolute-positioned hint.
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
  <div class="phonebook">
    <ul data-smark='{"type":"list","name":"users"}' class="contact-list">
      <li>
        <article class="contact-card">
          <header class="contact-heading">
            <strong>Contact <span data-smark-action="position">1</span></strong>
            <button data-smark='{"action":"removeItem","hotkey":"-"}' type="button" title="Remove contact" aria-label="Remove contact">🗑</button>
          </header>
          <div class="contact-fields">
            <label>Name<input data-smark type="text" name="name" placeholder="First name"></label>
            <label>Surname<input data-smark type="text" name="surname" placeholder="Last name"></label>
          </div>
          <section class="phone-section">
            <strong>Phone numbers</strong>
            <ul data-smark='{"type":"list","name":"phones"}' class="phone-list">
              <li class="phone-row">
                <label data-smark class="phone-label">📞 Telephone <span data-smark-action="position">1</span></label>
                <input type="tel" data-smark name="phone" placeholder="Phone number">
                <button data-smark='{"action":"removeItem","hotkey":"-"}' type="button" title="Remove phone" aria-label="Remove phone">✕</button>
              </li>
            </ul>
            <button data-smark='{"action":"addItem","context":"phones","hotkey":"+"}' type="button" title="Add phone" aria-label="Add phone">➕ Phone</button>
          </section>
        </article>
      </li>
    </ul>
    <footer class="phonebook-footer">
      <span>Total contacts: <strong data-smark='{"action":"count","context":"users"}'>0</strong></span>
      <button data-smark='{"action":"addItem","context":"users","hotkey":"+"}' type="button" title="Add contact" aria-label="Add contact">➕ Contact</button>
    </footer>
  </div>
</div>{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- hotkeys_context_sensitivity_css {{{ --> {% endraw %}
{% capture hotkeys_context_sensitivity_css -%}
{{""}}#myForm$$ .phonebook { max-width: 34rem; font-family: system-ui, sans-serif; }
{{""}}#myForm$$ .contact-list, {{""}}#myForm$$ .phone-list { list-style: none; margin: 0; padding: 0; }
{{""}}#myForm$$ .contact-list { display: grid; gap: .65rem; }
{{""}}#myForm$$ .contact-card { padding: .55rem .75rem .75rem; border: 1px solid #d7dfeb; border-radius: .65rem; background: linear-gradient(135deg, #fff, #f8fafc); }
{{""}}#myForm$$ .contact-heading { display: flex; align-items: center; justify-content: space-between; gap: .5rem; margin-bottom: .5rem; color: #334155; }
{{""}}#myForm$$ .contact-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .5rem; }
{{""}}#myForm$$ .contact-fields label { display: grid; gap: .2rem; color: #475569; font-size: .8rem; }
{{""}}#myForm$$ .contact-fields input, {{""}}#myForm$$ .phone-row input { width: 100%; min-width: 0; box-sizing: border-box; }
{{""}}#myForm$$ .phone-section { margin-top: .65rem; padding-top: .55rem; border-top: 1px solid #e2e8f0; }
{{""}}#myForm$$ .phone-section > strong { display: block; margin-bottom: .25rem; color: #475569; font-size: .85rem; }
{{""}}#myForm$$ .phone-row { display: grid; grid-template-columns: minmax(7.5rem, auto) minmax(0, 1fr) auto; align-items: center; gap: .4rem; padding: .25rem 0; }
{{""}}#myForm$$ .phone-label { color: #475569; white-space: nowrap; }
{{""}}#myForm$$ .phonebook button { padding: .25rem .5rem; }
{{""}}#myForm$$ .phonebook-footer { display: flex; justify-content: space-between; align-items: center; gap: .5rem; margin-top: .55rem; color: #64748b; font-size: .85rem; }
{{""}}@media (max-width: 26rem) { #myForm$$ .contact-fields { grid-template-columns: 1fr; } #myForm$$ .phone-row { grid-template-columns: minmax(6.5rem, auto) minmax(0, 1fr) auto; gap: .25rem; } }
/* Hold Ctrl to reveal hotkey hints */
{{""}}#myForm$$ button { position: relative; }
{{""}}#myForm$$ [data-hotkey]::after {
    content:"Ctrl+" attr(data-hotkey);
    position:absolute; top:0.75em; left:0;
    font-size:0.7em;
    background:#333; color:#fff;
    padding:1px 4px; border-radius:3px;
    white-space:nowrap;
}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %}<!-- hotkeys_context_sensitivity_notes {{{ -->{% endraw %}
{% capture hotkeys_context_sensitivity_notes -%}
👉 **Try it!** Focus a phone number and hold **Ctrl**: `-` removes that phone.
Focus a contact name instead and the same shortcut removes the contact. The
`+` shortcut adds a phone within its list or a contact at the outer level.

> See [List Type]({{ "/component_reference/list" | relative_url }}) for nested
> lists and [Conflict Resolution](#conflict-resolution) for hotkey priority.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% capture hotkeys_context_sensitivity_demoValue -%}
{"users":[{"name":"Alice","surname":"Johnson","phones":[{"phone":"555-0142"},{"phone":"555-0188"}]},{"name":"Sam","surname":"Rivera","phones":[{"phone":"555-0126"}]}]}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="hotkeys_context_sensitivity"
    htmlSource=hotkeys_context_sensitivity_html
    cssSource=hotkeys_context_sensitivity_css
    notes=hotkeys_context_sensitivity_notes
    demoValue=hotkeys_context_sensitivity_demoValue
    showEditor=true
    tests=false
%}

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
> through multiple input methods. When the form provides a visible button, touch
> users can tap it; ensure essential actions are not available only through a
> hotkey or a visually hidden trigger.

There are cases where a hotkey is convenient but flooding the form with
triggers for a non-essential action would clutter it more than needed. The
following CSS example hides only redundant row controls; its generated visual
hints have not been verified with assistive technology.

Use this hiding pattern only for redundant convenience controls. Do not hide
the only control for an essential action: a CSS-generated hint is visual and
its accessibility-tree exposure is not verified. Keep essential actions
available through visible, keyboard-reachable controls with meaningful names.

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
  <div class="simple-phones">
    <div class="phone-controls">
      <strong data-smark="label">📞 Phones</strong>
      <button data-smark='{"action":"addItem","context":"phones","hotkey":"+"}' type="button" title="Add phone">➕ Add</button>
      <button data-smark='{"action":"removeItem","context":"phones","hotkey":"-"}' type="button" title="Remove last phone">➖ Remove</button>
    </div>
    <ul data-smark='{"type":"list","name":"phones","of":"input"}' class="phone-number-list">
      <li class="phone-row">
        <label data-smark>📞 Telephone <span data-smark-action="position">1</span></label>
        <input type="tel" data-smark placeholder="Phone number">
        <button data-smark='{"action":"removeItem","hotkey":"-"}' type="button" title="Remove this phone" aria-label="Remove this phone">➖</button>
        <button data-smark='{"action":"addItem","hotkey":"+"}' type="button" title="Insert a phone here" aria-label="Insert a phone here">➕</button>
      </li>
    </ul>
  </div>
</div>
{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- hk_hidden_css {{{ --> {% endraw %}
{% capture hk_hidden_css -%}
/* Hotkey hints revealed on Ctrl press */
{{""}}#myForm$$ [data-hotkey] { position: relative; }
{{""}}#myForm$$ [data-hotkey]::after {
    content: "Ctrl+" attr(data-hotkey);
    position: absolute; top: 0.75em; left: 0;
    font-size: 0.7em;
    background: #333; color: #fff;
    padding: 1px 4px; border-radius: 3px;
    white-space: nowrap;
}
{{""}}#myForm$$ .simple-phones { max-width: 32rem; font-family: system-ui, sans-serif; }
{{""}}#myForm$$ .phone-controls { display: flex; flex-wrap: wrap; align-items: center; gap: .4rem; margin-bottom: .3rem; color: #334155; }
{{""}}#myForm$$ .phone-controls strong { margin-right: auto; }
{{""}}#myForm$$ .phone-number-list { list-style: none; margin: 0; padding: 0; }
{{""}}#myForm$$ .phone-row { display: grid; grid-template-columns: minmax(7.5rem, auto) minmax(0, 1fr) auto auto; align-items: center; gap: .4rem; padding: .3rem 0; border-bottom: 1px solid #e2e8f0; }
{{""}}#myForm$$ .phone-row label { color: #475569; white-space: nowrap; }
{{""}}#myForm$$ .phone-row input { min-width: 0; box-sizing: border-box; }
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
Hold `Ctrl`: the `+`/`-` hints appear on the per-row controls, even though those
buttons are hidden. The always-visible controls add or remove phones at the end
of the list; the numbered labels keep each row easy to identify.

> See [Hotkey Reveal](#hotkey-reveal-ctrl-discovery) for how the hints appear and
> [Accessible Labels]({{ "/accessibility/accessible_labels_and_names" | relative_url }})
> for naming controls.
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
- **Provide suitable alternatives** — hotkeys are a convenience feature.
  Essential actions need visible, keyboard-reachable controls; do not make a
  hotkey or generated visual hint their only access path.
- **Give controls accessible names** — prefer visible button text; for an
  icon-only button, supply an appropriate accessible name. A `title` tooltip is
  supplemental and does not replace good control text.


## Further Examples

When inner and outer list items share the same hotkey (e.g. `Ctrl`+`-` for
removing both a phone AND a contact entry), the innermost matching context
wins by default. To reach the outer-level action, hold `Ctrl`+`Alt` instead —
this **suppresses inner hotkeys** and reveals the next level out.

{% raw %} <!-- hk_2ndlevel_html {{{ --> {% endraw %}
{% capture hk_2ndlevel_html -%}
<div id="myForm$$">
  <div class="phonebook">
    <ul data-smark='{"type":"list","name":"phonelist"}' class="contact-list">
      <li>
        <article class="contact-card">
          <header class="contact-heading">
            <strong>Contact <span data-smark-action="position">1</span></strong>
            <button data-smark='{"action":"removeItem","hotkey":"-"}' type="button" title="Remove contact" aria-label="Remove contact">🗑</button>
          </header>
          <div class="contact-fields">
            <label>Name<input data-smark type="text" name="name" placeholder="First name"></label>
            <label>Surname<input data-smark type="text" name="surname" placeholder="Last name"></label>
          </div>
          <section class="phone-section">
            <strong>Phone numbers</strong>
            <ul data-smark='{"type":"list","name":"phones"}' class="phone-list">
              <li class="phone-row">
                <label data-smark class="phone-label">📞 Telephone <span data-smark-action="position">1</span></label>
                <input type="tel" data-smark name="phone" placeholder="Phone number">
                <button data-smark='{"action":"removeItem","hotkey":"-"}' type="button" title="Remove phone" aria-label="Remove phone">✕</button>
              </li>
            </ul>
            <button data-smark='{"action":"addItem","context":"phones","hotkey":"+"}' type="button" title="Add phone" aria-label="Add phone">➕ Phone</button>
          </section>
        </article>
      </li>
    </ul>
    <footer class="phonebook-footer">
      <span>Total contacts: <strong data-smark='{"action":"count","context":"phonelist"}'>0</strong></span>
      <button data-smark='{"action":"addItem","context":"phonelist","hotkey":"+"}' type="button" title="Add contact" aria-label="Add contact">➕ Contact</button>
    </footer>
  </div>
</div>
{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- hk_2ndlevel_notes {{{ --> {% endraw %}
{% capture hk_2ndlevel_notes -%}
👉 **Try it!** With focus in a phone number, `Ctrl`+`-` removes that phone and
`Ctrl`+`+` adds another. Press **Ctrl**+**Alt** to reveal the outer `+` shortcut;
then press `+` to add a contact. Numbered phone labels and the contact count
make the changing list structure easy to follow.

> See [Context Sensitivity](#context-sensitivity) for the first-level behavior
> and [List Type]({{ "/component_reference/list" | relative_url }}) for nested
> lists and item actions.
{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% capture hk_2ndlevel_demoValue -%}
{"phonelist":[{"name":"Alex","surname":"Morgan","phones":[{"phone":"555-0142"},{"phone":"555-0188"}]},{"name":"Jamie","surname":"Lee","phones":[{"phone":"555-0126"}]}]}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- hk_2ndlevel_tests {{{ -->{% endraw %}
{% capture hk_2ndlevel_tests -%}
export default async ({ page, expect, root }) => {
    await expect(root).toBeVisible();
    await expect(root.locator('.contact-list > li')).toHaveCount(1);
    await expect(root.locator('.phone-label').nth(0)).toContainText('Telephone 1');
    await expect(root.locator('.phonebook-footer')).toContainText('1');
    const phone = root.locator('input[type="tel"]').first();
    const addPhone = root.locator('button[title="Add phone"]').first();
    const addEntry = root.locator('button[title="Add contact"]');

    await addPhone.click();
    await expect(root.locator('.phone-label').nth(1)).toContainText('Telephone 2');
    await phone.focus();
    await page.keyboard.down('Control');
    await expect(addPhone).toHaveAttribute('data-hotkey', '+');
    await expect(addEntry).not.toHaveAttribute('data-hotkey');

    await page.keyboard.down('Alt');
    await expect(addEntry).toHaveAttribute('data-hotkey', '+');
    await page.keyboard.up('Alt');
    await page.keyboard.up('Control');
};
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
   formId="hk-2ndlevel"
   htmlSource=hk_2ndlevel_html
   cssSource=hotkeys_context_sensitivity_css
   notes=hk_2ndlevel_notes
   demoValue=hk_2ndlevel_demoValue
   showEditor=true
   selected="preview"
   tests=hk_2ndlevel_tests
%}

The [Showcase]({{ "/showcase_examples/showcase" | relative_url }}) contains
examples of hotkeys in context, including nested lists and mixed trigger layouts.
