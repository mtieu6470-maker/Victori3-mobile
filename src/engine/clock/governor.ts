// AUTO pace governor (CLOCK-01): 12h/s nominal, visible 6h/s fallback under SUSTAINED measured load.
// Pure and DOM-free; the runtime feeds it per-frame measurements.
//
// Policy (owner directive 2026-11-21 §2.2):
// - Decisions use measured workload only (simulation wall-time share, saturated frames, lag,
//   long frames attributable to simulation). Calendar year is never an input.
// - Hysteresis: several consecutive overloaded windows to drop 12→6; a much longer run of
//   windows with clear projected headroom at 12h/s to return 6→12.
// - If 6h/s itself is overloaded the status becomes 'overloaded' (shown to the player); every owed
//   hour is still processed in order — the game runs slower than 6h/s rather than skipping work.
// - Fixed presets never change rate; they only report whether they are keeping up.
// - The governor's state is runtime-only and never saved: after load, AUTO restarts at 12h/s and
//   re-measures the current device.
//
// THRESHOLDS ARE PROVISIONAL. They come from desktop profiling of the current world (monthly
// boundary ≈ 64 ms in Node, non-boundary hour ≈ microseconds) and frame-budget reasoning for
// 60 fps. They must be recalibrated from Android device benchmarks (task CLOCK-BENCH-ANDROID)
// before release; do not treat these values as device evidence.

import { AUTO_FALLBACK_HPS, AUTO_NOMINAL_HPS, type SpeedSetting } from './pace';

export const GOVERNOR_THRESHOLDS = {
  /** Measurement window length in real milliseconds. */
  windowMs: 2000,
  /** Window is overloaded if simulation used more than this share of wall time on the UI thread. */
  overloadSimShare: 0.45,
  /** …or more than this share of frames hit the per-frame budget with hours still owed. */
  overloadSaturatedShare: 0.5,
  /** …or more than this share of real time could not be credited (backlog bound reached). */
  overloadLagShare: 0.02,
  /** …or long frames (> longFrameMs) exceed this share while simulation share is non-trivial. */
  overloadLongFrameShare: 0.25,
  longFrameMs: 50,
  longFrameMinSimShare: 0.15,
  /** Consecutive overloaded windows needed before 12→6 (≈ 6 s sustained). */
  downgradeWindows: 3,
  /** Projected sim share at 12h/s must stay below this to count as headroom. */
  recoverProjectedSimShare: 0.2,
  /** Consecutive headroom windows needed before 6→12 (≈ 30 s sustained). */
  upgradeWindows: 15,
} as const;

export type PaceStatus = 'nominal' | 'fallback' | 'overloaded' | 'fixed' | 'fixed_overloaded';

export interface FrameSample {
  /** Real ms since the previous sample (frame interval). */
  realMs: number;
  /** Real ms spent inside the simulation during this frame. */
  simMs: number;
  /** True if the frame stopped on its work budget while hours were still owed. */
  saturated: boolean;
  /** Real ms dropped by the pace accumulator during this frame (gap clamp or backlog bound). */
  droppedRealMs: number;
}

export interface WindowReport {
  realMs: number; simShare: number; saturatedShare: number; lagShare: number; longFrameShare: number; overloaded: boolean;
}

export interface GovernorState {
  setting: SpeedSetting;
  effectiveHps: number;
  status: PaceStatus;
  overloadStreak: number;
  headroomStreak: number;
  win: { realMs: number; simMs: number; frames: number; saturated: number; droppedMs: number; longFrames: number };
  lastWindow: WindowReport | null;
  /** Number of AUTO rate switches since this governor was created (diagnostics). */
  switches: number;
}

const emptyWindow = () => ({ realMs: 0, simMs: 0, frames: 0, saturated: 0, droppedMs: 0, longFrames: 0 });

export function createGovernor(setting: SpeedSetting): GovernorState {
  const fixed = setting.kind === 'fixed';
  return {
    setting,
    effectiveHps: fixed ? setting.hps : AUTO_NOMINAL_HPS,
    status: fixed ? 'fixed' : 'nominal',
    overloadStreak: 0,
    headroomStreak: 0,
    win: emptyWindow(),
    lastWindow: null,
    switches: 0,
  };
}

function finite(x: number): number { return Number.isFinite(x) && x > 0 ? x : 0; }

function closeWindow(g: GovernorState): WindowReport {
  const T = GOVERNOR_THRESHOLDS;
  const w = g.win;
  const realMs = Math.max(1, w.realMs);
  const frames = Math.max(1, w.frames);
  const simShare = w.simMs / realMs;
  const saturatedShare = w.saturated / frames;
  const lagShare = w.droppedMs / realMs;
  const longFrameShare = w.longFrames / frames;
  const overloaded = simShare > T.overloadSimShare
    || saturatedShare > T.overloadSaturatedShare
    || lagShare > T.overloadLagShare
    || (longFrameShare > T.overloadLongFrameShare && simShare > T.longFrameMinSimShare);
  return { realMs: w.realMs, simShare, saturatedShare, lagShare, longFrameShare, overloaded };
}

/** Feeds one frame measurement; returns the (possibly updated) governor state. Mutates `g`. */
export function observeFrame(g: GovernorState, s: FrameSample): GovernorState {
  const T = GOVERNOR_THRESHOLDS;
  const realMs = finite(s.realMs);
  g.win.realMs += realMs;
  g.win.simMs += finite(s.simMs);
  g.win.frames += 1;
  if (s.saturated) g.win.saturated += 1;
  g.win.droppedMs += finite(s.droppedRealMs);
  if (realMs > T.longFrameMs) g.win.longFrames += 1;
  if (g.win.realMs < T.windowMs) return g;

  const report = closeWindow(g);
  g.lastWindow = report;
  g.win = emptyWindow();

  if (report.overloaded) { g.overloadStreak += 1; g.headroomStreak = 0; } else { g.overloadStreak = 0; }

  if (g.setting.kind === 'fixed') {
    g.status = g.overloadStreak >= T.downgradeWindows ? 'fixed_overloaded' : 'fixed';
    return g;
  }

  if (g.effectiveHps === AUTO_NOMINAL_HPS) {
    if (g.overloadStreak >= T.downgradeWindows) {
      g.effectiveHps = AUTO_FALLBACK_HPS;
      g.status = 'fallback';
      g.overloadStreak = 0; g.headroomStreak = 0; g.switches += 1;
    } else {
      g.status = 'nominal';
    }
    return g;
  }

  // At the 6h/s fallback.
  const projectedAtNominal = report.simShare * (AUTO_NOMINAL_HPS / AUTO_FALLBACK_HPS);
  const headroom = !report.overloaded && report.saturatedShare === 0 && report.lagShare === 0
    && projectedAtNominal < T.recoverProjectedSimShare;
  g.headroomStreak = headroom ? g.headroomStreak + 1 : 0;
  if (g.headroomStreak >= T.upgradeWindows) {
    g.effectiveHps = AUTO_NOMINAL_HPS;
    g.status = 'nominal';
    g.overloadStreak = 0; g.headroomStreak = 0; g.switches += 1;
    return g;
  }
  g.status = g.overloadStreak >= T.downgradeWindows ? 'overloaded' : 'fallback';
  return g;
}

/** Human-readable status for HUD tooltips (Vietnamese UI). */
export function paceStatusLabelVi(g: GovernorState): string {
  switch (g.status) {
    case 'nominal': return `AUTO · ${g.effectiveHps} giờ/giây`;
    case 'fallback': return `AUTO · giảm tải ${g.effectiveHps} giờ/giây`;
    case 'overloaded': return `AUTO · quá tải (dưới ${g.effectiveHps} giờ/giây)`;
    case 'fixed': return `Cố định · ${g.effectiveHps} giờ/giây`;
    case 'fixed_overloaded': return `Cố định · quá tải (dưới ${g.effectiveHps} giờ/giây)`;
  }
}
