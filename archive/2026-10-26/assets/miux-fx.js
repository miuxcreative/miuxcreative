(function (g) {
  var NS = 'http://www.w3.org/2000/svg';
  var reduced = function () { return g.matchMedia('(prefers-reduced-motion: reduce)').matches; };
  var fine = function () { return g.matchMedia('(hover: hover) and (pointer: fine)').matches; };

  function injectDefs() {
    if (document.getElementById('miux-defs-host') || !g.MIUX_DEFS) return;
    var host = document.createElement('div');
    host.id = 'miux-defs-host';
    host.setAttribute('aria-hidden', 'true');
    host.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    host.innerHTML = g.MIUX_DEFS;
    document.body.prepend(host);
    if (!document.getElementById('miuxMiniGrad')) {
      var s = document.createElementNS(NS, 'svg');
      s.setAttribute('width', '0'); s.setAttribute('height', '0'); s.style.position = 'absolute';
      s.innerHTML = '<defs><linearGradient id="miuxMiniGrad" x1="0" y1="0" x2="1" y2=".3"><stop offset="0" stop-color="#61caf8"/><stop offset="1" stop-color="#e8a1b8"/></linearGradient></defs>';
      host.appendChild(s);
    }
  }

  function miniM(fill, extra) {
    var paths = (g.MIUX_GEO && g.MIUX_GEO.miniM) || [];
    return '<svg viewBox="0 0 152 95" ' + (extra || '') + ' aria-hidden="true">' + paths.map(function (d) { return '<path d="' + d + '" fill="' + (fill || 'currentColor') + '"/>'; }).join('') + '</svg>';
  }

  function actionFor(t) {
    if (!t || t.nodeType !== 1) return '';
    var c = t.closest('a,button,[role="button"],input,select,textarea,[data-cursor]');
    if (!c) return '';
    if (c.dataset.cursor) return c.dataset.cursor;
    if (c.matches('input,select,textarea')) return 'SPILL IT';
    if (c.matches('a[href^="mailto:"]')) return 'YEET';
    var txt = ((c.getAttribute('aria-label') || c.textContent || '') + ' ' + (c.getAttribute('href') || '')).toLowerCase();
    if (/contact|start|let.?s talk/.test(txt)) return 'HOLLER';
    if (c.matches('a[target="_blank"]')) return 'BEAM OUT';
    if ((c.getAttribute('href') || '').charAt(0) === '#') return 'ZOOP';
    return 'OOH';
  }

  function mountCursor() {
    if (!fine() || reduced() || document.getElementById('miux-cursor')) return function () {};
    document.documentElement.dataset.miuxCursor = 'on';
    var el = document.createElement('div');
    el.id = 'miux-cursor';
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;opacity:0;transition:opacity 120ms ease';
    el.innerHTML =
      '<div data-dot style="position:absolute;left:0;top:0;width:12px;aspect-ratio:1049/935;translate:-50% -50%;background:#0d0e11;clip-path:url(#miuxHex);transition:width 160ms ease"><div data-dotfill style="position:absolute;inset:1px;background:#61caf8;clip-path:url(#miuxHex);transition:background 160ms ease"></div></div>' +
      '<div data-buddy style="position:absolute;left:0;top:0;width:26px;height:17px;transition:opacity 140ms ease,scale 140ms ease">' + miniM('url(#miuxMiniGrad)', 'style="width:100%;height:100%;display:block;overflow:visible;animation:miux-feet 1.2s ease-in-out infinite"') + '</div>' +
      '<div data-label style="position:absolute;left:14px;top:12px;display:none;padding:8px 9px;border:1px solid #0d0e11;background:#61caf8;color:#08090d;font:10px/1 \'PP Neue Montreal Mono\',\'IBM Plex Mono\',monospace;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap"></div>';
    document.body.appendChild(el);
    var dot = el.querySelector('[data-dot]'), fill = el.querySelector('[data-dotfill]'), buddy = el.querySelector('[data-buddy]'), label = el.querySelector('[data-label]');
    var x = -100, y = -100, bx = -100, by = -100, raf;
    function tick() {
      bx += (x + 16 - bx) * 0.16; by += (y + 10 - by) * 0.16;
      el.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      buddy.style.transform = 'translate3d(' + (bx - x) + 'px,' + (by - y) + 'px,0) rotate(' + Math.max(-14, Math.min(14, (x + 16 - bx) * 0.6)) + 'deg)';
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    var egg = '', eggT, idleT, clicks = [];
    function showEgg(txt, ms) {
      egg = txt; clearTimeout(eggT);
      label.textContent = txt; label.style.display = 'block'; label.style.background = '#fdf167';
      if (ms) eggT = setTimeout(function () { egg = ''; label.style.background = '#61caf8'; label.style.display = 'none'; }, ms);
    }
    function armIdle() { clearTimeout(idleT); idleT = setTimeout(function () { showEgg('HELLO? BUELLER?'); idleT = setTimeout(function () { showEgg('BLINK TWICE IF OK'); }, 10000); }, 10000); }
    function move(e) {
      x = e.clientX; y = e.clientY; el.style.opacity = '1';
      if (egg === 'HELLO? BUELLER?' || egg === 'BLINK TWICE IF OK') { egg = ''; label.style.background = '#61caf8'; }
      armIdle();
      if (egg) return;
      var a = actionFor(e.target);
      if (a) { label.textContent = a; label.style.display = 'block'; dot.style.width = '14px'; fill.style.background = '#e8a1b8'; buddy.style.opacity = '0'; buddy.style.scale = '.7'; }
      else { label.style.display = 'none'; dot.style.width = '12px'; fill.style.background = '#61caf8'; buddy.style.opacity = '1'; buddy.style.scale = '1'; }
    }
    function leave() { el.style.opacity = '0'; }
    function down() {
      var now = Date.now(); clicks = clicks.filter(function (t) { return now - t < 1200; }); clicks.push(now);
      if (clicks.length >= 5) { clicks = []; showEgg('OK CALM DOWN', 1600); }
      if (!egg) label.style.background = '#e8a1b8'; buddy.style.scale = '.8';
    }
    function up() { if (!egg) label.style.background = '#61caf8'; buddy.style.scale = '1'; }
    document.addEventListener('pointermove', move, true);
    document.documentElement.addEventListener('pointerleave', leave);
    document.addEventListener('pointerdown', down, true);
    document.addEventListener('pointerup', up, true);
    return function () {
      cancelAnimationFrame(raf); clearTimeout(eggT); clearTimeout(idleT);
      document.removeEventListener('pointermove', move, true);
      document.documentElement.removeEventListener('pointerleave', leave);
      document.removeEventListener('pointerdown', down, true);
      document.removeEventListener('pointerup', up, true);
      el.remove(); delete document.documentElement.dataset.miuxCursor;
    };
  }

  function observeReveals(root) {
    if (reduced() || !('IntersectionObserver' in g)) return function () {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var n = en.target; io.unobserve(n);
        var i = +(n.dataset.reveal || 0);
        n.animate([{ opacity: 0, transform: 'translateY(28px)' }, { opacity: 1, transform: 'none' }], { duration: 640, delay: i * 70, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    (root || document).querySelectorAll('[data-reveal]').forEach(function (n) {
      var r = n.getBoundingClientRect();
      if (r.top > g.innerHeight) io.observe(n);
    });
    return function () { io.disconnect(); };
  }

  function countUp(node, to, ms, pad) {
    if (reduced()) { node.textContent = pad ? String(to).padStart(2, '0') : to; return; }
    var t0 = performance.now();
    (function step(t) {
      var p = Math.min(1, (t - t0) / ms), v = Math.round(to * (1 - Math.pow(1 - p, 3)));
      node.textContent = pad ? String(v).padStart(2, '0') : v;
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  function onVisible(nodes, fn) {
    if (!('IntersectionObserver' in g)) { nodes.forEach(fn); return function () {}; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); fn(e.target); } }); }, { rootMargin: '0px 0px -12% 0px' });
    nodes.forEach(function (n) { io.observe(n); });
    return function () { io.disconnect(); };
  }

  function draw(p, ms, delay) {
    p.setAttribute('pathLength', '1');
    var da = p.getAttribute('stroke-dasharray');
    if (da) return p.animate([{ opacity: 0 }, { opacity: 1 }], { duration: ms, delay: delay, fill: 'backwards' });
    p.style.strokeDasharray = '1';
    return p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: ms, delay: delay, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
  }

  function quarterFrames(root) {
    var hosts = [].slice.call((root || document).querySelectorAll('[data-qhex]'));
    hosts.forEach(function (h) {
      if (h.dataset.built) return; h.dataset.built = '1';
      var r = 300, hh = r * .8913, f = r * .407, k = r * .07, html = '';
      var id = 'qg' + Math.random().toString(36).slice(2, 7);
      [1, .8, .6, .4].forEach(function (s, i) {
        var R = r * s, H = hh * s, F = f * s, K = k * s, dx = R - F, dy = -H, L = Math.hypot(dx, dy);
        var d = 'M0 ' + H + 'L' + (F - K) + ' ' + H + 'Q' + F + ' ' + H + ' ' + (F + dx / L * K) + ' ' + (H + dy / L * K) + 'L' + R + ' 0';
        html += '<path d="' + d + '" fill="none" stroke="url(#' + id + ')" stroke-width="' + (i ? 1 : 1.5) + '" vector-effect="non-scaling-stroke" opacity="' + [.9, .6, .4, .25][i] + '"/>';
      });
      h.innerHTML = '<svg viewBox="0 0 300 268" style="display:block;width:100%;height:auto;overflow:visible"><defs><linearGradient id="' + id + '" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#61caf8"/><stop offset=".53" stop-color="#8b79b4"/><stop offset="1" stop-color="#e8a1b8"/></linearGradient></defs>' + html + '</svg>';
    });
    if (reduced()) return function () {};
    return onVisible(hosts, function (h) { [].slice.call(h.querySelectorAll('path')).forEach(function (p, i) { draw(p, 1200, i * 120); }); });
  }

  function rider(svg, w) {
    var gEl = document.createElementNS(NS, 'g');
    gEl.setAttribute('pointer-events', 'none');
    gEl.innerHTML = '<g data-in><svg width="' + w + '" height="' + (w * 95 / 152) + '" viewBox="0 0 152 95" overflow="visible">' + ((g.MIUX_GEO && g.MIUX_GEO.miniM) || []).map(function (d) { return '<path d="' + d + '" fill="url(#miuxMiniGrad)"/>'; }).join('') + '</svg></g>';
    gEl.style.opacity = '0';
    svg.appendChild(gEl);
    var cur = null, raf;
    function place(x, y, lift) { gEl.setAttribute('transform', 'translate(' + (x - w / 2) + ',' + (y - w * 95 / 152 - lift) + ')'); cur = [x, y, lift]; }
    function along(path, ms, lift, done) {
      var L = path.getTotalLength(), t0 = performance.now(); gEl.style.opacity = '1';
      cancelAnimationFrame(raf);
      (function step(t) { var p = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - p, 3), pt = path.getPointAtLength(L * e); place(pt.x, pt.y, lift); if (p < 1) raf = requestAnimationFrame(step); else if (done) done(); })(t0);
    }
    function hop(x, y, lift) {
      if (!cur) { place(x, y, lift); gEl.style.opacity = '1'; return; }
      var a = cur.slice(), t0 = performance.now(); cancelAnimationFrame(raf);
      (function step(t) { var p = Math.min(1, (t - t0) / 420), e = 1 - Math.pow(1 - p, 3), arc = Math.sin(p * Math.PI) * 26; place(a[0] + (x - a[0]) * e, a[1] + (y - a[1]) * e - arc, a[2] + (lift - a[2]) * e); if (p < 1) raf = requestAnimationFrame(step); })(t0);
    }
    function bob() { var inner = gEl.querySelector('[data-in]'); inner.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-4px)' }, { transform: 'translateY(0)' }], { duration: 2200, iterations: Infinity, easing: 'ease-in-out' }); }
    return { along: along, hop: hop, bob: bob, el: gEl };
  }

  function quarterCharts(root) {
    var Q = g.MIUX_QUARTER; if (!Q) return function () {};
    var hosts = [].slice.call((root || document).querySelectorAll('[data-qchart]'));
    hosts.forEach(function (h) {
      if (h.dataset.built) return; h.dataset.built = '1';
      h.innerHTML = Q[h.dataset.qchart] || '';
      var svg = h.querySelector('svg'), kind = h.dataset.qchart, R = rider(svg, kind === 'arcs' ? 40 : 30);
      h._rider = R;
      if (kind === 'arcs') {
        var bars = [].slice.call(svg.querySelectorAll('[data-k="ab-bar"]'));
        bars.forEach(function (b) {
          b.addEventListener('mouseenter', function () {
            bars.forEach(function (o) { o.style.filter = o === b ? 'brightness(1.5)' : 'saturate(.5) brightness(.7)'; });
            var L = b.getTotalLength(), p = b.getPointAtLength(L); R.hop(p.x, p.y, -39);
          });
          b.addEventListener('mouseleave', function () { bars.forEach(function (o) { o.style.filter = ''; }); });
        });
      } else {
        var dots = [].slice.call(svg.querySelectorAll('[data-k="pl-dot"]'));
        dots.forEach(function (d) {
          d.addEventListener('mouseenter', function () {
            d.setAttribute('fill', d.getAttribute('stroke'));
            var b = d.getBBox(); R.hop(b.x + b.width / 2, b.y, 2);
          });
          d.addEventListener('mouseleave', function () { d.setAttribute('fill', '#08090d'); });
        });
      }
    });
    var go = function (h) {
      var svg = h.querySelector('svg'), R = h._rider; if (!svg) return;
      var sel = function (k) { return [].slice.call(svg.querySelectorAll('[data-k="' + k + '"]')); };
      if (reduced()) {
        var p0 = h.dataset.qchart === 'arcs' ? sel('ab-bar')[0] : sel('pl-line')[0];
        if (p0) { var e = p0.getPointAtLength(p0.getTotalLength()); R.hop(e.x, e.y, h.dataset.qchart === 'arcs' ? -39 : 2); }
        return;
      }
      var fade = function (n, d) { n.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: d, fill: 'backwards' }); };
      if (h.dataset.qchart === 'arcs') {
        sel('ab-track').forEach(function (p, i) { draw(p, 700, i * 60); });
        var bars = sel('ab-bar');
        bars.forEach(function (p, i) { draw(p, 1300, 300 + i * 110); });
        sel('ab-lead').concat(sel('ab-lab')).forEach(function (n, i) { fade(n, 1100 + (i % 6) * 110); });
        setTimeout(function () { R.along(bars[0], 1300, -39, R.bob); }, 300);
      } else {
        sel('pl-frame').concat(sel('pl-ring')).forEach(function (p, i) { draw(p, 900, i * 80); });
        sel('pl-spoke').forEach(function (n, i) { fade(n, 200 + i * 25); });
        var lines = sel('pl-line');
        lines.forEach(function (p, i) { draw(p, 1800, 500 + i * 250); });
        sel('pl-dot').forEach(function (n, i) { fade(n, 600 + (i % 16) * 105 + (i >= 16 ? 250 : 0)); });
        sel('pl-tick').concat(sel('pl-year')).forEach(function (n, i) { fade(n, 300 + i * 40); });
        setTimeout(function () { R.along(lines[0], 1800, 2, R.bob); }, 500);
      }
    };
    return onVisible(hosts, go);
  }

  function roundedHex(R, H, F, rad) {
    var v = [[-R, 0], [-F, -H], [F, -H], [R, 0], [F, H], [-F, H]], d = '';
    for (var i = 0; i < 6; i++) {
      var p = v[(i + 5) % 6], c = v[i], n = v[(i + 1) % 6];
      var ax = p[0] - c[0], ay = p[1] - c[1], al = Math.hypot(ax, ay), bx = n[0] - c[0], by = n[1] - c[1], bl = Math.hypot(bx, by);
      var p1 = [c[0] + ax / al * rad, c[1] + ay / al * rad], p2 = [c[0] + bx / bl * rad, c[1] + by / bl * rad];
      d += (i ? 'L' : 'M') + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + 'Q' + c[0] + ' ' + c[1] + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
    }
    return d + 'Z';
  }

  // Concentric rounded hex rings flowing outward from an anchor, fading with distance.
  function ringField(host, anchor, o) {
    o = o || {}; var fr, stopped = false;
    var N = o.N || 16, G = o.G || 1.17, alpha = o.alpha == null ? .7 : o.alpha, period = o.period || 5200, frac = o.frac || .62;
    function build() {
      if (stopped || !host || !anchor) return;
      var hr = host.getBoundingClientRect(), ar = anchor.getBoundingClientRect();
      if (ar.width < 60) { fr = requestAnimationFrame(build); return; }
      var cx = ar.left - hr.left + ar.width / 2, cy = ar.top - hr.top + ar.height / 2, base = ar.width / 1049 * frac;
      var hex = roundedHex(524.5, 467.5, 213.5, 64), id = 'rf' + Math.random().toString(36).slice(2, 7), rings = '';
      for (var i = 0; i < N; i++) rings += '<path d="' + hex + '" fill="none" stroke="url(#' + id + ')" stroke-width="1.2" vector-effect="non-scaling-stroke"/>';
      host.innerHTML = '<svg width="100%" height="100%" style="position:absolute;inset:0;overflow:visible"><defs><linearGradient id="' + id + '" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#61caf8"/><stop offset=".53" stop-color="#8b79b4"/><stop offset="1" stop-color="#e8a1b8"/></linearGradient></defs><g transform="translate(' + cx + ' ' + cy + ')">' + rings + '</g></svg>';
      var paths = [].slice.call(host.querySelectorAll('path')), red = reduced(), t0 = performance.now(), intro = o.skip ? 0 : (o.introMs || 1600);
      function frame(t) {
        var phase = red ? 0 : ((t - t0) / period) % 1, grow = intro ? Math.min(1, (t - t0) / intro) : 1;
        paths.forEach(function (p, i) {
          var k = i + phase, s = base * Math.pow(G, k + 1.5);
          var fade = Math.pow(Math.max(0, 1 - k / N), 1.8) * Math.min(1, k * 1.4), vis = Math.max(0, Math.min(1, grow * N * 1.2 - i));
          p.setAttribute('transform', 'rotate(' + (k * 1.6).toFixed(2) + ') scale(' + s.toFixed(4) + ')');
          p.setAttribute('opacity', (fade * alpha * vis).toFixed(3));
        });
        if (!red && !stopped) fr = requestAnimationFrame(frame);
      }
      fr = requestAnimationFrame(frame);
    }
    build();
    return function () { stopped = true; cancelAnimationFrame(fr); };
  }

  // Mech badge: assembles on scroll, ratchets its rings, spins props, runs lights, tilts in 3D with the pointer.
  function mech(host, o) {
    o = o || {};
    var M = g.MIUX_MECH; if (!M || !host || host.dataset.built) return function () {};
    host.dataset.built = '1';
    var D = M.d, G = M.g, C = 'transform-box:view-box;transform-origin:1046.5px 1046px', W = '#f5f2ed', CS = [W, W, W];
    var P = function (i, fill, extra) { return '<path d="' + D[i] + '" fill="' + fill + '"' + (extra || '') + '/>'; };
    var grp = function (name, idx, fill, op, style) { return '<g data-m="' + name + '" opacity="' + op + '" style="' + C + ';' + (style || '') + '">' + [].concat.apply([], idx).map(function (i) { return P(i, fill); }).join('') + '</g>'; };
    var layer = function (name, inner) { return '<g data-px="' + name + '">' + inner + '</g>'; };
    var SV = '<svg viewBox="0 0 2093 2093" style="position:absolute;inset:0;display:block;width:100%;height:100%;overflow:visible">';
    var Ls = [
      ['shell', -20, '<g data-m="frame" style="' + C + '"><path d="' + D[0] + '" fill="none" stroke="#f5f2ed" stroke-width="2" vector-effect="non-scaling-stroke"/></g>' + grp('gear', G.gear, W, 1)],
      ['rings', -10, grp('ringA', G.ringA, W, 1) + grp('ringB', G.ringB, W, 1)],
      ['chassis', 16, G.bars.map(function (p, i) { return grp('bar' + i, [p], W, 1); }).join('') + G.brackets.map(function (p, i) { return grp('br' + i, [p], W, 1); }).join('') + grp('conn', G.conn, W, 1) + grp('codes', G.codes, W, 1)],
      ['lights', 28, G.tris.map(function (p, i) { return grp('tri', [p], CS[i % 3], 1); }).join('') +
        '<g data-m="chain">' + G.chain.map(function (i, k) { return P(i, W, ' data-c="' + k + '"'); }).join('') + '</g>' +
        '<g data-m="lines">' + G.lines.map(function (i, k) { return P(i, CS[k], ' data-l="' + k + '"'); }).join('') + '</g>' +
        grp('hubs', G.hubs, W, 1) + grp('det', G.det, W, 1) + G.screws.map(function (p) { return grp('screw', [p], W, 1); }).join('') +
        G.props.map(function (p) { return '<g data-m="prop" style="transform-box:fill-box;transform-origin:center">' + p.map(function (i) { return P(i, W); }).join('') + '</g>'; }).join('')],
      ['core', 48, '<g data-m="core" style="' + C + '">' + G.coreF.map(function (i) { return P(i, W); }).join('') + G.coreI.map(function (i) { return P(i, W); }).join('') + G.core2.map(function (i) { return P(i, W); }).join('') + '</g>']
    ];
    if (o.stack) host.innerHTML = Ls.map(function (l, i) { return '<div data-layer="' + l[0] + '" style="position:absolute;inset:0;transform-style:preserve-3d;transition:transform 900ms cubic-bezier(.16,1,.3,1),filter 900ms ease">' + SV + l[2] + '</svg></div>'; }).join('');
    else host.innerHTML = SV + Ls.map(function (l) { return '<g data-px="' + l[0] + '">' + l[2] + '</g>'; }).join('') + '</svg>';
    var q = function (s) { return [].slice.call(host.querySelectorAll(s)); }, one = function (s) { return host.querySelector(s); };
    var anims = [], timers = [], red = reduced();
    var A = function (el, k, o) { if (el) anims.push(el.animate(k, o)); };
    var later = function (fn, ms) { timers.push(setTimeout(fn, ms)); };
    var centers = { bar0: [0, 1], bar1: [0, -1], bar2: [1, .4], bar3: [-1, .4], br0: [1, 1], br1: [1, -1], br2: [-1, -1], br3: [-1, 1] };

    function intro() {
      var E = 'cubic-bezier(.16,1,.3,1)', B = 'cubic-bezier(.34,1.56,.64,1)';
      A(one('[data-m="frame"]'), [{ opacity: 0, transform: 'scale(1.25)' }, { opacity: 1, transform: 'none' }], { duration: 1200, easing: E, fill: 'backwards' });
      A(one('[data-m="gear"]'), [{ opacity: 0, transform: 'rotate(-180deg) scale(.7)' }, { opacity: 1, transform: 'none' }], { duration: 1500, delay: 100, easing: E, fill: 'backwards' });
      A(one('[data-m="ringB"]'), [{ opacity: 0, transform: 'rotate(120deg) scale(.8)' }, { opacity: 1, transform: 'none' }], { duration: 1300, delay: 250, easing: E, fill: 'backwards' });
      A(one('[data-m="ringA"]'), [{ opacity: 0, transform: 'scale(.85)' }, { opacity: 1, transform: 'none' }], { duration: 1100, delay: 200, easing: E, fill: 'backwards' });
      Object.keys(centers).forEach(function (k, i) { var v = centers[k]; A(one('[data-m="' + k + '"]'), [{ opacity: 0, transform: 'translate(' + v[0] * 260 + 'px,' + v[1] * 260 + 'px)' }, { opacity: 1, transform: 'none' }], { duration: 900, delay: 500 + i * 70, easing: B, fill: 'backwards' }); });
      A(one('[data-m="core"]'), [{ opacity: 0, transform: 'scale(0) rotate(-60deg)' }, { opacity: 1, transform: 'scale(1.08) rotate(4deg)', offset: .7 }, { opacity: 1, transform: 'none' }], { duration: 1000, delay: 1000, easing: 'ease-out', fill: 'backwards' });
      q('[data-m="conn"],[data-m="codes"],[data-m="hubs"],[data-m="det"],[data-m="prop"]').forEach(function (n, i) { A(n, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 1300 + i * 60, fill: 'backwards' }); });
      q('[data-m="tri"],[data-m="screw"]').forEach(function (n, i) { A(n, [{ opacity: 0 }, { opacity: 1, offset: .3 }, { opacity: .2, offset: .5 }, { opacity: 1 }], { duration: 500, delay: 1500 + i * 70, fill: 'backwards' }); });
      q('[data-c]').forEach(function (n, i) { A(n, [{ opacity: 0 }, { opacity: 1 }], { duration: 200, delay: 1500 + i * 14, fill: 'backwards' }); });
      q('[data-l]').forEach(function (n, i) { A(n, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 1700 + i * 120, fill: 'backwards' }); });
      later(idle, 2300);
    }
    var ratchetN = 0;
    function ratchet() {
      ratchetN++;
      var dir = ratchetN % 2 ? 1 : -1;
      A(one('[data-m="gear"]'), [{ transform: 'rotate(0deg)' }, { transform: 'rotate(' + 180 * dir + 'deg)' }], { duration: 1400, easing: 'cubic-bezier(.7,0,.2,1.08)', composite: 'add' });
      A(one('[data-m="ringB"]'), [{ transform: 'rotate(0deg)' }, { transform: 'rotate(' + -180 * dir + 'deg)' }], { duration: 1500, delay: 220, easing: 'cubic-bezier(.7,0,.2,1.08)', composite: 'add' });
      A(one('[data-m="core"]'), [{ transform: 'scale(1)' }, { transform: 'scale(.97)', offset: .2 }, { transform: 'scale(1.03)', offset: .6 }, { transform: 'scale(1)' }], { duration: 900, delay: 1300, easing: 'ease-out', composite: 'add' });
      q('[data-m^="br"]').forEach(function (n, i) { var v = centers[n.dataset.m]; A(n, [{ transform: 'translate(0,0)' }, { transform: 'translate(' + v[0] * 18 + 'px,' + v[1] * 18 + 'px)', offset: .35 }, { transform: 'translate(0,0)' }], { duration: 700, delay: 1200 + i * 40, easing: 'ease-in-out', composite: 'add' }); });
      later(ratchet, 5600);
    }
    function idle() {
      q('[data-m="prop"]').forEach(function (n, i) { A(n, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(' + (i % 2 ? -360 : 360) + 'deg)' }], { duration: 2200 + i * 500, iterations: Infinity }); });
      q('[data-c]').forEach(function (n, i) { A(n, [{ opacity: 1 }, { opacity: .15 }, { opacity: 1 }], { duration: 1600, delay: i * 32, iterations: Infinity, easing: 'ease-in-out' }); });
      q('[data-l]').forEach(function (n, i) { A(n, [{ opacity: 1 }, { opacity: .25 }, { opacity: 1 }], { duration: 1800, delay: i * 300, iterations: Infinity, easing: 'ease-in-out' }); });
      q('[data-m="tri"]').forEach(function (n, i) { A(n, [{ opacity: 1 }, { opacity: .45 }, { opacity: 1 }], { duration: 2600, delay: i * 430, iterations: Infinity, easing: 'ease-in-out' }); });
      q('[data-m="screw"]').forEach(function (n, i) { A(n, [{ opacity: 1 }, { opacity: .1, offset: .08 }, { opacity: 1, offset: .16 }, { opacity: 1 }], { duration: 3400, delay: i * 560, iterations: Infinity }); });
      A(one('[data-m="codes"]'), [{ opacity: 1 }, { opacity: .35, offset: .05 }, { opacity: 1, offset: .1 }, { opacity: 1 }], { duration: 4200, iterations: Infinity });
      later(ratchet, 900);
    }

    var section = host.closest('section') || host.parentElement, raf, nx = 0, ny = 0, iso = false, locked = false;
    var px = {}, lay = {};
    Ls.forEach(function (l) { px[l[0]] = one('[data-px="' + l[0] + '"]'); lay[l[0]] = one('[data-layer="' + l[0] + '"]'); });
    function tilt() {
      raf = null;
      if (o.stack) {
        var gap = host.offsetWidth * .085;
        host.style.transform = iso
          ? 'rotateX(' + (56 - ny * 10).toFixed(2) + 'deg) rotateZ(' + (-45 + nx * 14).toFixed(2) + 'deg) scale(.82)'
          : 'rotateX(' + (-ny * 10).toFixed(2) + 'deg) rotateY(' + (nx * 14).toFixed(2) + 'deg)';
        Ls.forEach(function (l, i) { var n = lay[l[0]]; n.style.transform = 'translateZ(' + (iso ? (i - 2) * gap : i * 3) + 'px)'; n.style.filter = iso ? 'drop-shadow(0 0 ' + (6 + i * 4) + 'px rgba(97,202,248,' + (.08 + i * .05) + '))' : 'none'; });
      } else {
        host.style.transform = 'perspective(1400px) rotateX(' + (-ny * 12).toFixed(2) + 'deg) rotateY(' + (nx * 16).toFixed(2) + 'deg)';
        Ls.forEach(function (l) { px[l[0]].setAttribute('transform', 'translate(' + nx * l[1] + ' ' + ny * l[1] + ')'); });
      }
    }
    function setIso(v) { if (v === iso) return; iso = v; if (o.onMode) o.onMode(iso); if (!raf) raf = requestAnimationFrame(tilt); }
    function move(e) {
      var r = host.getBoundingClientRect(), dx = e.clientX - r.left - r.width / 2, dy = e.clientY - r.top - r.height / 2;
      nx = Math.max(-1, Math.min(1, dx / r.width)); ny = Math.max(-1, Math.min(1, dy / r.height));
      if (o.stack && !locked) setIso(Math.hypot(dx, dy) < Math.max(r.width, r.height) * .46);
      if (!raf) raf = requestAnimationFrame(tilt);
    }
    function leave() { nx = 0; ny = 0; if (o.stack && !locked) setIso(false); if (!raf) raf = requestAnimationFrame(tilt); }
    host.style.transformStyle = 'preserve-3d';
    host.style.transition = 'transform ' + (o.stack ? 900 : 500) + 'ms cubic-bezier(.16,1,.3,1)';
    if (!red && fine()) { section.addEventListener('pointermove', move); section.addEventListener('pointerleave', leave); }
    tilt();
    var stopVis = red ? function () {} : (o.now ? (intro(), function () {}) : onVisible([host], intro));
    var stop = function () { stopVis(); anims.forEach(function (a) { a.cancel(); }); timers.forEach(clearTimeout); cancelAnimationFrame(raf); section.removeEventListener('pointermove', move); section.removeEventListener('pointerleave', leave); };
    stop.lock = function (v) { locked = v; setIso(v); };
    return stop;
  }

  g.MIUXFX = { mech: mech, roundedHex: roundedHex, ringField: ringField, injectDefs: injectDefs, miniM: miniM, mountCursor: mountCursor, observeReveals: observeReveals, countUp: countUp, reduced: reduced, fine: fine, quarterFrames: quarterFrames, quarterCharts: quarterCharts };
})(window);
