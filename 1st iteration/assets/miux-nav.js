(function () {
  var touch = false;
  function set(m, open) {
    var p = m.querySelector('[data-nav-panel]'), t = m.querySelector('[data-nav-trigger]');
    if (!p) return;
    p.style.display = open ? 'block' : 'none';
    if (t) t.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function closeAll(except) { document.querySelectorAll('[data-nav-menu]').forEach(function (x) { if (x !== except) set(x, false); }); }
  function menuOf(el) { return el && el.closest ? el.closest('[data-nav-menu]') : null; }
  document.addEventListener('pointerdown', function (e) { touch = e.pointerType === 'touch'; }, true);
  document.addEventListener('pointerover', function (e) {
    if (e.pointerType === 'touch') return;
    var m = menuOf(e.target); closeAll(m); if (m) set(m, true);
  });
  document.addEventListener('focusin', function (e) { var m = menuOf(e.target); closeAll(m); if (m) set(m, true); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(null); });
  document.addEventListener('click', function (e) {
    var trig = e.target.closest && e.target.closest('[data-nav-trigger]'), m = menuOf(e.target);
    if (trig && touch) {
      var p = m && m.querySelector('[data-nav-panel]');
      if (p && p.style.display !== 'block') { e.preventDefault(); closeAll(m); set(m, true); return; }
    }
    if (!m) closeAll(null);
  });
})();
