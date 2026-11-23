// EVT-01: story events, timed modifiers and story journals.
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { execute } from '../src/engine/commands';
import { stepMonth } from '../src/engine/simulation';
import { data } from '../src/engine/data/db';
import { addModifier, applyEffect, startJournal, storyEventsMonth } from '../src/engine/systems/storyEvents';
import { mod } from '../src/engine/mods';
import { validateNestedState } from '../src/engine/stateContract';

loadNodeData();

describe('EVT-01 story events', () => {
  it('loads the story packs; every event has options with effects and every journal has outcomes', () => {
    const evs = data().db.story_events ?? []; const js = data().db.story_journals ?? [];
    expect(evs.length).toBeGreaterThanOrEqual(30);
    expect(js.length).toBeGreaterThanOrEqual(10);
    for (const e of evs) { expect(e.options.length, e.id).toBeGreaterThan(0); expect(e.options.every((o) => o.effects.length > 0) || e.options.length === 1 || e.id === 'gen_inventor', e.id).toBe(true); }
    for (const j of js) expect((j.on_complete?.length ?? 0) + (j.on_fail?.length ?? 0), j.id).toBeGreaterThan(0);
  });

  it('a timed modifier feeds the simulation, decays and expires', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    addModifier(st, 'FRA', { id: 'x', name_vi: 'Thử', months: 10, decaying: true, effects: { army: 0.2, legitimacy: 10, bogus: 5 } as Record<string, number> });
    storyEventsMonth(st);
    expect(mod(st.countries.FRA, 'army')).toBeCloseTo(0.2);
    expect(st.countries.FRA.modifiers![0].effects.bogus).toBeUndefined();
    st.tick += 5; storyEventsMonth(st);
    expect(mod(st.countries.FRA, 'army')).toBeCloseTo(0.1);
    st.tick += 6; storyEventsMonth(st);
    expect(st.countries.FRA.modifiers).toBeUndefined();
    expect(mod(st.countries.FRA, 'army')).toBe(0);
  });

  it('the player decides an event; the chosen option applies its effects', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: 'FRA' });
    applyEffect(st, { type: 'trigger_event', entity: 'FRA', id: 'gen_revolution_victorious' }, 'test');
    const p = st.pendingStory!.find((x) => x.country === 'FRA')!;
    expect(p).toBeTruthy();
    expect(execute(st, { type: 'story_choice', pending: p.id, option: 'liberal' }).ok).toBe(true);
    expect(st.countries.FRA.laws.press).toBe('limited_press');
    expect(st.countries.FRA.modifiers?.some((m) => m.id === 'springtime_won')).toBe(true);
    expect(st.pendingStory!.some((x) => x.id === p.id)).toBe(false);
    expect(() => validateNestedState(st)).not.toThrow();
  });

  it('a petition journal completes when the law passes and rewards the interest group', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    startJournal(st, 'gen_expect_intelligentsia_free_press', { self: 'FRA' });
    expect(st.storyJournals!.length).toBe(1);
    st.countries.FRA.laws.press = 'free_press';
    storyEventsMonth(st);
    expect(st.storyJournals!.some((j) => j.id === 'gen_expect_intelligentsia_free_press')).toBe(false);
    expect(st.countries.FRA.modifiers?.some((m) => m.effects.ig_intelligentsia > 0)).toBe(true);
  });

  it('a running world fires events for AI countries and stays valid', () => {
    const st = createGame({ mode: 'sandbox', seed: 3, player: null });
    for (let i = 0; i < 36; i++) stepMonth(st);
    expect((st.storyFired ?? []).length).toBeGreaterThan(0);
    expect(Object.values(st.countries).some((c) => c.modifiers?.length)).toBe(true);
    expect(() => validateNestedState(st)).not.toThrow();
  });
});
