
{% include components/sampletabs_ctrl.md %}

{% comment %} →  Layout components:               {% endcomment %}
{% comment %}    ==================               {% endcomment %}

{% raw %} <!-- import_export_buttons {{{ --> {% endraw %}
{% capture import_export_buttons
%}█<span><button
█    data-smark='{"action":"export","context":"demo","target":"../editor"}'
█    title="Export 'demo' subform to 'editor' textarea"
█    >⬇️ Export</button></span>
█<span><button
█    data-smark='{"action":"import","context":"demo","target":"../editor"}'
█    title="Import 'editor' textarea contents to 'demo' subform"
█    >⬆️ Import</button></span>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- load_save_buttons {{{ --> {% endraw %}
{% capture load_save_buttons
%}█<button
█    data-smark='{"action":"export"}'
█    title="Export the whole form as JSON (see JS tab)"
█    >💾 Save</button>
█<button
█    data-smark='{"action":"import"}'
█    title="Import the whole form as JSON (see JS tab)"
█    >📂 Load</button>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- clear_button {{{ --> {% endraw %}
{% capture clear_button
%}█<span><button
█    data-smark='{"action":"clear", "context":"demo"}'
█    title="Clear the whole form"
█    >❌ Clear</button></span>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- json_editor {{{ --> {% endraw %}
{% capture json_editor
%}█<textarea
█    cols="20"
█    placeholder="JSON data viewer / editor"
█    data-smark='{"name":"editor","type":"input"}'
█    style="resize: vertical; align-self: stretch; min-height: 8em; flex-grow: 1;"
█></textarea>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% comment %} →  Form sources:                    {% endcomment %}
{% comment %}    =============                    {% endcomment %}

{% raw %} <!-- basic_form_source {{{ --> {% endraw %}
{% capture basic_form_source
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

{% raw %} <!-- nested_forms_source {{{ --> {% endraw %}
{% capture nested_forms_source
%}{{ basic_form_source }}
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

{% raw %} <!-- deeply_nested_forms_source {{{ --> {% endraw %}
{% capture deeply_nested_forms_source
%}█<h2>This is the nested</h2>
█<h3>Car owners</h3>
█<button data-smark='{"action":"addItem","context":"employee","hotkey":"+"}' title='Nuevo empleado'>👥</button>
█<label data-smark>Empleados:</label>
█<div data-smark='{"type":"list","name":"employee", "min_items":0,"sortable":true, "exportEmpties":true}'>
█    <div>
{{ nested_forms_source | replace: "█", "█        " }}
█    </div>
█</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- simple_list_source {{{ --> {% endraw %}
{% capture simple_list_source
%}█<button data-smark='{"action":"removeItem", "context":"phones"}' title='Remove phone number'>➖</button>
█<button data-smark='{"action":"addItem","context":"phones"}' title='Add phone number'>➕ </button>
█<label data-smark>Phones:</label>
█<div data-smark='{"type":"list", "name": "phones", "of": "input", "exportEmpties": true}'>
█    <input type="tel" style="display: block">
█</div>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- simple_list_singleton_source {{{ --> {% endraw %}
{% capture simple_list_singleton_source
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

{% raw %} <!-- schedule_table_source {{{ --> {% endraw %}
{% capture schedule_table_source
%}█<table data-smark='{"type":"form","name":"schedules"}' style="width: 30em">
█    <tr data-smark='{"type":"list","name":"rcpt_schedule","min_items":0,"max_items":3}'>
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
█    <tr data-smark='{"type":"list","name":"bar_schedule","min_items":0,"max_items":3}'>
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
█    <tr data-smark='{"type":"list","name":"restaurant_schedule","min_items":0,"max_items":3}'>
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
█    <tr data-smark='{"type":"list","name":"pool_schedule","min_items":0,"max_items":3}'>
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


{% comment %} →  Form compositions:               {% endcomment %}
{% comment %}    ==================               {% endcomment %}

{% raw %} <!-- basic_form {{{ --> {% endraw %}
{% capture basic_form %}<div id="myForm$$">
    <div style="display: flex; flex-direction:column; align-items:left; gap: 1em">
        <div data-smark='{"name":"demo"}' style="flex-grow: 1">{{
            basic_form_source
            | replace: "█", "            "
        }}        </div>
        <div style="display: flex; justify-content: space-evenly">
{{ import_export_buttons | replace: "█", "            " }}
{{ clear_button | replace: "█", "            " }}
        </div>
{{ json_editor | replace: "█", "        " }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- nested_forms {{{ --> {% endraw %}
{% capture nested_forms %}<div id="myForm$$">
    <div style="display: flex; flex-direction:column; align-items:left; gap: 1em">
        <div data-smark='{"name":"demo"}' style="flex-grow: 1">{{
            nested_forms_source
            | replace: "█", "            "
        }}    </div>
        <div style="display: flex; justify-content: space-evenly">
{{ import_export_buttons | replace: "█", "            " }}
{{ clear_button | replace: "█", "            " }}
        </div>
{{ json_editor | replace: "█", "        " }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- nested_forms_with_load_save {{{ --> {% endraw %}
{% capture nested_forms_with_load_save %}<div id="myForm$$">
    <div style="display: flex; flex-direction:column; align-items:left; gap: 1em">
        <div data-smark='{"name":"demo"}' style="flex-grow: 1">{{
            nested_forms_source
            | replace: "█", "            "
        }}    </div>
        <div style="display: flex; justify-content: space-evenly">
{{ import_export_buttons | replace: "█", "            " }}
{{ load_save_buttons | replace: "█", "            " }}
{{ clear_button | replace: "█", "            " }}
        </div>
{{ json_editor | replace: "█", "        " }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}





{% raw %} <!-- simple_list {{{ --> {% endraw %}
{% capture simple_list %}<div id="myForm$$">
    <div style="display: flex; flex-direction:column; align-items:left; gap: 1em">
        <div data-smark='{"name":"demo"}' style="flex-grow: 1">
{{ simple_list_source | replace: "█", "            " }}
        </div>
        <div style="display: flex; justify-content: space-evenly">
{{ import_export_buttons | replace: "█", "            " }}
{{ clear_button | replace: "█", "            " }}
        </div>
{{ json_editor | replace: "█", "        " }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- simple_list_singleton {{{ --> {% endraw %}
{% capture simple_list_singleton %}<div id="myForm$$">
    <div style="display: flex; flex-direction:column; align-items:left; gap: 1em">
        <div data-smark='{"name":"demo"}' style="flex-grow: 1">
{{ simple_list_singleton_source | replace: "█", "        " }}
        </div>
        <div style="display: flex; justify-content: space-evenly">
{{ import_export_buttons | replace: "█", "            " }}
{{ clear_button  | replace: "█", "            " }}
        </div>
{{ json_editor | replace: "█", "        " }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- schedule_list {{{ --> {% endraw %}
{% capture schedule_list %}<div id="myForm$$">
    <div style="display: flex; flex-direction:column; align-items:left; gap: 1em">
        <div data-smark='{"name":"demo"}' style="flex-grow: 1">{{
            schedule_list_source
}}
        </div>
        <div style="display: flex; justify-content: space-evenly">
{{ import_export_buttons | replace: "█", "            " }}
{{ clear_button | replace: "█", "            " }}
        </div>
{{ json_editor | replace: "█", "        " }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- schedule_table {{{ --> {% endraw %}
{% capture schedule_table %}<div id="myForm$$">
    <div style="display: flex; flex-direction:column; align-items:left; gap: 1em">
        <div data-smark='{"name":"demo"}' style="flex-grow: 1">
            <h2>Operating Hours:</h2>
{{ schedule_table_source | replace: "█", "            " }}
        </div>
        <div style="display: flex; justify-content: space-evenly">
{{ import_export_buttons | replace: "█", "            " }}
{{ clear_button | replace: "█", "            " }}
        </div>
{{ json_editor | replace: "█", "        " }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- nested_schedule_table {{{ --> {% endraw %}
{% capture nested_schedule_table %}<div id="myForm$$">
    <div style="display: flex; flex-direction:column; align-items:left; gap: 1em">
        <div data-smark='{"name":"demo"}' style="flex-grow: 1">
            <h2>🗓️ Periods:</h2>
            <div data-smark='{"type":"list","name":"periods","sortable":true}'>
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
{{ schedule_table_source | replace: "█", "                    " }}
                </fieldset>
            </div>
            <button
                data-smark='{"action":"addItem","context":"periods","hotkey":"+"}'
                style="float: right; margin-top: 1em"
            >➕ Add Period</button>
        </div>
        <div style="display: flex; justify-content: space-evenly">
{{ import_export_buttons | replace: "█", "            " }}
{{ clear_button | replace: "█", "            " }}
        </div>
{{ json_editor | replace: "█", "        " }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% raw %} <!-- schedule_table_css {{{ --> {% endraw %}
{% capture schedule_table_css
%}
.time_slot {
    white-space: nowrap;
    width: 10em;
}
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}





{% raw %} <!-- basic_form_with_local_import_export {{{ --> {% endraw %}
{% capture basic_form_with_local_import_export %}<div id="myForm$$">
    <div style="display: flex; flex-direction:column; align-items:left; gap: 1em">
        <div data-smark='{"name":"demo"}' style="flex-grow: 1">{{
            nested_forms_source
            | replace: "█", "            "
}}
            <p>
                <!-- Import and export triggers with implicit context -->
{{ load_save_buttons | replace: "█", "                " }}
        </p>
        </div>
        <div style="display: flex; justify-content: space-evenly">
{{ import_export_buttons | replace: "█", "            " }}
{{ clear_button | replace: "█", "            " }}
        </div>
{{ json_editor | replace: "█", "        " }}
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
        <tr style="text-align:center">
            <th>Name field:</th>
            <th>Surname field:</th>
            <th>Whole Form:</th>
        </tr>
        <tr style="text-align:center">
            <td><button data-smark='{"action":"import","context":"name"}'>⬆️  Import</button></td>
            <td><button data-smark='{"action":"import","context":"surname"}'>⬆️  Import</button></td>
            <td><button data-smark='{"action":"import"}'>⬆️  Import</button></td>
        </tr>
        <tr style="text-align:center">
            <td><button data-smark='{"action":"export","context":"name"}'>⬇️  Export</button></td>
            <td><button data-smark='{"action":"export","context":"surname"}'>⬇️  Export</button></td>
            <td><button data-smark='{"action":"export"}'>⬇️  Export</button></td>
        </tr>
        <tr style="text-align:center">
            <td><button data-smark='{"action":"clear","context":"name"}'>❌ Clear</button></td>
            <td><button data-smark='{"action":"clear","context":"surname"}'>❌ Clear</button></td>
            <td><button data-smark='{"action":"clear"}'>❌ Clear</button></td>
        </tr>
    </table>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture context_comparsion_example_simple {{{ --> {% endraw %}
{% capture context_comparsion_example_simple %}<div id='myForm$$'>
    <div data-smark='{"name":"demo"}'>
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
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- deeply_nested_forms {{{ --> {% endraw %}
{% capture deeply_nested_forms %}<div id="myForm$$">
    <div style="display: grid; grid-gap: 1em;">
        <div data-smark='{"name":"demo"}' style="flex-grow: 1">
{{ deeply_nested_forms_source | replace: "█", "            " }}
        </div>
        <div style="display: flex; justify-content: space-evenly">
{{ import_export_buttons | replace: "█", "            " }}
{{ clear_button | replace: "█", "            " }}
        </div>
{{ json_editor | replace: "█", "        " }}
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
    /* Only for the whole form */
    /* (avoiding to interfere with `⬅️ ` buttons */
    if (ev.context.getPath() !== "/") return;

    /* BONUS: Read previous value to use it as default value */
    /*        so that you only need to edit it.              */
    let previous_value = await ev.context.export();
    let isObject = typeof previous_value == "object";
    if (isObject) previous_value = JSON.stringify(previous_value);
    
    /* Read new value: */
    let data = window.prompt("Edit JSON data", previous_value);
    if (data === null) return void ev.preventDefault(); /* User cancelled */

    /* Parse as JSON, warn if invalid and set */
    try {
        if (isObject) data = JSON.parse(data);
        ev.data = data; /* ← Set the new value */
    } catch(err) {
        alert(err.message); /* ← Show error message */
        ev.preventDefault();
    };
});
myForm.on("AfterAction_export", ({context, data})=>{
    /* Only for the whole form */
    /* (avoiding to interfere with `➡️ ` button) */
    if (context.getPath() !== "/") return; /* Only for root */

    /* Pretty print and show */
    if (typeof data == "object") data = JSON.stringify(data, null, 4);
    window.alert(data);
});{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- form_export_example_with_local_import_export_js {{{ --> {% endraw %}
{% capture form_export_example_with_local_import_export_js %}const myForm = new SmarkForm(document.getElementById("myForm$$"));
myForm.on("BeforeAction_import", async (ev)=>{

    /* Only for triggers without target */
    if (!! ev.target) return;

    /* BONUS: Read previous value to use it as default value */
    /*        so that you only need to edit it.              */
    let previous_value = await ev.context.export();
    let isObject = typeof previous_value == "object";
    if (isObject) previous_value = JSON.stringify(previous_value);
    
    /* Read new value: */
    let data = window.prompt("Edit JSON data", previous_value);
    if (data === null) return void ev.preventDefault(); /* User cancelled */

    /* Parse as JSON, warn if invalid and set */
    try {
        if (isObject) data = JSON.parse(data);
        ev.data = data; /* ← Set the new value */
    } catch(err) {
        alert(err.message); /* ← Show error message */
        ev.preventDefault();
    };

});
myForm.on("AfterAction_export", ({target, data})=>{

    /* Only for triggers without target */
    if (!! target) return;

    /* Pretty print and show */
    if (typeof data == "object") data = JSON.stringify(data, null, 4);
    window.alert(data);

});{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% comment %} →  Template conditional rendering:  {% endcomment %}
{% comment %}    ===============================  {% endcomment %}

{% raw %} <!-- color_example {{{ --> {% endraw %}
{% if include.option == "basic_form" %}

    {% include components/sampletabs_tpl.md
        formId="basic_form"
        htmlSource=basic_form
        jsSource=form_export_example_js
        notes=include.notes
        selected="preview"
    %}
{% raw %} <!-- }}} --> {% endraw %}

{% elsif include.option == "nested_forms" %}

    {% include components/sampletabs_tpl.md
        formId="nested_forms"
        htmlSource=nested_forms
        jsSource=form_export_example_js
        notes=include.notes
        selected="preview"
    %}

{% elsif include.option == "nested_forms_with_load_save" %}

    {% include components/sampletabs_tpl.md
        formId="nested_forms_with_load_save"
        htmlSource=nested_forms_with_load_save
        jsSource=form_export_example_import_export_js
        notes=include.notes
        selected="preview"
    %}

{% elsif include.option == "basic_form_with_local_import_export" %}

    {% include components/sampletabs_tpl.md
        formId="basic_form_with_local_import_export"
        htmlSource=basic_form_with_local_import_export
        jsSource=form_export_example_with_local_import_export_js
        notes=include.notes
        selected="preview"
    %}

{% elsif include.option == "context_comparsion" %}

    {% include components/sampletabs_tpl.md
        formId="context_comparsion"
        htmlSource=context_comparsion_example
        jsSource=context_comparsion_example_js
        notes=include.notes
        selected="preview"
    %}

{% elsif include.option == "context_comparsion_simple" %}

    {% include components/sampletabs_tpl.md
        formId="context_comparsion_simple"
        htmlSource=context_comparsion_example_simple
        jsSource=form_export_example
        notes=include.notes
        selected="preview"
    %}

{% elsif include.option == "simple_list" %}

    {% include components/sampletabs_tpl.md
        formId="simple_list"
        htmlSource=simple_list
        jsSource=form_export_example
        notes=include.notes
        selected="preview"
    %}

{% elsif include.option == "simple_list_singleton" %}

    {% include components/sampletabs_tpl.md
        formId="simple_list_singleton"
        htmlSource=simple_list_singleton
        jsSource=form_export_example
        notes=include.notes
        selected="preview"
    %}

{% elsif include.option == "schedule_list" %}

    {% include components/sampletabs_tpl.md
        formId="schedule_list"
        htmlSource=schedule_list
        jsSource=form_export_example
        notes=include.notes
        selected="preview"
    %}

{% elsif include.option == "schedule_table" %}

    {% include components/sampletabs_tpl.md
        formId="schedule_table"
        htmlSource=schedule_table
        jsSource=form_export_example
        cssSource=schedule_table_css
        notes=include.notes
        selected="preview"
    %}

{% elsif include.option == "nested_schedule_table" %}

    {% include components/sampletabs_tpl.md
        formId="nested_schedule_table"
        htmlSource=nested_schedule_table
        jsSource=form_export_example
        cssSource=schedule_table_css
        notes=include.notes
        selected="preview"
    %}

{% elsif include.option == "deeply_nested_forms_FIXME" %}

    {% include components/sampletabs_tpl.md
        formId="deeply_nested_forms"
        htmlSource=deeply_nested_forms
        jsSource=form_export_example_import_export_js
        notes=include.notes
        selected="preview"
    %}

{% else %}

<div style="border: solid 3px yellow; padding: 0px 2em 1em 2em; border-radius: 0.5em;">
    <h2>🚧  Missing Example 🚧</h2>
    <p>This section is still under construction and this example is not yet available.</p>
    <p style="opacity:.6">Example id: <b>{{ include.option }}</b>.</p>
    <p>🙏 Thank you for your patience.</p>
</div>

{% endif %}
