# CG-66 — USA historical story package checkpoint (2026-11-24)

## Delivery

- Country: `USA` — United States.
- Data file: `historical_data/events/story/USA.json`
- Latest data commit: `fbe3b7c0bb60eabad1c86d96f1e6f6e6d5341140`
- **55 historical events, 5 journals, 110 choices and 110 named timed modifiers.**
- 18 source dictionary entries; 79 event-level source references.
- Six event-specific Commons image candidates added to `story_selection.json`; six event refs use the asset ID form `ill_<subject>`. No binary images ingested.

## Coverage

Coverage runs from U.S. recognition of the Republic of Texas (1837) through the 2025 presidential inauguration. Major arcs include territorial expansion and the slavery crisis; Civil War and Reconstruction; industrial regulation; world wars and the New Deal; Cold War and civil rights; Vietnam and Watergate; post-Cold War foreign policy; 9/11, Iraq, the financial crisis, health reform, COVID-19, January 6, 2021, the Dobbs decision, the 2024 election and 2025 inauguration.

The 2024 election entry uses the National Archives Electoral College result (312–226) and the FEC’s official state-certified results source. The 2025 inauguration entry uses the Joint Congressional Committee on Inaugural Ceremonies record.

## Static audit

Read back the package, registry, `src/engine/mods.ts` and image-selection file.

- JSON parses successfully.
- 55 unique event IDs; 5 unique journal IDs.
- All events and journals target existing registry entity `USA`.
- All 55 events have bilingual titles/narratives, exact `fire_date = date_historical`, and dates inside their availability windows.
- 110 choices have bilingual labels; all 110 modifiers have names and positive durations.
- Every effect key matches the engine `MOD_KEYS` allowlist.
- All 79 event source refs resolve to one of the 18 source dictionary entries.
- Six image refs resolve to six unique subjects in `story_selection.json` after the `ill_` asset-ID prefix is removed.
- Five journals include monthly progress, completion/failure/timeout and named timed outcomes.

## Image candidates and rights

Six candidates:
- Perry expedition landing in Japan (1853 lithograph, Library of Congress, no known restrictions; very large master).
- Emperor Meiji portrait (Uchida Kuichi; public domain in Japan and U.S.).
- First Sino-Japanese War photograph (Oomoto, 1894; PD in Japan and U.S.; source details need a second look).
- Japanese soldiers near Chemulpo (1904; PD in Japan and U.S.; publication history caveat).
- Great Kantō earthquake destruction (1923; PD in Japan and U.S.; unknown photographer and Flickr source).
- Japanese aircraft attacking Pearl Harbor (1941; CC0 1.0).

All are candidates only. The ingestion pipeline must re-read Commons metadata, rights and provenance. Create derivatives for large originals and preserve source credits. The 1941 CC0 candidate's secondary hosting record should be checked against the original archival record.

## Historical / engine caveats

- Sources are institutional and scholarly starting points, not claim-level citations for every event. Check exact dates, legal scope, casualty descriptions and causal wording before release.
- The package is authored for the `USA` country ID and uses broad time-based journals; it does not attempt to simulate state-by-state politics or electoral outcomes.
- Exact mid-month dates are evaluated by the monthly event scheduler, not a daily scheduler. Verify delay/window behaviour in runtime.
- No post-2025 event is included; review 2026 coverage if the campaign endpoint requires current-year content.

## Verification boundary

- **Passed:** JSON parse, IDs, registry membership, bilingual fields, modifier allowlist, source refs and image-candidate asset IDs.
- **Not run:** `npm run data`, `npm run content`, media ingestion, tests, simulation, Android build, APK or device QA.
- **Status:** delivered for Claude's integration review; not release-ready or verified in a playable build.

## Next

A1 final country is `TUR` (Ottoman Empire). MSG-129 remains open until Claude completes integration checks and remaining roadmap work is handled.
