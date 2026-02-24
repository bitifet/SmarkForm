---
title: «trigger» Component Type
layout: chapter
permalink: /component_types/type_trigger
nav_order: 10000

---

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Introduction](#introduction)
* [Options](#options)
    * [action](#action)
    * [context](#context)
    * [target](#target)
    * [hotkey](#hotkey)
* [Interactions](#interactions)
    * [Hot Keys](#hot-keys)
* [Origin](#origin)
* [Trigger Components](#trigger-components)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>

## Introduction

A *trigger* is any SmarkForm component whose `data-smark` object includes an
`action` property.  When the user interacts with a trigger (by clicking it),
SmarkForm resolves the trigger's *context* and *target*, then calls the
corresponding action on the context component.

Actions can also be called programmatically without any trigger, in which case
*origin* is `null`.

---

## Options

The following properties are read from the `data-smark` object of a trigger
component.  Any additional properties are forwarded as-is to the action handler
as part of the `options` argument.

### action

The name of the action to invoke (e.g. `"export"`, `"addItem"`, `"clear"`).

  * **Type:** string
  * **Required:** yes

### context

Specifies which component receives the action call.

  * **Type:** string (path★)
  * **Default:** the second nearest ancestor of the trigger that implements the action

Accepts an absolute or relative path.  Relative paths are resolved starting
from the trigger's *natural context* (the default ancestor that would have
been picked automatically).

### target

Specifies the component that is the *subject* of the action (e.g., the list
item to be removed).

  * **Type:** string (path★)
  * **Default:** the nearest ancestor of the trigger within its context

### hotkey

A single key character that activates this trigger when the user holds `Ctrl`
and the keyboard focus is inside the trigger's context.

  * **Type:** string (`KeyboardEvent.key` value)
  * **Default:** none (hotkey disabled)

See [Hotkeys]({{ "/advanced_concepts/hotkeys" | relative_url }}) for full
details on how hotkeys work, how they are revealed, and how to avoid conflicts.

---

## Interactions

The only direct interaction for trigger components is a **click** event.
When clicked, the trigger resolves its context and target and calls the action.

### Hot Keys

If a `hotkey` option is defined, the trigger can also be activated by pressing
`Ctrl` + the configured key while keyboard focus is inside the trigger's
context.

Holding `Ctrl` reveals all active hotkeys by setting the `data-hotkey`
attribute on eligible trigger buttons.  Your CSS can use this attribute to
display a visual hint.

---

## Origin

The *origin* of an action is the trigger component from which the action was
invoked.  For programmatic calls (`myForm.find("x").export()`) origin is
`null`.

Action handlers and event hooks can inspect `options.origin` to distinguish
user-initiated actions from programmatic ones.

---

## Trigger Components

