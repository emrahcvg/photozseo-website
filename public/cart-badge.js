/* cart-badge.js — tüm storefront sayfalarında navbar sepet rozetini localStorage'dan başlatır.
 * marketplace-cart.js sadece /store/<slug> sayfasında çalışır; market sayfaları bu dosyayı kullanır. */
(function () {
  'use strict';

  function totalFromStorage() {
    var total = 0;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.startsWith('mk-cart:')) {
          var items = JSON.parse(localStorage.getItem(k) || '[]');
          for (var j = 0; j < items.length; j++) {
            total += items[j].qty || 1;
          }
        }
      }
    } catch (e) {}
    return total;
  }

  // Cihaz kimliğini birinci taraf çereze yansıt: /market sepet/favori/sipariş sayfaları
  // sunucuda render edilirken tarayıcı özel header gönderemez (salt-okuma SSR için).
  function mirrorDeviceCookie(id) {
    if (!id || !/^[0-9a-f-]{36}$/i.test(id)) return;
    try {
      if (document.cookie.indexOf('pz_device=' + id) !== -1) return;
      document.cookie = 'pz_device=' + id + '; Path=/; Max-Age=31536000; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
      // Çerez ilk kez yazıldıysa kişisel sayfa boş render edilmiştir → bir kez yenile.
      if (/^\/market\/(cart|favorites|orders)\/?$/.test(location.pathname) && document.cookie.indexOf('pz_device=' + id) !== -1) {
        if (!sessionStorage.getItem('pz-device-reload')) { sessionStorage.setItem('pz-device-reload', '1'); location.reload(); }
      }
    } catch (e) {}
  }

  try { mirrorDeviceCookie(localStorage.getItem('sf-device-id')); } catch (e) {}

  function updateBadges() {
    var total = totalFromStorage();
    document.querySelectorAll('[data-mk-cart-count]').forEach(function (badge) {
      badge.textContent = String(total);
      badge.hidden = total === 0;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateBadges);
  } else {
    updateBadges();
  }

  // Başka sekmede veya store sayfasında sepet güncellenince senkronize et
  window.addEventListener('storage', function (e) {
    if (e.key && e.key.startsWith('mk-cart:')) updateBadges();
  });
})();
