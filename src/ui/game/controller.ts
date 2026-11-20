// GameController owns the authoritative GameState and advances the shared monthly engine.
// Wall-clock scheduling is deliberately independent from rendering/RAF.
import { createGame } from '../../engine/init';
import { stepMonth, isGameOver, GAME_END_YEAR } from '../../engine/simulation';
import { execute, type Command } from '../../engine/commands';
import { serialize, deserialize } from '../../engine/save';
import {
  SIMULATION_CLOCK_PULSE_MS,
  SimulationPacer,
  type SimulationSpeed,
} from '../../engine/clock';
import type { GameMode, GameState } from '../../engine/types';

export type Speed = SimulationSpeed;

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
  private scheduler: ReturnType<typeof setInterval> | null = null;
  private readonly pacer = new SimulationPacer();
  private toastId = 0;

  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => { this.listeners.delete(fn); };
  }

  emit() {
    this.version++;
    for (const fn of this.listeners) fn();
  }

  newGame(opts: { mode: GameMode; seed: number; player: string | null }) {
    this.stop();
    this.pacer.reset();
    this.st = createGame(opts);
    this.paused = true;
    this.readLogCount = this.st.log.length;
    this.emit();
  }

  /** Simulates months before handing control to the player (yields between chunks). */
  async fastForward(months: number) {
    if (!this.st || months <= 0) return;

    const wasRunning = this.scheduler !== null && !this.paused;
    if (wasRunning) this.stop();
    this.pacer.reset();

    this.busy = { label: 'Đang mô phỏng', done: 0, total: months };
    this.emit();
    try {
      for (let i = 0; i < months && !isGameOver(this.st); i++) {
        stepMonth(this.st);
        if (i % 6 === 5) {
          this.busy.done = i + 1;
          this.emit();
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }
    } finally {
      this.pacer.reset();
      this.busy = null;
      this.readLogCount = this.st.log.length;
      this.emit();
      if (wasRunning && this.st && !isGameOver(this.st)) this.start();
    }
  }

  load(text: string) {
    const st = deserialize(text); // throws on foreign files; caller shows the error
    this.stop();
    this.pacer.reset();
    this.st = st;
    this.paused = true;
    this.readLogCount = st.log.length;
    this.emit();
  }

  save(): string {
    if (!this.st) throw new Error('Không có ván chơi');
    return serialize(this.st);
  }

  command(cmd: Command): { ok: boolean; reason?: string } {
    if (!this.st) return { ok: false, reason: 'Không có ván chơi' };
    if (isGameOver(this.st)) return { ok: false, reason: \`Chiến dịch đã kết thúc ở \${GAME_END_YEAR}.\` };
    const result = execute(this.st, cmd);
    this.emit();
    return result;
  }

  toast(text: string, kind: Toast['kind'] = 'info') {
    const toast = { id: ++this.toastId, text, kind };
    this.toasts = [...this.toasts, toast];
    this.emit();
    setTimeout(() => {
      this.toasts = this.toasts.filter((item) => item.id !== toast.id);
      this.emit();
    }, 3800);
  }

  // ---------------------------------------------------------------- time

  setPaused(paused: boolean) {
    if (!paused && this.st && isGameOver(this.st)) {
      this.paused = true;
      this.stop();
      this.toast(this.st.date.y > GAME_END_YEAR
        ? \`Bản lưu này đã vượt khung chiến dịch \${GAME_END_YEAR}; hãy bắt đầu ván mới để chơi theo niên đại chuẩn.\`
        : \`Chiến dịch 1836–\${GAME_END_YEAR} đã kết thúc.\`, 'info');
      return;
    }

    this.paused = paused;
    if (paused) this.stop();
    else this.start();
    this.emit();
  }

  setSpeed(speed: Speed) {
    // Account for elapsed time at the old rate before changing to the new rate.
    if (this.scheduler !== null && !this.paused) {
      this.pacer.advance(performance.now(), this.speed);
    }
    this.speed = speed;
    this.emit();
  }

  stepOnce() {
    if (!this.st || isGameOver(this.st)) return;
    this.pacer.reset(); // a manual month step must not carry fractional real-time progress
    stepMonth(this.st);
    this.emit();
  }

  private start() {
    if (this.scheduler !== null || !this.st || this.paused) return;

    // A fresh monotonic baseline prevents background/paused time from being accrued.
    this.pacer.resume(performance.now());
    this.scheduler = setInterval(() => this.pulse(), SIMULATION_CLOCK_PULSE_MS);
  }

  private pulse() {
    const state = this.st;
    if (!state || this.paused || this.scheduler === null) return;

    this.pacer.advance(performance.now(), this.speed);
    if (!this.pacer.consumeMonth(state.date.y, state.date.m)) return;

    // Keep the established monthly simulation/save semantics. No partial month is
    // exposed as a saved GameDate, and the whole monthly pipeline runs only once.
    stepMonth(state);

    if (isGameOver(state)) {
      this.paused = true;
      this.stop();
      this.emit();
      this.toast(state.date.y > GAME_END_YEAR
        ? \`Bản lưu đã vượt khung chiến dịch \${GAME_END_YEAR}; hãy tạo ván mới.\`
        : \`Chiến dịch 1836–\${GAME_END_YEAR} đã kết thúc.\`, 'info');
      return;
    }

    this.emit();
  }

  private stop() {
    if (this.scheduler !== null) {
      clearInterval(this.scheduler);
      this.scheduler = null;
    }
    // Preserve earned fraction; resume() starts from a fresh timestamp.
    this.pacer.pause();
  }
}

export const game = new GameController();
