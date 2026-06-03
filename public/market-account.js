/* market-account.js — /market/favorites + /market/cart sayfaları için alıcı etkileşimi.
 * Favori kaldır + sepet adet/kaldır. Sahip kimliği: backend cookie (Google girişi) veya
 * x-device-id header (anonim cihaz, storefront-buyer.js ile aynı 'sf-device-id' anahtarı).
 * Backend hata verirse optimistic UI geri alınır. */
(function () {
  'use strict';

  function deviceId() {
    var k = 'sf-device-id';
    var v = null;
    try { v = localStorage.getItem(k); } catch (e) {}
    if (!v) {
      v = (self.crypto && self.crypto.randomUUID)
        ? self.crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0, val = c === 'x' ? r : (r & 0x3) | 0x8;
            return val.toString(16);
          });
      try { localStorage.setItem(k, v); } catch (e) {}
    }
    return v;
  }

  function api(path, method, body) {
    return fetch(path, {
      method: method,
      headers: { 'content-type': 'application/json', 'x-device-id': deviceId() },
      body: body ? JSON.stringify(body) : undefined,
    }).then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); });
  }

  function cardData(li) {
    return { store: li.getAttribute('data-store'), product: li.getAttribute('data-product') };
  }

  /* Bir grup/sayfa boşaldıysa DOM'u temizle; sayfa tümüyle boşsa yeniden yükle (boş durumu göster). */
  function pruneEmpty(section) {
    if (section && !section.querySelector('.mk-acct-card')) section.remove();
    if (!document.querySelector('.mk-acct-card')) location.reload();
  }

  /* Sepet grubu toplamını DOM'dan yeniden hesapla. */
  function recomputeTotal(section) {
    var totalEl = section.querySelector('.mk-acct-group__total');
    if (!totalEl) return;
    var sum = 0, currency = null, ok = true;
    section.querySelectorAll('.mk-acct-card').forEach(function (li) {
      var price = parseFloat(li.getAttribute('data-price'));
      var cur = li.getAttribute('data-currency');
      var qtyEl = li.querySelector('[data-mk-cart-qty]');
      var qty = qtyEl ? parseInt(qtyEl.textContent, 10) : 1;
      if (isNaN(price) || !cur) { ok = false; return; }
      if (currency === null) currency = cur;
      else if (currency !== cur) ok = false;
      sum += price * qty;
    });
    if (!ok || currency === null) return;
    var label = totalEl.textContent.split(':')[0];
    var formatted;
    try { formatted = new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency: currency }).format(sum); }
    catch (e) { formatted = sum.toFixed(2) + ' ' + currency; }
    totalEl.textContent = label + ': ' + formatted;
  }

  /* ── Favori kaldır ── */
  function wireFavRemove() {
    document.querySelectorAll('[data-mk-fav-remove]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var li = btn.closest('.mk-acct-card');
        if (!li) return;
        var d = cardData(li);
        var section = li.closest('.mk-acct-group');
        btn.disabled = true;
        api('/api/store/' + d.store + '/favorites', 'DELETE', { productSlug: d.product })
          .then(function () { li.remove(); pruneEmpty(section); })
          .catch(function () { btn.disabled = false; });
      });
    });
  }

  /* ── Sepet adet + kaldır ── */
  function setQty(li, qty) {
    var d = cardData(li);
    var section = li.closest('.mk-acct-group');
    return api('/api/store/' + d.store + '/cart', 'PUT', { productSlug: d.product, qty: qty })
      .then(function () {
        if (qty <= 0) { li.remove(); pruneEmpty(section); }
        else {
          var qtyEl = li.querySelector('[data-mk-cart-qty]');
          if (qtyEl) qtyEl.textContent = String(qty);
          if (section) recomputeTotal(section);
        }
      });
  }

  function wireCart() {
    document.querySelectorAll('.mk-acct-card').forEach(function (li) {
      var qtyEl = li.querySelector('[data-mk-cart-qty]');
      if (!qtyEl) return; // sepet kartı değil (favori sayfası)
      var inc = li.querySelector('[data-mk-cart-inc]');
      var dec = li.querySelector('[data-mk-cart-dec]');
      var rem = li.querySelector('[data-mk-cart-remove]');
      function cur() { return parseInt(qtyEl.textContent, 10) || 1; }
      if (inc) inc.addEventListener('click', function () { setQty(li, cur() + 1).catch(function () {}); });
      if (dec) dec.addEventListener('click', function () { var n = cur() - 1; if (n >= 1) setQty(li, n).catch(function () {}); });
      if (rem) rem.addEventListener('click', function () { rem.disabled = true; setQty(li, 0).catch(function () { rem.disabled = false; }); });
    });
  }

  function init() { wireFavRemove(); wireCart(); }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
