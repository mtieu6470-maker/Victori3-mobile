# S22 Historical Events and Global Calibration — code-baseline self-audit

**Date:** 2026-11-18  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Inspected HEAD:** `a99b5712ea7f40fb6ca9bbe1d326abf39edb2ef3`  
**S22 design commit:** `e546412b6d4b014bd35da4324d8e2d997dca4138`  
**Design blob:** `1951816446ab3df5b800e4ad2c338948005590bd`  
**Code baseline:** `e4924ca48264f8d0818eface51a28a87cd363b89`  
**Review class:** `CHATGPT_SELF_AUDIT_ONLY`  
**Runtime / data / save / test authorization:** `NONE`

> This is a source inspection by the technical lead, not an independent Claude review, not an acceptance verdict and not a phase transition. It records implementation risks to inform the S22 design review. S1/S22 remain closed.

## 1. Scope and method

Inspected the exact files at HEAD `a99b5712ea7f40fb6ca9bbe1d326abf39edb2ef3`:

- `src/engine/historical.ts`
- `src/engine/systems/events.ts`
- `src/engine/commands.ts`
- `src/engine/data/dbTypes.ts`
- `src/engine/metrics.ts`
- `src/engine/modes.ts`
- `src/engine/divergence.ts`
- `src/engine/simulation.ts`
- `src/engine/save.ts`
- `src/engine/ai/ai.ts`
- `tools/build-data.ts`
- `historical_data/events/historical_events.json`
- `historical_data/events/milestones.json`
- `historical_data/countries/PRU.json`
- `src/ui/screens/Journal.tsx`

The eight core files `historical.ts`, `systems/events.ts`, `dbTypes.ts`, `divergence.ts`, `metrics.ts`, `modes.ts`, `save.ts` and `simulation.ts` have the same blob SHAs at the S22 code baseline and inspected HEAD. The later commits in this range are documentation/design/research changes; no S22 runtime implementation was found.

No files under runtime, historical data, tests, UI, Android, workflows or save schema were changed. No local test, build, CI dispatch or APK build was run. All probability figures below are analytical results from the inspected scoring formula, not simulation measurements.

## 2. Severity-ranked findings

### S22-SA-01 — P1: `rank_at_most` is an unconditional success

**Evidence**

- `src/engine/historical.ts:35`: `case 'rank_at_most': return true`.
- `historical_data/countries/PRU.json`: priority `PRU_kleindeutsch`, window 1848–1871, contains condition `{ type: 'rank_at_most', entity: 'PRU', value: 6 }`.
- `activePriorities()` calls `evalCondition()` directly for every priority condition. No rank resolver is supplied in that path.

**Impact**

Prussia's rank threshold does not gate this priority. The unification bias can remain active even when Prussia is not among the top six powers. The code comment says ranking is evaluated by a caller, but the inspected priority evaluation path does not perform that evaluation.

**Required correction after authorization**

Resolve rank from a deterministic, documented power-ranking function in the evaluation context; define tie handling, living/eligible entity rules and the exact metric used. Do not silently substitute GDP alone or a European-only list.

**Acceptance tests**

- Rank exactly at the threshold passes; one position below it fails.
- Ties have a deterministic documented outcome.
- Dead, decentralized and newly formed polities follow an explicit inclusion policy.
- Missing rank/entity data fails closed and emits a diagnostic rather than returning true.

### S22-SA-02 — P1: AI decision windows are nearly deterministic historical picks, not utility-based decisions

**Evidence**

- `src/engine/ai/ai.ts:239–246`: `decideWindow()` scores each option as `rand(st) + (o.historical ? historicalWeight : 0)`.
- `src/engine/core.ts:13–20`: `rand()` is uniform on `[0,1)`.
- The 19 current decision windows each have one historical and one alternative option; current `historical_weight` values range from 0.6 to 0.9.

**Impact**

There is no option-specific utility comparison in this decision function: current treasury, legitimacy, interest-group preferences, military risk, institutional capacity, prior events and expected costs do not enter the score. With one historical and one non-historical option, the probability of the historical option winning is:

`P = 1 - (1 - w)^2 / 2`

Thus weights 0.6, 0.7, 0.8 and 0.9 imply approximately 92%, 95.5%, 98% and 99.5% selection probability respectively. The current implementation therefore strongly rails the AI toward the historical option whenever the window's conditions are met, even though it is not a literal forced event. Player choices remain separate.

**Required correction after authorization**

Score each option from current simulated utility first. Historical context may contribute a bounded, explainable prior, but must not swamp utility or turn a decision window into a scripted outcome. The size and calibration of the prior must be explicit and tested across seeds.

**Acceptance tests**

- A materially worse historical option can lose to a materially better alternative.
- Equivalent option utilities show only the documented bounded historical prior.
- Changing current-state costs/benefits can change the selected option.
- Multi-seed tests report outcome distributions, not only one chosen history.

### S22-SA-03 — P1: Player decisions can outlive their window and invalid options can consume them

**Evidence**

- `src/engine/systems/events.ts:39–47`: a pending decision is created while the window and conditions are valid; once the window is outside its date range, the loop simply skips it. No expiry transition is visible in this path.
- `src/engine/commands.ts:65–71`: the `decide` command finds a pending ID, removes it, appends the window ID to `firedEvents`, applies the supplied option and returns success.
- `src/engine/systems/events.ts:62–65`: `applyWindowOption()` returns silently when the window or option is missing.
- `src/ui/screens/Journal.tsx:44–55`: pending choices are shown from `pendingPlayerDecisions`; the command sends the selected option.

**Impact**

The command does not validate that the submitted option is in the pending option list, that the window has not expired, or that the current causal conditions still hold. A stale pending item can remain selectable after its date window. An invalid option can remove the pending item and mark the event fired, while `applyWindowOption()` silently does nothing and the command still reports success.

**Required correction after authorization**

Give pending decisions an explicit lifecycle: pending, resolved, expired or invalidated. On submission, re-fetch the definition and validate the option, controlling actor, date window and current preconditions. Do not consume the pending record or set `firedEvents` until validation and effect commit succeed.

**Acceptance tests**

- A choice after the window end is rejected and the pending item expires predictably.
- An option ID not present in the pending definition is rejected without mutating state.
- A condition invalidated while a choice is pending follows an explicit invalidation policy.
- Save/load preserves pending and expired states deterministically.
- A failed effect commit does not leave the event marked as successfully fired.

### S22-SA-04 — P2: Event effects are open-ended records with incomplete validation; one current effect is a no-op

**Evidence**

- `src/engine/data/dbTypes.ts:82–90`: decision option effects are `Record<string, unknown>[]`; no closed discriminated union or per-effect payload schema exists.
- `tools/build-data.ts:365–369`: the event-data validation checks source references, decision entity, date-window order and presence of a historical option. It does not validate the effect type, target IDs, required fields, numeric bounds or effect compatibility.
- `src/engine/systems/events.ts:65–77`: effects are interpreted as `Record<string, any>[]`; the switch has no rejecting default branch and applies mutations directly in sequence.
- `src/engine/systems/events.ts:74`: `case 'ig_approval': break`.
- `historical_data/events/historical_events.json`: the `dw_brazil_golden_law` historical option includes `ig_approval` for `landowners` with `delta: -30`. `Country.igs` does store group approval values (`src/engine/types.ts:47`).

**Impact**

The Brazilian option's explicit interest-group approval effect currently does nothing. More broadly, a typo or malformed target in an effect can be silently ignored or fail after earlier effects have already mutated state. The current data-builder validation cannot catch these cases before runtime.

**Required correction after authorization**

Introduce a closed, versioned effect registry with strict payload validation. Validate every effect and target before applying any effect; stage mutations and commit atomically. Unknown effects must fail data validation or be explicitly rejected at runtime. Implement `ig_approval` semantics or remove the unsupported effect from the data only through an approved content correction.

**Acceptance tests**

- Every effect in all 19 windows validates against the registry.
- Unknown effect types and unknown entity/region IDs fail before simulation.
- An invalid later effect leaves the entire decision unapplied.
- `ig_approval` produces the specified bounded change for the intended IG and no other group.
- Reapplying the same event cannot double-apply effects.

### S22-SA-05 — P1: Compiled benchmark records discard provenance, units and methodology

**Evidence**

- Source records in `historical_data/military/cow_nmc_military.json` and `historical_data/economy/cow_nmc_industry.json` include fields such as `unit`, `sources`, `method` and `note`.
- `tools/build-data.ts:149–154` selects only `population.total`, `military.personnel`, `economy.iron_steel_kt` and `economy.primary_energy_kt_coal_eq`; it pushes only `entity`, `field`, `date`, `value` and `quality`.
- `src/engine/data/dbTypes.ts` defines `HistoricalDB.benchmarks` without unit, source references, method, observation scope, uncertainty interval or comparability metadata.
- Maddison GDP per capita is separately used for the 1836 setup; it is not retained as a multi-year GDP benchmark series in this benchmark list.

**Impact**

Once compiled, the benchmark layer cannot reliably interpret magnitudes across metrics or audit why an observation was accepted. The current compiled set is not the multidimensional calibration registry required by S22. It is a sparse subset of the available data sources, not an annual 1836–1936 world benchmark series.

**Required correction after authorization**

Keep provenance and measurement semantics with every benchmark observation: stable source ID and locator, field definition, unit, observation date/period, entity and territorial scope, transformation/interpolation method, quality, uncertainty interval and comparability notes. Keep missingness explicit. Do not convert a present-day-territory series into 1836 polity data without a traceable allocation method.

**Acceptance tests**

- Build output retains all required metadata and source IDs validate.
- Unit/scope mismatches are rejected or explicitly marked non-comparable.
- Missing values stay missing; no silent point estimates are inserted.
- Each region and polity class has visible coverage counts and uncertainty reporting.
- Holdout years/entities are excluded from calibration and reported separately.

### S22-SA-06 — P2: Annual simulation history is too narrow for global calibration

**Evidence**

- `src/engine/metrics.ts:5–13` records only population, GDP, army manpower, navy strength, literacy, power, number of regions and legitimacy.
- The same sampler skips dead and decentralized countries.
- `historical_data/events/milestones.json` contains 40 milestones; most check territorial ownership, political status or laws. The annual metrics do not provide comparable time series for trade/market access, public finance, health, inequality/strata, migration or technology diffusion.

**Impact**

A territory/milestone-heavy score can say little about whether the simulated societies and economies are historically plausible. Excluding decentralized polities also weakens comparisons for regions where political authority is fragmented or not represented by a centralized country object.

**Required correction after authorization**

Keep diagnostics dimension-separated. Define explicit denominators and coverage rules for centralized states, decentralized polities and non-state actors. Add only metrics with defensible historical definitions and comparable evidence; do not manufacture uniform annual values where sources are intermittent.

**Acceptance tests**

- Each dimension reports its own numerator, denominator, missingness and uncertainty.
- Decentralized polity coverage is visible rather than silently omitted.
- A change in border similarity cannot compensate for a failure in population/economic/social dimensions.
- Calibration reports distributions across multiple seeds and held-out observations.

### S22-SA-07 — P2: A Europe-specific predicate is embedded in the global milestone evaluator

**Evidence**

- `src/engine/historical.ts:37` evaluates `count_owner_european` against the fixed `db.european_powers` list.
- `historical_data/events/milestones.json` uses it in `m_african_partition_1890`, checking five African regions against that fixed list, with a threshold of four.

**Impact**

This predicate is reasonable as a narrowly named metric for the European partition of Africa, but it must not become a generic global political-ownership class or a proxy for worldwide historical fidelity. The current representation embeds a region/power classification directly in the evaluator.

**Required correction after authorization**

Model actor classes and geographic scope as explicit, sourced benchmark/event metadata. Keep this particular historical milestone as a named regional observation, separate from global calibration aggregates. Audit every Europe-specific shortcut before generalizing the evaluator to all world regions.

**Acceptance tests**

- The African-partition milestone remains a regional indicator with its own coverage.
- Global summaries do not over-weight it or treat its actor class as universally applicable.
- Other regions can define distinct actor classes without adding country IDs to engine code.

## 3. Baseline inventory confirmed

At the inspected data baseline:

- 9 date-based exogenous events.
- 19 historical decision windows.
- 1 structural rule.
- 40 measurement milestones.
- 8 initial wars in the historical-events source file.

The source event JSON does carry source and quality metadata for the exogenous events and decision windows. However, their TypeScript interfaces do not model those fields, and the data builder calls `normRefs()` for validation without assigning its normalized result back into a typed event record. The new S22 event schema should preserve this information rather than relying on untyped extra JSON properties.

## 4. Required design-review disposition

The S22 proposal is directionally appropriate in separating physical/exogenous events, conditional occurrences, historical context, player/AI decisions, causal chains and benchmark-only observations. The following points should be explicit in the design before implementation is proposed:

1. Correct the existing `rank_at_most` defect and specify deterministic ranking semantics.
2. Replace random-plus-historical-weight decision selection with current-state option utility and a bounded historical prior.
3. Specify pending decision expiry/invalidation and validate actor, option, date and preconditions at command execution.
4. Specify a closed effect registry, build-time validation, staging/atomic commit and idempotency; resolve the existing `ig_approval` no-op.
5. Preserve full benchmark provenance, unit, territorial scope, method and uncertainty through ETL into the compiled registry.
6. Keep the Africa partition milestone as a regional indicator, not a global score proxy.
7. Define how decentralized polities and non-state actors appear in metrics and coverage reporting.

## 5. Test plan required before any runtime change

The first authorized S22 implementation slice should be preceded by focused tests for:

- Condition evaluator completeness, including every condition type used by current data.
- Rank thresholds and deterministic ties.
- Decision-window utility behavior and historical-prior bounds across seeds.
- Pending choice expiry, invalidation, save/load and invalid option submission.
- Effect schema validation, unknown effects, invalid targets, atomic failure and idempotency.
- Event causality when an upstream condition or political context has diverged.
- Benchmark ETL preservation of provenance, units, ranges and territorial basis.
- Global dimension coverage, held-out comparisons and multi-seed distributions.
- Proof that benchmark diagnostics never change AI decisions or simulation state.

## 6. Limitations and status

- This is a read-only source audit. It did not execute the code or validate these outcomes through a local simulation.
- No Vitest, build, CI or device test was run.
- No runtime, data, save/schema, test, UI, workflow, Android, signing or APK file was changed.
- Findings are self-audit findings pending independent Claude review; they are not accepted changes.
- S1 and S22 remain closed. No gameplay or engine implementation is authorized by this report.
