// LAW-CAL-01: suffrage movements, women's suffrage after mass mobilisation, and the narrowed anti-oscillation rule.
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { suffrageMovement, setLaw } from '../src/engine/systems/politics';
import { abandonedRecently, reformUtility } from '../src/engine/ai/ai';
import { regionsOf } from '../src/engine/cache';

loadNodeData();

describe('LAW-CAL-01 suffrage movements', () => {
  it('a literate country with mass politics demands the next step of the franchise; an illiterate one does not', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    const c = st.countries.GBR;
    c.laws.power = 'census_suffrage';
    expect(suffrageMovement(st, c, 'power', 'universal_male_suffrage')).toBe(0); // no mass politics yet
    c.techs.push('mass_politics');
    for (const r of regionsOf(st, c.id)) r.literacy = 0.8;
    const m = suffrageMovement(st, c, 'power', 'universal_male_suffrage');
    expect(m).toBeGreaterThan(0.5);
    expect(suffrageMovement(st, c, 'power', 'universal_suffrage')).toBe(0); // only the next step
    const before = reformUtility(st, c, 'power', 'universal_male_suffrage');
    for (const r of regionsOf(st, c.id)) r.literacy = 0.1;
    expect(suffrageMovement(st, c, 'power', 'universal_male_suffrage')).toBe(0);
    expect(reformUtility(st, c, 'power', 'universal_male_suffrage')).toBeLessThan(before);
  });

  it("women's suffrage needs feminism and gains from mass mobilisation in a great war", () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    const c = st.countries.GBR;
    c.laws.power = 'universal_male_suffrage'; c.techs.push('mass_politics', 'feminism');
    for (const r of regionsOf(st, c.id)) r.literacy = 0.7;
    const peace = suffrageMovement(st, c, 'power', 'universal_suffrage');
    c.lastGreatWar = st.tick;
    expect(suffrageMovement(st, c, 'power', 'universal_suffrage')).toBeGreaterThan(peace);
    c.techs = c.techs.filter((t) => t !== 'feminism');
    expect(suffrageMovement(st, c, 'power', 'universal_suffrage')).toBe(0);
  });

  it('the AI may take the next reform step soon after a change, but not return to an abandoned value', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    const c = st.countries.GBR;
    c.laws.power = 'census_suffrage';
    setLaw(st, c, 'power', 'universal_male_suffrage', 'reform');
    expect(abandonedRecently(st, c, 'power', 'universal_suffrage')).toBe(false);
    expect(abandonedRecently(st, c, 'power', 'census_suffrage')).toBe(true);
  });
});
