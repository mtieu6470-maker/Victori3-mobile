// GameController: owns the authoritative GameState in the client, paces the hourly-canonical clock
// (CLOCK-01) and routes player commands through the engine's own `execute` (the same functions the
// AI uses). The UI never edits state.
//
// Real-time pacing: AUTO targets 12 in-game hours per real second and visibly falls back to 6h/s
// under sustained measured load (engine/clock/governor.ts); fixed presets 3/6/12/24/48 h/s are
// available. Every owed hour is processed in order by the engine — pacing never skips an hour.
// Work per animation frame is bounded (SIM_FRAME_BUDGET_MS between hours); owed hours beyond the
// budget stay in a bounded backlog and the shortfall is shown as lag, never silently hidden.
import { createGame } from '../../engine/init';
import { advanceHours, stepMonth } from '../../engine/simulation';
import { execute, type Command } from '../../engine/commands';
import { serialize, deserializeWithMeta } from '../../engine/save';
import { campaignMonthsRemaining } from '../../engine/core';
import { isClockComplete } from '../../engine/clock/calendar';
import {
  consumeBacklog, creditElapsed, DEFAULT_SPEED, maxBacklogHours, parseSpeedSetting, resetPace,
  speedSettingsEqual, type PaceState, type SpeedSetting,
} from '../../engine/clock/pace';
import { createGovernor, observeFrame, type GovernorState } from '../../engine/clock/governor';
import type { GameMode, GameState } from '../../engine/types';

/** Upper bound of simulation wall time started within one animation frame (checked between hours). */
export const SIM_FRAME_BUDGET_MS = 8;
/** UI notifications are throttled to this interval unless a monthly boundary was crossed. */
export const UI_EMIT_INTERVAL_MS = 250;
const PREF_KEY = 'victori3.clockPreference.v1';

function readStoredPreference(): SpeedSetting {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(PREF_KEY) : null;
    return raw ? parseSpeedSetting(JSON.parse(raw)) : DEFAULT_SPEED;
  } catch { return DEFAULT_SPEED; }
}
function writeStoredPreference(s: SpeedSetting): void {
  try { if (typeof localStorage !== 'undefined') localStorage.setItem(PREF_KEY, JSON.stringify(s)); } catch { /* preference only */ }
}
const nowMs = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

/** True when the canonical clock has reached the final playable hour (2026-12-31T23:00). */
export function campaignFinished(st: GameState | null): boolean {
  return !!st && isClockComplete(st.clock?.hour);
}

export interface Toast { id: number; text: string; kind: 'ok' | 'error' | 'info' }

export class GameController {
  st: GameState | null = null;
  version = 0; // bumps on every change so views can re-render
  paused = true;
  /** Player-selected pace: AUTO (12h/s nominal, 6h/s fallback) or a fixed preset. Persisted. */
  speedSetting: SpeedSetting = readStoredPreference();
  /** Runtime-only AUTO governor; recreated on load/new game so AUTO re-measures this device. */
  governor: GovernorState = createGovernor(this.speedSetting);
  pace: PaceState = resetPace();
  /** True when the app was paused automatically because it went to the background. */
  pausedByLifecycle = false;
  busy: { label: string; done: number; total: number } | null = null;
  toasts: Toast[] = [];
  readLogCount = 0;
  private listeners = new Set<() => void>();
  private raf = 0; private last = 0; private toastId = 0; private operationToken = 0; private lastEmit = 0;

  constructor() {
    // Android/WebView lifecycle: pause when hidden; never run or "catch up" in the background.
    if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
      document.addEventListener('visibilitychange', () => { if (document.hidden) this.onBackground(); });
    }
  }

  /** Pauses the simulation safely when the app is backgrounded. Resuming is an explicit player action. */
  onBackground() {
    if (this.paused || this.busy) return;
    this.pausedByLifecycle = true;
    this.paused = true; this.stop(); this.pace = resetPace(); this.emit();
  }

  subscribe(fn: () => void) { this.listeners.add(fn); return () => { this.listeners.delete(fn); }; }
  emit() { this.version++; for (const fn of this.listeners) fn(); }

  newGame(opts: { mode: GameMode; seed: number; player: string | null }) {
    this.operationToken++;
    this.busy = null;
    this.stop();
    this.st = createGame(opts);
    this.resetClockRuntime();
    this.paused = true; this.readLogCount = this.st.log.length;
    this.emit();
  }
  /** Simulates whole months in bounded chunks, without racing the live RAF clock. */
  async fastForward(months: number) {
    if (!this.st || this.busy || !Number.isSafeInteger(months) || months <= 0) return;
    const state = this.st;
    const monthsToRun = Math.min(months, campaignMonthsRemaining(state.tick));
    if (monthsToRun <= 0) {
      this.paused = true; this.stop(); this.pace = resetPace(); this.emit();
      return;
    }
    const token = ++this.operationToken;
    const wasPaused = this.paused;
    this.stop(); this.paused = true; this.pace = resetPace();
    this.busy = { label: 'Đang mô phỏng', done: 0, total: monthsToRun }; this.emit();
    let completed = 0;
    try {
      for (let i = 0; i < monthsToRun; i++) {
        if (token !== this.operationToken || this.st !== state) return;
        if (!stepMonth(state)) break;
        completed += 1;
        if (completed % 6 === 0) {
          if (this.busy) this.busy.done = completed;
          this.emit();
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }
    } finally {
      // A load/new-game invalidates this operation; its finally block must not
      // overwrite the replacement game's paused/busy state.
      if (token === this.operationToken && this.st === state) {
        this.busy = null;
        this.readLogCount = state.log.length;
        this.paused = campaignFinished(state) ? true : wasPaused;
        if (!this.paused) this.start();
        this.emit();
      }
    }
  }
  load(text: string) {
    const { state: st, meta } = deserializeWithMeta(text); // throws on foreign files; caller shows the error
    this.operationToken++; this.busy = null;
    if (meta.clockPreference) { this.speedSetting = meta.clockPreference; writeStoredPreference(this.speedSetting); }
    this.stop(); this.st = st; this.resetClockRuntime(); this.paused = true; this.readLogCount = st.log.length; this.emit();
  }
  save(): string { if (!this.st) throw new Error('Không có ván chơi'); return serialize(this.st, { clockPreference: this.speedSetting }); }

  /** AUTO never inherits a previous device's/session's transient load: start at 12h/s and re-measure. */
  private resetClockRuntime() {
    this.governor = createGovernor(this.speedSetting);
    this.pace = resetPace();
    this.pausedByLifecycle = false;
  }

  command(cmd: Command): { ok: boolean; reason?: string } {
    if (this.busy) return { ok: false, reason: 'Đang mô phỏng, vui lòng chờ' };
    if (!this.st) return { ok: false, reason: 'Không có ván chơi' };
    const r = execute(this.st, cmd);
    this.emit();
    return r;
  }
  toast(text: string, kind: Toast['kind'] = 'info') {
    const t = { id: ++this.toastId, text, kind }; this.toasts = [...this.toasts, t]; this.emit();
    setTimeout(() => { this.toasts = this.toasts.filter((x) => x.id !== t.id); this.emit(); }, 3800);
  }

  // ---------------------------------------------------------------- time
  setPaused(p: boolean) {
    if (this.busy) return;
    if (!p && campaignFinished(this.st)) {
      this.paused = true; this.stop(); this.pace = resetPace(); this.emit();
      return;
    }
    this.pausedByLifecycle = false;
    this.paused = p; if (p) { this.stop(); this.pace = resetPace(); } else this.start(); this.emit();
  }
  setSpeedSetting(s: SpeedSetting) {
    const next = parseSpeedSetting(s);
    if (speedSettingsEqual(next, this.speedSetting)) return;
    this.speedSetting = next;
    writeStoredPreference(next);
    this.governor = createGovernor(next);
    // Keep the sub-hour credit, but never let a previous rate's backlog exceed the new bound.
    this.pace = { ...this.pace, backlogHours: Math.min(this.pace.backlogHours, maxBacklogHours(this.governor.effectiveHps)) };
    this.last = nowMs();
    this.emit();
  }
  /** Effective game-hours per real second right now (AUTO: 12 or 6; fixed: the preset). */
  get effectiveHps(): number { return this.governor.effectiveHps; }

  /** Manual step: advances to (and through) the next monthly boundary, as before CLOCK-01. */
  stepOnce() {
    if (!this.st || this.busy || campaignFinished(this.st)) return;
    if (stepMonth(this.st)) {
      this.pace = resetPace();
      this.emit();
    }
  }
  /** Manual step of exactly one in-game day (24 canonical hours). */
  stepDay() {
    if (!this.st || this.busy || campaignFinished(this.st)) return;
    const r = advanceHours(this.st, 24);
    if (r.hours > 0) {
      if (campaignFinished(this.st)) { this.paused = true; this.stop(); }
      this.pace = resetPace();
      this.emit();
    }
  }

  /**
   * One animation-frame clock callback (exposed for deterministic tests). Credits real time at the
   * effective rate, processes owed hours within the frame budget, feeds the governor and emits.
   */
  tickFrame(t: number) {
    if (!this.st || this.paused || this.busy) { this.last = t; return; }
    const elapsed = t - this.last;
    this.last = t;
    const rate = this.governor.effectiveHps;
    const droppedBefore = this.pace.droppedRealMs;
    this.pace = creditElapsed(this.pace, elapsed, rate);
    let simMs = 0; let saturated = false; let hours = 0; let months = 0;
    if (this.pace.backlogHours > 0) {
      const a = nowMs(); const deadline = a + SIM_FRAME_BUDGET_MS;
      const r = advanceHours(this.st, this.pace.backlogHours, () => nowMs() >= deadline);
      simMs = nowMs() - a; hours = r.hours; months = r.monthlyBoundaries;
      this.pace = consumeBacklog(this.pace, r.hours);
      saturated = r.stop === 'yield' && this.pace.backlogHours > 0;
      if (r.stop === 'campaign_end' && campaignFinished(this.st)) {
        this.paused = true; this.stop(); this.pace = resetPace(); this.emit(); return;
      }
    }
    const before = { hps: this.governor.effectiveHps, status: this.governor.status };
    observeFrame(this.governor, { realMs: elapsed, simMs, saturated, droppedRealMs: this.pace.droppedRealMs - droppedBefore });
    const paceChanged = before.hps !== this.governor.effectiveHps || before.status !== this.governor.status;
    if (paceChanged && this.pace.backlogHours > maxBacklogHours(this.governor.effectiveHps)) {
      this.pace = { ...this.pace, backlogHours: maxBacklogHours(this.governor.effectiveHps) };
    }
    if (months > 0 || paceChanged || (hours > 0 && t - this.lastEmit >= UI_EMIT_INTERVAL_MS)) {
      this.lastEmit = t;
      this.emit();
    }
  }

  private start() {
    if (campaignFinished(this.st)) { this.paused = true; this.stop(); return; }
    if (this.raf) return;
    this.last = nowMs(); this.pace = resetPace();
    const loop = (t: number) => {
      this.raf = requestAnimationFrame(loop);
      this.tickFrame(t);
    };
    this.raf = requestAnimationFrame(loop);
  }
  private stop() { if (this.raf) cancelAnimationFrame(this.raf); this.raf = 0; }
}

export const game = new GameController();
