# CG-60 — France (FRA) historical story-event batch checkpoint

- Date: 2026-11-24
- Working branch: `ccr-b27f3fb8-epfpd6`
- Exact source-of-truth HEAD before this checkpoint document: `e740546861c32f6180c79f88ab20ce6edd7ba379`
- Assignment: MSG-129 / MSG-126 Part A1 — country packs, first country FRA
- Status: **FRA data package delivered for Claude integration review; country-pack programme remains IN_PROGRESS.**
- This is a research/data handoff, not a runtime integration, independent review, or owner acceptance.

## 1. Delivered files and commits

| Commit | File | Change |
|---|---|---|
| `1f47785ae8b230715258d101d532e5e3294a8c12` | `historical_data/events/story/FRA.json` | Initial France story pack |
| `52677f83801dd3ddfb0eee8bef577289522c3555` | `historical_data/assets/illustration_sources/story_selection.json` | Seven event-specific image candidates |
| `4b3bad321d810bc8135afb063952705ccaf8ccf5` | `historical_data/events/story/FRA.json` | Split the 1881 and 1882 education milestones; corrected the ECB euro cash source |
| `2586da5b04e31023632d55f4c6582f5083aea3a5` | `historical_data/assets/illustration_sources/story_selection.json` | Clarified the Dreyfus illustration publication date versus depicted ceremony date |
| `e740546861c32f6180c79f88ab20ce6edd7ba379` | `historical_data/events/story/FRA.json` | Use schema `fire_date` for dated historical events; bind journals to event milestones |

### Current data counts at the reviewed HEAD

- `FRA.json`: **59 historical events**, **6 journals**, **31 source references**.
- Event IDs: 59 unique `fra_*` IDs.
- Each event has Vietnamese and English title/narrative, two choices, and a named timed modifier on each choice.
- Every dated event has `trigger.fire_date` set from `date_historical`; `mtth_months` was removed to avoid random within-year firing.
- Each of the six journals is linked to event milestones via `event_fired`; milestone weights sum to 100 per journal, with a monthly decay entry.
- Event images: seven references have matching candidates in `story_selection.json`.
- `story_selection.json`: 101 entries after these seven additions; no duplicate subjects found.
- No unknown region IDs found in the cross-border effects when checked against `historical_data/borders/regions_1836.csv`.

## 2. Historical coverage

The pack currently covers the February Revolution and Second Republic; the Second Empire; colonial expeditions and the Indochina campaign; the Franco-Prussian War, Commune and early Third Republic; republican institutions, education, unions and the Dreyfus affair; the World Wars, Vichy, Free France and Liberation; post-war social security, Indochina and Algeria decolonisation; the Fifth Republic, European integration, and selected events through Paris 2024.

**Coverage gap to preserve for the next research pass:** the earliest event is 24 February 1848. France is playable from 1836, so the July Monarchy period 1836–1847 is not yet covered in this batch. No 2025–2026 event is included either. Do not describe this as complete coverage of the 1836–2026 campaign.

## 3. Image candidate / rights status

Seven event-specific Commons candidates were added; they are **not ingested assets** and should not yet be described as visible in the game.

| Story subject | Candidate | Rights / integration warning |
|---|---|---|
| `ill_fra_february_revolution_1848` | BnF/Gallica map of February 1848 barricades | Commons page states pre-1931 / public-domain bases; preserve BnF attribution and re-read rights |
| `ill_fra_coup_1851` | *Coup d'État 2 décembre 1851.jpg* | Gallica / 1853 print; keep artist and source attribution |
| `ill_fra_commune_1871` | Ménilmontant barricade photograph | Commons page describes the public-domain historical work; verify exact reproduction and file rights |
| `ill_fra_exposition_1889` | Eiffel Tower / 1889 exposition photograph | Anonymous historical work; Commons page states EU and US public-domain bases |
| `ill_fra_dreyfus_1895` | Henri Meyer / Dreyfus degradation illustration | The supplement was published 13 Jan 1895; it depicts the degradation ceremony of 5 Jan 1895. Preserve Gallica attribution |
| `ill_fra_verdun_1916` | DocAnciens / Verdun 1916 photograph | Page states PD-US and PD-France on its stated basis, but this is not global-rights clearance; keep pending territory review |
| `ill_fra_paris_liberation_1944` | Jack Downey / U.S. Office of War Information photograph | PD-US federal-government basis only; do not infer worldwide or French PD status |

Claude must run the normal Commons re-read/rights gate before media ingestion. Do not relax the existing licence rules. In particular, the Verdun and Paris Liberation candidates remain jurisdiction-sensitive.

## 4. Static checks performed in this session

A read-back audit was run against GitHub at HEAD `e740546861c32f6180c79f88ab20ce6edd7ba379`:

- JSON parse: PASS.
- Root schema and country key: PASS (`story_events_v1`, `FRA`).
- Event count and unique IDs: PASS (59 / 59).
- Bilingual title and narrative fields: PASS for all events.
- Two-choice structure and named timed modifiers: PASS for all event options.
- Modifier keys: all within the allowlist in `docs/spec/STORY_EVENTS_SCHEMA_VI.md`.
- Source references: PASS (no unresolved event source IDs).
- Event-chain targets: PASS.
- Cross-border effect region IDs: PASS against the 1836 region CSV.
- Event image refs: PASS (all seven have candidate records).
- Journal count and journal/event references: PASS; six journals, all milestone IDs resolve, each weight total is 100.
- Duplicate story-selection subjects: none found.

**Not run / not claimed:** `npm run data`, asset ingestion, `npm run content`, runtime simulation, automated test suite, web build, Android Gradle build, APK packaging, device QA, or Claude review. This session did not modify `src/**`, tests, workflows, or release files.

## 5. Required Claude integration checks

1. Inspect `src/engine/systems/storyEvents.ts` and the simulation clock to confirm `trigger.fire_date` is honoured at the intended calendar date. The current engine has documented monthly-clock constraints; make sure date processing cannot skip a mid-month event.
2. Confirm `event_fired` journal semantics are one-shot/event-occurrence semantics and that monthly progress does not keep adding milestone points on every later month after an event is permanently fired. If the engine treats it as persistent, adjust progress conditions or introduce an explicit consumed flag through the engine owner.
3. Run `npm run data`; review all warnings and ensure the complete file is imported. Do not treat this static report as a substitute for data-builder validation.
4. Run the standard image ingestion for the seven candidates with the normal rights gate, then `npm run content`. Keep failed rights cases pending.
5. Play-test France in Historical Mode around 1848, 1851–52, 1870–71, 1914–18, 1940–46, 1954–62 and the modern period. Confirm the VNM counterpart effects do not overwrite territory ownership or fire for an invalid entity state.
6. Review the 1836–1847 and 2025–2026 coverage gaps before calling the France country pack complete.

## 6. Next assigned work

Continue MSG-129 A1 in this exact sequence after FRA:

1. Japan (`JAP`)
2. Qing (`QNG`)
3. Russia (`RUS`)
4. Prussia (`PRU`; never confuse it with `PRS`, Qajar Persia)
5. United States (`USA`)
6. Ottoman Empire (`TUR`)

Each country remains a separate checkpoint: 40–60 events, 3–6 journals, counterpart-country events where relevant, image candidates with provenance/rights notes, static structural audit, and a GitHub handoff before starting the next package.

## 7. Handoff document routing

The three user-named paths `docs/VICTORI3_COMPLETE_GAME_SPEC.md`, `docs/VICTORI3_EXECUTION_PLAN.md`, and `docs/VICTORI3_SIMULATION_ROADMAP.md` were not present at the start of this session (GitHub returned 404). Do not fabricate or create competing duplicate authorities. The active repository continuity sources are `docs/coordination/AI_HANDOFF.md`, `docs/coordination/AI_MESSAGE_BOARD.md`, `docs/roadmap/OPEN_WORK_FOR_CHATGPT_2026-11-24_VI.md`, `docs/roadmap/CLAUDE_EXECUTION_PLAN_VI.md`, and this dated checkpoint report.
