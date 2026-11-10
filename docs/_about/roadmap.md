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

A field, form, or list could be enabled or disabled based on the values of other
fields. This could support choosing among alternative subforms (the earlier
“multiforms” idea), for example by enabling the active subform and disabling the
others.

An explicit `enable` action is also under consideration. One possible API would
accept an optional boolean `value`: `true` enables, `false` disables, and an
omitted value toggles the current state. Conditions could refer to other field
paths and optionally transform their values. The action name, condition syntax,
and how disabled state propagates through forms/lists still need design.

This is separate from validation: the library would control whether a component
is available, not decide whether its value is valid.

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


### Explicit null state

A separate action could set a field or form's value to `null` to represent
“not provided,” distinct from disabling a component, clearing its fields, or
resetting defaults. This is described as future behavior in the [Form
reference]({{ "/component_reference/form" | relative_url }}#future-null-action);
its exact scope and interaction with field types remain to be decided.


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
