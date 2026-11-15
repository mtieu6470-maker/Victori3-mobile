/**
 * prepare_map_sources: turns Natural Earth layers (public domain, downloaded by fetch_natural_earth.sh) into compact,
 * committed map sources so that the normal build (tools/build-map.ts, also run in CI) needs no download:
 *   assets/map/admin1_grid.bin.gz — 8192×3868 grid (lat 85…-85) of Natural Earth 10m admin-1 feature ids
 *                                   (0 = sea, 65534 = large lake, otherwise feature index + 1), RLE Uint16 pairs, gzip.
 *   assets/map/admin1_meta.json   — feature names/countries/centroids (used only for diagnostics and docs).
 *   public/map/rivers.json        — simplified river centrelines in grid coordinates with Natural Earth scalerank.
 *   public/map/lakes.json         — simplified outlines of smaller lakes (drawn as vectors, not part of the grid).
 * Modern admin-1 boundaries are used as an approximation of the 1836 provincial geography (documented in docs/ui).
 * Usage: tools/etl/fetch_natural_earth.sh && npx tsx tools/etl/prepare_map_sources.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const CACHE = path.join(ROOT, 'tools/etl/.cache');
export const W = 8192, LAT0 = 85, CPD = W / 360, H = Math.round(170 * CPD);
const LAKE = 65534;
const read = (f: string) => JSON.parse(fs.readFileSync(path.join(CACHE, f), 'utf8'));

type Ring = [number, number][];
const ringsOf = (g: any): Ring[][] => (g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : []);

/** Even-odd scanline fill of a feature (all rings together), unwrapping rings across the antimeridian. */
function fill(grid: Uint16Array, polys: Ring[][], value: number, only?: (k: number) => boolean) {
  const rows = new Map<number, number[]>();
  for (const poly of polys) for (const ring of poly) {
    let prev = ring[0][0], off = 0; const pts: [number, number][] = [];
    for (const [lon, lat] of ring) { if (lon - prev > 180) off -= 360; else if (prev - lon > 180) off += 360; prev = lon; pts.push([lon + off, lat]); }
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1] = pts[i], [x2, y2] = pts[i + 1]; if (y1 === y2) continue;
      const yMin = Math.min(y1, y2), yMax = Math.max(y1, y2);
      const r0 = Math.max(0, Math.ceil((LAT0 - yMax) * CPD - 0.5)), r1 = Math.min(H - 1, Math.floor((LAT0 - yMin) * CPD - 0.5));
      for (let r = r0; r <= r1; r++) {
        const lat = LAT0 - (r + 0.5) / CPD; if (lat < yMin || lat >= yMax) continue;
        (rows.get(r) ?? rows.set(r, []).get(r)!).push(x1 + ((lat - y1) / (y2 - y1)) * (x2 - x1));
      }
    }
  }
  for (const [r, xs] of rows) {
    xs.sort((a, b) => a - b);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const a = Math.ceil((xs[k] + 180) * CPD - 0.5), b = Math.floor((xs[k + 1] + 180) * CPD - 0.5);
      for (let x = a; x <= b; x++) { const i = r * W + (((x % W) + W) % W); if (!only || only(i)) grid[i] = value; }
    }
  }
}
/** Douglas–Peucker on a flat [x,y,…] polyline. */
export function simplify(pts: number[], tol: number): number[] {
  const n = pts.length / 2; if (n < 3) return pts;
  const keep = new Uint8Array(n); keep[0] = keep[n - 1] = 1; const st: [number, number][] = [[0, n - 1]];
  while (st.length) {
    const [a, b] = st.pop()!; const ax = pts[a * 2], ay = pts[a * 2 + 1], bx = pts[b * 2], by = pts[b * 2 + 1];
    const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy); let md = -1, mi = -1;
    for (let i = a + 1; i < b; i++) { const d = L < 1e-9 ? Math.hypot(pts[i * 2] - ax, pts[i * 2 + 1] - ay) : Math.abs((pts[i * 2] - ax) * dy - (pts[i * 2 + 1] - ay) * dx) / L; if (d > md) { md = d; mi = i; } } // closed rings: distance to the point
    if (md > tol) { keep[mi] = 1; st.push([a, mi], [mi, b]); }
  }
  const out: number[] = []; for (let i = 0; i < n; i++) if (keep[i]) out.push(pts[i * 2], pts[i * 2 + 1]); return out;
}
const toGrid = (lon: number, lat: number) => [Math.round((lon + 180) * CPD * 10) / 10, Math.round((LAT0 - lat) * CPD * 10) / 10];

if (process.argv[1]?.endsWith('prepare_map_sources.ts')) {
  const t0 = Date.now();
  const adm = read('ne_10m_admin_1_states_provinces.geojson');
  const grid = new Uint16Array(W * H);
  const meta: { id: number; name: string; adm0: string; type: string; lon: number; lat: number }[] = [];
  adm.features.forEach((f: any, i: number) => {
    fill(grid, ringsOf(f.geometry), i + 1);
    const p = f.properties; meta.push({ id: i + 1, name: p.name, adm0: p.adm0_a3, type: p.type_en, lon: Math.round(p.longitude * 100) / 100, lat: Math.round(p.latitude * 100) / 100 });
  });
  // large lakes become water in the grid (they matter for coastlines and movement); smaller ones are drawn as vectors
  const lakes = read('ne_10m_lakes.geojson');
  const smallLakes: number[][] = [];
  for (const f of lakes.features) {
    const sr = f.properties.scalerank ?? 9;
    if (sr <= 2) fill(grid, ringsOf(f.geometry), LAKE, (k) => grid[k] !== 0);
    else if (sr <= 5) for (const poly of ringsOf(f.geometry)) { const pts = poly[0].flatMap(([lon, lat]) => toGrid(lon, lat)); const s = simplify(pts, 0.6); if (s.length >= 8) smallLakes.push(s); }
  }
  // rivers: keep the more important centrelines (scalerank ≤ 7), simplified
  const riv = read('ne_10m_rivers_lake_centerlines.geojson');
  const rivers: { r: number; n: string; p: number[] }[] = [];
  for (const f of riv.features) {
    const sr = f.properties.scalerank ?? 10; if (sr > 7) continue;
    const lines = f.geometry.type === 'LineString' ? [f.geometry.coordinates] : f.geometry.type === 'MultiLineString' ? f.geometry.coordinates : [];
    for (const l of lines) { const pts = l.filter(([, lat]: number[]) => lat < LAT0 && lat > -LAT0).flatMap(([lon, lat]: number[]) => toGrid(lon, lat)); const s = simplify(pts, 0.45); if (s.length >= 4) rivers.push({ r: sr, n: f.properties.name_en ?? f.properties.name ?? '', p: s }); }
  }
  // outputs
  const runs: number[] = [];
  for (let k = 0; k < W * H;) { const v = grid[k]; let n = 1; while (k + n < W * H && grid[k + n] === v && n < 65535) n++; runs.push(v, n); k += n; }
  fs.mkdirSync(path.join(ROOT, 'assets/map'), { recursive: true });
  fs.mkdirSync(path.join(ROOT, 'public/map'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'assets/map/admin1_grid.bin.gz'), zlib.gzipSync(Buffer.from(new Uint16Array(runs).buffer), { level: 9 }));
  fs.writeFileSync(path.join(ROOT, 'assets/map/admin1_meta.json'), JSON.stringify({ source: 'Natural Earth 10m admin-1 states/provinces (public domain), rasterised at ' + `${W}x${H}`, width: W, height: H, cpd: CPD, lat0: LAT0, lake: LAKE, features: meta }));
  fs.writeFileSync(path.join(ROOT, 'public/map/rivers.json'), JSON.stringify(rivers));
  fs.writeFileSync(path.join(ROOT, 'public/map/lakes.json'), JSON.stringify(smallLakes));
  console.log(`prepare_map_sources: ${adm.features.length} admin-1 features, ${runs.length / 2} runs, ${rivers.length} river lines, ${smallLakes.length} small lakes in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
}
