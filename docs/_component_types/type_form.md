---
title: «form» Component Type
layout: chapter
permalink: /component_types/type_form
nav_order: 1

---

# {{ page.title }}

<details>
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Introduction](#introduction)
* [Options](#options)
* [Actions](#actions)
    * [Action «empty»](#action-empty)
* [Other Methods](#other-methods)
* [Events](#events)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


Introduction
------------

👉 In *SmarkForm* the whole form is a field of the type *form* which imports
and exports JSON data.

👉 The keys of that JSON data correspond to the names of the fields in the
form.

👉 From fields can be created over any HTML tag except for actual HTML form
elements (`<input>`, `<textarea>`, `<select>`, `<button>`...) and can contain
any number of *SmarkForm* fields, **including nested forms**.

**Example:**

```html
<!--
Create a SmarkForm form with a text Input and a nested form.
    👉 The outer form doesn't need the "data-smark" attribute having it is the
       outer form.
    👉 In text fields the "name" attribute is naturally taken as field name.
    👉 In the case of nested form, having <div> tags cannot have a "name"
       attribute, it is provided as a data-smark object property (which is always
       valid).
-->
<div id='myForm'>
  <input data-smark type='text' name='text01'/>
  <div data-smark='{"type":"form","name":"nestedForm"}'>
    <input data-smark type='text' name='text01'/>
    <input data-smark type='text' name='text02'/>
  </div>
</div>
<script>
    const myForm = new SmarkForm(document.getElementById("myForm"))
</script>
```





Options
-------


Actions
-------


### Action «empty»


Other Methods
-------------



Events
------



