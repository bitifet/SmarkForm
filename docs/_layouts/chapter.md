---
layout: default
---



{{ content }}

<hr/>



{% assign sorted_collections = site.collections | sort: "nav_order" %}
{% assign page_url = page.url | relative_url %}
{% assign current_collection = nil %}
{% assign current_title = nil %}
{% assign current_url = nil %}
{% assign shouldbreak = false %}
{% assign prev_collection = nil %}
{% assign prev_title = nil %}
{% assign prev_url = nil %}
{% assign next_collection = nil %}
{% assign next_title = nil %}
{% assign next_url = nil %}
{% assign prev_icon = "⏪" %}
{% assign next_icon = "⏩" %}
{% assign home_url = "/" | relative_url %}
{% assign home_section = "SmarkForm" %}
{% assign home_title = "Return to Home" %}
{% assign home_icon = "🏠" %}

{% for collection in sorted_collections %}
  {% for document in collection.docs %}
   {% assign pointer_url = document.url | relative_url %}
   {% if shouldbreak %}
    {% if next_url == nil %}
     {% assign next_url = pointer_url %}
     {% assign next_collection = site.just_the_docs.collections[collection.label].name %}
     {% assign next_title = document.title %}
    {% endif %}
   {% else %}
    {% if pointer_url == page_url %}
     {% assign shouldbreak = true %}
     {% assign prev_url = current_url %}
     {% assign prev_collection = current_collection %}
     {% assign prev_title = current_title %}
    {% endif %}
    {% assign current_url = pointer_url %}
    {% assign current_collection = site.just_the_docs.collections[collection.label].name %}
    {% assign current_title = document.title %}
   {% endif %}
  {% endfor %}
{% endfor %}

<!-- ](Break Markdown Syntax Hilighting misscompilance)  -->


{% if prev_url == nil %}
 {% assign prev_url = home_url %}
 {% assign prev_section = home_section %}
 {% assign prev_title = home_title %}
 {% assign prev_icon = home_icon %}
{% endif %}

{% if next_url == nil %}
 {% assign next_url = home_url %}
 {% assign next_section = home_section %}
 {% assign next_title = home_title %}
 {% assign next_icon = home_icon %}
{% endif %}


<style>
.bottom-bar {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    bottom: 0;
    left: 0;
    width: 100%;
}

.bottom-bar .nav-link {
    display: flex;
    align-items: center;
    background: #eee;
    border-radius: .3em;
    max-width: 45%;
}
.bottom-bar .nav-link:hover {
    transform: translate(.1em, .1em);
}

.bottom-bar .nav-link:first-child .icon {
    padding: .5rem .7rem .5rem 1.5rem;
}
.bottom-bar .nav-link:first-child .text {
    padding: .5rem .5rem .5rem .7rem;
    text-align: right;
}
.bottom-bar .nav-link:last-child .icon {
    padding: .5rem 1.5rem .5rem .7rem;
}
.bottom-bar .nav-link:last-child .text {
    padding: .5rem .7rem .5rem .5rem;
    text-align: left;
}

.bottom-bar a
, .bottom-bar a:link
, .bottom-bar a:visited
, .bottom-bar a:hover {
    text-decoration: none;
    display: flex;
    align-items: center;
}

.bottom-bar .icon {
    font-size: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.bottom-bar .text {
    display: flex;
    flex-direction: column;
}

.bottom-bar .line {
    margin: 0;
    padding: 0;
}
.bottom-bar .bold {
    font-weight: bold;
}

.bottom-bar .prev-page {
    justify-content: flex-start;
}

.bottom-bar .next-page {
    justify-content: flex-end;
}

@media print {
    .bottom-bar {
        display: none;
    }
}
</style>



<div class="bottom-bar">
    <div class="nav-link">
        <a href="{{prev_url}}">
            <div class="icon">{{ prev_icon }}</div>
            <div class="text">
                <div class="line bold">{{ prev_collection }}</div>
                <div class="line">{{ prev_title }}</div>
            </div>
        </a>
    </div>
    <div class="nav-link">
        <a href="{{next_url}}">
            <div class="text">
                <div class="line bold">{{ next_collection }}</div>
                <div class="line">{{ next_title }}</div>
            </div>
            <div class="icon">{{ next_icon }}</div>
        </a>
    </div>
</div>
