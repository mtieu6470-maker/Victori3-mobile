# S22 Implementation Test Matrix — Design/QA Handoff

**Date:** 2026-11-18  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Design:** `docs/spec/HISTORICAL_EVENTS_GLOBAL_CALIBRATION_ARCHITECTURE_PROPOSAL_VI.md`  
**Scope:** Test specification only; no test code or runtime implementation  
**Status:** `PRE-IMPLEMENTATION / NOT RUN`

> This matrix turns the S22 self-audit findings into an executable verification plan for a future owner-authorized implementation. A row is a required test, not a claim that the test has been created or passed.

## 1. Gate rules

- S22 implementation remains closed until the approved S0/S1 gates and a separate owner decision authorize an exact slice.
- S1 data/save foundations must provide event-definition versioning, pending-decision persistence, migration and deterministic RNG continuation before S22 runtime state is added.
- Tests must run against a recorded code SHA, data-build SHA/hash, schema/rule version, fixed seed set and configuration.
- Historical and Sandbox must use the same start snapshot and monthly simulation pipeline. Mode-specific behavior must be explicit data policy, not accidental divergence in code paths.
- Test fixtures must use source-backed examples and explicit synthetic negative fixtures. Synthetic fixtures must never be mistaken for historical facts.
- Claude (or owner-assigned independent fallback) must review the implementation after ChatGPT authors it. Self-tests do not qualify as independent review.

## 2. Data schema and condition evaluator

| ID | Scenario | Required assertion |
|---|---|---|
| CND-01 | Every condition type used in country priorities, decision windows and milestones | Each maps to exactly one discriminated-union branch and passes the same recursive validator |
| CND-02 | Unknown condition type / unknown property | Data build fails with source file, JSON path, type and reason |
| CND-03 | Missing required field / wrong primitive or array type | Build fails; runtime corrupted-save fallback returns a non-match diagnostic without throwing |
| CND-04 | Unknown entity, region, law group or IG ID | Build fails before generated DB is written |
| CND-05 | Empty `owner_in`, `owner_not`, `same_owner`, `all` or `any` arrays | Build fails; no vacuous success/failure from malformed content |
| CND-06 | Nested `all`/`any` at depth and node boundaries | Depth 8 / 64 nodes accepted; depth 9 / 65 nodes rejected under the proposed initial limits |
| CND-07 | Rank exactly at threshold / one place outside | Rank predicate matches the documented competition-rank semantics |
| CND-08 | Exact power-score tie | Equal scores share rank; ordering is deterministic by normalized stable ID where an ordered list is required |
| CND-09 | Dead, decentralized, missing or non-finite rank target | Rank condition fails closed with a bounded diagnostic |
| CND-10 | Subject polity and newly formed polity | Candidate inclusion follows the explicit rank contract |
| CND-11 | `not_subject_of`, `not_at_war`, `at_war_with_rebels` | Actor direction, active-war membership and missing-actor behavior match documented semantics |
| CND-12 | `regime_changed` and `leader_changed_since_start` | Compare with the saved scenario start snapshot, not a hard-coded year or missing-value default |
| CND-13 | Numeric thresholds and durations | Non-finite, negative/out-of-domain and overflow values fail build; no implicit `Number(undefined)` semantics |
| CND-14 | Condition evaluation inside nested composites | One immutable per-tick context and rank snapshot is used for the whole expression; evaluation has no side effects |

The current authored data uses a subset of the evaluator's code branches. The test suite must cover every supported branch, not only branches currently present in the eleven named country-profile files, event windows and forty milestone definitions.

## 3. Decision lifecycle and option effects

| ID | Scenario | Required assertion |
|---|---|---|
| DEC-01 | Decision becomes eligible | Exactly one stable DecisionInstance is created for actor + definition + occurrence |
| DEC-02 | Player saves and reloads with pending choice | Same actor, offered options, expiry, definition version and pending identity are restored |
| DEC-03 | Choice inside window with valid actor/option/preconditions | Full transaction commits and lifecycle becomes resolved exactly once |
| DEC-04 | Duplicate command/retry after success | No duplicate effect; result is idempotent |
| DEC-05 | Unknown option or option absent from pending offered set | Rejected; no effect, pending-state consumption or fired-event projection |
| DEC-06 | Expired date window | Deterministic expired transition; no effect applied |
| DEC-07 | Actor died, regime/institution changed or authority revoked | Deterministic invalidation; no effect applied |
| DEC-08 | Causal/resource precondition changed after offering | Revalidated at command boundary; stale option rejected safely |
| DEC-09 | First effect valid, later effect invalid | Entire effect transaction leaves GameState unchanged |
| DEC-10 | Invalid country/region/IG/resource target | Rejected during build and rechecked before transaction commit |
| DEC-11 | Every current effect kind | Handler contract, bounds, target and idempotency tests exist |
| DEC-12 | Existing `ig_approval` source effect | Either supported with precise semantics and passing test, or rejected/reclassified by an approved data correction; never silently no-op |
| DEC-13 | `merge` and `transfer_region.create` | Destination identity/type/name/subject relationship is registry-backed; no ignored payload target or hidden hard-coded polity |
| DEC-14 | Unknown effect kind | Data build fails; runtime fails closed without partial mutation |
| DEC-15 | Player and AI decision authority | Same command/domain validation rules; UI visibility alone is never authority |
| DEC-16 | Legacy pending/fired-event save migration | Explicit migration, collision handling and replay equivalence; unknown versions rejected safely |

## 4. Structural rules and exogenous events

| ID | Scenario | Required assertion |
|---|---|---|
| EVT-01 | Each structural rule in source data | Compiled typed rule is actually evaluated, or is explicitly marked reference-only |
| EVT-02 | Salic-law fixture enabled/disabled | Only the expected personal-union succession transition changes |
| EVT-03 | Duplicate structural handler/hard-coded fallback | Exactly one transition applies; no double execution |
| EVT-04 | Unknown trigger/effect kind | Data build fails with a precise path |
| EVT-05 | Each current exogenous type (`epidemic`, `drought`, `crop_blight`, `resource_discovery`) | Exact payload schema, type-specific required fields and numeric bounds are validated |
| EVT-06 | Invalid date, precision, duration or region list | Data build rejects malformed event records |
| EVT-07 | Epidemic/blight with altered current transport/contact network | Spread footprint changes with current state; historical affected-region list is not forced |
| EVT-08 | Drought event | Physical hazard is applied separately; famine, mortality, migration and unrest remain simulated consequences |
| EVT-09 | Gold/resource discovery without actor access/knowledge/capability | Discovery is suppressed or delayed; geological resource and discovery are distinct |
| EVT-10 | Historical Mode after causal divergence | Historical record does not force an unsupported downstream outcome |
| EVT-11 | Sandbox mode | No post-start political outcome/office-holder script is imported; hazards follow per-class mode policy |
| EVT-12 | Same event evaluated/replayed twice | One occurrence and one transaction only |
| EVT-13 | Source references and quality fields | Normalized references, locators, confidence, date precision and alternative interpretations survive compile/load |
| EVT-14 | Duplicate event/option/rule IDs | Build fails before output |

## 5. Historical measurement and global calibration

| ID | Scenario | Required assertion |
|---|---|---|
| CAL-01 | Milestone before due date | Not score-eligible |
| CAL-02 | Pending milestone from due through inclusive tolerance boundary | Excluded from both resolved numerator and denominator |
| CAL-03 | Milestone achieved during grace | Enters resolved denominator with the documented late-credit formula |
| CAL-04 | Unmet milestone at inclusive `lastChance` | Transitions to missed and contributes zero resolved credit |
| CAL-05 | No resolved milestones | Score is `NOT_SCORABLE` / null; never a fabricated 1.0 |
| CAL-06 | Milestone save/load/replay | Status, credit and score are exact across continuation |
| CAL-07 | Africa partition / European-owner indicator | Reported only as the named regional indicator; excluded from global actor-class and composite scores |
| CAL-08 | Benchmark observation | Unit, date/period, scope, source ID/locator, method, quality, uncertainty and comparability are mandatory or explicitly missing |
| CAL-09 | Missing observation | Remains missing; no zero/default interpolation presented as measured |
| CAL-10 | Present-day territorial dataset crosswalk | Comparison is blocked or labelled with a documented allocation/crosswalk and uncertainty |
| CAL-11 | Region × period × polity class coverage | Numerator, denominator, exclusions and missingness are visible for all 12 project world regions |
| CAL-12 | Calibration vs holdout | Holdout entities/years/sources are excluded from tuning and reported independently |
| CAL-13 | Multiple seeds | Report distributions/intervals and region/polity-type bias, not one target trajectory |
| CAL-14 | Diagnostic isolation | Metric, score and calibration code cannot mutate GameState, AI utilities, resources or event triggers |
| CAL-15 | Territory vs social/economic dimensions | One high territory score cannot hide population, economy, society, military or institutional failures |

## 6. Determinism, save compatibility and performance

| ID | Scenario | Required assertion |
|---|---|---|
| DET-01 | Same seed, save, command stream, data build and rule versions | Exact monthly/event/decision continuation |
| DET-02 | Insert an unrelated event definition | Unrelated actors/subsystems retain the same keyed random draws |
| DET-03 | Reorder JSON/source records | Stable IDs and event outcomes do not depend on object iteration order |
| DET-04 | Save during pending decision or active hazard | Full continuation including RNG stream version and event lifecycle |
| DET-05 | Unknown event/save schema version | Safe rejection or explicit versioned migration; no silent partial defaults |
| PERF-01 | Full 1836–1936 simulation across the global map | Bounded completion and memory growth under recorded configuration |
| PERF-02 | Stress event/decision catalogue at declared maxima | Scheduler uses date/actor indexes; no unbounded whole-catalogue evaluation per tick |
| PERF-03 | Worst-case event density and diagnostic volume | Stable caps, deterministic overflow behavior, no lost pending player choice |
| PERF-04 | Android minimum supported tier and target iQOO-class device | p50/p95 step time, peak heap, GC, temperature, throttle and battery are recorded |
| PERF-05 | UI under active simulation | No main-thread blocking/I/O, ANR or unbounded log rendering |
| PERF-06 | Multi-seed calibration | Runs in CI/off-device analysis path, not on gameplay UI thread |

## 7. CI tier proposal

1. **Fast pull-request tier:** type/schema compilation, recursive validator fixtures, condition/effect unit tests, command transaction tests and save determinism smoke tests.
2. **Integration tier:** full data build, all source-data validation, Historical/Sandbox parity invariants, 1836–1876 and 1836–1900 scenario runs.
3. **Scheduled/release tier:** long 1836–1936 multi-seed distributions, holdout analysis, regional/polity coverage, event stress and save compatibility.
4. **Device QA tier:** minimum supported Android device plus iQOO-class target; thermal/battery/GC/ANR and p95 monthly simulation time.

Seed count, hardware performance thresholds and permitted variance are not fixed in this matrix. They must be derived from measured variance, CI capacity, S0 performance baseline and owner-approved device requirements.

## 8. Verification status

- This file is a test plan only.
- No tests have been added or executed as part of this document.
- No build, CI or device run is claimed.
- SA-01–SA-12 remain code findings until owner-authorized implementation and passing evidence exist.
- S1/S22 remain closed; this matrix does not authorize runtime, data, test, save, UI, Android or APK changes.


## 9. Predicate/effect semantic edge-case additions

Additional cases required by §§14.13–14.14:

- `owns` uses exact stable entity ID in v1; an equivalence alias must not unexpectedly satisfy it. `owner_in`/`owner_not` use the documented equivalence registry.
- `same_owner` requires at least two regions and exact same stable owner ID; a one-region or unknown-owner expression is rejected/non-matching.
- `not_at_war` and `not_subject_of` fail closed when either actor reference is missing; they must not treat missing data as proof of a negative relation.
- `lost_war_recently` rejects a future last-loss tick and tests both inclusive interval boundaries.
- `leader_changed_since_start` and regime-change predicates use the scenario start snapshot, not a hard-coded year.
- `food_shortage` and `foreign_pressure` fixed v1 thresholds are named/versioned constants and have exact boundary tests; naval pressure uses its explicit `>=` semantics.
- `at_war_with_rebels` is tested with normalized government/rebel roles, both side orderings, unknown role attribution and non-civil war.
- Effect `merge` must honor validated source/destination actor identities and cannot create an unrelated hard-coded template.
- Effect `transfer_region.create` must validate the full destination blueprint and subject relationship before any territorial change.
- `relation_all_naval_powers` must use a deterministic, versioned actor-class predicate and must not apply duplicate/self-relations unintentionally.
- Structural Salic-rule fixture must prove the data-declared target (HAN) is respected and unrelated British personal unions remain unchanged.



## 10. Twelve-macro-region taxonomy and geographic crosswalk (SA-13)

| ID | Scenario | Required assertion |
|---|---|---|
| GEO-01 | Owner approves the project macro-region taxonomy | Exactly twelve stable region IDs, labels, boundary reference and decision trace are versioned |
| GEO-02 | Every 1836 strategic map region | Exactly one valid physical macro-region assignment or an explicit unresolved state; no silent omission |
| GEO-03 | Historical source unit maps to strategic regions | Crosswalk has valid-time interval, original unit definition, source locator, allocation method, weights/ranges and uncertainty |
| GEO-04 | Source unit spans multiple strategic regions | Allocation obeys declared conservation rule; no silent equal split or duplicated full value |
| GEO-05 | Political ownership changes over time | Polity membership changes, but physical macro-region assignment of land remains stable |
| GEO-06 | Present-day country/territory benchmark | Cannot enter 1836 polity/regional score without a documented time-valid crosswalk and uncertainty |
| GEO-07 | Decentralized/collective/colonial/subject/rebel actor coverage | Polity type is explicit and missingness visible; no inference from geographic region membership |
| GEO-08 | One macro-region has zero data for a metric | It remains present with zero observation count/missing status; it cannot disappear from a composite denominator |
| GEO-09 | Taxonomy version changes | Historical reports reproduce under their recorded taxonomy version; new version emits a comparable versioned report |
| GEO-10 | No owner-approved canonical taxonomy exists | Region-level coverage score is NOT_SCORABLE; report may show source/entity counts only |

