# HY-01 v2 — Progress report for Claude

- Date: 2026-11-22
- Implementer: ChatGPT (taking over Hydrogen's research task because Hydrogen cannot access GitHub)
- Branch: `ccr-b27f3fb8-epfpd6`
- Scope: HY-01 only. **HY-04 has not been started.**
- Status: **WORKING REGISTER — NOT READY FOR FINAL ACCEPTANCE**

## Source-of-truth files read

1. `docs/research/media/HY01_GAP_LIST_1836.csv`
   - Blob SHA: `271f73c3053f0d38235a9d268cc2ceea5464087a`
   - 186 polity IDs read from this file; IDs are preserved exactly.
2. `docs/research/media/HY01_CLAUDE_REVIEW_2026-11-22.md`
   - Blob SHA: `758ba5a13ffa09113cbd6fec43b9aa80e4c39bf7`
   - Applied priority order: sovereign → subject → de_facto_independent → rebel → decentralized.

## Current deliverable

`docs/research/media/HY01_FLAGS_ARMS_1836_v2.csv`

- 332 asset-gap rows: 155 missing-flag records + 177 missing-arms records, derived from the two `has_licensed_*` columns in the gap list.
- All 186 polity IDs are retained as supplied by the gap file; no aliases or inferred IDs substituted.
- Sorted by the requested political-status priority.
- Fifteen item-level Wikimedia Commons file pages have been opened and their license statements read directly from those pages:
  - `AFG` — flag, 1826–1880; CC0 1.0; original 1365 × 2048.
  - `HER` — flag of Herat, 1818–1842; Commons says public domain as simple geometry; original 512 × 341.
  - `HAW` — flag, 1816–1845; PD-self; original 1200 × 600.
  - `CHL` — civil flag, 1826–1854; Chilean public-domain/common-cultural-heritage statement, with author/source acknowledgment required; original 1000 × 555.
  - `SAR` — civil flag and civil ensign, 1816–1848; PD-self and simple-geometry public domain; original 1050 × 700.
  - `SPA` — flag design dated 1785 and described as used 1785–1927; PD-self; original 900 × 600.
  - `BOL` — coat of arms, 1825 decree; PD-self; original 478 × 597. The file page quotes the 17 August 1825 decree. **Caveat:** verify whether a later 1829 arms revision superseded it before assigning it in-game.
  - `URU` — flag dated 1830–present; public domain under Uruguayan copyright laws 9.739 and 17.616, and simple-geometry status; original 512 × 341.
  - `SIA` — Siam state/naval ensign dated 1817–1855; uploader's public-domain release on Commons; original 900 × 600. Commons notes that the flag did not have a formal specification.
  - `PEU` — Peru flag 1825–1884; Commons page states CC BY-SA 2.5 and also marks the design public domain/ineligible for copyright; original 900 × 600. Preserve both statements; insignia restrictions are separate.
  - `MOR` — Alaouite plain red flag 1666–1915; uploader Flad releases worldwide public domain; original 900 × 600. Do not use the green-star flag for 1836.
  - `PRU` — Prussian Kingdom flag 1803–1892; custom permission allows any purpose, redistribution, derivative and commercial use with attribution to David Liuzzo; page kindly requests contact before use outside Wikipedia; original 1500 × 1000.
  - `SWE` — national flag of Sweden described as 1821–1844; original 1600 × 1000; creator Guilherme Paula releases worldwide PD-self. This is the national land flag, not the separate Sweden–Norway naval ensign.
  - `GRE` — old national land flag of Greece (1822–1970; 1974–1978); original 900 × 600; Commons marks it public domain as common property with no original authorship. Insignia restrictions remain separate.
  - `USA` — 24-star flag page checked (1822–1836; original 1,235 × 650), but not added as a gap row because the source gap list marks USA as missing coat of arms only, not national flag. The file is valid only on the campaign start date (1 January 1836) and carries a copyright-term uncertainty caveat.
- Every other unverified asset row currently uses `unknown` in source, license, author, resolution, dates and confidence fields. No guessed file URLs or licenses were inserted.
- `no_known_flag` has not been assigned yet. The current research has not established enough item-level negative evidence to assert absence of a historical flag for any of the 186 records. Unverified is not the same as no-known-flag.

## Verified Wikimedia Commons file pages

- AFG: https://commons.wikimedia.org/wiki/File:Flag_of_Afghanistan_(1826%E2%80%931880).svg
- PEU: https://commons.wikimedia.org/wiki/File:Flag_of_Peru_(1825%E2%80%931884).svg
- MOR: https://commons.wikimedia.org/wiki/File:Flag_of_Morocco_(1666%E2%80%931915).svg
- PRU: https://commons.wikimedia.org/wiki/File:Flag_of_the_Kingdom_of_Prussia_(1803-1892).svg
- HER: https://commons.wikimedia.org/wiki/File:Flag_of_Herat_until_1842.svg
- HAW: https://commons.wikimedia.org/wiki/File:Flag_of_Hawaii_(1816).svg
- CHL: https://commons.wikimedia.org/wiki/File:Flag_of_Chile_(Civil_Use,_1826-1854).svg
- SAR: https://commons.wikimedia.org/wiki/File:Civil_Flag_and_Civil_Ensign_of_the_Kingdom_of_Sardinia_(1816-1848).svg
- SPA: https://commons.wikimedia.org/wiki/File:Flag_of_Spain_1785.svg
- BOL arms: https://commons.wikimedia.org/wiki/File:Coat_of_arms_of_Bolivia_(1825).svg
- USA: https://commons.wikimedia.org/wiki/File:Flag_of_the_United_States_(1822%E2%80%931836).svg
- SWE: https://commons.wikimedia.org/wiki/File:Flag_of_Sweden_(1818-1844).svg
- GRE: https://commons.wikimedia.org/wiki/File:Flag_of_Greece_(1822-1978).svg

## Important exclusions / quality notes

- Do not use the Khanate of Khiva flag page for 1836: the Commons description ties the known design to the 1917–1922 civil-war period.
- Do not use a modern recreation's CC0 license as proof that the represented historical flag is authentic.
- Do not backdate modern flags or later designs.
- The register is not a claim that the remaining 318 asset rows have been exhaustively searched; they are explicitly marked unknown and require continued research.
- The CSV is a research register, not a production asset manifest. Claude should not merge unknown rows into `identity_assets.json`.

## Commits

- Initial working register: `afd7925d4f635a2e27b352cd1a4ae025bb036622`
- Bolivia arms provenance update: `7bbee92cfaee4e35f8e63e8caf6ab788607af316`
- Siam and Uruguay flag provenance update: `c12292d10bdbad25c470be6fc0a5228a60720df9`
- Peru, Morocco and Prussia flag provenance update: `ab7a0723192c103bc4e4b85df0f5e0c0ba771fec`
- Sweden flag gap-row update: `db2d68fdc74350b1b65adcf7a0f8b0a326bacba4`
- Greece flag gap-row update (current CSV commit): `3697acc50ae5de9c995c7f64b69b961090d9b3d2`
- Current CSV blob SHA: `5bebf786ff6980ce097e435f0a38cf342ed3a941`
- Verified polity count: 14 (13 flags + BOL arms); 15 Commons file pages reviewed including USA reference-only page, which is not an asset-gap row.

## Next HY-01 work

Continue searching and opening the exact Commons file pages in priority order. For each file, record exact file-page license wording, creator/credit, original dimensions, and evidence that the design is valid for 1836. For entities without a historical flag, use `asset_type=no_known_flag` only when a defensible source supports that conclusion; otherwise retain `unknown`. Do not proceed to HY-04 until HY-01 v2 is reviewed and accepted.


## Additional HY-01 search pass (after the initial 15 file-page checks)

A further targeted Commons pass checked candidate material for Belgium, Denmark, Oman and Asante. **No additional asset was added to the verified count** because the candidates failed at least one of the project’s 1836 validity / correct polity / reuse-clearance tests:

- Belgium 1830 horizontal flag SVG: Commons labels it as the 1830 flag and marks the vector PD-self, but the page's own category identifies the design as 1830–1831; not accepted as a national flag valid at the 1 January 1836 start date.
- Belgium great coat of arms: Commons identifies the official Royal Decree / design date as 1837, so it is not valid for the 1836 start date.
- Denmark royal coat of arms 1819–1903: date range fits 1836 and a CC BY-SA 3.0/GFDL page was found, but the page explicitly warns that official Danish insignia are subject to legal restrictions (Danish Criminal Code §132 and other rules). It is not treated as cleared for commercial game use.
- Denmark general/current coat-of-arms SVG: uploader public-domain dedication is visible, but the page also warns of Danish official-insignia restrictions and does not establish that this is a verified 1836 rendering.
- Omani Empire flag (1696–1856): Commons page gives CC BY-SA 4.0 and dates the representation 1696–1856, but the current HY-01 gap row for OMA is **coat_of_arms only**, not national_flag; this flag cannot fill the arms gap.
- Asante/Ashanti flag candidate: CC0 file page was surfaced, but the page does not provide adequate historical dating/provenance for a 1836 state flag; not added.
- Oman modern state emblem/coat of arms candidates date from 20th/21st century and are not evidence for the 1836 arms.

Therefore the verified sovereign count remains **14/40**, and the asset CSV remains unchanged (blob SHA `5bebf786ff6980ce097e435f0a38cf342ed3a941`). These are discovery exclusions, not assertions that the polities had no flag/arms. Continue to leave unverified fields as `unknown`.


## Additional HY-01 verification — Denmark (DEN)

- Added DEN national flag using Commons file page https://commons.wikimedia.org/wiki/File:Flag_of_Denmark.svg.
- Commons identifies the file as the Dannebrog and marks it public domain under the simple-geometry/common-property rationale; original SVG nominal dimensions 512 × 387. Official-insignia restrictions are explicitly independent of copyright and remain a separate legal review item.
- Historical validity: the Danish Flag Society's historical booklet records the ordinance of 11 July 1748 defining the rectangular merchant flag (stutflag) without swallowtail and its proportions. The same source chronology notes that private flag-flying was prohibited by royal resolution in 1833; this does not mean the flag ceased to be the state/merchant ensign. The row therefore records 1748–present and explicitly notes the 1836 restriction on private use.
- Historical evidence source: https://www.danmarks-samfundet.dk/wp-content/uploads/2019/03/Infopjece-Dannebrog800-Anden-udgave-english.pdf.
- DEN coat of arms remains unknown; no attempt was made to substitute the later royal arms because the file page/license/1836 use were not cleared.

Verified sovereign polity count is now **15/40** (previously 14/40). Asset CSV now contains 15 verified sovereign IDs with at least one verified asset row; unknown asset rows: **317/332**. The CSV remains a working research register, not a production manifest. Denmark is a newly added flag row, not a complete polity asset set.
