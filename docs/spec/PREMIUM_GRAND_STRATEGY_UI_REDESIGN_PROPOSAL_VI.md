# PROPOSAL — PREMIUM GRAND-STRATEGY UI REDESIGN

**Task:** UI-REDESIGN-01  
**Status:** SOURCE-BASED DESIGN PROPOSAL — NO RUNTIME/UI IMPLEMENTATION AUTHORIZED  
**Baseline:** a38749ba4f45bf8b05c3890874b10ac555905106  
**Branch:** claude/game-historical-sandbox-modes-kg7rj7  
**Date:** 2026-11-20

## 1. Objective

Move the presentation from a collection of floating information windows and generic ledger panels toward an original, premium grand-strategy command interface. Preserve the existing map-first interaction model and mobile responsiveness, but make each subsystem visually communicate its own strategic function. Do not reproduce proprietary Victoria 3 assets, layout, typography, text or artwork.

The goal is not to make every screen ornate. The goal is a clear visual hierarchy: strategic context first, actionable state second, detailed evidence third.

## 2. Source-based baseline

The existing UI is not an unstyled prototype. It already has:
- a map-first full-screen stage with a top HUD, navigation rail/dock, floating main/detail windows, map layers, legend and region context card (`src/ui/App.tsx`);
- a custom visual system with EB Garamond + Source Sans 3, dark surfaces, gold accents, framed windows, tab strips, metric cards, tables, charts and responsive portrait sheets (`src/ui/styles/theme.css`);
- separate subsystem screens for economy, society, politics, technology, diplomacy, military and chronicle.

The current visual weakness is more structural than decorative:

1. Many subsystem pages share the same composition: `metrics` → `Sec` sections → `kv` rows / `dt` tables / generic two-column cards. This makes distinct systems feel like the same dashboard with different labels.
2. The main map remains visually dominant, but many secondary panels have weak strategic hierarchy: the most important decision, current bottleneck or causal relationship is not consistently the first visual anchor.
3. Several systems communicate state through text and numeric bars rather than a domain-specific visual model: market flows, cabinet blocs, diplomatic alignment, military fronts and technology diffusion need distinct visual grammars.
4. Historical identity assets are not complete. At 1836, the checked registry covers 85/147 playable entities with a period-valid flag, 68/147 with arms, and 60/147 with both. Portraits cover 227/473 character records. A premium design must have honest fallbacks rather than silently presenting generic marks as historical symbols.
5. The current Tech screen uses a chronological era-column layout and prerequisite state, but its global technology catalogue and generic starting bundles are not yet sufficiently country-specific. UI must display the current country's knowledge/adoption/capability state, not visually imply that every country shares one universal progression.

## 3. Design principles

### 3.1 Strategic information hierarchy

Every screen should answer, in this order:
1. What is happening now?
2. Why is it happening?
3. What can the player do?
4. What will that action cost or risk?
5. What evidence/history supports the displayed assessment?

Use a single primary action per decision card. Secondary actions should not visually compete with the primary one.

### 3.2 Domain-specific visual grammar

- Economy: supply/demand, inventories, prices, production chains, capacity utilization, trade flows and logistics.
- Society: population cohorts, strata, living standards, literacy, migration and regional composition.
- Politics: cabinet composition, interest-group power, legitimacy, law support/opposition, reform progress and political movements.
- Technology: country-specific known/adopting/accessible states, prerequisites, institutional capability, diffusion channels and deployment.
- Diplomacy: relationship matrix, blocs, treaties, subject hierarchy, diplomatic plays and obligations.
- Military: army/navy formations, fronts, supply routes, readiness, war goals, battles and theater control.
- Chronicle: dated event timeline, decisions, territorial changes, historical comparison and provenance.
- Country: flag/arms/leader identity, government, capital, strategic profile, economy, society and current crises.

A chart or diagram must represent a real model relation. Do not add decorative flow arrows or fake controls for systems the engine does not yet simulate.

### 3.3 Restraint and legibility

- Keep the existing dark, archival/industrial mood as a direction, but reduce decorative framing where it competes with content.
- Use typography, spacing and surface contrast before adding borders, glows or gradients.
- Use color semantically and consistently: positive, negative, warning, neutral, information, active selection.
- Keep numeric columns tabular and aligned; keep dates and units explicit.
- Never encode state by color alone; pair color with text/icon/shape.
- Maintain minimum touch target sizes and avoid dense microtext on phones.

## 4. Proposed screen architecture

### 4.1 Global strategic shell

**Top HUD**
- Country flag/arms, official country name, leader portrait/name, government form.
- Date, pause/play, speed and clear tooltip showing real-time cadence.
- Compact primary indicators: treasury/balance, GDP, population, standard of living, legitimacy, war status.
- Alerts grouped by severity and count; selecting one opens the causal subsystem view.

**Primary navigation**
- Persistent landscape rail: Map, Economy, Society, Politics, Technology, Diplomacy, Military, Chronicle, System.
- Portrait mode: bottom dock with the same information architecture and a “More” drawer.
- Each module shows a small unresolved-alert count, not decorative notification badges.

**Map interaction**
- Map remains the central strategic canvas.
- A selected country/region opens a contextual card with identity, ownership/controller, key statistics, current construction/war/market context and one clear route into the relevant subsystem.
- Map lenses must state exactly what is encoded and the unit; legends should not obscure the map.

**Window behavior**
- Landscape: main subsystem panel plus optional contextual detail panel, with deterministic resize/collapse behavior.
- Portrait: bottom sheet with clear snap points, preserved map context and no controls hidden behind system navigation.
- Keep current responsive geometry as a baseline; test at 16:9, 20:9 and narrow tablets before visual polish.

### 4.2 Economy command center

Primary view:
- Market header: market name, participating polities, date, total supply/demand, price pressure and market access.
- Goods matrix: commodity, demand, local output, imports, exports, inventory, price and shortage/surplus state.
- Production chain: inputs → buildings → outputs, with actual model values and bottleneck highlight.
- Trade routes: origin, destination, good, volume, transport capacity, tariffs and risk.
- Construction queue: projects, funding, input shortage, completion progress and owner.
- Fiscal panel: revenue, expenditure, debt service and treasury balance.

Do not portray a trade route as active unless a route/market transfer exists in the simulation state. Current engine monthly settlement and simplified market logic must remain visible as limitations until the model is upgraded.

### 4.3 Politics and governance

Primary view:
- Government/cabinet composition as a proportional bloc layout, with each interest group showing clout, approval, ideology and government status.
- Legitimacy and government stability as one prominent state card with causal contributors.
- Laws grouped by institution (power structure, economy, human rights, education, security), showing current law, support/opposition and reform eligibility.
- Reform detail shows supporters, blockers, projected legitimacy effect, progress and political risk.
- Movements/revolutions as a timeline/pressure panel only if those states exist in engine data.

### 4.4 Diplomacy

Primary view:
- Relationship network/map with selected country at center; distinguish allies, rivals, subjects, overlords, treaty partners and war participants by explicit relationship type.
- Treaty cards list members, leader, obligations, start date, expiry/renewal and exit conditions when modeled.
- Subject hierarchy as a tree, not a flat list.
- Diplomatic action panel displays prerequisites, expected reaction, cost, infamy/risk and consequences.
- Diplomatic plays need a timeline: demands, participants, escalation deadline, mobilization and resolution.

### 4.5 Military

Primary view:
- Theater/front map, formation list and supply-route overlay.
- Each formation shows manpower, equipment, quality, morale, readiness, supply and location.
- War overview separates goals, participants, fronts, battles, casualties, occupation, exhaustion and peace options.
- Current abstract monthly battle model must be represented honestly; do not draw daily moving fronts or formations until those exist in runtime.

### 4.6 Technology

Primary view:
- Three independent trees remain possible, but nodes must be grouped by historical era and dependency.
- Each node displays current country state (known, adopting, accessible, not adopted, unknown), evidence quality, prerequisite and actual effect.
- Diffusion view shows real knowledge channels (trade, neighbor, migration, experts, education or captured equipment) only when the model records them.
- Country start differences come from researched country×technology facts and capability data, not arbitrary visual lock states.
- The research queue should clearly state points/month and estimated months at the current rate.

### 4.7 Country identity and portraits

- Identity header: period-valid flag, separately labeled coat of arms/dynastic arms, country name and ruler portrait.
- If no verified historical asset exists, label the fallback as a generated game emblem/monogram; never imply it is an attested national symbol.
- Resolve leader portraits through stable character IDs rather than fuzzy display-name matching.
- Show asset attribution/licence information through an accessible details action.
- Respect the existing period filter; never show a modern flag as an 1836 substitute.

## 5. Component system to build

Create a small set of reusable, typed UI primitives only after the relevant UI phase opens:

- `StrategicHeader`: identity + date + primary state.
- `AlertStack`: prioritized actionable alerts with causal destination.
- `SubsystemOverview`: one primary state, one causal explanation, one action group.
- `DecisionCard`: prerequisites, costs, risks, consequences and confirmation.
- `LedgerTable`: sortable, filterable, responsive, with sticky key columns.
- `RelationshipGraph`: typed edges and stable node identity.
- `FlowDiagram`: only for real production/trade/logistics flows.
- `Timeline`: dated events, deadlines and historical terms.
- `EvidenceBadge`: source quality and uncertainty, not decorative rating.
- `HistoricalIdentity`: flag, arms, portrait and explicit fallback/attribution.

Do not turn the component layer into a generic framework before two real screens prove the patterns.

## 6. Implementation sequence after authorization

1. UI baseline inventory and screenshot matrix across landscape/portrait sizes.
2. Design tokens and shared shell/accessibility audit; no engine changes.
3. Rework one vertical slice end-to-end: Country identity + Economy overview, with exact state and no fabricated controls.
4. Validate on Android for touch targets, scroll behavior, safe areas, performance and text clipping.
5. Rework Politics/Diplomacy/Military/Tech individually using their actual data contracts.
6. Add motion only for state transitions and meaningful flows; profile low-end devices.
7. Visual regression screenshots at the same device sizes and state fixtures.
8. Independent UI review and owner acceptance before release.

## 7. Required acceptance criteria

- A player can identify current country, ruler, date, pause/speed, treasury and urgent alerts within one glance.
- Each subsystem is visually distinguishable and starts with its most important strategic state.
- Tables remain usable on narrow screens; no horizontal overflow hides critical values.
- Portrait and flag fallbacks are explicit and historically honest.
- No decorative chart/flow implies a mechanic that the engine does not implement.
- All actions expose prerequisites, cost, risk and result before confirmation.
- Touch targets, contrast, keyboard navigation and screen-reader labels pass accessibility checks.
- Landscape and portrait screenshots pass visual review at supported Android aspect ratios.
- No unlicensed third-party assets or copied proprietary UI elements are introduced.

## 8. Scope and gate

This document is a source-based design proposal only. It does not authorize runtime/UI changes, new assets, historical facts, game mechanics, save schema, Android packaging or phase opening. S0 remains PARTIAL/BLOCKED; S1 remains NOT_STARTED; S22 remains DESIGN_ONLY.
