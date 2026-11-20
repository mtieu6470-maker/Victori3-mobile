import type { GameDate } from './types';

export type SimulationCadence = 'six_hour' | 'daily' | 'weekly' | 'monthly' | 'yearly';
export interface CalendarPoint { date: GameDate; dayOfMonth: number; hourOfDay: number }
export interface ScheduledTask<State> {
  id: string;
  cadence: SimulationCadence;
  /** Dependencies order tasks due at the same boundary; older cadences use their latest committed state. */
  after?: readonly string[];
  run: (state: State) => void;
}

const VALID_HOURS = new Set([0, 6, 12, 18]);
const MONTH_STARTS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334] as const;
function daysBeforeYear(year: number): number {
  const prior = year - 1;
  return 365 * prior + Math.floor(prior / 4) - Math.floor(prior / 100) + Math.floor(prior / 400);
}
const EPOCH_DAYS = daysBeforeYear(1836);

export function isGregorianLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
export function daysInGregorianMonth(year: number, month: number): number {
  if (!Number.isSafeInteger(year) || year < 1 || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError('Invalid Gregorian year/month');
  }
  if (month === 2) return isGregorianLeapYear(year) ? 29 : 28;
  return month === 4 || month === 6 || month === 9 || month === 11 ? 30 : 31;
}
/** Zero-based Gregorian day index from 1836-01-01. */
export function campaignDayIndex(point: Pick<CalendarPoint, 'date' | 'dayOfMonth'>): number {
  const year = point.date.y, month = point.date.m, day = point.dayOfMonth;
  if (!Number.isSafeInteger(year) || year < 1836 || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError('Calendar date is outside the supported 1836+ campaign');
  }
  if (!Number.isInteger(day) || day < 1 || day > daysInGregorianMonth(year, month)) {
    throw new RangeError('Invalid day of month for Gregorian date');
  }
  return daysBeforeYear(year) - EPOCH_DAYS + MONTH_STARTS[month - 1]
    + (month > 2 && isGregorianLeapYear(year) ? 1 : 0) + day - 1;
}
/** Stable six-hour tick number. GameState.tick remains the legacy completed-month counter. */
export function clockTickAt(point: CalendarPoint): number {
  if (!VALID_HOURS.has(point.hourOfDay)) throw new RangeError('Simulation hour must be 00:00, 06:00, 12:00 or 18:00');
  return campaignDayIndex(point) * 4 + point.hourOfDay / 6;
}
/** Additive migration for legacy daily/monthly saves: calendar date is authoritative. */
export function normalizeCalendarClock<T extends {
  date: GameDate; dayOfMonth?: number; hourOfDay?: number; clockTick?: number;
}>(state: T): void {
  const validDay = Number.isInteger(state.dayOfMonth)
    && state.dayOfMonth! >= 1
    && state.dayOfMonth! <= daysInGregorianMonth(state.date.y, state.date.m);
  const day = validDay ? state.dayOfMonth! : 1;
  const hour = VALID_HOURS.has(state.hourOfDay ?? 0) ? (state.hourOfDay ?? 0) : 0;
  state.dayOfMonth = day;
  state.hourOfDay = hour;
  state.clockTick = clockTickAt({ date: state.date, dayOfMonth: day, hourOfDay: hour });
}
/** Cadences due after one six-hour regular tick. Weekly work is anchored to seven elapsed campaign days. */
export function dueCadencesForTransition(previous: CalendarPoint, next: CalendarPoint): Set<SimulationCadence> {
  if (clockTickAt(next) !== clockTickAt(previous) + 1) {
    throw new Error('Scheduler transition must advance exactly one six-hour tick');
  }
  const due = new Set<SimulationCadence>(['six_hour']);
  if (previous.hourOfDay !== 18 || next.hourOfDay !== 0) return due;
  due.add('daily');
  const elapsedDays = campaignDayIndex(next);
  if (elapsedDays > 0 && elapsedDays % 7 === 0) due.add('weekly');
  if (previous.date.y !== next.date.y || previous.date.m !== next.date.m) due.add('monthly');
  if (previous.date.y !== next.date.y) due.add('yearly');
  return due;
}
/** Stable topological ordering; original registry order breaks ties between independent due tasks. */
export function orderDueTasks<State>(
  tasks: readonly ScheduledTask<State>[],
  due: ReadonlySet<SimulationCadence>,
): ScheduledTask<State>[] {
  const byId = new Map<string, ScheduledTask<State>>();
  for (const task of tasks) {
    if (!task.id.trim()) throw new Error('Scheduled task ID cannot be empty');
    if (byId.has(task.id)) throw new Error('Duplicate scheduled task ID: ' + task.id);
    byId.set(task.id, task);
  }
  for (const task of tasks) for (const dependency of task.after ?? []) {
    if (!byId.has(dependency)) throw new Error('Unknown dependency ' + dependency + ' for scheduled task ' + task.id);
  }
  const selected = tasks.filter(task => due.has(task.cadence));
  const selectedIds = new Set(selected.map(task => task.id));
  const emitted = new Set<string>(), result: ScheduledTask<State>[] = [];
  while (result.length < selected.length) {
    const ready = selected.find(task => !emitted.has(task.id)
      && (task.after ?? []).every(dependency => !selectedIds.has(dependency) || emitted.has(dependency)));
    if (!ready) throw new Error('Cycle in due simulation task dependencies');
    emitted.add(ready.id);
    result.push(ready);
  }
  return result;
}
