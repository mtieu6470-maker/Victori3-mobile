# Official source digest — Victoria 3 Update 1.15.x and World Market 1.9

Research date: 2026-11-22  
Game: Victoria 3  
Primary publisher/developer source host: Paradox Interactive / official Steam announcements.  
Copyright note: this file is a source register and original factual summary, not a reproduction of the full copyrighted patch notes or diary text. Open the official source links for the complete original text. Only short identifying phrases are quoted.

## 1. Update 1.15 release — Dev Diary #196

- Official title: Victoria 3 - Dev Diary #196 - State and Revolution & Update 1.15 NOW LIVE
- Publisher: Paradox Interactive / Victoria 3 official Steam announcements
- Published: 2026-11-05
- Version: Update 1.15.0, checksum `fc93`
- Official full article: https://store.steampowered.com/news/app/529340/view/680766201707627232
- Official Steam discussion mirror: https://steamcommunity.com/app/529340/eventcomments/572679917415711828/

### Relevant source-derived changes (paraphrased)

- State and Revolution adds Russia-focused narrative systems: Tsar/Favorite interactions, a dynamic Emperor and Autocrat Journal Entry, Siberian exile, Russian Revolution and Civil War content, post-revolutionary outcomes, Russification, Polish independence content, and Ukrainian/Belarusian cultural renaissances.
- Update 1.15 includes a War Support rework: values range from 0–100 and can rise or fall; initial support depends on willingness to enter the war; battle, occupation, war-goal progress, devastation, economic regression and duration contribute. Low support affects radicalization, military effectiveness and subject Liberty Desire. Reaching zero does not itself cause automatic capitulation.
- War goals may be enforced during a war after objective control accumulates progress; eligible opponents may receive a mirror goal. Some goals remain restricted to capitulation/peace.
- Update 1.15 includes multiple World Market hubs per market area, sea-route distribution changes, Cold effects on sea nodes, and market access/logistics consequences.
- The release post explicitly warns that old saves are incompatible because of map/mechanical changes.

## 2. Hotfix 1.15.2

- Official title: Hotfix 1.15.2 is now LIVE! - Not for Problem Reports!
- Publisher: Paradox Interactive / Victoria 3 official Steam announcements
- Published: 2026-11-19
- Version: 1.15.2, checksum `fb14`; changes compared with 1.15.1
- Official full article: https://store.steampowered.com/news/app/529340/view/680767470935474875
- Official announcement listing (backup): https://steamcommunity.com/app/529340/announcements/

### Relevant source-derived changes (paraphrased)

- Fleets can automatically queue replacement ships after naval losses, controlled per fleet.
- Ports and Trade Centers can be set to auto-expand.
- Tariff/subvention option changes gain a lock and grace period.
- World Market Access concept tooltip explains its trade impact; Trade Capacity tooltip shows the capacity reduction attributable to World Market Access.
- The Market Trade tab receives missing tooltips/empty states and sorting fixes.
- Additional naval, diplomatic, AI, law, company, battle-casualty, and UI fixes are included. Consult the linked full patch notes for the complete list.

## 3. Dev Diary #151 — Charters of Commerce & Update 1.9 now LIVE

- Official title: Victoria 3 - Dev Diary #151 - Charters of Commerce & Update 1.9 now LIVE!
- Publisher: Paradox Interactive / Victoria 3 official Steam announcements
- Published: 2025-06-17
- Version: Update 1.9.0, checksum `b963`
- Official full article: https://store.steampowered.com/news/app/529340/view/550115608635643969
- Official Steam discussion mirror: https://steamcommunity.com/app/529340/eventcomments/555745584695234606/

### Relevant source-derived changes (paraphrased)

- Update 1.9 removes the old Trade Routes model and introduces a World Market above National Markets. Trade Centers trade autonomously with the World Market, exploiting price differences and Trade Advantage; Trade Centers are built using Construction Sectors and may be owned through Ownership Buildings / Investment Pool.
- Company Charters include Trade, Investment, Colony and Industry permissions. The paid pack also adds company/country monopolies and Prestige Goods.
- Diplomatic Treaties become a configurable agreement system with articles such as tariff restrictions, subvention restrictions, trade prohibitions, investment-related arrangements and other commitments.
- Blockades reduce World Market Access, Shipping Lane Efficiency and throughput in connected port hubs, with effect depending on blockade strength.
- Military access and supply/logistics changes are separate from commercial World Market trade.

## 4. Supporting official diaries for specific claims

### Dev Diary #185 — AI Update & War Support Rework
- Published: 2026-08-20
- Official full article: https://store.steampowered.com/news/app/529340/view/676255623445217327
- Scope: first detailed explanation of the AI/War Support rework before beta integration. Treat as design-intent context; use DD#191 and 1.15 release notes for the final 1.15 implementation.

### Dev Diary #191 — AI and War Support Open Beta Summary
- Published: 2026-10-07
- Official full article: https://store.steampowered.com/news/app/529340/view/703281660030877912
- Scope: summarizes the changes implemented during the 1.14 open beta and expected in 1.15. It confirms War Support and War Goal Flipping broadly landed as described, notes removal of an interim automatic dropping of uncontrolled war goals, describes the Release Country requirement (minority movement with at least 50% activism), and adds Release as Subject with infamy.

### Dev Diary #9 — National Markets (historical baseline only)
- Published: 2021-08-05
- Official full article: https://store.steampowered.com/news/posts/?enddate=1628180040&feed=steam_community_announcements
- Scope: explains the original buy/sell order market-price concept and Market Access scaling. This is a foundational description, not proof that every coefficient or price bound remains unchanged in 1.15.x.

## 5. Version discipline and unresolved formulae

- DD#151 describes the 1.9 architecture transition; do not implement pre-1.9 Trade Routes as the current model.
- DD#196 is the 1.15.0 release baseline; DD#191 describes beta iteration and final intended integration; 1.15.2 adds subsequent fixes.
- Exact 1.15.x formulae for Trade Advantage, World Market Access, buy/sell order price response, price floor/ceiling and tariff calculation are **unknown** unless a source explicitly publishes them.
- The DD#9 description establishes the conceptual buy/sell order mechanism in the original National Market system, but its exact numeric coefficients and bounds must not be copied into the 1.15 World Market model without current official evidence.
- The full official articles remain hosted by Steam/Paradox. This repository file records source metadata and a paraphrased research digest only.

## Open questions / conflicts

- Exact current Trade Advantage formula and its component weights: unknown.
- Exact World Market Access → Trade Capacity equation and all blockade/fallback multipliers: unknown.
- Exact price floor/ceiling, order weighting, and tariff/subvention formula in 1.15.2: unknown.
- DD#9 predates World Market rework and can only be used as historical conceptual background unless reconfirmed by a later official source.

## Recommended acceptance tests

1. Every mechanic claim in CG-01/03/05 points to an exact official diary/patch page and labels version/date.
2. No SteamDB URL remains in CG-01, CG-03 or CG-05.
3. DD#185 and DD#191 references are direct article links, not a generic announcement index.
4. Unknown coefficients remain `unknown` in design data and are not replaced by guessed constants.
5. 1.15.0, 1.15.1 and 1.15.2 claims are version-separated.
