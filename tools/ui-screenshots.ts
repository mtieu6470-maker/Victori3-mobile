// Captures screenshots of the real app (production build served by `vite preview`) at Android phone sizes.
// Usage: npx vite build && npx tsx tools/ui-screenshots.ts [outDir] [name,name… to capture only those]
// Viewports: 412×915 / 915×412 dp (iQOO Z10 Turbo class, logical size) at 2× pixel density.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { preview } from 'vite';

const out = path.resolve(process.argv[2] ?? 'docs/ui/screenshots/after');
fs.mkdirSync(out, { recursive: true });
const base = 'mode=historical&seed=1&player=GBR&months=108';
const SHOTS: { name: string; q: string; orient: 'P' | 'L' | 'both' }[] = [
  { name: '01_market', q: `${base}&screen=economy&tab=market`, orient: 'both' },
  { name: '02_country_overview', q: `${base}&screen=country&tab=overview`, orient: 'both' },
  { name: '03_map_state', q: `${base}&region=FRA_IDF`, orient: 'both' },
  { name: '04_map_europe_labels', q: 'mode=historical&seed=1&player=GBR&months=0', orient: 'both' },
  { name: '05_laws', q: `${base}&screen=politics&tab=laws`, orient: 'both' },
  { name: '06_interest_groups', q: `${base}&screen=politics&tab=igs`, orient: 'P' },
  { name: '07_buildings', q: `${base}&screen=economy&tab=buildings`, orient: 'L' },
  { name: '08_construction', q: `${base}&screen=economy&tab=construction`, orient: 'P' },
  { name: '09_population', q: `${base}&screen=society&tab=pop`, orient: 'P' },
  { name: '10_technology', q: `${base}&screen=tech&tab=production`, orient: 'L' },
  { name: '11_diplomacy', q: `${base}&screen=diplomacy&tab=relations&lens=diplomacy`, orient: 'L' },
  { name: '12_military_wars', q: `${base}&screen=military&tab=wars`, orient: 'P' },
  { name: '13_journal_decision', q: `${base}&screen=chronicle&tab=decisions`, orient: 'both' },
  { name: '14_world_observer', q: 'mode=sandbox&seed=2&player=observer&months=120&screen=world', orient: 'L' },
  { name: '15_map_sol_layer', q: `${base}&lens=sol`, orient: 'P' },
  { name: '16_new_game', q: '', orient: 'both' },
];

const only = process.argv[3] ? new Set(process.argv[3].split(',')) : null;
const server = await preview({ preview: { port: 4317, strictPort: true }, logLevel: 'warn' });
const url = `http://localhost:4317/`;
const { chromium } = createRequire(import.meta.url)('playwright') as any;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const errors: string[] = [];
for (const s of SHOTS) {
  if (only && !only.has(s.name)) continue;
  for (const o of s.orient === 'both' ? ['P', 'L'] : [s.orient]) {
    const vp = o === 'P' ? { width: 412, height: 915 } : { width: 915, height: 412 };
    const page = await browser.newPage({ viewport: vp, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
    page.on('pageerror', (e: Error) => errors.push(`${s.name}_${o}: ${e.message}`));
    page.on('console', (m: any) => { if (m.type() === 'error') errors.push(`${s.name}_${o}: ${m.text()}`); });
    await page.goto(url + (s.q ? `?${s.q}` : ''));
    await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 120000 });
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(out, `${s.name}_${o === 'P' ? 'portrait' : 'landscape'}.png`) });
    await page.close();
    console.log('shot', s.name, o);
  }
}
await browser.close();
server.httpServer.close();
if (errors.length) { console.log('PAGE ERRORS:\n' + errors.join('\n')); process.exitCode = 1; }
