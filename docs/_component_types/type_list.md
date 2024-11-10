---
title: «list» Component Type
layout: chapter
permalink: /component_types/type_list
nav_order: 2

generic_sample_css: |
    button:disabled {
        opacity: .5;
    }

simple_list_example: |
    <div id="myForm$$">
        <section data-smark='{"type":"list","name":"users"}'><!-- 1️⃣  -->
            <fieldset><!-- 2️⃣ , 3️⃣ , 6️⃣  -->
                <input name='name' placeholder='User name' type='text' data-smark/>
                <input name='phone' placeholder='Phone number' type='tel' data-smark/>
                <input name='email' placeholder='Email' type='text' data-smark/>
                <button data-smark='{"action":"removeItem"}' title='Remove User'>❌</button>
            </fieldset>
        </section>
        <button data-smark='{"action":"addItem","context":"users"}' title='Add User'>➕</button>
    </div>

scalar_list_example: |
    <div id="myForm$$">
        <section data-smark='{"type":"list","name":"phones"}'>
            <input placeholder='Phone number' type='tel'/><!-- 4️⃣ , 6️⃣  -->
        </section>
        <button data-smark='{"action":"addItem","context":"phones"}' title='Add Phone'>➕</button>
        <button data-smark='{"action":"removeItem","context":"phones"}' title='Remove Phone'>❌</button> <!-- 5️⃣  -->
    </div>

singleton_list_example: |
    <div id="myForm$$">
        <ul data-smark='{"name": "phones", "of": "input", "max_items": 3}'>
            <li>
                <input placeholder='Phone Number' type="tel" data-smark>
                <button data-smark='{"action":"removeItem"}' title='Remove Phone'>❌</button>
            </li>
        </ul>
        <button data-smark='{"action":"addItem","context":"phones"}' title='Add Phone'>➕</button>
    </div>

nesting_list_example: |
    <div id="myForm$$">
        <section data-smark='{"type":"list","name":"users"}'>
            <fieldset>
                <input name='name' placeholder='User name' type='text' data-smark/>
                <hr>
                <ul data-smark='{"type": "list", "name": "phones", "of": "input", "max_items": 3}'>
                    <li>
                        <input placeholder='Phone Number' type="tel" data-smark>
                        <button data-smark='{"action":"removeItem"}' title='Remove Phone'>❌</button>
                    </li>
                </ul>
                <button data-smark='{"action":"addItem","context":"phones"}' title='Add Phone'>➕</button>
                <hr>
                <ul data-smark='{"type": "list", "name": "emails", "of": "input", "max_items": 3}'>
                    <li>
                        <input placeholder='Email address' type="email" data-smark>
                        <button data-smark='{"action":"removeItem"}' title='Remove Email'>❌</button>
                    </li>
                </ul>
                <button data-smark='{"action":"addItem","context":"emails"}' title='Add Email'>➕</button>
                <hr>
                <button data-smark='{"action":"removeItem"}' title='Remove User'>❌</button>
            </fieldset>
        </section>
        <button data-smark='{"action":"addItem","context":"users"}' title='Add User'>➕</button>
    </div>


simple_list_animation_example: |
    <div id="myForm$$">
        <button data-smark='{"action":"addItem","context":"phones"}' title='Add Phone'>➕ Add Phone</button>
        <ul data-smark='{"name": "phones", "of": "input", "min_items": 0}'>
            <li>
                <input placeholder='Phone Number' type="tel" data-smark>
                <button data-smark='{"action":"removeItem"}' title='Remove Phone'>❌</button>
            </li>
        </ul>
        <!-- This is just a regular SmarkForm list. -->
        <!-- See CSS and JS code to see what changes... -->
    </div>

simple_list_animation_example_additem_css: |
    .animated_item {
        transform: scaleY(0) translateY(-50%);
    }
    .animated_item.ongoing {
        transform: default;
        transition:
            transform 150ms ease-in
        ;
    }

simple_list_animation_example_additem_js: |
    const myForm = new SmarkForm(document.getElementById("myForm$$"));
    const delay = ms=>new Promise(resolve=>setTimeout(resolve, ms));
    myForm.onAll("addItem", function({
        newItemTarget, /* the targetNode of the future new item */
        onRendered
    }) {
        newItemTarget.classList.add("animated_item");
        onRendered(async (newItem)=>{
            await delay(1); /* Allow for default .animated_item style to be applied */
            newItem.targetNode.classList.add("ongoing");
            /* Here we could have used newItemTarget instead */
        });
    });

simple_list_animation_example_complete_css: |
    .animated_item {
        transform: scaleY(0) translateY(-50%);
        /* Add transition for removal effect */
        transition:
            transform 150ms ease-out
        ;
    }
    .animated_item.ongoing {
        transform: scaleY(1) translateY(0%);
        transition:
            transform 150ms ease-in
        ;
    }

simple_list_animation_example_complete_js: |
    const myForm = new SmarkForm(document.getElementById("myForm$$"));
    const delay = ms=>new Promise(resolve=>setTimeout(resolve, ms));
    myForm.onAll("addItem", function({
        newItemTarget, /* the targetNode of the future new item */
        onRendered
    }) {
        newItemTarget.classList.add("animated_item");
        onRendered(async (newItem)=>{
            await delay(1); /* Allow for default .animated_item style to be applied */
            newItem.targetNode.classList.add("ongoing");
            /* Here we could have used newItemTarget instead */
        });
    });
    myForm.onAll("removeItem", async function({
        oldItemTarget,
        onRemmoved
    }) {
        oldItemTarget.classList.remove("ongoing");
        /* Await for transition to be finished before item removal: */
        await delay(150);
    });

---


{% include components/sampletabs_ctrl.md %}


# {{ page.title }}

<details>
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
        * [(Async) addItem (Action)](#async-additem-action)
            * [properties (addItem)](#properties-additem)
        * [(Async) removeItem (Action)](#async-removeitem-action)
            * [properties (removeItem)](#properties-removeitem)
        * [(Async) empty (Action)](#async-empty-action)
            * [properties (empty)](#properties-empty)
        * [count (Action)](#count-action)
            * [properties (count)](#properties-count)
    * [Events](#events)
        * [addItem (list Event)](#additem-list-event)
        * [removeItem (list Event)](#removeitem-list-event)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>



Introduction
------------

The List component in SmarkForm allows you to dynamically manage a list of
items within your form.

👉 It uses the content of the container element as a template for each item in
the list.

👉 Likewise [forms]({{ "component_types/type_form" | relative_url }}), *list*
inputs can be created over any HTML tag1️⃣  **except for actual HTML form
elements** (`<input>`, `<textarea>`, `<select>`, `<button>`...).


### List items

👉 Lists can contain a variable number of unnamed inputs (list items) of a given
type.

👉 However, in its html source, **list fields must contain exactly one direct
child**2️⃣  (the template).

👉 The user will (or won't) be able to, at its own discretion (and according
certain configurable rules), add or remove items to the list.

👉 Every time a new item is added to the list, **its item template is
automatically rendered as a *SmarkForm* field** (no matter if we explicitly
specified the *data-smark* attribute or not).

👉 If *data-smark* attribute is not provided (or it does not specify the
*type* property), the type "form" is automatically taken by default3️⃣ .

**Example:**

{% include components/sampletabs_tpl.md
   formId="simple_list"
   htmlSource=page.simple_list_example
   cssSource=page.generic_sample_css
%}



### Scalar item types

👉 Other field types can be used too as *item template*4️⃣ .

👉 ...but, in the case of
([scalar field types]({{ "getting_started/core_component_types#scalar-field-types" | relative_url }}))
it may look like we are limited when it comes to inserting labels **and
triggers** in the item template and hence we can only remove last item every
time in the list.

This would forece us to move the *Remove Item* button outside the list5️⃣  like in the
following example.


**Example:**

{% include components/sampletabs_tpl.md
   formId="scalar_list"
   htmlSource=page.scalar_list_example
   cssSource=page.generic_sample_css
%}

{: .hint}
> Notice that in this example, likewise the *fieldset* in the former, the
> *input* tag has no "name" attribute6️⃣ . This is because it is a list item
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

{% include components/sampletabs_tpl.md
   formId="singleton_list"
   htmlSource=page.singleton_list_example
   cssSource=page.generic_sample_css
%}

{: .info}
> In this example we have omitted the `type: "list"` bit and still works because
> *SmarkForm* automatically inferes the type from the HTML tag.
> 
> {: .warning}
> > This is hany for fast developping but it is **not a recommended practice**
> > since our designer may decide to change the tag for the template and different
> > type could be infered.


### Nesting lists

Since they're just smarkform fields, *lists* can be nested as needed.

Now we are prepared to extend our initial *Users list* example by providding,
say, up to three phone numbers and up to three emails.


**Example:**

{% include components/sampletabs_tpl.md
   formId="nesting_list"
   htmlSource=page.nesting_list_example
   cssSource=page.generic_sample_css
%}


{: .hint}
> As you can see here, phones and emails lists share almost the same layout.
> 
> Since *SmarkForm* work just over the DOM, you can use your preferred HTML 
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


#### exportEmpties

Controls whether unfilled list items should be exported or not. This allows for
neater arrays when the user adds more items to the list than are used.

  * **Type:** Boolean
  * **Default value:** false


#### of

Specify a field type for list items. Handy to avoid spacifying a whole
*data-smark* attribute in the template to just specify the field type when
needed.

  * **Type:** string
  * **Default value:** undefined


### Actions

#### (Async) addItem (Action)

##### properties (addItem)

  * **action:** (= "addItem")
  * **origin:**
  * **context:**
  * **target:**
  * **position:** = "after" (default) / "before"
  * **autoscroll:**,   = "elegant" / "self" / "parent" / *falsy*

#### (Async) removeItem (Action)



##### properties (removeItem)

  * **action:**: (= "removeItem")
  * **origin:**
  * **context:**
  * **target:**
  * **autoscroll:**,   = "elegant" / "self" / "parent" / *falsy*
  * **keep_non_empty:**
  * **failback:**


#### (Async) empty (Action)

##### properties (empty)

  * **action:**: (= "empty")

#### count (Action)

##### properties (count)

  * **action:**: (= "count")



### Events

The List component emits the following events:

#### addItem (list Event)

Triggered when a new item is going to be added to the list.

👉 This event occurs just **after** the new item node is created and **before**
it is actually inserted in the DOM.

**Properties:**

Event data contains the properties received by the originating `addItem`
action, plus the following properties:

  * `newItemTarget`: The new DOM element that is about to be inserted (not yet
    a component).

  * `onRendered`: A callback setter that allows executing code after the item
    being actually inserted in the DOM and rendered as a new child component of
    the list. The newly created child component is provided as an argument to
    the callback.


**Example:**

{% include components/sampletabs_tpl.md
   formId="simple_list_animation_additem"
   htmlSource=page.simple_list_animation_example
   cssSource=page.simple_list_animation_example_additem_css
   jsSource=page.simple_list_animation_example_additem_js
%}


In this example, we add the CSS class `ingoing` to the new item before it is
rendered, and then change it by the class (`ongoing`) after it is rendered.

This way we can animate the insertion of a new item with a few CSS lines such
as follows:


#### removeItem (list Event)

Triggered when an item is going to be removed from the list. This event occurs
just **before** removing the item from the DOM and the list itself.

Event data contains the properties received by the originating `removeItem`
action, plus the following properties:

  * `oldItem`: The child component (Smark component) of the list that is about
    to be removed.

  * `oldItemTarget`: The DOM element that is about to be removed from the DOM
    (the targetNode of `oldItem`).

  * `onRemoved`: A callback setter that allows executing code after
    `oldItemTarget` is actually removed from the DOM and `oldItem` is removed
    from the list.  No arguments will be provided to this callback.


**Example:**

Following example extends the previous one adding a collapsing effect every
time an item is removed from the list.

{% include components/sampletabs_tpl.md
   formId="simple_list_animation_complete"
   htmlSource=page.simple_list_animation_example
   cssSource=page.simple_list_animation_example_complete_css
   jsSource=page.simple_list_animation_example_complete_js
%}



In this example, we add the `outgoing` CSS class to the item being removed so
that it can be easily animated with a few CSS.

Then it wait for the specified transition duration to elapse preventing the
item being actually removed from the DOM until animation finished.




