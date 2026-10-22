export interface HtmlResponseOptions {
  /** Kişiye özel sayfa (sipariş/sepet/favori): paylaşılan önbellek ve tarayıcı geçmişi saklamasın. */
  private?: boolean;
}

export function htmlResponse(html: string, status = 200, opts: HtmlResponseOptions = {}): Response {
  const headers: Record<string, string> = { 'content-type': 'text/html; charset=utf-8' };
  if (opts.private) {
    headers['cache-control'] = 'private, no-store';
    headers['vary'] = 'Cookie';
  } else {
    // Hata sayfaları kısa tutulur; düzelen kayıt 60 sn beklemeden görünsün.
    headers['cache-control'] = status >= 400 ? 'public, max-age=10' : 'public, max-age=60';
  }
  return new Response(html, { status, headers });
}
