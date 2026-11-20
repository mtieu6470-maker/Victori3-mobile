# S0-B7 — Review package manifest (current snapshot)

**Snapshot branch:** `experiment/vic3-visual-upgrade`  
**Snapshot HEAD before this manifest refresh:** `331324bf11c8108e872f9086009c936980b60312`  
**Default branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Default branch HEAD observed:** `e4182491161e61065e4ac15228c5f59a8832ad1d`  
**Frozen product baseline:** `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`

All blob SHAs below were fetched from the named experiment-branch ref before this manifest refresh. The manifest commit advances the branch; reviewers must recheck the current HEAD and each file SHA before issuing a verdict. If a SHA differs, review the current file.

## 1. Current review documents and blob identities

| Path | Blob SHA |
|---|---|
| `docs/audit/s0/S0_B4_RUN_3_REVIEW.md` | `3d8644811c3ac13b19cce1f1274c46d2edbaa10a` |
| `docs/audit/s0/S0_B4_TEST_PLAN.md` | `ef21f8193daf283a6ed8c6f4d68b7ca87781bd46` |
| `docs/audit/s0/S0_B3_RESULTS.md` | `cc25258c5295e5c2de3bae90d3c9b1d1c1b63da5` |
| `docs/audit/s0/S0_RISK_REGISTER.md` | `dea1e33e2c961bcf36bd80b41ee7ca79da88456d` |
| `docs/audit/s0/S0_B7_RISK_TRACEABILITY.md` | `90b968a2db93c9b7e09c3deacbbaf92e786d9237` |
| `docs/audit/s0/S0_B7_SELF_REVIEW.md` | `1dc8177e878b9d40ed5a5fd96889475097160efb` |
| `docs/audit/s0/S0_DEPENDENCY_AUDIT_PLAN.md` | `8701c8defd2945cc0849b7e2c7ee67afe03ab141` |
| `docs/audit/s0/S0_SIGNOFF.md` | `7a2baf300e95c646585f76e3a1ef81f85cadfcf5` |
| `docs/audit/s0/S0_B7_RESULTS.md` | `4243bba7829fb110951dcc28f1ccb802331ab7da` |
| `docs/audit/s0/CLAUDE_S0_B7_REVIEW_REQUEST.md` | `d1ec5b314923efdfb136a71fb7b10b2725f1888e` |
| `docs/audit/s0/CLAUDE_S0_B7_REVIEW_REPORT_TEMPLATE.md` | `977e7fc3427cefb99bf3ba172740eb99cb6034b8` |
| `.github/workflows/s0-b7-dependency-audit.yml` | `dacd8506bed77624c44ffa27279354a87e9a4ebf` |
| `docs/coordination/AI_HANDOFF.md` | `51d7db227a0b6f9a14c76a9fff92a5aa7abb6e50` |
| `docs/coordination/NEXT_SESSION_HANDOFF_2026-11-19.md` | `0cdd1b70857e17b708c6851575819ae076a5b8d0` |

| `docs/roadmap/OWNER_SCOPE_AMENDMENT_1836_2026_SYSTEM_DEPTH.md` | `43d4feda71cf71714160fead3ee6f135408206d9` |
| `docs/spec/SIMULATION_CLOCK_PACING_DESIGN_VI.md` | `65bd4e52e49e450c282d4e2d58c53258846939fd` |
| `docs/design/TECHNOLOGY_AND_INSTITUTIONS_1836_2026_DRAFT.md` | `18a37e8335b188182ec45b882bb8f44c3285b66a` |

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


## 14. Exact-HEAD Android run #322 (2026-11-20)

- Exact checkout/trigger commit: `68fee31641d2249be824a87f4302c26a5aeb6611`; workflow run `44661820747`, job `136041609778`, SUCCESS.
- Evidence artifact `14596545236`: 106,681 bytes; ZIP SHA-256 `50c75905c66950a8868afc58f9eb81f3ecc09096fc3e2a0254b13f7233747492`; downloaded and inspected, 15 entries; 38/38 suites, 97/97 tests, zero failures, `report_valid=true`.
- APK artifact `14596440616`: 17,569,399-byte ZIP; SHA-256 `1f3d14e2c2f4aa43b5d1fe12fb1ed34b6058d37c5c91c8b262de2b20a57d7ff5`; downloaded and inspected. APK: 18,057,541 bytes, SHA-256 `eda437afeadad10074d38acf567601c0c43ab3a6e9661ce8145962896fdf3cbb`; Android Debug certificate SHA-256 `559d549a21515f899b6195c65114b2be778ff2fbd63288d21ef31f4365b96238`.
- This evidence is limited to CI tests and debug APK assembly; no device QA, release signing, independent B7 verdict, owner acceptance or S1 authorization.
- The manifest commit itself advances the branch; re-fetch live HEAD and every listed blob SHA before issuing a review verdict.


## 15. DEP-F1 — B4 Run #3 npm-ci log reinspection (2026-11-20)

- Manifest refresh base HEAD: `5c549909e6c3ec400c9cfdd97ada09dae57dfd55`.
- B4 original run `44325257261`, job `134874698600`: raw log confirms `npm ci` audited 221 packages and reported 10 vulnerabilities (3 moderate / 5 high / 2 critical). No package/advisory JSON was uploaded.
- Exact `package-lock.json` blob SHA is `29ac661a36bb03bae62a80ce7abf9af0c15bb168` at frozen baseline `2240a8f`, B4 checkout `7f17b1f` and experiment branch.
- Later read-only baseline audit run `44572915201` used explicit `npm audit --package-lock-only --json`; six vulnerable package entries (3 moderate / 1 high / 2 critical), plus zero in the production-only scan.
- The outputs come from different npm command/report contexts; B4 raw JSON is unavailable, so the exact count/severity difference is UNRECONCILED. DEP-F1 stays OPEN P1; no dependency changes were made.
- Related report, plan, risk-register row, self-review, reviewer request and handoff were refreshed in commit `5c549909e6c3ec400c9cfdd97ada09dae57dfd55`. This manifest refresh advances the branch again; reviewers must re-fetch live HEAD and every listed blob SHA.


## 16. B7 risk traceability and DEP-F1 cross-document structure checkpoint (2026-11-20)

- Snapshot base before this manifest commit: `b4bbb03ba4baf19394f3bd46f0550a317eb6c86d`; the refreshed file blob identities above refer to the just-committed experiment-branch files.
- Structural check at the prior HEAD found exactly 22 P2 Risk Register rows and six cells in every row. All 48 risk/gate traceability mappings (including the G0.7 device-evidence gate row) were unique and resolved to an exact or explicitly grouped Risk Register target.
- Corrected the stale DEP-F1 traceability row. It now records B4 Run #3 `npm ci` output (221 packages audited / 10 findings), identical package-lock blob SHA `29ac661a36bb03bae62a80ce7abf9af0c15bb168` across baseline/B4/experiment, and the B7 explicit lockfile-only scan (six vulnerable package entries). Without B4 package-level JSON, the exact difference remains UNRECONCILED; DEP-F1 remains OPEN P1.
- Refreshed `S0_B7_SELF_REVIEW.md`, `S0_SIGNOFF.md`, reviewer request/template, results and both handoff documents. No gate verdict, phase authorization or dependency disposition was changed.
- Documentation-only validation; no runtime tests, device QA, product source, workflow, dependency, save/schema, data or asset change. Re-fetch the current HEAD and every listed blob SHA before reviewer verdict.


## 17. Traceability mapping count correction — 2026-11-20

The prior structural summary undercounted the matrix by one because it omitted the G0.7 device-evidence gate row. A fresh enumeration of the live Markdown table contains **48** rows: 14 roadmap risks, 5 performance findings, 7 test findings, 6 global-data findings, 7 asset findings, 3 war findings, and 6 CI/dependency/gate entries. There are no duplicate source IDs and all 48 rows resolve to exact or explicitly grouped Risk Register targets. The count in the self-review, results, reviewer request and handoff is corrected to 48. The 22-row P2 / six-column structural result is unchanged.


## 18. B3 historical verdict / current phase-register reconciliation (2026-11-20)

- Snapshot base before this manifest refresh: `ada6bcf25f0486556aa7634d4f962db281d64a26`; all changed-document blob SHAs above were fetched from that exact experiment-branch state.
- Corrected a stale Phase Register entry that labelled S0-B3 `READY_FOR_REVIEW` although the current handoff summary and B4 prerequisite already said bounded `REVIEW_PASS`.
- The current `S0_B3_RESULTS.md` and handoff now cite the historical independent ChatGPT review of Claude's corrected B3 commits `ddea490635c5d7c74ca6108549fd21806102487b` and `2c62b3de3955e3cd8a82a9c59401d9df77d69173`, verdict `REVIEW_PASS` on 2026-11-16, limited to B3 audit scope. Prior round-1 `CHANGES_REQUESTED` and pre-review `READY_FOR_REVIEW` checkpoints remain preserved.
- Added `S0_B3_RESULTS.md` to the manifest's pinned review inputs because the current Claude B7 request asks the reviewer to verify B3's bounded gate history.
- This correction does not change S0 gate states, the active S0-B7 task, owner acceptance, Claude's paused status, or S1 authorization.


## 19. B3 review wording correction (2026-11-20)

- Snapshot base before this manifest refresh: `e7b8275208058c784d9e46b003bf1216033d0327`.
- Corrected an editorial foreign-language word in `S0_B3_RESULTS.md` §9; the verdict remains `REVIEW_PASS` only for the S0-B3 audit scope and all underlying review evidence/commits are unchanged.
- Updated the B3 results blob SHA above. No gate, risk, review outcome, owner decision or phase authorization changed.


## 20. Source severity and row-schema reconciliation (2026-11-20)

- Snapshot base before this manifest refresh: `57d7b89f5afad3c027caa07c547b00f6456d1a11`.
- Pinned the updated B3 review summary, B7 source-severity self-audit, B7 results, reviewer request, and both handoff files using blob SHAs read from the exact branch state above.
- Source checks covered R1–R14 in v3.2; RM/WD in B3 results; TC in the test catalog; GD in the global data audit; AS in the asset audit; CI/DEP as B7 additions. No severity mismatch was found; R3 remains Closed, R7 P0, G0.7 remains a BLOCKED gate rather than a P-level risk.
- Risk table shape check found 22 P2 rows with six cells; all other P0/P1/P3/Closed rows had their expected schema and no empty cells. All 48 traceability rows remained unique and mapped.
- This is a documentation-only self-audit, not an independent REVIEW_PASS or owner acceptance. No runtime, package, data, asset, workflow, save, signing or device work was performed.


## 21. P0/P1 disposition clarity refresh — 2026-11-20

- Snapshot base HEAD before this manifest refresh: `ee2c1afff5f1f1e1ed11a53e69cbb78b6f3dc545`.
- Updated risk register blob: `e41155b4f39ab720faa41639be82b5bfaf133201`; traceability: `4846228e59ed90fb8207bed544ba98f09807e028`; results: `3fa6cc3c7d60deef3f5f3aa90b9ee0d130e6f045`; self-review: `6da20ece1563cd8ad94565afe5f1aebd18d270b0`; reviewer request: `56919e0517edcc2c1868f8b3890bb5271ec0f157`; AI_HANDOFF: `7c26d15369ab11ed1b6b8449e470bff8884d1e0d`.
- Clarified downstream stages/exit criteria for R2/AS-F1, R10, GD-F2 and TC-F1/TC-F2. No severity, status, gate, exception, or authorization changed.
- This is an implementer documentation update, not independent review. Re-fetch live HEAD and every blob before Claude issues a verdict.


## 22. Exact-HEAD Run #324 and renewed R1 evidence — 2026-11-20

- Snapshot base HEAD before this manifest refresh: `16a84cfd3aaa01c48e1c2e056bc11d4c9cf12388`.
- Run #324 (`44677523059`) completed SUCCESS on exact checked-out SHA `31f1617ed838110296fd68edfd90c7e3e3b8d0a7`; APK artifact `14603730370` (17,569,417 bytes; ZIP SHA-256 `4a2800bcab95fd0d92ab6f7bbe93111fa7059b1d82a2a340f3a3ac892a34cfd1`); APK SHA-256 `d64bdf78726d991f1bb3c867200f360e2fc563bc0332282cf75cbe7d9734d285`; certificate SHA-256 `84bb348722b660bb36805f3928f73d64401d313a8627168796b6068a2ee1d146`.
- CI evidence artifact `14603825259` (106,638 bytes; ZIP SHA-256 `3a53e96540faa10585b893dd9cc7ea6a071ccb65c6a1accfa94bbf73f447c16b`). Both ZIP digests were independently recomputed and matched GitHub metadata; APK hash matched `apk_sha256.txt` and V1/V2 signature verification exited 0.
- Tests: 38/38 suites, 97/97 tests; `report_valid=true`; Gradle BUILD SUCCESSFUL. No device QA.
- Run #322's certificate SHA-256 was `559d549a21515f899b6195c65114b2be778ff2fbd63288d21ef31f4365b96238`. GitHub compare from #322 checkout `68fee316` to #324 checkout `31f1617` shows documentation-only changed paths. Different certificate fingerprints reinforce OPEN R1; they do not authorize installation or B2/C3.
- R1 register, traceability, signoff, results, self-review, reviewer request and handoff are pinned in §1. AS-F1 now has an explicit S5 target with a 492-source-page and UI-attribution exit condition. No severity, gate or phase status changed.


## 23. CI-F4 P1 table-boundary correction — 2026-11-20

- Snapshot base before this manifest refresh: `744d26c33b311c11a40de2a4cf12403e1b7b3eb9`.
- Risk Register is pinned to corrected blob `a5bb70bfd10d3f82dc200b29680ada2cd99c489a`. CI-F4 is contiguous with the six-column P1 table; no disposition/severity change.
- Post-correction table counts: P0 1×6, P1 13×6 (12 P1 risk rows plus G0.7 gate row), P2 22×6, P3 5×3, Closed 1×3; no blank cells. Traceability: 48 unique source mappings.
- Results, self-review, reviewer request and AI_HANDOFF record this structural correction. No gate or phase status changed.


## 24. Final P1 table and review-input pin refresh — 2026-11-20

- Snapshot base HEAD before this manifest update: `ba34e3c4bfb70b54e5ff1006fe285070de58331c`.
- Refreshed live pins for Risk Register, Traceability, Signoff, B7 Results, Self-review, Claude review request and AI_HANDOFF from the current experiment branch.
- CI-F4 now renders as part of the contiguous six-column P1 table. Verified table counts: P0 1×6; P1 13×6 (12 P1 risk rows plus the distinct G0.7 gate row); P2 22×6; P3 5×3; Closed 1×3. No blank cells; 48 traceability rows remain unique.
- No severity, disposition, gate, owner acceptance or phase authorization changed. This is a documentation-only manifest update; no new Actions run is expected due to `[skip ci]`.


## 25. R13 / GD-F2 roadmap alignment refresh — 2026-11-20

- Snapshot base before this manifest update: `9bf270aff22af6fa0639cc66add58f7d078d2654`.
- Re-pinned Risk Register, Traceability, Results, Self-review, Claude request and AI_HANDOFF from their latest experiment-branch blobs.
- R13 controls remain proposed/not implemented; GD-F2 is now mapped by field to S3/S6/S7/S13/S16. No risk severity, status, gate or authorization changed.


## 26. Owner-requested 1836–2026 scope context (2026-11-20)

- This snapshot follows the owner-requested 1836–2026 scope amendment and preliminary technology/institution design draft. The exact files are listed above with live blob SHAs; the updated handoff and B7 review request are also pinned above.
- These documents are contextual product-design records only. They are not B7 risk evidence, do not modify or supersede the frozen 1836–1936 `MASTER_SPEC_VI.md` used for the historical S0/G0.4 audit, and do not authorize product implementation.
- The review target remains the bounded S0-B7 risk/signoff package. No risk status, gate verdict, owner exception acceptance or phase authorization is changed by these scope/design documents.
- The owner has asked the technical lead to proceed with discretion. This does not eliminate the repository's independent-review requirement or authorize an unreviewed phase transition.


## 27. Owner execution-discretion instruction (2026-11-20)

- The updated handoff and B7 review request record the owner's instruction that ChatGPT has full technical discretion to decide and carry out work without a schedule/time constraint.
- This is not a reviewer verdict, does not change any S0 gate, and is not treated as a waiver of the independent B7 review or explicit phase-transition decision.
- The bounded review scope remains S0-B7. Reviewers must re-fetch current HEAD and all pinned blobs before issuing a verdict.


## 28. Refreshed contemporary research and live B7 self-audit (2026-11-20)

- Updated technology/institution design pin: `docs/design/TECHNOLOGY_AND_INSTITUTIONS_1836_2026_DRAFT.md` now includes verified official-source calibration using observation-year boundaries (ITU 2025, Stanford HAI 2026, IEA 2026, SIPRI 2025 expenditure/Yearbook 2026). The 2026 terminal campaign date is not used to relabel older observations as 2026 statistics.
- Updated ChatGPT self-review pin: `docs/audit/s0/S0_B7_SELF_REVIEW.md` §16 records a live structural parse of Risk Register and Traceability at pre-manifest HEAD `646850556a4f1970c5334b7696145760a77ee0a7`: P0 1×6; P1 13×6; P2 22×6; P3 5×3; Closed 1×3; 48 unique mappings and no unresolved risk IDs.
- Current handoff and Claude review request record the self-audit and scope/research updates. These records do not claim independent review, close risks, alter gates or authorize S1.
- The exact pinned file blobs are listed in §1. Re-fetch them from the live branch before review; this manifest itself advances the branch and is not a substitute for live HEAD verification.


## 29. 1836–2026 calendar and provisional speed guard (2026-11-20)

- Added/pinned `docs/spec/SIMULATION_CLOCK_PACING_DESIGN_VI.md` with §12 covering the 1836-01-01 start, 2026-12-31 final playable date, 2027-01-01 terminal boundary, Gregorian leap-year behavior and 191 inclusive calendar years.
- §12 proposes a provisional Speed 5 pacing ceiling of one game year per 60 real seconds (approximately 6.1 game days per real second) as a guard against multi-year-per-second jumps. It is explicitly a design proposal, not a benchmark, device result, implementation or owner acceptance of final mapping.
- The updated handoff and B7 review request pin this context. The bounded review verdict remains limited to S0-B7; no S0 gate, risk disposition, exception or implementation authorization changed.
- Direct Victoria 3 comparison, reference Android throughput, scheduler tests and save migration evidence remain outstanding.


## 30. Owner-confirmed half-day Speed-5 ceiling (2026-11-20)

- The latest clock design pin now reflects the owner's explicit maximum: **0.5 Gregorian game-day per real second** (12 in-game hours/real second). This replaces earlier provisional 1-year/60-second and 1–2-days/second proposals.
- At that hard ceiling, the 69,762-day interval 1836-01-01 to 2027-01-01 requires 139,524 real seconds (38h 45m 24s) with uninterrupted calendar progress. This is arithmetic from the requested cap, not measured throughput.
- At a six-hour logical tick, the maximum corresponds to two logical ticks/real second. Rendering/RAF must not define simulation steps; monthly systems must not run at six-hour cadence.
- The clock, handoff and review request are pinned to the exact blobs in §1. This scope note does not authorize runtime changes, change any risk/gate verdict, or widen the bounded S0-B7 review.


## 31. Owner's final Speed-5 hard ceiling: 0.5 game-day / real-second (2026-11-20)

- The current clock design pin reflects the owner's explicit ceiling: **maximum 0.5 Gregorian game-day per one real second** (12 in-game hours per second).
- Prior proposals of 1 day/second and a hard ceiling of 2 days/second are superseded and must not be used for configuration or acceptance.
- The full interval contains 69,762 Gregorian days from 1836-01-01 to the 2027-01-01 completion boundary. At exactly the hard cap, the theoretical uninterrupted time is 139,524 seconds = 38 hours, 45 minutes, 24 seconds. This is arithmetic, not measured performance.
- With six-hour logical ticks, the cap permits at most two ticks per real second; monthly simulation systems remain on their own cadence. RAF/render rate cannot drive logical time.
- The clock design, handoff and review request are pinned to exact live blobs above. Design-only; no runtime code, save schema, benchmark, test or APK was changed/run.
- No S0 risk/gate, bounded review scope, owner exception or phase authorization was changed.
