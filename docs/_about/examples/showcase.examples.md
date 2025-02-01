
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
                <button data-smark='{"action":"clear"}' title='Indifferent' >❌ </button>
            </span>
        </p>
{% endcapture %}




{% raw %} <!-- basic_form {{{ --> {% endraw %}
{% capture basic_form %}<div id="myForm$$">
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
            >⬅️ </button></p>
        <p><button
            data-smark='{"action":"clear"}'
            title="Clear the whole form"
            >❌</button></p>
    </td>
    <td data-smark='{"name":"editor","type":"input"}'>
        <textarea data-smark style="width: 100%; height: 100px;"></textarea>
    </td>
    </tr></table>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% raw %} <!-- basic_form {{{ --> {% endraw %}
{% capture basic_form_with_import_export %}<div id="myForm$$">
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
            >⬅️ </button></p>{{ import_export_buttons }}
        <p><button
            data-smark='{"action":"clear"}'
            title="Clear the whole form"
            >❌</button></p>
    </td>
    <td data-smark='{"name":"editor","type":"input"}'>
        <textarea data-smark style="width: 100%; height: 100px;"></textarea>
    </td>
    </tr></table>
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

{% elsif include.option == "color_example" %}

    {% include components/sampletabs_tpl.md
        formId="color_example"
        htmlSource=color_example
        jsSource=form_export_example_js
        selected="preview"
    %}

{% endif %}
