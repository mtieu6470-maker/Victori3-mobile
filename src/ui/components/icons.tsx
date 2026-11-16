// Original icons (24×24): a tinted fill under a round-capped line drawing, two-tone. Drawn for this project; no
// third-party icon assets. Shown bare, or inside a bronze medallion (components/ui.tsx `Mdl`).
const P: Record<string, string> = {
  map: 'M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14',
  economy: 'M12 3v18M6 21h12M5 7h14M5 7l-3 7a3 3 0 006 0zM19 7l-3 7a3 3 0 006 0z',
  society: 'M8 10a2.6 2.6 0 100-5.2A2.6 2.6 0 008 10zM16 10a2.6 2.6 0 100-5.2A2.6 2.6 0 0016 10zM2.5 20c.4-4 2.6-6.2 5.5-6.2s5.1 2.2 5.5 6.2M10.5 20c.4-4 2.6-6.2 5.5-6.2s5.1 2.2 5.5 6.2',
  politics: 'M3 21h18M4 18h16M12 3l9 5H3zM6 10v8M10 10v8M14 10v8M18 10v8',
  laws: 'M6 3h10l3 3v15H6zM16 3v3h3M9 10h7M9 14h7M9 18h4',
  diplomacy: 'M2 11l4-4 4 2 3-2 4 1 5 4M6 7l-3 7 6 5 2-1M18 8l3 7-6 5-2-1M9 15l2 2M11 13l3 3M13 12l2 2',
  military: 'M4 20L18 6l1-3-3 1L2 18zM20 20L6 6 5 3l3 1 14 14zM3 15l3 3M21 15l-3 3',
  tech: 'M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3M7.5 15h9',
  journal: 'M4 4c3-1 6-1 8 1v15c-2-2-5-2-8-1zM20 4c-3-1-6-1-8 1v15c2-2 5-2 8-1z',
  world: 'M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  market: 'M4 10h16l-1.5-5h-13zM5 10v10h14V10M9 20v-6h6v6',
  buildings: 'M3 21V10l5 3V10l5 3V5h3v4h2V3h3v18zM7 17h2M12 17h2M17 17h2',
  construction: 'M3 21h18M6 21V8l12-4M6 8l-3 2M18 4v9M16 13h4v3h-4zM6 12h4',
  population: 'M12 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM5 21c.6-5 3.3-7.6 7-7.6s6.4 2.6 7 7.6',
  treasury: 'M4 8c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 8v4c0 1.7 3.6 3 8 3s8-1.3 8-3V8M4 12v4c0 1.7 3.6 3 8 3s8-1.3 8-3v-4',
  legitimacy: 'M4 17l-1-10 5 4 4-7 4 7 5-4-1 10zM4 20h16',
  prestige: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
  research: 'M9 3h6M10 3v5L5 18a2 2 0 002 3h10a2 2 0 002-3l-5-10V3',
  gdp: 'M4 20V10M10 20V4M16 20v-8M22 20H2',
  army: 'M12 3l7 3v6c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6z',
  navy: 'M12 3v13M8 7h8M4 15c2 3 4.5 4.5 8 4.5s6-1.5 8-4.5M12 16l-6-1M12 16l6-1',
  literacy: 'M3 6c3-1 6-1 9 1 3-2 6-2 9-1v13c-3-1-6-1-9 1-3-2-6-2-9-1zM12 7v13',
  radical: 'M12 3l2 6h6l-5 4 2 7-5-4-5 4 2-7-5-4h6z',
  pause: 'M8 5v14M16 5v14',
  play: 'M7 4l13 8-13 8z',
  close: 'M6 6l12 12M18 6L6 18',
  back: 'M15 4l-8 8 8 8',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  target: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 15a3 3 0 100-6 3 3 0 000 6zM12 1v4M12 19v4M1 12h4M19 12h4',
  bell: 'M6 16V11a6 6 0 0112 0v5l2 2H4zM10 20a2 2 0 004 0',
  save: 'M5 3h12l3 3v15H5zM8 3v6h8V3M8 21v-7h8v7',
  menu: 'M4 7h16M4 12h16M4 17h16',
  expand: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  flag: 'M5 21V4M5 4h11l-2 4 2 4H5',
  check: 'M4 12l5 5L20 6',
  warning: 'M12 3l10 18H2zM12 10v5M12 18v.5',
  scroll: 'M7 4h11a2 2 0 010 4H9M7 4a2 2 0 00-2 2v12a2 2 0 002 2h11a2 2 0 002-2v-1H9v1a2 2 0 01-2 2',
  people: 'M9 10a3 3 0 100-6 3 3 0 000 6zM2 20c.5-4.5 3-7 7-7s6.5 2.5 7 7M17 10a2.5 2.5 0 100-5M18 13c2.4.4 3.6 2.6 4 6',
  terrain: 'M2 19l6-10 4 6 3-4 7 8zM8 9l1.5 2.5M15 11l1 1.5',
  fullscreen: 'M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6M8 8l-4-4M16 8l4-4M8 16l-4 4M16 16l4 4',
  collapse: 'M5 12h14',
  restore: 'M5 9h14v10H5zM5 9V5h14v4',
  crown: 'M3 18l2-10 5 5 2-8 2 8 5-5 2 10zM3 21h18',
  coins: 'M9 8c0-1.7 2.7-3 6-3s6 1.3 6 3-2.7 3-6 3-6-1.3-6-3zM9 8v4c0 1.7 2.7 3 6 3s6-1.3 6-3V8M3 13c0-1.7 2.7-3 6-3M3 13v4c0 1.7 2.7 3 6 3 1.6 0 3-.3 4-.8M3 13c0 1.7 2.7 3 6 3',
  factory: 'M3 21V11l6 4v-4l6 4V5h4v16zM6 21v-3M11 21v-3M16 21v-3',
  anchor: 'M12 7a2 2 0 100-4 2 2 0 000 4zM12 7v14M7 11h10M4 14c0 4 3.6 7 8 7s8-3 8-7',
  pin: 'M12 22s7-7.5 7-13a7 7 0 00-14 0c0 5.5 7 13 7 13zM12 12a3 3 0 100-6 3 3 0 000 6z',
  // goods
  grain: 'M12 21V8M12 8c-2-1-3-3-3-5 2 1 3 3 3 5zM12 8c2-1 3-3 3-5-2 1-3 3-3 5zM12 13c-2-1-3.5-3-3.5-5 2 1 3.5 3 3.5 5zM12 13c2-1 3.5-3 3.5-5-2 1-3.5 3-3.5 5zM12 18c-2-1-3.5-3-3.5-5 2 1 3.5 3 3.5 5zM12 18c2-1 3.5-3 3.5-5-2 1-3.5 3-3.5 5z',
  cash_crops: 'M5 19C5 10 11 5 20 4c-1 9-6 15-15 15zM5 19l8-8',
  cotton: 'M12 10a3 3 0 10-3-3M12 10a3 3 0 103-3M9 7a3 3 0 103 3 3 3 0 103-3M12 13v8M9 16l3 2 3-2',
  timber: 'M3 9h14a3 3 0 010 6H3a3 3 0 010-6zM17 9a3 3 0 000 6M3 15v4h14v-4',
  coal: 'M4 17l3-7 5-3 6 2 2 6-4 4H8z',
  iron: 'M3 16l3-7h12l3 7zM6 9l2-3h8l2 3',
  steel: 'M4 4h16M4 20h16M12 4v16M8 4v2M16 4v2M8 20v-2M16 20v-2',
  textiles: 'M4 6h12a4 4 0 010 8H4zM4 6v12h12M8 10h6',
  tools: 'M14 6l4-3 3 3-3 4zM15 9L5 19l-2-2L13 7M4 7l3-3 3 3-3 3z',
  arms: 'M3 15l14-11 3 3-14 11zM6 17l-2 3M13 9l3 3',
  luxury: 'M6 3h12l4 6-10 12L2 9zM2 9h20M9 3l-2 6 5 12 5-12-2-6',
  opium: 'M12 21v-9M12 12c-4 0-6-3-6-6 3 0 6 2 6 6zM12 12c4 0 6-3 6-6-3 0-6 2-6 6zM12 7a2 2 0 100-4 2 2 0 000 4z',
};
/** v4 icon set: one 24 px grid, one 1.6 px stroke, round caps and joins, duotone. `b` = body (tinted fill + stroke),
 *  `l` = detail lines (stroke only), `d` = solid accents. Names not redrawn yet fall back to the path set above. */
const c = (x: number, y: number, r: number) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
type Def = { b?: string; l?: string; d?: string };
export const ICON_DEFS: Record<string, Def> = {
  // modules
  crown: { b: 'M4.2 17.5 3 7.8l5 4.1L12 5.2l4 6.7 5-4.1-1.2 9.7z', l: 'M4.5 20.5h15', d: c(3, 7.6, 1.15) + c(12, 4.9, 1.15) + c(21, 7.6, 1.15) },
  factory: { b: 'M3 20.5v-9.8l5 3.1v-3.1l5 3.1V10.7l3.3 2V4h3.2v16.5z', l: 'M6.3 17.2h1.6M10.3 17.2h1.6M14.3 17.2h1.6M2.5 20.5h19' },
  society: { b: c(9, 8.3, 3.1) + 'M2.8 20c.4-3.9 2.9-6.3 6.2-6.3s5.8 2.4 6.2 6.3z', l: 'M15.6 5.7a2.7 2.7 0 1 1 0 5.4M17.2 13.9c2.4.6 3.8 2.8 4.1 6.1h-3', d: '' },
  politics: { b: 'M2.8 9.4 12 4l9.2 5.4zM3.5 20.5h17v-2.1h-17z', l: 'M6 10.6v6.6M10 10.6v6.6M14 10.6v6.6M18 10.6v6.6' },
  tech: { b: 'M10.3 4.2v4.6l-4.9 9a1.9 1.9 0 0 0 1.7 2.8h9.8a1.9 1.9 0 0 0 1.7-2.8l-4.9-9V4.2z', l: 'M8.8 4.2h6.4M7.7 15h8.6', d: c(11, 17.6, 0.85) + c(14.1, 16.9, 0.65) },
  diplomacy: { b: 'M6.2 3.6h11.6V16a3.9 3.9 0 0 1-3.9 3.9H6.2z', l: 'M6.2 20.4H5.4a1.9 1.9 0 0 1 0-3.8h.8M9.2 7.6h5.6M9.2 10.6h5.6M9.2 13.6h3', d: c(16.6, 17, 2.25) },
  military: { l: 'M4.6 3.8 16.2 15.4M19.4 3.8 7.8 15.4M14.3 17.6l3.6-3.6M9.7 17.6 6.1 14M16.8 15.9l2.7 2.7M7.2 15.9l-2.7 2.7', b: 'M4.6 3.8l1.9.4 10.1 10.1-1.5 1.5L5 5.7zM19.4 3.8l-1.9.4L7.4 14.3l1.5 1.5L19 5.7z', d: c(20.2, 19.4, 1.15) + c(3.8, 19.4, 1.15) },
  journal: { b: 'M6 3.6h12v16.9H7.6A1.6 1.6 0 0 1 6 18.9z', l: 'M6 17.4h12M10.2 3.6v6.2l1.6-1.3 1.6 1.3V3.6' },
  world: { b: c(12, 12, 8.6), l: 'M3.4 12h17.2M12 3.4c3 3.2 3 14 0 17.2M12 3.4c-3 3.2-3 14 0 17.2M5 7.4h14M5 16.6h14' },
  // HUD resources
  coins: { b: 'M5 7.1c0-1.4 3.1-2.6 7-2.6s7 1.2 7 2.6v9.8c0 1.4-3.1 2.6-7 2.6s-7-1.2-7-2.6z', l: 'M5 7.1c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6M5 10.4c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6M5 13.7c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6' },
  gdp: { b: 'M5 20.4v-5.8h3v5.8zM10.5 20.4v-8.6h3v8.6zM16 20.4V9h3v11.4z', l: 'M3 20.5h18M4 11l5-4.3 3.5 2.4 6.6-5.6M15.5 3.5h3.6v3.6' },
  legitimacy: { l: 'M8.4 20.4C4.9 18.1 3.3 14.2 4.2 9.4M15.6 20.4c3.5-2.3 5.1-6.2 4.2-11', b: 'M4.1 15.4c1.6-.4 2.8.4 3.3 1.7-1.6.4-2.8-.4-3.3-1.7zM3.7 11.7c1.5-.6 2.8 0 3.4 1.2-1.5.6-2.8 0-3.4-1.2zM4.7 8c1.3-.9 2.7-.6 3.5.5-1.3.9-2.7.6-3.5-.5zM19.9 15.4c-1.6-.4-2.8.4-3.3 1.7 1.6.4 2.8-.4 3.3-1.7zM20.3 11.7c-1.5-.6-2.8 0-3.4 1.2 1.5.6 2.8 0 3.4-1.2zM19.3 8c-1.3-.9-2.7-.6-3.5.5 1.3.9 2.7.6 3.5-.5z', d: 'M12 4.2l1.2 2.3 2.6.4-1.9 1.8.5 2.6L12 10.1l-2.4 1.2.5-2.6-1.9-1.8 2.6-.4z' },
  prestige: { b: 'M12 3.4l2.5 5.1 5.6.8-4 3.9.9 5.6L12 16.2l-5 2.6.9-5.6-4-3.9 5.6-.8z', l: 'M8.4 18.1 7 21.2l2.6-.8 1.3 1.6M15.6 18.1 17 21.2l-2.6-.8-1.3 1.6' },
  population: { b: c(12, 7.9, 3.5) + 'M4.6 20.4c.4-4.3 3.3-7 7.4-7s7 2.7 7.4 7z' },
  research: { b: 'M10.3 4.2v4.6l-4.9 9a1.9 1.9 0 0 0 1.7 2.8h9.8a1.9 1.9 0 0 0 1.7-2.8l-4.9-9V4.2z', l: 'M8.8 4.2h6.4M7.7 15h8.6', d: c(11, 17.6, 0.85) + c(14.1, 16.9, 0.65) },
  army: { b: 'M12 3.5l7.2 2.8v5.5c0 4.4-3 7.5-7.2 8.7-4.2-1.2-7.2-4.3-7.2-8.7V6.3z', l: 'M8.6 11.4 12 14l3.4-2.6M8.6 8.4 12 11l3.4-2.6' },
  treasury: { b: 'M5 7.1c0-1.4 3.1-2.6 7-2.6s7 1.2 7 2.6v9.8c0 1.4-3.1 2.6-7 2.6s-7-1.2-7-2.6z', l: 'M5 7.1c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6M5 10.4c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6M5 13.7c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6' },
  // controls
  bell: { b: 'M6.4 16.4v-5.3a5.6 5.6 0 0 1 11.2 0v5.3l1.6 2.1H4.8z', l: 'M10 20.6a2.1 2.1 0 0 0 4 0', d: c(12, 4, 1) },
  menu: { l: 'M4.5 7h15M4.5 12h15M4.5 17h15' },
  play: { b: 'M8.2 5.2v13.6L18.8 12z' },
  pause: { b: 'M7.2 5.5h3.4v13H7.2zM13.4 5.5h3.4v13h-3.4z' },
  plus: { l: 'M12 5.5v13M5.5 12h13' },
  minus: { l: 'M5.5 12h13' },
  target: { b: c(12, 12, 3), l: c(12, 12, 7.6) + 'M12 2.6v3M12 18.4v3M2.6 12h3M18.4 12h3' },
  fullscreen: { l: 'M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5' },
  chevdown: { l: 'M6 9.5l6 6 6-6' }, chevup: { l: 'M6 14.5l6-6 6 6' }, chevleft: { l: 'M14.5 6l-6 6 6 6' }, chevright: { l: 'M9.5 6l6 6-6 6' },
  close: { l: 'M6.5 6.5l11 11M17.5 6.5l-11 11' },
  collapse: { l: 'M5.5 13h13' },
  restore: { b: 'M5 9h14v10H5z', l: 'M5 9V5h14v4' },
  expand: { l: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5' },
  back: { l: 'M14.5 5.5 8 12l6.5 6.5' },
  // map modes
  flag: { l: 'M5.5 21V3.4', b: 'M5.5 4.4h12l-2.6 4.1 2.6 4.1h-12z' },
  terrain: { b: 'M2.4 19.6 8.7 9l3.6 6.1 2.5-3.7 6.8 8.2z', l: 'M7.1 11.6l1.6 1.2 1.4-1.1' },
  sol: { b: 'M4.2 10.8 12 4.4l7.8 6.4v9.7H4.2z', l: 'M10 20.5v-5.3h4v5.3' },
  literacy: { b: 'M3.4 5.6c2.9-1 5.9-.9 8.6.8v13.3c-2.7-1.7-5.7-1.8-8.6-.8zM20.6 5.6c-2.9-1-5.9-.9-8.6.8v13.3c2.7-1.7 5.7-1.8 8.6-.8z', l: 'M6 9.2h3.4M6 12.2h3.4M14.6 9.2H18M14.6 12.2H18' },
  iron: { l: 'M4.6 20.4l9.6-9.6', b: 'M7.6 5.4c4.4-1.9 9.4-.6 12 3-3.6-1.2-7.3-.9-10.3 1.1zM13.2 11.4l1.4-1.4 1.4 1.4-1.4 1.4z' },
  market: { l: 'M12 4.6v15M7.6 20.4h8.8M4.8 7.6h14.4', b: 'M2.6 13.6 4.8 8l2.2 5.6a2.2 2.2 0 0 1-4.4 0zM17 13.6 19.2 8l2.2 5.6a2.2 2.2 0 0 1-4.4 0z', d: c(12, 4.1, 1.1) },
  warning: { b: 'M12 3.6 21.2 19.8H2.8z', l: 'M12 9.4v4.8', d: c(12, 17, 0.95) },
  laws: { b: 'M6.2 3.6h9.2l3.4 3.4v13.4H6.2z', l: 'M15.4 3.6V7h3.4M9 11h7M9 14h7M9 17h4.2' },
  scroll: { b: 'M6.2 3.6h11.6V16a3.9 3.9 0 0 1-3.9 3.9H6.2z', l: 'M6.2 20.4H5.4a1.9 1.9 0 0 1 0-3.8h.8M9.2 7.6h5.6M9.2 10.6h5.6M9.2 13.6h3' },
  map: { b: 'M3.4 6.2 9 4.2l6 2 5.6-2v13.6l-5.6 2-6-2-5.6 2z', l: 'M9 4.2v13.6M15 6.2v13.6' },
  people: { b: c(9, 8.3, 3.1) + 'M2.8 20c.4-3.9 2.9-6.3 6.2-6.3s5.8 2.4 6.2 6.3z', l: 'M15.6 5.7a2.7 2.7 0 1 1 0 5.4M17.2 13.9c2.4.6 3.8 2.8 4.1 6.1h-3' },
  pin: { b: 'M12 21.6s6.8-7.3 6.8-12.7a6.8 6.8 0 0 0-13.6 0c0 5.4 6.8 12.7 6.8 12.7z', l: c(12, 9, 2.6) },
};
export function Icon({ name, size, class: cls }: { name: string; size?: number; class?: string }) {
  const v = ICON_DEFS[name];
  if (v) return (
    <svg class={cls} viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      {v.b && <path d={v.b} fill="currentColor" fill-opacity="0.22" />}
      {v.l && <path d={v.l} />}
      {v.d && <path d={v.d} fill="currentColor" stroke="none" />}
    </svg>
  );
  const d = P[name] ?? P.scroll;
  return (
    <svg class={cls} viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d={d} fill="currentColor" fill-opacity="0.16" stroke="none" />
      <path d={d} />
    </svg>
  );
}
export const GOOD_COLOR: Record<string, string> = { grain: '#4b4a2a', cash_crops: '#2f4a2c', cotton: '#4a4a4a', timber: '#4a3a26', coal: '#2a2a2a', iron: '#3b3f44', steel: '#34404a', textiles: '#4a2f3c', tools: '#3f3a2c', arms: '#4a2c28', luxury: '#40305a', opium: '#4a2840' };

/** Module accent colours (CSS variables in theme.css) used for medallions, rail buttons and window stripes. */
/** Module identity colours (theme.css `--m-*`): icons and markers only, never large backgrounds. */
export const MODULE_ICON: Record<string, string> = { country: 'crown', economy: 'factory', society: 'society', politics: 'politics', tech: 'tech', diplomacy: 'diplomacy', military: 'military', chronicle: 'journal', world: 'world', system: 'menu', more: 'menu' };
export const MODULE_COLOR: Record<string, string> = {
  country: 'var(--m-country)', economy: 'var(--m-economy)', society: 'var(--m-society)', politics: 'var(--m-politics)', tech: 'var(--m-tech)',
  diplomacy: 'var(--m-diplomacy)', military: 'var(--m-military)', chronicle: 'var(--m-journal)', world: 'var(--m-world)', system: 'var(--m-system)', more: 'var(--gold-2)',
};
