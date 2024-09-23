{% comment %} ###  ### {% endcomment %}
{% comment %} ###  ### {% endcomment %}
{% comment %} ###  ### {% endcomment %}


{% comment %} ### ################################# ### {% endcomment %}
{% comment %} ### Read arguments and apply defaults ### {% endcomment %}
{% comment %} ### ################################# ### {% endcomment %}

{% capture default_jsSource %}const myForm = new SmarkForm(document.getElementById("myForm"));{% endcapture %}


{% assign formId = include.formId | default: "FIXME" %}
{% assign htmlSource = include.htmlSource | default: default_htmlSource %}
{% assign cssSource = include.cssSource | default: default_cssSource %}
{% assign jsSource = include.jsSource | default: default_jsSource %}
{% assign notes = include.notes | default: default_notes %}


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
    <div class="tab-label tab-label-active" title="HTML Source">🗒️ HTML</div>
    {% if cssSource %}
        <div class="tab-label" title="CSS Source">🎨 CSS</div>
    {% endif %}
    {% if jsSource %}
        <div class="tab-label" title="JS Source">⚙️  JS</div>
    {% endif %}
        <div class="tab-label" title="Live Preview">👁️ Preview</div>
    {% if notes %}
        <div class="tab-label tab-label-right" title="Notes">📝 Notes</div>
    {% endif %}
  </div>
  <div class="tab-content tab-active">
    {{ rendered_htmlSource | markdownify }}
  </div>
  {% if cssSource %}
      <div class="tab-content">
          {{ rendered_cssSource | markdownify }}
      </div>
  {% endif %}
  {% if jsSource %}
      <div class="tab-content">
          {{ rendered_jsSource | markdownify }}
      </div>
  {% endif %}
  <div class="tab-content">
    <div class="smarkform_example">
      {{ htmlSource | replace: "myForm", formId | raw }}
    </div>
  </div>
  {% if notes %}
    <div class="tab-content">
        {{ notes | markdownify }}
    </div>
  {% endif %}
</div>
<div>
<script>
(function() {
{{ jsSource | replace: "myForm", formId }}
})();
</script>
</div>
