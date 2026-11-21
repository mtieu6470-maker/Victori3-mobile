# CG-07 — Source register plan for historical data 1937–2026

Research date: 2026-11-22. Scope: source discovery/licensing plan, not a completed country-year dataset. Every value ingested must carry value, unit, year/date, geographic scope, source author/organization, dataset/title, exact URL, page/table/variable, accessed date, method, license, confidence and temporal validity. Unknown remains unknown; missing must never become zero.

## 1. Candidate source register

| Domain | Candidate source | Coverage/usefulness | License/rights | Confidence and limitations |
|---|---|---|---|---|
| GDP per capita and population | Maddison Project Database 2023, Groningen/DataverseNL: https://research.rug.nl/en/datasets/maddison-project-database-2023/ | 169 countries/aggregate regions, long-run series through 2022 | Release record identifies CC BY 4.0; attribution and citation rules apply; verify exact release record before redistribution | Strong candidate; estimates and country coverage gaps; not provincial GDP |
| Modern GDP/population | World Bank WDI: https://databank.worldbank.org/source/world-development-indicators | Modern country-year macro series | World Bank dataset terms generally CC BY 4.0; confirm exact terms per series | Useful for modern era, not a full source for 1937–1960 |
| Political regime/democracy | V-Dem Dataset v16: https://v-dem.net/data/the-v-dem-dataset/ | Country-year and country-date indicators; v16 published March 2026 | CC BY-SA 4.0; attribution and share-alike obligations | Expert-coded estimates with uncertainty; not a single authoritative regime label |
| State-system membership | Correlates of War State System Membership codebook: https://correlatesofwar.org/wp-content/uploads/State-System-Membership-Codebook-V2024.pdf | Year-by-year state-system membership and major-power periods | Verify project license before redistribution | Useful for polity existence/recognition, not complete border polygons |
| Political boundaries | Natural Earth: https://www.naturalearthdata.com/about/ and https://www.naturalearthdata.com/about/terms-of-use/ | Modern generalized borders, rivers, lakes, coastlines and map layers | Public domain per Natural Earth terms | Not historical borders; modern lines cannot be projected backward as historical truth |
| Historical boundaries | CShapes / CShapes 2.0 (candidate; official source/license review pending) | Candidate for historical state borders | Exact license/version must be verified before use | Temporal resolution and definition of state borders require review |
| Conflict events | UCDP/PRIO (candidate; dataset-specific license review pending) | Modern armed-conflict event/actor series | Verify dataset-specific terms | Not a general historical event timeline |
| National leaders | Archigos / WhoGov / official archives (candidate) | Leader tenure and political transitions | Per-dataset license and coverage vary | Separate head of state/government, interim cabinets, regencies and disputed claims |
| Population detail | National statistical offices, UN WPP and census archives | Population/census series, sometimes age/sex | Dataset-specific rights | Census intervals and changing borders complicate interpolation |

Evidence:
- Maddison record: https://research.rug.nl/en/datasets/maddison-project-database-2023/
- V-Dem v16/license FAQ: https://v-dem.net/data/the-v-dem-dataset/ and https://v-dem.net/about/faq/
- Natural Earth public-domain terms: https://www.naturalearthdata.com/about/terms-of-use/
- COW State System Membership: https://correlatesofwar.org/wp-content/uploads/State-System-Membership-Codebook-V2024.pdf

## 2. Temporal schema proposal

Use stable polity_id, valid_from, valid_to, observed_at, source_release, source_geo_id, geo_crosswalk_version, value, unit, method, confidence, missing_reason, license_id, attribution_text, redistribution_allowed, modification_allowed and supersedes_record_id.

For borders, use temporal polygons with topology checks. Store sovereignty, de facto control, claim and occupation separately. A country-year table cannot represent mid-year partitions, annexations, occupations or disputed claims.

## 3. Known gaps

- 1937–2026 GDP/population coverage varies by source and territorial definition.
- National GDP per capita cannot be used as exact provincial GDP.
- Regime classification should triangulate V-Dem indicators, constitutional/official evidence and source notes.
- Leader data needs separate offices and exact effective dates.
- Borders need de facto, de jure, colonial, occupied and disputed representations.
- No values were ingested in this task; this is a source register only.

## Open questions / conflicts

- Exact license terms for COW, CShapes, UCDP/PRIO and national archives must be verified before redistribution.
- Maddison is an estimate series; do not convert it to exact nominal GDP without methodology.
- V-Dem CC BY-SA 4.0 imposes share-alike obligations on derivatives; owner/Claude must decide compatibility with data-pack licensing.
- Modern Natural Earth borders must not be silently projected backward.

## Recommended acceptance tests

1. Every imported record has source version, URL, units, method, date and license.
2. Missing values remain unknown with a reason.
3. Polity IDs remain stable across split/merge.
4. Border polygons pass topology and temporal overlap checks.
5. Sovereignty, control, claim and occupation are separate.
6. V-Dem-derived material preserves CC BY-SA attribution/share-alike.
7. Every game value traces back to source row/table.
