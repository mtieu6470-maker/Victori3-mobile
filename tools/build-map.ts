/**
 * build-map: rasterises Natural Earth land (world-atlas, public domain) and assigns every land cell to the
 * nearest 1836 region centre on the same landmass. Produces adjacency (land borders) and sea links.
 * Output: public/generated/map.bin (grid) + src/generated/map.json (topology, used by engine and UI).
 * Region boundaries are therefore generated approximations, not surveyed historical borders.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import * as topojson from 'topojson-client';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const db = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/generated/db.json'), 'utf8'));
const land50 = require('world-atlas/land-50m.json');
const land110 = require('world-atlas/land-110m.json');

const CPD = 4; // cells per degree
const W = 360 * CPD, H = 170 * CPD; // lat 85 .. -85
const LAT0 = 85;
const SEA = 0, UNASSIGNED = 0xffff;
const cellLat = (y: number) => LAT0 - (y + 0.5) / CPD;
const cellLon = (x: number) => -180 + (x + 0.5) / CPD;
const toX = (lon: number) => Math.min(W - 1, Math.max(0, Math.floor((lon + 180) * CPD)));
const toY = (lat: number) => Math.min(H - 1, Math.max(0, Math.floor((LAT0 - lat) * CPD)));

// ---------------------------------------------------------------- rasterise land (even-odd scanline)
const landGeo: any = topojson.feature(land50, land50.objects.land);
const rings: number[][][] = [];
for (const f of landGeo.type === 'FeatureCollection' ? landGeo.features : [landGeo]) {
  const g = f.geometry;
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  for (const p of polys) for (const ring of p) rings.push(ring);
}
const land = new Uint8Array(W * H);
// Each ring is unwrapped across the antimeridian, filled with the even-odd rule, and XOR-ed into the mask
// (outer rings and holes are separate rings, so XOR produces the correct result).
for (const ring of rings) {
  const pts: [number, number][] = [];
  let prev = ring[0][0], off = 0;
  for (const [lon, lat] of ring) { if (lon - prev > 180) off -= 360; else if (prev - lon > 180) off += 360; prev = lon; pts.push([lon + off, lat]); }
  const rowX = new Map<number, number[]>();
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i]; const [x2, y2] = pts[i + 1];
    if (y1 === y2) continue;
    const yMin = Math.min(y1, y2), yMax = Math.max(y1, y2);
    const r0 = Math.max(0, Math.ceil((LAT0 - yMax) * CPD - 0.5)), r1 = Math.min(H - 1, Math.floor((LAT0 - yMin) * CPD - 0.5));
    for (let r = r0; r <= r1; r++) {
      const lat = cellLat(r);
      if (lat < yMin || lat >= yMax) continue;
      const t = (lat - y1) / (y2 - y1);
      (rowX.get(r) ?? rowX.set(r, []).get(r)!).push(x1 + t * (x2 - x1));
    }
  }
  for (const [r, xs] of rowX) {
    xs.sort((a, b) => a - b);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const a = Math.ceil((xs[k] + 180) * CPD - 0.5), b = Math.floor((xs[k + 1] + 180) * CPD - 0.5);
      for (let x = a; x <= b; x++) land[r * W + (((x % W) + W) % W)] ^= 1;
    }
  }
}

// ---------------------------------------------------------------- region centres
const regions: any[] = db.regions;
const N = regions.length;
const cx = new Int32Array(N), cy = new Int32Array(N);
const idx = (x: number, y: number) => y * W + ((x + W) % W);
for (let i = 0; i < N; i++) {
  let x = toX(regions[i].lon), y = toY(regions[i].lat);
  if (!land[idx(x, y)]) {
    // snap to the nearest land cell within 3 cells, otherwise create an island marker cell
    let best = -1, bd = 1e9;
    for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
      const yy = y + dy; if (yy < 0 || yy >= H) continue;
      const k = idx(x + dx, yy); if (land[k] && dx * dx + dy * dy < bd) { bd = dx * dx + dy * dy; best = k; }
    }
    if (best >= 0) { x = best % W; y = Math.floor(best / W); } else land[idx(x, y)] = 1;
  }
  cx[i] = x; cy[i] = y;
}

// ---------------------------------------------------------------- landmass components (8-neighbour, wrapping)
const comp = new Int32Array(W * H).fill(-1);
let nComp = 0;
const stack: number[] = [];
for (let s = 0; s < W * H; s++) {
  if (!land[s] || comp[s] >= 0) continue;
  comp[s] = nComp; stack.push(s);
  while (stack.length) {
    const c = stack.pop()!; const x = c % W, y = (c / W) | 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const yy = y + dy; if (yy < 0 || yy >= H || (!dx && !dy)) continue;
      const k = idx(x + dx, yy); if (land[k] && comp[k] < 0) { comp[k] = nComp; stack.push(k); }
    }
  }
  nComp++;
}
const centresByComp = new Map<number, number[]>();
for (let i = 0; i < N; i++) { const c = comp[idx(cx[i], cy[i])]; (centresByComp.get(c) ?? centresByComp.set(c, []).get(c)!).push(i); }

// ---------------------------------------------------------------- assign cells
const D2R = Math.PI / 180;
const cLat = Float64Array.from(regions, (r) => cellLat(cy[regions.indexOf(r)]) * D2R);
const cLon = Float64Array.from(regions, (r) => cellLon(cx[regions.indexOf(r)]) * D2R);
const cosC = cLat.map(Math.cos), sinC = cLat.map(Math.sin);
function nearest(lat: number, lon: number, cands: number[] | null): [number, number] {
  const la = lat * D2R, lo = lon * D2R, cl = Math.cos(la), sl = Math.sin(la);
  let best = -1, bc = -2;
  const list = cands ?? [...Array(N).keys()];
  for (const i of list) {
    const c = sl * sinC[i] + cl * cosC[i] * Math.cos(lo - cLon[i]); // cos of angular distance
    if (c > bc) { bc = c; best = i; }
  }
  return [best, Math.acos(Math.min(1, bc)) * 6371];
}
const grid = new Uint16Array(W * H);
const MAX_ORPHAN_KM = 900;
for (let y = 0; y < H; y++) {
  const lat = cellLat(y);
  for (let x = 0; x < W; x++) {
    const k = y * W + x;
    if (!land[k]) { grid[k] = SEA; continue; }
    const cands = centresByComp.get(comp[k]) ?? null;
    const [best, d] = nearest(lat, cellLon(x), cands);
    grid[k] = cands || d < MAX_ORPHAN_KM ? best + 1 : UNASSIGNED;
  }
}
// guarantee every region owns at least its centre cell
const cellCount = new Int32Array(N);
for (let k = 0; k < W * H; k++) if (grid[k] && grid[k] !== UNASSIGNED) cellCount[grid[k] - 1]++;
for (let i = 0; i < N; i++) if (cellCount[i] === 0) { const k = idx(cx[i], cy[i]); if (grid[k] && grid[k] !== UNASSIGNED) cellCount[grid[k] - 1]--; grid[k] = i + 1; cellCount[i] = 1; }

// ---------------------------------------------------------------- adjacency, area, label, coast
const adj = new Map<string, number>();
const area = new Float64Array(N); const sx = new Float64Array(N), sy = new Float64Array(N), sc = new Float64Array(N);
const coastal = new Uint8Array(N);
const cellKm2 = (y: number) => (111.32 / CPD) * (111.32 / CPD) * Math.cos(cellLat(y) * D2R);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const g = grid[y * W + x]; if (!g || g === UNASSIGNED) continue;
  const i = g - 1; area[i] += cellKm2(y); sx[i] += x; sy[i] += y; sc[i]++;
  for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
    const yy = y + dy; if (yy < 0 || yy >= H) continue;
    const h = grid[idx(x + dx, yy)];
    if (!h) coastal[i] = 1;
    else if (h !== g && h !== UNASSIGNED && dx >= 0 && dy >= 0) { const a = Math.min(g, h) - 1, b = Math.max(g, h) - 1; const key = `${a},${b}`; adj.set(key, (adj.get(key) ?? 0) + 1); }
  }
}
// ---------------------------------------------------------------- sea links (multi-source BFS over sea cells)
const MAX_SEA = 28; // cells (~700 km at the equator)
const seaOwner = new Int32Array(W * H).fill(-1); const seaDist = new Int32Array(W * H).fill(1e9);
let q: number[] = [];
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const k = y * W + x; if (grid[k]) continue;
  for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
    const yy = y + dy; if (yy < 0 || yy >= H) continue; const h = grid[idx(x + dx, yy)];
    if (h && h !== UNASSIGNED) { seaOwner[k] = h - 1; seaDist[k] = 1; q.push(k); break; }
  }
}
for (let d = 1; d < MAX_SEA && q.length; d++) {
  const next: number[] = [];
  for (const k of q) { const x = k % W, y = (k / W) | 0;
    for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) { const yy = y + dy; if (yy < 0 || yy >= H) continue; const n = idx(x + dx, yy);
      if (grid[n] || seaDist[n] <= d + 1) continue; seaDist[n] = d + 1; seaOwner[n] = seaOwner[k]; next.push(n); } }
  q = next;
}
const seaLinks = new Map<string, number>();
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const k = y * W + x; const a = seaOwner[k]; if (a < 0) continue;
  for (const [dx, dy] of [[1, 0], [0, 1]]) { const yy = y + dy; if (yy >= H) continue; const n = idx(x + dx, yy); const b = seaOwner[n];
    if (b < 0 || b === a) continue; const dist = seaDist[k] + seaDist[n]; const key = a < b ? `${a},${b}` : `${b},${a}`;
    const km = (dist * 111.32) / CPD; if (!seaLinks.has(key) || seaLinks.get(key)! > km) seaLinks.set(key, km); }
}
for (const key of adj.keys()) seaLinks.delete(key);

// ---------------------------------------------------------------- outputs
const ids = regions.map((r) => r.id);
const regionsOut = regions.map((r, i) => ({
  id: r.id, area_km2: Math.round(area[i]), coastal: !!coastal[i], cells: sc[i],
  label: sc[i] ? [Math.round((sx[i] / sc[i]) * 10) / 10, Math.round((sy[i] / sc[i]) * 10) / 10] : [cx[i], cy[i]],
}));
const adjacency = [...adj.entries()].map(([k, len]) => { const [a, b] = k.split(',').map(Number); return [ids[a], ids[b], len]; });
const sea = [...seaLinks.entries()].map(([k, km]) => { const [a, b] = k.split(',').map(Number); return [ids[a], ids[b], Math.round(km)]; });
// coastline polylines (110m, simplified) in grid coordinates for crisp rendering
const coast: number[][] = [];
const l110: any = topojson.mesh(land110, land110.objects.land);
for (const line of l110.coordinates) {
  const pts: number[] = [];
  for (const [lon, lat] of line) { if (lat < -85 || lat > 85) continue; pts.push(Math.round((lon + 180) * CPD * 10) / 10, Math.round((LAT0 - lat) * CPD * 10) / 10); }
  if (pts.length >= 4) coast.push(pts);
}
// RLE encode grid as Uint16 pairs (value, run)
const runs: number[] = [];
for (let k = 0; k < W * H;) { const v = grid[k]; let n = 1; while (k + n < W * H && grid[k + n] === v && n < 65535) n++; runs.push(v, n); k += n; }
const bin = Buffer.from(new Uint16Array(runs).buffer);
fs.mkdirSync(path.join(ROOT, 'public/generated'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'public/generated/map.bin'), bin);
const topo = { width: W, height: H, cpd: CPD, lat0: LAT0, regionIds: ids, regions: regionsOut, adjacency, seaLinks: sea, components: nComp };
fs.writeFileSync(path.join(ROOT, 'src/generated/map.json'), JSON.stringify(topo));
fs.writeFileSync(path.join(ROOT, 'public/generated/coast.json'), JSON.stringify(coast));
const unassigned = grid.reduce((s, v) => s + (v === UNASSIGNED ? 1 : 0), 0);
const isolated = regionsOut.filter((r, i) => !adjacency.some((a) => a[0] === r.id || a[1] === r.id) && !sea.some((s) => s[0] === r.id || s[1] === r.id)).map((r) => r.id);
console.log(`build-map: ${W}x${H} grid, ${nComp} landmasses, ${adjacency.length} land borders, ${sea.length} sea links, ${runs.length / 2} runs (${(bin.length / 1024).toFixed(0)} KB), unassigned cells ${unassigned}, isolated regions: ${isolated.join(',') || 'none'}`);
