export type AutoPauseKey = 'decisions' | 'wars' | 'revolutions' | 'disasters';

export interface GamePreferences {
  autoPause: Record<AutoPauseKey, boolean>;
}

export const DEFAULT_PREFERENCES: GamePreferences = {
  autoPause: {
    decisions: true,
    wars: true,
    revolutions: true,
    disasters: false,
  },
};

const STORAGE_KEY = 'currents-of-history.preferences.v1';

export function parsePreferences(raw: string | null | undefined): GamePreferences {
  if (!raw) return { autoPause: { ...DEFAULT_PREFERENCES.autoPause } };
  try {
    const value = JSON.parse(raw) as Partial<GamePreferences> | null;
    const candidate = value?.autoPause;
    return {
      autoPause: {
        decisions: typeof candidate?.decisions === 'boolean' ? candidate.decisions : DEFAULT_PREFERENCES.autoPause.decisions,
        wars: typeof candidate?.wars === 'boolean' ? candidate.wars : DEFAULT_PREFERENCES.autoPause.wars,
        revolutions: typeof candidate?.revolutions === 'boolean' ? candidate.revolutions : DEFAULT_PREFERENCES.autoPause.revolutions,
        disasters: typeof candidate?.disasters === 'boolean' ? candidate.disasters : DEFAULT_PREFERENCES.autoPause.disasters,
      },
    };
  } catch {
    return { autoPause: { ...DEFAULT_PREFERENCES.autoPause } };
  }
}

/** Settings are local to this installation and never enter a save file or leave the device. */
export function loadPreferences(): GamePreferences {
  try {
    return typeof localStorage === 'undefined'
      ? { autoPause: { ...DEFAULT_PREFERENCES.autoPause } }
      : parsePreferences(localStorage.getItem(STORAGE_KEY));
  } catch {
    return { autoPause: { ...DEFAULT_PREFERENCES.autoPause } };
  }
}

export function savePreferences(preferences: GamePreferences): GamePreferences {
  const normalized = parsePreferences(JSON.stringify(preferences));
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    // Gameplay must remain available when browser storage is disabled or full.
  }
  return normalized;
}
