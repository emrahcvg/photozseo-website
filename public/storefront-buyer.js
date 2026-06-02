/* storefront-buyer.js — anonim cihaz kimliği + favori (kalp) + sepet backend senkronu.
 * /store/<slug> sayfalarında yüklenir. Cihaz UUID'si localStorage'da, x-device-id header'ıyla yollanır.
 * Backend yoksa/hata verirse sessizce localStorage'a düşer (offline-tolerant). */
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

  function slug() {
    var m = location.pathname.match(/\/store\/([a-z0-9-]+)/i);
    return m ? m[1] : null;
  }

  function api(path, method, body) {
    return fetch(path, {
      method: method,
      headers: { 'content-type': 'application/json', 'x-device-id': deviceId() },
      body: body ? JSON.stringify(body) : undefined,
    }).then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); });
  }

  var s = slug();

  function addFavorite(productSlug) { return api('/api/store/' + s + '/favorites', 'POST', { productSlug: productSlug }); }
  function removeFavorite(productSlug) { return api('/api/store/' + s + '/favorites', 'DELETE', { productSlug: productSlug }); }
  function listFavorites() { return api('/api/store/' + s + '/favorites', 'GET'); }
  function setCartItem(productSlug, qty) { return api('/api/store/' + s + '/cart', 'PUT', { productSlug: productSlug, qty: qty }); }
  function getCart() { return api('/api/store/' + s + '/cart', 'GET'); }

  // Kalp butonlarını wire et + mevcut favori durumunu boya.
  function wireFavorites() {
    var buttons = document.querySelectorAll('[data-sf-fav]');
    if (!buttons.length || !s) return;
    // 1) Click handler'larını HEMEN bağla — listFavorites fetch'ini BEKLEME.
    //    Aksi halde fetch dönene dek kalp tıklaması <a> kart linkini gezerdi (bug).
    buttons.forEach(function (btn) {
      var p = btn.getAttribute('data-sf-fav');
      btn.addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation(); // kalp kart linkinin (<a>) içinde — gezinmeyi engelle
        var active = btn.classList.toggle('is-fav');
        (active ? addFavorite(p) : removeFavorite(p)).catch(function () { btn.classList.toggle('is-fav'); });
      });
    });
    // 2) Mevcut favori durumunu async boya (geldiğinde işaretle).
    listFavorites().then(function (res) {
      var set = {};
      (res.favorites || []).forEach(function (p) { set[p] = true; });
      buttons.forEach(function (btn) {
        if (set[btn.getAttribute('data-sf-fav')]) btn.classList.add('is-fav');
      });
    }).catch(function () {/* offline: butonlar yine toggle eder ama backend'e yazmaz */});
  }

  window.__sfBuyer = {
    deviceId: deviceId, slug: slug,
    addFavorite: addFavorite, removeFavorite: removeFavorite, listFavorites: listFavorites,
    setCartItem: setCartItem, getCart: getCart,
  };

  if (document.readyState !== 'loading') wireFavorites();
  else document.addEventListener('DOMContentLoaded', wireFavorites);
})();
