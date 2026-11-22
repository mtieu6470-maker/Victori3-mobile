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
- Fourteen item-level Wikimedia Commons file pages have been opened and their license statements read directly from those pages:
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

## Important exclusions / quality notes

- Do not use the Khanate of Khiva flag page for 1836: the Commons description ties the known design to the 1917–1922 civil-war period.
- Do not use a modern recreation's CC0 license as proof that the represented historical flag is authentic.
- Do not backdate modern flags or later designs.
- The register is not a claim that the remaining 319 asset rows have been exhaustively searched; they are explicitly marked unknown and require continued research.
- The CSV is a research register, not a production asset manifest. Claude should not merge unknown rows into `identity_assets.json`.

## Commits

- Initial working register: `afd7925d4f635a2e27b352cd1a4ae025bb036622`
- Bolivia arms provenance update: `7bbee92cfaee4e35f8e63e8caf6ab788607af316`
- Siam and Uruguay flag provenance update: `c12292d10bdbad25c470be6fc0a5228a60720df9`
- Peru, Morocco and Prussia flag provenance update: `ab7a0723192c103bc4e4b85df0f5e0c0ba771fec`
- Sweden flag gap-row update (current CSV commit): `db2d68fdc74350b1b65adcf7a0f8b0a326bacba4`
- Current CSV blob SHA: `2122f7abb90bdbca34e26085d09aeaf408d6a260`

## Next HY-01 work

Continue searching and opening the exact Commons file pages in priority order. For each file, record exact file-page license wording, creator/credit, original dimensions, and evidence that the design is valid for 1836. For entities without a historical flag, use `asset_type=no_known_flag` only when a defensible source supports that conclusion; otherwise retain `unknown`. Do not proceed to HY-04 until HY-01 v2 is reviewed and accepted.
