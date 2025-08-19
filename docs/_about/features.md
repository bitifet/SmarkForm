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

* [Easy to use](#easy-to-use)
    * [Markup-driven and Intuitive API](#markup-driven-and-intuitive-api)
    * [Zero-Wiring](#zero-wiring)
    * [No need for extensive JavaScript coding.](#no-need-for-extensive-javascript-coding)
* [Responsive and accessible UX](#responsive-and-accessible-ux)
* [Lightweight yet highly compatible](#lightweight-yet-highly-compatible)
    * [Only a few KBs of JavaScript](#only-a-few-kbs-of-javascript)
    * [Bundled both as modern ES Module and UMD for wide compatibility.](#bundled-both-as-modern-es-module-and-umd-for-wide-compatibility)
    * [&gt; 0.25%, browser coverage thanks to Babel](#gt-025-browser-coverage-thanks-to-babel)
* [Flexible and extendable](#flexible-and-extendable)
    * [Markup agnostic](#markup-agnostic)
    * [Develop your own component types to suit your specific needs.](#develop-your-own-component-types-to-suit-your-specific-needs)
* [Powerful](#powerful)
    * [Variable-length lists](#variable-length-lists)
    * [Nestable forms](#nestable-forms)
* [JSON based](#json-based)
    * [Import/Export capabilities (actions) for all fields.](#importexport-capabilities-actions-for-all-fields)
    * [Export proper data type for each field type:](#export-proper-data-type-for-each-field-type)
* [Advanced UX improvements](#advanced-ux-improvements)
    * [Context driven hotkeys](#context-driven-hotkeys)
    * [Automatically enabled/disabled controls (depending on context).](#automatically-enableddisabled-controls-depending-on-context)
    * [Non-breaking unobtrusive keyboard navigation (controls are smartly added or removed from navigation flow when appropriate).](#non-breaking-unobtrusive-keyboard-navigation-controls-are-smartly-added-or-removed-from-navigation-flow-when-appropriate)

<!-- vim-markdown-toc -->
       " | markdownify }}

</div>


## Easy to use


### Markup-driven and Intuitive API

  * Leverage your existing HTML and CSS knowledge to create powerful forms with
    no effort.

  * Just add the `data-smark` attribute to form fields to enhance them.
    - Can be specified with no value, with a JSON object containing options, or
      with a string as shorthand for `{"type": "..."}`.
    - If unspecified, the field is automatically inferred by the tag name
      and/or its properties. (I.e., `<input type="number" data-smark>` is
      inferred as a number field.
    - HTML field tags without it will be ignored by SmarkForm (they could
      acomplish functions unrelated to the form).

  * And initialize the form with a single line of JavaScript:
    ```javascript
    const myForm = new SmarkForm(document.getElementById("myForm"));
    ```
    - The form is automatically enhanced, and all fields are ready to use.
    - You can also pass options to the constructor to customize the form
      behavior.

👉  See the [Quick Start]({{ "/getting_started/quick_start" | relative_url }})
section for more details.


### Zero-Wiring

  * Controls (called *trigger* components) reach their target fields by its context
      (position in the form) or by relative paths within the form.

  * Just place a trigger component in the proper position and specify the
    action to be performed, e.g.
    `<button data-smark='{action: "addItem"}'>Add Item</button>` and the user
    will be able to enlarge a list by one item.

  * To submit data from the form (or a subform), just place a
    `<button data-smark='{action: "export"}'>Submit</button>` inside the form
    (and outside of any field).
    - You can even specify a `target` property to export the data to another
      field, but we will see that later.

  * Similarly, to load data into the form, just place a
    `<button data-smark='{action: "import"}'>Load</button>` inside the form.
    - Again, you can specify a `target` property to import the data from another
      field.

  * To handle data import and export from your own code, you just have to
    listen to `onBeforeAction_import` and `onAfterAction_export` events.
    - Of cours, you can also call the `.import()` and `.export()` methods of
      the whole form (or any field) to import or export data programmatically.


### No need for extensive JavaScript coding.

  * Most common functionalities are already built-in.
  * Highly customizable through declarative options.
  * **Ex.:** `<button data-smark='{action: "addItem"}'>`


## Responsive and accessible UX




## Lightweight yet highly compatible


### Only a few KBs of JavaScript

Just {{ site.data.computed.bundleSizeKB | xml_escape | textilize }}KB minified!



### Bundled both as modern ES Module and UMD for wide compatibility.


### &gt; 0.25%, browser coverage thanks to Babel


## Flexible and extendable


### Markup agnostic

Don't require specific HTML structure or CSS design rules.

Designers have complete freedom.

### Develop your own component types to suit your specific needs.


## Powerful

### Variable-length lists

  * Variable-lenght lists of scalars or subforms.
    - With configurable minimum (default 1, but can be 0) and maximum (default
      Infinity) length.
    - Users can add or remove items (within specified limits) by clicking
      on the *Add Item* and *Remove Item* buttons (triggers properly placed in
      the DOM).

  * Data is imported/exported as JSON arrays.
    - If non array is attempted to be imported, it is converted to an array
      with a single item.

  * Can be manually (user drag & drop) or automatically (🚧 comming soon...)
    sorted.

👉 [See it in action...]({{ "/about/showcase" | relative_url }}#lists).


### Nestable forms

  * Forms are just fields that import/export their data as JSON.
  * The whole SmarkForm enhanced form is a field of this type.
  * Can be nested to any depth.

👉 [See it in action...]({{ "/about/showcase" | relative_url }}#nested-forms).


## JSON based

### Import/Export capabilities (actions) for all fields.


### Export proper data type for each field type:

  * JSON object for forms.
  * JSON array for lists.
  * Number for numbers (`<input type="number" data-smark>`).
  * Well formed date for date...




## Advanced UX improvements


### Context driven hotkeys

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


### Automatically enabled/disabled controls (depending on context).

  * **Ex.:** *Add Item* and *Remove Item* buttons are disabled when the list is full or empty, respectively.


### Non-breaking unobtrusive keyboard navigation (controls are smartly added or removed from navigation flow when appropriate).





