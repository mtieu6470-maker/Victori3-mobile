"""CO-1b: build historical_data/companies/company_kinds.json from the CG-32 technology→company map.

  python3 -I tools/data/build_company_kinds.py

Each company kind keeps the CG-32 fields and gains:
  buildings   engine building types the kind may own today (empty = dormant until ECON-GOODS-01
              adds its goods/buildings; the kind is still listed so the unlock is visible);
  right_class CHARTER | LICENSE | CONTRACT | CAPABILITY (CG-32 §3/§5): only CHARTER can ever become a
              legal privilege, and only with a legal basis from CG-30 (none is active yet).
"""
import csv, json, os
ROOT = os.path.join(os.path.dirname(__file__), '..', '..')
SRC = os.path.join(ROOT, 'docs', 'research', 'design', 'CG32_TECH_TO_COMPANY_MAP.csv')
OUT = os.path.join(ROOT, 'historical_data', 'companies', 'company_kinds.json')

SECTOR_BUILDINGS = {
    'textile': ['textile_mill'], 'iron': ['ironworks'], 'steel': ['ironworks'], 'metals': ['ironworks'],
    'machinery': ['tool_works'], 'manufacturing': ['tool_works'], 'rail': ['railway'],
}
CHARTER = {'network_franchise', 'grid_concession', 'drilling_concession', 'municipal_franchise', 'right_of_way', 'landing_rights', 'route_access', 'terminal_access'}
CONTRACT = {'supplier_contract', 'dealer_network', 'service_contract', 'equipment_supply', 'public_tender', 'distribution_network', 'distribution_rights', 'service_distribution', 'industrial_financing'}

def right_class(kind):
    if not kind or kind == 'none': return None
    if kind in CHARTER: return 'CHARTER'
    if kind in CONTRACT: return 'CONTRACT'
    return 'LICENSE'

kinds = {}
with open(SRC, newline='', encoding='utf-8') as f:
    for r in csv.DictReader(f):
        k = r['company_kind']
        if not k or k == 'none':
            continue
        entry = kinds.setdefault(k, {'id': k, 'sector': r['sector'], 'unlocked_by': [], 'rights': [],
                                     'buildings': SECTOR_BUILDINGS.get(r['sector'], []), 'source_ids': set()})
        entry['unlocked_by'].append(r['tech_id'])
        rc = right_class(r['charter_kind'])
        if rc and not any(x['id'] == r['charter_kind'] for x in entry['rights']):
            entry['rights'].append({'id': r['charter_kind'], 'right_class': rc, 'active': False})
        for s in r['source_ids'].split(','):
            if s.strip(): entry['source_ids'].add(s.strip())
out = []
for k in sorted(kinds):
    e = kinds[k]; e['source_ids'] = sorted(e['source_ids']); out.append(e)
doc = {
    'description': 'Company kinds unlocked by technologies (CO-1b). Generated from docs/research/design/CG32_TECH_TO_COMPANY_MAP.csv by tools/data/build_company_kinds.py; do not edit by hand. Technology opens the capability to form a company; formation still needs law, sites and capital (CG-32 §4). Rights are inactive until a legal basis exists (CG-30).',
    'kinds': out,
}
with open(OUT, 'w', encoding='utf-8') as f:
    json.dump(doc, f, ensure_ascii=False, indent=1); f.write('\n')
print(len(out), 'kinds;', sum(1 for e in out if e['buildings']), 'operational now')
