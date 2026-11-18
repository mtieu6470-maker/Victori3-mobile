# S0-B7 — Risk register and signoff package

**Task:** S0-B7 under OD-20261116-11  
**Status:** **IN_PROGRESS — documentation and evidence package prepared for independent review**  
**Baseline:** 2240a8fb865e0021eec2f2f4f1c6803528be9e2c  
**Related reports:** S0_B4_RUN_3_REVIEW.md, S0_RISK_REGISTER.md, S0_SIGNOFF.md

## 1. Work completed in this B7 draft

- Consolidated known P0/P1/P2/P3 risks from v3.2, B3 findings, asset audit, performance report, build/CI audit, and B4 run #3.
- Separated product defects from evidence limitations, stage dependencies, and owner decisions.
- Recorded risk impact, current disposition, containment/mitigation, owner role, target stage, and closure criteria.
- Recorded R7 interim containment as accepted in principle under OD-20261116-11 while keeping R7 open P0.
- Recorded R14 as BLOCKED and retained the prohibition on uninstalling the baseline APK or installing a differently signed APK. Recorded R4 as an accepted design boundary (test-supplied trace, no mandatory production journal), and R3 as closed by the APK baseline hash evidence.
- Drafted the G0.1–G0.9 gate ledger and narrowly scoped G0.7/G0.8 S1 exception requests.
- Did not modify any product source, tests, gameplay, engine, save schema, RNG, history data, assets, Gradle, APK workflow, signing or secrets.

## 2. Gate snapshot

| Gate | Current verdict |
|---|---|
| G0.1 | PASS |
| G0.2 | PASS |
| G0.3 | PASS |
| G0.4 | PASS |
| G0.5 | PASS |
| G0.6 | PASS — see independent B4 Run #3 review |
| G0.7 | BLOCKED — iQOO not measured; Node/desktop evidence has explicit limitations |
| G0.8 | PARTIAL — inventory/checksum complete, legacy licensing and attribution not fully verified |
| G0.9 | NOT_TESTED — B7 package is a draft pending independent review and owner signoff |

**Overall S0 remains PARTIAL, not PASS.** No S1 implementation is authorized yet.

## 3. P0 and residual risk focus

- R7 remains OPEN P0. OD-20261116-11 accepts interim containment; it does not fix lifecycle autosave or renderer recovery.
- R14 remains BLOCKED until export and re-import are demonstrated on the installed baseline APK. It continues to block B2/C3 and all APK installation transitions.
- R1/R13 remain controlled by deferring fixed development signing and not creating or using signing secrets.
- G0.7/G0.8 exceptions are requests for a bounded S1 data/save-contract scope only; no exception changes the underlying gate verdict.

## 4. B4 evidence used by B7

Run #3 passed 70/70 tests across six test files. Four required B4 replay cases matched between continuous and save/resume paths: Historical/Sandbox, K=6/K=12, N=24. Both final GameState hashes were equal in each case; the first differing path was null. Run #3 is recorded in S0_B4_RUN_3_REVIEW.md with its exact workflow, commit and executed test-file SHA.

The later expanded test source on the experiment branch and the manual artifact-enhanced workflow were not run by Run #3. They are not included in this B4 verdict.

## 5. Remaining work / stop conditions

- B7 remains in progress until the package receives independent review and the project owner explicitly accepts/rejects the concrete exception requests and signoff.
- G0.7 remains BLOCKED for iQOO; no desktop or Node result substitutes for device evidence.
- G0.8 remains PARTIAL; unknown legacy licensing is not treated as verified.
- R14 continues to block B2/C3, B5/B6 device activity and any APK install transition.
- DEP-F1 requires a read-only advisory-level audit; no lockfile upgrade is included in S0.
- S1 remains NOT AUTHORIZED. If the reviewer requests changes, update only audit documentation/risk dispositions unless a separate owner authorization explicitly expands scope.

