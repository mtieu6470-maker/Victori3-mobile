// S0-B3 performance harness, desktop browser environment (not product code). Serves the audited checkout's built
// dist/ unchanged from a local static server, opens it in Playwright Chromium (headless, WebGL through SwiftShader
// = CPU rendering, the flags the project's own QA tools use) and measures per protocol J (v3.2 §6.5), for each speed
// 1–5 on a fresh game (QA URL ?mode=…&seed=…&player=observer&months=0 that the product itself supports):
//  group 3 — frame intervals (own requestAnimationFrame loop), late frames, long tasks ≥ 50 ms (PerformanceObserver);
//  group 4 — game months per second (tick counter of the page's QA hook at window start/end), ticks per frame;
//  group 2 — only with --wrap-raf: duration of each animation-frame callback that advanced the game tick (stepMonth +
//            synchronous emit). This wraps window.requestAnimationFrame in the page at runtime (observer overhead),
//            so it is a separate pass and its numbers are labelled as such. The build itself is never modified.
// Group 1 (stepMonth alone) cannot be isolated in the browser without instrumenting the product: 'unsupported'.
// Usage: npx tsx tools/audit/s0/perf_desktop.ts <built checkout> <out.json> [--wrap-raf] [--warmup 10] [--measure 60]
//        [--speeds 1,2,3,4,5] [--mode historical] [--seed 1]
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import os from 'node:os';

const args = process.argv.slice(2);
const [base, out] = args;
const opt = (k: string, d: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const wrapRaf = args.includes('--wrap-raf');
const warmupS = Number(opt('--warmup', '10')), measureS = Number(opt('--measure', '60'));
const speeds = opt('--speeds', '1,2,3,4,5').split(',').map(Number);
const mode = opt('--mode', 'historical'), seed = Number(opt('--seed', '1'));
if (!base || !out) throw new Error('usage: perf_desktop.ts <built checkout> <out.json> [options]');
const dist = join(base, 'dist');
const startedAt = new Date().toISOString();

const MIME: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.bin': 'application/octet-stream' };
const server = createServer((req, res) => {
  const p = normalize(decodeURIComponent((req.url ?? '/').split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  let f = join(dist, p); if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!f.startsWith(dist) || !existsSync(f)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': MIME[extname(f)] ?? 'application/octet-stream', 'cache-control': 'no-store' }); res.end(readFileSync(f));
});
await new Promise<void>((r) => server.listen(0, '127.0.0.1', () => r()));
const port = (server.address() as { port: number }).port;

const LAUNCH_ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'];
const VIEWPORT = { width: 915, height: 412 }, DSF = 2;
const { chromium } = createRequire(import.meta.url)('playwright') as any;
const browser = await chromium.launch({ args: LAUNCH_ARGS });

// Runs in the page before any product script. Records frames and long tasks only while __s0.recording is true.
// Kept as plain JavaScript text so the TypeScript loader cannot inject helpers that do not exist in the page.
const initScript = (wrap: boolean) => `(() => {
  const s = (window.__s0 = { recording: false, frames: [], longtasks: [], tickCallbacks: [], longtaskSupported: false });
  const raf = window.requestAnimationFrame.bind(window);
  function loop(t) { if (s.recording) s.frames.push(t); raf(loop); }
  raf(loop);
  try {
    s.longtaskSupported = PerformanceObserver.supportedEntryTypes.includes('longtask');
    if (s.longtaskSupported) new PerformanceObserver(function (l) { if (s.recording) for (const e of l.getEntries()) s.longtasks.push({ start: e.startTime, d: e.duration }); }).observe({ type: 'longtask' });
  } catch (e) { s.longtaskSupported = false; }
  if (${wrap ? 'true' : 'false'}) {
    window.requestAnimationFrame = function (cb) {
      return raf(function (t) {
        const g = window.__qa && window.__qa.game; const before = g && g.st ? g.st.tick : undefined; const a = performance.now();
        cb(t);
        const d = performance.now() - a; const after = g && g.st ? g.st.tick : undefined;
        if (s.recording && typeof before === 'number' && after !== before) s.tickCallbacks.push({ d: d, ticks: after - before });
      });
    };
  }
})();`;

const pct = (a: number[], p: number) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return +s[Math.min(s.length - 1, Math.ceil(p * s.length) - 1)].toFixed(3); };
const stats = (a: number[]) => ({ n: a.length, mean: a.length ? +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(3) : null, p50: pct(a, 0.5), p95: pct(a, 0.95), p99: pct(a, 0.99), max: a.length ? +Math.max(...a).toFixed(3) : null });

let envInfo: Record<string, unknown> | null = null;
const perSpeed: Record<string, unknown>[] = [];
const errors: string[] = [];
for (const speed of speeds) {
  const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: DSF, isMobile: true, hasTouch: true });
  await ctx.addInitScript({ content: initScript(wrapRaf) });
  const page = await ctx.newPage();
  page.on('pageerror', (e: Error) => errors.push(`speed ${speed}: pageerror ${e.message}`));
  page.on('console', (m: any) => { if (m.type() === 'error') errors.push(`speed ${speed}: console ${m.text()}`); });
  const tLoad = Date.now();
  await page.goto(`http://127.0.0.1:${port}/?mode=${mode}&seed=${seed}&player=observer&months=0`);
  await page.waitForFunction(() => document.body.dataset.ready === '1' && (window as any).__qa, null, { timeout: 300000 });
  const loadMs = Date.now() - tLoad;
  await page.waitForTimeout(2000);
  if (!envInfo) envInfo = await page.evaluate(() => {
    const c = document.createElement('canvas'); const gl = c.getContext('webgl') as WebGLRenderingContext | null;
    const dbg = gl?.getExtension('WEBGL_debug_renderer_info');
    return { userAgent: navigator.userAgent, webgl_vendor: dbg ? gl!.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : gl ? gl.getParameter(gl.VENDOR) : 'unsupported', webgl_renderer: dbg ? gl!.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl ? gl.getParameter(gl.RENDERER) : 'unsupported', devicePixelRatio, inner: [innerWidth, innerHeight], hardwareConcurrency: navigator.hardwareConcurrency, performance_memory: (performance as any).memory ? 'supported (quantized unless --enable-precise-memory-info)' : 'unsupported', longtask: (window as any).__s0.longtaskSupported ? 'supported' : 'unsupported' };
  });
  const snap = () => page.evaluate(() => { const g = (window as any).__qa.game; const m = (performance as any).memory; return { tick: g.st.tick, date: `${g.st.date.y}-${String(g.st.date.m).padStart(2, '0')}`, datebox: document.querySelector('.datebox')?.textContent ?? null, t: performance.now(), heap: m ? m.usedJSHeapSize : 'unsupported' }; });
  await page.evaluate((sp: number) => { const g = (window as any).__qa.game; g.setSpeed(sp); g.setPaused(false); }, speed);
  await page.waitForTimeout(warmupS * 1000);
  const start = await snap();
  await page.evaluate(() => { (window as any).__s0.recording = true; });
  await page.waitForTimeout(measureS * 1000);
  await page.evaluate(() => { (window as any).__s0.recording = false; });
  const end = await snap();
  const rec = await page.evaluate(() => { const s = (window as any).__s0; (window as any).__qa.game.setPaused(true); return { frames: s.frames, longtasks: s.longtasks, tickCallbacks: s.tickCallbacks }; });
  await ctx.close();
  const seconds = (end.t - start.t) / 1000;
  const iv = rec.frames.slice(1).map((t: number, i: number) => t - rec.frames[i]);
  const med = pct(iv, 0.5) ?? 0;
  const ticks = end.tick - start.tick;
  perSpeed.push({
    speed, page_load_ms: loadMs, warmup_s: warmupS, measured_s: +seconds.toFixed(3),
    start: { tick: start.tick, date: start.date, datebox: start.datebox, js_heap_used: start.heap },
    end: { tick: end.tick, date: end.date, datebox: end.datebox, js_heap_used: end.heap },
    beyond_1936: end.tick > 1200,
    group3_frames: { frames: rec.frames.length, fps: +(rec.frames.length / seconds).toFixed(2), interval_ms: stats(iv), late_frames_over_1_5x_median: iv.filter((x: number) => x > 1.5 * med).length, intervals_over_33_4ms: iv.filter((x: number) => x > 33.4).length, intervals_over_50ms: iv.filter((x: number) => x > 50).length },
    group3_long_tasks: { count: rec.longtasks.length, duration_ms: stats(rec.longtasks.map((x: { d: number }) => x.d)), total_ms: +rec.longtasks.reduce((s: number, x: { d: number }) => s + x.d, 0).toFixed(1) },
    group4: { months_advanced: ticks, months_per_second: +(ticks / seconds).toFixed(3), ticks_per_frame: rec.frames.length ? +(ticks / rec.frames.length).toFixed(3) : null },
    group2_tick_callback_ms: wrapRaf ? { ...stats(rec.tickCallbacks.map((x: { d: number }) => x.d)), over_50ms: rec.tickCallbacks.filter((x: { d: number }) => x.d >= 50).length, max_ticks_in_one_callback: rec.tickCallbacks.reduce((m: number, x: { ticks: number }) => Math.max(m, x.ticks), 0) } : 'not_measured_in_this_pass (run with --wrap-raf)',
  });
  console.log(JSON.stringify({ speed, months_per_s: (perSpeed.at(-1) as any).group4.months_per_second, fps: (perSpeed.at(-1) as any).group3_frames.fps, longtasks: rec.longtasks.length, tickcb_p95: wrapRaf ? (perSpeed.at(-1) as any).group2_tick_callback_ms.p95 : null, end: end.date }));
}
const version = browser.version();
await browser.close(); server.close();

const sha = (p: string) => createHash('sha256').update(readFileSync(p)).digest('hex');
let headSha: string | null = null; try { headSha = execFileSync('git', ['-C', base, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(); } catch { /* not a git checkout */ }
const bundle = readFileSync(join(dist, 'index.html'), 'utf8').match(/assets\/index-[^"]+\.js/)?.[0] ?? null;
writeFileSync(out, JSON.stringify({
  schema: 's0-perf-desktop-v1',
  label: 'BASELINE_ORIGINAL',
  pass: wrapRaf ? 'wrap_raf (group 2 measured; requestAnimationFrame wrapped at runtime by the harness, observer overhead present)' : 'observe_only (no wrapping of page functions)',
  environment: {
    kind: 'desktop_browser_headless_swiftshader',
    representativeness: 'Headless Chromium with SwiftShader (WebGL rendered on the CPU). Not representative of GPU-accelerated desktops and never a substitute for iQOO Z10 Turbo measurements.',
    chromium_version: version, executable: chromium.executablePath(), headless: true, launch_args: LAUNCH_ARGS,
    viewport: VIEWPORT, device_scale_factor: DSF, is_mobile: true, has_touch: true,
    host: { platform: `${os.platform()} ${os.release()}`, cpu_model: os.cpus()[0]?.model ?? null, logical_cpus: os.cpus().length, total_mem_bytes: os.totalmem(), node: process.version },
    page: envInfo,
    refresh_rate: 'no physical display (headless); the observed median frame interval is reported per speed',
    input_latency: 'not_measured (no scripted input during the measurement windows)',
    group1_tick_duration: 'unsupported in the browser without instrumenting the product; see the Node report',
  },
  build: { audited_head: headSha, index_html_sha256: sha(join(dist, 'index.html')), bundle, bundle_sha256: bundle ? sha(join(dist, bundle)) : null, harness_sha256: sha(new URL(import.meta.url).pathname) },
  run: { mode, seed, player: null, entry: '?mode=…&seed=…&player=observer&months=0 (product QA entry, src/ui/main.tsx:38-50)', speed_control: '__qa.game.setSpeed/setPaused (same controller methods as the speed buttons)', fresh_game_per_speed: true, warmup_s: warmupS, measure_s: measureS, started_at: startedAt, finished_at: new Date().toISOString() },
  speeds: perSpeed,
  page_errors: errors,
}, null, 2) + '\n');
console.log(`done: ${perSpeed.length} speeds; page errors ${errors.length}`);
