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
    * [Item duplication and closure state](#item-duplication-and-closure-state)
    * [A note on empty values](#a-note-on-empty-values)
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
        * [Scalar-to-array list coercion](#scalar-to-array-list-coercion)
        * [Type coercion for scalar fields](#type-coercion-for-scalar-fields)
    * [Dynamic Dropdown Options](#dynamic-dropdown-options)
* [Random Examples](#random-examples)
    * [Simple Calculator](#simple-calculator)
    * [Calculator (UX improved)](#calculator-ux-improved)
    * [Team Event Planner](#team-event-planner)
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

{% raw %} <!-- basic_form_tests {{{ --> {% endraw %}
{% capture basic_form_tests %}
export default async ({ page, expect, id, root, readField, writeField }) => {
    await expect(root).toBeVisible();

    // Check that clicking everywhere in the form focuses its first field.
    await page.getByRole('heading', { name: 'Model details' }).click();
    await expect(page.getByRole('textbox', { name: 'Model Name:' })).toBeFocused();

    await page.keyboard.type('Yaris');
    await page.keyboard.press('Enter');
    expect(await readField('model')).toStrictEqual("Yaris");

    const typeSelector = page.getByLabel('Type:');
    await expect(typeSelector).toBeFocused();
    await typeSelector.selectOption('Motorcycle');
    expect(await readField('type')).toStrictEqual("Motorcycle");

    await page.keyboard.press('Enter'); // Navigate to next field
    await page.keyboard.type('First row');
    await page.keyboard.press('Enter'); // Should not navigate outside textarea
    await page.keyboard.type('Second row');
    expect(await readField('longdesc')).toStrictEqual("First row\nSecond row");

    await page.keyboard.down('Control'); 
    await page.keyboard.press('Enter'); 
    await page.keyboard.up('Control'); // Now we should be out of textarea

    expect(await readField('seats')).toStrictEqual(null);
    await page.keyboard.type('35');
    await page.keyboard.press('Enter'); 
    expect(await readField('seats')).toStrictEqual(35);

    expect(await readField('side')).toStrictEqual(null);
    await page.keyboard.press('ArrowRight'); // Select "Right"
    expect(await readField('side')).toStrictEqual("right");
    await page.keyboard.press('Delete'); // Unselect
    expect(await readField('side')).toStrictEqual(null);
    await page.keyboard.press('Enter'); 

    expect(await readField('color'), 'Exports null by default').toStrictEqual(null);
    await writeField('color', '#ff0000'); // Browser color picker UX may differ
    expect(await readField('color'), 'Can be set').toStrictEqual('#ff0000');
    await writeField('color', '#fea'); // Browser color picker UX may differ
    expect(await readField('color'), 'Accepts short format').toStrictEqual('#ffeeaa');
    await page.keyboard.press('Delete'); 
    expect(await readField('color'), 'Can be cleared').toStrictEqual(null);


    // Export the data
    const data = await page.evaluate(async () => {
        return await myForm.export();
    });

    // Verify the exported data
    const expectedData = {
      "model": "Yaris",
      "type": "Motorcycle",
      "longdesc": "First row\nSecond row",
      "seats": 35,
      "side": null,
      "color": null
    };

    expect(data).toEqual(expectedData);

};
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="basic_form"
    htmlSource=basic_form
    notes=notes
    selected="preview"
    showEditor=true
    tests=basic_form_tests
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

{% raw %} <!-- nested_forms_tests {{{ --> {% endraw %}
{% capture nested_forms_tests %}
export default async ({ page, expect, id, root, readField, writeField }) => {
    await expect(root).toBeVisible();


    expect(await readField('safety')).toStrictEqual({
        "airbag": false,
        "abs": false,
        "esp": false,
        "tc": false
    });

    await page.getByRole('checkbox', { name: 'Airbag.' }).click();
    expect(await readField('safety')).toStrictEqual({
        "airbag": true,
        "abs": false,
        "esp": false,
        "tc": false
    });

    await page.getByRole('checkbox', { name: 'ABS.' }).click();
    expect(await readField('safety')).toStrictEqual({
        "airbag": true,
        "abs": true,
        "esp": false,
        "tc": false
    });

    await page.getByRole('checkbox', { name: 'ESP.' }).click();
    expect(await readField('safety')).toStrictEqual({
        "airbag": true,
        "abs": true,
        "esp": true,
        "tc": false
    });

    await page.getByRole('checkbox', { name: 'TC.' }).click();
    expect(await readField('safety')).toStrictEqual({
        "airbag": true,
        "abs": true,
        "esp": true,
        "tc": true
    });

    // Export the data
    const data = await page.evaluate(async() => {
        return await myForm.export();
    });

    // Verify the exported data
    const expectedData = {
      "model": "",
      "type": null,
      "longdesc": "",
      "seats": null,
      "side": null,
      "color": null,
      "safety": {
        "airbag": true,
        "abs": true,
        "esp": true,
        "tc": true
      }
    };

    expect(data).toEqual(expectedData);

};
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="nested_forms"
    htmlSource=nested_forms
    selected="preview"
    showEditor=true
    tests=nested_forms_tests
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

{% raw %} <!-- simple_list_tests {{{ --> {% endraw %}
{% capture simple_list_tests %}
export default async ({ page, expect, id, root, readField, writeField }) => {
    await expect(root).toBeVisible();

    const removeItemBtn = page.getByRole('button', { name: '➖' }).nth(0);
    const addItemBtn = page.getByRole('button', { name: '➕' }).nth(0);

    expect(
        (await readField('phones')).length
        , "Form with (default) min_items = 1 renders with one item by default"
    ).toStrictEqual(1);

    expect(removeItemBtn
        , "removeItem is disabled at min_items"
    ).toBeDisabled();

    // Try removing an item via direct API call
    // (Shouldn't work neither throw errors)
    await page.evaluate(() => {
        myForm.find('/phones').removeItem();
    });

    expect(
        (await readField('phones')).length
        , "min_items is enforced"
    ).toStrictEqual(1);

    await addItemBtn.click();
    expect(
        (await readField('phones')).length
        , "Adding an item works"
    ).toStrictEqual(2);


    await page.keyboard.type('1234567890');
    await page.keyboard.press('Enter');
    expect(
        await readField('/phones')
        , "The targetted item was the last one"
    ).toEqual(['', '1234567890']);


    await removeItemBtn.click();
    expect(
        (await readField('/phones')).length
        , "Removing an item works"
    ).toStrictEqual(1);

    expect(
        (await readField('/phones'))
        , "The remaining item is the first one (still empty)"
    ).toEqual(['']);

    await page.keyboard.type('0987654321');

    expect(
        (await readField('/'))
        , "Whole form contains expected data"
    ).toEqual({ phones: ['0987654321'] });

};
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="simple_list"
    htmlSource=simple_list
    notes=notes
    selected="preview"
    showEditor=true
    tests=simple_list_tests
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

{% raw %} <!-- simple_list_singleton_tests {{{ --> {% endraw %}
{% capture simple_list_singleton_tests %}
export default async ({ page, expect, id, root, readField, writeField }) => {
    await expect(root).toBeVisible();


    // Helper to count actual phone fields in the list
    // Relying on phones field export won't work here as we have
    // exportEmpties = false
    // Should use DOM inspection to "see" the actual fields inside the list!!
    const countPhones = async () => (await page.evaluate(() => {
        const container = myForm.find('/phones').targetNode
        return container.querySelectorAll('input[type=tel]').length;
    }));

    // Helper to get labels text
    const getLabels = async () => (await page.evaluate(() => {
        const container = myForm.find('/phones').targetNode
        const labels = [...container.querySelectorAll('label')]
            .map(
                label => label.textContent
                    .trim()
                    .replace(/\s+/g, " "
                )
            )
            .join("/")
        ;
        return labels;
    }));


    const removeUnusedItemsBtn = page.getByRole('button', { name: '🧹' }).nth(0);
    const removeItemBtn = page.getByRole('button', { name: '➖' }).nth(0);
    const addItemBtn = page.getByRole('button', { name: '➕' }).nth(0);

    expect(
        await countPhones()
        , "List with min_items = 0 renders with no items"
    ).toStrictEqual(0);

    expect(removeItemBtn
        , "Remove item button is disabled at min_items"
    ).toBeDisabled();

    expect(removeUnusedItemsBtn
        , "Remove all empty items button is disabled at min_items"
    ).toBeDisabled();


    // Try removing an item via direct API call
    // (Shouldn't work neither throw errors)
    await page.evaluate(() => {
        myForm.find('/phones').removeItem();
    });

    expect(
        await countPhones()
        , "min_items is enforced"
    ).toStrictEqual(0);

    await addItemBtn.click();

    expect(
        await countPhones()
        , "Adding an item works"
    ).toStrictEqual(1);


    expect(
        (await readField('phones')).length
        , "Phone field not exported when empty"
    ).toStrictEqual(0);


    await page.keyboard.type('1234567890');
    await page.keyboard.press('Enter');
    expect(
        await readField('/phones')
        , "Phones list contains the typed number and nothing more"
    ).toEqual(['1234567890']);


    await removeItemBtn.click();
    expect(
        await countPhones()
        , "Removing an item works"
    ).toStrictEqual(0);

    expect(removeItemBtn
        , "removeItem gets disabled when min_items is reached"
    ).toBeDisabled();

    expect(
        (await readField('/phones'))
        , "The list is empty again"
    ).toEqual([]);


    // Fill the list again:
    await addItemBtn.click();  // 1st item
    await page.keyboard.type('0987654321');
    await addItemBtn.click();  // 2nd item
    await addItemBtn.click();  // 3nd item
    await page.keyboard.type('1234567890');
    await addItemBtn.click();  // 4th item
    await addItemBtn.click();  // 5th item
    expect(addItemBtn
        , "addItem gets disabled when max_items is reached"
    ).toBeDisabled();


    // Try adding an item via direct API call
    // (Shouldn't work neither throw errors)
    await page.evaluate(() => {
        myForm.find('/phones').addItem();
    });

    expect(
        await countPhones()
        , "max_items is enforced"
    ).toStrictEqual(5);

    expect(
        (await readField('/phones')).length
        , "Only non-empty items are exported when exportEmpties = false"
    ).toStrictEqual(2);


    expect(
        await getLabels()
        , "Labels reflect item positions"
    ).toStrictEqual("📞 Telephone 1/📞 Telephone 2/📞 Telephone 3/📞 Telephone 4/📞 Telephone 5");

    await removeUnusedItemsBtn.click(); // Clean up empty items

    expect(
        await getLabels()
        , "Labels still correctly reflect item positions after cleanup"
    ).toStrictEqual("📞 Telephone 1/📞 Telephone 2");

    expect(
        await countPhones()
        , "Removing unused items works"
    ).toStrictEqual(2);


    expect(
        (await readField('/'))
        , "Whole form contains expected data"
    ).toEqual({ phones: ['0987654321', '1234567890'] });

};
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}



{% include components/sampletabs_tpl.md
    formId="simple_list_singleton"
    htmlSource=simple_list_singleton
    cssSource=simple_list_singleton_css
    notes=notes
    selected="preview"
    showEditor=true
    tests=simple_list_singleton_tests
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


{% capture demoValue -%}
{
    "model": "Toyota Yaris",
    "type": "Car",
    "longdesc": "A reliable compact car perfect for city driving.",
    "seats": 5,
    "side": "left",
    "color": "#3a7bd5",
    "safety": {
        "airbag": true,
        "abs": true,
        "esp": false,
        "tc": false
    }
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="nested_forms_full"
    htmlSource=nested_forms
    selected="preview"
    demoValue=demoValue
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

{: .hint :}
> The `➖` and `➕` buttons in the examples below use *hotkeys*. Press and hold
> the `Ctrl` key to see which ones are available. Check the *CSS* tab to see
> the reveal setup, or jump to [Context-Driven Keyboard
> Shortcuts](#context-driven-keyboard-shortcuts-hot-keys) to learn more.

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

{% capture demoValue -%}
{
    "schedule": [
        {
            "start": "09:00:00",
            "end": "13:00:00"
        },
        {
            "start": "14:00:00",
            "end": "18:00:00"
        }
    ]
}
{%- endcapture %}

{% capture schedule_list_css %}{{ hotkeys_reveal_css }}{% endcapture %}

{% include components/sampletabs_tpl.md
    formId="schedule_list"
    htmlSource=schedule_list
    cssSource=schedule_list_css
    notes=include.notes
    selected="preview"
    demoValue=demoValue
    showEditor=true
    tests=false
%}


...This is fine for a simple case, and leaves the door open for easily
increasing the number of intervals allowed in the schedule.

But it could look kind of messy if you need to introduce several schedules that may have different number of intervals.

👉 Let's imagine a hotel wanting to manage the scheduling of all the services it offers...


{% raw %} <!-- schedule_table {{{ --> {% endraw %}
{% capture schedule_table
%}█<div class="schtbl" data-smark='{"type":"form","name":"schedules"}'>
█    <div class="schedule-row" data-smark='{"type":"list","name":"rcpt_schedule","min_items":0,"max_items":3,"exportEmpties":false,"value":[{}]}'>
█        <strong data-smark='{"role":"header"}'>🛎️ Reception:</strong>
█        <span class='time_slot' data-smark='{"role":"empty_list"}'>(Closed)</span>
█        <span class='time_slot'>
█            <span class='time_from'>From <input class='small' data-smark type='time' name='start'></span>
█            <span class='time_to'>to <input class='small' data-smark type='time' name='end'></span>
█        </span>
█        <span data-smark='{"role":"footer"}'>
█            <button data-smark='{"action":"removeItem","hotkey":"-"}' title='Less intervals'>➖</button>
█            <button data-smark='{"action":"addItem","hotkey":"+"}' title='More intervals'>➕</button>
█        </span>
█    </div>
█    <div class="schedule-row" data-smark='{"type":"list","name":"bar_schedule","min_items":0,"max_items":3,"exportEmpties":false,"value":[{}]}'>
█        <strong data-smark='{"role":"header"}'>🍸 Bar</strong>
█        <span class='time_slot' data-smark='{"role":"empty_list"}'>(Closed)</span>
█        <span class='time_slot'>
█            <span class='time_from'>From <input class='small' data-smark type='time' name='start'></span>
█            <span class='time_to'>to <input class='small' data-smark type='time' name='end'></span>
█        </span>
█        <span data-smark='{"role":"footer"}'>
█            <button data-smark='{"action":"removeItem","hotkey":"-"}' title='Less intervals'>➖</button>
█            <button data-smark='{"action":"addItem","hotkey":"+"}' title='More intervals'>➕</button>
█        </span>
█    </div>
█    <div class="schedule-row" data-smark='{"type":"list","name":"restaurant_schedule","min_items":0,"max_items":3,"exportEmpties":false,"value":[{}]}'>
█        <strong data-smark='{"role":"header"}'>🍽️ Restaurant:</strong>
█        <span class='time_slot' data-smark='{"role":"empty_list"}'>(Closed)</span>
█        <span class='time_slot'>
█            <span class='time_from'>From <input class='small' data-smark type='time' name='start'></span>
█            <span class='time_to'>to <input class='small' data-smark type='time' name='end'></span>
█        </span>
█        <span data-smark='{"role":"footer"}'>
█            <button data-smark='{"action":"removeItem","hotkey":"-"}' title='Less intervals'>➖</button>
█            <button data-smark='{"action":"addItem","hotkey":"+"}' title='More intervals'>➕</button>
█        </span>
█    </div>
█    <div class="schedule-row" data-smark='{"type":"list","name":"pool_schedule","min_items":0,"max_items":3,"exportEmpties":false,"value":[{}]}'>
█        <strong data-smark='{"role":"header"}'>🏊 Pool:</strong>
█        <span class='time_slot' data-smark='{"role":"empty_list"}'>(Closed)</span>
█        <span class='time_slot'>
█            <span class='time_from'>From <input class='small' data-smark type='time' name='start'></span>
█            <span class='time_to'>to <input class='small' data-smark type='time' name='end'></span>
█        </span>
█        <span data-smark='{"role":"footer"}'>
█            <button data-smark='{"action":"removeItem","hotkey":"-"}' title='Less intervals'>➖</button>
█            <button data-smark='{"action":"addItem","hotkey":"+"}' title='More intervals'>➕</button>
█        </span>
█    </div>
█</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- schedule_table_css {{{ --> {% endraw %}
{% capture schedule_table_css
%}
{{""}}#myForm$$ .schtbl {
    display: flex;
    flex-direction: column;
    gap: 0.1em;
}
{{""}}#myForm$$ .schedule-row {
    display: grid;
    grid-template-columns: 10em 1fr auto;
    align-items: start;
    gap: 0.25em 0.5em;
    padding: 0.2em 0.4em;
    border-radius: 0.3em;
}
{{""}}#myForm$$ .schedule-row:nth-child(even) {
    background-color: rgba(128, 128, 128, 0.08);
}
{{""}}#myForm$$ .schedule-row > [data-role="header"] {
    grid-column: 1;
    grid-row: 1;
    padding-top: 0.3em;
}
{{""}}#myForm$$ .schedule-row > .time_slot {
    grid-column: 2;
}
{{""}}#myForm$$ .schedule-row > [data-role="empty_list"] {
    padding-right: 5em;
}
{{""}}#myForm$$ .schedule-row > [data-role="footer"] {
    grid-column: 3;
    grid-row: 1 / -1;
    align-self: center;
    white-space: nowrap;
}
{{""}}#myForm$$ .time_slot {
    display: flex;
    flex-wrap: wrap;
    gap: 0.15em 0.4em;
    align-items: center;
    justify-content: flex-end;
}
{{""}}#myForm$$ .time_slot input.small{
    max-width: 5.5em;
}
{{""}}#myForm$$ .time_from,
{{""}}#myForm$$ .time_to {
    display: flex;
    align-items: center;
    gap: 0.2em;
    white-space: nowrap;
}
{{""}}#myForm$$ .period-dates {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25em 1.5em;
    align-items: baseline;
    margin: 0.3em 0;
    justify-content: flex-end;
}
{{""}}#myForm$$ .period-date {
    white-space: nowrap;
}
{{""}}@media (max-width: 30em) {
{{""}}  #myForm$$ .schedule-row {
{{""}}      grid-template-columns: 1fr auto;
{{""}}  }
{{""}}  #myForm$$ .schedule-row > [data-role="header"] {
{{""}}      grid-column: 1;
{{""}}      grid-row: 1;
{{""}}      padding-top: 0;
{{""}}  }
{{""}}  #myForm$$ .schedule-row > .time_slot,
{{""}}  #myForm$$ .schedule-row > [data-role="empty_list"] {
{{""}}      grid-column: 1;
{{""}}      padding-left: 0.5em;
{{""}}      text-align: right;
{{""}}  }
{{""}}  #myForm$$ .schedule-row > [data-role="footer"] {
{{""}}      grid-column: 2;
{{""}}      grid-row: 2 / -1;
{{""}}  }
{{""}}}
{{ hotkeys_reveal_css }}
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes %}
👉 Here we replaced the original `<table>` layout with CSS grid to prevent
  horizontal scrollbars when multiple intervals are added:
  * Each schedule list (`.schedule-row`) is a CSS grid with three columns:
    `10em label | 1fr slots | auto controls`.
  * Additional intervals stack **vertically** in the middle column instead of
    widening the row.
  * The footer role holds the ➖/➕ buttons, which span all slot rows via
    `grid-row: 1 / -1` so they stay right-aligned regardless of item count.

👉 The `header`, `footer` and `empty_list` *template roles* are still used, but
the `placeholder` had been removed since the grid handles column sizing without
needing DOM filler elements.

{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
    "schedules": {
        "rcpt_schedule": [
            {
                "start": "00:00:00",
                "end": "23:59:00"
            }
        ],
        "bar_schedule": [
            {
                "start": "11:00:00",
                "end": "23:00:00"
            }
        ],
        "restaurant_schedule": [
            {
                "start": "07:30:00",
                "end": "10:30:00"
            },
            {
                "start": "13:00:00",
                "end": "15:30:00"
            },
            {
                "start": "19:00:00",
                "end": "22:00:00"
            }
        ],
        "pool_schedule": [
            {
                "start": "09:00:00",
                "end": "20:00:00"
            }
        ]
    }
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="schedule_table"
    htmlSource=schedule_table
    cssSource=schedule_table_css
    notes=notes
    selected="preview"
    demoValue=demoValue
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
        <p class='period-dates'>
          <span class='period-date'><label data-smark>Start Date:</label>&nbsp;<input data-smark type='date' name='start_date'></span>
          <span class='period-date'><label data-smark>End Date:</label>&nbsp;<input data-smark type='date' name='end_date'></span>
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

{% capture demoValue -%}
{
    "periods": [
        {
            "start_date": "2025-04-01",
            "end_date": "2025-09-30",
            "schedules": {
                "rcpt_schedule": [
                    {
                        "start": "07:00:00",
                        "end": "23:00:00"
                    }
                ],
                "bar_schedule": [
                    {
                        "start": "10:00:00",
                        "end": "23:00:00"
                    }
                ],
                "restaurant_schedule": [
                    {
                        "start": "07:00:00",
                        "end": "10:30:00"
                    },
                    {
                        "start": "13:00:00",
                        "end": "15:30:00"
                    },
                    {
                        "start": "19:00:00",
                        "end": "22:00:00"
                    }
                ],
                "pool_schedule": [
                    {
                        "start": "09:00:00",
                        "end": "20:00:00"
                    }
                ]
            }
        }
    ]
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="nested_schedule_table"
    htmlSource=nested_schedule_table
    cssSource=schedule_table_css
    notes=notes
    selected="preview"
    demoValue=demoValue
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



### Item duplication and closure state

Adding similar items to a list of complex and configurable subforms —like the
periods list in our example— can be tedious if users have to re-enter all
fields each time.

On the other hand, if we need to allow the list to be empty, just setting
*min_items* to 0 will cause that no item is presented by default which leads to
poor usability.

To address these issues we can do the following:

  * **To ease adding new items:** Add a custom *addItem* trigger using the
    *source* property to duplicate an entry and just edit what’s different. To do
    so:
    - Use the *source* property in that *addItem* trigger so that the
      *import* action will be automatically called with its value passed as its
      *target* after the new item being rendered.
    - I.e. with `data-smark='{"source":".-1"}`, the new item will be prefilled
      with the data from its previous item in the list.

  * **To support empty lists without hurting usability:**
    - Allow the list to be empty by setting its *min_items* to 0.
    - Set the lists's *value* property to an array with one empty item (we can
      use an empty object to allow item defaults).
    - I.e. `data-smark='{"min_items":0,"value": [{}]}'`.

Below is the same example as before, but with an additional `✨` button to
*duplicate* the data from the previous one and the before mentioned tweaks to
allow the list to be empty emptied even showing one initial item for better
usability by default:

{% raw %} <!-- nested_schedule_table_duplicable {{{ --> {% endraw %}
{% capture nested_schedule_table_duplicable
%}<h2>🗓️ Periods:</h2>
<div data-smark='{"type":"list","name":"periods","sortable":true,"exportEmpties":true,"min_items":0,"value":[{}]}'>
    <fieldset data-smark='{"role": "empty_list"}' style='text-align: center'>🔒 Out of Service</fieldset>
    <fieldset style='margin-top: 1em'>
        <legend>Period
            <span data-smark='{"action":"position"}'>N</span>
            of
            <span data-smark='{"action":"count"}'>M</span>
        </legend>
        <button
            data-smark='{"action":"addItem","source":".-1","hotkey":"d"}'
            title='Duplicate this period'
            style="float: right"
        >✨</button>
        <button
            data-smark='{"action":"removeItem","hotkey":"-"}'
            title='Remove this period'
            style="float: right"
        >➖</button>
        <p class='period-dates'>
          <span class='period-date'><label data-smark>Start Date:</label>&nbsp;<input data-smark type='date' name='start_date'></span>
          <span class='period-date'><label data-smark>End Date:</label>&nbsp;<input data-smark type='date' name='end_date'></span>
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

{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes %}

👉 Customize a period by adding different schedules for each service.

👉 Use the `✨` button (or press `Ctrl+d`) to duplicate that period and notice
   the newly created one is prefilled with the same data.

👉 Remove all pereiods and notice the `🔒 Out of Service` message shown when
   the list is empty.

{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- nested_schedule_table_duplicable_tests {{{ --> {% endraw %}
{% capture nested_schedule_table_duplicable_tests %}
export default async ({ page, expect, id, root, readField, writeField}) => {
    await expect(root).toBeVisible();

    // Helper to count actual periods in the list:
    const countPeriods = async () => (await readField('/periods')).length;

    const removePeriodBtn = page.getByTitle('Remove this period').nth(0);
    const duplicatePeriodBtn = page.getByRole('button', { name: '✨' }).nth(0);

    // Interval buttons are located by title (inside the list as role="footer"):
    const addIntervalBtns = page.getByTitle('More intervals');
    const removeIntervalBtns = page.getByTitle('Less intervals');

    expect(
        await countPeriods()
        , "List with an item in its value renders with that value no matter smaller min_items value"
    ).toStrictEqual(1);

    expect(removePeriodBtn
        , "Remove period button is enabled (min_items=0 allows removal)"
    ).toBeEnabled();

    // Fill in dates so we can verify duplication (not just reset) later:
    await writeField('/periods/0/start_date', '2025-04-01');
    await writeField('/periods/0/end_date', '2025-09-30');

    // Each schedule already has 1 interval from "value":[{}].
    // Add one more interval to reception (1→2):
    await addIntervalBtns.nth(0).click();

    // Add two more intervals to bar (1→3, reaching max_items=3):
    await addIntervalBtns.nth(1).click();
    await addIntervalBtns.nth(1).click();

    // Add two more intervals to restaurant (1→3, reaching max_items=3):
    await addIntervalBtns.nth(2).click();
    await addIntervalBtns.nth(2).click();


    // Bar is at max_items=3 (1 initial + 2 added):
    expect(addIntervalBtns.nth(1)
        , "Add interval button for bar schedule is disabled at max_items"
    ).toBeDisabled();

    // Restaurant is at max_items=3 (1 initial + 2 added):
    expect(addIntervalBtns.nth(2)
        , "Add interval button for restaurant schedule is disabled at max_items"
    ).toBeDisabled();

    // Pool still has its 1 initial interval; min_items=0 so remove is enabled:
    expect(removeIntervalBtns.nth(3)
        , "Remove interval button for pool schedule is enabled (has 1 item, min_items=0)"
    ).toBeEnabled();


    expect(
        await readField('/periods')
        , "Laying the first period out works as expected. "
        + "Note: exportEmpties:false on schedule lists strips null intervals to [],\n"
        + "so the interval count is tracked by DOM state rather than exported data."
    ).toEqual([
        {
            start_date: "2025-04-01",
            end_date: "2025-09-30",
            schedules: {
                rcpt_schedule: [],
                bar_schedule: [],
                restaurant_schedule: [],
                pool_schedule: []
            }
        }
    ]);


    await duplicatePeriodBtn.click();

    expect(
        await readField('/periods')
        , "Duplicating the period copies its data (dates are preserved, not reset)"
    ).toEqual([
        {
            start_date: "2025-04-01",
            end_date: "2025-09-30",
            schedules: {
                rcpt_schedule: [],
                bar_schedule: [],
                restaurant_schedule: [],
                pool_schedule: []
            }
        },
        {
            start_date: "2025-04-01",
            end_date: "2025-09-30",
            schedules: {
                rcpt_schedule: [],
                bar_schedule: [],
                restaurant_schedule: [],
                pool_schedule: []
            }
        }
    ]);


    // Remove all periods:
    await removePeriodBtn.click();
    await expect(root
        , "Empty list message is not shown when there are items"
    ).not.toHaveText(/Out of Service/);
    await removePeriodBtn.click();
    await expect(root
        , "Empty list message is shown when all items are removed"
    ).toHaveText(/Out of Service/);

};
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- demoValue {{{ --> {% endraw %}
{% capture demoValue -%}
{
    "periods": [
        {
            "start_date": "2025-01-01",
            "end_date": "2025-05-31",
            "schedules": {
                "rcpt_schedule": [
                    {
                        "start": "00:00:00",
                        "end": "23:59:00"
                    }
                ],
                "bar_schedule": [
                    {
                        "start": "10:00:00",
                        "end": "23:30:00"
                    }
                ],
                "restaurant_schedule": [
                    {
                        "start": "07:30:00",
                        "end": "10:30:00"
                    },
                    {
                        "start": "13:00:00",
                        "end": "15:30:00"
                    },
                    {
                        "start": "19:00:00",
                        "end": "22:00:00"
                    }
                ],
                "pool_schedule": []
            }
        },
        {
            "start_date": "2025-06-01",
            "end_date": "2025-09-30",
            "schedules": {
                "rcpt_schedule": [
                    {
                        "start": "00:00:00",
                        "end": "23:59:00"
                    }
                ],
                "bar_schedule": [
                    {
                        "start": "10:00:00",
                        "end": "23:30:00"
                    }
                ],
                "restaurant_schedule": [
                    {
                        "start": "07:30:00",
                        "end": "10:30:00"
                    },
                    {
                        "start": "13:00:00",
                        "end": "15:30:00"
                    },
                    {
                        "start": "19:00:00",
                        "end": "22:00:00"
                    }
                ],
                "pool_schedule": [
                    {
                        "start": "09:30:00",
                        "end": "19:30:00"
                    }
                ]
            }
        }
    ]
}
{%- endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="nested_schedule_table_duplicable"
    htmlSource=nested_schedule_table_duplicable
    demoValue=demoValue
    notes=notes
    cssSource=schedule_table_css
    selected="preview"
    showEditor=true
    tests=nested_schedule_table_duplicable_tests
%}


### A note on empty values

Take a look to the HTML source of the previous example and pay attention to
where and how the *exportEntries* property is used in the lists:

  * **For the *periods* list** we set *exportEmpties* to true, overidding its
    default value (false).
    - This way, if a period is added (intentional), it gets exported even if
      not filled.
    - This is because the user may be saving his work to continue later or just
      mean there is a period but we don't know its data yet.

  * **For the schedules lists** we set *exportEmpties* to false (necessary to
    prevent inheriting the true value we just set). This way:
    - When a period is added, all schedules are layed out with their default
      value (one empty time interval ready to be filled).
    - If the user leaves any unfilled (because of being inappropriate) and
      neglects removing it, it will be just swallowed when exporting the form
      data.
    - This way, when importing the exported data (or if item is duplicated with
      the `✨` button), the unfilled intervals are correctly shown as
      "(Closed)".


## Import and Export Data

Exporting and importing data in SmarkForm cannot be easier. 

Let's recall the example showing the full HTML source in the [Deeply nested
forms](#deeply-nested-forms) section:


{% capture demoValue -%}
{
    "model": "Toyota Yaris",
    "type": "Car",
    "longdesc": "A reliable compact car perfect for city driving.",
    "seats": 5,
    "side": "left",
    "color": "#3a7bd5",
    "safety": {
        "airbag": true,
        "abs": true,
        "esp": false,
        "tc": false
    }
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="nested_forms_bis"
    htmlSource=nested_forms
    selected="preview"
    demoValue=demoValue
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


{% capture demoValue -%}
{
    "model": "Toyota Yaris",
    "type": "Car",
    "longdesc": "A reliable compact car perfect for city driving.",
    "seats": 5,
    "side": "left",
    "color": "#3a7bd5",
    "safety": {
        "airbag": true,
        "abs": true,
        "esp": false,
        "tc": false
    }
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="nested_forms_with_load_save"
    htmlSource=nested_forms_with_load_save
    jsSource=form_export_example_import_export_js
    notes=notes
    selected="preview"
    demoValue=demoValue
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

So far we have seen how to export and import form data using event handlers.
But often all you really need is to **submit the form** — either to an HTTP
endpoint or to the user's email client.

*SmarkForm* enhances native browser form submission so that correctly-typed
values (as collected by its *export* mechanism) are what get sent — not the
raw strings that native form fields would produce.

All standard HTML5 submission attributes are supported: `action`, `method`,
`enctype`, `target`, and their per-button overrides (`formaction`, `formmethod`,
etc.). For non-JSON encodings the data is flattened into name/value pairs and
submitted via a temporary `<form>` element; for `enctype="application/json"` it
is sent via `fetch()`.

The example below shows a simple contact form submitted via `mailto:`. When the
**📧 Send Email** button is clicked, the user's email client opens pre-populated
with the form data:

{% raw %} <!-- submit_form_example {{{ --> {% endraw %}
{% capture submit_form_example
%}█<form id="myForm$$"
    action="mailto:you@example.com?subject=Contact%20Form%20Submission"
    method="post"
    enctype="text/plain"
>
█<p>
█    <label data-smark>Abstract</label>
█    <input data-smark type="text"
█      name="name"
█      placeholder="Brief summary or description"
█    />
█</p>
█<p>
█    <label data-smark>Reason for contacting us:</label>
█    <select data-smark name="reason" required>
█      <option value="" disabled selected>— Choose —</option>
█      <option value="question">Question</option>
█      <option value="support">Support / Technical help</option>
█      <option value="feedback">Suggestion or feedback</option>
█      <option value="complaint">Complaint</option>
█      <option value="praise">Praise / Thank you</option>
█      <option value="business">Business / Sales inquiry</option>
█      <option value="other">Something else</option>
█    </select>
█</p>
█<p>
█    <label data-smark>Message:</label>
█    <textarea data-smark name="message"></textarea>
█</p>
█<p>
█    <button data-smark='{"action":"submit"}'>📧 Send Email</button>
█</p>
█</form>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- submit_form_example_notes {{{ --> {% endraw %}
{% capture submit_form_example_notes %}
👉 Clicking **📧 Send Email** opens the user's email client with:

  * **To:** `test@example.com`
  * **Subject:** `Contact Form Submission`
  * **Body:** the Text-encoded form fields.

✏️ **To use a real address:**
  * Head to the `🗒️ HTML` tab and check the 📝 checkbox.
  * Edit the email in the `action` attribute of the `<form>` element.
  * Click the `▶️ Run` button to reload the `👁️ Preview` tab with the updated code.
  * Fill the form and click the **📧 Send Email** button.

🌐 **To submit to an HTTP endpoint** instead, point `action` at your server URL
and propperly adjust the `method` attribute.

📦 **For JSON APIs**, additionally set `enctype="application/json"` — SmarkForm
will send the data as a JSON payload via `fetch()`.

{: .warning :}
> `enctype="application/json"` is **not** compatible with `mailto:` actions.
> Use the default (URL-encoded) encoding for `mailto:`.

{: .info :}
> You can also intercept or extend the submission via *SmarkForm* events:
> `BeforeAction_submit` (fired before sending — you can `preventDefault()` to
> cancel) and `AfterAction_submit` (fired after the data has been sent).
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% include components/sampletabs_tpl.md
    formId="submit_form"
    htmlSource=submit_form_example
    notes=submit_form_example_notes
    selected="preview"
    tests=false
%}

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

{% capture demoValue -%}
{
    "phones": [
        "+1 555 867 5309",
        "+1 555 234 5678"
    ]
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="simple_list_autodisable"
    htmlSource=simple_list_autodisable
    cssSource=simple_list_autodisable_css
    selected="preview"
    demoValue=demoValue
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

{% raw %} <!-- simple_list_hotkeys_css {{{ --> {% endraw %}
{% capture simple_list_hotkeys_css
%}{{ hotkeys_reveal_css }}
{{ simple_list_autodisable_css }}
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
    "phones": [
        "+1 555 867 5309",
        "+1 555 234 5678"
    ]
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="simple_list_hotkeys"
    htmlSource=simple_list_hotkeys
    cssSource=simple_list_hotkeys_css
    selected="preview"
    demoValue=demoValue
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


{% capture demoValue -%}
{
    "name": "John",
    "surname": "Doe",
    "phones": [
        "+1 555 867 5309",
        "+1 555 234 5678"
    ]
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="simple_list_hotkeys_with_context"
    htmlSource=simple_list_hotkeys_with_context
    cssSource=simple_list_hotkeys_css
    selected="preview"
    demoValue=demoValue
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
export default async ({ page, expect, id, root }) => {
    await expect(root).toBeVisible();
    
    // Check that both inputs exist
    const nameFld = page.locator('input[name="name"]');
    const surnameFld = page.locator('input[name="surname"]');
    const addPhoneBtn = page.locator('button[title="Add phone number"]');
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

*SmarkForm* is markup-agnostic and deliberately provides no built-in animation
engine — transitions are a design concern that belongs to your CSS.

The technique is straightforward: use SmarkForm's lifecycle events to add and
remove CSS classes on list items, and let CSS `transition` do the rest.

* **`afterRender`** fires after a new item's DOM node has been inserted.
  Add an initial CSS class that hides or offsets the element, then — after a
  minimal delay to let the browser paint the initial state — add a second class
  that transitions it to its final visible position.

* **`beforeUnrender`** fires before an item is removed from the DOM.
  Remove the "visible" class and return a `Promise` that resolves after the
  transition duration. *SmarkForm* awaits that promise, so the element stays in
  the document long enough for the exit animation to complete.

🚀 Because both handlers filter by `ev.context.parent?.options.type`, a single
pair of listeners covers every list in the form — including nested ones — with
no per-list wiring required.

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

{% raw %} <!-- animations_notes {{{ --> {% endraw %}
{% capture animations_notes %}
**Why add `animated_item` via JavaScript instead of directly in the HTML?**

If the class were baked into the template, every item would start hidden even
when JavaScript is unavailable. Adding it through the `afterRender` handler
ensures the animation only kicks in when JS is active, so the form degrades
gracefully without it.

---

**Why the 1 ms delay in `afterRender`?**

CSS transitions only fire when a property *changes* after the element is already
in the document. If both `animated_item` and `ongoing` were added in the same
task, the browser would never observe the initial hidden state and the transition
would not play. The `await delay(1)` yields control for one event-loop tick,
giving the rendering engine a chance to paint the initial state before `ongoing`
is applied.

---

**Why `await delay(150)` in `beforeUnrender`?**

*SmarkForm* awaits the return value of `beforeUnrender` handlers before
detaching the element from the DOM. By returning a promise that resolves after
150 ms (matching the CSS `transition-duration`), we keep the element visible
just long enough for the exit animation to finish.

---

**Applying this globally vs. per-list**

`myForm.onAll()` listens on *all* components in the form. The guard
`ev.context.parent?.options.type !== "list"` skips anything that is not a
direct child of a list — subforms, labels, buttons, etc. The result is that any
list added anywhere in the form hierarchy is automatically animated without
further wiring.
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% include components/sampletabs_tpl.md
    formId="animations"
    htmlSource=2nd_level_hotkeys_html
    cssSource=animations_css
    jsSource=animations_js
    selected="preview"
    notes=animations_notes
    tests=false
%}

The `afterRender` handler adds `animated_item` via JavaScript rather than
embedding it directly in the HTML template. This ensures the animation class is
only present when JavaScript is active, so the form degrades gracefully if JS is
disabled.

The `beforeUnrender` handler does the reverse: it removes `ongoing` and returns
a `Promise` delayed by 150 ms — matching the CSS transition duration — so
*SmarkForm* holds the element in the DOM while the exit animation plays out.


### Smart value coercion

*SmarkForm* automatically normalises imported values to match the expected type
and shape of each field. This keeps your forms resilient to data-model changes
and ensures that what you save is always clean and well-typed.

#### Scalar-to-array list coercion

When a *list* field receives a non-array value — a plain string, a number, or
an object — it automatically wraps it in a single-item array. This is
particularly useful for **model migrations**: if a field that used to hold a
single `email` string is upgraded to accept a list of `emails`, old saved data
continues to work without any transformation step.

{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes %}
👉 **Scalar-to-array coercion**: If you import a plain string instead of an
array, *SmarkForm* automatically places it in a single-item list.

  * Click **⬇️ Export**, change `["alice@example.com"]` to just
    `"alice@example.com"` in the JSON playground editor below, then click
    **⬆️ Import** — the single email is placed in the list automatically.
  * This mirrors the upgrade from a single-value field (e.g. `"email"`) to a
    list field (e.g. `"emails": [...] `).

👉 **Empty items are not exported** by default (controlled by `exportEmpties`).

  * Click **➕** to add a blank item, then **⬇️ Export** — the blank row will
    be absent from the output, keeping saved data clean.
  * Set `"exportEmpties": true` on the list to keep blank slots in the data
    (useful in draft-save workflows where you want to preserve the user's
    position in the list).

{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- smart_value_coercion {{{ --> {% endraw %}
{% capture smart_value_coercion
%}█<button data-smark='{"action":"removeItem","context":"email","preserve_non_empty":true}' title="Remove email">➖</button>
█<button data-smark='{"action":"addItem","context":"email"}' title="Add email">➕</button>
█<strong data-smark="label">Emails:</strong>
█<ul data-smark='{"type":"list","name":"email","of":"input","min_items":0}'>
█    <li data-smark='{"role":"empty_list"}'>(No emails on record)</li>
█    <li><input type="email" data-smark placeholder="name@example.com"></li>
█</ul>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- smart_value_coercion_css {{{ --> {% endraw %}
{% capture smart_value_coercion_css
%}{{""}}#myForm$$ ul {
    list-style: none;
    padding-left: 0;
}{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- smart_value_coercion_tests {{{ --> {% endraw %}
{% capture smart_value_coercion_tests %}
export default async ({ page, expect, id, root, readField, writeField }) => {
    await expect(root).toBeVisible();

    // Scalar-to-array coercion
    await writeField('email', 'bob@example.com');
    expect(
        await readField('email'),
        'Scalar string is coerced to a single-item array'
    ).toEqual(['bob@example.com']);

    // Array import works as expected
    await writeField('email', ['carol@example.com', 'dave@example.com']);
    expect(
        await readField('email'),
        'Array import works normally'
    ).toEqual(['carol@example.com', 'dave@example.com']);

    // exportEmpties = false: blank items are not exported
    await page.evaluate(() => myForm.find('/email').addItem());
    expect(
        await readField('email'),
        'Blank item is not exported (exportEmpties defaults to false)'
    ).toEqual(['carol@example.com', 'dave@example.com']);

    // Filling the new blank item makes it appear in the export
    const inputs = page.locator(`#myForm-${id} input[type=email]`);
    await inputs.last().fill('eve@example.com');
    expect(
        await readField('email'),
        'Filled item IS exported'
    ).toEqual(['carol@example.com', 'dave@example.com', 'eve@example.com']);
};
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
    "email": "alice@example.com" // Old data saved before upgrading to an array
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="smart_value_coercion"
    htmlSource=smart_value_coercion
    cssSource=smart_value_coercion_css
    notes=notes
    selected="preview"
    showEditor=true
    demoValue=demoValue
    tests=smart_value_coercion_tests
%}


#### Type coercion for scalar fields

Fields with a specific HTML type automatically coerce values on both import and
export:

  * `<input type="number">` exports a JavaScript **number** (not a string),
    and accepts string representations on import (e.g. `"28"` → `28`).
  * `<input type="date">` exports an ISO 8601 string (`YYYY-MM-DD`), and
    accepts compact strings (`YYYYMMDD`) and `Date` objects on import.
  * `<input type="time">` exports `HH:MM:SS` and accepts `HH:MM` on import.
  * Any field exports **`null`** when empty, to explicitly signal "unknown or
    indifferent" rather than an empty string.

Adding `{"encoding":"json"}` to any `<input>` or `<textarea>` enables JSON
round-trips: the field stores the value internally as a JSON string but
*exports* it as a parsed JavaScript value (object, array, number, or `null`).

{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes %}
👉 **Number coercion**: The *Age* field is `<input type="number">`.

  * *SmarkForm* always exports its value as a JavaScript **number**, not a
    string.
  * It also accepts string representations on import — try clicking **⬇️
    Export**, changing `"age": 28` to `"age": "28"` (quoted) in the JSON
    playground editor, and clicking **⬆️ Import**: the exported result will be
    `"age": 28` (unquoted) again.

👉 **Date normalization**: The *Date of Birth* field is `<input type="date">`.

  * *SmarkForm* always exports an ISO 8601 string (`YYYY-MM-DD`).
  * It accepts compact strings (`YYYYMMDD`) and `Date` objects on import.
    Try clicking **⬇️ Export**, changing `"dob": "1996-03-15"` to
    `"dob": "19960315"` in the JSON playground editor, and clicking **⬆️
    Import** — it will be normalised to `"1996-03-15"` on the next export.

👉 **JSON encoding**: The *Metadata* textarea has `{"encoding":"json"}`.

  * On import, an object or array is serialised to JSON text (pretty-printed
    in textareas for readability).
  * On export, the textarea content is parsed back into a JavaScript value —
    your saved data contains a **real object**, not a raw JSON string.
  * Works with any valid JSON: objects, arrays, numbers, booleans, and `null`.

{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- type_coercion {{{ --> {% endraw %}
{% capture type_coercion
%}█<p>
█    <label data-smark>Name:</label>
█    <input type="text" name="name" data-smark>
█</p>
█<p>
█    <label data-smark>Age:</label>
█    <input type="number" name="age" min="0" max="150" data-smark>
█</p>
█<p>
█    <label data-smark>Date of Birth:</label>
█    <input type="date" name="dob" data-smark>
█</p>
█<p>
█    <label data-smark>Metadata (JSON):</label>
█    <textarea name="metadata" data-smark='{"encoding":"json"}'></textarea>
█</p>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- type_coercion_tests {{{ --> {% endraw %}
{% capture type_coercion_tests %}
export default async ({ page, expect, id, root, readField, writeField }) => {
    await expect(root).toBeVisible();

    // Number coercion: string input → number output
    await writeField('age', '35');
    expect(
        await readField('age'),
        'Number field coerces string to number on export'
    ).toStrictEqual(35);

    // Empty number field exports null
    await writeField('age', null);
    expect(
        await readField('age'),
        'Number field exports null when empty'
    ).toStrictEqual(null);

    // Date normalization: compact string → ISO format
    await writeField('dob', '20000101');
    expect(
        await readField('dob'),
        'Date field normalizes compact strings to ISO format'
    ).toStrictEqual('2000-01-01');

    // Empty date field exports null
    await writeField('dob', null);
    expect(
        await readField('dob'),
        'Date field exports null when empty'
    ).toStrictEqual(null);

    // JSON encoding: object round-trips through textarea
    const metaObj = { subscribed: true, tier: 'premium' };
    await writeField('metadata', metaObj);
    expect(
        await readField('metadata'),
        'JSON-encoded textarea round-trips objects correctly'
    ).toEqual(metaObj);

    // JSON encoding: null clears the textarea
    await writeField('metadata', null);
    expect(
        await readField('metadata'),
        'JSON-encoded textarea exports null when cleared'
    ).toStrictEqual(null);
};
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
    "name": "Alice",
    "age": "28",  // String instead of number, will be coerced to a number
    "dob": "19960315", // Correctly parsed as date.
    "metadata": { // Will be exported/imported as JSON
                  // If invalid exports null (catch that from validation)
        "subscribed": true,
        "tier": "premium"
    }
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="type_coercion"
    htmlSource=type_coercion
    notes=notes
    selected="preview"
    showEditor=true
    demoValue=demoValue
    tests=type_coercion_tests
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


### Team Event Planner

This is the same demo shown on the [🔗 landing page]({{ "/" | relative_url }}) — a
compact form that showcases several SmarkForm features at once: a nested
subform, a sortable variable-length list, context-driven hotkeys, and date/time
coercion.

Use the JSON editor below to inspect the exported data as you interact with the
form, or import your own JSON to pre-populate it.

{% raw %} <!-- event_planner_html {{{ --> {% endraw %}
{% capture event_planner_html
%}█<div class="ep">
█    <p>
█        <label data-smark>📋 Event:</label>
█        <input data-smark name="title" type="text" placeholder="e.g. Sprint Review">
█    </p>
█    <p>
█        <label data-smark>📅 Date:</label>
█        <input data-smark name="date" type="date">
█    </p>
█    <p>
█        <label data-smark>⏰ Time:</label>
█        <input data-smark name="time" type="time">
█    </p>
█    <fieldset data-smark='{"type":"form","name":"organizer"}'>
█        <legend data-smark='label'>👤 Organizer</legend>
█        <p>
█            <label data-smark>Name:</label>
█            <input data-smark name="name" type="text">
█        </p>
█        <p>
█            <label data-smark>Email:</label>
█            <input data-smark name="email" type="email">
█        </p>
█    </fieldset>
█    <div class="ep-list">
█        <button data-smark='{"action":"removeItem","context":"attendees","hotkey":"Delete","preserve_non_empty":true}' title='Remove empty slots'>🧹</button>
█        <button data-smark='{"action":"addItem","context":"attendees","hotkey":"+"}' title='Add attendee'>➕</button>
█        <strong data-smark='label'>👥 Attendees:</strong>
█        <ul data-smark='{"type":"list","name":"attendees","of":"input","sortable":true,"exportEmpties":false}'>
█            <li>
█                <span data-smark='{"action":"position"}'>N</span>.
█                <input data-smark type="text" placeholder="Name">
█                <button data-smark='{"action":"removeItem","hotkey":"-"}' title='Remove'>➖</button>
█                <button data-smark='{"action":"addItem","hotkey":"+"}' title='Insert here'>➕</button>
█            </li>
█        </ul>
█    </div>
█    <p class="ep-hint">💡 Hold <kbd>Ctrl</kbd> to reveal shortcuts</p>
█</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- event_planner_css {{{ --> {% endraw %}
{% capture event_planner_css
%}{{""}}#myForm$$ .ep {
    display: flex;
    flex-direction: column;
    gap: 0.35em;
    max-width: 460px;
    font-size: 0.95em;
}
{{""}}#myForm$$ .ep p {
    display: flex;
    align-items: center;
    gap: 0.5em;
    margin: 0;
}
{{""}}#myForm$$ .ep label {
    min-width: 4.5em;
    font-weight: 500;
    white-space: nowrap;
}
{{""}}#myForm$$ .ep input {
    padding: 0.3em 0.5em;
    border: 1px solid #ccc !important;
    border-radius: 4px;
}
{{""}}#myForm$$ .ep input[type="text"],
{{""}}#myForm$$ .ep input[type="email"] {
    flex: 1;
}
{{""}}#myForm$$ .ep fieldset {
    border: 1px solid #ddd !important;
    border-radius: 6px;
    padding: 0.4em 0.8em 0.6em;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.3em;
}
{{""}}#myForm$$ .ep fieldset legend {
    font-weight: bold;
    padding: 0 0.3em;
}
{{""}}#myForm$$ .ep-list ul {
    list-style: none !important;
    padding: 0 !important;
    margin: 0.2em 0 0;
    display: flex;
    flex-direction: column;
    gap: 0.25em;
}
{{""}}#myForm$$ .ep-list ul li {
    display: flex;
    align-items: center;
    gap: 0.4em;
}
{{""}}#myForm$$ .ep-hint {
    font-size: 0.82em;
    color: #888;
    margin: 0.15em 0 0;
}
{{""}}#myForm$$ .ep-hint kbd {
    background: #f4f4f4;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 1px 4px;
}
/* Hotkey hints revealed on Ctrl press */
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
/* Attendee list item entry/exit animations */
{{""}}#myForm$$ .ep-list ul li.animated_item {
    transform: translateX(-100%);
    opacity: 0;
    transition:
        transform 200ms ease-out,
        opacity 200ms ease-out;
}
{{""}}#myForm$$ .ep-list ul li.animated_item.ongoing {
    transform: translateX(0);
    opacity: 1;
    transition:
        transform 200ms ease-in,
        opacity 200ms ease-in;
}{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- event_planner_js {{{ --> {% endraw %}
{% capture event_planner_js %}const delay = ms=>new Promise(resolve=>setTimeout(resolve, ms));
{{""}}myForm.onAll("afterRender", async function(ev) {
    if (ev.context.parent?.options.type !== "list") return;
    const item = ev.context.targetNode;
    item.classList.add("animated_item");
    await delay(1);
    item.classList.add("ongoing");
});
{{""}}myForm.onAll("beforeUnrender", async function(ev) {
    if (ev.context.parent?.options.type !== "list") return;
    const item = ev.context.targetNode;
    item.classList.remove("ongoing");
    await delay(150);
});{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- Notes {{{ --> {% endraw %}
{% capture notes %}
👉 This demo highlights several SmarkForm features at once:

  * **Nested subform**: The `organizer` fieldset is a subform — its fields are
    grouped and exported as a nested object.
  * **Sortable list**: Attendees can be dragged to reorder them. The list uses
    `exportEmpties: false` so empty slots are not exported.
  * **Context-driven hotkeys**: The `➕`/`➖` buttons inside each list item
    carry `-`/`+` hotkeys, active only when focus is within that item. The `🧹`
    button uses `Delete` as a context-wide hotkey.
  * **Date & time coercion**: The `date` and `time` inputs use SmarkForm's
    built-in type coercion — values are normalised to ISO date/time format on
    import/export.
  * **Label components**: `data-smark='label'` on non-`<label>` elements and
    bare `data-smark` on `<label>` elements wire labels to their fields
    automatically.
  * **In-form hint**: The `💡 Hold Ctrl to reveal shortcuts` text lives inside
    the form itself rather than as external documentation.
  * **Attendee animations**: Items slide in and out via `afterRender` /
    `beforeUnrender` event handlers that toggle CSS classes — no animation
    library required.

{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% capture demoValue -%}
{
    "title": "Sprint Review",
    "date": "2025-03-15",
    "time": "10:00:00",
    "organizer": {
        "name": "Alice Johnson",
        "email": "alice@example.com"
    },
    "attendees": [
        "Bob Smith",
        "Carol White",
        "Dave Brown"
    ]
}
{%- endcapture %}

{% include components/sampletabs_tpl.md
    formId="event_planner_showcase"
    htmlSource=event_planner_html
    cssSource=event_planner_css
    jsSource=event_planner_js
    notes=notes
    selected="preview"
    demoValue=demoValue
    showEditor=true
    tests=false
%}


## Conclusion

{: .warning :}
> Section still under construction...

We hope these examples have given you a good overview of what SmarkForm can do. By leveraging the power of markup-driven forms, SmarkForm simplifies the creation of interactive and intuitive forms, allowing you to focus on your application's business logic. Feel free to experiment with these examples and adapt them to suit your specific needs.

For more detailed information and documentation, please refer to the other sections of this manual. If you have any questions or need further assistance, don't hesitate to reach out to the SmarkForm community.

Happy form building!


