interface Env {
  POOL_R2: R2Bucket;
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const url = new URL(ctx.request.url);
  // Strip leading /img/ prefix to get the R2 key
  const key = url.pathname.replace(/^\/img\//, '');

  if (!key) return new Response('Not Found', { status: 404 });

  const obj = await ctx.env.POOL_R2.get(key);
  if (!obj) return new Response('Not Found', { status: 404 });

  const headers = new Headers();
  // Content-Type yükleyen istemciden gelir (presign tipi imzalamaz) → yalnız raster görsel
  // tiplerine güven; gerisi indirilebilir ikili olarak, origin'de çalışamayacak şekilde döner.
  const stored = (obj.httpMetadata?.contentType ?? 'image/jpeg').split(';')[0].trim().toLowerCase();
  const safeImage = /^image\/(jpeg|png|webp|gif|avif|heic|heif)$/.test(stored);
  headers.set('Content-Type', safeImage ? stored : 'application/octet-stream');
  if (!safeImage) headers.set('Content-Disposition', 'attachment');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Content-Security-Policy', "default-src 'none'; sandbox");
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  headers.set('ETag', obj.httpEtag);

  // 304 Not Modified support
  if (ctx.request.headers.get('If-None-Match') === obj.httpEtag) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(obj.body, { status: 200, headers });
};
