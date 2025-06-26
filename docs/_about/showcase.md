---
title: Showcase
layout: chapter
permalink: /about/showcase
nav_order: 2

---


# {{ page.title }}


This section provides a series of working examples to demonstrate the
capabilities of SmarkForm.

{: .info :}
> This section showcases SmarkForm’s capabilities without diving into code
> details.
> 
> - Highlights key features through examples.
> - Short and readable code that prioritizes clarity over UX/semantics.
> - Minimal or no CSS (if any you'll find it at the CSS tab) to show layout
>   independence. (See 🔗 <a href='{{ "resources/examples" | relative_url }}'>Examples</a> section for more elaborated examples).
>   <li data-bullet="🚀 ">See 🔗 <a href='{{ "getting_started/quick_start" | relative_url }}'>Quick Start</a> and the rest of sections for detailed explanations.</li>


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
* [Import and Export Data](#import-and-export-data)
    * [Intercepting the *import* and *export* events](#intercepting-the-import-and-export-events)
    * [Submitting the form](#submitting-the-form)
* [A note on context of the triggers](#a-note-on-context-of-the-triggers)
    * [✋ Don't panic!!](#-dont-panic)
* [Context-Driven Keyboard Shortcuts](#context-driven-keyboard-shortcuts)
* [Dynamic Dropdown Options](#dynamic-dropdown-options)
* [Smart value coercion](#smart-value-coercion)
* [Advanced UX Improvements](#advanced-ux-improvements)
    * [Auto enabling or disabling of actions](#auto-enabling-or-disabling-of-actions)
    * [Hot Keys](#hot-keys)
    * [Animations](#animations)
* [Conclusion](#conclusion)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>

## Basic Form

To begin with the basics, we'll start with a simple form that includes a few
input fields and a textarea (at the bottom) which will allow you to:

  * <li data-bullet="⌨️">Type some data in the form.</li>
    <li data-bullet="⬇️">Export it to the textarea in JSON format.</li>
    <li data-bullet="❌">Clear the form whenever you want.</li>
    <li data-bullet="📝">Edit the JSON as you like.</li>
    <li data-bullet="⬆️"> Import the JSON back to the form.</li>
    <li data-bullet="👀">See the effects of your changes.</li>


{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes %}
👉 Notice that **most SmarkForm fields can be null**, meaning the data is
unknown or indifferent.

  * In the case of radio buttons, if no option is selected, they evaluate to
    null. Even after a value is set, they allow unselectiong the selected option
    either by clicking on it again or by pressing the `Delete` key.
  * Even color pickers can be null even [native HTML color inputs
    can't](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/color#value).
  * To reset a color picker after a color being set, you can use the `❌`
    button to call it's "clear" *action*.

👉 **This kind of *SmarkForm* components** intended to call *actions* on
*SmarkForm* fields **are called *triggers*.**

  * There are several other *actions* that can be called on *SmarkForm* fields.
    Some, such as *import* and *export* are common to all field types and
    others are specific to some of them. For instance *addItem* and *removeItem*
    are specific to lists.

👉 Also notice the `{"encoding":"json"}` bit in the `<select>` dropdown.

  * This allow it to return a Null value when the first option is selected.
  * It also foreces to wrap other values in double quotes to make them valid
    JSON strings.
  * ...unless the *value* property is omitted, in which case inner text is
    used "as is".

{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% include_relative
    examples/showcase.examples.md
    option="basic_form"
    notes=notes
%}

👉 Notice everything works **with no JS code** other than SmarkForm instantiation itself.

{: .info :}
> Every example in this section comes with many of the following tabs:
> 
>   * <li data-bullet="🗒️"><b>HTML:</b> HTML source code of the example.</li>
>   * <li data-bullet="🎨"><b>CSS:</b> CSS applied (if any)</li>
>   * <li data-bullet="⚙️ "><b>JS:</b> JavaScript source code of the example.</li>
>   * <li data-bullet="👁️"><b>Preview:</b> (Default) This is where you can see the code in action.</li>
>   * <li data-bullet="📝"><b>Notes:</b> Additional notes and insights for better understanding. <b style="color:red">Don't miss it‼️</b></li>



## Nested forms

Let's add a few more fields to the form to provide information regarding
included safety equipment. This time we'll group them in a nested subform under
the name "safety".


{% include_relative
    examples/showcase.examples.md
    option="nested_forms"
%}



👉 Despite of usability concerns, there is no limit in form nesting depth. For
instance, all the examples in this chapter are entirely built with SmarkForm
itself.

  * If you look closer to the HTML source, you will see that `⬆️ Import` and
    `⬇️ Export` buttons buttons only imports/exports a subform called *demo*
     from/to a *textarea* field called *editor*.

  * ...And if you look at its *JS* tab you'll see that **there is no JavaScript
    code except for the SmarkForm instantiation** itself.

{: .info :}
> 👉 The trick here is that you did not import/export the whole form but just a
> subform.
>
>   * In fact, 🚀  **the whole *SmarkForm* form is a field of the type *form***
>     that imports/exports JSON and 🚀  **they can be nested up to any depth**.
>
>   * The `⬇️ Export`, `⬆️ Import` and `❌ Clear` buttons are *trigger* components that perform
>     specialized actions (look at the *HTML* tab to see how...). 🚀 **No
>     JavaScript wiring is needed**.



{: .hint :}
> In the [Import and Export Data](#import-and-export-data) section we'll go
> deeper into the *import* and *export* actions and how to get the most of
> them.


## Lists

One of the most powerful features of SmarkForm is its ability to handle variable-length lists.

Let's say you need to collect phone numbers or emails from users. Instead of
having (and dealing with it) a fixed number of input fields, you can use a list
that can grow or shrink as needed:


{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes %}
  * By default, empty items in lists are not expoted to keep data clean.
  * But for this very first example, we added the `{exportEmpties: true}`
    option so that you can see every added item no matter if you typed anything
    or not.
{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% include_relative
    examples/showcase.examples.md
    option="simple_list"
    notes=notes
%}


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
> For this to work we only need to place one **and only one** of these elements
> (with the "data-smark" attribute since otherwise they are ignored) in its
> contents.

This way we can not only use a more elaborated structure for each item in the
list: It also allows us to include other controls within every list item, like
in the following example:


{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes %}
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
{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% include_relative
    examples/showcase.examples.md
    option="simple_list_singleton"
    notes=notes
%}

{: .hint :}
> Again, don't miss to check the `📝 Notes` tab for more powerful insights and
> tips.

👉 And there is a lot more...

To begin with, another interesting use case for lists is to create a schedule
list like the following example:


{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes %}
👉 Here we opted for a different layout.
  * Usually lists are layed out with single HTML node inside which plays the
    role of a template for every item in the list.
  * But lists also support other templates with different roles.
  * For this example we introduced the *empty_list*, *separator* and *last_separator* roles.
    <li data-bullet="🚀">The <em>empty_list</em> role allows us to give some feedback when the list is empty.</li>
    <li data-bullet="🚀">The <em>separator</em> role allows us to separate items in the list.</li>
    <li data-bullet="🚀">The <em>last_separator</em> role allows us to specify a different separator for the last item in the list.</li>

👉 Limiting the number of intervals in the list let set reasonable limits.
  * A maximum of 3 intervals looks reasonable for a schedule (but it can be set
    to any number).
  * In case of not being enough, we can just increase *max_items* when needed.

{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% include_relative
    examples/showcase.examples.md
    option="schedule_list"
    notes=notes
%}

...This is fine for a simple case, and leaves the door open for easily
increasing the number of intervals allowed in the schedule.

But it could look kind of messy if you need to introduce several schedules that may have different number of intervals.

👉 Let's imagine a hotel wanting to manage the scheduling of all the services it offers...


{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes %}
👉 Here we organized the schedules in a table, using different cells for each interval.
  * This keeps intervals aligned which is more readable.
  * But, table cells have no equivalent to `<thead>`, `<tbody>` and `<tfoot>` for table rows.
  * This would have made it hard to properly label each schedule or propperly position the add/remove buttons.

👉 To address this, we used other *template roles*:
  * The *header* role to label each schedule.
  * The *footer* role to place the add/remove buttons.
  * The *placeholder* role to fill the gaps avoiding the add/remove buttons to be
    placed in the wrong place.

{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% include_relative
    examples/showcase.examples.md
    option="schedule_table"
    notes=notes
%}



## Nested lists and forms


Great! Now we have all the scheduling information of or hotel services.

...or maybe not:

Some services may have different schedules for different days of the week or
depending on the season (think in the swimming pool in winter...).

Since we can make lists of forms, we can also nest more forms and lists inside
every list item and so forth to any depth.

👉 Let's focus on the seasons by now:

{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes %}

👉 Notice that you can manually sort the periods in the list by dragging and dropping them.

{: .hint}
> Drag and Drop events are not natively supported by touch devices.
>
> They can be emulated in serveral ways. A quite straighforward one is through
> the *dragdroptouch* library from Bernardo Castilho:
>
> 🔗 [https://github.com/drag-drop-touch-js/dragdroptouch](https://github.com/drag-drop-touch-js/dragdroptouch)

⚡ Not yet implemented but, in the future, SmarkForm lists will also support
automatic sorting features that, in this case, would allow to automatically
sort the periods by start date.

{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}


{% include_relative
    examples/showcase.examples.md
    option="nested_schedule_table"
    notes=notes
%}


There is no theoretical limit to the depth of nesting beyond the logical
usability concerns.

Let's add to the former example contact data that may vary depending on the season and provide multiple phone numbers and emails for each of them.


{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes %}
👉 FIXME!!
{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}


{% include_relative
    examples/showcase.examples.md
    option="deeply_nested_forms"
    notes=notes
%}



{: .hint :}
> These are just simple examples to show the concept. You can see more
> elaborated examples in the [Examples]({{ "resources/examples" | relative_url }})
> section of this documentation.












## Import and Export Data

Exporting and importing data in SmarkForm cannot be easier. 

Let's recall the example in the [Nested forms](#nested-forms) section.

There we learnt that the `⬇️ Export` and `⬆️ Import` buttons used in all
examples in this chapter are just *triggers* that call the *export* and
*import* actions on a subform called "demo" **(their *context*)**:

  * 
    <li data-bullet="⬇️ ">Exports the "demo" subform to the "editor" textarea <b>(its target)</b>.</li>
    <li data-bullet="⬆️ ">Imports the JSON data from the "editor" textarea to the "demo" subform <b>(its target)</b>.</li>

{: .hint :}
> This is a very handy use case for the *import* and *export* actions because
> it does not require any additional JavaScript code.
>
> But this are not the only way to use the *import* and *export* actions.


### Intercepting the *import* and *export* events

Below these lines you can see **the exact same form** with additional `💾` and
`📂` buttons and a little additional JavaScript code to mock the "save" and
"load" operations through window's `alert()` and `prompt()`, reespectively.


{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes %}

👉 Since `💾` and `📂` buttons are in the higher context level, in this case we
used a litle JavaScript code intercepting the related events to, resepectively,
show the whole form in a `window.alert(...)` dialog and import a new JSON data
to the whole form throught a `window.prompt(...)`.

  * The JavaScript code in this example is, in fact, a little more complex than
    it would be needed just to avoid interfering the `⬇️ Export` and
    `⬆️ Import` that also rely on the *export* and *import* actions.

  * And, as a **BONUS**, the *BeforeAction_import* event handler performs a soft
    *export* to prefill the prompt dialog (so that you can edit the JSON data
    instead of manually copying ot writing it from scratch).
    <li data-bullet="👉">See the JS tab to see how the <em>BeforeAction_import</em> event handler prefills the prompt dialog with the JSON export of the whole form.</li>

{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}


{% include_relative
    examples/showcase.examples.md
    option="nested_forms_with_load_save"
    notes=notes
%}

👉 Here you can:

  * Repeat all the same trials as in the beforementioned [Nested
    forms](#nested-forms)' example (with identical results).
  * Use the `💾 Save` button to export the whole form to a `window.alert(...)` dialog.
  * Use the `📂 Load` button to import new JSON data to the whole form.



{: .hint :}
> Remember to check the `📝 Notes` tab for more...


> 🚧 TODO: Add an example showcasing the use of the *target* property to
> duplicate list items.


### Submitting the form

{: .warning :}
> 🚧 Section still under construction...   🚧





## A note on context of the triggers

Let's return to the previous examples...

There we had the `💾 Save` and `📂 Load` buttons opeating on the whole form because it is
their *natural* context.

In the case of the `⬇️ Export`, `⬆️ Import` and `❌ Clear` buttons, they have
their context explicitly set by the option of the same name.

{: .hint :}
> We could have wanted to make the `💾 Save` and `📂 Load` buttons to operate
> only on the *demo* subform.
> 
> To do so, we could have set their *context* property to "demo", in which case
> then they would have exported/imported the same data than `⬇️ Export` and
> `⬆️ Import` buttons, respectively.
>
> Or, alternatively, 🚀 we could just have placed them inside of that context
> **in the markup** as it is shown in the following example:



{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes %}

If you compare the *JS* tab with the one in fhe former one,
you'll see that there is a little difference between them.

👉 In the first one, the "BeforeActionImport" and "AfterActionExport"
event handlers inhibits themselves depending on whether the context is the
root form or not while, in the later, it just focus on the fact that the
*target* is not provided.

👉 The second is a more generic approach for this kind of event handlers. But
the first one serves as an alternative example showing how we can base those
event handlers' behaviour on the specific context (path) of every trigger.

🚀 Just for the sake of showing the power of event handlers, in this case, the
*BeforeActionImport* event handler have been evolved to fill the prompt dialog
with the JSON export of the form when the *target* is not provided.

{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}


{: .hint :}
{% include_relative
    examples/showcase.examples.md
    option="basic_form_with_local_import_export"
    notes=notes
%}

👉 Now the `💾 Save` and `📂 Load` buttons work on the "/demo" path (that is:
they only import/export the "demo" subform) just like `⬇️ Export` and
`⬆️ Import` ones do but without explicitly specifying their context. **They
just receive their context by the place they are in the form**.


{: .info :}
> For the sake of simplicity (except for the following example) from now on,
> having we already demonstrated how to work with *import* and *export*
> actions' events, we'll stick to the layout of the very first example 
> (`⬇️ Export`, `⬆️ Import` and `❌ Clear` buttons targetting the "editor"
> textarea) that doesn't need any additional JS code.


👌 If you want a clearer example on how the context affect the triggers, take a
look to the following example:

{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes %}
👉 Notice that **all *Import* and *Export* buttons (triggers) are handled
by the same event handlers** (for "BeforeAction_import" and
"AfterAction_export", respectively).

👉 **They belong to different *SmarkForm* fields** determined by **(1)**
where they are placed in the DOM and **(2)** the relative path from that
place pointed by the *context* property.

ℹ️  Different field types may import/export different data types (*forms*
import/export JSON while regular *inputs* import/export text).

🔧 For the sake of simplicity, the *BeforeAction_import* event handler
reads the previous value of the field (no matter its type) and provides it
stringified as JSON as default value for the window.prompt() call. Making
it easy to edit the value no matter if we are importing one of the text
fields or the whole form.
{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}


{% include_relative
    examples/showcase.examples.md
    option="context_comparsion"
    notes=notes
%}


### ✋ Don't panic!!

If you felt overwhelmed by the previous example's JavaScript code, don't worry.
It was just to show off the power of the *event handlers*.

Look at this other version of the former example with zero JavaScript (despite
SmarkForm instantiation itself):

{% include_relative
    examples/showcase.examples.md
    option="context_comparsion_simple"
%}

🚀 As you can see, the same actions can be applied to different parts of the
form just by placing the triggers in the right place or explicitly setting the
right path to the desired *context*.

👉 You can *import*, *export* or *clear* either the whole form or any of its
fields. Try exporting / exporting / clearing the whole form or individual
fields whith the help of the "JSON data viewer / editor".





## Context-Driven Keyboard Shortcuts

{: .warning :}
> Section still under construction...

SmarkForm supports context-driven keyboard shortcuts, enhancing the user experience by allowing quick navigation and actions. This example will demonstrate how to configure and use these shortcuts in your forms.

{% include_relative
    examples/showcase.examples.md
    option="keyboard_shortcuts"
%}


## Dynamic Dropdown Options

{: .warning :}
> Section still under construction...

In this example, we'll illustrate how to create dropdown menus with dynamic options. This is particularly useful for forms that need to load options based on user input or external data sources.

{% include_relative
    examples/showcase.examples.md
    option="dynamic_dropdown"
%}



## Smart value coercion

{: .warning :}
> Section still under construction...


{% include_relative
    examples/showcase.examples.md
    option="smart_value_coercion"
%}

## Advanced UX Improvements

{: .warning :}
> Section still under construction...

Finally, we'll showcase some advanced user experience improvements that SmarkForm offers, such as smart auto-enabling/disabling of controls and non-breaking unobtrusive keyboard navigation.

{% include_relative
    examples/showcase.examples.md
    option="advanced_ux"
%}

### Auto enabling or disabling of actions

### Hot Keys

### Animations 



## Conclusion

{: .warning :}
> Section still under construction...

We hope these examples have given you a good overview of what SmarkForm can do. By leveraging the power of markup-driven forms, SmarkForm simplifies the creation of interactive and intuitive forms, allowing you to focus on your application's business logic. Feel free to experiment with these examples and adapt them to suit your specific needs.

For more detailed information and documentation, please refer to the other sections of this manual. If you have any questions or need further assistance, don't hesitate to reach out to the SmarkForm community.

Happy form building!


