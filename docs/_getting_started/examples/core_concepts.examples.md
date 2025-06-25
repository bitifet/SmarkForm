
{% include components/sampletabs_ctrl.md %}





{% if include.option == "simple_XXXXX_form" %}


{% elsif include.option == "pets_list" %}


{% else %}


{% comment %}
    FIXME: This file still exists just to support this until moved to sampletabs.tpl.md as addigional functionality (passing something like htmlSource=null
{% endcomment %}


<div style="border: solid 3px yellow; padding: 0px 2em 1em 2em; border-radius: 0.5em;">
    <h2>🚧  Missing Example 🚧</h2>
    <p>This section is still under construction and this example is not yet available.</p>
    <p style="opacity:.6">Example id: <b>{{ include.option }}</b>.</p>
    <p>🙏 Thank you for your patience.</p>
</div>

{% endif %}
