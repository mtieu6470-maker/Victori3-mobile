import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/engine/simulation', () => ({
  stepMonth: vi.fn((state: { tick?: number }) => { state.tick = (state.tick ?? 0) + 1; return true; }),
}));
vi.mock('../src/engine/save', () => ({
  serialize: vi.fn(() => ''),
  deserialize: vi.fn((value: string) => JSON.parse(value)),
}));
vi.mock('../src/engine/init', () => ({ createGame: vi.fn() }));

import { createGame } from '../src/engine/init';
import { stepMonth } from '../src/engine/simulation';
import { GameController } from '../src/ui/game/controller';
import { CAMPAIGN_END_TICK } from '../src/engine/core';

describe('GameController fast-forward isolation', () => {
  let callbacks: Map<number, FrameRequestCallback>;
  let nextId: number;
  let request: ReturnType<typeof vi.fn>;
  let cancel: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    callbacks = new Map();
    nextId = 1;
    request = vi.fn((callback: FrameRequestCallback) => {
      const id = nextId++;
      callbacks.set(id, callback);
      return id;
    });
    cancel = vi.fn((id: number) => { callbacks.delete(id); });
    vi.stubGlobal('requestAnimationFrame', request);
    vi.stubGlobal('cancelAnimationFrame', cancel);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('pauses the live RAF clock during fast-forward and restores its prior run state', async () => {
    let resumeYield: (() => void) | undefined;
    vi.stubGlobal('setTimeout', ((callback: () => void) => { resumeYield = callback; return 1; }) as typeof setTimeout);
    const controller = new GameController();
    controller.st = { tick: 0, log: [] } as any;
    controller.setPaused(false);
    expect(request).toHaveBeenCalledTimes(1);

    const work = controller.fastForward(6);
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(controller.paused).toBe(true);
    expect(controller.busy).not.toBeNull();

    expect(resumeYield).toBeDefined();
    resumeYield?.();
    await work;

    expect(controller.st?.tick).toBe(6);
    expect(controller.paused).toBe(false);
    expect(controller.busy).toBeNull();
    expect(request).toHaveBeenCalledTimes(2);
  });

  it('rejects overlapping fast-forward and blocks player stepping/commands while busy', async () => {
    let resumeYield: (() => void) | undefined;
    vi.stubGlobal('setTimeout', ((callback: () => void) => { resumeYield = callback; return 1; }) as typeof setTimeout);
    const controller = new GameController();
    controller.st = { tick: 0, log: [] } as any;

    const first = controller.fastForward(6);
    expect(controller.busy).not.toBeNull();
    const second = controller.fastForward(3);
    controller.stepOnce();
    controller.setPaused(false);
    expect(controller.st?.tick).toBe(6); // fast-forward runs synchronously to its first six-month yield.
    expect(controller.paused).toBe(true);
    expect(controller.command({} as any)).toEqual({ ok: false, reason: 'Đang mô phỏng, vui lòng chờ' });

    expect(resumeYield).toBeDefined();
    resumeYield?.();
    await Promise.all([first, second]);
    expect(controller.st?.tick).toBe(6);
    expect(controller.busy).toBeNull();
  });

  it('does not let an invalidated fast-forward overwrite a newly loaded game', async () => {
    let resumeYield: (() => void) | undefined;
    vi.stubGlobal('setTimeout', ((callback: () => void) => {
      resumeYield = callback;
      return 1;
    }) as typeof setTimeout);

    const controller = new GameController();
    controller.st = { tick: 0, log: [] } as any;
    const work = controller.fastForward(6);
    expect(controller.busy).not.toBeNull();
    expect(resumeYield).toBeDefined();

    controller.load(JSON.stringify({ tick: 100, log: [] }));
    resumeYield?.();
    await work;

    expect(controller.st?.tick).toBe(100);
    expect(controller.busy).toBeNull();
    expect(controller.paused).toBe(true);
  });

  it('does not let an invalidated fast-forward continue after a new game replaces the state', async () => {
    let resumeYield: (() => void) | undefined;
    vi.stubGlobal('setTimeout', ((callback: () => void) => {
      resumeYield = callback;
      return 1;
    }) as typeof setTimeout);
    vi.mocked(createGame).mockReturnValue({ tick: 500, log: [] } as any);

    const controller = new GameController();
    controller.st = { tick: 0, log: [] } as any;
    const work = controller.fastForward(6);
    expect(controller.st?.tick).toBe(6);
    expect(controller.busy).not.toBeNull();
    expect(resumeYield).toBeDefined();

    controller.newGame({ mode: 'historical', seed: 7, player: null });
    expect(controller.st?.tick).toBe(500);
    expect(controller.paused).toBe(true);
    expect(controller.busy).toBeNull();

    resumeYield?.();
    await work;

    expect(controller.st?.tick).toBe(500);
    expect(controller.paused).toBe(true);
    expect(controller.busy).toBeNull();
    expect(vi.mocked(createGame)).toHaveBeenCalledWith({ mode: 'historical', seed: 7, player: null });
  });

  it('caps fast-forward at December 2026 and cannot resume a completed campaign', async () => {
    const controller = new GameController();
    controller.st = { tick: CAMPAIGN_END_TICK - 2, log: [] } as any;
    controller.setPaused(false);
    expect(request).toHaveBeenCalledTimes(1);

    await controller.fastForward(24);

    expect(vi.mocked(stepMonth)).toHaveBeenCalledTimes(2);
    expect(controller.st?.tick).toBe(CAMPAIGN_END_TICK);
    expect(controller.paused).toBe(true);
    expect(controller.busy).toBeNull();
    controller.setPaused(false);
    controller.stepOnce();
    expect(controller.st?.tick).toBe(CAMPAIGN_END_TICK);
    expect(controller.paused).toBe(true);
    expect(request).toHaveBeenCalledTimes(1);
  });

  it('restores the live clock after a fast-forward step throws', async () => {
    let resumeYield: (() => void) | undefined;
    vi.stubGlobal('setTimeout', ((callback: () => void) => {
      resumeYield = callback;
      return 1;
    }) as typeof setTimeout);

    const stepMonthMock = vi.mocked(stepMonth);
    for (let i = 0; i < 6; i++) {
      stepMonthMock.mockImplementationOnce((state) => {
        state.tick = (state.tick ?? 0) + 1;
        return true;
      });
    }
    stepMonthMock.mockImplementationOnce(() => {
      throw new Error('simulated monthly step failure');
    });

    const controller = new GameController();
    controller.st = { tick: 0, log: [] } as any;
    controller.setPaused(false);

    const work = controller.fastForward(12);
    expect(controller.st?.tick).toBe(6);
    expect(controller.busy?.done).toBe(6);
    expect(controller.paused).toBe(true);
    expect(resumeYield).toBeDefined();

    resumeYield?.();
    await expect(work).rejects.toThrow('simulated monthly step failure');

    expect(controller.busy).toBeNull();
    expect(controller.paused).toBe(false);
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledTimes(2);
  });

});
