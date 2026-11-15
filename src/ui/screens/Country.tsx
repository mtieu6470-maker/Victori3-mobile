// Country: overview (current simulated values with yearly trend), historical dossier (1836 research data and
// its completeness — kept apart from national performance), and yearly statistics charts.
import type { GameState } from '../../engine/types';
import { data } from '../../engine/data/db';
import { rankings } from '../../engine/metrics';
import { allied, rivals } from '../../engine/systems/diplomacy';
import { atWar } from '../../engine/systems/military';
import { techCost } from '../../engine/systems/technology';
import { Section, Stat, LineChart, QualityMark, modals, Provenance } from '../components/ui';
import { Icon } from '../components/icons';
import { govVi, lawVi, fmt, pct, money, compact, techName, SUBJECT_VI } from '../i18n/vi';
import { fullName, shortName } from '../game/names';
import { ui } from '../game/ui';
import { Flag, monthYear } from './common';

const SEC_VI: Record<string, string> = { political: 'Chính trị', territory: 'Lãnh thổ', economy: 'Kinh tế', society: 'Xã hội', diplomacy: 'Ngoại giao', military: 'Quân sự', technology: 'Khoa học – công nghệ', historical_ai: 'Ưu tiên lịch sử & tính cách AI' };
const STATUS_VI: Record<string, string> = { complete: 'Đầy đủ', partial: 'Một phần', missing: 'Thiếu' };

function trend(vals: number[]): { txt: string; cls: string } | null {
  if (vals.length < 2) return null; const a = vals[vals.length - 2], b = vals[vals.length - 1]; if (!a) return null;
  const d = b / a - 1; return { txt: `${d > 0 ? '▲' : d < 0 ? '▼' : '■'} ${fmt(Math.abs(d) * 100, 1)}%/năm`, cls: d > 0.0005 ? 'pos' : d < -0.0005 ? 'neg' : 'muted' };
}

export function CountryScreen({ st, id, tab }: { st: GameState; id: string; tab: string }) {
  const c = st.countries[id]; if (!c) return <div class="empty">Quốc gia không tồn tại.</div>;
  if (tab === 'dossier') return <Dossier st={st} id={id} />;
  if (tab === 'stats') return <YearStats st={st} id={id} />;
  const e = data().entity.get(id); const h = st.history[id] ?? [];
  const rank = rankings(st).findIndex((r) => r.id === id) + 1;
  const ser = (k: 'gdp' | 'pop' | 'literacy' | 'legitimacy' | 'army') => h.map((x) => x[k]);
  const t = (k: 'gdp' | 'pop' | 'literacy' | 'legitimacy' | 'army') => { const r = trend(ser(k)); return r ? <span class={r.cls}>{r.txt}</span> : <span class="dim">chưa đủ dữ liệu năm</span>; };
  const regs = st.regions.filter((r) => r.owner === id);
  const allies = st.treaties.filter((x) => x.type === 'alliance' && x.members.includes(id)).length;
  const rivalsN = Object.keys(st.countries).filter((o) => o !== id && rivals(st, id, o)).length;
  const wars = st.wars.filter((w) => w.attackers.members.includes(id) || w.defenders.members.includes(id));
  const subjects = Object.values(st.countries).filter((x) => x.alive && x.overlord === id).length;
  const go = (screen: Parameters<typeof ui.go>[0], tabId?: string) => ui.go(screen, tabId);
  const sec = (icon: string, title: string, line: string, onClick: () => void) => (
    <button class="entry" onClick={onClick}><span class="ico"><Icon name={icon} /></span><div class="main"><div class="ttl" style="font-size:16px">{title}</div><div class="meta">{line}</div></div><span class="dim">›</span></button>
  );
  return (
    <div>
      <div class="plate" style="display:flex;gap:12px;align-items:center;margin-bottom:6px">
        <span class="flag" style={`width:58px;height:39px;background:${c.color}`} />
        <div style="min-width:0">
          <div class="serif" style="font-size:20px;font-weight:600;line-height:1.15">{fullName(st, id)}</div>
          <div class="muted" style="font-size:13px">{govVi(c.govLabel)} · {c.leader.name.replace(/ \(.*generated\)/, '')}{!c.leader.historical && ' (nhân vật mô phỏng)'} · từ {c.leader.since}</div>
          <div class="dim" style="font-size:12.5px">Hạng sức mạnh #{rank || '—'}{c.overlord ? ` · ${SUBJECT_VI[c.subjectType ?? ''] ?? 'Chư hầu'} của ${shortName(st, c.overlord)}` : ''} · số liệu {monthYear(st)}</div>
        </div>
      </div>
      <div class="plates c2">
        <Stat label="GDP / năm" icon="gdp" value={money(c.gdp)} sub={t('gdp')} spark={ser('gdp')} />
        <Stat label="Dân số" icon="population" value={compact(c.stats.pop)} sub={t('pop')} spark={ser('pop')} />
        <Stat label="Biết chữ" icon="literacy" value={pct(c.stats.literacy)} sub={t('literacy')} spark={ser('literacy')} />
        <Stat label="Chính danh" icon="legitimacy" value={fmt(c.legitimacy)} sub={<span>Cực đoan {pct(c.radicalism)}</span>} spark={ser('legitimacy')} />
        <Stat label="Ngân khố" icon="treasury" value={money(c.treasury)} sub={<span class={c.income >= c.expense ? 'pos' : 'neg'}>{c.income >= c.expense ? '▲' : '▼'} {compact(Math.abs(c.income - c.expense))}/tháng{c.debt > 0 ? ` · nợ ${compact(c.debt)}` : ''}</span>} />
        <Stat label="Lục quân · hải quân" icon="army" value={`${compact(c.army.manpower)} · ${fmt(c.navy.strength)} tàu`} sub={t('army')} spark={ser('army')} />
      </div>
      <Section title="Tình hình quốc gia">
        {sec('politics', 'Chính trị', `${lawVi(c.laws.governance)} · ${lawVi(c.laws.power)}${c.reform ? ' · đang cải cách' : ''}`, () => go('politics', 'gov'))}
        {sec('map', 'Lãnh thổ', `${regs.length} vùng · thủ đô ${data().region.get(c.capital)?.name ?? '—'}${subjects ? ` · ${subjects} chư hầu` : ''}`, () => go('society', 'regions'))}
        {sec('economy', 'Kinh tế', `${lawVi(c.laws.economy)} · ${lawVi(c.laws.trade)} · thuế ${pct(c.taxRate)}`, () => go('economy', 'market'))}
        {sec('society', 'Xã hội', `Biết chữ ${pct(c.stats.literacy)} · mức sống ${fmt(c.stats.sol, 2)} · công nghiệp ${pct(c.stats.industry, 1)}`, () => go('society', 'pop'))}
        {sec('diplomacy', 'Ngoại giao', `${allies} liên minh · ${rivalsN} đối thủ · uy tín ${fmt(c.prestige)}`, () => go('diplomacy', 'relations'))}
        {sec('military', 'Quân sự', wars.length ? `${wars.length} cuộc chiến đang diễn ra` : 'Hòa bình', () => go('military', 'wars'))}
        {sec('tech', 'Công nghệ', `${c.techs.length}/${data().db.technologies.length} công nghệ${c.research.current ? ` · đang nghiên cứu ${techName(c.research.current)} ${pct(Math.min(1, c.research.progress / techCost(st, c, c.research.current)))}` : ''}`, () => go('tech'))}
      </Section>
      {e && <div class="note">Hồ sơ nghiên cứu lịch sử (nguồn, mức hoàn thiện dữ liệu 1836) nằm ở thẻ <a style="color:var(--brass-hi);cursor:pointer" onClick={() => ui.tab('country', 'dossier')}>Hồ sơ lịch sử</a>.</div>}
      {id !== st.player && st.player && <div class="btns" style="margin-top:6px"><button class="btn" onClick={() => { ui.set({ screen: 'diplomacy', tabs: { ...ui.get().tabs, diplomacy: 'relations' } }); }}>Quan hệ ngoại giao</button></div>}
      {void allied}{void atWar}
    </div>
  );
}

function Dossier({ st, id }: { st: GameState; id: string }) {
  const e = data().entity.get(id);
  if (!e) return <div class="empty">Quốc gia này hình thành trong ván chơi nên không có hồ sơ nghiên cứu năm 1836.</div>;
  const prof = (e as any).profile ?? {};
  const fact = (f: any) => (f && typeof f === 'object' && 'quality' in f ? f : null);
  return (
    <div>
      <div class="plate" style="margin-bottom:6px">
        <div class="serif" style="font-size:18px;font-weight:600">{e.vi}</div>
        <div class="muted" style="font-size:13px">{e.en} · dữ liệu tại {prof.as_of ?? '1836-01-01'} · mức hoàn thiện nghiên cứu {pct(e.research_completeness)}</div>
        <div class="dim" style="font-size:12.5px">Đây là chất lượng dữ liệu nghiên cứu, không phải chỉ số sức mạnh của quốc gia trong ván chơi.</div>
      </div>
      <Section title="Dữ liệu khởi đầu có nguồn">
        <div class="rowline"><span class="grow">Dân số 1836</span><b class="num">{compact((e.population as any).value ?? 0)}</b> <QualityMark quality={e.population.quality} sources={e.population.sources as any} method={e.population.method} /></div>
        {fact((e as any).literacy) && <div class="rowline"><span class="grow">Biết chữ</span><b class="num">{pct((e as any).literacy.value)}</b> <QualityMark quality={(e as any).literacy.quality} sources={(e as any).literacy.sources} method={(e as any).literacy.method} /></div>}
        {fact((e as any).army) && <div class="rowline"><span class="grow">Quân số</span><b class="num">{compact((e as any).army.value)}</b> <QualityMark quality={(e as any).army.quality} sources={(e as any).army.sources} method={(e as any).army.method} /></div>}
        {e.laws && <div class="rowline"><span class="grow">Luật pháp khởi đầu</span><b class="serif">{lawVi((e.laws as any).value?.governance ?? '')}</b> <QualityMark quality={(e.laws as any).quality} sources={(e.laws as any).sources} /></div>}
      </Section>
      <Section title="Các mục hồ sơ">
        {e.profile_sections.map((s) => (
          <button class="entry" key={s.section} onClick={() => modals.open(SEC_VI[s.section] ?? s.section, () => <SectionFacts sec={prof[s.section]} status={s.status} />)}>
            <span class="ico" style={`color:${s.status === 'complete' ? 'var(--pos)' : s.status === 'partial' ? 'var(--warn)' : 'var(--text-3)'}`}><Icon name={s.status === 'complete' ? 'check' : s.status === 'partial' ? 'scroll' : 'warning'} /></span>
            <div class="main"><div class="ttl" style="font-size:16px">{SEC_VI[s.section] ?? s.section}</div><div class="meta">{STATUS_VI[s.status] ?? s.status} · {s.facts} dữ kiện</div></div>
            {s.worst_quality && <QualityMark quality={s.worst_quality} />}
          </button>
        ))}
      </Section>
    </div>
  );
}
function SectionFacts({ sec, status }: { sec: any; status: string }) {
  if (!sec || typeof sec !== 'object' || !Object.keys(sec).length) return <div class="empty">Mục này {status === 'missing' ? 'chưa được nghiên cứu' : 'chưa có dữ kiện chi tiết'} trong cơ sở dữ liệu.</div>;
  return (
    <div>
      {Object.entries(sec).map(([k, f]: [string, any]) => {
        const v = f?.value; const txt = v === undefined ? JSON.stringify(f) : typeof v === 'object' ? Object.entries(v).map(([a, b]) => `${a}: ${typeof b === 'object' ? JSON.stringify(b) : b}`).join(' · ') : String(v);
        return <div class="rowline" key={k} style="align-items:flex-start"><div class="grow"><div class="dim" style="font-size:12px">{k.replace(/_/g, ' ')}</div><div style="white-space:normal;font-size:14px">{txt}</div>{f?.note && <div class="dim" style="font-size:12px;white-space:normal">{f.note}</div>}</div>{f?.quality && <QualityMark quality={f.quality} sources={f.sources} method={f.method} />}</div>;
      })}
      {void Provenance}
    </div>
  );
}

function YearStats({ st, id }: { st: GameState; id: string }) {
  const h = st.history[id] ?? []; const years = h.map((x) => x.y);
  return (
    <div>
      <Section title="Dân số"><LineChart years={years} series={[{ name: 'pop', color: '#d9bd7c', values: h.map((x) => x.pop) }]} fmtY={compact} /></Section>
      <Section title="GDP / năm"><LineChart years={years} series={[{ name: 'gdp', color: '#93c47a', values: h.map((x) => x.gdp) }]} fmtY={compact} /></Section>
      <Section title="Biết chữ"><LineChart years={years} series={[{ name: 'lit', color: '#93bad6', values: h.map((x) => x.literacy) }]} fmtY={(v) => pct(v)} /></Section>
      <Section title="Chính danh"><LineChart years={years} series={[{ name: 'leg', color: '#e3806a', values: h.map((x) => x.legitimacy) }]} fmtY={(v) => fmt(v)} /></Section>
      <Section title="Điểm sức mạnh"><LineChart years={years} series={[{ name: 'pow', color: '#c3a05c', values: h.map((x) => x.power) }]} fmtY={(v) => fmt(v)} /></Section>
      <div class="note">Mỗi điểm là số liệu ngày 1 tháng 1 hằng năm do mô phỏng ghi lại.</div>
    </div>
  );
}
export const COUNTRY_TABS: [string, string][] = [['overview', 'Tổng quan'], ['dossier', 'Hồ sơ lịch sử'], ['stats', 'Chỉ số năm']];
export { Flag };
