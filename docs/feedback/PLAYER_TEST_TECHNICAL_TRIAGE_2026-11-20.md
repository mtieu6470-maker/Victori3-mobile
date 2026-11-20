# Player Test Technical Triage — 2026-11-20

## Status and scope

- Branch snapshot reviewed: `experiment/vic3-visual-upgrade`, HEAD `d3fc67d042dd2041eb1a26777bfc0566dcd26b19`.
- This is a **read-only source correlation** of the owner findings in `PLAYER_TEST_FEEDBACK_2026-11-20.md`; it is not a gameplay change, a design approval, an S0/B7 review verdict, or S1 authorization.
- No runtime source, test, generated data, image asset, save format, Gradle, signing or workflow file was changed. No APK was installed and no iQOO device test was performed.
- Finding confidence below distinguishes code-path defects from broader product-quality judgments that still need measured gameplay evidence.

## 1. P0 — Simulation clock has the wrong granularity and is coupled to rendering

**Evidence**

- `src/engine/types.ts:19,136`: `GameDate` stores year/month only; `GameState.tick` has no day/hour phase.
- `src/engine/simulation.ts:18,23-49`: campaign ticks are monthly; `stepMonth()` advances one month and runs the full monthly pipeline.
- `src/ui/game/controller.ts:11,79-102`: the controller invokes `stepMonth()` from `requestAnimationFrame`; speed 5 sets the interval to zero and invokes one monthly step per animation callback.
- `src/ui/App.tsx:332`: the player can cycle to speed 5 from the speed control.
- The authoritative clock design already exists in `docs/spec/SIMULATION_CLOCK_PACING_DESIGN_VI.md`; it separates scheduler refactoring from the later increase in logical calendar resolution.

**Correct Victoria 3 reference**

Paradox's technical diary describes a regular Victoria 3 tick as **six in-game hours** (four logical ticks per day), with separate regular, daily, weekly, monthly and yearly task cadences. It explicitly distinguishes tick speed from FPS and explains task dependencies and separate simulation/UI/render responsibilities. The diary does **not** publish a universal fixed number of game-days per real second for speed 5; maximum wall-clock throughput depends on the machine and simulation workload. Source: [Paradox — Dev Diary #76: Performance](https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-76-performance), 2023-02-22.

**Correction to the previous comparison**

The earlier statement that 60 RAF callbacks could theoretically advance five calendar years in one real second was only a calculation from this project's current monthly-step code under a hypothetical 60 callbacks/second. It was not a measurement on the owner's phone and was not a like-for-like statement about Victoria 3 speed 5. The correct architectural comparison is: Victori3 Mobile advances one **month** per current logical tick, while the documented Victoria 3 regular tick represents **six hours**, with larger tasks scheduled at different cadences. Therefore this is not a matter of simply choosing a slower `SPEED_MS` constant. The simulation calendar is too coarse, and every major system is updated through a monthly pipeline.

**Technical conclusion**

Two separate defects must be addressed in order: (1) rendering callbacks must not determine simulation progress; (2) the monthly-only calendar/system model must be redesigned into a higher-resolution logical clock with explicit task cadences. Do not run the existing monthly pipeline four times per day or relabel that as Victoria 3 parity. A monthly-to-six-hour conversion affects cooldowns, event dates, wars, reforms, migration, histories, RNG consumption, tests and saved games; it requires a separate data/save migration design.

**Future acceptance work (not implemented)**

- Follow the staged `SIMULATION_CLOCK_PACING_DESIGN_VI.md`: first decouple the scheduler from RAF while preserving existing monthly semantics; only then implement a higher-resolution logical clock and cadence graph.
- Keep render FPS independent from logical ticks; maintain bounded backlog without silently dropping ticks or running unbounded catch-up.
- Define regular/daily/weekly/monthly/yearly task frequencies, dependencies, stable ordering and deterministic RNG consumption.
- Add tests at mocked 60/90/120 Hz, low/high load, long stalls, pause/resume, background/foreground and save/load.
- Benchmark real Victoria 3 and Victori3 Mobile separately; record game-days per real minute, hardware/workload, and speed setting. Do not hard-code a speed mapping until measured and owner-approved.

## 2. P0 — Portrait selection contains no date-validity check at the display point

**Evidence**

- `src/ui/game/content.ts:18-23`: each `ContentCharacter` carries dated `terms`, while each `ContentAsset` carries a `period`.
- `src/ui/game/content.ts:57-65`: `inPeriod()` is used by `symbolFor()` for flags/arms.
- `src/ui/game/content.ts:72-75`: `characterByName(entity, name)` resolves by exact or shortened name; it accepts no game date and does not inspect the character's active term.
- `src/ui/screens/Country.tsx:175-195`: `IdentityHeader` resolves the current ruler with `characterByName(id, c.leader.name)` and passes `ruler?.portrait` directly to `AssetImg`.
- `src/ui/components/identity.tsx:25-35`: `AssetImg` resolves the asset ID and renders its path; it does not compare the portrait asset's `period` with the current game year.
- `tools/build-content.ts:45-54`: the content builder assigns the first portrait matching a character ID; that selection does not filter by the character term or portrait validity period.

**Technical conclusion**

The data model contains date ranges, but the portrait rendering path does not enforce them. An asset whose recorded period does not cover the current simulation year can still be rendered for a name match. This is a confirmed missing guard in the audited path; it does not, by itself, prove which exact portrait the owner saw or that every image record is wrong.

**Future acceptance work (not implemented)**

- Resolve the active person/office by entity, role and current simulation date, not name alone.
- Select only a portrait whose provenance and validity period cover the displayed date; reconcile the portrait's period with the person/office term.
- Where identity, term or image validity is ambiguous/missing, show the neutral monogram/council fallback rather than anachronistic imagery.
- Add date-boundary tests (day/month/year before, during and after a term), duplicate-name/alias tests and asset-period tests. Re-audit source/license/attribution independently before adding or replacing any asset.

## 3. P1 — Military is a high-level aggregate war model, not a unit/logistics simulation

**Evidence**

- `src/engine/types.ts:21-25`: the army state is represented by manpower, target, quality, morale and supply; the type has no separate battalion/formation, officer/general, equipment-stock or organization ledger.
- `src/engine/systems/military.ts:19-40`: effective army strength is manpower × quality × supply × morale; quality is based on law/technology/decentralization, supply is derived from the arms market price, and manpower moves toward a population-based cap.
- `src/engine/systems/military.ts:62-146`: monthly battles use aggregate side strength, naval thresholds, terrain modifiers and random resolution; occupation and war score are updated at the country/region level.
- `src/ui/screens/Military.tsx:32-43`: the UI exposes those aggregate measures to the player.

**Technical conclusion**

The engine does contain terrain, technology, navy, manpower, supply/market-price and war-goal effects; it is not a single unmodified number. However, the audited schema and battle loop are still country-level aggregates, without the unit composition, commanders, equipment inventories and operational logistics described in the owner's acceptance requirements. The reported gap is consistent with the architecture.

**Future acceptance work (not implemented)**

Design a staged military vertical slice around formation/unit types, recruitment constraints, equipment and supply consumption, command/terrain/organization effects, deterministic battle inputs and an explainable battle report. Do not add fields ad hoc or change save compatibility before an approved design and migration plan.

## 4. P1 — Economy has production/market abstractions, but not yet the requested full industrial economy

**Evidence**

- `src/engine/systems/economy.ts:15-22`: factory output and input requirements are represented by fixed recipes and per-worker coefficients.
- `src/engine/systems/economy.ts:212-215`: the source explicitly describes the population economy as an **aggregate cohort model (not individual Pops)**.
- `src/engine/systems/economy.ts:250-274`: household demand is driven by formula-based cohort consumption curves.
- `src/engine/systems/economy.ts:541-574`: market clearing records aggregate supply, demand, imports and shortage for each good.
- `src/engine/systems/economy.ts:588-601`: output value is adjusted by recipe-input fulfillment and market prices.
- `src/engine/types.ts:103-104`: the persisted market-good record is supply/demand/imports/shortage, not a per-good physical stockpile ledger.

**Technical conclusion**

There is meaningful economy logic: worker allocation, recipes, market access, shortage effects, prices, employment and fiscal flows. The shortfall is that the model is highly aggregated and formula-driven. In the reviewed market ledger, the persisted state is flow/shortage data rather than a granular inventory and logistics model. The owner’s request for factories, stocks, input chains, transport and household feedback therefore remains materially beyond what this implementation currently exposes.

**Future acceptance work (not implemented)**

Define the economic data contract first: POP/cohort ledger; inventory and consumption accounting; building input/output/workforce/wage/profit ledgers; market-access and transport constraints; construction inputs/cost/time; and treasury/tax reconciliation. Acceptance must include no-input/no-workforce production tests, shortage propagation, inventory balance, fiscal balance and construction completion tests.

## 5. P1 — Politics and laws are represented by a compact rule table

**Evidence**

- `src/engine/systems/politics.ts:12-22`: eight fixed interest-group categories and a static law-preference table.
- `src/engine/systems/politics.ts:60-130`: clout, approval and legitimacy are computed from strata, income/literacy, law preferences and formula-based adjustments.
- `src/ui/screens/Politics.tsx:15-16, 23-79, 84-128`: the player interface presents the fixed groups, current clout/approval and reform/law choices.
- `src/engine/systems/events.ts:28-36`: republic leadership changes include a simplified term/election transition; therefore this triage does not claim that elections are wholly absent.

**Technical conclusion**

Political feedback exists, including interest groups, law support, legitimacy, reform progress and revolutions. However, this is a compact abstraction: the reviewed path does not yet demonstrate the wider political movements, office/government composition, country-specific institutional behavior and deep downstream POP/class consequences required by the owner. This is a scope/depth gap, not proof that every political rule is broken.

**Future acceptance work (not implemented)**

Specify country/regime-aware institutions, political actor membership and power, government formation/elections/appointments where historically valid, law prerequisites and enactment, and explicit effects on POP rights/institutions/economy/military. Test centralized, imperial, decentralized and collective polities separately.

## 6. P2 — World ranking is currently one compact power score

**Evidence**

- `src/engine/systems/diplomacy.ts:13-15`: `powerScore` combines square-root GDP, effective army strength, navy strength/quality and prestige.
- `src/engine/metrics.ts:16-18`: `rankings()` sorts countries by that single scalar.
- `src/ui/App.tsx:314-320` and the Country screen present the resulting rank/power value.

**Technical conclusion**

The score is deterministic from the current state, but it does not separately expose industrial capacity, population welfare, technology or the other dimensions in the owner’s requested scorecard. The formula is short and opaque from the player's perspective, consistent with the P2 feedback.

**Future acceptance work (not implemented)**

Publish a decomposable score with named components, units, normalization, source/uncertainty treatment and anti-double-counting rules. UI must show the components and explain rank changes; identical states must produce identical scores.

## 7. Related P0 reliability risk — lifecycle save remains unproven

**Evidence**

- `src/ui/App.tsx:90-114`: autosave is asynchronous and calls `void saveSlot(...)`; failures are reported through a toast.
- `src/ui/App.tsx:118-135`: checkpoints are triggered every three simulation ticks, with `visibilitychange` and `pagehide` handlers.
- The `pagehide` handler starts the same asynchronous save path but does not await its completion. The presence of lifecycle event handlers is therefore not proof that a WebView/process kill will wait for the IndexedDB/storage transaction.
- Existing Risk Register R7 remains **OPEN P0**; no actual renderer/process-death recovery test or iQOO device evidence was produced by this read-only review.

**Disposition**

Do not describe R7 as fixed. Retain its current containment and require Android lifecycle/process-death/renderer recovery tests, save-integrity checks and device evidence before closure.

## 8. Overall conclusion and sequencing

The expanded feature-by-feature comparison is maintained in `docs/feedback/VICTORIA3_FEATURE_PARITY_GAP_AUDIT_2026-11-20.md`. The normative requirements remain in `docs/spec/MASTER_SPEC_VI.md`; the clock-specific technical design remains `docs/spec/SIMULATION_CLOCK_PACING_DESIGN_VI.md`.

| Priority | Confirmed source-level gap | Required first engineering slice after authorization |
|---|---|---|
| P0 | Monthly-only logical calendar and RAF-coupled scheduler; portrait display omits term/asset-period validation | Scheduler decoupling, higher-resolution cadence design/migration, date-valid ruler/portrait resolver |
| P1 | Aggregate POP/economy, limited treaty/subject model, scalar army/navy and country-level wars, compact political rules | Approved domain contracts and integrated vertical slices with deterministic scenario tests |
| P2 | Single scalar world power ranking and incomplete map/visual depth | Decomposable national-capability vector, explainable UI and world/map depth |


The owner’s APK rejection remains the product acceptance verdict. Run #324's 38 suites / 97 tests and successful debug build validate the recorded CI build/test path only; they do not invalidate these gameplay findings or substitute for Android device QA.

**Phase boundary:** all findings above are recorded for planning and review only. S0-B7 remains IN_PROGRESS; R7 OPEN P0; R14 BLOCKED; G0.7 BLOCKED; G0.8 PARTIAL; DEP-F1 OPEN P1; G0.9 BLOCKED; S1 NOT AUTHORIZED. No gameplay, engine, UI, save, data or asset change is authorized by this triage.
