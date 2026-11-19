import { describe, expect, it } from 'vitest';
import { fresh } from './helpers';
import { constructionBudgetShare, investmentDemandPriority } from '../src/engine/ai/ai';

describe('AI construction budget discipline', () => {
  it('reduces construction allocation as debt burden and fiscal stress rise', () => {
    const st = fresh('sandbox', 118, 'FRA');
    const country = st.countries.GBR;
    country.income = 1_000;
    country.expense = 700;
    country.debt = 0;
    country.famine = 0;

    const healthy = constructionBudgetShare(country, false, 0);
    country.debt = 24_000; // two years of current monthly revenue
    const indebted = constructionBudgetShare(country, false, 0);
    country.famine = 0.8;
    const crisis = constructionBudgetShare(country, false, 0);

    expect(healthy).toBeGreaterThan(indebted);
    expect(indebted).toBeGreaterThan(crisis);
  });

  it('protects fiscal capacity during war without allowing construction share to collapse', () => {
    const st = fresh('sandbox', 119, 'FRA');
    const country = st.countries.GBR;
    country.income = 1_000;
    country.expense = 700;
    country.debt = 0;
    country.famine = 0;

    const peacetime = constructionBudgetShare(country, false, 0.2);
    const wartime = constructionBudgetShare(country, true, 0.2);
    country.expense = 10_000;
    country.debt = 1_000_000;
    country.famine = 1;
    const emergency = constructionBudgetShare(country, true, 0.2);

    expect(wartime).toBeLessThan(peacetime);
    expect(emergency).toBe(0.02);
    expect([peacetime, wartime, emergency].every((value) => Number.isFinite(value) && value >= 0.02 && value <= 0.28)).toBe(true);
  });
});

describe('AI public investment demand priority', () => {
  it('raises state investment priority for goods with unmet market demand', () => {
    const st = fresh('sandbox', 120, 'FRA');
    const country = st.countries.GBR;
    const region = st.regions.find((candidate) => candidate.id === country.capital)!;
    region.res = ['coal'];
    const marketId = country.customsUnion ?? country.id;
    st.marketStats[marketId].coal = { supply: 100, demand: 1_000, imports: 0, short: 0.9 };

    const shortagePriority = investmentDemandPriority(st, country, region, 'mine');
    st.marketStats[marketId].coal = { supply: 1_000, demand: 1_000, imports: 0, short: 0 };

    const balancedPriority = investmentDemandPriority(st, country, region, 'mine');
    expect(shortagePriority).toBeCloseTo(0.9, 5);
    expect(balancedPriority).toBe(0);
  });

  it('averages shortages across mixed-resource output instead of overvaluing one scarce good', () => {
    const st = fresh('sandbox', 121, 'FRA');
    const country = st.countries.GBR;
    const region = st.regions.find((candidate) => candidate.id === country.capital)!;
    region.res = ['coal', 'iron'];
    const marketId = country.customsUnion ?? country.id;
    st.marketStats[marketId].coal = { supply: 100, demand: 1_000, imports: 0, short: 0.8 };
    st.marketStats[marketId].iron = { supply: 800, demand: 1_000, imports: 0, short: 0.2 };

    expect(investmentDemandPriority(st, country, region, 'mine')).toBeCloseTo(0.5, 5);
  });
});
