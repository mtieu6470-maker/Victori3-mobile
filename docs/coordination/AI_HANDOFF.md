# AI Handoff — Victori3-mobile

> Shared status index for Claude Code, ChatGPT, and the project owner. Never put secrets or personal data here.

## 1. Current project state

| Field | Value |
|---|---|
| Repository | `mtieu6470-maker/Victori3-mobile` |
| Development branch observed | `claude/game-historical-sandbox-modes-kg7rj7` — sole/default branch; B4 code/test HEAD `e4924ca48264f8d0818eface51a28a87cd363b89`; independent review packet added in `86ea7154415c3fca1fcefcc99428c03d607ca9af`; subsequent handoff updates are documentation-only. Re-fetch branch HEAD before the next task |
| Last independently observed baseline | `2240a8fb865e0021eec2f2f4f1c6803528be9e2c` (code baseline; later commits listed below are documentation-only) |
| Coordination setup commit | `bd5787f3e1763170ec7e5ad448466a5cc57c2b40` |
| Coordination correction commit | `6c4d02a36a30f7e82d973da59f569b379f85468d` |
| Handoff update commit | Identified by GitHub commit metadata: the commit that introduced this revision of this file (`git log -1 -- docs/coordination/AI_HANDOFF.md`). Not written here, because a commit cannot contain its own SHA |
| Canonical roadmap | `OWNER_APPROVED` (2026-11-16, OD-20261116-09): `docs/roadmap/DECISIONS_AND_S0_REVISED_VI.v3.2.md` with `docs/roadmap/SOURCE_REGISTER.v3.2.md`, committed verbatim in `574ddc7ac57267ecae2216cb9ee1d490f3b41626`. SHA-256 verified before and after commit: `208a08ef46f7623d6ebbec02765fc1c70cbfcee09af7b4555aa8f7fb85f7b3e8` / `1adc4fedb4311383723631fbe16ceaa92b54344223bda0f93ee2d8c8e06737a2`. The file's own header still says "S0 vẫn chờ phê duyệt" because it is the verbatim pre-approval text; the approval is recorded here |
| S0 v3.3 amendment | `OWNER_APPROVED` with amendments (2026-11-16, OD-20261116-11): `docs/roadmap/S0_V3_3_GATE_RESTRUCTURE_PROPOSAL.md` (SHA-256 `929c06f4b993a6c395d3633bcb8b207554c833d023debe073cb5252f51929cf5`) as amended by `docs/roadmap/S0_V3_3_OWNER_DECISION_AND_AMENDMENTS.md` (SHA-256 `582a8a4e3f0275f5b88debf8b90967c84c077684c104540fc6a5e961847267b6`); sources in `docs/roadmap/SOURCE_REGISTER.v3.3.md`. v3.2 stays canonical except the clauses v3.3 replaces. Both files are verbatim, so their headers still carry draft wording |
| G0.4 requirement source | `docs/spec/MASTER_SPEC_VI.md` — byte-for-byte copy, SHA-256 `d7fa8995dee96046da79d23dd16b2c56c2e0acd0330b28e05d8a0a3ff6afc2f8`, 50 355 bytes, 753 lines; normative §§0–17 (OD-20261116-11 §4) |
| Gate verdict vocabulary | Protocol "Status vocabulary" (`PASS`, `PARTIAL`, `BLOCKED`, `FAIL`, `NOT_TESTED`, `NOT_APPLICABLE`); where the approved S0 document writes "NOT TESTED" it means `NOT_TESTED` |
| Legacy roadmaps and pre-protocol work | `docs/roadmap/LEGACY_DOCUMENTS_INDEX.md` (historical evidence, not authorization) |
| Current approved phase | **S0-B3 → S0-B4 → S0-B7, sequential** (OD-20261116-11). B3 has `REVIEW_PASS`; B4 source corrections are committed and the corrected tests-only CI run `44041104723` passed 70/70 tests across 6/6 suites, including all four save/load determinism cases; independent review/owner acceptance remain pending; B7 has not started and remains gated |
| Current task status | S0-B3 `REVIEW_PASS` (ChatGPT independent review round 2 of exact HEAD `e80ddfc5aa030a625f7e95f1c551800642e6bd55`; bounded to B3 audit scope, not product acceptance). S0-B4 `READY_FOR_REVIEW` with the two self-audit findings corrected in test harness commit `ae29c99330081ba2f6af3a6d4478ec8aefc8a1ad`: missing-RNG continuation now asserts `TypeError`, and comparator operands are normalized through JSON round-trip before ordered comparison. An isolated Node smoke check passed 8 assertions. The first tests-only CI run `44039619132` exposed a workflow setup defect (generated inputs were not prepared; 6 suites failed during collection; 0 tests executed). The corrected workflow passed on exact HEAD `d2ae88e557e9895413462c5b069886bfc606adc7`: run `44041104723`, job `133895641421`, 6/6 suites and 70/70 tests passed, including B4-SA-01/02 and four save/load `MATCH` results. No workflow artifacts were produced; independent second-party Claude review and owner `ACCEPTED` remain pending. B7 remains `NOT_STARTED`. S0-A `READY_FOR_REVIEW`: A1–A4 conditionally accepted and A5 `BLOCKED`; S0-A is not `ACCEPTED`. S0-B1 done: technical verdict `PASS` (v3.3 proposal §2.1, accepted by OD-20261116-11). `COORDINATION-REVIEW-BD5787F` `READY_FOR_REVIEW` |
| S0-B3 evidence | `docs/audit/s0/S0_B3_RESULTS.md` (summary, gate self-assessment, finding index) with `S0_TEST_CATALOG.md`, `s0_test_catalog.json`, `S0_REQUIREMENT_MATRIX.csv`, `S0_GLOBAL_DATA_AUDIT.md`, `S0_ASSET_AUDIT.md`, `S0_PERFORMANCE_BASELINE.md/.json`, `b3/**` — tools commit `3d63061e4bd5b3fdf7c636370da462a5b0f5d721`, reports commit `55331c2bf629bb631701ec82020c7f9deaa7da81`; review-1 corrections: tools `ddea490`, reports and evidence `2c62b3d` (`b3/review1/**`; summary in `S0_B3_RESULTS.md` §8) |
| S0-B1 evidence | `docs/audit/s0/S0_B1_CI_EVIDENCE.md`, `docs/audit/s0/logs/b1/` (commit `e13d964f343ab1ba01fb705fbbd8bcac2674ea80`). B1 commit `382aaa84b2336854b4dbebfcdc719847ff463f41`; run `43834719406`, job `133188390842` success; 58/58 tests; `report_valid=true`; APK file SHA-256 `314c8ca11c1d747550bbdb982326675e5f9dbdac870f3fc1cf04b9de7c22585c`; artifact ZIP SHA-256 `7717a2b79dd46fbf613845e33bac3a17634eae5b0c808328d8b21b5abc150ba0` (a different file) |
| S0-A evidence | `docs/audit/s0/S0_A_RESULTS.md` (summary and gate verdicts), `S0_REPOSITORY_SNAPSHOT.md`, `S0_BUILD_TEST_REPORT.md`, `logs/`, `a4/`, `inputs/` — commits `7d6eec9d0601a7d983679ec7792b1aa96b954ca0`, `d5b9820aae9a96d57e9486845c164ae591fa69de`, `8073fac029463c0685435985a2968cd5a3aba4ab` |
| Pending owner action | Device steps 1–4 of approved document §6.5.1 on the installed baseline APK (listed in `docs/audit/s0/S0_A_RESULTS.md` §2); never paste secrets |
| S0 execution authorized | S0-A done (awaiting review). S0-B1 done. **S0-B3, then B4, then B7** authorized by OD-20261116-11 (B4 only after B3 `REVIEW_PASS`). **NOT AUTHORIZED:** B2/C3, B5, B6, the G0.6 remediation task, S1 and every later phase |
| Gameplay/engine/save changes authorized | NO |
| Signing/keystore/Secrets changes authorized | NO |

The SHA above is a historical observation. Re-check GitHub HEAD before every task.

## 2. Current gate — S0-B3/B4/B7 under v3.3 (OD-20261116-11)

Allowed:
- Audit scripts, catalogs, crosswalk, inventories, fixtures and characterization tests; reports, handoff updates and the audit commits they need.
- Work runs on the baseline `2240a8f` in a clean temporary worktree.
- Harnesses stay outside the product code.
- Order: B3, then stop for review, then B4, then B7.

Not allowed:
- No gameplay, engine logic, RNG, save serialization/schema, migration, shipped data, asset or content changes.
- No B2/C3, B5, B6; no keystore, signing Environment or Secrets.
- No uninstalling the baseline APK and no installing any APK on the iQOO (R14, O5).
- If B4 finds G0.6 `FAIL`: stop and propose `PRE-S1-SAVE-DETERMINISM-REMEDIATION` (decision §3). Never fix inside S0.
- No S1 before the bounded S1-entry package has ChatGPT `REVIEW_PASS` and owner `ACCEPTED`.
- Never write `S0 = PASS` while any gate is `PARTIAL`, `BLOCKED`, `FAIL` or `NOT_TESTED`.

## 3. Coordination tasks

### 3.1. Coordination setup

| Field | Value |
|---|---|
| Task ID | `COORDINATION-SETUP` |
| Scope | Add collaboration protocol and shared handoff index only |
| Base SHA | `2240a8fb865e0021eec2f2f4f1c6803528be9e2c` |
| Result SHA | `bd5787f3e1763170ec7e5ad448466a5cc57c2b40` |
| Files | `docs/coordination/AI_COLLABORATION_PROTOCOL.md` (new), `docs/coordination/AI_HANDOFF.md` (new) — both byte-identical to the owner's setup package; `README.md` (one navigation line) |
| Status | `CHANGES_REQUESTED` — owner review of `bd5787f` (2026-11-16); stays so until the corrections in 3.2 are made and independently reviewed |
| Out of scope | All code, gameplay, workflows, Gradle, signing, secrets, save schema, assets, and S0 execution |

### 3.2. Corrections after review of `bd5787f`

| Field | Value |
|---|---|
| Task ID | `COORDINATION-REVIEW-BD5787F` |
| Scope | Owner decisions 1–7 and the source-of-truth correction from the review of `bd5787f` (section 7); documentation only |
| Base SHA | `bd5787f3e1763170ec7e5ad448466a5cc57c2b40` |
| Result SHAs | `6c4d02a36a30f7e82d973da59f569b379f85468d` (protocol, legacy notice, legacy index); then the handoff update commit (identified by GitHub commit metadata, see section 1) |
| Files | `docs/coordination/AI_COLLABORATION_PROTOCOL.md`; `docs/architecture/PROVINCES_BUILDINGS_MILITARY.md` (notice at the top only, body unchanged); `docs/roadmap/LEGACY_DOCUMENTS_INDEX.md` (new); `docs/coordination/AI_HANDOFF.md` |
| Status | `READY_FOR_REVIEW` (Claude, unverified) |
| Out of scope | All code, gameplay, tests, save schema, Android, Gradle, CI workflows, signing, keystore, GitHub Secrets, PR creation, and S0 execution |

## 4. Phase register

| Phase | Status | Entry condition | Exit condition |
|---|---|---|---|
| S0-A — Baseline as-is (`BASELINE_ORIGINAL`), approved document §6.3 A1–A5 | `READY_FOR_REVIEW` (A1–A4 evidenced; A5 `BLOCKED`) | Owner approval of the S0 v3.2 document and S0-A authorization (OD-20261116-09, -10) — met | S0-A evidence committed; ChatGPT review; owner decision |
| S0-B1 — CI checksums and test report | Done; reviewer technical verdict `PASS` (v3.3 §2.1) | Owner instruction for B1 (OD-20261116-10B) — met | Evidence committed (`e13d964`) |
| S0-B3 — Audit scripts, catalog, coverage, crosswalk, asset inventory, Node/desktop harness | `READY_FOR_REVIEW` round 2 (Claude, unverified); round 1 `CHANGES_REQUESTED` | OD-20261116-11 — met | Reports committed (`3d63061`, `55331c2`; corrections `ddea490`, `2c62b3d`); ChatGPT re-review (B4 waits for B3 `REVIEW_PASS`) |
| S0-B4 — Characterization tests and fixtures (save/load determinism, v3.2 §6.7) | `READY_FOR_REVIEW` (B4-SA-01/02 source corrections committed; isolated helper smoke check 8 assertions passed; corrected tests-only CI run `44041104723` passed 70/70 tests across 6/6 suites; four Historical/Sandbox × tick-6/tick-12 save/load cases all `MATCH`; no APK artifacts; second-party review and owner acceptance pending) | B3 `REVIEW_PASS` + OD-20261116-11 — met | Obtain independent review `REVIEW_PASS` of the exact corrected B4 source/evidence and owner `ACCEPTED`; only then may B7 begin |
| S0-B7 — Risk register and signoff package | `NOT_STARTED` (B4 review/acceptance gate not yet met) | B3 and B4 `REVIEW_PASS` + owner `ACCEPTED` | `S0_SIGNOFF.md`; G0.1–G0.9 ledger; exception requests limited to G0.7 (iQOO) and G0.8 (legacy licences) |
| S0-B2 / B5 / B6 — signing, Diagnostic UI, instrumented measurements | `BLOCKED` / deferred | R14 proven on the baseline APK, O5 decided, protected `development-signing` Environment configured by the owner | Per v3.2 §4.1, §6.8 |
| S1 — Data architecture and save foundation | `NOT_STARTED` | S0 accepted and S1 scope separately approved | S1 acceptance criteria met; independent review; owner accepted |
| S2+ | `NOT_STARTED` | Previous phase accepted and next scope approved | Phase-specific acceptance and owner approval |

Detailed phase scope comes from the canonical roadmap (section 1), within the limits of explicit owner authorizations. This table is not a substitute for that roadmap.

Pre-protocol work:

| Work | Classification | Register | Note |
|---|---|---|---|
| Earlier stages 1–5 (identity/content, numbering of an earlier specification) | `PRE_PROTOCOL_IMPLEMENTED_REPORTED` | `docs/roadmap/LEGACY_DOCUMENTS_INDEX.md` | Not `REVIEW_PASS` or `ACCEPTED`; part of the current baseline; S0 verifies what is present at the frozen SHA |

## 5. Work log

Append newest entries at the top. Do not overwrite earlier entries.

### 2026-11-17 — S0-B4-TESTS-ONLY-CI-PASS

- Date (UTC): 2026-11-17
- Task/phase: S0-B4 full-project test validation using the owner-authorized tests-only workflow; no product/gameplay/engine/save-schema/Android changes.
- Exact workflow run: [`44041104723`](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44041104723); event `workflow_dispatch`; branch `claude/game-historical-sandbox-modes-kg7rj7`; exact checked-out `head_sha=d2ae88e557e9895413462c5b069886bfc606adc7`; job `133895641421`; conclusion `success`.
- Steps: checkout exact SHA — success; Node setup — success; `npm ci` — success; `npm run prepare-assets` — success; `npm run test:fast` — success.
- Generated-data preparation: `build-data: OK` — 274 entities (104 placeholder polities), 662 regions, 13 active alliances, 0 warnings. `build-map`: 8192×3868, 662 regions, 1,426 land borders, 423 sea links, 2,667 landmasses, 5,024 boundary lines; no single-cell regions. Content pack: 502 assets, 8,715,750 bytes (176 flags, 99 coats of arms, 227 portraits); 266 entities linked, 265 entity-text entries, 473 characters (275 linked).
- Vitest result: **6/6 test files passed; 70/70 tests passed; 0 failures; process exit success**. Vitest duration 80.59 s; whole workflow shown in GitHub as 1m35s.
- B4-SA-01: the missing-RNG test passed with current behavior still explicitly characterized as `deserialize` loading `rng=undefined`, then one-month continuation throwing `TypeError`; CI log records `oneMonthContinuation=throws`, `errorName=TypeError`.
- B4-SA-02: both JSON comparator regression tests passed (undefined/object and array ordering semantics; NaN, ±Infinity, and negative-zero normalization).
- Save/load matrix: Historical tick 6 and tick 12 both `MATCH`, final SHA-256 `a6751c47e91eb6786366e086737bb75da68ff8b4b0c617d496bc5e61627228d8`; Sandbox tick 6 and tick 12 both `MATCH`, final SHA-256 `b0d489068f6d3ef1d59fd862405df46851717fff9571b3c95379dbaa407a57cd`. All four report `firstDifferingPath=null`, seed 21, player GBR, 24 months, three scripted commands. Current generated `db.json` SHA-256 `4f4b1fef73aeae19a7fc3e26c2031740240f8306f19be08cf4805d2c1f0a25d6`; `map.json` SHA-256 `9a6a6979dd5e7adc9d5953fc5f089ac94dee4079433ed1d340535dcbe877a696`.
- Artifact check: GitHub Actions run artifact list is empty. The tests-only workflow does not assemble or upload an APK. Existing `.github/workflows/android-apk.yml` remains unchanged (blob SHA `7a2639057272d2629f2d6b89cfc8fb07682dad31`).
- Source-diff boundary: compare from B4 test correction commit `ae29c99330081ba2f6af3a6d4478ec8aefc8a1ad` to tested HEAD `d2ae88e` lists only the tests-only workflow and audit/handoff documentation; `tests/s0-save-determinism.test.ts` was not changed after `ae29c99`.
- Non-blocking log notes: Node/action deprecation warnings appeared during setup/cleanup; all workflow steps and tests completed successfully.
- Gate: B4 remains `READY_FOR_REVIEW`, not `REVIEW_PASS` or owner `ACCEPTED`. This CI pass is execution evidence, not an independent review. Await genuine second-party Claude review and explicit owner acceptance. B7 remains `NOT_STARTED`.


### 2026-11-17 — S0-B4-TESTS-ONLY-CI-GENERATED-DATA-CORRECTION

- Date (UTC): 2026-11-17
- Task/phase: Correct the previously owner-authorized tests-only B4 workflow; no product, gameplay, engine, save, data-source, or Android build changes.
- Base HEAD: `08ec7a3bb485ab0457a99ef77ddeb8ed9a3122e0`.
- CI evidence: tests-only run `44039619132`, exact head `08ec7a3bb485ab0457a99ef77ddeb8ed9a3122e0`; job `133890749856`. `npm ci` succeeded. `npm run test:fast` failed during suite collection: 6 test files failed with `ENOENT` for `src/generated/db.json`; zero assertions/tests ran. The generated directory is ignored by `.gitignore`.
- Root cause: `package.json` defines the canonical `test` script as `npm run prepare-assets && vitest run`; `prepare-assets` runs `data`, `map`, and `content` generators. The first tests-only workflow bypassed this required preparation by calling `test:fast` directly. Map/UI tests also require generated map outputs.
- Correction: the tests-only workflow now runs `npm run prepare-assets` followed by `npm run test:fast`. Push path filters now cover `src/**`, `tools/**`, `historical_data/**`, `assets/map/**`, `public/**`, tests and package/config files so changes to test inputs/generators can retrigger it.
- Explicit exclusions remain: Vite app build, Capacitor sync, Gradle, `assembleDebug`, APK signing/packaging, and artifact upload. Existing `.github/workflows/android-apk.yml` was not edited.
- Files changed for this correction: `.github/workflows/b4-tests-only.yml` and this handoff record only.
- Follow-up documentation commits: `cb4ea8582c503f99e08b40770130c5ff3ac9916f` updates `docs/audit/s0/b4/S0_B4_CHATGPT_TECHNICAL_SELF_AUDIT_2026-11-17.md` with the run/log diagnosis and corrected workflow; `edd2f131b28a5511410e47f4661487430a42bd18` updates `docs/audit/s0/b4/S0_B4_REVIEW_REQUEST.md` so the reviewer uses the corrected test-source commit `ae29c99` and does not reuse the older 69/69 CI result as post-correction evidence.
- Validation after correction: NOT_RUN yet; the corrected workflow needs a fresh manual `workflow_dispatch` run. Current connector has no workflow-dispatch write action. Do not claim the B4 project suite passed until the new run logs prove it.
- Gate status: B4 remains `READY_FOR_REVIEW`; the initial run does not test the B4 assertions. Independent review and owner `ACCEPTED` remain pending. B7 remains `NOT_STARTED`.



### 2026-11-17 — S0-B4-TEST-HARNESS-CORRECTIONS

- Date (UTC): 2026-11-17
- Task/phase: S0-B4 test-harness correction only; no product source or workflow change.
- Base HEAD observed before edits: `a640f6e72da9b76a6504b8827eac2842663cf2b3`.
- Test-harness commit: `ae29c99330081ba2f6af3a6d4478ec8aefc8a1ad`; changed file: `tests/s0-save-determinism.test.ts` only.
- B4-SA-01 correction: missing-RNG characterization now explicitly expects a `TypeError` during one-month continuation and asserts the error name; observed baseline behavior remains unchanged.
- B4-SA-02 correction: added a JSON stringify/parse round-trip before recursive key canonicalization in `firstJsonDifference`; added regression coverage for `NaN`, positive/negative infinity, negative zero, undefined/non-finite array entries, and array ordering.
- Validation: isolated Node helper smoke check passed 8 assertions. This is not the project Vitest suite and not CI evidence.
- Project Vitest/build/CI: `NOT_RUN` for this commit. Commit message contains `[skip ci]` to avoid triggering `.github/workflows/android-apk.yml`, which would assemble and upload an APK.
- Workflow authorization: no workflow changed. A tests-only CI path is still needed to validate test-harness changes without violating the R14 no-new-APK restriction.
- Audit report addendum: `docs/audit/s0/b4/S0_B4_CHATGPT_TECHNICAL_SELF_AUDIT_2026-11-17.md`, follow-up recorded in commit `634c2c6b1d856751963c0e811318041717a992da`.
- Independent review: pending; Claude should review the exact final HEAD when quota is available. ChatGPT is not claiming a second-party `REVIEW_PASS`.
- Owner decision: B4 source corrections authorized by owner instruction in chat; acceptance and B7 transition remain pending.
- B7: `NOT_STARTED`.

### 2026-11-17 — S0-B4-CHATGPT-TECHNICAL-SELF-AUDIT

- Date (UTC): 2026-11-17
- Task/phase: S0-B4 bounded technical self-audit; no product or test source changes.
- Assessed branch HEAD: `0b915ff75c9dab1a1195ac648d3c68acfd073a9c`.
- B4 implementation/test commit: `e4924ca48264f8d0818eface51a28a87cd363b89`; product baseline: `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`.
- Audit report: `docs/audit/s0/b4/S0_B4_CHATGPT_TECHNICAL_SELF_AUDIT_2026-11-17.md`, added in documentation-only commit `8cc48081737b8830ef5d4b4aca7749c1747b5321`.
- Evidence rechecked: coordination protocol/handoff, B4 test, B4 review packet, baseline types/init/save/core/simulation, Android APK workflow, GitHub compare metadata, CI run `44032178418` / job `133866471284` / job log / artifact metadata.
- Git range: `e4924ca` → assessed HEAD `0b915ff` contains five documentation-only commits affecting the review request and handoff; no B4 test-source change after the implementation commit.
- Positive evidence: CI reports 69/69 tests, 26/26 suites, `report_valid=true`; all four Historical/Sandbox × tick-6/tick-12 cases report `MATCH`, equal final hashes and `firstDifferingPath=null`.
- Findings:
  - B4-SA-01 (P2): `tests/s0-save-determinism.test.ts:316-339` records missing-RNG continuation result but never asserts `throws` / `TypeError`; add those expectations in the test harness.
  - B4-SA-02 (P2): `canonicalize` / `firstJsonDifference` handle undefined and ordering correctly but do not make the first-difference comparator fully equivalent to JSON for `NaN`, infinities and `-0`; normalize through actual JSON semantics (then sort object keys) and add regression cases, or explicitly reject non-finite numbers.
- No changes were made to test source because the currently triggered push workflow would also build and upload an APK; no tests-only CI path is authorized. No local test/build was run by this reviewer.
- Workflow/R14: run `44032178418` completed successfully and built/uploaded APK artifact `14304929645`; artifact metadata only was inspected. No APK/evidence artifact was downloaded, and no APK was installed. R14 remains unverified. No workflow change or `workflow_dispatch` was made.
- Technical self-audit conclusion: `CHANGES_REQUESTED` for the bounded B4 test/evidence package, not an independent second-party verdict. Formal B4 lifecycle remains pending independent review and owner acceptance; B7 remains `NOT_STARTED`.
- CI side effect control: this audit report and handoff update use `[skip ci]` documentation commits to avoid retriggering the existing APK workflow. This skips CI and is not a substitute for a tests-only workflow.
- Owner decision: pending; no phase transition authorized.

### 2026-11-17 — S0-B4-SAVE-LOAD-DETERMINISM-EVIDENCE

- Date (UTC): 2026-11-17
- Task/phase: S0-B4 characterization tests under OD-20261116-11, after S0-B3 `REVIEW_PASS` (recorded in commit `2aa8c6c141fef2c060303be7a15df834a71e217e`). Scope limited to test harness/comparator and handoff evidence.
- Branch: `claude/game-historical-sandbox-modes-kg7rj7` (sole/default branch; re-verified).
- Product baseline SHA: `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`.
- B4 commits:
  - `8502648f7ad8875eb0f07046cbdbf990c40c1224` — initial save/load characterization tests;
  - `c4dbd56dc02abd18fab62e2e90747fcd52a58f24` — corrected optional `marketStats` fixture typing;
  - `e4924ca48264f8d0818eface51a28a87cd363b89` — JSON-semantic comparator normalization and regression test.
- Changed file in the comparator correction: `tests/s0-save-determinism.test.ts` only. No `src/`, engine, RNG implementation, `save.ts`, save schema, data, asset, Android resource, or workflow file was changed by the B4 test patch.
- Root-cause check for `countries.ABD.group`: `Country.group` is optional (`src/engine/types.ts:41`); `src/engine/init.ts:179` assigns `group: e.group`; `src/engine/save.ts:7-13` serializes/deserializes with JSON. A review of all 22 TypeScript files under `src/engine/` found no engine use of `hasOwnProperty`, the `in` operator, `Object.keys`, or equivalent reflection to distinguish a missing `group` key from an own key whose value is `undefined`. JSON omits undefined-valued object properties and writes undefined array entries as `null`. The comparator now follows these JSON semantics while preserving array order; a focused regression test checks omission, array order, and undefined array entries.
- CI: [run 44032178418](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44032178418), job `133866471284`, exact HEAD `e4924ca48264f8d0818eface51a28a87cd363b89`, conclusion `success`.
- Test results: 69/69 tests passed; 26/26 suites passed; 0 failures; `vitest_exit_code=0`; `report_valid=true`.
- Determinism matrix (all 24 months, seed 21, player GBR, three scripted commands; same engine/data/map build):
  - Historical, save at tick 6 (1836-07): `MATCH`; uninterrupted/save-load state SHA-256 `a6751c47e91eb6786366e086737bb75da68ff8b4b0c617d496bc5e61627228d8`.
  - Historical, save at tick 12 (1837-01): `MATCH`; same state SHA-256 `a6751c47e91eb6786366e086737bb75da68ff8b4b0c617d496bc5e61627228d8`.
  - Sandbox, save at tick 6 (1836-07): `MATCH`; uninterrupted/save-load state SHA-256 `b0d489068f6d3ef1d59fd862405df46851717fff9571b3c95379dbaa407a57cd`.
  - Sandbox, save at tick 12 (1837-01): `MATCH`; same state SHA-256 `b0d489068f6d3ef1d59fd862405df46851717fff9571b3c95379dbaa407a57cd`.
  - All four cases reported `firstDifferingPath=null`. Data hashes: `db.json` `1ce3a4613e1b5c491b88386d25d297961d71baf78c2c8e67d58c8d54ccb3bd24`; `map.json` `9a6a6979dd5e7adc9d5953fc5f089ac94dee4079433ed1d340535dcbe877a696`.
- Save compatibility observations:
  - malformed JSON: `SyntaxError`;
  - foreign format: rejected;
  - unsupported version 999: rejected;
  - missing envelope state: `TypeError`;
  - missing `marketStats`: deserializes with empty-object fallback and one-month continuation does not throw;
  - missing RNG: currently deserializes with `rng=undefined`, then `stepMonth` throws `TypeError`. This is a real compatibility/validation risk; B4 records it only and does not change engine/save/RNG.
- CI workflow side effect / R14 exception record: the existing push-triggered `android-apk.yml` continued automatically after tests passed and assembled/uploaded a debug APK, contrary to the explicit instruction not to generate a new APK before R14. APK artifact `14304929645` (`dong-chay-lich-su-debug-apk`, 17,555,167 bytes) was uploaded; its digest `sha256:6a6c9b49298950c8d096f0e7d4ceb1d4ed02120e4ba396d3c24a55499297034d` is the **artifact ZIP digest, not the APK file SHA**. CI evidence artifact `14305343860` was also uploaded (103,182 bytes; ZIP digest `sha256:bd84e0219336c206aff3a8ba4e8f9b3d8469e6b6b3146ffd701b2248cd75cebe`). ChatGPT did not download either artifact and did not install any APK on iQOO. R14 remains unverified; the automatically generated APK is not approved for device installation or R14 validation.
- Gate assessment: G0.6 technical characterization result `PASS` on baseline `2240a8f`, because both modes and both save cut points match, fixtures are non-vacuous, array order is retained, and malformed/legacy-save behavior is recorded. This is a technical evidence assessment, not an independent review verdict or owner acceptance. S0 overall is not PASS.
- Risks/limitations: missing RNG remains accepted by `deserialize` and crashes on continuation; R14 remains unverified; the CI workflow's automatic APK packaging is a known process hazard and was not modified in S0.
- Execution/review separation: ChatGPT made the comparator/test-only correction directly through GitHub. Therefore ChatGPT does **not** claim an independent `REVIEW_PASS` for its own correction. Task status is `READY_FOR_REVIEW`; independent review and owner `ACCEPTED` remain pending. B7 remains `NOT_STARTED`.
- ChatGPT review: independent review not claimed (reviewer authored the comparator change).
- Owner decision: pending; no B7/S1 transition authorized by this entry.
- Independent review packet: `docs/audit/s0/b4/S0_B4_REVIEW_REQUEST.md` (added in commit `86ea7154415c3fca1fcefcc99428c03d607ca9af`; documentation only). It asks a second reviewer to independently assess JSON comparator semantics, missing-RNG characterization, B4 coverage, and the R14 workflow side effect. No repository writes requested from the reviewer.
### 2026-11-16 — S0-B3-REVIEW1-CORRECTIONS

- Date (UTC): 2026-11-16 (after the owner relayed the ChatGPT round-1 review)
- Task/phase: S0-B3 corrections for review round 1 (`CHANGES_REQUESTED`, points A–D in section 6). Audit tools and reports only
- Implementer: Claude Code
- Base SHA: `1d8ad6ec60923527cd86dd5b3d584913f3b9cd5f`. Audited code: `2240a8f` in a new clean temporary worktree (`npm ci` 0, `npm run build` 0)
- Head SHAs:
  - `ddea490` (tools);
  - `2c62b3d` (reports and evidence);
  - this handoff update (GitHub commit metadata).
- Changed files:
  - `tools/audit/s0/global_data_audit.ts`;
  - `tools/audit/s0/probe_war_duration.ts` (new);
  - `docs/audit/s0/S0_B3_RESULTS.md` (new §4.1, §8; P0 text in §4);
  - `docs/audit/s0/S0_GLOBAL_DATA_AUDIT.md` (§1, §1.1, §2.2, §2.3, §5);
  - `docs/audit/s0/S0_TEST_CATALOG.md` (TC-F2);
  - `docs/audit/s0/S0_REQUIREMENT_MATRIX.csv` (row MS-13.5-04 only);
  - `docs/audit/s0/b3/review1/**` (new);
  - `docs/coordination/AI_HANDOFF.md`.
- Summary:
  - A: the `estimated` category is described as label-based. Method coverage is added: 262 initial law sets are estimated without a method. RM-F1 is reproduced by the tool (270/334 estimated, 18/62 uncertain without a method).
  - B: 12 analysis groups, West Asia and Middle East merged; no claim of 13 independent regions.
  - C: no new P0 in B3. R7 (P0, pre-identified) is still open: grep found no lifecycle or WebGL context-loss handlers; only a game-date January autosave exists.
  - D: 145 is a counting convention. Initial wars are stored with `start = -1` (`init.ts:143`) and exist for exactly 144 month-ends; wars declared by the AI lasted at most 7–9 months in 4 scenarios.
  - New findings: WD-F1 (P3, latent 145-month asymmetry for declared wars), WD-F2 (P3, real pre-1836 start dates dropped), WD-F3 (P2, 5 of 8 initial wars end by capitulation at tick 5 in every scenario).
  - A proposed test is recorded; no test or engine change.
- Commands and exit codes: see `docs/audit/s0/b3/review1/logs/`.
  - Tool runs: all 0.
  - Before/after comparison: per-group counts unchanged.
  - `npx tsc --noEmit`: 0.
  - Product-source `git diff --quiet` against `2240a8f`: 0.
  - Secrets scan: no match.
  - `git commit`: 0.
- Test results (counts and failures): no product test run needed (no product or test change); CI on push
- CI run/jobs: recorded after push in the reply to the owner
- Artifacts: none
- Device evidence: none (`BLOCKED`)
- Risks/limitations: before-correction evidence kept at the old paths and in `55331c2`. The matrix row change was made through the same auditor-written source as before. WD-F3 is an observation from the engine and `db.wars`; historical end dates were not evaluated
- Claude status (unverified): `READY_FOR_REVIEW` (round 2)
- ChatGPT review:
- Owner decision:

### 2026-11-16 — S0-B3-AUDIT-TOOLS-AND-REPORTS

- Date (UTC): 2026-11-16, about 09:45–10:57 (tools commit and reports commit pushed 10:57; this handoff update afterwards)
- Task/phase: S0-B3 (v3.3 §3.1), authorized by OD-20261116-11; stopped at `READY_FOR_REVIEW`; B4 not started
- Implementer: Claude Code
- Base SHA: `9a602f3d60456c014fb33d4ebd83f174af299077`. Audited code: `2240a8fb865e0021eec2f2f4f1c6803528be9e2c` in a clean temporary worktree, `npm ci` + `npm run build`. The worktree's `git status --porcelain` was empty after all runs
- Head SHAs:
  - `3d63061e4bd5b3fdf7c636370da462a5b0f5d721` (tools);
  - `55331c2bf629bb631701ec82020c7f9deaa7da81` (reports and evidence);
  - this handoff update (GitHub commit metadata).
- Changed files:
  - `tools/audit/s0/` (10 new files, outside product code);
  - `docs/audit/s0/`: `S0_B3_RESULTS.md`, `S0_TEST_CATALOG.md`, `s0_test_catalog.json`, `S0_REQUIREMENT_MATRIX.csv`, `S0_GLOBAL_DATA_AUDIT.md`, `S0_ASSET_AUDIT.md`, `S0_PERFORMANCE_BASELINE.md/.json`, `b3/**` (logs added with `-f`);
  - `docs/coordination/AI_HANDOFF.md`.
- Product source check: `git diff --quiet 2240a8f HEAD -- . ':(exclude)docs' ':(exclude)README.md' ':(exclude).github/workflows/android-apk.yml' ':(exclude)tools/audit/s0'` → exit 0. No product, test, generator, data, asset, save or RNG change
- Summary (self-assessed gates, details in `S0_B3_RESULTS.md`):
  - G0.3 test inventory `PASS`: 58/58 runtime tests catalogued with executed assertion counts and 7/7 stability.
  - Empty-pass findings: TC-F1 `simulation.test.ts:34` and TC-F2 `simulation.test.ts:43` ran 0 assertions; TC-F3 `content.test.ts:41` is core-vacuous; TC-F4 is the 1870/1875 mismatch at `simulation.test.ts:21`.
  - G0.4 requirement matrix `PASS`: 353 atomic requirements of MASTER_SPEC_VI §§0–17 — Implemented 24, Partial 173, Placeholder 6, Missing 140, Unverified 10, Broken 0; file:line re-verified at `2240a8f`.
  - G0.5 global data `PASS`: 12 macro-regions; sourced/estimated/default/missing/labelled-without-source; admin-1 × 662-region crosswalk with 4 374 pairs.
  - G0.8 asset/licence `PARTIAL`: 627-file SHA-256 manifest; 492 image licences recorded but not re-verified; 4 BY assets without author.
  - G0.7 runtime/performance `BLOCKED` (device): Node `PASS`, tick p50 ≈ 20–21 ms, p95 29–33 ms over 1 200 months × 3 runs × 2 modes; desktop `PARTIAL`, headless Chromium + SwiftShader, throughput 0.37–0.47 months/s at every speed (frame production bound), tick callback p95 39–63 ms; iQOO `BLOCKED`.
  - New findings RM-F1…F5 (P1: RM-F3, simulation on the main thread).
  - No P0 found.
- Commands and exit codes: every tool run is logged with `[exit N]` in `docs/audit/s0/b3/logs/` (all 0). Before push, `npx tsc --noEmit` found 2 type errors in the unpushed tools commit (`probe_empty_pass.ts:28`; `tsconfig.json` includes `tools/`); fixed with a type annotation and amended before the first push; `tsc` 0; probe re-run byte-identical. `git commit` 0; `git push` 0
- Test results (counts and failures): baseline suite 58/58 passed in the catalog run (`b3/logs/b3_assertion_count_run.log`); no failures
- CI run/jobs: push of `55331c2` triggered run `43853414428`, job `133251491545`: `success`, 10:57:23–11:00:44 UTC. All steps passed:
  - build with `tsc` over `tools/`;
  - unit and simulation tests with the B1 report validation;
  - APK assembly, checksum and manifest recording;
  - both artifact uploads (APK ZIP `14221065197`, digest `601c57b8…`; evidence ZIP `14220660343`, digest `7f3551f5…`).

  The artifacts are not part of the B3 evidence and were not downloaded
- Artifacts: none uploaded by B3; all evidence is committed under `docs/audit/s0/b3/`
- Device evidence: none (`BLOCKED`)
- Risks/limitations:
  - `actionlint` `NOT_TESTED` (running the downloaded binary was denied; not worked around).
  - Desktop numbers come from CPU-rendered WebGL; they are not representative and never substitute iQOO.
  - Runtime display of CC BY-SA attribution `NOT_TESTED` (static only).
  - Legacy licences not re-verified on Commons.
  - The matrix is auditor-written.
- Claude status (unverified): `READY_FOR_REVIEW`
- ChatGPT review:
- Owner decision:

### 2026-11-16 — S0-V3.3-ACCEPTANCE-DOCS

- Date (UTC): 2026-11-16 (this handoff update commit; GitHub commit metadata)
- Task/phase: record OD-20261116-11; commit the v3.3 documents, the G0.4 source and the protocol sentence
- Implementer: Claude Code
- Base SHA: `e13d964f343ab1ba01fb705fbbd8bcac2674ea80`
- Head SHA: this commit (GitHub commit metadata)
- Changed files:
  - `docs/roadmap/S0_V3_3_GATE_RESTRUCTURE_PROPOSAL.md` (new, verbatim);
  - `docs/roadmap/S0_V3_3_OWNER_DECISION_AND_AMENDMENTS.md` (new, verbatim);
  - `docs/roadmap/SOURCE_REGISTER.v3.3.md` (new);
  - `docs/spec/MASTER_SPEC_VI.md` (new, byte-for-byte);
  - `docs/coordination/AI_COLLABORATION_PROTOCOL.md` (one sentence, decision §2.2);
  - `docs/coordination/AI_HANDOFF.md`.
- Summary: the owner confirmed in the session that the uploaded decision document is the official OD-20261116-11. Files were copied unmodified and SHA-256 checked before commit (`929c06f4…`, `582a8a4e…`, `d7fa8995…`); the spec copy also matches its entry in the owner's handover ZIP
- Commands and exit codes: `cp` (0); `sha256sum` (0, equal to the expected values); `git commit` (0); `git push` (0)
- Test results (counts and failures): `NOT_APPLICABLE` — documentation only
- CI run/jobs: push-triggered B1 workflow; not observed when this entry was written
- Artifacts: none
- Device evidence: not applicable
- Risks/limitations: the verbatim headers still carry draft wording; acceptance is recorded here and in the source register
- Claude status (unverified): `READY_FOR_REVIEW`
- ChatGPT review:
- Owner decision:

### 2026-11-16 — S0-B1-CI-CHECKSUMS-TEST-REPORT

- Date (UTC): 2026-11-16 (plan and revisions in the session; workflow commit 08:51; evidence commit 09:34)
- Task/phase: S0-B1, authorized by the owner's B1 instructions (OD-20261116-10B); applied the reviewed candidate only
- Implementer: Claude Code
- Base SHA: `d6edfc1c008000b6048459b835dd0cf47f825f03`
- Head SHA: `382aaa84b2336854b4dbebfcdc719847ff463f41` (workflow); `e13d964f343ab1ba01fb705fbbd8bcac2674ea80` (evidence)
- Changed files: `.github/workflows/android-apk.yml` (+288/−1; SHA-256 `82458e9c…`; diff identical to the reviewed `fe6115b2…`); `docs/audit/s0/S0_B1_CI_EVIDENCE.md`, `docs/audit/s0/logs/b1/**`
- Summary: the CI now records provenance, generated-data and web-bundle hashes, a Vitest JSON report cross-validated against a task-tree reporter, Android/APK payload manifests, the APK file SHA-256 and, separately, the artifact ZIP digest, in an evidence artifact. Pipeline label `AUDIT_INSTRUMENTED`; product source identical to `2240a8f`
- Commands and exit codes: local pre-commit checks — `git diff --check` 0, YAML parse, `bash -n` ×11 0, `node --check` ×2 0, real suite 0, failing probe 1 (expected); `git commit`/`git push` 0
- Test results (counts and failures): CI 58/58 (5 files), 0 failures, `report_valid=true`; JSON and task-tree counters equal (22 suites / 58 tests)
- CI run/jobs: run `43834719406`, job `133188390842` success (17/17 steps); `GITHUB_TOKEN` Contents/Metadata read only
- Artifacts:
  - APK ZIP `14210308010`: ZIP SHA-256 `7717a2b7…`; APK file SHA-256 `314c8ca1…`, 18 042 486 bytes;
  - evidence ZIP `14209784110`: SHA-256 `53cab2e3…`.
  - All independently re-hashed after download.
  - Four-group payload classification: every difference is `built_at`/`generated` or the bundle name.
- Device evidence: none (`BLOCKED`)
- Risks/limitations: CI failure path only probed locally; `actionlint` `NOT_TESTED`; debug key changes per run (F2)
- Claude status (unverified): `READY_FOR_REVIEW`. The reviewer's technical verdict `PASS` is recorded from the v3.3 proposal §2.1
- ChatGPT review:
- Owner decision:

### 2026-11-16 — S0-A (baseline as-is)

- Date (UTC): 2026-11-16, 06:28–06:39 (commits `7d6eec9` 06:30, `d5b9820` 06:31, `8073fac` 06:39; this handoff update afterwards)
- Task/phase: S0-A — approved document §6.3 A1–A5, authorized by OD-20261116-10
- Implementer: Claude Code
- Base SHA: `e4ef9539e97b15488394cea24e4ce5368d749368` (code baseline audited: `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`)
- Head SHA: `8073fac029463c0685435985a2968cd5a3aba4ab`, then this handoff update commit (GitHub commit metadata)
- Changed files: only under `docs/audit/s0/` — `S0_REPOSITORY_SNAPSHOT.md`, `S0_BUILD_TEST_REPORT.md`, `S0_A_RESULTS.md`, `logs/a1/` (7), `logs/a2/` (23), `logs/a4/` (3), `a4/` (10), `inputs/APK_BASELINE_WEB_ASSETS_SHA256.csv` (reviewer file, SHA-256 unchanged `78c4a21f…`); plus this handoff
- Summary:
  - A1: snapshot; artifact `14193446122` re-downloaded and hashed (ZIP/APK SHA-256 equal the recorded values; 592-file manifest equals the reviewer CSV).
  - A2: clean build in a temporary worktree of `2240a8f`; all 9 standard commands exit 0; 58/58 tests ×3, identical test lists.
  - A3: generated-file SHA-256 before/after every step; tests write nothing.
  - A4: `web/data payload comparison completed` — 587 exact; the cordova files are written by Capacitor at packaging; three files differ only in `built_at`/`generated` and the bundle name, proven by diff.
  - A5: `BLOCKED`.
- Commands and exit codes: listed with their exit codes in `docs/audit/s0/logs/a1/*.log`, `logs/a2/summary.txt` and step logs, `logs/a4/*.log`; all build/test commands exit 0; `npm audit` exit 1 (findings, read-only)
- Test results (counts and failures): 3 local runs, each `Test Files 5 passed (5)`, `Tests 58 passed (58)`; 0 failures; CI baseline job `133056831671` 58/58
- CI run/jobs: documentation commits all `success` — `6c4d02a` run `43814947854`, `c74b606` run `43815102462`, `574ddc7` run `43816739598`, `e4ef953` run `43816839693`, `7d6eec9` run `43817262861`, `d5b9820` run `43817299052`; `8073fac` run `43818265471` was in progress when this entry was written
- Artifacts: none produced by S0-A in the repository (APK/ZIP not committed; hashes and manifests recorded)
- Device evidence: none yet — A5 device part `BLOCKED` pending owner (§6.5.1 steps 1–4)
- Risks/limitations:
  - F1: `npm audit` reports 6 dev/build-tool vulnerabilities, not fixed.
  - F2: the CI debug key differs per run (verified on two runs; confirms R1).
  - F4: `.gitignore` `*.log` required `git add -f`.
  - No Android SDK, so APK signature v2/v3 was not checked.
  - A5 Node/desktop needs the S0-B B3 harness (not authorized).
- Claude status (unverified): `READY_FOR_REVIEW`. Gate verdicts (self-assessed): G0.1 `PASS`, G0.2 `PASS`, G0.3 `PARTIAL`, G0.4 `NOT_TESTED`, G0.5 `NOT_TESTED`, G0.6 `NOT_TESTED`, G0.7 `BLOCKED`, G0.8 `NOT_TESTED`, G0.9 `NOT_TESTED`; S0 overall not complete
- ChatGPT review:
- Owner decision:

### 2026-11-16 — S0-V3.2-APPROVED-DOCS

- Date (UTC): 2026-11-16 (commit `574ddc7` at 06:26 UTC; this handoff update afterwards)
- Task/phase: commit the owner-approved S0 v3.2 documents verbatim; record the approval and the S0-A authorization
- Implementer: Claude Code
- Base SHA: `c74b6068364db07f2b8d39bc64698001544cf468`
- Head SHA: `574ddc7ac57267ecae2216cb9ee1d490f3b41626`, then this handoff update commit (GitHub commit metadata)
- Changed files: `docs/roadmap/DECISIONS_AND_S0_REVISED_VI.v3.2.md` (new), `docs/roadmap/SOURCE_REGISTER.v3.2.md` (new); handoff update commit: `docs/coordination/AI_HANDOFF.md`, `docs/roadmap/LEGACY_DOCUMENTS_INDEX.md` (canonical roadmap pointer), `docs/architecture/PROVINCES_BUILDINGS_MILITARY.md` (roadmap status sentence in the notice only)
- Summary: the two files were copied from the delivered versions; SHA-256 equal to the owner's values before commit (`sha256sum` on the working copies) and after commit (`git show HEAD:<path> | sha256sum`)
- Commands and exit codes: `cp` (0), `sha256sum` + `diff` against the owner's values (0, identical), `git commit` (0), `git show HEAD:<path> | sha256sum` (0, identical), `git push -u origin claude/game-historical-sandbox-modes-kg7rj7` (0)
- Test results (counts and failures): `NOT_APPLICABLE` — documentation only
- CI run/jobs: push-triggered `.github/workflows/android-apk.yml`; not observed when this entry was written
- Artifacts: none beyond the CI's automatic debug APK artifact
- Device evidence: not applicable
- Risks/limitations: the approved file's header keeps its pre-approval wording (verbatim requirement)
- Claude status (unverified): `READY_FOR_REVIEW`
- ChatGPT review:
- Owner decision: approved (OD-20261116-09)

### 2026-11-16 — COORDINATION-REVIEW-BD5787F

- Date (UTC): 2026-11-16 (commit `6c4d02a` at 06:10 UTC; handoff update commit afterwards)
- Task/phase: `COORDINATION-REVIEW-BD5787F` — documentation corrections from the owner's review of `bd5787f`
- Implementer: Claude Code
- Base SHA: `bd5787f3e1763170ec7e5ad448466a5cc57c2b40`
- Head SHA: `6c4d02a36a30f7e82d973da59f569b379f85468d`, then the handoff update commit (GitHub commit metadata)
- Changed files: `docs/coordination/AI_COLLABORATION_PROTOCOL.md`, `docs/architecture/PROVINCES_BUILDINGS_MILITARY.md` (notice only), `docs/roadmap/LEGACY_DOCUMENTS_INDEX.md` (new), `docs/coordination/AI_HANDOFF.md`
- Summary: protocol — sole/default-branch policy, PRs only on explicit owner request, task lifecycle separated from gate verdicts, `PRE_PROTOCOL_IMPLEMENTED_REPORTED`, canonical roadmap pending; legacy architecture proposal marked non-authoritative with its known conflicts listed; legacy roadmaps indexed and pre-protocol stages 1–5 registered; this handoff records the setup SHA, task states and owner decisions
- Commands and exit codes: `git commit` (0) and `git push -u origin claude/game-historical-sandbox-modes-kg7rj7` (0) for `6c4d02a`; the same two commands for the handoff update commit
- Test results (counts and failures): `NOT_TESTED` locally — documentation-only change, no build or test command run
- CI run/jobs: each push triggers `.github/workflows/android-apk.yml` automatically; results for `6c4d02a` and the handoff update commit were not yet observed when this entry was written — read them from GitHub Actions
- Artifacts: none beyond the CI's automatic debug APK artifact
- Device evidence: not applicable
- Risks/limitations: the canonical roadmap is not in the repository; the legacy architecture body is unchanged, only the notice was added; the notice's conflict list adds a fifth item (building IDs, decision E) beyond the owner's four; observation for the signing design (no change made): GitHub Actions runs from Claude's pushes list `mtieu6470-maker` as actor and triggering actor
- Claude status (unverified): `READY_FOR_REVIEW`
- ChatGPT review:
- Owner decision:

### 2026-11-16 — COORDINATION-SETUP

- Date (UTC): 2026-11-16 (commit `bd5787f` at 06:02 UTC)
- Task/phase: `COORDINATION-SETUP`
- Implementer: Claude Code
- Base SHA: `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`
- Head SHA: `bd5787f3e1763170ec7e5ad448466a5cc57c2b40`
- Changed files: `docs/coordination/AI_COLLABORATION_PROTOCOL.md` (new, SHA-256 `eb1f86590a64fb6fb283aac50c1ffd7fb5f34fc532fcd218c8c430102822e997`), `docs/coordination/AI_HANDOFF.md` (new, SHA-256 `056912b880cc386df1067d3691d602613e12e437dd08190c4a2504919aa52dcd`) — both identical to the owner's setup package; `README.md` (+1 line)
- Summary: added the collaboration protocol and the shared handoff index; documentation only
- Commands and exit codes: `cp` of the two files from the package, `sha256sum` comparison (identical), `git commit` (0), `git push -u origin claude/game-historical-sandbox-modes-kg7rj7` (0)
- Test results (counts and failures): no local run; CI job log: `Test Files 5 passed (5)`, `Tests 58 passed (58)`, `Duration 74.23s`; `BUILD SUCCESSFUL in 1m 25s`
- CI run/jobs: run `43814108497` (https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/43814108497), job `133122102826`, conclusion `success`
- Artifacts: `14201681874` `dong-chay-lich-su-debug-apk`, ZIP 17,555,085 bytes, ZIP digest `sha256:2b1cabe893509b3124e37428c4913d80331c4dcce955dc96fee0bf7dff4945c3` (ZIP digest, not an APK hash), expires 2027-02-14
- Device evidence: not applicable
- Risks/limitations: seven conflicts reported after the commit; decided by the owner (section 7) and corrected in `COORDINATION-REVIEW-BD5787F`
- Claude status (unverified): `READY_FOR_REVIEW` at commit time
- ChatGPT review:
- Owner decision: `CHANGES_REQUESTED` (owner review of `bd5787f`, 2026-11-16; section 7)

### Entry template

- Date (UTC):
- Task/phase:
- Implementer:
- Base SHA:
- Head SHA:
- Changed files:
- Summary:
- Commands and exit codes:
- Test results (counts and failures):
- CI run/jobs:
- Artifacts:
- Device evidence:
- Risks/limitations:
- Claude status (unverified):
- ChatGPT review:
- Owner decision:

## 6. Review findings

Source of the rows below: ChatGPT review of S0-B3 round 1 (verdict `CHANGES_REQUESTED`), relayed by the owner in the session on 2026-11-16. Checked commits: `3d63061`, `55331c2`, `1d8ad6e`; CI run `43853414428` success. The reviewer confirmed the audit scope was respected.

Gate results reported by the reviewer:

| Gate | Result |
|---|---|
| G0.3 | `PASS` |
| G0.4 | `PASS` |
| G0.5 | `PASS`, with a note on the grouping |
| G0.6 | `NOT_TESTED` (B4) |
| G0.7 | `BLOCKED` (iQOO) |
| G0.8 | `PARTIAL` |
| G0.9 | `NOT_TESTED` (B7) |

The Status column is Claude's claim, pending re-review.

| ID | Severity | Finding | Evidence | Status | Required action |
|---|---|---|---|---|---|
| B3-R1-A | Change request | The `estimated` category is assigned by quality label without checking `method`, but the report described it as data with an estimation method | `tools/audit/s0/global_data_audit.ts`; `S0_GLOBAL_DATA_AUDIT.md` §1 | Addressed in `ddea490`/`2c62b3d` (Claude, unverified) | Correct the wording; keep RM-F1 and count missing `method`; no data change |
| B3-R1-B | Change request | 12 statistical groups vs the 13 regions of MASTER_SPEC_VI §1.2 (West Asia and Middle East merged) | `tools/audit/regions.ts`; `S0_GLOBAL_DATA_AUDIT.md` | Addressed (Claude, unverified) | State 12 analysis groups and the merge; no claim of 13 independent regions; no partition change |
| B3-R1-C | Change request | "No P0" must distinguish no new P0 in B3 from the pre-identified, still-open R7 | `S0_B3_RESULTS.md` §4 | Addressed (Claude, unverified) | Record that R7 remains open and is not considered resolved |
| B3-R1-D | Change request | `tests/simulation.test.ts:43` runs 0 assertions; probe showed a longest war of 145 months while the engine ends wars at `months > 144` | `S0_B3_RESULTS.md` §4.1; `b3/review1/probe_war_duration_*.json` | Addressed (Claude, unverified): counting convention, findings WD-F1…F3, proposed test | Check `w.start`, `st.tick` and start/end timing; record a finding and a correct test; no engine or test change |

### 2026-11-17 — S0-B3-REVIEW-ROUND-2 (ChatGPT)

- Reviewer: ChatGPT (independent reviewer under AI_COLLABORATION_PROTOCOL.md)
- Exact reviewed branch: `claude/game-historical-sandbox-modes-kg7rj7`
- Exact reviewed HEAD: `e80ddfc5aa030a625f7e95f1c551800642e6bd55`
- Audited product baseline: `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`
- Verdict: **`REVIEW_PASS` for the bounded S0-B3 audit deliverables only**. This is not `ACCEPTED`, does not declare S0 complete/PASS, and does not authorize gameplay, engine, save, data, asset, signing, or device changes.
- Scope check: GitHub compare baseline `2240a8f` → reviewed HEAD `e80ddfc` reports 18 commits / 146 changed paths. Independent path classification found no changes under `src/`, `historical_data/`, `public/`, `tests/`, or Android product resources. Changes are the already-authorized B1 workflow, audit tooling, audit reports/evidence, and coordination/roadmap documents.
- G0.3: **`PASS`** — catalog contains 58 runtime tests from 51 static call sites; 0 unmatched runtime tests; 0 tests without analysis; every catalogued test passed in all 7 recorded runs. The audit correctly exposes two zero-assertion tests (TC-F1, TC-F2) and the core-vacuous content test (TC-F3); these are findings, not hidden passes. The reviewer inspected the assertion counter, catalog generator, raw assertion log, catalog JSON and run log; execution was not independently rerun by this reviewer.
- G0.4: **`PASS`** — 353 unique requirement IDs cover MASTER_SPEC_VI §§0–17; statuses reconcile to 24 `Implemented`, 173 `Partial`, 6 `Placeholder`, 140 `Missing`, 10 `Unverified`, 0 `Broken`. All 24 `Implemented` rows have test evidence. This is a pass for audit-matrix coverage/traceability, not a claim that the product is complete.
- G0.5: **`PASS` with explicit grouping limitation** — audit accounts for 274/274 entities and 662 map regions; 12 analysis groups are disclosed, with West Asia and Middle East merged (not claimed as 13 independent groups); 0 entities are unassigned. It also discloses five supported head-of-state records without sources, 270/334 estimated and 18/62 uncertain entity facts without a recorded method, and the uneven regional coverage.
- G0.7: **`BLOCKED` overall** — Node measurements are recorded across three runs per mode; browser measurements are from headless Chromium + SwiftShader only and are explicitly marked non-representative; iQOO Z10 Turbo measurements are absent. No server/desktop value is treated as device evidence.
- G0.8: **`PARTIAL`** — 627-file inventory/checksum manifest; 492 image records retain licence metadata as recorded but not reverified; four CC BY/CC BY-SA records lack author attribution; 34/35 Android resources match Capacitor template defaults; portrait period metadata and third-party notices remain issues.
- G0.6: **`NOT_TESTED`** (reserved for B4). G0.9: **`NOT_TESTED`** (reserved for B7). S0 is not PASS.
- Review-1 corrections A–D: verified in the corrected tool/report outputs. The estimated category is label-based with method coverage counted separately; 12/13-region grouping is explicit; existing P0 R7 remains open; the four war-duration probes explain 145 as 144 active month-end states plus the `start=-1` counting convention for seeded wars. The latent asymmetry for wars declared during a run is retained as WD-F1, not silently dismissed.
- Unresolved risks retained: R7 remains an open P0 (no lifecycle/renderer/WebGL context-loss recovery found; only a January-in-game-year autosave); G0.7 device evidence is blocked; G0.8 is partial; Android save export/import risk R14 is not verified on device. R14 continues to block B2/C3 and installation of a new APK on iQOO; it does not invalidate this desktop/CI-only B3 review.
- Limitation of this review: the reviewer inspected exact GitHub source, reports, manifests, JSON outputs and committed logs and compared baseline-to-HEAD paths. The reviewer did not independently execute the scripts, tests, builds, or Android benchmark in a local runtime.
- Owner decision: **pending**. B4 remains `NOT_STARTED` until the owner proceeds under OD-20261116-11 and the protocol; no gameplay or S1 phase is opened by this review.

### Current S0-B4 technical evidence — 2026-11-17 (review pending)

This subsection updates the technical gate evidence after the historical B3 round-2 review above; it does not rewrite that review's as-of-date result.

| Item | Current result |
|---|---|
| B4 CI | Run `44032178418`, job `133866471284`, exact HEAD `e4924ca48264f8d0818eface51a28a87cd363b89`: `success` |
| Test report | 69/69 passed; 26/26 suites passed; 0 failed; `report_valid=true` |
| G0.6 technical assessment | `PASS` on baseline `2240a8f`; all four determinism cases `MATCH` with no differing path |
| Save compatibility | Malformed/foreign/version/missing-state behavior recorded; missing `marketStats` fallback continues; missing RNG loads but continuation throws `TypeError` |
| Task lifecycle | `READY_FOR_REVIEW`; independent review and owner acceptance pending |
| Next phase | B7 remains `NOT_STARTED`; do not begin before B4 independent `REVIEW_PASS` and owner `ACCEPTED` |

The CI workflow also auto-generated and uploaded a debug APK after the test step passed. This was contrary to the R14 no-new-APK instruction and is recorded as an unintended workflow side effect in the B4 work log. The artifact was not downloaded or installed; R14 remains unverified.

### 2026-11-17 — ChatGPT technical self-audit (same-author; not independent review)

Audit report: `docs/audit/s0/b4/S0_B4_CHATGPT_TECHNICAL_SELF_AUDIT_2026-11-17.md` (commit `8cc48081737b8830ef5d4b4aca7749c1747b5321`).

| ID | Severity | Finding | Required action |
|---|---|---|---|
| B4-SA-01 | P2 | Missing-RNG test logs continuation outcome but does not assert that the current baseline throws `TypeError`; it could remain green if behavior changes | Add explicit expectations for `throws` and `TypeError` in the test harness; do not change engine/save/RNG behavior |
| B4-SA-02 | P2 | `firstJsonDifference` does not fully match JSON normalization for `NaN`, infinities and `-0`, although undefined object values, undefined array entries, key ordering and array ordering are handled | Normalize through JSON semantics before recursive key sorting, or explicitly reject non-finite numbers; add regression fixtures |

This is a technical self-audit by the same ChatGPT that authored the comparator correction. It is not a second-party independent review and does not set B4 to `REVIEW_PASS`. A safe tests-only CI path is not currently authorized; the existing push workflow also assembles and uploads an APK. Therefore the test source has not been changed and no new APK workflow was run. B4 remains pending genuine independent review and owner acceptance; B7 remains `NOT_STARTED`.

### Follow-up — test-harness fixes committed (2026-11-17)

- Commit `ae29c99330081ba2f6af3a6d4478ec8aefc8a1ad` changes `tests/s0-save-determinism.test.ts` only.
- B4-SA-01 and B4-SA-02 source corrections described in the newest work-log entry are now implemented.
- Isolated Node helper validation: 8 assertions passed. Project Vitest, build and CI were not run for this commit.
- No workflow modification and no APK build was initiated. The current APK workflow remains a process hazard for future ordinary pushes.
- The original B4 self-audit remains a same-author technical review, not a genuine second-party review. B4 still requires project test evidence, Claude's independent review when available, and explicit owner acceptance. B7 remains `NOT_STARTED`.

## 7. Owner decisions

Only explicit owner decisions may be recorded here. Recommendations are not approvals.

| Date (UTC) | Decision ID | Decision | Scope | Evidence/reference |
|---|---|---|---|---|
| 2026-11-16 | OD-20261116-00 | Add the two coordination files to the repository on `claude/game-historical-sandbox-modes-kg7rj7`, with only minimal linking documentation changes | Task `COORDINATION-SETUP`; documentation only; S0 not authorized | Owner instruction in the Claude Code session, 2026-11-16 |
| 2026-11-16 | OD-20261116-01 | Branch policy: amend the protocol; do not create `main`; direct pushes to the sole/default branch only for owner-authorized scope; never force-push | Protocol "Branch and PR policy" | `OWNER_DECISIONS_REVIEW_BD5787F.md` (owner package `Victori3_Claude_Review_Response_bd5787f`, provided in chat, not committed), decision 1 |
| 2026-11-16 | OD-20261116-02 | Keep `docs/architecture/PROVINCES_BUILDINGS_MILITARY.md`; mark it as a legacy, non-authoritative proposal and list its known conflicts | Notice at the top of that file | Same document, decision 2 |
| 2026-11-16 | OD-20261116-03 | Classify the old roadmaps as historical evidence in `docs/roadmap/LEGACY_DOCUMENTS_INDEX.md`; do not delete, renumber or rewrite them | Legacy index | Same document, decision 3 |
| 2026-11-16 | OD-20261116-04 | Earlier stages 1–5 are `PRE_PROTOCOL_IMPLEMENTED_REPORTED`, not retroactively `REVIEW_PASS`/`ACCEPTED`; add an evidence register | Legacy index, protocol, phase register | Same document, decision 4 |
| 2026-11-16 | OD-20261116-05 | Separate task lifecycle statuses from gate verdicts (`PASS`, `PARTIAL`, `BLOCKED`, `FAIL`, `NOT_TESTED`, `NOT_APPLICABLE`) | Protocol "Status vocabulary" | Same document, decision 5 |
| 2026-11-16 | OD-20261116-06 | PRs only on explicit owner request and only with a distinct target branch; never merge without explicit owner approval | Protocol | Same document, decision 6 |
| 2026-11-16 | OD-20261116-07 | Record the setup SHA in a second documentation-only commit; no self-referencing SHA; setup review state `CHANGES_REQUESTED` until corrected and independently reviewed; S0 execution authorized = NO | This handoff | Same document, decision 7 |
| 2026-11-16 | OD-20261116-09 | Approve `DECISIONS_AND_S0_REVISED_VI.v3.2.md` and `SOURCE_REGISTER.v3.2.md` exactly as delivered (SHA-256 `208a08ef46f7623d6ebbec02765fc1c70cbfcee09af7b4555aa8f7fb85f7b3e8` / `1adc4fedb4311383723631fbe16ceaa92b54344223bda0f93ee2d8c8e06737a2`); commit them verbatim; stop if hashes differ | Canonical roadmap and S0 specification | Owner instruction in the Claude Code session, 2026-11-16; committed in `574ddc7ac57267ecae2216cb9ee1d490f3b41626` |
| 2026-11-16 | OD-20261116-10 | Authorize S0-A only (audit and freeze the baseline, approved document §6.3); no gameplay, engine, data, UI, test, save-format or migration changes; S0-B, S1 and later not authorized; every result with evidence, log, SHA and a gate verdict; after S0-A update this handoff and stop for independent ChatGPT review; no self-acceptance or phase transition | S0-A | Owner instruction in the Claude Code session, 2026-11-16 |
| 2026-11-16 | OD-20261116-10B | (ID assigned by Claude for traceability.) S0-B1 only: plan first, then the reviewed revisions, then apply the reviewed candidate workflow (SHA-256 `82458e9c…`) as a workflow-only commit, run CI, report and stop | S0-B1 | Owner instructions in the Claude Code session, 2026-11-16 (`CLAUDE_TASK_S0B_B1_NEXT_STEP.md`, `CLAUDE_B1_REVISION_REQUEST.md`, `CLAUDE_S0_B1_APPLY_TASK.md`) |
| 2026-11-16 | OD-20261116-11 | Accept S0 v3.3 with amendments: B3/B4/B7 no longer wait for B2; B2/B5/B6 stay in the device/signing lane. Authorize B3, then B4 (after B3 `REVIEW_PASS`), then B7. S1 exceptions accepted in principle only for G0.7 (iQOO) and G0.8 (legacy licences). No waiver for G0.1–G0.6 or uncontrolled P0. G0.6 `FAIL` leads to a separate remediation proposal. G0.4 source is `MASTER_SPEC_VI.md` §§0–17. Commit v3.3, the spec copy, the source register and the protocol sentence. R7 interim containment recorded | S0-B3/B4/B7; S0 transition rules | `docs/roadmap/S0_V3_3_OWNER_DECISION_AND_AMENDMENTS.md`, confirmed by the owner in the Claude Code session on 2026-11-16 |
| 2026-11-16 | OD-20261116-08 | Canonical roadmap is `PENDING_OWNER_APPROVAL` until approved and committed; the currently available proposal is identified only as a pending proposal | This handoff, protocol, legacy index | Same document, "Additional source-of-truth correction" |

### 2026-11-17 — S0-B4-TESTS-ONLY-CI

- Owner authorization: OD-20261117-12 — owner explicitly approved a separate B4 tests-only workflow; it must not build an APK and must not modify the existing Android APK workflow.
- Base HEAD: `ccf08135ed5b64ac66802ab2f5420312d81660d2`.
- Workflow commit: `f396258b22fb668af0c3abf2c42dfc582699a06d`.
- Changed file: `.github/workflows/b4-tests-only.yml` only.
- Workflow behavior: branch-scoped push trigger with path filters and manual `workflow_dispatch`; Node.js 22; `npm ci`; `npm run test:fast`.
- Explicitly excluded: `npm run build`, asset generation, Capacitor sync, Gradle, `assembleDebug`, signing, APK packaging, and artifact upload.
- Existing `.github/workflows/android-apk.yml` was re-fetched and its blob SHA remained `7a2639057272d2629f2d6b89cfc8fb07682dad31`; it was not modified.
- Commit message includes `[skip ci]` so the existing broad push-triggered APK workflow is not started by this workflow-addition commit. GitHub documents that skip directives affect push/pull_request events only; they do not suppress a manually dispatched workflow.
- Validation status: workflow source re-fetched and inspected. Tests have NOT run yet. The GitHub connector available in this session exposes workflow-run reads/re-runs but no workflow-dispatch write action. Because the new file is on the repository's sole/default branch, the owner can start it from Actions → S0-B4 Tests Only → Run workflow, selecting `claude/game-historical-sandbox-modes-kg7rj7`. This is the remaining execution step; do not claim Vitest PASS until its run log confirms success.
- B4 remains `READY_FOR_REVIEW`; project Vitest evidence, Claude independent review, and owner acceptance remain pending. B7 remains `NOT_STARTED`.

## 8. Update rules

- Claude updates status and implementation evidence after each approved task.
- ChatGPT appends independent review findings after checking GitHub.
- The owner-decision section changes only after an explicit owner decision.
- Preserve the work log; append rather than overwrite.
- If HEAD changes during review, report the new SHA and re-review that exact commit.
- A handoff update never substitutes for source code, logs, tests, or artifacts.
- A commit cannot record its own SHA. A commit that updates this file is identified by GitHub commit metadata (`git log -- docs/coordination/AI_HANDOFF.md`); the next update records it explicitly.
