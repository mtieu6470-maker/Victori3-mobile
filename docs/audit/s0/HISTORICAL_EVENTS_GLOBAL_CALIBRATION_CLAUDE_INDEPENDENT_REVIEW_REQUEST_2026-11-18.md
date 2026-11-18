# S22 Historical Events and Global Calibration — Claude Independent Design Review

**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Review type:** independent no-write design review  
**Date:** 2026-11-18  
**Review target revision:** S22 design amendment 1  
**Runtime authorization:** `NONE`

## 1. Exact target

- **Design document:** `docs/spec/HISTORICAL_EVENTS_GLOBAL_CALIBRATION_ARCHITECTURE_PROPOSAL_VI.md`
- **Original design commit:** `e546412b6d4b014bd35da4324d8e2d997dca4138`  
- **Current design revision commit:** `0b25e79cfd94dba5733d6c2ccf5fa1ad592f1e80`  
- **Current design blob SHA:** `006c7abc41ca7aa37a20608b746e20efcf581019`  
- **ChatGPT traceability self-audit supplement:** `docs/audit/s0/S22_DESIGN_TRACEABILITY_SELF_AUDIT_2026-11-18.md` (blob `805666e41d45206db84ed919b5d04aab4f472ec7`)
- **Code baseline:** `e4924ca48264f8d0818eface51a28a87cd363b89`
- **Roadmap:** owner-approved v3.2 with v3.3 amendments.
- **Related designs:** POP Cohorts `b35c5367cfe41bea3036bec2b846d19060f495c0`; S15–S17 `207722d612354f4d1bccc74064d24616efa4511a`; S18–S19 `8f01556bd70fed05be6f880f287a0f3691cd7674`.

Fetch exact current branch HEAD before review. Verify the design file blob equals `ee5c95f6476ffbd4acec6572a9ac01a13d7ac907`; review the amended §§14.1–14.6 together with the traceability supplement. The branch may contain later documentation-only coordination commits; do not silently substitute a different design blob.

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
- `src/engine/data/dbTypes.ts`: Condition, StrategicPriority, DecisionWindow, ExogenousEvent, Milestone and benchmark types.

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
- Are nested `all`/`any` trees bounded by explicit depth/node limits and protected from empty or malformed arrays?
- Does runtime defense-in-depth fail closed without throwing or partially evaluating corrupted legacy payloads?
- Is immutable per-tick evaluation context shared across nested predicates?
- Verify the current source finding independently, including `Condition` typing and `tools/build-data.ts` validator coverage. Identify any conditions used in data but missing from the union, or any unsupported assumptions in the proposed schema.

## 4. Required verdict

Return exactly one:
- `REVIEW_PASS`
- `CHANGES_REQUESTED`
- `BLOCKED`

Provide exact reviewed HEAD/target blob, severity-ranked findings with section/line locators, non-blocking recommendations separately, and explicit no-write confirmation.

The review must distinguish: (1) original proposal defects, (2) amendment omissions or contradictions, (3) code-baseline constraints, and (4) questions requiring an owner decision. Do not approve an implementation-level interpretation that the design has not actually specified.

## 5. Gate boundary

A pass applies only to this design. It does not satisfy S0-B7 review/owner acceptance and does not open S1/S22 or authorize any code/data/save/test/UI/Android/APK change.
