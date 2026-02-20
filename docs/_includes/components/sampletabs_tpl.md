{% comment %}

Accepted arguments:
-------------------

  * formId (mandatory): Id to insert as "-suffix" in all "$$" hooks;
  * formOptions: JSON object with SmarkForm initialization options (if any);
  * htmlSource (mandatory)
  * cssSource
  * jsHead: JS initialization code.
  * jsHidden: JS source already discussed (not shown in the "JS Source" tab).
  * jsSource: Actual JS example code to be rendered in the "JS Source" tab.
  * notes: Optional notes for further clarifications.
  * selected: Default selected tab (defaults to "html").
  * showEditor: Whether to show the editor textarea or not (defaults to false)
  * showEditorSource: Whether to show or not the Editor implementation (defaults to false)
  * addLoadSaveButtons: Whether to add the "Load" and "Save" buttons (defaults to false)

Additional arguments
--------------------

Arguments other than the above will be ignored by the documentation renderer.
But you may find others like the following:

  * tests
  * expectedConsoleErrors.
  * expectedPageErrors.

This is because examples in documentation are collected for testing purposes. Those additional
arguments are used by the test runner.

For further details, please refer to the following documentation files:

  * test/WRITING_TESTS.md
  * test/CO_LOCATED_TESTS.md
  * test/IMPLEMENTATION_DETAILS.md

{% endcomment %}


{% comment %} ### ################################# ### {% endcomment %}
{% comment %} ### Read arguments and apply defaults ### {% endcomment %}
{% comment %} ### ################################# ### {% endcomment %}

{% assign default_htmlSource = '-' %}
{% assign default_cssSource = '-' %}
{% if include.demoValue and include.demoValue != '-' %}
  {% capture default_jsHead %}const myForm = new SmarkForm(document.getElementById("myForm$$"), {
    value: {
        demo: {{ include.demoValue }}
    }
});
myForm.on("BeforeAction_reset", async function(ev) {
    ev.preventDefault();
    const editorField = myForm.find("editor");
    const editorValue = editorField ? await editorField.actions.export(null, {silent: true}) : undefined;
    const data = editorValue !== undefined ? {...myForm.defaultValue, editor: editorValue} : myForm.defaultValue;
    await myForm.actions.import(data, {silent: true});
});{% endcapture %}
  {% capture default_jsHead_display %}const myForm = new SmarkForm(document.getElementById("myForm$$"), {
    value: {{ include.demoValue }}
});{% endcapture %}
{% else %}
  {% assign default_jsHead = 'const myForm = new SmarkForm(document.getElementById("myForm$$"));' %}
  {% assign default_jsHead_display = default_jsHead %}
{% endif %}
{% assign default_jsHidden = '-' %}
{% assign default_jsSource = '-' %}
{% assign default_notes = '-' %}
{% assign default_formOptions = '-' %}
{% assign default_demoValue = '-' %}


{% assign formId = include.formId | default: "FIXME" %}
{% assign formId = "-" | append: formId %}


{% assign htmlSource = include.htmlSource | default: default_htmlSource %}
{% assign cssSource = include.cssSource | default: default_cssSource %}
{% assign jsHead = include.jsHead | default: default_jsHead %}
{% assign jsHead_display = include.jsHead | default: default_jsHead_display %}
{% assign jsHidden = include.jsHidden | default: default_jsHidden %}
{% assign jsSource = include.jsSource | default: default_jsSource %}
{% assign notes = include.notes | default: default_notes %}
{% assign formOptions = include.formOptions | default: default_formOptions %}
{% assign demoValue = include.demoValue | default: default_demoValue %}

{% if formOptions == '-' %}
{% assign formOptions_source = "" %}
{% assign formOptions_inner = "" %}
{% else %}
{% assign formOptions_source = " data-smark='" | append: formOptions | append: "'" %}
    {% assign s = formOptions %}
    {% assign inner_len = s | size | minus: 2 %}
    {% assign formOptions_inner = s | slice: 1, inner_len | prepend: ', ' %}
{% endif %}


{% assign current_tab = include.selected | default: "html" %}
{% assign showEditor = include.showEditor | default: false %}
{% assign showEditorSource = include.showEditorSource | default: false %}
{% assign addLoadSaveButtons = include.addLoadSaveButtons | default: false %}


{% comment %} ### ################# ### {% endcomment %}
{% comment %} ### Layout components ### {% endcomment %}
{% comment %} ### ################# ### {% endcomment %}

{% raw %} <!-- default_buttons {{{ --> {% endraw %}
{% capture default_buttons
%}█<span><button
█    data-smark='{"action":"export","context":"demo","target":"../editor"}'
█    title="Export 'demo' subform to 'editor' textarea"
█    >⬇️ Export</button></span>
█<span><button
█    data-smark='{"action":"import","context":"demo","target":"../editor"}'
█    title="Import 'editor' textarea contents to 'demo' subform"
█    >⬆️ Import</button></span>
█<span><button
█    data-smark='{"action":"reset","context":"/"}'
█    title="Reset the demo form to its default values"
█    >♻️ Reset</button></span>
█<span><button
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


{% comment %} ### ######################## ### {% endcomment %}
{% comment %} ### Render (optional) editor ### {% endcomment %}
{% comment %} ### ######################## ### {% endcomment %}

{% raw %} <!-- full_htmlSource {{{ --> {% endraw %}
{% capture full_htmlSource %}<div id="myForm$$">
    <div style="display: flex; flex-direction:column; align-items:left; gap: 1em">
        <div data-smark='{"name":"demo"{{ formOptions_inner | raw }}}' style="flex-grow: 1">{{
htmlSource | replace: "█", "            "
}}        </div>
        <div style="display: flex; justify-content: space-evenly">
{{ default_buttons | replace: "█", "            "
}}        </div>
{{
    json_editor | replace: "█", "        "
}}{%
    if addLoadSaveButtons==true
%}
        <div style="display: flex; justify-content: space-evenly">
{{ load_save_buttons | replace: "█", "            " }}
        </div>{%
endif
%}
    </div>
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% raw %} <!-- partial_htmlSource {{{ --> {% endraw %}
{% capture partial_htmlSource %}<div id="myForm$$"{{ formOptions_source | raw }}>
{{
    htmlSource
    | replace: "█", "    "
}}
</div>{% endcapture %}
{% raw %} <!-- }}} --> {% endraw %}


{% comment %}

    🚧 FIXME!!
    👉 Why the fuck the editor gets unconditionally rendered!!!
  
{% endcomment %}

{% if showEditor == true %}
{% assign preview_source = full_htmlSource %}
{% else %}
{% assign preview_source = partial_htmlSource %}
{% endif %}





{% comment %} ### ##################### ### {% endcomment %}
{% comment %} ### Capture rendered HTML ### {% endcomment %}
{% comment %} ### ##################### ### {% endcomment %}

{% capture rendered_htmlSource | raw %}
```html
{% if showEditorSource
%}{{
    full_htmlSource
}}{% else %}{{
    partial_htmlSource
}}{% endif %}
```
{% endcapture %}


{% comment %} ### #################### ### {% endcomment %}
{% comment %} ### Capture rendered CSS ### {% endcomment %}
{% comment %} ### #################### ### {% endcomment %}

{% capture rendered_cssSource | raw %}
```css
{{ cssSource | replace: " !important", "" }}
```
{% endcapture %}
{% comment %}
    👉 We use !important in some css snippets to avoid Jekyll layout's rules
       precedence in the preview tab.
       But those examples would work in a real page outside of Jekyll so we
       hide it in the source window.
{% endcomment %}


{% comment %} ### ################### ### {% endcomment %}
{% comment %} ### Capture rendered JS ### {% endcomment %}
{% comment %} ### ################### ### {% endcomment %}

{% if jsHead != '-' or jsSource != '-' %}
{% capture rendered_jsSource %}
```javascript
{% if jsHead_display != '-'
%}{{ jsHead_display }}{%
endif %}{% if jsHidden != '-'
%}
/* ... (Code already discussed) ... */
{% endif
%}{% if jsSource != '-' %}{{
    jsSource
}}{% endif %}
```
{% endcapture %}
{% else %}
{% assign rendered_jsSource = '' %}
{% endif %}





{% comment %} ### ################################## ### {% endcomment %}
{% comment %} ### Render tabbed layout with examples ### {% endcomment %}
{% comment %} ### ################################## ### {% endcomment %}

<style>
{{ cssSource | replace: "$$", formId | raw }}
</style>

{% if htmlSource == default_htmlSource %}
<div style="border: solid 3px yellow; padding: 0px 2em 1em 2em; border-radius: 0.5em;">
    <h2>🚧  Missing Example 🚧</h2>
    <p>This section is still under construction and this example is not yet available.</p>
    <p style="opacity:.6">Example id: <b>{{ include.option }}</b>.</p>
    <p>🙏 Thank you for your patience.</p>
</div>
{% else %}
<div id="example{{ formId }}" class="tab-container">
  <a href="#example{{ formId }}" class="link-anchor" title="Link">🔗</a>
  <div class="tab-labels">
    {% if current_tab == "html" %}{% assign active_class = "tab-label-active" %}{% else %}{% assign active_class = "" %}{% endif %}
    <div class="tab-label {{active_class}}" title="HTML Source">🗒️ HTML</div>
    {% if cssSource != '-' %}
        {% if current_tab == "css" %}{% assign active_class = "tab-label-active" %}{% else %}{% assign active_class = "" %}{% endif %}
        <div class="tab-label {{active_class}}" title="CSS Source">🎨 CSS</div>
    {% endif %}
    {% if jsHead != '-' or jsSource != '-' %}
        {% if current_tab == "js" %}{% assign active_class = "tab-label-active" %}{% else %}{% assign active_class = "" %}{% endif %}
        <div class="tab-label {{active_class}}" title="JS Source">⚙️  JS</div>
    {% endif %}
    {% if current_tab == "preview" %}{% assign active_class = "tab-label-active" %}{% else %}{% assign active_class = "" %}{% endif %}
    <div class="tab-label {{active_class}}" title="Live Preview">👁️ Preview</div>
    {% if notes != '-' %}
        {% if current_tab == "notes" %}{% assign active_class = "tab-label-active" %}{% else %}{% assign active_class = "" %}{% endif %}
        <div class="tab-label tab-label-right {{active_class}}" title="Notes">📝 Notes</div>
    {% endif %}
  </div>
  {% if current_tab == "html" %}{% assign active_class = "tab-active" %}{% else %}{% assign active_class = "" %}{% endif %}
  <div class="tab-content tab-content-html {{active_class}}">
    {{ rendered_htmlSource | replace: "$$", "" | markdownify }}
  </div>
  {% if cssSource != '-' %}
      {% if current_tab == "css" %}{% assign active_class = "tab-active" %}{% else %}{% assign active_class = "" %}{% endif %}
      <div class="tab-content tab-content-css {{active_class}}">
          {{ rendered_cssSource | replace: "$$", "" | markdownify }}
      </div>
  {% endif %}
  {% if jsHead != '-' or jsSource != '-' %}
      {% if current_tab == "js" %}{% assign active_class = "tab-active" %}{% else %}{% assign active_class = "" %}{% endif %}
      <div class="tab-content tab-content-js {{active_class}}">
          {{ rendered_jsSource | replace: "$$", "" | markdownify }}
      </div>
  {% endif %}
  {% if current_tab == "preview" %}{% assign active_class = "tab-active" %}{% else %}{% assign active_class = "" %}{% endif %}
  <div class="tab-content tab-content-preview {{active_class}}">
    <div class="smarkform_example" style="overflow: auto">
      {{ preview_source | replace: "$$", formId | raw }}
    </div>
  </div>
  {% if notes != '-' %}
    {% if current_tab == "notes" %}{% assign active_class = "tab-active" %}{% else %}{% assign active_class = "" %}{% endif %}
    <div class="tab-content tab-content-notes {{active_class}}">
        {{ notes | markdownify }}
    </div>
  {% endif %}
</div>
<div>
{% if jsHead != '-' or jsHidden != '-' or jsSource != '-' %}
    <script>
        (function() {
            {% if jsHead != '-' %}
{{ jsHead  | replace: "$$", formId }}
            {% endif %}
            {% if jsHidden != '-' %}
{{ jsHidden  | replace: "$$", formId }}
            {% endif %}
            {% if jsSource != '-' %}
{{ jsSource | replace: "$$", formId }}
            {% endif %}
        })();
    </script>
{% endif %}
</div>
{% endif %}

