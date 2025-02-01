---
title: Quick Start
layout: chapter
permalink: /getting_started/quick_start
nav_order: 1

---

{% include links.md %}

# {{ page.title }}

A SmarkForm form can be created by following a few simple steps:

{: .hint}
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

* [Quick Start](#quick-start)
    * [Create an HTML document](#create-an-html-document)
    * [Include SmarkForm Library](#include-smarkform-library)
    * [Create a simple HTML form](#create-a-simple-html-form)
    * [Initialize the Form](#initialize-the-form)
    * [Do the magic](#do-the-magic)
* [Go further...](#go-further)
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


## Quick Start

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
> SmarkForm](#you-dont-need-a-form-tag) if you don't want to rely on external
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


{% include_relative examples/simple_form.examples.md option="legacy" %}


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

{% include_relative examples/simple_form.examples.md option="initialized" %}


Ok: Nothing exciting happended by now...


### Do the magic

By default, *SmarkForm* ignores all DOM elements in its container unless they
are marked with the [data-smark
]({{ "getting_started/core_concepts" | relative_url }}#the-data-smark-attribute)
attribute.

{: .info }
> This is because you can have html fields or buttons that belong to other
> components or functionalities of the page and you don't want them to be taken
> as part of the form.

Let's mark all fields, buttons and labels... with it:

{% include_relative examples/simple_form.examples.md option="minimal" %}


Now, if you go to the *Preview* tab and fill some data in, you can then hit de
`❌ Clear` button and see that, **it already works!!** 🎉

Also notice that the *for* attribute of all `<label>`s had been removed and they
still work (if you click on them, corresponging fields get focus anyway).


{: .info}
> All elements with a 
> [data-smark](/getting_started/core_concepts#the-data-smark-attribute)
> attribute are *SmarkForm*
> [components](/getting_started/core_concepts#components) of a certain type.

*SmarkForm* components' type [is often
implicit](/getting_started/core_concepts#syntax), either by their tag name (like the `<label>` elements), their *type* attribute in case of `<input>`s or by the presence of the *action* property that tell us they are action
[triggers](getting_started/core_component_types#type-trigger).



👉 The `💾 Submit` button is working too. It's just we configured it to trigger
the *export* action but **we haven't told it what to do** with that data.

To do so, we only need to listen the proper event:


{% include_relative examples/simple_form.examples.md option="withExport" %}


Now go to the *Preview* tab, fill some data in and try clicking the `💾 Submit`
button.


{: .info :}
> Alternatively, most event handlers can be provided at once through the
> [options object](#the-options-object).

Everything works now. 🎉


## Go further...

However, if it were a larger form, we might not feel so comfortable with the
`❌ Clear` button ("clear" action trigger) clearing everything in case of an
accidental click.

Luckily, we can listen to the *BeforeAction_clear* event and gently ask users for confirmation before they lose all their work.

Let's see a simple example using a *window.confirm()* dialog:

{% include_relative examples/simple_form.examples.md option="withConfirmCancel" %}


{: .hint}
> Notice that, if you go to the *Preview* tab and click the `❌ Clear` button
> nothing seems to happen (since the form is already empty so there is no need
> to bother the user asking for confirmation) while, if you fill some data in
> and then click again, it will effectively ask before clearing the data.

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

{% include_relative examples/lists.examples.md option="phones" %}


**Simple schedule:**

{% include_relative examples/lists.examples.md option="schedule" %}


{: .hint :}
> Don't miss the [Examples]({{ "resources/examples" | relative_url }}) section
> for more...


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
> events **can be attached to any *SmarkForm* field**.
> 
> Handlers passed through that options are attached to the *root form*.



