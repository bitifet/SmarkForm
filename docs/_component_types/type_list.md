---
title: «list» Component Type
layout: chapter
permalink: /component_types/type_list
nav_order: 2

---

{% include components/sampletabs_ctrl.md %}

{% raw %} <!-- capture generic_sample_css {{{ --> {% endraw %}
{% capture generic_sample_css
%}/* Make disabled buttons more evident to the eye */
button:disabled {
    opacity: .5;
}{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Introduction](#introduction)
    * [List items](#list-items)
    * [Scalar item types](#scalar-item-types)
    * [Applying the singleton pattern](#applying-the-singleton-pattern)
    * [Nesting lists](#nesting-lists)
* [API Reference](#api-reference)
    * [Options](#options)
        * [min_items](#min_items)
        * [max_items](#max_items)
        * [sortable](#sortable)
        * [exportEmpties](#exportempties)
        * [of](#of)
    * [Actions](#actions)
        * [(Async) export (Action)](#async-export-action)
            * [Options (export)](#options-export)
        * [(Async) import (Action)](#async-import-action)
            * [Options (import)](#options-import)
        * [(Async) clear (Action)](#async-clear-action)
            * [Options (clear)](#options-clear)
        * [(Async) addItem (Action)](#async-additem-action)
            * [Options (addItem)](#options-additem)
        * [(Async) removeItem (Action)](#async-removeitem-action)
            * [Options (removeItem)](#options-removeitem)
        * [count (Action)](#count-action)
            * [Options (count)](#options-count)
        * [position (Action)](#position-action)
            * [Options (position)](#options-position)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>



Introduction
------------

The List component in SmarkForm allows you to dynamically manage a list of
items within your form.

👉 All lists direct children (before rendering) are considered *templates* with
different *roles*.

👉 Default role is "item", which is used as a template for each item in the
list. This template is mandatory.

👉 Other available roles are:

  * `empty_list`: Displayed when the list is empty.
  * `separator`: To visually separate items.
  * `last_separator`: That, if provided, replaces *separator* for last item.
  * More coming soon like `header`, `padding` or `footer`.

👉 Likewise [forms]({{ "component_types/type_form" | relative_url }}), *list*
inputs can be created over any HTML tag <a aria-hidden="true" href="#example-simple_list" style="cursor:pointer" title="Search for «☛ 1» in the code comments">(☛ 1)</a>  **except for actual HTML form
field elements** (`<input>`, `<textarea>`, `<select>`, `<button>`...).


### List items

👉 Lists can contain a variable number of unnamed inputs (list items) of a given
type.

👉 However, in its html source, **lists must only contain templates of supported roles as direct
children** <a aria-hidden="true" href="#example-simple_list" style="cursor:pointer" title ="Search for «☛ 2» in the code comments">(☛ 2)</a>, being the "item" role required and the rest optional.

👉 The user will (or won't) be able to, at its own discretion (and according
certain configurable rules), add or remove items to the list.

👉 Every time a new item is added to the list, **its item template is
automatically rendered as a *SmarkForm* field** (no matter if we explicitly
specified the *data-smark* attribute or not).

👉 If *data-smark* attribute is not provided (or it does not specify the
*type* property), the type "form" is automatically taken by default <a aria-hidden="true" href="#example-simple_list" style="cursor:pointer" title ="Search for «☛ 3» in the code comments">(☛ 3)</a>.

**Example:**

{% raw %} <!-- capture simple_list_example {{{ --> {% endraw %}
{% capture simple_list_example
%}<section data-smark='{"type":"list","name":"users"}'><!-- ☛ 1 -->
    <fieldset style="text-align:right"><!-- ☛ 2, 3, 6 -->
        <p><label>User name:</label><input name='name' type='text' data-smark/></p>
        <p><label>Phone number:</label><input name='phone' type='tel' data-smark/></p>
        <p><label>Email:</label><input name='email' type='text' data-smark/></p>
        <button data-smark='{"action":"removeItem"}' title='Remove User'>➖</button>
    </fieldset>
</section>
<button data-smark='{"action":"addItem","context":"users"}' title='Add User'>➕</button>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture simple_list_example_notes {{{ --> {% endraw %}
{% capture simple_list_example_notes %}
👉 With *exportEmpties* option set to false (default), lists won't export empty
   items.

👉 ...unless there is no enough non empty items to satisfy *minItems* option,
    in which case up tu *minItems* empty items will be exported.
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="simple_list"
    htmlSource=simple_list_example
    cssSource=generic_sample_css
    notes=simple_list_example_notes
    showEditor=true
    tests=false
%}


### Scalar item types

👉 Other field types can be used too as *item template*
<a aria-hidden="true" href="#example-scalar_list" style="cursor:pointer" title ="Search for «☛ 4» in the code comments">(☛ 4)</a>.

👉 ...but, in the case of
([scalar field types]({{ "getting_started/core_component_types#scalar-field-types" | relative_url }}))
it may look like we are limited when it comes to inserting labels **and
triggers** in the item template and hence we can only remove last item every
time in the list.

This would force us to move the *Remove Item* button outside the list
<a aria-hidden="true" href="#example-scalar_list" style="cursor:pointer" title ="Search for «☛ 5» in the code comments">(☛ 5)</a>
like in the following example.


**Example:**

{% raw %} <!-- capture scalar_list_example {{{ --> {% endraw %}
{% capture scalar_list_example
%}<section style="display:grid" data-smark='{"type":"list","name":"phones"}'>
    <input placeholder='Phone number' type='tel'/><!-- ☛ 4, 6 -->
</section>
<button data-smark='{"action":"addItem","context":"phones"}' title='Add Phone'>➕</button>
<button data-smark='{"action":"removeItem","context":"phones"}' title='Remove Phone'>➖</button> <!-- ☛ 5 -->{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="scalar_list"
    htmlSource=scalar_list_example
    cssSource=generic_sample_css
    showEditor=true
    tests=false
%}

{: .hint}
> Notice that in this example, likewise the *fieldset* in the former, the
> *input* tag has no "name" attribute
> <a aria-hidden="true" href="#example-scalar_list" style="cursor:pointer" title="Search for «☛ 6» in the code comments">(☛ 6)</a>.
> This is because it is a list item
> template and it's actual name attribute will be automatically set depending
> on its position in the array every time a new item is added, moved or
> removed.

👉 Now, when the user clicks the *Remove Item* button, it will default to the
last item of the list, **but we cannot ([yet](#applying-the-singleton-pattern))
cherry-pick which item we'd like to remove**.


### Applying the singleton pattern


Thankfully, all *Scalar field types* implement the
[Singleton Pattern]({{ "/getting_started/core_component_types#the-singleton-pattern" | relative_url }})
so that we can use any other html tag in place and just put the form field tag
inside.

**Example:**

{% raw %} <!-- capture singleton_list_example {{{ --> {% endraw %}
{% capture singleton_list_example
%}<ul data-smark='{"name": "phones", "of": "input", "max_items": 3}'>
    <li>
        <input placeholder='Phone Number' type="tel" data-smark>
        <button data-smark='{"action":"removeItem"}' title='Remove Phone'>➖</button>
    </li>
</ul>
<button data-smark='{"action":"addItem","context":"phones"}' title='Add Phone'>➕</button>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="singleton_list"
    htmlSource=singleton_list_example
    cssSource=generic_sample_css
    showEditor=true
    tests=false
%}


{: .info}
> In this example we have omitted the `type: "list"` bit and still works because
> *SmarkForm* automatically inferes the type from the HTML tag.
> 
> {: .warning}
> > This is handy for fast developping but it is **not a recommended practice**
> > since our designer may decide to change the tag for the template and different
> > type could be infered.


### Nesting lists

Since they're just smarkform fields, *lists* can be nested as needed.

Now we are prepared to extend our initial *Users list* example by providding,
say, up to three phone numbers and up to three emails.


**Example:**

{% raw %} <!-- capture nesting_list_example {{{ --> {% endraw %}
{% capture nesting_list_example
%}<section data-smark='{"type":"list","name":"users"}'>
    <fieldset>
        <legend>User</legend>
        <button data-smark='{"action":"removeItem"}' title='Remove User'>➖</button>
        <input name='name' placeholder='User name' type='text' data-smark/>
        <fieldset>
            <legend>
                <span
                    data-smark='{"action":"addItem","context":"phones"}'
                    title='Add Phone'
                    style="background: lightgray; padding:.3em; border-radius:3px; margin: .4em"
                >➕</span>
                Phone Numbers
            </legend>
            <ul data-smark='{"type": "list", "name": "phones", "of": "input", "max_items": 3}'>
                <li>
                    <input type="tel" data-smark>
                    <button data-smark='{"action":"removeItem"}' title='Remove Phone'>➖</button>
                </li>
            </ul>
        </fieldset>
    </fieldset>
</section>
<button data-smark='{"action":"addItem","context":"users"}' title='Add User'>➕ Add user</button>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="nesting_list"
    htmlSource=nesting_list_example
    cssSource=generic_sample_css
    showEditor=true
    tests=false
%}

{: .hint}
> As you can see here, phones and emails lists share almost the same layout.
> 
> Since *SmarkForm* works just over the DOM, you can use your preferred HTML 
> templating system. For instance, 
> [here](https://github.com/bitifet/SmarkForm/blob/main/src/examples/include/mixins.pug)
> you can see a similar *mixin* implemented whith [Pug templates](https://pugjs.org).
> 
> Also it 
> [is planned]({{ "about/features" | relative_url }}#flexible-and-extendable)
> to implement a *mixin* feature allowing to create SmarkForm components from
> *SmarkForm* html code.



For more information on using the List component and its available methods,
please refer to the [API Reference](#api-reference).


API Reference
-------------

### Options

#### min_items

Establishes the minimum number of items allowed.

  * **Type:** Number
  * **Default value:** 1
  * **Minimum value:** 0


#### max_items

Establishes the maximum number of items allowed.

  * **Type:** Number
  * **Default value:** Infinity
  * **Minimum value:** Infinity


#### sortable

Controls wether the list can be user sorted by dragging and dropping list items.

  * **Type:** Boolean
  * **Default value:** false

{: .hint}
> Drag and Drop events are not natively supported by touch devices.
>
> They can be emulated in serveral ways. A quite straighforward one is through the *dragdroptouch* library from Bernardo Castilho:
>
> 🔗 [https://github.com/drag-drop-touch-js/dragdroptouch](https://github.com/drag-drop-touch-js/dragdroptouch)


#### exportEmpties

Controls whether unfilled list items should be exported or not. This allows for
neater arrays when the user adds more items to the list than are used.

  * **Type:** Boolean
  * **Default value:** false


#### of

Specify a field type for list items. Handy to avoid specifying a whole
*data-smark* attribute in the template to just specify the field type when
needed.

  * **Type:** string
  * **Default value:** undefined


### Actions

{{ site.data.definitions.actions.intro }}

The `list` component type supports the following actions:


#### (Async) export (Action)

##### Options (export)

  * **action:** (= "export")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * {{ site.data.definitions.actions.options.target_export }}


#### (Async) import (Action)

##### Options (import)

  * **action:** (= "import")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * {{ site.data.definitions.actions.options.target_import }}
  * **data:** (array / any¹)
  * **focus:** (boolean, default true)


{: .hint}
> ¹) If non array value is provided as *data*, then it is automatically wrapped
> as such as a failback.

#### (Async) clear (Action)

(Shorhand for `import([])`)

##### Options (clear)

  * **action:** (= "clear")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}


#### (Async) addItem (Action)

##### Options (addItem)

  * **action:** (= "addItem")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * **target:** Path★  (absolute or relative to its *context*) to a component to be used as a base reference to calculate the position of the new item. If not provided, the last item in the list will be used.
  * **position:** (= "after" (default) / "before") Determines where the new item will be inserted in relation to the target.
  * **source:** (Path★  (absolute or relative **to the newly created item**).
    If provided, the matched component value (result of its *export* action)
    will be imported to the new item.
  * **autoscroll:**,   = "elegant" / "self" / "parent" / *falsy*
  * **failback:** (= "none" / "throw" (default)) Avoid emitting the "LIST_MAX_ITEMS_REACHED" event when the maximum number of items is reached.

#### (Async) removeItem (Action)



##### Options (removeItem)

  * **action:** (= "removeItem")
  * {{ site.data.definitions.actions.options.origin }}
  * {{ site.data.definitions.actions.options.context }}
  * **target:** Path★  (absolute or relative to its *context*) to the component to be removed. If not provided, the last item in the list will be used.
  * **autoscroll:**  (= "elegant" / "self" / "parent" / *falsy*)
  * **preserve_non_empty:** (boolean)
  * **failback:** (= "none" / "clear" / "throw" )


#### count (Action)

##### Options (count)

  * **action:**: (= "count")
  * **delta:**: (default 0)


#### position (Action)

##### Options (position)

  * **action:**: (= "position")
  * **offset:**: (default 1)

