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
import { refreshPopulationState } from './systems/populationCohorts';
import { createNation } from './world';

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

export function stepMonth(st: GameState) {
  st.tick += 1;
  st.date = tickToDate(st.tick);
  for (const s of SYSTEMS) {
    s.run(st);
    st.counters.systemRuns[s.name] = (st.counters.systemRuns[s.name] ?? 0) + 1;
  }
  if (st.date.m === 1) sampleYear(st);
  // Rebuild only after every system (including secession, events and AI) has
  // finished mutating regional POP/strata for this tick.
  refreshPopulationState(st);
}

export function runMonths(st: GameState, n: number) { for (let i = 0; i < n; i++) stepMonth(st); }
