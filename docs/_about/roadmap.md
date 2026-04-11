---
title: Roadmap
layout: chapter
permalink: /about/roadmap
nav_order: 5

---

# {{ page.title }}

<br />
<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Current Status](#current-status)
* [Planned](#planned)
    * [The «API interface»](#the-api-interface)
    * [The «select» component type](#the-select-component-type)
    * [Conditional forms](#conditional-forms)
* [Later](#later)
    * [The «UNDO» component](#the-undo-component)
    * [Infinite lists](#infinite-lists)
    * [Recursive lists](#recursive-lists)
* [Brainstorm](#brainstorm)
    * [«hint» component type](#hint-component-type)
    * [Table Of Contents component](#table-of-contents-component)
    * [Download action](#download-action)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


## Current Status

  * Actively developed and open to enhancements from contributors.

  * **Last Updated:** {{ site.data.computed.lastUpdated }}.


## Planned


### The «API interface»

The *API interface* will allow components to fetch data from remote endpoints
and automatically update when dependent field values change.

The `src` property will accept a URL string, or an array with the endpoint,
optional arguments, and HTTP method. Arguments can reference other fields in
the form by prepending `@` to the property name — those values are resolved at
request time, and the component refreshes automatically whenever they change.

The fetching logic is handled by an interchangeable *adapter*. The default
adapter issues HTTP requests, but it can be replaced with custom
implementations (e.g. GraphQL, mock APIs for testing, or a plain callback that
maps data from another field without any network request at all).

Circular references between mutually dependent fields (such as a country/city
pair of `<select>` components) are handled gracefully: a fetch is skipped when
the relevant values haven't actually changed, preventing infinite loops.


### The «select» component type

The `<select>` component will load its options dynamically through the
[API Interface](#the-api-interface), allowing options (or even `<optgroup>`s)
to depend on the values of other fields and update automatically. Statically
defined options (such as a default "please choose…" entry) will also be
supported.


### Conditional forms

A mechanism to enable or disable a field (which can itself be a form or a
list) based on the values of other fields.

The idea is to specify one or more paths to other fields and an optional
callback to transform them. Whenever any of those fields changes, the callback
is evaluated and the field becomes enabled or disabled accordingly.


## Later


### The «UNDO» component

A wrapper component that sits around any other component and provides
undo/redo history:

  * Listens to change events to capture and store snapshots.
  * Exposes additional `undo` and `redo` actions.
  * Distinguishes its own change events from regular ones to avoid re-caching.


### Infinite lists

Infinite lists with lazy loading through [the API Interface](#the-api-interface).


### Recursive lists

  * `recursive = (path)` — must point to a parent list.
  * `min_items = 0` (forced).
  * `max_recursion` — optional cap; the recursive slot is removed from the
    template when reached.


## Brainstorm

The following are spare and not-yet-mature ideas for possible future
components. They are not commitments — in most cases they would be pluggable
components in their own repository rather than core features.


### «hint» component type

  * Displays hints in a designated location using the `title` attribute of
    trigger components.
  * Intercepts `mouseover` events to show hints when the mouse passes over
    triggers (excluding subcontexts with their own hint component).
  * Could alternatively be implemented as a new action for forms.


### Table Of Contents component

  * Scans a targeted component recursively and refreshes on every structural
    change (items added or removed).
  * Shows only components with a `toc-section` property.
  * Allows navigation via full-path ids and provides a "return to TOC" action.


### Download action

  * Relies on each type's `export` action to serialise data.
  * Downloads exported JSON by default, with optional transformation filters
    for other formats.
  * Allows specifying (or prompting for) the file name.
