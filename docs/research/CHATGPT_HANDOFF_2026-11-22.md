# ChatGPT research handoff — 2026-11-22

- Working branch: `ccr-b27f3fb8-epfpd6`
- Branch HEAD at handoff: `65567b941b426bb395758c81879833dfb109e63c`
- Scope: research/review deliverables only. No production code was changed by ChatGPT.
- Claude-owned specifications, task register, execution plan and code were not edited.

## Completed and committed

| Task | Deliverable | Commit |
|---|---|---|
| CG-11 | `docs/coordination/reviews/CG_CRITIQUE_CLOCK01_2026-11-22.md` | `61155eed6ea698c14b4e6481ece0682b70cf4231` |
| Official source digest | `docs/research/vic3/SOURCES_1_15_PATCH_NOTES.md` | `b65e9f64a2d50138a5fabdfe4f7202ad50aa9c13` |
| CG-01/03/05 source repair | Replaced SteamDB and generic announcement-index links with official article links | `2ba1aed50945bd80c2bb46b601373cfb42f67f3e`, `d20b44386bc93376840c007a6e7318df17362016`, `2ca9ccd41bd2d98bf313afe7d3886b697e67b55c` |
| CG-01b | `docs/research/vic3/CG01B_MARKET_FORMULAS_VI.md` | `36d597c18881a6ee9726e373c10009360707c6a4` |
| CG-06 | `docs/research/vic3/CG06_DLC_PARITY_LEAVES.csv` (88 leaf rows; includes art/music packs and Century of Strife status) | `c8ca44898960e0cf9486b38a290b6126f78b088f`; corrections `30178d4605ba0fbd41b3536611e8e12edef71e0a`, `65567b941b426bb395758c81879833dfb109e63c` |
| CG-10 revised | `docs/research/media/CG10_ART_DIRECTION_ASSET_TAXONOMY_VI.md` (2D/WebGL only; no 3D models; estimated 3.51–4.87 GB envelope) | `7b743e87d28df3e0364f9486c057b8c73ebf4bce` |

## CG-11 key findings

- P1: backgrounding does not cancel an active Fast Forward operation because `onBackground()` returns while busy.
- P1: controller-side backlog clamps on manual speed changes and AUTO downgrade can silently discard accrued simulation-hour debt.
- P1/P2: Fast Forward yields only after six monthly steps; each `stepMonth()` runs a full month of hourly scheduler iterations on the UI thread.
- P2: controller installs an anonymous document visibility listener with no disposal path.
- P2: exported calendar constructors normalize some invalid day/hour inputs rather than rejecting them.
- No confirmed defect found in the Gregorian leap-year rules, campaign final hour, or documented v2→v3 month-boundary migration. The critique lists additional acceptance tests.

## Source and formula cautions

- The official source digest summarizes/paraphrases the official material and links the complete publisher articles. It intentionally does not reproduce the full copyrighted patch notes.
- DD#151 documents the 1.9 World Market architecture; DD#196 and 1.15.2 are the 1.15 release/hotfix sources.
- Exact 1.15.x Trade Advantage, World Market Access, price-bound, buy/sell response and tariff equations remain `unknown` where official sources do not publish coefficients.
- No SteamDB URL remains in CG-01, CG-03 or CG-05; DD#185 and DD#191 now point to specific official articles.

## Visual reference ZIP — not committed

Owner handoff file created outside the repository:

`/mnt/data/Victoria3_Visual_Reference_Links_2026-11-22.zip`

The ZIP contains a README and an 18-row `manifest.csv` with direct screenshot source links, version confidence and rights classification. **It does not contain image binaries.** The runtime could inspect the remote images but could not download the image files into the archive. The references are mixed-era (1.2, 1.7, 1.9 and unverified), not verified 1.15.1/1.15.2 captures. Do not present this ZIP as the requested complete screenshot archive or ship any referenced images as game assets. A genuine 1.15.x screenshot archive remains blocked pending access to the actual image binaries/captures.

## Remaining work

1. Complete the screenshot archive with real image files and exact version/checksum metadata; prioritize PM/wage, Market/Trade Center, Pop SoL/needs, law checkpoint, War Support/Diplomatic Play, Ship Designer and Power Bloc.
2. If Claude accepts the CG-11 findings, implement and test the fixes in its code branch; ChatGPT has not changed CLOCK-01 code.
3. Hydrogen HY-01..HY-05 remain assigned in Claude's task register; no direct Gemini dispatch was performed in this handoff.

## Open questions / conflicts

- Confirm whether the product contract requires preserving all already-accrued backlog hours across rate changes or explicitly accounting for dropped real-time credit.
- Confirm whether Fast Forward must always cancel on native app pause/process background (recommended: yes).
- Obtain exact 1.15.x screenshots with readable tooltips and exact build/checksum before marking the media request complete.

## Recommended acceptance tests

See the detailed CG-11 review for clock acceptance tests. For the research package: validate CSV row count/columns; open every official source link; verify no SteamDB/generic announcement index remains in CG-01/03/05; keep unknown market formulae unknown; and verify every shipped media file has an explicit redistributable license.
