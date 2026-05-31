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

  function init() { bindPrefetch(); bindViewTransitions(); bindFilterSheet(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
