/* marketplace-cart.js — store-scoped localStorage cart + WhatsApp/IBAN order flow.
 * Zero backend, zero payment. Loaded on /store/<slug> pages.
 * Exposes window.__mkCart for unit tests; auto-wires DOM if a cart UI is present. */
(function () {
  'use strict';

  function key(slug) { return 'mk-cart:' + slug; }

  function getCart(slug) {
    try { return JSON.parse(localStorage.getItem(key(slug)) || '[]'); }
    catch (e) { return []; }
  }
  function saveCart(slug, items) {
    try { localStorage.setItem(key(slug), JSON.stringify(items)); } catch (e) {}
  }
  function addItem(slug, item) {
    var items = getCart(slug);
    var existing = null;
    for (var i = 0; i < items.length; i++) { if (items[i].id === item.id) { existing = items[i]; break; } }
    if (existing) { existing.qty += (item.qty || 1); }
    else { items.push({ id: item.id, title: item.title, price: item.price, currency: item.currency, qty: item.qty || 1 }); }
    saveCart(slug, items);
    return items;
  }
  function removeItem(slug, id) {
    var items = getCart(slug).filter(function (x) { return x.id !== id; });
    saveCart(slug, items);
    return items;
  }
  function cartTotal(slug) {
    return getCart(slug).reduce(function (sum, x) { return sum + (x.price || 0) * (x.qty || 1); }, 0);
  }
  function clearCart(slug) { saveCart(slug, []); }

  // SP-XXXXX random reference, client-side only (no persistence/counter → no backend).
  function generateRef() {
    var alphabet = '0123456789ABCDEFGHJKMNPQRSTUVWXYZ';
    var cryptoObj = (typeof self !== 'undefined' && self.crypto) || (typeof window !== 'undefined' && window.crypto) || null;
    var out = '';
    if (cryptoObj && cryptoObj.getRandomValues) {
      var bytes = new Uint8Array(5);
      cryptoObj.getRandomValues(bytes);
      for (var i = 0; i < 5; i++) { out += alphabet[bytes[i] % alphabet.length]; }
    } else {
      // Eski/güvensiz bağlamda crypto yoksa: sipariş akışı kilitlenmesin (ref benzersizlik kritik değil).
      for (var j = 0; j < 5; j++) { out += alphabet[Math.floor(Math.random() * alphabet.length)]; }
    }
    return 'SP-' + out;
  }

  function validateOrder(form) {
    var errors = {};
    ['name', 'phone', 'address'].forEach(function (f) {
      if (!form[f] || !String(form[f]).trim()) errors[f] = true;
    });
    return { valid: Object.keys(errors).length === 0, errors: errors };
  }

  function buildWhatsappUrl(whatsapp, slug, form, ref) {
    var items = getCart(slug);
    var lines = [];
    lines.push('Order ' + ref);
    items.forEach(function (x) {
      lines.push('- ' + x.title + ' x' + x.qty + ' (' + (x.price != null ? x.price + ' ' + x.currency : '-') + ')');
    });
    lines.push('Total: ' + cartTotal(slug).toFixed(2));
    lines.push('');
    lines.push('Name: ' + form.name);
    lines.push('Phone: ' + form.phone);
    lines.push('Address: ' + form.address);
    if (form.note) lines.push('Note: ' + form.note);
    var num = String(whatsapp).replace(/[^0-9]/g, '');
    return 'https://wa.me/' + num + '?text=' + encodeURIComponent(lines.join('\n'));
  }

  var api = {
    getCart: getCart, saveCart: saveCart, addItem: addItem, removeItem: removeItem,
    cartTotal: cartTotal, clearCart: clearCart, generateRef: generateRef,
    validateOrder: validateOrder, buildWhatsappUrl: buildWhatsappUrl,
  };
  window.__mkCart = api;

  // ── DOM wiring (no-op when the cart UI is absent, e.g. in unit tests) ──────────
  function init() {
    var root = document.querySelector('[data-mk-cart-root]');
    if (!root) return;
    var slug = root.getAttribute('data-mk-slug');
    var whatsapp = root.getAttribute('data-mk-whatsapp') || '';

    document.querySelectorAll('[data-mk-add]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var productId = btn.getAttribute('data-mk-add');
        var pslug = btn.getAttribute('data-mk-pslug') || productId;
        addItem(slug, {
          id: productId,
          title: btn.getAttribute('data-mk-title') || '',
          price: parseFloat(btn.getAttribute('data-mk-price') || '0') || 0,
          currency: btn.getAttribute('data-mk-currency') || 'USD',
          qty: 1,
        });
        render();
        // Backend D1 sync (non-blocking; offline tolerant)
        if (window.__sfBuyer && window.__sfBuyer.setCartItem) {
          var items = getCart(slug);
          var newQty = 1;
          for (var i = 0; i < items.length; i++) {
            if (items[i].id === productId) { newQty = items[i].qty; break; }
          }
          window.__sfBuyer.setCartItem(pslug, newQty).catch(function () {});
        }
      });
    });

    var form = root.querySelector('[data-mk-order-form]');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var data = {
          name: (form.querySelector('[name=name]') || {}).value || '',
          phone: (form.querySelector('[name=phone]') || {}).value || '',
          address: (form.querySelector('[name=address]') || {}).value || '',
          note: (form.querySelector('[name=note]') || {}).value || '',
        };
        var v = validateOrder(data);
        form.querySelectorAll('[data-mk-err]').forEach(function (el) {
          el.hidden = !v.errors[el.getAttribute('data-mk-err')];
        });
        if (!v.valid) return;
        var ref = generateRef();
        var refOut = root.querySelector('[data-mk-ref]');
        if (refOut) refOut.textContent = ref;
        var payBox = root.querySelector('[data-mk-payment]');
        if (payBox) payBox.hidden = false;
        var descOut = root.querySelector('[data-mk-paydesc]');
        if (descOut) descOut.textContent = ref;

        var deviceId = (window.__sfBuyer && window.__sfBuyer.deviceId) ? window.__sfBuyer.deviceId() : '';

        // localStorage → D1 pre-sync: cart butonlarından pslug'ları topla, eksik sync'leri tamamla.
        // Sonra /order endpoint'ini çağır (backend D1'den doğrular).
        var cartBtns = document.querySelectorAll('[data-mk-add][data-mk-pslug]');
        var syncPromises = [];
        if (window.__sfBuyer && window.__sfBuyer.setCartItem && cartBtns.length) {
          var items = getCart(slug);
          var qtyByPslug = {};
          items.forEach(function (x) {
            var btn = null;
            for (var i = 0; i < cartBtns.length; i++) {
              if (cartBtns[i].getAttribute('data-mk-add') === x.id) { btn = cartBtns[i]; break; }
            }
            var pslug = btn ? btn.getAttribute('data-mk-pslug') : x.id;
            if (pslug && x.qty > 0) qtyByPslug[pslug] = x.qty;
          });
          Object.keys(qtyByPslug).forEach(function (pslug) {
            syncPromises.push(window.__sfBuyer.setCartItem(pslug, qtyByPslug[pslug]).catch(function () {}));
          });
        }

        Promise.all(syncPromises).catch(function () {}).then(function () {
          fetch('/api/store/' + slug + '/order', {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'x-device-id': deviceId },
            body: JSON.stringify({ store_name: root.getAttribute('data-mk-store-name') || undefined }),
          }).then(function (r) {
            return r.ok ? r.json() : null;
          }).then(function (res) {
            if (res && res.order_ref) {
              ref = res.order_ref;
              if (refOut) refOut.textContent = ref;
              if (descOut) descOut.textContent = ref;
            }
          }).catch(function () {});
        });

        var waWin = window.open(buildWhatsappUrl(whatsapp, slug, data, ref), '_blank');
        if (waWin) waWin.opener = null;
      });
    }

    function pslugFor(productId) {
      var btns = document.querySelectorAll('[data-mk-add][data-mk-pslug]');
      for (var i = 0; i < btns.length; i++) {
        if (btns[i].getAttribute('data-mk-add') === productId) {
          return btns[i].getAttribute('data-mk-pslug') || productId;
        }
      }
      return productId;
    }

    function render() {
      var list = root.querySelector('[data-mk-cart-list]');
      if (!list) return;
      var items = getCart(slug);
      var isEmpty = items.length === 0;

      // Empty state / form / total toggle
      var emptyEl = root.querySelector('[data-mk-cart-empty]');
      var formEl = root.querySelector('[data-mk-order-form]');
      var totalRow = root.querySelector('[data-mk-total-row]');
      if (isEmpty) {
        root.setAttribute('data-mk-empty', '');
      } else {
        root.removeAttribute('data-mk-empty');
      }
      if (emptyEl) emptyEl.hidden = !isEmpty;
      if (formEl) formEl.hidden = isEmpty;
      if (totalRow) totalRow.hidden = isEmpty;

      list.innerHTML = '';
      items.forEach(function (x) {
        var li = document.createElement('li');
        li.className = 'sf-cart__item';

        var titleSpan = document.createElement('span');
        titleSpan.className = 'sf-cart__item-title';
        titleSpan.textContent = x.title;

        var qtySpan = document.createElement('span');
        qtySpan.className = 'sf-cart__item-qty';
        qtySpan.textContent = '×' + x.qty;

        var removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'sf-cart__remove';
        removeBtn.setAttribute('aria-label', 'Remove ' + x.title);
        removeBtn.textContent = '×';
        (function (itemId) {
          removeBtn.addEventListener('click', function () {
            removeItem(slug, itemId);
            if (window.__sfBuyer && window.__sfBuyer.setCartItem) {
              window.__sfBuyer.setCartItem(pslugFor(itemId), 0).catch(function () {});
            }
            render();
          });
        })(x.id);

        li.appendChild(titleSpan);
        li.appendChild(qtySpan);
        li.appendChild(removeBtn);
        list.appendChild(li);
      });

      var totalEl = root.querySelector('[data-mk-total]');
      if (totalEl) totalEl.textContent = cartTotal(slug).toFixed(2);

      // Update navbar cart badge
      var totalQty = items.reduce(function (s, x) { return s + (x.qty || 1); }, 0);
      document.querySelectorAll('[data-mk-cart-count]').forEach(function (badge) {
        badge.textContent = totalQty;
        badge.hidden = totalQty === 0;
      });
    }
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
