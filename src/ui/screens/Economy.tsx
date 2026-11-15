// Economy: Market (prices + persisted market statistics), Buildings, Construction, Budget.
import { useState } from 'preact/hooks';
import type { GameState, Good, Building, Region } from '../../engine/types';
import { GOODS, BUILDINGS } from '../../engine/types';
import { marketOf, buildCost, buildingReturn, canBuild, RECIPES, LEVEL_WORKERS } from '../../engine/systems/economy';
import { data } from '../../engine/data/db';
import { Icon } from '../components/icons';
import { Section, Stat, Chip, Bar, modals } from '../components/ui';
import { GOOD_VI, BUILD_VI, lawVi, fmt, pct, money, compact } from '../i18n/vi';
import { shortName } from '../game/names';
import { viewedId, canCommand, send, CountryLink, monthYear } from './common';
import { ui } from '../game/ui';
import { mapControls } from '../map/MapView';

const GOOD_BG: Record<string, string> = { grain: '#4d4a2b', cash_crops: '#33502e', cotton: '#4d4c48', timber: '#4f3b25', coal: '#2c2f30', iron: '#3a4148', steel: '#33414d', textiles: '#57323f', tools: '#4a4230', arms: '#552f2a', luxury: '#46335f', opium: '#552c47' };
export function GoodIcon({ g }: { g: string }) { return <span class="gico" style={`background:${GOOD_BG[g]};color:#ecd9a8`}><Icon name={g} /></span>; }

type Row = { g: Good; price: number; world: number; supply: number | null; demand: number | null; ratio: number | null; imports: number | null; short: number | null };
function marketRows(st: GameState, mk: string): Row[] {
  const prices = st.marketPrices[mk] ?? st.worldPrices; const stats = st.marketStats?.[mk];
  return GOODS.map((g) => {
    const s = stats?.[g];
    return { g, price: prices[g], world: st.worldPrices[g], supply: s ? s.supply : null, demand: s ? s.demand : null, ratio: s && s.demand > 0 ? s.supply / s.demand : null, imports: s && s.demand > 0 ? s.imports / s.demand : null, short: s ? s.short : null };
  });
}
const status = (r: Row): { label: string; cls: string } | null => {
  if (r.short === null || r.ratio === null) return null;
  if (r.short >= 0.1) return { label: `Thiếu ${pct(r.short)}`, cls: 'down' };
  if (r.ratio >= 1.5) return { label: 'Dư thừa', cls: 'up' };
  return { label: 'Cân bằng', cls: 'flat' };
};

export function MarketTab({ st, portrait }: { st: GameState; portrait: boolean }) {
  const id = viewedId(st); const c = st.countries[id]; const mk = marketOf(st, c);
  const [filter, setFilter] = useState<'all' | 'short' | 'surplus'>('all');
  const [sort, setSort] = useState<{ k: keyof Row | 'delta'; dir: 1 | -1 }>({ k: 'delta', dir: -1 });
  let rows = marketRows(st, mk);
  if (filter === 'short') rows = rows.filter((r) => (r.short ?? 0) >= 0.1);
  if (filter === 'surplus') rows = rows.filter((r) => (r.ratio ?? 0) >= 1.5);
  const val = (r: Row) => (sort.k === 'delta' ? Math.abs(r.price - 1) : sort.k === 'g' ? GOOD_VI[r.g] : (r[sort.k] as number | null) ?? -1);
  rows = [...rows].sort((a, b) => { const x = val(a), y = val(b); return (typeof x === 'string' ? x.localeCompare(y as string) : (x as number) - (y as number)) * sort.dir; });
  const members = Object.values(st.countries).filter((x) => x.alive && marketOf(st, x) === mk).map((x) => x.id);
  const title = mk === id ? `Thị trường quốc gia ${shortName(st, id)}` : `Thị trường chung do ${shortName(st, mk)} dẫn đầu`;
  const hasStats = !!st.marketStats?.[mk];
  const th = (k: Row['g'] extends never ? never : keyof Row | 'delta', label: string, r = true) => <th class={r ? 'r' : ''} onClick={() => setSort({ k, dir: sort.k === k ? (-sort.dir as 1 | -1) : -1 })}>{label}{sort.k === k ? (sort.dir < 0 ? ' ▾' : ' ▴') : ''}</th>;
  const detail = (r: Row) => modals.open(GOOD_VI[r.g], () => <GoodDetail st={st} mk={mk} g={r.g} />);
  return (
    <div>
      <div class="plate" style="margin-bottom:6px">
        <div class="serif" style="font-size:18px;font-weight:600">{title}</div>
        <div class="muted" style="font-size:13px">Luật thương mại: <b>{lawVi(c.laws.trade)}</b> · {members.length} thành viên · số liệu {monthYear(st)}</div>
      </div>
      <div class="seg" style="margin-bottom:6px">
        {([['all', 'Tất cả'], ['short', 'Thiếu hụt'], ['surplus', 'Dư thừa']] as const).map(([k, l]) => <button class={filter === k ? 'on' : ''} onClick={() => setFilter(k)}>{l}</button>)}
      </div>
      {portrait ? (
        <div>
          {rows.map((r) => { const s = status(r); return (
            <button class="entry" key={r.g} onClick={() => detail(r)}>
              <GoodIcon g={r.g} />
              <div class="main"><div class="ttl" style="font-size:16px">{GOOD_VI[r.g]}</div>
                <div class="meta num">{r.ratio !== null ? `Cung/cầu ${pct(r.ratio)}` : 'Chưa có số liệu cung/cầu'}{r.imports ? ` · nhập ${pct(r.imports)}` : ''}</div></div>
              <div class="aside"><div class="num" style="font-size:17px;font-weight:600">{fmt(r.price, 2)}</div><Chip v={r.price - 1} /></div>
              {s && <span class={`chip ${s.cls}`} style="margin-left:4px;min-width:62px;justify-content:center">{s.label}</span>}
            </button>); })}
        </div>
      ) : (
        <div class="tbl-wrap">
          <table class="ledger">
            <thead><tr>{th('g', 'Hàng hóa', false)}{th('price', 'Giá')}{th('delta', '± gốc')}{hasStats && th('short', 'Tình trạng', false)}{hasStats && th('ratio', 'Cung/cầu')}{hasStats && th('imports', 'Nhập')}{th('world', 'Giá TG')}</tr></thead>
            <tbody>{rows.map((r) => { const s = status(r); return (
              <tr key={r.g} onClick={() => detail(r)}>
                <td class="stick"><span class="gi"><GoodIcon g={r.g} /><span class="nm">{GOOD_VI[r.g]}</span></span></td>
                <td class="r num"><b>{fmt(r.price, 2)}</b></td>
                <td class="r"><Chip v={r.price - 1} /></td>
                {hasStats && <td>{s && <span class={`chip ${s.cls}`}>{s.label}</span>}</td>}
                {hasStats && <td class="r num">{r.ratio !== null ? pct(r.ratio) : '—'}</td>}
                {hasStats && <td class="r num">{r.imports !== null ? pct(r.imports) : '—'}</td>}
                <td class="r num muted">{fmt(r.world, 2)}</td>
              </tr>); })}</tbody>
          </table>
        </div>
      )}
      {rows.length === 0 && <div class="empty">Không có mặt hàng nào khớp bộ lọc.</div>}
      <div class="note">Giá là <b>chỉ số giá</b> (1,00 = giá gốc của mặt hàng). “So với gốc” so với giá gốc; “Giá TG” là giá tham chiếu của thị trường thế giới cùng thang. Cung/cầu và nhập khẩu tính theo sản lượng tháng gần nhất của mô phỏng.</div>
    </div>
  );
}

function GoodDetail({ st, mk, g }: { st: GameState; mk: string; g: Good }) {
  const r = marketRows(st, mk).find((x) => x.g === g)!; const s = status(r);
  const makers = (Object.entries(RECIPES) as [Building, { out: Good; inputs: Partial<Record<Good, number>> }][]).filter(([, rc]) => rc.out === g).map(([b]) => b);
  const users = (Object.entries(RECIPES) as [Building, { out: Good; inputs: Partial<Record<Good, number>> }][]).filter(([, rc]) => rc.inputs[g]).map(([b]) => b);
  return (
    <div>
      <div class="plates c2">
        <Stat label="Chỉ số giá" value={fmt(r.price, 2)} sub={<Chip v={r.price - 1} />} />
        <Stat label="Giá thế giới" value={fmt(r.world, 2)} sub={<span>chênh {r.price >= r.world ? '+' : '−'}{fmt(Math.abs(r.price - r.world), 2)}</span>} />
        <Stat label="Cung / cầu" value={r.ratio !== null ? pct(r.ratio) : '—'} sub={s && <span class={`chip ${s.cls}`}>{s.label}</span>} />
        <Stat label="Nhập khẩu" value={r.imports !== null ? pct(r.imports) : '—'} sub="tỷ lệ trên nhu cầu" />
      </div>
      <Section title="Sản lượng tháng (đơn vị mô phỏng)">
        <div class="rowline"><span class="grow">Cung trong thị trường</span><b class="num">{r.supply !== null ? compact(r.supply) : '—'}</b></div>
        <div class="rowline"><span class="grow">Nhu cầu</span><b class="num">{r.demand !== null ? compact(r.demand) : '—'}</b></div>
        <div class="rowline"><span class="grow">Nhập khẩu từ thế giới</span><b class="num">{r.imports !== null && r.demand ? compact(r.imports * r.demand) : '—'}</b></div>
        <div class="rowline"><span class="grow">Nhu cầu không được đáp ứng</span><b class="num">{r.short !== null ? pct(r.short) : '—'}</b></div>
      </Section>
      {(makers.length > 0 || users.length > 0) && <Section title="Chuỗi sản xuất">
        {makers.map((b) => <div class="rowline" key={b}><span class="grow">Sản xuất bởi</span><b class="serif">{BUILD_VI[b]}</b></div>)}
        {users.map((b) => <div class="rowline" key={b}><span class="grow">Nguyên liệu của</span><b class="serif">{BUILD_VI[b]}</b></div>)}
      </Section>}
      <div class="note">Mô phỏng hiện chưa lưu lịch sử giá theo tháng, nên không có biểu đồ giá.</div>
    </div>
  );
}

export function BuildingsTab({ st }: { st: GameState }) {
  const id = viewedId(st); const regs = st.regions.filter((r) => r.owner === id);
  const [open, setOpen] = useState<Building | null>(null);
  const types = BUILDINGS.map((b) => ({ b, levels: regs.reduce((s, r) => s + r.buildings[b], 0), regs: regs.filter((r) => r.buildings[b] > 0).sort((x, y) => y.buildings[b] - x.buildings[b]) })).filter((t) => t.levels > 0);
  if (!types.length) return <div class="empty">Quốc gia này chưa có công trình nào.</div>;
  return (
    <div>
      {types.map((t) => (
        <div key={t.b}>
          <button class={`entry${open === t.b ? ' on' : ''}`} onClick={() => setOpen(open === t.b ? null : t.b)}>
            <span class="ico"><Icon name={t.b === 'railway' ? 'construction' : t.b === 'university' ? 'literacy' : 'buildings'} /></span>
            <div class="main"><div class="cat">{RECIPES[t.b] ? `Sản xuất ${GOOD_VI[RECIPES[t.b]!.out].toLowerCase()}` : t.b === 'railway' ? 'Hạ tầng' : t.b === 'university' ? 'Giáo dục' : 'Khai thác / nông nghiệp'}</div><div class="ttl">{BUILD_VI[t.b]}</div></div>
            <div class="aside"><div class="num" style="font-size:18px;font-weight:600">{fmt(t.levels)}</div><div class="dim" style="font-size:12px">cấp · {t.regs.length} vùng</div></div>
          </button>
          {open === t.b && <div style="background:#13201f;border:1px solid #0b1416;margin:2px 0 6px">
            {t.regs.map((r) => <div class="rowline" key={r.id} onClick={() => { ui.set({ region: r.id }); mapControls.focusRegion(r.id); }} style="cursor:pointer"><span class="grow serif">{data().region.get(r.id)?.name ?? r.id}</span><span class="num">cấp {r.buildings[t.b]}</span>{RECIPES[t.b] && <span class="dim num" style="font-size:12px;width:96px;text-align:right">{compact(r.buildings[t.b] * LEVEL_WORKERS)} việc làm</span>}</div>)}
          </div>}
        </div>
      ))}
      <div class="note">Mỗi cấp công trình sản xuất dùng {fmt(LEVEL_WORKERS)} lao động theo quy tắc của mô phỏng.</div>
    </div>
  );
}

export function ConstructionTab({ st }: { st: GameState }) {
  const id = viewedId(st); const c = st.countries[id]; const mine = canCommand(st, id);
  const ops: { r: Region; b: Building; cost: number; ret: number }[] = [];
  for (const r of st.regions) if (r.owner === id) for (const b of BUILDINGS) if (b !== 'university' && canBuild(st, c, r, b)) { const ret = buildingReturn(st, c, r, b); if (ret > 0) ops.push({ r, b, cost: buildCost(c, b, st), ret }); }
  ops.sort((a, b) => b.ret - a.ret);
  const statePool = (c as any).statePool ?? 0, privatePool = (c as any).privatePool ?? 0;
  const confirm = (o: (typeof ops)[number]) => modals.open(`Xây ${BUILD_VI[o.b]}`, () => (
    <div>
      <div class="serif" style="font-size:17px;margin-bottom:6px">{data().region.get(o.r.id)?.name}</div>
      <Section title="Chi phí"><div class="rowline"><span class="grow">Trích từ quỹ xây dựng nhà nước</span><b class="num">{money(o.cost)}</b></div><div class="rowline"><span class="grow">Quỹ hiện có</span><b class="num">{money(statePool)}</b></div></Section>
      <Section title="Lợi ích dự kiến"><div class="rowline"><span class="grow">Lợi suất năm (theo giá hiện tại, ước tính)</span><b class="num pos">{pct(o.ret, 1)}</b></div>{RECIPES[o.b] && <div class="rowline"><span class="grow">Việc làm</span><b class="num">{fmt(LEVEL_WORKERS)}</b></div>}</Section>
      <div class="note">Công trình hoàn thành ngay khi trả đủ chi phí; chi phí không hoàn lại. Giá đầu vào và đầu ra thay đổi theo thị trường.</div>
      <div class="btns"><button class="btn" onClick={() => modals.close()}>Hủy</button><button class="btn primary" disabled={statePool < o.cost} onClick={() => { if (send({ type: 'build', region: o.r.id, building: o.b }, `Đã xây ${BUILD_VI[o.b]} tại ${data().region.get(o.r.id)?.name}`)) modals.close(); }}>Xây</button></div>
    </div>
  ));
  return (
    <div>
      <div class="plates c2">
        <Stat label="Quỹ xây dựng nhà nước" value={money(statePool)} icon="construction" sub="tích lũy từ ngân sách xây dựng" />
        <Stat label="Quỹ đầu tư tư nhân" value={money(privatePool)} icon="treasury" sub="nhà đầu tư tự xây theo lợi suất" />
      </div>
      <Section title="Cơ hội xây dựng" extra={`${ops.length} lựa chọn`}>
        {ops.slice(0, 40).map((o) => (
          <div class="entry" key={o.r.id + o.b} style="cursor:default">
            <span class="ico"><Icon name="buildings" /></span>
            <div class="main"><div class="cat ellipsis">{data().region.get(o.r.id)?.name}</div><div class="ttl">{BUILD_VI[o.b]}</div><div class="meta num">Chi phí {money(o.cost)} · lợi suất {pct(o.ret, 1)}/năm</div></div>
            {mine && <button class="btn sm" onClick={() => confirm(o)}>Xây</button>}
          </div>
        ))}
        {!ops.length && <div class="empty">Không có công trình nào sinh lời ở mức giá hiện tại.</div>}
      </Section>
      {!mine && <div class="note">Chỉ xem: bạn không điều khiển quốc gia này.</div>}
    </div>
  );
}

export function BudgetTab({ st }: { st: GameState }) {
  const id = viewedId(st); const c = st.countries[id]; const mine = canCommand(st, id);
  const tax = c.income - c.tariffIncome; const bal = c.income - c.expense;
  const [rate, setRate] = useState(c.taxRate);
  const slider = (key: 'education' | 'health' | 'admin' | 'construction', label: string) => (
    <div class="rowline" style="flex-wrap:wrap">
      <span class="grow serif" style="font-size:15px">{label}</span><b class="num">{pct(c.budget[key])}</b>
      {mine && <input type="range" min={0} max={0.4} step={0.01} value={c.budget[key]} onChange={(e) => send({ type: 'set_budget', key, value: Number((e.target as HTMLInputElement).value) }, `${label}: ${pct(Number((e.target as HTMLInputElement).value))} thu nhập`)} />}
    </div>
  );
  return (
    <div>
      <div class="plates c3">
        <Stat label="Ngân khố" value={money(c.treasury)} icon="treasury" />
        <Stat label="Cán cân / tháng" value={<span class={bal >= 0 ? 'pos' : 'neg'}>{bal >= 0 ? '+' : '−'}{compact(Math.abs(bal))}</span>} icon="gdp" />
        <Stat label="Nợ công" value={money(c.debt)} icon="scroll" />
      </div>
      <Section title="Thu nhập tháng">
        <div class="rowline"><span class="grow">Thuế ({pct(c.taxRate)} GDP)</span><b class="num pos">+{compact(tax)}</b></div>
        <div class="rowline"><span class="grow">Thuế quan</span><b class="num pos">+{compact(c.tariffIncome)}</b></div>
        <div class="rowline"><span class="grow serif">Tổng thu</span><b class="num">{compact(c.income)}</b></div>
        <div class="rowline"><span class="grow serif">Tổng chi (quân đội, hải quân, dân sự, xây dựng, lãi)</span><b class="num neg">−{compact(c.expense)}</b></div>
      </Section>
      <Section title="Thuế suất">
        <div class="rowline" style="flex-wrap:wrap"><span class="grow">Thuế suất trên GDP</span><b class="num">{pct(rate)}</b>
          {mine && <input type="range" min={0.01} max={0.3} step={0.005} value={rate} onInput={(e) => setRate(Number((e.target as HTMLInputElement).value))} onChange={(e) => send({ type: 'set_tax', rate: Number((e.target as HTMLInputElement).value) }, `Thuế suất mới: ${pct(Number((e.target as HTMLInputElement).value), 1)}`)} />}</div>
      </Section>
      <Section title="Phân bổ ngân sách (tỷ lệ thu nhập)">
        {slider('admin', 'Hành chính')}{slider('education', 'Giáo dục')}{slider('health', 'Y tế')}{slider('construction', 'Xây dựng')}
      </Section>
      {!mine && <div class="note">Chỉ xem: bạn không điều khiển quốc gia này.</div>}
    </div>
  );
}

export function EconomyScreen({ st, tab, portrait }: { st: GameState; tab: string; portrait: boolean }) {
  if (tab === 'buildings') return <BuildingsTab st={st} />;
  if (tab === 'construction') return <ConstructionTab st={st} />;
  if (tab === 'budget') return <BudgetTab st={st} />;
  return <MarketTab st={st} portrait={portrait} />;
}
export const ECONOMY_TABS: [string, string][] = [['market', 'Thị trường'], ['buildings', 'Công trình'], ['construction', 'Xây dựng'], ['budget', 'Ngân sách']];
export { CountryLink };
