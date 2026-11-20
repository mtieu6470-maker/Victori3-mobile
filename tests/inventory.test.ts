import { describe, it, expect } from 'vitest';
import { fresh, stepMonth } from './helpers';
import { serialize, deserialize } from '../src/engine/save';
import {
  appendInventoryLedgerMonth,
  emptyInventoryLedger,
  inventoryPeriod,
  MAX_INVENTORY_LEDGER_MONTHS,
  settleInventoryFlow,
} from '../src/engine/systems/inventory';

describe('physical inventory accounting invariants', () => {
  it('conserves stock across production, imports, exports and consumption', () => {
    const entry = settleInventoryFlow({
      openingStock: 10,
      production: 6,
      imports: 4,
      exports: 5,
      demand: 12,
    });

    expect(entry.consumed).toBe(12);
    expect(entry.unmetDemand).toBe(0);
    expect(entry.closingStock).toBe(3);
    expect(entry.openingStock + entry.production + entry.imports).toBeCloseTo(
      entry.exports + entry.consumed + entry.closingStock,
      10,
    );
    expect(entry.demand).toBeCloseTo(entry.consumed + entry.unmetDemand, 10);
  });

  it('records shortages explicitly and never allows negative closing stock', () => {
    const entry = settleInventoryFlow({
      openingStock: 2,
      production: 3,
      imports: 1,
      exports: 0,
      demand: 10,
    });

    expect(entry.consumed).toBe(6);
    expect(entry.unmetDemand).toBe(4);
    expect(entry.closingStock).toBe(0);
    expect(entry.closingStock).toBeGreaterThanOrEqual(0);
  });

  it('rejects non-finite, negative or physically impossible flows', () => {
    expect(() => settleInventoryFlow({
      openingStock: -1, production: 0, imports: 0, exports: 0, demand: 0,
    })).toThrow(/finite non-negative/);
    expect(() => settleInventoryFlow({
      openingStock: 0, production: Number.NaN, imports: 0, exports: 0, demand: 0,
    })).toThrow(/finite non-negative/);
    expect(() => settleInventoryFlow({
      openingStock: 1, production: 1, imports: 0, exports: 3, demand: 0,
    })).toThrow(/exceed/);
  });

  it('persists balances immutably and bounds detailed history to the latest 12 months', () => {
    let ledger = emptyInventoryLedger();
    const initialLedger = ledger;

    for (let tick = 1; tick <= 20; tick++) {
      const openingStock = ledger.balances.MKT?.grain ?? 0;
      const flow = settleInventoryFlow({
        openingStock,
        production: 2,
        imports: 1,
        exports: 0.5,
        demand: 1,
      });
      const period = inventoryPeriod(
        tick,
        { y: 1836 + Math.floor((tick - 1) / 12), m: ((tick - 1) % 12) + 1 },
        ledger.openingBasis,
        { MKT: { grain: flow } },
      );
      ledger = appendInventoryLedgerMonth(ledger, period);
    }

    expect(initialLedger.history).toHaveLength(0);
    expect(initialLedger.balances).toEqual({});
    expect(ledger.history).toHaveLength(MAX_INVENTORY_LEDGER_MONTHS);
    expect(ledger.history[0].tick).toBe(9);
    expect(ledger.history[ledger.history.length - 1].tick).toBe(20);
    expect(ledger.balances.MKT?.grain).toBeGreaterThan(0);
    expect(ledger.openingBasis).toBe('simulated');
  });

  it('rejects duplicate or out-of-order journal periods', () => {
    const ledger = emptyInventoryLedger();
    const flow = settleInventoryFlow({
      openingStock: 0, production: 1, imports: 0, exports: 0, demand: 0,
    });
    const first = appendInventoryLedgerMonth(
      ledger,
      inventoryPeriod(1, { y: 1836, m: 2 }, 'unseeded', { MKT: { grain: flow } }),
    );

    expect(() => appendInventoryLedgerMonth(
      first,
      inventoryPeriod(1, { y: 1836, m: 2 }, 'simulated', { MKT: { grain: flow } }),
    )).toThrow(/not newer/);
  });
});

describe('inventory ledger integration with the shared economy', () => {
  it('posts balanced market stock records after a real simulation month', () => {
    const state = fresh('historical', 143, 'GBR');
    expect(state.inventoryLedger.openingBasis).toBe('unseeded');
    expect(state.inventoryLedger.history).toHaveLength(0);

    stepMonth(state);

    expect(state.inventoryLedger.history).toHaveLength(1);
    const period = state.inventoryLedger.history[0];
    expect(period.tick).toBe(state.tick);
    expect(period.date).toEqual(state.date);

    let totalImports = 0;
    let totalExports = 0;
    for (const [marketId, goods] of Object.entries(period.markets)) {
      for (const [good, entry] of Object.entries(goods)) {
        if (!entry) continue;
        const source = entry.openingStock + entry.production + entry.imports;
        const uses = entry.exports + entry.consumed + entry.closingStock;
        expect(entry.closingStock, `${marketId}/${good}`).toBeGreaterThanOrEqual(0);
        expect(source, `${marketId}/${good}`).toBeCloseTo(uses, 7);
        expect(entry.demand, `${marketId}/${good}`).toBeCloseTo(entry.consumed + entry.unmetDemand, 7);
        totalImports += entry.imports;
        totalExports += entry.exports;
      }
    }
    expect(totalImports).toBeGreaterThan(0);
    expect(totalImports).toBeCloseTo(totalExports, 7);
  });

  it('continues inventory deterministically across save/load', () => {
    const uninterrupted = fresh('sandbox', 144, 'GBR');
    for (let month = 0; month < 8; month++) stepMonth(uninterrupted);

    const restored = deserialize(serialize(uninterrupted));
    expect(restored.inventoryLedger).toEqual(uninterrupted.inventoryLedger);

    for (let month = 0; month < 8; month++) {
      stepMonth(uninterrupted);
      stepMonth(restored);
    }
    expect(serialize(restored)).toBe(serialize(uninterrupted));
  });

  it('migrates a legacy save without fabricating historical opening stocks', () => {
    const state = fresh('historical', 145, 'GBR');
    const legacy = JSON.parse(serialize(state));
    delete legacy.state.inventoryLedger;

    const restored = deserialize(JSON.stringify(legacy));
    expect(restored.inventoryLedger).toEqual({
      balances: {},
      history: [],
      openingBasis: 'unseeded',
    });
  });
});
