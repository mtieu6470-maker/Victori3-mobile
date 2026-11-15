/**
 * build-map: assigns the land of the world to the 1836 regions of the Historical Database and derives the map topology.
 * Geometry: Natural Earth 10m admin-1 provinces (public domain), pre-rasterised at 8192×3868 by
 * tools/etl/prepare_map_sources.ts into assets/map/admin1_grid.bin.gz. Each province is given to the region whose
 * centre lies inside it; provinces holding several centres are split between them by distance; provinces without a
 * centre join the nearest centre on the same landmass. Region shapes therefore follow real (modern) provincial
 * boundaries — an approximation of the 1836 geography, not surveyed historical borders.
 * Outputs: public/generated/map.bin (region grid, RLE), public/generated/borders.json (vector boundaries between
 * regions and along coasts), src/generated/map.json (topology used by the engine and UI).
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { simplify } from './etl/prepare_map_sources';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const db = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/generated/db.json'), 'utf8'));
const t0 = Date.now();

// ---------------------------------------------------------------- source grid
const runsIn = new Uint16Array(new Uint8Array(zlib.gunzipSync(fs.readFileSync(path.join(ROOT, 'assets/map/admin1_grid.bin.gz')))).buffer);
const W = 8192, LAT0 = 85, CPD = W / 360, H = Math.round(170 * CPD);
const LAKE = 65534, SEA = 0, UNASSIGNED = 0xffff;
const A = new Uint16Array(W * H);
{ let k = 0; for (let i = 0; i < runsIn.length; i += 2) { A.fill(runsIn[i], k, k + runsIn[i + 1]); k += runsIn[i + 1]; } if (k !== W * H) throw new Error('admin grid size mismatch'); }
const isLand = (k: number) => A[k] !== 0 && A[k] !== LAKE;
const cellLat = (y: number) => LAT0 - (y + 0.5) / CPD;
const cellLon = (x: number) => -180 + (x + 0.5) / CPD;
const wrap = (x: number) => ((x % W) + W) % W;
const idx = (x: number, y: number) => y * W + wrap(x);
const D2R = Math.PI / 180;

// ---------------------------------------------------------------- region centres (snapped to land)
const regions: any[] = db.regions; const N = regions.length;
const cx = new Int32Array(N), cy = new Int32Array(N);
const ISLAND0 = 60000; // pseudo-feature ids for centres on islands too small for the source raster
for (let i = 0; i < N; i++) {
  let x = wrap(Math.floor((regions[i].lon + 180) * CPD)), y = Math.min(H - 1, Math.max(0, Math.floor((LAT0 - regions[i].lat) * CPD)));
  if (!isLand(idx(x, y))) {
    let best = -1, bd = 1e9;
    for (const R of [14, 40, 70]) { // centres given at sea (coastal towns, small islands) snap to the nearest land within ~3°
      for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) { const yy = y + dy; if (yy < 0 || yy >= H) continue; const k = idx(x + dx, yy); if (isLand(k) && dx * dx + dy * dy < bd) { bd = dx * dx + dy * dy; best = k; } }
      if (best >= 0) break;
    }
    if (best >= 0) { x = best % W; y = Math.floor(best / W); } else A[idx(x, y)] = ISLAND0 + i;
  }
  cx[i] = x; cy[i] = y;
}

// ---------------------------------------------------------------- landmass components (8-neighbour, wrapping)
const comp = new Int32Array(W * H).fill(-1); let nComp = 0;
{ const stack = new Int32Array(W * H);
  for (let s = 0; s < W * H; s++) {
    if (!isLand(s) || comp[s] >= 0) continue;
    let sp = 0; stack[sp++] = s; comp[s] = nComp;
    while (sp) { const c = stack[--sp]; const x = c % W, y = (c - x) / W;
      for (let dy = -1; dy <= 1; dy++) { const yy = y + dy; if (yy < 0 || yy >= H) continue; for (let dx = -1; dx <= 1; dx++) { if (!dx && !dy) continue; const k = yy * W + wrap(x + dx); if (comp[k] < 0 && isLand(k)) { comp[k] = nComp; stack[sp++] = k; } } } }
    nComp++;
  } }

// ---------------------------------------------------------------- feature statistics
const MAXF = 65536;
const fCount = new Float64Array(MAXF), fSin = new Float64Array(MAXF), fCos = new Float64Array(MAXF), fLat = new Float64Array(MAXF);
const fComp = new Map<number, Map<number, number>>();
for (let k = 0; k < W * H; k++) {
  if (!isLand(k)) continue; const f = A[k]; const x = k % W, y = (k - x) / W; const lon = cellLon(x) * D2R;
  fCount[f]++; fSin[f] += Math.sin(lon); fCos[f] += Math.cos(lon); fLat[f] += cellLat(y);
  const m = fComp.get(f) ?? fComp.set(f, new Map()).get(f)!; m.set(comp[k], (m.get(comp[k]) ?? 0) + 1);
}
const centresIn = new Map<number, number[]>();
for (let i = 0; i < N; i++) { const f = A[idx(cx[i], cy[i])]; (centresIn.get(f) ?? centresIn.set(f, []).get(f)!).push(i); }
const cLat = Float64Array.from(regions, (_, i) => cellLat(cy[i]) * D2R), cLon = Float64Array.from(regions, (_, i) => cellLon(cx[i]) * D2R);
const cosC = cLat.map(Math.cos), sinC = cLat.map(Math.sin);
const centresByComp = new Map<number, number[]>();
for (let i = 0; i < N; i++) { const c = comp[idx(cx[i], cy[i])]; (centresByComp.get(c) ?? centresByComp.set(c, []).get(c)!).push(i); }
function nearest(lat: number, lon: number, cands: number[]): [number, number] {
  const la = lat * D2R, lo = lon * D2R, cl = Math.cos(la), sl = Math.sin(la); let best = -1, bc = -2;
  for (const i of cands) { const c = sl * sinC[i] + cl * cosC[i] * Math.cos(lo - cLon[i]); if (c > bc) { bc = c; best = i; } }
  return [best, Math.acos(Math.min(1, bc)) * 6371];
}
const ALL = [...Array(N).keys()];
const MAX_ORPHAN_KM = 900;
const featureRegion = new Map<number, number>(); // features without a centre → one region (or UNASSIGNED)
for (let f = 1; f < MAXF; f++) {
  if (!fCount[f] || centresIn.has(f)) continue;
  const lat = fLat[f] / fCount[f], lon = Math.atan2(fSin[f], fCos[f]) / D2R;
  const majority = [...fComp.get(f)!.entries()].sort((a, b) => b[1] - a[1])[0][0];
  const sameMass = centresByComp.get(majority);
  if (sameMass?.length) featureRegion.set(f, nearest(lat, lon, sameMass)[0] + 1);
  else { const [best, km] = nearest(lat, lon, ALL); featureRegion.set(f, km < MAX_ORPHAN_KM ? best + 1 : UNASSIGNED); }
}
const grid = new Uint16Array(W * H);
for (let k = 0; k < W * H; k++) {
  if (!isLand(k)) { grid[k] = SEA; continue; }
  const f = A[k]; const cs = centresIn.get(f);
  if (!cs) { grid[k] = featureRegion.get(f) ?? UNASSIGNED; continue; }
  if (cs.length === 1) { grid[k] = cs[0] + 1; continue; }
  const x = k % W, y = (k - x) / W; grid[k] = nearest(cellLat(y), cellLon(x), cs)[0] + 1;
}
for (let i = 0; i < N; i++) grid[idx(cx[i], cy[i])] = i + 1; // every region keeps at least its centre

// ---------------------------------------------------------------- adjacency, area, label, coast
const adj = new Map<string, number>();
const area = new Float64Array(N), sxs = new Float64Array(N), sys = new Float64Array(N), sc = new Float64Array(N);
const coastal = new Uint8Array(N);
const km = 111.32 / CPD;
for (let y = 0; y < H; y++) { const cell = km * km * Math.cos(cellLat(y) * D2R);
  for (let x = 0; x < W; x++) {
    const g = grid[y * W + x]; if (!g || g === UNASSIGNED) continue;
    const i = g - 1; area[i] += cell; let ux = x; if (Math.abs(x - cx[i]) > W / 2) ux += x < cx[i] ? W : -W; sxs[i] += ux; sys[i] += y; sc[i]++;
    for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
      const yy = y + dy; if (yy < 0 || yy >= H) continue; const h = grid[idx(x + dx, yy)];
      if (!h) coastal[i] = 1;
      else if (h !== g && h !== UNASSIGNED && dx >= 0 && dy >= 0) { const a = Math.min(g, h) - 1, b = Math.max(g, h) - 1; const key = `${a},${b}`; adj.set(key, (adj.get(key) ?? 0) + 1); }
    }
  } }

// ---------------------------------------------------------------- sea links (multi-source BFS over water, ≈7° of reach)
const MAX_SEA = Math.round(7 * CPD);
const seaOwner = new Int32Array(W * H).fill(-1), seaDist = new Int32Array(W * H).fill(1 << 30);
let q = new Int32Array(W * H), qn = 0, nq = new Int32Array(W * H);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const k = y * W + x; if (grid[k]) continue;
  for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) { const yy = y + dy; if (yy < 0 || yy >= H) continue; const h = grid[idx(x + dx, yy)]; if (h && h !== UNASSIGNED) { seaOwner[k] = h - 1; seaDist[k] = 1; q[qn++] = k; break; } }
}
for (let d = 1; d < MAX_SEA && qn; d++) {
  let nn = 0;
  for (let j = 0; j < qn; j++) { const k = q[j]; const x = k % W, y = (k - x) / W;
    for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) { const yy = y + dy; if (yy < 0 || yy >= H) continue; const n = yy * W + wrap(x + dx);
      if (grid[n] || seaDist[n] <= d + 1) continue; seaDist[n] = d + 1; seaOwner[n] = seaOwner[k]; nq[nn++] = n; } }
  [q, nq] = [nq, q]; qn = nn;
}
const seaLinks = new Map<string, number>();
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const k = y * W + x; const a = seaOwner[k]; if (a < 0) continue;
  for (const [dx, dy] of [[1, 0], [0, 1]]) { const yy = y + dy; if (yy >= H) continue; const n = idx(x + dx, yy); const b = seaOwner[n];
    if (b < 0 || b === a) continue; const dist = ((seaDist[k] + seaDist[n]) * 111.32) / CPD; const key = a < b ? `${a},${b}` : `${b},${a}`;
    if (!seaLinks.has(key) || seaLinks.get(key)! > dist) seaLinks.set(key, dist); }
}
for (const key of adj.keys()) seaLinks.delete(key);

// ---------------------------------------------------------------- vector boundaries (from a 2× downsampled grid, smoothed)
// Unit edges between differing cells are chained into polylines per (a, b) pair, smoothed (Chaikin) and simplified.
const BW = W / 2, BH = Math.floor(H / 2);
const bg = new Uint16Array(BW * BH);
for (let y = 0; y < BH; y++) for (let x = 0; x < BW; x++) {
  const v = [grid[(2 * y) * W + 2 * x], grid[(2 * y) * W + 2 * x + 1], grid[(2 * y + 1) * W + 2 * x], grid[(2 * y + 1) * W + 2 * x + 1]];
  let best = v[0], bc = 0; for (const a of v) { let c = 0; for (const b of v) if (a === b) c++; if (c > bc || (c === bc && a !== 0 && best === 0)) { bc = c; best = a; } } bg[y * BW + x] = best;
}
const pairKey = (a: number, b: number) => (a < b ? a * 65536 + b : b * 65536 + a);
const edgesByPair = new Map<number, number[]>(); // flat list of point ids (p1, p2) — point id = y * (BW + 1) + x
const pushEdge = (a: number, b: number, p1: number, p2: number) => { const k = pairKey(a, b); const l = edgesByPair.get(k) ?? edgesByPair.set(k, []).get(k)!; l.push(p1, p2); };
const PW = BW + 1;
for (let y = 0; y < BH; y++) for (let x = 0; x < BW; x++) {
  const a = bg[y * BW + x];
  const r = bg[y * BW + ((x + 1) % BW)]; if (r !== a && x + 1 < BW) pushEdge(a, r, y * PW + x + 1, (y + 1) * PW + x + 1);
  if (y + 1 < BH) { const d = bg[(y + 1) * BW + x]; if (d !== a) pushEdge(a, d, (y + 1) * PW + x, (y + 1) * PW + x + 1); }
}
const ids: string[] = regions.map((r: any) => r.id);
const lines: number[][] = []; const pairs: [number, number][] = []; const pairIndex = new Map<number, number>();
function chaikin(p: number[], closed: boolean) {
  const out: number[] = []; const n = p.length / 2; if (n < 3) return p;
  if (!closed) out.push(p[0], p[1]);
  for (let i = 0; i < (closed ? n : n - 1); i++) { const j = (i + 1) % n; const x0 = p[i * 2], y0 = p[i * 2 + 1], x1 = p[j * 2], y1 = p[j * 2 + 1]; out.push(0.75 * x0 + 0.25 * x1, 0.75 * y0 + 0.25 * y1, 0.25 * x0 + 0.75 * x1, 0.25 * y0 + 0.75 * y1); }
  if (!closed) out.push(p[p.length - 2], p[p.length - 1]); else out.push(out[0], out[1]);
  return out;
}
for (const [k, e] of edgesByPair) {
  const a = Math.floor(k / 65536), b = k % 65536;
  if (a === UNASSIGNED && b === UNASSIGNED) continue;
  const adjP = new Map<number, number[]>(); const used = new Uint8Array(e.length / 2);
  for (let i = 0; i < e.length; i += 2) { for (const p of [e[i], e[i + 1]]) (adjP.get(p) ?? adjP.set(p, []).get(p)!).push(i / 2); }
  for (let s = 0; s < used.length; s++) {
    if (used[s]) continue;
    // extend in both directions from edge s
    const chain: number[] = [e[s * 2], e[s * 2 + 1]]; used[s] = 1;
    for (const dir of [1, -1]) {
      for (;;) {
        const end = dir === 1 ? chain[chain.length - 1] : chain[0];
        const nxt = (adjP.get(end) ?? []).find((j) => !used[j]); if (nxt === undefined) break;
        used[nxt] = 1; const p = e[nxt * 2] === end ? e[nxt * 2 + 1] : e[nxt * 2];
        if (dir === 1) chain.push(p); else chain.unshift(p);
      }
    }
    let pts = chain.flatMap((p) => [(p % PW) * 2, Math.floor(p / PW) * 2]);
    const closed = chain[0] === chain[chain.length - 1];
    pts = simplify(chaikin(chaikin(chaikin(pts, closed), closed), closed), 0.8);
    if (pts.length < 4) continue;
    const conv = (v: number) => (v === SEA ? -1 : v === UNASSIGNED ? -2 : v - 1); // -1 water, -2 land without region
    let pi = pairIndex.get(k); if (pi === undefined) { pi = pairs.length; pairIndex.set(k, pi); pairs.push([conv(a), conv(b)]); }
    lines.push([pi, ...pts.map((v) => Math.round(v * 2) / 2)]);
  }
}
const pairsOut = pairs; // [regionA, regionB]: region index, -1 = water, -2 = land without region

// ---------------------------------------------------------------- coast distance field (Euclidean, 4096 wide) for engraved water lines
function edt1(f: Float64Array, n: number, d: Float64Array, v: Int32Array, z: Float64Array) {
  let k = 0; v[0] = 0; z[0] = -Infinity; z[1] = Infinity;
  for (let q = 1; q < n; q++) {
    let s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) { k--; s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]); }
    k++; v[k] = q; z[k] = s; z[k + 1] = Infinity;
  }
  k = 0; for (let q = 0; q < n; q++) { while (z[k + 1] < q) k++; d[q] = (q - v[k]) * (q - v[k]) + f[v[k]]; }
}
const DW = W / 2, DH = Math.floor(H / 2), INF = 1e12;
const dist2 = new Float64Array(DW * DH);
for (let y = 0; y < DH; y++) for (let x = 0; x < DW; x++) dist2[y * DW + x] = grid[(2 * y) * W + 2 * x] || grid[(2 * y + 1) * W + 2 * x + 1] ? 0 : INF;
{ const n = Math.max(DW, DH); const f = new Float64Array(n), d = new Float64Array(n), v = new Int32Array(n), z = new Float64Array(n + 1);
  for (let x = 0; x < DW; x++) { for (let y = 0; y < DH; y++) f[y] = dist2[y * DW + x]; edt1(f, DH, d, v, z); for (let y = 0; y < DH; y++) dist2[y * DW + x] = d[y]; }
  for (let y = 0; y < DH; y++) { for (let x = 0; x < DW; x++) f[x] = dist2[y * DW + x]; edt1(f, DW, d, v, z); for (let x = 0; x < DW; x++) dist2[y * DW + x] = d[x]; } }
const distPx = new Uint8Array(DW * DH); for (let i = 0; i < DW * DH; i++) distPx[i] = Math.min(255, Math.round(Math.sqrt(dist2[i]) * 4));
function pngGray(w: number, h: number, px: Uint8Array): Buffer {
  const crcT = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = (b: Buffer) => { let c = 0xffffffff; for (const x of b) c = crcT[(c ^ x) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (t: string, body: Buffer) => { const l = Buffer.alloc(4); l.writeUInt32BE(body.length); const tb = Buffer.concat([Buffer.from(t), body]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(tb)); return Buffer.concat([l, tb, c]); };
  const raw = Buffer.alloc((w + 1) * h); for (let y = 0; y < h; y++) { raw[y * (w + 1)] = 0; Buffer.from(px.buffer, y * w, w).copy(raw, y * (w + 1) + 1); }
  const ih = Buffer.alloc(13); ih.writeUInt32BE(w, 0); ih.writeUInt32BE(h, 4); ih[8] = 8; ih[9] = 0;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

// ---------------------------------------------------------------- outputs
const regionsOut = regions.map((r: any, i: number) => ({
  id: r.id, area_km2: Math.round(area[i]), coastal: !!coastal[i], cells: sc[i],
  label: sc[i] ? [Math.round((wrap(sxs[i] / sc[i])) * 10) / 10, Math.round((sys[i] / sc[i]) * 10) / 10] : [cx[i], cy[i]],
}));
const adjacency = [...adj.entries()].map(([k, len]) => { const [a, b] = k.split(',').map(Number); return [ids[a], ids[b], len]; });
const sea = [...seaLinks.entries()].map(([k, d]) => { const [a, b] = k.split(',').map(Number); return [ids[a], ids[b], Math.round(d)]; });
const runs: number[] = [];
for (let k = 0; k < W * H;) { const v = grid[k]; let n = 1; while (k + n < W * H && grid[k + n] === v && n < 65535) n++; runs.push(v, n); k += n; }
fs.mkdirSync(path.join(ROOT, 'public/generated'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'public/generated/map.bin'), Buffer.from(new Uint16Array(runs).buffer));
fs.writeFileSync(path.join(ROOT, 'public/generated/coastdist.png'), pngGray(DW, DH, distPx));
fs.writeFileSync(path.join(ROOT, 'public/generated/borders.json'), JSON.stringify({ unit: 'grid cells of map.bin', pairs: pairsOut, lines }));
const topo = { width: W, height: H, cpd: CPD, lat0: LAT0, regionIds: ids, regions: regionsOut, adjacency, seaLinks: sea, components: nComp };
fs.writeFileSync(path.join(ROOT, 'src/generated/map.json'), JSON.stringify(topo));
const empty = regionsOut.filter((r: any) => r.cells <= 1).map((r: any) => r.id);
console.log(`build-map: ${W}x${H}, ${N} regions, ${adjacency.length} land borders, ${sea.length} sea links, ${nComp} landmasses, ${lines.length} boundary lines, ${runs.length / 2} runs; regions with a single cell: ${empty.length ? empty.join(' ') : 'none'} (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
