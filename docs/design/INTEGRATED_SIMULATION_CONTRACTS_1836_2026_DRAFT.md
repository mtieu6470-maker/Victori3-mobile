# INTEGRATED SIMULATION CONTRACTS — 1836–2026

**Project:** Currents of History / Victori3 Mobile  
**Status:** `DESIGN DRAFT — NOT IMPLEMENTATION-AUTHORIZED`  
**Parent scope:** `OWNER_SCOPE_AMENDMENT_1836_2026_SYSTEM_DEPTH.md`  
**Related design:** `TECHNOLOGY_AND_INSTITUTIONS_1836_2026_DRAFT.md`, `SIMULATION_CLOCK_PACING_DESIGN_VI.md`  
**Audited source snapshot:** `experiment/vic3-visual-upgrade`, product-source files as fetched at verified HEAD `3f78f04d8a63f98ca97520e37169510d1262afa4`  
**Target:** global, systemic grand-strategy simulation, 1836-01-01 to the 2026 campaign end boundary.

---

## 1. Executive direction

The project already has a shared Historical/Sandbox monthly engine, an aggregate cohort economy, a technology research loop, political interest groups and laws, bilateral relation values, three treaty types, and national aggregate army/navy values. Those are useful foundations, but they do not yet provide the systemic depth requested for the 1836–2026 product.

This document defines a coherent set of domain contracts and implementation slices. The main design decision is:

> **Use a small number of authoritative, versioned economic and political ledgers, with deterministic aggregation at regional, country and market boundaries. Do not simulate millions of citizens or individual bullets/vehicles as heavyweight runtime objects. Do not conceal meaningful player choices behind a single scalar.**

The engine should model the causal chain:

`POPs ightarrow labor, skills, demand ightarrow firms/buildings ightarrow inventories and markets ightarrow income, prices, fiscal capacity ightarrow politics and institutions ightarrow research, diplomacy and military choices ightarrow conflict, migration and economic change`.

The same state transitions must apply to the player and all AI-controlled countries. Historical data initializes the world; it must not force the future.

## 2. Source-code audit snapshot and current limitations

The following are direct source observations at the recorded audit snapshot, not statements about later implementation.

| Domain | Existing representation | Current limitation relevant to the 2026 target |
|---|---|---|
| Calendar | `GameDate { y, m }`, integer monthly `tick` | No day/hour, monthly-only schedule; campaign ends at 1936 |
| POPs | Region population plus nine strata shares; a cohort economy for employment, income/capita, wage, SoL | No explicit cohort keys by age/culture/religion/profession/rights, no household wealth/inventory ledger |
| Goods | 12 fixed goods | Too small for 20th/21st-century production, consumer, digital, medical, energy and military chains |
| Buildings | 10 fixed building categories | No general site/firm registry, limited ownership, inventories and construction inputs |
| Market | Country/customs-union/world prices and supply/demand/import/shortage aggregates | No fully conserved physical stock/flow ledger by good, location and route |
| Politics | Eight fixed interest-group types, current law set, reform progress and legitimacy | Limited political movements/party/government composition, institutional reach and country/regime-specific representation |
| Technology | Research queue with prerequisites, cost, literacy/university/education/trade effects and global known-share discount | Access, adoption, deployment, maintenance and skill readiness are not separate state |
| Diplomacy | Relation scalar, rivalry list, alliances/guarantees/customs unions | Treaty type is only three variants; no full treaty lifecycle, diplomatic plays or subject autonomy registry |
| Subjects | Country-level `overlord` and `subjectType` fields | One scalar parent relation cannot safely encode overlapping legal, fiscal, military and diplomatic obligations |
| Military | National `Army` and `Navy` aggregates; war participant lists and battle abstraction | No force formations, commanders, equipment stocks, training/readiness records or operational supply network |
| Randomness | One global xoshiro state tuple on `GameState` | Adding many new cadence tasks risks changing unrelated outcomes through RNG-consumption order |
| Save | Version 1 JSON serializes the whole current `GameState` | Legacy tick has monthly meaning; any new clock/domain registries need explicit versioned migrations |

**Non-goals for the first migration:** no simulated individual citizen objects, no object per weapon, no instant conversion of the existing aggregate army into fabricated battalions, and no silent reinterpretation of monthly `tick`.

---

## 3. Architectural boundaries

### 3.1 Authoritative state domains

Use separate state registries with explicit write ownership:

1. **World/Geography:** stable country, region, market-area, route and sea-node IDs; owner/controller and temporal boundaries.
2. **Population:** regional cohorts, labor supply, skills, household demand, welfare and demographic flows.
3. **Production/Firms:** building sites, production methods, firm operations, staffing, output and ownership.
4. **Markets/Trade:** physical supply/demand/inventory, prices, market access, routes, trade capacity, tariffs and contracts.
5. **Public Finance:** treasury, tax claims/payments, spending, debt instruments, interest and fiscal transfer records.
6. **Politics/Institutions:** actors, groups, movements, government, laws, institution instances, administrative capacity and enforcement.
7. **Technology:** global definitions, country research progress, access channels, sectoral adoption and deployment.
8. **Diplomacy/International Order:** bilateral interests/relations, treaties/clauses, subject relations, diplomatic plays and organizations.
9. **Armed Forces:** formations, equipment stocks, personnel, command, doctrine, readiness, logistics, operations and war records.
10. **AI Planning:** strategic goals, priorities, constraints, active plans, decision rationale and action cooldowns.
11. **Event/Command Journal:** validated commands, deterministic events, causal references and player-facing explanations.
12. **Simulation Clock:** canonical logical date, step index, cadence scheduler state (derived/reconstructible), pause and campaign-end status.

A system may read other domains through published read models, but it should not reach into another subsystem and mutate its fields arbitrarily.

### 3.2 Domain command contract

All player and AI decisions enter through the same command validation layer.

A command must include:

- Stable `commandId` and `commandType`.
- `actorCountryId` or an authorized institution/organization actor.
- Target IDs and typed parameters.
- Issued logical date and command sequence.
- Preconditions and permission checks.
- Estimated costs/resources and the resolved actual effects.
- Deterministic result/rejection reason.
- Causal/event references for the audit log.

Commands are validated against the current authoritative state. A UI click must not directly mutate `GameState`. The AI must not bypass validation by directly editing country/region fields.

### 3.3 Event and transaction contract

Use explicit domain events for consequential transitions, for example:

- `BuildingConstructionStarted`, `BuildingCompleted`, `ProductionMethodChanged`.
- `GoodsProduced`, `GoodsConsumed`, `GoodsImported`, `GoodsExported`, `StockLost`.
- `EmploymentChanged`, `WagePaid`, `DividendPaid`, `PopMigrated`.
- `LawProposed`, `LawEnacted`, `InstitutionEstablished`, `GovernmentChanged`.
- `TechnologyResearched`, `TechnologyAccessGranted`, `SectorAdoptionAdvanced`, `EquipmentFielded`.
- `TreatySigned`, `TreatyBreached`, `SubjectAutonomyChanged`, `DiplomaticPlayEscalated`.
- `FormationMobilized`, `EquipmentIssued`, `SupplyDelivered`, `BattleResolved`, `PeaceSettled`.

Every event needs a deterministic event ID derived from the logical step/sequence and domain source, typed payload, actor IDs, target IDs, cause IDs and visible explanation. The event log is not a substitute for state; state remains authoritative and event history is bounded/archivable.

---

## 4. POP and labor contract

### 4.1 Cohort aggregation

A POP cohort is a statistically meaningful group in one region. Suggested identity dimensions:

- Region and political jurisdiction.
- Culture and religion.
- Social/economic stratum or class.
- Profession/occupation family.
- Age band and household/dependent ratio (only when sourced or explicitly estimated).
- Legal status (free, enslaved, serf/tenant, migrant, discriminated/restricted status where modeled).
- Education/qualification band.
- Political rights/franchise eligibility.
- Optional migration-origin grouping if it materially affects behavior.

Do not create a cohort for every individual. Cohorts with compatible dimensions may be deterministically merged under a documented aggregation threshold; cohorts split when a real state transition changes occupation, rights, culture, religion, legal status or migration status.

### 4.2 Cohort state

A first schema proposal:

```ts
interface PopCohort {
  id: string;
  regionId: string;
  cultureId: string;
  religionId: string;
  strataId: string;
  professionId: string;
  legalStatusId: string;
  educationBandId: string;
  ageBandId?: string;
  population: number;              // integer persons
  employed: number;
  unemployed: number;
  dependents: number;
  qualification: number;            // bounded normalized capability
  literacy: number;
  annualWagePerWorker: number;       // fixed-point currency units
  otherIncomePerCapita: number;
  cashSavings: number;               // aggregate household cash
  debt: number;
  assets: Record<string, number>;   // only modeled asset classes
  needsProfileId: string;
  needsCoverage: number;
  livingStandard: number;
  politicalWeight: number;
  radicalism: number;
  migrationPressure: number;
}
```

Optional fields remain absent where the source or game rule cannot support them. Never fill unknown values with a falsely precise default.

### 4.3 Labor allocation

For each region and production period:

1. Compute labor supply by profession/qualification and legal eligibility.
2. Rank employers by wage offer, productivity, transport access, institution/legal constraints and working conditions.
3. Allocate workers without exceeding each cohort's available labor.
4. Buildings may be partially staffed; no workforce means no labor-based output.
5. Changes in employment feed back into wages, household income, migration, class mobility, political clout and SoL.
6. Hiring/firing and profession conversion occur with transition delays; the entire workforce cannot instantly change occupations in one tick.

**Invariants**

- Employed + unemployed + unavailable/dependents must reconcile with cohort population (within an explicit classification contract).
- Total employed persons cannot exceed available eligible labor.
- A cohort's population cannot become negative.
- Births, deaths, migration and legal/administrative transfers must reconcile the total population delta.
- Aggregate region population equals the sum of its cohorts; legacy region-only population/strata are derived during migration and retained as a compatibility view until the cutover is approved.

### 4.4 Needs and living standards

Needs are goods/service baskets indexed by wealth/stratum, legal status and relevant cultural/household parameters. The engine must expose:

- Required quantity by need group.
- Quantity accessible/affordable.
- Shortage and substitution.
- Price paid and tax burden.
- Household income, savings and debt change.
- Real purchasing power and living-standard movement.

A price index alone is not welfare. A household cannot buy goods it cannot physically access or afford; shortages and market disruption must propagate into SoL, health, migration and unrest.

---

## 5. Production, firms, inventory and construction contract

### 5.1 Building site and firm separation

A **site** is a geographic production location. A **firm/operator** manages one or more sites. A site can have:

- Building type and level/capacity.
- Production method and upgrade state.
- Input/output recipe and by-products.
- Infrastructure/utility access.
- Employment plan and staffed workforce.
- Physical inventory/warehouse.
- Condition, damage, maintenance and production downtime.
- Environmental or health externality where modeled.

A firm adds:

- Legal identity, ownership structure and headquarters.
- Site ownership/operator references.
- Revenue, operating cost, payroll, taxes, interest, profit/loss and dividends.
- Credit/insolvency status.
- Reinvestment and expansion decisions.
- Foreign ownership and profit repatriation where allowed.

### 5.2 Production accounting

All recipes use versioned goods IDs and fixed-point quantities. For each period:

`Output = Capacity × MethodFactor × LaborFactor × InputFulfillment × InfrastructureFactor × ConditionFactor`

This formula is a contract shape, not a fixed balance formula. Each modifier must be bounded, explainable and separately tested.

Physical accounting must satisfy:

`OpeningInventory + Production + Imports + TransfersIn = Consumption + Exports + TransfersOut + Losses + ClosingInventory`

For each good, location and period. A missing input cannot be silently created. If inventory is insufficient, production is reduced/paused or the explicit shortage rule is applied.

### 5.3 Ownership and capital

Ownership is represented through shares/claims rather than one owner string:

- State/public.
- Private individual/class/firm.
- Aristocratic/landed estate.
- Cooperative/worker-owned.
- Community/municipal.
- Foreign investor.
- Mixed ownership.

Ownership shares for a site must sum to 100% (or be explicitly in receivership/unowned). Dividends are allocated according to shares and realized profits; losses and subsidies must be booked, not hidden.

### 5.4 Construction pipeline

A construction project requires:

- Valid site/region, type and method.
- Capital funding and credit rules.
- Construction goods/material inputs.
- Labor/engineering capacity.
- Infrastructure and local access.
- Scheduled time and capacity allocation.
- Permits/land rights/administrative approval when applicable.

Project states: `proposed → funded → queued → active → paused/blocked → completed/cancelled`. Every state transition records why. A project cannot complete merely because a progress counter reaches 100 when missing materials or labor are unresolved.

---

## 6. Markets, trade and finance contract

### 6.1 Market topology

Separate the concepts:

- National/customs-union or institutional market membership.
- Local market access and internal transport cost.
- Market areas/connected regions.
- Ports, rail, roads, navigable rivers, canals and sea lanes.
- World-market interface and strategic government-to-government trade contracts.

A state with poor internal connectivity may have very different local prices from the national hub. Landlocked countries need modeled transit rights/routes, not a free global port.

### 6.2 Trade route and contract

A trade route/contract includes:

- Buyer/seller or market participant IDs.
- Good ID, quantity/volume band and quality grade.
- Origin/destination market/site/port.
- Transport mode and route graph.
- Capacity reservation and transport cost.
- Tariffs, subsidies, insurance/finance cost, contract term and renewal.
- Blockade, sanctions, war, piracy or route-disruption modifiers where modeled.
- Actual shipped/delivered/lost quantities and payment settlement.

Separate private profit-driven trade from state diplomatic agreements. A treaty that allows trade does not manufacture ships, port capacity or goods. A trade route that exists must consume capacity and carry physical quantities.

### 6.3 Treasury and fiscal ledger

Use fixed-point integer currency units and a double-entry-style ledger for treasury-affecting events:

`OpeningBalance + Revenue + Borrowing + TransfersIn - Expenditure - PrincipalRepayment - TransfersOut = ClosingBalance`

Interest is expenditure and debt service. Taxes are claims until collected; tax capacity and evasion/unrealized taxes must be explicit. A law may change liability but cannot collect more than the modeled taxable base/capacity.

Debt instruments record principal, currency, interest rate, maturity, creditor, collateral/guarantee, payment schedule, arrears/default state and restructuring terms.

### 6.4 Economic crisis propagation

The design must support causal shocks:
- Crop failure → food shortage/price rise → real income/SoL decline → migration/radicalism/health effects → political pressure.
- Coal/energy shortage → factories idle → layoffs/output decline → tax revenue/credit deterioration → public works and military procurement delayed.
- Port/rail blockade → goods cannot reach destination → local prices diverge → industrial and troop readiness decline.
- Credit crisis → construction and firm investment pause → unemployment and revenue contraction.

---

## 7. Political actors, laws and institutions

### 7.1 Political domain entities

Keep separate records for:

- **Interest group / organized constituency:** membership base, interests, ideology, support/approval, clout, resources and organization.
- **Political movement:** explicit demands, participating groups/cohorts, support, radicalism, escalation, concessions and dissolution conditions.
- **Party/electoral coalition:** platform, members, candidates, vote base and seat/representation rules for regimes that use parties.
- **Government/cabinet:** office holders, appointment/selection basis, coalition, confidence/legitimacy, term and succession rules.
- **Law:** legal code, prerequisites, support/opposition, enactment progress, veto/approval process and enforcement burden.
- **Institution:** administrative organization and service capability (education, health, tax, judiciary, police, labor, infrastructure, central bank, defense, research, etc.).

### 7.2 Regime and historical compatibility

Do not assume every country uses identical parliament/election mechanics. Regime templates should declare:

- Executive selection and succession.
- Legislative/consultative body where historically relevant.
- Franchise and political participation rules.
- Appointment and removal of ministers.
- Military command relationship.
- Legal authority and administrative hierarchy.
- Recognized institutions and customary authority.
- Local/imperial/decentralized authority.

Country/regime-specific data must remain date-valid and sourced. When a historical office or institutional structure is unknown, represent unknown/approximate status with provenance rather than fabricate a cabinet.

### 7.3 Institution effectiveness

Each institution instance has at least:

- Legal status and founding/abolition dates.
- Funding and resource inputs.
- Staff/headcount or capacity band.
- Training/skill requirements.
- Geographic reach and population coverage.
- Enforcement/compliance effectiveness.
- Service output/quality and backlog.
- Political legitimacy, support/opposition and corruption/constraints.

**Law is not implementation.** Passing compulsory schooling does not instantly make every child literate; establishing a civil service does not instantly produce competent administrators in every province.

### 7.4 Political power and outcomes

Clout should be explainable from membership, wealth/assets, occupation, institutional access, legal rights, organization, military influence and the regime's power rules. Movement strength should be tied to affected population cohorts, issue salience, coordination, repression/legitimacy and event context. Do not simply add a fixed radicalism number each month.

---

## 8. Technology and institutional adoption integration

Use the technology registry in `TECHNOLOGY_AND_INSTITUTIONS_1836_2026_DRAFT.md`, but keep the state phases distinct:

`unknown → accessible → researching → researched → sector_adopting → deployed → operationally_mature → obsolete/retired`

For each country/sector:

- Research state and queue.
- Access channel and access date.
- Workforce/skills readiness.
- Production and input readiness.
- Institutional/legal readiness.
- Capital/infrastructure readiness.
- Adoption share, deployment share and maintenance readiness.
- Bottlenecks and transition cost.

A new technology may be researched by a state university, imported by one private firm, deployed in one military formation and still be unavailable to most of the economy. Adoption is spatial, sectoral and organizational.

Institutions unlock capabilities through law and administration but are not technologies. Technologies can make new institutions feasible (telecommunications, statistics, computers), but institutional rules determine how those tools are governed, distributed and enforced.

---

## 9. Diplomacy, subjects and treaties

### 9.1 Separate relationship dimensions

Do not compress international relations into a single score. At minimum keep separate:

- Opinion/relationship attitude (directional where appropriate).
- Trust/reliability.
- Infamy/reputation and legitimacy of actions.
- Strategic interests and threat perception.
- Rivalry/competition.
- Obligations/favors/claims.
- Economic dependence and investment exposure.
- Military capability balance and threat.
- Recognition/sovereignty status.

### 9.2 Treaty registry

A treaty has parties, type, clauses, dates, term, renewal and state. Clauses are typed and enforceable, for example:

- Alliance/defense assistance.
- Guarantee of independence.
- Non-aggression and neutrality.
- Customs/economic union.
- Transit and access rights.
- Trade agreement and tariff terms.
- Foreign investment/protection.
- Subject/overlord autonomy and tribute.
- Military basing, deployment or demilitarized zone.
- Arms control, inspection and prohibited capabilities.
- Reparations and postwar settlement.
- International organization membership/obligations.

Every clause defines who owes what to whom, trigger, duration, conditions, permitted exceptions, breach test, consequence and termination. A country must not be able to accept contradictory obligations without an explicit precedence/conflict rule.

### 9.3 Subject relationship registry

A subject link is not a single country scalar. Record:

- Overlord and subject IDs.
- Relationship type (protectorate, tributary, vassal, dominion, puppet, colony, personal union, dependency, occupied administration, etc.).
- Legal basis, founding date and recognition.
- Autonomy by domain: domestic law, tax, budget, trade, foreign policy, military, succession/administration.
- Tribute/tax formula and payment history.
- Defense, recruitment, basing and diplomatic obligations.
- Market/customs-union status.
- Rights, restrictions, local institutions and representation.
- Liberty/independence pressure, integration progress and autonomy negotiation.
- Breach/conflict/termination and resulting sovereignty.

Types differ by period and political context; not every country maps neatly to a modern legal category. Use source-backed, temporal relation templates.

### 9.4 Diplomatic play and crisis

Model as a state machine:

`tension → diplomatic_play_open → participants_committed → escalation/sway → war_or_backdown_or_negotiated_settlement → treaty/peace/armistice → postwar_obligations`

A play records initiator, target, demands, primary and secondary objectives, participants, offers, obligations, escalation deadlines, mobilization, support, legitimacy and resolution. War should be one possible outcome, not the only diplomatic action. A peace settlement writes clauses and obligations into the treaty registry instead of applying unrelated immediate side effects.

---

## 10. Armed forces, equipment and logistics

### 10.1 Force organization

Use formations at a scale chosen by device profiling (for example corps/division/brigade equivalents by era) rather than one entity per individual soldier. A formation stores:

- Stable ID, owner, branch and formation type.
- Personnel by role/specialty and readiness.
- Commander/command relationship with date-valid office holder.
- Organization, training, morale, experience and cohesion.
- Assigned equipment quantities and serviceability.
- Doctrine/authorized production standards.
- Location/operational area and transport requirement.
- Supply demand and delivered supply.
- Recruitment, reinforcement, rotation and demobilization state.

If history data lacks the unit's exact structure, record an aggregate or unknown formation. Never invent named commanders or precise order-of-battle records.

### 10.2 Equipment inventory

Equipment type includes era, role, weight/volume, strategic goods inputs, maintenance, ammunition/fuel requirement, technology prerequisites, training requirement, production method and obsolescence.

Stock is tracked in batches or type pools by country, formation, depot or shipyard. Equipment issued to a formation must be subtracted from available stock; damaged/lost/retired stocks must be reconciled.

### 10.3 Logistics network

Logistics is a capacity-constrained graph:

- Nodes: depots, ports, railheads, air bases, arsenals, industrial hubs.
- Edges: roads, rail, sea lanes, rivers, air transport and strategic corridors.
- Edge capacities and throughput: tonnage, convoys, trains, fuel, weather/season access and infrastructure state.
- Threat/disruption: occupation, blockade, interdiction, sabotage, sanctions or infrastructure damage.
- Supply demand: food, ammunition, fuel, spare parts, medicine and replacement equipment.

A unit far from a depot with no transport route must not receive perfect supply. Supply shortfalls reduce readiness and operational reach and must produce a visible explanation.

### 10.4 Combat resolution

Keep tactical resolution abstract but stateful and explainable. A battle consumes readiness, supply and equipment and resolves from:

- Committed formations and personnel.
- Commander qualities and command capacity.
- Doctrine and equipment fit.
- Terrain/weather/fortification.
- Reconnaissance/intelligence and communications.
- Supply, fatigue, organization and reserves.
- Naval/air support where applicable.
- Deterministic random inputs associated with the battle/step.

Output includes casualties, equipment loss/damage, territorial control, operational objective, morale/organization, supply expenditure and war support. Do not choose random target regions from an entire enemy country without validating adjacency/operational reach.

### 10.5 Branch-specific modern capabilities

- Land: infantry, cavalry, artillery, armor, mechanized, engineers, air defense and logistics.
- Naval: surface combatants, submarines, escorts, carriers, amphibious/logistics and strategic patrol.
- Air: reconnaissance, fighters, bombers, transport, air defense and unmanned aircraft.
- Strategic: missile/nuclear deterrence, satellite support, cyber and electronic warfare at strategic abstraction.

Technology unlocks a design option; industry manufactures it; budget buys it; training fields it; logistics sustains it.

---

## 11. AI national strategy

AI should use the same command API as the player. Organize decision-making hierarchically:

1. **National objective:** survival, sovereignty, welfare, industrialization, prestige, unification, autonomy, regional influence or security.
2. **Strategic plan:** allocate budget across development, welfare, defense, education, diplomacy and debt stabilization.
3. **Operational goals:** construct capacity, reform a law, seek technology, create a trade corridor, improve a treaty, mobilize or deter a threat.
4. **Tactical action selection:** choose validated commands based on costs, preconditions and expected consequences.

Every AI plan stores target, reason codes, evaluation horizon, expected benefits, cost/risk, constraints and expiry/replan trigger. The player-facing explanation should answer "why this action?" without exposing hidden random seeds.

Avoid one universal AI personality. Use country capability, regime, goals, threats, geography, economic model and institutional constraints. Determinism tests should compare identical seeds and command sequences.

---

## 12. Simulation cadence and order of operations

The logical clock and pacing contract is specified separately in `SIMULATION_CLOCK_PACING_DESIGN_VI.md`. This section defines domain task cadence requirements only; it does not claim that those tasks are implemented.

| Cadence candidate | Primary work | Required ordering / reason |
|---|---|---|
| Six-hour logical tick | Advance time; process due deadlines, timers, command order and immediate state boundaries | Must be deterministic and lightweight; never run the entire monthly economy on each tick |
| Daily | Movement/operation time, selected local supply delivery, active crisis deadlines, day-boundary health/incident tasks where justified | Reads previous stable infrastructure/market snapshots; produces explicit events |
| Weekly | Trade-route adjustment, convoy/transport throughput, selected logistics/front replenishment, AI operational plan maintenance | Must consume actual capacity and stocks; bounded work |
| Monthly | Market settlement, firm production/employment/wages, household consumption, public finance, POP demographic aggregates, politics/laws, technology research, diplomacy/subjects, force recruitment/maintenance, AI strategic update | Stable subsystem order, with previous-period snapshots where feedback loops would otherwise be order-dependent |
| Quarterly | Fiscal/industrial strategic review, institution capacity review, medium-term AI re-planning | Must not duplicate monthly accounting |
| Yearly | National statistics, demographic calibration, national-capability score vector, historical snapshot/reporting | Read finalized monthly state; no unrecorded retroactive mutation |

A task may be moved to another cadence only with a written reason, dependency map, performance budget and determinism tests. Do not multiply the current monthly pipeline by the number of daily/six-hour steps.

### 12.1 Deterministic phase ordering

At a period boundary, use a stable topological task order. Proposed monthly order:

1. Apply queued player/AI commands that have reached their effective date.
2. Resolve treaty/subject obligations, scheduled expirations and diplomatic deadlines.
3. Apply production and inventory availability using opening stocks.
4. Allocate labor, produce goods, deliver trade and clear markets.
5. Pay wages, collect revenues, settle firm profit/dividends and household consumption.
6. Update POP welfare/demography/migration from realized conditions.
7. Update interest groups, movements, law progress and institution performance.
8. Advance technology research/diffusion/adoption/deployment.
9. Update recruitment, procurement, maintenance and strategic force readiness.
10. Resolve operations/battles/war consequences and peace transitions using the declared military phase rule.
11. Update AI plans from the committed state; issue future-effective commands, not hidden retroactive writes.
12. Emit logs/snapshots/metrics and update deterministic counters.

The final order must be reviewed for same-month feedback. If a dependency is intentionally delayed one period, make that delay explicit and test it. Never depend on JavaScript object-key iteration or incidental array order for game outcomes.

---

## 13. Save compatibility, migration and deterministic replay

### 13.1 Legacy v1 handling

Current source serializes `GameState` as save format version 1, with a monthly `tick` and a single RNG tuple. Preserve a v1 reader. Do not mutate the meaning of `tick` in-place or assume absent cohort/stock/treaty fields are historically recoverable.

### 13.2 Staged versioning proposal

- **V2:** envelope with explicit `schemaVersion`, `contentVersion`, canonical date metadata and migration provenance. Preserve the legacy monthly tick as `legacyMonthTick`; do not claim sub-month elapsed precision for old saves.
- **V3:** add normalized POP cohorts and migration from region population/strata/popEconomy aggregates using deterministic, documented allocation rules. Mark unavailable dimensions as unknown/defaulted with provenance.
- **V4:** add inventory/firm/ownership/fiscal ledger contracts. Create opening stock estimates only if the migration can derive them from source data; otherwise start new physical-stock semantics at a declared transition point and tag the initial balance as a migration baseline.
- **V5:** add treaty/subject/diplomatic-play registries. Translate old alliance/guarantee/customs-union entries directly; do not invent clauses that were not saved. Translate `overlord/subjectType` into a single legacy relation with explicit `legacy_migrated` provenance and limited known autonomy.
- **V6:** add formation/equipment/logistics registries. Preserve old country army/navy aggregates as `legacyForceSummary`; do not fabricate formations, commanders or equipment quantities.
- **V7:** add tech access/adoption/deployment and institution instances. Preserve legacy `techs[]` as `researchedLegacy`; adoption/deployment begin unknown or are initialized only from sourced scenario data.
- **V8:** add deterministic scheduler/cadence state and independent random streams. Old v1 monthly saves migrate at month boundary with no inferred day/hour progress.

Version numbers are a design sequence, not approval to implement multiple migrations together. The actual versioning plan should be consolidated into reviewed migration tasks before any production save changes.

### 13.3 Migration safety requirements

- Validate input shape and all IDs before writing a new save.
- Never overwrite the only source save during migration.
- Migration must be deterministic and idempotent for a given input version.
- Preserve original save bytes or create a separate backup slot before accepting a migrated slot.
- On failure, return a typed error and leave the old save loadable.
- Record source version, target version, migration IDs, content/data version and warning count.
- Add tests for unknown countries/regions/goods, missing optional fields, corrupt arrays, invalid ownership references, duplicate IDs and large-world payloads.
- Test continuous run against save/reload at every cadence boundary.

### 13.4 Randomness isolation

The current single global RNG state means adding new stochastic tasks can change the random-number consumption order of existing unrelated systems. A future design should use stable per-domain streams or event-keyed deterministic randomness, with an explicit migration from the legacy global state. Random draws must not depend on map rendering, UI opening, country ordering or frame cadence.

---

## 14. Accounting, consistency and invariants

Minimum invariant suite:

| ID | Invariant |
|---|---|
| INV-POP-01 | Region population equals its cohort total; population change reconciles births, deaths, immigration and emigration |
| INV-POP-02 | Cohort employment/availability never exceeds population or legal labor supply |
| INV-GOOD-01 | Goods opening stocks + inflows = uses/outflows + closing stocks + recorded losses |
| INV-BLD-01 | Production requires capacity, eligible labor, inputs and operational access |
| INV-OWN-01 | Ownership shares sum to the declared ownership total; dividends equal distributable profit |
| INV-FIN-01 | Treasury balance reconciles revenue, spending, borrowing, transfers and debt service |
| INV-CON-01 | Construction progress consumes the required time, labor and materials and cannot exceed allocated capacity |
| INV-TECH-01 | A technology cannot be deployed before access/research and sector readiness conditions |
| INV-DIP-01 | Every active treaty clause references valid parties, effective dates and enforceable obligations |
| INV-SUB-01 | Subject relations cannot form prohibited overlord cycles; autonomy and tribute rules must be internally consistent |
| INV-MIL-01 | Equipment assigned to formations cannot exceed available stocks; casualties/losses/repair/retirement reconcile inventory |
| INV-LOG-01 | Delivered supply cannot exceed source stocks and route/node/edge throughput |
| INV-WAR-01 | Each active war has valid sides and goals; final settlement closes or transforms its associated claims/treaties exactly once |
| INV-AI-01 | AI commands pass the same validation and accounting rules as player commands |
| INV-DET-01 | Same seed, canonical start state, command stream and logical steps produce identical canonical state hashes |
| INV-SAVE-01 | Save/load at any supported cadence boundary reproduces the same future result and does not duplicate scheduled events |

---

## 15. Integrated scenario acceptance suite

Every major domain must pass at least these cross-system scenarios on multiple regions and regime types:

1. **Agrarian export economy:** crop output, land ownership, subsistence/tenant labor, trade capacity and food prices jointly determine SoL, taxes and migration.
2. **Industrial take-off:** construction needs capital/materials/labor; factories hire qualified workers; inputs constrain output; wages create household demand; profits feed ownership and investment.
3. **Great famine:** harvest shock causes market shortage, price spikes, mortality/migration, unrest, reform pressure, fiscal relief and diplomatic grain procurement.
4. **State reform:** a government proposes a law, affected groups/movements react, enactment requires support/legitimacy, enforcement capacity rises with staffing/funding, and population outcomes change with delay.
5. **Subject autonomy crisis:** subject's liberty pressure arises from obligations, taxation, rights and foreign support; negotiation modifies clauses and may lead to a play/war/independence; market and force obligations reconcile at settlement.
6. **Treaty and trade corridor:** transit/trade treaty gives legal access but route capacity, port/rail stocks, tariffs and war/blockade determine real delivered goods.
7. **Modernization under threat:** technology research leads to industrial production and procurement, but training, doctrine, fuel, spare parts and budget determine deployed readiness.
8. **Total-war economy:** mobilization redirects labor and materials, causes shortages and debt, produces casualties and migration, changes political coalitions and ends with enforceable peace obligations.
9. **Postwar/Cold War development:** rebuilding, welfare, education, nuclear/space research and arms procurement compete for treasury and skilled workers; diplomatic blocs influence diffusion and trade.
10. **Digital/AI transition:** data centers and advanced electronics require power, chips, skills and capital; automation changes occupation shares and wages; institutions regulate data/competition and AI deployment; cyber shocks affect markets and state services.
11. **Small-state strategy:** a small country uses selective industry, transit treaties, defensive doctrine, reserves and alliances rather than acquiring every branch.
12. **Sandbox divergence:** same engine, no hard-coded outcome; alternate border, law, alliance and investment choices produce distinct but causally consistent history.

Tests must assert state changes and accounting outputs, not just the presence of screens or non-empty arrays.

---

## 16. Performance and Android representation rules

- Use integer counts and fixed-point currency/quantity scales for deterministic accounting. Document scale/rounding and prevent overflow.
- Use dense arrays for bounded enum dimensions only when IDs/order are canonical; use registries/maps for sparse entities.
- Avoid allocating large transient object graphs on every six-hour tick.
- Batch by dirty country/region/market sets; do not scan the entire world when no relevant state changed.
- Cache derived read models with explicit invalidation by version/period; never treat a stale cache as authoritative state.
- Separate heavy analytics snapshots from hot simulation state.
- Measure memory, GC pauses, tick p50/p95/p99/max, long tasks, input latency, storage size and save migration time on target Android hardware.
- Worker use is an evidence-based architecture decision, not an automatic first step. If used, it owns the authoritative state and exposes versioned snapshots/validated commands only.
- On overload, preserve logical ticks and expose slowdown/backlog; do not silently skip economy, battles or AI.

---

## 17. Source/research alignment

The design adapts general systemic principles rather than copying proprietary implementation or assets.

- Paradox's official product description identifies POP needs/desires and political grouping, trade inputs to factories, diplomacy and production-method-driven world changes as core player-facing pillars.  
  https://www.paradoxinteractive.com/games/victoria-3/about
- Developer Diary #57 describes the causal relationship between POP living conditions, feasible economic structure, building staffing, wages, ownership profits and reinvestment.  
  https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-57-the-journey-so-far
- Update 1.2's official changelog describes investment pools, government/private ownership, production methods, research queues and strategic military objectives as interacting mechanics.  
  https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-78-update-1-2-changelog
- Developer Diary #79 lays out military, diplomacy and internal politics as separate but important systems, and describes improvements/remaining gaps around military overview and diplomatic plays.  
  https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-79-whats-next-after-12
- The 2025 World Market diary describes layered national/local market prices, trade capacity, trade centers, ports, merchant marine, tariffs/subventions and geographic market areas.  
  https://forum.paradoxplaza.com/forum/developer-diary/victoria-3-dev-diary-143-trade-rework-the-world-market.1733205/

The source material establishes reference mechanics and design ideas only. Every implementation, data item, equation, balance value and asset in Currents of History must be independently designed and sourced. A citation to a game diary does not prove historical truth or grant rights to copy game content.

---

## 18. Suggested implementation order after authorization

Work in vertical slices and do not open all domains at once:

| Slice | Main deliverable | Exit evidence |
|---|---|---|
| SYS-00 | Canonical logical clock, period/cadence contracts and command ordering | Clock tests, replay matrix, no FPS coupling, campaign-end boundary |
| SYS-01 | Versioned entity IDs, migration envelope and provenance primitives | Old save remains loadable; migration failure/rollback tests |
| SYS-02 | POP cohort registry and labor allocation | Population/employment invariants, multiple regime/region scenarios |
| SYS-03 | Goods/inventory/production/site ledger | Conservation, shortage and production tests |
| SYS-04 | Ownership, firms, construction and treasury ledger | Dividend/fiscal reconciliation, blocked construction cases |
| SYS-05 | Market graph, ports/routes/trade contracts | Route capacity, market segmentation, tariff/blockade scenarios |
| SYS-06 | Political movements/government/institutions | Law prerequisites, support, administrative reach and enforcement tests |
| SYS-07 | Research access/adoption/deployment | Technology prerequisite/diffusion/sector readiness tests |
| SYS-08 | Diplomatic treaty and subject registries | Lifecycle, clause breach, autonomy and cycle tests |
| SYS-09 | Military formations/equipment/logistics | Inventory conservation, readiness and supply-boundary tests |
| SYS-10 | Diplomatic plays, operations, war and peace settlement | Multi-front deterministic and postwar treaty tests |
| SYS-11 | Global AI planning and observer mode | Country coverage, command validity, explanation and deterministic replay |
| SYS-12 | 1836–2026 history/scenario calibration | Source coverage, temporal validity, uncertainty and regional acceptance |
| SYS-13 | Android performance and save/load hardening | Device measurements, lifecycle, migration, battery/memory and APK QA |

This order is proposed to minimize dependency churn; phase-specific scope and authorization remain mandatory.

---

## 19. Acceptance definition for the two owner workstreams

The two workstreams are complete only when **both** are satisfied:

### Workstream A — core systems and pacing
- Clock is independent of rendering/FPS, deterministic, bounded and correct through pause/background/save/load.
- POP/economy/inventory/finance are conserved and causal.
- Politics/laws/institutions have actor power, enforcement and delayed social consequences.
- Diplomacy includes enforceable treaties, subject relationships and negotiated crises/settlements.
- Military includes force organization, equipment, logistics, readiness and explainable operations.
- AI uses shared commands/rules and can manage domestic/economic/diplomatic/military trade-offs.

### Workstream B — 1836–2026 world evolution
- Campaign and save format reach the 2026 terminal boundary with correct Gregorian calendar.
- Technology tree spans all six era bands with research/access/adoption/deployment/maintenance separated.
- Institutional, economic and military structures change with technology and era without date-forced outcomes.
- Historical starting data and 2026 calibration are sourced, temporally valid and regionally complete.
- Historical, Sandbox and Observer modes share the same simulation contracts.

**A tree, schema, screen or APK by itself does not meet either definition.** Both workstreams require integrated scenario tests, Android performance evidence, independent review and owner acceptance.

---

## 20. Status and gate boundary

This is a detailed design package responding to the owner's request to advance both workstreams. It records audited source limitations and proposed target contracts; it does not claim those contracts are implemented.

At the time of preparation, S0-B7 remains `IN_PROGRESS`; independent review and bounded owner acceptance remain pending; overall S0 remains `PARTIAL — NOT COMPLETE`; the bounded S1-entry package remains `NOT_TESTED`; S1 remains `NOT AUTHORIZED`. No product code, test, runtime clock, save schema, migration, shipped data, asset, build workflow, signing configuration or APK was changed by this design document.
