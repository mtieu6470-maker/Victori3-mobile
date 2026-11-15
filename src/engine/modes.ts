// Mode configuration. BOTH modes run exactly the same systems (see simulation.ts SYSTEMS) with the same rules.
// The only differences are which historical data layers the AI and event system may read.
import type { GameMode } from './types';

export interface ModeConfig {
  mode: GameMode;
  /** Historical Strategic Priorities bias AI utilities (never force actions). */
  historicalPriorities: boolean;
  /** Decision windows offered to the AI/player with extra weight on the historical option. */
  decisionWindows: boolean;
  /** Exogenous shocks (blights, epidemics, droughts, discoveries) on recorded dates; otherwise stochastic analogues. */
  datedExogenousEvents: boolean;
  /** Historical persons die on recorded dates and recorded successors are used while the regime matches. */
  historicalSuccession: boolean;
  /** Zollverein accession windows on historical dates. */
  historicalCustomsAccessions: boolean;
  /** Multiplier applied to a priority's weight when converted to a utility bonus. */
  priorityBiasScale: number;
}

export const MODES: Record<GameMode, ModeConfig> = {
  historical: {
    mode: 'historical', historicalPriorities: true, decisionWindows: true, datedExogenousEvents: true,
    historicalSuccession: true, historicalCustomsAccessions: true, priorityBiasScale: 1.0,
  },
  sandbox: {
    mode: 'sandbox', historicalPriorities: false, decisionWindows: false, datedExogenousEvents: false,
    historicalSuccession: false, historicalCustomsAccessions: false, priorityBiasScale: 0,
  },
};
