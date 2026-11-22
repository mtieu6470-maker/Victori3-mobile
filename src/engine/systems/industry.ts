// IND-02a: profit-responsive operation of building sites (plantation, mine, logging, factories).
//
// Project design (informed by CG-17/CG-19; Victoria 3 publishes the behaviour qualitatively, not
// these numbers): each site keeps cash reserves. Monthly profit = realized sales − input cost −
// wages. Sustained losses that the reserve buffer cannot carry cut utilization (layoffs, lower
// output); sustained profitable full sell-through raises it again (rehiring) up to capacity.
// Below a minimum the site goes idle (no output, no costs) and only reopens after a waiting period
// when its market signals unmet demand. Streak counters and a reserve buffer provide hysteresis so a
// single noisy month never flips a site (ECON19-07). Utilization changes employment only; it never
// creates or removes population (laid-off workers simply are not employed: ECON19-08).
//
// All thresholds below are PROJECT DESIGN PARAMETERS (not historical data, not Victoria 3 values).
//
// ENABLED BY DEFAULT since ECON-CAL-03 (2026-11-22). It was off while the 1836 calibration made it
// idle ~98% of textile mills (ECON-CAL-01). After ECON-CAL-02/03 (CG-23/24/25 scale, recipe value
// shares, household coal access) a 12-year historical run (seed 1) keeps every textile mill and
// most ironworks operating; factory tool works shrink because workshop (cottage) hardware already
// covers tool demand, which matches the period's small-workshop tool trades (CG-25 §6.3-6.4).
// GDP and famine stay within 1% of the run with the switch off. Setting it to false restores the
// previous behaviour exactly.

/** Feature switch for profit-responsive site operations. Off: output and results are exactly as before IND-02a. */
export const ECONOMY_FLAGS = { siteOperations: true };

export interface SiteOps {
  /** Share of the site's staffed capacity in operation, 0 (idle) or [MIN_UTIL, 1]. */
  util: number;
  /** Cash reserves in engine money units (≥ 0). */
  reserves: number;
  lossStreak: number;
  gainStreak: number;
  idleMonths: number;
  /** Last month's realized figures (for UI/tests). */
  revenue: number;
  cost: number;
}

export const SITE_OPS = {
  initialReserveMonths: 3,
  reserveCapMonths: 6,
  /** Losses are absorbed while reserves cover at least this many months of cost. */
  reserveBufferMonths: 1,
  lossStreakToCut: 2,
  gainStreakToGrow: 2,
  cutStep: 0.15,
  growStep: 0.1,
  minUtil: 0.1,
  /** Profit margin (profit / revenue) above which a month counts as clearly profitable. */
  gainMargin: 0.05,
  /** Share of output that must find a buyer before expanding. */
  growSellThrough: 0.97,
  reopenAfterMonths: 3,
  reopenUtil: 0.2,
  reopenShortage: 0.02,
} as const;

export interface SiteMonth {
  /** Monthly sales value at the (oversupply-depressed) market price. */
  revenue: number;
  /** Monthly input cost + wages of the site as operated. */
  cost: number;
  /** Share of the market's supply of the site's goods that was used or exported (0..1). */
  sellThrough: number;
  /** Unmet share of demand for the site's goods in its market (0..1). */
  shortage: number;
}

const fin = (x: number) => (Number.isFinite(x) ? x : 0);

export function newSiteOps(monthlyCost: number): SiteOps {
  return { util: 1, reserves: Math.max(0, fin(monthlyCost)) * SITE_OPS.initialReserveMonths, lossStreak: 0, gainStreak: 0, idleMonths: 0, revenue: 0, cost: 0 };
}

/** Pure monthly decision for one site. Never mutates its input. */
export function decideSite(prev: SiteOps, m: SiteMonth): SiteOps {
  const T = SITE_OPS;
  const s: SiteOps = { ...prev, revenue: Math.max(0, fin(m.revenue)), cost: Math.max(0, fin(m.cost)) };
  if (s.util <= 0) {
    // Idle: no output, no costs. Reopen only after a waiting period and a demand signal.
    s.util = 0; s.revenue = 0; s.cost = 0; s.lossStreak = 0; s.gainStreak = 0;
    s.idleMonths += 1;
    if (s.idleMonths >= T.reopenAfterMonths && fin(m.shortage) > T.reopenShortage) { s.util = T.reopenUtil; s.idleMonths = 0; }
    return s;
  }
  const profit = s.revenue - s.cost;
  let reserves = s.reserves + profit;
  let forcedCut = false;
  if (reserves < 0) { reserves = 0; forcedCut = true; } // cannot pay full costs: must shrink now
  s.reserves = Math.min(reserves, T.reserveCapMonths * s.cost || reserves);
  const margin = s.revenue > 0 ? profit / s.revenue : (s.cost > 0 ? -1 : 0);
  if (margin < 0) { s.lossStreak += 1; s.gainStreak = 0; }
  else if (margin > T.gainMargin) { s.gainStreak += 1; s.lossStreak = 0; }
  else { s.lossStreak = 0; s.gainStreak = 0; }

  const buffered = s.reserves >= T.reserveBufferMonths * s.cost;
  if (forcedCut || (s.lossStreak >= T.lossStreakToCut && !buffered)) {
    s.util = s.util - T.cutStep;
    if (s.util < T.minUtil) { s.util = 0; s.idleMonths = 0; }
    s.lossStreak = 0;
  } else if (s.gainStreak >= T.gainStreakToGrow && s.util < 1 && fin(m.sellThrough) >= T.growSellThrough) {
    s.util = Math.min(1, s.util + T.growStep);
    s.gainStreak = 0;
  }
  s.util = Math.round(s.util * 1e6) / 1e6; // keep values tidy and platform-stable
  return s;
}

export const siteKey = (regionId: string, building: string) => `${regionId}|${building}`;
