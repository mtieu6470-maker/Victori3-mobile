# Player Test Feedback — 2026-11-20

## Status and authority boundary

- Source: owner hands-on test of the current Victori3 Mobile Android build.
- Verdict: **NOT ACCEPTED — substantial gap remains versus the Victoria 3 target**.
- This document records player evidence and converts it into a prioritized implementation/verification backlog.
- Current collaboration protocol still prohibits gameplay, engine, UI and save-format changes during S0. S1 remains NOT AUTHORIZED until the required review/owner gate is satisfied. Therefore this is a requirements and acceptance-test update only; it is not permission to bypass the phase gate.

## Owner's direct findings

1. Game time advances far too quickly; the pacing does not resemble Victoria 3.
2. Historical ruler portraits are inconsistent: some match, some do not.
3. Military simulation is inadequate.
4. Economy simulation is inadequate.
5. Factories/industry are inadequate.
6. Political systems and forms of government are inadequate.
7. Social structure and laws are inadequate.
8. Points/scoring are inadequate.

These are player-observed deficiencies, not claims that any particular subsystem is already implemented correctly.

## Prioritized improvement backlog

### P0 — Simulation clock and pacing

- Audit the relationship between wall-clock time, simulation ticks, calendar advancement and speed controls.
- Define explicit pause and speed levels; ensure each level advances a predictable number of simulation ticks/calendar units.
- Prevent background catch-up, frame-rate changes or device performance from silently accelerating calendar time.
- Keep UI animation speed separate from simulation/calendar speed.
- Test on low/normal/high device load and after app pause/resume; no calendar jumps or uncontrolled catch-up.
- Benchmark the perceived pace against Victoria 3 using the same start date and comparable speed settings. Record measured game-days per real second/minute for each speed level before tuning.

Acceptance:
- Speed 0 pauses calendar and simulation state.
- Every nonzero speed has a documented, deterministic tick/calendar rate.
- Changing rendering FPS or opening menus does not change game-time rate.
- Pause/resume and save/load do not cause time jumps.
- Owner confirms the pace is no longer "too fast" in hands-on testing.

### P0 — Historical identity and ruler portraits

- Build a verified ruler/office-holder roster by country and date, with source citation, start/end dates, title/office, alternate spellings and uncertainty status.
- Enforce date-aware lookup: no ruler or portrait appears before/after their historically valid tenure.
- Distinguish sovereign, head of government, governor, tribal/collective leadership and other offices; do not force every polity into a modern head-of-state model.
- Use authentic, source-verified portraits where licensing and provenance allow.
- AI-generated portraits may be used only as clearly labelled illustrative art when no verified portrait exists. Never present generated art as an authentic historical photograph/portrait.
- For collective leadership or polities without a single verified ruler, show the historically appropriate council/office/collective representation rather than inventing an individual.

Acceptance:
- Every displayed historical person is backed by a date-valid source record.
- Every authentic portrait has provenance and rights metadata.
- AI-generated/illustrative art is visibly labelled and never confused with a real archival image.
- Unknown/contested cases display an explicit neutral fallback, not fabricated certainty.

### P1 — Economy, markets and industry

- Model POP cohorts with size, class/strata, culture, religion, employment, wealth/living standard and political tendencies, using data confidence/coverage metadata.
- Model goods, production, consumption, inventories, input requirements, market access, supply/demand and prices.
- Model buildings/factories with levels, production methods, input goods, output, employment, wages, ownership, throughput and profitability.
- Make construction consume time, money, labour/materials and capacity; do not represent industrialization as a cosmetic level counter.
- Connect taxes, government budget, debt/interest and spending to the economic simulation.
- Avoid invented precision where historical data is missing; distinguish sourced starting values from simulated outcomes and estimates.

Acceptance:
- A factory cannot produce without required inputs/workforce.
- Shortages, transport bottlenecks and market access affect throughput/prices.
- Employment/wages affect POP income and living standards.
- Production, consumption, budget and trade ledgers reconcile within documented tolerances.
- Construction changes the economy only after valid time/cost/input requirements are met.

### P1 — Military and warfare

- Model military formations/units, manpower, officers/generals, organization, equipment, supply, logistics, recruitment, mobilization and upkeep.
- Connect military capacity to population, industry, budget and transport.
- War outcomes must depend on force composition, technology, command, terrain, supply, morale/organization and strategic situation—not a single arbitrary power score.
- Include fronts/battles, attrition, war support and war goals/diplomatic context as appropriate to the approved design.

Acceptance:
- Units cannot exceed available manpower/equipment without explicit penalties or constraints.
- Supply shortages and transport limits materially reduce operational effectiveness.
- Recruitment and mobilization consume population, money, equipment and time.
- Battle outcomes are reproducible from recorded inputs and explainable in reports.

### P1 — Political systems, society and laws

- Model distinct interest groups/classes with membership, clout/power, approval, ideologies and demands.
- Model government composition, legitimacy, elections/appointments where historically appropriate, political movements and law enactment.
- Laws must affect rights, institutions, taxes, education, military, economy and POP outcomes; law changes need political support/opposition and time.
- Represent regime types and social institutions with historical/date validity; avoid one generic political template for all countries.
- Preserve differences between centralized states, empires, decentralized polities and collective leadership systems.

Acceptance:
- A law change has prerequisites, political actors, support/opposition, duration and concrete downstream effects.
- Government changes affect legitimacy/stability and policy capacity.
- POP strata and interest groups react to material conditions and enacted laws.
- No country is forced into an ahistorical political model solely to fit a UI field.

### P2 — Score, rank and progress

- Define what each score represents and publish the formula/weighting.
- Separate economic output, industrial capacity, military strength, prestige/diplomacy, population/welfare and technological development rather than collapsing everything into opaque points.
- Prevent double-counting the same underlying value in multiple score categories.
- Use normalized units and date-aware comparisons; account for country size and data uncertainty.
- Make score changes traceable to actual simulation events and state changes.

Acceptance:
- Every score can be decomposed into named, inspectable inputs.
- Identical game states produce identical scores.
- Scores update only when their underlying state changes.
- UI explains why rank/score changed; no arbitrary unexplained bonuses.

## Cross-system integration requirement

The target is a coherent worldwide grand-strategy simulation for 1836–1936, not isolated screens or decorative counters. POPs, goods, buildings, government, laws, military, diplomacy, technology and country AI must affect one another through explicit rules. Historical Mode begins on 1836-01-01; Sandbox/Alternate History remains a distinct mode sharing the same core simulation engine unless an approved specification says otherwise.

## Required engineering approach after phase authorization

1. Audit the current implementation and tests per subsystem; map every player finding to exact source files, existing behavior, missing mechanics and regression tests.
2. Produce a design/specification and data requirements before changing code. Do not rewrite blindly or inflate file count without architectural need.
3. Implement in vertical slices with deterministic simulation tests, historical data validation, save/load migration tests and Android performance tests.
4. Verify worldwide country coverage; no showcase-only fix for one country or region.
5. Provide owner-testable APKs with a concise change log and known limitations after each accepted slice.

## Immediate next actions

- Keep this feedback as the authoritative player-test backlog.
- Complete the outstanding S0 evidence/review/owner gate. Do not silently treat a successful APK build or dependency audit as authorization to enter S1.
- Once the owner accepts the bounded transition and authorizes S1, begin with P0 clock/pacing and P0 historical identity/portrait audit, then proceed to economy/industry, military, politics/social/laws and score.
