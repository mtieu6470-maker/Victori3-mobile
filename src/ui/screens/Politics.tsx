// Politics window: Government (regime, ruler, legitimacy, reform in progress, clout structure), Interest groups
// (ledger of clout, approval and law preferences from the engine's IG_PREFS) and Laws (three domains; each law
// opens a detail window comparing every option's support with the current law, using the engine's reform rule).
import type { GameState, IG } from '../../engine/types';
import { IGS } from '../../engine/types';
import type { LawGroup } from '../../engine/data/dbTypes';
import { IG_PREFS, igApproval, reformSupport } from '../../engine/systems/politics';
import { Sec, Metric, Bar, Donut, Mdl, details, useWidth } from '../components/ui';
import { Icon } from '../components/icons';
import { lawUnlocked, LAW_TECH } from '../../engine/laws';
import { leaderTitle } from '../../engine/systems/politics';
import { IG_VI, GROUP_VI, LAW_OPTIONS, techName, titleVi, lawVi, govVi, fmt, pct } from '../i18n/vi';
import { viewedId, canCommand, send, IG_COL, leaderName } from './common';
import { ui } from '../game/ui';

const mood = (a: number): [string, string] => (a >= 5 ? ['Hài lòng', 'up'] : a <= -5 ? ['Phẫn nộ', 'down'] : a < -1 ? ['Bất mãn', 'warn'] : ['Trung lập', 'flat']);
const LAW_COLS: [string, LawGroup[]][] = [['Cơ cấu quyền lực', ['governance', 'power', 'army']], ['Kinh tế', ['economy', 'trade', 'labor']], ['Xã hội', ['church', 'press', 'education']]];
const LAW_ICON: Record<LawGroup, string> = { governance: 'legitimacy', power: 'politics', army: 'army', economy: 'economy', trade: 'market', labor: 'people', church: 'scroll', press: 'journal', education: 'literacy' };
const prefsOf = (g: IG) => Object.entries(IG_PREFS[g]).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));

export function PoliticsScreen({ st, tab }: { st: GameState; tab: string }) {
  if (tab === 'igs') return <IGTab st={st} />;
  if (tab === 'laws') return <LawsTab st={st} />;
  const id = viewedId(st); const c = st.countries[id]; const h = st.history[id] ?? [];
  const igs = [...IGS].sort((a, b) => c.igs[b].clout - c.igs[a].clout);
  const angry = igs.filter((g) => c.igs[g].approval <= -5);
  const year = (t: number) => Math.floor(t / 12) + 1836;
  return (
    <div class="pad">
      <div class="banner-top" style="--bc:#7a2c36">
        <Mdl icon="crown" size="lg" color="#ecd39a" />
        <div style="min-width:0"><h3>{govVi(c.govLabel)}</h3><div class="meta">{lawVi(c.laws.governance)} · {lawVi(c.laws.power)} · {lawVi(c.laws.army)}</div>{c.regimeChangedAt !== null && <div class="meta dim">Thay đổi chế độ gần nhất: {year(c.regimeChangedAt)}</div>}</div>
      </div>
      <div class="metrics">
        <Metric label="Chính danh" icon="legitimacy" value={fmt(c.legitimacy)} spark={h.map((x) => x.legitimacy)} tip={{ title: 'Chính danh', note: 'Thang 0–100. Giảm khi nhóm có ảnh hưởng bất mãn, khi thua trận hoặc vỡ nợ; thấp kéo dài làm tăng nguy cơ cách mạng.' }} />
        <Metric label="Dân cực đoan" icon="radical" value={pct(c.radicalism)} d={<span class="dim">tỷ lệ dân số</span>} />
        <Metric label="Nhóm phẫn nộ" icon="people" value={fmt(angry.length)} d={<span class="dim">{angry.length ? angry.map((g) => IG_VI[g]).join(', ') : 'không có'}</span>} />
      </div>
      <div class="cols c2">
        <Sec title="Nguyên thủ" icon="crown">
          <div class="kv"><span class="k">Chức danh</span><span class="v">{titleVi(leaderTitle(c))}</span></div>
          <div class="kv"><span class="k">Họ tên</span><span class="v">{leaderName(c.leader.name)}</span></div>
          <div class="kv"><span class="k">Nguồn gốc</span><span class="v">{c.leader.historical ? 'Nhân vật lịch sử' : 'Nhân vật mô phỏng'}</span></div>
          <div class="kv"><span class="k">Tại vị từ</span><span class="v num">{c.leader.since}</span></div>
          {c.leader.born && <div class="kv"><span class="k">Năm sinh · tuổi</span><span class="v num">{c.leader.born} · {st.date.y - c.leader.born}</span></div>}
          {c.leader.termEnds && <div class="kv"><span class="k">Hết nhiệm kỳ</span><span class="v num">{c.leader.termEnds.slice(0, 7)}</span></div>}
          <div class="kv"><span class="k">Người kế vị</span><span class="v">{c.heir ? `${c.heir.name}${c.heir.born ? ` (sinh ${c.heir.born})` : ''}` : '—'}</span></div>
        </Sec>
        <Sec title="Cải cách" icon="laws" go={() => ui.tab('politics', 'laws')}>
          {c.reform ? (
            <div>
              <div class="kv"><span class="k">{GROUP_VI[c.reform.group]}</span><span class="v">{lawVi(c.laws[c.reform.group])} → {lawVi(c.reform.value)}</span></div>
              <div style="margin:8px 0 4px"><Bar frac={c.reform.progress} /></div>
              <div class="s">Tiến độ {pct(c.reform.progress)} · bắt đầu {year(c.reform.startedTick)} · ủng hộ hiện tại {fmt(reformSupport(c, c.reform.group, c.reform.value), 2)}</div>
            </div>
          ) : <div class="empty sm">Không có cải cách nào đang tiến hành.</div>}
        </Sec>
      </div>
      <Sec title="Cơ cấu ảnh hưởng" icon="people" x="tỷ trọng ảnh hưởng (clout)" go={() => ui.tab('politics', 'igs')}>
        <Donut parts={igs.map((g) => ({ label: `${IG_VI[g]}${c.igs[g].approval <= -5 ? ' — phẫn nộ' : c.igs[g].approval >= 5 ? ' — hài lòng' : ''}`, v: c.igs[g].clout, c: IG_COL[g] }))} size={120} center={pct(c.igs[igs[0]].clout)} sub={IG_VI[igs[0]].toUpperCase()} />
      </Sec>
    </div>
  );
}

function IGTab({ st }: { st: GameState }) {
  const id = viewedId(st); const c = st.countries[id]; const [ref, w] = useWidth<HTMLDivElement>();
  const igs = [...IGS].sort((a, b) => c.igs[b].clout - c.igs[a].clout); const wide = w >= 560;
  return (
    <div class="pad" ref={ref}>
      <table class="dt">
        <thead><tr><th>Nhóm lợi ích</th><th>Ảnh hưởng</th><th class="r">Thái độ</th>{wide && <th>Ủng hộ</th>}{wide && <th>Phản đối</th>}</tr></thead>
        <tbody>{igs.map((g) => { const ig = c.igs[g]; const [m, cls] = mood(ig.approval); const p = prefsOf(g); const pro = p.filter((x) => (x[1] ?? 0) > 0).slice(0, 3).map((x) => lawVi(x[0])).join(', ') || '—'; const con = p.filter((x) => (x[1] ?? 0) < 0).slice(-3).map((x) => lawVi(x[0])).join(', ') || '—'; return (
          <tr key={g} style="cursor:default">
            <td><span class="cell-ic"><span class="sw" style={`background:${IG_COL[g]}`} /><span><div class="nm">{IG_VI[g]}</div>{!wide && <div class="sub" style="white-space:normal">+ {pro} · − {con}</div>}</span></span></td>
            <td style="min-width:92px"><div class="bal"><span class="bar" style="width:52px"><i style={`width:${ig.clout * 100}%;background:${IG_COL[g]}`} /></span><span class="num">{pct(ig.clout)}</span></div></td>
            <td class="r"><span class={`tag ${cls}`}>{m}</span><div class="sub num">{ig.approval >= 0 ? '+' : '−'}{fmt(Math.abs(ig.approval), 1)}</div></td>
            {wide && <td class="muted" style="white-space:normal;font-size:13px">{pro}</td>}
            {wide && <td class="muted" style="white-space:normal;font-size:13px">{con}</td>}
          </tr>); })}</tbody>
      </table>
      <div class="note">Ảnh hưởng phụ thuộc cơ cấu dân cư và luật quyền lực; thái độ (−10…+10) tính theo luật hiện hành và mức sống. Ủng hộ/phản đối là sở thích luật của nhóm trong mô phỏng.</div>
    </div>
  );
}

function LawsTab({ st }: { st: GameState }) {
  const id = viewedId(st); const c = st.countries[id]; const mine = canCommand(st, id); const sel = details.use()?.key;
  const open = (g: LawGroup) => details.toggle({ key: `law:${g}`, title: GROUP_VI[g], ctx: `hiện hành: ${lawVi(c.laws[g])}`, body: () => <LawDetail st={st} id={id} g={g} /> });
  return (
    <div class="pad">
      {c.reform && <div class="banner"><Icon name="laws" /><div class="grow"><b>Đang cải cách {GROUP_VI[c.reform.group].toLowerCase()} → {lawVi(c.reform.value)}</b><Bar frac={c.reform.progress} /></div><span class="num">{pct(c.reform.progress)}</span></div>}
      <div class="lawgrid">
        {LAW_COLS.map(([title, groups]) => (
          <div key={title} class="lawcol">
            <h4 class="sec-t">{title}</h4>
            {groups.map((g) => {
              const supporters = IGS.filter((ig) => (IG_PREFS[ig][c.laws[g]] ?? 0) > 0).length, opponents = IGS.filter((ig) => (IG_PREFS[ig][c.laws[g]] ?? 0) < 0).length;
              return (
                <button key={g} class={`lawcell${sel === `law:${g}` ? ' on' : ''}${c.reform?.group === g ? ' reform' : ''}`} onClick={() => open(g)}>
                  <Mdl icon={LAW_ICON[g]} />
                  <span class="txt"><span class="k">{GROUP_VI[g]}</span><span class="v">{lawVi(c.laws[g])}</span><span class="m">{supporters} nhóm ủng hộ · {opponents} phản đối</span></span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
      {!mine && <div class="note">Chỉ xem: bạn không điều khiển quốc gia này.</div>}
    </div>
  );
}

function LawDetail({ st, id, g }: { st: GameState; id: string; g: LawGroup }) {
  const c = st.countries[id]; const mine = canCommand(st, id); const cur = c.laws[g];
  const opts = (LAW_OPTIONS[g] ?? []).includes(cur) ? LAW_OPTIONS[g] : [cur, ...(LAW_OPTIONS[g] ?? [])];
  return (
    <div>
      <div class="note" style="margin-top:0">Mức ủng hộ = tổng (ảnh hưởng × thay đổi thái độ) của các nhóm lợi ích nếu luật được đổi — cùng công thức mô phỏng dùng để tính tiến độ cải cách.</div>
      {opts.map((v) => {
        const isCur = v === cur; const sup = isCur ? 0 : reformSupport(c, g, v);
        const next = { ...c.laws, [g]: v }; const movers = isCur ? [] : IGS.map((ig) => [ig, c.igs[ig].clout * (igApproval(c, ig, next) - igApproval(c, ig))] as const).filter((x) => Math.abs(x[1]) > 0.004).sort((a, b) => b[1] - a[1]);
        return (
          <div class={`option${isCur ? ' cur' : ''}`} key={v}>
            <div class="oh"><span class="ot">{lawVi(v)}</span>{isCur ? <span class="tag flat">Hiện hành</span> : <span class={`num ${sup > 0 ? 'pos' : sup < 0 ? 'neg' : 'muted'}`} style="font-weight:600">{sup >= 0 ? '+' : '−'}{fmt(Math.abs(sup), 2)}</span>}</div>
            {!isCur && (movers.length ? <div class="movers">{movers.map(([ig, d]) => <span key={ig} class={d > 0 ? 'pos' : 'neg'}><i class="sw" style={`background:${IG_COL[ig]}`} />{IG_VI[ig]} {d > 0 ? '+' : '−'}{fmt(Math.abs(d), 2)}</span>)}</div> : <div class="s">Không nhóm nào thay đổi thái độ.</div>)}
            {!isCur && !lawUnlocked(c, v) && <div class="s">Cần công nghệ: {techName(LAW_TECH[v])}</div>}
            {!isCur && mine && <div style="margin-top:6px"><button class="btn sm" disabled={!!c.reform || !lawUnlocked(c, v)} onClick={() => { void send({ type: 'start_reform', group: g, value: v }, `Bắt đầu cải cách: ${lawVi(v)}`).then((ok) => { if (ok) details.close(); }); }}>Bắt đầu cải cách</button></div>}
          </div>
        );
      })}
      {c.reform && mine && <div class="note">Đang có một cải cách khác; mỗi lần chỉ tiến hành một cải cách.</div>}
    </div>
  );
}
export const POLITICS_TABS: [string, string][] = [['gov', 'Chính phủ'], ['igs', 'Nhóm lợi ích'], ['laws', 'Luật pháp']];
