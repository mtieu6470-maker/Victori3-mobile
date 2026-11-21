// CLOCK-02b: background signals pause the game and trigger one throttled best-effort autosave.
import { describe, expect, it, vi } from 'vitest';
import { installLifecycle } from '../src/ui/game/lifecycle';

function setup(opts: { failSave?: boolean } = {}) {
  const doc = Object.assign(new EventTarget(), { hidden: false });
  const win = new EventTarget();
  let t = 0;
  const onBackground = vi.fn();
  const autosave = vi.fn(() => (opts.failSave ? Promise.reject(new Error('disk full')) : Promise.resolve()));
  const onAutosaveError = vi.fn();
  const uninstall = installLifecycle({ doc, win, onBackground, autosave, now: () => t, minAutosaveIntervalMs: 15_000, onAutosaveError });
  return { doc, win, onBackground, autosave, onAutosaveError, uninstall, advance: (ms: number) => { t += ms; } };
}

describe('CLOCK-02b lifecycle', () => {
  it('pauses and autosaves when the page becomes hidden; ignores becoming visible', async () => {
    const s = setup();
    s.doc.dispatchEvent(new Event('visibilitychange'));
    expect(s.onBackground).not.toHaveBeenCalled(); // still visible
    s.doc.hidden = true;
    s.doc.dispatchEvent(new Event('visibilitychange'));
    expect(s.onBackground).toHaveBeenCalledTimes(1);
    expect(s.autosave).toHaveBeenCalledTimes(1);
  });

  it('treats pagehide, freeze and the Capacitor/Cordova pause event as the same background transition', () => {
    const s = setup();
    s.win.dispatchEvent(new Event('pagehide'));
    s.doc.dispatchEvent(new Event('freeze'));
    s.doc.dispatchEvent(new Event('pause'));
    expect(s.onBackground).toHaveBeenCalledTimes(3); // pausing is idempotent and always applied
    expect(s.autosave).toHaveBeenCalledTimes(1); // one save for one transition
  });

  it('autosaves again on a later background transition, and never auto-resumes on resume', async () => {
    const s = setup();
    s.doc.dispatchEvent(new Event('pause'));
    await Promise.resolve(); await Promise.resolve();
    s.doc.dispatchEvent(new Event('resume'));
    s.advance(16_000);
    s.doc.dispatchEvent(new Event('pause'));
    expect(s.autosave).toHaveBeenCalledTimes(2);
    expect(s.onBackground).toHaveBeenCalledTimes(2);
  });

  it('reports autosave failures without throwing', async () => {
    const s = setup({ failSave: true });
    s.doc.dispatchEvent(new Event('pause'));
    await new Promise((r) => setTimeout(r, 0));
    expect(s.onAutosaveError).toHaveBeenCalledTimes(1);
  });

  it('uninstall removes every listener', () => {
    const s = setup();
    s.uninstall();
    s.doc.hidden = true;
    for (const e of ['visibilitychange', 'freeze', 'pause']) s.doc.dispatchEvent(new Event(e));
    s.win.dispatchEvent(new Event('pagehide'));
    expect(s.onBackground).not.toHaveBeenCalled();
    expect(s.autosave).not.toHaveBeenCalled();
  });
});
