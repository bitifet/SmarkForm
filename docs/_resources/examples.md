---
title: Examples
layout: chapter
permalink: /resources/examples
nav_order: 4

---

# {{ page.title }}

<style>
    .tab-container
    , .tab-container>.tab
    , .tab-container>.tab>.iframe
    {
        margin: 0px;
        padding: 0px;
        border: 0px;
    }

    .example-selector {
        text-align: right;
    }
    .example-selector label {
        font-weight: bold;
            padding-right: .5em;
    }
    .tab_buttons {
        margin-top: 1em;
        display: flex;
        flex-wrap: wrap;
    }
    .tab_buttons .spacer {
        flex-grow: 1;
    }
</style>

{% capture void %}
{% include_relative examples.capture.md %}
{% endcapture %}



<div class="example-selector">
<label for="example_switcher">Select:</label>
<select class="btn" id="example_switcher">
{% for item in site.data.examples %}
    <option
        value="{{ item.url | relative_url }}"
        title="{{ item.details }}"
    >{{ item.title }}</option>
{% endfor %}
</select>
</div>
<div class="tab_buttons">
<button onClick="selectTab('output_view', this)" class="btn" id="firstTabBtn">Output</button>
<button onClick="selectTab('html_source', this)" class="btn">HTML</button>
<button onClick="selectTab('js_source', this)" class="tabbuton btn">Js</button>
<span class="spacer"></span>
<a class="btn" id="fullscreen_link" target=_blank href=""><span aria-label="">🖥️</span> View FullScreen</a>
<a id="dld_button" class="btn" href="" download><span aria-label="">💾</span> Download</a>
</div>
<div class="tab_container">
<div class="tab" id="output_view">
<iframe id="example_viewer" style="width:100%; height:75vh" src=""></iframe>
</div>
<div class="tab" id="html_source">
{{ html_sources }}
</div>
<div class="tab" id="js_source">
{{ js_sources }}
</div>
</div>

<script>
    const switcher = document.getElementById("example_switcher");
    const iframe = document.getElementById("example_viewer");
    const fullScreenLnk = document.getElementById("fullscreen_link");
    const dldLnk = document.getElementById("dld_button");
    const sources = document.getElementsByClassName("example-source");
    function updateExample() {
        const exampleLink = "."+switcher.value;
        iframe.src = exampleLink;
        fullScreenLnk.href = exampleLink;
        dldLnk.href = exampleLink;
        document.location.hash = switcher.value;
        for (let i = 0; i < sources.length; i++) {
            if (sources[i].getAttribute("data-source") == switcher.value) {
                sources[i].style.display="block";
            } else {
                sources[i].style.display="none";
            };
        }
    };
    const hashSelection = document.location.hash.slice(1);
    if (
        1 + [...switcher.options]
            .findIndex(
                op=>op.value==hashSelection
            )
    ) {
        switcher.value = hashSelection
    };
    updateExample();
    switcher.addEventListener("change", updateExample);


    const tabs = [...document.getElementsByClassName("tab")];
    let oldButton;
    const selectTab = (tabId, btn)=>tabs.forEach(
        t=>{
            t.hidden=t.id!=tabId;
            if (oldButton) oldButton.classList.toggle("btn-outline");
            if (btn) btn.classList.toggle("btn-outline");
            oldButton = btn;
        }
    );
    document.getElementById("firstTabBtn").click();







</script>
