#!/usr/bin/env python3
"""ETL: converts public research datasets into Historical Research Database extracts.

Inputs (downloaded by fetch_sources.sh into tools/etl/.cache):
  * Correlates of War (CoW) National Material Capabilities v7 (supplemental, per-value sources)
  * CoW State System Membership v2024, Major Powers v2024
  * CoW Formal Alliances v4.1 (by member)
  * CoW Inter-State v4.0, Extra-State v4.0, Intra-State v4.1 war data
  * CoW Territorial Change v6
  * Maddison Project, "Historical Statistics of the World Economy 1-2008 AD" (2010 horizontal file)

Outputs (committed, under historical_data/):
  * population/cow_nmc_population.json, military/cow_nmc_military.json, economy/cow_nmc_industry.json
  * population/maddison_2010.json, economy/maddison_2010_gdp.json
  * political_entities/cow_system_membership.json
  * diplomacy/cow_alliances_1816_1914.json
  * events/cow_wars_1816_1914.json
  * borders/cow_territorial_changes_1816_1914.json

Every record carries a source id (see historical_data/sources/sources.json), a locator and a quality
status mapped from the dataset's own quality code where one exists.  Nothing is invented here: values are
copied, and only the quality mapping / entity mapping are editorial decisions (documented below).
"""
import csv, io, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, '.cache')
OUT = os.path.normpath(os.path.join(HERE, '..', '..', 'historical_data'))
YEAR_MIN, YEAR_MAX = 1816, 1914

# CoW ccode -> game entity id.  Editorial mapping: CoW codes some predecessor states under the code of a
# successor (e.g. 255 "Germany" = Kingdom of Prussia before 1871, 325 "Italy" = Kingdom of Sardinia before
# 1861, 300 = Austrian Empire before 1867, 100 "Colombia" = Republic of New Granada 1831-1858).
COW_TO_TAG = {
    2: 'USA', 41: 'HAI', 42: 'DOM', 70: 'MEX', 90: 'GUA', 91: 'HON', 92: 'ELS', 93: 'NIC', 94: 'COS',
    100: 'NGR', 101: 'VEN', 130: 'ECU', 135: 'PEU', 140: 'BRA', 145: 'BOL', 150: 'PAR', 155: 'CHL',
    160: 'ARG', 165: 'URU', 200: 'GBR', 210: 'NED', 211: 'BEL', 212: 'LUX', 220: 'FRA', 225: 'SWI',
    230: 'SPA', 235: 'POR', 240: 'HAN', 245: 'BAV', 255: 'PRU', 267: 'BAD', 269: 'SAX', 271: 'WUR',
    273: 'HKA', 275: 'HDA', 280: 'MSC', 300: 'AUS', 325: 'SAR', 327: 'PAP', 329: 'SIC', 332: 'MOD',
    335: 'PMA', 337: 'TUS', 345: 'SER', 350: 'GRE', 355: 'BUL', 360: 'ROM', 365: 'RUS', 380: 'SWE',
    385: 'NOR', 390: 'DEN', 530: 'ETH', 600: 'MOR', 616: 'TUN', 630: 'PRS', 640: 'TUR', 651: 'EGY',
    700: 'AFG', 710: 'QNG', 730: 'KOR', 740: 'JAP', 800: 'SIA', 450: 'LIB', 341: 'MNT', 563: 'TRN',
    564: 'OFS', 620: 'TRI',
}
# Notes on scope differences between the CoW unit and the game entity at 1836.
SCOPE_NOTES = {
    'SWE': 'CoW "Sweden" total population equals Sweden + Norway (union of crowns); Maddison 2010 Sweden 3,042k + Norway 1,202k = 4,244k for 1836.',
    'PRU': 'CoW code 255 ("Germany") is the Kingdom of Prussia before 1871.',
    'SAR': 'CoW code 325 ("Italy") is the Kingdom of Sardinia (Piedmont-Sardinia) before 1861.',
    'AUS': 'CoW code 300 is the Austrian Empire before the 1867 Compromise.',
    'NGR': 'CoW code 100 ("Colombia") is the Republic of New Granada for 1831-1858.',
    'DEN': 'CoW Denmark total includes the duchies of Schleswig, Holstein and Lauenburg before 1864 (consistent with ~2.07M vs Maddison modern-Denmark 1.32M).',
    'TUR': 'Scope of the CoW Ottoman total (Egypt and the autonomous principalities included or not) is not stated in the extracted record; treat as Uncertain for territorial scope.',
}

COW_TPOP_QUALITY = {  # CoW NMC v7 documentation, Table TPOP 1
    'A': ('verified', 'CoW quality A: value from identified source'),
    'B': ('supported', 'CoW quality B: linear interpolation from identified sources'),
    'C': ('estimated', 'CoW quality C: linear interpolation from at least one unidentified source'),
    'D': ('estimated', 'CoW quality D: regression from identified sources'),
    'E': ('estimated', 'CoW quality E: regression from at least one unidentified source'),
    'F': ('estimated', 'CoW quality F: extrapolation from identified sources'),
    'G': ('estimated', 'CoW quality G: extrapolation from at least one unidentified source'),
    'M': ('missing', 'CoW quality M: missing'),
}
BENCH_YEARS = {1816, 1820, 1830, 1836, 1840, 1845, 1850, 1855, 1860, 1865, 1870, 1875, 1880, 1890, 1900, 1910, 1914}


def read_csv(path, enc='latin-1'):
    raw = open(path, encoding=enc, newline='').read().replace('\r\n', '\n').replace('\r', '\n')
    return list(csv.DictReader(io.StringIO(raw)))


def num(v):
    try:
        x = float(v)
    except (TypeError, ValueError):
        return None
    return None if x < 0 else x  # CoW uses -9 / -8 for missing / not applicable


def dump(rel, obj):
    p = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)
    print('wrote', rel, len(obj['records']) if isinstance(obj, dict) and 'records' in obj else '')


def tag(ccode):
    try:
        return COW_TO_TAG.get(int(float(ccode)))
    except (TypeError, ValueError):
        return None


def nmc():
    rows = read_csv(os.path.join(CACHE, 'x_NMCv7/NMCv7/sup/NMC-70-wsupplementary.csv'))
    pop, mil, ind = [], [], []
    for r in rows:
        y = int(r['year'])
        if y < YEAR_MIN or y > YEAR_MAX or y not in BENCH_YEARS:
            continue
        t = tag(r['ccode'])
        if not t:
            continue
        loc = f"CoW NMC v7 supplemental, ccode {r['ccode']} ({r['statenme']}), year {y}"
        scope = SCOPE_NOTES.get(t)
        tp = num(r['tpop'])
        q, qn = COW_TPOP_QUALITY.get(r['tpopqualitycode'] or 'M', ('estimated', 'no CoW quality code'))
        if tp is not None:
            pop.append({'entity': t, 'field': 'population.total', 'date': str(y), 'value': int(tp * 1000),
                        'unit': 'persons', 'quality': q,
                        'sources': [{'id': 'cow_nmc_v7', 'locator': loc + ', variable tpop',
                                     'upstream': (r['tpopsource'] or '').strip() or None}],
                        'method': qn, 'note': '; '.join(x for x in [(r['tpopnote'] or '').strip(), scope] if x) or None})
        up = num(r['upop'])
        if up is not None and up > 0:
            pop.append({'entity': t, 'field': 'population.urban_cities_over_100k', 'date': str(y), 'value': int(up * 1000),
                        'unit': 'persons', 'quality': 'supported',
                        'sources': [{'id': 'cow_nmc_v7', 'locator': loc + ', variable upop'}],
                        'method': 'CoW urban population: inhabitants of cities above the CoW urban threshold', 'note': scope})
        mp = num(r['milper'])
        if mp is not None:
            mil.append({'entity': t, 'field': 'military.personnel', 'date': str(y), 'value': int(mp * 1000), 'unit': 'persons',
                        'quality': 'verified' if 'verified' in (r['milpernote'] or '').lower() else 'supported',
                        'sources': [{'id': 'cow_nmc_v7', 'locator': loc + ', variable milper',
                                     'upstream': (r['milpersource'] or '').strip() or None}],
                        'method': 'CoW military personnel (thousands) x 1000', 'note': (r['milpernote'] or '').strip() or None})
        mx = num(r['milex'])
        if mx is not None:
            mil.append({'entity': t, 'field': 'military.expenditure_gbp_k', 'date': str(y), 'value': mx,
                        'unit': 'thousand GBP (CoW pre-1914 unit)', 'quality': 'supported',
                        'sources': [{'id': 'cow_nmc_v7', 'locator': loc + ', variable milex',
                                     'upstream': (r['milexsource'] or '').strip() or None}],
                        'method': 'CoW military expenditure; pre-1914 values are in thousands of British pounds', 'note': None})
        for var, field, unit in (('irst', 'economy.iron_steel_kt', 'thousand tons'), ('pec', 'economy.primary_energy_kt_coal_eq', 'thousand tons coal equivalent')):
            v = num(r[var])
            if v is None:
                continue
            qc = r.get(var + 'qualitycode') or ''
            ind.append({'entity': t, 'field': field, 'date': str(y), 'value': v, 'unit': unit,
                        'quality': 'verified' if qc == 'A' else ('estimated' if qc else 'supported'),
                        'sources': [{'id': 'cow_nmc_v7', 'locator': f'{loc}, variable {var}', 'upstream': (r.get(var + 'source') or '').strip() or None}],
                        'method': f'CoW {var} (quality code {qc or "n/a"})', 'note': (r.get(var + 'note') or '').strip() or None})
    meta = {'dataset': 'cow_nmc_v7', 'years': sorted(BENCH_YEARS), 'generated_by': 'tools/etl/extract_datasets.py'}
    dump('population/cow_nmc_population.json', {**meta, 'records': pop})
    dump('military/cow_nmc_military.json', {**meta, 'records': mil})
    dump('economy/cow_nmc_industry.json', {**meta, 'records': ind})


def system_membership():
    rows = read_csv(os.path.join(CACHE, 'x_States2024/States2024/statelist2024.csv'))
    majors = read_csv(os.path.join(CACHE, 'x_MajorPowers2024/MajorPowers2024/majors2024.csv'))
    recs = []
    for r in rows:
        if int(r['styear']) > YEAR_MAX:
            continue
        recs.append({'entity': tag(r['ccode']), 'cow_ccode': int(r['ccode']), 'cow_name': r['statenme'],
                     'member_from': f"{r['styear']}-{int(r['stmonth']):02d}-{int(r['stday']):02d}",
                     'member_to': f"{r['endyear']}-{int(r['endmonth']):02d}-{int(r['endday']):02d}",
                     'sources': [{'id': 'cow_states_2024', 'locator': 'statelist2024.csv'}], 'quality': 'verified'})
    mp = [{'entity': tag(r['ccode']), 'cow_ccode': int(r['ccode']),
           'from': f"{r['styear']}-{int(r['stmonth']):02d}-{int(r['stday']):02d}",
           'to': f"{r['endyear']}-{int(r['endmonth']):02d}-{int(r['endday']):02d}",
           'sources': [{'id': 'cow_majors_2024', 'locator': 'majors2024.csv'}], 'quality': 'verified'}
          for r in majors if int(r['styear']) <= YEAR_MAX]
    dump('political_entities/cow_system_membership.json', {'dataset': 'cow_states_2024', 'records': recs, 'major_powers': mp})


def alliances():
    rows = read_csv(os.path.join(CACHE, 'x_version4.1_csv/version4.1_csv/alliance_v4.1_by_member.csv'))
    by = {}
    for r in rows:
        sy = int(r['all_st_year']) if r['all_st_year'] else None
        if sy is None or sy > YEAR_MAX:
            continue
        a = by.setdefault(r['version4id'], {
            'id': 'cow_ally_' + r['version4id'], 'cow_version4id': int(r['version4id']), 'type': r['ss_type'].strip(),
            'defense': r['defense'] == '1', 'neutrality': r['neutrality'] == '1', 'nonaggression': r['nonaggression'] == '1',
            'entente': r['entente'] == '1', 'start': None, 'end': None, 'members': [],
            'sources': [{'id': 'cow_alliances_v41', 'locator': 'alliance_v4.1_by_member.csv, version4id ' + r['version4id']}],
            'quality': 'verified'})
        def d(y, m, dd):
            if not y:
                return None
            return f"{int(y):04d}-{int(m or 1):02d}-{int(dd or 1):02d}"
        a['start'] = d(r['all_st_year'], r['all_st_month'], r['all_st_day'])
        a['end'] = d(r['all_end_year'], r['all_end_month'], r['all_end_day'])
        a['members'].append({'entity': tag(r['ccode']), 'cow_ccode': int(r['ccode']), 'cow_name': r['state_name'],
                             'from': d(r['mem_st_year'], r['mem_st_month'], r['mem_st_day']),
                             'to': d(r['mem_end_year'], r['mem_end_month'], r['mem_end_day'])})
    recs = sorted(by.values(), key=lambda a: (a['start'] or '', a['cow_version4id']))
    recs = [a for a in recs if (a['end'] or '9999') >= f'{YEAR_MIN}']
    dump('diplomacy/cow_alliances_1816_1914.json', {'dataset': 'cow_alliances_v41', 'records': recs})


def wars():
    recs = []
    def d(y, m, dd):
        y = int(y) if y and int(y) > 0 else None
        if not y:
            return None
        m = int(m) if m and int(m) > 0 else 1
        dd = int(dd) if dd and int(dd) > 0 else 1
        return f'{y:04d}-{m:02d}-{dd:02d}'
    inter = read_csv(os.path.join(CACHE, 'Inter-StateWarData_v4.0.csv'))
    g = {}
    for r in inter:
        if int(r['StartYear1']) > YEAR_MAX:
            continue
        w = g.setdefault(r['WarNum'], {'id': 'cow_war_' + r['WarNum'], 'cow_war_num': int(r['WarNum']), 'name': r['WarName'],
                                       'category': 'inter-state', 'start': None, 'end': None, 'participants': [],
                                       'sources': [{'id': 'cow_interstate_v40', 'locator': 'Inter-StateWarData_v4.0.csv, WarNum ' + r['WarNum']}],
                                       'quality': 'verified'})
        s, e = d(r['StartYear1'], r['StartMonth1'], r['StartDay1']), d(r['EndYear1'], r['EndMonth1'], r['EndDay1'])
        w['start'] = min(filter(None, [w['start'], s])) if s else w['start']
        w['end'] = max(filter(None, [w['end'], e])) if e else w['end']
        w['participants'].append({'entity': tag(r['ccode']), 'cow_name': r['StateName'], 'side': int(r['Side']),
                                  'initiator': r['Initiator'] == '1', 'outcome_code': int(r['Outcome']),
                                  'battle_deaths': num(r['BatDeath'])})
    recs += g.values()
    for fname, cat, src in (('Extra-StateWarData_v4.0.csv', 'extra-state', 'cow_extrastate_v40'),
                            ('Intra-StateWarData_v4.1.csv', 'intra-state', 'cow_intrastate_v41')):
        g = {}
        for r in read_csv(os.path.join(CACHE, fname)):
            if not r['StartYear1'] or int(r['StartYear1']) > YEAR_MAX or int(r['StartYear1']) < YEAR_MIN:
                continue
            w = g.setdefault(r['WarNum'], {'id': f'cow_{cat}_{r["WarNum"]}', 'cow_war_num': float(r['WarNum']), 'name': r['WarName'],
                                           'category': cat, 'start': None, 'end': None, 'participants': [],
                                           'sources': [{'id': src, 'locator': f'{fname}, WarNum {r["WarNum"]}'}], 'quality': 'verified'})
            s, e = d(r['StartYear1'], r['StartMonth1'], r['StartDay1']), d(r['EndYear1'], r['EndMonth1'], r['EndDay1'])
            w['start'] = min(filter(None, [w['start'], s])) if s else w['start']
            w['end'] = max(filter(None, [w['end'], e])) if e else w['end']
            ca = r.get('ccode1') or r.get('CcodeA')
            cb = r.get('ccode2') or r.get('CcodeB')
            w['participants'].append({'side_a': r['SideA'], 'side_a_entity': tag(ca), 'side_b': r['SideB'], 'side_b_entity': tag(cb),
                                      'outcome_code': int(r['Outcome']) if r['Outcome'].lstrip('-').isdigit() else None})
        recs += g.values()
    recs.sort(key=lambda w: (w['start'] or '', w['name']))
    dump('events/cow_wars_1816_1914.json', {'dataset': 'cow_wars', 'outcome_codes': {
        'inter-state': '1=winner, 2=loser, 3=compromise/tied, 4=transformed into another war type, 5=ongoing, 6=stalemate, 7=continuing',
        'intra/extra-state': '1=side A wins, 2=side B wins, 3=compromise, 4=transformed, 5=ongoing, 6=stalemate, 7=conflict continues at below war level'},
        'records': recs})


def territorial():
    rows = read_csv(os.path.join(CACHE, 'x_terr-changes-v6/tc2018.csv'))
    ent_names = {}
    ent_txt = os.path.join(CACHE, 'ent.txt')
    if os.path.exists(ent_txt):
        import re
        for line in open(ent_txt, encoding='utf-8', errors='ignore'):
            m = re.match(r'\s*(\d+)\s+(.+?)\s{2,}(\d{4})\s+(\d{4})', line)
            if m:
                ent_names.setdefault(int(m.group(1)), m.group(2).strip())
    PROC = {1: 'conquest', 2: 'annexation', 3: 'cession', 4: 'secession', 5: 'unification', 6: 'mandate', -9: 'missing'}
    recs = []
    for r in rows:
        y = int(r['year'])
        if y < YEAR_MIN or y > YEAR_MAX:
            continue
        ent = int(r['entity']) if r['entity'].lstrip('-').isdigit() else -9
        recs.append({'id': 'cow_tc_' + r['number'], 'year': y, 'month': int(r['month']) if r['month'].isdigit() else None,
                     'cow_entity': ent, 'cow_entity_name': ent_names.get(ent),
                     'gainer': tag(r['gainer']), 'gainer_ccode': int(num(r['gainer']) or -9),
                     'loser': tag(r['loser']), 'loser_ccode': int(num(r['loser']) or -9),
                     'procedure': PROC.get(int(r['procedur']) if r['procedur'].lstrip('-').isdigit() else -9, r['procedur']),
                     'area_km2': num(r['area']), 'population': num(r['pop']), 'independence': r['indep'] == '1',
                     'conflict': r['conflict'] == '1',
                     'sources': [{'id': 'cow_terrchange_v6', 'locator': 'tc2018.csv, number ' + r['number']}], 'quality': 'verified'})
    dump('borders/cow_territorial_changes_1816_1914.json', {'dataset': 'cow_terrchange_v6', 'records': recs})


def maddison():
    try:
        import openpyxl
    except ImportError:
        print('openpyxl missing: pip install openpyxl', file=sys.stderr)
        return
    wb = openpyxl.load_workbook(os.path.join(CACHE, 'md2010_horizontal.xlsx'), read_only=True, data_only=True)
    years = (1820, 1830, 1836, 1840, 1850, 1860, 1870, 1880, 1890, 1900, 1913)
    out = {}
    for sheet, field, unit in (('Population', 'population.total_modern_territory', 'thousand persons'),
                               ('PerCapita GDP', 'economy.gdp_per_capita_1990gk', '1990 international Geary-Khamis dollars')):
        rows = list(wb[sheet].iter_rows(values_only=True))
        hi = next(i for i, r in enumerate(rows) if r and 1820 in r)
        hdr = rows[hi]
        cols = {y: j for j, y in enumerate(hdr) if y in years}
        recs = []
        for r in rows[hi + 1:]:
            if not r or r[0] is None or str(r[0]).strip().lower().startswith('total'):
                continue
            name = str(r[0]).strip()
            for y, j in cols.items():
                v = r[j]
                if isinstance(v, (int, float)) and v > 0:
                    recs.append({'unit_name': name, 'field': field, 'date': str(y), 'value': round(float(v), 3), 'unit': unit,
                                 'quality': 'estimated',
                                 'sources': [{'id': 'maddison_2010', 'locator': f'md2010_horizontal.xlsx, sheet {sheet}, {name}, {y}'}],
                                 'method': 'Maddison estimate for the present-day territory of the named unit; not the 1836 polity. Used only as an input to documented allocations.'})
        out[sheet] = recs
    dump('population/maddison_2010.json', {'dataset': 'maddison_2010', 'territorial_basis': 'present-day borders', 'records': out['Population']})
    dump('economy/maddison_2010_gdp.json', {'dataset': 'maddison_2010', 'territorial_basis': 'present-day borders', 'records': out['PerCapita GDP']})


if __name__ == '__main__':
    nmc(); system_membership(); alliances(); wars(); territorial(); maddison()
