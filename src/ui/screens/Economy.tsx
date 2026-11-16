// Economy window: Overview (output, finance, employment, key goods), Market (goods grouped by category with the
// persisted market statistics; detail window per good), Buildings (grouped by sector; detail lists regions),
// Construction (opportunities ranked by the engine's own return estimate) and Budget (the engine's monthly lines).
import { useState } from 'preact/hooks';
import type { GameState, Good, Building, Region } from '../../engine/types';
import { GOODS, BUILDINGS } from '../../engine/types';
import { marketOf, buildCost, buildingReturn, canBuild, RECIPES, LEVEL_WORKERS, PRODUCTION_METHODS, availableProductionMethods, productionMethodFor, canQueueConstruction, MAX_CONSTRUCTION_QUEUE } from '../../engine/systems/economy';
import { Icon } from '../components/icons';
import { Sec, Metric, Delta, DBar, Bar, HBars, LineChart, Donut, Seg, modals, details, useWidth, useSort } from '../components/ui';
import { GOOD_VI, GOOD_GROUP, BUILD_VI, lawVi, fmt, pct, money, compact } from '../i18n/vi';
import { shortName } from '../game/names';
import { viewedId, canCommand, send, CountryLink, monthYear, focusRegion, regionName } from './common';
import { ui } from '../game/ui';

const GOOD_BG: Record<string, string> = { grain: '#4d4a2b', cash_crops: '#33502e', cotton: '#4d4c48', timber: '#4f3b25', coal: '#2c2f30', iron: '#3a4148', steel: '#33414d', textiles: '#57323f', tools: '#4a4230', arms: '#552f2a', luxury: '#46335f', opium: '#552c47' };
export function GoodIcon({ g }: { g: string }) { return <span class="gico" style={`background:${GOOD_BG[g]};color:#ecd9a8`}><Icon name={g} /></span>; }
const GROUPS: [string, string][] = [['agri', 'Nông sản'], ['raw', 'Nguyên liệu'], ['ind', 'Hàng công nghiệp'], ['cons', 'Hàng tiêu dùng']];
const SECTOR: Record<Building, string> = { plantation: 'Nông nghiệp & khai thác', mine: 'Nông nghiệp & khai thác', logging: 'Nông nghiệp & khai thác', textile_mill: 'Công nghiệp', ironworks: 'Công nghiệp', tool_works: 'Công nghiệp', arms_works: 'Công nghiệp', luxury_workshop: 'Công nghiệp', railway: 'Hạ tầng & giáo dục', university: 'Hạ tầng & giáo dục' };
const PRIMARY_OUT: Partial<Record<Building, string>> = { plantation: 'Nông sản hàng hóa, bông hoặc thuốc phiện (theo tài nguyên vùng)', mine: 'Than, sắt hoặc khoáng sản quý (theo tài nguyên vùng)', logging: 'Gỗ', railway: 'Tăng tiếp cận thị trường và sản lượng vùng', university: 'Tăng biết chữ và điểm nghiên cứu' };
const outText = (b: Building) => (RECIPES[b] ? GOOD_VI[RECIPES[b]!.out] : PRIMARY_OUT[b] ?? '—');
const B_ICON = (b: Building) => (b === 'railway' ? 'construction' : b === 'university' ? 'literacy' : 'buildings');

/** Actual employed headcount; null means a legacy region has not rebuilt its staffing ledger yet. */
function staffedWorkers(regions: Region[], building: Building): number | null {
  const relevant = regions.filter((region) => region.buildings[building] > 0);
  if (relevant.some((region) => !region.popEconomy?.employedByBuilding || !Object.prototype.hasOwnProperty.call(region.popEconomy.employedByBuilding, building))) return null;
  return relevant.reduce((sum, region) => sum + (region.popEconomy?.employedByBuilding?.[building] ?? 0), 0);
}

type Row = { g: Good; price: number; world: number; supply: number | null; demand: number | null; ratio: number | null; imports: number | null; short: number | null };
function marketRows(st: GameState, mk: string): Row[] {
  const prices = st.marketPrices[mk] ?? st.worldPrices; const stats = st.marketStats?.[mk];
  return GOODS.map((g) => { const s = stats?.[g]; return { g, price: prices[g], world: st.worldPrices[g], supply: s ? s.supply : null, demand: s ? s.demand : null, ratio: s && s.demand > 0 ? s.supply / s.demand : null, imports: s && s.demand > 0 ? s.imports / s.demand : null, short: s ? s.short : null }; });
}
const status = (r: Row): { label: string; cls: string } | null => {
  if (r.short === null || r.ratio === null) return null;
  if (r.short >= 0.1) return { label: `Thiếu ${pct(r.short)}`, cls: 'down' };
  if (r.ratio >= 1.5) return { label: 'Dư thừa', cls: 'up' };
  return { label: 'Cân bằng', cls: 'flat' };
};

// ---------------------------------------------------------------- overview
function Overview({ st }: { st: GameState }) {
  const id = viewedId(st); const c = st.countries[id]; const regs = st.regions.filter((r) => r.owner === id);
  const h = st.history[id] ?? []; const bal = c.income - c.expense; const mk = marketOf(st, c);
  const emp = BUILDINGS.filter((b) => RECIPES[b] || b === 'plantation' || b === 'mine' || b === 'logging').map((b) => ({ b, capacity: regs.reduce((s, r) => s + r.buildings[b], 0) * LEVEL_WORKERS, v: staffedWorkers(regs, b) })).filter((x) => x.capacity > 0).sort((a, b) => (b.v ?? -1) - (a.v ?? -1));
  const rows = marketRows(st, mk); const short = rows.filter((r) => (r.short ?? 0) >= 0.1).sort((a, b) => (b.short ?? 0) - (a.short ?? 0)); const surplus = rows.filter((r) => (r.ratio ?? 0) >= 1.5).sort((a, b) => (b.ratio ?? 0) - (a.ratio ?? 0));
  const topOut = [...regs].sort((a, b) => b.output - a.output).slice(0, 6); const outSum = regs.reduce((s, r) => s + r.output, 0) || 1;
  return (
    <div class="pad">
      <div class="metrics">
        <Metric label="GDP / năm" icon="gdp" value={money(c.gdp)} spark={h.map((x) => x.gdp)} d={h.length >= 2 ? <Delta v={h[h.length - 1].gdp / h[h.length - 2].gdp - 1} dp={1} suffix="/năm" /> : <span class="dim">chưa đủ mẫu năm</span>} />
        <Metric label="GDP / người" icon="population" value={`¤ ${fmt(c.gdp / Math.max(1, c.stats.pop), 1)}`} d={<span class="dim">công nghiệp {pct(c.stats.industry, 1)}</span>} />
        <Metric label="Cán cân tháng" icon="treasury" value={<span class={bal >= 0 ? 'pos' : 'neg'}>{bal >= 0 ? '+' : '−'}{compact(Math.abs(bal))}</span>} d={<span class="dim">thu {compact(c.income)} · chi {compact(c.expense)}</span>} onClick={() => ui.tab('economy', 'budget')} />
        <Metric label="Ngân khố · nợ" icon="scroll" value={money(c.treasury)} d={<span class={c.debt > 0 ? 'neg' : 'dim'}>nợ {compact(c.debt)}</span>} />
      </div>
      <div class="cols c2">
        <div>
          <Sec title="GDP theo năm" icon="gdp"><LineChart years={h.map((x) => x.y)} series={[{ name: 'GDP', color: '#93c47a', values: h.map((x) => x.gdp) }]} fmtY={compact} height={120} /></Sec>
          <Sec title="Lao động đang làm" icon="factory" x="nhân công thực tế">
            {emp.length > 0 && emp.every((e) => e.v !== null)
              ? <HBars rows={emp.map((e) => ({ label: BUILD_VI[e.b], v: e.v ?? 0, key: e.b }))} fmtV={compact} />
              : <div class="empty sm">Chưa có sổ nhân công; chạy mô phỏng thêm một tháng để cập nhật dữ liệu cũ.</div>}
            {emp.length > 0 && emp.every((e) => e.v !== null) && <div class="note">Số đang làm là lao động thực tế được engine phân bổ, không phải sức chứa tối đa.</div>}
          </Sec>
        </div>
        <div>
          <Sec title="Vùng sản lượng lớn nhất" icon="map" x="¤ / tháng">
            {topOut.map((r) => <div class="row tap" key={r.id} onClick={() => focusRegion(r.id)}><div class="grow"><div class="t sm">{regionName(r.id)}</div><Bar frac={r.output / topOut[0].output} /></div><span class="num">¤ {compact(r.output)}</span><span class="num dim" style="width:44px;text-align:right">{pct(r.output / outSum)}</span></div>)}
          </Sec>
          <Sec title="Thị trường" icon="market" x={mk === id ? 'quốc gia' : `chung · ${shortName(st, mk)}`} go={() => ui.tab('economy', 'market')}>
            <div class="kv"><span class="k">Thiếu hụt</span><span class="v">{short.length ? short.slice(0, 4).map((r) => `${GOOD_VI[r.g]} ${pct(r.short ?? 0)}`).join(' · ') : 'Không'}</span></div>
            <div class="kv"><span class="k">Dư thừa</span><span class="v">{surplus.length ? surplus.slice(0, 4).map((r) => GOOD_VI[r.g]).join(' · ') : 'Không'}</span></div>
            <div class="kv"><span class="k">Giá cao nhất so với gốc</span><span class="v">{[...rows].sort((a, b) => b.price - a.price).slice(0, 2).map((r) => `${GOOD_VI[r.g]} ${fmt(r.price, 2)}`).join(' · ')}</span></div>
            <div class="kv"><span class="k">Luật thương mại</span><span class="v">{lawVi(c.laws.trade)}</span></div>
          </Sec>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- market
export function MarketTab({ st }: { st: GameState }) {
  const id = viewedId(st); const c = st.countries[id]; const mk = marketOf(st, c);
  const [filter, setFilter] = useState<'all' | 'short' | 'surplus'>('all');
  const { s: sort, th } = useSort<'g' | 'price' | 'ratio' | 'supply' | 'demand' | 'imports' | 'world'>('price');
  const [ref, w] = useWidth<HTMLDivElement>(); const sel = details.use()?.key;
  let rows = marketRows(st, mk);
  if (filter === 'short') rows = rows.filter((r) => (r.short ?? 0) >= 0.1);
  if (filter === 'surplus') rows = rows.filter((r) => (r.ratio ?? 0) >= 1.5);
  const val = (r: Row) => (sort.k === 'g' ? GOOD_VI[r.g] : (r[sort.k] as number | null) ?? -1);
  rows = [...rows].sort((a, b) => { const x = val(a), y = val(b); return (typeof x === 'string' ? x.localeCompare(y as string) : (x as number) - (y as number)) * sort.dir; });
  const members = Object.values(st.countries).filter((x) => x.alive && marketOf(st, x) === mk).map((x) => x.id);
  const hasStats = !!st.marketStats?.[mk];
  const mid = w >= 470, wide = w >= 600;
  const open = (g: Good) => details.toggle({ key: `good:${g}`, title: GOOD_VI[g], ctx: mk === id ? 'thị trường quốc gia' : `thị trường ${shortName(st, mk)}`, body: () => <GoodDetail st={st} mk={mk} g={g} /> });
  return (
    <div class="pad" ref={ref}>
      <div class="toolrow">
        <div class="grow"><div class="t-s">{mk === id ? `Thị trường quốc gia ${shortName(st, id)}` : `Thị trường chung — ${shortName(st, mk)} dẫn đầu`}</div><div class="s">{lawVi(c.laws.trade)} · {members.length} thành viên · {monthYear(st)}</div></div>
        <Seg value={filter} onChange={setFilter} options={[['all', 'Tất cả'], ['short', 'Thiếu hụt'], ['surplus', 'Dư thừa']] as const} />
      </div>
      <table class="dt">
        <thead><tr>{th('g', 'Hàng hóa')}{th('price', 'Giá', 'r')}{hasStats && th('ratio', 'Cung / cầu')}{hasStats && mid && th('supply', 'Cung', 'r')}{hasStats && mid && th('demand', 'Cầu', 'r')}{hasStats && wide && th('imports', 'Nhập', 'r')}{wide && th('world', 'Giá TG', 'r')}</tr></thead>
        <tbody>
          {GROUPS.map(([gk, gl]) => { const rs = rows.filter((r) => GOOD_GROUP[r.g] === gk); if (!rs.length) return null; return [
            <tr class="grp" key={gk}><td colSpan={7}>{gl}</td></tr>,
            ...rs.map((r) => { const s = status(r); return (
              <tr key={r.g} class={sel === `good:${r.g}` ? 'on' : ''} onClick={() => open(r.g)}>
                <td><span class="cell-ic"><GoodIcon g={r.g} /><span class="nm">{GOOD_VI[r.g]}</span></span></td>
                <td class="r"><b class="num">{fmt(r.price, 2)}</b><div class="sub"><Delta v={r.price - 1} /></div></td>
                {hasStats && <td><div class="bal">{r.ratio !== null ? <DBar v={Math.max(-1, Math.min(1, r.ratio - 1))} w={56} /> : null}<span class="num">{r.ratio !== null ? pct(r.ratio) : '—'}</span></div>{s && <div class={`sub tag ${s.cls}`}>{s.label}</div>}</td>}
                {hasStats && mid && <td class="r num">{r.supply !== null ? compact(r.supply) : '—'}</td>}
                {hasStats && mid && <td class="r num">{r.demand !== null ? compact(r.demand) : '—'}</td>}
                {hasStats && wide && <td class="r num">{r.imports !== null ? pct(r.imports) : '—'}</td>}
                {wide && <td class="r num muted">{fmt(r.world, 2)}</td>}
              </tr>); })]; })}
        </tbody>
      </table>
      {rows.length === 0 && <div class="empty">Không có mặt hàng nào khớp bộ lọc.</div>}
      <div class="note">Giá là chỉ số (1,00 = giá gốc của mặt hàng). Cung, cầu và nhập khẩu là số liệu tháng gần nhất của mô phỏng, tính theo đơn vị vật lý của từng mặt hàng. {!wide && 'Mở rộng cửa sổ hoặc xoay ngang để xem thêm cột.'}</div>
    </div>
  );
}

function GoodDetail({ st, mk, g }: { st: GameState; mk: string; g: Good }) {
  const r = marketRows(st, mk).find((x) => x.g === g)!; const s = status(r); const id = viewedId(st);
  const makers = (Object.keys(RECIPES) as Building[]).filter((b) => RECIPES[b]!.out === g);
  const users = (Object.keys(RECIPES) as Building[]).filter((b) => RECIPES[b]!.inputs[g]);
  const regs = st.regions.filter((x) => x.owner === id);
  return (
    <div>
      <div class="metrics">
        <Metric label="Chỉ số giá" value={fmt(r.price, 2)} d={<Delta v={r.price - 1} />} />
        <Metric label="Giá thế giới" value={fmt(r.world, 2)} d={<span class="dim">chênh {r.price >= r.world ? '+' : '−'}{fmt(Math.abs(r.price - r.world), 2)}</span>} />
      </div>
      <div class="metrics">
        <Metric label="Cung / cầu" value={r.ratio !== null ? pct(r.ratio) : '—'} d={s && <span class={`tag ${s.cls}`}>{s.label}</span>} />
        <Metric label="Nhập khẩu" value={r.imports !== null ? pct(r.imports) : '—'} d={<span class="dim">trên nhu cầu</span>} />
      </div>
      <Sec title="Sản lượng tháng" x="đơn vị mô phỏng">
        <div class="kv"><span class="k">Cung trong thị trường</span><span class="v num">{r.supply !== null ? compact(r.supply) : '—'}</span></div>
        <div class="kv"><span class="k">Nhu cầu</span><span class="v num">{r.demand !== null ? compact(r.demand) : '—'}</span></div>
        <div class="kv"><span class="k">Nhập từ thị trường thế giới</span><span class="v num">{r.imports !== null && r.demand ? compact(r.imports * r.demand) : '—'}</span></div>
        <div class="kv"><span class="k">Nhu cầu không được đáp ứng</span><span class="v num">{r.short !== null ? pct(r.short) : '—'}</span></div>
      </Sec>
      {(makers.length > 0 || users.length > 0) && (
        <Sec title="Chuỗi sản xuất">
          {makers.map((b) => <div class="kv" key={b}><span class="k">Sản xuất bởi</span><span class="v"><a class="lnk" onClick={() => { ui.tab('economy', 'buildings'); openBuilding(st, b, `economy:buildings:${ui.get().country ?? ''}`); }}>{BUILD_VI[b]} ›</a> · {fmt(regs.reduce((t, x) => t + x.buildings[b], 0))} cấp trong nước</span></div>)}
          {makers.map((b) => Object.entries(RECIPES[b]!.inputs).map(([ig, q]) => <div class="kv" key={b + ig}><span class="k">Đầu vào / đơn vị</span><span class="v">{GOOD_VI[ig]} × {fmt(q as number, 2)}</span></div>))}
          {users.map((b) => <div class="kv" key={b}><span class="k">Nguyên liệu của</span><span class="v"><a class="lnk" onClick={() => { ui.tab('economy', 'buildings'); openBuilding(st, b, `economy:buildings:${ui.get().country ?? ''}`); }}>{BUILD_VI[b]} ›</a> (× {fmt(RECIPES[b]!.inputs[g] as number, 2)})</span></div>)}
        </Sec>
      )}
      <div class="note">Mô phỏng không lưu lịch sử giá theo tháng, nên không có biểu đồ giá.</div>
    </div>
  );
}

/** Building detail window (levels by region, product, inputs). Also opened from a good's production chain. */
export function openBuilding(st: GameState, b: Building, scope?: string) {
  const id = viewedId(st); const regs = st.regions.filter((r) => r.owner === id && r.buildings[b] > 0).sort((x, y) => y.buildings[b] - x.buildings[b]);
  const levels = regs.reduce((s, r) => s + r.buildings[b], 0);
  const capacity = levels * LEVEL_WORKERS;
  const actualEmployment = staffedWorkers(regs, b);
  details.toggle({ key: `bld:${b}`, title: BUILD_VI[b], ctx: `${fmt(levels)} cấp · ${regs.length} vùng`, scope, body: () => (
    <div>
      <div class="kv"><span class="k">Sản phẩm</span><span class="v">{outText(b)}</span></div>
      {RECIPES[b] && <div class="kv"><span class="k">Đầu vào / đơn vị</span><span class="v">{Object.entries(RECIPES[b]!.inputs).map(([g, q]) => `${GOOD_VI[g]} × ${fmt(q as number, 2)}`).join(' · ')}</span></div>}
      {b !== 'railway' && b !== 'university' && (
        <Sec title="Phân bổ lao động">
          <div class="kv"><span class="k">Đang làm</span><span class="v num">{actualEmployment === null ? '—' : compact(actualEmployment)}</span></div>
          <div class="kv"><span class="k">Sức chứa tối đa</span><span class="v num">{compact(capacity)}</span></div>
          <div class="kv"><span class="k">Công suất sử dụng</span><span class="v num">{actualEmployment === null ? 'Chờ dữ liệu' : pct(actualEmployment / Math.max(1, capacity))}</span></div>
        </Sec>
      )}
      {PRODUCTION_METHODS[b]?.length ? (
        <Sec title="Phương pháp sản xuất" x="theo từng vùng">
          <div class="note" style="margin-top:0">Phương pháp tác động trực tiếp đến sản lượng và nhu cầu nguyên liệu. Nếu chưa chọn thủ công, vùng dùng phương pháp cao nhất mà quốc gia đã mở khóa bằng công nghệ.</div>
          {regs.length ? regs.map((r) => {
            const country = st.countries[id];
            const active = productionMethodFor(country, r, b);
            const options = availableProductionMethods(country, b);
            const all = PRODUCTION_METHODS[b] ?? [];
            const canEdit = canCommand(st, id) && options.length > 1;
            return <div key={r.id} style="padding:8px 0;border-bottom:1px solid var(--line)">
              <div class="row" style="padding:0">
                <div class="grow"><div class="t sm">{regionName(r.id)}</div><div class="s">Cấp {r.buildings[b]} · {active?.name ?? 'Mặc định'}</div></div>
                <button class="btn sm" onClick={() => focusRegion(r.id)}>Xem vùng</button>
              </div>
              {active && <div class="s" style="margin-top:3px">{active.description}</div>}
              {canEdit && <div class="btns" style="margin-top:6px">{options.map((m) => <button key={m.id} class={`btn sm ${active?.id === m.id ? 'primary' : ''}`} aria-pressed={active?.id === m.id} onClick={() => send({ type: 'set_production_method', region: r.id, building: b, method: m.id }, `${regionName(r.id)}: ${m.name}`)}>{m.name}</button>)}</div>}
              {canCommand(st, id) && all.filter((m) => m.requiresTech && !country.techs.includes(m.requiresTech)).map((m) => <div class="s warn" key={m.id}>Khóa: {m.name} · cần {m.requiresTech?.replace(/_/g, ' ')}</div>)}
            </div>;
          }) : <div class="empty sm">Quốc gia chưa có công trình này.</div>}
        </Sec>
      ) : null}
      <Sec title="Theo vùng" x="chạm để xem trên bản đồ">
        {regs.length ? regs.map((r) => {
          const staffed = r.popEconomy?.employedByBuilding?.[b];
          const regionCapacity = r.buildings[b] * LEVEL_WORKERS;
          const hasStaffingModel = b !== 'railway' && b !== 'university';
          const staffingText = !hasStaffingModel
            ? 'chưa có mô hình nhân sự'
            : staffed === undefined
              ? 'chờ dữ liệu nhân công'
              : compact(staffed) + ' / ' + compact(regionCapacity) + ' người · ' + pct(staffed / Math.max(1, regionCapacity));
          return <div class="row tap" key={r.id} onClick={() => focusRegion(r.id)}>
            <div class="grow"><div class="t sm">{regionName(r.id)}</div><div class="s">Cấp {r.buildings[b]} · {staffingText}</div></div>
          </div>;
        }) : <div class="empty sm">Quốc gia chưa có công trình này.</div>}
      </Sec>
    </div>
  ) });
}

// ---------------------------------------------------------------- buildings
export function BuildingsTab({ st }: { st: GameState }) {
  const id = viewedId(st); const regs = st.regions.filter((r) => r.owner === id); const sel = details.use()?.key;
  const [ref, w] = useWidth<HTMLDivElement>();
  const types = BUILDINGS.map((b) => ({ b, levels: regs.reduce((s, r) => s + r.buildings[b], 0), regs: regs.filter((r) => r.buildings[b] > 0).sort((x, y) => y.buildings[b] - x.buildings[b]) })).filter((t) => t.levels > 0).map((t) => ({ ...t, capacity: t.levels * LEVEL_WORKERS, employed: staffedWorkers(t.regs, t.b) }));
  if (!types.length) return <div class="pad"><div class="empty">Quốc gia này chưa có công trình nào.</div></div>;
  const sectors = [...new Set(types.map((t) => SECTOR[t.b]))];
  const open = (t: (typeof types)[number]) => openBuilding(st, t.b);
  return (
    <div class="pad" ref={ref}>
      <table class="dt">
        <thead><tr><th>Công trình</th><th class="r">Cấp</th><th class="r">Vùng</th>{w >= 390 && <th class="r">Đang làm / sức chứa</th>}{w >= 540 && <th>Sản phẩm</th>}</tr></thead>
        <tbody>
          {sectors.map((sec) => [
            <tr class="grp" key={sec}><td colSpan={5}>{sec}</td></tr>,
            ...types.filter((t) => SECTOR[t.b] === sec).map((t) => (
              <tr key={t.b} class={sel === `bld:${t.b}` ? 'on' : ''} onClick={() => open(t)}>
                <td><span class="cell-ic"><span class="gico" style="color:var(--accent)"><Icon name={B_ICON(t.b)} /></span><span class="nm">{BUILD_VI[t.b]}</span></span></td>
                <td class="r num"><b>{fmt(t.levels)}</b></td><td class="r num">{t.regs.length}</td>
                {w >= 390 && <td class="r">
                  {t.b === 'railway' || t.b === 'university'
                    ? <span class="dim">—</span>
                    : t.employed === null
                      ? <span class="dim">Chờ dữ liệu</span>
                      : <><b class="num">{compact(t.employed)}</b><div class="sub">/ {compact(t.capacity)} · {pct(t.employed / Math.max(1, t.capacity))}</div></>}
                </td>}
                {w >= 540 && <td class="muted ellipsis" style="max-width:220px">{outText(t.b)}</td>}
              </tr>
            )),
          ])}
        </tbody>
      </table>
      <div class="note">Số đang làm là lao động engine thực tế phân bổ; sức chứa tối đa là {fmt(LEVEL_WORKERS)} người mỗi cấp. Đường sắt và đại học chưa có mô hình nhân sự riêng.</div>
    </div>
  );
}

// ---------------------------------------------------------------- construction
export function ConstructionTab({ st }: { st: GameState }) {
  const id = viewedId(st); const c = st.countries[id]; const mine = canCommand(st, id);
  const [kind, setKind] = useState<'all' | 'primary' | 'industry' | 'infra'>('all');
  const [ref, w] = useWidth<HTMLDivElement>();
  const ops: { r: Region; b: Building; cost: number; ret: number }[] = [];
  for (const r of st.regions) if (r.owner === id) for (const b of BUILDINGS) if (b !== 'university' && canBuild(st, c, r, b)) { const ret = buildingReturn(st, c, r, b); if (ret > 0) ops.push({ r, b, cost: buildCost(c, b, st), ret }); }
  ops.sort((a, b) => b.ret - a.ret);
  const cat = (b: Building) => (SECTOR[b] === 'Công nghiệp' ? 'industry' : SECTOR[b] === 'Hạ tầng & giáo dục' ? 'infra' : 'primary');
  const shown = ops.filter((o) => kind === 'all' || cat(o.b) === kind).slice(0, 60); const maxRet = Math.max(...ops.map((o) => o.ret), 1e-9);
  const statePool = (c as any).statePool ?? 0, privatePool = (c as any).privatePool ?? 0;
  const queue = c.constructionQueue ?? [];
  const confirm = (o: (typeof ops)[number]) => modals.open(`Xây ${BUILD_VI[o.b]}`, () => (
    <div>
      <div class="t-s" style="margin-bottom:6px">{regionName(o.r.id)}</div>
      <Sec title="Chi phí"><div class="kv"><span class="k">Trích từ quỹ xây dựng nhà nước</span><span class="v num">{money(o.cost)}</span></div><div class="kv"><span class="k">Quỹ hiện có</span><span class={`v num${statePool < o.cost ? ' neg' : ''}`}>{money(statePool)}</span></div></Sec>
      <Sec title="Lợi ích dự kiến"><div class="kv"><span class="k">Lợi suất năm (theo giá hiện tại, ước tính)</span><span class="v num pos">{pct(o.ret, 1)}</span></div>{o.b !== 'railway' && <div class="kv"><span class="k">Công suất việc làm tối đa</span><span class="v num">{fmt(LEVEL_WORKERS)}</span></div>}</Sec>
      <div class="note">Dự án vào hàng đợi và thi công theo năng lực xây dựng từ ngân sách mỗi tháng. Chi phí ước tính được khóa tại thời điểm đặt dự án; vùng bị chiếm sẽ tạm dừng thi công.</div>
      <div class="btns" style="margin-top:10px"><button class="btn" onClick={() => modals.close()}>Hủy</button><button class="btn primary" disabled={!canQueueConstruction(st, c, o.r, o.b)} onClick={() => { if (send({ type: 'queue_build', region: o.r.id, building: o.b }, `Đã xếp hàng ${BUILD_VI[o.b]} tại ${regionName(o.r.id)}`)) modals.close(); }}>Xếp hàng</button></div>
    </div>
  ));
  return (
    <div class="pad" ref={ref}>
      <div class="metrics">
        <Metric label="Quỹ xây dựng nhà nước" icon="construction" value={money(statePool)} d={<span class="dim">{pct(c.budget.construction)} thu nhập mỗi tháng</span>} tip={{ title: 'Quỹ xây dựng nhà nước', note: 'Tích lũy từ dòng “Xây dựng” của ngân sách; dùng cho các lệnh xây của người chơi.' }} />
        <Metric label="Quỹ đầu tư tư nhân" icon="treasury" value={money(privatePool)} d={<span class="dim">nhà đầu tư tự xây theo lợi suất</span>} tip={{ title: 'Đầu tư tư nhân', note: 'Tiết kiệm của các tầng lớp có tài sản; mức tích lũy phụ thuộc luật kinh tế.' }} />
      </div>
      <Sec title="Hàng đợi xây dựng" x={`${queue.length}/${MAX_CONSTRUCTION_QUEUE} dự án`}>
        {queue.length ? queue.map((project, index) => {
          const target = st.regions.find((r) => r.id === project.region);
          return <div class="row" key={project.id} style="padding:7px 0;border-bottom:1px solid var(--line);align-items:center">
            <div class="grow"><div class="t sm">{BUILD_VI[project.building]} · {target ? regionName(target.id) : project.region}</div>
              {index === 0 ? <><div class="s">Đang thi công · {money(project.progress)} / {money(project.cost)}</div><Bar frac={project.progress / Math.max(1, project.cost)} /></> : <div class="s">Đang chờ trong hàng đợi</div>}
              {target && target.controller !== target.owner && <div class="s warn">Tạm dừng do vùng đang bị chiếm</div>}
            </div>
            {mine && <button class="btn sm" onClick={() => send({ type: 'cancel_construction', projectId: project.id }, 'Đã hủy dự án; phần vốn đã chi được hoàn lại.')}>Hủy</button>}
          </div>;
        }) : <div class="empty sm">Chưa có dự án nào trong hàng đợi.</div>}
        <div class="note">Chỉ dự án đầu hàng đợi được thi công; mỗi tháng bị giới hạn bởi ngân sách xây dựng thực tế.</div>
      </Sec>
      <div class="toolrow" style="margin-top:10px">
        <div class="grow t-s">Cơ hội xây dựng <span class="dim" style="font:13px var(--sans)">{ops.length} lựa chọn</span></div>
        <Seg value={kind} onChange={setKind} options={[['all', 'Tất cả'], ['primary', 'Khai thác'], ['industry', 'Công nghiệp'], ['infra', 'Hạ tầng']] as const} />
      </div>
      {shown.length ? (
        <table class="dt">
          <thead><tr><th>Công trình · vùng</th>{w >= 400 && <th class="r">Chi phí</th>}<th>Lợi suất / năm</th>{mine && <th />}</tr></thead>
          <tbody>{shown.map((o) => (
            <tr key={o.r.id + o.b} style="cursor:default">
              <td><div class="nm">{BUILD_VI[o.b]}</div><div class="sub ellipsis" style="max-width:240px">{regionName(o.r.id)}{w < 400 ? ` · ${money(o.cost)}` : ''}</div></td>
              {w >= 400 && <td class="r num">{money(o.cost)}</td>}
              <td style="min-width:96px"><div class="bal"><span class="bar" style="width:60px"><i style={`width:${(o.ret / maxRet) * 100}%;background:var(--pos)`} /></span><span class="num">{pct(o.ret, 1)}</span></div></td>
              {mine && <td class="r"><button class="btn sm" disabled={!canQueueConstruction(st, c, o.r, o.b)} onClick={() => confirm(o)}>Xếp hàng</button></td>}
            </tr>))}</tbody>
        </table>
      ) : <div class="empty">Không có công trình nào sinh lời ở mức giá hiện tại.</div>}
      {!mine && <div class="note">Chỉ xem: bạn không điều khiển quốc gia này.</div>}
    </div>
  );
}

// ---------------------------------------------------------------- budget
export function BudgetTab({ st }: { st: GameState }) {
  const id = viewedId(st); const c = st.countries[id]; const mine = canCommand(st, id); const f = c.finance;
  const bal = c.income - c.expense; const [rate, setRate] = useState(c.taxRate);
  const inc: [string, number][] = f ? [['Thuế', f.tax], ['Thuế quan', f.tariff]] : [['Thuế', c.income - c.tariffIncome], ['Thuế quan', c.tariffIncome]];
  const exp: [string, number][] = f ? [['Lục quân', f.army], ['Hải quân', f.navy], ['Hành chính', f.admin], ['Giáo dục', f.education], ['Y tế', f.health], ['Xây dựng (vào quỹ)', f.construction], ['Lãi nợ', f.interest]] : [];
  const maxLine = Math.max(...inc.map((x) => x[1]), ...exp.map((x) => x[1]), 1);
  const line = (k: string, v: number, sign: 1 | -1) => <div class="ledger-l" key={k}><span class="k">{k}</span><span class="bar"><i style={`width:${(v / maxLine) * 100}%;background:${sign > 0 ? 'var(--pos)' : 'var(--neg)'}`} /></span><span class={`num ${sign > 0 ? 'pos' : 'neg'}`}>{sign > 0 ? '+' : '−'}{compact(v)}</span></div>;
  const slider = (key: 'education' | 'health' | 'admin' | 'construction', label: string, hint: string) => (
    <div class="slider-row">
      <div class="lab"><span>{label}</span><b class="num">{pct(c.budget[key])}</b></div>
      {mine ? <input type="range" min={0} max={0.4} step={0.01} value={c.budget[key]} aria-label={label} onChange={(e) => send({ type: 'set_budget', key, value: Number((e.target as HTMLInputElement).value) }, `${label}: ${pct(Number((e.target as HTMLInputElement).value))} thu nhập`)} /> : <Bar frac={c.budget[key] / 0.4} />}
      <div class="s">{hint}</div>
    </div>
  );
  return (
    <div class="pad">
      <div class="metrics">
        <Metric label="Ngân khố" icon="treasury" value={money(c.treasury)} />
        <Metric label="Cán cân / tháng" icon="gdp" value={<span class={bal >= 0 ? 'pos' : 'neg'}>{bal >= 0 ? '+' : '−'}{compact(Math.abs(bal))}</span>} />
        <Metric label="Nợ công" icon="scroll" value={money(c.debt)} d={<span class="dim">lãi 5%/năm</span>} />
        <Metric label="Thuế suất" icon="laws" value={pct(c.taxRate, 1)} d={<span class="dim">trên GDP</span>} />
      </div>
      <div class="cols c2">
        <Sec title="Thu tháng" icon="treasury" x={`¤ ${compact(c.income)}`}>{inc.map(([k, v]) => line(k, v, 1))}</Sec>
        <Sec title="Chi tháng" icon="coins" x={`¤ ${compact(c.expense)}`}>{exp.length ? exp.map(([k, v]) => line(k, v, -1)) : <div class="empty sm">Phân rã chi tiêu có sau tháng mô phỏng đầu tiên.</div>}</Sec>
      </div>
      {exp.length > 0 && <Sec title="Cơ cấu chi tiêu" icon="gdp" x="tỷ trọng trong tổng chi tháng">
        <Donut parts={exp.map(([k, v], i) => ({ label: k, v, c: ['#cf6a5c', '#6c9dd0', '#c9a45e', '#5fb3ae', '#8cc46b', '#b48edb', '#9a9a9a'][i] }))} size={124} center={`¤${compact(c.expense)}`} sub="MỖI THÁNG" />
      </Sec>}
      <Sec title="Chính sách tài khóa" icon="laws">
        <div class="slider-row">
          <div class="lab"><span>Thuế suất trên GDP</span><b class="num">{pct(rate, 1)}</b></div>
          {mine ? <input type="range" min={0.01} max={0.3} step={0.005} value={rate} aria-label="Thuế suất" onInput={(e) => setRate(Number((e.target as HTMLInputElement).value))} onChange={(e) => send({ type: 'set_tax', rate: Number((e.target as HTMLInputElement).value) }, `Thuế suất mới: ${pct(Number((e.target as HTMLInputElement).value), 1)}`)} /> : <Bar frac={c.taxRate / 0.3} />}
          <div class="s">Thu thực tế phụ thuộc hiệu quả hành chính.</div>
        </div>
        <div class="cols c2">
          {slider('admin', 'Hành chính', 'Tăng hiệu quả thu thuế')}{slider('education', 'Giáo dục', 'Tăng biết chữ')}
          {slider('health', 'Y tế', 'Giảm tử vong')}{slider('construction', 'Xây dựng', 'Nạp quỹ xây dựng nhà nước')}
        </div>
      </Sec>
      {!mine && <div class="note">Chỉ xem: bạn không điều khiển quốc gia này.</div>}
    </div>
  );
}

export function EconomyScreen({ st, tab }: { st: GameState; tab: string }) {
  if (tab === 'market') return <MarketTab st={st} />;
  if (tab === 'buildings') return <BuildingsTab st={st} />;
  if (tab === 'construction') return <ConstructionTab st={st} />;
  if (tab === 'budget') return <BudgetTab st={st} />;
  return <Overview st={st} />;
}
export const ECONOMY_TABS: [string, string][] = [['overview', 'Tổng quan'], ['market', 'Thị trường'], ['buildings', 'Công trình'], ['construction', 'Xây dựng'], ['budget', 'Ngân sách']];
export { CountryLink };
