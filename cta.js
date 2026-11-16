/* Floating contact buttons: WhatsApp on every page, plus a Call button on phones. */
(function () {
  if (/visualise/.test(location.pathname)) return;          // that page has its own flow
  var PHONE = '27768048868';
  function build() {
    if (document.getElementById('pt-cta')) return;
    var topic = (document.title || '').split(/[|—–-]/)[0].trim();
    var text = 'Hi PrimeTurf, I would like a free quote' + (topic ? ' (' + topic + ')' : '') + '.';
    var wrap = document.createElement('div');
    wrap.id = 'pt-cta';
    wrap.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:900;display:flex;flex-direction:column;gap:10px;align-items:flex-end';
    var base = 'display:flex;align-items:center;gap:8px;color:#fff;text-decoration:none;font:600 13px/1 Montserrat,system-ui,sans-serif;letter-spacing:.04em;padding:14px 18px;border-radius:999px;box-shadow:0 6px 20px rgba(0,0,0,.28)';
    var wa = document.createElement('a');
    wa.href = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(text);
    wa.target = '_blank'; wa.rel = 'noopener';
    wa.setAttribute('aria-label', 'WhatsApp PrimeTurf for a free quote');
    wa.style.cssText = base + ';background:#1A9E4A';
    wa.textContent = 'WhatsApp us';
    var call = document.createElement('a');
    call.href = 'tel:+' + PHONE;
    call.setAttribute('aria-label', 'Call PrimeTurf');
    call.style.cssText = base + ';background:#0B3D2E;display:none';
    call.textContent = 'Call 076 804 8868';
    wrap.appendChild(call); wrap.appendChild(wa);
    document.body.appendChild(wrap);
    var mq = window.matchMedia('(max-width: 700px)');
    function sync() { call.style.display = mq.matches ? 'flex' : 'none'; }
    sync(); if (mq.addEventListener) mq.addEventListener('change', sync);
    // stay out of the way of the hero buttons until the visitor has scrolled a little
    function reveal() { wrap.style.display = (window.scrollY > 300) ? 'flex' : 'none'; }
    wrap.style.display = 'none'; reveal();
    window.addEventListener('scroll', reveal, { passive: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
