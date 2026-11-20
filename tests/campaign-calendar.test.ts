import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { createGame } from '../src/engine/init';
import {
  CAMPAIGN_END_MONTH, CAMPAIGN_END_TICK, CAMPAIGN_END_YEAR, CAMPAIGN_START_YEAR,
  campaignMonthsRemaining, dateToTick, isCampaignComplete, tickToDate,
} from '../src/engine/core';
import { runMonths, stepMonth } from '../src/engine/simulation';
import { serialize, deserialize } from '../src/engine/save';

loadNodeData();

describe('campaign calendar 1836–2026', () => {
  it('uses January 1836 as tick zero and includes December 2026 as the final month', () => {
    expect(CAMPAIGN_START_YEAR).toBe(1836);
    expect(CAMPAIGN_END_YEAR).toBe(2026);
    expect(CAMPAIGN_END_MONTH).toBe(12);
    expect(dateToTick('1836-01-01')).toBe(0);
    expect(dateToTick('2026-12-01')).toBe(CAMPAIGN_END_TICK);
    expect(tickToDate(CAMPAIGN_END_TICK)).toEqual({ y: 2026, m: 12 });
    expect(campaignMonthsRemaining(0)).toBe(CAMPAIGN_END_TICK);
    expect(campaignMonthsRemaining(CAMPAIGN_END_TICK)).toBe(0);
    expect(isCampaignComplete(CAMPAIGN_END_TICK - 1)).toBe(false);
    expect(isCampaignComplete(CAMPAIGN_END_TICK)).toBe(true);
  });

  it.each(['historical', 'sandbox'] as const)('%s advances into December 2026 exactly once and then becomes immutable', (mode) => {
    const state = createGame({ mode, seed: 2026, player: null });
    state.tick = CAMPAIGN_END_TICK - 1;
    state.date = tickToDate(state.tick);

    expect(stepMonth(state)).toBe(true);
    expect(state.tick).toBe(CAMPAIGN_END_TICK);
    expect(state.date).toEqual({ y: 2026, m: 12 });

    const completedState = JSON.stringify(state);
    expect(stepMonth(state)).toBe(false);
    expect(JSON.stringify(state)).toBe(completedState);
  });


  it('runMonths stops at December 2026 even when asked to simulate beyond the campaign', () => {
    const state = createGame({ mode: 'historical', seed: 2026, player: null });
    state.tick = CAMPAIGN_END_TICK - 1;
    state.date = tickToDate(state.tick);

    runMonths(state, 24);

    expect(state.tick).toBe(CAMPAIGN_END_TICK);
    expect(state.date).toEqual({ y: 2026, m: 12 });
  });

  it('preserves the terminal month through save/load and cannot advance after loading', () => {
    const state = createGame({ mode: 'sandbox', seed: 2026, player: null });
    state.tick = CAMPAIGN_END_TICK;
    state.date = tickToDate(state.tick);

    const loaded = deserialize(serialize(state));
    expect(loaded.tick).toBe(CAMPAIGN_END_TICK);
    expect(loaded.date).toEqual({ y: 2026, m: 12 });

    const terminalSnapshot = JSON.stringify(loaded);
    expect(stepMonth(loaded)).toBe(false);
    expect(JSON.stringify(loaded)).toBe(terminalSnapshot);
  });

  it('fails closed for invalid or negative tick values', () => {
    expect(campaignMonthsRemaining(-1)).toBe(0);
    expect(campaignMonthsRemaining(Number.NaN)).toBe(0);
    expect(isCampaignComplete(Number.NaN)).toBe(false);
  });
});
