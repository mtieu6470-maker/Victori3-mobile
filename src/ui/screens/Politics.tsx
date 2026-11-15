// Politics: government, interest groups, laws & reforms (start_reform through the engine).
import type { GameState, IG } from '../../engine/types';
import { IGS } from '../../engine/types';
import { LAW_GROUPS, type LawGroup } from '../../engine/data/dbTypes';
import { IG_PREFS, igApproval, reformSupport } from '../../engine/systems/politics';
import { Section, Stat, Bar, modals } from '../components/ui';
import { Icon } from '../components/icons';
import { IG_VI, GROUP_VI, LAW_OPTIONS, lawVi, govVi, fmt, pct } from '../i18n/vi';
import { viewedId, canCommand, send } from './common';

const mood = (a: number) => (a >= 5 ? ['Hài lòng', 'pos'] : a <= -5 ? ['Phẫn nộ', 'neg'] : a < -1 ? ['Bất mãn', 'neg'] : ['Trung lập', 'muted']);
const LAW_COLS: [string, LawGroup[]][] = [['Cơ cấu quyền lực', ['governance', 'power', 'army']], ['Kinh tế', ['economy', 'trade', 'labor']], ['Xã hội', ['church', 'press', 'education']]];
const LAW_ICON: Record<LawGroup, string> = { governance: 'legitimacy', power: 'politics', army: 'army', economy: 'economy', trade: 'market', labor: 'people', church: 'scroll', press: 'journal', education: 'literacy' };

export function PoliticsScreen({ st, tab }: { st: GameState; tab: string }) {
  const id = viewedId(st); const c = st.countries[id]; const mine = canCommand(st, id);
  if (tab === 'igs') {
    const igs = [...IGS].sort((a, b) => c.igs[b].clout - c.igs[a].clout);
    return (
      <div>
        {igs.map((g) => { const ig = c.igs[g]; const [m, cls] = mood(ig.approval); const prefs = Object.entries(IG_PREFS[g]).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0)); return (
          <div class="entry" key={g} style="cursor:default;flex-wrap:wrap">
            <span class="ico"><Icon name="people" /></span>
            <div class="main"><div class="cat">Nhóm lợi ích</div><div class="ttl">{IG_VI[g as IG]}</div><div style="margin-top:4px"><Bar frac={ig.clout} /></div></div>
            <div class="aside"><div class="num" style="font-size:18px;font-weight:600">{pct(ig.clout)}</div><div class={cls} style="font-size:13px">{m} ({ig.approval >= 0 ? '+' : '−'}{fmt(Math.abs(ig.approval), 1)})</div></div>
            <div style="flex-basis:100%;font-size:12.5px;padding-left:44px" class="muted">Ủng hộ: {prefs.filter((p) => (p[1] ?? 0) > 0).slice(0, 3).map((p) => lawVi(p[0])).join(', ') || '—'} · Phản đối: {prefs.filter((p) => (p[1] ?? 0) < 0).slice(-3).map((p) => lawVi(p[0])).join(', ') || '—'}</div>
          </div>); })}
        <div class="note">Ảnh hưởng (clout) phụ thuộc cơ cấu dân cư và luật quyền lực; mức hài lòng (thang −10…+10) tính theo luật hiện hành và mức sống.</div>
      </div>
    );
  }
  if (tab === 'laws') {
    const open = (g: LawGroup) => modals.open(`${GROUP_VI[g]}`, () => <LawDialog st={st} id={id} g={g} />);
    return (
      <div>
        {c.reform && <div class="plate" style="margin-bottom:6px"><div class="serif" style="font-size:16px">Đang cải cách: {GROUP_VI[c.reform.group]} → <b>{lawVi(c.reform.value)}</b></div><div style="margin-top:6px"><Bar frac={c.reform.progress} /></div><div class="dim" style="font-size:12.5px;margin-top:3px">Tiến độ {pct(c.reform.progress)} · bắt đầu {Math.floor(c.reform.startedTick / 12) + 1836}</div></div>}
        {LAW_COLS.map(([title, groups]) => (
          <Section key={title} title={title}>
            {groups.map((g) => (
              <button class={`entry${c.reform?.group === g ? ' on' : ''}`} key={g} onClick={() => open(g)}>
                <span class="ico"><Icon name={LAW_ICON[g]} /></span>
                <div class="main"><div class="cat">{GROUP_VI[g]}</div><div class="ttl">{lawVi(c.laws[g])}</div></div>
                <span class="dim">›</span>
              </button>
            ))}
          </Section>
        ))}
        {!mine && <div class="note">Chỉ xem: bạn không điều khiển quốc gia này.</div>}
      </div>
    );
  }
  const top = [...IGS].sort((a, b) => c.igs[b].clout - c.igs[a].clout).slice(0, 3);
  return (
    <div>
      <div class="plates c2">
        <Stat label="Chính thể" icon="legitimacy" value={<span class="serif" style="font-size:18px">{govVi(c.govLabel)}</span>} sub={`${lawVi(c.laws.governance)} · ${lawVi(c.laws.power)}`} />
        <Stat label="Chính danh" icon="politics" value={fmt(c.legitimacy)} sub={`Cực đoan ${pct(c.radicalism)}`} />
      </div>
      <Section title="Nguyên thủ">
        <div class="rowline"><span class="grow serif" style="font-size:17px">{c.leader.name.replace(/ \(.*generated\)/, '')}</span><span class="dim">{c.leader.historical ? 'nhân vật lịch sử' : 'nhân vật mô phỏng'}</span></div>
        <div class="rowline"><span class="grow">Tại vị từ</span><b class="num">{c.leader.since}</b></div>
        {c.leader.born && <div class="rowline"><span class="grow">Năm sinh</span><b class="num">{c.leader.born}</b></div>}
        {c.leader.termEnds && <div class="rowline"><span class="grow">Hết nhiệm kỳ</span><b class="num">{c.leader.termEnds.slice(0, 7)}</b></div>}
        {c.heir && <div class="rowline"><span class="grow">Người kế vị</span><b class="serif">{c.heir.name}</b></div>}
      </Section>
      <Section title="Nhóm có ảnh hưởng lớn nhất">
        {top.map((g) => { const [m, cls] = mood(c.igs[g].approval); return <div class="rowline" key={g}><span class="grow serif" style="font-size:15px">{IG_VI[g]}</span><span class="num" style="width:56px">{pct(c.igs[g].clout)}</span><span class={cls} style="width:86px;text-align:right">{m}</span></div>; })}
      </Section>
      {c.reform ? <div class="note box">Đang cải cách {GROUP_VI[c.reform.group].toLowerCase()} sang <b>{lawVi(c.reform.value)}</b> — tiến độ {pct(c.reform.progress)}.</div> : <div class="note">Không có cải cách nào đang tiến hành.</div>}
    </div>
  );
}

function LawDialog({ st, id, g }: { st: GameState; id: string; g: LawGroup }) {
  const c = st.countries[id]; const mine = canCommand(st, id); const cur = c.laws[g];
  const opts = (LAW_OPTIONS[g] ?? []).includes(cur) ? LAW_OPTIONS[g] : [cur, ...(LAW_OPTIONS[g] ?? [])];
  return (
    <div>
      <div class="note">Mức ủng hộ = tổng (ảnh hưởng × thay đổi mức hài lòng) của các nhóm lợi ích nếu luật được đổi — cùng công thức mà mô phỏng dùng để tính tiến độ cải cách.</div>
      {opts.map((v) => {
        const isCur = v === cur; const sup = isCur ? 0 : reformSupport(c, g, v);
        const next = { ...c.laws, [g]: v }; const movers = isCur ? [] : IGS.map((ig) => [ig, c.igs[ig].clout * (igApproval(c, ig, next) - igApproval(c, ig))] as const).filter((x) => Math.abs(x[1]) > 0.004).sort((a, b) => b[1] - a[1]);
        return (
          <div class={`entry${isCur ? ' on' : ''}`} key={v} style="cursor:default;flex-wrap:wrap">
            <div class="main"><div class="cat">{isCur ? 'Luật hiện hành' : 'Phương án'}</div><div class="ttl">{lawVi(v)}</div>
              {!isCur && <div class="meta">{movers.length ? movers.map(([ig, d]) => `${IG_VI[ig]} ${d > 0 ? '+' : '−'}${fmt(Math.abs(d), 2)}`).join(' · ') : 'Không nhóm nào quan tâm'}</div>}</div>
            {!isCur && <div class="aside"><div class={`num ${sup > 0 ? 'pos' : sup < 0 ? 'neg' : 'muted'}`} style="font-size:17px;font-weight:600">{sup >= 0 ? '+' : '−'}{fmt(Math.abs(sup), 2)}</div><div class="dim" style="font-size:12px">ủng hộ</div></div>}
            {!isCur && mine && <button class="btn sm" disabled={!!c.reform} style="margin-left:6px" onClick={() => { if (send({ type: 'start_reform', group: g, value: v }, `Bắt đầu cải cách: ${lawVi(v)}`)) modals.close(); }}>Cải cách</button>}
          </div>
        );
      })}
      {c.reform && mine && <div class="note">Đang có một cải cách khác; mỗi lần chỉ tiến hành một cải cách.</div>}
    </div>
  );
}
export const POLITICS_TABS: [string, string][] = [['gov', 'Chính phủ'], ['igs', 'Nhóm lợi ích'], ['laws', 'Luật pháp']];
