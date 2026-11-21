# Victoria 3 1.15.x — Visual reference catalog for Claude and Hydrogen

Compiled: 2026-11-22. Official screenshots/video frames are copyrighted reference-only unless Paradox grants reuse rights. Do not bundle them in the game or redistribute them. Extract functional requirements and build original UI/art.

## Requested screen coverage and source catalogue

| Screen | Source | What to inspect | Version confidence / rights |
|---|---|---|---|
| Production Methods | Dev Diary #5: https://store.steampowered.com/news/posts/?enddate=1624550641&feed=steam_community_announcements | PM groups, input/output goods, professions, trade-offs | Early design diary, not current UI; historical reference only |
| Buildings/jobs | https://store.steampowered.com/news/posts/?enddate=1629388859&feed=steam_community_announcements | workforce, wages, throughput | Historical reference; verify current behavior |
| Legacy Trade Routes | Dev Diary #38: https://store.steampowered.com/news/posts/?enddate=1647536906&feed=steam_community_announcements | Old route UI and tariffs | Pre-1.9; do not use as current mechanics |
| National Markets | Dev Diary #9: https://store.steampowered.com/news/posts/?enddate=1628180040&feed=steam_community_announcements | market, prices, supply/demand | Historical reference |
| Current World Market | Dev Diary #151 / 1.9: https://steamdb.info/patchnotes/18882924/ | World Market, Trade Centers, Trade Advantage | Mechanics source for 1.9+ |
| Diplomatic Play | Dev Diary #21: https://store.steampowered.com/news/posts/?enddate=1635437078&feed=steam_community_announcements | sides, pressure, diplomacy before war | Historical design reference; verify 1.15 UI |
| Power Bloc | Dev Diary #109: https://store.steampowered.com/news/posts/?enddate=1711034117&feed=steam_community_announcements | Bloc overview, members, identity/principles | Official reference |
| Power Bloc art/UI | Dev Diary #116: https://store.steampowered.com/news/posts/?enddate=1715263335&feed=steam_community_announcements | emblems, statues, map mode, clothing | Official reference |
| Ship Designer | Dev Diary #177: https://store.steampowered.com/news/posts/?enddate=1774537219&feed=steam_community_announcements | modification groups, 3D preview, cost graph, templates, retrofit, wildcard slots | Official diary; The Great Wave content |
| War Support | Dev Diary #185/#191 and 1.15: https://steamcommunity.com/app/529340/announcements/?l=english ; https://steamdb.info/patchnotes/26453692/ | 0–100 support, causal factors, war-goal enforcement, stalemate | 1.15 integrated behavior |
| 1.15 current UI changes | Update #196: https://steamdb.info/patchnotes/26453692/ | market hubs, military supply overlays, Journal redesign | 2026-11-05 |
| 1.15.2 interface | https://store.steampowered.com/news/app/529340/view/680767470935474875 | World Market Access/Trade Capacity tooltips, Trade tab empty states/sorting, fleet map controls | 1.15.2 hotfix |

## Ship Designer: official image anchors

The official Dev Diary #177 page includes images for the ship designer, 3D ship examples, cost graph, template selection, retrofit and flagship panel. On the opened Steam page these were image anchors 4–15. Use the page itself to inspect the embedded images:
https://store.steampowered.com/news/posts/?enddate=1774537219&feed=steam_community_announcements

Mechanics verified in that diary: Ship Modifications adjust Armor, Damage, Speed and Supply Capacity; each has low/medium/high tiers. Modification levels can create trade-offs and raise construction/maintenance costs non-linearly. Templates represent ship type plus chosen modifications. Existing ships can be retrofitted through a shipyard queue. Wildcards specialize ships, e.g. patrol/blockade, medical support or fire suppression. This is strategic abstraction, not a per-gun component editor.

## 1.15.x screen capture checklist

Capture the actual 1.15.1 or 1.15.2 game UI, not generic older screenshots:
- Production Methods: building panel, all PM groups, selected PM, input/output, workforce and tooltip.
- Trade: Market Trade tab, World Market Hub filter, Trade Capacity and World Market Access tooltip.
- Diplomatic Play: opening play, participants, sway, escalation, war goals and acceptance reasons.
- Military: active front, armies, battle, occupation, friendly/allied/enemy supply route overlays, naval invasion.
- Power Bloc: overview, identity, principles, cohesion/leverage, members, invite and map lens.
- Ship Designer: hull, four modification groups, 3D preview, complexity graph, template and retrofit.
- War Support: both sides' 0–100 values, factor breakdown, enforcement progress and stalemate case.

For every capture record game version/checksum, DLC ownership, date, resolution, language, screen name, source/author, video timestamp and rights status. If version/checksum is absent, do not label it confirmed 1.15.x.

## Community media entrypoints (user-uploaded; rights not implied)

- Screenshots: https://steamcommunity.com/app/529340/screenshots/
- Artwork: https://steamcommunity.com/app/529340/images/
- Videos: https://steamcommunity.com/app/529340/videos/
- Guides: https://steamcommunity.com/app/529340/guides/

Default classification is historical_reference only. Author/license vary by item; absent license means not distributable.

## Open questions / conflicts

- This research slice found official patch/dev diary sources but did not capture a verified current 1.15.x screenshot/clip for every requested screen.
- DD#5/#9/#21/#38 are older; do not mislabel as current 1.15 screenshots.
- SteamDB is a third-party mirror; prefer the official Steam announcement where possible.
- Community uploads do not grant permission to redistribute.

## Recommended acceptance tests

1. Each reference is labeled with verified 1.15.1 or 1.15.2 build/checksum, or marked NOT_VERIFIED.
2. No copyrighted reference is shipped in a distributable pack.
3. Every distributable asset has explicit modification and redistribution permission.
4. Old diaries are cross-checked against current patch behavior.
5. Each of the seven requested screens has a current-version capture or an explicit BLOCKED/NOT_FOUND status.
