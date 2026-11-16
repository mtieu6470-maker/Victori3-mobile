// S0-B3 audit tool (not product code). Combines the per-run outputs of perf_node.ts and perf_desktop.ts into
// S0_PERFORMANCE_BASELINE.json, keeping the three environments separate (protocol J: no conversion between them).
// Usage: npx tsx tools/audit/s0/perf_summary.ts <perf dir> <out.json>
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const [dir, out] = process.argv.slice(2);
if (!dir || !out) throw new Error('usage: perf_summary.ts <perf dir> <out.json>');
const files = readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
const load = (f: string) => JSON.parse(readFileSync(join(dir, f), 'utf8'));
const sha = (f: string) => createHash('sha256').update(readFileSync(join(dir, f))).digest('hex');

const nodeRuns = files.filter((f) => /^node_.*_run\d+\.json$/.test(f)).map((f) => ({ f, d: load(f) }));
const byMode: Record<string, unknown> = {};
for (const mode of [...new Set(nodeRuns.map((x) => x.d.run.mode))]) {
  const runs = nodeRuns.filter((x) => x.d.run.mode === mode);
  const vals = (k: 'p50' | 'p95' | 'p99' | 'max') => runs.map((x) => x.d.group1_tick_duration_ms.all[k]);
  const range = (a: number[]) => ({ min: Math.min(...a), max: Math.max(...a) });
  byMode[mode] = {
    runs: runs.map((x) => ({ file: x.f, sha256: sha(x.f), tick_ms: x.d.group1_tick_duration_ms.all, months_per_second: x.d.group4_throughput.months_per_second_back_to_back, end_date: x.d.run.end_date, countries_alive_at_end: x.d.run.countries_alive_at_end, save: x.d.save, heap_used_end: x.d.memory.end.heap_used_bytes })),
    tick_ms_range_across_runs: { p50: range(vals('p50')), p95: range(vals('p95')), p99: range(vals('p99')), max: range(vals('max')) },
    months_per_second_range: range(runs.map((x) => x.d.group4_throughput.months_per_second_back_to_back)),
    save_bytes_end: runs[0].d.save.at(-1).bytes_utf8,
    save_bytes_identical_across_runs: new Set(runs.map((x) => JSON.stringify(x.d.save.map((s: { bytes_utf8: number }) => s.bytes_utf8)))).size === 1,
  };
}
const perSystem = files.filter((f) => /^node_.*_per_system\.json$/.test(f)).map((f) => { const d = load(f); return { file: f, sha256: sha(f), mode: d.run.mode, per_system_ms: d.per_system_ms, tick_ms_with_wrappers: d.group1_tick_duration_ms.all }; });
const desktop = files.filter((f) => /^desktop_.*\.json$/.test(f) && !/smoke|diag/.test(f)).map((f) => {
  const d = load(f);
  return { file: f, sha256: sha(f), pass: d.pass, environment: d.environment, build: d.build, run: d.run, page_errors: d.page_errors,
    speeds: d.speeds.map((s: any) => ({ speed: s.speed, measured_s: s.measured_s, start: s.start, end: s.end, fps: s.group3_frames.fps, frame_interval_ms: s.group3_frames.interval_ms, late_frames_over_1_5x_median: s.group3_frames.late_frames_over_1_5x_median, intervals_over_50ms: s.group3_frames.intervals_over_50ms, long_tasks: s.group3_long_tasks, months_per_second: s.group4.months_per_second, ticks_per_frame: s.group4.ticks_per_frame, group2_tick_callback_ms: s.group2_tick_callback_ms })) };
});
const nodeEnv = nodeRuns[0]?.d.environment ?? null, nodeBuild = nodeRuns[0]?.d.build ?? null;
writeFileSync(out, JSON.stringify({
  schema: 's0-performance-baseline-v1',
  label: 'BASELINE_ORIGINAL',
  protocol: 'J (roadmap v3.2 §6.5); three environments reported separately, never converted into one another',
  environments: {
    node_server: { environment: nodeEnv, build: nodeBuild, by_mode: byMode, per_system: perSystem, group2: 'not_applicable', group3: 'not_applicable' },
    desktop_browser_headless_swiftshader: desktop,
    android_device_iqoo_z10_turbo: { status: 'BLOCKED', reason: 'No device measurement available in S0-B3; desktop/Node numbers never substitute device numbers (v3.2 §6.5, v3.3 §5)' },
  },
}, null, 2) + '\n');
console.log(`node runs ${nodeRuns.length}, per-system ${perSystem.length}, desktop passes ${desktop.length}`);
