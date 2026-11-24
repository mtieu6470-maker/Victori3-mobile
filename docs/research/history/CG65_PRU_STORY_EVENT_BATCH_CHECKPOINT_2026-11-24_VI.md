# CG-65 — PRU / Phổ A1 historical story package checkpoint (2026-11-24)

## Delivery

- Country: `PRU` — Kingdom of Prussia (Phổ), **not** `PRS` (Persia).
- Data file: `historical_data/events/story/PRU.json`
- Package commit before this checkpoint: `f625918798121bac5482fc3dc14ad31bebf07e1c`
- Branch: `ccr-b27f3fb8-epfpd6`
- **60 historical events, 5 story journals, 120 choices, 120 timed modifiers.**
- 12 source dictionary entries; 71 event-level source references.
- Six event-specific Commons image candidates added to `story_selection.json`; six event `image.ref` values point to those exact candidate subjects. No binary images ingested.

## Coverage

The pack follows Prussia from the 1837 separation of the British and Hanoverian crowns through the 1848 revolution, constitutional conflict, the 1860s wars of unification, the North German Confederation, the German Empire, Kulturkampf, social legislation, industrial/naval policy, World War I and the November 1918 revolution.

It deliberately distinguishes:
- Prussia as a sovereign kingdom before 1871;
- Prussia as the dominant federal state within the German Empire after 1871;
- the end of the Prussian monarchy in November 1918.

Events use the existing registry ID `PRU` and do not create a new Germany country ID. Region effects were avoided where a new territorial ownership transfer could not be represented safely by this data-only package.

## Static audit

Read back the committed JSON, current registry, `regions_1836.csv`, engine `MOD_KEYS`, and `story_selection.json`.

- JSON parses successfully.
- 60 event IDs and 5 journal IDs are unique.
- All 60 events target existing registry entity `PRU`.
- All event `trigger.fire_date` values equal `date_historical`; each date is within its availability window.
- All 120 options have bilingual labels and a named, positive-duration modifier.
- All modifier keys match the actual `MOD_KEYS` array in `src/engine/mods.ts`; no unknown modifier keys remain.
- All 71 event source references resolve to the package source dictionary.
- All six event image refs resolve to six unique subjects in `story_selection.json`.
- Five journals have historical-mode triggers, monthly progress, completion/failure/timeout and named timed outcomes.
- No unknown country/region references were introduced by this package.

## Historical source basis

The source dictionary includes:
- German History in Documents and Images (GHDI): Vormärz/1848 context; Bismarck's 1862 speech; unification 1866–1871; Nikolsburg preliminary peace.
- Deutsches Historisches Museum (DHM/LeMO): Kulturkampf, internal politics, anti-socialist law and social insurance.
- German Bundestag: Empire 1871–1918 and November 1918 revolution.
- Bundeszentrale für politische Bildung: proclamation of the German Empire.
- Encyclopaedia Britannica: broad context for Germany 1871–1918.

These are credible research starting points, not claim-level footnotes for all 60 events. The dates, actor descriptions, Prussian-vs-imperial scope, and causal wording still require an independent historical review before release.

## Known engine/data caveats

1. The runtime dispatches story events monthly and permits at most one event per country per month. Two PRU event pairs share a historical month: March 1848 and September 1862. They are sorted chronologically in the file; later same-month events may be delayed to a subsequent monthly tick. Confirm actual tick dates and ensure windows remain open.
2. Several exact historical dates fall mid-month. The engine's `fire_date` check is `today >= fire_date`, but dispatch is monthly. This means firing can occur at the next monthly invocation rather than on the exact day. It is not a daily historical clock.
3. The final event is dated 9 November 1918, the registry's `PRU.hist_to` date. Verify entity eligibility/retirement ordering at that monthly tick; do not silently change the historical date.
4. The image candidates are Commons file-page candidates, not approved assets. The six candidates include a high-resolution Library of Congress Sedan image and files whose provenance/territorial status must be rechecked by the ingestion tool. Use derivatives for large originals and preserve credits.
5. The journals use time-based monthly progress, avoiding repeated awards from persistent `event_fired` conditions. They are broad campaign journals, not milestone-complete historical achievement trees.

## Verification boundary

- **Passed:** static JSON/schema, unique IDs, registry membership, source references, image-candidate references, and engine modifier-key audit.
- **Not run:** `npm run data`, `npm run content`, media ingestion, automated tests, simulation, Android build, APK or device QA.
- **Status:** delivered for Claude's integration review; **not release-ready and not yet verified in a playable build**.

## Next A1 work

Continue in the roadmap order:
1. USA — 40–60 events, 3–6 journals, event-specific image candidates.
2. TUR — 40–60 events, 3–6 journals, event-specific image candidates.

MSG-129 remains IN_PROGRESS until all seven A1 packages (FRA, JAP, QNG, RUS, PRU, USA, TUR) are delivered and Claude completes the required integration checks.
