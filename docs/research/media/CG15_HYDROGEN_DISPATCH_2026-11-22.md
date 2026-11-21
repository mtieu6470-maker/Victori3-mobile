# CG-15 — Hydrogen dispatch brief: HY-01 flags and HY-04 map sources first

- Date: 2026-11-22
- Repository: `mtieu6470-maker/Victori3-mobile`
- Required branch for deliverables: `ccr-b27f3fb8-epfpd6`
- Coordinator: ChatGPT (prepares task specification and owner handoff)
- Assigned researcher: Gemini Hydrogen
- Priority order: **HY-01 → HY-04 → HY-02 → HY-03 → HY-05**
- Status: **dispatch brief prepared; direct message not sent**. No Gemini/Hydrogen messaging connector is available in this ChatGPT session. Owner must forward the dispatch below to Hydrogen. Do not mark HY-01/HY-04 complete until Hydrogen's CSVs are committed and reviewed.

## 1. HY-01 — Flags and heraldry for 1836 (first priority)

**Required output:** `docs/research/media/HY01_FLAGS_ARMS_1836.csv`

Scope:
- Use the project's actual polity registry and `docs/audit/GLOBAL_COVERAGE.md` as the authoritative target list.
- One row per polity × flag/arms asset × valid-time interval. Do not invent a flag for a polity without evidence.
- Record the polity's 1836 political status and exact validity interval; flags that changed during 1836 need separate rows only if dates are known.
- Distinguish sovereign state, subject, colony, protectorate, disputed polity, rebel/claimant and non-state movement.
- Separate national flag, civil ensign, state flag, naval ensign, coat of arms and ruler/personal standard. Do not collapse these into one generic “flag”.
- Prioritize exact 1836 status, then 1836–1840 if the source supports a range. If an asset is later than 1836, mark it as anachronistic reference and do not map it as the 1836 flag.

Required CSV columns:

`polity_id,polity_name_1836,political_status_1836,asset_type,valid_from,valid_to,source_url,source_title,creator,rights_holder,license_exact,attribution_text,resolution,format,classification,evidence_source_url,confidence,notes`

Classification:
- `historical_reference`: may be used for research/visual matching only; rights do not permit redistribution or are unknown.
- `concept_reference`: reconstruction/mock-up, not an authenticated historical artifact.
- `distributable_candidate`: only if the exact file's license permits modification and redistribution, including commercial use.
- A source's public-domain statement for one item must not be generalized to the whole website/collection.

Suggested source discovery (item-level review remains mandatory):
- Wikimedia Commons licensing rules: https://commons.wikimedia.org/wiki/Commons:Licensing
- Public-domain guidance: https://commons.wikimedia.org/wiki/Commons:Public_domain
- Rijksmuseum collection / item rights: https://www.rijksmuseum.nl/en/rijksstudio
- Library of Congress Prints & Photographs / maps rights advisories: https://www.loc.gov/rr/print/
- Europeana rights statements: https://www.europeana.eu/en/rights
- National/royal archives and museums for original heraldic/flag evidence.

Quality gates:
1. Every polity ID must resolve against the project registry; report unmatched IDs separately.
2. Every 1836 flag claim needs a source for the design and a source for its date/status where possible.
3. A modern SVG recreation is not itself a historical primary source; record the historical evidence separately from the artwork creator.
4. Never use a generic “Wikimedia license” value. Record the exact per-file license (e.g. CC0 1.0, CC BY 4.0, PD-old-70, PD-US-expired) and attribution.
5. If rights are unclear, classify as `historical_reference`, not `distributable_candidate`.
6. Do not fill unknown polity flags by copying a present-day national flag backwards to 1836.

## 2. HY-04 — Map and terrain sources (second priority)

**Required output:** `docs/research/media/HY04_MAP_SOURCES.csv`

Scope:
- Separate the modern geometric base map, terrain/hydrography data, and historical political boundaries. These are different data layers and can have different licenses and temporal accuracy.
- Natural Earth is the default candidate for modern coastlines, country boundaries and cultural/physical vector layers. It is public domain under its published terms, but it is not an 1836 boundary dataset.
- Historical maps should be used to reconstruct 1836 boundaries only when the individual scan has a clear rights statement and the map's date/author/scale are known.
- A scanned historical map is a reference image; a digitized boundary is a derivative vector and needs its own provenance and processing record.
- Record map projection/CRS, scale, source resolution, geographic extent, date represented and positional accuracy.
- Keep present-day boundaries out of the 1836 historical layer unless a specific segment is documented as unchanged.

Required CSV columns:

`asset_id,layer,dataset_name,version,provider,source_url,source_title,creator,geographic_extent,temporal_scope,scale_or_resolution,crs,format,license_exact,attribution_text,modification_allowed,redistribution_allowed,commercial_use_allowed,classification,processing_notes,confidence,notes`

Suggested source discovery:
- Natural Earth terms: https://www.naturalearthdata.com/about/terms-of-use/
- Natural Earth downloads: https://www.naturalearthdata.com/downloads/
- Library of Congress maps and item rights: https://www.loc.gov/maps/
- David Rumsey Map Collection (check item-specific rights): https://www.davidrumsey.com/
- Europeana rights statements: https://www.europeana.eu/en/rights

Quality gates:
1. Natural Earth is labelled `modern_geometry_base`, not “1836 borders”.
2. Historical boundary claims cite a map/source with date and geographic scope.
3. CRS and map scale/resolution are explicit; no untraceable manual tracing.
4. Rights of scan and rights of digitized derivative are documented separately.
5. Do not use a collection-level public-domain assumption when the item rights differ.
6. Record disputed or low-accuracy boundaries as `disputed`/low confidence rather than silently selecting one.
7. Keep geometry source data separate from generated raster/WebGL tiles so the map can be rebuilt.

## 3. Remaining Hydrogen tasks after HY-01 and HY-04

### HY-02 — Portraits 1836–1936
Output: `docs/research/media/HY02_PORTRAITS_1836_1936.csv`
- Prioritize public-domain portraits or exact CC0/CC BY assets; item-level rights, person identity, depicted date, role and source.
- Do not identify uncertain portraits from resemblance alone.

### HY-03 — Music, ambience and SFX
Output: `docs/research/media/HY03_AUDIO_SOURCES.csv` plus brief.
- Record composition rights separately from sound-recording rights.
- Include exact license, performer/recording owner, duration, format, sample rate and bitrate.
- A public-domain composition does not automatically make a modern recording public domain.

### HY-05 — Buildings and ships reference boards
Output: `docs/research/media/HY05_BUILDINGS_SHIPS_REFERENCES.md`
- Cover farms, mines, factories, mills, ports, railways, sailing ships, steamships, ironclads, battleships and modern vessels across eras.
- Separate historical reference from distributable art; reference boards do not grant game redistribution rights.
- Record date, region, entity/class, source and license.

## 4. Forwardable dispatch message for owner

> Hydrogen, please work on the Victori3 Mobile media research on branch `ccr-b27f3fb8-epfpd6`. Priority order is HY-01 first, HY-04 second, then HY-02, HY-03 and HY-05. Read this dispatch file and `docs/research/media/CG10_ART_DIRECTION_ASSET_TAXONOMY_VI.md` first. For HY-01 use the project polity registry and produce `HY01_FLAGS_ARMS_1836.csv` with exact per-file license, 1836 validity dates and polity IDs. For HY-04 produce `HY04_MAP_SOURCES.csv`; distinguish Natural Earth modern base geometry from historically dated 1836 boundary references. Never claim public-domain or redistribution rights without item-level evidence. Unknown rights = historical_reference, not distributable_candidate. Do not copy copyrighted Paradox assets. Commit each completed CSV to the designated branch and report commit SHA, row count, coverage, unresolved polity IDs and license gaps. Then proceed to HY-02/03/05 in that order.

## 5. Coordinator status and limitation

- No HY-01/HY-04 output files were present in `docs/research/media/` when this dispatch was prepared.
- The current ChatGPT tool set has no direct Gemini/Hydrogen chat or task-submission connector. This file is a complete handoff for the owner to forward; it is not evidence that Hydrogen received or accepted the assignment.
- ChatGPT has not fabricated rows or marked any Hydrogen deliverable complete.
- Owner should return Hydrogen's commit SHA/report for independent review and integration planning.

## Open questions / conflicts

- Does the polity registry expose stable IDs for every 1836 sovereign, subject, colony and disputed polity? If not, Hydrogen must report coverage gaps rather than invent IDs.
- Which historical map sources have item-level commercial redistribution rights for derived boundary vectors? Public-domain scans still need scale/date/accuracy review.
- Does the project want flags by exact day/month in 1836, or one representative date (recommended: 1 January 1836 plus dated changes during the year)?
- Does the project accept CC BY assets with attribution in the distributed credits bundle, or should only CC0/public-domain assets qualify for `distributable_candidate`?

## Recommended acceptance tests

1. HY-01 row count reconciles with the polity registry; every missing polity is explicitly listed.
2. Every flag/arms record has a date interval, source evidence, exact license and classification.
3. No present-day flag is silently backdated to 1836.
4. HY-04 separates modern basemap, physical terrain/hydrography and historical boundaries.
5. Every map source records CRS, scale/resolution, temporal scope and rights.
6. No unclear-license item is classified as distributable.
7. Hydrogen commits HY-01 and HY-04 separately or reports exact commit SHAs for each output.
8. Claude/owner can independently reproduce each asset link and verify its rights statement.
