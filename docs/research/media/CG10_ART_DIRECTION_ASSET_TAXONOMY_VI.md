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
| Buildings (2D only) | farms, mines, mills, factories, ports, railways, government, housing, landmarks | building type, era, region, viewpoint, sprite LOD, dimensions, provenance |
| Ships (2D only) | sailing vessels, ironclads, battleships, cruisers, transports, submarines, auxiliaries | ship class, navy, date range, sprite angle/state, LOD, source, license |
| Clothing/uniforms | civilian classes, occupations, regional dress, army/navy uniforms | class, region, era, context, provenance |
| Maps/terrain | borders, coastlines, rivers, terrain, sea regions, ports | dataset version, scale, CRS, date, license, processing |
| Illustrations | journal/event cards, loading scenes, political movements, inventions | event/entity ID, author, original/derivative status, rights |
| Animation/video | industrial activity, city growth, seasons, ships, battles, events | dimensions, fps, duration, codec, author, rights |
| Audio | music, regional ambience, machinery, city, naval and battle SFX | composer/performer, recording rights, composition rights, format |
| UI iconography | goods, professions, laws, institutions, map lenses, commands | semantic ID, original author, source project, license |

Coverage matrix must be measured across polity, region, era, class and gameplay system; a few showcase countries are not global coverage.

## 3. Required metadata schema

Every asset record must include:
asset_id, title, creator, source_url, source_title, date_created, depicted_date, region, entity_id, resolution_or_duration, pixel_density, sprite_lod, camera_angle, animation_frames, format, license_exact, attribution_text, modification_allowed, redistribution_allowed, commercial_use_allowed, provenance, confidence, classification, checksum and reviewed_at.

For images depicting historical people, record identity only when source metadata is reliable. For ambiguous portraits, preserve unknown identity instead of guessing.

## 4. Rights and source rules

- Natural Earth map data is public domain under its official terms: https://www.naturalearthdata.com/about/terms-of-use/ . This is a viable map/terrain source, subject to dataset version and processing provenance.
- V-Dem data is CC BY-SA 4.0: https://v-dem.net/about/faq/ . This is not a default asset source; share-alike obligations must be compatible with the project's data pack.
- Maddison Project Database 2023 record: https://research.rug.nl/en/datasets/maddison-project-database-2023/ . Its data license/citation requirements must be carried with every derived economic series.
- Steam Community screenshots/art/videos are user uploads with per-item rights. No license means no redistribution.
- Paradox game art, UI, portraits, ship models, music, sounds, screenshots and video frames are not distributable unless explicit rights are granted.
- Generated concept art is not historical evidence and must not be described as an authentic archival image.

## 5. Revised 2D-only 4–5 GB content budget (estimate, not measured)

**Architecture constraint:** no 3D building meshes, ship meshes, skeletal 3D characters or 3D scene assets. World presentation uses a 2D/WebGL map. Buildings and ships are original high-resolution 2D illustrations/sprites with multiple LODs, zoom states and (where valuable) a small number of animation frames. Videos and audio are included as optional high-value content packs.

| 2D asset group | Estimated installed footprint | Planned content |
|---|---:|---|
| World map base and WebGL map layers | 450–600 MB | vector boundaries, coastlines, rivers, terrain color/relief textures, sea zones, map labels, zoom-tier tiles |
| Map overlays and regional detail | 180–280 MB | political/economic lenses, province/state overlays, ports, rail and infrastructure visual layers |
| Building illustration library | 800–1,050 MB | high-resolution 2D building illustrations, regional/era variants, day/night variants, 3–4 sprite LODs per major family |
| Ship illustration/sprite library | 220–340 MB | ship classes by era, side/top/angled views, fleet-size states, damage/blocked/underway frames and LODs |
| Portraits, flags, heraldry and uniforms | 350–500 MB | leaders, generals, IG/agitator portraits, polity flags, military/naval flags and uniform variants |
| Event/journal/landmark illustrations | 180–260 MB | event cards, journal art, inventions, political movements, landmarks and loading illustrations |
| Video/cinematic loops | 700–900 MB | short optional 2D/parallax scenes for industrialization, cities, ports, rail, naval movement and major events |
| Music | 300–420 MB | regional/era music sets, compressed and streamed rather than loaded all at once |
| Ambience and sound effects | 140–220 MB | city, industry, transport, weather, naval and battle ambience/SFX |
| UI, icons, fonts and localization | 90–140 MB | original icon atlas, goods/profession/law symbols, UI illustrations, fonts and language strings |
| Historical data, events and metadata | 100–160 MB | source-backed structured data, journal/event definitions and asset manifests |
| **Total planning envelope** | **3.51–4.87 GB** | target approximately **4.3–4.6 GB** after deduplication and compression |

All figures are **estimates**. They are not measured build sizes and do not claim assets already exist. The final size must come from generated pack manifests and a real device install. The project must not inflate the download with duplicates or unlicensed game captures just to meet 4–5 GB.

### 2D production and runtime rules

- Map: use WebGL for rendering, but keep source geometry/vector data separate from generated raster/texture tiles. Cache only active zoom/region tiles.
- Buildings: create original 2D illustrations with consistent camera angle, lighting and scale; generate LOD tiers (thumbnail, normal, detail, close-up) rather than 3D meshes.
- Ships: use 2D sprites/illustrations with explicit class, era, angle, fleet-size and damage state. Avoid per-ship 3D rendering.
- Characters: use layered 2D portrait variants; do not generate a full 3D character rig.
- Video: optional cinematic packs, not mandatory for core simulation. Prefer short loops and device-supported codecs; stream/decode on demand.
- Audio: use compressed OGG/Opus/AAC where platform support and licensing allow; stream long tracks and avoid loading the full soundtrack into RAM.
- Images: prefer AVIF/WebP where supported with PNG fallback for transparency; use atlases for small UI sprites; preserve source masters separately.
- LOD: choose by zoom level and device capability. Do not decode high-resolution art for map zoom levels where it is not visible.
- Deduplication: shared assets referenced by content IDs; never package repeated copies for each country or era.
- Memory: decode only visible/current assets, release off-screen bitmaps, and keep a low-memory profile for Android.

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
