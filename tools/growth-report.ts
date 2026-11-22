// ECON-GROWTH report: GDP per capita trajectory vs MPD2023 benchmarks (CG-26). Ratios to 1836 only.
//   npx tsx tools/growth-report.ts [endYear=1913] [seed=1]
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { stepMonth } from '../src/engine/simulation';
loadNodeData();
const end = Number(process.argv[2] ?? 1913); const seed = Number(process.argv[3] ?? 1);
const st = createGame({ mode: 'historical', seed, player: null });
const ids = ['GBR', 'FRA', 'PRU', 'USA', 'QNG', 'EIC', 'JAP', 'BRA', 'RUS', 'TUR'];
const pc = (id: string) => { const c = st.countries[id]; if (!c?.alive) return null; const pop = st.regions.filter((r) => r.owner === id).reduce((s, r) => s + r.pop, 0); return c.gdp / Math.max(1, pop); };
const world = () => { const alive = Object.values(st.countries).filter((c) => c.alive); const pop = st.regions.reduce((s, r) => s + r.pop, 0); return { gdp: alive.reduce((s, c) => s + c.gdp, 0), pop }; };
const base: Record<string, number | null> = {}; for (let i = 0; i < 12; i++) stepMonth(st); // let smoothed gdp settle
for (const id of ids) base[id] = pc(id); const w0 = world();
const out: Record<string, unknown>[] = [];
const marks = new Set([1840, 1850, 1860, 1870, 1880, 1890, 1900, 1913].filter((y) => y <= end));
while (st.date.y < end || st.date.m < 12) {
  stepMonth(st);
  if (st.date.m === 1 && marks.has(st.date.y)) {
    const w = world();
    const row: Record<string, unknown> = { year: st.date.y, worldGdpX: +(w.gdp / w0.gdp).toFixed(3), worldPopX: +(w.pop / w0.pop).toFixed(3), worldPcX: +((w.gdp / w.pop) / (w0.gdp / w0.pop)).toFixed(3) };
    for (const id of ids) { const v = pc(id); row[id] = v && base[id] ? +(v / base[id]!).toFixed(3) : null; }
    out.push(row); console.log(JSON.stringify(row));
  }
}
