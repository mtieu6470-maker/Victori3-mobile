// Window system and shared widgets: dialogs, detail (side) windows, window chrome, tabs, sections, tooltips,
// metric strips, charts and provenance marks. Every value shown comes from engine state or the Historical Database.
import type { ComponentChildren, VNode } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { Icon } from './icons';
import { QUALITY_VI, fmt } from '../i18n/vi';
import { data } from '../../engine/data/db';

// ---------------------------------------------------------------- tiny observable store
function store<T>(init: T) {
  let v = init; const ls = new Set<() => void>();
  return {
    get: () => v,
    set(n: T) { v = n; ls.forEach((f) => f()); },
    use(): T { const [, f] = useState(0); useEffect(() => { const g = () => f((x) => x + 1); ls.add(g); return () => { ls.delete(g); }; }, []); return v; },
  };
}

// ---------------------------------------------------------------- dialogs (confirmations, small forms)
const modalS = store<{ title: string; body: () => VNode; wide?: boolean } | null>(null);
export const modals = {
  open(title: string, body: () => VNode, wide = false) { modalS.set({ title, body, wide }); },
  close() { modalS.set(null); },
  get: () => modalS.get(),
};
export function ModalHost() {
  const m = modalS.use(); if (!m) return null;
  return (
    <>
      <div class="scrim" onClick={() => modals.close()} />
      <section class="dialog" role="dialog" aria-label={m.title} style={m.wide ? 'width:min(96vw,640px)' : ''}>
        <WinHead title={m.title} onClose={() => modals.close()} />
        <div class="win-body pad">{m.body()}</div>
      </section>
    </>
  );
}

// ---------------------------------------------------------------- detail windows (open beside the main window)
/** scope: the window/tab the detail belongs to; when it no longer matches the open window the detail closes. */
export interface Detail { key: string; title: string; ctx?: string; body: () => VNode; scope?: string }
const detailS = store<Detail | null>(null);
export const details = {
  open(d: Detail) { detailS.set(d); },
  toggle(d: Detail) { detailS.set(detailS.get()?.key === d.key ? null : d); },
  close() { detailS.set(null); },
  get: () => detailS.get(),
  use: () => detailS.use(),
};

// ---------------------------------------------------------------- window chrome
export function WinHead({ title, ctx, onClose, onExpand, onBack, grip, onGrip }: { title: string; ctx?: ComponentChildren; onClose?: () => void; onExpand?: () => void; onBack?: () => void; grip?: boolean; onGrip?: (e: PointerEvent) => void }) {
  const stop = (e: Event) => e.stopPropagation();
  return (
    <header class="win-head" onPointerDown={onGrip as any}>
      {grip && <span class="grip" />}
      {onBack && <button class="ib" aria-label="Quay lại" onClick={onBack} onPointerDown={stop}><Icon name="back" class="i" /></button>}
      <h2>{title}</h2>
      <span class="ctx">{ctx}</span>
      {onExpand && <button class="ib" aria-label="Mở rộng hoặc thu gọn" onClick={onExpand} onPointerDown={stop}><Icon name="expand" class="i" /></button>}
      {onClose && <button class="ib" aria-label="Đóng" onClick={onClose} onPointerDown={stop}><Icon name="close" class="i" /></button>}
    </header>
  );
}
export function Tabs({ tabs, value, onChange }: { tabs: [string, string][]; value: string; onChange: (v: string) => void }) {
  return <nav class="win-tabs" role="tablist">{tabs.map(([id, label]) => <button key={id} role="tab" aria-selected={id === value} class={`win-tab${id === value ? ' on' : ''}`} onClick={() => onChange(id)}>{label}</button>)}</nav>;
}
export function Sec({ title, x, children, go }: { title: string; x?: ComponentChildren; children: ComponentChildren; go?: () => void }) {
  return (
    <section class="sec">
      <h4 class={`sec-t${go ? ' go' : ''}`} onClick={go}>{title}{x !== undefined && <span class="x">{x}</span>}{go && <span class="x">›</span>}</h4>
      {children}
    </section>
  );
}
/** Segmented filter. */
export function Seg<T extends string>({ value, options, onChange }: { value: T; options: readonly (readonly [T, string])[]; onChange: (v: T) => void }) {
  return <div class="seg" role="radiogroup">{options.map(([k, l]) => <button key={k} role="radio" aria-checked={value === k} class={value === k ? 'on' : ''} onClick={() => onChange(k)}>{l}</button>)}</div>;
}

// ---------------------------------------------------------------- tooltip (hover with a mouse, long-press on touch)
export interface TipContent { title: string; lines?: [string, ComponentChildren][]; note?: string }
const tipS = store<{ c: TipContent; x: number; y: number } | null>(null);
let tipTimer = 0;
const canHover = () => typeof matchMedia === 'function' && matchMedia('(hover: hover)').matches;
export const hideTip = () => { clearTimeout(tipTimer); if (tipS.get()) tipS.set(null); };
export function TipHost() {
  const t = tipS.use(); const ref = useRef<HTMLDivElement>(null); const [pos, setPos] = useState<[number, number]>([0, 0]);
  useEffect(() => {
    if (!t || !ref.current) return; const r = ref.current.getBoundingClientRect();
    const x = Math.min(window.innerWidth - r.width - 6, Math.max(6, t.x + 12)); let y = t.y + 16;
    if (y + r.height > window.innerHeight - 6) y = Math.max(6, t.y - r.height - 12);
    setPos([x, y]);
  }, [t]);
  if (!t) return null;
  return (
    <div class="tip" ref={ref} style={`left:${pos[0]}px;top:${pos[1]}px`} role="tooltip">
      <div class="tt">{t.c.title}</div>
      {t.c.lines?.map(([k, v]) => <div class="tl" key={k}><span>{k}</span><b>{v}</b></div>)}
      {t.c.note && <div class="tn">{t.c.note}</div>}
    </div>
  );
}
/** Wraps an element in a tooltip trigger. A long press (450 ms) on touch suppresses the click that follows. */
export function Tip({ c, children, block }: { c: TipContent; children: ComponentChildren; block?: boolean }) {
  const long = useRef(false);
  return (
    <span data-tip="1" class={block ? 'tipw block' : 'tipw'}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse' && canHover()) tipS.set({ c, x: e.clientX, y: e.clientY }); }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') hideTip(); }}
      onPointerDown={(e) => { if (e.pointerType === 'mouse') return; long.current = false; const x = e.clientX, y = e.clientY; clearTimeout(tipTimer); tipTimer = window.setTimeout(() => { long.current = true; tipS.set({ c, x, y }); }, 450); }}
      onPointerUp={(e) => { if (e.pointerType === 'mouse') return; clearTimeout(tipTimer); if (long.current) tipTimer = window.setTimeout(hideTip, 2200); }}
      onPointerCancel={() => hideTip()}
      onClickCapture={(e) => { if (long.current) { e.stopPropagation(); e.preventDefault(); long.current = false; } }}>
      {children}
    </span>
  );
}

// ---------------------------------------------------------------- figures
export type SourceRef = string | { id: string; locator?: string };
export function Metric({ label, value, d, spark, icon, q, tip: tc, onClick }: { label: string; value: ComponentChildren; d?: ComponentChildren; spark?: number[]; icon?: string; q?: { quality: string; sources?: SourceRef[]; method?: string } | null; tip?: TipContent; onClick?: () => void }) {
  const inner = (
    <div class={`metric${onClick ? ' tap' : ''}`} onClick={onClick}>
      <div class="l">{icon && <Icon name={icon} size={14} />}<span class="ellipsis">{label}</span>{q && <QualityMark {...q} />}</div>
      <div class="v num">{value}</div>
      {d !== undefined && <div class="d">{d}</div>}
      {spark && spark.length >= 3 && <Spark values={spark} />}
    </div>
  );
  return tc ? <Tip c={tc} block>{inner}</Tip> : inner;
}
export function Spark({ values, color = 'var(--accent)' }: { values: number[]; color?: string }) {
  const lo = Math.min(...values), hi = Math.max(...values), sp = hi - lo || 1;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 100},${17 - ((v - lo) / sp) * 15}`).join(' ');
  return <svg class="spark" viewBox="0 0 100 18" preserveAspectRatio="none" aria-hidden="true"><polyline points={pts} fill="none" stroke={color} stroke-width="1.3" vector-effect="non-scaling-stroke" /></svg>;
}
/** Yearly line chart with axis labels and a legend; only real yearly samples are plotted. */
export function LineChart({ series, years, fmtY, height = 150 }: { series: { name: string; color: string; values: number[] }[]; years: number[]; fmtY: (v: number) => string; height?: number }) {
  if (years.length < 2) return <div class="empty sm">Chưa đủ số liệu theo năm — mô phỏng ghi một mẫu vào ngày 1/1 hằng năm.</div>;
  const all = series.flatMap((s) => s.values); const lo = Math.min(...all), hi = Math.max(...all); const sp = hi - lo || Math.abs(hi) || 1;
  const W = 360, H = height, L = 50, B = 18, T = 8, Rr = 10;
  const x = (i: number) => L + (i / (years.length - 1)) * (W - L - Rr); const y = (v: number) => T + (1 - (v - lo) / sp) * (H - T - B);
  const ticks = [lo, lo + sp / 2, hi];
  return (
    <div>
      <svg class="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={series.map((s) => s.name).join(', ')}>
        {ticks.map((t, i) => <g key={i}><line x1={L} x2={W - Rr} y1={y(t)} y2={y(t)} stroke="rgba(222,205,160,.13)" /><text x={L - 6} y={y(t) + 3.5} text-anchor="end">{fmtY(t)}</text></g>)}
        <text x={L} y={H - 4}>{years[0]}</text><text x={W - Rr} y={H - 4} text-anchor="end">{years[years.length - 1]}</text>
        {series.map((s) => <polyline key={s.name} fill="none" stroke={s.color} stroke-width="1.8" stroke-linejoin="round" points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')} />)}
      </svg>
      {series.length > 1 && <div class="chart-key">{series.map((s) => <span key={s.name}><i style={`background:${s.color}`} />{s.name}</span>)}</div>}
    </div>
  );
}
/** Horizontal labelled bars (rankings, distributions, shares). */
export function HBars({ rows, max, fmtV, color = 'var(--accent)', onRow }: { rows: { label: ComponentChildren; v: number; hl?: boolean; c?: string; key?: string }[]; max?: number; fmtV: (v: number) => string; color?: string; onRow?: (i: number) => void }) {
  const m = max ?? Math.max(...rows.map((r) => r.v), 1e-9);
  return (
    <div class="hbars">
      {rows.map((r, i) => (
        <div key={r.key ?? i} class={`hb${r.hl ? ' hl' : ''}${onRow ? ' tap' : ''}`} onClick={onRow ? () => onRow(i) : undefined}>
          <span class="lb ellipsis">{r.label}</span>
          <span class="bar"><i style={`width:${Math.max(0, Math.min(1, r.v / m)) * 100}%;background:${r.c ?? color}`} /></span>
          <span class="vv num">{fmtV(r.v)}</span>
        </div>
      ))}
    </div>
  );
}
/** Stacked share bar with a compact legend underneath. */
export function StackBar({ parts, legend = true, h = 12 }: { parts: { label: string; v: number; c: string; tip?: TipContent }[]; legend?: boolean; h?: number }) {
  const tot = parts.reduce((s, p) => s + Math.max(0, p.v), 0) || 1;
  return (
    <div>
      <div class="hbar" style={`height:${h}px`}>{parts.map((p) => p.v > 0 && <i key={p.label} title={p.label} style={`width:${(p.v / tot) * 100}%;background:${p.c}`} />)}</div>
      {legend && <div class="stack-key">{parts.filter((p) => p.v / tot >= 0.005).map((p) => <span key={p.label}><i style={`background:${p.c}`} />{p.label} <b class="num">{fmt((p.v / tot) * 100)}%</b></span>)}</div>}
    </div>
  );
}
export function Bar({ frac, color }: { frac: number; color?: string }) { return <div class="bar"><i style={`width:${Math.max(0, Math.min(1, frac)) * 100}%${color ? `;background:${color}` : ''}`} /></div>; }
/** Diverging bar for values in [-1, 1]. */
export function DBar({ v, w }: { v: number; w?: number }) { const len = Math.min(1, Math.abs(v)) * 50; return <span class="dbar" style={w ? `width:${w}px` : ''}><i style={`${v >= 0 ? 'left:50%' : `left:${50 - len}%`};width:${len}%;background:${v >= 0 ? 'var(--pos)' : 'var(--neg)'}`} /></span>; }
/** Relative change shown as an arrow and percentage. */
export function Delta({ v, dp = 0, invert, suffix = '' }: { v: number; dp?: number; invert?: boolean; suffix?: string }) {
  const good = invert ? v < 0 : v > 0; const cls = Math.abs(v) < 0.0005 ? 'flat' : good ? 'up' : 'down';
  return <span class={`delta num ${cls}`}>{v > 0.0005 ? '▲' : v < -0.0005 ? '▼' : '■'} {fmt(Math.abs(v) * 100, dp)}%{suffix}</span>;
}
/** Tracks an element's content width (without padding) so tables can decide which columns fit instead of clipping them. */
export function useWidth<T extends HTMLElement>(): [{ current: T | null }, number] {
  const ref = useRef<T>(null); const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const measure = () => { const cs = getComputedStyle(el); setW(Math.round(el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight))); };
    const ro = new ResizeObserver(measure); ro.observe(el); measure(); return () => ro.disconnect();
  }, []);
  return [ref, w];
}
/** Sortable column header state. */
export function useSort<K extends string>(k0: K, dir0: 1 | -1 = -1) {
  const [s, set] = useState<{ k: K; dir: 1 | -1 }>({ k: k0, dir: dir0 });
  const th = (k: K, label: string, cls = '') => <th class={`${cls}${s.k === k ? ' sort' : ''}`} onClick={() => set({ k, dir: s.k === k ? (-s.dir as 1 | -1) : -1 })}>{label}{s.k === k ? (s.dir < 0 ? ' ▾' : ' ▴') : ''}</th>;
  return { s, th };
}

// ---------------------------------------------------------------- provenance
export function QualityMark({ quality, sources, method }: { quality: string; sources?: SourceRef[]; method?: string }) {
  const q = QUALITY_VI[quality] ?? QUALITY_VI.missing;
  return <span class={`q ${q.cls}`} role="button" aria-label={q.label} title={q.label} onClick={(e) => { e.stopPropagation(); modals.open('Nguồn & độ tin cậy', () => <Provenance quality={quality} sources={sources} method={method} />); }}>{q.sym}</span>;
}
export function Provenance({ quality, sources, method }: { quality: string; sources?: SourceRef[]; method?: string }) {
  const q = QUALITY_VI[quality] ?? QUALITY_VI.missing; const db = data().db;
  return (
    <div>
      <div class="kv"><span class="k">Độ tin cậy</span><span class="v"><span class={`q ${q.cls}`}>{q.sym}</span> {q.label}</span></div>
      {method && <div class="note" style="color:var(--text-2)"><b>Phương pháp:</b> {method}</div>}
      <Sec title="Nguồn">
        {sources?.length ? sources.map((ref, i) => { const sid = typeof ref === 'string' ? ref : ref.id; const loc = typeof ref === 'string' ? '' : ref.locator ?? ''; const s = db.sources.find((x) => x.id === sid) as { citation?: string } | undefined; return <div class="row" key={sid + i}><div class="grow"><div style="font:14.5px/1.3 var(--serif)">{s?.citation ?? sid}</div>{loc && <div class="s">Vị trí: {loc}</div>}</div></div>; })
          : <div class="empty sm">Không có nguồn — giá trị dùng cho gameplay, không phải dữ kiện lịch sử.</div>}
      </Sec>
      <div class="note">Dữ liệu khởi đầu năm 1836 của Cơ sở dữ liệu Lịch sử. Giá trị hiện tại trong ván là kết quả mô phỏng.</div>
    </div>
  );
}
