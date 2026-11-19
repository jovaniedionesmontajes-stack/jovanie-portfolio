(function () {
  'use strict';
  var EMAIL = 'jovaniedionesmontajes@gmail.com';
  var doc = document, root = doc.documentElement;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* === CHAT LINKS: fill these in and the buttons appear automatically ===
     messenger: Facebook username (opens m.me/username) | whatsapp / viber: number with country code, no + or spaces
     phone: number with country code; shows a Call / text button */
  var CHAT = { messenger: '', whatsapp: '', viber: '', phone: '639911285139' };
  var chatHTML = '';
  if (CHAT.messenger) chatHTML += '<a class="button small chat-btn" href="https://m.me/' + CHAT.messenger + '" target="_blank" rel="noopener noreferrer">Chat on Messenger</a>';
  if (CHAT.viber) chatHTML += '<a class="button small chat-btn" href="viber://chat?number=%2B' + CHAT.viber + '">Chat on Viber</a>';
  if (CHAT.whatsapp) chatHTML += '<a class="button small chat-btn" href="https://wa.me/' + CHAT.whatsapp + '?text=Hi%20Jovanie%2C%20I%20need%20a%20website." target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>';
  if (CHAT.phone) chatHTML += '<a class="button small chat-btn" href="tel:+' + CHAT.phone + '">Call / text 0' + CHAT.phone.slice(2, 5) + ' ' + CHAT.phone.slice(5, 8) + ' ' + CHAT.phone.slice(8) + '</a>';
  if (chatHTML) {
    $$('[data-chat]').forEach(function (el) { el.innerHTML = chatHTML; el.hidden = false; });
    var fc0 = $('#float-cta');
    if (fc0 && CHAT.messenger) { fc0.textContent = 'Chat with me'; fc0.href = 'https://m.me/' + CHAT.messenger; fc0.target = '_blank'; fc0.rel = 'noopener noreferrer'; }
  }

  /* Theme toggle (preference saved in localStorage) */
  var tt = $('#theme-toggle');
  function paintTheme() {
    var dark = root.dataset.theme === 'dark';
    if (tt) { tt.setAttribute('aria-pressed', String(dark)); tt.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme'); }
    var m = $('meta[name=theme-color]'); if (m) m.content = dark ? '#0f1a15' : '#f6f1e7';
  }
  paintTheme();
  if (tt) tt.addEventListener('click', function () {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
    paintTheme();
  });

  /* Mobile menu */
  var toggle = $('.menu-toggle'), nav = $('#nav');
  function setMenu(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); toggle.focus(); } });
  }

  /* Nav highlight, reveals, counters */
  var links = {};
  if (nav) $$('a[href^="#"]', nav).forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  function stagger(el) { var sibs = el.parentElement ? $$('.reveal', el.parentElement) : []; el.style.setProperty('--rd', Math.min(sibs.indexOf(el), 5) * 80 + 'ms'); }
  function count(el) {
    var end = parseInt(el.dataset.count, 10); if (isNaN(end)) return;
    if (reduce) { el.textContent = end; return; }
    var t0 = null;
    (function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 1100, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); })(performance.now());
  }
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) Object.keys(links).forEach(function (k) { links[k].classList.toggle('active', k === en.target.id); }); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['home', 'services', 'work', 'process', 'about'].forEach(function (id) { var s = doc.getElementById(id); if (s) spy.observe(s); });
    var rv = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); rv.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(function (el) { stagger(el); rv.observe(el); });
    var cv = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { count(en.target); cv.unobserve(en.target); } });
    }, { threshold: .6 });
    $$('[data-count]').forEach(function (el) { cv.observe(el); });
    var fc = $('#float-cta'), contact = $('#contact');
    if (fc && contact) new IntersectionObserver(function (e) { fc.classList.toggle('hide', e[0].isIntersecting); }, { threshold: .15 }).observe(contact);
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* Scroll progress, timeline progress, back-to-top (one rAF-throttled listener) */
  var bar = $('#progress'), steps = $('#steps'), top = $('#to-top'), ticking = false;
  function onScroll() {
    ticking = false;
    var h = root.scrollHeight - window.innerHeight, y = window.scrollY;
    if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    if (top) top.hidden = y < 700;
    if (steps) { var r = steps.getBoundingClientRect(), p = (window.innerHeight * .6 - r.top) / r.height; steps.style.setProperty('--prog', Math.max(0, Math.min(1, p))); }
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  if (top) top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* Desktop-only: card tilt + mouse-following orb */
  if (canHover && !reduce) {
    $$('.tilt').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty('--ry', ((e.clientX - r.left) / r.width - .5) * 8 + 'deg');
        c.style.setProperty('--rx', (.5 - (e.clientY - r.top) / r.height) * 8 + 'deg');
      });
      c.addEventListener('pointerleave', function () { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
    });
    var orb = $('.o1');
    if (orb) window.addEventListener('pointermove', function (e) {
      orb.style.translate = ((e.clientX / window.innerWidth - .5) * -60) + 'px ' + ((e.clientY / window.innerHeight - .5) * -60) + 'px';
    }, { passive: true });
  }

  /* Project filter */
  var fbtns = $$('.filters button');
  fbtns.forEach(function (b) {
    b.addEventListener('click', function () {
      fbtns.forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', String(on)); });
      $$('[data-cat]').forEach(function (p) { p.hidden = b.dataset.filter !== 'all' && p.dataset.cat !== b.dataset.filter; });
    });
  });

  /* Screenshot gallery + lightbox */
  var shotImg = $('#shot-img'), shotCap = $('#shot-cap'), main = $('#shot-open');
  var tabs = $$('.shot-tabs button'), idx = 0;
  function showShot(i) {
    if (!tabs.length || !shotImg) return;
    idx = (i + tabs.length) % tabs.length;
    var t = tabs[idx];
    tabs.forEach(function (x) { x.classList.toggle('on', x === t); });
    shotImg.src = t.dataset.src; shotImg.width = t.dataset.w; shotImg.height = t.dataset.h; shotImg.alt = t.dataset.alt;
    if (shotCap) shotCap.textContent = t.dataset.cap;
    if (main) { main.classList.remove('swap'); void main.offsetWidth; main.classList.add('swap'); }
  }
  tabs.forEach(function (t, i) { t.addEventListener('click', function () { showShot(i); }); });

  var lb = $('#lightbox'), lbImg = $('#lb-img'), lbCap = $('#lb-cap'), lastFocus = null;
  function paintLb() { var t = tabs[idx]; lbImg.src = t.dataset.src; lbImg.alt = t.dataset.alt; lbCap.textContent = t.dataset.cap + ' (' + (idx + 1) + ' of ' + tabs.length + ')'; }
  if (lb && lbImg && main && tabs.length && typeof lb.showModal === 'function') {
    main.addEventListener('click', function () { lastFocus = main; paintLb(); lb.showModal(); $('#lb-close').focus(); });
    $('#lb-close').addEventListener('click', function () { lb.close(); });
    $('#lb-prev').addEventListener('click', function () { showShot(idx - 1); paintLb(); });
    $('#lb-next').addEventListener('click', function () { showShot(idx + 1); paintLb(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { showShot(idx - 1); paintLb(); }
      if (e.key === 'ArrowRight') { showShot(idx + 1); paintLb(); }
    });
    lb.addEventListener('close', function () { if (lastFocus) lastFocus.focus(); }); /* Escape is handled natively by <dialog> */
  } else if (main) { main.style.cursor = 'default'; main.disabled = true; }

  /* Copy email */
  var copyBtn = $('#copy-email'), status = $('#copy-status'), stT;
  function say(msg) { if (!status) return; status.textContent = msg; clearTimeout(stT); stT = setTimeout(function () { status.textContent = ''; }, 3500); }
  if (copyBtn) copyBtn.addEventListener('click', function () {
    function fallback() {
      var t = doc.createElement('textarea'); t.value = EMAIL; t.style.cssText = 'position:fixed;opacity:0'; doc.body.appendChild(t); t.select();
      try { doc.execCommand('copy'); say('Email copied ✓'); } catch (e) { say('Press and hold the email to copy it.'); }
      doc.body.removeChild(t);
    }
    var old = copyBtn.textContent;
    function ok() { say('Email copied ✓'); copyBtn.textContent = 'Copied ✓'; setTimeout(function () { copyBtn.textContent = old; }, 2000); }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(EMAIL).then(ok, fallback); else fallback();
  });

  /* Service cards pre-select the project type */
  var typeSel = $('#f-type');
  $$('[data-pick]').forEach(function (a) { a.addEventListener('click', function () { if (typeSel) typeSel.value = a.dataset.pick; refresh(); }); });

  /* Contact form: validation, then opens email app (no backend) */
  var form = $('#contact-form'), gm = $('#gmail-fallback');
  function field(id) { return $('#' + id); }
  function compose() {
    var g = function (id) { var f = field(id); return f ? f.value.trim() : ''; };
    var body = 'Hi Jovanie,\n\nI need help with: ' + g('f-type') + '.\n\n' + g('f-msg') + '\n\nName: ' + g('f-name') + (g('f-biz') ? '\nBusiness: ' + g('f-biz') : '') + '\nReply to: ' + g('f-email');
    return { subject: 'Project inquiry: ' + g('f-type'), body: body };
  }
  function refresh() { if (!form || !gm) return; var m = compose(); gm.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + EMAIL + '&su=' + encodeURIComponent(m.subject) + '&body=' + encodeURIComponent(m.body); }
  function check(id, errId, test, msg) {
    var f = field(id), e = field(errId); if (!f || !e) return true;
    var bad = !test(f.value.trim());
    f.setAttribute('aria-invalid', String(bad)); e.textContent = bad ? msg : '';
    return !bad;
  }
  function validate() {
    var a = check('f-name', 'e-name', function (v) { return v.length > 1; }, 'Please enter your name.');
    var b = check('f-email', 'e-email', function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }, 'Please enter a valid email address.');
    var c = check('f-msg', 'e-msg', function (v) { return v.length >= 10; }, 'Please describe your project in at least a few words.');
    if (!a) field('f-name').focus(); else if (!b) field('f-email').focus(); else if (!c) field('f-msg').focus();
    return a && b && c;
  }
  if (form) {
    form.addEventListener('input', function (e) { refresh(); if (e.target.getAttribute && e.target.getAttribute('aria-invalid') === 'true') validate(); });
    refresh();
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;
      var btn = $('#send-btn'), m = compose(), label = btn.innerHTML;
      btn.disabled = true; btn.textContent = 'Opening your email app…';
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(m.subject) + '&body=' + encodeURIComponent(m.body);
      setTimeout(function () { btn.disabled = false; btn.innerHTML = label; }, 2500);
    });
  }

  /* Seamless marquees: clone each group once, hide the copy from screen readers */
  $$('.marquee').forEach(function (m) { var g = $('.group', m); if (!g) return; var cl = g.cloneNode(true); cl.setAttribute('aria-hidden', 'true'); m.appendChild(cl); });

  /* Particle network background (skipped for reduced motion; pauses when tab hidden) */
  var net = $('#net');
  if (net && net.getContext && !reduce) {
    var cx = net.getContext('2d'), W = 0, H = 0, pts = [], mouse = { x: -999, y: -999 }, raf = 0, dpr = Math.min(window.devicePixelRatio || 1, 1.5), tmr;
    function size() {
      W = window.innerWidth; H = window.innerHeight; net.width = W * dpr; net.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.min(70, Math.round(W * H / 24000)); pts = [];
      for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 });
    }
    function frame() {
      var dark = root.dataset.theme === 'dark', col = dark ? '143,209,174' : '28,70,54', L = 130;
      cx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i]; p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
        cx.fillStyle = 'rgba(' + col + ',.55)'; cx.beginPath(); cx.arc(p.x, p.y, 1.6, 0, 6.283); cx.fill();
        for (var k = i + 1; k < pts.length; k++) {
          var q = pts[k], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
          if (d < L * L) { cx.strokeStyle = 'rgba(' + col + ',' + (.22 * (1 - Math.sqrt(d) / L)) + ')'; cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(q.x, q.y); cx.stroke(); }
        }
        var mx = p.x - mouse.x, my = p.y - mouse.y, md = mx * mx + my * my;
        if (md < 160 * 160) { cx.strokeStyle = 'rgba(240,163,27,' + (.5 * (1 - Math.sqrt(md) / 160)) + ')'; cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(mouse.x, mouse.y); cx.stroke(); }
      }
      raf = requestAnimationFrame(frame);
    }
    function start() { if (!raf) raf = requestAnimationFrame(frame); }
    function stop() { cancelAnimationFrame(raf); raf = 0; }
    size(); start();
    window.addEventListener('resize', function () { clearTimeout(tmr); tmr = setTimeout(size, 200); });
    window.addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    doc.addEventListener('visibilitychange', function () { if (doc.hidden) stop(); else start(); });
  }

  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
