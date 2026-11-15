// Application shell. Landscape: top bar, left toolbar, map stage with a main window docked left, an optional
// detail window docked beside it and a region window docked right. Portrait: two-row top bar, map, bottom
// navigation; windows are bottom sheets with three snap heights. Map chrome (layers, legend, zoom, region card)
// is placed in the free part of the map and reported to the label layout so nothing overlaps.
import { useEffect, useRef, useState } from 'preact/hooks';
import type { VNode } from 'preact';
import { game, type Speed } from './game/controller';
import { ui, useUI, useGame, type ScreenId, type LensId } from './game/ui';
import { MapView, mapControls, type MapAssets } from './map/MapView';
import { LENSES, lensById } from './map/lenses';
import { Icon } from './components/icons';
import { ModalHost, TipHost, Tip, WinHead, Tabs, modals, details, hideTip, type TipContent } from './components/ui';
import { rankings } from '../engine/metrics';
import { techCost, researchPoints } from '../engine/systems/technology';
import { shortName, fullName } from './game/names';
import { compact, fmt, pct, techName, govVi, lawVi, GOOD_VI } from './i18n/vi';
import { data } from '../engine/data/db';
import { marketOf } from '../engine/systems/economy';
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
import { RegionWindow } from './screens/StateCard';
import { saveSlot } from './game/storage';

type Meta = { title: string; icon: string; tabs?: [string, string][]; hint: string };
const SCREENS: Partial<Record<ScreenId, Meta>> = {
  country: { title: 'Quốc gia', icon: 'flag', tabs: COUNTRY_TABS, hint: 'Tổng quan quốc gia, hồ sơ lịch sử, chỉ số theo năm' },
  economy: { title: 'Kinh tế', icon: 'economy', tabs: ECONOMY_TABS, hint: 'Thị trường, công trình, xây dựng, ngân sách' },
  society: { title: 'Dân số', icon: 'society', tabs: SOCIETY_TABS, hint: 'Tầng lớp, phân bố mức sống và biết chữ, vùng, văn hóa' },
  politics: { title: 'Chính trị', icon: 'politics', tabs: POLITICS_TABS, hint: 'Chính phủ, nhóm lợi ích, luật pháp và cải cách' },
  tech: { title: 'Công nghệ', icon: 'tech', tabs: TECH_TABS, hint: 'Cây công nghệ theo niên đại phát minh' },
  diplomacy: { title: 'Ngoại giao', icon: 'diplomacy', tabs: DIPLOMACY_TABS, hint: 'Quan hệ, hiệp ước, chư hầu và đối thủ' },
  military: { title: 'Quân sự', icon: 'military', tabs: MILITARY_TABS, hint: 'Lực lượng và các cuộc chiến' },
  chronicle: { title: 'Biên niên', icon: 'journal', tabs: JOURNAL_TABS, hint: 'Quyết định lịch sử, nhật ký, lãnh thổ, so với lịch sử' },
  world: { title: 'Thế giới', icon: 'world', hint: 'Bảng xếp hạng các quốc gia' },
  system: { title: 'Hệ thống', icon: 'menu', hint: 'Lưu, tải, ván mới, ghi công' },
  more: { title: 'Thêm', icon: 'menu', hint: '' },
};
const TOOLS: ScreenId[] = ['country', 'economy', 'society', 'politics', 'tech', 'diplomacy', 'military', 'chronicle'];
const NAV: ScreenId[] = ['map', 'economy', 'politics', 'diplomacy', 'military', 'more'];
const MORE: ScreenId[] = ['country', 'society', 'tech', 'chronicle', 'world', 'system'];
export const LENS_ICON: Record<LensId, string> = { political: 'flag', population: 'population', economy: 'gdp', sol: 'society', literacy: 'literacy', resources: 'iron', diplomacy: 'diplomacy', military: 'military', market: 'market' };
const MONTH_VI = ['tháng Giêng', 'tháng Hai', 'tháng Ba', 'tháng Tư', 'tháng Năm', 'tháng Sáu', 'tháng Bảy', 'tháng Tám', 'tháng Chín', 'tháng Mười', 'tháng Mười một', 'tháng Chạp'];
/** Portrait sheet heights: top edge as a share of the stage height (0 = full). */
const SNAP_TOP: Record<0 | 1 | 2, number> = { 1: 0, 0: 0.34, 2: 0.6 };

function useViewport(): [number, number] {
  const [v, setV] = useState<[number, number]>([window.innerWidth, window.innerHeight]);
  useEffect(() => { const f = () => setV([window.innerWidth, window.innerHeight]); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }, []);
  return v;
}

export const scopeKey = () => { const u = ui.get(); return `${u.screen}:${u.tabs[u.screen] ?? ''}:${u.country ?? ''}`; };

export function App({ assets }: { assets: MapAssets }) {
  const u = useUI(); const g = useGame(); const det = details.use(); const [vw, vh] = useViewport(); const st = g.st;
  const lastSave = useRef(-1);
  const regionGrip = useSheetDrag(Math.max(1, (vw <= vh ? vh - 140 : vh - 44)), () => ui.set({ region: null, regionDetail: false }));
  useEffect(() => { if (st && st.date.m === 1 && st.tick > 0 && st.tick !== lastSave.current && !game.busy) { lastSave.current = st.tick; saveSlot('Tự động lưu', game.save()).catch(() => game.toast('Không tự động lưu được (bộ nhớ thiết bị)', 'error')); } });
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (e.code === 'Space') { e.preventDefault(); game.setPaused(!game.paused); }
      if (/^Digit[1-5]$/.test(e.code)) game.setSpeed(Number(e.code.slice(5)) as Speed);
      if (e.code === 'Escape') { if (modals.get()) modals.close(); else if (details.get()) details.close(); else if (ui.get().regionDetail) ui.set({ regionDetail: false }); else ui.set({ screen: 'map' }); }
    };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, []);
  const tabKey = scopeKey();
  useEffect(() => { const d = details.get(); if (d && d.scope !== tabKey) details.close(); hideTip(); }, [tabKey]);
  if (!u.started || !st) return <><Setup /><ModalHost /><TipHost /><Toasts /></>;
  if (game.busy) return <Loading />;

  const portrait = vw <= vh;
  const focus = viewedId(st);
  const meta = SCREENS[u.screen]; const winOpen = !!meta;
  const selCountry = u.screen === 'country' ? (u.country ?? focus) : winOpen && u.screen !== 'world' && u.screen !== 'system' && u.screen !== 'more' ? focus : null;

  // ---- layout (stage coordinates, CSS px)
  const stageW = portrait ? vw : vw - 52; const stageH = portrait ? vh - 82 - 58 : vh - 44;
  let mainW = 0, sideW = 0, regW = 0, sheetTop = stageH;
  const regionOpen = !!u.region && u.regionDetail;
  if (!portrait) {
    if (winOpen) mainW = u.panelWide ? stageW : Math.min(Math.round(stageW * 0.54), 600);
    if (det && winOpen && !u.panelWide) sideW = Math.min(Math.round(stageW * 0.36), 380);
    if (regionOpen) regW = Math.min(Math.round(stageW * 0.34), 360);
  } else if (winOpen || regionOpen) sheetTop = Math.round(stageH * SNAP_TOP[u.sheetSnap]);
  // a docked window that does not fit overlays the others instead of shrinking the map to nothing
  const regFits = mainW + sideW + regW <= stageW;
  const freeL = Math.min(mainW + sideW, stageW), freeR = regFits ? regW : 0, freeB = portrait ? stageH - sheetTop : 0;
  const freeW = Math.max(0, stageW - freeL - freeR), freeH = stageH - freeB;
  const showChrome = portrait ? freeH > 150 : freeW > 240;
  const lens = lensById(u.lens); const legendItems = lens.legend(st, focus);
  const compactLayer = portrait || freeW < 560;
  const outliner = !portrait && freeW >= 600;
  const rects = {
    layer: { x: freeL + 8, y: 8, w: compactLayer ? 220 : 9 * 38 + 150, h: 40 },
    legend: { x: freeL + 8, y: 0, w: 220, h: 34 + Math.min(legendItems.length, 8) * 19 },
    zoom: { x: stageW - freeR - 48, y: freeH - 129, w: 40, h: 121 },
    outl: { x: stageW - freeR - 238, y: 8, w: 230, h: 260 },
  };
  rects.legend.y = freeH - rects.legend.h - 8;
  const avoid = (): { x: number; y: number; w: number; h: number }[] => {
    const a = [] as { x: number; y: number; w: number; h: number }[];
    if (showChrome) a.push(rects.layer, rects.zoom, rects.legend);
    if (outliner) a.push(rects.outl);
    if (freeR) a.push({ x: stageW - freeR, y: 0, w: freeR, h: stageH });
    if (freeB) a.push({ x: 0, y: freeH, w: stageW, h: freeB });
    return a;
  };
  mapControls.setInsets({ l: freeL, r: freeR, t: 0, b: freeB });
  const select = (r: string | null) => ui.set({ region: r, regionDetail: !!r, ...(portrait && r && !winOpen && !regionOpen ? { sheetSnap: 2 as const } : {}) });

  return (
    <div class={`app ${portrait ? 'portrait' : 'landscape'}`}>
      <TopBar portrait={portrait} />
      {!portrait && (
        <nav class="toolbar" aria-label="Các cửa sổ">
          {TOOLS.map((id) => <ToolBtn key={id} id={id} on={u.screen === id} />)}
        </nav>
      )}
      <main class="stage">
        <MapView assets={assets} st={st} version={g.version} lens={u.lens} focus={focus} selRegion={u.region} selCountry={selCountry} onSelect={select} insetLeft={freeL} avoid={avoid} />
        <div class="mapshade" style={`left:${freeL}px;right:${freeR}px;bottom:${freeB}px`} />
        {showChrome && <LayerBar compact={compactLayer} x={rects.layer.x} />}
        {showChrome && <Legend x={rects.legend.x} bottom={freeB + 8} />}
        {showChrome && <ZoomBar right={freeR + 8} bottom={freeB + 8} />}
        {outliner && <Outliner right={freeR + 8} />}
        {winOpen && u.screen !== 'more' && <MainWindow id={u.screen} portrait={portrait} width={mainW} top={sheetTop} stageH={stageH} />}
        {u.screen === 'more' && <MoreWindow portrait={portrait} width={mainW} top={sheetTop} stageH={stageH} />}
        {det && winOpen && (
          <section class="window side detail" style={portrait ? `top:${sheetTop}px;z-index:22` : `left:${u.panelWide ? stageW - Math.min(380, Math.round(stageW * 0.4)) : mainW}px;width:${u.panelWide ? Math.min(380, Math.round(stageW * 0.4)) : sideW}px`} aria-label={det.title}>
            <WinHead title={det.title} ctx={det.ctx} onBack={portrait ? () => details.close() : undefined} onClose={portrait ? undefined : () => details.close()} />
            <div class="win-body pad" key={det.key}>{det.body()}</div>
          </section>
        )}
        {regionOpen && <RegionWindow st={st} id={u.region!} style={portrait ? `top:${sheetTop}px;z-index:23` : `right:0;width:${regW}px;z-index:${regFits ? 20 : 24}`} portrait={portrait} onGrip={portrait ? regionGrip : undefined} />}
      </main>
      {portrait && <nav class="nav" aria-label="Điều hướng">{NAV.map((id) => <NavBtn key={id} id={id} on={u.screen === id || (id === 'more' && MORE.includes(u.screen))} />)}</nav>}
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
function ToolBtn({ id, on }: { id: ScreenId; on: boolean }) {
  const m = SCREENS[id]!;
  return <Tip c={{ title: m.title, note: m.hint }}><button class={`tool${on ? ' on' : ''}`} aria-label={m.title} aria-current={on ? 'page' : undefined} onClick={() => open(id)}><Icon name={m.icon} /></button></Tip>;
}
function NavBtn({ id, on }: { id: ScreenId; on: boolean }) {
  const m = id === 'map' ? { title: 'Bản đồ', icon: 'map' } : SCREENS[id]!;
  return <button class={`tool${on ? ' on' : ''}`} aria-label={m.title} aria-current={on ? 'page' : undefined} onClick={() => (id === 'map' ? ui.set({ screen: 'map' }) : open(id))}><Icon name={m.icon} /><span>{m.title}</span></button>;
}

// ---------------------------------------------------------------- top bar
function TopBar({ portrait }: { portrait: boolean }) {
  const g = useGame(); const st = g.st!; const id = viewedId(st); const c = st.countries[id];
  const rk = rankings(st); const rank = rk.findIndex((r) => r.id === id) + 1; const gdpRank = [...rk].sort((a, b) => b.gdp - a.gdp).findIndex((r) => r.id === id) + 1;
  const bal = c.income - c.expense;
  const unread = st.log.slice(game.readLogCount).filter((l) => l.actors.includes(id) || ['war', 'revolution', 'state'].includes(l.type)).length;
  const cost = c.research.current ? techCost(st, c, c.research.current) : 0; const research = c.research.current ? Math.min(1, c.research.progress / cost) : null;
  const pts = researchPoints(st, c); const h = st.history[id] ?? []; const g1 = h.length >= 2 ? h[h.length - 1] : null, g0 = h.length >= 2 ? h[h.length - 2] : null; const gdpYoY = g1 && g0 && g0.gdp ? g1.gdp / g0.gdp - 1 : null;
  const [pop, setPop] = useState<{ i: number; x: number; y: number } | null>(null);
  const kpis: { icon: string; v: string; d?: string; dc?: string; tip: TipContent; go: () => void; open: string }[] = [
    { icon: 'treasury', v: `¤${compact(c.treasury)}`, d: `${bal >= 0 ? '+' : '−'}${compact(Math.abs(bal))}`, dc: bal >= 0 ? 'pos' : 'neg', go: () => ui.go('economy', 'budget'), open: 'Ngân sách',
      tip: { title: 'Ngân khố', lines: [['Thu / tháng', `¤ ${compact(c.income)}`], ['Chi / tháng', `¤ ${compact(c.expense)}`], ['Cán cân', `${bal >= 0 ? '+' : '−'}${compact(Math.abs(bal))}`], ['Nợ công', `¤ ${compact(c.debt)}`]], note: 'Chạm để mở Ngân sách.' } },
    { icon: 'gdp', v: `¤${compact(c.gdp)}`, d: gdpYoY !== null ? `${gdpYoY >= 0 ? '▲' : '▼'}${fmt(Math.abs(gdpYoY) * 100, 1)}%` : undefined, dc: gdpYoY !== null && gdpYoY >= 0 ? 'pos' : 'neg', go: () => ui.go('economy', 'overview'), open: 'Kinh tế',
      tip: { title: 'GDP / năm', lines: [['GDP / người', `¤ ${fmt(c.gdp / Math.max(1, c.stats.pop), 1)}`], ['Hạng GDP thế giới', `#${gdpRank || '—'}`], ['Công nghiệp hóa', pct(c.stats.industry, 1)]], note: g1 && g0 ? `Biến động: mẫu ngày 1/1/${g1.y} so với 1/1/${g0.y}.` : 'Chưa có hai mẫu năm để so sánh.' } },
    { icon: 'legitimacy', v: fmt(c.legitimacy), go: () => ui.go('politics', 'gov'), open: 'Chính phủ', tip: { title: 'Chính danh', lines: [['Chính thể', govVi(c.govLabel)], ['Dân cực đoan', pct(c.radicalism)]], note: 'Thang 0–100. Chính danh thấp làm tăng nguy cơ cách mạng.' } },
    { icon: 'prestige', v: `#${rank || '—'}`, go: () => ui.go('world'), open: 'Thế giới', tip: { title: 'Xếp hạng sức mạnh', lines: [['Hạng', `#${rank || '—'} / ${rk.length}`], ['Uy tín', fmt(c.prestige)], ['Tiếng xấu', fmt(c.infamy)]] } },
    { icon: 'population', v: compact(c.stats.pop), go: () => ui.go('society', 'pop'), open: 'Dân số', tip: { title: 'Dân số', lines: [['Biết chữ', pct(c.stats.literacy)], ['Mức sống TB', fmt(c.stats.sol, 2)], ['Số vùng', fmt(st.regions.filter((r) => r.owner === id).length)]] } },
    { icon: 'research', v: research !== null ? pct(research) : 'Chọn', go: () => ui.go('tech', 'production'), open: 'Công nghệ', tip: { title: 'Nghiên cứu', lines: [['Đang nghiên cứu', c.research.current ? techName(c.research.current) : '—'], ['Điểm / tháng', compact(pts)], ['Đã biết', `${c.techs.length} công nghệ`]] } },
    { icon: 'army', v: compact(c.army.manpower), go: () => ui.go('military', 'forces'), open: 'Quân sự', tip: { title: 'Lực lượng', lines: [['Lục quân', `${compact(c.army.manpower)} / mục tiêu ${compact(c.army.target)}`], ['Hải quân', `${fmt(c.navy.strength)} tàu`], ['Chiến tranh', fmt(st.wars.filter((w) => w.attackers.members.includes(id) || w.defenders.members.includes(id)).length)]] } },
  ];
  const identity = (
    <Tip c={{ title: fullName(st, id), lines: [['Chính thể', govVi(c.govLabel)], ['Nguyên thủ', c.leader.name.replace(/ \(.*generated\)/, '')], ['Chế độ', st.mode === 'historical' ? 'Lịch sử' : 'Sandbox']], note: st.player ? undefined : 'Chế độ quan sát: chọn nước theo dõi ở Thế giới.' }}>
      <button class="ident" onClick={() => ui.set({ country: id, screen: 'country', tabs: { ...ui.get().tabs, country: 'overview' } })} aria-label={fullName(st, id)}>
        <span class="flag" style={`background:${c.color}`} />
        <span style="min-width:0;display:flex;flex-direction:column"><span class="nm ellipsis">{shortName(st, id)}</span><span class="sub">{st.player ? (st.mode === 'historical' ? 'Lịch sử' : 'Sandbox') : 'Quan sát'}</span></span>
      </button>
    </Tip>
  );
  const clock = (
    <div class="clock">
      <button class="ib" aria-label="Thông báo" onClick={() => modals.open('Thông báo', () => <InboxScreen st={st} />)}><Icon name="bell" class="i" />{unread > 0 && <span class="badge">{unread > 99 ? '99+' : unread}</span>}</button>
      {!portrait && <Tip c={{ title: 'Thế giới', note: SCREENS.world!.hint }}><button class={`ib${ui.get().screen === 'world' ? ' on' : ''}`} aria-label="Thế giới" onClick={() => open('world')}><Icon name="world" class="i" /></button></Tip>}
      {!portrait && <Tip c={{ title: 'Hệ thống', note: SCREENS.system!.hint }}><button class={`ib${ui.get().screen === 'system' ? ' on' : ''}`} aria-label="Hệ thống" onClick={() => open('system')}><Icon name="menu" class="i" /></button></Tip>}
      <div class="date"><b class="num">{st.date.y}</b><span>{MONTH_VI[st.date.m - 1]}</span></div>
      <Tip c={{ title: `Tốc độ ${g.speed} / 5`, note: 'Chạm để đổi tốc độ. Phím 1–5 trên bàn phím.' }}><button class="speed" aria-label={`Tốc độ ${g.speed}`} onClick={() => game.setSpeed(((g.speed % 5) + 1) as Speed)}>{[1, 2, 3, 4, 5].map((i) => <i key={i} class={i <= g.speed ? 'on' : ''} style={`height:${5 + i * 3}px`} />)}</button></Tip>
      <button class={`ib play${g.paused ? ' paused' : ''}`} aria-label={g.paused ? 'Tiếp tục' : 'Tạm dừng'} onClick={() => game.setPaused(!g.paused)}><Icon name={g.paused ? 'play' : 'pause'} class="i" /></button>
    </div>
  );
  // essential values stay visible; secondary ones live in an expandable ribbon (♦ button)
  const primary = kpis.slice(0, 4), secondary = kpis.slice(4);
  const openPop = (i: number, e: Event) => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); setPop(pop?.i === i ? null : { i, x: r.left, y: r.bottom }); };
  const strip = (
    <div class="kpis">
      {primary.map((k, i) => (
        <button key={k.icon} class={`kpi${pop?.i === i ? ' on' : ''}`} aria-label={k.tip.title} aria-expanded={pop?.i === i} onClick={(e) => openPop(i, e)}>
          <Icon name={k.icon} /><span class="v num">{k.v}</span>{k.d && <span class={`d num ${k.dc}`}>{k.d}</span>}
        </button>
      ))}
      <button class={`kpi more${pop?.i === -1 ? ' on' : ''}`} aria-label="Chỉ số khác" aria-expanded={pop?.i === -1} onClick={(e) => openPop(-1, e)}>
        {secondary.map((k) => <span key={k.icon} class="mini"><Icon name={k.icon} /><span class="num">{k.v}</span></span>)}<span class="car">▾</span>
      </button>
    </div>
  );
  const pk = pop && pop.i >= 0 ? kpis[pop.i] : null;
  const popover = pop && (
    <>
      <div class="catch" onClick={() => setPop(null)} />
      <div class="kpipop" role="dialog" aria-label={pk ? pk.tip.title : 'Chỉ số khác'} style={`left:${Math.max(6, Math.min(window.innerWidth - 296, pop.x))}px;top:${pop.y + 2}px`}>
        {pk ? (
          <>
            <div class="tt">{pk.tip.title}</div>
            {pk.tip.lines?.map(([a, b]) => <div class="tl" key={a}><span>{a}</span><b class="num">{b}</b></div>)}
            {pk.tip.note && <div class="tn">{pk.tip.note.replace(/ ?Chạm để mở [^.]*\./, '')}</div>}
            <button class="btn sm" style="margin-top:8px;width:100%" onClick={() => { setPop(null); pk.go(); }}>Mở {pk.open} ›</button>
          </>
        ) : secondary.map((k) => (
          <div key={k.icon} class="kp-sec">
            <div class="tt"><Icon name={k.icon} />{k.tip.title}<b class="num">{k.v}</b></div>
            {k.tip.lines?.map(([a, b]) => <div class="tl" key={a}><span>{a}</span><b class="num">{b}</b></div>)}
            <button class="lnk" onClick={() => { setPop(null); k.go(); }}>Mở {k.open} ›</button>
          </div>
        ))}
      </div>
    </>
  );
  if (portrait) return <header class="topbar"><div class="tb-row r1">{identity}<div style="flex:1" />{clock}</div><div class="tb-row r2">{strip}</div>{popover}</header>;
  return <header class="topbar">{identity}{strip}{clock}{popover}</header>;
}

// ---------------------------------------------------------------- map chrome
function LayerBar({ compact: small, x }: { compact: boolean; x: number }) {
  const u = useUI(); const [openMenu, setOpen] = useState(false); const lens = lensById(u.lens);
  if (small) return (
    <div class="layerbar" style={`left:${x}px;top:8px`}>
      <button class="lsel" aria-haspopup="menu" aria-expanded={openMenu} onClick={() => setOpen(!openMenu)}><Icon name={LENS_ICON[u.lens]} class="i" /><span class="name">{lens.name}</span><span class="car">▾</span></button>
      {openMenu && (
        <div class="layermenu" role="menu">
          {LENSES.map((l) => <button key={l.id} role="menuitemradio" aria-checked={u.lens === l.id} class={u.lens === l.id ? 'on' : ''} onClick={() => { ui.set({ lens: l.id }); setOpen(false); }}><Icon name={LENS_ICON[l.id]} class="i" /><span><b>{l.name}</b><small>{l.desc}</small></span></button>)}
        </div>
      )}
    </div>
  );
  return (
    <div class="layerbar" style={`left:${x}px;top:8px`} role="radiogroup" aria-label="Lớp bản đồ">
      {LENSES.map((l) => <Tip key={l.id} c={{ title: l.name, note: l.desc }}><button class={`ib${u.lens === l.id ? ' on' : ''}`} role="radio" aria-checked={u.lens === l.id} aria-label={l.name} onClick={() => ui.set({ lens: l.id })}><Icon name={LENS_ICON[l.id]} class="i" /></button></Tip>)}
      <span class="name">{lens.name}</span>
    </div>
  );
}
function Legend({ x, bottom }: { x: number; bottom: number }) {
  const u = useUI(); const st = game.st!; const lens = lensById(u.lens); const items = lens.legend(st, viewedId(st)).slice(0, 8);
  return (
    <div class="legend" style={`left:${x}px;bottom:${bottom}px`}>
      <div class="t">{lens.name}</div>{lens.unit && <div class="u">{lens.unit}</div>}
      {items.map((it) => <div class="it" key={it.label}><span class={`sw${it.pattern === 'hatch' ? ' hatch' : ''}`} style={`background-color:${it.color}`} /><span class="ellipsis">{it.label}</span></div>)}
    </div>
  );
}
function ZoomBar({ right, bottom }: { right: number; bottom: number }) {
  const st = game.st!;
  return (
    <div class="zoombar" style={`right:${right}px;bottom:${bottom}px`}>
      <button class="ib" aria-label="Phóng to" onClick={() => mapControls.zoom(0.7)}><Icon name="plus" class="i" /></button>
      <button class="ib" aria-label="Thu nhỏ" onClick={() => mapControls.zoom(1.43)}><Icon name="minus" class="i" /></button>
      <button class="ib" aria-label="Về thủ đô" onClick={() => { const c = st.countries[viewedId(st)]; if (c) mapControls.focusRegion(c.capital, 0.02); }}><Icon name="target" class="i" /></button>
    </div>
  );
}

/** Landscape outliner: ongoing processes of the viewed country, each a jump link (research, reform, wars,
 *  pending decisions, market shortages, construction funds). */
function Outliner({ right }: { right: number }) {
  const g = useGame(); const st = g.st!; const id = viewedId(st); const c = st.countries[id];
  const [open, setOpen] = useState(true);
  const items: VNode[] = [];
  if (c.research.current) { const p = Math.min(1, c.research.progress / techCost(st, c, c.research.current)); items.push(<button class="oi" key="r" onClick={() => ui.go('tech', data().tech.get(c.research.current!)?.tree ?? 'production')}><Icon name="research" class="i" /><span class="grow"><span class="ot">{techName(c.research.current)}</span><span class="pbar"><i style={`width:${p * 100}%`} /></span></span><span class="num">{pct(p)}</span></button>); }
  else items.push(<button class="oi warn" key="r0" onClick={() => ui.go('tech', 'production')}><Icon name="research" class="i" /><span class="grow"><span class="ot">Chưa chọn nghiên cứu</span></span></button>);
  if (c.reform) items.push(<button class="oi" key="f" onClick={() => ui.go('politics', 'laws')}><Icon name="laws" class="i" /><span class="grow"><span class="ot">Cải cách: {lawVi(c.reform.value)}</span><span class="pbar"><i style={`width:${c.reform.progress * 100}%`} /></span></span><span class="num">{pct(c.reform.progress)}</span></button>);
  for (const w of st.wars.filter((x) => x.attackers.members.includes(id) || x.defenders.members.includes(id)).slice(0, 3)) { const sc = Math.round(w.attackers.members.includes(id) ? w.score : -w.score); items.push(<button class="oi" key={w.id} onClick={() => ui.go('military', 'wars')}><Icon name="military" class="i" /><span class="grow"><span class="ot">{w.name}</span></span><span class={`num ${sc > 0 ? 'pos' : sc < 0 ? 'neg' : ''}`}>{sc > 0 ? '+' : ''}{fmt(sc)}</span></button>); }
  if (st.pendingPlayerDecisions.length && st.player === id) items.push(<button class="oi warn" key="d" onClick={() => ui.go('chronicle', 'decisions')}><Icon name="scroll" class="i" /><span class="grow"><span class="ot">{st.pendingPlayerDecisions.length} quyết định đang chờ</span></span></button>);
  const stats = st.marketStats?.[marketOf(st, c)]; const short = stats ? Object.entries(stats).filter(([, v]) => v.short >= 0.1).sort((a, b) => b[1].short - a[1].short).slice(0, 2) : [];
  for (const [gd, v] of short) items.push(<button class="oi" key={`s${gd}`} onClick={() => ui.go('economy', 'market')}><Icon name={gd} class="i" /><span class="grow"><span class="ot">Thiếu {GOOD_VI[gd].toLowerCase()}</span></span><span class="num neg">{pct(v.short)}</span></button>);
  return (
    <aside class="outliner" style={`right:${right}px;top:8px`} aria-label="Theo dõi">
      <button class="oh" onClick={() => setOpen(!open)} aria-expanded={open}><span>Theo dõi</span><span class="dim num">{items.length}</span><span class="car">{open ? '▴' : '▾'}</span></button>
      {open && items}
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
    const move = (ev: PointerEvent) => { if (!drag.current) return; el.style.top = `${Math.max(0, drag.current.top0 + ev.clientY - drag.current.y0)}px`; };
    const up = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up);
      if (!drag.current) return; const top = drag.current.top0 + ev.clientY - drag.current.y0; drag.current = null; el.style.transition = ''; el.style.top = '';
      if (top > stageH * 0.8) { onClose(); return; }
      const snaps = ([1, 0, 2] as const).map((k) => [k, Math.abs(SNAP_TOP[k] * stageH - top)] as const).sort((a, b) => a[1] - b[1]);
      ui.set({ sheetSnap: snaps[0][0] });
    };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
  };
}
function MainWindow({ id, portrait, width, top, stageH }: { id: ScreenId; portrait: boolean; width: number; top: number; stageH: number }) {
  const u = useUI(); const st = game.st!; const meta = SCREENS[id]!;
  const tab = u.tabs[id] ?? meta.tabs?.[0][0] ?? '';
  const countryId = id === 'country' ? (u.country ?? viewedId(st)) : '';
  const close = () => ui.set({ screen: 'map', country: null });
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
  const ctx = id === 'world' || id === 'system' ? `${MONTH_VI[st.date.m - 1]} ${st.date.y}` : `${shortName(st, who)} · ${st.date.m}/${st.date.y}`;
  return (
    <section class={`window main${u.panelWide && !portrait ? ' wide' : ''}`} style={portrait ? `top:${top}px` : `width:${width}px`} aria-label={title}>
      <WinHead title={title} ctx={ctx} grip={portrait} onGrip={portrait ? grip : undefined} onClose={close} onExpand={!portrait ? () => ui.set({ panelWide: !u.panelWide }) : undefined} />
      {meta.tabs && <Tabs tabs={meta.tabs} value={tab} onChange={(t) => ui.tab(id, t)} />}
      <div class="win-body" key={id + tab + countryId}>{body}</div>
    </section>
  );
}
function MoreWindow({ portrait, width, top, stageH }: { portrait: boolean; width: number; top: number; stageH: number }) {
  const close = () => ui.set({ screen: 'map' }); const grip = useSheetDrag(stageH, close);
  return (
    <section class="window main" style={portrait ? `top:${top}px` : `width:${width}px`} aria-label="Thêm">
      <WinHead title="Thêm" grip={portrait} onGrip={portrait ? grip : undefined} onClose={close} />
      <div class="win-body pad">
        {MORE.map((id) => { const m = SCREENS[id]!; return <div class="row tap" key={id} onClick={() => ui.go(id)}><span class="ic"><Icon name={m.icon} /></span><div class="grow"><div class="t">{m.title}</div><div class="s">{m.hint}</div></div><span class="dim">›</span></div>; })}
      </div>
    </section>
  );
}
