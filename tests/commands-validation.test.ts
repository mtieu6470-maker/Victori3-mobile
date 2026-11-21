// BUG-CMD-01: player commands fail closed on malformed or non-existent input, before any mutation.
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { execute, type Command } from '../src/engine/commands';
import { REFORMABLE_LAWS } from '../src/engine/laws';
import { LAW_OPTIONS } from '../src/ui/i18n/vi';

loadNodeData();
const game = () => createGame({ mode: 'sandbox', seed: 3, player: 'GBR' });

describe('BUG-CMD-01 command validation', () => {
  it('rejects a reform of an unknown law group or value without mutating state (was: ok=true)', () => {
    const st = game();
    const before = JSON.stringify(st);
    for (const cmd of [
      { type: 'start_reform', group: 'nonexistent', value: 'x' },
      { type: 'start_reform', group: 'press', value: 'martian_press' },
      { type: 'start_reform', group: 'press', value: 42 },
    ] as unknown as Command[]) {
      expect(execute(st, cmd)).toEqual({ ok: false, reason: 'Unknown law group or law value' });
    }
    expect(JSON.stringify(st)).toBe(before);
  });

  it('still accepts a valid reform from the engine catalogue', () => {
    const st = game();
    const target = REFORMABLE_LAWS.press.find((v) => v !== st.countries.GBR.laws.press)!;
    expect(execute(st, { type: 'start_reform', group: 'press', value: target })).toEqual({ ok: true });
    expect(st.countries.GBR.reform).toMatchObject({ group: 'press', value: target });
  });

  it('rejects unknown, dead or self targets for diplomatic and war commands', () => {
    const st = game();
    const before = JSON.stringify(st);
    for (const type of ['improve_relations', 'propose_alliance', 'declare_rival', 'guarantee', 'break_alliance'] as const) {
      expect(execute(st, { type, target: 'ZZZ' } as Command).ok).toBe(false);
      expect(execute(st, { type, target: 'GBR' } as Command)).toEqual({ ok: false, reason: 'A country cannot target itself' });
    }
    expect(execute(st, { type: 'declare_war', target: 'ZZZ', goals: [] }).ok).toBe(false);
    const dead = Object.values(st.countries).find((c) => !c.alive);
    if (dead) expect(execute(st, { type: 'guarantee', target: dead.id }).reason).toBe('Target country no longer exists');
    expect(JSON.stringify(st)).toBe(before);
  });

  it('breaking a non-existent alliance fails instead of silently costing relations', () => {
    const st = game();
    const other = Object.values(st.countries).find((c) => c.alive && c.id !== 'GBR' && !st.treaties.some((t) => t.type === 'alliance' && t.members.includes('GBR') && t.members.includes(c.id)))!;
    const rel = JSON.stringify(st.relations);
    expect(execute(st, { type: 'break_alliance', target: other.id })).toEqual({ ok: false, reason: 'No alliance with this country' });
    expect(JSON.stringify(st.relations)).toBe(rel);
  });

  it('rejects non-finite numbers, unknown budget keys and unknown command types', () => {
    const st = game();
    const before = JSON.stringify(st);
    for (const cmd of [
      { type: 'set_tax', rate: Number.NaN },
      { type: 'set_budget', key: 'bribes', value: 0.1 },
      { type: 'set_budget', key: 'admin', value: Number.POSITIVE_INFINITY },
      { type: 'set_army_target', manpower: '9' },
      { type: 'set_navy_target', ships: undefined },
      { type: 'teleport_army' },
      null,
    ] as unknown as Command[]) expect(execute(st, cmd).ok).toBe(false);
    expect(JSON.stringify(st)).toBe(before);
  });

  it('the UI law options come from the engine catalogue (single source of truth)', () => {
    expect(LAW_OPTIONS).toBe(REFORMABLE_LAWS);
  });
});
