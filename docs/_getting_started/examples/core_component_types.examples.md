

{% include components/sampletabs_ctrl.md %}

{% raw %} <!-- no_singleton_example {{{ --> {% endraw %}
{% capture no_singleton_example %}<div id="myForm$$">
    <p>
        <p>
            <label data-smark>Pick a Color:</label>
            <input type="color" name="color" data-smark>
            <button data-smark='{"action":"clear","context":"color"}'>❌ Reset</button>
        </p>
    </p>
    <p>
        <button data-smark='{"action":"clear"}'>❌ Clear</button>
        <button data-smark='{"action":"export"}'>💾 Submit</button>
    </p>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% raw %} <!-- input_example {{{ --> {% endraw %}
{% capture input_example %}<div id="myForm$$">
    <p>
        <label data-smark>Name:</label>
        <!-- Implicit (automatically inferred) component type: -->
        <input type='text' name='name' data-smark>
    </p>
    <p>
        <label data-smark>Surname:</label>
        <!-- Explicitly specified component type: -->
        <input type='text' name='surname' data-smark='{"type":"input"}'>
    </p>
    <p>
        <label data-smark>User Name:</label>
        <!-- Handy options-driven syntax:                                  -->
        <!--   👉 type attribute ='text' is the default                    -->
        <!--   👉 {"type":"input"} inferred by tag name and type attribute -->
        <input data-smark='{"name":"user_name"}'>
    </p>
    <p>
        <label data-smark>Phone:</label>
        <!-- Explicit better than implicit:                                -->
        <!--   👉 type='tel' is necessary here.                            -->
        <!--   👉 {"type":"input"} may prevent an hypotetical future "tel" -->
        <!--      component type from being inferred here.                 -->
        <input type='tel' data-smark='{"type":"input","name":"phone"}'>
    </p>
    <p>
        <label data-smark>Address:</label>
        <!-- Non <input> fields:                                           -->
        <textarea data-smark='{"type":"input","name":"address"}'></textarea>
    </p>
    <p>
        <label data-smark>Email:</label>
        <!-- Just another example:                                         -->
        <input type='email' data-smark='{"type":"input","name":"email"}'>
    </p>
    <p>
        <button data-smark='{"action":"clear"}'>❌ Clear</button>
        <button data-smark='{"action":"export"}'>💾 Submit</button>
    </p>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% raw %} <!-- number_and_date_example {{{ --> {% endraw %}
{% capture number_and_date_example %}<div id="myForm$$">
    <p>
        <label data-smark>Price:</label>
        <input data-smark='{"type":"number","name":"price"}'>
    </p>
    <p>
        <label data-smark>Date:</label>
        <input data-smark='{"type":"date","name":"date"}'>
    </p>
    <p>
        <button data-smark='{"action":"clear"}'>❌ Clear</button>
        <button data-smark='{"action":"export"}'>💾 Submit</button>
    </p>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% raw %} <!-- color_example {{{ --> {% endraw %}
{% capture color_example %}<div id="myForm$$">
    <p>
        <p>
            <label data-smark>Pick a Color:</label>
            <span data-smark='{"type":"color", "name":"bgcolor"}'>
                <input data-smark>
                <button data-smark='{"action":"clear"}'>❌ Reset</button>
            </span>
        </p>
    </p>
    <p>
        <button data-smark='{"action":"clear"}'>❌ Clear</button>
        <button data-smark='{"action":"export"}'>💾 Submit</button>
    </p>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% raw %} <!-- clear_others_example {{{ --> {% endraw %}
{% capture clear_others_example %}<div id="myForm$$">
    <p>
        <p>
            <label data-smark>A Color:</label>
            <span data-smark='{"type":"color", "name":"color"}'>
                <input data-smark>
                <button data-smark='{"action":"clear"}'>❌ Reset</button>
            </span>
        </p>
        <p>
            <label data-smark>A Number:</label>
            <span data-smark='{"type":"number", "name":"number"}'>
                <input data-smark>
                <button data-smark='{"action":"clear"}'>❌ Reset</button>
            </span>
        </p>
        <p>
            <label data-smark>A Date:</label>
            <span data-smark='{"type":"date", "name":"date"}'>
                <input data-smark>
                <button data-smark='{"action":"clear"}'>❌ Reset</button>
            </span>
        </p>
    </p>
    <p>
        <button data-smark='{"action":"clear"}'>❌ Clear</button>
        <button data-smark='{"action":"export"}'>💾 Submit</button>
    </p>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% raw %} <!-- form_export_example_js {{{ --> {% endraw %}
{% capture form_export_example_js %}const myForm = new SmarkForm(document.getElementById("myForm$$"));
/* Show exported data in an alert() window */
myForm.on("AfterAction_export", ({data})=>{
    window.alert(JSON.stringify(data, null, 4));
});{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}



{% if include.option == "no_singleton_example" %}

    {% include components/sampletabs_tpl.md
        formId="no_singleton_example"
        htmlSource=no_singleton_example
        jsSource=form_export_example_js
    %}

{% elsif include.option == "singleton_example" %}

    {% include components/sampletabs_tpl.md
        formId="singleton_example"
        htmlSource=color_example
        jsSource=form_export_example_js
    %}

{% elsif include.option == "input_example" %}

    {% include components/sampletabs_tpl.md
        formId="input_example"
        htmlSource=input_example
        jsSource=form_export_example_js
    %}

{% elsif include.option == "number_and_date_example" %}

    {% include components/sampletabs_tpl.md
        formId="number_and_date_example"
        htmlSource=number_and_date_example
        jsSource=form_export_example_js
    %}

{% elsif include.option == "color_example" %}

    {% include components/sampletabs_tpl.md
        formId="color_example"
        htmlSource=color_example
        jsSource=form_export_example_js
        selected="preview"
    %}

{% elsif include.option == "clear_others_example" %}

    {% include components/sampletabs_tpl.md
        formId="clear_others_example"
        htmlSource=clear_others_example
        jsSource=form_export_example_js
        selected="preview"
    %}

{% endif %}
