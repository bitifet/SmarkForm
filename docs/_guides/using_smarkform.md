---
title: "Using SmarkForm"
layout: chapter
description: "Build a practical nested form with SmarkForm, add list actions, and import or export structured values."
permalink: "/guides/using_smarkform"
nav_order: 1
---

{% include links.md %}
{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

This guide is for developers building forms from HTML they control. It assumes
you have seen the [Quick Start]({{ "/start_here/quick_start" | relative_url }})
and [Core Concepts]({{ "/start_here/core_concepts" | relative_url }}). We will
extend a workshop form with a nested organizer and an attendee list, then
connect the markup to application code.

<details class="chaptertoc">
<summary><strong>📖 Table of Contents</strong></summary>

  {% include chaptertoc/using_smarkform.html depth=2 %}

</details>

## Build and explore a nested form

The root element becomes a form component. Named forms create object properties;
lists create arrays. The playground below combines both, with an explicit
`clear` context, list `addItem`/`removeItem` actions, and an export event hook.

{% raw %}<!-- using_workshop_html {{{ -->{% endraw %}
{% capture using_workshop_html -%}
<div id="myForm$$">
  <fieldset data-smark='{"type":"form","name":"workshop"}'>
    <legend>Workshop</legend>
    <p><label data-smark>Title:</label><input name="title" type="text" data-smark></p>
    <fieldset data-smark='{"type":"form","name":"organizer"}'>
      <legend>Organizer</legend>
      <p><label data-smark>Name:</label><input name="name" type="text" data-smark></p>
      <p><label data-smark>Email:</label><input name="email" type="email" data-smark></p>
    </fieldset>
    <button data-smark='{"action":"clear","context":"organizer"}'>Clear organizer</button>
    <p>Attendees:</p>
    <ul data-smark='{"type":"list","name":"attendees","min_items":0,"max_items":8}'>
      <li>
        <label data-smark>Name:</label>
        <input name="name" type="text" data-smark>
        <button data-smark-action="removeItem">Remove attendee</button>
      </li>
    </ul>
    <button data-smark='{"action":"addItem","context":"attendees"}'>Add attendee</button>
  </fieldset>
</div>{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- using_workshop_js {{{ -->{% endraw %}
{% capture using_workshop_js -%}
myForm.on("AfterAction_export", ({data, origin}) => {
    console.log(origin ? "Export triggered by a component:" : "Programmatic export:", data);
});
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- using_workshop_notes {{{ -->{% endraw %}
{% capture using_workshop_notes -%}
**Try it:** Change the title or organizer, then use the playground's **Export**
control to inspect the object. Click **Clear organizer**, or add and remove
attendees. The example's export handler also logs each value to the browser
console.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- using_workshop_demoValue {{{ -->{% endraw %}
{% capture using_workshop_demoValue -%}
{
  "workshop": {
    "title": "SmarkForm Basics",
    "organizer": { "name": "Ada Lovelace", "email": "ada@example.com" },
    "attendees": [
      { "name": "Grace Hopper" },
      { "name": "Katherine Johnson" }
    ]
  }
}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="using_smarkform_workshop"
    htmlSource=using_workshop_html
    jsSource=using_workshop_js
    notes=using_workshop_notes
    demoValue=using_workshop_demoValue
    showEditor=true
    tests=false
    minHeight=35
%}

The exported value has one top-level `workshop` object. Its named `organizer`
form is nested inside that object, while `attendees` is an array of item
objects:

```json
{
  "workshop": {
    "title": "SmarkForm Basics",
    "organizer": { "name": "Ada Lovelace", "email": "ada@example.com" },
    "attendees": [
      { "name": "Grace Hopper" },
      { "name": "Katherine Johnson" }
    ]
  }
}
```

Ordinary markup such as `<fieldset>` and `<p>` controls layout; it does not
become part of the data tree.

## Understand the actions in the example

The **Clear organizer** button uses an explicit relative context. The button is
inside the `workshop` form, so `"context":"organizer"` selects its child form.
An explicit context path starts at the trigger's enclosing field and must
resolve to a component that implements the action.

The external **Add attendee** button uses `"context":"attendees"` to call
`addItem` on the list. Each **Remove attendee** trigger sits inside an item: its
natural context is the list, and its placement identifies the item to remove.
These paths remain relative inside the playground's editor wrapper.

`context` and `target` serve different roles. Context selects the component
that performs an action; an explicit target is resolved from that effective
context. For `export`, data flows from context to target; for `import`, it flows
from target to context. See the [Trigger reference]({{ "/component_reference/trigger" | relative_url }})
and [Form Traversing]({{ "/guides/form_traversing" | relative_url }}) for exact
path bases, list-item defaults, and wildcard behavior.

## Import and export from JavaScript

The playground's **Export** and **Import** controls are convenient while
building the form. In an application, you can call the same actions directly:

```javascript
async function saveWorkshop(myForm) {
    await myForm.rendered;
    const data = await myForm.export();
    await fetch("/api/workshops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

async function loadWorkshop(myForm, data) {
    await myForm.rendered;
    await myForm.import(data);
}
```

The sample's `AfterAction_export` handler illustrates where application code can
observe an export. For server requests, async imports, defaults, and action
lifecycle details, see [Data Import and Export]({{ "/guides/data_import_and_export" | relative_url }})
and [Events]({{ "/guides/events" | relative_url }}).

You can also guard a destructive action before it runs. This application-side
handler asks for confirmation only when the context contains data:

```javascript
myForm.on("BeforeAction_clear", async ({ context, preventDefault }) => {
    if (!await context.isEmpty() && !window.confirm("Clear these values?")) {
        preventDefault();
    }
});
```

`BeforeAction_clear` is cancellable, and `context.isEmpty()` checks the component
the action would clear. Modal dialogs may be blocked inside sandboxed previews;
use an inline confirmation UI there.

For user submission, a real `<form>` supports browser submission; a non-form
root is also valid for JSON-driven workflows. SmarkForm does not provide a
validation rule engine. Native constraints apply to browser form submission;
other flows need application validation. See the [FAQ]({{ "/about/faq" | relative_url }})
for native submission and validation details.

## Find a component after rendering

Use `find()` when application code needs a particular component. Wait for the
root form to finish rendering first:

```javascript
async function readOrganizerEmail(myForm) {
    await myForm.rendered;
    const emailField = myForm.find("workshop/organizer/email");
    return await emailField.export();
}
```

This path follows component names in the data model. `find()` does not search
recursively; each segment selects a direct child. The
[Form Traversing guide]({{ "/guides/form_traversing" | relative_url }}) covers
absolute and relative paths, wildcards, sibling navigation, and action contexts.

## Choose the next topic

- [Events]({{ "/guides/events" | relative_url }}) — handle action lifecycle
  events and submit values to an API.
- [Data Import and Export]({{ "/guides/data_import_and_export" | relative_url }}) —
  work with defaults, resets, and payloads.
- [Component Reference]({{ "/component_reference/overview" | relative_url }}) —
  look up component types, actions, and options.
- [SmarkForm Constructor]({{ "/advanced_topics/the_smarkform_constructor" | relative_url }}) —
  review root options and API registration.
- [Field Masking]({{ "/guides/field_masking" | relative_url }}),
  [Hotkeys]({{ "/accessibility/hotkeys" | relative_url }}), and
  [Animations]({{ "/guides/animations" | relative_url }}) — add focused
  interactions and presentation after the data model works.
- [Getting SmarkForm]({{ "/start_here/getting_smarkform" | relative_url }}) —
  choose npm, ESM, UMD, or a local copy.
- [Download]({{ "/start_here/download" | relative_url }}) — get the browser
  builds and boilerplate files.
