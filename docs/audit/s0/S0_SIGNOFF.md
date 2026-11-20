# S0 — Signoff and gate ledger (draft)

**Decision basis:** OD-20261116-11, approved S0 v3.3 amendments and v3.2 gate rules  
**Product baseline:** 2240a8fb865e0021eec2f2f4f1c6803528be9e2c  
**Current task:** S0-B7  
**Document status:** DRAFT — prepared for independent review; not owner-accepted  
**Overall S0 verdict:** **PARTIAL — NOT COMPLETE**  
**S1 status:** **NOT AUTHORIZED YET**  
**Bounded S1-entry package:** `NOT_TESTED` — independent reviewer verdict and owner `ACCEPTED` decision are still pending.

## 1. Gate ledger

| Gate | Verdict | Evidence and reasoning | Remaining limitation |
|---|---|---|---|
| G0.1 Snapshot / baseline integrity | PASS | S0-A snapshot and repository baseline; B3 worktree was clean on 2240a8f. B4 Run #3 commit comparison finds no product source/data/dependency/build-input delta. | Recheck exact HEAD before any later task; do not merge experiment product changes based on this audit. |
| G0.2 Build / CI / integrity | PASS | S0-A clean build and payload comparison; B1 CI evidence run 43834719406 records APK SHA separately from artifact ZIP digest and checksums. | B4 Run #3 itself did not run typecheck or upload an artifact; this does not replace B1 evidence. |
| G0.3 Test catalog | PASS | S0_TEST_CATALOG.md and s0_test_catalog.json inventory 58 baseline tests, executed assertion counts, stability, and vacuity/flakiness findings. | Several existing tests are pass-vacuous or weaker than their names; TC-F1–F7 remain open findings. |
| G0.4 Requirement audit | PASS | S0_REQUIREMENT_MATRIX.csv covers 353 atomic requirements from MASTER_SPEC_VI §§0–17 with implementation states and evidence/runtime paths. | PASS means the audit is complete and candid, not that the product implements all requirements: 24 implemented, 173 partial, 6 placeholders, 140 missing, 10 unverified, 0 broken. |
| G0.5 Global data audit | PASS | S0_GLOBAL_DATA_AUDIT.md and the admin-1 × 662-region crosswalk; coverage and sourced/estimated/default/missing states are reported. | 12 analysis groups (West Asia and Middle East merged), not 13 independent groups. Uneven coverage and missing provenance remain recorded findings. |
| G0.6 Save/load determinism | **PASS** | B4 Run #3, run 44325257261 / job 134874698600; 4/4 Historical/Sandbox × K=6/12 cases MATCH over N=24 months, complete GameState hashes match and first differing path is null. Exact executed test file SHA and baseline-equivalence comparison are documented in S0_B4_RUN_3_REVIEW.md. | Run #3 had no uploaded artifact and did not run typecheck. Its executed test source is commit 7f17b1f, not the later expanded file on the experiment branch. These boundaries are explicit and do not undermine the §6.7 replay result. |
| G0.7 Runtime / performance | **BLOCKED** | Node baseline measurements exist; desktop measurement exists only in Chromium headless + CPU SwiftShader and is PARTIAL. | No iQOO Z10 Turbo measurement. Any S1 exception must be limited to CI/desktop data-contract work and must prohibit runtime/performance/lifecycle/rendering changes. |
| G0.8 Asset / license | **PARTIAL** | 627-file inventory and SHA-256 manifest PASS. | 492 image licenses are recorded but not reverified; four BY assets lack author fields; text attribution UI is incomplete and runtime rendering is NOT_TESTED. The only proposed S1 exception is narrowly limited to unchanged legacy content/assets. |
| G0.9 Risk / signoff | **BLOCKED — full S0 gate** | v3.2 §6.4 makes G0.9 BLOCKED while C3/B2 is BLOCKED; OD-20261116-11 §2.1.1 explicitly preserves that full-S0 verdict. R7 remains OPEN P0 with interim containment accepted in principle, not fixed. | This does not decide the separate bounded S1-entry package. That package remains `NOT_TESTED` pending reviewer `REVIEW_PASS` and explicit owner `ACCEPTED` for the scoped exceptions. |

## 2. B7 risk disposition

- R7 is the known P0. Its interim containment was accepted in principle by the owner in OD-20261116-11 §5.1. It remains an OPEN P0 and is not marked fixed.
- R14 is BLOCKED pending export/import testing on the installed baseline APK. Do not uninstall the baseline or install a differently signed APK.
- R1/R13 signing risks remain controlled by deferring B2/C3 and keeping secrets/keystores out of the repository and ordinary workflows. R1 now has direct repeat evidence: Run #322 certificate SHA-256 `559d549a21515f899b6195c65114b2be778ff2fbd63288d21ef31f4365b96238` versus Run #324 `84bb348722b660bb36805f3928f73d64401d313a8627168796b6068a2ee1d146`; GitHub compare confirms only documentation changed between the two checked-out commits. This reinforces OPEN R1 and does not authorize installation or signing changes.
- G0.7 remains BLOCKED for iQOO. Any exception request is limited to S1 data contracts/schema/save compatibility; no tick loop, Worker, renderer, WebView lifecycle, memory, performance, or Android runtime changes.
- G0.8 remains PARTIAL. Any exception request is limited to not modifying, adding, replacing, or distributing existing uncertain assets/text during S1. New assets/content must have verified provenance/licensing before inclusion.
- DEP-F1 is **OPEN P1 — AUDIT COMPLETE; REMEDIATION / OWNER DISPOSITION PENDING**. Run `44572915201` and artifact `14555141888` were inspected: full tree 6 (3 moderate, 1 high, 2 critical), production-only 0, valid JSON, empty stderr. All six vulnerable package entries are dev dependencies; nested Vite esbuild `0.21.5` is affected even though root esbuild `0.28.2` is not. The B4 Run #3 `npm ci` count of 10 remains unreconciled. No `npm audit fix` or lockfile update is authorized; details and exact hashes are in `S0_DEPENDENCY_AUDIT_PLAN.md`.

## 3. Proposed bounded S1-entry exceptions (not yet accepted)

### E-G0.7 — iQOO measurement deferred

**Rationale:** The Node and desktop reports exist, but the iQOO device measurement remains unavailable.  
**Permitted scope:** S1 data contracts, schema, provenance, and save compatibility only.  
**Prohibited scope:** performance optimization, tick-loop changes, Worker, renderer/WebGL, WebView lifecycle, memory strategy, Diagnostic UI, Android runtime, or device installation.  
**Closure:** collect the actual iQOO measurements before S2 and any stage affecting runtime/device behavior.  
**Owner:** project owner.  
**Status:** accepted in principle only under OD-20261116-11; this concrete exception is not yet owner-accepted in S0_SIGNOFF.md.

### E-G0.8 — existing legacy asset/license records remain partial

**Rationale:** inventory/checksum coverage is complete, but 492 image licenses remain recorded-not-reverified and attribution gaps remain.  
**Permitted scope:** S1 data/save contracts without asset or text content changes.  
**Prohibited scope:** adding, replacing, editing, or redistributing uncertain assets/text; any new content must have verified source, author, license, temporal validity, and attribution.  
**Closure:** reverify legacy licenses and correct attribution before later content expansion/release stages.  
**Owner:** project owner and content/licensing owner.  
**Status:** accepted in principle only under OD-20261116-11; this concrete exception is not yet owner-accepted in S0_SIGNOFF.md.

## 4. Required R7 operating warning

The owner must treat all current game sessions as experimental and potentially lossy. The baseline has no verified lifecycle autosave or renderer/process-death recovery. Do not play long sessions while relying on recovery; do not treat Export as a valid backup until R14 is tested on the installed Android baseline. Keep the baseline APK installed. Do not uninstall it or install an APK signed with a different certificate.

The only automatic save observed by B3 is tied to January in-game date; it is not a process-death or renderer-recovery mechanism. This warning is a containment rule, not a technical fix.

## 5. Acceptance checklist

| Check | Status |
|---|---|
| B1 reviewer technical verdict is recorded with APK and ZIP hashes separated | PASS |
| B3 bounded audit has independent REVIEW_PASS | PASS |
| B4 §6.7 Historical and Sandbox save/load determinism evidence reviewed | PASS |
| G0.1–G0.6 hard gates | PASS |
| G0.7 iQOO limitation remains BLOCKED and exception is scoped | DOCUMENTED; concrete exception pending |
| G0.8 license limitations remain PARTIAL and exception is scoped | DOCUMENTED; concrete exception pending |
| R7 P0 has owner-accepted interim containment | ACCEPTED IN PRINCIPLE under OD-20261116-11; remains OPEN |
| Every P1 has evidence, impact, mitigation, stage and owner | DOCUMENTED IN DRAFT; reviewer check pending |
| No uncontrolled P0 | R7 containment is recorded; reviewer must confirm sufficiency |
| G0.9 (full S0) | BLOCKED while C3/B2 is blocked under v3.2 §6.4 / OD-20261116-11 §2.1.1 |
| Overall S0 | PARTIAL |
| Bounded S1-entry package | Not yet REVIEW_PASS / ACCEPTED |
| S1 implementation authorization | NOT GRANTED |

## 5.1 Bounded S1-entry package status

| Item | Status |
|---|---|
| Separate bounded transition-package review | `NOT_TESTED` — reviewer has not issued `REVIEW_PASS` |
| Owner acceptance of E-G0.7 / E-G0.8 / R7 containment / limited S1 scope | `PENDING` — no acceptance is inferred from the existing in-principle decision |
| Full S0 G0.9 | `BLOCKED` while C3/B2 remains blocked; do not relabel as PASS or NOT_TESTED |

## 5.2 Dependency-audit evidence status

| DEP-F1 audit workflow and artifact | RUN SUCCESS; both raw reports reviewed; DEP-F1 OPEN P1 pending remediation / owner disposition |

## 6. Required next decisions

1. Independent reviewer checks S0_B4_RUN_3_REVIEW.md, S0_RISK_REGISTER.md, S0_B7_RESULTS.md and this signoff against the exact GitHub HEAD.
2. Reviewer issues REVIEW_PASS or CHANGES_REQUESTED for the bounded S1-entry package; this is not a claim that all S0 gates are PASS.
3. Project owner explicitly accepts or rejects E-G0.7, E-G0.8, the R7 containment and the limited S1 scope in writing.
4. Only after that owner ACCEPTED decision may S1 be started, limited to the approved data contracts/schema/save compatibility scope.

No workflow, build, APK, device, signing, product code or data change is authorized by this draft.


## 2.3 Experiment-branch APK workflow — CI-F4 closure evidence

Historical runs #316 and #317 failed because the Android workflow ran a frozen-baseline B4 assertion against the later experiment source tree. This was corrected in commit `b5948f0bbca126712c64dd605ebb7d9f6ddfb907`, which changes only `.github/workflows/android-apk.yml` and excludes `tests/s0-save-determinism.test.ts` from the experiment-branch APK suite; the test remains on the separate pinned-baseline B4 path. Run #318 (`44573351798`) on that commit completed SUCCESS: 38/38 suites and 97/97 tests passed, Gradle assembled the debug APK, and checksum/signing evidence was uploaded and verified.

CI-F4 is now CLOSED for this narrow APK-workflow integration issue, using run #318 as the closure evidence. The approved frozen-baseline B4 Run #3 result is unchanged; the old failures remain historical evidence. The current `.github/workflows/s0-b4-tests.yml` is configured to check out `2240a8f` and overlay only the test harness/fixture, but that workflow was not re-run in this slice. This does not certify gameplay quality, physical-device QA, release signing or data-pack delivery.

The B7 dependency audit is complete and reviewed: run `44572915201`, artifact `14555141888`; DEP-F1 remains OPEN P1 pending remediation/owner disposition, as detailed in §5.3 and the dependency plan.


## 5.3 Dependency-audit evidence update — 2026-11-20

- Run `44572915201` succeeded on workflow commit `9b150cff57e79bdb5356e431cc140b3b1b9eda2d`; job `135732603544` completed successfully.
- Artifact `14555141888` (4,753 bytes; API SHA-256 `b9124fa9c6f0272abaf970557ce248ef32c4d85397d21dbe64ebb19221a65a28`) was downloaded and all eight entries inspected.
- Full-tree npm audit: six vulnerable package entries, severity totals 3 moderate / 1 high / 2 critical, exit code 1 due to findings. Production-only audit: zero findings, exit code 0. Both stderr files empty; JSON and summary valid.
- Findings are confined to dev dependencies in this lockfile. This does not certify build-tool security or the final APK; a separate authorized dependency-maintenance task is still needed. No package or lockfile changes occurred.
- DEP-F1 is no longer UNTRIAGED, but remains OPEN P1. Overall S0 remains PARTIAL/BLOCKED; bounded S1-entry package remains NOT_TESTED; S1 remains NOT AUTHORIZED.


## 11. Android APK workflow recheck — run #318 (2026-11-20)

- Workflow run [44573351798](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44573351798), branch `experiment/vic3-visual-upgrade`, commit `b5948f0bbca126712c64dd605ebb7d9f6ddfb907`; job `135734112766` SUCCESS.
- The commit diff changes only `.github/workflows/android-apk.yml`: it excludes `tests/s0-save-determinism.test.ts` from the experiment-branch APK suite and documents that the frozen-baseline B4 characterization runs separately against its pinned baseline. The characterization assertion was not deleted or weakened.
- Test evidence artifact ID `14554953353`, size 106,657 bytes, API SHA-256 `96aa79f605d52f7a2eb60748f307802827f6fec9994e280fd655e3565c879829`; downloaded and inspected. Vitest: 38/38 suites, 97/97 tests passed, 0 failed; report_valid=true.
- APK artifact ID `14553589834`, name `dong-chay-lich-su-debug-apk`, ZIP size 17,569,405 bytes, API SHA-256 `72ce3a5759bd1379aaf35bf10a395f3cc136230b44eabc64976375405b85678b`; downloaded and inspected. It contains `app-debug.apk` (18,057,530 bytes), SHA-256 `338fc54ce2e68f15ddc7043c664bdffa9cd79ade3c41aa0ed7a7cf0bfa7fe6b5`.
- Signing evidence: debug signer DN `C=US, O=Android, CN=Android Debug`; certificate SHA-256 `8610076ddcefefc85d188530b0eb4645a21f92f38008692c29f6282a13418e19`. This is a debug APK, not a release-signed artifact.
- All workflow steps completed, including npm ci, web/data build, test suite, Capacitor sync, Android SDK setup, Gradle debug assembly, APK checksum/signing evidence and artifact uploads.
- Artifact ZIP digests were independently recomputed from the downloaded ZIPs and match GitHub API metadata.
- **CI-F4 narrow closure:** the original test-scope integration failure is resolved for the APK workflow by separating the frozen-baseline characterization from the experiment-branch suite; the documented closure condition (full intended experiment-branch suite passes, Gradle assembles, APK checksum/signing evidence uploaded and verified) is met by run #318. The approved frozen-baseline B4 Run #3 remains separate and unchanged. This does not certify gameplay quality, device QA, release signing, data-pack delivery or overall S0.
- Current experiment branch is a descendant of `b5948f0`; the later changes in this documentation slice do not alter the APK workflow or product source.



## 12. Supplementary Android APK CI — runs #319–#321 (2026-11-20)

- Runs `44576526677`, `44576552982`, `44576581387` all completed successfully on documentation-only commits. Each run reports 38/38 suites, 97/97 tests, zero test failures and Gradle `BUILD SUCCESSFUL`.
- Latest run #321 (`44576581387`, commit `c5ba0e80b017dfeb04d29c17a66205fab23ce0d9`) artifact `14557237059` downloaded and inspected; APK `app-debug.apk` is 18,057,524 bytes, SHA-256 `b12e6860979fcd66e060de0da76e0c9e55c64b265837b108af6a34122237e529`; debug certificate SHA-256 `fb48505473b61038b17c4553d009a4a37e63047e7dee8759a14af74bbaa6197f`.
- GitHub compare from #321 commit to current HEAD `4db9d3d7b397fc59f3310936eecd6792a4ca218f` reports documentation-only changes; no product/runtime source changed after the tested build. No workflow was run at the exact current HEAD because subsequent commits skipped CI.
- These runs do not change gate statuses: B7 independent review remains pending, bounded S1-entry remains NOT_TESTED, full S0 remains PARTIAL/BLOCKED, and S1 remains NOT AUTHORIZED. No device install/QA or release signing occurred.


## 13. Supplementary exact-HEAD APK evidence — run #322

Run `44661820747` on exact commit `68fee31641d2249be824a87f4302c26a5aeb6611` succeeded; job `136041609778` passed 38/38 suites and 97/97 tests (0 failures, `report_valid=true`), and Gradle reported `BUILD SUCCESSFUL`. Evidence artifact `14596545236` (106,681 bytes; ZIP SHA-256 `50c75905c66950a8868afc58f9eb81f3ecc09096fc3e2a0254b13f7233747492`) was downloaded and inspected. APK artifact `14596440616` (17,569,399-byte ZIP; SHA-256 `1f3d14e2c2f4aa43b5d1fe12fb1ed34b6058d37c5c91c8b262de2b20a57d7ff5`) was downloaded and inspected; embedded APK is 18,057,541 bytes, SHA-256 `eda437afeadad10074d38acf567601c0c43ab3a6e9661ce8145962896fdf3cbb`. Android Debug certificate SHA-256: `559d549a21515f899b6195c65114b2be778ff2fbd63288d21ef31f4365b96238` (v1/v2 verified). This is CI/build evidence only, not device QA, gameplay acceptance, release signing, S0 completion or S1 authorization.

## 5.4 DEP-F1 install-time log follow-up — 2026-11-20

The B4 Run #3 install-time advisory count has been checked against the original workflow job log. Run `44325257261`, job `134874698600`, records `added 220 packages, and audited 221 packages in 2s`, followed by `10 vulnerabilities (3 moderate, 5 high, 2 critical)`. No package/advisory JSON was uploaded by that workflow. The package-lock blob is identical across frozen baseline `2240a8f`, B4 checkout `7f17b1f` and the experiment branch: `29ac661a36bb03bae62a80ce7abf9af0c15bb168`.

B7's later read-only run `44572915201` executed explicit `npm audit --package-lock-only --json` plus a separate `--omit=dev` scan; its full report contains six vulnerable package entries (3 moderate, 1 high, 2 critical) and its production-only scan reports zero. The different command/report contexts and absent B4 raw JSON do not explain the exact numeric/severity difference. **DEP-F1 remains OPEN P1 — AUDIT COMPLETE; REMEDIATION / OWNER DISPOSITION PENDING.** No dependency update, lockfile mutation or audit fix is authorized by this signoff draft.