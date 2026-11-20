# DEV-006 FOLLOW-UP — FAST-FORWARD / RAF CONCURRENCY SELF-REVIEW

**Runtime implementation SHA:** e5eb5e4744b4c5569f7fe997c523cebe64ff3250  
**Latest code/test review target:** `1a1e10d8aeb49d54058dddfe0a220a344125a12f`  
**Code introduction commit:** c76d05e9f871478ab3751907ffc11042f53baef3  
**Test stabilization commits:** 6e11171184bb59c34f41d5ec57daa2faf7f35d05, cfde726a90801c5eed8b05402082cd3b1a7d5718, c7627d7fe7622cef561c01706f733943b5e97b68, e5eb5e4744b4c5569f7fe997c523cebe64ff3250  
**Review type:** ChatGPT source self-review; NOT an independent Claude review  
**Date:** 2026-11-20

## 1. Finding

The DEV-006 monthly clock bounded the RAF loop, but the controller exposed an asynchronous fastForward(months) method that did not coordinate with the live RAF scheduler. A caller could invoke it while the game was running; both paths could advance the same GameState. In addition, fastForward yielded to the browser every six months. During that yield, load() or newGame() could replace this.st; the old async operation would then resume and advance the replacement game.

No call site for fastForward was found in the inspected App.tsx or Setup.tsx, but the controller method itself is public and therefore needed an invariant rather than relying on current UI absence.

## 2. Bounded correction

In src/ui/game/controller.ts:

- fastForward accepts only positive safe integers and refuses to start when another operation is busy.
- It captures the original GameState reference, stops the RAF loop, resets partial elapsed time and temporarily pauses the controller.
- It restores the previous paused/running state after successful completion or a thrown error.
- An operation token invalidates the suspended fast-forward when newGame() or load() replaces the game. The stale finally block cannot clear busy state, alter pause state or resume the RAF loop of the replacement game.
- setPaused(), stepOnce() and command() refuse player actions while fast-forward is busy.
- The operation continues to use the existing monthly stepMonth(); no engine calendar or system cadence was changed.

## 3. Focused regression coverage

Added tests/controller-fast-forward.test.ts with four deterministic cases:

1. The live RAF scheduler is cancelled during fast-forward and the prior running state is restored afterward.
2. Overlapping fast-forward calls are rejected; manual step, pause toggle and commands cannot interleave while busy.
3. Loading a new save during the six-month yield invalidates the old operation; the newly loaded state remains unchanged.
4. If the seventh monthly step throws after the first six-month yield, the promise rejects, busy state clears, and the controller restores the previous running state/RAF scheduler.

The tests use an explicitly controlled setTimeout continuation instead of real delays or fake RAF timers.

## 4. Verification

- Tests-only run [44759569097](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44759569097): SUCCESS — 44/44 suites, 129/129 tests, 0 failures, 0 pending.
- Android debug build [44759568967](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44759568967): SUCCESS — data/map/web build, TypeScript check, test suite, Capacitor sync and Gradle assembleDebug.
- APK artifact ID: 14640013380; size 18,052,472 bytes.
- APK SHA-256: 365e9296b5d9d5b8dc63a0965e790bb407994056746b783440c857e58839285b.
- Artifact ZIP SHA-256: 01d2fceaad3cc381f7c6bd80b79e7b8cc95e00e331185351681909188ca3c1f2.
- CI evidence artifact ID: 14640548222; ZIP SHA-256: 6b71f12ea22c9dd0adce989e38a0b69d2d10358d570cbd27d8c59c72df356f18.
- Debug certificate only. Physical device install/runtime QA remains NOT_TESTED.

## 5. Remaining review requirements

This self-review does not substitute for the requested independent Claude review. The reviewer must inspect exact SHA e5eb5e4744b4c5569f7fe997c523cebe64ff3250, especially RAF integration, background-tab semantics, fastForward invalidation, error behavior and speed product semantics. Owner acceptance remains pending. No S0/S1/S22 gate changes are made.

## 6. Scope

Only controller scheduler coordination and its tests changed in the code slice. No daily tick, economy/POP/politics/diplomacy/military cadence, RNG model, save schema, historical data, assets, UI design, Android signing or release channel was changed.

- **Test-only follow-up at exact code/test SHA `1a1e10d8aeb49d54058dddfe0a220a344125a12f`:** the fourth exception-recovery regression was added after the 44/44 and 129/129 CI result at e5eb5e4. Current exact-target tests-only run [44763263753](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44763263753) and Android debug run [44763263728](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44763263728) are `CI_PENDING` as last checked. Do not carry forward the e5eb5e4 result as evidence for 1a1e10d.
