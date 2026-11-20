import { describe, expect, it } from 'vitest';
import { fresh } from './helpers';
import { relKey } from '../src/engine/core';
import {
  allied,
  alliancePartnerCount,
  formAlliance,
  guarantee,
} from '../src/engine/systems/diplomacy';
import { marketOf } from '../src/engine/systems/economy';
import { availableTechs } from '../src/engine/systems/technology';
import { chooseResearch } from '../src/engine/ai/ai';
import type { Country, GameState } from '../src/engine/types';

function eligibleCountries(state: GameState): Country[] {
  return Object.values(state.countries)
    .filter((country) => country.alive && !country.decentralized && !country.overlord)
    .slice(0, 5);
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

  it('counts every unique partner inside a historical multi-country pact', () => {
    const state = fresh('historical', 186, 'GBR');
    const [a, b, c, d] = eligibleCountries(state);
    preparePair(state, a, d);
    state.treaties.push({
      id: 'historical-multi-country-alliance',
      type: 'alliance',
      members: [a.id, b.id, c.id],
      start: state.tick,
    });

    // Legacy/history pact rows may contain several members. Each other living
    // member is an ally for war calls and therefore consumes one ally slot.
    expect(alliancePartnerCount(state, a.id)).toBe(2);
    expect(alliancePartnerCount(state, b.id)).toBe(2);
    expect(alliancePartnerCount(state, c.id)).toBe(2);
    expect(formAlliance(state, a.id, d.id)).toBe(false);

    a.techs.push('multilateral_alliances');
    expect(formAlliance(state, a.id, d.id)).toBe(true);
    expect(alliancePartnerCount(state, a.id)).toBe(3);
  });

  it('keeps customs-union membership separate from bilateral military alliances', () => {
    const state = fresh('historical', 184, 'GBR');
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
    country.techs = ['urbanization', 'urban_planning', 'bureaucracy'];

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
    const [a, b] = eligibleCountries(state);
    preparePair(state, a, b);
    guarantee(state, a.id, b.id);

    expect(formAlliance(state, a.id, b.id)).toBe(false);
    expect(allied(state, a.id, b.id)).toBe(false);
  });
});
