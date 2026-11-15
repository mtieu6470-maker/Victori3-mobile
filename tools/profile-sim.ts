// Per-system timing of the monthly pipeline (P50/P95), used for performance tracking.
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { SYSTEMS } from '../src/engine/simulation';
import { tickToDate } from '../src/engine/core';
import { sampleYear } from '../src/engine/metrics';
const months = Number(process.argv[2] ?? 60);
loadNodeData();
const st = createGame({ mode: (process.argv[3] as any) ?? 'historical', seed: 1, player: null });
const times: Record<string, number[]> = {}; const total: number[] = [];
for (let i = 0; i < months; i++) {
  const t0 = performance.now(); st.tick++; st.date = tickToDate(st.tick);
  for (const s of SYSTEMS) { const a = performance.now(); s.run(st); (times[s.name] ??= []).push(performance.now() - a); }
  if (st.date.m === 1) sampleYear(st);
  total.push(performance.now() - t0);
}
const pct = (a: number[], p: number) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
for (const [k, v] of Object.entries(times)) console.log(k.padEnd(12), 'p50', pct(v, 0.5).toFixed(2), 'p95', pct(v, 0.95).toFixed(2), 'ms');
console.log('TOTAL'.padEnd(12), 'p50', pct(total, 0.5).toFixed(2), 'p95', pct(total, 0.95).toFixed(2), 'ms; countries alive', Object.values(st.countries).filter((c) => c.alive).length);
