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
- R1/R13 signing risks remain controlled by deferring B2/C3 and keeping secrets/keystores out of the repository and ordinary workflows.
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


## 2.3 Current experiment-branch APK workflow limitation (CI-F4)

The B1/G0.2 baseline build evidence does not certify that the current experiment branch can assemble an APK. The latest available Android APK workflow runs on the experiment branch are #316 and #317 (commits `26963da` and `fa95ad8`); both passed `npm ci`, the data/web build and generated-data hashing, then failed one baseline-only B4 characterization assertion (108/109 tests passed). The assertion expects `constructionQueue` to be absent, while the experiment branch adds/initializes that later field and the frozen baseline `2240a8f` predates it. Android SDK setup, Capacitor sync, Gradle and APK upload were skipped. No APK was produced by either run.

This is recorded as OPEN P1 `CI-F4` in the Risk Register. It is a test-scope/workflow integration mismatch; it does not retroactively invalidate the approved frozen-baseline B4 Run #3 evidence. It also does not establish that the experiment-branch APK build passes. No fix is included in S0-B7: changing test selection or the Android workflow requires a separately authorized CI/test task. Keep the baseline characterization intact and preserve the failing run evidence.

The B7 dependency-audit workflow also remains un-dispatched. The current GitHub connection has no workflow-dispatch operation; its absence is an execution limitation, not a PASS. DEP-F1 remains OPEN P1 — UNTRIAGED until the full-tree and production-only JSON artifact is reviewed.


## 5.3 Dependency-audit evidence update — 2026-11-20

- Run `44572915201` succeeded on workflow commit `9b150cff57e79bdb5356e431cc140b3b1b9eda2d`; job `135732603544` completed successfully.
- Artifact `14555141888` (4,753 bytes; API SHA-256 `b9124fa9c6f0272abaf970557ce248ef32c4d85397d21dbe64ebb19221a65a28`) was downloaded and all eight entries inspected.
- Full-tree npm audit: six vulnerable package entries, severity totals 3 moderate / 1 high / 2 critical, exit code 1 due to findings. Production-only audit: zero findings, exit code 0. Both stderr files empty; JSON and summary valid.
- Findings are confined to dev dependencies in this lockfile. This does not certify build-tool security or the final APK; a separate authorized dependency-maintenance task is still needed. No package or lockfile changes occurred.
- DEP-F1 is no longer UNTRIAGED, but remains OPEN P1. Overall S0 remains PARTIAL/BLOCKED; bounded S1-entry package remains NOT_TESTED; S1 remains NOT AUTHORIZED.
