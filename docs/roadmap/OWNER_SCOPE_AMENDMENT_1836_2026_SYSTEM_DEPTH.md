# OWNER SCOPE AMENDMENT — 1836–2026 AND FULL SYSTEM DEPTH

**Project:** Currents of History / `mtieu6470-maker/Victori3-mobile`  
**Requested:** 2026-11-20, by project owner in the active project conversation  
**Working branch for this record:** `experiment/vic3-visual-upgrade`  
**Status:** `OWNER_REQUESTED — PRODUCT SCOPE CHANGE RECORDED; IMPLEMENTATION NOT AUTHORIZED BY THIS DOCUMENT`  
**Existing normative baseline:** `docs/spec/MASTER_SPEC_VI.md` (1836–1936), retained byte-for-byte for the completed S0 requirement audit.

## 1. Owner request and combined objective

The owner requests that the game be developed toward the systemic depth of Victoria 3 and that the campaign timeline be expanded from **1836–1936 to 1836–2026**.

This amendment combines two workstreams that must be designed and delivered as one coherent product:

### Workstream A — previously requested core simulation and pacing work

1. Correct the simulation clock and speed model. The player rejected the earlier implication that maximum speed could advance several years per second. Speed must be measured and calibrated against Victoria 3 under comparable conditions; do not invent a fixed wall-clock rate or equate render FPS with simulation speed.
2. Separate simulation progress from rendering. A frame callback must never define a logical game tick. Design deterministic logical time, scheduled task cadence, bounded backlog, pause/background/resume, and save/load behavior.
3. Deepen the core world systems rather than adding superficial counters or buttons:
   - POPs, labor, qualifications, wages, needs, wealth, migration and living standards.
   - Production buildings/firms, input/output chains, ownership, employment, physical inventories, prices, markets, trade, transport, construction, taxation, treasury, debt and investment.
   - Political movements, interest groups, government composition, elections/appointments where appropriate, laws, rights, bureaucracy, state capacity and institutions.
   - Military organizations, formations, commanders, recruitment, equipment, doctrine, supply, logistics, operations, battles, navy and air power.
   - Diplomacy with distinct bilateral relations, alliances, guarantees, non-aggression, trade/investment/defense agreements, treaties and clauses, subjects/client states, autonomy, tribute, obligations, diplomatic crises/plays and peace settlements.
4. Make these systems affect one another through a shared simulation, not disconnected screens or isolated formulas.

### Workstream B — extend the world from 1936 to 2026

1. The campaign must continue through **31 December 2026**, not stop in 1936. The exact end-of-campaign convention (last playable day versus end-of-day boundary) must be specified in the calendar contract.
2. Support the major historical transitions from industrialization through the contemporary era. Initial planning bands:
   - 1836–1870: early industrialization and steam power.
   - 1871–1913: mature industrialization, electrification, steel, chemicals and mass production.
   - 1914–1945: world wars, mechanized warfare, aviation, submarines, radar development and wartime economies.
   - 1946–1991: Cold War, nuclear deterrence, jet aviation, missiles, space, electronics and computing.
   - 1992–2010: globalization, internet, mobile communications, advanced logistics and biotechnology.
   - 2011–2026: AI, robotics, autonomous and remotely piloted systems, modern drones, advanced semiconductors, cyber/electronic operations, satellite networks and contemporary energy technologies.
   These are planning bands, not hard-coded historical outcomes or an exhaustive technology list.
3. Expand technology progression to the contemporary era. Research must be split into coherent branches, at minimum:
   - Industry, manufacturing, materials and automation.
   - Energy, extraction, refining and power generation.
   - Transport, infrastructure and logistics.
   - Communications, electronics, computing, software, networks and space systems.
   - Medicine, public health, biology and education/scientific capacity.
   - Land warfare, naval warfare, aviation, missiles, nuclear systems, electronic warfare, cyber and space-related military capabilities.
4. Technology unlocks must have prerequisites, costs, research capacity and adoption constraints. Diffusion should depend on education/skills, infrastructure, institutions, capital, trade, espionage or other modeled channels. A date alone must not automatically grant every country the same technology.
5. Modern technology must produce real economic, institutional and military consequences. Examples include new goods and production chains, changing skill demand, communications infrastructure, new military equipment/doctrine, cyber and space capabilities, and altered logistics. Do not add technologies that have no gameplay effect.
6. Expand government and institutional evolution through 2026: political systems, administrative capacity, civil service, public education/health, labor and welfare institutions, central banking/finance, regulatory capacity, mass politics and relevant international organizations. Institutions are modeled as laws, organizations, capacity and policy effects—not merely another technology research list.

## 2. Shared simulation principles

- Historical, Sandbox/Alternate History and Observer modes use the same authoritative simulation rules and data contracts.
- Historical scenarios may define sourced starting conditions and period-valid people, institutions and technology. They must not force known future events after the campaign starts.
- Alternate history must emerge from player and AI decisions, constraints, institutions, resources and simulation outcomes.
- No fake depth: every displayed statistic must derive from state and have a traceable calculation; every control must perform a real validated action.
- Global coverage must include all major world regions and countries/territories represented by the sourced dataset, not only a few European powers.
- Historical dates, borders, leaders, military equipment, institutions and technology availability require provenance, confidence and date validity.
- All newly added code, data and assets must be original or appropriately licensed. Do not copy Victoria 3 source, artwork, UI, proprietary data, text or other protected assets.

## 3. Core system contracts required for the target

### 3.1 POPs and economy

The economy must model coherent flows and stocks: population cohorts; workforce and qualifications; employment; wages and income; needs/consumption; building input/output; ownership/profit; physical inventories; market access; prices; trade; transport; construction; taxes; treasury; credit/debt; investment and public finance.

Accounting invariants must be testable. For example, goods cannot be consumed or exported beyond available production/imports/inventory; buildings cannot produce without required inputs and labor; treasury changes must reconcile with revenue, expenditure, borrowing and repayment.

### 3.2 Politics and institutions

Represent distinct regime and government structures, government participation, political organizations/movements, support and opposition, law prerequisites and enactment, rights and obligations, administrative capacity, and institution-level effects on education, health, welfare, labor, taxation, policing/defense and public administration. Historical variation must be data-driven, not one universal government template.

### 3.3 Diplomacy, subjects and treaties

Do not compress the international order into one opinion score or a single `overlord` boolean. Model bilateral relations and interests separately from legal status and treaty obligations. A treaty needs parties, clauses, start/end or renewal terms, conditions, breach consequences and termination rules. Subject relationships need type, autonomy, tribute/tax, military obligations, overlord control, diplomatic rights, integration/independence paths and enforceable status. Diplomatic crises/plays need participants, goals, escalation, backing down, sway, settlement and resulting treaties.

### 3.4 Military

Represent force structure and capability at an operationally meaningful level: formations/units, branches, manpower, recruitment, officers/commanders, organization/readiness, equipment types and stockpiles, training, doctrines, supply consumption, depots, transport capacity, terrain, fronts/operations, battles, casualties, occupation, blockades, naval/air operations and wartime production. Equipment and doctrine must be technology- and economy-dependent. Do not fabricate unit histories or commanders when migrating from the current aggregate army/navy model.

### 3.5 AI and national strategy

Country AI must choose goals and trade-offs across economy, domestic politics, diplomacy, subjects, technology, military readiness and war. Decisions should be explainable from state, incentives, constraints and strategic priorities. AI behavior must remain deterministic under a fixed seed and command/event sequence where required by the engine contract.

## 4. Suggested staged delivery order (planning only)

1. Close the existing S0/B7 review and owner signoff process without changing its historical evidence.
2. Approve a new product-scope specification for 1836–2026, including a sourced historical data plan, technology taxonomy, calendar semantics and save-compatibility strategy.
3. Design the simulation clock and scheduler contracts. First separate logical simulation from render timing; then design the higher-resolution calendar and daily/weekly/monthly/yearly/regular task cadence. Do not run the existing monthly pipeline four times per day.
4. Define versioned data contracts and save migration boundaries for the extended calendar, technology, institutions, economy, diplomacy and military. Preserve old saves safely; never silently reinterpret existing tick fields.
5. Implement and validate integrated vertical slices in dependency order: POP/economy; production/inventory/trade; politics/institutions; diplomacy/subjects/treaties; military/logistics; global AI.
6. Add historically sourced 1836–2026 scenarios, technology diffusion, date-valid people/assets and era-specific content.
7. Validate long campaigns, determinism, save/load, performance, battery, thermal behavior, memory and UI responsiveness on target Android hardware. Optimize only from measurements.
8. Expand UI/map and observer tools only as real engine data and actions become available.

This order is a planning proposal, not authorization to skip or reorder existing repository phase gates.

## 5. Acceptance criteria for the expanded product

- A campaign can start in 1836 and continue to the defined 2026 terminal boundary without artificial early termination or calendar overflow.
- Save/load and migrations preserve date, seed/RNG state, task order, economic/military/diplomatic state and deterministic replay across relevant calendar boundaries.
- Speed settings have measured game-calendar throughput and are independent of display refresh rate. Pause freezes all logical state; background/resume does not create catch-up time or drop logical ticks silently.
- Technology has meaningful prerequisites, costs, diffusion/adoption and downstream effects through 2026.
- Institutions, laws and government structures change political and economic outcomes, with historically valid options and alternate-history agency.
- POP/economy, diplomacy/subjects/treaties and military/logistics are integrated, explainable and testable—not decorative aggregates.
- AI-controlled countries use the same rules and can plan across domestic, economic, technological, diplomatic and military goals.
- Multiple regions and regime types pass scenario tests; no single-country-only validation.
- Android performance and reliability are measured on actual target devices. Desktop/CI success is not a substitute for device evidence.
- Independent review and owner acceptance are completed for each authorized phase.

## 6. Compatibility with current project governance

This request expands the desired product scope, but it does **not** rewrite the immutable `MASTER_SPEC_VI.md` used for the already-recorded S0/G0.4 audit. Keep that file byte-for-byte unchanged. A later formally reviewed product-spec revision must explicitly supersede the 1936 end date without erasing the historical S0 baseline and its evidence.

At the time this amendment is recorded:

- S0-B7 remains `IN_PROGRESS`; independent review and owner signoff remain pending.
- Overall S0 remains `PARTIAL — NOT COMPLETE`; G0.9 remains blocked.
- The bounded S1-entry package remains `NOT_TESTED`; S1 remains `NOT AUTHORIZED`.
- R7 remains OPEN P0; R14 remains BLOCKED; G0.7 remains BLOCKED; G0.8 remains PARTIAL; DEP-F1 remains OPEN P1 pending owner disposition.
- The current S0 authorization remains audit/handoff/report scope only. It does not authorize gameplay, engine, runtime clock, save schema, historical data/content, assets, APK signing or device-install changes.

No product code, tests, save format, production data, assets, build workflow, signing configuration or APK was modified by this scope record. Before any implementation, follow the exact live GitHub phase gate and obtain the required reviewer verdict and owner authorization for the next phase and exact task scope.

## 7. Explicit non-goals

- Do not promise perfect one-to-one feature parity with Victoria 3 or copy proprietary implementation/assets/data.
- Do not hard-code history so that every campaign must reproduce the same wars, borders or political outcomes.
- Do not equate a longer date range with deeper simulation.
- Do not model every citizen or soldier as a heavyweight object if that exceeds measured Android budgets; choose validated cohort/unit aggregation levels without hiding important player-facing decisions.
- Do not add speculative post-2026 technology to the 2026 playable tree without an explicitly separate future-tech option and clear labeling.
