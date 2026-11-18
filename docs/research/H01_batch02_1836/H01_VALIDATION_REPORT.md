# R3z consolidated research validation report

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


## R3x NDE source validation (2026-11-18)
- Re-opened Lye (1969) page-numbered text, pp.88, 91, 96–97. Confirmed p.88 about 300 young warriors and women in the initial flight by end 1823; p.91 raids beyond Vaal/Limpopo were not control; p.96 10k–20k followed Mzilikazi beyond Limpopo on later departure; p.97 1829 visitor estimate 60k–80k, separate 1836 Nguni military force 1k–5k, and Lye's composite 60k–80k subject estimate.
- Delius (2010) full-text author upload re-opened: cites Rasmussen (1978, pp.23–26 and 90–94); reports 300 most plausible initial departure, around 20k most reliable end-1820s estimate, some sources 3–4x higher, and broad error margin. Direct Rasmussen pages remain inaccessible/uninspected.
- Warren, Hall & Ackermann (2014) SciELO full text inspected: repeats 300 to around 20k by late 1820s; emphasizes Sotho-Tswana speakers in incorporation; cites Rasmussen.
- Unit/date distinctions recorded: initial migrant nucleus vs polity subjects vs 1836 Nguni warrior force vs later 1837 migration stream. No value silently merged.
- R3T-07 advanced to PARTIALLY_RESOLVED; direct Rasmussen page verification and the 45k–85k interval method remain open. R3X-01 to R3X-03 remain OPEN.
- NDE 60k is retained only as provisional circa-1830s polity-subject candidate; interval 45k–85k unverified; NDE_MOS 210k remains broad geography only. No runtime/game/ownership/geometry patch.
- Self-audit only; independent Claude review and owner acceptance pending. No build/APK workflow run.


## R3y Oyo political geography validation (2026-11-18)
- Inspected Lovejoy (2019), *Journal of Global Slavery* 4(2), pp.127–161, including methods/fuzzy-boundary discussion, Table 1 p.135 and annual chronology pp.153–157. Open-access text extraction is searchable; PDF screenshot endpoint returned 403, so scan page images were not visually authenticated.
- Verified timeline distinctions: 1832 Ilorin expansion over much of Ibarapa; 1833 destruction/subjection of most major Oyo towns and surviving southern Oyo powers; 1834–35 Oyo/Bariba attempts to recover territory with allied southern forces; 1836 Old Oyo capital district abandoned and multiple competing polities. These facts do not support one homogeneous Oyo-controlled Yorubaland region.
- Verified article's methodological caveat: fuzzy boundary maps are approximations, not authoritative; GIS Jan 2/Dec 31 dates have zero historical value and are software placeholders. No day-level owner transition can be inferred for 1836-01-01.
- 75,000+ in the article is Atlantic embarkations, not all Oyo residents/refugees; not used as demographic input.
- Reopened original H01 source package: OYO=650k method explicitly invokes severe displacement/refugees to Ibadan, Ijaye, Abeokuta but has no cohort total or stock definition; OYO_OYO=1.45m uses Manning macro-series plus Law qualitative movement and no reproducible local workbook/region denominator; SSA_REG_18 is allocated 1:1 to OYO. These are materially different units and owner assignment requires locality-level validation.
- Added R3y audit, source matrix, patch decisions, open evidence requests and source registry delta. All CSVs structurally checked for header/row width in local package validation; no runtime/game data changed.
- Self-audit only; independent Claude review and owner acceptance pending. No build/APK workflow run.


## R3z Rasmussen source-quality validation (2026-11-18)
- Opened Colenbrander's archived PDF review page and visually inspected the original scan (printed p.10); OCR/text confirms review of R. Kent Rasmussen, *Migrant Kingdom* (1978).
- Review praises the book's detailed reconstruction and usefulness but notes scarcity/nature of available evidence, excessive weight on war/migration, and insufficient attention to ecological and political/socioeconomic structures and routine agricultural/domestic/commercial/governmental activity.
- The review does not itself supply a demographic re-estimate and does not invalidate Rasmussen. It is a source-quality caveat relevant to using one monograph for size/growth/military potential.
- Google Books metadata/limited preview confirms Rasmussen title/publisher/year/pages but does not expose cited source pages 23–26 and 90–94. Direct book-page evidence remains open.
- No change to NDE values: 60k provisional composite polity-subject estimate only; 45k–85k interval still undefined; numeric and game data remain untouched.
- Full journal volume/issue metadata for the review has not been authenticated. Do not invent citation details.
- Self-audit only; independent Claude review and owner acceptance pending. No build/APK workflow run.
