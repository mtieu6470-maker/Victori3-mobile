// EVT-01: a country's numeric modifiers from its power bloc (Country.blocMods, PB-01..03) and from timed event
// modifiers (Country.eventMods, aggregated monthly by systems/storyEvents). Hooks read them through `mod`.
import type { Country } from './types';

/** Modifier keys readable by the simulation (fractions unless noted). */
export const MOD_KEYS = [
  'trade', 'tariff', 'construction', 'research', 'innovation', 'reform', 'police', 'radicalism', 'army', 'legitimacy',
  'tax', 'literacy', 'birth', 'attraction', 'prestige', 'war_exhaustion', 'clergy',
  'ig_landowners', 'ig_industrialists', 'ig_intelligentsia', 'ig_petty_bourgeoisie', 'ig_clergy', 'ig_armed_forces', 'ig_rural_folk', 'ig_trade_unions',
] as const;
export type ModKey = (typeof MOD_KEYS)[number];

export const mod = (c: Country | undefined, k: string): number =>
  ((c?.blocMods as Record<string, number> | undefined)?.[k] ?? 0) + (c?.eventMods?.[k] ?? 0);
