// CO-5: companies of the viewed country (CO-1 ownership, CO-2 money). Read-only view of engine state:
// no simulation rule lives here. Names are shown in Vietnamese from the kind and headquarters region.
import type { Building, Company, GameState } from '../../engine/types';
import { charterBlocker, charterLimit, CHARTER_PARAMS, companyLawAllows, companySlots, COMPANY_PARAMS, foundCompanyBlocker, LEVELS_PER_SLOT, SLOTS_BY_ECONOMY_LAW, unlockedOperationalKinds } from '../../engine/systems/companies';
import { data } from '../../engine/data/db';
import { Illustration } from '../components/Illustration';
import { illustrationFor } from '../game/content';
import { Sec, Metric, DBar, details } from '../components/ui';
import { BUILD_VI, companyKindName, techName, fmt, pct, money, compact } from '../i18n/vi';
import { viewedId, focusRegion, regionName, canCommand, send } from './common';

const CHARTER_BLOCK_VI = (b: string | null) => !b ? 'Có thể cấp hiến chương độc quyền.' :
  /law/.test(b) ? 'Luật kinh tế hiện tại không cho phép độc quyền.' : /prosperous/.test(b) ? 'Công ty chưa đủ thịnh vượng để nhận hiến chương.' :
  /No free charter/.test(b) ? 'Đã dùng hết số hiến chương được phép.' : /Another company/.test(b) ? 'Công ty khác đã giữ độc quyền ngành này.' : 'Chưa thể cấp hiến chương.';

export const companyTitle = (co: Company) => `${companyKindName(co.kind)} ${regionName(co.hq)}`;

function siteLevels(st: GameState, key: string): number {
  const [regionId, b] = key.split('|');
  return st.regions[data().regionIndex.get(regionId) ?? -1]?.buildings[b as Building] ?? 0;
}

export function openCompany(st: GameState, co: Company) {
  const kind = data().db.company_kinds.find((k) => k.id === co.kind);
  const levels = co.sites.reduce((s, k) => s + siteLevels(st, k), 0);
  const founded = { y: 1836 + Math.floor(co.founded / 12), m: (co.founded % 12) + 1 };
  details.toggle({ key: `co:${co.id}`, title: companyTitle(co), ctx: `${co.sites.length} cơ sở · ${fmt(levels)} cấp`, body: () => (
    <div>
      {illustrationFor('company', co.kind) ? <Illustration kind="company" subject={co.kind} /> : kind?.buildings[0] ? <Illustration kind="building" subject={kind.buildings[0]} /> : null}
      <div class="kv"><span class="k">Loại hình</span><span class="v">{companyKindName(co.kind)}</span></div>
      <div class="kv"><span class="k">Trụ sở</span><span class="v"><a class="lnk" onClick={() => focusRegion(co.hq)}>{regionName(co.hq)} ›</a></span></div>
      <div class="kv"><span class="k">Thành lập</span><span class="v">tháng {founded.m}/{founded.y}</span></div>
      {kind && <div class="kv"><span class="k">Mở khóa bởi</span><span class="v">{kind.unlocked_by.map(techName).join(' · ')}</span></div>}
      <div class="kv"><span class="k">Thịnh vượng</span><span class="v"><DBar v={co.prosperity} w={90} /> <span class="num">{fmt(co.prosperity * 100, 0)}</span></span></div>
      <Sec title="Tài chính (tháng gần nhất)" icon="treasury">
        <div class="kv"><span class="k">Doanh thu</span><span class="v num">{money(co.lastRevenue)}</span></div>
        <div class="kv"><span class="k">Chi phí (nguyên liệu, lương)</span><span class="v num">{money(co.lastCost)}</span></div>
        <div class="kv"><span class="k">Lợi nhuận</span><span class={`v num ${co.lastProfit >= 0 ? 'pos' : 'neg'}`}>{co.lastProfit >= 0 ? '' : '−'}{money(Math.abs(co.lastProfit))}</span></div>
        <div class="kv"><span class="k">Cổ tức trả chủ sở hữu</span><span class="v num">{money(co.lastDividend)}</span></div>
        <div class="kv"><span class="k">Lợi nhuận giữ lại</span><span class="v num">{money(co.lastRetained)}</span></div>
        <div class="kv"><span class="k">Tiền mặt</span><span class="v num">{money(co.cash)}</span></div>
        <div class="kv"><span class="k">Đã tự đầu tư</span><span class="v num">{money(co.invested)}</span></div>
        {co.lossMonths > 0 && <div class="note neg">Lỗ {co.lossMonths} tháng liên tiếp; giải thể sau {COMPANY_PARAMS.dissolveAfterLossMonths} tháng.</div>}
        <div class="note">Chia {pct(COMPANY_PARAMS.payoutRatio, 0)} lợi nhuận làm cổ tức; phần giữ lại lấy từ tiết kiệm tư nhân và được dùng để mở rộng cơ sở.</div>
      </Sec>
      <Sec title="Hiến chương độc quyền" icon="laws">
        {co.charter
          ? <div class="note pos">Đang giữ độc quyền đến tháng {(co.charter.expires % 12) + 1}/{1836 + Math.floor(co.charter.expires / 12)}: nhà đầu tư tư nhân và công ty khác không được xây {(kind?.buildings ?? []).map((b) => BUILD_VI[b as Building]).join(', ')} trong nước. Nhà nước vẫn xây được.</div>
          : <div class="note">{CHARTER_BLOCK_VI(charterBlocker(st, co))}</div>}
        {canCommand(st, co.home) && (co.charter
          ? <button class="btn danger sm" onClick={() => { void send({ type: 'revoke_charter', company: co.id }, `Đã thu hồi hiến chương của ${companyKindName(co.kind)}`); }}>Thu hồi hiến chương</button>
          : !charterBlocker(st, co) && <button class="btn primary sm" onClick={() => { void send({ type: 'grant_charter', company: co.id }, `Đã cấp hiến chương độc quyền cho ${companyKindName(co.kind)}`); }}>Cấp hiến chương độc quyền</button>)}
        <div class="s dim">Chỉ cấp mới được dưới luật trọng thương hoặc can thiệp; hiến chương có thời hạn {fmt(CHARTER_PARAMS.termYears)} năm, đổi luật không tự xóa hiến chương đang có (chỉ hết hạn hoặc bị thu hồi). Cần thịnh vượng ≥ {fmt(CHARTER_PARAMS.minProsperity * 100, 0)}. Độc quyền không cộng chỉ số: lợi ích đến từ việc ít cạnh tranh hơn trên thị trường.</div>
      </Sec>
      <Sec title="Cơ sở sở hữu" x="chạm để xem trên bản đồ">
        {co.sites.map((k) => { const [r, b] = k.split('|'); return (
          <div class="row tap" key={k} onClick={() => focusRegion(r)}><div class="grow"><div class="t sm">{regionName(r)}</div><div class="s">{BUILD_VI[b as Building]}</div></div><span class="num">cấp {siteLevels(st, k)}</span></div>
        ); })}
      </Sec>
      {kind?.rights.length ? <div class="note">Đặc quyền ({kind.rights.length}): chưa có hiệu lực, cần cơ sở pháp lý và hiến chương.</div> : null}
    </div>
  ) });
}

/** Card art: the kind's own illustration, else its main building's; the 480 px variant when available. */
function cardArt(kindId: string): string | null {
  const kind = data().db.company_kinds.find((k) => k.id === kindId);
  const a = illustrationFor('company', kindId) ?? (kind?.buildings[0] ? illustrationFor('building', kind.buildings[0]) : undefined);
  return a ? (a.thumb ?? a.path) : null;
}
/** Generated emblem: initials of the Vietnamese kind name on a hue derived from the kind id. */
function Emblem({ kindId }: { kindId: string }) {
  let h = 0; for (const ch of kindId) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const words = companyKindName(kindId).split(/\s+/).filter((w) => w.length > 1 && w !== 'Công' && w !== 'ty');
  const initials = (words[0]?.[0] ?? '?') + (words[1]?.[0] ?? '');
  return <span class="co-emblem" style={`--h:${h % 360}`}>{initials.toUpperCase()}</span>;
}

function CompanyCard({ st, co, on }: { st: GameState; co: Company; on: boolean }) {
  const kind = data().db.company_kinds.find((k) => k.id === co.kind);
  const art = cardArt(co.kind);
  const levels = co.sites.reduce((s, k) => s + siteLevels(st, k), 0);
  return (
    <button class={`cocard${on ? ' on' : ''}`} onClick={() => openCompany(st, co)}>
      <div class="cocard-img" style={art ? `background-image:url(${art})` : ''}><Emblem kindId={co.kind} /></div>
      <div class="cocard-body">
        <div class="cocard-name">{companyKindName(co.kind)}{co.charter && <span class="chip charter" title="Hiến chương độc quyền">Độc quyền</span>}</div>
        <div class="cocard-hq">{regionName(co.hq)}</div>
        <div class="cocard-chips">{(kind?.buildings ?? []).map((b) => <span class="chip" key={b}>{BUILD_VI[b as Building]}</span>)}</div>
        <div class="cocard-prosp"><span class="lab">Thịnh vượng</span><DBar v={co.prosperity} w={96} /><span class={`num ${co.prosperity >= 0 ? 'pos' : 'neg'}`}>{co.prosperity >= 0 ? '+' : '−'}{fmt(Math.abs(co.prosperity) * 100, 0)}</span></div>
        <div class="cocard-stats">
          <div><span class="k">Lợi nhuận/th</span><b class={`num ${co.lastProfit >= 0 ? '' : 'neg'}`}>{co.lastProfit >= 0 ? '' : '−'}{compact(Math.abs(co.lastProfit))}</b></div>
          <div><span class="k">Tiền mặt</span><b class="num">{compact(co.cash)}</b></div>
          <div><span class="k">Cơ sở · cấp</span><b class="num">{co.sites.length} · {fmt(levels)}</b></div>
        </div>
      </div>
    </button>
  );
}

const BLOCKER_VI: [RegExp, string][] = [
  [/No free company slot/, 'Hết suất công ty'], [/economy law/, 'Luật kinh tế chưa cho phép'],
  [/already exists/, 'Đã có công ty loại này'], [/unowned building levels/, 'Chưa đủ công trình chưa có chủ'], [/Technology/, 'Chưa có công nghệ'],
];
const blockerVi = (b: string) => (BLOCKER_VI.find(([re]) => re.test(b))?.[1] ?? b) + (/\(has (\d+)\)/.test(b) ? ` (có ${b.match(/\(has (\d+)\)/)![1]}/${COMPANY_PARAMS.minLevels} cấp)` : '');

function PossibleCard({ st, kindId, buildings, techs, mine }: { st: GameState; kindId: string; buildings: string[]; techs: string[]; mine: boolean }) {
  const art = cardArt(kindId);
  const c = st.countries[viewedId(st)];
  const blocker = c ? foundCompanyBlocker(st, c, kindId) : 'Unknown';
  return (
    <div class={`cocard${blocker ? ' locked' : ' ready'}`}>
      <div class="cocard-img" style={art ? `background-image:url(${art})` : ''}><Emblem kindId={kindId} /></div>
      <div class="cocard-body">
        <div class="cocard-name">{companyKindName(kindId)}</div>
        <div class={`cocard-hq ${blocker ? '' : 'pos'}`}>{blocker ? blockerVi(blocker) : 'Có thể thành lập'}</div>
        <div class="cocard-chips">{buildings.map((b) => <span class="chip" key={b}>{BUILD_VI[b as Building]}</span>)}</div>
        <div class="s dim">Mở khóa bởi: {techs.map(techName).join(', ')}</div>
        {mine && !blocker && <button class="btn primary sm" onClick={() => { void send({ type: 'found_company', kind: kindId }, `Đã thành lập ${companyKindName(kindId)}`); }}>Thành lập công ty</button>}
      </div>
    </div>
  );
}

export function CompaniesTab({ st }: { st: GameState }) {
  const id = viewedId(st); const c = st.countries[id]; const sel = details.use()?.key;
  const cos = Object.values(st.companies ?? {}).filter((co) => co.home === id).sort((a, b) => b.lastProfit - a.lastProfit || a.id.localeCompare(b.id));
  const sum = (f: (co: Company) => number) => cos.reduce((s, co) => s + f(co), 0);
  const present = new Set(cos.map((co) => co.kind));
  const possible = c ? unlockedOperationalKinds(c).filter((k) => !present.has(k.id)) : [];
  const allowed = !!c && companyLawAllows(c);
  const slots = c ? companySlots(st, c) : 0; const mine = canCommand(st, id);
  return (
    <div class="pad">
      <div class="metrics">
        <Metric label="Công ty / suất" icon="buildings" value={`${fmt(cos.length)} / ${fmt(slots)}`} d={<span class={allowed ? 'dim' : 'neg'}>{allowed ? `luật ${fmt(SLOTS_BY_ECONOMY_LAW[c!.laws.economy] ?? 0)} + công nghiệp ${fmt(slots - (SLOTS_BY_ECONOMY_LAW[c!.laws.economy] ?? 0))}` : 'luật chưa cho phép công ty cổ phần'}</span>} />
        <Metric label="Lợi nhuận / tháng" icon="gdp" value={money(sum((co) => co.lastProfit))} d={<span class="dim">cổ tức {compact(sum((co) => co.lastDividend))}</span>} />
        <Metric label="Tiền mặt công ty" icon="treasury" value={money(sum((co) => co.cash))} d={<span class="dim">đã đầu tư {compact(sum((co) => co.invested))}</span>} />
        <Metric label="Hiến chương độc quyền" icon="laws" value={`${fmt(cos.filter((co) => co.charter).length)} / ${fmt(c ? charterLimit(st, c) : 0)}`} d={<span class="dim">{c && charterLimit(st, c) ? 'luật cho phép độc quyền' : 'luật không cho phép'}</span>} />
      </div>
      {cos.length ? <div class="cogrid">{cos.map((co) => <CompanyCard key={co.id} st={st} co={co} on={sel === `co:${co.id}`} />)}</div> : <div class="empty">Chưa có công ty nào ở quốc gia này.</div>}
      {possible.length > 0 && <Sec title={`Có thể thành lập (${possible.length})`}>
        <div class="cogrid">{possible.map((k) => <PossibleCard key={k.id} st={st} kindId={k.id} buildings={k.buildings} techs={k.unlocked_by} mine={mine} />)}</div>
      </Sec>}
      <div class="note">Mỗi công ty cần một suất: luật kinh tế cho 0–3 suất, cứ {fmt(LEVELS_PER_SLOT)} cấp công nghiệp, mỏ và đường sắt thêm 1 suất (tối đa {COMPANY_PARAMS.maxPerCountry}). Thành lập cần công nghệ mở khóa và ít nhất {COMPANY_PARAMS.minLevels} cấp công trình phù hợp chưa có chủ. {pct(COMPANY_PARAMS.payoutRatio, 0)} lợi nhuận được chia cổ tức; phần còn lại dùng để mở rộng cơ sở.</div>
    </div>
  );
}
