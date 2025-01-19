---
title: Features
layout: chapter
permalink: /about/features
nav_order: 4

---

# {{ page.title }}

<!-- vim-markdown-toc GitLab -->

* [Easy to use](#easy-to-use)
    * [Markup-driven and Intuitive API](#markup-driven-and-intuitive-api)
    * [Zero-Wiring](#zero-wiring)
    * [No need for extensive JavaScript coding.](#no-need-for-extensive-javascript-coding)
* [Lightweight yet highly compatible](#lightweight-yet-highly-compatible)
    * [Bundled both as modern ES Module and UMD for wide compatibility.](#bundled-both-as-modern-es-module-and-umd-for-wide-compatibility)
    * [Only {{ site.data.computed.bundleSizeKB }}KB minified!](#only-sitedatacomputedbundlesizekb-kb-minified)
    * [> 0.25%, browser coverage thanks to Babel](#-025-browser-coverage-thanks-to-babel)
* [Flexible and extendable](#flexible-and-extendable)
    * [Don't require specific HTML structure or CSS design rules.](#dont-require-specific-html-structure-or-css-design-rules)
    * [Develop your own component types to suit your specific needs.](#develop-your-own-component-types-to-suit-your-specific-needs)
* [Powerful](#powerful)
    * [Supports variable-length lists and subforms.](#supports-variable-length-lists-and-subforms)
    * [Lists and subforms are just field types. Even the whole form is a field.](#lists-and-subforms-are-just-field-types-even-the-whole-form-is-a-field)
    * [Import/Export capabilities (actions) for all fields.](#importexport-capabilities-actions-for-all-fields)
    * [Export proper data type for each field type:](#export-proper-data-type-for-each-field-type)
    * [Allow users to add or remove items from arrays.](#allow-users-to-add-or-remove-items-from-arrays)
    * [Impose lower and upper limits for arrays lengths.](#impose-lower-and-upper-limits-for-arrays-lengths)
* [Advanced UX improvements](#advanced-ux-improvements)
    * [Configurable context-driven keyboard shortcuts with awesome hints revelation.](#configurable-context-driven-keyboard-shortcuts-with-awesome-hints-revelation)
    * [Automatically enabled/disabled controls (depending on context).](#automatically-enableddisabled-controls-depending-on-context)
    * [Non-breaking unobtrusive keyboard navigation (controls are smartly added or removed from navigation flow when appropriate).](#non-breaking-unobtrusive-keyboard-navigation-controls-are-smartly-added-or-removed-from-navigation-flow-when-appropriate)

<!-- vim-markdown-toc -->


## Easy to use


### Markup-driven and Intuitive API

  * Leverage your existing HTML and CSS knowledge to create powerful forms with no effort.
  * Just add the `data-smark` attribute to relevant tags and see the magic.


### Zero-Wiring
  * Controls (*trigger* components) reach their target fields by its context
      (position in the form) or by relative paths within the form.
  * Just intercept *import* and *export* events for data load ond submit.


### No need for extensive JavaScript coding.

  * Most common functionalities are already built-in.
  * Highly customizable through declarative options.
  * **Ex.:** `<button data-smark='{action: "addItem"}'>`


## Lightweight yet highly compatible


### Bundled both as modern ES Module and UMD for wide compatibility.


### Only {{ site.data.computed.bundleSizeKB }}KB minified!


### > 0.25%, browser coverage thanks to Babel


## Flexible and extendable


### Don't require specific HTML structure or CSS design rules.


### Develop your own component types to suit your specific needs.


## Powerful


### Supports variable-length lists and subforms.


### Lists and subforms are just field types. Even the whole form is a field.


### Import/Export capabilities (actions) for all fields.


### Export proper data type for each field type:

  * JSON object for forms.
  * JSON array for lists.
  * Number for numbers (`<input type="number" data-smark>`).
  * Well formed date for date...


### Allow users to add or remove items from arrays.


### Impose lower and upper limits for arrays lengths.




## Advanced UX improvements


### Configurable context-driven keyboard shortcuts with awesome hints revelation.


### Automatically enabled/disabled controls (depending on context).

  * **Ex.:** *Add Item* and *Remove Item* buttons are disabled when the list is full or empty, respectively.


### Non-breaking unobtrusive keyboard navigation (controls are smartly added or removed from navigation flow when appropriate).





