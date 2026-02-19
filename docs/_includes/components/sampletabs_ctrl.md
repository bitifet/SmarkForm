{% include links.md %}

{% assign noShowHint = include.noShowHint | default: false %}

{% if noShowHint == false %}

{: .hint :}
> Every example in this section comes with many of the following tabs:
> 
>   * <li data-bullet="🗒️"><b>HTML:</b> HTML source code of the example.</li>
>   * <li data-bullet="🎨"><b>CSS:</b> CSS applied (if any)</li>
>   * <li data-bullet="⚙️ "><b>JS:</b> JavaScript source code of the example.</li>
>   * <li data-bullet="👁️"><b>Preview:</b> This is where you can see the code in action.</li>
>   * <li data-bullet="📝"><b>Notes:</b> Additional notes and insights for better understanding. <b style="color:red">Don't miss it‼️</b></li>
> 
> ✨ Additionally, in the **Preview** tab, yow will find handy buttons:
>   * `⬇️ Export` to export the form data to the *JSON data viewer/editor*.
>   * `⬆️ Import` to import data into the form from the *JSON data viewer/editor*.
>   * `♻️ Reset` to reset the form to its default values.
>   * `❌ Clear` to reset the form to its initial state.

{% endif %}


{% if sampletabs_ctrl_already_loaded != true %}
{% assign sampletabs_ctrl_already_loaded = true %}

<script src="{{ smarkform_umd_dld_link }}?v={{ site.time | date: '%s' }}"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
  const tabContainers = document.querySelectorAll('.tab-container');

  tabContainers.forEach(container => {
    const tabs = container.querySelectorAll('.tab-label');
    const contents = container.querySelectorAll('.tab-content');

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('tab-label-active'));
        contents.forEach(content => content.classList.remove('tab-active'));

        tab.classList.add('tab-label-active');
        contents[index].classList.add('tab-active');
      });
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
  /* Hide the hint block in print */
  .hint {
    display: none !important;
  }
  
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


