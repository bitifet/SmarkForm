(function(){
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.feature-index').forEach(function(grid){
      grid.addEventListener('click', function(e){
        var btn = e.target.closest('.feature-summary');
        if (!btn) return;
        var feat = btn.closest('.feature');
        if (feat.classList.contains('open')) {
          feat.classList.remove('open');
        } else {
          grid.querySelectorAll('.feature.open').forEach(function(f){
            f.classList.remove('open');
          });
          feat.classList.add('open');
        }
      });
    });
    document.addEventListener('click', function(e){
      if (!e.target.closest('.feature')) {
        document.querySelectorAll('.feature.open').forEach(function(f){
          f.classList.remove('open');
        });
      }
    });
  });
})();
