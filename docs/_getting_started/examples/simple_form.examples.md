
{% include components/sampletabs_ctrl.md %}

{% raw %} <!-- html_source_legacy {{{ --> {% endraw %}
{% capture html_source_legacy %}<div id="myForm$$">
    <p>
        <label for="nameField$$">Name:</label>
        <input type="text" id="nameField$$" name="name">
    </p>
    <p>
        <label for="emailField$$">Email:</label>
        <input type="email" id="emailField$$" name="email">
    </p>
    <p>
        <button>❌ Clear</button>
        <button>💾 Submit</button>
    </p>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- html_source_enhanced {{{ --> {% endraw %}
{% capture html_source_enhanced %}<div id="myForm$$">
    <p>
        <label data-smark>Name:</label>
        <input type="text" name="name" data-smark>
    </p>
    <p>
        <label data-smark>Email:</label>
        <input type="email" name="email" data-smark>
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

{% raw %} <!-- confirm_cancel_example_js {{{ --> {% endraw %}
{% capture confirm_cancel_example_js: %}{{ form_export_example_js }}
/* Ask for confirmation unless form is already empty: */
myForm.on("BeforeAction_clear", async ({context, preventDefault}) => {
    if (
        ! await context.isEmpty()     /* Form is not empty */
        && ! confirm("Are you sure?") /* User clicked the "Cancel" btn. */
    ) {
        /* Prevent default (clear form) behaviour: */
        preventDefault();
    };
});{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}



{% if include.option == "legacy" %}

  {% include components/sampletabs_tpl.md
    formId="simple_legacy"
    htmlSource=html_source_legacy
    jsSource="-"
  %}

{% elsif include.option == "initialized" %}

  {% include components/sampletabs_tpl.md
    formId="simple_initialized"
    htmlSource=html_source_legacy
    selected="js"
  %}

{% elsif include.option == "minimal" %}

    {% include components/sampletabs_tpl.md
        formId="enhanced_simple_form"
        htmlSource=html_source_enhanced
    %}

{% elsif include.option == "withExport" %}

    {% include components/sampletabs_tpl.md
        formId="enhanced_withExport"
        htmlSource=html_source_enhanced
        jsSource=form_export_example_js
        selected="js"
    %}

{% elsif include.option == "withConfirmCancel" %}

    {% include components/sampletabs_tpl.md
        formId="enhanced_confirmCancel"
        htmlSource=html_source_enhanced
        jsSource=confirm_cancel_example_js
        selected="js"
    %}

{% endif %}
