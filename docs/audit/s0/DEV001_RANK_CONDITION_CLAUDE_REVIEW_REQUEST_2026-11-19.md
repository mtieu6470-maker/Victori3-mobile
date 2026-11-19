# DEV-001 — Claude code review and one bounded correction pass

**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Task:** DEV-001 / S22-SA-01 canonical `rank_at_most` condition  
**Base HEAD:** `8608f9fc1db4ccabeeba0ba8c0cd046cacd69f70`  
**Review target:** fetch the exact current branch HEAD after this request is committed; do not review a stale chat SHA.  
**Requested role:** review the ChatGPT implementation and, if needed, make one tightly scoped corrective pass.  
**APK/device:** no APK install, no device action, no signing/keystore/secret access.

## 1. Scope

Review only the DEV-001 change set:
- `src/engine/metrics.ts`
- `src/engine/historical.ts`
- `src/engine/systems/events.ts`
- `tests/modes.test.ts`

The implementation is intended to:
- use the same `powerScore()` and candidate actor set as `rankings()` (alive, non-decentralized, subjects included);
- apply competition ranks, with equal scores sharing rank;
- use stable entity-ID ascending order as the deterministic tie-break for ordered rankings;
- require `{ type: "rank_at_most", entity: "<stable-id>", rank: <positive safe integer> }`;
- fail closed for malformed thresholds, missing/dead/decentralized targets, unavailable/stale snapshots and non-finite candidate scores;
- create one immutable power-rank snapshot per GameState tick and reuse it inside nested `all`/`any` and decision-window evaluation;
- preserve the existing Historical/Sandbox separation (Sandbox has no historical priorities or decision windows).

## 2. Required review checks

1. Compare the exact base and current HEAD; confirm no unrelated code or product data changes.
2. Independently compare the rank candidate set/metric to `src/engine/metrics.ts::rankings` and `src/engine/systems/diplomacy.ts::powerScore`.
3. Challenge competition-rank semantics, ties, stable ordering, subject inclusion, dead/decentralized exclusion and malformed state handling.
4. Inspect context caching for stale-tick use, mutation within a month, WeakMap lifetime, recursion and diagnostic growth.
5. Check import graph/circular dependencies among metrics, diplomacy, historical, events and AI.
6. Check tests for positive, negative, exact-tie, non-finite, nested-composite and stale-context cases. Add any missing regression test found in review.
7. Run at least `npm ci`, `npm run typecheck`, and `npm run test:fast`; report exact exit codes and logs. If the environment cannot run them, state the exact blocker rather than inferring success.
8. Confirm the implementation does not alter event outcomes in Sandbox or make the historical prior stronger.

## 3. One bounded corrective pass

If there are material issues:
- Make one corrective commit limited to the DEV-001 files above and directly necessary DEV-001 test fixtures.
- Do not expand into decision effects, save schema, RNG migration, structural rules, exogenous event redesign, benchmark ETL, UI, Android, signing or unrelated refactors.
- Record exact before/after HEADs, changed files, reasons and tests/exit codes.
- Do not build/install an APK or change workflows/secrets.

If no material issue is found, return a concise review note with exact HEAD and evidence. If a correction is made, classify the result as **Claude review + corrective pass**; do not label Claude's own corrected code as an independent REVIEW_PASS. ChatGPT will re-fetch the resulting HEAD and run the required verification again.

## 4. Required response

- exact branch and reviewed HEAD;
- findings by severity with file/line and impact;
- exact correction commit if made (or explicit no-write statement if no correction was needed);
- test commands, exit codes and relevant output;
- remaining risk or out-of-scope findings.

This request does not authorize merge, device installation, signing, secret access or any wider S22 implementation slice.
