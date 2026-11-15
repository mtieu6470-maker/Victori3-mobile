// Military window: Forces (army and navy status against targets, effective strength, force targets for the
// player, comparison with the strongest armies, yearly army size) and Wars (each war with sides, war goals, score,
// exhaustion, battles, occupation and the actions the engine allows).
import { useState } from 'preact/hooks';
import type { GameState, War } from '../../engine/types';
import { armyStrength, navalStrength } from '../../engine/systems/military';
import { Sec, Metric, DBar, Bar, LineChart, useWidth } from '../components/ui';
import { Icon } from '../components/icons';
import { fmt, pct, compact } from '../i18n/vi';
import { shortName } from '../game/names';
import { viewedId, canCommand, send, CountryLink, Flag, focusRegion, regionName } from './common';

const KIND: Record<string, string> = { conquest: 'Chiến tranh xâm chiếm', civil: 'Nội chiến', colonial: 'Chiến tranh thuộc địa', independence: 'Chiến tranh giành độc lập', great: 'Đại chiến' };
const GOAL: Record<string, string> = { conquer: 'Chiếm vùng', annex_region: 'Sáp nhập vùng', colonize: 'Thuộc địa hóa', subjugate: 'Chư hầu hóa', force_open_market: 'Mở cửa thị trường', independence: 'Giành độc lập', unify: 'Thống nhất', liberate: 'Giải phóng' };

export function MilitaryScreen({ st, tab }: { st: GameState; tab: string }) {
  if (tab === 'wars') return <Wars st={st} />;
  return <Forces st={st} />;
}

function Forces({ st }: { st: GameState }) {
  const id = viewedId(st); const c = st.countries[id]; const mine = canCommand(st, id); const h = st.history[id] ?? [];
  const [army, setArmy] = useState(Math.round(c.army.target)); const [navy, setNavy] = useState(Math.round(c.navy.target));
  const [ref, w] = useWidth<HTMLDivElement>();
  const rivalsTop = Object.values(st.countries).filter((x) => x.alive && !x.decentralized).sort((a, b) => armyStrength(st, b) - armyStrength(st, a));
  const top = rivalsTop.slice(0, 8); if (!top.some((x) => x.id === id)) top.push(c);
  const maxS = armyStrength(st, top[0]) || 1;
  const f = c.finance;
  return (
    <div class="pad" ref={ref}>
      <div class="metrics">
        <Metric label="Lục quân" icon="army" value={compact(c.army.manpower)} d={<span class="dim">mục tiêu {compact(c.army.target)}</span>} spark={h.map((x) => x.army)} />
        <Metric label="Sức mạnh hiệu dụng" icon="military" value={compact(armyStrength(st, c))} d={<span class="dim">hạng #{rivalsTop.findIndex((x) => x.id === id) + 1}</span>} tip={{ title: 'Sức mạnh hiệu dụng', lines: [['Quân số', compact(c.army.manpower)], ['Chất lượng', fmt(c.army.quality, 2)], ['Tinh thần', pct(c.army.morale)], ['Tiếp tế', pct(c.army.supply)]], note: 'Quân số × chất lượng × tiếp tế × tinh thần, cộng hiệu ứng công nghệ.' }} />
        <Metric label="Hải quân" icon="navy" value={`${fmt(c.navy.strength)} tàu`} d={<span class="dim">mục tiêu {fmt(c.navy.target)}</span>} />
        <Metric label="Chi quân sự / tháng" icon="treasury" value={f ? `¤ ${compact(f.army + f.navy)}` : '—'} d={f && c.expense ? <span class="dim">{pct((f.army + f.navy) / c.expense)} tổng chi</span> : <span class="dim">sau tháng đầu</span>} />
      </div>
      <div class="cols c2">
        <Sec title="Lục quân">
          <div class="kv"><span class="k">Quân số / mục tiêu</span><span class="v num">{compact(c.army.manpower)} / {compact(c.army.target)}</span></div>
          <div class="gauge"><span>Chất lượng</span><Bar frac={c.army.quality / 2} /><b class="num">{fmt(c.army.quality, 2)}</b></div>
          <div class="gauge"><span>Tinh thần</span><Bar frac={c.army.morale} color="var(--pos)" /><b class="num">{pct(c.army.morale)}</b></div>
          <div class="gauge"><span>Tiếp tế</span><Bar frac={c.army.supply} color="var(--info)" /><b class="num">{pct(c.army.supply)}</b></div>
          <div class="kv"><span class="k">Mệt mỏi chiến tranh</span><span class="v num">{fmt(c.warExhaustion)}</span></div>
        </Sec>
        <Sec title="Hải quân">
          <div class="kv"><span class="k">Số tàu / mục tiêu</span><span class="v num">{fmt(c.navy.strength)} / {fmt(c.navy.target)}</span></div>
          <div class="gauge"><span>Chất lượng</span><Bar frac={c.navy.quality / 2} /><b class="num">{fmt(c.navy.quality, 2)}</b></div>
          <div class="kv"><span class="k">Sức mạnh hải quân</span><span class="v num">{fmt(navalStrength(c))}</span></div>
          <div class="kv"><span class="k">Chi hải quân / tháng</span><span class="v num">{f ? `¤ ${compact(f.navy)}` : '—'}</span></div>
        </Sec>
      </div>
      {mine && (
        <Sec title="Mục tiêu lực lượng">
          <div class="slider-row"><div class="lab"><span>Quân số mục tiêu</span><b class="num">{compact(army)}</b></div>
            <input type="range" aria-label="Quân số mục tiêu" min={0} max={Math.max(50000, Math.round(c.stats.pop * 0.03))} step={1000} value={army} onInput={(e) => setArmy(Number((e.target as HTMLInputElement).value))} onChange={() => send({ type: 'set_army_target', manpower: army }, `Quân số mục tiêu: ${compact(army)}`)} /></div>
          <div class="slider-row"><div class="lab"><span>Số tàu mục tiêu</span><b class="num">{fmt(navy)}</b></div>
            <input type="range" aria-label="Số tàu mục tiêu" min={0} max={Math.max(50, Math.round(c.navy.strength * 3 + 50))} step={1} value={navy} onInput={(e) => setNavy(Number((e.target as HTMLInputElement).value))} onChange={() => send({ type: 'set_navy_target', ships: navy }, `Số tàu mục tiêu: ${fmt(navy)}`)} /></div>
          <div class="note">Lực lượng tăng hoặc giảm dần về mục tiêu mỗi tháng; chi phí trả từ ngân khố.</div>
        </Sec>
      )}
      <Sec title="Các lục quân mạnh nhất" x="sức mạnh hiệu dụng">
        <table class="dt">
          <thead><tr><th>Quốc gia</th><th>Sức mạnh</th>{w >= 420 && <th class="r">Quân số</th>}<th class="r">Tàu</th></tr></thead>
          <tbody>{top.map((x) => (
            <tr key={x.id} class={x.id === id ? 'on' : ''} style="cursor:default">
              <td><span class="cell-ic"><Flag c={x} sm /><span class="nm">{shortName(st, x.id)}</span></span></td>
              <td style="min-width:110px"><div class="bal"><span class="bar" style="width:64px"><i style={`width:${(armyStrength(st, x) / maxS) * 100}%`} /></span><span class="num">{compact(armyStrength(st, x))}</span></div></td>
              {w >= 420 && <td class="r num">{compact(x.army.manpower)}</td>}<td class="r num">{fmt(x.navy.strength)}</td>
            </tr>))}</tbody>
        </table>
      </Sec>
      <Sec title="Lục quân theo năm"><LineChart years={h.map((x) => x.y)} series={[{ name: 'Lục quân', color: '#b98a7a', values: h.map((x) => x.army) }]} fmtY={compact} height={110} /></Sec>
    </div>
  );
}

function Wars({ st }: { st: GameState }) {
  const id = viewedId(st);
  const inv = (w: War) => w.attackers.members.includes(id) || w.defenders.members.includes(id);
  const wars = [...st.wars].sort((a, b) => Number(inv(b)) - Number(inv(a)) || a.start - b.start);
  if (!wars.length) return <div class="pad"><div class="empty">Thế giới đang hòa bình.</div></div>;
  return <div class="pad">{wars.map((w) => <WarCard key={w.id} st={st} w={w} ours={inv(w)} />)}</div>;
}
function WarCard({ st, w, ours }: { st: GameState; w: War; ours: boolean }) {
  const id = viewedId(st); const mine = canCommand(st, id);
  const months = st.tick - w.start; const years = Math.floor(months / 12);
  const side = (members: string[], leader: string, ex: number, label: string) => (
    <div class="side">
      <div class="sl">{label}</div>
      {members.map((m) => <div key={m} class="sm-row"><CountryLink st={st} id={m} />{m === leader && <span class="dim"> · dẫn đầu</span>}</div>)}
      <div class="gauge"><span>Mệt mỏi</span><Bar frac={ex / 100} color="var(--neg)" /><b class="num">{fmt(ex)}</b></div>
    </div>
  );
  return (
    <section class={`warcard${ours ? ' ours' : ''}`}>
      <header><Icon name="military" /><h4>{w.name}</h4><span class="ctx">{KIND[w.kind] ?? w.kind}{ours ? ' · ta tham chiến' : ''}</span></header>
      <div class="sides">
        {side(w.attackers.members, w.attackers.leader, w.exhaustion.a, 'Tấn công')}
        {side(w.defenders.members, w.defenders.leader, w.exhaustion.d, 'Phòng thủ')}
      </div>
      <div class="score">
        <span class="num">{w.score > 0 ? '+' : ''}{fmt(w.score)}</span>
        <DBar v={w.score / 100} w={180} />
        <span class="s">{w.score > 10 ? 'bên tấn công thắng thế' : w.score < -10 ? 'bên phòng thủ thắng thế' : 'giằng co'}</span>
      </div>
      <div class="kv"><span class="k">Mục tiêu chiến tranh</span><span class="v" style="white-space:normal">{w.goals.length ? w.goals.map((g, i) => <span key={i}>{i > 0 && '; '}{shortName(st, g.by)}: {GOAL[g.type] ?? g.type.replace(/_/g, ' ')} {shortName(st, g.target)}{g.regions?.length ? ` (${g.regions.slice(0, 3).map(regionName).join(', ')}${g.regions.length > 3 ? '…' : ''})` : ''}</span>) : '—'}</span></div>
      <div class="kv"><span class="k">Thời gian · trận đánh</span><span class="v num">{years} năm {months % 12} tháng · {w.battles} trận</span></div>
      {w.occupied.length > 0 && <div class="kv"><span class="k">Vùng bị chiếm ({w.occupied.length})</span><span class="v links">{w.occupied.slice(0, 8).map((r) => <a key={r} class="lnk" onClick={() => focusRegion(r)}>{regionName(r)}</a>)}{w.occupied.length > 8 ? '…' : ''}</span></div>}
      {ours && mine && <div class="btns" style="margin-top:8px"><button class="btn sm" onClick={() => send({ type: 'offer_white_peace', war: w.id }, 'Đã gửi đề nghị hòa trắng')}>Đề nghị hòa trắng</button></div>}
    </section>
  );
}
export const MILITARY_TABS: [string, string][] = [['forces', 'Lực lượng'], ['wars', 'Chiến tranh']];
