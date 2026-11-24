

## 2026-11-24 — CG-64 ChatGPT story data import review

- Source branch `ccr-b27f3fb8-epfpd6` was 37 commits ahead / 0 behind the integration branch; diff contained documentation and historical data only. Integration branch was fast-forwarded to `d877a3ffd71e84726098b4a58ae8f5f404036351` (no force push).
- Imported packs: FRA 59/6 journals; JAP 53/6; QNG 51/4; RUS 54/5; VNM 48/5 = **265 events, 26 journals, 530 options**. Static cross-reference and modifier audit found no unknown entity/region/source refs or duplicate IDs. 106 image candidates are not ingested binaries.
- **Blocking defect:** engine journal monthly progress re-awards persistent `event_fired` milestones every month. 102 such progress steps were found in FRA/JAP/VNM. QNG/RUS use time-based progress and avoid this defect. Claude must implement one-shot milestone semantics with tests or a reviewed equivalent; do not silently replace historical milestones with arbitrary time progression.
- **Scheduler caveat:** 187 events have mid-month `fire_date`; engine evaluates them only during monthly ticks. Test delay and availability/entity-lifetime boundaries, especially QNG 1912-02-12 and RUS 1917-03-15.
- Static audit only. No data/content builders, tests, simulation, Android build, APK or device QA run. No CI status checks were reported for this HEAD at review time. Not release-ready.
- Detailed review: `docs/research/history/CG64_CHATGPT_IMPORT_REVIEW_2026-11-24_VI.md` (commit `010a1314f745346719f40bc70496d4929618d36c`).
- MSG-129 remains IN_PROGRESS; next content countries: PRU → USA → TUR.
