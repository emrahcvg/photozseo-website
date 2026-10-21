/**
 * POST /api/account/delete
 *
 * Uygulama-içi HESAP SİLME (App Store Guideline 5.1.1(v)).
 * Google ile giriş yapan kullanıcının ekosistemdeki verisini siler/anonimleştirir.
 *
 * KİMLİK (fail-closed):
 *   requireSession ile `pz_session` cookie'sinden `sub` doğrulanır. Kullanıcı
 *   YALNIZ KENDİ hesabını silebilir — silinecek kapsam tamamen session.sub'tan
 *   türetilir; gövdede hedef alınmaz. Geçerli oturum yoksa 401.
 *   (legacy key/HMAC yolu KASITLI dışarıda: anonim cihazın "hesap silmesi"
 *    olmaz; cihaz favori/sepeti owner_key=d:<uuid>'dir, b:<sub> değil.)
 *
 * KAPSAM (functions/_lib/account-delete.ts):
 *   • Silinir : mağazalar (KV+D1), ürünler, favoriler, sepet, siparişler, B2B,
 *               takım üyelikleri (tek sahipli şirket silinir, değilse devredilir).
 *   • Apple   : sub `apple_` ise refresh token Apple'da İPTAL edilir (Apple şartı)
 *               ve KV'deki token + profil kaydı silinir.
 *   • Korunur : legal_consents — kabul kanıtı (yasal saklama); user_email
 *               anonimleştirilir, user_sub + kayıt KORUNUR.
 *
 * 200 { ok: true, deleted: { ... } }
 * 401 oturum yok/geçersiz · 503 servis yapılandırılmamış.
 */

import { requireSession } from '../../_lib/require-session';
import { deleteAccountData, type KVLike } from '../../_lib/account-delete';
import type { D1Like } from '../../_lib/buyer';
import {
  isAppleOwnerSub,
  hasAppleKey,
  openToken,
  revokeAppleToken,
  appleKv,
  type AppleEnv,
} from '../../_lib/apple-auth';

interface Env extends AppleEnv {
  STORE_KV?: KVLike;
  STORE_WRITE_KEY?: string;
  MARKET_DB?: D1Like;
}
type Ctx = { request: Request; env: Env; fetchImpl?: typeof fetch };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export async function onRequestPost(ctx: Ctx): Promise<Response> {
  // Fail-closed: imzalama secret'ı yoksa oturum doğrulanamaz → 503.
  if (!ctx.env.STORE_WRITE_KEY) return json({ error: 'Service not configured' }, 503);
  // Silinecek hiçbir backing store yoksa anlamlı bir silme yapamayız → 503.
  if (!ctx.env.STORE_KV && !ctx.env.MARKET_DB) {
    return json({ error: 'Service not configured' }, 503);
  }

  // Kimlik: SADECE geçerli oturum. Anonim/legacy yol kabul EDİLMEZ (401).
  const nowSec = Math.floor(Date.now() / 1000);
  const session = await requireSession(ctx.request, ctx.env, nowSec);
  if (session instanceof Response) return session; // 401

  const sub = session.sub;
  if (!sub) return json({ error: 'Unauthorized' }, 401);

  const deleted = await deleteAccountData(sub, ctx.env.STORE_KV, ctx.env.MARKET_DB);

  let appleRevoked: boolean | undefined;
  if (isAppleOwnerSub(sub)) {
    appleRevoked = await revokeAppleAccount(ctx, sub, nowSec);
  }

  return json({ ok: true, deleted, ...(appleRevoked === undefined ? {} : { appleRevoked }) });
}

/**
 * Apple refresh token'ını iptal eder ve KV kayıtlarını temizler.
 * Token yoksa (eski giriş / anahtar yapılandırılmadan önce) iptal edilecek bir şey yok → true.
 * Ağ hatası silmeyi BLOKLAMAZ: kullanıcı verisi zaten silindi; sonuç yanıtta raporlanır.
 */
async function revokeAppleAccount(ctx: Ctx, sub: string, nowSec: number): Promise<boolean> {
  const kv = ctx.env.STORE_KV;
  if (!kv) return false;
  const sealed = await kv.get(appleKv.refreshToken(sub));
  let ok = true;
  if (sealed) {
    const rt = await openToken(sealed, ctx.env.STORE_WRITE_KEY!);
    if (rt && hasAppleKey(ctx.env)) {
      try {
        ok = await revokeAppleToken(ctx.env, rt, nowSec, ctx.fetchImpl);
      } catch (e) {
        console.error('apple revoke failed:', e);
        ok = false;
      }
    } else {
      ok = false;
    }
  }
  await kv.delete(appleKv.refreshToken(sub));
  await kv.delete(appleKv.profile(sub));
  return ok;
}
