# CG-03 — Buildings, Production Methods, employment and ownership

Research date: 2026-11-22. Directly described mechanics are verified; hiring speed, firing speed and exact profit/dividend formulas remain unknown unless a source is cited.

## Production Methods

**Verified:** Production Methods determine building functions, input/output goods and required employee types. Buildings have several PM categories, generally 2–5, with one active PM per category. Categories described in Dev Diary #5:
- Base: general technology/efficiency and typical outputs.
- Refining: shifts ordinary output toward specialized/luxury output and may add inputs.
- Automation: adds industrial inputs to reduce unskilled workforce requirements.
- Ownership: determines who owns shares, usually influenced by laws.

A PM is not a free upgrade. It can introduce scarce/expensive inputs, change outputs, alter workforce composition or reduce labor demand. Preview the trade-off before activation.

Source: Dev Diary #5, 2021-06-24: https://store.steampowered.com/news/posts/?enddate=1624550641&feed=steam_community_announcements

## Employment, wages and throughput

Buildings require profession-specific workforce. Hiring must consider available Pops, qualifications, wages and social/legal barriers. Buildings adjust wages over time to achieve high employment at low wage cost, but should not increase wages if that makes the building unprofitable. As employment rises, throughput rises, increasing both input consumption and output.

Source: official Victoria 3 diary on workforce/wages/throughput: https://store.steampowered.com/news/posts/?enddate=1629388859&feed=steam_community_announcements (supported; the exact diary title/number should be rechecked before final citation freeze). PM role requirements also documented in DD#5 above.

## Ownership and companies

Building ownership was substantially revised around Update 1.7. Dev Diary #127 describes ownership of building levels and bulk nationalization through the Building Registry. Update 1.9 says Trade Centers can be built with Construction Sectors and owned by Ownership Buildings through the Investment Pool.

Sources:
- Dev Diary #127, 2024-09-05: https://store.steampowered.com/news/posts/?enddate=1725544929&feed=steam_community_announcements
- Dev Diary #123, post-release ownership discussion: https://store.steampowered.com/news/posts/?enddate=1719497062&feed=steam_community_announcements
- Dev Diary #151 / Update 1.9: https://steamdb.info/patchnotes/18882924/

Model Financial Districts, Manor Houses, Companies, ownership shares and dividends as explicit entities/ledgers. Exact 1.15.1 rules for creation, transfer and dividend distribution need further verification; do not invent them.

## Construction

Construction Capacity, Construction Sector and Construction Queue are distinct. Construction is funded/consumed over time rather than treated as a one-time lump sum. A construction project has goods cost, capacity allocation, progress and queue order. Construction Sectors themselves consume inputs and employ Pops.

Source: Dev Diary #36, Construction, 2022-03-03: https://store.steampowered.com/news/posts/?enddate=1646329240&feed=steam_community_announcements

Hotfix 1.15.2 allows Ports and Trade Centers to auto-expand: https://store.steampowered.com/news/app/529340/view/680767470935474875

## Suggested data contract

BuildingInstance: id, type, state, level, construction state, ownership structure, active PMs, employment, productivity and profitability.
ProductionMethodDefinition: id, group, prerequisites, inputs, outputs, workforce demand and modifiers.
BuildingWorkforce: profession, required, employed, vacancies, qualified available, wage and hiring state.
OwnershipStructure: owner type/entity, shares, Investment Pool and dividends.
ConstructionProject: target, levels, goods cost, construction points, progress, queue position and funding source.
Company: identity, ownership, building interests, modifiers and prestige goods where applicable.

## Causal chain

PM change → inputs/outputs and profession demand → hiring/wages → throughput → goods orders/prices → profits/dividends → owner income and Pop wealth → demand and Investment Pool → construction.

## Open questions / conflicts

- Exact hiring/firing speed, wage cadence, dividend formula and ownership transfer rules at 1.15.1: unknown.
- Do not treat the four PM groups described in DD#5 as exhaustive for every building type.
- Separate base-game systems from DLC-specific company/ownership mechanics.
- Verify exact Financial District/Manor House conditions before finalizing data schemas.

## Recommended acceptance tests

1. PM change updates inputs, outputs, professions and predicted employment.
2. Invalid PM prerequisites prevent activation.
3. Employment changes throughput and goods flows.
4. Wages do not rise beyond sustainable profitability.
5. Profit is auditable from revenue, input costs, wages and operating costs.
6. Ownership shares sum to 100% and dividends reconcile.
7. Partial nationalization changes only selected building levels.
8. Construction consumes capacity/goods over time.
9. Save/load preserves PM, workforce, ownership and queue progress.
