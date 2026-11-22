// ECON-GROWTH scorecard: engine GDP-per-capita growth vs MPD2023 (CG-26 / CG-27), on identical
// start and end years for both series (MSG-041).
//
//   npx tsx tools/growth-report.ts [seed=1] [--json out.json]
//
// Definitions (read before interpreting errors):
// - Engine series: REAL GDP per capita (regional value added at constant 1836 base prices,
//   Region.outputReal; MPD2023 is real GDP too) over each country's
//   1836 HOME TERRITORY — the regions it owned at game start and still owns at the sample date.
//   MPD2023 series are national historical aggregates whose territory coverage differs (e.g. "India"
//   is not the East India Company's 1836 holdings; "Germany" is not Prussia). Differences therefore
//   mix productivity, territory coverage and population weights; they are not productivity-only.
// - The engine is calibrated to 1836 and sampled at January of each year; its "1836" point is
//   January 1837 (after the first year of smoothing), its other points January of the named year.
// - A pair (base → end) is scored only when MPD2023 has an observation for both years. Countries
//   without an exact 1836 MPD observation (China, India, Japan, Brazil) are scored from 1850;
//   Russia and Turkey from 1870. No MPD value is interpolated.
// - Reported: ratio end/base for both series, annualised growth (%/year), and log error
//   ln(engine ratio / MPD ratio). This is GDP per capita, not labour productivity or TFP.
import { writeFileSync } from 'node:fs';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { stepMonth } from '../src/engine/simulation';

/** MPD2023 GDP per capita, 2011 international-$ (CG-26 §2.1). `null` = no verified observation. */
export const MPD2023: Record<string, { label: string; values: Record<number, number | null> }> = {
  GBR: { label: 'United Kingdom', values: { 1836: 3937, 1850: 4332, 1870: 5829, 1900: 7594, 1913: 8212 } },
  FRA: { label: 'France', values: { 1836: 2089, 1850: 2545, 1870: 2990, 1900: 4584, 1913: 5555 } },
  PRU: { label: 'Germany (engine: Prussia)', values: { 1836: 2173, 1850: 2276, 1870: 2931, 1900: 4758, 1913: 5815 } },
  USA: { label: 'United States', values: { 1836: 3470, 1850: 3632, 1870: 4803, 1900: 8038, 1913: 10108 } },
  QNG: { label: 'China (engine: Qing)', values: { 1836: null, 1850: 858, 1870: 945, 1900: 972, 1913: 985 } },
  EIC: { label: 'India (engine: EIC home territory)', values: { 1836: null, 1850: 947, 1870: 850, 1900: 955, 1913: 1073 } },
  JAP: { label: 'Japan', values: { 1836: null, 1850: 1436, 1870: 1580, 1900: 2123, 1913: 2431 } },
  BRA: { label: 'Brazil', values: { 1836: null, 1850: 867, 1870: 1084, 1900: 874, 1913: 1046 } },
  RUS: { label: 'Russia', values: { 1836: null, 1850: null, 1870: 789, 1900: 1049, 1913: 1163 } },
  TUR: { label: 'Ottoman Empire / Turkey', values: { 1836: null, 1850: null, 1870: 1165, 1900: null, 1913: 1473 } },
};
const YEARS = [1836, 1850, 1870, 1900, 1913] as const;

export function runGrowthScorecard(seed = 1) {
  loadNodeData();
  const st = createGame({ mode: 'historical', seed, player: null });
  const ids = Object.keys(MPD2023);
  const home: Record<string, Set<string>> = {};
  for (const id of ids) home[id] = new Set(st.regions.filter((r) => r.owner === id).map((r) => r.id));
  const pc = (id: string) => {
    const regs = st.regions.filter((r) => home[id].has(r.id) && r.owner === id);
    const pop = regs.reduce((s, r) => s + r.pop, 0);
    return regs.length && pop > 0 ? regs.reduce((s, r) => s + (r.outputReal ?? r.output) * 12, 0) / pop : null;
  };
  const engine: Record<string, Record<number, number | null>> = Object.fromEntries(ids.map((id) => [id, {}]));
  const sample = (year: number) => { for (const id of ids) engine[id][year] = pc(id); };
  while (st.date.y < 1837) stepMonth(st);
  sample(1836);
  for (const y of YEARS.slice(1)) { while (st.date.y < y) stepMonth(st); sample(y); }

  const rows: Record<string, unknown>[] = [];
  for (const id of ids) {
    const mpd = MPD2023[id].values;
    const base = YEARS.find((y) => mpd[y] != null && engine[id][y] != null);
    if (base === undefined) continue;
    for (const end of YEARS.filter((y) => y > base && mpd[y] != null && engine[id][y] != null)) {
      const span = end - base;
      const eR = engine[id][end]! / engine[id][base]!; const mR = mpd[end]! / mpd[base]!;
      rows.push({
        id, label: MPD2023[id].label, base, end,
        engineRatio: +eR.toFixed(3), mpdRatio: +mR.toFixed(3),
        engineAnnualPct: +((Math.pow(eR, 1 / span) - 1) * 100).toFixed(2), mpdAnnualPct: +((Math.pow(mR, 1 / span) - 1) * 100).toFixed(2),
        logError: +Math.log(eR / mR).toFixed(3),
      });
    }
  }
  const final = rows.filter((r) => r.end === 1913);
  const mean = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / Math.max(1, xs.length);
  const summary = {
    meanAbsLogError1913_all: +mean(final.map((r) => Math.abs(r.logError as number))).toFixed(3),
    meanAbsLogError1913_industrialisers: +mean(final.filter((r) => ['GBR', 'FRA', 'PRU', 'USA'].includes(r.id as string)).map((r) => Math.abs(r.logError as number))).toFixed(3),
    meanAbsLogError1913_others: +mean(final.filter((r) => !['GBR', 'FRA', 'PRU', 'USA'].includes(r.id as string)).map((r) => Math.abs(r.logError as number))).toFixed(3),
  };
  return { seed, territory: 'engine: 1836 home territory still owned; MPD2023: national aggregate (coverage differs)', engine, rows, summary };
}

if (process.argv[1]?.endsWith('growth-report.ts')) {
  const args = process.argv.slice(2);
  const seed = Number(args.find((a) => /^\d+$/.test(a)) ?? 1);
  const out = runGrowthScorecard(seed);
  for (const r of out.rows) console.log(`${String(r.id).padEnd(4)} ${r.base}->${r.end}  engine ×${r.engineRatio} (${r.engineAnnualPct}%/y)  MPD ×${r.mpdRatio} (${r.mpdAnnualPct}%/y)  logErr ${r.logError}`);
  console.log(JSON.stringify(out.summary));
  const j = args.indexOf('--json');
  if (j >= 0 && args[j + 1]) writeFileSync(args[j + 1], JSON.stringify(out, null, 1) + '\n');
}
