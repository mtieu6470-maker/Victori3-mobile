// DEV-006 fast-forward isolation, updated for CLOCK-01 (hour chunks), CG-11/CG-12 fixes and CLOCK-02
// (simulation behind an async SimHost). Uses the real engine through InlineSimHost; wrapper hosts
// inject interleavings (load/new game/background mid-run) and failures.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { GameController } from '../src/ui/game/controller';
import { InlineSimHost, type SimHost } from '../src/ui/game/simHost';
import { CAMPAIGN_END_TICK } from '../src/engine/core';
import { CAMPAIGN_FINAL_HOUR } from '../src/engine/clock/calendar';
import { advanceHours, positionAtMonthStart } from '../src/engine/simulation';
import { createGame } from '../src/engine/init';
import { serialize } from '../src/engine/save';
import type { SimRequest, SimResponse } from '../src/engine/runtime/simCore';

loadNodeData();

/** Inline host that lets a test act after the n-th fast-forward advance request, or fail it. */
class ScriptedHost implements SimHost {
  readonly kind = 'inline' as const;
  readonly inner = new InlineSimHost();
  advances = 0;
  onAdvance: ((n: number) => void | Promise<void>) | null = null;
  failAt = 0;
  async request(req: SimRequest): Promise<SimResponse> {
    if (req.kind === 'advance' && req.snapshot === 'never') {
      this.advances++;
      if (this.failAt && this.advances === this.failAt) return { ok: false, gen: req.gen, error: 'simulated monthly step failure' };
      const res = await this.inner.request(req);
      if (this.onAdvance) await this.onAdvance(this.advances);
      return res;
    }
    return this.inner.request(req);
  }
  dispose() { this.inner.dispose(); }
}

describe('GameController fast-forward isolation (CLOCK-02 host)', () => {
  let request: ReturnType<typeof vi.fn>;
  let cancel: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    let id = 1;
    request = vi.fn(() => id++);
    cancel = vi.fn();
    vi.stubGlobal('requestAnimationFrame', request);
    vi.stubGlobal('cancelAnimationFrame', cancel);
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  async function started(host: SimHost = new InlineSimHost(), seed = 1) {
    const c = new GameController(host);
    await c.newGame({ mode: 'historical', seed, player: null });
    return c;
  }

  it('runs in bounded chunks, pauses the live RAF clock and restores its prior run state', async () => {
    const host = new ScriptedHost();
    const c = await started(host);
    c.setPaused(false);
    expect(request).toHaveBeenCalledTimes(1);
    const work = c.fastForward(3);
    expect(c.paused).toBe(true);
    expect(c.busy).not.toBeNull();
    expect(cancel).toHaveBeenCalledTimes(1);
    await work;
    expect(c.st?.tick).toBe(3);
    expect(host.advances).toBeGreaterThanOrEqual(3); // at least one chunk per (indivisible) monthly boundary
    expect(c.busy).toBeNull();
    expect(c.paused).toBe(false);
    expect(request).toHaveBeenCalledTimes(2);
  });

  it('rejects overlapping fast-forward and blocks stepping/commands while busy', async () => {
    const c = await started();
    const first = c.fastForward(2);
    const second = c.fastForward(3);
    await c.stepOnce(); await c.stepDay();
    c.setPaused(false);
    expect(c.paused).toBe(true);
    expect(await c.command({} as any)).toEqual({ ok: false, reason: 'Đang mô phỏng, vui lòng chờ' });
    await Promise.all([first, second]);
    expect(c.st?.tick).toBe(2);
    expect(c.busy).toBeNull();
  });

  it('does not let an invalidated fast-forward overwrite a newly loaded game', async () => {
    const other = createGame({ mode: 'sandbox', seed: 99, player: null });
    positionAtMonthStart(other, 100);
    const host = new ScriptedHost();
    const c = await started(host);
    host.onAdvance = async (n) => { if (n === 1) await c.load(serialize(other)); };
    await c.fastForward(6);
    expect(c.st?.tick).toBe(100);
    expect(c.st?.mode).toBe('sandbox');
    expect(c.busy).toBeNull();
    expect(c.paused).toBe(true);
    expect(host.advances).toBe(1);
  });

  it('does not let an invalidated fast-forward continue after a new game replaces the state', async () => {
    const host = new ScriptedHost();
    const c = await started(host);
    host.onAdvance = async (n) => { if (n === 1) await c.newGame({ mode: 'sandbox', seed: 7, player: null }); };
    await c.fastForward(6);
    expect(c.st?.tick).toBe(0);
    expect(c.st?.mode).toBe('sandbox');
    expect(c.paused).toBe(true);
    expect(c.busy).toBeNull();
    expect(host.advances).toBe(1);
  });

  it('CG11-01: backgrounding cancels an active fast-forward and never auto-resumes it', async () => {
    const host = new ScriptedHost();
    const c = await started(host);
    c.setPaused(false);
    host.onAdvance = (n) => { if (n === 1) c.onBackground(); };
    await c.fastForward(12);
    await c.whenIdle();
    await new Promise((r) => setTimeout(r, 0)); // let the post-cancel resync land
    expect(c.busy).toBeNull();
    expect(c.paused).toBe(true);
    expect(c.pausedByLifecycle).toBe(true);
    expect(host.advances).toBe(1);
    expect(c.st!.tick).toBeLessThanOrEqual(1);
    expect(request).toHaveBeenCalledTimes(1); // the prior running state was NOT restored
  });

  it('caps fast-forward at December 2026; December hours stay playable until 23:00 31/12/2026', async () => {
    const host = new ScriptedHost();
    const c = await started(host);
    positionAtMonthStart(host.inner.core.state!, CAMPAIGN_END_TICK - 2);
    await (c as any).resync();
    expect(c.st?.tick).toBe(CAMPAIGN_END_TICK - 2);
    c.setPaused(false);
    await c.fastForward(24);
    expect(c.st?.tick).toBe(CAMPAIGN_END_TICK);
    expect(c.busy).toBeNull();
    expect(c.paused).toBe(false);

    advanceHours(host.inner.core.state!, 10_000);
    await (c as any).resync();
    expect(c.st?.clock.hour).toBe(CAMPAIGN_FINAL_HOUR);
    c.setPaused(true); c.setPaused(false);
    await c.stepOnce(); await c.stepDay();
    expect(c.paused).toBe(true);
    const before = host.advances;
    await c.fastForward(3);
    expect(host.advances).toBe(before);
    expect(c.st?.tick).toBe(CAMPAIGN_END_TICK);
  });

  it('restores the live clock after a fast-forward chunk fails', async () => {
    const host = new ScriptedHost();
    host.failAt = 2;
    const c = await started(host);
    c.setPaused(false);
    await expect(c.fastForward(6)).rejects.toThrow('simulated monthly step failure');
    expect(c.busy).toBeNull();
    expect(c.paused).toBe(false);
    expect(c.st!.tick).toBeGreaterThanOrEqual(0);
    expect(request).toHaveBeenCalledTimes(2);
  });

  it('CG11-03: dispose removes the visibility listener and stops work', () => {
    const add = vi.fn(); const remove = vi.fn();
    vi.stubGlobal('document', { hidden: false, addEventListener: add, removeEventListener: remove });
    const c = new GameController(new InlineSimHost());
    expect(add).toHaveBeenCalledTimes(1);
    const listener = add.mock.calls[0][1];
    c.dispose(); c.dispose();
    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove.mock.calls[0][1]).toBe(listener);
    expect(c.paused).toBe(true);
  });

  it('CG12-01: dispose is terminal — no RAF, request, emit, subscription or state change afterwards', async () => {
    const host = new ScriptedHost();
    const c = await started(host);
    const spy = vi.spyOn(host, 'request');
    const seen: number[] = [];
    c.subscribe(() => seen.push(c.version));
    c.dispose();
    const v = c.version; const tick = c.st?.tick;
    c.setPaused(false);
    await c.fastForward(12);
    await c.stepOnce(); await c.stepDay(); c.tickFrame(1000);
    c.setSpeedSetting({ kind: 'fixed', hps: 12 });
    await c.newGame({ mode: 'historical', seed: 1, player: null });
    await c.load('{}');
    c.toast('x');
    const unsub = c.subscribe(() => seen.push(-1)); unsub();
    expect(request).not.toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
    expect(c.st?.tick).toBe(tick);
    expect(c.version).toBe(v);
    expect(seen).toEqual([]);
    expect(c.paused).toBe(true);
    expect((await c.command({} as any)).ok).toBe(false);
  });
});
