
{% include components/sampletabs_ctrl.md %}

{% comment %} →  Layout components:               {% endcomment %}
{% comment %}    ==================               {% endcomment %}

{% raw %} <!-- import_export_buttons_stacked {{{ --> {% endraw %}
{% capture import_export_buttons_stacked
%}#indent#<p><button
#indent#    data-smark='{"action":"export","context":"demo","target":"../editor"}'
#indent#    title="Export 'demo' subform to 'editor' textarea"
#indent#    >➡️ </button></p>
#indent#<p><button
#indent#    data-smark='{"action":"import","context":"demo","target":"../editor"}'
#indent#    title="Import 'editor' textarea contents to 'demo' subform"
#indent#    >⬅️ </button></p>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- import_export_buttons {{{ --> {% endraw %}
{% capture import_export_buttons
%}#indent#<span><button
#indent#    data-smark='{"action":"export","context":"demo","target":"../editor"}'
#indent#    title="Export 'demo' subform to 'editor' textarea"
#indent#    >⬇️ </button></span>
#indent#<span><button
#indent#    data-smark='{"action":"import","context":"demo","target":"../editor"}'
#indent#    title="Import 'editor' textarea contents to 'demo' subform"
#indent#    >⬆️ </button></span>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- load_save_buttons_stacked {{{ --> {% endraw %}
{% capture load_save_buttons_stacked
%}#indent#<p><button
#indent#    data-smark='{"action":"export"}'
#indent#    title="Export the whole form as JSON (see JS tab)"
#indent#    >💾</button></p>
#indent#<p><button
#indent#    data-smark='{"action":"import"}'
#indent#    title="Import the whole form as JSON (see JS tab)"
#indent#    >📂</button></p>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- load_save_buttons {{{ --> {% endraw %}
{% capture load_save_buttons
%}#indent#<button
#indent#    data-smark='{"action":"export"}'
#indent#    title="Export the whole form as JSON (see JS tab)"
#indent#    >💾 Save</button>
#indent#<button
#indent#    data-smark='{"action":"import"}'
#indent#    title="Import the whole form as JSON (see JS tab)"
#indent#    >📂 Load</button>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- clear_button_stacked {{{ --> {% endraw %}
{% capture clear_button_stacked
%}#indent#<p><button
#indent#    data-smark='{"action":"clear", "context":"demo"}'
#indent#    title="Clear the whole form"
#indent#    >❌</button></p>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- clear_button {{{ --> {% endraw %}
{% capture clear_button
%}#indent#<span><button
#indent#    data-smark='{"action":"clear", "context":"demo"}'
#indent#    title="Clear the whole form"
#indent#    >❌</button></span>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- json_editor {{{ --> {% endraw %}
{% capture json_editor
%}#indent#<textarea
#indent#    cols="20"
#indent#    placeholder="JSON data viewer / editor"
#indent#    data-smark='{"name":"editor","type":"input"}'
#indent#    style="resize: none; align-self: stretch; min-height: 8em; flex-grow: 1;"
#indent#></textarea>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% comment %} →  Form sources:                    {% endcomment %}
{% comment %}    =============                    {% endcomment %}

{% raw %} <!-- basic_form_source {{{ --> {% endraw %}
{% capture basic_form_source
%}#indent#<h2>Model details</h2>
#indent#<p>
#indent#    <label data-smark>Model Name:</label>
#indent#    <input type="text" name="model" data-smark />
#indent#</p>
#indent#<p>
#indent#    <label data-smark>Type:</label>
#indent#    <select name="type" data-smark='{"encoding":"json"}'>
#indent#        <option value='null'>👇 Please select...</option>
#indent#        <!-- json encoding allow us return null values -->
#indent#        <option value='"Car"'>Car</option>
#indent#        <!-- ...but now we must wrap strings in double quotes -->
#indent#        <!-- (it also gives us the ability to return objects and arrays) -->
#indent#        <option>Bicycle</option>
#indent#        <!-- ...but if we are Ok with inner text as value, we can just omit the value attribute -->
#indent#        <option>Motorcycle</option>
#indent#        <option>Van</option>
#indent#        <option>Pickup</option>
#indent#        <option>Quad</option>
#indent#        <option>Truck</option>
#indent#    </select>
#indent#</p>
#indent#<p>
#indent#    <label data-smark>Seats:</label>
#indent#    <input type="number" name="seats" min=4 max=9 data-smark />
#indent#</p>
#indent#<p>
#indent#    <label data-smark>Driving Side:</label>
#indent#    <input type="radio" name="side" value="left" data-smark /> Left
#indent#    <input type="radio" name="side" value="right" data-smark /> Right
#indent#</p>
#indent#<p>
#indent#    <label data-smark>Color:</label>
#indent#    <span data-smark='{"type":"color", "name":"color"}'>
#indent#        <input data-smark>
#indent#        <button data-smark='{"action":"clear"}' title='Indifferent or unknown' >❌ </button>
#indent#    </span>
#indent#</p>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- nested_forms_source {{{ --> {% endraw %}
{% capture nested_forms_source
%}{{ basic_form_source }}
#indent#<p data-smark='{"name":"safety","type":"form"}'>
#indent#    <label>Safety Features:</label>
#indent#    <span>
#indent#        <label><input type="checkbox" name="airbag" data-smark /> Airbag.</label>
#indent#    </span>
#indent#    &nbsp;&nbsp;
#indent#    <span>
#indent#        <label><input type="checkbox" name="abs" data-smark /> ABS.</label>
#indent#    </span>
#indent#    &nbsp;&nbsp;
#indent#    <span>
#indent#        <label><input type="checkbox" name="esp" data-smark /> ESP.</label>
#indent#    </span>
#indent#    &nbsp;&nbsp;
#indent#    <span>
#indent#        <label><input type="checkbox" name="tc" data-smark />TC.</label>
#indent#    </span>
#indent#</p>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- deeply_nested_forms_source {{{ --> {% endraw %}
{% capture deeply_nested_forms_source
%}#indent#<h2>This is the nested</h2>
#indent#<h3>Car owners</h3>
#indent#<button data-smark='{"action":"addItem","context":"employee","hotkey":"+"}' title='Nuevo empleado'>👥</button>
#indent#<label data-smark>Empleados:</label>
#indent#<div data-smark='{"type":"list","name":"employee", "min_items":0,"sortable":true, "exportEmpties":true}'>
#indent#    <div>
{{ nested_forms_source | replace: "#indent#", "#indent#        " }}
#indent#    </div>
#indent#</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- simple_list_source {{{ --> {% endraw %}
{% capture simple_list_source
%}#indent#<button data-smark='{"action":"removeItem", "context":"phones"}' title='Remove phone number'>➖</button>
#indent#<button data-smark='{"action":"addItem","context":"phones"}' title='Add phone number'>➕ </button>
#indent#<label data-smark>Phones:</label>
#indent#<div data-smark='{"type":"list", "name": "phones", "of": "input", "exportEmpties": true}'>
#indent#    <input type="tel" style="display: block">
#indent#</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- simple_list_singleton_source {{{ --> {% endraw %}
{% capture simple_list_singleton_source
%}#indent#<button data-smark='{"action":"removeItem", "context":"phones", "target":"*", "keep_non_empty":true}' title='Remove unused fields'>🧹</button>
#indent#    <button data-smark='{"action":"removeItem", "context":"phones", "keep_non_empty":true}' title='Remove phone number'>➖</button>
#indent#    <button data-smark='{"action":"addItem","context":"phones"}' title='Add phone number'>➕ </button>
#indent#    <label data-smark>Phones:</label>
#indent#    <ul data-smark='{"name": "phones", "of": "input", "sortable":true, "min_items":0, "max_items":5}'>
#indent#        <li data-smark='{"role": "empty_list"}' class="row">(None)</li>
#indent#        <li class="row">
#indent#            <label data-smark>📞 </label><input type="tel" data-smark>
#indent#            <button data-smark='{"action":"removeItem"}' title='Remove this phone number'>❌</button>
#indent#        </li>
#indent#    </ul>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- schedule_list_source {{{ --> {% endraw %}
{% capture schedule_list_source %}
            <p>
                <button data-smark='{"action":"removeItem","hotkey":"-","context":"schedule"}' title='Less intervals'>➖</button>
                <button data-smark='{"action":"addItem","hotkey":"+","context":"schedule"}' title='More intrevals'>➕</button>
                <label>Schedule:</label>
                <span data-smark='{"type":"list","name":"schedule","min_items":0,"max_items":3}'>
                    <span>
                        <input class='small' data-smark type='time' name='start'> to <input class='small' data-smark type='time' name='end'>
                    </span>
                    <span data-smark='{"role":"empty_list"}'>(Closed)</span>
                    <span data-smark='{"role":"separator"}'>, </span>
                    <span data-smark='{"role":"last_separator"}'> and </span>
                </span>
            </p>
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% comment %} →  Form compositions:               {% endcomment %}
{% comment %}    ==================               {% endcomment %}

{% raw %} <!-- basic_form {{{ --> {% endraw %}
{% capture basic_form %}<div id="myForm$$">
    <div style="display: flex; align-items:center; gap: 1em; min-width: max(100%, 450px)">
        <div data-smark='{"name":"demo"}' style="flex-grow: 1">{{
            basic_form_source
            | replace: "#indent#", "            "
        }}        </div>
        <div>
{{ import_export_buttons_stacked | replace: "#indent#", "            " }}
{{ clear_button_stacked | replace: "#indent#", "            " }}
        </div>
{{ json_editor | replace: "#indent#", "        " }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- basic_form_with_import_export {{{ --> {% endraw %}
{% capture basic_form_with_import_export %}<div id="myForm$$">
    <div style="display: flex; align-items:center; gap: 1em; min-width: max(100%, 450px)">
        <div data-smark='{"name":"demo"}' style="flex-grow: 1">{{
            basic_form_source
            | replace: "#indent#", "            "
        }}        </div>
        <div>
{{ import_export_buttons_stacked | replace: "#indent#", "            " }}
{{ load_save_buttons_stacked | replace: "#indent#", "            " }}
{{ clear_button_stacked | replace: "#indent#", "            " }}
        </div>
{{ json_editor | replace: "#indent#", "        " }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- nested_forms {{{ --> {% endraw %}
{% capture nested_forms %}<div id="myForm$$">
    <div style="display: flex; align-items:center; gap: 1em; min-width: max(100%, 450px)">
        <div data-smark='{"name":"demo"}' style="flex-grow: 1">{{
            nested_forms_source
            | replace: "#indent#", "            "
        }}    </div>
        <div>
{{ import_export_buttons_stacked | replace: "#indent#", "            " }}
{{ load_save_buttons_stacked | replace: "#indent#", "            " }}
{{ clear_button_stacked | replace: "#indent#", "            " }}
        </div>
{{ json_editor | replace: "#indent#", "        " }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- basic_form_with_local_import_export {{{ --> {% endraw %}
{% capture basic_form_with_local_import_export %}<div id="myForm$$">
    <div style="display: flex; align-items:center; gap: 1em; min-width: max(100%, 450px)">
        <div data-smark='{"name":"demo"}' style="flex-grow: 1">{{
            nested_forms_source
            | replace: "#indent#", "            "
}}            <p>
{{ load_save_buttons | replace: "#indent#", "                " }}
        </p>
        </div>
        <div>
{{ import_export_buttons_stacked | replace: "#indent#", "            " }}
{{ clear_button_stacked | replace: "#indent#", "            " }}
        </div>
{{ json_editor | replace: "#indent#", "        " }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- simple_list {{{ --> {% endraw %}
{% capture simple_list %}<div id="myForm$$">
    <div style="display: flex; align-items:center; gap: 1em; min-width: max(100%, 450px)">
        <div data-smark='{"name":"demo"}' style="flex-grow: 1">
{{ simple_list_source | replace: "#indent#", "            " }}
        </div>
        <div>
{{ import_export_buttons_stacked | replace: "#indent#", "            " }}
{{ clear_button_stacked | replace: "#indent#", "            " }}
        </div>
{{ json_editor | replace: "#indent#", "        " }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- simple_list_singleton {{{ --> {% endraw %}
{% capture simple_list_singleton %}<div id="myForm$$">
    <div style="display: flex; align-items:center; gap: 1em; min-width: max(100%, 450px)">
        <div data-smark='{"name":"demo"}' style="flex-grow: 1">
{{ simple_list_singleton_source | replace: "#indent#", "        " }}
        </div>
        <div>
{{ import_export_buttons_stacked | replace: "#indent#", "            " }}
{{ clear_button_stacked  | replace: "#indent#", "            " }}
        </div>
{{ json_editor | replace: "#indent#", "        " }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- schedule_list {{{ --> {% endraw %}
{% capture schedule_list %}<div id="myForm$$">
    <div style="display: flex; flex-direction:column; align-items:left; gap: 1em; min-width: max(100%, 450px)">
        <div data-smark='{"name":"demo"}' style="flex-grow: 1">{{
            schedule_list_source
}}
        </div>
        <div>
{{ import_export_buttons | replace: "#indent#", "            " }}
{{ clear_button | replace: "#indent#", "            " }}
        </div>
{{ json_editor | replace: "#indent#", "        " }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture context_comparsion_example {{{ --> {% endraw %}
{% capture context_comparsion_example %}<div id='myForm$$'>
    <p>
        <label data-smark>Name:</label>
        <input name='name' data-smark>
    </p>
    <p>
        <label data-smark>Surname:</label>
        <input name='surname' data-smark>
    </p>
    <table>
        <tr>
            <th>Whole Form:</th>
            <td><button data-smark='{"action":"import"}'>⬆️  Import</button></td>
            <td><button data-smark='{"action":"export"}'>⬇️  Export</button></td>
        </tr>
        <tr>
            <th>Name field:</th>
            <td><button data-smark='{"action":"import","context":"name"}'>⬆️  Import</button></td>
            <td><button data-smark='{"action":"export","context":"name"}'>⬇️  Export</button></td>
        </tr>
        <tr>
            <th>Surname field:</th>
            <td><button data-smark='{"action":"import","context":"surname"}'>⬆️  Import</button></td>
            <td><button data-smark='{"action":"export","context":"surname"}'>⬇️  Export</button></td>
        </tr>
    </table>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- deeply_nested_forms {{{ --> {% endraw %}
{% capture deeply_nested_forms %}<div id="myForm$$">
    <div style="display: grid; grid-gap: 1em;">
        <div data-smark='{"name":"demo"}' style="flex-grow: 1">
{{ deeply_nested_forms_source | replace: "#indent#", "            " }}
        </div>
        <div>
{{ import_export_buttons | replace: "#indent#", "            " }}
{{ clear_button | replace: "#indent#", "            " }}
        </div>
{{ json_editor | replace: "#indent#", "        " }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% comment %} →  Form JS controllers:             {% endcomment %}
{% comment %}    ====================             {% endcomment %}

{% raw %} <!-- capture context_comparsion_example_js {{{ --> {% endraw %}
{% capture context_comparsion_example_js %}const myForm = new SmarkForm(document.getElementById("myForm$$"));
myForm.on("BeforeAction_import", async (ev)=>{
    /* Read previous value: */
    let previous_value = await ev.context.export();
    let isObject = typeof previous_value == "object";
    if (isObject) previous_value = JSON.stringify(previous_value);
    let data = window.prompt(`Edit ${ev.context.getPath()}`, previous_value);
    if (data === null) return void ev.preventDefault();
    try {
        if (isObject) data = JSON.parse(data);
        ev.data = data;
    } catch(err) {
        alert(err.message);
        ev.preventDefault();
    };
});
myForm.on("AfterAction_export", ({context, data})=>{
    if (typeof data == "object") data = JSON.stringify(data, null, 4);
    window.alert(`Value of ${context.getPath()}: ${data}`);
});{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- form_export_example_js {{{ --> {% endraw %}
{% capture form_export_example_js %}const myForm = new SmarkForm(document.getElementById("myForm$$"));
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- form_export_example_import_export_js {{{ --> {% endraw %}
{% capture form_export_example_import_export_js %}const myForm = new SmarkForm(document.getElementById("myForm$$"));
myForm.on("BeforeAction_import", async (ev)=>{
    if (ev.context.getPath() !== "/") return; /* Only for root */
    /* Read previous value: */
    let previous_value = await ev.context.export();
    let isObject = typeof previous_value == "object";
    if (isObject) previous_value = JSON.stringify(previous_value);
    let data = window.prompt("Edit JSON data", previous_value);
    if (data === null) return void ev.preventDefault();
    try {
        if (isObject) data = JSON.parse(data);
        ev.data = data;
    } catch(err) {
        alert(err.message);
        ev.preventDefault();
    };
});
myForm.on("AfterAction_export", ({context, data})=>{
    if (context.getPath() !== "/") return; /* Only for root */
    if (typeof data == "object") data = JSON.stringify(data, null, 4);
    window.alert(data);
});{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- form_export_example_with_local_import_export_js {{{ --> {% endraw %}
{% capture form_export_example_with_local_import_export_js %}const myForm = new SmarkForm(document.getElementById("myForm$$"));
myForm.on("BeforeAction_import", async (ev)=>{
    if (!! ev.target) return; /* Only for triggers without target */
    /* Read previous value: */
    let previous_value = await ev.context.export();
    let isObject = typeof previous_value == "object";
    if (isObject) previous_value = JSON.stringify(previous_value);
    let data = window.prompt("Edit JSON data", previous_value);
    if (data === null) return void ev.preventDefault();
    try {
        if (isObject) data = JSON.parse(data);
        ev.data = data;
    } catch(err) {
        alert(err.message);
        ev.preventDefault();
    };
});
myForm.on("AfterAction_export", ({target, data})=>{
    if (!! target) return; /* Only for triggers without target */
    if (typeof data == "object") window.alert(JSON.stringify(data, null, 4));
});{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% comment %} →  Form aditional notes:            {% endcomment %}
{% comment %}    =====================            {% endcomment %}

{% raw %} <!-- capture basic_form_notes {{{ --> {% endraw %}
{% capture basic_form_notes %}
👉 In this example you can:
  * Use the `➡️ ` buttorn to export the form as JSON into the textarea at the right.
  * Clear the form using the `❌` button.
  * Use the `⬅️ ` buttorn to import that JSON back to the form again.
  * Edit the JSON in the textarea as you like and click `⬅️ ` again to
    translate the changes to the form.
  * Try to import an invalid values for given field to see how the form
    handles it.
  * Notice that most SmarkForm fields can be null, meaning the data is unknown
    or indifferent.
  * Even color pickers can be null even [native HTML color inputs
    can't](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/color#value).
  * To reset a color picker after a color being set, we a button to call it's
    "clear" *action*.
  * This kind of *SmarkForm* components intended to call *actions* on
    *SmarkForm* fields are called *triggers*.
  * There are several other *actions* that can be called on *SmarkForm* fields.
    Some, such as *import* and *export* are common to all field types and
    others are specific to some of them. For instance *addItem* and *removeItem*
    are specific to lists.
{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture basic_form_with_import_export_notes {{{ --> {% endraw %}
{% capture basic_form_with_import_export_notes %}
👉 Here you can:

  * Repeat all the same trials as in the former example (with identical results).
  * Use the `💾` button to export the whole form to a `window.alert(...)` dialog.
  * Use the `📂` button to import new JSON data to the whole form.
    - You can use the previously exported JSON as a base for custom edits.
{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture nested_forms_notes {{{ --> {% endraw %}
{% capture nested_forms_notes %}
👉 Again, despite importing and exporting the *demo* subform with `➡️ ` and `⬅️ `
buttons you can, respectively:

  * Use the `💾` button to see the whole form in a `window.alert(...)` dialog.
  * And `📂` button to import a new JSON data to the whole form throught a
    `window.prompt(...)`.
{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture deeply_nested_forms_notes {{{ --> {% endraw %}
{% capture deeply_nested_forms_notes %}
👉 FIXME!!
{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}




{% raw %} <!-- capture basic_form_with_local_import_export_notes {{{ --> {% endraw %}
{% capture basic_form_with_local_import_export_notes %}
If you compare the *JS* tab with the one in fhe former one,
you'll see that there is a little difference between them.

👉 In the first one, the "BeforeAction_import" and "AfterAction_export"
event handlers inhibits themselves depending on whether the context is the
root form or not while, in the later, it just focus on the fact that the
*target* is not provided.

👉 The second is a more generic approach for this kind of event handlers. But
the first one serves as an alternative example showing how we can base those
event handlers' behaviour on the specific context (path) of every trigger.
{% endcapture %}{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture context_comparsion_example_notes {{{ --> {% endraw %}
{% capture context_comparsion_example_notes %}
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



{% comment %} →  Template conditional rendering:  {% endcomment %}
{% comment %}    ===============================  {% endcomment %}

{% raw %} <!-- color_example {{{ --> {% endraw %}
{% if include.option == "basic_form" %}

    {% include components/sampletabs_tpl.md
        formId="basic_form"
        htmlSource=basic_form
        jsSource=form_export_example_js
        notes=basic_form_notes
        selected="preview"
    %}
{% raw %} <!-- }}} --> {% endraw %}

{% elsif include.option == "basic_form_with_import_export" %}

    {% include components/sampletabs_tpl.md
        formId="basic_form_with_import_export"
        htmlSource=basic_form_with_import_export
        jsSource=form_export_example_import_export_js
        notes=basic_form_with_import_export_notes
        selected="preview"
    %}

{% elsif include.option == "nested_forms" %}

    {% include components/sampletabs_tpl.md
        formId="nested_forms"
        htmlSource=nested_forms
        jsSource=form_export_example_import_export_js
        notes=nested_forms_notes
        selected="preview"
    %}

{% elsif include.option == "basic_form_with_local_import_export" %}

    {% include components/sampletabs_tpl.md
        formId="basic_form_with_local_import_export"
        htmlSource=basic_form_with_local_import_export
        jsSource=form_export_example_with_local_import_export_js
        notes=basic_form_with_local_import_export_notes
        selected="preview"
    %}

{% elsif include.option == "context_comparsion" %}

{% include components/sampletabs_tpl.md
    formId="context_comparsion"
    htmlSource=context_comparsion_example
    jsSource=context_comparsion_example_js
    notes=context_comparsion_example_notes
    selected="preview"
%}

{% elsif include.option == "simple_list" %}

    {% include components/sampletabs_tpl.md
        formId="simple_list"
        htmlSource=simple_list
        jsSource=form_export_example
        selected="preview"
    %}

{% elsif include.option == "simple_list_singleton" %}

    {% include components/sampletabs_tpl.md
        formId="simple_list_singleton"
        htmlSource=simple_list_singleton
        jsSource=form_export_example
        selected="preview"
    %}

{% elsif include.option == "schedule_list" %}

    {% include components/sampletabs_tpl.md
        formId="schedule_list"
        htmlSource=schedule_list
        jsSource=form_export_example
        selected="preview"
    %}

{% elsif include.option == "deeply_nested_forms" %}

    {% include components/sampletabs_tpl.md
        formId="deeply_nested_forms"
        htmlSource=deeply_nested_forms
        jsSource=form_export_example_import_export_js
        notes=deeply_nested_forms_notes
        selected="preview"
    %}

{% else %}

<div style="border: solid 3px red; padding: 0px 2em 1em 2em; border-radius: 0.5em;">
    <h2>🚧  Missing Example</h2>
    <p>Example id misspelled or not yet implemented: <b>{{ include.option }}</b>.</p>
</div>

{% endif %}
