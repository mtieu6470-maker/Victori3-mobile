# DEV-004 — Economy, wages, factory inputs and construction lifecycle: Claude review

**Review target branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Exact review HEAD:** `ebeff72b20df155c376000f67fd4b9022fc3e327`  
**Comparison base:** `526b745d980ae5a4094b6dcbdabf41152f910afa` (last green build before the economy/construction feature tranche)  
**Review type:** independent code review first; one bounded corrective pass only after findings are reported  
**Status:** REQUESTED — no Claude verdict is claimed; no owner approval is implied

## 1. Purpose and boundaries

Review the economic simulation and construction changes introduced after the comparison base, including state/private construction queues, treasury and earmarked-fund accounting, factory input constraints, wage formation, and population response to wages. Also verify the recent Sandbox cumulative-politics test correction.

This is a bounded gameplay-engine review. It does **not** authorize reopening S0/S1/S22 gates, importing historical datasets, changing historical source records, changing save schema, merging the branch, changing signing keys, or releasing a production APK.

## 2. Exact changed code and evidence

Feature commits in the reviewed range include:

- `84d8873eda82e0e3ba1fdded01b6bf930bd435cd` — construction queues, factory inputs, employment and wage model.
- `dff9e13d573513de82b9f88582955ed58052d6ab` — construction funding protection and progress exposure.
- `96578ca30bd38d5a98e45cb379a8a6b03ec834ad` — cumulative Sandbox politics assertions and retained-log diagnostic naming.
- `c92e9b77aeda7fa70b18d18898bb50d16d7a2141` — staged factory production using realized upstream output and full requested input demand.
- `19df2682c749bfb58fdee2e8ec275873fc4dece7` — CoW national population benchmark scope check using a capital-culture homeland proxy.
- `ebeff72b20df155c376000f67fd4b9022fc3e327` — unfilled factory-input demand and 100% shortage regression assertions.

Primary files:

- `src/engine/systems/economy.ts`
- `src/engine/systems/population.ts`
- `src/engine/ai/ai.ts`
- `src/engine/types.ts`
- `src/ui/screens/Economy.tsx`
- `src/ui/screens/Society.tsx`
- `tests/construction.test.ts`
- `tests/modes.test.ts`

Latest exact-SHA evidence:

- Tests-only workflow [44466993734](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44466993734): PASS, 7/7 test files, 87/87 tests, 0 failed, 0 pending.
- Android debug workflow [44466993805](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44466993805): SUCCESS on the same SHA; `npm ci`, web build/typecheck, generated data/map, tests, Capacitor sync and Gradle `assembleDebug` all completed.
- APK: 18,048,145 bytes; SHA-256 `ea4c1647e385328922d3dc2917d0166c1d4de469e80a54f2c09bac8e6b6c3136`.
- APK is debug-signed only (v1/v2 verified); certificate SHA-256 `b41ee8c3b353c7b219fa569081a0b3c000c2ec4ed2646b0361362e7551a42aa1`. No device QA is claimed.

## 3. Required review questions

### A. Construction lifecycle and fiscal invariants

1. Verify `treasury` is gross cash and `statePool` is only an earmarked subset; no transition can create spendable cash or spend the same funds twice.
2. Challenge all transitions in `financeMonth`: income, operating expense, deficit-to-debt, reconciliation of reserved funds, debt service, and new construction earmarking.
3. Verify `constructionMonth` cannot spend more than the remaining project cost, state reserve or treasury cash; private funds must not be charged to the state treasury.
4. Check queue limits, FIFO ordering, duplicate-site prevention, railway level caps, invalidated sites, cancellation semantics and stale/legacy project safety.
5. Check whether UI finance figures distinguish monthly appropriation/reservation from cash actually invested that month.

### B. Factory production, intermediate goods and market clearing

1. Verify each recipe consumes only its own declared inputs and production is scaled against the availability of those inputs.
2. Examine the current staged dependency order: primary factories (textiles, steel and luxury) share one market-clearing snapshot; tools are resolved after realized steel; arms are resolved after realized tools. Challenge whether this ordering and proportional shortage scaling are economically defensible and deterministic.
3. Verify the distinction between **full requested intermediate-input demand** (reserved for market shortage/statistics) and **actual consumed inputs** (used for value-added/GDP costs). Unfilled demand must remain visible; GDP must not charge inputs for output that did not occur.
4. Challenge chains such as ironworks → tools → arms works under zero, partial and full inputs. Can downstream factories ever consume theoretical upstream output? Can multiple primary factories sharing coal over-consume a common input or receive an arbitrary priority?
5. Reconcile imports, local supply, realized factory output, requested demand, actual consumption, market shortages, prices and GDP. Check that intermediate inputs are not double-counted as final value added.
6. Verify price smoothing and openness behavior for markets with no supply, no demand, no coastal access, customs unions, and highly imbalanced world supply.

### C. Employment and wage model

1. Check that employment by stratum is non-negative, finite, and does not exceed plausible available labor after agriculture, plantations, mines, logging and factories.
2. Verify the wage bill is bounded by value added and wage premiums do not create/erase income.
3. Challenge the use of last month's wages in current demand and population stratum migration; review initialization, zero-worker regions and missing/legacy wage fields.
4. Check whether the GDP/disposable-income blend double counts income or creates discontinuities when wages initialize or employment changes.
5. Verify calibration does not retain stale wage/employment state or alter the intended 1836 baseline unexpectedly.

### D. Sandbox political diagnostics

1. `GameState.log` is a rolling log with `LOG_CAP = 4000`; cumulative campaign assertions must not depend on retained log entries.
2. Confirm `aiActions.reform` increments only on successful `startReform` and `ai.lawHistory` is the authoritative cumulative law-change record.
3. Confirm the updated assertions still detect a genuinely stagnant simulation rather than merely suppressing the former failure.

### E. Historical population benchmark scope

1. CoW NMC v7 `population.total` for GBR uses ccode 200 (United Kingdom). The simulation models many overseas colonies as GBR-owned regions, so total owned-territory population is not directly comparable to the UK sovereign benchmark.
2. The current test uses the capital-culture population as a transparent homeland proxy and reports total owned-territory population separately. This is deliberately a benchmark-scope proxy, not a validated geographic crosswalk.
3. Challenge whether the proxy excludes constituent homeland populations with other cultures (e.g. Scotland/Ireland) or otherwise misclassifies regions. Recommend an explicit source-backed region-to-benchmark geographic crosswalk before treating the metric as calibration-grade. Do not change the factor-of-two threshold merely to make CI pass.

## 4. Test gaps to assess

The construction suite has focused lifecycle tests for project completion, reserve reconciliation/no overspend, and cancellation. `tests/factory-market-clearing.test.ts` now includes deterministic no-input and fully supplied steel→tools→arms cases. Green CI does not prove the economic model is calibrated or internally consistent; verify the exact review HEAD and its test/build evidence.

Please recommend focused deterministic tests for:
- intermediate-good shortage propagation through ironworks, tool works and arms works under no-input and full-input cases (new regression suite: `tests/factory-market-clearing.test.ts`);
- partial input shortages with multiple primary factories sharing coal, to verify no common-input over-allocation;
- requested-vs-actual input accounting, import allocation and market statistics reconciliation;
- wage bill, wages/employment invariants and zero-employment/legacy states;
- treasury/statePool/debt invariants across surplus, deficit and debt-service months;
- private vs state construction funding separation and queue FIFO behavior.

Do not weaken existing assertions or use broad snapshots as a substitute for invariant tests.

## 5. Review output required

Return a structured review against the exact HEAD above:

- Verdict: `REVIEW_PASS` or `CHANGES_REQUESTED`.
- Findings ordered by severity (P0/P1/P2/P3), each with exact file/line, concrete failure scenario, gameplay/economic impact, and a targeted correction.
- Explicitly state which review questions were verified and which could not be verified.
- If there are no material findings, say so and make no code changes.
- If corrections are necessary, keep them within this DEV-004 scope, add regression tests first, and identify the corrective commit. Do not describe your own corrective changes as an independent review of those same changes; a fresh verification on the resulting exact HEAD is required.

## 6. Non-claims

This request is not evidence of Claude review completion, owner acceptance, S0/S1/S22 sign-off, production signing, Android device compatibility, balance quality, or full Victoria 3 feature parity. The capital-culture benchmark proxy is not an approved geographic crosswalk. The APK above is a debug artifact built by CI only; it has not been installed or tested on a physical device.
