// Helpers shared by screens: who the UI is looking at, command dispatch with feedback, links, palettes.
import { game } from '../game/controller';
import { ui } from '../game/ui';
import type { Command } from '../../engine/commands';
import type { Country, GameState, YearStat } from '../../engine/types';
import { rankings } from '../../engine/metrics';
import { data } from '../../engine/data/db';
import { fullName, shortName } from '../game/names';
import { modals, Delta } from '../components/ui';
import { mapControls } from '../map/MapView';

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
/** Country emblem: a game heraldic shield in the country's map colour with the initial of its short name. It is a
 *  game identity mark, deliberately not an imitation of a historical flag (flags are not in the database). */
export function Flag({ c, sm, lg }: { c: Country | undefined; sm?: boolean; lg?: boolean }) {
  const init = c ? [...shortName(null, c.id)][0]?.toLocaleUpperCase('vi') ?? '?' : '?';
  return <span class={`emblem-wrap${sm ? ' sm' : ''}${lg ? ' lg' : ''}`} aria-hidden="true"><span class="emblem" style={`--ec:${c?.color ?? '#555'}`}><b>{init}</b></span></span>;
}
export function openCountry(id: string) { modals.close(); ui.set({ country: id, screen: 'country', tabs: { ...ui.get().tabs, country: 'overview' } }); }
export function CountryLink({ st, id }: { st: GameState; id: string }) {
  return <span class="clink" onClick={(e) => { e.stopPropagation(); openCountry(id); }}><Flag c={st.countries[id]} sm /><span>{shortName(st, id)}</span></span>;
}
export const regionName = (id: string) => data().region.get(id)?.name ?? id;
export function focusRegion(id: string) { ui.set({ region: id }); mapControls.focusRegion(id); }
export const titleOf = (st: GameState, id: string) => fullName(st, id);
export function monthYear(st: GameState) { return `tháng ${st.date.m}/${st.date.y}`; }
export const leaderName = (n: string) => n.replace(/ \(.*generated\)/, '');

/** Year-on-year change of the last two yearly samples, or null if fewer than two exist. */
export function yoy(h: YearStat[], k: keyof YearStat): number | null {
  if (h.length < 2) return null; const a = h[h.length - 2][k], b = h[h.length - 1][k]; return a ? b / a - 1 : null;
}
export function YoY({ h, k, invert }: { h: YearStat[]; k: keyof YearStat; invert?: boolean }) {
  const v = yoy(h, k); return v === null ? <span class="dim">chưa đủ mẫu năm</span> : <span><Delta v={v} dp={1} invert={invert} /> <span class="dim">/năm</span></span>;
}

export const STRATA_COL = ['#8c7a5b', '#6d4848', '#a3875f', '#c9a66b', '#7f9fc4', '#93c47a', '#b48edb', '#d9604a', '#e3b65e'];
export const IG_COL: Record<string, string> = { landowners: '#a8794a', industrialists: '#5d8fb8', intelligentsia: '#8fb3a0', petty_bourgeoisie: '#c7ad6a', clergy: '#b4a4d6', armed_forces: '#9c5a4e', rural_folk: '#7f9a56', trade_unions: '#c2665a' };
export const LOG_ICON: Record<string, string> = { war: 'military', law: 'laws', state: 'flag', diplomacy: 'diplomacy', succession: 'legitimacy', revolution: 'radical', economy: 'economy', territory: 'map', tech: 'research', event: 'scroll', decision: 'scroll', disaster: 'warning' };
