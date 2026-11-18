# S20–S21 Military Organization and Operations — Claude Independent Design Review

**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Review type:** independent no-write design review  
**Date:** 2026-11-18  
**Runtime authorization:** `NONE`

## 1. Review target

- **Design:** `docs/spec/MILITARY_ORGANIZATION_OPERATIONS_LOGISTICS_PROPOSAL_VI.md`
- **Design commit:** `a82d59bcc01e6a57163f7acedd4930132f0767f5`
- **Code baseline:** `e4924ca48264f8d0818eface51a28a87cd363b89`
- **Related designs:** POP Cohorts `b35c5367cfe41bea3036bec2b846d19060f495c0`, S7–S8 `98a9aef1356f73004a78590eb45d63321b4b0ee2`, S15–S17 `207722d612354f4d1bccc74064d24616efa4511a`, S18–S19 `8f01556bd70fed05be6f880f287a0f3691cd7674`.

Fetch exact current HEAD and verify the document blob before review.

## 2. Independence/no-write

Claude must not have authored or modified this design. No writes, fixes, branches, PRs, builds, APKs or code/data implementation during review. If changes are required, return `CHANGES_REQUESTED` with exact locators.

## 3. Review areas

### A. Baseline characterization
Verify:
- `src/engine/types.ts` Army/Navy aggregate fields and War model.
- `src/engine/systems/military.ts` manpower target, armyStrength/navalStrength, frontTargets, battle/occupation/war score/endWar.
- `src/engine/systems/diplomacy.ts` participant snapshot and war declaration.
- `src/engine/save.ts` version-1 save and absent migration chain.
Confirm no source-backed unit/commander/location history exists in the old save.

### B. S20 force organization
- Is LegacyForcePool migration safe and non-fabricating?
- Are population recruitment/reserve/demobilization mass-balanced?
- Are professional, conscript, levy, retinue, militia, irregular, mercenary, auxiliary and naval models sufficiently differentiated?
- Are equipment and supplies tied to S7 material accounting?
- Are commanders linked through S16 appointments?
- Are organization models date-valid and globally diverse?
- Is aggregation sparse enough for mobile performance?

### C. S21 operations and logistics
- Do units move only over valid S8 routes and consume time/capacity?
- Are supply depots, in-transit stock, attrition and interdiction conserved?
- Is front/operation state coherent for 662 Strategic Regions?
- Are battles limited to units actually in the engagement area?
- Are siege, occupation, owner/controller and civilian effects distinct?
- Are blockade, convoy loss and amphibious operations feasible with S8 logistics?
- Does peace settlement consume S18 treaty/authority rules instead of applying goals automatically?

### D. Determinism, save and global fidelity
Check route tie-breaks, movement/retreat/target RNG, unit ID stability, save/load mid-operation, and broad polity/time-period suitability. Assess whether old aggregate saves can remain functional without inventing formation positions or commanders.

### E. Performance/test coverage
Assess active units/fleets/fronts/operations, route search p95/p99, monthly combat/supply CPU, save size, memory growth, map LOD and multi-war stress.

## 4. Required verdict

Return exactly one: `REVIEW_PASS`, `CHANGES_REQUESTED` or `BLOCKED`.

Include exact reviewed HEAD/target blob, severity-ranked findings with evidence/locators, non-blocking recommendations and no-write confirmation.

## 5. Gate boundary

A pass applies only to this design. It does not satisfy S0-B7 review/owner acceptance or open S1/S20/S21. No runtime/data/save/test/UI/Android/APK work is authorized.
