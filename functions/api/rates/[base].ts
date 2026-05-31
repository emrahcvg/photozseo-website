/**
 * GET /api/rates/<base>
 * Returns exchange rates with <base> as the base currency (rate[base] === 1).
 * Source: open.er-api.com (free, no API key). Cached in STORE_KV for 24h.
 *
 * Response shape:
 *   { base: "USD", rates: { USD: 1, EUR: 0.92, ... }, fetchedAt: "<iso>" }
 *
 * The storefront client uses these to convert prices between any two
 * currencies (cross-rate): amount / rates[from] * rates[to].
 */

interface Env {
  STORE_KV: KVNamespace;
}

interface RatesPayload {
  base: string;
  rates: Record<string, number>;
  fetchedAt: string;
}

const CACHE_TTL_SECONDS = 24 * 60 * 60; // 24h
const ALLOWED = /^[A-Z]{3}$/;

function ratesKey(base: string): string {
  return `rates:${base}`;
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const raw = (Array.isArray(ctx.params.base) ? ctx.params.base[0] : ctx.params.base) ?? '';
  const base = raw.toUpperCase();

  if (!ALLOWED.test(base)) {
    return json({ error: 'Invalid base currency' }, 400);
  }

  const key = ratesKey(base);

  // 1) Serve from cache when warm.
  const cached = await ctx.env.STORE_KV.get(key);
  if (cached) {
    return json(JSON.parse(cached) as RatesPayload, 200, true);
  }

  // 2) Cache miss → fetch live rates.
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${base}`);
    const data = (await res.json()) as {
      result?: string;
      base_code?: string;
      rates?: Record<string, number>;
    };

    if (data.result !== 'success' || !data.rates) {
      return json({ error: 'Rate source unavailable' }, 502);
    }

    const payload: RatesPayload = {
      base,
      rates: data.rates,
      fetchedAt: new Date().toISOString(),
    };

    // Persist with TTL so the next visitor hits cache.
    await ctx.env.STORE_KV.put(key, JSON.stringify(payload), {
      expirationTtl: CACHE_TTL_SECONDS,
    });

    return json(payload, 200, true);
  } catch {
    return json({ error: 'Rate fetch failed' }, 502);
  }
};

function json(body: unknown, status: number, cache = false): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...(cache ? { 'cache-control': 'public, max-age=3600' } : { 'cache-control': 'no-store' }),
    },
  });
}
