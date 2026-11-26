"""Ana sayfa + bilgi sayfaları + alt bilgi bağlantılarını 13 dile çevirir ve site dosyalarını üretir.
Kullanım: python3 site.py <site_kökü> [dil ...]"""
import json, re, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from gt import translate_many

ROOT = Path(sys.argv[1])
LANGS = sys.argv[2:] or ['de', 'es', 'fr', 'it', 'pt', 'pl', 'ja', 'ko', 'zh', 'ar', 'hi', 'fa', 'ur']
EN = json.loads((Path(__file__).parent / 'en.json').read_text())
LOCAL_PATHS = ('download', 'pricing', 'about', 'marketplace-image-sizes', 'alternatives', 'privacy', 'support',
               'chrome-extension', 'terms', 'blog', 'accessibility', 'delete-account')
SKIP_KEYS = {'id', 'href', 'url', 'h1Line1Words', 'h1Line2Words', 'sublabel'}


def fix_link(lang):
    def f(u):
        m = re.match(r'^/(' + '|'.join(LOCAL_PATHS) + r')(\b.*)?$', u)
        return f'/{lang}{u}' if m else u
    return f


FIXED = {
    'Free': {'de': 'Kostenlos', 'es': 'Gratis', 'fr': 'Gratuit', 'it': 'Gratis', 'pt': 'Grátis', 'pl': 'Darmowy', 'ja': '無料',
             'ko': '무료', 'zh': '免费', 'ar': 'مجاني', 'hi': 'मुफ़्त', 'fa': 'رایگان', 'ur': 'مفت'},
    'About': {'de': 'Über uns', 'es': 'Acerca de', 'fr': 'À propos', 'it': 'Chi siamo', 'pt': 'Sobre', 'pl': 'O nas', 'ja': '会社概要',
              'ko': '소개', 'zh': '关于我们', 'ar': 'من نحن', 'hi': 'हमारे बारे में', 'fa': 'درباره ما', 'ur': 'ہمارے بارے میں'},
}
CUR_LANG = ['']
H1 = {
    'de': 'Einmal fotografieren. Auf 46 Marktplätzen verkaufen.',
    'es': 'Fotografía una vez. Vende en 46 marketplaces.',
    'fr': 'Photographiez une fois. Vendez sur 46 marketplaces.',
    'it': 'Scatta una volta. Vendi su 46 marketplace.',
    'pt': 'Fotografe uma vez. Venda em 46 marketplaces.',
    'pl': "Zrób zdjęcie raz. Sprzedawaj na 46 marketplace'ach.",
    'ja': '一度撮るだけ。46のマーケットプレイスで販売。',
    'ko': '한 번 촬영. 46개 마켓플레이스에서 판매.',
    'zh': '拍一次。卖遍 46 个电商平台。',
    'ar': 'صوّر مرة واحدة. بِع على 46 متجرًا إلكترونيًا.',
    'hi': 'एक बार फ़ोटो लें। 46 मार्केटप्लेस पर बेचें।',
    'fa': 'یک بار عکس بگیر. در ۴۶ بازارگاه بفروش.',
    'ur': 'ایک بار تصویر لیں۔ 46 مارکیٹ پلیسز پر بیچیں۔',
}


def collect(node, path, acc):
    if isinstance(node, str):
        if node in FIXED:
            return
        acc.append((path, node))
    elif isinstance(node, list):
        for i, v in enumerate(node):
            collect(v, path + [i], acc)
    elif isinstance(node, dict):
        for k, v in node.items():
            if k in SKIP_KEYS:
                continue
            if k == 'name' and v in ('Starter', 'Pro', 'Business'):
                continue
            collect(v, path + [k], acc)


def setp(root, path, val):
    for p in path[:-1]:
        root = root[p]
    root[path[-1]] = val


def localize(obj, lang):
    obj = json.loads(json.dumps(obj))
    def fx(n):
        if isinstance(n, dict):
            for k, v in n.items():
                if isinstance(v, str) and v in FIXED and not (k == 'name' and v in ('Starter', 'Pro', 'Business')):
                    n[k] = FIXED[v][lang]
                else:
                    fx(v)
        elif isinstance(n, list):
            for i, v in enumerate(n):
                if isinstance(v, str) and v in FIXED:
                    n[i] = FIXED[v][lang]
                else:
                    fx(v)
    fx(obj)
    acc = []
    collect(obj, [], acc)
    res = translate_many([s for _, s in acc], lang, fix_link(lang))
    for (p, _), r in zip(acc, res):
        setp(obj, p, r)
    return obj


def walk_hrefs(node, lang):
    if isinstance(node, dict):
        for k, v in node.items():
            if k == 'href' and isinstance(v, str):
                node[k] = fix_link(lang)(v)
            else:
                walk_hrefs(v, lang)
    elif isinstance(node, list):
        for v in node:
            walk_hrefs(v, lang)


gen = ROOT / 'src/i18n/pages/gen'
gen.mkdir(parents=True, exist_ok=True)
for lang in LANGS:
    print(f'== {lang}', flush=True)
    home = localize(EN['home'], lang)
    home['hero']['h1A11y'] = H1[lang]
    a11y = home['hero']['h1A11y']
    m = re.match(r'^(.+?[.。．!！।۔])\s*(.+)$', a11y)
    l1, l2 = (m.group(1), m.group(2)) if m else (a11y, '')
    split = (lambda s: list(s) if False else (s.split() if ' ' in s else [s]))
    home['hero']['h1Line1Words'] = split(l1)
    home['hero']['h1Line2Words'] = split(l2) if l2 else []
    home['bento']['langs']['sublabel'] = EN['home']['bento']['langs']['sublabel']
    # Uygulama içi bağlam: App Store rozet metinleri Apple'ın İngilizce rozetiyle aynı kalır.
    home['hero']['btnAppSmall'] = EN['home']['hero']['btnAppSmall']
    home['hero']['btnAppBig'] = EN['home']['hero']['btnAppBig']
    (ROOT / f'src/i18n/locales/{lang}.ts').write_text(
        "import type { HomeContent } from '../home';\n\n// Otomatik çeviri (scratchpad/i18n/site.py), kaynak: İngilizce içerik.\n"
        f"const c: HomeContent = {json.dumps(home, ensure_ascii=False, indent=2)};\n\nexport default c;\n")
    for slug, doc in EN['pages'].items():
        d = localize(doc, lang)
        walk_hrefs(d, lang)
        (gen / f'{slug}.{lang}.json').write_text(json.dumps(d, ensure_ascii=False, indent=1))
    nav = localize(EN['nav'], lang)
    walk_hrefs(nav, lang)
    (gen / f'nav.{lang}.json').write_text(json.dumps(nav, ensure_ascii=False, indent=1))
print('bitti')
