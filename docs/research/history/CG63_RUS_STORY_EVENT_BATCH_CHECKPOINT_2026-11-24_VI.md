# CG-63 — Russian Empire (RUS) historical story-event batch checkpoint

- Date: 2026-11-24
- Branch: `ccr-b27f3fb8-epfpd6`
- Assignment: MSG-129 / MSG-126 A1, fourth country after France, Japan and Qing.
- Status: **RUS initial historical data package authored, image candidates attached and statically checked; requires Claude builder/integration review and historical fact-checking.** A1 remains IN_PROGRESS.

## 1. Delivered files and commits

- Data: `historical_data/events/story/RUS.json`
  - Initial authoring commit: `bf32b6b75266e4042d07d8a507b006d8cbb1f9de`
  - Image-reference update: `1cfcb140e341d96067d05172dccad8b712d88995`
  - Final read-back blob SHA: `2956abb485542f5ae7faae594e41eb8fa8643fcd`
- Image candidates: `historical_data/assets/illustration_sources/story_selection.json`
  - Commit: `b65104e64a5989a5956cb01e2cb7ad5f9dd57144`
  - Final read-back blob SHA: `43ea850651001bd838f03606dabfd03360913e8a`
  - Three event-specific candidates added; no binary files ingested.

## 2. Package coverage

- **54 historical events**, **5 story journals**, and **5 source-reference entries**.
- Event dates: 1837-02-10 → 1917-03-15.
- Coverage: Nicholas I's autocracy and intellectual debates; the Crimean War; Alexander II and the Great Reforms; emancipation, zemstvo and judicial reform; Caucasus and Far Eastern expansion; Russo-Ottoman War; Alexander II's assassination and the reaction; famine and Trans-Siberian railway; Nicholas II; industrialisation and revolutionary movements; Russo-Japanese War and Revolution of 1905; Duma and Stolypin reforms; First World War, Brusilov Offensive, February Revolution and abdication.
- Every event has original Vietnamese and English narrative, two options with English labels and a named timed modifier on each option. The five journals use time-based progress (+1/month) rather than persistent `event_fired` conditions.
- No region-transfer effect was added. The package ends at the registry's RUS retirement date, 15 March 1917.

## 3. Static read-back checks

- JSON parses successfully.
- 54 unique event IDs; all prefixed `rus_`.
- All events target `RUS`.
- Every event has two options and each option has a named timed modifier with a positive duration.
- All event source keys resolve to the file's source dictionary.
- Every event's `trigger.fire_date` equals `date_historical`.
- All modifier effect keys are in `src/engine/mods.ts` `MOD_KEYS` allowlist.
- Five journals have RUS country bindings, progress, completion/failure/timeout definitions and named modifier outcomes.
- Three unique image candidate subjects resolve to RUS event IDs and are referenced by event `image.ref` fields.

## 4. Historical and integration caveats

1. The source dictionary contains academic/institutional chronology and overview pages. It is a research basis, not page-level proof for every one of the 54 event claims. Verify dates, calendar conventions (Julian vs Gregorian), casualty/context wording and causal interpretations claim by claim.
2. The Russian timeline mixes historical dates commonly published in Gregorian form with events that were contemporaneously recorded in the Julian calendar. The data uses modern Gregorian dates where available; Claude should confirm consistency with the project's historical date convention, especially Bloody Sunday, February Revolution and abdication.
3. The simulation clock is monthly. Availability windows and `year_between` conditions extend through the following year so mid-month `fire_date` events can be considered on the next monthly tick. Claude must verify scheduler behaviour.
4. The final abdication event is dated 15 March 1917, identical to registry `hist_to`. Confirm RUS remains eligible on the next monthly tick; otherwise a documented transition hook/date policy is required. Do not silently change the historical date.
5. Image candidates:
   - `Bloody_Sunday_Russia_1905.png`: Commons identifies a 1925 historical reconstruction and PD-Art reproduction; it is an illustration, not contemporary photography.
   - `Russian_Duma_Members,_1906.jpg`: Commons states U.S. public-domain status; original is approximately 124 MB, so do not ingest as-is. Verify provenance and create a derivative.
   - `The_last_photo_of_Nicholas_II.jpg`: Commons identifies the Library of Congress source but its structured rights status is incomplete; keep provisional until the ingestion pipeline confirms the territorial rights basis.
   Candidates are not ingested binary assets. Recheck live Commons metadata, provenance, size and licensing before use.
6. RUS registry entry is a single entity through 15 March 1917. Events after abdication (Provisional Government, October Revolution and Soviet state formation) must be authored for the successor entity/transition model, not assumed to belong to RUS.

## 5. Not run / not claimed

No `npm run data`, `npm run content`, automated tests, runtime simulation, Android build, APK packaging or device QA was run. Static JSON/read-back checks do not establish successful ingestion or playable integration. This is not release-ready.

## 6. Claude integration checklist

- Run `npm run data` and `npm run content`; report all schema, source and ID warnings.
- Validate monthly scheduling with mid-month dates and the extended windows.
- Test the final RUS abdication event against registry retirement on 15 March 1917.
- Confirm all five journals start once, progress and resolve before the RUS entity retires; test cleanup of active journals on retirement.
- Verify Julian/Gregorian date convention and precise historical claims against primary/institutional sources.
- Recheck image candidate rights and create an appropriately sized Duma derivative; do not ingest provisional candidates without clearance.
- Run regression, historical simulation, full build and Android QA before integration acceptance.

## 7. Continuity

- Previous checkpoint: QNG, `docs/research/history/CG62_QNG_STORY_EVENT_BATCH_CHECKPOINT_2026-11-24_VI.md`.
- Earlier checkpoints: CG61 JAP and CG60 FRA.
- Next A1 country: **PRU (Kingdom of Prussia)** — do not confuse with PRS (Persia); then USA and TUR.
- MSG-129 remains IN_PROGRESS until all A1 country packs and integration gates are complete.
