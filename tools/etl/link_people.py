"""Link every historical person in the database (heads of state with their successions, heads of government, heirs)
to a Wikidata item, verified against the dates already researched in the database.

Match rules (evidence kept in the output):
  strong  – the candidate is a human and birth and/or death year agree within 1 year with the database record;
  weak    – no dates in the database; exactly one human candidate whose lifetime covers the start of office and
            whose description mentions the office / country; kept as 'uncertain';
  none    – anything else (the person stays unlinked and is listed).
A candidate whose recorded birth or death year differs by more than 2 years is always rejected.

Candidates come from batched Wikidata Query Service lookups (exact label or alias, humans only).
Output: historical_data/identity/people_links.json      python3 tools/etl/link_people.py
"""
import json, os, re, sys, unicodedata
sys.path.insert(0, os.path.dirname(__file__))
from wiki import api

ROOT = os.path.join(os.path.dirname(__file__), '..', '..')
db = json.load(open(os.path.join(ROOT, 'src/generated/db.json'), encoding='utf-8'))
E = {e['id']: e for e in db['entities']}


def key(eid, name):
    s = unicodedata.normalize('NFKD', name).encode('ascii', 'ignore').decode().lower()
    return eid + ':' + re.sub(r'[^a-z0-9]+', '_', s).strip('_')


def yr(s):
    m = re.match(r'^-?\d{3,4}', s or '')
    return int(m.group(0)) if m else None


people = {}
def base(name):
    return re.sub(r'\s*\(.*\)\s*$', '', name).strip()

def add(eid, name, role, title=None, born=None, died=None, frm=None, to=None, source=None):
    """One record per person and entity: 'Minh Mạng' and 'Minh Mạng (Nguyễn Phúc Đảm)' are the same person."""
    if not name:
        return
    k = key(eid, base(name))
    p = people.setdefault(k, {'id': k, 'entity': eid, 'name': name, 'aliases': [], 'roles': [], 'title': title, 'born': born, 'died': died, 'terms': []})
    if name != p['name'] and name not in p['aliases']:
        p['aliases'].append(name)
    if role not in p['roles']:
        p['roles'].append(role)
    p['born'] = p['born'] or born; p['died'] = p['died'] or died; p['title'] = p['title'] or title
    if frm and not any(t['role'] == role and t['from'][:4] == str(frm)[:4] for t in p['terms']):
        p['terms'].append({'role': role, 'from': frm, 'to': to, 'source': source})

for eid, recs in db['leaders'].items():
    for r in recs:
        add(eid, r['name'], 'head_of_state', r.get('title'), r.get('born'), r.get('died'), r.get('from'), r.get('to'), 'leaders')
for e in db['entities']:
    h = (e.get('head_of_state') or {}).get('value')
    if h:
        add(e['id'], h['name'], 'head_of_state', h.get('title'), h.get('born'), None, h.get('since'), None, 'profile')
    p = e.get('profile') or {}
    pol = p.get('political') or {}
    hog = (pol.get('head_of_government') or {}).get('value') or p.get('hog')
    if isinstance(hog, dict) and hog.get('name'):
        add(e['id'], hog['name'], 'head_of_government', hog.get('title'), hog.get('born'), None, hog.get('since'), None, 'profile')
    heir = (pol.get('heir') or {}).get('value') or e.get('heir')
    if isinstance(heir, dict) and heir.get('name'):
        add(e['id'], heir['name'], 'heir', None, heir.get('born'))


def variants(name):
    out = [name]
    m = re.match(r'^(.*?)\s*\((.*?)\)\s*$', name)
    if m:
        out += [m.group(1).strip(), m.group(2).strip()]
    base = re.sub(r',.*$', '', name).strip()
    if base not in out:
        out.append(base)
    return [v for v in dict.fromkeys(out) if v]


# Candidate lookup: one SPARQL query per batch of names (exact English/Vietnamese label or alias, humans only),
# instead of one search request per name: the Wikidata API rate-limits shared addresses heavily.
import time, urllib.parse, urllib.request, urllib.error
from wiki import UA
CACHE_Q = os.path.join(os.path.dirname(__file__), '.cache', 'people_sparql')
os.makedirs(CACHE_Q, exist_ok=True)
QUERY = """SELECT ?name ?item ?birth ?death ?image ?descEn ?descVi ?labelEn ?labelVi ?enwiki ?viwiki WHERE {
 VALUES ?name { %s }
 ?item rdfs:label|skos:altLabel ?name . ?item wdt:P31 wd:Q5 .
 OPTIONAL { ?item wdt:P569 ?birth } OPTIONAL { ?item wdt:P570 ?death } OPTIONAL { ?item wdt:P18 ?image }
 OPTIONAL { ?item schema:description ?descEn FILTER(LANG(?descEn) = "en") }
 OPTIONAL { ?item schema:description ?descVi FILTER(LANG(?descVi) = "vi") }
 OPTIONAL { ?item rdfs:label ?labelEn FILTER(LANG(?labelEn) = "en") }
 OPTIONAL { ?item rdfs:label ?labelVi FILTER(LANG(?labelVi) = "vi") }
 OPTIONAL { ?enwiki schema:about ?item ; schema:isPartOf <https://en.wikipedia.org/> }
 OPTIONAL { ?viwiki schema:about ?item ; schema:isPartOf <https://vi.wikipedia.org/> }
}"""


def sparql(values, key):
    path = os.path.join(CACHE_Q, key + '.json')
    if os.path.exists(path):
        return json.load(open(path))
    body = urllib.parse.urlencode({'query': QUERY % values, 'format': 'json'}).encode()
    for attempt in range(40):
        try:
            req = urllib.request.Request('https://query.wikidata.org/sparql', data=body, headers={'User-Agent': UA, 'Accept': 'application/sparql-results+json', 'Content-Type': 'application/x-www-form-urlencoded'})
            rows = json.load(urllib.request.urlopen(req, timeout=120))['results']['bindings']
            json.dump(rows, open(path, 'w'))
            time.sleep(62)  # the query service currently allows about one request per minute
            return rows
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504):
                time.sleep(65); continue
            raise
    raise RuntimeError('query service unavailable')


def lit(s, lang):
    return '"' + s.replace('\\', '\\\\').replace('"', '\\"') + '"@' + lang

names = sorted({v for p in people.values() for n in [p['name']] + p['aliases'] for v in variants(n)})
vals = []
for n in names:
    vals.append(lit(n, 'en'))
    if re.search(r'[^\x00-\x7f]', n):
        vals.append(lit(n, 'vi'))
cand = {}   # name -> {qid: info}
for i in range(0, len(vals), 160):
    chunk = vals[i:i + 160]
    for b in sparql(' '.join(chunk), f'batch_{i // 160}_{len(chunk)}'):
        nm = b['name']['value']; q = b['item']['value'].rsplit('/', 1)[-1]
        rec = cand.setdefault(nm, {}).setdefault(q, {'births': set(), 'deaths': set(), 'images': set()})
        if 'birth' in b: rec['births'].add(b['birth']['value'][:10])
        if 'death' in b: rec['deaths'].add(b['death']['value'][:10])
        if 'image' in b: rec['images'].add(urllib.parse.unquote(b['image']['value'].rsplit('/', 1)[-1]).replace('_', ' '))
        for k in ('descEn', 'descVi', 'labelEn', 'labelVi'):
            if k in b: rec[k] = b[k]['value']
        for k in ('enwiki', 'viwiki'):
            if k in b: rec[k] = urllib.parse.unquote(b[k]['value'].rsplit('/wiki/', 1)[-1]).replace('_', ' ')

def by(s):
    m = re.match(r'^[+]?(-?\d{4})', s or '')
    return int(m.group(1)) if m else None

out = {}
for p in people.values():
    eb, ed = yr(p['born']), yr(p['died'])
    start = min((yr(t['from']) for t in p['terms'] if yr(t['from'])), default=None)
    ent = E[p['entity']]
    words = {w.lower() for w in re.findall(r'[A-Za-zÀ-ỹ]{4,}', (ent['en'] or '') + ' ' + (p['title'] or '')) if w.lower() not in {'kingdom', 'empire', 'state', 'republic', 'principality', 'duchy', 'grand', 'free', 'city', 'under', 'with'}}
    pool = {}
    for v in [x for n in [p['name']] + p['aliases'] for x in variants(n)]:
        for q, info in cand.get(v, {}).items():
            pool[q] = info
    best = None; humans = []
    for q, info in pool.items():
        bys = {by(x) for x in info['births'] if by(x)}; dys = {by(x) for x in info['deaths'] if by(x)}
        if (eb and bys and min(abs(eb - b) for b in bys) > 2) or (ed and dys and min(abs(ed - d) for d in dys) > 2):
            continue
        score = (3 if eb and bys and min(abs(eb - b) for b in bys) <= 1 else 0) + (3 if ed and dys and min(abs(ed - d) for d in dys) <= 1 else 0)
        desc = (info.get('descEn') or '').lower()
        hit = any(w in desc for w in words)
        b0 = min(bys) if bys else None; d0 = max(dys) if dys else None
        alive = start is None or ((b0 is None or b0 < start) and (d0 is None or d0 >= start))
        if alive and (b0 or d0):
            humans.append((q, hit))
        if score and (best is None or score > best[1]):
            best = (q, score, 'strong')
    if not best and not eb and not ed:
        hits = [q for q, h in humans if h]
        if len(hits) == 1:
            best = (hits[0], 1, 'weak')
    rec = {**p, 'match': 'none', 'candidates': sorted(pool)[:6]}
    if best:
        info = pool[best[0]]
        rec.update({
            'match': best[2], 'qid': best[0], 'label_en': info.get('labelEn'), 'label_vi': info.get('labelVi'),
            'description_en': info.get('descEn'), 'description_vi': info.get('descVi'),
            'wd_born': min(info['births']) if info['births'] else None, 'wd_died': max(info['deaths']) if info['deaths'] else None,
            'enwiki': info.get('enwiki'), 'viwiki': info.get('viwiki'),
            'image': sorted(info['images'])[0] if info['images'] else None,
        })
        del rec['candidates']
    out[p['id']] = rec

doc = {'description': 'Historical persons of the database linked to Wikidata (generated by tools/etl/link_people.py). match: strong = birth/death year agree with the database record; weak = undated record, single plausible candidate whose description names the office or country (treat as uncertain); none = not linked.',
       'source': {'id': 'wikidata', 'license': 'CC0-1.0'},
       'counts': {k: sum(1 for v in out.values() if v['match'] == k) for k in ('strong', 'weak', 'none')}, 'people': out}
json.dump(doc, open(os.path.join(ROOT, 'historical_data/identity/people_links.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(doc['counts'], 'with image', sum(1 for v in out.values() if v.get('image')))
