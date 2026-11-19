# S0-B7 — Review package manifest (current snapshot)

**Snapshot branch:** `experiment/vic3-visual-upgrade`  
**Snapshot HEAD before this manifest refresh:** `4fcea43c02a5c50258e0d775d3338cd73a144dba`  
**Default branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Default branch HEAD observed:** `e4182491161e61065e4ac15228c5f59a8832ad1d`  
**Frozen product baseline:** `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`

All blob SHAs below were fetched from the named experiment-branch ref before this manifest refresh. The manifest commit advances the branch; reviewers must recheck the current HEAD and each file SHA before issuing a verdict. If a SHA differs, review the current file.

## 1. Current review documents and blob identities

| Path | Blob SHA |
|---|---|
| `docs/audit/s0/S0_B4_RUN_3_REVIEW.md` | `3d8644811c3ac13b19cce1f1274c46d2edbaa10a` |
| `docs/audit/s0/S0_B4_TEST_PLAN.md` | `ef21f8193daf283a6ed8c6f4d68b7ca87781bd46` |
| `docs/audit/s0/S0_RISK_REGISTER.md` | `7956ce02029113f4ce10c52162829ee3b1d0b6c5` |
| `docs/audit/s0/S0_B7_RISK_TRACEABILITY.md` | `b55a14bf5e23e162a1b5d2b2cc6b7c1831a60022` |
| `docs/audit/s0/S0_B7_SELF_REVIEW.md` | `7f16999e6efd466d1cbb0df2aa10111ceca0d1ad` |
| `docs/audit/s0/S0_DEPENDENCY_AUDIT_PLAN.md` | `e3ff67518e936882b9f1f3f6096030ddb4bb99b5` |
| `docs/audit/s0/S0_SIGNOFF.md` | `46a2b3b0073e9d0fc868c7374c0285ca1ef2ffbc` |
| `docs/audit/s0/S0_B7_RESULTS.md` | `1a143f3f8fe617df1dfd1ac447a19d04a5f4852f` |
| `docs/audit/s0/CLAUDE_S0_B7_REVIEW_REQUEST.md` | `03e12cc5bd7436b167315a599ed868006bc50e07` |
| `docs/audit/s0/CLAUDE_S0_B7_REVIEW_REPORT_TEMPLATE.md` | `e5edc4d8180b331b4ddce2d7f0b687621b58083c` |
| `.github/workflows/s0-b7-dependency-audit.yml` | `dacd8506bed77624c44ffa27279354a87e9a4ebf` |
| `docs/coordination/AI_HANDOFF.md` | `992e752a559a1890c73b0195fdde6f7c5a2764aa` |
| `docs/coordination/NEXT_SESSION_HANDOFF_2026-11-19.md` | `05ccbc955f3b66719d6758b0d6f0d9b36af11ebb` |

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
- Updated review inputs: Risk Register blob `76087a3ed3c14340b736322300f4a536f0fe280a`; B7 self-review `f03a94115eede2bf9845e8ff0b1cd4045b168821`; dependency plan `e3ff67518e936882b9f1f3f6096030ddb4bb99b5`; signoff `ff708a294efbed724fb1653674688c37636908a7`; B7 Results `a56b233b60bee6c9a6652a3b9fda394a3361e536`; Claude request `fbf96d170b57c4d46c38c53e2bfb8783096d7b2f`; workflow `dacd8506bed77624c44ffa27279354a87e9a4ebf`; AI_HANDOFF `4eb351fbc5eca2091d7364746991c57a428e90f7`; next-session handoff `3099a2595fe8ae1a6f5754df328beb496d84eefb`.
- B7 remains IN_PROGRESS pending Claude independent review and owner decision. Overall S0 remains PARTIAL/BLOCKED; S1 remains NOT AUTHORIZED.


## 12. APK workflow run #318 and CI-F4 closure — 2026-11-20

- Snapshot HEAD before this manifest refresh: `4fcea43c02a5c50258e0d775d3338cd73a144dba`.
- Run `44573351798`, commit `b5948f0bbca126712c64dd605ebb7d9f6ddfb907`, job `135734112766`: SUCCESS.
- Commit diff changes only `.github/workflows/android-apk.yml`, separating the frozen-baseline B4 test file from the experiment-branch APK test suite without deleting or weakening the characterization.
- Test artifact `14554953353`, 106,657 bytes, API SHA-256 `96aa79f605d52f7a2eb60748f307802827f6fec9994e280fd655e3565c879829`; 38/38 suites and 97/97 tests passed.
- APK artifact `14553589834`, ZIP 17,569,405 bytes, API SHA-256 `72ce3a5759bd1379aaf35bf10a395f3cc136230b44eabc64976375405b85678b`; contains `app-debug.apk` 18,057,530 bytes, SHA-256 `338fc54ce2e68f15ddc7043c664bdffa9cd79ade3c41aa0ed7a7cf0bfa7fe6b5`. Debug certificate SHA-256 `8610076ddcefefc85d188530b0eb4645a21f92f38008692c29f6282a13418e19`.
- Both artifact ZIP digests were recomputed and match GitHub API digests. CI-F4 closed narrowly; no gameplay acceptance, device QA, release signing, data-pack delivery, overall S0 PASS or S1 authorization is implied.
- Updated B7 review-input blob SHAs: Risk Register `7956ce02029113f4ce10c52162829ee3b1d0b6c5`; Risk Traceability `a83ed23f68e71f8a473d6d1cd6ed2eebd8bb360f`; B7 self-review `7f16999e6efd466d1cbb0df2aa10111ceca0d1ad`; dependency plan `e3ff67518e936882b9f1f3f6096030ddb4bb99b5`; signoff `46a2b3b0073e9d0fc868c7374c0285ca1ef2ffbc`; B7 Results `1a143f3f8fe617df1dfd1ac447a19d04a5f4852f`; Claude request `03e12cc5bd7436b167315a599ed868006bc50e07`; workflow `dacd8506bed77624c44ffa27279354a87e9a4ebf`; AI_HANDOFF `992e752a559a1890c73b0195fdde6f7c5a2764aa`; next-session handoff `05ccbc955f3b66719d6758b0d6f0d9b36af11ebb`.
