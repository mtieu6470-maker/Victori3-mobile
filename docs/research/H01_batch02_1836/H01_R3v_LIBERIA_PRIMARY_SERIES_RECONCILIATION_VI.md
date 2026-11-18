# H01 R3v — Liberia primary-series reconciliation and Monrovia source trace

**Snapshot:** 1836-01-01 (simulation anchor; sources use annual or circa-year observations)  
**Status:** `RESEARCH_LAYER_UPDATED / REQUEST_CHANGES / NO_NUMERIC_APPROVAL`  
**Scope:** documentation / source provenance only. No runtime, population benchmark, polity ownership, map geometry or save-data change.

## 1. Main result

R3v improves the lineage of Liberia comparators but does not validate R3l's `LIB=3,500`, `LIB_MON=3,600` or the additional `100`. Starr's 1836 value `2,230` belongs to an immigrant-demographic series, not a Monrovia census or the whole resident population of Liberia. Shick's ACS individual-emigrant reconstruction gives a different 1836 arrival flow (`242` rather than Starr's `209`). These series must not be fused.

A Monrovia-specific list labelled a September 1843 census has been located in a modern transcription attributed to U.S. Senate Document 150. It is a seven-page list and a later comparator only; it does not answer the 1836 count or substantiate `+100`. The GovInfo copy of Senate Document 150 is text-indexed, but the exact census heading was not found in extracted text and the relevant scan page could not be visually inspected. Mark the roster `TRANSCRIPTION_LOCATED / PRIMARY_PAGE_NOT_VISUALLY_VERIFIED`.

## 2. Starr (1913): immigrant movement series

Frederick Starr, *Liberia: Description, History, Problems* (Chicago, 1913), printed pp.24–25, reproduces “Population Movement for Liberia (exclusive of Maryland) from 1820 to 1843.” Immediately before the table, Starr says vital statistics are rare and identifies the table's source as the *African Repository*; he frames it as evidence about how immigrants survived acclimating fever. In the following “Society” section, Starr explicitly distinguishes immigrant and aboriginal populations. His “immigrant population” includes people from the United States, British West Indies and South America, their descendants, and recaptured Africans and their descendants.

The printed 1836 row gives arrivals `209`, deaths `145`, removals `13`, live births `47`, and population `2,230`. The `2,230` is a stock in Starr's immigrant-demographic series, not a count of all residents, all Indigenous residents or Monrovia alone. The table explicitly excludes Maryland.

**Internal table anomaly:** the 1834 printed population is `1,016`. From the displayed 1833 stock, the expected 1834 arithmetic is 1,917 + 237 − 140 − 31 + 33 = 2,016. The printed 1835 value `2,132` then makes the 1836 row balance: 2,132 + 209 − 145 − 13 + 47 = 2,230. Preserve Starr's printed value and flag the anomaly; do not silently repair the historical source.

## 3. Shick (1971): ACS individual-emigrant reconstruction

Tom W. Shick, “A Quantitative Analysis of Liberian Colonization from 1820 to 1843 with Special Reference to Mortality,” *Journal of African History* 12(1) (1971), pp.45–59, explains that an 1844 table listing ACS emigrants to Liberia had been read into the *Congressional Record*. It contained individual details such as names, ages, departure/arrival points, education, occupation, deaths and re-emigration. Shick coded the known data for each individual and derived his tables from that dataset.

Shick reports `4,571` emigrants arriving from America during 1820–1843 and `242` arrivals in 1836. He states that only `1,819` of these emigrants were still living in the settlements by 1843 under his reconstruction. This is a migrant-cohort / settler-survival series, not all inhabitants and not a Monrovia census.

The 1836 arrival values conflict: Starr `209` vs Shick `242` (difference `33`). They also differ in 1829 (Starr `247`, Shick `146`) and 1835 (Starr `183`, Shick `207`); this is not a one-year rounding issue. R3U-09 is **partially resolved as a source-lineage conflict**, not reconciled. The next step is to locate the exact *African Repository* table / issue and its annual returns, then compare it with Senate Document 150's individual register.

The official GovInfo copy of **U.S. Senate Document 150, 28th Congress, 2nd Session**, was transmitted 26 February 1845 and ordered printed 28 February 1845. It contains the ACS emigrant roll Shick cites. The large official PDF is text-indexed, but the screenshot path used here could not render the relevant scan pages.

## 4. Monrovia-specific evidence

### 4.1 Freeman, quoted by Hiller (1860)

Oliver Prescott Hiller, *A Chapter on Slavery: Presenting a Sketch of Its Origin and History, with the Reasons for Its Permission, and the Probable Manner of Its Removal* (Hodson, 1860), Section IV, “The Republic of Liberia,” quotes “Mr. Freeman (writing in 1837)” describing Monrovia as having about 500 houses/stores and about `1,500 inhabitants`. The same passage separately gives about `500` inhabitants for New Georgia and `500` for Millsburgh. Do not aggregate those settlements into a Monrovia-only total.

This is a time-near estimate about Monrovia, but Hiller does not identify Freeman's original title or publication locator in the accessible passage. Hiller is a later secondary carrier of the quotation, not the original enumeration. No census method or uncertainty interval is supplied; this is not an exact 1 January 1836 value.

### 4.2 September 1843 Monrovia roster transcription

A web transcription labels a seven-page list “Census of the Colony of Liberia — September, 1843: Population of the town of Monrovia” and says it was transcribed from Senate Document 150, Serial 458. Fields include names, age, family number, arrival date, birthplace, colony connections, profession, education and health.

The transcription provides individualised town roster entries, not a safe numerical total. Its original page images need verification, and the coverage of Indigenous/local residents is not established by the heading or visible fields. The GovInfo PDF's extracted text did not expose the exact census heading and the scan pages were not visually authenticated. It is not accepted as a fully primary-verified exhaustive census and cannot supply an 1836 estimate.

## 5. Cross-source interpretation

| Source | 1836 figure | Measure | Geography / population universe | Limitation |
|---|---:|---|---|---|
| Starr / *African Repository* table | 2,230 | year-end stock; 209 arrivals, 145 deaths, 13 removals, 47 live births | Liberia excluding Maryland; immigrant/settler series | Not Monrovia-only; not all aboriginal/native residents |
| Shick / Senate 150 ACS roll | 242 | annual arrivals; 4,571 total 1820–43 | ACS emigrants from America to Liberia | Flow/cohort, not year-end resident stock or all residents |
| Freeman quoted by Hiller | c.1,500 | approximate town population | Monrovia, c.1837 | Secondary quotation; original Freeman item unidentified; not census |
| Monrovia list transcription | no safe total | individual roster / census-labelled list | Monrovia, September 1843 | Different year; original images and full coverage not verified |
| Hassell (1866) | 3,500 US emigrants within c.5,000 total | retrospective estimate | Liberia-wide settlements, 1838 | Not 1836 or Monrovia-only |

## 6. H01 disposition

- `LIB=3,500 [3,000–4,000]`: `UNVERIFIED_DATE_AND_UNIVERSE / QUARANTINED`. Hassell's 3,500 is a numerical look-alike in a whole-Liberia 1838 estimate, not proof of the R3l lineage or a 1836 value.
- `LIB_MON=3,600`: `UNVERIFIED_SCOPE / QUARANTINED`.
- Additional `100` local/enclave residents: `NO_INDEPENDENT_SOURCE / QUARANTINED`.
- Starr `2,230`: retain only as a printed value in an immigrant movement series; do not substitute for LIB or LIB_MON.
- Freeman `~1,500`: retain as an approximate c.1837 Monrovia comparator only; no 1836 backcast.
- `DZ_KRU=356,400`: conditional arithmetic residual if LIB_MON=3,600. Excluding the unverified 100 changes the arithmetic residual to 356,500 under the prior formula. Neither residual is a demographic observation.
- No replacement number, confidence interval, profile, control, owner or runtime patch is approved.

## 7. Evidence requests

- R3U-08: the seven-page 1843 transcription has been located; 1836 count, +100, page-image verification and inclusion universe remain open.
- R3U-09: source-series conflict confirmed; common reconciliation remains open pending the *African Repository* original / annual returns.
- R3V-01: obtain the exact *African Repository* issue/table copied by Starr.
- R3V-02: identify Freeman's original 1837 publication/document.
- R3V-03: inspect original images for the 1843 Monrovia roster and establish Indigenous/local inclusion.
- R3V-04: trace R3l's 3,500 and additional 100 to original source, date and population universe.

## 8. Review status and source links

This is ChatGPT's research-layer integration and self-audit, **not** an independent `REVIEW_PASS`. Claude review and owner acceptance remain pending. No game code/runtime/shipped data changed; no build/APK workflow was requested or run.

1. Starr (1913), printed pp.24–25: https://www.gutenberg.org/files/54542/old/54542-h/54542-h.htm
2. Shick (1971), pp.45–59: https://digicoll.lib.berkeley.edu/record/206965/files/cubanc_16_1_01281390ta.pdf
3. U.S. Senate Document 150, Serial 458 (1845): https://www.govinfo.gov/content/pkg/SERIALSET-00458_00_00-002-0150-0000/pdf/SERIALSET-00458_00_00-002-0150-0000.pdf
4. September 1843 Monrovia roster transcription: https://ccharity.com/contents/roll-emigrants-have-been-sent-colony-liberia-western-africa/emigrants-to-liberia-census-lists/monroviacensus/
5. Hiller (1860), Section IV: https://en.wikisource.org/wiki/A_Chapter_on_Slavery/Section_4; bibliographic record: https://books.google.com/books?id=CmUvmM5mc4wC
6. Hassell (1866), printed p.169, retained from R3u: https://upload.wikimedia.org/wikipedia/commons/1/1a/From_pole_to_pole_-_a_handbook_of_christian_missions%2C_for_the_use_of_ministers%2C_teachers%2C_and_others_%28IA_cu31924023021144%29.pdf

**Inspection caveats:** Starr, Shick and the Monrovia roster transcription were inspected as searchable text; PDF screenshots for the relevant large source files were unavailable/returned errors. The official GovInfo PDF's extracted text did not expose the exact census heading. The roster page images have not been visually authenticated; do not treat it as fully verified primary evidence until checked against the original scan.
