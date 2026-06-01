/* marketplace-enhance.js — progressive enhancement for /market.
 * Hover/touch prefetch, View Transitions (if supported), mobile filter-sheet toggle.
 * Everything degrades to plain navigation when JS/APIs are absent. */
(function () {
  'use strict';

  // ── Hover-prefetch ────────────────────────────────────────────────────────────
  var prefetched = {};
  function prefetch(href) {
    if (!href || prefetched[href]) return;
    prefetched[href] = true;
    var link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }
  function bindPrefetch() {
    document.querySelectorAll('a.mk-card-link, a.mk-store, a.mk-chip').forEach(function (a) {
      var run = function () { prefetch(a.getAttribute('href')); };
      a.addEventListener('mouseenter', run);
      a.addEventListener('touchstart', run, { passive: true });
    });
  }

  // ── View Transitions on same-origin nav ────────────────────────────────────────
  function bindViewTransitions() {
    if (!document.startViewTransition) return;
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (!href || href.charAt(0) === '#' || a.target === '_blank') return;
      var url;
      try { url = new URL(href, location.href); } catch (_) { return; }
      if (url.origin !== location.origin) return;
      e.preventDefault();
      document.startViewTransition(function () { location.href = url.href; });
    });
  }

  // ── Mobile filter sheet toggle ──────────────────────────────────────────────────
  function bindFilterSheet() {
    var btn = document.querySelector('[data-mk-filter-toggle]');
    var sheet = document.querySelector('[data-mk-facets]');
    if (!btn || !sheet) return;
    btn.addEventListener('click', function () {
      var open = sheet.hasAttribute('data-mk-open');
      if (open) { sheet.removeAttribute('data-mk-open'); btn.setAttribute('aria-expanded', 'false'); }
      else { sheet.setAttribute('data-mk-open', ''); btn.setAttribute('aria-expanded', 'true'); }
    });
  }

  // ── Language switcher: ?lang= param update (preserves other params) ──────────────
  function bindLangSwitcher() {
    var sel = document.querySelector('[data-mk-lang]');
    if (!sel) return;
    sel.addEventListener('change', function () {
      var u = new URL(location.href);
      u.searchParams.set('lang', sel.value);
      location.href = u.href;
    });
  }

  // ── Market currency converter (data-mk-amount / data-mk-currency) ─────────────────
  function bindCurrency() {
    var stored;
    try { stored = localStorage.getItem('sf-currency'); } catch (e) { stored = null; }
    if (!stored) return;

    var ratesCache = {};

    function fmt(amount, currency, locale) {
      try { return new Intl.NumberFormat(locale || 'en', { style: 'currency', currency: currency }).format(amount); }
      catch (e) { return amount.toFixed(2) + ' ' + currency; }
    }

    function applyTo(target, rates) {
      document.querySelectorAll('[data-mk-amount]').forEach(function (el) {
        var amount = parseFloat(el.getAttribute('data-mk-amount'));
        var from = el.getAttribute('data-mk-currency') || 'USD';
        var orig = el.getAttribute('data-mk-orig') || '';
        if (isNaN(amount)) return;
        if (from === target || !rates || !rates[from] || !rates[target]) {
          el.textContent = orig;
          return;
        }
        var converted = (amount / rates[from]) * rates[target];
        el.textContent = '≈ ' + fmt(converted, target);
      });
    }

    function convertAll(target) {
      if (ratesCache[target]) { applyTo(target, ratesCache[target]); return; }
      var bases = {};
      document.querySelectorAll('[data-mk-currency]').forEach(function (el) {
        var b = el.getAttribute('data-mk-currency') || 'USD';
        if (b !== target) bases[b] = true;
      });
      var base = Object.keys(bases)[0] || 'USD';
      fetch('/api/rates/' + encodeURIComponent(base))
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data && data.rates) { ratesCache[base] = data.rates; applyTo(target, data.rates); }
        })
        .catch(function () {});
    }

    convertAll(stored);
  }

  function init() { bindPrefetch(); bindViewTransitions(); bindFilterSheet(); bindLangSwitcher(); bindCurrency(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
