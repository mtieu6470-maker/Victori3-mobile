# S0-B4 — Save/load characterization test plan

**Task:** S0-B4 under owner decision OD-20261116-11  
**Status:** `IN_PROGRESS` — pinned-baseline workflow execution remains `NOT_TESTED`; an older workflow run was reviewed as supplementary evidence only  
**Frozen product baseline:** `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`  
**Audit branch:** `experiment/vic3-visual-upgrade`

## Scope and isolation

This task characterizes the existing save/load behavior only. It does not modify gameplay, simulation, RNG, the save serializer/deserializer, data, assets, or the save schema.

The tests-only workflow is `.github/workflows/s0-b4-tests.yml`. It is manual-dispatch only, uses `contents: read`, checks out the frozen baseline SHA, and overlays only the two B4 test files from the experiment branch. It runs Node dependency installation, generated-data preparation, TypeScript checking and the dedicated Vitest file. It does not run Vite production build, Capacitor sync, Gradle, Android SDK setup or APK assembly.

The workflow file is present on the default branch so GitHub exposes the manual workflow, and mirrored on the experiment branch. The existing Android APK workflow is unchanged. Audit commits use GitHub's documented skip annotation for push-triggered workflows so those commits do not invoke the APK workflow.

## Experiment-branch isolation limitation

At source-review checkpoint `662bd830b150302b008b75119b46c213f417c17a` (before two subsequent documentation-only updates), comparing the experiment branch with frozen baseline `2240a8fb865e0021eec2f2f4f1c6803528be9e2c` showed pre-existing branch deltas in Android/Capacitor configuration, historical data, engine, UI and other tests, in addition to audit documents/tools. These are inherited branch contents from earlier work and are not changes made by the B4 characterization commits; the individual B4 commits were checked and touched only the dedicated test file, fixture, test plan and handoff. The latest audit head is `a1fb9b108ee56de7f191f23f57648268fe72f31b`; its two additional commits only update this plan and the handoff.

**The designated B4 workflow deliberately excludes those branch product deltas.** It checks out the exact baseline SHA into `baseline/`, checks out the experiment branch into `audit-source/`, and overlays only `tests/s0-save-determinism.test.ts` and `tests/fixtures/s0-b4-scenario.ts` before running the dedicated tests. Therefore a successful B4 result is evidence about baseline `2240a8f` plus this test harness; it is not evidence that the pre-existing product changes on the experiment branch pass, nor authorization to merge them.

## Deterministic replay scenario

Scenario fixture: `tests/fixtures/s0-b4-scenario.ts`

| Parameter | Value |
|---|---|
| Baseline SHA | `2240a8f...` (full SHA recorded above) |
| Modes | Historical and Sandbox |
| Seed | `20261116` |
| Player | `GBR` |
| Total simulation | 24 months |
| Save checkpoints | K=6 (mid-year), K=12 (annual sampling boundary) |
| Player commands | Same fixed tax and budget commands in both branches |

For each mode/checkpoint, the test compares:

1. A continuous N-month simulation.
2. A same-seed simulation to K, serialized with the baseline's native save format, deserialized, then advanced to N using the same remaining command schedule.

The comparison covers the complete JSON-persisted `GameState`, including seed and RNG state. Object keys are canonicalized; arrays retain their original order. The test records the first differing state path and SHA-256 values for the save and initial/final states. Nontrivial-state guards verify the campaign advanced, countries and regions exist, the state changed from initialization, and player commands took effect.

## Save input characterization

The dedicated test records baseline behavior for malformed JSON, foreign format, unsupported version, missing state, and a legacy save without `marketStats`. Baseline `2240a8f` defaults absent `marketStats` to an empty object. It predates `constructionQueue`; the test explicitly checks that deserialization does not invent this later field. It also records the missing-`rng` case: the baseline deserializer accepts the incomplete state, but the next monthly step throws `TypeError`. This is a characterized baseline defect, not a product-code fix in S0. A second case supplies an incompatible string in place of the four-number RNG tuple; the baseline also accepts it during deserialization and throws `TypeError` when simulation continues. Both cases emit explicit `[S0-B4_COMPAT]` log records so the artifact captures the observed behavior, not only passing test names. Under v3.2 §6.7 step 8, these are malformed/incompatible-save characterizations: they are recorded as baseline robustness findings and do not by themselves constitute a mismatch between the uninterrupted and save/resume branches. No product-code fix is permitted in S0.

## Execution and evidence

The manual workflow produces an artifact containing:

- Exact baseline and audit-source commit SHAs.
- Node/npm versions and SHA-256 hashes of the test fixture, test file and package lock.
- Generated `db.json` and `map.json` hashes.
- Logs and exit codes for `npm ci`, `npm run prepare-assets`, `npm run typecheck` and the dedicated Vitest run.
- Vitest JSON and test output, including state/save hashes and any first-difference path.

**Supplementary run review (not the designated B4 evidence):** the older `.github/workflows/b4-tests-only.yml` run `44041104723` completed successfully with 6 test files / 70 tests passing, including four Historical/Sandbox save-load replay cases. Its predecessor `44039619132` failed before test collection because generated `src/generated/db.json` was absent; the succeeding run added `npm run prepare-assets`. The successful run checked out commit `d2ae88e`, which is 39 commits ahead of frozen baseline `2240a8f`; GitHub's compare shows those intervening commits changed documentation, audit/test files and workflows, but no product source/data files. Nevertheless, that older workflow did not independently pin the baseline, run the required TypeScript check, or upload a provenance artifact. It is supporting evidence only, not a substitute for `.github/workflows/s0-b4-tests.yml`.

The required pinned-baseline workflow has not yet been dispatched and its artifact has not been reviewed. G0.6 therefore remains `NOT_TESTED`. Start the manual workflow with `experiment/vic3-visual-upgrade` selected, then review its artifact before assigning a gate verdict.

## Stop conditions

- Any reproducible difference between uninterrupted and resumed state is G0.6 `FAIL`; retain the state path, hashes, fixture and logs.
- Do not fix a failure in S0. Prepare the separate `PRE-S1-SAVE-DETERMINISM-REMEDIATION` proposal and wait for explicit owner authorization.
- Do not begin S1 or alter product code/save behavior as part of this task.
