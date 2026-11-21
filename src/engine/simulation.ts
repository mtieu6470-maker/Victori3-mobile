// The single simulation pipeline used by BOTH modes, driven by an hourly-canonical clock (CLOCK-01).
//
// Canonical time is `st.clock.hour` (in-game hours since 1836-01-01T00:00). Each call to
// `advanceHour` moves time forward by exactly one hour and runs, at that instant and in this fixed
// order, every cadence phase whose boundary falls there:
//
//   hourly → daily (00:00) → weekly (Monday 00:00) → monthly (day 1, 00:00) → yearly (1 Jan 00:00)
//   → end-of-boundary finalisation (cohort projection refresh after a monthly boundary).
//
// Subsystem cadence contracts (see docs/spec/ADAPTIVE_HOURLY_CLOCK_SPEC_VI.md):
// - The existing economy/population/politics/secession/technology/diplomacy/military/events/AI/
//   divergence systems are monthly systems. They run once at each monthly boundary in exactly the
//   order they always had, with the same RNG stream, so results at a given canonical time are
//   unchanged by the hourly migration (proved by tests/clock-hourly-equivalence.test.ts).
// - Hourly, daily and weekly phases are registered but currently empty: no subsystem has yet been
//   migrated to a finer cadence. Systems must declare a cadence before being added here.
// - Real-time pacing (12h/s AUTO, 6h/s fallback, fixed presets) lives outside the engine and only
//   decides how many hours to request per real second; it can never change what an hour does.
//
// Every system runs every boundary regardless of mode; counters record each monthly run so tests
// can prove that neither mode skips or weakens a system.
import type { Cadence, GameState } from './types';
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
import { refreshPopulationState } from './systems/populationCohorts';
import { createNation } from './world';
import {
  CAMPAIGN_FINAL_HOUR, hourToDateTime, isValidCampaignHour, monthIndexOfHour, monthStartHour,
} from './clock/calendar';

export interface SimSystem { name: string; run: (st: GameState) => void }

/** Monthly systems, in canonical order. Exported (and mutable) for instrumentation tools/tests. */
export const SYSTEMS: SimSystem[] = [
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

/** Finer-cadence phases. Empty until a subsystem's cadence contract is migrated (CLOCK-03+). */
export const HOURLY_SYSTEMS: SimSystem[] = [];
export const DAILY_SYSTEMS: SimSystem[] = [];
export const WEEKLY_SYSTEMS: SimSystem[] = [];
/** Yearly phase: runs at 1 January 00:00 after that instant's monthly phase. */
export const YEARLY_SYSTEMS: SimSystem[] = [{ name: 'annual-statistics', run: sampleYear }];

export const CADENCE_ORDER: readonly Cadence[] = ['hourly', 'daily', 'weekly', 'monthly', 'yearly'];

/** Fail closed if canonical hour, month tick and date disagree (corrupt save, manual edit, bug). */
export function assertClockConsistent(st: GameState): void {
  if (!Number.isSafeInteger(st.tick) || st.tick < 0) throw new RangeError('Invalid simulation tick');
  const hour = st.clock?.hour;
  if (!isValidCampaignHour(hour)) throw new RangeError(`Invalid canonical clock hour ${String(hour)}`);
  if (monthIndexOfHour(hour) !== st.tick) {
    throw new RangeError(`Clock/tick mismatch: hour ${hour} is in month ${monthIndexOfHour(hour)}, tick is ${st.tick}`);
  }
  const dt = hourToDateTime(hour);
  if (!st.date || st.date.y !== dt.y || st.date.m !== dt.m) throw new RangeError('Clock/date mismatch');
}

/**
 * Positions a state at the monthly boundary instant of month `tick` (canonical hour, tick and date
 * kept coherent). For tests, tools and scenario setup only — it runs no simulation.
 */
export function positionAtMonthStart(st: GameState, tick: number): void {
  const hour = monthStartHour(tick);
  if (hour > CAMPAIGN_FINAL_HOUR) throw new RangeError(`Month ${tick} is outside the campaign`);
  const dt = hourToDateTime(hour);
  st.tick = tick;
  st.date = { y: dt.y, m: dt.m };
  st.clock = { hour };
}

function runPhase(st: GameState, systems: SimSystem[], countRuns: boolean): void {
  for (const s of systems) {
    s.run(st);
    if (countRuns) st.counters.systemRuns[s.name] = (st.counters.systemRuns[s.name] ?? 0) + 1;
  }
}

/**
 * Advances canonical time by exactly one hour and runs every cadence boundary at the new instant.
 * Returns false (and changes nothing) once the final playable hour 2026-12-31T23:00 is reached:
 * the 2027-01-01T00:00 instant and its January 2027 monthly work never execute.
 */
export function advanceHour(st: GameState): boolean {
  assertClockConsistent(st);
  if (st.clock.hour >= CAMPAIGN_FINAL_HOUR) return false;

  const hour = st.clock.hour + 1;
  const dt = hourToDateTime(hour);
  st.clock.hour = hour;

  runPhase(st, HOURLY_SYSTEMS, false);
  if (dt.h !== 0) return true;
  runPhase(st, DAILY_SYSTEMS, false);
  if (dt.dow === 1) runPhase(st, WEEKLY_SYSTEMS, false);
  if (dt.d !== 1) return true;

  // Monthly boundary: identical to the pre-CLOCK-01 monthly step.
  st.tick += 1;
  st.date = { y: dt.y, m: dt.m };
  runPhase(st, SYSTEMS, true);
  if (dt.m === 1) runPhase(st, YEARLY_SYSTEMS, false);
  // Rebuild only after every system (including secession, events and AI) has
  // finished mutating regional POP/strata for this boundary.
  refreshPopulationState(st);
  return true;
}

export type AdvanceStop = 'requested' | 'campaign_end' | 'yield';

export interface AdvanceResult { hours: number; monthlyBoundaries: number; stop: AdvanceStop }

/**
 * Advances up to `maxHours` whole hours. `shouldYield` is consulted after every hour so a caller
 * can bound wall-clock work (it never splits an hour or skips one); remaining hours stay owed to
 * the caller's backlog.
 */
export function advanceHours(st: GameState, maxHours: number, shouldYield?: () => boolean): AdvanceResult {
  const limit = Number.isSafeInteger(maxHours) && maxHours > 0 ? maxHours : 0;
  let hours = 0; let monthlyBoundaries = 0;
  while (hours < limit) {
    const tickBefore = st.tick;
    if (!advanceHour(st)) return { hours, monthlyBoundaries, stop: 'campaign_end' };
    hours += 1;
    if (st.tick !== tickBefore) monthlyBoundaries += 1;
    if (hours < limit && shouldYield?.()) return { hours, monthlyBoundaries, stop: 'yield' };
  }
  return { hours, monthlyBoundaries, stop: st.clock.hour >= CAMPAIGN_FINAL_HOUR ? 'campaign_end' : 'requested' };
}

/**
 * Legacy-compatible monthly step: advances hour by hour up to and including the next monthly
 * boundary. Returns false without mutating state when that boundary would fall outside the
 * campaign (i.e. from December 2026 onwards).
 */
export function stepMonth(st: GameState): boolean {
  assertClockConsistent(st);
  const nextBoundary = monthStartHour(st.tick + 1);
  if (nextBoundary > CAMPAIGN_FINAL_HOUR) return false;
  while (st.clock.hour < nextBoundary) advanceHour(st);
  return true;
}

/** Hours until the next monthly boundary, or until the final hour in December 2026. */
export function hoursToNextMonth(st: GameState): number {
  const next = Math.min(monthStartHour(st.tick + 1), CAMPAIGN_FINAL_HOUR);
  return Math.max(0, next - st.clock.hour);
}

export function runMonths(st: GameState, n: number) { for (let i = 0; i < n; i++) if (!stepMonth(st)) break; }
