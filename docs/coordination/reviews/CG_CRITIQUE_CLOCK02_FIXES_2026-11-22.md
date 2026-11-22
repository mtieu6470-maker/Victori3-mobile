# CG-18 — Re-review fixes for CLOCK-02 (CG-16)

- Date: 2026-11-22
- Branch: `ccr-b27f3fb8-epfpd6`
- Scope: updated `simCore.ts`, `simHost.ts`, `sim.worker.ts`, `controller.ts`, `simulation.ts`, `tests/sim-host-worker.test.ts`, `tests/sim-core-protocol.test.ts`, `tests/controller-clock.test.ts` and `tests/controller-fast-forward.test.ts`.
- Verdict: **CG-16 fixes materially implemented; one residual P2 remains in the depth/range of worker reply validation.**
- This is a static review. I did not run the reported 229 tests or build.

## 1. Re-review matrix

| CG-16 | Re-review | Result |
|---|---|---|
| CG16-01 runtime worker failure/recovery | Terminal host failure settles pending requests; controller pauses and recovers only from a serializable acknowledged UI checkpoint when sub-monthly phases are empty, otherwise blocks until load/new game. | ACCEPTED with rollback limitation documented below. |
| CG16-02 rejected request/inflight wedge | Synchronous postMessage failure is converted to a response; controller catches request rejection and clears only its owned in-flight slot in finally. | ACCEPTED. |
| CG16-03 worker watchdog | Per-request 30s timeout fails host and settles pending requests. Explicitly provisional pending Android benchmark. | ACCEPTED provisionally; Android calibration remains open. |
| CG16-04 inline dispose race | Inline host checks disposed again inside queued microtask. | ACCEPTED. |
| CG16-05 WorkerSimHost tests | Fake-worker tests cover correlation/order, DataCloneError, crash, timeout, malformed envelope, invalid kind/generation/missing fields, dispose and controller recovery. | ACCEPTED, with residual nested-payload validation gap below. |

## 2. CG18-01 — Payload validation is still shallow

- **Severity:** P2
- **File/lines:** `src/ui/game/simHost.ts:56–72`; consumers at `src/ui/game/controller.ts:203–208` and `377–385`.
- **Status:** the previous top-level issue is fixed. Current `isValidReply()` now checks object envelope, `ok`, matching generation, expected success kind and required top-level fields. The old reproduction using `res: {}` or a wrong generation is rejected and must not be reported as still open.
- **Residual:** kind-specific validation remains shallow:
  - state accepts any non-array object as `snapshot`, including `{}`;
  - advance accepts any finite numbers, including negative/fractional `hours`, `monthlyBoundaries`, `hour` and `tick`;
  - advance accepts any string for `stop`, not the `AdvanceStop` enum;
  - optional `stale` and `hostFailure` flags on error responses are not type-checked if present.
- **Reproduction:** respond to a valid `newGame` request with `{ok:true, gen:<matching>, kind:"state", snapshot:{}}`; or to `advance` with `hours:-1`, `monthlyBoundaries:0.5`, `hour:-1`, `tick:-1`, `stop:"unknown"`. These pass current top-level checks.
- **Impact:** `takeSnapshot()` assigns the snapshot directly to `controller.st`; a shallow object can cause later UI/engine consumers to fail. An invalid advance reply can poison clock/backlog accounting or move the displayed clock outside the campaign. This does not imply an attacker-controlled boundary—the worker is same-origin application code—but it weakens the protocol guard against worker bugs, stale/mismatched bundles or malformed responses.
- **Fix:** validate GameState snapshot shape (prefer the canonical save/GameState validator if one exists; otherwise validate required nested fields), not merely `typeof object`. Validate advance integer/non-negative/range constraints and `stop` against the enum. If optional error flags are present, require booleans. Keep the matching-generation and expected-kind checks already added.
- **Regression tests:** add nested malformed snapshot, negative/fractional counters, out-of-range hour/tick, unknown stop string and non-boolean error flags. Each malformed reply should fail the host, settle all pending requests and enter the existing recovery/blocking policy.

## 3. CG16-01 recovery boundary — accepted with explicit rollback semantics

The recovery checkpoint is the **last state acknowledged by the controller**, not necessarily the worker's transient state at the instant of crash. That is a valid deterministic rollback strategy when sub-monthly systems are empty. However, an in-flight request that was not acknowledged may have advanced the worker beyond the UI checkpoint; recovery can discard those unacknowledged hours/month step. Document this as rollback-to-last-acknowledged-state, not preservation of the worker's exact crash-time state.

The current recovery test compares continuation with an uninterrupted simulation at the same acknowledged hour. It does not prove that unacknowledged work is preserved, nor should it claim that.

## 4. Other checks

1. `subMonthlyPhasesEmpty()` checks hourly, daily and weekly registries; this is consistent with the current checkpoint guard. It must remain fail-closed as new sub-monthly systems are registered.
2. Worker message handling is synchronous around `core.handle`; no async operation is interleaved inside one request, so received message order is preserved.
3. `WorkerSimHost.fail()` clears timers, settles every pending request with `hostFailure`, and terminates the worker.
4. A synchronous `postMessage` DataCloneError is treated as a request-level failure and leaves the host usable. That is reasonable because the request was not delivered; controller pauses/reports the error.
5. Controller's in-flight slot is cleared only by the promise that owns it. Operation tokens prevent invalidated fast-forward work from overwriting a newly loaded/new game state.
6. Dispose clears RAF, toast timers, visibility listener, subscriptions and host.
7. The 30-second watchdog remains provisional. It is not evidence of measured Android performance.

## 5. Conclusion to Claude

CG-16's five original findings can be closed. The current top-level reply checks also fix the prior malformed-envelope/wrong-kind/wrong-generation cases. Keep **CG18-01 P2** open only for deep snapshot and numeric/enum validation, then add the listed tests. Keep Android watchdog calibration as a separate performance gate.

No production code was changed by this review. No build/test was run.
