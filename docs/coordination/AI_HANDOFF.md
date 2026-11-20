# AI Handoff — Victori3-mobile

> Shared status index for Claude Code, ChatGPT, and the project owner. Never put secrets or personal data here.

## 1. Current project state

| Field | Value |
|---|---|
| Repository | `mtieu6470-maker/Victori3-mobile` |
| Default / coordination branch | `claude/game-historical-sandbox-modes-kg7rj7` (default branch) |
| Experiment branch | `experiment/vic3-visual-upgrade` (active S0 audit/feature-development branch; recheck live refs before each task) |
| Frozen S0 product baseline | `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`. The experiment branch contains pre-existing product deltas from earlier work; S0 reports are scoped to the frozen baseline and do not certify or authorize merging those deltas. |
| Coordination setup commit | `bd5787f3e1763170ec7e5ad448466a5cc57c2b40` |
| Coordination correction commit | `6c4d02a36a30f7e82d973da59f569b379f85468d` |
| Handoff update commit | Identified by GitHub commit metadata: the commit that introduced this revision of this file (`git log -1 -- docs/coordination/AI_HANDOFF.md`). Not written here, because a commit cannot contain its own SHA |
| Canonical roadmap | `OWNER_APPROVED` (2026-11-16, OD-20261116-09): `docs/roadmap/DECISIONS_AND_S0_REVISED_VI.v3.2.md` with `docs/roadmap/SOURCE_REGISTER.v3.2.md`, committed verbatim in `574ddc7ac57267ecae2216cb9ee1d490f3b41626`. SHA-256 verified before and after commit: `208a08ef46f7623d6ebbec02765fc1c70cbfcee09af7b4555aa8f7fb85f7b3e8` / `1adc4fedb4311383723631fbe16ceaa92b54344223bda0f93ee2d8c8e06737a2`. The file's own header still says "S0 vẫn chờ phê duyệt" because it is the verbatim pre-approval text; the approval is recorded here |
| S0 v3.3 amendment | `OWNER_APPROVED` with amendments (2026-11-16, OD-20261116-11): `docs/roadmap/S0_V3_3_GATE_RESTRUCTURE_PROPOSAL.md` (SHA-256 `929c06f4b993a6c395d3633bcb8b207554c833d023debe073cb5252f51929cf5`) as amended by `docs/roadmap/S0_V3_3_OWNER_DECISION_AND_AMENDMENTS.md` (SHA-256 `582a8a4e3f0275f5b88debf8b90967c84c077684c104540fc6a5e961847267b6`); sources in `docs/roadmap/SOURCE_REGISTER.v3.3.md`. v3.2 stays canonical except the clauses v3.3 replaces. Both files are verbatim, so their headers still carry draft wording |
| G0.4 requirement source | `docs/spec/MASTER_SPEC_VI.md` — byte-for-byte copy, SHA-256 `d7fa8995dee96046da79d23dd16b2c56c2e0acd0330b28e05d8a0a3ff6afc2f8`, 50 355 bytes, 753 lines; normative §§0–17 (OD-20261116-11 §4) |
| Gate verdict vocabulary | Protocol "Status vocabulary" (`PASS`, `PARTIAL`, `BLOCKED`, `FAIL`, `NOT_TESTED`, `NOT_APPLICABLE`); where the approved S0 document writes "NOT TESTED" it means `NOT_TESTED` |
| Legacy roadmaps and pre-protocol work | `docs/roadmap/LEGACY_DOCUMENTS_INDEX.md` (historical evidence, not authorization) |
| Current approved phase | **S0-B3 → S0-B4 → S0-B7, sequential** (OD-20261116-11). B3 and B4 have bounded `REVIEW_PASS`; S0-B7 is current and remains subject to independent review and owner signoff. |
| Current task status | S0-B3 `REVIEW_PASS` (bounded audit scope). S0-B4 `REVIEW_PASS` for G0.6 under v3.2 §6.7, based on run 44325257261 and baseline-equivalence comparison. S0-B7 `IN_PROGRESS`: dependency workflow run 44572915201 / artifact 14555141888 inspected; DEP-F1 remains `OPEN P1 — AUDIT COMPLETE; REMEDIATION / OWNER DISPOSITION PENDING`. CI-F4 closed narrowly by run 44573351798 / commit b5948f0. Android run #322 (`44661820747`) succeeded on exact checkout SHA `68fee31641d2249be824a87f4302c26a5aeb6611`: 38/38 suites, 97/97 tests, Gradle BUILD SUCCESSFUL; APK/evidence ZIPs and APK SHA-256 independently recomputed. Subsequent report commits are docs-only; no Actions run exists for the current docs-only HEAD. No device QA/release signing. B4 Run #3 raw npm-ci log now verified: 221 packages audited and 10 vulnerabilities (3M/5H/2C); B7 lockfile-only audit reports six vulnerable package entries (3M/1H/2C); same lockfile blob, but distinct command/report contexts and no B4 JSON, so exact difference remains UNRECONCILED. Owner has paused Claude; ChatGPT self-audit is not an independent REVIEW_PASS. B7 review and owner decision remain pending. Full-S0 G0.9 BLOCKED; bounded S1-entry NOT_TESTED. Formal S1 transition/review acceptance remains unrecorded; the later task-specific owner implementation override is documented below. Structural self-check: 22/22 P2 rows have six cells; 48 traceability mappings resolve (including the G0.7 device-evidence gate row); DEP-F1 mapping refreshed. |
| S0-B3 evidence | `docs/audit/s0/S0_B3_RESULTS.md` (summary, gate self-assessment, finding index) with `S0_TEST_CATALOG.md`, `s0_test_catalog.json`, `S0_REQUIREMENT_MATRIX.csv`, `S0_GLOBAL_DATA_AUDIT.md`, `S0_ASSET_AUDIT.md`, `S0_PERFORMANCE_BASELINE.md/.json`, `b3/**` — tools commit `3d63061e4bd5b3fdf7c636370da462a5b0f5d721`, reports commit `55331c2bf629bb631701ec82020c7f9deaa7da81`; review-1 corrections: tools `ddea490`, reports and evidence `2c62b3d` (`b3/review1/**`; summary in `S0_B3_RESULTS.md` §8) |
| S0-B4 evidence | docs/audit/s0/S0_B4_RUN_3_REVIEW.md; docs/audit/s0/S0_B4_TEST_PLAN.md; run 44325257261, job 134874698600, executed test file SHA 722d62c0647f06bc2e3a49bdef1f348f4f3104f2, checkout commit 7f17b1f0177d712366e31e4e8c879cc4b6dd5741. 6 files / 70 tests passed; four Historical/Sandbox × K=6/12 replay cases MATCH, hashes equal, first difference null. Product tree and data/build inputs compare equal to baseline 2240a8f. No artifact upload/typecheck in that older workflow; the expanded experiment-branch test file and s0-b4-tests.yml have not been run. G0.6 PASS; bounded B4 REVIEW_PASS |
| S0-B1 evidence | `docs/audit/s0/S0_B1_CI_EVIDENCE.md`, `docs/audit/s0/logs/b1/` (commit `e13d964f343ab1ba01fb705fbbd8bcac2674ea80`). B1 commit `382aaa84b2336854b4dbebfcdc719847ff463f41`; run `43834719406`, job `133188390842` success; 58/58 tests; `report_valid=true`; APK file SHA-256 `314c8ca11c1d747550bbdb982326675e5f9dbdac870f3fc1cf04b9de7c22585c`; artifact ZIP SHA-256 `7717a2b79dd46fbf613845e33bac3a17634eae5b0c808328d8b21b5abc150ba0` (a different file) |
| S0-A evidence | `docs/audit/s0/S0_A_RESULTS.md` (summary and gate verdicts), `S0_REPOSITORY_SNAPSHOT.md`, `S0_BUILD_TEST_REPORT.md`, `logs/`, `a4/`, `inputs/` — commits `7d6eec9d0601a7d983679ec7792b1aa96b954ca0`, `d5b9820aae9a96d57e9486845c164ae591fa69de`, `8073fac029463c0685435985a2968cd5a3aba4ab` |
| Pending owner action | Device steps 1–4 of approved document §6.5.1 on the installed baseline APK (listed in `docs/audit/s0/S0_A_RESULTS.md` §2); never paste secrets |
| S0 execution authorized | S0-A done (awaiting review). S0-B1 done. **S0-B3, then B4, then B7** authorized by OD-20261116-11 (B4 only after B3 `REVIEW_PASS`). **NOT AUTHORIZED:** B2/C3, B5, B6, the G0.6 remediation task, S1 and every later phase |
| Gameplay/engine/save changes authorized | YES — task-specific owner override dated 2026-11-20; first slice ECONOMY-INVENTORY-LEDGER-01 on the experiment branch. This does not change S0 gate verdicts or claim independent REVIEW_PASS/ACCEPTED. |
| Signing/keystore/Secrets changes authorized | NO |

The SHA values above are historical observations. Re-check GitHub HEAD before every task.

## Governance/source reconciliation — 2026-11-20

- The task-specific owner handoff supplied for this session explicitly designates `experiment/vic3-visual-upgrade` as the working branch and `claude/game-historical-sandbox-modes-kg7rj7` as the default/coordination branch. Work for this S0-B7 task is therefore confined to the experiment branch; the default branch was read but not modified.
- Required `AI_START_HERE.md` and `SESSION_RECOVERY_PROTOCOL_VI.md`, plus `OWNER_PRODUCT_ENGINEERING_PRINCIPLES_VI.md`, are absent from the experiment branch and were read from the default branch. Do not copy them across branches without an explicit reason/authorization.
- The experiment-branch `AI_COLLABORATION_PROTOCOL.md` blob `5453f89b86f54a1b1c3adbdbdeae7f598ed32f8e` is the 2026-11-16 revision and still labels Claude as implementer / ChatGPT as reviewer. The default-branch revision `7b61ef2f5008a2f6818de01aeb5ab0e4df991cc5` (2026-11-17) reflects the later owner-directed allocation: ChatGPT is technical lead/authorized implementer; Claude is independent no-write reviewer. Use the later role allocation for this task; ChatGPT's work/self-audit is not an independent REVIEW_PASS.
- The default-branch protocol's branch-policy paragraph still describes a sole default branch and says the roadmap is pending owner approval. Those statements conflict with the task-specific owner instruction/current handoff (an explicit experiment branch is active) and the recorded owner-approved v3.2/v3.3 decisions in this handoff/source register. Do not silently rewrite the default branch; this discrepancy is disclosed for future governance reconciliation. For this task, follow the explicit owner-designated experiment branch and the recorded OD-20261116-09 / OD-20261116-11 scope.
- The default-branch `AI_HANDOFF.md` currently tracks a separate DEV-005/research workstream and must not be substituted for this experiment branch's S0-B7 status. Preserve the two branch histories; re-check both live refs before future work.


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
| S0-B3 — Audit scripts, catalog, coverage, crosswalk, asset inventory, Node/desktop harness | `REVIEW_PASS` (bounded B3 audit scope; ChatGPT independent re-review of `ddea490635c5d7c74ca6108549fd21806102487b` and `2c62b3de3955e3cd8a82a9c59401d9df77d69173`, 2026-11-16) | OD-20261116-11 — met | Reports committed (`3d63061`, `55331c2`; corrections `ddea490`, `2c62b3d`); B4 was eligible to proceed after this bounded verdict; no product-completeness or owner acceptance implied |
| S0-B4 — Characterization tests and fixtures (save/load determinism, v3.2 §6.7) | `REVIEW_PASS` (bounded to frozen-baseline G0.6 evidence in run 44325257261) | B3 `REVIEW_PASS` | Four replay cases MATCH; exact scope and limitations in S0_B4_RUN_3_REVIEW.md |
| S0-B7 — Risk register and signoff package | `IN_PROGRESS` (dependency audit run 44572915201/artifact 14555141888 reviewed; DEP-F1 OPEN P1 pending remediation/owner disposition; CI-F4 narrowly CLOSED by Android run 44573351798; B7 review package refreshed; Claude independent review and owner decision pending) | B3 and B4 `REVIEW_PASS` | S0_RISK_REGISTER.md; S0_B7_RISK_TRACEABILITY.md; S0_B7_REVIEW_PACKAGE_MANIFEST.md; S0_DEPENDENCY_AUDIT_PLAN.md; .github/workflows/s0-b7-dependency-audit.yml; S0_B7_SELF_REVIEW.md; CLAUDE_S0_B7_REVIEW_REQUEST.md; CLAUDE_S0_B7_REVIEW_REPORT_TEMPLATE.md; S0_SIGNOFF.md; S0_B7_RESULTS.md; bounded G0.7/G0.8 exception requests |
| S0-B2 / B5 / B6 — signing, Diagnostic UI, instrumented measurements | `BLOCKED` / deferred | R14 proven on the baseline APK, O5 decided, protected `development-signing` Environment configured by the owner | Per v3.2 §4.1, §6.8 |
| S1 — Data architecture and save foundation | `NOT_STARTED` | S0 accepted and S1 scope separately approved | S1 acceptance criteria met; independent review; owner accepted |
| S2+ | `NOT_STARTED` | Previous phase accepted and next scope approved | Phase-specific acceptance and owner approval |

Detailed phase scope comes from the canonical roadmap (section 1), within the limits of explicit owner authorizations. This table is not a substitute for that roadmap.

Pre-protocol work:

| Work | Classification | Register | Note |
|---|---|---|---|
| Earlier stages 1–5 (identity/content, numbering of an earlier specification) | `PRE_PROTOCOL_IMPLEMENTED_REPORTED` | `docs/roadmap/LEGACY_DOCUMENTS_INDEX.md` | Not `REVIEW_PASS` or `ACCEPTED`; part of the current baseline; S0 verifies what is present at the frozen SHA |

## 5. Work log

### 2026-11-20 — B7-SOURCE-SEVERITY-AND-ROW-SCHEMA-CHECK

- Cross-checked R1–R14 against the v3.2 risk table; RM/WD against `S0_B3_RESULTS.md`; TC against `S0_TEST_CATALOG.md`; GD against `S0_GLOBAL_DATA_AUDIT.md`; AS against `S0_ASSET_AUDIT.md`; CI/DEP against B7 risk evidence.
- No severity mismatch. R3 is mapped to Closed; R7 is P0; G0.7 is a BLOCKED gate row, not a P-severity. CI-F1–F3 are P2, CI-F4/DEP-F1 P1.
- Structural parser: 48 unique mapping rows; all 48 resolve; 22 P2 rows have six cells; P0/P1/P2 tables use six cells, P3/Closed use three; no blank cells detected.
- Corrected an obsolete B3 report author-status sentence that contradicted the now-recorded independent verdict in the Review row and §9. The original Claude self-assessment remains distinguished from ChatGPT's historical independent `REVIEW_PASS`.
- Documentation/source consistency only. No product/runtime/test/data/assets/dependency/workflow/save/Gradle/signing changes; no build or device test at this HEAD.

### 2026-11-20 — B3-PHASE-STATUS-RECONCILIATION

- Cross-checked the current Phase Register against the historical review evidence in this handoff and `S0_B3_RESULTS.md`.
- Found a stale row: the current summary and B4 dependency already recorded B3 `REVIEW_PASS`, while Phase Register still said `READY_FOR_REVIEW` (Claude round 2, unverified).
- Verified the exact historical bounded review: ChatGPT independently reviewed Claude's B3 corrections at tools commit `ddea490635c5d7c74ca6108549fd21806102487b` and report/evidence commit `2c62b3de3955e3cd8a82a9c59401d9df77d69173`, returned `REVIEW_PASS` on 2026-11-16 for B3 audit scope only. The original round-1 `CHANGES_REQUESTED` and old READY_FOR_REVIEW checkpoint remain in history.
- Updated the current Phase Register and B3 report summary. This does not change any gate verdict, accept S0, replace current Claude's independent B7 review, or authorize S1.
- Read-only source/status consistency check only. No product source, tests, data, assets, dependency, workflow, save, Gradle, signing or APK changes; no runtime test/build/device QA performed.

### 2026-11-20 — B7-TRACEABILITY-AND-SIGNOFF-STRUCTURE-CHECK

- Revalidated current base HEAD `dbf90c077d2ffe5454937cbf4d4a8b84e6222740`. Structural parser found 22 P2 data rows in `S0_RISK_REGISTER.md`, all with six cells, and 48 traceability rows (including the G0.7 device-evidence gate row) without duplicate source IDs; every trace mapping resolved to an exact or explicitly grouped register row.
- Found the DEP-F1 row in `S0_B7_RISK_TRACEABILITY.md` was stale relative to the newly re-inspected B4 log. Updated it to include: 221 packages audited / 10 vulnerabilities from B4 Run #3; identical package-lock blob SHA across baseline/B4/experiment; six vulnerable entries from the later explicit lockfile-only audit; no B4 package-level JSON and exact count/severity difference still UNRECONCILED.
- Aligned `S0_SIGNOFF.md`, `CLAUDE_S0_B7_REVIEW_REPORT_TEMPLATE.md`, reviewer request, self-review and results with the same bounded statement. No gate verdict changed; DEP-F1 remains OPEN P1.
- Validation was GitHub-content structural parsing only; no local Vitest/Gradle run, dependency install, audit fix, gameplay/runtime/data/asset change or device QA. Claude remains paused by owner instruction; this is not independent review or owner signoff.

### 2026-11-20 — B4-NPM-CI-LOG-RECHECK-DEP-F1-BOUNDARY

- Re-fetched B4 Run #3 `44325257261`, job `134874698600`; full log confirms npm-ci install-time audit line: 221 packages audited and 10 vulnerabilities (3 moderate / 5 high / 2 critical). No package-level audit JSON/artifact was uploaded.
- Verified GitHub package-lock blob SHA `29ac661a36bb03bae62a80ce7abf9af0c15bb168` is identical at frozen baseline `2240a8f`, B4 checkout `7f17b1f` and current experiment branch.
- Compared with B7's later explicit `npm audit --package-lock-only --json` artifact: six vulnerable package entries (3 moderate / 1 high / 2 critical), plus zero production-only findings. npm's official v10 docs confirm install-time audit is enabled by default for `npm ci`; standalone audit uses registry advisory data and calculates vulnerability/meta-vulnerability objects. The two procedures are different report contexts, but without the B4 raw JSON the exact 10-vs-6/severity difference remains UNRECONCILED.
- Updated DEP-F1 evidence/interpretation in the risk register, dependency plan, results, self-review and reviewer request. DEP-F1 remains OPEN P1; no lockfile/dependency mutation or remediation.
- Claude remains paused per owner instruction; this is ChatGPT self-audit only, not independent review or signoff.


### 2026-11-20 — RUN-322-ARTIFACT-SELF-AUDIT-AND-HANDOFF-RECONCILIATION

- Re-opened the live branch and governance files before this slice. Base HEAD: `085c05ba52020dc2ee61cce98f168c035268b4c9`; target remains `experiment/vic3-visual-upgrade`. Default branch was read-only and unchanged at `e4182491161e61065e4ac15228c5f59a8832ad1d`.
- Independently recomputed both downloaded run #322 artifact ZIP digests and the embedded APK SHA-256 using local `sha256sum`, Python `zipfile` and `hashlib`; all match GitHub API / CI evidence values. Parsed `test_summary.txt` and `vitest-results.json`: 38/38 suites, 97/97 tests, zero failures, `report_valid=true`.
- Added the bounded result and evidence limitations to `S0_B7_SELF_REVIEW.md`. Corrected the stale current-status row in this handoff to include run #322 and distinguish its exact tested SHA from later documentation-only commits.
- Owner instruction for this session: Claude is temporarily paused. ChatGPT continues only as implementer/self-auditor; no independent reviewer verdict is claimed or substituted. S0-B7 remains IN_PROGRESS and the bounded review remains pending.
- Provenance limitation: run #322 `provenance.txt` says `product_source_state=not asserted by CI`; no baseline source-equivalence or gameplay acceptance is inferred. No local Vitest/Gradle run, APK installation, physical-device QA, release signing or gameplay change.
- Next: continue read-only B7 package consistency/self-audit within the approved audit scope. Do not mark REVIEW_PASS/ACCEPTED, modify product/runtime/save/engine/data/assets, or open S1. A later independent reviewer and explicit owner decision remain required by the standing protocol.


### 2026-11-20 — EXACT-HEAD-ANDROID-RUN-322

- Rechecked live experiment HEAD: `68fee31641d2249be824a87f4302c26a5aeb6611`; run #322 `44661820747` completed SUCCESS on that exact SHA, job `136041609778`.
- Evidence ZIP `14596545236` downloaded/inspected: 38/38 suites, 97/97 tests, 0 failures, `report_valid=true`; Gradle `BUILD SUCCESSFUL`.
- APK ZIP `14596440616` downloaded/inspected; APK 18,057,541 bytes, SHA-256 `eda437afeadad10074d38acf567601c0c43ab3a6e9661ce8145962896fdf3cbb`; debug certificate SHA-256 `559d549a21515f899b6195c65114b2be778ff2fbd63288d21ef31f4365b96238`.
- No physical-device installation/QA. S0-B7 remains IN_PROGRESS pending Claude's independent no-write review and explicit owner decision; DEP-F1 remains OPEN P1; overall S0 PARTIAL/BLOCKED; bounded S1-entry NOT_TESTED; S1 NOT AUTHORIZED.
- Next exact action: Claude independently reviews the refreshed B7 package against the then-live HEAD, then stop for owner decision. No gameplay/runtime work is authorized.


Append newest entries at the top. Do not overwrite earlier entries.

### 2026-11-20 — SUPPLEMENTARY-ANDROID-RUNS-319-321-REVALIDATION

- Recovered three Android Actions runs later than run #318 that were not yet recorded in the handoff: #319 `44576526677` on `8291d7d`, #320 `44576552982` on `b42064b`, and #321 `44576581387` on `c5ba0e8`; all `apk` jobs succeeded.
- Each run independently reports 38/38 suites and 97/97 tests with zero failures; Gradle `BUILD SUCCESSFUL`. Triggering commits changed documentation only (playtest feedback / handoff).
- #321 APK artifact `14557237059` and evidence artifact `14557436781` were downloaded. ZIP digests match API metadata; test report_valid=true; APK 18,057,524 bytes SHA-256 `b12e6860979fcd66e060de0da76e0c9e55c64b265837b108af6a34122237e529`; Android Debug certificate SHA-256 `fb48505473b61038b17c4553d009a4a37e63047e7dee8759a14af74bbaa6197f`. #319/#320 artifact ZIPs are API-metadata-only, not payload-inspected.
- GitHub compare from #321 commit `c5ba0e8` to branch HEAD at this checkpoint `4db9d3d7b397fc59f3310936eecd6792a4ca218f` shows 52 commits touching 12 documentation paths only; no product/runtime source changed after #321. There is no CI run at exact HEAD because subsequent documentation commits used `[skip ci]`.
- This supplements, but does not widen, the run #318 / CI-F4 closure. No gameplay acceptance, device QA, release signing, data-pack verification, independent Claude verdict, overall S0 PASS or S1 authorization is claimed. Runtime tests/build were not executed locally in this documentation-only slice.
- Next exact action remains Claude's independent no-write review of the live B7 package, then the owner's written decision. S1 remains NOT AUTHORIZED.

### 2026-11-20 — P0-CLOCK-PACING-CODE-AUDIT-AND-DESIGN

- Base HEAD for this design slice: `32fac4d5ca30b559308dd3fabd97e126d0d3b841`; design-only commit: `37b95a0f8da1e819c6012ed3f10011c27b33a554`; working branch remains `experiment/vic3-visual-upgrade`.
- Added `docs/spec/SIMULATION_CLOCK_PACING_DESIGN_VI.md` (blob `568b58aaec0d45a61f5279adc25bca7860145882`). It records source-backed findings, nominal speed calculations, lifecycle/save constraints, a staged scheduler architecture, Victoria 3's official tick-task reference, benchmark protocol, acceptance criteria and migration risks.
- Confirmed code findings: current Speed 5 advances one monthly step per RAF callback, hence is refresh/FPS dependent; speeds 1–4 are RAF-gated, and long stalls may discard elapsed accumulator remainder because only one step is processed and the accumulator is clamped. Monthly simulation remains synchronous on the main JS thread.
- Also recorded existing safeguards/limitations: App.tsx auto-pauses on visibilitychange/pagehide and requests autosave; IndexedDB helper resolves on transaction completion, but lifecycle handler does not await that completion before page/process termination. MainActivity has no explicit onPause/onResume bridge; no @capacitor/app dependency appears in package.json. Android lifecycle reliability still requires device evidence.
- Victoria 3 reference: Paradox Dev Diary #76 (2023-02-22) describes a six-hour regular tick and yearly/monthly/weekly/daily task cadences, with task dependencies and separate game/UI/render threads. The document explicitly does not treat this as a wall-clock speed mapping.
- No product/runtime/test/workflow/dependency/save/data/asset/Gradle/signing changes. No runtime test or build was run. The numerical rates in the design are calculations from source constants, not device benchmark results.
- This is a design proposal only; it does not authorize S1 or implementation. S0-B7 independent Claude review and owner acceptance remain pending. The S0-B7 review manifest is intentionally unchanged because this is a separate P0 design-preparation artifact, not part of the B7 review packet.
- Next action: finish the B7 independent review/owner gate. After explicit S1 authorization, run direct Victoria 3 and iQOO baseline measurements before locking speed rates; then obtain approval for CLK-A1 scheduler implementation.



### 2026-11-20 — FINAL-REVIEW-MANIFEST-REFRESH

- Latest B7 review-packet consistency pass corrected DEP-F1 traceability, Claude's report template, the stale reviewer HEAD/audit-status text, the historical CI-F4 wording and the self-review's ambiguous status label.
- Documentation commits: `feedf82d78daaeb460a2c8c539ca924bf839b1ce`, `58d2852d48bd437a6fa6650fdad616a2f3d9971d`, `b338118a005e5ce583cf40987e122bf8d8a00e00`, `bf82b8ab60a1bd07ba1203091586a92b170f4c0d`; AI_HANDOFF `6af270254e2163f46d5a080a9a7b621bd0746540`; next-session handoff `302f3a38c53c6cc3d7c3d09522a336b0123b58b6`; first manifest refresh `8184d70472f6b89388b982dd2a9c0ab644fa6ce0`; risk-traceability correction `fcf6194bc3598818f4444c803746c1111f1fe806`; this handoff follow-up `b9c2780a8178bf45c908cdd6e37a6f4d380b3cfa`; latest manifest identity refresh `46d3ebef31d7ae1a73a7744ceb9c6e8de0bc7979`. The manifest was re-pinned after each handoff/traceability change.
- The latest review manifest remains the source of the exact final blob SHAs. Claude's independent no-write review is still pending; no independent verdict or owner ACCEPTED is claimed.
- Documentation-only; no runtime tests/builds run and no product/workflow/dependency/save/data/asset/Android/signing changes.

### 2026-11-20 — B7-REVIEW-PACKET-CONSISTENCY-REFRESH

- Verified experiment branch HEAD before this slice: `bf82b8ab60a1bd07ba1203091586a92b170f4c0d`. Default branch was inspected read-only; no default-branch writes and no branch merge/rebase.
- A consistency scan found stale review metadata: the risk-traceability matrix still classified DEP-F1 as UNTRIAGED; the Claude report template expected an unrun audit; and the review request pinned an obsolete HEAD and described the dependency workflow as un-dispatched. These were stale after the verified 2026-11-20 audit and APK run #318.
- Corrected the DEP-F1 traceability row to the evidence-backed state `OPEN P1 — AUDIT COMPLETE; REMEDIATION / OWNER DISPOSITION PENDING`, including run/artifact IDs, six dev-only findings, production-only zero and unresolved npm-ci count of ten.
- Updated the Claude review report template to request independent verification of run `44572915201` / artifact `14555141888` and the correct DEP-F1 disposition. Updated the independent-review request to require live HEAD re-fetch, replace the stale pinned SHA, distinguish historical CI-F4 failures from its narrow run-#318 closure, and preserve the B4 workflow-not-rerun boundary.
- Corrected the ChatGPT self-review's stale “provisional P1” descriptor and the ambiguous PASS label for the overall S0/S1 non-transition check.
- Documentation commits in this slice:
  - `feedf82d78daaeb460a2c8c539ca924bf839b1ce` — DEP-F1 traceability.
  - `58d2852d48bd437a6fa6650fdad616a2f3d9971d` — Claude review report template.
  - `b338118a005e5ce583cf40987e122bf8d8a00e00` — Claude review request.
  - `bf82b8ab60a1bd07ba1203091586a92b170f4c0d` — self-review consistency.
- Review status: Claude's independent review has **not** been performed in this ChatGPT session and no independent verdict is claimed. The bounded S1-entry package remains `NOT_TESTED`; owner acceptance remains pending. No issue is open in this repository for the review as of the latest issue search.
- Tests: documentation consistency/read-back only. No runtime tests, product build, APK build, dependency change or workflow dispatch was performed. No product source, gameplay, engine, save schema, data, assets, Gradle, signing, secrets or workflow files were changed.
- Overall S0 remains PARTIAL/BLOCKED; S1 remains NOT AUTHORIZED. Next action is Claude's read-only review of the live HEAD and refreshed manifest, followed by owner decision.


### 2026-11-20 — ANDROID-APK-RUN-318-AND-CI-F4-CLOSURE

- Verified run `44573351798` on commit `b5948f0bbca126712c64dd605ebb7d9f6ddfb907`; branch `experiment/vic3-visual-upgrade`; job `135734112766` SUCCESS.
- Commit diff changes only `.github/workflows/android-apk.yml`, excluding the frozen-baseline B4 characterization file from the experiment APK suite while retaining the separate pinned-baseline B4 path.
- Downloaded/inspected test artifact `14554953353` (API SHA-256 `96aa79f605d52f7a2eb60748f307802827f6fec9994e280fd655e3565c879829`): 38/38 suites, 97/97 tests, zero failures, report_valid=true.
- Downloaded/inspected APK artifact `14553589834` (ZIP SHA-256 `72ce3a5759bd1379aaf35bf10a395f3cc136230b44eabc64976375405b85678b`): contains debug APK 18,057,530 bytes, APK SHA-256 `338fc54ce2e68f15ddc7043c664bdffa9cd79ade3c41aa0ed7a7cf0bfa7fe6b5`; debug certificate SHA-256 `8610076ddcefefc85d188530b0eb4645a21f92f38008692c29f6282a13418e19`. Both archive hashes were recomputed and match GitHub API digests.
- CI-F4 closed narrowly based on its stated acceptance condition. No gameplay, product source, data, assets, test harness, signing or APK workflow changes were made in this documentation update. The workflow correction itself is pre-existing commit b5948f0.
- Overall S0 remains PARTIAL/BLOCKED; S1 remains NOT AUTHORIZED. Claude independent review and owner decision remain pending.


### 2026-11-20 — S0-B7-DEPENDENCY-AUDIT-ARTIFACT-REVIEW

- Verified live experiment branch HEAD before this documentation update: `c5ba0e80b017dfeb04d29c17a66205fab23ce0d9`. Default/coordination branch remains separate and was not modified.
- Read-only dependency workflow run `44572915201` succeeded on workflow commit `9b150cff57e79bdb5356e431cc140b3b1b9eda2d`; job `135732603544` completed successfully. Artifact `14555141888` (4,753 bytes; API SHA-256 `b9124fa9c6f0272abaf970557ce248ef32c4d85397d21dbe64ebb19221a65a28`) was downloaded and all eight files inspected.
- Full dependency tree: 6 vulnerable package entries (3 moderate, 1 high, 2 critical), exit 1 expected; production-only `--omit=dev`: 0 findings, exit 0; both stderr files empty. All six vulnerable entries are dev dependencies. Nested Vite esbuild `0.21.5` is affected even though root esbuild `0.28.2` is not.
- The 2026-11-16 A2 6-finding severity summary is matched. The separate B4 Run #3 `npm ci` count of 10 remains unresolved because that run has no advisory-level JSON. DEP-F1 is now OPEN P1 — AUDIT COMPLETE; REMEDIATION / OWNER DISPOSITION PENDING, not UNTRIAGED.
- Updated dependency plan, B7 results, risk register, signoff, ChatGPT self-review and Claude review request with raw evidence and limitations. No product source, tests, workflow, dependencies, lockfile, data, assets, Gradle, signing or secrets were changed.
- Claude independent review and owner decision remain pending. Overall S0 remains PARTIAL/BLOCKED; bounded S1-entry package remains NOT_TESTED; S1 remains NOT AUTHORIZED.

### 2026-11-18 — B7-CLAUDE-REVIEW-REPORT-TEMPLATE

- Added `docs/audit/s0/CLAUDE_S0_B7_REVIEW_REPORT_TEMPLATE.md`, a structured, explicitly unfilled report template for Claude's independent B7 review.
- It requires live HEAD/file-SHA checks, bounded verdict, one row per finding, gate/risk disposition, owner prerequisites, repository-scope confirmation and specific correction requests.
- Updated Claude's review request, B7 results and handoff to use/list the template. No independent review result is claimed.
### 2026-11-18 — B7-RISK-TABLE-STRUCTURE-CORRECTION

- Found that the P2 Risk Register header had four columns while many body rows had six, causing malformed Markdown tables and loss of clear impact/mitigation/owner/target semantics.
- Rebuilt all 22 P2 rows into the same six-column schema as P0/P1, retaining source severity and explicit evidence, impact, disposition/control, owner, and target/closure criteria.
- Updated `S0_B7_RISK_TRACEABILITY.md` so R8/TC-F4, TC-F6, TC-F7, GD-F1/F3/F4, and AS-F2/F3/F4 map to their exact individual P2 rows. TC-F6 is marked mitigated for G0.6 by B4 while the original baseline test remains narrow.
- Updated the self-review and Claude request to require table-cell integrity checking. No gate verdict or product source was changed.
### 2026-11-18 — B7-REVIEW-PACKAGE-MANIFEST

- Added `docs/audit/s0/S0_B7_REVIEW_PACKAGE_MANIFEST.md` (commit `1b7bb3a77c397386910940a9eb824c2cd00d0c99`).
- The manifest snapshots experiment HEAD `36170a30cac599b50d290e98c19c3d61a957fa19`, lists blob SHAs for 11 review inputs, records the identical dependency-workflow blob SHA on default/experiment branches, and states B4 evidence limitations and gate dispositions.
- Updated the Claude read-only review request, B7 results and handoff to require checking the manifest's identities against live refs before review.
- This improves review reproducibility only. It is not a Claude review result, owner acceptance, workflow run, or S1 authorization.
### 2026-11-18 — B7-SOURCE-TO-RISK-TRACEABILITY-MATRIX

- Added `docs/audit/s0/S0_B7_RISK_TRACEABILITY.md`, a source-ID-to-risk-row matrix for R1–R14, RM-F1…F5, TC-F1…F7, GD-F1…F6, AS-F1…F7, WD-F1…F3, CI-F1…F3, DEP-F1 and the G0.7 device-evidence gate.
- Each row records source severity, target risk-register section/row, and disposition, including the closed R3, G0.6-mitigated-but-originally-narrow TC-F5, and newly restored WD-F3 P2 finding.
- Added the matrix to Claude's read-only review inputs and B7 deliverable index. No product or dependency content was changed.
### 2026-11-18 — B7-WD-F3-MISSING-FINDING-CORRECTION

- Source-to-register review found WD-F3 was missing from the detailed risk tables although WD-F1 and WD-F2 were present. Added the P2 finding: five of eight starting wars capitulate at tick 5 in all four probe scenarios; B3 did not assess historical end-date accuracy.
- Classified as an open P2 historical-calibration finding for S21/S22, not a proven engine defect and not authorization to alter gameplay/data in S0.
- Updated Risk Register, B7 self-review, B7 Results and Claude review request. The B7 package remains IN_PROGRESS pending dependency audit run, Claude independent review and owner decision.
### 2026-11-18 — B7-RISK-SEVERITY-AND-GATE-INTERPRETATION-REVIEW

- Cross-checked source risk severities and definitions against v3.2 §4B and the B3 test/asset/performance catalogs. Preserved R5's original frame-metric masking risk explicitly; its P1 row now states that aggregate FPS/frame metrics can hide long synchronous `stepMonth` calls and points to all four protocol J measurement groups for S2 (commit `a44f8b21f6716640cff043afd42a73c64e452a79`).
- Revalidated R10 as P1, R7 as P0, TC-F1/F2 as P1, TC-F3 as P2, TC-F5 as P1, R14 as P1; all source finding IDs remain represented in the register.
- Confirmed the G0.9 correction: full-S0 G0.9 is BLOCKED while C3/B2 is blocked under v3.2 §6.4 and OD-20261116-11 §2.1.1; the separate bounded S1-entry package remains NOT_TESTED pending review/owner decisions.
- B7 remains IN_PROGRESS; dependency workflow not dispatched; Claude review and owner signoff still pending. No product code/data/assets/build/signing changes.
### 2026-11-18 — B7-SELF-REVIEW-CHECKPOINT

- Added `docs/audit/s0/S0_B7_SELF_REVIEW.md` with risk-ID coverage, severity checks, B4 evidence boundaries, dependency-workflow static review, gate interpretation, non-claims and remaining actions.
- This is ChatGPT's preliminary self-review only. Claude's independent verdict remains `NOT_TESTED`; project-owner signoff remains pending.
- Added the checkpoint to the Claude review request, B7 results and handoff.
- The self-review confirms full-S0 G0.9 is `BLOCKED` while C3/B2 is blocked; the separate bounded S1-entry package is still `NOT_TESTED`. Overall S0 remains `PARTIAL/BLOCKED`, and S1 is not authorized.
### 2026-11-18 — S0-B7-CLAUDE-REVIEW-PACKET

- Added `docs/audit/s0/CLAUDE_S0_B7_REVIEW_REQUEST.md`, a read-only review brief covering B4 evidence boundaries, risk completeness/severity, signoff/exception scope, dependency workflow, and repository hygiene.
- The request explicitly forbids Claude from editing code/workflows or approving S1; any corrections must be returned as a change request for ChatGPT.
- Updated the B7 report and handoff. No Claude review has been performed or claimed yet.
### 2026-11-18 — S0-B7-READONLY-DEPENDENCY-AUDIT-SETUP

- B3/Run #3 dependency discrepancy reviewed: A2 baseline `npm audit` on 2026-11-16 recorded 6 vulnerabilities (3 moderate, 1 high, 2 critical) with five GHSA identifiers; successful Run #3 `npm ci` on 2026-11-18 recorded 10 (3 moderate, 5 high, 2 critical) without package/advisory detail. The available evidence does not explain the difference; DEP-F1 remains OPEN P1 — UNTRIAGED.
- Added `.github/workflows/s0-b7-dependency-audit.yml` to the default and experiment branches. It is workflow_dispatch-only, checks out exact baseline `2240a8f`, uses full-SHA-pinned Node 24 Actions, audits package-lock only for the full tree and `--omit=dev`, and uploads raw JSON, stderr, exit codes, summary and lockfile provenance. It does not install packages, execute lifecycle scripts, fix dependencies, update the lockfile, build, test, or package an APK.
- Added `docs/audit/s0/S0_DEPENDENCY_AUDIT_PLAN.md`; updated `S0_RISK_REGISTER.md`, `S0_SIGNOFF.md`, and `S0_B7_RESULTS.md`. The workflow is prepared but has not been dispatched; no artifact is claimed.
- Updated handoff. No dependency, product source, test, data, asset, APK or signing content was changed in this workflow setup.
### 2026-11-18 — B7-RISK-REGISTER-REVIEW-CORRECTION

- Independent cross-check against v3.2 §4 identified that R10 (future map-layer performance budgets) is P1, not P2. The register now places R10 in the P1 table with its S4/S11/S20 acceptance criteria (commit 9606209ed3dd8c6d4230e1e8b2fa95f8f4486b94).
- Added R4 as a P2 production command-journal design boundary: decision I allows test-supplied command traces and makes persistent replay sidecar optional; no production replay journal is claimed.
- Added R3 to a closed-risk note because baseline APK SHA-256 is now recorded in A1/B1 evidence, separately from artifact ZIP digest (commit d624db3cf7be1fccdb91cf9f93da25bf12fbf45e).
- Updated S0_B7_RESULTS.md to keep the B7 summary consistent. No product source/data/assets or workflow changed.
### 2026-11-18 — S0-B4-RUN3-REVIEW-AND-B7-DRAFT

- B4 execution reviewed: GitHub Actions run 44325257261, job 134874698600, workflow .github/workflows/b4-tests-only.yml, checkout commit 7f17b1f0177d712366e31e4e8c879cc4b6dd5741.
- Executed test-file blob SHA: 722d62c0647f06bc2e3a49bdef1f348f4f3104f2. Suite result: 6 test files, 70 tests passed, 0 failures, Vitest 59.51 seconds. Four B4 replay cases (Historical/Sandbox × K=6/12, N=24) produced identical complete-state SHA-256 values between continuous and save/resume paths; each first-difference path was null.
- Compare of run checkout 7f17b1f against frozen baseline 2240a8f: 351 commits ahead / 0 behind / 291 changed paths; no product source, historical data, shipped assets, dependency manifests, test helpers, data/map/content generators or product build inputs changed. This supports baseline equivalence for the run.
- Limitations: the older workflow did not upload an artifact and did not run typecheck. The separate manual s0-b4-tests.yml and later expanded experiment-branch test source were not run. The report records the exact scope and does not claim those later additions passed.
- Reviewer verdict: B4 REVIEW_PASS for §6.7; G0.6 PASS on the frozen baseline.
- New B7 deliverables created: S0_B4_RUN_3_REVIEW.md (39e6dbab81355757bfae88a1a3078ebdd005d724); S0_RISK_REGISTER.md (b4fbfeefa6b0075208d65395f8e54c6a9792608b); S0_SIGNOFF.md (75b54f8bb9dd6338972df0ace3aff1e5af922376); S0_B7_RESULTS.md (373f938f858762e80a422cc0f521e726d25d34fb).
- Gate snapshot in the draft: G0.1–G0.6 PASS; G0.7 BLOCKED (iQOO not measured); G0.8 PARTIAL (legacy license/attribution gaps); G0.9 NOT_TESTED pending independent review and owner signoff. Overall S0 remains PARTIAL; S1 is not authorized.
- Risks retained: R7 open P0 with owner-accepted interim containment (OD-20261116-11 §5.1); R14 blocked; R1/R13 signing risks deferred; dependency audit summary and Node 20 action deprecation warnings recorded.
- Scope: audit reports and coordination only. No gameplay, engine, RNG, save serializer/schema, data, assets, Android build, signing, keystore or secrets changed.

### 2026-11-18 — B4-INDEPENDENT-TYPECHECK-AND-VITEST-COLLECTION

- Default-branch workflow commit: `7f17b1f0177d712366e31e4e8c879cc4b6dd5741`.
- Experiment-branch mirror commit: `ccbe7a71d806f16350c1375b6a9ab6687925eece`.
- After `prepare-assets` succeeds, workflow now runs `npm run typecheck` and the dedicated Vitest characterization independently. Previously Vitest was skipped when typecheck returned non-zero.
- Either non-zero step still sets the aggregate job result to FAIL. This change improves evidence collection; it does not weaken the gate.
- Both workflow files were updated with the same content. No Android build step was added; no product code/data/assets changed.
- The new workflow revision still awaits manual `workflow_dispatch` on `experiment/vic3-visual-upgrade`; G0.6 remains `NOT_TESTED`.


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


## 9. Next-session handoff — 2026-11-19

A verified continuation report was added at `docs/coordination/NEXT_SESSION_HANDOFF_2026-11-19.md` in commit `26963daef7c72f2dbeb86239f023b9a902778ae6`.

It records the live experiment-branch HEAD observed before the handoff (`3e2e1d546efee4ee20d19b1da5a86403277006f7`), the active B7 work, exact next actions, branch restrictions, and the distinction between approved B4 Run #3 (70/70 pass) and supplemental Run #65 (100/104 pass; four save/load characterization assertions failed on `state.countries.ABD.group` field presence). Run #65 did not reach APK assembly and produced no APK. The supplemental discrepancy is explicitly left for reviewer analysis; it does not silently replace or erase the approved Run #3 evidence.

This section records the 2026-11-19 checkpoint and is superseded by the 2026-11-20 addenda in the work log and `NEXT_SESSION_HANDOFF_2026-11-19.md`: dependency audit and APK run #318 are now verified; Claude independent review and owner decision remain pending. Overall S0 is not PASS; S1 is not authorized.


### 2026-11-19 — CURRENT-BRANCH-CI-RECHECK — 2026-11-19

- Live experiment branch HEAD before this documentation update: `fa95ad894c6fd32c673a569a561a17b7132cef36`. The two commits after the previous handoff are documentation-only: `26963da` adds the next-session handoff and `fa95ad8` links it from `AI_HANDOFF.md`.
- Android APK workflow runs **#316** (`44562638037`, commit `26963daef7c72f2dbeb86239f023b9a902778ae6`) and **#317** (`44562662560`, commit `fa95ad894c6fd32c673a569a561a17b7132cef36`) both completed with `failure`.
- In both runs, `npm ci`, `npm run build`, and generated-data/web-bundle hashing passed. Vitest failed at the same baseline-characterization assertion in `tests/s0-save-determinism.test.ts`: 6 files, 5 passed / 1 failed; 109 tests, 108 passed / 1 failed. The failing assertion requires every restored country to lack `constructionQueue`.
- Source comparison confirms the experiment branch currently declares and initializes `constructionQueue` in `src/engine/types.ts` and `src/engine/init.ts`; frozen baseline `2240a8f` predates that field. The Android workflow runs the full test suite against the experiment branch, whereas the approved B4 result is a frozen-baseline characterization. This is a test-scope/integration mismatch to be reviewed, not evidence that the approved baseline B4 Run #3 failed and not authorization to alter product code.
- Because Vitest failed, Android setup, Capacitor sync, Gradle `assembleDebug`, APK checksum and APK upload were skipped in both runs. **No APK was produced by #316 or #317.** The web/data build ran, but the workflow uploaded only CI evidence; it did not publish a downloadable data-pack artifact.
- The dedicated S0-B7 dependency-audit workflow remains un-dispatched; no audit artifact or package-level DEP-F1 conclusion exists. This session has no GitHub Actions workflow-dispatch action, so manual dispatch on `experiment/vic3-visual-upgrade` remains pending.
- No product source, tests, data, assets, dependencies, Gradle, signing or workflow files were changed during this recheck. G0.6 remains bounded to the approved baseline Run #3 evidence; overall S0 remains PARTIAL/BLOCKED; S1 remains NOT AUTHORIZED.


### 2026-11-19 — B7-COUNT-AND-CURRENT-CI-RECHECK

- Recounted the current S0_RISK_REGISTER.md P2 table: 22 data rows, all with six cells. Corrected stale handoff wording that said 21.
- Recorded Android workflow runs #316/#317 and their identical 108/109 Vitest failure in S0_B7_RESULTS.md, S0_B7_SELF_REVIEW.md, the Claude review request and next-session handoff.
- The failure is in a baseline-specific assertion run against the experiment branch, which currently has constructionQueue; the approved B4 Run #3 remains a distinct frozen-baseline result. Android APK assembly did not run.


### 2026-11-19 — FINAL-B7-REVIEW-PACKAGE-REFRESH

- Refreshed `S0_B7_REVIEW_PACKAGE_MANIFEST.md` after the live CI recheck; it now includes the current B7 results, Claude request, self-review, AI handoff and next-session handoff blob identities.
- The next-session handoff was updated in commit `78a606b64e1b1154f36dc0b8a2a81c5beed466fd` and records the preceding documentation commits through `79a322de`.
- Current experiment branch work remains documentation-only. Latest Android APK workflow run is #317 on the unchanged product/test tree and failed before Gradle/APK assembly. The B7 dependency audit has not been dispatched; DEP-F1 remains OPEN P1 — UNTRIAGED.


### 2026-11-19 — B7-CI-F4-AND-DISPATCH-LIMIT

- Added `CI-F4` as OPEN P1 to `S0_RISK_REGISTER.md`: Android APK runs #316/#317 stop at a frozen-baseline B4 test executed against the experiment branch; 108/109 tests pass, and the one failing assertion expects `constructionQueue` to be absent.
- Added exact traceability mapping in `S0_B7_RISK_TRACEABILITY.md`. Experiment code declares/initializes `constructionQueue`; frozen baseline 2240a8f predates it. This is a test-scope/workflow integration mismatch, not a gameplay defect and not a contradiction of the approved B4 Run #3 baseline result.
- Both CI runs skipped Android SDK setup, Capacitor sync, Gradle `assembleDebug`, APK checksum and APK upload. No APK was produced. Any test-selection/workflow correction needs separate owner authorization; no source/test/workflow fix was applied in B7.
- Updated `S0_B7_RESULTS.md`, `S0_B7_SELF_REVIEW.md`, `CLAUDE_S0_B7_REVIEW_REQUEST.md`, `S0_SIGNOFF.md` and `NEXT_SESSION_HANDOFF_2026-11-19.md`.
- GitHub tool availability check: the connected integration has no workflow-dispatch action. The read-only S0-B7 dependency audit remains unrun; no artifact or package-level conclusion exists. DEP-F1 stays OPEN P1 — UNTRIAGED and requires owner/manual Actions dispatch.
- Work commits: `d4778b2`, `46a878f`, `3a854a9`, `98f0993`, `64088f9`, `d31c5fc`, and next-session handoff update `a03f814`; all audit/coordination Markdown only, [skip ci].
- Overall S0 remains PARTIAL/BLOCKED. S1 remains NOT AUTHORIZED.



### 2026-11-19 — APK-THEN-DATA-PACK-DELIVERY-REQUIREMENT

- Re-recorded the owner requirement for a small installable APK followed by separate, user-selected data-pack downloads inside the app.
- Future release acceptance must include manifest/signature + SHA-256 verification before atomic activation, local retention for offline play, separate versioned APK/data artifacts, and explicit consent before background or mobile-data use.
- Status remains NOT IMPLEMENTED / NOT TESTED. Current Android runs #316/#317 produced neither an APK nor a downloadable data pack. This is a future, separately authorized product task, not S0-B7 scope; no product/workflow/data/signing change is authorized here.


### 2026-11-19 — CI-ARTIFACT-AND-DEPENDENCY-PREFLIGHT

- Downloaded and inspected run #316/#317 diagnostic artifacts: IDs 14550237447 / 14551001678 and API digests recorded in `S0_B7_RESULTS.md`. Archives contain evidence files only, no APK and no data-pack payload.
- Exact current-branch failure recorded at `tests/s0-save-determinism.test.ts:270`; the baseline absence-of-`constructionQueue` assertion fails, while the current legacy-save migration test passes. CI-F4 remains OPEN P1.
- Read the pinned lockfile from both baseline and experiment; blob SHA matches. Preliminary advisory cross-checks match the locked dev versions of Vitest/@vitest/mocker and tinypool. This is not the required npm audit; no prod-dependency conclusion and no dependency changes.
- Updated `S0_B7_RESULTS.md`, `S0_DEPENDENCY_AUDIT_PLAN.md`, `S0_B7_SELF_REVIEW.md`, and `CLAUDE_S0_B7_REVIEW_REQUEST.md`. Manual dependency-audit workflow dispatch remains the smallest external blocker.


### 2026-11-20 — OWNER-PLAYTEST-REJECTION-AND-IMPROVEMENT-BACKLOG

- Owner hands-on test verdict: current build is materially below Victoria 3 target; simulation time advances much too quickly; historical ruler portraits are inconsistent; military, economy, factories, political systems, social structure, laws and scoring/points are inadequate.
- Created `docs/feedback/PLAYER_TEST_FEEDBACK_2026-11-20.md` as the authoritative player-test backlog. P0: deterministic simulation clock/pacing and date-valid, source-verified historical identity/portrait data. P1: integrated economy/industry, military/logistics, politics/social strata/laws. P2: transparent, explainable scoring/ranking.
- Requirements explicitly preserve global 1836–1936 simulation, Historical Mode start 1836-01-01, separate Sandbox/Alternate History mode, and coherent cross-system mechanics. AI portraits may only be labelled illustrative fallback art, never passed off as authentic historical portraits.
- This commit records requirements only. The collaboration protocol still prohibits gameplay/engine/UI/save changes during S0; S1 remains NOT AUTHORIZED until the bounded transition review and owner acceptance. Do not interpret this feedback record or a successful APK build as phase authorization.


### 2026-11-20 — B7-P0-P1-DISPOSITION-CLARITY

- Re-read the current P0/P1 Risk Register, traceability matrix, signoff, results, self-review, reviewer request, manifest and both branch governance sources.
- The six-column P0/P1 schema and ownership fields were present. Functional accountability existed, but some stage/exit text was too broad: R2/AS-F1, R10, GD-F2 and TC-F1/TC-F2.
- Clarified target stages and evidence-based exit criteria against v3.2 S3/S4/S5/S6/S11/S17/S19/S20/S21 and the B3 source reports. No numeric performance threshold or historical-data completeness threshold was invented; those require stage-specific approval/evidence.
- Preserved R7 OPEN P0, R14 BLOCKED, R1/R13 OPEN/deferred, CI-F4 CLOSED (narrow), DEP-F1 OPEN P1 / UNRECONCILED, G0.7 BLOCKED, G0.8 PARTIAL, G0.9 BLOCKED, overall S0 PARTIAL and S1 NOT AUTHORIZED.
- Documentation-only. No product source, test, dependency, workflow, save, data, asset, Gradle, signing, APK or device changes; no runtime test/build performed. This is ChatGPT self-audit only; Claude independent review and owner decision remain pending.


### 2026-11-20 — B7-EXACT-HEAD-RUN-324-AND-R1-REVALIDATION

- Live experiment branch HEAD verified as `31f1617ed838110296fd68edfd90c7e3e3b8d0a7`; Android Actions Run #324 (`44677523059`) completed SUCCESS on that exact SHA; job `136092798809`.
- `npm ci`, data/map/web build, generated asset hashing, Vitest, Capacitor sync, Android asset hashing and `./gradlew assembleDebug --no-daemon` succeeded. Test report: 38/38 suites, 97/97 tests, zero failures/pending, `report_valid=true`; Gradle BUILD SUCCESSFUL.
- APK artifact `14603730370`: 17,569,417-byte ZIP, SHA-256 `4a2800bcab95fd0d92ab6f7bbe93111fa7059b1d82a2a340f3a3ac892a34cfd1`; local digest matched GitHub. APK file 18,057,538 bytes, SHA-256 `d64bdf78726d991f1bb3c867200f360e2fc563bc0332282cf75cbe7d9734d285`. Evidence artifact `14603825259`: 106,638 bytes, SHA-256 `3a53e96540faa10585b893dd9cc7ea6a071ccb65c6a1accfa94bbf73f447c16b`; local digest matched GitHub. APK signing verified (V1/V2), certificate SHA-256 `84bb348722b660bb36805f3928f73d64401d313a8627168796b6068a2ee1d146`.
- Re-downloaded Run #322 APK/evidence artifacts and verified their ZIP/APK checksums. Run #322 cert SHA-256 is `559d549a21515f899b6195c65114b2be778ff2fbd63288d21ef31f4365b96238`. GitHub compare `68fee316..31f1617` shows 17 intervening commits and documentation-only changed paths; the different debug certificate fingerprints directly reinforce R1. R1 remains OPEN; R14 remains BLOCKED; no installation/signing action was taken.
- Tightened AS-F1 target/closure to S5, requiring live source checks for all 492 images and UI attribution verification. No severity or gate status changed.
- No product/source/dependency/workflow/save/data/asset/Gradle/signing change. No device QA. This is implementer self-review only; Claude review and owner acceptance remain pending.


### 2026-11-20 — B7-RISK-TABLE-CI-F4-BOUNDARY

- Structural recheck found the CI-F4 P1 row was separated from the six-column P1 table by a blank line and rendered as a detached headerless table. Removed the separator and confirmed CI-F4 now belongs to the P1 table.
- Post-correction counts: P0 1×6; P1 13×6 (12 P1 risk rows + separate G0.7 gate row); P2 22×6; P3 5×3; Closed 1×3. No blank cells. Traceability: 48 unique mappings.
- CI-F4 remains CLOSED narrowly; all risk/gate/phase states are unchanged. Documentation-only; no runtime test/build/device QA. Independent Claude review and owner acceptance remain pending.


### 2026-11-20 — B7-R13-GD-F2-ROADMAP-ALIGNMENT

- Tightened R13 against v3.2 §4.1.2–4.1.5. The future signing workflow/security controls are explicitly proposed and NOT IMPLEMENTED: workflow_dispatch only, exact ref gate, build/sign isolation, protected Environment and reviewer/no-bypass rules, least privilege, full-SHA Actions, no Repository Secrets, no untrusted repository code in the signing job, and temporary key cleanup. B2/C3 stays BLOCKED pending R14 and owner-controlled configuration.
- Tightened GD-F2 target stages by data domain: S3 geographic validity, S6 population, S7/S13 economic facts, S16 historical rulers/characters. Exit criteria require temporal/geographic scope, sources, units, methods, denominators, uncertainty and missing/conflict counts across 12 regions and polity types.
- No code, data, workflow, key, Environment, signing change, severity or gate change. Documentation-only self-audit; reviewer and owner decisions remain pending.

### 2026-11-20 — VICTORIA-3-FEATURE-PARITY-AUDIT-AND-CLOCK-CORRECTION

- Base HEAD before this documentation slice: `28105b8ba5ffa62c1ad8700c874c0fe659e503e1`.
- Owner clarified that the target is system depth across the entire simulation, not a small speed/UI adjustment: POP/social strata, economy/factories, politics/institutions/laws, diplomacy, subjects, alliances/treaties, military/logistics, AI and historical world behavior must approach Victoria 3's systemic depth.
- Re-checked Paradox's official Dev Diary #76 (2023-02-22): a Victoria 3 regular tick represents six in-game hours; regular/daily/weekly/monthly/yearly task cadences are distinct; tick speed is distinct from FPS. The public diary does not give a universal fixed speed-5 days-per-real-second mapping.
- Corrected the earlier technical triage wording: the five-years-per-second value was only a theoretical calculation for this project's current monthly-per-RAF code under a hypothetical 60 callbacks/second, not a device measurement and not a like-for-like Victoria 3 speed comparison. Current product defect is both RAF-coupled scheduling and a monthly-only simulation calendar. The existing `SIMULATION_CLOCK_PACING_DESIGN_VI.md` remains the clock design authority.
- Added `docs/feedback/VICTORIA3_FEATURE_PARITY_GAP_AUDIT_2026-11-20.md`, a read-only feature-gap audit anchored to `docs/spec/MASTER_SPEC_VI.md`. It covers clock/cadence, POPs, buildings/industry, inventory/markets/trade/finance, politics/institutions, diplomacy/treaties, subjects, military/war/logistics, AI, history, map, save/reliability and cross-system integration. It records current code state and explicit acceptance criteria; it does not claim these systems are implemented.
- Updated `PLAYER_TEST_TECHNICAL_TRIAGE_2026-11-20.md` with the correct Victoria 3 tick reference and links to the full parity audit; linked the parity audit from `PLAYER_TEST_FEEDBACK_2026-11-20.md`.
- Documentation commits: parity audit `2ffe92d8740a5daca9074b9600e353ef15e6eada`; clock correction/triage `7174b6cd0a1e55636780a672aa94b3bb5b87f357`; player-feedback link `ba8ef460e8fd4176812e03719c21fdd2536f993f`. Handoff update is committed separately below.
- No gameplay, engine, test, save/schema, generated data, asset, dependency, Gradle, signing, workflow or APK changes. No runtime tests/build, APK install or physical-device QA were run in this documentation-only slice.
- Phase boundary unchanged: S0-B7 `IN_PROGRESS`; S1 remains `NOT AUTHORIZED`; no owner phase transition or implementation approval is inferred from this product-goal clarification. Do not implement the parity backlog until the phase gate and exact task scope are explicitly authorized.
- Next: re-fetch live HEAD, use the parity audit as the design/checklist source, and obtain the required independent B7 review/owner gate before proposing a bounded implementation task. Prioritize clock foundation and historically valid ruler/portrait resolution when implementation is authorized, then build the interconnected subsystems in vertical slices with scenario and Android QA evidence.



## 2026-11-20 — OWNER-REQUESTED SCOPE EXPANSION: 1836–2026 + CORE SYSTEM DEPTH

- Owner requested that the campaign span be expanded from 1836–1936 to 1836–2026, with a contemporary technology tree and modern institutions/government/military systems.
- Owner explicitly requested that this be combined with the work already intended at the start of this session: correct the overly fast / frame-coupled simulation pacing and deepen POP/economy, politics/laws/institutions, diplomacy (subjects/client states, alliances and treaties), and military (organization, equipment, command and logistics).
- Recorded the complete planning amendment in `docs/roadmap/OWNER_SCOPE_AMENDMENT_1836_2026_SYSTEM_DEPTH.md`. It defines the combined workstreams, era bands, technology branches, system contracts, suggested delivery order and acceptance criteria.
- The original `docs/spec/MASTER_SPEC_VI.md` is retained byte-for-byte as the normative S0/G0.4 audit source (1836–1936). The scope amendment does not rewrite that file or erase historical S0 evidence; a separately reviewed product-spec revision will be required to formally supersede the 1936 terminal date.
- This is an owner-requested product-scope change and planning record only. It does not authorize gameplay/engine/runtime-clock/save/data/assets changes or bypass the current phase gate.
- Live phase status remains: S0-B7 `IN_PROGRESS`; independent review and owner signoff pending; overall S0 `PARTIAL — NOT COMPLETE`; bounded S1-entry `NOT_TESTED`; S1 `NOT AUTHORIZED`. R7 remains OPEN P0, R14 BLOCKED, G0.7 BLOCKED, G0.8 PARTIAL, DEP-F1 OPEN P1.
- No product source, tests, production data, save schema, assets, Gradle/workflows, signing configuration or APK changed. No build, test, device install or device QA was performed for this documentation-only scope record.


## 2026-11-20 — TECHNOLOGY / INSTITUTIONS DESIGN DRAFT FOR 1836–2026

- Added `docs/design/TECHNOLOGY_AND_INSTITUTIONS_1836_2026_DRAFT.md` as a detailed design package under the owner's approved product-scope request.
- The draft provides a structured technology taxonomy with stable node IDs across agriculture/bioeconomy, materials/chemistry, energy, transport/communications, science/health, computing/AI/automation, land/naval/air/strategic military capabilities; it distinguishes research, diffusion, adoption, deployment and operational readiness.
- Added institutional progression domains (state capacity, participation, labor/welfare, education/science, health, finance/regulation, environment and security), force-generation chains, proposed data contracts, and scenario-validation cases.
- Contemporary capability scope is cross-checked against current references from IEA Energy Technology Perspectives 2026, ITU Facts and Figures 2025, Stanford HAI AI Index 2026 and SIPRI 2026 military/security publications. These are research references, not a substitute for sourced country-by-country historical data or licensing checks.
- Current author self-check: design-only document; it does not claim features are implemented. The source register explicitly labels frontier capabilities such as fusion, 6G and broad quantum computing as research/uncertain rather than mature universal deployment.
- No product source, tests, save schema, migration, generated data, assets, Android/Gradle, workflows, dependencies, signing or APK was changed. No build/test/device QA was performed for this design commit.
- Gate remains unchanged: S0-B7 `IN_PROGRESS`; independent review/owner acceptance pending; overall S0 `PARTIAL — NOT COMPLETE`; bounded S1-entry `NOT_TESTED`; S1 `NOT AUTHORIZED`. The original `MASTER_SPEC_VI.md` remains byte-for-byte unchanged for the historical S0 audit.


## 2026-11-20 — OWNER DELEGATION OF TECHNICAL EXECUTION DISCRETION

- Owner instructed ChatGPT to use full technical discretion to decide and carry out project work, without waiting on schedule/time constraints.
- ChatGPT will choose the engineering order, prioritize correctness and system integration, and continue all work that is authorized by the current project phase.
- This delegation is recorded as an execution-discretion instruction. It is **not interpreted as an independent reviewer verdict**, does not mark the S0-B7 package `REVIEW_PASS`, does not constitute a completed bounded-transition `ACCEPTED` decision, and does not silently waive the documented reviewer/phase gates.
- Current blocker remains the independent S0-B7 review and explicit bounded transition decision. No independent DeepSeek reviewer connection is available through the current connected tools; Claude's paused status remains as recorded until a reviewer is actually assigned and completes the review.


## 2026-11-20 — LIVE B7 SELF-AUDIT AND 2026 CONTEMPORARY SOURCE RECHECK

- Re-parsed the live Risk Register and traceability matrix from GitHub after the new product-scope/design work. Current structure: P0 1×6; P1 13×6 (12 risks plus G0.7 gate row); P2 22×6; P3 5×3; Closed 1×3; no blank cells. Traceability: 48 unique source/gate mappings, no duplicates, all source risk IDs resolve to a register row. The details and limitations are in `docs/audit/s0/S0_B7_SELF_REVIEW.md` §16.
- Confirmed status consistency: S0-B7 IN_PROGRESS; overall S0 PARTIAL — NOT COMPLETE; G0.7 BLOCKED; G0.8 PARTIAL; full-S0 G0.9 BLOCKED; bounded S1-entry NOT_TESTED; S1 NOT AUTHORIZED.
- Rechecked the contemporary-source links used by `docs/design/TECHNOLOGY_AND_INSTITUTIONS_1836_2026_DRAFT.md` against the current official IEA, ITU, Stanford HAI and SIPRI pages. Added a 2024/2025 observation-year calibration snapshot; these annual observations are not mislabeled as full-year 2026 data.
- Current calibration anchors (with source/method cautions in the design document): IEA clean-energy market value near USD 1.2T in 2025 and concentrated supply-chain production; ITU estimates 2.2B people offline and 5G reaches over half the global population in 2025; Stanford HAI reports 88% surveyed organizational AI use, industry production of over 90% of notable frontier AI models in 2025 and China's 54% share of 2024 industrial robot installations; SIPRI estimates 2025 global military spending at USD 2.887T, up 2.9% in real terms.
- Self-audit only. It does not close any risk, constitute independent REVIEW_PASS or owner acceptance, and does not authorize S1. No product/gameplay/engine/runtime/clock/save/data/assets/workflow/signing changes, builds, APK installation or Android QA were performed.


## 2026-11-20 — 1836–2026 CLOCK CONTRACT AND SPEED-5 PACING GUARD (DESIGN ONLY)

- Added §12 to `docs/spec/SIMULATION_CLOCK_PACING_DESIGN_VI.md` and corrected its inclusive campaign duration.
- Calendar proposal: start 1836-01-01; last playable date 2026-12-31; process the final day's scheduled tasks, then mark the campaign complete at 2027-01-01 00:00. The inclusive campaign contains 191 calendar years.
- Pacing proposal: Speed 5 target ceiling no faster than one in-game calendar year per 60 real seconds (about 6.1 game days per real second) on a reference benchmark setup. This is a **provisional design guard**, not measured Victoria 3 behavior and not a statement that the target Android device can sustain the rate. Slowdown/backlog is acceptable; dropped logical ticks or FPS-driven acceleration are not.
- Added acceptance targets for Gregorian leap years, terminal campaign boundary, Speed 5 cap, refresh-rate independence, bounded backlog and save/load across cadence boundaries.
- No simulation/runtime/save code, tests, data, assets, build files, APK or workflow was changed. No benchmark or device test was run. The design remains subject to phase authorization, measurement and review.


## 2026-11-20 — OWNER CONFIRMED SPEED-5 HARD CEILING: HALF A GAME DAY PER SECOND

- Owner clarified the maximum allowed pacing: no more than **0.5 in-game Gregorian day per real second** (12 game-hours per real second) at Speed 5.
- Updated `docs/spec/SIMULATION_CLOCK_PACING_DESIGN_VI.md` §12.2–12.3 and acceptance test CLK-13. This replaces both earlier proposals (1 game-year/60 seconds and 1–2 game-days/second); neither earlier proposal is current.
- The 1836-01-01 to 2027-01-01 terminal interval is 69,762 Gregorian days. At exactly the hard cap, the theoretical uninterrupted minimum to pass the full calendar is 139,524 real seconds = 38h 45m 24s. Real simulation may take longer due to compute, pause, saves and overload.
- At a six-hour logical tick, 0.5 day/second equals at most two logical ticks/second. Rendering/RAF must not generate logical ticks, and no monthly simulation pipeline may run at the six-hour cadence.
- This is an owner-set product speed ceiling in the design, not a measured runtime result or proof that the current build implements it. No source code, save schema, scheduler, benchmark, test, APK or Android runtime was changed/run.


## Effective owner implementation authorization — 2026-11-20

The owner explicitly delegated full technical execution discretion to ChatGPT to develop the game toward a detailed, coherent, stable Victoria 3-class simulation rather than a small demo. The signed-off-by-chat owner instruction is recorded durably in `docs/coordination/OWNER_IMPLEMENTATION_AUTHORIZATION_2026-11-20.md` (authorization commit `c1f5fa482a99c4a9381a5d3a431ea9eeefb2a698`).

This is a later, explicit owner authorization to begin product implementation on `experiment/vic3-visual-upgrade`, overriding the earlier blanket `S1 NOT AUTHORIZED` statement for the newly authorized product work. It does **not** mark S0 as passed, close any S0-B7 risk, create an independent reviewer verdict, or claim a formal bounded S1 transition acceptance. Keep historical S0 statuses intact. Implementation remains incremental and must be independently reviewable.

### 2026-11-20 — ECONOMY-INVENTORY-LEDGER-01

- **Base HEAD:** `1b6388881aa54fec9e3acc74d370cf7eeb3dac0c`.
- **Current implementation checkpoint:** `8c4d026531f37fbb4fe58a12b6736afd8c546d8a` on `experiment/vic3-visual-upgrade`; re-fetched from GitHub and confirmed as the live branch HEAD.
- **Owner authorization:** `c1f5fa482a99c4a9381a5d3a431ea9eeefb2a698`.
- **Commits in this slice:**
  - `9b007bee7319102e91ec4f43e29ff586e00547ac` — deterministic inventory settlement primitives.
  - `b580adc3ea7a3769fe55d6e71ea9d2ddbb1b9cc7` — persistent inventory ledger types.
  - `1521cc658ee06f902b9d14396a5792ce7e9083ea` — initialize new-game inventory state.
  - `de8d43c0959ad236f85e02609cbc1d072a979ce7` — additive migration for pre-ledger saves.
  - `1d960e51ef4322d26b007f0a22fadf3a4245e777` — integrate market stock settlement and paired aggregate imports/exports.
  - `c8e028252616896f98b0ced4059ecfcb12282b7c` — add inventory unit/integration tests.
  - `398175e958f9fdbc1fddf85bbf060dae6134b0df` — remove an assumption that every historical start must have positive trade.
  - `8c4d026531f37fbb4fe58a12b6736afd8c546d8a` — add the implementation contract and limitations.
- **Files changed:** `src/engine/systems/inventory.ts`, `src/engine/types.ts`, `src/engine/init.ts`, `src/engine/save.ts`, `src/engine/systems/economy.ts`, `tests/inventory.test.ts`, `docs/design/INVENTORY_LEDGER_IMPLEMENTATION_01.md`, and this authorization record.
- **Implemented:** persistent market-level stock balances; monthly accounting rows for opening stock, production, imports, exports, demand, consumption, unmet demand and closing stock; paired total world imports/exports; negative/invalid/impossible flow guards; deterministic strictly increasing journal ticks; 12-month bounded history; additive old-save migration. Service-value flow remains outside physical stock.
- **Historical data integrity:** existing saves start with `openingBasis: unseeded`; no unsupported 1836 stock values, warehouse capacities, spoilage rates, weights or distances were invented. Initial calibration at tick 0 is not recorded as a played month.
- **Tests added (8):** stock conservation, explicit unmet demand, invalid-flow rejection, bounded immutable history, duplicate-period rejection, live economy ledger balance, deterministic save/load continuation, and pre-ledger save migration.
- **Test execution:** `NOT_TESTED` in this session. The GitHub combined-status query returned no status objects for `8c4d026`; the available workflow-run fetch only exposes pull-request-triggered runs, so it did not verify the push-triggered Android workflow. A local clone attempt was blocked by DNS resolution for `github.com`. Do not report tests or build as PASS until the exact run is inspected.
- **CI/build/APK:** `PENDING / NOT VERIFIED` for exact commit `8c4d026`. No APK artifact or SHA is claimed from this slice.
- **Device QA/performance:** `NOT_TESTED`; no APK installed and no physical-device measurement claimed.
- **Limitations:** the first implementation is market-level rather than regional/warehouse/firm-level. Physical route capacity, storage capacity, spoilage, stockpile policy, sourced 1836 opening stock and player-facing inventory UI are not implemented. The current economy still has a planned-versus-realized factory input/output accounting gap; resolve that before treating this as a complete factory-level material-flow audit. Details: `docs/design/INVENTORY_LEDGER_IMPLEMENTATION_01.md`.
- **Next exact action:** inspect the push-triggered Android workflow for `8c4d026531f37fbb4fe58a12b6736afd8c546d8a`; run/fix the inventory test suite and Gradle build until verified. Then address realized factory input/output posting before adding regional warehouses and route logistics.



### 2026-11-20 — ECONOMY-INVENTORY-LEDGER-01 / FACTORY-FLOW-RECONCILIATION

- **Base HEAD:** `de8fde59a2a3a77980ecbc3656b8e5cd3b81bcf6` (verified before this continuation).
- **Latest implementation commit:** `13cdc36d3b84b0918ccc3173b862050db29e26bc`.
- **Latest design/report commit:** `693eec1b27bc909ec2bed1476fbf5532e6cba7bb`.
- **Current branch HEAD before this handoff update:** `693eec1b27bc909ec2bed1476fbf5532e6cba7bb`.
- **Implementation commits in this continuation:**
  - `2ea2d3a1286bc1b249edef6cf05947e1b54e206c` — scale recipe-factory outputs and inputs by the same scarcest-input fulfillment factor; adjust market supply/demand and re-settle stock.
  - `48a75129ee7fe1a2d49e49893f890bd6c0a521e7` — correct GDP input aggregation so realized factory inputs are deducted once per region, not once per good.
  - `0c250c3d367ca84c58a24c7bb5af563473d48149` — add factory material-realization tests and MarketStats-to-ledger projection checks.
  - `e51411f1654fc10fc15720327d030a7274f930c5` — use scale-aware tolerances for large physical quantities.
  - `13cdc36d3b84b0918ccc3173b862050db29e26bc` — replace the provisional full settlement/journal allocation with a lightweight shortage-ratio probe; only the definitive pass creates ledger/statistics entries.
- **Documentation commits:**
  - `78dedb1bd4d84b3b13d54e21964b95ace03b4dab` — update inventory implementation contract and limitations.
  - `693eec1b27bc909ec2bed1476fbf5532e6cba7bb` — record provisional-probe allocation reduction and revised next steps.
- **Files changed in this continuation:** `src/engine/systems/economy.ts`, `tests/inventory.test.ts`, `docs/design/INVENTORY_LEDGER_IMPLEMENTATION_01.md`; this handoff update follows.
- **Implemented:** recipe-based factory production is now reduced by the same fulfillment factor as the input materials consumed. Realized factory output/input amounts adjust market supply/demand before the definitive monthly inventory settlement. GDP value-added and firm operating-margin calculations consume the same stored realization factor. Final `MarketStats` and inventory journals project the same adjusted annualized/monthly flows.
- **Performance refinement:** the first clearing is now a lightweight availability probe. It avoids constructing provisional settlement entries, journals and market-stat objects; the final clearing remains the only posted settlement. This is a source-level optimization only, not a measured Android performance result.
- **Tests present:** 10 tests in `tests/inventory.test.ts` — two factory realization cases, five standalone inventory invariants, and three simulation/save integration cases. The integration test checks market-stat annualized quantities against the monthly ledger and verifies global imports/exports balance using scale-aware floating-point tolerances.
- **Test execution:** `NOT_TESTED` in this session. No local clone or dependency install was possible because DNS resolution for `github.com` failed. Do not interpret the presence of test source as a passing run.
- **CI/build/APK:** `NOT_VERIFIED`. `get_commit_combined_status` returned no status objects for code commit `13cdc36`; the available workflow-run reader is limited to pull-request-triggered runs and cannot confirm the repository's push-triggered Android workflow. No exact run ID, Gradle result, artifact or APK hash is claimed. The workflow is configured on push to all branches; inspect its run for the exact branch HEAD when Actions evidence is available.
- **Device QA/performance:** `NOT_TESTED`; no installation, physical-device test, memory profile or benchmark was performed.
- **Known limitation:** factory realization uses one deterministic preliminary availability probe followed by one definitive market clearing. It is not yet an iterative market equilibrium/fixed-point solver. Agricultural/artisanal output remains aggregated rather than tracked by firm/warehouse. Regional storage, route capacity, stockpile policy, sourced opening stocks and the player-facing inventory UI remain unimplemented. See `docs/design/INVENTORY_LEDGER_IMPLEMENTATION_01.md`.
- **Next exact action:** obtain and inspect Android Actions for this branch HEAD; run/fix typecheck, all simulation tests and APK build to exact-SHA evidence. Then design a bounded deterministic staged/fixed-point market clearing with explicit iteration cap/convergence tests before adding firm/warehouse and route-level inventory.



## 2026-11-20 — ECONOMY-INVENTORY-LEDGER-02 / BOUNDED ITERATIVE MARKET CLEARING

- **Verified starting HEAD:** `755bb54e0821bbaeebd57fb03c3529dda3a3f649`.
- **Latest implementation commit:** `da2968bb52e7df8a2225ba35951a83c44d6ada83` (state type/diagnostics; the solver code is `d740e290d29f0e3d20f58361c95456ef12415d06)).
- **Latest tests commit:** `f20580456c36238363b2780dc52dd4f26a70e711`.
- **Latest design/report commit:** `aebc719d181649603b6a0fc3987182f6fa404f5a`.
- **Current branch HEAD before this handoff update:** `aebc719d181649603b6a0fc3987182f6fa404f5a`.
- **Commits in this continuation:**
  - `c6c3e7d3beb53ff2588f54b9be9e9f48566babe7` — add a pure bounded deterministic market/factory fulfillment solver.
  - `b63ba3f14448ddb5ba27e3d8eb553dd750fc3737` — integrate its final supply/demand/shortage projection with recipe factory realization and the monthly inventory settlement.
  - `94e540ad1e7a10b325da08b761cfbcfb9c741653` — tests for fixed-point convergence, iteration cap, invalid inputs and stockpile transfer.
  - `0d64634540421e53471ede9ba27ef24bc770d03d` — allow inventory already held by a market to be exported after local demand is covered.
  - `d740e290d29f0e3d20f58361c95456ef12415d06` and `da2968bb52e7df8a2225ba35951a83c44d6ada83` — persist market solver diagnostics in optional GameState state.
  - `217c303c09c0be32592e4daff2313edf8665db85` and `f20580456c36238363b2780dc52dd4f26a70e711` — assert the diagnostics in simulation tests and make the legacy-save fixture remove the optional field when simulating a pre-diagnostics save.
  - `aebc719d181649603b6a0fc3987182f6fa404f5a` — update the inventory ledger design/implementation report.
- **Files changed in this continuation:** `src/engine/systems/economy.ts`, `src/engine/types.ts`, `tests/inventory.test.ts`, `docs/design/INVENTORY_LEDGER_IMPLEMENTATION_01.md`; this handoff update follows.
- **Solver contract:** maximum 32 iterations, relaxation 0.5, convergence tolerance 1e-5. Iteration order is stable; market IDs are sorted, and factory operations follow stable region/building iteration. The pure solver returns per-factory fulfillment, final market supply/demand, per-market shortages, iterations, residual and convergence state. It does not mutate simulation time or input projections.
- **Integrated:** recipe outputs and inputs are both scaled by each firm's same solved fulfillment factor. The final market projection feeds the one definitive trade settlement, prices, market statistics, GDP and monthly inventory ledger. The current market's on-hand stock is exportable only after local demand is covered; world imports/exports remain paired and local stock never goes negative under the inventory settlement invariant.
- **Diagnostics:** optional `GameState.marketClearing` records tick, factory count, iteration count, configured cap, convergence flag and residual. It is diagnostic state, not an economic input; older saves with the field absent remain valid.
- **Tests present:** 14 in `tests/inventory.test.ts`: 4 bounded market solver cases, 2 factory material realization cases, 5 inventory accounting invariants and 3 economy/save integration cases. They cover deterministic convergence in a constrained market, stockpile export into a deficit market, iteration cap/non-convergence, invalid inputs, same-factor factory scaling, material conservation, ledger projection, save/load determinism and migration.
- **Numerical spot check:** an independent calculation of the single-market convergence fixture reached fulfillment 0.5208046 in 15 iterations with residual 8.03e-6. This is a formula sanity check only, **not** a Vitest execution or engine benchmark.
- **Execution verdict:** tests and typecheck remain `NOT_TESTED`. GitHub clone remains unavailable from the container due DNS resolution failure for `github.com`. GitHub combined status returned no status objects; the available workflow-run reader only surfaces pull-request-triggered runs and cannot verify the push-triggered Android APK workflow. No CI PASS/FAIL, run ID, Gradle result, artifact or APK hash is asserted.
- **Device QA/performance:** `NOT_TESTED`; no Android installation, CPU/memory/thermal profile or benchmark.
- **Known limitation:** if the bounded solver reaches 32 iterations without meeting tolerance, the last deterministic iterate is used and `marketClearing.converged=false` plus residual are preserved. A player-facing warning or conservative slowdown policy has not been implemented or tested. This remains a bounded approximation, not a proven globally converged general equilibrium. Firm-owned/region warehouses, agricultural/artisanal warehouse flows, canonical good units, storage capacity/spoilage, physical routes, stockpile policies and the inventory UI remain unimplemented.
- **Next exact action:** run typecheck + all Vitest/simulation suites + Android APK workflow on the exact source HEAD and fix all failures. Then benchmark monthly market clearing on representative world sizes and the target Android device; add adversarial cyclic/cross-market dependency tests and a documented non-convergence fallback before moving to regional warehouses and route logistics.



### CI/API evidence check for the above checkpoint

- Re-fetched the live experiment branch and handoff after the implementation/report commits; branch HEAD was `07d3296023c6fd91b47b45758b97a44ee3b8e7a2`.
- Default branch was rechecked and remained at `e4182491161e61065e4ac15228c5f59a8832ad1d`; it was not modified.
- `get_commit_combined_status` returned an empty status list for the implementation commit `d740e290d29f0e3d20f58361c95456ef12415d06`, test commit `f20580456c36238363b2780dc52dd4f26a70e711`, and handoff HEAD `07d3296023c6fd91b47b45758b97a44ee3b8e7a2`.
- The connected workflow-run reader returned no runs for the implementation and test commits. Its documented wrapper only returns pull-request-triggered runs, whereas this repository's Android APK workflow is push-triggered on all branches. This is an API coverage limitation, not proof that no push workflow exists.
- Therefore exact-SHA Actions execution is still `UNKNOWN / NOT_VERIFIED`. No test/build PASS is claimed.


## 2026-11-20 — ECONOMY-INVENTORY-LEDGER-03 / NON-CONVERGENCE SAFETY

- **Verified starting HEAD:** `f7c58b36bd6a4af6f12b8d51ee92ac2f447b09bd`.
- **Latest code/test commits:**
  - `7fb01d5b559e5505c33935f10bab1b1e68b423ca` — calculate the undamped fixed-point residual and fail closed if the solver does not converge within its iteration budget.
  - `721f89592d0d35a4f732c24119b9b5cc7d765dd8` — add the fallback policy to the diagnostic type.
  - `f8f039abec28bc871fd38875f6d1c215899dc975` — persist the applied fallback in `GameState.marketClearing`.
  - `3ee18675b3a1f81e355a25c63e6fef530e8d28a5` — add a two-market cyclic input/output test and assert that iteration-cap non-convergence shuts down recipe production rather than returning its partial factor.
  - `44ffb85884a7e0114586798ccced55a9f92e95ef` — assert converged cases do not invoke fallback.
  - `f35593267e88ab73c2b18048e72b25283c9d4cc9` — update the implementation report.
- **Files changed:** `src/engine/systems/economy.ts`, `src/engine/types.ts`, `tests/inventory.test.ts`, `docs/design/INVENTORY_LEDGER_IMPLEMENTATION_01.md`; this handoff update follows.
- **Convergence correction:** the solver now measures the undamped residual `|target - current|`, then recalculates and verifies the residual against the final returned market projection. The relaxation step is no longer used as a proxy for convergence.
- **Fallback:** when the iteration cap is exhausted or the final residual fails tolerance, all recipe-factory fulfillment factors are set to zero, and final supply/demand/shortage projections are recalculated from the non-recipe baseline. This prevents unsupported factory output/input from being journaled. The rest of the non-recipe economy and inventory settlement still advance.
- **Diagnostics:** `FactoryMarketSolution.appliedFallback` and optional `GameState.marketClearing.appliedFallback` record `none` or `zero-recipe-production`; `converged=false` and the pre-fallback residual remain visible in state. Legacy saves without `marketClearing` remain supported because the diagnostic object is optional.
- **Adversarial test:** added a symmetric cyclic two-market case where A's grain factory uses tools from B and B's tools factory uses grain from A. Expected fixed point is approximately 0.70 fulfillment in both markets; the test asserts convergence, both factors and shortage ratios.
- **Test count:** 15 in `tests/inventory.test.ts`: 5 solver tests (including cyclic cross-market, stockpile transfer, cap/fallback and invalid inputs), 2 factory flow tests, 5 standalone inventory tests and 3 simulation/save integration tests.
- **Formula-only spot checks:** single-market fixture converges in 16 iterations with final residual approximately `3.66e-6`; cyclic two-market fixture converges in 24 iterations with final residual approximately `5.78e-6`. These calculations independently check the iteration equations; they are **not** Vitest results or an execution of the repository source.
- **Test/typecheck/build verdict:** `NOT_TESTED`. No source test command or TypeScript compiler run completed in this session.
- **CI/Actions:** `NOT_VERIFIED`. The connected GitHub combined-status endpoint returns no check objects, and the available workflow-run wrapper only exposes pull-request-triggered runs, not this repository's push-triggered Android APK workflow. Public web search also returned no indexed run for the target SHA. This does not establish that Actions did not run; the run state is unavailable through the current interfaces.
- **Device/performance:** `NOT_TESTED`; no APK, Android install, memory/CPU/thermal profile or target-device market-clearing benchmark.
- **Fallback limitation:** the fallback is global for that monthly clearing. A pathological market can suspend recipe production in otherwise healthy markets for one month. This is deliberately conservative but may be disruptive; market-component-specific failure isolation and a player-facing notification remain future work.
- **Next exact action:** obtain direct Actions run evidence and run the 15 tests/typecheck/Android build at the exact branch HEAD. If they pass, benchmark representative world-size monthly clearing and then isolate convergence/fallback by connected trade-market component before adding regional warehouses, firm ownership and physical route capacity.



## 2026-11-20 — ECONOMY TEST FIXTURE CORRECTION / DOMAIN-VALID TRADE

- **Verified base HEAD:** `0f41bd4700697b18f56897f4097de6c7e7e16ed8` on `experiment/vic3-visual-upgrade`.
- **Implementation/test commit:** `e40bbdd12b7641ba0bea6d1ed2f958ced2f8d34a` — correct the two-market fixture and derive factory test flows from canonical recipes.
- **Design/report commit:** `30bca4d234ce08e730b3eac3232b3193314a5dfe` — document the domain correction and clarify that aggregate market allocation is not yet a physical shipment/contract system.
- **Files changed:** `tests/inventory.test.ts`, `docs/design/INVENTORY_LEDGER_IMPLEMENTATION_01.md`; this handoff append follows.
- **Owner feedback applied:** a market may need grain while its trading partner needs tools; the two markets exchange/sell their available surplus. A test must not invent a production chain merely to create a mathematical cycle.
- **Removed misleading fixture:** the old test-only operations (grain factory consumes tools; tools factory consumes grain) were not present in `RECIPES`. They never entered runtime data, but presenting them as a plausible factory cycle was a domain-modeling error.
- **Replacement trade fixture:** Market A has 100 grain supply and 130 tools demand; Market B has 100 tools supply and 130 grain demand. The test asserts that no more than 100 units of either good are transferred and that the remaining unmet demand is 30 units per destination (`30 / 130`). No factory recipe is assigned to grain or tools in this scenario.
- **Recipe test correction:** the constrained solver operation now uses the canonical `ironworks` recipe (25 steel output; 12.5 iron and 10 coal inputs). Factory material-realization tests use the exact `ironworks` and `tool_works` ratios from `RECIPES`, rather than hand-written ratios that drifted from engine definitions.
- **Test-source count:** 15 tests in `tests/inventory.test.ts` after the change. This is a source count only; it is not a test execution result.
- **Design boundary:** this verifies aggregate cross-market commodity allocation and remaining shortages only. It does not implement or prove trade contracts, shipment ownership, regional transport routes, route capacity, tariff settlement, customs or warehousing.
- **Validation verdict:** Vitest, TypeScript typecheck and Android Gradle/APK build are `NOT_TESTED` in this session. No GitHub Actions run ID/result or APK artifact is verified. Device QA and performance measurements are `NOT_TESTED`.
- **Self-review:** implementation intent and fixtures inspected against the current `RECIPES`; independent review is `PENDING`; owner acceptance is `PENDING`. Do not mark this task `REVIEW_PASS` or `ACCEPTED`.
- **Next step:** obtain exact-SHA test/typecheck/Android workflow evidence; then audit market trade allocation against the definitive inventory posting and ensure imports/exports, stockpile availability and shortage ratios describe one consistent physical flow before expanding to route logistics.


## 2026-11-20 — ECONOMY TRADE ALLOCATION / SINGLE SOURCE OF TRUTH

- **Verified base HEAD:** `b93dc7f51cc69955fa61022e7b201407232c93a7` on `experiment/vic3-visual-upgrade`.
- **Engine commit:** `fd6edb8b43efbcc86047f94106b147489ccf66a5` — make the bounded solver return its final per-market import/export flows and world trade totals, then reuse those exact flows for final prices/statistics/inventory posting.
- **Test commit:** `68dd112af4865a18fac4125da8466ad8f5741e8a` — assert reciprocal grain/tools trade quantities and reconcile solver shortage ratios with monthly `settleInventoryFlow` settlement.
- **Design/report commit:** `cc44d85c8f70ed671f6b2f68d7b93a5b198e26a9` — document the shared allocation contract.
- **Files changed:** `src/engine/systems/economy.ts`, `tests/inventory.test.ts`, `docs/design/INVENTORY_LEDGER_IMPLEMENTATION_01.md`; this handoff append follows.
- **Audit result:** the previous solver shortage projection and final monthly inventory posting used duplicated formulas that currently matched. This change removes the duplicate implementation rather than claiming that a live material-flow mismatch was found.
- **New contract:** `FactoryMarketSolution` now returns annualized per-market `imports` and `exports` plus openness-weighted `worldTrade` totals, all calculated from the final converged/fallback supply/demand projection and the same opening inventory balances.
- **Integrated:** world price targets use the returned world totals; final inventory posting, market statistics and monthly ledger entries use the exact imports/exports returned by the solver. The monthly ledger boundary still converts annualized engine quantities by dividing by 12.
- **Tests present:** 15 in `tests/inventory.test.ts`. The reciprocal trade test expects 100 units of grain and tools to be transferred in opposite directions and checks that buyer unmet-demand ratios match the solver's shortage projection after physical monthly settlement. Existing integration tests continue to assert globally paired ledger imports/exports.
- **Validation verdict:** Vitest, TypeScript typecheck and Android Gradle/APK build remain `NOT_TESTED` in this session. Combined GitHub status returned no status objects for the handoff HEAD; the connected workflow-run reader is limited to pull-request-triggered runs and returned no runs. Push-triggered Android Actions are therefore `NOT_VERIFIED`, not assumed absent or passing.
- **Device QA/performance:** `NOT_TESTED`; no APK installation, Android device measurement or benchmark is claimed.
- **Self-review:** source formulas and call sites inspected; independent review `PENDING`; owner acceptance `PENDING`. Do not mark `REVIEW_PASS` or `ACCEPTED`.
- **Next action:** obtain direct exact-HEAD test/typecheck/Android workflow evidence. Then audit trade-market openness, subject/customs-union market membership and stockpile transfers against sourced Victoria 3 mechanics and game design before adding shipment routes or contracts.


## 2026-11-20 — ECONOMY CUSTOMS-UNION MARKET AUTHORITY / ACTIVE-MEMBER FALLBACK

- **Verified code/test base:** `0f41bd4700697b18f56897f4097de6c7e7e16ed8` on `experiment/vic3-visual-upgrade`; previous end-of-slice HEAD was `5b121db0039c0f5b042c0f8bb5e98a9393a43908`.
- **Build/type correction:** `ef620fc415a1a4de0f93a3658a583763260bbf2b` fixes TS7053 in `tests/inventory.test.ts` by iterating `GOODS` rather than untyped string keys from `Object.entries()`.
- **Market policy implementation:** `5174d5cadb14d1b5930717833c5ff30c5f19b2ae` adds `marketPolicyCountry` and uses the declared customs-union treaty leader rather than the first region/member encountered.
- **Fallback correction:** `584ed577ded5de157a618ccd73103f86d642c3b6` prefers the living treaty leader, then the first living member, and preserves an existing recorded policy Country object only when every recorded member is inactive. This prevents a stale market projection from aborting the monthly simulation without substituting an unrelated country.
- **Tests:** `bdb815e29c3fb7468e75a1e19873558eff2d692c` adds coverage for declared-leader precedence, national-market identity, stale/dead leader fallback and all-inactive member compatibility. `tests/inventory.test.ts` now contains 19 tests.
- **Design/report update:** `b2ca42469d645d17bd95c995c18f72a8debcbb60` appends §14 to `docs/design/INVENTORY_LEDGER_IMPLEMENTATION_01.md`.
- **CI history:** run #416 (`44715001338`, SHA `5b121db`) failed during TypeScript build on TS7053; run #418 (`44715928980`, SHA `5174d5c`) failed in tests with `Market TEX has no active policy country` (48/49 tests passed, with dependent suites also aborting); run #419 (`44715954276`, SHA `0837d42`) tested the same active-only resolver before the stale-market fallback and failed for that reason.
- **Latest verification in progress at this handoff append:** Android workflow run #421 (`44716363882`, code/test SHA `bdb815e29c3fb7468e75a1e19873558eff2d692c`) has passed `npm ci`, `npm run build` (including `tsc --noEmit` and Vite build) and generated-data/web-bundle hashing; Vitest is still running. Run #420 (`44716335003`, SHA `584ed577`) is also running but predates the final fallback test.
- **APK/device:** Gradle/APK steps have not started on the latest run at this checkpoint. No APK artifact, APK SHA-256, Android installation or device-performance evidence is claimed.
- **Self-review/owner status:** ChatGPT self-review only; independent review `PENDING`, owner acceptance `PENDING`. Do not label this task `REVIEW_PASS` or `ACCEPTED`.
- **Next action:** inspect the completion and evidence artifact of run #421 on the exact code/test SHA. If tests fail, fix the exact finding; if tests pass, verify Gradle APK and the uploaded provenance/checksum artifact. Then audit market membership lifecycle (including stale `customsUnion` references) before implementing additional route/capacity mechanics.


## 2026-11-20 — TEST FIXTURE CORRECTION / EXPLICIT FULL HIRING BASELINE

- **Test-only implementation commit:** `12ab70f4d6b61617710f8de1779e1691fec8235f` — make the occupational-transition test establish a complete 100%-utilization baseline for every productive building before reducing selected hiring targets.
- **Reason:** workflow run #420 (`44716335003`, source SHA `584ed577ded5de157a618ccd73103f86d642c3b6`) ran the full Vitest suite and reported 114/115 passing. The sole assertion failure was `tests/simulation.test.ts` at the occupational-transition test: reduced factory capacity `96500` was greater than the earlier comparison capacity `95467.7723`. Fresh-game economy calibration had already populated some hiring targets; the test then overwrote only selected targets, while omitted building types defaulted to 100%, so the two sides did not share a controlled baseline.
- **Correction:** before measuring `fullCapacity`, the test now explicitly sets targets for textile mill, ironworks, tool works, arms works, luxury workshop, mine, logging and plantation to 1. It then applies the intended reduced targets. Runtime population/economy code is unchanged by this test-only correction.
- **Current exact verification:** run #421 (`44716363882`, code/test SHA `bdb815e29c3fb7468e75a1e19873558eff2d692c`) remains in progress at this checkpoint; run #422 (`44717245006`, test-fix SHA `12ab70f4d6b61617710f8de1779e1691fec8235f`) has started and is the authoritative full test/build run for the latest source.
- **Build evidence available so far:** on runs #420/#421, `npm ci`, `npm run build` (TypeScript `tsc --noEmit` and Vite build), and generated data/web-bundle hashing succeeded. Run #420 stopped at Vitest; Java/Gradle/APK steps were skipped.
- **Latest test scope:** full CI Vitest run covers 6 test files, 115 tests, 44 nested suites, excluding the separately pinned S0 baseline-only `tests/s0-save-determinism.test.ts`. Inventory file alone now has 19 tests.
- **APK/device:** no APK is verified from run #420. Run #422 must pass tests before Android Gradle steps can proceed. No physical-device QA or performance measurement has been performed.
- **Self-review/owner status:** implementer self-review only; independent review `PENDING`, owner acceptance `PENDING`. The task is not `REVIEW_PASS` or `ACCEPTED`.
- **Next action:** inspect run #422's Vitest result, then verify Gradle APK and the CI evidence artifact/checksum on its exact SHA. Fix only concrete failures; do not weaken assertions to force a green run.

## 2026-11-20 — DIPLOMACY / BILATERAL ALLIANCE & MULTILATERAL TECHNOLOGY CHECKPOINT

- **Task:** `DIPLOMACY-ALLIANCE-TECH-01`
- **Owner instruction:** keep military Alliances separate from Customs Unions; a country may acquire multiple military allies after the appropriate Victoria 3 technology; base the mechanic on Victoria 3 rather than arbitrary limits. Owner then explicitly requested a pause, durable GitHub report and next-session handoff.
- **Working branch:** `experiment/vic3-visual-upgrade` (owner authorization: `docs/coordination/OWNER_IMPLEMENTATION_AUTHORIZATION_2026-11-20.md`, blob SHA `0a8cfc2967b9f0a0717a79dc60486d9f2c8fb32d`). Do not modify default branch, merge, rebase or create a PR.
- **Base source checkpoint for the slice:** `cddaa39f91907ce792e3e6ca38352013c4ba6bf5`.
- **Source checkpoint tested by CI:** `b1cf8c852b7a223f4aca992ee950e561491fc2c7`.
- **Source delta:** 28 commits ahead / 0 behind at the comparison point; nine files changed.
- **Durable implementation report:** `docs/design/DIPLOMACY_ALLIANCES_AND_MULTILATERAL_TECH_REPORT_2026-11-20.md`, blob SHA `1a3964d0eaa9fe5549786d6958a9e70733c7cf2f`, report commit `a4457dff8943502822ae82e77b3a4acfdd6b0ff1`. Read this report in full before touching code.
- **Latest branch HEAD at this handoff append:** `a4457dff8943502822ae82e77b3a4acfdd6b0ff1` before the present handoff commit. The report commit changed docs only; it did not change the source checkpoint tested by run #454.
- **Latest tested CI:** run #454, ID `44721610964`, source SHA `b1cf8c852b7a223f4aca992ee950e561491fc2c7`, URL https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44721610964. `npm ci`, data/map/web build and generated bundle hashing passed; Vitest **129/131 passed, 2 failed**. Failures are both in `tests/modes.test.ts`: AI Alliance action count is 0 where the short-run mode tests expect positive counts (>0 and >5). The new diplomacy tests pass. Earlier save/load determinism failures from intermediate runs are no longer present in #454.
- **APK:** Gradle/Android asset sync/APK steps were skipped because Vitest failed. No APK, artifact checksum, device installation, device QA or performance results are verified.
- **Current implementation state:** technology branch ending in `multilateral_alliances`; Alliance gate checks International Relations and multiple-Alliance capacity; AI's fixed three-Alliance ceiling removed; historical grouped Alliance source rows normalized into bilateral pairs at new-game initialization and save deserialization; Vietnamese technology labels/effect added; tests added. This is PARTIAL, not accepted.
- **Critical unresolved model defect:** the source CoW records have both `defense` and `entente` flags. At 1836 there are 13 active records; five are multi-country groups (3–8 members); expansion yields 51 pair occurrences / 41 unique pair edges. Current `init.ts` still maps all rows to `type: 'alliance'`; the live Treaty union does not yet distinguish `defensive_pact`. Do not treat all historical pacts as Alliance. The normalization helper also merges repeated pair occurrences and concatenates source IDs; inspect overlapping records before deciding whether they are duplicate provenance or distinct pact types. Report §4 contains details.
- **Next session must:** re-fetch HEAD, branch and CI; read `AI_START_HERE.md`, recovery protocol, collaboration protocol, owner principles, owner authorization, this handoff and the full diplomacy report. The recovery/protocol/owner-principles files currently exist on the designated default branch; fetch and cite their exact SHAs if absent on the experiment branch. Re-check exact branch authorization before editing.
- **Priority 1:** resolve the correct treaty taxonomy: at minimum Alliance, Defensive Pact, Guarantee Independence and Customs Union; encode the source `defense`/ `entente` fields; define mutual exclusions, technology capacity, defensive war calls, break/leave behavior and source provenance.
- **Priority 2:** diagnose the two #454 AI mode-test failures. Do not weaken assertions or remove researched technology requirements merely to get green tests. Check starting historical alliances, AI research priority/cadence and the short simulation horizon; update the model/tests only after the intended behavior is clear.
- **Priority 3:** preserve deterministic treaty order, idempotent save migration, overlapping historical pacts and Customs Union leader/membership. Add tests for one treaty being broken without destroying a distinct agreement, pair-specific calls to arms and save/load continuation.
- **Priority 4:** run full CI on the exact new source HEAD. Only after Vitest passes should Gradle/APK proceed. Verify the APK artifact and checksum. No independent review or owner acceptance has occurred.
- **Status:** `IN_PROGRESS — CI_FAILED — REDESIGN REQUIRED`; source/data/web build PASS on tested SHA; full tests FAIL; APK NOT_BUILT; device QA NOT_TESTED; independent review PENDING; owner acceptance PENDING.
- **Pause rule:** do not continue coding in this checkpoint. The owner asked to stop after writing the report/handoff and continue in a new conversation.


## 2026-11-20 — DIPLOMACY CI #457 TRIAGE / DIRECTIONAL MIGRATION FIX

- **Base HEAD:** `fbbfbe2371f45a967ade033d1970746b90109e4d` on `experiment/vic3-visual-upgrade`.
- **Actions #457:** run ID `44728018979`, URL https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44728018979, FAILURE on the base SHA. `npm ci`, data/map/web build and bundle hash passed; Vitest 136/139, three failures; Android Gradle/APK steps skipped.
- **Root cause A:** the start-date fixture still asserted that CoW Defense Pact records were runtime Alliances. Updated it to assert the exact source IDs and Defensive Pact type; did not reclassify the historical agreement as an Alliance to satisfy the test.
- **Root cause B:** the scripted Prussian player war targeted Bavaria while the historical `cow_ally_3` Defense Pact/NAP was active. The scenario now explicitly withdraws from that pact at tick 11, then declares war at tick 12. The runtime NAP block remains.
- **Root cause C:** full serialized diff showed one difference only: a Guarantee Independence member array changed from `['FRA','BEL']` to `['BEL','FRA']` after loading. Historical bilateral normalization had sorted every treaty, including directional guarantees. Migration now preserves order for bilateral/directional non-source treaties and only canonicalizes symmetric historical source pairs.
- **Taxonomy correction:** the source's explicit legal category now takes precedence over overlapping CoW flags (e.g. a Non-Aggression Pact with an Entente descriptive flag remains a Non-Aggression Pact). All four source flags are still retained in treaty terms.
- **Added regression coverage:** category-based classification and direction-preserving save migration; updated temporal source assertions and player-war scenario.
- **New source/test commit and exact Actions result:** pending post-push verification. APK/device QA, independent review and owner acceptance remain pending.


## 2026-11-20 — DIPLOMACY CI #458 VERIFIED / DEBUG APK ARTIFACT

- **Task:** `DIPLOMACY-ALLIANCE-TECH-01`; working branch `experiment/vic3-visual-upgrade`.
- **Base/source SHA tested:** `77d1ecc011f93338af6002f93254eb27ef385a0a` (taxonomy precedence + directional treaty migration correction).
- **GitHub Actions:** run #458, ID `44731346652`, exact SHA above, SUCCESS: https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44731346652
- **Build/test:** `npm ci` PASS; data/map/web build and generated bundle hash PASS; Vitest exit 0, **8 test files, 140/140 tests, 48/48 suites PASS**; Android SDK setup and Capacitor asset sync PASS; `./gradlew assembleDebug --no-daemon` **BUILD SUCCESSFUL**.
- **APK:** `app-debug.apk`, 18,063,358 bytes; APK SHA-256 `59444a7bb9585331df1da1d63f8d0bb44175223b9520b010c78caf5601a13c6e`. Artifact `dong-chay-lich-su-debug-apk`, ID `14626158922`, ZIP SHA-256 `d51bdf15197c5790034f5038c44c23ae5c0633c10c5097f80b991ed6eb935a2d`; expires 2027-02-18. CI evidence artifact ID `14626323498`, ZIP SHA-256 `5404311764a3c50594331d74080ca0738c4991bb76e6ea4e6dbee15490893570`.
- **Signing:** debug certificate only (CN=Android Debug; certificate SHA-256 `2378a97f5b95b393954a071a55ed8d4241112e81b1bbfe03752e760b58bb32ac)); this is not a release-signed APK and no signing keys/secrets were changed.
- **Evidence integrity:** downloaded CI evidence ZIP and inspected `test_summary.txt`, `apk_sha256.txt`, `artifact_zip.txt`, provenance and certificate report. Separately downloaded the APK artifact, extracted `app-debug.apk` and recomputed SHA-256; it matches the CI evidence exactly.
- **Device QA:** NOT_TESTED. APK installation, launch, save/load, thermal/memory and gameplay QA on a physical Android device remain outstanding.
- **Review/acceptance:** implementer self-check only; independent Claude review PENDING; owner acceptance PENDING. Do not label task complete or subsystem parity PASS.
- **Next:** deliver this APK for owner device verification; then prepare a focused review packet for Claude against exact source SHA `77d1ecc...`. After device feedback/review, continue the next authorized diplomacy gap; do not broaden into unrelated subsystems.


## 2026-11-20 — DIPLOMACY EXACT-TREATY WITHDRAWAL SLICE (CI PENDING)

- **Task:** `DIPLOMACY-ALLIANCE-TECH-01`; base HEAD `46cc2c7e93e2280f30d6742c7d82abaa4248e423`; branch `experiment/vic3-visual-upgrade`.
- **Finding:** multiple historical bilateral agreements can exist for the same pair and treaty type (for example overlapping CoW source pacts). The previous `breakDefensivePact(st, a, b)` removed every same-type treaty for that pair, so the player could unintentionally destroy independent source agreements with one action. The same broad removal existed for Alliances.
- **Change:** `breakAlliance` and `breakDefensivePact` accept an optional exact `treatyId`. UI treaty rows now offer one withdrawal action per active bilateral agreement and pass its stable ID; commands validate the ID against the selected pair/type. Existing scripted commands without an ID retain the legacy whole-pair withdrawal behavior for compatibility.
- **Regression tests added:** withdrawing from one of two overlapping Defensive Pacts leaves the other agreement and its NAP term active; a treaty ID from a different pair is rejected without mutation.
- **Changed files:** `src/engine/systems/diplomacy.ts`, `src/engine/commands.ts`, `src/ui/screens/Diplomacy.tsx`, `tests/diplomacy.test.ts`, this handoff and the diplomacy report.
- **Validation:** pending exact-source CI; no PASS claimed. Physical-device QA, independent Claude review and owner acceptance remain pending.
- **Next:** inspect exact CI/test result; if green, verify APK and review UI presentation for duplicate treaty rows. Then handle the next diplomacy-specific invariant without changing unrelated systems.


## 2026-11-20 — WAR PREVIEW RNG ISOLATION SLICE (CI PENDING)

- **Task:** `DIPLOMACY-ALLIANCE-TECH-01`; base HEAD `0100bb56ac0dddd3fd0713229ce891c116b681cd`; branch `experiment/vic3-visual-upgrade`.
- **Finding:** the WarDialog recalculates `warSides()` during render, including progress updates while the player holds the declare-war button. `warSides()` called `joinWillingness()`, which called `rand(st)` and mutated the campaign RNG. Merely opening/re-rendering a preview could therefore advance simulation randomness and make outcomes depend on UI render cadence.
- **Change:** factored the xoshiro step into a shared helper and added `createRandomPreview()`, which advances a cloned RNG state. `warSides()` uses this pure preview stream by default; `declareWar()` explicitly opts into consuming the live RNG at the moment the war is actually declared. This preserves random call-to-arms resolution without letting UI previews mutate the campaign.
- **Regression test:** repeated war-side previews return the same result and leave `state.rng` unchanged; an actual declaration still advances the campaign RNG.
- **UI cleanup:** mapped per-treaty withdrawal rows now receive stable React keys.
- **Changed files:** `src/engine/core.ts`, `src/engine/systems/diplomacy.ts`, `src/ui/screens/Diplomacy.tsx`, `tests/diplomacy.test.ts`, this handoff and the diplomacy report.
- **Validation:** pending CI on the exact commit. No PASS claimed.


## 2026-11-20 — OWNER PLAYTEST FEEDBACK / SYSTEM REDESIGN + DAILY CLOCK SLICE

- Owner supplied five screenshots and one gameplay recording (85.6 seconds) and explicitly requested a broad Victoria 3 re-review and redesign. Scope includes time pacing, Nguyễn-dynasty identity and portraits, technology, construction, recruitment/army organization, battle progression, treaty negotiation and overall visual quality.
- Branch: experiment/vic3-visual-upgrade. No default-branch change, merge, rebase, PR or force-push.
- Base source: 477ceb078786219ca0faf202ba66d0bfac26b390.
- Current source commit: fcadf1d82edda6615503b79fa9a9c2532d4c197a — daily calendar and RAF-independent timer.
- Code: add Gregorian dayOfMonth and stepDay; keep the expensive country-simulation pipeline at month boundaries; replace RAF-driven simulation with a timer that advances one calendar day at a time; show day/month/year in the top bar; migrate old v1 saves without day data to day 1.
- Speed mapping in source: 10,000 / 6,000 / 4,000 / 3,000 / 2,000 ms per game day for speeds 1–5. Speed 5 is capped at 0.5 Gregorian day per real second. These values implement the owner ceiling; they are not a Victoria 3 or device benchmark.
- New tests: daily calendar progression, monthly systems only at month boundaries, Gregorian leap-year February, legacy save default, daily save/load determinism, speed-5 ceiling and ordered speed levels.
- Code/test files: src/engine/types.ts, src/engine/init.ts, src/engine/simulation.ts, src/engine/save.ts, src/ui/game/controller.ts, src/ui/App.tsx, tests/simulation.test.ts and tests/ui.test.ts.
- Actions #462, ID 44737688243, exact SHA fcadf1d82edda6615503b79fa9a9c2532d4c197a, was IN_PROGRESS when this note was written: https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44737688243. No CI PASS or updated APK is claimed.
- Boundary: this is a daily calendar and FPS-independent pacing slice, NOT the six-hour regular tick/task graph. The domain simulation remains monthly. Daily/weekly/six-hour tasks, task dependency graph, Worker boundary, overload instrumentation and Android device QA remain open.
- Full playtest findings and staged redesign: docs/feedback/PLAYER_PLAYTEST_TRIAGE_2026-11-20.md. Read it before touching these domains.
- Priority after CI: (1) identity assets and date-aware ruler portraits/flags, (2) construction capacity/sectors and public/private queues, (3) per-country tech starts and complete prerequisite/effect data, (4) recruitable battalions/formations, commanders/fronts and battle records, (5) treaty proposal/counteroffer/ratification and diplomatic plays, (6) unified UI/UX redesign throughout.
- Historical correction: Vietnam National Archives and Vietnam National Museum of History sources state that the Nguyễn court changed the quốc hiệu to Đại Nam in 1838. Verify the exact effective date against the primary edict before changing display names; a November 1838 screen should not uncritically say Việt Nam.
- Victoria 3 reference mechanics: Paradox Dev Diary #76 describes six-hour regular ticks and separate daily/weekly/monthly/yearly tasks; #44/#77 describe front advancement, generals, battle unit selection and reports; #71 describes government/private construction capacity allocation; #146 and the 1.15.0 update cover treaty articles and negotiated transfer agreements. Current 1.15.2 must be checked when revisiting each mechanic. The 1.15.1 449-country/179-tech/seven-start-package comparison is from a third-party audit of game files and matching saves, not an official Paradox statement.
- Baseline CI: commit 477ceb0... passed 48/48 suites and 143/143 tests. Its debug APK SHA-256 was ca56760c5ed39c2808e9596686fe525fcefa9fd30800aa03c53bed9a61cbe463, but that APK predates the daily-clock changes.
- Device QA NOT_TESTED; independent review PENDING; owner acceptance PENDING. No release signing credentials changed.
- Recovery: fetch current HEAD and Actions #462 first. If failed, inspect exact logs and fix narrowly. If successful, inspect exact SHA artifact/checksum and append evidence. Do not declare feature parity complete.


## 2026-11-20 — DAILY CLOCK SLICE CI #462 VERIFIED

- **Current tested source:** \`fcadf1d82edda6615503b79fa9a9c2532d4c197a\` (\`fix(clock): advance calendar by day independently of rendering\`).
- **GitHub Actions:** run #462, ID \`44737688243\`, SUCCESS on the exact source SHA: https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44737688243
- **Build/tests:** \`npm ci\` PASS; data/map/web build PASS; generated hashes PASS; Vitest exit 0; **8 files, 50/50 suites, 148/148 tests PASS, 0 unhandled errors**; Android SDK and Capacitor asset sync PASS; Gradle \`assembleDebug\` BUILD SUCCESSFUL; APK signature verification PASS.
- **Debug APK:** artifact ID \`14629388175\`, file size \`18,063,738\` bytes; APK SHA-256 \`c26ce32d38b077df2311759d43d7eba87f89c67f2e57cc4527401931980a0135\`; archive ZIP SHA-256 \`c0d4ac56a54583c5a9333629777d97ffb56e2d8d123232824ee22080befa9428\`; expires 2027-02-18.
- **CI evidence artifact:** ID \`14629567697\`, ZIP size 113,019 bytes, SHA-256 \`606a75daa7f32495609f47b1ad5186ede609ef7f8a02123cfa548feccedb7254\`.
- **Integrity check:** downloaded both artifacts; extracted \`app-debug.apk\`; recomputed APK hash equals \`apk_sha256.txt\`; debug APK ZIP digest equals \`artifact_zip.txt\`; provenance records the exact source commit and run ID.
- **Signing:** debug key only, certificate DN \`C=US, O=Android, CN=Android Debug\`; certificate SHA-256 \`a330fb77969a8f5658ad86b2f62fcc49d0ab5063f8fe3f7f9a45552d717fd6cb\`. Not release-signed.
- **Important:** the APK includes the daily calendar and RAF-independent speed correction from \`fcadf1d\`. It does not include a six-hour task graph or the later identity/construction/technology/military/diplomacy redesign slices.
- **Device QA:** NOT_TESTED. Install/launch, pause/resume, background/foreground, save/load, speed feel, thermal/RAM and long-run timing on the owner's Android remain outstanding. Independent review PENDING; owner acceptance PENDING.
- **Current branch docs head at time of this report update:** this evidence addendum is being committed after the playtest report; re-fetch the branch head after push before any code change.


## 2026-11-20 — DATE-VALID RULER RESOLUTION (CI PENDING)

- Base source: 17796069ee29038f149ddf215e5824f14c7c6483; branch: experiment/vic3-visual-upgrade.
- Changed `src/ui/game/content.ts`: added `historicalDateBoundary`, `characterHoldsRoleOnDate`, and `characterByNameOnDate`. Year-only and month-only source terms are expanded to inclusive Gregorian boundaries; invalid dates fail closed.
- Changed `src/ui/screens/Country.tsx`: `IdentityHeader` now selects the current ruler portrait only when the engine ruler's name AND an active, date-valid `head_of_state` term both match. Roster status uses the same date-aware check.
- Added `tests/historical-identity.test.ts` for Minh Mạng / Thiệu Trị / Tự Đức terms, endpoint inclusivity, month/year precision, malformed dates and leap-year boundaries.
- CI was still running for parent commit 17796069 at note creation. This patch requires a new exact-SHA Actions run. Do not claim full validation until all tests and APK assembly pass.
- Scope remains incomplete: daily rather than six-hour scheduler; monthly simulation pipeline; four shared technology tiers and five overrides only (48 techs, 3 branches, no post-1949 technology coverage); one basic construction queue without construction sectors/public-private investment; aggregate military rather than recruitable battalions/formations/fronts/battle records; treaty state without offer/counteroffer/ratification. The playtest report has the complete evidence and staged acceptance gates.
- Next: verify this exact commit and the parent retry-enabled portrait pipeline. Then implement independent system slices with domain-state migration, shared player/AI command paths, deterministic simulation tests and save/load coverage. Keep all work on the existing feature branch.

## 2026-11-20 — 1836–2026 CAMPAIGN BOUNDARY (CI PENDING)

- Base commit: d143afafc1b20c617d2824c8f3ae2dee05934cf5; branch: experiment/vic3-visual-upgrade.
- The hard-coded game end was still January 1936, despite the approved campaign scope. `GAME_END_YEAR` is now 2027 as an exclusive terminal boundary; January 1, 2027 is the stop marker after the complete 2026 calendar year.
- Updated the world/system panel and app metadata to display a playable range of 1836–2026. Added tests for Dec 31, 2026 -> Jan 1, 2027, frozen terminal state, and legacy saves beyond the new boundary.
- This is a campaign-length correction, not a claim of full 20th/21st-century simulation content. Technology data currently has 48 nodes and zero post-1949 nodes; additional 1936–2026 events/modern content and device performance testing remain open.
- Requires an exact-SHA build/test/APK run after commit. Re-fetch branch HEAD before the next write.

## 2026-11-20 — CAMPAIGN 1836–2026 CI #468 VERIFIED

- **Tested source:** `c1178d1dad35d77f43264894b61142076a9c3be6`, branch `experiment/vic3-visual-upgrade`.
- **GitHub Actions:** run #468, ID `44743240745`, SUCCESS: https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44743240745.
- **Validation:** `npm ci`, data/map/web build, generated hashes, Vitest, Capacitor Android sync, Gradle `assembleDebug`, APK checksum/provenance/signature all PASS. Vitest: **53/53 suites, 156/156 tests; 0 failed, 0 pending**.
- **APK artifact:** ID `14632745269`, archive size 18,759,096 bytes, SHA-256 `2665a6e658176bf5727d70b8ba7dc20e9b7ba91c637431fcebff417d9bc8bf07`; expires 2027-02-18.
- **APK payload:** 19,264,237 bytes; SHA-256 `dcc7164f40427a2ec3a95167cd7d8d3c88c96d89a4fbabeaa5c11134b8c6ee14`.
- **Evidence artifact:** ID `14630899800`, 114,290 bytes; SHA-256 `40e96f5864d1aa3489a6a5770b70b618a10be08fd44bf31b2e9a4fea9033b597`.
- **Integrity:** downloaded APK recomputed SHA-256 equals CI file; ZIP digest equals CI artifact evidence; provenance exact commit/run confirmed.
- **Signing:** debug-only, DN `C=US, O=Android, CN=Android Debug`; certificate SHA-256 `50518e3bc50fad166628725df401c606f38ba5ef84ee3ecd89d868131557581c`. No release signing key or secret was changed.
- **Important scope:** campaign runs through 2026 but post-1949 tech/historical content is not populated. This does not represent 2026 system parity.
- **Current playtest audit and architecture plan:** `docs/design/VICTORIA3_PARITY_REBUILD_PLAN_2026-11-20.md`. Read it before implementing clock/tech/construction/military/diplomacy/UI slices.
- **Next authorized implementation:** CLK-B six-hour regular tick + explicit cadence scheduler, with migration/determinism/performance tests. Do not simply invoke the monthly pipeline four times per day.
- Device QA NOT_TESTED; independent review PENDING; owner acceptance PENDING; feature parity NOT_COMPLETE.
