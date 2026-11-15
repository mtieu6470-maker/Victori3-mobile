// Country-name placement for the political map (pure functions; unit-tested in tests/ui-labels.test.ts).
// Rules: names sit at the centre of the country's largest contiguous territory, follow its main axis
// (±28°), scale with the territory, must stay ≥80% inside their own country, never overlap another label,
// and are dropped (or abbreviated) when the territory is too small at the current zoom. Priority:
// player/selected country, then great powers, then by area.
import { data } from '../../engine/data/db';
import type { GameState } from '../../engine/types';
import { cellAt, type MapGrid } from './mapData';
import type { Camera } from './renderer';
import { shortName, abbrevName } from '../game/names';

export interface LabelCand { owner: string; text: string; abbr: string; x: number; y: number; cells: number; angle: number; span: number; priority: number }
export interface PlacedLabel { x: number; y: number; angle: number; size: number; text: string; owner: string; ls: number; kind: 'country' | 'sea'; box: { x: number; y: number; w: number; h: number } }

/** Requires setOwnerLookup() to have been called for the same state. */
export function buildCandidates(st: GameState, top: string[], focus: string | null): LabelCand[] {
  const d = data(); const m = d.map; const W = m.width;
  const regIdx = new Map(m.regionIds.map((id, i) => [id, i]));
  const owner = new Map(st.regions.map((r) => [r.id, r.owner]));
  const adj = new Map<string, string[]>();
  for (const [a, b] of m.adjacency) { (adj.get(a) ?? adj.set(a, []).get(a)!).push(b); (adj.get(b) ?? adj.set(b, []).get(b)!).push(a); }
  const byOwner = new Map<string, string[]>();
  for (const r of st.regions) { const c = st.countries[r.owner]; if (!c || c.decentralized) continue; (byOwner.get(r.owner) ?? byOwner.set(r.owner, []).get(r.owner)!).push(r.id); }
  const out: LabelCand[] = [];
  // pole of inaccessibility per country cluster: the land cell farthest from any foreign border or coast
  const poles = clusterPoles(st, byOwner, adj, owner);
  for (const [o, regs] of byOwner) {
    const seen = new Set<string>(); const clusters: string[][] = [];
    for (const r0 of regs) {
      if (seen.has(r0)) continue; const cl: string[] = []; const q = [r0]; seen.add(r0);
      while (q.length) { const r = q.pop()!; cl.push(r); for (const n of adj.get(r) ?? []) if (!seen.has(n) && owner.get(n) === o) { seen.add(n); q.push(n); } }
      clusters.push(cl);
    }
    const sized = clusters.map((cl) => ({ cl, cells: cl.reduce((s, id) => s + m.regions[regIdx.get(id)!].cells, 0) })).sort((a, b) => b.cells - a.cells);
    const text = shortName(st, o); const abbr = abbrevName(text);
    const capital = st.countries[o]?.capital;
    sized.forEach(({ cl, cells }, ci) => {
      const home = !!capital && cl.includes(capital);
      if (ci > 0 && !home && cells < sized[0].cells * 0.25 && cells < 60) return; // minor exclaves only when substantial
      const pts = cl.map((id) => { const r = m.regions[regIdx.get(id)!]; return { x: r.label[0], y: r.label[1], w: r.cells }; });
      const x0 = pts[0].x; for (const p of pts) { if (p.x - x0 > W / 2) p.x -= W; if (x0 - p.x > W / 2) p.x += W; }
      const sw = pts.reduce((s, p) => s + p.w, 0);
      let mx = pts.reduce((s, p) => s + p.x * p.w, 0) / sw; const my = pts.reduce((s, p) => s + p.y * p.w, 0) / sw;
      let cxx = 0, cyy = 0, cxy = 0;
      for (const p of pts) { cxx += p.w * (p.x - mx) ** 2; cyy += p.w * (p.y - my) ** 2; cxy += p.w * (p.x - mx) * (p.y - my); }
      cxx /= sw; cyy /= sw; cxy /= sw;
      let angle = pts.length > 2 ? 0.5 * Math.atan2(2 * cxy, cxx - cyy) : 0;
      if (angle > Math.PI / 2) angle -= Math.PI; if (angle < -Math.PI / 2) angle += Math.PI;
      angle = Math.max(-0.49, Math.min(0.49, angle));
      const lam = (cxx + cyy) / 2 + Math.sqrt(((cxx - cyy) / 2) ** 2 + cxy * cxy);
      const span = Math.max(Math.sqrt(cells) * 1.15, Math.sqrt(lam) * 3.2);
      mx = ((mx % W) + W) % W;
      const big = cl.reduce((b, id) => (m.regions[regIdx.get(id)!].cells > m.regions[regIdx.get(b)!].cells ? id : b), cl[0]);
      let ax = mx, ay = my;
      const pole = poles.get(cl[0]);
      if (pole) { ax = pole.x + 0.5; ay = pole.y + 0.5; }
      else if (ownerAtCell(st, mx, my) !== o) { const r = m.regions[regIdx.get(big)!]; ax = r.label[0]; ay = r.label[1]; }
      const pri = (o === focus ? 1e7 : 0) + (top.includes(o) ? 1e6 * (1 - top.indexOf(o) / 100) : 0) + cells + (home ? 5e5 : -ci * 1e3);
      out.push({ owner: o, text, abbr, x: ax, y: ay, cells, angle, span, priority: pri });
    });
  }
  return out.sort((a, b) => b.priority - a.priority);
}

/** Multi-source BFS distance transform over the grid; returns, for each cluster (keyed by its first region id), its deepest cell. */
function clusterPoles(st: GameState, byOwner: Map<string, string[]>, adj: Map<string, string[]>, owner: Map<string, string>) {
  const res = new Map<string, { x: number; y: number; d: number }>();
  if (!gridRef) return res;
  const g = gridRef; const W = g.W, H = g.H; const d = data();
  // cluster id per region index (+1 to match the grid)
  const clusterOf = new Int32Array(d.map.regionIds.length + 1).fill(-1); const keys: string[] = [];
  for (const [o, regs] of byOwner) {
    const seen = new Set<string>();
    for (const r0 of regs) {
      if (seen.has(r0)) continue; const id = keys.length; keys.push(r0); const q = [r0]; seen.add(r0);
      while (q.length) { const r = q.pop()!; clusterOf[(d.regionIndex.get(r) ?? -1) + 1] = id; for (const n of adj.get(r) ?? []) if (!seen.has(n) && owner.get(n) === o) { seen.add(n); q.push(n); } }
    }
  }
  const cl = new Int32Array(W * H);
  for (let i = 0; i < W * H; i++) cl[i] = g.idx[i] ? clusterOf[g.idx[i]] : -1;
  const dist = new Int16Array(W * H).fill(-1); const queue = new Int32Array(W * H); let qh = 0, qt = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x; const c = cl[i]; if (c < 0) continue;
    const l = cl[y * W + ((x + W - 1) % W)], r = cl[y * W + ((x + 1) % W)], u = y > 0 ? cl[i - W] : -1, dn = y < H - 1 ? cl[i + W] : -1;
    if (l !== c || r !== c || u !== c || dn !== c) { dist[i] = 0; queue[qt++] = i; }
  }
  while (qh < qt) {
    const i = queue[qh++]; const x = i % W, y = (i - x) / W; const c = cl[i]; const nd = dist[i] + 1;
    for (const j of [y * W + ((x + W - 1) % W), y * W + ((x + 1) % W), y > 0 ? i - W : -1, y < H - 1 ? i + W : -1]) {
      if (j < 0 || cl[j] !== c || dist[j] >= 0) continue; dist[j] = nd; queue[qt++] = j;
    }
  }
  const best = new Int32Array(keys.length).fill(-1);
  for (let i = 0; i < W * H; i++) { const c = cl[i]; if (c >= 0 && (best[c] < 0 || dist[i] > dist[best[c]])) best[c] = i; }
  keys.forEach((k, c) => { const i = best[c]; if (i >= 0) res.set(k, { x: i % W, y: Math.floor(i / W), d: dist[i] }); });
  return res;
}

let gridRef: MapGrid | null = null; let ownerByIdx: string[] = [];
/** Owner lookup by grid cell (set once per render pass by MapView). */
export function setOwnerLookup(g: MapGrid, st: GameState) {
  gridRef = g; const d = data(); const byId = new Map(st.regions.map((r) => [r.id, r.owner]));
  ownerByIdx = ['', ...d.map.regionIds.map((id) => byId.get(id) ?? '')];
}
export function ownerAtCell(_st: GameState | null, x: number, y: number): string { return gridRef ? ownerByIdx[cellAt(gridRef, x, y)] ?? '' : ''; }

export type Measure = (text: string, size: number) => number;
const SEAS: { text: string; lon: number; lat: number; size: number }[] = [
  { text: 'Đại Tây Dương', lon: -38, lat: 28, size: 15 }, { text: 'Thái Bình Dương', lon: -140, lat: 10, size: 15 }, { text: 'Thái Bình Dương', lon: 170, lat: 18, size: 15 },
  { text: 'Ấn Độ Dương', lon: 78, lat: -22, size: 15 }, { text: 'Bắc Băng Dương', lon: 20, lat: 80, size: 13 }, { text: 'Nam Đại Dương', lon: 40, lat: -62, size: 13 },
  { text: 'Địa Trung Hải', lon: 18, lat: 35.2, size: 12 }, { text: 'Biển Bắc', lon: 3.5, lat: 56, size: 12 }, { text: 'Biển Baltic', lon: 19.5, lat: 57.5, size: 11 },
  { text: 'Biển Đen', lon: 34, lat: 43.3, size: 11 }, { text: 'Biển Caribe', lon: -75, lat: 15, size: 12 }, { text: 'Vịnh Bengal', lon: 89, lat: 15, size: 12 }, { text: 'Biển Đông', lon: 114, lat: 14, size: 12 },
];

/** Places labels for the current camera. `ls` is letter spacing in px (included in measured width). */
export type Box = { x: number; y: number; w: number; h: number };
export function layoutLabels(cands: LabelCand[], cam: Camera, vw: number, vh: number, grid: MapGrid, measure: Measure, st: GameState | null, minX = 0, avoid: Box[] = []): PlacedLabel[] {
  const placed: PlacedLabel[] = [];
  const W = grid.W;
  const toScreen = (x: number, y: number) => { let dx = x - cam.x0; dx = ((dx % W) + W) % W; if (dx * 1 > vw * cam.scale + 50 && dx - W > -50) dx -= W; return { sx: dx / cam.scale, sy: (y - cam.y0) / cam.scale }; };
  const fits = (o: string, sx: number, sy: number, w: number, h: number, a: number) => {
    let inside = 0, n = 0; const c = Math.cos(a), s = Math.sin(a);
    for (let i = 0; i <= 8; i++) for (const t of [-0.3, 0.3]) {
      const u = (i / 8 - 0.5) * w, v = t * h; const px = sx + u * c - v * s, py = sy + u * s + v * c;
      n++; if (ownerAtCell(st, cam.x0 + px * cam.scale, cam.y0 + py * cam.scale) === o) inside++;
    }
    return inside / n >= 0.8;
  };
  const aabb = (sx: number, sy: number, w: number, h: number, a: number) => { const c = Math.abs(Math.cos(a)), s = Math.abs(Math.sin(a)); const bw = w * c + h * s, bh = w * s + h * c; return { x: sx - bw / 2 - 3, y: sy - bh / 2 - 3, w: bw + 6, h: bh + 6 }; };
  const free = (b: PlacedLabel['box']) => b.x >= minX + 2 && b.y >= 2 && b.x + b.w <= vw - 2 && b.y + b.h <= vh - 2 && ![...placed.map((p) => p.box), ...avoid].some((p) => b.x < p.x + p.w && p.x < b.x + b.w && b.y < p.y + p.h && p.y < b.y + b.h);
  for (const cd of cands) {
    const { sx, sy } = toScreen(cd.x, cd.y);
    if (sx < -200 || sx > vw + 200 || sy < -200 || sy > vh + 200) continue;
    const areaPx = cd.cells / (cam.scale * cam.scale);
    if (areaPx < 260) continue;
    const spanPx = cd.span / cam.scale;
    let done = false;
    for (const [text, minSize] of [[cd.text, 12], [cd.abbr, 11]] as const) {
      if (done || (text === cd.abbr && cd.abbr === cd.text && minSize === 11)) continue;
      const ls = (sz: number) => sz * 0.14;
      const w10 = measure(text, 10) + (text.length - 1) * ls(10);
      let size = Math.min(34, Math.max(minSize, (0.78 * spanPx / w10) * 10));
      for (let attempt = 0; attempt < 8 && !done; attempt++) {
        const w = measure(text, size) + (text.length - 1) * ls(size); const h = size * 1.05;
        if (w > spanPx * 1.08 && size <= minSize) break;
        for (const a of [cd.angle, 0]) {
          const box = aabb(sx, sy, w, h, a);
          if (fits(cd.owner, sx, sy, w, h, a) && free(box)) { placed.push({ x: sx, y: sy, angle: a, size, text, owner: cd.owner, ls: ls(size), kind: 'country', box }); done = true; break; }
          if (a === 0) break;
        }
        size *= 0.86; if (size < minSize) break;
      }
    }
  }
  // ocean and sea names (italic), only where the anchor is open sea and nothing collides
  for (const s of SEAS) {
    const cx = (s.lon + 180) * grid.cpd, cy = (grid.lat0 - s.lat) * grid.cpd;
    const { sx, sy } = toScreen(cx, cy); const size = Math.min(20, s.size * Math.max(0.85, Math.min(1.35, 0.25 / cam.scale)));
    if (cellAt(grid, cx, cy) !== 0) continue;
    const text = s.text.toUpperCase(); const ls = size * 0.3; const w = measure(text, size) + (text.length - 1) * ls; const box = aabb(sx, sy, w, size, 0);
    let sea = 0; for (let i = 0; i <= 10; i++) if (cellAt(grid, cam.x0 + (sx + (i / 10 - 0.5) * w) * cam.scale, cam.y0 + sy * cam.scale) === 0) sea++;
    if (sea < 10) continue; // the whole name must lie over open water
    if (free(box)) placed.push({ x: sx, y: sy, angle: 0, size, text, owner: '', ls, kind: 'sea', box });
  }
  return placed;
}
