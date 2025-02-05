
{% include components/sampletabs_ctrl.md %}

{% raw %} <!-- capture simple_form_example {{{ --> {% endraw %}
{% capture simple_form_example %}<div id='myForm$$'>
    <p>
        <label data-smark>Name:</label>
        <input name='name' data-smark>
    </p>
    <p>
        <label data-smark>Surname:</label>
        <input name='surname' data-smark>
    </p>
    <p>
        <button data-smark='{"action":"import"}'>⬆️  Import</button>
        <button data-smark='{"action":"export"}'>⬇️  Export</button>
    </p>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture simple_form_example_js {{{ --> {% endraw %}
{% capture simple_form_example_js %}const myForm = new SmarkForm(document.getElementById("myForm$$"));
myForm.on("BeforeAction_import", async (ev)=>{
    let data = window.prompt(
        'Fill JSON data'
        , '{"name":"","surname":""}' /* Provide a template to help... */
    );
    if (data === null) return void ev.preventDefault();
    try {
        ev.data = JSON.parse(data);
    } catch(err) {
        alert(err.message);
        ev.preventDefault();
    };
});
myForm.on("AfterAction_export", ({data})=>{
    window.alert(JSON.stringify(data, null, 4));
});{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture simple_form_example_notes {{{ --> {% endraw %}
{% capture simple_form_example_notes %}
👉 For this to work you need to get SmarkForm loaded into your page or
module (More information at *Getting SmarkForm* section).

💡 Try to fill the form and then press the *Export* button to get it as
JSON.

💡 Try to *Import* button and fill the gaps in provided JSON structure.

🔨 Try to add more JSON keys, remove existing, and even provide invalid
JSON data and see what happen.
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture inner_exports_form_example {{{ --> {% endraw %}
{% capture inner_exports_form_example %}<div id='myForm$$'>
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

{% raw %} <!-- capture inner_exports_form_example_js {{{ --> {% endraw %}
{% capture inner_exports_form_example_js %}const myForm = new SmarkForm(document.getElementById("myForm$$"));
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

{% raw %} <!-- capture inner_exports_form_example_notes {{{ --> {% endraw %}
{% capture inner_exports_form_example_notes %}
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

{% raw %} <!-- capture nested_forms_example {{{ --> {% endraw %}
{% capture nested_forms_example %}<div id='myForm$$'>
    <b>User:</b>
    <p>
        <label data-smark>Id:</label>
        <input name='userId' value='0001' data-smark>
    </p>
    <fieldset data-smark='{"type":"form","name":"personal_data"}'>
        <p>
            <label data-smark>Name:</label>
            <input name='name' value='John' data-smark>
        </p>
        <p>
            <label data-smark>Surname:</label>
            <input name='surname' value='Doe' data-smark>
        </p>
        <fieldset data-smark='{"type":"form","name":"contact"}'>
            <p>
                <label data-smark>Phone:</label>
                <input name='phone' type='tel' value='555444999' data-smark>
            </p>
            <p>
                <label data-smark>eMail:</label>
                <input name='email' type='mail' value='john@dohe.example.org' data-smark>
            </p>
        </fieldset>
    </fieldset>
    <p><button data-smark='{"action":"export"}'>👀 Export data</button></p>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture nested_forms_example_js {{{ --> {% endraw %}
{% capture nested_forms_example_js %}const myForm = new SmarkForm(document.getElementById("myForm$$"));
myForm.on("AfterAction_export", ({data})=>{
    window.alert(JSON.stringify(data, null, 4));
});{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture nested_forms_example_notes {{{ --> {% endraw %}
{% capture nested_forms_example_notes %}
👉 This example comes with pre-filled values to make it more illustrative,
but feel free to change them if you like.

👉 We could have also added nested lists (to allow multiple phone numbers
and/or emails).
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture fixed_list_example {{{ --> {% endraw %}
{% capture fixed_list_example %}<div id="myForm$$">
    <b>Phones:</b>
    <ul data-smark='{"type":"list","name":"phones","of":"input","min_items":3}'>
        <li>
            <input data-smark type="tel" placeholder="Phone number" />
        </li>
    </ul>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture fixed_list_example_notes {{{ --> {% endraw %}
{% capture fixed_list_example_notes %}
👉 Here we used the *min_items* property to ensure at least 3 items are
   laid out.

💡 Having we have not (yet) disposed any mechanism for the list to grow,
   this works as a fixed-length list.

ℹ️  *min_items* default value is 1, but we can also set it to 0 to allow
   empty lists.

👉 By default, unless `<input>`, `<textarea>` or `<select>` used as list
item template is rendered as a SmarkForm field of the type *form*
(producing a JSON object for each item). But here we want an array of
phones: not an array of objects with a phone...
       
➡️  ...The `of` property allows us to use a different component type (we
   could have also used `<li data-smark="input"> instead.

➡️  ...We could just have used an actual `<input>` tag directly, but that
   would have broken the layout in this case.

➡️  When we assign the "input" (or any other *scalar* type) to an html tag
   different than `<input>`, `<textarea>` or `<select>`, it is expected to
   contain exactly one *SmarkForm* field inside and will export the value
   of that type, not an object with it. **This is called the *singleton*
   pattern**.
{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture pets_list_example {{{ --> {% endraw %}
{% capture pets_list_example %}<div id="myForm$$">
    <div data-smark='{"type":"form","name":"personal_data"}'>
        <b>Pets:</b>
        <ul data-smark='{"type":"list","name":"pets", "sortable":true, "min_items": 0}' class="sortable">
            <li>
                <select name='species' data-smark>
                    <option value="cat">Cat</option>
                    <option value="dog">Dog</option>
                    <option value="hamster">Hamster</option>
                    <option value="fish">Fish</option>
                    <option value="bird">Bird</option>
                    <option value="turtle">Turtle</option>
                    <option value="turtle">Other</option>
                </select>
                <input name='name' placeholder="Name" data-smark>
                <button data-smark='{"action":"removeItem"}' title="Remove Pet">❌</button>
            </li>
        </ul>
        <button data-smark='{"action":"addItem","context":"pets"}'>Add Pet</button>
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture pets_list_example_css {{{ --> {% endraw %}
{% capture pets_list_example_css %}.sortable>* {
    cursor: grab;
}{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture pets_list_example_notes {{{ --> {% endraw %}
{% capture pets_list_example_notes %}
👉 Notice **you can rearrange list items** by simply dragging them having we
   set the *sortable* property to *true*.

👉 Here we added the *sortable* class to list to set propper pointer cursor
   over list items through a simple CSS rule.

🚀 In the future we plan to automatically map all properties of the
   *data-smark* attribute as "data-smark-&lt;prop_name&gt;" like attributes so that
   we will be able to use a selector like `[data-smark-sortable]` in the CSS
   rule and, hence, avoid having to set a custom class in template.
{% endcapture %}
{% raw %} <!-- }}} ]() --> {% endraw %}



{% if include.option == "simple_form" %}

{% include components/sampletabs_tpl.md
    formId="simple_form"
    htmlSource=simple_form_example
    jsSource=simple_form_example_js
    notes=simple_form_example_notes
%}

{% elsif include.option == "inner_exports_form" %}

{% include components/sampletabs_tpl.md
    formId="inner_exports_form"
    htmlSource=inner_exports_form_example
    jsSource=inner_exports_form_example_js
    notes=inner_exports_form_example_notes
    selected="preview"
%}

{% elsif include.option == "nested_forms" %}

{% include components/sampletabs_tpl.md
    formId="nested_forms"
    htmlSource=nested_forms_example
    jsSource=nested_forms_example_js
    notes=nested_forms_example_notes
    selected="preview"
%}

{% elsif include.option == "fixed_list" %}

{% include components/sampletabs_tpl.md
    formId="fixed_list"
    htmlSource=fixed_list_example
    notes=fixed_list_example_notes
%}

{% elsif include.option == "pets_list" %}

{% include components/sampletabs_tpl.md
   formId="pets_list"
   htmlSource=pets_list_example
   cssSource=pets_list_example_css
   notes=pets_list_example_notes
%}

{% endif %}
