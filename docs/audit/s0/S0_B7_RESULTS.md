# S0-B7 — Risk register and signoff package

**Task:** S0-B7 under OD-20261116-11  
**Status:** **IN_PROGRESS — documentation and evidence package prepared for independent review**  
**Baseline:** 2240a8fb865e0021eec2f2f4f1c6803528be9e2c  
**Related reports:** S0_B4_RUN_3_REVIEW.md, S0_RISK_REGISTER.md, S0_SIGNOFF.md

## 1. Work completed in this B7 draft

- Consolidated known P0/P1/P2/P3 risks from v3.2, B3 findings, asset audit, performance report, build/CI audit, and B4 run #3. A final source-to-register check found and added WD-F3 (P2 historical-war calibration observation) that had been omitted. A later structural review normalized all P2 risk rows to the six-column schema and aligned the traceability matrix to the individual rows. Added the discrepancy between the 2026-11-16 explicit audit (6 findings) and Run #3 install summary (10 findings) as an unresolved P1 dependency-security risk.
- Separated product defects from evidence limitations, stage dependencies, and owner decisions.
- Recorded risk impact, current disposition, containment/mitigation, owner role, target stage, and closure criteria.
- Recorded R7 interim containment as accepted in principle under OD-20261116-11 while keeping R7 open P0.
- Recorded R14 as BLOCKED and retained the prohibition on uninstalling the baseline APK or installing a differently signed APK. Recorded R4 as an accepted design boundary (test-supplied trace, no mandatory production journal), and R3 as closed by the APK baseline hash evidence.
- Drafted the G0.1–G0.9 gate ledger and narrowly scoped G0.7/G0.8 S1 exception requests. Added `S0_DEPENDENCY_AUDIT_PLAN.md` and a manual, read-only, pinned-baseline workflow that reports full-tree and production-only advisory JSON. The audit has not been run; DEP-F1 remains untriaged. Added `CLAUDE_S0_B7_REVIEW_REQUEST.md` as a read-only review packet; no Claude review result is claimed. Added `CLAUDE_S0_B7_REVIEW_REPORT_TEMPLATE.md` with a bounded verdict field, live SHA verification, one-row-per-finding table, gate/risk disposition, owner prerequisites and read-only scope statement.
- Added `S0_B7_SELF_REVIEW.md` as a ChatGPT self-review checkpoint. It is not a substitute for Claude's independent review or owner acceptance. Added `S0_B7_RISK_TRACEABILITY.md` to map each original risk/finding ID and severity to the exact register row; Claude is asked to validate every mapping. Added `S0_B7_REVIEW_PACKAGE_MANIFEST.md` to pin the reviewed branch snapshot, file blob identities and evidence boundaries.
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
| G0.9 | BLOCKED for full S0 while C3/B2 is blocked, per v3.2 §6.4 and OD-20261116-11 §2.1.1; the separate bounded S1-entry package remains NOT_TESTED pending review and owner acceptance |

**Overall S0 remains PARTIAL/BLOCKED, not PASS.** G0.9's full-S0 status is BLOCKED while C3/B2 is blocked. A separate bounded S1-entry package may still be reviewed under OD-20261116-11 §2.1.1, but that review and owner acceptance have not occurred. No S1 implementation is authorized yet.

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



## 6. Latest branch CI recheck — 2026-11-19

- Live experiment branch HEAD before this documentation update: `fa95ad894c6fd32c673a569a561a17b7132cef36`. The two commits after the previous handoff are documentation-only: `26963da` adds the next-session handoff and `fa95ad8` links it from `AI_HANDOFF.md`.
- Android APK workflow runs **#316** (`44562638037`, commit `26963daef7c72f2dbeb86239f023b9a902778ae6`) and **#317** (`44562662560`, commit `fa95ad894c6fd32c673a569a561a17b7132cef36`) both completed with `failure`.
- In both runs, `npm ci`, `npm run build`, and generated-data/web-bundle hashing passed. Vitest failed at the same baseline-characterization assertion in `tests/s0-save-determinism.test.ts`: 6 files, 5 passed / 1 failed; 109 tests, 108 passed / 1 failed. The failing assertion requires every restored country to lack `constructionQueue`.
- Source comparison confirms the experiment branch currently declares and initializes `constructionQueue` in `src/engine/types.ts` and `src/engine/init.ts`; frozen baseline `2240a8f` predates that field. The Android workflow runs the full test suite against the experiment branch, whereas the approved B4 result is a frozen-baseline characterization. This is a test-scope/integration mismatch to be reviewed, not evidence that the approved baseline B4 Run #3 failed and not authorization to alter product code.
- Because Vitest failed, Android setup, Capacitor sync, Gradle `assembleDebug`, APK checksum and APK upload were skipped in both runs. **No APK was produced by #316 or #317.** The web/data build ran, but the workflow uploaded only CI evidence; it did not publish a downloadable data-pack artifact.
- The dedicated S0-B7 dependency-audit workflow remains un-dispatched; no audit artifact or package-level DEP-F1 conclusion exists. This session has no GitHub Actions workflow-dispatch action, so manual dispatch on `experiment/vic3-visual-upgrade` remains pending.
- No product source, tests, data, assets, dependencies, Gradle, signing or workflow files were changed during this recheck. G0.6 remains bounded to the approved baseline Run #3 evidence; overall S0 remains PARTIAL/BLOCKED; S1 remains NOT AUTHORIZED.


## 7. CI-F4 — current experiment-branch APK pipeline blocker (2026-11-19)

- Added P1 finding `CI-F4` to `S0_RISK_REGISTER.md` and `S0_B7_RISK_TRACEABILITY.md`.
- Exact evidence: Android APK run #316 (`44562638037`, commit `26963daef7c72f2dbeb86239f023b9a902778ae6`) and #317 (`44562662560`, commit `fa95ad894c6fd32c673a569a561a17b7132cef36`). Both report 108/109 tests passed; same single failing assertion says every country must lack `constructionQueue`.
- The test is a frozen-baseline characterization. Current experiment source defines the field in `src/engine/types.ts` and initializes it in `src/engine/init.ts`; the frozen baseline `2240a8f` predates it. The regular Android APK workflow ran that baseline-only assertion against the experiment branch.
- In both runs, npm install, web/data build and generated-data hashing passed. Vitest failed before Android SDK setup, Capacitor sync and Gradle, so no APK artifact or APK checksum was produced. The data/web build also was not uploaded as a separate downloadable data pack.
- Disposition: **OPEN P1 — test-scope/workflow integration mismatch**. No product, test, workflow, Gradle or data changes are authorized here. Do not weaken the baseline assertion or relabel the approved B4 Run #3 result. Any CI/test correction needs a separately authorized task.
- The GitHub connection available in this session supports reads and contents commits but exposes no workflow-dispatch operation. The manual S0-B7 dependency audit therefore remains pending; no audit result or artifact is claimed.
- B7 remains IN_PROGRESS; Claude independent review and owner decision remain pending. Overall S0 remains PARTIAL/BLOCKED; S1 is NOT AUTHORIZED.
