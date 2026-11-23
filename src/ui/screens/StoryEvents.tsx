// EVT-01 UI: the event window (V3-style: picture, story, options with their concrete gains and costs), story journal
// cards with progress and conditions, and the list of active timed modifiers. Reads engine state; choices are commands.
import type { GameState } from '../../engine/types';
import { data } from '../../engine/data/db';
import type { StoryEvent, StoryEventOption } from '../../engine/data/dbTypes';
import { journalChecks, journalDef, type PendingStory } from '../../engine/systems/storyEvents';
import { Sec, modals } from '../components/ui';
import { GROUP_VI, IG_VI, fmt, lawVi } from '../i18n/vi';
import { shortName } from '../game/names';
import { send, canCommand } from './common';
import { asset, assetUrl, illustrationFor, useContent } from '../game/content';
import { openCredit } from '../components/identity';

const pct = (v: number) => `${v > 0 ? '+' : ''}${Math.round(v * 100)}%`;
const sgn = (v: number, d = 0) => `${v > 0 ? '+' : ''}${fmt(v, v !== 0 && Math.abs(v) < 1 && d < 2 ? (Math.abs(v) < 0.1 ? 2 : 1) : d)}`;
/** Vietnamese labels of modifier keys (mods.MOD_KEYS). */
export const MOD_VI: Record<string, (v: number) => string> = {
  trade: (v) => `Năng lực thương mại ${pct(v)}`, tariff: (v) => `Thu thuế quan ${pct(v)}`, construction: (v) => `Tốc độ xây dựng ${pct(v)}`,
  research: (v) => `Tiếp thu công nghệ ${pct(v)}`, innovation: (v) => `Điểm nghiên cứu ${pct(v)}`, reform: (v) => `Tiến độ cải cách luật ${sgn(v * 100, 1)}%/tháng`,
  police: (v) => `Dân cực đoan ${pct(-v)}`, radicalism: (v) => `Mức cực đoan ${sgn(v * 100)} điểm`, army: (v) => `Chất lượng lục quân ${pct(v)}`,
  legitimacy: (v) => `Chính danh ${sgn(v)}`, tax: (v) => `Hiệu quả thu thuế ${pct(v)}`, literacy: (v) => `Tốc độ tăng biết chữ ${pct(v)}`,
  birth: (v) => `Tỉ lệ sinh ${sgn(v * 1000, 1)}‰`, attraction: (v) => `Sức hút dân di cư ${pct(v)}`, prestige: (v) => `Uy tín ${sgn(v, 1)}/tháng`,
  war_exhaustion: (v) => `Kiệt quệ chiến tranh ${sgn(v, 1)}/tháng`, clergy: (v) => `Tăng lữ ủng hộ ${sgn(v)}`,
};
for (const ig of Object.keys(IG_VI)) MOD_VI[`ig_${ig}`] = (v) => `${IG_VI[ig as keyof typeof IG_VI]} ủng hộ ${sgn(v)}`;

const name = (st: GameState, id: unknown) => (typeof id === 'string' && st.countries[id] ? shortName(st, id) : String(id));
const bindStr = (v: unknown, b: Record<string, string | string[]>) => (typeof v === 'string' && v.startsWith('$') ? b[v.slice(1)] ?? v : v);

/** One effect in plain Vietnamese. */
export function describeEffect(st: GameState, raw: Record<string, any>, b: Record<string, string | string[]> = {}): string {
  const e = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, bindStr(v, b)])) as Record<string, any>;
  const n = (v: unknown) => Number(v);
  switch (e.type) {
    case 'modifier': return `${name(st, e.entity)} nhận "${e.name_vi}" trong ${n(e.months) >= 12 ? `${fmt(n(e.months) / 12, 1)} năm` : `${e.months} tháng`}${e.decaying ? ' (giảm dần)' : ''}: ${Object.entries(e.effects ?? {}).map(([k, v]) => MOD_VI[k]?.(Number(v)) ?? k).join(', ')}`;
    case 'set_law': return `${name(st, e.entity)} áp dụng luật ${lawVi(e.value)} (${GROUP_VI[e.group as keyof typeof GROUP_VI]?.toLowerCase() ?? e.group})`;
    case 'legitimacy': return `Chính danh của ${name(st, e.entity)} ${sgn(n(e.delta))}`;
    case 'legitimacy_crisis': return `${name(st, e.entity)} khủng hoảng chính danh ${sgn(n(e.delta))} trong ${e.months} tháng`;
    case 'relation': return `Quan hệ ${name(st, e.a)} – ${name(st, e.b)} ${sgn(n(e.delta))}`;
    case 'ig_approval': return `${IG_VI[e.ig as keyof typeof IG_VI] ?? e.ig} ở ${name(st, e.entity)} ${n(e.delta) > 0 ? 'hài lòng hơn' : 'bất mãn hơn'} (${sgn(n(e.delta))})`;
    case 'movement': return `Phong trào độc lập ${n(e.delta) > 0 ? 'mạnh lên' : 'yếu đi'} ${sgn(n(e.delta))}`;
    case 'grant_independence': return `Trao độc lập${e.name_vi ? ` cho ${e.name_vi}` : ''} ${e.mode === 'ties' ? 'kèm ràng buộc (thị trường, liên minh)' : e.mode === 'dominion' ? 'thành lãnh thổ tự trị' : 'hoàn toàn'}`;
    case 'make_subject': return `${name(st, e.subject)} thành chư hầu của ${name(st, e.overlord)}`;
    case 'subject_liberty': return `Mong muốn tự do của ${name(st, e.subject)} ${sgn(n(e.delta))}`;
    case 'subject_payment': return `Cống nạp của ${name(st, e.subject)} ${pct(n(e.delta))}`;
    case 'treasury': return `Ngân khố ${name(st, e.entity)} ${n(e.months_income) > 0 ? '+' : ''}${fmt(n(e.months_income), 1)} tháng thu nhập`;
    case 'war_exhaustion': return `Kiệt quệ chiến tranh ${name(st, e.entity)} ${sgn(n(e.delta))}`;
    case 'prestige': return `Uy tín ${name(st, e.entity)} ${sgn(n(e.delta))}`;
    case 'infamy': return `Tai tiếng ${name(st, e.entity)} ${sgn(n(e.delta))}`;
    case 'radicalism': return `Dân cực đoan ${n(e.delta) > 0 ? 'tăng' : 'giảm'} ${Math.abs(Math.round(n(e.delta) * 100))} điểm${e.regions ? ` ở ${(e.regions as unknown[]).length} vùng` : ''}`;
    case 'nationalism': return `Chủ nghĩa dân tộc ${n(e.delta) > 0 ? 'tăng' : 'giảm'} ${Math.abs(Math.round(n(e.delta) * 100))} điểm`;
    case 'embargo': return e.on === false ? `${name(st, e.by)} dỡ cấm vận ${name(st, e.target)}` : `${name(st, e.by)} cấm vận ${name(st, e.target)}`;
    case 'support_movement': return `${name(st, e.by)} hỗ trợ phong trào độc lập`;
    case 'alliance': return `Liên minh ${name(st, e.a)} – ${name(st, e.b)}`;
    case 'base_rights': return `${name(st, e.user)} được đặt căn cứ ở ${name(st, e.host)}`;
    case 'customs_union_join': return `${name(st, e.entity)} vào liên minh thuế quan của ${name(st, e.with)}`;
    case 'declare_war': return `${name(st, e.attacker)} tuyên chiến với ${name(st, e.defender)}`;
    case 'army': return `Quân số ${name(st, e.entity)} ${pct(n(e.delta_share))}`;
    case 'trade': return `Thương mại ${name(st, e.entity)} ${pct(n(e.delta))}`;
    case 'start_journal': return `Mở mục nhật ký: ${journalDef(e.id)?.title_vi ?? e.id}`;
    case 'trigger_event': return `Dẫn tới sự kiện: ${data().db.story_events?.find((x) => x.id === e.id)?.title_vi ?? e.id}`;
    case 'transfer_region': return `Vùng ${e.region} về tay ${name(st, e.to)}`;
    case 'regime_change': return `${name(st, e.entity)} đổi chế độ`;
    case 'set_flag': case 'clear_flag': return '';
    default: return String(e.type);
  }
}

function OptionButton({ st, p, o }: { st: GameState; p: PendingStory; o: StoryEventOption }) {
  const lines = o.effects.map((e) => describeEffect(st, e, p.bindings)).filter(Boolean);
  return (
    <button class="btn" style="display:block;width:100%;text-align:left;white-space:normal;margin-top:6px" onClick={() => { send({ type: 'story_choice', pending: p.id, option: o.id }, o.label_vi); modals.close(); }}>
      <b>{o.label_vi}</b>{o.historical && st.mode === 'historical' ? <span class="dim"> · lựa chọn lịch sử</span> : null}
      {lines.length > 0 && <ul class="s" style="margin:4px 0 0 16px;padding:0">{lines.map((l, i) => <li key={i}>{l}</li>)}</ul>}
    </button>
  );
}

/** The event window (shown as a modal while the player has pending events). */
export function StoryEventCard({ st, p }: { st: GameState; p: PendingStory }) {
  const e = data().db.story_events?.find((x) => x.id === p.event) as StoryEvent | undefined; if (!e) return null;
  const mine = canCommand(st, p.country);
  // the event's illustration: a reviewed public-domain image from the content pack (CG-52), by event id or image.ref
  useContent(); // loads the content pack (lazily) and re-renders when it arrives
  const pic = illustrationFor('event', e.id) ?? asset(e.image?.ref);
  return (
    <div class="story-event" style="display:flex;gap:12px;flex-wrap:wrap">
      {pic && <figure style="flex:1 1 220px;margin:0;min-width:180px"><img src={assetUrl(pic)} alt={pic.name} style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:6px" /><figcaption class="s dim" style="cursor:pointer" onClick={() => openCredit(pic)}>{pic.credit ?? pic.author ?? ''} · {pic.license}</figcaption></figure>}
      <div style="flex:2 1 260px;min-width:220px">
        <div class="s dim">Sự kiện ở {name(st, p.country)} · {String(st.date.m).padStart(2, '0')}/{st.date.y}</div>
        <p style="margin:6px 0">{e.text_vi}</p>
        {mine ? e.options.map((o) => <OptionButton key={o.id} st={st} p={p} o={o} />) : <div class="s dim">Chờ {name(st, p.country)} quyết định.</div>}
      </div>
    </div>
  );
}

/** Journal: pending events, running story journals (progress and conditions), active modifiers. */
export function StoryJournalSection({ st, id }: { st: GameState; id: string }) {
  const pend = (st.pendingStory ?? []).filter((p) => p.country === id);
  const js = (st.storyJournals ?? []).filter((j) => j.country === id);
  const mods = st.countries[id]?.modifiers ?? [];
  return <>
    {pend.length > 0 && <Sec title="Sự kiện đang chờ" x={`${pend.length}`}>{pend.map((p) => { const e = data().db.story_events?.find((x) => x.id === p.event); return <div class="option" key={p.id}><div class="oh"><span class="ot">{e?.title_vi ?? p.event}</span></div><StoryEventCard st={st} p={p} /></div>; })}</Sec>}
    {js.length > 0 && <Sec title="Nhật ký đang theo dõi" x={`${js.length}`}>{js.map((j) => {
      const def = journalDef(j.id); if (!def) return null; const ck = journalChecks(st, j); const max = def.progress?.max ?? 100;
      return <div class="option" key={j.id}>
        <div class="oh"><span class="ot">{def.title_vi}</span>{def.timeout_months !== undefined && <span class="tag flat">còn {Math.max(0, def.timeout_months - (st.tick - j.started))} tháng</span>}</div>
        <div class="s">{def.text_vi}</div>
        {def.progress && <div style="margin-top:4px"><div class="s">{def.progress.label_vi ?? 'Tiến độ'}: {fmt(j.progress)}/{max}</div><div class="pbar"><i style={`width:${Math.min(100, j.progress / max * 100)}%`} /></div></div>}
        {(def.complete ?? []).length > 0 && <div class="s" style="margin-top:4px"><b>Hoàn thành khi:</b> {(def.complete ?? []).map((c, i) => <span key={i} class={ck.complete[i] ? 'pos' : 'dim'}>{ck.complete[i] ? '☑' : '☐'} {condText(st, c, j.bindings)} </span>)}</div>}
        {(def.fail ?? []).length > 0 && <div class="s"><b>Thất bại khi:</b> {(def.fail ?? []).map((c, i) => <span key={i} class={ck.fail[i] ? 'neg' : 'dim'}>{ck.fail[i] ? '☒' : '☐'} {condText(st, c, j.bindings)} </span>)}</div>}
        {(def.on_complete ?? []).length > 0 && <div class="s"><b>Nếu hoàn thành:</b> {(def.on_complete ?? []).map((e) => describeEffect(st, e, j.bindings)).filter(Boolean).join('; ')}</div>}
        {(def.on_fail ?? []).length > 0 && <div class="s"><b>Nếu thất bại:</b> {(def.on_fail ?? []).map((e) => describeEffect(st, e, j.bindings)).filter(Boolean).join('; ')}</div>}
      </div>;
    })}</Sec>}
    {mods.length > 0 && <Sec title="Hiệu ứng đang có" x={`${mods.length}`}>{mods.map((m) => <div class="kv" key={m.id}><span class="k">{m.name_vi}{m.decaying ? ' (giảm dần)' : ''}</span><span class="v">{Object.entries(m.effects).map(([k, v]) => MOD_VI[k]?.(v) ?? k).join(', ')} · còn {m.until - st.tick} tháng</span></div>)}</Sec>}
  </>;
}

/** A condition in plain Vietnamese (common types; others show their type). */
function condText(st: GameState, raw: Record<string, any>, b: Record<string, string | string[]>): string {
  const c = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, bindStr(v, b)])) as Record<string, any>;
  switch (c.type) {
    case 'progress_at_least': return `tiến độ đạt ${c.value}`;
    case 'months_elapsed': return `qua ${c.value} tháng`;
    case 'law': return `${name(st, c.entity)} có luật ${lawVi(c.value)}`;
    case 'law_not': return `${name(st, c.entity)} không có luật ${lawVi(c.value)}`;
    case 'not_at_war': return 'đang hòa bình';
    case 'at_war': return `${name(st, c.entity)} đang có chiến tranh`;
    case 'legitimacy_below': return `chính danh dưới ${c.value}`;
    case 'radicalism_above': return `cực đoan trên ${Math.round(Number(c.value) * 100)}%`;
    case 'war_exhaustion_above': return `kiệt quệ trên ${c.value}`;
    case 'ig_clout_above': return `${IG_VI[c.ig as keyof typeof IG_VI] ?? c.ig} có ảnh hưởng trên ${Math.round(Number(c.value) * 100)}%`;
    case 'year_between': return `trong khoảng ${c.from ?? ''}–${c.to ?? ''}`;
    case 'exists': return `${name(st, c.entity)} tồn tại`;
    case 'owns': return `${name(st, c.entity)} giữ vùng ${c.region}`;
    case 'movement_strength_above': return `phong trào độc lập mạnh hơn ${c.value}`;
    case 'relation_above': return `quan hệ ${name(st, c.a)}–${name(st, c.b)} trên ${c.value}`;
    case 'flag': return `đã xảy ra: ${c.flag}`;
    default: return c.type;
  }
}
