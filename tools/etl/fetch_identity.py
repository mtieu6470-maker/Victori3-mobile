"""Flags and coats of arms for every linked political entity (Wikidata P41 / P94 -> Wikimedia Commons).

Period rules (no anachronistic symbols are shipped silently):
  * a statement qualified with start/end time (P580/P582) keeps that period; it is shipped if the period overlaps
    1836-1936 and the game shows it only while the game date is inside it;
  * an unqualified statement is accepted only for historical polities whose lifetime is known and overlaps
    1836-1936 (the symbol then gets the polity's lifetime as period, quality 'uncertain' = period inferred);
  * unqualified symbols of present-day states, peoples, regions, eras and dynasties are rejected
    (they are usually modern symbols);
  * files listed in historical_data/assets/review.json -> reject are dropped with the reviewer's reason.
Output: historical_data/assets/identity_assets.json and public/content/identity/*.webp

    python3 tools/etl/fetch_identity.py
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from wiki import entities, claim_values, year_of
from assets import ROOT, commons_info, licence, allowed, store, slug
from wiki import RateLimited
import urllib.error

links = json.load(open(os.path.join(ROOT, 'historical_data/identity/wikidata_links.json'), encoding='utf-8'))['links']
review_path = os.path.join(ROOT, 'historical_data/assets/review.json')
review = json.load(open(review_path, encoding='utf-8')) if os.path.exists(review_path) else {'reject': {}}
db = json.load(open(os.path.join(ROOT, 'src/generated/db.json'), encoding='utf-8'))
names = {e['id']: (e['en'], e['vi']) for e in db['entities']}

linked = {k: v for k, v in links.items() if v.get('linked')}
ents = entities(sorted({v['qid'] for v in linked.values()}), props='claims')
MODERN = {'sovereign state', 'country', 'federated state of Germany', 'big city', 'state', 'republic'}

cands, rejected = [], []
for eid, l in linked.items():
    e = ents[l['qid']]
    historical = l['dissolved'] is not None or 'historical country' in l['instance_of'] or l['kind'] == 'future'
    modern = not historical and bool(MODERN & set(l['instance_of']))
    for pid, typ in (('P41', 'flag'), ('P94', 'coat_of_arms')):
        for val, q, rank in claim_values(e, pid):
            if rank == 'deprecated':
                continue
            st = [year_of(x) for x in q.get('P580', [])]; en = [year_of(x) for x in q.get('P582', [])]
            frm = st[0][0] if st and st[0] else None; to = en[0][0] if en and en[0] else None
            qualified = frm is not None or to is not None
            if not qualified:
                if l['kind'] in ('people', 'region', 'period', 'dynasty') or modern or not historical:
                    rejected.append({'entity': eid, 'type': typ, 'file': val, 'reason': f"unqualified {typ} on a {l['kind']} item ({', '.join(l['instance_of'][:2])}): likely not period-specific"})
                    continue
                frm, to, quality = l['inception'], l['dissolved'], 'uncertain'
            else:
                quality = 'supported'
            lo, hi = frm if frm is not None else -9999, to if to is not None else 9999
            if hi < 1836 or lo > 1936:
                rejected.append({'entity': eid, 'type': typ, 'file': val, 'reason': f'period {frm}-{to} outside 1836-1936'})
                continue
            note = None
            if val in review.get('period', {}):
                frm, to, note = review['period'][val]; quality = 'supported'
                lo, hi = frm, to
                if hi < 1836 or lo > 1936:
                    rejected.append({'entity': eid, 'type': typ, 'file': val, 'reason': 'review period outside 1836-1936'}); continue
            cands.append({'entity': eid, 'type': typ, 'file': val, 'from': frm, 'to': to, 'rank': rank, 'quality': quality, 'note': note,
                          'review_reject': review['reject'].get(val),
                          'statement': f"wikidata:{l['qid']}#{pid}"})

info = {}
for w, typ in ((320, 'flag'), (240, 'coat_of_arms')):
    info.update({(typ, k): v for k, v in commons_info([c['file'] for c in cands if c['type'] == typ], w).items()})

assets, deferred = [], []
for c in cands:
    if c.pop('review_reject', None):
        rejected.append({'entity': c['entity'], 'type': c['type'], 'file': c['file'], 'reason': 'review: ' + review['reject'][c['file']]}); continue
    ii = info.get((c['type'], c['file']))
    if not ii:
        rejected.append({**c, 'reason': 'file missing on Commons'}); continue
    lic = licence(ii)
    if not allowed(lic):
        rejected.append({**c, 'reason': 'licence not allowed: ' + lic['short']}); continue
    n = sum(1 for a in assets if a['entity'] == c['entity'] and a['type'] == c['type'])
    aid = f"{c['type']}.{c['entity']}.{n}"
    box = (300, 200) if c['type'] == 'flag' else (220, 260)
    try:
        shipped = store(ii, f"identity/{'flags' if c['type'] == 'flag' else 'arms'}/{c['entity']}_{n}.webp", *box)
    except (RateLimited, urllib.error.HTTPError):
        deferred.append({**c, 'reason': 'download rate-limited by Wikimedia; re-run to fetch'}); continue
    en, vi = names[c['entity']]
    assets.append({
        'id': aid, 'type': c['type'], 'entity': c['entity'],
        'name': ('Quốc kỳ' if c['type'] == 'flag' else 'Huy hiệu') + ' — ' + vi,
        'description': lic['description'] or ii['canonical'],
        'period': {'from': c['from'], 'to': c['to']}, 'quality': c['quality'], 'rank': c['rank'], 'review_note': c['note'],
        'source': {'repository': 'Wikimedia Commons', 'file': ii['canonical'], 'page': ii['descriptionurl'], 'statement': c['statement']},
        'license': {'short': lic['short'], 'url': lic['url'], 'attribution_required': lic['attribution_required']},
        'author': lic['author'], 'credit': lic['credit'], 'restrictions': lic['restrictions'] or None,
        'original': {'width': ii['width'], 'height': ii['height'], 'mime': ii['mime']},
        **shipped, 'fallback': 'emblem',
    })

os.makedirs(os.path.join(ROOT, 'historical_data/assets'), exist_ok=True)
doc = {'description': 'Flags and coats of arms shipped in the identity content pack (generated by tools/etl/fetch_identity.py). Period = years the symbol applies (null = open); the game shows a symbol only inside its period and falls back to the generated emblem otherwise.',
       'assets': assets, 'rejected': rejected, 'deferred': deferred}
json.dump(doc, open(os.path.join(ROOT, 'historical_data/assets/identity_assets.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
ent_with = {a['entity'] for a in assets}
print('assets', len(assets), 'entities with a symbol', len(ent_with), 'rejected', len(rejected), 'deferred', len(deferred), 'bytes', sum(a['bytes'] for a in assets))
