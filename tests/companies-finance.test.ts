// CO-2: company money (spec CO-01 §8, research CG-33). Retained earnings are carved out of the home
// country's private savings, so the company step creates or destroys no money; company projects are
// paid from company cash; dissolution returns cash to the owners' savings.
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { stepMonth } from '../src/engine/simulation';
import { constructionMonth } from '../src/engine/systems/economy';
import { serialize, deserialize, validateGameStateContract } from '../src/engine/save';
import { companiesMonth, COMPANY_PARAMS } from '../src/engine/systems/companies';
import type { GameState } from '../src/engine/types';

loadNodeData();

const money = (st: GameState) =>
  Object.values(st.countries).reduce((s, c) => s + (c.privatePool ?? 0), 0) + Object.values(st.companies).reduce((s, co) => s + co.cash, 0);

describe('CO-2 company finance', () => {
  const st = createGame({ mode: 'historical', seed: 1, player: null });
  while (st.date.y < 1846) stepMonth(st);

  it('companies exist, earn, retain and pay dividends: retained + dividend = positive profit', () => {
    const cos = Object.values(st.companies);
    expect(cos.length).toBeGreaterThan(5);
    expect(cos.some((co) => co.cash > 0)).toBe(true);
    for (const co of cos) {
      if (co.lastProfit > 0) expect(co.lastDividend + co.lastRetained).toBeCloseTo(co.lastProfit, 6);
      else { expect(co.lastDividend).toBe(0); expect(co.lastRetained).toBe(0); }
      if (co.lastProfit > 0 && co.lastRetained > 0) expect(co.lastRetained / co.lastProfit).toBeLessThanOrEqual(1 - COMPANY_PARAMS.payoutRatio + 1e-9);
    }
  });

  it('the company step conserves money: private savings + company cash are unchanged', () => {
    const s2 = structuredClone(st);
    for (let i = 0; i < 12; i++) {
      s2.tick++;
      const before = money(s2);
      companiesMonth(s2);
      expect(Math.abs(money(s2) - before)).toBeLessThanOrEqual(1e-9 * Math.max(1, before));
    }
  });

  it('a company project is paid from company cash, not from the country pool', () => {
    const s2 = structuredClone(st);
    const co = Object.values(s2.companies).find((x) => x.cash > 0)!;
    s2.constructionProjects = s2.constructionProjects.filter((p) => p.countryId !== co.home);
    const [regionId, building] = co.sites[0].split('|');
    s2.constructionProjects.push({ id: 'test-co-project', countryId: co.home, regionId, building: building as any, funding: 'private', totalCost: co.cash * 6, invested: 0, createdTick: s2.tick, company: co.id });
    const pool = s2.countries[co.home].privatePool; const cash = co.cash; const inv = co.invested;
    constructionMonth(s2);
    const p = s2.constructionProjects.find((x) => x.id === 'test-co-project');
    expect(s2.countries[co.home].privatePool).toBe(pool);
    expect(p).toBeTruthy();
    expect(p!.invested).toBeCloseTo(cash * 6 / 12, 6);
    expect(co.cash).toBeCloseTo(cash - p!.invested, 6);
    expect(co.invested).toBeCloseTo(inv + p!.invested, 6);
  });

  it('a dissolving company returns its cash to the owners and hands its projects to the private pool', () => {
    const s2 = structuredClone(st);
    const co = Object.values(s2.companies).find((x) => x.cash > 0)!;
    s2.constructionProjects.push({ id: 'orphan', countryId: co.home, regionId: co.sites[0].split('|')[0], building: co.sites[0].split('|')[1] as any, funding: 'private', totalCost: 1e6, invested: 0, createdTick: s2.tick, company: co.id });
    co.sites = []; // all its plant is gone (e.g. lost territory): the company dissolves this month
    const before = money(s2);
    s2.tick++; companiesMonth(s2);
    expect(s2.companies[co.id]).toBeUndefined();
    expect(Math.abs(money(s2) - before)).toBeLessThanOrEqual(1e-9 * before);
    expect(s2.constructionProjects.find((p) => p.id === 'orphan')!.company).toBeUndefined();
  });

  it('finance fields survive a save round trip; older companies without them load with zero cash', () => {
    const back = deserialize(serialize(st));
    expect(Object.values(back.companies).map((c) => c.cash)).toEqual(Object.values(st.companies).map((c) => c.cash));
    const legacy = JSON.parse(serialize(st));
    const target = legacy.state ?? legacy;
    for (const co of Object.values<any>(target.companies)) { delete co.cash; delete co.lastProfit; delete co.lastDividend; delete co.lastRetained; delete co.invested; }
    const loaded = deserialize(JSON.stringify(legacy));
    for (const co of Object.values(loaded.companies)) expect(co.cash).toBe(0);
    expect(() => validateGameStateContract(structuredClone(st))).not.toThrow();
    const bad = structuredClone(st); Object.values(bad.companies)[0].cash = -1;
    expect(() => validateGameStateContract(bad)).toThrow(/cash/);
  });
});
