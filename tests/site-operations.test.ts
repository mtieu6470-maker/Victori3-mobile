// IND-02a: profit-responsive building-site operations. Pure decision scenarios adapted from ChatGPT's
// CG-19 acceptance scenarios (thresholds are project design parameters), plus integration with the
// feature switch on. The switch is OFF by default (ECON-CAL-01 calibration prerequisite).
import { afterEach, describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { stepMonth } from '../src/engine/simulation';
import { deserialize, serialize } from '../src/engine/save';
import { decideSite, ECONOMY_FLAGS, newSiteOps, SITE_OPS, type SiteMonth, type SiteOps } from '../src/engine/systems/industry';
import { marketLedgerAudit } from '../src/engine/systems/economy';
import { validatePopulationState } from '../src/engine/systems/populationCohorts';

loadNodeData();

const COST = 100;
const month = (margin: number, extra: Partial<SiteMonth> = {}): SiteMonth => ({ revenue: COST * (1 + margin), cost: COST, sellThrough: 1, shortage: 0, ...extra });
function run(start: SiteOps, months: SiteMonth[]): SiteOps[] { const out: SiteOps[] = []; let s = start; for (const m of months) { s = decideSite(s, m); out.push(s); } return out; }
const valid = (s: SiteOps) => Number.isFinite(s.reserves) && s.reserves >= 0 && (s.util === 0 || (s.util >= SITE_OPS.minUtil && s.util <= 1));

describe('IND-02a pure site decisions (CG-19 scenarios)', () => {
  it('ECON19-03: reserves absorb a short shock without layoffs, then operation is stable', () => {
    const s0 = newSiteOps(COST); // 3 months of reserves
    const path = run(s0, [month(-0.3), month(-0.3), month(0.1), month(0.1), month(0.1), month(0.1)]);
    expect(path.every((s) => s.util === 1)).toBe(true);
    expect(path[1].reserves).toBeLessThan(s0.reserves);
    expect(path.every(valid)).toBe(true);
  });

  it('ECON19-04: sustained losses deplete reserves, then cut utilization stepwise, then idle', () => {
    const s0 = { ...newSiteOps(COST), reserves: 2 * COST };
    const path = run(s0, Array.from({ length: 12 }, () => month(-0.2)));
    const utils = path.map((s) => s.util);
    expect(utils[0]).toBe(1); // first loss month absorbed
    for (let i = 1; i < utils.length; i++) expect(utils[i - 1] - utils[i]).toBeLessThanOrEqual(SITE_OPS.cutStep + 1e-9);
    expect(Math.min(...utils)).toBeLessThan(1);
    expect(utils.at(-1)).toBeLessThan(0.5);
    expect(path.every(valid)).toBe(true);
  });

  it('cannot pay costs from revenue + reserves: shrinks immediately and reserves never go negative', () => {
    const s = decideSite({ ...newSiteOps(COST), reserves: 10 }, month(-0.5));
    expect(s.util).toBe(1 - SITE_OPS.cutStep);
    expect(s.reserves).toBe(0);
  });

  it('ECON19-07: a noisy month does not cause state flipping', () => {
    const pattern = [month(-0.02), month(0.05), month(0.05)];
    const path = run({ ...newSiteOps(COST), reserves: 4 * COST }, Array.from({ length: 4 }, () => pattern).flat());
    let flips = 0; for (let i = 1; i < path.length; i++) if (path[i].util !== path[i - 1].util) flips++;
    expect(flips).toBeLessThanOrEqual(2);
    expect(path.every((s) => s.util === 1)).toBe(true);
  });

  it('ECON19-06: higher input cost that still leaves a profit never cuts output', () => {
    const path = run(newSiteOps(COST), [month(0.10), month(0.02), month(0.02), month(0.02), month(0.10), month(0.10)]);
    expect(path.every((s) => s.util === 1)).toBe(true);
  });

  it('ECON19-02: sustained profitable full sell-through rehires up to capacity, but not into a glut', () => {
    const grow = run({ ...newSiteOps(COST), util: 0.6 }, Array.from({ length: 12 }, () => month(0.2)));
    expect(grow.at(-1)!.util).toBe(1);
    for (let i = 1; i < grow.length; i++) expect(grow[i].util - grow[i - 1].util).toBeLessThanOrEqual(SITE_OPS.growStep + 1e-9);
    const glut = run({ ...newSiteOps(COST), util: 0.6 }, Array.from({ length: 12 }, () => month(0.2, { sellThrough: 0.8 })));
    expect(glut.at(-1)!.util).toBe(0.6);
  });

  it('ECON19-09: an idle site has no costs, waits, and reopens only on a demand signal', () => {
    const idle: SiteOps = { ...newSiteOps(COST), util: 0, reserves: 0 };
    const quiet = run(idle, Array.from({ length: 6 }, () => ({ revenue: 0, cost: 0, sellThrough: 1, shortage: 0 })));
    expect(quiet.every((s) => s.util === 0 && s.cost === 0 && s.revenue === 0 && s.reserves === 0)).toBe(true);
    const signal = run(idle, Array.from({ length: 4 }, () => ({ revenue: 0, cost: 0, sellThrough: 1, shortage: 0.1 })));
    expect(signal.map((s) => s.util)).toEqual([0, 0, SITE_OPS.reopenUtil, SITE_OPS.reopenUtil]);
  });

  it('never mutates its input and tolerates non-finite figures', () => {
    const s0 = newSiteOps(COST); const copy = JSON.stringify(s0);
    const s = decideSite(s0, { revenue: Number.NaN, cost: Number.POSITIVE_INFINITY, sellThrough: Number.NaN, shortage: Number.NaN });
    expect(JSON.stringify(s0)).toBe(copy);
    expect(valid(s)).toBe(true);
  });
});

describe('IND-02a integration (feature switch ON in this test only)', () => {
  afterEach(() => { ECONOMY_FLAGS.siteOperations = false; });

  it('is off by default and then leaves no operating records', () => {
    expect(ECONOMY_FLAGS.siteOperations).toBe(false);
    const st = createGame({ mode: 'historical', seed: 71, player: null });
    stepMonth(st);
    expect(st.industry).toEqual({});
  });

  it('applies utilization, keeps the ledger closed and population consistent, and is deterministic + save-safe', () => {
    ECONOMY_FLAGS.siteOperations = true;
    const a = createGame({ mode: 'historical', seed: 72, player: null });
    const b = createGame({ mode: 'historical', seed: 72, player: null });
    for (let i = 0; i < 8; i++) { stepMonth(a); stepMonth(b); }
    const ops = Object.values(a.industry);
    expect(ops.length).toBeGreaterThan(100);
    expect(ops.some((o) => o.util < 1)).toBe(true); // decisions actually took effect
    const audit = marketLedgerAudit(a);
    expect(audit.negative).toEqual([]);
    expect(audit.worstMarketResidual).toBeLessThan(1e-9);
    expect(() => validatePopulationState(a)).not.toThrow();
    for (const r of a.regions) for (const e of r.employment ?? []) expect(e).toBeGreaterThanOrEqual(0);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));

    const loaded = deserialize(serialize(a));
    expect(loaded.industry).toEqual(a.industry);
    stepMonth(a); stepMonth(loaded);
    expect(JSON.stringify(loaded)).toBe(JSON.stringify(a));
  });

  it('rejects corrupt operating records on load', () => {
    const st = createGame({ mode: 'historical', seed: 73, player: null });
    st.industry = { 'X|mine': { ...newSiteOps(1), util: 1.5 } };
    expect(() => serialize(st)).toThrow('Invalid industry site record');
  });
});
