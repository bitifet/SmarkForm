{% comment %}

Accepted arguments:
-------------------

  * tabId (mandatory): Unique string ID for this component instance.
                       Used to give the container a unique HTML id and prevent
                       conflicts when multiple instances appear on the same page.

  * docSource (mandatory): The full HTML document to display and preview.
                           Must be a complete, self-contained document that starts
                           with <!DOCTYPE html> and loads all dependencies from CDN.
                           Shown verbatim in the Source tab and injected as iframe
                           srcdoc in the Preview tab.

  * selected: Initial active tab — "source" (default) or "preview".

  * height: Optional iframe height as a percentage of the viewport (0–100).
            Defaults to 60 when omitted.  Because sandbox="allow-scripts" is
            used without allow-same-origin, auto-sizing from scrollHeight is not
            available, so this parameter controls the iframe height directly.

{% endcomment %}

{% assign dt_tabId  = include.tabId     | default: "FIXME" %}
{% assign dt_doc    = include.docSource | default: "" %}
{% assign dt_cur    = include.selected  | default: "source" %}

{% capture dt_rendered_source | raw %}
```html
{{ dt_doc }}
```
{%- endcapture %}

{% if dt_doc == "" %}
<div style="border: solid 3px yellow; padding: 0px 2em 1em 2em; border-radius: 0.5em;">
    <h2>🚧  Missing Example 🚧</h2>
    <p>This example is not yet available.</p>
</div>
{% else %}
<div id="doctabs-{{ dt_tabId }}" class="doctabs-container">
  <div class="doctabs-labels">
    {% if dt_cur == "source" %}{% assign dt_ac = "doctabs-label-active" %}{% else %}{% assign dt_ac = "" %}{% endif %}
    <div class="doctabs-label {{ dt_ac }}" data-tab="source" title="Full HTML Document Source">📄 Source</div>
    {% if dt_cur == "preview" %}{% assign dt_ac = "doctabs-label-active" %}{% else %}{% assign dt_ac = "" %}{% endif %}
    <div class="doctabs-label {{ dt_ac }}" data-tab="preview" title="Live Preview (sandboxed iframe)">👁️ Preview</div>
  </div>
  {% if dt_cur == "source" %}{% assign dt_ac = "doctabs-active" %}{% else %}{% assign dt_ac = "" %}{% endif %}
  <div class="doctabs-content doctabs-code doctabs-content-source {{ dt_ac }}">
    {{ dt_rendered_source | markdownify }}
  </div>
  {% if dt_cur == "preview" %}{% assign dt_ac = "doctabs-active" %}{% else %}{% assign dt_ac = "" %}{% endif %}
  <div class="doctabs-content doctabs-content-preview {{ dt_ac }}">
    <div style="overflow: auto">
      <div class="doctabs-preview-spinner"></div>
      <iframe
        class="doctabs-preview-frame"
        sandbox="allow-scripts"
        title="Live preview of example code"
        style="width:100%;border:none;display:none;"
      ></iframe>
    </div>
  </div>
  <script type="application/json" class="doctabs-src-data">
  {
    "docSource": {{ dt_doc | jsonify | replace: "  ", "\u0020\u0020" | replace: "<", "\u003c" }},
    "height": {{ include.height | plus: 0 }}
  }
  </script>
  {% comment %}
    The double-space replacement above (`replace: "  ", "\u0020\u0020"`) is a
    workaround for the Just-The-Docs HTML compressor (vendor/compress.html),
    which collapses two or more consecutive literal spaces to one space
    everywhere outside <pre> blocks — including inside <script> elements.
    By replacing "  " with its Unicode escape equivalent "\u0020\u0020",
    the compressor no longer recognises the run as "two spaces" and leaves it
    intact, while JSON.parse in the browser still decodes "\u0020" as U+0020
    (space), faithfully restoring the original indentation.
    The `replace: "<", "\u003c"` prevents any "</script>" inside the JSON
    string from prematurely closing the outer <script> element.
  {% endcomment %}
</div>
{% endif %}
