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


<!-- Style tweaks -->
<!-- ------------ -->

<style>


  /* h1 -> (Page title) */
  /* h2 -> x. */
  /* h3 -> x.y */
  /* h4 -> x.y.z */
  body {
    counter-reset: h2-counter;
  }

  /* Style and increment h2 */
  main>h2 {
    counter-reset: h3-counter;
    counter-increment: h2-counter;
  }
  main>h2::before {
    content: counter(h2-counter) ". ";
  }

  /* Style and increment h3 */
  main>h3 {
    counter-reset: h4-counter;
    counter-increment: h3-counter;
  }
  main>h3::before {
    content: counter(h2-counter) "." counter(h3-counter) ". ";
  }

  /* Style and increment h4 */
  main>h4 {
    counter-increment: h4-counter;
    line-height: 3em;
    font-size: 1.2em !important;
    text-transform: none !important;
  }
  main>h4::before {
    content: counter(h2-counter) "." counter(h3-counter) "." counter(h4-counter) ". ";
  }


  /* (Untested) */
  main>h5, h6 {
    line-height: 3em;
    font-size: 1.2em !important;
    color: #000077;
    text-transform: none !important;
  }
  main>h5::before {
    content: "► ";
  }
  main>h6::before {
    content: "▻ ";
  }



  /* TOC */
  .main-content .chaptertoc>ul {
    margin-left: 1em;
    counter-reset: item-counter;
    list-style: none;
  }

  /* Style and increment top-level list items */
  .main-content .chaptertoc>ul > li {
    counter-reset: subitem-counter;
    counter-increment: item-counter;
    list-style: none !important;
  }
  .main-content .chaptertoc>ul > li::before {
    content: counter(item-counter) ". ";
    font-weight: bold;
    margin-right: 0.5em;
    margin-left: -1.3em !important;
  }

  /* Style and increment second-level list items */
  .main-content .chaptertoc:not(.toplevel)>ul > li > ul {
    counter-reset: subitem-counter;
    list-style: none;
    padding-left: 1.5em;
  }
  .main-content .chaptertoc:not(.toplevel)>ul > li > ul > li {
    counter-reset: subsubitem-counter;
    counter-increment: subitem-counter;
  }
  .main-content .chaptertoc:not(.toplevel)>ul > li > ul > li::before {
    content: counter(item-counter) "." counter(subitem-counter) ". ";
    font-weight: normal;
    margin-right: 0.5em;
    margin-left: -2em !important;
  }

  /* Style and increment third-level list items */
  .main-content .chaptertoc:not(.toplevel)>ul > li > ul > li > ul {
    list-style: none;
    padding-left: 1.5em;
  }
  .main-content .chaptertoc:not(.toplevel)>ul > li > ul > li > ul > li {
    counter-increment: subsubitem-counter;
  }
  .main-content .chaptertoc:not(.toplevel)>ul > li > ul > li > ul > li::before {
    content: counter(item-counter) "." counter(subitem-counter) "." counter(subsubitem-counter) ". ";
    margin-right: 0.5em;
    margin-left: -2.8em !important;
  }







</style>


<!-- Bottom bar -->
<!-- ---------- -->

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
            <div class="icon" role="img" aria-label="">{{ prev_icon }}</div>
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
            <div class="icon" role="img" aria-label="">{{ next_icon }}</div>
        </a>
    </div>
</div>
