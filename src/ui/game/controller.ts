// GameController owns the authoritative GameState and advances fixed six-hour logical steps.
// Wall-clock scheduling is deliberately independent from rendering/RAF.
import { createGame } from '../../engine/init';
import { stepSixHour, stepMonth, isGameOver, GAME_END_YEAR } from '../../engine/simulation';
import { execute, type Command } from '../../engine/commands';
import { serialize, deserialize } from '../../engine/save';
import { SIMULATION_CLOCK_PULSE_MS, SimulationPacer, type SimulationSpeed } from '../../engine/clock';
import type { GameMode, GameState } from '../../engine/types';

export type Speed = SimulationSpeed;
export interface Toast { id: number; text: string; kind: 'ok' | 'error' | 'info' }

export class GameController {
  st: GameState | null = null;
  version = 0;
  paused = true;
  speed: Speed = 2;
  busy: { label: string; done: number; total: number } | null = null;
  toasts: Toast[] = [];
  readLogCount = 0;
  private listeners = new Set<() => void>();
  private scheduler: ReturnType<typeof setInterval> | null = null;
  private readonly pacer = new SimulationPacer();
  private toastId = 0;

  subscribe(fn: () => void) { this.listeners.add(fn); return () => { this.listeners.delete(fn); }; }
  emit() { this.version++; for (const fn of this.listeners) fn(); }

  newGame(opts: { mode: GameMode; seed: number; player: string | null }) {
    this.stop(); this.pacer.reset(); this.st = createGame(opts); this.paused = true;
    this.readLogCount = this.st.log.length; this.emit();
  }

  /** Whole-month helper for setup/benchmark flows; normal play uses the six-hour calendar. */
  async fastForward(months: number) {
    if (!this.st || months <= 0) return;
    const wasRunning = this.scheduler !== null && !this.paused;
    if (wasRunning) this.stop();
    this.pacer.reset(); this.busy = { label: 'Đang mô phỏng', done: 0, total: months }; this.emit();
    try {
      for (let i = 0; i < months && !isGameOver(this.st); i++) {
        stepMonth(this.st);
        if (i % 6 === 5) { this.busy.done = i + 1; this.emit(); await new Promise((resolve) => setTimeout(resolve, 0)); }
      }
    } finally {
      this.pacer.reset(); this.busy = null; this.readLogCount = this.st.log.length; this.emit();
      if (wasRunning && this.st && !isGameOver(this.st)) this.start();
    }
  }

  load(text: string) {
    const st = deserialize(text);
    this.stop(); this.pacer.reset(); this.st = st; this.paused = true;
    this.readLogCount = st.log.length; this.emit();
  }

  save(): string {
    if (!this.st) throw new Error('Không có ván chơi');
    if (this.scheduler !== null && !this.paused) this.pacer.advance(performance.now(), this.speed);
    this.pacer.clearProgress();
    return serialize(this.st);
  }

  command(cmd: Command): { ok: boolean; reason?: string } {
    if (!this.st) return { ok: false, reason: 'Không có ván chơi' };
    if (isGameOver(this.st)) return { ok: false, reason: `Chiến dịch đã kết thúc ở ${GAME_END_YEAR}.` };
    const result = execute(this.st, cmd); this.emit(); return result;
  }

  toast(text: string, kind: Toast['kind'] = 'info') {
    const toast = { id: ++this.toastId, text, kind }; this.toasts = [...this.toasts, toast]; this.emit();
    setTimeout(() => { this.toasts = this.toasts.filter((item) => item.id !== toast.id); this.emit(); }, 3800);
  }

  setPaused(paused: boolean) {
    if (!paused && this.st && isGameOver(this.st)) {
      this.paused = true; this.stop();
      this.toast(`Chiến dịch đã hoàn tất đến hết ngày 31/12/${GAME_END_YEAR}.`, 'info');
      return;
    }
    this.paused = paused;
    if (paused) this.stop(); else this.start();
    this.emit();
  }

  setSpeed(speed: Speed) {
    if (this.scheduler !== null && !this.paused) this.pacer.advance(performance.now(), this.speed);
    this.speed = speed; this.emit();
  }

  /** Manual stepping advances exactly one deterministic six-hour logical step. */
  stepOnce() {
    if (!this.st || isGameOver(this.st)) return;
    this.pacer.reset(); stepSixHour(this.st);
    if (isGameOver(this.st)) { this.paused = true; this.stop(); }
    this.emit();
  }

  private start() {
    if (this.scheduler !== null || !this.st || this.paused) return;
    this.pacer.resume(performance.now());
    this.scheduler = setInterval(() => this.pulse(), SIMULATION_CLOCK_PULSE_MS);
  }

  private pulse() {
    const state = this.st;
    if (!state || this.paused || this.scheduler === null) return;
    this.pacer.advance(performance.now(), this.speed);
    let advanced = false;
    while (this.pacer.consumeSixHourStep()) {
      if (!stepSixHour(state)) break;
      advanced = true;
      if (isGameOver(state)) {
        this.paused = true; this.stop(); this.emit();
        this.toast(`Chiến dịch 1836–${GAME_END_YEAR} đã xử lý xong ngày cuối cùng.`, 'info');
        return;
      }
    }
    if (advanced) this.emit();
  }

  private stop() {
    if (this.scheduler !== null) { clearInterval(this.scheduler); this.scheduler = null; }
    this.pacer.pause();
  }
}

export const game = new GameController();