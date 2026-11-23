// PB-01b / PB-02: Diplomacy → "Khối quyền lực" tab. Reads engine state; every action is an engine command.
// PB-02 (owner 2026-11-23: "make it clear what joining gives you"): every identity shows its founding
// requirement, where its cohesion comes from, what the leader may do, what members gain and what they must
// accept; every principle level lists its concrete effects for members and for the leader; the bloc card
// breaks down cohesion and leverage; other blocs show "if you join".
import { useState } from 'preact/hooks';
import type { GameState } from '../../engine/types';
import {
  BLOC, BLOC_IDENTITIES, IDENTITY_IMPOSES, PRIMARY_GROUPS, PRINCIPLES, blocIdeology, blocModsFor, blocOf, blocRank, canFound, cohesionParts, identityRequirement,
  imposableGroups, imposeBlocker, isPrimary, leverage, leverageParts, maxPrincipleLevel, monthsToMandate, principleAllowed, principleLevel, principleSlots, wouldJoin,
  type BlocIdentity, type BlocMods, type Effect, type EffectKey, type PowerBloc,
} from '../../engine/systems/powerBlocs';
import { Sec, Metric } from '../components/ui';
import { GROUP_VI, fmt, lawVi } from '../i18n/vi';
import { shortName } from '../game/names';
import { CountryLink, viewedId, canCommand, send } from './common';

interface IdentityText { name: string; idea: string; need: string; cohesion: string; leader: string[]; members: string[]; duties: string[] }
export const IDENTITY_TEXT: Record<BlocIdentity, IdentityText> = {
  trade_league: {
    name: 'Liên minh thương mại', idea: 'Một thị trường chung do nước đứng đầu dẫn dắt.',
    need: 'Nước lập khối không theo chính sách bế quan tỏa cảng.',
    cohesion: 'Thành viên càng gắn với thị trường của nước đứng đầu, khối càng bền.',
    leader: ['Cả khối là một liên minh thuế quan ngay từ đầu', 'Năng lực thương mại của nước đứng đầu +10%', 'Có thể áp luật thương mại lên thành viên (gắn kết ≥ 60)'],
    members: ['Vào thị trường lớn của nước đứng đầu: hàng hóa lưu thông không thuế', 'Thương mại nội khối I/II/III: thương mại +5/10/15%, thuế quan với ngoài khối +10/15/20%', 'Ngoại thương I/II/III: thương mại +10/15/25%'],
    duties: ['Mất chính sách thuế quan riêng (dùng chung thị trường khối)', 'AI thành viên dần bỏ bế quan tỏa cảng', 'Có thể bị áp luật thương mại'],
  },
  sovereign_empire: {
    name: 'Đế chế chủ quyền', idea: 'Nước đứng đầu và các chư hầu, cộng thêm những nước nhỏ dưới sự bảo hộ.',
    need: 'Nước lập khối phải có ít nhất 1 chư hầu.',
    cohesion: 'Càng nhiều thành viên là chư hầu của nước đứng đầu, khối càng bền; chư hầu bất mãn (mong muốn tự do > 50) làm khối yếu đi.',
    leader: ['Mọi chư hầu tự động vào khối; mong muốn tự do của chư hầu tăng chậm hơn 20%', 'Chư hầu nộp 5–25% thu nhập tùy loại; Chư hầu hóa II–III: thu từ chư hầu +25%', 'Khai thác thành viên I/II/III: thêm 2/3/5% thu nhập của mọi thành viên, chính danh +3/5/5', 'Có thể biến thành viên yếu (sức mạnh ≤ 25%, đòn bẩy ≥ 50) thành xứ bảo hộ khi gắn kết ≥ 60'],
    members: ['Được nước đứng đầu bảo vệ: nước đứng đầu sẵn lòng tham chiến khi thành viên bị tấn công'],
    duties: ['Nộp cống nạp hằng tháng (Khai thác thành viên I/II/III: 2/3/5% thu nhập; chính danh −3/−5/−5)', 'Nước yếu có thể bị biến thành xứ bảo hộ', 'Khai thác I/II/III làm khối mất gắn kết −5/−10/−20'],
  },
  ideological_union: {
    name: 'Liên minh ý thức hệ', idea: 'Các nước cùng thể chế đứng chung dưới một ngọn cờ.',
    need: 'Không có điều kiện riêng; ý thức hệ của khối lấy theo luật của nước đứng đầu.',
    cohesion: 'Thành viên càng cùng luật quyền lực và kinh tế với nước đứng đầu, khối càng bền.',
    leader: ['Có thể áp luật quyền lực và chính thể lên thành viên (gắn kết ≥ 60; mỗi lần quan hệ −30, gắn kết −20)', 'Chân lý ý thức hệ III: áp cả luật báo chí'],
    members: ['Thành viên cùng luật quyền lực và kinh tế: dân cực đoan −10%', 'Chân lý ý thức hệ I/II/III: dân cực đoan −5/10/15%, chính danh 0/+3/+8', 'Lập pháp sáng tạo: cải cách luật nhanh hơn'],
    duties: ['AI thành viên ưu tiên cải cách theo luật nước đứng đầu', 'Có thể bị áp luật quyền lực, chính thể'],
  },
  military_treaty: {
    name: 'Tổ chức hiệp ước quân sự', idea: 'Phòng thủ chung trước những đối thủ chung.',
    need: 'Nước lập khối phải có đối thủ hoặc đồng minh.',
    cohesion: 'Nước đứng đầu càng chiếm phần lớn sức mạnh của khối, khối càng bền.',
    leader: ['Liên minh phòng thủ chung giữa mọi thành viên ngay từ đầu', 'Hợp tác phòng thủ II: áp luật quân đội lên thành viên', 'Phối hợp tấn công: thành viên theo mình vào chiến tranh, tai tiếng −15%'],
    members: ['Được cả khối bảo vệ nếu bị tấn công; huấn luyện chung: lục quân +2%', 'Hợp tác phòng thủ III: lục quân +3%'],
    duties: ['Không được tấn công thành viên khác', 'Hợp tác phòng thủ III: bắt buộc tham chiến bên phía thành viên bị tấn công', 'Từ chối lời kêu gọi: gắn kết −10, quan hệ giảm'],
  },
  religious_convocation: {
    name: 'Hội đồng tôn giáo', idea: 'Các quốc gia cùng một đức tin.',
    need: 'Nước lập khối phải có quốc giáo (hoặc thần quyền).',
    cohesion: 'Mọi thành viên phải cùng tôn giáo với nước đứng đầu; điều đó giữ khối bền.',
    leader: ['Chỉ các nước cùng tôn giáo được vào', 'Có thể áp luật tôn giáo lên thành viên', 'Công dân thiêng liêng II–III: chư hầu bớt muốn tự do'],
    members: ['Chính danh +2; Công dân thiêng liêng I/II/III: +2/4/6, tăng lữ ủng hộ +1/2/3', 'Kinh tế thần thánh I/II/III: thương mại +5/5/10%, xây dựng 0/+5/+5%'],
    duties: ['Chỉ nước cùng tôn giáo được ở lại', 'Có thể bị áp luật tôn giáo'],
  },
};
/** Kept for other screens (journal): [name, idea]. */
export const IDENTITY_VI = Object.fromEntries(BLOC_IDENTITIES.map((k) => [k, [IDENTITY_TEXT[k].name, IDENTITY_TEXT[k].idea]])) as Record<BlocIdentity, [string, string]>;

export const PRINCIPLE_VI: Record<string, [string, string]> = {
  market_unification: ['Hợp nhất thị trường', 'Một liên minh thuế quan chung cho cả khối (từ bậc II).'],
  external_trade: ['Ngoại thương', 'Một chính sách ngoại thương chung để buôn bán với bên ngoài.'],
  exploit_members: ['Khai thác thành viên', 'Nước đứng đầu dùng tài nguyên của các thành viên yếu hơn.'],
  vassalization: ['Chư hầu hóa', 'Quản lý chặt các chư hầu để thu nhiều hơn mà vẫn giữ họ yên.'],
  divine_economics: ['Kinh tế thần thánh', 'Giáo hội và thương nhân cùng đức tin làm ăn với nhau.'],
  ideological_alignment: ['Chân lý ý thức hệ', 'Tuyên truyền ý thức hệ chính thức của khối, trấn áp tiếng nói đối lập.'],
  defensive_cooperation: ['Hợp tác phòng thủ', 'Bảo vệ lẫn nhau.'],
  sacred_civics: ['Công dân thiêng liêng', 'Đức tin chung củng cố chính quyền.'],
  internal_trade: ['Thương mại nội khối', 'Buôn bán thuận lợi giữa các thành viên.'],
  advanced_research: ['Nghiên cứu tiên tiến', 'Chia sẻ tri thức và công nghệ.'],
  creative_legislature: ['Lập pháp sáng tạo', 'Cải cách luật nhanh hơn.'],
  police_coordination: ['Phối hợp cảnh sát', 'Trấn áp cực đoan.'],
  shared_construction: ['Xây dựng chung', 'Kỹ sư và vật liệu dùng chung.'],
  freedom_of_movement: ['Tự do đi lại', 'Người di cư chọn các nước trong khối.'],
  aggressive_coordination: ['Phối hợp tấn công', 'Thành viên theo nước đứng đầu vào chiến tranh.'],
  colonial_partnership: ['Đối tác thuộc địa', 'Nước đứng đầu đầu tư vào thành viên, đổi lại lợi thế thương mại.'],
  holy_alliance: ['Liên minh thần thánh', 'Bảo vệ và chiến đấu vì đức tin chung.'],
};

const pct = (v: number) => `${v > 0 ? '+' : ''}${Math.round(v * 100)}%`;
const EFFECT_VI: Record<EffectKey, (v: number) => string> = {
  trade: (v) => `Năng lực thương mại ${pct(v)}`,
  research: (v) => `Tiếp thu công nghệ từ nước ngoài ${pct(v)}`,
  reform: (v) => `Tiến độ cải cách luật +${fmt(v * 100)}%/tháng`,
  police: (v) => `Dân cực đoan −${Math.round(v * 100)}%`,
  army: (v) => `Chất lượng lục quân ${pct(v)}`,
  ideology: (v) => `AI ưu tiên luật của nước đứng đầu (+${fmt(v)})`,
  clergy: (v) => `Giới tăng lữ ủng hộ +${fmt(v)}`,
  construction: (v) => `Tốc độ xây dựng ${pct(v)}`,
  migration: (v) => `Người di cư trong khối ưu tiên nhau ${pct(v)}`,
  legitimacy: (v) => `Chính danh +${fmt(v)}`,
  defend: (v) => `Sẵn sàng tham chiến bảo vệ nước trong khối (+${fmt(v)})`,
  attack: (v) => `Theo nước đứng đầu vào chiến tranh tấn công (+${fmt(v)})`,
  tribute: (v) => `Nộp cống nạp ${Math.round(v * 100)}% thu nhập cho nước đứng đầu`,
  alliance: () => 'Liên minh phòng thủ chung của cả khối',
  market: () => 'Chung liên minh thuế quan của khối',
  subjugate: () => 'Có thể biến thành viên yếu thành xứ bảo hộ',
  openTrade: () => 'AI thành viên bỏ bế quan tỏa cảng',
  subjectPay: (v) => `Thu từ chư hầu ${pct(v)}`,
  liberty: (v) => `Mong muốn tự do của chư hầu ${v > 0 ? '+' : ''}${fmt(v)}/tháng`,
  libertyDamp: (v) => `Mong muốn tự do của chư hầu tăng chậm hơn ${Math.round(v * 100)}%`,
  annexBelow: (v) => `Sáp nhập chư hầu khi mong muốn tự do < ${fmt(v)}`,
  tariff: (v) => `Thu thuế quan (với ngoài khối) ${pct(v)}`,
  infamy: (v) => `Tai tiếng do chiến tranh −${Math.round(v * 100)}%`,
  obliged: () => 'Bắt buộc tham chiến bên phía thành viên bị tấn công',
  noInternalWar: () => 'Không được tấn công thành viên trong khối',
  cohesion: (v) => `Độ gắn kết của khối ${fmt(v)}`,
};
const IDEOLOGY_VI = { socialist: 'xã hội chủ nghĩa', single_party: 'độc đảng', democratic: 'dân chủ', monarchist: 'quân chủ', constitutional: 'lập hiến' } as const;
const LEVEL_VI = ['—', 'I', 'II', 'III'];
const LEVEL_COHESION = ['', '', '40', '70'];
const LEVER_VI: Record<string, string> = { power: 'Sức mạnh tương đối', relations: 'Quan hệ', market: 'Chung thị trường', subject: 'Là chư hầu', alliance: 'Đồng minh', border: 'Láng giềng', culture: 'Cùng văn hóa', religion: 'Cùng tôn giáo', companies: 'Công ty của nước đứng đầu', rivalry: 'Đối thủ' };
const COHESION_VI: Record<string, string> = { base: 'Cơ bản', attitude: 'Thái độ thành viên với nước đứng đầu', identity: 'Bản sắc khối', leverage: 'Đòn bẩy của nước đứng đầu', size: 'Khối quá đông', principles: 'Cái giá của các nguyên tắc', liberty: 'Chư hầu bất mãn nhất' };

const blocName = (b: PowerBloc, st: GameState) => b.identity === 'ideological_union' ? `${IDENTITY_TEXT[b.identity].name} (${IDEOLOGY_VI[blocIdeology(st.countries[b.leader])]})` : IDENTITY_TEXT[b.identity].name;

function EffectList({ mods, empty = 'Chưa có hiệu lực nào' }: { mods: BlocMods; empty?: string }) {
  const keys = (Object.keys(mods) as EffectKey[]).filter((k) => mods[k]);
  if (!keys.length) return <div class="s dim">{empty}</div>;
  return <ul class="s" style="margin:4px 0 0 16px;padding:0">{keys.map((k) => <li key={k}>{EFFECT_VI[k](mods[k]!)}</li>)}</ul>;
}
function Bullets({ items }: { items: string[] }) {
  return <ul class="s" style="margin:2px 0 0 16px;padding:0">{items.map((x) => <li key={x}>{x}</li>)}</ul>;
}
/** One principle tier, laid out like a tooltip: who receives what (each tier includes the tiers below). */
function TierCard({ group, tier, state, note }: { group: string; tier: number; state: 'active' | 'chosen' | 'next' | 'idle'; note?: string }) {
  const effs = PRINCIPLES[group].levels[tier - 1];
  const imp = PRINCIPLES[group].imposes;
  const bloc = effs.filter((e) => e.key === 'cohesion');
  const rows: [string, Effect[]][] = [['Cả khối', effs.filter((e) => e.who === 'all')], ['Chỉ nước đứng đầu', effs.filter((e) => e.who === 'leader' && e.key !== 'cohesion')], ['Thành viên (không gồm nước đứng đầu)', effs.filter((e) => e.who === 'members')]];
  const imposes = imp && tier >= imp.level ? imp.groups : [];
  return (
    <div style={`border:1px solid var(--line,#555);border-radius:6px;padding:6px 8px;margin-top:6px;${state === 'active' ? 'border-color:var(--gold,#c9a24a)' : state === 'idle' ? 'opacity:.75' : ''}`}>
      <div class="oh"><span class="ot">{PRINCIPLE_VI[group][0]} {LEVEL_VI[tier]}</span>{state === 'active' ? <span class="tag up">đang có hiệu lực</span> : state === 'chosen' ? <span class="tag warn">đã chọn, chưa đủ gắn kết</span> : note ? <span class="tag flat">{note}</span> : null}</div>
      {bloc.length > 0 && <div class="s"><b>Khối:</b> {bloc.map((e) => EFFECT_VI[e.key](e.value)).join(' · ')}</div>}
      {rows.filter(([, l]) => l.length).map(([who, l]) => <div class="s" key={who}><b>{who}:</b><ul style="margin:0 0 0 16px;padding:0">{l.map((e, k) => <li key={k}>{EFFECT_VI[e.key](e.value)}</li>)}</ul></div>)}
      {imposes.length > 0 && <div class="s"><b>Nước đứng đầu được:</b> áp luật {imposes.map((g) => GROUP_VI[g].toLowerCase()).join(', ')} lên thành viên</div>}
      {tier > 1 && <div class="s dim">Gồm cả hiệu lực bậc dưới · cần độ gắn kết ≥ {LEVEL_COHESION[tier]}</div>}
    </div>
  );
}
/** The three tiers I/II/III of a principle. `chosen` = the tier picked, `working` = the tier in force. */
function PrincipleLevels({ group, current, chosen = current, costFrom }: { group: string; current: number; chosen?: number; costFrom?: number }) {
  return <div>{[1, 2, 3].map((t) => {
    const state = t === current ? 'active' : t === chosen && chosen > current ? 'chosen' : t > chosen ? 'next' : 'idle';
    const cost = costFrom !== undefined && t > costFrom ? t - costFrom : 0;
    return <TierCard key={t} group={group} tier={t} state={state} note={state === 'next' && cost ? `cần ${cost} ủy nhiệm` : undefined} />;
  })}</div>;
}

function IdentityCard({ k, cur, onPick, why }: { k: BlocIdentity; cur?: boolean; onPick?: () => void; why?: string | null }) {
  const t = IDENTITY_TEXT[k];
  return (
    <div class={`option${cur ? ' cur' : ''}`} onClick={onPick} style={onPick ? 'cursor:pointer' : ''}>
      <div class="oh"><span class="ot">{t.name}</span>{why !== undefined && <span class={`tag ${why ? 'down' : 'up'}`}>{why ? 'chưa đủ điều kiện' : 'đủ điều kiện'}</span>}</div>
      <div class="s">{t.idea}</div>
      <div class="s" style="margin-top:4px"><b>Điều kiện lập:</b> {t.need}</div>
      <div class="s"><b>Gắn kết đến từ:</b> {t.cohesion}</div>
      <div class="s"><b>Nhóm nguyên tắc chính (phải giữ ít nhất một):</b> {PRIMARY_GROUPS[k].map((g) => PRINCIPLE_VI[g][0]).join(', ')}</div>
      {IDENTITY_IMPOSES[k].length > 0 && <div class="s"><b>Áp luật lên thành viên:</b> {IDENTITY_IMPOSES[k].map((g) => GROUP_VI[g].toLowerCase()).join(', ')}</div>}
      <div class="s" style="margin-top:4px"><b>Nước đứng đầu được:</b></div><Bullets items={t.leader} />
      <div class="s"><b>Thành viên được:</b></div><Bullets items={t.members} />
      <div class="s"><b>Thành viên phải chịu:</b></div><Bullets items={t.duties} />
    </div>
  );
}

export function PowerBlocsTab({ st }: { st: GameState }) {
  const id = viewedId(st); const mine = canCommand(st, id);
  const b = blocOf(st, id);
  const others = Object.values(st.powerBlocs ?? {}).filter((x) => x.id !== b?.id);
  return (
    <div class="pad">
      <div class="note" style="margin-top:0">Khối quyền lực: một cường quốc lập khối với một <b>bản sắc</b> (quyết định điều kiện, nguồn gắn kết, quyền và nghĩa vụ) và các <b>nguyên tắc</b> (mỗi nguyên tắc có 3 bậc I, II, III với hiệu lực cụ thể). Mỗi bản sắc có hai nhóm nguyên tắc chính. Khối tích lũy <b>ủy nhiệm</b> theo thời gian; nâng nguyên tắc tốn số ủy nhiệm bằng số bậc nâng. Có 2 ô nguyên tắc, thêm ô khi khối mạnh và đông. Độ gắn kết quyết định bậc tối đa (II cần 40, III cần 70); gắn kết thấp thì thành viên bỏ đi.</div>
      {b ? <BlocCard st={st} b={b} me={id} mine={mine} /> : <FoundCard st={st} id={id} mine={mine} />}
      {others.length > 0 && <Sec title="Các khối khác" x={`${others.length}`}>
        {others.map((o) => <OtherBloc key={o.id} st={st} o={o} me={id} inBloc={!!b} />)}
      </Sec>}
    </div>
  );
}

function OtherBloc({ st, o, me, inBloc }: { st: GameState; o: PowerBloc; me: string; inBloc: boolean }) {
  const [open, setOpen] = useState(false);
  const lev = leverage(st, o.leader, me);
  return (
    <div class="option">
      <div class="oh" onClick={() => setOpen(!open)} style="cursor:pointer"><span class="ot">{o.name} · {shortName(st, o.leader)}</span><span class="tag flat">{blocName(o, st)} · {o.members.length} nước · gắn kết {fmt(o.cohesion)}</span></div>
      {open && <>
        <div class="s" style="margin-top:4px">Thành viên: {o.members.map((m) => shortName(st, m)).join(', ')}</div>
        <div class="s">Nguyên tắc: {Object.keys(o.principles).map((g) => `${PRINCIPLE_VI[g]?.[0] ?? g} ${LEVEL_VI[principleLevel(o, g)]}`).join(' · ')}</div>
        {o.leader !== me && <>
          <div class="s" style="margin-top:6px"><b>Nếu {shortName(st, me)} gia nhập, sẽ được và phải chịu:</b></div>
          <EffectList mods={blocModsFor(st, o, me)} />
          <div class="s" style="margin-top:4px">Nghĩa vụ: {IDENTITY_TEXT[o.identity].duties.join('; ')}.</div>
          <div class="s">Đòn bẩy của {shortName(st, o.leader)} với {shortName(st, me)}: {fmt(lev)}{inBloc ? ' (bạn đang ở khối khác)' : ''}</div>
        </>}
      </>}
    </div>
  );
}

function FoundCard({ st, id, mine }: { st: GameState; id: string; mine: boolean }) {
  const why = canFound(st, id);
  const [name, setName] = useState(`Khối ${shortName(st, id)}`);
  const [identity, setIdentity] = useState<BlocIdentity>('trade_league');
  const [principle, setPrinciple] = useState<string>(PRIMARY_GROUPS.trade_league[0]);
  const c = st.countries[id];
  const req = c ? identityRequirement(st, c, identity) : null;
  const allowed = PRIMARY_GROUPS[identity];
  return (
    <Sec title="Lập khối quyền lực">
      {why ? <div class="note">Chưa thể lập khối: {why === 'Only a great power can found a bloc' ? `chỉ cường quốc (top ${BLOC.foundRank} sức mạnh) mới lập được khối.` : why === 'Already in a bloc' ? 'nước này đang ở trong một khối.' : 'nước này không có chủ quyền đầy đủ.'}</div> : null}
      <div class="s" style="margin:6px 0">Bản sắc (chọn một):</div>
      {BLOC_IDENTITIES.map((k) => <IdentityCard key={k} k={k} cur={identity === k} why={c ? identityRequirement(st, c, k) : null} onPick={() => { setIdentity(k); if (!isPrimary(k, principle)) setPrinciple(PRIMARY_GROUPS[k][0]); }} />)}
      {!why && mine && <>
        <div class="kv"><span class="k">Tên khối</span><span class="v"><input value={name} maxLength={48} onInput={(e) => setName((e.target as HTMLInputElement).value)} /></span></div>
        <div class="s" style="margin:6px 0">Nguyên tắc đầu tiên (một nhóm chính của bản sắc, bậc I, miễn phí):</div>
        {allowed.map((g) => <div class={`option${principle === g ? ' cur' : ''}`} key={g} onClick={() => setPrinciple(g)} style="cursor:pointer"><div class="oh"><span class="ot">{PRINCIPLE_VI[g][0]}</span></div><div class="s">{PRINCIPLE_VI[g][1]}</div><PrincipleLevels group={g} current={principle === g ? 1 : 0} /></div>)}
        {req && <div class="note">Chưa đủ điều kiện cho {IDENTITY_TEXT[identity].name}: {IDENTITY_TEXT[identity].need}</div>}
        <div style="margin-top:8px"><button class="btn" disabled={!!req} onClick={() => send({ type: 'found_bloc', name, identity, principle }, `Lập ${name}`)}>Lập khối</button></div>
      </>}
    </Sec>
  );
}

function BlocCard({ st, b, me, mine }: { st: GameState; b: PowerBloc; me: string; mine: boolean }) {
  const leader = b.leader === me;
  const slots = principleSlots(b); const maxL = maxPrincipleLevel(b);
  const mandates = b.mandates ?? 0; const next = monthsToMandate(b);
  const chosen = Object.keys(b.principles);
  const parts = cohesionParts(st, b);
  const sampleMember = b.members.find((m) => m !== b.leader);
  const [lev, setLev] = useState<string | null>(null);
  const candidates = Object.values(st.countries).filter((c) => c.alive && !c.decentralized && !b.members.includes(c.id))
    .map((c) => ({ id: c.id, lev: leverage(st, b.leader, c.id), ok: c.id === st.player || wouldJoin(st, b, c.id) }))
    .sort((x, y) => y.lev - x.lev).slice(0, 12);
  const free = Object.keys(PRINCIPLES).filter((g) => !(g in b.principles) && principleAllowed(g, b.identity));
  const lead = mine && leader;
  const L = st.countries[b.leader];
  const imposable = imposableGroups(b);
  const primaryCount = chosen.filter((g) => isPrimary(b.identity, g)).length;
  return (
    <>
      <div class="metrics">
        <Metric label={b.name} icon="diplomacy" value={blocName(b, st)} d={<span class="dim">đứng đầu: {shortName(st, b.leader)} · hạng {blocRank(st, b)}</span>} />
        <Metric label="Độ gắn kết" icon="legitimacy" value={fmt(b.cohesion)} d={<span class={b.cohesion < BLOC.lowCohesion ? 'neg' : 'dim'}>{b.cohesion < BLOC.lowCohesion ? 'thấp: thành viên có thể bỏ đi' : `bậc tối đa ${LEVEL_VI[maxL]}`}</span>} />
        <Metric label="Ủy nhiệm" icon="scroll" value={`${fmt(mandates)}/${BLOC.mandateMax}`} d={<span class="dim">{Number.isFinite(next) ? `cái tiếp theo sau ~${next} tháng` : mandates >= BLOC.mandateMax ? 'đã đầy' : 'không tăng'}</span>} />
        <Metric label="Thành viên" icon="people" value={fmt(b.members.length)} d={<span class="dim">ô nguyên tắc {chosen.length}/{slots}</span>} />
      </div>
      <Sec title="Hiệu lực đang có">
        <div class="s"><b>{shortName(st, b.leader)} (đứng đầu) được:</b></div>
        <EffectList mods={blocModsFor(st, b, b.leader)} />
        {sampleMember && <><div class="s" style="margin-top:6px"><b>Mỗi thành viên được và phải chịu:</b></div><EffectList mods={blocModsFor(st, b, me !== b.leader ? me : sampleMember)} /></>}
        {imposable.length > 0 && <div class="s" style="margin-top:6px"><b>Nước đứng đầu có thể áp luật:</b> {imposable.map((g) => GROUP_VI[g].toLowerCase()).join(', ')} (cần gắn kết ≥ {BLOC.imposeCohesion} và quan hệ dương; mỗi lần: quan hệ {BLOC.imposeRelation}, gắn kết −{BLOC.imposeCost})</div>}
        <div class="s" style="margin-top:6px"><b>Nghĩa vụ của thành viên:</b> {IDENTITY_TEXT[b.identity].duties.join('; ')}.</div>
      </Sec>
      <Sec title="Độ gắn kết hướng tới" x={fmt(Math.max(0, Math.min(100, Object.values(parts).reduce((a, x) => a + x, 0))))}>
        {Object.entries(parts).filter(([k, v]) => v || k === 'base').map(([k, v]) => <div class="kv" key={k}><span class="k">{COHESION_VI[k]}</span><span class={`v ${v > 0 && k !== 'base' ? 'pos' : v < 0 ? 'neg' : ''}`}>{v > 0 && k !== 'base' ? '+' : ''}{fmt(v)}</span></div>)}
        <div class="s dim">{IDENTITY_TEXT[b.identity].cohesion} Bậc II cần gắn kết ≥ 40, bậc III cần ≥ 70. Ô thứ 3: khối hạng ≤ 5 và ≥ 5 thành viên; ô thứ 4: hạng ≤ 3 và ≥ 10 thành viên.</div>
      </Sec>
      <Sec title="Nguyên tắc" x={`${mandates} ủy nhiệm`}>
        {chosen.map((g) => {
          const work = principleLevel(b, g); const cur = b.principles[g];
          return (
            <div class="option" key={g}>
              <div class="oh"><span class="ot">{PRINCIPLE_VI[g][0]} {LEVEL_VI[cur]}{isPrimary(b.identity, g) ? ' · nhóm chính' : ''}</span><span class={`tag ${work ? 'up' : 'flat'}`}>{work ? `đang có hiệu lực: bậc ${LEVEL_VI[work]}` : 'chưa có hiệu lực'}</span></div>
              <div class="s">{PRINCIPLE_VI[g][1]}</div>
              <PrincipleLevels group={g} current={work} chosen={cur} costFrom={cur} />
              {lead && <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">
                {[1, 2, 3].filter((l) => l !== cur && l <= maxL).map((l) => { const cost = Math.max(0, l - cur); return <button key={l} class="btn sm" disabled={cost > mandates} onClick={() => send({ type: 'bloc_principle', group: g, level: l }, `${PRINCIPLE_VI[g][0]} ${LEVEL_VI[l]}`)}>{l > cur ? 'Nâng lên' : 'Hạ xuống'} {LEVEL_VI[l]}{cost ? ` (${cost} ủy nhiệm)` : ''}</button>; })}
                {!(isPrimary(b.identity, g) && primaryCount <= 1) && <button class="btn sm" onClick={() => send({ type: 'bloc_principle', group: g, level: 0 }, `Bỏ ${PRINCIPLE_VI[g][0]}`)}>Bỏ</button>}
              </div>}
            </div>
          );
        })}
        {lead && chosen.length < slots && free.map((g) => <div class="option" key={g}><div class="oh"><span class="ot">{PRINCIPLE_VI[g][0]}{isPrimary(b.identity, g) ? ' · nhóm chính' : ''}</span><button class="btn sm" disabled={mandates < 1} onClick={() => send({ type: 'bloc_principle', group: g, level: 1 }, `Thêm ${PRINCIPLE_VI[g][0]}`)}>Chọn bậc I (1 ủy nhiệm)</button></div><div class="s">{PRINCIPLE_VI[g][1]}</div><PrincipleLevels group={g} current={0} costFrom={0} /></div>)}
      </Sec>
      <Sec title="Thành viên" x={`${b.members.length}`}>
        {b.members.map((m) => {
          const p = m === b.leader ? null : leverageParts(st, b.leader, m);
          const c = st.countries[m];
          const canImpose = lead && m !== b.leader ? imposable.filter((g) => !imposeBlocker(st, b, m, g)) : [];
          return (
            <div key={m}>
              <div class="kv"><span class="k"><CountryLink st={st} id={m} />{m === b.leader ? ' (đứng đầu)' : c.overlord === b.leader ? ' (chư hầu)' : ''}</span><span class="v">
                {p && <span style="cursor:pointer;text-decoration:underline dotted" onClick={() => setLev(lev === m ? null : m)}>đòn bẩy {fmt(leverage(st, b.leader, m))}</span>}
                {lead && m !== b.leader && <>
                  {L.blocMods?.subjugate && !c.overlord ? <button class="btn sm" style="margin-left:8px" onClick={() => send({ type: 'bloc_subjugate', target: m }, `Bảo hộ ${shortName(st, m)}`)}>Biến thành xứ bảo hộ</button> : null}
                  {canImpose.map((g) => <button key={g} class="btn sm" style="margin-left:8px" onClick={() => send({ type: 'bloc_impose_law', target: m, group: g }, `Áp luật ${GROUP_VI[g].toLowerCase()} lên ${shortName(st, m)}`)}>Áp luật {GROUP_VI[g].toLowerCase()}: {lawVi(L.laws[g])}</button>)}
                  <button class="btn sm" style="margin-left:8px" onClick={() => send({ type: 'bloc_expel', target: m }, `Trục xuất ${shortName(st, m)}`)}>Trục xuất</button>
                </>}
              </span></div>
              {p && lev === m && <div style="margin:0 0 6px 12px">{Object.entries(p).filter(([, v]) => v).map(([k, v]) => <div class="kv" key={k}><span class="k s">{LEVER_VI[k]}</span><span class={`v ${v > 0 ? 'pos' : 'neg'}`}>{v > 0 ? '+' : ''}{fmt(v)}</span></div>)}</div>}
            </div>
          );
        })}
      </Sec>
      {lead && <Sec title="Mời gia nhập" x="đòn bẩy cao nhất">
        <div class="note" style="margin-top:0">Một nước nhận lời khi đòn bẩy của bạn (cộng mức hợp bản sắc) hơn đòn bẩy của mọi khối khác ít nhất {BLOC.joinMargin}, quan hệ không xấu và không là đối thủ.{b.identity === 'religious_convocation' ? ' Hội đồng tôn giáo chỉ nhận nước cùng tôn giáo.' : ''}</div>
        {candidates.map((c) => <div class="kv" key={c.id}><span class="k"><CountryLink st={st} id={c.id} /></span><span class="v">đòn bẩy {fmt(c.lev)} · <span class={c.ok ? 'pos' : 'neg'}>{c.id === st.player ? 'người chơi' : c.ok ? 'sẽ nhận lời' : 'sẽ từ chối'}</span><button class="btn sm" style="margin-left:8px" disabled={!c.ok} onClick={() => send({ type: 'bloc_invite', target: c.id }, `Mời ${shortName(st, c.id)}`)}>Mời</button></span></div>)}
      </Sec>}
      {mine && <div style="margin-top:8px"><button class="btn sm" onClick={() => send({ type: 'bloc_leave' }, leader ? `Giải tán ${b.name}` : `Rời ${b.name}`)}>{leader ? 'Giải tán khối' : 'Rời khối'}</button></div>}
    </>
  );
}

/** For the journal invitation card: what joining gives and costs. */
export function JoinPreview({ st, b, id }: { st: GameState; b: PowerBloc; id: string }) {
  return <>
    <div class="s" style="margin-top:4px"><b>Gia nhập sẽ được và phải chịu:</b></div>
    <EffectList mods={blocModsFor(st, b, id)} />
    <div class="s">Nghĩa vụ: {IDENTITY_TEXT[b.identity].duties.join('; ')}.</div>
  </>;
}
