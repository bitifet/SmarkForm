/**
 * Navigation Enhancements
 *
 * Makes navigation section category labels (e.g. "About SmarkForm",
 * "Getting Started") clickable so that tapping/clicking the label text
 * toggles the section open/closed — same as clicking the small expand
 * button on the right. This improves usability, especially on mobile.
 */

(function () {
  'use strict';

  function init() {
    document.querySelectorAll('.nav-category').forEach(function (category) {
      // The expander button is a direct sibling of .nav-category within the
      // same .nav-list-item container.
      var parent = category.parentElement;
      if (!parent) return;
      var expander = parent.querySelector(':scope > .nav-list-expander');
      if (!expander) return;

      category.style.cursor = 'pointer';
      category.addEventListener('click', function () {
        expander.click();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
