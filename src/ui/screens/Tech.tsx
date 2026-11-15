// Technology: three trees ordered by the historical year of each invention; research choice via set_research.
import type { GameState } from '../../engine/types';
import { data } from '../../engine/data/db';
import { availableTechs, researchPoints, techCost } from '../../engine/systems/technology';
import { Section, Bar, Stat } from '../components/ui';
import { Icon } from '../components/icons';
import { techName, fmt, pct, compact } from '../i18n/vi';
import { viewedId, canCommand, send } from './common';

const EFFECT_VI: Record<string, string> = {
  textile_efficiency: 'Năng suất dệt', factory_efficiency: 'Năng suất nhà máy', mine_efficiency: 'Năng suất khai mỏ', iron_efficiency: 'Năng suất luyện sắt', unlock_railway: 'Mở khóa đường sắt',
  market_access: 'Tiếp cận thị trường', trade_capacity: 'Năng lực thương mại', naval_projection: 'Tầm hoạt động hải quân', farm_efficiency: 'Năng suất nông nghiệp', admin_efficiency: 'Hiệu quả hành chính',
  research: 'Điểm nghiên cứu', arms_efficiency: 'Năng suất vũ khí', unlock_steel: 'Mở khóa thép', energy_efficiency: 'Hiệu quả năng lượng', steel_efficiency: 'Năng suất thép',
  army_quality: 'Chất lượng lục quân', navy_quality: 'Chất lượng hải quân', mobilization_speed: 'Tốc độ động viên', tropical_attrition: 'Hao hụt vùng nhiệt đới', colonial_advantage: 'Ưu thế thuộc địa',
  investment: 'Đầu tư tư nhân', literacy_growth: 'Tăng biết chữ', idea_spread: 'Lan truyền tư tưởng', mortality: 'Tử vong', army_attrition: 'Hao hụt quân đội', enables_ideology: 'Mở ra hệ tư tưởng',
};
export function TechScreen({ st, tab }: { st: GameState; tab: string }) {
  const id = viewedId(st); const c = st.countries[id]; const mine = canCommand(st, id);
  const techs = data().db.technologies.filter((t) => t.tree === tab).sort((a, b) => a.historical_year - b.historical_year);
  const avail = new Set(availableTechs(c)); const pts = researchPoints(st, c);
  const cur = c.research.current; const curCost = cur ? techCost(st, c, cur) : 0;
  const known = (tid: string) => Object.values(st.countries).filter((x) => x.alive && !x.decentralized && x.techs.includes(tid)).length;
  const alive = Object.values(st.countries).filter((x) => x.alive && !x.decentralized).length;
  return (
    <div>
      <div class="plates c2">
        <Stat label="Đang nghiên cứu" icon="research" value={<span class="serif" style="font-size:17px">{cur ? techName(cur) : 'Chưa chọn'}</span>} sub={cur ? <span style="width:100%"><Bar frac={c.research.progress / curCost} /></span> : 'Chọn một công nghệ có thể nghiên cứu'} />
        <Stat label="Điểm nghiên cứu / tháng" icon="literacy" value={compact(pts)} sub={cur ? `còn ~${fmt(Math.max(0, Math.ceil((curCost - c.research.progress) / Math.max(1, pts))))} tháng` : '—'} />
      </div>
      <Section title={`${techs.filter((t) => c.techs.includes(t.id)).length}/${techs.length} đã biết`}>
        {techs.map((t) => {
          const isKnown = c.techs.includes(t.id), isCur = cur === t.id, can = avail.has(t.id);
          const state = isKnown ? 'Đã biết' : isCur ? 'Đang nghiên cứu' : can ? 'Có thể nghiên cứu' : 'Thiếu tiền đề';
          const eff = Object.entries(t.effects ?? {}).map(([k, v]) => typeof v === 'number' ? (k.startsWith('unlock_') ? EFFECT_VI[k] ?? k : `${EFFECT_VI[k] ?? k.replace(/_/g, ' ')} ${v > 0 ? '+' : '−'}${fmt(Math.abs(v) * 100)}%`) : `${EFFECT_VI[k] ?? k.replace(/_/g, ' ')}${String(v) === 'true' ? '' : ': ' + String(v).replace(/_/g, ' ')}`).join(' · ');
          return (
            <div class={`entry${isCur ? ' on' : ''}`} key={t.id} style={`cursor:default;opacity:${!isKnown && !can && !isCur ? 0.62 : 1}`}>
              <span class="ico" style={`color:${isKnown ? 'var(--pos)' : isCur ? 'var(--brass-hi)' : 'var(--brass)'}`}><Icon name={isKnown ? 'check' : 'research'} /></span>
              <div class="main"><div class="cat">{t.historical_year} · {state} · {fmt(known(t.id))}/{alive} nước đã biết</div><div class="ttl">{techName(t.id)}</div>
                <div class="meta">{eff || '—'}{t.prereqs.length ? ` · cần: ${t.prereqs.map(techName).join(', ')}` : ''}</div></div>
              {!isKnown && <div class="aside"><div class="num" style="font-weight:600">{compact(techCost(st, c, t.id))}</div><div class="dim" style="font-size:12px">điểm</div></div>}
              {mine && can && !isCur && <button class="btn sm" style="margin-left:6px" onClick={() => send({ type: 'set_research', tech: t.id }, `Bắt đầu nghiên cứu ${techName(t.id)}`)}>Chọn</button>}
            </div>
          );
        })}
      </Section>
      <div class="note">Chi phí cao hơn khi nghiên cứu trước năm xuất hiện lịch sử, và giảm khi nhiều nước khác đã biết (lan tỏa công nghệ).</div>
    </div>
  );
}
export const TECH_TABS: [string, string][] = [['production', 'Sản xuất'], ['society', 'Xã hội'], ['military', 'Quân sự']];
