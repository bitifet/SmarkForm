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
        * [(Async) submit (Action)](#async-submit-action)
            * [Options (submit)](#options-submit)
            * [Encoding and transport](#encoding-and-transport)
            * [Data flattening options](#data-flattening-options)
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

{% capture demoValue -%}
{
    "id": "EMP-001",
    "personalData": {
        "name": "Emily",
        "surname": "Watson",
        "address": "456 Oak Avenue, Portland"
    },
    "businessData": {
        "name": "Acme Corp",
        "address": "789 Business Park, Portland"
    }
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
   formId="simple_form"
   htmlSource=simple_form_example
   notes=simple_form_example_notes
   demoValue=demoValue
   showEditor=true
    tests=false
%}


**Clear vs Reset Actions Example:**

The following example demonstrates the distinction between `clear` and `reset` actions:

{% raw %} <!-- capture clear_reset_example {{{ --> {% endraw %}
{% capture clear_reset_example
%}<fieldset>
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
        <button data-smark='{"action":"clear"}'>Clear All</button>
        <button data-smark='{"action":"reset"}'>Reset to Defaults</button>
        <button data-smark='{"action":"export"}'>Show Data</button>
    </p>
</fieldset>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture clear_reset_example_js {{{ --> {% endraw %}
{% capture clear_reset_example_js
%}
/* Show exported data in an alert() window */
myForm.on("AfterAction_export", (ev) => {
    alert(JSON.stringify(ev.data, null, 2));
});{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture clear_reset_example_tests {{{ --> {% endraw %}
{% capture clear_reset_example_tests %}
export default async ({ page, expect, id, root }) => {
    await expect(root).toBeVisible();

    // Dismiss any alert dialogs triggered by the "Show Data" button
    page.on('dialog', async (dialog) => { await dialog.dismiss(); });

    // Click each button and assert no errors are thrown
    const buttons = root.locator('button');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
        await buttons.nth(i).click();
    }
};
{% endcapture %}
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

{% capture demoValue -%}
{
    "name": "John Doe",
    "email": "john@example.com",
    "age": "30"
}
{%- endcapture %}
{% comment %}
Note: "age" is intentionally given as a string ("30") even though the field is
<input type="number">.  SmarkForm silently coerces the incoming string to a
number on import, so the exported value is the JS number 30.  This illustrates
the library's built-in input sanitisation.  The demoValue round-trip test
normalises numeric strings before comparing, so the test still passes.
{% endcomment %}

{% include components/sampletabs_tpl.md
   formId="clear_reset_form"
   htmlSource=clear_reset_example
   demoValue=demoValue
   jsSource=clear_reset_example_js
   notes=clear_reset_example_notes
   showEditor=false
   tests=clear_reset_example_tests
%}

{% comment %}
We disable the editor for this example because the "Export" button would
trigger the event handler in the example which would feel uggly and the editor
is not needed anyway for the purpose of this example.

We could prevent it from the event handler by checking the event context but
it would add unnecessary complexity for no apparent reason (since the editor's
export button is outside of the shown code) to the example.
{% endcomment %}


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
  * **setDefault:** (boolean, default `true`) — When `true` (the default), the imported data becomes the new default restored by `reset()`. Pass `false` to import data without changing the reset target.


#### (Async) clear (Action)

Clears all fields to their type-level empty state, removing all user-provided values **and ignoring any configured default values**. This action is useful when you want to completely empty a form, regardless of any defaults that were set.

For forms, this means setting all fields to empty values (empty strings for text fields, empty arrays for lists, empty objects for nested forms). Unlike `reset`, `clear` does not restore default values, nor does it update the stored default.

**Example use case:** A "New" button that clears everything to start fresh, even if the form had default values.

##### Options (clear)

  * **action:** (= "clear")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * **target:**


#### (Async) reset (Action)

Reverts all fields to their configured default values. The default is initially set by the `value` option and is updated every time `import()` is called with `setDefault: true` (the default). If no default has ever been set, fields revert to their type-level empty state.

This action is recursive, applying to all nested forms and lists.

**Example use case:** A "Reset" button that restores the form to its last loaded state.

##### Options (reset)

  * **action:** (= "reset")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * **target:**


#### (Async) submit (Action)

Submits the *root* form using native browser submission semantics enhanced with SmarkForm data.

When called on a nested sub-form, `submit` **always delegates to the root form** so that the
entire root form is submitted, not just the sub-form's data.

**Native submit interception:** When the root SmarkForm wraps an actual `<form>` HTML element,
clicking any native `<input type="submit">` / `<button type="submit">` will also trigger this
action automatically, with the native `event.submitter` passed through so that HTML5 per-button
overrides (e.g. `formaction`, `formmethod`) are honoured.

{: .warning :}
> **Enter key from non-submit fields does not submit.** In SmarkForm, <kbd>Enter</kbd>
> navigates between fields (like <kbd>Tab</kbd>). This applies to non-button fields — including
> non-enhanced elements such as a `<select>` placed inside the native `<form>` container for UI
> purposes. Pressing <kbd>Enter</kbd> while a **submit button** (native or SmarkForm trigger) is
> focused still submits normally, because the browser fires a `click` event on the button first.

**Events:** `BeforeAction_submit` and `AfterAction_submit` are emitted on the root form by virtue
of the `@action` decorator — no additional event wiring is required.

**Submitter name/value (form-encoded only):** For non-JSON encodings, when the submitting element
has a `name` attribute its name/value pair is appended to the flattened entries — matching native
browser behaviour. This does **not** apply to JSON encoding (see below).

{: .info :}
> The submitter element is always available as `options.submitter` inside `BeforeAction_submit`
> and `AfterAction_submit` handler callbacks for any custom handling.

##### Options (submit)

  * **action:** (= "submit")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * **submitter** *(Element, optional)* — DOM element that initiated the submission. When coming
    from a native `submit` DOM event this is set automatically. When using a trigger button the
    trigger's target node is used. Override explicitly to supply a custom submitter.

##### Encoding and transport

The effective submission attributes are resolved in priority order (submitter attribute → form
attribute → default), matching native HTML5 behaviour:

| Attribute | Submitter override | Form attribute | Default |
|-----------|-------------------|----------------|---------|
| `action`  | `formaction`       | `action`        | `location.href` |
| `method`  | `formmethod`       | `method`        | `get` |
| `enctype` | `formenctype`      | `enctype`       | `application/x-www-form-urlencoded` |
| `target`  | `formtarget`       | `target`        | `_self` |
| `novalidate` | `formnovalidate` | `novalidate`   | false |

**JSON encoding (`enctype="application/json"`):**
Data is exported as a JSON object and sent via `fetch()`. Any HTTP method is supported
(`GET`, `POST`, `PUT`, `DELETE`, `PATCH`, …). After a successful response:
- If the response was redirected, the browser navigates to the redirect destination.
- If the response body is `text/html`, the current document is replaced with it.
- Otherwise, nothing happens by default.

{: .info :}
> The submitter name/value is **not** automatically added to the JSON body. For JSON
> submissions the developer has full control over the payload. Access the submitter element via
> `options.submitter` inside a `BeforeAction_submit` handler to incorporate it as needed
> (e.g. as a URL parameter or a dedicated JSON field).

{: .warning :}
> JSON submission to a `target` other than `_self` is not supported; the target is coerced
> to `_self` and a warning is printed to the console.

{: .warning :}
> Non-HTTP action URLs (e.g. `mailto:`, `data:`) are **not** supported with JSON encoding and
> will throw an error. Use the default form-encoded enctype for non-HTTP action URLs.

**Non-JSON encoding (URL-encoded / multipart / plain-text):**
Form data is flattened into name/value pairs and submitted via a temporary hidden `<form>` element
appended to `document.body`. Only `GET` and `POST` methods are supported; using any other method
with a non-JSON enctype throws an error. The temporary form is removed after submission.

Non-HTTP action URLs such as `mailto:someone@example.com` are fully supported through this path
— the browser handles them natively (e.g. opening the email client for `mailto:` with GET).

{: .warning :}
> When the submitting element has a `name` attribute its name/value pair is appended to the
> submitted entries — matching native browser behaviour. Be aware that this adds an entry not
> present in the SmarkForm export data.

##### Data flattening options

When using non-JSON encoding, the exported SmarkForm JSON is flattened into string key/value
pairs. The following options on the root form control the flattening style:

  * **`keyStyle`** *(string, default `"bracket"`)* — How nested keys are represented:
    * `"bracket"` — `person[address][city]`
    * `"dot"` — `person.address.city`

  * **`arrayStyle`** *(string, default `"repeat"`)* — How array items are represented:
    * `"repeat"` — Same name repeated: `tags`, `tags`, `tags` (native PHP / Rails style)
    * `"index"` — Indexed: `tags[0]`, `tags[1]` (or `tags.0`, `tags.1` with `keyStyle:"dot"`)

These options can be set via `data-smark` on the root form element:

```html
<form data-smark='{"keyStyle":"dot","arrayStyle":"index"}' method="post" action="/submit">
  …
</form>
```

#### Future: null (Action)

**Note:** This action is planned for future implementation.

The `null` action would explicitly set an entire form or field to `null`, representing an intentionally "not provided" state. This differs from `clear` (which empties fields) and `reset` (which restores defaults).

For nested forms, this would set the entire form value to `null` rather than clearing individual fields. This is useful for optional form sections where you want to distinguish between "empty but provided" and "not provided at all".


