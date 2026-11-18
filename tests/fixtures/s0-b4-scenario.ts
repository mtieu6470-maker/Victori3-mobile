import type { Command } from '../../src/engine/commands';

/**
 * Immutable test scenario for S0-B4.
 * The workflow executes this against baseline 2240a8f; this is not game content.
 */
export const S0_B4_SCENARIO: {
  baselineSha: string;
  seed: number;
  player: string;
  modes: readonly ('historical' | 'sandbox')[];
  totalMonths: number;
  saveCuts: readonly number[];
  commands: readonly { tick: number; command: Command }[];
} = {
  baselineSha: '2240a8fb865e0021eec2f2f4f1c6803528be9e2c',
  seed: 20261116,
  player: 'GBR',
  modes: ['historical', 'sandbox'],
  totalMonths: 24,
  // K=6 is a mid-year checkpoint; K=12 is the annual sampling boundary.
  saveCuts: [6, 12],
  // The same player command sequence is replayed in both continuous and resumed branches.
  commands: [
    { tick: 0, command: { type: 'set_tax', rate: 0.13 } },
    { tick: 0, command: { type: 'set_budget', key: 'education', value: 0.11 } },
    { tick: 6, command: { type: 'set_tax', rate: 0.16 } },
    { tick: 13, command: { type: 'set_budget', key: 'construction', value: 0.14 } },
  ],
};
