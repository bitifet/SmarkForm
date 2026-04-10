{% include links.md %}


{% if doctabs_ctrl_already_loaded != true %}
{% assign doctabs_ctrl_already_loaded = true %}

<script>
/* doctabs: Simplified "Source + Preview" tab component.
   Two tabs per instance: Source (full HTML document code block) and
   Preview (iframe rendered via srcdoc with sandbox="allow-scripts").
   Multiple instances on the same page are supported. */
var DOCTABS_HEIGHT_PCT_DEFAULT = 60;
var DOCTABS_HEIGHT_PCT_MIN = 25;
var DOCTABS_HEIGHT_PCT_MAX = 90;

document.addEventListener('DOMContentLoaded', function() {
    var containers = document.querySelectorAll('.doctabs-container');
    containers.forEach(function(container) {
        var labels = container.querySelectorAll('.doctabs-label');
        var contents = container.querySelectorAll('.doctabs-content');
        var iframe = container.querySelector('.doctabs-preview-frame');
        var spinner = container.querySelector('.doctabs-preview-spinner');
        var srcEl = container.querySelector('.doctabs-src-data');

        if (!srcEl || !iframe) return;
        var data = JSON.parse(srcEl.textContent);
        var rendered = false;

        function renderFrame() {
            if (rendered) return;
            rendered = true;
            if (spinner) spinner.style.display = 'flex';
            iframe.style.display = 'none';
            /* srcdoc is set directly — the full HTML document is already
               self-contained and loads all dependencies from CDN. */
            iframe.srcdoc = data.docSource;
            iframe.onload = function() {
                if (spinner) spinner.style.display = 'none';
                iframe.style.display = 'block';
                /* Height is controlled by the explicit `height` parameter
                   (percentage of viewport). Without allow-same-origin we
                   cannot read contentDocument.scrollHeight, so we use the
                   configured value or fall back to the default. */
                var heightPct = (typeof data.height === 'number' && data.height > 0)
                    ? Math.max(DOCTABS_HEIGHT_PCT_MIN, Math.min(DOCTABS_HEIGHT_PCT_MAX, data.height))
                    : DOCTABS_HEIGHT_PCT_DEFAULT;
                iframe.style.height = Math.round(window.innerHeight * heightPct / 100) + 'px';
            };
        }

        /* Tab switching */
        labels.forEach(function(label, index) {
            label.addEventListener('click', function() {
                labels.forEach(function(l) { l.classList.remove('doctabs-label-active'); });
                contents.forEach(function(c) { c.classList.remove('doctabs-active'); });
                label.classList.add('doctabs-label-active');
                contents[index].classList.add('doctabs-active');
                /* Render iframe on first activation of the Preview tab. */
                if (label.dataset.tab === 'preview') renderFrame();
            });
        });

        /* Render immediately if the Preview tab is pre-selected. */
        var previewContent = container.querySelector('.doctabs-content-preview');
        if (previewContent && previewContent.classList.contains('doctabs-active')) {
            renderFrame();
        }
    });
});
</script>
<style>
/* doctabs component ── Source + Preview two-tab component */
.doctabs-container {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  position: relative;
  margin: 1.5em 0;
}

.doctabs-labels {
  display: flex;
  justify-content: flex-start;
}

.doctabs-label {
  flex-grow: 0;
  cursor: pointer;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  margin-right: 5px;
  transition: background-color 0.3s;
  user-select: none;
}

.doctabs-label:hover {
  background-color: #e2e6ea;
}

.doctabs-label-active {
  background-color: #e9ecef;
  border-bottom: none;
}

.doctabs-content {
  display: none;
  border: 1px solid #dee2e6;
  border-top: none;
  padding: 15px;
  background-color: #fff;
}

.doctabs-content.doctabs-code {
  padding: 0px;
  min-height: 3em;
}

.doctabs-content.doctabs-code > * {
  margin-bottom: 0px;
}

.doctabs-content pre.highlight {
  max-height: 50vh;
  overflow-y: auto;
}

.doctabs-active {
  display: block;
}

.doctabs-preview-frame {
  min-height: 75px;
  width: 100%;
  border: none;
  display: none;
}

.doctabs-preview-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 75px;
}

.doctabs-preview-spinner::after {
  content: '';
  width: 32px;
  height: 32px;
  border: 3px solid #dee2e6;
  border-top-color: #6c757d;
  border-radius: 50%;
  animation: doctabs-spin 0.8s linear infinite;
}

@keyframes doctabs-spin {
  to { transform: rotate(360deg); }
}

/* Comparison layout: side-by-side framework cards */
.doctabs-comparison {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2em;
  margin: 1.5em 0;
}

@media (min-width: 900px) {
  .doctabs-comparison-2col {
    grid-template-columns: 1fr 1fr;
  }
  .doctabs-comparison-3col {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.doctabs-comparison > .doctabs-card {
  border: 1px solid #dee2e6;
  border-radius: 6px;
  overflow: hidden;
}

.doctabs-card-header {
  padding: 0.5em 1em;
  font-weight: bold;
  font-size: 1em;
  background: #f0f4f8;
  border-bottom: 1px solid #dee2e6;
}

.doctabs-card > .doctabs-container {
  margin: 0;
  border-radius: 0;
}
</style>
{% endif %}
