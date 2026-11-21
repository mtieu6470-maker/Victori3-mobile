// CLOCK-02b app lifecycle (web-standard part): pause the simulation and autosave when the app goes
// to the background, without depending on a native plugin.
//
// Android WebView/Capacitor can signal backgrounding through several channels; we listen to all of
// them and treat each as the same idempotent "background" transition:
//   - document `visibilitychange` (hidden)          — Page Visibility API
//   - window `pagehide`                              — page being hidden/unloaded
//   - document `freeze`                              — Chromium Page Lifecycle API (tab/app frozen)
//   - document `pause`                               — Cordova/Capacitor compatibility event, if emitted
// The simulation never resumes automatically; the player resumes explicitly (`resume` is ignored).
// Autosave is best-effort (the OS may freeze the process at any time) and throttled so several
// signals for one transition produce one save. A native App-plugin hook remains a follow-up
// (adding @capacitor/app needs a dependency change approved in this environment).

export interface LifecycleDeps {
  doc: Pick<EventTarget, 'addEventListener' | 'removeEventListener'> & { hidden?: boolean };
  win?: Pick<EventTarget, 'addEventListener' | 'removeEventListener'>;
  onBackground: () => void;
  autosave: () => Promise<void>;
  now?: () => number;
  /** Minimum interval between two background autosaves (one transition fires several events). */
  minAutosaveIntervalMs?: number;
  onAutosaveError?: (e: unknown) => void;
}

export const DEFAULT_MIN_AUTOSAVE_INTERVAL_MS = 15_000;

/** Installs the listeners; returns an uninstall function (removes every listener it added). */
export function installLifecycle(deps: LifecycleDeps): () => void {
  const now = deps.now ?? (() => Date.now());
  const minGap = deps.minAutosaveIntervalMs ?? DEFAULT_MIN_AUTOSAVE_INTERVAL_MS;
  let lastAutosave = -Infinity;
  let saving = false;

  const background = () => {
    deps.onBackground();
    const t = now();
    if (saving || t - lastAutosave < minGap) return;
    lastAutosave = t; saving = true;
    deps.autosave().catch((e) => deps.onAutosaveError?.(e)).finally(() => { saving = false; });
  };
  const onVisibility = () => { if (deps.doc.hidden) background(); };

  const docEvents: [string, EventListener][] = [['visibilitychange', onVisibility], ['freeze', background], ['pause', background]];
  const winEvents: [string, EventListener][] = [['pagehide', background]];
  for (const [e, f] of docEvents) deps.doc.addEventListener(e, f);
  if (deps.win) for (const [e, f] of winEvents) deps.win.addEventListener(e, f);
  return () => {
    for (const [e, f] of docEvents) deps.doc.removeEventListener(e, f);
    if (deps.win) for (const [e, f] of winEvents) deps.win.removeEventListener(e, f);
  };
}
