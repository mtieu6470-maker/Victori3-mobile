# CG-09 — UI information architecture for Android landscape

Research date: 2026-11-22. This is an original design proposal informed by Victoria 3's information hierarchy; it must not copy its skin, exact text, icons or artwork.

## Principles

1. Map is a workspace, not the only screen.
2. Every major metric answers: current state, why, available action, expected consequence.
3. Tooltips expose causal chains, contributors, units, date and uncertainty.
4. Detail density changes with zoom/selection; do not render every label at every zoom.
5. Landscape phone uses map plus context drawer; navigation adapts to width.
6. Dense data uses filter, sort, search, sticky headers and explicit empty/error states.
7. High-impact actions preview costs/consequences and require confirmation.

## Outliner

Compact alerts for construction, journal, diplomatic plays, wars/fronts, shortages, low employment and law progress. Each row shows icon, short title, status, one key metric and urgency. Group/collapse, sort by urgency/recency, tap to open entity context without losing map camera.

## Ledgers

Recommended ledgers: Buildings/Construction; Pops/Professions; Goods/Markets; Trade Centers/Flows; Budget/Tax; Laws/Interest Groups; Diplomacy/Subjects/Power Blocs; Army/Fleet/Fronts; Technology/Journal.

Every ledger needs search, multi-sort, filters, units, totals vs averages, row-to-entity navigation, batch-action validation and filtered/total counts.

## Causal tooltips

Headline metric + unit + date; plain-language formula; positive/negative contributors; absolute and relative impact; freshness/confidence for historical data; click-through to source entity. Unknown is visually distinct from zero.

## Map lenses

Political sovereignty; market access; goods price/shortage; production concentration; workforce/SoL; infrastructure/ports; diplomacy/Power Bloc; fronts/occupation/supply; culture/religion/acceptance; historical data quality. Every lens has legend, units, scope and data timestamp. No color-only encoding.

## Mobile interaction

Target touch areas 44–48 dp as a design target pending device QA. Avoid map gesture conflicts with drawer scrolling. Keep modal depth shallow. Back closes the top panel before leaving game. Use undo/confirmation for major actions. Keep selected entity context while switching tabs.

## Layout proposal

Main map takes roughly 60–72% of available landscape workspace; context panel uses the remainder and can collapse. Top strip contains date/time/speed, treasury, alerts and selected country. Side rail contains major systems. Narrow widths collapse to drawer; tablet widths can show two-column ledgers. These are design targets, not device-validated values.

## Open questions / conflicts

- Current UI components and actual iQOO landscape safe-area dimensions must be inspected at latest HEAD.
- All reference screens from Victoria 3 are copyrighted; derive information architecture only.
- Layout ratios are not validated until native-device screenshots are captured.

## Recommended acceptance tests

1. Every key ledger opens within two taps from map/outliner.
2. Every headline metric has causal breakdown and date.
3. Ledgers support search/filter/sort/empty state.
4. Selected entity context survives tab changes.
5. Unknown and zero are distinct.
6. Touch targets, overflow and map gestures pass device screenshot QA.
7. UI remains responsive during worker simulation.
