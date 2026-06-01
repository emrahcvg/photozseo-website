"""Website ui.ts eksik çevirilerini Google Translate ile doldurur."""
import re
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path.home() / 'Desktop/translation-swarm'))
from deep_translator import GoogleTranslator

UI_FILE = Path(__file__).parent / 'src/i18n/ui.ts'

LANGS = {
    'zh': 'zh-CN',
    'tr': 'tr',
    'es': 'es',
    'de': 'de',
    'ja': 'ja',
    'pt': 'pt',
    'hi': 'hi',
    'ur': 'ur',
    'ar': 'ar',
    'fa': 'fa',
    'ko': 'ko',
}

BRAND_TERMS = [
    'photoZseo', 'Quote Builder', 'Shopify', 'AirDrop', 'App Store',
    'Apple', 'iPhone', 'iPad', 'Mac', 'iCloud', 'WebP', 'SEO',
    'Amazon', 'Etsy', 'eBay', 'Walmart', 'TikTok', 'Instagram',
    'Pinterest', 'Trendyol', 'Hepsiburada', 'AliExpress', 'WooCommerce',
]


def extract_keys(content: str, lang: str) -> dict[str, str]:
    """Bir dil bloğundaki tüm 'key': 'value' çiftlerini çıkar."""
    # Dil bloğunu bul
    pattern = rf"^ {lang}: {{\n(.*?)^ }},"
    match = re.search(pattern, content, re.MULTILINE | re.DOTALL)
    if not match:
        # Son dil bloğu farklı kapanıyor olabilir
        pattern = rf"^ {lang}: {{\n(.*?)^ }}\n}} as const"
        match = re.search(pattern, content, re.MULTILINE | re.DOTALL)
    if not match:
        return {}

    block = match.group(1)
    result = {}
    # 'key': 'value' veya "key": "value" pattern
    for m in re.finditer(r"'([^']+)'\s*:\s*'((?:[^'\\]|\\.)*)'", block):
        result[m.group(1)] = m.group(2)
    return result


def find_lang_block_end(content: str, lang: str) -> int:
    """Dil bloğunun kapanış satırının pozisyonunu bul (son key'den önce ki })."""
    lines = content.split('\n')
    in_block = False
    block_start = -1

    for i, line in enumerate(lines):
        if re.match(rf'^ {lang}: {{', line):
            in_block = True
            block_start = i
            continue
        if in_block and re.match(r'^ },', line):
            # Bu satırın başlangıç pozisyonunu hesapla
            pos = sum(len(l) + 1 for l in lines[:i])
            return pos
        if in_block and re.match(r'^ }\n} as const', line):
            pos = sum(len(l) + 1 for l in lines[:i])
            return pos

    return -1


def protect(text: str) -> tuple[str, list[str]]:
    tokens = []
    for term in sorted(BRAND_TERMS, key=len, reverse=True):
        if term in text:
            idx = len(tokens)
            tokens.append(term)
            text = text.replace(term, f'__N{idx}__')
    return text, tokens


def restore(text: str, tokens: list[str]) -> str:
    for i, tok in enumerate(tokens):
        text = text.replace(f'__N{i}__', tok)
    return text


def translate(text: str, target_lang: str) -> str:
    if not text.strip():
        return text
    # HTML içeren veya çok kısa metinleri olduğu gibi bırak
    if len(text.strip()) <= 2:
        return text

    masked, tokens = protect(text)
    try:
        gt = GoogleTranslator(source='en', target=target_lang)
        result = gt.translate(masked)
        if result:
            return restore(result, tokens)
    except Exception as e:
        print(f'    [HATA] {e}')
    return text


def escape_ts(s: str) -> str:
    """TypeScript string literal için escape."""
    return s.replace('\\', '\\\\').replace("'", "\\'")


def main():
    content = UI_FILE.read_text(encoding='utf-8')

    # EN key'lerini çıkar
    en_keys = extract_keys(content, 'en')
    print(f'EN toplam key: {len(en_keys)}')

    total_added = 0

    for lang, google_code in LANGS.items():
        lang_keys = extract_keys(content, lang)
        missing = {k: v for k, v in en_keys.items() if k not in lang_keys}

        if not missing:
            print(f'  {lang}: zaten tam ✓')
            continue

        print(f'\n  {lang}: {len(missing)} eksik çeviriliyor...')

        new_lines = []
        for i, (key, value) in enumerate(missing.items()):
            translated = translate(value, google_code)
            escaped = escape_ts(translated)
            new_lines.append(f" '{key}': '{escaped}',")
            print(f'    [{i+1}/{len(missing)}] {key}: {translated[:50]}')
            time.sleep(0.15)  # rate limit

        # Dil bloğunun kapanışını bul ve eklemeler yap
        # Kapanış } satırını ara
        lines = content.split('\n')
        insert_idx = -1
        in_block = False
        for i, line in enumerate(lines):
            if re.match(rf'^ {re.escape(lang)}: {{', line):
                in_block = True
                continue
            if in_block and (re.match(r'^ },', line) or re.match(r'^ }$', line)):
                insert_idx = i
                break

        if insert_idx == -1:
            print(f'    [UYARI] {lang} bloğu bulunamadı, atlanıyor')
            continue

        insert_content = '\n'.join(new_lines)
        lines.insert(insert_idx, insert_content)
        content = '\n'.join(lines)
        total_added += len(missing)
        print(f'    {lang}: {len(missing)} çeviri eklendi ✓')

    UI_FILE.write_text(content, encoding='utf-8')
    print(f'\nTamamlandı. Toplam {total_added} çeviri eklendi.')


if __name__ == '__main__':
    main()
