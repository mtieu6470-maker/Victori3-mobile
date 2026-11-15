// Journal: historical decision windows (Historical Mode), event log, territorial changes, comparison with real history.
import { useState } from 'preact/hooks';
import type { GameState } from '../../engine/types';
import { data } from '../../engine/data/db';
import { Section, LineChart, modals } from '../components/ui';
import { Icon } from '../components/icons';
import { LOG_TYPE_VI, GROUP_VI, lawVi, pct } from '../i18n/vi';
import { shortName } from '../game/names';
import { viewedId, send, canCommand } from './common';
import { game } from '../game/controller';
import type { LawGroup } from '../../engine/data/dbTypes';

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
  const id = viewedId(st);
  const [type, setType] = useState<string>('all'); const [mineOnly, setMineOnly] = useState(true);
  if (tab === 'log') {
    const types = ['all', 'war', 'diplomacy', 'law', 'succession', 'state', 'revolution'];
    const list = st.log.filter((l) => (type === 'all' || l.type === type) && (!mineOnly || l.actors.includes(id))).slice(-200).reverse();
    return (
      <div>
        <div class="seg" style="margin-bottom:4px;overflow-x:auto">{types.map((t) => <button class={type === t ? 'on' : ''} onClick={() => setType(t)} style="flex:0 0 auto;padding:0 10px">{t === 'all' ? 'Tất cả' : LOG_TYPE_VI[t] ?? t}</button>)}</div>
        <div class="seg" style="margin-bottom:6px"><button class={mineOnly ? 'on' : ''} onClick={() => setMineOnly(true)}>Liên quan {shortName(st, id)}</button><button class={!mineOnly ? 'on' : ''} onClick={() => setMineOnly(false)}>Toàn thế giới</button></div>
        {list.length ? list.map((l, i) => <div class="logline" key={i}><span class="dt">{l.date.slice(0, 7)}</span><span>{l.textVi ?? l.text}{l.divergence && <span class="warn" title="Khác với lịch sử thực"> ⑂</span>}</span></div>) : <div class="empty">Chưa có sự kiện nào.</div>}
      </div>
    );
  }
  if (tab === 'territory') {
    const list = [...st.territoryLog].reverse().slice(0, 200);
    return list.length ? (
      <div>{list.map((t, i) => <div class="logline" key={i}><span class="dt">{t.date.slice(0, 7)}</span><span><b class="serif">{data().region.get(t.region)?.name ?? t.region}</b>: {shortName(st, t.from)} → {shortName(st, t.to)} <span class="dim">({t.cause})</span>{t.historicalMatch === true ? <span class="pos"> · đúng lịch sử</span> : t.historicalMatch === false ? <span class="warn"> · khác lịch sử</span> : ''}</span></div>)}</div>
    ) : <div class="empty">Chưa có thay đổi lãnh thổ nào.</div>;
  }
  if (tab === 'history') {
    const sim = st.divergence.similarity; const ms = data().db.milestones;
    return (
      <div>
        <div class="note">{st.mode === 'sandbox' ? 'Sandbox: so sánh chỉ để tham khảo, không tác động mô phỏng.' : 'Lịch sử: mô phỏng không bị ép theo lịch sử; đây là mức độ trùng khớp đo được.'}</div>
        <Section title="Mức tương đồng với lịch sử thực">
          <LineChart years={sim.map((s) => Number(s.date.slice(0, 4)))} series={[{ name: 't', color: '#93bad6', values: sim.map((s) => s.territorial) }, { name: 'm', color: '#e3b65e', values: sim.map((s) => s.milestones) }, { name: 'c', color: '#93c47a', values: sim.map((s) => s.combined) }]} fmtY={(v) => pct(v)} />
          <div class="rowline" style="gap:14px;font-size:12.5px"><span><i class="sw" style="display:inline-block;background:#93bad6" /> Lãnh thổ</span><span><i class="sw" style="display:inline-block;background:#e3b65e" /> Mốc lịch sử</span><span><i class="sw" style="display:inline-block;background:#93c47a" /> Tổng hợp</span></div>
        </Section>
        <Section title="Các mốc lịch sử" extra={`${ms.length} mốc`}>
          {ms.map((m) => { const s = st.divergence.milestones[m.id]; const stt = s?.status ?? 'pending'; return <div class="rowline" key={m.id}><span class={stt === 'achieved' ? 'pos' : stt === 'missed' ? 'neg' : 'dim'} style="width:18px">{stt === 'achieved' ? '✓' : stt === 'missed' ? '✗' : '·'}</span><span class="grow" style="white-space:normal">{m.label}</span><span class="dim num">{m.check_date.slice(0, 4)}</span></div>; })}
          <div class="note">Mô tả mốc hiển thị bằng tiếng Anh theo cơ sở dữ liệu.</div>
        </Section>
      </div>
    );
  }
  // decisions
  const pend = st.pendingPlayerDecisions;
  const windows = data().db.decision_windows.filter((w) => w.entity === id);
  return (
    <div>
      {st.mode === 'sandbox' && <div class="note box">Sandbox không có cửa sổ quyết định lịch sử; các biến cố xuất hiện ngẫu nhiên theo cùng hệ thống.</div>}
      {pend.map((p) => { const w = data().db.decision_windows.find((x) => x.id === p.windowId); if (!w) return null; return (
        <Section key={p.id} title={DW_TITLE[w.id] ?? w.id} left extra={`hạn ${w.window[1].slice(0, 7)}`}>
          <div class="plate">
            <div class="muted" style="font-size:13px;margin-bottom:6px">Cửa sổ quyết định lịch sử của {shortName(st, w.entity)} · mở {w.window[0].slice(0, 7)} · sự kiện thực tế {w.date_historical}</div>
            {w.options.map((o) => (
              <div class="entry" key={o.id} style="cursor:default">
                <span class="ico"><Icon name={o.historical ? 'scroll' : 'flag'} /></span>
                <div class="main"><div class="cat">{o.historical ? 'Phương án đã xảy ra trong lịch sử' : 'Phương án rẽ nhánh'}</div><div class="ttl">{OPTION_VI[o.id] ?? o.id.replace(/_/g, ' ')}</div><div class="meta">{o.effects.length ? o.effects.map(effText).join(' · ') : 'Không thay đổi luật'}</div></div>
                {canCommand(st, id) && <button class="btn sm" onClick={() => send({ type: 'decide', pendingId: p.id, option: o.id }, `Đã quyết định: ${OPTION_VI[o.id] ?? o.id}`)}>Chọn</button>}
              </div>
            ))}
          </div>
        </Section>); })}
      {!pend.length && <div class="empty">Không có quyết định nào đang chờ.</div>}
      {windows.length > 0 && <Section title="Các cửa sổ quyết định của quốc gia này">
        {windows.map((w) => <div class="rowline" key={w.id}><span class="grow serif" style="font-size:15px">{DW_TITLE[w.id] ?? w.id}</span><span class="dim num">{w.window[0].slice(0, 4)}–{w.window[1].slice(0, 4)}</span></div>)}
        <div class="note">Cửa sổ chỉ mở khi điều kiện lịch sử thỏa mãn; phương án lịch sử không bị ép.</div>
      </Section>}
    </div>
  );
}

/** Notification inbox: log entries involving the viewed country since the last time the inbox was opened. */
export function InboxScreen({ st }: { st: GameState }) {
  const id = viewedId(st); const since = game.readLogCount;
  const items = st.log.slice(since).filter((l) => l.actors.includes(id) || ['war', 'revolution', 'state'].includes(l.type)).reverse();
  return (
    <div>
      {items.length ? items.map((l, i) => <div class="logline" key={i}><span class="dt">{l.date.slice(0, 7)}</span><span>{l.textVi ?? l.text}</span></div>) : <div class="empty">Không có thông báo mới.</div>}
      <div class="btns" style="margin-top:8px"><button class="btn" onClick={() => { game.readLogCount = st.log.length; game.emit(); modals.close(); }}>Đánh dấu đã đọc</button></div>
    </div>
  );
}
export const JOURNAL_TABS: [string, string][] = [['decisions', 'Quyết định'], ['log', 'Nhật ký'], ['territory', 'Lãnh thổ'], ['history', 'So với lịch sử']];
