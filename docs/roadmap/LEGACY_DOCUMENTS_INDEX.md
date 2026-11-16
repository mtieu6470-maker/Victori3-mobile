# Legacy documents index — Victori3-mobile

Created 2026-11-16 by owner decision on the review of coordination commit `bd5787f` (decisions 3 and 4). Rules: `docs/coordination/AI_COLLABORATION_PROTOCOL.md`; status index: `docs/coordination/AI_HANDOFF.md`.

## Canonical roadmap

| Field | Value |
|---|---|
| Canonical roadmap path | none committed |
| Status | `PENDING_OWNER_APPROVAL` |
| Next step | After owner approval, the roadmap is committed (proposed path `docs/roadmap/MASTER_ROADMAP.md`, or another owner-approved path) and its commit SHA is recorded here and in `AI_HANDOFF.md` |

No document listed below is the canonical roadmap or a phase specification.

## How to read these documents

- Each document keeps its original text and conclusions; nothing here rewrites or renumbers it.
- Stage/phase/step numbers inside them are **historical local numbering**. They are **not** the S0–S23 stages of the overall roadmap, even where names look alike ("giai đoạn 1", "S1", "bước 2"…).
- They are **evidence and reference**, not authorization to implement anything. Where they conflict with an owner decision or the canonical roadmap (once committed), the owner decision/roadmap wins.
- Counts and percentages in them are values reported at the time; they were not re-verified when this index was written.

## Index

| Document | Added (commit, date) | Original purpose and scope | Local numbering | Classification |
|---|---|---|---|---|
| `docs/research/PASS16_REPO_AUDIT.md` | `c3e2079`, 2026-11-15 | Audit of the repository against the feature matrix of the "Pass 16" research package (have / partial / missing, with evidence paths); §6 proposes an order of work | §6 "Lộ trình đề xuất", steps 1–6 | Historical evidence / reference |
| `docs/audit/REPO_AUDIT_VS_SPEC.md` | `93c264b`, 2026-11-16 | Audit of the repository against the earlier "Đặc tả tái cấu trúc toàn diện" (comprehensive restructuring specification), recorded before restructuring work | Stages ("giai đoạn") 1–15 of that specification (its §27), with what that batch did per stage | Historical evidence / reference |
| `docs/content/PHASE_REPORT_IDENTITY.md` | `26b6369`, 2026-11-16 | Report on identity/content work: audit, entity catalogue, Asset Registry, images and descriptions, national identity and characters; simulation systems unchanged | Stages 1–5 of that same earlier specification | Historical evidence; the work it reports is `PRE_PROTOCOL_IMPLEMENTED_REPORTED` (register below) |
| `docs/architecture/PROVINCES_BUILDINGS_MILITARY.md` | `2240a8f`, 2026-11-16 | Domain/architecture proposal for provinces, settlements, buildings and military, written before any code | Vertical slices S1–S15 (local; not roadmap S1–S15) | **Legacy proposal, non-authoritative** — notice at the top of the file lists its known conflicts |

Related audit evidence (not roadmaps, listed so they are not mistaken for one): `docs/audit/MASTER_SPEC_AUDIT.md` (`2240a8f`, audit against MASTER_SPEC_VI with Implemented/Partial/Placeholder/Missing per section and a priority conclusion); `docs/audit/GLOBAL_COVERAGE.md` and `docs/audit/coverage.json` (scores produced by the project's own scoring rules, not an objective completion percentage); `docs/audit/CATALOGUE_GAPS.md`.

## Pre-protocol work register — earlier stages 1–5 (identity/content)

Classification: **`PRE_PROTOCOL_IMPLEMENTED_REPORTED`** — historical work with reported commits/tests, not yet assessed under the new stage-gate protocol. Not `REVIEW_PASS`, not `ACCEPTED`. The S0 audit treats it as part of the current baseline, verifies what is actually present at the frozen SHA, and does not reimplement it merely because it predates the protocol.

Commits as listed in `docs/content/PHASE_REPORT_IDENTITY.md` (full SHAs and subjects from `git log`):

| Commit | Date | Subject | Main paths |
|---|---|---|---|
| `2af632ad54d84df00d3996c5f0921b739a2f50e9` | 2026-11-16 | Design system v4 spec and redrawn duotone icon set (24 grid, 1.6 stroke) | `docs/ui/UI_DESIGN_SYSTEM.md`, `src/ui/components/` (listed in the report as carried over from an earlier request) |
| `93c264b737e09366b1e3e5471b13f76463c1e5a2` | 2026-11-16 | Phase 1 audit: global coverage report and repo audit against the restructuring spec | `tools/audit/coverage.ts`, `tools/audit/regions.ts`, `docs/audit/GLOBAL_COVERAGE.md`, `docs/audit/coverage.json`, `docs/audit/REPO_AUDIT_VS_SPEC.md` |
| `c0dd1e2f769c57b44ea6296346f6ce5fb143f8fd` | 2026-11-16 | Phase 2 catalogue: link entities to Wikidata with 1836 checks; list catalogue gaps | `historical_data/identity/wikidata_links.json`, `historical_data/identity/wiki_titles.json`, `tools/etl/link_entities.py`, `tools/etl/wiki.py`, `tools/audit/catalogue_gaps.py`, `docs/audit/CATALOGUE_GAPS.md` |
| `2f891970f536865e4b0714adc1c6ce300b48593f` | 2026-11-16 | Content pack pipeline and identity UI (flags, arms, portraits, sourced texts) | `tools/build-content.ts`, `tools/etl/` (assets, fetch_identity, fetch_portraits, fetch_texts, link_people, contact_sheet), `src/ui/game/content.ts`, `src/ui/components/identity.tsx`, `src/ui/screens/`, `docs/content/ASSET_REGISTRY.md` |
| `0d5f3f69b79c318987024673cb214d9eab23a491` | 2026-11-16 | Identity content: 275 period-checked flags and coats of arms for 122 entities | `public/content/identity/`, `historical_data/assets/identity_assets.json`, `historical_data/assets/review.json` |
| `22e3f78ca027fab87e044f4956c8eeab7ab6758e` | 2026-11-16 | Sourced descriptions for 265 entities (142 in Vietnamese); content integrity tests | `historical_data/identity/texts.json`, `historical_data/identity/local_names.json`, `tests/content.test.ts` |
| `71ae0ee34ae895a929df863c5e9c56c1e4caf54c` | 2026-11-16 | Date-aware name Viet Nam / Dai Nam (1839); Vietnamese licence note; scroll option for UI shots | `tools/build-content.ts`, `src/ui/game/`, `tools/ui-shots.ts` |
| `3617c0a354d32c4f00faa945b3641b5c45e18b35` | 2026-11-16 | Characters: 479 person records, 278 linked to Wikidata, 225 licensed portraits, biographies | `historical_data/identity/people_links.json`, `historical_data/assets/portrait_assets.json`, `public/content/portraits/` |
| `e9fcd4752d15e43dc54aa11ab82be4f8f35b2d06` | 2026-11-16 | Merge duplicate person records (e.g. 'Minh Mang' and 'Minh Mang (Nguyen Phuc Dam)') | `tools/etl/link_people.py`, `historical_data/identity/people_links.json`, `public/content/portraits/` |
| `26b6369fcaad9d342a9a62a03b07983321844670` | 2026-11-16 | Phase report for identity content with native-resolution screenshots | `docs/content/PHASE_REPORT_IDENTITY.md`, `docs/content/screenshots/` |

Evidence paths:
- Report: `docs/content/PHASE_REPORT_IDENTITY.md`; asset registry: `docs/content/ASSET_REGISTRY.md`; manual review log: `historical_data/assets/review.json`.
- Tests: `tests/content.test.ts` (the report states 7 tests). CI on later commits ran the whole suite: run `43793446130` on `2240a8f` and run `43814108497` on `bd5787f` each report `Tests 58 passed (58)` across 5 test files. These are CI results, not an assessment under this protocol.
- Screenshots: `docs/content/screenshots/` (21 files: C01–C11, C13–C19 landscape, P01–P03 portrait). The report states they were captured from the production build in desktop Chromium (SwiftShader), **not** on an Android device.
- Audit outputs: `docs/audit/GLOBAL_COVERAGE.md`, `docs/audit/coverage.json`, `docs/audit/CATALOGUE_GAPS.md`, `docs/audit/catalogue_gaps.json`.

Points for the S0 audit to verify, not to resolve here:
- Reported counts differ between commit subjects and the report (persons 479 vs 473, Wikidata-linked persons 278 vs 275, portraits 225 vs 227). Commit `e9fcd47` merged duplicate person records after `3617c0a`; the values at the frozen SHA must be measured, not taken from either source.
- The open issues listed in the report (section "Vấn đề còn tồn tại") remain open unless the S0 audit finds otherwise.
