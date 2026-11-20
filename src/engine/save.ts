import type { GameState } from './types';
import { calendarMatchesDate, createCalendarState, isValidCalendarState } from './calendar';

export const SAVE_FORMAT = 'currents-of-history-save';
export const SAVE_VERSION = 2;
type SaveEnvelope = { format: string; version: number; savedAt?: string; state: unknown };

export function serialize(st: GameState): string {
  if (st.version !== SAVE_VERSION || !isValidCalendarState(st.calendar) || !calendarMatchesDate(st.calendar, st.date)) {
    throw new Error('Game state is not valid for save version 2');
  }
  return JSON.stringify({
    format: SAVE_FORMAT, version: SAVE_VERSION,
    savedAt: `${st.calendar.year}-${String(st.calendar.month).padStart(2, '0')}-${String(st.calendar.day).padStart(2, '0')}T${String(st.calendar.hour).padStart(2, '0')}:00`,
    state: st,
  });
}

/** Legacy month-only saves map to day 1, 00:00; migration invents no partial day or hour. */
export function migrateV1State(legacy: Record<string, unknown>): GameState {
  const date = legacy.date as { y?: unknown; m?: unknown } | undefined;
  if (!date || !Number.isInteger(date.y) || !Number.isInteger(date.m)) throw new Error('Legacy save has an invalid monthly date');
  const migrated = { ...legacy } as unknown as GameState;
  migrated.version = SAVE_VERSION;
  migrated.calendar = createCalendarState(date.y as number, date.m as number, 1, 0);
  migrated.marketStats ??= {};
  migrated.diplomaticPlays ??= [];
  for (const country of Object.values(migrated.countries ?? {})) country.constructionQueue ??= [];
  return migrated;
}

export function deserialize(text: string): GameState {
  let envelope: SaveEnvelope;
  try { envelope = JSON.parse(text) as SaveEnvelope; }
  catch { throw new Error('Save file is not valid JSON'); }
  if (!envelope || envelope.format !== SAVE_FORMAT || !envelope.state || typeof envelope.state !== 'object') {
    throw new Error('Not a save file of this game');
  }
  const raw = envelope.state as Record<string, unknown>;
  let state: GameState;
  if (envelope.version === 1) state = migrateV1State(raw);
  else if (envelope.version === SAVE_VERSION) {
    state = raw as unknown as GameState;
    if (state.version !== SAVE_VERSION || !isValidCalendarState(state.calendar) || !calendarMatchesDate(state.calendar, state.date)) {
      throw new Error('Save calendar is missing, invalid or inconsistent');
    }
    state.marketStats ??= {};
    state.diplomaticPlays ??= [];
    for (const country of Object.values(state.countries ?? {})) country.constructionQueue ??= [];
  } else throw new Error(`Unsupported save version ${envelope.version}`);
  return state;
}