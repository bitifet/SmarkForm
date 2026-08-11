(function(){
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.feature-index').forEach(function(grid){
      grid.addEventListener('click', function(e){
        var btn = e.target.closest('.feature-summary');
        if (!btn) return;
        var feat = btn.closest('.feature');
        var desc = feat.querySelector('.feature-desc');
        if (feat.classList.contains('open')) {
          feat.classList.remove('open');
          desc.style.left = '';
          desc.style.top = '';
        } else {
          grid.querySelectorAll('.feature.open').forEach(function(f){
            f.classList.remove('open');
          });
          // Position the popover below the button, relative to the grid
          var gridRect = grid.getBoundingClientRect();
          var btnRect = btn.getBoundingClientRect();
          desc.style.left = (btnRect.left - gridRect.left) + 'px';
          desc.style.top = (btnRect.bottom - gridRect.top + 4) + 'px';
          feat.classList.add('open');
        }
      });
    });
    document.addEventListener('click', function(e){
      if (!e.target.closest('.feature')) {
        document.querySelectorAll('.feature.open').forEach(function(f){
          f.classList.remove('open');
          var d = f.querySelector('.feature-desc');
          if (d) { d.style.left = ''; d.style.top = ''; }
        });
      }
    });
  });
})();
