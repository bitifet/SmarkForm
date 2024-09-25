---
title: Features
layout: chapter
permalink: /about/features
nav_order: 2

---

# {{ page.title }}

<details>
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Markup-driven and Intuitive API](#markup-driven-and-intuitive-api)
* [Easy to use](#easy-to-use)
* [Advanced capabilities](#advanced-capabilities)
* [Can hold any data structure expressible in JSON](#can-hold-any-data-structure-expressible-in-json)
* [Flexible and extendable](#flexible-and-extendable)
* [Lightweight yet highly compatible](#lightweight-yet-highly-compatible)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>



## Markup-driven and Intuitive API

  * [x] Create powerful interactive forms with just plain HTML.
  * [x] Just add `data-smark` attribute to relevant tags and see the magic.
  * [ ] Properties be automatically mapped as `data-smark-<property_name>`-like
    attributes enabling `[data-smark-<property_name>]`-like CSS selectors.
  * [x] Intuitive option names.
    - **Ex.:** `<button data-smark='{action: "addItem", context: "myList">`


## Easy to use

  * [x] Leverage your existing HTML and CSS knowledge to create powerful forms.
  * [x] No need for extensive JavaScript coding.


## Advanced capabilities

  * [x] Addressable elements by easy-to-read path-style relative or absolute addresses.
  * [x] Complete separation between View and Controller logic.
  * [x] Context-based actions (no need to hard-wire context and/or target).
  * [ ] Dynamic and reactive options loading for dropdowns (comming soon)
        through [the API Interface](/advanced_concepts/the_api_interface)).
  * [ ] Infinite lists (with lazy loading through [the API
        Interface](/advanced_concepts/the_api_interface)).


## Can hold any data structure expressible in JSON

  * [x] With subforms and arrays.
  * [x] Allow users to add or remove items from arrays.
  * [x] Impose lower and upper limits for arrays lengths.


## Flexible and extendable

  * [x] JSON import and export capabilities
  * [x] Local Import and export of any subform instead of the whole one.
  * [x] Develop your own component types to suit your specific needs.
  * [ ] Mixin feature to create new component types based on (but not limited
        to) *SmarkForm* template.



## Lightweight yet highly compatible

  * [x] Bundled both as modern ES Module and UMD for wide compatibility.
  * [x] Only 20KB minified!
  * [x] > 0.25%, browser coverage thanks to Babel


