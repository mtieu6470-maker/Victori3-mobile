// S0-B3 performance harness, Node/server environment (not product code). Runs the audited checkout's own engine
// (createGame + stepMonth, unmodified) and measures, per protocol J (v3.2 §6.5):
//  group 1 — duration of each stepMonth call (p50/p95/p99/max, all ticks and per 10-year window);
//  group 4 — back-to-back compute throughput (months/s), the upper bound of "speed 5" without any UI;
//  plus save serialize/deserialize time and size at several points, and V8 heap after a forced GC.
// Groups 2–3 (main-thread blocking, frames) do not exist in Node and are reported as not_applicable.
// With --per-system the harness wraps each SYSTEMS[i].run in this process only (supplementary breakdown; the main
// timings come from runs without that flag).
// Usage: node --expose-gc --import tsx tools/audit/s0/perf_node.ts <checkout> <mode> <seed> <months> <out.json> [--per-system]
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import os from 'node:os';

const [base, mode, seedS, monthsS, out] = process.argv.slice(2);
const perSystem = process.argv.includes('--per-system');
if (!base || !mode || !seedS || !monthsS || !out) throw new Error('usage: perf_node.ts <checkout> <mode> <seed> <months> <out.json> [--per-system]');
const seed = Number(seedS), months = Number(monthsS);
const imp = (p: string) => import(pathToFileURL(join(base, p)).href);
const gc = (globalThis as any).gc as (() => void) | undefined;

const tLoad0 = performance.now();
const { loadNodeData } = await imp('src/engine/node.ts');
loadNodeData(base);
const { createGame } = await imp('src/engine/init.ts');
const sim = await imp('src/engine/simulation.ts');
const { serialize, deserialize } = await imp('src/engine/save.ts');
const loadMs = performance.now() - tLoad0;

const sysTimes: Record<string, number[]> = {};
if (perSystem) for (const s of sim.SYSTEMS) { const run = s.run; s.run = (st: unknown) => { const a = performance.now(); run(st); (sysTimes[s.name] ??= []).push(performance.now() - a); }; }

const pct = (a: number[], p: number) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return +s[Math.min(s.length - 1, Math.ceil(p * s.length) - 1)].toFixed(3); };
const stats = (a: number[]) => ({ n: a.length, mean: a.length ? +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(3) : null, p50: pct(a, 0.5), p95: pct(a, 0.95), p99: pct(a, 0.99), max: a.length ? +Math.max(...a).toFixed(3) : null });
const heap = () => { gc?.(); const m = process.memoryUsage(); return { heap_used_bytes: m.heapUsed, rss_bytes: m.rss, after_forced_gc: !!gc }; };

const tCreate0 = performance.now();
const st = createGame({ mode, seed, player: null });
const createMs = performance.now() - tCreate0;
const saves: Record<string, unknown>[] = [];
const measureSave = (label: string) => {
  const a = performance.now(); const text = serialize(st); const b = performance.now(); const back = deserialize(text); const c = performance.now();
  saves.push({ at: label, tick: st.tick, date: `${st.date.y}-${String(st.date.m).padStart(2, '0')}`, bytes_utf8: Buffer.byteLength(text, 'utf8'), serialize_ms: +(b - a).toFixed(3), deserialize_ms: +(c - b).toFixed(3), roundtrip_equal: serialize(back) === text });
};
const heapStart = heap();
measureSave('start');
const ticks: number[] = [];
const wall0 = performance.now();
for (let i = 0; i < months; i++) {
  const a = performance.now(); sim.stepMonth(st); ticks.push(performance.now() - a);
  if (i + 1 === Math.floor(months / 2)) measureSave('middle');
}
const wallMs = performance.now() - wall0;
measureSave('end');
const heapEnd = heap();

const windows: Record<string, unknown>[] = [];
for (let k = 0; k < ticks.length; k += 120) windows.push({ ticks: `${k + 1}-${Math.min(k + 120, ticks.length)}`, ...stats(ticks.slice(k, k + 120)) });
const sha = (p: string) => createHash('sha256').update(readFileSync(p)).digest('hex');
let headSha: string | null = null; try { headSha = execFileSync('git', ['-C', base, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(); } catch { /* not a git checkout */ }
const db = JSON.parse(readFileSync(join(base, 'src/generated/db.json'), 'utf8')); delete db.meta.built_at;

const result = {
  schema: 's0-perf-node-v1',
  label: 'BASELINE_ORIGINAL',
  environment: { kind: 'node_server', node: process.version, v8: process.versions.v8, platform: `${os.platform()} ${os.release()}`, arch: os.arch(), cpu_model: os.cpus()[0]?.model ?? null, logical_cpus: os.cpus().length, total_mem_bytes: os.totalmem(), loadavg_at_start: os.loadavg() },
  build: { audited_head: headSha, db_json_sha256: sha(join(base, 'src/generated/db.json')), db_json_sha256_without_built_at: createHash('sha256').update(JSON.stringify(db)).digest('hex'), map_json_sha256: sha(join(base, 'src/generated/map.json')), harness_sha256: sha(new URL(import.meta.url).pathname) },
  run: { mode, seed, player: null, months, per_system_wrappers: perSystem, start_tick: 0, end_tick: st.tick, end_date: `${st.date.y}-${String(st.date.m).padStart(2, '0')}`, started_at: new Date(Date.now() - wallMs).toISOString(), countries_alive_at_end: Object.values(st.countries as Record<string, { alive: boolean }>).filter((c) => c.alive).length },
  setup_ms: { load_data: +loadMs.toFixed(3), create_game: +createMs.toFixed(3) },
  group1_tick_duration_ms: { all: stats(ticks), excluding_first_12: stats(ticks.slice(12)), by_120_ticks: windows },
  group2_main_thread_block: 'not_applicable (Node has no UI thread; see the desktop report)',
  group3_frames: 'not_applicable (no rendering in Node)',
  group4_throughput: { months_per_second_back_to_back: +(months / (wallMs / 1000)).toFixed(2), wall_ms: +wallMs.toFixed(1), note: 'upper bound of compute without UI; the baseline UI runs at most one tick per animation frame (src/ui/game/controller.ts:73-77)' },
  save: saves,
  memory: { start: heapStart, end: heapEnd, note: 'V8 heap of this Node process; not comparable to Android WebView memory' },
  per_system_ms: perSystem ? Object.fromEntries(Object.entries(sysTimes).map(([k, v]) => [k, stats(v)])) : 'not_measured_in_this_run',
};
writeFileSync(out, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ mode, seed, months, tick_ms: result.group1_tick_duration_ms.all, months_per_s: result.group4_throughput.months_per_second_back_to_back, save: saves.map((s) => [s.at, s.bytes_utf8, s.serialize_ms, s.deserialize_ms, s.roundtrip_equal]) }));
