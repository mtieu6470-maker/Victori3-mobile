// CO-1 / CO-1b: technology-unlocked company kinds and companies as site owners (spec CO-01 §6-§7, CG-32).
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { stepMonth } from '../src/engine/simulation';
import { data } from '../src/engine/data/db';
import { serialize, deserialize, validateGameStateContract } from '../src/engine/save';
import { companiesMonth, companyLawAllows, COMPANY_PARAMS, siteOwners, unlockedOperationalKinds } from '../src/engine/systems/companies';

loadNodeData();

describe('CO-1b company kinds data', () => {
  it('covers the CG-32 map: every kind is unlocked by a real technology, rights inactive', () => {
    const kinds = data().db.company_kinds;
    expect(kinds.length).toBeGreaterThanOrEqual(90);
    for (const k of kinds) {
      expect(k.unlocked_by.length).toBeGreaterThan(0);
      for (const t of k.unlocked_by) expect(data().tech.has(t), `${k.id} -> ${t}`).toBe(true);
      for (const r of k.rights) expect(r.active).toBe(false); // no legal basis yet (CG-30)
    }
    expect(kinds.filter((k) => k.buildings.length > 0).length).toBeGreaterThanOrEqual(20);
  });

  it('researching a technology only unlocks a kind; it never creates a company by itself', () => {
    const st = createGame({ mode: 'sandbox', seed: 2, player: null });
    const c = st.countries.SPA;
    c.laws.economy = 'traditionalism';
    expect(companyLawAllows(c)).toBe(false);
    for (let i = 0; i < COMPANY_PARAMS.formationPeriod; i++) { st.tick++; companiesMonth(st); }
    expect(Object.values(st.companies).filter((co) => co.home === 'SPA')).toEqual([]);
  });
});

describe('CO-1 companies', () => {
  const st = createGame({ mode: 'historical', seed: 1, player: null });
  for (let i = 0; i < 24; i++) stepMonth(st);

  it('British joint-stock enterprise forms companies that own British sites only', () => {
    const gb = Object.values(st.companies).filter((co) => co.home === 'GBR');
    expect(gb.length).toBeGreaterThan(0);
    for (const co of gb) {
      expect(unlockedOperationalKinds(st.countries.GBR).some((k) => k.id === co.kind)).toBe(true);
      for (const key of co.sites) {
        const [regionId, building] = key.split('|');
        const r = st.regions.find((x) => x.id === regionId)!;
        expect(r.owner).toBe('GBR');
        expect(r.buildings[building as keyof typeof r.buildings]).toBeGreaterThan(0);
      }
    }
  });

  it('no site has two owners; prosperity stays in range; the contract accepts the state', () => {
    const all = Object.values(st.companies).flatMap((co) => co.sites);
    expect(new Set(all).size).toBe(all.length);
    expect(siteOwners(st).size).toBe(all.length);
    for (const co of Object.values(st.companies)) { expect(co.prosperity).toBeGreaterThanOrEqual(-1); expect(co.prosperity).toBeLessThanOrEqual(1); }
    expect(() => validateGameStateContract(structuredClone(st))).not.toThrow();
  });

  it('is deterministic and survives save/load', () => {
    const a = createGame({ mode: 'historical', seed: 9, player: null }); const b = createGame({ mode: 'historical', seed: 9, player: null });
    for (let i = 0; i < 13; i++) { stepMonth(a); stepMonth(b); }
    expect(JSON.stringify(a.companies)).toBe(JSON.stringify(b.companies));
    const loaded = deserialize(serialize(a));
    expect(loaded.companies).toEqual(a.companies);
    stepMonth(a); stepMonth(loaded);
    expect(JSON.stringify(loaded.companies)).toBe(JSON.stringify(a.companies));
  });

  it('a company whose sites disappear is dissolved', () => {
    const s = structuredClone(st);
    const co = Object.values(s.companies)[0];
    for (const key of co.sites) { const [regionId, b] = key.split('|'); const r = s.regions.find((x) => x.id === regionId)!; r.buildings[b as keyof typeof r.buildings] = 0; }
    companiesMonth(s);
    expect(s.companies[co.id]).toBeUndefined();
  });

  it('the contract rejects a site owned twice', () => {
    const s = structuredClone(st);
    const [a, b] = Object.values(s.companies);
    if (a && b) { b.sites.push(a.sites[0]); expect(() => validateGameStateContract(s)).toThrow(/more than one company/); }
  });

  it('older saves without companies load with none', () => {
    const env = JSON.parse(serialize(st));
    delete env.state.companies;
    expect(deserialize(JSON.stringify(env)).companies).toEqual({});
  });
});
