// CO-3: company slots and player-founded companies (same rules as the AI; the player's country never
// forms companies automatically).
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { stepMonth } from '../src/engine/simulation';
import { execute } from '../src/engine/commands';
import { companiesOf, companySlots, foundableKinds, foundCompanyBlocker, COMPANY_PARAMS, SLOTS_BY_ECONOMY_LAW } from '../src/engine/systems/companies';
import { validateGameStateContract } from '../src/engine/save';

loadNodeData();

describe('CO-3 company slots', () => {
  it('slots come from the economy law and the industrial base, and are capped', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    const gb = st.countries.GBR;
    const slots = companySlots(st, gb);
    expect(slots).toBeGreaterThanOrEqual(SLOTS_BY_ECONOMY_LAW[gb.laws.economy]);
    expect(slots).toBeLessThanOrEqual(COMPANY_PARAMS.maxPerCountry);
    gb.laws.economy = 'traditionalism';
    expect(companySlots(st, gb)).toBe(0);
  });

  it('AI countries never exceed their slots', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    while (st.date.y < 1860) stepMonth(st);
    // Slots only shrink if a country loses industry or changes law; existing companies are not dissolved for it.
    for (const c of Object.values(st.countries)) if (c.alive && companiesOf(st, c.id).length) expect(companiesOf(st, c.id).length, c.id).toBeLessThanOrEqual(companySlots(st, c));
  });
});

describe('CO-3 player-founded companies', () => {
  const st = createGame({ mode: 'historical', seed: 1, player: 'GBR' });
  while (st.date.y < 1840) stepMonth(st);

  it("the player's country forms no company by itself", () => {
    expect(companiesOf(st, 'GBR')).toEqual([]);
  });

  it('the player founds a foundable kind through a command; it owns British sites', () => {
    const kinds = foundableKinds(st, st.countries.GBR);
    expect(kinds.length).toBeGreaterThan(0);
    const r = execute(st, { type: 'found_company', kind: kinds[0].id });
    expect(r.ok).toBe(true);
    const co = companiesOf(st, 'GBR').find((x) => x.kind === kinds[0].id)!;
    expect(co.sites.length).toBeGreaterThan(0);
    for (const key of co.sites) expect(st.regions.find((x) => x.id === key.split('|')[0])!.owner).toBe('GBR');
    expect(() => validateGameStateContract(structuredClone(st))).not.toThrow();
  });

  it('founding the same kind twice, an unknown kind, or beyond the slots is refused', () => {
    const k = companiesOf(st, 'GBR')[0].kind;
    expect(execute(st, { type: 'found_company', kind: k })).toMatchObject({ ok: false, reason: expect.stringMatching(/already exists/) });
    expect(execute(st, { type: 'found_company', kind: 'no_such_kind' })).toMatchObject({ ok: false });
    const s2 = structuredClone(st);
    const gb = s2.countries.GBR;
    while (companiesOf(s2, 'GBR').length < companySlots(s2, gb) && foundableKinds(s2, gb).length) execute(s2, { type: 'found_company', kind: foundableKinds(s2, gb)[0].id });
    const left = foundableKinds(s2, gb);
    if (companiesOf(s2, 'GBR').length >= companySlots(s2, gb) && left.length) {
      expect(foundCompanyBlocker(s2, gb, left[0].id)).toMatch(/slot/);
      expect(execute(s2, { type: 'found_company', kind: left[0].id }).ok).toBe(false);
    }
    expect(companiesOf(s2, 'GBR').length).toBeLessThanOrEqual(companySlots(s2, gb));
  });

  it('a traditionalist economy cannot found companies', () => {
    const s2 = structuredClone(st);
    s2.countries.GBR.laws.economy = 'traditionalism';
    const kind = foundableKinds(st, st.countries.GBR)[0]?.id ?? 'mechanised_textile_mill';
    expect(foundCompanyBlocker(s2, s2.countries.GBR, kind)).toMatch(/law/);
  });
});

import { charterBlocker, grantCharter, monopolyHolder, CHARTER_PARAMS } from '../src/engine/systems/companies';
import { privateInvestment } from '../src/engine/systems/economy';
import { data } from '../src/engine/data/db';

describe('CO-3b monopoly charters', () => {
  const st = createGame({ mode: 'historical', seed: 1, player: 'FRA' });
  while (st.date.y < 1842) stepMonth(st);
  const fr = st.countries.FRA;
  fr.laws.economy = 'interventionism';
  const kind = foundableKinds(st, fr)[0];
  execute(st, { type: 'found_company', kind: kind.id });
  const co = companiesOf(st, 'FRA').find((x) => x.kind === kind.id)!;

  it('needs a permitting law and enough prosperity; grants through a command', () => {
    co.prosperity = CHARTER_PARAMS.minProsperity - 0.01;
    expect(charterBlocker(st, co)).toMatch(/prosperous/);
    co.prosperity = 0.5;
    const s2 = structuredClone(st); s2.countries.FRA.laws.economy = 'laissez_faire';
    expect(charterBlocker(s2, s2.companies[co.id])).toMatch(/law/);
    expect(execute(st, { type: 'grant_charter', company: co.id })).toMatchObject({ ok: true });
    expect(co.charter).toBeTruthy();
    expect(monopolyHolder(st, 'FRA', kind.buildings[0] as any)?.id).toBe(co.id);
    expect(() => validateGameStateContract(structuredClone(st))).not.toThrow();
  });

  it('private investors never start projects in the chartered buildings', () => {
    const s2 = structuredClone(st);
    const before = new Set(s2.constructionProjects.map((p) => p.id));
    for (let i = 0; i < 24; i++) { s2.countries.FRA.privatePool = 1e12; privateInvestment(s2, s2.countries.FRA); s2.tick++; }
    const fresh = s2.constructionProjects.filter((p) => !before.has(p.id) && p.countryId === 'FRA' && !p.company);
    expect(fresh.length).toBeGreaterThan(0); // investors were active, just not in the monopoly's buildings
    for (const p of fresh) expect(kind.buildings).not.toContain(p.building);
  });

  it('switching to laissez-faire revokes the charter', () => {
    const s2 = structuredClone(st);
    s2.countries.FRA.laws.economy = 'laissez_faire';
    s2.tick++; companiesMonthForTest(s2);
    expect(s2.companies[co.id].charter).toBeUndefined();
  });

  it('a charter adds no direct productivity or price bonus (owner: no free buffs)', () => {
    const k = data().db.company_kinds.find((x) => x.id === co.kind)!;
    for (const r of k.rights) expect(r.active).toBe(false);
    expect(grantCharter(st, co)).toBe(false); // already chartered
  });
});
import { companiesMonth as companiesMonthForTest } from '../src/engine/systems/companies';
