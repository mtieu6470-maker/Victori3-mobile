import { describe, expect, it } from 'vitest';
import { fresh } from './helpers';
import { politicsMonth } from '../src/engine/systems/politics';

describe('parliamentary parties and election cycle', () => {
  it('allocates exactly 100 seats and forms a majority coalition under suffrage laws', () => {
    const st = fresh('sandbox', 91, 'GBR');
    const country = st.countries.GBR;
    country.laws.governance = 'monarchy';
    country.laws.power = 'universal_male_suffrage';
    country.politics!.nextElectionStep = st.calendar.stepIndex;
    politicsMonth(st);

    const state = country.politics!;
    expect(state.electionEligible).toBe(true);
    expect(state.lastElectionStep).toBe(st.calendar.stepIndex);
    expect(state.parties.reduce((sum, party) => sum + party.seats, 0)).toBe(100);
    expect(state.coalition.length).toBeGreaterThan(0);
    expect(state.coalition.reduce((sum, id) => sum + (state.parties.find((p) => p.id === id)?.seats ?? 0), 0)).toBeGreaterThanOrEqual(51);
    expect(state.governingParty).toBe(state.coalition[0]);
    expect(state.turnout).toBeGreaterThanOrEqual(0.2);
    expect(state.turnout).toBeLessThanOrEqual(0.9);
    expect(state.nextElectionStep).toBeGreaterThan(st.calendar.stepIndex);
  });

  it('does not hold parliamentary elections under autocracy', () => {
    const st = fresh('sandbox', 92, 'GBR');
    const country = st.countries.GBR;
    country.laws.power = 'autocracy';
    country.politics!.nextElectionStep = st.calendar.stepIndex;
    politicsMonth(st);
    expect(country.politics!.electionEligible).toBe(false);
    expect(country.politics!.lastElectionStep).toBe(null);
    expect(country.politics!.nextElectionStep).toBe(null);
    expect(country.politics!.governingParty).toBe(null);
  });

  it('uses deterministic seat allocation for the same seed and laws', () => {
    const a = fresh('sandbox', 93, 'GBR');
    const b = fresh('sandbox', 93, 'GBR');
    for (const st of [a, b]) {
      st.countries.GBR.laws.power = 'census_suffrage';
      st.countries.GBR.politics!.nextElectionStep = st.calendar.stepIndex;
      politicsMonth(st);
    }
    expect(a.countries.GBR.politics!.parties).toEqual(b.countries.GBR.politics!.parties);
    expect(a.countries.GBR.politics!.coalition).toEqual(b.countries.GBR.politics!.coalition);
  });
});
