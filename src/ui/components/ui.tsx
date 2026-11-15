// Shared UI primitives: framed panel, tabs, section header, stat plate, ledger helpers, charts, quality mark,
// dialogs. All values passed in come from engine state or the Historical Database.
import type { ComponentChildren, VNode } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Icon } from './icons';
import { QUALITY_VI, fmt } from '../i18n/vi';
import { data } from '../../engine/data/db';

// ---------------------------------------------------------------- modal store
let modal: { title: string; body: () => VNode; wide?: boolean } | null = null;
const ml = new Set<() => void>();
export const modals = {
  open(title: string, body: () => VNode, wide = false) { modal = { title, body, wide }; ml.forEach((f) => f()); },
  close() { modal = null; ml.forEach((f) => f()); },
  get: () => modal,
};
export function ModalHost() {
  const [, f] = useState(0); useEffect(() => { const g = () => f((x) => x + 1); ml.add(g); return () => { ml.delete(g); }; }, []);
  if (!modal) return null;
  return (
    <>
      <div class="scrim" onClick={() => modals.close()} />
      <div class="dialog panel" role="dialog" aria-label={modal.title} style={modal.wide ? 'width:min(96vw,640px)' : ''}>
        <PanelHead title={modal.title} onClose={() => modals.close()} />
        <div class="pbody">{modal.body()}</div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------- panel
export function PanelHead({ title, onClose, onBack, onExpand, grab }: { title: string; onClose?: () => void; onBack?: () => void; onExpand?: () => void; grab?: boolean }) {
  return (
    <div class="phead">
      {grab && <span class="grab" />}
      {onBack && <button class="round sm l" aria-label="Quay lại" onClick={onBack}><Icon name="back" /></button>}
      {onExpand && !onBack && <button class="round sm l" aria-label="Mở rộng / thu gọn" onClick={onExpand}><Icon name="expand" /></button>}
      <h2>{title}</h2>
      {onClose && <button class="round sm r" aria-label="Đóng" onClick={onClose}><Icon name="close" /></button>}
    </div>
  );
}
export function Tabs({ tabs, value, onChange }: { tabs: [string, string][]; value: string; onChange: (v: string) => void }) {
  return (
    <div class="ptabs" role="tablist">
      {tabs.map(([id, label]) => <button key={id} role="tab" aria-selected={id === value} class={`ptab${id === value ? ' on' : ''}`} onClick={() => onChange(id)}>{label}</button>)}
    </div>
  );
}
export function Section({ title, extra, children, left }: { title: string; extra?: ComponentChildren; children: ComponentChildren; left?: boolean }) {
  return (
    <div class="section">
      <div class={`shead${left ? ' left' : ''}`}>{title}{extra !== undefined && <span class="ex">{extra}</span>}</div>
      {children}
    </div>
  );
}
export type SourceRef = string | { id: string; locator?: string };
export function Stat({ label, value, sub, q, icon, spark, onClick }: { label: string; value: ComponentChildren; sub?: ComponentChildren; q?: { quality: string; sources?: SourceRef[]; method?: string } | null; icon?: string; spark?: number[]; onClick?: () => void }) {
  return (
    <div class="plate stat" onClick={onClick} style={onClick ? 'cursor:pointer' : ''}>
      <div class="k">{icon && <Icon name={icon} size={15} />}{label}{q && <QualityMark {...q} />}</div>
      <div class="v num">{value}</div>
      {sub && <div class="s">{sub}</div>}
      {spark && spark.length >= 3 && <Spark values={spark} />}
    </div>
  );
}
export function Spark({ values }: { values: number[] }) {
  const lo = Math.min(...values), hi = Math.max(...values), sp = hi - lo || 1;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 100},${20 - ((v - lo) / sp) * 18 - 1}`).join(' ');
  return <svg class="spark" viewBox="0 0 100 20" preserveAspectRatio="none"><polyline points={pts} fill="none" stroke="var(--brass)" stroke-width="1.4" vector-effect="non-scaling-stroke" /></svg>;
}
/** Yearly line chart with axis labels (only real samples; caller passes engine yearly history). */
export function LineChart({ series, years, fmtY, height = 150 }: { series: { name: string; color: string; values: number[] }[]; years: number[]; fmtY: (v: number) => string; height?: number }) {
  if (years.length < 2) return <div class="empty">Chưa đủ số liệu theo năm (cần ít nhất 2 năm mô phỏng).</div>;
  const all = series.flatMap((s) => s.values); const lo = Math.min(...all), hi = Math.max(...all); const sp = hi - lo || Math.abs(hi) || 1;
  const W = 320, H = height, L = 44, B = 18, T = 8, Rr = 8;
  const x = (i: number) => L + (i / (years.length - 1)) * (W - L - Rr); const y = (v: number) => T + (1 - (v - lo) / sp) * (H - T - B);
  const ticks = [lo, lo + sp / 2, hi];
  return (
    <svg class="chart" viewBox={`0 0 ${W} ${H}`}>
      {ticks.map((t) => <g key={t}><line x1={L} x2={W - Rr} y1={y(t)} y2={y(t)} stroke="#34494b" stroke-dasharray="2 3" /><text x={L - 4} y={y(t) + 3.5} text-anchor="end">{fmtY(t)}</text></g>)}
      <text x={L} y={H - 4}>{years[0]}</text><text x={W - Rr} y={H - 4} text-anchor="end">{years[years.length - 1]}</text>
      {series.map((s) => <polyline key={s.name} fill="none" stroke={s.color} stroke-width="1.8" points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')} />)}
    </svg>
  );
}
export function Bar({ frac, color }: { frac: number; color?: string }) {
  return <div class="bar"><i style={`width:${Math.max(0, Math.min(1, frac)) * 100}%${color ? `;background:${color}` : ''}`} /></div>;
}
/** Diverging bar for values in [-1, 1]. */
export function DBar({ v }: { v: number }) {
  const len = Math.min(1, Math.abs(v)) * 50;
  return <span class="dbar"><i style={`${v >= 0 ? `left:50%` : `left:${50 - len}%`};width:${len}%;background:${v >= 0 ? 'var(--pos)' : 'var(--neg)'}`} /></span>;
}
export function Chip({ v, dp = 0, invert }: { v: number; dp?: number; invert?: boolean }) {
  const good = invert ? v < 0 : v > 0; const cls = Math.abs(v) < 0.005 ? 'flat' : good ? 'up' : 'down';
  return <span class={`chip num ${cls}`}>{v > 0 ? '▲' : v < 0 ? '▼' : '■'} {fmt(Math.abs(v) * 100, dp)}%</span>;
}

// ---------------------------------------------------------------- provenance
export function QualityMark({ quality, sources, method }: { quality: string; sources?: SourceRef[]; method?: string }) {
  const q = QUALITY_VI[quality] ?? QUALITY_VI.missing;
  return (
    <span class={`q ${q.cls}`} role="button" aria-label={q.label} title={q.label}
      onClick={(e) => { e.stopPropagation(); modals.open('Nguồn & độ tin cậy', () => <Provenance quality={quality} sources={sources} method={method} />); }}>
      {q.sym}
    </span>
  );
}
export function Provenance({ quality, sources, method }: { quality: string; sources?: SourceRef[]; method?: string }) {
  const q = QUALITY_VI[quality] ?? QUALITY_VI.missing; const db = data().db;
  return (
    <div>
      <div class="plate" style="margin-bottom:8px"><span class={`q ${q.cls}`} style="font-size:14px">{q.sym}</span> <b class="serif" style="font-size:17px">{q.label}</b></div>
      {method && <div class="note box"><b>Phương pháp:</b> {method}</div>}
      <Section title="Nguồn">
        {sources?.length ? sources.map((ref, i) => { const sid = typeof ref === 'string' ? ref : ref.id; const loc = typeof ref === 'string' ? '' : ref.locator ?? ''; const s = db.sources.find((x) => x.id === sid) as { citation?: string; url?: string } | undefined; return <div class="rowline" key={sid + i}><div class="grow"><div class="serif" style="font-size:14.5px;line-height:1.3;white-space:normal">{s?.citation ?? sid}</div>{loc && <div class="dim" style="font-size:12px;white-space:normal">Vị trí: {loc}</div>}</div></div>; })
          : <div class="empty">Không có nguồn — giá trị dùng cho gameplay, không phải dữ kiện lịch sử.</div>}
      </Section>
      <div class="note">Đây là dữ liệu khởi đầu năm 1836 trong Cơ sở dữ liệu Lịch sử. Giá trị hiện tại trong ván chơi là kết quả mô phỏng.</div>
    </div>
  );
}
