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
2. Define a conservative fallback/pause policy for rare non-converged markets and add adversarial multi-market/cyclic-input tests.
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
- If the solver reaches its iteration cap without convergence, the last bounded iterate is used and the non-converged diagnostic remains visible in state; no convergence claim is made. A player-facing fallback/warning policy and device benchmark are still pending.

Four solver tests cover deterministic convergence, stockpile export into a deficit market, iteration-cap behavior and invalid inputs. The integration test asserts that solver diagnostics are persisted and legacy migration leaves absent diagnostics absent.
