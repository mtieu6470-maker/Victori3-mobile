// Military: forces (targets set through the engine) and wars (score, occupation, white peace).
import { useState } from 'preact/hooks';
import type { GameState } from '../../engine/types';
import { armyStrength, navalStrength } from '../../engine/systems/military';
import { Section, Stat, DBar } from '../components/ui';
import { fmt, pct, compact } from '../i18n/vi';
import { shortName } from '../game/names';
import { data } from '../../engine/data/db';
import { viewedId, canCommand, send, CountryLink } from './common';
import { mapControls } from '../map/MapView';
import { ui } from '../game/ui';

const KIND: Record<string, string> = { conquest: 'Chiến tranh xâm chiếm', civil: 'Nội chiến', colonial: 'Chiến tranh thuộc địa', independence: 'Chiến tranh giành độc lập', great: 'Đại chiến' };
export function MilitaryScreen({ st, tab }: { st: GameState; tab: string }) {
  const id = viewedId(st); const c = st.countries[id]; const mine = canCommand(st, id);
  const [army, setArmy] = useState(Math.round(c.army.target)); const [navy, setNavy] = useState(Math.round(c.navy.target));
  if (tab === 'wars') {
    const wars = [...st.wars].sort((a, b) => Number(b.attackers.members.includes(id) || b.defenders.members.includes(id)) - Number(a.attackers.members.includes(id) || a.defenders.members.includes(id)));
    if (!wars.length) return <div class="empty">Thế giới đang hòa bình.</div>;
    return (
      <div>
        {wars.map((w) => {
          const ours = w.attackers.members.includes(id) || w.defenders.members.includes(id); const weAtt = w.attackers.members.includes(id);
          const years = Math.floor((st.tick - w.start) / 12), months = (st.tick - w.start) % 12;
          return (
            <Section key={w.id} title={w.name} left extra={ours ? 'TA THAM CHIẾN' : KIND[w.kind] ?? ''}>
              <div class="plate">
                <div class="rowline" style="flex-wrap:wrap"><span class="dim" style="width:76px">Tấn công</span><span class="grow" style="display:flex;gap:8px;flex-wrap:wrap">{w.attackers.members.map((m) => <CountryLink st={st} id={m} key={m} />)}</span></div>
                <div class="rowline" style="flex-wrap:wrap"><span class="dim" style="width:76px">Phòng thủ</span><span class="grow" style="display:flex;gap:8px;flex-wrap:wrap">{w.defenders.members.map((m) => <CountryLink st={st} id={m} key={m} />)}</span></div>
                <div class="rowline"><span class="grow">Điểm chiến tranh (+ = bên tấn công thắng thế)</span><span class="num" style="margin-right:6px">{w.score > 0 ? '+' : ''}{fmt(w.score)}</span><DBar v={w.score / 100} /></div>
                <div class="rowline"><span class="grow">Thời gian · trận đánh · vùng bị chiếm</span><span class="num">{years} năm {months} th · {w.battles} · {w.occupied.length}</span></div>
                <div class="rowline"><span class="grow">Mệt mỏi chiến tranh (tấn công / phòng thủ)</span><span class="num">{fmt(w.exhaustion.a)} / {fmt(w.exhaustion.d)}</span></div>
                {w.occupied.length > 0 && <div class="note">Bị chiếm: {w.occupied.slice(0, 8).map((r) => <a key={r} style="color:var(--brass-hi);cursor:pointer;margin-right:8px" onClick={() => { ui.set({ region: r }); mapControls.focusRegion(r); }}>{data().region.get(r)?.name ?? r}</a>)}{w.occupied.length > 8 ? '…' : ''}</div>}
                {ours && mine && <div class="btns" style="margin-top:6px"><button class="btn" onClick={() => send({ type: 'offer_white_peace', war: w.id }, 'Đã gửi đề nghị hòa trắng')}>Đề nghị hòa trắng</button></div>}
                {void weAtt}
              </div>
            </Section>
          );
        })}
      </div>
    );
  }
  return (
    <div>
      <div class="plates c2">
        <Stat label="Lục quân" icon="army" value={compact(c.army.manpower)} sub={`mục tiêu ${compact(c.army.target)}`} />
        <Stat label="Sức mạnh hiệu dụng" icon="military" value={compact(armyStrength(st, c))} sub="quân số × chất lượng × tiếp tế × tinh thần" />
        <Stat label="Chất lượng · tinh thần" icon="prestige" value={`${fmt(c.army.quality, 2)} · ${pct(c.army.morale)}`} sub={`Tiếp tế ${pct(c.army.supply)}`} />
        <Stat label="Hải quân" icon="navy" value={`${fmt(c.navy.strength)} tàu`} sub={`chất lượng ${fmt(c.navy.quality, 2)} · sức mạnh ${fmt(navalStrength(c))}`} />
      </div>
      {mine && <Section title="Mục tiêu lực lượng">
        <div class="rowline" style="flex-wrap:wrap"><span class="grow">Quân số mục tiêu</span><b class="num">{compact(army)}</b>
          <input type="range" min={0} max={Math.max(50000, Math.round(c.stats.pop * 0.03))} step={1000} value={army} onInput={(e) => setArmy(Number((e.target as HTMLInputElement).value))} onChange={() => send({ type: 'set_army_target', manpower: army }, `Quân số mục tiêu: ${compact(army)}`)} /></div>
        <div class="rowline" style="flex-wrap:wrap"><span class="grow">Số tàu mục tiêu</span><b class="num">{fmt(navy)}</b>
          <input type="range" min={0} max={Math.max(50, Math.round(c.navy.strength * 3 + 50))} step={1} value={navy} onInput={(e) => setNavy(Number((e.target as HTMLInputElement).value))} onChange={() => send({ type: 'set_navy_target', ships: navy }, `Số tàu mục tiêu: ${fmt(navy)}`)} /></div>
        <div class="note">Lực lượng tăng/giảm dần về mục tiêu mỗi tháng; chi phí trả từ ngân khố.</div>
      </Section>}
      <Section title="So sánh với các cường quốc">
        {Object.values(st.countries).filter((x) => x.alive && !x.decentralized && x.id !== id).sort((a, b) => armyStrength(st, b) - armyStrength(st, a)).slice(0, 8).map((x) => (
          <div class="rowline" key={x.id}><span class="grow"><CountryLink st={st} id={x.id} /></span><span class="num" style="width:90px;text-align:right">{compact(x.army.manpower)} quân</span><span class="num dim" style="width:70px;text-align:right">{fmt(x.navy.strength)} tàu</span></div>
        ))}
      </Section>
      {void shortName}
    </div>
  );
}
export const MILITARY_TABS: [string, string][] = [['forces', 'Lực lượng'], ['wars', 'Chiến tranh']];
