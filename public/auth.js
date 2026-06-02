/* auth.js — Google Identity Services (GIS) giriş entegrasyonu.
 * /market ve /store sayfalarında yüklenir.
 * #pz-signin container'ına Google butonu render eder; giriş sonrası cookie set edilir.
 * #pz-user container'ına kullanıcı chip'i + Çıkış bağlantısı render edilir.
 * Savunmacı: GIS yüklenemezse veya container yoksa hata fırlatmaz. */
(function () {
  'use strict';

  var signinEl = document.getElementById('pz-signin');
  var userEl = document.getElementById('pz-user');
  if (!signinEl) return; // container yoksa dur

  var clientId = signinEl.getAttribute('data-client-id');
  if (!clientId) return;

  /** Kullanıcı chip'ini render et (giriş yapılmışsa). */
  function renderUserChip(data) {
    if (!userEl) return;
    // Giriş butonu container'ını gizle
    signinEl.style.display = 'none';
    var name = data.name || data.email || 'Kullanıcı';
    userEl.innerHTML =
      '<span class="pz-user-chip">' +
        '<span class="pz-user-chip__name">' + escapeHtml(name) + '</span>' +
        ' <a class="pz-user-chip__logout" href="#" id="pz-logout">Çıkış</a>' +
      '</span>';
    var logoutLink = document.getElementById('pz-logout');
    if (logoutLink) {
      logoutLink.addEventListener('click', function (ev) {
        ev.preventDefault();
        fetch('/api/auth/logout', { method: 'POST' }).finally(function () {
          location.reload();
        });
      });
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** GIS credential callback — token'ı backend'e gönder, başarılıysa sayfayı yenile. */
  function onGisCredential(response) {
    fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ credential: response.credential }),
    }).then(function (r) {
      if (r.ok) location.reload();
    }).catch(function () { /* sessiz hata */ });
  }

  /** /api/auth/me ucu ile oturum durumunu kontrol et. */
  function checkSession() {
    return fetch('/api/auth/me')
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }

  /** GIS hazır olduğunda initialize + buton render et. */
  function initGis() {
    if (!window.google || !window.google.accounts || !window.google.accounts.id) return;
    window.google.accounts.id.initialize({ client_id: clientId, callback: onGisCredential });
    window.google.accounts.id.renderButton(signinEl, { theme: 'outline', size: 'medium', type: 'standard' });
  }

  // Sayfa yüklenirken oturum durumunu kontrol et; giriş yapılmışsa chip göster.
  checkSession().then(function (data) {
    if (data && data.loggedIn) {
      renderUserChip(data);
    } else {
      // GIS henüz yüklendiyse hemen init; yoksa window.onload ile bekle.
      if (window.google && window.google.accounts) {
        initGis();
      } else {
        var prev = window.onload;
        window.onload = function () {
          if (typeof prev === 'function') prev();
          initGis();
        };
        // GIS async yüklenmişse load event zaten tetiklendi; polling yerine script onload hook
        var gsiScript = document.querySelector('script[src*="gsi/client"]');
        if (gsiScript) {
          gsiScript.addEventListener('load', function () { initGis(); });
        }
      }
    }
  });
})();
