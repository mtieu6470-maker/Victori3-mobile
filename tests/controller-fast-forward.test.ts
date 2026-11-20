import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/engine/simulation', () => ({
  stepMonth: vi.fn((state: { tick?: number }) => { state.tick = (state.tick ?? 0) + 1; }),
}));
vi.mock('../src/engine/save', () => ({
  serialize: vi.fn(() => ''),
  deserialize: vi.fn((value: string) => JSON.parse(value)),
}));

import { GameController } from '../src/ui/game/controller';

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
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const controller = new GameController();
    controller.st = { tick: 0, log: [] } as any;
    controller.setPaused(false);
    expect(request).toHaveBeenCalledTimes(1);

    const work = controller.fastForward(6);
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(controller.paused).toBe(true);
    expect(controller.busy).not.toBeNull();

    await vi.runAllTimersAsync();
    await work;

    expect(controller.st?.tick).toBe(6);
    expect(controller.paused).toBe(false);
    expect(controller.busy).toBeNull();
    expect(request).toHaveBeenCalledTimes(2);
  });

  it('rejects overlapping fast-forward and blocks player stepping/commands while busy', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const controller = new GameController();
    controller.st = { tick: 0, log: [] } as any;

    const first = controller.fastForward(6);
    expect(controller.busy).not.toBeNull();
    const second = controller.fastForward(3);
    controller.stepOnce();
    controller.setPaused(false);
    expect(controller.st?.tick).toBe(0);
    expect(controller.paused).toBe(true);
    expect(controller.command({} as any)).toEqual({ ok: false, reason: 'Đang mô phỏng, vui lòng chờ' });

    await vi.runAllTimersAsync();
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
});
