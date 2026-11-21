# CG-01b — Market formulas and numeric mechanics (1.15.x)

Research date: 2026-11-22  
Scope: Trade Advantage, World Market Access, buy/sell orders, price bounds and tariffs.  
Rule: exact numeric formulae are recorded only when an official Paradox source publishes them. No reverse-engineering from UI labels or community speculation.

## 1. Trade Advantage

**Verified — qualitative only.** Update 1.9 states that World Market Trade Centers trade autonomously, exploiting price differences and Trade Advantage to make a profit. Prestige Goods can grant higher Trade Advantage on the World Market. Update 1.9 also adds a Power Bloc principle effect that increases Trade Advantage when trading with countries sharing the same state religion.

**Unknown — numeric formula.** The official sources reviewed do not publish:
- base Trade Advantage per Trade Center or level;
- exact modifiers, weights, caps or floor;
- conversion from Trade Advantage to Trade Center profitability or trade volume;
- priority/interaction with price spread, tariffs, shipping cost or World Market Access.

Sources:
- Dev Diary #151 / Update 1.9, 2025-06-17: https://store.steampowered.com/news/app/529340/view/550115608635643969
- Update 1.9 official full notes mirror: https://store.steampowered.com/news/posts/?enddate=1750169690&feed=steam_community_announcements

## 2. World Market Access (WMA)

**Verified — qualitative and UI-facing.**
- Update 1.9 describes blockades as reducing World Market Access, Shipping Lane Efficiency and throughput of buildings in the Port hub; magnitude depends on blockade strength.
- Multiple World Market hubs may exist in a market area. If a hub is blockaded/cut off, Trade Centers may route through a fallback hub and suffer a WMA penalty based on distance to the fallback.
- Update 1.15.2 explicitly improves the WMA tooltip to show blockade penalties as multipliers and makes the Trade Capacity tooltip show how much WMA reduces capacity.
- The 1.15.2 notes also state that the WMA concept tooltip explains in more detail how it affects trade.

**Unknown — exact equation.** The official material reviewed does not disclose the full WMA formula, multiplier composition, fallback distance curve, or exact WMA-to-Trade-Capacity equation. Do not substitute a guessed percentage or linear formula.

Sources:
- Dev Diary #151 / Update 1.9: https://store.steampowered.com/news/app/529340/view/550115608635643969
- Hotfix 1.15.2, 2026-11-19: https://store.steampowered.com/news/app/529340/view/680767470935474875

## 3. Buy/Sell orders and price formation

**Verified — foundational National Market model.** Dev Diary #9 states that market price is based on the balance between a market's Buy Orders and Sell Orders, with base price as baseline. More Buy Orders than Sell Orders raises price; more Sell Orders than Buy Orders lowers it. The diary also explains that orders are scaled by state Market Access, so low-access states trade less with the market and rely more on local goods. Goods are sold/consumed at production/consumption time rather than accumulated in a physical stockpile.

**Version caveat.** DD#9 was published 2021-08-05 and describes the original National Market architecture. Update 1.9 later introduced a World Market above National Markets. The 1.9 diary confirms that Trade Centers exploit price differences and Trade Advantage, but does not republish the complete numeric price algorithm for 1.15. Therefore the DD#9 mechanism is a verified conceptual baseline, not proof of unchanged 1.15 numeric coefficients.

**Unknown in 1.15.x:** order weighting, price elasticity, update order, local-vs-market price equation, price floors/ceilings and any per-good exceptions.

Sources:
- Dev Diary #9 — National Markets, 2021-08-05: https://store.steampowered.com/news/posts/?enddate=1628180040&feed=steam_community_announcements
- Dev Diary #151 / Update 1.9, 2025-06-17: https://store.steampowered.com/news/app/529340/view/550115608635643969

## 4. Tariffs and subventions

**Verified — controls and treaty restrictions.**
- Update 1.9 introduced treaty articles that can prohibit tariffs or subventions on specified goods traded with the World Market.
- Update 1.15.2 adds a lock and grace period to switching tariff/subvention options.
- These sources confirm that tariff/subvention policies exist and can be treaty-constrained, but do not publish the current numeric calculation.

**Unknown:** tariff rate formula, tax base, import/export direction modifiers, ordering relative to Trade Advantage/WMA, and exact grace-period duration/lock state transitions.

Sources:
- Dev Diary #151 / Update 1.9: https://store.steampowered.com/news/app/529340/view/550115608635643969
- Hotfix 1.15.2, 2026-11-19: https://store.steampowered.com/news/app/529340/view/680767470935474875

## 5. Implementation guidance for Victori3 Mobile (proposal, not Paradox facts)

Represent unknown formulae as explicit versioned configuration slots, not hard-coded guesses:
- `tradeAdvantage: { value, sources, confidence }`
- `worldMarketAccess: { value, modifiers[], routeId, confidence }`
- `tradeCapacity: { base, accessMultiplier, capacityUsed, confidence }`
- `marketPrice: { basePrice, buyOrders, sellOrders, priceIndex, bounds: unknown }`
- `tariffPolicy: { mode, rate: unknown, lockUntil, gracePeriod: unknown }`

Keep the calculation graph deterministic and auditable. When exact coefficients become available from official sources or verified 1.15 tooltips, add them with version/date and acceptance tests. Until then, use transparent provisional simulation rules clearly marked as design assumptions, not Victoria 3 parity.

## Open questions / conflicts

- No official numeric formula for Trade Advantage was found in the reviewed sources.
- No official full equation for WMA or its effect on Trade Capacity was found.
- DD#9 describes the original National Market; 1.9 World Market architecture changes the context. Do not assume the old price model directly defines all 1.15 world-market pricing.
- No current official price floor/ceiling was found. Keep it `unknown`.
- No current official tariff formula or grace-period duration was found. Keep both `unknown`.

## Recommended acceptance tests

1. Every implemented formula has an official source, version/date and confidence label.
2. Unknown coefficients are not replaced by undocumented constants.
3. Buy/Sell order changes have deterministic, explainable effects on market price.
4. Trade Advantage and price spread are represented as distinct inputs.
5. WMA affects capacity only through a documented/explicitly provisional multiplier.
6. Blockade and fallback-hub penalties are not double-counted.
7. Tariff/subvention changes respect a configurable lock/grace-period state machine.
8. Save/load preserves all market inputs and derived values.
9. Historical and sandbox replays produce identical market outcomes for identical seeds and commands.
