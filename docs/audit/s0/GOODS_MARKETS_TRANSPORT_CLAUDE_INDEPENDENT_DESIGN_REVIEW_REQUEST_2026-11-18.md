# S7–S8 Goods, Markets and Transport — Claude Independent Design Review Request

**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Review date:** 2026-11-18  
**Review type:** no-write design review  
**Status:** `READY_FOR_INDEPENDENT_REVIEW`  
**Runtime authorization:** `NONE`

## 1. Exact target and baseline

- **Design document:** `docs/spec/GOODS_MARKETS_TRANSPORT_ARCHITECTURE_PROPOSAL_VI.md`
- **Design commit:** `0b231f637bb0659bd170c7e4a0d1d76d44248922`
- **Product/code baseline:** `e4924ca48264f8d0818eface51a28a87cd363b89`
- **Related POP design:** `docs/spec/POPULATION_COHORTS_DATA_MODEL_PROPOSAL_VI.md`, revision `b35c5367cfe41bea3036bec2b846d19060f495c0`
- **Normative roadmap:** `docs/roadmap/DECISIONS_AND_S0_REVISED_VI.v3.2.md`, as amended by owner-approved v3.3 decisions and current handoff.

Fetch the exact latest branch HEAD before review. Confirm the target document's content/blob and compare it against the design commit.

## 2. Independence and no-write scope

This must be an independent review by Claude, who did not author or modify the target document. No writes during review:

- Do not edit the target or related docs.
- Do not edit runtime, save schema, tests, shipped data, UI, assets, Android or workflows.
- Do not create a fix commit, branch or PR.
- Do not run a build or install an APK.
- Do not treat this request as authorization to start S7/S8 or S1.

If changes are required, report them with exact section/line locators and return `CHANGES_REQUESTED`.

## 3. Required review areas

### A. Current implementation characterization

Verify claims against the code baseline, especially:
- `src/engine/types.ts`: GOODS, MarketGoodStats and GameState market fields.
- `src/engine/systems/economy.ts`: `marketOf`, `openness`, `computeEconomy`, RECIPES, imports/prices, GDP and finance, `build` and `buildingReturn`.
- `src/engine/systems/population.ts`: demand, labour approximation and strata transition.
- `src/engine/save.ts`: version-1 save constraints.
- Roadmap S6–S13 and approved S0/S1 gate boundary.

Specifically verify the claim that current factory output is added to supply before the later GDP calculation scales output based on input shortages. Explain whether this causes MarketGoodStats and GDP to use different effective output quantities.

### B. S7 material accounting

Assess whether:
1. The balance equation covers all creation/destruction/transfer paths without double counting.
2. Inventory scope and pre-S8 market-pool abstraction are coherent.
3. Legacy v1 saves can transition without inventing undocumented initial stocks.
4. Monthly flow vs annualized production rates and stock vs flow units are unambiguous.
5. Goods units, mass/volume and currency/index separation are adequately specified.
6. The proposed staged input allocation prevents outputs being counted before inputs are actually consumed.
7. Multi-tier recipes, dependencies, cycles and deterministic convergence are sufficiently bounded.
8. Demand, rationing, inventories, imports/exports, spoilage and price formation can be audited from one ledger.
9. Customs-union join/leave does not duplicate or destroy inventories.
10. The legacy production adapter can be retired without double supply.

### C. S8 transport and market access

Assess:
- Temporal validity and historical source requirements for road, river, sea, rail, ports, stations and canals.
- Shared edge capacity and bottleneck handling across multiple shipments.
- Route selection, stable tie-breaks, path cache invalidation and deterministic settlement.
- In-transit goods, arrival windows, loss, rerouting and save/load behavior.
- Blockade, occupation, damage, season and disruption effects.
- Goods-specific market access versus one scalar.
- Feasibility for 662 Strategic Regions on mobile; identify algorithmic complexity hotspots and realistic benchmark requirements.

### D. System boundaries and roadmap consistency

Confirm the design does not violate:
- S6 cohort foundation before demand detail;
- S7 material accounting before S8 spatial logistics;
- S9 time-valid technology dependencies;
- S10/S11 production definition/site execution;
- S12 real hiring, firing, wages and labor competition;
- S13 ownership, profit and dividends;
- S1 data/save foundation and the separate S0-B7 review + owner acceptance gates.

Check for conflicts with the approved BuildingSite invariants, historical-mode fidelity and deterministic simulation contracts.

### E. Missing edge cases

At minimum consider:
- stock movement when a country joins/leaves a customs union;
- customs union dissolution during active shipments;
- occupying/losing a port or market hub;
- multiple output goods per producer and multiple limiting inputs;
- local spoilage and storage capacity;
- one good with different local units or grades;
- zero supply/zero demand and very large quantities;
- price runaway, price floors/ceilings and external market shortage;
- route tie and capacity saturation;
- save/load during shipment and after graph changes;
- migration of aggregate inventories to spatial hubs when S8 begins.

## 4. Required verdict

Return exactly one:

- `REVIEW_PASS` — coherent design proposal with no required design changes.
- `CHANGES_REQUESTED` — one or more material corrections required.
- `BLOCKED` — target, baseline or reviewer independence cannot be verified.

Include:
1. Exact branch HEAD and target commit/blob.
2. Verdict and rationale.
3. P0/P1/P2/P3 findings with section/line locators, evidence, consequence and required correction.
4. Non-blocking recommendations separately.
5. Confirmation that the review was no-write.

## 5. Gate boundary

This review only assesses the S7–S8 design document. It does not satisfy S0-B7 independent review, owner acceptance, or S1 entry; it does not authorize S1, S6, S7, S8, S9, S10–S13 or any runtime, data, save, test, UI, Android or APK change. All such work remains gated by the current owner-approved roadmap and handoff.
