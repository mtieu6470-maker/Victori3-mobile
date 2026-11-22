// ECON-CAL-01b: per-good import-openness evidence c.1836 (ChatGPT CG-21, public-domain sources:
// docs/research/history/CG21_1836_RAW_MATERIAL_TARIFFS_PD_VI.md). Only goods with evidence are
// listed; every other good keeps the trade-law default. Keys are market ids (country id or customs
// union id such as 'zollverein').
//
// Conversion tariff → openness is a PROJECT DESIGN mapping fitted to the engine's existing trade-law
// table (free_trade 4% → 0.66, protectionism 20% → 0.31, isolationism 35% → ≈0): open = 0.75 − 2.2·t,
// clamped to [0.03, 0.9]. Prohibition maps to the minimum.
import type { Good } from '../types';

export interface TariffEvidence {
  /** Ad-valorem equivalent (0.1 = 10%), or 'prohibited'. */
  tariff: number | 'prohibited';
  basis: string;
}

export const TARIFF_EVIDENCE_1836: Readonly<Record<string, Partial<Record<Good, TariffEvidence>>>> = {
  GBR: {
    cotton: { tariff: 0.03, basis: 'Raw cotton 5/16d per lb (Hansard 6 May 1836) on c.10d/lb (Kennedy 1839 testimony, 1830 price): ≈3%.' },
    textiles: { tariff: 0.10, basis: 'Cotton manufactures 10% ad valorem (UK schedule 1837–8, near-year; CG-21).' },
    iron: { tariff: 0.11, basis: 'Foreign pig iron 10s/ton (near-year schedule) on £4 10s/ton Birmingham 1830 (Babbage 1832): ≈11%.' },
    steel: { tariff: 0.25, basis: 'Foreign bar iron £1 10s/ton (near-year; consistent with 1836 duty collected) on £6/ton Birmingham 1830: ≈25%.' },
    grain: { tariff: 0.45, basis: 'Corn Law sliding scale (9 Geo. IV c.60): ≈27s8d duty at the 1832 Birmingham wheat price 59s3d/quarter (≈47%); higher when prices are lower.' },
  },
  zollverein: {
    cotton: { tariff: 0, basis: 'Raw cotton imported duty-free by the Prussian commercial league (Hansard 8 June 1842; imports 92,212 cwt 1833 → 187,858 cwt 1836).' },
  },
  PRU: {
    cotton: { tariff: 0, basis: 'As zollverein (Prussia led the league).' },
  },
  FRA: {
    textiles: { tariff: 'prohibited', basis: 'Cotton cloth import generally prohibited (narrow exceptions), per Coquelin 1848 describing the 1834/1836 regime.' },
  },
  USA: {
    textiles: { tariff: 0.24, basis: 'Cotton manufactures 25% ad valorem (Tariff Act 1832) reduced to 24% nominal in 1836 under the Compromise Tariff.' },
  },
};

export function opennessFromTariff(t: number | 'prohibited'): number {
  if (t === 'prohibited') return 0.03;
  return Math.min(0.9, Math.max(0.03, 0.75 - 2.2 * t));
}
