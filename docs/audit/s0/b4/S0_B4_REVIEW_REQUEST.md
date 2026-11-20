# S0-B4 Independent Review Request

## CURRENT ADDENDUM — frozen baseline vs. current save-validation test contract (20/11/2026)

This section supersedes the stale B7/phase-status statements below and makes a later one-assertion test-only change explicit. It does **not** rewrite the frozen B4 baseline result or claim a new baseline B4 run.

- **Frozen product baseline:** `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`.
- **B4 baseline test source:** commit `ae29c99330081ba2f6af3a6d4478ec8aefc8a1ad`, blob `722d62c0647f06bc2e3a49bdef1f348f4f3104f2`; the exact source blob is the same at tested HEAD `d2ae88e557e9895413462c5b069886bfc606adc7`.
- **Frozen baseline evidence:** tests-only run [44041104723](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44041104723), job `133895641421`, 6/6 test files and 70/70 tests. All four Historical/Sandbox × tick-6/tick-12 24-month continuation cases logged `MATCH` and `firstDifferingPath=null`. Missing RNG was accepted by baseline deserialization and continuation threw `TypeError`. No APK artifact was produced by this tests-only run.
- **Later test-only delta:** commit [14bd568](https://github.com/mtieu6470-maker/Victori3-mobile/commit/14bd56848b8db429b9037880b08887af7118d61f) changed only the missing-envelope-state assertion/name in `tests/s0-save-determinism.test.ts`: baseline `TypeError` → current explicit validation message `Save state is missing or invalid`. The current test blob is `e3d960725e1e1b41fc4f63d303a5b5d36cdb6ad7`. No baseline product source was changed by that test commit.
- **Why the expectation differs:** baseline `src/engine/save.ts` blob `b2faa2fef078398dd35e4ba099451f3ac6df8d59` directly reads `o.state` and writes `st.marketStats`; a missing state therefore fails with a native `TypeError`. The current v2 implementation blob `e54cce0397d25735540071b53d8291e30e332360` validates `envelope.state` first and throws the explicit error above. This is a post-baseline save-contract improvement, not a historical B4 baseline result.
- **Current-code CI for the later assertion:** exact commit `96042077abeef8b89fe9e46fdce97a2b566d70da` passed tests-only [44765197664](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44765197664) and Android debug [44765197668](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44765197668): current tree 13/13 files, 131/131 tests; Android run 44/44 suites, 131/131 tests, `report_valid=true`, Gradle success. Its log explicitly shows the current v2 validation-message test passing. This current-code run **does not replace** run 44041104723 as frozen-baseline B4 evidence.
- **Reviewer instruction:** inspect both versions separately. Use `ae29c99` / blob `722d62c` and run 44041104723 for the product-baseline B4 characterization; inspect `14bd568` / blob `e3d9607` and run 44765197668 only as current v2 test-contract evidence. Do not transfer current v2 behavior backward into the frozen 2240a8f result.
- **Current documentation review target before this addendum:** branch `claude/game-historical-sandbox-modes-kg7rj7`, HEAD `638f9d82e477807925d045d1c859d9fa0f10b017`. Re-fetch the branch HEAD before independent review.
- **Governance status correction:** B7 drafting is authorized by OD-20261116-11 §6 step 6 and has already reached `READY_FOR_REVIEW`; it is not `NOT_STARTED` or blocked on B4 review. B4 independent review and the separate owner `ACCEPTED` decision remain required for the final bounded S1-entry package. S1 and later runtime phases remain closed.

**Date:** 2026-11-17  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7` (sole/default branch; verify HEAD before review)

## Review target

- **Product baseline under test:** `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`
- **B4 test-source correction commit to review:** `ae29c99330081ba2f6af3a6d4478ec8aefc8a1ad` (`tests/s0-save-determinism.test.ts` only; contains both B4-SA-01 and B4-SA-02 corrections).
- **Prior successful CI reference (historical only):** [Run 44032178418](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44032178418), job `133866471284`, tested earlier test source at `e4924ca48264f8d0818eface51a28a87cd363b89`; its 69/69 test and 26/26 suite result predates the two corrections and must not be represented as validation of `ae29c99`.
- **First tests-only workflow attempt:** [Run 44039619132](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44039619132), job `133890749856`, checked out `08ec7a3bb485ab0457a99ef77ddeb8ed9a3122e0`; `npm ci` passed, but all six suites failed during collection because ignored generated inputs were not prepared; zero test assertions executed.
- **Tests-only workflow correction commit:** `56cdbf46fea6ed2909a59b4b3f1db596f4a32104` (adds `npm run prepare-assets` before Vitest; no app build or APK step).
- **Review target:** inspect the exact current branch HEAD before review, verify the B4 test file is still the corrected `ae29c99` version, and inspect the updated handoff/audit addenda.

Review the exact GitHub content at `ae29c99` for the B4 test source, not a local file from another revision. Verify the current branch HEAD and ensure no later commit changed `tests/s0-save-determinism.test.ts`. The successful CI run above is a historical reference only; the tests-only rerun after the workflow correction is still pending.

## Scope and constraints

This is an independent review of S0-B4 characterization evidence under owner decision OD-20261116-11 and v3.2 §6.7, as amended by S0 v3.3.

- Review/test-only changes are permitted in this B4 task. No product code was changed by the B4 test commits.
- Do **not** modify `src/engine/`, `src/engine/save.ts`, RNG implementation, save schema, migration, gameplay, generated data, assets, Android resources, or CI workflows.
- Do not fix the missing-RNG behavior. Record it as a finding.
- B7 documentation/risk preparation is already authorized and `READY_FOR_REVIEW` under OD-20261116-11 §6 step 6. Do not begin S1 or any later runtime phase before independent `REVIEW_PASS` and owner `ACCEPTED` for the exact bounded S1-entry package.
- Do not download/install the automatically generated debug APK or use it to claim R14 is verified.

## Evidence to verify

### 1. The original mismatch

The first CI attempt reported 64/68 tests passed and four determinism tests failed at `countries.ABD.group`. Both final-state SHA-256 values in each pair were already equal. The comparator reported an own-key-presence difference even though one side had `group: undefined` and the JSON round-trip removed that property.

### 2. Engine semantics for `Country.group`

At the review commit, inspect:

- `src/engine/types.ts` — `Country.group?: string`.
- `src/engine/init.ts` — country construction includes `group: e.group`.
- `src/engine/save.ts` — `JSON.stringify` / `JSON.parse` save implementation.

Independently search all engine modules for any logic that distinguishes a missing `group` property from an own property whose value is `undefined`, including `hasOwnProperty`, the `in` operator, `Object.keys`, property descriptors, or equivalent behavior. Confirm whether omitting undefined-valued object properties is semantically equivalent for this GameState field.

### 3. Comparator correctness

Inspect `canonicalize`, `firstDifference`, and `firstJsonDifference` in the B4 test.

Check that:
- object key order is normalized;
- undefined-valued object properties are treated as omitted;
- undefined array entries/holes become `null` without changing array positions;
- arrays are never sorted;
- the first differing path is still reported accurately;
- the comparator truly matches the JSON save representation for the values that can occur in GameState.

Pay particular attention to whether JSON values beyond `undefined` (for example `NaN`, infinities, negative zero, functions/symbols, custom `toJSON`) can occur in GameState. If they cannot occur, establish that from the data model/engine rather than assuming it. Identify any comparator edge case that could cause a false PASS or false FAIL.

### 4. Determinism coverage

Verify the four cases:

| Mode | Save cut | Continuation |
|---|---:|---:|
| Historical | tick 6 (1836-07) | to tick 24 |
| Historical | tick 12 (1837-01) | to tick 24 |
| Sandbox | tick 6 (1836-07) | to tick 24 |
| Sandbox | tick 12 (1837-01) | to tick 24 |

All use seed 21, player GBR, the same data/map build and the same scheduled commands. Verify complete GameState comparison includes RNG and preserves order-sensitive arrays. Verify the non-vacuity assertions are substantive and the command traces match.

The recorded outcomes were:

- Historical final hash: `a6751c47e91eb6786366e086737bb75da68ff8b4b0c617d496bc5e61627228d8` for both cut points.
- Sandbox final hash: `b0d489068f6d3ef1d59fd862405df46851717fff9571b3c95379dbaa407a57cd` for both cut points.
- All four cases: `firstDifferingPath=null`, result `MATCH`.

Data hashes:
- `db.json`: `1ce3a4613e1b5c491b88386d25d297961d71baf78c2c8e67d58c8d54ccb3bd24`
- `map.json`: `9a6a6979dd5e7adc9d5953fc5f089ac94dee4079433ed1d340535dcbe877a696`

### 5. Malformed and legacy save characterization

Check that the tests and CI logs accurately record:

- malformed JSON → `SyntaxError`;
- foreign format → rejected;
- unsupported version 999 → rejected;
- missing envelope state → `TypeError`;
- missing `marketStats` → empty-object fallback and one-month continuation succeeds;
- missing RNG → deserialization succeeds with `rng === undefined`, then one-month continuation currently throws `TypeError`.

Review whether the missing-RNG test should assert the expected continuation failure or whether its assertion plus explicit CI log is sufficient characterization. Do not change the observed baseline behavior to make the test green.

## CI and workflow side effect (must be disclosed)

The push-triggered workflow `.github/workflows/android-apk.yml` automatically proceeded from passing tests to APK assembly and artifact upload. This happened unintentionally and conflicts with the R14 instruction not to generate a new APK before export/import is verified on the installed baseline. The APK artifact was not downloaded or installed by ChatGPT. R14 remains unverified. Do not treat the APK artifact as device evidence.

## Required reviewer response

Return a bounded review with:

1. Exact branch and HEAD reviewed.
2. Files/commits/CI evidence inspected.
3. Findings with severity, exact file/line, impact, and required correction (if any).
4. Explicit assessment of comparator JSON semantics and engine treatment of `Country.group`.
5. Explicit assessment of missing-RNG characterization and R14 workflow side effect.
6. One verdict: `REVIEW_PASS` for the bounded B4 test/evidence package, or `CHANGES_REQUESTED`.

Do not write to GitHub or alter the repository. A `REVIEW_PASS` is not owner acceptance. B7 remains `READY_FOR_REVIEW`; its reviewer verdict plus the owner's explicit `ACCEPTED` decision are required before S1, not before B7 documentation/review.


## 6. Follow-up tests-only CI status (2026-11-17)

The first tests-only run did not reach the test assertions because the workflow called `npm run test:fast` without generating ignored test inputs. The repository's canonical preparation is `npm run prepare-assets` (data, map and content generators); the workflow now runs that step before Vitest.

The workflow-only correction is commit `56cdbf46fea6ed2909a59b4b3f1db596f4a32104`. It deliberately excludes Vite build, Capacitor, Gradle, APK packaging and artifact upload; the pre-existing APK workflow remains unchanged. A new dispatch of the corrected workflow is required. Until logs from that run exist, CI validation of the corrected B4 test source is `NOT_TESTED`.

The reviewer must not mistake run `44039619132` for a B4 test assertion failure or a B4 pass: it reports six suite collection failures and zero tests executed. The reviewer must also not use run `44032178418` as post-correction evidence because it predates commit `ae29c99`.



## 7. Corrected tests-only CI completed — PASS (2026-11-17)

The corrected workflow has now been dispatched and passed. This section supersedes the pending-rerun language in §6.

- **Run:** [44041104723](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44041104723)
- **Exact tested HEAD:** `d2ae88e557e9895413462c5b069886bfc606adc7`
- **Job:** `133895641421`, “Vitest (no build, no APK)”; conclusion `success`.
- **Commands:** `npm ci` success; `npm run prepare-assets` success; `npm run test:fast` success.
- **Vitest:** 6/6 test files passed; 70/70 tests passed; 0 failures; duration 80.59 seconds.
- **B4-SA-01:** missing RNG continues to be accepted by deserialize and the one-month continuation throws `TypeError`; the corrected test assertion passed.
- **B4-SA-02:** both JSON-equivalence comparator tests passed, including undefined value handling, array order, non-finite numbers and negative zero.
- **Save/load matrix:** Historical tick 6 and 12 both `MATCH` with final SHA-256 `a6751c47e91eb6786366e086737bb75da68ff8b4b0c617d496bc5e61627228d8`; Sandbox tick 6 and 12 both `MATCH` with final SHA-256 `b0d489068f6d3ef1d59fd862405df46851717fff9571b3c95379dbaa407a57cd`. All four `firstDifferingPath=null`.
- **Artifact check:** no workflow artifacts; no APK built or uploaded. The existing APK workflow is unchanged.
- **Diff boundary:** from B4 correction commit `ae29c99` to tested HEAD `d2ae88e`, only the tests-only workflow and documentation changed; the B4 test source did not change.

The test/CI evidence is now available for independent review. The reviewer must still inspect the source and answer every required point in this packet; a green CI run alone does not imply `REVIEW_PASS`. No repository writes are requested from the reviewer.

**Current gate:** B4 remains `READY_FOR_REVIEW`; independent review and owner `ACCEPTED` remain pending. B7 is separately `READY_FOR_REVIEW`; S1 remains `NOT_STARTED` until the complete bounded package receives independent `REVIEW_PASS` and owner `ACCEPTED`.
