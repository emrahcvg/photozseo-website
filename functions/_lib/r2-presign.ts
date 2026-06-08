/**
 * r2-presign.ts — R2 (S3-uyumlu) presigned URL üretimi.
 * Anahtar üretimi saf; imza aws4fetch ile SigV4. Worker runtime'da çalışır.
 */
import { AwsClient } from 'aws4fetch';

const SEGMENT_RE = /^[A-Za-z0-9:_-]+$/;

/** Tek bir anahtar segmenti güvenli mi (path traversal / slash engeli). */
export function isSafeKeySegment(seg: string): boolean {
  if (!seg || seg.length > 200) return false;
  return SEGMENT_RE.test(seg);
}

/** Asset için R2 nesne anahtarı. companyId/projectId/assetId çağıran tarafça doğrulanmalı. */
export function r2KeyForAsset(companyId: string, projectId: string, assetId: string, ext: string): string {
  const cleanExt = ext.replace(/^\./, '').toLowerCase();
  return `companies/${companyId}/projects/${projectId}/original/${assetId}.${cleanExt}`;
}

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
}

/** Presigned R2 URL üretir (PUT yükleme / GET indirme). */
export async function presignR2Url(
  cfg: R2Config,
  opts: { method: 'PUT' | 'GET'; key: string; expiresSeconds: number },
): Promise<string> {
  const client = new AwsClient({
    accessKeyId: cfg.accessKeyId,
    secretAccessKey: cfg.secretAccessKey,
    service: 's3',
    region: 'auto',
  });
  const endpoint = `https://${cfg.accountId}.r2.cloudflarestorage.com/${cfg.bucket}/${opts.key}`;
  const url = new URL(endpoint);
  url.searchParams.set('X-Amz-Expires', String(opts.expiresSeconds));
  const signed = await client.sign(new Request(url, { method: opts.method }), { aws: { signQuery: true } });
  return signed.url;
}
