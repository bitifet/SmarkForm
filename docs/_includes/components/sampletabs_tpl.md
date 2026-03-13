{% comment %}

Accepted arguments:
-------------------

  * formId (mandatory): Id to insert as "-suffix" in all "$$" hooks;
  * formOptions: JSON object with SmarkForm initialization options (if any);
  * htmlSource (mandatory)
  * cssSource
  * cssHidden: CSS already discussed (not shown in the "CSS Source" tab).
  * jsHead: JS initialization code.
  * jsHidden: JS source already discussed (not shown in the "JS Source" tab).
  * jsSource: Actual JS example code to be rendered in the "JS Source" tab.
  * notes: Optional notes for further clarifications.
  * selected: Default selected tab (defaults to "html").
  * showEditor: Whether to show the editor textarea or not (defaults to false)
  * showEditorSource: Whether to show or not the Editor implementation (defaults to false)
  * addLoadSaveButtons: Whether to add the "Load" and "Save" buttons (defaults to false)
  * height: Optional iframe height factor (0–100). If omitted, a default is computed from the
            HTML source line count. Larger values allow a taller iframe relative to the viewport.

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
  {% assign default_jsHead = 'const myForm = new SmarkForm(document.getElementById("myForm$$"));' %}
  {% capture default_jsHead_display %}const myForm = new SmarkForm(document.getElementById("myForm$$"), {
    value: {{ include.demoValue }}
});{% endcapture %}
  {% capture default_jsHead_display_with_editor %}const myForm = new SmarkForm(document.getElementById("myForm$$"), {
    value: {"demo": {{ include.demoValue }}}
});{% endcapture %}
{% else %}
  {% assign default_jsHead = 'const myForm = new SmarkForm(document.getElementById("myForm$$"));' %}
  {% assign default_jsHead_display = default_jsHead %}
  {% assign default_jsHead_display_with_editor = default_jsHead %}
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
{% assign cssHidden = include.cssHidden | default: '-' %}
{% assign jsHead = include.jsHead | default: default_jsHead %}
{% assign jsHead_display = include.jsHead | default: default_jsHead_display %}
{% assign jsHead_display_with_editor = include.jsHead | default: default_jsHead_display_with_editor %}
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

{% if demoValue != '-' %}
{% assign demoValue_inner = ',"value":' | append: demoValue %}
{% else %}
{% assign demoValue_inner = '' %}
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
█    data-smark='{"action":"import","context":"demo","target":"../editor","setDefault":false}'
█    title="Import 'editor' textarea contents to 'demo' subform"
█    >⬆️ Import</button></span>
█<span><button
█    data-smark='{"action":"reset","context":"demo"}'
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
█    placeholder="JSON playground editor"
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

{% assign htmlSource_root_check = htmlSource | replace: "█", "" | lstrip | downcase | slice: 0, 6 %}
{% raw %} <!-- partial_htmlSource {{{ --> {% endraw %}
{% if htmlSource_root_check == "<form " or htmlSource_root_check == "<form>" %}
{% capture partial_htmlSource %}{{ htmlSource | replace: "█", "    " | lstrip }}{% endcapture %}
{% else %}
{% capture partial_htmlSource %}<div id="myForm$$"{{ formOptions_source | raw }}>
{{
    htmlSource
    | replace: "█", "    "
}}
</div>{% endcapture %}
{% endif %}
{% raw %} <!-- }}} --> {% endraw %}


{% comment %} ### ############################################## ### {% endcomment %}
{% comment %} ### Pass optional height override to controller  ### {% endcomment %}
{% comment %} ### (sanitization and formula live in the JS)    ### {% endcomment %}
{% comment %} ### ############################################## ### {% endcomment %}

{% comment %}
    Pass the raw include.height value (0 when omitted) to the JSON blob so the
    JavaScript controller can apply the formula, defaults and clamping there.
{% endcomment %}


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
    {% if current_tab == "hint" %}{% assign active_class = "tab-label-active" %}{% else %}{% assign active_class = "" %}{% endif %}
    {% if notes == '-' %}{% assign hint_right_class = "tab-label-right" %}{% else %}{% assign hint_right_class = "" %}{% endif %}
    <div class="tab-label {{hint_right_class}} {{active_class}}" title="Help">❓</div>
  </div>
  <div class="smarkform-edit-toolbar">
    <label><input type="checkbox" class="smarkform-edit-toggle"> ✏️ Edit</label>
    <label class="smarkform-editor-label" style="display:none"><input type="checkbox" class="smarkform-editor-toggle" disabled> 📋 Include editor <span class="smarkform-hint-icon" title="The JSON playground editor is part of the SmarkForm form itself — it is just omitted from the code snippets to keep the examples focused. In edit mode it is not included in the snippets by default, but you can add it back by checking this box. Note: for some examples the editor is intentionally excluded and this checkbox is disabled.">ℹ️</span></label>
    <button class="smarkform-run-btn" style="display:none">▶️ Run</button>
  </div>
  {% if current_tab == "html" %}{% assign active_class = "tab-active" %}{% else %}{% assign active_class = "" %}{% endif %}
  <div class="tab-content tab-code tab-content-html {{active_class}}">
    {{ rendered_htmlSource | replace: "$$", "" | markdownify }}
  </div>
  {% if cssSource != '-' %}
      {% if current_tab == "css" %}{% assign active_class = "tab-active" %}{% else %}{% assign active_class = "" %}{% endif %}
      <div class="tab-content tab-code tab-content-css {{active_class}}">
          {{ rendered_cssSource | replace: "$$", "" | markdownify }}
      </div>
  {% endif %}
  {% if jsHead != '-' or jsSource != '-' %}
      {% if current_tab == "js" %}{% assign active_class = "tab-active" %}{% else %}{% assign active_class = "" %}{% endif %}
      <div class="tab-content tab-code tab-content-js {{active_class}}">
          {{ rendered_jsSource | replace: "$$", "" | markdownify }}
      </div>
  {% endif %}
  {% if current_tab == "preview" %}{% assign active_class = "tab-active" %}{% else %}{% assign active_class = "" %}{% endif %}
  <div class="tab-content tab-content-preview {{active_class}}">
    <div class="smarkform_example" style="overflow: auto">
      <div class="smarkform-preview-spinner"></div>
      <iframe class="smarkform-preview-frame" style="width:100%;border:none;display:none;"></iframe>
    </div>
  </div>
  {% if notes != '-' %}
    {% if current_tab == "notes" %}{% assign active_class = "tab-active" %}{% else %}{% assign active_class = "" %}{% endif %}
    <div class="tab-content tab-content-notes {{active_class}}">
        {{ notes | markdownify }}
    </div>
  {% endif %}
  {% if current_tab == "hint" %}{% assign active_class = "tab-active" %}{% else %}{% assign active_class = "" %}{% endif %}
  <div class="tab-content tab-content-hint {{active_class}}">
    <p>Every example in this section comes with many of the following tabs:</p>
    <ul>
      <li data-bullet="🗒️"><b>HTML:</b> HTML source code of the example.</li>
      <li data-bullet="🎨"><b>CSS:</b> CSS applied (if any).</li>
      <li data-bullet="⚙️ "><b>JS:</b> JavaScript source code of the example.</li>
      <li data-bullet="👁️"><b>Preview:</b> Live, sandboxed rendering of the example — fully isolated from the page styles.</li>
      <li data-bullet="📝"><b>Notes:</b> Additional notes and insights for better understanding. <b style="color:red">Don't miss it‼️</b></li>
    </ul>
    {% if showEditor == true %}
    <p>✨ In the <strong>Preview</strong> tab, a <em>JSON playground editor</em> is available with handy buttons:</p>
    <ul>
      <li><code>⬇️ Export</code> to export the form data to the <em>JSON playground editor</em>.</li>
      <li><code>⬆️ Import</code> to import data from the <em>JSON playground editor</em> into the form.</li>
      <li><code>♻️ Reset</code> to reset the form to its default values.</li>
      <li><code>❌ Clear</code> to clear the whole form.</li>
    </ul>
    <p>💡 The <em>JSON playground editor</em> is part of the SmarkForm form itself — it is just omitted from the code snippets to keep the examples focused on what matters.</p>
    {% endif %}
    <p>🛠️ Between the tab labels and the content there is always an <strong>edit toolbar</strong>:</p>
    <ul>
      <li><code>✏️ Edit</code> — activates edit mode: each source tab turns into a syntax-highlighted code editor (powered by <a href="https://ace.c9.io/" target="_blank">Ace</a>) pre-filled with the full, merged source. Changes are sandboxed — the original example is not affected.</li>
      <li><code>📋 Include editor</code> — (only visible in edit mode) controls whether the <em>JSON playground editor</em> is included in the preview. When toggled, the HTML and JS editors update instantly so you can see exactly what code is needed to add or remove it.{% if showEditor == false %} <em>Disabled for this example.</em>{% endif %}</li>
      <li><code>▶️ Run</code> — (only visible in edit mode) re-renders the Preview from the current editor contents and switches to the Preview tab.</li>
    </ul>
  </div>
  <script type="application/json" class="smarkform-src-data">
  {
    "html": {{ preview_source | jsonify | replace: "<", "\u003c" }},
    "htmlSource": {{ partial_htmlSource | jsonify | replace: "<", "\u003c" }},
    "css": {{ cssSource | jsonify | replace: "<", "\u003c" }},
    "cssHidden": {{ cssHidden | jsonify | replace: "<", "\u003c" }},
    "jsHead": {{ jsHead | jsonify | replace: "<", "\u003c" }},
    "jsHeadDisplay": {{ jsHead_display | jsonify | replace: "<", "\u003c" }},
    "jsHeadDisplayWithEditor": {{ jsHead_display_with_editor | jsonify | replace: "<", "\u003c" }},
    "jsHidden": {{ jsHidden | jsonify | replace: "<", "\u003c" }},
    "jsSource": {{ jsSource | jsonify | replace: "<", "\u003c" }},
    "showEditor": {{ showEditor | jsonify }},
    "height": {{ include.height | plus: 0 }},
    "smarkformUrl": "{{ smarkform_umd_dld_link }}?v={{ site.time | date: '%s' }}"
  }
  </script>
</div>
{% endif %}

