import { describe, expect, it } from 'vitest';
import { fresh } from './helpers';
import { relKey } from '../src/engine/core';
import { serialize, deserialize } from '../src/engine/save';
import {
  allied,
  alliancePartnerCount,
  breakAlliance,
  formAlliance,
  guarantee,
} from '../src/engine/systems/diplomacy';
import { normalizeAllianceTreaties } from '../src/engine/systems/alliance';
import { marketOf } from '../src/engine/systems/economy';
import { availableTechs } from '../src/engine/systems/technology';
import { chooseResearch } from '../src/engine/ai/ai';
import type { Country, GameState } from '../src/engine/types';

function eligibleCountries(state: GameState): Country[] {
  return Object.values(state.countries)
    .filter((country) => country.alive && !country.decentralized && !country.overlord)
    .slice(0, 5);
}

function clearAllianceFixture(state: GameState) {
  state.treaties = state.treaties.filter((treaty) => treaty.type !== 'alliance');
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
    state.treaties = [
      { id: 'guarantee-before', type: 'guarantee', members: [a.id, b.id], start: 0 },
      { id: 'ordered-historical-pact', type: 'alliance', members: [a.id, b.id, c.id], start: 0 },
      { id: 'customs-market-between', type: 'customs_union', members: [a.id, c.id], leader: a.id, start: 0 },
      { id: 'guarantee-after', type: 'guarantee', members: [b.id, c.id], start: 0 },
    ];

    normalizeAllianceTreaties(state);
    expect(state.treaties.map((treaty) => treaty.id)).toEqual([
      'guarantee-before',
      `alliance:${a.id}:${b.id}`,
      `alliance:${a.id}:${c.id}`,
      `alliance:${b.id}:${c.id}`,
      'customs-market-between',
      'guarantee-after',
    ]);

    const afterFirstPass = serialize(state);
    normalizeAllianceTreaties(state);
    expect(serialize(state)).toBe(afterFirstPass);
  });

  it('starts new campaigns with bilateral treaty rows after historical pact normalization', () => {
    const state = fresh('historical', 189, 'GBR');
    const allianceRows = state.treaties.filter((treaty) => treaty.type === 'alliance');
    expect(allianceRows.length).toBeGreaterThan(0);
    expect(allianceRows.every((treaty) => treaty.members.length === 2)).toBe(true);
    expect(allianceRows.some((treaty) => (treaty.source ?? '').includes('cow_ally_3'))).toBe(true);
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

  it('enforces the Alliance / Guarantee Independence exclusion for the same pair', () => {
    const state = fresh('historical', 185, 'GBR');
    clearAllianceFixture(state);
    const [a, b] = eligibleCountries(state);
    preparePair(state, a, b);
    guarantee(state, a.id, b.id);

    expect(formAlliance(state, a.id, b.id)).toBe(false);
    expect(allied(state, a.id, b.id)).toBe(false);
  });
});
