// Save / load: the whole GameState (including the RNG state) is plain JSON, so a loaded game continues
// deterministically exactly as the uninterrupted game would.
import type { GameState } from './types';
import { emptyInventoryLedger } from './systems/inventory';
import { normalizeAllianceTreaties } from './systems/alliance';

export const SAVE_FORMAT = 'currents-of-history-save';

export function serialize(st: GameState): string {
  return JSON.stringify({ format: SAVE_FORMAT, version: st.version, savedAt: `${st.date.y}-${String(st.date.m).padStart(2, '0')}`, state: st });
}

export function deserialize(text: string): GameState {
  const o = JSON.parse(text);
  if (o.format !== SAVE_FORMAT) throw new Error('Not a save file of this game');
  if (o.version !== 1) throw new Error(`Unsupported save version ${o.version}`);
  const st = o.state as GameState;
  st.marketStats ??= {}; // saves written before market statistics were persisted: refilled on the next month
  st.inventoryLedger ??= emptyInventoryLedger(); // pre-ledger saves start unseeded; no historical stock is invented
  for (const c of Object.values(st.countries)) c.constructionQueue ??= [];
  // Migrate older saves whose historical alliance sources were stored as multi-member groups.
  normalizeAllianceTreaties(st);
  return st;
}
