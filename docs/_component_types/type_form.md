---
title: «form» Component Type
layout: chapter
permalink: /component_types/type_form
nav_order: 1

---

{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Introduction](#introduction)
* [API Reference](#api-reference)
    * [Options](#options)
    * [Actions](#actions)
        * [(Async) export (Action)](#async-export-action)
            * [Options (export)](#options-export)
        * [(Async) import (Action)](#async-import-action)
            * [Options (import)](#options-import)
        * [(Async) clear (Action)](#async-clear-action)
            * [Options (clear)](#options-clear)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


Introduction
------------

In *SmarkForm* the whole form is a field of the type *form* which imports and
exports JSON data.

👉 The keys of that JSON data correspond to the names of the fields in the
form.

👉 From fields can be created over any HTML tag except for actual HTML form
elements (`<input>`, `<textarea>`, `<select>`, `<button>`...) and can contain
any number of *SmarkForm* fields, **including nested forms**.

**Example:**

Following example shows a simple *SmarkForm* form with two nested forms:

{% raw %} <!-- capture simple_form_example {{{ --> {% endraw %}
{% capture simple_form_example
%}<p>
    <label for='id'>Id:</label>
    <input data-smark type='text' name='id' />
</p>
<fieldset data-smark='{"type":"form","name":"personalData"}'>
    <legend>Personal Data:</legend>
    <p>
        <label for='name'>Name:</label>
        <input data-smark type='text' name='name' placheolder='Family name'/>
    </p>
    <p>
        <label for='surname'>Surname:</label>
        <input data-smark type='text' name='surname' />
    </p>
    <p>
        <label for='address'>Address:</label>
        <input data-smark type='text' name='address' />
    </p>
</fieldset>
<fieldset data-smark='{"type":"form","name":"businessData"}'>
    <legend>Business Data:</legend>
    <p>
        <label for='name'>Company Name:</label>
        <input data-smark type='text' name='name' placheolder='Company Name'/>
    </p>
    <p>
        <label for='address'>Address:</label>
        <input data-smark type='text' name='address' />
    </p>
</fieldset>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture simple_form_example_notes {{{ --> {% endraw %}
{% capture simple_form_example_notes %}
👉 The outer form doesn't need the "data-smark" attribute having it is the
   the one we passed to the SmarkForm constructor.

ℹ️  In text fields the "name" attribute is naturally taken as field name.

ℹ️  In the case of nested form, having `<fieldset>` tags cannot have a *name*
   attribute, it is provided as a *data-smark* object property (which is always
   valid).

🚀 This is a simple showcase form. You can extend it with any valid
   *SmarkForm* field.
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
   formId="simple_form"
   htmlSource=simple_form_example
   notes=simple_form_example_notes
   showEditor=true
    tests=false
%}



API Reference
-------------


### Options


### Actions

{{ site.data.definitions.actions.intro }}

The `form` component type supports the following actions:


#### (Async) export (Action)

##### Options (export)

  * **action:** (= "export")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * {{ site.data.definitions.actions.options.target_export }}
  * **data:**


#### (Async) import (Action)

##### Options (import)

  * **action:** (= "import")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * {{ site.data.definitions.actions.options.target_import }}
  * **data:** (JSON)
  * **focus:** (boolean, default true)


#### (Async) clear (Action)

(Shorhand for `import({})`)

##### Options (clear)

  * **action:** (= "clear")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * **target:**


