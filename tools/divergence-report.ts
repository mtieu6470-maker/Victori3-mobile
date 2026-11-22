// TECH-02 review (owner 2026-11-22): many countries that lagged in history still lag today. This checks
// that catch-up channels do not make the world converge more than it did.
//
//   npx tsx tools/divergence-report.ts [endYear=2022] [seed=1] [historical|sandbox] [--no-import] [--json out]
//
// Engine regions are mapped to modern countries by map-cell overlap (public/generated/map.bin region grid
// x assets/map/admin1_grid.bin.gz admin-1 grid with ISO adm0 codes; cells weighted by cos(latitude));
// region output and population are split by area share. Engine REAL GDP per capita (1836 prices) is
// compared with MPD2023 GDP per capita (2011 int-$) through shapes, not levels:
// - Spearman rank correlation across modern countries;
// - dispersion: standard deviation of ln(GDP per capita) across countries;
// - gap: mean ln(pc) of the 20 richest minus the 20 poorest (by MPD) in each series;
// - laggards: MPD's poorest 20 countries, their engine position (ln pc minus the engine median).
import { readFileSync, writeFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { stepMonth } from '../src/engine/simulation';
import { TECH_IMPORT } from '../src/engine/systems/technology';
import type { GameState } from '../src/engine/types';

const W = 8192, CPD = W / 360, H = Math.round(170 * CPD), LAT0 = 85;
const decode = (buf: Buffer) => { const runs = new Uint16Array(buf.buffer, buf.byteOffset, buf.byteLength / 2); const a = new Uint16Array(W * H); let k = 0; for (let i = 0; i < runs.length; i += 2) { a.fill(runs[i], k, k + runs[i + 1]); k += runs[i + 1]; } return a; };

export function regionCountryShares(st: GameState): Map<string, Map<string, number>> {
  const reg = decode(readFileSync(new URL('../public/generated/map.bin', import.meta.url)));
  const adm = decode(gunzipSync(readFileSync(new URL('../assets/map/admin1_grid.bin.gz', import.meta.url))));
  const meta = JSON.parse(readFileSync(new URL('../assets/map/admin1_meta.json', import.meta.url), 'utf8'));
  const iso = new Map<number, string>(meta.features.map((f: { id: number; adm0: string }) => [f.id, f.adm0]));
  const acc = new Map<number, Map<string, number>>();
  for (let y = 0; y < H; y++) {
    const w = Math.cos((LAT0 - (y + 0.5) / CPD) * Math.PI / 180);
    for (let x = 0; x < W; x++) {
      const k = y * W + x; const r = reg[k]; if (!r || r === 0xffff) continue;
      const c = iso.get(adm[k]); if (!c) continue;
      const m = acc.get(r - 1) ?? new Map<string, number>(); m.set(c, (m.get(c) ?? 0) + w); acc.set(r - 1, m);
    }
  }
  const out = new Map<string, Map<string, number>>();
  for (const [i, m] of acc) { const tot = [...m.values()].reduce((s, v) => s + v, 0); const r = st.regions[i]; if (!r) continue; out.set(r.id, new Map([...m].map(([c, v]) => [c, v / tot]))); }
  return out;
}

const mpdPop = new Map<number, Map<string, number>>();
const mpdRegion = new Map<string, string>();
function loadMpd(): Map<number, Map<string, number>> {
  const by = new Map<number, Map<string, number>>();
  for (const line of readFileSync(new URL('../docs/research/data/MPD2023_ALL_BENCHMARK_YEARS.csv', import.meta.url), 'utf8').trim().split('\n').slice(1)) {
    const cells = line.match(/("[^"]*"|[^,]*)(,|$)/g)!.map((s) => s.replace(/,$/, '').replace(/^"|"$/g, ''));
    const [code, , , year, gdppc] = [cells[0], cells[1], cells[2], Number(cells[3]), Number(cells[4])];
    mpdRegion.set(code, cells[2]);
    const popK = Number(cells[5]); if (Number.isFinite(popK) && popK > 0) (mpdPop.get(year) ?? mpdPop.set(year, new Map()).get(year)!).set(code, popK * 1000);
    if (!Number.isFinite(gdppc) || gdppc <= 0) continue;
    (by.get(year) ?? by.set(year, new Map()).get(year)!).set(code, gdppc);
  }
  return by;
}

const rank = (xs: number[]) => { const idx = xs.map((v, i) => [v, i] as const).sort((a, b) => a[0] - b[0]); const r = new Array(xs.length); idx.forEach(([, i], k) => (r[i] = k)); return r as number[]; };
const pearson = (a: number[], b: number[]) => { const n = a.length, ma = a.reduce((s, x) => s + x, 0) / n, mb = b.reduce((s, x) => s + x, 0) / n; let num = 0, da = 0, db = 0; for (let i = 0; i < n; i++) { num += (a[i] - ma) * (b[i] - mb); da += (a[i] - ma) ** 2; db += (b[i] - mb) ** 2; } return num / Math.sqrt(da * db); };
const sd = (xs: number[]) => { const m = xs.reduce((s, x) => s + x, 0) / xs.length; return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / xs.length); };
const median = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };

export function runDivergence(endYear = 2022, seed = 1, mode: 'historical' | 'sandbox' = 'historical') {
  loadNodeData();
  const st = createGame({ mode, seed, player: null });
  const shares = regionCountryShares(st);
  const mpd = loadMpd();
  const years = [1913, 1950, 2000, 2022].filter((y) => y <= endYear);
  const results: Record<number, unknown> = {};
  for (const year of years) {
    while (st.date.y < year) stepMonth(st);
    const out = new Map<string, { o: number; p: number }>();
    for (const r of st.regions) for (const [c, f] of shares.get(r.id) ?? []) { const e = out.get(c) ?? { o: 0, p: 0 }; e.o += f * (r.outputReal ?? r.output) * 12; e.p += f * r.pop; out.set(c, e); }
    const m = mpd.get(year)!;
    const mp = mpdPop.get(year)!;
    const rows = [...out].filter(([c, e]) => m.has(c) && e.p > 2e5 && e.o > 0).map(([c, e]) => ({ c, eng: Math.log(e.o / e.p), mpd: Math.log(m.get(c)!), pop: e.p, mpdPop: mp.get(c) ?? null }));
    const rho = pearson(rank(rows.map((r) => r.eng)), rank(rows.map((r) => r.mpd)));
    const byMpd = [...rows].sort((a, b) => a.mpd - b.mpd);
    const gap = (k: 'eng' | 'mpd') => byMpd.slice(-20).reduce((s, r) => s + r[k], 0) / 20 - byMpd.slice(0, 20).reduce((s, r) => s + r[k], 0) / 20;
    const em = median(rows.map((r) => r.eng)), mm = median(rows.map((r) => r.mpd));
    // World regions (MPD classification): GDP per capita relative to the world, population-weighted.
    const agg = (val: (c: string) => { o: number; p: number } | null) => {
      const reg = new Map<string, { o: number; p: number }>(); let wo = 0, wp = 0;
      for (const c of new Set([...out.keys()].filter((k) => mpdRegion.has(k)))) { const v = val(c); if (!v || v.p <= 0) continue; const r = mpdRegion.get(c)!; const e = reg.get(r) ?? { o: 0, p: 0 }; e.o += v.o; e.p += v.p; reg.set(r, e); wo += v.o; wp += v.p; }
      return Object.fromEntries([...reg].map(([r, e]) => [r, +((e.o / e.p) / (wo / wp)).toFixed(2)]));
    };
    const regionsEngine = agg((c) => out.get(c) ?? null);
    const regionsMpd = agg((c) => { const g = m.get(c), p = mp.get(c); return g && p && out.has(c) ? { o: g * p, p } : null; });
    results[year] = { regionsEngine, regionsMpd,
      countries: rows.length, spearman: +rho.toFixed(3),
      dispersion: { engine: +sd(rows.map((r) => r.eng)).toFixed(3), mpd: +sd(rows.map((r) => r.mpd)).toFixed(3) },
      richPoorGap: { engine: +gap('eng').toFixed(3), mpd: +gap('mpd').toFixed(3) },
      laggards: byMpd.slice(0, 20).map((r) => ({ c: r.c, engineVsMedian: +(r.eng - em).toFixed(2), mpdVsMedian: +(r.mpd - mm).toFixed(2), popRatio: r.mpdPop ? +(r.pop / r.mpdPop).toFixed(2) : null })),
    };
  }
  return { seed, mode, import: TECH_IMPORT.enabled, results };
}

if (process.argv[1]?.endsWith('divergence-report.ts')) {
  const args = process.argv.slice(2); const nums = args.filter((a) => /^\d+$/.test(a)).map(Number);
  if (args.includes('--no-import')) TECH_IMPORT.enabled = false;
  const out = runDivergence(nums[0] ?? 2022, nums[1] ?? 1, args.includes('sandbox') ? 'sandbox' : 'historical');
  for (const [y, r] of Object.entries(out.results) as [string, any][]) {
    console.log(`${y}: n=${r.countries} spearman ${r.spearman} | sd ln(pc) engine ${r.dispersion.engine} vs MPD ${r.dispersion.mpd} | rich-poor gap engine ${r.richPoorGap.engine} vs MPD ${r.richPoorGap.mpd}`);
  }
  for (const [y, r] of Object.entries(out.results) as [string, any][]) {
    console.log(`  ${y} region pc / world (engine | MPD): ` + Object.keys(r.regionsMpd).sort().map((k) => `${k}: ${r.regionsEngine[k]} | ${r.regionsMpd[k]}`).join('; '));
  }
  const last = Object.values(out.results).pop() as any;
  console.log('laggards (engine/MPD ln vs median; engine pop / MPD pop):', last.laggards.map((l: any) => `${l.c} ${l.engineVsMedian}/${l.mpdVsMedian} pop×${l.popRatio}`).join(' '));
  const first = Object.values(out.results)[0] as any;
  console.log(`first year laggards:`, first.laggards.map((l: any) => `${l.c} ${l.engineVsMedian}/${l.mpdVsMedian} pop×${l.popRatio}`).join(' '));
  const j = args.indexOf('--json'); if (j >= 0 && args[j + 1]) writeFileSync(args[j + 1], JSON.stringify(out, null, 1) + '\n');
}
