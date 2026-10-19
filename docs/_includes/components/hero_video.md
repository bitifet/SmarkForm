<script>
/* Hero video: deep-link handling for the home page hero.
 *
 * Two hash fragments drive it:
 *   #intro   → (re)start the hero video from the beginning
 *   #video   → offer to play the full video, full screen, in a modal dialog
 *
 * `#intro` exists because the README hero GIF links to
 * https://smarkform.bitifet.net#intro. `intro` is not a real page fragment
 * (the homepage's anchors are all kramdown-generated: #interactive-demo,
 * #tldr, …), so nothing is hijacked.
 *
 * `#video` opens a <dialog> instead of going full screen right away because
 * requestFullscreen() requires a user gesture, and a hash in a freshly opened
 * tab is not one. The visitor's click on "Play" *is* the gesture. Declining
 * simply closes the dialog, leaving the (muted, looped) hero playing in the
 * page.
 *
 * Degrades gracefully: no <dialog> support, or JS disabled, means the hero
 * just keeps autoplaying muted and looped as usual.
 */
(function () {
  var video = document.querySelector('.SmarkForm-Video');
  if (!video) return;

  var dialog = document.getElementById('smarkform-intro-dialog');
  var playBtn = document.getElementById('smarkform-intro-play');
  var closeBtn = document.getElementById('smarkform-intro-close');
  var supportsDialog = !!dialog && typeof dialog.showModal === 'function';

  /* Close a possibly-open dialog without it being a "cancel" (which would also
   * strip the hash); used when the visitor follows a different hash link. */
  var suppressCancel = false;
  function closeDialog() {
    if (supportsDialog && dialog.open) {
      suppressCancel = true;
      dialog.close();
    }
  }

  function seekToStart() {
    try { video.currentTime = 0; } catch (e) { /* not seekable yet */ }
  }

  function play() {
    var p = video.play();
    if (p && typeof p.catch === 'function') p.catch(function () { /* blocked */ });
  }

  function goFullscreen() {
    var fn = video.requestFullscreen || video.webkitRequestFullscreen ||
             video.msRequestFullscreen;
    if (!fn) return false;
    try {
      var r = fn.call(video);
      if (r && typeof r.catch === 'function') r.catch(function () { /* denied */ });
      return true;
    } catch (e) {
      return false;
    }
  }

  if (supportsDialog) {
    if (playBtn) {
      playBtn.addEventListener('click', function () {
        dialog.close();
        seekToStart();
        play();
        if (!goFullscreen()) video.scrollIntoView({block: 'center'});
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', function () { dialog.close(); });
    }
    /* Click on the backdrop (outside the box) dismisses it too. */
    dialog.addEventListener('click', function (ev) {
      if (ev.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', function () {
      /* Not a real page anchor: drop it so there is no dangling "#video". */
      if (!suppressCancel && window.location.hash === '#video') {
        window.history.replaceState(null, '',
          window.location.pathname + window.location.search);
      }
      suppressCancel = false;
    });
  }

  function handle() {
    var hash = decodeURIComponent(window.location.hash.replace(/^#/, ''));

    if (hash === 'intro') {
      closeDialog();
      seekToStart();
      play();
      return;
    }

    if (hash === 'video') {
      seekToStart();
      play();
      if (supportsDialog) {
        if (!dialog.open) dialog.showModal();
      } else {
        /* No <dialog>: fall back to the gesture we have */
        goFullscreen();
      }
    }
  }

  window.addEventListener('hashchange', handle);
  handle();
})();
</script>
