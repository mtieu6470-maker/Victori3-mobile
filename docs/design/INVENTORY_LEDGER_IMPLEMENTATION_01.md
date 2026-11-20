# ECONOMY-INVENTORY-LEDGER-01 — Market inventory accounting

**Project:** Victori3 Mobile / Currents of History  
**Branch:** `experiment/vic3-visual-upgrade`  
**Owner authorization:** `docs/coordination/OWNER_IMPLEMENTATION_AUTHORIZATION_2026-11-20.md`  
**Implementation status:** `PARTIAL — MARKET LEDGER + REALIZED RECIPE FACTORY FLOWS; CI PENDING`

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
5. A full factory-level inventory book or iterative market equilibrium. Recipe-based factories now scale realized output and actual input consumption by the same scarcest-input fulfillment factor before final settlement. The factor is taken from a deterministic preliminary market-availability probe and applied once; it is not yet iterated to convergence. Non-factory agriculture/artisan flows remain aggregate production estimates, not firm warehouse postings.
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

- Unit tests: material conservation, demand reconciliation, non-negative stock, invalid-flow rejection, duplicate-period rejection, bounded history and same-factor factory input/output realization under shortages.
- Integration tests: real simulation tick creates one journal period; market statistics project to the same monthly ledger quantities; all markets conserve stock; global imports equal global exports; save/load continuation is deterministic; pre-ledger saves migrate as `unseeded`.
- CI/build: Android APK workflow runs on the final implementation commit. Record the exact run, test counts, Gradle result, APK artifact and SHA only after GitHub Actions evidence is inspected.
- Device QA: not performed by this slice. No physical-device or performance result is claimed.

## 7. Next implementation steps

1. Verify the current implementation on GitHub Actions and correct all failures before widening the simulation.
2. Replace the single preliminary factory-availability probe with a bounded, deterministic market/production fixed-point or staged-clearing design; prove convergence/termination and preserve per-good mass conservation.
3. Add goods metadata for canonical units, storable/flow-only policy, perishability and transportability with provenance.
4. Add regional warehouses and bounded route-capacity settlement, then integrate ports, rail, convoy, tariffs and treaty rules.
5. Add player/AI stockpile policies, inventory UI, trade contracts and cross-system scenario tests.
6. Add sourced historical initial stock estimates only where a defensible dataset supports the exact geography/date/unit; leave unknown fields explicitly unknown.



## 8. Follow-up checkpoint — realized recipe factory flows

The second implementation slice corrects the earlier planned-versus-realized recipe accounting gap:

- A deterministic preliminary market clearing estimates input availability.
- Every recipe factory calculates one fulfillment factor from its scarcest required input.
- The same factor scales its physical output and every recipe/additional input; market annualized supply and demand are adjusted by the difference between planned and realized flows.
- Markets are then settled again. The posted monthly ledger and legacy annualized `marketStats` use the realized recipe-factory flows.
- GDP value-added and firm operating-margin calculations use the same per-building realized factor and input/output amounts, avoiding a second, inconsistent fulfillment calculation.
- Services remain non-material flows; artisanal and agricultural production are still aggregate flows rather than stock-owning firms.
- The preliminary probe is a single deterministic pass, not a solved multi-market fixed point. A bounded convergence/staged-clearing design remains the next accounting-engine task.

Two additional unit tests verify same-factor scaling and the no-shortage case. The integration test now checks annualized market statistics against monthly inventory journal projections using scale-aware floating-point tolerances.
