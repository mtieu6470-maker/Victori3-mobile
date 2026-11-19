// Population window: structure (strata), distributions of standard of living and literacy across the
// population (weighted by regional population, from engine state), regions ledger and culture / religion shares.
import type { GameState } from '../../engine/types';
import { STRATA } from '../../engine/types';
import { data } from '../../engine/data/db';
import { Sec, Metric, LineChart, QualityMark, HBars, Donut, useWidth, useSort } from '../components/ui';
import { STRATA_VI, fmt, pct, compact, money } from '../i18n/vi';
import { viewedId, monthYear, focusRegion, regionName, STRATA_COL, YoY } from './common';
import { ui } from '../game/ui';

const pretty = (id: string) => id.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
const PALETTE = ['#c9a45e', '#6c9dd0', '#c0606c', '#8cc46b', '#b48edb', '#5fb3ae', '#e0b07a', '#9aa7b0', '#d98a5f', '#7f9a56', '#c7ad6a', '#a77e9c', '#6f8fa8', '#b0b07a'];

/** Population-weighted histogram of a regional value. */
function bins(regs: { pop: number; v: number }[], edges: number[]): number[] {
  const out = new Array(edges.length - 1).fill(0);
  for (const r of regs) { let i = edges.findIndex((e, k) => k > 0 && r.v < e) - 1; if (i < 0) i = r.v < edges[0] ? 0 : out.length - 1; out[i] += r.pop; }
  return out;
}

export function SocietyScreen({ st, tab }: { st: GameState; tab: string }) {
  if (tab === 'regions') return <Regions st={st} />;
  if (tab === 'culture') return <Culture st={st} />;
  const id = viewedId(st); const c = st.countries[id]; const regs = st.regions.filter((r) => r.owner === id); const pop = regs.reduce((s, r) => s + r.pop, 0) || 1;
  const strata = STRATA.map((_, i) => regs.reduce((s, r) => s + r.strata[i] * r.pop, 0) / pop);
  const h = st.history[id] ?? []; const e = data().entity.get(id);
  const sols = regs.map((r) => r.sol); const lo = Math.min(...sols), hi = Math.max(...sols);
  const step = (hi - lo) / 5 || 1; const solEdges = [0, 1, 2, 3, 4, 5].map((k) => lo + k * step); solEdges[5] = hi + 1e-9;
  const solB = bins(regs.map((r) => ({ pop: r.pop, v: r.sol })), solEdges);
  const litEdges = [0, 0.1, 0.25, 0.5, 0.75, 1.0001]; const litB = bins(regs.map((r) => ({ pop: r.pop, v: r.literacy })), litEdges);
  const radical = regs.reduce((s, r) => s + r.radical * r.pop, 0) / pop; const unrest = regs.reduce((s, r) => s + r.unrest * r.pop, 0) / pop;
  return (
    <div class="pad">
      <div class="metrics">
        <Metric label="Dân số" icon="population" value={compact(c.stats.pop)} d={<YoY h={h} k="pop" />} spark={h.map((x) => x.pop)} q={e ? { quality: e.population.quality, sources: e.population.sources as any, method: e.population.method } : null} tip={{ title: 'Dân số', lines: e ? [['Khởi đầu 1836 (CSDL)', compact((e.population as any).value ?? 0)], ['Hiện tại (mô phỏng)', compact(c.stats.pop)]] : [['Hiện tại', compact(c.stats.pop)]], note: `Số liệu ${monthYear(st)}. Ký hiệu cạnh nhãn: độ tin cậy của số liệu khởi đầu.` }} />
        <Metric label="Biết chữ" icon="literacy" value={pct(c.stats.literacy)} d={<YoY h={h} k="literacy" />} spark={h.map((x) => x.literacy)} />
        <Metric label="Mức sống TB" icon="society" value={fmt(c.stats.sol, 2)} d={<span class="dim">chỉ số mô phỏng</span>} />
        <Metric label="Cực đoan · bất ổn" icon="radical" value={`${pct(radical)} · ${pct(unrest)}`} d={c.famine > 0.01 ? <span class="neg">thiếu lương thực {pct(c.famine)}</span> : <span class="dim">không có nạn đói</span>} />
      </div>
      <Sec title="Cơ cấu tầng lớp" icon="people" x={`${regs.length} vùng`}>
        <Donut parts={STRATA.map((s, i) => ({ label: STRATA_VI[s], v: strata[i], c: STRATA_COL[i] }))} size={124} center={compact(c.stats.pop)} sub="DÂN SỐ" legend={false} />
        <table class="dt" style="margin-top:8px">
          <thead><tr><th>Tầng lớp</th><th class="r">Dân số</th><th class="r">Tỷ lệ</th><th style="width:34%" /></tr></thead>
          <tbody>{STRATA.map((s, i) => strata[i] > 0.0005 && (
            <tr key={s} style="cursor:default"><td><span class="cell-ic"><span class="sw" style={`background:${STRATA_COL[i]}`} />{STRATA_VI[s]}</span></td><td class="r num">{compact(strata[i] * pop)}</td><td class="r num">{pct(strata[i], 1)}</td><td><span class="bar"><i style={`width:${(strata[i] / Math.max(...strata)) * 100}%;background:${STRATA_COL[i]}`} /></span></td></tr>
          ))}</tbody>
        </table>
      </Sec>
      <Sec title="Việc làm và tiền lương" icon="factory" x="theo tầng lớp">
        {(() => {
          const rows = STRATA.map((stratum, i) => {
            const employed = regs.reduce((sum, r) => sum + Math.max(0, r.employment?.[i] ?? 0), 0);
            const wageMass = regs.reduce((sum, r) => sum + Math.max(0, r.employment?.[i] ?? 0) * Math.max(0, r.wages?.[i] ?? 0), 0);
            return { stratum, employed, wage: employed > 0 ? wageMass / employed : 0 };
          }).filter((row) => row.employed > 0);
          const total = rows.reduce((sum, row) => sum + row.employed, 0);
          return rows.length ? (
            <>
              <div class="kv"><span class="k">Tổng lao động được ghi nhận</span><span class="v num">{compact(total)}</span></div>
              <table class="dt" style="margin-top:8px">
                <thead><tr><th>Tầng lớp</th><th class="r">Lao động</th><th class="r">Lương TB / tháng</th></tr></thead>
                <tbody>{rows.map((row) => (
                  <tr key={row.stratum} style="cursor:default">
                    <td>{STRATA_VI[row.stratum]}</td>
                    <td class="r num">{compact(row.employed)}</td>
                    <td class="r num">{money(row.wage)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </>
          ) : <div class="empty sm">Chưa có dữ liệu tiền lương; hãy chạy mô phỏng ít nhất một tháng.</div>;
        })()}
        <div class="note">Lương là mức bình quân theo lao động được ghi nhận. Tiền lương của tháng trước tác động đến sức mua và dịch chuyển tầng lớp trong các tháng sau.</div>
      </Sec>
      <div class="cols c2">
        <Sec title="Phân bố mức sống" icon="society" x="theo dân số">
          <HBars rows={solB.map((v, k) => ({ label: `${fmt(solEdges[k], 2)}–${fmt(Math.min(hi, solEdges[k + 1]), 2)}`, v: v / pop }))} max={1} fmtV={(v) => pct(v)} color="#c7ad6a" />
        </Sec>
        <Sec title="Phân bố biết chữ" icon="literacy" x="theo dân số">
          <HBars rows={litB.map((v, k) => ({ label: `${fmt(litEdges[k] * 100)}–${fmt(Math.min(100, litEdges[k + 1] * 100))}%`, v: v / pop }))} max={1} fmtV={(v) => pct(v)} color="#93bad6" />
        </Sec>
      </div>
      <Sec title="Dân số theo năm" icon="gdp"><LineChart years={h.map((x) => x.y)} series={[{ name: 'Dân số', color: '#d9bd7c', values: h.map((x) => x.pop) }]} fmtY={compact} height={120} /></Sec>
      <div class="note">Phân bố tính trên các vùng của quốc gia, mỗi vùng mang giá trị trung bình của vùng đó và được tính theo dân số.</div>
    </div>
  );
}

function Regions({ st }: { st: GameState }) {
  const id = viewedId(st); const regs = st.regions.filter((r) => r.owner === id); const sel = ui.get().region;
  const [ref, w] = useWidth<HTMLDivElement>();
  const { s, th } = useSort<'name' | 'pop' | 'sol' | 'literacy' | 'radical' | 'unrest' | 'output'>('pop');
  const v = (r: (typeof regs)[number]) => (s.k === 'name' ? regionName(r.id) : (r as any)[s.k] as number);
  const rows = [...regs].sort((a, b) => { const x = v(a), y = v(b); return (typeof x === 'string' ? x.localeCompare(y as string) : (x as number) - (y as number)) * s.dir; });
  return (
    <div class="pad" ref={ref}>
      <table class="dt">
        <thead><tr>{th('name', 'Vùng')}{th('pop', 'Dân số', 'r')}{th('sol', 'Mức sống', 'r')}{th('literacy', 'Biết chữ', 'r')}{w >= 470 && th('radical', 'Cực đoan', 'r')}{w >= 560 && th('unrest', 'Bất ổn', 'r')}{w >= 640 && th('output', 'Sản lượng', 'r')}</tr></thead>
        <tbody>{rows.map((r) => { const q = data().region.get(r.id)?.pop_quality; return (
          <tr key={r.id} class={sel === r.id ? 'on' : ''} onClick={() => focusRegion(r.id)}>
            <td><div class="nm ellipsis" style="max-width:200px">{regionName(r.id)}</div>{r.controller !== r.owner && <div class="sub tag down">bị chiếm</div>}</td>
            <td class="r num">{compact(r.pop)}{q && <QualityMark quality={q} />}</td><td class="r num">{fmt(r.sol, 2)}</td><td class="r num">{pct(r.literacy)}</td>
            {w >= 470 && <td class="r num">{pct(r.radical)}</td>}{w >= 560 && <td class="r num">{pct(r.unrest)}</td>}{w >= 640 && <td class="r num">¤ {compact(r.output)}</td>}
          </tr>); })}</tbody>
      </table>
      <div class="note">Chạm một vùng để chọn và xem trên bản đồ. {w < 640 && 'Mở rộng cửa sổ để xem thêm cột.'}</div>
    </div>
  );
}

function Culture({ st }: { st: GameState }) {
  const id = viewedId(st); const regs = st.regions.filter((r) => r.owner === id); const pop = regs.reduce((s, r) => s + r.pop, 0) || 1;
  const cult = new Map<string, number>(), rel = new Map<string, number>();
  for (const r of regs) { cult.set(r.culture, (cult.get(r.culture) ?? 0) + r.pop * (1 - r.c2)); if (r.culture2) cult.set(r.culture2, (cult.get(r.culture2) ?? 0) + r.pop * r.c2); rel.set(r.religion, (rel.get(r.religion) ?? 0) + r.pop); }
  const list = (m: Map<string, number>) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14).map(([k, v]) => ({ label: pretty(k), v: v / pop, key: k }));
  return (
    <div class="pad">
      <div class="cols c2">
        <Sec title="Văn hóa" icon="people" x={`${cult.size} nhóm`}><Donut parts={list(cult).map((r, i) => ({ label: r.label, v: r.v, c: PALETTE[i % PALETTE.length] }))} size={116} center={`${cult.size}`} sub="NHÓM" /></Sec>
        <Sec title="Tôn giáo" icon="scroll" x={`${rel.size} nhóm`}><Donut parts={list(rel).map((r, i) => ({ label: r.label, v: r.v, c: PALETTE[(i + 3) % PALETTE.length] }))} size={116} center={`${rel.size}`} sub="NHÓM" /></Sec>
      </div>
      <div class="note">Tên văn hóa và tôn giáo hiển thị theo mã của cơ sở dữ liệu (chưa có bản dịch tiếng Việt).</div>
    </div>
  );
}
export const SOCIETY_TABS: [string, string][] = [['pop', 'Tổng quan'], ['regions', 'Vùng'], ['culture', 'Văn hóa & tôn giáo']];
