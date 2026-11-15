// Interactive map: WebGL atlas layer + 2D overlay for names and graticule labels. Touch: drag to pan,
// pinch to zoom, tap to select a region, double-tap to zoom in. Mouse wheel zoom on desktop.
import { useEffect, useRef } from 'preact/hooks';
import { data } from '../../engine/data/db';
import { rankings } from '../../engine/metrics';
import type { GameState } from '../../engine/types';
import { MapRenderer, type Camera } from './renderer';
import { buildPalette, lensById } from './lenses';
import { buildCandidates, layoutLabels, setOwnerLookup, type LabelCand } from './labels';
import { cellAt, type MapGrid } from './mapData';
import { ui, type LensId } from '../game/ui';

interface Props { avoid?: (w: number, h: number) => { x: number; y: number; w: number; h: number }[]; grid: MapGrid; st: GameState; version: number; lens: LensId; focus: string | null; selRegion: string | null; selCountry: string | null; onSelect: (regionId: string | null) => void; insetLeft?: number }

export const MIN_SCALE = 0.025;
const LABEL_FONT = '"EB Garamond", "Noto Serif", Georgia, serif';

export function defaultCamera(st: GameState, grid: MapGrid, vw: number, vh: number): { cx: number; cy: number; scale: number } {
  const d = data(); const id = st.player ?? rankings(st)[0]?.id; const cap = id ? st.countries[id]?.capital : null;
  const r = cap ? d.map.regions[d.regionIndex.get(cap) ?? -1] : null;
  const span = 44 * grid.cpd; // ~44° of longitude across the larger viewport side
  return { cx: r ? r.label[0] + 4 * grid.cpd : 720, cy: r ? r.label[1] + 2 * grid.cpd : 160, scale: span / Math.max(vw, vh) };
}

export function MapView(p: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const glc = useRef<HTMLCanvasElement>(null);
  const ovc = useRef<HTMLCanvasElement>(null);
  const R = useRef<{ r: MapRenderer | null; cands: LabelCand[]; candKey: string; raf: number; size: { w: number; h: number }; err: string | null }>({ r: null, cands: [], candKey: '', raf: 0, size: { w: 1, h: 1 }, err: null });
  const props = useRef(p); props.current = p;

  const cam = (): Camera & { cx: number; cy: number } => {
    const s = R.current.size; let c = ui.get().camera;
    if (!c) { c = defaultCamera(props.current.st, props.current.grid, s.w, s.h); ui.get().camera = c; }
    return { cx: c.cx, cy: c.cy, scale: c.scale, x0: c.cx - (s.w * c.scale) / 2, y0: c.cy - (s.h * c.scale) / 2 };
  };
  const clampCam = (c: { cx: number; cy: number; scale: number }) => {
    const g = props.current.grid; const s = R.current.size;
    const maxScale = Math.min(g.W / s.w, g.H / s.h);
    c.scale = Math.max(MIN_SCALE, Math.min(maxScale, c.scale));
    const halfH = (s.h * c.scale) / 2; c.cy = Math.max(halfH, Math.min(g.H - halfH, c.cy));
    c.cx = ((c.cx % g.W) + g.W) % g.W;
    return c;
  };
  const schedule = () => { if (!R.current.raf) R.current.raf = requestAnimationFrame(draw); };

  function draw() {
    R.current.raf = 0;
    const { st, grid, lens, focus, selRegion, selCountry } = props.current; const r = R.current.r; const s = R.current.size;
    if (!r || !ovc.current) return;
    const c = cam(); const dpr = Math.min(2, window.devicePixelRatio || 1);
    r.draw(c, s.w, s.h, dpr);
    // ---- overlay: graticule degree labels + names
    const cv = ovc.current; const ctx = cv.getContext('2d')!;
    if (cv.width !== Math.round(s.w * dpr) || cv.height !== Math.round(s.h * dpr)) { cv.width = Math.round(s.w * dpr); cv.height = Math.round(s.h * dpr); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, s.w, s.h);
    const step = (c.scale < 0.12 ? 5 : 10) * grid.cpd;
    ctx.font = `italic 12px ${LABEL_FONT}`; ctx.fillStyle = 'rgba(44,58,60,0.72)'; ctx.textBaseline = 'top';
    const inset = props.current.insetLeft ?? 0;
    for (let gx = Math.ceil(c.x0 / step) * step; gx < c.x0 + s.w * c.scale; gx += step) {
      const lon = Math.round(((((gx / grid.cpd) % 360) + 360) % 360) - 180); if (lon === -180) continue;
      const x = (gx - c.x0) / c.scale; if (x < inset + 14) continue;
      ctx.fillText(`${Math.abs(lon)}°${lon < 0 ? 'T' : lon > 0 ? 'Đ' : ''}`, x + 3, 3);
    }
    for (let gy = Math.ceil(c.y0 / step) * step; gy < c.y0 + s.h * c.scale; gy += step) {
      const lat = Math.round(grid.lat0 - gy / grid.cpd); const y = (gy - c.y0) / c.scale; if (y < 18) continue;
      ctx.fillText(`${Math.abs(lat)}°${lat > 0 ? 'B' : lat < 0 ? 'N' : ''}`, inset + 3, y + 2);
    }
    if (lens === 'political' || lens === 'diplomacy' || lens === 'market' || true) {
      const key = `${st.territoryLog.length}|${Object.values(st.countries).filter((x) => x.alive).length}|${focus}|${st.tick >> 4}`;
      if (key !== R.current.candKey) { setOwnerLookup(grid, st); R.current.cands = buildCandidates(st, rankings(st).slice(0, 8).map((x) => x.id), focus); R.current.candKey = key; }
      const measure = (t: string, size: number) => { ctx.font = `600 ${size}px ${LABEL_FONT}`; return ctx.measureText(t).width; };
      const labels = layoutLabels(R.current.cands, c, s.w, s.h, grid, measure, st, inset, props.current.avoid?.(s.w, s.h) ?? []);
      for (const l of labels) {
        ctx.save(); ctx.translate(l.x, l.y); ctx.rotate(l.angle);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = l.kind === 'sea' ? `italic 500 ${l.size}px ${LABEL_FONT}` : `600 ${l.size}px ${LABEL_FONT}`;
        (ctx as any).letterSpacing = `${l.ls}px`;
        if (l.kind === 'sea') { ctx.fillStyle = 'rgba(52,84,96,0.78)'; ctx.fillText(l.text, 0, 0); }
        else {
          ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(2, l.size * 0.16); ctx.strokeStyle = 'rgba(244,236,214,0.55)'; ctx.strokeText(l.text, 0, 0);
          ctx.fillStyle = l.owner === selCountry || l.owner === focus ? '#1d1710' : 'rgba(40,32,22,0.88)'; ctx.fillText(l.text, 0, 0);
        }
        ctx.restore();
      }
      (ctx as any).letterSpacing = '0px';
    }
    void selRegion;
  }

  // init renderer + resize
  useEffect(() => {
    const el = wrap.current!, cv = glc.current!;
    try { R.current.r = new MapRenderer(cv, p.grid); } catch (e) { R.current.err = (e as Error).message; }
    const ro = new ResizeObserver(() => { const b = el.getBoundingClientRect(); R.current.size = { w: Math.max(1, b.width), h: Math.max(1, b.height) }; const c = ui.get().camera; if (c) clampCam(c); schedule(); });
    ro.observe(el);
    const b = el.getBoundingClientRect(); R.current.size = { w: Math.max(1, b.width), h: Math.max(1, b.height) };
    return () => { ro.disconnect(); if (R.current.raf) cancelAnimationFrame(R.current.raf); };
  }, []);
  // palette on state/lens/selection change
  useEffect(() => {
    const r = R.current.r; if (!r) return;
    r.setPalette(buildPalette(p.st, lensById(p.lens), p.focus, p.selRegion, p.selCountry));
    schedule();
  }, [p.version, p.lens, p.focus, p.selRegion, p.selCountry, p.st]);
  useEffect(() => ui.subscribe(schedule), []);

  // gestures
  useEffect(() => {
    const el = wrap.current!; const pts = new Map<number, { x: number; y: number; sx: number; sy: number; t: number }>();
    let pinch: { d: number; mx: number; my: number } | null = null; let lastTap = { t: 0, x: 0, y: 0 }; let moved = false;
    const local = (e: PointerEvent | WheelEvent) => { const b = el.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; };
    const zoomAt = (x: number, y: number, f: number) => {
      const c0 = cam(); const cx = c0.x0 + x * c0.scale, cy = c0.y0 + y * c0.scale; const s = R.current.size;
      const ns = c0.scale * f; const c = { scale: ns, cx: cx - (x - s.w / 2) * ns, cy: cy - (y - s.h / 2) * ns };
      clampCam(c); ui.get().camera = c; schedule();
    };
    const down = (e: PointerEvent) => { el.setPointerCapture(e.pointerId); const l = local(e); pts.set(e.pointerId, { x: l.x, y: l.y, sx: l.x, sy: l.y, t: performance.now() }); moved = false; if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 }; } };
    const move = (e: PointerEvent) => {
      const q = pts.get(e.pointerId); if (!q) return; const l = local(e);
      const dx = l.x - q.x, dy = l.y - q.y; q.x = l.x; q.y = l.y;
      if (Math.hypot(q.x - q.sx, q.y - q.sy) > 8) moved = true;
      if (pts.size === 1 && moved) { const c = { ...cam() }; c.cx -= dx * c.scale; c.cy -= dy * c.scale; ui.get().camera = clampCam({ cx: c.cx, cy: c.cy, scale: c.scale }); schedule(); }
      else if (pts.size === 2 && pinch) { const [a, b] = [...pts.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y); if (d > 0) { zoomAt(pinch.mx, pinch.my, pinch.d / d); pinch.d = d; } }
    };
    const up = (e: PointerEvent) => {
      const q = pts.get(e.pointerId); pts.delete(e.pointerId); if (pts.size < 2) pinch = null;
      if (!q || moved || pts.size > 0) return;
      const now = performance.now();
      if (now - lastTap.t < 320 && Math.hypot(q.x - lastTap.x, q.y - lastTap.y) < 24) { zoomAt(q.x, q.y, 0.5); lastTap.t = 0; return; }
      lastTap = { t: now, x: q.x, y: q.y };
      const c = cam(); const idx = cellAt(props.current.grid, c.x0 + q.x * c.scale, c.y0 + q.y * c.scale);
      props.current.onSelect(idx ? data().map.regionIds[idx - 1] : null);
    };
    const wheel = (e: WheelEvent) => { e.preventDefault(); const l = local(e); zoomAt(l.x, l.y, e.deltaY > 0 ? 1.18 : 1 / 1.18); };
    el.addEventListener('pointerdown', down); el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); el.addEventListener('wheel', wheel, { passive: false });
    return () => { el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); el.removeEventListener('wheel', wheel); };
  }, []);

  return (
    <div class="map-wrap" ref={wrap}>
      <canvas class="map-gl" ref={glc} />
      <canvas class="map-overlay" ref={ovc} />
      {R.current.err && <div class="map-error">Không thể hiển thị bản đồ: {R.current.err}</div>}
    </div>
  );
}

/** Imperative camera helpers for buttons (zoom, recentre). */
export const mapControls = {
  zoom(f: number) { const c = ui.get().camera; if (c) ui.set({ camera: { ...c, scale: Math.max(MIN_SCALE, c.scale * f) } }); },
  focusRegion(regionId: string, scale?: number) {
    const d = data(); const r = d.map.regions[d.regionIndex.get(regionId) ?? -1]; if (!r) return;
    const c = ui.get().camera; ui.set({ camera: { cx: r.label[0], cy: r.label[1], scale: scale ?? c?.scale ?? 0.08 } });
  },
};
