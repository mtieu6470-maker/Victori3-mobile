# CG-64 — ChatGPT story data import review (2026-11-24)

## Decision and scope

- Repository: `mtieu6470-maker/Victori3-mobile`
- Integration branch: `claude/game-historical-sandbox-modes-kg7rj7`
- Source branch: `ccr-b27f3fb8-epfpd6`
- Source HEAD before integration: `d877a3ffd71e84726098b4a58ae8f5f404036351`
- Target HEAD before integration: `77af7ce79234413f9e02fff3a4657dcb8bcb07d1`
- The source branch was exactly 37 commits ahead and 0 behind the target. Its diff contained only documentation and historical data files; no `src/`, `tools/`, or test source changes.
- **Integrated:** target branch was fast-forwarded to `d877a3ffd71e84726098b4a58ae8f5f404036351`. No force push and no merge conflict resolution were needed.
- The game data builder enumerates every `.json` file in `historical_data/events/story/` and compiles event/journal records into `db.story_events` / `db.story_journals`. The five country packs are now present on the integration branch and are eligible for the normal content build.

## Imported country packages

| Country | Events | Journals | Options | Source entries |
|---|---:|---:|---:|---:|
| FRA | 59 | 6 | 118 | 31 |
| JAP | 53 | 6 | 106 | 18 |
| QNG | 51 | 4 | 102 | 3 |
| RUS | 54 | 5 | 108 | 5 |
| VNM | 48 | 5 | 96 | 11 |
| **Total** | **265** | **26** | **530** | **68** |

- 530 options were checked for at least one named, positive-duration modifier.
- 106 image candidates exist in `story_selection.json`; these are source candidates only. They are not proof that image binaries have passed licence checks or been ingested.
- The five packages contain 272 event-level source references.

## Static audit performed

Read back the five JSON files, registry, `regions_1836.csv`, and `src/engine/mods.ts` from the source HEAD.

- All five JSON files parse.
- 265 event IDs are unique across the five packs; 26 journal IDs are unique.
- All 530 options have at least one modifier; modifier IDs/names/durations are populated and effect keys match the engine's `MOD_KEYS`.
- All event source references resolve to a key in the corresponding package's source dictionary.
- Country, entity, region and regions-array references were independently scanned against the registry and 1836 region list: no unknown references found.
- No duplicate event/journal IDs were found across these five packages.
- Static checks do not establish historical accuracy, successful build ingestion, correct runtime scheduling, or gameplay quality.

## Integration blockers / required follow-up

### 1. Persistent `event_fired` journal progress — correctness blocker

The engine's `storyCondition(event_fired)` checks whether the event ID exists in `st.storyFired`; that record remains present after firing. The journal monthly loop evaluates each progress step every month. Therefore an `event_fired` step adds its points repeatedly, not once.

- Found 102 monthly journal progress steps using `event_fired` across the five packages.
- Affected packages: FRA (all 6 journals), JAP (all 6 journals), VNM (all 5 journals).
- QNG and RUS use time-based progress and avoid this specific repeated-award defect.
- Required correction: Claude should add explicit one-shot milestone tracking/consumption in the engine or another reviewed mechanism, add regression tests, and migrate these journal definitions. Do not silently replace historical milestones with arbitrary time-based progress.

### 2. Monthly scheduler vs exact historical dates

- 187 events use a mid-month `trigger.fire_date`.
- `storyEventsMonth()` compares the current monthly `dateStr(st.date)` to `fire_date`. This is not a daily scheduler; the event can only fire on a monthly invocation at or after its date.
- Verify that each availability window and entity lifetime remain valid at that later monthly invocation. Add boundary tests for mid-month dates, year-end dates, and dates close to `window[1]` / entity `hist_to`.
- The five data files have no case where a mid-month `fire_date` is exactly equal to `window[1]`, but this does not eliminate other boundary cases.

### 3. Historical and media review

- JAP registry continuity: registry currently labels `JAP` as Tokugawa Japan; review how the engine handles continuity into Meiji and modern Japan without inventing a new entity ID.
- FRA/JAP/RUS/QNG/VNM source dictionaries are research starting points, not claim-level proof. Independently verify each date, actor, causal statement and territorial effect before release.
- Recheck image provenance, licence and file size through the normal ingestion tool. Candidate list entries must not bypass the PD/CC0 rights gate.
- FRA coverage still has reported gaps in 1836–1847 and 2025–2026. Other packages also have limited late-period coverage; do not claim complete 1836–2026 coverage.

## Verification status

- **Passed:** GitHub fast-forward integration; static JSON/reference/modifier audit described above.
- **Not run in this session:** `npm run data`, `npm run content`, test suite, simulation, Android build, APK verification, device QA.
- Combined commit status query returned no status checks for the integrated HEAD at audit time. No CI success is claimed.
- **Release status:** NOT RELEASE-READY until the journal milestone defect is corrected and builders, tests, simulation, media ingestion, Android build and device QA pass on the exact resulting HEAD.

## Next actions for Claude

1. Fix one-shot journal milestone semantics and add regression tests for FRA/JAP/VNM.
2. Test monthly `fire_date` scheduling and entity-retirement boundaries, especially QNG 1912-02-12 and RUS 1917-03-15.
3. Run `npm run data`, inspect all warnings/errors, then `npm run content` and the standard licence-gated media ingestion.
4. Run focused event/journal simulations, the full regression suite, and Android build on the exact final HEAD.
5. Record CI run IDs, APK SHA-256 and device QA status. Keep MSG-129 IN_PROGRESS until the remaining A1 country packs and all review gates are complete.

