# S0-B7 — Review package manifest (current snapshot)

**Snapshot branch:** `experiment/vic3-visual-upgrade`  
**Snapshot HEAD before this manifest refresh:** `b359656a1e05c6eb8537e9d7f3948cd389b098c7`  
**Default branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Default branch HEAD observed:** `371a9e0bd35857a4f91389d0b41308571c554725`  
**Frozen product baseline:** `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`

All blob SHAs below were fetched from the named experiment-branch ref before this manifest refresh. The manifest commit advances the branch; reviewers must recheck the current HEAD and each file SHA before issuing a verdict. If a SHA differs, review the current file.

## 1. Current review documents and blob identities

| Path | Blob SHA |
|---|---|
| `docs/audit/s0/S0_B4_RUN_3_REVIEW.md` | `3d8644811c3ac13b19cce1f1274c46d2edbaa10a` |
| `docs/audit/s0/S0_B4_TEST_PLAN.md` | `ef21f8193daf283a6ed8c6f4d68b7ca87781bd46` |
| `docs/audit/s0/S0_RISK_REGISTER.md` | `352e13c1f600adfd17f317f75e572855670f83dc` |
| `docs/audit/s0/S0_B7_RISK_TRACEABILITY.md` | `6a13c4c4025166bd6d61f78505620fc31be3edb6` |
| `docs/audit/s0/S0_B7_SELF_REVIEW.md` | `6a2890758d737840e6f81be0abd04f94a7de461a` |
| `docs/audit/s0/S0_DEPENDENCY_AUDIT_PLAN.md` | `65173d78353d81b5304602a81372847232c5d8e1` |
| `docs/audit/s0/S0_SIGNOFF.md` | `f064fe08e26020eac987a9c2e59dabc001796dc5` |
| `docs/audit/s0/S0_B7_RESULTS.md` | `83099e8a1f55ba98e43bb67a268c9ad227fcd44e` |
| `docs/audit/s0/CLAUDE_S0_B7_REVIEW_REQUEST.md` | `4854adce612bc0afce3849e04198575dba71cdfa` |
| `docs/audit/s0/CLAUDE_S0_B7_REVIEW_REPORT_TEMPLATE.md` | `e5edc4d8180b331b4ddce2d7f0b687621b58083c` |
| `.github/workflows/s0-b7-dependency-audit.yml` | `dacd8506bed77624c44ffa27279354a87e9a4ebf` |
| `docs/coordination/AI_HANDOFF.md` | `0d51f80c78a8c2eff16fda7feb0814a6f36876c6` |

## 2. Risk table integrity and traceability

- The P2 risk register has been normalized to the same six-column schema as P0/P1: ID, risk/evidence, impact, disposition/control, owner, target/closure criteria.
- There are 22 P2 risk rows. A structural check confirmed every row in the P2 table has six cells.
- The source-to-risk matrix contains 47 mapping rows across original R1–R14, performance, test, global data, asset, war, CI, dependency and G0.7 findings. Grouped source IDs explicitly map to the exact grouped register row; reviewers should inspect target rows rather than use a naive single-token search.
- WD-F3 is included as P2 (five of eight starting wars capitulate at tick 5 in all four B3 probes); this is a historical-calibration observation, not proof of an engine defect.
- TC-F5 and TC-F6 are mitigated for G0.6 by supplementary B4 characterization while their original baseline tests remain narrow.

## 3. Workflow identity and parity

- Dependency-audit workflow SHA is identical on default and experiment branches at snapshot time: `dacd8506bed77624c44ffa27279354a87e9a4ebf`.
- It is `workflow_dispatch` only, grants `contents: read`, checks out exact baseline `2240a8f`, and pins checkout/setup-node/upload-artifact to full commit SHAs.
- It performs a full lockfile audit and a separate `--omit=dev` production audit; it does not install packages, run `npm audit fix`, alter the lockfile, execute product code, build, test, run Gradle, assemble APKs, or access signing secrets.
- No run of this dependency-audit workflow was present at snapshot time. Its artifact and package-level results remain unavailable.

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
