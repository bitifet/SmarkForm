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

👉 If there is any further CSS, it is only in order to make more evident some
features and you could check the applied styles in the *CSS* tab of each
example.


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
* [A note on context of the triggers](#a-note-on-context-of-the-triggers)
* [Lists](#lists)
* [Nested lists and forms](#nested-lists-and-forms)
* [Context-Driven Keyboard Shortcuts](#context-driven-keyboard-shortcuts)
* [Dynamic Dropdown Options](#dynamic-dropdown-options)
* [Import and Export Data](#import-and-export-data)
* [Smart value coercion](#smart-value-coercion)
* [Advanced UX Improvements](#advanced-ux-improvements)
* [Conclusion](#conclusion)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>

## Basic Form

In this first example, we'll start with a simple form that includes a few input
fields (right side) and a textarea .

{% include_relative examples/showcase.examples.md option="basic_form" %}

{: .hint :}
> 👉 In this example you can:
>   * Use the `➡️ ` buttorn to export the form as JSON into the textarea at the right.
>   * Clear the form using the `❌` button.
>   * Use the `⬅️ ` buttorn to import that JSON back to the form again.
>   * Edit the JSON in the textarea as you like and click `⬅️ ` again to
>     translate the changes to the form.
>   * Try to import an invalid values for given field to see how the form
>     handles it.
>   * Notice that most SmarkForm fields can be null, meaning the data is unknown
>     or indifferent.
>   * Even color pickers can be null even [native HTML color inputs
>     can't](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/color#value).
>   * To reset a color picker after a color being set, we a button to call it's
>     "clear" *action*.
>   * This kind of *SmarkForm* components intended to call *actions* on
>     *SmarkForm* fields are called *triggers*.
>   * There are several other *actions* that can be called on *SmarkForm* fields.
>     Some, such as *import* and *export* are common to all field types and
>     others are specific to some of them. For instance *addItem* and *removeItem*
>     are specific to lists.


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

{: .hint :}
> 👉 Here you can:
> 
>   * Repeat all the same trials as in the former example (with identical results).
>   * Use the `💾` button to export the whole form to a `window.alert(...)` dialog.
>   * Use the `📂` button to import new JSON data to the whole form.
>     - You can use the previously exported JSON as a base for custom edits.

👉 Despite of usability concerns, there is no limit in form nesting depth. For
instance, the follwoing example shows a form with several levels of nesting:


{: .hint :}
{% include_relative examples/showcase.examples.md option="nested_forms" %}


{: .hint :}
> 🚀 See the [Nested lists and forms](#nested-lists-and-forms) section if you
> want to see more elaborated examples of nested forms.




## A note on context of the triggers

In the previous example, the `💾` and `📂` buttons operate on the whole form
because it is their *natural* context.

In the case of the `➡️ `, `⬅️ ` and `❌` buttons, they have their context
explicitly set by the option of the same name.

We could have wanted to make the `💾` and `📂` buttons to operate only on the
*demo* subform.

We could have done that by setting their *context* property to "demo".

But, also, we could just have placed them inside of that context **in the
markup** as is showin in the following example:

{% include_relative examples/showcase.examples.md option="basic_form_with_local_import_export" %}

👉 Now the `💾 Save` and `📂 Load` buttons work on the "/demo" path (that is:
they only import/export the "demo" subform) just like `➡️` and `⬅️` ones do but
without explicitly specifying their context.

{: .hint :}
> If you look at the *JS* tab of the last two exemples, you'll see that there
> is a little difference between them.
> 
> In the first one, the "BeforeAction_import" and "AfterAction_export" event
> handlers inhibits themselves depending on whether the context is the root
> form or not while, in the later, it just focus on the fact that the *target*
> is not provided.
> 
> The second is a more generic approach for this kind of event handlers. But
> the first one serves as an alternative example showing how we can base those
> event handlers' behaviour on the specific context (path) of every trigger.


If you want a clearer example on how the context affect the triggers, take a
look to the following example:

{% include_relative examples/showcase.examples.md option="context_comparsion" %}

{: .info :}
From now on, having we already demonstrated how to work with *import* and
*export* actions' eveents, for the sake of simplicity we'll stick to the layout
of the very first example (`➡️ `, `⬅️` targetting the "editor" textarea and `❌`
buttons) that doesn't need any additionally JS code.


## Lists

One of the most powerful features of SmarkForm is its ability to handle variable-length lists.

Let's say you need to collect phone numbers or emails from users. Instead of
having (and dealing with it) a fixed number of input fields, you can use a list
that can grow or shrink as needed:


{% include_relative examples/showcase.examples.md option="simple_list" %}


Here we used a simpple `<input>` field for each item in the list and had to
trick them with `style="display: block;"` to make them to stack gracefully.

But **lists are even more powerful** than that:

For instance, we could have used a *form* field instead, but in this case we
would had get a JSON object for each item in the list, which is not what we
want in this specific case.

👉 To address this issue, we can take advantage of the *singleton pattern* to make
any HTML element to become a regular *input* field.


{: .info :}
> We call the *singleton pattern* when we use any HTML element different from
> `<input>`, `<select>`, `<textarea>`, etc., as a regular input field.
>
> For this to work we only need to place one (and only one) of these elements
> with the "data-smark" attribute in its contents.
...

This way we can not only use a more elaborated structure for each item in the
list: It also allows us to include other controls within every list item, like
in the following example:

{% include_relative examples/showcase.examples.md option="simple_list_singleton" %}

👉 In this example we:

  * Established a maximum of 5 items in the list.

  * Allowed the list to be empty (default minimum items is 1).

  * Defined an alternate template for the case of empty list.

  * Made the `➖` button a little smarter so that it removes empty items, if
    any, first.

  * Added a `🧹` button to remove all empty items.

  * Added a `❌` button to each item to cherry-pick which items to remove.

  * Returned to the default behaviour of not exporting empty items.

  * Made it sortable (by dragging and dropping items).


👉 And there is a lot more... To begin with, another interesting use case for
lists is to create a schedule list like the following example:

{% include_relative examples/showcase.examples.md option="schedule_list" %}



👉 Or we could have wanted a more formal (or better aligned, in case of multiple schedules) layout such as a table:

{% include_relative examples/showcase.examples.md option="schedule_table" %}



## Nested lists and forms

{: .warning :}
> Section still under construction...


Since we can make lists of forms, we can also nest more forms and lists inside
every list item and so forth to any depth.


{% include_relative examples/showcase.examples.md option="nested_lists" %}

There is no theoretical limit to the depth of nesting beyond the logical
usability concerns.

Here is a more complex example with a deeply nested form:

{: .hint :}
{% include_relative examples/showcase.examples.md option="deeply_nested_form" %}


{: .hint :}
> These are just simple examples to show the concept. You can see more
> elaborated examples in the [Examples]({{ "resources/examples" | relative_url }})
> section of this documentation.







## Context-Driven Keyboard Shortcuts

{: .warning :}
> Section still under construction...

SmarkForm supports context-driven keyboard shortcuts, enhancing the user experience by allowing quick navigation and actions. This example will demonstrate how to configure and use these shortcuts in your forms.

{% include_relative examples/showcase.examples.md option="keyboard_shortcuts" %}


## Dynamic Dropdown Options

{: .warning :}
> Section still under construction...

In this example, we'll illustrate how to create dropdown menus with dynamic options. This is particularly useful for forms that need to load options based on user input or external data sources.

{% include_relative examples/showcase.examples.md option="dynamic_dropdown" %}

## Import and Export Data

{: .warning :}
> Section still under construction...

SmarkForm makes it easy to import and export form data in JSON format. This example will show how to load data into a form and export it, ensuring proper data handling and integration with other systems.

{% include_relative examples/showcase.examples.md option="import_export" %}



## Smart value coercion

{: .warning :}
> Section still under construction...


{% include_relative examples/showcase.examples.md option="smart_value_coercion" %}

## Advanced UX Improvements

{: .warning :}
> Section still under construction...

Finally, we'll showcase some advanced user experience improvements that SmarkForm offers, such as smart auto-enablement/disablement of controls and non-breaking unobtrusive keyboard navigation.

{% include_relative examples/showcase.examples.md option="advanced_ux" %}


## Conclusion

{: .warning :}
> Section still under construction...

We hope these examples have given you a good overview of what SmarkForm can do. By leveraging the power of markup-driven forms, SmarkForm simplifies the creation of interactive and intuitive forms, allowing you to focus on your application's business logic. Feel free to experiment with these examples and adapt them to suit your specific needs.

For more detailed information and documentation, please refer to the other sections of this manual. If you have any questions or need further assistance, don't hesitate to reach out to the SmarkForm community.

Happy form building!


