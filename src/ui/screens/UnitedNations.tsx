// DIPLO-UN-01: United Nations view (read-only engine state). No rules live here.
import type { GameState } from '../../engine/types';
import { councilSeats, UN_PARAMS } from '../../engine/systems/un';
import { POST_1945_NORM, CONTAIN_AGGRESSOR } from '../../engine/systems/diplomacy';
import { Sec, Metric } from '../components/ui';
import { fmt } from '../i18n/vi';
import { CountryLink } from './common';

const yearOf = (tick: number) => 1836 + Math.floor(tick / 12);
const VOTE_VI = { for: 'Thuận', against: 'Chống', abstain: 'Trắng' } as const;

export function UnitedNationsTab({ st }: { st: GameState }) {
  const un = st.un;
  if (!un) {
    return (
      <div class="pad">
        <div class="empty">Liên Hợp Quốc chưa được thành lập.</div>
        <div class="note">Ở chế độ Lịch sử, Liên Hợp Quốc được thành lập tháng 10/1945: 4 thành viên thường trực Hội đồng Bảo an có quyền phủ quyết (4 nước mạnh nhất trong các nước giữ Washington, London, Paris, Moskva, Bắc Kinh), các ghế không thường trực nhiệm kỳ 2 năm (6 ghế, từ 1966 là 10 ghế).</div>
      </div>
    );
  }
  const seats = councilSeats(st);
  const needed = st.date.y >= 1966 ? UN_PARAMS.votesNeededFrom1966 : UN_PARAMS.votesNeededBefore1966;
  const recent = [...un.resolutions].reverse().slice(0, 20);
  return (
    <div class="pad">
      <div class="metrics">
        <Metric label="Thành viên" icon="diplomacy" value={fmt(un.members.length)} d={<span class="dim">thành lập năm {yearOf(un.founded)}</span>} />
        <Metric label="Hội đồng Bảo an" icon="laws" value={`${fmt(seats.length)} ghế`} d={<span class="dim">cần {needed} phiếu, không bị phủ quyết</span>} />
        <Metric label="Nghị quyết lên án" icon="military" value={fmt(un.resolutions.length)} d={<span class="dim">thông qua {un.resolutions.filter((r) => r.passed).length} · phủ quyết {un.resolutions.filter((r) => r.vetoedBy.length).length}</span>} />
      </div>
      <Sec title="Thành viên thường trực (quyền phủ quyết)">
        {un.permanent.map((id) => <div class="row" key={id}><div class="grow"><CountryLink st={st} id={id} /></div><span class="chip">Phủ quyết</span></div>)}
      </Sec>
      <Sec title="Thành viên không thường trực">
        {un.elected.map((e) => <div class="row" key={e.id}><div class="grow"><CountryLink st={st} id={e.id} /></div><span class="dim">đến {yearOf(e.until)}</span></div>)}
      </Sec>
      <Sec title="Nghị quyết gần đây">
        {recent.length ? recent.map((r) => {
          const yes = Object.values(r.votes).filter((v) => v === 'for').length;
          return (
            <div class="row" key={`${r.war}-${r.tick}`}>
              <div class="grow">
                <div class="t sm">{yearOf(r.tick)}: lên án <CountryLink st={st} id={r.attacker} /> tấn công <CountryLink st={st} id={r.defender} /></div>
                <div class="s">{yes} phiếu thuận · {r.passed ? <span class="pos">được thông qua</span> : r.vetoedBy.length ? <span class="neg">bị phủ quyết ({r.vetoedBy.map((v) => st.countries[v]?.nameVi ?? v).join(', ')})</span> : <span class="dim">không đủ phiếu</span>}</div>
                <div class="s dim">{Object.entries(r.votes).map(([m, v]) => `${st.countries[m]?.nameVi ?? m}: ${VOTE_VI[v]}`).join(' · ')}</div>
              </div>
            </div>
          );
        }) : <div class="empty sm">Chưa có nghị quyết nào.</div>}
      </Sec>
      <div class="note">Sau 1945, chiến tranh xâm lược bị tai tiếng gấp {POST_1945_NORM.infamy} lần và kiệt quệ nhanh hơn. Nghị quyết lên án được thông qua khiến bên tấn công thành kẻ xâm lược; các nước đánh kẻ xâm lược (tai tiếng ≥ {CONTAIN_AGGRESSOR.infamy} hoặc đang đi xâm lược) chỉ chịu {fmt(CONTAIN_AGGRESSOR.factor * 100)}% tai tiếng thông thường.</div>
    </div>
  );
}
