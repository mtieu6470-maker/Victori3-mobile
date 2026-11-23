"""MEDIA-ILL-01: ingest reviewed open-access illustrations (Library of Congress items and Wikimedia Commons files).

  python3 -I tools/media/loc_ingest.py <selection.json> [--only subject]

The selection (historical_data/assets/illustration_sources/loc_selection.json) is written by a person
after visual review of contact sheets (tools/media/loc_candidates.py). For every entry this tool:
  1. re-reads the item record from loc.gov and REFUSES it unless the rights advisory says
     "No known restrictions on publication" and the work is dated before (current year - 95);
  2. downloads the largest public JPEG derivative, trims plate borders (inset), cover-crops to 16:9
     around a reviewed focus point, and writes WebP 1280x720 + 480x270 under public/content/illustrations/;
  3. replaces the manifest entry for the same type:subject in historical_data/assets/illustration_assets.json
     with a full provenance record (source page, call number, rights statement, credit line).
"""
import datetime, html, json, os, re, sys, time, urllib.parse, urllib.request
from io import BytesIO
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / 'historical_data/assets/illustration_assets.json'
UA = {'User-Agent': 'Victori3MobileAssetBot/0.1 (open-access image research for an educational game)'}
DIRS = {'illustration_building': 'buildings', 'illustration_tech': 'technologies', 'illustration_event': 'events', 'illustration_company': 'companies', 'illustration_good': 'goods', 'illustration_era': 'eras'}
PD_CUTOFF = datetime.date.today().year - 95

def get(url, binary=False):
    for i in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
                b = r.read(); return b if binary else json.loads(b)
        except Exception as e:  # noqa: BLE001
            if i == 3: raise
            time.sleep(2 * (i + 1))

def latest_year(text):
    ys = [int(y) for y in re.findall(r'1[5-9]\d\d|20\d\d', text or '')]
    return max(ys) if ys else None

COMMONS_UA = {'User-Agent': 'Victori3MobileAssetBot/0.1 (educational game; open-access image research)'}
# Commons licence templates accepted as public domain / CC0. Anything else (CC BY-NC, fair use, ...) is refused.
COMMONS_OK = re.compile(r'\{\{\s*(PD-[A-Za-z0-9-]+|PD-Art|PD-Scan|CC0|Cc-zero|Public domain)[^}]*\}\}', re.I)

def fetch_loc(e):
    item_id = e['loc_item']
    rec = get(f'https://www.loc.gov/item/{item_id}/?fo=json'); it = rec['item']
    rights = it.get('rights_advisory') or ''
    if isinstance(rights, list): rights = ' '.join(rights)
    # Accepted statements: the Prints & Photographs advisory "No known restrictions on publication", or the
    # collection rights text "unaware of any copyright or other restrictions ... free to use and reuse"
    # (World Digital Library partner items). Anything else (e.g. "Rights status not evaluated") is refused.
    rights_text = re.sub('<[^>]+>', ' ', ' '.join(it.get('rights') or []))
    if 'no known restrictions' not in rights.lower() and 'unaware of any copyright or other restrictions' in rights_text and 'free to use and reuse' in rights_text:
        rights = re.search(r'The Library of Congress is unaware[^.]*\.[^.]*free to use and reuse\.', rights_text).group(0)
    if 'no known restrictions' not in rights.lower() and 'free to use and reuse' not in rights: return None, f'rights not cleared: {rights!r}'
    dated = ' '.join(it.get('created_published') or []) + ' ' + str(it.get('date') or '')
    y = latest_year(dated)
    if y is None or y >= PD_CUTOFF: return None, f'date {dated!r} not before {PD_CUTOFF}'
    jpgs = [u.split('#')[0] for u in (rec.get('image_url') or it.get('image_url') or []) if '.jpg' in u]
    src = jpgs[-1]
    credit_line = 'Library of Congress, Prints & Photographs Division'
    for p in (it.get('rights') or []):
        m = re.search(r'Credit Line:\s*([^<]+)', p)
        if m: credit_line = html.unescape(m.group(1)).strip().rstrip('.'); break
    return {'id': item_id, 'year': y, 'src': src, 'image': get(src, binary=True), 'date': (it.get('created_published') or [None])[0],
            'source': {'repository': 'Library of Congress', 'file': src, 'page': f'https://www.loc.gov/item/{item_id}/',
                       'statement': f"LoC {it.get('call_number') or ''}".strip(), 'title': it.get('title')},
            'license': {'short': 'Public domain', 'url': 'https://www.loc.gov/legal/', 'attribution_required': False, 'rights_advisory': rights.strip()},
            'author': '; '.join(it.get('contributor_names') or []) or None, 'credit': credit_line}, None

def fetch_commons(e):
    """Wikimedia Commons file: licence template re-read from the file's wikitext; image via thumb.php."""
    name = e['commons_file']; q = urllib.parse.quote(name)
    req = urllib.request.Request(f'https://commons.wikimedia.org/w/index.php?title=File:{q}&action=raw', headers=COMMONS_UA)
    wikitext = urllib.request.urlopen(req, timeout=60).read().decode('utf-8')
    lic = [m.group(0) for m in COMMONS_OK.finditer(wikitext)]
    if not lic or re.search(r'\{\{\s*cc-by-nc|non-?commercial|fair use', wikitext, re.I): return None, 'no public-domain/CC0 licence template'
    field = lambda k: (re.search(rf'\|\s*{k}\s*=\s*([^\n]*)', wikitext, re.I) or [None, ''])[1].strip()
    y = e.get('year') or latest_year(field('date'))
    # CG-52 (ChatGPT finding): a single 95-year cutoff also refused CC0 and US-government works, which are free
    # whatever their date. Rights classes:
    #   free at any date: CC0 / Cc-zero, PD-USGov*, PD-self / PD-author / PD-release (the author's own release);
    #   dated works (PD-old*, PD-Art, PD-Scan, country PD templates): before the cutoff, or after it only when the
    #   page ALSO carries a US public-domain template (PD-1996, PD-US-*) — public domain in the source country and
    #   in the United States. Anything else stays refused (pending manual review).
    tpl = ' '.join(lic)
    free_any_date = re.search(r'\{\{\s*(CC0|Cc-zero|PD-USGov[^|}]*|PD-self|PD-author|PD-release)', tpl, re.I)
    us_pd = re.search(r'\{\{\s*(PD-1996|PD-US-[A-Za-z-]+|PD-US)\b', wikitext, re.I)
    if not free_any_date:
        if y is None: return None, f'no date for a dated public-domain basis ({tpl})'
        if y >= PD_CUTOFF and not us_pd: return None, f'year {y} not before {PD_CUTOFF} and no US public-domain template ({tpl})'
    lic_short = 'CC0' if re.search(r'CC0|Cc-zero', tpl, re.I) else 'Public domain'
    time.sleep(4)
    src = f"https://commons.wikimedia.org/w/thumb.php?f={q}&w={e.get('width', 2000)}"
    img = urllib.request.urlopen(urllib.request.Request(src, headers=COMMONS_UA), timeout=90).read()
    clean = lambda t: re.sub(r'\{\{[^}]*\}\}|\[\[|\]\]|\[https?://\S+ ?|\]|\'\'', '', t).strip() or None
    return {'id': name, 'year': y, 'src': src, 'image': img, 'date': e.get('date') or clean(field('date')),
            'source': {'repository': 'Wikimedia Commons', 'file': name, 'page': f'https://commons.wikimedia.org/wiki/File:{q}',
                       'statement': ' '.join(lic), 'title': e['description'], 'original_source': clean(field('source'))},
            'license': {'short': lic_short, 'url': f'https://commons.wikimedia.org/wiki/File:{q}', 'attribution_required': False, 'rights_advisory': ' '.join(lic)},
            'author': e.get('author') or clean(field('author')), 'credit': e.get('credit') or f'Wikimedia Commons ({lic_short.lower()})'}, None

def main():
    sel = json.load(open(sys.argv[1], encoding='utf-8'))
    only = sys.argv[sys.argv.index('--only') + 1] if '--only' in sys.argv else None
    manifest = json.loads(MANIFEST.read_text(encoding='utf-8'))
    skipped = []
    for e in sel['selections']:
        if only and e['subject'] != only: continue
        meta, why = fetch_commons(e) if 'commons_file' in e else fetch_loc(e)
        if not meta: print(f"SKIP {e['subject']}: {why}"); skipped.append(e['subject']); continue
        item_id, y = meta['id'], meta['year']
        im = Image.open(BytesIO(meta['image'])).convert('RGB'); W, H = im.size
        l, t, r, b = e.get('inset', [0.04, 0.04, 0.04, 0.04])
        im = im.crop((round(W * l), round(H * t), round(W * (1 - r)), round(H * (1 - b))))
        w, h = im.size; fx, fy = e.get('focus', [0.5, 0.5])
        if w / h > 16 / 9: cw, ch = round(h * 16 / 9), h
        else: cw, ch = w, round(w * 9 / 16)
        x0 = min(max(0, round(fx * w - cw / 2)), w - cw); y0 = min(max(0, round(fy * h - ch / 2)), h - ch)
        if e.get('fit') == 'contain':
            # Whole work kept (prints with lettering, portrait formats): centred on a blurred, darkened copy.
            bg = im.copy(); bw, bh = bg.size; s_ = max(1280 / bw, 720 / bh)
            bg = bg.resize((round(bw * s_), round(bh * s_)), Image.Resampling.LANCZOS)
            bx, by = (bg.width - 1280) // 2, (bg.height - 720) // 2
            bg = ImageEnhance.Brightness(bg.crop((bx, by, bx + 1280, by + 720)).filter(ImageFilter.GaussianBlur(28))).enhance(0.45)
            fs = min(1280 / im.width, 720 / im.height, e.get('max_upscale', 1.5))
            fg = im.resize((round(im.width * fs), round(im.height * fs)), Image.Resampling.LANCZOS)
            bg.paste(fg, ((1280 - fg.width) // 2, (720 - fg.height) // 2)); im = bg
        else:
            im = ImageOps.autocontrast(im.crop((x0, y0, x0 + cw, y0 + ch)), cutoff=0.3)
        rel_dir = f"content/illustrations/{DIRS[e['type']]}"
        large_rel, small_rel = f"{rel_dir}/{e['subject']}.webp", f"{rel_dir}/{e['subject']}_480.webp"
        (ROOT / 'public' / rel_dir).mkdir(parents=True, exist_ok=True)
        im.resize((1280, 720), Image.Resampling.LANCZOS).save(ROOT / 'public' / large_rel, 'WEBP', quality=80, method=6)
        im.resize((480, 270), Image.Resampling.LANCZOS).save(ROOT / 'public' / small_rel, 'WEBP', quality=80, method=6)
        asset = {
            'id': f"ill_{e['subject']}", 'type': e['type'], 'subject': e['subject'], 'name': e['name'], 'description': e['description'],
            'path': large_rel, 'thumbnail_path': small_rel, 'width': 1280, 'height': 720,
            'period': e.get('period', {'from': None, 'to': None}), 'quality': 'supported', 'date': meta['date'],
            'source': {**meta['source'], 'source_pixels': [W, H], 'crop': {'inset': [l, t, r, b], 'focus': [fx, fy], 'fit': e.get('fit', 'cover')}},
            'license': meta['license'], 'author': meta['author'], 'credit': meta['credit'],
            'review': {'reviewed_by': 'Claude (Project Director)', 'reviewed': datetime.date.today().isoformat(), 'note': e.get('review_note', '')},
        }
        key = (e['type'], e['subject'])
        manifest['assets'] = [a for a in manifest['assets'] if (a['type'], a['subject']) != key] + [asset]
        print('ok', e['subject'], item_id, f'{W}x{H}', y, flush=True)
        time.sleep(1.0)
    manifest['assets'].sort(key=lambda a: (a['type'], a['subject']))
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    if skipped: print('skipped (not ingested):', skipped)

main()
