# S0 B7 Independent Review Request — bounded S1-entry package

**Repository:** mtieu6470-maker/Victori3-mobile  
**Branch:** claude/game-historical-sandbox-modes-kg7rj7  
**Owner decision:** OD-20261116-11 (v3.3)  
**Assigned independent reviewer:** Claude Code, per owner-directed role allocation dated 2026-11-17 (DeepSeek is a fallback only if owner-assigned and independent).  
**Product baseline:** 2240a8fb865e0021eec2f2f4f1c6803528be9e2c  
**B4 tested HEAD:** d2ae88e557e9895413462c5b069886bfc606adc7  
**B4 CI:** run 44041104723, job 133895641421, 70/70 tests, 6/6 suites  
**Review target:** Re-fetch the current branch HEAD before review and record its exact SHA. The B7 files below are the requested deliverables. The current owner data-size direction is 4–5 GB for the complete verified offline collection (an allowance, not a minimum); see `docs/coordination/OWNER_EXECUTION_DIRECTIVE_2026-11-19.md` and `S0_B7_RESULTS.md` §13.

## 1. Governance and review scope

The owner explicitly authorized B3, B4 and B7 as a sequential S0 audit lane. OD-20261116-11 §6 step 6 says to continue B7 after B4 to prepare the risk register/signoff under either G0.6 outcome. Therefore B7 drafting does not require prior independent B4 REVIEW_PASS and owner ACCEPTED. However, **S1 cannot begin** until the complete bounded S1-entry package has independent REVIEW_PASS and the owner records ACCEPTED.

Review this package as a bounded S1-entry proposal, not as a declaration that S0 is complete. Overall S0 remains PARTIAL/BLOCKED until all G0.1–G0.9 are PASS.

Do not modify the repository. Do not change product source, gameplay, engine, RNG, save implementation/schema, migrations, historical data, assets, Android resources, Gradle, workflows, signing, keystore or secrets. Do not build/install an APK or claim R14 is verified.

## 2. Files to inspect

- .github/workflows/b4-tests-only.yml — verify the tests-only boundary and absence of APK build/sign/upload steps.
- docs/audit/s0/S0_B7_RESULTS.md — including the ChatGPT pre-review checks, §9 automatic APK-workflow incident record, §§11–12 historical 3–4 GB owner target and §13 current 4–5 GB allowance; these are not an independent verdict.
- docs/audit/s0/S0_B7_PACKAGE_SUMMARY_VI.md — Vietnamese index and scope/status summary.
- docs/audit/s0/S0_RISK_REGISTER.md
- docs/audit/s0/S0_GATE_LEDGER.csv
- docs/audit/s0/S0_SIGNOFF.md
- docs/coordination/AI_HANDOFF.md
- docs/coordination/OWNER_EXECUTION_DIRECTIVE_2026-11-19.md — current owner delegation, 4–5 GB allowance and explicit opt-in/privacy guardrails.
- docs/coordination/AI_COLLABORATION_PROTOCOL.md
- docs/roadmap/S0_V3_3_OWNER_DECISION_AND_AMENDMENTS.md
- docs/roadmap/S0_V3_3_GATE_RESTRUCTURE_PROPOSAL.md
- docs/roadmap/DECISIONS_AND_S0_REVISED_VI.v3.2.md
- docs/audit/s0/S0_A_RESULTS.md
- docs/audit/s0/S0_B3_RESULTS.md
- docs/audit/s0/S0_TEST_CATALOG.md
- docs/audit/s0/S0_REQUIREMENT_MATRIX.csv
- docs/audit/s0/S0_GLOBAL_DATA_AUDIT.md
- docs/audit/s0/S0_ASSET_AUDIT.md
- docs/audit/s0/S0_PERFORMANCE_BASELINE.md
- docs/audit/s0/S0_BUILD_TEST_REPORT.md
- docs/audit/s0/b4/S0_B4_CHATGPT_TECHNICAL_SELF_AUDIT_2026-11-17.md
- docs/audit/s0/b4/S0_B4_REVIEW_REQUEST.md
- tests/s0-save-determinism.test.ts at ae29c99330081ba2f6af3a6d4478ec8aefc8a1ad
- Tests-only CI run 44041104723 and its job log.

## B4 evidence addendum — frozen baseline and current save-contract test source are distinct (20/11/2026)

The B4 test file is not byte-identical to the original baseline test-source commit at the current branch HEAD. Independent review must not overlook this:

- Frozen baseline source `ae29c99330081ba2f6af3a6d4478ec8aefc8a1ad`, blob `722d62c0647f06bc2e3a49bdef1f348f4f3104f2`, is identical at tested HEAD `d2ae88e557e9895413462c5b069886bfc606adc7`. Run [44041104723](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44041104723) executed that version on the frozen 2240a8f product baseline.
- Later test-only commit `14bd56848b8db429b9037880b08887af7118d61f` changes the missing-state assertion from baseline `TypeError` to the explicit v2 validation error. Current file blob: `e3d960725e1e1b41fc4f63d303a5b5d36cdb6ad7`.
- Baseline `save.ts` blob `b2faa2fef078398dd35e4ba099451f3ac6df8d59` has no envelope-state validation; current v2 `save.ts` blob `e54cce0397d25735540071b53d8291e30e332360` rejects a missing state explicitly. Current exact-target CI on `9604207` (runs [44765197664](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44765197664) / [44765197668](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44765197668)) validates the current v2 test/source, not the frozen baseline.
- Review both contracts separately. Preserve the baseline TypeError as a baseline finding and the v2 explicit validation as the current implementation behavior. The missing-RNG baseline/current compatibility issue remains separately characterized as B4-R1.
- This distinction does not change the B4 70/70 baseline CI result or turn current CI into a new baseline test. Reviewer must decide the impact on the bounded S1-entry package.

## CURRENT-CANDIDATE G0.6 EVIDENCE ADDENDUM — 9604207 (20/11/2026)

## CURRENT CANDIDATE G0.6 CONTINUATION EVIDENCE — post-DEV-005 v2 save state (20/11/2026)

In addition to the frozen 2240a8f baseline characterization above, the current code candidate has now exercised the same four valid-save continuation cases on its own current engine/save implementation:

- **Exact candidate code/test commit:** `96042077abeef8b89fe9e46fdce97a2b566d70da`. Both exact-target workflows [44765197664](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44765197664) and [44765197668](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44765197668) have `head_sha=96042077abeef8b89fe9e46fdce97a2b566d70da` and `conclusion=success`. The Android workflow completed 44/44 suites and 131/131 tests; `report_valid=true`; Gradle `BUILD SUCCESSFUL in 1m 28s`.
- **Why these are current-code cases:** the test imports `createGame`, `serialize` and `deserialize` from the same checkout. At this candidate, `src/engine/init.ts` creates `GameState.version = 2`; `src/engine/save.ts` uses `SAVE_SCHEMA_VERSION = 2`. The four 24-month continuity cases therefore execute against the current v2 candidate, not a copied frozen baseline tree.
- **Current-candidate results in Android run 44765197668 / job 136387820204:**
  - Historical cut tick 6 and 12: both `MATCH`, `firstDifferingPath=null`, final state SHA-256 `9933f1310849ea8126171e515276b0ba7319bcba49586c1bb2d22706b8cea1c1`.
  - Sandbox cut tick 6 and 12: both `MATCH`, `firstDifferingPath=null`, final state SHA-256 `1fdde5dc52f4e902d3b45cd284fbace48eb36f7678ea93e411f14bf85eb10564`.
  - Current compiled DB SHA-256 `af1b44aca4379106ab2ff11837dc6c3d9c7da5646bb9741bda486ce27d368949`; map SHA-256 `9a6a6979dd5e7adc9d5953fc5f089ac94dee4079433ed1d340535dcbe877a696`.
- **Log-label caveat:** the current test source still defines `BASELINE_PRODUCT_SHA = 2240a8f…` and emits it as `baselineProductSha`, while the suite title retains “baseline only”. That constant is a historical reference label, **not** the actual checkout identity. The authoritative current code identity is the workflow metadata `head_sha=9604207`. Do not use the JSON field as proof that the Android run checked out 2240a8f.
- The current candidate also retains the B4-R1 observation: a save with missing `rng` is accepted by deserialization and one-month continuation throws `TypeError`. This remains an explicit save-validation/migration risk, not a passing compatibility case.
- This gives a separate, current-candidate save/load continuation result alongside the frozen baseline run 44041104723. It does not change the historic baseline report, clear B4-R1, establish device backup/export safety, or constitute independent review/owner acceptance. Reviewer must assess whether the test/log labeling is sufficiently clear and whether this evidence meets the candidate-SHA G0.6 requirement in OD-20261116-11 §2.


## 3. Required review questions

1. Verify the latest HEAD, changed-file range from the product baseline, and that no unauthorized product/engine/save/data/assets/device changes were introduced by B7.
2. Verify B4 evidence as three distinct references: (a) frozen baseline test blob `722d62c` at tested HEAD `d2ae88e` / run `44041104723`; (b) current v2 test blob `e3d9607` introduced by `14bd568`; and (c) current-candidate execution on `9604207` / Android run `44765197668`, where all four valid-save cases MATCH against schema v2. Inspect the workflow `head_sha`, not the hard-coded `baselineProductSha` field in the test log. Decide whether the log label should be corrected before the evidence is accepted as current-candidate G0.6. None of these results may be silently substituted for another.
3. Check every risk entry for accurate source evidence, severity, impact, interim mitigation, accountable owner, stage and objective exit criteria. In particular, verify that R2 (parent shipped CC BY-SA content risk) is not conflated with AS-F3 (specific UI attribution sub-finding), and that their different P1/P2 dispositions are justified. Identify missing material risks or inflated severity.
4. Check R7 is treated as an open P0, not a resolved defect. Is the proposed owner-accepted interim control sufficient for a narrowly limited S1 test phase?
5. Check R14 remains BLOCKED for device installation/signing; no one should rely on Export as a backup absent device evidence.
6. Check G0.7 exception is only for iQOO measurement during S1, with Node/desktop evidence and strict prohibition on runtime/performance/renderer/lifecycle changes in S1.
7. Check G0.8 exception is only for pre-existing content, with no new/edited/replaced/repackaged/unverified assets or text during S1.
8. Check G0.6 is PASS on the tested baseline and remains non-exemptible. Does B4-R1 adequately preserve the missing-RNG failure as a separate compatibility risk?
9. Check the gate ledger does not overstate G0.1–G0.6; G0.7 remains BLOCKED, G0.8 remains PARTIAL, and full-S0 G0.9 remains BLOCKED while R14/C3 are BLOCKED under v3.3 §2.1.1. Assess the bounded S1-entry risk disposition as a separate review object; do not relabel the full-S0 G0.9 verdict.
10. Check the S1 scope exactly matches v3.2/v3.3 data-contract/save-foundation constraints and includes no gameplay or runtime/performance work.
11. Check risk-register coverage against all inherited v3.2 R1–R14 risks (including R3 as closed), B3 findings TC-F1…F7, GD-F1…F6, AS-F1…F7, RM-F1…F5, WD-F1…F3, and the B4 missing-RNG risk. Verify mitigated/closed entries do not erase the historical finding and that no priority has been silently lowered. Also verify R5 (frame-metric/tick-cost attribution), RM-F3 (synchronous main-thread tick cost) and RM-F4 (requestAnimationFrame throughput coupling) are distinct and not duplicated or severity-conflicted.
12. Review the §9 governance incident: documentation-only pushes triggered the unchanged `android-apk.yml` workflow because `[skip ci]` was omitted. Verify the listed run statuses/artifacts and the HTTP 429 failure cause; confirm no APK was downloaded or installed on iQOO, no workflow file was modified, and do not treat these automatic debug builds as device acceptance or B4 tests-only evidence.
13. Review R15 and `S0_B7_RESULTS.md` §13 as the current owner data-size direction; §§11–12 are historical snapshots of the superseded 3–4 GB range. Confirm that the approximately 4–5 GB allowance refers to a complete, meaningful, verified offline collection across the small core and multiple packs, is not a minimum to be padded, and is not one monolithic APK or a RAM budget. Require separate measured budgets for compressed downloads, expanded installed storage, temporary staging and peak runtime/decoded memory. Evaluate the two delivery paths (native streaming/resumable archives into app-private storage for sideload, versus AAB/PAD for Google Play); verify current per-pack/per-file limits, publisher authenticity, hashes, dependencies, provenance/licenses, resume behavior, free-space preflight, staging/atomic activation/rollback, safe WebViewAssetLoader mapping, and the `FULL_OFFLINE_READY` gate. Enforce the owner's explicit-opt-in rule: PAD on-demand is the suitable mode for optional large packs; fast-follow downloads automatically after installation and must not be used for optional packs unless the owner explicitly changes that consent requirement. Also challenge data quality: no duplicate/padding/empty/random filler, no unlicensed/out-of-period records or assets, every material historical record source-backed with geographic/temporal validity and uncertainty, and every presentation asset reachable/used in-game. Check compression claims are evidence-based and text/vector data are distinguished from already-compressed media. R15 remains S23b/S23c and does not silently expand S1 or authorize implementation.

## 4. Required reviewer response

Return:
- exact branch and HEAD reviewed;
- exact files/commits/run/logs inspected;
- findings by severity, exact document/row/section, impact and required correction;
- explicit assessment of R7/P0 control, R14/C3 isolation, G0.6, G0.7/G0.8 exceptions and G0.9;
- one verdict: REVIEW_PASS for the bounded S1-entry evidence package, or CHANGES_REQUESTED.

A REVIEW_PASS applies only to the bounded S1-entry package with the explicitly stated exceptions. It does not certify S0 as fully PASS. The owner must separately record ACCEPTED with the accepted exceptions and exact S1 scope. Do not begin S1 and do not write to GitHub.
