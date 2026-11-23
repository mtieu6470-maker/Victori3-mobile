// IND-01 PM-1: production methods (newest unlocked by default; player may fix one; recipes follow).
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { execute } from '../src/engine/commands';
import { recipeFor } from '../src/engine/systems/economy';
import { activeMethod, choosePM, newestMethod } from '../src/engine/systems/productionMethods';
import { validateGameStateContract } from '../src/engine/save';

loadNodeData();

describe('IND-01 PM-1 production methods', () => {
  it('owners use the newest unlocked method; the recipe takes its inputs', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    const gb = st.countries.GBR, ru = st.countries.RUS;
    expect(gb.techs).toContain('coke_smelting');
    expect(activeMethod(gb, 'ironworks')!.id).toBe('coke_iron');
    expect(recipeFor(gb, 'ironworks')!.inputs).toEqual({ iron: 0.21, coal: 0.37 });
    if (!ru.techs.includes('coke_smelting')) expect(activeMethod(ru, 'ironworks')!.id).toBe('charcoal_iron');
    ru.techs.push('coke_smelting', 'bessemer_steel'); choosePM(ru);
    expect(ru.pm!.ironworks).toBe('bessemer');
    expect(newestMethod(ru, 'ironworks')!.id).toBe('bessemer');
  });

  it('a player can fix an unlocked method and return to automatic; locked methods are refused', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: 'GBR' });
    expect(execute(st, { type: 'set_production_method', building: 'ironworks', method: 'charcoal_iron' }).ok).toBe(true);
    choosePM(st.countries.GBR);
    expect(st.countries.GBR.pm!.ironworks).toBe('charcoal_iron');
    expect(execute(st, { type: 'set_production_method', building: 'ironworks', method: 'open_hearth' }).ok).toBe(false);
    expect(execute(st, { type: 'set_production_method', building: 'ironworks', method: null }).ok).toBe(true);
    choosePM(st.countries.GBR);
    expect(st.countries.GBR.pm!.ironworks).toBe('coke_iron');
    expect(() => validateGameStateContract(structuredClone(st))).not.toThrow();
  });
});
