# S0-B7 — Independent review request for Claude

**Task:** Review S0-B7 risk register and signoff package only.
**Current branch:** `experiment/vic3-visual-upgrade`
**Current branch HEAD at request preparation:** `47c18a1ceabd591f877d3fdb50d38c36814e15d4` (recheck HEAD before review).
**Frozen product baseline:** `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`.
**Authorization:** Read-only review. Do not modify product code, tests, data, assets, dependencies, workflows, Gradle, APK signing, or secrets. Do not merge branches or open S1.

## Review inputs

- `docs/audit/s0/S0_B4_RUN_3_REVIEW.md` — bounded B4 review and G0.6 verdict.
- `docs/audit/s0/S0_B4_TEST_PLAN.md` — current B4 test design and execution boundary.
- `docs/audit/s0/S0_B3_RESULTS.md` — B3 gate assessment and risk findings.
- `docs/audit/s0/S0_TEST_CATALOG.md` — TC-F1…TC-F7.
- `docs/audit/s0/S0_GLOBAL_DATA_AUDIT.md` — GD-F1…GD-F6 and RM-F1.
- `docs/audit/s0/S0_ASSET_AUDIT.md` — AS-F1…AS-F7.
- `docs/audit/s0/S0_PERFORMANCE_BASELINE.md` — RM-F1…RM-F5 and G0.7 limitations.
- `docs/audit/s0/S0_BUILD_TEST_REPORT.md` and `docs/audit/s0/logs/a2/10_npm_audit.log` — build, CI and the 2026-11-16 npm audit evidence.
- `docs/audit/s0/S0_RISK_REGISTER.md` — consolidated risk register.
- `docs/audit/s0/S0_B7_RISK_TRACEABILITY.md` — source-ID-to-risk-row mapping and severity cross-check; independently verify each mapping rather than relying on its assertions.
- `docs/audit/s0/S0_B7_REVIEW_PACKAGE_MANIFEST.md` — exact branch snapshot, file blob SHAs, workflow identity/parity, and execution/gate boundaries. Recheck live refs before review.
- `docs/audit/s0/S0_SIGNOFF.md` — gate ledger and bounded exception draft.
- `docs/audit/s0/S0_B7_RESULTS.md` — B7 status.
- `docs/audit/s0/S0_B7_SELF_REVIEW.md` — ChatGPT's preliminary self-review and unresolved items; Claude must independently verify it, not assume its conclusions.
- `docs/audit/s0/S0_DEPENDENCY_AUDIT_PLAN.md` and `.github/workflows/s0-b7-dependency-audit.yml` — manual read-only dependency-audit preparation; the workflow has not yet been run.
- `docs/roadmap/DECISIONS_AND_S0_REVISED_VI.v3.2.md`, `docs/roadmap/S0_V3_3_GATE_RESTRUCTURE_PROPOSAL.md`, `docs/roadmap/S0_V3_3_OWNER_DECISION_AND_AMENDMENTS.md`, and `docs/coordination/AI_HANDOFF.md` — normative scope and owner decisions.

## Required review questions

1. **Risk completeness:** verify all applicable R1–R14 (R3 closed), G0.7 device-evidence limitation, RM-F1…RM-F5, TC-F1…TC-F7, GD-F1…GD-F6, AS-F1…AS-F7, WD-F1…WD-F3 (verify each as a separate finding; WD-F3 is P2 and concerns five of eight starting wars capitulating at tick 5 across four probes), CI-F1…CI-F3 and DEP-F1 appear with correct severity, evidence, impact, control, owner role, target phase and closure criteria. Identify missing findings or duplicated/misclassified risks.
2. **Severity fidelity:** confirm R7 remains P0; frame-metric masking R5 and map performance budget R10 remain P1; TC-F1/TC-F2 and TC-F5 remain P1; TC-F3 and TC-F4/F6/F7 retain their catalog severities; G0.7 stays BLOCKED; G0.8 stays PARTIAL; full-S0 G0.9 stays BLOCKED while C3/B2 is blocked under v3.2 §6.4 and OD-20261116-11 §2.1.1. Track the separate bounded S1-entry package as NOT_TESTED pending reviewer and owner decisions.
3. **Risk Register table integrity:** verify each Markdown table row has the same number of cells as its header. Specifically confirm every P2 entry uses the six-column schema (ID, evidence, impact, disposition/control, owner, target/closure criteria), and each traceability row points to its exact individual risk entry. Flag any grouped row that obscures separate findings.
4. **B4 evidence:** independently check run `44325257261`, job `134874698600`, checkout commit `7f17b1f0177d712366e31e4e8c879cc4b6dd5741`, test file SHA `722d62c0647f06bc2e3a49bdef1f348f4f3104f2`, and compare to baseline `2240a8f`. Confirm the exact limitations: no artifact upload, no typecheck, and later expanded tests not run. Do not claim tests absent from that run passed.
5. **Dependency audit workflow:** inspect exact YAML. Confirm workflow_dispatch-only behavior, frozen baseline checkout, `npm audit --package-lock-only` full and `--omit=dev` scan, exit-code handling, artifact upload under `if: always()`, full-SHA action pins, and no installation, fix, build, product script, or secret access. Check the artifact-name expression and workflow branch guard.
6. **Signoff correctness:** confirm S0 overall remains PARTIAL and S1 remains NOT AUTHORIZED. Confirm E-G0.7 and E-G0.8 are narrow requests only and do not waive G0.6 or R7. Confirm the document does not purport to accept exceptions on behalf of the project owner.
7. **Repository hygiene:** verify the new audit workflow exists identically on the default and experiment branches, all new files are on the experiment branch, and the recent commits are audit/documentation-only (except the separately authorized B4 test harness/workflow).

## Expected output

Use `docs/audit/s0/CLAUDE_S0_B7_REVIEW_REPORT_TEMPLATE.md` for the report structure. Fill in the live HEAD and all verified file/workflow SHAs. The template is not a result and must not be pre-filled with assumed PASS values.

Create a review report containing:

- Verdict: `REVIEW_PASS` or `CHANGES_REQUESTED` for the B7 documentation package only.
- A finding table with severity, exact file/section, why it is wrong or incomplete, and a documentation-only correction proposal.
- A gate ledger that states what may and may not change.
- A statement confirming no product changes were made during the review.

Do not edit or commit the reviewed files. If corrections are necessary, return a precise change request for ChatGPT to implement and re-review. Do not change any source file or workflow yourself. Do not mark G0.9 PASS merely because the review request exists. The owner must still make the recorded acceptance decisions in writing.

## Critical safety boundaries

- R7 is still an OPEN P0. The interim containment in OD-20261116-11 §5.1 is not a fix.
- R14 is still BLOCKED. Do not uninstall the baseline APK or install a differently signed APK on the iQOO.
- No signing Environment, keystore, secret or private key is authorized.
- No gameplay, simulation, RNG, save serializer/schema, historical data, assets, performance, rendering, lifecycle, or S1 changes are authorized.
- Do not run `npm audit fix`, upgrade dependencies, or change `package-lock.json`.
- Do not describe all S0 gates as PASS or open S1.

## 8. Supplementary Android CI evidence added 2026-11-19

Review the two latest experiment-branch Android workflow runs before issuing the bounded B7 verdict:

- Run #316: `44562638037`, commit `26963daef7c72f2dbeb86239f023b9a902778ae6`.
- Run #317: `44562662560`, commit `fa95ad894c6fd32c673a569a561a17b7132cef36`.
- Both failed at the same test: `tests/s0-save-determinism.test.ts` → “records the baseline legacy default for absent marketStats without inventing post-baseline fields”; 5/6 test files and 108/109 tests passed. `npm ci`, `npm run build`, and generated-data hashing passed; Gradle/APK steps were skipped.
- The assertion expects `constructionQueue` to be absent from every country. The current experiment branch declares/initializes that field in `src/engine/types.ts` and `src/engine/init.ts`; frozen baseline `2240a8f` predates it. The Android workflow runs all tests against the experiment branch, while the B4 evidence is a frozen-baseline characterization. Independently verify this scope mismatch and state whether it is a harness/workflow integration issue. Do not relabel the approved B4 Run #3 result, and do not modify product code or workflows during this read-only review.
- Neither run produced an APK. The current web/data build did not publish a data-pack artifact.

Treat these as supplementary current-branch CI evidence, distinct from approved B4 Run #3 and from older supplemental Run #65. Include the residual APK-build blocker in the report and do not claim an APK exists for HEAD `fa95ad8`.


## 9. CI-F4 — required independent review finding

Independently verify the P1 `CI-F4` addition to the Risk Register and traceability matrix:

- Android APK run #316 (`44562638037`) on `26963da` and run #317 (`44562662560`) on `fa95ad8` both failed one of 109 tests (108 passed, 1 failed) at the baseline-only assertion requiring every restored country to lack `constructionQueue`.
- Experiment branch `src/engine/types.ts` declares `constructionQueue` and `src/engine/init.ts` initializes it; frozen baseline `2240a8f` predates the field. Verify exact source at both refs rather than accepting this summary.
- Both runs passed `npm ci`, `npm run build` and generated-data hashing, but the test failure skipped Android SDK setup, Capacitor sync, Gradle `assembleDebug`, APK checksums and APK upload. No APK was produced.
- Confirm the risk is accurately classified as a current CI/test-scope integration blocker, not a gameplay defect and not a contradiction of the bounded B4 Run #3 baseline verdict.
- Recommend any remediation only as a separately authorized CI/test task. Do not edit tests or workflows during this read-only review.

The manual dependency-audit workflow has still not been dispatched; no DEP-F1 package-level verdict is possible without the two audit JSON reports.
