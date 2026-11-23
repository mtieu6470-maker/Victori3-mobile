// BLOC-02: turn ChatGPT's CG-46 research (docs/research/history/CG46_COLD_WAR_BLOCS.json) into
// historical_data/diplomacy/blocs.json. Military alliances become alliance treaties in Historical Mode; each
// member is the holder of its capital region (map-grid lookup of the city). NATO's post-Cold-War accessions
// (outside CG-46's period) are kept from the curated list. Camps prevent membership of rival blocs at once.
// Economic blocs and political organisations wait for member ISO codes/coordinates (CG-46b).
//   npx tsx tools/data/build-blocs.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { loadNodeData } from '../../src/engine/node';
import { createGame } from '../../src/engine/init';

const CITY: Record<string, [number, number]> = {
  Ankara: [39.93, 32.86], 'Asunción': [-25.26, -57.58], Athens: [37.98, 23.73], Baghdad: [33.31, 44.36], Bangkok: [13.75, 100.5], Beijing: [39.9, 116.4],
  'Bogotá': [4.71, -74.07], Brussels: [50.85, 4.35], Bucharest: [44.43, 26.1], Budapest: [47.5, 19.04], 'Buenos Aires': [-34.6, -58.38], Canberra: [-35.28, 149.13],
  Caracas: [10.48, -66.9], Copenhagen: [55.68, 12.57], 'Guatemala City': [14.63, -90.51], Hanoi: [21.03, 105.85], Havana: [23.11, -82.37], Karachi: [24.86, 67.0],
  'La Paz': [-16.5, -68.15], Lima: [-12.05, -77.04], Lisbon: [38.72, -9.14], London: [51.51, -0.13], Madrid: [40.42, -3.7], Managua: [12.11, -86.24], Manila: [14.6, 120.98],
  'Mexico City': [19.43, -99.13], Montevideo: [-34.9, -56.16], Moscow: [55.76, 37.62], Oslo: [59.91, 10.75], Ottawa: [45.42, -75.7], 'Panama City': [8.98, -79.52],
  Paris: [48.86, 2.35], 'Port-au-Prince': [18.59, -72.31], Prague: [50.08, 14.44], Quito: [-0.18, -78.47], 'Rio de Janeiro': [-22.91, -43.17], Rome: [41.9, 12.5],
  'San José': [9.93, -84.08], 'San Salvador': [13.69, -89.22], Santiago: [-33.45, -70.67], 'Santo Domingo': [18.49, -69.93], Seoul: [37.57, 126.98], Sofia: [42.7, 23.32],
  Taipei: [25.03, 121.57], Tegucigalpa: [14.07, -87.19], Tehran: [35.69, 51.39], 'The Hague': [52.07, 4.3], Tirana: [41.33, 19.82], Tokyo: [35.68, 139.69],
  Warsaw: [52.23, 21.01], Wellington: [-41.29, 174.78],
};
const OVERRIDE: Record<string, string> = { 'Washington, D.C.': 'USA_MAR', Luxembourg: 'BEL_LUX', 'Reykjavík': 'DEN_ICE', Bonn: 'PRU_RHI', 'East Berlin': 'PRU_BRA' };
const CAMP: Record<string, 'west' | 'east'> = { WARSAW_PACT: 'east', SINO_SOVIET_1950: 'east', SOVIET_VIETNAM_1978: 'east' };

const W = 8192, CPD = W / 360, H = Math.round(170 * CPD), LAT0 = 85;
const runs = new Uint16Array(readFileSync(new URL('../../public/generated/map.bin', import.meta.url)).buffer.slice(0));
const grid = new Uint16Array(W * H); { let k = 0; for (let i = 0; i < runs.length; i += 2) { grid.fill(runs[i], k, k + runs[i + 1]); k += runs[i + 1]; } }
loadNodeData();
const st = createGame({ mode: 'historical', seed: 1, player: null });
const regionAt = (lat: number, lon: number) => {
  const x0 = Math.floor((lon + 180) * CPD), y0 = Math.floor((LAT0 - lat) * CPD);
  for (let R = 0; R <= 40; R++) for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
    if (Math.max(Math.abs(dx), Math.abs(dy)) !== R) continue; const y = y0 + dy; if (y < 0 || y >= H) continue; const x = ((x0 + dx) % W + W) % W;
    const v = grid[y * W + x]; if (v && v !== 0xffff && st.regions[v - 1]) return st.regions[v - 1].id;
  }
  return null;
};
const regionOf = (city: string) => OVERRIDE[city] ?? (CITY[city] ? regionAt(...CITY[city]) : null);

const src = JSON.parse(readFileSync(new URL('../../docs/research/history/CG46_COLD_WAR_BLOCS.json', import.meta.url), 'utf8'));
const curated = JSON.parse(readFileSync(new URL('../../historical_data/diplomacy/blocs.json', import.meta.url), 'utf8'));
const skipped: string[] = []; const blocs: unknown[] = [];
for (const o of src.organizations) {
  if (o.type !== 'military_alliance') continue;
  const members: { capital: string; from: string; to?: string; name: string }[] = [];
  for (const m of o.members) {
    const capital = regionOf(m.capitalHistorical);
    if (!capital) { skipped.push(`${o.id}:${m.name} (${m.capitalHistorical})`); continue; }
    // year-only dates (e.g. Pakistan leaving SEATO in 1973) take 1 January of that year
    const day = (x: string) => (/^\d{4}$/.test(x) ? `${x}-01-01` : /^\d{4}-\d{2}$/.test(x) ? `${x}-01` : x);
    members.push({ capital, from: day(m.from), ...(m.to ? { to: day(m.to) } : {}), name: m.name });
  }
  // NATO after the Cold War (outside CG-46's period): keep the curated accessions from 1990 on
  if (o.id === 'NATO') for (const m of curated.blocs.find((b: any) => b.id === 'NATO')?.members ?? []) if (m.from >= '1990-01-01' && !members.some((x) => x.capital === m.capital)) members.push(m);
  blocs.push({ id: o.id, name_en: o.name_en, name_vi: o.name_vi, camp: CAMP[o.id] ?? 'west', founded: o.effective ?? o.founded, ...(o.dissolved ? { dissolved: o.dissolved } : {}), sources: [`CG-46 ${o.id}`], members });
}
// BLOC-03 (CG-46b): economic blocs and political organisations — membership by capital coordinates; the EEC's
// customs union (1 July 1968 for the founders, accession dates for later members) becomes a real common market.
const organisations: unknown[] = [];
for (const o of src.organizations) {
  if (o.type === 'military_alliance') continue;
  const members: { capital: string; from: string; to?: string; name: string; customsUnionFrom?: string }[] = [];
  const day = (x: string) => (/^\d{4}$/.test(x) ? `${x}-01-01` : /^\d{4}-\d{2}$/.test(x) ? `${x}-01` : x);
  for (const m of o.members) {
    const capital = typeof m.capitalLat === 'number' ? (OVERRIDE[m.capitalHistorical] ?? regionAt(m.capitalLat, m.capitalLon)) : regionOf(m.capitalHistorical);
    if (!capital) { skipped.push(`${o.id}:${m.name}`); continue; }
    members.push({ capital, from: day(m.from), ...(m.to ? { to: day(m.to) } : {}), name: m.name, ...(m.customsUnionFrom ? { customsUnionFrom: day(m.customsUnionFrom) } : {}) });
  }
  organisations.push({ id: o.id, name_en: o.name_en, name_vi: o.name_vi, type: o.type, founded: o.effective ?? o.founded, ...(o.dissolved ? { dissolved: o.dissolved } : {}), sources: [`CG-46 ${o.id}`, 'CG-46b member coordinates'], members });
}
writeFileSync(new URL('../../historical_data/diplomacy/blocs.json', import.meta.url), JSON.stringify({
  description: 'BLOC-01/02: Cold War military alliances in Historical Mode, generated by tools/data/build-blocs.ts from ChatGPT CG-46 (docs/research/history/CG46_COLD_WAR_BLOCS.json); NATO accessions after 1990 curated by Claude. Members are the holders of the listed capital regions during their membership (own capital or home territory). camp: west/east — a country is never in blocs of both camps. The player is never enrolled automatically.',
  skipped, blocs, organisations }, null, 1) + '\n');
console.log(`blocs: ${blocs.length}; organisations: ${organisations.length}; skipped ${skipped.length}: ${skipped.join(', ')}`);
