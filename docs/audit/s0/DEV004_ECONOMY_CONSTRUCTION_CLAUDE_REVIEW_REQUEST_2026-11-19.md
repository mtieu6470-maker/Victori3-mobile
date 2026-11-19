# DEV-004 — Economy, wages, factory inputs and construction lifecycle: Claude review

**Review target branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Exact code review target (latest implementation + tests; documentation update excluded):** `83e10bcd4af2b4b4be0b6019f98b3aa97f75b9ec`  
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
- `f0c3b08e066f198733559d0c76da3bca0f06d281` — initial partial shared-input shortage regression for primary textile and steel factories.
- `bdb5e2e5ebca73e8375bd2554e6e01a075232f11` — strengthened primary-stage regression using a matched unconstrained reference and proportional realized-output assertions.
- `4c9f15959fa4c4cea1b91ea2419c26997d872319` — proportionally allocate scarce regional factory labor instead of assigning it by recipe iteration order.
- `ec5c79cca7b87a90291a5c54ba3da7bcf599cd3d` and `76c6dd1fd7478fb33c869d271488bde98a9a07f5` — add and normalize the corresponding workforce-scarcity regression.
- `fe5a1ba4b4b7eb59cbdb83ee5264c5338d8c4ab8` — clarify the Economy overview label and note that the building chart displays maximum job capacity, not actual employment.
- `0cdf5a1fab43777ab9c8286d6fbc6f712615d5af` — resolve factory intermediate inputs one dependency stage at a time, preventing future-stage demand from starving upstream factories.
- `31ab361fb93f0eef01d90eb8626af42c4d965775` — test that later arms demand does not pre-empt steel for the tools stage, and isolate shared coal scarcity from iron scarcity.
- `cea1dcecf16a590d2c54ef93600041d5458f29ab` — tune the isolated coal scenario to guarantee partial (rather than zero or total) shortage.
- `10b4cedcf7a5d8efa4408b39542a683d89c3368e` — align AI building-return estimates with engine productivity, efficiency, infrastructure, occupation and resource-mix production formulas.
- `9cf92aab9bc43fa26d92dceb4e85fd41d655642c` — test staffing eligibility, resource-mix weighting and square-root factory productivity scaling.
- `385e0b9748361c66ac2c033db97bd13de725f725` — make prospective construction returns sensitive to market output saturation and input shortages.
- `be20d78c052ca6dcc114479b84ff4b9af16507ed` — add regression coverage for oversupplied output markets, input-constrained factories and marginal mining returns.
- `270b63380eebc2f4da47553842804dbbcf83d63f` — add fiscal-discipline tests before changing the AI construction budget formula.
- `83e10bcd4af2b4b4be0b6019f98b3aa97f75b9ec` — adapt state construction allocation to operating margin, debt burden, famine pressure and wartime spending.

Primary files:

- `src/engine/systems/economy.ts`
- `src/engine/systems/population.ts`
- `src/engine/ai/ai.ts`
- `src/engine/types.ts`
- `src/ui/screens/Economy.tsx`
- `src/ui/screens/Society.tsx`
- `tests/construction.test.ts`
- `tests/modes.test.ts`

Last verified CI evidence before the follow-on commits (not evidence for the current target):

- Tests-only workflow [44466993734](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44466993734): PASS, 7/7 test files, 87/87 tests, 0 failed, 0 pending, on the earlier review target `ebeff72b20df155c376000f67fd4b9022fc3e327`.
- Android debug workflow [44466993805](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44466993805): SUCCESS on that earlier SHA; `npm ci`, web build/typecheck, generated data/map, tests, Capacitor sync and Gradle `assembleDebug` all completed.
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


## 7. Follow-on work after the prior CI evidence

- **Initial follow-on HEAD:** `f0c3b08e066f198733559d0c76da3bca0f06d281`; added a partial shared-input case for primary textile and steel factories.
- **Strengthened input-shortage test:** `bdb5e2e5ebca73e8375bd2554e6e01a075232f11`; compares a constrained scenario with a matched unconstrained reference and verifies proportional realized-output ratios.
- The earlier 87/87 test result and 18,048,145-byte debug APK belong to `ebeff72b20df155c376000f67fd4b9022fc3e327`. They are **not** evidence that any subsequent regression passed or that a new APK was built.

## 8. Factory workforce allocation correction

- **Current exact review HEAD:** `cea1dcecf16a590d2c54ef93600041d5458f29ab`.
- Finding: factory workers were assigned by iterating `Object.keys(RECIPES)` and consuming the remaining worker pool sequentially. When a region had insufficient workers for all factory levels, earlier recipes (for example textiles) received labor before later recipes (for example steel), creating an undocumented order-based priority.
- Correction: compute total requested factory jobs and apply one common staffing ratio to every factory type in the region. This makes scarce labor allocation proportional to requested jobs, bounded by the available worker stratum. Input shortages are still applied afterward to derive realized employment.
- Regression: paired constrained/full-staffing worlds verify textile and steel output scale by the same factor when there are 4,500 workers for 8,000 requested jobs; input supply is deliberately abundant so the test isolates labor allocation.
- Limitation: proportional staffing is a neutral allocation rule, not a complete Victoria 3 labor market. Wage competition, profitability-based hiring/firing, qualifications and migration remain outside this correction.

## 9. Economy UI interpretation

- The Economy overview previously labeled building-level worker capacity as employment. That was misleading because the chart multiplied building levels by `LEVEL_WORKERS`, without reflecting worker scarcity or input-related idle capacity.
- The heading now identifies it as **maximum job capacity**, and the note explicitly distinguishes capacity from actual employed workers. This is a presentation correction; it does not claim to add per-building actual-employment accounting.

## 10. Staged factory input reservation correction

- **Finding (P1 gameplay/economy correctness):** the prior implementation added the *full requested input demand of every factory stage* to market demand before resolving any stage. Consequently, arms factories could reserve steel before the tools stage was cleared. Example: with 3.0m steel output, 1.36m steel requested by tool works and 2.24m requested by arms works, the tools stage incorrectly observed 3.6m total demand and was scaled down, even though arms should compete only after tools have been resolved.
- **Correction:** keep base demand and full requested factory demand in separate ledgers. Before each dependency stage, add only that stage's requested inputs to active market demand; compute one clearing snapshot shared by all factories in the stage; replace that stage's planned demand with actual consumed inputs before resolving the next stage. At month-end, restore base demand plus all full requested factory demand for market statistics and shortage reporting.
- **Regression coverage:** `tests/factory-market-clearing.test.ts` now compares a chain with and without downstream arms works. Tools output must remain unchanged at the earlier stage, while final steel shortage can still reflect the later arms request. The partial-coal test now supplies iron from a separate region so it isolates coal as the common scarce primary input.
- **Relevant source ranges:** `src/engine/systems/economy.ts:239-320`; tests at `tests/factory-market-clearing.test.ts:80-140`.
- **Implementation commits:** `0cdf5a1fab43777ab9c8286d6fbc6f712615d5af`, `31ab361fb93f0eef01d90eb8626af42c4d965775`, `cea1dcecf16a590d2c54ef93600041d5458f29ab`.

## 11. AI investment labor eligibility correction

- **Finding:** `buildingReturn` previously estimated available labor using peasants/artisans as potential factory employees and peasants as potential mine/logging/plantation workers. This disagreed with `computeEconomy`: factories recruit from the worker stratum; plantations recruit slaves then a limited laborer share; mines/logging use the remaining laborer pool after field/plantation employment.
- **Correction:** investment-return estimates now calculate a prospective staffing ratio from the eligible labor pool for each building type, account for existing capacity, and scale projected output and operating input costs by that ratio. A building with less than 50% prospective staffing is not recommended.
- **Regression file:** `tests/building-return-labor.test.ts`, covering zero eligible workers for factories, mines/logging and plantations, plus proportional factory-return scaling under a constrained worker stratum.
- **Commits:** `50921a9b046a4dc1afe0b3655b33d7fcef3a8437` (implementation), `663ea5537a8599140ef13773b2c2d9e3aada5647` (tests).
- **Review limitation:** this improves labor feasibility estimates, but profitability remains a simplified expected-return heuristic; it is not a full market-based Victoria 3 hiring/profitability loop.

## 12. AI building-return production consistency

- **Implementation:** `buildingReturn` now uses the same productivity exponents as physical production (primary extraction/plantation: productivity^0.6; factories: productivity^0.5), plus the engine's relevant infrastructure, devastation, occupation and technology-efficiency modifiers.
- Mine return estimates distribute output across every resource actually mined in the region (coal, iron, luxury from gold/silver), rather than assigning all output to the first resource. Plantation return estimates likewise distribute output across cotton, opium and cash crops.
- The eligible-labor staffing correction from the previous section remains in place and now feeds the revised physical output estimate.
- **Tests:** `tests/building-return-labor.test.ts:19-120` covers ineligible labor sources, partial factory staffing, multi-resource mine/plantation revenue weighting and square-root factory productivity scaling.
- **Commits:** `10b4cedcf7a5d8efa4408b39542a683d89c3368e` (implementation), `9cf92aab9bc43fa26d92dceb4e85fd41d655642c` (expanded tests).
- **Remaining limitation:** expected returns are still a simplified estimate. They do not fully solve market-clearing feedback, firm-level profit accounting, input availability by dependency stage, wage bids, qualifications or investment competition. Treat this as a feasibility heuristic, not a complete Victoria 3 investment market.

## 13. Demand-aware and input-constrained AI investment valuation

- **Finding:** AI investment scoring used current market prices but treated every projected output unit as fully saleable and every planned factory input as available. It could therefore continue prioritizing a good after the market had persistent surplus, or overestimate a factory whose cotton/coal/steel/tools inputs were not available at the current market-clearing rate.
- **Correction:** add a marginal sale factor from the previous market snapshot. Unmet demand keeps the factor at 1.0; oversupply discounts the next unit by demand divided by available supply plus imports, bounded to 0.35–1.0. If no market snapshot exists yet, preserve the prior estimate (factor 1.0).
- Factory estimates now limit realized output by the lowest availability among required inputs (`1 - short`). Revenue, input costs and the labor cost attributable to production are all scaled to the realizable share, avoiding both phantom output and charging input costs for output that cannot be made.
- Mines, plantations and logging apply the marginal sale factor to each good they produce. Mixed-resource regions continue to split projected output across their actual resource mix.
- **Regression tests added** to `tests/building-return-labor.test.ts`: oversupplied coal lowers marginal mine return; cotton/coal shortages lower textile mill return according to the limiting input; and persistent textile surplus lowers the return of another textile mill.
- **Commits:** `385e0b9748361c66ac2c033db97bd13de725f725` (implementation), `be20d78c052ca6dcc114479b84ff4b9af16507ed` (tests).
- **Limitations:** this is a one-month marginal estimate using the latest completed market snapshot, not a forward market simulation. It does not model endogenous multi-month price elasticity, firm-level inventories, wage bidding, or interactions among several simultaneous AI investment proposals. The 0.35 sale-factor floor is a conservative heuristic and requires calibration against campaign outcomes.

- State construction budget allocation now responds to the operating margin, debt burden (relative to 24 months of revenue), famine pressure and wartime needs, while remaining clamped to 2%–28% of income. This supplements the existing hard gate on positive state reserves and the annualized build-cost return ranking.
- **Budget tests:** `tests/ai-investment-budget.test.ts` verifies lower construction allocation under rising debt/famine stress, wartime restraint and the minimum/maximum bounds.
- **Budget commits:** `270b63380eebc2f4da47553842804dbbcf83d63f` (tests first), `83e10bcd4af2b4b4be0b6019f98b3aa97f75b9ec` (implementation).


## 14. Validation and handoff status

- **Current code review target:** `83e10bcd4af2b4b4be0b6019f98b3aa97f75b9ec` (the following report-only commit is excluded). **Validation status: PENDING.** The previous 87/87 result belongs only to the earlier `ebeff72b20df155c376000f67fd4b9022fc3e327` target and must not be carried forward. The new demand-aware investment and fiscal-budget tests have not yet been run in CI. No successful CI run or new APK is claimed.
- The GitHub integration used here can read commits, files, workflow job logs and rerun failed jobs, but does not expose a general Actions run-list/dispatch operation. A combined status check for the current target returned no status entries; this is not a passing result. Do not interpret missing run data as a test pass.
- A local clone/test attempt was also blocked because the execution environment could not resolve `github.com`; no local test pass is claimed. Claude/CI must run `npm ci`, then `npm run test` (or the repository's tests-only workflow) against the exact review target before further changes are accepted.
- Claude review remains requested, not completed. No S0/S1/S22 acceptance, device QA, production signing, or full Victoria 3 parity is claimed.
