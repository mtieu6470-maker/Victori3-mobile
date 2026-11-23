// Application shell, map-first. The strategic map fills the whole screen; everything else floats above it:
// a resource bar on top, a column of module buttons on the left (landscape) or a dock at the bottom (portrait),
// map-mode dock, zoom, legend and outliner in the corners of the free map area, a context card where the player
// taps a region, and framed windows that can be collapsed to their title strip, widened or closed. Windows never
// take the full height of the screen in landscape and are bottom sheets with three heights in portrait.
import { StoryEventCard } from './screens/StoryEvents';
import { journalDef } from '../engine/systems/storyEvents';
import { useEffect, useRef, useState } from 'preact/hooks';
import type { VNode } from 'preact';
import { game, campaignFinished } from './game/controller';
import { hourToDateTime } from '../engine/clock/calendar';
import { FIXED_RATES_HPS, nextSpeedSetting, RATE_LABEL, realSecondsPerDay } from '../engine/clock/pace';
import { paceStatusLabelVi } from '../engine/clock/governor';
import { ui, useUI, useGame, useGameClock, type ScreenId, type LensId } from './game/ui';
import { MapView, mapControls, type MapAssets } from './map/MapView';
import { LENSES, lensById } from './map/lenses';
import { Icon, MODULE_COLOR } from './components/icons';
import { ModalHost, TipHost, Tip, WinHead, Tabs, Mdl, modals, details, hideTip, type TipContent } from './components/ui';
import { rankings } from '../engine/metrics';
import { techCost, researchPoints } from '../engine/systems/technology';
import { marketOf } from '../engine/systems/economy';
import { CAMPAIGN_END_YEAR, CAMPAIGN_START_YEAR } from '../engine/core';
import { data } from '../engine/data/db';
import { shortName, fullName } from './game/names';
import { compact, fmt, pct, techName, govVi, lawVi, GOOD_VI, titleVi } from './i18n/vi';
import { leaderTitle } from '../engine/systems/politics';
import { viewedId, Flag, regionName, leaderName, openCountry } from './screens/common';
import { Setup } from './screens/Setup';
import { CountryScreen, COUNTRY_TABS } from './screens/Country';
import { useContent, entityContent, bestText } from './game/content';
import { EconomyScreen, ECONOMY_TABS } from './screens/Economy';
import { SocietyScreen, SOCIETY_TABS } from './screens/Society';
import { PoliticsScreen, POLITICS_TABS } from './screens/Politics';
import { TechScreen, TECH_TABS } from './screens/Tech';
import { DiplomacyScreen, DIPLOMACY_TABS, openCountryActions } from './screens/Diplomacy';
import { MilitaryScreen, MILITARY_TABS } from './screens/Military';
import { JournalScreen, JOURNAL_TABS, InboxScreen } from './screens/Journal';
import { WorldScreen, SystemScreen } from './screens/World';
import { RegionWindow } from './screens/StateCard';
import { saveSlot } from './game/storage';

type Meta = { title: string; icon: string; tabs?: [string, string][]; tabIcons?: Record<string, string>; hint: string };
const SCREENS: Partial<Record<ScreenId, Meta>> = {
  country: { title: 'Quốc gia', icon: 'crown', tabs: COUNTRY_TABS, tabIcons: { overview: 'flag', people: 'people', dossier: 'scroll', stats: 'gdp' }, hint: 'Tổng quan quốc gia, hồ sơ lịch sử, chỉ số theo năm' },
  economy: { title: 'Kinh tế', icon: 'economy', tabs: ECONOMY_TABS, tabIcons: { overview: 'gdp', market: 'market', buildings: 'factory', construction: 'construction', budget: 'coins' }, hint: 'Thị trường, công trình, xây dựng, ngân sách' },
  society: { title: 'Dân số', icon: 'society', tabs: SOCIETY_TABS, tabIcons: { pop: 'population', regions: 'map', culture: 'people' }, hint: 'Tầng lớp, mức sống, biết chữ, vùng, văn hóa' },
  politics: { title: 'Chính trị', icon: 'politics', tabs: POLITICS_TABS, tabIcons: { gov: 'legitimacy', igs: 'people', laws: 'laws' }, hint: 'Chính phủ, nhóm lợi ích, luật pháp và cải cách' },
  tech: { title: 'Công nghệ', icon: 'tech', tabs: TECH_TABS, tabIcons: { production: 'factory', society: 'literacy', military: 'military' }, hint: 'Cây công nghệ theo niên đại phát minh' },
  diplomacy: { title: 'Ngoại giao', icon: 'diplomacy', tabs: DIPLOMACY_TABS, tabIcons: { relations: 'diplomacy', treaties: 'scroll', subjects: 'crown' }, hint: 'Quan hệ, hiệp ước, chư hầu và đối thủ' },
  military: { title: 'Quân sự', icon: 'military', tabs: MILITARY_TABS, tabIcons: { forces: 'army', wars: 'military' }, hint: 'Lực lượng và các cuộc chiến' },
  chronicle: { title: 'Biên niên', icon: 'journal', tabs: JOURNAL_TABS, tabIcons: { decisions: 'scroll', log: 'journal', territory: 'map', history: 'gdp' }, hint: 'Quyết định lịch sử, nhật ký, lãnh thổ, so với lịch sử' },
  world: { title: 'Thế giới', icon: 'world', hint: 'Bảng xếp hạng các quốc gia' },
  system: { title: 'Hệ thống', icon: 'menu', hint: 'Lưu, tải, ván mới, ghi công' },
  more: { title: 'Thêm', icon: 'menu', hint: '' },
};
const RAIL: ScreenId[] = ['country', 'economy', 'society', 'politics', 'tech', 'diplomacy', 'military', 'chronicle'];
const DOCK: ScreenId[] = ['map', 'country', 'economy', 'politics', 'diplomacy', 'more'];
const MORE: ScreenId[] = ['society', 'tech', 'military', 'chronicle', 'world', 'system'];
export const LENS_ICON: Record<LensId, string> = { political: 'flag', terrain: 'terrain', population: 'population', economy: 'gdp', sol: 'society', literacy: 'literacy', resources: 'iron', diplomacy: 'diplomacy', military: 'military', market: 'market' };
const MONTH_VI = ['tháng Giêng', 'tháng Hai', 'tháng Ba', 'tháng Tư', 'tháng Năm', 'tháng Sáu', 'tháng Bảy', 'tháng Tám', 'tháng Chín', 'tháng Mười', 'tháng Mười một', 'tháng Chạp'];
/** Portrait sheet heights: top edge as a share of the space between the bars (0 = full). */
const SNAP_TOP: Record<0 | 1 | 2, number> = { 1: 0, 0: 0.36, 2: 0.6 };
const TOP_L = 48, TOP_P = 85, DOCK_P = 64, GAP = 8;

function useViewport(): [number, number] {
  const [v, setV] = useState<[number, number]>([window.innerWidth, window.innerHeight]);
  useEffect(() => { const f = () => setV([window.innerWidth, window.innerHeight]); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }, []);
  return v;
}
export const scopeKey = () => { const u = ui.get(); return `${u.screen}:${u.tabs[u.screen] ?? ''}:${u.country ?? ''}`; };
type Rect = { x: number; y: number; w: number; h: number };

/** Date/time widget: subscribes to the lightweight clock channel so hour ticks never re-render the whole UI. */
function DateBox() {
  const g = useGameClock(); const st = g.st;
  if (!st) return null;
  const now = hourToDateTime(st.clock.hour);
  return <div class="datebox" aria-label={`${now.h} giờ ngày ${now.d} ${MONTH_VI[now.m - 1]} năm ${now.y}; chiến dịch ${CAMPAIGN_START_YEAR}–${CAMPAIGN_END_YEAR}`}><b class="num">{now.y}</b><span>{now.d} {MONTH_VI[now.m - 1]} · <span class="num">{String(now.h).padStart(2, '0')}:00</span></span></div>;
}

export function App({ assets }: { assets: MapAssets }) {
  const u = useUI(); const g = useGame(); const det = details.use(); const [vw, vh] = useViewport(); const st = g.st;
  const [pick, setPick] = useState<{ x: number; y: number } | null>(null);
  const [hover, setHover] = useState<{ id: string; x: number; y: number } | null>(null);
  const lastSave = useRef(-1);
  const portraitNow = vw <= vh;
  const stageH = portraitNow ? vh - TOP_P - DOCK_P : vh - TOP_L;
  const regionGrip = useSheetDrag(stageH, () => ui.set({ region: null, regionDetail: false }));
  useEffect(() => { if (st && st.date.m === 1 && st.tick > 0 && st.tick !== lastSave.current && !game.busy) { lastSave.current = st.tick; game.save().then((t) => saveSlot('Tự động lưu', t)).catch(() => game.toast('Không tự động lưu được (bộ nhớ thiết bị)', 'error')); } });
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (e.code === 'Space') { e.preventDefault(); game.setPaused(!game.paused); }
      if (/^Digit[1-5]$/.test(e.code)) game.setSpeedSetting({ kind: 'fixed', hps: FIXED_RATES_HPS[Number(e.code.slice(5)) - 1] });
      if (e.code === 'Digit0' || e.code === 'KeyA') game.setSpeedSetting({ kind: 'auto' });
      if (e.code === 'KeyF') ui.set({ fullMap: !ui.get().fullMap });
      if (e.code === 'Escape') { if (modals.get()) modals.close(); else if (details.get()) details.close(); else if (ui.get().fullMap) ui.set({ fullMap: false }); else if (ui.get().region) ui.set({ region: null, regionDetail: false }); else ui.set({ screen: 'map' }); }
    };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, []);
  // EVT-01: a new story event for the player pauses the game and opens the event window
  const shownStory = useRef<string | null>(null);
  useEffect(() => {
    const p = st?.pendingStory?.find((x) => x.country === st.player);
    if (!st || !p || shownStory.current === p.id || modals.get()) return;
    shownStory.current = p.id; game.setPaused(true);
    const ev = data().db.story_events?.find((x) => x.id === p.event);
    modals.open(ev?.title_vi ?? 'Sự kiện', () => { const g2 = game.st!; const q = g2.pendingStory?.find((x) => x.id === p.id); return q ? <StoryEventCard st={g2} p={q} /> : <div class="s">Đã quyết định.</div>; }, true);
  });
  const tabKey = scopeKey();
  useEffect(() => { const d = details.get(); if (d && d.scope !== tabKey) details.close(); hideTip(); }, [tabKey]);
  useEffect(() => { if (!u.region) setPick(null); }, [u.region]);
  if (!u.started || !st) return <><Setup /><ModalHost /><TipHost /><Toasts /></>;
  if (game.busy) return <Loading />;

  const portrait = portraitNow;
  const focus = viewedId(st);
  const meta = SCREENS[u.screen]; const winOpen = !!meta && !u.fullMap;
  const regionOwner = u.region ? st.regions.find((r) => r.id === u.region)?.owner ?? null : null;
  const selCountry = regionOwner ?? (u.screen === 'country' ? (u.country ?? focus) : null);

  // ---- geometry (viewport coordinates, CSS px)
  const top = portrait ? TOP_P : TOP_L, bottomBar = portrait ? DOCK_P : 0;
  const railR = portrait ? 0 : 56;
  const collapsed = u.winCollapsed;
  let main: Rect | null = null, side: Rect | null = null, reg: Rect | null = null, sheetTop = vh - bottomBar;
  if (!portrait) {
    if (winOpen) {
      const w = u.panelWide ? vw - railR - 10 : Math.max(380, Math.min(560, Math.round(vw * 0.46)));
      main = { x: railR, y: top + GAP, w: collapsed ? Math.min(w, 340) : w, h: collapsed ? 54 : vh - top - GAP - 10 };
      if (det && !collapsed) { const sx = u.panelWide ? vw - 10 - Math.min(380, Math.round(vw * 0.4)) : main.x + main.w + GAP; side = { x: sx, y: top + GAP, w: Math.min(380, vw - sx - 10), h: main.h }; }
    }
    if (u.region && u.regionDetail) { const w = Math.min(360, Math.round(vw * 0.38)); reg = { x: vw - 10 - w, y: top + GAP, w, h: vh - top - GAP - 10 }; }
  } else if (winOpen || (u.region && u.regionDetail)) sheetTop = collapsed && winOpen ? vh - bottomBar - 56 : top + Math.round(stageH * SNAP_TOP[u.sheetSnap]);
  const overlapR = side && reg && side.x + side.w > reg.x;
  const freeL = portrait ? 0 : Math.max(railR, main && !collapsed ? (side ?? main).x + (side ?? main).w : railR);
  const freeR = portrait ? vw : reg && !overlapR ? reg.x : vw;
  const freeB = portrait ? sheetTop : vh;
  const freeW = Math.max(0, freeR - freeL);
  const hud = !u.fullMap;
  const lens = lensById(u.lens); const legendItems = lens.legend(st, focus);
  const wideDock = !portrait && freeW >= 660;
  const showOutliner = !portrait && hud && freeW >= 560;
  const dockW = (wideDock ? LENSES.length * 40 + 140 + 41 : 214) + (portrait ? 0 : 3 * 40 + 1);
  const rects = {
    dock: { x: portrait ? 8 : freeR - 10 - dockW, y: portrait ? top + GAP : vh - 10 - 42, w: dockW, h: 42 },
    zoom: portrait ? { x: freeR - 10 - 40, y: top + GAP, w: 40, h: 122 } : { x: 0, y: 0, w: 0, h: 0 },
    legend: { x: portrait ? 8 : freeL + 10, y: 0, w: 230, h: 34 + Math.min(legendItems.length, 8) * 19 },
    outl: { x: freeR - 10 - 236, y: top + GAP, w: 236, h: 250 },
  };
  const card = !!u.region && !!pick && !u.regionDetail && hud;
  const cardW = portrait ? vw - 16 : 304, cardH = 168;
  rects.legend.y = freeB - (portrait ? 8 : 10) - rects.legend.h - (card && portrait ? cardH + 8 : 0);
  // portrait: map controls sit at the top of the map and hide when a sheet rises over them
  const dockShown = portrait ? freeB - top > 8 + 42 + 16 : freeW >= dockW + 20 || !winOpen;
  const zoomShown = portrait && freeB - top > 8 + 122 + 16;
  // the legend sits bottom-left of the free map; if the dock would hit it, it stacks above the dock instead
  if (!portrait && dockShown && rects.legend.x + rects.legend.w + 8 > rects.dock.x) rects.legend.y = rects.dock.y - 8 - rects.legend.h;
  const legendShown = hud && freeB - top > 220 && freeW > 250 && rects.legend.y > top + GAP + 40 + (showOutliner && !reg && rects.legend.x + rects.legend.w > rects.outl.x ? 250 : 0);
  const cardPos = card ? (portrait ? { x: 8, y: freeB - cardH - 8 } : { x: Math.max(freeL + 8, Math.min(freeR - cardW - 60, pick!.x + 18)), y: Math.max(top + GAP, Math.min(vh - cardH - 64, pick!.y - 40)) }) : null;
  const avoid = (): Rect[] => {
    const a: Rect[] = [{ x: 0, y: 0, w: vw, h: top }];
    if (!portrait && hud) a.push({ x: 0, y: top, w: railR, h: 8 * 43 + 12 });
    if (dockShown) a.push(rects.dock); if (zoomShown) a.push(rects.zoom);
    if (legendShown) a.push(rects.legend);
    if (showOutliner && !reg) a.push(rects.outl);
    for (const r of [main, side, reg]) if (r) a.push(r);
    if (cardPos) a.push({ ...cardPos, w: cardW, h: cardH });
    if (portrait) a.push({ x: 0, y: freeB, w: vw, h: vh - freeB });
    return a;
  };
  mapControls.setInsets({ l: freeL, r: vw - freeR, t: top, b: vh - freeB });
  const select = (r: string | null, at?: { x: number; y: number }) => { setPick(r && at ? at : null); ui.set({ region: r, regionDetail: false }); };

  return (
    <div class={`app ${portrait ? 'portrait' : 'landscape'}${u.fullMap ? ' fullmap' : ''}`}>
      <main class="stage">
        <MapView assets={assets} st={st} version={g.version} lens={u.lens} focus={focus} selRegion={u.region} selCountry={selCountry} dim={!!u.region}
          onSelect={select} onHover={(id, x, y) => setHover(id ? { id, x, y } : null)} insetLeft={0} avoid={avoid} />
        <div class="mapshade" />
      </main>
      <div class="hud-fade"><TopBar portrait={portrait} /></div>
      {!portrait && (
        <nav class="rail hud-fade" style={`top:${top + GAP}px`} aria-label="Các cửa sổ">
          {RAIL.map((id) => <RailBtn key={id} id={id} on={u.screen === id} />)}
        </nav>
      )}
      {legendShown && <Legend x={rects.legend.x} y={rects.legend.y} />}
      {zoomShown && <ZoomBar x={rects.zoom.x} y={rects.zoom.y} />}
      {dockShown && <MapDock rect={rects.dock} wide={wideDock} portrait={portrait} />}
      {showOutliner && !reg && <Outliner x={rects.outl.x} y={rects.outl.y} />}
      {hover && !pick && !portrait && <MapTip id={hover.id} x={hover.x} y={hover.y} />}
      {cardPos && <ContextCard id={u.region!} x={cardPos.x} y={cardPos.y} w={cardW} />}
      {winOpen && u.screen !== 'more' && <MainWindow id={u.screen} portrait={portrait} rect={main} sheetTop={sheetTop} stageH={stageH} />}
      {winOpen && u.screen === 'more' && <MoreWindow portrait={portrait} rect={main} sheetTop={sheetTop} stageH={stageH} />}
      {det && winOpen && !collapsed && (
        <section class="window detail frame surface" style={portrait ? `top:${sheetTop}px;bottom:${DOCK_P}px;z-index:22` : `left:${side!.x}px;top:${side!.y}px;width:${side!.w}px;height:${side!.h}px`} aria-label={det.title}>
          <WinHead title={det.title} ctx={det.ctx} icon="scroll" mod={u.screen} onBack={portrait ? () => details.close() : undefined} onClose={portrait ? undefined : () => details.close()} />
          <div class="win-body pad" key={det.key}>{det.body()}</div>
        </section>
      )}
      {u.region && u.regionDetail && <RegionWindow st={st} id={u.region} style={portrait ? `top:${sheetTop}px;bottom:${DOCK_P}px;z-index:23` : `left:${reg!.x}px;top:${reg!.y}px;width:${reg!.w}px;height:${reg!.h}px`} portrait={portrait} onGrip={portrait ? regionGrip : undefined} />}
      {u.fullMap && <button class="btn sm" style="position:absolute;z-index:31;left:10px;top:10px" onClick={() => ui.set({ fullMap: false })}><Icon name="fullscreen" class="i" />Hiện giao diện</button>}
      {portrait && <nav class="dock hud-fade" aria-label="Điều hướng">{DOCK.map((id) => <DockBtn key={id} id={id} on={u.screen === id || (id === 'more' && MORE.includes(u.screen))} />)}</nav>}
      <ModalHost />
      <TipHost />
      <Toasts />
    </div>
  );
}

function Loading() {
  const b = game.busy!;
  return <div class="loading"><div class="box"><h1>Dòng chảy Lịch sử</h1><div class="serif muted" style="margin-bottom:10px">{b.label} — {b.done}/{b.total} tháng</div><div class="bar"><i style={`width:${(b.done / b.total) * 100}%`} /></div></div></div>;
}
function Toasts() { const g = useGame(); return <div class="toasts" aria-live="polite">{g.toasts.map((t) => <div class={`toast ${t.kind}`} key={t.id}>{t.text}</div>)}</div>; }

function open(id: ScreenId) { const cur = ui.get().screen; if (cur === id && id !== 'map') ui.set({ screen: 'map' }); else ui.go(id); }
function RailBtn({ id, on }: { id: ScreenId; on: boolean }) {
  const m = SCREENS[id]!;
  return <button class={`rbtn${on ? ' on' : ''}`} style={`--rc:${MODULE_COLOR[id]}`} aria-label={m.title} aria-current={on ? 'page' : undefined} onClick={() => open(id)}><Icon name={m.icon} /><span class="lbl">{m.title}</span></button>;
}
function DockBtn({ id, on }: { id: ScreenId; on: boolean }) {
  const m = id === 'map' ? { title: 'Bản đồ', icon: 'map' } : SCREENS[id]!;
  return <button class={`dbtn${on ? ' on' : ''}`} style={`--rc:${MODULE_COLOR[id] ?? 'var(--gold-2)'}`} aria-label={m.title} aria-current={on ? 'page' : undefined} onClick={() => (id === 'map' ? ui.set({ screen: 'map' }) : open(id))}><Icon name={m.icon} /><span>{m.title}</span></button>;
}

// ---------------------------------------------------------------- top resource bar
function TopBar({ portrait }: { portrait: boolean }) {
  const g = useGame(); const st = g.st!; const id = viewedId(st); const c = st.countries[id];
  const rk = rankings(st); const rank = rk.findIndex((r) => r.id === id) + 1; const gdpRank = [...rk].sort((a, b) => b.gdp - a.gdp).findIndex((r) => r.id === id) + 1;
  const bal = c.income - c.expense;
  const unread = st.log.slice(game.readLogCount).filter((l) => l.actors.includes(id) || ['war', 'revolution', 'state'].includes(l.type)).length;
  const cost = c.research.current ? techCost(st, c, c.research.current) : 0; const research = c.research.current ? Math.min(1, c.research.progress / cost) : null;
  const pts = researchPoints(st, c); const h = st.history[id] ?? []; const g1 = h.length >= 2 ? h[h.length - 1] : null, g0 = h.length >= 2 ? h[h.length - 2] : null; const gdpYoY = g1 && g0 && g0.gdp ? g1.gdp / g0.gdp - 1 : null;
  const [pop, setPop] = useState<{ i: number; x: number; y: number } | null>(null);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const kpis: { icon: string; mc: string; v: string; d?: string; dc?: string; tip: TipContent; go: () => void; open: string }[] = [
    { icon: 'coins', mc: '#e9c46a', v: `¤${compact(c.treasury)}`, d: `${bal >= 0 ? '+' : '−'}${compact(Math.abs(bal))}`, dc: bal >= 0 ? 'pos' : 'neg', go: () => ui.go('economy', 'budget'), open: 'Ngân sách',
      tip: { title: 'Ngân khố', lines: [['Thu / tháng', `¤ ${compact(c.income)}`], ['Chi / tháng', `¤ ${compact(c.expense)}`], ['Cán cân', `${bal >= 0 ? '+' : '−'}${compact(Math.abs(bal))}`], ['Nợ công', `¤ ${compact(c.debt)}`]] } },
    { icon: 'gdp', mc: '#a9d18e', v: `¤${compact(c.gdp)}`, d: undefined, dc: gdpYoY !== null && gdpYoY >= 0 ? 'pos' : 'neg', go: () => ui.go('economy', 'overview'), open: 'Kinh tế',
      tip: { title: 'GDP / năm', lines: [['Biến động năm', gdpYoY !== null ? `${gdpYoY >= 0 ? '+' : '−'}${fmt(Math.abs(gdpYoY) * 100, 1)}%` : '—'], ['GDP / người', `¤ ${fmt(c.gdp / Math.max(1, c.stats.pop), 1)}`], ['Hạng GDP thế giới', `#${gdpRank || '—'}`], ['Công nghiệp hóa', pct(c.stats.industry, 1)]], note: g1 && g0 ? `Biến động: mẫu ngày 1/1/${g1.y} so với 1/1/${g0.y}.` : 'Chưa có hai mẫu năm để so sánh.' } },
    { icon: 'legitimacy', mc: '#e3a7a0', v: fmt(c.legitimacy), go: () => ui.go('politics', 'gov'), open: 'Chính phủ', tip: { title: 'Chính danh', lines: [['Chính thể', govVi(c.govLabel)], ['Dân cực đoan', pct(c.radicalism)]], note: 'Thang 0–100. Chính danh thấp làm tăng nguy cơ cách mạng.' } },
    { icon: 'prestige', mc: '#ecd39a', v: `#${rank || '—'}`, go: () => ui.go('world'), open: 'Thế giới', tip: { title: 'Xếp hạng sức mạnh', lines: [['Hạng', `#${rank || '—'} / ${rk.length}`], ['Uy tín', fmt(c.prestige)], ['Tiếng xấu', fmt(c.infamy)]] } },
    { icon: 'population', mc: '#e0b07a', v: compact(c.stats.pop), go: () => ui.go('society', 'pop'), open: 'Dân số', tip: { title: 'Dân số', lines: [['Biết chữ', pct(c.stats.literacy)], ['Mức sống TB', fmt(c.stats.sol, 2)], ['Số vùng', fmt(st.regions.filter((r) => r.owner === id).length)]] } },
    { icon: 'research', mc: '#7fc7c2', v: research !== null ? pct(research) : 'Chọn', go: () => ui.go('tech', 'production'), open: 'Công nghệ', tip: { title: 'Nghiên cứu', lines: [['Đang nghiên cứu', c.research.current ? techName(c.research.current) : '—'], ['Điểm / tháng', compact(pts)], ['Đã biết', `${c.techs.length} công nghệ`]] } },
    { icon: 'army', mc: '#e38c7c', v: compact(c.army.manpower), go: () => ui.go('military', 'forces'), open: 'Quân sự', tip: { title: 'Lực lượng', lines: [['Lục quân', `${compact(c.army.manpower)} / mục tiêu ${compact(c.army.target)}`], ['Hải quân', `${fmt(c.navy.strength)} tàu`], ['Chiến tranh', fmt(st.wars.filter((w) => w.attackers.members.includes(id) || w.defenders.members.includes(id)).length)]] } },
  ];
  const identity = (
    <Tip c={{ title: fullName(st, id), lines: [['Chính thể', govVi(c.govLabel)], ['Nguyên thủ', `${c.leader.titleVi ?? titleVi(leaderTitle(c))} ${leaderName(c.leader.name)}`], ['Chế độ', st.mode === 'historical' ? 'Lịch sử' : 'Sandbox']], note: st.player ? undefined : 'Chế độ quan sát: chọn nước theo dõi ở Thế giới.' }}>
      <button class="ident" onClick={() => ui.set({ country: id, screen: 'country', tabs: { ...ui.get().tabs, country: 'overview' }, winCollapsed: false, fullMap: false })} aria-label={fullName(st, id)}>
        <Flag c={c} />
        <span style="min-width:0;display:flex;flex-direction:column"><span class="nm ellipsis">{shortName(st, id)}</span><span class="sub">{st.player ? (st.mode === 'historical' ? 'Lịch sử' : 'Sandbox') : 'Quan sát'}</span></span>
      </button>
    </Tip>
  );
  const gov = g.governor;
  const clock = (
    <div class="clock">
      <button class="ib" aria-label="Thông báo" title="Thông báo" onClick={() => modals.open('Thông báo', () => <InboxScreen st={st} />)}><Icon name="bell" class="i" />{unread > 0 && <span class="badge">{unread > 99 ? '99+' : unread}</span>}</button>
      <button class={`ib${menu ? ' on' : ''}`} aria-label="Menu" title="Thế giới, hệ thống, bản đồ toàn màn hình" onClick={(e) => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); setMenu(menu ? null : { x: r.right, y: r.bottom }); }}><Icon name="menu" class="i" /></button>
      <Tip c={{ title: 'Thời kỳ chiến dịch ' + CAMPAIGN_START_YEAR + '–' + CAMPAIGN_END_YEAR, note: campaignFinished(st) ? 'Đã đến giờ cuối cùng của chiến dịch: 23:00 ngày 31/12/' + CAMPAIGN_END_YEAR + '.' : 'Bắt đầu 00:00 ngày 1/1/' + CAMPAIGN_START_YEAR + '; giờ chơi cuối cùng 23:00 ngày 31/12/' + CAMPAIGN_END_YEAR + '. Đồng hồ mô phỏng theo giờ.' }}>
        <DateBox />
      </Tip>
      <Tip c={{ title: 'Tốc độ: ' + paceStatusLabelVi(gov), lines: [['Chế độ', g.speedSetting.kind === 'auto' ? 'AUTO (12 → 6 giờ/giây khi quá tải)' : 'Cố định ' + RATE_LABEL[g.speedSetting.hps]], ['Tốc độ hiệu lực', gov.effectiveHps + ' giờ game/giây'], ['1 ngày game', realSecondsPerDay(gov.effectiveHps) + ' giây thực']], note: 'Chạm để đổi: AUTO → 1 → 2 → 3 → 6 → 12 giờ/giây (tối đa 12). Phím 1–5 chọn tốc độ cố định, 0 hoặc A chọn AUTO. Tốc độ chỉ thay đổi nhịp thời gian thực, không bỏ qua giờ mô phỏng nào.' + (gov.status === 'overloaded' || gov.status === 'fixed_overloaded' ? ' Thiết bị đang quá tải: mô phỏng chạy chậm hơn tốc độ chọn, không bỏ công việc.' : '') }}>
        <button class={`speed pace ${gov.status}`} aria-label={'Tốc độ ' + paceStatusLabelVi(gov)} onClick={() => game.setSpeedSetting(nextSpeedSetting(g.speedSetting))}><span class="mode">{g.speedSetting.kind === 'auto' ? 'AUTO' : 'CỐ ĐỊNH'}</span><span class="rate num">{gov.effectiveHps}h/s{gov.status === 'overloaded' || gov.status === 'fixed_overloaded' ? '!' : ''}</span></button>
      </Tip>
      <button class={`ib play${g.paused ? ' paused' : ''}`} aria-label={g.paused ? 'Tiếp tục' : 'Tạm dừng'} onClick={() => game.setPaused(!g.paused)}><Icon name={g.paused ? 'play' : 'pause'} class="i" /></button>
    </div>
  );
  const shown = kpis.slice(0, 4), secondary = kpis.slice(4);
  const openPop = (i: number, e: Event) => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); setPop(pop?.i === i ? null : { i, x: r.left, y: r.bottom }); };
  const strip = (
    <div class="kpis">
      {shown.map((k, i) => (
        <button key={k.icon} class={`kpi${pop?.i === i ? ' on' : ''}`} aria-label={k.tip.title} aria-expanded={pop?.i === i} onClick={(e) => openPop(i, e)}>
          <Mdl icon={k.icon} color={k.mc} /><span class="v num">{k.v}</span>{k.d && <span class={`d num ${k.dc}`}>{k.d}</span>}
        </button>
      ))}
      <button class={`kpi more${pop?.i === -1 ? ' on' : ''}`} aria-label="Chỉ số khác" aria-expanded={pop?.i === -1} onClick={(e) => openPop(-1, e)}>
        {secondary.map((k) => <span key={k.icon} class="mini"><Icon name={k.icon} />{portrait && <span class="num">{k.v}</span>}</span>)}<span class="car">▾</span>
      </button>
    </div>
  );
  const pk = pop && pop.i >= 0 ? kpis[pop.i] : null;
  const popover = pop && (
    <>
      <div class="catch" onClick={() => setPop(null)} />
      <div class="kpipop" role="dialog" aria-label={pk ? pk.tip.title : 'Chỉ số khác'} style={`left:${Math.max(6, Math.min(window.innerWidth - 302, pop.x))}px;top:${pop.y + 4}px`}>
        {pk ? (
          <>
            <div class="tt" style="display:flex;align-items:center;gap:8px"><Mdl icon={pk.icon} color={pk.mc} size="sm" />{pk.tip.title}</div>
            {pk.tip.lines?.map(([a, b]) => <div class="tl" key={a}><span>{a}</span><b class="num">{b}</b></div>)}
            {pk.tip.note && <div class="tn">{pk.tip.note}</div>}
            <button class="btn sm" style="margin-top:9px;width:100%" onClick={() => { setPop(null); pk.go(); }}>Mở {pk.open} ›</button>
          </>
        ) : secondary.map((k) => (
          <div key={k.icon} class="kp-sec">
            <div class="tt"><Mdl icon={k.icon} color={k.mc} size="sm" />{k.tip.title}<b class="num">{k.v}</b></div>
            {k.tip.lines?.map(([a, b]) => <div class="tl" key={a}><span>{a}</span><b class="num">{b}</b></div>)}
            <button class="lnk" onClick={() => { setPop(null); k.go(); }}>Mở {k.open} ›</button>
          </div>
        ))}
      </div>
    </>
  );
  const menuPop = menu && (
    <>
      <div class="catch" onClick={() => setMenu(null)} />
      <div class="kpipop" style={`left:${Math.max(6, menu.x - 250)}px;top:${menu.y + 4}px;width:250px;padding:4px 8px`}>
        {([['world', 'Thế giới', 'world'], ['system', 'Hệ thống', 'menu']] as const).map(([sid, t, ic]) => <button key={sid} class="row tap" style="width:100%;text-align:left" onClick={() => { setMenu(null); open(sid); }}><Mdl icon={ic} size="sm" /><span class="t sm">{t}</span></button>)}
        <button class="row tap" style="width:100%;text-align:left;border-bottom:0" onClick={() => { setMenu(null); ui.set({ fullMap: true, screen: 'map', region: null }); }}><Mdl icon="fullscreen" size="sm" /><span class="t sm">Bản đồ toàn màn hình</span></button>
      </div>
    </>
  );
  if (portrait) return <header class="topbar"><div class="tb-row r1">{identity}<div style="flex:1" />{clock}</div><div class="tb-row r2">{strip}</div>{popover}{menuPop}</header>;
  return <header class="topbar">{identity}{strip}{clock}{popover}{menuPop}</header>;
}

// ---------------------------------------------------------------- map chrome
function MapDock({ rect, wide, portrait }: { rect: Rect; wide: boolean; portrait: boolean }) {
  const u = useUI(); const [openMenu, setOpen] = useState(false); const lens = lensById(u.lens);
  const style = `left:${rect.x}px;top:${rect.y}px`;
  const st = game.st!;
  const zoom = !portrait && (
    <>
      <button class="ib" aria-label="Thu nhỏ" title="Thu nhỏ" onClick={() => mapControls.zoom(1.6)}><Icon name="minus" class="i" /></button>
      <button class="ib" aria-label="Phóng to" title="Phóng to" onClick={() => mapControls.zoom(0.62)}><Icon name="plus" class="i" /></button>
      <button class="ib" aria-label="Về thủ đô" title="Về thủ đô" onClick={() => { const c = st.countries[viewedId(st)]; if (c) mapControls.focusRegion(c.capital, 0.02); }}><Icon name="target" class="i" /></button>
      <span class="sep" />
    </>
  );
  if (!wide) return (
    <div class="mapdock" style={style}>
      {zoom}
      <button class="lsel" aria-haspopup="menu" aria-expanded={openMenu} onClick={() => setOpen(!openMenu)}><Mdl icon={LENS_ICON[u.lens]} size="sm" /><span class="ellipsis" style="max-width:110px">{lens.name}</span><span class="car">{portrait ? '▾' : '▴'}</span></button>
      {!portrait && <button class={`ib${u.fullMap ? ' on' : ''}`} style="border-left:1px solid var(--line-2)" aria-label="Bản đồ toàn màn hình" title="Bản đồ toàn màn hình" onClick={() => ui.set({ fullMap: !u.fullMap, region: null })}><Icon name="fullscreen" class="i" /></button>}
      {openMenu && <div class="catch" onClick={() => setOpen(false)} />}
      {openMenu && (
        <div class={`layermenu${portrait ? ' down' : ''}`} role="menu" style={portrait ? 'left:-1px;right:auto' : ''}>
          {LENSES.map((l) => <button key={l.id} role="menuitemradio" aria-checked={u.lens === l.id} class={u.lens === l.id ? 'on' : ''} onClick={() => { ui.set({ lens: l.id }); setOpen(false); }}><Mdl icon={LENS_ICON[l.id]} size="sm" /><span><b>{l.name}</b><small>{l.desc}</small></span></button>)}
        </div>
      )}
    </div>
  );
  return (
    <div class="mapdock" style={style} role="radiogroup" aria-label="Chế độ bản đồ">
      {zoom}
      {LENSES.map((l) => <Tip key={l.id} c={{ title: l.name, note: l.desc }}><button class={`ib${u.lens === l.id ? ' on' : ''}`} role="radio" aria-checked={u.lens === l.id} aria-label={l.name} onClick={() => ui.set({ lens: l.id })}><Icon name={LENS_ICON[l.id]} class="i" /></button></Tip>)}
      <span class="name" style="width:140px">{lens.name}</span>
      <button class={`ib${u.fullMap ? ' on' : ''}`} style="border-left:1px solid var(--line-2)" aria-label="Bản đồ toàn màn hình" title="Bản đồ toàn màn hình (F)" onClick={() => ui.set({ fullMap: !u.fullMap, region: null })}><Icon name="fullscreen" class="i" /></button>
    </div>
  );
}
function Legend({ x, y }: { x: number; y: number }) {
  const u = useUI(); const st = game.st!; const lens = lensById(u.lens); const items = lens.legend(st, viewedId(st)).slice(0, 8);
  return (
    <div class="legend hud-fade" style={`left:${x}px;top:${y}px`}>
      <div class="t">{lens.name}</div>{lens.unit && <div class="u">{lens.unit}</div>}
      {items.map((it) => <div class="it" key={it.label}><span class={`sw${it.pattern === 'hatch' ? ' hatch' : ''}`} style={`background-color:${it.color}`} /><span class="ellipsis">{it.label}</span></div>)}
    </div>
  );
}
function ZoomBar({ x, y }: { x: number; y: number }) {
  const st = game.st!;
  return (
    <div class="zoombar" style={`left:${x}px;top:${y}px`}>
      <button class="ib" aria-label="Phóng to" title="Phóng to" onClick={() => mapControls.zoom(0.62)}><Icon name="plus" class="i" /></button>
      <button class="ib" aria-label="Thu nhỏ" title="Thu nhỏ" onClick={() => mapControls.zoom(1.6)}><Icon name="minus" class="i" /></button>
      <button class="ib" aria-label="Về thủ đô" title="Về thủ đô" onClick={() => { const c = st.countries[viewedId(st)]; if (c) mapControls.focusRegion(c.capital, 0.02); }}><Icon name="target" class="i" /></button>
    </div>
  );
}
function MapTip({ id, x, y }: { id: string; x: number; y: number }) {
  const st = game.st!; const r = st.regions.find((q) => q.id === id); if (!r) return null; const o = st.countries[r.owner];
  return <div class="maptip" style={`left:${Math.min(window.innerWidth - 240, x + 16)}px;top:${y + 18}px`}><b>{regionName(id)}</b>{o?.decentralized ? 'Chính thể phi tập trung' : shortName(st, r.owner)} · {compact(r.pop)} dân{r.controller !== r.owner ? ` · bị ${shortName(st, r.controller)} chiếm` : ''}</div>;
}
/** Card shown where the player tapped: the state's essentials and the next actions. */
function ContextCard({ id, x, y, w }: { id: string; x: number; y: number; w: number }) {
  const st = game.st!; const r = st.regions.find((q) => q.id === id); if (!r) return null; const o = st.countries[r.owner]; const dbr = data().region.get(id);
  const mine = r.owner === st.player || !st.player;
  return (
    <div class="ctxcard frame surface" style={`left:${x}px;top:${y}px;width:${w}px`}>
      <div class="ch">
        <Flag c={o} />
        <div class="grow"><h3 class="ellipsis">{dbr?.name ?? id}</h3><div class="s">{o?.decentralized ? 'Chính thể phi tập trung' : shortName(st, r.owner)}{r.id === o?.capital ? ' · thủ đô' : ''}{r.controller !== r.owner ? ` · bị ${shortName(st, r.controller)} chiếm` : ''}</div></div>
        <button class="ib" aria-label="Bỏ chọn" onClick={() => ui.set({ region: null })}><Icon name="close" class="i" /></button>
      </div>
      <div class="cb">
        <OwnerLine id={r.owner} />
        <div class="stats">
          <div><div class="l">Dân số</div><div class="v num">{compact(r.pop)}</div></div>
          <div><div class="l">Mức sống</div><div class="v num">{fmt(r.sol, 2)}</div></div>
          <div><div class="l">Biết chữ</div><div class="v num">{pct(r.literacy)}</div></div>
        </div>
        <div class="btns">
          <button class="btn sm" onClick={() => ui.set({ regionDetail: true, sheetSnap: 0 })}><Icon name="pin" class="i" />Chi tiết vùng</button>
          {o && !o.decentralized && <button class="btn sm" onClick={() => (mine ? openCountry(r.owner) : openCountryActions(st, r.owner))}><Icon name={mine ? 'crown' : 'diplomacy'} class="i" />{mine ? 'Quốc gia' : 'Ngoại giao'}</button>}
          {o && (o.decentralized || !mine) && <button class="btn sm" onClick={() => openCountry(r.owner)}><Icon name="scroll" class="i" />Hồ sơ</button>}
        </div>
      </div>
    </div>
  );
}
/** First sentence of the owner's sourced description (Wikipedia lead), so a tap on the map explains whose land it is. */
function OwnerLine({ id }: { id: string }) {
  useContent();
  const t = bestText(entityContent(id)?.texts);
  if (!t) return null;
  const m = t.text.match(/^(.{40,220}?[.!?])(\s|$)/s); const first = m ? m[1] : t.text.slice(0, 200) + '…';
  return <div class="ctxdesc" lang={t.lang}>{first} <span class="dim">— Wikipedia{t.lang === 'en' ? ' (tiếng Anh)' : ''}</span></div>;
}
/** Ongoing processes of the viewed country, each a jump link. */
function Outliner({ x, y }: { x: number; y: number }) {
  const g = useGame(); const st = g.st!; const id = viewedId(st); const c = st.countries[id];
  const [openO, setOpen] = useState(true);
  const items: VNode[] = [];
  if (c.research.current) { const p = Math.min(1, c.research.progress / techCost(st, c, c.research.current)); items.push(<button class="oi" key="r" onClick={() => ui.go('tech', data().tech.get(c.research.current!)?.tree ?? 'production')}><Mdl icon="research" color="#7fc7c2" /><span class="grow"><span class="ot">{techName(c.research.current)}</span><span class="pbar"><i style={`width:${p * 100}%`} /></span></span><span class="num">{pct(p)}</span></button>); }
  else items.push(<button class="oi warn" key="r0" onClick={() => ui.go('tech', 'production')}><Mdl icon="research" color="var(--warn)" /><span class="grow"><span class="ot">Chưa chọn nghiên cứu</span></span></button>);
  if (c.reform) items.push(<button class="oi" key="f" onClick={() => ui.go('politics', 'laws')}><Mdl icon="laws" color="#e3a7a0" /><span class="grow"><span class="ot">Cải cách: {lawVi(c.reform.value)}</span><span class="pbar"><i style={`width:${c.reform.progress * 100}%`} /></span></span><span class="num">{pct(c.reform.progress)}</span></button>);
  for (const w of st.wars.filter((x) => x.attackers.members.includes(id) || x.defenders.members.includes(id)).slice(0, 3)) { const sc = Math.round(w.attackers.members.includes(id) ? w.score : -w.score) || 0; items.push(<button class="oi" key={w.id} onClick={() => ui.go('military', 'wars')}><Mdl icon="military" color="#e38c7c" /><span class="grow"><span class="ot">{w.name}</span></span><span class={`num ${sc > 0 ? 'pos' : sc < 0 ? 'neg' : ''}`}>{sc > 0 ? '+' : ''}{fmt(sc)}</span></button>); }
  const missions = (st.journal ?? []).filter((j) => j.status === 'active' && j.country === id && st.player === id).length;
  if (missions) items.push(<button class="oi warn" key="jr" onClick={() => ui.go('chronicle', 'decisions')}><Mdl icon="scroll" color="var(--warn)" /><span class="grow"><span class="ot">{missions} việc cần quyết định</span></span></button>);
  const storyN = (st.pendingStory ?? []).filter((p) => p.country === id && st.player === id).length;
  if (storyN) items.push(<button class="oi warn" key="se" onClick={() => ui.go('chronicle', 'decisions')}><Mdl icon="scroll" color="var(--warn)" /><span class="grow"><span class="ot">{storyN} sự kiện đang chờ</span></span></button>);
  for (const j of (st.storyJournals ?? []).filter((x) => x.country === id).slice(0, 3)) { const def = journalDef(j.id); if (def) items.push(<button class="oi" key={`sj${j.id}`} onClick={() => ui.go('chronicle', 'decisions')}><Mdl icon="scroll" color="#c9a24a" /><span class="grow"><span class="ot">{def.title_vi}</span>{def.progress && <span class="pbar"><i style={`width:${Math.min(100, j.progress / (def.progress.max ?? 100) * 100)}%`} /></span>}</span></button>); }
  if (st.pendingPlayerDecisions.length && st.player === id) items.push(<button class="oi warn" key="d" onClick={() => ui.go('chronicle', 'decisions')}><Mdl icon="scroll" color="var(--warn)" /><span class="grow"><span class="ot">{st.pendingPlayerDecisions.length} quyết định đang chờ</span></span></button>);
  const stats = st.marketStats?.[marketOf(st, c)]; const short = stats ? Object.entries(stats).filter(([, v]) => v.short >= 0.1).sort((a, b) => b[1].short - a[1].short).slice(0, 2) : [];
  for (const [gd, v] of short) items.push(<button class="oi" key={`s${gd}`} onClick={() => ui.go('economy', 'market')}><Mdl icon={gd} color="#e9c46a" /><span class="grow"><span class="ot">Thiếu {GOOD_VI[gd].toLowerCase()}</span></span><span class="num neg">{pct(v.short)}</span></button>);
  return (
    <aside class="outliner hud-fade" style={`left:${x}px;top:${y}px`} aria-label="Theo dõi">
      <button class="oh" onClick={() => setOpen(!openO)} aria-expanded={openO}><span>Theo dõi</span><span class="dim num">{items.length}</span><span>{openO ? '▴' : '▾'}</span></button>
      {openO && items}
    </aside>
  );
}

// ---------------------------------------------------------------- windows
function useSheetDrag(stageH: number, onClose: () => void) {
  const drag = useRef<{ y0: number; top0: number } | null>(null);
  return (e: PointerEvent) => {
    if (window.innerWidth > window.innerHeight) return;
    const el = (e.currentTarget as HTMLElement).closest('.window') as HTMLElement | null; if (!el) return;
    drag.current = { y0: e.clientY, top0: el.offsetTop }; el.style.transition = 'none';
    const move = (ev: PointerEvent) => { if (!drag.current) return; el.style.top = `${Math.max(TOP_P, drag.current.top0 + ev.clientY - drag.current.y0)}px`; };
    const up = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up);
      if (!drag.current) return; const t = drag.current.top0 + ev.clientY - drag.current.y0 - TOP_P; drag.current = null; el.style.transition = ''; el.style.top = '';
      if (t > stageH * 0.82) { onClose(); return; }
      const snaps = ([1, 0, 2] as const).map((k) => [k, Math.abs(SNAP_TOP[k] * stageH - t)] as const).sort((a, b) => a[1] - b[1]);
      ui.set({ sheetSnap: snaps[0][0], winCollapsed: false });
    };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
  };
}
function winStyle(portrait: boolean, rect: Rect | null, sheetTop: number) {
  return portrait ? `top:${sheetTop}px;bottom:${DOCK_P}px` : rect ? `left:${rect.x}px;top:${rect.y}px;width:${rect.w}px;height:${rect.h}px` : '';
}
function MainWindow({ id, portrait, rect, sheetTop, stageH }: { id: ScreenId; portrait: boolean; rect: Rect | null; sheetTop: number; stageH: number }) {
  const u = useUI(); const st = game.st!; const meta = SCREENS[id]!;
  const tab = u.tabs[id] ?? meta.tabs?.[0][0] ?? '';
  const countryId = id === 'country' ? (u.country ?? viewedId(st)) : '';
  const close = () => ui.set({ screen: 'map', country: null, winCollapsed: false });
  const grip = useSheetDrag(stageH, close);
  let body: VNode | null = null;
  switch (id) {
    case 'country': body = <CountryScreen st={st} id={countryId} tab={tab} />; break;
    case 'economy': body = <EconomyScreen st={st} tab={tab} />; break;
    case 'society': body = <SocietyScreen st={st} tab={tab} />; break;
    case 'politics': body = <PoliticsScreen st={st} tab={tab} />; break;
    case 'tech': body = <TechScreen st={st} tab={tab} />; break;
    case 'diplomacy': body = <DiplomacyScreen st={st} tab={tab} />; break;
    case 'military': body = <MilitaryScreen st={st} tab={tab} />; break;
    case 'chronicle': body = <JournalScreen st={st} tab={tab} />; break;
    case 'world': body = <WorldScreen st={st} />; break;
    case 'system': body = <SystemScreen st={st} />; break;
  }
  const who = id === 'country' ? countryId : viewedId(st);
  const title = id === 'country' && countryId !== viewedId(st) ? shortName(st, countryId) : meta.title;
  const ctx = id === 'world' || id === 'system' ? `${MONTH_VI[st.date.m - 1]} ${st.date.y}` : `${shortName(st, who)} · ${MONTH_VI[st.date.m - 1]} ${st.date.y}`;
  return (
    <section class={`window main frame surface${u.winCollapsed ? ' collapsed' : ''}`} style={winStyle(portrait, rect, sheetTop)} aria-label={title}>
      <WinHead title={title} ctx={ctx} icon={meta.icon} mod={id} grip={portrait} onGrip={portrait ? grip : undefined} onClose={close}
        onCollapse={() => ui.set({ winCollapsed: !u.winCollapsed })} collapsed={u.winCollapsed}
        onExpand={!portrait ? () => ui.set({ panelWide: !u.panelWide, winCollapsed: false }) : undefined} expanded={u.panelWide} />
      {meta.tabs && <Tabs tabs={meta.tabs} value={tab} onChange={(t) => ui.tab(id, t)} icons={meta.tabIcons} />}
      <div class="win-body" key={id + tab + countryId}>{body}</div>
    </section>
  );
}
function MoreWindow({ portrait, rect, sheetTop, stageH }: { portrait: boolean; rect: Rect | null; sheetTop: number; stageH: number }) {
  const close = () => ui.set({ screen: 'map' }); const grip = useSheetDrag(stageH, close);
  return (
    <section class="window main frame surface" style={winStyle(portrait, rect, sheetTop)} aria-label="Thêm">
      <WinHead title="Thêm" icon="menu" grip={portrait} onGrip={portrait ? grip : undefined} onClose={close} />
      <div class="win-body pad">
        {MORE.map((id) => { const m = SCREENS[id]!; return <div class="row tap" key={id} onClick={() => ui.go(id)}><Mdl icon={m.icon} color={MODULE_COLOR[id]} /><div class="grow"><div class="t">{m.title}</div><div class="s">{m.hint}</div></div><span class="dim">›</span></div>; })}
        <div class="row tap" onClick={() => ui.set({ fullMap: true, screen: 'map', region: null })}><Mdl icon="fullscreen" /><div class="grow"><div class="t">Bản đồ toàn màn hình</div><div class="s">Ẩn giao diện, chỉ giữ điều khiển bản đồ</div></div><span class="dim">›</span></div>
      </div>
    </section>
  );
}
