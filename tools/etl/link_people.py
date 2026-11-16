"""Link every historical person in the database (heads of state with their successions, heads of government, heirs)
to a Wikidata item, verified against the dates already researched in the database.

Match rules (evidence kept in the output):
  strong  – the candidate is a human and birth and/or death year agree within 1 year with the database record;
  weak    – no dates in the database; exactly one human candidate whose lifetime covers the start of office and
            whose description mentions the office / country; kept as 'uncertain';
  none    – anything else (the person stays unlinked and is listed).
A candidate whose recorded birth or death year differs by more than 2 years is always rejected.

Output: historical_data/identity/people_links.json      python3 tools/etl/link_people.py
"""
import json, os, re, sys, unicodedata
sys.path.insert(0, os.path.dirname(__file__))
from wiki import api, entities, claim_values, year_of, iso_of

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
def add(eid, name, role, title=None, born=None, died=None, frm=None, to=None, source=None):
    if not name:
        return
    k = key(eid, name)
    p = people.setdefault(k, {'id': k, 'entity': eid, 'name': name, 'roles': [], 'title': title, 'born': born, 'died': died, 'terms': []})
    if role not in p['roles']:
        p['roles'].append(role)
    p['born'] = p['born'] or born; p['died'] = p['died'] or died; p['title'] = p['title'] or title
    if frm:
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


search = {}
for p in people.values():
    cands = []
    for v in variants(p['name']):
        for lang in ('en', 'vi') if re.search(r'[^\x00-\x7f]', v) else ('en',):
            d = api('www.wikidata.org', action='wbsearchentities', search=v, language=lang, uselang='en', type='item', limit=8)
            cands += [x['id'] for x in d.get('search', [])]
    search[p['id']] = list(dict.fromkeys(cands))[:14]

allq = sorted({q for v in search.values() for q in v})
ents = entities(allq, props='claims|labels|descriptions|sitelinks', languages='en|vi')

out = {}
for p in people.values():
    eb, ed = yr(p['born']), yr(p['died'])
    start = min((yr(t['from']) for t in p['terms'] if yr(t['from'])), default=None)
    ent = E[p['entity']]
    words = {w.lower() for w in re.findall(r'[A-Za-zÀ-ỹ]{4,}', (ent['en'] or '') + ' ' + (p['title'] or '')) if w.lower() not in {'kingdom', 'empire', 'state', 'republic', 'principality', 'duchy', 'grand', 'free', 'city', 'under', 'with'}}
    best = None; humans = []
    for q in search[p['id']]:
        e = ents.get(q)
        if not e or 'claims' not in e:
            continue
        if not any(v.get('id') == 'Q5' for v, _, _ in claim_values(e, 'P31')):
            continue
        b = next((year_of(v) for v, _, _ in claim_values(e, 'P569') if year_of(v)), None)
        d = next((year_of(v) for v, _, _ in claim_values(e, 'P570') if year_of(v)), None)
        by, dy = (b[0] if b else None), (d[0] if d else None)
        if (eb and by and abs(eb - by) > 2) or (ed and dy and abs(ed - dy) > 2):
            continue
        score = (3 if eb and by and abs(eb - by) <= 1 else 0) + (3 if ed and dy and abs(ed - dy) <= 1 else 0)
        desc = (e.get('descriptions', {}).get('en', {}).get('value') or '').lower()
        hit = any(w in desc for w in words)
        alive = start is None or ((by is None or by < start) and (dy is None or dy >= start))
        if alive and (by or dy):
            humans.append((q, hit))
        if score and (best is None or score > best[1]):
            best = (q, score, 'strong')
    if not best and not eb and not ed:
        hits = [q for q, h in humans if h]
        if len(hits) == 1:
            best = (hits[0], 1, 'weak')
    rec = {**p, 'match': 'none', 'candidates': search[p['id']][:6]}
    if best:
        e = ents[best[0]]
        img = [v for v, _, r in claim_values(e, 'P18') if r != 'deprecated']
        rec.update({
            'match': best[2], 'qid': best[0],
            'label_en': e.get('labels', {}).get('en', {}).get('value'), 'label_vi': e.get('labels', {}).get('vi', {}).get('value'),
            'description_en': e.get('descriptions', {}).get('en', {}).get('value'), 'description_vi': e.get('descriptions', {}).get('vi', {}).get('value'),
            'wd_born': next((iso_of(v) for v, _, _ in claim_values(e, 'P569')), None), 'wd_died': next((iso_of(v) for v, _, _ in claim_values(e, 'P570')), None),
            'enwiki': e.get('sitelinks', {}).get('enwiki', {}).get('title'), 'viwiki': e.get('sitelinks', {}).get('viwiki', {}).get('title'),
            'image': img[0] if img else None,
        })
        del rec['candidates']
    out[p['id']] = rec

doc = {'description': 'Historical persons of the database linked to Wikidata (generated by tools/etl/link_people.py). match: strong = birth/death year agree with the database record; weak = undated record, single plausible candidate whose description names the office or country (treat as uncertain); none = not linked.',
       'source': {'id': 'wikidata', 'license': 'CC0-1.0'},
       'counts': {k: sum(1 for v in out.values() if v['match'] == k) for k in ('strong', 'weak', 'none')}, 'people': out}
json.dump(doc, open(os.path.join(ROOT, 'historical_data/identity/people_links.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(doc['counts'], 'with image', sum(1 for v in out.values() if v.get('image')))
