/* PrimeTurf mobile nav — mirrors index.html's @media(max-width:900px) behaviour:
   hides the desktop nav behind a hamburger and opens a right-hand drawer.

   The header is React-rendered, so nothing is injected into it — the button,
   overlay and drawer live in <body> and survive re-renders. A MutationObserver
   re-applies the nav-hiding whenever the header repaints. Styles are inline so
   they win against the design's own inline styles. */
(function () {
  var BP = 1240;
  var F = '#0B3D2E', W = '#FFFFFF', AuD = '#8A6B20', Bd = 'rgba(11,61,46,0.10)';
  var ov, drawer, open = false, built = false, wired = false;

  function ham() { var h = header(); return h ? h.querySelector('#pt-ham') : null; }

  // The DC compiler will not render an injected div here and body-level
  // role=button nodes get stripped, so the trigger is an anchor appended into
  // the header row and restored whenever React repaints it.
  function ensureHam() {
    var h = header();
    if (!h) return null;
    var row = h.firstElementChild || h;
    var b = h.querySelector('#pt-ham');
    if (b) return b;
    b = document.createElement('a');
    b.id = 'pt-ham';
    b.href = '#menu';
    b.setAttribute('aria-label', 'Open menu');
    b.style.cssText = 'display:none;flex-direction:column;gap:5px;width:40px;height:40px;align-items:center;justify-content:center;cursor:pointer;margin-left:auto;flex-shrink:0;text-decoration:none';
    for (var i = 0; i < 3; i++) {
      var sp = document.createElement('span');
      sp.style.cssText = 'display:block;width:22px;height:1.5px;background:' + F + ';border-radius:2px';
      b.appendChild(sp);
    }
    row.appendChild(b);
    return b;
  }

  function header() { return document.querySelector('header'); }
  function headerNav() { var h = header(); return h ? h.querySelector('nav') : null; }

  function shut() {
    open = false;
    if (!drawer) return;
    drawer.style.transform = 'translateX(100%)';
    ov.style.display = 'none';
    var b = ham();
    if (b) b.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openNav() {
    fill();
    open = true;
    drawer.style.transform = 'translateX(0)';
    ov.style.display = 'block';
    var b = ham();
    if (b) b.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function fill() {
    var nav = headerNav();
    if (!nav || !drawer) return;
    var links = [].slice.call(nav.querySelectorAll('a'));
    if (!links.length) return;
    [].slice.call(drawer.querySelectorAll('[data-pt-link]')).forEach(function (n) { n.remove(); });
    links.forEach(function (a) {
      var c = document.createElement('a');
      c.setAttribute('data-pt-link', '1');
      c.href = a.getAttribute('href') || '#';
      if (a.getAttribute('target')) c.target = a.getAttribute('target');
      c.textContent = (a.textContent || '').trim();
      var isCta = /get a quote/i.test(c.textContent);
      c.style.cssText = isCta
        ? 'background:' + F + ';color:' + W + ';text-align:center;padding:15px;margin-top:16px;border-radius:1px;font-size:11px;font-weight:700;letter-spacing:.17em;text-transform:uppercase;text-decoration:none;display:block'
        : 'font-size:13px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:' + F + ';padding:15px 0;border-bottom:1px solid ' + Bd + ';display:block;text-decoration:none';
      if (!isCta) {
        c.addEventListener('mouseenter', function () { c.style.color = AuD; });
        c.addEventListener('mouseleave', function () { c.style.color = F; });
      }
      c.addEventListener('click', shut);
      drawer.appendChild(c);
    });
    var tel = document.createElement('a');
    tel.setAttribute('data-pt-link', '1');
    tel.href = 'tel:+27768048868';
    tel.textContent = '076 804 8868';
    tel.style.cssText = 'margin-top:22px;font-size:14px;font-weight:600;color:' + AuD + ';text-decoration:none';
    drawer.appendChild(tel);
  }

  function build() {
    if (built) return;
    built = true;

    ov = document.createElement('div');
    ov.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.40);z-index:998';
    document.body.appendChild(ov);

    drawer = document.createElement('nav');
    drawer.setAttribute('aria-label', 'Mobile navigation');
    drawer.style.cssText = 'position:fixed;top:0;right:0;bottom:0;width:min(300px,88vw);background:' + W + ';z-index:999;box-shadow:-8px 0 40px rgba(0,0,0,0.13);display:flex;flex-direction:column;padding:72px 28px 28px;transition:transform .32s cubic-bezier(0.25,0.1,0.25,1);overflow-y:auto;transform:translateX(100%)';
    var close = document.createElement('button');
    close.setAttribute('aria-label', 'Close menu');
    close.textContent = '\u00d7';
    close.style.cssText = 'position:absolute;top:20px;right:24px;border:none;background:none;font-size:28px;line-height:1;color:' + F + ';cursor:pointer';
    close.addEventListener('click', shut);
    drawer.appendChild(close);
    document.body.appendChild(drawer);

    ov.addEventListener('click', shut);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') shut(); });
  }

  function wire() {
    if (wired) return;
    wired = true;
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('#pt-ham') : null;
      if (!t) return;
      e.preventDefault();
      build();
      open ? shut() : openNav();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var t = e.target && e.target.closest ? e.target.closest('#pt-ham') : null;
      if (!t) return;
      e.preventDefault();
      build();
      open ? shut() : openNav();
    });
  }

  function sync() {
    var h = header();
    if (!h) return;
    build();
    wire();
    if (ov && !ov.isConnected) document.body.appendChild(ov);
    if (drawer && !drawer.isConnected) document.body.appendChild(drawer);
    // measure the header, not the window — inside a preview pane innerWidth lies
    var narrow = h.getBoundingClientRect().width <= BP;
    var nav = headerNav();
    if (nav) nav.style.display = narrow ? 'none' : 'flex';
    var b = ensureHam();
    if (b) b.style.display = narrow ? 'flex' : 'none';
    if (!narrow && open) shut();
  }

  function start() {
    sync();
    window.addEventListener('resize', sync);
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(sync);
      var h = header();
      if (h) ro.observe(h);
      ro.observe(document.documentElement);
    }
    // the header is React-rendered; re-apply after every repaint
    new MutationObserver(function () { sync(); }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
  var tries = 0;
  var t = setInterval(function () {
    if (++tries > 60 || header()) { sync(); if (header()) clearInterval(t); }
  }, 120);
})();
