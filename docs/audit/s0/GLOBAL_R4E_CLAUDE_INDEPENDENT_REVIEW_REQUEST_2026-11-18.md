# R4e — Claude independent review request (collective / aggregate polity research)

**Task:** `GLOBAL-HISTORICAL-R4E-COLLECTIVE-POLITIES`  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Base SHA before R4e:** `103ab66b227809fae358e082fa253c0e50a1f78c`  
**Implementer:** ChatGPT  
**Reviewer:** Claude Code only if Claude did not author or modify R4e  
**Review type:** no-write / historical evidence, CSV integrity and modelling-boundary assessment  
**Status:** `PENDING / SELF_AUDIT_ONLY`

## Owner direction

- Scope is worldwide; Historical Mode requires source-backed history and temporal accuracy for 1836–1936 without railroading.
- Treat Victoria 3 as a gameplay-depth benchmark, not a license to copy proprietary code, art, maps, music, text or DLC.
- This R4e packet only completes research dossiers for MAO and MLY, the two remaining entries in the original 54-profile missing-succession queue.
- Research coverage is not approval to patch live game data. Do not implement data, engine, UI, save or asset changes as part of this review.

## Files to review

- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4e/README_VI.md`
- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4e/R4e_COLLECTIVE_POLITIES_AUDIT_VI.md`
- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4e/R4e_SOURCE_EVIDENCE_MATRIX.csv`
- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4e/R4e_PATCH_DECISIONS.csv`
- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4e/R4e_OPEN_EVIDENCE_REQUESTS.csv`
- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4e/R4e_SOURCE_REGISTRY_DELTA.csv`
- `docs/research/GLOBAL_HISTORICAL_1836_1936/R4e/GITHUB_INTEGRATION_RECEIPT_R4e.md`
- `docs/coordination/AI_HANDOFF.md`

## Historical checks — MAO

1. Verify He Whakaputanga date, 34 initial northern signatories and later 52-signature count using NZ History/Archives New Zealand records.
2. Verify that the declaration vests authority collectively in participating rangatira, and that the annual congress was planned but not proven to have operated.
3. Check that James Busby is treated as British Resident/convenor, not Māori head of state.
4. Check scope: the confederation must not be treated as a universal all-iwi polity from the signatory list alone.
5. Assess the use of Waitangi Tribunal Stage 1. Ensure the conclusion that northern rangatira did not cede sovereignty is correctly limited to the inquiry scope and not presented as a universal legal finding for every iwi/hapū.
6. Challenge any suggestion that `hist_to=1840-02-06` proves all Māori authority or polities were extinguished. Identify a better temporal representation if available.

## Historical checks — MLY

1. Confirm that MLY is an aggregate/gameplay container, not a unified peninsula-wide sovereign state in 1836.
2. Check Perak and Selangor local ruler candidates against the linked state official histories.
3. Verify the separation of Johor Sultan and Temenggong offices; do not backdate the 1855 treaty transfer.
4. Verify that Bendahara Tun Ali is not mislabeled as a shared Sultan of MLY; assess the age and limitations of Linehan (1936).
5. Check the Negeri Sembilan treatment of Luak, Undang and Yamtuan; ensure disputed genealogy is not silently resolved.
6. Check Kedah/Perlis boundaries and the 1821/1839/1843 distinctions; assess Siamese occupation/reorganization vs local authority.
7. Check Kelantan 1835/1837 chronology conflict and ensure Muhammad II is not backdated to 1836.
8. Check Terengganu chronology, including the disputed Tengku Omar and Sultan sequence around 1831–1839.
9. Check that tribute/suzerainty is not equated automatically with direct annexation/administration.
10. Confirm FMS dates/constituents and ensure the 1895/1896 formation is not backdated to 1836.

## Structural checks

Re-fetch the exact latest branch HEAD before review. Confirm the R4e package contains:
- source evidence matrix: 2 data rows × 13 columns;
- patch decisions: 19 data rows × 7 columns;
- open evidence requests: 12 data rows × 5 columns;
- source registry delta: 20 data rows × 8 columns;
- rectangular CSV rows, non-empty unique first-column IDs and no malformed quoting.

Compare R4e base `103ab66b227809fae358e082fa253c0e50a1f78c` to the exact latest HEAD. Every changed path must remain under `docs/research/GLOBAL_HISTORICAL_1836_1936/R4e/`, `docs/audit/s0/` (review request) or `docs/coordination/` (handoff). No product path, test, asset, Android resource, workflow or build file may change.

## Required verdict

Return exactly one verdict: `REVIEW_PASS`, `CHANGES_REQUESTED` or `BLOCKED`.

Use evidence-linked findings with file/line/CSV-row locators. This is a no-write review. Do not edit the branch, create fixes or implement runtime features. A ChatGPT self-audit is not an independent review. Claude review does not grant owner acceptance or authorize a product-data patch or S1.
