// Scripted runtime screenshots: loads the real app once per orientation (QA URL parameters run the real engine for
// N months), then switches windows/tabs through the QA hook and captures each state.
// Usage: npx tsx tools/ui-shots.ts <outDir> <L|P> "<base query>" <plan.json>
//   plan.json: [{ "name": "economy_market", "go": ["economy","market"], "detail": "tr:nth-child(3)", "region": "GBR_LON", "set": {...}, "lens": "sol" }]
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync } from 'node:fs';
import { preview } from 'vite';
const [outDir, orient, base, planFile] = process.argv.slice(2);
const plan = JSON.parse(readFileSync(planFile, 'utf8')) as { name: string; go?: [string, string?]; click?: string; tap?: [number, number]; set?: Record<string, unknown>; post?: Record<string, unknown>; wait?: number }[];
mkdirSync(outDir, { recursive: true });
const server = await preview({ preview: { port: 4319, strictPort: true }, logLevel: 'warn' });
const { chromium } = createRequire(import.meta.url)('playwright') as any;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const vp = orient === 'P' ? { width: 412, height: 915 } : { width: 915, height: 412 };
const page = await browser.newPage({ viewport: vp, deviceScaleFactor: Number(process.env.DSF ?? 2), hasTouch: true, isMobile: true });
const errors: string[] = [];
page.on('pageerror', (e: Error) => { errors.push(e.message); console.log('PAGEERROR', e.message); });
page.on('console', (m: any) => { if (m.type() === 'error') { errors.push(m.text()); console.log('CONSOLE', m.text()); } });
const t0 = Date.now();
await page.goto('http://localhost:4319/?' + base);
await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 300000 });
console.log('ready in', Date.now() - t0, 'ms');
for (const s of plan) {
  const pop = await page.$('.catch'); if (pop) await pop.click({ position: { x: 5, y: 300 } }).catch(() => {}); // close an open KPI popover
  await page.evaluate((s: any) => {
    const q = (window as any).__qa; q.details.close(); q.modals?.close();
    q.ui.set({ screen: 'map', region: null, regionDetail: false, ...(s.set ?? {}) });
    if (s.go) q.ui.go(s.go[0], s.go[1]);
    if (s.post) q.ui.set(s.post);
  }, s);
  await page.waitForTimeout(400);
  if (s.tap) await page.touchscreen.tap(s.tap[0], s.tap[1]);
  if (s.click) {
    const el = await page.$(s.click);
    if (!el) console.log('MISSING', s.name, s.click);
    else await el.click({ timeout: 8000 }).catch((e: Error) => console.log('CLICK FAILED', s.name, e.message.split('\n')[0]));
  }
  await page.waitForTimeout(s.wait ?? 2500);
  await page.screenshot({ path: `${outDir}/${s.name}_${orient}.png` });
  console.log('shot', s.name, Date.now() - t0, 'ms');
}
console.log(errors.length ? `ERRORS ${errors.length}` : 'no page errors');
await browser.close(); server.httpServer.close();
