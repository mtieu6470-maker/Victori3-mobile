// GameController (CLOCK-02): paces the hourly-canonical clock and talks to the simulation through a
// SimHost — a Web Worker in the app, an in-process host in tests/fallback. The authoritative
// GameState lives only in the host's SimCore; `st` here is a read-only copy for the UI.
//
// - Real-time pacing: AUTO targets 12 in-game hours per real second and visibly falls back to 6h/s
//   under sustained measured load (engine/clock/governor.ts); fixed presets 3/6/12/24/48 h/s. Every
//   owed hour is processed in order by the engine — pacing never skips an hour (CG11-02).
// - At most one live `advance` request is in flight (backpressure); owed hours wait in the pace
//   backlog. The worker reports how long it simulated; that feeds the governor.
// - Between monthly boundaries only `clock.hour` changes, so the UI copy is patched in place (state
//   identity and tick-keyed caches stay valid); a full snapshot arrives after a monthly boundary,
//   command, month step, load or new game.
// - Commands, saving, loading and stepping are asynchronous round trips; commands are applied in the
//   order sent, interleaved with simulated hours in that same order.
// - newGame/load start a new protocol generation; responses from an older generation are ignored.
import type { Command } from '../../engine/commands';
import { campaignMonthsRemaining } from '../../engine/core';
import { isClockComplete, monthStartHour, CAMPAIGN_FINAL_HOUR } from '../../engine/clock/calendar';
import {
  consumeBacklog, creditElapsed, DEFAULT_SPEED, parseSpeedSetting, resetPace,
  speedSettingsEqual, type PaceState, type SpeedSetting,
} from '../../engine/clock/pace';
import { createGovernor, observeFrame, type GovernorState } from '../../engine/clock/governor';
import type { SimRequest, SimResponse } from '../../engine/runtime/simCore';
import type { GameMode, GameState } from '../../engine/types';
import { createSimHost, type SimHost } from './simHost';

/** Simulation wall-time budget of one live `advance` request (checked between hours in the host). */
export const SIM_FRAME_BUDGET_MS = 8;
/** UI notifications are throttled to this interval unless a monthly boundary was crossed. */
export const UI_EMIT_INTERVAL_MS = 250;
/** Fast-forward wall-time budget per chunk before yielding (checked between hours in the host). */
export const FAST_FORWARD_CHUNK_MS = 12;
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
const macrotask = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

/** True when the canonical clock has reached the final playable hour (2026-12-31T23:00). */
export function campaignFinished(st: GameState | null): boolean {
  return !!st && isClockComplete(st.clock?.hour);
}

export interface Toast { id: number; text: string; kind: 'ok' | 'error' | 'info' }
type CommandResult = { ok: boolean; reason?: string };

export class GameController {
  /** Read-only copy of the authoritative state held by the simulation host. */
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
  readonly host: SimHost;
  private listeners = new Set<() => void>();
  private clockListeners = new Set<() => void>();
  /** Bumps on every clock-only change (hour advanced between snapshots). */
  clockVersion = 0;
  private raf = 0; private last = 0; private toastId = 0; private operationToken = 0; private lastEmit = 0;
  private toastTimers = new Set<ReturnType<typeof setTimeout>>();
  /** Accepted protocol generation (matches the host after a successful newGame/load). */
  private gen = 0;
  private genCounter = 0;
  private inflight: Promise<void> | null = null;
  private frameSim = { ms: 0, saturated: false };

  private readonly onVisibility = () => { if (typeof document !== 'undefined' && document.hidden) this.onBackground(); };
  private disposed = false;

  constructor(host?: SimHost) {
    this.host = host ?? createSimHost();
    // Android/WebView lifecycle: pause when hidden; never run or "catch up" in the background.
    if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
      document.addEventListener('visibilitychange', this.onVisibility);
    }
  }

  /**
   * Pauses the simulation safely when the app is backgrounded, including cancelling an in-progress
   * fast-forward (CG11-01). Resuming is always an explicit player action.
   */
  onBackground() {
    if (this.disposed) return;
    const wasBusy = !!this.busy;
    if (this.paused && !wasBusy) return;
    if (wasBusy) { this.operationToken++; this.busy = null; this.readLogCount = this.st?.log.length ?? this.readLogCount; void this.resync(); }
    this.pausedByLifecycle = true;
    this.paused = true; this.stop(); this.pace = resetPace(); this.emit();
  }

  /**
   * Releases listeners, the RAF loop, toast timers, the simulation host and any pending async
   * operation (CG11-03). Terminal and idempotent: every public entry point is a no-op afterwards.
   */
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.operationToken++; this.busy = null; this.paused = true; this.stop();
    for (const t of this.toastTimers) clearTimeout(t);
    this.toastTimers.clear();
    if (typeof document !== 'undefined' && typeof document.removeEventListener === 'function') {
      document.removeEventListener('visibilitychange', this.onVisibility);
    }
    this.listeners.clear();
    this.clockListeners.clear();
    this.host.dispose();
  }

  get isDisposed() { return this.disposed; }
  subscribe(fn: () => void) {
    if (this.disposed) return () => {};
    this.listeners.add(fn); return () => { this.listeners.delete(fn); };
  }
  emit() { if (this.disposed) return; this.version++; this.clockVersion++; for (const fn of this.listeners) fn(); for (const fn of this.clockListeners) fn(); }
  /**
   * Lightweight channel for clock-only updates (several per second while running). Only the date/time
   * widget subscribes; re-rendering the whole UI for every hour cost ~65 ms per update (CLOCK-02 browser
   * measurement), so hour ticks must not go through emit().
   */
  subscribeClock(fn: () => void) {
    if (this.disposed) return () => {};
    this.clockListeners.add(fn); return () => { this.clockListeners.delete(fn); };
  }
  private emitClock() { if (this.disposed) return; this.clockVersion++; for (const fn of this.clockListeners) fn(); }

  /** Resolves when no live advance request is in flight (tests, and before exclusive operations). */
  async whenIdle(): Promise<void> { while (this.inflight) await this.inflight; }

  private request(req: SimRequest): Promise<SimResponse> { return this.host.request(req); }

  private takeSnapshot(res: SimResponse): boolean {
    if (!res.ok || res.gen !== this.gen) return false;
    if ('snapshot' in res && res.snapshot) { this.st = res.snapshot; return true; }
    if (res.kind === 'advance' && this.st) { this.st.clock.hour = res.hour; return true; }
    return false;
  }

  /** Re-reads the authoritative state (after an interrupted operation). */
  private async resync() {
    if (this.disposed || !this.gen) return;
    const res = await this.request({ kind: 'snapshot', gen: this.gen });
    if (this.takeSnapshot(res)) this.emit();
  }

  async newGame(opts: { mode: GameMode; seed: number; player: string | null }): Promise<void> {
    if (this.disposed) return;
    this.operationToken++; this.busy = null; this.stop(); this.paused = true;
    const gen = ++this.genCounter;
    const res = await this.request({ kind: 'newGame', gen, opts });
    if (this.disposed || gen !== this.genCounter) return; // superseded by a later newGame/load
    if (!res.ok || res.kind !== 'state') throw new Error(res.ok ? 'Unexpected response' : res.error);
    this.gen = gen; this.st = res.snapshot;
    this.resetClockRuntime();
    this.paused = true; this.readLogCount = this.st.log.length;
    this.emit();
  }

  /** Loads a save. Throws (keeping the current game) if the save is invalid. */
  async load(text: string): Promise<void> {
    if (this.disposed) return;
    const gen = ++this.genCounter;
    const res = await this.request({ kind: 'load', gen, text });
    if (this.disposed || gen !== this.genCounter) return;
    if (!res.ok || res.kind !== 'state') throw new Error(res.ok ? 'Unexpected response' : res.error);
    this.operationToken++; this.busy = null; this.stop();
    if (res.meta?.clockPreference) { this.speedSetting = res.meta.clockPreference; writeStoredPreference(this.speedSetting); }
    this.gen = gen; this.st = res.snapshot;
    this.resetClockRuntime(); this.paused = true; this.readLogCount = this.st.log.length; this.emit();
  }

  async save(): Promise<string> {
    if (this.disposed || !this.st || !this.gen) throw new Error('Không có ván chơi');
    const res = await this.request({ kind: 'save', gen: this.gen, meta: { clockPreference: this.speedSetting } });
    if (!res.ok || res.kind !== 'save') throw new Error(res.ok ? 'Unexpected response' : res.error);
    return res.text;
  }

  /**
   * Simulates whole months without racing the live clock. Work is split into hour-granular chunks
   * bounded by FAST_FORWARD_CHUNK_MS in the host, with a yield after every chunk (CG11-04); a monthly
   * boundary is the only indivisible unit. Load, new game and backgrounding invalidate the run.
   */
  async fastForward(months: number): Promise<void> {
    if (this.disposed || !this.st || this.busy || !Number.isSafeInteger(months) || months <= 0) return;
    const monthsToRun0 = Math.min(months, campaignMonthsRemaining(this.st.tick));
    if (monthsToRun0 <= 0) {
      this.paused = true; this.stop(); this.pace = resetPace(); this.emit();
      return;
    }
    const token = ++this.operationToken;
    const wasPaused = this.paused;
    this.stop(); this.paused = true; this.pace = resetPace();
    this.busy = { label: 'Đang mô phỏng', done: 0, total: monthsToRun0 }; this.emit();
    try {
      await this.whenIdle(); // the live clock may still have one advance in flight
      if (token !== this.operationToken || !this.st) return;
      const startTick = this.st.tick;
      const targetTick = startTick + Math.min(months, campaignMonthsRemaining(startTick));
      const targetHour = Math.min(monthStartHour(targetTick), CAMPAIGN_FINAL_HOUR);
      let hour = this.st.clock.hour; let tick = startTick;
      if (this.busy) this.busy.total = targetTick - startTick;
      while (tick < targetTick) {
        const res = await this.request({ kind: 'advance', gen: this.gen, maxHours: targetHour - hour, budgetMs: FAST_FORWARD_CHUNK_MS, snapshot: 'never' });
        if (token !== this.operationToken) return;
        if (!res.ok) throw new Error(res.error);
        if (res.kind !== 'advance') throw new Error('Unexpected response');
        hour = res.hour; tick = res.tick;
        if (this.busy) this.busy.done = tick - startTick;
        this.emit();
        if (res.hours === 0 || res.stop === 'campaign_end' || tick >= targetTick) break;
        await macrotask();
        if (token !== this.operationToken) return;
      }
    } finally {
      // A load/new-game/background invalidates this operation; its finally block must not
      // overwrite the replacement state's paused/busy flags or auto-resume.
      if (token === this.operationToken && !this.disposed) {
        const res = await this.request({ kind: 'snapshot', gen: this.gen });
        this.takeSnapshot(res);
        if (token === this.operationToken) {
          this.busy = null;
          if (this.st) this.readLogCount = this.st.log.length;
          this.paused = campaignFinished(this.st) ? true : wasPaused;
          if (!this.paused) this.start();
          this.emit();
        }
      }
    }
  }

  /** AUTO never inherits a previous device's/session's transient load: start at 12h/s and re-measure. */
  private resetClockRuntime() {
    this.governor = createGovernor(this.speedSetting);
    this.pace = resetPace();
    this.pausedByLifecycle = false;
    this.frameSim = { ms: 0, saturated: false };
  }

  async command(cmd: Command): Promise<CommandResult> {
    if (this.disposed) return { ok: false, reason: 'Bộ điều khiển đã đóng' };
    if (this.busy) return { ok: false, reason: 'Đang mô phỏng, vui lòng chờ' };
    if (!this.st || !this.gen) return { ok: false, reason: 'Không có ván chơi' };
    const res = await this.request({ kind: 'command', gen: this.gen, cmd });
    if (!res.ok) return { ok: false, reason: res.stale ? 'Ván chơi đã thay đổi' : res.error };
    if (res.kind !== 'command') return { ok: false, reason: 'Unexpected response' };
    if (this.takeSnapshot(res)) this.emit();
    return res.result;
  }
  toast(text: string, kind: Toast['kind'] = 'info') {
    if (this.disposed) return;
    const t = { id: ++this.toastId, text, kind }; this.toasts = [...this.toasts, t]; this.emit();
    const timer = setTimeout(() => { this.toastTimers.delete(timer); this.toasts = this.toasts.filter((x) => x.id !== t.id); this.emit(); }, 3800);
    this.toastTimers.add(timer);
  }

  // ---------------------------------------------------------------- time
  setPaused(p: boolean) {
    if (this.disposed || this.busy) return;
    if (!p && campaignFinished(this.st)) {
      this.paused = true; this.stop(); this.pace = resetPace(); this.emit();
      return;
    }
    this.pausedByLifecycle = false;
    this.paused = p; if (p) { this.stop(); this.pace = resetPace(); } else this.start(); this.emit();
  }
  setSpeedSetting(s: SpeedSetting) {
    if (this.disposed) return;
    const next = parseSpeedSetting(s);
    if (speedSettingsEqual(next, this.speedSetting)) return;
    this.speedSetting = next;
    writeStoredPreference(next);
    this.governor = createGovernor(next);
    // Owed hours are preserved across rate changes (CG11-02); only new credit is bounded.
    this.last = nowMs();
    this.emit();
  }
  /** Effective game-hours per real second right now (AUTO: 12 or 6; fixed: the preset). */
  get effectiveHps(): number { return this.governor.effectiveHps; }

  /** Manual step: advances to (and through) the next monthly boundary. */
  async stepOnce(): Promise<void> {
    if (this.disposed || !this.st || this.busy || campaignFinished(this.st)) return;
    await this.whenIdle();
    const res = await this.request({ kind: 'stepMonth', gen: this.gen });
    if (res.ok && res.kind === 'stepMonth' && res.stepped && this.takeSnapshot(res)) { this.pace = resetPace(); this.emit(); }
  }
  /** Manual step of exactly one in-game day (24 canonical hours). */
  async stepDay(): Promise<void> {
    if (this.disposed || !this.st || this.busy || campaignFinished(this.st)) return;
    await this.whenIdle();
    const res = await this.request({ kind: 'advance', gen: this.gen, maxHours: 24, budgetMs: Number.MAX_SAFE_INTEGER });
    if (res.ok && res.kind === 'advance' && res.hours > 0 && this.takeSnapshot(res)) {
      if (campaignFinished(this.st)) { this.paused = true; this.stop(); }
      this.pace = resetPace();
      this.emit();
    }
  }

  /** Sends one live advance request for the owed backlog (at most one in flight: backpressure). */
  private sendAdvance() {
    const gen = this.gen;
    this.inflight = this.request({ kind: 'advance', gen, maxHours: this.pace.backlogHours, budgetMs: SIM_FRAME_BUDGET_MS }).then((res) => {
      this.inflight = null;
      if (this.disposed || gen !== this.gen) return;
      if (!res.ok) { if (!res.stale) { this.paused = true; this.stop(); this.toast(`Lỗi mô phỏng: ${res.error}`, 'error'); } return; }
      if (res.kind !== 'advance') return;
      this.pace = consumeBacklog(this.pace, res.hours);
      this.frameSim.ms += res.simMs;
      if (res.stop === 'yield' && this.pace.backlogHours > 0) this.frameSim.saturated = true;
      this.takeSnapshot(res);
      if (res.stop === 'campaign_end' && campaignFinished(this.st)) {
        this.paused = true; this.stop(); this.pace = resetPace(); this.emit(); return;
      }
      if (res.monthlyBoundaries > 0) { this.lastEmit = nowMs(); this.emit(); return; }
      const t = nowMs();
      if (res.hours > 0 && t - this.lastEmit >= UI_EMIT_INTERVAL_MS) { this.lastEmit = t; this.emitClock(); }
    });
  }

  /**
   * One animation-frame clock callback (exposed for deterministic tests). Credits real time at the
   * effective rate, requests owed hours from the host (one request in flight), feeds the governor.
   */
  tickFrame(t: number) {
    if (this.disposed || !this.st || this.paused || this.busy) { this.last = t; return; }
    const elapsed = t - this.last;
    this.last = t;
    const droppedBefore = this.pace.droppedRealMs;
    this.pace = creditElapsed(this.pace, elapsed, this.governor.effectiveHps);
    const { ms: simMs, saturated } = this.frameSim;
    this.frameSim = { ms: 0, saturated: false };
    if (!this.inflight && this.pace.backlogHours > 0) this.sendAdvance();
    const before = { hps: this.governor.effectiveHps, status: this.governor.status };
    observeFrame(this.governor, { realMs: elapsed, simMs, saturated, droppedRealMs: this.pace.droppedRealMs - droppedBefore });
    if (before.hps !== this.governor.effectiveHps || before.status !== this.governor.status) { this.lastEmit = t; this.emit(); }
  }

  private start() {
    if (this.disposed) return; // final resource-allocation boundary (CG12-01)
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
