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


</style>

{% endif %}


