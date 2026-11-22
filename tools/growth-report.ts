// ECON-GROWTH report: GDP per capita trajectory vs MPD2023 benchmarks (CG-26), measured on each
// country's 1836 home territory (regions it owned at game start and still owns), so annexations
// such as British India do not distort the per-capita series. Ratios to the first year only.
//   npx tsx tools/growth-report.ts [endYear=1913] [seed=1]
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { stepMonth } from '../src/engine/simulation';
import { LEVEL_WORKERS } from '../src/engine/systems/economy';
loadNodeData();
const end = Number(process.argv[2] ?? 1913); const seed = Number(process.argv[3] ?? 1);
const st = createGame({ mode: 'historical', seed, player: null });
const ids = ['GBR', 'FRA', 'PRU', 'USA', 'QNG', 'EIC', 'JAP', 'BRA', 'RUS', 'TUR'];
const home: Record<string, Set<string>> = {};
for (const id of ids) home[id] = new Set(st.regions.filter((r) => r.owner === id).map((r) => r.id));
const FACTORY = ['textile_mill', 'ironworks', 'tool_works', 'arms_works', 'luxury_workshop'] as const;
const measure = (id: string) => {
  const regs = st.regions.filter((r) => home[id].has(r.id) && r.owner === id);
  if (!regs.length) return null;
  const pop = regs.reduce((s, r) => s + r.pop, 0);
  const gdp = regs.reduce((s, r) => s + r.output * 12, 0);
  const jobs = regs.reduce((s, r) => s + FACTORY.reduce((a, b) => a + r.buildings[b], 0) * LEVEL_WORKERS, 0);
  const rail = regs.reduce((s, r) => s + r.buildings.railway, 0);
  return { pc: gdp / Math.max(1, pop), pop, factoryShare: jobs / Math.max(1, pop * 0.45), rail, techs: st.countries[id].techs.length, lit: st.countries[id].stats.literacy };
};
for (let i = 0; i < 12; i++) stepMonth(st);
const base: Record<string, ReturnType<typeof measure>> = {}; for (const id of ids) base[id] = measure(id);
const marks = new Set([1840, 1850, 1860, 1870, 1880, 1890, 1900, 1913].filter((y) => y <= end));
console.log(JSON.stringify({ year: 1837, ...Object.fromEntries(ids.map((id) => { const m = base[id]; return [id, m && { pcX: 1, fac: +m.factoryShare.toFixed(4), rail: m.rail, techs: m.techs, lit: +m.lit.toFixed(2) }]; })) }));
while (st.date.y < end || st.date.m < 2) {
  stepMonth(st);
  if (st.date.m === 1 && marks.has(st.date.y)) {
    console.log(JSON.stringify({ year: st.date.y, ...Object.fromEntries(ids.map((id) => { const m = measure(id); const b = base[id]; return [id, m && b && { pcX: +(m.pc / b.pc).toFixed(3), popX: +(m.pop / b.pop).toFixed(2), fac: +m.factoryShare.toFixed(4), rail: m.rail, techs: m.techs, lit: +m.lit.toFixed(2) }]; })) }));
  }
}
