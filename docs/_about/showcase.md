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

* [Basics](#basics)
    * [Simple plain form](#simple-plain-form)
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
* [Advanced UX Improvements](#advanced-ux-improvements)
    * [Auto enabling or disabling of actions](#auto-enabling-or-disabling-of-actions)
    * [Context-Driven Keyboard Shortcuts (Hot Keys)](#context-driven-keyboard-shortcuts-hot-keys)
    * [Reveal of hot keys](#reveal-of-hot-keys)
    * [Hotkeys and context](#hotkeys-and-context)
    * [Smooth navigation](#smooth-navigation)
    * [2nd level hotkeys](#2nd-level-hotkeys)
    * [Hidden actions](#hidden-actions)
    * [Animations](#animations)
    * [Smart value coercion](#smart-value-coercion)
    * [Dynamic Dropdown Options](#dynamic-dropdown-options)
* [Random Examples](#random-examples)
    * [Simple Calculator](#simple-calculator)
    * [Calculator (UX improved)](#calculator-ux-improved)
* [Conclusion](#conclusion)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


{% include components/sampletabs_ctrl.md %}


## Basics

### Simple plain form

To begin with the basics, we'll start with a simple form that includes a few
input fields.

{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes %}
👉 Notice that **most SmarkForm fields can be null**, to explicitly mean that
the information is unknown or indifferent.

  * In the case of radio buttons, if no option is selected, they evaluate to
    null.
    - Even after a value is set, they allow unselectiong the selected option
      either by clicking on it again or by pressing the `Delete` key.
  * Even color pickers can be null even [native HTML color inputs
    can't](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/color#value).
    - Just press the `Delete`key or use the `❌` button to call it's "clear" *action*.

👉 **This kind of *SmarkForm* components** intended to call *actions* on
*SmarkForm* fields **are called *triggers*.**

  * There are several other *actions* that can be called on *SmarkForm* fields.
    Some, such as *import* and *export* are common to all field types and
    others are specific to some of them. For instance *addItem* and *removeItem*
    are specific to lists.

👉 Also notice the `{"encoding":"json"}` bit in the `<select>` dropdown.

  * This allow it to return a Null value when the first option is selected.
  * It also forces to wrap other values in double quotes to make them valid
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
█    <label data-smark>Detailed description:</label>
█    <textarea name="longdesc" data-smark ></textarea>
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
    tests=false
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


### Nested forms

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
    tests=false
%}



### Lists

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
█<strong data-smark="label">Phones:</strong>
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
    tests=false
%}



Here we used a simple `<input>` field for each item in the list and had to
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
%}█<button data-smark='{"action":"removeItem", "context":"phones", "target":"*", "preserve_non_empty":true}' title='Remove unused fields'>🧹</button>
█    <button data-smark='{"action":"removeItem", "context":"phones", "preserve_non_empty":true}' title='Remove phone number'>➖</button>
█    <button data-smark='{"action":"addItem","context":"phones"}' title='Add phone number'>➕ </button>
█    <strong data-smark="label">Phones:</strong>
█    <ul data-smark='{"name": "phones", "of": "input", "sortable":true, "min_items":0, "max_items":5}'>
█        <li data-smark='{"role": "empty_list"}' class="row">(None)</li>
█        <li class="row">
█            <label data-smark>📞 Telephone
█            <span data-smark='{"action":"position"}'>N</span>
█            </label>
█            <button data-smark='{"action":"removeItem"}' title='Remove this phone number'>➖</button>
█            <input type="tel" data-smark>
█            <button data-smark='{"action":"addItem"}' title='Insert phone number'>➕ </button>
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
  * Prepended a `➖` button to each item to cherry-pick which items to remove.
  * Appended a `➕` button to each item to allow inserting items at a given position.
  * Returned to the default behaviour of not exporting empty items.
  * Made it sortable (by dragging and dropping items).
  * Also notice that when the max_items limit is reached, every *addItem*
    trigger, like the `➕` button is automatically disabled.
  * ...Same applies to *removeItem* triggers when the min_items limit is
    reached.
{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}


{% include components/sampletabs_tpl.md
    formId="simple_list_singleton"
    htmlSource=simple_list_singleton
    cssSource=simple_list_singleton_css
    notes=notes
    selected="preview"
    showEditor=true
    tests=false
%}


{: .hint :}
> This example may look a bit bloated, but it is just to show the power and
> flexibility of *SmarkForm* trigger components.
> 
> In a real application you will be able to pick those controls that best suit
> your needs and use them as you like.
> 
> 👉 And, again, don't miss to check the `📝 Notes` tab for more powerful
> insights and tips.



### Deeply nested forms

Despite of usability concerns, there is no limit in form nesting depth.

In fact, all examples in this chapter are entirely built with SmarkForm itself
**with no additional JS code**.

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
    tests=false
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




### More on lists

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
    <strong data-smark="label">Schedule:</strong>
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
  * Usually lists are laid out with single HTML node inside which plays the
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
    tests=false
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
{{""}}#myForm$$ .time_slot {
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
  * This would have made it hard to properly label each schedule or properly position the add/remove buttons.

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
    tests=false
%}


### Nested lists and forms


Great! Now we have all the scheduling information of or hotel services.

...or maybe not:

Some services may have different schedules for different days of the week or
depending on the season (think in the swimming pool in winter...).

Since we can make lists of forms, we can also nest more forms and lists inside
every list item and so forth to any depth.

👉 Let's focus on the seasons by now:

{% raw %} <!-- nested_schedule_table {{{ --> {% endraw %}
{% capture nested_schedule_table
%}<h2 data-smark="label">🗓️ Periods:</h2>
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
    tests=false
%}


⚡ There is no theoretical limit to the depth of nesting beyond the logical
usability concerns.

👉 Notice that you can manually sort the periods in the list by dragging and dropping them.

{: .warning :}
> Drag and Drop events are not natively supported by touch devices.
>
> They can be emulated in several ways. A quite straightforward one is through
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
instance, the previous item -specified by  the special path `.-1`-).

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
    tests=false
%}


## Import and Export Data

Exporting and importing data in SmarkForm cannot be easier. 

Let's recall the example showing the full HTML source in the [Deeply nested
forms](#deeply-nested-forms) section:


{% include components/sampletabs_tpl.md
    formId="nested_forms_bis"
    htmlSource=nested_forms
    selected="preview"
    showEditor=true
    showEditorSource=true
    tests=false
%}


There we learned that the `⬇️ Export`, `⬆️ Import` and `❌  Clear` buttons used
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
used a little JavaScript code intercepting the related events to, respectively,
show the whole form in a `window.alert(...)` dialog and import a new JSON data
to the whole form through a `window.prompt(...)`.

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
    tests=false
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
> > `ev.preventDefault()` in case of failure or, as shown for the `❌ Clear`
> > button in the
> > [🔗 Quick Start]({{"getting_started/quick_start#event-handling" | relative_url }})
> > section, in case of user cancellation.



### Submitting the form

{: .warning :}
> 🚧 Section still under construction...   🚧





### A note on context of the triggers

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
> That part of the layout will also be omitted in the HTML source since we've
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
    tests=false
%}


🚀 As you can see, the same actions can be applied to different parts of the
form just by placing the triggers in the right place or explicitly setting the
right path to the desired *context*.

👉 You can *import*, *export* or *clear* either the whole form or any of its
fields. Try exporting / exporting / clearing the whole form or individual
fields with the help of the "JSON data viewer / editor".


## Advanced UX Improvements

Finally, we'll showcase some advanced user experience improvements that SmarkForm offers, such as smart auto-enabling/disabling of controls and non-breaking unobtrusive keyboard navigation among others.

### Auto enabling or disabling of actions

As you may have already noticed, SmarkForm automatically enables or disables
actions based on the current state of the form. For example, if a list has
reached its maximum number of items specified by the *max_items* option, the
"Add Item" button will be disabled until an item is removed.

The same happen with the "Remove Item" button when the list has reached its
minimum number of items specified by *min_items*.

Let's recall our [Singleton List Example](#singleton_list_example) with just
slight modifications:

  1. Keep the *min_items* to its default value of 1, so that the list cannot be empty.
  2. Add a little CSS to make the disabled buttons more evident.

{% raw %} <!-- simple_list_autodisable {{{ --> {% endraw %}
{% capture simple_list_autodisable
%}█<button data-smark='{"action":"removeItem", "context":"phones", "target":"*", "preserve_non_empty":true}' title='Remove unused fields'>🧹</button>
█    <button data-smark='{"action":"removeItem", "context":"phones", "preserve_non_empty":true}' title='Remove phone number'>➖</button>
█    <button data-smark='{"action":"addItem","context":"phones"}' title='Add phone number'>➕ </button>
█    <strong data-smark="label">Phones:</strong>
█    <ul data-smark='{"name": "phones", "of": "input", "sortable":true, "max_items":5}'>
█        <li class="row">
█            <label data-smark>📞 Telephone
█            <span data-smark='{"action":"position"}'>N</span>
█            </label>
█            <button data-smark='{"action":"removeItem"}' title='Remove this phone number'>➖</button>
█            <input type="tel" data-smark>
█            <button data-smark='{"action":"addItem"}' title='Insert phone number'>➕ </button>
█        </li>
█    </ul>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- simple_list_autodisable_css {{{ --> {% endraw %}
{% capture simple_list_autodisable_css
%}/* Hide list bullets */
{{""}}#myForm$$ ul li {
    list-style-type: none !important;
}
/* Make disabled buttons more evident: */
{{""}}#myForm$$ :disabled {
    opacity: 0.4;
}{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="simple_list_autodisable"
    htmlSource=simple_list_autodisable
    cssSource=simple_list_autodisable_css
    selected="preview"
    showEditor=true
    tests=false
%}

👉 Notice that the `🧹` and `➖` buttons get disabled then the list has only
one item (at the beginning or after removing enough items to reach *min_items*'
value) and the same happens with the `➕` button when the list reaches its
*max_items* limit.


### Context-Driven Keyboard Shortcuts (Hot Keys)

All *SmarkForm* triggers can be assigned a *hotkey* property to
make them accessible via keyboard shortcuts.

To trigger an action using a keyboard shortcut the user only needs to press the
*Ctrl* key and the key defined in the *hotkey* property of the trigger.

In the following example you can use the `Ctrl`+`+` and `Ctrl`+`-` combinations
to add or remove phone numbers from the list, respectively.

{% raw %} <!-- simple_list_hotkeys {{{ --> {% endraw %}
{% capture simple_list_hotkeys
%}█<button data-smark='{"action":"removeItem", "context":"phones", "target":"*", "hotkey":"Delete", "preserve_non_empty":true}' title='Remove unused fields'>🧹</button>
█<button data-smark='{"action":"removeItem", "context":"phones", "hotkey":"-", "preserve_non_empty":true}' title='Remove phone number'>➖</button>
█<button data-smark='{"action":"addItem","context":"phones", "hotkey":"+"}' title='Add phone number'>➕ </button>
█<strong data-smark="label">Phones:</strong>
█<ul data-smark='{"name": "phones", "of": "input", "sortable":true, "max_items":5}'>
█    <li class="row">
█        <label data-smark>📞 Telephone
█        <span data-smark='{"action":"position"}'>N</span>
█        </label>
█        <button data-smark='{"action":"removeItem", "hotkey":"-"}' title='Remove this phone number'>➖</button>
█        <input type="tel" data-smark>
█        <button data-smark='{"action":"addItem", "hotkey":"+"}' title='Insert phone number'>➕ </button>
█    </li>
█</ul>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- hotkeys_reveal_css {{{ --> {% endraw %}
{% capture hotkeys_reveal_css
%}/* Materialize hotkey hints from data-hotkey attribute */
{{""}}#myForm$$ [data-hotkey] {
  position: relative;
  overflow-x: visible;
}
{{""}}#myForm$$ [data-hotkey]::before {
  content: attr(data-hotkey);
  display: inline-block;
  position: absolute;
  top: 2px;
  left: 2px;
  z-index: 10;
  pointer-events: none;
  background-color: #ffd;
  color: #44f;
  outline: 1px solid lightyellow;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-family: sans-serif;
  font-size: 0.8em;
  white-space: nowrap;
  transform: scale(1.8) translate(0.1em, 0.1em);
}
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- simple_list_hotkeys_css {{{ --> {% endraw %}
{% capture simple_list_hotkeys_css
%}{{ hotkeys_reveal_css }}
{{ simple_list_autodisable_css }}
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="simple_list_hotkeys"
    htmlSource=simple_list_hotkeys
    cssSource=simple_list_hotkeys_css
    selected="preview"
    showEditor=true
    tests=false
%}

### Reveal of hot keys

If you tinkered a bit with the previous example, you may have noticed that as
soon as you press the `Ctrl` key, the related hot keys are revealed beside
corresponding buttons.

🚀 This means that **the user does not need to know every hotkeys in advance**,
but can discover them on the fly by pressing the `Ctrl` key.

For instance I bet you already discovered that you can use the `Ctrl`+`Delete`
combination to activate the `🧹` button and remove all unused phone number
fields in the list.

{: .warning :}
> For this to work, **a little CSS setup is needed** to define how the hint
> will look like.
> 
> {: .info :}
> > Hotkey hints are dynamically revealed/unrevealied by setting/removing the
> > `data-hotkey` attribute in the trigger's DOM node.
>
> {: .hint :}
> > Check the *CSS* tab of the example above to see an example of how to style
> > the hot keys hints.



### Hotkeys and context

In *SmarkForm*, hotkeys are context-aware, meaning that the same hotkey can
trigger different actions depending on the context in which the focus is.

If you dug a bit into the HTML source of the previous example, you may have
noticed that the outer `➕` and `➖` buttons have the *hotkey* property set as
well but, unlike the `🧹` button, they are not announced when pressing the
`Ctrl` key.

The reason behind this is that the value of their *hotkey* property is the same
of their inner counterparts and hotkeys are discovered from the inner focused
field to the outside, **giving preference to the innermost ones in case of
conflict**.

Let's see the same example with a few additional fields outside the list:

If you focus one of them and press the `Ctrl` key, you'll see that nothing
happens. But if you navigate to any phone number in the list (for instance by
repeatedly pressing the `Tab` key) and press the `Ctrl` key, you'll see that
now the hotkeys we defined are available again.

{% raw %} <!-- simple_list_hotkeys_with_context {{{ --> {% endraw %}
{% capture simple_list_hotkeys_with_context
%}█<p>
█    <label data-smark='{"type": "label"}'>Name:</label>
█    <input name='name' data-smark='{"type": "input"}' />
█</p>
█<p>
█    <label data-smark='{"type": "label"}'>Surname:</label>
█    <input name='surname' data-smark='{"type": "input"}' />
█</p>
{{ simple_list_hotkeys }}{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% include components/sampletabs_tpl.md
    formId="simple_list_hotkeys_with_context"
    htmlSource=simple_list_hotkeys_with_context
    cssSource=simple_list_hotkeys_css
    selected="preview"
    showEditor=true
    tests=false
%}


### Smooth navigation

As you may have already noticed in the preceding examples, *SmarkForm* provides
an intuitive interface to facilitate users effortlessly discover how to
fluently fill all the data in the form without bothering with the interface.

👉 Notice you can navigate smoothly between form fields by typing `Enter`
(forward) and `Shift`+`Enter` (backward).

So, when you finish filling a field, you can just press `Enter` to
move to the next one.

This is not only more convenient than `Tab` and `Shift`+`Tab`. More than that:
**it skips controls providing a more fluid experience** when you are just
filling data in.

{: .info :}
> In case of a textarea, use `Ctrl`+`Enter` instead, since `Enter` alone is
> used to insert a new line in the text.

Take a look to the `📝 Notes` tab of the previous example for more interesting
insights and tips.

👉 Last but not least, if you still prefer using `Tab` and `Shift`+`Tab`, in the
previous example you may have noticed that you can navigate through the outer
`🧹`, `➕` and `➖` buttons using the `Tab` key, but you cannot navigate to the
inner `➖` and `➕` buttons in every list item.

This is automatically handled by *SmarkForm* to improve User Experience:

  * Passing through all `➖` and `➕` buttons in every list item would
    have made it hard to navigate through the list.

  * *SmarkForm* detects that they have a *hotkey* defined and take them out of
    the navigation flow since the user only needs to press the `Ctrl` key to
    discover a handy alternative to activate them from the keyboard.

  * The outer ones, by contrast, are always kept in the navigation flow since
    they are outside of their actual context and their functionality may be
    required before having chance to bring the focus inside their context.
    - Put in other words: otherwise, with *min_items* set to 0, it would be
      impossible to create the first item without resorting to the mouse.


### 2nd level hotkeys

Let's recall the previous example with few personal data and a list of phones
and wrap it in a list to build a simple phonebook.

As we've learned, we can use "+" and "-" hotkeys to add or remove entries in
our phonebook without causing any conflict. When the user presses the `Ctrl`
key the proper hotkeys are revealed depending on the context of the current
focus.

🤔 But now let's say you filled in the last phone number in the current entry
and you want to add a new contact to the phonebook without turning to the
mouse. **You cannot reach the outer `➕` button to add a new contact because
its hotkey is the same as the inner `➕` button to add a new phone number.**

🚀 For this kind of situations, *SmarkForm* provides a *2nd level hotkey
access*:

👉 Just combine the `Alt` key with the `Ctrl` key and the hotkeys in
their nearest level will be automatically inhibited allowing those in the next
higher level to reveal.

Try it in the following example:

{% raw %} <!-- 2nd_level_hotkeys_html {{{ --> {% endraw %}
{% capture 2nd_level_hotkeys_html
%}█<div data-smark='{"type": "list", "name": "phonelist", "sortable": true}'>
█    <fieldset>
█        <legend>
█            <span data-smark='{"action":"removeItem", "hotkey":"-"}' title='Delete this phonebook entry' style='cursor:pointer'>[➖]</span>
█            <strong>
█                Contact
█                <span data-smark='{"action":"position"}'>N</span>
█            </strong>
█        </legend>{{
         simple_list_hotkeys_with_context | replace: "█", "█        "
}}█    </fieldset>
█</div>
█<p style="text-align: right; margin-top: 1em">
█    <b>Total entries:</b>
█    <span data-smark='{"action":"count", "context": "phonelist"}'>M</span>
█</p>
█<button
█    data-smark='{"action":"addItem","context":"phonelist","hotkey":"+"}'
█    style="float: right; margin-top: 1em"
█>➕ Add Contact</button>
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- 2nd_level_hotkeys_tests {{{ --> {% endraw %}
{% capture 2nd_level_hotkeys_tests %}
export default async ({ page, expect, id, helpers }) => {
    const root = helpers.root(page, id);
    await expect(root).toBeVisible();
    
    // Check that both inputs exist
    const nameFld = page.locator('input[name="name"]');
    const surnameFld = page.locator('input[name="surname"]');
    const addPhoneBtn = page.locator('button[title="Add phone number"]');
    // const phoneFields = page.locator('input[type="tel"]');
    const editorFld = page.locator('textarea[data-smark]');
    
    await expect(nameFld).toBeVisible();
    
    // Fill name and surname fields:
    await nameFld.fill('John');
    await surnameFld.fill('Doe');

    // Add a phone field to the list (it will get ghe focus)
    await addPhoneBtn.click();

    // Fill in
    await page.keyboard.type('1234567890');

    // Use Shift+Enter to navigate back to the first phone filed
    await page.keyboard.down('Shift'); 
    await page.keyboard.press('Enter');
    await page.keyboard.up('Shift'); 

    // Fill in the first phone field
    await page.keyboard.type('0987654321');


    // Check the propper hotkey hints got revealed
    // -------------------------------------------

    // Get locators:
    const removeEmptyBtn = page.getByRole('button', { name: '🧹' }).nth(0);
    const removeLastBtn = page.getByRole('button', { name: '➖' }).nth(0);
    const appendItemBtn = page.getByRole('button', { name: '➕' }).nth(0);
    const removeItemBtn1 = page.getByRole('button', { name: '➖' }).nth(1);
    const addItemBtn1 = page.getByRole('button', { name: '➕' }).nth(1);
    const removeItemBtn2 = page.getByRole('button', { name: '➖' }).nth(2);
    const addItemBtn2 = page.getByRole('button', { name: '➕' }).nth(2);
    const addContactBtn = page.getByRole('button', { name: '➕ Add Contact' })

    // Function to read the hotkey hint content (if displayed)
    async function readHotkeyHint(locator) {
        const box = await locator.boundingBox();
        const x = box.x + box.width / 2;
        const y = box.y + box.height / 2;
        return await page.evaluate(({x, y}) => {
            const element = document.elementFromPoint(x, y);
            const beforeStyle = window.getComputedStyle(element, '::before');
            if (beforeStyle.display === 'none' || beforeStyle.content === '') return null;
            return element.getAttribute('data-hotkey') || null;
        }, {x, y}); 
    }

    // Reveal 1st level hotkey hints by pressing and holding Control
    await page.keyboard.down('Control');

    // Check 1st level hotkey hints
    expect(await readHotkeyHint(removeEmptyBtn)).toBe('Delete');
    expect(await readHotkeyHint(removeLastBtn)).toBe(null);
    expect(await readHotkeyHint(appendItemBtn)).toBe(null);
    expect(await readHotkeyHint(addItemBtn1)).toBe('+');
    expect(await readHotkeyHint(addItemBtn2)).toBe(null);
    expect(await readHotkeyHint(removeItemBtn1)).toBe('-');
    expect(await readHotkeyHint(removeItemBtn2)).toBe(null);
    expect(await readHotkeyHint(addContactBtn)).toBe(null);

    // Reveal 2nd level hotkey hints by also pressing Alt
    await page.keyboard.down('Alt');

    expect(await readHotkeyHint(removeEmptyBtn)).toBe(null);
    expect(await readHotkeyHint(removeLastBtn)).toBe(null);
    expect(await readHotkeyHint(appendItemBtn)).toBe(null);
    expect(await readHotkeyHint(addItemBtn1)).toBe(null);
    expect(await readHotkeyHint(addItemBtn2)).toBe(null);
    expect(await readHotkeyHint(removeItemBtn1)).toBe(null);
    expect(await readHotkeyHint(removeItemBtn2)).toBe(null);
    expect(await readHotkeyHint(addContactBtn)).toBe('+');

    // Return to 1st level hotkeys by releasing Alt
    await page.keyboard.up('Alt');

    // Check hotkey hints reverted to 1st level
    expect(await readHotkeyHint(removeEmptyBtn)).toBe('Delete');
    expect(await readHotkeyHint(removeLastBtn)).toBe(null);
    expect(await readHotkeyHint(appendItemBtn)).toBe(null);
    expect(await readHotkeyHint(addItemBtn1)).toBe('+');
    expect(await readHotkeyHint(addItemBtn2)).toBe(null);
    expect(await readHotkeyHint(removeItemBtn1)).toBe('-');
    expect(await readHotkeyHint(removeItemBtn2)).toBe(null);
    expect(await readHotkeyHint(addContactBtn)).toBe(null);

    // (Here Control key is sitll hold)
   
    // Use 'Control' + '+' to add another phone field in between
    await page.keyboard.press('+');

    // Release 'Control' key (end hotkeys functionality)
    await page.keyboard.up('Control');

    // Check all hotkey revealing are gone
    expect(await readHotkeyHint(removeEmptyBtn)).toBe(null);
    expect(await readHotkeyHint(removeLastBtn)).toBe(null);
    expect(await readHotkeyHint(appendItemBtn)).toBe(null);
    expect(await readHotkeyHint(addItemBtn1)).toBe(null);
    expect(await readHotkeyHint(addItemBtn2)).toBe(null);
    expect(await readHotkeyHint(removeItemBtn1)).toBe(null);
    expect(await readHotkeyHint(removeItemBtn2)).toBe(null);
    expect(await readHotkeyHint(addContactBtn)).toBe(null);

    // Fill in the phone number
    await page.keyboard.type('1122334455');
   
    // Add another phone field to the end of the list (it will get ghe focus)
    await addPhoneBtn.click();

    // Fil in
    await page.keyboard.type('6677889900');
   
    // Export the data
    const data = await page.evaluate(async() => {
        return await myForm.export();
    });

    // Verify the exported data
    const expectedData = {
        phonelist: [
            {
                name: 'John',
                surname: 'Doe',
                phones: [
                    '0987654321',
                    '1122334455',
                    '1234567890',
                    '6677889900'
                ]
            }
        ]
    };
    expect(data).toEqual(expectedData);

};
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% include components/sampletabs_tpl.md
    formId="2nd_level_hotkeys"
    htmlSource=2nd_level_hotkeys_html
    cssSource=simple_list_hotkeys_css
    selected="preview"
    showEditor=true
    tests=2nd_level_hotkeys_tests
%}


### Hidden actions


As we already learned, *SmarkForm* hotkeys are defined over trigger components
so, to define a hotkey to perform some action, we need to place a trigger
component that calls that action somewhere in the form.

{: .info :}
> This aligns well with the *SmarkForm* philosophy of providing a consistent
> functionality no matter the device or input method used. For instance, if you
> use a touch device, you will hardly use the keyboard, let alone a hotkey. But
> you will always be able to tap the button to perform the action.

Nevertheless there are exceptions where hotkeys can be convenient but flooding
the form with triggers for, maybe non essential, actions would make the form
cluttered more than needed.

👉 This is the case of the `➖` and `➕` buttons surrounding every phone number
field in the previous examples which allowed to cherry pick the position where
to remove or add a new phone: For small devices would be enough with the
general  `➖` and `➕` buttons that removes or adds a phone number from/to the
end of the list.

💡 In this scenario **we can use CSS to hide the triggers** while keeping them
accessible through their hotkeys.

{: .warning :}
> Keep in mind that if, [like in our examples](#reveal-of-hot-keys), you use a
> `::before` (or `::after`) pseudo-element to show the hotkey hint, you
> shouldn't use a property that completely removes it from the DOM, like
> `display: none;`, since it will also prevent the `::before` or `::after`
> pseudo-element from appearing too.
> 
> {: .hint :}
> > Better use `visibility: hidden;` or `opacity: 0;` to hide the button
> > and `width: 0px;` and/or `height: 0px;` as needed to prevent them from
> > taking space in the layout.


{% raw %} <!-- hidden_actions_css {{{ --> {% endraw %}
{% capture hidden_actions_css
%}
{{""}}#myForm$$ li.row button[data-smark] {
    visibility: hidden;
    width: 0px;
    pointer-events: none;
}
{{""}}#myForm$$ li.row button[data-smark]::before {
    visibility: visible;
}
{{ simple_list_hotkeys_css }}
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% include components/sampletabs_tpl.md
    formId="hidden_actions"
    htmlSource=2nd_level_hotkeys_html
    cssSource=hidden_actions_css
    selected="preview"
    tests=false
%}

This is just a simple trick and not any new *SmarkForm* feature, but it is
worth to mention it here since it helps to build smoother and cleaner forms.

If you try to fill the former example you'll notice that, when hitting the
`Ctrl` key, the "+" and "-" hotkey hints are shown beside the position of the,
now hidden, `➕` and `➖` buttons.

...And, at the same time, the ones still visible in the outer context will
allow touch device users to add or remove phone numbers even only to/from the
end of the list.


### Animations

Since *SmarkForm is markup agnostic, it does not provide any built-in animation
feature since it is an entirely design concern.

Nevertheless, you can use event handlers to add or remove CSS classes that can
be managed through CSS transitions.

{: .warning :}
> The following example code is legacy.
> 
> It relies on legacy *addItem* and *removeItem* events that will be deprecated
> in favour of more clear beforeAction_addItem, afterAction_addItem,
> beforeAction_removeItem and afterAction_removeItem events in the future.
>
> But it still works and is a good example of how to use CSS transitions with
> *SmarkForm*.

🚀 Notice that we don't need to implement the animations for each list. In the
following example there are two nested lists and all item additions and
removals are animated the same way.

{% raw %} <!-- capture animations_css {{{ --> {% endraw %}
{% capture animations_css %}
.animated_item {
    transform: translateX(-100%); /* Start off-screen to the left */
    opacity: 0; /* Optional: Start invisible for smoother effect */
    /* Transition for removal effect */
    transition: 
        transform 200ms ease-out,
        opacity 200ms ease-out;
}

.animated_item.ongoing {
    transform: translateX(0); /* End at original position */
    opacity: 1; /* Optional: Fully visible */
    transition: 
        transform 200ms ease-in,
        opacity 200ms ease-in;
}

{{ hidden_actions_css }}{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture animations_js {{{ --> {% endraw %}
{% capture animations_js %}
const delay = ms=>new Promise(resolve=>setTimeout(resolve, ms));
{{""}}myForm.onAll("afterRender", async function(ev) {
    if (ev.context.parent?.options.type !== "list") return; /* Only for list items */
    const item = ev.context.targetNode;
    item.classList.add("animated_item");
    await delay(1); /* Important: Allow DOM to update */
    item.classList.add("ongoing");
});
{{""}}myForm.onAll("beforeUnrender", async function(ev) {
    if (ev.context.parent?.options.type !== "list") return; /* Only for list items */
    const item = ev.context.targetNode;
    item.classList.remove("ongoing");
    /* Await for transition to be finished before item removal: */
    await delay(150);
});{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% include components/sampletabs_tpl.md
    formId="animations"
    htmlSource=2nd_level_hotkeys_html
    cssSource=animations_css
    jsSource=animations_js
    selected="preview"
    tests=false
%}

In this example we listen to the `afterRender` event to add the `animated_item`
class so that we hde them through CSS.

{: .info :}
> Of course we could have added the *animated_item* class directly in the HTML
> source, but this way we ensure that it is only applied when the form is
> actually enhanced. Allowing for smooth degradation in case of JS being
> disabled.

Then we wait for a moment to allow the DOM to update and add the `ongoing`
class when the item is added and remove it before the item is removed.


### Smart value coercion

{: .warning :}
> Section still under construction...


{% include components/sampletabs_tpl.md
    formId="smart_value_coercion"
    htmlSource=smart_value_coercion
    selected="preview"
    tests=false
%}



### Dynamic Dropdown Options

{: .warning :}
> Section still under construction...

In this example, we'll illustrate how to create dropdown menus with dynamic options. This is particularly useful for forms that need to load options based on user input or external data sources.


{% include components/sampletabs_tpl.md
    formId="dynamic_dropdown"
    htmlSource=dynamic_dropdown
    selected="preview"
    tests=false
%}




## Random Examples

Here are some random examples to showcase the flexibility of SmarkForm and how
it can be used to create various types of forms or even more complex interfaces
with different functionalities.

### Simple Calculator

The following example implements a simple calculator with just single input
field and several buttons triggering the *import* action over that field with
the *data* property accordingly set.

It leverages the *singleton* pattern to avoid specifying the context for every
button. Then a very simple JavaScript code makes the rest...

{% raw %} <!-- calculator {{{ --> {% endraw %}
{% capture calculator %}
<div class="calculator" data-smark='{"type": "input", "name": "display"}'>
    <!-- Using singleton pattern here allows us to avoid specifying the context for every button -->
    <input
        data-smark
        type="text"
        class="display"
        value="0"
        pattern="[0-9+\-*\/\(\).]+"
    >
    <div class="buttons">
        <button
            data-smark='{"action": "import", "data": "C", "hotkey": "c"}'
            class="clear"
        >C</button>
        <button
            data-smark='{"action": "import", "data": "("}'
        >(</button>
        <button
            data-smark='{"action": "import", "data": ")"}'
        >)</button>
        <button
            data-smark='{"action": "import", "data": "/", "hotkey": "/"}'
            class="operator"
        >÷</button>
        <button
            data-smark='{"action": "import", "data": "7"}'
        >7</button>
        <button
            data-smark='{"action": "import", "data": "8"}'
        >8</button>
        <button
            data-smark='{"action": "import", "data": "9"}'
        >9</button>
        <button
            data-smark='{"action": "import", "data": "*", "hotkey": "*"}'
            class="operator"
        >×</button>
        <button
            data-smark='{"action": "import", "data": "4"}'
        >4</button>
        <button
            data-smark='{"action": "import", "data": "5"}'
        >5</button>
        <button
            data-smark='{"action": "import", "data": "6"}'
        >6</button>
        <button
            data-smark='{"action": "import", "data": "-", "hotkey": "-"}'
            class="operator"
        >-</button>
        <button
            data-smark='{"action": "import", "data": "1"}'
        >1</button>
        <button
            data-smark='{"action": "import", "data": "2"}'
        >2</button>
        <button
            data-smark='{"action": "import", "data": "3"}'
        >3</button>
        <button
            data-smark='{"action": "import", "data": "+", "hotkey": "+"}'
            class="operator"
        >+</button>
        <button
            data-smark='{"action": "import", "data": "0"}'
        >0</button>
        <button
            data-smark='{"action": "import", "data": "."}'
        >.</button>
        <button
            data-smark='{"action": "import", "data": "Del"}'
        >←</button>
        <button
            data-smark='{"action": "import", "data": "=", "hotkey": "Enter"}'
            class="equals"
        >=</button>
    </div>
</div>
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- calculatorStyles_css {{{ --> {% endraw %}
{% capture calculatorStyles_css %}
{{""}}#myForm$$ .calculator {
    background-color: #333;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    width: 300px;
}
{{""}}#myForm$$ .display {
    width: 100%;
    box-sizing: border-box;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    font-size: 24px;
    text-align: right;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
{{""}}#myForm$$ .display:invalid {
    background-color: #fcc;
}
{{""}}#myForm$$ .buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 5px;
}
{{""}}#myForm$$ button {
    padding: 15px;
    font-size: 18px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #555;
    color: white;
    transition: background-color 0.2s;
}
{{""}}#myForm$$ button:hover {
    background-color: #777;
}
{{""}}#myForm$$ .operator {
    background-color: #f9a825;
}
{{""}}#myForm$$ .operator:hover {
    background-color: #ffb300;
}
{{""}}#myForm$$ .equals {
    background-color: #4caf50;
}
{{""}}#myForm$$ .equals:hover {
    background-color: #66bb6a;
}
{{""}}#myForm$$ .clear {
    background-color: #d32f2f;
}
{{""}}#myForm$$ .clear:hover {
    background-color: #ef5350;
}
{{ hotkeys_reveal_css }}
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- calculator_css {{{ --> {% endraw %}
{% capture calculator_css %}
{{ calculatorStyles_css }}
{{ hotkeys_reveal_css }}
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- calculator_js {{{ --> {% endraw %}
{% capture calculator_js %}

const invalidChars = /[^0-9+\-*\/().]+/g;

myForm.on("BeforeAction_import", async (ev)=>{
    const prevValue = await ev.context.export();
    const key = ev.data;
    switch (key) {
        case "C":
            ev.data = "0"; /* Clear display */
            break;
        case "Del":
            ev.data = prevValue.slice(0, -1) || "0"; /* Remove last character */
            break;
        case "=":
            try {
                /* Evaluate expression */
                const sanitized = prevValue.replace(invalidChars, '');
                ev.data = eval(sanitized);
            } catch (e) {
                alert("Invalid expression");
                ev.preventDefault(); /* Keep existing data */
            }
            break;
        default:
            if (prevValue.trim() === "0") {
                ev.data = key; /* Replace 0 with new input */
            } else {
                ev.data = prevValue + key; /* Append to existing value */
            };
    };
});{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes %}
👉 The code in this example is listening to all *import* actions in the whole
form.

This isn't an issue for this simple example. But if we had other fields in
the form (unless they were intended to be additional calculators) would be
affected too.

In that case, we could have attached the listener directly to the *display*
field like this:

```javascript
myForm.onRendered(()=>{
    /* Now display field is rendered */
    const display = myForm.find("/display");
    display.onLocal("BeforeAction_import", async (ev)=>{
        /* ... */
    });
});
```

👉 Using `.on()`or `.onLocal()` here is indifferent since inputs have no
children.

...But in case of forms (or lists of forms) using `.on()` would have lead to
intercept every "BeforeAcction_import" event in it **or its children** while
.onLocal() will only intercept those triggered by the form itself.  Not from
any of its descendants.

{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="calculator"
    htmlSource=calculator
    jsSource=calculator_js
    cssSource=calculator_css
    notes=notes
    selected="preview"
    tests=false
%}

{: .hint :}
> Notice that this calculator has *the power superpower* for free:
> 
> Expressions like `2**10` are valid, so you can calculate any power.

👉 A single event handler over the *onAfterAction_import* does all the magic by
intercepting the new value and appending it to the current one except for the
few special cases like `C`, `Del` and `=` where the value is handled
accordingly.

Check the *JS* tab to see the little JavaScript code that does the job.

Don't miss the *Notes* tab too for some additional insights.


👌 The best thing is that you can either use the calculator buttons or directly
type in the input field: Every time you use a button, the *import* action will
bring the focus back to the input field so you can continue typing.


### Calculator (UX improved)

The UX feeling of the previous example isn't perfect since it was intended to
be a very simple implementation.

Let's handle the keydown event too and notice the so little effort is needed to
reach a perfect UX.

{% raw %} <!-- supercalculator {{{ --> {% endraw %}
{% capture supercalculator %}
<div class="calculator" data-smark='{"type": "input", "name": "display"}'>
    <!-- Using singleton pattern here allows us to avoid specifying the context for every button -->
    <input
        data-smark
        type="text"
        class="display"
        value="0"
        pattern="[0-9+\-*\/\(\).]+"
    >
    <div class="buttons">
        <button
            data-smark='{"action": "import", "data": "C"}'
            class="clear"
        >C</button>
        <button
            data-smark='{"action": "import", "data": "("}'
        >(</button>
        <button
            data-smark='{"action": "import", "data": ")"}'
        >)</button>
        <button
            data-smark='{"action": "import", "data": "/"}'
            class="operator"
        >÷</button>
        <button
            data-smark='{"action": "import", "data": "7"}'
        >7</button>
        <button
            data-smark='{"action": "import", "data": "8"}'
        >8</button>
        <button
            data-smark='{"action": "import", "data": "9"}'
        >9</button>
        <button
            data-smark='{"action": "import", "data": "*"}'
            class="operator"
        >×</button>
        <button
            data-smark='{"action": "import", "data": "4"}'
        >4</button>
        <button
            data-smark='{"action": "import", "data": "5"}'
        >5</button>
        <button
            data-smark='{"action": "import", "data": "6"}'
        >6</button>
        <button
            data-smark='{"action": "import", "data": "-"}'
            class="operator"
        >-</button>
        <button
            data-smark='{"action": "import", "data": "1"}'
        >1</button>
        <button
            data-smark='{"action": "import", "data": "2"}'
        >2</button>
        <button
            data-smark='{"action": "import", "data": "3"}'
        >3</button>
        <button
            data-smark='{"action": "import", "data": "+"}'
            class="operator"
        >+</button>
        <button
            data-smark='{"action": "import", "data": "0"}'
        >0</button>
        <button
            data-smark='{"action": "import", "data": "."}'
        >.</button>
        <button
            data-smark='{"action": "import", "data": "Backspace"}'
        >←</button>
        <button
            data-smark='{"action": "import", "data": "="}'
            class="equals"
        >=</button>
    </div>
</div>
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- supercalculator_js {{{ --> {% endraw %}
{% capture supercalculator_js %}

var invalidChars = /[^0-9+\-*\/().]+/g;

function updateDisplay(prevValue, key) {
    switch (key.toLowerCase()) {
        case "c":
        case "delete":
            return "0"; /* Clear display */
            break;
        case "backspace":
            return prevValue.slice(0, -1) || "0"; /* Remove last character */
            break;
        case "=":
        case "enter": /* Keyboard enter key */
            try {
                /* Evaluate expression */
                const sanitized = prevValue.replaceAll(invalidChars, '');
                return eval(sanitized);
            } catch (e) {
                return "Error!";
            }
            break;
        default:
            if (!! key.match(invalidChars)) {
                return prevValue; /* Keep existing data */
            };
            if (prevValue.replace(/[0\s]+/, "") === "") {
                return key; /* Replace 0 with new input */
            };
            return prevValue + key; /* Append to existing value */
    };
};

myForm.on("BeforeAction_import", async (ev)=>{
    const prevValue = await ev.context.export();
    const key = ev.data;
    ev.data = updateDisplay(prevValue, key);
});

myForm.on("keydown", async (ev)=>{
    const prevValue = await ev.context.export();
    const key = ev.originalEvent.key;
    ev.preventDefault();
    const data = updateDisplay(prevValue, key);
    await ev.context.import(data);
});{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- supercalculator_css {{{ --> {% endraw %}
{% capture supercalculator_css %}
{{""}}#myForm$$ .calculator input.display  {
    caret-color: transparent; /* Hide caret */
}
{{ calculatorStyles_css }}
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes %}

🕵️ It's off-topic but worth to mention the trick of doing `!!
key.match(invalidChars))` instead of `invalidChars.test(key)` is not arbitrary
since *invalidChars* is a regex with the global flag set, which makes it
suitable for 'String.replaceAll()'.

With `test()`, the internal *lastIndex* property won't be reset making it to
fail after first usage.

The `!!` bit is just stylistic to note we want to evaluate the result of
`.match()` as a boolean.

{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="supercalculator"
    htmlSource=supercalculator
    jsSource=supercalculator_js
    cssSource=supercalculator_css
    notes=notes
    selected="preview"
    tests=false
%}

In this example we no longer need to define hotkeys since we are directly
listening to all keydown events.

If you check the *JS* tab you'll see that we extracted the key processing logic
to a function called `updateDisplay()` that receives thwo arguments
(*prevValue* and *key*) to calculate the new value of the display.

It returns null for invalid keystrokes and can report the "Error!" condition
directly to the display (like a real calculator) since it will be cleared with
the next keystroke (no matter which event it comes from).

Then the *BeforeAction_import* event handler just calls that function and sets
the *ev.data* property with its result.

The *keydown* event handler does call the `updateDisplay()` function but:

  * It takes the key from the original keydown event.
  * Calls the `.preventDefault()` method to avoid the keystroke effectively
    reaching the display.
  * Programmatically triggers the *import* action over the display with the
    new value calculated.

{: .hint :}
> Since now all keyboard strokes are processed by to `updateDisplay()`
> function, this allows us to define handy aliases which will feel more natural
> in a PC keyboard for some keys like:
>
>   * `Enter` as an alias for `=`
>   * `Delete` as an alias for `C`
> 
>  In the case of the formerly named `Del` key, we just renamed it to
>  `Backspace` to match the real key since `Del` was just a random name to void
>  using en Emojii (←) as a key name.

We also added a little CSS rule to hide the caret in the input field since the
display will no longer be directly editable.


## Conclusion

{: .warning :}
> Section still under construction...

We hope these examples have given you a good overview of what SmarkForm can do. By leveraging the power of markup-driven forms, SmarkForm simplifies the creation of interactive and intuitive forms, allowing you to focus on your application's business logic. Feel free to experiment with these examples and adapt them to suit your specific needs.

For more detailed information and documentation, please refer to the other sections of this manual. If you have any questions or need further assistance, don't hesitate to reach out to the SmarkForm community.

Happy form building!


