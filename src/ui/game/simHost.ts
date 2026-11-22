// CLOCK-02 simulation hosts. The controller talks to a SimHost; it never touches the authoritative
// GameState directly.
// - WorkerSimHost: SimCore inside a dedicated Web Worker, so monthly boundaries no longer block the
//   UI thread. Messages are structured-cloned: the UI receives a read-only copy.
// - InlineSimHost: SimCore in-process (Node tests, and the fallback if a Worker cannot start). It
//   clones every snapshot so UI code can never alias or mutate the authoritative state, exactly as
//   with a worker.
import { SimCore, type SimRequest, type SimResponse } from '../../engine/runtime/simCore';

export interface SimHost {
  readonly kind: 'worker' | 'inline';
  request(req: SimRequest): Promise<SimResponse>;
  dispose(): void;
}

const cloneResponse = (r: SimResponse): SimResponse => structuredClone(r);

export class InlineSimHost implements SimHost {
  readonly kind = 'inline' as const;
  readonly core: SimCore;
  private disposed = false;
  constructor(core = new SimCore()) { this.core = core; }
  request(req: SimRequest): Promise<SimResponse> {
    const disposedResponse = (): SimResponse => ({ ok: false, gen: req.gen, error: 'Simulation host disposed', hostFailure: true });
    if (this.disposed) return Promise.resolve(disposedResponse());
    // Resolve asynchronously, like a worker round trip. Re-check disposal when the task runs, so a
    // request queued before dispose() never mutates the core afterwards (CG16-04, worker parity).
    return Promise.resolve().then(() => (this.disposed ? disposedResponse() : cloneResponse(this.core.handle(structuredClone(req)))));
  }
  dispose() { this.disposed = true; }
}

interface Envelope { id: number; req: SimRequest }
interface Reply { id: number; res: SimResponse }

/** Minimal Worker surface used by the host (lets tests inject a fake worker). */
export interface WorkerLike {
  onmessage: ((e: MessageEvent) => void) | null;
  onerror: ((e: ErrorEvent) => void) | null;
  onmessageerror: ((e: MessageEvent) => void) | null;
  postMessage(message: unknown): void;
  terminate(): void;
}

/**
 * Upper bound for one request before the worker is declared hung (CG16-03). Generous on purpose:
 * a monthly boundary or loading a large save on a slow phone must not trip it. Recalibrate from
 * Android benchmarks (CLOCK-BENCH-ANDROID).
 */
export const WORKER_REQUEST_TIMEOUT_MS = 30_000;

export class WorkerSimHost implements SimHost {
  readonly kind = 'worker' as const;
  private nextId = 0;
  private pending = new Map<number, { resolve: (r: SimResponse) => void; timer: ReturnType<typeof setTimeout> | null; gen: number }>();
  private failed: string | null = null;
  constructor(private readonly worker: WorkerLike, private readonly timeoutMs = WORKER_REQUEST_TIMEOUT_MS) {
    worker.onmessage = (e: MessageEvent) => {
      const data = e.data as Partial<Reply> | null;
      if (!data || typeof data.id !== 'number' || !data.res || typeof data.res !== 'object') {
        this.fail('Simulation worker sent a malformed message');
        return;
      }
      const p = this.pending.get(data.id);
      if (!p) return;
      this.pending.delete(data.id);
      if (p.timer) clearTimeout(p.timer);
      p.resolve(data.res);
    };
    worker.onerror = (e) => { this.fail(e?.message || 'Simulation worker error'); };
    worker.onmessageerror = () => { this.fail('Simulation worker message could not be decoded'); };
  }
  get isFailed() { return this.failed !== null; }
  /** Terminal: settles every pending request with a host-failure response (CG16-01). */
  private fail(msg: string) {
    if (this.failed === null) this.failed = msg;
    for (const [id, p] of this.pending) {
      this.pending.delete(id);
      if (p.timer) clearTimeout(p.timer);
      p.resolve({ ok: false, gen: p.gen, error: msg, hostFailure: true });
    }
    try { this.worker.terminate(); } catch { /* already gone */ }
  }
  request(req: SimRequest): Promise<SimResponse> {
    if (this.failed) return Promise.resolve({ ok: false, gen: req.gen, error: this.failed, hostFailure: true });
    const id = ++this.nextId;
    return new Promise((resolve) => {
      const timer = this.timeoutMs > 0 ? setTimeout(() => this.fail(`Simulation worker did not answer within ${this.timeoutMs} ms`), this.timeoutMs) : null;
      this.pending.set(id, { resolve, timer, gen: req.gen });
      try {
        this.worker.postMessage({ id, req } satisfies Envelope);
      } catch (e) {
        // e.g. DataCloneError: never leave the promise pending or reject it (CG16-02).
        this.pending.delete(id);
        if (timer) clearTimeout(timer);
        resolve({ ok: false, gen: req.gen, error: `Could not send request to the simulation worker: ${e instanceof Error ? e.message : String(e)}` });
      }
    });
  }
  dispose() { this.fail('Simulation host disposed'); }
}

/** Uses a Worker when the platform supports it; otherwise (or if construction fails) the inline host. */
export function createSimHost(): SimHost {
  if (typeof Worker !== 'undefined' && typeof window !== 'undefined') {
    try {
      return new WorkerSimHost(new Worker(new URL('./sim.worker.ts', import.meta.url), { type: 'module' }) as unknown as WorkerLike);
    } catch { /* fall back below */ }
  }
  return new InlineSimHost();
}
