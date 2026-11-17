# H01 Sub-Saharan Africa RepoJoin R3a — Independent Review Request

**Date:** 2026-11-17  
**Package:** `H01_SubSaharan_Africa_Batch02_RepoJoin_R3a_REVIEW_READY.zip`  
**Package SHA-256:** `fc5bc8146dd98ce6f9693eb395f46019ac25b44c120b716b9af2dbb442079541`  
**ZIP size:** 68,429 bytes  
**Uncompressed payload:** 265,168 bytes  
**Archive inventory:** 12 files (8 CSV, 1 JSON, 3 Markdown); no media binaries  
**Intake check:** `zipfile.testzip() == None`; archive opens and extracts successfully  
**Repository branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Repository HEAD at handoff creation:** `362fce92be515c667953da557465f3b3f4144c20`

## 1. Purpose and review boundary

Independently review the attached R3a ZIP as a **research data package**, not as permission to ingest it into the game. The ZIP is an external review artifact and is not committed by this handoff. R3a is derived from the uploaded R3 package; only `H01_VALIDATION_REPORT.md` was changed:
- The four unresolved slots are now described as pending evidence-backed region bindings. The repository reference JSON has already been reviewed and does not provide sufficient matching records for those four slots.
- The report's final ZIP byte count was updated to 68,429 bytes.

All other 11 package entries are byte-for-byte identical to R3. The archive was rebuilt and its final size, entry count and CRC were rechecked.

## 2. Repository evidence to use

Review against the exact repository branch/HEAD above, not a default-branch snapshot.

| Evidence | Repository path | Blob SHA |
|---|---|---|
| 1836 map-region registry | `historical_data/borders/regions_1836.csv` | `904bae66f03c36821e4f32d7526c61bd779d5c42` |
| Political entity registry | `historical_data/political_entities/registry.json` | `97ba54d8d5547c2bbedfb4ed1a41833c7fe387ca` |
| H01 repository-region lookup | `docs/audit/s0/H01_REPO_REGION_REFERENCE_2026-11-17.json` | `6604723287439bcc8c9dfdc0f8a34257bdc37f20` |
| Region macro-classifier | `tools/audit/regions.ts` | Inspect exact content at handoff HEAD |

The repository reference JSON is a lookup aid, not a substitute for evidence-backed H01 crosswalks. In particular, inspect the documented `ETH_TIG` exception rather than assuming that omission from the 81-row lookup means the region does not exist.

## 3. Required independent checks

Do not rely on Hydrogen's validation report or the prior ChatGPT intake report as proof. Recompute the following from the attached ZIP and repository files:

1. **Archive and schemas**
   - Verify SHA-256 against the package hash above.
   - Enumerate all entries; verify CRC and full extraction.
   - Parse every CSV and JSON; check required columns, duplicate primary keys, empty/invalid types, and unexpected control characters.
   - Confirm the report's archive byte count and uncompressed size against the actual final ZIP.

2. **Regional crosswalk**
   - Confirm 90 crosswalk rows cover exactly `SSA_REG_01`–`SSA_REG_81`.
   - Recompute every per-slot allocation-weight sum to exactly 1.000 within the declared precision.
   - Confirm exactly four unresolved slots: `SSA_REG_44`, `SSA_REG_45`, `SSA_REG_62`, `SSA_REG_63`.
   - Confirm every one of the 75 resolved repository IDs exists in `regions_1836.csv`, is unique as intended, and has defensible owner/controlling-entity semantics. Check all umbrella `DZ:*` owners and foreign enclaves/ports individually.
   - Assess `ETH_TIG` against the actual row and classifier logic. Do not silently drop or remap it.

3. **Regional facts and arithmetic**
   - Recompute all 79 row values and ranges from the CSV.
   - Check the 75 resolved rows, four null rows, and continental totals separately.
   - Verify the reported point/min/max totals: 59,085,000 (44,925,000–76,870,000) resolved; 3,620,000 (2,680,000–4,770,000) unresolved; 62,705,000 (47,605,000–81,640,000) combined.
   - Validate component sums and ensure the four null rows' Markdown values and source IDs match the CSV row-by-row.
   - Confirm no unsupported `rho ≈ 0.35` or joint confidence interval has been reintroduced.

4. **Entities, events and sources**
   - Check all 65 entity-crosswalk rows and all 17 playable profiles against the 181-entry registry.
   - Check every entity and region ID referenced by events; all event actor IDs must exist.
   - Validate event dates, chronological consistency, historical existence of actors, and regional references. In particular, review future actors such as `TRN` and `OFS` against their historical start dates.
   - Check all source IDs in CSV, JSON and Markdown against the 25-entry source register; assess orphan, misspelled and semantically mismatched citations.
   - Review provenance claims for evidentiary support, not only source-ID referential integrity.

5. **Asset manifest**
   - Confirm no binary media is represented as delivered.
   - Confirm absent binaries have empty hashes, URLs and physical dimensions/durations.
   - Review every license/attribution status; keep unresolved licenses pending rather than claiming clearance.

## 4. Required review output

Return a written, evidence-based verdict with:
- `PASS`, `REQUEST_CHANGES`, or `BLOCKED` for each category above;
- exact filename, row/ID, expected vs observed value, and repository/source evidence for each defect;
- a final package-level recommendation: research-package accepted, accepted with explicit limitations, or not accepted;
- an explicit statement that this review **does not authorize runtime integration, S1 implementation, workflow changes, save-schema changes, or media licensing assumptions**.

Do not modify the attached ZIP, repository data, game code, workflows or save schema during the review. Do not treat the four null slots or absent media as defects if they are accurately disclosed and guarded. Do not fabricate evidence to force a PASS.

## 5. Existing known limitations to verify, not conceal

- Four region slots remain unresolved/null.
- GDP per capita for 1836 is documented as missing for all 17 playable entities.
- No binary image/audio assets are included.
- `ETH_TIG` is a real repository region owned by `ETH`, omitted by the current macro-region classifier from the lookup JSON; the H01 mapping retains it with an explicit exception.
- The package-level review is separate from the S0/S1 project gates. S1 remains NOT_STARTED until the required independent review and separate owner acceptance are both recorded.
