
<style>

@charset "UTF-8";
.highlight,
pre.highlight {
  background: #f9f9f9;
  color: #383942;
}

.highlight pre {
  background: #f9f9f9;
}

.highlight .hll {
  background: #f9f9f9;
}

.highlight .c {
  color: #9fa0a6;
  font-style: italic;
}

.highlight .err {
  color: #fff;
  background-color: #e05151;
}

.highlight .k {
  color: #a625a4;
}

.highlight .l {
  color: #50a04f;
}

.highlight .n {
  color: #383942;
}

.highlight .o {
  color: #383942;
}

.highlight .p {
  color: #383942;
}

.highlight .cm {
  color: #9fa0a6;
  font-style: italic;
}

.highlight .cp {
  color: #9fa0a6;
  font-style: italic;
}

.highlight .c1 {
  color: #9fa0a6;
  font-style: italic;
}

.highlight .cs {
  color: #9fa0a6;
  font-style: italic;
}

.highlight .ge {
  font-style: italic;
}

.highlight .gs {
  font-weight: 700;
}

.highlight .kc {
  color: #a625a4;
}

.highlight .kd {
  color: #a625a4;
}

.highlight .kn {
  color: #a625a4;
}

.highlight .kp {
  color: #a625a4;
}

.highlight .kr {
  color: #a625a4;
}

.highlight .kt {
  color: #a625a4;
}

.highlight .ld {
  color: #50a04f;
}

.highlight .m {
  color: #b66a00;
}

.highlight .s {
  color: #50a04f;
}

.highlight .na {
  color: #b66a00;
}

.highlight .nb {
  color: #ca7601;
}

.highlight .nc {
  color: #ca7601;
}

.highlight .no {
  color: #ca7601;
}

.highlight .nd {
  color: #ca7601;
}

.highlight .ni {
  color: #ca7601;
}

.highlight .ne {
  color: #ca7601;
}

.highlight .nf {
  color: #383942;
}

.highlight .nl {
  color: #ca7601;
}

.highlight .nn {
  color: #383942;
}

.highlight .nx {
  color: #383942;
}

.highlight .py {
  color: #ca7601;
}

.highlight .nt {
  color: #e35549;
}

.highlight .nv {
  color: #ca7601;
}

.highlight .ow {
  font-weight: 700;
}

.highlight .w {
  color: #f8f8f2;
}

.highlight .mf {
  color: #b66a00;
}

.highlight .mh {
  color: #b66a00;
}

.highlight .mi {
  color: #b66a00;
}

.highlight .mo {
  color: #b66a00;
}

.highlight .sb {
  color: #50a04f;
}

.highlight .sc {
  color: #50a04f;
}

.highlight .sd {
  color: #50a04f;
}

.highlight .s2 {
  color: #50a04f;
}

.highlight .se {
  color: #50a04f;
}

.highlight .sh {
  color: #50a04f;
}

.highlight .si {
  color: #50a04f;
}

.highlight .sx {
  color: #50a04f;
}

.highlight .sr {
  color: #0083bb;
}

.highlight .s1 {
  color: #50a04f;
}

.highlight .ss {
  color: #0083bb;
}

.highlight .bp {
  color: #ca7601;
}

.highlight .vc {
  color: #ca7601;
}

.highlight .vg {
  color: #ca7601;
}

.highlight .vi {
  color: #e35549;
}

.highlight .il {
  color: #b66a00;
}

.highlight .gu {
  color: #75715e;
}

.highlight .gd {
  color: #e05151;
}

.highlight .gi {
  color: #43d089;
}

.highlight .language-json .w + .s2 {
  color: #e35549;
}

.highlight .language-json .kc {
  color: #0083bb;
}

/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */
/* Document
   ========================================================================== */
/**
 * 1. Correct the line height in all browsers.
 * 2. Prevent adjustments of font size after orientation changes in iOS.
 */
html {
  line-height: 1.15; /* 1 */
  text-size-adjust: 100%; /* 2 */
}

/* Sections
   ========================================================================== */
/**
 * Remove the margin in all browsers.
 */
body {
  margin: 0;
}

/**
 * Render the `main` element consistently in IE.
 */
main {
  display: block;
}


/* Embedded content
   ========================================================================== */
/**
 * Remove the border on images inside links in IE 10.
 */
img {
  border-style: none;
}

/* Forms
   ========================================================================== */
/**
 * 1. Change the font styles in all browsers.
 * 2. Remove the margin in Firefox and Safari.
 */
button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-size: 100%; /* 1 */
  line-height: 1.15; /* 1 */
  margin: 0; /* 2 */
}

/**
 * Show the overflow in IE.
 * 1. Show the overflow in Edge.
 */
button,
input {
  /* 1 */
  overflow: visible;
}

/**
 * Remove the inheritance of text transform in Edge, Firefox, and IE.
 * 1. Remove the inheritance of text transform in Firefox.
 */
button,
select {
  /* 1 */
  text-transform: none;
}

/**
 * Correct the inability to style clickable types in iOS and Safari.
 */
button,
[type=button],
[type=reset],
[type=submit] {
  appearance: button;
}

/**
 * Remove the inner border and padding in Firefox.
 */
button::-moz-focus-inner,
[type=button]::-moz-focus-inner,
[type=reset]::-moz-focus-inner,
[type=submit]::-moz-focus-inner {
  border-style: none;
  padding: 0;
}

/**
 * Restore the focus styles unset by the previous rule.
 */
button:-moz-focusring,
[type=button]:-moz-focusring,
[type=reset]:-moz-focusring,
[type=submit]:-moz-focusring {
  outline: 1px dotted ButtonText;
}

/**
 * Correct the padding in Firefox.
 */
fieldset {
  padding: 0.35em 0.75em 0.625em;
}

/**
 * 1. Correct the text wrapping in Edge and IE.
 * 2. Correct the color inheritance from `fieldset` elements in IE.
 * 3. Remove the padding so developers are not caught out when they zero out
 *    `fieldset` elements in all browsers.
 */
legend {
  box-sizing: border-box; /* 1 */
  color: inherit; /* 2 */
  display: table; /* 1 */
  max-width: 100%; /* 1 */
  padding: 0; /* 3 */
  white-space: normal; /* 1 */
}

/**
 * Add the correct vertical alignment in Chrome, Firefox, and Opera.
 */
progress {
  vertical-align: baseline;
}

/**
 * Remove the default vertical scrollbar in IE 10+.
 */
textarea {
  overflow: auto;
}

/**
 * 1. Add the correct box sizing in IE 10.
 * 2. Remove the padding in IE 10.
 */
[type=checkbox],
[type=radio] {
  box-sizing: border-box; /* 1 */
  padding: 0; /* 2 */
}

/**
 * Correct the cursor style of increment and decrement buttons in Chrome.
 */
[type=number]::-webkit-inner-spin-button,
[type=number]::-webkit-outer-spin-button {
  height: auto;
}

/**
 * 1. Correct the odd appearance in Chrome and Safari.
 * 2. Correct the outline style in Safari.
 */
[type=search] {
  appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

/**
 * Remove the inner padding in Chrome and Safari on macOS.
 */
[type=search]::-webkit-search-decoration {
  appearance: none;
}

/**
 * 1. Correct the inability to style clickable types in iOS and Safari.
 * 2. Change font properties to `inherit` in Safari.
 */
::-webkit-file-upload-button {
  appearance: button; /* 1 */
  font: inherit; /* 2 */
}

/* Interactive
   ========================================================================== */
/*
 * Add the correct display in Edge, IE 10+, and Firefox.
 */
details {
  display: block;
}

/*
 * Add the correct display in all browsers.
 */
summary {
  display: list-item;
}

/* Misc
   ========================================================================== */
/**
 * Add the correct display in IE 10+.
 */
template {
  display: none;
}

/**
 * Add the correct display in IE 10.
 */
[hidden] {
  display: none;
}

:root {
  color-scheme: light;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}
html {
  font-size: 0.875rem !important;
}
@media (min-width: 31.25rem) {
  html {
    font-size: 1rem !important;
  }
}

body {
  font-family: system-ui, -apple-system, blinkmacsystemfont, "Segoe UI", roboto, "Helvetica Neue", arial, sans-serif, "Segoe UI Emoji";
  font-size: inherit;
  line-height: 1.4;
  color: #5c5962;
  background-color: #fff;
  overflow-wrap: break-word;
}

ol,
ul,
dl,
pre,
address,
blockquote,
table,
div,
hr,
form,
fieldset,
noscript .table-wrapper {
  margin-top: 0;
}

h1,
h2,
h3,
h4,
h5,
h6,
#toctitle {
  margin-top: 0;
  margin-bottom: 1em;
  font-weight: 500;
  line-height: 1.25;
  color: #27262b;
}

p {
  margin-top: 1em;
  margin-bottom: 1em;
}

a {
  color: #7253ed;
  text-decoration: none;
}

a:not([class]) {
  text-decoration: underline;
  text-decoration-color: #eeebee;
  text-underline-offset: 2px;
}
a:not([class]):hover {
  text-decoration-color: rgba(114, 83, 237, 0.45);
}

code {
  font-family: "SFMono-Regular", menlo, consolas, monospace;
  font-size: 0.75em;
  line-height: 1.4;
}

figure,
pre {
  margin: 0;
}

li {
  margin: 0.25em 0;
}

img {
  max-width: 100%;
  height: auto;
}

hr {
  height: 1px;
  padding: 0;
  margin: 2rem 0;
  background-color: #eeebee;
  border: 0;
}

blockquote {
  margin: 10px 0;
  margin-block-start: 0;
  margin-inline-start: 0;
  padding-left: 1rem;
  border-left: 3px solid #eeebee;
}

.side-bar {
  z-index: 0;
  display: flex;
  flex-wrap: wrap;
  background-color: #f5f6fa;
}
@media (min-width: 50rem) {
  .side-bar {
    flex-flow: column nowrap;
    position: fixed;
    width: 15.5rem;
    height: 100%;
    border-right: 1px solid #eeebee;
    align-items: flex-end;
  }
}
@media (min-width: 66.5rem) {
  .side-bar {
    width: calc((100% - 66.5rem) / 2 + 16.5rem);
    min-width: 16.5rem;
  }
}
@media (min-width: 50rem) {
  .side-bar + .main {
    margin-left: 15.5rem;
  }
}
@media (min-width: 66.5rem) {
  .side-bar + .main {
    margin-left: max(
        16.5rem,
        calc((100% - 66.5rem) / 2 + 16.5rem)
      );
  }
}
.side-bar + .main .main-header {
  display: none;
  background-color: #f5f6fa;
}
@media (min-width: 50rem) {
  .side-bar + .main .main-header {
    display: flex;
    background-color: #fff;
  }
}
.side-bar + .main .main-header.nav-open {
  display: block;
}
@media (min-width: 50rem) {
  .side-bar + .main .main-header.nav-open {
    display: flex;
  }
}

.main {
  margin: auto;
}
@media (min-width: 50rem) {
  .main {
    position: relative;
    max-width: 50rem;
  }
}

.main-content-wrap {
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-right: 1rem;
  padding-left: 1rem;
}
@media (min-width: 50rem) {
  .main-content-wrap {
    padding-right: 2rem;
    padding-left: 2rem;
  }
}
@media (min-width: 50rem) {
  .main-content-wrap {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
}

.main-header {
  z-index: 0;
  border-bottom: 1px solid #eeebee;
}
@media (min-width: 50rem) {
  .main-header {
    display: flex;
    justify-content: space-between;
    height: 3.75rem;
  }
}

.site-nav,
.site-header,
.site-footer {
  width: 100%;
}
@media (min-width: 66.5rem) {
  .site-nav,
.site-header,
.site-footer {
    width: 16.5rem;
  }
}

.site-nav {
  display: none;
}
.site-nav.nav-open {
  display: block;
}
@media (min-width: 50rem) {
  .site-nav {
    display: block;
    padding-top: 3rem;
    padding-bottom: 1rem;
    overflow-y: auto;
    flex: 1 1 auto;
  }
}

.site-header {
  display: flex;
  min-height: 3.75rem;
  align-items: center;
}
@media (min-width: 50rem) {
  .site-header {
    height: 3.75rem;
    max-height: 3.75rem;
    border-bottom: 1px solid #eeebee;
  }
}

.site-title {
  flex-grow: 1;
  display: flex;
  height: 100%;
  align-items: center;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  color: #27262b;
  padding-right: 1rem;
  padding-left: 1rem;
}
@media (min-width: 50rem) {
  .site-title {
    padding-right: 2rem;
    padding-left: 2rem;
  }
}
.site-title {
  font-size: 1.125rem !important;
}
@media (min-width: 31.25rem) {
  .site-title {
    font-size: 1.5rem !important;
    line-height: 1.25;
  }
}
@media (min-width: 50rem) {
  .site-title {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
}

.site-logo {
  width: 100%;
  height: 100%;
  background-image: url("/assets/SmarkForm_logo.png");
  background-repeat: no-repeat;
  background-position: left center;
  background-size: contain;
}

.site-button {
  display: flex;
  height: 100%;
  padding: 1rem;
  align-items: center;
}

@media (min-width: 50rem) {
  .site-header .site-button {
    display: none;
  }
}
.site-title:hover {
  background-image: linear-gradient(-90deg, #ebedf5 0%, rgba(235, 237, 245, 0.8) 80%, rgba(235, 237, 245, 0) 100%);
}

.site-button:hover {
  background-image: linear-gradient(-90deg, #ebedf5 0%, rgba(235, 237, 245, 0.8) 100%);
}

body {
  position: relative;
  padding-bottom: 4rem;
  overflow-y: scroll;
}
@media (min-width: 50rem) {
  body {
    position: static;
    padding-bottom: 0;
  }
}

.site-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  padding-top: 1rem;
  padding-bottom: 1rem;
  color: #959396;
  padding-right: 1rem;
  padding-left: 1rem;
}
@media (min-width: 50rem) {
  .site-footer {
    padding-right: 2rem;
    padding-left: 2rem;
  }
}
.site-footer {
  font-size: 0.6875rem !important;
}
@media (min-width: 31.25rem) {
  .site-footer {
    font-size: 0.75rem !important;
  }
}
@media (min-width: 50rem) {
  .site-footer {
    position: static;
    justify-self: end;
  }
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #7253ed;
}

.main-content {
  line-height: 1.6;
}
.main-content ol,
.main-content ul,
.main-content dl,
.main-content pre,
.main-content address,
.main-content blockquote,
.main-content .table-wrapper {
  margin-top: 0.5em;
}
.main-content a {
  overflow: hidden;
  text-overflow: ellipsis;
}
.main-content ul,
.main-content ol {
  padding-left: 1.5em;
}
.main-content li .highlight {
  margin-top: 0.25rem;
}
.main-content ol {
  list-style-type: none;
  counter-reset: step-counter;
}
.main-content ol > li {
  position: relative;
}
.main-content ol > li::before {
  position: absolute;
  top: 0.2em;
  left: -1.6em;
  color: #959396;
  content: counter(step-counter);
  counter-increment: step-counter;
}
.main-content ol > li::before {
  font-size: 0.75rem !important;
}
@media (min-width: 31.25rem) {
  .main-content ol > li::before {
    font-size: 0.875rem !important;
  }
}
@media (min-width: 31.25rem) {
  .main-content ol > li::before {
    top: 0.11em;
  }
}
.main-content ol > li ol {
  counter-reset: sub-counter;
}
.main-content ol > li ol > li::before {
  content: counter(sub-counter, lower-alpha);
  counter-increment: sub-counter;
}
.main-content ul {
  list-style: none;
}
.main-content ul > li::before {
  position: absolute;
  margin-left: -1.4em;
  color: #959396;
  content: "â€¢";
}
.main-content .task-list-item::before {
  content: "";
}
.main-content .task-list-item-checkbox {
  margin-right: 0.6em;
  margin-left: -1.4em;
}
.main-content hr + * {
  margin-top: 0;
}
.main-content h1:first-of-type {
  margin-top: 0.5em;
}
.main-content dl {
  display: grid;
  grid-template: auto/10em 1fr;
}
.main-content dt,
.main-content dd {
  margin: 0.25em 0;
}
.main-content dt {
  grid-column: 1;
  font-weight: 500;
  text-align: right;
}
.main-content dt::after {
  content: ":";
}
.main-content dd {
  grid-column: 2;
  margin-bottom: 0;
  margin-left: 1em;
}
.main-content dd blockquote:first-child,
.main-content dd div:first-child,
.main-content dd dl:first-child,
.main-content dd dt:first-child,
.main-content dd h1:first-child,
.main-content dd h2:first-child,
.main-content dd h3:first-child,
.main-content dd h4:first-child,
.main-content dd h5:first-child,
.main-content dd h6:first-child,
.main-content dd li:first-child,
.main-content dd ol:first-child,
.main-content dd p:first-child,
.main-content dd pre:first-child,
.main-content dd table:first-child,
.main-content dd ul:first-child,
.main-content dd .table-wrapper:first-child {
  margin-top: 0;
}
.main-content dd dl:first-child dt:first-child,
.main-content dd dl:first-child dd:nth-child(2),
.main-content ol dl:first-child dt:first-child,
.main-content ol dl:first-child dd:nth-child(2),
.main-content ul dl:first-child dt:first-child,
.main-content ul dl:first-child dd:nth-child(2) {
  margin-top: 0;
}
.main-content .anchor-heading {
  position: absolute;
  right: -1rem;
  width: 1.5rem;
  height: 100%;
  padding-right: 0.25rem;
  padding-left: 0.25rem;
  overflow: visible;
}
@media (min-width: 50rem) {
  .main-content .anchor-heading {
    right: auto;
    left: -1.5rem;
  }
}
.main-content .anchor-heading svg {
  display: inline-block;
  width: 100%;
  height: 100%;
  color: #7253ed;
  visibility: hidden;
}
.main-content .anchor-heading:hover svg,
.main-content .anchor-heading:focus svg,
.main-content h1:hover > .anchor-heading svg,
.main-content h2:hover > .anchor-heading svg,
.main-content h3:hover > .anchor-heading svg,
.main-content h4:hover > .anchor-heading svg,
.main-content h5:hover > .anchor-heading svg,
.main-content h6:hover > .anchor-heading svg {
  visibility: visible;
}
.main-content summary {
  cursor: pointer;
}
.main-content h1,
.main-content h2,
.main-content h3,
.main-content h4,
.main-content h5,
.main-content h6,
.main-content #toctitle {
  position: relative;
  margin-top: 1.5em;
  margin-bottom: 0.25em;
}
.main-content h1 + table,
.main-content h1 + .table-wrapper,
.main-content h1 + .code-example,
.main-content h1 + .highlighter-rouge,
.main-content h1 + .sectionbody .listingblock,
.main-content h2 + table,
.main-content h2 + .table-wrapper,
.main-content h2 + .code-example,
.main-content h2 + .highlighter-rouge,
.main-content h2 + .sectionbody .listingblock,
.main-content h3 + table,
.main-content h3 + .table-wrapper,
.main-content h3 + .code-example,
.main-content h3 + .highlighter-rouge,
.main-content h3 + .sectionbody .listingblock,
.main-content h4 + table,
.main-content h4 + .table-wrapper,
.main-content h4 + .code-example,
.main-content h4 + .highlighter-rouge,
.main-content h4 + .sectionbody .listingblock,
.main-content h5 + table,
.main-content h5 + .table-wrapper,
.main-content h5 + .code-example,
.main-content h5 + .highlighter-rouge,
.main-content h5 + .sectionbody .listingblock,
.main-content h6 + table,
.main-content h6 + .table-wrapper,
.main-content h6 + .code-example,
.main-content h6 + .highlighter-rouge,
.main-content h6 + .sectionbody .listingblock,
.main-content #toctitle + table,
.main-content #toctitle + .table-wrapper,
.main-content #toctitle + .code-example,
.main-content #toctitle + .highlighter-rouge,
.main-content #toctitle + .sectionbody .listingblock {
  margin-top: 1em;
}
.main-content h1 + p:not(.label),
.main-content h2 + p:not(.label),
.main-content h3 + p:not(.label),
.main-content h4 + p:not(.label),
.main-content h5 + p:not(.label),
.main-content h6 + p:not(.label),
.main-content #toctitle + p:not(.label) {
  margin-top: 0;
}
.main-content > h1:first-child,
.main-content > h2:first-child,
.main-content > h3:first-child,
.main-content > h4:first-child,
.main-content > h5:first-child,
.main-content > h6:first-child,
.main-content > .sect1:first-child > h2,
.main-content > .sect2:first-child > h3,
.main-content > .sect3:first-child > h4,
.main-content > .sect4:first-child > h5,
.main-content > .sect5:first-child > h6 {
  margin-top: 0.5rem;
}

.nav-list {
  padding: 0;
  margin-top: 0;
  margin-bottom: 0;
  list-style: none;
}
.nav-list .nav-list-item {
  position: relative;
  margin: 0;
}
.nav-list .nav-list-item {
  font-size: 0.875rem !important;
}
@media (min-width: 31.25rem) {
  .nav-list .nav-list-item {
    font-size: 1rem !important;
  }
}
@media (min-width: 50rem) {
  .nav-list .nav-list-item {
    font-size: 0.75rem !important;
  }
}
@media (min-width: 50rem) and (min-width: 31.25rem) {
  .nav-list .nav-list-item {
    font-size: 0.875rem !important;
  }
}
.nav-list .nav-list-item .nav-list-link {
  display: block;
  min-height: 3rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  line-height: 2.5rem;
  padding-right: 3rem;
  padding-left: 1rem;
}
@media (min-width: 50rem) {
  .nav-list .nav-list-item .nav-list-link {
    min-height: 2rem;
    line-height: 1.5rem;
    padding-right: 2rem;
    padding-left: 2rem;
  }
}
.nav-list .nav-list-item .nav-list-link.external > svg {
  width: 1rem;
  height: 1rem;
  vertical-align: text-bottom;
}
.nav-list .nav-list-item .nav-list-link.active {
  font-weight: 600;
  text-decoration: none;
}
.nav-list .nav-list-item .nav-list-link:hover, .nav-list .nav-list-item .nav-list-link.active {
  background-image: linear-gradient(-90deg, #ebedf5 0%, rgba(235, 237, 245, 0.8) 80%, rgba(235, 237, 245, 0) 100%);
}
.nav-list .nav-list-item .nav-list-expander {
  position: absolute;
  right: 0;
  width: 3rem;
  height: 3rem;
  padding: 0.75rem;
  color: #7253ed;
}
@media (min-width: 50rem) {
  .nav-list .nav-list-item .nav-list-expander {
    width: 2rem;
    height: 2rem;
    padding: 0.5rem;
  }
}
.nav-list .nav-list-item .nav-list-expander:hover {
  background-image: linear-gradient(-90deg, #ebedf5 0%, rgba(235, 237, 245, 0.8) 100%);
}
.nav-list .nav-list-item .nav-list-expander svg {
  transform: rotate(90deg);
}
.nav-list .nav-list-item > .nav-list {
  display: none;
  padding-left: 0.75rem;
  list-style: none;
}
.nav-list .nav-list-item > .nav-list .nav-list-item {
  position: relative;
}
.nav-list .nav-list-item > .nav-list .nav-list-item .nav-list-link {
  color: #5c5962;
}
.nav-list .nav-list-item > .nav-list .nav-list-item .nav-list-expander {
  color: #5c5962;
}
.nav-list .nav-list-item.active > .nav-list-expander svg {
  transform: rotate(-90deg);
}
.nav-list .nav-list-item.active > .nav-list {
  display: block;
}

.nav-category {
  padding: 0.5rem 1rem;
  font-weight: 600;
  text-align: start;
  text-transform: uppercase;
  border-bottom: 1px solid #eeebee;
}
.nav-category {
  font-size: 0.6875rem !important;
}
@media (min-width: 31.25rem) {
  .nav-category {
    font-size: 0.75rem !important;
  }
}
@media (min-width: 50rem) {
  .nav-category {
    padding: 0.5rem 2rem;
    margin-top: 1rem;
    text-align: start;
  }
  .nav-category:first-child {
    margin-top: 0;
  }
}

.nav-list.nav-category-list > .nav-list-item {
  margin: 0;
}
.nav-list.nav-category-list > .nav-list-item > .nav-list {
  padding: 0;
}
.nav-list.nav-category-list > .nav-list-item > .nav-list > .nav-list-item > .nav-list-link {
  color: #7253ed;
}
.nav-list.nav-category-list > .nav-list-item > .nav-list > .nav-list-item > .nav-list-expander {
  color: #7253ed;
}

.aux-nav {
  height: 100%;
  overflow-x: auto;
}
.aux-nav {
  font-size: 0.6875rem !important;
}
@media (min-width: 31.25rem) {
  .aux-nav {
    font-size: 0.75rem !important;
  }
}
.aux-nav .aux-nav-list {
  display: flex;
  height: 100%;
  padding: 0;
  margin: 0;
  list-style: none;
}
.aux-nav .aux-nav-list-item {
  display: inline-block;
  height: 100%;
  padding: 0;
  margin: 0;
}
@media (min-width: 50rem) {
  .aux-nav {
    padding-right: 1rem;
  }
}

@media (min-width: 50rem) {
  .breadcrumb-nav {
    margin-top: -1rem;
  }
}

.breadcrumb-nav-list {
  padding-left: 0;
  margin-bottom: 0.75rem;
  list-style: none;
}

.breadcrumb-nav-list-item {
  display: table-cell;
}
.breadcrumb-nav-list-item {
  font-size: 0.6875rem !important;
}
@media (min-width: 31.25rem) {
  .breadcrumb-nav-list-item {
    font-size: 0.75rem !important;
  }
}
.breadcrumb-nav-list-item::before {
  display: none;
}
.breadcrumb-nav-list-item::after {
  display: inline-block;
  margin-right: 0.5rem;
  margin-left: 0.5rem;
  color: #959396;
  content: "/";
}
.breadcrumb-nav-list-item:last-child::after {
  content: "";
}

h1,
.text-alpha {
  font-weight: 300;
}
h1,
.text-alpha {
  font-size: 2rem !important;
  line-height: 1.25;
}
@media (min-width: 31.25rem) {
  h1,
.text-alpha {
    font-size: 2.25rem !important;
  }
}

h2,
.text-beta,
#toctitle {
  font-size: 1.125rem !important;
}
@media (min-width: 31.25rem) {
  h2,
.text-beta,
#toctitle {
    font-size: 1.5rem !important;
    line-height: 1.25;
  }
}

h3,
.text-gamma {
  font-size: 1rem !important;
}
@media (min-width: 31.25rem) {
  h3,
.text-gamma {
    font-size: 1.125rem !important;
  }
}

h4,
.text-delta {
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
h4,
.text-delta {
  font-size: 0.6875rem !important;
}
@media (min-width: 31.25rem) {
  h4,
.text-delta {
    font-size: 0.75rem !important;
  }
}

h4 code {
  text-transform: none;
}

h5,
.text-epsilon {
  font-size: 0.75rem !important;
}
@media (min-width: 31.25rem) {
  h5,
.text-epsilon {
    font-size: 0.875rem !important;
  }
}

h6,
.text-zeta {
  font-size: 0.6875rem !important;
}
@media (min-width: 31.25rem) {
  h6,
.text-zeta {
    font-size: 0.75rem !important;
  }
}

.text-small {
  font-size: 0.6875rem !important;
}
@media (min-width: 31.25rem) {
  .text-small {
    font-size: 0.75rem !important;
  }
}

.text-mono {
  font-family: "SFMono-Regular", menlo, consolas, monospace !important;
}

.text-left {
  text-align: left !important;
}

.text-center {
  text-align: center !important;
}

.text-right {
  text-align: right !important;
}

.label:not(g),
.label-blue:not(g) {
  display: inline-block;
  padding: 0.16em 0.56em;
  margin-right: 0.5rem;
  margin-left: 0.5rem;
  color: #fff;
  text-transform: uppercase;
  vertical-align: middle;
  background-color: #2869e6;
  border-radius: 12px;
}
.label:not(g),
.label-blue:not(g) {
  font-size: 0.6875rem !important;
}
@media (min-width: 31.25rem) {
  .label:not(g),
.label-blue:not(g) {
    font-size: 0.75rem !important;
  }
}

.label-green:not(g) {
  background-color: #009c7b;
}

.label-purple:not(g) {
  background-color: #5e41d0;
}

.label-red:not(g) {
  background-color: #e94c4c;
}

.label-yellow:not(g) {
  color: #44434d;
  background-color: #f7d12e;
}

.btn {
  display: inline-block;
  box-sizing: border-box;
  padding: 0.3em 1em;
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  font-weight: 500;
  line-height: 1.5;
  color: #7253ed;
  text-decoration: none;
  vertical-align: baseline;
  cursor: pointer;
  background-color: #f7f7f7;
  border-width: 0;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12), 0 3px 10px rgba(0, 0, 0, 0.08);
  appearance: none;
}
.btn:focus {
  text-decoration: none;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 0, 255, 0.25);
}
.btn:focus:hover, .btn.selected:focus {
  box-shadow: 0 0 0 3px rgba(0, 0, 255, 0.25);
}
.btn:hover, .btn.zeroclipboard-is-hover {
  color: #6a4aec;
}
.btn:hover, .btn:active, .btn.zeroclipboard-is-hover, .btn.zeroclipboard-is-active {
  text-decoration: none;
  background-color: #f4f4f4;
}
.btn:active, .btn.selected, .btn.zeroclipboard-is-active {
  background-color: #efefef;
  background-image: none;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);
}
.btn.selected:hover {
  background-color: #cfcfcf;
}
.btn:disabled, .btn:disabled:hover, .btn.disabled, .btn.disabled:hover {
  color: rgba(102, 102, 102, 0.5);
  cursor: default;
  background-color: rgba(229, 229, 229, 0.5);
  background-image: none;
  box-shadow: none;
}

.btn-outline {
  color: #7253ed;
  background: transparent;
  box-shadow: inset 0 0 0 2px #e6e1e8;
}
.btn-outline:hover, .btn-outline:active, .btn-outline.zeroclipboard-is-hover, .btn-outline.zeroclipboard-is-active {
  color: #6341eb;
  text-decoration: none;
  background-color: transparent;
  box-shadow: inset 0 0 0 3px #e6e1e8;
}
.btn-outline:focus {
  text-decoration: none;
  outline: none;
  box-shadow: inset 0 0 0 2px #5c5962, 0 0 0 3px rgba(0, 0, 255, 0.25);
}
.btn-outline:focus:hover, .btn-outline.selected:focus {
  box-shadow: inset 0 0 0 2px #5c5962;
}

.btn-primary {
  color: #fff;
  background-color: #5739ce;
  background-image: linear-gradient(#6f55d5, #5739ce);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25), 0 4px 10px rgba(0, 0, 0, 0.12);
}
.btn-primary:hover, .btn-primary.zeroclipboard-is-hover {
  color: #fff;
  background-color: #5132cb;
  background-image: linear-gradient(#6549d2, #5132cb);
}
.btn-primary:active, .btn-primary.selected, .btn-primary.zeroclipboard-is-active {
  background-color: #4f31c6;
  background-image: none;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);
}
.btn-primary.selected:hover {
  background-color: #472cb2;
}

.btn-purple {
  color: #fff;
  background-color: #5739ce;
  background-image: linear-gradient(#6f55d5, #5739ce);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25), 0 4px 10px rgba(0, 0, 0, 0.12);
}
.btn-purple:hover, .btn-purple.zeroclipboard-is-hover {
  color: #fff;
  background-color: #5132cb;
  background-image: linear-gradient(#6549d2, #5132cb);
}
.btn-purple:active, .btn-purple.selected, .btn-purple.zeroclipboard-is-active {
  background-color: #4f31c6;
  background-image: none;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);
}
.btn-purple.selected:hover {
  background-color: #472cb2;
}

.btn-blue {
  color: #fff;
  background-color: #227efa;
  background-image: linear-gradient(#4593fb, #227efa);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25), 0 4px 10px rgba(0, 0, 0, 0.12);
}
.btn-blue:hover, .btn-blue.zeroclipboard-is-hover {
  color: #fff;
  background-color: #1878fa;
  background-image: linear-gradient(#368afa, #1878fa);
}
.btn-blue:active, .btn-blue.selected, .btn-blue.zeroclipboard-is-active {
  background-color: #1375f9;
  background-image: none;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);
}
.btn-blue.selected:hover {
  background-color: #0669ed;
}

.btn-green {
  color: #fff;
  background-color: #10ac7d;
  background-image: linear-gradient(#13cc95, #10ac7d);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25), 0 4px 10px rgba(0, 0, 0, 0.12);
}
.btn-green:hover, .btn-green.zeroclipboard-is-hover {
  color: #fff;
  background-color: #0fa276;
  background-image: linear-gradient(#12be8b, #0fa276);
}
.btn-green:active, .btn-green.selected, .btn-green.zeroclipboard-is-active {
  background-color: #0f9e73;
  background-image: none;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);
}
.btn-green.selected:hover {
  background-color: #0d8662;
}

.btn-reset {
  background: none;
  border: none;
  margin: 0;
  text-align: inherit;
  font: inherit;
  border-radius: 0;
  appearance: none;
}

.search {
  position: relative;
  z-index: 2;
  flex-grow: 1;
  height: 4rem;
  padding: 0.5rem;
  transition: padding linear 200ms;
}
@media (min-width: 50rem) {
  .search {
    position: relative !important;
    width: auto !important;
    height: 100% !important;
    padding: 0;
    transition: none;
  }
}

.search-input-wrap {
  position: relative;
  z-index: 1;
  height: 3rem;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12), 0 3px 10px rgba(0, 0, 0, 0.08);
  transition: height linear 200ms;
}
@media (min-width: 50rem) {
  .search-input-wrap {
    position: absolute;
    width: 100%;
    max-width: 33.5rem;
    height: 100% !important;
    border-radius: 0;
    box-shadow: none;
    transition: width ease 400ms;
  }
}

.search-input {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  font-size: 1rem;
  color: #5c5962;
  background-color: #fff;
  border-top: 0;
  border-right: 0;
  border-bottom: 0;
  border-left: 0;
  border-radius: 0;
}
@media (min-width: 50rem) {
  .search-input {
    padding: 0.5rem 1rem 0.5rem 3.5rem;
    font-size: 0.875rem;
    background-color: #fff;
    transition: padding-left linear 200ms;
  }
}
.search-input:focus {
  outline: 0;
}
.search-input:focus + .search-label .search-icon {
  color: #7253ed;
}

.search-label {
  position: absolute;
  display: flex;
  height: 100%;
  padding-left: 1rem;
}
@media (min-width: 50rem) {
  .search-label {
    padding-left: 2rem;
    transition: padding-left linear 200ms;
  }
}
.search-label .search-icon {
  width: 1.2rem;
  height: 1.2rem;
  align-self: center;
  color: #959396;
}

.search-results {
  position: absolute;
  left: 0;
  display: none;
  width: 100%;
  max-height: calc(100% - 4rem);
  overflow-y: auto;
  background-color: #fff;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12), 0 3px 10px rgba(0, 0, 0, 0.08);
}
@media (min-width: 50rem) {
  .search-results {
    top: 100%;
    width: 33.5rem;
    max-height: calc(100vh - 200%) !important;
  }
}

.search-results-list {
  padding-left: 0;
  margin-bottom: 0.25rem;
  list-style: none;
}
.search-results-list {
  font-size: 0.875rem !important;
}
@media (min-width: 31.25rem) {
  .search-results-list {
    font-size: 1rem !important;
  }
}
@media (min-width: 50rem) {
  .search-results-list {
    font-size: 0.75rem !important;
  }
}
@media (min-width: 50rem) and (min-width: 31.25rem) {
  .search-results-list {
    font-size: 0.875rem !important;
  }
}

.search-results-list-item {
  padding: 0;
  margin: 0;
}

.search-result {
  display: block;
  padding: 0.25rem 0.75rem;
}
.search-result:hover, .search-result.active {
  background-color: #ebedf5;
}

.search-result-title {
  display: block;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
@media (min-width: 31.25rem) {
  .search-result-title {
    display: inline-block;
    width: 40%;
    padding-right: 0.5rem;
    vertical-align: top;
  }
}

.search-result-doc {
  display: flex;
  align-items: center;
  word-wrap: break-word;
}
.search-result-doc.search-result-doc-parent {
  opacity: 0.5;
}
.search-result-doc.search-result-doc-parent {
  font-size: 0.75rem !important;
}
@media (min-width: 31.25rem) {
  .search-result-doc.search-result-doc-parent {
    font-size: 0.875rem !important;
  }
}
@media (min-width: 50rem) {
  .search-result-doc.search-result-doc-parent {
    font-size: 0.6875rem !important;
  }
}
@media (min-width: 50rem) and (min-width: 31.25rem) {
  .search-result-doc.search-result-doc-parent {
    font-size: 0.75rem !important;
  }
}
.search-result-doc .search-result-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  color: #7253ed;
  flex-shrink: 0;
}
.search-result-doc .search-result-doc-title {
  overflow: auto;
}

.search-result-section {
  margin-left: 1.5rem;
  word-wrap: break-word;
}

.search-result-rel-url {
  display: block;
  margin-left: 1.5rem;
  overflow: hidden;
  color: #959396;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.search-result-rel-url {
  font-size: 0.5625rem !important;
}
@media (min-width: 31.25rem) {
  .search-result-rel-url {
    font-size: 0.625rem !important;
  }
}

.search-result-previews {
  display: block;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  margin-left: 0.5rem;
  color: #959396;
  word-wrap: break-word;
  border-left: 1px solid;
  border-left-color: #eeebee;
}
.search-result-previews {
  font-size: 0.6875rem !important;
}
@media (min-width: 31.25rem) {
  .search-result-previews {
    font-size: 0.75rem !important;
  }
}
@media (min-width: 31.25rem) {
  .search-result-previews {
    display: inline-block;
    width: 60%;
    padding-left: 0.5rem;
    margin-left: 0;
    vertical-align: top;
  }
}

.search-result-preview + .search-result-preview {
  margin-top: 0.25rem;
}

.search-result-highlight {
  font-weight: bold;
}

.search-no-result {
  padding: 0.5rem 0.75rem;
}
.search-no-result {
  font-size: 0.75rem !important;
}
@media (min-width: 31.25rem) {
  .search-no-result {
    font-size: 0.875rem !important;
  }
}

.search-button {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  display: flex;
  width: 3.5rem;
  height: 3.5rem;
  background-color: #fff;
  border: 1px solid rgba(114, 83, 237, 0.3);
  border-radius: 1.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12), 0 3px 10px rgba(0, 0, 0, 0.08);
  align-items: center;
  justify-content: center;
}

.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 0;
  height: 0;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity ease 400ms, width 0s 400ms, height 0s 400ms;
}

.search-active .search {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0;
}
.search-active .search-input-wrap {
  height: 4rem;
  border-radius: 0;
}
@media (min-width: 50rem) {
  .search-active .search-input-wrap {
    width: 33.5rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12), 0 3px 10px rgba(0, 0, 0, 0.08);
  }
}
.search-active .search-input {
  background-color: #fff;
}
@media (min-width: 50rem) {
  .search-active .search-input {
    padding-left: 2.3rem;
  }
}
@media (min-width: 50rem) {
  .search-active .search-label {
    padding-left: 0.6rem;
  }
}
.search-active .search-results {
  display: block;
}
.search-active .search-overlay {
  width: 100%;
  height: 100%;
  opacity: 1;
  transition: opacity ease 400ms, width 0s, height 0s;
}
@media (min-width: 50rem) {
  .search-active .main {
    position: fixed;
    right: 0;
    left: 0;
  }
}
.search-active .main-header {
  padding-top: 4rem;
}
@media (min-width: 50rem) {
  .search-active .main-header {
    padding-top: 0;
  }
}

.table-wrapper {
  display: block;
  width: 100%;
  max-width: 100%;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12), 0 3px 10px rgba(0, 0, 0, 0.08);
}

table {
  display: table;
  min-width: 100%;
  border-collapse: separate;
}

th,
td {
  min-width: 7.5rem;
  padding: 0.5rem 0.75rem;
  background-color: #fff;
  border-bottom: 1px solid rgba(238, 235, 238, 0.5);
  border-left: 1px solid #eeebee;
}
th,
td {
  font-size: 0.75rem !important;
}
@media (min-width: 31.25rem) {
  th,
td {
    font-size: 0.875rem !important;
  }
}
th:first-of-type,
td:first-of-type {
  border-left: 0;
}

tbody tr:last-of-type th,
tbody tr:last-of-type td {
  border-bottom: 0;
}
tbody tr:last-of-type td {
  padding-bottom: 0.75rem;
}

thead th {
  border-bottom: 1px solid #eeebee;
}

:not(pre, figure) > code {
  padding: 0.2em 0.15em;
  font-weight: 400;
  background-color: #f5f6fa;
  border: 1px solid #eeebee;
  border-radius: 4px;
}

a:visited code {
  border-color: #eeebee;
}

div.highlighter-rouge,
div.listingblock > div.content,
figure.highlight {
  margin-top: 0;
  margin-bottom: 0.75rem;
  background-color: #f5f6fa;
  border-radius: 4px;
  box-shadow: none;
  -webkit-overflow-scrolling: touch;
  position: relative;
  padding: 0;
}
div.highlighter-rouge > button,
div.listingblock > div.content > button,
figure.highlight > button {
  width: 0.75rem;
  opacity: 0;
  position: absolute;
  top: 0;
  right: 0;
  border: 0.75rem solid #f5f6fa;
  background-color: #f5f6fa;
  color: #5c5962;
  box-sizing: content-box;
}
div.highlighter-rouge > button svg,
div.listingblock > div.content > button svg,
figure.highlight > button svg {
  fill: #5c5962;
}
div.highlighter-rouge > button:active,
div.listingblock > div.content > button:active,
figure.highlight > button:active {
  text-decoration: none;
  outline: none;
  opacity: 1;
}
div.highlighter-rouge > button:focus,
div.listingblock > div.content > button:focus,
figure.highlight > button:focus {
  opacity: 1;
}
div.highlighter-rouge:hover > button,
div.listingblock > div.content:hover > button,
figure.highlight:hover > button {
  cursor: copy;
  opacity: 1;
}

div.highlighter-rouge div.highlight {
  overflow-x: auto;
  padding: 0.75rem;
  margin: 0;
  border: 0;
}
div.highlighter-rouge pre.highlight,
div.highlighter-rouge code {
  padding: 0;
  margin: 0;
  border: 0;
}

div.listingblock {
  margin-top: 0;
  margin-bottom: 0.75rem;
}
div.listingblock div.content {
  overflow-x: auto;
  padding: 0.75rem;
  margin: 0;
  border: 0;
}
div.listingblock div.content > pre,
div.listingblock code {
  padding: 0;
  margin: 0;
  border: 0;
}

figure.highlight pre,
figure.highlight :not(pre) > code {
  overflow-x: auto;
  padding: 0.75rem;
  margin: 0;
  border: 0;
}

.highlight .table-wrapper {
  padding: 0.75rem 0;
  margin: 0;
  border: 0;
  box-shadow: none;
}
.highlight .table-wrapper td,
.highlight .table-wrapper pre {
  min-width: 0;
  padding: 0;
  background-color: #f5f6fa;
  border: 0;
}
.highlight .table-wrapper td,
.highlight .table-wrapper pre {
  font-size: 0.6875rem !important;
}
@media (min-width: 31.25rem) {
  .highlight .table-wrapper td,
.highlight .table-wrapper pre {
    font-size: 0.75rem !important;
  }
}
.highlight .table-wrapper td.gl {
  width: 1em;
  padding-right: 0.75rem;
  padding-left: 0.75rem;
}
.highlight .table-wrapper pre {
  margin: 0;
  line-height: 2;
}

.code-example,
.listingblock > .title {
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  overflow: auto;
  border: 1px solid #eeebee;
  border-radius: 4px;
}
.code-example + .highlighter-rouge,
.code-example + .sectionbody .listingblock,
.code-example + .content,
.code-example + figure.highlight,
.listingblock > .title + .highlighter-rouge,
.listingblock > .title + .sectionbody .listingblock,
.listingblock > .title + .content,
.listingblock > .title + figure.highlight {
  position: relative;
  margin-top: -1rem;
  border-right: 1px solid #eeebee;
  border-bottom: 1px solid #eeebee;
  border-left: 1px solid #eeebee;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

code.language-mermaid {
  padding: 0;
  background-color: inherit;
  border: 0;
}

.highlight,
pre.highlight {
  background: #f5f6fa;
  color: #5c5962;
}

.highlight pre {
  background: #f5f6fa;
}

</style>
