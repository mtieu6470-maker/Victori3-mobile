// GameController: owns the authoritative GameState in the client, runs the monthly tick loop and routes
// player commands through the engine's own `execute` (the same functions the AI uses). The UI never edits state.
import { createGame } from '../../engine/init';
import { stepMonth } from '../../engine/simulation';
import { execute, type Command } from '../../engine/commands';
import { serialize, deserialize } from '../../engine/save';
import type { GameMode, GameState } from '../../engine/types';

export type Speed = 1 | 2 | 3 | 4 | 5;
/** Milliseconds of real time per game month at each speed (speed 5 = as fast as the device allows). */
export const SPEED_MS: Record<Speed, number> = { 1: 2000, 2: 1000, 3: 500, 4: 220, 5: 0 };

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
  private raf = 0; private last = 0; private acc = 0; private toastId = 0;

  subscribe(fn: () => void) { this.listeners.add(fn); return () => { this.listeners.delete(fn); }; }
  emit() { this.version++; for (const fn of this.listeners) fn(); }

  newGame(opts: { mode: GameMode; seed: number; player: string | null }) {
    this.stop();
    this.st = createGame(opts);
    this.paused = true; this.readLogCount = this.st.log.length;
    this.emit();
  }
  /** Simulates `months` months before handing control to the player (yields to the browser between chunks). */
  async fastForward(months: number) {
    if (!this.st || months <= 0) return;
    this.busy = { label: 'Đang mô phỏng', done: 0, total: months }; this.emit();
    for (let i = 0; i < months; i++) {
      stepMonth(this.st);
      if (i % 6 === 5) { this.busy.done = i + 1; this.emit(); await new Promise((r) => setTimeout(r, 0)); }
    }
    this.busy = null; this.readLogCount = this.st.log.length; this.emit();
  }
  load(text: string) {
    const st = deserialize(text); // throws on foreign files; caller shows the error
    this.stop(); this.st = st; this.paused = true; this.readLogCount = st.log.length; this.emit();
  }
  save(): string { if (!this.st) throw new Error('Không có ván chơi'); return serialize(this.st); }

  command(cmd: Command): { ok: boolean; reason?: string } {
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
  setPaused(p: boolean) { this.paused = p; if (p) this.stop(); else this.start(); this.emit(); }
  setSpeed(s: Speed) { this.speed = s; this.emit(); }
  stepOnce() { if (this.st) { stepMonth(this.st); this.emit(); } }
  private start() {
    if (this.raf) return;
    this.last = performance.now(); this.acc = 0;
    const loop = (t: number) => {
      this.raf = requestAnimationFrame(loop);
      if (!this.st || this.paused) return;
      this.acc += t - this.last; this.last = t;
      const need = SPEED_MS[this.speed];
      if (this.acc >= need) {
        this.acc = need === 0 ? 0 : Math.min(this.acc - need, need);
        stepMonth(this.st);
        this.emit();
      }
    };
    this.raf = requestAnimationFrame(loop);
  }
  private stop() { if (this.raf) cancelAnimationFrame(this.raf); this.raf = 0; }
}

export const game = new GameController();
