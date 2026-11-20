# AUDIT — FLAG, COAT-OF-ARMS AND HISTORICAL PORTRAIT DISPLAY

**Task:** IDENTITY-DISPLAY-01  
**Status:** SOURCE/ASSET COVERAGE AUDIT — DESIGN ONLY / NO ASSET OR UI CHANGE AUTHORIZED  
**Baseline:** 77c03554ff11ffa587f5d25064a16b7cd8b8b650  
**Branch:** claude/game-historical-sandbox-modes-kg7rj7  
**Date:** 2026-11-20

## 1. Executive finding

The repository already contains working identity-image rendering components, but historical asset coverage is incomplete. The interface intentionally falls back to a generic country emblem or character monogram whenever the content registry has no matching period-valid asset. Consequently, a player may see no historical flag, dynastic coat of arms or ruler portrait even though the project already contains hundreds of identity assets.

The root cause is not simply a missing UI component. It is a combination of incomplete per-polity coverage, temporal filtering, incomplete portrait coverage, name-sensitive ruler matching, and an entity-link requirement in the content builder.

## 2. Measured repository coverage

Counts were computed from the checked-in identity registries and playable polity registry at the stated baseline.

| Measure | Count |
|---|---:|
| Playable entities in registry | 147 |
| Playable entities linked to identity content | 145 |
| Flag asset records | 176 |
| Coat-of-arms asset records | 99 |
| Portrait asset records | 227 |
| Historical character records | 473 |
| Character records with portrait | 227 |
| Character records without portrait | 246 |

### 2.1 Period-valid symbols

The UI selects only an asset whose recorded period contains the current campaign year.

| Checkpoint | Period-valid flag records | Playable entities with flag | Period-valid arms records | Playable entities with arms | Both |
|---|---:|---:|---:|---:|---:|
| 1836 | 103 | 85 | 86 | 68 | 60 |
| 1900 | 63 | 45 | 50 | 33 | 27 |
| 1936 | 29 | 18 | 10 | 6 | 3 |

At the 1836 start, 62/147 playable entities have no period-valid flag, 79/147 have no period-valid arms, and 87/147 do not have both. This does not mean every decentralized or collective polity should receive a national flag: absence may be historically correct, and must not be filled with a modern or invented symbol.

Coverage declines at later checkpoints because the currently catalogued records are period-specific. The table is a registry coverage snapshot, not a claim that all entities should possess equivalent state symbols.

### 2.2 Portrait coverage

- The character index contains 473 records; 227 have a linked portrait and 246 do not.
- The current ruler portrait appears only if the simulated leader name matches a character record and that record has a portrait.
- Character records without a portrait fall back to a monogram.
- Portrait applicability currently depends on the character link/term rather than a separate asset period; all 227 portrait asset records have null period.from and period.to.

## 3. Rendering path verified in source

1. tools/build-content.ts builds public/content/registry.json from identity links, people links, text records and asset registries.
2. src/ui/game/content.ts lazily loads the content registry and indexes assets, entities and characters.
3. src/ui/screens/common.tsx:Flag() calls symbolFor(entityId, 'flag', year); if no period-valid flag exists, it renders the generic Emblem.
4. src/ui/screens/Country.tsx:IdentityHeader() renders flag, optional coat of arms, and the current ruler portrait if a matching character record has one.
5. src/ui/screens/Country.tsx:People() renders the character catalogue and uses monograms for missing portraits.
6. src/ui/components/identity.tsx:AssetImg() lazily renders an image and switches to the supplied fallback on image error.

This proves the components exist. It does not prove every playable polity or every active ruler has a matching historical asset, nor does it prove successful rendering on a physical Android device.

## 4. Specific display limitations

### 4.1 Period filtering

symbolFor() filters flags and arms by the campaign year. A later national flag is not used to fill an 1836 gap. This is historically correct behavior; the fix is to research an attested period-appropriate symbol, not to remove the date filter.

### 4.2 Unlinked entities

tools/build-content.ts attaches flag and arms lists to an entity content record only when its Wikidata identity link is accepted. An unlinked entity receives empty symbol lists even if a candidate asset exists. Do not weaken identity matching. If a project polity has no reliable Wikidata link, add a separately reviewed stable project-entity mapping.

### 4.3 Name-sensitive character matching

The current ruler portrait path resolves the character by entity ID and leader name. Exact-name/base-name matching can fail on aliases, transliteration, titles, diacritics, or alternate spellings. The robust long-term contract is a stable characterId on the simulated leader, with display names and aliases as metadata.

### 4.4 Content loading diagnostics

The content loader records a failed state after fetch/parse errors, but the inspected People screen primarily distinguishes a null pack from a loaded pack. A failed load can therefore be indistinguishable from a prolonged loading state. The silent symbol/portrait fallback also makes missing data, network failure and genuinely absent historical assets difficult to distinguish. This requires a tested loading/error/retry UI, not blind asset substitution.

## 5. Licensing and phase constraints

The existing S0 asset audit records:
- 492 image records as recorded_not_reverified; their current Commons source/licence metadata has not been independently rechecked.
- 259 records with uncertain period quality and 243 with supported period quality.
- all 227 portrait records have no explicit asset period range; applicability relies on the character record.

The current S0/S1 governance restrictions do not permit casually adding, replacing, editing, repackaging or newly distributing unverified image assets. This audit therefore adds no assets and changes no rendering behavior. Do not scrape or ship additional portraits/heraldry until per-file rights, author, source, period and attribution are reviewed.

## 6. Recommended correction plan after the relevant gate opens

1. Generate a country × year matrix for 1836, 1850, 1870, 1900, 1936 and later approved checkpoints, including asset type, source quality, period confidence and missing reason.
2. Add stable project character IDs to simulated leader records; resolve portraits by ID rather than fuzzy display name.
3. Permit an explicitly reviewed project-entity ID to reference an asset when Wikidata linking is unavailable; never use a guessed identity.
4. Research only period-attested, redistributable images; verify current source page, author, licence, historical period, source statement and checksum before packaging.
5. Make fallback states explicit in UI: distinguish historical flag, coat of arms/dynastic arms, generated game emblem and unavailable portrait.
6. Surface content-pack loading, failure and retry states; validate registry schema and asset paths before rendering.
7. Add tests for every playable entity/year checkpoint, ambiguous names, unlinked entities, out-of-period assets, broken paths, malformed registry, fetch failure and retry.
8. Perform offline Android device QA against the installed APK and record the exact device/build and results.

## 7. Scope and gate

- Source and asset coverage audit only.
- No historical fact, asset, licence metadata, runtime code, test, generated DB, save schema, UI, Android, Gradle, workflow or APK changed.
- No device QA or runtime CI is claimed.
- S0 remains PARTIAL/BLOCKED; S1 remains NOT_STARTED; S22 remains DESIGN_ONLY. This audit does not authorize identity-system implementation or asset acquisition.

## 8. Files inspected

- tools/build-content.ts
- src/ui/game/content.ts
- src/ui/screens/common.tsx
- src/ui/screens/Country.tsx
- src/ui/components/identity.tsx
- src/ui/styles/theme.css
- tests/content.test.ts
- historical_data/assets/identity_assets.json
- historical_data/assets/portrait_assets.json
- historical_data/identity/wikidata_links.json
- historical_data/identity/people_links.json
- historical_data/leaders/heads_of_state.json
- historical_data/political_entities/registry.json
- docs/audit/s0/S0_ASSET_AUDIT.md
