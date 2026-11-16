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
| Gate verdict vocabulary | Protocol "Status vocabulary" (`PASS`, `PARTIAL`, `BLOCKED`, `FAIL`, `NOT_TESTED`, `NOT_APPLICABLE`); where the approved S0 document writes "NOT TESTED" it means `NOT_TESTED` |
| Legacy roadmaps and pre-protocol work | `docs/roadmap/LEGACY_DOCUMENTS_INDEX.md` (historical evidence, not authorization) |
| Current approved phase | **S0-A** (baseline as-is, `BASELINE_ORIGINAL`; approved document §6.3) — `AUTHORIZED` 2026-11-16 (OD-20261116-10) |
| Current task status | S0-A `IN_PROGRESS`; `COORDINATION-REVIEW-BD5787F` `READY_FOR_REVIEW` |
| S0 execution authorized | **S0-A only.** S0-B (B1–B7), S1 and every later phase: **NOT AUTHORIZED** |
| Gameplay/engine/save changes authorized | NO |
| Signing/keystore/Secrets changes authorized | NO |

The SHA above is a historical observation. Re-check GitHub HEAD before every task.

## 2. Current gate — S0-A only

S0-A is authorized (OD-20261116-10) within the approved document §6.3 (A1–A5). Until the owner separately authorizes S0-B:
- No S0-B work: no CI checksum workflow, C3 signing workflow, audit scripts, characterization tests or fixtures, Diagnostic UI.
- No gameplay, engine, data, UI, test, save-format or migration changes.
- No signing, keystore or GitHub Secrets changes.
- S0-A commands that generate files run in a temporary worktree outside the main working tree; S0-A commits contain only reports and logs under `docs/audit/s0/` (plus this handoff).
- No S1 or later work. After S0-A, stop for independent ChatGPT review; no self-acceptance and no phase transition.

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
| S0-A — Baseline as-is (`BASELINE_ORIGINAL`), approved document §6.3 A1–A5 | `IN_PROGRESS` | Owner approval of the S0 v3.2 document and S0-A authorization (OD-20261116-09, -10) — met | S0-A evidence committed; ChatGPT review; owner decision |
| S0-B — Audit tooling (`AUDIT_INSTRUMENTED`), approved document §6.3 B1–B7 | `NOT_STARTED` — not authorized | Separate owner authorization after S0-A review | All S0 gates G0.1–G0.9 evidenced; ChatGPT `REVIEW_PASS`; owner `ACCEPTED` |
| S1 — Data architecture and save foundation | `NOT_STARTED` | S0 accepted and S1 scope separately approved | S1 acceptance criteria met; independent review; owner accepted |
| S2+ | `NOT_STARTED` | Previous phase accepted and next scope approved | Phase-specific acceptance and owner approval |

Detailed phase scope comes from the canonical roadmap (section 1), within the limits of explicit owner authorizations. This table is not a substitute for that roadmap.

Pre-protocol work:

| Work | Classification | Register | Note |
|---|---|---|---|
| Earlier stages 1–5 (identity/content, numbering of an earlier specification) | `PRE_PROTOCOL_IMPLEMENTED_REPORTED` | `docs/roadmap/LEGACY_DOCUMENTS_INDEX.md` | Not `REVIEW_PASS` or `ACCEPTED`; part of the current baseline; S0 verifies what is present at the frozen SHA |

## 5. Work log

Append newest entries at the top. Do not overwrite earlier entries.

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

| ID | Severity | Finding | Evidence | Status | Required action |
|---|---|---|---|---|---|
| — | — | No findings recorded yet | — | — | — |

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
| 2026-11-16 | OD-20261116-08 | Canonical roadmap is `PENDING_OWNER_APPROVAL` until approved and committed; the currently available proposal is identified only as a pending proposal | This handoff, protocol, legacy index | Same document, "Additional source-of-truth correction" |

## 8. Update rules

- Claude updates status and implementation evidence after each approved task.
- ChatGPT appends independent review findings after checking GitHub.
- The owner-decision section changes only after an explicit owner decision.
- Preserve the work log; append rather than overwrite.
- If HEAD changes during review, report the new SHA and re-review that exact commit.
- A handoff update never substitutes for source code, logs, tests, or artifacts.
- A commit cannot record its own SHA. A commit that updates this file is identified by GitHub commit metadata (`git log -- docs/coordination/AI_HANDOFF.md`); the next update records it explicitly.
