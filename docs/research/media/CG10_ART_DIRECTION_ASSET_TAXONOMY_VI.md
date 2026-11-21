# CG-10 — Art direction and asset taxonomy (1836–2026)

Research date: 2026-11-22. Scope: visual planning and provenance framework for Claude/Hydrogen. This document does not claim that assets have been acquired or that the 4–5 GB target is already satisfied.

## 1. Non-negotiable asset classes

- historical_reference: source material for research only; no distribution unless a separate license review permits it.
- concept_reference: moodboards, concept art or generated prototypes; never present as historical evidence.
- distributable_candidate: only assets with explicit permission to redistribute and modify, including commercial use where relevant.

An item with missing/ambiguous rights remains historical_reference or blocked. Age alone does not prove public domain in every jurisdiction. A Steam screenshot/video of Victoria 3 is copyrighted reference material and must not be included in the game.

## 2. Taxonomy by entity and era

| Asset group | Required coverage | Key metadata |
|---|---|---|
| Flags and heraldry | sovereign polities, subjects, colonies, movements, military/naval flags | polity/entity ID, valid-from/to, creator, source, license, attribution |
| Portraits | rulers, ministers, generals, admirals, industrialists, activists, thinkers | person ID, office/role, depicted date, region, creator, rights |
| Buildings | farms, mines, mills, factories, ports, railways, government, housing, landmarks | building type, era, region, materials, reference/distributable class |
| Ships | sailing vessels, ironclads, battleships, cruisers, transports, submarines, auxiliaries | ship class, navy, date range, design source, license |
| Clothing/uniforms | civilian classes, occupations, regional dress, army/navy uniforms | class, region, era, context, provenance |
| Maps/terrain | borders, coastlines, rivers, terrain, sea regions, ports | dataset version, scale, CRS, date, license, processing |
| Illustrations | journal/event cards, loading scenes, political movements, inventions | event/entity ID, author, original/derivative status, rights |
| Animation/video | industrial activity, city growth, seasons, ships, battles, events | dimensions, fps, duration, codec, author, rights |
| Audio | music, regional ambience, machinery, city, naval and battle SFX | composer/performer, recording rights, composition rights, format |
| UI iconography | goods, professions, laws, institutions, map lenses, commands | semantic ID, original author, source project, license |

Coverage matrix must be measured across polity, region, era, class and gameplay system; a few showcase countries are not global coverage.

## 3. Required metadata schema

Every asset record must include:
asset_id, title, creator, source_url, source_title, date_created, depicted_date, region, entity_id, resolution_or_duration, format, license_exact, attribution_text, modification_allowed, redistribution_allowed, commercial_use_allowed, provenance, confidence, classification, checksum and reviewed_at.

For images depicting historical people, record identity only when source metadata is reliable. For ambiguous portraits, preserve unknown identity instead of guessing.

## 4. Rights and source rules

- Natural Earth map data is public domain under its official terms: https://www.naturalearthdata.com/about/terms-of-use/ . This is a viable map/terrain source, subject to dataset version and processing provenance.
- V-Dem data is CC BY-SA 4.0: https://v-dem.net/about/faq/ . This is not a default asset source; share-alike obligations must be compatible with the project's data pack.
- Maddison Project Database 2023 record: https://research.rug.nl/en/datasets/maddison-project-database-2023/ . Its data license/citation requirements must be carried with every derived economic series.
- Steam Community screenshots/art/videos are user uploads with per-item rights. No license means no redistribution.
- Paradox game art, UI, portraits, ship models, music, sounds, screenshots and video frames are not distributable unless explicit rights are granted.
- Generated concept art is not historical evidence and must not be described as an authentic archival image.

## 5. 4–5 GB content target: planning envelope only

| Pack | Estimated installed footprint | Content rationale |
|---|---:|---|
| World/map/terrain/vector | 250–450 MB | zoom tiers, terrain, coast, borders and sea regions |
| Buildings/cities/ships 3D + textures | 900–1,300 MB | original models, regional/era variants, LODs |
| Portraits/flags/heraldry/event illustrations | 450–700 MB | coverage across all playable polities and eras |
| Animation/video loops | 700–1,000 MB | high-value industrial, city, naval and event scenes |
| Music/ambience/SFX | 250–450 MB | region/era layers and loopable soundscapes |
| Localization/fonts/UI | 80–160 MB | language packs and interface resources |
| Historical data/events/journal metadata | 150–300 MB | structured source-backed content |
| Optional high-quality reserve | 300–500 MB | optional quality tiers and future expansion |
| Total planning range | 3.08–4.86 GB | must be measured from real pack manifests |

These are estimates, not measured requirements. Never add duplicates, low-value files or copyrighted references merely to hit a size target. Use mesh/texture LOD, texture compression, mipmaps, efficient audio/video formats and device decode compatibility tests.

## 6. Content-pack delivery

- APK contains engine, UI, bootstrap manifest, small fallback assets and downloader.
- Packs are versioned, hash-verified and installed only after explicit user consent.
- Manifest includes pack ID, semantic version, minimum engine version, dependencies, file size, SHA-256, license bundle and provenance index.
- Support regional, language and optional cinematic packs.
- Download to temporary storage, verify hash/schema, then atomically activate. Preserve previous working pack for rollback.
- No automatic mobile-data download and no paid hosting/provider without owner approval.
- Offline play must work after the selected packs are installed.

## Open questions / conflicts

- Actual 4–5 GB distribution must be justified by measured high-quality assets; this planning table is not evidence of completion.
- Exact video codec/device decode support and iQOO storage/thermal impact require physical-device testing.
- Public-domain status is jurisdiction-specific for historical photographs/portraits; item-level review remains mandatory.
- The project must decide whether CC BY-SA-derived historical data can be mixed into its overall content pack.

## Recommended acceptance tests

1. Every shipped asset has exact source, rights, attribution and checksum.
2. No unknown-license item is distributed.
3. Asset packs pass hash/signature/schema validation.
4. Interrupted downloads resume safely and failed updates roll back.
5. Saves remain valid when optional packs are removed.
6. Device free-space checks occur before download/install.
7. Base game remains usable without optional cinematic packs.
8. Actual installed footprint is computed from manifest, not estimated.
