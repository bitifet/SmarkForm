---
title: Quick Start
layout: chapter
permalink: /getting_started/quick_start
nav_order: 1

---

{% include links.md %}

# {{ page.title }}

A SmarkForm form can be created by following a few simple steps:

{: .info :}
> This section is meant to be educational. If you are eager to get your hands
> dirty, 🏁 go straight to the
> [Examples]({{ "resources/examples" | relative_url }}) section, download the
> one you like the most, and start editing to see what happens.

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Basic setup](#basic-setup)
    * [Create an HTML document](#create-an-html-document)
    * [Include SmarkForm Library](#include-smarkform-library)
    * [Create a simple HTML form](#create-a-simple-html-form)
    * [Initialize the Form](#initialize-the-form)
* [Do the magic](#do-the-magic)
    * [Actions and Triggers](#actions-and-triggers)
    * [Exporting data](#exporting-data)
    * [Importing data](#importing-data)
    * [Form traversing](#form-traversing)
    * [Context and Target](#context-and-target)
* [Go further...](#go-further)
    * [Event handling](#event-handling)
    * [Hot Keys](#hot-keys)
    * [Animated and sortable lists](#animated-and-sortable-lists)
* [Customize your form](#customize-your-form)
* [Final notes](#final-notes)
    * [Boilerplate file](#boilerplate-file)
    * [You don't need a form tag](#you-dont-need-a-form-tag)
    * [Using your own copy of SmarkForm library](#using-your-own-copy-of-smarkform-library)
    * [Alternative forms to get/include Smarkform](#alternative-forms-to-getinclude-smarkform)
    * [The option's object](#the-options-object)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>

{% include components/sampletabs_ctrl.md %}

## Basic setup

### Create an HTML document


```html
<!DOCTYPE html>
<html>
  <head>
    <title>My First SmarkForm Form</title>
  </head>
  <body>
    <h1>My First SmarkForm Form</h1>
  </body>
</html>
```

{: .info}
> Alternatively, you can just pick our [Boilerplate file](#boilerplate-file) so
> that you can miss the [third](#3-include-smarkform-library) and
> [fourth](#4-initialize-the-form) steps of this guide too and 🚀 go stright to
> the [nitty](#2-create-an-html-form)-[gritty](#5-do-the-magic).

### Include SmarkForm Library

Next, load SmarkForm to your document.

The easiest way is using a CDN:

```html
<script src="{{ smarkform_umd_cdn_current }}"></script>
```

{: .info}
> Alternatively you can [use a local copy of
> SmarkForm](#using-your-own-copy-of-smarkform-library) if you don't want to rely on external
> sources like a CDN.
>
> 👉 You can get and include SmarkForm in your code in [a lot of different
> ways](#alternative-forms-to-getinclude-smarkform).


You can also add an additional `<script>` tag for the few JS code we will need
to write.

Our complete layout may look as follows:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My First SmarkForm Form</title>
    <script src="{{ smarkform_umd_cdn_current }}"></script>
  </head>
  <body>
    <h1>My First SmarkForm Form</h1>
    <!-- Your form markup goes here -->
    <script>
      /* Your JS code goes here */
    </script>
  </body>
</html>
```


### Create a simple HTML form

Start by writing the form markup in plain HTML. For example, let's create a
simple form like the following:

{% raw %} <!-- html_source_legacy {{{ --> {% endraw %}
{% capture html_source_legacy
%}<p>
    <label for="nameField$$">Name:</label>
    <input type="text" id="nameField$$" name="name">
</p>
<p>
    <label for="emailField$$">Email:</label>
    <input type="email" id="emailField$$" name="email">
</p>
<p>
    <button>❌ Clear</button>
    <button>💾 Submit</button>
</p>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="simple_legacy"
    htmlSource=html_source_legacy
    jsSource="-"
    tests=false
%}

{: .info}
> You may notice that there is no `<form>` tag. Just a regular `<div>`, in this
> example with an Id that we will use to capture the node to enhance it as a
> *SmarkForm* instance.
> 
> You can use a `<form>` tag instead if you like, but it is [not actually
> necessary](#you-dont-need-a-form-tag).


### Initialize the Form

In your JavaScript tag, create a new instance of the SmarkForm class and pass
the DOM node of the form container as parameter:

{% include components/sampletabs_tpl.md
    formId="simple_initialized"
    htmlSource=html_source_legacy
    selected="js"
    tests=false
%}

Ok: Nothing exciting happended by now.

👉 **But keep reading...** 🚀


## Do the magic

By default, *SmarkForm* ignores all DOM elements in its container unless they
are marked with the [data-smark
]({{ "getting_started/core_concepts" | relative_url }}#the-data-smark-attribute)
attribute.

{: .info }
> This is because you can have html fields or buttons that belong to other
> components or functionalities of the page and you don't want them to be taken
> as part of the form.

Let's mark all fields, buttons and labels... by adding a *data-smark* attribute :

{% raw %} <!-- html_source_enhanced {{{ --> {% endraw %}
{% capture html_source_enhanced
%}<p>
    <label data-smark>Name:</label>
    <input type="text" name="name" data-smark>
</p>
<p>
    <label data-smark>Email:</label>
    <input type="email" name="email" data-smark>
</p>
<p>
    <button data-smark='{"action":"clear"}'>❌ Clear</button>
    <button data-smark='{"action":"export"}'>💾 Submit</button>
</p>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="enhanced_simple_form"
    htmlSource=html_source_enhanced
    tests=false
%}



Now, if you go to the *Preview* tab and fill some data in, you can then hit de
`❌ Clear` button and see that, **it already works!!** 🎉

Okay, we actually assigned a specific value to the Clear button's *data-smark*
attribute: `{"action":"clear"}`. But that's all we did!! (We will get back to
this in the [next section](#actions-and-triggers)).

Also notice that the *for* attribute of all `<label>`s had been removed and they
still work (if you click on them, corresponging fields get focus anyway).


{: .info}
> All elements with a 
> [data-smark](/getting_started/core_concepts#the-data-smark-attribute)
> attribute are *SmarkForm*
> [components](/getting_started/core_concepts#components) of a certain type.

👉 *SmarkForm* components' type [is often
implicit](/getting_started/core_concepts#syntax), either by their tag name
(like the `<label>` elements), their *type* attribute in case of `<input>`s or
by the presence of the *action* property that tell us they are action
[triggers](getting_started/core_component_types#type-trigger).



### Actions and Triggers

SmarkForm components with the *action* property defined in their *data-smark*
object, are called "triggers" and they serve to invoke so called "actions"
typically when the trigger is clicked or pressed.

For example, the `❌ Clear` button has the *action* property set to `"clear"`, so
when it is clicked, it will trigger the *clear* action.

However actions must be applied to some component. **That component is called the *context* of the action**.

The context of actions called by triggers is, by default, their *natural context* unless other component is specified through the *context* property.

{: .info :}
> The *natural context* of a trigger is the innermost of its *SmarkForm*
> component ancestors **that implements that action** (Which is the whole form
> in the previous example since the *form component type* implements the
> *clear* action).
> 
>  📌 In fact, the *clear* action is implemented by all *SmarkForm* component
>  types.

👉 That's why the `❌ Clear` button cleared the whole form in the previous example.

Let's add more `❌ Clear` buttons to clear each specific field:

{% raw %} <!-- html_source_enhanced_with_clears {{{ --> {% endraw %}
{% capture html_source_enhanced_with_clears
%}<p>
    <label data-smark>Name:</label>
    <input type="text" name="name" data-smark>
    <button data-smark='{"action":"clear", "context":"name"}'>❌ Clear</button>
</p>
<p>
    <label data-smark>Email:</label>
    <input type="email" name="email" data-smark>
    <button data-smark='{"action":"clear", "context":"email"}'>❌ Clear</button>
</p>
<p>
    <button data-smark='{"action":"clear"}'>❌ Clear</button>
    <button data-smark='{"action":"export"}'>💾 Submit</button>
</p>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="enhanced_simple_form_with_clears"
    htmlSource=html_source_enhanced_with_clears
    tests=false
%}


Since we cannot insert the trigger buttons inside the `<input>` fields (unless
using a
[singleton]({{ "/getting_started/core_concepts#singletons" | relative_url }}))
we had to explicitly set the *context* of those triggers by the *relative path*
from their *natural context*.

{: .info :}
> The *context* of a *trigger* can be specified either as a relative path from its
> *natural conext* or as an absolute path from the form root.

👉 Now you can either clear the whole form by clicking the `❌ Clear` button or
just clear each field individually by clicking the `❌ Clear` button next to
each field.



### Exporting data

Although it may seem the opposite, the `💾 Submit` button in the previous
example is already working. It's just we set it to trigger the *export* action
but **we haven't told it what to do** with exported data.

👉 This can be done by **listening to the *AfterAction_export* event**. See
[Event handling](#event-handling) below...

The export of the form comes as JSON in the *data* property of the *event* object.

{: .hint :}
> Alternatively, as we will explore in the [Context and
> Target](#context-and-target) section later, we could have just set the
> "target" property pointing to to another object since all actions can be
> applied to any component as their context.
> 
> But, having we want to export the whole form, we'd probably prefer to listen
> the export event and validate and/or bring the data somewhere else.

In the following example we listen to the *AfterAction_export* event and show the exported data in an alert window:


**Example:**

{% raw %} <!-- form_export_example_js {{{ --> {% endraw %}
{% capture form_export_example_js
%}
/* Show exported data in an alert() window */
myForm.on("AfterAction_export", (event)=>{
    window.alert(JSON.stringify(event.data, null, 4));
});{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture form_export_example_notes {{{ --> {% endraw %}
{%capture form_export_example_notes
%}👉 Alternatively, most event handlers can be provided at once through the [options
object](#the-options-object).
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="enhanced_withExport"
    htmlSource=html_source_enhanced
    jsSource=form_export_example_js
    notes=form_export_example_notes
    selected="js"
    tests=false
%}


👉 Now go to the *Preview* tab, fill some data in and try clicking the `💾
Submit` button.

Everything works now. 🎉


{: .hint :}
> All *SmarkForm* actions are just special methods that can be called from
> properly placed *trigger* components avoiding all the burden of manually
> wiring user interactions.
> 
> This enormously simplifies form controllers' implementation, but they can
> also be be programatically invoked whenever required.
> 
> ```javascript
> const data = await myForm.export();
> ```


### Importing data

To load (JSON) data into the form, we use the *import* action which works in a
similar way to the *export* action but in the opposite direction.

{% raw %} <!-- html_source_enhanced_withImport {{{ --> {% endraw %}
{% capture html_source_enhanced_withImport
%}<p>
    <label data-smark>Name:</label>
    <input type="text" name="name" data-smark>
</p>
<p>
    <label data-smark>Email:</label>
    <input type="email" name="email" data-smark>
</p>
<p>
    <button data-smark='{"action":"import"}'>📂 Import</button>
    <button data-smark='{"action":"clear"}'>❌ Clear</button>
    <button data-smark='{"action":"export"}'>💾 Submit</button>
</p>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% raw %} <!-- form_export_example_withImport_js {{{ --> {% endraw %}
{% capture form_export_example_withImport_js
%}/* Import data from prompt() window */
myForm.on("BeforeAction_import", async (ev)=>{
    /* Read new value: */
    const json_template = '{"name": "", "email": ""}'; /* Little help to edit */
    let data = window.prompt("Edit JSON data", json_template);
    if (data === null) return void ev.preventDefault(); /* User cancelled */
    /* Parse as JSON, warn if invalid and set */
    try {
        data = JSON.parse(data); ev.data = data; /* ← Set the new value */
    } catch(err) {
        alert(err.message); /* ← Show error message */
        ev.preventDefault();
    };
});{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% include components/sampletabs_tpl.md
    formId="enhanced_withImport"
    htmlSource=html_source_enhanced_withImport
    jsHidden=form_export_example_js 
    jsSource=form_export_example_withImport_js
    selected="js"
    tests=false
%}



### Form traversing

As we already stated, *actions* can be triggered both by interacting with
trigger components or by calling them programatically like in the following
example we already saw before:


```javascript
const data = await myForm.export();
```

And the *SmarkForm* root form is just a field of the type "form".

What if we want to interact directly with a specific part of the form?

Here the `.find()` method of every *SmarkForm* field comes to the rescue:

It takes a single argument with a "path-like" route to the field we want to access.

This path can be either relative (to the current field) or absolute (to the form root).

{% raw %} <!-- capture traversing_form_example {{{ --> {% endraw %}
{% capture traversing_form_example
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

{% raw %} <!-- traversing_form_example_callback_js {{{ --> {% endraw %}
{% capture traversing_form_example_callback_js
%}/* Set business name */
myForm.onRendered(async ()=>{
    myForm.find("/businessData").import({name: "Bitifet"});
     /* 👉 Since we don't provide the address field, it will be cleared */
});{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- traversing_form_example_async_js {{{ --> {% endraw %}
{% capture traversing_form_example_async_js
%}/* Set business name */
(async ()=>{
    await myForm.rendered;
    myForm.find("/businessData").import({name: "Bitifet"});
    /* 👉 Since we don't provide the address field, it will be cleared */
})();{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="traversing_example_callback"
    htmlSource=traversing_form_example
    jsSource=traversing_form_example_callback_js
    selected="js"
    tests=false
%}


{: .warning :}
> Before using the `.find()` method, we need to make sure the form is already
> rendered, otherwise we could end up finding a componend field that doesn't
> (yet) exist.
> 
> To do so, we can either pass a callback to the `onRendered()` method or,
> within an async function, await for the `rendered` promise to resolve before
> calling the `.find()` method.

The following demonstrates the same example but awaiting to the `rendered`
promise in an async function:

{% include components/sampletabs_tpl.md
    formId="traversing_example_async"
    htmlSource=traversing_form_example
    jsSource=traversing_form_example_async_js
    selected="js"
    tests=false
%}


### Context and Target

As [we've seen](#actions-and-triggers), when we trigger an action, we
(implicitly or explicitly) provide a *context* to it.

👉 The *context* of an action **is the component over which the action will be
applied**.

→  When called from a trigger component, the *context* is determined by the
property of the same name in the *data-smark* object of the trigger if
provided, or by the *natural context* of the trigger otherwise.

→  When called programatically, the *context* is simply the component over
which the *action* method is called.


👉 In addition to the *context* many actions also accept another parameter
called "target".

→  **The *target* is the *context*'s child over which the action will be
applied.**

→ ...it is determined in a similar way to the *context*: If the direct parent
of the trigger component does not implement the action (and hence cannot be the
*context*), then the greandparent is checked in turn and, if so, the direct
parent is picked as the *target*. And so on until the *context* is found.

{: .hint :}
> This may seem confusing at first but, as you get used to it, you get the
> superpower of connecting actions to their context and target just by placing
> them in the propper place in the DOM tree.
> 
> 📌 And, whenever it is not possible, you only need to specify the relative
> (or absolute) path in the *context* and/or *target* properties of the
> *data-smark* object of the trigger component..


**Example 1:** Lists

For instance, the *addItem* and *removeItem* actions are implemented only by
the *list* component type so, if you put a *removeItem* trigger inside a list
item, it will remove that item from the list. **No wiring code needed!**

{% capture simple_list_example
%}<p>
    <strong data-smark='label'>Phones:</strong>
    <ul data-smark='{"name": "phones", "of": "input"}'>
        <li>
            <label data-smark>📞 </label>
            <input placeholder='+34...' type="tel" data-smark>
            <button data-smark='{"action":"removeItem"}' title='Remove Phone'>❌</button>
        </li>
    </ul>
    <button data-smark='{"action":"addItem","context":"phones"}' title='Add Phone'>➕ </button>
</p>{%
endcapture %}

{% raw %} <!-- traversing_form_example_js {{{ --> {% endraw %}
{% capture simple_list_js
%}

/* Nothing to se here...

   removeItem triggers(s) are inside the list items so both their context and
   targeet are propperly set just by it's placement in the SmarkForm tree.

   👉 See the "Notes" tab for more details...

*/{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture simple_list_example_notes %}
👉 This example uses the *singleton* pattern which is out of the scope of this
   section. But, by now, you can just think of the list items as *SmarkForm*
   field components of the type specified in the *of* property of the list
   component.
{%  endcapture %}


{% include components/sampletabs_tpl.md
   formId="simple_list"
   htmlSource=simple_list_example
   jsSource=simple_list_js
   notes=simple_list_example_notes
    tests=false
%}

{: .info :}
> In the case of the *addItem* action, it will add a new item to the list after
> the *SmarkForm* field in which is placed (or before if the
> [*position* option]({{ "/component_types/type_list#async-additem-action" | relative_url }})
> is set to "before").
> 
> I won't repeat the previous example now, but you will find several examples
> of this across this manual.



**Example 2:** Import and Export targets

Even all *SmarkForm* field compoenent types implement both the *export* and
*import* actions, so that the *target* will always default to null, we can
explicitly set the target in *import* and/or *export* triggers:

{: .info :}
> 👉 When the *import* action is called with an explicit *target*, it will call
> the export action of the target and import the data to its context.
> 
> 👉 Similarly, when the *export* action is called with an explicit *target*,
> it will call the import action of the target with the exported data.

🚀 This means we can clone list items or import/export whole subforms into
other fields (no matter their type -since they will do their best to import
received data-) **with no single line of JS code** like in the following
example:

{% raw %} <!-- html_source_simplified {{{ --> {% endraw %}
{% capture html_source_simplified
%}█<p>
█    <label data-smark>Name:</label>
█    <input type="text" name="name" data-smark>
█</p>
█<p>
█    <label data-smark>Email:</label>
█    <input type="email" name="email" data-smark>
█</p>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue %}{ "name": "Alice Johnson", "email": "alice.johnson@example.com" }{% endcapture %}

{% include components/sampletabs_tpl.md
    formId="simplified"
    htmlSource=html_source_simplified
    demoValue=demoValue
    showEditor=true
    showEditorSource=true
    tests=false
%}

⚡ Check the JS tab to see there is no import/export JS code at all and the
preview tab to see how it works perfectly.

{: .hint :}
>  This trick is used in almost all the examples in the rest of this manual to
>  provide the export/edit/import facilities except for that, unlike here, the
>  surrounding layout is hidden for the sake of clarity.



## Go further...




### Event handling

We've already seen how to listen to the *AfterAction_export* and
*BeforeAction_import* events to handle the exported data and to provide the
data to be imported, respectively.

{: .info :}
> Every *SmarkForm* action triggers *BeforeAction_<action_name>* and
> *AfterAction_<action_name>* events respectively before and after the action
> is executed.
>
> Their event handlers receive an *event* object providing at least the
> *action* name, *preventDefault* and *stopPropagation* methods, and
> references to the *origin* (the trigger component that invoked the action)
> and, if applicable, the *context* and *target* components.


Let's say we want to prevent accidentally clearing the form with the `❌ Clear`
button.

However, if it were a larger form, we might not feel so comfortable with the
`❌ Clear` button ("clear" action trigger) clearing everything in case of an
accidental click.

Listening to the *BeforeAction_clear* event we can ask the user for
confirmation and prevent the action if they don't confirm.

**Example:**

{% raw %} <!-- simple_confirm_cancel_example_js {{{ --> {% endraw %}
{% capture simple_confirm_cancel_example_js
%}/* Ask for confirmation unless form is already empty: */
myForm.on("BeforeAction_clear", async ({context, preventDefault}) => {
    if (
        ! confirm("Are you sure?") /* User clicked the "Cancel" btn. */
    ) {
        /* Prevent default (clear form) behaviour: */
        preventDefault();
    };
});{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% raw %} <!-- simple_confirm_cancel_example_hidden_js {{{ --> {% endraw %}
{% capture simple_confirm_cancel_example_hidden_js
%}{{ form_export_example_js }}{{ form_export_example_withImport_js }}{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="enhanced_confirmCancel"
    htmlSource=html_source_enhanced_withImport
    jsHidden=simple_confirm_cancel_example_hidden_js
    jsSource=simple_confirm_cancel_example_js
    selected="js"
    tests=false
%}

{: .hint : }
> If you want to take it a step further, you can also check if the form is
> already empty before asking for confirmation, so that it only asks when there
> is data to clear.


{% raw %} <!-- confirm_cancel_example_with_confirm_js {{{ --> {% endraw %}
{% capture confirm_cancel_example_with_confirm_js
%}
/* Ask for confirmation unless form is already empty: */
myForm.on("BeforeAction_clear", async ({context, preventDefault}) => {
    if (
        ! await context.isEmpty()     /* Form is not empty */
        && ! confirm("Are you sure?") /* User clicked the "Cancel" btn. */
    ) {
        /* Prevent default (clear form) behaviour: */
        preventDefault();
    };
});{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% include components/sampletabs_tpl.md
    formId="enhanced_confirmCancel_non_empty"
    htmlSource=html_source_enhanced_withImport
    jsHidden=simple_confirm_cancel_example_hidden_js
    jsSource=confirm_cancel_example_with_confirm_js
    selected="js"
    tests=false
%}




👉 Notice that now, if you go to the *Preview* tab and click the `❌ Clear`
button before introducing any data nothing seems to happen (since the form is
already empty).

🚀 But, if you fill some data in and then click again, it will effectively ask
before clearing the data.




### Hot Keys


### Animated and sortable lists




## Customize your form

Now you have a SmarkForm-enhanced form. **SmarkForm will automatically handle
form submission, validation, and other interactions** based on the provided
markup and configuration.

👉 You can customize the behavior and appearance of your SmarkForm form by
configuring options and adding event listeners. SmarkForm provides a wide range
of features and capabilities to simplify form development and enhance user
experience.

👉 Start exploring the
[Core Concepts section]({{ "getting_started/core_concepts" | relative_url }})
for a deeper understanding of what is going on and continue with the rest of
this SmarkForm manual for more details and examples to discover all the
possibilities and unleash the power of markup-driven form development.


🔎 Here you have a few examples of a larger forms that demonstrates some
additional capabilities of the library:


**List of telephones:**

{% raw %} <!-- capture html_phone_list {{{ --> {% endraw %}
{% capture html_phone_list
%}<div data-smark='{"name":"phones","type":"list","of":"input","max_items":6,"sortable":true}'>
  <div>
    <button data-smark='{"action":"removeItem","hotkey":"-"}' title='Remove this item'><span role='img' aria-label='Remove this item'>➖</span></button>
    <input data-smark type='tel' placeholder='Telephone'/>
    <button data-smark='{"action":"addItem","hotkey":"+"}' title='Add new item below'><span role='img' aria-label='Add new item'>➕</span></button>
  </div>
</div>
<p>
  <button data-smark='{"action":"clear"}'>❌ Clear</button>
  <button data-smark='{"action":"export"}'>💾 Submit</button>
</p>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture advanced_sample_css {{{ --> {% endraw %}
{% capture advanced_sample_css %}/* Emphasize disabled buttons */
button:disabled {
    opacity: .5;
}

/* Reveal hotkey hints */
button[data-hotkey] {
    position: relative;
    overflow-x: display;
}
button[data-hotkey]::before {
    content: attr(data-hotkey);

    display: inline-block;
    position: absolute;
    top: 2px;
    left: 2px;
    z-index: 10;

    background-color: #ffd;
    outline: 1px solid lightyellow;
    padding: 1px 4px;
    border-radius: 4px;
    font-weight: bold;

    transform: scale(1.4) translate(.1em, .1em);

}{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture phone_list_form_example_notes {{{ --> {% endraw %}
{%capture phone_list_form_example_notes %}👉 Limited to a **maximum of 6** numbers.

👉 Notice trigger butons **get properly disabled** when limits reached.

👉 They are also excluded from keyboard navigation for better navigation with `tab` / `shift`+`tab`.

👉 Even thought they can be triggered from keyboard through configured (`Ctrl`-`+` and `Ctrl-`-`) hot keys.

👉 ...Notice what happen when you hit the `ctrl` key while editing...

👉 Also note that, when you click the `💾 Submit` button **only non empty items get exported**.

👉 ...You can prevent this behaviour by setting the *exportEmpties* property to *true*.

👉 Change items order by just dragging and dropping them.

{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% include components/sampletabs_tpl.md
    formId="telephone_list"
    htmlSource=html_phone_list
    cssSource=advanced_sample_css
    notes=phone_list_form_example_notes
    tests=false
%}



**Simple schedule:**

{% raw %} <!-- capture html_schedule_list {{{ --> {% endraw %}
{% capture html_schedule_list
%}<p>
    <button data-smark='{"action":"removeItem","hotkey":"-","context":"surveillance_schedule"}' title='Less intervals'>
        <span role='img' aria-label='Remove interval'>➖</span>
    </button>
    <button data-smark='{"action":"addItem","hotkey":"+","context":"surveillance_schedule"}' title='More intrevals'>
        <span role='img' aria-label='Add new interval'>➕</span>
    </button>
    <strong data-smark='label'>Schedule:</strong>
    <span data-smark='{"type":"list","name":"surveillance_schedule","min_items":0,"max_items":3,"exportEmpties":true}'>
        <span>
            <input data-smark type='time' name='start'/>
            to
            <input data-smark type='time' name='end'/>
        </span>
        <span data-smark='{"role":"empty_list"}'>(Closed)</span>
    </span>
</p>
<p>
    <button data-smark='{"action":"clear"}'>❌ Clear</button>
    <button data-smark='{"action":"export"}'>💾 Submit</button>
</p>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="schedule_list"
    htmlSource=html_schedule_list
    cssSource="-"
    tests=false
%}


{: .hint :}
> Now that you understand the basics maybe a good opportunity to revisit the
> [Showcase]({{"about/showcase" | relative_url }}) section and examine the
> source code of those examples.
> 
> 🚀 Also don't miss the [Examples]({{ "resources/examples" | relative_url }})
> section for more complete and realistic use cases...



## Final notes


### Boilerplate file

If you prefer to start from scratch, **congratulations!!**

But, be aware that *SmarkForm* is intended to not interfere with your HTML and
CSS.

It adds great functionality but does nothing with the layout and styling of the
page or even its components.

Nevertheless, if you liked the styling of our
[examples]({{ "resources/examples" | relative_url }}) and want to start a new
project, don't miss our *Boilerplate
Template*.

You can pick it from the
[Resources ➡️  Download]({{ "resources/download" | relative_url
}}#boilerplate-template) section of this manual.



### You don't need a form tag

You don't even need a `<form>` tag. In fact it is not (yet) advised to use it
for SmarkForm forms.

If you do so, they will be submit-prevented so they can act as kind of failback
behvaviours in case of JavaScript being disabled.

But it's not yet clear which could be a future enhancenment of native `<form>`
attributes, such as *action*, in successfully enhanced `<form>` tags.


### Using your own copy of SmarkForm library

If you don't want to rely on an external resource like a CDN, take the following steps:

  * Download <a href="{{ smarkform_umd_dld_link }}" download="{{ smarkform_umd_dld_name }}">
    ⤵️ latest SmarkForm version</a>.
  * Place it beside your HTML file.
  * And use following code instead to linki it in your HTML file:

```html
<script src="path/to/SmarkForm.js"></script>
```


### Alternative forms to get/include Smarkform

There is plenty of ways to get SmarkForm. Either as ESM module or highly
compatible UMD format you can download it from this page, install as npm
package, directly link as a CDN...

For more detailed information, check out the section [Getting
SmarkForm](/getting_started/getting_smarkform).


### The option's object

If you want a more compact syntax to provide, at least, most basic
functionality at once, you can use the *options* object.

```javascript
const myForm = new SmarkForm(
    document.getElementById("myForm")
    , {
        onAfterAction_export({data}) {
            // Show exported data:
            console.log(data);
        },
    }
);
```

All *AfterAction_xxx* and *BeforeAction_xxx* events can get their first event
handler attached through functions respectively named *onAfterAction_xxx* and
*onBeforeAction_xxx* in the *options* object passed to the *SmarkForm*
constructor.

{: .hint :}
> The only differrence here is that *AfterAction_xxx* and *BeforeAction_xxx*
> events **can be locally attached to any *SmarkForm* field**.
> 
> Handlers passed through that options are attached to the *root form*.



