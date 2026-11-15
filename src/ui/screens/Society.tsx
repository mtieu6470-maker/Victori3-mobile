// Society: population structure, regions, cultures & religions.
import type { GameState } from '../../engine/types';
import { STRATA } from '../../engine/types';
import { data } from '../../engine/data/db';
import { Section, Stat, LineChart, QualityMark } from '../components/ui';
import { STRATA_VI, fmt, pct, compact } from '../i18n/vi';
import { viewedId, monthYear } from './common';
import { ui } from '../game/ui';
import { mapControls } from '../map/MapView';

const STRATA_COL = ['#8c7a5b', '#6b4a4a', '#a68a64', '#c9a66b', '#7f9fc4', '#93c47a', '#b48edb', '#d9604a', '#e3b65e'];
const pretty = (id: string) => id.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());

export function SocietyScreen({ st, tab }: { st: GameState; tab: string }) {
  const id = viewedId(st); const c = st.countries[id]; const regs = st.regions.filter((r) => r.owner === id); const pop = regs.reduce((s, r) => s + r.pop, 0) || 1;
  if (tab === 'regions') {
    const rows = [...regs].sort((a, b) => b.pop - a.pop);
    return (
      <div class="tbl-wrap">
        <table class="ledger">
          <thead><tr><th>Vùng</th><th class="r">Dân số</th><th class="r">Mức sống</th><th class="r">Biết chữ</th><th class="r">Cực đoan</th></tr></thead>
          <tbody>{rows.map((r) => { const q = data().region.get(r.id)?.pop_quality; return (
            <tr key={r.id} class={ui.get().region === r.id ? 'on' : ''} onClick={() => { ui.set({ region: r.id }); mapControls.focusRegion(r.id); }}>
              <td><span class="nm">{data().region.get(r.id)?.name ?? r.id}</span>{r.controller !== r.owner && <span class="chip down" style="margin-left:6px">bị chiếm</span>}</td>
              <td class="r num">{compact(r.pop)} {q && <QualityMark quality={q} />}</td><td class="r num">{fmt(r.sol, 2)}</td><td class="r num">{pct(r.literacy)}</td><td class="r num">{pct(r.radical)}</td>
            </tr>); })}</tbody>
        </table>
      </div>
    );
  }
  if (tab === 'culture') {
    const cult = new Map<string, number>(), rel = new Map<string, number>();
    for (const r of regs) { cult.set(r.culture, (cult.get(r.culture) ?? 0) + r.pop * (1 - r.c2)); if (r.culture2) cult.set(r.culture2, (cult.get(r.culture2) ?? 0) + r.pop * r.c2); rel.set(r.religion, (rel.get(r.religion) ?? 0) + r.pop); }
    const list = (m: Map<string, number>) => [...m.entries()].sort((a, b) => b[1] - a[1]);
    return (
      <div>
        <Section title="Văn hóa">{list(cult).map(([k, v]) => <div class="rowline" key={k}><span class="grow serif" style="font-size:15px">{pretty(k)}</span><span class="num">{compact(v)}</span><span class="num dim" style="width:52px;text-align:right">{pct(v / pop)}</span></div>)}</Section>
        <Section title="Tôn giáo">{list(rel).map(([k, v]) => <div class="rowline" key={k}><span class="grow serif" style="font-size:15px">{pretty(k)}</span><span class="num">{compact(v)}</span><span class="num dim" style="width:52px;text-align:right">{pct(v / pop)}</span></div>)}</Section>
        <div class="note">Tên văn hóa/tôn giáo hiển thị theo mã của cơ sở dữ liệu (chưa có bản dịch tiếng Việt).</div>
      </div>
    );
  }
  const strata = STRATA.map((_, i) => regs.reduce((s, r) => s + r.strata[i] * r.pop, 0) / pop);
  const h = st.history[id] ?? [];
  const e = data().entity.get(id);
  return (
    <div>
      <div class="plates c2">
        <Stat label="Dân số" icon="population" value={compact(c.stats.pop)} sub={`số liệu ${monthYear(st)}`} />
        <Stat label="Biết chữ" icon="literacy" value={pct(c.stats.literacy)} />
        <Stat label="Mức sống trung bình" icon="society" value={fmt(c.stats.sol, 2)} sub="chỉ số của mô phỏng" />
        <Stat label="Cực đoan" icon="radical" value={pct(c.radicalism)} sub={c.famine > 0.01 ? <span class="neg">Thiếu lương thực {pct(c.famine)}</span> : 'Không có nạn đói'} />
      </div>
      <Section title="Cơ cấu tầng lớp">
        <div style="display:flex;height:16px;border:1px solid #0b1416;margin:2px 0 6px">{strata.map((f, i) => f > 0 && <i key={i} style={`width:${f * 100}%;background:${STRATA_COL[i]}`} title={STRATA_VI[STRATA[i]]} />)}</div>
        {STRATA.map((s, i) => strata[i] > 0.0005 && <div class="rowline" key={s} style="min-height:32px"><span class="sw" style={`background:${STRATA_COL[i]}`} /><span class="grow">{STRATA_VI[s]}</span><span class="num">{compact(strata[i] * pop)}</span><span class="num dim" style="width:52px;text-align:right">{pct(strata[i], 1)}</span></div>)}
      </Section>
      <Section title="Dân số theo năm"><LineChart years={h.map((x) => x.y)} series={[{ name: 'pop', color: '#d9bd7c', values: h.map((x) => x.pop) }]} fmtY={compact} /></Section>
      {e && <div class="note">Dân số khởi đầu 1836: {compact((e.population as any).value ?? 0)} <QualityMark quality={e.population.quality} sources={e.population.sources as any} method={e.population.method} /> — chạm ký hiệu để xem nguồn.</div>}
    </div>
  );
}
export const SOCIETY_TABS: [string, string][] = [['pop', 'Dân số'], ['regions', 'Vùng'], ['culture', 'Văn hóa & tôn giáo']];
