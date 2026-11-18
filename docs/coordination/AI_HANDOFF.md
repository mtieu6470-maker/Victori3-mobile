# AI Handoff — Victori3-mobile

> Shared status index for Claude Code, ChatGPT, and the project owner. Never put secrets or personal data here.

## 1. Current project state

| Field | Value |
|---|---|
| Repository | `mtieu6470-maker/Victori3-mobile` |
| Development branch observed | `claude/game-historical-sandbox-modes-kg7rj7` — the sole branch and the default branch (observed 2026-11-16) |
| Last independently observed baseline | `2240a8fb865e0021eec2f2f4f1c6803528be9e2c` (code baseline; later commits listed below are documentation-only) |
| Coordination setup commit | `bd5787f3e1763170ec7e5ad448466a5cc57c2b40` |
| Coordination correction commit | `6c4d02a36a30f7e82d973da59f569b379f85468d` |
| Handoff update commit | Identified by GitHub commit metadata: the commit that introduced this revision of this file (`git log -1 -- docs/coordination/AI_HANDOFF.md`). Not written here, because a commit cannot contain its own SHA |
| Canonical roadmap | `OWNER_APPROVED` (2026-11-16, OD-20261116-09): `docs/roadmap/DECISIONS_AND_S0_REVISED_VI.v3.2.md` with `docs/roadmap/SOURCE_REGISTER.v3.2.md`, committed verbatim in `574ddc7ac57267ecae2216cb9ee1d490f3b41626`. SHA-256 verified before and after commit: `208a08ef46f7623d6ebbec02765fc1c70cbfcee09af7b4555aa8f7fb85f7b3e8` / `1adc4fedb4311383723631fbe16ceaa92b54344223bda0f93ee2d8c8e06737a2`. The file's own header still says "S0 vẫn chờ phê duyệt" because it is the verbatim pre-approval text; the approval is recorded here |
| S0 v3.3 amendment | `OWNER_APPROVED` with amendments (2026-11-16, OD-20261116-11): `docs/roadmap/S0_V3_3_GATE_RESTRUCTURE_PROPOSAL.md` (SHA-256 `929c06f4b993a6c395d3633bcb8b207554c833d023debe073cb5252f51929cf5`) as amended by `docs/roadmap/S0_V3_3_OWNER_DECISION_AND_AMENDMENTS.md` (SHA-256 `582a8a4e3f0275f5b88debf8b90967c84c077684c104540fc6a5e961847267b6`); sources in `docs/roadmap/SOURCE_REGISTER.v3.3.md`. v3.2 stays canonical except the clauses v3.3 replaces. Both files are verbatim, so their headers still carry draft wording |
| G0.4 requirement source | `docs/spec/MASTER_SPEC_VI.md` — byte-for-byte copy, SHA-256 `d7fa8995dee96046da79d23dd16b2c56c2e0acd0330b28e05d8a0a3ff6afc2f8`, 50 355 bytes, 753 lines; normative §§0–17 (OD-20261116-11 §4) |
| Gate verdict vocabulary | Protocol "Status vocabulary" (`PASS`, `PARTIAL`, `BLOCKED`, `FAIL`, `NOT_TESTED`, `NOT_APPLICABLE`); where the approved S0 document writes "NOT TESTED" it means `NOT_TESTED` |
| Legacy roadmaps and pre-protocol work | `docs/roadmap/LEGACY_DOCUMENTS_INDEX.md` (historical evidence, not authorization) |
| Current approved phase | **S0-B3 → S0-B4 → S0-B7, sequential** (OD-20261116-11). B4 starts only after B3 has `REVIEW_PASS` |
| Current task status | S0-B3 `REVIEW_PASS` (bounded audit scope; owner decision still pending). S0-B4 `IN_PROGRESS`: the frozen-baseline harness and tests-only workflow are prepared on `experiment/vic3-visual-upgrade`; execution remains `NOT_TESTED` pending a manual GitHub Actions dispatch and review. S0-A `READY_FOR_REVIEW` (A1–A4 conditionally accepted; A5 `BLOCKED`); S0-A is not `ACCEPTED`. S0-B1 reviewer technical verdict `PASS` under v3.3 §2.1. `COORDINATION-REVIEW-BD5787F` `READY_FOR_REVIEW` |
| S0-B3 evidence | `docs/audit/s0/S0_B3_RESULTS.md` (summary, gate self-assessment, finding index) with `S0_TEST_CATALOG.md`, `s0_test_catalog.json`, `S0_REQUIREMENT_MATRIX.csv`, `S0_GLOBAL_DATA_AUDIT.md`, `S0_ASSET_AUDIT.md`, `S0_PERFORMANCE_BASELINE.md/.json`, `b3/**` — tools commit `3d63061e4bd5b3fdf7c636370da462a5b0f5d721`, reports commit `55331c2bf629bb631701ec82020c7f9deaa7da81`; review-1 corrections: tools `ddea490`, reports and evidence `2c62b3d` (`b3/review1/**`; summary in `S0_B3_RESULTS.md` §8) |
| S0-B4 evidence | `docs/audit/s0/S0_B4_TEST_PLAN.md`; `tests/s0-save-determinism.test.ts` (12 test instances: 4 replay cases, canonical comparator contract, invalid/legacy save cases incl. missing/wrong-type RNG); `tests/fixtures/s0-b4-scenario.ts`; `.github/workflows/s0-b4-tests.yml` (manual, tests-only, exact baseline `2240a8f`). Test asserts all 10 monthly systems run 24 times, each player command at its tick, equal checkpoint hashes, native save envelope metadata, legacy `marketStats` continuation, and emits hashes/first-difference path before equality assertions. Older `b4-tests-only.yml` supplementary run `44041104723` passed 70/70; not designated pinned-baseline evidence. New workflow still needs manual dispatch and artifact review; G0.6 remains `NOT_TESTED` |
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
| S0-B4 — Characterization tests and fixtures (save/load determinism, v3.2 §6.7) | `IN_PROGRESS` (audit-only harness prepared; manual workflow execution and independent evidence review pending) | B3 `REVIEW_PASS` | G0.6 verdict with evidence; `FAIL` leads to the decision §3 path |
| S0-B7 — Risk register and signoff package | `NOT_STARTED` (authorized after B4) | B3 and B4 done | `S0_SIGNOFF.md`; G0.1–G0.9 ledger; exception requests limited to G0.7 (iQOO) and G0.8 (legacy licences) |
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

### 2026-11-18 — B4-DUAL-FINAL-STATE-HASH-DIAGNOSTICS

- Commit `d6612b3ec91c2c92db8c448652af8cc0c79e6da3` changes the structured replay log to emit both `continuousFinalStateSha256` and `resumedFinalStateSha256`, plus `finalStatesMatch`.
- This closes a §6.7 evidence gap: if the branches diverge, the artifact now retains both final hashes and the first differing state path before assertions fail.
- Updated B4 test plan. Test execution remains pending the manual pinned-baseline workflow; G0.6 remains `NOT_TESTED`.


### 2026-11-18 — B4-FAILURE-PATH-DIAGNOSTICS

- Commit `cadee9c33c356ed6cb2fa7a39d3eade5f700102a` moves the structured `[S0-B4]` evidence log before final equality assertions. A failed replay therefore still emits save/checkpoint/initial/final hashes, command counts, simulation system counts, non-vacuous flags and the first differing GameState path.
- `firstDifference` now checks own properties rather than the `in` operator, so missing fields are not mistaken for inherited Object prototype members.
- Canonical comparator tests now also prove a missing nested field is reported with its path.
- Updated B4 test plan. No product code/data/assets changed.
- Execution remains pending the manual pinned-baseline workflow dispatch; no test pass is claimed. G0.6 remains `NOT_TESTED`.


### 2026-11-18 — B4-CANONICAL-ORDER-AND-SAVE-ENVELOPE-ASSERTIONS

- Commit `3999783e6e3a3efac4d5e0f065da9447e8dd969d` replaces locale-sensitive `localeCompare` object-key sorting with deterministic code-unit ordering (`a < b ? -1 : a > b ? 1 : 0`).
- The replay test now parses the native save envelope and asserts `format === SAVE_FORMAT`, envelope version equals the GameState version, `savedAt` equals the in-game YYYY-MM checkpoint date, and envelope state hash equals the pre-serialization checkpoint state hash.
- Test plan updated to record these checks and remove a stale statement that described an older audit head as latest.
- All changes remain audit test/documentation only. The pinned-baseline workflow has still not been manually dispatched; G0.6 remains `NOT_TESTED`.


### 2026-11-18 — B4-CANONICAL-CHECKPOINT-COMPARISON

- Commit `712cd44f415212d770b130c501797e12d7cd5bc1`: after each save/load checkpoint, test hashes the deserialized `GameState` with object keys canonicalized and asserts it equals the pre-save checkpoint hash. Removed raw `serialize(restored) === serialize(uninterrupted)` assertion because byte-for-byte JSON string equality overconstrains object-key insertion order and compares the save envelope, while §6.7 requires normalized `GameState` comparison.
- Commit `b65e0b10d872f835884d42afacde272910da83ca`: added a direct comparator contract test proving object-key insertion order is ignored and array order remains significant (including first-difference path).
- Plan updated in `docs/audit/s0/S0_B4_TEST_PLAN.md`. The harness still hashes the complete JSON-persisted state and retains exact save SHA-256 as supplementary provenance.
- Test/typecheck execution: not performed; container network is unavailable and the required GitHub workflow has not yet been manually dispatched. No claim of passing test execution. G0.6 remains `NOT_TESTED`.


### 2026-11-18 — B4-COMMAND-REPLAY-AND-LEGACY-CONTINUATION-GUARDS

- Commit `aef0e29043ceaaa193bcf523c223560f7b3f4e83`: command helper now returns the number of commands applied and asserts each tax/budget command immediately after execution at its scheduled tick. The test validates every command tick lies inside the 24-month run and reconciles command counts across continuous and split-before/after-save paths.
- Same commit adds one-month continuation check for a legacy save with absent `marketStats`; the baseline must default it to `{}`, avoid inventing `constructionQueue`, and complete the next month without throwing.
- Commit `ffd85bcb7938001b1f213f175338fda6725bdd6e`: Actions log now emits uninterrupted/split command counts, number of monthly systems, runs per system and non-vacuous change flags (player economy, population, world prices, RNG), alongside state/save hashes and first differing path.
- All changes are confined to `tests/s0-save-determinism.test.ts` and the B4 audit plan. No product code changed.
- The strengthened harness is still awaiting the designated manual pinned-baseline workflow run. G0.6 remains `NOT_TESTED`.


### 2026-11-18 — B4-NON-VACUOUS-GUARD-REVIEW

- Independent test-harness review found the prior guard `finalStateHash !== initialStateHash` could pass from tick/date changes alone, which is weaker than v3.2 §6.7's non-vacuous requirement.
- Updated B4 test in commits `732e1832bc681baee2c9d51659960bdf419005e5` and `7b695602fac380f827fbf55843776cb070894703`.
- New guards: both paths have identical initial-state hashes; checkpoint dates are checked exactly (K=6 → 1836-07; K=12 → 1837-01); player country is alive; all 10 baseline simulation systems are present and each ran exactly 24 times; at least one non-clock simulation value changed across player economy, region population, world prices or RNG; final player tax and budget values prove the scripted commands applied.
- Added direct import of baseline `SYSTEMS` to ensure the system-run counter set is complete, not merely nonempty.
- Test plan updated to describe the stronger guards. These changes are audit tests/docs only; product files unchanged.
- The strengthened test has not yet run on the designated pinned-baseline workflow. Do not infer execution success from static review; G0.6 remains `NOT_TESTED`.


### 2026-11-18 — B4-EXPERIMENT-BRANCH-ISOLATION-AUDIT

- At source-review checkpoint `662bd830b150302b008b75119b46c213f417c17a`, comparison with frozen baseline `2240a8fb865e0021eec2f2f4f1c6803528be9e2c` showed 71 commits ahead, 0 behind. The latest audit head after two documentation-only commits is `a1fb9b108ee56de7f191f23f57648268fe72f31b` (73 ahead, 0 behind).
- The full branch delta includes pre-existing Android/Capacitor configuration, historical data, engine, UI and test changes, as well as the S0 audit package. These are inherited experiment-branch contents, not modifications in the B4 characterization commits.
- Independently fetched the nine B4 commits in the recent work slice; each changes only one audit/test file: the dedicated B4 test, test plan or handoff. No commit in this slice modifies product source, shipped data, assets, Gradle or gameplay.
- The dedicated `.github/workflows/s0-b4-tests.yml` isolates the test: exact frozen baseline checkout plus overlay of only the B4 test file and fixture. It does not execute the current experiment branch's engine/UI/Android product delta.
- Consequence: a future PASS is strictly a baseline characterization verdict for `2240a8f`, not a regression/build verdict for the complete experiment branch and not approval to merge that branch.
- B4 plan updated with this limitation. No product files changed.


### 2026-11-18 — B4-MALFORMED-RNG-COMPATIBILITY-CHARACTERIZATION

- Test update: commit `7562cb2aa493704c3a2687633360701dc1168a75` adds explicit `[S0-B4_COMPAT]` evidence lines for both a missing RNG field and a wrong-type RNG value (string instead of a four-number tuple).
- Both cases capture the current baseline behavior: `deserialize` accepts the state; simulation continuation throws `TypeError`.
- Updated test plan to distinguish these §6.7 step 8 compatibility characterizations from a determinism mismatch. They are baseline robustness findings, not automatic G0.6 FAIL; no product-code change is permitted in S0.
- Test execution: not yet performed on the designated pinned-baseline workflow; the latest source needs that CI run and artifact review. G0.6 remains `NOT_TESTED`.
- Scope: tests and audit documentation only; gameplay, engine, RNG implementation, serializer, schema, data and assets unchanged.



### 2026-11-18 — REVIEW-SUPPLEMENTARY-B4-WORKFLOW-RUNS

- Task/phase: S0-B4 evidence review; no product-code change
- Screenshot workflow: older `.github/workflows/b4-tests-only.yml` ("S0-B4 Tests Only"), not the designated pinned-baseline `.github/workflows/s0-b4-tests.yml`
- Run `44039619132` (job `133890749856`): `FAILURE`; Vitest could not collect 6 files because `src/generated/db.json` was missing. That workflow revision had no `prepare-assets` step.
- Run `44041104723` (job `133895641421`): `SUCCESS`; 6 test files / 70 tests passed after `npm run prepare-assets`. The four replay cases (Historical/Sandbox × K=6/12, N=24) reported `MATCH`, with matching complete-state hashes and no first-difference path. Scenario used seed `21`, player `GBR`, and three scripted commands.
- Checked-out commit: `d2ae88e557e9895413462c5b069886bfc606adc7` on `claude/game-historical-sandbox-modes-kg7rj7`. GitHub compare against frozen baseline `2240a8fb865e0021eec2f2f4f1c6803528be9e2c` reports 39 commits ahead / 0 behind; changed paths are workflow, documentation, audit/test tooling and reports, with no product source or shipped data file changes. This makes the run useful supporting evidence.
- Limitation: the older workflow checked out the branch commit directly; it did not independently check out the frozen baseline, did not run `npm run typecheck`, and uploaded no provenance artifact. Do not treat it as the required B4 evidence or set G0.6 to PASS.
- Additional finding: the older characterization asserted that a save missing `rng` is accepted by `deserialize`, then `stepMonth` throws `TypeError`. This is a baseline defect observation, not a fix. Added an explicit corresponding test to the new harness (commit `7221b221f974e972659bb4c43ea11e4974797b38`) and documented it in the plan (commit `131abeddc4e65fe5c83e6c28931266d32769a1d3`).
- Required next step: manually dispatch `.github/workflows/s0-b4-tests.yml` with `experiment/vic3-visual-upgrade` selected; review the artifact containing pinned-baseline provenance, typecheck and dedicated Vitest evidence.
- Gate status: G0.6 `NOT_TESTED`; S0-B4 `IN_PROGRESS`. No gameplay, engine, RNG, save serializer/schema, data or asset change.


### 2026-11-18 — S0-B4-BASELINE-CHARACTERIZATION-HARNESS

- Task/phase: S0-B4 under OD-20261116-11, after bounded B3 `REVIEW_PASS`
- Task branch: `experiment/vic3-visual-upgrade`; frozen product baseline under test: `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`
- Commits:
  - `43618de4f2d104fb7276b93e22880500369576b8` — strengthened `tests/s0-save-determinism.test.ts`
  - `a5650dd42a418bb396d4f4b9048037a1dd156f83` — added `tests/fixtures/s0-b4-scenario.ts`
  - `835bec25e6f2c1227846912d871655bd91c4ef8d` — mirrored tests-only workflow on experiment branch
  - `8834ac18707889af3562b134727be1271caa66cc` — added `docs/audit/s0/S0_B4_TEST_PLAN.md`
  - `d7c29d728689bcab2daac83a7920d4b835823e69` — added tests-only workflow to default branch so GitHub exposes manual dispatch
- Test design: Historical + Sandbox; seed `20261116`; player `GBR`; 24 months; K=6 mid-year and K=12 annual boundary; identical test-supplied tax/budget commands before each matching tick. Compare every persisted `GameState` field, including seed/RNG; object keys canonicalized; arrays not reordered; first differing state path and SHA-256 hashes logged.
- Invalid/legacy save characterization: malformed JSON, foreign format, unsupported version, missing state, absent `marketStats` default, and confirmation that baseline `2240a8f` predates `constructionQueue` and does not create it.
- Workflow: `.github/workflows/s0-b4-tests.yml`, `workflow_dispatch` only, `contents: read`, exact baseline checkout, overlays only the audit test and fixture, runs `npm ci`, `npm run prepare-assets`, `npm run typecheck` and one Vitest file. No Vite production build, Capacitor sync, Gradle, Android SDK or APK assembly.
- CI safety: the existing `.github/workflows/android-apk.yml` runs on pushes to all branches. All commits in this harness slice include `[skip ci]` so they do not trigger push workflows. The new B4 workflow still needs a manual run from Actions with `experiment/vic3-visual-upgrade` selected.
- Test results / exit codes / artifact: **NOT RUN**; no GitHub Actions dispatch capability is available from this session. There is no run ID or artifact yet. G0.6 remains `NOT_TESTED`.
- Product-source changes: none. No gameplay, engine, RNG, save serializer/schema, data or shipped asset changes.
- Claude status: `IN_PROGRESS` (harness prepared, execution pending)
- ChatGPT review: pending exact CI artifact and result review
- Owner decision: pending

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
- ChatGPT review: **REVIEW_PASS** (independent review of `ddea490635c5d7c74ca6108549fd21806102487b` and `2c62b3de3955e3cd8a82a9c59401d9df77d69173`, 2026-11-16). Points A–D from round 1 are adequately corrected; the revised classification and method coverage are explicit; 12 analysis groups vs 13 spec regions are disclosed; P0 R7 remains open and correctly distinguished from new B3 findings; war-duration probe resolves the 145/144 counting convention. B3 is accepted for its bounded audit scope only. G0.3/G0.4/G0.5 remain audit verdicts, not product completeness; G0.7 BLOCKED and G0.8 PARTIAL remain unchanged. B4 may proceed under OD-20261116-11. No gameplay/product acceptance implied.
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

## 8. Update rules

- Claude updates status and implementation evidence after each approved task.
- ChatGPT appends independent review findings after checking GitHub.
- The owner-decision section changes only after an explicit owner decision.
- Preserve the work log; append rather than overwrite.
- If HEAD changes during review, report the new SHA and re-review that exact commit.
- A handoff update never substitutes for source code, logs, tests, or artifacts.
- A commit cannot record its own SHA. A commit that updates this file is identified by GitHub commit metadata (`git log -- docs/coordination/AI_HANDOFF.md`); the next update records it explicitly.
