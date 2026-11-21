// UI state (navigation, selection, map layer, map camera). Kept apart from the game state so that
// screen changes never touch the simulation. A tiny observable store + Preact hooks.
import { useEffect, useState } from 'preact/hooks';
import { game } from './controller';

export type ScreenId = 'map' | 'economy' | 'society' | 'diplomacy' | 'military' | 'politics' | 'tech' | 'chronicle' | 'world' | 'country' | 'system' | 'more' | 'inbox';
export type LensId = 'political' | 'terrain' | 'population' | 'economy' | 'sol' | 'literacy' | 'resources' | 'diplomacy' | 'military' | 'market';

export interface UIState {
  started: boolean;
  screen: ScreenId;
  tabs: Partial<Record<ScreenId, string>>;
  region: string | null; // selected map region
  country: string | null; // country shown by the Country screen (defaults to the player / followed country)
  follow: string | null; // Observer Mode: country whose KPIs the top bar shows
  lens: LensId;
  lensSheet: boolean;
  regionDetail: boolean;
  panelWide: boolean; // landscape: main window expanded across the map
  winCollapsed: boolean; // main window reduced to its title strip (map fully visible)
  fullMap: boolean; // interface hidden except map controls
  sheetSnap: 0 | 1 | 2; // portrait map sheet: peek / half / full
  camera: { cx: number; cy: number; scale: number } | null; // map centre (grid cells) and cells per CSS px
}

let state: UIState = {
  started: false, screen: 'map', tabs: {}, region: null, country: null, follow: null, lens: 'political', lensSheet: false,
  regionDetail: false, panelWide: false, winCollapsed: false, fullMap: false, sheetSnap: 0, camera: null,
};
const listeners = new Set<() => void>();
export const ui = {
  get: () => state,
  set(p: Partial<UIState>) { state = { ...state, ...p }; for (const f of listeners) f(); },
  subscribe(f: () => void) { listeners.add(f); return () => { listeners.delete(f); }; },
  go(screen: ScreenId, tab?: string) { ui.set({ screen, tabs: tab ? { ...state.tabs, [screen]: tab } : state.tabs, regionDetail: false, lensSheet: false, winCollapsed: false, fullMap: false }); },
  tab(screen: ScreenId, tab: string) { ui.set({ tabs: { ...state.tabs, [screen]: tab } }); },
};

export function useUI(): UIState {
  const [, force] = useState(0);
  useEffect(() => ui.subscribe(() => force((x) => x + 1)), []);
  return ui.get();
}
/** Re-renders on every game change (month tick, command, load). */
export function useGame() {
  const [, force] = useState(0);
  useEffect(() => game.subscribe(() => force((x) => x + 1)), []);
  return game;
}
/** Re-renders only on clock changes (hour ticks) — for the date/time widget, not whole screens. */
export function useGameClock() {
  const [, force] = useState(0);
  useEffect(() => game.subscribeClock(() => force((x) => x + 1)), []);
  return game;
}
/** Media-query hook: landscape layout when the viewport is wider than tall. */
export function useOrientation(): 'landscape' | 'portrait' {
  const q = (): 'landscape' | 'portrait' => (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
  const [o, setO] = useState(q());
  useEffect(() => { const f = () => setO(q()); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }, []);
  return o;
}
