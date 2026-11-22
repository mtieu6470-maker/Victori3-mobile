"""MEDIA-ILL-01: gather public-domain (CC0) image candidates from open-access museum APIs.

  python3 -I tools/media/oa_candidates.py <workdir> <subjects.json>

subjects.json: [{"key": "illustration_building:railway", "queries": ["railway", "locomotive"], "from": 1820, "to": 1900}, ...]
For each subject it queries The Met (collection API v1.1, isPublicDomain) and the Art Institute of Chicago
(is_public_domain), keeps works dated within [from, to] with an image, downloads small thumbnails into
<workdir>/thumbs and writes <workdir>/candidates.json plus one contact sheet per subject for human review.
Nothing is added to the game by this tool: a person (Claude) selects and the selection is recorded with
full provenance by tools/media/oa_ingest.py.
"""
import json, os, sys, time, urllib.parse, urllib.request
from io import BytesIO
from PIL import Image, ImageDraw

UA = {'User-Agent': 'Victori3MobileAssetBot/0.1 (open-access image research for an educational game)'}
WORK = sys.argv[1]; SUBJ = json.load(open(sys.argv[2]))
os.makedirs(os.path.join(WORK, 'thumbs'), exist_ok=True)

def get(url, binary=False, tries=3):
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40) as r:
                data = r.read()
                return data if binary else json.loads(data)
        except Exception as e:  # noqa: BLE001
            if i == tries - 1: print('  fail', url[:90], e); return None
            time.sleep(1.5 * (i + 1))

def met(q, lo, hi, n=14):
    out = []
    s = get('https://collectionapi.metmuseum.org/public/collection/v1.1/search?' + urllib.parse.urlencode({'q': q, 'hasImages': 'true', 'isPublicDomain': 'true', 'limit': 40}))
    for oid in (s or {}).get('objectIDs', [])[:40]:
        o = get(f'https://collectionapi.metmuseum.org/public/collection/v1/objects/{oid}')
        if not o or not o.get('isPublicDomain') or not o.get('primaryImageSmall'): continue
        if not (lo <= (o.get('objectBeginDate') or 0) <= hi): continue
        out.append({'repo': 'The Metropolitan Museum of Art', 'id': f'met:{oid}', 'title': o.get('title'), 'date': o.get('objectDate'),
                    'artist': o.get('artistDisplayName') or None, 'page': o.get('objectURL'), 'thumb': o['primaryImageSmall'], 'full': o.get('primaryImage'),
                    'license': 'CC0 (Met Open Access, public domain)', 'medium': o.get('medium')})
        if len(out) >= n: break
        time.sleep(0.15)
    return out

def aic(q, lo, hi, n=14):
    url = 'https://api.artic.edu/api/v1/artworks/search?' + urllib.parse.urlencode({'q': q, 'limit': 60, 'fields': 'id,title,image_id,date_start,date_display,artist_display,is_public_domain,medium_display'})
    s = get(url); out = []
    for x in (s or {}).get('data', []):
        if not x.get('is_public_domain') or not x.get('image_id') or not (lo <= (x.get('date_start') or 0) <= hi): continue
        iid = x['image_id']
        out.append({'repo': 'Art Institute of Chicago', 'id': f"aic:{x['id']}", 'title': x.get('title'), 'date': x.get('date_display'), 'artist': x.get('artist_display'),
                    'page': f"https://www.artic.edu/artworks/{x['id']}", 'thumb': f'https://www.artic.edu/iiif/2/{iid}/full/400,/0/default.jpg',
                    'full': f'https://www.artic.edu/iiif/2/{iid}/full/1686,/0/default.jpg', 'license': 'CC0 (Art Institute of Chicago, public domain)', 'medium': x.get('medium_display')})
        if len(out) >= n: break
    return out

result = {}
for s in SUBJ:
    key = s['key']; cands = []; seen = set()
    for q in s['queries']:
        for c in met(q, s['from'], s['to']) + aic(q, s['from'], s['to']):
            if c['id'] in seen: continue
            seen.add(c['id']); cands.append(c)
    cands = cands[:24]
    tiles = []
    for i, c in enumerate(cands):
        data = get(c['thumb'], binary=True)
        if not data: continue
        try:
            im = Image.open(BytesIO(data)).convert('RGB'); im.thumbnail((300, 220))
        except Exception: continue
        c['idx'] = i; tiles.append((i, im))
    sheet = Image.new('RGB', (6 * 310, ((len(tiles) + 5) // 6) * 250 or 250), (20, 20, 20))
    d = ImageDraw.Draw(sheet)
    for n, (i, im) in enumerate(tiles):
        x, y = (n % 6) * 310 + 5, (n // 6) * 250 + 5
        sheet.paste(im, (x, y)); d.rectangle([x, y, x + 34, y + 20], fill=(0, 0, 0)); d.text((x + 4, y + 4), str(i), fill=(255, 220, 120))
    name = key.replace(':', '__')
    sheet.save(os.path.join(WORK, f'sheet_{name}.jpg'), quality=80)
    result[key] = [c for c in cands if 'idx' in c]
    print(key, len(result[key]), 'candidates')
json.dump(result, open(os.path.join(WORK, 'candidates.json'), 'w'), ensure_ascii=False, indent=1)
