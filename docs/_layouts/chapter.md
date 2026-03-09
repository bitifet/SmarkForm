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

  /*
   * The TOC list (inner content) handles its own scrolling via a wrapper <div>
   * created by the script below. We do NOT set overflow-y:auto here because the
   * CSS spec coerces overflow-x from 'visible' to 'auto' whenever overflow-y is
   * non-visible. The <ul> has ::before counter numbers with negative margin-left
   * values that intentionally hang outside the <ul>'s content box (hanging
   * indent). With overflow-x:auto on the <ul> itself, those overflowing ::before
   * elements fall outside the scroll container and stay fixed while the list
   * scrolls — they appear misaligned. Moving overflow to a wrapper <div> (with
   * a slight padding-left to ensure the ::before overhang stays within the div's
   * border box) fixes this without changing the visual layout.
   */
  .main-content details.chaptertoc > ul {
    /* overflow and max-height are on .chaptertoc-scroll-div, added by JS */
  }

  /*
   * Scroll wrapper for the TOC list — created by the JS below.
   * padding-left: 0.4em ensures that the ::before elements with margin-left
   * of up to -1.3em (for top-level items) land at least 0.1em inside the
   * div's border box, so they ARE part of the scrollable area and scroll with
   * the list. margin-left: -0.4em compensates so the visual position of the
   * numbers and text is identical to before.
   * (calc: details padding-left 1em + div margin-left -0.4em + div padding-left
   *  0.4em + ul margin-left 1em - ::before margin-left 1.3em = 0.7em — exactly
   *  matching the original position.)
   */
  .chaptertoc-scroll-div {
    max-height: calc(100vh - 3.5rem);   /* fallback for browsers without dvh */
    max-height: calc(100dvh - 3.5rem); /* preferred: adapts to mobile browser chrome */
    overflow-y: auto;
    /* Contain the negative-margin ::before counters within the scroll container */
    padding-left: 0.4em;
    margin-left: -0.4em;
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
    counter-reset: item-counter;
    list-style: none;
  }

  /* Style and increment top-level list items */
  .main-content .chaptertoc>.chaptertoc-scroll-div>ul > li {
    counter-reset: subitem-counter;
    counter-increment: item-counter;
    list-style: none !important;
  }
  .main-content .chaptertoc>.chaptertoc-scroll-div>ul > li::before {
    content: counter(item-counter) ". ";
    font-weight: bold;
    margin-right: 0.5em;
    margin-left: -1.3em !important;
  }

  /* Style and increment second-level list items */
  .main-content .chaptertoc:not(.toplevel)>.chaptertoc-scroll-div>ul > li > ul {
    counter-reset: subitem-counter;
    list-style: none;
    padding-left: 1.5em;
  }
  .main-content .chaptertoc:not(.toplevel)>.chaptertoc-scroll-div>ul > li > ul > li {
    counter-reset: subsubitem-counter;
    counter-increment: subitem-counter;
  }
  .main-content .chaptertoc:not(.toplevel)>.chaptertoc-scroll-div>ul > li > ul > li::before {
    content: counter(item-counter) "." counter(subitem-counter) ". ";
    font-weight: normal;
    margin-right: 0.5em;
    margin-left: -2em !important;
  }

  /* Style and increment third-level list items */
  .main-content .chaptertoc:not(.toplevel)>.chaptertoc-scroll-div>ul > li > ul > li > ul {
    list-style: none;
    padding-left: 1.5em;
  }
  .main-content .chaptertoc:not(.toplevel)>.chaptertoc-scroll-div>ul > li > ul > li > ul > li {
    counter-increment: subsubitem-counter;
  }
  .main-content .chaptertoc:not(.toplevel)>.chaptertoc-scroll-div>ul > li > ul > li > ul > li::before {
    content: counter(item-counter) "." counter(subitem-counter) "." counter(subsubitem-counter) ". ";
    margin-right: 0.5em;
    margin-left: -2.8em !important;
  }

  .go-to-top {
    float: right;
    margin-right: 1em;
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
        padding-left: 0;
        margin-left: 0;
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

<script>
    const smartToc = document.querySelector("details.chaptertoc");
    if (!!smartToc) {
        /*
         * Wrap the TOC <ul> in a plain <div class="chaptertoc-scroll-div">.
         *
         * Why: when overflow-y:auto is set on a <ul>, the CSS spec coerces
         * overflow-x from 'visible' to 'auto'. The counter numbers are
         * implemented as ::before pseudo-elements with a negative margin-left
         * (hanging indent). That negative margin places them in the <ul>'s
         * margin area — outside the scroll container's clipping boundary.
         * Result: the text scrolls but the numbers stay fixed, appearing
         * misaligned.
         *
         * Using a <div> wrapper with a small padding-left (0.4em) ensures the
         * overhanging ::before elements land within the div's border box and
         * therefore inside the scroll container. The matching margin-left
         * (-0.4em) preserves the original visual position of numbers and text.
         */
        const tocList = smartToc.querySelector(':scope > ul');
        if (tocList) {
            const scrollDiv = document.createElement('div');
            scrollDiv.className = 'chaptertoc-scroll-div';
            tocList.parentNode.insertBefore(scrollDiv, tocList);
            scrollDiv.appendChild(tocList);
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

        /* Create the "Go to top" anchor */
        const goToTopLink = document.createElement("a");
        goToTopLink.textContent = "Top ↑";
        goToTopLink.title = "Go to Top";
        goToTopLink.href = "#"; /* Navigates to top */
        goToTopLink.className = "go-to-top"; /* For styling */
        smartToc.querySelector("summary").appendChild(goToTopLink);

        window.addEventListener('beforeprint', openToc);
        window.addEventListener('afterprint', restoreToc);

    };
</script>


