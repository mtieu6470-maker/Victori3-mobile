// GameController: owns the authoritative GameState in the client, runs the monthly tick loop and routes
// player commands through the engine's own `execute` (the same functions the AI uses). The UI never edits state.
import { createGame } from '../../engine/init';
import { stepDay, stepMonth, isGameOver, GAME_END_YEAR } from '../../engine/simulation';
import { execute, type Command } from '../../engine/commands';
import { serialize, deserialize } from '../../engine/save';
import type { GameMode, GameState } from '../../engine/types';

export type Speed = 1 | 2 | 3 | 4 | 5;
/** Real milliseconds per Gregorian game day; speed 5 is capped at 0.5 game-day/second. */
export const DAY_INTERVAL_MS: Record<Speed, number> = { 1: 10000, 2: 6000, 3: 4000, 4: 3000, 5: 2000 };

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
  private timer: ReturnType<typeof setTimeout> | null = null; private toastId = 0;

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
    for (let i = 0; i < months && !isGameOver(this.st); i++) {
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
    if (isGameOver(this.st)) return { ok: false, reason: `Chiến dịch đã kết thúc ở ${GAME_END_YEAR}.` };
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
    if (!p && this.st && isGameOver(this.st)) {
      this.paused = true;
      this.stop();
      this.toast(this.st.date.y > GAME_END_YEAR
        ? `Bản lưu này đã vượt khung chiến dịch ${GAME_END_YEAR}; hãy bắt đầu ván mới để chơi theo niên đại chuẩn.`
        : `Chiến dịch 1836–${GAME_END_YEAR} đã kết thúc.`, 'info');
      return;
    }
    this.paused = p;
    if (p) this.stop(); else this.start();
    this.emit();
  }
  setSpeed(s: Speed) {
    this.speed = s;
    if (!this.paused) { this.stop(); this.start(); }
    this.emit();
  }
  stepOnce() { if (this.st && !isGameOver(this.st)) { stepDay(this.st); this.emit(); } }
  private start() {
    if (this.timer !== null || this.paused || !this.st) return;
    this.scheduleNextDay();
  }
  /** The simulation clock is timer-driven, never frame-driven; late callbacks slow the game rather than catch up in a burst. */
  private scheduleNextDay() {
    if (this.timer !== null || this.paused || !this.st) return;
    this.timer = setTimeout(() => {
      this.timer = null;
      if (!this.st || this.paused) return;
      stepDay(this.st);
      if (isGameOver(this.st)) {
        this.paused = true;
        this.stop();
        this.emit();
        this.toast(this.st.date.y > GAME_END_YEAR
          ? `Bản lưu đã vượt khung chiến dịch ${GAME_END_YEAR}; hãy tạo ván mới.`
          : `Chiến dịch 1836–${GAME_END_YEAR} đã kết thúc.`, 'info');
        return;
      }
      this.emit();
      this.scheduleNextDay();
    }, DAY_INTERVAL_MS[this.speed]);
  }
  private stop() {
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
  }
}

export const game = new GameController();
