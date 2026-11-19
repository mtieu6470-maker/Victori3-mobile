# DEV-001–DEV-003 — Claude code review and one bounded correction pass

**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Review target code HEAD:** `751ae87a7b4a8e844e8e093937bad14589eb4225`  
**Implementation base:** `8608f9fc1db4ccabeeba0ba8c0cd046cacd69f70`  
**Included commits:** `96f90338acc49beaed4313a116b2867ce3bacec3`, `a42a005c5da2ddf7570856558f0cb6feb9b4df7f`, `751ae87a7b4a8e844e8e093937bad14589eb4225`  
**Review type:** bounded code review plus at most one corrective pass  
**APK/device:** no install, no uninstall, no secrets/keystore/signing changes.

## 1. Changed implementation files

- `src/engine/metrics.ts`
- `src/engine/historical.ts`
- `src/engine/systems/events.ts`
- `src/engine/commands.ts`
- `src/engine/world.ts`
- `tests/modes.test.ts`

Related documents:
- `docs/spec/HISTORICAL_EVENTS_GLOBAL_CALIBRATION_ARCHITECTURE_PROPOSAL_VI.md` §§14.1 and 14.4
- `docs/audit/s0/S22_IMPLEMENTATION_TEST_MATRIX_2026-11-18.md` sections 12–14
- `docs/audit/s0/S22_CONTINUOUS_PROGRESS_REPORT_VI.md`

## 2. DEV-001 — canonical rank predicate

Review:
1. Confirm `rank_at_most` uses exactly the same `powerScore()` and candidate actor set as the public `rankings()` function: alive, non-decentralized, subjects included.
2. Challenge competition-rank semantics (ties share 1,1,3), stable ID ordering, threshold validation, malformed/dead/decentralized actor handling, and non-finite snapshot failure.
3. Check per-tick `WeakMap` context caching, nested `all`/`any` reuse, stale tick rejection, diagnostics growth and mutation within a tick.
4. Check import graph: metrics → diplomacy, historical → metrics, events → historical; confirm no circular module initialization hazard.
5. Verify Sandbox does not activate historical priorities or decision-window processing.

Relevant tests: RANK-01–RANK-08 in `tests/modes.test.ts`.

## 3. DEV-002 — player decision revalidation and safe consumption

Review:
1. Confirm the `decide` command no longer removes a pending decision or fires an event before validation.
2. Verify current mode, canonical window/accession identity, current player actor, alive/customs-union state, current date interval, current causal preconditions, exact canonical pending option set and submitted option ID.
3. Challenge pending behavior: invalid submitted option must preserve a still-valid pending record; expired/invalidated/stale pending data must not fire the event; successful application must precede queue removal, fired-event addition and counter increment.
4. Verify Zollverein `join`/ `stay_out` lifecycle and retry behavior.
5. Audit effect preflight for all current effect types: `set_law`, `legitimacy`, `relation`, `drop_claims`, `transfer_region`, `regime_change`, `merge`, `ig_approval`, `relation_all_naval_powers`.
6. Challenge `ig_approval` semantics and bounds, the `luxembourg → LUX` stable ID mapping, and Romanian `into: ROM` destination behavior.
7. Check for corrupted/missing pending fields, malformed definitions, invalid target IDs and exceptions in condition evaluation. Identify any path that can consume an option or partially change state after rejection.

Relevant tests: DEC-CMD-01–DEC-CMD-09 in `tests/modes.test.ts`.

## 4. DEV-003 — staged GameState transaction

Review especially carefully:
1. `cloneDecisionValue` assumes GameState is a plain data graph. Verify every field in `GameState` satisfies this now; look for typed arrays, Map/Set, Date, class instances, custom prototypes, accessors or external references.
2. Challenge cycle/alias preservation and the fact that clone uses `Object.keys` / root `Object.assign`.
3. Verify exceptions during any handler discard staged state and leave the live object unchanged, including laws, country creation, region ownership, territory logs, relations, event logs, nextId and counters.
4. Assess root-field replacement with respect to UI references, engine loops, caches and derived indexes. In particular, `transferRegion` / `createNation` invalidate global caches while operating on the staged copy; verify the post-commit cache behavior.
5. Estimate the clone cost on the full world state and worst-case event decision count. Confirm decision application is rare enough, or recommend a more selective transaction plan if full-state clone causes Android allocation/GC/ANR risk.
6. Verify preflight runs before state clone commit and that unsupported/malformed effect payloads cannot apply earlier effects first.
7. Inspect test `decision effect transaction rollback`: the valid first law effect is followed by a merge handler that throws during staged politics recalculation; verify assertions actually prove original state is unchanged, and add missing coverage if needed.

Relevant tests: DEC-TX-01–DEC-TX-05 in section 14 of the S22 matrix (source currently contains the rollback fixture).

## 5. Required validation

Re-fetch and record exact current HEAD before review. Run, as available:
- `npm ci`
- `npm run typecheck`
- `npm run test:fast`
- `npm run build`
- confirm exact test counts and no skipped/failing tests.

Known CI evidence at request preparation:
- DEV-001 tests-only run `44430809753`: 6/6 files, 75/75 tests PASS.
- DEV-002 tests-only run `44433012743`: 6/6 files, 83/83 tests PASS.
- DEV-002 Android debug run `44433012918`: SUCCESS; Gradle build succeeded, artifact ZIP digest `e7810065ee7f87881f4b809aae4bbd4ee230b9a83148ec2ecc4bece2fc704deb`. This APK is superseded and must not be delivered.
- DEV-003 tests-only run `44433707994` and Android run `44433708015` were still running when this request was prepared. Re-fetch both before review conclusions.

If the reviewer environment cannot run a command, report the exact blocker and use CI evidence only for the exact matching SHA. Do not assume typecheck/build passed from the source diff.

## 6. One bounded corrective pass

If material issues exist:
- Make at most one corrective commit limited to the files in §1 and directly necessary tests.
- Do not expand into save schema/migrations, event data research, benchmark ETL, geography taxonomy, RNG migration, structural-rule redesign, UI/assets, Android resources, signing, secrets or unrelated engine work.
- Preserve exact base/head and document each fix with tests/exit codes.
- Do not install/build a device APK as part of review; the corrected ChatGPT verification pipeline will produce the final artifact.

If no material issues exist, return a no-write review note with exact HEAD and evidence.

When Claude authors corrections, classify the result as **Claude review + one corrective pass**, not an independent REVIEW_PASS of its own changes. ChatGPT will then re-fetch and verify the corrected final HEAD.

## 7. Required response

- exact branch and reviewed HEAD;
- changed-file range and commits inspected;
- findings by severity with file/line, impact and required correction;
- transaction/cache/performance assessment;
- tests/build commands, exact results and remaining limitations;
- correction commit or explicit no-write statement.

No merge, device install, signing-secret, keystore or APK-release authorization is included in this request.
