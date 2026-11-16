// Interactive map: WebGL fill layer + 2D overlay (graticule labels, lakes, rivers, state/country borders, coasts,
// selection outlines, capitals, names). Touch: drag to pan, pinch to zoom, tap to select, double-tap to zoom in;
// mouse: wheel zoom, hover highlight with tooltip. Camera moves to a target are animated (fly-to).
import { useEffect, useRef, useState } from 'preact/hooks';
import { data } from '../../engine/data/db';
import { rankings } from '../../engine/metrics';
import type { GameState } from '../../engine/types';
import { MapRenderer, type Camera } from './renderer';
import { buildPalette, lensById } from './lenses';
import { buildCandidates, layoutLabels, setOwnerLookup, type Box, type LabelCand } from './labels';
import { cellAt, type MapGrid } from './mapData';
import { buildPaths, type VectorData, type VectorPaths } from './vectors';
import { ui, type LensId } from '../game/ui';
import { isLongPress } from './gestures';

export interface MapAssets { grid: MapGrid; relief: HTMLImageElement | null; coastDist: HTMLImageElement | null; terrain: HTMLImageElement | null; vectors: VectorData | null }
interface Props { assets: MapAssets; st: GameState; version: number; lens: LensId; focus: string | null; selRegion: string | null; selCountry: string | null; dim?: boolean; onSelect: (regionId: string | null, at?: { x: number; y: number }) => void; onLongPress?: (regionId: string, at: { x: number; y: number }) => void; onHover?: (regionId: string | null, x: number, y: number) => void; insetLeft?: number; avoid?: (w: number, h: number) => Box[] }

const MIN_DEG_PER_PX = 0.0045; // closest zoom (~0.5 km per CSS px)
const SERIF = '"EB Garamond", "Noto Serif", Georgia, serif';
export const degToScale = (grid: MapGrid, deg: number) => deg * grid.cpd;

export function defaultCamera(st: GameState, grid: MapGrid, vw: number, vh: number): { cx: number; cy: number; scale: number } {
  const d = data(); const id = st.player ?? rankings(st)[0]?.id; const cap = id ? st.countries[id]?.capital : null;
  const r = cap ? d.map.regions[d.regionIndex.get(cap) ?? -1] : null;
  const span = 42 * grid.cpd; // ~42° across the larger viewport side
  return { cx: r ? r.label[0] + 4 * grid.cpd : grid.W / 2, cy: r ? r.label[1] + 2 * grid.cpd : grid.H * 0.3, scale: span / Math.max(vw, vh) };
}

export function MapView(p: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const glc = useRef<HTMLCanvasElement>(null);
  const ovc = useRef<HTMLCanvasElement>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const R = useRef<{ r: MapRenderer | null; cands: LabelCand[]; candKey: string; paths: VectorPaths | null; raf: number; size: { w: number; h: number }; err: string | null; moving: boolean; idle: number; hover: number; sel: { key: string; region: Path2D | null; country: Path2D | null } }>({ r: null, cands: [], candKey: '', paths: null, raf: 0, size: { w: 1, h: 1 }, err: null, moving: false, idle: 0, hover: -1, sel: { key: '', region: null, country: null } });
  const props = useRef(p); props.current = p;
  const grid = p.assets.grid;

  const clampCam = (c: { cx: number; cy: number; scale: number }) => {
    const s = R.current.size; const maxScale = Math.min(grid.W / s.w, grid.H / s.h);
    c.scale = Math.max(degToScale(grid, MIN_DEG_PER_PX), Math.min(maxScale, c.scale));
    const halfH = (s.h * c.scale) / 2; c.cy = Math.max(halfH, Math.min(grid.H - halfH, c.cy)); c.cx = ((c.cx % grid.W) + grid.W) % grid.W;
    return c;
  };
  const cam = (): Camera & { cx: number; cy: number } => {
    const s = R.current.size; let c = ui.get().camera;
    if (!c) { c = defaultCamera(props.current.st, grid, s.w, s.h); c.cx -= ((insets.l - insets.r) / 2) * c.scale; c.cy -= ((insets.t - insets.b) / 2) * c.scale; ui.get().camera = c; }
    clampCam(c);
    return { cx: c.cx, cy: c.cy, scale: c.scale, x0: c.cx - (s.w * c.scale) / 2, y0: c.cy - (s.h * c.scale) / 2 };
  };
  const schedule = () => { if (!R.current.raf) R.current.raf = requestAnimationFrame(draw); };
  const moving = () => { R.current.moving = true; clearTimeout(R.current.idle); R.current.idle = window.setTimeout(() => { R.current.moving = false; schedule(); }, 140); };

  function draw() {
    R.current.raf = 0;
    const { st, focus, selCountry } = props.current; const r = R.current.r; const s = R.current.size;
    if (!r || !ovc.current) return;
    const c = cam(); const dpr = Math.min(2, window.devicePixelRatio || 1); const deg = c.scale / grid.cpd;
    const terrain = props.current.lens === 'terrain';
    r.draw(c, s.w, s.h, dpr, { band: !terrain && (!R.current.moving || deg > 0.05), lines: true, terrain, hover: R.current.hover, dim: !!props.current.dim });
    const cv = ovc.current; const ctx = cv.getContext('2d')!;
    if (cv.width !== Math.round(s.w * dpr) || cv.height !== Math.round(s.h * dpr)) { cv.width = Math.round(s.w * dpr); cv.height = Math.round(s.h * dpr); }
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
    const inset = props.current.insetLeft ?? 0;
    // ---- vector layers in grid coordinates, repeated across the antimeridian when needed
    const v = props.current.assets.vectors;
    if (v) {
      R.current.paths = buildPaths(v, st, R.current.paths); const P = R.current.paths;
      const sr = props.current.selRegion, sc = props.current.selCountry; const skey = `${sr}|${sc}|${P.key.length}|${st.territoryLog.length}`;
      if (R.current.sel.key !== skey) {
        const d = data(); const ri = sr ? d.regionIndex.get(sr) ?? -9 : -9; const byId = new Map(st.regions.map((x) => [x.id, x.owner])); const own = d.map.regionIds.map((id) => byId.get(id) ?? '');
        const reg = sr ? new Path2D() : null, cty = sc ? new Path2D() : null;
        for (const line of v.lines) {
          const [a, b] = v.pairs[line[0]];
          if (reg && (a === ri || b === ri)) { reg.moveTo(line[1], line[2]); for (let i = 3; i < line.length; i += 2) reg.lineTo(line[i], line[i + 1]); }
          if (cty && ((a >= 0 && own[a] === sc) !== (b >= 0 && own[b] === sc))) { cty.moveTo(line[1], line[2]); for (let i = 3; i < line.length; i += 2) cty.lineTo(line[i], line[i + 1]); }
        }
        R.current.sel = { key: skey, region: reg, country: cty };
      }
      const S = R.current.sel;
      const k = dpr / c.scale; const px = c.scale; // 1 CSS px in grid units
      const offs = [0]; if (c.x0 < 0) offs.push(-grid.W); if (c.x0 + s.w * c.scale > grid.W) offs.push(grid.W);
      for (const o of offs) {
        ctx.setTransform(k, 0, 0, k, (o - c.x0) * k, -c.y0 * k);
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        ctx.fillStyle = '#3d6974'; ctx.fill(P.lakes, 'evenodd'); ctx.strokeStyle = 'rgba(12,20,24,0.7)'; ctx.lineWidth = 0.8 * px; ctx.stroke(P.lakes);
        if (deg < 0.16) { ctx.strokeStyle = 'rgba(78,128,150,0.85)'; ctx.lineWidth = (deg < 0.04 ? 1.5 : 1.0) * px; ctx.stroke(P.riversMajor); }
        if (deg < 0.06) { ctx.strokeStyle = 'rgba(78,128,150,0.6)'; ctx.lineWidth = 0.8 * px; ctx.stroke(P.riversMinor); }
        if (deg < 0.09) { ctx.strokeStyle = terrain ? `rgba(60,40,26,${deg < 0.035 ? 0.38 : 0.24})` : `rgba(40,30,20,${deg < 0.035 ? 0.46 : 0.3})`; ctx.lineWidth = 0.7 * px; ctx.setLineDash([3 * px, 2.2 * px]); ctx.stroke(P.state); ctx.setLineDash([]); }
        ctx.strokeStyle = 'rgba(250,240,215,0.3)'; ctx.lineWidth = 2.8 * px; ctx.stroke(P.country);
        ctx.strokeStyle = terrain ? 'rgba(70,22,18,0.85)' : 'rgba(22,16,10,0.88)'; ctx.lineWidth = (deg > 0.2 ? 1.0 : 1.35) * px; ctx.stroke(P.country);
        ctx.strokeStyle = 'rgba(10,18,22,0.85)'; ctx.lineWidth = (deg > 0.2 ? 0.8 : 1.1) * px; ctx.stroke(P.coast);
        // selection: the selected country's outline glows gold, the selected state gets a bright double rule
        if (S.country) { ctx.strokeStyle = 'rgba(255,220,150,0.28)'; ctx.lineWidth = 6 * px; ctx.stroke(S.country); ctx.strokeStyle = 'rgba(255,232,180,0.95)'; ctx.lineWidth = 1.8 * px; ctx.stroke(S.country); }
        if (S.region) { ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 4.5 * px; ctx.stroke(S.region); ctx.strokeStyle = '#ffe9b0'; ctx.lineWidth = 1.7 * px; ctx.stroke(S.region); }
      }
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const step = (deg < 0.02 ? 5 : deg < 0.12 ? 10 : 30) * grid.cpd;
    ctx.font = `italic 12px ${SERIF}`; ctx.fillStyle = 'rgba(176,204,208,0.6)'; ctx.textBaseline = 'top'; ctx.textAlign = 'left';
    for (let gx = Math.ceil(c.x0 / step) * step; gx < c.x0 + s.w * c.scale; gx += step) {
      const lon = Math.round(((((gx / grid.cpd) % 360) + 360) % 360) - 180); if (lon === -180) continue;
      const x = (gx - c.x0) / c.scale; if (x < inset + 16) continue; ctx.fillText(`${Math.abs(lon)}°${lon < 0 ? 'T' : lon > 0 ? 'Đ' : ''}`, x + 3, 3);
    }
    for (let gy = Math.ceil(c.y0 / step) * step; gy < c.y0 + s.h * c.scale; gy += step) {
      const lat = Math.round(grid.lat0 - gy / grid.cpd); const y = (gy - c.y0) / c.scale; if (y < 18) continue;
      ctx.fillText(`${Math.abs(lat)}°${lat > 0 ? 'B' : lat < 0 ? 'N' : ''}`, inset + 4, y + 2);
    }
    if (deg < 0.016) {
      // capital markers: larger countries first, decluttered (no two markers closer than 26 px, none under map chrome)
      const d = data(); const placed: [number, number][] = []; const boxes = props.current.avoid?.(s.w, s.h) ?? [];
      const caps = Object.values(st.countries).filter((co) => co.alive && !co.decentralized).sort((a, b) => b.stats.pop - a.stats.pop);
      for (const co of caps) {
        const mr = d.map.regions[d.regionIndex.get(co.capital) ?? -1]; if (!mr) continue;
        const x = ((((mr.label[0] - c.x0) % grid.W) + grid.W) % grid.W) / c.scale, y = (mr.label[1] - c.y0) / c.scale; if (x < inset || x > s.w || y < 0 || y > s.h) continue;
        if (placed.some(([px, py]) => Math.hypot(px - x, py - y) < 26) || boxes.some((b) => x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h)) continue;
        placed.push([x, y]);
        ctx.fillStyle = '#1a140c'; ctx.beginPath(); ctx.arc(x, y, 3.8, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#ecd39a'; ctx.beginPath(); ctx.arc(x, y, 2.1, 0, Math.PI * 2); ctx.fill();
      }
    }
    const key = `${st.territoryLog.length}|${Object.values(st.countries).filter((x) => x.alive).length}|${focus}`;
    if (key !== R.current.candKey) { setOwnerLookup(grid, st); R.current.cands = buildCandidates(st, rankings(st).slice(0, 8).map((x) => x.id), focus); R.current.candKey = key; }
    const measure = (t: string, size: number, italic = false) => { ctx.font = `${italic ? 'italic 500' : '600'} ${size}px ${SERIF}`; return ctx.measureText(t).width; };
    const labels = layoutLabels(R.current.cands, c, s.w, s.h, grid, measure, st, inset, props.current.avoid?.(s.w, s.h) ?? []);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    for (const l of labels) {
      ctx.font = l.kind === 'country' ? `600 ${l.size}px ${SERIF}` : `italic 500 ${l.size}px ${SERIF}`;
      const fill = l.kind === 'sea' ? 'rgba(186,212,214,0.72)' : l.kind === 'state' ? 'rgba(40,30,20,0.8)' : l.owner === selCountry || l.owner === focus ? '#140f09' : 'rgba(30,22,14,0.9)';
      for (const g of l.glyphs) {
        ctx.save(); ctx.translate(g.x, g.y); ctx.rotate(g.a);
        if (l.kind !== 'sea') { ctx.lineWidth = Math.max(2, l.size * (l.kind === 'state' ? 0.2 : 0.14)); ctx.strokeStyle = 'rgba(248,240,220,0.55)'; ctx.strokeText(g.ch, 0, 0); }
        ctx.fillStyle = fill; ctx.fillText(g.ch, 0, 0); ctx.restore();
      }
    }
  }

  useEffect(() => {
    const el = wrap.current!, cv = glc.current!;
    const onContextLost = (event: Event) => {
      // Prevent the browser from discarding the context permanently; Android may reclaim it under memory pressure.
      event.preventDefault();
      if (R.current.raf) cancelAnimationFrame(R.current.raf);
      R.current.raf = 0;
      R.current.r = null;
      const message = 'Bản đồ đang khôi phục đồ họa sau khi Android thu hồi WebGL…';
      R.current.err = message;
      setRenderError(message);
    };
    const onContextRestored = () => {
      try {
        const assets = props.current.assets;
        const renderer = new MapRenderer(cv, grid, assets.relief, assets.coastDist, assets.terrain);
        const current = props.current;
        renderer.setPalette(buildPalette(current.st, lensById(current.lens), current.focus, current.selRegion, current.selCountry));
        R.current.r = renderer;
        R.current.err = null;
        R.current.paths = null;
        R.current.candKey = '';
        R.current.sel = { key: '', region: null, country: null };
        setRenderError(null);
        schedule();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Không thể khôi phục WebGL';
        R.current.r = null;
        R.current.err = message;
        setRenderError(message);
      }
    };

    cv.addEventListener('webglcontextlost', onContextLost);
    cv.addEventListener('webglcontextrestored', onContextRestored);
    try {
      R.current.r = new MapRenderer(cv, grid, p.assets.relief, p.assets.coastDist, p.assets.terrain);
      R.current.err = null;
      setRenderError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể khởi tạo WebGL';
      R.current.err = message;
      setRenderError(message);
    }
    const ro = new ResizeObserver(() => { const b = el.getBoundingClientRect(); R.current.size = { w: Math.max(1, b.width), h: Math.max(1, b.height) }; schedule(); });
    ro.observe(el);
    const b = el.getBoundingClientRect();
    R.current.size = { w: Math.max(1, b.width), h: Math.max(1, b.height) };
    return () => {
      cv.removeEventListener('webglcontextlost', onContextLost);
      cv.removeEventListener('webglcontextrestored', onContextRestored);
      ro.disconnect();
      clearTimeout(R.current.idle);
      if (R.current.raf) cancelAnimationFrame(R.current.raf);
      R.current.raf = 0;
    };
  }, []);
  useEffect(() => {
    const r = R.current.r; if (!r) return;
    r.setPalette(buildPalette(p.st, lensById(p.lens), p.focus, p.selRegion, p.selCountry)); schedule();
  }, [p.version, p.lens, p.focus, p.selRegion, p.selCountry, p.st, p.dim]);
  useEffect(() => ui.subscribe(schedule), []);
  useEffect(() => { kick = schedule; return () => { kick = null; }; }, []);

  useEffect(() => {
    const el = wrap.current!; const pts = new Map<number, { x: number; y: number; sx: number; sy: number; downAt: number; pointerType: string }>();
    let pinch: { d: number; mx: number; my: number } | null = null; let lastTap = { t: 0, x: 0, y: 0 }; let moved = false; let multiPointer = false;
    const local = (e: PointerEvent | WheelEvent) => { const b = el.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; };
    const zoomAt = (x: number, y: number, f: number) => {
      const c0 = cam(); const gx = c0.x0 + x * c0.scale, gy = c0.y0 + y * c0.scale; const s = R.current.size;
      const ns = c0.scale * f; ui.get().camera = clampCam({ scale: ns, cx: gx - (x - s.w / 2) * ns, cy: gy - (y - s.h / 2) * ns }); moving(); schedule();
    };
    const down = (e: PointerEvent) => { el.setPointerCapture(e.pointerId); const l = local(e); if (pts.size > 0) multiPointer = true; pts.set(e.pointerId, { x: l.x, y: l.y, sx: l.x, sy: l.y, downAt: performance.now(), pointerType: e.pointerType }); moved = false; if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 }; } };
    const hoverAt = (x: number, y: number) => {
      const c = cam(); const i = cellAt(grid, c.x0 + x * c.scale, c.y0 + y * c.scale); const h = i || -1;
      if (h !== R.current.hover) { R.current.hover = h; schedule(); }
      props.current.onHover?.(i ? data().map.regionIds[i - 1] ?? null : null, x, y);
    };
    const move = (e: PointerEvent) => {
      if (!pts.size && e.pointerType === 'mouse') { const l = local(e); hoverAt(l.x, l.y); return; }
      const q = pts.get(e.pointerId); if (!q) return; const l = local(e); const dx = l.x - q.x, dy = l.y - q.y; q.x = l.x; q.y = l.y;
      if (Math.hypot(q.x - q.sx, q.y - q.sy) > 8) moved = true;
      if (pts.size === 1 && moved) { const c = cam(); ui.get().camera = clampCam({ cx: c.cx - dx * c.scale, cy: c.cy - dy * c.scale, scale: c.scale }); moving(); schedule(); }
      else if (pts.size === 2 && pinch) { const [a, b] = [...pts.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y); if (d > 0) { zoomAt(pinch.mx, pinch.my, pinch.d / d); pinch.d = d; } }
    };
    const up = (e: PointerEvent) => {
      const q = pts.get(e.pointerId); pts.delete(e.pointerId); if (pts.size < 2) pinch = null;
      const hadMultiplePointers = multiPointer;
      if (pts.size === 0) multiPointer = false;
      if (e.type === 'pointercancel' || !q || moved || pts.size > 0 || hadMultiplePointers) return;
      const now = performance.now();
      const c = cam();
      const i = cellAt(grid, c.x0 + q.x * c.scale, c.y0 + q.y * c.scale);
      const regionId = i ? data().map.regionIds[i - 1] ?? null : null;
      if (isLongPress(q, now, q.x, q.y)) {
        if (regionId) props.current.onLongPress?.(regionId, { x: q.x, y: q.y });
        lastTap.t = 0;
        return;
      }
      if (now - lastTap.t < 320 && Math.hypot(q.x - lastTap.x, q.y - lastTap.y) < 24) { zoomAt(q.x, q.y, 0.5); lastTap.t = 0; return; }
      lastTap = { t: now, x: q.x, y: q.y };
      props.current.onSelect(regionId, { x: q.x, y: q.y });
    };
    const leave = () => { if (R.current.hover !== -1) { R.current.hover = -1; schedule(); } props.current.onHover?.(null, 0, 0); };
    const wheel = (e: WheelEvent) => { e.preventDefault(); const l = local(e); zoomAt(l.x, l.y, e.deltaY > 0 ? 1.18 : 1 / 1.18); };
    el.addEventListener('pointerdown', down); el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); el.addEventListener('wheel', wheel, { passive: false }); el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointerleave', leave); el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); el.removeEventListener('wheel', wheel); };
  }, []);

  return (
    <div class="map-wrap" ref={wrap}>
      <canvas class="map-gl" ref={glc} />
      <canvas class="map-overlay" ref={ovc} />
      {renderError && <div class="map-error" role="status">Không thể hiển thị bản đồ: {renderError}</div>}
    </div>
  );
}

/** Camera helpers for buttons (zoom, recentre). Scales are grid cells per CSS px. */
let insets = { l: 0, r: 0, t: 0, b: 0 };
let kick: (() => void) | null = null;
let flight = 0;
/** Animates the camera to a target (ease-out, logarithmic zoom interpolation), ~0.45 s. */
function flyTo(t: { cx: number; cy: number; scale: number }) {
  const from = ui.get().camera; cancelAnimationFrame(flight);
  if (!from || matchMedia('(prefers-reduced-motion: reduce)').matches) { ui.set({ camera: t }); return; }
  const t0 = performance.now(), D = 450; const f = { ...from };
  const step = () => {
    const k = Math.min(1, (performance.now() - t0) / D); const e = 1 - Math.pow(1 - k, 3);
    const cam = ui.get().camera!; cam.cx = f.cx + (t.cx - f.cx) * e; cam.cy = f.cy + (t.cy - f.cy) * e; cam.scale = Math.exp(Math.log(f.scale) + (Math.log(t.scale) - Math.log(f.scale)) * e);
    kick?.();
    if (k < 1) flight = requestAnimationFrame(step); else ui.set({ camera: { ...t } });
  };
  flight = requestAnimationFrame(step);
}
export const mapControls = {
  /** Parts of the map covered by windows (CSS px); used to centre targets in the visible area. */
  setInsets(i: { l: number; r: number; t: number; b: number }) { insets = i; },
  zoom(f: number) { const c = ui.get().camera; if (c) flyTo({ ...c, scale: c.scale * f }); },
  focusRegion(regionId: string, degPerPx = 0.02) {
    const d = data(); const r = d.map.regions[d.regionIndex.get(regionId) ?? -1]; if (!r) return;
    const scale = degPerPx * d.map.cpd;
    flyTo({ cx: r.label[0] - ((insets.l - insets.r) / 2) * scale, cy: r.label[1] - ((insets.t - insets.b) / 2) * scale, scale });
  },
};
