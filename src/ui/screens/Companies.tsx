// CO-5: companies of the viewed country (CO-1 ownership, CO-2 money). Read-only view of engine state:
// no simulation rule lives here. Names are shown in Vietnamese from the kind and headquarters region.
import type { Building, Company, GameState } from '../../engine/types';
import { companyLawAllows, COMPANY_PARAMS, unlockedOperationalKinds } from '../../engine/systems/companies';
import { data } from '../../engine/data/db';
import { Illustration } from '../components/Illustration';
import { illustrationFor } from '../game/content';
import { Sec, Metric, DBar, details } from '../components/ui';
import { BUILD_VI, companyKindName, techName, fmt, pct, money, compact } from '../i18n/vi';
import { viewedId, focusRegion, regionName } from './common';

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
      <Sec title="Cơ sở sở hữu" x="chạm để xem trên bản đồ">
        {co.sites.map((k) => { const [r, b] = k.split('|'); return (
          <div class="row tap" key={k} onClick={() => focusRegion(r)}><div class="grow"><div class="t sm">{regionName(r)}</div><div class="s">{BUILD_VI[b as Building]}</div></div><span class="num">cấp {siteLevels(st, k)}</span></div>
        ); })}
      </Sec>
      {kind?.rights.length ? <div class="note">Đặc quyền ({kind.rights.length}): chưa có hiệu lực, cần cơ sở pháp lý và hiến chương.</div> : null}
    </div>
  ) });
}

export function CompaniesTab({ st }: { st: GameState }) {
  const id = viewedId(st); const c = st.countries[id]; const sel = details.use()?.key;
  const cos = Object.values(st.companies ?? {}).filter((co) => co.home === id).sort((a, b) => b.lastProfit - a.lastProfit || a.id.localeCompare(b.id));
  const sum = (f: (co: Company) => number) => cos.reduce((s, co) => s + f(co), 0);
  const present = new Set(cos.map((co) => co.kind));
  const possible = c ? unlockedOperationalKinds(c).filter((k) => !present.has(k.id)) : [];
  return (
    <div class="pad">
      <div class="metrics">
        <Metric label="Công ty" icon="buildings" value={fmt(cos.length)} d={<span class="dim">tối đa {COMPANY_PARAMS.maxPerCountry}</span>} />
        <Metric label="Lợi nhuận / tháng" icon="gdp" value={money(sum((co) => co.lastProfit))} d={<span class="dim">cổ tức {compact(sum((co) => co.lastDividend))}</span>} />
        <Metric label="Tiền mặt công ty" icon="treasury" value={money(sum((co) => co.cash))} d={<span class="dim">đã đầu tư {compact(sum((co) => co.invested))}</span>} />
      </div>
      {cos.length ? (
        <table class="dt">
          <thead><tr><th>Công ty</th><th class="r">Cơ sở</th><th>Thịnh vượng</th><th class="r">Lợi nhuận/tháng</th></tr></thead>
          <tbody>
            {cos.map((co) => (
              <tr key={co.id} class={sel === `co:${co.id}` ? 'on' : ''} onClick={() => openCompany(st, co)}>
                <td><div class="nm">{companyKindName(co.kind)}</div><div class="sub ellipsis" style="max-width:220px">{regionName(co.hq)}</div></td>
                <td class="r num">{co.sites.length}</td>
                <td><DBar v={co.prosperity} w={70} /></td>
                <td class={`r num ${co.lastProfit >= 0 ? '' : 'neg'}`}>{co.lastProfit >= 0 ? '' : '−'}{compact(Math.abs(co.lastProfit))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <div class="empty">Chưa có công ty nào ở quốc gia này.</div>}
      <Sec title="Điều kiện thành lập công ty">
        <div class="kv"><span class="k">Luật cho phép công ty cổ phần</span><span class={`v ${c && companyLawAllows(c) ? 'pos' : 'neg'}`}>{c && companyLawAllows(c) ? 'Có' : 'Chưa (cần kinh tế không truyền thống và công nghệ Ngân hàng cổ phần)'}</span></div>
        <div class="note">Một loại công ty được mở khóa bằng công nghệ; công ty chỉ thành lập khi có ít nhất {COMPANY_PARAMS.minLevels} cấp công trình phù hợp chưa có chủ.</div>
        {possible.length ? possible.map((k) => <div class="row" key={k.id}><div class="grow"><div class="t sm">{companyKindName(k.id)}</div><div class="s">{k.buildings.map((b) => BUILD_VI[b as Building]).join(', ')} · {k.unlocked_by.map(techName).join(', ')}</div></div></div>) : <div class="empty sm">Không còn loại công ty đã mở khóa nào chưa thành lập.</div>}
      </Sec>
    </div>
  );
}
