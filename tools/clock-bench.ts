// CLOCK-01 desktop benchmark of the hourly-canonical scheduler.
//
//   npx tsx tools/clock-bench.ts [--mode historical] [--seed 1] [--years 0,10,30] [--sample-months 12] [--out file.json]
//
// For each checkpoint year it advances a fresh campaign to that year, then measures, over
// `sample-months` months of real simulation:
//   - cost of a non-boundary hour (clock + empty hourly/daily/weekly phases),
//   - cost of a monthly boundary (all monthly systems, the yearly phase in January, cohort refresh),
//   - projected simulation share of one CPU core at 12h/s and 6h/s
//     (= monthly-boundary cost × boundaries per real second + hour cost × hours per real second),
//   - the worst single monthly boundary, which is the UI-thread frame hitch while the simulation
//     still runs on the UI thread (to be removed by the worker migration, CLOCK-02).
//
// This is DESKTOP Node.js evidence only. It is not Android device evidence, and the late-game
// workload of the finished game (more systems, cohorts, AI, daily flows) is not yet represented.
import { writeFileSync } from 'node:fs';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { advanceHour, hoursToNextMonth, stepMonth } from '../src/engine/simulation';
import { formatDateTime, hourToDateTime } from '../src/engine/clock/calendar';
import type { GameMode } from '../src/engine/types';

const args = process.argv.slice(2);
const arg = (k: string, def: string) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : def; };
const mode = arg('mode', 'historical') as GameMode;
const seed = Number(arg('seed', '1'));
const checkpoints = arg('years', '0,10,30').split(',').map(Number);
const sampleMonths = Number(arg('sample-months', '12'));
const out = arg('out', '');

const pct = (a: number[], p: number) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * s.length))] ?? 0; };
const r3 = (x: number) => Math.round(x * 1000) / 1000;

loadNodeData();
const results: Record<string, unknown>[] = [];
for (const years of checkpoints) {
  const st = createGame({ mode, seed, player: null });
  for (let i = 0; i < years * 12; i++) if (!stepMonth(st)) break;
  const sampledFrom = formatDateTime(hourToDateTime(st.clock.hour));
  const boundaryMs: number[] = []; const hourUs: number[] = [];
  for (let m = 0; m < sampleMonths; m++) {
    const n = hoursToNextMonth(st);
    for (let h = 0; h < n - 1; h++) { const a = performance.now(); advanceHour(st); hourUs.push((performance.now() - a) * 1000); }
    const a = performance.now(); if (!advanceHour(st)) break; boundaryMs.push(performance.now() - a);
  }
  const meanBoundary = boundaryMs.reduce((s, x) => s + x, 0) / Math.max(1, boundaryMs.length);
  const meanHourMs = hourUs.reduce((s, x) => s + x, 0) / Math.max(1, hourUs.length) / 1000;
  const share = (hps: number) => {
    const boundariesPerSecond = hps / (30.436875 * 24); // mean Gregorian month length in hours
    return (meanBoundary * boundariesPerSecond + meanHourMs * hps) / 1000;
  };
  const row = {
    start_year_offset: years,
    sampled_from: sampledFrom,
    sampled_to: formatDateTime(hourToDateTime(st.clock.hour)),
    countries_alive: Object.values(st.countries).filter((c) => c.alive).length,
    cohorts: st.population.cohorts.length,
    monthly_boundary_ms: { n: boundaryMs.length, p50: r3(pct(boundaryMs, 0.5)), p95: r3(pct(boundaryMs, 0.95)), max: r3(Math.max(...boundaryMs)), mean: r3(meanBoundary) },
    non_boundary_hour_us: { n: hourUs.length, p50: r3(pct(hourUs, 0.5)), p95: r3(pct(hourUs, 0.95)), mean: r3(meanHourMs * 1000) },
    projected_cpu_share: { at_12_hps: r3(share(12)), at_6_hps: r3(share(6)), at_48_hps: r3(share(48)) },
  };
  results.push(row);
  console.log(JSON.stringify(row));
}
const report = {
  tool: 'tools/clock-bench.ts', evidence_class: 'desktop-node-only (NOT Android device evidence)',
  node: process.version, platform: `${process.platform}-${process.arch}`, mode, seed, sample_months: sampleMonths, results,
};
if (out) writeFileSync(out, JSON.stringify(report, null, 2) + '\n');
