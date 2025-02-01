---
title: Showcase
layout: chapter
permalink: /about/showcase
nav_order: 3

---


# {{ page.title }}


This section provides a series of working examples to demonstrate the
capabilities of SmarkForm. Each example is designed to highlight different
features and functionalities, showing how SmarkForm can be used to create
powerful and interactive forms with minimal effort.

The goal is to showcase what SmarkForm can do rather than explaining the
underlying code. Anyway, you can take a look at the HTML, CSS, and JavaScript
tabs to glimpse the simplicity of the implementation.

For detailed explanations and code walkthroughs, please refer to the other
sections of this manual.


## Basic Form

In this first example, we'll start with a simple form that includes a few input
fields.

  * Use the `➡️ ` buttorn to export the form as JSON into the textarea at the right.
  * Edit the resulting JSON in the textarea as you like.
  * Use the `⬅️ ` buttorn to import that JSON to the form again.
  * You can clear both using the `❌` button.
  * Notice that most SmarkForm fields can be null, meaning the data is unknown
    or indifferent.

{% include_relative examples/showcase.examples.md option="basic_form" %}



{: .hint :}
> **This example is entirely built with SmarkForm itself.**
> 
> If you look at the *JS* tab you'll find there is no JavaScript code except
> for the SmarkForm instantiation itself.
> 
> The trick here is that you did not import/export the whole form but just a
> subform.
> 
> 👉 The whole *SmarkForm* form is a field of the type "form" that
> imports/exports JSON.
> 
> 👉 They can be nested up to any depth.
> 
> 👉 The `➡️ `, `⬅️ ` and `❌` buttons are *trigger* components that perform
> specialized actions (look at the *HTML* tab to see how...).


Below these lines you can see **the exact same form** with the additional `💾`
and `📂` buttons and a little additional JavaScript code to mock the "save" and
"load" operations through window's `alert()` and `prompt()`, reespectively.

There you can:

  * Repeat all the same trials as in the previous example (with identical results).
  * Use the `💾` button to export the whole form to a `window.alert(...)` dialog.
  * Use the `📂` button to import new JSON data to the whole form.
    - You can use the previously exported JSON as a base for custom edits.

{% include_relative examples/showcase.examples.md option="basic_form_with_import_export" %}




**(To be continued...)**






-----------------


  (🚧 Working examples, without technical explanation, just to show implemented capabilities)


👉 This document is still in draft stage.

The following random text snippets are just reminders of what should be included in this document:






It imports and exports data in JSON format

nested forms


variable-length lists


properly sanitizes and formats values according to its field type



implements declarative restrictions like wether null is allowed or not


maximum and minimum length for lists



smooth and intuitive user experience


such as forcing `type="color"` fields to always hold a valid color value



context-driven keyboard shortcuts


smart auto-enablement/disablement of controls





==================
==================
==================







## Nested Forms

Next, we'll explore how SmarkForm handles nested forms. This feature allows you to create forms within forms, which is useful for managing complex data structures. 

<!-- Example 2: Nested Forms -->

## Variable-Length Lists

One of the powerful features of SmarkForm is its ability to handle variable-length lists. In this example, we'll show how users can add and remove items from a list dynamically.

<!-- Example 3: Variable-Length Lists -->

## Context-Driven Keyboard Shortcuts

SmarkForm supports context-driven keyboard shortcuts, enhancing the user experience by allowing quick navigation and actions. This example will demonstrate how to configure and use these shortcuts in your forms.

<!-- Example 4: Context-Driven Keyboard Shortcuts -->

## Dynamic Dropdown Options

In this example, we'll illustrate how to create dropdown menus with dynamic options. This is particularly useful for forms that need to load options based on user input or external data sources.

<!-- Example 5: Dynamic Dropdown Options -->

## Import and Export Data

SmarkForm makes it easy to import and export form data in JSON format. This example will show how to load data into a form and export it, ensuring proper data handling and integration with other systems.

<!-- Example 6: Import and Export Data -->

## Advanced UX Improvements

Finally, we'll showcase some advanced user experience improvements that SmarkForm offers, such as smart auto-enablement/disablement of controls and non-breaking unobtrusive keyboard navigation.

<!-- Example 7: Advanced UX Improvements -->

## Conclusion

We hope these examples have given you a good overview of what SmarkForm can do. By leveraging the power of markup-driven forms, SmarkForm simplifies the creation of interactive and intuitive forms, allowing you to focus on your application's business logic. Feel free to experiment with these examples and adapt them to suit your specific needs.

For more detailed information and documentation, please refer to the other sections of this manual. If you have any questions or need further assistance, don't hesitate to reach out to the SmarkForm community.

Happy form building!


