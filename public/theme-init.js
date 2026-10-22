/**
 * theme-init.js — Açık/koyu tema seçimi (store + market ortak).
 * <head> içinde senkron yüklenir: kayıtlı seçimi boyamadan ÖNCE <html data-theme>'e
 * yazar (renk zıplaması olmaz). Seçim yoksa işletim sistemi tercihi geçerli kalır.
 * CSP script-src 'self' → satır içi script yerine bu dosya.
 */
(function () {
  var KEY = 'pz-theme';
  var root = document.documentElement;

  function read() {
    try { var v = localStorage.getItem(KEY); return v === 'light' || v === 'dark' ? v : null; } catch (e) { return null; }
  }
  function systemDark() {
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function effective() {
    var t = root.getAttribute('data-theme');
    return t === 'light' || t === 'dark' ? t : (systemDark() ? 'dark' : 'light');
  }
  function syncMeta() {
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', effective() === 'dark' ? '#0B0B0D' : '#ffffff');
  }
  function syncButtons() {
    var dark = effective() === 'dark';
    var btns = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < btns.length; i++) btns[i].setAttribute('aria-pressed', dark ? 'true' : 'false');
  }

  var saved = read();
  if (saved) root.setAttribute('data-theme', saved);

  function toggle() {
    var next = effective() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem(KEY, next); } catch (e) { /* gizli sekme: yalnız bu sayfa için geçerli */ }
    syncMeta();
    syncButtons();
  }

  function init() {
    syncMeta();
    syncButtons();
    document.addEventListener('click', function (e) {
      var t = e.target && e.target.closest ? e.target.closest('[data-theme-toggle]') : null;
      if (t) { e.preventDefault(); toggle(); }
    });
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var onChange = function () { if (!read()) { syncMeta(); syncButtons(); } };
      if (mq.addEventListener) mq.addEventListener('change', onChange); else if (mq.addListener) mq.addListener(onChange);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
