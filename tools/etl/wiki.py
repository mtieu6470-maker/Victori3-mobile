"""Small, polite client for the Wikimedia APIs (Wikipedia, Wikidata, Commons) used by the identity/asset ETL.

Every response is cached under tools/etl/.cache/wiki (git-ignored) keyed by URL, so re-runs are offline and
reproducible. Requests carry a descriptive User-Agent and are spaced out, per
https://www.mediawiki.org/wiki/API:Etiquette ; HTTP 429/5xx are retried with backoff.
"""
import hashlib, json, os, time, urllib.parse, urllib.request, urllib.error

UA = 'CurrentsOfHistoryETL/0.2 (https://github.com/mtieu6470-maker/Victori3-mobile; offline game data build)'
CACHE = os.path.join(os.path.dirname(__file__), '.cache', 'wiki')
os.makedirs(CACHE, exist_ok=True)
_last = [0.0]


class RateLimited(Exception):
    pass


def _get(url: str, binary=False, min_gap=1.0, attempts=8):
    key = hashlib.sha1(url.encode()).hexdigest()
    path = os.path.join(CACHE, key + ('.bin' if binary else '.json'))
    if os.path.exists(path):
        with open(path, 'rb') as f:
            data = f.read()
        return data if binary else json.loads(data)
    for attempt in range(attempts):
        wait = _last[0] + min_gap - time.time()
        if wait > 0:
            time.sleep(wait)
        _last[0] = time.time()
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': 'application/json', 'Accept-Encoding': 'identity'})
            with urllib.request.urlopen(req, timeout=60) as r:
                data = r.read()
            with open(path, 'wb') as f:
                f.write(data)
            return data if binary else json.loads(data)
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504):
                if attempt == attempts - 1:
                    raise RateLimited(url)
                ra = e.headers.get('retry-after') if e.headers else None
                time.sleep(min(90, max(float(ra) if ra and ra.isdigit() else 0, 2 ** attempt * 2) + 1))
                continue
            raise
        except (urllib.error.URLError, TimeoutError):
            time.sleep(2 ** attempt)
    raise RuntimeError('failed: ' + url)


def api(host: str, **params):
    params.setdefault('format', 'json')
    params.setdefault('formatversion', '2')
    return _get(f'https://{host}/w/api.php?' + urllib.parse.urlencode(params))


def download(url: str) -> bytes:
    return _get(url, binary=True, min_gap=1.5, attempts=4)


def chunks(xs, n):
    for i in range(0, len(xs), n):
        yield xs[i:i + n]


def resolve_titles(titles, lang='en'):
    """title -> {'title': canonical, 'qid': Q.., 'missing': bool}"""
    out = {}
    for part in chunks(list(dict.fromkeys(titles)), 50):
        d = api(f'{lang}.wikipedia.org', action='query', titles='|'.join(part), redirects=1, prop='pageprops', ppprop='wikibase_item')
        q = d['query']
        norm = {n['from']: n['to'] for n in q.get('normalized', [])}
        redir = {n['from']: n['to'] for n in q.get('redirects', [])}
        pages = {p['title']: p for p in q['pages']}
        for t in part:
            c = norm.get(t, t); c = redir.get(c, c)
            p = pages.get(c)
            out[t] = {'title': c, 'qid': (p or {}).get('pageprops', {}).get('wikibase_item'), 'missing': not p or p.get('missing', False)}
    return out


def entities(qids, props='claims|labels|descriptions|sitelinks', languages='en|vi'):
    out = {}
    for part in chunks(list(dict.fromkeys(qids)), 50):
        d = api('www.wikidata.org', action='wbgetentities', ids='|'.join(part), props=props, languages=languages)
        out.update(d.get('entities', {}))
    return out


def claim_values(ent, pid):
    """[(value, qualifiers{pid: [values]}, rank)] for a Wikidata claim."""
    res = []
    for c in ent.get('claims', {}).get(pid, []):
        snak = c.get('mainsnak', {})
        if snak.get('snaktype') != 'value':
            continue
        v = snak['datavalue']['value']
        quals = {}
        for qp, qs in c.get('qualifiers', {}).items():
            quals[qp] = [q['datavalue']['value'] for q in qs if q.get('snaktype') == 'value']
        res.append((v, quals, c.get('rank')))
    return res


def year_of(time_value):
    """Wikidata time value -> (year, precision) or None."""
    if not isinstance(time_value, dict) or 'time' not in time_value:
        return None
    t = time_value['time']
    sign = -1 if t.startswith('-') else 1
    return sign * int(t[1:].split('-')[0]), time_value.get('precision', 9)


def iso_of(time_value):
    """Wikidata time -> 'YYYY-MM-DD' truncated to its precision."""
    if not isinstance(time_value, dict):
        return None
    t = time_value['time'].lstrip('+')
    p = time_value.get('precision', 9)
    y, m, d = t[:10].split('-') if not t.startswith('-') else (t[:5], '00', '00')
    if p >= 11:
        return f'{y}-{m}-{d}'
    if p == 10:
        return f'{y}-{m}'
    return y
