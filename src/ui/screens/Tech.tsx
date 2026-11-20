// Technology window: one tree per branch laid out by the historical year of each invention (era columns),
// prerequisite links drawn between nodes, four node states (known / researching / available / locked). A node
// opens a detail window with effects, prerequisites, what it unlocks, diffusion and the research action.
import type { GameState } from '../../engine/types';
import { data } from '../../engine/data/db';
import { availableTechs, researchPoints, techCost } from '../../engine/systems/technology';
import { Metric, Bar, Sec, details } from '../components/ui';
import { Icon } from '../components/icons';
import { techName, fmt, pct, compact, TECH_TREE_VI } from '../i18n/vi';
import { viewedId, canCommand, send } from './common';

const EFFECT_VI: Record<string, string> = {
  textile_efficiency: 'Năng suất dệt', factory_efficiency: 'Năng suất nhà máy', mine_efficiency: 'Năng suất khai mỏ', iron_efficiency: 'Năng suất luyện sắt', unlock_railway: 'Mở khóa đường sắt',
  market_access: 'Tiếp cận thị trường', trade_capacity: 'Năng lực thương mại', naval_projection: 'Tầm hoạt động hải quân', farm_efficiency: 'Năng suất nông nghiệp', admin_efficiency: 'Hiệu quả hành chính',
  research: 'Điểm nghiên cứu', arms_efficiency: 'Năng suất vũ khí', unlock_steel: 'Mở khóa thép', energy_efficiency: 'Hiệu quả năng lượng', steel_efficiency: 'Năng suất thép',
  army_quality: 'Chất lượng lục quân', navy_quality: 'Chất lượng hải quân', mobilization_speed: 'Tốc độ động viên', tropical_attrition: 'Hao hụt vùng nhiệt đới', colonial_advantage: 'Ưu thế thuộc địa',
  investment: 'Đầu tư tư nhân', literacy_growth: 'Tăng biết chữ', idea_spread: 'Lan truyền tư tưởng', mortality: 'Tử vong', army_attrition: 'Hao hụt quân đội', enables_ideology: 'Mở ra hệ tư tưởng', allow_multiple_alliances: 'Cho phép ký nhiều liên minh',
};
const effText = (k: string, v: unknown) => typeof v === 'number' ? (k.startsWith('unlock_') ? EFFECT_VI[k] ?? k : `${EFFECT_VI[k] ?? k.replace(/_/g, ' ')} ${v > 0 ? '+' : '−'}${fmt(Math.abs(v) * 100)}%`) : `${EFFECT_VI[k] ?? k.replace(/_/g, ' ')}${String(v) === 'true' ? '' : ': ' + String(v).replace(/_/g, ' ')}`;
const ERAS: [number, string][] = [[1800, 'Trước 1800'], [1836, '1800–1835'], [1851, '1836–1850'], [1866, '1851–1865'], [1886, '1866–1885'], [9999, 'Sau 1885']];
const eraOf = (y: number) => ERAS.findIndex(([lim]) => y < lim);
const NW = 160, NH = 58, CG = 34, RG = 10, TOP = 26;

type NodeState = 'known' | 'cur' | 'avail' | 'locked';
export function TechScreen({ st, tab }: { st: GameState; tab: string }) {
  const id = viewedId(st); const c = st.countries[id];
  const all = data().db.technologies; const techs = all.filter((t) => t.tree === tab).sort((a, b) => a.historical_year - b.historical_year);
  const avail = new Set(availableTechs(c)); const pts = researchPoints(st, c);
  const cur = c.research.current; const curCost = cur ? techCost(st, c, cur) : 0;
  const state = (tid: string): NodeState => (c.techs.includes(tid) ? 'known' : cur === tid ? 'cur' : avail.has(tid) ? 'avail' : 'locked');
  // layout: era columns, stacked rows
  const cols = new Map<number, string[]>(); for (const t of techs) { const e = eraOf(t.historical_year); cols.set(e, [...(cols.get(e) ?? []), t.id]); }
  const usedEras = [...cols.keys()].sort((a, b) => a - b);
  const pos = new Map<string, { x: number; y: number }>();
  usedEras.forEach((e, ci) => cols.get(e)!.forEach((tid, ri) => pos.set(tid, { x: ci * (NW + CG), y: TOP + ri * (NH + RG) })));
  const W = usedEras.length * (NW + CG) - CG; const H = TOP + Math.max(...usedEras.map((e) => cols.get(e)!.length)) * (NH + RG);
  const sel = details.use()?.key;
  const links = techs.flatMap((t) => t.prereqs.filter((p) => pos.has(p)).map((p) => ({ a: pos.get(p)!, b: pos.get(t.id)!, on: c.techs.includes(p), hl: sel === `tech:${t.id}` || sel === `tech:${p}` })));
  const known = techs.filter((t) => c.techs.includes(t.id)).length;
  const open = (tid: string) => details.toggle({ key: `tech:${tid}`, title: techName(tid), ctx: TECH_TREE_VI[tab], body: () => <TechDetail st={st} tid={tid} /> });
  return (
    <div class="pad">
      <div class="metrics">
        <Metric label="Đang nghiên cứu" icon="research" value={<span class="serif" style="font-size:18px">{cur ? techName(cur) : 'Chưa chọn'}</span>} d={cur ? <span style="display:block;margin-top:4px"><Bar frac={c.research.progress / curCost} /></span> : <span class="dim">chọn một công nghệ có thể nghiên cứu</span>} onClick={cur ? () => open(cur) : undefined} />
        <Metric label="Điểm / tháng" icon="literacy" value={compact(pts)} d={<span class="dim">{cur ? `còn ~${fmt(Math.max(0, Math.ceil((curCost - c.research.progress) / Math.max(1, pts))))} tháng` : '—'}</span>} tip={{ title: 'Điểm nghiên cứu', note: 'Phụ thuộc dân số biết chữ, đại học và công nghệ “Điểm nghiên cứu”.' }} />
        <Metric label={`Nhánh ${TECH_TREE_VI[tab]?.toLowerCase() ?? ''}`} icon="tech" value={`${known}/${techs.length}`} d={<span class="dim">{c.techs.length}/{all.length} toàn bộ</span>} />
      </div>
      <div class="tech-key"><span class="k known">Đã biết</span><span class="k cur">Đang nghiên cứu</span><span class="k avail">Có thể nghiên cứu</span><span class="k locked">Thiếu tiền đề</span></div>
      <div class="tree-scroll">
        <div class="tree" style={`width:${W}px;height:${H}px`}>
          {usedEras.map((e, ci) => <div class="era" key={e} style={`left:${ci * (NW + CG)}px;width:${NW}px`}>{ERAS[e][1]}</div>)}
          <svg class="links" width={W} height={H}>
            {links.map((l, i) => { const x1 = l.a.x + NW, y1 = l.a.y + NH / 2, x2 = l.b.x, y2 = l.b.y + NH / 2; const mx = (x1 + x2) / 2; return <path key={i} d={x2 > x1 ? `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}` : `M${l.a.x + NW / 2},${l.a.y + NH} L${l.b.x + NW / 2},${l.b.y}`} fill="none" stroke={l.hl ? 'var(--accent-hi)' : l.on ? 'rgba(147,196,122,.55)' : 'rgba(222,205,160,.28)'} stroke-width={l.hl ? 2 : 1.3} />; })}
          </svg>
          {techs.map((t) => { const p = pos.get(t.id)!; const s = state(t.id); return (
            <button key={t.id} class={`tnode ${s}${sel === `tech:${t.id}` ? ' on' : ''}`} style={`left:${p.x}px;top:${p.y}px;height:${NH}px`} onClick={() => open(t.id)}>
              <div class="n">{techName(t.id)}</div>
              <div class="m">{t.historical_year} · {s === 'known' ? 'đã biết' : s === 'cur' ? pct(c.research.progress / curCost) : `${compact(techCost(st, c, t.id))} điểm`}</div>
              {s === 'cur' && <span class="pbar"><i style={`width:${(c.research.progress / curCost) * 100}%`} /></span>}
            </button>); })}
        </div>
      </div>
      <div class="note">Cột theo năm phát minh lịch sử. Chi phí cao hơn khi nghiên cứu trước năm xuất hiện lịch sử và giảm khi nhiều nước khác đã biết (lan tỏa công nghệ). Mô phỏng nghiên cứu một công nghệ mỗi lúc, chưa có hàng đợi.</div>
    </div>
  );
}

function TechDetail({ st, tid }: { st: GameState; tid: string }) {
  const id = viewedId(st); const c = st.countries[id]; const mine = canCommand(st, id); const t = data().tech.get(tid)!;
  const avail = new Set(availableTechs(c)); const isKnown = c.techs.includes(tid), isCur = c.research.current === tid, can = avail.has(tid);
  const cost = techCost(st, c, tid); const pts = researchPoints(st, c);
  const alive = Object.values(st.countries).filter((x) => x.alive && !x.decentralized); const knowN = alive.filter((x) => x.techs.includes(tid)).length;
  const unlocks = data().db.technologies.filter((x) => x.prereqs.includes(tid));
  const missing = t.prereqs.filter((p) => !c.techs.includes(p)); const nextStep = missing.find((p) => avail.has(p));
  const eff = Object.entries(t.effects ?? {});
  return (
    <div>
      <div class="kv"><span class="k">Trạng thái</span><span class="v">{isKnown ? 'Đã biết' : isCur ? `Đang nghiên cứu · ${pct(c.research.progress / cost)}` : can ? 'Có thể nghiên cứu' : 'Thiếu tiền đề'}</span></div>
      <div class="kv"><span class="k">Năm xuất hiện lịch sử</span><span class="v num">{t.historical_year}</span></div>
      {!isKnown && <div class="kv"><span class="k">Chi phí · thời gian ước tính</span><span class="v num">{compact(cost)} điểm · ~{fmt(Math.ceil(Math.max(0, cost - (isCur ? c.research.progress : 0)) / Math.max(1, pts)))} tháng</span></div>}
      <div class="kv"><span class="k">Lan tỏa</span><span class="v num">{knowN}/{alive.length} quốc gia đã biết</span></div>
      <Sec title="Hiệu ứng">{eff.length ? eff.map(([k, v]) => <div class="row" key={k}><span class="ic"><Icon name="check" /></span><div class="grow">{effText(k, v)}</div></div>) : <div class="empty sm">Không có hiệu ứng trực tiếp.</div>}</Sec>
      <Sec title="Tiền đề">{t.prereqs.length ? t.prereqs.map((p) => { const k = c.techs.includes(p); const tr = data().tech.get(p)?.tree; return <div class="row" key={p}><span class="ic" style={`color:${k ? 'var(--pos)' : 'var(--neg)'}`}><Icon name={k ? 'check' : 'close'} /></span><div class="grow">{techName(p)}{tr && tr !== t.tree && <span class="dim"> · nhánh {TECH_TREE_VI[tr]?.toLowerCase()}</span>}</div></div>; }) : <div class="empty sm">Không cần tiền đề.</div>}</Sec>
      {unlocks.length > 0 && <Sec title="Mở đường cho">{unlocks.map((u) => <div class="row" key={u.id}><span class="ic"><Icon name="research" /></span><div class="grow">{techName(u.id)} <span class="dim">· {u.historical_year}</span></div></div>)}</Sec>}
      {mine && !isKnown && (
        <div class="btns" style="margin-top:12px">
          {can && !isCur && <button class="btn primary" onClick={() => send({ type: 'set_research', tech: tid }, `Bắt đầu nghiên cứu ${techName(tid)}`)}>Nghiên cứu</button>}
          {!can && nextStep && <button class="btn" onClick={() => send({ type: 'set_research', tech: nextStep }, `Bắt đầu nghiên cứu tiền đề ${techName(nextStep)}`)}>Nghiên cứu tiền đề: {techName(nextStep)}</button>}
        </div>
      )}
      {!can && !isKnown && missing.length > 0 && <div class="note">Bị chặn vì thiếu: {missing.map(techName).join(', ')}.</div>}
    </div>
  );
}
export const TECH_TABS: [string, string][] = [['production', 'Sản xuất'], ['society', 'Xã hội'], ['military', 'Quân sự']];
