// One deterministic scheduler serves Historical and Sandbox modes. Rendering never advances this clock.
import type { GameState } from './types';
import { tickToDate } from './core';
import { computeEconomy } from './systems/economy';
import { populationMonth } from './systems/population';
import { politicsMonth, secessionCheck } from './systems/politics';
import { technologyMonth } from './systems/technology';
import { diplomacyMonth, declareWar } from './systems/diplomacy';
import { militaryMonth } from './systems/military';
import { eventsMonth } from './systems/events';
import { aiMonth, chooseResearch, decideWindow } from './ai/ai';
import { divergenceMonth } from './divergence';
import { sampleYear } from './metrics';
import { createNation } from './world';
import {
  clockTickAt, daysInGregorianMonth, dueCadencesForTransition, orderDueTasks,
  type CalendarPoint, type ScheduledTask, type SimulationCadence,
} from './scheduler';

export const GAME_END_YEAR = 2027;
export const GAME_END_TICK = (GAME_END_YEAR - 1836) * 12;
export const SIX_HOUR_TICKS_PER_DAY = 4;
export const REGULAR_TICK_HOURS = 6;

export function isGameOver(st: Pick<GameState, 'tick' | 'date'>): boolean {
  return st.tick >= GAME_END_TICK || st.date.y >= GAME_END_YEAR;
}

export const SYSTEMS: { name: string; run: (st: GameState) => void }[] = [
  { name: 'economy', run: st => computeEconomy(st) },
  { name: 'population', run: populationMonth },
  { name: 'politics', run: politicsMonth },
  { name: 'secession', run: st => secessionCheck(st, (nation, regs, from) => {
    const id = createNation(st, nation, [], from, 'secession');
    const rebels = st.countries[id];
    rebels.kind = 'rebel';
    rebels.capital = regs[0];
    declareWar(st, id, from, [{ by: id, type: 'independence', target: from, regions: regs }],
      rebels.name + ' independence war', 'independence');
    for (const regionId of regs) st.regions[st.regions.findIndex(r => r.id === regionId)].controller = id;
    return id;
  }) },
  { name: 'technology', run: st => technologyMonth(st, (c, opts) => chooseResearch(st, c, opts)) },
  { name: 'diplomacy', run: diplomacyMonth },
  { name: 'military', run: militaryMonth },
  { name: 'events', run: st => eventsMonth(st, (c, id, opts, w) => decideWindow(st, c, id, opts, w)) },
  { name: 'ai', run: aiMonth },
  { name: 'divergence', run: divergenceMonth },
];

/** Expensive legacy systems remain monthly until their own daily/weekly behavior is separately specified and tested. */
export const SCHEDULED_TASKS: ScheduledTask<GameState>[] = [
  ...SYSTEMS.map((system, index) => ({
    id: system.name + '.monthly',
    cadence: 'monthly' as const,
    after: index > 0 ? [SYSTEMS[index - 1].name + '.monthly'] : [],
    run: (st: GameState) => {
      system.run(st);
      st.counters.systemRuns[system.name] = (st.counters.systemRuns[system.name] ?? 0) + 1;
    },
  })),
  {
    id: 'history.sample.yearly',
    cadence: 'yearly',
    after: ['divergence.monthly'],
    run: sampleYear,
  },
];

const SCHEDULED_CADENCES = new Set<SimulationCadence>(SCHEDULED_TASKS.map(task => task.cadence));

export function daysInMonth(year: number, month: number): number {
  return daysInGregorianMonth(year, month);
}
function calendarPoint(st: GameState): CalendarPoint {
  return { date: st.date, dayOfMonth: st.dayOfMonth ?? 1, hourOfDay: st.hourOfDay ?? 0 };
}
function runTasksAtBoundary(st: GameState, previous: CalendarPoint, next: CalendarPoint): void {
  const due = dueCadencesForTransition(previous, next);
  if (![...due].some(cadence => SCHEDULED_CADENCES.has(cadence))) return;
  for (const task of orderDueTasks(SCHEDULED_TASKS, due)) task.run(st);
}

/** Advance one regular six-hour tick. Monthly/yearly systems run exactly at their declared boundaries. */
export function stepSixHours(st: GameState): void {
  if (isGameOver(st)) return;
  const previous = calendarPoint(st);
  const nextClockTick = clockTickAt(previous) + 1;
  const closesFinalCampaignMonth = previous.date.y === GAME_END_YEAR - 1
    && previous.date.m === 12
    && previous.dayOfMonth === daysInMonth(previous.date.y, previous.date.m)
    && previous.hourOfDay === 18;

  if (closesFinalCampaignMonth) {
    // Run December 2026's monthly and yearly tasks while the state still carries the last valid period.
    // Only after all period-close work is committed do we move the display to the terminal Jan 2027 marker.
    const terminal: CalendarPoint = { date: { y: GAME_END_YEAR, m: 1 }, dayOfMonth: 1, hourOfDay: 0 };
    runTasksAtBoundary(st, previous, terminal);
    st.clockTick = nextClockTick;
    st.dayOfMonth = 1;
    st.hourOfDay = 0;
    st.tick += 1;
    st.date = terminal.date;
    return;
  }

  st.clockTick = nextClockTick;
  if (previous.hourOfDay < 18) {
    st.hourOfDay = previous.hourOfDay + REGULAR_TICK_HOURS;
  } else {
    st.hourOfDay = 0;
    if (previous.dayOfMonth < daysInMonth(previous.date.y, previous.date.m)) {
      st.dayOfMonth = previous.dayOfMonth + 1;
    } else {
      st.dayOfMonth = 1;
      st.tick += 1; // Preserve every existing monthly timer, treaty and historical index.
      st.date = tickToDate(st.tick);
    }
  }

  const next = calendarPoint(st);
  // January 1, 2027 is a terminal marker: no task runs beyond the complete 2026 campaign.
  if (isGameOver(st)) return;
  runTasksAtBoundary(st, previous, next);
}

/** Advance one Gregorian day (four regular six-hour ticks), retaining the current time of day. */
export function stepDay(st: GameState): void {
  for (let i = 0; i < SIX_HOUR_TICKS_PER_DAY && !isGameOver(st); i++) stepSixHours(st);
}
export function runDays(st: GameState, days: number): void {
  for (let i = 0; i < days && !isGameOver(st); i++) stepDay(st);
}

/** Compatibility helper for setup/tests: complete the current month by replaying every six-hour boundary. */
export function stepMonth(st: GameState): void {
  if (isGameOver(st)) return;
  const initialMonthTick = st.tick;
  const maxTicks = (daysInMonth(st.date.y, st.date.m) - (st.dayOfMonth ?? 1) + 1) * SIX_HOUR_TICKS_PER_DAY + 1;
  for (let i = 0; i < maxTicks && st.tick === initialMonthTick && !isGameOver(st); i++) stepSixHours(st);
  if (st.tick === initialMonthTick && !isGameOver(st)) {
    throw new Error('Monthly compatibility step failed to reach the next month boundary');
  }
}
export function runMonths(st: GameState, count: number): void {
  for (let i = 0; i < count && !isGameOver(st); i++) stepMonth(st);
}
