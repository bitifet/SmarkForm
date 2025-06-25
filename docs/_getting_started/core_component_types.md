---
title: Core Component Types
layout: chapter
permalink: /getting_started/core_component_types
nav_order: 4

---

{% include components/sampletabs_ctrl.md %}

# Core Component Types

Core component types are the backbone of *SmarkForm*:

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Complex field types](#complex-field-types)
    * [type: form and type: list](#type-form-and-type-list)
* [Scalar field types](#scalar-field-types)
    * [type: input](#type-input)
        * [The Singleton Pattern.](#the-singleton-pattern)
    * [type: number and type: date](#type-number-and-type-date)
    * [type: color](#type-color)
    * [type: select](#type-select)
* [Non field component types](#non-field-component-types)
    * [type: trigger](#type-trigger)
    * [type: label](#type-label)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


## Complex field types

### type: form and type: list

📋 [form]({{ "component_types/type_form" | relative_url }}) and
📋 [list]({{ "component_types/type_list" | relative_url }}) provide the
structure that allows to handle any possible JSON data including nested objects
and arrays.

  * *form* imports and exports plain JSON objects.

  * *list* imports and exports JSON arrays.


## Scalar field types

{: .hint}
> Notice that the *SmarkForm* field types are not necessarily related to the
> *type* attribute of `<input>` tags even they can limit it's allowed values.
> 
> This way a *SmarkForm* component of type *input* can be defined over either
> `<select>`, a `<textarea>` or a `<input>` tag with any valid value of its
> *type* property while, in the case of number, only a `<input>` tag with a
> "number" as its *type* attribute is allowed (or with no *type* attribute in
> which case it will be auto-filled).
> 
> And so on...


### type: input

The 📋 [input]({{ "component_types/type_input" | relative_url }}) component
type provide basic support for all HTML form fields (`<input>`, `<textarea>`
and `select`) **no matter, in case of *inputs* its actual *type* attribute**.

  * Imports and exports *String* like regular HTML form fields.

Other component types may provide more advanced behaviour, like
importing/exporting appropriate data types, for specific input types, etc...
But every present and future HTML *&lt;input&gt;* tag could be used as
*SmarkForm* "input" component type.

**Example:**


{% raw %} <!-- input_example {{{ --> {% endraw %}
{% capture input_example %}<div id="myForm$$">
    <p>
        <label data-smark>Name:</label>
        <!-- Implicit (automatically inferred) component type: -->
        <input type='text' name='name' data-smark>
    </p>
    <p>
        <label data-smark>Surname:</label>
        <!-- Explicitly specified component type: -->
        <input type='text' name='surname' data-smark='{"type":"input"}'>
    </p>
    <p>
        <label data-smark>User Name:</label>
        <!-- Handy options-driven syntax:                                  -->
        <!--   👉 type attribute ='text' is the default                    -->
        <!--   👉 {"type":"input"} inferred by tag name and type attribute -->
        <input data-smark='{"name":"user_name"}'>
    </p>
    <p>
        <label data-smark>Phone:</label>
        <!-- Explicit better than implicit:                                -->
        <!--   👉 type='tel' is necessary here.                            -->
        <!--   👉 {"type":"input"} may prevent an hypotetical future "tel" -->
        <!--      component type from being inferred here.                 -->
        <input type='tel' data-smark='{"type":"input","name":"phone"}'>
    </p>
    <p>
        <label data-smark>Address:</label>
        <!-- Non <input> fields:                                           -->
        <textarea data-smark='{"type":"input","name":"address"}'></textarea>
    </p>
    <p>
        <label data-smark>Email:</label>
        <!-- Just another example:                                         -->
        <input type='email' data-smark='{"type":"input","name":"email"}'>
    </p>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="input_example"
    htmlSource=input_example
    showEditor=true
%}



#### The Singleton Pattern.

All *Scalar field types* implement the so called **Singleton Pattern**.

The *Singleton Pattern* consists in using a non-field html tag as a *SmarkForm*
component of given *scalar* type.

👉 This allow for complex HTML to work as a single field.

👉 That HTML should contain **one and only one** HTML form field (`<input>`,
`<textarea>` or `<select>`).


{: .info}
> This allow them to incorporate
> [labels]({{ "component_types/type_label" | relative_url }})
> and [triggers]({{ "component_types/type_trigger" | relative_url }})
> which is specially convenient for the
> [list]({{ "component_types/type_list" | relative_url }}) component type since
> it make possible to incorporate triggers for its actions in every list item
> even for lists of scalars.


**Example:**

```html
  <!-- ... -->
  <li data-smark='{"type":"input"}'>
    <input placeholder='Phone number' type='tel'/>
    <button data-smark='{"action":"removeItem"}'>❌</button>
  </li>
  <!-- ... -->
```

{: .hint}
> See
> [Applying the singleton pattern]({{ "component_types/type_list" | relative_url }}#applying-the-singleton-pattern)
> in the *«list» Component Type* chapter for a more real-world example.


The Singleton Pattern can also be used to avoid explicit context path
specification for simple actions such as *clear* for field types like *number*
or, specially, *color* (since native `<input type='color'>` doesn't allow not
to specify any while *SmarkForm* component does.


**Example:**

👉 In the following example we need to explicitly specify the *context* path
for the *clear* action since, otherwise, the whole form (its natural context)
would be cleared.



{% raw %} <!-- no_singleton_example {{{ --> {% endraw %}
{% capture no_singleton_example %}<div id="myForm$$">
    <p>
        <p>
            <label data-smark>Pick a Color:</label>
            <input type="color" name="color" data-smark>
            <button data-smark='{"action":"clear","context":"color"}'>❌ Reset</button>
        </p>
    </p>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="no_singleton_example"
    htmlSource=no_singleton_example
    showEditor=true
%}



👉 Conversely, using the *Singleton Pattern*, not only the code looks clenaner
but, also, **it could avoid future issues** in case of field name being changed
(for instance after copying a block of code to reuse it somewhere else):


{% raw %} <!-- singleton_color_example {{{ --> {% endraw %}
{% capture singleton_color_example %}<div id="myForm$$">
    <p>
        <p>
            <label data-smark>Pick a Color:</label>
            <span data-smark='{"type":"color", "name":"bgcolor"}'>
                <input data-smark>
                <button data-smark='{"action":"clear"}'>❌ Reset</button>
            </span>
        </p>
    </p>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="singleton_example"
    htmlSource=singleton_color_example
    showEditor=true
%}



### type: number and type: date

The 📋 [number]({{ "component_types/type_number" | relative_url }}) and
📋 [date]({{ "component_types/type_date" | relative_url }}) component type
extends the [Input]({{ "component_types/type_input" | relative_url }})
component type providding extra sanitation (when importing) and formatting
(when exporting).

  * *number* imports and exports *Number*.

  * *date* imports and exports *Date*.

  * Having they inherit from *input*, both implement the [Singleton
    Pattern.](#the-singleton-pattern).

  * If inappropriate types (like *String*) are imported, they are properly
    converted on the fly.

**Example:**


{% raw %} <!-- number_and_date_example {{{ --> {% endraw %}
{% capture number_and_date_example %}<div id="myForm$$">
    <p>
        <label data-smark>Price:</label>
        <input data-smark='{"type":"number","name":"price"}'>
    </p>
    <p>
        <label data-smark>Date:</label>
        <input data-smark='{"type":"date","name":"date"}'>
    </p>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="number_and_date_example"
    htmlSource=number_and_date_example
    showEditor=true
%}



### type: color

Similar to [number and date](#type-number-and-type-date), the
📋 [color]({{ "component_types/type_color" | relative_url }}) component type
extends the [Input]({{ "component_types/type_input" | relative_url }})
component type.

  * *color* imports and exports (Hex `#rrggbb`) string or Null.
  
  * Invalid inputs are replaced by Null.

  * Having it inherits from *input*, it implements the [Singleton
    Pattern.](#the-singleton-pattern).


However, unlike [them](#type-number-and-type-date), and as outlined in [its
specification](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/color#value),
`<input type="color">` HTML fields do not require additional sanitation or
formatting.


This is because `<input type="color">` ensures a consistently valid RGB color
value and **even if the user does not interact with the field**, a valid value is
always enforced.

As a result, it can be difficult to determine whether the user intentionally
selected pure black (#000000) or simply overlooked the field altogether.


**Example:**


{% raw %} <!-- color_example {{{ --> {% endraw %}
{% capture color_example %}<div id="myForm$$">
    <p>
        <p>
            <label data-smark>Pick a Color:</label>
            <span data-smark='{"type":"color", "name":"bgcolor"}'>
                <input data-smark>
                <button data-smark='{"action":"clear"}'>❌ Reset</button>
            </span>
        </p>
    </p>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="color_example"
    htmlSource=color_example
    showEditor=true
%}


<blockquote class="hint">
<p>The <i>clear</i> action can be used to clear all other field component types</p>

<p><b>Example:</b></p>

{% raw %} <!-- clear_others_example {{{ --> {% endraw %}
{% capture clear_others_example %}<div id="myForm$$">
    <p>
        <p>
            <label data-smark>A Color:</label>
            <span data-smark='{"type":"color", "name":"color"}'>
                <input data-smark>
                <button data-smark='{"action":"clear"}'>❌ Reset</button>
            </span>
        </p>
        <p>
            <label data-smark>A Number:</label>
            <span data-smark='{"type":"number", "name":"number"}'>
                <input data-smark>
                <button data-smark='{"action":"clear"}'>❌ Reset</button>
            </span>
        </p>
        <p>
            <label data-smark>A Date:</label>
            <span data-smark='{"type":"date", "name":"date"}'>
                <input data-smark>
                <button data-smark='{"action":"clear"}'>❌ Reset</button>
            </span>
        </p>
    </p>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="clear_others_example"
    htmlSource=clear_others_example
    showEditor=true
%}

</blockquote>


### type: select

The 📋 [select]({{ "component_types/type_select" | relative_url }})
compenent type **will** (🚧 since it is not yet implemented 🚧) provide support
for advanced features like dynamic options loading and update, even reacting to
changes of other fields in a really transparent manner thanks to the
(future) "API interface".

  * Will inmport and export array of *String*.

  * Will allow configuration to expor arrays of different types.


## Non field component types

There are other component types with special mission that are not form field
types:


### type: trigger

The 🕹️ [Trigger]({{ "component_types/type_trigger" | relative_url }})s are used
for buttons (or any other elements) to receive interaction events (mouse
"click" by default, but they will be capable to handle others such as keyboard
events) and trigger predefined *actions* on propper components (i.e. adding or
removing items to lists).

  * The good thing about *triggers* is that **they usually don't need any extra
    wiring to interact with their targeted components**. They just target them
    by their own relative position in the *SmarkForm* form tree or, at most,
    with *filesystem-like* relative paths when necessary.


### type: label

The 🏷️ [Label]({{ "component_types/type_label" | relative_url }})s **will** (🚧
since it is not yet implemented 🚧) be used to enhance regular `<label>` to
properly resolve their *for* attribute from a *SmarkForm* relative path
ensuring it always matches the propper id no matter if it is a root-level field
or in the bottom of several subform and/or list nesting levels.


