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
export function Icon({ name, size, class: cls }: { name: string; size?: number; class?: string }) {
  const d = P[name] ?? P.scroll;
  return (
    <svg class={cls} viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d={d} fill="currentColor" fill-opacity="0.16" stroke="none" />
      <path d={d} />
    </svg>
  );
}
export const GOOD_COLOR: Record<string, string> = { grain: '#4b4a2a', cash_crops: '#2f4a2c', cotton: '#4a4a4a', timber: '#4a3a26', coal: '#2a2a2a', iron: '#3b3f44', steel: '#34404a', textiles: '#4a2f3c', tools: '#3f3a2c', arms: '#4a2c28', luxury: '#40305a', opium: '#4a2840' };

/** Module accent colours (CSS variables in theme.css) used for medallions, rail buttons and window stripes. */
export const MODULE_COLOR: Record<string, string> = {
  country: 'var(--m-country)', economy: 'var(--m-economy)', society: 'var(--m-society)', politics: 'var(--m-politics)', tech: 'var(--m-tech)',
  diplomacy: 'var(--m-diplomacy)', military: 'var(--m-military)', chronicle: 'var(--m-journal)', world: 'var(--m-world)', system: 'var(--m-system)', more: 'var(--gold-2)',
};
