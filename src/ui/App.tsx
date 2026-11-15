// Application shell: top bar, navigation (rail in landscape, bottom bar in portrait), map stage, panels.
import { useEffect, useRef } from 'preact/hooks';
import type { VNode } from 'preact';
import { game, type Speed } from './game/controller';
import { ui, useUI, useGame, useOrientation, type ScreenId, type LensId } from './game/ui';
import { MapView, mapControls } from './map/MapView';
import { LENSES, lensById } from './map/lenses';
import type { MapGrid } from './map/mapData';
import { Icon } from './components/icons';
import { ModalHost, PanelHead, Tabs, modals } from './components/ui';
import { rankings } from '../engine/metrics';
import { techCost } from '../engine/systems/technology';
import { shortName, fullName } from './game/names';
import { compact, fmt, pct, techName } from './i18n/vi';
import { viewedId } from './screens/common';
import { Setup } from './screens/Setup';
import { CountryScreen, COUNTRY_TABS } from './screens/Country';
import { EconomyScreen, ECONOMY_TABS } from './screens/Economy';
import { SocietyScreen, SOCIETY_TABS } from './screens/Society';
import { PoliticsScreen, POLITICS_TABS } from './screens/Politics';
import { TechScreen, TECH_TABS } from './screens/Tech';
import { DiplomacyScreen, DIPLOMACY_TABS } from './screens/Diplomacy';
import { MilitaryScreen, MILITARY_TABS } from './screens/Military';
import { JournalScreen, JOURNAL_TABS, InboxScreen } from './screens/Journal';
import { WorldScreen, SystemScreen } from './screens/World';
import { StateCard, RegionDetail } from './screens/StateCard';
import { saveSlot } from './game/storage';

const SCREENS: Partial<Record<ScreenId, { title: string; icon: string; tabs?: [string, string][] }>> = {
  country: { title: 'Quốc gia', icon: 'flag', tabs: COUNTRY_TABS }, economy: { title: 'Kinh tế', icon: 'economy', tabs: ECONOMY_TABS },
  society: { title: 'Xã hội', icon: 'society', tabs: SOCIETY_TABS }, politics: { title: 'Chính trị', icon: 'politics', tabs: POLITICS_TABS },
  tech: { title: 'Công nghệ', icon: 'tech', tabs: TECH_TABS }, diplomacy: { title: 'Ngoại giao', icon: 'diplomacy', tabs: DIPLOMACY_TABS },
  military: { title: 'Quân sự', icon: 'military', tabs: MILITARY_TABS }, chronicle: { title: 'Biên niên', icon: 'journal', tabs: JOURNAL_TABS },
  world: { title: 'Thế giới', icon: 'world' }, system: { title: 'Hệ thống', icon: 'menu' },
};
const RAIL: ScreenId[] = ['country', 'economy', 'society', 'politics', 'tech', 'diplomacy', 'military', 'chronicle'];
const BOTTOM: ScreenId[] = ['map', 'economy', 'society', 'diplomacy', 'military', 'more'];
const MORE: ScreenId[] = ['country', 'politics', 'tech', 'chronicle', 'world', 'system'];
const LENS_ICON: Record<LensId, string> = { political: 'flag', population: 'population', sol: 'society', literacy: 'literacy', diplomacy: 'diplomacy', market: 'market' };
const MONTH_VI = ['tháng Giêng', 'tháng Hai', 'tháng Ba', 'tháng Tư', 'tháng Năm', 'tháng Sáu', 'tháng Bảy', 'tháng Tám', 'tháng Chín', 'tháng Mười', 'tháng Mười một', 'tháng Chạp'];

export function App({ grid }: { grid: MapGrid }) {
  const u = useUI(); const g = useGame(); const orient = useOrientation(); const st = g.st;
  // autosave each January (offline, on device)
  const lastSave = useRef(-1);
  useEffect(() => { if (st && st.date.m === 1 && st.tick > 0 && st.tick !== lastSave.current && !game.busy) { lastSave.current = st.tick; saveSlot('Tự động lưu', game.save()).catch(() => game.toast('Không tự động lưu được (bộ nhớ thiết bị)', 'error')); } });
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if ((e.target as HTMLElement)?.tagName === 'INPUT') return; if (e.code === 'Space') { e.preventDefault(); game.setPaused(!game.paused); } if (/^Digit[1-5]$/.test(e.code)) game.setSpeed(Number(e.code.slice(5)) as Speed); if (e.code === 'Escape') { if (modals.get()) modals.close(); else ui.set({ screen: 'map' }); } };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, []);
  if (!u.started || !st) return <><Setup /><ModalHost /><Toasts /></>;
  if (game.busy) return <Loading />;
  const portrait = orient === 'portrait';
  const focus = viewedId(st);
  const scr = u.screen === 'more' ? null : SCREENS[u.screen];
  const panelOpen = !!scr;
  const sel = u.region;
  const selCountry = u.screen === 'country' ? (u.country ?? focus) : u.screen !== 'map' && u.screen !== 'world' && u.screen !== 'system' && u.screen !== 'more' ? focus : null;
  const pw = !portrait && panelOpen ? (u.panelWide ? '100%' : 'min(50%, 560px)') : '0px';
  return (
    <div class={`app ${orient}`}>
      <TopBar portrait={portrait} />
      {!portrait && <nav class="rail" aria-label="Điều hướng">{RAIL.map((id) => <NavBtn key={id} id={id} on={u.screen === id} caption />)}</nav>}
      <main class="stage" style={`--pw:${pw}`}>
        <MapView grid={grid} st={st} version={g.version} lens={u.lens} focus={focus} selRegion={sel} selCountry={selCountry}
          onSelect={(r) => ui.set({ region: r })} avoid={(w, h) => { const l = !portrait && panelOpen && !u.panelWide ? Math.min((window.innerWidth - 60) * 0.5, 560) : 0; const lens = lensById(u.lens); return [{ x: l + 6, y: 6, w: 250, h: 52 + lens.legend(st, focus).length * 20 }, { x: l + (w - l) / 2 - 175, y: h - 70, w: 350, h: 70 }, { x: w - 58, y: portrait ? h - 230 : 0, w: 58, h: portrait ? 170 : 170 }]; }} insetLeft={!portrait && panelOpen && !u.panelWide ? Math.min((window.innerWidth - 60) * 0.5, 560) : 0} />
        <div class="map-vignette" />
        {(!portrait || !panelOpen) && <MapChrome portrait={portrait} panelOpen={panelOpen} />}
        {sel && (!portrait || !panelOpen) && <StateCard st={st} id={sel} portrait={portrait} />}
        {scr && <Panel id={u.screen} portrait={portrait} />}
        {u.screen === 'more' && <MoreMenu />}
      </main>
      {portrait && <nav class="bottombar" aria-label="Điều hướng">{BOTTOM.map((id) => <NavBtn key={id} id={id} on={u.screen === id || (id === 'more' && MORE.includes(u.screen))} caption />)}</nav>}
      <ModalHost />
      <Toasts />
      {void sel}
    </div>
  );
}

function Loading() {
  const b = game.busy!;
  return <div class="loading"><div class="box"><h1>Dòng chảy Lịch sử</h1><div class="serif muted" style="margin-bottom:10px">{b.label} — {b.done}/{b.total} tháng</div><div class="bar"><i style={`width:${(b.done / b.total) * 100}%`} /></div></div></div>;
}
function Toasts() { const g = useGame(); return <div class="toasts" aria-live="polite">{g.toasts.map((t) => <div class={`toast ${t.kind}`} key={t.id}>{t.text}</div>)}</div>; }

function NavBtn({ id, on, caption }: { id: ScreenId; on: boolean; caption?: boolean }) {
  const meta = id === 'map' ? { title: 'Bản đồ', icon: 'map' } : id === 'more' ? { title: 'Thêm', icon: 'menu' } : SCREENS[id]!;
  return (
    <button class={`navbtn${on ? ' on' : ''}`} aria-label={meta.title} aria-current={on ? 'page' : undefined} onClick={() => (on && id !== 'map' ? ui.set({ screen: 'map' }) : ui.go(id))}>
      <span class={`round${on ? ' on' : ''}`}><Icon name={meta.icon} /></span>
      {caption && <span class="cap">{meta.title}</span>}
    </button>
  );
}

function TopBar({ portrait }: { portrait: boolean }) {
  const g = useGame(); const st = g.st!; const id = viewedId(st); const c = st.countries[id];
  const rank = rankings(st).findIndex((r) => r.id === id) + 1;
  const bal = c.income - c.expense;
  const unread = st.log.slice(game.readLogCount).filter((l) => l.actors.includes(id) || ['war', 'revolution', 'state'].includes(l.type)).length;
  const research = c.research.current ? Math.min(1, c.research.progress / techCost(st, c, c.research.current)) : null;
  const kpis: { icon: string; v: string; d?: string; dc?: string; lbl: string; go: () => void }[] = [
    { icon: 'treasury', lbl: 'Ngân khố', v: `¤${compact(c.treasury)}`, d: `${bal >= 0 ? '+' : '−'}${compact(Math.abs(bal))}`, dc: bal >= 0 ? 'pos' : 'neg', go: () => ui.go('economy', 'budget') },
    { icon: 'gdp', lbl: 'GDP', v: `¤${compact(c.gdp)}`, go: () => ui.go('country', 'stats') },
    { icon: 'legitimacy', lbl: 'Chính danh', v: fmt(c.legitimacy), go: () => ui.go('politics', 'gov') },
    { icon: 'prestige', lbl: 'Xếp hạng', v: `#${rank || '—'}`, go: () => ui.go('world') },
    { icon: 'population', lbl: 'Dân số', v: compact(c.stats.pop), go: () => ui.go('society', 'pop') },
    { icon: 'research', lbl: c.research.current ? techName(c.research.current) : 'Nghiên cứu', v: research !== null ? pct(research) : 'Chọn', go: () => ui.go('tech', 'production') },
    { icon: 'army', lbl: 'Lục quân', v: compact(c.army.manpower), go: () => ui.go('military', 'forces') },
  ];
  const identity = (
    <button class="identity" onClick={() => ui.set({ country: id, screen: 'country', tabs: { ...ui.get().tabs, country: 'overview' } })} aria-label={fullName(st, id)}>
      <span class="flag" style={`background:${c.color}`} />
      <span style="min-width:0;display:flex;flex-direction:column"><span class="nm">{shortName(st, id)}</span><span class="sub">{st.player ? (st.mode === 'historical' ? 'Lịch sử' : 'Sandbox') : 'Quan sát'}</span></span>
    </button>
  );
  const time = (
    <div class="timebox">
      <button class="round sm hit" aria-label="Thông báo" onClick={() => modals.open('Thông báo', () => <InboxScreen st={st} />)} style="position:relative"><Icon name="bell" />{unread > 0 && <span class="badge">{unread > 99 ? '99+' : unread}</span>}</button>
      {!portrait && <button class="round sm" aria-label="Thế giới" onClick={() => ui.go('world')}><Icon name="world" /></button>}
      {!portrait && <button class="round sm" aria-label="Hệ thống" onClick={() => ui.go('system')}><Icon name="menu" /></button>}
      <div class="date"><div class="d1">{st.date.y}</div><div class="d2">{MONTH_VI[st.date.m - 1]}</div></div>
      <button class="speed" aria-label={`Tốc độ ${g.speed}`} onClick={() => game.setSpeed(((g.speed % 5) + 1) as Speed)}>{[1, 2, 3, 4, 5].map((i) => <i key={i} class={i <= g.speed ? 'on' : ''} style={`height:${6 + i * 3}px`} />)}</button>
      <button class={`round${g.paused ? ' play' : ''}`} aria-label={g.paused ? 'Tiếp tục' : 'Tạm dừng'} onClick={() => game.setPaused(!g.paused)}><Icon name={g.paused ? 'play' : 'pause'} /></button>
    </div>
  );
  const strip = (
    <div class="kpis">
      {kpis.map((k) => (
        <button class="kpi" key={k.lbl} onClick={k.go} aria-label={k.lbl}>
          <Icon name={k.icon} />
          <span class="stack"><span class="lbl">{k.lbl}</span><span><span class="v num">{k.v}</span>{k.d && <span class={`d num ${k.dc}`}> {k.d}</span>}</span></span>
        </button>
      ))}
    </div>
  );
  if (portrait) return <header class="topbar"><div class="tb-row r1">{identity}<div style="flex:1" />{time}</div><div class="tb-row r2">{strip}</div></header>;
  return <header class="topbar">{identity}{strip}{time}</header>;
}

function MapChrome({ portrait, panelOpen }: { portrait: boolean; panelOpen: boolean }) {
  const u = useUI(); const st = game.st!; const lens = lensById(u.lens);
  const left = !portrait && panelOpen ? 'calc(var(--pw) + 10px)' : '10px';
  return (
    <>
      <div class="legend" style={portrait ? 'left:8px;top:8px' : `left:${left};top:10px`}>
        <h4>{lens.name}</h4>{lens.unit && <div class="u">{lens.unit}</div>}
        {lens.legend(st, viewedId(st)).map((it) => <div class="it" key={it.label}><span class={`sw${it.pattern === 'hatch' ? ' hatch' : ''}`} style={`background-color:${it.color}`} />{it.label}</div>)}
      </div>
      <div class="modebar" style={portrait ? 'left:50%;transform:translateX(-50%);bottom:10px' : `left:calc(var(--pw) + (100% - var(--pw)) / 2);transform:translateX(-50%);bottom:10px`} role="radiogroup" aria-label="Lớp bản đồ">
        {LENSES.map((l) => <button key={l.id} class={`round sm${u.lens === l.id ? ' on' : ''}`} role="radio" aria-checked={u.lens === l.id} aria-label={l.name} title={l.name} onClick={() => ui.set({ lens: l.id })}><Icon name={LENS_ICON[l.id]} /></button>)}
        <button class="round sm" aria-label="Mô tả lớp bản đồ" onClick={() => modals.open('Lớp bản đồ', () => <LensSheet />)}><Icon name="layers" /></button>
      </div>
      <div class="mapbtns" style={portrait ? 'right:8px;bottom:72px' : 'right:10px;top:10px'}>
        <button class="round sm" aria-label="Phóng to" onClick={() => mapControls.zoom(0.7)}><Icon name="plus" /></button>
        <button class="round sm" aria-label="Thu nhỏ" onClick={() => mapControls.zoom(1.43)}><Icon name="minus" /></button>
        <button class="round sm" aria-label="Về thủ đô" onClick={() => { const c = st.countries[viewedId(st)]; if (c) mapControls.focusRegion(c.capital, 0.09); }}><Icon name="target" /></button>
      </div>
    </>
  );
}
function LensSheet() {
  const u = useUI(); const st = game.st!;
  return (
    <div>
      {LENSES.map((l) => (
        <button class={`entry${u.lens === l.id ? ' on' : ''}`} key={l.id} onClick={() => { ui.set({ lens: l.id }); modals.close(); }}>
          <span class="ico"><Icon name={LENS_ICON[l.id]} /></span>
          <div class="main"><div class="ttl">{l.name}{u.lens === l.id ? ' ✓' : ''}</div><div class="meta" style="white-space:normal">{l.desc}</div>
            <div style="display:flex;gap:3px;margin-top:4px">{l.legend(st, viewedId(st)).map((it) => <span key={it.label} class={`sw${it.pattern === 'hatch' ? ' hatch' : ''}`} style={`background-color:${it.color}`} title={it.label} />)}</div></div>
        </button>
      ))}
    </div>
  );
}

function Panel({ id, portrait }: { id: ScreenId; portrait: boolean }) {
  const u = useUI(); const st = game.st!; const meta = SCREENS[id]!;
  const tab = u.tabs[id] ?? meta.tabs?.[0][0] ?? '';
  const countryId = id === 'country' ? (u.country ?? viewedId(st)) : '';
  let body: VNode | null = null;
  switch (id) {
    case 'country': body = <CountryScreen st={st} id={countryId} tab={tab} />; break;
    case 'economy': body = <EconomyScreen st={st} tab={tab} portrait={portrait} />; break;
    case 'society': body = <SocietyScreen st={st} tab={tab} />; break;
    case 'politics': body = <PoliticsScreen st={st} tab={tab} />; break;
    case 'tech': body = <TechScreen st={st} tab={tab} />; break;
    case 'diplomacy': body = <DiplomacyScreen st={st} tab={tab} />; break;
    case 'military': body = <MilitaryScreen st={st} tab={tab} />; break;
    case 'chronicle': body = <JournalScreen st={st} tab={tab} />; break;
    case 'world': body = <WorldScreen st={st} />; break;
    case 'system': body = <SystemScreen st={st} />; break;
  }
  const title = id === 'country' && countryId !== viewedId(st) ? shortName(st, countryId) : meta.title;
  return (
    <section class={`panel ${portrait ? 'sheet' : 'side'}${u.panelWide && !portrait ? ' wide' : ''}`} aria-label={title}>
      <PanelHead title={title} onClose={() => ui.set({ screen: 'map', country: null })} onExpand={!portrait ? () => ui.set({ panelWide: !u.panelWide }) : undefined} />
      {meta.tabs && <Tabs tabs={meta.tabs} value={tab} onChange={(t) => ui.tab(id, t)} />}
      <div class="pbody" key={id + tab}>{body}</div>
    </section>
  );
}

function MoreMenu() {
  return (
    <section class="panel sheet" aria-label="Thêm">
      <PanelHead title="Thêm" onClose={() => ui.set({ screen: 'map' })} />
      <div class="pbody">
        {MORE.map((id) => { const m = SCREENS[id]!; return <button class="entry" key={id} onClick={() => ui.go(id)}><span class="ico"><Icon name={m.icon} /></span><div class="main"><div class="ttl">{m.title}</div></div><span class="dim">›</span></button>; })}
      </div>
    </section>
  );
}
export { RegionDetail };
