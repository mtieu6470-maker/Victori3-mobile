# S0-B7 — Review package manifest

**Snapshot branch:** `experiment/vic3-visual-upgrade`  
**Snapshot HEAD before this manifest commit:** `36170a30cac599b50d290e98c19c3d61a957fa19`  
**Default branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Default branch HEAD at snapshot:** `103ab66b227809fae358e082fa253c0e50a1f78c`  
**Frozen product baseline:** `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`

All blob SHAs below were read from the named experiment-branch ref before this manifest was created. Reviewers must recheck the live HEAD and file SHAs before issuing a verdict. If a file SHA differs, review the current file, not this stale snapshot.

## 1. Core review documents

| Path | Blob SHA |
|---|---|
| `docs/audit/s0/S0_B4_RUN_3_REVIEW.md` | `3d8644811c3ac13b19cce1f1274c46d2edbaa10a` |
| `docs/audit/s0/S0_B4_TEST_PLAN.md` | `ef21f8193daf283a6ed8c6f4d68b7ca87781bd46` |
| `docs/audit/s0/S0_RISK_REGISTER.md` | `36010b5d0f0a136dcfd79bf940bcf64190de9b60` |
| `docs/audit/s0/S0_B7_RISK_TRACEABILITY.md` | `41106bb7e8ede95fb12b88f71377966d02250fe1` |
| `docs/audit/s0/S0_B7_SELF_REVIEW.md` | `b0f4391babb8d238d104cfa134da85d1f7ae3c87` |
| `docs/audit/s0/S0_DEPENDENCY_AUDIT_PLAN.md` | `65173d78353d81b5304602a81372847232c5d8e1` |
| `docs/audit/s0/S0_SIGNOFF.md` | `f064fe08e26020eac987a9c2e59dabc001796dc5` |
| `docs/audit/s0/S0_B7_RESULTS.md` | `7348747969f94cced9ba4a6d6faab7fbc17f97f6` |
| `docs/audit/s0/CLAUDE_S0_B7_REVIEW_REQUEST.md` | `65b633c8dcfa5834b9eb2f4feee9dfa0ba624979` |
| `.github/workflows/s0-b7-dependency-audit.yml` | `dacd8506bed77624c44ffa27279354a87e9a4ebf` |
| `docs/coordination/AI_HANDOFF.md` | `cc22716e784beefae9ee33742a2c653153564894` |

## 2. Workflow identity and parity

- The dependency-audit workflow blob SHA was identical on the default and experiment branches at snapshot time: `dacd8506bed77624c44ffa27279354a87e9a4ebf`.
- It is `workflow_dispatch` only, grants `contents: read`, checks out exact product baseline `2240a8f`, and pins checkout/setup-node/upload-artifact to full commit SHAs.
- It performs a full lockfile audit and a separate `--omit=dev` production audit; it does not install packages, run `npm audit fix`, alter the lockfile, execute product code, build, test, run Gradle, assemble APKs, or access signing secrets.
- No run of this dependency-audit workflow was present in GitHub Actions at snapshot time. Its artifact and package-level results remain unavailable.

## 3. B4 execution evidence boundary

- Reviewed GitHub Actions run: `44325257261`, job `134874698600`.
- Executed checkout commit: `7f17b1f0177d712366e31e4e8c879cc4b6dd5741`.
- Executed test-file blob SHA: `722d62c0647f06bc2e3a49bdef1f348f4f3104f2`.
- Result: 6 test files / 70 tests passed; four Historical/Sandbox × K=6/12 save/resume cases MATCH over 24 months.
- Limitations: no artifact upload and no TypeScript check in that older workflow. The later expanded test file on the experiment branch was not run by this execution.

## 4. Gate and decision boundary at snapshot

- G0.1–G0.6: PASS, with G0.6 limited to the frozen-baseline B4 evidence above.
- G0.7: BLOCKED — no iQOO Z10 Turbo measurements.
- G0.8: PARTIAL — legacy asset/license and attribution evidence incomplete.
- Full-S0 G0.9: BLOCKED while C3/B2 is blocked, under v3.2 §6.4 and OD-20261116-11 §2.1.1.
- Separate bounded S1-entry package: NOT_TESTED pending independent reviewer `REVIEW_PASS` and explicit owner `ACCEPTED` decision.
- Overall S0: PARTIAL — NOT COMPLETE. S1: NOT AUTHORIZED.
- R7 remains OPEN P0; interim containment is not a technical fix. R14 remains BLOCKED pending Android Export/Import device validation.

## 5. Required reviewer conduct

- Recheck all current refs and blob SHAs. This manifest is a reproducibility aid, not a substitute for opening and reading the documents.
- Return `REVIEW_PASS` or `CHANGES_REQUESTED` for the B7 documentation package only.
- Do not edit repository files, change code/workflows/dependencies, merge branches, approve exceptions, sign off for the owner, or open S1.
- The ChatGPT self-review is a checklist, not independent evidence. Claude must validate the source findings and gate interpretation independently.