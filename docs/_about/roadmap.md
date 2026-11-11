---
title: Roadmap
layout: chapter
description: "See proposed library capabilities for data binding, validation integration, conditional components, undo, and recursive lists."
permalink: "/about/roadmap"
nav_order: 5
---


{% include links.md %}

# {{ page.title }}

<br />
<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {% include chaptertoc/roadmap.html depth=3 %}

</details>


## Current Status

SmarkForm is pre-1.0 and actively developed. Items in **Planned** and **Later**
are library capabilities that are not current features; **Brainstorm** entries
are uncommitted ideas. None are release commitments. Implemented behavior is
documented in [Features]({{ "/about/features" | relative_url }}) and the
[Component Reference]({{ "/component_reference/overview" | relative_url }}); if
a capability is not described there, do not assume it exists. This Roadmap is
limited to library capabilities; documentation-site work and release-process
proposals belong elsewhere.

Manual drag-and-drop list sorting (`sortable: true`) is already implemented.
Automatic sorting by field value is not scheduled.

  * **Last Updated:** {{ site.data.computed.lastUpdated }}.


## Planned


### The «API interface»

The *API interface* will allow components to fetch data from remote endpoints
and automatically update when dependent field values change.

> **Status:** This proposal is not implemented. See [The API Interface (Planned)]({{ "/guides/the_api_interface" | relative_url }}) for the current status and the existing integration alternatives.

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


### Dynamic options for «select» {#the-select-component-type}

The `<select>` component will load its options dynamically through the
[API Interface](#the-api-interface), allowing options (or even `<optgroup>`s)
to depend on the values of other fields and update automatically. Statically
defined options (such as a default "please choose…" entry) will also be
supported.


### Conditional component enablement

A generic `enable` action could enable or disable an input, form, or list. A
candidate API has an optional boolean `value`: `true` enables, `false` disables,
and an omitted value toggles the current state. The same state could also be
driven by other field values, supporting dependent fields and choosing among
alternative subforms (the earlier “multiforms” idea). This is about component
availability, not validation or automatic hiding.

The current behavior proposal is:

- A form or list is **disableable** only when it contains at least one `enable`
  trigger.
- A disabled form or list retains its internal value but exports `null`; enabling
  it again restores that value.
- Importing `null` into a disableable form or list disables it. For these
  components, `undefined` is treated the same way.
- Importing a valid object into a disableable Form or an array into a disableable
  List enables it and imports the new value.
- For a disableable Form, scalar imports are also treated as `null`. A List keeps
  its existing scalar-to-array coercion instead, so a scalar import enables it
  with one item.
- Forms and lists without an `enable` trigger are not nullable: `null`,
  `undefined`, or an invalid shape should leave them empty, as if cleared. Valid
  list scalars still use the existing array coercion.

This design still needs decisions about how enableability is detected, how a
disabled nested Form/List is represented during parent imports, and how the new
`undefined` behavior coexists with `reset()` (which must continue restoring
defaults), as well as what disabling means for a scalar field's export. For
Lists, malformed non-scalar inputs and the interaction with `min_items` also
need definition.

This capability does not provide validation: it controls whether a component is
available, not whether its value is valid.

### Validation integrations

Provide facilities to connect existing validation libraries or application
validation tools to SmarkForm fields and actions, perhaps through an opt-in
validator factory/hook like the mask integration. The intent is **not** to build
a SmarkForm validation engine or require a particular validator. The integration
API, error presentation, and lifecycle hooks still need design.


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

Ideas in this section are **not plans, commitments, or supported APIs**. Keep an
idea here only while it has a plausible connection to a reusable library
capability; many UI conveniences are better left to application code or plugins.


### Download exported form data

Consider an action that downloads the current form's exported value as JSON or
another transformed format. This is distinct from the implemented file-field
`download` action, which saves a field's original bytes. Assess whether this
convenience belongs in core or is better implemented by application code or a
plugin; no API is proposed here.
