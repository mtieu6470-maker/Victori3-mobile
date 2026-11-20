import type { GameDate } from './types';

export const CAMPAIGN_START_YEAR = 1836;
export const CAMPAIGN_END_YEAR = 2026;
export const CAMPAIGN_END_BOUNDARY_YEAR = CAMPAIGN_END_YEAR + 1;
export const LOGICAL_HOURS_PER_STEP = 6;
export const STEPS_PER_DAY = 24 / LOGICAL_HOURS_PER_STEP;

export type SimulationHour = 0 | 6 | 12 | 18;
export interface SimulationCalendar {
  year: number; month: number; day: number; hour: SimulationHour;
  stepIndex: number; dayIndex: number; completed: boolean;
}

function daysBeforeYear(year: number): number {
  const y = year - 1;
  return 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400);
}

export function isGregorianLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function daysInGregorianMonth(year: number, month: number): number {
  if (!Number.isInteger(year) || year < 1 || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError(`Invalid Gregorian month: ${year}-${month}`);
  }
  const days = [31, isGregorianLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[month - 1];
}

function ordinalDay(year: number, month: number, day: number): number {
  const limit = daysInGregorianMonth(year, month);
  if (!Number.isInteger(day) || day < 1 || day > limit) throw new RangeError(`Invalid Gregorian day: ${year}-${month}-${day}`);
  let ordinal = daysBeforeYear(year);
  for (let m = 1; m < month; m++) ordinal += daysInGregorianMonth(year, m);
  return ordinal + day - 1;
}

const CAMPAIGN_START_ORDINAL = ordinalDay(CAMPAIGN_START_YEAR, 1, 1);
export const CAMPAIGN_DAYS = daysBeforeYear(CAMPAIGN_END_BOUNDARY_YEAR) - daysBeforeYear(CAMPAIGN_START_YEAR);
export const CAMPAIGN_STEPS = CAMPAIGN_DAYS * STEPS_PER_DAY;

export function createCalendarState(year = CAMPAIGN_START_YEAR, month = 1, day = 1, hour: SimulationHour = 0): SimulationCalendar {
  if (!Number.isInteger(year) || year < CAMPAIGN_START_YEAR || year > CAMPAIGN_END_BOUNDARY_YEAR) throw new RangeError(`Calendar year outside campaign: ${year}`);
  if (![0, 6, 12, 18].includes(hour)) throw new RangeError(`Invalid six-hour boundary: ${hour}`);
  if (year === CAMPAIGN_END_BOUNDARY_YEAR && (month !== 1 || day !== 1 || hour !== 0)) throw new RangeError('Only 2027-01-01 00:00 is valid after the campaign end');
  const dayIndex = ordinalDay(year, month, day) - CAMPAIGN_START_ORDINAL;
  if (dayIndex < 0 || dayIndex > CAMPAIGN_DAYS) throw new RangeError('Calendar date outside campaign');
  const completed = dayIndex === CAMPAIGN_DAYS && hour === 0;
  return { year, month, day, hour, stepIndex: dayIndex * STEPS_PER_DAY + hour / LOGICAL_HOURS_PER_STEP, dayIndex, completed };
}

export function calendarMatchesDate(calendar: SimulationCalendar, date: GameDate): boolean {
  return calendar.year === date.y && calendar.month === date.m;
}

export function isValidCalendarState(value: unknown): value is SimulationCalendar {
  if (!value || typeof value !== 'object') return false;
  const c = value as Partial<SimulationCalendar>;
  try {
    if (!Number.isInteger(c.year) || !Number.isInteger(c.month) || !Number.isInteger(c.day) || !Number.isInteger(c.hour)
      || !Number.isInteger(c.stepIndex) || !Number.isInteger(c.dayIndex) || typeof c.completed !== 'boolean') return false;
    const expected = createCalendarState(c.year!, c.month!, c.day!, c.hour as SimulationHour);
    return expected.stepIndex === c.stepIndex && expected.dayIndex === c.dayIndex && expected.completed === c.completed;
  } catch { return false; }
}

export function advanceCalendarStep(current: SimulationCalendar): SimulationCalendar {
  if (!isValidCalendarState(current)) throw new RangeError('Invalid simulation calendar state');
  if (current.completed) return current;
  let { year, month, day, hour } = current;
  if (hour < 18) hour = (hour + LOGICAL_HOURS_PER_STEP) as SimulationHour;
  else {
    hour = 0; day++;
    if (day > daysInGregorianMonth(year, month)) {
      day = 1; month++;
      if (month > 12) { month = 1; year++; }
    }
  }
  return createCalendarState(year, month, day, hour);
}

export type SimulationCadence = 'six_hour' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'campaign_end';
const CADENCE_ORDER: readonly SimulationCadence[] = ['six_hour', 'daily', 'weekly', 'monthly', 'yearly', 'campaign_end'];

/** Derives due recurring work from integer logical time; terminal boundary never starts 2027 tasks. */
export function dueCadences(previous: SimulationCalendar, current: SimulationCalendar): SimulationCadence[] {
  const due = new Set<SimulationCadence>(['six_hour']);
  if (current.completed) {
    // No daily/weekly/monthly/yearly task starts on 2027-01-01; the last playable
    // day's daily/weekly work was already dispatched at its own 00:00 boundary.
    due.add('campaign_end');
    return CADENCE_ORDER.filter((item) => due.has(item));
  }
  const newDay = current.dayIndex !== previous.dayIndex;
  if (newDay) due.add('daily');
  if (newDay && current.dayIndex > 0 && current.dayIndex % 7 === 0) due.add('weekly');
  if (current.day === 1 && current.hour === 0 && (current.year !== previous.year || current.month !== previous.month)) due.add('monthly');
  if (current.month === 1 && current.day === 1 && current.hour === 0 && current.year !== previous.year) due.add('yearly');
  return CADENCE_ORDER.filter((item) => due.has(item));
}

export function formatCalendarDate(calendar: SimulationCalendar): string {
  return `${calendar.year}-${String(calendar.month).padStart(2, '0')}-${String(calendar.day).padStart(2, '0')} ${String(calendar.hour).padStart(2, '0')}:00`;
}