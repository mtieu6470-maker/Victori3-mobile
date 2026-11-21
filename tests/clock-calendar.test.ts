import { describe, expect, it } from 'vitest';
import {
  CAMPAIGN_DAYS, CAMPAIGN_END_EXCLUSIVE_HOUR, CAMPAIGN_FINAL_HOUR, dayIndexOf, daysInMonth, formatDateTime,
  hourOf, hourToDateTime, isClockComplete, isLeapYear, isValidCampaignHour, monthIndexOfHour, monthStartHour,
} from '../src/engine/clock/calendar';
import { CAMPAIGN_END_TICK } from '../src/engine/core';

describe('CLOCK-01 canonical hourly calendar', () => {
  it('spans exactly 69,762 days (1,674,288 hours) from 01/01/1836 to 01/01/2027', () => {
    expect(CAMPAIGN_DAYS).toBe(69_762);
    expect(CAMPAIGN_END_EXCLUSIVE_HOUR).toBe(1_674_288);
    expect(CAMPAIGN_FINAL_HOUR).toBe(1_674_287);
    expect(formatDateTime(hourToDateTime(0))).toBe('1836-01-01T00:00');
    expect(formatDateTime(hourToDateTime(CAMPAIGN_FINAL_HOUR))).toBe('2026-12-31T23:00');
  });

  it('applies Gregorian leap-year rules across 1836–2026', () => {
    expect(isLeapYear(1836)).toBe(true);
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(2026)).toBe(false);
    expect(daysInMonth(1836, 2)).toBe(29);
    expect(daysInMonth(1900, 2)).toBe(28);
    expect(daysInMonth(2000, 2)).toBe(29);
    expect(formatDateTime(hourToDateTime(hourOf(1900, 2, 28, 23) + 1))).toBe('1900-03-01T00:00');
    expect(formatDateTime(hourToDateTime(hourOf(2000, 2, 28, 23) + 1))).toBe('2000-02-29T00:00');
  });

  it('uses the historical weekday (01/01/1836 was a Friday) and ISO numbering', () => {
    expect(hourToDateTime(0).dow).toBe(5);
    expect(hourToDateTime(hourOf(1836, 1, 4)).dow).toBe(1); // Monday 4 January 1836
    expect(hourToDateTime(hourOf(1914, 6, 28)).dow).toBe(7); // Sunday 28 June 1914
    expect(hourToDateTime(hourOf(1969, 7, 20)).dow).toBe(7); // Sunday 20 July 1969
    expect(hourToDateTime(hourOf(2026, 12, 31)).dow).toBe(4); // Thursday 31 December 2026
  });

  it('round-trips every month start with the legacy monthly tick index', () => {
    for (let tick = 0; tick <= CAMPAIGN_END_TICK; tick++) {
      const hour = monthStartHour(tick);
      expect(monthIndexOfHour(hour)).toBe(tick);
      const dt = hourToDateTime(hour);
      expect(dt.d).toBe(1);
      expect(dt.h).toBe(0);
      if (tick > 0) expect(monthIndexOfHour(hour - 1)).toBe(tick - 1);
    }
    expect(monthStartHour(CAMPAIGN_END_TICK + 1)).toBe(CAMPAIGN_END_EXCLUSIVE_HOUR);
  });

  it('round-trips hour → date-time → hour across the campaign at a fixed stride', () => {
    for (let hour = 0; hour <= CAMPAIGN_FINAL_HOUR; hour += 9973) {
      const dt = hourToDateTime(hour);
      expect(hourOf(dt.y, dt.m, dt.d, dt.h)).toBe(hour);
    }
    expect(dayIndexOf(1836, 1, 1)).toBe(0);
  });

  it('fails closed on invalid or out-of-campaign hours', () => {
    for (const bad of [-1, CAMPAIGN_END_EXCLUSIVE_HOUR, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(isValidCampaignHour(bad)).toBe(false);
      expect(() => hourToDateTime(bad)).toThrow(RangeError);
    }
    expect(isValidCampaignHour('12' as unknown)).toBe(false);
    expect(() => monthStartHour(-1)).toThrow(RangeError);
    expect(isClockComplete(CAMPAIGN_FINAL_HOUR - 1)).toBe(false);
    expect(isClockComplete(CAMPAIGN_FINAL_HOUR)).toBe(true);
    expect(isClockComplete(Number.NaN)).toBe(false);
  });

  it('CG11-05: rejects impossible dates instead of normalising them', () => {
    expect(() => daysInMonth(2024, 13)).toThrow(RangeError);
    expect(() => daysInMonth(2024, 0)).toThrow(RangeError);
    expect(() => hourOf(2024, 2, 30, 0)).toThrow(RangeError);
    expect(() => hourOf(1900, 2, 29, 0)).toThrow(RangeError);
    expect(() => hourOf(2024, 1, 1, 24)).toThrow(RangeError);
    expect(() => hourOf(2024, 1, 1, -1)).toThrow(RangeError);
    expect(() => hourOf(2024, 1, 1.5, 0)).toThrow(RangeError);
    expect(() => dayIndexOf(2024, 4, 31)).toThrow(RangeError);
    expect(formatDateTime(hourToDateTime(hourOf(1836, 2, 29, 12)))).toBe('1836-02-29T12:00');
    expect(formatDateTime(hourToDateTime(hourOf(2000, 2, 29, 0)))).toBe('2000-02-29T00:00');
  });
});
