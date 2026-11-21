// Canonical hourly campaign calendar (CLOCK-01).
//
// Canonical simulation time is an integer count of in-game hours elapsed since
// 1836-01-01T00:00 (hour 0). Every date/time, cadence boundary and campaign
// limit is derived from that integer with exact integer arithmetic, so there is
// no floating-point drift across the 1,674,288-hour campaign.
//
// The proleptic Gregorian calendar is used for the whole 1836–2026 range
// (1836 and 2000 are leap years; 1900 is not).

export const EPOCH_YEAR = 1836;
export const HOURS_PER_DAY = 24;
/** 1836-01-01 was a Friday. Day-of-week uses ISO numbering: 1 = Monday … 7 = Sunday. */
export const EPOCH_ISO_WEEKDAY = 5;

export interface CampaignDateTime {
  y: number;
  /** 1–12 */
  m: number;
  /** 1–31 */
  d: number;
  /** 0–23 */
  h: number;
  /** ISO weekday, 1 = Monday … 7 = Sunday */
  dow: number;
}

/** Days from 1970-01-01 to y-m-d (Howard Hinnant's days_from_civil). Exact for all integers. */
function daysFromCivil(y: number, m: number, d: number): number {
  const yy = m <= 2 ? y - 1 : y;
  const era = Math.floor(yy / 400);
  const yoe = yy - era * 400;
  const mp = m > 2 ? m - 3 : m + 9;
  const doy = Math.floor((153 * mp + 2) / 5) + d - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe - 719468;
}

function civilFromDays(z: number): { y: number; m: number; d: number } {
  const zz = z + 719468;
  const era = Math.floor(zz / 146097);
  const doe = zz - era * 146097;
  const yoe = Math.floor((doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365);
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
  const mp = Math.floor((5 * doy + 2) / 153);
  const d = doy - Math.floor((153 * mp + 2) / 5) + 1;
  const m = mp < 10 ? mp + 3 : mp - 9;
  return { y: yoe + era * 400 + (m <= 2 ? 1 : 0), m, d };
}

const EPOCH_DAYS = daysFromCivil(EPOCH_YEAR, 1, 1);

export function isLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

export function daysInMonth(y: number, m: number): number {
  return [31, isLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
}

/** Campaign day index (0 = 1836-01-01) of a calendar date. */
export function dayIndexOf(y: number, m: number, d: number): number {
  return daysFromCivil(y, m, d) - EPOCH_DAYS;
}

/** Canonical hour of y-m-d hh:00. */
export function hourOf(y: number, m: number, d = 1, h = 0): number {
  return dayIndexOf(y, m, d) * HOURS_PER_DAY + h;
}

/** First playable hour: 1836-01-01T00:00. */
export const CAMPAIGN_START_HOUR = 0;
/** 2027-01-01T00:00 — this instant (and its January 2027 boundary work) must never execute. */
export const CAMPAIGN_END_EXCLUSIVE_HOUR = hourOf(2027, 1, 1, 0);
/** Final playable hour: 2026-12-31T23:00. */
export const CAMPAIGN_FINAL_HOUR = CAMPAIGN_END_EXCLUSIVE_HOUR - 1;
/** Calendar days in 01/01/1836–31/12/2026 inclusive (owner directive: 69,762). */
export const CAMPAIGN_DAYS = CAMPAIGN_END_EXCLUSIVE_HOUR / HOURS_PER_DAY;

export function isValidCampaignHour(hour: unknown): hour is number {
  return typeof hour === 'number' && Number.isSafeInteger(hour) && hour >= CAMPAIGN_START_HOUR && hour <= CAMPAIGN_FINAL_HOUR;
}

function assertHour(hour: number): void {
  if (!isValidCampaignHour(hour)) throw new RangeError(`Invalid campaign hour ${String(hour)}`);
}

export function hourToDateTime(hour: number): CampaignDateTime {
  assertHour(hour);
  const day = Math.floor(hour / HOURS_PER_DAY);
  const h = hour - day * HOURS_PER_DAY;
  const { y, m, d } = civilFromDays(EPOCH_DAYS + day);
  const dow = ((EPOCH_ISO_WEEKDAY - 1 + day) % 7) + 1;
  return { y, m, d, h, dow };
}

/** Legacy monthly tick index (0 = January 1836) of the month containing `hour`. */
export function monthIndexOfHour(hour: number): number {
  const { y, m } = hourToDateTime(hour);
  return (y - EPOCH_YEAR) * 12 + (m - 1);
}

/** Canonical hour at which month `tick` begins (its monthly boundary instant). */
export function monthStartHour(tick: number): number {
  if (!Number.isSafeInteger(tick) || tick < 0) throw new RangeError(`Invalid month index ${String(tick)}`);
  const y = EPOCH_YEAR + Math.floor(tick / 12);
  const m = (tick % 12) + 1;
  return hourOf(y, m, 1, 0);
}

export function formatDateTime(dt: CampaignDateTime): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${dt.y}-${p(dt.m)}-${p(dt.d)}T${p(dt.h)}:00`;
}

/** True once the final playable hour (2026-12-31T23:00) has been reached. */
export function isClockComplete(hour: number): boolean {
  return Number.isSafeInteger(hour) && hour >= CAMPAIGN_FINAL_HOUR;
}
