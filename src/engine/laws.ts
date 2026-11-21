// Canonical catalogue of law values a player may propose through a reform (BUG-CMD-01). Engine-owned
// so command validation does not depend on UI files; the UI re-exports it. AI reform candidates are
// a subset chosen in ai.ts and are unaffected.
import { LAW_GROUPS, type LawGroup } from './data/dbTypes';

export const REFORMABLE_LAWS: Readonly<Record<LawGroup, readonly string[]>> = {
  power: ['autocracy', 'oligarchy', 'census_suffrage', 'universal_male_suffrage', 'theocracy'],
  governance: ['monarchy', 'republic', 'theocracy'],
  economy: ['traditionalism', 'mercantilism', 'interventionism', 'laissez_faire'],
  trade: ['isolationism', 'protectionism', 'free_trade'],
  labor: ['serfdom', 'slavery', 'traditional_tenancy', 'free_labor'],
  church: ['state_religion', 'freedom_of_conscience', 'secularism'],
  press: ['censorship', 'limited_press', 'free_press'],
  education: ['no_schools', 'religious_schools', 'public_schools'],
  army: ['feudal_levies', 'professional_army', 'mass_conscription'],
};

export function isLawGroup(g: unknown): g is LawGroup {
  return typeof g === 'string' && (LAW_GROUPS as readonly string[]).includes(g);
}
export function isReformableLaw(g: unknown, v: unknown): boolean {
  return isLawGroup(g) && typeof v === 'string' && REFORMABLE_LAWS[g].includes(v);
}
