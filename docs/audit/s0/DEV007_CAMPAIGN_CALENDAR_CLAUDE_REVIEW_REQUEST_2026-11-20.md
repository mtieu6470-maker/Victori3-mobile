# DEV-007 — Independent review request: campaign calendar 1836–2026

**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Review type:** independent, no-write code/test review  
**Owner authorization:** `docs/coordination/OWNER_DIRECTIVE_CAMPAIGN_RANGE_2026-11-20.md`  
**Base SHA:** `01e57d57a5715fadb13f54fa67b56f1cdbdef7ac`  
**Exact code/test target:** `387ae24eae91b560b0f10cec6d59febb11396401`  
**Current review scope:** DEV-007 only; do not infer a project phase transition.

## 1. Owner decision and intended contract

The owner changes the playable campaign period to January 1836 through December 2026 inclusive for Historical and Sandbox. This supersedes the earlier 1836–1936 period only for the campaign calendar. It does not make historical data/events for 1937–2026 complete or source-verified.

- Tick 0 is January 1836.
- Tick 2291 is December 2026 and is the final playable month.
- January 2027 must never be simulated.
- Both modes share the same engine, calendar and terminal behavior.
- Monthly cadence remains; this task does not convert simulation to daily ticks.
- Save schema/version is unchanged.

## 2. Exact implementation and changed files

Review the exact code/test target `387ae24eae91b560b0f10cec6d59febb11396401` and these implementation paths:

- `src/engine/core.ts` — campaign start/end constants, end tick and boundary helpers.
- `src/engine/init.ts` — 1836 start year uses the calendar constant.
- `src/engine/simulation.ts` — `stepMonth()` guards invalid/terminal ticks and returns a boolean; `runMonths()` stops when the engine says the campaign is complete.
- `src/ui/game/controller.ts` — RAF, manual step, pause/resume and fast-forward respect the terminal boundary; fast-forward clamps to remaining months, stops on `stepMonth() === false`, and does not resume a completed campaign.
- `src/ui/screens/Setup.tsx` — new-game campaign range label.
- `src/ui/App.tsx` — date HUD/tooltip displays campaign range and terminal state.
- `tests/campaign-calendar.test.ts` — start/end tick, both modes, strict no-op, batch stop, terminal save/load round-trip and invalid tick helpers.
- `tests/controller-fast-forward.test.ts` — controller fast-forward cap and pause/resume boundary regression; earlier fixture fixes type the step mock and isolate shared spy call history.

Implementation commit chain:
- `f26d62041de74f2b28897229be8982f23b84910f` — initial DEV-007 runtime/UI/calendar and owner amendment.
- `255734d70f4f3ea95638feeccf0f9b149899cdc9` — mock return type fix after `stepMonth()` became boolean.
- `85e0ad35fc709806048edc04b829089a6817b087` — isolates step spy call history and stabilizes the boundary controller test.
- `387ae24eae91b560b0f10cec6d59febb11396401` — stops fast-forward immediately on a false step result; adds `runMonths()` and terminal save/load tests.

## 3. CI/build evidence for the exact target

- Tests-only workflow [44782634519](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44782634519): SUCCESS; `head_sha` equals the exact target; 15/15 test files, 139/139 tests, zero failed/pending/todo; Vitest exit 0.
- Android debug workflow [44782634368](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44782634368): SUCCESS on the exact same `head_sha`; 15/15 files, 139/139 tests; Gradle `BUILD SUCCESSFUL in 1m 31s`.
- APK: 18,052,808 bytes; SHA-256 `9377c9c3aac053b193e96d2fbd151b6fd59cb333a6169e1df542ddff54e067b9`.
- APK artifact ID `14652853298`; artifact ZIP size 17,564,905 bytes; artifact ZIP SHA-256 `a81d22f0b674202c843b6070dfbb186da65046e141d9ebb8a1b176c5375d8ab8`.
- CI evidence artifact ID `14652978121`; ZIP size 113,056 bytes; SHA-256 `a21823e13e5a9ba1818fae2f59e9db0760a4b5d37136a304f027a46a3a632911`.
- APK Debug certificate SHA-256 `c7d887ef3db71536110f1c8d609621a05726e36575257ed2516bc0d8dc3820d8`; Android V1/V2 signature verification true; `apksigner_exit_code=0`.
- APK ZIP and CI evidence ZIP were downloaded and their SHA-256 values independently matched GitHub artifact digests. APK file SHA was independently checked against the evidence manifest.

Intermediate failures that must not be confused with the final candidate:
- On `f26d620`, a pre-existing test mock returned `void` after `stepMonth()` was typed to return boolean; the mock was corrected in `255734d`.
- On `255734d`, one controller assertion included calls retained by a shared module-level spy (136/137 passed); `85e0ad3` clears that spy in the specific test.
- The final exact target `387ae24` passes 139/139 tests and Android build.

## 4. Required independent review

Review the complete diff from base `01e57d5` to exact target `387ae24`. Pay particular attention to:

1. Off-by-one/date semantics: Jan 1836 = tick 0; Dec 2026 = tick 2291; next step is a strict no-op.
2. `stepMonth()` return contract and every call site: no invalid or terminal tick mutates state; system counters/RNG are untouched after completion.
3. `runMonths()` behavior for requests larger than remaining campaign months; no January 2027 date.
4. Controller races: RAF after end, manual step, repeated pause/resume, fast-forward clamping, early false return, busy cleanup, and load/new-game invalidation from the existing DEV-006 concurrency work.
5. Terminal save/load behavior: current schema v2 round-trip preserves date/tick and cannot advance after reload; migration/schema compatibility is unchanged.
6. Historical/Sandbox parity: identical calendar boundary and common system pipeline; the two modes do not get separate stop rules.
7. UI labels/tooltip: the setup screen and date HUD display the actual inclusive range without implying post-1936 historical data is already calibrated.
8. Test adequacy: ensure boundary tests are substantive and non-vacuous; identify missing invalid dates/ticks or concurrency cases if material.
9. Confirm the change did not alter monthly cadence, simulation formulas, RNG algorithm/order, historical runtime facts, media/assets, pack delivery, Android permissions, signing/secrets, save schema or stage-gate state.

## 5. Explicit non-claims and limitations

- This is a calendar range implementation, not full Victoria 3 parity.
- Historical data/events for 1937–2026 remain a source-backed research/integration gap. Do not describe the period as historically calibrated without evidence.
- No daily tick was introduced.
- The APK remains an ~18 MB debug bootstrap. The approximately 4–5 GB full installed game target is **not met**; no new offline packs/media library were included in this task. No padding or duplicate files were used.
- No physical iQOO device QA was performed; no APK was installed. R14 remains a separate blocker for device installation/migration. Release signing was not performed.
- S0/B4/B7 statuses and S1/S22/S23 gates remain unchanged. This DEV-007 review is not an owner `ACCEPTED` decision or phase transition.

## 6. Reviewer response

Return one verdict: `REVIEW_PASS` or `CHANGES_REQUESTED`.
For each finding include severity, exact file/line or symbol, reproducible scenario, impact and bounded correction.
Record exact inspected HEAD, tests/CI/artifact evidence inspected, and confirm no files were modified.
Do not claim owner acceptance or a full-project/game parity milestone.

**Independent reviewer:** Claude Code (or an owner-assigned independent fallback if applicable)  
**Reviewed HEAD:** ____________________  
**Verdict:** REVIEW_PASS / CHANGES_REQUESTED  
**Date/findings:** ____________________
