// AI-INT-01: allies and enemies weigh their own interests (owner 2026-11-23).
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import { joinInterest, joinProbability, declareWar, formAlliance, allied, REFUSED_CALL } from '../src/engine/systems/diplomacy';
import { getRel } from '../src/engine/core';

loadNodeData();

describe('AI-INT-01 interests in war decisions', () => {
  it('a distant country without a navy is less keen; an overlord protects its subject', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    // Persia has no border with France or Prussia: reaching the war needs a navy
    st.countries.PRS.navy.strength = 0;
    const far = joinInterest(st, 'PRS', 'FRA', 'PRU');
    st.countries.PRS.navy.strength = 50; st.countries.PRS.navy.quality = 1;
    expect(joinInterest(st, 'PRS', 'FRA', 'PRU')).toBeGreaterThan(far);
    const before = joinInterest(st, 'GBR', 'FRA', 'ION');
    expect(st.countries.ION.overlord).toBe('GBR');
    st.countries.ION.overlord = null;
    expect(before).toBeGreaterThan(joinInterest(st, 'GBR', 'FRA', 'ION'));
  });

  it('the attacker counts an ally by the chance it comes; a refusing ally loses trust and the alliance', () => {
    const st = createGame({ mode: 'sandbox', seed: 1, player: null });
    const p = joinProbability(st, 'GBR', 'FRA', 'POR');
    expect(p).toBeGreaterThan(0); expect(p).toBeLessThan(1);
    // force a reluctant ally: exhausted and at odds with the defender
    st.relations['SWE|SAR'] = 0; formAlliance(st, 'SAR', 'SWE') || st.treaties.push({ id: 'ally_test', type: 'alliance', members: ['SAR', 'SWE'], start: st.tick });
    st.countries.SWE.warExhaustion = 100;
    const rel = getRel(st, 'SWE', 'SAR');
    const w = declareWar(st, 'AUS', 'SAR', [{ by: 'AUS', type: 'humiliate', target: 'SAR' }]);
    expect(w).toBeTruthy();
    expect(w!.defenders.members).not.toContain('SWE');
    expect(allied(st, 'SWE', 'SAR')).toBe(false);
    expect(getRel(st, 'SWE', 'SAR')).toBeLessThanOrEqual(rel - REFUSED_CALL.relation + 1e-9);
  });
});

describe('CTA-01 the player answers an ally\'s call to arms', () => {
  it('is asked instead of being drafted; answering joins the defence, refusing costs trust and the alliance', async () => {
    const { execute } = await import('../src/engine/commands');
    const st = createGame({ mode: 'sandbox', seed: 1, player: 'SWE' });
    st.treaties.push({ id: 'ally_t1', type: 'alliance', members: ['SAR', 'SWE'], start: st.tick });
    const w = declareWar(st, 'AUS', 'SAR', [{ by: 'AUS', type: 'humiliate', target: 'SAR' }])!;
    expect(w.defenders.members).not.toContain('SWE');
    const j = st.journal!.find((x) => x.kind === 'call_to_arms' && x.event === w.id)!;
    expect(j.country).toBe('SWE');
    expect(execute(st, { type: 'journal', entry: j.id, action: 'complete' }).ok).toBe(true);
    expect(w.defenders.members).toContain('SWE');

    const st2 = createGame({ mode: 'sandbox', seed: 1, player: 'SWE' });
    st2.treaties.push({ id: 'ally_t2', type: 'alliance', members: ['SAR', 'SWE'], start: st2.tick });
    const w2 = declareWar(st2, 'AUS', 'SAR', [{ by: 'AUS', type: 'humiliate', target: 'SAR' }])!;
    const j2 = st2.journal!.find((x) => x.kind === 'call_to_arms' && x.event === w2.id)!;
    const rel = getRel(st2, 'SWE', 'SAR');
    expect(execute(st2, { type: 'journal', entry: j2.id, action: 'abandon' }).ok).toBe(true);
    expect(allied(st2, 'SWE', 'SAR')).toBe(false);
    expect(getRel(st2, 'SWE', 'SAR')).toBeLessThan(rel);
  });
});
