"""İngilizce blog yazılarını (src/content/blog/*.md) çevirip src/content/blog-i18n/<dil>/<slug>.md üretir.
Kullanım: python3 blog.py <site_kökü> [dil ...]"""
import json, re, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from gt import translate_many

ROOT = Path(sys.argv[1])
LANGS = sys.argv[2:] or ['tr', 'de', 'es', 'fr', 'it', 'pt', 'pl', 'ja', 'ko', 'zh', 'ar', 'hi', 'fa', 'ur']
SRC = ROOT / 'src/content/blog'
OUT = ROOT / 'src/content/blog-i18n'
LOCAL = ('download', 'pricing', 'about', 'marketplace-image-sizes', 'alternatives', 'privacy', 'support',
         'chrome-extension', 'terms', 'blog')


def fix_link(lang):
    def f(u):
        if re.match(r'^/(' + '|'.join(LOCAL) + r')(\b.*)?$', u):
            return f'/{lang}{u}'
        if u == '/' or u.startswith('/#'):
            return f'/{lang}{u}'
        return u
    return f


def parse(text):
    m = re.match(r'^---\n(.*?)\n---\n(.*)$', text, re.S)
    fm, body = m.group(1), m.group(2)
    meta = {'tldr': [], 'faqs': []}
    lines = fm.split('\n')
    i = 0
    cur = None
    while i < len(lines):
        ln = lines[i]
        if re.match(r'^(title|description|pubDate|readingMinutes|tags):', ln):
            k, v = ln.split(':', 1)
            meta[k] = v.strip()
            cur = None
        elif ln.startswith('tldr:'):
            cur = 'tldr'
        elif ln.startswith('faqs:'):
            cur = 'faqs'
        elif cur == 'tldr' and ln.strip().startswith('- '):
            meta['tldr'].append(yaml_str(ln.strip()[2:]))
        elif cur == 'faqs' and ln.strip().startswith('- q:'):
            meta['faqs'].append({'q': yaml_str(ln.split('q:', 1)[1].strip())})
        elif cur == 'faqs' and ln.strip().startswith('a:'):
            meta['faqs'][-1]['a'] = yaml_str(ln.split('a:', 1)[1].strip())
        i += 1
    for k in ('title', 'description'):
        meta[k] = yaml_str(meta[k])
    return meta, body


def yaml_str(v):
    v = v.strip()
    if v.startswith('"') and v.endswith('"'):
        return json.loads(v)
    if v.startswith("'") and v.endswith("'"):
        return v[1:-1].replace("''", "'")
    return v


def body_segments(body):
    """Gövdeyi satırlara ayırır; çevrilecek parçaları (index, önek, metin, sonek) olarak döndürür."""
    lines = body.split('\n')
    segs = []
    in_code = False
    for idx, ln in enumerate(lines):
        if ln.strip().startswith('```'):
            in_code = not in_code
            continue
        if in_code or not ln.strip():
            continue
        if ln.lstrip().startswith('|'):
            if re.match(r'^\s*\|[\s:\-|]+\|\s*$', ln):
                continue
            cells = ln.strip().strip('|').split('|')
            segs.append((idx, 'table', cells))
            continue
        m = re.match(r'^(\s*(?:#{1,6} |[-*] |\d+\. |> )?)(.*)$', ln)
        segs.append((idx, 'line', (m.group(1), m.group(2))))
    return lines, segs


def translate_post(path, lang):
    meta, body = parse(path.read_text())
    lines, segs = body_segments(body)
    strings = [meta['title'], meta['description']] + meta['tldr']
    for f in meta['faqs']:
        strings += [f['q'], f['a']]
    for _, kind, val in segs:
        if kind == 'table':
            strings += [c.strip() for c in val]
        else:
            strings.append(val[1])
    res = translate_many(strings, lang, fix_link(lang))
    it = iter(res)
    title, desc = next(it), next(it)
    tldr = [next(it) for _ in meta['tldr']]
    faqs = [{'q': next(it), 'a': next(it)} for _ in meta['faqs']]
    for idx, kind, val in segs:
        if kind == 'table':
            cells = [next(it) for _ in val]
            lines[idx] = '| ' + ' | '.join(c.replace('|', '/') for c in cells) + ' |'
        else:
            lines[idx] = val[0] + next(it)
    q = lambda s: json.dumps(s, ensure_ascii=False)
    fm = [f'title: {q(title)}', f'description: {q(desc)}', f"pubDate: {meta['pubDate']}",
          f"readingMinutes: {meta.get('readingMinutes', '4')}", f"tags: {meta.get('tags', '[]')}"]
    if tldr:
        fm.append('tldr:')
        fm += [f'  - {q(t)}' for t in tldr]
    if faqs:
        fm.append('faqs:')
        for f in faqs:
            fm.append(f"  - q: {q(f['q'])}")
            fm.append(f"    a: {q(f['a'])}")
    out = OUT / lang / path.name
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text('---\n' + '\n'.join(fm) + '\n---\n' + '\n'.join(lines))


posts = sorted(SRC.glob('*.md'))
for lang in LANGS:
    print(f'== {lang}', flush=True)
    for p in posts:
        translate_post(p, lang)
        print(f'   {p.name}', flush=True)
print('bitti')
