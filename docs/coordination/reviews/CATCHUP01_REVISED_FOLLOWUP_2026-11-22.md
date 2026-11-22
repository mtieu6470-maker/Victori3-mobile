# Follow-up review — revised CATCHUP-01 and 2022 validation

**Verdict:** ACCEPT CORE FORMULA AS SAFER; DO NOT ACCEPT AS CALIBRATED OR SANDBOX 2022 RUN AS COMPLETE.

## Fixes confirmed
- knownShare=0 gives no imitation discount regardless of age.
- Age only codifies know-how on a 20-year ramp; no independent age discount.
- Max imitation discount 40%.
- Absorptive capacity uses receiver trade exposure and literacy.
- techCost is pure; no direct GDP/outputReal/TFP/population/researchPoints mutation.
- Explicit single-step EMULATION_STEPS exist for education/labour/press/power; weight is 0.3 with trade exposure.
- Eight dedicated tests exist.

## Residual findings
### CATCHUP-R1 — equal-country knowledge share remains weak exposure proxy (P2)
knownShare counts each living centralised state equally. Microstate and major industrial state have the same source weight; closed receivers can still receive the global signal. Existing small-vs-large test compares recipients, not source influence. Add tests for microstate-source vs major-industrial-source; otherwise document equal-country share and sensitivity.

### CATCHUP-R2 — reformAI still has ordinal law preference (P2)
lawEmulation uses explicit steps, but reformAI still derives its progressive preference from array order. Replace with explicit per-law transition preference/context.

### CATCHUP-R3 — missing domestic-feasibility integration test (P2)
Pure lawEmulation score is tested, but not reformAI/startReform when IG support, legitimacy, bureaucracy/fiscal capacity or history-reserved decisions block change.

### CATCHUP-R4 — output named 1836–2022 only runs through 2010 (P1)
LONGRUN_SANDBOX_1836_2022_CATCHUP01R_2026-11-22.txt contains years 1850,1870,1890,1910,1935,1960,1985 and 2010; no 2022 row. Rename or regenerate a real 2022 output.

### CATCHUP-R5 — macro deviation remains large (P1 calibration blocker)
Historical seed-1 2022 scorecard: mean absolute log error 1.374 overall, 0.711 industrialisers, 2.037 other economies. Individual 2022 log errors: UK -0.386, France -0.768, Prussia/Germany approximate -0.890, USA -0.798, Qing/China approximate -2.028, EIC/India approximate -1.543, Japan -1.872, Brazil -2.704. RUS/TUR are territory mismatches and should be excluded. This does not prove CATCHUP caused the gap; it shows the whole economy is not calibrated.

## Acceptance gates
1. Complete Sandbox to 2022 with actual dated output.
2. Test source-size sensitivity and knowledge access.
3. Replace residual ordinal preference and test domestic blocking.
4. Run regression, typecheck, build and target Android benchmark with exact results.
5. Compare same-seed with/without CATCHUP to isolate effect.

No code or coefficients changed.


## Independent re-review — CATCHUP-01 round 2 (2026-11-22)

**Verdict:** The four previously identified implementation gaps are addressed in the current source snapshot. Accept the round-2 code direction; do not label the macroeconomy calibrated. This is a static source/test review, not an independent execution of the reported Vitest/build commands.

### R1 — GDP-weighted technology exposure: CLOSED
- `knownShare()` now sums GDP weights for countries already holding the technology and divides by the GDP weight of all alive, centralised countries.
- Microstates no longer count one-for-one with major economies. Zero/invalid GDP contributes zero weight.
- `tests/catchup.test.ts` explicitly gives the technology to every country except the ten largest economies and asserts the resulting share remains below 0.5.
- Residual limitation: GDP is a proxy for knowledge-production/exposure, not a direct measure of research capability, patent access, trade links or technology licensing. Treat the weight as a design proxy, and run sensitivity checks before tuning it.

### R2 — ordinal array preference: CLOSED WITH DOCUMENTED DESIGN CAVEAT
- `LAW_MODERNISATION_RANK` and `isProgressiveStep()` replace the prior ordering inference.
- Current alternatives are explicitly ranked, and the tests check both a forward and reverse transition.
- The rank is a **project heuristic**, not an objective universal historical scale. In particular, laissez-faire vs interventionism, free trade vs protectionism, and mass conscription vs professional army are context-dependent and can reverse in historical interpretation. Keep the table explicitly documented and do not use it as a universal history label or as a direct law eligibility rule.

### R3 — domestic feasibility integration: CLOSED AT UTILITY-LEVEL
- `reformUtility()` combines domestic `reformSupport()`, personality/inertia, historical bias and bounded emulation.
- The Qing 1836 test makes foreign public-school adoption raise utility, but verifies domestic support remains below -0.5 and total utility remains below the 0.15 reform threshold.
- Scope caveat: this test proves the score cannot cross the AI threshold in that fixture; it does not exercise a full monthly `reformAI → startReform` integration path, nor separately cover legitimacy, bureaucracy/fiscal capacity and historical reservation. Keep those as future integration coverage if those gates are added to the engine.

### R4 — Sandbox log through 2022: CLOSED
- `LONGRUN_SANDBOX_1836_2022_CATCHUP01R2_2026-11-22.txt` contains an explicit 2022 final row: worldPopM 8423, alive 171, 130 technologies for GBR/FRA/PRU/USA and 86.7 ms/month.
- The filename and final-year sample now agree. The 8.423bn population is an engine output, not evidence of demographic calibration.

### R5 — macro calibration: OPEN / BLOCKER
- The R2 scorecard summary reports end-year 2022 mean absolute log error **1.328 overall**, **0.712 industrialisers**, **1.944 other economies**.
- This improves on the earlier R1 scorecard but remains a large deviation. RUS/TUR territorial mismatch exclusions and PRU/QNG/EIC approximate coverage remain material caveats.
- No evidence yet isolates the causal contribution of CATCHUP-01. Require same-seed with/without-CATCHUP comparison and structural work on modern goods, education and decolonisation before tuning this subsystem.

### Additional implementation note — monthly cache semantics (P2)
- `knownShare` cache keys on state object identity and `st.tick`. This is coherent if all GDP/technology mutations occur only at month boundaries and the intended rule is a monthly snapshot.
- If future code mutates GDP or tech ownership within the same tick and expects immediate diffusion, this cache will return stale values until the next tick. Preserve the monthly-snapshot contract or add explicit invalidation at mutation points; add a test before changing that contract.

### Verification boundary
- Inspected current `technology.ts`, `ai.ts`, `tests/catchup.test.ts`, scorecard JSON and Sandbox output on branch `ccr-b27f3fb8-epfpd6`.
- The test file currently contains 11 CATCHUP-related test cases across the three suites (not eight, as the earlier review stated).
- Claude reports `npx vitest run` 32 files / 349 tests passing. ChatGPT did not execute those commands in this GitHub-only review environment; record as owner-reported, not independently reproduced.
- No code or coefficients changed in this review.
