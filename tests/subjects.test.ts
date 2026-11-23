// PB-03a: subjects — payments by type, liberty desire with named factors, overlord pacts, autonomy and independence.
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { execute } from '../src/engine/commands';
import { SUBJECT, SUBJECT_TYPES, libertyParts, pactOf, paymentRate, subjectAction, subjectsMonth } from '../src/engine/systems/subjects';
import { foundBloc, powerBlocsMonth } from '../src/engine/systems/powerBlocs';
import { makeSubject } from '../src/engine/world';
import { validateNestedState } from '../src/engine/stateContract';

loadNodeData();
const subjectOf = (st: ReturnType<typeof createGame>, o: string) => Object.values(st.countries).find((c) => c.alive && c.overlord === o)!;

describe('PB-03a subjects', () => {
  it('a subject pays its overlord a share of its income by type', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    const s = subjectOf(st, 'GBR');
    s.subjectType = 'puppet'; s.income = 100;
    expect(paymentRate(st, s)).toBeCloseTo(SUBJECT_TYPES.puppet.pay);
    const before = st.countries.GBR.treasury, sb = s.treasury;
    subjectsMonth(st); // (in January the AI overlord also reviews the pact afterwards)
    expect(s.subjectPact!.paid).toBeCloseTo(25);
    const all = Object.values(st.countries).filter((c) => c.overlord === 'GBR').reduce((a, c) => a + (c.subjectPact?.paid ?? 0) - (c.subjectPact?.support ? Math.max(0, c.income) * SUBJECT.supportCost : 0), 0);
    expect(st.countries.GBR.treasury - before).toBeCloseTo(all, 0);
    expect(sb - s.treasury).toBeGreaterThan(0);
    expect(() => validateNestedState(st)).not.toThrow();
  });

  it('liberty desire moves by visible factors; raising payments pushes it up, pacts pull it down', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    const s = subjectOf(st, 'GBR'); s.subjectType = 'puppet';
    const p = pactOf(st, s); p.liberty = 30;
    const base = Object.values(libertyParts(st, s)!).reduce((a, b) => a + b, 0);
    expect(subjectAction(st, 'GBR', s.id, 'raise_pay')).toBeNull();
    expect(paymentRate(st, s)).toBeCloseTo(0.35);
    expect(Object.values(libertyParts(st, s)!).reduce((a, b) => a + b, 0)).toBeGreaterThan(base);
    subjectAction(st, 'GBR', s.id, 'knowledge'); subjectAction(st, 'GBR', s.id, 'exempt'); subjectAction(st, 'GBR', s.id, 'support');
    expect(libertyParts(st, s)!.pacts).toBeCloseTo(SUBJECT.knowledge + SUBJECT.exempt + SUBJECT.support);
  });

  it('autonomy steps, annexation needs low liberty, release frees the subject', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: 'GBR' });
    const s = subjectOf(st, 'GBR'); s.subjectType = 'puppet';
    pactOf(st, s).liberty = 50;
    expect(execute(st, { type: 'subject_pact', target: s.id, action: 'annex' }).ok).toBe(false);
    expect(execute(st, { type: 'subject_pact', target: s.id, action: 'more_autonomy' }).ok).toBe(true);
    expect(s.subjectType).toBe('dominion');
    expect(execute(st, { type: 'subject_pact', target: s.id, action: 'release' }).ok).toBe(true);
    expect(s.overlord).toBeNull();
    const t = subjectOf(st, 'GBR'); t.subjectType = 'puppet'; pactOf(st, t).liberty = 10;
    expect(execute(st, { type: 'subject_pact', target: t.id, action: 'annex' }).ok).toBe(true);
    expect(st.regions.some((r) => r.owner === t.id)).toBe(false);
  });

  it('a restless subject asks the player overlord for autonomy through the journal; in Sandbox a cornered one rises', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: 'GBR' });
    const s = subjectOf(st, 'GBR'); s.subjectType = 'puppet'; pactOf(st, s).liberty = 80;
    subjectsMonth(st);
    const j = st.journal!.find((x) => x.kind === 'subject_request' && x.event === s.id)!;
    expect(j).toBeTruthy();
    expect(execute(st, { type: 'journal', entry: j.id, action: 'complete' }).ok).toBe(true);
    expect(s.subjectType).toBe('dominion');
    const st2 = createGame({ mode: 'sandbox', seed: 1, player: null });
    const a = subjectOf(st2, 'GBR'); makeSubject(st2, a.id, 'GBR', 'protectorate');
    const pa = pactOf(st2, a); pa.liberty = 100; pa.highMonths = SUBJECT.independenceMonths;
    subjectsMonth(st2);
    expect(st2.wars.some((w) => w.attackers.leader === a.id && w.defenders.members.includes('GBR'))).toBe(true);
  });

  it('a sovereign empire squeezes its subjects harder and keeps them calmer', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    const s = subjectOf(st, 'GBR'); s.subjectType = 'puppet';
    const before = paymentRate(st, s);
    const b = foundBloc(st, 'GBR', 'B', 'sovereign_empire', 'vassalization')!;
    b.principles.vassalization = 2; b.cohesion = 60;
    powerBlocsMonth(st);
    expect(paymentRate(st, s)).toBeCloseTo(before * 1.25);
    expect(libertyParts(st, s)!.bloc).toBeLessThan(0);
  });
});
