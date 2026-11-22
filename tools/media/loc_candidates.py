"""MEDIA-ILL-01: gather public-domain image candidates from the Library of Congress (loc.gov JSON API).

  python3 -I tools/media/loc_candidates.py <workdir> <subjects.json> [only-key-substring]

subjects.json: [{"key": "illustration_building:railway", "queries": [["railroad train", "detroit publishing company"], ["locomotive", null]], "to": 1925}, ...]
Each query is [text, collection facet or null]. Writes <workdir>/loc_<key>.json (candidates) and
<workdir>/sheet_<key>.jpg (numbered contact sheet) for human review. Rights are NOT decided here: the
ingest step (oa_ingest.py) re-reads each chosen item and accepts only "No known restrictions" items.
"""
import json, os, sys, time, urllib.parse, urllib.request
from io import BytesIO
from PIL import Image, ImageDraw

UA = {'User-Agent': 'Victori3MobileAssetBot/0.1 (open-access image research for an educational game)'}
WORK = sys.argv[1]; SUBJ = json.load(open(sys.argv[2])); ONLY = sys.argv[3] if len(sys.argv) > 3 else ''

def get(url, binary=False, tries=3):
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40) as r:
                data = r.read()
                return data if binary else json.loads(data)
        except Exception as e:  # noqa: BLE001
            if i == tries - 1: print('  fail', url[:100], e); return None
            time.sleep(2 * (i + 1))

def year(s):
    try: return int(str(s)[:4])
    except Exception: return None

for s in SUBJ:
    key = s['key']
    if ONLY and ONLY not in key: continue
    cands, seen = [], set()
    for q, coll in s['queries']:
        params = {'q': q, 'fo': 'json', 'c': 25}
        if coll: params['fa'] = 'partof:' + coll
        res = get('https://www.loc.gov/photos/?' + urllib.parse.urlencode(params)) or {}
        for r in res.get('results', []):
            iid = r.get('id'); imgs = r.get('image_url') or []
            y = year(r.get('date'))
            if not iid or iid in seen or not imgs or (y and y > s.get('to', 1925)): continue
            seen.add(iid)
            cands.append({'id': iid, 'title': r.get('title'), 'date': r.get('date'), 'query': q, 'thumb': imgs[0].split('#')[0], 'large': imgs[-1].split('#')[0], 'partof': (r.get('partof') or [])[:4]})
        time.sleep(0.5)
    cands = cands[:30]; tiles = []
    for i, c in enumerate(cands):
        data = get(c['thumb'], binary=True)
        if not data: continue
        try: im = Image.open(BytesIO(data)).convert('RGB'); im.thumbnail((300, 220))
        except Exception: continue
        c['idx'] = i; tiles.append((i, im))
    sheet = Image.new('RGB', (6 * 310, max(1, (len(tiles) + 5) // 6) * 250), (20, 20, 20)); d = ImageDraw.Draw(sheet)
    for n, (i, im) in enumerate(tiles):
        x, y = (n % 6) * 310 + 5, (n // 6) * 250 + 5
        sheet.paste(im, (x, y)); d.rectangle([x, y, x + 30, y + 18], fill=(0, 0, 0)); d.text((x + 4, y + 3), str(i), fill=(255, 220, 120))
    name = key.split(':')[1]
    sheet.save(os.path.join(WORK, f'sheet_{name}.jpg'), quality=82)
    json.dump([c for c in cands if 'idx' in c], open(os.path.join(WORK, f'loc_{name}.json'), 'w'), ensure_ascii=False, indent=1)
    print(key, len(tiles), flush=True)
