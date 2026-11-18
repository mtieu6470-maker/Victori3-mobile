# H01 R3af — Claude independent review request

**Task:** H01-R3AF-SHE-ZUL-BSO-SUCCESSION-1836-1900  
**Requested reviewer:** Claude Code (must not have authored or modified R3af)  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**R3af base HEAD:** `c4b5f08983961494542c7c938db4a32ae21378c4`  
**Scope:** documentation-only historical succession research  
**Current review state:** `PENDING / SELF_AUDIT_ONLY`

## Review objective

Independently verify the historical sequence, source quality, title/authority distinctions, uncertainty statements, CSV integrity, and repository diff for R3af. Do not assume ChatGPT's conclusions are correct. A review verdict must be tied to the exact latest HEAD fetched by Claude.

## Files to review

- `docs/research/H01_batch02_1836/H01_R3af_SHE_ZUL_BSO_SUCCESSION_AUDIT_VI.md`
- `docs/research/H01_batch02_1836/H01_R3af_SOURCE_EVIDENCE_MATRIX.csv`
- `docs/research/H01_batch02_1836/H01_R3af_PATCH_DECISIONS.csv`
- `docs/research/H01_batch02_1836/H01_R3af_OPEN_EVIDENCE_REQUESTS.csv`
- `docs/research/H01_batch02_1836/H01_R3af_SOURCE_REGISTRY_DELTA.csv`
- Cumulative H01 request/source registers, README, integration map, validation report, consolidated audit, AI handoff and integration receipt.

## Mandatory historical checks

### SHE
1. Independently resolve, or confirm remains unresolved, Ege's 9 November 1855 versus Clapham's December 1855 death date for Haile Malakot.
2. Check the difference between Menelik's 1855 proclamation, his captivity at Mäqdäla, return to Shewa in 1865, Bäzzabbǝh's independent claim, formal nəguś recognition in 1878 and imperial declaration/coronation in 1889.
3. Verify that no source-backed exact dates or administrative details were invented for Bäzzabbǝh or the 1855–1865 interval.

### ZUL
1. Verify Mpande's 1840–1872 reign and the distinction between Cetshwayo's rising influence and formal accession in 1872/coronation in 1873.
2. Check the 1879 exile/partition and early-1883 limited restoration.
3. Reconcile SAHO's late-1883 statement with ODNB and other 1884 sources for Cetshwayo's death.
4. Check Dinuzulu's 1884 claim/proclamation, the 14 May 1887 British possession notice, the 1897 incorporation into Natal and the 1894/1898 pardon/return/Government Induna discrepancy.

### BSO
1. Check Moshoeshoe's death date and Letsie's 1870 succession year; test any proposed exact accession day.
2. Inspect the contemporary Colonial Report image/text for 20 November 1891, the 24 chiefs' representation, Crown telegram of 6 January 1892 and Pitso communication of 5 February 1892.
3. Reconcile the report's representation with Maliehe's 2021 account of Letsie's preference for Maama and British confirmation of Lerotholi.
4. Confirm the distinction between paramount chiefship and British/Cape colonial sovereignty in 1868, 1871 and 1884.

## CSV checks

Expected R3af files:
- Matrix: 10 columns, 17 data rows.
- Patch decisions: 7 columns, 14 data rows.
- Open evidence requests: 5 columns, 10 data rows.
- Source registry delta: 8 columns, 17 data rows.

Every matrix `source_id` must map one-to-one to a registry `source_id` by `SRC_H01_` prefix. Cumulative request/source IDs must be unique and every row rectangular. Re-fetch exact GitHub blobs rather than trusting the counts in this request.

## Scope and review conduct

- Read the source pages and PDF images where relevant. Treat the Colonial Report as a contemporary but colonial administrative source.
- Separate direct text, publisher extract/abstract, secondary summary, PDF text-only extraction and visual page-image inspection.
- Review the exact compare from base SHA `c4b5f08983961494542c7c938db4a32ae21378c4` to latest HEAD. Every changed path must remain under `docs/`.
- No write access is needed or requested. Do not edit any file, submit code, create a patch, update data or modify the reviewed branch.
- No APK build, test workflow, Android, Gradle, signing, runtime, event, profile, map, ownership, save/schema or asset work is authorized.

## Required verdict

Return one overall verdict: `REVIEW_PASS`, `CHANGES_REQUESTED` or `BLOCKED`.

Provide a table with each category's verdict and evidence:
1. Historical accuracy and chronology
2. Source reliability/inspection level
3. Title, sovereignty and colonial authority distinctions
4. CSV structure and cumulative register integrity
5. Git diff/scope
6. Documentation/handoff integrity

Any change request must cite exact file, line/row, source and correction. A clean documentation-only diff does not equal owner acceptance or S1 authorization.

**Important:** Claude must fetch the latest branch HEAD immediately before review; the branch may have moved after this request was created. ChatGPT's self-audit is not independent `REVIEW_PASS`.
