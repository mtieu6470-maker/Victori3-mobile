# CG-67 — TUR / Ottoman Empire A1 historical story package checkpoint (2026-11-24)

## Delivery

- Country: `TUR` — Ottoman Empire, using the existing registry ID (no new Turkey ID).
- Data file: `historical_data/events/story/TUR.json`
- Latest data commit: `3c9e3f122ff464c2dff6b89d7e52d386376ceb5f`
- **47 historical events, 4 journals, 94 choices and 94 named timed modifiers.**
- 9 source dictionary entries; 84 event-level source references.
- Six event-specific Commons candidates added to `story_selection.json`; six event refs use `ill_<subject>`. No binary images ingested.

## Coverage

1839–1922: Tanzimat, the Egyptian crisis and Straits regime, Crimean War, reform edicts, fiscal default, constitutional experiments, Russo-Ottoman War, Berlin settlement, centralisation under Abdülhamid II, debt administration, Egypt, Armenian mass violence, Greco-Ottoman and Balkan wars, Young Turk Revolution, CUP consolidation, Libya, alliance with Germany, World War I, Gallipoli, Armenian deportations and mass atrocities, Arab Revolt, Mudros, Allied occupation, nationalist resistance, Ankara Assembly, Sèvres, Sakarya, Great Offensive, Mudanya and abolition of the sultanate.

## Static audit

Read back the package, registry, `src/engine/mods.ts` and `story_selection.json`.

- JSON parses successfully.
- 47 unique event IDs and 4 unique journal IDs.
- All events/journals target registry entity `TUR`; all event dates are on or before registry `hist_to = 1922-11-01`.
- All event `fire_date` values equal `date_historical` and lie inside their availability windows.
- 94 choices have bilingual labels and named timed modifiers; all effect keys match `MOD_KEYS`.
- All 84 source refs resolve to the 9 source dictionary entries.
- Six event image refs resolve to six unique candidate subjects through the `ill_` asset-ID convention.
- Four journals include monthly progress, completion/failure/timeout and named timed outcomes.

## Historical and integration caveats

1. The final event, abolition of the sultanate on 1 November 1922, is exactly the registry's `TUR.hist_to`. Verify whether the monthly scheduler evaluates the event before entity retirement. Do not silently move the historical date.
2. Two events fall in May 1919 (Greek landing at Smyrna and Mustafa Kemal's arrival at Samsun). The engine allows at most one event per country per month; the second event may be delayed to a later monthly tick. Test the chain/order and window.
3. The Armenian mass violence/deportation entries use careful wording and identify the Armenian Genocide classification used by many scholars. Verify source quality and historical language independently; do not flatten the distinction between deportation orders, mass killing and the broader genocide.
4. Several source entries are scholarly overviews or chronology references, not claim-level citations for all events. Validate dates, transliteration, provincial scope and causal claims.
5. The six image candidates have distinct rights notes. In particular, check the Japanese soldiers near Chemulpo publication history and the attribution/territorial status of the last-sultan portrait. All are candidates only.

## Verification boundary

- **Passed:** JSON, IDs, registry membership, event dates/windows, modifier allowlist, source refs and image-candidate asset IDs.
- **Not run:** data/content builders, media ingestion, automated tests, simulation, Android build, APK or device QA.
- **Status:** delivered for Claude's integration review; not release-ready or verified in a playable build.

## Next

This is the seventh A1 country pack. A1 authoring is now 7/7 delivered. Claude still needs to review, ingest media, run builders/tests/simulation and validate the playable build before A1 can be called accepted.
