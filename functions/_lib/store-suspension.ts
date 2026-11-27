/**
 * Online mağaza / pazar yeri geçici askı anahtarı.
 * Varsayılan: ASKIDA. Yeniden açmak için Cloudflare Pages ortam değişkeni STORE_SUSPENDED=false.
 * Açık kalanlar: /api/report, /api/admin/takedown, /api/account/delete, /api/auth/*, B2B teklif (/q) ve
 * satıcının kendi mağazasını silmesi (DELETE /api/store/<slug>).
 * Veritabanına (D1) dokunulmaz.
 */
export function isStoreSuspended(env: { STORE_SUSPENDED?: string } | undefined): boolean {
  return (env?.STORE_SUSPENDED ?? '').toLowerCase() !== 'false';
}

export function isSuspendedPath(pathname: string, method = 'GET'): boolean {
  // Satıcı kendi mağazasını kaldırabilsin (uygulama DELETE /api/store/<slug> çağırır) — askıda da açık kalır.
  if (method.toUpperCase() === 'DELETE' && pathname.startsWith('/api/store/')) return false;
  return (
    pathname === '/market' ||
    pathname.startsWith('/market/') ||
    pathname === '/store' ||
    pathname.startsWith('/store/') ||
    pathname === '/marketplace-sitemap' ||
    pathname === '/marketplace-sitemap.xml' ||
    pathname === '/api/orders' ||
    pathname.startsWith('/api/store/')
  );
}

const PAGE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Temporarily unavailable · photoZseo</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0B0E1A;color:#F5F7FB;font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;text-align:center;padding:24px}main{max-width:520px}h1{font-size:1.6rem;margin:0 0 12px}p{color:#aab2c5;margin:8px 0}a{color:#4FD1C5}</style></head><body><main><h1>Online stores are temporarily unavailable</h1><p>The photoZseo online store and marketplace are paused. Nothing was deleted.</p><p>Online mağaza ve pazar yeri geçici olarak kapalıdır.</p><p><a href="/">photozseo.com</a></p></main></body></html>`;

export function suspendedResponse(pathname: string): Response {
  const headers: Record<string, string> = {
    'Retry-After': '86400',
    'X-Robots-Tag': 'noindex, nofollow',
    'Cache-Control': 'no-store',
  };
  if (pathname.startsWith('/api/')) {
    // iOS uygulaması hata gövdesini olduğu gibi kullanıcıya gösteriyor → kısa, okunur düz metin (JSON/HTML değil).
    return new Response('Online store is temporarily unavailable. Your products and data are safe.', {
      status: 503,
      headers: { ...headers, 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
  return new Response(PAGE, { status: 503, headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } });
}
