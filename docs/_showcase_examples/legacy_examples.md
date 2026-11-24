---
title: "Legacy Examples"
layout: chapter
description: "Browse the original downloadable SmarkForm examples, preserved as a historical archive."
permalink: "/showcase_examples/legacy_examples"
nav_order: 1000
nav_exclude: true
search_exclude: true
sitemap: false
noindex: true
---


{% include links.md %}

# {{ page.title }}

These are the original downloadable SmarkForm examples. The **Company** form
was the project's first full form and served as its early development
playground. The examples are preserved as a historical archive and are no
longer maintained; newer features and recommended patterns may not appear here.

For current, interactive examples built to the present documentation standards,
visit the [Examples page]({{ "/showcase_examples/examples" | relative_url }}).

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

{% capture void -%}
{% include_relative legacy_examples.capture.md %}
{%- endcapture %}



<div class="example-selector">
<label for="example_switcher">Choose an example:</label>
<select class="btn" id="example_switcher">
{% for item in site.data.legacy_examples %}
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
<button onClick="selectTab('js_source', this)" class="tabbuton btn">JavaScript</button>
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
        /* `value` is already a site-root URL, including any configured baseurl. */
        const exampleLink = switcher.value;
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
