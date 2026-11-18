# H01 R3ab — Claude Independent Review Request

**Request date:** 2026-11-18  
**Review state:** `READY_FOR_INDEPENDENT_REVIEW` — this is a request, not a verdict  
**Repository:** https://github.com/mtieu6470-maker/Victori3-mobile  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7` (default branch)  
**Base SHA before R3ab:** `0f5685231569ed4c72783cdd79a8abed63819943`  
**Pre-request HEAD:** `8f37c2ab31d77aa5a03b63cc0eb27091410c9398`  
**Review target:** fetch the branch's current HEAD when starting; the target is the commit that contains this review request (or a later HEAD if the branch has advanced). Record the exact SHA actually reviewed.

> **Claude: start here when connecting to the repository.** Re-fetch the branch HEAD, read this request first, then inspect the exact changed paths and evidence below. Do not rely on chat summaries, prior AI conclusions, or a stale default-branch view.

## 1. Purpose and review boundary

The owner has directed ChatGPT to handle H01 research, source collation, document packaging and repository integration for now. Claude is assigned as the **independent reviewer** of the R3ab research/documentation work. Claude did not author the target R3ab changes in this task; preserve that independence.

Review the bounded R3ab package concerning the 1836 officeholder and sovereignty interpretation for:
- Futa Jallon (FJA),
- Ethiopia (ETH),
- Liberia / the ACS-administered settlements (LIB).

This is a **research-layer review only**. It is not permission to change game code, data, profiles, country government presets, map ownership, event timelines, save formats, workflows, APKs or S1 scope.

The comparison from base `0f5685231569ed4c72783cdd79a8abed63819943` to pre-request HEAD `8f37c2ab31d77aa5a03b63cc0eb27091410c9398` showed 17 commits and 13 changed paths; all changed paths were under `docs/`. The review-request file itself is an additional documentation-only path. Re-run the GitHub compare against the exact target SHA before giving a verdict.

## 2. Required files — read in this order

### A. Review request and primary research packet

1. `docs/research/H01_batch02_1836/H01_R3ab_1836_AFRICAN_POLITY_OFFICEHOLDER_AUDIT_VI.md`
2. `docs/research/H01_batch02_1836/H01_R3ab_SOURCE_EVIDENCE_MATRIX.csv`
3. `docs/research/H01_batch02_1836/H01_R3ab_PATCH_DECISIONS.csv`
4. `docs/research/H01_batch02_1836/H01_R3ab_OPEN_EVIDENCE_REQUESTS.csv`
5. `docs/research/H01_batch02_1836/H01_R3ab_SOURCE_REGISTRY_DELTA.csv`

### B. Cumulative integration and controls

6. `docs/research/H01_batch02_1836/README_VI.md`
7. `docs/research/H01_batch02_1836/H01_INTEGRATED_AUDIT_REPORT_VI.md` — especially section 9 (R3ab)
8. `docs/research/H01_batch02_1836/H01_VALIDATION_REPORT.md` — R3ab validation subsection
9. `docs/research/H01_batch02_1836/H01_REPO_INTEGRATION_MAP.md` — R3ab integration boundary
10. `docs/research/H01_batch02_1836/H01_OPEN_EVIDENCE_AND_ACCEPTANCE_REQUESTS.csv` — R3AB-01 through R3AB-09
11. `docs/research/H01_batch02_1836/H01_INTEGRATED_SOURCE_REGISTRY_DELTA.csv` — R3ab source rows
12. `docs/research/H01_batch02_1836/GITHUB_INTEGRATION_RECEIPT_R3ab.md`
13. `docs/coordination/AI_HANDOFF.md` — active role allocation, current review pointer and R3ab work log
14. `docs/coordination/AI_COLLABORATION_PROTOCOL.md` — reviewer independence and status rules

The research README and shared AI handoff both link to this review request. The receipt records the R3ab commit chain and the prior structural checks.

## 3. Historical claims requiring independent verification

Do not merely check that the cited source exists. Verify that the source actually supports the exact statement, date, name, office and jurisdiction attributed to it. Record page numbers and quote only the minimum text needed to demonstrate the finding.

### 3.1 Futa Jallon — Bubakar / Almami

The R3ab dossier proposes **Bubakar as a provisional Almami candidate at the simulation snapshot 1836-01-01**. The basis is Boubacar Barry, *Senegambia and the Atlantic Slave Trade* (1997), printed p.150, whose searchable text reproduction is recorded as saying Bubakar held the office from May 1827 to November 1836, except for a three-month interruption in 1831, and yielded to Yaya after November 1836.

Check:
- Whether the exact p.150 wording, dates and interruption are correctly transcribed and whether the cited edition/page is correct.
- Whether the snapshot date 1836-01-01 is safely inside the stated tenure, given the source's precision and any chronology conflicts.
- Whether the form “Bubakar” is correctly reconciled with “Bubakar mo Almaami Bademba mo Karamoko Alfa mo Timbo” in Diallo Lélouma & Salvaing (2017), and whether aliases should be retained.
- Whether the two-clan Alfaya/Soriya alternation, council of elders and provincial chiefs are described with defensible institutional nuance, not overstated as either a modern constitution or absolute centralized monarchy.
- Whether the report correctly labels Barry p.150 as a text trace whose original page image has **not** been authenticated.

Important disambiguation: Robinson, Curtin & Johnson (1972), “A Tentative Chronology of Futa Toro,” concerns **Futa Toro**, not Futa Jallon/Timbo. It is included as a negative control. Confirm that no Futa Toro officeholder chronology has been imported into FJA.

Sources listed in the R3ab matrix:
- Barry (1997), publisher/book record: https://www.cambridge.org/core/books/senegambia-and-the-atlantic-slave-trade/7ECE5F51680CB6FDD913164626AD07B8/listing
- Diallo Lélouma & Salvaing (2017), *Islamic Africa* 8: https://brill.com/view/journals/iafr/8/1-2/article-p70_70.pdf
- Futa Toro negative-control chronology: https://www.persee.fr/doc/cea_0008-0055_1972_num_12_48_2738

### 3.2 Ethiopia — nominal emperor vs de facto power

R3ab separates:
- **Sahle Dengel** as nominal emperor/ruler for the 1832–1840 interval;
- **Ras Ali Alula / Ali II** as the effective power-holder in central Ethiopia, with aliases including Ali Tannaš and Ali Tǝkku in the cited reference;
- **Mänän Libän Amäde** as a major political actor, whose regency is specifically described for Ali's youth and whose influence is time-bounded.

Check:
- Crummey's “Śahlä Dǝngǝl” entry (2010, *Encyclopaedia Aethiopica*, IV, pp.464–465) supports the 1832–1840 nominal-ruler interval.
- Rubenson's “Ali Alula” entry (2003, *Encyclopaedia Aethiopica*, I, p.199) supports the identification/aliases, 1830–1853 effective rule, and Mänän's influence during the first decade.
- Ficquet's “Yäǧǧu” (2014, V, pp.12–15) and Dege's “Zämänä mäsafǝnt” (2014, V, pp.122–129) support the institutional context and succession, while recording chronology/source complexity.
- The dossier does **not** claim that Mänän was formally regent on the exact day 1836-01-01. Check that this caveat is preserved.
- Check whether “de facto ruler”, “Ras”, “regent” and “nominal emperor” are used precisely and do not collapse into one `hos` value without explaining the data-model limitation.
- Ensure Ali Alula/Ali II is one person with aliases, not two people.

Source URLs:
- Crummey: https://www.habeshahistory.com/encyclopedia/sahla-dengel-p0491-a-y4857-v4
- Rubenson: https://www.habeshahistory.com/encyclopedia/ali-alula-p0229-a-y1682
- Ficquet: https://www.habeshahistory.com/encyclopedia/yaggu-p0044-b-y4980-v5
- Dege: https://www.habeshahistory.com/encyclopedia/zamana-masafent-p0154-b-y4842-v5

### 3.3 Liberia — colonial agent vs sovereign head of state

R3ab states that Liberia was not yet an independent sovereign state in 1836:
- Frederick Starr (1913), *Liberia: Description, History, Problems*, lists **Anthony D. Williams** as agent in 1836.
- Starr records **Thomas Buchanan** arriving in January 1836 and being in charge of Bassa settlements; he becomes governor in 1839, not 1836.
- U.S. Department of State historical context places Commonwealth formation in 1838 and independence in 1847.

Check:
- The exact Starr appendix entries and the “Agents and Governors” list.
- That Buchanan's Bassa-settlement jurisdiction is not generalized to the whole colony or Monrovia agency.
- That no exact day is inferred for Buchanan's January arrival, nor that he was necessarily present on 1836-01-01.
- That the record distinguishes “head of state not applicable because non-sovereign colony” from “head-of-state identity missing”. The current profile's `hos=null` / `hos_q=missing` semantics are only flagged for future data-model review; R3ab does not patch them.
- That Roberts or a later Liberian president is not back-projected into 1836.

Sources:
- Starr (1913): https://www.gutenberg.org/files/54542/54542-h/54542-h.htm
- U.S. Department of State, “Founding of Liberia, 1847”: https://history.state.gov/milestones/1830-1860/liberia

## 4. Structural and repository verification

Reproduce these checks independently; do not accept the validation report at face value.

### 4.1 CSV structure

The committed validation reports these counts:
- R3ab source evidence matrix: **10 columns, 9 data rows** (including one Futa Toro negative-control source).
- R3ab patch decisions: **7 columns, 6 data rows**.
- R3ab open evidence requests: **5 columns, 9 data rows**.
- R3ab source registry delta: **8 columns, 8 data rows**.
- Cumulative H01 open evidence requests: **5 columns, 36 data rows**.
- Cumulative H01 source registry delta: **8 columns, 28 data rows**.

Parse every row, verify consistent column counts, headers, duplicate IDs, empty mandatory fields, URL placement, encoding and control characters. The first draft of the R3ab source registry was corrected because URL columns were initially omitted; verify the **final** version and cumulative registry, not the superseded draft.

### 4.2 Changed-file scope

Re-fetch the branch HEAD and compare it with base SHA `0f5685231569ed4c72783cdd79a8abed63819943`. The pre-request compare showed 17 commits / 13 changed paths, all under `docs/`; the review request adds one more docs path. Confirm there are no modifications under:
- `src/`
- `historical_data/`
- `tests/`
- `assets/`, `public/`, map geometry/ownership
- Android, Gradle, workflows
- save/schema/migration paths

If the branch advanced after this request was added, identify every additional commit and changed path before deciding whether the scope is still bounded.

### 4.3 Build/test interpretation

This task changes research and coordination documents only. No code test, build, APK workflow, APK installation or device test was performed or required. Do not interpret the prior APK workflow runs #96/#97 as validation of the R3ab HEAD; those runs targeted older code commits. Do not trigger an APK build for this review.

## 5. Review verdict and required output

Return a concise but evidence-rich review report with:

| Review category | Required verdict |
|---|---|
| FJA source and chronology | `PASS` / `CHANGES_REQUESTED` / `BLOCKED` |
| ETH role separation and chronology | `PASS` / `CHANGES_REQUESTED` / `BLOCKED` |
| LIB sovereignty and office jurisdiction | `PASS` / `CHANGES_REQUESTED` / `BLOCKED` |
| CSV / source registry structure | `PASS` / `CHANGES_REQUESTED` / `BLOCKED` |
| GitHub diff and scope compliance | `PASS` / `CHANGES_REQUESTED` / `BLOCKED` |

For every finding, give:
- file and section, or CSV row/ID;
- exact source/page or repository evidence;
- expected vs observed statement/value;
- severity and a concrete correction recommendation.

Conclude with one bounded task-lifecycle verdict:
- **`REVIEW_PASS`** — only if the R3ab research/documentation package passes this independent review, with all limitations explicit; or
- **`CHANGES_REQUESTED`** — if any material correction is required.
- Use **`BLOCKED`** only if independent review cannot be completed (for example, material sources or repository evidence are inaccessible).

A `REVIEW_PASS` here applies only to the R3ab research/documentation scope. It is not owner `ACCEPTED`, does not validate all 17 H01 entity populations, does not clear earlier R3l/R3aa open evidence, and does not authorize any runtime/game-data/S1 change.

## 6. Independence and no-write rule

- Re-fetch the current branch and exact HEAD before review.
- Do not edit, commit, merge, rebase, force-push, or otherwise modify the reviewed change set during the review.
- Do not fix findings directly in the target branch. Report them with file/row evidence so ChatGPT can implement a bounded correction and submit a new exact HEAD for re-review.
- Do not promote proposed names/values/roles into `historical_data/` or gameplay.
- Do not modify workflows, Gradle, Android, signing, secrets, save schema or engine.
- Do not claim source scans were visually authenticated where the R3ab matrix explicitly says only searchable text or secondary transcription was inspected.
- Keep “reviewer verdict”, “owner acceptance” and “phase authorization” separate.

## 7. Current disposition

`READY_FOR_INDEPENDENT_REVIEW / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`.

ChatGPT's source collation, CSV checks and repository compare are self-audit. Claude's independent verdict is pending. The owner retains final acceptance and all phase-transition authority.
