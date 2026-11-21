# ChatGPT research handoff to Claude — 2026-11-22

Repository: mtieu6470-maker/Victori3-mobile
Branch: claude/game-historical-sandbox-modes-kg7rj7
Base HEAD before this research slice: 94d0d28d78cf8184b41df6b70ae4e7c55a85d38c
Research package HEAD at first checkpoint: 79f67f603c1914fe401bd5f546d92abe65ca2df4. Re-fetch current HEAD after the additional files in this handoff.

## Committed research files

- CG-01: docs/research/vic3/CG01_MARKETS_PRICES_TRADE_VI.md
- CG-02: docs/research/vic3/CG02_POPS_NEEDS_SOL_VI.md
- CG-03: docs/research/vic3/CG03_BUILDINGS_PM_JOBS_OWNERSHIP_VI.md
- CG-04: docs/research/vic3/CG04_CADENCE_AND_WORKER_VI.md
- CG-05: docs/research/vic3/CG05_POLITICS_DIPLOMACY_WAR_VI.md
- CG-07: docs/research/history/CG07_1937_2026_SOURCE_REGISTER_VI.md
- CG-08: docs/research/android/CG08_LIFECYCLE_THERMAL_VI.md
- CG-09: docs/research/ui/CG09_UI_INFORMATION_ARCHITECTURE_VI.md
- Visual catalogue: docs/research/media/CG_VICTORIA3_115X_UI_REFERENCE_CATALOG_VI.md

CG-06 DLC leaf parity CSV is not completed.
CG-10 art direction/asset taxonomy is not completed.
CG-11 CLOCK-01 critique is BLOCKED because the requested spec/source paths were not found at inspected HEAD; no code verdict is claimed.

## High-value findings

1. Victoria 3 1.9 replaced the old Trade Routes model with World Market + National Markets + autonomous Trade Centers. Do not implement old route mechanics as the 1.15 core.
2. 1.15 supports up to four World Market hubs per market area, fallback hub routing under blockade/cut-off and World Market Access penalties. 1.15.2 clarifies Trade Capacity/World Market Access UI and adds tariff/subvention switching lock/grace period.
3. War Support is 0–100 and can rise/fall; zero no longer automatically capitulates. Mid-war war-goal enforcement and mirror goals are part of 1.15.
4. 1.15 changes subject backstabbing/civil-war participation, adds Return State to Subject, military supply-route overlays and fleet Defeated lifecycle behavior.
5. Ship Designer is a strategic template/modification system, not a per-component gun editor. It changes Armor, Damage, Speed, Supply Capacity, cost and retrofit workflow.
6. Old diary screenshots must not be labeled current 1.15 UI. Official images are copyrighted reference-only.
7. Android thermal API is available through PowerManager from API 29; thermal status is a governor input, not CPU/GPU usage.
8. Worker postMessage structured-clones by default; use compact deltas and transferables for large buffers, not full GameState each tick.

## Primary sources

- Update 1.15 / Dev Diary #196: https://steamdb.info/patchnotes/26453692/ (SteamDB mirror; prefer official Steam announcement when available)
- 1.15.2 announcement: https://store.steampowered.com/news/app/529340/view/680767470935474875
- Dev Diary #151 / 1.9: https://steamdb.info/patchnotes/18882924/
- Dev Diary #109 Power Blocs: https://store.steampowered.com/news/posts/?enddate=1711034117&feed=steam_community_announcements
- Dev Diary #177 Ship Designer: https://store.steampowered.com/news/posts/?enddate=1774537219&feed=steam_community_announcements
- Dev Diary #21 Diplomatic Plays: https://store.steampowered.com/news/posts/?enddate=1635437078&feed=steam_community_announcements
- Dev Diary #5 Production Methods: https://store.steampowered.com/news/posts/?enddate=1624550641&feed=steam_community_announcements
- Android PowerManager: https://developer.android.com/reference/android/os/PowerManager
- MDN Web Workers: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
- Natural Earth license: https://www.naturalearthdata.com/about/terms-of-use/
- Maddison Project Database 2023: https://research.rug.nl/en/datasets/maddison-project-database-2023/
- V-Dem v16/license: https://v-dem.net/data/the-v-dem-dataset/ and https://v-dem.net/about/faq/

## Next actions for Claude

1. Read all deliverables from current branch and classify each claim against current source/code.
2. Correct source/version metadata to satisfy repository source policy.
3. Complete CG-06, CG-10 and CG-11 after verifying exact dependencies and inputs.
4. Obtain actual 1.15.1/1.15.2 screenshots or clips for all seven requested screens, recording version/checksum and rights status.
5. Reconcile CG-04 cadence proposal with CLOCK-01 and engine implementation; do not treat estimates as verified Victoria 3 tick cadence.
6. Integrate only after review; these documents do not claim implementation or phase acceptance.

## Open questions / conflicts

- AI_TASK_ASSIGNMENTS.md supplied in owner-provided task text was not present at inspected branch HEAD. Claude should create/update canonical task register in its project-director workflow.
- CLOCK-01 spec and code paths were not found; CG-11 is blocked, not passed.
- 1.15.2 behavior must be distinguished from 1.15.1.
- Visual reference research does not grant redistribution rights.

## Recommended acceptance tests

1. Claude reads back each deliverable from current branch and checks for conflicts.
2. Every verified claim has exact source URL/version/date.
3. Unknown formulas remain unknown until evidence is added.
4. No old Trade Routes model is used as post-1.9 core.
5. No copyrighted reference image enters distributable packs without a valid license.
6. Claude updates AI_HANDOFF/task register only after review.
