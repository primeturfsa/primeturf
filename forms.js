/* PrimeTurf lead forms — posts to Web3Forms, which emails leon@primeturf.co.za.
   The access key is public by design (Web3Forms keys are meant for client-side use). */
(function () {
  var ENDPOINT = 'https://api.web3forms.com/submit';
  var KEY = '9923a61d-593b-4551-bd12-ce9c1a3933b7';

  // fields: { name, email, phone, message, subject } -> Promise<boolean>
  window.ptSubmit = function (fields) {
    var body = { access_key: KEY, from_name: 'PrimeTurf website', botcheck: '' };
    Object.keys(fields).forEach(function (k) { if (fields[k]) body[k] = fields[k]; });
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body)
    }).then(function (r) { return r.json(); }).then(function (j) { return !!(j && j.success); }).catch(function () { return false; });
  };

  function toast(text, ok) {
    var t = document.getElementById('pt-toast');
    if (!t) {
      t = document.createElement('div'); t.id = 'pt-toast';
      t.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);max-width:92vw;padding:14px 22px;border-radius:2px;font:500 14px/1.5 Montserrat,system-ui,sans-serif;z-index:9999;box-shadow:0 6px 24px rgba(0,0,0,.25)';
      document.body.appendChild(t);
    }
    t.style.background = ok ? '#0B3D2E' : '#A3342B'; t.style.color = '#FAF8F2'; t.textContent = text; t.style.display = 'block';
    clearTimeout(t._h); t._h = setTimeout(function () { t.style.display = 'none'; }, 8000);
  }

  // Contact page form
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-pt-contact-send]');
    if (!btn) return;
    var box = btn.closest('[data-pt-contact]'); if (!box || btn.disabled) return;
    var v = {}; box.querySelectorAll('[name]').forEach(function (el) { v[el.name] = (el.value || '').trim(); });
    if (!v.name || !(v.phone || /.+@.+\..+/.test(v.email || ''))) { toast('Please add your name and a phone number or email address.', false); return; }
    var lines = ['Phone: ' + (v.phone || '-'), 'Suburb: ' + (v.suburb || '-'), 'Project size: ' + (v.size || '-'), '', v.message || ''];
    var label = btn.textContent; btn.disabled = true; btn.textContent = 'Sending…';
    window.ptSubmit({ subject: 'New website enquiry — ' + v.name, name: v.name, email: v.email, phone: v.phone, message: lines.join('\n') }).then(function (ok) {
      btn.disabled = false; btn.textContent = label;
      if (ok) { box.querySelectorAll('[name]').forEach(function (el) { el.value = ''; }); toast('Thank you — your message has been sent. We usually reply within 24 hours.', true); }
      else toast('Sorry, that did not send. Please WhatsApp us on 076 804 8868 or email leon@primeturf.co.za.', false);
    });
  });
})();
