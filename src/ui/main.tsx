// Bootstrap: bundled fonts and styles, Historical Database + map topology (bundled JSON), map raster (fetched),
// then the app. URL parameters allow reproducible QA states, e.g.
//   ?mode=historical&seed=1&player=GBR&months=108&screen=economy&tab=market&region=FRA_PAR&lens=sol
import { render } from 'preact';
import '@fontsource/eb-garamond/500.css';
import '@fontsource/eb-garamond/600.css';
import '@fontsource/eb-garamond/500-italic.css';
import '@fontsource/source-sans-3/400.css';
import '@fontsource/source-sans-3/600.css';
import '@fontsource/source-sans-3/700.css';
import './styles/theme.css';
import dbJson from '../generated/db.json';
import mapJson from '../generated/map.json';
import { HistoricalData, setData, data, type MapTopology } from '../engine/data/db';
import type { HistoricalDB } from '../engine/data/dbTypes';
import { loadGrid } from './map/mapData';
import { loadVectors } from './map/vectors';
import type { MapAssets } from './map/MapView';
import { App } from './App';
import { details, modals } from './components/ui';
import { mapControls } from './map/MapView';
import { game } from './game/controller';
import { ui, type LensId, type ScreenId } from './game/ui';
import type { GameMode } from '../engine/types';
import { installLifecycle } from './game/lifecycle';
import { saveSlot } from './game/storage';

/** Slot used by the background autosave (separate from the yearly autosave and player slots). */
export const BACKGROUND_AUTOSAVE_SLOT = 'Tự động lưu khi rời ứng dụng';

// CLOCK-02b: pause + best-effort autosave whenever the app goes to the background.
installLifecycle({
  doc: document,
  win: window,
  onBackground: () => game.onBackground(),
  autosave: async () => {
    if (!game.st || game.busy) return;
    await saveSlot(BACKGROUND_AUTOSAVE_SLOT, await game.save());
  },
  onAutosaveError: () => game.toast('Không tự động lưu được khi rời ứng dụng', 'error'),
});

async function boot() {
  const root = document.getElementById('app')!;
  root.innerHTML = '<div class="loading"><div class="box"><h1>Dòng chảy Lịch sử</h1><div class="muted serif">Đang mở bản đồ…</div></div></div>';
  setData(new HistoricalData(dbJson as unknown as HistoricalDB, mapJson as unknown as MapTopology));
  let assets: MapAssets;
  try {
    const img = (f: string) => { const i = new Image(); i.src = new URL(f, document.baseURI).href; return i.decode().then(() => i).catch(() => null); };
    const [grid, vectors, relief, coastDist, terrain] = await Promise.all([loadGrid(new URL('generated/map.bin', document.baseURI).href), loadVectors(document.baseURI), img('map/relief.jpg'), img('generated/coastdist.png'), img('map/terrain.jpg')]);
    assets = { grid, vectors, relief, coastDist, terrain };
  } catch (e) { root.innerHTML = `<div class="loading"><div class="box"><h1>Lỗi</h1><p>${(e as Error).message}</p></div></div>`; return; }
  await document.fonts?.ready;
  root.innerHTML = '';
  const q = new URLSearchParams(location.search);
  if (q.get('mode')) {
    const player = q.get('player'); const months = Number(q.get('months') ?? 0);
    await game.newGame({ mode: (q.get('mode') as GameMode) ?? 'historical', seed: Number(q.get('seed') ?? 1), player: player && player !== 'observer' ? player : null });
    ui.set({ started: true, screen: (q.get('screen') as ScreenId) ?? 'map', region: q.get('region'), regionDetail: !!q.get('region'), lens: (q.get('lens') as LensId) ?? 'political', follow: q.get('follow'), country: q.get('country') });
    if (q.get('tab')) ui.tab(ui.get().screen, q.get('tab')!);
    if (q.get('zoom')) { const [cx, cy, sc] = q.get('zoom')!.split(',').map(Number); ui.set({ camera: { cx, cy, scale: sc } }); }
    render(<App assets={assets} />, root);
    await game.fastForward(months);
    // QA hook for scripted screenshots (tools/ui-shots.ts); only present when the page is opened with QA parameters
    (window as any).__qa = { ui, game, details, modals, mapControls, data };
    document.body.dataset.ready = '1';
    return;
  }
  render(<App assets={assets} />, root);
  document.body.dataset.ready = '1';
}
boot();
// Offline play in the browser (installable PWA). The Android app ships its assets inside the APK and skips this.
if ('serviceWorker' in navigator && location.protocol === 'https:' && !(window as any).Capacitor) navigator.serviceWorker.register('./sw.js').catch(() => {});
