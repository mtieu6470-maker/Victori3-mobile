// EVT-02 (CG-64 blocker): one-shot journal milestones, monthly dispatch of exact-date story events, and
// reachability of every story journal's completion threshold.
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { stepMonth } from '../src/engine/simulation';
import { data } from '../src/engine/data/db';
import { isOnceStep, startJournal, storyEventsMonth } from '../src/engine/systems/storyEvents';
import { validateNestedState } from '../src/engine/stateContract';
import type { StoryJournal } from '../src/engine/data/dbTypes';

loadNodeData();

/** Install a throw-away journal definition for one test and remove it afterwards. */
function withJournal(def: StoryJournal, fn: () => void): void {
  const db = data().db; const before = db.story_journals ?? [];
  db.story_journals = [...before, def];
  try { fn(); } finally { db.story_journals = before; }
}
const testJournal = (monthly: NonNullable<StoryJournal['progress']>['monthly']): StoryJournal => ({
  id: 'test_once_journal', country: 'FRA', mode: 'both', title_vi: 'Thử', text_vi: 'Thử',
  progress: { start: 0, max: 100, monthly }, complete: [{ type: 'progress_at_least', value: 100 }], on_complete: [{ type: 'prestige', entity: 'FRA', delta: 1 }],
} as unknown as StoryJournal);

describe('EVT-02 one-shot journal milestones', () => {
  it('an event_fired step awards its points once, not every month', () => {
    withJournal(testJournal([{ if: { type: 'event_fired', id: 'x_milestone' }, add: 30 }]), () => {
      const st = createGame({ mode: 'sandbox', seed: 1, player: null });
      startJournal(st, 'test_once_journal', { self: 'FRA' });
      (st.storyFired ??= []).push('x_milestone|FRA');
      for (let i = 0; i < 6; i++) { storyEventsMonth(st); st.tick++; }
      const j = st.storyJournals!.find((x) => x.id === 'test_once_journal')!;
      expect(j.progress).toBe(30);
      expect(j.awarded).toEqual([JSON.stringify({ type: 'event_fired', id: 'x_milestone' })]);
      expect(() => validateNestedState(st)).not.toThrow();
    });
  });

  it('`once: false` keeps a repeating step; `once: true` makes any condition one-shot', () => {
    withJournal(testJournal([
      { if: { type: 'event_fired', id: 'x_milestone' }, add: 10, once: false },
      { if: { type: 'year_between', from: 1800, to: 2100 }, add: 5, once: true, id: 'era' },
    ]), () => {
      const st = createGame({ mode: 'sandbox', seed: 1, player: null });
      startJournal(st, 'test_once_journal', { self: 'FRA' });
      (st.storyFired ??= []).push('x_milestone|FRA');
      for (let i = 0; i < 3; i++) { storyEventsMonth(st); st.tick++; }
      expect(st.storyJournals!.find((x) => x.id === 'test_once_journal')!.progress).toBe(35);
    });
  });

  it('milestones that fire later still count, and the journal completes when they reach the threshold', () => {
    withJournal(testJournal([{ if: { type: 'event_fired', id: 'm1' }, add: 50 }, { if: { type: 'event_fired', id: 'm2' }, add: 50 }]), () => {
      const st = createGame({ mode: 'sandbox', seed: 1, player: null });
      startJournal(st, 'test_once_journal', { self: 'FRA' });
      const prestige = st.countries.FRA.prestige;
      storyEventsMonth(st); st.tick++;
      st.storyFired!.push('m1|FRA');
      for (let i = 0; i < 4; i++) { storyEventsMonth(st); st.tick++; }
      expect(st.storyJournals!.find((x) => x.id === 'test_once_journal')!.progress).toBe(50);
      st.storyFired!.push('m2|FRA');
      storyEventsMonth(st);
      expect(st.storyJournals!.some((x) => x.id === 'test_once_journal')).toBe(false);
      expect(st.countries.FRA.prestige).toBeGreaterThan(prestige);
    });
  });

  it('a journal saved before EVT-02 (no `awarded`) still loads and runs', () => {
    withJournal(testJournal([{ if: { type: 'event_fired', id: 'x_milestone' }, add: 20 }]), () => {
      const st = createGame({ mode: 'sandbox', seed: 1, player: null });
      st.storyJournals = [{ id: 'test_once_journal', country: 'FRA', started: 0, progress: 40, bindings: { self: 'FRA' } }];
      st.storyFired = ['x_milestone|FRA'];
      const loaded = JSON.parse(JSON.stringify(st));
      expect(() => validateNestedState(loaded)).not.toThrow();
      storyEventsMonth(loaded); loaded.tick++; storyEventsMonth(loaded);
      expect(loaded.storyJournals[0].progress).toBe(60);
    });
  });
});

describe('EVT-02 story data against the monthly scheduler', () => {
  const evs = () => data().db.story_events ?? [];
  const nextTick = (d: string) => { const [y, m, day] = d.split('-').map(Number); const t = y * 12 + (m - 1) + (day > 1 ? 1 : 0); return { y: Math.floor(t / 12), str: `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, '0')}-01` }; };

  it('every exact-date event is still inside its window and year range on the monthly tick that dispatches it', () => {
    const bad: string[] = [];
    for (const e of evs()) {
      const fd = e.trigger?.fire_date; if (!fd) continue;
      const t = nextTick(fd);
      if (e.window && (t.str < e.window[0] || t.str > e.window[1])) bad.push(`${e.id}: ${fd} → ${t.str} outside window ${e.window.join('..')}`);
      for (const c of (e.trigger?.conditions ?? []) as Record<string, unknown>[]) {
        if (c.type === 'year_between' && (t.y < Number(c.from ?? -1e9) || t.y > Number(c.to ?? 1e9))) bad.push(`${e.id}: ${fd} → ${t.str} outside year_between ${c.from}..${c.to}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('every milestone journal can reach its completion threshold, starts in its era and outlives its last milestone', () => {
    const byId = new Map(evs().map((e) => [e.id, e]));
    const bad: string[] = [];
    for (const j of data().db.story_journals ?? []) {
      const steps = j.progress?.monthly ?? [];
      const ms = steps.filter(isOnceStep);
      if (!ms.length) continue;
      const need = Number((j.complete ?? []).find((c) => (c as { type?: string }).type === 'progress_at_least')?.value ?? 0);
      const gain = ms.reduce((s, x) => s + Math.max(0, x.add), 0) + (j.progress?.start ?? 0);
      const repeatingLoss = steps.some((x) => !isOnceStep(x) && !x.if && x.add < 0);
      if (need && (gain < need || repeatingLoss)) bad.push(`${j.id}: milestones give ${gain} of ${need}${repeatingLoss ? ' with an unconditional monthly decay' : ''}`);
      const yb = ((j.trigger?.conditions ?? []) as Record<string, unknown>[]).find((c) => c.type === 'year_between');
      const dates = ms.map((x) => byId.get(String((x.if as { id?: string })?.id))?.trigger?.fire_date).filter((d): d is string => !!d).sort();
      if (dates.length && j.timeout_months !== undefined) {
        const start = Number(yb?.to ?? 1836);
        const lastY = Number(dates[dates.length - 1].slice(0, 4));
        if (!yb && lastY - 1836 > 10) bad.push(`${j.id}: no year_between trigger but milestones run to ${lastY}`);
        if ((lastY - start + 1) * 12 > j.timeout_months) bad.push(`${j.id}: times out before its last milestone (${lastY})`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('Historical Mode, France 1848: the republican journal tracks milestones once and completes after the 1851 coup', () => {
    const st = createGame({ mode: 'historical', seed: 1, player: null });
    let maxIn1848 = 0;
    while (st.date.y < 1853) {
      stepMonth(st);
      const j = st.storyJournals?.find((x) => x.id === 'fra_republican_settlement_1848_1852');
      if (j && st.date.y === 1848) maxIn1848 = Math.max(maxIn1848, j.progress);
    }
    // 1848 milestones: revolution 20, suffrage 10, abolition 10, June Days 15 (the December election is
    // dispatched in January 1849). Repeated awards would pass 100 within months.
    expect(maxIn1848).toBeGreaterThan(0);
    expect(maxIn1848).toBeLessThanOrEqual(55);
    expect(st.storyJournals?.some((x) => x.id === 'fra_republican_settlement_1848_1852')).toBe(false);
    const mods = (st.countries.FRA.modifiers ?? []).map((m) => m.id);
    expect(mods).toContain('fra_republican_settlement_1848_1852_done');
    expect(mods).not.toContain('fra_republican_settlement_1848_1852_stalled');
  }, 240_000);
});
