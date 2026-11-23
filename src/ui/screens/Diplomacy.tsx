// Diplomacy window: Relations (searchable, sortable ledger; a row opens the country's diplomatic detail window
// with the actions the engine allows), Treaties (grouped by type) and Subjects & rivals. The declare-war sheet
// previews sides with the engine's own warSides() rule and requires a press-and-hold.
import { MySubjectStatus, OverlordSubjects, SubjectTypesTable } from './SubjectsPanel';
import { useRef, useState } from 'preact/hooks';
import type { GameState } from '../../engine/types';
import { getRel } from '../../engine/core';
import { powerScore, allianceAcceptance, allied, rivals, warSides, boundSubject } from '../../engine/systems/diplomacy';
import { armyStrength } from '../../engine/systems/military';
import { sharesBorder } from '../../engine/systems/politics';
import { Sec, Metric, DBar, Seg, modals, details, useWidth, useSort } from '../components/ui';
import { fmt, compact, govVi, SUBJECT_VI } from '../i18n/vi';
import { shortName, fullName } from '../game/names';
import { viewedId, canCommand, send, CountryLink, Flag, openCountry, regionName } from './common';
import { ui } from '../game/ui';
import { UnitedNationsTab } from './UnitedNations';
import { PowerBlocsTab } from './PowerBlocs';

const TREATY_VI: Record<string, string> = { alliance: 'Liên minh', guarantee: 'Bảo đảm độc lập', customs_union: 'Liên minh thuế quan' };

export function DiplomacyScreen({ st, tab }: { st: GameState; tab: string }) {
  if (tab === 'treaties') return <Treaties st={st} />;
  if (tab === 'subjects') return <Subjects st={st} />;
  if (tab === 'un') return <UnitedNationsTab st={st} />;
  if (tab === 'blocs') return <PowerBlocsTab st={st} />;
  return <Relations st={st} />;
}

function Relations({ st }: { st: GameState }) {
  const id = viewedId(st); const [q, setQ] = useState(''); const [ref, w] = useWidth<HTMLDivElement>(); const sel = details.use()?.key;
  const [only, setOnly] = useState<'all' | 'near' | 'special'>('all');
  const { s, th } = useSort<'name' | 'rel' | 'pow'>('pow');
  const others = Object.values(st.countries).filter((c) => c.alive && !c.decentralized && c.id !== id).map((c) => ({ c, rel: getRel(st, id, c.id), pow: powerScore(st, c), border: sharesBorder(st, id, c.id), ally: allied(st, id, c.id), riv: rivals(st, id, c.id), subj: c.overlord === id, over: st.countries[id].overlord === c.id, war: st.wars.some((x) => (x.attackers.members.includes(id) && x.defenders.members.includes(c.id)) || (x.defenders.members.includes(id) && x.attackers.members.includes(c.id))) }));
  let rows = others.filter((o) => !q || shortName(st, o.c.id).toLowerCase().includes(q.toLowerCase()) || o.c.name.toLowerCase().includes(q.toLowerCase()));
  if (only === 'near') rows = rows.filter((o) => o.border);
  if (only === 'special') rows = rows.filter((o) => o.ally || o.riv || o.subj || o.over || o.war);
  rows = rows.sort((a, b) => (s.k === 'name' ? shortName(st, a.c.id).localeCompare(shortName(st, b.c.id)) : s.k === 'rel' ? a.rel - b.rel : a.pow - b.pow) * s.dir).slice(0, 120);
  const tags = (o: (typeof others)[number]) => [o.war && ['Chiến tranh', 'down'], o.ally && ['Đồng minh', 'up'], o.riv && ['Đối thủ', 'down'], o.subj && ['Chư hầu', 'up'], o.over && ['Tông chủ', 'warn'], o.border && ['Giáp biên', 'flat']].filter(Boolean) as [string, string][];
  return (
    <div class="pad" ref={ref}>
      <div class="toolrow">
        <input class="field grow" placeholder="Tìm quốc gia…" value={q} onInput={(e) => setQ((e.target as HTMLInputElement).value)} aria-label="Tìm quốc gia" />
        <Seg value={only} onChange={setOnly} options={[['all', 'Tất cả'], ['near', 'Láng giềng'], ['special', 'Quan hệ đặc biệt']] as const} />
      </div>
      <table class="dt">
        <thead><tr>{th('name', 'Quốc gia')}{th('rel', 'Quan hệ', 'r')}{w >= 450 && <th>Quan hệ đặc biệt</th>}{th('pow', 'Sức mạnh', 'r')}</tr></thead>
        <tbody>{rows.map((o) => { const tg = tags(o); return (
          <tr key={o.c.id} class={sel === `dip:${o.c.id}` ? 'on' : ''} onClick={() => openCountryActions(st, o.c.id)}>
            <td><span class="cell-ic"><Flag c={o.c} sm /><span><div class="nm">{shortName(st, o.c.id)}</div>{w < 470 && tg.length > 0 && <div class="sub">{tg.map(([t]) => t).join(' · ')}</div>}</span></span></td>
            <td class="r"><div class="bal" style="justify-content:flex-end"><span class={`num ${o.rel > 0 ? 'pos' : o.rel < 0 ? 'neg' : 'muted'}`}>{o.rel > 0 ? '+' : ''}{fmt(o.rel)}</span><DBar v={o.rel / 100} w={48} /></div></td>
            {w >= 450 && <td>{tg.length ? tg.map(([t, cls]) => <span key={t} class={`tag ${cls}`} style="margin-right:10px">{t}</span>) : <span class="dim">—</span>}</td>}
            <td class="r num">{fmt(o.pow)}</td>
          </tr>); })}</tbody>
      </table>
      {!rows.length && <div class="empty">Không có quốc gia nào khớp.</div>}
    </div>
  );
}

function Treaties({ st }: { st: GameState }) {
  const id = viewedId(st); const ts = st.treaties.filter((t) => t.members.includes(id));
  if (!ts.length) return <div class="pad"><div class="empty">Chưa có hiệp ước nào.</div></div>;
  return (
    <div class="pad">
      <table class="dt">
        <thead><tr><th>Bên tham gia</th><th class="r">Từ năm</th><th class="r">Căn cứ</th></tr></thead>
        <tbody>
          {(['alliance', 'guarantee', 'customs_union'] as const).map((type) => { const list = ts.filter((t) => t.type === type); if (!list.length) return null; return [
            <tr class="grp" key={type}><td colSpan={3}>{TREATY_VI[type]} · {list.length}</td></tr>,
            ...list.map((t) => <tr key={t.id} style="cursor:default"><td style="white-space:normal"><span class="links">{t.members.filter((m) => m !== id || t.members.length === 1).map((m) => <CountryLink key={m} st={st} id={m} />)}</span>{t.leader && <div class="sub">dẫn đầu: {shortName(st, t.leader)}</div>}</td><td class="r num">{1836 + Math.floor(t.start / 12)}</td><td class="r muted">{t.source ? 'hồ sơ lịch sử' : 'trong ván'}</td></tr>),
          ]; })}
        </tbody>
      </table>
    </div>
  );
}

function Subjects({ st }: { st: GameState }) {
  const id = viewedId(st); const me = st.countries[id];
  const subs = Object.values(st.countries).filter((c) => c.alive && c.overlord === id);
  const riv = Object.keys(st.countries).filter((o) => o !== id && st.countries[o].alive && rivals(st, id, o));
  return (
    <div class="pad">
      {me.overlord && <MySubjectStatus st={st} id={id} />}
      <OverlordSubjects st={st} id={id} />
      <div class="cols c2">
        <Sec title="Các loại chư hầu" x={subs.length ? '' : ''}><SubjectTypesTable /></Sec>
        <Sec title="Đối thủ" x={riv.length}>
          {riv.length ? <table class="dt"><thead><tr><th>Quốc gia</th><th class="r">Quan hệ</th><th class="r">Sức mạnh</th></tr></thead><tbody>{riv.map((o) => <tr key={o} onClick={() => openCountryActions(st, o)}><td><span class="cell-ic"><Flag c={st.countries[o]} sm /><span class="nm">{shortName(st, o)}</span></span></td><td class="r num neg">{fmt(getRel(st, id, o))}</td><td class="r num">{fmt(powerScore(st, st.countries[o]))}</td></tr>)}</tbody></table> : <div class="empty sm">Không có đối thủ.</div>}
        </Sec>
      </div>
    </div>
  );
}

/** Opens the diplomatic detail window; from the map (no window open) it opens the Diplomacy window first. */
export function openCountryActions(st: GameState, target: string) {
  const u = ui.get(); const inWindow = !['map', 'more'].includes(u.screen);
  if (!inWindow) ui.go('diplomacy', 'relations');
  const g = ui.get(); const scope = `${g.screen}:${g.tabs[g.screen] ?? ''}:${g.country ?? ''}`;
  details.open({ key: `dip:${target}`, title: shortName(st, target), ctx: 'Ngoại giao', scope, body: () => <CountryActions st={st} target={target} /> });
}
function CountryActions({ st, target }: { st: GameState; target: string }) {
  const me = st.player; const t = st.countries[target]; const mine = !!me && canCommand(st, me);
  const viewer = viewedId(st); const rel = getRel(st, viewer, target); const isAlly = allied(st, viewer, target); const isRiv = rivals(st, viewer, target);
  const acc = me ? allianceAcceptance(st, me, target) : 0; const subj = boundSubject(t) || (me ? boundSubject(st.countries[me]) : false);
  const atWarWith = !!me && st.wars.some((w) => (w.attackers.members.includes(me) && w.defenders.members.includes(target)) || (w.defenders.members.includes(me) && w.attackers.members.includes(target)));
  const action = (label: string, sub: string | null, btn: string, onClick: () => void, opts: { danger?: boolean; disabled?: boolean } = {}) => (
    <div class="row"><div class="grow"><div class="t sm">{label}</div>{sub && <div class="s">{sub}</div>}</div><button class={`btn sm${opts.danger ? ' danger' : ''}`} disabled={opts.disabled} onClick={onClick}>{btn}</button></div>
  );
  return (
    <div>
      <div class="banner-top" style={`--bc:${t.color}`}>
        <Flag c={t} lg />
        <div style="min-width:0"><h3 style="font-size:20px">{fullName(st, target)}</h3><div class="meta">{govVi(t.govLabel)}{t.overlord ? ` · ${SUBJECT_VI[t.subjectType ?? ''] ?? 'chư hầu'} của ${shortName(st, t.overlord)}` : ''}</div></div>
      </div>
      <div class="metrics">
        <Metric label="Quan hệ với ta" value={<span class={rel > 0 ? 'pos' : rel < 0 ? 'neg' : ''}>{rel > 0 ? '+' : ''}{fmt(rel)}</span>} d={<DBar v={rel / 100} />} />
        <Metric label="Sức mạnh" value={fmt(powerScore(st, t))} d={<span class="dim">lục quân {compact(t.army.manpower)}</span>} />
      </div>
      <div class="kv"><span class="k">Thủ đô</span><span class="v">{regionName(t.capital)}</span></div>
      <div class="kv"><span class="k">Quan hệ đặc biệt</span><span class="v">{[isAlly && 'Đồng minh', isRiv && 'Đối thủ', atWarWith && 'Đang chiến tranh', sharesBorder(st, viewer, target) && 'Giáp biên'].filter(Boolean).join(' · ') || '—'}</span></div>
      <div class="btns" style="margin:10px 0 4px"><button class="btn sm" onClick={() => openCountry(target)}>Hồ sơ quốc gia</button></div>
      {mine && me !== target && (
        <Sec title="Hành động ngoại giao" icon="diplomacy">
          {action('Cải thiện quan hệ', '+3 mỗi lần', 'Thực hiện', () => send({ type: 'improve_relations', target }, `Quan hệ với ${shortName(st, target)} được cải thiện`))}
          {isAlly ? action('Hủy liên minh', 'Giảm quan hệ và uy tín', 'Hủy', () => send({ type: 'break_alliance', target }, `Đã hủy liên minh với ${shortName(st, target)}`), { danger: true })
            : action('Đề nghị liên minh', subj ? 'Không thể: có quan hệ chư hầu' : `Đối phương ${acc >= 0 ? 'sẽ chấp nhận' : 'sẽ từ chối'} (${acc >= 0 ? '+' : '−'}${fmt(Math.abs(acc), 1)})`, 'Đề nghị', () => send({ type: 'propose_alliance', target }, `Liên minh với ${shortName(st, target)} được thiết lập`), { disabled: subj })}
          {!isRiv && action('Tuyên bố đối thủ', 'Quan hệ giảm dần theo thời gian', 'Tuyên bố', () => send({ type: 'declare_rival', target }, `${shortName(st, target)} là đối thủ của ta`))}
          {action('Bảo đảm độc lập', 'Ta sẽ tham chiến nếu nước này bị tấn công', 'Bảo đảm', () => send({ type: 'guarantee', target }, `Đã bảo đảm độc lập cho ${shortName(st, target)}`))}
          {!atWarWith && action('Tuyên chiến…', 'Xem trước phe tham chiến và mục tiêu', 'Xem xét', () => modals.open(`Tuyên chiến với ${shortName(st, target)}`, () => <WarDialog st={st} target={target} />), { danger: true })}
          {atWarWith && <div class="note">Đang có chiến tranh với nước này — xem Quân sự › Chiến tranh.</div>}
        </Sec>
      )}
      {!mine && <div class="note">{st.player ? (me === target ? 'Đây là quốc gia của bạn.' : 'Chỉ xem.') : 'Chế độ quan sát: không có hành động ngoại giao.'}</div>}
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
  const start = () => { const t0 = performance.now(); const tick = () => { const p = Math.min(1, (performance.now() - t0) / 700); setProg(p); if (p >= 1) { hold.current = null; void send({ type: 'declare_war', target, goals }, `Đã tuyên chiến với ${shortName(st, target)}`).then((ok) => { if (ok) { modals.close(); details.close(); } }); return; } hold.current = requestAnimationFrame(tick); }; hold.current = requestAnimationFrame(tick); };
  const stop = () => { if (hold.current) cancelAnimationFrame(hold.current); hold.current = null; setProg(0); };
  return (
    <div>
      <Seg value={goal} onChange={setGoal} options={[['conquer', 'Chiếm vùng'], ['subjugate', 'Chư hầu hóa'], ['force_open_market', 'Mở cửa thị trường']] as const} />
      {goal === 'conquer' && <select class="field" style="margin-top:8px" value={region} onChange={(e) => setRegion((e.target as HTMLSelectElement).value)}>{regs.map((r) => <option value={r.id} key={r.id}>{regionName(r.id)}</option>)}</select>}
      <Sec title="Phe dự kiến" x="theo hiệp ước hiện tại">
        <div class="kv"><span class="k">Phe ta</span><span class="v links">{ws.attackers.map((x) => <CountryLink st={st} id={x} key={x} />)}</span></div>
        <div class="kv"><span class="k">Đối phương</span><span class="v links">{ws.defenders.map((x) => <CountryLink st={st} id={x} key={x} />)}</span></div>
        {ws.joined.length > 0 && <div class="note">Tham gia: {ws.joined.map((j) => `${shortName(st, j.id)} (${REASON[j.reason]})`).join(', ')}</div>}
      </Sec>
      <Sec title="Lục quân hiệu dụng">
        <div class="hbar" style="height:10px"><i style={`width:${(A / (A + D || 1)) * 100}%;background:var(--info)`} /><i style="flex:1;background:var(--neg)" /></div>
        <div class="kv"><span class="k">Phe ta {compact(A)}</span><span class="v">Đối phương {compact(D)}</span></div>
      </Sec>
      <div class="note warnbox">Tiếng xấu +{fmt(ws.infamy)}. Quan hệ với các nước phe kia giảm xuống ≤ −60. Không thể hoàn tác; hòa bình cần điểm chiến tranh hoặc đối phương chấp nhận.</div>
      <button class="btn danger hold" style="width:100%;margin-top:10px" onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop}>
        <span class="fill" style={`width:${prog * 100}%`} />Giữ để tuyên chiến
      </button>
    </div>
  );
}
export const DIPLOMACY_TABS: [string, string][] = [['relations', 'Quan hệ'], ['treaties', 'Hiệp ước'], ['subjects', 'Chư hầu & đối thủ'], ['blocs', 'Khối quyền lực'], ['un', 'Liên Hợp Quốc']];
