{% capture rendered_source %}
```html
{{ include.source }}
```
{% endcapture %}
<div class="tab-container">
  <div class="tab-labels">
    <div class="tab-label tab-label-active">📝 HTML</div>
    <div class="tab-label">👁️ Preview</div>
  </div>
  <div class="tab-content tab-active">
    {{ rendered_source | markdownify }}
  </div>
  <div class="tab-content">
    <div class="smarkform_example">
      {{ include.source | raw }}
    </div>
  </div>
</div>
