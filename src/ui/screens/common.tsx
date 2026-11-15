// Helpers shared by screens: who the UI is looking at, command dispatch with feedback, small widgets.
import { game } from '../game/controller';
import { ui } from '../game/ui';
import type { Command } from '../../engine/commands';
import type { Country, GameState } from '../../engine/types';
import { rankings } from '../../engine/metrics';
import { fullName, shortName } from '../game/names';
import { modals } from '../components/ui';

/** The country whose data the national screens show: the player's, or in Observer Mode the followed one. */
export function viewedId(st: GameState): string {
  return st.player ?? ui.get().follow ?? rankings(st)[0]?.id ?? Object.keys(st.countries)[0];
}
export const isObserver = (st: GameState) => !st.player;
export const canCommand = (st: GameState, id: string) => !!st.player && st.player === id && st.countries[id]?.alive;

const REASONS_VI: [RegExp, string][] = [
  [/Observer Mode/i, 'Chế độ quan sát: không điều khiển quốc gia nào.'],
  [/already in progress|unchanged/i, 'Đang có cải cách khác hoặc luật không thay đổi.'],
  [/Not buildable/i, 'Không thể xây công trình này ở vùng này.'],
  [/Insufficient construction funds/i, 'Không đủ quỹ xây dựng.'],
  [/Prerequisites/i, 'Chưa đủ công nghệ tiền đề hoặc đã nghiên cứu.'],
  [/Refused \(acceptance/i, 'Đối phương từ chối liên minh.'],
  [/Subjects/i, 'Chư hầu (trừ triều cống) không thể tự lập liên minh.'],
];
/** Sends a command through the engine and reports the engine's own result; never fakes success. */
export function send(cmd: Command, okText: string): boolean {
  const r = game.command(cmd);
  if (r.ok) game.toast(okText, 'ok');
  else { const vi = REASONS_VI.find(([re]) => re.test(r.reason ?? ''))?.[1]; game.toast(vi ? `${vi}${r.reason && /\d/.test(r.reason) ? ` (${r.reason})` : ''}` : `Không thực hiện được: ${r.reason ?? 'lý do không rõ'}`, 'error'); }
  return r.ok;
}
export function Flag({ c, sm }: { c: Country | undefined; sm?: boolean }) {
  return <span class={`flag${sm ? ' sm' : ''}`} style={`background:${c?.color ?? '#555'}`} />;
}
export function CountryLink({ st, id }: { st: GameState; id: string }) {
  const c = st.countries[id];
  return (
    <span class="gi" style="cursor:pointer;display:inline-flex;align-items:center;gap:6px" onClick={(e) => { e.stopPropagation(); modals.close(); ui.set({ country: id, screen: 'country', tabs: { ...ui.get().tabs, country: 'overview' } }); }}>
      <Flag c={c} sm /><span class="serif" style="font-size:15px">{shortName(st, id)}</span>
    </span>
  );
}
export const titleOf = (st: GameState, id: string) => fullName(st, id);
export function monthYear(st: GameState) { return `tháng ${st.date.m}/${st.date.y}`; }
