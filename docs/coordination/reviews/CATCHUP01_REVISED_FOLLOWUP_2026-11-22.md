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
