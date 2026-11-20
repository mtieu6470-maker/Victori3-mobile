// Deterministic physical-goods inventory accounting shared by Historical and Sandbox modes.
// Quantities are expressed in the engine's canonical monthly flow units; the economy layer
// performs the annual-to-monthly conversion at this boundary.
import type {
  GameDate,
  Good,
  InventoryLedger,
  InventoryLedgerMonth,
  InventoryMonthEntry,
} from '../types';

export const MAX_INVENTORY_LEDGER_MONTHS = 12;
const EPSILON = 1e-8;

export interface InventoryFlowInput {
  openingStock: number;
  production: number;
  imports: number;
  exports: number;
  demand: number;
}

/** Reject invalid accounting inputs instead of silently clamping or creating goods. */
function assertNonNegativeFinite(value: number, field: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`Inventory ${field} must be a finite non-negative quantity`);
  }
}

/**
 * Settle one market/good for one month.
 *
 * Material conservation:
 *   opening + production + imports = exports + consumed + closing
 * Demand reconciliation:
 *   demand = consumed + unmetDemand
 *
 * Exports that exceed physically available stock are rejected. Unmet demand is explicit;
 * it is never represented by a negative stock balance.
 */
export function settleInventoryFlow(input: InventoryFlowInput): InventoryMonthEntry {
  assertNonNegativeFinite(input.openingStock, 'openingStock');
  assertNonNegativeFinite(input.production, 'production');
  assertNonNegativeFinite(input.imports, 'imports');
  assertNonNegativeFinite(input.exports, 'exports');
  assertNonNegativeFinite(input.demand, 'demand');

  const grossAvailable = input.openingStock + input.production + input.imports;
  const availableAfterExports = grossAvailable - input.exports;
  if (availableAfterExports < -EPSILON) {
    throw new RangeError('Inventory exports exceed opening stock, production and imports');
  }

  const available = Math.max(0, availableAfterExports);
  const consumed = Math.min(input.demand, available);
  const closingStock = Math.max(0, available - consumed);
  const unmetDemand = Math.max(0, input.demand - consumed);

  return {
    openingStock: input.openingStock,
    production: input.production,
    imports: input.imports,
    exports: input.exports,
    demand: input.demand,
    consumed,
    unmetDemand,
    closingStock,
  };
}

function validateEntry(entry: InventoryMonthEntry, marketId: string, good: string): void {
  const fields: (keyof InventoryMonthEntry)[] = [
    'openingStock', 'production', 'imports', 'exports',
    'demand', 'consumed', 'unmetDemand', 'closingStock',
  ];
  for (const field of fields) {
    assertNonNegativeFinite(entry[field], `${marketId}/${good}/${field}`);
  }

  const source = entry.openingStock + entry.production + entry.imports;
  const uses = entry.exports + entry.consumed + entry.closingStock;
  const demand = entry.consumed + entry.unmetDemand;
  const tolerance = EPSILON * Math.max(1, source, entry.demand);
  if (Math.abs(source - uses) > tolerance) {
    throw new Error(`Inventory conservation failed for ${marketId}/${good}`);
  }
  if (Math.abs(entry.demand - demand) > tolerance) {
    throw new Error(`Inventory demand reconciliation failed for ${marketId}/${good}`);
  }
}

/** Append one completed month immutably and retain only a bounded recent journal. */
export function appendInventoryLedgerMonth(
  ledger: InventoryLedger,
  period: InventoryLedgerMonth,
): InventoryLedger {
  if (!Number.isSafeInteger(period.tick) || period.tick < 0) {
    throw new RangeError('Inventory period tick must be a non-negative safe integer');
  }
  const last = ledger.history[ledger.history.length - 1];
  if (last && period.tick <= last.tick) {
    throw new Error(`Inventory period ${period.tick} is not newer than ${last.tick}`);
  }
  if (period.openingBasis !== ledger.openingBasis) {
    throw new Error('Inventory opening-balance provenance changed during settlement');
  }

  const balances: InventoryLedger['balances'] = { ...ledger.balances };
  for (const marketId of Object.keys(period.markets).sort()) {
    const entries = period.markets[marketId];
    const marketBalances = { ...(balances[marketId] ?? {}) };
    for (const good of Object.keys(entries).sort() as Good[]) {
      const entry = entries[good];
      if (!entry) continue;
      validateEntry(entry, marketId, good);
      const carried = ledger.balances[marketId]?.[good] ?? 0;
      const tolerance = EPSILON * Math.max(1, carried, entry.openingStock);
      if (Math.abs(carried - entry.openingStock) > tolerance) {
        throw new Error(`Inventory opening balance mismatch for ${marketId}/${good}`);
      }
      marketBalances[good] = entry.closingStock;
    }
    balances[marketId] = marketBalances;
  }

  const history = [...ledger.history, period].slice(-MAX_INVENTORY_LEDGER_MONTHS);
  return {
    balances,
    history,
    openingBasis: 'simulated',
  };
}

/** Existing saves and 1836 starts have no source-backed opening stock dataset yet. */
export function emptyInventoryLedger(): InventoryLedger {
  return {
    balances: {},
    history: [],
    openingBasis: 'unseeded',
  };
}

/** Copy the calendar date so later GameState mutations cannot rewrite a historical journal row. */
export function inventoryPeriod(
  tick: number,
  date: GameDate,
  openingBasis: InventoryLedger['openingBasis'],
  markets: InventoryLedgerMonth['markets'],
): InventoryLedgerMonth {
  return {
    tick,
    date: { y: date.y, m: date.m },
    openingBasis,
    markets,
  };
}
