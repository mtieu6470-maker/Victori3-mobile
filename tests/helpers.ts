import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { stepMonth } from '../src/engine/simulation';
import type { GameMode, GameState } from '../src/engine/types';
import type { Command } from '../src/engine/commands';
import { execute } from '../src/engine/commands';

loadNodeData();

const cache = new Map<string, GameState>();
/** Runs (and memoises within a test file) a campaign. `script` issues player commands at given ticks. */
export function run(mode: GameMode, seed: number, years: number, player: string | null = null, script?: Record<number, Command[]>, key?: string): GameState {
  const k = key ?? `${mode}|${seed}|${years}|${player}|${script ? JSON.stringify(script) : ''}`;
  const hit = cache.get(k); if (hit) return hit;
  const st = createGame({ mode, seed, player });
  for (let i = 0; i < years * 12; i++) {
    for (const cmd of script?.[st.tick] ?? []) execute(st, cmd);
    stepMonth(st);
  }
  cache.set(k, st);
  return st;
}

export function fresh(mode: GameMode, seed = 1, player: string | null = null) { return createGame({ mode, seed, player }); }
export { stepMonth };
