// GameController owns the authoritative GameState and advances six-hour simulation time independently of rendering.
import { createGame } from '../../engine/init';
import { stepSixHours, stepMonth, isGameOver, GAME_END_YEAR } from '../../engine/simulation';
import { execute, type Command } from '../../engine/commands';
import { serialize, deserialize } from '../../engine/save';
import type { GameMode, GameState } from '../../engine/types';

export type Speed = 1 | 2 | 3 | 4 | 5;
/** Real milliseconds per six-hour tick; speed 5 = 0.5 Gregorian game-day per real second. */
export const SIX_HOUR_INTERVAL_MS: Record<Speed, number> = { 1: 2500, 2: 1500, 3: 1000, 4: 750, 5: 500 };

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
  private timer: ReturnType<typeof setTimeout> | null = null;
  private toastId = 0;

  subscribe(fn: () => void) { this.listeners.add(fn); return () => { this.listeners.delete(fn); }; }
  emit() { this.version++; for (const fn of this.listeners) fn(); }
  newGame(opts: { mode: GameMode; seed: number; player: string | null }) {
    this.stop();
    this.st = createGame(opts);
    this.paused = true;
    this.readLogCount = this.st.log.length;
    this.emit();
  }
  async fastForward(months: number) {
    if (!this.st || months <= 0) return;
    this.busy = { label: 'Đang mô phỏng', done: 0, total: months };
    this.emit();
    for (let i = 0; i < months && !isGameOver(this.st); i++) {
      stepMonth(this.st);
      if (i % 6 === 5) {
        this.busy.done = i + 1;
        this.emit();
        await new Promise(r => setTimeout(r, 0));
      }
    }
    this.busy = null;
    this.readLogCount = this.st.log.length;
    this.emit();
  }
  load(text: string) {
    const state = deserialize(text);
    this.stop();
    this.st = state;
    this.paused = true;
    this.readLogCount = state.log.length;
    this.emit();
  }
  save(): string { if (!this.st) throw new Error('Không có ván chơi'); return serialize(this.st); }
  command(cmd: Command): { ok: boolean; reason?: string } {
    if (!this.st) return { ok: false, reason: 'Không có ván chơi' };
    if (isGameOver(this.st)) return { ok: false, reason: 'Chiến dịch đã kết thúc ở ' + GAME_END_YEAR + '.' };
    const result = execute(this.st, cmd);
    this.emit();
    return result;
  }
  toast(text: string, kind: Toast['kind'] = 'info') {
    const toast = { id: ++this.toastId, text, kind };
    this.toasts = [...this.toasts, toast];
    this.emit();
    setTimeout(() => {
      this.toasts = this.toasts.filter(item => item.id !== toast.id);
      this.emit();
    }, 3800);
  }
  setPaused(paused: boolean) {
    if (!paused && this.st && isGameOver(this.st)) {
      this.paused = true;
      this.stop();
      this.toast(this.st.date.y > GAME_END_YEAR
        ? 'Bản lưu này đã vượt khung chiến dịch ' + GAME_END_YEAR + '; hãy bắt đầu ván mới để chơi theo niên đại chuẩn.'
        : 'Chiến dịch 1836–' + GAME_END_YEAR + ' đã kết thúc.', 'info');
      return;
    }
    this.paused = paused;
    if (paused) this.stop(); else this.start();
    this.emit();
  }
  setSpeed(speed: Speed) {
    this.speed = speed;
    if (!this.paused) { this.stop(); this.start(); }
    this.emit();
  }
  stepOnce() {
    if (this.st && !isGameOver(this.st)) {
      stepSixHours(this.st);
      this.emit();
    }
  }
  private start() {
    if (this.timer !== null || this.paused || !this.st) return;
    this.scheduleNextTick();
  }
  /** Delayed callbacks slow the simulation; they never cause an unbounded catch-up burst. */
  private scheduleNextTick() {
    if (this.timer !== null || this.paused || !this.st) return;
    this.timer = setTimeout(() => {
      this.timer = null;
      if (!this.st || this.paused) return;
      stepSixHours(this.st);
      if (isGameOver(this.st)) {
        this.paused = true;
        this.stop();
        this.emit();
        this.toast(this.st.date.y > GAME_END_YEAR
          ? 'Bản lưu này đã vượt khung chiến dịch ' + GAME_END_YEAR + '; hãy tạo ván mới.'
          : 'Chiến dịch 1836–' + GAME_END_YEAR + ' đã kết thúc.', 'info');
        return;
      }
      this.emit();
      this.scheduleNextTick();
    }, SIX_HOUR_INTERVAL_MS[this.speed]);
  }
  private stop() {
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
  }
}

export const game = new GameController();
