---
title: Hotkeys
layout: chapter
permalink: /advanced_concepts/hotkeys
nav_order: 3

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

```html
<!-- Add a new list item with Ctrl+Plus -->
<button data-smark='{"action":"addItem","context":"phones","hotkey":"+"}'>
    ➕ Add Phone
</button>

<!-- Remove the current item with Ctrl+Minus -->
<button data-smark='{"action":"removeItem","hotkey":"-"}'>
    ➖ Remove
</button>
```

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

Your CSS can use this attribute to show a visual hint.  SmarkForm's bundled
sample CSS shows a small floating badge — you can style it any way you like:

```css
/* Example: show hotkey badge on the button */
[data-hotkey]::after {
    content: "Ctrl+" attr(data-hotkey);
    position: absolute;
    /* … your positioning and style … */
}
```

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
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- hotkeys_context_sensitivity_css {{{ --> {% endraw %}
{% capture hotkeys_context_sensitivity_css -%}
/* Hold Ctrl to reveal hotkey hints */
button { position: relative; }
[data-hotkey]::after {
    content: "Ctrl+" attr(data-hotkey);
    position: absolute;
    top: -1.6em;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.7em;
    background: #333;
    color: #fff;
    padding: 1px 4px;
    border-radius: 3px;
    white-space: nowrap;
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

The [Showcase]({{ "/about/showcase" | relative_url }}) contains exhaustive
real-world examples that demonstrate hotkeys in context, including nested
lists, multi-level hotkey levels, and mixed trigger layouts.
