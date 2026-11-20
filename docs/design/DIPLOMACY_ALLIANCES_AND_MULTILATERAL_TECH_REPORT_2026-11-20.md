# DIPLOMACY ALLIANCES & MULTILATERAL TECHNOLOGY — IMPLEMENTATION REPORT

**Date:** 2026-11-20  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Working branch:** `experiment/vic3-visual-upgrade`  
**Task status:** `IN_PROGRESS — CI_FAILED — REDESIGN REQUIRED`  
**Source-code checkpoint tested:** `b1cf8c852b7a223f4aca992ee950e561491fc2c7`  
**Base checkpoint for this slice:** `cddaa39f91907ce792e3e6ca38352013c4ba6bf5`  
**Delta:** 28 commits ahead, 0 behind at the time of comparison.  
**Scope:** separate bilateral military Alliances from economic Customs Unions; model the Victoria 3 technology gate for multiple Alliances; normalize historical multi-country pact seeds without breaking saves or deterministic order.

> This is an implementation report, not a claim of feature completion, independent review, owner acceptance, APK delivery or device QA.

---

## 1. Owner intent captured

The owner corrected the earlier design assumption:

- Military Alliances and Customs Unions are different systems.
- A country should be able to have multiple military allies only when the relevant technology is researched.
- Customs Union membership remains an economic-market relationship with one market leader; it is not a military alliance.
- Historical data must remain plausible. The player should not encounter arbitrary relationships or nonsensical rules.
- Victoria 3 is the behavioral reference. Research its actual mechanics before coding; do not infer mechanics from a convenient data structure.

The user explicitly asked to stop implementation after this slice, write a durable GitHub report and prepare a new-session handoff.

## 2. Reference mechanic research

The consulted Victoria 3 1.15.0 treaty extraction identifies:

- **Alliance** is a mutual treaty between exactly two countries.
- **Defensive Pact** is a separate mutual treaty, also between two countries.
- Alliance and Defensive Pact are mutually exclusive with each other and with Guarantee Independence for the same country pair.
- Alliance and Defensive Pact require International Relations, but their relation thresholds differ.
- A country needs **Multilateral Alliances** to sign more than one Alliance.
- Customs Union / shared market is not the same relationship as an Alliance.

Reference used:
- Vic3 Tabula, treaty extraction for game version 1.15.0, extracted 2026-11-05: https://vic3tabula.com/en/treaties
- Treaty mechanic reference: https://github.com/maxzxc0110/Victoria3/blob/main/Victoria_3_Wiki/knowledge_base/05_Diplomacy/Treaty.md
- Treaty mutual-exclusion/reference flags: https://github.com/maxzxc0110/Victoria3/blob/main/Victoria_3_Wiki/knowledge_base/09_Misc/Treaty_modding.md

The above are third-party extracted/reference sources, not Paradox source-code authorization. Re-check the exact game version and mechanic before finalizing parity.

## 3. What was committed

The 28-commit slice from `cddaa39` to `b1cf8c8` touched nine files:

| File | Change |
|---|---|
| `historical_data/technologies/technologies.json` | Added the research path ending in `multilateral_alliances`; corrected the `bureaucracy` prerequisite to `urbanization`; represented the unlock effect in technology data; costs were converted to the project's internal scale. |
| `src/engine/systems/diplomacy.ts` | Added ally counting, Alliance eligibility and technology gates; removed the previous assumption that an arbitrary fixed partner count should govern new Alliances. |
| `src/engine/ai/ai.ts` | Removed the old hard-coded three-Alliance limit; use the same eligibility functions as the player; add research preference for the relevant technology path when the AI already has diplomatic partners. |
| `src/engine/systems/alliance.ts` | Added normalization of a historical multi-member alliance record into bilateral country pairs; retains source IDs and preserves non-Alliance treaty ordering. |
| `src/engine/init.ts` | Normalizes historical alliance seeds at new-game initialization. |
| `src/engine/save.ts` | Runs alliance normalization during deserialization to migrate older saves with grouped Alliance records. |
| `src/ui/i18n/vi.ts` | Added Vietnamese labels for the added technology chain. |
| `src/ui/screens/Tech.tsx` | Added Vietnamese text for the multiple-Alliance unlock effect. |
| `tests/diplomacy.test.ts` | Added coverage for treaty eligibility, multiple allies, historical grouped pacts, Customs Union separation, technology progression, AI research preference, save migration, order preservation and idempotence. |

### Current relevant source blob SHAs at tested source checkpoint

| File | Blob SHA |
|---|---|
| `src/engine/systems/diplomacy.ts` | `33e724407a38abda1df83ce834f2071981e2a949` |
| `src/engine/ai/ai.ts` | `14607aa1b7aaa24b8fa2ea1e84dfdb0a1348b13c` |
| `src/engine/systems/alliance.ts` | `2e425fca760bc998eb7b18eaf91d32826d9a4b0f` |
| `src/engine/init.ts` | `a0a93bce61943a896600ec8ce66ef9defff020b9` |
| `src/engine/save.ts` | `398239c91d6aeae91e164c9eb6d7bd9f6be463b6` |
| `historical_data/technologies/technologies.json` | `f9c313ef28f5c7bac278d0b6a9a7e10ee1bf23ab` |
| `src/ui/i18n/vi.ts` | `50bcf241d784512b66e53a791045b01a26df31df` |
| `src/ui/screens/Tech.tsx` | `638ac4301077c31c15947b8c289b04365127fd50` |
| `tests/diplomacy.test.ts` | `9ff0ed30a0da211643279fab86d36fab3224d796` |

## 4. Historical source findings and unresolved modeling issue

The project's CoW source is `historical_data/diplomacy/cow_alliances_1816_1914.json`. At the 1836 start date, 13 active records were found:

- Five active records contain more than two countries (groups of 3, 4 or 8).
- Expanding all records into unordered country pairs yields 51 pair occurrences and 41 unique pair edges.
- The source has separate `defense` and `entente` flags. Some historical records are explicitly `Type I: Defense Pact`; not every record should be treated as a Victoria 3 Alliance.

**Important unresolved issue:** current initialization still maps all `db.alliances` records to `type: 'alliance'`; the existing `AllianceSeed.defense` and `entente` fields are not yet used to create distinct live treaty types. The normalization therefore makes grouped records bilateral, but it does **not** yet correctly distinguish historical Defensive Pacts from Alliances.

Another unresolved issue: the normalization helper merges repeated occurrences of the same country pair and combines their source IDs. The source data has 51 pair occurrences but 41 unique pairs. Before retaining that behavior, inspect the overlapping records and determine whether they represent duplicate provenance for the same treaty or genuinely distinct treaty articles. Do not discard distinct legal relationships.

The next implementation must introduce a coherent treaty taxonomy (at minimum `alliance`, `defensive_pact`, `guarantee`, `customs_union`) and define:
- which treaty consumes the Multilateral Alliances capacity;
- mutual exclusions between Alliance, Defensive Pact and Guarantee Independence for the same pair;
- defensive war calls for Alliances and Defensive Pacts;
- whether/how a country may leave or break each treaty;
- source-preserving conversion and deterministic old-save migration.

Do not treat a Customs Union as a treaty with the same eligibility, capacity or war-call semantics.

## 5. Latest CI evidence

Authoritative workflow for the tested source checkpoint:

- **Run:** #454
- **Run ID:** `44721610964`
- **Commit SHA:** `b1cf8c852b7a223f4aca992ee950e561491fc2c7`
- **URL:** https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44721610964
- **Conclusion:** `FAILURE`

Observed steps:
- `npm ci`: PASS
- `Build data, map and web app` (including TypeScript/build path): PASS
- Generated data/web bundle hashing: PASS
- Vitest: **129 passed / 2 failed / 131 total**
- The two failures are in `tests/modes.test.ts`:
  1. `one engine, two modes → AI activity is not reduced in either mode`: Alliance AI action count is 0 where the test expects greater than 0.
  2. `Sandbox Mode is free → wars, alliances, territorial and institutional changes emerge`: Alliance action count is 0 where the test expects greater than 5.
- The new diplomacy tests pass in this run.
- The earlier save/load deterministic failures from intermediate runs no longer appear in run #454.
- Java/Gradle, Android asset sync, APK assembly and APK artifact steps were **SKIPPED** because the test step failed.

**Result:** source/data/web build is green; full test suite is not green; APK not built; no APK artifact or checksum; no phone installation, device QA or performance evidence.

No local test command or local Gradle build was run in this session. Do not claim local validation.

## 6. Why the latest failures matter

The new Alliance rules constrain AI actions by researched technologies. The previous mode tests assume AI countries will form Alliances during short simulation windows. The latest result shows no AI Alliance action in either tested mode during that window.

Do not simply weaken the two assertions or remove the research gate. Diagnose the cause using the actual AI research and diplomacy cadence:
- verify when AI countries obtain `international_relations` and `multilateral_alliances`;
- verify how many countries begin 1836 with historical Alliance partners;
- confirm whether those initial partners are represented by the correct treaty category;
- determine whether the historical starting data or short test window makes new Alliance formation correctly unavailable;
- decide whether mode tests should assert eligibility/attempt behavior, or run long enough for the relevant technologies to be researched;
- if AI behavior is genuinely too passive, fix the AI utility/research progression rather than fabricating alliances.

## 7. Required next steps — do not skip

1. Re-fetch current branch HEAD and this report/handoff before editing. The tested source SHA above is not automatically the current HEAD after this report is committed.
2. Read `AI_START_HERE.md`, `docs/coordination/SESSION_RECOVERY_PROTOCOL_VI.md`, `docs/coordination/AI_COLLABORATION_PROTOCOL.md`, `docs/coordination/OWNER_PRODUCT_ENGINEERING_PRINCIPLES_VI.md`, the latest `AI_HANDOFF.md`, the owner authorization file, and the linked subsystem/roadmap documents. The recovery protocol is on the default branch if absent from the experiment branch; record exact refs/SHAs and do not silently assume file availability.
3. Inspect the exact latest run logs and the two failed assertions. Reproduce or isolate the AI diplomacy path before changing code.
4. Build a treaty mapping table from the 13 1836 CoW records, including source ID, source type, `defense`, `entente`, members and pair overlap. Resolve whether duplicate pair edges are independent treaties or duplicate provenance.
5. Design and implement separate Alliance and Defensive Pact live treaty semantics. Keep bilateral treaty invariants. Do not merge distinct treaty kinds or provenance.
6. Reconcile historical seeding and save migration. Migration must be idempotent, preserve treaty order, preserve all source/provenance data, keep Customs Union leader/membership intact and preserve save/load determinism.
7. Rework tests to cover bilateral Alliance, Defensive Pact, Guarantee Independence, mutual exclusions, technology gates, historical multi-member conversion, overlapping source pacts, breaking a single pair, war-side participation, AI research and both save/load paths.
8. Re-run full CI on the exact resulting HEAD. Only after tests pass should the workflow proceed to Gradle/APK. Verify the APK artifact and its checksum from the exact tested commit.
9. Update this report and `AI_HANDOFF.md` with actual evidence. Do not merge, rebase, force-push, alter signing/secrets, change package identity or mark independent review/owner acceptance without explicit authorization.

## 8. Current acceptance status

- Implementation: `PARTIAL`
- TypeScript/data/web build: `PASS` on tested source SHA
- Full test suite: `FAIL` (129/131)
- APK: `NOT_BUILT`
- Device QA: `NOT_TESTED`
- Independent review: `PENDING`
- Owner acceptance: `PENDING`
- Feature parity: `NOT_COMPLETE`

The correct next action is redesign/fix the treaty taxonomy and AI test behavior, not start a new unrelated subsystem.


## 10. CI #457 findings and bounded corrections (20/11/2026)

- **Exact run:** #457, ID `44728018979`, source SHA `fbbfbe2371f45a967ade033d1970746b90109e4d`, FAILURE. Data/web/typecheck build passed; Vitest reported 136/139 tests, three failures; Gradle/APK was skipped.
- **Failure 1 — historical fixture expectation:** `tests/data.test.ts:102` expected the Anglo-Portuguese source record to be a runtime `alliance`. The source record is explicitly `Type I: Defense Pact`; the old test was asserting a conflation that the new treaty taxonomy intentionally removed. The fixture now asserts the exact CoW source IDs and their `defensive_pact` type instead.
- **Failure 2 — player war across an active pact:** `tests/modes.test.ts:102` attempted a Prussia–Bavaria war while the 1836 source agreement `cow_ally_3` (which includes a non-aggression term) remained active. The runtime correctly rejected the declaration. The scripted player now explicitly withdraws from the Defensive Pact on tick 11 before declaring war on tick 12; the NAP enforcement remains intact.
- **Failure 3 — save/load determinism:** the exact serialized diff was isolated from the CI log. Only `state.treaties[43].members` differed: uninterrupted state `['FRA','BEL']`, reloaded state `['BEL','FRA']`. The migration had alphabetically sorted every bilateral treaty, unintentionally reversing the directional Guarantee Independence article. The migration now preserves member order for non-source/directional bilateral treaty rows and only sorts symmetric historical source pacts when expanding them.
- **Additional taxonomy correction:** source category now takes precedence over overlapping flags. This is necessary because CoW labels non-aggression records distinctly even when other descriptive flags (such as Entente) are also true; all flags remain retained in `terms`. Generic/older source rows still use flag fallbacks.
- **Regression coverage added:** exact source-category classification (Defense Pact, Entente, Neutrality, Non-Aggression), direction-preserving guarantee save migration and continuation of the player-intervention scenario through an explicit treaty withdrawal.
- **Validation for the correction commit:** PENDING; no test/build/APK result is claimed until Actions reports against its exact SHA.
