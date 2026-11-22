# Independent follow-up — CATCHUP-01 round 2 (2026-11-22)

**Verdict: PARTIAL ACCEPT.** The four claimed source changes are present. R1/R2 are substantially addressed; R3 is not fully closed by the submitted tests. Static source review only: ChatGPT did not execute the test suite, typecheck, build or benchmark in this pass.

## Findings

### CATCHUP-R1 — GDP-weighted technology diffusion
The knownShare() implementation now sums GDP for living centralised adopters and divides by total GDP. This fixes equal-country weighting. The monthly cache is keyed by both state object and st.tick, which is appropriate if GDP and tech membership only change between monthly ticks.

Residual caveat: GDP is being used as a proxy for the global stock of usable knowledge. That is a design approximation, not a direct historical measure of R&D capacity, education, patent diffusion or technology access. Very high GDP concentration can dominate diffusion even if the economy is resource-rent-heavy or technologically dependent. Keep the proxy explicit and validate sensitivity; do not describe it as a measured historical law.

The new test gives the technology to all countries except the ten largest and asserts the share remains below 0.5. This is a useful regression test but does not directly compare a single microstate source against a single major industrial source, nor test zero/negative/non-finite GDP and all-zero world GDP. Add these edge cases before final calibration.

### CATCHUP-R2 — explicit modernisation rank
LAW_MODERNISATION_RANK and isProgressiveStep() replace array-order inference in the reformism preference. The implementation is explicit and reviewable.

However, the rank is a normative design axis, not a universal historical progression. In particular, treating laissez-faire, free trade and mass conscription as universally “more modern” can encode a teleology and can reward reforms that are not welfare-improving or historically inevitable. Keep the rank only as a personality preference signal, not as a factual progress score. Consider context-specific law desirability (fiscal capacity, industrial structure, war, labour scarcity, literacy, interest-group structure) in a later system. Also make unknown rank values fail closed rather than defaulting to zero, and add exhaustive coverage tests for every law value.

### CATCHUP-R3 — domestic feasibility integration remains open
The new test proves reformUtility() remains below the AI's 0.15 threshold for one Qing scenario. It does not invoke reformAI() or startReform(), and therefore does not prove the full path is blocked by legitimacy, bureaucracy/fiscal capacity, active reform state, historical reservations, cooldowns or political preconditions.

The implementation does have guards in reformAI() (c.reform, cooldown, lawReservedByHistory) and only calls startReform() after the utility threshold and RNG gate. But the requested integration test should exercise the actual AI decision path with a deterministic seed/RNG and assert no reform is started when domestic feasibility fails, even with maximum international emulation. Add a second case where domestic support is sufficient and the reform can start, to prevent a false-positive “always blocked” test.

### CATCHUP-R4 — Sandbox 2022 output
The new log contains a dated 2022 row, so the previous missing-final-year defect is fixed. The reported 8.423bn world population and 86.7 ms/month are outputs of this simulation run, not external historical validation. They should not be presented as evidence that the demographic model matches observed 2022 population without a benchmark comparison.

### CATCHUP-R5 — macro calibration
The new scorecard still reports mean absolute log error 1.328. This is an improvement from the previous 1.374 but is not calibrated. The low industrialiser error (0.712) does not cancel the large non-industrialiser residual. Keep calibration blocked and report the same country/territory coverage and exclusions across versions before claiming improvement. A same-seed with/without CATCHUP ablation is still needed to isolate its causal contribution.

## Acceptance gates
1. Add GDP edge-case/source-weight tests and document GDP as a knowledge-stock proxy.
2. Make unknown law ranks fail closed; add exhaustive rank coverage tests and document the normative nature of the scale.
3. Add actual reformAI/startReform integration tests for blocked and feasible cases.
4. Preserve 2022 output and rerun regression/typecheck/build with exact logs.
5. Run same-seed ablation and compare macro scorecards with unchanged territorial definitions.

No code, coefficients or historical data were changed by this review.
