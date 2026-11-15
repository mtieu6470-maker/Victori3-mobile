// Selected region ("state") on the map: compact card + full region detail.
import type { GameState } from '../../engine/types';
import { STRATA, BUILDINGS } from '../../engine/types';
import { data } from '../../engine/data/db';
import { Icon } from '../components/icons';
import { QualityMark, Section, modals } from '../components/ui';
import { STRATA_VI, BUILD_VI, fmt, pct, compact } from '../i18n/vi';
import { shortName } from '../game/names';
import { Flag } from './common';
import { ui } from '../game/ui';
import { openCountryActions } from './Diplomacy';

const RES_VI: Record<string, string> = { grain: 'Ngũ cốc', fish: 'Cá', live: 'Gia súc', coal: 'Than', iron: 'Sắt', timb: 'Gỗ', cash: 'Cây công nghiệp', lux: 'Hàng xa xỉ', cott: 'Bông', silv: 'Bạc', gold: 'Vàng', opium: 'Thuốc phiện' };
const TERRAIN_VI: Record<string, string> = { pl: 'Đồng bằng', hi: 'Đồi', mo: 'Núi', st: 'Thảo nguyên', sa: 'Xavan', ju: 'Rừng nhiệt đới', ma: 'Đầm lầy', de: 'Sa mạc', tu: 'Lãnh nguyên', fo: 'Rừng' };

export function StateCard({ st, id, portrait }: { st: GameState; id: string; portrait: boolean }) {
  const r = st.regions.find((x) => x.id === id); if (!r) return null;
  const dbr = data().region.get(id); const owner = st.countries[r.owner];
  const occupied = r.controller !== r.owner;
  return (
    <div class="statecard" style={portrait ? 'left:6px;right:6px;bottom:6px' : 'right:10px;bottom:72px;width:min(340px,42%)'}>
      <div class="sh">
        <h3 class="ellipsis">{dbr?.name ?? id}</h3>
        <button class="round sm" aria-label="Đóng" onClick={() => ui.set({ region: null, regionDetail: false })}><Icon name="close" /></button>
      </div>
      <div class="body">
        <div class="own" style="margin-bottom:6px"><Flag c={owner} sm /><span>{owner?.decentralized ? 'Chính thể phi tập trung' : shortName(st, r.owner)}</span>{occupied && <span class="chip down">bị {shortName(st, r.controller)} chiếm</span>}</div>
        <div class="kv">
          <div><div class="k">Dân số</div><div class="v num">{compact(r.pop)} {dbr && <QualityMark quality={dbr.pop_quality} />}</div></div>
          <div><div class="k">Mức sống</div><div class="v num">{fmt(r.sol, 2)}</div></div>
          <div><div class="k">Biết chữ</div><div class="v num">{pct(r.literacy)}</div></div>
        </div>
        <div class="btns" style="margin-top:8px">
          <button class="btn sm" onClick={() => modals.open(dbr?.name ?? id, () => <RegionDetail st={st} id={id} />)}>Chi tiết vùng</button>
          {owner && !owner.decentralized && <button class="btn sm" onClick={() => r.owner === st.player ? ui.set({ country: r.owner, screen: 'country', tabs: { ...ui.get().tabs, country: 'overview' } }) : openCountryActions(st, r.owner)}>Quốc gia</button>}
        </div>
      </div>
    </div>
  );
}

export function RegionDetail({ st, id }: { st: GameState; id: string }) {
  const r = st.regions.find((x) => x.id === id); if (!r) return <div class="empty">Không tìm thấy vùng.</div>;
  const dbr = data().region.get(id);
  const blds = BUILDINGS.filter((b) => r.buildings[b] > 0);
  return (
    <div>
      <div class="plates c3">
        <div class="plate stat"><div class="k">Dân số {dbr && <QualityMark quality={dbr.pop_quality} />}</div><div class="v num">{compact(r.pop)}</div></div>
        <div class="plate stat"><div class="k">Diện tích</div><div class="v num">{compact(r.area)} km²</div></div>
        <div class="plate stat"><div class="k">Sản lượng tháng</div><div class="v num">¤ {compact(r.output)}</div></div>
      </div>
      <Section title="Xã hội">
        <div class="rowline"><span class="grow">Văn hóa</span><b class="serif">{r.culture.replace(/_/g, ' ')}{r.culture2 ? ` · ${r.culture2.replace(/_/g, ' ')} (${pct(r.c2)})` : ''}</b></div>
        <div class="rowline"><span class="grow">Tôn giáo</span><b class="serif">{r.religion.replace(/_/g, ' ')}</b></div>
        <div class="rowline"><span class="grow">Mức sống · biết chữ</span><b class="num">{fmt(r.sol, 2)} · {pct(r.literacy)}</b></div>
        <div class="rowline"><span class="grow">Bất ổn · cực đoan · tinh thần dân tộc</span><b class="num">{pct(r.unrest)} · {pct(r.radical)} · {pct(r.nationalism)}</b></div>
        {r.devastation > 0.01 && <div class="rowline"><span class="grow">Tàn phá do chiến tranh</span><b class="num neg">{pct(r.devastation)}</b></div>}
        {r.epidemic && <div class="rowline"><span class="grow neg">Dịch bệnh đang diễn ra</span></div>}
        {r.blight && <div class="rowline"><span class="grow neg">Mất mùa đang diễn ra</span></div>}
      </Section>
      <Section title="Tầng lớp">{STRATA.map((s, i) => r.strata[i] > 0.002 && <div class="rowline" key={s} style="min-height:30px"><span class="grow">{STRATA_VI[s]}</span><span class="num">{pct(r.strata[i], 1)}</span></div>)}</Section>
      <Section title="Địa lý & tài nguyên">
        <div class="rowline"><span class="grow">Địa hình</span><b class="serif">{TERRAIN_VI[r.terrain] ?? r.terrain}{r.coastal ? ' · ven biển' : ''}</b></div>
        <div class="rowline"><span class="grow">Tài nguyên</span><b class="serif" style="white-space:normal;text-align:right">{r.res.length ? r.res.map((x) => RES_VI[x] ?? x).join(', ') : '—'}</b></div>
      </Section>
      <Section title="Công trình">{blds.length ? blds.map((b) => <div class="rowline" key={b}><span class="grow serif" style="font-size:15px">{BUILD_VI[b]}</span><b class="num">cấp {r.buildings[b]}</b></div>) : <div class="empty">Chưa có công trình.</div>}</Section>
    </div>
  );
}
