---
title: First Steps
layout: chapter
permalink: /getting_started/first_steps
nav_order: 3

---

# {{ page.title }}

<details>
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Creating and Customizing SmarkForm form](#creating-and-customizing-smarkform-form)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>

## Creating and Customizing SmarkForm form

To create a SmarkForm form, you need to follow a few simple steps:

1. Start by writing the form markup in HTML. For example, let's create a basic
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


2. Next, include the SmarkForm library in your project. You can do this by
   adding the script tag to your HTML file or by importing it using a module
   bundler like Webpack or Parcel.

```html
<script src="path/to/SmarkForm.js"></script>
```

{: .hint}
> 📌 Alternatively you can directly import it as ES module in your JavaScript
> file:
> 
> ```javascript
> import SmarkForm from 'https://cdn.jsdelivr.net/npm/smarkform/dist/SmarkForm.esm.js';
> ```
> 
> See [Installation Instructions](../README.md#installation) for more details.


3. Initialize SmarkForm on your form element. In your JavaScript file, create a
   new instance of the SmarkForm class and pass the form element as the
   parameter:

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





