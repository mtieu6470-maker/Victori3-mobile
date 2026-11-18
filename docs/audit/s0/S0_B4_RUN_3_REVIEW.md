# S0-B4 — Independent review of GitHub Actions run #3

**Task:** S0-B4, OD-20261116-11, v3.2 §6.7  
**Review date:** 2026-11-18  
**Reviewer verdict:** **REVIEW_PASS** for the bounded G0.6 save/load determinism characterization  
**Gate verdict:** **G0.6 = PASS** on frozen product baseline 2240a8f  
**Scope limitation:** This verdict covers the baseline save/load contract described below. It does not certify the later expanded test source on the experiment branch, the full experiment-branch product delta, Android device behavior, or all of S0.

## 1. Run identity and execution

| Field | Verified value |
|---|---|
| GitHub Actions run | [44325257261](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44325257261) |
| Job | 134874698600 — “Vitest (no build, no APK)” |
| Workflow | .github/workflows/b4-tests-only.yml — “S0-B4 Tests Only” |
| Workflow event | Manual dispatch |
| Branch / checkout commit | claude/game-historical-sandbox-modes-kg7rj7 / 7f17b1f0177d712366e31e4e8c879cc4b6dd5741 |
| Executed test file | tests/s0-save-determinism.test.ts |
| Executed test-file blob SHA | 722d62c0647f06bc2e3a49bdef1f348f4f3104f2 |
| Product baseline under test | 2240a8fb865e0021eec2f2f4f1c6803528be9e2c |
| Node / npm | Node v22.23.4 / npm 10.9.9 |
| Vitest | 2.1.9 |
| Test suite result | 6 test files passed; 70 tests passed; 0 failures |
| Vitest duration | 59.51 seconds |
| Workflow artifact | None uploaded; the GitHub job log is the execution evidence |
| TypeScript check | Not run in this workflow |
| APK / Gradle build | Not run; job explicitly says “no build, no APK” |

All job steps shown in the screenshot completed successfully: checkout, Node setup, locked dependency installation, generated-data preparation, and Vitest.

## 2. Why this run is baseline-equivalent

The run checked out commit 7f17b1f directly rather than checking out baseline SHA 2240a8f in a separate workflow directory. I therefore compared the exact run commit with the frozen baseline before accepting the evidence.

GitHub compare result:

- 351 commits ahead, 0 behind, 291 changed paths.
- No changed path under src/, historical_data/, assets/, public/, android/, or Capacitor configuration.
- No changes to package.json, package-lock.json, vitest.config.ts, tests/helpers.ts, or the product data/map/content generator scripts.
- The only changed test path in tests/ was tests/s0-save-determinism.test.ts. Other differences were audit documentation, audit tooling, and workflow files.

Thus the product engine, serializer/deserializer, RNG implementation, historical inputs, dependency lockfile, and generated-data source scripts used by Run #3 are byte-equivalent to baseline 2240a8f. The test itself is audit instrumentation. Generated data were rebuilt from those unchanged baseline inputs during the run.

This is a source-equivalence argument supported by the GitHub commit comparison; it is not a claim that the workflow itself pinned a second checkout to the baseline SHA.

## 3. Deterministic continuation cases

Each case used seed 21, player GBR, a 24-month simulation, and three scripted player commands. The same command trace was applied to the uninterrupted and save/resume paths.

| Mode | Save checkpoint | In-game date | Continuous final SHA-256 | Save/load final SHA-256 | First differing path | Result |
|---|---:|---|---|---|---|---|
| Historical | K=6 | 1836-07 | a6751c47e91eb6786366e086737bb75da68ff8b4b0c617d496bc5e61627228d8 | a6751c47e91eb6786366e086737bb75da68ff8b4b0c617d496bc5e61627228d8 | null | MATCH |
| Historical | K=12 | 1837-01 | a6751c47e91eb6786366e086737bb75da68ff8b4b0c617d496bc5e61627228d8 | a6751c47e91eb6786366e086737bb75da68ff8b4b0c617d496bc5e61627228d8 | null | MATCH |
| Sandbox | K=6 | 1836-07 | b0d489068f6d3ef1d59fd862405df46851717fff9571b3c95379dbaa407a57cd | b0d489068f6d3ef1d59fd862405df46851717fff9571b3c95379dbaa407a57cd | null | MATCH |
| Sandbox | K=12 | 1837-01 | b0d489068f6d3ef1d59fd862405df46851717fff9571b3c95379dbaa407a57cd | b0d489068f6d3ef1d59fd862405df46851717fff9571b3c95379dbaa407a57cd | null | MATCH |

The run logs the following immutable generated-data fingerprints:

- db.json SHA-256: e60f61cf2bd18970741917da862a85a0c7b508609f912413c281a0bc9cef2cbf
- map.json SHA-256: 9a6a6979dd5e7adc9d5953fc5f089ac94dee4079433ed1d340535dcbe877a696

The trace contains these player commands:

1. Tick 2: set tax to 0.12.
2. Tick 8: set education budget to 0.23.
3. Tick 16: set army target to 75,000.

The test compares the complete JSON-persisted GameState, including RNG, and reports the first differing path. Both paths in all four scenarios returned MATCH with no differing path.

## 4. Malformed and legacy save observations

Run #3 also records these actual baseline behaviors:

| Case | Observed behavior |
|---|---|
| Malformed non-JSON | Rejected with native JSON parse error |
| Foreign save format | Rejected |
| Unsupported save version 999 | Rejected |
| Missing state in envelope | Throws during deserialization |
| Legacy save missing marketStats | Loads, defaults marketStats to {}, and completes one monthly continuation without throwing |
| Save missing RNG | Deserializer accepts it with rng undefined; next monthly continuation throws TypeError |

The missing-RNG behavior is a baseline robustness finding. It is not a deterministic mismatch between the uninterrupted and save/resume paths, so it does not automatically make G0.6 FAIL. It must remain visible in the risk register and be addressed through a separately authorized save-compatibility task/stage. No product code was changed.

## 5. Exact coverage boundary

The executed source at commit 7f17b1f contains 12 B4-specific test instances:

- 2 JSON comparison-semantics tests;
- 4 Historical/Sandbox replay cases;
- 6 malformed/legacy save characterization cases.

The latest expanded test file on experiment/vic3-visual-upgrade contains additional assertions and a wrong-type RNG characterization. That later test-file revision was **not** the file run in Run #3 and is not claimed as executed evidence here. Likewise, the later manual workflow .github/workflows/s0-b4-tests.yml has not been dispatched. Do not attribute its typecheck, pinned-baseline checkout, or evidence-artifact behavior to Run #3.

Run #3 did not upload an artifact and did not run npm run typecheck. These are evidence-packaging limitations, not failures of the four §6.7 replay cases. The GitHub job log and exact test-source commit remain the primary evidence.

The npm ci log also reported 10 dependency vulnerabilities (3 moderate, 5 high, 2 critical). That summary does not identify affected packages or runtime exposure; see S0_RISK_REGISTER.md. The runner warned that actions/checkout@v4 and actions/setup-node@v4 target Node 20, which is deprecated and was forced to Node 24 by the runner.

## 6. Independent conclusion

**G0.6 = PASS** for the frozen product baseline, within the §6.7 characterization scope.

Rationale:

1. Both required modes were tested independently.
2. Both required checkpoint positions were tested: mid-year K=6 and January boundary K=12.
3. The same seed, player, data build, command sequence and 24-month duration were used in the continuous and save/resume paths.
4. All four final GameState hashes match exactly, including RNG, and every first-difference path is null.
5. The state evolution guards and player command trace are non-vacuous.
6. Malformed, wrong-version, missing-envelope-state, and legacy missing-field behavior was recorded without altering the baseline product code.
7. The exact run commit was compared with 2240a8f; no product source/data/dependency/build-input changes were present.

**B4 reviewer verdict: REVIEW_PASS**, limited to G0.6 and the evidence above. The expanded, unexecuted test revision and optional artifact-enhanced workflow are not part of this verdict. This does not approve the whole experiment branch, does not close R7/R14, does not certify iQOO behavior, and does not imply that S0 is complete or that S1 is accepted.

