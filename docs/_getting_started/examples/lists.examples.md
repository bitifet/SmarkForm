
{% include components/sampletabs_ctrl.md %}


{% capture html_phone_list %}<div id="myForm$$">
<div data-smark='{"name":"phones","type":"list","of":"input","max_items":6,"sortable":true}'>
    <div>
    <button data-smark='{"action":"removeItem","hotkey":"-"}' title='Remove this item'><span role='img' aria-label='Remove this item'>➖</span></button>
    <input data-smark='data-smark' type='tel' placeholder='Telephone'/>
    <button data-smark='{"action":"addItem","hotkey":"+"}' title='Add new item below'><span role='img' aria-label='Add new item'>➕</span></button>
    </div>
</div>
<p>
    <button data-smark='{"action":"empty"}'>❌ Clear</button>
    <button data-smark='{"action":"export"}'>💾 Submit</button>
</p>
</div>{% endcapture %}


{% capture html_schedule_list %}<div id="myForm$$">
<p>
    <button data-smark='{"action":"removeItem","hotkey":"-","context":"surveillance_schedule"}' title='Less intervals'>
        <span role='img' aria-label='Remove interval'>➖</span>
    </button>
    <button data-smark='{"action":"addItem","hotkey":"+","context":"surveillance_schedule"}' title='More intrevals'>
        <span role='img' aria-label='Add new interval'>➕</span>
    </button>
    <label>Schedule:</label>
    <span data-smark='{"type":"list","name":"surveillance_schedule","min_items":0,"max_items":3}'>
        <span>
            <input data-smark type='time' name='start'/>
            to
            <input data-smark type='time' name='end'/>
        </span>
        <span data-smark='{"role":"empty_list"}'>(Closed)</span>
    </span>
</p>
<p>
    <button data-smark='{"action":"empty"}'>❌ Clear</button>
    <button data-smark='{"action":"export"}'>💾 Submit</button>
</p>
</div>{% endcapture %}



{% capture advanced_sample_css %}/* Emphasize disabled buttons */
button:disabled {
    opacity: .5;
}

/* Reveal hotkey hints */
button[data-hotkey] {
    position: relative;
    overflow-x: display;
}
button[data-hotkey]::before {
    content: attr(data-hotkey);

    display: inline-block;
    position: absolute;
    top: 2px;
    left: 2px;
    z-index: 10;

    background-color: #ffd;
    outline: 1px solid lightyellow;
    padding: 1px 4px;
    border-radius: 4px;
    font-weight: bold;

    transform: scale(1.4) translate(.1em, .1em);

}{% endcapture %}

{% capture default_js: %}const myForm = new SmarkForm(document.getElementById("myForm$$"));
/* Show exported data in an alert() window */
myForm.on("AfterAction_export", ({data})=>{
    window.alert(JSON.stringify(data, null, 4));
});
/* Ask for confirmation unless form is already empty: */
myForm.on("BeforeAction_empty", async ({context, preventDefault}) => {
    if (
        ! await context.isEmpty()     /* Form is not empty */
        && ! confirm("Are you sure?") /* User clicked the "Cancel" btn. */
    ) {
        /* Prevent default (empty form) behaviour: */
        preventDefault();
    };
});{% endcapture %}

{%capture phone_list_form_example_notes %}👉 Limited to a **maximum of 6** numbers.

👉 Notice trigger butons **get propperly disabled** when limits reached.

👉 They are also excluded from keyboard navigation for better navigation with `tab` / `shift`+`tab`.

👉 Even thought they can be triggered from keyboard through configured (`Ctrl`-`+` and `Ctrl-`-`) hot keys.

👉 ...Notice what happen when you hit the `ctrl` key while editing...

👉 Also note that, when you click the `💾 Submit` button **only non empty items get exported**.

👉 ...You can prevent this behaviour by setting the *exportEmpteis* property to *true*.

👉 Change items order by just dragging and dropping them.

{% endcapture %}


{% if include.option == "phones" %}

  {% include components/sampletabs_tpl.md
    formId="telephone_list"
    htmlSource=html_phone_list
    cssSource=advanced_sample_css
    jsSource=default_js
    notes=phone_list_form_example_notes
    selected="preview"
  %}

{% elsif include.option == "schedule" %}

  {% include components/sampletabs_tpl.md
    formId="schedule_list"
    htmlSource=html_schedule_list
    cssSource="-"
    jsSource=default_js
    selected="preview"
  %}


{% endif %}



