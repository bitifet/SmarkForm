---
title: Core Concepts
layout: chapter
permalink: /getting_started/core_concepts
nav_order: 3

---

{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Forms, Lists and (other) Fields](#forms-lists-and-other-fields)
    * [Fields](#fields)
    * [Form nesting](#form-nesting)
    * [Lists](#lists)
    * [Component Types](#component-types)
    * [Labels](#labels)
    * [Triggers](#triggers)
    * [Actions](#actions)
    * [Triggers target](#triggers-target)
    * [Behaviour tunning](#behaviour-tunning)
    * [Constraining lists](#constraining-lists)
    * [Singletons](#singletons)
    * [Addressability](#addressability)
    * [More...](#more)
* [The `data-smark` Attribute](#the-data-smark-attribute)
    * [Syntax](#syntax)
    * [Shorthand Syntaxes](#shorthand-syntaxes)
* [Mandatory properties](#mandatory-properties)
* [Components and Actions](#components-and-actions)
    * [Components](#components)
    * [Actions](#actions-1)
    * [Trigger Components](#trigger-components)
* [Accessing Components](#accessing-components)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


{: .warning }
> The code examples in this section have been designed to provide a clearer
> understanding of the concepts they illustrate.
> 
> In most real-world scenarios, these examples may not be the best choices.
> 
> For instance, the use of ``onRendered`` callbacks to output introspection
> data to the console which we will seldom need in real world applications
> since all form interactions will be handled through *trigger* components.


## Forms, Lists and (other) Fields

When we initialize a *SmarkForm* instance over some DOM element, it is enhanced
as **a *SmarkForm* form** component which is returned as our *root form*.

```javascript
const myForm = new SmarkForm(some_DOM_element); // Our root form
```

👉 Then, every inner DOM element with a *data-smark* attribute, will be
enhanced as another SmarkForm component. No matter if it is a direct child or a
descendant of any depth.

{% raw %} <!-- capture simple_form_example {{{ --> {% endraw %}
{% capture simple_form_example
%}<div id='myForm$$'>
    <p>
        <label data-smark>Name:</label>
        <input name='name' data-smark>
    </p>
    <p>
        <label data-smark>Surname:</label>
        <input name='surname' data-smark>
    </p>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture simple_form_example_notes {{{ --> {% endraw %}
{% capture simple_form_example_notes %}
👉 For this to work you need to get SmarkForm loaded into your page or
module (More information at *Getting SmarkForm* section).

💡 Try to fill the form and then press the *Export* button to get it as
JSON.

💡 Try to *Import* button and fill the gaps in provided JSON structure.

🔨 Try to add more JSON keys, remove existing, and even provide invalid
JSON data and see what happen.
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="simple_form"
    htmlSource=simple_form_example
    notes=simple_form_example_notes
    showEditor=true
%}


### Fields

Every *SmarkForm* component (except [labels](#labels) and
[triggers](#triggers)) is a form field from and to which we can import and
export values.

So **our *root form* is also a *field*** (of type "form") and we can import and
export its *value*.

In the case of the *form* fields, **its value is a JSON object.**


{: .info :}
> All field types (including form) provide so called *import* and *export*
> [actions](#actions) allowing to, respectively, write and read data to/from
> them.

The following example shows how we can use the *import* and *export* actions to
seamlessly handle either the whole form or individual fields.



{% raw %} <!-- capture context_comparsion_example_simple {{{ --> {% endraw %}
{% capture context_comparsion_example_simple %}<div id='myForm$$'>
    <div data-smark='{"name":"demo"}'>
        <p>
            <label data-smark>Name:</label>
            <input name='name' data-smark>
        </p>
        <p>
            <label data-smark>Surname:</label>
            <input name='surname' data-smark>
        </p>
        <table>
            <tr style="text-align:center">
                <th>Name field:</th>
                <th>Surname field:</th>
                <th>Whole Form:</th>
            </tr>
            <tr style="text-align:center">
                <td><button data-smark='{"action":"import","context":"name","target":"/editor"}'>⬆️  Import</button></td>
                <td><button data-smark='{"action":"import","context":"surname","target":"/editor"}'>⬆️  Import</button></td>
                <td><button data-smark='{"action":"import","target":"/editor"}'>⬆️  Import</button></td>
            </tr>
            <tr style="text-align:center">
                <td><button data-smark='{"action":"export","context":"name","target":"/editor"}'>⬇️  Export</button></td>
                <td><button data-smark='{"action":"export","context":"surname","target":"/editor"}'>⬇️  Export</button></td>
                <td><button data-smark='{"action":"export","target":"/editor"}'>⬇️  Export</button></td>
            </tr>
            <tr style="text-align:center">
                <td><button data-smark='{"action":"clear","context":"name"}'>❌ Clear</button></td>
                <td><button data-smark='{"action":"clear","context":"surname"}'>❌ Clear</button></td>
                <td><button data-smark='{"action":"clear"}'>❌ Clear</button></td>
            </tr>
        </table>
    </div>
    <div style="display: flex; flex-direction:column; align-items:left; gap: 1em; width: 100%">
        <textarea
            placeholder="JSON data viewer / editor"
            data-smark='{"name":"editor","type":"input"}'
            style="resize: vertical; align-self: stretch; min-height: 8em; flex-grow: 1;"
        >
        </textarea>
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture notes {{{ --> {% endraw %}
{% capture notes %}
👉 Notice that **all *Import* and *Export* buttons (triggers) are handled
by the same event handlers** (for "BeforeAction_import" and
"AfterAction_export", respectively).

👉 **They belong to different *SmarkForm* fields** determined by **(1)**
where they are placed in the DOM and **(2)** the relative path from that
place pointed by the *context* property.

ℹ️  Different field types may import/export different data types (*forms*
import/export JSON while regular *inputs* import/export text).

🔧 For the sake of simplicity, the *BeforeAction_import* event handler
reads the previous value of the field (no matter its type) and provides it
stringified as JSON as default value for the window.prompt() call. Making
it easy to edit the value no matter if we are importing one of the text
fields or the whole form.
{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="context_comparsion_simple"
    htmlSource=context_comparsion_example_simple
    notes=notes
%}


{: .hint :}
> Most of the examples in this manual use this technique to implement the *JSON
> data viewer / editor* and `⬇️ Export`, `⬆️ Import` and `❌ Clear` buttons.
> It's just that, ulike this one, only their *context* subform is shown in the
> *HTML* tab for the sake of clutter minimization.


### Form nesting

Now we know *SmarkForm* root form is just a *SmarkForm Field* of the type
"form".

This means that **we can nest forms** inside other forms as regular fields
(holding JSON objects) with no depth limit.


{% raw %} <!-- capture nested_forms_example {{{ --> {% endraw %}
{% capture nested_forms_example %}<div id='myForm$$'>
    <b>User:</b>
    <p>
        <label data-smark>Id:</label>
        <input name='userId' value='0001' data-smark>
    </p>
    <fieldset data-smark='{"type":"form","name":"personal_data"}'>
        <legend>Personal Data</legend>
        <p>
            <label data-smark>Name:</label>
            <input name='name' value='John' data-smark>
        </p>
        <p>
            <label data-smark>Surname:</label>
            <input name='surname' value='Doe' data-smark>
        </p>
        <fieldset data-smark='{"type":"form","name":"contact"}'>
            <legend>Contact Data</legend>
            <p>
                <label data-smark>Phone:</label>
                <input name='phone' type='tel' value='555444999' data-smark>
            </p>
            <p>
                <label data-smark>eMail:</label>
                <input name='email' type='mail' value='john@dohe.example.org' data-smark>
            </p>
        </fieldset>
    </fieldset>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture notes {{{ --> {% endraw %}
{% capture notes %}
👉 This example comes with pre-filled values to make it more illustrative,
but feel free to change them if you like.

👉 We could have also added nested lists (to allow multiple phone numbers
and/or emails).
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% include components/sampletabs_tpl.md
    formId="nested_forms"
    htmlSource=nested_forms_example
    notes=notes
    selected="preview"
    showEditor=true
%}



### Lists

👉 In case we need arrays, the *list* component type come to rescue.

Likewise forms hold JSON objects, **lists hold JSON arrays**.


...This means that we are able to define simple **HTML forms that can import
and export any imaginable JSON data structure**.


{% raw %} <!-- capture fixed_list_example {{{ --> {% endraw %}
{% capture fixed_list_example %}<div id="myForm$$">
    <b>Phones:</b>
    <ul data-smark='{"type":"list","name":"phones","of":"input","min_items":3}'>
        <li>
            <input data-smark type="tel" placeholder="Phone number" />
        </li>
    </ul>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture fixed_list_example_notes {{{ --> {% endraw %}
{% capture fixed_list_example_notes %}
👉 Here we used the *min_items* property to ensure at least 3 items are
   laid out.

💡 Having we have not (yet) disposed any mechanism for the list to grow,
   this **almost** works as a fixed-length list.

💣 ...But notice that we can `⬆️ Import` larger arrays since we did not set the
   *max_items* too.

ℹ️  *min_items* default value is 1, but we can also set it to 0 to allow
   empty lists.

👉 By default, unless `<input>`, `<textarea>` or `<select>` used as list
item template is rendered as a SmarkForm field of the type *form*
(producing a JSON object for each item). But here we want an array of
phones: not an array of objects with a phone...
       
➡️  ...The `of` property allows us to use a different component type (we
   could have also used `<li data-smark="input"> instead.

➡️  ...We could just have used an actual `<input>` tag directly, but that
   would have broken the layout in this case.

➡️  When we assign the "input" (or any other *scalar* type) to an html tag
   different than `<input>`, `<textarea>` or `<select>`, it is expected to
   contain exactly one *SmarkForm* field inside and will export the value
   of that type, not an object with it. **This is called the *singleton*
   pattern**.
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="fixed_list"
    htmlSource=fixed_list_example
    notes=fixed_list_example_notes
    showEditor=true
%}


👉 In order to enable users to control the array's length, the *list* component
type offers the "addItem" and "removeItem" *actions*.

👉 By default, *lists* have at least one item and can grow to infinity. But
this can be changed through the *min_items* and *max_items* properties.

👉 They also can be sorted by the user (by setting the *sortable* property to *true*).

The following example uses *trigger* components to allow user to invoke those
actions:


{% raw %} <!-- capture pets_list_example {{{ --> {% endraw %}
{% capture pets_list_example %}<div id="myForm$$">
    <b>Pets:</b>
    <ul data-smark='{"type":"list","name":"pets", "sortable":true, "min_items": 0, "max_items": 5}' class="sortable">
        <li>
            <select name='species' data-smark>
                <option value="cat">Cat</option>
                <option value="dog">Dog</option>
                <option value="hamster">Hamster</option>
                <option value="fish">Fish</option>
                <option value="bird">Bird</option>
                <option value="turtle">Turtle</option>
                <option value="turtle">Other</option>
            </select>
            <input name='name' placeholder="Name" data-smark>
            <button data-smark='{"action":"removeItem"}' title="Remove Pet">❌</button>
        </li>
    </ul>
    <button data-smark='{"action":"addItem","context":"pets"}'>Add Pet</button>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture pets_list_example_css {{{ --> {% endraw %}
{% capture pets_list_example_css %}.sortable>* {
    cursor: grab;
}{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture pets_list_example_notes {{{ --> {% endraw %}
{% capture pets_list_example_notes %}
👉 Notice **you can rearrange list items** by simply dragging them having we
   set the *sortable* property to *true*.

👉 Here we added the *sortable* class to list to set propper pointer cursor
   over list items through a simple CSS rule.

🚀 In the future we plan to automatically map all properties of the
   *data-smark* attribute as "data-smark-&lt;prop_name&gt;" like attributes so that
   we will be able to use a selector like `[data-smark-sortable]` in the CSS
   rule and, hence, avoid having to set a custom class in template.
{% endcapture %}
{% raw %} <!-- }}} ]() --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="pets_list"
    htmlSource=pets_list_example
    cssSource=pets_list_example_css
    notes=pets_list_example_notes
    showEditor=true
%}


### Component Types

In *SmarkForm* we don't talk of *components* but of *component types*.

Except for [labels](#labels) and [triggers](#triggers), *component types* are
kind of regular form-field types.



### Labels

🚧 Work in progres... 🚧 



### Triggers

*Triggers* are special components that allow the user to interact with the form
through given so-called "actions".

👉 They have a (mandatory) *action* attribute which specifies the action to be
triggered.

👉 *Trigger* components also have a "natural context" which is the closest
*SmarkForm* component conaining it (That is: *personal_data* subform in
previous example) but its actual *context* is the closest component
**implementing that action** unless overridden by the *context* property.

{: .hint :}
> The *natural context* of a trigger is the component that implements that
> action and contains the trigger (outside of any other inner component of the
> same type or implementing the same action).
> 
> There is no need of any *hard wiring code* to connect triggers to their
> targettend component. **The actions take place in the correct component
> thanks to the position in the DOM where the trigger is placed.**

👉 The *context* property specifies the *relative path*, from its *natural
context* to the actual context of the trigger.


{: .info :}
> In order to improve readability, the *action* property is not allowed in
> any other component type and, hence, the `"type": "trigger"` become optional
> (and discouraged).


### Actions

*Actions* are functions provided by component types for interaction.

They can be triggered by components of the so-called "trigger" type, where the
inner component ancestors implementing that specific action acts as their
*context*.

Actions may also require additional parameters, provided as *data-smark* object
properties, that may be specific of a given action and/or component type.



### Triggers target

👉 Besides the *context*, *trigger* components may also have a *target*
consisting of an inner component to which the specified action is performed.

The target can be specified using the *to* property, but it can also have a
default value depending on the context's component type. In the case of *lists*,
the default target is the list item that contains the *trigger* component (if
it is contained within one) or the last item in the list otherwise. For
example, when clicking the "Remove Pet" button in the previous example, the
last pet in the list would be removed.

**In other words:** We can move the *removeItem* trigger button inside list
items allowing users to cherry-pick which item to remove:

```html
<ul data-smark='{"type":"list","name":"pets"}'>
  <li>
    <input name='species' data-smark>
    <input name='name' data-smark>
    <button data-smark='{"action":"removeItem"}'>❌</button>
  </li>
</ul>
<button data-smark='{"action":"addItem","context":"pets"}'>➕</button>
<!-- (Optionally we can keep both)
<button data-smark='{"action":"removeItem","context":"pets"}'>➖</button>
-->
```

{: .info }
> Similarly, we could have placed an "addItem" button too inside the list item
> template. In that case, new items would be inserted **after** the item
> containing the button (its default target) unless if we set the *position*
> property to "before".
> 
> {: .warning }
> > But keep in mind that, if *minItems* (see [Constraining
> > lists](#constraining-lists) below...) is set to 0 you would need at least
> > another *external* "addItem" button to be able to add items to the list
> > when it is empty...


### Behaviour tunning

👉 A special case for the "to" property is specifying it as "\*". In this case,
the *trigger* button's target will be all items of the list.

Which combined (or not) with the *preserve_non_empty* property of *list* component
type's *removeItem* action, may lead to several interesting combinations:

➡️  Remove last empty pet. If none is empty, remove last one:

```html
<button
    data-smark='{
        "action":"removeItem",
        "context":"pets",
        "preserve_non_empty":true
    }'
>Remove Pet</button>
```

➡️  Remove all pets with no filled data:
```html
<button
    data-smark='{
        "action":"removeItem",
        "context":"pets",
        "to":"*",
        "preserve_non_empty":true
    }'
>Clear Empty Pets</button>
```

➡️  Remove all pets unconditionally:
```html
<button
    data-smark='{
        "action":"removeItem",
        "context":"pets",
        "to":"*",
    }'
>Remove All Pets</button>
```

### Constraining lists

👉 By default, lists can hold any number of items, from 1 to infinite. But this
can be overridden with *minItems* and *maxItems* properties. Example:

```html
<ul data-smark='{
    "type":"list",
    "name":"pets",
    "minItems": 0,
    "maxItems": 5,
}'>
  <li>
    <!-- ... -->
  </li>
</ul>
```

### Singletons

👉 As we have seen, lists can hold any number of *subform* instances. But  if
we need a list of just scalar values such as text or numbers (`<input>`,
`<textarea>`, `<select>`...) there will be no room for trigger components in
list items to, say, remove given item.

But the *input* component type can handle not only single `<input>`, `<selext>`
and `<textarea>`tags but also any other tag surrounding a whole subform with
the only restriction that only one actual field is allowed (and, in fact,
required) inside but allowing the presence of any number of *trigger*
components.

This special behavior of the *input* component type is what we call a
*singleton*, which adheres to the following rules:

  * They only allow for a single non *trigger* component in it.
  * Does not require (and it's not advisable) to provide a name for that
    component.
  * When imported or exported, they receive and return only the value ot that
    field.

{: .info}
> Not only *input* components are *singletons*. Also all other components
> inheriting from it (*number*, *date*...) work as singletons too.

**Example:**

```html
<div data-smark='{"type":"form","name":"personal_data"}'>
  <input name='name'  data-smark>
  <input name='surname' data-smark>
  <ul data-smark='{"type":"list","name":"phones"}'>
    <li data-smark='{"type":"input"}'>
      <input placeholder='Phone Number' type="tel" data-smark>
      <button data-smark='{"action":"removeItem"}'>❌</button>
    </li>
  </ul>
  <button data-smark='{"action":"addItem","context":"phones"}'>➕</button>
</div>
```

{: .hint}
> This forced us to explicitly specify the *data-smark* property in the list
> item template. To avoid this we can use the "of" property of the list to
> specify the desired SmarkForm component type:
> 
> 
> ```html
> <ul data-smark='{"type":"list","name":"phones","of":"input"}'>
>   <li>
>     <input placeholder='Phone Number' type="text" data-smark>
>     <button data-smark='{"action":"removeItem"}'>❌</button>
>   </li>
> </ul>
> ```

### Addressability

In the previous examples we have seen the *context* and *to* properties that let us
pointing to some *SmarkForm* component from another.

It may seem we simply used the value of the *name* property of the field we
want to point to. But, in fact, those were "directory-like" relative paths.

We also mentioned that our root form is, in fact, a SmarkForm field that
imports and exports JSON data.

And all SmarkForm fields have a `.find()` method through which we can get any
other fields of the form by providding a relative or absolute (starting with
'/' which points to our root).

**Example:***

```javascript
myForm.export().then(console.log);
// {name:"",surname:"",phones:[""],pets:[{ species: '', name: '' } ] }
const firstPet = myForm.find("pets/0")
firstPet.export().then(console.log);
// { species: '', name: '' } 

```

<!--

TODO:

  * Addressability:
    - Import and export given vectors.

  * AutoId...

-->






### More...

{: .hint }
> Check out our [🔗 Examples section]({{ "resources/examples" | relative_url }})
> to better understand these concepts.


## The `data-smark` Attribute

The `data-smark` attribute is used in SmarkForm to identify and enhance
specific DOM elements (HTML tags) as SmarkForm components. It also provides the
required properties for their enhancement.

{: .warning }
> The terms *attribute* and *property* may lead to confussion.
> 
> In this whole manual, we will consistently use **the term *attribute* to refer
> [HTML elemnts attributes](https://www.w3schools.com/html/html_attributes.asp)**
> and **the term *property* to refer object properties** and, specially
> SmarkForm components's properties defined in their *data-smark* attribute.

By using the `data-smark` attribute, you can mark elements to be transformed
into SmarkForm components, while the remaining elements are ignored by
SmarkForm.

{: .info }
> The following are **exceptions to this rule:**
>
> 1. The root element (the DOM element passed to the SmarkForm constructor to
>    be enhanced as *SmarkForm*) is always considered a SmarkForm component.
> 2. The item template of a list component, which is the only allowed direct
>    child in the HTML source before rendering, will always be rendered (per
>    each list item) as a SmarkForm component by default.
> 
> 👉 **In both cases, the `data-smark` attribute can be omitted.**

**Example:**

```html
<div id="myForm">
    <!-- Other form fields... -->
    <ul data-smark='{"name": "myList", "type": "list", "maxItems": 5}'>
        <li>
            <!-- Template describing list Item's layout -->
        </li>
    </ul>
    <!-- Other form fields... -->
</div>
<script>
    const myForm = new SmarkForm(document.getElementById("myForm"));
</script>
```

{: .hint }
> In the previous example:
>   * The outer `<div>` does not need the *data-smark* property since it is the
>     DOM element we enhanced as a *SmarkForm* root form field.
>   * The `<li>` element is the template that the  *list* component will render
>     as SmarkForm component every time a new item is added to the list.

### Syntax

The `data-smark` attribute should contain a valid JSON object with following
attributes:

  * `type` **(Mandatory):** Which specifies the component type.

  * `name` **(Recommended):** Field name to identify the component in its form
    level. Defaults to the value of the `name` attribute of actual HTML tag. If
    none given, random generated valued will be used instead.

  * *(other...)*: Depending on actual component type...


{: .info }
> 📌 There are also exceptions to this rule:
>
> 1. Any component with the `action` property is of "trigger" type and hence
>    the *type* property can be omitted.
> 
> 2. *Trigger* components are not considered form fields and, therefore, they
>    have no *name* property.


### Shorthand Syntaxes

For the sake of brevity, the *data-smark* attribute can also be specified in
the following alternative ways:

👉 **String Value:**

If only the type needs to be specified, it can be done as a regular string.

> **Example:**
> 
>   * **Shorthand:** `<div data-smark="list">` 
>   * **Long Form:** `<div data-smark='{"type": "list"}'>`

👉 **No value at all:**

Since component type can be infered from actual tag name and attributes, and
field name can be provided as regular property, the whole *data-smark*
attribute value can be omitted if we are happy with this inference:

> **Example:**
> 
>   * **Shorthand:** `<textarea ... data-smark>`
>   * **Long Form:** `<textarea data-smark='{}>`
>   * **Equivalent (type infered) value:** `<textarea data-smark='{"type": "input"}>`



## Mandatory properties

The following properties are (nearly) mandatory:

- The `type` property is always necessary to determine which component type
  controller should be used for rendering the component. In many cases, it can be
  inferred based on the tag name or the presence of the `action` property, which
  forces the type to be "trigger".

- The `name` property is required for all non-trigger components.
   - If not explicitly provided, it can be inferred from the `name` property of
     the tag being enhanced. For example, `<input name="foo" data-smark>`.
   - If not provided and cannot be inferred, a randomly generated name will be
     used.

- The `action` property is mandatory for all [components of the type
  "trigger"](#trigger-components) to specify which [action](actions) they
  actually trigger. In fact, the `type="trigger"` property itself is optional
  here having it is implied by the presence of the `action` property.


**Other properties:**

{: .warning }
> 🚧 This section is still a draft...


    Depending on the actual component type other properties may be applicable.

    In case of *triggers*, despite `type`and `name`, is worth to mention that,
    except for the `context` and `to` properties


    FIXME: To be continued...
    //// ** ... the rest of available properties depend on the type of its [context]()...

    TODO: Link 'context' and 'to' to propper type_trigger.md section...



## Components and Actions

### Components

A SmarkForm *component* is just a DOM element (HTML tag) which has a
"data-smark" property providding a JSON-formatted *options* object.

It looks like as follows:

```html
<input data-smark='{type: "input"}'/>
```

{: .info }
> 📌 If only type option is specified, it can be simplified as:
> ```html
> <input data-smark='input'/>
> ```
> ...or just leave it empty to let SmarkForm engine to figure out its type:
> ```html
> <input data-smark/>
> ```


### Actions

*Actions* are operations that can be performed over components.

Some of them such as `import`, `export` and `clear` are available for all
components types while others are tied to secific types like `addItem` and
`removeItem` for lists, etc...


### Trigger Components

*Trigger Components* are a special type of *component* that serve to trigger
actions on another compoenent which we refer to it as its "context".

Any SmarkForm component whith an *action* property is a [Trigger
Component]({{ "component_types/type_trigger" | relative_url }}) and for the
sake of simplicity, its *type* property can be ommitted but it cannot take a
different value than "trigger".

**Example:**

```html
<button data-smark='{action: "removeItem"}'></button>
```

{: .hint }
> 📖 For detailed information see [Trigger Type Documentation]({{ "component_types/type_trigger" | relative_url }}).


## Accessing Components

Every *SmarkForm* component have a *.find()* method that allows to navigate to
other components throug their *relative path*.


{% include components/sampletabs_tpl.md
    formId="components_paths"
    htmlSource=null
    showEditor=true
%}




