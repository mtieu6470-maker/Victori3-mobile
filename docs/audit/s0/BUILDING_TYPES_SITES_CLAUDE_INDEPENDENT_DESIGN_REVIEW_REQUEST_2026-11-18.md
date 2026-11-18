# S10–S11 BuildingType, ProductionMethod and BuildingSite — Claude Independent Design Review

**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Review type:** independent no-write design review  
**Date:** 2026-11-18  
**Runtime authorization:** `NONE`

## 1. Review target

- **Design document:** `docs/spec/BUILDING_TYPES_PRODUCTION_METHODS_SITES_PROPOSAL_VI.md`
- **Design commit:** `b1fa6abdeb3609c8acc31206405c05a0ee90898b`
- **Code baseline:** `e4924ca48264f8d0818eface51a28a87cd363b89`
- **Relevant normative roadmap:** `docs/roadmap/DECISIONS_AND_S0_REVISED_VI.v3.2.md`, with owner-approved v3.3 amendments.
- **Related designs:** POP Cohorts `b35c5367cfe41bea3036bec2b846d19060f495c0`; Goods/Markets/Transport revision `98a9aef1356f73004a78590eb45d63321b4b0ee2`.

Fetch exact current branch HEAD and target doc before review. Confirm whether the target is still byte-identical to the stated design revision; if later doc revisions exist, review the actual HEAD and state the exact version inspected.

## 2. Independence and no-write boundary

Claude must be independent and must not have authored or modified the target design. This is no-write review:

- Do not edit the target or related files.
- Do not change code, save schema, historical data, tests, UI, assets, Android or workflows.
- Do not create a fix commit, branch or PR.
- Do not run build/APK or install anything.
- Do not implement S10/S11 or open any later phase.

If a required correction exists, report it with exact section/line locators and return `CHANGES_REQUESTED`.

## 3. Required review

### A. Code baseline accuracy

Verify against:
- `src/engine/types.ts` — `Building`, `Region.buildings`, `GameState`.
- `src/engine/init.ts:66–90` — legacy initial building heuristics.
- `src/engine/systems/economy.ts:12–23` — fixed recipes and level workers.
- `src/engine/systems/economy.ts:90–97` — factory worker allocation.
- `src/engine/systems/economy.ts:253–307` — immediate build and expected-return investment.
- `src/engine/save.ts` — current version-1 save boundary.

Confirm the proposal accurately labels initial region-level building counts as heuristics/aggregates, not identified historical facilities.

### B. Owner-approved BuildingSite invariants

Check exact compliance with roadmap §3.4, §3.4.1 and §3.4.2:
- sparse grouping and identity key;
- opaque/stable site IDs;
- levels_built/status-bucket equation;
- mutually exclusive damage/closed/input-short/understaffed/active states and priority;
- under-construction levels derived from ConstructionProject, excluded from built;
- whole-site PM change preserves ID;
- partial PM change creates new ID + lineage;
- merge retains older ID, tombstones other ID and redirects references;
- no destructive re-key.

Flag any discrepancy as blocking.

### C. False historical precision / legacy migration

Assess:
- Is the distinction between `Region.buildings` aggregate and real facility/site identity adequate?
- Does `region_aggregate_legacy` preserve level totals without inventing site names, coordinates, owners, historical output or workers?
- Is `legacy_unspecified` PM/fallback safe and clearly labelled?
- Are settlement/facility references and crosswalks sufficiently grounded?
- Are source quality, temporal validity and global (non-European) industrial/agrarian contexts adequately covered?

### D. ProductionMethod and physical accounting

Review:
- BuildingType vs ProductionMethod vs BuildingSite separation.
- Monthly per-level canonical unit contract from S7.
- Multiple inputs/outputs and by-products.
- Input allocation and actual output settlement through S7.
- Dependency graph/cycle handling and deterministic bounds.
- Resource/site potential is not built capacity and cannot create free output.
- Technology/PM validity and diffusion boundaries with S9.

### E. System-phase boundaries

Confirm no accidental scope leakage:
- S11 must not claim real hiring/firing/wages before S12.
- S11 must not invent firms/ownership/profit/dividends before S13.
- S11 must not implement construction queues/instant-to-timed projects before S14.
- Workforce template is not an employment ledger.
- The pre-S1 proposal does not authorize code or runtime work.

### F. Performance and tests

Assess actual 662-region/site count, sparse storage, save footprint, PM/site churn, map LOD, Android p95/p99 tick and multi-decade scenarios. Identify missing test cases for split/merge, tombstone references, unknown PMs, construction references, legacy save migration and status invariants.

## 4. Required verdict

Return exactly one:
- `REVIEW_PASS`
- `CHANGES_REQUESTED`
- `BLOCKED`

Provide exact reviewed HEAD and doc blob, severity-ranked findings with evidence/locators, non-blocking recommendations separately, and explicit no-write confirmation.

## 5. Gate boundary

A review pass here applies only to this design document. It does not satisfy S0-B7 review, owner acceptance or S1-entry signoff. It does not open S1, S10, S11, S12, S13 or S14, nor authorize any runtime/data/save/test/UI/Android/APK change.
