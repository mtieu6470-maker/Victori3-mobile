// ECON-01a: the monthly market clearing keeps a closed material-flow ledger.
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { stepMonth } from '../src/engine/simulation';
import { marketLedgerAudit } from '../src/engine/systems/economy';
import { GOODS } from '../src/engine/types';

loadNodeData();

describe('ECON-01a material-flow ledger', () => {
  it.each(['historical', 'sandbox'] as const)('%s: every market balances and world imports equal world exports for 6 months', (mode) => {
    const st = createGame({ mode, seed: 61, player: null });
    for (let m = 0; m < 6; m++) {
      stepMonth(st);
      const audit = marketLedgerAudit(st);
      expect(audit.negative).toEqual([]);
      expect(audit.worstMarketResidual).toBeLessThan(1e-9);
      expect(audit.worstWorldGap).toBeLessThan(1e-9);
    }
  });

  it('imports have a real source: surplus markets export, and nothing is imported without a world surplus', () => {
    const st = createGame({ mode: 'historical', seed: 62, player: null });
    stepMonth(st);
    let tradedGoods = 0;
    for (const good of GOODS) {
      const rows = Object.values(st.marketStats).map((m) => m[good]);
      const imports = rows.reduce((s, r) => s + r.imports, 0);
      const exports = rows.reduce((s, r) => s + (r.exports ?? 0), 0);
      const surplusOffered = rows.reduce((s, r) => s + Math.max(0, r.supply - r.demand), 0);
      if (imports > 0) { tradedGoods++; expect(exports).toBeCloseTo(imports, 6); expect(surplusOffered).toBeGreaterThan(0); }
      for (const r of rows) {
        // A market never both imports and exports the same good in one month.
        expect(r.imports > 0 && (r.exports ?? 0) > 0).toBe(false);
        expect(r.used ?? 0).toBeLessThanOrEqual(r.demand + 1e-6);
      }
    }
    expect(tradedGoods).toBeGreaterThan(0);
  });

  it('only reports markets that exist this month (no stale figures from dissolved markets)', () => {
    const st = createGame({ mode: 'historical', seed: 64, player: null });
    stepMonth(st);
    (st.marketStats as Record<string, unknown>).GHOST = st.marketStats[Object.keys(st.marketStats)[0]];
    stepMonth(st);
    expect(st.marketStats.GHOST).toBeUndefined();
  });

  it('is deterministic with the ledger in place', () => {
    const a = createGame({ mode: 'historical', seed: 63, player: null });
    stepMonth(a); stepMonth(a);
    for (const m of Object.values(a.marketStats)) for (const g of Object.values(m)) { delete g.exports; delete g.used; delete g.unsold; }
    const b = createGame({ mode: 'historical', seed: 63, player: null });
    stepMonth(b); stepMonth(b);
    for (const m of Object.values(b.marketStats)) for (const g of Object.values(m)) { delete g.exports; delete g.used; delete g.unsold; }
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(a.rng).toEqual(b.rng);
  });
});
