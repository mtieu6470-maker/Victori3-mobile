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
- Drafted the G0.1–G0.9 gate ledger and narrowly scoped G0.7/G0.8 S1 exception requests. Added `S0_DEPENDENCY_AUDIT_PLAN.md` and a manual, read-only, pinned-baseline workflow that reports full-tree and production-only advisory JSON. At the time of this initial B7 draft the audit had not yet run; this historical status is superseded by §10. Added `CLAUDE_S0_B7_REVIEW_REQUEST.md` as a read-only review packet; no Claude review result is claimed. Added `CLAUDE_S0_B7_REVIEW_REPORT_TEMPLATE.md` with a bounded verdict field, live SHA verification, one-row-per-finding table, gate/risk disposition, owner prerequisites and read-only scope statement.
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
- The dedicated S0-B7 dependency-audit workflow has now completed on the experiment branch (run `44572915201`, workflow commit `9b150cff`). Artifact `14555141888` was downloaded and all eight entries inspected. Full-tree audit: 6 vulnerable packages (3 moderate, 1 high, 2 critical), exit 1 as expected; production-only audit: 0, exit 0; both stderr files empty. See §10 and `S0_DEPENDENCY_AUDIT_PLAN.md` for package-level details. DEP-F1 is OPEN P1 — AUDIT COMPLETE; REMEDIATION / OWNER DISPOSITION PENDING.
- No product source, tests, data, assets, dependencies, Gradle, signing or workflow files were changed during this recheck. G0.6 remains bounded to the approved baseline Run #3 evidence; overall S0 remains PARTIAL/BLOCKED; S1 remains NOT AUTHORIZED.


## 7. CI-F4 — current experiment-branch APK pipeline blocker (2026-11-19)

- Added P1 finding `CI-F4` to `S0_RISK_REGISTER.md` and `S0_B7_RISK_TRACEABILITY.md`.
- Exact evidence: Android APK run #316 (`44562638037`, commit `26963daef7c72f2dbeb86239f023b9a902778ae6`) and #317 (`44562662560`, commit `fa95ad894c6fd32c673a569a561a17b7132cef36`). Both report 108/109 tests passed; same single failing assertion says every country must lack `constructionQueue`.
- The test is a frozen-baseline characterization. Current experiment source defines the field in `src/engine/types.ts` and initializes it in `src/engine/init.ts`; the frozen baseline `2240a8f` predates it. The regular Android APK workflow ran that baseline-only assertion against the experiment branch.
- In both runs, npm install, web/data build and generated-data hashing passed. Vitest failed before Android SDK setup, Capacitor sync and Gradle, so no APK artifact or APK checksum was produced. The data/web build also was not uploaded as a separate downloadable data pack.
- Disposition: **OPEN P1 — test-scope/workflow integration mismatch**. No product, test, workflow, Gradle or data changes are authorized here. Do not weaken the baseline assertion or relabel the approved B4 Run #3 result. Any CI/test correction needs a separately authorized task.
- Historical status as of 2026-11-19 before manual dispatch: workflow dispatch/artifact review pending. Superseded by the completed run and artifact inspection in §10.
- B7 remains IN_PROGRESS; Claude independent review and owner decision remain pending. Overall S0 remains PARTIAL/BLOCKED; S1 is NOT AUTHORIZED.


## 8. Downloaded CI evidence artifacts — inspection (2026-11-19)

The GitHub Actions API exposes a diagnostic evidence artifact for each failed Android APK run. Both ZIPs were downloaded and their file listings/content inspected.

| Run | Commit | Artifact ID | ZIP size | GitHub API SHA-256 |
|---|---|---:|---:|---|
| #316 / 44562638037 | `26963daef7c72f2dbeb86239f023b9a902778ae6` | `14550237447` | 49,741 bytes | `06fcd22633d442f6890a6d647483697e5051f21de0051b4d2ad0b38b531e6c03` |
| #317 / 44562662560 | `fa95ad894c6fd32c673a569a561a17b7132cef36` | `14551001678` | 49,697 bytes | `bb2427724f91b8ffa4e1a25cad83b405ae19ad5bdbfa452c3076e19ee9e55bfd` |

Each ZIP contains provenance, generated-file SHA-256 list, a distribution manifest CSV, toolchain versions, Vitest log, tree/task reports, test summary and exit code. Neither contains an `.apk` file or an independently downloadable data-pack payload. The distribution manifest and hashes are evidence only; they are not a packaged data release. Thus the correct result is **diagnostic artifacts exist; APK and data-pack artifacts do not**.

The archive-internal `artifact_zip.txt` contains `artifact_id=unavailable` and `artifact_zip_sha256=unavailable`; GitHub's Actions Artifacts API separately supplied the IDs/digests above. Use the API metadata as the artifact identity evidence.

Run #317's Vitest log provides the exact failure: `tests/s0-save-determinism.test.ts:270`, where the baseline-only test expects every restored country not to contain `constructionQueue`. The current experiment branch also has a passing simulation test named “migrates saves written before constructionQueue existed”. This reinforces that the failing assertion characterizes the frozen baseline, while the normal Android workflow is executing it against a later experiment source tree. Keep CI-F4 OPEN P1; do not weaken the characterization or modify the APK workflow under the present S0 authorization.

## 9. Preliminary dependency advisory cross-check — NOT the npm audit verdict

The frozen baseline and current experiment branch have the same `package-lock.json` blob SHA: `29ac661a36bb03bae62a80ce7abf9af0c15bb168`. A direct read-only parse of that exact lockfile found these resolved packages (all entries below are marked `dev: true`):

| Package | Locked version | Provisional advisory match | Advisory affected/fix information |
|---|---:|---|---|
| `vitest` | `2.1.9` | GHSA-82fw-gwwq-j7x9 | Affected from 2.1.0 to before 4.1.11; fixed in 4.1.11. |
| `@vitest/mocker` | `2.1.9` | GHSA-82fw-gwwq-j7x9; GHSA-qxg6-89mg-rqv8 | First fixed in 4.1.11; second fixed in 4.1.12 (5.x fix 5.0.3). |
| `tinypool` | `1.1.1` | GHSA-5gmw-xhrv-c9v3; GHSA-85c8-ppgw-ccpr | Both affect versions through 2.1.0; fixes are 2.1.1 and 2.1.2 respectively. |
| `esbuild` | `0.28.2` | GHSA-67mh-4wv8-2f99 | The advisory affects versions through 0.24.2 and is fixed in 0.25.0; locked 0.28.2 is outside that specific affected range. |

The matching packages listed above are development dependencies in this lockfile. This was a preliminary version/advisory cross-check, not a complete package-level npm audit; it was superseded by the raw full-tree and `--omit=dev` reports reviewed in §10. No upgrade or lockfile change was made. The final DEP-F1 status is **OPEN P1 — AUDIT COMPLETE; REMEDIATION / OWNER DISPOSITION PENDING**.

External advisory references: `https://github.com/advisories/GHSA-82fw-gwwq-j7x9`; `https://osv.dev/vulnerability/GHSA-qxg6-89mg-rqv8`; `https://github.com/advisories/GHSA-5gmw-xhrv-c9v3`; `https://github.com/tinylibs/tinypool/security/advisories/GHSA-85c8-ppgw-ccpr`; `https://github.com/advisories/GHSA-67mh-4wv8-2f99`.



## 10. Completed dependency audit — raw artifact reviewed (2026-11-20)

- Workflow run [44572915201](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44572915201), job `135732603544`, completed SUCCESS on `experiment/vic3-visual-upgrade` at workflow commit `9b150cff57e79bdb5356e431cc140b3b1b9eda2d`.
- Artifact `s0-b7-dependency-audit-9b150cff57e79bdb5356e431cc140b3b1b9eda2d`, ID `14555141888`, 4,753 bytes; GitHub API SHA-256 `b9124fa9c6f0272abaf970557ce248ef32c4d85397d21dbe64ebb19221a65a28`. Downloaded and inspected all eight files: raw full/production JSON, summary, provenance, stderr and exit-code files.
- Full tree: 6 vulnerable package entries — 3 moderate, 1 high, 2 critical; exit code 1 is expected for findings. Production-only `--omit=dev`: 0 vulnerabilities; exit code 0. Both stderr files empty. Raw JSON and summary agree.
- All six vulnerable entries are development dependencies: `@vitest/mocker@2.1.9` (moderate), nested `vite/node_modules/esbuild@0.21.5` (moderate), `tinypool@1.1.1` (critical), `vite@5.4.21` (high), `vite-node@2.1.9` (moderate), and `vitest@2.1.9` (critical). Root `esbuild@0.28.2` is outside the affected range; the nested 0.21.5 copy is affected. Advisory IDs are recorded in the dependency plan.
- Provenance pins baseline `2240a8f`, workflow SHA `9b150cff`, Node `22.23.4`, npm `10.9.9`, npmjs registry, and SHA-256 for package manifests. No package install, fix, build, product script or lockfile write occurred.
- The 2026-11-16 audit's 6-vulnerability severity totals are matched. The separate B4 Run #3 `npm ci` warning of 10 remains unreconciled because no package-level report exists for that command/context.
- Disposition: DEP-F1 is now `OPEN P1 — AUDIT COMPLETE; REMEDIATION / OWNER DISPOSITION PENDING`, not UNTRIAGED. No dependency changes are authorized in S0. Production-only zero is scoped to the lockfile dependency graph and is not an APK/SBOM or build-tool safety certification.


## 11. Android APK workflow recheck — run #318 (2026-11-20)

- Workflow run [44573351798](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44573351798), branch `experiment/vic3-visual-upgrade`, commit `b5948f0bbca126712c64dd605ebb7d9f6ddfb907`; job `135734112766` SUCCESS.
- The commit diff changes only `.github/workflows/android-apk.yml`: it excludes `tests/s0-save-determinism.test.ts` from the experiment-branch APK suite and documents that the frozen-baseline B4 characterization runs separately against its pinned baseline. The characterization assertion was not deleted or weakened.
- Test evidence artifact ID `14554953353`, size 106,657 bytes, API SHA-256 `96aa79f605d52f7a2eb60748f307802827f6fec9994e280fd655e3565c879829`; downloaded and inspected. Vitest: 38/38 suites, 97/97 tests passed, 0 failed; report_valid=true.
- APK artifact ID `14553589834`, name `dong-chay-lich-su-debug-apk`, ZIP size 17,569,405 bytes, API SHA-256 `72ce3a5759bd1379aaf35bf10a395f3cc136230b44eabc64976375405b85678b`; downloaded and inspected. It contains `app-debug.apk` (18,057,530 bytes), SHA-256 `338fc54ce2e68f15ddc7043c664bdffa9cd79ade3c41aa0ed7a7cf0bfa7fe6b5`.
- Signing evidence: debug signer DN `C=US, O=Android, CN=Android Debug`; certificate SHA-256 `8610076ddcefefc85d188530b0eb4645a21f92f38008692c29f6282a13418e19`. This is a debug APK, not a release-signed artifact.
- All workflow steps completed, including npm ci, web/data build, test suite, Capacitor sync, Android SDK setup, Gradle debug assembly, APK checksum/signing evidence and artifact uploads.
- Artifact ZIP digests were independently recomputed from the downloaded ZIPs and match GitHub API metadata.
- **CI-F4 narrow closure:** the original test-scope integration failure is resolved for the APK workflow by separating the frozen-baseline characterization from the experiment-branch suite; the documented closure condition (full intended experiment-branch suite passes, Gradle assembles, APK checksum/signing evidence uploaded and verified) is met by run #318. The approved frozen-baseline B4 Run #3 remains separate and unchanged. The current `.github/workflows/s0-b4-tests.yml` is configured to checkout exact baseline `2240a8f` and overlay only the characterization test/fixture, but that specific workflow was not re-run in this slice; do not treat its configuration as a new execution result. This does not certify gameplay quality, device QA, release signing, data-pack delivery or overall S0.
- Current experiment branch is a descendant of `b5948f0`; the later changes in this documentation slice do not alter the APK workflow or product source.



## 14. Supplementary Android APK workflow reruns — 2026-11-20

Three successful Android workflow runs occurred after run #318 while the player-test feedback and handoff documents were being committed. The triggering commits changed documentation only; these builds are CI evidence, not independent gameplay acceptance.

| Run | Trigger commit / changed path | Job | Tests | Gradle | APK artifact (GitHub API metadata) |
|---|---|---|---|---|---|
| #319 / [44576526677](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44576526677) | `8291d7ddf1c3848e1cfd15fd86b53934d0f5e836` — adds player-test feedback document only | `135745380871` SUCCESS | 38/38 suites; 97/97 tests | BUILD SUCCESSFUL | `14558110016`; 17,569,411-byte ZIP; API SHA-256 `23efb91ded5fa9ce10fcbcedbbaa7210501c2b30a61dd833f59a4fdd7e2b8d89` |
| #320 / [44576552982](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44576552982) | `b42064b7b3051eea9fa001257d6d4e6327516e47` — AI_HANDOFF playtest note only | `135745469796` SUCCESS | 38/38 suites; 97/97 tests | BUILD SUCCESSFUL | `14558090064`; 17,569,388-byte ZIP; API SHA-256 `c7ad006236af9fc6d1c15d24d331e8b0dce0bd1c199d8686974fe80d5869cde1` |
| #321 / [44576581387](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44576581387) | `c5ba0e80b017dfeb04d29c17a66205fab23ce0d9` — next-session handoff playtest note only | `135745566773` SUCCESS | 38/38 suites; 97/97 tests; `report_valid=true` | BUILD SUCCESSFUL | `14557237059`; 17,569,396-byte ZIP; API SHA-256 `84f3b3a835feefcb852e5d8fb476d949f4b74da87baa6f68b7e700186c706b5a` |

Run #319/#320 artifact ZIPs are recorded from GitHub API metadata only; their payloads were not downloaded in this review. Run #321 was downloaded and inspected:
- APK ZIP contains only `app-debug.apk` (18,057,524 bytes). Recomputed ZIP SHA-256 matches the GitHub API digest above.
- APK file SHA-256: `b12e6860979fcd66e060de0da76e0c9e55c64b265837b108af6a34122237e529`.
- Evidence artifact `14557436781`: 106,635 bytes; API and recomputed ZIP SHA-256 `933d7740574d9b8383bb1eefda6202b20fed530a4967dcd84794cd293d356f2e`. All 15 entries were inspected; test summary confirms 38/38 suites, 97/97 tests, zero failures, exit code 0 and `report_valid=true`.
- APK signing report: Android Debug certificate SHA-256 `fb48505473b61038b17c4553d009a4a37e63047e7dee8759a14af74bbaa6197f`; v1 and v2 verification true. This is not a release-signed APK.

The current branch HEAD at the time of this report was `4db9d3d7b397fc59f3310936eecd6792a4ca218f`. GitHub compare from run #321 commit `c5ba0e80b017dfeb04d29c17a66205fab23ce0d9` to that HEAD is `ahead`, 52 commits, and reports only documentation paths changed (12 paths); no product/runtime source path changed. Thus the latest APK run covers the unchanged product source tree, but it is **not a workflow run on the exact current HEAD** because the later documentation commits use `[skip ci]`.

Scope: these runs support CI/test/debug-APK build status only. They do not prove Android device QA, gameplay acceptance, data-pack delivery, release signing, B7 independent review, overall S0 PASS or S1 authorization.


## 15. Exact-HEAD Android APK CI evidence — run #322 (2026-11-20)

- Run: [44661820747](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44661820747), workflow `Android APK (debug)`, branch `experiment/vic3-visual-upgrade`, exact commit `68fee31641d2249be824a87f4302c26a5aeb6611`, job `136041609778` SUCCESS.
- Evidence artifact: `14596545236`, 106,681 bytes, ZIP SHA-256 `50c75905c66950a8868afc58f9eb81f3ecc09096fc3e2a0254b13f7233747492`; downloaded and inspected (15 files).
- Test report: `report_valid=true`; 38/38 suites and 97/97 tests passed, zero failures, Vitest exit code 0.
- Gradle: `BUILD SUCCESSFUL`; 85 actionable tasks; APK assembly and both artifact uploads completed.
- APK artifact: `14596440616`, 17,569,399-byte ZIP, ZIP SHA-256 `1f3d14e2c2f4aa43b5d1fe12fb1ed34b6058d37c5c91c8b262de2b20a57d7ff5`. Downloaded and inspected; contains the debug APK.
- APK file: 18,057,541 bytes, SHA-256 `eda437afeadad10074d38acf567601c0c43ab3a6e9661ce8145962896fdf3cbb`.
- Signing: Android Debug certificate SHA-256 `559d549a21515f899b6195c65114b2be778ff2fbd63288d21ef31f4365b96238`; apksigner exit 0, v1/v2 verification true. Not release-signed.
- Provenance confirms checkout ref `refs/heads/experiment/vic3-visual-upgrade` and checked-out HEAD equals `68fee31641d2249be824a87f4302c26a5aeb6611`. No device installation or physical-device QA is evidenced.
- This run closes the previous CI observation gap at the exact pre-run-commit HEAD; it does not change S0 gate verdicts, B7 reviewer status, owner acceptance, or S1 authorization.


## 16. B4 Run #3 npm ci vulnerability summary — raw-log follow-up (2026-11-20)

- Re-fetched original run `44325257261`, job `134874698600`, and inspected its complete job log. It records: `added 220 packages, and audited 221 packages in 2s`; then `10 vulnerabilities (3 moderate, 5 high, 2 critical)`.
- The B4 workflow has no artifact upload and preserves no npm audit JSON/package-level advisory report. The raw log therefore confirms the summary but not the identities or paths behind those ten counts.
- GitHub confirms the exact package-lock blob is identical at frozen baseline `2240a8f`, B4 checkout `7f17b1f` and experiment branch: `29ac661a36bb03bae62a80ce7abf9af0c15bb168`.
- The later B7 audit (`44572915201`) used explicit `npm audit --package-lock-only --json` against the frozen baseline. It reports six vulnerable package entries (3 moderate, 1 high, 2 critical) and a separate production-only result of zero. Its full lockfile metadata lists 292 dependencies (76 optional); the B4 install-time log reports 221 packages audited.
- npm documents `audit=true` as the default install behavior for `npm ci`, and documents the registry-advisory plus vulnerability/meta-vulnerability calculation used by standalone `npm audit`: https://docs.npmjs.com/cli/v10/commands/npm-ci/ and https://docs.npmjs.com/cli/v10/commands/npm-audit/.
- This establishes that the two observations came from different command paths and report contexts, not that the exact cause is known. Without the B4 npm-ci raw JSON, the 10-versus-6/severity difference remains **UNRECONCILED**. DEP-F1 stays OPEN P1; no dependency remediation is authorized here.

## 17. S0-B7 cross-document structure validation — 2026-11-20

A GitHub-content structural check was run against the then-live experiment HEAD `dbf90c077d2ffe5454937cbf4d4a8b84e6222740` and the current audit documents.

- Risk Register P2 section: exactly 22 data rows; all 22 use six cells matching the six-column header. No malformed row was detected.
- Risk traceability: 48 source/gate mapping rows (including the G0.7 device-evidence gate row); no duplicate mapping IDs were detected. All mapped IDs resolve to an exact Risk Register row or explicit grouped row. R3 resolves to the Closed section.
- DEP-F1 was the one stale traceability description: it did not yet include the re-inspected B4 `npm ci` log or the identical lockfile blob SHA. This has now been corrected in `S0_B7_RISK_TRACEABILITY.md`; the exact discrepancy remains UNRECONCILED.
- This was documentation-structure and cross-reference validation only. It is not a review verdict, runtime test, device test, gate closure or S1 authorization.
## 18. B3 Phase Register consistency — 2026-11-20

Cross-checking S0 handoff status found the Phase Register still labelled B3 `READY_FOR_REVIEW`, contrary to the current task summary and B4 prerequisite. The exact historical review record confirms ChatGPT independently re-reviewed B3 correction commits `ddea490635c5d7c74ca6108549fd21806102487b` and `2c62b3de3955e3cd8a82a9c59401d9df77d69173` and issued bounded `REVIEW_PASS` on 2026-11-16. The current Phase Register and `S0_B3_RESULTS.md` summary were aligned; old round-1 / pre-review notes remain historical. This does not change S0 gates, owner acceptance or S1 authorization.
## 19. Source severity and row-schema reconciliation — 2026-11-20

A cross-source parser checked v3.2 R1–R14, B3 RM/WD findings, the test catalog, global-data audit and asset audit against the B7 traceability matrix and exact Risk Register locations.

- No severity mismatch remained after normalizing Markdown emphasis on the R7 `P0` label. R3 maps to the Closed section. The G0.7 `BLOCKED` entry is a gate verdict, not a P-level risk.
- All 48 traceability rows were unique and resolved to a Risk Register target. The 22 P2 rows each have six cells; every P0/P1/P2/P3/Closed table row has the expected number of cells and no blank cell was detected.
- CI-F1–F4 and DEP-F1 are B7-specific findings; their severity remains P2/P2/P2/P1/P1 respectively in the consolidated register/traceability documents.
- No severity, risk disposition or gate status was changed. This was documentation cross-checking only; no runtime/Gradle/device tests were run.

## 21. P0/P1 disposition completeness follow-up — 2026-11-20

A targeted review of the live Risk Register and source roadmap found that the six-column schema was complete, but several target/exit descriptions were too broad to drive later acceptance consistently. The register and traceability matrix now make these boundaries explicit without changing severity or gate status:

- R2/AS-F1: map full legacy attribution and live source-page verification to S5; preserve only the narrowly bounded unchanged-legacy S1 exception.
- R10: require separate approved numeric budgets and evidence for S4, S11 and S20; no cross-stage substitution.
- GD-F2: stage the evidence work across S3/S6 and relevant economic/historical-character data tasks; close against a 12-region × polity-type provenance/coverage report, not raw row counts.
- TC-F1/TC-F2: separate political (S17/S19) and military (S20/S21) test targets, with explicit non-vacuous guards and boundary checks.

No owner role was absent; the register uses accountable functional roles, with implementation/verification roles clarified where split responsibility matters. R7 remains OPEN P0 with interim containment only; R14 remains BLOCKED; R1/R13 remain OPEN/deferred; CI-F4 remains narrowly CLOSED; DEP-F1 remains OPEN P1 and UNRECONCILED at 10-vs-6. No severity, gate, owner acceptance or phase authorization changed. Documentation-only review; no runtime test/build/device test was run.


## 22. Exact-HEAD Android APK run #324 — 2026-11-20

- Exact experiment-branch checkout/trigger SHA: `31f1617ed838110296fd68edfd90c7e3e3b8d0a7`. GitHub Actions run `44677523059`, job `136092798809`, conclusion SUCCESS; branch HEAD at post-run verification was the same SHA.
- Build/test steps succeeded: `npm ci`; data/map/web build; generated-data/web hashing; Vitest; Capacitor sync; Android web-asset hashing; `./gradlew assembleDebug --no-daemon` (exit 0; `BUILD SUCCESSFUL in 1m 20s`). Test report independently cross-validates Vitest JSON and task-tree counters: 38/38 suites, 97/97 tests, zero failures, zero pending, `report_valid=true`.
- APK artifact ID `14603730370`, ZIP 17,569,417 bytes, SHA-256 `4a2800bcab95fd0d92ab6f7bbe93111fa7059b1d82a2a340f3a3ac892a34cfd1`. Downloaded ZIP was rehashed locally and matched the GitHub API digest. Its `app-debug.apk` is 18,057,538 bytes, SHA-256 `d64bdf78726d991f1bb3c867200f360e2fc563bc0332282cf75cbe7d9734d285`; this matches `apk_sha256.txt` in the evidence artifact.
- `apksigner verify --verbose --print-certs` exited 0; V1 and V2 signatures verify. Debug certificate SHA-256: `84bb348722b660bb36805f3928f73d64401d313a8627168796b6068a2ee1d146`.
- CI evidence artifact ID `14603825259`, 106,638 bytes, ZIP SHA-256 `3a53e96540faa10585b893dd9cc7ea6a071ccb65c6a1accfa94bbf73f447c16b`; local ZIP digest matches API metadata. All 15 archive entries were inspected, including provenance, test summary, Vitest JSON/task tree, APK checksum, certificate report, and asset manifests.
- R1 comparison: Run #322 (`44661820747`, checkout `68fee31641d2249be824a87f4302c26a5aeb6611`) certificate SHA-256 `559d549a21515f899b6195c65114b2be778ff2fbd63288d21ef31f4365b96238`. GitHub compare `68fee316..31f1617` reports 17 documentation-only commits / 12 changed documentation paths and no product/source/build changes; Run #324 certificate fingerprint differs. This is direct evidence that the current debug builds do not share a stable signing identity; R1 remains OPEN and B2/C3 remains blocked until R14 and the protected signing conditions are satisfied.
- Run #324 also emits the existing Node 20 deprecation warning for `actions/*@v4`; CI-F1 remains OPEN P2. The build result does not change CI-F4's narrow closure, G0.6's separate B4 evidence, or any phase gate.
- No APK was installed on iQOO; no gameplay/device QA, release signing, data-pack delivery, dependency change or product-source change is claimed.


## 23. Risk Register P1 table structure correction — 2026-11-20

A follow-up structural parser found that the `CI-F4` row had a blank line immediately before it, causing Markdown renderers/parsers to treat it as a detached one-row table without the six-column header. Removed that blank separator so CI-F4 is part of the P1 risk table. Its severity, disposition and closure evidence are unchanged. Rechecked the rendered table groups: P0 1×6 cells; P1 13×6 cells (12 P1 risk rows plus the separate G0.7 device-evidence gate row); P2 22×6 cells; P3 5×3 cells; Closed 1×3 cells. All cells are populated. The 48 traceability source mappings remain unique and resolve to their register locations. Documentation-only correction; no tests/build/device QA or gate changes.


## 24. R13 and GD-F2 stage/exit specificity — 2026-11-20

A source-to-roadmap review tightened two remaining P1 dispositions without changing severity or status:

- R13 now separates proposed future signing controls from deployed controls. The proposed workflow is manual-only, branch-gated, build/sign separated, protected by the `development-signing` Environment and per-run reviewer approval, no admin bypass, least privilege, full-SHA Action pins, no Repository Secrets, no untrusted-code execution in the signing job, and temporary-key cleanup. None of these controls is claimed implemented; B2/C3 stays BLOCKED pending R14 and owner-controlled setup.
- GD-F2 now allocates population coverage to S6, economic facts to S7/S13, and historical rulers/officeholders to S16, with S3 geographic validity. Its exit criteria require field-specific provenance, temporal/geographic scope, units/method/denominator and uncertainty, plus explicit missing/conflict counts across 12 regions and polity types.

No data, workflow, key, signing, product code or gate was changed. This is an implementer documentation self-audit; independent Claude review and owner acceptance remain pending.
