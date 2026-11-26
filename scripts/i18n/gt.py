"""Ücretsiz Google çeviri ucu (clients5 dict-chrome-ex) + kalıcı önbellek + korumalı parçalar."""
import json, re, time, sys, urllib.request, urllib.parse, urllib.error
from pathlib import Path

CACHE_PATH = Path(__file__).parent / 'cache.json'
CACHE = json.loads(CACHE_PATH.read_text()) if CACHE_PATH.exists() else {}
GLANG = {'zh': 'zh-CN'}
BRANDS = ['photoZseo', 'App Store', 'Apple Intelligence', 'Foundation Models', 'Seller Central', 'Merchant Center',
          'Marketplace Learn', 'Trendyol Partner', 'Hepsiburada Merchant', 'TL;DR', 'iPadOS', 'iOS',
          'Walmart Marketplace', 'Google Shopping', 'Google Chrome', 'TikTok Shop', 'Facebook Shops', 'WhatsApp Catalog',
          'Mercado Libre', 'Global Sources', 'Made-in-China', 'Amazon.com.tr', 'Claid.ai', 'WooCommerce', 'AliExpress',
          'Amazon', 'eBay', 'Etsy', 'Shopify', 'Walmart', 'Trendyol', 'Hepsiburada', 'Temu', 'SHEIN', 'DHgate', 'Instagram',
          'Pinterest', 'WhatsApp', 'Photoroom', 'Canva', 'Pixelcut', 'Picsart', 'iPhone', 'iPad', 'Chrome', 'N11',
          'Çiçeksepeti', 'PttAVM', 'Pazarama', 'Allegro', 'Zalando', 'Otto', 'Kaufland', 'Noon', 'Shopee', 'Lazada',
          'Coupang', 'Flipkart', 'iCloud', 'RevenueCat', 'Firebase', 'Apple Vision', 'Google Images', 'Google', 'Apple']
PLAN_RE = re.compile(r'\b(Starter|Pro|Business)\b')
PRICE_RE = re.compile(r'\$\d[\d,]*(?:\.\d+)?')
LINK_RE = re.compile(r'\[([^\]]+)\]\(([^)\s]+)\)')
CODE_RE = re.compile(r'`[^`]+`')
_last = [0.0]


def _save():
    tmp = CACHE_PATH.with_suffix('.tmp')
    tmp.write_text(json.dumps(CACHE, ensure_ascii=False))
    tmp.replace(CACHE_PATH)


def _request(texts, lang):
    q = urllib.parse.urlencode([('client', 'dict-chrome-ex'), ('sl', 'en'), ('tl', GLANG.get(lang, lang))] + [('q', t) for t in texts])
    url = 'https://clients5.google.com/translate_a/t?' + q
    delay = 30
    while True:
        wait = 1.2 - (time.time() - _last[0])
        if wait > 0:
            time.sleep(wait)
        _last[0] = time.time()
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            res = json.loads(urllib.request.urlopen(req, timeout=40).read())
            out = []
            for r in res:
                out.append(r if isinstance(r, str) else r[0])
            if len(out) != len(texts):
                raise ValueError('count mismatch')
            return out
        except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError, ValueError) as e:
            print(f'  ! {lang} {e} — {delay}s bekleniyor', file=sys.stderr, flush=True)
            time.sleep(delay)
            delay = min(delay * 2, 900)


def translate_raw(texts, lang):
    """Önbellekli toplu çeviri (korumasız ham metinler)."""
    todo = [t for t in dict.fromkeys(texts) if f'{lang}\t{t}' not in CACHE and t.strip()]
    batch, size = [], 0
    def flush():
        nonlocal batch, size
        if not batch:
            return
        res = _request(batch, lang)
        for s, r in zip(batch, res):
            CACHE[f'{lang}\t{s}'] = r
        _save()
        batch, size = [], 0
    for t in todo:
        enc = len(urllib.parse.quote(t))
        if batch and size + enc > 6000:
            flush()
        batch.append(t)
        size += enc
    flush()
    return [CACHE.get(f'{lang}\t{t}', t) for t in texts]


def protect(s, lang=''):
    """Metni korumalı belirteçlere çevirir; (korumalı_metin, belirteçler, bağlantı_metinleri) döner."""
    toks = []
    links = []
    def add(v):
        toks.append(v)
        return f'ZQX{len(toks) - 1}Z'
    def link(m):
        links.append((len(toks), m.group(1), m.group(2)))
        return add(None)
    s = LINK_RE.sub(link, s)
    s = CODE_RE.sub(lambda m: add(m.group(0)), s)
    s = s.replace('**', '')
    s = PRICE_RE.sub(lambda m: add(m.group(0)), s)
    for b in (['photoZseo', 'App Store', 'TL;DR'] if lang == 'tr' else BRANDS):
        s = re.sub(r'(?<![\w.-])' + re.escape(b) + r'(?![\w-])', lambda m: add(m.group(0)), s)
    s = PLAN_RE.sub(lambda m: add(m.group(0)), s)
    return s, toks, links


def needs(s):
    return isinstance(s, str) and re.search(r'[A-Za-z]{2,}', LINK_RE.sub(r'\1', s) if s else '') is not None


SHOOT = [(r'\bShoot\b', 'Photograph'), (r'\bshoot\b', 'photograph'), (r'\bShooting\b', 'Photographing'),
         (r'\bshooting\b', 'photographing'), (r'\bshots\b', 'photos'), (r'\bshot\b', 'photo'), (r'\bShots\b', 'Photos'),
         (r'\bShot\b', 'Photo'), (r'\bshoots\b', 'photographs')]


def deshoot(s):
    if not isinstance(s, str):
        return s
    for a, b in SHOOT:
        s = re.sub(a, b, s)
    return s


def translate_many(strings, lang, link_fix=None):
    """Biçimli (markdown satır içi) metinleri çevirir, belirteçleri geri koyar."""
    strings = [deshoot(x) for x in strings]
    prepared = []
    for s in strings:
        if not needs(s):
            prepared.append((s, None, None, None))
            continue
        p, toks, links = protect(s, lang)
        prepared.append((s, p, toks, links))
    texts = []
    for s, p, toks, links in prepared:
        if p is None:
            continue
        texts.append(p)
        for _, lt, _ in links:
            texts.append(lt)
    res = dict(zip(texts, translate_raw(texts, lang)))
    out = []
    for s, p, toks, links in prepared:
        if p is None:
            out.append(s)
            continue
        t = res.get(p, p)
        for idx, lt, url in links:
            u = link_fix(url) if link_fix else url
            toks[idx] = f'[{res.get(lt, lt)}]({u})'
        ok = all((f'ZQX{i}Z' in t) or (toks[i] == '**' and (f'ZQO{i}Z' in t or f'ZQC{i}Z' in t)) for i in range(len(toks)))
        if not ok:
            # Belirteç kaybı: belirteçler arasındaki parçaları ayrı ayrı çevir, sırayla yeniden birleştir.
            parts = re.split(r'(ZQX\d+Z)', p)
            frags = [x for x in parts if x and not re.fullmatch(r'ZQX\d+Z', x) and re.search(r'[A-Za-z]{2,}', x)]
            fr = dict(zip(frags, translate_raw(frags, lang))) if frags else {}
            def keep_space(src, dst):
                lead = ' ' if src[:1] == ' ' and dst[:1] != ' ' else ''
                trail = ' ' if src[-1:] == ' ' and dst[-1:] != ' ' else ''
                return lead + dst + trail
            t = ''.join(keep_space(x, fr[x]) if x in fr else x for x in parts)
            print(f'  ~ parça çevirisi [{lang}]: {s[:60]}', file=sys.stderr)
        t = re.sub(r'ZQO\d+Z\s*', '**', t)
        t = re.sub(r'\s*ZQC\d+Z', '**', t)
        for i in range(len(toks) - 1, -1, -1):
            t = t.replace(f'ZQX{i}Z', toks[i])
        t = t.replace(' ', ' ')
        out.append(t)
    return out
