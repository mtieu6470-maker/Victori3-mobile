// Diplomacy: relations ledger, treaties, rivals & subjects; actions through the engine's diplomacy rules.
import { useRef, useState } from 'preact/hooks';
import type { GameState } from '../../engine/types';
import { getRel } from '../../engine/core';
import { powerScore, allianceAcceptance, allied, rivals, warSides, boundSubject } from '../../engine/systems/diplomacy';
import { armyStrength } from '../../engine/systems/military';
import { sharesBorder } from '../../engine/systems/politics';
import { data } from '../../engine/data/db';
import { Section, DBar, modals } from '../components/ui';
import { fmt, compact, SUBJECT_VI } from '../i18n/vi';
import { shortName, fullName } from '../game/names';
import { viewedId, canCommand, send, CountryLink, Flag } from './common';
import { ui } from '../game/ui';

export function DiplomacyScreen({ st, tab }: { st: GameState; tab: string }) {
  const id = viewedId(st);
  const [sort, setSort] = useState<'pow' | 'rel'>('pow');
  const [q, setQ] = useState('');
  if (tab === 'treaties') {
    const ts = st.treaties.filter((t) => t.members.includes(id));
    const TYPE: Record<string, string> = { alliance: 'Liên minh', guarantee: 'Bảo đảm độc lập', customs_union: 'Liên minh thuế quan' };
    return (
      <div>
        {ts.length ? ts.map((t) => (
          <div class="entry" key={t.id} style="cursor:default">
            <div class="main"><div class="cat">{TYPE[t.type] ?? t.type}{t.source ? ' · theo hồ sơ lịch sử' : ''}</div><div class="ttl" style="display:flex;gap:10px;flex-wrap:wrap">{t.members.map((m) => <CountryLink st={st} id={m} key={m} />)}</div><div class="meta">Từ năm {1836 + Math.floor(t.start / 12)}</div></div>
          </div>)) : <div class="empty">Chưa có hiệp ước nào.</div>}
      </div>
    );
  }
  if (tab === 'subjects') {
    const subs = Object.values(st.countries).filter((c) => c.alive && c.overlord === id);
    const riv = Object.keys(st.countries).filter((o) => o !== id && st.countries[o].alive && rivals(st, id, o));
    const me = st.countries[id];
    return (
      <div>
        {me.overlord && <Section title="Quan hệ lệ thuộc"><div class="rowline"><span class="grow">{SUBJECT_VI[me.subjectType ?? ''] ?? 'Chư hầu'} của</span><CountryLink st={st} id={me.overlord} /></div></Section>}
        <Section title="Chư hầu & xứ bảo hộ" extra={subs.length}>{subs.length ? subs.map((c) => <div class="rowline" key={c.id}><span class="grow"><CountryLink st={st} id={c.id} /></span><span class="muted">{SUBJECT_VI[c.subjectType ?? ''] ?? c.subjectType}</span></div>) : <div class="empty">Không có.</div>}</Section>
        <Section title="Đối thủ" extra={riv.length}>{riv.length ? riv.map((o) => <div class="rowline" key={o}><span class="grow"><CountryLink st={st} id={o} /></span><span class="num neg">{fmt(getRel(st, id, o))}</span></div>) : <div class="empty">Không có đối thủ.</div>}</Section>
      </div>
    );
  }
  const others = Object.values(st.countries).filter((c) => c.alive && !c.decentralized && c.id !== id).map((c) => ({ c, rel: getRel(st, id, c.id), pow: powerScore(st, c), border: sharesBorder(st, id, c.id), ally: allied(st, id, c.id), riv: rivals(st, id, c.id) }));
  const rows = others.filter((o) => !q || shortName(st, o.c.id).toLowerCase().includes(q.toLowerCase()) || o.c.name.toLowerCase().includes(q.toLowerCase())).sort((a, b) => (sort === 'pow' ? b.pow - a.pow : b.rel - a.rel)).slice(0, 80);
  return (
    <div>
      <div style="display:flex;gap:6px;margin-bottom:6px"><input class="field" placeholder="Tìm quốc gia…" value={q} onInput={(e) => setQ((e.target as HTMLInputElement).value)} />
        <div class="seg" style="flex:0 0 auto"><button class={sort === 'pow' ? 'on' : ''} onClick={() => setSort('pow')} style="padding:0 10px">Sức mạnh</button><button class={sort === 'rel' ? 'on' : ''} onClick={() => setSort('rel')} style="padding:0 10px">Quan hệ</button></div></div>
      <div class="tbl-wrap">
        <table class="ledger">
          <thead><tr><th>Quốc gia</th><th class="r">Quan hệ</th><th>Quan hệ đặc biệt</th><th class="r">Sức mạnh</th></tr></thead>
          <tbody>{rows.map((o) => (
            <tr key={o.c.id} onClick={() => openCountryActions(st, o.c.id)}>
              <td><span class="gi"><Flag c={o.c} sm /><span class="nm">{shortName(st, o.c.id)}</span></span></td>
              <td class="r"><span class="num" style={`margin-right:6px;color:${o.rel > 0 ? 'var(--pos)' : o.rel < 0 ? 'var(--neg)' : 'var(--text-2)'}`}>{o.rel > 0 ? '+' : ''}{fmt(o.rel)}</span><DBar v={o.rel / 100} /></td>
              <td class="muted" style="font-size:13px">{[o.ally && 'Đồng minh', o.riv && 'Đối thủ', o.border && 'Giáp biên', o.c.overlord === id && 'Chư hầu'].filter(Boolean).join(' · ') || '—'}</td>
              <td class="r num">{fmt(o.pow)}</td>
            </tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

export function openCountryActions(st: GameState, target: string) {
  modals.open(shortName(st, target), () => <CountryActions st={st} target={target} />);
}
function CountryActions({ st, target }: { st: GameState; target: string }) {
  const me = st.player; const t = st.countries[target]; const mine = !!me && canCommand(st, me);
  const rel = me ? getRel(st, me, target) : 0; const isAlly = !!me && allied(st, me, target); const isRiv = !!me && rivals(st, me, target);
  const acc = me ? allianceAcceptance(st, me, target) : 0; const subj = boundSubject(t) || (me ? boundSubject(st.countries[me]) : false);
  const atWarWith = !!me && st.wars.some((w) => (w.attackers.members.includes(me) && w.defenders.members.includes(target)) || (w.defenders.members.includes(me) && w.attackers.members.includes(target)));
  return (
    <div>
      <div class="plate" style="display:flex;gap:10px;align-items:center;margin-bottom:6px"><span class="flag" style={`width:46px;height:31px;background:${t.color}`} /><div><div class="serif" style="font-size:17px;font-weight:600;line-height:1.2">{fullName(st, target)}</div><div class="muted" style="font-size:13px">Sức mạnh {fmt(powerScore(st, t))}{me ? ` · quan hệ với ta ${rel > 0 ? '+' : ''}${fmt(rel)}` : ''}</div></div></div>
      <div class="btns" style="margin-bottom:6px"><button class="btn" onClick={() => { modals.close(); ui.set({ country: target, screen: 'country', tabs: { ...ui.get().tabs, country: 'overview' } }); }}>Hồ sơ quốc gia</button></div>
      {mine && me !== target && (
        <Section title="Hành động ngoại giao">
          <div class="rowline"><span class="grow">Cải thiện quan hệ (+3 mỗi lần)</span><button class="btn sm" onClick={() => send({ type: 'improve_relations', target }, `Quan hệ với ${shortName(st, target)} được cải thiện`)}>Thực hiện</button></div>
          {isAlly ? <div class="rowline"><span class="grow">Hủy liên minh</span><button class="btn sm danger" onClick={() => { if (send({ type: 'break_alliance', target }, `Đã hủy liên minh với ${shortName(st, target)}`)) modals.close(); }}>Hủy</button></div>
            : <div class="rowline"><span class="grow">Đề nghị liên minh · <span class={acc >= 0 && !subj ? 'pos' : 'neg'}>{subj ? 'không thể (quan hệ chư hầu)' : `đối phương ${acc >= 0 ? 'sẽ chấp nhận' : 'sẽ từ chối'} (${acc >= 0 ? '+' : '−'}${fmt(Math.abs(acc), 1)})`}</span></span><button class="btn sm" disabled={subj} onClick={() => send({ type: 'propose_alliance', target }, `Liên minh với ${shortName(st, target)} được thiết lập`)}>Đề nghị</button></div>}
          {!isRiv && <div class="rowline"><span class="grow">Tuyên bố đối thủ</span><button class="btn sm" onClick={() => send({ type: 'declare_rival', target }, `${shortName(st, target)} là đối thủ của ta`)}>Tuyên bố</button></div>}
          <div class="rowline"><span class="grow">Bảo đảm độc lập</span><button class="btn sm" onClick={() => send({ type: 'guarantee', target }, `Đã bảo đảm độc lập cho ${shortName(st, target)}`)}>Bảo đảm</button></div>
          {!atWarWith && <div class="rowline"><span class="grow">Tuyên chiến…</span><button class="btn sm danger" onClick={() => modals.open(`Tuyên chiến với ${shortName(st, target)}`, () => <WarDialog st={st} target={target} />)}>Xem xét</button></div>}
          {atWarWith && <div class="note">Đang có chiến tranh với nước này — xem thẻ Quân sự › Chiến tranh.</div>}
        </Section>
      )}
      {!mine && <div class="note">{st.player ? 'Đây là quốc gia của bạn.' : 'Chế độ quan sát: không có hành động ngoại giao.'}</div>}
    </div>
  );
}

/** Declare-war sheet: sides come from the engine's own warSides() rule; confirmation requires a press-and-hold. */
function WarDialog({ st, target }: { st: GameState; target: string }) {
  const me = st.player!; const regs = st.regions.filter((r) => r.owner === target).sort((a, b) => b.pop - a.pop);
  const [goal, setGoal] = useState<'conquer' | 'subjugate' | 'force_open_market'>('conquer');
  const [region, setRegion] = useState(regs[0]?.id ?? '');
  const goals = goal === 'conquer' ? [{ by: me, type: 'conquer', target, regions: [region] }] : [{ by: me, type: goal, target }];
  const ws = warSides(st, me, target, goals);
  const str = (ids: string[]) => ids.reduce((s, x) => s + armyStrength(st, st.countries[x]), 0);
  const A = str(ws.attackers), D = str(ws.defenders);
  const REASON: Record<string, string> = { alliance: 'liên minh', guarantee: 'bảo đảm', great_power: 'cường quốc can thiệp', subject: 'chư hầu' };
  const hold = useRef<number | null>(null); const [prog, setProg] = useState(0);
  const start = () => { const t0 = performance.now(); const tick = () => { const p = Math.min(1, (performance.now() - t0) / 700); setProg(p); if (p >= 1) { hold.current = null; if (send({ type: 'declare_war', target, goals }, `Đã tuyên chiến với ${shortName(st, target)}`)) modals.close(); return; } hold.current = requestAnimationFrame(tick); }; hold.current = requestAnimationFrame(tick); };
  const stop = () => { if (hold.current) cancelAnimationFrame(hold.current); hold.current = null; setProg(0); };
  return (
    <div>
      <div class="seg" style="margin-bottom:6px">{([['conquer', 'Chiếm vùng'], ['subjugate', 'Chư hầu hóa'], ['force_open_market', 'Mở cửa thị trường']] as const).map(([k, l]) => <button class={goal === k ? 'on' : ''} onClick={() => setGoal(k)}>{l}</button>)}</div>
      {goal === 'conquer' && <select class="field" value={region} onChange={(e) => setRegion((e.target as HTMLSelectElement).value)}>{regs.map((r) => <option value={r.id} key={r.id}>{data().region.get(r.id)?.name}</option>)}</select>}
      <Section title="Phe dự kiến (theo hiệp ước hiện tại)">
        <div class="rowline" style="flex-wrap:wrap"><span class="dim" style="width:84px">Phe ta</span><span class="grow" style="display:flex;gap:8px;flex-wrap:wrap">{ws.attackers.map((x) => <CountryLink st={st} id={x} key={x} />)}</span></div>
        <div class="rowline" style="flex-wrap:wrap"><span class="dim" style="width:84px">Đối phương</span><span class="grow" style="display:flex;gap:8px;flex-wrap:wrap">{ws.defenders.map((x) => <CountryLink st={st} id={x} key={x} />)}</span></div>
        {ws.joined.length > 0 && <div class="note">Tham gia: {ws.joined.map((j) => `${shortName(st, j.id)} (${REASON[j.reason]})`).join(', ')}</div>}
      </Section>
      <Section title="Lục quân hiệu dụng">
        <div style="display:flex;height:10px;border:1px solid #0b1416;margin:4px 0"><i style={`width:${(A / (A + D || 1)) * 100}%;background:var(--info)`} /><i style={`flex:1;background:var(--neg)`} /></div>
        <div class="rowline"><span class="grow">Phe ta {compact(A)}</span><span>Đối phương {compact(D)}</span></div>
      </Section>
      <div class="note box">Tiếng xấu +{fmt(ws.infamy)}. Quan hệ với các nước phe kia giảm xuống ≤ −60. Không thể hoàn tác; hòa bình cần điểm chiến tranh hoặc đối phương chấp nhận.</div>
      <button class="btn danger" style="width:100%;margin-top:8px;position:relative;overflow:hidden" onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop}>
        <span style={`position:absolute;left:0;top:0;bottom:0;width:${prog * 100}%;background:rgba(255,220,180,.25)`} />Giữ để tuyên chiến
      </button>
    </div>
  );
}
export const DIPLOMACY_TABS: [string, string][] = [['relations', 'Quan hệ'], ['treaties', 'Hiệp ước'], ['subjects', 'Chư hầu & đối thủ']];
