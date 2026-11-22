"""MEDIA-ILL-01: ingest reviewed Library of Congress photographs/prints as game illustrations.

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
import datetime, json, os, re, sys, time, urllib.request
from io import BytesIO
from pathlib import Path
from PIL import Image, ImageOps

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

def main():
    sel = json.load(open(sys.argv[1], encoding='utf-8'))
    only = sys.argv[sys.argv.index('--only') + 1] if '--only' in sys.argv else None
    manifest = json.loads(MANIFEST.read_text(encoding='utf-8'))
    for e in sel['selections']:
        if only and e['subject'] != only: continue
        item_id = e['loc_item']
        rec = get(f'https://www.loc.gov/item/{item_id}/?fo=json'); it = rec['item']
        rights = it.get('rights_advisory') or ''
        if isinstance(rights, list): rights = ' '.join(rights)
        if 'no known restrictions' not in rights.lower(): raise SystemExit(f'{item_id}: rights not cleared: {rights!r}')
        dated = ' '.join(it.get('created_published') or []) + ' ' + str(it.get('date') or '')
        y = latest_year(dated)
        if y is None or y >= PD_CUTOFF: raise SystemExit(f'{item_id}: date {dated!r} not before {PD_CUTOFF}')
        jpgs = [u.split('#')[0] for u in (rec.get('image_url') or it.get('image_url') or []) if '.jpg' in u]
        src = jpgs[-1]
        im = Image.open(BytesIO(get(src, binary=True))).convert('RGB'); W, H = im.size
        l, t, r, b = e.get('inset', [0.04, 0.04, 0.04, 0.04])
        im = im.crop((round(W * l), round(H * t), round(W * (1 - r)), round(H * (1 - b))))
        w, h = im.size; fx, fy = e.get('focus', [0.5, 0.5])
        if w / h > 16 / 9: cw, ch = round(h * 16 / 9), h
        else: cw, ch = w, round(w * 9 / 16)
        x0 = min(max(0, round(fx * w - cw / 2)), w - cw); y0 = min(max(0, round(fy * h - ch / 2)), h - ch)
        im = ImageOps.autocontrast(im.crop((x0, y0, x0 + cw, y0 + ch)), cutoff=0.3)
        rel_dir = f"content/illustrations/{DIRS[e['type']]}"
        large_rel, small_rel = f"{rel_dir}/{e['subject']}.webp", f"{rel_dir}/{e['subject']}_480.webp"
        (ROOT / 'public' / rel_dir).mkdir(parents=True, exist_ok=True)
        im.resize((1280, 720), Image.Resampling.LANCZOS).save(ROOT / 'public' / large_rel, 'WEBP', quality=80, method=6)
        im.resize((480, 270), Image.Resampling.LANCZOS).save(ROOT / 'public' / small_rel, 'WEBP', quality=80, method=6)
        credit_line = 'Library of Congress, Prints & Photographs Division'
        for p in (it.get('rights') or []):
            m = re.search(r'Credit Line:\s*([^<]+)', p)
            if m: credit_line = m.group(1).strip().rstrip('.'); break
        asset = {
            'id': f"ill_{e['subject']}", 'type': e['type'], 'subject': e['subject'], 'name': e['name'], 'description': e['description'],
            'path': large_rel, 'thumbnail_path': small_rel, 'width': 1280, 'height': 720,
            'period': e.get('period', {'from': None, 'to': None}), 'quality': 'supported',
            'date': (it.get('created_published') or [None])[0],
            'source': {'repository': 'Library of Congress', 'file': src, 'page': f'https://www.loc.gov/item/{item_id}/',
                       'statement': f"LoC {it.get('call_number') or ''}".strip(), 'title': it.get('title'), 'source_pixels': [W, H],
                       'crop': {'inset': [l, t, r, b], 'focus': [fx, fy]}},
            'license': {'short': 'Public domain', 'url': 'https://www.loc.gov/legal/', 'attribution_required': False, 'rights_advisory': rights.strip()},
            'author': '; '.join(it.get('contributor_names') or []) or None,
            'credit': credit_line,
            'review': {'reviewed_by': 'Claude (Project Director)', 'reviewed': datetime.date.today().isoformat(), 'note': e.get('review_note', '')},
        }
        key = (e['type'], e['subject'])
        manifest['assets'] = [a for a in manifest['assets'] if (a['type'], a['subject']) != key] + [asset]
        print('ok', e['subject'], item_id, f'{W}x{H}', y, flush=True)
    manifest['assets'].sort(key=lambda a: (a['type'], a['subject']))
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

main()
