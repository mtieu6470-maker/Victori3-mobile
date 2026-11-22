"""Extract MPD2023 GDP per capita for ALL countries at benchmark years (divergence check, TECH-02 review).

  python3 -I tools/data/extract_mpd_all.py <mpd2023_web.xlsx>

Source: Bolt & van Zanden (2024), Maddison Project Database 2023, DOI 10.34894/INZBF2, CC BY 4.0.
Verifies the publisher SHA-1 before reading. Writes docs/research/data/MPD2023_ALL_BENCHMARK_YEARS.csv
(country code, name, region, year, gdppc 2011 int-$, population thousands); no value is interpolated.
"""
import csv, hashlib, os, sys
import openpyxl
SRC = sys.argv[1]
SHA1 = '1480521f602fbd5df64e108867ac971caa00ed1a'
if hashlib.sha1(open(SRC, 'rb').read()).hexdigest() != SHA1: raise SystemExit('MPD2023 workbook checksum mismatch')
YEARS = {1836, 1850, 1870, 1913, 1950, 1980, 2000, 2022}
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
wb = openpyxl.load_workbook(SRC, read_only=True, data_only=True)
ws = wb['Full data']
rows = ws.iter_rows(values_only=True); head = next(rows)
ix = {h: i for i, h in enumerate(head)}
out = []
for r in rows:
    y = r[ix['year']]
    if y in YEARS and r[ix['gdppc']] is not None:
        out.append([r[ix['countrycode']], r[ix['country']], r[ix['region']], y, round(float(r[ix['gdppc']])), '' if r[ix['pop']] is None else round(float(r[ix['pop']]))])
p = os.path.join(ROOT, 'docs/research/data/MPD2023_ALL_BENCHMARK_YEARS.csv')
with open(p, 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f); w.writerow(['countrycode', 'country', 'region', 'year', 'gdppc_2011_intl_dollars', 'pop_thousands']); w.writerows(out)
print(len(out), 'rows', hashlib.sha256(open(p, 'rb').read()).hexdigest())
