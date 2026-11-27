"""Bilgi görsellerini 15 dilde üretir: python3 -I scripts/figures/gen.py <site_kökü> [dil ...]
1) metinleri çevirir (scripts/i18n/gt.py, önbellekli)  2) HTML -> Chrome headless -> PNG -> WebP
3) src/i18n/figures.ts (alt/başlık/açıklama) üretir."""
import json, subprocess, sys, html, tempfile
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE)); sys.path.insert(0, str(HERE.parent / 'i18n'))
from data import FIGS, PLACEMENT
from gt import translate_many
from PIL import Image

ROOT = Path(sys.argv[1]).resolve()
ALL = ['en', 'tr', 'de', 'es', 'fr', 'it', 'pt', 'pl', 'ja', 'ko', 'zh', 'ar', 'hi', 'fa', 'ur']
LANGS = sys.argv[2:] or ALL
RTL = {'ar', 'fa', 'ur'}
OUT = ROOT / 'public/img/figures'
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
LOGO = (HERE / 'logo.png').resolve()
sys.stdout.reconfigure(line_buffering=True)
CACHE = HERE / 'i18n.json'
store = json.loads(CACHE.read_text()) if CACHE.exists() else {}
KEEP_KEYS = {'good', 'bad', 'type', 'shot', 'file', 'crop'}


def flat(o, path=()):
    """Çevrilecek (yol, metin) çiftleri; marka/dosya adı/kısa sembolleri atlar."""
    if isinstance(o, dict):
        for k, v in o.items():
            if k in KEEP_KEYS: continue
            yield from flat(v, path + (k,))
    elif isinstance(o, list):
        for i, v in enumerate(o):
            yield from flat(v, path + (i,))
    elif isinstance(o, str):
        # tablo satırlarının ilk sütunu (kanal/marka adı) çevrilmez; salt sembol de çevrilmez
        if len(path) >= 3 and path[0] == 'rows' and path[2] == 0: return
        if o.strip() in ('—', ''): return
        yield path, o


def setp(o, path, val):
    for p in path[:-1]: o = o[p]
    o[path[-1]] = val


def localize(fid, lang):
    import copy
    src = FIGS[fid]
    if lang == 'en':
        return copy.deepcopy(src)
    key = f'{fid}|{lang}'
    if key in store: return store[key]
    pairs = list(flat(src))
    res = translate_many([s for _, s in pairs], lang, None)
    d = copy.deepcopy(src)
    for (p, _), t in zip(pairs, res):
        setp(d, p, t)
    store[key] = d; CACHE.write_text(json.dumps(store, ensure_ascii=False, indent=1))
    return d


CSS = """
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1600px;height:900px;overflow:hidden}
body{background:radial-gradient(1100px 800px at 82% 40%,#26307a 0%,#0B0E1A 62%);color:#F5F7FB;
 font-family:-apple-system,'Helvetica Neue','Noto Sans',sans-serif;position:relative}
.brand{display:flex;align-items:center;gap:22px}
.brand img{border-radius:28px;box-shadow:0 10px 40px rgba(79,209,197,.30)}
.brand b{display:block;font-size:50px;letter-spacing:.3px;line-height:1.05}
.brand span{display:block;font-size:21px;color:#4FD1C5;font-weight:700;margin-top:6px;letter-spacing:.4px;text-transform:uppercase}
h1{font-weight:800}
.foot{position:absolute;left:72px;right:72px;bottom:30px;display:flex;justify-content:space-between;font-size:21px;color:#7F8BB0}
.teal{color:#4FD1C5}
/* geniş düzen (ekran görüntüsü yok) */
.wide{padding:44px 72px}
.wide .head{display:flex;justify-content:space-between;align-items:flex-start;gap:40px;margin-bottom:26px}
.wide h1{font-size:58px;line-height:1.1;margin-bottom:8px}.wide .sub{font-size:27px;color:#A9B4D0}
.wide .brand img{width:112px;height:112px}
.wide .brand b{font-size:44px}.wide .brand span{font-size:18px;white-space:nowrap}
.table{display:grid;grid-template-columns:1.35fr 1.25fr 1.4fr 1.6fr;border:1px solid #2a3566;border-radius:18px;overflow:hidden}
.table div{padding:17px 20px;font-size:24px;line-height:1.22;border-bottom:1px solid #1d2650;display:flex;align-items:center}
.table .h{background:#16204a;color:#4FD1C5;font-weight:700;font-size:21px;text-transform:uppercase;letter-spacing:.6px}
.table .n{font-weight:800;font-size:27px}.table .r{background:rgba(255,255,255,.03)}
.reasons{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.rs{background:#111836;border:1px solid #3b2540;border-radius:18px;padding:26px;min-height:238px}
.rs .x{width:48px;height:48px;border-radius:50%;background:rgba(248,113,113,.18);color:#F87171;font-weight:800;font-size:28px;display:flex;align-items:center;justify-content:center;margin-bottom:14px}
.rs h3{font-size:32px;margin-bottom:8px;line-height:1.2}.rs p{font-size:24px;color:#A9B4D0;line-height:1.35}
/* yan düzen (ekran görüntüsü sağda) */
.side .left{position:absolute;left:80px;top:52px;width:880px}
.side .brand{margin-bottom:26px}.side .brand img{width:120px;height:120px}
.side h1{font-size:62px;line-height:1.06;margin-bottom:10px}
.side .sub{font-size:28px;color:#B6C1DE;margin-bottom:28px;line-height:1.3}
.side .foot{right:auto;gap:30px}
.phone{position:absolute;right:96px;border-radius:44px;box-shadow:0 30px 90px rgba(0,0,0,.6),0 0 0 3px rgba(255,255,255,.12)}
[dir=rtl] .side .left{left:auto;right:80px;text-align:right}
[dir=rtl] .phone{right:auto;left:96px}
[dir=rtl] .foot{flex-direction:row-reverse}
[dir=rtl] .side .foot{left:auto;right:72px}
.chips{display:flex;flex-wrap:wrap;gap:14px;width:840px}
.chip{display:flex;align-items:center;gap:10px;padding:12px 22px;border-radius:999px;background:#131b45;border:1.5px solid #34408a;font-size:29px;font-weight:700}
.chip i{font-style:normal;width:32px;height:32px;border-radius:50%;background:#4FD1C5;color:#0B0E1A;font-size:20px;display:flex;align-items:center;justify-content:center;font-weight:800}
.pills{display:flex;align-items:center;gap:12px;margin:0 0 16px;flex-wrap:wrap}
.pill{padding:14px 26px;border-radius:16px;font-size:32px;font-weight:800;background:#4361EE}
.pill:nth-child(3){background:#0e8c80}.pill:nth-child(5){background:#7c3aed}.pill:nth-child(7){background:#d97706}
.plus{font-size:30px;color:#7F8BB0}
.ex{display:flex;flex-direction:column;gap:10px;margin-bottom:14px}
.box{border-radius:16px;padding:10px 22px;border:2px solid}
.box small{display:block;font-size:19px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;margin-bottom:4px}
.box code{font:700 28px 'SF Mono',Menlo,monospace;direction:ltr;display:block;unicode-bidi:isolate;text-align:left}
.ok{border-color:#34D399;background:rgba(52,211,153,.08)}.ok small{color:#34D399}
.no2{border-color:#F87171;background:rgba(248,113,113,.08)}.no2 small{color:#F87171}
.tips{display:grid;grid-template-columns:1fr 1fr;gap:6px 28px;font-size:22px;line-height:1.25;color:#D5DCF0}
.tips li{list-style:none;display:flex;gap:10px}.tips li:before{content:'✓';color:#4FD1C5;font-weight:800}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.col{background:#111836;border:1px solid #2a3566;border-radius:16px;overflow:hidden}
.col h3{background:#16204a;color:#4FD1C5;padding:12px 18px;font-size:27px}
.col ul{padding:10px 18px 14px}.col li{list-style:none;font-size:22px;line-height:1.25;padding:6px 0;display:flex;gap:10px;color:#E6EBFA}
.col li:before{content:'✓';color:#34D399;font-weight:800}
.steps{display:flex;flex-direction:column;gap:10px}
.step{display:flex;align-items:center;gap:18px;background:#111836;border:1px solid #2a3566;border-radius:16px;padding:8px 20px}
.step .no{flex:none;width:44px;height:44px;border-radius:50%;background:#4361EE;font-size:24px;font-weight:800;display:flex;align-items:center;justify-content:center}
.step p{font-size:27px;font-weight:700;line-height:1.2}
"""


def phone_img(d):
    sh = d['shot']; src = ROOT / 'public/screenshots/iphone' / sh['file']
    im = Image.open(src).convert('RGB')
    if 'crop' in sh: im = im.crop(tuple(sh['crop']))
    w, h = im.size
    H = 790 if 'crop' not in sh else 760
    im = im.resize((round(w * H / h), H), Image.LANCZOS)
    tmp = HERE / f'_shot_{sh["file"]}'; im.save(tmp.with_suffix('.png'))
    return tmp.with_suffix('.png'), H


def page(fid, d, lang):
    e = html.escape
    t = d['type']; dirattr = ' dir="rtl"' if lang in RTL else ''
    brand = (f'<div class="brand"><img src="file://{LOGO}" alt=""><div><b>photoZseo</b>'
             f'<span>SEO Product Photo · iPhone &amp; iPad</span></div></div>')
    foot = f'<div class="foot"><span class="teal">photozseo.com</span><span>{e(d["foot"])}</span></div>'
    if 'shot' not in d:
        if t == 'table':
            cells = ''.join(f'<div class="h">{e(h)}</div>' for h in d['head'])
            for i, r in enumerate(d['rows']):
                cls = ' r' if i % 2 else ''
                cells += f'<div class="n{cls}">{e(r[0])}</div>' + ''.join(f'<div class="{cls.strip()}">{e(c)}</div>' for c in r[1:])
            body = f'<div class="table">{cells}</div>'
        else:
            body = '<div class="reasons">' + ''.join(f'<div class="rs"><div class="x">✕</div><h3>{e(a)}</h3><p>{e(b)}</p></div>' for a, b in d['items']) + '</div>'
        inner = (f'<div class="head"><div><h1>{e(d["title"])}</h1><div class="sub">{e(d["subtitle"])}</div></div>{brand}</div>{body}')
        cls = 'wide'
        content = inner
    else:
        if t == 'cards':
            body = '<div class="chips">' + ''.join(f'<div class="chip"><i>{i+1}</i>{e(a)}</div>' for i, (a, _) in enumerate(d['items'])) + '</div>'
        elif t == 'formula':
            pills = '<span class="plus">+</span>'.join(f'<span class="pill">{e(p)}</span>' for p in d['parts'])
            body = (f'<div class="pills">{pills}</div><div class="ex"><div class="box ok"><small>{e(d["good_label"])}</small><code>{e(d["good"])}</code></div>'
                    f'<div class="box no2"><small>{e(d["bad_label"])}</small><code>{e(d["bad"])}</code></div></div>'
                    '<ul class="tips">' + ''.join(f'<li>{e(x)}</li>' for x in d['tips']) + '</ul>')
        elif t == 'columns':
            body = '<div class="cols">' + ''.join(f'<div class="col"><h3>{e(a)}</h3><ul>' + ''.join(f'<li>{e(x)}</li>' for x in b) + '</ul></div>' for a, b in d['cols']) + '</div>'
        else:  # flow
            body = '<div class="steps">' + ''.join(f'<div class="step"><div class="no">{i+1}</div><p>{e(sx)}</p></div>' for i, sx in enumerate(d['steps'])) + '</div>'
        png, H = phone_img(d)
        top = (900 - H) // 2
        content = (f'<div class="left">{brand}<h1>{e(d["title"])}</h1><div class="sub">{e(d["subtitle"])}</div>{body}</div>'
                  f'<img class="phone" style="top:{top}px;height:{H}px" src="file://{png}" alt="">')
        cls = 'side'
    return (f'<!doctype html><html lang="{lang}"{dirattr}><head><meta charset="utf-8"><style>{CSS}</style></head>'
            f'<body class="{cls}"{dirattr}>{content}{foot}</body></html>')


def render(fid, lang):
    d = localize(fid, lang)
    with tempfile.TemporaryDirectory() as td:
        h = Path(td) / 'f.html'; h.write_text(page(fid, d, lang), encoding='utf-8')
        png = Path(td) / 'f.png'
        subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1600,900',
                        '--virtual-time-budget=3000', f'--screenshot={png}', f'file://{h}'],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True, timeout=60)
        im = Image.open(png).convert('RGB')
        assert im.size == (1600, 900), im.size
        OUT.mkdir(parents=True, exist_ok=True)
        im.save(OUT / f'{fid}-{lang}.webp', 'WEBP', quality=82, method=6)
    return d


meta = {}
for fid in FIGS:
    for lang in ALL:
        d = localize(fid, lang)
        meta.setdefault(fid, {})[lang] = {'alt': d['alt'], 'caption': d['caption']}
for fid in FIGS:
    for lang in LANGS:
        render(fid, lang); print('ok', fid, lang, flush=True)
ts = ("// Otomatik üretilir: scripts/figures/gen.py — elle düzenlemeyin.\nimport type { Lang } from './ui';\n"
      "export const FIG_W = 1600;\nexport const FIG_H = 900;\n"
      "export const FIGURES: Record<string, Record<Lang, { alt: string; caption: string }>> = "
      + json.dumps(meta, ensure_ascii=False, indent=1) + ";\n"
      "export const FIGURE_PLACEMENT: Record<string, string> = " + json.dumps(PLACEMENT, indent=1) + ";\n")
(ROOT / 'src/i18n/figures.ts').write_text(ts, encoding='utf-8')
print('figures.ts yazıldı')
