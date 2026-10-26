(function () {
  var SANS = "'PP Neue Montreal','Helvetica Neue',Helvetica,Arial,sans-serif", MONO = "'PP Neue Montreal Mono','IBM Plex Mono',monospace", AMIGA = "'At Amiga',Impact,sans-serif", EIKO = "'PP Eiko','Instrument Serif',serif";
  var FONTS = [AMIGA, EIKO, SANS, MONO, AMIGA, MONO, EIKO], COLS = ['#61caf8', '#e8a1b8', '#f5f2ed'];
  var reduced = function () { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; };
  function style(s, f, c) { s.style.fontFamily = f; s.style.fontStyle = f === EIKO ? 'italic' : 'normal'; s.style.fontWeight = f === EIKO ? '300' : '400'; s.style.color = c || 'inherit'; }
  function fill(el) {
    if (el.dataset.ready) return; el.dataset.ready = '1';
    var t = el.getAttribute('data-next-name'); el.textContent = '';
    t.split('').forEach(function (ch) { var s = document.createElement('span'); s.textContent = ch; s.style.display = 'inline-block'; s.style.whiteSpace = 'pre'; s.style.transition = 'color 160ms ease'; style(s, SANS); el.appendChild(s); });
  }
  function scan() { document.querySelectorAll('[data-next-name]').forEach(fill); }
  function play(a, on) {
    var name = a.querySelector('[data-next-name]'), alt = a.querySelector('[data-next-alt]'), arrow = a.querySelector('[data-next-arrow]');
    if (!name) return; fill(name);
    (a._t || []).forEach(clearTimeout); a._t = [];
    if (alt) alt.style.opacity = on ? '1' : '0';
    if (arrow) arrow.style.transform = on ? 'translate(6px,-6px)' : 'none';
    var spans = name.querySelectorAll('span');
    if (!on) { spans.forEach(function (s) { style(s, SANS); }); return; }
    if (reduced()) { spans.forEach(function (s, j) { if (s.textContent.trim()) style(s, FONTS[j % FONTS.length], COLS[j % 3]); }); return; }
    [0, 70, 140, 210].forEach(function (d, k) {
      a._t.push(setTimeout(function () {
        spans.forEach(function (s, j) {
          if (!s.textContent.trim()) return;
          if (k < 3) style(s, FONTS[(j + k * 3) % FONTS.length], COLS[(j + k) % 3]);
          else style(s, FONTS[j % FONTS.length], COLS[j % 3]);
        });
      }, d));
    });
  }
  document.addEventListener('pointerover', function (e) { var a = e.target.closest && e.target.closest('[data-next]'); if (a && !a.contains(e.relatedTarget)) play(a, true); });
  document.addEventListener('pointerout', function (e) { var a = e.target.closest && e.target.closest('[data-next]'); if (a && !a.contains(e.relatedTarget)) play(a, false); });
  document.addEventListener('focusin', function (e) { var a = e.target.closest && e.target.closest('[data-next]'); if (a) play(a, true); });
  document.addEventListener('focusout', function (e) { var a = e.target.closest && e.target.closest('[data-next]'); if (a) play(a, false); });
  var n = 0, iv = setInterval(function () { scan(); if (++n > 60) clearInterval(iv); }, 150);
})();
