export const onRequest: PagesFunction = async (ctx) => {
  const response = await ctx.next();
  const { pathname } = new URL(ctx.request.url);

  // Base headers applied to every response
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

  // CSP — /market/* only (Google Sign-In + product images from googleusercontent.com)
  if (pathname.startsWith('/market')) {
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' accounts.google.com static.cloudflareinsights.com",
        "style-src 'self' 'unsafe-inline' accounts.google.com",
        "img-src 'self' data: blob: *.googleusercontent.com",
        "connect-src 'self' accounts.google.com",
        "frame-src accounts.google.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self' accounts.google.com",
        "frame-ancestors 'none'",
      ].join('; '),
    );
  }

  return response;
};
