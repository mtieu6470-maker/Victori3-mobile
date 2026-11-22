// TECH-01 / ECON-GROWTH long-run sanity check: runs the historical campaign to its final year and
// prints real GDP per capita ratios (home territory, vs January 1837), technology counts, population
// and the wall-clock cost of each simulated decade. Not a calibration target beyond 1913 (MPD
// benchmarks after 1913 are not yet in the evidence set).
//   npx tsx tools/longrun-report.ts [endYear=2026] [seed=1]
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { stepMonth } from '../src/engine/simulation';
loadNodeData();
const end = Number(process.argv[2] ?? 2026); const seed = Number(process.argv[3] ?? 1);
const st = createGame({ mode: 'historical', seed, player: null });
const ids = ['GBR', 'FRA', 'PRU', 'USA', 'QNG', 'EIC', 'JAP', 'RUS'];
const home: Record<string, Set<string>> = {};
for (const id of ids) home[id] = new Set(st.regions.filter((r) => r.owner === id).map((r) => r.id));
const pc = (id: string) => { const regs = st.regions.filter((r) => home[id].has(r.id)); const pop = regs.reduce((s, r) => s + r.pop, 0); return regs.reduce((s, r) => s + (r.outputReal ?? r.output) * 12, 0) / Math.max(1, pop); };
while (st.date.y < 1837) stepMonth(st);
const base = Object.fromEntries(ids.map((id) => [id, pc(id)]));
let t0 = performance.now();
for (let y = 1850; y <= end; y += (y < 1910 ? 20 : 25)) {
  const target = Math.min(y, end);
  while (st.date.y < target) stepMonth(st);
  const ms = performance.now() - t0; t0 = performance.now();
  const alive = Object.values(st.countries).filter((c) => c.alive);
  console.log(JSON.stringify({
    year: st.date.y, worldPopM: Math.round(st.regions.reduce((s, r) => s + r.pop, 0) / 1e6), alive: alive.length,
    pcX: Object.fromEntries(ids.map((id) => [id, +(pc(id) / base[id]).toFixed(2)])),
    techs: Object.fromEntries(ids.map((id) => [id, st.countries[id]?.alive ? st.countries[id].techs.length : null])),
    msPerMonth: +(ms / Math.max(1, (target - (y < 1910 ? y - 20 : y - 25)) * 12)).toFixed(1),
  }));
  if (target >= end) break;
}
