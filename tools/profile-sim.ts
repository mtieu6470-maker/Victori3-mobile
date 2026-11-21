// Per-system timing of the monthly pipeline (P50/P95), used for performance tracking.
// Runs the real hourly-canonical scheduler (stepMonth → advanceHour) with per-system timers wrapped
// around the monthly SYSTEMS entries in this process only.
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { SYSTEMS, stepMonth } from '../src/engine/simulation';
const months = Number(process.argv[2] ?? 60);
loadNodeData();
const st = createGame({ mode: (process.argv[3] as any) ?? 'historical', seed: 1, player: null });
const times: Record<string, number[]> = {}; const total: number[] = [];
for (const s of SYSTEMS) { const run = s.run; s.run = (x) => { const a = performance.now(); run(x); (times[s.name] ??= []).push(performance.now() - a); }; }
for (let i = 0; i < months; i++) {
  const t0 = performance.now();
  if (!stepMonth(st)) break;
  total.push(performance.now() - t0);
}
const pct = (a: number[], p: number) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
for (const [k, v] of Object.entries(times)) console.log(k.padEnd(12), 'p50', pct(v, 0.5).toFixed(2), 'p95', pct(v, 0.95).toFixed(2), 'ms');
console.log('TOTAL'.padEnd(12), 'p50', pct(total, 0.5).toFixed(2), 'p95', pct(total, 0.95).toFixed(2), 'ms; countries alive', Object.values(st.countries).filter((c) => c.alive).length);
