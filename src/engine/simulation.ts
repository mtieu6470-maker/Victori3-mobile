// The single simulation pipeline used by BOTH modes. Every system runs every month regardless of mode;
// counters record each run so tests can prove that neither mode skips or weakens a system.
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

export const GAME_END_YEAR = 2027;
export const GAME_END_TICK = (GAME_END_YEAR - 1836) * 12;
export function isGameOver(st: Pick<GameState, 'tick' | 'date'>): boolean {
  return st.tick >= GAME_END_TICK || st.date.y >= GAME_END_YEAR;
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

/** Number of days in a Gregorian calendar month (1-based month). */
export function daysInMonth(year: number, month: number): number {
  if (month === 2) return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
  return month === 4 || month === 6 || month === 9 || month === 11 ? 30 : 31;
}

/** Advance the visible calendar by one day; expensive country systems still run at month boundaries. */
export function stepDay(st: GameState) {
  if (isGameOver(st)) return;
  const maxDay = daysInMonth(st.date.y, st.date.m);
  const current = Math.max(1, Math.min(maxDay, Math.floor(st.dayOfMonth ?? 1)));
  if (current < maxDay) {
    st.dayOfMonth = current + 1;
    return;
  }
  st.dayOfMonth = 1;
  stepMonth(st);
}

export function runDays(st: GameState, days: number) {
  for (let i = 0; i < days; i++) stepDay(st);
}

export function stepMonth(st: GameState) {
  if (isGameOver(st)) return;
  st.tick += 1;
  st.date = tickToDate(st.tick);
  st.dayOfMonth = 1;
  // January 2027 is the campaign end marker, not an additional simulated month.
  if (isGameOver(st)) return;
  for (const s of SYSTEMS) {
    s.run(st);
    st.counters.systemRuns[s.name] = (st.counters.systemRuns[s.name] ?? 0) + 1;
  }
  if (st.date.m === 1) sampleYear(st);
}

export function runMonths(st: GameState, n: number) { for (let i = 0; i < n; i++) stepMonth(st); }
