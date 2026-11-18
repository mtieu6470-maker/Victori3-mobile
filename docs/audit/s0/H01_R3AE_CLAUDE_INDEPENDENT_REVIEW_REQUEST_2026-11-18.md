# H01 R3ae — Claude Independent Review Request

**Request date:** 2026-11-18  
**Review state:** READY_FOR_INDEPENDENT_REVIEW — request only, not a verdict  
**Repository:** https://github.com/mtieu6470-maker/Victori3-mobile  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**R3ae base HEAD before the research package:** `3ba97713c2e767f201c300de51fddcc888d45321`  
**HEAD when this request was created:** `c12c526e5fa4c756ee3fea2253e20fce4b8b5800`  
**Review target:** Fetch the newest branch HEAD when review begins. Record the exact SHA reviewed and inspect any later commits.

> **Claude: start here when connecting to GitHub.** Independently inspect the R3ae primary package, sources, cumulative H01 integration, and the exact base-to-HEAD diff. Do not rely on ChatGPT's conclusions as evidence.

## 1. Purpose, independence and scope

The owner has authorized continuation of H01 historical research and documentation packaging. ChatGPT authored and integrated this R3ae package; Claude is reserved for independent review and must not have authored or modified R3ae.

R3ae concerns three 1836-01-01 officeholder profiles:
- **SHE — Shewa:** Sahle Selassie; start-year and Ras/Negus title chronology.
- **ZUL — Zulu:** Dingane kaSenzangakhona; Shaka's death/accession date and 1839–1840 succession chronology to Mpande.
- **BSO — Basotho:** Moshoeshoe I; inherited chiefship, Morena/Morena e Moholo titles and gradual polity formation.

This is a **research/documentation-only** review. It does not authorize any change to live game data, `historical_data/`, succession runtime, event data, map ownership, population, engine, UI, tests, assets, save/schema, Android, Gradle, workflows, signing or APKs. Do not write to the repository during review.

## 2. Files to inspect

### A. Primary R3ae package
1. `docs/research/H01_batch02_1836/H01_R3ae_SHE_ZUL_BSO_OFFICEHOLDER_AND_TITLE_AUDIT_VI.md`
2. `docs/research/H01_batch02_1836/H01_R3ae_SOURCE_EVIDENCE_MATRIX.csv`
3. `docs/research/H01_batch02_1836/H01_R3ae_PATCH_DECISIONS.csv`
4. `docs/research/H01_batch02_1836/H01_R3ae_OPEN_EVIDENCE_REQUESTS.csv`
5. `docs/research/H01_batch02_1836/H01_R3ae_SOURCE_REGISTRY_DELTA.csv`

### B. Integrated H01 records and review handoff
6. `docs/research/H01_batch02_1836/README_VI.md`
7. `docs/research/H01_batch02_1836/H01_INTEGRATED_AUDIT_REPORT_VI.md` — R3ae section
8. `docs/research/H01_batch02_1836/H01_VALIDATION_REPORT.md` — R3ae validation subsection
9. `docs/research/H01_batch02_1836/H01_REPO_INTEGRATION_MAP.md` — R3ae integration boundary
10. `docs/research/H01_batch02_1836/H01_OPEN_EVIDENCE_AND_ACCEPTANCE_REQUESTS.csv` — R3AE-01 to R3AE-08
11. `docs/research/H01_batch02_1836/H01_INTEGRATED_SOURCE_REGISTRY_DELTA.csv` — R3ae source rows
12. `docs/research/H01_batch02_1836/GITHUB_INTEGRATION_RECEIPT_R3ae.md`
13. `docs/coordination/AI_HANDOFF.md`
14. `docs/coordination/AI_COLLABORATION_PROTOCOL.md`

### C. Live data comparison only — do not modify
15. `historical_data/countries/_core_profiles_asia_africa.json` — compare SHE, ZUL, BSO fields.
16. `historical_data/leaders/heads_of_state.json` — confirm whether the three entities have succession arrays.
17. `historical_data/sources/sources.json` — confirm existing source metadata and whether new research claims are covered.

## 3. Historical/source review requirements

### 3.1 SHE — Sahle Selassie: start-year and title
R3ae observes:
- Darkwah (1967), printed pp.49–50, describes Wäsän Sägäd as Ras and Sahle Selassie assuming Ras on taking power; it places Sahle Selassie's self-proclamation as Negus in 1839 and reports that the clergy/nobles of Gondar did not recognize that title.
- Bekele (2010), *Encyclopaedia Aethiopica* IV, pp.465–467, likewise distinguishes Ras at accession from self-proclaimed `nəgus` c.1839, but its entry states 1806–1847 while also giving Wäsän Sägäd's rule as 1808–1813 and describing Sahle Selassie's accession after his father's death.
- Ethiopia Ministry of Education Grade 9 textbook (2023), Unit 8.5, lists Sahle Sellase's rule as 1813–1847.

Independently verify:
- Darkwah exact wording and page images at printed pp.49–50; verify how the 1839 letter is cited and avoid overstating its authorship, date or recognition coverage.
- Bekele's internal 1806/1813 chronology conflict; check if the conflict is an edition/transcription or source issue.
- Whether 1813 is the best-supported year-level start, while leaving the conflicting 1806 entry visible.
- Whether “Negus of Shewa since 1813” is anachronistic for 1836 if the title is said to have been self-proclaimed only c.1839.
- Distinguish the ruler of Shewa from the emperor/Negus at Gondar; do not collapse the two political offices.

Sources:
- Darkwah: https://pdfproc.lib.msu.edu/?file=%2FDMC%2FAfrican+Journals%2Fpdfs%2FInstitue+of+African+Studies+Research+Review%2F1967v3n3%2Fasrv003003003.pdf
- Bekele: https://www.habeshahistory.com/encyclopedia/sahla-sellase-p0492-a-y2418-v4
- Ethiopia MoE Grade 9 History textbook: https://anrseb.gov.et/Backup%20dec%202021/wp-content/uploads/New_Text_Books/Grade9/G9-History-STB-2023-ANRSEB.pdf

### 3.2 ZUL — Dingane and the Mpande transition
R3ae observes:
- Omer-Cooper's ODNB extract identifies Dingane as Zulu king and places Shaka's assassination in September 1828; it does not prove 22 September from the accessible extract.
- SAHO's Dingane biography gives 22 September 1828, describes Mpande's defection from September 1839, and places Dingane's defeat/flight in 1840.
- R3ae distinguishes the beginning of Mpande's rebellion/alliance in 1839 from his recognition/accession after the decisive events in 1840.

Independently verify:
- Whether 22 September 1828 has a traceable primary/critical source or a transparent secondary citation chain.
- Exact dates and order for Mpande's defection, Boer alliance, Battle of Maqongqo, Dingane's flight/death and Mpande's accession/recognition.
- That the report does not misstate 1839 as Mpande's completed accession.
- Whether the existing profile's 1828-09-22 date is suitable for exact-day use or should carry an explicit source precision caveat.

Sources:
- Omer-Cooper, ODNB: https://academic.oup.com/oxford-dictionary-of-national-biography/reference/63486/reference-article-abstract/580017742
- SAHO Dingane: https://sahistory.org.za/people/king-dingane-ka-senzangakhona

### 3.3 BSO — Moshoeshoe I, Morena and Basotho polity formation
R3ae observes:
- SAHO says Moshoeshoe succeeded his father Mokhachane as chief of BaMokoteli in 1820.
- Eldredge (2015) chapter summary describes BaMokoteli as a small chiefdom under Mokhachane in the 1810s and places Moshoeshoe in the context of early nineteenth-century movement, disruptions and changing chiefdom structures.
- Nyane (2019) discusses the historical distinction between Morena and Morena e Moholo and cites Machobane/Duncan for the caution that the exact date and manner Moshoeshoe assumed the office of Morena before Lifaqane cannot now be established with certainty. “Paramount Chief” may be a later/retrospective term.
- R3ae therefore rejects treating the current profile's `since=1822` and “King” label as a securely dated modern-style coronation.

Independently verify:
- SAHO's 1820 claim and whether it refers to inherited chiefship, not a later paramount title or modern monarchy.
- Eldredge's chapter summary versus the full chapter; do not claim page-level verification of unseen text.
- Nyane's exact wording and the underlying citations to Duncan/Machobane; check whether it supports date uncertainty specifically for Morena or Morena e Moholo.
- Whether Morena e Moholo developed as a political status over time; avoid projecting present-day Lesotho constitutional language or borders onto 1836.
- Whether the report overstates “gradual incorporation” without local-level evidence.

Sources:
- Eldredge chapter: https://www.cambridge.org/core/books/abs/kingdoms-and-chiefdoms-of-southeastern-africa/caledon-river-valley-and-the-basotho-of-moshoeshoe-182133/6B34835F371D0480D5FBBF5460A27CE3
- SAHO Moshoeshoe: https://sahistory.org.za/people/king-moshoeshoe-i
- Nyane: https://www.scielo.org.za/scielo.php?pid=S1727-37812019000100027&script=sci_arttext
- Thabane: https://oxfordre.com/africanhistory/view/10.1093/acrefore/9780190277734.001.0001/acrefore-9780190277734-e-1328

## 4. CSV structural and source-mapping checks — reproduce

Expected R3ae counts:
- Source evidence matrix: **10 columns, 9 data rows**.
- Patch decisions: **7 columns, 7 data rows**.
- Open evidence requests: **5 columns, 8 data rows**.
- Source registry delta: **8 columns, 9 data rows**.

Expected cumulative counts after R3ae integration:
- H01 open evidence and acceptance requests: **5 columns, 60 data rows**.
- H01 integrated source registry delta: **8 columns, 59 data rows**.

Check:
- Every CSV row has the same field count as its header; quoted commas/quotes and Unicode are parsed correctly.
- No duplicate request IDs or registry IDs after append.
- Each R3ae source matrix ID maps to exactly one registry row with the `SRC_H01_` prefix.
- URLs remain in the correct column and no field is silently shifted.
- Patch decisions are clearly non-executing recommendations.
- R3AE-08 remains PENDING_REVIEW; do not mark it resolved or accepted.

## 5. Repository diff and scope
Compare base `3ba97713c2e767f201c300de51fddcc888d45321` with the exact newest HEAD.

Expected changed paths are all under `docs/`:
- five R3ae research files;
- this independent review request;
- cumulative H01 audit, validation, integration map, README, open evidence register and source registry;
- R3ae GitHub receipt;
- shared AI handoff.

Confirm there are no changed paths under:
- `src/`, `historical_data/`, tests, assets, public/map or map ownership/geometry;
- `android/`, Gradle, existing workflows, signing or APK artifacts.

Also verify the R3ae report accurately states that `historical_data/leaders/heads_of_state.json` contains no SHE, ZUL or BSO succession arrays at the base HEAD; do not confuse an empty entity list with a confirmed absence of succession evidence in all scholarship.

## 6. Required reviewer output and verdict

Give a verdict for each:
- SHE — identity, 1806/1813 start-year conflict and Ras/Negus chronology: PASS / CHANGES_REQUESTED / BLOCKED
- ZUL — Dingane's reign, exact accession-day qualification and 1839/1840 Mpande sequence: PASS / CHANGES_REQUESTED / BLOCKED
- BSO — Moshoeshoe's early chiefship, Morena/Morena e Moholo distinction and title precision: PASS / CHANGES_REQUESTED / BLOCKED
- Source matrix, decisions, open requests, registry and cumulative CSVs: PASS / CHANGES_REQUESTED / BLOCKED
- Base-to-HEAD repository scope: PASS / CHANGES_REQUESTED / BLOCKED

For each finding, include the exact file/section or CSV ID, source/page evidence, expected versus observed claim, severity and bounded correction proposal.

Conclude with one lifecycle verdict:
- `REVIEW_PASS` only if the R3ae documentation package passes independent review and all source-inspection limitations are explicit.
- `CHANGES_REQUESTED` if any material factual, citation, structure or scope correction is needed.
- `BLOCKED` only if the review cannot be completed due to missing access or indispensable evidence.

This verdict applies only to R3ae documentation. It does not accept H01, promote profile values, close R3ab/R3ac/R3ad, approve succession runtime, or authorize game/data/S1 changes.

## 7. Independence and no-write rule
- Re-fetch and report the exact current branch HEAD.
- Do not edit, commit, merge, rebase, force-push or otherwise modify the reviewed change set.
- Do not fix findings directly; return evidence for ChatGPT to make bounded corrections and submit a new HEAD.
- Do not modify any live country profile, `heads_of_state.json`, sources runtime, event data, population, map ownership, engine, save/schema, Android, Gradle, workflows or APK.
- Preserve the distinction between direct text, page-image inspection, abstract, preview and metadata-only access.
