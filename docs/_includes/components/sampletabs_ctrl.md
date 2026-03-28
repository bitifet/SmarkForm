{% include links.md %}


{% if sampletabs_ctrl_already_loaded != true %}
{% assign sampletabs_ctrl_already_loaded = true %}

<script src="{{ smarkform_umd_dld_link }}?v={{ site.time | date: '%s' }}"></script>
<script src="https://cdn.jsdelivr.net/npm/ace-builds@1.43.6/src-min-noconflict/ace.js" crossorigin="anonymous"></script>
<script>
if (typeof ace !== 'undefined') {
    ace.config.set('basePath', 'https://cdn.jsdelivr.net/npm/ace-builds@1.43.6/src-min-noconflict/');
    ace.config.set('useWorker', false);
}
var SMARKFORM_EDITOR_KINDS = ['html', 'css', 'js'];
var SMARKFORM_ACE_MIN_LINES = 5;
var SMARKFORM_ACE_MAX_LINES = 35;
var SMARKFORM_HEIGHT_PCT_DEFAULT = 50;
var SMARKFORM_HEIGHT_PCT_MIN = 25;
var SMARKFORM_HEIGHT_PCT_MAX = 90;
/* Compute the heightPct for a given data object.
   Uses data.height (explicit override from the template) when > 0; otherwise derives
   from the htmlSource line count using the formula lines*3+15.
   Result is always clamped to [SMARKFORM_HEIGHT_PCT_MIN, SMARKFORM_HEIGHT_PCT_MAX].
   Falls back to SMARKFORM_HEIGHT_PCT_DEFAULT when no usable source is available. */
function smarkformComputeHeightPct(data) {
    if (typeof data.height === 'number' && data.height > 0) {
        return Math.max(SMARKFORM_HEIGHT_PCT_MIN, Math.min(SMARKFORM_HEIGHT_PCT_MAX, data.height));
    }
    if (data.htmlSource) {
        var lines = data.htmlSource.split('\n').length;
        return Math.max(SMARKFORM_HEIGHT_PCT_MIN, Math.min(SMARKFORM_HEIGHT_PCT_MAX, lines * 1 + 15));
    }
    return SMARKFORM_HEIGHT_PCT_DEFAULT;
}
/* Build the human-readable editor scaffold HTML for the HTML ace editor tab
   when "Include playground editor" is active in edit mode. */
function smarkformEditorScaffoldHtml(showReset) {
    return (
        '<div id="sf-editor-scaffold">\n'
        + '  <div>\n'
        + '    <span><button id="sf-export-btn" title="Export form to JSON editor">\u2b07\ufe0f Export</button></span>\n'
        + '    <span><button id="sf-import-btn" title="Import from JSON editor to form">\u2b06\ufe0f Import</button></span>\n'
        + '    <span' + (showReset ? '' : ' style="visibility:hidden"') + '><button id="sf-reset-btn" title="Reset the form to its default values">\u267b\ufe0f Reset</button></span>\n'
        + '    <span><button id="sf-clear-btn" title="Clear the whole form">\u274c Clear</button></span>\n'
        + '  </div>\n'
        + '  <textarea id="sf-editor-ta" placeholder="JSON playground editor"></textarea>\n'
        + '</div>'
    );
}
/* Build the human-readable editor binding JS for the JS ace editor tab
   when "Include playground editor" is active in edit mode. */
function smarkformEditorScaffoldJs() {
    return (
        'var _sfTa = document.getElementById("sf-editor-ta");\n'
        + 'document.getElementById("sf-export-btn").addEventListener("click", function() {\n'
        + '    myForm.rendered.then(async function() {\n'
        + '        _sfTa.value = JSON.stringify(await myForm.export(), null, 2);\n'
        + '    });\n'
        + '});\n'
        + 'document.getElementById("sf-import-btn").addEventListener("click", function() {\n'
        + '    try { myForm.import(JSON.parse(_sfTa.value)); } catch(e) {}\n'
        + '});\n'
        + 'document.getElementById("sf-reset-btn").addEventListener("click", function() { myForm.reset(); });\n'
        + 'document.getElementById("sf-clear-btn").addEventListener("click", function() { myForm.clear(); });'
    );
}
/* Render SmarkForm example into an iframe.
   srcs = {html, css, js, hasEditor, inlineEditor}
   - hasEditor:    inject the editor scaffold externally (normal preview mode)
   - inlineEditor: editor scaffold already present in srcs.html/srcs.js; only
                   apply editor CSS, do NOT re-inject HTML or JS. */
function smarkformRenderIframe(iframe, data, srcs) {
    var hasEditor = !!srcs.hasEditor;
    var inlineEditor = !!srcs.inlineEditor;
    var heightPct = smarkformComputeHeightPct(data);
    var spinner = iframe.closest('.smarkform_example') ? iframe.closest('.smarkform_example').querySelector('.smarkform-preview-spinner') : null;
    if (spinner) spinner.style.display = 'flex';
    iframe.style.display = 'none';
    var baseCss = 'button{padding:.5em;margin:0 4px;}';
    var editorCss = (hasEditor || inlineEditor) ? '#sf-editor-scaffold{display:flex;flex-direction:column;gap:0.5em;padding:0.5em 0;margin-top:0.5em;}#sf-editor-scaffold>div{display:flex;flex-wrap:wrap;justify-content:space-evenly;gap:4px;}#sf-editor-ta{resize:vertical;min-height:8em;width:100%;box-sizing:border-box;}' : '';
    var editorHtml = hasEditor ? (
        '<div id="sf-editor-scaffold">'
        + '<div>'
        + '<span><button id="sf-export-btn" title="Export form to JSON editor">\u2b07\ufe0f Export</button></span>'
        + '<span><button id="sf-import-btn" title="Import from JSON editor to form">\u2b06\ufe0f Import</button></span>'
        + '<span' + (data.showEditor ? '' : ' style="visibility:hidden"') + '><button id="sf-reset-btn" title="Reset the form to its default values">\u267b\ufe0f Reset</button></span>'
        + '<span><button id="sf-clear-btn" title="Clear the whole form">\u274c Clear</button></span>'
        + '</div>'
        + '<textarea id="sf-editor-ta" placeholder="JSON playground editor"></textarea>'
        + '</div>'
    ) : '';
    var editorJs = hasEditor ? (
        '\nvar _sfTa=document.getElementById("sf-editor-ta");'
        + '\ndocument.getElementById("sf-export-btn").addEventListener("click",function(){myForm.rendered.then(async function(){_sfTa.value=JSON.stringify(await myForm.export(),null,2);});});'
        + '\ndocument.getElementById("sf-import-btn").addEventListener("click",function(){try{myForm.import(JSON.parse(_sfTa.value));}catch(e){}});'
        + '\ndocument.getElementById("sf-reset-btn").addEventListener("click",function(){myForm.reset();});'
        + '\ndocument.getElementById("sf-clear-btn").addEventListener("click",function(){myForm.clear();});'
    ) : '';
    var S = 'script';
    var jsSrc = (srcs.js || '') + editorJs;
    var sTag = jsSrc ? '\u003c' + S + '\u003e(function(){\n' + jsSrc + '\n})();\u003c/' + S + '\u003e' : '';
    iframe.dataset.hasEditor = (hasEditor || inlineEditor) ? '1' : '';
    iframe.srcdoc = '<!DOCTYPE html>'
        + '\u003chtml\u003e\u003chead\u003e'
        + '\u003cmeta charset="UTF-8"\u003e'
        + '\u003c' + S + ' src="' + data.smarkformUrl + '"\u003e\u003c/' + S + '\u003e'
        + '\u003cstyle\u003e' + baseCss + '\n' + editorCss + '\n' + (srcs.css || '') + '\u003c/style\u003e'
        + '\u003c/head\u003e\u003cbody\u003e'
        + (srcs.html || '')
        + editorHtml
        + sTag
        + '\u003c/body\u003e\u003c/html\u003e';
    iframe.onload = function() {
        if (spinner) spinner.style.display = 'none';
        this.style.display = 'block';
        try {
            var doc = this.contentDocument;
            var naturalH = doc.documentElement.scrollHeight;
            var maxH = (hasEditor || inlineEditor)
                ? Math.round(window.innerHeight * 0.85)
                : Math.round(window.innerHeight * heightPct / 100);
            this.style.height = Math.max(100, Math.min(naturalH + 20, maxH)) + 'px';
        } catch(e) {}
    };
}
/* Escape HTML special chars for display in non-edit mode (unchanged source tabs). */
function smarkformEscapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
/* Create and return an Ace editor instance inside the given tab element.
   Falls back to a plain contenteditable block if Ace is unavailable. */
function smarkformMakeAceEditor(tab, mode, content) {
    tab.innerHTML = '';
    if (typeof ace !== 'undefined') {
        var div = document.createElement('div');
        div.className = 'smarkform-ace-editor';
        tab.appendChild(div);
        var ed = ace.edit(div);
        ed.setTheme('ace/theme/textmate');
        ed.session.setMode(mode);
        ed.setValue(content, -1);
        ed.setOptions({minLines: SMARKFORM_ACE_MIN_LINES, maxLines: SMARKFORM_ACE_MAX_LINES, wrap: false, showPrintMargin: false, tabSize: 2, useSoftTabs: true});
        return ed;
    }
    /* Fallback: plain contenteditable pre (no syntax highlighting) */
    var pre = document.createElement('pre');
    pre.className = 'smarkform-ace-editor smarkform-ace-fallback';
    pre.contentEditable = 'true';
    pre.textContent = content;
    tab.appendChild(pre);
    return {
        getValue: function() { return pre.textContent; },
        setValue: function(v) { pre.textContent = v; },
        destroy: function() {},
        resize: function() {}
    };
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
                /* Re-measure iframe height now that it is visible (it may have loaded while hidden) */
                var frame = contents[index].querySelector('.smarkform-preview-frame');
                if (frame) {
                    try {
                        var h = frame.contentDocument.documentElement.scrollHeight;
                        if (h > 50) {
                            var hasEd = !!frame.dataset.hasEditor;
                            var maxH = hasEd
                                ? Math.round(window.innerHeight * 0.85)
                                : Math.round(window.innerHeight * smarkformComputeHeightPct(data) / 100);
                            frame.style.height = Math.max(100, Math.min(h + 20, maxH)) + 'px';
                        }
                    } catch(e) {}
                }
                /* Resize any Ace editors in the newly visible tab (fixes layout when switching tabs) */
                SMARKFORM_EDITOR_KINDS.forEach(function(k) {
                    if (aceEditors[k] && aceEditors[k].resize) aceEditors[k].resize();
                });
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
        var aceEditors = {};
        var previewSrcs = function() {
            var useEditor = editMode ? withEditor : !!data.showEditor;
            var baseJs = [r(data.jsHeadDisplay || data.jsHead), r(data.jsHidden), r(data.jsSource)].filter(Boolean).join('\n');
            if (editMode && withEditor) {
                /* In edit mode with "Include playground editor" checked, include the
                   editor scaffold inline in HTML/JS so the ace editors show the
                   complete source needed to reproduce the example with the editor. */
                return {
                    html: r(data.htmlSource) + '\n' + smarkformEditorScaffoldHtml(!!data.showEditor),
                    css:  [r(data.css), r(data.cssHidden)].filter(Boolean).join('\n'),
                    js:   baseJs ? baseJs + '\n' + smarkformEditorScaffoldJs() : smarkformEditorScaffoldJs(),
                    hasEditor: false,
                    inlineEditor: true,
                };
            }
            return {
                html: r(data.htmlSource),
                css:  [r(data.css), r(data.cssHidden)].filter(Boolean).join('\n'),
                js:   baseJs,
                hasEditor: useEditor
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
            /* Destroy any lingering Ace editors before recreating */
            Object.keys(aceEditors).forEach(function(k) { aceEditors[k].destroy(); });
            aceEditors = {};
            var htmlTab = container.querySelector('.tab-content-html');
            if (htmlTab) {
                savedContents.html = htmlTab.innerHTML;
                aceEditors.html = smarkformMakeAceEditor(htmlTab, 'ace/mode/html', srcs.html);
            }
            var cssTab = container.querySelector('.tab-content-css');
            if (cssTab) {
                savedContents.css = cssTab.innerHTML;
                aceEditors.css = smarkformMakeAceEditor(cssTab, 'ace/mode/css', srcs.css);
            }
            var jsTab = container.querySelector('.tab-content-js');
            if (jsTab) {
                savedContents.js = jsTab.innerHTML;
                aceEditors.js = smarkformMakeAceEditor(jsTab, 'ace/mode/javascript', srcs.js);
            }
        };
        /* --- Initial render --- */
        smarkformRenderIframe(iframe, data, previewSrcs());
        /* --- Controls --- */
        var editToggle   = container.querySelector('.smarkform-edit-toggle');
        var editorLabel  = container.querySelector('.smarkform-editor-label');
        var editorToggle = container.querySelector('.smarkform-editor-toggle');
        var runBtn       = container.querySelector('.smarkform-run-btn');
        if (!editToggle || !runBtn) return;
        editToggle.addEventListener('change', function() {
            editMode = this.checked;
            if (editMode) {
                runBtn.style.display = '';
                if (editorLabel) editorLabel.style.display = '';
                if (editorToggle) editorToggle.disabled = !data.showEditor;
                savedContents = {};
                populateEditable();
                smarkformRenderIframe(iframe, data, previewSrcs());
            } else {
                runBtn.style.display = 'none';
                if (editorLabel) editorLabel.style.display = 'none';
                if (editorToggle) { editorToggle.disabled = true; editorToggle.checked = false; }
                withEditor = false;
                /* Destroy Ace editors and restore saved syntax-highlighted content */
                Object.keys(aceEditors).forEach(function(k) { aceEditors[k].destroy(); });
                aceEditors = {};
                SMARKFORM_EDITOR_KINDS.forEach(function(kind) {
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
                /* Update ace editor contents to include/exclude the editor scaffold
                   source so the user sees what will actually render. */
                var srcs = previewSrcs();
                if (aceEditors.html) aceEditors.html.setValue(srcs.html, -1);
                if (aceEditors.js) aceEditors.js.setValue(srcs.js, -1);
                smarkformRenderIframe(iframe, data, srcs);
            });
        }
        /* Hint icon: show tooltip as alert on tap/click (mobile accessibility) */
        var hintIcon = container.querySelector('.smarkform-hint-icon');
        if (hintIcon) {
            hintIcon.addEventListener('click', function(e) {
                e.preventDefault();
                window.alert(this.title);
            });
        }
        runBtn.addEventListener('click', function() {
            var srcs = previewSrcs();
            smarkformRenderIframe(iframe, data, {
                html: aceEditors.html ? aceEditors.html.getValue() : srcs.html,
                css:  aceEditors.css  ? aceEditors.css.getValue()  : srcs.css,
                js:   aceEditors.js   ? aceEditors.js.getValue()   : srcs.js,
                hasEditor: srcs.hasEditor,
                inlineEditor: srcs.inlineEditor,
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

.tab-content.tab-code {
  padding: 0px;
  min-height: 3em;
}
.tab-content.tab-code>* {
  margin-bottom: 0px;
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

.smarkform-ace-editor {
    border: 1px solid #adb5bd;
    border-radius: 2px;
    font-size: 0.88em;
}

.smarkform-ace-fallback {
    white-space: pre-wrap;
    word-break: break-all;
    padding: 0.75em;
    background: #f8f9fa;
    min-height: 4em;
    font-family: monospace;
    outline: none;
    margin: 0;
}

.smarkform-preview-frame {
    min-height: 75px;
}

.smarkform-preview-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 75px;
}

.smarkform-preview-spinner::after {
    content: '';
    width: 32px;
    height: 32px;
    border: 3px solid #dee2e6;
    border-top-color: #6c757d;
    border-radius: 50%;
    animation: smarkform-spin 0.8s linear infinite;
}

@keyframes smarkform-spin {
    to { transform: rotate(360deg); }
}

.smarkform-hint-icon {
    cursor: help;
    font-size: 0.85em;
    opacity: 0.7;
    user-select: none;
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
  
  /* Hide JSON editor scaffold in print */
  #sf-editor-scaffold {
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
    display: block !important;
  }

  /* Hide spinner in print */
  .smarkform-preview-spinner {
    display: none !important;
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


