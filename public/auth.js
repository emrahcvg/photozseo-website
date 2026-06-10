/* auth.js — Google Identity Services (GIS) One Tap + özel hesap menüsü.
 * /market ve /store sayfalarında yüklenir.
 * Giriş yapılmamışsa: #pz-signin-btn tıklamasında One Tap açılır.
 * Giriş yapılmışsa: avatar dairesi + açılır hesap menüsü gösterilir.
 * Savunmacı: GIS yüklenemezse veya container yoksa hata fırlatmaz. */
(function () {
  'use strict';

  /* ── Başlangıç: container kontrolü ── */
  var signinEl = document.getElementById('pz-signin');
  var userEl = document.getElementById('pz-user');
  if (!signinEl) return; // container yoksa dur

  var clientId = signinEl.getAttribute('data-client-id');
  if (!clientId) return;

  /* ── Yardımcı: HTML escape ── */
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ── Renk: baş harfinden sabit renk üret (deterministik) ── */
  var AVATAR_COLORS = [
    '#4361EE', '#3A86FF', '#7B2FBE', '#E84393', '#FF6B6B',
    '#F4A261', '#2EC4B6', '#06A77D', '#D62246',
  ];
  function avatarColor(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  }

  /* ── Oturum API çağrısı ── */
  function checkSession() {
    return fetch('/api/auth/me')
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }

  /* ── GIS One Tap giriş callback'i ── */
  function onCredential(response) {
    // Anonim cihaz favori/sepetini hesaba taşımak için mevcut device id'yi yolla
    // (storefront-buyer.js ile aynı 'sf-device-id' anahtarı; yoksa yollama — taşınacak veri yok).
    var headers = { 'content-type': 'application/json' };
    try {
      var dev = localStorage.getItem('sf-device-id');
      if (dev) headers['x-device-id'] = dev;
    } catch (e) {}
    fetch('/api/auth/google', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ credential: response.credential }),
    }).then(function (r) {
      if (r.ok) location.reload();
    }).catch(function () { /* sessiz hata */ });
  }

  /* ── One Tap gösterilemeyince resmi Google butonu render et ── */
  function showFallbackButton() {
    var g = window.google;
    if (!g || !g.accounts || !g.accounts.id) return;
    var container = document.getElementById('pz-signin');
    if (!container) return;
    // Özel buton gizle; Google'ın resmi popup butonunu ekle
    var btn = document.getElementById('pz-signin-btn');
    if (btn) btn.style.display = 'none';
    var fbDiv = document.getElementById('pz-signin-fb');
    if (!fbDiv) {
      fbDiv = document.createElement('div');
      fbDiv.id = 'pz-signin-fb';
      container.appendChild(fbDiv);
    }
    g.accounts.id.renderButton(fbDiv, {
      type: 'standard',
      size: 'large',
      text: 'signin_with',
      shape: 'pill',
      logo_alignment: 'left',
    });
  }

  /* ── One Tap başlat (sadece giriş yapılmamışsa çağrılır) ── */
  function initOneTap() {
    var g = window.google;
    if (!g || !g.accounts || !g.accounts.id) return;

    g.accounts.id.initialize({
      client_id: clientId,
      callback: onCredential,
      auto_select: true,
      cancel_on_tap_outside: false,
      context: 'signin',
      itp_support: true,
    });

    // Sayfa yüklenince One Tap dene; gösterilemezse fallback butonu render et
    g.accounts.id.prompt(function (notification) {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        showFallbackButton();
      }
    });

    // Butona tıklanınca: One Tap'ı yeniden dene, yine olmazsa fallback
    var signinBtn = document.getElementById('pz-signin-btn');
    if (signinBtn) {
      signinBtn.addEventListener('click', function () {
        g.accounts.id.prompt(function (notification) {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            showFallbackButton();
          }
        });
      });
    }
  }

  /* ── Giriş yapılmış: avatar + açılır menü render ── */
  function renderUserMenu(data) {
    if (!userEl) return;

    // Giriş butonu container'ını gizle
    signinEl.style.display = 'none';

    var name = data.name || data.email || 'Kullanıcı';
    var email = data.email || '';
    var picture = data.picture || '';
    var initial = (name.trim().charAt(0) || email.charAt(0) || 'K').toUpperCase();
    var bgColor = avatarColor(email || name);

    // Avatar — Google foto varsa img, yoksa baş harfi dairesi
    var avatarHtml;
    if (picture) {
      avatarHtml = '<img class="pz-avatar__img" src="' + escapeHtml(picture) + '" alt="' + escapeHtml(name) + '" width="32" height="32" referrerpolicy="no-referrer" />';
    } else {
      avatarHtml = '<span class="pz-avatar__initial" style="background:' + bgColor + '">' + escapeHtml(initial) + '</span>';
    }

    // Açılır menü HTML'i
    userEl.innerHTML =
      '<div class="pz-acct-wrap">' +
        '<button type="button" class="pz-avatar" id="pz-avatar-btn" aria-label="' + escapeHtml(name) + ' hesap menüsü" aria-expanded="false" aria-haspopup="true">' +
          avatarHtml +
        '</button>' +
        '<div class="pz-dropdown" id="pz-dropdown" hidden role="menu">' +
          '<p class="pz-dropdown__email">' + escapeHtml(email) + '</p>' +
          '<hr class="pz-dropdown__sep" />' +
          '<a class="pz-dropdown__item" role="menuitem" href="/market/favorites">Favorilerim</a>' +
          '<a class="pz-dropdown__item" role="menuitem" href="/market/cart">Sepetim</a>' +
          '<a class="pz-dropdown__item" role="menuitem" href="/market/orders">Siparişlerim</a>' +
          '<hr class="pz-dropdown__sep" />' +
          '<button type="button" class="pz-dropdown__item pz-dropdown__signout" role="menuitem" id="pz-logout">Çıkış yap</button>' +
        '</div>' +
      '</div>';

    userEl.hidden = false;

    /* Dropdown toggle */
    var avatarBtn = document.getElementById('pz-avatar-btn');
    var dropdown = document.getElementById('pz-dropdown');
    if (avatarBtn && dropdown) {
      avatarBtn.addEventListener('click', function (ev) {
        ev.stopPropagation();
        var open = !dropdown.hidden;
        dropdown.hidden = open;
        avatarBtn.setAttribute('aria-expanded', String(!open));
      });
      // Dışarı tıklanınca kapat
      document.addEventListener('click', function (ev) {
        if (!dropdown.hidden && !userEl.contains(ev.target)) {
          dropdown.hidden = true;
          avatarBtn.setAttribute('aria-expanded', 'false');
        }
      });
      // Esc tuşuyla kapat
      document.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape' && !dropdown.hidden) {
          dropdown.hidden = true;
          avatarBtn.setAttribute('aria-expanded', 'false');
          avatarBtn.focus();
        }
      });
    }

    /* Çıkış */
    var logoutBtn = document.getElementById('pz-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        fetch('/api/auth/logout', { method: 'POST' }).finally(function () {
          location.reload();
        });
      });
    }
  }

  /* ── Ana akış: oturum durumunu kontrol et, ardından init ── */
  checkSession().then(function (data) {
    if (data && data.loggedIn) {
      // Giriş yapılmış → avatar menüsü göster; One Tap yok
      renderUserMenu(data);
    } else {
      // Giriş yapılmamış → GIS One Tap başlat
      if (window.google && window.google.accounts) {
        initOneTap();
      } else {
        // GIS henüz yüklenmemişse: onload + script.onload ile bekle
        var prev = window.onload;
        window.onload = function () {
          if (typeof prev === 'function') prev();
          initOneTap();
        };
        var gsiScript = document.querySelector('script[src*="gsi/client"]');
        if (gsiScript) {
          gsiScript.addEventListener('load', function () { initOneTap(); });
        }
      }
    }
  });
})();
