# ChatGPT handoff — CG-12 to CG-15 (2026-11-22)

- Repository: `mtieu6470-maker/Victori3-mobile`
- Working branch: `ccr-b27f3fb8-epfpd6`
- HEAD at handoff: `8881cd52831f372c8e8560120ad65877af527fed`
- Source instructions read on this branch:
  - `docs/coordination/AI_TASK_ASSIGNMENTS.md` — section “Đợt giao việc 2”
  - `docs/coordination/reviews/CLAUDE_RESPONSE_CG11_CLOCK01_2026-11-22.md`
- No production code changed. No Claude-owned task register or response file was edited.

## Completed

| Task | Output | Commit |
|---|---|---|
| CG-12 P0 | `docs/coordination/reviews/CG_CRITIQUE_CLOCK01_FIXES_2026-11-22.md` | `bdcaaf0b8b3e0b6731c3f36ed40d3369d5137f7c` |
| CG-13 P0 | `docs/research/history/CG13_1836_PRICES_WAGES_BASKETS_SOURCES_VI.md` | `d9527caac22e0d040028e7a7e11c799bdad59163`; source correction `8881cd52831f372c8e8560120ad65877af527fed` |
| CG-14 P1 | `docs/research/vic3/CG14_GOODS_TAXONOMY_PROPOSAL_VI.md` | `d99b75f603b72e31d1372077e16f877aa3cb7a90` |
| CG-15 P1 | `docs/research/media/CG15_HYDROGEN_DISPATCH_2026-11-22.md` | `0e42cc8c9d1d4bb5c9a59a860640344d43bc01a1` |

## CG-12 result

- Four original CG-11 findings are verified fixed: background cancellation, owed-hour preservation, hour-granular fast-forward structure, and strict calendar input validation.
- CG11-03's listener cleanup is improved, but new P2 issue remains: disposed controller can be reused; `setPaused(false)` can restart RAF and `fastForward()` can run after disposal because public entry points and `start()` do not guard `disposed`.
- Secondary non-blocking items: backlog comments still imply a hard total cap although existing debt can exceed it after rate changes; controller fast-forward test mocks `advanceHours` and does not invoke `shouldYield`; toast timers are not cleared on dispose.
- No code changes made. Review is advisory and requires Claude's response.

## CG-13 result

The source register distinguishes broad dataset date ranges from exact 1836 observations and records units, geography, frequency and license status. Main source findings:
- GPIH provides extensive multi-region price/wage/basket discovery, but each workbook must be checked for exact year/commodity/city coverage; no blanket open license was identified.
- Allen–Unger provides historical commodity price series across many locations through 1914; exact observation and unit are series-specific; the dataset's primary record did not expose a clear standard CC license in the inspected metadata.
- Gregory Clark provides England wage and 22 farm-product price series spanning 1836; exact workbook rows/frequency still require file-level validation; no blanket redistribution license identified.
- Allen's welfare-ratio work is a method/source framework, not an open universal data panel; institutional/wholesale/retail price distinctions and household assumptions must be preserved.
- Mitchell IHS is a copyrighted reference work; do not copy its tables into distributed game data.
- The register includes an explicit regional coverage matrix and a provenance-rich schema for POP-02/ECON-02.

## CG-14 result

The project-specific proposal defines a multi-era taxonomy, not copied from Victoria 3. It covers food, textiles, housing, energy, minerals, chemicals, capital equipment, transport, durable electronics, healthcare, education, communications and services. Each row has a stable ID, need group, conditional substitutes, broad technology era and physical/throughput unit. The proposal also separates raw/intermediate/consumer/capital goods from services and technology gates.

## CG-15 result and blocker

- The current branch's media directory had no HY-01 or HY-04 deliverable files.
- A complete dispatch brief was committed with exact CSV schemas, rights rules, source discovery links, acceptance gates and forwardable instructions.
- **Hydrogen was not directly messaged or assigned through an external connector:** no Gemini/Hydrogen messaging tool is available in this session. The dispatch document is prepared for the owner to forward. Do not mark HY-01/HY-04 complete until Hydrogen commits the requested files and reports SHAs.
- Required Hydrogen order: HY-01 flags/heraldry 1836 → HY-04 map sources → HY-02 portraits → HY-03 audio → HY-05 building/ship references.
- P3 1.15.x tooltip screenshots remain deferred per the assignment register.

## Open questions / conflicts

- Claude should decide whether to accept/fix CG12-01 before CLOCK-01 is called fully reviewed.
- CG-13 source datasets have uneven coverage and uncertain redistribution rights; no raw source workbook should be bundled into the APK without license verification.
- HY-01 polity coverage depends on registry IDs and dated source evidence; HY-04 historical boundaries need item-level rights and CRS/scale documentation.
- This handoff records ChatGPT's review/research outputs; it does not claim Hydrogen has received the task or completed its files.

## Recommended acceptance tests

1. Verify the four output paths exist on `ccr-b27f3fb8-epfpd6` and compare their commit history.
2. Claude responds to CG12-01 with accept/reject and reason; if accepted, add post-dispose regression tests.
3. CG-13 ingestion stores source units and geography levels and leaves unverified exact 1836 observations unknown.
4. CG-14 validates unique IDs, units, era gates and substitution conditions.
5. Hydrogen's HY-01/HY-04 CSVs reconcile with the registry and contain item-level license and provenance evidence before acceptance.
