import { describe, it, expect } from 'vitest';
import { fresh, stepMonth } from './helpers';
import { serialize, deserialize } from '../src/engine/save';
import { RECIPES, realizeFactoryFlow, solveFactoryMarketFulfillment } from '../src/engine/systems/economy';
import { GOODS, type Good } from '../src/engine/types';
import {
  appendInventoryLedgerMonth,
  emptyInventoryLedger,
  inventoryPeriod,
  MAX_INVENTORY_LEDGER_MONTHS,
  settleInventoryFlow,
} from '../src/engine/systems/inventory';

function goodQuantities(overrides: Partial<Record<Good, number>> = {}): Record<Good, number> {
  return Object.fromEntries(GOODS.map((good) => [good, overrides[good] ?? 0])) as Record<Good, number>;
}

describe('bounded factory/market equilibrium', () => {
  // Build the constrained operation from the same canonical recipe used by the engine.
  const ironworks = RECIPES.ironworks!;
  const plannedSteelOutput = 25;
  const plannedIronworksInputs = {
    iron: plannedSteelOutput * ironworks.inputs.iron!,
    coal: plannedSteelOutput * ironworks.inputs.coal!,
  };
  const market = {
    MKT: {
      supply: goodQuantities({
        coal: 60,
        iron: plannedIronworksInputs.iron,
        steel: plannedSteelOutput,
      }),
      demand: goodQuantities({
        coal: 120,
        iron: plannedIronworksInputs.iron,
      }),
      openness: 0,
    },
  };
  const stocks = { MKT: goodQuantities() };
  const factories = [{
    marketId: 'MKT',
    outputs: { [ironworks.out]: plannedSteelOutput },
    inputs: plannedIronworksInputs,
  }];

  it('converges deterministically when factory demand feeds back into a scarce input market', () => {
    const first = solveFactoryMarketFulfillment(market, stocks, factories);
    const second = solveFactoryMarketFulfillment(market, stocks, factories);

    expect(first.converged).toBe(true);
    expect(first.appliedFallback).toBe('none');
    expect(first.iterations).toBeGreaterThan(1);
    expect(first.iterations).toBeLessThanOrEqual(32);
    expect(first.residual).toBeLessThanOrEqual(1e-5);
    expect(first.fulfillment[0]).toBeGreaterThan(0.5);
    expect(first.fulfillment[0]).toBeLessThan(0.53);
    expect(first.supply.MKT.steel).toBeCloseTo(plannedSteelOutput * first.fulfillment[0], 8);
    expect(first.demand.MKT.coal).toBeCloseTo(110 + 10 * first.fulfillment[0], 8);
    expect(first).toEqual(second);
  });

  it('settles reciprocal grain and tools trade between complementary markets without inventing factory recipes', () => {
    const markets = {
      A: {
        // A has grain to sell but needs tools from its trading partner.
        supply: goodQuantities({ grain: 100 }),
        demand: goodQuantities({ tools: 130 }),
        openness: 1,
      },
      B: {
        // B has tools to sell but needs grain from A.
        supply: goodQuantities({ tools: 100 }),
        demand: goodQuantities({ grain: 130 }),
        openness: 1,
      },
    };

    const result = solveFactoryMarketFulfillment(
      markets,
      { A: goodQuantities(), B: goodQuantities() },
      [],
    );

    expect(result.converged).toBe(true);
    expect(result.appliedFallback).toBe('none');
    expect(result.iterations).toBe(0);
    expect(result.fulfillment).toEqual([]);
    expect(result.supply.A.grain).toBe(100);
    expect(result.demand.B.grain).toBe(130);
    expect(result.supply.B.tools).toBe(100);
    expect(result.demand.A.tools).toBe(130);
    // Trade transfers each market's entire 100-unit surplus; the remaining 30 is unmet demand.
    expect(result.shortages.A.tools).toBeCloseTo(30 / 130, 8);
    expect(result.shortages.B.grain).toBeCloseTo(30 / 130, 8);
    expect(result.shortages.A.grain).toBe(0);
    expect(result.shortages.B.tools).toBe(0);
  });

  it('allows a market stockpile to cover a different market deficit without creating goods', () => {
    const markets = {
      STOCK: {
        supply: goodQuantities(),
        demand: goodQuantities(),
        openness: 1,
      },
      SHORT: {
        supply: goodQuantities(),
        demand: goodQuantities({ grain: 120 }),
        openness: 1,
      },
    };
    const result = solveFactoryMarketFulfillment(
      markets,
      { STOCK: goodQuantities({ grain: 10 }), SHORT: goodQuantities() },
      [],
    );

    expect(result.converged).toBe(true);
    expect(result.shortages.STOCK.grain).toBe(0);
    expect(result.shortages.SHORT.grain).toBe(0);
  });

  it('respects the caller iteration cap and reports non-convergence instead of looping forever', () => {
    const result = solveFactoryMarketFulfillment(market, stocks, factories, 1, 1e-12);

    expect(result.iterations).toBe(1);
    expect(result.converged).toBe(false);
    expect(result.residual).toBeGreaterThan(1e-12);
    expect(result.appliedFallback).toBe('zero-recipe-production');
    expect(result.fulfillment).toEqual([0]);
    expect(result.supply.MKT.steel).toBe(0);
    expect(result.demand.MKT.coal).toBe(110);
  });

  it('rejects invalid limits and a factory assigned to a missing market', () => {
    expect(() => solveFactoryMarketFulfillment(market, stocks, factories, 0)).toThrow(/iteration limit/);
    expect(() => solveFactoryMarketFulfillment(market, stocks, [
      { marketId: 'MISSING', outputs: { steel: 1 }, inputs: { coal: 1 } },
    ])).toThrow(/Unknown factory market/);
  });
});

describe('factory material realization', () => {
  it('scales the canonical ironworks recipe by the same scarcest-input constraint', () => {
    const recipe = RECIPES.ironworks!;
    const plannedOutput = 100;
    const plannedInputs = {
      iron: plannedOutput * recipe.inputs.iron!,
      coal: plannedOutput * recipe.inputs.coal!,
    };
    const realized = realizeFactoryFlow({
      outputs: { [recipe.out]: plannedOutput },
      inputs: plannedInputs,
    }, {
      iron: 0.25,
      coal: 0.5,
    });

    expect(realized.fulfillment).toBeCloseTo(0.5, 10);
    expect(realized.outputs[recipe.out]).toBeCloseTo(50, 10);
    expect(realized.inputs.iron).toBeCloseTo(25, 10);
    expect(realized.inputs.coal).toBeCloseTo(20, 10);
    expect(realized.outputs[recipe.out]! / plannedOutput).toBeCloseTo(realized.fulfillment, 10);
    expect(realized.inputs.iron! / plannedInputs.iron).toBeCloseTo(realized.fulfillment, 10);
  });

  it('keeps the canonical tool-works recipe unchanged when every input is available', () => {
    const recipe = RECIPES.tool_works!;
    const plannedOutput = 75;
    const plannedInputs = {
      steel: plannedOutput * recipe.inputs.steel!,
      timber: plannedOutput * recipe.inputs.timber!,
    };
    const realized = realizeFactoryFlow({
      outputs: { [recipe.out]: plannedOutput },
      inputs: plannedInputs,
    }, {
      steel: 0,
      timber: 0,
    });

    expect(realized.fulfillment).toBe(1);
    expect(realized.outputs[recipe.out]).toBe(plannedOutput);
    expect(realized.inputs).toEqual(plannedInputs);
  });
});

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
    expect(state.marketClearing?.tick).toBe(state.tick);
    expect(state.marketClearing?.factoryCount).toBeGreaterThanOrEqual(0);
    expect(state.marketClearing?.iterations).toBeLessThanOrEqual(
      state.marketClearing?.maxIterations ?? 32,
    );
    expect(Number.isFinite(state.marketClearing?.residual)).toBe(true);
    expect(['none', 'zero-recipe-production']).toContain(
      state.marketClearing?.appliedFallback,
    );
    const period = state.inventoryLedger.history[0];
    expect(period.tick).toBe(state.tick);
    expect(period.date).toEqual(state.date);

    let totalImports = 0;
    let totalExports = 0;
    const expectRelativeClose = (actual: number, expected: number, label: string) => {
      const tolerance = 1e-8 * Math.max(1, Math.abs(actual), Math.abs(expected));
      expect(Math.abs(actual - expected), label).toBeLessThanOrEqual(tolerance);
    };
    for (const [marketId, goods] of Object.entries(period.markets)) {
      for (const [good, entry] of Object.entries(goods)) {
        if (!entry) continue;
        const source = entry.openingStock + entry.production + entry.imports;
        const uses = entry.exports + entry.consumed + entry.closingStock;
        expect(entry.closingStock, `${marketId}/${good}`).toBeGreaterThanOrEqual(0);
        expectRelativeClose(source, uses, `${marketId}/${good} conservation`);
        expectRelativeClose(entry.demand, entry.consumed + entry.unmetDemand, `${marketId}/${good} demand balance`);
        const marketStats = state.marketStats[marketId][good];
        expectRelativeClose(marketStats.supply / 12, entry.production, `${marketId}/${good} supply projection`);
        expectRelativeClose(marketStats.demand / 12, entry.demand, `${marketId}/${good} demand projection`);
        expectRelativeClose(marketStats.imports / 12, entry.imports, `${marketId}/${good} import projection`);
        expect(marketStats.short, `${marketId}/${good} shortage`).toBeCloseTo(
          entry.demand > 0 ? entry.unmetDemand / entry.demand : 0,
          7,
        );
        totalImports += entry.imports;
        totalExports += entry.exports;
      }
    }
    expectRelativeClose(totalImports, totalExports, 'global import/export balance');
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
    delete legacy.state.marketClearing; // simulate a save predating market-solver diagnostics

    const restored = deserialize(JSON.stringify(legacy));
    expect(restored.inventoryLedger).toEqual({
      balances: {},
      history: [],
      openingBasis: 'unseeded',
    });
    expect(restored.marketClearing).toBeUndefined();
  });
});
