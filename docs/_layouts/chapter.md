---
layout: smarkform
---

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
    padding-top: 1.5em;
    margint-top: 0px; /* Does not work with scroll-padding-top */
  }
  main>h2::before {
    content: counter(h2-counter) ". ";
  }

  /* Style and increment h3 */
  main>h3 {
    counter-reset: h4-counter;
    counter-increment: h3-counter;
    padding-top: 1.5em;
    margint-top: 0px; /* Does not work with scroll-padding-top */
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
    padding-top: 1.5em;
    margint-top: 0px; /* Does not work with scroll-padding-top */
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
  .main-content .chaptertoc {
    margin: 1.5em 0;
    background: #f9f9f9;
    padding: .2em 1em;
  }
  .main-content details.chaptertoc {
    /* Sticky TOC when foldable */
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 100;
    /*
     * Cap the sticky element at viewport height. Without this, when the TOC is
     * expanded to a list longer than the screen, the sticky element's own height
     * exceeds the viewport and it starts scrolling partially off the top.
     * overflow:hidden clips the container; the inner <ul> still has its own
     * overflow-y:auto so the list itself remains scrollable.
     * (overflow:hidden on the sticky element itself does NOT break sticky —
     *  it is only overflow on an ANCESTOR that breaks it.)
     */
    max-height: 100vh;           /* fallback */
    max-height: 100dvh;          /* adapts to mobile browser chrome */
    overflow: hidden;
    box-shadow: 6px 6px 3px rgba(0, 0, 0, 0.1);
  }

  /* Summary caption — fluid font size, clearly tappable */
  .main-content details.chaptertoc > summary {
    font-size: clamp(1rem, 2.5vw, 1.15rem);
    font-weight: 600;
    padding-top: 0.4em;
    padding-bottom: 0.4em;
    cursor: pointer;
  }

  /* Scroll wrapper for the TOC list — created by the JS below. */
  .chaptertoc-scroll-div {
    max-height: calc(100vh - 3.5rem);   /* fallback for browsers without dvh */
    max-height: calc(100dvh - 3.5rem); /* preferred: adapts to mobile browser chrome */
    overflow-y: auto;
  }

  /*
   * Scroll padding on the page's scroll container.
   * Compensates for the sticky TOC height so that hash-linked
   * headings are not hidden behind the collapsed TOC bar.
   * The value approximates the collapsed chaptertoc height
   * (summary font × line-height + summary padding + outer padding).
   */
  html, body {
    scroll-padding-top: 3.5rem;
  }
  .main-content .chaptertoc>.chaptertoc-scroll-div>ul {
    margin-left: 1em;
    list-style: none;
  }

  .main-content .chaptertoc>.chaptertoc-scroll-div>ul > li {
    list-style: none !important;
  }

  /* Nested sub-lists */
  .main-content .chaptertoc:not(.toplevel)>.chaptertoc-scroll-div>ul > li > ul {
    list-style: none;
    padding-left: 1.5em;
  }
  .main-content .chaptertoc:not(.toplevel)>.chaptertoc-scroll-div>ul > li > ul > li > ul {
    list-style: none;
    padding-left: 1.5em;
  }

  /* Remove Just-The-Docs pseudoclass-based bullets */
  .main-content .chaptertoc>.chaptertoc-scroll-div>ul li::before {
      content: "" !important;
  };

  /*
   * Counter labels injected by JS as <span class="toc-num"> inside each <li>.
   * Using real DOM nodes (instead of CSS ::before pseudo-elements) ensures they
   * scroll with the list: CSS counters placed via negative margin-left land in
   * the scroll container's padding area, which is anchored by the spec and does
   * not scroll with content.
   */
  .chaptertoc .toc-num {
    font-weight: bold;
    white-space: nowrap;
    margin-right: 0.3em;
  }
  .chaptertoc li li .toc-num {
    font-weight: normal;
  }

  .go-to-top {
    float: right;
    margin-right: 1em;
    cursor: pointer;
  }

  @media print {
    .main-content .chaptertoc {
        box-shadow: none;
        max-height: none;
        overflow: visible;
        padding-left: 0px;
    }
    .chaptertoc-scroll-div {
        max-height: none;
        overflow-y: visible;
    }
    .main-content .chaptertoc>.chaptertoc-scroll-div>ul {
        max-height: none;
        overflow: visible;
        border-left: 3rem solid #eee;
        margin-left: 1rem;
        padding-left: 2rem;
    }
    .go-to-top {
        display: none;
    }
    .main-content details.chaptertoc {
        box-shadow: none;
        max-height: none;
        overflow: visible;
    }
    .main-content details.chaptertoc summary {
        font-size: 1.5em;
        font-weight: bold;
    }
    .main-content details.chaptertoc summary::marker {
        color: rgba(0,0,0,0);
    }
  }





</style>



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
   {% unless document.nav_exclude %}
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
   {% endunless %}
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



<!-- Bottom bar -->
<!-- ---------- -->

<style>
.bottom-bar {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin: 2rem 0 1rem;
}

.bottom-bar .nav-link {
    display: flex;
    align-items: center;
    flex: 1 1 0;
    max-width: calc(50% - .5rem);
    overflow: hidden;
    background: var(--body-background-color, #fff);
    border: 1px solid var(--border-color, #eeebee);
    border-radius: .5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, .08);
    transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
}
.bottom-bar .nav-link:hover {
    transform: translateY(-2px);
    border-color: var(--link-color, #7253ed);
    box-shadow: 0 4px 12px rgba(0, 0, 0, .12);
}

.bottom-bar .nav-link a {
    display: flex;
    align-items: center;
    gap: .75rem;
    width: 100%;
    min-height: 4rem;
    padding: .75rem 1rem;
    border-radius: inherit;
    color: var(--body-text-color, #5c5962);
    text-decoration: none;
}
.bottom-bar .prev-page a {
    justify-content: flex-start;
}
.bottom-bar .next-page a {
    justify-content: flex-end;
    text-align: right;
}
.bottom-bar .nav-link a:focus-visible {
    outline: 2px solid var(--link-color, #7253ed);
    outline-offset: -3px;
}

.bottom-bar .icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--link-color, #7253ed);
    font-size: 1.5rem;
    transition: transform .16s ease;
}
.bottom-bar .prev-page:hover .icon {
    transform: translateX(-2px);
}
.bottom-bar .next-page:hover .icon {
    transform: translateX(2px);
}

.bottom-bar .text {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.bottom-bar .line {
    margin: 0;
    padding: 0;
    line-height: 1.35;
    overflow-wrap: anywhere;
}
.bottom-bar .bold {
    font-weight: bold;
    font-size: .78rem;
    letter-spacing: .04em;
    text-transform: uppercase;
    color: var(--link-color, #7253ed);
}

@media (max-width: 40rem) {
    .bottom-bar {
        gap: .5rem;
    }
    .bottom-bar .nav-link {
        max-width: calc(50% - .25rem);
    }
    .bottom-bar .nav-link a {
        gap: .4rem;
        min-height: 3.5rem;
        padding: .6rem .5rem;
    }
    .bottom-bar .icon {
        font-size: 1.2rem;
    }
}

@media print {
    .bottom-bar {
        display: none;
    }
}
</style>

<div class="bottom-bar">
    <div class="nav-link prev-page">
        <a href="{{prev_url}}" aria-label="Previous page: {{ prev_title }}">
            <div class="icon" aria-hidden="true">{{ prev_icon }}</div>
            <div class="text">
                <div class="line bold">{{ prev_collection }}</div>
                <div class="line">{{ prev_title }}</div>
            </div>
        </a>
    </div>
    <div class="nav-link next-page">
        <a href="{{next_url}}" aria-label="Next page: {{ next_title }}">
            <div class="text">
                <div class="line bold">{{ next_collection }}</div>
                <div class="line">{{ next_title }}</div>
            </div>
            <div class="icon" aria-hidden="true">{{ next_icon }}</div>
        </a>
    </div>
</div>

<script>
    const smartToc = document.querySelector("details.chaptertoc");
    if (!!smartToc) {
        /*
         * Wrap the TOC <ul> in a plain <div class="chaptertoc-scroll-div">.
         *
         * The div gets overflow-y:auto so the list scrolls when it is tall.
         * We wrap in a div (not the <ul> directly) because setting overflow-y
         * on a <ul> forces overflow-x to 'auto' per the CSS spec, which would
         * clip the counter spans.
         */
        const tocList = smartToc.querySelector(':scope > ul');
        if (tocList) {
            const scrollDiv = document.createElement('div');
            scrollDiv.className = 'chaptertoc-scroll-div';
            tocList.parentNode.insertBefore(scrollDiv, tocList);
            scrollDiv.appendChild(tocList);

            /*
             * Inject <span class="toc-num"> counter labels into every <li>.
             *
             * Using real DOM nodes guarantees the labels scroll with the list
             * content. CSS ::before pseudo-elements with negative margin-left
             * land in the scroll container's own padding area, which the spec
             * anchors (it does not scroll) — causing the classic mis-alignment.
             *
             * Labels mirror the section-heading counters:
             *   top-level  →  "1.", "2.", …
             *   2nd level  →  "1.1.", "1.2.", …
             *   3rd level  →  "1.1.1.", …
             * Multi-level labels are suppressed when the chaptertoc element has
             * the "toplevel" class.
             */
            const isTopLevel = smartToc.classList.contains('toplevel');
            function addTocNumbers(ul, prefix) {
                let n = 0;
                for (const li of ul.children) {
                    if (li.tagName !== 'LI') continue;
                    n++;
                    const label = prefix ? prefix + '.' + n : String(n);
                    const span = document.createElement('span');
                    span.className = 'toc-num';
                    span.textContent = label + '. ';
                    li.insertBefore(span, li.firstChild);
                    if (!isTopLevel) {
                        const nested = li.querySelector(':scope > ul');
                        if (nested) addTocNumbers(nested, label);
                    }
                }
            }
            addTocNumbers(tocList, '');
        }

        const tocLinks = document.querySelectorAll(".chaptertoc a");
        const closeToc = (event) => {
            smartToc.open = false;
        };
        let wasOpen = smartToc.open;
        const openToc = (event) => {
            wasOpen = smartToc.open;
            smartToc.open = true;
        };
        const restoreToc = (event) => {
            smartToc.open = wasOpen;
        };

        tocLinks.forEach((link) => {
            link.addEventListener('click', closeToc);
        });

        /* Create a non-interactive "Go to top" affordance inside <summary>.
           An anchor/button here triggers the browser warning about interactive
           content nested inside <summary>; this remains mouse/touch useful but
           is intentionally hidden from assistive-technology navigation. */
        const goToTopControl = document.createElement("span");
        goToTopControl.textContent = "Top ↑";
        goToTopControl.title = "Go to Top";
        goToTopControl.setAttribute("aria-hidden", "true");
        goToTopControl.className = "go-to-top";
        goToTopControl.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            window.scrollTo({top: 0, behavior: "smooth"});
        });
        smartToc.querySelector("summary").appendChild(goToTopControl);

        window.addEventListener('beforeprint', openToc);
        window.addEventListener('afterprint', restoreToc);

    };
</script>
