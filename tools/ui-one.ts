import { createRequire } from 'node:module';
import { preview } from 'vite';
const [q, out, orient] = process.argv.slice(2);
const server = await preview({ preview: { port: 4318, strictPort: true }, logLevel: 'warn' });
const { chromium } = createRequire(import.meta.url)('playwright') as any;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const vp = orient === 'P' ? { width: 412, height: 915 } : { width: 915, height: 412 };
const page = await browser.newPage({ viewport: vp, deviceScaleFactor: Number(process.env.DSF ?? 2), hasTouch: true, isMobile: true });
page.on('pageerror', (e: Error) => console.log('PAGEERROR', e.message));
page.on('console', (m: any) => { if (m.type() === 'error' || m.type() === 'warning') console.log('CONSOLE', m.type(), m.text()); });
const t0 = Date.now();
await page.goto('http://localhost:4318/' + (q ? '?' + q : ''));
await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 240000 });
console.log('ready in', Date.now() - t0, 'ms');
await page.waitForTimeout(1500);
// Optional: CLICK='text1|text2' taps elements by visible text in order (e.g. open a detail window).
// Entries starting with '@' are aria-labels (e.g. '@Mở rộng' maximises the window).
for (const t of (process.env.CLICK ?? '').split('|').filter(Boolean)) { await (t.startsWith('@') ? page.getByLabel(t.slice(1)) : page.getByText(t)).first().click(); await page.waitForTimeout(1500); }
await page.screenshot({ path: out });
console.log('shot in', Date.now() - t0, 'ms');
await browser.close(); server.httpServer.close();
