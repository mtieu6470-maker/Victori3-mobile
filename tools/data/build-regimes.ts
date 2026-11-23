// REGIME-01a: turn ChatGPT's CG-41 staging research (historical_data/research_staging/
// CG41_REGIME_CHANGES_1836_1991.json) into historical_data/history/regime_changes.json for Historical Mode.
// Each event is applied to the state holding its historical capital region (map-grid lookup of the city).
// Only law values the engine has are kept; LAW_OVERRIDE adds the 20th-century laws (REGIME-01b); independence
// events carry the culture(s) whose regions form the new state.
//   npx tsx tools/data/build-regimes.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { loadNodeData } from '../../src/engine/node';
import { createGame } from '../../src/engine/init';
import { REFORMABLE_LAWS } from '../../src/engine/laws';

const CITY: Record<string, [number, number]> = {
  'Saint Petersburg': [59.93, 30.34], Petrograd: [59.93, 30.34], Moscow: [55.76, 37.62], Paris: [48.86, 2.35], Vichy: [46.13, 3.43], Algiers: [36.75, 3.06],
  Berlin: [52.52, 13.4], Bonn: [50.73, 7.1], 'East Berlin': [52.52, 13.41], Turin: [45.07, 7.69], Rome: [41.9, 12.5], Vienna: [48.21, 16.37], Ankara: [39.93, 32.86],
  Nanjing: [32.06, 118.8], Beijing: [39.9, 116.4], Kyoto: [35.01, 135.77], Tokyo: [35.68, 139.69], Madrid: [40.42, -3.7], Burgos: [42.34, -3.7], Hanoi: [21.03, 105.85],
  Saigon: [10.78, 106.7], Helsinki: [60.17, 24.94], Warsaw: [52.23, 21.01], Vilnius: [54.69, 25.28], Tallinn: [59.44, 24.75], Riga: [56.95, 24.11], Kyiv: [50.45, 30.52],
  'New Delhi': [28.61, 77.21], Seoul: [37.57, 126.98], 'Washington, D.C.': [38.9, -77.04], London: [51.51, -0.13],
};
const OVERRIDE: Record<string, string> = { 'Washington, D.C.': 'USA_MAR' };
// Independence events: cultures whose regions (held by the parent) form the new state.
const INDEPENDENCE_CULTURES: Record<string, string[]> = { 'FIN-1917-12': ['finnish'], 'POL-1918-11': ['polish'], 'LTU-1918-02': ['lithuanian'], 'LVA-1918-11': ['latvian'] };
// Events left for later slices (partition, reunification, dissolution, civil wars, decolonisation records).
// Events that create a new regime or state rename the state; reforms inside a regime keep its name.
const RENAME = new Set(['FRA-1848-02', 'FRA-1852-12', 'FRA-1870-09', 'FRA-1940-07', 'FRA-1946-10', 'FRA-1958-10', 'ITA-1861-03', 'ITA-1946-06', 'GER-1871-01', 'GER-1918-11', 'GER-1933-01',
  'JAP-1868-01', 'JAP-1947-05', 'QNG-1912-01', 'CHN-1949-10', 'RUS-1917-03', 'RUS-1917-11', 'RUS-1922-12', 'TUR-1922-11', 'SPA-1931-04', 'SPA-1939-04', 'SPA-1975-11',
  'FIN-1917-12', 'LTU-1918-02', 'LVA-1918-11', 'POL-1918-11']);
const NAME_OVERRIDE: Record<string, [string, string]> = { 'JAP-1947-05': ['Japan', 'Nhật Bản'], 'SPA-1975-11': ['Kingdom of Spain', 'Vương quốc Tây Ban Nha'], 'RUS-1917-11': ['Russian Soviet Republic', 'Nước Nga Xô viết'],
  'JAP-1868-01': ['Empire of Japan', 'Đế quốc Nhật Bản'], 'GER-1871-01': ['German Empire', 'Đế quốc Đức'], 'FIN-1917-12': ['Republic of Finland', 'Cộng hòa Phần Lan'],
  'GER-1918-11': ['German Reich (Weimar Republic)', 'Cộng hòa Weimar'], 'GER-1933-01': ['German Reich', 'Đế chế Đức (Quốc xã)'], 'SPA-1939-04': ['Spanish State', 'Nhà nước Tây Ban Nha'] };
const DEFER = new Set(['AHM-1918-10', 'GER-1949-05', 'GER-1949-10', 'GER-1990-10', 'VNM-1945-09', 'VNM-1954-07', 'VNM-1975-04', 'VNM-1976-07', 'USSR-1991-12', 'IND-PAK-1947-08', 'KOR-1948-08', 'UKR-1918-01', 'EST-1918-02', 'RUS-1918-22-CIVILWAR', 'FRA-1944-08']);

const W = 8192, CPD = W / 360, H = Math.round(170 * CPD), LAT0 = 85;
const runs = new Uint16Array(readFileSync(new URL('../../public/generated/map.bin', import.meta.url)).buffer.slice(0));
const grid = new Uint16Array(W * H); { let k = 0; for (let i = 0; i < runs.length; i += 2) { grid.fill(runs[i], k, k + runs[i + 1]); k += runs[i + 1]; } }
loadNodeData();
// REGIME-01b: 20th-century law values for events whose CG-41 law changes predate them (women's suffrage,
// one-party rule, planned economy). Dates follow the CG-41 sources and its proposedLaws examples.
const LAW_OVERRIDE: Record<string, Record<string, string>> = {
  'FIN-1906-07': { power: 'universal_suffrage' }, 'FIN-1917-12': { power: 'universal_suffrage' }, 'POL-1918-11': { power: 'universal_suffrage' },
  'LTU-1918-02': { power: 'universal_suffrage' }, 'LVA-1918-11': { power: 'universal_suffrage' }, 'GER-1918-11': { power: 'universal_suffrage' },
  'SPA-1931-04': { power: 'universal_suffrage' }, 'ITA-1946-06': { power: 'universal_suffrage' }, 'FRA-1946-10': { power: 'universal_suffrage' },
  'JAP-1947-05': { power: 'universal_suffrage' }, 'FRA-1958-10': { power: 'universal_suffrage' }, 'SPA-1975-11': { power: 'universal_suffrage' },
  'USSR-1990-03': { power: 'universal_suffrage' },
  'RSFSR-1918-07': { power: 'one_party_state', economy: 'command_economy' }, 'RUS-1922-12': { power: 'one_party_state', economy: 'interventionism' },
  'USSR-1936-12': { power: 'one_party_state', economy: 'command_economy' }, 'GER-1933-01': { power: 'one_party_state' },
  'TUR-1922-11': { power: 'one_party_state' }, 'CHN-1949-10': { power: 'one_party_state' },
};
const st = createGame({ mode: 'historical', seed: 1, player: null });
const regionAt = (lat: number, lon: number) => {
  const x0 = Math.floor((lon + 180) * CPD), y0 = Math.floor((LAT0 - lat) * CPD);
  for (let R = 0; R <= 40; R++) for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
    if (Math.max(Math.abs(dx), Math.abs(dy)) !== R) continue; const y = y0 + dy; if (y < 0 || y >= H) continue; const x = ((x0 + dx) % W + W) % W;
    const v = grid[y * W + x]; if (v && v !== 0xffff && st.regions[v - 1]) return st.regions[v - 1].id;
  }
  return null;
};
const cityOf = (cap: string) => cap.split(/[(;]/)[0].trim().replace(/ \(.*$/, '');
const src = JSON.parse(readFileSync(new URL('../../historical_data/research_staging/CG41_REGIME_CHANGES_1836_1991.json', import.meta.url), 'utf8'));
const out: unknown[] = []; const skipped: string[] = []; const droppedLaws: string[] = [];
for (const e of src.events) {
  if (DEFER.has(e.id)) { skipped.push(e.id); continue; }
  const city = cityOf(e.capitalHistorical);
  const capitalRegion = OVERRIDE[city] ?? (CITY[city] ? regionAt(CITY[city][0], CITY[city][1]) : null);
  if (!capitalRegion) { skipped.push(`${e.id} (no capital ${city})`); continue; }
  const laws: Record<string, string> = {};
  for (const [g, v] of Object.entries<any>(e.lawChanges)) {
    const to = typeof v === 'string' ? v : v?.to;
    if (to && (REFORMABLE_LAWS as any)[g]?.includes(to)) laws[g] = to; else if (to) droppedLaws.push(`${e.id}:${g}=${to}`);
  }
  Object.assign(laws, LAW_OVERRIDE[e.id] ?? {});
  const [en, vi] = NAME_OVERRIDE[e.id] ?? [e.entityAfter.name_en, e.entityAfter.name_vi];
  out.push({ id: e.id, date: e.date, capitalRegion, rename: RENAME.has(e.id), name_en: en, name_vi: vi, type: e.eventType, laws,
    independence: INDEPENDENCE_CULTURES[e.id] ?? null, sources: e.sources, quality: e.quality });
}
out.sort((a: any, b: any) => a.date.localeCompare(b.date));
writeFileSync(new URL('../../historical_data/history/regime_changes.json', import.meta.url), JSON.stringify({
  description: 'REGIME-01a Historical Mode regime changes and state formations 1836-1991, generated by tools/data/build-regimes.ts from ChatGPT research CG-41 (sources and notes in historical_data/research_staging/CG41_REGIME_CHANGES_1836_1991.json). Applied on the date to the state holding capitalRegion (its own capital or home territory). laws keep only existing engine law values; independence events form a new state from the listed cultures\' regions of the holder.',
  deferred: skipped, droppedLawValues: droppedLaws, events: out,
}, null, 1) + '\n');
console.log(out.length, 'events; deferred', skipped.length, '; dropped law values', droppedLaws.length);
for (const e of out as any[]) console.log(e.date, e.id, e.capitalRegion, e.name_vi.slice(0, 40));
