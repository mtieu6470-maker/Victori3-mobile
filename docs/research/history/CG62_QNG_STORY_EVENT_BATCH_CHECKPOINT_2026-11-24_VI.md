# CG-62 — Qing (QNG) historical story-event batch checkpoint

- Date: 2026-11-24
- Branch: `ccr-b27f3fb8-epfpd6`
- Assignment: MSG-129 / MSG-126 A1, third country after France and Japan.
- Status: **QNG initial historical data package authored, read back and statically checked; requires Claude data-builder/integration review and further historical fact-checking.** A1 remains IN_PROGRESS.

## 1. Delivered files and commits

- Data: `historical_data/events/story/QNG.json`
  - Initial authoring commit: `2f7d922ff0346f6ff35a33253e8703bee5f360e0`
  - Monthly-window/journal correction: `74a305ae2dedc246e799efed4d48c28a96a27d5e`
  - Image-ref update: `8638289911cade7eb81a2e2319724e969cfcccdd`
  - Final read-back blob SHA: `6a858f5fd44f8361e22e52e3ec60174b4b62b048`
- Image candidates: `historical_data/assets/illustration_sources/story_selection.json`
  - Commit: `3c9b74fce3c1bfff2346a2a0a8bb52a348ae5bc0`
  - Final read-back blob SHA: `fecdc3e9429702aeb84a20fe93c18264a0074aff`
  - Added two event-specific candidates; neither binary has been ingested.

## 2. Package coverage

- **51 historical events**, **4 story journals**, and **3 source-reference entries**.
- Event dates: 1838-12-31 → 1912-02-12.
- Coverage includes the opium crisis and First Opium War; treaty-port order; Taiping civil war; Second Opium War and northern frontier concessions; Tongzhi Restoration and Self-Strengthening; Tianjin crisis; Ryukyu and Ili disputes; Sino-French War; Sino-Japanese War; Hundred Days' Reform and 1898 coup; Boxer crisis and indemnity; New Policies, abolition of examinations, constitutional preparations; Xinhai Revolution and abdication.
- All event text is written specifically for this Qing timeline in Vietnamese and English. Every event has two choices with English labels, and each choice has a named, timed modifier. Journal outcomes also use named timed modifiers.
- Four journals avoid persistent `event_fired` progress milestones. Each advances by 0.5 per month and completes at 100; timeout is 720 months. This deliberately avoids the known risk that a persistent event flag could award the same progress repeatedly.
- Country and event IDs use `QNG`; no region-transfer effect was introduced.

## 3. Static read-back checks

- JSON parses successfully.
- 51 unique event IDs; all prefixed `qng_`.
- All events target `QNG`.
- Every event has two options and every option has a named modifier with a positive duration.
- All event source keys resolve to this file's source dictionary.
- All event `trigger.fire_date` values equal `date_historical`.
- All modifier effect keys are in `src/engine/mods.ts` `MOD_KEYS` allowlist.
- Four journals have valid QNG country bindings, completion/failure/timeout definitions, and named modifier outcomes.
- Two unique image candidate subjects resolve to QNG event IDs and are referenced by their event `image.ref` fields.
- QNG registry entry: `hist_from=1636-01-01`, `hist_to=1912-02-12`, capital `QNG_ZHI`; package ends on the abdication date.

## 4. Scheduler and integration caveats

1. The simulation clock is monthly while many historical dates fall mid-month. To avoid an event becoming permanently unavailable when the next monthly tick is in the following calendar year, each event's availability window and `year_between` condition extend through the following year. `fire_date` remains the exact historical date. Claude must verify that this works with the actual monthly clock and that the delayed first eligible monthly tick is acceptable.
2. The final abdication event is dated 12 February 1912. Because the registry's `hist_to` is also 12 February 1912, Claude must confirm whether the QNG entity is still considered alive when the monthly scheduler reaches the next tick. If not, the final event needs a documented transition hook or a scheduler-compatible date policy; do not silently alter the historical date.
3. The three bibliography/source entries are high-level institutional and academic timeline references, not page-level citations for all 51 beats. Key dates and interpretations still need claim-by-claim source verification, especially lesser-known diplomatic and institutional dates.
4. The two image candidates are candidates only:
   - `Boxer1900.jpg`: Commons identifies the U.S. Army Office of the Chief Signal Officer and U.S. National Archives record 530870; page states U.S. federal-government public-domain basis.
   - `Beijing_Castle_Boxer_Rebellion_1900_ORIGINAL.jpg`: Commons identifies Torajirō Kasai, September 1900, Library of Congress source and U.S. public-domain status. Original is very large (over 50 MB); ingestion should choose a suitable derivative.
   Recheck live Commons metadata, source provenance, dimensions and rights in the normal ingestion pipeline. No assets were downloaded or ingested here.
5. This pack intentionally stops at Qing abdication. Republic of China events belong in the appropriate successor-country package, not under a QNG entity whose registry history ends in 1912.

## 5. Not run / not claimed

No `npm run data`, `npm run content`, automated tests, runtime simulation, Android build, APK packaging or device QA was run. Static JSON/read-back checks are not a substitute for builder validation. This is not release-ready and must not be described as integrated into a playable build.

## 6. Claude integration checklist

- Run `npm run data` and `npm run content`; report warnings and reject unknown fields/IDs.
- Confirm monthly scheduling with mid-month `fire_date`, extended windows and `year_between`.
- Test QNG's final event against registry retirement on 12 February 1912.
- Confirm the four time-progress journals start once, complete as intended and are removed cleanly when QNG retires.
- Recheck each important historical date and claim against primary/institutional sources; enrich source records with precise page/document citations.
- Revalidate Commons candidate rights and ingest only candidates that pass the existing pipeline.
- Run regression, historical simulation and full build before integration acceptance.

## 7. Continuity

- Previous country checkpoint: `docs/research/history/CG61_JAP_STORY_EVENT_BATCH_CHECKPOINT_2026-11-24_VI.md`.
- Previous France checkpoint: `docs/research/history/CG60_FRA_STORY_EVENT_BATCH_CHECKPOINT_2026-11-24_VI.md`.
- Next A1 country: **RUS (Russian Empire)**, then PRU (Prussia, not PRS/Persia), USA, TUR.
- MSG-129 remains IN_PROGRESS until all A1 country packs and integration gates are complete.
