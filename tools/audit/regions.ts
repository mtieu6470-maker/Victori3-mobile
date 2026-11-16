// World macro-regions used by the coverage audit and the calibration suite (the 12 regions of the project
// specification). Assignment uses the entity's capital region coordinates (else the mean of its regions, else an
// explicit location for entities that do not own territory at the start). Approximate by design: it is a grouping
// for reporting, not a historical claim.
import type { HistoricalDB, EntityRecord } from '../../src/engine/data/dbTypes';

export type MacroRegion = 'europe' | 'east_asia' | 'south_asia' | 'southeast_asia' | 'central_asia' | 'west_asia' | 'north_africa'
  | 'subsaharan_africa' | 'north_america' | 'central_america' | 'south_america' | 'oceania';

export const MACRO_REGIONS: { id: MacroRegion; vi: string }[] = [
  { id: 'europe', vi: 'Châu Âu' }, { id: 'east_asia', vi: 'Đông Á' }, { id: 'south_asia', vi: 'Nam Á' }, { id: 'southeast_asia', vi: 'Đông Nam Á' },
  { id: 'central_asia', vi: 'Trung Á' }, { id: 'west_asia', vi: 'Tây Á & Trung Đông' }, { id: 'north_africa', vi: 'Bắc Phi' },
  { id: 'subsaharan_africa', vi: 'Châu Phi hạ Sahara' }, { id: 'north_america', vi: 'Bắc Mỹ' }, { id: 'central_america', vi: 'Trung Mỹ & Caribe' },
  { id: 'south_america', vi: 'Nam Mỹ' }, { id: 'oceania', vi: 'Châu Đại Dương' },
];

/** Location for entities without territory at the start (future / folded entities): [lat, lon]. */
const NO_TERRITORY: Record<string, [number, number]> = {
  LUX: [49.6, 6.1], POL_CONGRESS: [52.2, 21.0], FIN_GD: [60.2, 24.9], SAM: [37.75, 26.97], MUG: [28.6, 77.2], CAM: [11.6, 104.9],
  PBC: [-16.5, -68.1], DOM: [18.5, -69.9], GER: [52.5, 13.4], ITA: [41.9, 12.5], ROM: [44.4, 26.1], POL: [52.2, 21.0], HUN: [47.5, 19.0],
  BUL: [42.7, 23.3], CAN: [45.4, -75.7], CSA: [37.5, -77.4], TRN: [-25.7, 28.2], OFS: [-29.1, 26.2], GUA: [14.6, -90.5], HON: [14.1, -87.2],
  ELS: [13.7, -89.2], NIC: [12.1, -86.3], COS: [9.9, -84.1],
};
/** Conventional regional assignment where coordinates alone mislead. */
const OVERRIDE: Record<string, MacroRegion> = { TUR: 'west_asia', RUS: 'europe', EGY: 'north_africa', TIB: 'east_asia', DZ_KACHIN: 'southeast_asia' };

export function classify(lat: number, lon: number): MacroRegion {
  if ((lon > 110 && lat < -9) || ((lon > 155 || lon < -140) && lat < 35)) return 'oceania';
  if (lon < -30) {
    if (lat < 12.5 && lon > -80) return 'south_america';
    if (lat >= 7 && lat < 23.6 && lon > -92) return 'central_america';
    return 'north_america';
  }
  if (lon > -26 && lon < 52 && lat < 37.5 && !(lon > 34.5 && lat > 12.3)) return lat >= 19 ? 'north_africa' : 'subsaharan_africa';
  if (lat > 35 && lon < 45 && !(lon > 37 && lat < 47)) return 'europe';
  if (lon < 60) return 'west_asia';
  if (lon < 80 && lat >= 34.3) return 'central_asia';
  if (lon < 92 && lat < 30.5) return 'south_asia';
  if (lon < 80) return 'south_asia';
  if (lat < 24 && lon >= 92) return 'southeast_asia';
  return 'east_asia';
}

export function entityLocation(db: HistoricalDB, e: EntityRecord): [number, number] | null {
  const cap = e.capital ? db.regions.find((r) => r.id === e.capital) : undefined;
  if (cap) return [cap.lat, cap.lon];
  const regs = db.regions.filter((r) => r.owner === e.id);
  if (regs.length) return [regs.reduce((s, r) => s + r.lat, 0) / regs.length, regs.reduce((s, r) => s + r.lon, 0) / regs.length];
  return NO_TERRITORY[e.id] ?? null;
}

export function macroRegion(db: HistoricalDB, e: EntityRecord): MacroRegion {
  if (OVERRIDE[e.id]) return OVERRIDE[e.id];
  const at = entityLocation(db, e);
  if (!at) throw new Error(`no location for ${e.id}`);
  return classify(at[0], at[1]);
}
