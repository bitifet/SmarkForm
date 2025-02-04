
{% include components/sampletabs_ctrl.md %}

{% capture import_export_buttons %}
        <p><button
            data-smark='{"action":"export"}'
            title="Export the whole form as JSON (see JS tab)"
            >💾</button></p>
        <p><button
            data-smark='{"action":"import"}'
            title="Import the whole form as JSON (see JS tab)"
            >📂</button></p>
{% endcapture %}

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

{% capture json_editor %}
        <textarea
            cols="20"
            placeholder="JSON data editor"
            data-smark='{"name":"editor","type":"input"}'
            style="resize: none; align-self: stretch; min-height: 8em"
        ></textarea>
{% endcapture %}


{% raw %} <!-- basic_form {{{ --> {% endraw %}
{% capture basic_form %}<div id="myForm$$">
    <div style="display: flex; align-items:center; gap: 1em; min-width: max(100%, 450px)">
        <div data-smark='{"name":"demo"}'>{{ basic_form_source
        }}    </div>
        <div>
            <p><button
                data-smark='{"action":"export","context":"demo","target":"../editor"}'
                title="Export 'demo' subform to 'editor' textarea"
                >➡️ </button></p>
            <p><button
                data-smark='{"action":"import","context":"demo","target":"../editor"}'
                title="Import 'editor' textarea contents to 'demo' subform"
                >⬅️ </button></p>
            <p><button
                data-smark='{"action":"clear"}'
                title="Clear the whole form"
                >❌</button></p>
        </div>{{ json_editor }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% raw %} <!-- basic_form_with_import_export {{{ --> {% endraw %}
{% capture basic_form_with_import_export %}<div id="myForm$$">
    <div style="display: flex; align-items:center; gap: 1em; min-width: max(100%, 450px)">
        <div data-smark='{"name":"demo"}'>{{ basic_form_source
        }}    </div>
        <div>
            <p><button
                data-smark='{"action":"export","context":"demo","target":"../editor"}'
                title="Export 'demo' subform to 'editor' textarea"
                >➡️ </button></p>
            <p><button
                data-smark='{"action":"import","context":"demo","target":"../editor"}'
                title="Import 'editor' textarea contents to 'demo' subform"
                >⬅️ </button></p>{{ import_export_buttons }}
            <p><button
                data-smark='{"action":"clear"}'
                title="Clear the whole form"
                >❌</button></p>
        </div>{{ json_editor }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- basic_form_with_local_import_export {{{ --> {% endraw %}
{% capture basic_form_with_local_import_export %}<div id="myForm$$">
    <div style="display: flex; align-items:center; gap: 1em; min-width: max(100%, 450px)">
        <div data-smark='{"name":"demo"}'>{{
                basic_form_source
            }}
            <button
                data-smark='{"action":"export"}'
                title="Export the whole form as JSON (see JS tab)"
                >💾 Export</button>
            <button
                data-smark='{"action":"import"}'
                title="Import the whole form as JSON (see JS tab)"
                >📂 Import</button>
        </div>
        <div>
            <p><button
                data-smark='{"action":"export","context":"demo","target":"../editor"}'
                title="Export 'demo' subform to 'editor' textarea"
                >➡️ </button></p>
            <p><button
                data-smark='{"action":"import","context":"demo","target":"../editor"}'
                title="Import 'editor' textarea contents to 'demo' subform"
                >⬅️ </button></p>
            <p><button
                data-smark='{"action":"clear"}'
                title="Clear the whole form"
                >❌</button></p>
        </div>{{ json_editor }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}



{% raw %} <!-- simple_list {{{ --> {% endraw %}
{% capture simple_list %}<div id="myForm$$">
    <div style="display: flex; align-items:center; gap: 1em; min-width: max(100%, 450px)">
        <div data-smark='{"name":"demo"}'>
            <button data-smark='{"action":"removeItem", "context":"phones"}' title='Remove phone number'>➖</button>
            <button data-smark='{"action":"addItem","context":"phones"}' title='Add phone number'>➕ </button>
            <label data-smark>Phones:</label>
            <div data-smark='{"type":"list", "name": "phones", "of": "input", "exportEmpties": true}'>
                <input type="tel" style="display: block">
            </div>
        </div>
        <div>
            <p><button
                data-smark='{"action":"export","context":"demo","target":"../editor"}'
                title="Export 'demo' subform to 'editor' textarea"
                >➡️ </button></p>
            <p><button
                data-smark='{"action":"import","context":"demo","target":"../editor"}'
                title="Import 'editor' textarea contents to 'demo' subform"
                >⬅️ </button></p>
            <p><button
                data-smark='{"action":"clear"}'
                title="Clear the whole form"
                >❌</button></p>
        </div>{{ json_editor }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% raw %} <!-- simple_list {{{ --> {% endraw %}
{% capture simple_list_singleton %}<div id="myForm$$">
    <div style="display: flex; align-items:center; gap: 1em; min-width: max(100%, 450px)">
        <div data-smark='{"name":"demo"}'>
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
        </div>
        <div>
            <p><button
                data-smark='{"action":"export","context":"demo","target":"../editor"}'
                title="Export 'demo' subform to 'editor' textarea"
                >➡️ </button></p>
            <p><button
                data-smark='{"action":"import","context":"demo","target":"../editor"}'
                title="Import 'editor' textarea contents to 'demo' subform"
                >⬅️ </button></p>
            <p><button
                data-smark='{"action":"clear"}'
                title="Clear the whole form"
                >❌</button></p>
        </div>{{ json_editor }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}



{% raw %} <!-- schedule_list {{{ --> {% endraw %}
{% capture schedule_list %}<div id="myForm$$">
    <div style="display: flex; flex-direction:column; align-items:center; gap: 1em; min-width: max(100%, 450px)">
        <div data-smark='{"name":"demo"}'>
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
        </div>
        <div>
            <span><button
                data-smark='{"action":"export","context":"demo","target":"../editor"}'
                title="Export 'demo' subform to 'editor' textarea"
                >⬇️ </button></span>
            <span><button
                data-smark='{"action":"import","context":"demo","target":"../editor"}'
                title="Import 'editor' textarea contents to 'demo' subform"
                >⬆️ </button></span>
            <span><button
                data-smark='{"action":"clear"}'
                title="Clear the whole form"
                >❌</button></span>
        </div>{{ json_editor }}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}












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
            >⬅️ </button></p>{{ import_export_buttons }}</td>
    <td data-smark='{"name":"editor","type":"input"}'>
        <textarea data-smark style="width: 100%; height: 100px;"></textarea>
    </td>
    </tr></table>
</div>{% endcapture %}
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



{% if include.option == "basic_form" %}

    {% include components/sampletabs_tpl.md
        formId="basic_form"
        htmlSource=basic_form
        jsSource=form_export_example_js
        selected="preview"
    %}

{% elsif include.option == "basic_form_with_import_export" %}

    {% include components/sampletabs_tpl.md
        formId="basic_form_with_import_export"
        htmlSource=basic_form_with_import_export
        jsSource=form_export_example_import_export_js
        selected="preview"
    %}

{% elsif include.option == "basic_form_with_local_import_export" %}

    {% include components/sampletabs_tpl.md
        formId="basic_form_with_local_import_export"
        htmlSource=basic_form_with_local_import_export
        jsSource=form_export_example_import_export_js
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
