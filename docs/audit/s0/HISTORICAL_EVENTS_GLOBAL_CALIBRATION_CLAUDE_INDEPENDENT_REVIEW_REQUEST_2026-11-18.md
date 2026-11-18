# S22 Historical Events and Global Calibration — Claude Independent Design Review

**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Review type:** independent no-write design review  
**Date:** 2026-11-18  
**Runtime authorization:** `NONE`

## 1. Exact target

- **Design document:** `docs/spec/HISTORICAL_EVENTS_GLOBAL_CALIBRATION_ARCHITECTURE_PROPOSAL_VI.md`
- **Design commit:** `e546412b6d4b014bd35da4324d8e2d997dca4138`
- **Code baseline:** `e4924ca48264f8d0818eface51a28a87cd363b89`
- **Roadmap:** owner-approved v3.2 with v3.3 amendments.
- **Related designs:** POP Cohorts `b35c5367cfe41bea3036bec2b846d19060f495c0`; S15–S17 `207722d612354f4d1bccc74064d24616efa4511a`; S18–S19 `8f01556bd70fed05be6f880f287a0f3691cd7674`.

Fetch exact current branch HEAD and verify target blob before review.

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

## 4. Required verdict

Return exactly one:
- `REVIEW_PASS`
- `CHANGES_REQUESTED`
- `BLOCKED`

Provide exact reviewed HEAD/target blob, severity-ranked findings with section/line locators, non-blocking recommendations separately, and explicit no-write confirmation.

## 5. Gate boundary

A pass applies only to this design. It does not satisfy S0-B7 review/owner acceptance and does not open S1/S22 or authorize any code/data/save/test/UI/Android/APK change.
