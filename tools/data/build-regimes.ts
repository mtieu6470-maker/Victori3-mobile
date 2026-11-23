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
  // CG-44 (1944-1999)
  Budapest: [47.5, 19.04], Prague: [50.08, 14.44], Bucharest: [44.43, 26.1], Sofia: [42.7, 23.32], Belgrade: [44.79, 20.45], Tirana: [41.33, 19.82],
  Tbilisi: [41.72, 44.79], Minsk: [53.9, 27.57], 'Chișinău': [47.01, 28.86], Baku: [40.41, 49.87], Tashkent: [41.3, 69.24], Bishkek: [42.87, 74.59],
  Yerevan: [40.18, 44.51], Dushanbe: [38.56, 68.79], Ashgabat: [37.95, 58.38], Almaty: [43.24, 76.89], Ljubljana: [46.06, 14.51], Zagreb: [45.81, 15.98],
  Skopje: [42.0, 21.43], Sarajevo: [43.86, 18.41], Bratislava: [48.15, 17.11], Pyongyang: [39.02, 125.75], Taipei: [25.03, 121.57],
};
const OVERRIDE: Record<string, string> = { 'Washington, D.C.': 'USA_MAR', Bratislava: 'AUS_UPH' };
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
// ---- CG-44 (1944-1999): Eastern Bloc, USSR and Yugoslav dissolution, Czechoslovakia, Korea, Vietnam, Taiwan
const SKIP44 = new Set(['KOR-1945-08', 'CIS-1991-12', 'USSR-1991-12-DISSOLVE', 'PRC-1949-10', 'VNM-GENEVA-1954-07', 'VNM-1975-04', 'YUG-SLO-CRO-1991-06', 'CZE-SVK-1993-01',
  'USSR-TJK-1991', 'USSR-EST-1991']); // no Tajik or Estonian region on the 1836 map
const RENAME44 = new Set(['POL-1952-07', 'HUN-1949-08', 'CZE-1960-07', 'ROM-1947-12', 'BUL-1946-09', 'YUG-1945-11', 'YUG-1963-04', 'ALB-1946-01', 'POL-1989-12', 'HUN-1989-10',
  'CZE-1990-04', 'ROM-1989-12', 'BUL-1990-11', 'ALB-1991-04', 'USSR-RUS-FED-1991', 'YUG-FRY-1992-04', 'KOR-ROK-1948-08', 'VNM-RVN-1955-10', 'VNM-1976-07']);
const NAME44: Record<string, [string, string]> = { 'ROM-1989-12': ['Romania', 'Romania'], 'USSR-RUS-FED-1991': ['Russian Federation', 'Liên bang Nga'] };
/** Explicit capitals where CG-44 names two cities or a description. */
const CAPITAL44: Record<string, string> = { 'ROC-1949-12': 'Taipei', 'YUG-FRY-1992-04': 'Belgrade', 'YUG-1990-MULTIPARTY': 'Belgrade' };
/** States formed from explicit regions (partition lines); if the holder's own capital is among them it is renamed instead. */
const REGIONS44: Record<string, string[]> = { 'KOR-PRK-1948-09': ['KOR_PYO', 'KOR_HAM'], 'VNM-DRV-1945-09': ['VNM_HAN', 'VNM_TBC', 'VNM_THN'], 'VNM-SVN-1949-06': ['VNM_HUE', 'VNM_SCE', 'VNM_GDI'], 'ROC-1949-12': ['QNG_TAI'] };
const NAME_REGIONS44: Record<string, [string, string]> = { 'ROC-1949-12': ['Republic of China (Taiwan)', 'Trung Hoa Dân Quốc (Đài Loan)'] };
const FREE = { governance: 'republic', power: 'universal_suffrage', economy: 'interventionism', press: 'free_press' };
const STRONGMAN = { governance: 'republic', power: 'autocracy', economy: 'interventionism', press: 'limited_press' };
const LAW44: Record<string, Record<string, string>> = {
  'USSR-RUS-FED-1991': FREE, 'USSR-LTU-1990': FREE, 'USSR-LVA-1991': FREE, 'USSR-EST-1991': FREE, 'USSR-UKR-1991': FREE, 'USSR-MDA-1991': FREE, 'USSR-GEO-1991': FREE, 'USSR-ARM-1991': FREE,
  'USSR-BLR-1991': STRONGMAN, 'USSR-AZE-1991': STRONGMAN, 'USSR-KAZ-1991': STRONGMAN, 'USSR-UZB-1991': STRONGMAN, 'USSR-TKM-1991': STRONGMAN, 'USSR-TJK-1991': STRONGMAN, 'USSR-KGZ-1991': STRONGMAN,
  'ROC-1949-12': { governance: 'republic', power: 'autocracy', press: 'censorship' }, 'VNM-DRV-1945-09': { governance: 'republic', power: 'one_party_state', press: 'censorship' },
  'VNM-1976-07': { economy: 'command_economy' },
};
/** Defence treaties concluded with the new state (capital regions of the allies): US–ROC Mutual Defense Treaty 1954, US–ROK 1953. */
// Defence treaties now come from CG-46 (historical_data/diplomacy/blocs.json, with their dates).
const ALLIES44: Record<string, string[]> = {};
/** Synthetic events splitting CG-44 records that cover two states (sources as in the parent record). */
const SYNTH44 = [
  { id: 'YUG-SVN-1991-10', parent: 'YUG-SLO-CRO-1991-06', date: '1991-10-08', city: 'Ljubljana', cultures: ['slovene'], en: 'Republic of Slovenia', vi: 'Cộng hòa Slovenia', laws: FREE },
  { id: 'YUG-HRV-1991-10', parent: 'YUG-SLO-CRO-1991-06', date: '1991-10-08', city: 'Zagreb', cultures: ['croat'], en: 'Republic of Croatia', vi: 'Cộng hòa Croatia', laws: FREE },
  { id: 'CSK-SVK-1993-01', parent: 'CZE-SVK-1993-01', date: '1993-01-01', city: 'Bratislava', cultures: ['slovak'], en: 'Slovak Republic', vi: 'Cộng hòa Slovakia', laws: FREE },
  { id: 'CSK-CZE-1993-01', parent: 'CZE-SVK-1993-01', date: '1993-01-01', city: 'Prague', cultures: null, en: 'Czech Republic', vi: 'Cộng hòa Séc', laws: {} },
];
const src44 = JSON.parse(readFileSync(new URL('../../docs/research/history/CG44_POSTWAR_REGIMES_1944_1999.json', import.meta.url), 'utf8'));
const byId44 = new Map<string, any>(src44.events.map((e: any) => [e.id, e]));
const lawsOf = (e: any) => { const l: Record<string, string> = {}; for (const [g, v] of Object.entries<any>(e.lawChanges ?? {})) { const to = typeof v === 'string' ? v : v?.to; if (to && (REFORMABLE_LAWS as any)[g]?.includes(to)) l[g] = to; else if (to) droppedLaws.push(`${e.id}:${g}=${to}`); } return l; };
for (const e of src44.events) {
  if (SKIP44.has(e.id)) { skipped.push(e.id); continue; }
  const city = CAPITAL44[e.id] ?? cityOf(e.capitalHistorical.split('/')[0]);
  const capitalRegion = OVERRIDE[city] ?? (CITY[city] ? regionAt(CITY[city][0], CITY[city][1]) : null);
  if (!capitalRegion) { skipped.push(`${e.id} (no capital ${city})`); continue; }
  const culture = e.id.startsWith('USSR-') && e.id !== 'USSR-RUS-FED-1991' ? e.culturalAssignments?.[0]?.dominantCulture : ({ 'YUG-MKD-1991-11': 'macedonian_slav', 'YUG-BIH-1992-03': 'bosniak' } as Record<string, string>)[e.id];
  const regionsList = REGIONS44[e.id] ?? null;
  const [en, vi] = NAME_REGIONS44[e.id] ?? NAME44[e.id] ?? [e.entityAfter.name_en, e.entityAfter.name_vi];
  out.push({ id: e.id, date: e.date, capitalRegion, rename: RENAME44.has(e.id) || !!culture || !!regionsList, name_en: en, name_vi: vi, type: e.eventType,
    laws: { ...lawsOf(e), ...(LAW44[e.id] ?? {}) }, independence: culture ? [culture] : null, independenceRegions: regionsList, ...(ALLIES44[e.id] ? { allies: ALLIES44[e.id] } : {}), sources: e.sources, quality: e.quality });
}
for (const x of SYNTH44) {
  const p = byId44.get(x.parent);
  out.push({ id: x.id, date: x.date, capitalRegion: OVERRIDE[x.city] ?? regionAt(...CITY[x.city]), rename: true, name_en: x.en, name_vi: x.vi, type: p.eventType, laws: x.laws,
    independence: x.cultures, independenceRegions: null, sources: p.sources, quality: p.quality });
}
// ---- CG-47A (1836-2026): regimes in Latin America, the Middle East, Africa and Asia (capital coordinates given)
const src47 = JSON.parse(readFileSync(new URL('../../docs/research/history/CG47A_REGIMES_WORLD_1836_2026.json', import.meta.url), 'utf8'));
/** Names that describe a period or a government rather than the state (e.g. "Mexico under Porfirio Díaz") keep the state's name. */
const DESCRIPTIVE = /(dưới|thời |theo |Chính quyền|Chính phủ|Hội đồng|Hệ thống|Trật tự|giai đoạn|khôi phục|được khôi phục|sau Cách mạng|Nền Dân chủ|Chế độ|tình trạng|cạnh tranh|chuyển đổi|chuyển tiếp|được quân|tuyên bố|trong giai đoạn|Lãnh thổ tự trị)/;
/** CG-47B: Bangladesh secedes from Pakistan as a state formed from Bengal (effective at the end of the war, 16 Dec 1971). */
const REGIONS47: Record<string, { regions: string[]; date?: string; name?: [string, string] }> = { 'BGD-1971-03': { regions: ['EIC_BEN'], date: '1971-12-16', name: ["People's Republic of Bangladesh", 'Cộng hòa Nhân dân Bangladesh'] } };
const SKIP47 = new Set(['TUR-1923-10']); // duplicate of CG-41 TUR-1922-11 (Republic of Türkiye)
for (const e of src47.events) {
  if (SKIP47.has(e.id)) { skipped.push(e.id); continue; }
  const cc = e.capitalCoordinates;
  // Pakistan's events follow its engine capital (Karachi/Sindh); Islamabad's grid cell falls in Kashmir
  const capitalRegion = e.id.startsWith('PAK-') ? 'SND_HYD' : cc ? regionAt(cc.lat, cc.lon) : null;
  if (!capitalRegion) { skipped.push(`${e.id} (no capital)`); continue; }
  const part = REGIONS47[e.id];
  const [en, vi] = part?.name ?? [e.entityAfter.name_en, e.entityAfter.name_vi];
  out.push({ id: e.id, date: part?.date ?? (e.date.length === 7 ? `${e.date}-01` : e.date), capitalRegion, rename: !!part || !DESCRIPTIVE.test(vi), name_en: en, name_vi: vi, type: e.eventType,
    laws: lawsOf(e), independence: null, independenceRegions: part?.regions ?? null, sources: e.sources, quality: e.quality });
}
out.sort((a: any, b: any) => a.date.localeCompare(b.date));
writeFileSync(new URL('../../historical_data/history/regime_changes.json', import.meta.url), JSON.stringify({
  description: 'REGIME-01a Historical Mode regime changes and state formations 1836-1991, generated by tools/data/build-regimes.ts from ChatGPT research CG-41 (sources and notes in historical_data/research_staging/CG41_REGIME_CHANGES_1836_1991.json). Applied on the date to the state holding capitalRegion (its own capital or home territory). laws keep only existing engine law values; independence events form a new state from the listed cultures\' regions of the holder.',
  deferred: skipped, droppedLawValues: droppedLaws, events: out,
}, null, 1) + '\n');
console.log(out.length, 'events; deferred', skipped.length, '; dropped law values', droppedLaws.length);
for (const e of out as any[]) console.log(e.date, e.id, e.capitalRegion, e.name_vi.slice(0, 40));
