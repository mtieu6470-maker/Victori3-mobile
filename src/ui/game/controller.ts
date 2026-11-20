// GameController: owns the authoritative GameState in the client, runs the monthly tick loop and routes
// player commands through the engine's own `execute` (the same functions the AI uses). The UI never edits state.
import { createGame } from '../../engine/init';
import { stepMonth } from '../../engine/simulation';
import { execute, type Command } from '../../engine/commands';
import { serialize, deserialize } from '../../engine/save';
import { campaignMonthsRemaining, isCampaignComplete } from '../../engine/core';
import type { GameMode, GameState } from '../../engine/types';

export type Speed = 1 | 2 | 3 | 4 | 5;
/**
 * Real milliseconds per simulated month. The engine advances in monthly steps,
 * so every speed is deliberately bounded; speed 5 is not a render-frame tick.
 */
export const SPEED_MS: Record<Speed, number> = { 1: 8000, 2: 5000, 3: 3500, 4: 2500, 5: 2000 };

/**
 * Consume wall-clock time without allowing background-tab time to become a
 * burst of catch-up months. At most one deterministic month may be emitted
 * per scheduler callback; excess elapsed time is intentionally discarded.
 */
export function consumeClockElapsed(
  accumulatorMs: number,
  elapsedMs: number,
  intervalMs: number,
): { accumulatorMs: number; shouldStep: boolean } {
  const interval = Number.isFinite(intervalMs) && intervalMs > 0 ? intervalMs : 1;
  const accumulator = Number.isFinite(accumulatorMs) ? Math.max(0, Math.min(accumulatorMs, interval)) : 0;
  const elapsed = Number.isFinite(elapsedMs) ? Math.max(0, Math.min(elapsedMs, interval)) : 0;
  const total = Math.min(interval, accumulator + elapsed);
  if (total >= interval) return { accumulatorMs: 0, shouldStep: true };
  return { accumulatorMs: total, shouldStep: false };
}

export interface Toast { id: number; text: string; kind: 'ok' | 'error' | 'info' }

export class GameController {
  st: GameState | null = null;
  version = 0; // bumps on every change so views can re-render
  paused = true;
  speed: Speed = 2;
  busy: { label: string; done: number; total: number } | null = null;
  toasts: Toast[] = [];
  readLogCount = 0;
  private listeners = new Set<() => void>();
  private raf = 0; private last = 0; private acc = 0; private toastId = 0; private operationToken = 0;

  subscribe(fn: () => void) { this.listeners.add(fn); return () => { this.listeners.delete(fn); }; }
  emit() { this.version++; for (const fn of this.listeners) fn(); }

  newGame(opts: { mode: GameMode; seed: number; player: string | null }) {
    this.operationToken++;
    this.busy = null;
    this.stop();
    this.st = createGame(opts);
    this.paused = true; this.readLogCount = this.st.log.length;
    this.emit();
  }
  /** Simulates whole months in bounded chunks, without racing the live RAF clock. */
  async fastForward(months: number) {
    if (!this.st || this.busy || !Number.isSafeInteger(months) || months <= 0) return;
    const state = this.st;
    const monthsToRun = Math.min(months, campaignMonthsRemaining(state.tick));
    if (monthsToRun <= 0) {
      this.paused = true; this.stop(); this.acc = 0; this.emit();
      return;
    }
    const token = ++this.operationToken;
    const wasPaused = this.paused;
    this.stop(); this.paused = true; this.acc = 0;
    this.busy = { label: 'Đang mô phỏng', done: 0, total: monthsToRun }; this.emit();
    let completed = 0;
    try {
      for (let i = 0; i < monthsToRun; i++) {
        if (token !== this.operationToken || this.st !== state) return;
        stepMonth(state);
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
        this.paused = isCampaignComplete(state.tick) ? true : wasPaused;
        if (!this.paused) this.start();
        this.emit();
      }
    }
  }
  load(text: string) {
    const st = deserialize(text); // throws on foreign files; caller shows the error
    this.operationToken++; this.busy = null;
    this.stop(); this.st = st; this.paused = true; this.acc = 0; this.readLogCount = st.log.length; this.emit();
  }
  save(): string { if (!this.st) throw new Error('Không có ván chơi'); return serialize(this.st); }

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
    if (!p && this.st && isCampaignComplete(this.st.tick)) {
      this.paused = true; this.stop(); this.acc = 0; this.emit();
      return;
    }
    this.paused = p; if (p) this.stop(); else this.start(); this.emit();
  }
  setSpeed(s: Speed) { if (this.speed === s) return; this.speed = s; this.acc = 0; this.last = performance.now(); this.emit(); }
  stepOnce() {
    if (!this.st || this.busy || isCampaignComplete(this.st.tick)) return;
    if (stepMonth(this.st)) {
      if (isCampaignComplete(this.st.tick)) { this.paused = true; this.stop(); this.acc = 0; }
      this.emit();
    }
  }
  private start() {
    if (this.st && isCampaignComplete(this.st.tick)) { this.paused = true; this.stop(); return; }
    if (this.raf) return;
    this.last = performance.now(); this.acc = 0;
    const loop = (t: number) => {
      this.raf = requestAnimationFrame(loop);
      if (!this.st || this.paused) return;
      const elapsed = t - this.last;
      this.last = t;
      const clock = consumeClockElapsed(this.acc, elapsed, SPEED_MS[this.speed]);
      this.acc = clock.accumulatorMs;
      if (clock.shouldStep && stepMonth(this.st)) {
        if (isCampaignComplete(this.st.tick)) { this.paused = true; this.acc = 0; this.stop(); }
        this.emit();
      }
    };
    this.raf = requestAnimationFrame(loop);
  }
  private stop() { if (this.raf) cancelAnimationFrame(this.raf); this.raf = 0; }
}

export const game = new GameController();
