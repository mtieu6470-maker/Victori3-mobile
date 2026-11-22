"""CG-29 benchmark extraction (MSG-045).

Reads the raw public datasets from a download directory and writes small, checksummed subsets into
docs/research/data/ so calibration and review use exact source values (no transcription by memory).

  python3 -I tools/data/extract_benchmarks.py <raw_dir>

Raw inputs (download yourself; URLs and checksums are recorded in the manifest):
  mpd2023_web.xlsx               Maddison Project Database 2023, DataverseNL doi:10.34894/INZBF2, CC BY 4.0
  owid_population.csv            Our World in Data long-run population (HYDE/Gapminder/UN), CC BY 4.0
  wpp2024_demo.csv.gz            UN World Population Prospects 2024, Demographic Indicators (Medium), CC BY 3.0 IGO
"""
import csv, gzip, hashlib, json, os, sys
import openpyxl

RAW = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'docs', 'research', 'data')
os.makedirs(OUT, exist_ok=True)

ISO = ['GBR', 'FRA', 'DEU', 'USA', 'RUS', 'CHN', 'IND', 'JPN', 'BRA', 'TUR']
MPD_EXTRA = ['SUN', 'CSK', 'YUG']  # historical aggregates in MPD (USSR etc.), kept when present


def digest(path):
    h1, h256 = hashlib.sha1(), hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(1 << 20), b''):
            h1.update(chunk); h256.update(chunk)
    return {'sha1': h1.hexdigest(), 'sha256': h256.hexdigest(), 'bytes': os.path.getsize(path)}


manifest = {'generated_by': 'tools/data/extract_benchmarks.py', 'outputs': {}, 'inputs': {}}

# ---- MPD2023: country GDP per capita and population (Full data), world GDPpc (Regional data)
mpd = os.path.join(RAW, 'mpd2023_web.xlsx')
wb = openpyxl.load_workbook(mpd, read_only=True, data_only=True)
rows = []
for r in wb['Full data'].iter_rows(min_row=2, values_only=True):
    code, country, region, year, gdppc, pop = r[:6]
    if code in ISO + MPD_EXTRA and isinstance(year, (int, float)) and year >= 1820:
        rows.append([code, country, region, int(year), gdppc if gdppc is not None else '', pop if pop is not None else ''])
p = os.path.join(OUT, 'MPD2023_SUBSET_1820_2022.csv')
with open(p, 'w', newline='') as f:
    w = csv.writer(f); w.writerow(['countrycode', 'country', 'region', 'year', 'gdppc_2011_intl_dollars', 'pop_thousands']); w.writerows(rows)
manifest['outputs'][os.path.basename(p)] = {'rows': len(rows), 'source_sheet': 'Full data', **digest(p)}

reg = list(wb['Regional data'].iter_rows(values_only=True))
header_top, header = reg[0], reg[1]
world_col = next(i for i, v in enumerate(header_top) if v == 'World GDP pc')
pop_start = next(i for i, v in enumerate(header_top) if isinstance(v, str) and v.strip().startswith('Regional Population'))
world_pop_col = next((i for i in range(pop_start, len(header)) if header[i] == 'World'), None)
wrows = []
for r in reg[2:]:
    if not isinstance(r[0], (int, float)):
        continue
    wrows.append([int(r[0]), r[world_col] if r[world_col] is not None else '', (r[world_pop_col] if world_pop_col is not None and r[world_pop_col] is not None else '')])
p = os.path.join(OUT, 'MPD2023_WORLD_GDPPC.csv')
with open(p, 'w', newline='') as f:
    w = csv.writer(f); w.writerow(['year', 'world_gdppc_2011_intl_dollars', 'world_pop_thousands']); w.writerows(wrows)
manifest['outputs'][os.path.basename(p)] = {'rows': len(wrows), 'source_sheet': 'Regional data', **digest(p)}
manifest['inputs']['mpd2023_web.xlsx'] = {'url': 'https://dataverse.nl/api/access/datafile/421302', 'doi': '10.34894/INZBF2', 'publisher_sha1': '1480521f602fbd5df64e108867ac971caa00ed1a', 'license': 'CC BY 4.0', 'citation': 'Bolt, J. and van Zanden, J. L. (2024), Maddison style estimates of the evolution of the world economy: A new 2023 update, Journal of Economic Surveys, 1-41.', **digest(mpd)}

# ---- OWID long-run population (historical series use today's borders)
owid = os.path.join(RAW, 'owid_population.csv')
orows = []
with open(owid, newline='', encoding='utf-8') as f:
    for r in csv.DictReader(f):
        y = int(r['year'])
        if 1800 <= y <= 2023 and (r['code'] in ISO or r['entity'] == 'World'):
            orows.append([r['entity'], r['code'], y, r['population_historical']])
p = os.path.join(OUT, 'OWID_POPULATION_SUBSET_1800_2023.csv')
with open(p, 'w', newline='') as f:
    w = csv.writer(f); w.writerow(['entity', 'code', 'year', 'population']); w.writerows(orows)
manifest['outputs'][os.path.basename(p)] = {'rows': len(orows), 'note': 'Our World in Data long-run population; historical values use today\'s borders (HYDE/Gapminder before 1950, UN WPP after).', **digest(p)}
manifest['inputs']['owid_population.csv'] = {'url': 'https://ourworldindata.org/grapher/population.csv?v=1&csvType=full&useColumnShortNames=true', 'license': 'CC BY 4.0 (OWID; underlying sources HYDE, Gapminder, UN WPP)', **digest(owid)}

# ---- UN WPP 2024 demographic indicators (estimates up to 2023; projections excluded)
wpp = os.path.join(RAW, 'wpp2024_demo.csv.gz')
cols = ['ISO3_code', 'Location', 'Time', 'TPopulation1July', 'CBR', 'CDR', 'TFR', 'LEx']
wrows = []
with gzip.open(wpp, 'rt', encoding='utf-8-sig', newline='') as f:
    for r in csv.DictReader(f):
        if r['Variant'] != 'Medium' or int(r['Time']) > 2023:
            continue
        if r['ISO3_code'] in ISO or (r['Location'] == 'World' and r['LocTypeName'] == 'World'):
            wrows.append([r[c] for c in cols])
p = os.path.join(OUT, 'WPP2024_DEMOGRAPHY_SUBSET_1950_2023.csv')
with open(p, 'w', newline='') as f:
    w = csv.writer(f); w.writerow(['iso3', 'location', 'year', 'population_thousands_1july', 'crude_birth_rate_per_1000', 'crude_death_rate_per_1000', 'total_fertility_rate', 'life_expectancy_at_birth']); w.writerows(wrows)
manifest['outputs'][os.path.basename(p)] = {'rows': len(wrows), 'note': 'Estimates only (1950-2023); Medium-variant file, projections after 2023 excluded.', **digest(p)}
manifest['inputs']['wpp2024_demo.csv.gz'] = {'url': 'https://population.un.org/wpp/assets/Excel%20Files/1_Indicator%20(Standard)/CSV_FILES/WPP2024_Demographic_Indicators_Medium.csv.gz', 'license': 'CC BY 3.0 IGO (United Nations, DESA, Population Division, World Population Prospects 2024)', **digest(wpp)}

with open(os.path.join(OUT, 'CG29_DATA_MANIFEST.json'), 'w') as f:
    json.dump(manifest, f, indent=1, ensure_ascii=False); f.write('\n')
print(json.dumps({k: v['rows'] for k, v in manifest['outputs'].items()}))
