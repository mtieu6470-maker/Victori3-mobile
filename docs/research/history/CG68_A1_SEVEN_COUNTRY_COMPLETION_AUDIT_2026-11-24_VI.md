# CG-68 — MSG-129 A1 seven-country authoring completion and cross-package audit (2026-11-24)

## Result

**A1 authoring is complete: 7/7 country packages delivered on `ccr-b27f3fb8-epfpd6`.** This is authoring/static-audit completion only. Claude integration acceptance, content build, runtime validation, media ingestion and APK verification remain pending.

| Country | Events | Journals | Choices / modifiers | Image candidates |
|---|---:|---:|---:|---:|
| FRA — France | 59 | 6 | 118 | 7 |
| JAP — Japan | 53 | 6 | 106 | 6 |
| QNG — Qing | 51 | 4 | 102 | 2 |
| RUS — Russian Empire | 54 | 5 | 108 | 3 |
| PRU — Prussia | 60 | 5 | 120 | 6 |
| USA — United States | 55 | 5 | 110 | 6 |
| TUR — Ottoman Empire | 47 | 4 | 94 | 6 |
| **Total** | **379** | **35** | **758 / 758** | **36** |

- 130 total subjects in `story_selection.json`; no duplicate subjects found.
- 451 event-level source references across the seven packages.
- 379 event IDs and 35 journal IDs are globally unique across the seven files.
- All 758 options have named positive-duration modifiers. All effect keys match the 25-key engine `MOD_KEYS` allowlist.
- All event source refs resolve to their package dictionaries.
- All 36 event image refs use the engine asset-ID convention `ill_<subject>` and resolve to a subject in `story_selection.json`.
- All packages target existing registry entities; no new country IDs or source-code changes were made.

## Package checkpoints

- FRA: `docs/research/history/CG60_FRA_STORY_EVENT_BATCH_CHECKPOINT_2026-11-24_VI.md`
- JAP: `docs/research/history/CG61_JAP_STORY_EVENT_BATCH_CHECKPOINT_2026-11-24_VI.md`
- QNG: `docs/research/history/CG62_QNG_STORY_EVENT_BATCH_CHECKPOINT_2026-11-24_VI.md`
- RUS: `docs/research/history/CG63_RUS_STORY_EVENT_BATCH_CHECKPOINT_2026-11-24_VI.md`
- Cross-package import review: `docs/research/history/CG64_CHATGPT_IMPORT_REVIEW_2026-11-24_VI.md`
- PRU: `docs/research/history/CG65_PRU_STORY_EVENT_BATCH_CHECKPOINT_2026-11-24_VI.md`
- USA: `docs/research/history/CG66_USA_STORY_EVENT_BATCH_CHECKPOINT_2026-11-24_VI.md`
- TUR: `docs/research/history/CG67_TUR_OTTOMAN_STORY_EVENT_BATCH_CHECKPOINT_2026-11-24_VI.md`

## Cross-package engine risks

### 1. Persistent journal milestone over-awards

- FRA contains 55 monthly journal progress steps using `event_fired`.
- JAP contains 30.
- **Total: 85 steps in the seven A1 packs.**
- The engine checks whether an event ID remains in `st.storyFired`; it is persistent. If the monthly journal loop awards the progress step every month, those milestones repeatedly award points. Claude must implement one-shot milestone accounting or a reviewed equivalent and add regression tests. Do not mark FRA/JAP journals accepted before this is resolved.
- QNG, RUS, PRU, USA and TUR use time-based progress in their current packages.

### 2. Monthly clock and event scheduling

- **339 of 379 events have a mid-month `fire_date`.** The engine dispatches story events monthly, not daily. These events can fire at a later monthly invocation, not necessarily on their exact historical day.
- Six country-month periods contain two events and therefore compete under the engine's one-event-per-country-per-month cap:
  - JAP: August 1945
  - QNG: November 1908
  - RUS: March 1917
  - PRU: March 1848 and September 1862
  - TUR: May 1919
- Verify the ordering, delay and availability-window behaviour in simulation. The files are sorted chronologically where authoring order was controllable.
- End-of-entity boundaries need explicit tests: QNG 1912-02-12, RUS 1917-03-15, PRU 1918-11-09 and TUR 1922-11-01 coincide with registry `hist_to` dates or final historical windows.

### 3. Historical and image quality

- Static references and schema do not prove that all historical claims are accurate. Source dictionaries contain a mix of official records and broad scholarly chronologies; claim-level review remains required.
- JAP narratives are concise initial bilingual framing and need event-specific enrichment.
- Six image candidates for JAP were added after the original CG-61 report. The six have event-specific refs; rights/provenance still need the standard ingestion gate.
- All 36 image candidates remain source references only. **No image binary was ingested by ChatGPT in this pass.**
- Recheck rights by jurisdiction, source attribution, file size and derivative generation. The PRU, USA and TUR reports document candidate-specific caveats.

## Verification boundary

**Passed:** read-back JSON parsing; globally unique IDs; existing country registry membership; bilingual fields; 2-choice structure; modifier metadata and allowlist; package source references; image asset-ID-to-selection subject mapping; no duplicate selection subjects.

**Not run:** `npm run data`, `npm run content`, image ingestion, automated tests, simulation, Android build, APK packaging or device QA. No successful CI run or playable build is claimed.

## Required Claude integration work

1. Fix one-shot journal milestone semantics for FRA/JAP and add regression tests.
2. Test monthly scheduler behaviour for 339 mid-month events, six month-collision periods and all entity-retirement boundaries.
3. Run `npm run data`, resolve every warning and verify all 379 events / 35 journals are loaded.
4. Run the normal rights-gated image ingestion for all 36 candidates; reject unresolved rights or provenance cases and use derivatives for oversized originals.
5. Run `npm run content`, focused country simulations, the full regression suite, Android build and device QA.
6. Record exact commit, CI run IDs, APK SHA-256 and acceptance status.

## MSG-129 status

- **A1: AUTHORING DELIVERED 7/7.**
- **Claude integration acceptance: PENDING.**
- A2–A8 in the original open-work register remain outstanding unless separately closed by an owner/Claude review.
- Do not mark MSG-129 fully DONE solely because the seven JSON packages exist.
