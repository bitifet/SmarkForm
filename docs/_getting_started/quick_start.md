---
title: Quick Start
layout: chapter
permalink: /getting_started/quick_start
nav_order: 1

---

{% include links.md %}

# {{ page.title }}

<details>
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Create an HTML document](#create-an-html-document)
* [Create an HTML form](#create-an-html-form)
* [Include SmarkForm Library](#include-smarkform-library)
* [Initialize the Form](#initialize-the-form)
* [Customize your form](#customize-your-form)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


{: .hint}
> This section is meant to be educational. If you are eager to get your hands
> dirty, go straight to the [Examples]({{ "resources/examples" | relative_url }})
> section, download the one you like the
> most, and start editing to see what happens.


To create a SmarkForm form, you need to follow a few simple steps:

## Create an HTML document

For a fast setup, you can simply pick our *boilerplate template* from the
[Download Section]({{ "resources/download" | relative_url }}#boilerplate-template).


## Create an HTML form

Start by writing the form markup in HTML. For example, let's create a basic
login form:

```html
<div id="myForm">
  <div>
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" data-smark="data-smark">
  </div>
  <div>
    <label for="password">Password:</label>
    <input type="password" id="password" name="password" data-smark="data-smark">
  </div>
  <p>
    <button data-smark='{"action":"empty"}'>❌ Clear</button>
    <button data-smark='{"action":"export"}'>💾 Submit</button>
  </p>
</div>
```

{: .warning}
> 📌 It is not (yet) advised to use the `<form>` tag for SmarkForm forms.
> 
> If you do so, they will be submit-prevented so they can act as kind of failback
> behvaviours in case of JavaScript being disabled.
> 
> But it's not yet clear which could be a future enhancenment of native `<form>`
> attributes, such as *action*, in successfully enhanced `<form>` tags.


## Include SmarkForm Library

Next, include the SmarkForm library in your project. You can do this by adding
the script tag to your HTML file or by importing it using a module bundler like
Webpack or Parcel.

```html
<script src="path/to/SmarkForm.js"></script>
```

{: .hint}
> 📌 Alternatively you can directly import it as ES module in your JavaScript
> file:
> 
> ```javascript
> import SmarkForm from '{{ smarkform_esm_cdn_latest }}';
> ```
> 
> See [Installation Instructions](../README.md#installation) for more details
> about all available options to include *SmarkForm* in your project.


## Initialize the Form

Initialize SmarkForm on your form element. In your JavaScript file, create a
new instance of the SmarkForm class and pass the form element as the parameter:

```javascript
const form = new SmarkForm(document.querySelector("#myForm"));
```

You may also want to do something with data:

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

Or even gently ask users for confirmation before they loose all their work:

```javascript
const form = new SmarkForm(
    document.querySelector("#myForm")
    , {
        onAfterAction_export({data}) {
            // Show exported data:
            alert (JSON.stringify(data));
        },
        async onBeforeAction_empty({context, preventDefault}) {
            // Ask for confirmation unless form is already empty:
            if (
                ! await context.isEmpty()
                && ! confirm("Are you sure?")
            ) preventDefault();
        },
    }
);
```


That's it! You now have a SmarkForm-enhanced form. SmarkForm will automatically
handle form submission, validation, and other interactions based on the
provided markup and configuration.

You can customize the behavior and appearance of your SmarkForm form by
configuring options and adding event listeners. SmarkForm provides a wide range
of features and capabilities to simplify form development and enhance user
experience.

Start exploring the SmarkForm documentation and examples to discover all the
possibilities and unleash the power of markup-driven form development.



## Customize your form

Now you are ready to add advanced features to your form, such as nested forms
and variable-length arrays.


Check out [First Steps Section]({{ "getting_started/first_steps" | relative_url }})
for examples.

{: .hint}
> It's also advisable to take a look on
> [Core Concepts Section]({{ "getting_started/core_concepts" | relative_url }})
> for a deeper understanding of what is going on...

