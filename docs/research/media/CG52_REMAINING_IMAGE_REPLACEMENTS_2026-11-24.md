# CG-52 — Recheck four remaining story-image subjects

Date: 2026-11-24  
Repository: `mtieu6470-maker/Victori3-mobile`  
Branch: `ccr-b27f3fb8-epfpd6`  
Branch HEAD observed before this report: `901d2d7bf8fb0f9c5362cee05c8a5599aad490c4`

## Executive result

The board's MSG-124 count (84/88) is stale relative to the branch contents inspected for this report. The current `historical_data/assets/illustration_assets.json` contains assets for three of the four named subjects:

| Subject | Current manifest state | Current asset source |
|---|---|---|
| `gbr_egypt_treaty_1936` | Present | `General map of Cairo. LOC 2009580102.jpg`, 1920 |
| `gbr_jamaica_independence_1962` | Present | `Map of Jamaica (1888).jpg` |
| `gbr_kenya_independence_1963` | Present | `Map of East Africa Protectorate and Uganda (1898).png` |
| `gbr_singapore_fall_1942` | **Missing** | Candidate is already primary in `story_selection.json`, but no manifest asset yet |

The manifest is therefore at **87/88** for the authored story-event set, not 84/88. No existing manifest entry or selection was edited by ChatGPT.

## 1. Singapore — outstanding ingestion candidate

**Recommended primary:** `Japanese Soldiers rejoicing at the fall of Singapore, 1942.jpg`

- Commons page: https://commons.wikimedia.org/wiki/File:Japanese_Soldiers_rejoicing_at_the_fall_of_Singapore,_1942.jpg
- Direct original: https://upload.wikimedia.org/wikipedia/commons/f/f0/Japanese_Soldiers_rejoicing_at_the_fall_of_Singapore%2C_1942.jpg
- Depiction/date: Asahi Shimbun photograph, 16 February 1942; Japanese Independent Engineer Regiment No. 15 celebrating the fall of Singapore. It is directly relevant to the event, rather than a generic map.
- Original dimensions: **7,883 × 6,948 px**.
- Rights shown on the current Commons page (checked 2026-11-24): `PD-Japan-oldphoto` and `PD-1996 (with a reason)`. The page explains that the photograph is public domain in Japan under the former Japanese Copyright Act and in the United States because the Japanese copyright expired by 1970 and was not restored under URAA.
- Pipeline fit: the current `loc_ingest.py` accepts a PD template and separately requires a US-PD basis for post-1930 dated works. The Commons page now visibly supplies both PD-Japan-oldphoto and PD-1996. The existing `story_selection.json` primary filename already matches this candidate, so no selection edit is required.
- Recommended next action for Claude: run the normal `--resume` ingestion for this subject, inspect the tool's rights re-read result, then confirm the asset appears in `illustration_assets.json`. Do not bypass the gate if the live wikitext re-read disagrees with the displayed page.

**Do not fall back to** `Singapore 1942.jpg` unless needed: it is only 799 × 544 px. Its Commons page also shows PD-Japan-oldphoto and PD-1996, but it is much lower resolution than the recommended image.

## 2. Optional quality upgrades for the three subjects already ingested

These are not blockers for the 87/88 status. They are better or more varied alternatives to the current contextual maps, should Claude decide that the visual repetition/quality warrants replacing them.

### Egypt treaty, 1936

**Candidate:** `Plan général de la Ville du Caire … btv1b53099635v.jpg`

- Commons page: https://commons.wikimedia.org/wiki/File:Plan_g%C3%A9n%C3%A9ral_de_la_Ville_du_Caire_-_Dress%C3%A9_et_publi%C3%A9_avec_l%27autorisation_de_S.A._Ismail_Pacha_Kh%C3%A9dive_d%27Egypte_par_P._Grand_Bey..._Echelle_de_1_%C3%A0_4000_%3B_Grav%C3%A9_par_Erhard_-_btv1b53099635v.jpg
- Direct original: https://upload.wikimedia.org/wikipedia/commons/4/42/Plan_g%C3%A9n%C3%A9ral_de_la_Ville_du_Caire_-_Dress%C3%A9_et_publi%C3%A9_avec_l%27autorisation_de_S.A._Ismail_Pacha_Kh%C3%A9dive_d%27Egypte_par_P._Grand_Bey..._Echelle_de_1_%C3%A0_4000_%3B_Grav%C3%A9_par_Erhard_-_btv1b53099635v.jpg
- Date/creator: 1874; engraved by Georges Erhard (1821–1880), text attributed to Pierre Grand Bey / Ebner & Cie; BnF, département Cartes et plans, GE C-10010.
- Original dimensions: **17,986 × 14,307 px**.
- Rights: Commons states PD in France and PD in the US because published before 1 January 1931. Attribution remains appropriate for French moral rights.
- Use: a detailed period plan of Cairo; still contextual, not a depiction of the treaty signing. It can replace the current 1920 Cairo map if the project wants a distinct and much larger historical source.

### Jamaica independence, 1962

**Recommended quality upgrade:** `A. Duperly & Sons - King Street Looking North, Kingston, Jamaica, ca 1900 3003553267.jpg`

- Commons page: https://commons.wikimedia.org/wiki/File:A._Duperly_%26_Sons_-_King_Street_Looking_North,_Kingston,_Jamaica,_ca_1900_3003553267.jpg
- Direct original: https://upload.wikimedia.org/wikipedia/commons/a/ab/A._Duperly_%26_Sons_-_King_Street_Looking_North%2C_Kingston%2C_Jamaica%2C_ca_1900_3003553267.jpg
- Creator/date: Adolphe Duperly & Sons; before 1922; Caribbean Photo Archive source record.
- Original dimensions: **2,048 × 1,548 px**.
- Rights: Commons states PD in the US (published before 1 January 1931) and PD in Jamaica/US under its author-death and publication/URAA rationale.
- Use: real street photograph, more visually informative than the current 1888 parish map. It is contextual imagery for Kingston/Jamaica, not a photograph of the 1962 independence ceremony.

### Kenya independence, 1963

**Recommended quality upgrade:** `Provisional map of East Africa protectorate - btv1b53063817p.jpg`

- Commons page: https://commons.wikimedia.org/wiki/File:Provisional_map_of_East_Africa_protectorate_-_btv1b53063817p.jpg
- Direct original: https://upload.wikimedia.org/wikipedia/commons/7/7d/Provisional_map_of_East_Africa_protectorate_-_btv1b53063817p.jpg
- Date/creator: 1910; Ordnance Survey (GB); prepared and printed at the Ordnance Survey Office, Southampton; BnF, département Cartes et plans, GE C-4237.
- Original dimensions: **8,920 × 9,368 px**.
- Rights: Commons states PD in the US because published before 1 January 1931, and PD in France under the listed term rules.
- Use: high-resolution historical map of the East Africa Protectorate. It is a contextual map, not a photograph of the 1963 flag-raising. The existing 1898 map currently in the manifest is only **640 × 590 px**, so this is a substantial resolution upgrade. Use `fit: contain` to preserve the whole map.

## 3. Rights and implementation guardrails

- These are research recommendations, not an assertion that the project has ingested or visually approved the alternatives.
- The three existing assets stay untouched. Claude owns `story_selection.json`, the ingester, the manifest, binary assets and final visual acceptance.
- For Singapore, the filename is already selected. Re-run the live Commons rights check; the current page explicitly shows both the Japan and US public-domain bases. If the raw template check fails, leave it pending and report the exact parser failure rather than weakening the rights gate.
- The three optional upgrades are supplied to reduce map repetition and replace the low-resolution Kenya source; they are not required to close the one missing asset.

## Verification performed

- Fetched the branch and observed HEAD `901d2d7bf8fb0f9c5362cee05c8a5599aad490c4`.
- Parsed the current `illustration_assets.json` and `story_selection.json` for the four exact event subjects.
- Opened the four Commons file pages and inspected the current rights statements, dates, authors/repositories and original dimensions.
- Did not download, commit or ingest any binary image; did not modify gameplay data or the selection/manifest files.
