{% comment %}

Accepted arguments:
-------------------

  * formId (mandatory): Id to insert as "-suffix" in all "$$" hooks;
  * formOptions: (Removed in v2 — embed SmarkForm options directly in the data-smark attribute on your form container)
  * showEditor: Whether to show the editor textarea or not (defaults to false)
  * showEditorSource: Whether to show or not the Editor implementation (defaults to false)
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

{% capture no_reset_editor_hack -%}
// JSON playground editor hack:
// To avoid the reset button resetting the editor along with the form, we did two things:
//   1. We left the "editor" property undefined in the default value (so it fills with its own default value).
//   2. Import its own contents on every change to keep its default value updated.
// ...this preserves user edits when the "reset" button is clicked.
myForm.rendered.then(function() {
    const editor = myForm.find('/editor');
    editor.on('change', async function() {
        // Import its own value to set it as default:
        await this.import(
            await this.export()
        );
    });
});
{%- endcapture %}

{% assign default_htmlSource = '-' %}
{% assign default_cssSource = '-' %}
{% if include.demoValue and include.demoValue != '-' %}
  {% assign default_jsHead = 'const myForm = new SmarkForm(document.getElementById("myForm$$"));' %}
  {% capture default_jsHead_display %}const myForm = new SmarkForm(document.getElementById("myForm$$"), {
    "value": {{ include.demoValue }}
});
{%- endcapture %}
  {% capture default_jsHead_display_with_editor %}const myForm = new SmarkForm(document.getElementById("myForm$$"), {
    "value": {
        // To implement the playground editor, the form of the example is
        // wrapped in a "demo" subform, so the default value should be wrapped
        // accordingly:
        "demo": {{ include.demoValue }},
    }
});
{{ no_reset_editor_hack }}
{%- endcapture %}
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
{% assign demoValue = include.demoValue | default: default_demoValue %}


{% assign current_tab = include.selected | default: "html" %}
{% assign showEditor = include.showEditor | default: false %}



{% comment %} ### ############################################## ### {% endcomment %}
{% comment %} ### Build partial_htmlSource (used as preview)   ### {% endcomment %}
{% comment %} ### ############################################## ### {% endcomment %}

{% raw %} <!-- partial_htmlSource {{{ --> {% endraw %}
{% capture partial_htmlSource %}{{ htmlSource | replace: "█", "    " | lstrip }}
{%- endcapture %}
{% raw %} <!-- }}} --> {% endraw %}

{% comment %}
    Pass the raw include.height value (0 when omitted) to the JSON blob so the
    JavaScript controller can apply the formula, defaults and clamping there.
{% endcomment %}

{% assign preview_source = partial_htmlSource %}





{% comment %} ### ##################### ### {% endcomment %}
{% comment %} ### Capture rendered HTML ### {% endcomment %}
{% comment %} ### ##################### ### {% endcomment %}

{% capture rendered_htmlSource | raw %}
```html
{{ partial_htmlSource }}
```
{%- endcapture %}


{% comment %} ### #################### ### {% endcomment %}
{% comment %} ### Capture rendered CSS ### {% endcomment %}
{% comment %} ### #################### ### {% endcomment %}

{% capture rendered_cssSource | raw %}
```css
{{ cssSource | replace: " !important", "" }}
```
{%- endcapture %}
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
{% capture rendered_jsSource -%}
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
{%- endcapture %}
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
    {% if current_tab == "css" %}{% assign active_class = "tab-label-active" %}{% else %}{% assign active_class = "" %}{% endif %}
    {% if cssSource == '-' %}<div class="tab-label {{active_class}}" style="opacity:0.4" title="CSS Source (empty)">🎨 CSS</div>
    {% else %}<div class="tab-label {{active_class}}" title="CSS Source">🎨 CSS</div>
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
    <label class="smarkform-editor-label" style="display:none"><input type="checkbox" class="smarkform-editor-toggle" disabled> 📋 Include playground editor <span class="smarkform-hint-icon" title="The JSON playground editor is part of the SmarkForm form itself — it is just omitted from the code snippets to keep the examples focused. In edit mode it is not included in the snippets by default, but you can add it back by checking this box. Note: for some examples the editor is intentionally excluded and this checkbox is disabled.">ℹ️</span></label>
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
  {% else %}
      {% if current_tab == "css" %}{% assign active_class = "tab-active" %}{% else %}{% assign active_class = "" %}{% endif %}
      <div class="tab-content tab-code tab-content-css {{active_class}}">
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
      <li><code>📋 Include playground editor</code> — (only visible in edit mode) controls whether the <em>JSON playground editor</em> is included in the preview. When toggled, the HTML and JS editors update instantly so you can see exactly what code is needed to add or remove it.{% if showEditor == false %} <em>Disabled for this example.</em>{% endif %}</li>
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
    "demoValue": {{ demoValue | jsonify }},
    "showEditor": {{ showEditor | jsonify }},
    "height": {{ include.height | plus: 0 }},
    "smarkformUrl": "{{ smarkform_umd_dld_link }}?v={{ site.time | date: '%s' }}"
  }
  </script>
</div>
{% endif %}

