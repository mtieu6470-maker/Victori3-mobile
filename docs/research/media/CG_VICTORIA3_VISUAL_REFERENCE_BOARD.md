# Victoria 3 — Visual reference board for Claude/Hydrogen

Compiled: 2026-11-22  
Purpose: visual inspection and UI/UX reference for the Victori3 Mobile project.  
**Important:** The images below are embedded from their original hosting pages; the image binaries are not copied into this repository. This avoids republishing third-party copyrighted material without an explicit license. These are references only, not distributable game assets.

Version labels are conservative. Unless a source explicitly identifies the game build/checksum, treat the capture as `version_unverified`. Older screens remain useful for information architecture but must not be mistaken for the current 1.15 UI.

## 1. Production Methods / building details

![Victoria 3 Production Methods panel](https://images.ctfassets.net/u73tyf0fa8v1/2JVxK6iXUgUi8HX1cCsHuI/cb67a13d340ff2a3462ff6eea822dadb/image4.png?q=75&w=3840)

- Source: Paradox Interactive, Dev Diary #66 — Patch 1.1 (part 2)
- URL: https://www.paradoxinteractive.com/games/victoria-3/news/victoria-3-dev-diary-66-patch-1-1-pt2
- Depicts: building panel, PM selector, throughput, employment, predictive tooltip.
- Version: 1.1-era; historical UI reference, **not 1.15**.
- Rights: © Paradox Interactive; reference-only; no redistribution permission established.

## 2. World Market / Trade Center

![Victoria 3 Trade Center and World Market Access](https://forumcontent.paradoxplaza.com/public/1316775/1750533659172.png)

- Source: Paradox Forums, player discussion on manually building Trade Centers.
- URL: https://forum.paradoxplaza.com/forum/threads/when-should-i-manually-build-trade-centers.1799979/
- Depicts: Trade Center panel, World Market Access, Trade Capacity, weekly balance.
- Version: post-1.9 World Market-era; exact build/checksum unverified.
- Rights: forum user upload; author/license not confirmed; reference-only.

## 3. Diplomatic Play / War Support tooltip

![Victoria 3 Diplomacy and War Support tooltip](https://forumcontent.paradoxplaza.com/public/1098415/victoria%203-2.png)

- Source: Paradox Forums, user screenshot.
- URL: https://forum.paradoxplaza.com/forum/threads/worth-playing-cant-get-past-the-clunky-military-interface.1652168/
- Depicts: diplomacy panel and War Support causal tooltip.
- Version: exact build/checksum unverified; likely predates 1.15. Use for information hierarchy only.
- Rights: forum user upload; author/license not confirmed; reference-only.

## 4. Military front / battle map

![Victoria 3 military engagement map](https://forumcontent.paradoxplaza.com/public/1274772/DD145_11.png)

- Source: Paradox Forums, Dev Diary #145 — Military Improvements.
- URL: https://forum.paradoxplaza.com/forum/developer-diary/victoria-3-dev-diary-145-military-improvements.1735642/
- Depicts: front line, army counters, battle engagement and supply-related indicators.
- Version: pre-1.15 development diary; historical UI reference.
- Rights: © Paradox Interactive; reference-only.

## 5. Power Bloc creation and customization

![Victoria 3 Power Bloc customization](https://images.igdb.com/igdb/image/upload/t_1080p/sczhm5.png)

- Source: My Games Backlog, Victoria 3: Sphere of Influence page.
- URL: https://mygamesbacklog.com/games/victoria-3-sphere-of-influence
- Depicts: bloc identity, emblem/color customization, principles and formation panel.
- Version: Sphere of Influence-era; exact patch unverified.
- Rights: third-party hosted game screenshot; license not confirmed; reference-only.

## 6. Ship Designer — The Great Wave

![Victoria 3 Ship Designer](https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/4314630/b01c45d5f88dd3aded9a5a879fe227b1903bc98e/ss_b01c45d5f88dd3aded9a5a879fe227b1903bc98e.1920x1080.jpg?t=1773667718)

- Source: Steam store asset for Victoria 3: Volume 3 / The Great Wave content.
- URL: https://store.steampowered.com/app/4314630/Victoria_3_Volume_3/
- Depicts: ship template, armor, guns, propulsion, supply capacity, wildcard modifications and 3D preview.
- Version: expansion/store asset; exact game patch/checksum unverified.
- Rights: © Paradox Interactive / Valve store-hosted asset; reference-only.

## 7. Trade Routes — legacy reference only

![Victoria 3 legacy Trade Routes map panel](https://cdn.spaziogames.it/storage/wp/new-images/2022/10/victoria-3-51731.jpg)

- Source: SpazioGames review screenshot.
- URL: https://www.spaziogames.it/recensioni/victoria-3-recensione
- Depicts: old export/import route selection and convoy availability.
- Version: pre-1.9 legacy Trade Routes UI.
- **Do not implement this as the current 1.15 trade model.** It is included only to show what was replaced.
- Rights: third-party screenshot; license not confirmed; reference-only.

## 8. Workforce / qualification tooltip

![Victoria 3 building workforce panel](https://forumcontent.paradoxplaza.com/public/1380508/SNAG-0248.jpg)

- Source: Paradox Forums, user screenshot.
- URL: https://forum.paradoxplaza.com/forum/threads/why-wont-my-unemployed-get-a-job.1864243/page-2
- Depicts: workforce by profession, employment, qualifications and hiring constraints.
- Version: exact build/checksum unverified; likely modern UI, **not verified as 1.15.1**.
- Rights: forum user upload; author/license not confirmed; reference-only.

## Capture gaps — must still obtain genuine 1.15.1 / 1.15.2 captures

1. Production Methods: current building panel with all active PM groups and predictive input/output/workforce tooltip.
2. Trade: current Market > Trade tab with World Market Hub filter, Trade Capacity and World Market Access tooltip.
3. Diplomatic Play: current play panel with participants, sway, escalation and acceptance breakdown.
4. Military: current active front and own/allied/enemy supply-route overlays.
5. Power Bloc: current overview showing principles, cohesion/leverage, members and map lens.
6. Ship Designer: current template/modification panel and retrofit flow.
7. War Support: both sides' 0–100 support values and factor breakdown.

For each capture, record: exact game version, checksum, DLC state, capture date, language, resolution, source account/author, screenshot or video timestamp, and rights classification. If version/checksum cannot be proven, label `version_unverified`.

## Open questions / conflicts

- These are useful visual references but are not a complete set of verified 1.15.1 screenshots.
- Some images are old UI, some are user uploads, and all remain reference-only unless explicit redistribution rights are established.
- No image binary is committed in this repository; GitHub renders the remote images inline from their original hosts.

## Recommended acceptance tests

1. All seven requested screens have a current-build capture or an explicit `BLOCKED` reason.
2. No image is mislabeled as 1.15.x without build/checksum evidence.
3. Claude can open every source link and view the embedded image.
4. No reference image is copied into distributable game assets.
5. Any future locally stored image has exact source, author, license, attribution and checksum.
