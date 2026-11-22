// ECON-CAL-02 calibration report (desktop, deterministic): historical seed 1 by default.
// Prints CG-23/CG-24 constraint metrics and market balance so calibration changes can be compared.
//   npx tsx tools/calib-report.ts [months=12] [seed=1]
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { stepMonth } from '../src/engine/simulation';
import { LEVEL_WORKERS } from '../src/engine/systems/economy';
loadNodeData();
const months = Number(process.argv[2] ?? 12); const seed = Number(process.argv[3] ?? 1);
const st = createGame({ mode: 'historical', seed, player: null });
const gbrMillWorkers = st.regions.filter((r) => r.owner === 'GBR').reduce((s, r) => s + r.buildings.textile_mill, 0) * LEVEL_WORKERS;
while (st.tick < months) stepMonth(st);
const cotton = Object.entries(st.marketStats).map(([id, m]) => ({ id, ...m.cotton }));
const worldCrop = cotton.reduce((s, r) => s + r.supply, 0);
const gbr = st.marketStats.GBR;
const growers = [...cotton].sort((a, b) => b.supply - a.supply).slice(0, 4).map((r) => `${r.id}:${(r.supply / worldCrop * 100).toFixed(0)}%`);
const agg: Record<string, { s: number; u: number; sh: number; n: number }> = {};
for (const goods of Object.values(st.marketStats)) for (const [g, r] of Object.entries(goods)) { const a = (agg[g] ??= { s: 0, u: 0, sh: 0, n: 0 }); a.s += r.supply; a.u += r.unsold ?? 0; a.sh += r.short; a.n++; }
const alive = Object.values(st.countries).filter((c) => c.alive);
const gdp = alive.reduce((s, c) => s + c.gdp, 0);
const famine = alive.reduce((s, c) => s + c.famine * c.stats.pop, 0) / Math.max(1, alive.reduce((s, c) => s + c.stats.pop, 0));
console.log(JSON.stringify({
  months, seed, worldGDP_B: +(gdp / 1e9).toFixed(1), popWeightedFamine: +famine.toFixed(3),
  gbrStartMillWorkers: gbrMillWorkers, cg24_gb_textile_factory_hands_1835: 355373,
  gbrCottonDemandShareOfWorldCrop: +((gbr.cotton.demand) / worldCrop).toFixed(3), cg23_target: '0.33-0.36',
  topCottonGrowers: growers, cg23_usa_share_1834: 0.51,
  prices_GBR: { cotton: +st.marketPrices.GBR.cotton.toFixed(2), textiles: +st.marketPrices.GBR.textiles.toFixed(2), grain: +st.marketPrices.GBR.grain.toFixed(2) },
  unsoldPct: Object.fromEntries(Object.entries(agg).map(([g, a]) => [g, Math.round(a.u / Math.max(1, a.s) * 100)])),
  meanShortPct: Object.fromEntries(Object.entries(agg).map(([g, a]) => [g, Math.round(a.sh / a.n * 100)])),
}, null, 0));
