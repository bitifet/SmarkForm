---
title: Examples
layout: chapter
permalink: /resources/examples
nav_order: 3

---

# Examples

<div>
    <select id="iframe_example_switcher">
    {% for item in site.data.examples %}
        <option
            value="{{ item.url | relative_url }}"
            title="{{ item.details }}"
        >{{ item.title }}</option>
    {% endfor %}
    </select>
    <iframe id="iframe_example_viewer" style="width:100%; height:50vh" src=""></iframe>
    <a id="iframe_fullscreen_link" target=_blank href="">View FullScreen</a>
    <script>
        const selector = document.getElementById("iframe_example_switcher");
        const iframe = document.getElementById("iframe_example_viewer");
        const fullScreenLnk = document.getElementById("iframe_fullscreen_link");
        function updateIframe() {
            iframe.src = selector.value;
            fullScreenLnk.href = selector.value;
        };
        updateIframe();
        selector.addEventListener("change", updateIframe);
    </script>
</div>



