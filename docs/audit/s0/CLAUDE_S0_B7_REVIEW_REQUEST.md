# S0-B7 — Independent review request for Claude

**Task:** Review S0-B7 risk register and signoff package only.
**Current branch:** `experiment/vic3-visual-upgrade`
**Review target:** re-fetch the live branch HEAD immediately before review. The previous pinned value in the original request is stale and must not be used; `S0_B7_REVIEW_PACKAGE_MANIFEST.md` is the blob-identity index, not a substitute for live ref verification.
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
- `docs/audit/s0/S0_DEPENDENCY_AUDIT_PLAN.md` and `.github/workflows/s0-b7-dependency-audit.yml` — completed read-only audit evidence: run `44572915201`, artifact `14555141888`; full-tree and production-only raw JSON inspected. DEP-F1 remains OPEN P1 pending remediation/owner disposition.
- `docs/roadmap/DECISIONS_AND_S0_REVISED_VI.v3.2.md`, `docs/roadmap/S0_V3_3_GATE_RESTRUCTURE_PROPOSAL.md`, `docs/roadmap/S0_V3_3_OWNER_DECISION_AND_AMENDMENTS.md`, and `docs/coordination/AI_HANDOFF.md` — normative scope and owner decisions.

## Required review questions

1. **Risk completeness:** verify all applicable R1–R14 (R3 closed), G0.7 device-evidence limitation, RM-F1…RM-F5, TC-F1…TC-F7, GD-F1…GD-F6, AS-F1…AS-F7, WD-F1…WD-F3 (verify each as a separate finding; WD-F3 is P2 and concerns five of eight starting wars capitulating at tick 5 across four probes), CI-F1…CI-F3 and DEP-F1 appear with correct severity, evidence, impact, control, owner role, target phase and closure criteria. Identify missing findings or duplicated/misclassified risks.
2. **Severity fidelity:** confirm R7 remains P0; frame-metric masking R5 and map performance budget R10 remain P1; TC-F1/TC-F2 and TC-F5 remain P1; TC-F3 and TC-F4/F6/F7 retain their catalog severities; G0.7 stays BLOCKED; G0.8 stays PARTIAL; full-S0 G0.9 stays BLOCKED while C3/B2 is blocked under v3.2 §6.4 and OD-20261116-11 §2.1.1. Track the separate bounded S1-entry package as NOT_TESTED pending reviewer and owner decisions.
3. **Risk Register table integrity:** verify each Markdown table row has the same number of cells as its header. Specifically confirm every P2 entry uses the six-column schema (ID, evidence, impact, disposition/control, owner, target/closure criteria), and each traceability row points to its exact individual risk entry. Flag any grouped row that obscures separate findings.
4. **B4 evidence:** independently check run `44325257261`, job `134874698600`, checkout commit `7f17b1f0177d712366e31e4e8c879cc4b6dd5741`, test file SHA `722d62c0647f06bc2e3a49bdef1f348f4f3104f2`, and compare to baseline `2240a8f`. Confirm the exact limitations: no artifact upload, no typecheck, and later expanded tests not run. Do not claim tests absent from that run passed.
5. **Dependency audit workflow and result:** inspect exact YAML and independently verify run `44572915201` / artifact `14555141888`. Confirm workflow_dispatch-only behavior, frozen baseline checkout, `npm audit --package-lock-only` full and `--omit=dev` scans, exit-code handling, artifact upload under `if: always()`, full-SHA action pins, and no installation, fix, build, product script, or secret access. Inspect all eight archive entries, both raw JSONs, summary, provenance, stderr and exit-code files; confirm full-tree six findings (3 moderate / 1 high / 2 critical), production-only zero, nested Vite esbuild `0.21.5`, and that B4 Run #3's separate npm ci count of 10 remains unreconciled.
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


## 9. CI-F4 — historical finding; current disposition superseded by §12

The following records the original failure context from runs #316/#317. Independently verify that the Risk Register now closes CI-F4 narrowly using run #318 evidence in §12; do not leave the finding classified as an active APK-workflow blocker.

Independently verify the historical P1 `CI-F4` addition to the Risk Register and traceability matrix:

- Android APK run #316 (`44562638037`) on `26963da` and run #317 (`44562662560`) on `fa95ad8` both failed one of 109 tests (108 passed, 1 failed) at the baseline-only assertion requiring every restored country to lack `constructionQueue`.
- Experiment branch `src/engine/types.ts` declares `constructionQueue` and `src/engine/init.ts` initializes it; frozen baseline `2240a8f` predates the field. Verify exact source at both refs rather than accepting this summary.
- Both runs passed `npm ci`, `npm run build` and generated-data hashing, but the test failure skipped Android SDK setup, Capacitor sync, Gradle `assembleDebug`, APK checksums and APK upload. No APK was produced.
- Confirm the risk is accurately classified as a test-scope integration mismatch that existed at runs #316/#317, not a gameplay defect and not a contradiction of the bounded B4 Run #3 baseline verdict. Confirm its current narrow closure is supported by run #318 and that the dedicated pinned-baseline B4 workflow remains configured.
- Recommend any remediation only as a separately authorized CI/test task. Do not edit tests or workflows during this read-only review.

The dependency-audit workflow has now been dispatched and both JSON reports are available. Review exact run `44572915201`, artifact `14555141888`, full-tree totals (6: 3 moderate, 1 high, 2 critical), production-only total (0), all six dev-only package entries, nested esbuild `0.21.5`, and the still-unreconciled B4 Run #3 npm ci count of 10. Do not recommend a dependency fix inside S0; any remediation requires separate owner authorization.


## 10. Additional CI artifact and advisory preflight review

Please independently inspect the two diagnostic ZIP artifacts and the new preliminary dependency cross-check recorded in `S0_B7_RESULTS.md`.

- Run #316 artifact ID `14550237447`, SHA-256 `06fcd22633d442f6890a6d647483697e5051f21de0051b4d2ad0b38b531e6c03`, size 49,741 bytes.
- Run #317 artifact ID `14551001678`, SHA-256 `bb2427724f91b8ffa4e1a25cad83b405ae19ad5bdbfa452c3076e19ee9e55bfd`, size 49,697 bytes.
- Confirm each archive contains logs/manifests but no APK or standalone data pack, and distinguish its artifact ID/digest from the APK's nonexistent checksum.
- Verify the exact line-270 assertion and the passing current-branch legacy migration test.
- Review the lockfile SHA and version/advisory matches for `vitest@2.1.9`, `@vitest/mocker@2.1.9`, `tinypool@1.1.1`, and `esbuild@0.28.2`. Treat them as preflight matches, not the canonical `npm audit` outcome. In particular, verify the context/attack preconditions before assigning exploitability, and do not infer that production is clear until the `--omit=dev` report has been reviewed.
- Do not edit product code, tests, workflow or lockfile during this read-only review.



## 11. Completed dependency-audit artifact — additional independent-review requirement

Please independently download/inspect run `44572915201` artifact `14555141888` and verify:
- Artifact API SHA-256 `b9124fa9c6f0272abaf970557ce248ef32c4d85397d21dbe64ebb19221a65a28`, size 4,753 bytes, eight entries.
- Full-tree JSON: six vulnerable package entries (3 moderate, 1 high, 2 critical), exit 1 expected; production-only JSON: zero findings, exit 0; stderr empty; summary agrees with raw JSON.
- Provenance: frozen baseline `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`, workflow commit `9b150cff57e79bdb5356e431cc140b3b1b9eda2d`, Node 22.23.4, npm 10.9.9, package manifest hashes.
- All six affected entries are dev dependencies in the baseline lockfile. Specifically inspect the nested `node_modules/vite/node_modules/esbuild@0.21.5`; do not incorrectly infer that all esbuild copies are unaffected from root `esbuild@0.28.2`.
- The 2026-11-16 A2 count/severity summary matches 6 / (3 moderate, 1 high, 2 critical), while the B4 Run #3 `npm ci` count of 10 remains unresolved due missing package-level JSON.
- Confirm that the correct disposition is OPEN P1 — AUDIT COMPLETE; REMEDIATION / OWNER DISPOSITION PENDING. No dependency changes, S1 approval or owner signoff are implied.


## 12. Android APK workflow run #318 — CI-F4 closure review

Please independently verify run `44573351798` on commit `b5948f0bbca126712c64dd605ebb7d9f6ddfb907` and the commit diff:
- Only `.github/workflows/android-apk.yml` changed in that commit; `tests/s0-save-determinism.test.ts` is excluded from the experiment APK suite because it characterizes the frozen baseline and remains on the separate pinned-baseline B4 path.
- Job `135734112766` SUCCESS; 38/38 suites and 97/97 tests passed; Gradle debug APK assembly completed.
- Test artifact `14554953353` (106,657 bytes; SHA-256 `96aa79f605d52f7a2eb60748f307802827f6fec9994e280fd655e3565c879829`) and APK artifact `14553589834` (17,569,405-byte ZIP; SHA-256 `72ce3a5759bd1379aaf35bf10a395f3cc136230b44eabc64976375405b85678b`) were downloaded and inspected. APK is 18,057,530 bytes, SHA-256 `338fc54ce2e68f15ddc7043c664bdffa9cd79ade3c41aa0ed7a7cf0bfa7fe6b5`; debug certificate SHA-256 `8610076ddcefefc85d188530b0eb4645a21f92f38008692c29f6282a13418e19`.
- Confirm whether CI-F4's specific closure criterion is met. Keep the closure narrow: no claim about gameplay, device QA, release signing, data packs or overall S0.
- Independently inspect `.github/workflows/s0-b4-tests.yml` blob `3a4430f7a5ad32e24a95cdef271fc6e07529929e`: it is configured to checkout exact baseline `2240a8f` and overlay only the test/fixture. It was not re-run in this slice. Keep that distinction separate from approved B4 Run #3 (44325257261), whose earlier workflow/job evidence is already in the handoff.
- Review whether the baseline-only characterization remains executed on its pinned baseline path; do not assume that excluding it from the APK suite means it was removed.

The two downloaded artifact ZIP digests were recomputed and match GitHub API metadata. These are ChatGPT inspection results; Claude must independently verify before issuing the bounded B7 verdict.


## 13. Supplementary Android runs #319–#321 after the run #318 closure

Before issuing the bounded B7 verdict, inspect the following follow-up CI evidence. All three runs completed their `apk` job successfully and each log reports 38/38 suites, 97/97 tests and Gradle `BUILD SUCCESSFUL`:

| Run | Commit | Changed path | Job | APK artifact |
|---|---|---|---|---|
| #319 / `44576526677` | `8291d7ddf1c3848e1cfd15fd86b53934d0f5e836` | `docs/feedback/PLAYER_TEST_FEEDBACK_2026-11-20.md` added | `135745380871` | `14558110016` (API ZIP digest `23efb91ded5fa9ce10fcbcedbbaa7210501c2b30a61dd833f59a4fdd7e2b8d89`) |
| #320 / `44576552982` | `b42064b7b3051eea9fa001257d6d4e6327516e47` | `docs/coordination/AI_HANDOFF.md` only | `135745469796` | `14558090064` (API ZIP digest `c7ad006236af9fc6d1c15d24d331e8b0dce0bd1c199d8686974fe80d5869cde1`) |
| #321 / `44576581387` | `c5ba0e80b017dfeb04d29c17a66205fab23ce0d9` | `docs/coordination/NEXT_SESSION_HANDOFF_2026-11-19.md` only | `135745566773` | `14557237059` (API ZIP digest `84f3b3a835feefcb852e5d8fb476d949f4b74da87baa6f68b7e700186c706b5a`) |

Run #319 and #320 artifact ZIPs are metadata-only in this inspection; do not claim their payload contents were inspected. Run #321 APK and evidence ZIPs were downloaded and inspected. It reports `report_valid=true`, 38 suites / 97 tests passed, zero failures, Gradle success, APK size 18,057,524 bytes and APK SHA-256 `b12e6860979fcd66e060de0da76e0c9e55c64b265837b108af6a34122237e529`. Its signer is Android Debug, certificate SHA-256 `fb48505473b61038b17c4553d009a4a37e63047e7dee8759a14af74bbaa6197f` (v1/v2 verification true).

All three triggering commits changed documentation only. GitHub compare from #321 commit `c5ba0e80b017dfeb04d29c17a66205fab23ce0d9` to live HEAD `4db9d3d7b397fc59f3310936eecd6792a4ca218f` reports 52 commits / 12 changed paths, all documentation; no product/runtime source changed. The latest run is therefore on an unchanged product source tree, but not on the exact current HEAD.

Keep the verdict narrow: CI/test/debug APK success is not gameplay acceptance, device QA, release signing, separate data-pack validation, a B7 independent verdict, overall S0 PASS or S1 permission.


## 14. Exact-HEAD Android APK run #322 — additional evidence for independent review

Please independently verify run `44661820747` on commit `68fee31641d2249be824a87f4302c26a5aeb6611`, branch `experiment/vic3-visual-upgrade`, job `136041609778`. Confirm 38/38 suites, 97/97 tests, zero failures, `report_valid=true`, Gradle `BUILD SUCCESSFUL`, and inspect evidence artifact `14596545236` (ZIP SHA-256 `50c75905c66950a8868afc58f9eb81f3ecc09096fc3e2a0254b13f7233747492`). APK artifact `14596440616` ZIP SHA-256 is `1f3d14e2c2f4aa43b5d1fe12fb1ed34b6058d37c5c91c8b262de2b20a57d7ff5`; embedded APK size 18,057,541 bytes and SHA-256 `eda437afeadad10074d38acf567601c0c43ab3a6e9661ce8145962896fdf3cbb`; Android Debug certificate SHA-256 `559d549a21515f899b6195c65114b2be778ff2fbd63288d21ef31f4365b96238`. This adds CI evidence only and must not be interpreted as device QA or a gate/phase approval.


## 15. B4 Run #3 npm ci warning — additional raw-log evidence (2026-11-20)

The B4 Run #3 warning has been rechecked from the original job log. Run `44325257261`, job `134874698600`, records `npm ci` audited 221 packages and printed `10 vulnerabilities (3 moderate, 5 high, 2 critical)`. No package/advisory JSON was uploaded. The package-lock blob SHA at the B4 checkout, frozen baseline and current experiment branch is identical (`29ac661a36bb03bae62a80ce7abf9af0c15bb168`). The later audit run `44572915201` used explicit `npm audit --package-lock-only --json` and reported six vulnerable package entries; these different command contexts are not directly comparable. Please verify the log, workflow step set, lockfile identity and the unresolved boundary before recommending a disposition. DEP-F1 remains OPEN P1; do not recommend or implement a dependency fix within S0-B7.

## 16. DEP-F1 follow-up and traceability structure — 2026-11-20

A subsequent ChatGPT implementer self-audit refreshed the DEP-F1 traceability row with the exact B4 `npm ci` log observation (221 packages audited; 10 findings), the matching package-lock SHA across baseline/B4/experiment, and the distinct B7 `npm audit --package-lock-only --json` report (six vulnerable package entries). The numeric/severity difference remains explicitly UNRECONCILED because the B4 run has no package-level JSON. Please independently check the updated traceability row against `S0_RISK_REGISTER.md`, `S0_DEPENDENCY_AUDIT_PLAN.md`, `S0_B7_RESULTS.md` and the two GitHub Actions runs.

The implementer also ran a structural cross-check at the pre-change HEAD: all 22 P2 rows had six cells, and all 48 traceability rows (including the G0.7 device-evidence gate row) had non-duplicated source IDs with register targets. This is not independent evidence; re-run the checks yourself against the live HEAD before assigning a verdict. Do not treat structural integrity or a self-review as REVIEW_PASS.
## 17. Historical B3 phase status consistency — 2026-11-20

The implementer reconciled one stale handoff status while preparing this B7 package: the Phase Register had shown B3 as `READY_FOR_REVIEW`, while the current summary/B4 dependency already showed `REVIEW_PASS`. The historical handoff records ChatGPT's independent B3 re-review of Claude's corrected tool/report commits `ddea490635c5d7c74ca6108549fd21806102487b` / `2c62b3de3955e3cd8a82a9c59401d9df77d69173` and a bounded `REVIEW_PASS` on 2026-11-16. Please verify that record and the aligned current Phase Register; the historical round-1 `CHANGES_REQUESTED` and pre-review `READY_FOR_REVIEW` logs remain intact. This is not a B7 verdict or S0 owner acceptance.
## 18. Source severity / row-schema self-audit context — 2026-11-20

The implementer reports a read-only cross-check of the traceability severities against original v3.2 and B3 source catalogs. No mismatch was found after normalizing Markdown emphasis; 48 mappings were unique and resolved, and all Risk Register rows had expected cell counts with no blank cells. This is not independent evidence. Re-perform the source-to-register checks against the live snapshot, with particular care to distinguish the P0 R7, R3 Closed, G0.7 BLOCKED gate, and B7-added CI/DEP findings.

## 10. Additional P0/P1 disposition checks requested

Independently verify the tightened target/exit criteria in the current Risk Register and traceability matrix for R2/AS-F1 (S5 rights verification), R10 (separate S4/S11/S20 numeric budgets), GD-F2 (S3/S6 and relevant economic/historical-character data coverage), and TC-F1/TC-F2 (S17/S19 versus S20/S21 non-vacuous tests). Confirm these clarifications do not silently change severity, owner acceptance, gate verdicts or phase authorization. Re-fetch live HEAD and blob SHAs; do not rely on this request as evidence of a reviewer verdict.


## 11. Exact-HEAD Android run #324 and R1 certificate evidence

Please re-fetch and independently verify run `44677523059` / job `136092798809` on checkout SHA `31f1617ed838110296fd68edfd90c7e3e3b8d0a7`, including artifacts `14603730370` and `14603825259`. Verify the local/API ZIP digest match, the APK SHA-256 and `apksigner` certificate report; confirm 38/38 suites, 97/97 tests and Gradle success. Compare against Run #322 (`44661820747`, checkout `68fee31641d2249be824a87f4302c26a5aeb6611`): certificate SHA-256 values are `559d549a21515f899b6195c65114b2be778ff2fbd63288d21ef31f4365b96238` and `84bb348722b660bb36805f3928f73d64401d313a8627168796b6068a2ee1d146`, respectively. The GitHub commit comparison reports documentation-only intervening changes. Confirm R1 therefore remains OPEN and does not authorize signing or device installation. Also verify AS-F1's S5 exit criteria and confirm no risk/gate/phase status was changed by this evidence refresh.


## 12. Risk Register table-boundary follow-up

Verify the latest `S0_RISK_REGISTER.md` renders CI-F4 as part of the six-column P1 table (not as a detached one-row table). Recount the table groups against the live blob: P0 1×6, P1 13×6 including G0.7 as a distinct gate row, P2 22×6, P3 5×3, Closed 1×3. Confirm CI-F4 remains narrowly CLOSED and the 48 traceability rows remain unique. This is a formatting/traceability check only; do not change statuses or gate verdicts.


## 13. R13 / GD-F2 roadmap alignment check

Independently compare the revised R13 closure criteria with v3.2 §4.1.2–4.1.5. Verify that every future security control is labelled NOT IMPLEMENTED until evidenced, and that B2/C3 remains BLOCKED pending R14 and owner setup. Check GD-F2 target allocation against v3.2 S3/S6/S7/S13/S16, and assess whether the field-specific provenance/coverage exit criteria are measurable without treating estimated or missing facts as verified. Do not create an Environment, secrets, workflow or data records.


## 19. Subsequent owner-requested 1836–2026 product-scope documents — context only

After the original B7 package was prepared, the owner requested a product-scope expansion from 1836–1936 to 1836–2026 and asked that it be combined with the existing simulation-pacing, economic, political/institutional, diplomatic and military-depth work.

The following documents were added on the experiment branch after the package's previous snapshot:

- `docs/roadmap/OWNER_SCOPE_AMENDMENT_1836_2026_SYSTEM_DEPTH.md` — owner-requested combined product scope and planning order.
- `docs/design/TECHNOLOGY_AND_INSTITUTIONS_1836_2026_DRAFT.md` — preliminary technology, institutions, military modernization and data-contract design.
- `docs/coordination/AI_HANDOFF.md` — current handoff and change record.

These are supplied as **context only**. They are not part of the bounded S0-B7 risk/signoff review scope, do not alter the frozen 1836–1936 S0/G0.4 audit source, do not claim implementation, and do not authorize S1 or any gameplay/engine/save/data/content changes. The reviewer should confirm that no gate, risk disposition, exception or phase authorization was silently changed, then issue a verdict only for the bounded S0-B7 package.

Re-fetch the exact live branch HEAD and these files before review. The review target is the complete current repository snapshot, but the verdict boundary remains S0-B7.


## 20. Owner delegation of execution discretion — 2026-11-20

The owner has now instructed ChatGPT to use full technical discretion to decide and carry out the project work without waiting on schedule/time constraints. This is an implementation-role delegation, not evidence that an independent reviewer has inspected B7. It does not change the bounded verdict requirements, waive S0 gate evidence or silently authorize S1. The owner-requested product scope remains 1836–2026 combined with the simulation-clock and systemic-depth workstreams. See the current handoff for the exact live phase status.


## 21. Live structure check and refreshed contemporary 2026 calibration — context only

- Added a later source-verified contemporary calibration subsection to `docs/design/TECHNOLOGY_AND_INSTITUTIONS_1836_2026_DRAFT.md`. It uses the latest complete observation year available in each official publication (including 2024 robot installations and 2025 military expenditure) and explicitly does not mislabel them as full-year 2026 observations.
- The new research references are the IEA Energy Technology Perspectives 2026, ITU Facts and Figures 2025, Stanford HAI AI Index 2026 and SIPRI 2025 military-expenditure fact sheet / Yearbook 2026.
- A fresh ChatGPT structural self-audit of the current Risk Register and Traceability Matrix found P0 1×6, P1 13×6, P2 22×6, P3 5×3 and Closed 1×3; 48 unique mappings; no blank cells or unresolved risk IDs. See `S0_B7_SELF_REVIEW.md` §16.
- All S0/S1 gate statuses remain unchanged. This source/design/context material is not a B7 reviewer verdict or implementation authorization.
