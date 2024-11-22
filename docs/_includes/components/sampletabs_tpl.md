{% comment %}

Accepted arguments:
-------------------

  * formId (mandatory): Id to insert as "-suffix" in all "$$" hooks;
  * htmlSource (mandatory)
  * cssSource
  * jsSource
  * notes: Optional notes for further clarifications.
  * selected: Default selected tab (defaults to "html").

{% endcomment %}


{% comment %} ### ################################# ### {% endcomment %}
{% comment %} ### Read arguments and apply defaults ### {% endcomment %}
{% comment %} ### ################################# ### {% endcomment %}

{% assign default_htmlSource = '-' %}
{% assign default_cssSource = '-' %}
{% assign default_jsSource = 'const myForm = new SmarkForm(document.getElementById("myForm$$"));' %}
{% assign default_notes = '-' %}


{% assign formId = include.formId | default: "FIXME" %}
{% assign formId = include.formId | default: "FIXME" %}
{% assign formId = "-" | append: formId %}


{% assign htmlSource = include.htmlSource | default: default_htmlSource %}
{% assign cssSource = include.cssSource | default: default_cssSource %}
{% assign jsSource = include.jsSource | default: default_jsSource %}
{% assign notes = include.notes | default: default_notes %}


{% assign current_tab = include.selected | default: "html" %}

{% comment %} ### ##################### ### {% endcomment %}
{% comment %} ### Capture rendered HTML ### {% endcomment %}
{% comment %} ### ##################### ### {% endcomment %}

{% capture rendered_htmlSource | raw %}
```html
{{ htmlSource }}
```
{% endcapture %}



{% comment %} ### #################### ### {% endcomment %}
{% comment %} ### Capture rendered CSS ### {% endcomment %}
{% comment %} ### #################### ### {% endcomment %}

{% capture rendered_cssSource | raw %}
```css
{{ cssSource }}
```
{% endcapture %}



{% comment %} ### ################### ### {% endcomment %}
{% comment %} ### Capture rendered JS ### {% endcomment %}
{% comment %} ### ################### ### {% endcomment %}

{% capture rendered_jsSource %}
```javascript
{{ jsSource }}
```
{% endcapture %}



{% comment %} ### ################################## ### {% endcomment %}
{% comment %} ### Render tabbed layout with examples ### {% endcomment %}
{% comment %} ### ################################## ### {% endcomment %}

<style>
{{ cssSource | raw }}
</style>


<div class="tab-container">
  <div class="tab-labels">
    {% if current_tab == "html" %}{% assign active_class = "tab-label-active" %}{% else %}{% assign active_class = "" %}{% endif %}
    <div class="tab-label {{active_class}}" title="HTML Source">🗒️ HTML</div>
    {% if cssSource != '-' %}
        {% if current_tab == "css" %}{% assign active_class = "tab-label-active" %}{% else %}{% assign active_class = "" %}{% endif %}
        <div class="tab-label {{active_class}}" title="CSS Source">🎨 CSS</div>
    {% endif %}
    {% if jsSource != '-' %}
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
  {% if jsSource != '-' %}
      {% if current_tab == "js" %}{% assign active_class = "tab-active" %}{% else %}{% assign active_class = "" %}{% endif %}
      <div class="tab-content tab-content-js {{active_class}}">
          {{ rendered_jsSource | replace: "$$", "" | markdownify }}
      </div>
  {% endif %}
  {% if current_tab == "preview" %}{% assign active_class = "tab-active" %}{% else %}{% assign active_class = "" %}{% endif %}
  <div class="tab-content tab-content-preview {{active_class}}">
    <div class="smarkform_example">
      {{ htmlSource | replace: "$$", formId | raw }}
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
{% if jsSource != '-' %}
    <script>
        (function() {
            {{ jsSource | replace: "$$", formId }}
        })();
    </script>
{% endif %}
</div>
