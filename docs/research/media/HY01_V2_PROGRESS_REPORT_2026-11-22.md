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


## Additional HY-01 verification — United States arms (USA)

- Added USA coat of arms using Commons file page https://commons.wikimedia.org/wiki/File:Great_Seal_of_the_United_States_of_America_(1782).svg.
- The file page identifies the design as the Great Seal of the United States (1782), cites Gaillard Hunt's 1892 historical study, and gives a 512 × 512 SVG.
- The uploader, Samhanin, dedicates the derivative drawing worldwide to the public domain under CC0 1.0. Commons separately marks the underlying 1782 work PD-old-assumed/PD-Art; that underlying-work status carries a stated theoretical uncertainty, so preserve the uploader's independent CC0 dedication as the basis for the derivative file's reuse.
- The Great Seal functions as the United States' national arms. Official-seal/insignia use restrictions are independent of copyright and must be reviewed separately before commercial game distribution.
- This fills the existing USA coat_of_arms gap; no USA flag row was added because the gap list does not request it.

Verified sovereign polity count is now **16/40**; unknown asset rows are **316/332**. This remains a research register, not a production manifest.


## Additional HY-01 candidate review — Paraguay (PAR), 2026-11-22

A targeted Commons search found a historically dated Paraguay flag candidate:
- File page: https://commons.wikimedia.org/wiki/File:Flag_of_Paraguay_(1826-1842).svg
- Commons description identifies the design as the flag of Paraguay from 1826 to 1842, so the stated date range includes the 1 January 1836 start date.
- Original SVG is 450 × 300. Creator/uploader: Orange Tuesday. The file page states that the author released the work into the public domain.
- This candidate was **not added** to HY01 CSV because the existing PAR gap row is `coat_of_arms` only. A national flag cannot fill a coat-of-arms gap. This is a type mismatch, not evidence that Paraguay lacked a flag or that the candidate is invalid.
- The page's 1836 historical validity is based on the Commons description; an independent period source has not yet been opened in this pass. Treat it as a candidate for a later corroboration pass, not a verified asset.
- Official-insignia restrictions, if applicable, remain a separate question from copyright.

Result: no CSV change; verified sovereign polity count remains **16/40** and the CSV blob SHA remains `cfdf1187f86c264496c66439ae6b75c51e2263b0`. Continue HY-01 by prioritizing candidates matching the exact missing `asset_type`, and do not begin HY-04 before HY-01 review/acceptance.


## Additional HY-01 v2 candidate audit — Ecuador and Bremen, 2026-11-22

Two exact-type coat-of-arms candidates were added to the research register after checking the Commons file pages and source chronology. Neither is promoted into the strict 1836-verified count in this pass because the precise 1 January 1836 validity test is not fully closed.

### ECU — Ecuador coat of arms (1835)

- Commons file: https://commons.wikimedia.org/wiki/File:Coat_of_arms_of_Ecuador_(1835).svg
- File page gives the design decree date as 10 August 1835 and says it was sanctioned on 14 June 1836; it transcribes the decree's description (sun on the ecliptic, seven stars, Pichincha peaks/condor, tower/condor).
- Reconstructed SVG by Milenioscuro, 765 × 900, CC BY-SA 3.0 Unported. Commercial reuse is permitted under the license subject to attribution and share-alike obligations for adaptations.
- The decree predates the start year, but the stated sanction date is after 1 January 1836. The precise effective/legal status on the game's start date therefore needs verification from the original Ecuadorian legal gazette or constitutional record. Keep as a candidate; do not yet count as 1836-verified.
- Official insignia rules are separate from copyright and require independent review.

### BRE — Bremen historical arms reference (1562)

- Commons file: https://commons.wikimedia.org/wiki/File:Coat_of_arms_of_Bremen_-_1562.jpg
- Commons identifies a 1562 sandstone relief of Bremen's arms, made under mayor Daniel von Büren by sculptor Szervas and installed at Herdentor. The photograph is by Till F. Teenck, 1772 × 1772, CC BY 3.0 (GFDL 1.2+ is also offered).
- Bremen State Archives documents the second city seal from 1366 to 1833/34 and its iconography; the Bremen state portal states that the key has appeared in the city's seal since 1366.
- The file is a photograph of a historical stone emblem, not a clean vector. The evidence supports a long-standing key symbol, but the exact coat-of-arms rendering in official use on 1 January 1836 is not fully established by the sources opened. Keep as a historical reference candidate; do not yet count as strict 1836-verified.
- Do not substitute the Napoleonic 1811 Bremen arms or the later 1891 standardized great arms. Official insignia restrictions are separate from copyright.

### Count and CSV integrity

- CSV rows remain **332/332**; ECU and BRE existing coat-of-arms rows were updated in place, no duplicate rows added.
- Current CSV blob SHA: `4101f0335d403760af9d3e2b2467d29120c0bf0c`.
- Strict verified sovereign count remains **16/40**. These two entries are source/license candidates with unresolved start-date validation, not additional verified polities.
- Do not begin HY-04. Continue exact-type, date-validity and reuse-clearance checks for the remaining HY-01 gaps.


## Additional HY-01 verification — Hamburg coat of arms (HAM), 2026-11-22

- Added HAM `coat_of_arms` using Commons file page: https://commons.wikimedia.org/wiki/File:Coat_of_arms_of_Hamburg.svg.
- The file page's German caption is `Kleines Landeswappen Hamburgs 1835`; it gives date 1835 and author `Freie und Hansestadt Hamburg`. This is an exact asset-type match and the date precedes the 1 January 1836 game start.
- Original SVG: 225 × 315. Commons marks the official work public domain under §5(1) of the German Copyright Act (official works of public-law corporations).
- Commons explicitly warns that use of coats of arms is subject to legal restrictions independent of copyright. The copyright license is clear; commercial use of the official insignia still requires separate legal review.
- This fills the existing HAM coat_of_arms gap; no flag row was added.

Result: strict verified sovereign count rises to **17/40**. CSV remains 332 rows; unknown asset rows now **315/332**. Current CSV blob SHA: `5ace2a6470a0570f4e49e881b804408b3ec1b6f5`.

Ecuador (1835 decree with 1836 sanction) and Bremen (1562 historical arms photograph) remain candidates pending exact confirmation of the emblem's legal/formal status on 1 January 1836; they are not counted in 17/40. Do not begin HY-04.


## Additional HY-01 v2 audit — Liechtenstein, San Marino, Qajar Persia, Belgium and Bolivia (2026-11-22)

### Strictly accepted in this pass

- **LIE coat of arms:** Commons file page dates the depiction to the 19th century and marks it public domain as an official work of a Liechtenstein public-law corporation. The Princely House states the House arms have been considered the large national arms since the principality was created in 1719. Use as historical reference; current insignia use is legally restricted.
- **SMR coat of arms:** Städel Museum drawing by Johann Anton Ramboux dated between 1818 and 1843, a period interval that includes 1 January 1836. The museum copyright holder applied Public Domain Mark 1.0. This is a contemporary-period drawing, not the later standardized official vector.
- **PRS national flag / banner:** Commons file page records Gaspard Drouville's Persian banner drawing, dated 1825 and sourced to *Voyage en Perse* (1825), vol. II, p. 118; PD in Iran. Encyclopaedia Iranica independently confirms early Qajar use of lion-and-sun banners and cites Drouville's 1812–13 observations. Treat as a period banner reference; early Qajar standards were not a single uniform national-flag design.
- **BEL national flag:** Commons constitutional-flag file describes the 1831 Belgian constitutional flag and dates the reconstruction 7 February 1831; PD-ineligible/common-property design. Use the 1831 vertical tricolour reference for 1836, not the horizontal provisional-government flag of 1830.
- **BOL national flag:** Commons file records the Bolivian flag 1826–1851, covering 1 January 1836; public-domain author release, with PD-Bolivia/PD-ineligible tags. Distinguish this flag from the separate Peru–Bolivian Confederation flag (1836–1839).

### CSV state

- CSV rows: **334**.
- Sovereign polity IDs in this dataset: **60**.
- Strict verified sovereign polity count by the register's current non-unknown source/license fields: **23/60**.
- Verified IDs: AFG, BEL, BOL, BRE, CHL, DEN, ECU, GRE, HAW, HAM, HER, LIE, MOR, PEU, PRS, PRU, SAR, SIA, SMR, SPA, SWE, URU, USA.
- CSV blob SHA: `a0b0b685a90837121322694d6a6079750465d35e`.
- The new additions are in existing gap rows where present; two additional asset rows (BEL national_flag and BOL national_flag) were appended. No rows were deleted.

### Still not accepted

- **Sulu:** Commons has an "18th Century Flag of Sulu" file, but its file page lacks a sufficiently clear historical source for the reconstruction; keep candidate, not verified.
- **Sokoto:** Commons itself warns the flag depiction is unconfirmed and lacks source information; do not count.
- **Bukhara:** Commons file's source references a 1929 frontispiece / secondary page; not sufficient to establish the exact 1836 flag. Do not count.
- **Dahomey:** Ghezo banner reconstruction is CC BY-SA 4.0 but no contemporary primary depiction/source was verified in this pass; keep candidate.
- **Vietnam:** a commonly circulated Nguyễn flag file explicitly labels itself fictitious/unofficial; do not use it.
- **Swiss Confederation:** the Swiss Federal Archives says the cross did not become the official national emblem until 1889; the 1815 banner is a historical military/federal symbol, not evidence of an official 1836 national coat of arms.

HY-01 remains OPEN: 23/60 is below the ≥40 sovereign-polity acceptance threshold. Do not start HY-04.


## Additional HY-01 v2 audit — Paraguay and Muscat/Oman (2026-11-22)

- **PAR national flag:** Commons file `Flag of Paraguay (1826-1842).svg` states the period 1826–1842 and the author released it to public domain. FOTW describes the 1826 flag as the blue field with white six-pointed star, while the tricolour remained an alternate; after Francia's death in 1840, garrisons used his blue flag until 1842. For 1 January 1836 use the 1826 blue-star flag as the principal state flag; do not substitute the tricolour alternate.
- **OMA national flag:** Commons `Flag of Muscat.svg` is the plain-red Muscat flag and is released to public domain by its author. Oman's Foreign Ministry confirms the old Omani flag was all red; FOTW reports plain red until 17 December 1970, while noting historical naming/territorial distinctions. Use as a medium-confidence historical reference; do not claim exact 1820 adoption or that it represented the inland Imamate at all times.
- CSV now **336 rows**, strict verified count **25/60**. Verified IDs: AFG, BEL, BOL, BRE, CHL, DEN, ECU, GRE, HAW, HAM, HER, LIE, MOR, OMA, PAR, PEU, PRS, PRU, SAR, SIA, SMR, SPA, SWE, URU, USA.
- CSV blob SHA: `dc4cab15fab492d9bbb24b78ec0e2912208f0219`.
- HY-01 remains OPEN until ≥40 sovereign polities. Do not start HY-04.
