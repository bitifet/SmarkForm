
{% include components/sampletabs_ctrl.md %}

{% comment %} →  Layout components:               {% endcomment %}
{% comment %}    ==================               {% endcomment %}

{% raw %} <!-- import_export_buttons_stacked {{{ --> {% endraw %}
{% capture import_export_buttons_stacked
%}<p><button
                data-smark='{"action":"export","context":"demo","target":"../editor"}'
                title="Export 'demo' subform to 'editor' textarea"
                >➡️ </button></p>
            <p><button
                data-smark='{"action":"import","context":"demo","target":"../editor"}'
                title="Import 'editor' textarea contents to 'demo' subform"
                >⬅️ </button></p>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- import_export_buttons {{{ --> {% endraw %}
{% capture import_export_buttons
%}<span><button
                data-smark='{"action":"export","context":"demo","target":"../editor"}'
                title="Export 'demo' subform to 'editor' textarea"
                >⬇️ </button></span>
            <span><button
                data-smark='{"action":"import","context":"demo","target":"../editor"}'
                title="Import 'editor' textarea contents to 'demo' subform"
                >⬆️ </button></span>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- load_save_buttons_stacked {{{ --> {% endraw %}
{% capture load_save_buttons_stacked
%}<p><button
                data-smark='{"action":"export"}'
                title="Export the whole form as JSON (see JS tab)"
                >💾</button></p>
            <p><button
                data-smark='{"action":"import"}'
                title="Import the whole form as JSON (see JS tab)"
                >📂</button></p>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- load_save_buttons {{{ --> {% endraw %}
{% capture load_save_buttons
%}<button
                data-smark='{"action":"export"}'
                title="Export the whole form as JSON (see JS tab)"
                >💾 Save</button>
            <button
                data-smark='{"action":"import"}'
                title="Import the whole form as JSON (see JS tab)"
                >📂 Load</button>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- clear_button_stacked {{{ --> {% endraw %}
{% capture clear_button_stacked %}<p><button
                data-smark='{"action":"clear", "context":"demo"}'
                title="Clear the whole form"
                >❌</button></p>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- clear_button {{{ --> {% endraw %}
{% capture clear_button %}<span><button
                data-smark='{"action":"clear", "context":"demo"}'
                title="Clear the whole form"
                >❌</button></span>{%
endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- json_editor {{{ --> {% endraw %}
{% capture json_editor %}
        <textarea
            cols="20"
            placeholder="JSON data viewer / editor"
            data-smark='{"name":"editor","type":"input"}'
            style="resize: none; align-self: stretch; min-height: 8em; flex-grow: 1;"
        ></textarea>
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% comment %} →  Form sources:                    {% endcomment %}
{% comment %}    =============                    {% endcomment %}


{% raw %} <!-- basic_form_source {{{ --> {% endraw %}
{% capture basic_form_source %}
        <h2>Car Details</h2>
        <p>
            <label data-smark>Model:</label>
            <input type="text" name="model" data-smark />
        </p>
        <p>
            <label data-smark>Doors:</label>
            <input type="number" name="doors" min="3" max="5" step=2 data-smark />
        </p>
        <p>
            <label data-smark>Seats:</label>
            <input type="number" name="seats" min=4 max=9 data-smark />
        </p>
        <p>
            <label data-smark>Driving Side:</label>
            <input type="radio" name="side" value="left" data-smark /> Left
            <input type="radio" name="side" value="right" data-smark /> Right
        </p>
        <p>
            <label data-smark>Color:</label>
            <span data-smark='{"type":"color", "name":"color"}'>
                <input data-smark>
                <button data-smark='{"action":"clear"}' title='Indifferent or unknown' >❌ </button>
            </span>
        </p>
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- nested_forms_source {{{ --> {% endraw %}
{% capture nested_forms_source %}
        <h2>Car Details</h2>
        <p>
            <label data-smark>Model:</label>
            <input type="text" name="model" data-smark />
        </p>
        <p>
            <label data-smark>Doors:</label>
            <input type="number" name="doors" min="3" max="5" step=2 data-smark />
        </p>
        <p>
            <label data-smark>Seats:</label>
            <input type="number" name="seats" min=4 max=9 data-smark />
        </p>
        <p>
            <label data-smark>Driving Side:</label>
            <input type="radio" name="side" value="left" data-smark /> Left
            <input type="radio" name="side" value="right" data-smark /> Right
        </p>
        <p data-smark='{"name":"safety","type":"form"}'>
            <label>Safety Features:</label>
            <span>
                <label><input type="checkbox" name="airbag" data-smark /> Airbag.</label>
            </span>
            &nbsp;&nbsp;
            <span>
                <label><input type="checkbox" name="abs" data-smark /> ABS.</label>
            </span>
            &nbsp;&nbsp;
            <span>
                <label><input type="checkbox" name="esp" data-smark /> ESP.</label>
            </span>
            &nbsp;&nbsp;
            <span>
                <label><input type="checkbox" name="tc" data-smark />TC.</label>
            </span>
        </p>
        <p>
            <label data-smark>Color:</label>
            <span data-smark='{"type":"color", "name":"color"}'>
                <input data-smark>
                <button data-smark='{"action":"clear"}' title='Indifferent or unknown' >❌ </button>
            </span>
        </p>
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% raw %} <!-- simple_list_source {{{ --> {% endraw %}
{% capture simple_list_source %}
            <button data-smark='{"action":"removeItem", "context":"phones"}' title='Remove phone number'>➖</button>
            <button data-smark='{"action":"addItem","context":"phones"}' title='Add phone number'>➕ </button>
            <label data-smark>Phones:</label>
            <div data-smark='{"type":"list", "name": "phones", "of": "input", "exportEmpties": true}'>
                <input type="tel" style="display: block">
            </div>
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- simple_list_singleton_source {{{ --> {% endraw %}
{% capture simple_list_singleton_source %}
            <button data-smark='{"action":"removeItem", "context":"phones", "target":"*", "keep_non_empty":true}' title='Remove unused fields'>🧹</button>
            <button data-smark='{"action":"removeItem", "context":"phones", "keep_non_empty":true}' title='Remove phone number'>➖</button>
            <button data-smark='{"action":"addItem","context":"phones"}' title='Add phone number'>➕ </button>
            <label data-smark>Phones:</label>
            <ul data-smark='{"name": "phones", "of": "input", "sortable":true, "min_items":0, "max_items":5}'>
                <li data-smark='{"role": "empty_list"}' class="row">(None)</li>
                <li class="row">
                    <label data-smark>📞 </label><input type="tel" data-smark>
                    <button data-smark='{"action":"removeItem"}' title='Remove this phone number'>❌</button>
                </li>
            </ul>
{% endcapture %}
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
        <div data-smark='{"name":"demo"}' style="flex-grow: 1">{{ basic_form_source
        }}    </div>
        <div>
            {{ import_export_buttons_stacked }}
            {{ clear_button }}
        </div>{{ json_editor }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% raw %} <!-- basic_form_with_import_export {{{ --> {% endraw %}
{% capture basic_form_with_import_export %}<div id="myForm$$">
    <div style="display: flex; align-items:center; gap: 1em; min-width: max(100%, 450px)">
        <div data-smark='{"name":"demo"}' style="flex-grow: 1">{{ basic_form_source
        }}    </div>
        <div>
            {{ import_export_buttons_stacked }}
            {{ load_save_buttons_stacked }}
            {{ clear_button }}
        </div>{{ json_editor }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- nested_forms {{{ --> {% endraw %}
{% capture nested_forms %}<div id="myForm$$">
    <div style="display: flex; align-items:center; gap: 1em; min-width: max(100%, 450px)">
        <div data-smark='{"name":"demo"}' style="flex-grow: 1">{{ nested_forms_source
        }}    </div>
        <div>
            {{ import_export_buttons_stacked }}
            {{ load_save_buttons_stacked }}
            {{ clear_button }}
        </div>{{ json_editor }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- basic_form_with_local_import_export {{{ --> {% endraw %}
{% capture basic_form_with_local_import_export %}<div id="myForm$$">
    <div style="display: flex; align-items:center; gap: 1em; min-width: max(100%, 450px)">
        <div data-smark='{"name":"demo"}' style="flex-grow: 1">{{
                basic_form_source
}}        <p>
            {{ load_save_buttons }}
        </p>
        </div>
        <div>
            {{ import_export_buttons_stacked }}
            {{ clear_button }}
        </div>{{ json_editor }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- simple_list {{{ --> {% endraw %}
{% capture simple_list %}<div id="myForm$$">
    <div style="display: flex; align-items:center; gap: 1em; min-width: max(100%, 450px)">
        <div data-smark='{"name":"demo"}' style="flex-grow: 1">{{
            simple_list_source
}}
        </div>
        <div>
            {{ import_export_buttons_stacked }}
            {{ clear_button }}
        </div>{{ json_editor }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- simple_list_singleton {{{ --> {% endraw %}
{% capture simple_list_singleton %}<div id="myForm$$">
    <div style="display: flex; align-items:center; gap: 1em; min-width: max(100%, 450px)">
        <div data-smark='{"name":"demo"}' style="flex-grow: 1">{{
            simple_list_singleton_source
}}
        </div>
        <div>
            {{ import_export_buttons_stacked }}
            {{ clear_button_stacked }}
        </div>{{ json_editor }}
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
            {{ import_export_buttons }}
            {{ clear_button }}
        </div>{{ json_editor }}
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

{% raw %} <!-- color_example {{{ --> {% endraw %}
{% capture color_example %}<div id="myForm$$">
    <table><tr>
    <td data-smark='{"name":"demo"}'>{{ basic_form_source
    }}    </td>
    <td style="text-align:center;">
        <p><button
            data-smark='{"action":"export","context":"demo","target":"../editor"}'
            title="Export 'demo' subform to 'editor' textarea"
            >➡️ </button></p>
        <p><button
            data-smark='{"action":"import","context":"demo","target":"../editor"}'
            title="Import 'editor' textarea contents to 'demo' subform"
            >⬅️ </button></p>{{ load_save_buttons }}</td>
    <td data-smark='{"name":"editor","type":"input"}'>
        <textarea data-smark style="width: 100%; height: 100px;"></textarea>
    </td>
    </tr></table>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}



{% comment %} →  Template conditional rendering:  {% endcomment %}
{% comment %}    ===============================  {% endcomment %}

{% raw %} <!-- color_example {{{ --> {% endraw %}
{% if include.option == "basic_form" %}

    {% include components/sampletabs_tpl.md
        formId="basic_form"
        htmlSource=basic_form
        jsSource=form_export_example_js
        selected="preview"
    %}
{% raw %} <!-- }}} --> {% endraw %}

{% elsif include.option == "basic_form_with_import_export" %}

    {% include components/sampletabs_tpl.md
        formId="basic_form_with_import_export"
        htmlSource=basic_form_with_import_export
        jsSource=form_export_example_import_export_js
        selected="preview"
    %}

{% elsif include.option == "nested_forms" %}

    {% include components/sampletabs_tpl.md
        formId="nested_forms"
        htmlSource=nested_forms
        jsSource=form_export_example_import_export_js
        selected="preview"
    %}

{% elsif include.option == "basic_form_with_local_import_export" %}

    {% include components/sampletabs_tpl.md
        formId="basic_form_with_local_import_export"
        htmlSource=basic_form_with_local_import_export
        jsSource=form_export_example_with_local_import_export_js
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

{% elsif include.option == "color_example" %}

    {% include components/sampletabs_tpl.md
        formId="color_example"
        htmlSource=color_example
        jsSource=form_export_example_js
        selected="preview"
    %}

{% else %}

<div style="border: solid 3px red; padding: 0px 2em 1em 2em; border-radius: 0.5em;">
    <h2>🚧  Missing Example</h2>
    <p>Example id misspelled or not yet implemented: <b>{{ include.option }}</b>.</p>
</div>

{% endif %}
