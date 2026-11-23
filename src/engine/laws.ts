// Canonical catalogue of law values a player may propose through a reform (BUG-CMD-01). Engine-owned
// so command validation does not depend on UI files; the UI re-exports it. AI reform candidates are
// a subset chosen in ai.ts and are unaffected.
import { LAW_GROUPS, type LawGroup } from './data/dbTypes';

export const REFORMABLE_LAWS: Readonly<Record<LawGroup, readonly string[]>> = {
  power: ['autocracy', 'oligarchy', 'census_suffrage', 'universal_male_suffrage', 'universal_suffrage', 'one_party_state', 'theocracy'],
  governance: ['monarchy', 'republic', 'theocracy'],
  economy: ['traditionalism', 'mercantilism', 'interventionism', 'laissez_faire', 'command_economy'],
  trade: ['isolationism', 'protectionism', 'free_trade'],
  labor: ['serfdom', 'slavery', 'traditional_tenancy', 'free_labor'],
  church: ['state_religion', 'freedom_of_conscience', 'secularism'],
  press: ['censorship', 'limited_press', 'free_press'],
  education: ['no_schools', 'religious_schools', 'public_schools'],
  army: ['feudal_levies', 'professional_army', 'mass_conscription'],
};

/**
 * REGIME-01b: 20th-century laws (V3-style) need the political ideas behind them before a country can
 * debate them. Historical regime-change events set them on their dates regardless.
 */
export const LAW_TECH: Readonly<Record<string, string>> = { universal_suffrage: 'socialist_thought', one_party_state: 'socialist_thought', command_economy: 'socialist_thought' };
export function lawUnlocked(c: { techs: readonly string[] }, value: string): boolean {
  const t = LAW_TECH[value];
  return !t || c.techs.includes(t);
}

export function isLawGroup(g: unknown): g is LawGroup {
  return typeof g === 'string' && (LAW_GROUPS as readonly string[]).includes(g);
}
export function isReformableLaw(g: unknown, v: unknown): boolean {
  return isLawGroup(g) && typeof v === 'string' && REFORMABLE_LAWS[g].includes(v);
}
