import { describe, expect, it } from 'vitest';
import {
  clockTickAt, dueCadencesForTransition, orderDueTasks,
  type CalendarPoint, type ScheduledTask,
} from '../src/engine/scheduler';

const point = (y: number, m: number, day: number, hour: number): CalendarPoint => ({
  date: { y, m }, dayOfMonth: day, hourOfDay: hour,
});

describe('six-hour calendar arithmetic', () => {
  it('uses four deterministic regular ticks per Gregorian day', () => {
    expect(clockTickAt(point(1836, 1, 1, 0))).toBe(0);
    expect(clockTickAt(point(1836, 1, 1, 6))).toBe(1);
    expect(clockTickAt(point(1836, 1, 1, 12))).toBe(2);
    expect(clockTickAt(point(1836, 1, 1, 18))).toBe(3);
    expect(clockTickAt(point(1836, 1, 2, 0))).toBe(4);
    expect(clockTickAt(point(1836, 2, 1, 0))).toBe(31 * 4);
  });

  it('rejects invalid dates and non-six-hour clock values', () => {
    expect(() => clockTickAt(point(1836, 2, 30, 0))).toThrow();
    expect(() => clockTickAt(point(1836, 1, 1, 3))).toThrow();
    expect(() => clockTickAt(point(1835, 12, 31, 18))).toThrow();
  });
});

describe('cadence boundaries', () => {
  it('runs only the regular cadence between six-hour boundaries', () => {
    expect([...dueCadencesForTransition(point(1836, 1, 1, 0), point(1836, 1, 1, 6))])
      .toEqual(['six_hour']);
  });

  it('runs daily work only at midnight after a full day', () => {
    expect([...dueCadencesForTransition(point(1836, 1, 1, 18), point(1836, 1, 2, 0))])
      .toEqual(['six_hour', 'daily']);
  });

  it('runs weekly work after seven elapsed campaign days', () => {
    expect([...dueCadencesForTransition(point(1836, 1, 7, 18), point(1836, 1, 8, 0))])
      .toEqual(['six_hour', 'daily', 'weekly']);
  });

  it('runs monthly work on a month boundary and yearly work on a year boundary', () => {
    expect([...dueCadencesForTransition(point(1836, 1, 31, 18), point(1836, 2, 1, 0))])
      .toEqual(['six_hour', 'daily', 'monthly']);
    expect([...dueCadencesForTransition(point(1836, 12, 31, 18), point(1837, 1, 1, 0))])
      .toEqual(['six_hour', 'daily', 'monthly', 'yearly']);
  });

  it('rejects skipped or repeated regular ticks', () => {
    expect(() => dueCadencesForTransition(point(1836, 1, 1, 0), point(1836, 1, 1, 12))).toThrow();
    expect(() => dueCadencesForTransition(point(1836, 1, 1, 6), point(1836, 1, 1, 6))).toThrow();
  });
});

describe('deterministic scheduled-task ordering', () => {
  it('honors explicit dependencies while preserving source order for independent tasks', () => {
    const ran: string[] = [];
    const tasks: ScheduledTask<null>[] = [
      { id: 'b', cadence: 'monthly', after: ['a'], run: () => { ran.push('b'); } },
      { id: 'c', cadence: 'monthly', run: () => { ran.push('c'); } },
      { id: 'a', cadence: 'monthly', run: () => { ran.push('a'); } },
    ];
    const ordered = orderDueTasks(tasks, new Set(['monthly']));
    for (const task of ordered) task.run(null);
    expect(ran).toEqual(['c', 'a', 'b']);
  });

  it('uses the latest completed state when a dependency cadence is not due', () => {
    const tasks: ScheduledTask<null>[] = [
      { id: 'monthly', cadence: 'monthly', run: () => undefined },
      { id: 'daily', cadence: 'daily', after: ['monthly'], run: () => undefined },
    ];
    expect(orderDueTasks(tasks, new Set(['daily'])).map(task => task.id)).toEqual(['daily']);
  });

  it('rejects duplicate IDs, missing dependencies and dependency cycles', () => {
    const empty = () => undefined;
    expect(() => orderDueTasks([
      { id: 'same', cadence: 'daily', run: empty },
      { id: 'same', cadence: 'weekly', run: empty },
    ], new Set(['daily', 'weekly']))).toThrow(/Duplicate/);
    expect(() => orderDueTasks([
      { id: 'a', cadence: 'daily', after: ['missing'], run: empty },
    ], new Set(['daily']))).toThrow(/Unknown dependency/);
    expect(() => orderDueTasks([
      { id: 'a', cadence: 'daily', after: ['b'], run: empty },
      { id: 'b', cadence: 'daily', after: ['a'], run: empty },
    ], new Set(['daily']))).toThrow(/Cycle/);
  });
});
