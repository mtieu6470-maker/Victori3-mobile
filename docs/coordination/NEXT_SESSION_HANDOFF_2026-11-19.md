# Victori3 Mobile — Handoff for next session

**Updated:** 2026-11-19 (Asia/Ho_Chi_Minh)  
**Repository:** https://github.com/mtieu6470-maker/Victori3-mobile  
**Working branch:** `experiment/vic3-visual-upgrade`  
**Verified branch HEAD at handoff:** `3e2e1d546efee4ee20d19b1da5a86403277006f7`  
**Project:** Currents of History / Victoria 3 Mobile. This is NOT Shizu Omni.

## 1. Mandatory working boundaries
- Work only on `experiment/vic3-visual-upgrade`.
- Never edit, merge, rebase, reset, force-push, or overwrite `claude/game-historical-sandbox-modes-kg7rj7` or the default branch.
- Do not create a PR unless the owner explicitly requests it.
- No paid services, paid coding agents, APIs, or subscriptions without explicit consent.
- S0 work is audit/evidence only. No gameplay, engine, RNG implementation, save schema/serialization, history data, assets, Gradle, signing, secrets, or APK-install changes unless a separate owner authorization explicitly permits them.
- Owner acceptance remains separate from reviewer `REVIEW_PASS`; do not mark owner-accepted or start S1 on the owner's behalf.

## 2. Current verified repository state
Latest commits on the experiment branch are S0-B7 documentation/review-packet updates. The branch HEAD is `3e2e1d546efee4ee20d19b1da5a86403277006f7` (2026-11-18 15:55:17 UTC), commit message: `S0-B7: refresh review manifest with P2 table and Claude report template [skip ci]`.

The existing `docs/coordination/AI_HANDOFF.md` remains the canonical shared status index. Its current summary states:
- S0-B3: bounded `REVIEW_PASS`.
- S0-B4: bounded `REVIEW_PASS` for G0.6, based on Run #3 and baseline-equivalence comparison.
- S0-B7: `IN_PROGRESS`; documentation/risk register/dependency audit plan/signoff/Claude review request prepared. Dependency workflow dispatch and artifact review, independent review, and owner decision remain pending.
- Full S0 G0.9: `BLOCKED` while C3/B2 is blocked.
- Bounded S1-entry package: `NOT_TESTED`.
- S1: NOT AUTHORIZED.

## 3. B4 evidence — keep the two runs distinct
### Approved B4 Run #3 evidence recorded in the handoff
- Run: `44325257261`; job: `134874698600`.
- Checkout commit: `7f17b1f0177d712366e31e4e8c879cc4b6dd5741`.
- Executed test file SHA-256: `722d62c0647f06bc2e3a49bdef1f348f4f3104f2`.
- 6 files / 70 tests passed.
- Four Historical/Sandbox × K=6/12 replay cases matched through N=24; complete GameState hashes equal; first differing path null.
- Product tree and data/build inputs compared equal to frozen baseline `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`.
- Limitations explicitly recorded: no artifact upload/typecheck in that older workflow; this evidence does NOT cover the later expanded test file or `s0-b4-tests.yml`.

### Additional CI run #65 — failed supplementary test attempt
- Run: `43908348749`; job: `133443174900`.
- URL: https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/43908348749
- Commit: `4d41ce230ad37492d75270f0a7bf8495eb5cf7e8` (test-only characterization addition, earlier branch point; not current HEAD).
- `npm ci`: PASS; data/map/web build: PASS; generated data/web bundle hash step: PASS.
- Unit/simulation tests: FAIL. 6 test files total; 5 passed, 1 failed. 104 tests: 100 passed, 4 failed.
- All 4 failures are in `tests/s0-save-determinism.test.ts`: Historical/Sandbox × K=5/12 → N=18. The reported first difference is `state.countries.ABD.group` (field presence differs).
- Android setup, Gradle sync, APK assembly, APK checksum and APK upload were skipped because tests failed. No APK was produced by this run.
- Evidence artifact uploaded: ID `14245954103`, artifact ZIP SHA-256 `b3e3213edf25ec923785f4eecdb4a617ebbc80f82073d80547235cb97d470c73`.
- Full job log confirms the above. This run was not the approved Run #3 evidence and does not execute the same K/N matrix. Do NOT silently discard it or silently relabel official B4. It is an unresolved supplemental test discrepancy that must be analyzed and disclosed to the reviewer.
- Plausible test-harness concern to investigate (not yet proven): the comparison may distinguish an in-memory property whose value is `undefined` from a property omitted by JSON serialization. Verify the exact serializer/deserializer and normalize only if the approved semantic contract treats those states as equivalent. Do not assume this is a false positive; do not change product code under S0.

## 4. S0-B7 current work and next actions
Existing files include:
- `docs/audit/s0/S0_B7_RESULTS.md`
- `docs/audit/s0/S0_RISK_REGISTER.md`
- `docs/audit/s0/S0_SIGNOFF.md`
- `docs/audit/s0/S0_DEPENDENCY_AUDIT_PLAN.md`
- `docs/audit/s0/S0_B7_SELF_REVIEW.md`
- `docs/audit/s0/S0_B7_RISK_TRACEABILITY.md`
- `docs/audit/s0/S0_B7_REVIEW_PACKAGE_MANIFEST.md`
- `docs/audit/s0/CLAUDE_S0_B7_REVIEW_REQUEST.md`
- `docs/audit/s0/CLAUDE_S0_B7_REVIEW_REPORT_TEMPLATE.md`
- Workflow: `.github/workflows/s0-b7-dependency-audit.yml` (manual dispatch only).

Next:
1. Re-verify live branch HEAD before any write.
2. Review the current B7 manifest and handoff for consistency against the exact HEAD.
3. Dispatch `s0-b7-dependency-audit.yml` manually on `experiment/vic3-visual-upgrade` only, after checking the workflow's exact ref and read-only behavior. It scans frozen baseline `2240a8f`, not current experiment HEAD.
4. Inspect and retain the artifact (full-tree and production-only npm audit JSON, stderr, exit codes, lockfile provenance). Do not run `npm audit fix` or update lockfile.
5. Reconcile DEP-F1's earlier discrepancy: baseline audit on 2026-11-16 reported 6 findings (3 moderate, 1 high, 2 critical, five GHSA identifiers); B4 Run #3 `npm ci` summary on 2026-11-18 reported 10 (3 moderate, 5 high, 2 critical) without package/advisory detail. Keep DEP-F1 OPEN P1 until artifact reviewed.
6. Independently review the B7 package and the supplementary Run #65 failure. Record findings in the handoff; do not approve S1.
7. Stop for owner decision after independent review. No S1 work until reviewer `REVIEW_PASS` and explicit owner `ACCEPTED` for the bounded transition.

## 5. Risk/gate status to preserve
- G0.1–G0.6 are recorded PASS in the B7 draft based on existing evidence; disclose the supplementary Run #65 test discrepancy for review rather than overwriting the official Run #3 result.
- G0.7 BLOCKED (no iQOO Z10 Turbo device measurement).
- G0.8 PARTIAL (legacy licensing/attribution not fully verified).
- G0.9 BLOCKED for full S0 while C3/B2 is blocked.
- R7 remains OPEN P0; interim containment is not a fix.
- R14 remains BLOCKED; do not uninstall baseline APK or install a differently signed APK.
- DEP-F1 remains OPEN P1 — UNTRIAGED until read-only dependency audit artifact is reviewed.
- Overall S0 is PARTIAL/BLOCKED, not PASS. S1 is NOT AUTHORIZED.

## 6. Important distinction for the next assistant
The earlier run #65 belongs to commit `4d41ce2`; the current branch has advanced to `3e2e1d5` and B7 is the active phase. Do not roll the branch back to `4d41ce2`, and do not assume run #65 is the latest CI for current HEAD. Do not redo B3/B4 from scratch without checking the current evidence first. Start from B7 and preserve all previous audit evidence.

## 7. Quick start prompt
Continue Victori3 Mobile from this handoff. First verify live HEAD of `experiment/vic3-visual-upgrade` is still `3e2e1d546efee4ee20d19b1da5a86403277006f7`. Read `docs/coordination/AI_HANDOFF.md` and the S0-B7 files listed above. Work only on the experiment branch. Continue the read-only B7 dependency audit, inspect its artifact, reconcile DEP-F1, independently review B7 and disclose the supplementary Run #65 test discrepancy. Do not touch Claude/default branch, product code, save/RNG/schema, signing, APK installation, or S1. Record every verified commit, workflow run, test count, artifact and limitation. Stop for explicit owner decision; do not self-accept.


---

## Addendum — live recheck 2026-11-19 (after the original handoff snapshot)

**Verified experiment HEAD before this addendum:** `fa95ad894c6fd32c673a569a561a17b7132cef36`. The original handoff's `3e2e1d5` SHA is a historical snapshot, not the current HEAD.

### Branch and commit verification
- Repository: `mtieu6470-maker/Victori3-mobile`.
- Working branch: `experiment/vic3-visual-upgrade`.
- Default branch: `claude/game-historical-sandbox-modes-kg7rj7`; its observed HEAD is `e4182491161e61065e4ac15228c5f59a8832ad1d`. Do not modify it.
- Latest experiment commits: `26963da` (adds this handoff) and `fa95ad8` (links it from `AI_HANDOFF.md`); both touch documentation only.
- The GitHub API exposes committed branch state, not an agent's local uncommitted working tree. No local dirty-tree claim is made.

### New CI evidence
- Android APK run #316: `44562638037`, job `135695779759`, commit `26963da`, FAILURE.
- Android APK run #317: `44562662560`, job `135695865693`, commit `fa95ad8`, FAILURE.
- Both runs: `npm ci` PASS; `npm run build` PASS; generated-data/web-bundle hashing PASS; Vitest FAIL (6 files: 5 pass / 1 fail; 109 tests: 108 pass / 1 fail).
- Same failing baseline characterization assertion: restored countries must not contain `constructionQueue`. Current experiment source adds and initializes `constructionQueue`, while frozen baseline `2240a8f` predates it. The Android workflow runs the complete test suite against the experiment branch; this is a current-branch test-scope mismatch and not a replacement for the approved baseline B4 evidence.
- Android SDK setup, Capacitor sync, Gradle `assembleDebug`, APK checksum and APK artifact upload were skipped. No APK is available from #316/#317. The data/web build ran but was not uploaded as a downloadable data pack.

### Next actions / stop conditions
1. Keep the B7 package and all S0 restrictions intact. Do not alter engine, save schema, test harness, Android workflow, dependencies or data to make the APK green under this audit authorization.
2. Obtain an owner/manual dispatch of `.github/workflows/s0-b7-dependency-audit.yml` on this experiment branch; review both full-tree and production-only JSON artifacts. DEP-F1 remains OPEN P1 — UNTRIAGED until then.
3. Ask Claude for the read-only B7 review, explicitly including runs #316/#317 and the separate older Run #65 discrepancy.
4. Update/review documentation only after evidence arrives. Owner acceptance is still required; S1 is not authorized.
5. APK + separately downloadable, integrity-checked data packs remain product/release requirements for a later explicitly authorized implementation phase. This S0-B7 audit has not implemented them.


## Follow-up documentation commits — 2026-11-19

After the CI recheck, the following documentation-only commits were pushed to this same experiment branch (all use [skip ci]):

- `50303575113684dc3ffeb2d928f444777a970d8b` — B7 results: record Android runs #316/#317 and the APK build blocker.
- `4440a9303e589caed94f80d68b17921e32cd12da` — Claude review request: add current Android CI evidence and required scope analysis.
- `5c3af050bb7823332d6799044933211e9444af92` — AI handoff: record the current CI recheck.
- `1a78339f0301340fe73b5cff361918fb1ab25389` — this handoff's first live-recheck addendum.
- `977f19a94c3938c2c0daca752b58cf9b678bcc99` — B7 self-review: record CI blocker and correct P2 row count to 22.
- `22af5350f95e3d6b378ca503894076f5263eab86` — AI handoff: correct stale P2 count from 21 to 22 and log the recheck.

**Latest experiment HEAD at this point:** `22af5350f95e3d6b378ca503894076f5263eab86`. These commits changed only audit/coordination Markdown. No product source, tests, data, assets, dependency, Gradle, Android or workflow file changed. The Android workflow runs #316/#317 remain failed; no APK was produced. The B7 dependency audit, Claude review and owner decision remain pending.


### Final review-package commits before this handoff update

- `238b2d09ee451c09383d376ca07c3d27d1003895` — refresh B7 manifest with live CI evidence.
- `5a490d7f3f766fbb7058cb1648a0c6bb58088bf3` — add next-session handoff identity to manifest.
- `79a322de93920fbc9a23f48d8cadd9d50756c15f` — correct the manifest row and include the next-session handoff blob.
- **Experiment HEAD immediately before this handoff update:** `79a322de93920fbc9a23f48d8cadd9d50756c15f`.
- These are documentation-only [skip ci] commits. The next action remains manual dispatch/review of the read-only B7 dependency workflow, then independent Claude review. Do not edit product files or start S1.


## Addendum — CI-F4 risk disposition and dispatch limitation (2026-11-19)

**Experiment branch at start of this addendum:** `372b76eb71372ae9fcf486958ac361925de3336c`.

### Current APK pipeline finding
- Added `CI-F4` as OPEN P1 in `S0_RISK_REGISTER.md` and `S0_B7_RISK_TRACEABILITY.md`.
- Runs #316 (`44562638037`, `26963da`) and #317 (`44562662560`, `fa95ad8`) both passed install, web/data build and hash generation, then failed the same baseline-only assertion in the B4 characterization suite: 108/109 tests passed; the test expects `constructionQueue` to be absent from every country.
- The experiment branch has the field in `src/engine/types.ts` and initializes it in `src/engine/init.ts`; frozen baseline `2240a8f` predates it. The regular APK workflow executes this baseline-only test against experiment-branch code. Treat it as an integration/scope mismatch, not a game-engine defect and not a failure of approved baseline B4 Run #3.
- Android SDK setup, Capacitor sync, Gradle `assembleDebug`, APK checksum and APK upload were skipped. No APK exists from runs #316/#317.
- Signoff, B7 results, self-review and Claude review request now document this P1 blocker. No source/test/workflow fix was made; that needs separate owner authorization.

### Dependency audit execution boundary
- The read-only S0-B7 dependency workflow is still prepared and mirrored; no workflow run/artifact exists.
- The connected GitHub toolset exposes repository reads and contents commits, but no `workflow_dispatch` operation. Do not claim the scan was run. Owner/manual dispatch on the Actions page remains required.
- DEP-F1 stays OPEN P1 — UNTRIAGED until both full-tree and production-only audit JSON reports are reviewed.

### Updated GitHub commits
- `d4778b26daca0ca19e847de2a5390e6b8e3c4fb4` — add CI-F4 to risk register.
- `46a878f79d7471449ce62a65dac09efe5ce0fde8` — trace CI-F4 in risk matrix.
- `3a854a98c4eea4b76a8297adfd740c5b19eac9bc` — B7 results update.
- `98f099312354405a3a1d35de18f94e3399bbad3e` — ChatGPT self-review update.
- `64088f932365ab798817aec26d72e61fba89af05` — Claude review request update.
- `d31c5fcd51445a56bcb6c96f2101f2a0fa8207d3` — signoff limitation recorded.

All six commits change audit/coordination Markdown only and include [skip ci]. Overall S0 remains PARTIAL/BLOCKED; S1 remains NOT AUTHORIZED.



## Product delivery requirement — downloadable APK and separate data packs

The project owner has reiterated that the eventual delivery must let them download/install the APK first and then download the game data separately. Preserve this as a product/release acceptance requirement for the separately authorized implementation phase; it is not part of S0-B7 and must not be claimed complete now.

Expected flow to design and test later:
1. Publish a small installable Android APK independently of the large historical/game data payload.
2. On first launch, show the available data packs and let the owner/player explicitly choose which packs to download.
3. Download each pack through the app, verify a trusted manifest/signature and SHA-256 before activation, and activate atomically so interrupted downloads cannot corrupt the installed dataset.
4. Store the selected packs locally and support offline play after installation; no silent/background download and no mobile-data use without explicit consent.
5. Publish the APK and data packs as distinct artifacts with version compatibility, sizes, hashes and clear download instructions.

Current status: **NOT IMPLEMENTED / NOT TESTED**. Runs #316/#317 produced no APK and no data-pack artifact. Do not modify the product, APK workflow, data pipeline or signing under current S0-B7 authorization; propose a separate owner-approved implementation task after the current gates.


## Addendum — inspectable CI archives and dependency preflight (2026-11-19)

- Downloaded and inspected both CI evidence ZIPs. Run #316 artifact `14550237447` (49,741 bytes; API SHA-256 `06fcd22633d442f6890a6d647483697e5051f21de0051b4d2ad0b38b531e6c03`); run #317 artifact `14551001678` (49,697 bytes; API SHA-256 `bb2427724f91b8ffa4e1a25cad83b405ae19ad5bdbfa452c3076e19ee9e55bfd`). Both contain diagnostic logs, build manifests/hashes and test reports. Neither contains an APK or standalone data-pack payload.
- Exact test failure is at `tests/s0-save-determinism.test.ts:270`: the frozen-baseline characterization expects no `constructionQueue`. The current-branch legacy migration test for `constructionQueue` passes. CI-F4 remains OPEN P1; no source/test/workflow fix is authorized.
- Baseline and experiment branch `package-lock.json` have identical blob SHA `29ac661a36bb03bae62a80ce7abf9af0c15bb168`. Preliminary read-only advisory cross-check found `vitest@2.1.9`, `@vitest/mocker@2.1.9`, and `tinypool@1.1.1` in dev dependency records that match published advisory ranges; locked `esbuild@0.28.2` is outside the affected range of GHSA-67mh-4wv8-2f99. This is not a full npm audit and makes no production safety claim. No package changes.
- Updated B7 results, dependency audit plan, self-review and Claude review request with exact artifact evidence and provisional advisory mapping. DEP-F1 stays OPEN P1 — UNTRIAGED until manual workflow dispatch and both audit JSONs are reviewed.
- The installed GitHub integration has no workflow-dispatch operation; exact manual action page and branch are in the dependency audit plan. Overall S0 remains PARTIAL/BLOCKED; S1 remains NOT AUTHORIZED.
