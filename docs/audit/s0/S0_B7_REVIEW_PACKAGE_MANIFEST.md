# S0-B7 — Review package manifest (current snapshot)

**Snapshot branch:** `experiment/vic3-visual-upgrade`  
**Snapshot HEAD before this manifest refresh:** `4db9d3d7b397fc59f3310936eecd6792a4ca218f`  
**Default branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Default branch HEAD observed:** `e4182491161e61065e4ac15228c5f59a8832ad1d`  
**Frozen product baseline:** `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`

All blob SHAs below were fetched from the named experiment-branch ref before this manifest refresh. The manifest commit advances the branch; reviewers must recheck the current HEAD and each file SHA before issuing a verdict. If a SHA differs, review the current file.

## 1. Current review documents and blob identities

| Path | Blob SHA |
|---|---|
| `docs/audit/s0/S0_B4_RUN_3_REVIEW.md` | `3d8644811c3ac13b19cce1f1274c46d2edbaa10a` |
| `docs/audit/s0/S0_B4_TEST_PLAN.md` | `ef21f8193daf283a6ed8c6f4d68b7ca87781bd46` |
| `docs/audit/s0/S0_RISK_REGISTER.md` | `c22fbf270e3e2263067d30e48c7c63464a5b3f47` |
| `docs/audit/s0/S0_B7_RISK_TRACEABILITY.md` | `dbcfeb7f125578220e220c594c3a834bfeecaa8f` |
| `docs/audit/s0/S0_B7_SELF_REVIEW.md` | `70eb56cf89b8ff8ea4536c0cd373532f61134c16` |
| `docs/audit/s0/S0_DEPENDENCY_AUDIT_PLAN.md` | `e3ff67518e936882b9f1f3f6096030ddb4bb99b5` |
| `docs/audit/s0/S0_SIGNOFF.md` | `be9e83f57e289cae21a475dcc8c8fc84f56cfc0b` |
| `docs/audit/s0/S0_B7_RESULTS.md` | `0e6adffb3378d103bc9a59be1d65ab107f40522e` |
| `docs/audit/s0/CLAUDE_S0_B7_REVIEW_REQUEST.md` | `b120b2b4787fdd5cf53123270545e150b6cab8f9` |
| `docs/audit/s0/CLAUDE_S0_B7_REVIEW_REPORT_TEMPLATE.md` | `403a1dc63df414afc348ffbfd2a6f144f3394dd2` |
| `.github/workflows/s0-b7-dependency-audit.yml` | `dacd8506bed77624c44ffa27279354a87e9a4ebf` |
| `docs/coordination/AI_HANDOFF.md` | `a141a2b855093dbb6c07e40bf3f61580a6844cc9` |
| `docs/coordination/NEXT_SESSION_HANDOFF_2026-11-19.md` | `0060043f2e80fa5e70a40f85abe4fbdb3158341f` |

## 2. Risk table integrity and traceability

- Added OPEN P1 finding CI-F4 for the experiment-branch APK workflow test-scope mismatch; runs #316/#317 stop before Gradle and produce no APK. Any correction requires separate authorization.
- The P2 risk register has been normalized to the same six-column schema as P0/P1: ID, risk/evidence, impact, disposition/control, owner, target/closure criteria.
- There are 22 P2 risk rows. A structural check confirmed every row in the P2 table has six cells.
- The source-to-risk matrix contains 48 mapping rows across original R1–R14, performance, test, global data, asset, war, CI, dependency and G0.7 findings. Grouped source IDs explicitly map to the exact grouped register row; reviewers should inspect target rows rather than use a naive single-token search.
- WD-F3 is included as P2 (five of eight starting wars capitulate at tick 5 in all four B3 probes); this is a historical-calibration observation, not proof of an engine defect.
- TC-F5 and TC-F6 are mitigated for G0.6 by supplementary B4 characterization while their original baseline tests remain narrow.

## 3. Workflow identity and parity

- Dependency-audit workflow SHA is identical on default and experiment branches at snapshot time: `dacd8506bed77624c44ffa27279354a87e9a4ebf`.
- It is `workflow_dispatch` only, grants `contents: read`, checks out exact baseline `2240a8f`, and pins checkout/setup-node/upload-artifact to full commit SHAs.
- It performs a full lockfile audit and a separate `--omit=dev` production audit; it does not install packages, run `npm audit fix`, alter the lockfile, execute product code, build, test, run Gradle, assemble APKs, or access signing secrets.
- Workflow run `44572915201` on workflow SHA `9b150cff57e79bdb5356e431cc140b3b1b9eda2d` completed successfully. Artifact `14555141888` was downloaded and inspected; see §11 for raw-report totals and disposition.

## 4. B4 execution evidence boundary

- Reviewed GitHub Actions run: `44325257261`, job `134874698600`.
- Executed checkout commit: `7f17b1f0177d712366e31e4e8c879cc4b6dd5741`.
- Executed test-file blob SHA: `722d62c0647f06bc2e3a49bdef1f348f4f3104f2`.
- Result: 6 test files / 70 tests passed; four Historical/Sandbox × K=6/12 save/resume cases MATCH over 24 months.
- Limitations: no artifact upload and no TypeScript check in that older workflow. The later expanded test file on the experiment branch was not run by this execution.

## 5. Gate and decision boundary at snapshot

- G0.1–G0.6: PASS, with G0.6 limited to the frozen-baseline B4 evidence above.
- G0.7: BLOCKED — no iQOO Z10 Turbo measurements.
- G0.8: PARTIAL — legacy asset/license and attribution evidence incomplete.
- Full-S0 G0.9: BLOCKED while C3/B2 is blocked, under v3.2 §6.4 and OD-20261116-11 §2.1.1.
- Separate bounded S1-entry package: NOT_TESTED pending independent reviewer `REVIEW_PASS` and explicit owner `ACCEPTED` decision.
- Overall S0: PARTIAL — NOT COMPLETE. S1: NOT AUTHORIZED.
- R7 remains OPEN P0; interim containment is not a technical fix. R14 remains BLOCKED pending Android Export/Import device validation.

## 6. Required reviewer conduct

- Recheck live refs and blob SHAs. This manifest is a reproducibility aid, not a substitute for opening and reading the documents.
- Use `CLAUDE_S0_B7_REVIEW_REPORT_TEMPLATE.md` for the independent report; the template itself is not a review result.
- Return `REVIEW_PASS` or `CHANGES_REQUESTED` for the bounded S1-entry evidence package only; report `BLOCKED` if hard conditions cannot be verified.
- Do not edit repository files, change code/workflows/dependencies, merge branches, approve exceptions, sign off for the owner, or open S1.
- The ChatGPT self-review is a checklist, not independent evidence. Claude must validate the source findings and gate interpretation independently.


## 7. Current-branch CI recheck (2026-11-19)

- Snapshot HEAD above is the exact experiment-branch commit immediately before this manifest refresh; recheck the branch after this manifest commit.
- Android workflow runs #316 (`44562638037`) and #317 (`44562662560`) both failed on the same baseline-only `constructionQueue` assertion; each reported 108/109 tests passed. `npm ci` and the web/data build passed, but Gradle/APK steps were skipped.
- The failure is from running the baseline characterization test against the changed experiment branch, which has `constructionQueue`; it does not replace the approved frozen-baseline B4 Run #3 result.
- At the time of this 2026-11-19 snapshot, no APK or downloadable data pack was produced by runs #316/#317 and the dependency audit had not yet been dispatched. This historical status is superseded by §11 (audit artifact) and §12 (APK run #318).
- The P2 Risk Register table currently contains 22 data rows, all with six cells. The prior self-review/handoff count of 21 was corrected in the latest documentation commits.
- B7 remains IN_PROGRESS; independent Claude review and owner decision remain pending. Overall S0 remains PARTIAL/BLOCKED; S1 remains NOT AUTHORIZED.


## 8. CI-F4 and dispatch status — 2026-11-19

- Added OPEN P1 `CI-F4` to the Risk Register and exact traceability matrix row after inspecting current Android APK workflow runs #316 and #317. Both runs have the same baseline-only `constructionQueue` assertion failure (108/109 tests passed). Experiment branch source includes/initializes the field; frozen baseline `2240a8f` does not.
- Both builds pass npm install and web/data build, but stop before Android SDK setup, Capacitor sync and Gradle. No APK is produced. Do not weaken baseline characterization or change the normal APK workflow under this S0 authorization.
- The dependency workflow has run successfully; artifact `14555141888` is reviewed. DEP-F1 is OPEN P1 — AUDIT COMPLETE; REMEDIATION / OWNER DISPOSITION PENDING. No package changes are authorized.
- Android APK run #318 (`44573351798`, commit `b5948f0`) is SUCCESS: 97/97 tests passed, Gradle assembled the debug APK, and both test/APK evidence artifacts were downloaded and verified. CI-F4 is CLOSED for the narrow APK workflow integration issue; see §12.
- Overall S0 remains PARTIAL/BLOCKED; bounded S1-entry review and owner acceptance remain pending; S1 is NOT AUTHORIZED.


## 9. Product delivery requirement recorded (not implemented)

- The owner requires an installable APK as a separate download followed by explicitly selected, separately versioned in-app data-pack downloads.
- Future implementation must verify a trusted manifest/signature and SHA-256 before atomic pack activation; retain packs locally for offline play; and require consent before background or mobile-data downloads.
- Current status: NOT IMPLEMENTED / NOT TESTED. Runs #316/#317 produced neither an APK nor a data-pack artifact. This is a future, separately authorized product task, not an S0-B7 completion claim.


## 10. CI evidence archives and preliminary dependency preflight

- API artifact identities and digests for runs #316/#317 are recorded in B7 Results and verified against downloaded ZIP contents. They are diagnostic archives; neither includes an APK or data-pack payload.
- The pinned baseline and experiment package-lock blob SHA is `29ac661a36bb03bae62a80ce7abf9af0c15bb168`. The full-tree and production-only audit JSONs have now been inspected; exact package/advisory findings and limitations are in the dependency plan and B7 Results.
- DEP-F1 remains OPEN P1 — AUDIT COMPLETE; REMEDIATION / OWNER DISPOSITION PENDING. The separate B4 Run #3 npm ci count of 10 remains unresolved.


## 11. Dependency-audit evidence refresh — 2026-11-20

- Snapshot HEAD before this manifest refresh: `2701faf95d5b62671ffda07f8af27de4cd6e3501`.
- Workflow run `44572915201` / job `135732603544` SUCCESS on workflow SHA `9b150cff57e79bdb5356e431cc140b3b1b9eda2d`.
- Artifact `14555141888`, 4,753 bytes, API SHA-256 `b9124fa9c6f0272abaf970557ce248ef32c4d85397d21dbe64ebb19221a65a28`; all eight archive files inspected.
- Full-tree: six vulnerable dev dependency entries (3 moderate, 1 high, 2 critical), exit 1 expected. Production-only: zero findings, exit 0. Both stderr files empty. Nested Vite esbuild `0.21.5` is affected; root esbuild `0.28.2` is not. B4 Run #3's npm ci count of 10 remains unresolved.
- Historical review-input SHAs at the initial dependency-audit checkpoint (superseded by the refreshed identities in §12 and the Governance references section below): Risk Register `76087a3ed3c14340b736322300f4a536f0fe280a`; B7 self-review `f03a94115eede2bf9845e8ff0b1cd4045b168821`; dependency plan `e3ff67518e936882b9f1f3f6096030ddb4bb99b5`; signoff `ff708a294efbed724fb1653674688c37636908a7`; B7 Results `a56b233b60bee6c9a6652a3b9fda394a3361e536`; Claude request `fbf96d170b57c4d46c38c53e2bfb8783096d7b2f`; workflow `dacd8506bed77624c44ffa27279354a87e9a4ebf`; AI_HANDOFF `4eb351fbc5eca2091d7364746991c57a428e90f7`; next-session handoff `3099a2595fe8ae1a6f5754df328beb496d84eefb`.
- B7 remains IN_PROGRESS pending Claude independent review and owner decision. Overall S0 remains PARTIAL/BLOCKED; S1 remains NOT AUTHORIZED.


## 12. APK workflow run #318 and CI-F4 closure — 2026-11-20

- Snapshot HEAD before this manifest refresh: `4fcea43c02a5c50258e0d775d3338cd73a144dba`.
- Run `44573351798`, commit `b5948f0bbca126712c64dd605ebb7d9f6ddfb907`, job `135734112766`: SUCCESS.
- Commit diff changes only `.github/workflows/android-apk.yml`, separating the frozen-baseline B4 test file from the experiment-branch APK test suite without deleting or weakening the characterization.
- Test artifact `14554953353`, 106,657 bytes, API SHA-256 `96aa79f605d52f7a2eb60748f307802827f6fec9994e280fd655e3565c879829`; 38/38 suites and 97/97 tests passed.
- APK artifact `14553589834`, ZIP 17,569,405 bytes, API SHA-256 `72ce3a5759bd1379aaf35bf10a395f3cc136230b44eabc64976375405b85678b`; contains `app-debug.apk` 18,057,530 bytes, SHA-256 `338fc54ce2e68f15ddc7043c664bdffa9cd79ade3c41aa0ed7a7cf0bfa7fe6b5`. Debug certificate SHA-256 `8610076ddcefefc85d188530b0eb4645a21f92f38008692c29f6282a13418e19`.
- Both artifact ZIP digests were recomputed and match GitHub API digests. CI-F4 closed narrowly; no gameplay acceptance, device QA, release signing, data-pack delivery, overall S0 PASS or S1 authorization is implied.
- Updated B7 review-input blob SHAs: Risk Register `c22fbf270e3e2263067d30e48c7c63464a5b3f47`; Risk Traceability `dbcfeb7f125578220e220c594c3a834bfeecaa8f`; B7 self-review `70eb56cf89b8ff8ea4536c0cd373532f61134c16`; dependency plan `e3ff67518e936882b9f1f3f6096030ddb4bb99b5`; signoff `f150ed753276f19e77e4fee4e7ee62e28422d93e`; B7 Results `78e62e66daf92989c0314dd3d6fb446a774ad6bf`; Claude request `21701183432e95d3ff677c994dcf51e7a312b4a2`; workflow `dacd8506bed77624c44ffa27279354a87e9a4ebf`; AI_HANDOFF `3badcaab602bca3f275132ceca167fb18c8b4b9c`; next-session handoff `3e634cbfe5f0d5cf98796d6ab9969405024d04d9`.


### Governance references refreshed — 2026-11-20

- AI_HANDOFF blob SHA: `3badcaab602bca3f275132ceca167fb18c8b4b9c` (includes branch-specific governance reconciliation).
- NEXT_SESSION_HANDOFF blob SHA: `3e634cbfe5f0d5cf98796d6ab9969405024d04d9` (includes branch-specific governance reconciliation).
- Use the owner-designated experiment branch for this task. Default-branch protocol and handoff were read but not edited; see the governance reconciliation note for stale generic branch/roadmap text and the newer owner-directed role allocation.


### Pinned-baseline B4 workflow boundary — 2026-11-20

- `.github/workflows/s0-b4-tests.yml` blob `3a4430f7a5ad32e24a95cdef271fc6e07529929e` is configured to checkout exact baseline `2240a8f` and overlay only the B4 test harness/fixture. This workflow was not re-run in this slice. Approved B4 Run #3 (`44325257261`) remains separate prior evidence; do not claim a new run of this workflow.
- CI-F4 closure is limited to removing the baseline-only assertion from the experiment APK suite while preserving the dedicated baseline path. Run #318 does not itself prove G0.6 or a new B4 execution.


## 14. Final B7 review-packet consistency checkpoint — 2026-11-20

- Snapshot HEAD before this manifest refresh: `302f3a38c53c6cc3d7c3d09522a336b0123b58b6`. Default branch HEAD observed in the compare: `e4182491161e61065e4ac15228c5f59a8832ad1d`.
- Corrected the stale DEP-F1 traceability row, reviewer report template, reviewer request's old pinned HEAD / unrun-audit description, historical CI-F4 wording and self-review status label. See §1 for current blob identities.
- Latest review-input blobs: risk traceability `dbcfeb7f125578220e220c594c3a834bfeecaa8f`; self-review `70eb56cf89b8ff8ea4536c0cd373532f61134c16`; reviewer request `21701183432e95d3ff677c994dcf51e7a312b4a2`; reviewer report template `403a1dc63df414afc348ffbfd2a6f144f3394dd2`; risk register `c22fbf270e3e2263067d30e48c7c63464a5b3f47`; signoff `f150ed753276f19e77e4fee4e7ee62e28422d93e`; B7 results `78e62e66daf92989c0314dd3d6fb446a774ad6bf`; dependency plan `e3ff67518e936882b9f1f3f6096030ddb4bb99b5`; AI_HANDOFF `3badcaab602bca3f275132ceca167fb18c8b4b9c`; next-session handoff `3e634cbfe5f0d5cf98796d6ab9969405024d04d9`.
- Workflow identity: B7 audit workflow `dacd8506bed77624c44ffa27279354a87e9a4ebf`; pinned-baseline B4 workflow `3a4430f7a5ad32e24a95cdef271fc6e07529929e`.
- Default-branch owner-directed role allocation blob: `7b61ef2f5008a2f6818de01aeb5ab0e4df991cc5`; default-branch AI_HANDOFF blob: `046a5d8b17c48b995ea03fddb2ee98dc491b317a`. The default branch was read-only for this task.
- Claude independent no-write review has not yet been performed; no REVIEW_PASS or owner ACCEPTED is claimed. Re-fetch live HEAD and all listed blob SHAs before verdict.
- This was a documentation-only consistency pass. No product/runtime/test/workflow/dependency/save/data/asset/Gradle/signing changes, runtime tests or builds were performed.


### Post-handoff manifest identity refresh — 2026-11-20

- Snapshot HEAD before this manifest refresh: `b9c2780a8178bf45c908cdd6e37a6f4d380b3cfa`.
- AI_HANDOFF current blob: `3badcaab602bca3f275132ceca167fb18c8b4b9c`; NEXT_SESSION_HANDOFF current blob: `3e634cbfe5f0d5cf98796d6ab9969405024d04d9`; risk traceability: `dbcfeb7f125578220e220c594c3a834bfeecaa8f`; self-review: `70eb56cf89b8ff8ea4536c0cd373532f61134c16`; Claude request: `21701183432e95d3ff677c994dcf51e7a312b4a2`; Claude report template: `403a1dc63df414afc348ffbfd2a6f144f3394dd2`.
- The manifest table and the latest-review-input identity section above are updated to these refs. All are on `experiment/vic3-visual-upgrade`; default branch remains unchanged.


### Final handoff pin — 2026-11-20

- Snapshot HEAD before this manifest refresh: `8a3c8bea8171b96785b2101a50ec77b1e24e0195`.
- Latest AI_HANDOFF blob: `3badcaab602bca3f275132ceca167fb18c8b4b9c`; NEXT_SESSION_HANDOFF blob: `3e634cbfe5f0d5cf98796d6ab9969405024d04d9`.
- Latest reviewer request, report template, self-review and traceability blobs are re-fetched and pinned in §1. Claude independent review and owner acceptance remain pending.


## 13. Supplementary Android CI revalidation after run #318

The live B7 package snapshot is refreshed to the branch HEAD immediately before this manifest commit. Runs #319–#321 (44576526677 / 44576552982 / 44576581387) all completed 38/38 suites, 97/97 tests and Gradle debug APK assembly successfully on documentation-only commits. Run #321 artifact/evidence ZIPs were downloaded, ZIP digests re-computed against GitHub API metadata, and APK/test summary inspected; exact details are in `S0_B7_RESULTS.md` §14. The current snapshot HEAD `4db9d3d7b397fc59f3310936eecd6792a4ca218f` is a documentation-only descendant of #321 commit `c5ba0e80b017dfeb04d29c17a66205fab23ce0d9`; no product/runtime source changed between them, but no workflow ran on the exact HEAD.

This supplement does not change CI-F4's narrow closure, overall S0 gate states, reviewer role, owner acceptance requirement, or S1 authorization. Claude must re-fetch every listed blob and the live HEAD before issuing a verdict. Run #319/#320 artifact ZIP payloads were not downloaded; only their GitHub API metadata and successful job logs were checked.
