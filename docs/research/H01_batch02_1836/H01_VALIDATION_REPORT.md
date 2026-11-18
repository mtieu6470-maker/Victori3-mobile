# R3v consolidated validation report

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

These are ChatGPT implementation checks and self-audit, not an independent REVIEW_PASS. Claude review and owner acceptance remain pending. No build was requested. Two Android APK (debug) push workflows were automatically triggered by the documentation commits because their commit messages omitted `[skip ci]`: run 44228047126 and run 44228160144. Both subsequently completed `success`, with `apk` job success and debug APK artifacts (`dong-chay-lich-su-debug-apk`) of 17,555,127 and 17,555,063 bytes. These are incidental debug builds from unchanged game source, not H01 release validation and not device-tested. No game source, Gradle or workflow file was changed; the available connector did not expose cancellation. Subsequent documentation commits use `[skip ci]`.


## R3u supplemental validation
- Added documentation source rows: Lye 1969, Shick 1971, Hassell 1866, Starr 1913, Butcher & Griffiths 2021 and Everill metadata correction.
- New CSV outputs: source evidence matrix (8 rows), patch decisions (7 rows), open requests (5 rows).
- OYO 650k/1.45m remain quarantined; NDE 60k semantic interpretation strengthened but exact 1836 population/range unresolved; NDE_MOS 210k broad geography; LIB 3.5k/100 unresolved; DZ_KRU 356.4k arithmetic-only.
- No population/game runtime/ownership/map/save/asset/workflow/APK files were changed. No numeric approval.
- Screenshot limits: Shick PDF screenshot 403; Starr/Hassell screenshot unavailable due file size; Lye text inspected from page-numbered digitized transcription; Law 1977 pp.295–302 and Asiwaju English p.704 remain unread.
- Self-audit only; independent Claude review and owner decision remain pending.


## R3v research/source validation (2026-11-18)
- Re-opened full searchable Starr (1913) text; confirmed table attribution to African Repository, immigrant vital-statistics context, exact 1836 row and explicit immigrant/aboriginal distinction.
- Detected a printed 1834 stock anomaly: printed 1,016 conflicts with preceding stock/flow arithmetic (expected 2,016); no silent correction applied.
- Re-opened Shick (1971) full searchable Berkeley PDF text; confirmed individual ACS emigrant data source, 1836 arrivals 242, total 4,571 and 1,819 living in settlements by 1843. Starr gives 209 arrivals in 1836, so the two source series conflict and remain unreconciled.
- Located official GovInfo Senate Document 150 (1845) and a seven-page web transcription of a Monrovia census-labelled list for September 1843. The transcription is not visually authenticated against original page scans, no safe aggregate total extracted, and Indigenous/local inclusion universe is unknown.
- Hiller (1860) Section IV attributes a c.1,500 Monrovia estimate to Freeman writing in 1837; original Freeman document remains unidentified; New Georgia and Millsburgh figures are separate settlements.
- R3v source CSVs are rectangular; disputed live values remain quarantined. No runtime/game data change.
- Self-audit only; independent Claude review and owner acceptance pending. No build/APK workflow run.


## R3w Oyo source validation (2026-11-18)
- Inspected Asiwaju (1989) chapter text around printed pp.703–706 and pp.710–711. p.704 describes layered political influence/tribute/autonomy, not a population estimate. Search within the chapter did not locate 750,000/750000/700,000. Exact official scan image was not authenticated; treat this as inspected transcription.
- Rechecked Butcher & Griffiths (2021, p.385): >750,000 c.1780 claim cites Asiwaju p.704. Citation path is unsubstantiated by accessible source text, not disproven; keep source lineage open.
- Inspected Lovejoy (2012 UCLA PhD dissertation) pp.66–67: c.1836 abandonment/destruction of Old Oyo and displaced alliance at Ago Oja; Atiba recognition by surviving chiefs/warriors.
- Inspected Morton-Williams (1967), p.45: Atiba's formal ritual installation at Ago Oja c.1838; reconstituted official posts thereafter.
- Inspected Johnson (1921), pp.279–280: accession narrative follows fall of old capital and death of Oluewu; no exact year in the passage; edition has posthumous editorial reconstruction caveat.
- Staged chronology recorded: collapse/desertion c.1835–1836 → refugee alliance at Ago Oja → formal ritual installation/reconstitution c.1838. No exact 1 Jan 1836 sovereignty map derivable.
- R3w CSVs are rectangular by schema; no numeric patch, runtime, owner, geometry or game data changed.
- Self-audit only. Independent Claude review and owner acceptance remain pending. No build/APK workflow run.
