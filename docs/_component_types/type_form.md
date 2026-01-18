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
        * [focus_on_click](#focus_on_click)
    * [Actions](#actions)
        * [(Async) export (Action)](#async-export-action)
            * [Options (export)](#options-export)
        * [(Async) import (Action)](#async-import-action)
            * [Options (import)](#options-import)
        * [(Async) clear (Action)](#async-clear-action)
            * [Options (clear)](#options-clear)
        * [(Async) reset (Action)](#async-reset-action)
            * [Options (reset)](#options-reset)
        * [Future: null (Action)](#future-null-action)

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
    <label data-smark>Id:</label>
    <input data-smark type='text' name='id' />
</p>
<fieldset data-smark='{"type":"form","name":"personalData"}'>
    <legend>Personal Data:</legend>
    <p>
        <label data-smark>Name:</label>
        <input data-smark type='text' name='name' placheolder='Family name'/>
    </p>
    <p>
        <label data-smark>Surname:</label>
        <input data-smark type='text' name='surname' />
    </p>
    <p>
        <label data-smark>Address:</label>
        <input data-smark type='text' name='address' />
    </p>
</fieldset>
<fieldset data-smark='{"type":"form","name":"businessData"}'>
    <legend>Business Data:</legend>
    <p>
        <label data-smark>Company Name:</label>
        <input data-smark type='text' name='name' placheolder='Company Name'/>
    </p>
    <p>
        <label data-smark>Address:</label>
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


### Clear vs Reset Actions Example

The following example demonstrates the distinction between `clear` and `reset` actions:

{% raw %} <!-- capture clear_reset_example {{{ --> {% endraw %}
{% capture clear_reset_example
%}<fieldset data-smark='{"type":"form","name":"userProfile","value":{"name":"John Doe","email":"john@example.com","age":"30"}}'>
    <legend>User Profile (with defaults)</legend>
    <p>
        <label data-smark>Name:</label>
        <input data-smark type='text' name='name' />
    </p>
    <p>
        <label data-smark>Email:</label>
        <input data-smark type='email' name='email' />
    </p>
    <p>
        <label data-smark>Age:</label>
        <input data-smark type='number' name='age' />
    </p>
    <p>
        <button data-smark='{"action":"clear","context":"userProfile"}'>Clear All</button>
        <button data-smark='{"action":"reset","context":"userProfile"}'>Reset to Defaults</button>
        <button data-smark='{"action":"export"}' onclick='alert(JSON.stringify(data, null, 2))'>Show Data</button>
    </p>
</fieldset>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture clear_reset_example_notes {{{ --> {% endraw %}
{% capture clear_reset_example_notes %}
👉 This form is initialized with default values for all fields.

🔘 **Clear All** - Removes all values, leaving fields empty (ignoring defaults).

🔄 **Reset to Defaults** - Restores the original default values.

💡 Try this sequence:
1. Modify some field values
2. Click "Clear All" - all fields become empty
3. Click "Reset to Defaults" - default values are restored

ℹ️  The `value` option on the form sets the default values that `reset` will restore.
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
   formId="clear_reset_form"
   htmlSource=clear_reset_example
   notes=clear_reset_example_notes
   showEditor=true
    tests=false
%}



API Reference
-------------


### Options

#### focus_on_click

Make forms get focused when clicked anywhere inside them.

  * **Type:** Boolean
  * **Default value:** true


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

Clears all fields to their type-level empty state, removing all user-provided values **and ignoring any configured default values**. This action is useful when you want to completely empty a form, regardless of any defaults that were set.

For forms, this means setting all fields to empty values (empty strings for text fields, empty arrays for lists, empty objects for nested forms). Unlike `reset`, `clear` does not restore default values.

**Example use case:** A "New" button that clears everything to start fresh, even if the form had default values.

##### Options (clear)

  * **action:** (= "clear")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * **target:**


#### (Async) reset (Action)

Reverts all fields to their configured default values. If a field was initialized with a `value` option or default value, `reset` will restore that value. If no defaults were configured, fields revert to their type-level empty state.

This action is recursive, applying to all nested forms and lists. For lists, if a default structure was provided (e.g., prepopulated items), `reset` will restore that structure.

**Example use case:** A "Reset to defaults" button that restores the form to its initial state as it was when first rendered.

##### Options (reset)

  * **action:** (= "reset")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * **target:**


#### Future: null (Action)

**Note:** This action is planned for future implementation.

The `null` action would explicitly set an entire form or field to `null`, representing an intentionally "not provided" state. This differs from `clear` (which empties fields) and `reset` (which restores defaults).

For nested forms, this would set the entire form value to `null` rather than clearing individual fields. This is useful for optional form sections where you want to distinguish between "empty but provided" and "not provided at all".


