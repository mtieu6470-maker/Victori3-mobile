// Shared simulation rules for Historical and Sandbox. Calendar dispatch is mode-independent.
import type { GameState } from './types';
import { tickToDate } from './core';
import { advanceCalendarStep, createCalendarState, dueCadences, CAMPAIGN_END_BOUNDARY_YEAR, CAMPAIGN_END_YEAR, CAMPAIGN_START_YEAR } from './calendar';
import { runScheduledTasks, type ScheduledTask } from './scheduler';
import { computeEconomy } from './systems/economy';
import { populationMonth } from './systems/population';
import { politicsMonth, secessionCheck } from './systems/politics';
import { technologyMonth } from './systems/technology';
import { diplomacyMonth, advanceDiplomacyDaily, declareWar } from './systems/diplomacy';
import { militaryMonth } from './systems/military';
import { eventsMonth } from './systems/events';
import { aiMonth, chooseResearch, decideWindow } from './ai/ai';
import { divergenceMonth } from './divergence';
import { sampleYear } from './metrics';
import { createNation } from './world';

export const GAME_START_YEAR = CAMPAIGN_START_YEAR;
export const GAME_END_YEAR = CAMPAIGN_END_YEAR;
export const GAME_END_BOUNDARY_YEAR = CAMPAIGN_END_BOUNDARY_YEAR;
export const GAME_END_TICK = (GAME_END_YEAR - GAME_START_YEAR + 1) * 12;

export function isGameOver(st: Pick<GameState, 'tick' | 'date'> & Partial<Pick<GameState, 'calendar'>>): boolean {
  return st.tick >= GAME_END_TICK || st.date.y >= GAME_END_BOUNDARY_YEAR || st.calendar?.completed === true;
}

export const SYSTEMS: { name: string; run: (st: GameState) => void }[] = [
  { name: 'economy', run: (st) => computeEconomy(st) },
  { name: 'population', run: populationMonth },
  { name: 'politics', run: politicsMonth },
  { name: 'secession', run: (st) => secessionCheck(st, (nation, regs, from) => { const id = createNation(st, nation, [], from, 'secession'); const rebels = st.countries[id]; rebels.kind = 'rebel'; rebels.capital = regs[0]; declareWar(st, id, from, [{ by: id, type: 'independence', target: from, regions: regs }], `${rebels.name} independence war`, 'independence'); for (const r of regs) st.regions[st.regions.findIndex((x) => x.id === r)].controller = id; return id; }) },
  { name: 'technology', run: (st) => technologyMonth(st, (c, opts) => chooseResearch(st, c, opts)) },
  { name: 'diplomacy', run: diplomacyMonth },
  { name: 'military', run: militaryMonth },
  { name: 'events', run: (st) => eventsMonth(st, (c, id, opts, w) => decideWindow(st, c, id, opts, w)) },
  { name: 'ai', run: aiMonth },
  { name: 'divergence', run: divergenceMonth },
];

function runMonthlySystems(st: GameState) {
  for (const system of SYSTEMS) {
    system.run(st);
    st.counters.systemRuns[system.name] = (st.counters.systemRuns[system.name] ?? 0) + 1;
  }
  if (st.date.m === 1) sampleYear(st);
}

function commitMonthlyBoundary(st: GameState, year: number, month: number) {
  if (st.tick >= GAME_END_TICK) return;
  st.tick += 1;
  st.date = { y: year, m: month };
  if (isGameOver(st)) return;
  runMonthlySystems(st);
}

/** Compatibility adapter for tests and setup fast-forward. Normal play calls stepSixHour(). */
export function stepMonth(st: GameState) {
  if (isGameOver(st)) return;
  const nextTick = st.tick + 1;
  const nextDate = tickToDate(nextTick, GAME_START_YEAR);
  st.tick = nextTick;
  st.date = nextDate;
  if (st.calendar) st.calendar = createCalendarState(nextDate.y, nextDate.m, 1, 0);
  if (isGameOver(st)) return;
  runMonthlySystems(st);
}

/** Advances one deterministic six-hour logical step and runs only tasks whose cadence becomes due. */
export function stepSixHour(st: GameState): boolean {
  if (isGameOver(st)) return false;
  if (!st.calendar) throw new Error('Game state is missing its simulation calendar');
  const previous = st.calendar;
  const next = advanceCalendarStep(previous);
  if (next === previous) return false;
  st.calendar = next;
  const due = dueCadences(previous, next);
  runScheduledTasks(st, due, CADENCE_TASKS);
  return true;
}

const CADENCE_TASKS: readonly ScheduledTask[] = [
  { id: 'diplomacy.daily.deadlines', cadence: 'daily', priority: 20, run: advanceDiplomacyDaily },
  {
    id: 'legacy.monthly.systems.v2',
    cadence: 'monthly',
    priority: 100,
    run: (st) => commitMonthlyBoundary(st, st.calendar.year, st.calendar.month),
  },
];

export function runMonths(st: GameState, count: number) {
  for (let i = 0; i < count && !isGameOver(st); i++) stepMonth(st);
}