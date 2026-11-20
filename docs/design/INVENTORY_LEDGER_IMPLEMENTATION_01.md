# ECONOMY-INVENTORY-LEDGER-01 — Market inventory accounting

**Project:** Victori3 Mobile / Currents of History  
**Branch:** `experiment/vic3-visual-upgrade`  
**Owner authorization:** `docs/coordination/OWNER_IMPLEMENTATION_AUTHORIZATION_2026-11-20.md`  
**Implementation status:** `PARTIAL — MARKET LEDGER + BOUNDED ITERATIVE FACTORY CLEARING; CI PENDING`

## 1. Purpose

Add a persistent, deterministic physical-goods stock ledger to the shared Historical/Sandbox economy. The objective is to make market supply, trade, consumption, unmet demand and closing stock inspectable and auditable rather than keeping only ephemeral supply/demand ratios.

This is a first vertical slice, not a claim that the complete Victoria 3 economy is finished.

## 2. State and accounting contract

- `GameState.inventoryLedger.balances[marketId][good]` holds the current monthly-unit stock balance.
- `inventoryLedger.history` retains the latest 12 monthly market/good accounting records. Older detail is discarded only after its closing balance has already been carried forward.
- Every posted row records opening stock, production, imports, exports, demand, consumption, unmet demand and closing stock.
- Physical conservation is enforced per market/good:
  `opening + production + imports = exports + consumed + closing`.
- Demand is reconciled separately:
  `demand = consumed + unmetDemand`.
- Exports cannot exceed available opening stock, production and imports. A deficit is recorded as unmet demand; stock is never allowed to become negative.
- World imports and exports are paired across markets. The current aggregate market allocator distributes the same total physical quantity to importers and exporters; it cannot create a net volume of traded goods.
- Existing `marketStats` remain in the legacy annualized engine units for UI compatibility. Inventory ledger quantities are monthly units; the economy boundary converts existing annualized flows by dividing by 12.
- The service-value flow remains outside the physical `GOODS` registry and is not stocked or shipped by this ledger.

## 3. Save compatibility and historical provenance

- The save envelope/version is unchanged. `inventoryLedger` is an additive GameState field.
- New games and pre-ledger saves initialize with empty balances/history and `openingBasis: unseeded`.
- This explicitly means that source-backed 1836 warehouse/market stock data has not yet been supplied. The empty runtime balance is a simulation initialization, **not a claim that historical inventories were measured as zero**.
- After the first actual simulated month is posted, the ledger basis becomes `simulated`.
- The initial 1836 calibration pass at tick 0 is not journaled as a played month. The first record is created after the calendar advances.
- No historic stocks, capacity values, spoilage rates, physical weights or transport distances are fabricated.

## 4. Deliberate limits of this slice

This implementation is **market-level stock accounting**, not yet a warehouse/factory/region logistics network. It does not yet provide:

1. Source-backed 1836 opening stocks or country/region warehouse capacity.
2. Spoilage, storage loss, quality decay, stockpile policy or seasonal storage constraints.
3. Physical trade routes, route capacity, tariffs by shipment, convoy losses, port/rail/road bottlenecks or customs inspection.
4. Individual firm/warehouse sub-ledgers, ownership of stocks, purchase contracts, credit/settlement timing or inventory financing.
5. A full firm-level inventory book or guaranteed converged general-equilibrium solution. Recipe-based factories now participate in a deterministic damped market/factory fixed-point solver (maximum 32 iterations, tolerance 1e-5, relaxation 0.5). If the bounded solver does not converge, it retains the last bounded iterate and persists a diagnostic residual; mass accounting still uses the resulting final flows, but the market must not be described as converged. Non-factory agriculture/artisan flows remain aggregate production estimates, not firm warehouse postings.
6. A dedicated player-facing inventory/warehouse screen. The domain data is persisted first; UI presentation follows the real stock and logistics contracts.

The above are explicit next work, not hidden claims of completion. In particular, adding arbitrary per-good capacities or spoilage percentages without sourced physical data would make the model look more detailed while making it less accurate.

## 5. Determinism and performance

- All market and good iteration for journal commits is sorted/stable.
- Periods must be strictly newer than the previous period; duplicate posting at the same simulation tick throws rather than double-counting.
- Settlement functions are pure and reject NaN, infinity, negative quantities and impossible exports.
- Journal history is bounded to 12 months; current stock balances persist independently of the history window.
- The bounded ledger avoids an unbounded per-transaction object log while retaining a rolling year of market accounting detail.
- No frame/render callback is added to the economy system. Simulation cadence remains a separate unresolved P0 task.

## 6. Validation plan

- Unit tests: material conservation, demand reconciliation, non-negative stock, invalid-flow rejection, duplicate-period rejection, bounded history, same-factor factory input/output realization, deterministic solver convergence, iteration-cap behavior and stockpile exports between markets.
- Integration tests: real simulation tick creates one journal period; market statistics project to the same monthly ledger quantities; all markets conserve stock; global imports equal global exports; solver diagnostics persist; save/load continuation is deterministic; pre-ledger/pre-diagnostics saves migrate safely.
- CI/build: Android APK workflow runs on the final implementation commit. Record the exact run, test counts, Gradle result, APK artifact and SHA only after GitHub Actions evidence is inspected.
- Device QA: not performed by this slice. No physical-device or performance result is claimed.

## 7. Next implementation steps

1. Verify the bounded clearing implementation on GitHub Actions and correct all failures; benchmark convergence and monthly simulation cost on target Android hardware.
2. Define a conservative fallback/pause policy for rare non-converged markets and add adversarial multi-market trade-allocation/input-shortage tests built from canonical RECIPES; label any math-only synthetic fixture explicitly and never present it as a playable production chain.
3. Add goods metadata for canonical units, storable/flow-only policy, perishability and transportability with provenance.
4. Add regional warehouses and bounded route-capacity settlement, then integrate ports, rail, convoy, tariffs and treaty rules.
5. Add firm-level ownership/inventory, player/AI stockpile policies, inventory UI, trade contracts and cross-system scenario tests.
6. Add sourced historical initial stock estimates only where a defensible dataset supports the exact geography/date/unit; leave unknown fields explicitly unknown.



## 8. Follow-up checkpoint — realized recipe factory flows

The second implementation slice corrects the earlier planned-versus-realized recipe accounting gap:

- A deterministic preliminary market clearing estimates input availability.
- Every recipe factory calculates one fulfillment factor from its scarcest required input.
- The same factor scales its physical output and every recipe/additional input; market annualized supply and demand are adjusted by the difference between planned and realized flows.
- Markets are then settled again. The posted monthly ledger and legacy annualized `marketStats` use the realized recipe-factory flows.
- GDP value-added and firm operating-margin calculations use the same per-building realized factor and input/output amounts, avoiding a second, inconsistent fulfillment calculation.
- Services remain non-material flows; artisanal and agricultural production are still aggregate flows rather than stock-owning firms.
- The preliminary probe is a single deterministic pass, not a solved multi-market fixed point. It now computes only shortage ratios and avoids allocating disposable journal/statistics objects. A bounded convergence/staged-clearing design remains the next accounting-engine task.

Two additional unit tests verify same-factor scaling and the no-shortage case. The integration test now checks annualized market statistics against monthly inventory journal projections using scale-aware floating-point tolerances.


## 9. Performance refinement — provisional market probe

- The factory-availability pass no longer calls the full inventory settlement function or allocates temporary per-market journal and statistics objects.
- It computes only the opening-stock-aware shortage ratio needed by recipe factories.
- The definitive settlement pass remains the only code path that creates monthly inventory journal rows, updates `marketStats` and posts market prices.
- This reduces redundant per-good object creation and settlement work on the Android runtime. It is a source-level optimization only; no device profile, allocation benchmark or frame-time measurement has been run.


## 10. Follow-up checkpoint — bounded iterative market/factory clearing

The single preliminary availability probe has been replaced by `solveFactoryMarketFulfillment`:

- The solver removes planned recipe-factory outputs/inputs from the aggregate market flows to form non-factory baseline supply/demand.
- It re-adds factory flows using per-factory fulfillment factors, computes each market's shortage after local stock and globally paired trade, then updates each factor from its scarcest input shortage.
- Damped deterministic iteration uses a relaxation factor of 0.5, a maximum of 32 iterations and convergence tolerance of 1e-5.
- The solver returns the final market supply/demand, shortage ratios, per-factory factors, iteration count, convergence flag and residual. It does not mutate inputs or game time.
- The final settlement then calculates world imports/exports and posts the single monthly ledger record. Existing market stockpiles may now be exported after the seller market's own demand has been covered; global trade volume remains paired.
- `GameState.marketClearing` records tick, recipe-factory count, iterations, maximum iteration budget, convergence and residual for diagnostics. It is optional so older saves remain loadable.
- Convergence uses the undamped fixed-point residual, rechecked against the final returned projection. If the bounded solver reaches its iteration cap or fails that final residual check, all recipe-factory fulfillment factors are set to zero for that monthly settlement (`appliedFallback: zero-recipe-production`). This fail-closed fallback prevents unsupported recipe inputs/outputs from entering GDP or inventory. The non-recipe/base economy still settles. The diagnostic preserves `converged=false` and the residual measured before fallback. This fallback can temporarily suspend recipe-factory production across all markets for one month; it is intentionally conservative and must be surfaced/benchmarked before release.

Five solver tests cover deterministic convergence, a two-market cyclic grain/tools dependency, stockpile export into a deficit market, iteration-cap/fail-closed behavior and invalid inputs. The integration test asserts that solver diagnostics are persisted and legacy migration leaves absent diagnostics absent.


## 11. Follow-up checkpoint — true residual and fail-closed fallback

- The solver now measures the undamped fixed-point residual `|targetFulfillment - currentFulfillment|`; the relaxation step is not used as the convergence metric.
- After iteration, it recalculates shortages from the returned market projection and rechecks the residual at that exact final factor vector. A residual at or above tolerance cannot be reported as converged.
- If the cap is reached without convergence, or the final projection fails the residual check, every recipe-factory factor is set to zero and final market supply/demand/shortages are recalculated from the non-recipe baseline. This avoids posting recipe output without corresponding supported material inputs.
- `FactoryMarketSolution.appliedFallback` and `GameState.marketClearing.appliedFallback` distinguish `none` from `zero-recipe-production`. The pre-fallback residual remains recorded for diagnosis.
- The fallback is global for the monthly clearing, so a pathological market can suspend recipe production in otherwise healthy markets for one monthly pass. This favors material integrity over pretending a non-converged solution is valid; a market-component-specific fallback is a future refinement.
- Added a cyclic two-market test: market A's grain factory needs tools supplied by market B, while market B's tools factory needs grain supplied by market A. Added assertions that the capped non-converged case returns zero recipe fulfillment and no recipe output, and that converged paths never activate the fallback.
- Source-level formula spot checks (not Vitest) reached the single-market fixture in 16 iterations with final residual 3.66e-6 and the symmetric two-market cycle in 24 iterations with residual 5.78e-6. Test execution and CI remain unverified.


## 12. Domain-valid market and factory test fixtures

The previous §11 two-market grain/tools example used two invented factory operations (grain output requiring tools, and tools output requiring grain) to force a symmetric fixed-point cycle. Those operations are **not** part of the game's RECIPES and are not valid production chains in this project. The test-only construction was misleading and is superseded by the current test.

The replacement test models reciprocal commodity trade without assigning a fabricated recipe:
- Market A supplies 100 grain and demands 130 tools.
- Market B supplies 100 tools and demands 130 grain.
- With full market openness and no opening stock, the trade allocator transfers at most the available 100 units of each good; each destination retains 30 units of unmet demand (shortage share 30 / 130).
- This is an aggregate market trade-allocation test. It does **not** claim that a shipment contract, route, tariff, customs process or physical transport network exists yet.

Factory-flow tests now derive their output/input quantities from the canonical engine recipes:
- ironworks: steel output with iron and coal inputs at the ratios defined in RECIPES.
- tool_works: tools output with steel and timber inputs at the ratios defined in RECIPES.
- The constrained single-market solver fixture also uses the canonical ironworks recipe, with the independent coal supply shortage retained as the convergence condition.

This supersedes only the unrealistic test fixture, not the game recipe registry or runtime production rules. No grain-to-tools production recipe was added to runtime data. At the later market-authority checkpoint below, the inventory test file contains 19 tests; the earlier count of 15 applies only to this fixture-correction checkpoint.


## 13. Single-source market trade allocation and inventory posting

The solver and definitive monthly stock-posting path previously contained separate implementations of the same world surplus/deficit, market import, export and shortage formulas. Inspection found that the formulas currently matched, but duplicated logic could drift as trade rules evolve.

The solver now returns, for its final converged/fallback projection:
- Per-market annualized import quantities.
- Per-market annualized export quantities.
- Openness-weighted world surplus/deficit totals by good.
- Per-market shortage ratios calculated from those exact imports/exports.

The definitive inventory posting, market price target and market statistics reuse this one returned allocation. `settleInventoryFlow` remains the physical monthly accounting boundary and receives the same import/export quantities converted from annualized engine units to monthly units. The trade test now checks 100 units imported/exported in each direction and reconciles the solver's shortage ratios against `settleInventoryFlow` for both buyers and sellers.

This is a consistency refactor of the existing aggregate market allocator, not a new trade-contract, tariff-by-shipment, route-capacity, customs, regional warehouse or firm-owned inventory system. Existing global import/export balance integration checks remain in place. The source has not yet been executed by Vitest, TypeScript or Android CI; results remain **NOT_TESTED / NOT_VERIFIED**.

## 14. Customs-union policy authority and stale-market fallback

The market-opening calculation previously selected `st.countries[marketId] ?? st.countries[members[0]]`. For a customs-union market, `marketId` is the treaty ID, so the fallback could apply the trade law/technology of whichever country happened to own the first region iterated rather than the treaty's declared leader.

An explicit `marketPolicyCountry` resolver now applies this precedence:
- A national market uses its own active country.
- A customs-union market uses the declared treaty leader when that leader is a recorded member and active.
- If that leader is no longer active, the first living treaty member is used deterministically.
- If a long-running/legacy state still carries a market projection but all recorded participants are inactive, the resolver preserves the last recorded leader/member Country object as a compatibility fallback rather than crashing the entire monthly simulation. It does not substitute an unrelated country.

The 3 new policy-authority tests cover treaty-leader precedence, national-market identity despite member iteration order, and stale/inactive customs-union membership. A fourth test checks the last-recorded-policy fallback when every member is inactive. The market loop fails explicitly only when there is no resolvable Country record at all.

Validation trail:
- Android workflow run #416 on `5b121db0039c0f5b042c0f8bb5e98a9393a43908` exposed TS7053 in a test using `Object.entries()` to index `marketStats`; corrected by iterating the canonical `GOODS` tuple (`ef620fc415a1a4de0f93a3658a583763260bbf2b`).
- Run #418 on `5174d5cadb14d1b5930717833c5ff30c5f19b2ae` exposed that the first resolver version rejected a market with no active policy-country candidate (Market TEX). The resolver was amended to preserve a recorded policy object when all current participants are inactive (`584ed577ded5de157a618ccd73103f86d642c3b6`).
- The current inventory test source contains 19 tests. Exact current-HEAD Vitest/Android workflow evidence is tracked in AI_HANDOFF; no result is inferred from source presence.

These changes only correct which existing country governs market openness and how old/inactive market state is handled. They do not yet create a full route graph, port/rail capacity, trade contracts, shipping losses or per-state market access.