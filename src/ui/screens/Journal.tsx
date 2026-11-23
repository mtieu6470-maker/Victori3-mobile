// Journal: historical decision windows (Historical Mode), event log, territorial changes, comparison with real history.
import { useState } from 'preact/hooks';
import type { GameState } from '../../engine/types';
import { data } from '../../engine/data/db';
import { Sec, Metric, Seg, LineChart, modals, useWidth } from '../components/ui';
import { Icon } from '../components/icons';
import { LOG_TYPE_VI, GROUP_VI, lawVi, pct } from '../i18n/vi';
import { shortName } from '../game/names';
import { viewedId, send, canCommand, Flag, focusRegion, regionName, LOG_ICON } from './common';
import { game } from '../game/controller';
import type { LawGroup } from '../../engine/data/dbTypes';
import { journalGoals, regimeEvent, regimeEntryKind } from '../../engine/systems/regimes';
import { decolRecord } from '../../engine/systems/decolonisation';
import { PRINCIPLE_VI, JoinPreview } from './PowerBlocs';
import { MOVEMENT_ACTIONS, MovementDetail } from './SubjectsPanel';
import { lawUnlocked, LAW_TECH } from '../../engine/laws';
import { techName } from '../i18n/vi';

// UI copy for the decision windows defined in the Historical Database (titles are not stored in the database).
export const DW_TITLE: Record<string, string> = {
  dw_belgium_recognition: 'Công nhận nền độc lập của Bỉ', dw_tanzimat: 'Chiếu chỉ Gülhane (Tanzimat)', dw_ottoman_reform_edict: 'Chiếu cải cách 1856', dw_corn_laws: 'Luật Ngũ cốc (Corn Laws)',
  dw_french_abolition: 'Bãi bỏ chế độ nô lệ ở thuộc địa Pháp', dw_danish_abolition: 'Bãi bỏ nô lệ ở Tây Ấn Đan Mạch', dw_austrian_robot: 'Bãi bỏ lao dịch (Robot) ở Áo', dw_prussian_constitution: 'Hiến pháp Phổ',
  dw_statuto_albertino: 'Hiến chương Albertino', dw_danish_june_constitution: 'Hiến pháp tháng Sáu của Đan Mạch', dw_dutch_constitution: 'Hiến pháp Thorbecke', dw_russian_emancipation: 'Giải phóng nông nô ở Nga',
  dw_japan_opening: 'Mở cửa Nhật Bản', dw_meiji_restoration: 'Minh Trị Duy tân', dw_siam_bowring: 'Hiệp ước Bowring', dw_us_emancipation: 'Tuyên ngôn Giải phóng nô lệ', dw_brazil_golden_law: 'Luật Vàng (Lei Áurea)',
  dw_romanian_union: 'Thống nhất Moldavia và Wallachia', dw_swiss_federal: 'Hiến pháp Liên bang Thụy Sĩ',
};
const OPTION_VI: Record<string, string> = {
  recognise: 'Công nhận', refuse: 'Từ chối', proclaim_gulhane: 'Ban hành chiếu chỉ', defer: 'Trì hoãn', islahat_fermani: 'Ban hành chiếu cải cách', repeal: 'Bãi bỏ', keep: 'Giữ nguyên', abolish: 'Bãi bỏ',
  abolish_robot: 'Bãi bỏ lao dịch', repress: 'Đàn áp', octroyed_constitution: 'Ban hành hiến pháp', grant_statuto: 'Ban hành hiến chương', june_constitution: 'Ban hành hiến pháp', thorbecke_constitution: 'Sửa đổi hiến pháp',
  emancipate: 'Giải phóng', postpone: 'Hoãn lại', sign_kanagawa: 'Ký hiệp ước', resist: 'Kháng cự', restoration: 'Phục hồi vương quyền', shogunate_reform: 'Cải cách Mạc phủ', sign_bowring: 'Ký hiệp ước', compromise: 'Thỏa hiệp',
  lei_aurea: 'Ký Luật Vàng', delay: 'Trì hoãn', elect_cuza: 'Bầu Cuza làm vương công chung', separate: 'Giữ hai công quốc riêng', federal_constitution: 'Thông qua hiến pháp', keep_pact: 'Giữ Hiệp ước Liên bang',
};
const effText = (e: any) => e.type === 'set_law' ? `${GROUP_VI[e.group as LawGroup] ?? e.group} → ${lawVi(e.value)}` : e.type === 'relation' ? `Quan hệ ${shortName(null, e.a)}–${shortName(null, e.b)} ${e.delta > 0 ? '+' : ''}${e.delta}` : e.type === 'transfer_region' ? `Chuyển vùng ${data().region.get(e.region)?.name ?? e.region}` : e.type === 'drop_claims' ? 'Từ bỏ yêu sách lãnh thổ' : e.type.replace(/_/g, ' ');

export function JournalScreen({ st, tab }: { st: GameState; tab: string }) {
  if (tab === 'log') return <LogTab st={st} />;
  if (tab === 'territory') return <TerritoryTab st={st} />;
  if (tab === 'history') return <HistoryTab st={st} />;
  return <Decisions st={st} />;
}

const EVENT_TYPE_VI: Record<string, string> = {
  authoritarian_takeover: 'Chính quyền độc tài lên nắm quyền', civil_war_victory_and_dictatorship: 'Thắng nội chiến, lập chế độ độc tài', constitution: 'Hiến pháp mới',
  constitution_and_centralisation: 'Hiến pháp và tập trung quyền lực', constitution_and_democratic_transition: 'Hiến pháp và chuyển đổi dân chủ', constitution_and_regime_change: 'Hiến pháp và đổi chế độ',
  constitution_and_socialisation: 'Hiến pháp và xã hội hóa', constitutional_amendment: 'Sửa đổi hiến pháp', constitutional_coup: 'Đảo chính hiến pháp', constitutional_reform: 'Cải cách hiến pháp',
  constitutional_reform_and_womens_suffrage: 'Cải cách hiến pháp, phụ nữ được bầu cử', coup_and_regime_change: 'Đảo chính và đổi chế độ', federal_union_formation: 'Thành lập liên bang',
  independence: 'Độc lập', independence_and_state_formation: 'Độc lập và lập quốc', independence_declaration: 'Tuyên bố độc lập', political_transition: 'Chuyển đổi chính trị',
  referendum_and_regime_change: 'Trưng cầu dân ý và đổi chế độ', reform_process: 'Tiến trình cải cách', regime_change: 'Đổi chế độ', revolution: 'Cách mạng',
  revolution_and_abdication: 'Cách mạng và thoái vị', revolution_and_government_seizure: 'Cách mạng giành chính quyền', revolution_and_regime_change: 'Cách mạng và đổi chế độ',
  revolution_and_state_centralisation: 'Cách mạng và tập trung nhà nước', revolution_and_state_formation: 'Cách mạng và lập quốc', social_policy_reform: 'Cải cách chính sách xã hội',
  social_reform_and_law_change: 'Cải cách xã hội và đổi luật', state_restoration_and_independence: 'Khôi phục nhà nước và độc lập', unification: 'Thống nhất', welfare_state_reform: 'Cải cách nhà nước phúc lợi',
};
const monthYear = (t: number) => `${String((t % 12) + 1).padStart(2, '0')}/${1836 + Math.floor(t / 12)}`;

/** REGIME-02: V3-style journal entries — a historical regime change the player enacts through reforms. */
function Missions({ st, id, mine }: { st: GameState; id: string; mine: boolean }) {
  const all = (st.journal ?? []).filter((j) => j.country === id);
  if (!all.length) return null;
  const active = all.filter((j) => j.status === 'active'); const past = all.filter((j) => j.status !== 'active');
  const c = st.countries[id];
  return (
    <>
      {active.map((j) => {
        if (j.kind === 'bloc_invite') {
          const pb = st.powerBlocs?.[j.event]; if (!pb) return null;
          return (
            <section class="journal news" key={j.id}>
              <div class="masthead"><span>Ngoại giao</span><span>{monthYear(j.started)}</span></div>
              <header><Icon name="scroll" /><h4>Lời mời gia nhập {pb.name}</h4><span class="ctx">hạn {monthYear(j.expires)}</span></header>
              <div class="s">{shortName(st, pb.leader)} mời bạn vào khối ({pb.members.length} thành viên, độ gắn kết {Math.round(pb.cohesion)}). Nguyên tắc: {Object.keys(pb.principles).map((g) => `${PRINCIPLE_VI[g]?.[0] ?? g} ${['', 'I', 'II', 'III'][pb.principles[g]] ?? ''}`).join(', ') || 'chưa có'}.</div>
              <JoinPreview st={st} b={pb} id={j.country} />
              {mine && <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
                <button class="btn sm" onClick={() => send({ type: 'journal', entry: j.id, action: 'complete' }, `Gia nhập ${pb.name}`)}>Gia nhập</button>
                <button class="btn sm" onClick={() => send({ type: 'journal', entry: j.id, action: 'abandon' }, 'Từ chối')}>Từ chối</button>
              </div>}
            </section>
          );
        }
        if (j.kind === 'independence_movement') {
          const m = st.movements?.[j.event]; if (!m) return null;
          return (
            <section class="journal news" key={j.id}>
              <div class="masthead"><span>Thuộc địa</span><span>{monthYear(j.started)}</span></div>
              <header><Icon name="scroll" /><h4>Phong trào độc lập của người {m.nation}</h4><span class="ctx">hạn {monthYear(j.expires)}</span></header>
              <MovementDetail st={st} k={j.event} />
              {mine && <div style="margin-top:8px;display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:6px">
                {MOVEMENT_ACTIONS.map(([a, label, sub]) => <button key={a} class={`btn sm${a === 'repress' || a === 'refuse' ? ' danger' : ''}`} style="text-align:left;white-space:normal" onClick={() => send(a === 'refuse' ? { type: 'journal', entry: j.id, action: 'abandon' } : { type: 'movement', key: j.event, action: a }, `${label}: người ${m.nation}`)}><b>{label}</b><br /><span class="s">{sub}</span></button>)}
              </div>}
            </section>
          );
        }
        if (j.kind === 'subject_request') {
          const c = st.countries[j.event]; if (!c) return null;
          return (
            <section class="journal news" key={j.id}>
              <div class="masthead"><span>Chư hầu</span><span>{monthYear(j.started)}</span></div>
              <header><Icon name="scroll" /><h4>{shortName(st, c.id)} đòi được tự trị hơn</h4><span class="ctx">hạn {monthYear(j.expires)}</span></header>
              <div class="s">Mong muốn tự do của {shortName(st, c.id)} đã lên {Math.round(c.subjectPact?.liberty ?? 0)}. Chấp nhận: lên loại chư hầu tự trị hơn, mong muốn tự do −30. Từ chối (hoặc để quá hạn): mong muốn tự do +10; nếu lên 90 và giữ một năm, họ có thể nổi dậy giành độc lập.</div>
              {mine && <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
                <button class="btn sm" onClick={() => send({ type: 'journal', entry: j.id, action: 'complete' }, `Cho ${shortName(st, c.id)} tự trị hơn`)}>Chấp nhận</button>
                <button class="btn sm danger" onClick={() => send({ type: 'journal', entry: j.id, action: 'abandon' }, 'Từ chối')}>Từ chối</button>
              </div>}
            </section>
          );
        }
        if (j.kind === 'call_to_arms') {
          const w = st.wars.find((x) => x.id === j.event); if (!w) return null;
          const def = w.defenders.leader; const att = w.attackers.leader;
          return (
            <section class="journal news" key={j.id}>
              <div class="masthead"><span>Khẩn cấp</span><span>{monthYear(j.started)}</span></div>
              <header><Icon name="scroll" /><h4>Lời kêu gọi tham chiến: {shortName(st, def)}</h4><span class="ctx">hạn {monthYear(j.expires)}</span></header>
              <div class="s">Đồng minh của bạn, {shortName(st, def)}, bị {shortName(st, att)} tấn công ({w.name}). Phe tấn công: {w.attackers.members.map((m) => shortName(st, m)).join(', ')}. Phe phòng thủ: {w.defenders.members.map((m) => shortName(st, m)).join(', ')}.</div>
              <div class="s">Tham chiến: bạn vào phe phòng thủ. Từ chối (hoặc để quá hạn): quan hệ với {shortName(st, def)} giảm mạnh và liên minh song phương tan vỡ (khối liên minh như NATO vẫn còn).</div>
              {mine && <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
                <button class="btn sm" onClick={() => send({ type: 'journal', entry: j.id, action: 'complete' }, `Tham chiến bảo vệ ${shortName(st, def)}`)}>Tham chiến</button>
                <button class="btn sm" onClick={() => send({ type: 'journal', entry: j.id, action: 'abandon' }, 'Từ chối lời kêu gọi')}>Từ chối</button>
              </div>}
            </section>
          );
        }
        if (j.kind === 'decolonisation') {
          const rec = decolRecord(j.event); if (!rec) return null;
          return (
            <section class="journal news" key={j.id}>
              <div class="masthead"><span>Tin tức</span><span>{monthYear(j.started)}</span></div>
              <header><Icon name="scroll" /><h4>Phong trào độc lập: {rec.name_vi}</h4><span class="ctx">hạn {monthYear(j.expires)}</span></header>
              <div class="s">Theo lịch sử, {rec.name_vi} giành độc lập ngày {rec.date.split('-').reverse().join('/')}. Quyền quyết định thuộc về bạn: trao độc lập (nước mới đình chiến 2 năm với bạn), hoặc giữ thuộc địa — dân cực đoan ở đó tăng và vùng đất có thể nổi dậy ly khai.</div>
              {mine && <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
                <button class="btn sm" onClick={() => send({ type: 'journal', entry: j.id, action: 'complete' }, `Trao độc lập cho ${rec.name_vi}`)}>Trao độc lập</button>
                <button class="btn sm" onClick={() => send({ type: 'journal', entry: j.id, action: 'abandon' }, `Giữ ${rec.name_vi}`)}>Giữ thuộc địa</button>
              </div>}
            </section>
          );
        }
        const e = regimeEvent(j.event); if (!e) return null;
        const goals = journalGoals(st, j); const done = goals.filter((g) => g.done).length; const kind = regimeEntryKind(e);
        return (
          <section class="journal news" key={j.id}>
            <div class="masthead"><span>Tin tức</span><span>{monthYear(j.started)}</span></div>
            <header><Icon name="scroll" /><h4>{e.name_vi}</h4><span class="ctx">hạn {monthYear(j.expires)}</span></header>
            <div class="s">{EVENT_TYPE_VI[e.type] ?? e.type.replace(/_/g, ' ')} · sự kiện lịch sử ngày {e.date.split('-').reverse().join('/')}{e.rename ? ` · nước sẽ đổi tên thành ${e.name_vi}` : ''}</div>
            {e.independence
              ? <div class="s">Công nhận nền độc lập: các vùng có văn hóa {e.independence.join(', ')} sẽ tách thành một nước mới. Nước cũ từ bỏ yêu sách lãnh thổ, hai bên đình chiến 2 năm.</div>
              : <>
                  <div class="s">{kind === 'reform'
                    ? 'Để chế độ này ra đời như trong lịch sử, hãy thông qua các luật sau bằng cải cách. Khi đủ luật, quốc gia đổi chính thể, đổi tên và có người đứng đầu mới (+10 chính danh).'
                    : 'Biến cố này (cách mạng, đảo chính, thống nhất…) áp đặt cùng lúc các luật dưới đây khi được tiến hành. Cũng có thể đi từng bước bằng cải cách: đủ luật thì chế độ mới ra đời (+10 chính danh).'}</div>
                  <div class="pbar" style="margin:6px 0"><i style={`width:${goals.length ? (done / goals.length) * 100 : 0}%`} /></div>
                  {goals.map((g) => {
                    const locked = !lawUnlocked(c, g.value);
                    return (
                      <div class="option" key={g.group}>
                        <div class="oh"><span class="ot">{g.done ? '✓ ' : ''}{GROUP_VI[g.group] ?? g.group}: {lawVi(g.value)}</span>{g.done ? <span class="tag up">Đã có</span> : <span class="tag flat">hiện: {lawVi(c.laws[g.group])}</span>}</div>
                        {!g.done && locked && <div class="s">Cần công nghệ: {techName(LAW_TECH[g.value])}</div>}
                        {!g.done && mine && <div style="margin-top:6px"><button class="btn sm" disabled={!!c.reform || locked} onClick={() => send({ type: 'start_reform', group: g.group, value: g.value }, `Bắt đầu cải cách: ${lawVi(g.value)}`)}>{c.reform?.group === g.group && c.reform.value === g.value ? 'Đang cải cách' : 'Bắt đầu cải cách'}</button></div>}
                      </div>
                    );
                  })}
                </>}
            {mine && <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
              {kind === 'independence' && <button class="btn sm" onClick={() => send({ type: 'journal', entry: j.id, action: 'complete' }, `Công nhận ${e.name_vi}`)}>Công nhận độc lập</button>}
              {kind === 'proclaim' && <button class="btn sm" onClick={() => send({ type: 'journal', entry: j.id, action: 'complete' }, `Tiến hành: ${e.name_vi}`)}>Tiến hành</button>}
              <button class="btn sm" onClick={() => send({ type: 'journal', entry: j.id, action: 'abandon' }, 'Giữ chế độ hiện tại')}>Giữ chế độ hiện tại</button>
            </div>}
          </section>
        );
      })}
      {past.length > 0 && <Sec title="Nhiệm vụ đã kết thúc" x={`${past.length}`}>
        {past.map((j) => <div class="kv" key={j.id}><span class="k">{j.kind === 'bloc_invite' ? 'Lời mời gia nhập khối' : j.kind === 'independence_movement' ? `Phong trào độc lập: ${j.event.split('|')[0]}` : j.kind === 'subject_request' ? `Chư hầu đòi tự trị: ${shortName(st, j.event)}` : j.kind === 'call_to_arms' ? 'Lời kêu gọi tham chiến' : j.kind === 'decolonisation' ? `Độc lập: ${decolRecord(j.event)?.name_vi ?? j.event}` : regimeEvent(j.event)?.name_vi ?? j.event}</span><span class="v">{{ completed: 'Hoàn thành', expired: 'Hết thời cơ', abandoned: 'Đã từ bỏ', active: '' }[j.status]}{j.ended !== undefined ? ` · ${monthYear(j.ended)}` : ''}</span></div>)}
      </Sec>}
    </>
  );
}

function Decisions({ st }: { st: GameState }) {
  const id = viewedId(st); const pend = st.pendingPlayerDecisions; const mine = canCommand(st, id);
  const windows = data().db.decision_windows.filter((w) => w.entity === id);
  const now = `${st.date.y}-${String(st.date.m).padStart(2, '0')}`;
  const status = (w: (typeof windows)[number]) => (pend.some((p) => p.windowId === w.id) ? ['Đang chờ quyết định', 'warn'] : st.firedEvents.includes(w.id) ? ['Đã diễn ra', 'flat'] : now > w.window[1].slice(0, 7) ? ['Đã đóng', 'flat'] : now < w.window[0].slice(0, 7) ? ['Chưa mở', 'flat'] : ['Đang mở — chờ điều kiện', 'up']);
  return (
    <div class="pad">
      <Missions st={st} id={id} mine={mine} />
      {st.mode === 'sandbox' && <div class="banner"><Icon name="scroll" /><div class="grow">Sandbox không có cửa sổ quyết định lịch sử; biến cố xuất hiện theo cùng hệ thống mô phỏng.</div></div>}
      {pend.map((p) => { const w = data().db.decision_windows.find((x) => x.id === p.windowId); if (!w) return null; return (
        <section class="journal" key={p.id}>
          <header><Icon name="scroll" /><h4>{DW_TITLE[w.id] ?? w.id}</h4><span class="ctx">hạn {w.window[1].slice(0, 7)}</span></header>
          <div class="s">Cửa sổ quyết định lịch sử của {shortName(st, w.entity)} · mở {w.window[0].slice(0, 7)} · sự kiện thực tế {w.date_historical}</div>
          {w.options.map((o) => (
            <div class="option" key={o.id}>
              <div class="oh"><span class="ot">{OPTION_VI[o.id] ?? o.id.replace(/_/g, ' ')}</span><span class={`tag ${o.historical ? 'up' : 'flat'}`}>{o.historical ? 'Đã xảy ra trong lịch sử' : 'Rẽ nhánh'}</span></div>
              <div class="s">{o.effects.length ? o.effects.map(effText).join(' · ') : 'Không thay đổi luật'}</div>
              {mine && <div style="margin-top:6px"><button class="btn sm" onClick={() => send({ type: 'decide', pendingId: p.id, option: o.id }, `Đã quyết định: ${OPTION_VI[o.id] ?? o.id}`)}>Chọn</button></div>}
            </div>
          ))}
        </section>); })}
      {!pend.length && !(st.journal ?? []).some((j) => j.status === 'active' && j.country === id) && <div class="empty sm">Không có nhiệm vụ hay quyết định nào đang chờ.</div>}
      {windows.length > 0 && <Sec title="Cửa sổ quyết định của quốc gia" x={`${windows.length}`}>
        <table class="dt"><thead><tr><th>Quyết định</th><th class="r">Cửa sổ</th><th class="r">Trạng thái</th></tr></thead>
          <tbody>{windows.map((w) => { const [t, cls] = status(w); return <tr key={w.id} style="cursor:default"><td style="white-space:normal"><div class="nm">{DW_TITLE[w.id] ?? w.id}</div><div class="sub">lịch sử: {w.date_historical}</div></td><td class="r num">{w.window[0].slice(0, 4)}–{w.window[1].slice(0, 4)}</td><td class="r"><span class={`tag ${cls}`}>{t}</span></td></tr>; })}</tbody></table>
        <div class="note">Cửa sổ chỉ mở khi điều kiện lịch sử thỏa mãn; phương án lịch sử không bị ép.</div>
      </Sec>}
    </div>
  );
}

function LogTab({ st }: { st: GameState }) {
  const id = viewedId(st); const [type, setType] = useState<string>('all'); const [mineOnly, setMineOnly] = useState<'mine' | 'world'>('mine');
  const types = ['all', 'war', 'diplomacy', 'law', 'succession', 'state', 'revolution'];
  const list = st.log.filter((l) => (type === 'all' || l.type === type) && (mineOnly === 'world' || l.actors.includes(id))).slice(-250).reverse();
  return (
    <div class="pad">
      <div class="toolrow">
        <Seg value={mineOnly} onChange={setMineOnly} options={[['mine', `Liên quan ${shortName(st, id)}`], ['world', 'Toàn thế giới']] as const} />
        <div class="chips">{types.map((t) => <button key={t} class={`chip${type === t ? ' on' : ''}`} onClick={() => setType(t)}>{t !== 'all' && <Icon name={LOG_ICON[t] ?? 'scroll'} />}{t === 'all' ? 'Tất cả' : LOG_TYPE_VI[t] ?? t}</button>)}</div>
      </div>
      {list.length ? list.map((l, i) => <div class="logline" key={i}><span class="dt">{l.date.slice(0, 7)}</span><span title={LOG_TYPE_VI[l.type] ?? l.type}><Icon name={LOG_ICON[l.type] ?? 'scroll'} /></span><span>{l.textVi ?? l.text}{l.divergence && <span class="warn" title="Khác với lịch sử thực"> ⑂</span>}{l.historical && <span class="pos" title="Trùng với lịch sử"> ✓</span>}</span></div>) : <div class="empty">Chưa có sự kiện nào.</div>}
      <div class="note">⑂ = khác với lịch sử thực · ✓ = trùng với lịch sử.</div>
    </div>
  );
}

function TerritoryTab({ st }: { st: GameState }) {
  const list = [...st.territoryLog].reverse().slice(0, 250); const [ref, w] = useWidth<HTMLDivElement>();
  if (!list.length) return <div class="pad"><div class="empty">Chưa có thay đổi lãnh thổ nào.</div></div>;
  return (
    <div class="pad" ref={ref}>
      <table class="dt">
        <thead><tr><th>Ngày</th><th>Vùng</th><th>Chuyển giao</th>{w >= 520 && <th>Nguyên nhân</th>}<th class="r">Lịch sử</th></tr></thead>
        <tbody>{list.map((t, i) => (
          <tr key={i} onClick={() => focusRegion(t.region)}>
            <td class="num dim">{t.date.slice(0, 7)}</td>
            <td><div class="nm ellipsis" style="max-width:180px">{regionName(t.region)}</div>{w < 520 && <div class="sub">{t.cause}</div>}</td>
            <td><span class="cell-ic"><Flag c={st.countries[t.from]} sm />{shortName(st, t.from)} → <Flag c={st.countries[t.to]} sm />{shortName(st, t.to)}</span></td>
            {w >= 520 && <td class="muted">{t.cause}</td>}
            <td class="r">{t.historicalMatch === true ? <span class="tag up">đúng</span> : t.historicalMatch === false ? <span class="tag warn">khác</span> : <span class="dim">—</span>}</td>
          </tr>))}</tbody>
      </table>
    </div>
  );
}

function HistoryTab({ st }: { st: GameState }) {
  const sim = st.divergence.similarity; const ms = data().db.milestones; const last = sim[sim.length - 1];
  const done = ms.filter((m) => st.divergence.milestones[m.id]?.status === 'achieved').length, missed = ms.filter((m) => st.divergence.milestones[m.id]?.status === 'missed').length;
  return (
    <div class="pad">
      <div class="note" style="margin-top:0">{st.mode === 'sandbox' ? 'Sandbox: so sánh chỉ để tham khảo, không tác động mô phỏng.' : 'Lịch sử: mô phỏng không bị ép theo lịch sử; đây là mức trùng khớp đo được.'}</div>
      <div class="metrics">
        <Metric label="Tương đồng lãnh thổ" value={last ? pct(last.territorial) : '—'} />
        <Metric label="Mốc đạt / lỡ" value={`${done} / ${missed}`} d={<span class="dim">trên {ms.length} mốc</span>} />
        <Metric label="Tổng hợp" value={last ? pct(last.combined) : '—'} />
      </div>
      <Sec title="Mức tương đồng theo thời gian">
        <LineChart years={sim.map((s) => Number(s.date.slice(0, 4)))} series={[{ name: 'Lãnh thổ', color: '#93bad6', values: sim.map((s) => s.territorial) }, { name: 'Mốc lịch sử', color: '#e3b65e', values: sim.map((s) => s.milestones) }, { name: 'Tổng hợp', color: '#93c47a', values: sim.map((s) => s.combined) }]} fmtY={(v) => pct(v)} />
      </Sec>
      <Sec title="Các mốc lịch sử" x={`${ms.length} mốc`}>
        <table class="dt"><thead><tr><th style="width:26px" /><th>Mốc</th><th class="r">Hạn</th></tr></thead>
          <tbody>{ms.map((m) => { const s = st.divergence.milestones[m.id]; const stt = s?.status ?? 'pending'; return <tr key={m.id} style="cursor:default"><td class={stt === 'achieved' ? 'pos' : stt === 'missed' ? 'neg' : 'dim'}>{stt === 'achieved' ? '✓' : stt === 'missed' ? '✗' : '·'}</td><td style="white-space:normal">{m.label}{s?.date && <div class="sub">{stt === 'achieved' ? 'đạt' : 'lỡ'} {s.date.slice(0, 7)}</div>}</td><td class="r num dim">{m.check_date.slice(0, 4)}</td></tr>; })}</tbody></table>
        <div class="note">Mô tả mốc hiển thị bằng tiếng Anh theo cơ sở dữ liệu.</div>
      </Sec>
    </div>
  );
}

/** Notification inbox: log entries involving the viewed country since the last time the inbox was opened. */
export function InboxScreen({ st }: { st: GameState }) {
  const id = viewedId(st); const since = game.readLogCount;
  const items = st.log.slice(since).filter((l) => l.actors.includes(id) || ['war', 'revolution', 'state'].includes(l.type)).reverse();
  return (
    <div>
      {items.length ? items.map((l, i) => <div class="logline" key={i}><span class="dt">{l.date.slice(0, 7)}</span><span title={LOG_TYPE_VI[l.type] ?? l.type}><Icon name={LOG_ICON[l.type] ?? 'scroll'} /></span><span>{l.textVi ?? l.text}</span></div>) : <div class="empty">Không có thông báo mới.</div>}
      <div class="btns" style="margin-top:10px"><button class="btn" onClick={() => { game.readLogCount = st.log.length; game.emit(); modals.close(); }}>Đánh dấu đã đọc</button></div>
    </div>
  );
}
export const JOURNAL_TABS: [string, string][] = [['decisions', 'Nhiệm vụ & quyết định'], ['log', 'Nhật ký'], ['territory', 'Lãnh thổ'], ['history', 'So với lịch sử']];
