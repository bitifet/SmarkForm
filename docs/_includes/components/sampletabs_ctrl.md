{% include links.md %}


{% if sampletabs_ctrl_already_loaded != true %}
{% assign sampletabs_ctrl_already_loaded = true %}

<script src="{{ smarkform_umd_dld_link }}?v={{ site.time | date: '%s' }}"></script>
<script>
/* Render SmarkForm example into an iframe. srcs = {html, css, js} */
function smarkformRenderIframe(iframe, data, srcs) {
    var baseCss = 'button[data-smark]{padding:.5em;margin:0 4px;}';
    var S = 'script';
    var jsSrc = srcs.js || '';
    var sTag = jsSrc ? '\u003c' + S + '\u003e(function(){\n' + jsSrc + '\n})();\u003c/' + S + '\u003e' : '';
    iframe.srcdoc = '<!DOCTYPE html>'
        + '\u003chtml\u003e\u003chead\u003e'
        + '\u003cmeta charset="UTF-8"\u003e'
        + '\u003c' + S + ' src="' + data.smarkformUrl + '"\u003e\u003c/' + S + '\u003e'
        + '\u003cstyle\u003e' + baseCss + '\n' + (srcs.css || '') + '\u003c/style\u003e'
        + '\u003c/head\u003e\u003cbody\u003e'
        + (srcs.html || '')
        + sTag
        + '\u003c/body\u003e\u003c/html\u003e';
    iframe.onload = function() {
        try {
            var h = Math.max(100, this.contentDocument.documentElement.scrollHeight + 20);
            this.style.height = h + 'px';
        } catch(e) {}
    };
}
/* Escape HTML special chars for contenteditable display. */
function smarkformEscapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
document.addEventListener('DOMContentLoaded', function() {
    var tabContainers = document.querySelectorAll('.tab-container');
    tabContainers.forEach(function(container) {
        var tabs = container.querySelectorAll('.tab-label');
        var contents = container.querySelectorAll('.tab-content');
        /* --- Tab switching --- */
        tabs.forEach(function(tab, index) {
            tab.addEventListener('click', function() {
                tabs.forEach(function(t) { t.classList.remove('tab-label-active'); });
                contents.forEach(function(c) { c.classList.remove('tab-active'); });
                tab.classList.add('tab-label-active');
                contents[index].classList.add('tab-active');
            });
        });
        /* --- Source data and preview iframe --- */
        var srcEl = container.querySelector('.smarkform-src-data');
        var iframe = container.querySelector('.smarkform-preview-frame');
        if (!srcEl || !iframe) return;
        var data = JSON.parse(srcEl.textContent);
        var r = function(s) { return (s && s !== '-') ? s.replace(/\$\$/g, '') : ''; };
        var withEditor = false;
        var editMode = false;
        var savedContents = {};
        var previewSrcs = function() {
            return {
                html: withEditor ? r(data.html) : r(data.htmlSource),
                css:  [r(data.css), r(data.cssHidden)].filter(Boolean).join('\n'),
                js:   [r(data.jsHead), r(data.jsHidden), r(data.jsSource)].filter(Boolean).join('\n')
            };
        };
        var activatePreview = function() {
            var previewEl = container.querySelector('.tab-content-preview');
            var idx = Array.prototype.indexOf.call(contents, previewEl);
            if (idx < 0) return;
            tabs.forEach(function(t) { t.classList.remove('tab-label-active'); });
            contents.forEach(function(c) { c.classList.remove('tab-active'); });
            if (tabs[idx]) tabs[idx].classList.add('tab-label-active');
            previewEl.classList.add('tab-active');
        };
        var populateEditable = function() {
            var srcs = previewSrcs();
            var htmlTab = container.querySelector('.tab-content-html');
            if (htmlTab) {
                savedContents.html = htmlTab.innerHTML;
                htmlTab.innerHTML = '<pre contenteditable="true" class="smarkform-editable" data-kind="html">' + smarkformEscapeHtml(srcs.html) + '</pre>';
            }
            var cssTab = container.querySelector('.tab-content-css');
            if (cssTab) {
                savedContents.css = cssTab.innerHTML;
                cssTab.innerHTML = '<pre contenteditable="true" class="smarkform-editable" data-kind="css">' + smarkformEscapeHtml(srcs.css) + '</pre>';
            }
            var jsTab = container.querySelector('.tab-content-js');
            if (jsTab) {
                savedContents.js = jsTab.innerHTML;
                jsTab.innerHTML = '<pre contenteditable="true" class="smarkform-editable" data-kind="js">' + smarkformEscapeHtml(srcs.js) + '</pre>';
            }
        };
        /* --- Initial render --- */
        smarkformRenderIframe(iframe, data, previewSrcs());
        /* --- Controls --- */
        var editToggle   = container.querySelector('.smarkform-edit-toggle');
        var editorToggle = container.querySelector('.smarkform-editor-toggle');
        var runBtn       = container.querySelector('.smarkform-run-btn');
        if (!editToggle || !runBtn) return;
        editToggle.addEventListener('change', function() {
            editMode = this.checked;
            if (editMode) {
                runBtn.style.display = '';
                if (editorToggle) editorToggle.disabled = !data.showEditor;
                savedContents = {};
                populateEditable();
                smarkformRenderIframe(iframe, data, previewSrcs());
            } else {
                runBtn.style.display = 'none';
                if (editorToggle) { editorToggle.disabled = true; editorToggle.checked = false; }
                withEditor = false;
                ['html', 'css', 'js'].forEach(function(kind) {
                    if (savedContents[kind]) {
                        var tab = container.querySelector('.tab-content-' + kind);
                        if (tab) tab.innerHTML = savedContents[kind];
                    }
                });
                savedContents = {};
                smarkformRenderIframe(iframe, data, previewSrcs());
            }
        });
        if (editorToggle) {
            editorToggle.addEventListener('change', function() {
                withEditor = this.checked;
                if (editMode) {
                    var htmlTab = container.querySelector('.tab-content-html');
                    if (htmlTab) {
                        htmlTab.innerHTML = '<pre contenteditable="true" class="smarkform-editable" data-kind="html">' + smarkformEscapeHtml(withEditor ? r(data.html) : r(data.htmlSource)) + '</pre>';
                    }
                }
                smarkformRenderIframe(iframe, data, previewSrcs());
            });
        }
        runBtn.addEventListener('click', function() {
            var htmlEl = container.querySelector('[data-kind="html"]');
            var cssEl  = container.querySelector('[data-kind="css"]');
            var jsEl   = container.querySelector('[data-kind="js"]');
            var srcs = previewSrcs();
            smarkformRenderIframe(iframe, data, {
                html: htmlEl ? htmlEl.textContent : srcs.html,
                css:  cssEl  ? cssEl.textContent  : srcs.css,
                js:   jsEl   ? jsEl.textContent   : srcs.js
            });
            activatePreview();
        });
    });
});
</script>
<style>
.tab-container {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  position: relative;
  transition: opacity 0.2s;
}

.link-anchor {
    position: absolute;
    top: 5px;
    left: -25px;
    opacity: 0.20;
}

.link-anchor:hover {
    opacity: 1;
}

.tab-labels {
  display: flex;
  justify-content: flex-start;
}

.tab-label {
  flex-grow: 0;
  cursor: pointer;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  margin-right: 5px;
  transition: background-color 0.3s;
  user-select: none;
}

.tab-label.tab-label-right {
  margin-left: auto;
  margin-right: 0;
}

.tab-label:hover {
  background-color: #e2e6ea;
}

.tab-content {
  display: none;
  border: 1px solid #dee2e6;
  border-top: none;
  padding: 15px;
  background-color: #fff;
}

.tab-content pre.highlight {
  max-height: 50vh;
  overflow-y: auto;
}

.tab-active {
  display: block;
}

.tab-label-active {
  background-color: #e9ecef;
  border-bottom: none;
}

button[data-smark] {
    padding: .5em;
    margin: 0px 4px;
}

.smarkform-edit-toolbar {
    display: flex;
    align-items: center;
    gap: 0.75em;
    padding: 4px 8px;
    background: #f0f0f0;
    border: 1px solid #dee2e6;
    border-top: none;
    font-size: 0.9em;
}

.smarkform-run-btn {
    padding: 2px 10px;
    cursor: pointer;
    margin-left: auto;
}

.smarkform-editable {
    white-space: pre-wrap;
    word-break: break-all;
    padding: 1em;
    background: #f8f9fa;
    min-height: 4em;
    outline: 2px solid #adb5bd;
    border-radius: 2px;
    font-family: monospace;
    font-size: 0.9em;
    margin: 0;
}

 
/* Reset Jekyll styles for the preview tab */
#main-content .tab-content.tab-content-preview ul > li::before {
  position: initial;
  margin-left: initial;
  color: initial;
  content: "";
}
#main-content .tab-content-preview li {
    list-style-type: initial;
}


/* Print-friendly styles */
@media print {
  /* Make tab-container a flex container for ordering */
  .tab-container {
    display: flex !important;
    flex-direction: column !important;
    border: 2px solid #333;
    padding: 10px;
    margin: 20px 0;
    page-break-inside: avoid;
  }
  
  /* Hide the link anchor in print */
  .link-anchor {
    display: none;
  }
  
  /* Hide the tab labels container - we'll use pseudo-elements on content instead */
  .tab-labels {
    display: none;
  }
  
  /* Show all tab content */
  .tab-content {
    display: block !important;
    border: none !important;
    padding: 0 !important;
    margin-bottom: 0.75em;
    page-break-inside: avoid;
  }
  
  /* Hide JSON editor textarea in print */
  /* Uses attribute selector to match data-smark JSON containing "name":"editor" */
  /* This matches the textarea element defined in sampletabs_tpl.md line 109 */
  textarea[data-smark*='"name":"editor"'] {
    display: none !important;
  }

  /* Hide the edit toolbar in print */
  .smarkform-edit-toolbar {
    display: none !important;
  }

  /* Make iframe fill width in print */
  .smarkform-preview-frame {
    width: 100% !important;
    border: 1px solid #ccc !important;
  }
  
  /* Add heading before each tab content using pseudo-elements */
  .tab-content::before {
    display: block;
    font-size: 1.2em;
    font-weight: bold;
    padding: 0.8em 0 0.2em 0;
    margin: 0.75em 0 0.5em 0;
    border-top: 1px solid #999;
  }
  
  /* First content block shouldn't have top border */
  .tab-content:first-of-type::before {
    border-top: none;
    margin-top: 0;
    padding-top: 0;
  }
  
  /* Add specific labels for each tab type */
  .tab-content-html::before {
    content: "🗒️ HTML";
  }
  
  .tab-content-css::before {
    content: "🎨 CSS";
  }
  
  .tab-content-js::before {
    content: "⚙️ JS";
  }
  
  .tab-content-preview::before {
    content: "👁️ Preview";
  }
  
  .tab-content-notes::before {
    content: "📝 Notes";
  }
  
  /* Remove height restrictions and fix horizontal overflow on code blocks for print */
  /* Apply to both pre and code elements to ensure consistent wrapping in all browsers */
  .tab-content pre.highlight {
    max-height: none !important;
    overflow-y: visible !important;
    overflow-x: visible !important;
    white-space: pre-wrap !important;
    word-wrap: break-word !important; /* Fallback for older browsers */
    overflow-wrap: break-word !important; /* Modern standard */
  }
  
  .tab-content pre.highlight code {
    white-space: pre-wrap !important;
    word-wrap: break-word !important; /* Fallback for older browsers */
    overflow-wrap: break-word !important; /* Modern standard */
  }
  
  /* Ensure proper ordering for standard tabs */
  .tab-content-html { order: 10; }
  .tab-content-css { order: 20; }
  .tab-content-js { order: 30; }
  .tab-content-preview { order: 40; }
  .tab-content-notes { order: 50; }
  .tab-content-hint { display: none !important; }
  
  /* Active tab always comes first */
  .tab-content.tab-active {
    order: 0 !important;
  }
  
  /* Make buttons visible in preview tab (override browser default print styles) */
  .tab-content-preview button {
    display: inline-block !important;
  }
  
  /* Hide only the Import/Export/Clear action buttons */
  button[data-smark*='"action":"export"'],
  button[data-smark*='"action":"import"'],
  button[data-smark*='"action":"reset"'],
  button[data-smark*='"action":"clear"'] {
    display: none !important;
  }
}


</style>

{% endif %}


