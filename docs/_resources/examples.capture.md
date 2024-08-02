---
nav_exclude: true
search_exclude: true
nav_order: 1000

---


{% assign current_directory = page.path | split: '/' | slice: 0, -1 | join: '/' %}

{% assign html_sources = "" %}
{% assign js_sources = "" %}


{% for item in site.data.examples %}

{% capture full_html_content %}
{% include_relative {{ current_directory }}{{ item.url }} %}
{% endcapture %}



{% assign html_head_stripped = full_html_content | split: "<!-- BEGIN SmarkForm sample-->" %}
{% assign html_foot_stripped = html_head_stripped[1] | split: "<!-- END SmarkForm sample-->" | first | strip %}

{% assign js_head_stripped = full_html_content | split: "// <!-- BEGIN controller sample-->" %}
{% assign js_foot_stripped = js_head_stripped[1] | split: "// <!-- END controller sample-->" | first | strip %}

<!-- ]() -->

{% capture html_content %}
```html
      <div class="SmarkForm">
        {{ html_foot_stripped }}
      </div>
```
{% endcapture | replace: '^ {6}', '' %}

{% capture js_content %}
```javascript
          {{ js_foot_stripped }}
```
{% endcapture | replace: '^ {6}', '' %}


{% capture html_origin %}
<div class="example-source" data-source="{{item.url | relative_url }}">
{{ html_content | markdownify }}
</div>
{% endcapture %}

{% capture js_origin %}
<div class="example-source" data-source="{{item.url | relative_url }}">
{{ js_content | markdownify }}
</div>
{% endcapture %}


{% assign html_sources = html_sources | append: html_origin %}
{% assign js_sources = js_sources | append: js_origin %}


{% endfor %}
