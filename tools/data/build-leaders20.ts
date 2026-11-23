// LEAD-01: turn ChatGPT's CG-43 staging research (historical_data/research_staging/CG43_LEADERS_1900_2026.json)
// into historical_data/leaders/leaders_20c.json for Historical Mode. Each record is tied to the capital region
// of its state in that period (map-grid lookup of the city); the engine gives it to the holder of that region
// while the country follows the historical course (src/engine/systems/leaders20.ts).
// CG-43b (MSG-098) completed the rosters. FRG/GDR and South Vietnam wait for the partitions; ROC after 1949 (Taiwan) is left out.
//   npx tsx tools/data/build-leaders20.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { loadNodeData } from '../../src/engine/node';
import { createGame } from '../../src/engine/init';

const CITY: Record<string, [number, number]> = {
  'Saint Petersburg': [59.93, 30.34], Moscow: [55.76, 37.62], Berlin: [52.52, 13.4], Paris: [48.86, 2.35], Vichy: [46.13, 3.43], Rome: [41.9, 12.5],
  Istanbul: [41.01, 28.98], Ankara: [39.93, 32.86], Tokyo: [35.68, 139.69], Beijing: [39.9, 116.4], Nanjing: [32.06, 118.8], Madrid: [40.42, -3.7],
  Vienna: [48.21, 16.37], Hue: [16.46, 107.59], Hanoi: [21.03, 105.85], 'New Delhi': [28.61, 77.21], Warsaw: [52.23, 21.01], Helsinki: [60.17, 24.94], London: [51.51, -0.13],
};
const OVERRIDE: Record<string, string> = { Washington: 'USA_MAR' };
/** Capital city of each CG-43 entity by period: [until (exclusive, ISO date) or null, city]. */
const CAPITALS: Record<string, [string | null, string][]> = {
  RUS: [['1918-03-12', 'Saint Petersburg'], [null, 'Moscow']], USSR: [[null, 'Moscow']], GER: [[null, 'Berlin']], FRA: [['1940-07-10', 'Paris'], ['1944-06-01', 'Vichy'], [null, 'Paris']],
  ITA: [[null, 'Rome']], TUR: [['1923-10-13', 'Istanbul'], [null, 'Ankara']], JPN: [[null, 'Tokyo']], QNG: [[null, 'Beijing']], ROC: [['1928-06-15', 'Beijing'], ['1949-12-08', 'Nanjing']],
  PRC: [[null, 'Beijing']], SPA: [[null, 'Madrid']], AHM: [[null, 'Vienna']], AUT: [[null, 'Vienna']], VNM: [['1945-08-26', 'Hue'], [null, 'Hanoi']], DRV: [[null, 'Hanoi']],
  IND: [[null, 'New Delhi']], POL: [[null, 'Warsaw']], FIN: [[null, 'Helsinki']], GBR: [[null, 'London']], USA: [[null, 'Washington']], JAP: [[null, 'Tokyo']],
};
// FRG/GDR and the South Vietnamese states (SVN, RVN, PRG) wait for the partitions (WW-01c, deferred CG-41 events).
const SKIP = new Set(['FRG', 'GDR', 'SVN', 'RVN', 'PRG']);
/** Records left out: the clandestine Indochinese Communist Party leaders before the 1945 revolution held no state. */
const excluded = (l: { entity: string; role: string; from: string }) => l.entity === 'VNM' && l.role === 'effective_leader' && l.from < '1945-09-02';

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
const regionOf = (city: string) => OVERRIDE[city] ?? regionAt(...CITY[city]);

const src = JSON.parse(readFileSync(new URL('../../historical_data/research_staging/CG43_LEADERS_1900_2026.json', import.meta.url), 'utf8'));
const out: unknown[] = []; const skipped: string[] = [];
for (const l of src.leaders) {
  if (SKIP.has(l.entity) || excluded(l)) { skipped.push(`${l.entity}:${l.name}`); continue; }
  const periods = CAPITALS[l.entity];
  if (!periods) { skipped.push(`${l.entity}:${l.name} (no capital)`); continue; }
  const period = periods.find(([until]) => until === null || l.from < until);
  if (!period) { skipped.push(`${l.entity}:${l.name} (out of period)`); continue; }
  const capitalRegion = regionOf(period[1]);
  if (!capitalRegion) { skipped.push(`${l.entity}:${l.name} (no region)`); continue; }
  out.push({ capitalRegion, entity: l.entity, name: l.name_vi || l.name, name_en: l.name, born: l.born, died: l.died, from: l.from, to: l.to, end: l.end,
    role: l.role, title_en: l.title_en, title_vi: l.title_vi, sources: l.sources, quality: l.quality });
}
writeFileSync(new URL('../../historical_data/leaders/leaders_20c.json', import.meta.url), JSON.stringify({
  meta: { id: 'leaders_20c', generatedBy: 'tools/data/build-leaders20.ts', source: 'historical_data/research_staging/CG43_LEADERS_1900_2026.json (ChatGPT CG-43, staging cohort; rosters partial per MSG-096)', skipped },
  sources: src.sources, leaders: out }, null, 1) + '\n');
console.log(`leaders_20c: ${out.length} records, ${skipped.length} skipped`);
const regs = new Map<string, number>(); for (const l of out as { capitalRegion: string }[]) regs.set(l.capitalRegion, (regs.get(l.capitalRegion) ?? 0) + 1);
console.log([...regs].map(([r, n]) => `${r}:${n}`).join(' '));
