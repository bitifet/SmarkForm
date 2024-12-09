
{% include components/sampletabs_ctrl.md %}


{% raw %} <!-- capture simple_list_example {{{ --> {% endraw %}
{% capture simple_list_example %}<div id="myForm$$">
    <section data-smark='{"type":"list","name":"users"}'><!-- 1️⃣  -->
        <fieldset><!-- 2️⃣ , 3️⃣ , 6️⃣  -->
            <input name='name' placeholder='User name' type='text' data-smark/>
            <input name='phone' placeholder='Phone number' type='tel' data-smark/>
            <input name='email' placeholder='Email' type='text' data-smark/>
            <button data-smark='{"action":"removeItem"}' title='Remove User'>❌</button>
        </fieldset>
    </section>
    <button data-smark='{"action":"addItem","context":"users"}' title='Add User'>➕</button>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture scalar_list_example {{{ --> {% endraw %}
{% capture scalar_list_example %}<div id="myForm$$">
    <section data-smark='{"type":"list","name":"phones"}'>
        <input placeholder='Phone number' type='tel'/><!-- 4️⃣ , 6️⃣  -->
    </section>
    <button data-smark='{"action":"addItem","context":"phones"}' title='Add Phone'>➕</button>
    <button data-smark='{"action":"removeItem","context":"phones"}' title='Remove Phone'>❌</button> <!-- 5️⃣  -->
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture singleton_list_example {{{ --> {% endraw %}
{% capture singleton_list_example %}<div id="myForm$$">
    <ul data-smark='{"name": "phones", "of": "input", "max_items": 3}'>
        <li>
            <input placeholder='Phone Number' type="tel" data-smark>
            <button data-smark='{"action":"removeItem"}' title='Remove Phone'>❌</button>
        </li>
    </ul>
    <button data-smark='{"action":"addItem","context":"phones"}' title='Add Phone'>➕</button>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture nesting_list_example {{{ --> {% endraw %}
{% capture nesting_list_example %}<div id="myForm$$">
    <section data-smark='{"type":"list","name":"users"}'>
        <fieldset>
            <input name='name' placeholder='User name' type='text' data-smark/>
            <hr>
            <ul data-smark='{"type": "list", "name": "phones", "of": "input", "max_items": 3}'>
                <li>
                    <input placeholder='Phone Number' type="tel" data-smark>
                    <button data-smark='{"action":"removeItem"}' title='Remove Phone'>❌</button>
                </li>
            </ul>
            <button data-smark='{"action":"addItem","context":"phones"}' title='Add Phone'>➕</button>
            <hr>
            <ul data-smark='{"type": "list", "name": "emails", "of": "input", "max_items": 3}'>
                <li>
                    <input placeholder='Email address' type="email" data-smark>
                    <button data-smark='{"action":"removeItem"}' title='Remove Email'>❌</button>
                </li>
            </ul>
            <button data-smark='{"action":"addItem","context":"emails"}' title='Add Email'>➕</button>
            <hr>
            <button data-smark='{"action":"removeItem"}' title='Remove User'>❌</button>
        </fieldset>
    </section>
    <button data-smark='{"action":"addItem","context":"users"}' title='Add User'>➕</button>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture simple_list_animation_example {{{ --> {% endraw %}
{% capture simple_list_animation_example %}<div id="myForm$$">
    <button data-smark='{"action":"addItem","context":"phones"}' title='Add Phone'>➕ Add Phone</button>
    <ul data-smark='{"name": "phones", "of": "input", "min_items": 0}'>
        <li>
            <input placeholder='Phone Number' type="tel" data-smark>
            <button data-smark='{"action":"removeItem"}' title='Remove Phone'>❌</button>
        </li>
    </ul>
    <!-- This is just a regular SmarkForm list. -->
    <!-- See CSS and JS code to see what changes... -->
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% raw %} <!-- capture generic_sample_css {{{ --> {% endraw %}
{% capture generic_sample_css %}button:disabled {
    opacity: .5;
}{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture simple_list_animation_example_additem_css {{{ --> {% endraw %}
{% capture simple_list_animation_example_additem_css %}.animated_item {
    transform: scaleY(0) translateY(-50%);
}
.animated_item.ongoing {
    transform: default;
    transition:
        transform 150ms ease-in
    ;
}{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture simple_list_animation_example_complete_css {{{ --> {% endraw %}
{% capture simple_list_animation_example_complete_css %}.animated_item {
    transform: scaleY(0) translateY(-50%);
    /* Add transition for removal effect */
    transition:
        transform 150ms ease-out
    ;
}
.animated_item.ongoing {
    transform: scaleY(1) translateY(0%);
    transition:
        transform 150ms ease-in
    ;
}{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% raw %} <!-- capture simple_list_animation_example_additem_js {{{ --> {% endraw %}
{% capture simple_list_animation_example_additem_js %}const myForm = new SmarkForm(document.getElementById("myForm$$"));
const delay = ms=>new Promise(resolve=>setTimeout(resolve, ms));
myForm.onAll("addItem", function({
    newItemTarget, /* the targetNode of the future new item */
    onRendered
}) {
    newItemTarget.classList.add("animated_item");
    onRendered(async (newItem)=>{
        await delay(1); /* Allow for default .animated_item style to be applied */
        newItem.targetNode.classList.add("ongoing");
        /* Here we could have used newItemTarget instead */
    });
});{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- capture simple_list_animation_example_complete_js {{{ --> {% endraw %}
{% capture simple_list_animation_example_complete_js %}const myForm = new SmarkForm(document.getElementById("myForm$$"));
const delay = ms=>new Promise(resolve=>setTimeout(resolve, ms));
myForm.onAll("addItem", function({
    newItemTarget, /* the targetNode of the future new item */
    onRendered
}) {
    newItemTarget.classList.add("animated_item");
    onRendered(async (newItem)=>{
        await delay(1); /* Allow for default .animated_item style to be applied */
        newItem.targetNode.classList.add("ongoing");
        /* Here we could have used newItemTarget instead */
    });
});
myForm.onAll("removeItem", async function({
    oldItemTarget,
    onRemmoved
}) {
    oldItemTarget.classList.remove("ongoing");
    /* Await for transition to be finished before item removal: */
    await delay(150);
});{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% if include.option == "simple_list" %}

{% include components/sampletabs_tpl.md
   formId="simple_list"
   htmlSource=simple_list_example
   cssSource=generic_sample_css
%}

{% elsif include.option == "scalar_list" %}

{% include components/sampletabs_tpl.md
   formId="scalar_list"
   htmlSource=scalar_list_example
   cssSource=generic_sample_css
%}

{% elsif include.option == "singleton_list" %}

{% include components/sampletabs_tpl.md
   formId="singleton_list"
   htmlSource=singleton_list_example
   cssSource=generic_sample_css
%}

{% elsif include.option == "nesting_list" %}

{% include components/sampletabs_tpl.md
   formId="nesting_list"
   htmlSource=nesting_list_example
   cssSource=generic_sample_css
%}

{% elsif include.option == "simple_list_animation_additem" %}

{% include components/sampletabs_tpl.md
   formId="simple_list_animation_additem"
   htmlSource=simple_list_animation_example
   cssSource=simple_list_animation_example_additem_css
   jsSource=simple_list_animation_example_additem_js
%}

{% elsif include.option == "simple_list_animation_complete" %}

{% include components/sampletabs_tpl.md
   formId="simple_list_animation_complete"
   htmlSource=simple_list_animation_example
   cssSource=simple_list_animation_example_complete_css
   jsSource=simple_list_animation_example_complete_js
%}

{% endif %}
