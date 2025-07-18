---
title: Showcase
layout: chapter
permalink: /about/showcase
nav_order: 2

---

# {{ page.title }}


This section provides a series of working examples to demonstrate the
capabilities of *SmarkForm* without diving into code details.

It highlights key features through examples, using short and readable code that
prioritizes clarity over UX/semantics. The examples use minimal or no CSS (if
any you'll find it at the CSS tab) to show layout independence.

They go step by step from the most basic form to more advanced and fully
featured ones.

👉 If you are eager to to see the full power of *SmarkForm* in action, you can
   check the 🔗 [Examples]({{ "resources/examples" | relative_url }}) section
   first.

👉 Nonetheless, if you are impatient to get your hands dirty, the
   🔗 [Quick Start]({{ "getting_started/quick_start" | relative_url }}) is
   there for you.



<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Basic Form](#basic-form)
* [Nested forms](#nested-forms)
* [Lists](#lists)
* [Deeply nested forms](#deeply-nested-forms)
* [More on lists](#more-on-lists)
* [Nested lists and forms](#nested-lists-and-forms)
    * [Item duplication](#item-duplication)
* [Import and Export Data](#import-and-export-data)
    * [Intercepting the *import* and *export* events](#intercepting-the-import-and-export-events)
    * [Submitting the form](#submitting-the-form)
* [A note on context of the triggers](#a-note-on-context-of-the-triggers)
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


{% include components/sampletabs_ctrl.md %}


## Basic Form

To begin with the basics, we'll start with a simple form that includes a few
input fields.

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

{% raw %} <!-- basic_form {{{ --> {% endraw %}
{% capture basic_form
%}█<h2>Model details</h2>
█<p>
█    <label data-smark>Model Name:</label>
█    <input type="text" name="model" data-smark />
█</p>
█<p>
█    <label data-smark>Type:</label>
█    <select name="type" data-smark='{"encoding":"json"}'>
█        <option value='null'>👇 Please select...</option>
█        <!-- json encoding allow us return null values -->
█        <option value='"Car"'>Car</option>
█        <!-- ...but now we must wrap strings in double quotes -->
█        <!-- (it also gives us the ability to return objects and arrays) -->
█        <option>Bicycle</option>
█        <!-- ...but if we are Ok with inner text as value, we can just omit the value attribute -->
█        <option>Motorcycle</option>
█        <option>Van</option>
█        <option>Pickup</option>
█        <option>Quad</option>
█        <option>Truck</option>
█    </select>
█</p>
█<p>
█    <label data-smark>Seats:</label>
█    <input type="number" name="seats" min=4 max=9 data-smark />
█</p>
█<p>
█    <label data-smark>Driving Side:</label>
█    <input type="radio" name="side" value="left" data-smark /> Left
█    <input type="radio" name="side" value="right" data-smark /> Right
█</p>
█<p>
█    <label data-smark>Color:</label>
█    <span data-smark='{"type":"color", "name":"color"}'>
█        <input data-smark>
█        <button data-smark='{"action":"clear"}' title='Indifferent or unknown' >❌ </button>
█    </span>
█</p>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% include components/sampletabs_tpl.md
    formId="basic_form"
    htmlSource=basic_form
    notes=notes
    selected="preview"
    showEditor=true
%}


👉 Notice everything works **with no JS code** other than SmarkForm
instantiation itself ([I swear](#deeply-nested-forms)).

For instance, you can:

  * <li data-bullet="⌨️">Type some data in the form.</li>
    <li data-bullet="⬇️">Export it to the textarea in JSON format.</li>
    <li data-bullet="❌">Clear the form whenever you want.</li>
    <li data-bullet="📝">Edit the JSON as you like.</li>
    <li data-bullet="⬆️"> Import the JSON back to the form.</li>
    <li data-bullet="👀">See the effects of your changes.</li>



## Nested forms

Let's add a few more fields to the form to provide information regarding
included safety equipment. This time we'll group them in a nested subform under
the name "safety".


{% raw %} <!-- nested_forms {{{ --> {% endraw %}
{% capture nested_forms
%}{{ basic_form }}
█<fieldset data-smark='{"name":"safety","type":"form"}'>
█    <legend>Safety Features:</legend>
█    <span>
█        <label><input type="checkbox" name="airbag" data-smark /> Airbag.</label>
█    </span>
█    &nbsp;&nbsp;
█    <span>
█        <label><input type="checkbox" name="abs" data-smark /> ABS.</label>
█    </span>
█    &nbsp;&nbsp;
█    <span>
█        <label><input type="checkbox" name="esp" data-smark /> ESP.</label>
█    </span>
█    &nbsp;&nbsp;
█    <span>
█        <label><input type="checkbox" name="tc" data-smark />TC.</label>
█    </span>
█</fieldset>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="nested_forms"
    htmlSource=nested_forms
    selected="preview"
    showEditor=true
%}



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

{% raw %} <!-- simple_list {{{ --> {% endraw %}
{% capture simple_list
%}█<button data-smark='{"action":"removeItem", "context":"phones"}' title='Remove phone number'>➖</button>
█<button data-smark='{"action":"addItem","context":"phones"}' title='Add phone number'>➕ </button>
█<label data-smark>Phones:</label>
█<div data-smark='{"type":"list", "name": "phones", "of": "input", "exportEmpties": true}'>
█    <input type="tel" style="display: block">
█</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% include components/sampletabs_tpl.md
    formId="simple_list"
    htmlSource=simple_list
    notes=notes
    selected="preview"
    showEditor=true
%}



Here we used a simpple `<input>` field for each item in the list and had to
trick them with `style="display: block;"` to make them to stack gracefully.

<span id="singleton_list_example" style="font-size: xx-large">But <b>lists are even more powerful</b> than that...</span>

For instance, we could have used a *form* field instead, but in this case we
would had got a JSON object for each item in the list, which is not what we
want in this specific case.

👉 To address this issue, we can take advantage of the *singleton pattern*
which allows us to make any HTML element to work as a regular *input* field.


{: .info :}
> We call the *singleton pattern* when we use any HTML element different from
> `<input>`, `<select>`, `<textarea>`, etc., as a regular *SmarkForm* field.
>
> For this to work we only need define the *data-smark* property on it
> specifying the appropriate type and place one **and only one** of these
> elements (with the "data-smark" attribute since otherwise they are ignored)
> in its contents.

This way we can not only use a more elaborated structure for each item in the
list: It also allows us to include other controls within every list item, like
in the following example:


{% raw %} <!-- simple_list_singleton {{{ --> {% endraw %}
{% capture simple_list_singleton
%}█<button data-smark='{"action":"removeItem", "context":"phones", "target":"*", "keep_non_empty":true}' title='Remove unused fields'>🧹</button>
█    <button data-smark='{"action":"removeItem", "context":"phones", "keep_non_empty":true}' title='Remove phone number'>➖</button>
█    <button data-smark='{"action":"addItem","context":"phones"}' title='Add phone number'>➕ </button>
█    <label data-smark>Phones:</label>
█    <ul data-smark='{"name": "phones", "of": "input", "sortable":true, "min_items":0, "max_items":5}'>
█        <li data-smark='{"role": "empty_list"}' class="row">(None)</li>
█        <li class="row">
█            <label data-smark>📞 </label><input type="tel" data-smark>
█            <button data-smark='{"action":"removeItem"}' title='Remove this phone number'>❌</button>
█        </li>
█    </ul>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- simple_list_singleton_css {{{ --> {% endraw %}
{% capture simple_list_singleton_css
%}#myForm$$ ul li {
    list-style-type: none !important;
}{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}



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
  * Also notice that when the maxItems limit is reached, every *addItem*
    trigger, like the `➕` button is automatically disabled.
  * ...Samme applies to *removeItem* triggers when the minItems limit is
    reached.
{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}


{% include components/sampletabs_tpl.md
    formId="simple_list_singleton"
    htmlSource=simple_list_singleton
    cssSource=simple_list_singleton_css
    notes=notes
    selected="preview"
    showEditor=true
%}


{: .hint :}
> Again, don't miss to check the `📝 Notes` tab for more powerful insights and
> tips.



## Deeply nested forms

Despite of usability concerns, there is no limit in form nesting depth.

In fact, all examples in this chapter are entirely built with SmarkForm itself
**with no additonal JS code**.

🚀 Including `⬇️ Export`, `⬆️ Import` and `❌ Clear` buttons are just
*SmarkForm* trigger components that work out of the box.

🤔 ...it's just that part is omitted in the shown HTML source to keep the
examples simple and focused on the subject they are intended to illustrate.

🕵️ Below this line you can explore the previous example again with all the HTML
source code:


{% include components/sampletabs_tpl.md
    formId="nested_forms_full"
    htmlSource=nested_forms
    selected="preview"
    showEditor=true
    showEditorSource=true
    selected="html"
%}


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




## More on lists

*SmarkForm*'s lists are incredibly powerful and flexible. They can be used to
create complex data structures, such as schedules, inventories, or any other
repeating data structure.

To begin with, another interesting use case for lists is to create a schedule
list like the following example:

{% raw %} <!-- schedule_list {{{ --> {% endraw %}
{% capture schedule_list
%}<p>
    <button data-smark='{"action":"removeItem","hotkey":"-","context":"schedule"}' title='Less intervals'>➖</button>
    <button data-smark='{"action":"addItem","hotkey":"+","context":"schedule"}' title='More intrevals'>➕</button>
    <label>Schedule:</label>
    <span data-smark='{"type":"list","name":"schedule","min_items":0,"max_items":3,"exportEmpties":true}'>
        <span>
            <input class='small' data-smark type='time' name='start'> to <input class='small' data-smark type='time' name='end'>
        </span>
        <span data-smark='{"role":"empty_list"}'>(Closed)</span>
        <span data-smark='{"role":"separator"}'>, </span>
        <span data-smark='{"role":"last_separator"}'> and </span>
    </span>
</p>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

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

{% include components/sampletabs_tpl.md
    formId="schedule_list"
    htmlSource=schedule_list
    notes=include.notes
    selected="preview"
    showEditor=true
%}


...This is fine for a simple case, and leaves the door open for easily
increasing the number of intervals allowed in the schedule.

But it could look kind of messy if you need to introduce several schedules that may have different number of intervals.

👉 Let's imagine a hotel wanting to manage the scheduling of all the services it offers...


{% raw %} <!-- schedule_table {{{ --> {% endraw %}
{% capture schedule_table
%}█<table data-smark='{"type":"form","name":"schedules"}' style="width: 30em">
█    <tr data-smark='{"type":"list","name":"rcpt_schedule","min_items":0,"max_items":3,"exportEmpties":true}'>
█        <th data-smark='{"role":"header"}' style="width: 10em; text-align:left">🛎️ Reception:</th>
█        <td data-smark='{"role":"empty_list"}' class='time_slot'>(Closed)</td>
█        <td class='time_slot'>
█            <input class='small' data-smark type='time' name='start'>
█            to
█            <input class='small' data-smark type='time' name='end'>
█        </td>
█        <td data-smark='{"role":"placeholder"}' class='time_slot'></td>
█        <td data-smark='{"role":"footer"}' style='text-align: right'>
█            <button data-smark='{"action":"removeItem","hotkey":"-"}' title='Less intervals'>➖</button>
█            <button data-smark='{"action":"addItem","hotkey":"+"}' title='More intrevals'>➕</button>
█        </td>
█    </tr>
█    <tr data-smark='{"type":"list","name":"bar_schedule","min_items":0,"max_items":3,"exportEmpties":true}'>
█        <th data-smark='{"role":"header"}' style="width: 10em; text-align:left">🍸 Bar</th>
█        <td data-smark='{"role":"empty_list"}' class='time_slot'>(Closed)</td>
█        <td class='time_slot'>
█            <input class='small' data-smark type='time' name='start'>
█            to
█            <input class='small' data-smark type='time' name='end'>
█        </td>
█        <td data-smark='{"role":"placeholder"}' class='time_slot'></td>
█        <td data-smark='{"role":"footer"}' style='text-align: right'>
█            <button data-smark='{"action":"removeItem","hotkey":"-"}' title='Less intervals'>➖</button>
█            <button data-smark='{"action":"addItem","hotkey":"+"}' title='More intrevals'>➕</button>
█        </td>
█    </tr>
█    <tr data-smark='{"type":"list","name":"restaurant_schedule","min_items":0,"max_items":3,"exportEmpties":true}'>
█        <th data-smark='{"role":"header"}' style="width: 10em; text-align:left">🍽️ Restaurant:</th>
█        <td data-smark='{"role":"empty_list"}' class='time_slot'>(Closed)</td>
█        <td class='time_slot'>
█            <input class='small' data-smark type='time' name='start'>
█            to
█            <input class='small' data-smark type='time' name='end'>
█        </td>
█        <td data-smark='{"role":"placeholder"}' class='time_slot'></td>
█        <td data-smark='{"role":"footer"}' style='text-align: right'>
█            <button data-smark='{"action":"removeItem","hotkey":"-"}' title='Less intervals'>➖</button>
█            <button data-smark='{"action":"addItem","hotkey":"+"}' title='More intrevals'>➕</button>
█        </td>
█    </tr>
█    <tr data-smark='{"type":"list","name":"pool_schedule","min_items":0,"max_items":3,"exportEmpties":true}'>
█        <th data-smark='{"role":"header"}' style="width: 10em; text-align:left">🏊 Pool:</th>
█        <td data-smark='{"role":"empty_list"}' class='time_slot'>(Closed)</td>
█        <td class='time_slot'>
█            <input class='small' data-smark type='time' name='start'>
█            to
█            <input class='small' data-smark type='time' name='end'>
█        </td>
█        <td data-smark='{"role":"placeholder"}' class='time_slot'></td>
█        <td data-smark='{"role":"footer"}' style='text-align: right'>
█            <button data-smark='{"action":"removeItem","hotkey":"-"}' title='Less intervals'>➖</button>
█            <button data-smark='{"action":"addItem","hotkey":"+"}' title='More intrevals'>➕</button>
█        </td>
█    </tr>
█</table>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- schedule_table_css {{{ --> {% endraw %}
{% capture schedule_table_css
%}
{{}}#myForm$$ .time_slot {
    white-space: nowrap;
    width: 10em;
}
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

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

{% include components/sampletabs_tpl.md
    formId="schedule_table"
    htmlSource=schedule_table
    cssSource=schedule_table_css
    notes=notes
    selected="preview"
    showEditor=true
%}


## Nested lists and forms


Great! Now we have all the scheduling information of or hotel services.

...or maybe not:

Some services may have different schedules for different days of the week or
depending on the season (think in the swimming pool in winter...).

Since we can make lists of forms, we can also nest more forms and lists inside
every list item and so forth to any depth.

👉 Let's focus on the seasons by now:

{% raw %} <!-- nested_schedule_table {{{ --> {% endraw %}
{% capture nested_schedule_table
%}<h2>🗓️ Periods:</h2>
<div data-smark='{"type":"list","name":"periods","sortable":true,"exportEmpties":true}'>
    <fieldset style='margin-top: 1em'>
        <legend>Period
            <span data-smark='{"action":"position"}'>N</span>
            of
            <span data-smark='{"action":"count"}'>M</span>
        </legend>
        <button
            data-smark='{"action":"removeItem","hotkey":"-"}'
            title='Remove this period'
            style="float: right"
        >➖</button>
        <p>
          <label data-smark>Start Date:</label>&nbsp;<input data-smark type='date' name='start_date'>
          <label data-smark>End Date:</label>&nbsp;<input data-smark type='date' name='end_date'>
        </p>
{{ schedule_table | replace: "█", "                    " }}
    </fieldset>
</div>
<button
    data-smark='{"action":"addItem","context":"periods","hotkey":"+"}'
    style="float: right; margin-top: 1em"
>➕ Add Period</button>
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="nested_schedule_table"
    htmlSource=nested_schedule_table
    cssSource=schedule_table_css
    notes=notes
    selected="preview"
    showEditor=true
%}


⚡ There is no theoretical limit to the depth of nesting beyond the logical
usability concerns.

👉 Notice that you can manually sort the periods in the list by dragging and dropping them.

{: .warning :}
> Drag and Drop events are not natively supported by touch devices.
>
> They can be emulated in serveral ways. A quite straighforward one is through
> the
> [drag-drop-touch](https://drag-drop-touch-js.github.io/dragdroptouch/demo/)
> library from Bernardo Castilho:
> 
>   * 🔗 [NPM](https://www.npmjs.com/package/@dragdroptouch/drag-drop-touch)
>   * 🔗 [GitHub](https://github.com/drag-drop-touch-js/dragdroptouch)


{: .hint :}
⚡ Not yet implemented but, in a near future, SmarkForm lists will also support
automatic sorting features that, in this case, would allow to automatically
sort the periods by start date.



### Item duplication

Adding similar items to a list—like periods—can be tedious if users have to
re-enter all fields each time. To make this easier, SmarkForm lets you add a
new item prefilled with data from an existing one by using an addItem trigger
button with the *source* property set to another item in the list (for
inxtance, the previous item -specified by  the special path `.-1`-).

This way, users can duplicate an entry and just edit what’s different.

Below is the same example as before, but with an additional `✨` button to
*duplicate* the data from the previous one.

{% raw %} <!-- nested_schedule_table_duplicable {{{ --> {% endraw %}
{% capture nested_schedule_table_duplicable
%}<h2>🗓️ Periods:</h2>
<div data-smark='{"type":"list","name":"periods","sortable":true,"exportEmpties":true}'>
    <fieldset style='margin-top: 1em'>
        <legend>Period
            <span data-smark='{"action":"position"}'>N</span>
            of
            <span data-smark='{"action":"count"}'>M</span>
        </legend>
        <button
            data-smark='{"action":"removeItem","hotkey":"-"}'
            title='Remove this period'
            style="float: right"
        >➖</button>
        <button
            data-smark='{"action":"addItem","source":".-1","hotkey":"d"}'
            title='Duplicate this period'
            style="float: right"
        >✨</button>
        <p>
          <label data-smark>Start Date:</label>&nbsp;<input data-smark type='date' name='start_date'>
          <label data-smark>End Date:</label>&nbsp;<input data-smark type='date' name='end_date'>
        </p>
{{ schedule_table | replace: "█", "                    " }}
    </fieldset>
</div>
<button
    data-smark='{"action":"addItem","context":"periods","hotkey":"+"}'
    style="float: right; margin-top: 1em"
>➕ Add Period</button>
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="nested_schedule_table_duplicable"
    htmlSource=nested_schedule_table_duplicable
    cssSource=schedule_table_css
    selected="preview"
    showEditor=true
%}


## Import and Export Data

Exporting and importing data in SmarkForm cannot be easier. 

Let's recall the example showing the full HTML sourece in the [Deeply nested
forms](#deeply-nested-forms) section:


{% include components/sampletabs_tpl.md
    formId="nested_forms_bis"
    htmlSource=nested_forms
    selected="preview"
    showEditor=true
    showEditorSource=true
%}


There we learnt that the `⬇️ Export`, `⬆️ Import` and `❌  Clear` buttons used
in all examples in this documentation are just *triggers* that call the
*export* and *import* actions on a subform called "demo" **(their *context*)**:

  * `⬇️ Export` Exports the "demo" subform to the "editor" textarea **(its target)**.
  * `⬆️ Import` Imports the JSON data from the "editor" textarea to the "demo" subform **(its target)**.
  * `❌  Clear` Clears the "demo" subform **(its context)**.


{: .hint :}
> This is a very handy use case for the *import* and *export* actions because
> it does not require any additional JavaScript code.
>
> But this is not the only way to use the *import* and *export* actions.


### Intercepting the *import* and *export* events

Below these lines you can see **the exact same form** with additional `💾 Save`
and `📂 Load` buttons.

They are *export* and *import* triggers, but placed outside of any subform so
that their natural context is the whole form.

In the *JS* tab there is a simple JavaScript code that:

  * Intercepts the *onAfterAction_export* and *onBeforeAction_import* events.
  * Shows the JSON of the whole form in a `window.alert(...)` window in the
    case of *export* (💾) action.
  * Prompts with a `window.prompt(...)` dialog for JSON data to import into the
    whole form.

{% raw %} <!-- nested_forms_with_load_save {{{ --> {% endraw %}
{% capture nested_forms_with_load_save %}
{{ nested_forms | replace: "█", "            " }}
{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}


{% raw %} <!-- form_export_example_import_export_js {{{ --> {% endraw %}
{% capture form_export_example_import_export_js
%}

myForm.on("AfterAction_export", ({context, data})=>{
    /* Only for the whole form */
    /* (avoiding to interfere with `⬇️ Export` button) */
    if (context.getPath() !== "/") return; /* Only for root */

    /* Pretty print and show */
    if (typeof data == "object") data = JSON.stringify(data, null, 4);
    window.alert(data);
});

myForm.on("BeforeAction_import", async (ev)=>{
    /* Only for the whole form */
    /* (avoiding to interfere with `⬆️ Import ` button */
    if (ev.context.getPath() !== "/") return;

    /* BONUS: Read previous data to use it as default value */
    /*        so that you only need to edit it.              */
    let previous_value = await ev.context.export();
    let isObject = typeof previous_value == "object";
    if (isObject) previous_value = JSON.stringify(previous_value);

    /* Read new value: */
    let data = window.prompt("Edit JSON data", previous_value);
    if (data === null) return void ev.preventDefault(); /* User cancelled */

    /* Parse as JSON, warn if invalid, and set */
    try {
        if (isObject) data = JSON.parse(data);
        ev.data = data; /* ← Set the new value */
    } catch(err) {
        alert(err.message); /* ← Show error message */
        ev.preventDefault();
    };
});{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes %}

👉 Since `💾` and `📂` buttons are in the higher context level, in this case we
used a litle JavaScript code intercepting the related events to, resepectively,
show the whole form in a `window.alert(...)` dialog and import a new JSON data
to the whole form throught a `window.prompt(...)`.

👉 See the JS tab to see how the <em>BeforeAction_import</em> event handler
prefills the prompt dialog with the JSON export of the whole form.

{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}


{% include components/sampletabs_tpl.md
    formId="nested_forms_with_load_save"
    htmlSource=nested_forms_with_load_save
    jsSource=form_export_example_import_export_js
    notes=notes
    selected="preview"
    showEditor=true
    addLoadSaveButtons=true
    showEditorSource=true
%}

👉 Remember to check the `📝 Notes` tab for more...


{: .info :}
> In this case, the JS code goes a little further than the essential to:
> 
>   * Inhibit themselves when context is not the root form to avoid
>     interferring with the `⬇️ Export` and `⬆️ Import` buttons.
>  
>   * Pretty-print the JSON data in the *export* action making it more
>     readable.
>  
>   * Prefill the `window.prompt(...)` dialog with the JSON of current data in
>     the *import* allowing you to edit it instead of having to write it from
>     scratch.
> 
> 👌 But you get the idea: This is just a simple mock of how you can interact
> with your application logic or server APIs.
> 
> {: .hint :}
> > Notice you can even abort the *import* action by calling
> > `ev.preventDefault()` in case of failure or, like in this case, user
> > cancellation.


### Submitting the form

{: .warning :}
> 🚧 Section still under construction...   🚧





## A note on context of the triggers

As we have seen in the previous examples:

   * We can use the *export* and *import* actions to export/import data from/to
     any *context*: The whole form, any of its subforms or even a single field.

   * That *context* is, by default, determined by the place where the
     *trigger* is placed in the DOM tree, but it can be explicitly set by the
     *context* property of the *trigger* component.

   * We can use the *target* property to set the destination/source of that
     data or intercept the *afterAction_export* and *beforeAction_import* events
     to programatically handle the data.


{: .info :}
> For the sake of simplicity, from now on, we'll stick to the layout of the
> very first example (`⬇️ Export`, `⬆️ Import` and `❌ Clear` buttons
> targetting the "editor" textarea) that doesn't need any additional JS code.
> 
> That part of the layout will also be ommitted in the HTML source since we've
> already know how it works.


👌 If you want a clearer example on how the context affect the triggers, take a
look to the following example:

{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes %}
👉 Notice that **all *Import* and *Export* buttons (triggers) are handled
by the same event handlers** (for "BeforeAction_import" and
"AfterAction_export", respectively).

👉 **All *Import* and *Export* buttons (triggers) belong to different
*SmarkForm* fields** determined by **(1)** where they are placed in the DOM and
**(2)** the relative path from that place pointed by the *context* property.

ℹ️  Different field types may import/export different data types (*forms*
import/export JSON while regular *inputs* import/export text --or number--).

{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}


{% raw %} <!-- capture context_comparsion_example {{{ --> {% endraw %}
{% capture context_comparsion_example
%}    <div data-smark='{"name":"demo"}'>
        <p>
            <label data-smark>Name:</label>
            <input name='name' data-smark>
        </p>
        <p>
            <label data-smark>Surname:</label>
            <input name='surname' data-smark>
        </p>
        <table>
            <tr style="text-align:center">
                <th>Name field:</th>
                <th>Surname field:</th>
                <th>Whole Form:</th>
            </tr>
            <tr style="text-align:center">
                <td><button data-smark='{"action":"import","context":"name","target":"/editor"}'>⬆️  Import</button></td>
                <td><button data-smark='{"action":"import","context":"surname","target":"/editor"}'>⬆️  Import</button></td>
                <td><button data-smark='{"action":"import","target":"/editor"}'>⬆️  Import</button></td>
            </tr>
            <tr style="text-align:center">
                <td><button data-smark='{"action":"export","context":"name","target":"/editor"}'>⬇️  Export</button></td>
                <td><button data-smark='{"action":"export","context":"surname","target":"/editor"}'>⬇️  Export</button></td>
                <td><button data-smark='{"action":"export","target":"/editor"}'>⬇️  Export</button></td>
            </tr>
            <tr style="text-align:center">
                <td><button data-smark='{"action":"clear","context":"name"}'>❌ Clear</button></td>
                <td><button data-smark='{"action":"clear","context":"surname"}'>❌ Clear</button></td>
                <td><button data-smark='{"action":"clear"}'>❌ Clear</button></td>
            </tr>
        </table>
    </div>
    <div style="display: flex; flex-direction:column; align-items:left; gap: 1em; width: 100%">
{{ json_editor | replace: "█", "        " }}
    </div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% include components/sampletabs_tpl.md
    formId="context_comparsion"
    htmlSource=context_comparsion_example
    notes=notes
    selected="preview"
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


{% include components/sampletabs_tpl.md
    formId="keyboard_shortcuts"
    htmlSource=keyboard_shortcuts
    selected="preview"
%}



## Dynamic Dropdown Options

{: .warning :}
> Section still under construction...

In this example, we'll illustrate how to create dropdown menus with dynamic options. This is particularly useful for forms that need to load options based on user input or external data sources.


{% include components/sampletabs_tpl.md
    formId="dynamic_dropdown"
    htmlSource=dynamic_dropdown
    selected="preview"
%}



## Smart value coercion

{: .warning :}
> Section still under construction...


{% include components/sampletabs_tpl.md
    formId="smart_value_coercion"
    htmlSource=smart_value_coercion
    selected="preview"
%}

## Advanced UX Improvements

{: .warning :}
> Section still under construction...

Finally, we'll showcase some advanced user experience improvements that SmarkForm offers, such as smart auto-enabling/disabling of controls and non-breaking unobtrusive keyboard navigation among others.


### Auto enabling or disabling of actions

As you may have already noticed, SmarkForm automatically enables or disables actions based on the current state of the form. For example, if a list has reached its maximum number of items, the "Add Item" button will be disabled until an item is removed.


Let's recall our [Singleton List Example](#singleton_list_example), this time keeping the *min_items* to its default value of 1, so that the list cannot be empty and add a little CSS to make the disabled buttons more evident:

{% raw %} <!-- simple_list_autodisable {{{ --> {% endraw %}
{% capture simple_list_autodisable
%}█<button data-smark='{"action":"removeItem", "context":"phones", "target":"*", "keep_non_empty":true}' title='Remove unused fields'>🧹</button>
█    <button data-smark='{"action":"removeItem", "context":"phones", "keep_non_empty":true}' title='Remove phone number'>➖</button>
█    <button data-smark='{"action":"addItem","context":"phones"}' title='Add phone number'>➕ </button>
█    <label data-smark>Phones:</label>
█    <ul data-smark='{"name": "phones", "of": "input", "sortable":true, "max_items":5}'>
█        <li data-smark='{"role": "empty_list"}' class="row">(None)</li>
█        <li class="row">
█            <label data-smark>📞 </label><input type="tel" data-smark>
█            <button data-smark='{"action":"removeItem"}' title='Remove this phone number'>❌</button>
█        </li>
█    </ul>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- simple_list_autodisable_css {{{ --> {% endraw %}
{% capture simple_list_autodisable_css
%}#myForm$$ ul li {
    list-style-type: none !important;
}
{{}}#myForm$$ :disabled {
    opacity: 0.4; /* Make disabled buttons more evident */
}{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="simple_list_autodisable"
    htmlSource=simple_list_autodisable
    cssSource=simple_list_autodisable_css
    selected="preview"
    showEditor=true
%}

### Hot Keys


### Animations 



## Conclusion

{: .warning :}
> Section still under construction...

We hope these examples have given you a good overview of what SmarkForm can do. By leveraging the power of markup-driven forms, SmarkForm simplifies the creation of interactive and intuitive forms, allowing you to focus on your application's business logic. Feel free to experiment with these examples and adapt them to suit your specific needs.

For more detailed information and documentation, please refer to the other sections of this manual. If you have any questions or need further assistance, don't hesitate to reach out to the SmarkForm community.

Happy form building!


