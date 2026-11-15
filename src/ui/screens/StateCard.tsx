// Region ("state") context window opened by selecting the map: docked at the right edge in landscape, a bottom
// sheet in portrait. Everything shown is the region's current simulated state plus its 1836 provenance mark.
import type { GameState } from '../../engine/types';
import { STRATA, BUILDINGS } from '../../engine/types';
import { data } from '../../engine/data/db';
import { canBuild, buildingReturn, buildCost } from '../../engine/systems/economy';
import { QualityMark, Sec, Metric, StackBar, WinHead } from '../components/ui';
import { STRATA_VI, BUILD_VI, fmt, pct, compact, money } from '../i18n/vi';
import { shortName } from '../game/names';
import { Flag, openCountry, canCommand, STRATA_COL, regionName } from './common';
import { ui } from '../game/ui';
import { mapControls } from '../map/MapView';
import { openCountryActions } from './Diplomacy';

const RES_VI: Record<string, string> = { grain: 'Ngũ cốc', fish: 'Cá', live: 'Gia súc', coal: 'Than', iron: 'Sắt', timb: 'Gỗ', cash: 'Cây công nghiệp', lux: 'Hàng xa xỉ', cott: 'Bông', silv: 'Bạc', gold: 'Vàng', opium: 'Thuốc phiện' };
const TERRAIN_VI: Record<string, string> = { pl: 'Đồng bằng', hi: 'Đồi', mo: 'Núi', st: 'Thảo nguyên', sa: 'Xavan', ju: 'Rừng nhiệt đới', ma: 'Đầm lầy', de: 'Sa mạc', tu: 'Lãnh nguyên', fo: 'Rừng' };
const pretty = (s: string) => s.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());

export function RegionWindow({ st, id, style, portrait, onGrip }: { st: GameState; id: string; style: string; portrait: boolean; onGrip?: (e: PointerEvent) => void }) {
  const r = st.regions.find((x) => x.id === id); if (!r) return null;
  const dbr = data().region.get(id); const owner = st.countries[r.owner]; const occupied = r.controller !== r.owner;
  const close = () => ui.set({ region: null, regionDetail: false });
  const blds = BUILDINGS.filter((b) => r.buildings[b] > 0);
  const mine = canCommand(st, r.owner);
  const ops = mine && owner ? BUILDINGS.filter((b) => b !== 'university' && canBuild(st, owner, r, b)).map((b) => ({ b, ret: buildingReturn(st, owner, r, b), cost: buildCost(owner, b, st) })).filter((o) => o.ret > 0).sort((a, b) => b.ret - a.ret).slice(0, 4) : [];
  return (
    <section class="window region frame surface" style={style} aria-label={dbr?.name ?? id}>
      <WinHead title="Vùng" icon="pin" mod="country" ctx={owner?.decentralized ? 'chính thể phi tập trung' : shortName(st, r.owner)} grip={portrait} onGrip={onGrip} onClose={close} />
      <div class="win-body pad">
        <div class="banner-top" style={`--bc:${owner?.color ?? '#556677'}`}>
          <Flag c={owner} lg />
          <div class="grow">
            <h3 style="font-size:20px">{dbr?.name ?? id}</h3>
            <div class="meta">{owner?.decentralized ? 'Chính thể phi tập trung' : shortName(st, r.owner)}{r.id === owner?.capital ? ' · thủ đô' : ''}</div>
            <div class="meta dim">{TERRAIN_VI[r.terrain] ?? r.terrain}{r.coastal ? ' · ven biển' : ''} · {compact(r.area)} km²{occupied ? ` · bị ${shortName(st, r.controller)} chiếm` : ''}</div>
          </div>
        </div>
        <div class="metrics">
          <Metric label="Dân số" value={compact(r.pop)} q={dbr ? { quality: dbr.pop_quality } : null} />
          <Metric label="Mức sống" value={fmt(r.sol, 2)} />
          <Metric label="Biết chữ" value={pct(r.literacy)} />
          <Metric label="Sản lượng" value={`¤ ${compact(r.output)}`} d={<span class="dim">/ tháng</span>} />
        </div>
        <div class="btns" style="margin:10px 0 2px">
          {owner && !owner.decentralized && <button class="btn sm" onClick={() => openCountry(r.owner)}>Hồ sơ quốc gia</button>}
          {owner && !owner.decentralized && st.player && r.owner !== st.player && <button class="btn sm" onClick={() => openCountryActions(st, r.owner)}>Ngoại giao</button>}
          <button class="btn sm" onClick={() => mapControls.focusRegion(id, 0.012)}>Phóng tới vùng</button>
        </div>
        <Sec title="Xã hội" icon="society">
          <div class="kv"><span class="k">Văn hóa</span><span class="v">{pretty(r.culture)}{r.culture2 ? ` · ${pretty(r.culture2)} (${pct(r.c2)})` : ''}</span></div>
          <div class="kv"><span class="k">Tôn giáo</span><span class="v">{pretty(r.religion)}</span></div>
          <div class="kv"><span class="k">Bất ổn · cực đoan · dân tộc</span><span class="v num">{pct(r.unrest)} · {pct(r.radical)} · {pct(r.nationalism)}</span></div>
          {r.devastation > 0.01 && <div class="kv"><span class="k">Tàn phá do chiến tranh</span><span class="v num neg">{pct(r.devastation)}</span></div>}
          {r.epidemic && <div class="kv"><span class="k">Dịch bệnh</span><span class="v neg">đang diễn ra · tử vong {pct(r.epidemic.rate, 1)}/tháng</span></div>}
          {r.blight && <div class="kv"><span class="k">Mất mùa</span><span class="v neg">mức {pct(r.blight.severity)}</span></div>}
          <div style="margin-top:8px"><div class="sub-t">Tầng lớp</div><StackBar parts={STRATA.map((s, i) => ({ label: STRATA_VI[s], v: r.strata[i], c: STRATA_COL[i] }))} /></div>
        </Sec>
        <Sec title="Tài nguyên & công trình" icon="factory">
          <div class="kv"><span class="k">Tài nguyên</span><span class="v" style="white-space:normal">{r.res.length ? r.res.map((x) => RES_VI[x] ?? x).join(', ') : '—'}</span></div>
          {blds.length ? blds.map((b) => <div class="kv" key={b}><span class="k">{BUILD_VI[b]}</span><span class="v num">cấp {r.buildings[b]}</span></div>) : <div class="empty sm">Chưa có công trình.</div>}
        </Sec>
        {ops.length > 0 && (
          <Sec title="Có thể xây" icon="construction" go={() => ui.go('economy', 'construction')}>
            {ops.map((o) => <div class="kv" key={o.b}><span class="k">{BUILD_VI[o.b]}</span><span class="v num">{money(o.cost)} · <span class="pos">{pct(o.ret, 1)}/năm</span></span></div>)}
          </Sec>
        )}
        <div class="note">Vùng: {regionName(id)}. Dân số khởi đầu có ký hiệu độ tin cậy; chạm ký hiệu để xem nguồn. {dbr && <QualityMark quality={dbr.pop_quality} />}</div>
      </div>
    </section>
  );
}
