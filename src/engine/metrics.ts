// Yearly statistics (used by charts, rankings, tests and reports).
import type { GameState } from './types';
import { powerScore } from './systems/diplomacy';
import { regionsOf } from './cache';

export interface PowerRankSnapshot {
  readonly tick: number;
  readonly valid: boolean;
  readonly rankByEntity: Readonly<Record<string, number>>;
  readonly diagnostic: string | null;
}

interface PowerRankingRow {
  id: string;
  name: string;
  power: number;
  gdp: number;
  pop: number;
}

function powerRankingRows(st: GameState): PowerRankingRow[] {
  return Object.values(st.countries)
    .filter((c) => c.alive && !c.decentralized)
    .map((c) => ({
      id: c.id,
      name: c.name,
      power: powerScore(st, c),
      gdp: c.gdp,
      pop: c.stats.pop,
    }));
}

/** Stable ordering for public rankings: power descending, then stable entity ID ascending. */
function comparePowerRows(a: PowerRankingRow, b: PowerRankingRow): number {
  if (a.power > b.power) return -1;
  if (a.power < b.power) return 1;
  if (a.id < b.id) return -1;
  if (a.id > b.id) return 1;
  return 0;
}

function invalidPowerRankSnapshot(tick: number, diagnostic: string): PowerRankSnapshot {
  const empty = Object.freeze(Object.create(null) as Record<string, number>);
  return Object.freeze({ tick, valid: false, rankByEntity: empty, diagnostic });
}

/**
 * Builds the canonical, immutable competition-rank snapshot used by rank predicates.
 * Eligible actors match rankings(): alive, non-decentralized countries; subjects remain eligible.
 * Exact power-score ties share a rank (1, 1, 3), with stable ID ordering for display.
 */
export function createPowerRankSnapshot(st: GameState): PowerRankSnapshot {
  let rows: PowerRankingRow[];
  try {
    rows = powerRankingRows(st);
  } catch {
    return invalidPowerRankSnapshot(st.tick, 'Unable to compute canonical power ranking snapshot');
  }

  const seen = new Set<string>();
  for (const row of rows) {
    if (!row.id || seen.has(row.id)) {
      return invalidPowerRankSnapshot(st.tick, 'Duplicate or empty entity ID in power ranking candidates');
    }
    seen.add(row.id);
    if (!Number.isFinite(row.power)) {
      return invalidPowerRankSnapshot(st.tick, 'Non-finite power score in canonical ranking candidates');
    }
  }

  rows.sort(comparePowerRows);
  const ranks = Object.create(null) as Record<string, number>;
  let currentRank = 0;

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    if (index === 0 || row.power !== rows[index - 1].power) currentRank = index + 1;
    ranks[row.id] = currentRank;
  }

  return Object.freeze({
    tick: st.tick,
    valid: true,
    rankByEntity: Object.freeze(ranks),
    diagnostic: null,
  });
}

export function sampleYear(st: GameState) {
  for (const c of Object.values(st.countries)) {
    if (!c.alive || c.decentralized) continue;
    const regions = regionsOf(st, c.id);
    const arr = (st.history[c.id] ??= []);
    if (arr.length && arr[arr.length - 1].y === st.date.y) continue;
    arr.push({ y: st.date.y, pop: Math.round(c.stats.pop), gdp: Math.round(c.gdp), army: Math.round(c.army.manpower), navy: Math.round(c.navy.strength * 10) / 10, literacy: Math.round(c.stats.literacy * 1000) / 1000, power: Math.round(powerScore(st, c) * 10) / 10, regions: regions.length, legitimacy: Math.round(c.legitimacy) });
  }
}

export function rankings(st: GameState) {
  return powerRankingRows(st)
    .filter((row) => Number.isFinite(row.power))
    .sort(comparePowerRows);
}
