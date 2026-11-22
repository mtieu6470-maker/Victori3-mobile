// CG-16 regression tests: WorkerSimHost failure handling (crash, hang, unclonable request, malformed
// reply), InlineSimHost dispose parity, and controller recovery policy after a worker failure.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { SimCore, type SimRequest, type SimResponse } from '../src/engine/runtime/simCore';
import { InlineSimHost, WorkerSimHost, type SimHost, type WorkerLike } from '../src/ui/game/simHost';
import { GameController } from '../src/ui/game/controller';
import { DAILY_SYSTEMS } from '../src/engine/simulation';

loadNodeData();

/** Worker stand-in running a real SimCore asynchronously, with failure switches. */
class FakeWorker implements WorkerLike {
  onmessage: ((e: MessageEvent) => void) | null = null;
  onerror: ((e: ErrorEvent) => void) | null = null;
  onmessageerror: ((e: MessageEvent) => void) | null = null;
  core = new SimCore(() => 0);
  terminated = false; silent = false; throwOnPost = false; garbage = false;
  postMessage(m: unknown) {
    if (this.throwOnPost) throw new DOMException('could not clone', 'DataCloneError');
    const msg = structuredClone(m) as { id: number; req: SimRequest };
    setTimeout(() => {
      if (this.terminated || this.silent) return;
      const data = this.garbage ? { nonsense: true } : structuredClone({ id: msg.id, res: this.core.handle(msg.req) });
      this.onmessage?.({ data } as MessageEvent);
    }, 0);
  }
  terminate() { this.terminated = true; }
  crash(message = 'boom') { this.onerror?.({ message } as ErrorEvent); }
}

const opts = { mode: 'historical' as const, seed: 5, player: null };

describe('CG-16 WorkerSimHost failure handling', () => {
  it('correlates replies to requests in order', async () => {
    const w = new FakeWorker(); const h = new WorkerSimHost(w, 0);
    const a = h.request({ kind: 'newGame', gen: 1, opts });
    const b = h.request({ kind: 'advance', gen: 1, maxHours: 7, budgetMs: 1e9 });
    const c = h.request({ kind: 'advance', gen: 1, maxHours: 5, budgetMs: 1e9 });
    expect((await a).ok).toBe(true);
    expect(await b).toMatchObject({ ok: true, kind: 'advance', hour: 7 });
    expect(await c).toMatchObject({ ok: true, kind: 'advance', hour: 12 });
  });

  it('CG16-02: an unclonable request resolves as a failure instead of rejecting or hanging', async () => {
    const w = new FakeWorker(); w.throwOnPost = true; const h = new WorkerSimHost(w, 0);
    const r = await h.request({ kind: 'newGame', gen: 1, opts });
    expect(r).toMatchObject({ ok: false });
    expect((r as { error: string }).error).toMatch(/could not clone/);
    w.throwOnPost = false;
    expect((await h.request({ kind: 'newGame', gen: 2, opts })).ok).toBe(true); // host still usable
  });

  it('CG16-01: a crash settles every pending request with hostFailure and the host stays failed', async () => {
    const w = new FakeWorker(); const h = new WorkerSimHost(w, 0);
    await h.request({ kind: 'newGame', gen: 1, opts });
    w.silent = true;
    const pending = h.request({ kind: 'advance', gen: 1, maxHours: 3, budgetMs: 1e9 });
    w.crash('worker exploded');
    expect(await pending).toMatchObject({ ok: false, hostFailure: true, error: 'worker exploded' });
    expect(await h.request({ kind: 'advance', gen: 1, maxHours: 1, budgetMs: 1 })).toMatchObject({ ok: false, hostFailure: true });
    expect(w.terminated).toBe(true);
    expect(h.isFailed).toBe(true);
  });

  it('CG16-03: a hung worker is declared failed after the watchdog timeout', async () => {
    const w = new FakeWorker(); w.silent = true; const h = new WorkerSimHost(w, 30);
    const r = await h.request({ kind: 'newGame', gen: 1, opts });
    expect(r).toMatchObject({ ok: false, hostFailure: true });
    expect((r as { error: string }).error).toMatch(/did not answer within 30 ms/);
  });

  it('a malformed reply fails the host instead of resolving the wrong request', async () => {
    const w = new FakeWorker(); w.garbage = true; const h = new WorkerSimHost(w, 0);
    expect(await h.request({ kind: 'newGame', gen: 1, opts })).toMatchObject({ ok: false, hostFailure: true });
  });

  it('CG18-01: replies with the wrong shape, kind or generation fail the host', async () => {
    for (const bad of [
      (id: number) => ({ id, res: {} }),
      (id: number) => ({ id, res: { ok: true, gen: 99, kind: 'state', snapshot: {} } }),
      (id: number) => ({ id, res: { ok: true, gen: 1, kind: 'save', text: 'x' } }),
      (id: number) => ({ id, res: { ok: true, gen: 1, kind: 'state' } }),
      (id: number) => ({ id, res: { ok: false, gen: 1 } }),
      (id: number) => ({ id, res: { ok: false, gen: 1, error: 'x', stale: 'yes' } }),
      (id: number) => ({ id, res: { ok: true, gen: 1, kind: 'state', snapshot: {} } }),
    ]) {
      const w = new FakeWorker();
      w.postMessage = (m: unknown) => { const id = (m as { id: number }).id; setTimeout(() => w.onmessage?.({ data: bad(id) } as MessageEvent), 0); };
      const h = new WorkerSimHost(w, 0);
      expect(await h.request({ kind: 'newGame', gen: 1, opts })).toMatchObject({ ok: false, hostFailure: true });
      expect(h.isFailed).toBe(true);
    }
  });

  it('CG18-01 follow-up: advance replies with out-of-range numbers or unknown stop fail the host', async () => {
    const good = { ok: true, gen: 1, kind: 'advance', hours: 1, monthlyBoundaries: 0, simMs: 0.1, hour: 1, tick: 0, stop: 'requested' };
    for (const patch of [{ hours: -1 }, { hour: -1 }, { hour: 1.5 }, { tick: -2 }, { stop: 'unknown' }, { monthlyBoundaries: 0.5 }, { simMs: Number.NaN }]) {
      const w = new FakeWorker();
      let first = true;
      w.postMessage = (m: unknown) => {
        const msg = m as { id: number; req: SimRequest };
        setTimeout(() => {
          const res = first ? w.core.handle(msg.req) : { ...good, ...patch };
          first = false;
          w.onmessage?.({ data: structuredClone({ id: msg.id, res }) } as MessageEvent);
        }, 0);
      };
      const h = new WorkerSimHost(w, 0);
      expect((await h.request({ kind: 'newGame', gen: 1, opts })).ok).toBe(true);
      expect(await h.request({ kind: 'advance', gen: 1, maxHours: 1, budgetMs: 1e9 })).toMatchObject({ ok: false, hostFailure: true });
    }
  });

  it('CG16-04: InlineSimHost never touches the core for a request queued before dispose()', async () => {
    const h = new InlineSimHost();
    await h.request({ kind: 'newGame', gen: 1, opts });
    const p = h.request({ kind: 'advance', gen: 1, maxHours: 10, budgetMs: 1e9 });
    h.dispose();
    expect(await p).toMatchObject({ ok: false, hostFailure: true });
    expect(h.core.state!.clock.hour).toBe(0);
  });
});

describe('CG-16 controller recovery policy', () => {
  let clock = 0;
  beforeEach(() => {
    clock = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => clock);
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  async function run(c: GameController, frames: number) {
    for (let i = 0; i < frames; i++) { clock += 250; c.tickFrame(clock); await c.whenIdle(); }
  }

  it('recovers a crashed worker from the exact UI checkpoint and continues deterministically', async () => {
    const w = new FakeWorker();
    const c = new GameController(new WorkerSimHost(w, 0));
    await c.newGame(opts);
    c.setSpeedSetting({ kind: 'fixed', hps: 12 });
    c.setPaused(false);
    await run(c, 20); // 20 × 3 h = 60 h
    const hour = c.st!.clock.hour;
    w.crash('renderer killed');
    await run(c, 1);
    await c.whenIdle();
    expect(c.host.kind).toBe('inline');
    expect(c.hostError).toBeNull();
    expect(c.paused).toBe(true);
    expect(c.st!.clock.hour).toBe(hour);

    // Continuation after recovery equals an uninterrupted simulation to the same hour.
    c.setPaused(false);
    await run(c, 300); // crosses the February boundary
    const reference = new SimCore(() => 0);
    reference.handle({ kind: 'newGame', gen: 1, opts });
    reference.handle({ kind: 'advance', gen: 1, maxHours: c.st!.clock.hour, budgetMs: 1e9 });
    expect(c.st!.tick).toBeGreaterThanOrEqual(1);
    expect(JSON.stringify(await c.save().then((t) => JSON.parse(t).state))).toBe(JSON.stringify(reference.state));
  });

  it('refuses to guess when sub-monthly systems exist: blocks play until a save is loaded or a new game starts', async () => {
    const w = new FakeWorker();
    const c = new GameController(new WorkerSimHost(w, 0));
    await c.newGame(opts);
    DAILY_SYSTEMS.push({ name: 'test-daily', run: () => {} });
    try {
      w.crash('renderer killed');
      await c.save().catch(() => undefined); // any request observes the failure
      await c.whenIdle();
      expect(c.hostError).toMatch(/Hãy tải bản lưu/);
      c.setPaused(false);
      expect(c.paused).toBe(true);
      await c.newGame(opts); // a working host is in place for new game / load
      expect(c.hostError).toBeNull();
      expect(c.st!.clock.hour).toBe(0);
    } finally {
      DAILY_SYSTEMS.pop();
    }
  });

  it('CG16-02: a rejected round trip never wedges the in-flight slot', async () => {
    const inner = new InlineSimHost();
    let reject = false;
    const host: SimHost = {
      kind: 'inline',
      request(req: SimRequest): Promise<SimResponse> { return reject && req.kind === 'advance' ? Promise.reject(new Error('transport broke')) : inner.request(req); },
      dispose() { inner.dispose(); },
    };
    const c = new GameController(host);
    await c.newGame(opts);
    c.setPaused(false);
    reject = true;
    clock += 250; c.tickFrame(clock);
    await c.whenIdle();
    // The failure is surfaced as a host failure and handled; nothing stays in flight.
    expect((c as unknown as { inflight: unknown }).inflight).toBeNull();
    expect(c.paused).toBe(true);
  });
});
