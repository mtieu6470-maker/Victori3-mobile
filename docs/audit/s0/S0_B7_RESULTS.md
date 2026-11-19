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

