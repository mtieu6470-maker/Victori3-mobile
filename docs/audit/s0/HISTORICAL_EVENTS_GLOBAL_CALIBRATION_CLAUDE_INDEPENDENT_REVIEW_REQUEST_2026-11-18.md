# S22 Historical Events and Global Calibration — Claude Independent Design Review

**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Review type:** independent no-write design review  
**Date:** 2026-11-18  
**Review target revision:** S22 design amendment 4 — consolidated event, mode, schema, determinism and test contracts  
**Runtime authorization:** `NONE`

## 1. Exact target

- **Design document:** `docs/spec/HISTORICAL_EVENTS_GLOBAL_CALIBRATION_ARCHITECTURE_PROPOSAL_VI.md`
- **Original design commit:** `e546412b6d4b014bd35da4324d8e2d997dca4138`  
- **Current design revision commit:** `4b8efe94a4f37ad878c15bb4fa6a08d1c205af83`  
- **Current design blob SHA:** `fbbad73aae57a26a52aefadc630c8b6cb340040c`  
- **ChatGPT traceability self-audit supplement:** `docs/audit/s0/S22_DESIGN_TRACEABILITY_SELF_AUDIT_2026-11-18.md` (blob `2671216d760efc4245db47b7bc3cc3d1613494be`)
- **Code baseline:** `e4924ca48264f8d0818eface51a28a87cd363b89`
- **Roadmap:** owner-approved v3.2 with v3.3 amendments.
- **Related designs:** POP Cohorts `b35c5367cfe41bea3036bec2b846d19060f495c0`; S15–S17 `207722d612354f4d1bccc74064d24616efa4511a`; S18–S19 `8f01556bd70fed05be6f880f287a0f3691cd7674`.

Fetch exact current branch HEAD before review. Verify the design file blob equals `fbbad73aae57a26a52aefadc630c8b6cb340040c`; review §§14.1–14.14 together with traceability supplement blob `2671216d760efc4245db47b7bc3cc3d1613494be`, code self-audit blob `791ac317444fc660a9bcc45a11c6b30ff217b278`, and implementation test matrix blob `8c973460cf9333f003490154056e28c7e01353a9`. The branch may contain later documentation-only commits; do not silently substitute a different design blob.

## 2. Independence/no-write

Claude must not have authored or modified this design. Do not edit files, create fixes/commits/branches/PRs, change runtime/data/save/tests/UI/Android/workflows or run build/APK. This is design review only.

## 3. Required review areas

### A. Code baseline
Verify:
- `src/engine/historical.ts`: Condition evaluation, activePriorities, historicalBias and hard-coded Europe/major-power cases.
- `src/engine/systems/events.ts`: exogenous shocks, succession, elections, decision windows, option effects and customs accession.
- `src/engine/divergence.ts`: territory similarity, milestone score, divergence entries and annual similarity.
- `src/engine/metrics.ts`: yearly metric set and ranking.
- `src/engine/modes.ts`: mode differences while sharing simulation pipeline.
- `src/engine/data/dbTypes.ts`: Condition, StrategicPriority, DecisionWindow, ExogenousEvent, Milestone, StructuralRule and benchmark types.
- `tools/build-data.ts`: exact event/decision/condition/structural-rule validation and normalized source assignment.

Confirm every claim and identify any missing critical issue.

### B. Event taxonomy/causality
- Are physical exogenous shocks separated correctly from political response, historical pressure, conditional occurrence, player/AI decisions, benchmarks and narrative logs?
- Is calendar eligibility separated from causal preconditions?
- Does the design safely suppress/re-evaluate downstream events when history diverges?
- Are uncertain dates, location, actor identity and contested interpretations represented?
- Are causal graphs bounded and protected against cycles/retrigger loops?
- Can Historical Mode retain source-backed context without applying fixed political outcomes?

### C. Decision/effect safety
- Are decision authority, consent, expiry and invalidation adequate given S15–S17?
- Is Typed Effect Registry sufficiently constrained and versioned?
- Is validate-stage-commit atomicity implementable?
- Are idempotency and save/load pending-decision semantics safe?
- Are unknown effect types inert/rejected rather than partially executed?
- Does historical weight remain a soft, explainable prior, not a forced action?

### D. Global calibration
- Are benchmark facts scoped by entity/geography/date/unit and provenance?
- Are uncertainty intervals and definition comparability clear?
- Is regional/entity coverage balanced and visible?
- Is training/validation holdout sufficient to reduce overfit?
- Are multi-seed distributions more appropriate than one expected trajectory?
- Are dimension-level metrics separated and prevented from mutating simulation/AI?
- Does the design avoid rewarding European data density or forcing a fixed historical outcome?
- Does it distinguish source-data observations from compiled/runtime facts, and preserve missingness rather than filling it?

### E. Historical/Sandbox contract
- Same 1836 initial snapshot and same systems pipeline?
- Historical date facts handled separately from post-start political outcomes?
- Physical exogenous policy explicit in both modes?
- Sandbox free from fixed post-start decision scripts?
- Historical Mode permitted to diverge when the player's/AI's agency changes preconditions?

### F. Performance/save/tests
Assess event registry size, active event/decision state, log retention, multi-seed benchmark CI costs, deterministic replay, exact save/load and long-run 1836–1936 coverage.

### G. Amendment-specific checks (mandatory)

Verify the normative additions in §14:

- **14.1 / SA-01:** Does rank evaluation reuse the same power-ranking contract, eligible actor set and competition-rank/tie semantics? Is the fail-closed behavior for missing/decentralized/dead actors coherent with the baseline?
- **14.2 / SA-07:** Is the African partition metric explicitly isolated from generic global aggregates? Are region × period × polity-class coverage and missingness adequate?
- **14.3 / SA-09:** Is excluding pending milestones from both resolved-score numerator and denominator during the grace interval mathematically and temporally consistent? Is `NOT_SCORABLE` preferable to a default score of 1.0 when no records are resolved?
- **14.4 / SA-03:** Does command-boundary revalidation cover canonical definition, option membership, authority, date, causal/resource preconditions, atomicity and idempotency without consuming rejected decisions?
- **14.5 / SA-08:** Is source-date precision preserved while monthly effective time is deterministic and honestly represented in logs?
- **14.6:** Are the proposed invariants sufficient, and are any boundary cases or incompatible legacy-save assumptions missing?

Also check the proposed rank semantics against the inspected `rankings()` and `powerScore()` behavior at the exact code baseline. Do not treat the self-audit's claims as unquestionable; independently verify them and flag disagreement with line-level evidence.

### H. Closed condition grammar (SA-10)

- Does §14.7 define a genuinely closed, discriminated condition grammar covering every current `evalCondition()` branch?
- Is the same recursive validator applied to country priorities, decision windows and milestones?
- Are IDs, required/optional fields, primitive types, numeric ranges, date formats and enums validated with useful source/JSON-path diagnostics?
- Are nested `all`/`any` trees bounded by the proposed maximum depth 8 / 64 nodes per expression, and are these limits justified against the current source catalogue and future data growth?
- Does runtime defense-in-depth fail closed without throwing or partially evaluating corrupted legacy payloads?
- Is immutable per-tick evaluation context shared across nested predicates?
- Verify the current source finding independently, including `Condition` typing and `tools/build-data.ts` validator coverage. Identify any conditions used in data but missing from the union, any unsupported assumptions, and whether the 8-level / 64-node limit is safe and testable.

## 4. Required verdict

Return exactly one:
- `REVIEW_PASS`
- `CHANGES_REQUESTED`
- `BLOCKED`

Provide exact reviewed HEAD/target blob, severity-ranked findings with section/line locators, non-blocking recommendations separately, and explicit no-write confirmation.

The review must distinguish: (1) original proposal defects, (2) amendment omissions or contradictions, (3) code-baseline constraints, and (4) questions requiring an owner decision. Do not approve an implementation-level interpretation that the design has not actually specified.

## 5. Gate boundary

A pass applies only to this design. It does not satisfy S0-B7 review/owner acceptance and does not open S1/S22 or authorize any code/data/save/test/UI/Android/APK change.


### I. Structural-rule registry and source/runtime parity (SA-11)

- Verify independently that the current `structural_rules` source record is compiled but not consumed by the runtime; compare the exact Salic rule source payload with the hard-coded succession behavior.
- Does §14.9 specify one source of truth, typed triggers/effects, scope, precedence, temporal validity and idempotency?
- Does the current runtime branch apply a broader target set than the source record (all GBR personal unions vs the HAN record)? Confirm exact evidence and severity.
- Is the source target and heir/legal trigger modeled from defensible actor/office facts rather than a name-regex heuristic?
- Does the test plan prove no duplicate hard-coded execution and no scope expansion?

### J. Complete event schemas and provenance (SA-12)

- Does §14.10 cover every current field/type in exogenous events, decisions, option effects, milestones and structural rules?
- Does the proposed validator check date precision, date-window shape/order, option uniqueness, historical-weight bounds, numeric ranges, actor/region/resource/IG/law IDs and effect-specific payloads?
- Are normalized `SourceRef[]`, quality, uncertainty and alternative interpretation retained in typed compiled records, instead of depending on incidental JSON properties?
- Does the effect inventory include all nine current effect kinds, and is the `ig_approval` no-op handled safely?
- Are hidden hard-coded IDs/names or ignored effect payload fields called out in `merge` and `transfer_region.create`?
- Verify no unsupported effect is treated as successful, and partial mutation is impossible.

### K. Detailed condition/effect semantics and test matrix

- Review §14.13's predicate semantics against each source-code branch; challenge exact-ID vs equivalence behavior, missing actor cases, `same_owner` minimum length, war-side normalization, time-window boundaries and named threshold constants.
- Review §14.14's nine effect contracts and identify omitted legacy payload fields/behavior.
- Independently inspect `S22_IMPLEMENTATION_TEST_MATRIX_2026-11-18.md`; identify missing positive, negative, boundary, migration, replay, cross-mode and device scenarios.
- Confirm the test matrix does not claim tests were run and does not authorize test/runtime implementation before the project gates.
