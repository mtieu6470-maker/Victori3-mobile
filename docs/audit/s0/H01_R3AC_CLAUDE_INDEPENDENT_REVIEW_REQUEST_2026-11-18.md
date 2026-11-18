# H01 R3ac — Claude Independent Review Request

**Request date:** 2026-11-18  
**Review state:** `READY_FOR_INDEPENDENT_REVIEW` — request only, not a verdict  
**Repository:** https://github.com/mtieu6470-maker/Victori3-mobile  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Base SHA before R3ac:** `1dea95b089b8e2a661223e414f18ee2891c50ca8`  
**Pre-request HEAD:** `529e063562f21ea36ce6975a87592ac5c28bf8fc`  
**Review target:** Fetch the current branch HEAD when you start. Record the exact SHA actually reviewed. If the branch has advanced, inspect the new commits and changed paths before deciding whether the task remains within scope.

> **Claude: start here when connecting to GitHub.** Read this request first. Do not rely on chat summaries or the R3ac author's conclusions. Independently inspect sources, repository data and the exact diff.

## 1. Purpose and independence

The project owner directed ChatGPT to handle H01 research and document packaging while Hydrogen's document-packaging output is not usable. Claude is assigned to provide an independent review of the R3ac research layer. Claude must not have authored or modified the target R3ac changes.

Review the research and source interpretation for four political entities at the 1836 snapshot:
- SOK — Sokoto
- BOR — Bornu
- WAD — Wadai
- DAR — Darfur

This request is **research/documentation only**. It does not authorize a patch to runtime, country profiles, officeholder values, titles, government presets, events, political ownership, population data, schema, save, engine, workflows, Android, APK or S1.

## 2. Files to inspect

### A. Primary R3ac package
1. `docs/research/H01_batch02_1836/H01_R3ac_CENTRAL_SAHEL_RULERSHIP_AND_SOVEREIGNTY_AUDIT_VI.md`
2. `docs/research/H01_batch02_1836/H01_R3ac_SOURCE_EVIDENCE_MATRIX.csv`
3. `docs/research/H01_batch02_1836/H01_R3ac_PATCH_DECISIONS.csv`
4. `docs/research/H01_batch02_1836/H01_R3ac_OPEN_EVIDENCE_REQUESTS.csv`
5. `docs/research/H01_batch02_1836/H01_R3ac_SOURCE_REGISTRY_DELTA.csv`

### B. Integrated records
6. `docs/research/H01_batch02_1836/README_VI.md`
7. `docs/research/H01_batch02_1836/H01_INTEGRATED_AUDIT_REPORT_VI.md` — section 10 (R3ac)
8. `docs/research/H01_batch02_1836/H01_VALIDATION_REPORT.md` — R3ac subsection
9. `docs/research/H01_batch02_1836/H01_REPO_INTEGRATION_MAP.md` — R3ac boundary
10. `docs/research/H01_batch02_1836/H01_OPEN_EVIDENCE_AND_ACCEPTANCE_REQUESTS.csv` — R3AC-01 to R3AC-07
11. `docs/research/H01_batch02_1836/H01_INTEGRATED_SOURCE_REGISTRY_DELTA.csv` — R3ac source rows
12. `docs/research/H01_batch02_1836/GITHUB_INTEGRATION_RECEIPT_R3ac.md`
13. `docs/coordination/AI_HANDOFF.md`
14. `docs/coordination/AI_COLLABORATION_PROTOCOL.md`

## 3. Historical review requirements

### 3.1 Sokoto — Muhammad Bello and titulature

Current profile lists Muhammad Bello as `Sarkin Musulmi (Caliph)`, since 1817. R3ac argues:
- Murray Last, *The Sokoto Caliphate* (1967), chapter 4, dates Muhammad Bello's reign 1817–1837 and Gawakuke campaign to March 1836.
- Paul Naylor, *From Rebels to Rulers* (2021), “Note on Language”, says he uses `Amīr al-muʾminīn` (“Commander of the Faithful”) because it is the term most commonly encountered in manuscripts, distinguishing the Sokoto ruler from regional Emirs.
- “Sarkin Musulmi” and “Caliph” remain meaningful Hausa/English variants and must not be declared simply wrong.

Independently verify:
- Exact reign dates from Last and Naylor.
- Exact wording and placement of Naylor's note (frontmatter/printed page) and its intended scope.
- Whether R3ac overstates “canonical title” or correctly describes a manuscript-preferred term in one modern scholarly work.
- Whether regional emirates retain meaningful autonomy and whether the audit avoids describing Sokoto as a fully centralized modern state.
- The Gawakuke event date and the source's month/year precision.

Sources:
- Naylor: https://api.pageplace.de/preview/DT0400.9781800102347_A42901854/preview-9781800102347_A42901854.pdf
- Last: https://www.internationalafricaninstitute.org/downloads/sokoko_caliph.pdf

### 3.2 Bornu — Shehu al-Kanemi vs Mai Ibrahim

Current profile lists Muhammad al-Amin al-Kanemi as “Shehu (de facto ruler)” and notes the Sayfawa Mai remained nominal until 1846. R3ac argues:
- *History of Nigeria 2: Nigeria in the Nineteenth Century* (Falola, Mahadi, Uhomoibhi & Anyanwu; 1991/reprints), ch.2, says al-Kanemi became the virtual ruler while Mai Ibrahim retained traditional/dynastic legitimacy; the Sayfawa institution was abolished only in 1846.
- The same book says al-Kanemi died in 1837 and son Umar succeeded.
- National Portrait Gallery identifies al-Kanemi as 1776–1837 and ties Umar's 1846 proclamation to the end of Sayfawa.
- Collins/Hodgkin's older secondary excerpt says death in 1835, producing an explicit conflict.

Independently verify:
- Whether “Mai Ibrahim” is the correct incumbent name/title and whether he held the office through 1846.
- Whether the wording “de facto ruler” and “traditional legitimacy” fairly summarizes the book.
- Whether Umar's role after 1837 but before 1846 is accurately described; do not conflate succession to the Shehu office with abolition of the Mai institution.
- Whether 1837 is better supported than 1835 and if the audit gives adequate weight to the conflicting source.
- The National Library PDF was text-extracted but not visually authenticated; do not claim a visual page verification.

Sources:
- History of Nigeria 2: https://nigeriareposit.nln.gov.ng/server/api/core/bitstreams/d5eb22ea-73b0-4867-9cf2-d7cfadc08534/content
- National Portrait Gallery: https://www.npg.org.uk/collections/search/person/mp84770/sheikh-muhammad-el-amin-el-kanemi
- Collins/Hodgkin excerpt: https://isamveri.org/pdfdkm/11/DKM110303.pdf

### 3.3 Wadai — disputed accession of Muhammad al-Sharif

Current profile assigns Muhammad Sharif from 1835 with `hos_q=supported`. R3ac records divergent evidence:
- Barth/Carbou-derived lists have been reported as assigning 1834.
- Nachtigal-derived list traditions assign 1835.
- Robert O. Collins (2005, printed p.120) and the 1911 Britannica entry assign the intervention/installment and reign of Muhammad al-Sharif to 1838–1858.
- Dennis D. Cordell (1977), note 10, says at least six different Wadai king lists existed and the reign dates for 1813–1835 could not be precisely reconciled.

Independently verify:
- That the cited Collins p.120 says 1838 intervention/installment and 1838–1858 reign.
- That the 1911 Britannica entry does give 1838–1858.
- Cordell's exact scope: his note discusses lists and date uncertainty for 1813–1835. Do not overstate that it directly proves a 1834/1835/1838 dispute for Muhammad al-Sharif unless the source genealogy supports that inference.
- Whether the 1834/1835 variants are traceable to primary/critical list sources or whether R3ac should label them only as secondary reported traditions.
- Whether Adam or any other claimant is relevant to 1836-01-01; do not choose a replacement ruler merely to fill the profile.
- Whether the most defensible result is to downgrade the current `since=1835` certainty and leave the 1836 snapshot unresolved.

Sources:
- Collins 2005: https://api.pageplace.de/preview/DT0400.9781135456702_A23803520/preview-9781135456702_A23803520.pdf (printed p.120; page screenshot was visually checked by author)
- Cordell 1977: https://www.cambridge.org/core/journals/journal-of-african-history/article/abs/eastern-libya-wadai-and-the-sanusiya-a-tariqa-and-a-trade-route/B79B4B1CD1F87C86A857CC20BA4FF746
- Britannica 1911: https://en.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica/Wadai

### 3.4 Darfur — Muhammad al-Fadl to Muhammad al-Husayn

Current profile lists Muhammad al-Fadl, Sultan, from 1803. R3ac argues:
- M. W. Daly, *Darfur's Sorrow* (2007), chronology gives Muhammad al-Fadl 1803–1838 and Muhammad al-Husayn 1838–1873.
- O'Fahey et al., *Land in Dar Fur* (1983), includes a charter/translation in which al-Husayn refers to an earlier land grant by al-Fadl, supporting dynastic succession context.

Independently verify:
- Chronology dates, spelling/transliteration and year boundaries.
- Whether the charter actually confirms parent/son succession or only prior grant attribution; avoid claiming more than it says.
- Whether exact death/accession day is unknown and appropriately not invented.

Sources:
- Daly: https://assets.cambridge.org/97805218/76186/frontmatter/9780521876186_frontmatter.pdf
- O'Fahey et al.: https://www.cambridge.org/core/books/abs/land-in-dar-fur/translations-and-commentary/F2D238E6A87B75C0CFFB97807C664DD6

## 4. Structural and repository checks

Reproduce, do not merely accept the validation report:

- R3ac source matrix: **10 columns, 10 data rows**.
- R3ac patch decisions: **7 columns, 6 data rows**.
- R3ac open evidence requests: **5 columns, 7 data rows**.
- R3ac source registry delta: **8 columns, 10 data rows**.
- Cumulative H01 open evidence requests: **5 columns, 43 data rows**.
- Cumulative integrated source registry delta: **8 columns, 38 data rows**.

Check correct header, field placement, row rectangularity, duplicate source/request/patch IDs, URL column placement, Unicode/encoding, control characters, and source IDs. The initial source matrix draft was malformed and then corrected; review the final blob only. The final source matrix contains 10 columns; it has an explicit `relevant_scope` field and the URL in the last field.

Compare base `1dea95b089b8e2a661223e414f18ee2891c50ca8` to current HEAD. The pre-request compare showed 12 commits and 11 changed paths, all under `docs/research/H01_batch02_1836/`. Confirm that only documentation paths have changed and that there are no changes to:
- `src/`, `historical_data/`, `tests/`, assets, public/map, map ownership/geometry;
- engine, event runtime, save/schema/migrations;
- Android, Gradle, workflows, signing or secrets.

If HEAD has advanced, list new commits and changed paths in the review report.

## 5. Required output and verdict

Return a written report with a verdict for each:
- SOK title and reign: `PASS` / `CHANGES_REQUESTED` / `BLOCKED`
- BOR dual authority and death-year conflict: `PASS` / `CHANGES_REQUESTED` / `BLOCKED`
- WAD accession uncertainty: `PASS` / `CHANGES_REQUESTED` / `BLOCKED`
- DAR succession: `PASS` / `CHANGES_REQUESTED` / `BLOCKED`
- CSV/source registry structure: `PASS` / `CHANGES_REQUESTED` / `BLOCKED`
- Repository diff/scope: `PASS` / `CHANGES_REQUESTED` / `BLOCKED`

For each finding, provide exact file/section or CSV ID, source/page evidence, expected vs observed claim, severity and correction recommendation. Be strict about date precision and citation chains.

Conclude with one task-lifecycle verdict:
- `REVIEW_PASS` only if the R3ac research/documentation package passes independent review with its limitations explicit;
- `CHANGES_REQUESTED` if any material correction is needed;
- `BLOCKED` only if the review itself cannot be completed due to missing access/evidence.

This verdict applies only to R3ac's research documentation. It does not accept the owner's H01 task, approve numeric data, close R3ab, validate all 17 country profiles, or authorize runtime changes/S1.

## 6. Independence and no-write rule

- Re-fetch current branch HEAD and record the exact SHA.
- Do not edit, commit, merge, rebase, force-push or otherwise modify the R3ac change set during review.
- Do not fix findings directly; report exact evidence so ChatGPT can make bounded corrections and submit a new HEAD for re-review.
- Do not patch `historical_data/`, head-of-state fields, title enums, government presets, event data, map owners, engine, save/schema, workflows, Android or APK.
- Do not claim screenshot/page-image authentication for the Falola PDF; the source matrix states its text extraction was inspected but screenshot timed out.
- Do not erase the source conflict on al-Kanemi's death year or the uncertainty in Wadai.
- Keep independent reviewer verdict, owner acceptance and phase authorization separate.

## 7. Current disposition

`READY_FOR_INDEPENDENT_REVIEW / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`.

ChatGPT's work is author self-audit. Claude's independent review is pending. Owner acceptance remains separate.
