# CG-51 — Victoria 3 UI and mechanics reference: events, journals, diplomacy and military

Date: 2026-11-23. Response to MSG-115. This is a mechanics/design reference, not a reproduction of copyrighted screenshots or text.

## 1. Event window and journals

### Reference interaction pattern
- A prominent period-appropriate illustration anchors the left side; the right side contains event title, narrative, optional quoted voice, and vertically stacked choices.
- Each choice should communicate effects before selection: immediate effects, timed modifiers, journal starts/advances, treaty obligations and delayed risks.
- An event should not be a pure flavour popup. The player needs to understand the actors, why it fired, what is at stake, and how each option changes the state.
- Journals provide persistent goals with progress, milestones, completion/failure, timeout and follow-up events. This is better suited to a multi-year independence process than a one-off popup.

### Current project comparison
- The project has a data-driven schema in docs/spec/STORY_EVENTS_SCHEMA_VI.md; 30 generic events and 15 journals are in historical_data/events/story/generic_politics.json.
- EVT-01 supports timed modifiers, progress journals, country/region conditions, role binding for sandbox events and event chains.
- Gap: the generic file is broad political content; it does not supply national story arcs for each colony. MSG-114's package is docs/research/design/CG50_BRITISH_EMPIRE_LOT1_EVENTS_RESEARCH.json (85 candidate events, 10 journals), not installed into runtime data pending Claude review and country-ID mapping.
- Gap: event image IDs must refer to actual ingested assets. Do not set placeholder refs; missing assets create broken/blank artwork. MSG-116 requires PD/CC0 validation before ingest.

## 2. Diplomatic play

### Victoria 3 reference
- Diplomatic plays progress through opening moves, maneuvering and countdown to war; participants can lean, join, remain neutral, offer/accept sway, add demands and back down.
- Primary demands are enforced if the target backs down; secondary demands are tied to the war outcome. The 1.2 design introduced multiple primary demands and increased their diplomatic cost/infamy where appropriate.
- Sway is a bargain: an obligation, alliance call, subject transfer, state or war goal can be offered for support. AI acceptance weighs offer value against preference for either side and neutrality. Confidence estimates chance of winning; boldness adds controlled uncertainty to back-down decisions.
- Do not state a universal numerical acceptance formula: public Paradox diaries explain factors and design, not the full formula.

### Project comparison (static review)
- src/engine/systems/diplomacy.ts already has relations, alliances, rivals, infamy tiers, subject restrictions and post-1945 aggression norms.
- src/engine/systems/military.ts resolves wars monthly with sides, fronts, battles, casualties, occupation and war exhaustion.
- The inspected modules do not expose a complete V3-style diplomatic-play state machine: no explicit opening/maneuver/countdown phases, maneuver budget, primary/secondary demand model, sway-offer ledger, neutrality score or back-down evaluation surfaced in this pass.
- Recommended order: (1) diplomatic-play data model and deterministic phase clock; (2) demand model with primary/secondary distinction; (3) participant preference/neutrality and sway scoring; (4) back-down confidence/cost evaluation; (5) UI panel and event/journal integration; (6) AI regression scenarios.

## 3. Military reference

### Fronts and battles
- V3's front abstraction groups connected theatres rather than requiring province micromanagement. Generals are assigned to advance/defend fronts; battles resolve with terrain, commander, technology, supply, morale and engagement limits. Exact formulas vary by version and are not fully disclosed in official diaries.
- Project code calculates side strength, front targets, terrain factors, naval reach, casualties, occupation and war exhaustion in military.ts. It has a useful monthly simulation but not a complete front UI/commander order system.
- Prioritise explicit front objects, general assignment/orders, battle records and supply/attrition reporting before adding more tactical variables.

### Navy and invasions
- A strategic naval layer should distinguish fleets, admirals, patrol/escort, sea control, convoy protection, transports, naval battles and naval invasions. An invasion needs preparation, transport capacity, escort/sea-control and a landing battle; it should not teleport an army to a coastal front.
- The inspected military.ts has navy strength/quality and a naval reach check for coastal targets, but does not model fleets, admirals, ship classes/designs, patrol missions or invasion preparation as separate entities.
- Build in this order: fleet entities and mission orders → sea zones/route control → convoy/transport capacity → invasion preparation and landing → ship classes and refit/design layer.

### Recruitment
- V3 distinguishes military buildings/recruitment capacity from battalions/units, with regular forces and conscription as separate sources. Show recruitment time, cost, manpower, officer/soldier employment, supply and mobilization burden.
- The project currently derives manpower target from population and army law in militaryMonth; the inspected file does not expose a building-driven barracks/recruitment-centre pipeline.
- Recommended sequence: recruitment buildings and regional manpower → unit/battalion records → mobilization queue and training time → conscription pool → reinforcement and replacement rules.

## 4. Suggested UI delivery order
1. Event modal: image, title, narrative, source/actor context, 2–4 choices; each choice shows instant and timed effects.
2. Journal panel: progress bar, milestones, active/failed/completed state, timeout, linked events and rewards.
3. Diplomatic play screen: escalation timeline, sides, participants, demands, primary/secondary tags, maneuver points and sway offers.
4. Military front screen: front map/list, generals, advance/defend orders, battle log and casualties.
5. Navy screen: fleets, admirals, sea zones, patrol/escort, transports and invasion preparation.
6. Recruitment screen: barracks, recruitment centres, unit types, manpower, queue and mobilization cost.

## 5. Version and copyright caveats
- Official Paradox diaries below describe the versions they discuss; Dev Diary #75 is specifically the 1.2 diplomatic update. Do not silently treat its rules as current 1.15 rules.
- The 1.15 notes surfaced in this pass are a SteamDB mirror. Validate changed war-support or subject mechanics against the installed 1.15 build.
- Owner-provided screenshots are not included in the repository. This document describes interface patterns only; no V3 screenshot, icon, event text or artwork should be copied into the game.

## Sources
- Paradox Dev Diary #57: https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-57-the-journey-so-far
- Paradox Dev Diary #59: https://www.paradoxinteractive.com/games/victoria-3/news/victoria-3-dev-diary-59-ai
- Paradox Dev Diary #75: https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-75-diplomatic-improvements-in-1-2
- Paradox Dev Diary #78: https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-78-update-1-2-changelog
- Paradox Dev Diary #79: https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-79-whats-next-after-12
- 1.15 announcement mirror: https://steamdb.info/patchnotes/26453692/
- Community journal-entry index (discovery only): https://alcaras.github.io/v3ref/journal-entries/
