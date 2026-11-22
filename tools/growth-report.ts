// ECON-GROWTH scorecard: engine GDP-per-capita growth vs MPD2023 (CG-26 / CG-27), on identical
// start and end years for both series (MSG-041).
//
//   npx tsx tools/growth-report.ts [seed=1] [endYear=1913|1950|1980|2000|2022] [--json out.json]
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
import { readFileSync, writeFileSync } from 'node:fs';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { stepMonth } from '../src/engine/simulation';

/**
 * MPD2023 GDP per capita (2011 international-$), read from the checksummed extract of the original
 * workbook (docs/research/data/MPD2023_SUBSET_1820_2022.csv; manifest CG29_DATA_MANIFEST.json).
 * Engine country → MPD series. `null` = no observation in MPD2023 for that year (never interpolated).
 */
const SERIES: Record<string, { code: string; label: string }> = {
  GBR: { code: 'GBR', label: 'United Kingdom' }, FRA: { code: 'FRA', label: 'France' },
  PRU: { code: 'DEU', label: 'Germany (engine: Prussia)' }, USA: { code: 'USA', label: 'United States' },
  QNG: { code: 'CHN', label: 'China (engine: Qing)' }, EIC: { code: 'IND', label: 'India (engine: EIC home territory)' },
  JAP: { code: 'JPN', label: 'Japan' }, BRA: { code: 'BRA', label: 'Brazil' },
  RUS: { code: 'RUS', label: 'Russian Federation series (engine: Russian Empire)' }, TUR: { code: 'TUR', label: 'Turkey (engine: Ottoman Empire)' },
};
const ALL_YEARS = [1836, 1850, 1870, 1900, 1913, 1950, 1980, 2000, 2022] as const;
function loadMpd(): Record<string, { label: string; values: Record<number, number | null> }> {
  const text = readFileSync(new URL('../docs/research/data/MPD2023_SUBSET_1820_2022.csv', import.meta.url), 'utf8');
  const v = new Map<string, number>();
  for (const line of text.trim().split('\n').slice(1)) {
    const [code, , , year, gdppc] = line.split(',');
    if (gdppc !== '') v.set(`${code}|${year}`, Number(gdppc));
  }
  return Object.fromEntries(Object.entries(SERIES).map(([id, s]) => [id, { label: s.label, values: Object.fromEntries(ALL_YEARS.map((y) => [y, v.get(`${s.code}|${y}`) ?? null])) }]));
}
export const MPD2023 = loadMpd();

export function runGrowthScorecard(seed = 1, endYear = 1913) {
  const YEARS = ALL_YEARS.filter((y) => y <= endYear);
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
  const final = rows.filter((r) => r.end === YEARS[YEARS.length - 1]);
  const mean = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / Math.max(1, xs.length);
  const summary = {
    endYear: YEARS[YEARS.length - 1], meanAbsLogErrorEnd_all: +mean(final.map((r) => Math.abs(r.logError as number))).toFixed(3),
    meanAbsLogErrorEnd_industrialisers: +mean(final.filter((r) => ['GBR', 'FRA', 'PRU', 'USA'].includes(r.id as string)).map((r) => Math.abs(r.logError as number))).toFixed(3),
    meanAbsLogErrorEnd_others: +mean(final.filter((r) => !['GBR', 'FRA', 'PRU', 'USA'].includes(r.id as string)).map((r) => Math.abs(r.logError as number))).toFixed(3),
  };
  return { seed, territory: 'engine: 1836 home territory still owned; MPD2023: national aggregate (coverage differs)', engine, rows, summary };
}

if (process.argv[1]?.endsWith('growth-report.ts')) {
  const args = process.argv.slice(2);
  const nums = args.filter((a) => /^\d+$/.test(a)).map(Number);
  const seed = nums[0] ?? 1; const endYear = nums[1] ?? 1913;
  const out = runGrowthScorecard(seed, endYear);
  for (const r of out.rows) console.log(`${String(r.id).padEnd(4)} ${r.base}->${r.end}  engine ×${r.engineRatio} (${r.engineAnnualPct}%/y)  MPD ×${r.mpdRatio} (${r.mpdAnnualPct}%/y)  logErr ${r.logError}`);
  console.log(JSON.stringify(out.summary));
  const j = args.indexOf('--json');
  if (j >= 0 && args[j + 1]) writeFileSync(args[j + 1], JSON.stringify(out, null, 1) + '\n');
}
