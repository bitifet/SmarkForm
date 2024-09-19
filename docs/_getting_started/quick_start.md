---
title: Quick Start
layout: chapter
permalink: /getting_started/quick_start
nav_order: 1

---

{% include links.md %}

# {{ page.title }}

A SmarkForm form can be created by following a few simple steps:

{: .info}
> This section is meant to be educational. If you are eager to get your hands
> dirty, 🏁 go straight to the
> [Examples]({{ "resources/examples" | relative_url }}) section, download the
> one you like the most, and start editing to see what happens.

<br />
<details>
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [1. Create an HTML document](#1-create-an-html-document)
* [2. Create an HTML form](#2-create-an-html-form)
* [3. Include SmarkForm Library](#3-include-smarkform-library)
* [4. Initialize the Form](#4-initialize-the-form)
* [5. Do the magic](#5-do-the-magic)
* [6. Customize your form](#6-customize-your-form)
* [Final notes](#final-notes)
    * [Boilerplate file](#boilerplate-file)
    * [You don't need a form tag](#you-dont-need-a-form-tag)
    * [Using your own copy of SmarkForm library](#using-your-own-copy-of-smarkform-library)
    * [Alternative forms to get/include Smarkform](#alternative-forms-to-getinclude-smarkform)
    * [The option's object](#the-options-object)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>

## 1. Create an HTML document


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


## 2. Create an HTML form

Start by writing the form markup in HTML. For example, let's create a basic
login form like this:

```html
<div id="myForm">
  <div>
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" data-smark>
  </div>
  <div>
    <label for="password">Password:</label>
    <input type="password" id="password" name="password" data-smark>
  </div>
  <p>
    <button data-smark='{"action":"empty"}'>❌ Clear</button>
    <button data-smark='{"action":"export"}'>💾 Submit</button>
  </p>
</div>
```

You may notice that there is no `<form>` tag. Just a regular `<div>`, in this
example with an Id that we will use to capture the node to enhance it as a
*SmarkForm* instance.

{: .info}
> You can use a `<form>` tag instead if you like, but it is [absolutely
> unnecessary](#you-dont-need-a-form-tag).

Also pay attention to the elements with a 
[data-smark](/geting_started/core_concepts#the-data-smark-attribute)
attribute: They are *SmarkForm*
[components](/getting_started/core_concepts#components) of a given type.

{: .hint}
> *SmarkForm* components type [is often
> implicit](/getting_started/core_concepts#syntax), either by their tag name
> or by the presence of the *action* property that tell us they are action
> triggers.


## 3. Include SmarkForm Library

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


## 4. Initialize the Form

Initialize SmarkForm on your form element. In your JavaScript file, create a
new instance of the SmarkForm class and pass the form element as the parameter:

```javascript
const myForm = new SmarkForm(
    document.querySelector("#myForm")
);
```

{: .hint }
> Notice that, if you fill data in your form and then hit de `❌ Clear` button,
> **it already works!!** 🎉


## 5. Do the magic

The `💾 Submit` button is working too. It's just we configured it to trigger
the *export* action but **we haven't told it what to do** with that data.

To do so, we only need to listen the proper event, and **that's it!**:

```javascript
myForm.on("afterAction_export", ({data}) => {
    // Show exported data:
    console.log(data);
});
```

{: .info :}
> Alternatively, most even handlers can be provided at onece through the
> [options object](#the-options-object).


**Going deeper...**

Following example adds a
*beforeAction_empty* event listener to gently ask users for confirmation before
they loose all their work in case of an accidental click to the *Clear*
("empty" action trigger) button:

```javascript
// Ask for confirmation unless form is already empty:
myForm.on("beforeAction_empty", ({context, preventDefault}) => {
    if (
        ! await context.isEmpty()     // Form is not empty
        && ! confirm("Are you sure?") // User click on "Cancel" btn.
    ) {
        // Prevent default (empty form) behaviour:
        preventDefault();
    };
});
```


**That's it!!!**  🎉

Now you have a SmarkForm-enhanced form. **SmarkForm will automatically handle
form submission, validation, and other interactions** based on the provided
markup and configuration.

{: .hint}
You can customize the behavior and appearance of your SmarkForm form by
configuring options and adding event listeners. SmarkForm provides a wide range
of features and capabilities to simplify form development and enhance user
experience.

Start exploring the SmarkForm documentation and examples to discover all the
possibilities and unleash the power of markup-driven form development.



## 6. Customize your form

Now you are ready to add advanced features to your form, such as nested forms
and variable-length arrays.

{: .hint}
> Check out the
> [Core Concepts section]({{ "getting_started/core_concepts" | relative_url }})
> for a deeper understanding of what is going on...


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

All *afterAction_xxx* and *beforeAction_xxx* events can get their first event
handler attached through functions respectively named *onAfterAction_xxx* and
*onBeforeAction_xxx* in the *options* object passed to the *SmarkForm*
constructor.

{: .hint :}
> The only differrence here is that *afterAction_xxx* and *beforeAction_xxx*
> events **can be attached to any *SmarkForm* field**.
> 
> Handlers passed through that options are attached to the *root form*.



