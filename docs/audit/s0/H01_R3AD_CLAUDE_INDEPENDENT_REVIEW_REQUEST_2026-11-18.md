# H01 R3ad — Claude Independent Review Request

**Request date:** 2026-11-18  
**Review state:** READY_FOR_INDEPENDENT_REVIEW — request only, not a verdict  
**Repository:** https://github.com/mtieu6470-maker/Victori3-mobile  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**R3ad base SHA before any R3ad research commit:** `b02af8dfc1ccac4ad5b3e0cbc42a51bf89ef1b79`  
**HEAD when this request was created:** `1cfc8bbf896e7606c46aa48e1bf87bc95b16b4ff`  
**Review target:** Fetch the current branch HEAD when you start. Record the exact SHA reviewed. The branch may contain subsequent documentation-only pointer/handoff/receipt commits.

> **Claude: start here when connecting to GitHub.** Review the exact R3ad source package and the post-integration cumulative records. Do not rely on ChatGPT's self-audit or this request's summary as proof. Independently verify the historical claims, source scope, CSVs and base-to-HEAD diff.

## 1. Purpose, independence and strict scope

The project owner directed ChatGPT to continue H01 research and documentation integration while Gemini Hydrogen document packaging was unreliable. Claude is reserved for an independent review of work Claude did not author or modify.

R3ad covers four officeholder profiles at the simulation snapshot **1836-01-01**:
- ASH — Asante: Kwaku Dua I / Fredua Agyeman.
- DAH — Dahomey: Ghezo / Adandozan.
- MAS — Macina / Hamdallahi: Ahmād Lobbo / Seku Amadu.
- BUG — Buganda: Ssuuna II / Suna II.

This is a **research/documentation-only** review. It does not authorize edits to live country profiles, political entities, titles, government presets, historical events, map ownership/borders, population data, assets, engine/runtime, tests, save/schema, Android, Gradle, workflows, signing, APKs or S1. Do not make any repository writes during review.

## 2. Files to inspect

### A. Primary R3ad package
1. `docs/research/H01_batch02_1836/H01_R3ad_GULF_OF_GUINEA_AND_GREAT_LAKES_RULERSHIP_AUDIT_VI.md`
2. `docs/research/H01_batch02_1836/H01_R3ad_SOURCE_EVIDENCE_MATRIX.csv`
3. `docs/research/H01_batch02_1836/H01_R3ad_PATCH_DECISIONS.csv`
4. `docs/research/H01_batch02_1836/H01_R3ad_OPEN_EVIDENCE_REQUESTS.csv`
5. `docs/research/H01_batch02_1836/H01_R3ad_SOURCE_REGISTRY_DELTA.csv`

### B. Integrated H01 records and scope
6. `docs/research/H01_batch02_1836/README_VI.md`
7. `docs/research/H01_batch02_1836/H01_INTEGRATED_AUDIT_REPORT_VI.md` — R3ad section
8. `docs/research/H01_batch02_1836/H01_VALIDATION_REPORT.md` — R3ad validation subsection
9. `docs/research/H01_batch02_1836/H01_REPO_INTEGRATION_MAP.md` — R3ad boundary
10. `docs/research/H01_batch02_1836/H01_OPEN_EVIDENCE_AND_ACCEPTANCE_REQUESTS.csv` — R3AD-01 to R3AD-09
11. `docs/research/H01_batch02_1836/H01_INTEGRATED_SOURCE_REGISTRY_DELTA.csv` — R3ad source rows
12. `docs/research/H01_batch02_1836/GITHUB_INTEGRATION_RECEIPT_R3ad.md`
13. `docs/coordination/AI_HANDOFF.md`
14. `docs/coordination/AI_COLLABORATION_PROTOCOL.md`

### C. Live profiles — comparison only, do not modify
15. `historical_data/countries/_core_profiles_asia_africa.json` — compare ASH, DAH, MAS and BUG values against the research. No data patch is requested or authorized.

## 3. Historical/source review requirements

### 3.1 Asante — Kwaku Dua I
R3ad states that Kwaku Dua (personal name Fredua Agyeman) succeeded Osei Yaw Akoto in 1834, was the son of Queenmother Amma Sewaa, and ruled 1834–1867. Wilks supports the year-level succession/reign. *History of Ashanti*, a royal committee history compiled in 1937–1946 and later edited by T. C. McCaskie, gives Monday 25 August 1834 as “most probably” the enstoolment date.

Independently check:
- Exact names, predecessor/succession wording and reign years in Wilks.
- Whether the History of Ashanti chapter and printed page locator support the exact quoted date and its “most probably” qualification.
- Whether R3ad clearly distinguishes a retrospective royal history from a contemporary enstoolment record.
- Whether “Asantehene” and Golden Stool are used accurately; avoid treating the stool as a separate office.

Sources listed in the source matrix include:
- Wilks, “Kwaku Dua I”: https://dacb.org/stories/ghana/kwaku-dus/
- *History of Ashanti* (2022 edition; chapter 11): https://www.jstor.org/stable/jj.31510226.20

### 3.2 Dahomey — Ghezo and Adandozan
R3ad states that Ghezo came to power in 1818 through a coup/revolution that deposed Adandozan. It treats Adandozan's omission from later official king lists and the description of him as merely a regent as contested political memory, not a settled legal conclusion.

Independently check:
- Whether Boss supports the 1818 revolution/removal of Adanzan and installation of Prince Gahkpe/Gezo.
- Whether Soumonni's account supports the coup interpretation and the historiographical challenge to “mere regent” status.
- Whether Adeyinka's source record supports 1818–1858, while noting that the accessible publisher abstract is not the full article.
- Whether Larsen's preview is represented only within its actual inspection level.
- Whether the audit distinguishes contemporary evidence, later dynastic memory, and scholarly reconstruction without presenting contested motives as settled fact.

Sources:
- Boss thesis: https://eprints.soas.ac.uk/29461/1/10731617.pdf
- Soumonni chapter: https://ndl.ethernet.edu.et/bitstream/123456789/9789/1/133.pdf.pdf
- Adeyinka article/publisher record: https://www.cambridge.org/core/journals/african-studies-review/article/abs/king-gezo-of-dahomey-18181858-a-reassessment-of-a-west-african-monarch-in-the-nineteenth-century/9B1806941578F189D9C69F06EBB87CCD
- Larsen preview: https://api.pageplace.de/preview/DT0400.9781000899634_A46195288/preview-9781000899634_A46195288.pdf

### 3.3 Macina / Hamdallahi — Ahmād Lobbo / Seku Amadu
R3ad distinguishes the founder's personal rule from the state's 1818–1862 lifespan. It records competing death-year traditions (1844/1845) and notes that the known form of `Tārīkh al-fattāsh` contains nineteenth-century textual layers associated with legitimating the founding ruler.

Independently check:
- What Nobili (2020) actually says about the state's dates, Ahmād Lobbo's life/rule and succession; do not assign 1818–1862 to one person.
- Whether 1844/1845 is accurately represented as unresolved and whether the audit avoids inventing a precise death day.
- Whether the chronicle critique is accurately scoped to the textual tradition and does not overstate that every passage is fabricated or worthless.
- Whether “Caliph” and “Almami” are treated as title variants requiring evidence rather than interchangeable certainty.
- Whether the U.S. DoD overview is only used as broad secondary context.

Sources:
- Nobili, CUP excerpt: https://assets.cambridge.org/97811084/79509/excerpt/9781108479509_excerpt.pdf
- U.S. DoD overview: https://www.esd.whs.mil/Portals/54/Documents/FOID/Reading_Room/Litigation_Release/Litigation%20Release%20-%20Final%20Report-West%20African%20Jihadist%20Movements%20%20201407.pdf

### 3.4 Buganda — Ssuuna II
R3ad identifies Ssuuna/Suna/Ssuuna II as Kabaka at the 1836 snapshot, while separating ruler identity from the disputed start year: c.1830 in Reid/Médard, 1832 in the current official Kingdom of Buganda publication, and 1836 in the UNESCO Kasubi nomination dossier.

Independently check:
- Reid's explicit limitations on dating pre-Muteesa kings and the approximate c.1830 chronology.
- Médard's appendix and whether it independently supports an approximate c.1830 start.
- Exact wording in the official Kingdom publication (Kalema Ssuuna II, 1832–1856) and UNESCO nomination (Suuna II, 1836–1856).
- Whether all sources support Ssuuna II's presence in 1836 even though the accession year differs.
- Whether alias mapping is cautious: do not split Suna/Suuna/Ssuuna into distinct rulers or claim “Kalema” is definitively an independently verified alias without the requested collation.

Sources:
- Reid thesis: https://eprints.soas.ac.uk/33564/1/11010323.pdf
- Médard thesis: https://files01.core.ac.uk/download/pdf/52811096.pdf
- Kingdom of Buganda official history: https://buganda.or.ug/wp-content/uploads/2025/04/Final-Print-BRIEF-HISTORY-OF-THE-KINGDOM-OF-BUGANDA-3.pdf
- UNESCO nomination: https://whc.unesco.org/uploads/nominations/1022.pdf

## 4. CSV and integration checks — reproduce, do not simply accept the author's counts

Expected R3ad structural counts:
- Source evidence matrix: **10 columns, 12 data rows**.
- Patch decisions: **7 columns, 6 data rows**.
- Open evidence requests: **5 columns, 9 data rows**.
- Source registry delta: **8 columns, 12 data rows**.

Expected cumulative counts after R3ad integration:
- H01 open evidence and acceptance requests: **5 columns, 52 data rows**.
- Integrated source registry delta: **8 columns, 50 data rows**.

Check:
- Every row has the same field count as its header; UTF-8 and quoted commas/quotes are valid.
- No duplicate request IDs or source registry IDs after append.
- Source matrix IDs map unambiguously to source registry rows (do not assume ID formats are equivalent; identify any intentional prefix mapping or mismatch).
- URLs are in the correct columns; no shifted values or silent truncation.
- Patch decisions are recommendations only and must not read as applied patches.
- Open requests R3AD-01 through R3AD-08 remain open unless new evidence was independently supplied. R3AD-09 is the Claude review request.

## 5. Repository diff and review boundary

Compare base `b02af8dfc1ccac4ad5b3e0cbc42a51bf89ef1b79` with the exact current HEAD.

The original five R3ad research commits added only:
- R3ad audit;
- R3ad source evidence matrix;
- R3ad patch decisions;
- R3ad open evidence requests;
- R3ad source registry delta.

The integration added the R3ad section to cumulative H01 records, indexed the package, recorded CSV validation, created this independent review request, updated the shared handoff and wrote a GitHub integration receipt. Verify every changed path remains under `docs/`.

Confirm there are **no** changes to:
- `src/`, `historical_data/`, tests, assets, public/map or map ownership/geometry;
- country profiles, political entity registry, population totals or source runtime;
- engine, event runtime, save/schema/migrations;
- Android, Gradle, existing workflows, signing or APK artifacts.

Do not treat this research package as approval to change any live profile or advance S1.

## 6. Required output and verdict

Return a written review with a verdict for each:
- ASH year-level succession and qualified 25 August date: PASS / CHANGES_REQUESTED / BLOCKED
- DAH 1818 coup and Adandozan predecessor/legitimacy framing: PASS / CHANGES_REQUESTED / BLOCKED
- MAS personal reign/state duration/chronicle-layer distinction: PASS / CHANGES_REQUESTED / BLOCKED
- BUG 1836 ruler identity and start-year uncertainty: PASS / CHANGES_REQUESTED / BLOCKED
- Source matrix, patch decisions, open requests, source registry and cumulative CSV structure: PASS / CHANGES_REQUESTED / BLOCKED
- Base-to-HEAD repository scope: PASS / CHANGES_REQUESTED / BLOCKED

For each finding give exact file/section or CSV row ID, source/page evidence, expected vs observed claim, severity and a bounded correction recommendation.

Conclude with one task-lifecycle verdict:
- `REVIEW_PASS` only if the R3ad documentation package passes independently and source/inspection limitations are explicit.
- `CHANGES_REQUESTED` if any material factual, citation, structural or scope correction is needed.
- `BLOCKED` only if the review itself cannot be completed because required access/evidence is unavailable.

This verdict applies only to R3ad research documentation. It does not close R3ab/R3ac, validate all H01 entities, approve population or map data, accept the H01 task, or authorize runtime changes/S1.

## 7. Independence and no-write rule

- Re-fetch the current branch HEAD and report the exact SHA reviewed.
- Do not edit, commit, merge, rebase, force-push or otherwise modify the reviewed change set.
- Do not fix findings directly; return evidence so ChatGPT can make bounded corrections and submit a new HEAD for re-review.
- Do not change live profile fields, political entities, title enums, government presets, event data, population, map owners, engine, save/schema, workflows, Android or APK.
- Distinguish direct text inspection, publisher abstract/preview, transcription and visually authenticated page images. Do not claim visual authentication where none was performed.
