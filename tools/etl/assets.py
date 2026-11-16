"""Licensed image assets from Wikimedia Commons -> game content pack.

Each asset keeps the provenance the specification asks for: Commons file page, Wikidata statement it came from,
author, licence (short name + URL), original size, applicable period, and the derived file actually shipped
(WebP, size, bytes). Files whose licence is not in ALLOWED are rejected and listed, never shipped.
"""
import html, io, json, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from wiki import api, download, chunks, _get, RateLimited
import urllib.error
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
CONTENT = os.path.join(ROOT, 'public', 'content')
ALLOWED = re.compile(r'^(public domain|pd\b|pd-|cc0|cc[ -]by(-sa)?[ -]\d|cc[ -]by(-sa)?$)', re.I)


def strip_html(s):
    s = re.sub(r'<[^>]+>', '', s or '')
    return re.sub(r'\s+', ' ', html.unescape(s)).strip()


def commons_info(files, width):
    """file title (without 'File:') -> imageinfo dict with extmetadata and a thumbnail of the given width."""
    out = {}
    for part in chunks(list(dict.fromkeys(files)), 40):
        d = api('commons.wikimedia.org', action='query', titles='|'.join('File:' + f for f in part), prop='imageinfo',
                iiprop='url|size|mime|extmetadata', iiurlwidth=str(width), iiextmetadatafilter='LicenseShortName|LicenseUrl|Artist|Credit|ImageDescription|DateTimeOriginal|Restrictions|UsageTerms|AttributionRequired')
        q = d['query']
        norm = {n['to']: n['from'] for n in q.get('normalized', [])}
        for p in q['pages']:
            name = norm.get(p['title'], p['title'])[5:]
            if p.get('missing') or not p.get('imageinfo'):
                out[name] = None
                continue
            out[name] = p['imageinfo'][0]
            out[name]['canonical'] = p['title'][5:]
    return out


def licence(ii):
    m = ii.get('extmetadata', {})
    g = lambda k: strip_html(m.get(k, {}).get('value', ''))
    return {'short': g('LicenseShortName'), 'url': m.get('LicenseUrl', {}).get('value'), 'author': g('Artist')[:200], 'credit': g('Credit')[:240],
            'description': g('ImageDescription')[:400], 'date': g('DateTimeOriginal')[:60], 'restrictions': g('Restrictions'),
            'attribution_required': g('AttributionRequired') == 'true'}


def allowed(lic):
    return bool(ALLOWED.match(lic['short'] or ''))


STEPS = (330, 250, 500, 120, 960)


def fetch_thumb(ii):
    """Commons thumbnail bytes, trying the standard thumbnail sizes that Wikimedia most likely already has cached
    (uncached renders and originals are what its rate limiter blocks first). Raises RateLimited if every size is
    blocked; the caller defers the file to a later run."""
    url = (ii.get('thumburl') or ii['url']).split('?')[0]
    if '/thumb/' not in url:   # small original: a single try, deferred if rate-limited (originals have long Retry-After)
        return _get(url, binary=True, min_gap=1.2, attempts=1)
    head, tail = url.rsplit('/', 1)
    name = tail.split('px-', 1)[1]
    last = None
    for w in STEPS:
        if w > ii.get('width', 99999) * 1.01 and not name.endswith('.png'):
            continue
        try:
            return _get(f'{head}/{w}px-{name}', binary=True, min_gap=1.2, attempts=1)
        except RateLimited as e:
            last = e
        except urllib.error.HTTPError as e:
            last = e
    raise RateLimited(url) if isinstance(last, RateLimited) or last is None else last


def store(ii, rel_path, max_w, max_h, flatten=None):
    """Download the Commons thumbnail, fit into max_w x max_h, save as WebP under public/content/<rel_path>."""
    raw = fetch_thumb(ii)
    im = Image.open(io.BytesIO(raw))
    if im.mode in ('P', 'LA', 'L'):
        im = im.convert('RGBA')
    if flatten and im.mode == 'RGBA':
        bg = Image.new('RGBA', im.size, flatten); bg.alpha_composite(im); im = bg.convert('RGB')
    im.thumbnail((max_w, max_h), Image.LANCZOS)
    path = os.path.join(CONTENT, rel_path)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, 'WEBP', quality=84, method=6)
    return {'path': 'content/' + rel_path.replace(os.sep, '/'), 'width': im.size[0], 'height': im.size[1], 'bytes': os.path.getsize(path), 'format': 'webp'}


def slug(s):
    return re.sub(r'[^a-z0-9]+', '_', s.lower()).strip('_')[:60]
