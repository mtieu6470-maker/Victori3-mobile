import { describe, expect, it } from 'vitest';
import { advanceCalendarStep, CAMPAIGN_DAYS, CAMPAIGN_STEPS, createCalendarState, dueCadences, formatCalendarDate, isGregorianLeapYear, isValidCalendarState } from '../src/engine/calendar';

describe('1836–2026 Gregorian six-hour calendar', () => {
  it('uses Gregorian leap-year rules, including century exceptions', () => {
    expect(isGregorianLeapYear(1836)).toBe(true);
    expect(isGregorianLeapYear(1900)).toBe(false);
    expect(isGregorianLeapYear(2000)).toBe(true);
    expect(isGregorianLeapYear(2024)).toBe(true);
    expect(isGregorianLeapYear(2026)).toBe(false);
  });

  it('covers every day from 1836-01-01 through 2026-12-31', () => {
    expect(CAMPAIGN_DAYS).toBe(69_762);
    expect(CAMPAIGN_STEPS).toBe(279_048);
    expect(createCalendarState()).toMatchObject({ year: 1836, month: 1, day: 1, hour: 0, dayIndex: 0, stepIndex: 0, completed: false });
    const terminal = advanceCalendarStep(createCalendarState(2026, 12, 31, 18));
    expect(formatCalendarDate(terminal)).toBe('2027-01-01 00:00');
    expect(terminal).toMatchObject({ dayIndex: CAMPAIGN_DAYS, stepIndex: CAMPAIGN_STEPS, completed: true });
  });

  it('advances in exact six-hour increments and handles leap days', () => {
    expect(advanceCalendarStep(createCalendarState(2024, 2, 28, 18))).toMatchObject({ year: 2024, month: 2, day: 29, hour: 0 });
    expect(advanceCalendarStep(createCalendarState(2025, 2, 28, 18))).toMatchObject({ year: 2025, month: 3, day: 1, hour: 0 });
    expect(advanceCalendarStep(createCalendarState(2026, 12, 31, 18))).toMatchObject({ year: 2027, month: 1, day: 1, hour: 0, completed: true });
  });

  it('rejects invalid dates, hours and post-campaign dates', () => {
    expect(() => createCalendarState(2026, 2, 30, 0)).toThrow(RangeError);
    expect(() => createCalendarState(2026, 1, 1, 3 as 0)).toThrow(RangeError);
    expect(() => createCalendarState(2027, 1, 2, 0)).toThrow(RangeError);
    expect(isValidCalendarState({ year: 2026, month: 1, day: 1, hour: 0, dayIndex: 0, stepIndex: 0, completed: false })).toBe(false);
  });

  it('dispatches six-hour, daily, weekly, monthly, yearly and terminal cadences in stable order', () => {
    const dayStart = createCalendarState(1836, 1, 1, 18);
    expect(dueCadences(dayStart, advanceCalendarStep(dayStart))).toEqual(['six_hour', 'daily']);
    const weekStart = createCalendarState(1836, 1, 7, 18);
    expect(dueCadences(weekStart, advanceCalendarStep(weekStart))).toEqual(['six_hour', 'daily', 'weekly']);
    const monthStart = createCalendarState(1836, 1, 31, 18);
    expect(dueCadences(monthStart, advanceCalendarStep(monthStart))).toEqual(['six_hour', 'daily', 'monthly']);
    const yearStart = createCalendarState(1836, 12, 31, 18);
    expect(dueCadences(yearStart, advanceCalendarStep(yearStart))).toEqual(['six_hour', 'daily', 'monthly', 'yearly']);
    const lastDay = createCalendarState(2026, 12, 31, 18);
    expect(dueCadences(lastDay, advanceCalendarStep(lastDay))).toEqual(['six_hour', 'monthly', 'campaign_end']);
  });
});