# CG-52 — Critical finding: current illustration ingester blocks recent CC0/PD assets

Date: 2026-11-24  
Scope: static audit of `tools/media/loc_ingest.py` against MSG-118's 1836–1960 event-image requirements. No ingester code changed because MSG-118 limits this task to story data and `story_selection.json`.

## Finding: unconditional 95-year cutoff defeats explicit open licences

The tool sets `PD_CUTOFF = datetime.date.today().year - 95` (line 23). In 2026, the cutoff is 1931.

- **LoC path:** after accepting the Prints & Photographs rights advisory “No known restrictions on publication” (or “free to use and reuse”), `fetch_loc` still rejects every item with no date or a date on/after 1931 (lines 47–56). That is stricter than the accepted rights advisory and excludes many 1931–1960 archival photographs.
- **Commons path:** `COMMONS_OK` explicitly accepts PD and CC0 templates (lines 39–40), but `fetch_commons` then rejects every file whose year is on/after 1931 (lines 74–78). This rejects CC0 files regardless of licence, as well as later works that are explicitly public domain in the relevant jurisdictions.
- The selection schema's `year` currently acts as the rights-gate date. Keep it as the actual source/work date; do not falsify it to bypass the cutoff.

This means the current ingester cannot deliver many valid images for the game's 1836–1960 period. Examples already researched in the selection register include CC0 photographs of the 1957 Malayan Declaration and 1960s-era documents, PD government photographs from Kenya and Singapore, a PD-Jamaica independence proclamation, and LoC items with “No known restrictions” from the 1930s–1950s. They are blocked by the date check even when their rights basis is explicit.

## Recommended correction (Claude to implement)

1. Parse Commons licence templates into separate classes: `CC0`, `PD-worldwide`, and jurisdiction-specific `PD`.
2. **CC0:** accept regardless of creation year; preserve the actual year and licence statement in provenance.
3. **Public Domain:** do not use one universal 95-year cutoff. Require a defensible PD basis in the source country and the United States (or an explicit worldwide-PD basis). If the page only proves PD in one jurisdiction, leave it pending rather than silently accepting it.
4. **Library of Congress:** if the current item record explicitly says “No known restrictions on publication” or the accepted “free to use and reuse” rights statement, do not add a second arbitrary 95-year cutoff. Preserve the exact advisory and collection credit in the manifest.
5. Keep `event_year` (the event date) separate from `work_year` (the image/document's creation or publication date) in the selection schema. Never set the work year to the event year merely to pass a gate.
6. Keep refusal of NC, fair-use and unresolved rights records. A failed/ambiguous rights check must remain un-ingested.

## Integration note: asset ID resolution

`loc_ingest.py` writes event assets with IDs `ill_<subject>` and type `illustration_event`. The event modal first resolves artwork through `illustrationFor('event', e.id)`, which indexes by type and subject, so this path works. Its fallback `asset(e.image.ref)` will not resolve `ill_evt_<id>` unless an alias is added or the fallback ref is aligned with the generated asset ID. The primary subject lookup is currently sufficient once the asset is ingested.

## Current CG-50/52 status

- **87 authored event records** are present across the story data files, in addition to the 30 pre-existing generic events.
- **82 of 87** authored events currently have a corresponding image reference and selection entry; **24** still need a suitable candidate.
- Image candidates are research candidates, not ingested assets. Do not mark CG-52 complete until the licence gate is corrected, remaining events have suitable images, and the ingester produces manifest assets successfully.


## Follow-up after CG-50 data integrity pass

All 88 authored events now have an `image.ref` plus a matching `illustration_event` selection record. Event image refs are normalised to `ill_<event_id>`, matching the ingester's output asset ID. Five final candidates were added: Malayan Union protest, Hugh Clifford portrait, Jamaica labour-context image, Westminster statute-associated coat of arms, and a CC0 1956 Commonwealth conference group photo including Ceylon's prime minister. The Jamaica image is explicitly contextual, not a direct strike photograph.

A separate simulation-integrity pass found that several decolonisation choices previously created only `base_rights` treaties against future-country IDs absent from the 1836 registry. Those effects could not create the independent country. The data now uses `grant_independence` on represented map regions, with the EIC-side Malaya event added and the post-1937 Irish constitutional event gated on Ireland's actual formation. This remains subject to `npm run data` and in-game validation; territories absent from the map cannot be granted by an event.


The final total is 88 authored events: the original 87-event CG-50 data set plus the EIC-side Malaya independence event. All 88 have matching selection records and image refs. This does not mean images have been ingested or that the Android build has passed.
