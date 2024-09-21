{% capture rendered_htmlSource %}
```html
{{ include.htmlSource }}
```
{% endcapture %}
{% capture rendered_cssSource %}
```css
{{ include.cssSource }}
```
{% endcapture %}
{% capture rendered_jsSource %}
```javascript
{{ include.jsSource }}
```
{% endcapture %}
<div class="tab-container">
  <div class="tab-labels">
    <div class="tab-label tab-label-active">📝 HTML</div>
    {% if include.cssSource %}
        <div class="tab-label">🎨 CSS</div>
    {% endif %}
    {% if include.jsSource %}
        <div class="tab-label">⚙️  JS</div>
    {% endif %}
    <div class="tab-label">👁️ Preview</div>
  </div>
  <div class="tab-content tab-active">
    {{ rendered_htmlSource | markdownify }}
  </div>
    {% if include.cssSource %}
        <div class="tab-content">
            {{ rendered_cssSource | markdownify }}
        </div>
    {% endif %}
    {% if include.jsSource %}
        <div class="tab-content">
            {{ rendered_jsSource | markdownify }}
        </div>
    {% endif %}
  <div class="tab-content">
    <div class="smarkform_example">
      <style>{{ include.cssSource }}</style>
      {{ include.htmlSource | raw }}
      <script>{{ include.jsSource }}</script>
    </div>
  </div>
</div>
