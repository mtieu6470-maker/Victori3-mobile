// CLOCK-02 simulation core: the single owner of the authoritative GameState. Pure and DOM-free so it
// runs identically inside a Web Worker (sim.worker.ts) and in-process (InlineSimHost: tests and the
// fallback when workers are unavailable).
//
// Protocol rules:
// - Every request carries `gen`. newGame/load start a new generation; any other request whose `gen`
//   differs from the core's current generation is rejected as stale (never touches the new game).
// - Requests are processed strictly in arrival order; the order of commands relative to simulated
//   hours is therefore the order the UI sent them.
// - Responses include a full state snapshot only when the state changed beyond the clock: after
//   newGame/load, a monthly boundary, a command or a month step. Between monthly boundaries only the
//   canonical hour changes (no hourly/daily systems exist yet), so the UI patches `clock.hour`.
import { createGame } from '../init';
import { advanceHours, stepMonth } from '../simulation';
import { execute, type Command } from '../commands';
import { deserializeWithMeta, serialize, type SaveMeta } from '../save';
import type { GameMode, GameState } from '../types';
import type { AdvanceStop } from '../simulation';

export type SimRequest =
  | { kind: 'newGame'; gen: number; opts: { mode: GameMode; seed: number; player: string | null } }
  | { kind: 'load'; gen: number; text: string }
  | { kind: 'advance'; gen: number; maxHours: number; budgetMs: number; snapshot?: 'on_change' | 'never' }
  | { kind: 'snapshot'; gen: number }
  | { kind: 'stepMonth'; gen: number }
  | { kind: 'command'; gen: number; cmd: Command }
  | { kind: 'save'; gen: number; meta: SaveMeta };

export type SimResponse =
  | { ok: false; gen: number; error: string; stale?: boolean; /** The host itself failed (worker crash, timeout, unclonable message); its state is unreachable. */ hostFailure?: boolean }
  | { ok: true; gen: number; kind: 'state'; snapshot: GameState; meta?: SaveMeta }
  | { ok: true; gen: number; kind: 'advance'; hours: number; monthlyBoundaries: number; stop: AdvanceStop; simMs: number; hour: number; tick: number; snapshot?: GameState }
  | { ok: true; gen: number; kind: 'stepMonth'; stepped: boolean; snapshot: GameState }
  | { ok: true; gen: number; kind: 'command'; result: { ok: boolean; reason?: string }; snapshot: GameState }
  | { ok: true; gen: number; kind: 'save'; text: string };

export class SimCore {
  private st: GameState | null = null;
  private gen = 0;

  constructor(private readonly now: () => number = () => (typeof performance !== 'undefined' ? performance.now() : Date.now())) {}

  /** Authoritative state (for tests/diagnostics only; never hand this object to UI code in-process). */
  get state(): GameState | null { return this.st; }

  handle(req: SimRequest): SimResponse {
    try {
      if (req.kind === 'newGame' || req.kind === 'load') {
        if (!Number.isSafeInteger(req.gen) || req.gen <= this.gen) return { ok: false, gen: req.gen, error: 'Stale generation', stale: true };
        if (req.kind === 'newGame') {
          const st = createGame(req.opts);
          this.st = st; this.gen = req.gen;
          return { ok: true, gen: req.gen, kind: 'state', snapshot: st };
        }
        const { state, meta } = deserializeWithMeta(req.text); // throws before replacing anything
        this.st = state; this.gen = req.gen;
        return { ok: true, gen: req.gen, kind: 'state', snapshot: state, meta };
      }
      if (req.gen !== this.gen || !this.st) return { ok: false, gen: req.gen, error: 'Stale generation', stale: true };
      const st = this.st;
      switch (req.kind) {
        case 'advance': {
          const a = this.now();
          const budget = Number.isFinite(req.budgetMs) && req.budgetMs > 0 ? req.budgetMs : 8;
          const deadline = a + budget;
          const r = advanceHours(st, req.maxHours, () => this.now() >= deadline);
          const simMs = this.now() - a;
          return {
            ok: true, gen: req.gen, kind: 'advance', hours: r.hours, monthlyBoundaries: r.monthlyBoundaries, stop: r.stop,
            simMs, hour: st.clock.hour, tick: st.tick,
            snapshot: r.monthlyBoundaries > 0 && req.snapshot !== 'never' ? st : undefined,
          };
        }
        case 'snapshot':
          return { ok: true, gen: req.gen, kind: 'state', snapshot: st };
        case 'stepMonth': {
          const stepped = stepMonth(st);
          return { ok: true, gen: req.gen, kind: 'stepMonth', stepped, snapshot: st };
        }
        case 'command': {
          const result = execute(st, req.cmd);
          return { ok: true, gen: req.gen, kind: 'command', result, snapshot: st };
        }
        case 'save':
          return { ok: true, gen: req.gen, kind: 'save', text: serialize(st, req.meta) };
      }
    } catch (e) {
      return { ok: false, gen: req.gen, error: e instanceof Error ? e.message : String(e) };
    }
  }
}
