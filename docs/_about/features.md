---
title: Features
layout: chapter
permalink: /about/features
nav_order: 3

---

# {{ page.title }}


<br />
<div class="chaptertoc toplevel">
<p>A web form must be:</p>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Markup agnostic](#markup-agnostic)
* [Easy to use (low-code)](#easy-to-use-low-code)
* [Nestable forms](#nestable-forms)
* [Variable-length lists](#variable-length-lists)
* [Context driven hotkeys](#context-driven-hotkeys)
* [Consistent User Experience](#consistent-user-experience)
* [A11Y friendly](#a11y-friendly)
* [JSON based](#json-based)
* [Lightweight yet highly compatible](#lightweight-yet-highly-compatible)
* [Flexible and extendable](#flexible-and-extendable)
* [Directory-like addressability](#directory-like-addressability)
* [Reliability-oriented](#reliability-oriented)
* [AI-agent ready](#ai-agent-ready)

<!-- vim-markdown-toc -->
       " | markdownify }}

</div>


## Markup agnostic

Leverage your existing HTML and CSS knowledge to create powerful forms with no
effort.

  * Markup-driven and Intuitive API

    - Just add the *data-smark* attribute to form fields to
      enhance them:
      ```html
      <input name="user" type="text" data-smark>
      ```
    - And initialize the form with a single line of JavaScript:
      ```javascript
      const myForm = new SmarkForm(form_container);
      ```

  * Does not impose any specific HTML structure or CSS design rules.

    - Designers have complete freedom.

    - Developers don't have to worry about layout changes.


👉  See the [Quick Start]({{ "/getting_started/quick_start" | relative_url }})
section for more details.


## Easy to use (low-code)

  * *Zero-Wiring*: Controls (called *trigger* components) reach their target
    fields by its *context* (position in the form) or by relative paths within
    the form.
    ```html
    <button data-smark='{"action": "addItem", "context": "contacts"}'>➕ Add contact</button>
    <button data-smark='{"action": "export"}'>💾 Save</button>
    ```

  * To handle data import and export from your own code, you just have to
    listen to `onBeforeAction_import` and `onAfterAction_export` events.
    ```javascript
    myForm.on("afterAction_export", ({data}) => {
        console.log("Exported data:", data);
    });
    ```

  * Of course, you can also call the `.import()` and `.export()` methods of
    the whole form (or any field) to import or export data programmatically.

👉 Take a look to the [Showcase]({{ "/about/showcase" | relative_url }}#nested-forms)
section to realize how easy it is to create complex forms with little or no
JavaScript code.


## Nestable forms

  * Forms are just fields of the *form* type that import/export their data as
    JSON.
    ```html
    <fieldset data-smark='{"type": "form", "name": "details"}'>
        <!-- ... -->
    </fieldset>
    ```

  * They can be nested to any depth.

  * The whole SmarkForm enhanced form is a field of this type.

👉 [See them in action...]({{ "/about/showcase" | relative_url }}#nested-forms).


## Variable-length lists

  * Variable-lenght lists of scalars or subforms.
    - With configurable minimum and maximum length.
    - Users can add or remove items by clicking on appropriate buttons
      (*trigger* components) configured to call the *addItem* and *removeItem*
      actions.

  * Data is imported/exported as JSON arrays.
    - If non array is attempted to be imported, it is converted to an array
      with a single item.

  * Can be manually (user drag & drop) or automatically (🚧 comming soon...)
    sorted.

👉 [See them in action...]({{ "/about/showcase" | relative_url }}#lists).


## Context driven hotkeys

  * Attach a keyboard shotcut to a trigger by just adding a `hotkey`
    property to the trigger component.
    - Ex.: `<button data-smark='{action: "addItem", hotkey: "+"}'>Add Item</button>`.
    - Then use `Ctrl`+`+` to add an item to the list.

  * Allow users to discover available hotkeys by pressing `Ctrl` key.
    - Every time the user presses/releases `Ctrl`, all triggers with a
      reachable *hotkey* will get the `data-hotkey` attribute of the their DOM
      element is filled/unfilled with the hotkey value.
    - This allows for a very simple
      [CSS arrangement]({{ "/about/showcase" | relative_url }}#context-driven-keyboard-shortcuts-hot-keys)
      for auto-reveal/unreveal feature.

  * Avoid hotkey cluttering by reusing the same hotkey in different contexts.
    - Hotkeys are attached to triggers and triggers are context-aware.
    - If the same hotkey is used more than once, only the one in the nearest
      context (depending on the current focus) is activated.

👉 [See it in action...]({{ "/about/showcase" | relative_url }}#context-driven-keyboard-shortcuts-hot-keys).


## Consistent User Experience

  * Smooth navigation across all forms.
    - Use `Tab` and `Shift`+`Tab` as usual to navigate between fields and controls.
    - Use `Enter` and `Shift`+`Enter` to navigate between fields only, bypassing
      controls.
      - Use `Ctrl`+`Enter` instead of `Enter` in multiline (textarea) fields.

  * Non-breaking unobtrusive keyboard navigation: triggers are smartly added or
    removed from navigation flow (with tab) when there is a hotkey to reach
    them.

  * Automatically enabled/disabled controls (depending on context).
    - **I.e.:** *Add Item* and *Remove Item* triggers are automatically
      disabled when the list is full or empty, respectively.

👉 [Learn more...]({{ "/about/showcase" | relative_url }}#smooth-navigation).


## A11Y friendly

Its markup-agnostic nature allows developers and designers to implement their own
accessible designs without interference.

Additionally, it attempts to help with accessibility whenever possible:

  * Ensuring keyboard navigability across all form elements.

  * Auto-filling some ARIA attributes if they are missing

Anyway, in this regard, feedback is welcome to improve SmarkForm's
accessibility. If you have suggestions or find any issues, please open tell us
via our [A11Y Discussion](https://github.com/bitifet/SmarkForm/discussions/25)
in GitHub.


## JSON based

  * Every single field can import/export its data in the appropriate data type:
    - Forms as JSON objects.
    - Lists as JSON arrays.
    - Numbers as numbers.
    - Dates as well-formed date strings.
    - Booleans as booleans.

👉 [See it in action...]({{ "/about/showcase" | relative_url }}#a-note-on-context-of-the-triggers)


## Lightweight yet highly compatible


  * Just {{ site.data.computed.bundleSizeKB | xml_escape | textilize }}KB minified!

  * Bundled both as modern ES Module and UMD for wide compatibility.

  * &gt; 0.25%, browser coverage thanks to Babel


👉 [Check it out...]({{ "/getting_started/getting_smarkform" | relative_url }})



## Flexible and extendable

  * Develop your own component types to suit your specific needs.

  * 🚧 (Not yet implemented) Create you own components on top of SmarkForm
    templates (I.e.: a complex schedule form returning well known JSON
    structure).


## Directory-like addressability

  * Address any field by from another field by its relative or absolute path.

  * Those paths traverse the form structure: not the DOM.
    - 🚀 This give you full freedom to **alter the form layout without
      breaking the code**.

  * They are highly useful to alter triggers' context and/or targetted
    fields.

  * They support upper (`..`) and sibling (`.-1`) addressing to traverse lists
    hoizontally and even wildcards (`*`) to address multiple fields at once.


👉 See the [Form Traversing]({{ "/advanced_concepts/form_traversing" | relative_url }})
section for more details.


## Reliability-oriented

  * It handles edge cases gracefully:
    - If non-Array is attempted to be imported into a list, it is converted
      to an array with a single item.
    - Textarea fields automatically stringify and pretty-print objects.

  * Null awareness:
    - Non text fields (like number, date, checkbox, etc.) can return `null` to
      indicate that the value is unknown or not applicable.
    - Radiobuttons can be unckecked.
    - Color pickers can be cleared and return `null` to distinguish when the
      color is unknown or not applicable instead of defaulting to black.


👉 [Try it yourself...]({{ "/about/showcase" | relative_url }}#basics)


## AI-agent ready

SmarkForm's clean, declarative API makes it a natural fit for AI-assisted
development:

  * **Describe a form in plain language — get working code immediately.**
    The `data-smark` attribute and JSON options are self-descriptive, so any
    capable AI assistant can generate correct, complete forms from a short
    description.

  * **No bespoke tooling required.** SmarkForm loads from a single CDN
    `<script>` or `import`, and the output is a standalone HTML page with no
    build step needed.

  * **Versioned agent knowledge files** are published alongside the library so
    AI agents always get accurate, up-to-date patterns — not stale
    `raw.githubusercontent.com` snapshots.

👉 Visit [AI & Agent Resources]({{ "/resources/ai-agents" | relative_url }}) for
prompt templates and agent-ready knowledge files.

