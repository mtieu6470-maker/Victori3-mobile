# OWNER AUTHORIZATION — S1-CLK-01 CLOCK RUNTIME EXPERIMENT

**Date:** 2026-11-20  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Implementation branch:** `experiment/owner-authorized-clock-runtime`  
**Starting HEAD:** `1b6388881aa54fec9e3acc74d370cf7eeb3dac0c`  
**Task:** `S1-CLK-01 — decouple wall-clock simulation scheduling from rendering and enforce the owner-set Speed-5 ceiling`.

## 1. Owner instruction

After the implementation was stopped because Claude could not independently review S0-B7, the project owner explicitly instructed:

> “Hiện tại k cho claude xem, ô cứ làm đi.”

This is recorded as an explicit, narrow owner authorization for ChatGPT to implement and self-test **S1-CLK-01 on this isolated experimental branch without Claude review**. The instruction does not claim that an independent review has occurred.

## 2. Exact authorized scope

Allowed on this branch:
- Add a pure Gregorian-month / monotonic pacing helper.
- Replace the render-frame-driven timer in `src/ui/game/controller.ts` with a non-render scheduler.
- Keep the existing monthly `stepMonth` simulation pipeline and monthly save tick semantics.
- Enforce an absolute Speed-5 ceiling of **0.5 in-game Gregorian days per real second**.
- Choose a monotonic slower mapping for Speed 1–4; the initial mapping must be documented and tested.
- Preserve fractional month progress across pause/resume; reset it for a new/load game and manual month stepping.
- Bound elapsed time admitted per scheduler pulse so a long UI stall/background throttle slows the simulation instead of causing instant catch-up.
- Add deterministic unit tests for calendar lengths, leap years, pacing ceiling, speed changes, pause/resume, and stall behavior.
- Run the relevant test/typecheck/build workflows where available; record exact outcomes.

## 3. Explicit exclusions

This authorization does **not** authorize:
- Changing `GameState`, save schema/version, monthly `tick` meaning or legacy-save migration.
- Introducing day/six-hour simulation ticks or changing the monthly system cadence.
- Extending the campaign end from 1936 to 2026.
- Changing economy, POP, political, diplomatic, military, AI, map, content, historical data or assets.
- Worker/renderer/WebView lifecycle architecture changes beyond using an interval for the bounded scheduler.
- Android signing, keystore/secrets, release workflows, APK installation or distribution.
- Merging into the default branch or the existing S0 audit branch.

## 4. Review and phase status

- Claude review: `NOT_REQUESTED_BY_OWNER_FOR_THIS_EXPERIMENT`.
- ChatGPT self-review: required and must be labeled self-review, not independent review.
- Independent review: `NOT_PERFORMED`.
- Owner authorization: limited to this task and branch only.
- S0-B7 remains `IN_PROGRESS`; overall S0 remains `PARTIAL — NOT COMPLETE`.
- Bounded S1-entry package remains `NOT_TESTED`; S1 is not generally opened by this exception.
- This branch is experimental and unmerged. Runtime code must not be represented as independently reviewed, owner-accepted for release, or production-ready.

## 5. Verification requirements

The implementation must demonstrate:
1. At Speed 5, game calendar advancement never exceeds 0.5 Gregorian days per monotonic real second.
2. A 31-day month takes at least 62 seconds of admitted real time at Speed 5; shorter months take proportionally less.
3. 30/60/90/120 Hz rendering does not affect pacing because the simulation scheduler is not a render callback.
4. Pausing/backgrounding does not accrue offline time; resume starts a new monotonic interval without losing already accumulated fractional month progress.
5. A delayed scheduler pulse cannot fast-forward multiple months in one callback or admit more than the bounded elapsed-time budget.
6. Existing monthly deterministic simulation and save format remain unchanged.
7. All added code and tests are committed on this branch with exact SHA and test evidence.


## 6. Implementation and CI result — 2026-11-20

- Implemented on this isolated branch through tested HEAD `9b4419cd782d5db81d74541da022aa02327829c6`.
- Added Gregorian monthly pacer and replaced RAF-driven controller timing with a 50 ms timer, 100 ms maximum elapsed-time admission per pulse and the hard Speed-5 cap of 0.5 game-day/real-second.
- Initial lower-speed mapping is 0.1/0.2/0.3/0.4 game-days/second for Speed 1–4; this is provisional implementation tuning and requires device play-test.
- Added tests for calendar/leap years, cap, pulse backlog, speed changes, pause/resume, manual stepping, save v1 boundary behavior and 30/60/90/120 Hz independence.
- CI run `44688972480` completed successfully on the exact tested HEAD: build passed, 7/7 test files and 115/115 tests passed, Gradle `BUILD SUCCESSFUL`. APK artifact ID `14608106401`; CI evidence artifact ID `14608161171`.
- Save format/version and monthly `GameState.tick` meaning are unchanged. `save()` clears fractional progress toward the current uncommitted month to preserve parity between live and loaded v1 saves. Monthly engine pipeline, `GAME_END_YEAR = 1936`, and campaign scope unchanged.
- No iQOO device benchmark, hands-on installation/QA, direct Victoria 3 pacing benchmark or Claude independent review. This is ChatGPT's implementation/self-test only. No merge or release approval is implied.