# CG-01 — Markets, prices and trade (Victoria 3 1.15.x)

Research date: 2026-11-22. Baseline: Update 1.15 and hotfix 1.15.2. This is an independent synthesis, not extracted game code. Confidence is stated per claim.

## Executive finding: 1.9 changed the trade architecture

**Verified:** Update 1.9 removed the old Trade Routes system. A World Market sits above National Markets. Trade Centers autonomously trade with the World Market, exploiting price differences and Trade Advantage to make profit. Trade Centers are built using Construction Sectors and can be owned by Ownership Buildings through the Investment Pool. Therefore the old player-created import/export route model must not be treated as the current 1.15 simulation core.

Source: Dev Diary #151 / Update 1.9, 2025-06-17: https://steamdb.info/patchnotes/18882924/

## National Markets and price formation

**Verified at conceptual level:** National Markets aggregate buy and sell orders for goods; prices are driven by supply and demand. Goods availability and infrastructure/market access affect whether state-level production and consumption can participate in the market. Price changes feed back into building input costs, output revenue, profitability, wages, Pop purchasing power and SoL.

Sources:
- Dev Diary #9, National Markets, 2021-08-05: https://store.steampowered.com/news/posts/?enddate=1628180040&feed=steam_community_announcements
- Dev Diary #131, Famines, Starvation, Harvest Conditions, 2024-10-10: https://store.steampowered.com/news/posts/?enddate=1728568967&feed=steam_community_announcements

**Unknown:** exact current price-impact formula, buy/sell order weighting, per-good price bounds and local-vs-market price formula for 1.15.1 were not established by the sources collected here. Do not hard-code a universal ±75% cap. DD#131 describes the old food-needs problem where a +75% cap made food appear available despite being expensive; that is not evidence of a universal current cap.

## World Market Access and Trade Centers in 1.15

**Verified from Update 1.15:**
- A market area can support up to four World Market hubs, depending on market area size and connection to multiple bodies of water.
- State Trade Centers use a default hub.
- If a hub is blockaded or cut off, Trade Centers can switch to a fallback hub; World Market Access is penalized based on distance to the fallback.
- Trade between hubs may spread over several sea routes of similar length rather than a single fixed route.
- Cold conditions on sea nodes reduce ship speed and World Market Access for connected Trade Centers, and increase demand on supply routes supporting overseas troops.

**Verified from 1.15.2 UI hotfix:** World Market Access tooltip explains trade impact; Trade Capacity tooltip shows the reduction caused by World Market Access; Market Trade tab received missing tooltips/empty states and sorting fixes. Ports and Trade Centers can be set to auto-expand.

Sources:
- Update 1.15 / Dev Diary #196, 2026-11-05: https://steamdb.info/patchnotes/26453692/
- Hotfix 1.15.2: https://store.steampowered.com/news/app/529340/view/680767470935474875

## Tariffs, convoys, blockade and logistics

**Verified:** 1.15.2 added a lock and grace period to tariff/subvention option switching. Blockade/cut-off can change hub routing and lower market access. Piracy, tolls and strait closures can cause diplomatic consequences: relations decline, attitudes change and military intervention may occur; penalties depend on severity and dependency on the strait. Military supply routes are distinct from commercial trade flows, even when they share sea nodes and exposure to weather/blockade.

**Unknown:** exact tariff formulas, trade advantage coefficients, convoy accounting by route and price calculation order in 1.15.1. Do not infer these from pre-1.9 route diaries.

## Suggested Victori3 model (design proposal, not a claim about Paradox internals)

- Market: market identity, owner, member states, World Market link.
- GoodMarketState: buy orders, sell orders, local production/consumption, market price, shortage state.
- TradeCenter: state, ownership, level, employment, capacity, Trade Advantage, World Market Access, selected/fallback hub.
- MarketHub: market area, sea/land node, capacity, connectivity, blockade and seasonal penalties.
- TradeFlow: source/destination market and hub, good, quantity, path, transport cost, tariff, access penalty.
- SupplyRoute: separate military logistics entity with army/fleet consumer, throughput, disruption and supply state.
- TariffPolicy: import/export settings, subsidies, effective date and grace-period lock.

## Required causal loop

Production Method changes inputs/outputs → buy/sell orders change → prices change → Trade Centers respond to price differential and Trade Advantage → access/capacity/logistics constrain flows → blockade/cold/strait restrictions alter hub/path → prices and shortages change → building profitability, wages and Pop needs change → politics and budget respond.

## Open questions / conflicts

- Exact price bounds, buy/sell order weighting, Trade Advantage formula and tariff math: unknown.
- Local price vs market price details in every 1.15.1 condition: unknown.
- 1.15.2 UI fixes must not be retroactively attributed to 1.15.1.
- Task wording says Trade Routes, but old routes were removed in 1.9; current mechanics must be World Market/Trade Centers.

## Recommended acceptance tests

1. Buy-order increase with unchanged supply changes price/shortage through a documented rule.
2. PM change updates orders, prices, employment and profit.
3. Trade Center requires ownership/capacity and does not materialize free flows.
4. Blockaded primary hub switches to fallback only when a valid fallback exists.
5. No valid hub/path means flow is constrained, not teleported.
6. World Market Access reduces Trade Capacity and tooltip explains why.
7. Tariff changes respect configured lock/grace period.
8. Military supply and commercial trade remain separate ledgers.
9. Save/load preserves orders, hubs, flows, tariffs and prices.
10. Deterministic replay produces same market state at the same canonical time.
