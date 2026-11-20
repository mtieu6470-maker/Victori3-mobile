import { describe, expect, it } from 'vitest';
import { fresh } from './helpers';
import { dateToTick, relKey } from '../src/engine/core';
import { serialize, deserialize } from '../src/engine/save';
import {
  allied,
  alliancePartnerCount,
  breakAlliance,
  formAlliance,
  guarantee,
  defensivePacted,
  defensivePactAcceptance,
  canFormDefensivePact,
  formDefensivePact,
  breakDefensivePact,
  hasNonAggressionPact,
  warSides,
  declareWar,
  diplomacyMonth,
} from '../src/engine/systems/diplomacy';
import { normalizeAllianceTreaties, normalizeHistoricalTreaties, treatyTypeFromSeed } from '../src/engine/systems/alliance';
import { marketOf } from '../src/engine/systems/economy';
import { availableTechs } from '../src/engine/systems/technology';
import { aiMonth, chooseResearch } from '../src/engine/ai/ai';
import type { Country, GameState } from '../src/engine/types';

function eligibleCountries(state: GameState): Country[] {
  return Object.values(state.countries)
    .filter((country) => country.alive && !country.decentralized && !country.overlord)
    .slice(0, 5);
}

function clearAllianceFixture(state: GameState) {
  state.treaties = state.treaties.filter((treaty) =>
    treaty.type === 'customs_union' ||
    (treaty.type !== 'alliance' && treaty.type !== 'defensive_pact' && treaty.type !== 'entente'
      && treaty.type !== 'neutrality_pact' && treaty.type !== 'non_aggression_pact'
      && treaty.type !== 'historical_pact' && treaty.type !== 'guarantee'),
  );
}

function preparePair(state: GameState, a: Country, b: Country) {
  for (const country of [a, b]) {
    country.techs = country.techs.filter(
      (tech) => tech !== 'international_relations' && tech !== 'multilateral_alliances',
    );
    country.techs.push('international_relations');
  }
  state.relations[relKey(a.id, b.id)] = 80;
}

describe('Victoria 3-style bilateral alliance capacity', () => {
  it('requires International Relations before the first alliance can be signed', () => {
    const state = fresh('historical', 181, 'GBR');
    clearAllianceFixture(state);
    const [a, b] = eligibleCountries(state);
    preparePair(state, a, b);
    b.techs = b.techs.filter((tech) => tech !== 'international_relations');

    expect(formAlliance(state, a.id, b.id)).toBe(false);
    expect(allied(state, a.id, b.id)).toBe(false);

    b.techs.push('international_relations');
    expect(formAlliance(state, a.id, b.id)).toBe(true);
    expect(allied(state, a.id, b.id)).toBe(true);
  });

  it('allows one partner without Multilateral Alliances, but blocks a second partner', () => {
    const state = fresh('historical', 182, 'GBR');
    clearAllianceFixture(state);
    const [a, b, c] = eligibleCountries(state);
    preparePair(state, a, b);
    preparePair(state, a, c);

    expect(formAlliance(state, a.id, b.id)).toBe(true);
    expect(alliancePartnerCount(state, a.id)).toBe(1);
    expect(formAlliance(state, a.id, c.id)).toBe(false);
    expect(allied(state, a.id, c.id)).toBe(false);

    a.techs.push('multilateral_alliances');
    expect(formAlliance(state, a.id, c.id)).toBe(true);
    expect(alliancePartnerCount(state, a.id)).toBe(2);
  });

  it('permits three or more independent partners after Multilateral Alliances', () => {
    const state = fresh('historical', 183, 'GBR');
    clearAllianceFixture(state);
    const [a, b, c, d] = eligibleCountries(state);
    for (const partner of [b, c, d]) preparePair(state, a, partner);
    a.techs.push('multilateral_alliances');

    expect(formAlliance(state, a.id, b.id)).toBe(true);
    expect(formAlliance(state, a.id, c.id)).toBe(true);
    expect(formAlliance(state, a.id, d.id)).toBe(true);

    expect(alliancePartnerCount(state, a.id)).toBe(3);
    expect(allied(state, a.id, b.id)).toBe(true);
    expect(allied(state, a.id, c.id)).toBe(true);
    expect(allied(state, a.id, d.id)).toBe(true);
    expect(allied(state, b.id, c.id)).toBe(false);
  });

  it('normalizes historical multi-country pacts into bilateral alliances that can be broken separately', () => {
    const state = fresh('historical', 186, 'GBR');
    clearAllianceFixture(state);
    const [a, b, c, d] = eligibleCountries(state);
    preparePair(state, a, d);
    state.treaties.push({
      id: 'historical-multi-country-alliance',
      type: 'alliance',
      members: [a.id, b.id, c.id],
      start: state.tick,
      source: 'cow_historical_group',
    });

    normalizeAllianceTreaties(state);
    const historicalPairs = state.treaties.filter(
      (treaty) => treaty.type === 'alliance' && treaty.source === 'cow_historical_group',
    );
    expect(historicalPairs).toHaveLength(3);
    expect(historicalPairs.every((treaty) => treaty.members.length === 2)).toBe(true);
    expect(alliancePartnerCount(state, a.id)).toBe(2);
    expect(alliancePartnerCount(state, b.id)).toBe(2);
    expect(alliancePartnerCount(state, c.id)).toBe(2);
    expect(formAlliance(state, a.id, d.id)).toBe(false);

    a.techs.push('multilateral_alliances');
    expect(formAlliance(state, a.id, d.id)).toBe(true);
    expect(alliancePartnerCount(state, a.id)).toBe(3);

    breakAlliance(state, a.id, b.id);
    expect(allied(state, a.id, b.id)).toBe(false);
    expect(allied(state, a.id, c.id)).toBe(true);
    expect(allied(state, a.id, d.id)).toBe(true);
    expect(alliancePartnerCount(state, a.id)).toBe(2);
  });

  it('preserves treaty ordering and is idempotent when migrating grouped alliances', () => {
    const state = fresh('historical', 191, 'GBR');
    const [a, b, c] = eligibleCountries(state);
    const [first, second, third] = [a.id, b.id, c.id].sort();
    state.treaties = [
      { id: 'guarantee-before', type: 'guarantee', members: [a.id, b.id], start: 0 },
      { id: 'ordered-historical-pact', type: 'alliance', members: [a.id, b.id, c.id], start: 0 },
      { id: 'customs-market-between', type: 'customs_union', members: [a.id, c.id], leader: a.id, start: 0 },
      { id: 'guarantee-after', type: 'guarantee', members: [b.id, c.id], start: 0 },
    ];

    normalizeAllianceTreaties(state);
    expect(state.treaties.map((treaty) => treaty.id)).toEqual([
      'guarantee-before',
      `alliance:${first}:${second}`,
      `alliance:${first}:${third}`,
      `alliance:${second}:${third}`,
      'customs-market-between',
      'guarantee-after',
    ]);

    const afterFirstPass = serialize(state);
    normalizeAllianceTreaties(state);
    expect(serialize(state)).toBe(afterFirstPass);
  });

  it('seeds historical Defense Pacts and Ententes as distinct bilateral treaty types', () => {
    const state = fresh('historical', 189, 'GBR');
    const sourceRows = state.treaties.filter((treaty) => treaty.source?.startsWith('cow_ally_'));
    expect(sourceRows.length).toBeGreaterThan(0);
    expect(sourceRows.every((treaty) => treaty.members.length === 2)).toBe(true);
    expect(sourceRows.some((treaty) => treaty.type === 'defensive_pact' && treaty.source === 'cow_ally_3')).toBe(true);
    expect(sourceRows.some((treaty) => treaty.type === 'entente' && treaty.source === 'cow_ally_15')).toBe(true);
    expect(sourceRows.every((treaty) => treaty.type !== 'alliance')).toBe(true);
    expect(sourceRows.find((treaty) => treaty.source === 'cow_ally_1')?.terms?.nonaggression).toBe(true);
  });

  it('preserves overlapping historical source agreements for the same country pair', () => {
    const state = fresh('historical', 190, 'GBR');
    const rows = state.treaties.filter((treaty) =>
      treaty.members.includes('GBR') && treaty.members.includes('POR') && treaty.source?.startsWith('cow_ally_'),
    );
    expect(rows.map((treaty) => treaty.source).sort()).toEqual(['cow_ally_1', 'cow_ally_19']);
    expect(new Set(rows.map((treaty) => treaty.id)).size).toBe(2);
    expect(rows.every((treaty) => treaty.type === 'defensive_pact')).toBe(true);
  });

  it('withdraws from one overlapping Defensive Pact by treaty ID without deleting the other source agreement', () => {
    const state = fresh('historical', 194, 'GBR');
    clearAllianceFixture(state);
    const [a, b] = eligibleCountries(state);
    state.treaties.push(
      {
        id: 'source-defensive-pact-one',
        type: 'defensive_pact',
        members: [a.id, b.id],
        start: 0,
        source: 'cow_ally_1',
        terms: { nonaggression: true },
      },
      {
        id: 'source-defensive-pact-two',
        type: 'defensive_pact',
        members: [a.id, b.id],
        start: 0,
        source: 'cow_ally_19',
      },
    );

    expect(hasNonAggressionPact(state, a.id, b.id)).toBe(true);
    expect(breakDefensivePact(state, a.id, b.id, 'source-defensive-pact-two')).toBe(true);
    expect(state.treaties.map((t) => t.id)).toContain('source-defensive-pact-one');
    expect(state.treaties.map((t) => t.id)).not.toContain('source-defensive-pact-two');
    expect(hasNonAggressionPact(state, a.id, b.id)).toBe(true);

    expect(breakDefensivePact(state, a.id, b.id, 'source-defensive-pact-one')).toBe(true);
    expect(hasNonAggressionPact(state, a.id, b.id)).toBe(false);
  });

  it('does not withdraw from a treaty when the supplied ID belongs to another pair', () => {
    const state = fresh('historical', 195, 'GBR');
    clearAllianceFixture(state);
    const [a, b, c] = eligibleCountries(state);
    state.treaties.push({
      id: 'other-pair-defensive-pact',
      type: 'defensive_pact',
      members: [a.id, c.id],
      start: 0,
    });
    expect(breakDefensivePact(state, a.id, b.id, 'other-pair-defensive-pact')).toBe(false);
    expect(state.treaties.some((t) => t.id === 'other-pair-defensive-pact')).toBe(true);
  });

  it('rehydrates old semicolon-collapsed source IDs without merging independent agreements', () => {
    const state = fresh('historical', 191, 'GBR');
    state.treaties = state.treaties.filter((treaty) =>
      !(treaty.members.includes('GBR') && treaty.members.includes('POR') && treaty.source?.startsWith('cow_ally_')),
    );
    state.treaties.push({
      id: 'alliance:GBR:POR',
      type: 'alliance',
      members: ['GBR', 'POR'],
      start: 0,
      source: 'cow_ally_1;cow_ally_19',
    });
    normalizeHistoricalTreaties(state);
    const rows = state.treaties.filter((treaty) =>
      treaty.members.includes('GBR') && treaty.members.includes('POR') && treaty.source?.startsWith('cow_ally_'),
    );
    expect(rows.map((treaty) => treaty.source).sort()).toEqual(['cow_ally_1', 'cow_ally_19']);
    expect(rows.every((treaty) => treaty.type === 'defensive_pact')).toBe(true);
  });

  it('expires a sourced historical treaty after the recorded end month', () => {
    const state = fresh('historical', 192, 'GBR');
    expect(state.treaties.some((treaty) => treaty.source === 'cow_ally_13')).toBe(true);
    expect(state.treaties.find((treaty) => treaty.source === 'cow_ally_13')?.end).toBe(dateToTick('1848-01-12'));
    state.tick = dateToTick('1848-02-01');
    diplomacyMonth(state);
    expect(state.treaties.some((treaty) => treaty.source === 'cow_ally_13')).toBe(false);
  });

  it('classifies legal treaty type from the CoW source category and preserves overlapping terms', () => {
    expect(treatyTypeFromSeed({ type: 'Type III: Entente', defense: false, entente: true, neutrality: false, nonaggression: false })).toBe('entente');
    expect(treatyTypeFromSeed({ type: 'Type I: Defense Pact', defense: true, entente: true, neutrality: false, nonaggression: true })).toBe('defensive_pact');
    expect(treatyTypeFromSeed({ type: 'Type IIa: Non-Aggression Pact', defense: false, entente: true, neutrality: false, nonaggression: false })).toBe('non_aggression_pact');
    expect(treatyTypeFromSeed({ type: 'Type II: Neutrality', defense: false, entente: false, neutrality: true, nonaggression: false })).toBe('neutrality_pact');
  });

  it('preserves directional Guarantee Independence member order during save migration', () => {
    const state = fresh('sandbox', 193, null);
    state.treaties = [{
      id: 'directional-guarantee',
      type: 'guarantee',
      members: ['FRA', 'BEL'],
      start: state.tick,
    }];
    const before = serialize(state);
    const loaded = deserialize(before);
    expect(loaded.treaties[0].members).toEqual(['FRA', 'BEL']);
    expect(serialize(loaded)).toBe(before);
  });

  it('migrates legacy saves containing grouped alliances without losing partner links', () => {
    const state = fresh('historical', 190, 'GBR');
    clearAllianceFixture(state);
    const [a, b, c] = eligibleCountries(state);
    state.treaties.push({
      id: 'legacy-grouped-alliance',
      type: 'alliance',
      members: [a.id, b.id, c.id],
      start: state.tick,
    });

    const loaded = deserialize(serialize(state));
    const rows = loaded.treaties.filter((treaty) => treaty.type === 'alliance');
    expect(rows).toHaveLength(3);
    expect(rows.every((treaty) => treaty.members.length === 2)).toBe(true);
    expect(allied(loaded, a.id, b.id)).toBe(true);
    expect(allied(loaded, a.id, c.id)).toBe(true);
    expect(allied(loaded, b.id, c.id)).toBe(true);
    expect(alliancePartnerCount(loaded, a.id)).toBe(2);
  });

  it('keeps customs-union membership separate from bilateral military alliances', () => {
    const state = fresh('historical', 184, 'GBR');
    clearAllianceFixture(state);
    const [a, b, c] = eligibleCountries(state);
    preparePair(state, a, b);
    const unionId = 'test-economic-market';
    state.treaties.push({
      id: unionId,
      type: 'customs_union',
      members: [a.id, c.id],
      leader: a.id,
      start: state.tick,
    });
    a.customsUnion = unionId;
    c.customsUnion = unionId;

    expect(formAlliance(state, a.id, b.id)).toBe(true);
    expect(a.customsUnion).toBe(unionId);
    expect(c.customsUnion).toBe(unionId);
    expect(marketOf(state, a)).toBe(unionId);
    expect(allied(state, a.id, b.id)).toBe(true);
    expect(allied(state, a.id, c.id)).toBe(false);
  });

  it('requires the complete Victoria 3-style technology path to unlock additional alliances', () => {
    const state = fresh('historical', 187, 'GBR');
    const [country] = eligibleCountries(state);
    country.techs = [];
    expect(availableTechs(country)).not.toContain('bureaucracy');

    country.techs.push('urbanization');
    expect(availableTechs(country)).toContain('urban_planning');
    expect(availableTechs(country)).toContain('bureaucracy');
    country.techs.push('bureaucracy');

    expect(availableTechs(country)).toContain('international_relations');
    expect(availableTechs(country)).not.toContain('multilateral_alliances');

    country.techs.push(
      'international_relations',
      'rationalism',
      'democracy',
      'mass_communication',
      'nationalism',
      'pan_nationalism',
    );
    expect(availableTechs(country)).toContain('multilateral_alliances');
    expect(state.countries[country.id].techs).not.toContain('multilateral_alliances');
  });

  it('AI research recognizes the alliance-research branch when it has diplomatic partners', () => {
    const state = fresh('historical', 188, 'GBR');
    clearAllianceFixture(state);
    const [country, partner] = eligibleCountries(state);
    country.techs = [];
    partner.techs = [];
    state.treaties.push({
      id: 'existing-alliance-for-research-priority',
      type: 'alliance',
      members: [country.id, partner.id],
      start: state.tick,
    });

    expect(chooseResearch(state, country, ['rationalism', 'steam_engines']))
      .toBe('rationalism');
  });

  it('enforces Alliance / Defensive Pact / Guarantee mutual exclusion for the same pair', () => {
    const state = fresh('historical', 185, 'GBR');
    clearAllianceFixture(state);
    const [a, b] = eligibleCountries(state);
    preparePair(state, a, b);

    expect(formDefensivePact(state, a.id, b.id)).toBe(true);
    expect(defensivePacted(state, a.id, b.id)).toBe(true);
    expect(formAlliance(state, a.id, b.id)).toBe(false);
    expect(guarantee(state, a.id, b.id)).toBe(false);
    expect(allied(state, a.id, b.id)).toBe(false);

    expect(breakDefensivePact(state, a.id, b.id)).toBe(true);
    expect(defensivePacted(state, a.id, b.id)).toBe(false);
    expect(guarantee(state, a.id, b.id)).toBe(true);
    expect(formAlliance(state, a.id, b.id)).toBe(false);
  });

  it('requires International Relations and Cordial relations for Defensive Pacts, without consuming Alliance capacity', () => {
    const state = fresh('historical', 186, 'GBR');
    clearAllianceFixture(state);
    const [a, b] = eligibleCountries(state);
    preparePair(state, a, b);
    state.relations[relKey(a.id, b.id)] = 9;
    expect(canFormDefensivePact(state, a.id, b.id)).toBe(false);
    state.relations[relKey(a.id, b.id)] = 10;
    expect(defensivePactAcceptance(state, a.id, b.id)).toBe(0);
    expect(canFormDefensivePact(state, a.id, b.id)).toBe(true);
    expect(formDefensivePact(state, a.id, b.id)).toBe(true);
    expect(alliancePartnerCount(state, a.id)).toBe(0);
  });

  it('calls Defensive Pact partners to defend and blocks war across non-aggression terms', () => {
    const state = fresh('historical', 187, 'GBR');
    clearAllianceFixture(state);
    const [attacker, defender, partner] = eligibleCountries(state);
    state.treaties.push({
      id: 'test-defensive-pact',
      type: 'defensive_pact',
      members: [defender.id, partner.id],
      start: 0,
    });
    state.relations[relKey(partner.id, defender.id)] = 80;
    state.relations[relKey(partner.id, attacker.id)] = -80;
    const preview = warSides(state, attacker.id, defender.id, []);
    expect(preview.defenders).toContain(partner.id);
    expect(preview.joined).toContainEqual({ id: partner.id, reason: 'defensive_pact' });

    state.treaties.push({
      id: 'test-non-aggression',
      type: 'non_aggression_pact',
      members: [attacker.id, defender.id],
      start: 0,
      terms: { nonaggression: true },
    });
    expect(hasNonAggressionPact(state, attacker.id, defender.id)).toBe(true);
    expect(declareWar(state, attacker.id, defender.id, [])).toBeNull();
  });

  it('AI forms an Alliance when both sides have International Relations and an open slot', () => {
    const state = fresh('sandbox', 188, null);
    const a = state.countries.GBR;
    const b = state.countries.PRU;
    expect(a?.alive && b?.alive).toBe(true);
    state.treaties = state.treaties.filter((treaty) =>
      !(['alliance', 'defensive_pact', 'guarantee'].includes(treaty.type)
        && (treaty.members.includes(a.id) || treaty.members.includes(b.id))),
    );
    state.rivalries = state.rivalries.filter((key) => !key.includes(a.id) && !key.includes(b.id));
    for (const country of Object.values(state.countries)) {
      if (country.id !== a.id && country.id !== b.id) country.alive = false;
    }
    const decoy = Object.values(state.countries).find((country) => country.id !== a.id && country.id !== b.id)!;
    state.rivalries.push(relKey(a.id, decoy.id), relKey(b.id, decoy.id));
    for (const country of [a, b]) {
      country.techs = country.techs.filter((tech) => tech !== 'international_relations' && tech !== 'multilateral_alliances');
      country.techs.push('international_relations');
      country.ai.cooldowns = {};
    }
    state.relations[relKey(a.id, b.id)] = 80;

    let formed = false;
    for (let tick = 0; tick < 3 && !formed; tick++) {
      state.tick = tick;
      aiMonth(state);
      formed = allied(state, a.id, b.id);
    }
    expect(formed).toBe(true);
    expect(state.counters.aiActions.alliance ?? 0).toBeGreaterThan(0);
  });

  it('AI can choose a Defensive Pact when relations are Cordial but below Amicable', () => {
    const state = fresh('sandbox', 189, null);
    const a = state.countries.GBR;
    const b = state.countries.PRU;
    state.treaties = state.treaties.filter((treaty) =>
      !(['alliance', 'defensive_pact', 'guarantee'].includes(treaty.type)
        && (treaty.members.includes(a.id) || treaty.members.includes(b.id))),
    );
    state.rivalries = state.rivalries.filter((key) => !key.includes(a.id) && !key.includes(b.id));
    for (const country of Object.values(state.countries)) {
      if (country.id !== a.id && country.id !== b.id) country.alive = false;
    }
    const decoy = Object.values(state.countries).find((country) => country.id !== a.id && country.id !== b.id)!;
    state.rivalries.push(relKey(a.id, decoy.id), relKey(b.id, decoy.id));
    for (const country of [a, b]) {
      country.techs = country.techs.filter((tech) => tech !== 'international_relations' && tech !== 'multilateral_alliances');
      country.techs.push('international_relations');
      country.ai.cooldowns = {};
    }
    state.relations[relKey(a.id, b.id)] = 20;

    let formed = false;
    for (let tick = 0; tick < 3 && !formed; tick++) {
      state.tick = tick;
      aiMonth(state);
      formed = defensivePacted(state, a.id, b.id);
    }
    expect(formed).toBe(true);
    expect(state.counters.aiActions.defensive_pact ?? 0).toBeGreaterThan(0);
  });
});
