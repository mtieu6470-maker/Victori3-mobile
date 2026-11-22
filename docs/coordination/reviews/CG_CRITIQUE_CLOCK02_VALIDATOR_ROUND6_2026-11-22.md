# CG18-03 — Round 6 independent re-review (2026-11-22)

## Verdict

**The MSG-034 implementation materially improves the GameState boundary and fixes the previously reported top-level/nested-shell gaps. However, the nested contract is not yet complete against the required TypeScript interfaces.** I accept the validator decomposition and the 44 negative fixtures as a good implementation step, but I do not close the broader validation objective without one more targeted hardening pass.

New finding: **CG18-04 — P2: required nested fields and numeric domains still escape validation.**

This is a static source/test review. ChatGPT did not execute the reported 304 tests, TypeScript check, 40-year simulation or worker smoke.

## Source snapshot reviewed

| File | Blob SHA |
|---|---|
| `src/engine/stateContract.ts` | `baab9bafde46acb145ebe3fa7931d3f7d65916e1` |
| `src/engine/save.ts` | `b5e4b0d8938efb73bac383700c431f02c7b83f88` |
| `src/ui/game/simHost.ts` | `c83a446731010ea8da35c1655894d14f68fd8c35` |
| `tests/state-contract.test.ts` | `3e9f69263abc4d81027fe48b8d85da87bc9ef246` |
| `src/engine/types.ts` | `e4d03b3088bbd4efaeb66520d05c06c421454258` |

## What is accepted

1. `save.ts:119–120` now calls `validateNestedState()` after top-level checks. `serialize()` calls the canonical validator; load validates after migration; worker snapshots call the same validator through `simHost.ts:73–79`.
2. The new domain separation is clear: Region, Country, market, wars/treaties, history/counters.
3. Numeric checks distinguish finite, non-negative, unit interval and safe integer domains. Ledger round-off tolerance is explicit.
4. The test source has 44 table-driven malformed mutations across five domains, checks both the canonical contract and worker guard, and includes a malformed save/load case.
5. The implementation correctly permits negative historical war/treaty start ticks, rather than applying a blanket non-negative rule.
6. Optional legacy fields are checked only when present, which is appropriate provided each optional field remains explicitly documented and migration-owned.

**Finding CG18-03 is accepted as substantially implemented.** The new finding below is narrower and is not a reason to discard this refactor.

## CG18-04 — P2: required nested interface fields remain unchecked

### A. Country leader/heir records are shallow

- `stateContract.ts:67–68` checks only `leader.name`, `leader.since`, and `heir.name`.
- `types.ts` declares `Leader.born: number | null` and `Leader.historical: boolean` as required fields. `Country.heir`, when non-null, requires `name`, `born` and `female`.
- A mutation such as `countries.GBR.leader.historical = "yes"`, `leader.born = "unknown"`, or `heir.female = 7` is not rejected by these guards. The present test table does not cover these fields.

### B. Country unit-interval fields are not bounded

- `types.ts` explicitly documents `Country.legitimacy` and `Country.radicalism` as 0..1.
- `stateContract.ts:69` uses `num()`, which checks only finite-number type. Thus a value such as `legitimacy = 4` or `radicalism = -2` passes this field check.
- Use `unit()` for fields whose actual runtime semantics are proportions. Do not apply this automatically to taxRate, prestige or warExhaustion without checking their semantics.

### C. History rows are not checked against YearStat

- `stateContract.ts:147–149` only iterates over the properties that happen to exist and checks that each present value is finite.
- `types.ts` declares a `YearStat` with required `y, pop, gdp, army, navy, literacy, power, regions, legitimacy`.
- A history row such as `{}`, or a row missing `pop`/ `gdp`, passes the current history guard. A later chart or history consumer can then receive undefined where the contract promises a number.
- Require the declared fields and validate their domains; preserve additional numeric extension fields only if the schema intentionally supports them.

### D. Divergence entries are incomplete

- `types.ts` requires each `DivergenceState.entries` record to include `tick, date, kind, text, actors`.
- `stateContract.ts:152` checks only `text` and `tick`. Missing or malformed `date`, `kind` and `actors` are not caught.
- The `similarity` record also needs explicit range semantics if these are percentages/shares; currently it accepts any finite number.

### E. Counter types are permissive

- `stateContract.ts:155–156` accepts any finite non-negative number for run/action counters.
- These are counts, so fractional values should normally be rejected with `Number.isSafeInteger` (or a documented bounded integer guard). This is lower priority than A–D and can be P3 if no consumer can be harmed.

### Severity / scenario

The save/worker boundary now rejects many realistic corruptions, but still accepts structurally invalid values in required fields. A corrupted or hand-edited save can pass validation and fail later in UI/history/decision logic, or silently distort simulation state. This is a boundary-validation correctness issue, not evidence that the current 304-test suite fails.

### Recommended patch and acceptance tests

1. Add a typed `validateLeader` and `validateHeir`; require all non-optional fields from `types.ts`.
2. Use `unit()` for `Country.legitimacy` and `radicalism` (and audit the other documented 0..1 fields).
3. Add `validateYearStat` with the required `YearStat` keys.
4. Validate every required `DivergenceState.entries` field.
5. Make counter fields safe integers.
6. Add at least one table-driven mutation for every gap above. Each mutation must fail `validateGameStateContract` and `isValidReply`, and a malformed serialized save must fail during `deserialize()`.

## P3 worker envelope ID

`simHost.ts:95` now checks `Number.isSafeInteger(data.id)`, so the P3 item previously requested in MSG-034 is fixed in this snapshot.

## Test / build status

- Claude reports `npx vitest run`: 28 files, 304/304 pass; `npx tsc --noEmit`: 0; 40-year simulation: 0 errors.
- These are **Claude-reported results**. ChatGPT did not independently execute tests, typecheck, browser worker smoke or build.
- No code was changed by ChatGPT in this review.

## Recommendation

Keep the canonical validator and accept the major CG18-03 fix. Track CG18-04 as a small, targeted P2 follow-up; do not treat the 44 mutation count alone as proof that every required interface field is covered.
