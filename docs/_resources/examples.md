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
  background-color: #007BFF; /* Color de fondo del botón */
  color: #fff; /* Color del texto */
  text-decoration: none; /* Elimina el subrayado del enlace */
  border: 2px solid #007BFF; /* Borde del botón */
  border-radius: 5px; /* Bordes redondeados */
  cursor: pointer; /* Cambia el cursor al pasar el mouse */
  font-weight: bold; /* Texto en negrita */
  text-align: center; /* Alineación del texto al centro */
  transition: background-color 0.3s, color 0.3s; /* Transiciones suaves en hover */
}

.ex-viewer .button:hover {
  background-color: #0056b3; /* Cambio de color de fondo en hover */
  color: #fff; /* Cambio de color del texto en hover */
}
</style>



<table class="ex-viewer">
<tr>
<th>
Select:
    <select class="button" id="iframe_example_switcher">
    {% for item in site.data.examples %}
        <option
            value="{{ item.url | relative_url }}"
            title="{{ item.details }}"
        >{{ item.title }}</option>
    {% endfor %}
    </select>
</th>
<th>
    <a class="button" id="iframe_fullscreen_link" target=_blank href="">🖥️ View FullScreen</a>
</th>
<th>
    <a class="button" href="#source-code">⬇️  Source Code</a>
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
{% capture contenido_markdown %}
```html
{% include_relative {{ item.url }} %}
```
{% endcapture %}
<div class="example-source" data-source="{{item.url | relative_url }}">
{{ contenido_markdown | markdownify }}
</div>
{% endfor %}

<script>
    const selector = document.getElementById("iframe_example_switcher");
    const iframe = document.getElementById("iframe_example_viewer");
    const fullScreenLnk = document.getElementById("iframe_fullscreen_link");
    const sources = document.getElementsByClassName("example-source");
    function updateIframe() {
        iframe.src = selector.value;
        fullScreenLnk.href = selector.value;
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
