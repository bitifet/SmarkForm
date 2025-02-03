---
title: Showcase
layout: chapter
permalink: /about/showcase
nav_order: 2

---


# {{ page.title }}


This section provides a series of working examples to demonstrate the
capabilities of SmarkForm.

👉 Each example is designed to highlight different features and functionalities.

👉 All examples are mostly unstyled to emphasize the fact that SmarkForm is
layout-agnostic.

👉 If there is any CSS, it is only in order to make more evident some features
and you could check the applied styles in the *CSS* tab of each example.


{: .info :}
> The goal of this section is to showcase what SmarkForm can do rather than
> explaining the underlying code. Anyway, you can take a look at the HTML, CSS,
> and JavaScript tabs of every example to glimpse the simplicity of the
> implementation.
> 
> For detailed explanations and code walkthroughs, please refer to the other
> sections of this manual.


<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Basic Form](#basic-form)
* [Nested forms](#nested-forms)
* [Lists](#lists)
* [Nested lists and forms](#nested-lists-and-forms)
* [Context-Driven Keyboard Shortcuts](#context-driven-keyboard-shortcuts)
* [Dynamic Dropdown Options](#dynamic-dropdown-options)
* [Import and Export Data](#import-and-export-data)
* [Advanced UX Improvements](#advanced-ux-improvements)
* [Conclusion](#conclusion)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>

## Basic Form

In this first example, we'll start with a simple form that includes a few input
fields (right side) and a textarea .

  * Use the `➡️ ` buttorn to export the form as JSON into the textarea at the right.
  * Edit the resulting JSON in the textarea as you like.
  * Use the `⬅️ ` buttorn to import that JSON to the form again.
  * You can clear both using the `❌` button.
  * Notice that most SmarkForm fields can be null, meaning the data is unknown
    or indifferent.

{% include_relative examples/showcase.examples.md option="basic_form" %}



## Nested forms

The former example example is entirely built with SmarkForm itself.

If you look at its *JS* tab you'll see that there is no JavaScript code except
for the SmarkForm instantiation itself.

👉 The trick here is that you did not import/export the whole form but just a
subform.

  * The whole *SmarkForm* form is a field of the type "form" that
    imports/exports JSON and **they can be nested up to any depth**.

  * The `➡️ `, `⬅️ ` and `❌` buttons are *trigger* components that perform
    specialized actions (look at the *HTML* tab to see how...).

  * Below these lines you can see **the exact same form** with additional `💾`
    and `📂` buttons and a little additional JavaScript code to mock the "save"
    and "load" operations through window's `alert()` and `prompt()`,
    reespectively.


{% include_relative examples/showcase.examples.md option="basic_form_with_import_export" %}

👉 Here you can:

  * Repeat all the same trials as in the former example (with identical results).
  * Use the `💾` button to export the whole form to a `window.alert(...)` dialog.
  * Use the `📂` button to import new JSON data to the whole form.
    - You can use the previously exported JSON as a base for custom edits.

👉 Context of the triggers:

  * The `💾` and `📂` buttons operate on the whole form because it is their
    *natural* context.

  * In the case of the `➡️ `, `⬅️ ` and `❌` buttons, they have their context
    explicitly set by the option of the same name.

  * We could have wanted to make the `💾` and `📂` buttons to operate only on the *demo* subform.
    - We could have done that by setting their *context* property to "demo".
    - But, also, we could just have placed them inside of that context **in the
      markup** (see next example).

{% include_relative examples/showcase.examples.md option="basic_form_with_local_import_export" %}


## Lists

One of the most powerful features of SmarkForm is its ability to handle variable-length lists.

Let's say you need to collect phone numbers or emails from users. Instead of
having (and dealing with it) a fixed number of input fields, you can use a list
that can grow or shrink as needed:


{% include_relative examples/showcase.examples.md option="simple_list" %}


Here we used a simpple `<input>` field for each item in the list and had to
trick them with `style="display: block;"` to make them to stack gracefully.

We could have used a *form* field instead, but in this case we would had get a
JSON object for each item in the list, which is not what we want here.

To address this issue, we can take advantage of the *singleton pattern* to make
any HTML element to become a regular *input* field.


{: .info :}
> We call the *singleton pattern* when we use any HTML element different from
> `<input>`, `<select>`, `<textarea>`, etc., as a regular input field.
>
> For this to work we only need to place one (and only one) of these elements
> with the "data-smark" attribute in its contents.
...

This way we can not only use a more elaborated structure for each item in the
list: it also allows us to include other controls within every list item.

{% include_relative examples/showcase.examples.md option="simple_list_singleton" %}

👉 And lists are even more powerful than that. For instance, in the former
example we:

  * Established a maximum of 5 items in the list.

  * Allowed the list to be empty (default minimum items is 1).

  * Defined an alternate template for the case of empty list.

  * Made the `➖` button a little smarter so that it removes empty items, if
    any, first.

  * Added a `🧹` button to remove all empty items.

  * Added a `❌` button to each item to cherry-pick which items to remove.

  * Returned to the default behaviour of not exporting empty items.

  * Made it sortable (by dragging and dropping items).


Another interesting use case for lists is to create a schedule list like the
following example:

{% include_relative examples/showcase.examples.md option="schedule_list" %}





## Nested lists and forms


**(To be continued...)**



{% include_relative examples/showcase.examples.md option="nested_lists" %}



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





%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%







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


