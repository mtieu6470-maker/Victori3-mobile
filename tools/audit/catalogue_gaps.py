"""Catalogue completeness check: political entities that Wikidata records as existing on 1 January 1836
(instance of a state / historical-country class, inception <= 1836, no dissolution before 1836) and that the
game's catalogue does not link to. Output is a review list, not an import: every candidate needs a historian's
decision (separate polity, subdivision, vassal folded into another entity, or not a polity in 1836).

    python3 tools/audit/catalogue_gaps.py   -> docs/audit/CATALOGUE_GAPS.md + docs/audit/catalogue_gaps.json
"""
import json, os, sys, time, urllib.parse, urllib.request, urllib.error
ROOT = os.path.join(os.path.dirname(__file__), '..', '..')
sys.path.insert(0, os.path.join(ROOT, 'tools', 'etl'))
from wiki import UA
sys.path.insert(0, os.path.join(ROOT, 'tools', 'audit'))

CLASSES = {'Q3024240': 'historical country', 'Q1250464': 'realm', 'Q417175': 'kingdom', 'Q28171280': 'ancient civilization', 'Q1763527': 'tribal chiefdom',
           'Q133442': 'colony', 'Q20202269': 'protectorate', 'Q7270': 'republic', 'Q6256': 'country', 'Q3624078': 'sovereign state', 'Q1307214': 'form of government',
           'Q1520223': 'constituent state', 'Q43702': 'federation', 'Q15634554': 'state with limited recognition', 'Q1371288': 'vassal state', 'Q12759805': 'sultanate',
           'Q154547': 'duchy', 'Q208500': 'principality', 'Q859563': 'emirate', 'Q1336152': 'princely state', 'Q164142': 'khanate', 'Q48349': 'empire'}
sparql = '''SELECT ?s ?sLabel ?inc ?dis ?coord (GROUP_CONCAT(DISTINCT STRAFTER(STR(?t), "entity/"); separator="|") AS ?types) WHERE {
 VALUES ?t { %s }
 ?s wdt:P31 ?t . ?s wdt:P571 ?inc . FILTER(YEAR(?inc) <= 1836)
 OPTIONAL { ?s wdt:P576 ?dis } FILTER(!BOUND(?dis) || YEAR(?dis) >= 1836)
 OPTIONAL { ?s wdt:P625 ?coord }
 SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} GROUP BY ?s ?sLabel ?inc ?dis ?coord''' % ' '.join('wd:' + q for q in CLASSES)
url = 'https://query.wikidata.org/sparql?' + urllib.parse.urlencode({'query': sparql, 'format': 'json'})
cache = os.path.join(ROOT, 'tools', 'etl', '.cache', 'wdqs_states_1836.json')
if os.path.exists(cache):
    rows = json.load(open(cache))
else:
    for attempt in range(30):
        try:
            r = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': 'application/sparql-results+json'}), timeout=180)
            rows = json.load(r)['results']['bindings']; break
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504):
                time.sleep(65); continue
            raise
    json.dump(rows, open(cache, 'w'))
links = json.load(open(os.path.join(ROOT, 'historical_data/identity/wikidata_links.json'), encoding='utf-8'))['links']
have = {v['qid'] for v in links.values() if v.get('linked')}
out = []; seen = set()
for b in rows:
    q = b['s']['value'].rsplit('/', 1)[-1]
    if q in have or q in seen:
        continue
    seen.add(q)
    label = b.get('sLabel', {}).get('value', q)
    if label == q:
        continue  # no English label: usually a stub item
    iv = b['inc']['value']
    if iv.startswith('-') or int(iv[:4]) < 1000:
        continue  # ancient items with no dissolution date in Wikidata (data gap, not an 1836 polity)
    inc = iv[:4]; dis = b.get('dis', {}).get('value', '')[:4].lstrip('+') or None
    coord = b.get('coord', {}).get('value')
    lat = lon = None
    if coord and coord.startswith('Point('):
        lon, lat = map(float, coord[6:-1].split())
    types = sorted({CLASSES.get(t, t) for t in b['types']['value'].split('|')})
    out.append({'qid': q, 'label': label, 'inception': inc, 'dissolved': dis, 'lat': lat, 'lon': lon, 'types': types})
out.sort(key=lambda x: (x['lat'] is None, x['label']))
from regions_py import classify  # noqa: E402
for o in out:
    o['macro'] = classify(o['lat'], o['lon']) if o['lat'] is not None else 'unknown'
json.dump({'generated': time.strftime('%Y-%m-%d'), 'source': 'Wikidata Query Service (CC0)', 'candidates': out}, open(os.path.join(ROOT, 'docs/audit/catalogue_gaps.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
by = {}
for o in out:
    by.setdefault(o['macro'], []).append(o)
md = ['# Ứng viên còn thiếu trong danh mục thực thể (tự sinh)', '',
      f'Truy vấn Wikidata: mục thuộc các lớp quốc gia / chính thể lịch sử, thành lập ≤ 1836 và chưa giải thể trước 1836, **chưa được liên kết** với thực thể nào trong game. Tổng: {len(out)} ứng viên.', '',
      'Đây là danh sách để duyệt, không phải danh sách nhập: nhiều mục là đơn vị hành chính, thuộc địa đã gộp vào chủ quốc, hoặc dữ liệu Wikidata thiếu ngày giải thể. Mỗi ứng viên cần quyết định: thêm thành thực thể riêng / gộp có ghi chú / loại.', '']
VI = {'europe': 'Châu Âu', 'east_asia': 'Đông Á', 'south_asia': 'Nam Á', 'southeast_asia': 'Đông Nam Á', 'central_asia': 'Trung Á', 'west_asia': 'Tây Á & Trung Đông',
      'north_africa': 'Bắc Phi', 'subsaharan_africa': 'Châu Phi hạ Sahara', 'north_america': 'Bắc Mỹ', 'central_america': 'Trung Mỹ & Caribe', 'south_america': 'Nam Mỹ', 'oceania': 'Châu Đại Dương', 'unknown': 'Không có tọa độ trong Wikidata'}
md += ['| Khu vực | Ứng viên |', '|---|---:|'] + [f'| {VI.get(m, m)} | {len(xs)} |' for m, xs in sorted(by.items(), key=lambda kv: -len(kv[1]))] + ['']
for m, xs in sorted(by.items(), key=lambda kv: -len(kv[1])):
    md += [f'## {VI.get(m, m)} ({len(xs)})', '', '| Wikidata | Tên | Thành lập | Giải thể | Lớp |', '|---|---|---|---|---|']
    md += [f"| [{o['qid']}](https://www.wikidata.org/wiki/{o['qid']}) | {o['label']} | {o['inception']} | {o['dissolved'] or '—'} | {', '.join(o['types'])[:60]} |" for o in xs]
    md.append('')
open(os.path.join(ROOT, 'docs/audit/CATALOGUE_GAPS.md'), 'w', encoding='utf-8').write('\n'.join(md))
print(len(rows), 'rows,', len(out), 'unlinked candidates')
