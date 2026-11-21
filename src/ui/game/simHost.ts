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
    if (this.disposed) return Promise.resolve({ ok: false, gen: req.gen, error: 'Simulation host disposed' });
    // Resolve asynchronously, like a worker round trip.
    return Promise.resolve().then(() => cloneResponse(this.core.handle(structuredClone(req))));
  }
  dispose() { this.disposed = true; }
}

interface Envelope { id: number; req: SimRequest }
interface Reply { id: number; res: SimResponse }

export class WorkerSimHost implements SimHost {
  readonly kind = 'worker' as const;
  private nextId = 0;
  private pending = new Map<number, (r: SimResponse) => void>();
  private failed: string | null = null;
  constructor(private readonly worker: Worker) {
    worker.onmessage = (e: MessageEvent<Reply>) => {
      const p = this.pending.get(e.data.id);
      if (!p) return;
      this.pending.delete(e.data.id);
      p(e.data.res);
    };
    worker.onerror = (e) => { this.fail(e.message || 'Simulation worker error'); };
    worker.onmessageerror = () => { this.fail('Simulation worker message could not be decoded'); };
  }
  private fail(msg: string) {
    this.failed = msg;
    for (const [id, p] of this.pending) { this.pending.delete(id); p({ ok: false, gen: -1, error: msg }); }
  }
  request(req: SimRequest): Promise<SimResponse> {
    if (this.failed) return Promise.resolve({ ok: false, gen: req.gen, error: this.failed });
    const id = ++this.nextId;
    return new Promise((resolve) => {
      this.pending.set(id, resolve);
      this.worker.postMessage({ id, req } satisfies Envelope);
    });
  }
  dispose() { this.fail('Simulation host disposed'); this.worker.terminate(); }
}

/** Uses a Worker when the platform supports it; otherwise (or if construction fails) the inline host. */
export function createSimHost(): SimHost {
  if (typeof Worker !== 'undefined' && typeof window !== 'undefined') {
    try {
      return new WorkerSimHost(new Worker(new URL('./sim.worker.ts', import.meta.url), { type: 'module' }));
    } catch { /* fall back below */ }
  }
  return new InlineSimHost();
}
