# R3t validation report

## Repository snapshot
- Repository: `mtieu6470-maker/Victori3-mobile`
- Branch: `claude/game-historical-sandbox-modes-kg7rj7`
- Base HEAD before doc integration: `d73b548108f1876e3ed9c4c44d175fe560028f28`
- Scope: docs/research only; no runtime or shipped data edits.

## R3l source package checks
- Entity profiles / population reconciliation: 17 entities.
- Region facts: 78 rows.
- Region crosswalk: 90 rows; 81 unique slots.
- Distinct crosswalk allocation sums: PASS (all 81 slots sum to 1.000 within 0.001).
- Provenance audit: 128 claims.
- Profile-vs-mapped interval overlap: 15 YES, 2 NO (OYO, NDE).

## Package checks
- Integrated CSVs parse and are rectangular: PASS.
- R3s full audit-chain ZIP CRC: PASS.
- R3l original source ZIP CRC: PASS.
- No numeric/population or map-owner patch applied: PASS.

## Evidence gates
- OYO 650k and 1.45m: blocked; no numeric approval.
- NDE 60k semantic interpretation: supported as approximate 1830s polity estimate; range not verified; no numeric patch.
- NDE_MOS 210k: broad geographic reconstruction only; no direct-rule total.
- LIB 3,500/100: unverified; comparator values not substituted.
- DZ_KRU 356,400: arithmetic residual only.

## Overall
`RESEARCH_LAYER_INTEGRATED / REQUEST_CHANGES / NO_NUMERIC_APPROVAL`.

These are ChatGPT implementation checks and self-audit, not an independent REVIEW_PASS. Claude review and owner acceptance remain pending. No product/game build or APK CI was triggered.
