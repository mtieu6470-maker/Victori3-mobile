// Name placement for the map (pure functions; unit-tested in tests/ui.test.ts).
// Country names: centred on the "pole of inaccessibility" of each contiguous territory, bent along the territory's
// spine like hand-lettered atlas names, sized by the territory, kept ≥80% inside their own country, never
// overlapping each other or the map overlays, abbreviated or hidden when the territory is too small at this zoom.
// State (region) names appear only when zoomed in, in small italics, after all country names are placed.
// Priority: player / selected country, then great powers, then by area.
import { data } from '../../engine/data/db';
import type { GameState } from '../../engine/types';
import { cellAt, isLandAt, type MapGrid } from './mapData';
import type { Camera } from './renderer';
import { shortName, abbrevName } from '../game/names';

export interface LabelCand { owner: string; region?: string; text: string; abbr: string; x: number; y: number; km2: number; angle: number; bend: number; span: number; priority: number }
export interface Glyph { ch: string; x: number; y: number; a: number }
export type Box = { x: number; y: number; w: number; h: number };
export interface PlacedLabel { x: number; y: number; angle: number; size: number; text: string; owner: string; ls: number; kind: 'country' | 'sea' | 'state'; box: Box; glyphs: Glyph[] }

let gridRef: MapGrid | null = null; let ownerByIdx: string[] = []; let regionByIdx: string[] = [];
/** Owner lookup by grid cell (set by MapView whenever ownership changes). */
export function setOwnerLookup(g: MapGrid, st: GameState) {
  gridRef = g; const d = data(); const byId = new Map(st.regions.map((r) => [r.id, r.owner]));
  ownerByIdx = ['', ...d.map.regionIds.map((id) => byId.get(id) ?? '')]; regionByIdx = ['', ...d.map.regionIds];
}
export function ownerAtCell(_st: GameState | null, x: number, y: number): string { return gridRef ? ownerByIdx[cellAt(gridRef, x, y)] ?? '' : ''; }
const regionAtCell = (x: number, y: number) => (gridRef ? regionByIdx[cellAt(gridRef, x, y)] ?? '' : '');

/** Deepest cell of every country cluster, on a 4× reduced grid (multi-source BFS distance transform). */
function poles(keys: string[], clusterOfRegion: Map<string, string>) {
  const res = new Map<string, { x: number; y: number }>(); const g = gridRef; if (!g) return res;
  const F = 4, w = Math.floor(g.W / F), h = Math.floor(g.H / F); const kIndex = new Map(keys.map((k, i) => [k, i]));
  const cl = new Int32Array(w * h).fill(-1);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const v = cellAt(g, x * F + 1, y * F + 1); if (!v) continue; const c = clusterOfRegion.get(regionByIdx[v]); if (c !== undefined) cl[y * w + x] = kIndex.get(c)!; }
  const dist = new Int16Array(w * h).fill(-1); const q = new Int32Array(w * h); let qh = 0, qt = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x, c = cl[i]; if (c < 0) continue;
    if (cl[y * w + ((x + w - 1) % w)] !== c || cl[y * w + ((x + 1) % w)] !== c || (y > 0 ? cl[i - w] : -1) !== c || (y < h - 1 ? cl[i + w] : -1) !== c) { dist[i] = 0; q[qt++] = i; } }
  while (qh < qt) { const i = q[qh++]; const x = i % w, y = (i - x) / w; const c = cl[i];
    for (const j of [y * w + ((x + w - 1) % w), y * w + ((x + 1) % w), y > 0 ? i - w : -1, y < h - 1 ? i + w : -1]) { if (j < 0 || cl[j] !== c || dist[j] >= 0) continue; dist[j] = dist[i] + 1; q[qt++] = j; } }
  const best = new Int32Array(keys.length).fill(-1);
  for (let i = 0; i < w * h; i++) { const c = cl[i]; if (c >= 0 && (best[c] < 0 || dist[i] > dist[best[c]])) best[c] = i; }
  keys.forEach((k, c) => { const i = best[c]; if (i >= 0) res.set(k, { x: (i % w) * F + F / 2, y: Math.floor(i / w) * F + F / 2 }); });
  return res;
}
/** Curvature (1/cells) of the circle through the territory's chord mid-points on both sides of the centre. */
function spineBend(owner: string, px: number, py: number, angle: number, half: number): number {
  const ux = Math.cos(angle), uy = Math.sin(angle), nx = -uy, ny = ux; const step = Math.max(1, half / 40); const c = half * 0.6;
  const mid = (sx: number, sy: number) => { let a = 0, b = 0;
    while (a < half * 1.5 && ownerAtCell(null, sx + nx * (a + step), sy + ny * (a + step)) === owner) a += step;
    while (b < half * 1.5 && ownerAtCell(null, sx - nx * (b + step), sy - ny * (b + step)) === owner) b += step;
    return (a - b) / 2; };
  const sag = (mid(px - ux * c, py - uy * c) + mid(px + ux * c, py + uy * c)) / 2; // ends sit `sag` cells along the normal
  const k = (2 * sag) / (c * c); const lim = 0.7 / Math.max(1, c);
  return Math.max(-lim, Math.min(lim, k));
}

/** Requires setOwnerLookup() for the same state. */
export function buildCandidates(st: GameState, top: string[], focus: string | null): LabelCand[] {
  const d = data(); const m = d.map; const W = m.width; const cellsPerKm = m.cpd / 111.32;
  const regIdx = new Map(m.regionIds.map((id, i) => [id, i]));
  const owner = new Map(st.regions.map((r) => [r.id, r.owner]));
  const adj = new Map<string, string[]>();
  for (const [a, b] of m.adjacency) { (adj.get(a) ?? adj.set(a, []).get(a)!).push(b); (adj.get(b) ?? adj.set(b, []).get(b)!).push(a); }
  const byOwner = new Map<string, string[]>();
  for (const r of st.regions) { const c = st.countries[r.owner]; if (!c || c.decentralized) continue; (byOwner.get(r.owner) ?? byOwner.set(r.owner, []).get(r.owner)!).push(r.id); }
  const clusters: { o: string; cl: string[]; km2: number; key: string }[] = []; const clusterOf = new Map<string, string>();
  for (const [o, regs] of byOwner) {
    const seen = new Set<string>();
    for (const r0 of regs) {
      if (seen.has(r0)) continue; const cl: string[] = []; const q = [r0]; seen.add(r0);
      while (q.length) { const r = q.pop()!; cl.push(r); for (const n of adj.get(r) ?? []) if (!seen.has(n) && owner.get(n) === o) { seen.add(n); q.push(n); } }
      const key = `${o}:${cl[0]}`; cl.forEach((id) => clusterOf.set(id, key));
      clusters.push({ o, cl, km2: cl.reduce((s, id) => s + m.regions[regIdx.get(id)!].area_km2, 0), key });
    }
  }
  const pole = poles(clusters.map((c) => c.key), clusterOf);
  const biggest = new Map<string, number>(); for (const c of clusters) biggest.set(c.o, Math.max(biggest.get(c.o) ?? 0, c.km2));
  const homePole = new Map<string, { x: number; y: number }>();
  for (const c of clusters) { const cap = st.countries[c.o]?.capital; if (cap && c.cl.includes(cap) && pole.get(c.key)) homePole.set(c.o, pole.get(c.key)!); }
  const out: LabelCand[] = [];
  for (const c of clusters) {
    const capital = st.countries[c.o]?.capital; const home = !!capital && c.cl.includes(capital);
    if (!home && c.km2 < biggest.get(c.o)! * 0.25 && c.km2 < 60000) continue; // only substantial exclaves get a name
    // a secondary landmass close to the home cluster (Ireland beside Great Britain) shares the home label
    const hp = homePole.get(c.o), cp = pole.get(c.key);
    if (!home && hp && cp && c.km2 < biggest.get(c.o)! * 0.6) { let dx = Math.abs(hp.x - cp.x); dx = Math.min(dx, W - dx); if (Math.hypot(dx, hp.y - cp.y) / cellsPerKm < 1300) continue; }
    const pts = c.cl.map((id) => { const r = m.regions[regIdx.get(id)!]; return { x: r.label[0], y: r.label[1], w: r.area_km2 }; });
    const x0 = pts[0].x; for (const p of pts) { if (p.x - x0 > W / 2) p.x -= W; if (x0 - p.x > W / 2) p.x += W; }
    const sw = pts.reduce((s, p) => s + p.w, 0) || 1;
    const mx = pts.reduce((s, p) => s + p.x * p.w, 0) / sw, my = pts.reduce((s, p) => s + p.y * p.w, 0) / sw;
    let cxx = 0, cyy = 0, cxy = 0; for (const p of pts) { cxx += p.w * (p.x - mx) ** 2; cyy += p.w * (p.y - my) ** 2; cxy += p.w * (p.x - mx) * (p.y - my); }
    cxx /= sw; cyy /= sw; cxy /= sw;
    let angle = pts.length > 2 ? 0.5 * Math.atan2(2 * cxy, cxx - cyy) : 0;
    if (angle > Math.PI / 2) angle -= Math.PI; if (angle < -Math.PI / 2) angle += Math.PI; angle = Math.max(-0.49, Math.min(0.49, angle));
    const lam = (cxx + cyy) / 2 + Math.sqrt(((cxx - cyy) / 2) ** 2 + cxy * cxy);
    const span = Math.max(Math.sqrt(c.km2) * cellsPerKm * 1.15, Math.sqrt(lam) * 3.2);
    const p = pole.get(c.key) ?? { x: ((mx % W) + W) % W, y: my };
    const text = shortName(st, c.o);
    const pri = (c.o === focus ? 1e7 : 0) + (top.includes(c.o) ? 1e6 * (1 - top.indexOf(c.o) / 100) : 0) + c.km2 / 100 + (home ? 5e5 : 0);
    out.push({ owner: c.o, text, abbr: abbrevName(text), x: p.x, y: p.y, km2: c.km2, angle, bend: spineBend(c.o, p.x, p.y, angle, span / 2), span, priority: pri });
  }
  // state (region) names — used only when zoomed in
  for (const r of st.regions) {
    const i = regIdx.get(r.id); if (i === undefined) continue; const mr = m.regions[i]; const nm = d.region.get(r.id)?.name; if (!nm || !mr.cells) continue;
    const t = nm.replace(/\s*\(.*\)$/, '');
    out.push({ owner: r.owner, region: r.id, text: t, abbr: t, x: mr.label[0], y: mr.label[1], km2: mr.area_km2, angle: 0, bend: 0, span: Math.sqrt(mr.area_km2) * cellsPerKm * 1.1, priority: -1 / (1 + mr.area_km2) });
  }
  return out.sort((a, b) => b.priority - a.priority);
}

export type Measure = (text: string, size: number, italic?: boolean) => number;
const SEAS: { text: string; lon: number; lat: number; size: number }[] = [
  { text: 'Đại Tây Dương', lon: -38, lat: 28, size: 16 }, { text: 'Đại Tây Dương', lon: -25, lat: -18, size: 15 }, { text: 'Thái Bình Dương', lon: -140, lat: 10, size: 16 }, { text: 'Thái Bình Dương', lon: 170, lat: 18, size: 16 },
  { text: 'Ấn Độ Dương', lon: 78, lat: -22, size: 16 }, { text: 'Bắc Băng Dương', lon: 20, lat: 80, size: 13 }, { text: 'Nam Đại Dương', lon: 40, lat: -62, size: 13 },
  { text: 'Địa Trung Hải', lon: 18, lat: 34.6, size: 12 }, { text: 'Biển Bắc', lon: 3.5, lat: 56, size: 12 }, { text: 'Biển Baltic', lon: 19.2, lat: 56.4, size: 11 },
  { text: 'Biển Đen', lon: 34, lat: 43.3, size: 11 }, { text: 'Biển Caribe', lon: -75, lat: 15, size: 12 }, { text: 'Vịnh Bengal', lon: 89, lat: 15, size: 12 }, { text: 'Biển Đông', lon: 114, lat: 14, size: 12 },
  { text: 'Biển Ả Rập', lon: 63, lat: 15, size: 12 }, { text: 'Vịnh Mexico', lon: -90, lat: 25, size: 12 }, { text: 'Biển Nhật Bản', lon: 135, lat: 40, size: 11 }, { text: 'Biển Caspi', lon: 51, lat: 41.5, size: 11 },
];

/** Places labels for the current camera. Letter spacing is included in the measured width. */
export function layoutLabels(cands: LabelCand[], cam: Camera, vw: number, vh: number, grid: MapGrid, measure: Measure, st: GameState | null, minX = 0, avoid: Box[] = []): PlacedLabel[] {
  const placed: PlacedLabel[] = []; const W = grid.W; const degPerPx = cam.scale / grid.cpd;
  const toScreen = (x: number, y: number) => { let dx = (((x - cam.x0) % W) + W) % W; if (dx > (vw + 300) * cam.scale && dx - W > -300 * cam.scale) dx -= W; return { sx: dx / cam.scale, sy: (y - cam.y0) / cam.scale }; };
  const free = (b: Box) => b.x >= minX + 2 && b.y >= 2 && b.x + b.w <= vw - 2 && b.y + b.h <= vh - 2 && ![...placed.map((p) => p.box), ...avoid].some((p) => b.x < p.x + p.w && p.x < b.x + b.w && b.y < p.y + p.h && p.y < b.y + b.h);
  /** Lays characters along a circular arc (curvature k per px) centred at (sx, sy) and rotated by a. */
  const arc = (text: string, sx: number, sy: number, a: number, k: number, size: number, ls: number, italic = false): { glyphs: Glyph[]; box: Box } => {
    const chars = [...text]; const ws = chars.map((ch) => measure(ch, size, italic)); const total = ws.reduce((s, w) => s + w, 0) + ls * (ws.length - 1);
    let s = -total / 2; const glyphs: Glyph[] = []; let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; const ca = Math.cos(a), sa = Math.sin(a);
    chars.forEach((ch, i) => {
      const sc = s + ws[i] / 2; const th = sc * k; const lx = Math.abs(k) < 1e-7 ? sc : Math.sin(th) / k, ly = Math.abs(k) < 1e-7 ? 0 : (1 - Math.cos(th)) / k;
      const x = sx + lx * ca - ly * sa, y = sy + lx * sa + ly * ca; glyphs.push({ ch, x, y, a: a + th });
      x0 = Math.min(x0, x - size * 0.55); x1 = Math.max(x1, x + size * 0.55); y0 = Math.min(y0, y - size * 0.6); y1 = Math.max(y1, y + size * 0.6);
      s += ws[i] + ls;
    });
    return { glyphs, box: { x: x0 - 2, y: y0 - 2, w: x1 - x0 + 4, h: y1 - y0 + 4 } };
  };
  const inside = (glyphs: Glyph[], size: number, test: (x: number, y: number) => boolean) => {
    let ok = 0, n = 0;
    for (const g of glyphs) for (const t of [-0.3, 0.3]) { const nx = -Math.sin(g.a) * t * size, ny = Math.cos(g.a) * t * size; n++; if (test(cam.x0 + (g.x + nx) * cam.scale, cam.y0 + (g.y + ny) * cam.scale)) ok++; }
    return n > 0 && ok / n >= 0.8;
  };
  for (const cd of cands) {
    if (cd.region) continue;
    const { sx, sy } = toScreen(cd.x, cd.y);
    if (sx < -300 || sx > vw + 300 || sy < -300 || sy > vh + 300) continue;
    const spanPx = cd.span / cam.scale; if (spanPx < 26) continue;
    let done = false;
    for (const [text, minSize] of [[cd.text, 12], [cd.abbr, 11]] as const) {
      if (done || (minSize === 11 && cd.abbr === cd.text)) continue;
      const ls = (sz: number) => sz * 0.16;
      const w10 = measure(text, 10) + (text.length - 1) * ls(10);
      let size = Math.min(40, Math.max(minSize, (0.8 * spanPx / w10) * 10));
      for (let attempt = 0; attempt < 9 && !done; attempt++) {
        for (const bendScale of [1, 0]) {
          const lay = arc(text, sx, sy, cd.angle, cd.bend * cam.scale * bendScale, size, ls(size));
          if (inside(lay.glyphs, size, (x, y) => ownerAtCell(st, x, y) === cd.owner) && free(lay.box)) { placed.push({ x: sx, y: sy, angle: cd.angle, size, text, owner: cd.owner, ls: ls(size), kind: 'country', box: lay.box, glyphs: lay.glyphs }); done = true; break; }
          if (cd.bend === 0) break;
        }
        size *= 0.87; if (size < minSize) break;
      }
    }
  }
  // seas and oceans: italic capitals over open water only
  for (const s of SEAS) {
    const cx = (s.lon + 180) * grid.cpd, cy = (grid.lat0 - s.lat) * grid.cpd; if (isLandAt(grid, cx, cy)) continue;
    const { sx, sy } = toScreen(cx, cy); const size = Math.min(20, Math.max(11, s.size * Math.min(1.3, Math.max(0.85, 0.06 / degPerPx))));
    const text = s.text.toUpperCase(); const lay = arc(text, sx, sy, 0, 0, size, size * 0.32, true);
    if (lay.glyphs.every((g) => !isLandAt(grid, cam.x0 + g.x * cam.scale, cam.y0 + g.y * cam.scale)) && free(lay.box)) placed.push({ x: sx, y: sy, angle: 0, size, text, owner: '', ls: size * 0.32, kind: 'sea', box: lay.box, glyphs: lay.glyphs });
  }
  // state names when zoomed in (under ~0.03° per px)
  if (degPerPx < 0.03) {
    let n = 0;
    for (const cd of cands) {
      if (!cd.region || n > 60) continue;
      const { sx, sy } = toScreen(cd.x, cd.y); if (sx < 0 || sx > vw || sy < 0 || sy > vh) continue;
      const size = 11.5; const w = measure(cd.text, size, true) + cd.text.length * 0.6; if (w > (cd.span / cam.scale) * 1.2) continue;
      const lay = arc(cd.text, sx, sy, 0, 0, size, 0.6, true);
      if (inside(lay.glyphs, size, (x, y) => regionAtCell(x, y) === cd.region) && free(lay.box)) { placed.push({ x: sx, y: sy, angle: 0, size, text: cd.text, owner: cd.owner, ls: 0.6, kind: 'state', box: lay.box, glyphs: lay.glyphs }); n++; }
    }
  }
  return placed;
}
