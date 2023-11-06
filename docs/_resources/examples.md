---
title: Examples
layout: chapter
permalink: /resources/examples
nav_order: 3

---

# Examples

<style>
.ex-viewer .button{
  display: inline-block;
  padding: 10px 20px; /* Ajusta el espaciado según tus necesidades */
  background-color: #eeeeee; /* Color de fondo del botón */
  color: #444; /* Color del texto */
  text-decoration: none; /* Elimina el subrayado del enlace */
  border: 2px solid #edeff6; /* Borde del botón */
  border-radius: 5px; /* Bordes redondeados */
  cursor: pointer; /* Cambia el cursor al pasar el mouse */
  font-weight: bold; /* Texto en negrita */
  text-align: center; /* Alineación del texto al centro */
  transition: background-color 0.3s, color 0.3s; /* Transiciones suaves en hover */
}

.ex-viewer .button:hover {
  background-color: #edeff6; /* Cambio de color de fondo en hover */
  border: 2px solid #cccccc; /* Borde del botón */
  color: #000; /* Cambio de color del texto en hover */
}
</style>



<div style="text-align: center">
<b>Select:</b>&nbsp;
<select class="button" id="iframe_example_switcher">
{% for item in site.data.examples %}
    <option
        value="{{ item.url | relative_url }}"
        title="{{ item.details }}"
    >{{ item.title }}</option>
{% endfor %}
</select>
</div>
<table class="ex-viewer">
<tr>
<th>
    <a class="button" id="iframe_fullscreen_link" target=_blank href="">🖥️ View FullScreen</a>
</th>
<th>
    <a id="dld_button" class="button" href="" download>💾 Download</a>
</th>
<th>
    <a class="button" href="#source-code">⬇️  See Source Code</a>
</th>
</tr>
<tr>
<td colspan=3>
    <iframe id="iframe_example_viewer" style="width:100%; height:75vh" src=""></iframe>
</td>
</tr>
</table>

## Source Code

{% for item in site.data.examples %}

{% capture full_html_content %}
{% include_relative {{ item.url }} %}
{% endcapture %}

{% assign head_stripped = full_html_content | split: "<!-- BEGIN SmarkForm sample-->" %}
{% assign foot_stripped = head_stripped[1] | split: "<!-- END SmarkForm sample-->" | first | strip %}

<!-- ]() -->

{% capture markdown_content %}
```html
      <div class="SmarkForm">
        {{ foot_stripped }}
      </div>
```
{% endcapture | replace: '^ {6}', '' %}


<div class="example-source" data-source="{{item.url | relative_url }}">
{{ markdown_content | markdownify }}
</div>
{% endfor %}

<script>
    const selector = document.getElementById("iframe_example_switcher");
    const iframe = document.getElementById("iframe_example_viewer");
    const fullScreenLnk = document.getElementById("iframe_fullscreen_link");
    const dldLnk = document.getElementById("dld_button");
    const sources = document.getElementsByClassName("example-source");
    function updateIframe() {
        iframe.src = selector.value;
        fullScreenLnk.href = selector.value;
        dldLnk.href = selector.value;
        for (let i = 0; i < sources.length; i++) {
            if (sources[i].getAttribute("data-source") == selector.value) {
                sources[i].style.display="block";
            } else {
                sources[i].style.display="none";
            };
        }
    };
    updateIframe();
    selector.addEventListener("change", updateIframe);
</script>
