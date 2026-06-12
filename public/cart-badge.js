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
