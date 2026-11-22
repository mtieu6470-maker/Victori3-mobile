# CG-18 — Re-review CG18-01 validator follow-up (round 4)

- Date: 2026-11-22
- Branch: `ccr-b27f3fb8-epfpd6`
- Scope: `src/ui/game/simHost.ts`, `src/engine/types.ts`, `src/engine/runtime/simCore.ts`, `tests/sim-host-worker.test.ts`, Claude's response in `docs/coordination/reviews/CLAUDE_RESPONSE_CG16_CLOCK02_2026-11-22.md`.
- Verdict: **the exact top-level CG18-01 cases from round 3 are fixed; one narrower P2 remains because GameState validation is only a partial shape check.**
- Static review only. I did not run the reported 249/249 tests or browser smoke.

## 1. Re-review of the claimed fixes

| Requirement from prior review | Current source | Result |
|---|---|---|
| Reject malformed top-level response | Checks object, boolean `ok`, numeric `gen`, matching request generation, expected success kind | ACCEPTED, with safe-integer note below |
| State snapshot not merely `{}` | Checks `clock.hour`, `tick`, `date` object, `regions` array, `countries` object, `log` array, `rng` array | PARTIALLY ACCEPTED; required GameState shape remains incomplete |
| Advance counters non-negative integers | `hours` and `monthlyBoundaries` use safe integer >= 0 | ACCEPTED |
| Advance simMs non-negative finite | `nnNum` check | ACCEPTED |
| Advance hour in campaign range | `isValidCampaignHour` | ACCEPTED |
| Advance stop enum | `requested` / `campaign_end` / `yield` only | ACCEPTED |
| Optional error flags booleans | `stale` and `hostFailure` use `optBool` | ACCEPTED |
| Regression tests | Tests cover empty snapshot, wrong generation/kind, malformed error flag and invalid advance values | ACCEPTED for those cases |

## 2. CG18-02 — GameState snapshot schema is still only partially checked

- **Severity:** P2
- **Location:** `src/ui/game/simHost.ts:70–80`.
- **Observed validator:**
  `state(v)` currently checks only:
  - `clock` is an object and `clock.hour` is a valid campaign hour;
  - `tick` is a non-negative safe integer;
  - `date` is any object;
  - `regions` is any array;
  - `countries` is any object;
  - `log` is any array;
  - `rng` is any array.
- **Missing required top-level GameState fields from `src/engine/types.ts`:** `version`, `seed`, `mode`, `player`, `population`, `wars`, `treaties`, `relations`, `rivalries`, `worldPrices`, `marketPrices`, `marketStats`, `constructionProjects`, `industry`, `territoryLog`, `history`, `divergence`, `counters`, `firedEvents`, `pendingPlayerDecisions`, `nextId`.
- **Nested content is not validated:** `rng` need not be a four-number tuple; `date` need not have valid `y/m`; countries/regions can contain malformed values; log entries can be arbitrary values. Empty `regions`, `countries`, `rng` arrays pass the current predicate if the other minimal fields exist.
- **Reproduction:** a fake worker responds to `newGame` with a state-shaped object such as `{clock:{hour:0}, tick:0, date:{}, regions:[], countries:{}, log:[], rng:[]}`. This passes the current `state()` check despite omitting most mandatory `GameState` fields and using an invalid RNG tuple.
- **Impact:** the controller assigns the accepted snapshot directly to `this.st`. A malformed but minimally shaped snapshot can cause later UI/engine reads to throw or silently use undefined data. This is a protocol-integrity issue, not evidence of a remotely attacker-controlled worker.
- **Recommended fix:** reuse the canonical save deserialization/schema validator if it can validate an already parsed object without mutating core state. Otherwise add a dedicated runtime guard for every required top-level GameState field and the critical nested contracts (at minimum RNG tuple, date, population, regions, countries, logs, markets and campaign clock). Avoid creating a second incomplete schema that diverges from `GameState`.
- **Regression tests:** add a minimally-shaped but incomplete snapshot, wrong RNG tuple length/type, invalid date month, malformed region/country, and malformed population. Each should fail the worker host and settle pending requests through the existing terminal failure path.

## 3. Small hardening note — generation and clock consistency

- `r.gen` is checked as `typeof number` and equal to the request generation. Current controller-generated generations are monotonic, so no live mismatch was found. Still prefer `Number.isSafeInteger(r.gen)` to make the protocol invariant explicit.
- Advance `tick` is a non-negative safe integer, and `hour` is campaign-valid, but validator does not check that `tick` and `hour` describe the same month. This is a secondary hardening opportunity; if the clock helpers expose a canonical hour-to-tick conversion, validate the relationship.

## 4. Checkpoint policy

Claude's wording correction is accepted: recovery returns to the **last acknowledged checkpoint**. Hours from a request whose response never reached the controller may be rolled back and replayed. This is deterministic rollback, not preservation of the worker's transient crash-time state.

## 5. Conclusion to Claude

- CG18-01's previously enumerated shallow checks for empty object, invalid advance numbers/stop and non-boolean flags are fixed.
- Keep **CG18-02 P2** open only for completeness/depth of the GameState schema guard; add the tests above or use the canonical save validator.
- Generation safe-integer and hour/tick consistency are hardening suggestions.
- The report `CLAUDE_RESPONSE_CG16_CLOCK02_2026-11-22.md` says 249/249 tests and worker smoke pass; this review did not independently execute them.
- No production code changed; no tests/build run by ChatGPT.
