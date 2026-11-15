// Window system and shared widgets: dialogs, detail (side) windows, window chrome, tabs, sections, tooltips,
// metric strips, charts and provenance marks. Every value shown comes from engine state or the Historical Database.
import type { ComponentChildren, VNode } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { Icon, MODULE_COLOR } from './icons';
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
      <section class="dialog frame surface" role="dialog" aria-label={m.title} style={m.wide ? 'width:min(96vw,640px)' : ''}>
        <WinHead title={m.title} icon="scroll" onClose={() => modals.close()} />
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
/** Window title strip: module medallion, small-caps title with context line, faint module watermark and the
 *  window actions (back, collapse, expand, close). `mod` picks the module accent colour. */
export function WinHead({ title, ctx, icon, mod, onClose, onExpand, onCollapse, collapsed, expanded, onBack, grip, onGrip }: { title: string; ctx?: ComponentChildren; icon?: string; mod?: string; onClose?: () => void; onExpand?: () => void; onCollapse?: () => void; collapsed?: boolean; expanded?: boolean; onBack?: () => void; grip?: boolean; onGrip?: (e: PointerEvent) => void }) {
  const stop = (e: Event) => e.stopPropagation();
  return (
    <header class="win-head" style={mod ? `--wc:${MODULE_COLOR[mod] ?? 'var(--gold-2)'}` : ''} onPointerDown={onGrip as any} onDblClick={onCollapse}>
      {grip && <span class="grip" />}
      {onBack && <button class="ib" aria-label="Quay lại" onClick={onBack} onPointerDown={stop}><Icon name="back" class="i" /></button>}
      {icon && <Mdl icon={icon} />}
      {icon && <span class="wm" aria-hidden="true"><Icon name={icon} /></span>}
      <div class="ttl"><h2>{title}</h2>{ctx && <span class="ctx">{ctx}</span>}</div>
      {onCollapse && <button class="ib" aria-label={collapsed ? 'Mở lại' : 'Thu gọn'} title={collapsed ? 'Mở lại' : 'Thu gọn'} onClick={onCollapse} onPointerDown={stop}><Icon name={collapsed ? 'restore' : 'collapse'} class="i" /></button>}
      {onExpand && <button class="ib" aria-label={expanded ? 'Thu hẹp' : 'Mở rộng'} title={expanded ? 'Thu hẹp' : 'Mở rộng'} onClick={onExpand} onPointerDown={stop}><Icon name="expand" class="i" /></button>}
      {onClose && <button class="ib" aria-label="Đóng" title="Đóng" onClick={onClose} onPointerDown={stop}><Icon name="close" class="i" /></button>}
    </header>
  );
}
/** Bronze medallion around an icon. */
export function Mdl({ icon, size, color }: { icon: string; size?: 'sm' | 'lg'; color?: string }) {
  return <span class={`mdl${size ? ' ' + size : ''}`} style={color ? `--mc:${color}` : ''}><Icon name={icon} /></span>;
}
/** Framed group with an engraved header strip. */
export function Plaque({ title, icon, x, go, children, pad = true }: { title: string; icon?: string; x?: ComponentChildren; go?: () => void; children: ComponentChildren; pad?: boolean }) {
  return (
    <section class="plaque">
      <h4 class={`ph${go ? ' go' : ''}`} onClick={go} style="margin:0">{icon && <Icon name={icon} />}{title}{(x !== undefined || go) && <span class="x">{x}{go ? ' ›' : ''}</span>}</h4>
      <div class={pad ? 'pb' : ''}>{children}</div>
    </section>
  );
}
export function Tabs({ tabs, value, onChange, icons }: { tabs: [string, string][]; value: string; onChange: (v: string) => void; icons?: Record<string, string> }) {
  return <nav class="win-tabs" role="tablist">{tabs.map(([id, label]) => <button key={id} role="tab" aria-selected={id === value} class={`win-tab${id === value ? ' on' : ''}`} onClick={() => onChange(id)}>{icons?.[id] && <Icon name={icons[id]} />}{label}</button>)}</nav>;
}
/** Content section: a framed plaque with an engraved title strip (optional icon, note on the right, link arrow). */
export function Sec({ title, x, children, go, icon }: { title: string; x?: ComponentChildren; children: ComponentChildren; go?: () => void; icon?: string }) {
  return <Plaque title={title} x={x} go={go} icon={icon}>{children}</Plaque>;
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
/** Yearly chart (line + gradient area) with axis labels and a legend; only real yearly samples are plotted. */
let chartSeq = 0;
export function LineChart({ series, years, fmtY, height = 150 }: { series: { name: string; color: string; values: number[] }[]; years: number[]; fmtY: (v: number) => string; height?: number }) {
  const gid = useRef(`g${++chartSeq}`).current;
  if (years.length < 2) return <div class="empty sm">Chưa đủ số liệu theo năm — mô phỏng ghi một mẫu vào ngày 1/1 hằng năm.</div>;
  const all = series.flatMap((s) => s.values); const lo0 = Math.min(...all), hi0 = Math.max(...all); const pad0 = (hi0 - lo0) * 0.08 || Math.abs(hi0) * 0.05 || 1;
  const lo = lo0 - pad0, hi = hi0 + pad0, sp = hi - lo;
  const W = 360, H = height, L = 50, B = 18, T = 8, Rr = 10;
  const x = (i: number) => L + (i / (years.length - 1)) * (W - L - Rr); const y = (v: number) => T + (1 - (v - lo) / sp) * (H - T - B);
  const ticks = [lo0, (lo0 + hi0) / 2, hi0];
  return (
    <div>
      <svg class="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={series.map((s) => s.name).join(', ')}>
        <defs>{series.map((s, k) => <linearGradient key={k} id={`${gid}-${k}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color={s.color} stop-opacity={series.length > 1 ? 0.12 : 0.32} /><stop offset="1" stop-color={s.color} stop-opacity="0" /></linearGradient>)}</defs>
        <rect x={L} y={T} width={W - L - Rr} height={H - T - B} fill="rgba(0,0,0,.18)" stroke="rgba(201,164,94,.18)" />
        {ticks.map((t, i) => <g key={i}><line x1={L} x2={W - Rr} y1={y(t)} y2={y(t)} stroke="rgba(201,164,94,.12)" stroke-dasharray="2 3" /><text x={L - 6} y={y(t) + 3.5} text-anchor="end">{fmtY(t)}</text></g>)}
        <text x={L} y={H - 4}>{years[0]}</text><text x={W - Rr} y={H - 4} text-anchor="end">{years[years.length - 1]}</text>
        {series.map((s, k) => { const pts = s.values.map((v, i) => `${x(i)},${y(v)}`).join(' '); return (
          <g key={s.name}>
            <polygon points={`${x(0)},${H - B} ${pts} ${x(s.values.length - 1)},${H - B}`} fill={`url(#${gid}-${k})`} />
            <polyline fill="none" stroke={s.color} stroke-width="2" stroke-linejoin="round" points={pts} />
            <circle cx={x(s.values.length - 1)} cy={y(s.values[s.values.length - 1])} r="3" fill={s.color} stroke="#0c1215" stroke-width="1.5" />
          </g>); })}
      </svg>
      {series.length > 1 && <div class="chart-key">{series.map((s) => <span key={s.name}><i style={`background:${s.color}`} />{s.name}</span>)}</div>}
    </div>
  );
}
/** Donut chart of shares with a centre figure and a legend (largest first). */
export function Donut({ parts, size = 112, center, sub, legend = true, max = 8 }: { parts: { label: string; v: number; c: string }[]; size?: number; center?: string; sub?: string; legend?: boolean; max?: number }) {
  const tot = parts.reduce((t, p) => t + Math.max(0, p.v), 0) || 1; const R = size / 2 - 4, r0 = R * 0.62, C = size / 2;
  let a = -Math.PI / 2; const arcs = parts.filter((p) => p.v > 0).map((p) => { const a0 = a; a += (p.v / tot) * Math.PI * 2; return { ...p, a0, a1: a }; });
  const seg = (a0: number, a1: number) => { const lg = a1 - a0 > Math.PI ? 1 : 0; const p = (rr: number, t: number) => `${C + rr * Math.cos(t)},${C + rr * Math.sin(t)}`; return `M${p(R, a0)} A${R},${R} 0 ${lg} 1 ${p(R, a1)} L${p(r0, a1)} A${r0},${r0} 0 ${lg} 0 ${p(r0, a0)} Z`; };
  const shown = [...parts].sort((x, y) => y.v - x.v).filter((p) => p.v / tot >= 0.005);
  return (
    <div class="donut-wrap">
      <svg class="donut" width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={parts.map((p) => `${p.label} ${fmt((p.v / tot) * 100)}%`).join(', ')}>
        <circle cx={C} cy={C} r={R + 2} fill="none" stroke="rgba(201,164,94,.45)" stroke-width="1" />
        {arcs.length === 1 ? <circle cx={C} cy={C} r={(R + r0) / 2} fill="none" stroke={arcs[0].c} stroke-width={R - r0} /> : arcs.map((p) => <path key={p.label} d={seg(p.a0, p.a1)} fill={p.c} stroke="#0e1518" stroke-width="1" />)}
        <circle cx={C} cy={C} r={r0 - 1} fill="#0e1518" stroke="rgba(201,164,94,.35)" stroke-width="1" />
        {center && <text class="c1" x={C} y={C + (sub ? 2 : 5)} text-anchor="middle">{center}</text>}
        {sub && <text class="c2" x={C} y={C + 15} text-anchor="middle">{sub}</text>}
      </svg>
      {legend && <div class="lg">{shown.slice(0, max).map((p) => <div class="li" key={p.label}><i style={`background:${p.c}`} /><span class="ellipsis">{p.label}</span><b>{fmt((p.v / tot) * 100, (p.v / tot) < 0.1 ? 1 : 0)}%</b></div>)}{shown.length > max && <div class="li"><i style="background:#555" /><span>Khác ({shown.length - max})</span><b>{fmt((shown.slice(max).reduce((t, p) => t + p.v, 0) / tot) * 100, 1)}%</b></div>}</div>}
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
