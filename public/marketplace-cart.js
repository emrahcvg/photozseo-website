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
        addItem(slug, {
          id: btn.getAttribute('data-mk-add'),
          title: btn.getAttribute('data-mk-title') || '',
          price: parseFloat(btn.getAttribute('data-mk-price') || '0') || 0,
          currency: btn.getAttribute('data-mk-currency') || 'USD',
          qty: 1,
        });
        render();
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
        var waWin = window.open(buildWhatsappUrl(whatsapp, slug, data, ref), '_blank');
        if (waWin) waWin.opener = null;
      });
    }

    function render() {
      var list = root.querySelector('[data-mk-cart-list]');
      if (!list) return;
      var items = getCart(slug);
      list.innerHTML = '';
      items.forEach(function (x) {
        var li = document.createElement('li');
        li.textContent = x.title + ' ×' + x.qty;
        list.appendChild(li);
      });
      var totalEl = root.querySelector('[data-mk-total]');
      if (totalEl) totalEl.textContent = cartTotal(slug).toFixed(2);
    }
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
