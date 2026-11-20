import { describe, expect, it } from 'vitest';
import { fresh } from './helpers';
import { advanceCalendarStep } from '../src/engine/calendar';
import { setRel } from '../src/engine/core';
import { advanceDiplomacyDaily, formTradeAgreement, joinDiplomaticPlay, startDiplomaticPlay } from '../src/engine/systems/diplomacy';
import { treatyIsActive, treatyTariffReduction } from '../src/engine/systems/treaties';

describe('time-valid treaties and diplomatic plays', () => {
  it('signs a bilateral trade agreement and applies its tariff reduction to both members', () => {
    const st = fresh('sandbox', 81, 'GBR');
    setRel(st, 'GBR', 'FRA', 70);
    expect(formTradeAgreement(st, 'GBR', 'FRA')).toBe(true);
    const treaty = st.treaties.find((t) => t.type === 'trade_agreement')!;
    expect(treaty.status).toBe('active');
    expect(treaty.endStep).toBeGreaterThan(st.calendar.stepIndex);
    expect(treatyIsActive(st, treaty)).toBe(true);
    expect(treatyTariffReduction(st, 'GBR')).toBeCloseTo(0.175, 6);
    expect(treatyTariffReduction(st, 'FRA')).toBeCloseTo(0.175, 6);
    expect(formTradeAgreement(st, 'GBR', 'FRA')).toBe(false);
  });

  it('expires a fixed-duration trade agreement at its logical deadline', () => {
    const st = fresh('sandbox', 82, 'GBR');
    setRel(st, 'GBR', 'FRA', 70);
    expect(formTradeAgreement(st, 'GBR', 'FRA')).toBe(true);
    const treaty = st.treaties.find((t) => t.type === 'trade_agreement')!;
    while (st.calendar.stepIndex < treaty.endStep!) st.calendar = advanceCalendarStep(st.calendar);
    advanceDiplomacyDaily(st);
    expect(treaty.status).toBe('expired');
    expect(treatyIsActive(st, treaty)).toBe(false);
    expect(treatyTariffReduction(st, 'GBR')).toBe(0);
  });

  it('moves from maneuver to escalation, admits supporters, then resolves as a war', () => {
    const st = fresh('sandbox', 83, 'GBR');
    const targetRegion = st.regions.find((r) => r.owner === 'FRA');
    expect(targetRegion).toBeTruthy();
    const play = startDiplomaticPlay(st, 'GBR', 'FRA', [
      { by: 'GBR', type: 'conquer', target: 'FRA', regions: [targetRegion!.id] },
    ]);
    expect(play?.phase).toBe('maneuver');
    expect(joinDiplomaticPlay(st, play!.id, 'RUS', 'target')).toBe(true);
    expect(joinDiplomaticPlay(st, play!.id, 'RUS', 'initiator')).toBe(false);
    while (st.calendar.stepIndex < play!.deadlineStep) st.calendar = advanceCalendarStep(st.calendar);
    advanceDiplomacyDaily(st);
    expect(play!.phase).toBe('escalation');
    expect(play!.deadlineStep).toBeGreaterThan(st.calendar.stepIndex);
    while (st.calendar.stepIndex < play!.deadlineStep) st.calendar = advanceCalendarStep(st.calendar);
    advanceDiplomacyDaily(st);
    expect(play!.phase).toBe('resolved');
    expect(play!.warId).toBeTruthy();
    const war = st.wars.find((w) => w.id === play!.warId)!;
    expect(war.attackers.members).toContain('GBR');
    expect(war.defenders.members).toContain('FRA');
    expect(war.defenders.members).toContain('RUS');
  });

  it('rejects invalid goals and duplicate concurrent crises between the same countries', () => {
    const st = fresh('sandbox', 84, 'GBR');
    expect(startDiplomaticPlay(st, 'GBR', 'FRA', [{ by: 'FRA', type: 'conquer', target: 'GBR' }])).toBe(null);
    expect(startDiplomaticPlay(st, 'GBR', 'FRA', [{ by: 'GBR', type: 'force_open_market', target: 'FRA' }])).toBeTruthy();
    expect(startDiplomaticPlay(st, 'FRA', 'GBR', [{ by: 'FRA', type: 'force_open_market', target: 'GBR' }])).toBe(null);
  });
});
