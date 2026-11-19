(function () {
  var EMAIL = 'jovaniedionesmontajes@gmail.com';

  /* === CHAT LINKS: fill these in and the buttons appear automatically ===
     messenger: your Facebook username, e.g. 'jovanie.montajes'  (opens m.me/username)
     whatsapp:  number with country code, no + or spaces, e.g. '639171234567'
     viber:     number with country code, no + or spaces, e.g. '639171234567'
     phone:     number with country code; shows a Call / text button (works on any phone) */
  var CHAT = { messenger: '', whatsapp: '', viber: '', phone: '639911285139' };

  var chatHTML = '';
  if (CHAT.messenger) chatHTML += '<a class="button small chat-btn" href="https://m.me/' + CHAT.messenger + '" target="_blank" rel="noopener noreferrer">Chat on Messenger</a>';
  if (CHAT.viber) chatHTML += '<a class="button small chat-btn" href="viber://chat?number=%2B' + CHAT.viber + '">Chat on Viber</a>';
  if (CHAT.whatsapp) chatHTML += '<a class="button small chat-btn" href="https://wa.me/' + CHAT.whatsapp + '?text=Hi%20Jovanie%2C%20I%20need%20a%20website." target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>';
  if (CHAT.phone) chatHTML += '<a class="button small chat-btn phone-btn" href="tel:+' + CHAT.phone + '">Call / text 0' + CHAT.phone.slice(2, 5) + ' ' + CHAT.phone.slice(5, 8) + ' ' + CHAT.phone.slice(8) + '</a>';
  if (chatHTML) {
    document.querySelectorAll('[data-chat]').forEach(function (el) { el.innerHTML = chatHTML; el.hidden = false; });
    var fcta = document.getElementById('float-cta');
    if (fcta && CHAT.messenger) { fcta.textContent = 'Chat with me'; fcta.href = 'https://m.me/' + CHAT.messenger; fcta.target = '_blank'; fcta.rel = 'noopener noreferrer'; fcta.dataset.chat = '1'; }
  }

  /* Mobile menu */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* Active nav link on scroll */
  var links = {};
  nav.querySelectorAll('a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].classList.toggle('active', k === en.target.id && k !== 'contact'); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).concat(['home']).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });

    /* Gentle reveal */
    var rv = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); rv.unobserve(en.target); } });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.card, .steps li, .project, .about-grid, .faq-list, .contact-panel').forEach(function (el) {
      el.classList.add('reveal'); rv.observe(el);
    });

    /* Hide floating button while contact section is visible */
    var fc = document.getElementById('float-cta');
    var contact = document.getElementById('contact');
    if (fc && contact) {
      new IntersectionObserver(function (e) { fc.classList.toggle('hide', e[0].isIntersecting); }, { threshold: 0.15 }).observe(contact);
    }
  }

  /* Copy email */
  var copyBtn = document.getElementById('copy-email');
  var status = document.getElementById('copy-status');
  function say(msg) { status.textContent = msg; setTimeout(function () { status.textContent = ''; }, 3500); }
  copyBtn.addEventListener('click', function () {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(EMAIL).then(function () { say('Email copied ✓'); }, fallback);
    } else { fallback(); }
    function fallback() {
      var t = document.createElement('textarea');
      t.value = EMAIL; t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); say('Email copied ✓'); } catch (e) { say('Press and hold the email to copy it.'); }
      document.body.removeChild(t);
    }
  });

  /* Contact form: 2 taps -> opens email app (no backend needed) */
  var form = document.getElementById('contact-form');
  var gm = document.getElementById('gmail-fallback');
  function compose() {
    var type = form.querySelector('input[name=type]:checked').value;
    var extra = form.message.value.trim();
    var who = document.getElementById('f-name').value.trim();
    var subject = 'Project inquiry: ' + type;
    var body = 'Hi Jovanie,\n\nI need help with: ' + type + '.\n' + (extra ? '\n' + extra + '\n' : '') + '\nPlease reply to this email. Thank you!\n\nMy name: ' + who;
    return { subject: subject, body: body };
  }
  function refresh() {
    var m = compose();
    gm.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + EMAIL + '&su=' + encodeURIComponent(m.subject) + '&body=' + encodeURIComponent(m.body);
  }
  form.addEventListener('input', refresh); refresh();
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var m = compose();
    window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(m.subject) + '&body=' + encodeURIComponent(m.body);
  });


  /* EOD screenshot gallery */
  var shotImg = document.getElementById('shot-img');
  var shotCap = document.getElementById('shot-cap');
  var tabs = document.querySelectorAll('.shot-tabs button');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.remove('on'); });
      t.classList.add('on');
      shotImg.src = t.dataset.src; shotImg.width = t.dataset.w; shotImg.height = t.dataset.h; shotImg.alt = t.dataset.alt;
      shotCap.textContent = t.dataset.cap;
    });
  });
  var lb = document.getElementById('lightbox');
  if (lb && lb.showModal) {
    document.getElementById('shot-open').addEventListener('click', function () {
      var li = document.getElementById('lb-img'); li.src = shotImg.src; li.alt = shotImg.alt; lb.showModal();
    });
    document.getElementById('lb-close').addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  } else {
    document.getElementById('shot-open').style.cursor = 'default';
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
